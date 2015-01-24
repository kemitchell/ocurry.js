// objectcurry.js 0.0.1
// ====================
// https://github.com/kemitchell/objectcurry.js

(function(root) {
  // Factory to create the exported function
  var factory = function() {
    // Utility Functions
    // -----------------

    var merge = function(destination, source) {
      Object.keys(source).forEach(function(key) {
        if (destination.hasOwnProperty(key)) {
          throw new Error(
            'argument property "' + key + '" already curried'
          );
        } else {
          destination[key] = source[key];
        }
      });
      return source;
    };

    // Exported Function
    // -----------------

    var objectcurry = function(
      theFunction, curriedArguments, requiredArgumentsArray
    ) {
      // TODO: Throw on invoke if shadowing curried argkey
      var returnedFunction = function() {
        var objectArgument = arguments[0] || {};

        // Required Arguments Check

        var requiredArguments = returnedFunction.requiredArguments;
        if (requiredArguments) {
          requiredArguments.forEach(function(requiredKey) {
            if (!objectArgument.hasOwnProperty(requiredKey)) {
              throw new Error(
                'missing required argument property "' + requiredKey + '"'
              );
            }
          });
        }

        // Curried Argument Conflict Check

        Object.keys(returnedFunction.curriedArguments)
          .forEach(function(key) {
            if (objectArgument.hasOwnProperty(key)) {
              throw new Error(
                'argument property "' + key + '" was curried'
              );
            }
          });

        // Invocation

        merge(objectArgument, returnedFunction.curriedArguments);
        theFunction.apply(root, arguments);
      };

      // Curried Arguments Object

      if (theFunction.curriedArguments) {
        returnedFunction.curriedArguments = merge(
          curriedArguments, theFunction.curriedArguments
        );
      } else {
        returnedFunction.curriedArguments = curriedArguments;
      }

      // Required Arguments Array

      if (requiredArgumentsArray || theFunction.requiredArguments) {
        if (requiredArgumentsArray && theFunction.requiredArguments) {
          throw new Error(
            'function already has a required argument properties array'
          );
        } else {
          returnedFunction.requiredArguments =
            (requiredArgumentsArray || theFunction.requiredArguments)
              .filter(function(key) {
                return !curriedArguments.hasOwnProperty(key);
              });
        }
      }
      return returnedFunction;
    };

    return objectcurry;
  };

  // Universal Module Definition
  // ---------------------------

  var MODULE_NAME = 'objectcurry';

  /* globals define, module */
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(MODULE_NAME, [], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory.call(this);
  } else {
    this[MODULE_NAME] = factory.call(this);
  }
})(this);
