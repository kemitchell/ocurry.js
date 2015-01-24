/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var ocurry = require('..');

describe('README Example', function() {
  it('produces advertised results', function() {
    // Function that takes an object of argument-properties
    var request = function(args) {
      return args.protocol + ' ' +
        args.method + ' ' +
        args.host +
        args.path;
    };

    var http = ocurry(
      // Function to curry
      request,
      // Named arguments to curry
      { protocol: 'HTTP' },
       // (Optional) required named arguments
      [ 'protocol', 'method', 'host', 'path' ]
    );

    expect(function() {
      http({ path: '/some/resource' });
    }).to.throw(Error);

    var fromLocalhost = ocurry(http, { host: 'localhost' });

    expect(fromLocalhost.curried)
      .to.eql({ protocol: 'HTTP', host: 'localhost' });

    expect(fromLocalhost.required)
      .to.eql([ 'method', 'path' ]);

    expect(function() {
      fromLocalhost({ path: '/some/resource' });
    }).to.throw(Error);

    var getFromLocalhost = ocurry(fromLocalhost, { method: 'GET' });

    expect(getFromLocalhost.curried)
      .to.eql({ protocol: 'HTTP', host: 'localhost', method: 'GET' });

    expect(getFromLocalhost.required)
      .to.eql([ 'path' ]);

    expect(function() {
      getFromLocalhost();
    }).to.throw(Error);

    expect(getFromLocalhost({ path: '/some/resource' }))
      .to.equal('HTTP GET localhost/some/resource');
  });
});
