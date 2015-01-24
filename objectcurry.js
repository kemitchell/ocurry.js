// objectcurry.js 0.0.1
// ====================
// https://github.com/kemitchell/objectcurry.js

(function(root) {
  // Factory to create the exported function
  var factory = function() {
    // Merge one object's properties into another, throwing an error if
    // there is any conflict.
    var cleanMerge = function(destination, source) {
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
      // The function to curry, which takes an object whose properties
      // are treated as named arguments.
      theFunction,
      // An object with properties to curry.
      curriedArguments,
      // An optional array of property keys to require.
      requiredArgumentsArray
    ) {
      // If there are neither properties to curry nor requirements to
      // impose, just return the function as it is.
      if (
        (
          !curriedArguments ||
          Object.keys(curriedArguments) === 0
        ) &&
        !requiredArgumentsArray
      ) {
        return theFunction;
      }

      // The curried function to be returned.
      var returnedFunction = function() {
        var objectArgument = arguments[0] || {};

        // Check that all required argument properties, if any, have
        // been provided, either curried or on this invocation.
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

        // Invoke the provided function with a merger of the curried
        // argument properties and the arguments object provided on this
        // invocation. Throw an error if the arguments object has any
        // properties that have already been curried.
        cleanMerge(objectArgument, returnedFunction.curriedArguments);
        return theFunction.apply(root, arguments);
      };

      // TODO: Don't create a new function if it is already curried.

      // Store an object containing all curried argument propties on the
      // curried function that is returned.
      if (theFunction.curriedArguments) {
        returnedFunction.curriedArguments = cleanMerge(
          curriedArguments, theFunction.curriedArguments
        );
      } else {
        returnedFunction.curriedArguments = curriedArguments;
      }

      // Store an array containing the keys for all required argument
      // object properties on the curried function that is returned.
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
