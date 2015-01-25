// ocurry.js 0.0.1
// ===============
// License &c. available at https://github.com/kemitchell/ocurry.js

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

    // Given a list of required argument-properties and an object
    // containing curried object-properties, return an array of
    // argument-property keys of required properties remaining to be
    // curried or passed.
    var remainingRequired = function(required, curried) {
      return required.filter(function(key) {
        return !curried.hasOwnProperty(key);
      });
    };

    // Exported Function
    // -----------------

    // Curry named-argument functions.
    var ocurry = function(
      // The function to curry, which takes an object whose properties
      // are treated as named arguments.
      theFunction,
      // An object with properties to curry.
      curriedArguments,
      // An optional array of required argument property keys.
      newRequirements
    ) {
      // ### Shortcut Cases

      // If there are neither properties to curry nor requirements to
      // impose, just return the function as it is.
      if (
        (!curriedArguments || Object.keys(curriedArguments) === 0) &&
        !newRequirements
      ) {
        return theFunction;

      // If the function has already been curried, curry again by
      // changing metadata, rather than by returning a new function.
      } else if (theFunction.curried) {
        if (curriedArguments) {
          cleanMerge(theFunction.curried, curriedArguments);
        }
        if (newRequirements) {
          if (theFunction.required.length === 0) {
            theFunction.required = newRequirements;
          } else {
            throw new Error(
              'function already has a required properties array'
            );
          }
        }
        theFunction.required = remainingRequired(
          theFunction.required, theFunction.curried
        );
        return theFunction;

      // ### Curried Function Wrapping
      } else {
        // The curried function to be returned.
        var returnedFunction = function() {
          var objectArgument = arguments[0] || {};

          // Check that all required argument properties, if any, have
          // been provided, either curried or on this invocation.
          var requiredKeys = returnedFunction.required;
          if (requiredKeys.length > 0) {
            requiredKeys.forEach(function(requiredKey) {
              if (!objectArgument.hasOwnProperty(requiredKey)) {
                throw new Error(
                  'missing argument property "' + requiredKey + '"'
                );
              }
            });
          }

          // Invoke the provided function with a merger of the curried
          // argument properties and the arguments object provided on
          // this invocation. Throw an error if the arguments object has
          // any properties that have already been curried.
          cleanMerge(objectArgument, returnedFunction.curried);
          return theFunction.apply(root, arguments);
        };

        // Store an object containing all curried argument propties on
        // the curried function that is returned.
        returnedFunction.curried = curriedArguments || {};

        // Store an array containing the keys for all required argument
        // object properties on the curried function that is returned.
        if (newRequirements) {
          returnedFunction.required =
            remainingRequired(newRequirements, curriedArguments || {});
        } else {
          returnedFunction.required = [];
        }

        return returnedFunction;
      }
    };

    return ocurry;
  };

  // Universal Module Definition
  // ---------------------------

  var MODULE_NAME = 'ocurry';

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
