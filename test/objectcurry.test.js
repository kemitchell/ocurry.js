/* jshint node: true, mocha: true */
var expect = require('chai').expect;

var curry = require('..');

var noop = function() {
  return;
};

describe('objectcurry', function() {
  it('returns functions', function() {
    expect(curry(noop, { characters: 'a' })).to.be.a('function');
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

  it('stores uncurried argument keys on .requiredArguments', function() {
    expect(curry(noop, { a: 1 }, [ 'a', 'b' ]).requiredArguments)
      .to.eql([ 'b' ]);
  });

  it('stores curried properties on .curriedArguments', function() {
    expect(curry(noop, { first: 'curried' }).curriedArguments)
      .to.eql({ first: 'curried' });
  });

  it('prevents invocation without required properties', function() {
    expect(curry(noop, {}, [ 'required' ]))
      .to.throw(/missing/);
  });

  it('prvents shadowing of curried properties', function() {
    expect(function() {
      curry(noop, { first: 'curried' })({ first: 'different' });
    }).to.throw(/was curried/);
  });

  it('successively reduces function.requiredArguments', function() {
    expect(
      curry(
        curry(noop, { a: 1 }, [ 'a', 'b' ]),
        { b: 2 }
      ).requiredArguments
    )
      .to.eql([]);
  });

  it('prevents currying the same property twice', function() {
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
        curry(noop, { a: 1 }, [ 'a' ]),
        { c: 3 }, [ 'c' ]
      );
    }).to.throw(/already has a required argument properties array/);
  });
});
