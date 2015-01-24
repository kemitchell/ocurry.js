/* jshint node: true, mocha: true */
var expect = require('chai').expect;

var curry = require('..');

var noop = function() {
  return;
};

var sum = function(arg) {
  return Object.keys(arg).reduce(function(sum, key) {
    return sum + arg[key];
  }, 0);
};

describe('objectcurry', function() {
  it('returns functions', function() {
    expect(curry(noop, { characters: 'a' }))
      .to.be.a('function');
  });

  it('can enforce requirements without curring properties', function() {
    expect(curry(noop, false, [ 'a' ]).required)
      .to.eql([ 'a' ]);
  });

  it('merges curried properties with arguments', function() {
    curry(
      function(arg) {
        expect(arg.first)
          .to.equal('curried');
        expect(arg.second)
          .to.equal('from call');
      },
      { first: 'curried' }
    )({ second: 'from call' });
  });

  it('can enforce requirements on curried functions', function() {
    expect(
      curry(
        curry(noop, { a: 1 }),
        {}, [ 'a', 'b' ]
      )
      .required
    )
      .to.eql([ 'b' ]);
  });

  describe('optimization', function() {
    it('returns functions as-is when possible', function() {
      expect(curry(noop))
        .to.equal(noop);
    });

    it('reuses curried function wrappers', function() {
      var firstCurried = curry(noop, { a: 1 });
      expect(curry(firstCurried, { b: 2 }))
        .to.equal(firstCurried);
    });
  });

  it('permits entirely curried invocation', function() {
    expect(curry(sum, { a: 10 }, [ 'a', 'b' ])({ b: 10 }))
      .to.equal(20);
  });

  describe('metadata properties', function() {
    it('stores required argument property keys on .required', function() {
      expect(curry(noop, { a: 1 }, [ 'a', 'b' ]).required)
        .to.eql([ 'b' ]);
    });

    it('stores curried argument properties on .curried', function() {
      expect(curry(noop, { first: 'curried' }).curried)
        .to.eql({ first: 'curried' });
    });

    it('successively reduces required arguments', function() {
      expect(
        curry(
          curry(noop, { a: 1 }, [ 'a', 'b' ]),
          { b: 2 }
        ).required
      )
        .to.eql([]);
    });
  });

  describe('errors', function() {
    it('prevent invocation without required properties', function() {
      expect(curry(noop, {}, [ 'required' ]))
        .to.throw(/missing argument property/);
    });

    it('prvent shadowing of curried properties', function() {
      expect(function() {
        curry(noop, { a: 1 })({ a: 2 });
      })
        .to.throw(/already curried/);
    });

    it('prevent currying the same property twice', function() {
      expect(function() {
        curry(
          curry(noop, { a: 1 }),
          { a: 1 }
        );
      }).to.throw(/already curried/);
    });

    it('prevents setting different required arguments', function() {
      expect(function() {
        curry(
          curry(noop, { b: 1 }, [ 'a' ]),
          null, [ 'c' ]
        );
      }).to.throw(/already has a required properties array/);
    });
  });
});
