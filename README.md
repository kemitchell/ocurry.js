ocurry.js
=========

[![npm version](https://img.shields.io/npm/v/ocurry.svg)](https://www.npmjs.com/package/ocurry)
[![Bower version](https://img.shields.io/bower/v/ocurry.svg)](http://bower.io/search/?q=ocurry)
[![build status](https://img.shields.io/travis/kemitchell/ocurry.js.svg)](http://travis-ci.org/kemitchell/ocurry.js)

Curry named-argument functions

Usage
-----

```javascript
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

http({ path: '/some/resource' });
// -> throws an error

var fromLocalhost = ocurry(http, { host: 'localhost' });

fromLocalhost({ path: '/some/resource' });
// -> throws an error

var getFromLocalhost = ocurry(fromLocalhost, { method: 'GET' });

getFromLocalhost();
// -> throws an error

getFromLocalhost({ path: '/some/resource' });
// -> returns 'HTTP GET localhost/some/resource'
```

Documentation
-------------

Comments to the source are [Docco](http://jashkenas.github.io/docco/)-compatible. To generate an annotated source listing for browsing:

```bash
npm --global install docco
docco --output docs ocurry.js
```

License
-------

See [LICENSE.md](./LICENSE.md).
