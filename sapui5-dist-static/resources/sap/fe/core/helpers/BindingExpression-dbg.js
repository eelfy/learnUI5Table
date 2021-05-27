sap.ui.define(["./AnnotationEnum"], function (AnnotationEnum) {
  "use strict";

  var _exports = {};
  var resolveEnumValue = AnnotationEnum.resolveEnumValue;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Check two expressions for (deep) equality.
   *
   * @param a	- expression
   * @param b - expression
   * @returns {boolean} true if the two expressions are equal
   */
  function expressionEquals(a, b) {
    if (a._type !== b._type) {
      return false;
    }

    switch (a._type) {
      case "Constant":
      case "EmbeddedBinding":
      case "EmbeddedExpressionBinding":
        return a.value === b.value;

      case "Not":
        return expressionEquals(a.operand, b.operand);

      case "Set":
        return a.operator === b.operator && a.operands.length === b.operands.length && a.operands.every(function (expression) {
          return b.operands.some(function (otherExpression) {
            return expressionEquals(expression, otherExpression);
          });
        });

      case "IfElse":
        return expressionEquals(a.condition, b.condition) && expressionEquals(a.onTrue, b.onTrue) && expressionEquals(a.onFalse, b.onFalse);

      case "Comparison":
        return a.operator == b.operator && expressionEquals(a.operand1, b.operand1) && expressionEquals(a.operand2, b.operand2);

      case "Concat":
        var aExpressions = a.expressions;
        var bExpressions = b.expressions;

        if (aExpressions.length !== bExpressions.length) {
          return false;
        }

        return aExpressions.every(function (expression, index) {
          return expressionEquals(expression, bExpressions[index]);
        });

      case "Binding":
        return a.modelName === b.modelName && a.path === b.path && a.targetEntitySet === b.targetEntitySet;

      case "DefaultBinding":
        return a.modelName === b.modelName && a.path === b.path;

      case "Formatter":
        return a.fn === b.fn && a.parameters.length === b.parameters.length && a.parameters.every(function (value, index) {
          return expressionEquals(b.parameters[index], value);
        });

      case "ComplexType":
        return a.type === b.type && a.bindingParameters.length === b.bindingParameters.length && a.bindingParameters.every(function (value, index) {
          return expressionEquals(b.bindingParameters[index], value);
        });

      case "Function":
        var otherFunction = b;

        if (a.obj === undefined || otherFunction.obj === undefined) {
          return a.obj === otherFunction;
        }

        return a.fn === otherFunction.fn && expressionEquals(a.obj, otherFunction.obj) && a.parameters.length === otherFunction.parameters.length && a.parameters.every(function (value, index) {
          return expressionEquals(otherFunction.parameters[index], value);
        });

      case "Ref":
        return a.ref === b.ref;
    }
  }
  /**
   * Converts a nested SetExpression by inlining operands of type SetExpression with the same operator.
   *
   * @param expression - the expression to flatten
   * @returns {SetExpression} a new SetExpression with the same operator
   */


  _exports.expressionEquals = expressionEquals;

  function flattenSetExpression(expression) {
    return expression.operands.reduce(function (result, operand) {
      var candidatesForFlattening = operand._type === "Set" && operand.operator === expression.operator ? operand.operands : [operand];
      candidatesForFlattening.forEach(function (candidate) {
        if (result.operands.every(function (e) {
          return !expressionEquals(e, candidate);
        })) {
          result.operands.push(candidate);
        }
      });
      return result;
    }, {
      _type: "Set",
      operator: expression.operator,
      operands: []
    });
  }
  /**
   * Detects whether an array of boolean expressions contains an expression and its negation.
   *
   * @param expressions	- array of expressions
   * @returns {boolean}	true if the set of expressions contains an expression and its negation
   */


  function isTautology(expressions) {
    if (expressions.length < 2) {
      return false;
    }

    var i = expressions.length;

    while (i--) {
      var expression = expressions[i];
      var negatedExpression = not(expression);

      for (var j = 0; j < i; j++) {
        if (expressionEquals(expressions[j], negatedExpression)) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Logical `and` expression.
   *
   * The expression is simplified to false if this can be decided statically (that is, if one operand is a constant
   * false or if the expression contains an operand and its negation).
   *
   * @param operands 	- expressions to connect by `and`
   * @returns {Expression<boolean>} expression evaluating to boolean
   */


  function and() {
    for (var _len = arguments.length, operands = new Array(_len), _key = 0; _key < _len; _key++) {
      operands[_key] = arguments[_key];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "&&",
      operands: operands.map(wrapPrimitive)
    }).operands;
    var isStaticFalse = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && !expression.value) {
        isStaticFalse = true;
      }

      return !isConstant(expression);
    });

    if (isStaticFalse) {
      return constant(false);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (isTautology(nonTrivialExpression)) {
      return constant(false);
    } else {
      return {
        _type: "Set",
        operator: "&&",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `or` expression.
   *
   * The expression is simplified to true if this can be decided statically (that is, if one operand is a constant
   * true or if the expression contains an operand and its negation).
   *
   * @param operands 	- expressions to connect by `or`
   * @returns {Expression<boolean>} expression evaluating to boolean
   */


  _exports.and = and;

  function or() {
    for (var _len2 = arguments.length, operands = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      operands[_key2] = arguments[_key2];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "||",
      operands: operands.map(wrapPrimitive)
    }).operands;
    var isStaticTrue = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && expression.value) {
        isStaticTrue = true;
      }

      return !isConstant(expression) || expression.value;
    });

    if (isStaticTrue) {
      return constant(true);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (isTautology(nonTrivialExpression)) {
      return constant(true);
    } else {
      return {
        _type: "Set",
        operator: "||",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `not` operator.
   *
   * @param operand 	- the expression to reverse
   * @returns {Expression<boolean>} the resulting expression that evaluates to boolean
   */


  _exports.or = or;

  function not(operand) {
    operand = wrapPrimitive(operand);

    if (isConstant(operand)) {
      return constant(!operand.value);
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "||" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return and.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "&&" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return or.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (isComparison(operand)) {
      // Create the reverse comparison
      switch (operand.operator) {
        case "!==":
          return equal(operand.operand1, operand.operand2);

        case "<":
          return greaterOrEqual(operand.operand1, operand.operand2);

        case "<=":
          return greaterThan(operand.operand1, operand.operand2);

        case "===":
          return notEqual(operand.operand1, operand.operand2);

        case ">":
          return lessOrEqual(operand.operand1, operand.operand2);

        case ">=":
          return lessThan(operand.operand1, operand.operand2);
      }
    } else if (operand._type === "Not") {
      return operand.operand;
    } else {
      return {
        _type: "Not",
        operand: operand
      };
    }
  }
  /**
   * Creates a binding expression that will be evaluated by the corresponding model.
   *
   * @template TargetType
   * @param path the path on the model
   * @param [modelName] the name of the model
   * @param [visitedNavigationPaths] the paths from the root entitySet
   * @returns {BindingExpressionExpression<TargetType>} the default binding expression
   */


  _exports.not = not;

  function bindingExpression(path, modelName) {
    var visitedNavigationPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var localPath = visitedNavigationPaths.concat();
    localPath.push(path);
    return {
      _type: "Binding",
      modelName: modelName,
      path: localPath.join("/")
    };
  }

  _exports.bindingExpression = bindingExpression;

  /**
   * Creates a constant expression based on a primitive value.
   *
   * @template T
   * @param value the constant to wrap in an expression
   * @returns {ConstantExpression<T>} the constant expression
   */
  function constant(value) {
    var constantValue;

    if (typeof value === "object" && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        constantValue = value.map(wrapPrimitive);
      } else if (isPrimitiveObject(value)) {
        constantValue = value.valueOf();
      } else {
        var val = value;
        var obj = Object.keys(val).reduce(function (obj, key) {
          var value = wrapPrimitive(val[key]);

          if (value._type !== "Constant" || value.value !== undefined) {
            obj[key] = value;
          }

          return obj;
        }, {});
        constantValue = obj;
      }
    } else {
      constantValue = value;
    }

    return {
      _type: "Constant",
      value: constantValue
    };
  }

  _exports.constant = constant;

  function resolveBindingString(value, targetType) {
    if (value !== undefined && typeof value === "string" && value.startsWith("{")) {
      if (value.startsWith("{=")) {
        // Expression binding, we can just remove the outer binding things
        return {
          _type: "EmbeddedExpressionBinding",
          value: value
        };
      } else {
        return {
          _type: "EmbeddedBinding",
          value: value
        };
      }
    } else {
      switch (targetType) {
        case "boolean":
          if (typeof value === "string" && (value === "true" || value === "false")) {
            return constant(value === "true");
          }

          return constant(value);

        default:
          return constant(value);
      }
    }
  }
  /**
   * A named reference.
   *
   * @see fn
   *
   * @param ref	- Reference
   * @returns {ReferenceExpression}	the object reference binding part
   */


  _exports.resolveBindingString = resolveBindingString;

  function ref(ref) {
    return {
      _type: "Ref",
      ref: ref
    };
  }
  /**
   * Determine whether the type is an expression.
   *
   * Every object having a property named `_type` of some value is considered an expression, even if there is actually
   * no such expression type supported.
   *
   * @param something	- type to check
   * @returns {boolean}	`true` if the type is considered to be an expression
   */


  _exports.ref = ref;

  function isExpression(something) {
    return something !== null && typeof something === "object" && something._type !== undefined;
  }
  /**
   * Wrap a primitive into a constant expression if it is not already an expression.
   *
   * @template T
   * @param something 	- the object to wrap in a Constant expression
   * @returns {Expression<T>} either the original object or the wrapped one depending on the case
   */


  function wrapPrimitive(something) {
    if (isExpression(something)) {
      return something;
    }

    return constant(something);
  }
  /**
   * Check if the expression or value provided is a constant or not.
   *
   * @template T
   * @param  maybeConstant 	- the expression or primitive value to check
   * @returns {boolean} true if it is a constant
   */


  function isConstant(maybeConstant) {
    return typeof maybeConstant !== "object" || maybeConstant._type === "Constant";
  }
  /**
   * Check if the expression provided is a comparison or not.
   *
   * @template T
   * @param expression 	- the expression
   * @returns {boolean} true if the expression is a ComparisonExpression
   */


  _exports.isConstant = isConstant;

  function isComparison(expression) {
    return expression._type === "Comparison";
  }

  function isPrimitiveObject(objectType) {
    switch (objectType.constructor.name) {
      case "String":
      case "Number":
      case "Boolean":
        return true;

      default:
        return false;
    }
  }
  /**
   * Check if the passed annotation expression is a ComplexAnnotationExpression.
   *
   * @template T
   * @param  annotationExpression 	- the annotation expression to evaluate
   * @returns {boolean} true if the object is a {ComplexAnnotationExpression}
   */


  function isComplexAnnotationExpression(annotationExpression) {
    return typeof annotationExpression === "object" && !isPrimitiveObject(annotationExpression);
  }
  /**
   * Generate the corresponding expression for a given annotation expression.
   *
   * @template T
   * @param annotationExpression 		- the source annotation expression
   * @param visitedNavigationPaths 	- the path from the root entity set
   * @param defaultValue 				- default value if the annotationExpression is undefined
   * @returns {Expression<T>} the expression equivalent to that annotation expression
   */


  function annotationExpression(annotationExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;

    if (annotationExpression === undefined) {
      return wrapPrimitive(defaultValue);
    }

    if (!isComplexAnnotationExpression(annotationExpression)) {
      return constant(annotationExpression);
    } else {
      switch (annotationExpression.type) {
        case "Path":
          return bindingExpression(annotationExpression.path, undefined, visitedNavigationPaths);

        case "If":
          return annotationIfExpression(annotationExpression.If);

        case "Apply":
          return annotationApplyExpression(annotationExpression, visitedNavigationPaths);
      }
    }
  }
  /**
   * Parse the annotation condition into an expression.
   *
   * @template T
   * @param annotationValue 	- the condition or value from the annotation
   * @returns {Expression<T>} an equivalent expression
   */


  _exports.annotationExpression = annotationExpression;

  function parseAnnotationCondition(annotationValue) {
    if (annotationValue === null || typeof annotationValue !== "object") {
      return constant(annotationValue);
    } else if (annotationValue.hasOwnProperty("$Or")) {
      return or.apply(void 0, _toConsumableArray(annotationValue.$Or.map(parseAnnotationCondition)));
    } else if (annotationValue.hasOwnProperty("$And")) {
      return and.apply(void 0, _toConsumableArray(annotationValue.$And.map(parseAnnotationCondition)));
    } else if (annotationValue.hasOwnProperty("$Not")) {
      return not(parseAnnotationCondition(annotationValue.$Not[0]));
    } else if (annotationValue.hasOwnProperty("$Eq")) {
      return equal(parseAnnotationCondition(annotationValue.$Eq[0]), parseAnnotationCondition(annotationValue.$Eq[1]));
    } else if (annotationValue.hasOwnProperty("$Ne")) {
      return notEqual(parseAnnotationCondition(annotationValue.$Ne[0]), parseAnnotationCondition(annotationValue.$Ne[1]));
    } else if (annotationValue.hasOwnProperty("$Gt")) {
      return greaterThan(parseAnnotationCondition(annotationValue.$Gt[0]), parseAnnotationCondition(annotationValue.$Gt[1]));
    } else if (annotationValue.hasOwnProperty("$Ge")) {
      return greaterOrEqual(parseAnnotationCondition(annotationValue.$Ge[0]), parseAnnotationCondition(annotationValue.$Ge[1]));
    } else if (annotationValue.hasOwnProperty("$Lt")) {
      return lessThan(parseAnnotationCondition(annotationValue.$Lt[0]), parseAnnotationCondition(annotationValue.$Lt[1]));
    } else if (annotationValue.hasOwnProperty("$Le")) {
      return lessOrEqual(parseAnnotationCondition(annotationValue.$Le[0]), parseAnnotationCondition(annotationValue.$Le[1]));
    } else if (annotationValue.hasOwnProperty("$Path")) {
      return bindingExpression(annotationValue.$Path);
    } else if (annotationValue.hasOwnProperty("$Apply")) {
      return annotationExpression({
        type: "Apply",
        Function: annotationValue.$Function,
        Apply: annotationValue.$Apply
      });
    } else if (annotationValue.hasOwnProperty("$If")) {
      return annotationExpression({
        type: "If",
        If: annotationValue.$If
      });
    } else if (annotationValue.hasOwnProperty("$EnumMember")) {
      return constant(resolveEnumValue(annotationValue.$EnumMember));
    } else {
      return constant(false);
    }
  }
  /**
   * Process the {IfAnnotationExpressionValue} into an expression.
   *
   * @template T
   * @param annotationIfExpression 	- an If expression returning the type T
   * @returns {Expression<T>} the equivalent expression
   */


  function annotationIfExpression(annotationIfExpression) {
    return ifElse(parseAnnotationCondition(annotationIfExpression[0]), parseAnnotationCondition(annotationIfExpression[1]), parseAnnotationCondition(annotationIfExpression[2]));
  }

  _exports.annotationIfExpression = annotationIfExpression;

  function annotationApplyExpression(annotationApplyExpression, visitedNavigationPaths) {
    switch (annotationApplyExpression.Function) {
      case "odata.concat":
        return concat.apply(void 0, _toConsumableArray(annotationApplyExpression.Apply.map(function (applyParam) {
          var applyParamConverted = applyParam;

          if (applyParam.hasOwnProperty("$Path")) {
            applyParamConverted = {
              type: "Path",
              path: applyParam.$Path
            };
          } else if (applyParam.hasOwnProperty("$If")) {
            applyParamConverted = {
              type: "If",
              If: applyParam.$If
            };
          } else if (applyParam.hasOwnProperty("$Apply")) {
            applyParamConverted = {
              type: "Apply",
              Function: applyParam.$Function,
              Apply: applyParam.$Apply
            };
          }

          return annotationExpression(applyParamConverted, visitedNavigationPaths);
        })));
        break;
    }
  }
  /**
   * Generic helper for the comparison operations (equal, notEqual, ...).
   *
   * @template T
   * @param operator 		- the operator to apply
   * @param leftOperand 	- the operand on the left side of the operator
   * @param rightOperand 	- the operand on the right side of the operator
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.annotationApplyExpression = annotationApplyExpression;

  function comparison(operator, leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (isConstant(leftExpression) && isConstant(rightExpression)) {
      if (leftExpression.value === undefined || rightExpression.value === undefined) {
        return constant(leftExpression.value === rightExpression.value);
      }

      switch (operator) {
        case "!==":
          return constant(leftExpression.value !== rightExpression.value);

        case "<":
          return constant(leftExpression.value < rightExpression.value);

        case "<=":
          return constant(leftExpression.value <= rightExpression.value);

        case ">":
          return constant(leftExpression.value > rightExpression.value);

        case ">=":
          return constant(leftExpression.value >= rightExpression.value);

        case "===":
        default:
          return constant(leftExpression.value === rightExpression.value);
      }
    } else {
      return {
        _type: "Comparison",
        operator: operator,
        operand1: leftExpression,
        operand2: rightExpression
      };
    }
  }
  /**
   * Comparison: "equal" (===).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  function equal(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (expressionEquals(leftExpression, rightExpression)) {
      return constant(true);
    }

    if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onTrue, rightExpression)) {
      return leftExpression.condition;
    } else if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onFalse, rightExpression)) {
      return not(leftExpression.condition);
    }

    return comparison("===", leftExpression, rightExpression);
  }
  /**
   * Comparison: "not equal" (!==).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.equal = equal;

  function notEqual(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (expressionEquals(leftExpression, rightExpression)) {
      return constant(false);
    }

    if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onTrue, rightExpression)) {
      return not(leftExpression.condition);
    } else if (leftExpression._type === "IfElse" && expressionEquals(leftExpression.onFalse, rightExpression)) {
      return leftExpression.condition;
    } else if (leftExpression._type === "IfElse" && leftExpression.onTrue._type === rightExpression._type && !expressionEquals(leftExpression.onTrue, rightExpression) && leftExpression.onFalse._type === rightExpression._type && !expressionEquals(leftExpression.onFalse, rightExpression)) {
      // If the left expression is an if else where both onTrue and onFalse are not equals to the right expression -> simplify as true
      return constant(true);
    }

    return comparison("!==", leftExpression, rightExpression);
  }
  /**
   * Comparison: "greater or equal" (>=).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.notEqual = notEqual;

  function greaterOrEqual(leftOperand, rightOperand) {
    return comparison(">=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "greater than" (>).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.greaterOrEqual = greaterOrEqual;

  function greaterThan(leftOperand, rightOperand) {
    return comparison(">", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less or equal" (<=).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.greaterThan = greaterThan;

  function lessOrEqual(leftOperand, rightOperand) {
    return comparison("<=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less than" (<).
   *
   * @template T
   * @param leftOperand 	- the operand on the left side
   * @param rightOperand 	- the operand on the right side of the comparison
   * @returns {Expression<boolean>} an expression representing the comparison
   */


  _exports.lessOrEqual = lessOrEqual;

  function lessThan(leftOperand, rightOperand) {
    return comparison("<", leftOperand, rightOperand);
  }
  /**
   * If-then-else expression.
   *
   * Evaluates to onTrue if the condition evaluates to true, else evaluates to onFalse.
   *
   * @template T
   * @param condition - the condition to evaluate
   * @param onTrue 	- expression result if the condition evaluates to true
   * @param onFalse 	- expression result if the condition evaluates to false
   * @returns {Expression<T>} the expression that represents this conditional check
   */


  _exports.lessThan = lessThan;

  function ifElse(condition, onTrue, onFalse) {
    var conditionExpression = wrapPrimitive(condition);
    var onTrueExpression = wrapPrimitive(onTrue);
    var onFalseExpression = wrapPrimitive(onFalse); // swap branches if the condition is a negation

    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref[0];
      onFalseExpression = _ref[1];
      conditionExpression = not(conditionExpression);
    } // inline nested if-else expressions: onTrue branch
    // ifElse(X, ifElse(X, a, b), c) ==> ifElse(X, a, c)


    if (onTrueExpression._type === "IfElse" && expressionEquals(conditionExpression, onTrueExpression.condition)) {
      onTrueExpression = onTrueExpression.onTrue;
    } // inline nested if-else expressions: onFalse branch
    // ifElse(X, a, ifElse(X, b, c)) ==> ifElse(X, a, c)


    if (onFalseExpression._type === "IfElse" && expressionEquals(conditionExpression, onFalseExpression.condition)) {
      onFalseExpression = onFalseExpression.onFalse;
    } // inline nested if-else expressions: condition


    if (conditionExpression._type === "IfElse") {
      if (isConstant(conditionExpression.onFalse) && !conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, true, false), a, b) ==> ifElse(X, a, b)
        conditionExpression = conditionExpression.condition;
      } else if (isConstant(conditionExpression.onFalse) && conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, false, true), a, b) ==> ifElse(not(X), a, b)
        conditionExpression = not(conditionExpression.condition);
      } else if (isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value && !isConstant(conditionExpression.onFalse)) {
        // ifElse(ifElse(X, false, a), b, c) ==> ifElse(and(not(X), a), b, c)
        conditionExpression = and(not(conditionExpression.condition), conditionExpression.onFalse);
      }
    } // again swap branches if needed (in case one of the optimizations above led to a negated condition)


    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref2 = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref2[0];
      onFalseExpression = _ref2[1];
      conditionExpression = not(conditionExpression);
    } // compute expression result for constant conditions


    if (isConstant(conditionExpression)) {
      return conditionExpression.value ? onTrueExpression : onFalseExpression;
    } // compute expression result if onTrue and onFalse branches are equal


    if (expressionEquals(onTrueExpression, onFalseExpression)) {
      return onTrueExpression;
    } // If either trueExpression or falseExpression is a value equals to false the expression can be simplified
    // If(Condition) Then XXX Else False -> Condition && XXX


    if (isConstant(onFalseExpression) && onFalseExpression.value === false) {
      return and(conditionExpression, onTrueExpression);
    } // If(Condition) Then False Else XXX -> !Condition && XXX


    if (isConstant(onTrueExpression) && onTrueExpression.value === false) {
      return and(not(conditionExpression), onFalseExpression);
    }

    return {
      _type: "IfElse",
      condition: conditionExpression,
      onTrue: onTrueExpression,
      onFalse: onFalseExpression
    };
  }
  /**
   * Checks whether the current expression has a reference to the default model (undefined).
   *
   * @param expression 	- the expression to evaluate
   * @returns {boolean} true if there is a reference to the default context
   */


  _exports.ifElse = ifElse;

  function hasReferenceToDefaultContext(expression) {
    switch (expression._type) {
      case "Constant":
      case "Formatter":
      case "ComplexType":
        return false;

      case "Set":
        return expression.operands.some(hasReferenceToDefaultContext);

      case "Binding":
        return expression.modelName === undefined;

      case "Comparison":
        return hasReferenceToDefaultContext(expression.operand1) || hasReferenceToDefaultContext(expression.operand2);

      case "DefaultBinding":
        return true;

      case "IfElse":
        return hasReferenceToDefaultContext(expression.condition) || hasReferenceToDefaultContext(expression.onTrue) || hasReferenceToDefaultContext(expression.onFalse);

      case "Not":
        return hasReferenceToDefaultContext(expression.operand);

      default:
        return false;
    }
  }

  /**
   * Calls a formatter function to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters the list of parameter that should match the type and number of the formatter function
   * @param formatterFunction the function to call
   * @param [contextEntityType] the context entity type to consider
   * @returns {Expression<T>} the corresponding expression
   */
  function formatResult(parameters, formatterFunction, contextEntityType) {
    var parameterExpressions = parameters.map(wrapPrimitive); // If there is only one parameter and it is a constant and we don't expect the context then return the constant

    if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
      return parameterExpressions[0];
    } else if (!!contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(bindingExpression(key.name, ""));
        });
      }
    } // FormatterName can be of format sap.fe.core.xxx#methodName to have multiple formatter in one class


    var _formatterFunction$__ = formatterFunction.__functionName.split("#"),
        _formatterFunction$__2 = _slicedToArray(_formatterFunction$__, 2),
        formatterClass = _formatterFunction$__2[0],
        formatterName = _formatterFunction$__2[1];

    if (!!formatterName && formatterName.length > 0) {
      parameterExpressions.unshift(constant(formatterName));
    }

    return {
      _type: "Formatter",
      fn: formatterClass,
      parameters: parameterExpressions
    };
  }
  /**
   * Calls a complex type  to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters the list of parameter that should match the type for the compplex type
   * @param type the complex type to use
   * @param [contextEntityType] the context entity type to consider
   * @returns {Expression<T>} the corresponding expression
   */


  _exports.formatResult = formatResult;

  function addTypeInformation(parameters, type, contextEntityType) {
    var parameterExpressions = parameters.map(wrapPrimitive); // If there is only one parameter and it is a constant and we don't expect the context then return the constant

    if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
      return parameterExpressions[0];
    } else if (!!contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(bindingExpression(key.name, ""));
        });
      }
    }

    return {
      _type: "ComplexType",
      type: type,
      formatOptions: {},
      parameters: {},
      bindingParameters: parameterExpressions
    };
  }
  /**
   * Function call, optionally with arguments.
   *
   * @param fn			- Function name or reference to function
   * @param parameters	- Arguments
   * @param on			- Object to call the function on
   * @returns {FunctionExpression<T>} - Expression representing the function call (not the result of the function call!)
   */


  _exports.addTypeInformation = addTypeInformation;

  function fn(fn, parameters, on) {
    var functionName = typeof fn === "string" ? fn : fn.__functionName;
    return {
      _type: "Function",
      obj: on !== undefined ? wrapPrimitive(on) : undefined,
      fn: functionName,
      parameters: parameters.map(wrapPrimitive)
    };
  }
  /**
   * Shortcut function to determine if a binding value is null, undefined or empty.
   *
   * @param expression
   * @returns a boolean expression evaluating the fact that the current element is empty
   */


  _exports.fn = fn;

  function isEmpty(expression) {
    if (expression._type === "Concat") {
      return or.apply(void 0, _toConsumableArray(expression.expressions.map(isEmpty)));
    }

    return or(equal(expression, ""), equal(expression, undefined), equal(expression, null));
  }

  _exports.isEmpty = isEmpty;

  function concat() {
    for (var _len3 = arguments.length, inExpressions = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      inExpressions[_key3] = arguments[_key3];
    }

    var expressions = inExpressions.map(wrapPrimitive);

    if (expressions.every(isConstant)) {
      return constant(expressions.reduce(function (concatenated, value) {
        return concatenated + value.value.toString();
      }, ""));
    }

    return {
      _type: "Concat",
      expressions: expressions
    };
  }

  _exports.concat = concat;

  function transformRecursively(inExpression, expressionType, transformFunction) {
    var expression = inExpression;

    if (expressionType === expression._type) {
      expression = transformFunction(inExpression);
    } else {
      switch (expression._type) {
        case "Function":
          expression.parameters = expression.parameters.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "Concat":
          expression.expressions = expression.expressions.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "ComplexType":
          expression.bindingParameters = expression.bindingParameters.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "Formatter":
          expression.parameters = expression.parameters.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction);
          });
          break;

        case "IfElse":
          expression.onTrue = transformRecursively(expression.onTrue, expressionType, transformFunction);
          expression.onFalse = transformRecursively(expression.onFalse, expressionType, transformFunction); // expression.condition = transformRecursively(expression.condition, expressionType, transformFunction);

          break;

        case "Not":
          // expression.operand = transformRecursively(expression.operand, expressionType, transformFunction);
          break;

        case "Set":
          // expression.operands = expression.operands.map(expression =>
          // 	transformRecursively(expression, expressionType, transformFunction)
          // );
          break;

        case "Comparison":
          // expression.operand1 = transformRecursively(expression.operand1, expressionType, transformFunction);
          // expression.operand2 = transformRecursively(expression.operand2, expressionType, transformFunction);
          break;

        case "DefaultBinding":
        case "Ref":
        case "Binding":
        case "Constant":
          // Do nothing
          break;
      }
    }

    return expression;
  }

  _exports.transformRecursively = transformRecursively;

  /**
   * Compile an expression into an expression binding.
   *
   * @template T
   * @param expression			- the expression to compile
   * @param embeddedInBinding 	- whether the expression to compile is embedded into another expression
   * @returns {BindingExpression<T>} the corresponding expression binding
   */
  function compileBinding(expression) {
    var embeddedInBinding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var expr = wrapPrimitive(expression);
    var outProperty = "";

    switch (expr._type) {
      case "Constant":
        if (expr.value === null) {
          return "null";
        }

        if (expr.value === undefined) {
          return "undefined";
        }

        if (typeof expr.value === "object") {
          if (Array.isArray(expr.value)) {
            var entries = expr.value.map(function (expression) {
              return compileBinding(expression, true);
            });
            return "[".concat(entries.join(", "), "]");
          } else {
            // Objects
            var o = expr.value;
            var properties = Object.keys(o).map(function (key) {
              var value = o[key];
              return "".concat(key, ": ").concat(compileBinding(value, true));
            });
            return "{".concat(properties.join(", "), "}");
          }
        }

        if (embeddedInBinding) {
          switch (typeof expr.value) {
            case "number":
            case "bigint":
            case "boolean":
              return expr.value.toString();

            case "string":
              return "'".concat(expr.value.toString(), "'");

            default:
              return "";
          }
        } else {
          return expr.value.toString();
        }

      case "Ref":
        return expr.ref || "null";

      case "Function":
        var argumentString = "".concat(expr.parameters.map(function (arg) {
          return compileBinding(arg, true);
        }).join(", "));
        return expr.obj === undefined ? "".concat(expr.fn, "(").concat(argumentString, ")") : "".concat(compileBinding(expr.obj, true), ".").concat(expr.fn, "(").concat(argumentString, ")");

      case "EmbeddedExpressionBinding":
        if (embeddedInBinding) {
          return "(".concat(expr.value.substr(2, expr.value.length - 3), ")");
        } else {
          return "".concat(expr.value);
        }

      case "EmbeddedBinding":
        if (embeddedInBinding) {
          return "%".concat(expr.value);
        } else {
          return "".concat(expr.value);
        }

      case "DefaultBinding":
      case "Binding":
        if (expr.type || expr.parameters || expr.targetType) {
          var outBinding = "";

          if (embeddedInBinding) {
            outBinding += "%";
          }

          outBinding += "{path:'".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "'");

          if (expr.type) {
            outBinding += ", type: '".concat(expr.type, "'");
          }

          if (expr.constraints && Object.keys(expr.constraints).length > 0) {
            outBinding += ", constraints: ".concat(compileBinding(expr.constraints));
          }

          if (expr.formatOptions) {
            outBinding += ", formatOptions: ".concat(compileBinding(expr.formatOptions));
          }

          if (expr.parameters && Object.keys(expr.parameters).length > 0) {
            outBinding += ", parameters: ".concat(compileBinding(expr.parameters));
          }

          if (expr.targetType) {
            outBinding += ", targetType: '".concat(expr.targetType, "'");
          }

          outBinding += "}";
          return outBinding;
        } else {
          if (embeddedInBinding) {
            return "%{".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          } else {
            return "{".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          }
        }

      case "Comparison":
        var comparisonPart = "".concat(compileBinding(expr.operand1, true), " ").concat(expr.operator, " ").concat(compileBinding(expr.operand2, true));

        if (embeddedInBinding) {
          return comparisonPart;
        }

        return "{= ".concat(comparisonPart, "}");

      case "IfElse":
        if (embeddedInBinding) {
          return "(".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), ")");
        } else {
          return "{= ".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), "}");
        }

      case "Set":
        if (embeddedInBinding) {
          return "(".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")");
        } else {
          return "{= (".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")}");
        }

      case "Concat":
        if (embeddedInBinding) {
          return "".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" + "));
        } else {
          return "{= ".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" + "), " }");
        }

      case "Not":
        if (embeddedInBinding) {
          return "!".concat(compileBinding(expr.operand, true));
        } else {
          return "{= !".concat(compileBinding(expr.operand, true), "}");
        }

      case "Formatter":
        if (expr.parameters.length === 1) {
          outProperty += "{".concat(compilePathParameter(expr.parameters[0], true), ", formatter: '").concat(expr.fn, "'}");
        } else {
          outProperty += "{parts:[".concat(expr.parameters.map(function (param) {
            return compilePathParameter(param);
          }).join(","), "], formatter: '").concat(expr.fn, "'}");
        }

        if (embeddedInBinding) {
          outProperty = "$".concat(outProperty);
        }

        return outProperty;

      case "ComplexType":
        if (expr.bindingParameters.length === 1) {
          outProperty += "{".concat(compilePathParameter(expr.bindingParameters[0], true), ", type: '").concat(expr.type, "'}");
        } else {
          var outputEnd; // this code is based on sap.ui.model.odata.v4._AnnotationHelperExpression.fetchCurrencyOrUnit

          switch (expr.type) {
            case "sap.ui.model.odata.type.Unit":
              outputEnd = ",{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'";
              break;

            case "sap.ui.model.odata.type.Currency":
              outputEnd = ",{mode:'OneTime',path:'/##@@requestCurrencyCodes',targetType:'any'}],type:'sap.ui.model.odata.type.Currency'";
              break;

            default:
              outputEnd = "], type: '".concat(expr.type, "'");
          }

          if (expr.formatOptions && Object.keys(expr.formatOptions).length > 0) {
            outputEnd += ", formatOptions: ".concat(compileBinding(expr.formatOptions));
          }

          if (expr.parameters && Object.keys(expr.parameters).length > 0) {
            outputEnd += ", parameters: ".concat(compileBinding(expr.parameters));
          }

          outputEnd += "}";
          outProperty += "{mode:'TwoWay', parts:[".concat(expr.bindingParameters.map(function (param) {
            return compilePathParameter(param);
          }).join(",")).concat(outputEnd);
        }

        if (embeddedInBinding) {
          outProperty = "$".concat(outProperty);
        }

        return outProperty;

      default:
        return "";
    }
  }
  /**
   * Compile the path parameter of a formatter call.
   *
   * @param expression 	- the binding part to evaluate
   * @param singlePath 	- whether there is one or multiple path to consider
   * @returns {string} the string snippet to include in the overall binding definition
   */


  _exports.compileBinding = compileBinding;

  function compilePathParameter(expression) {
    var singlePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var outValue = "";

    switch (expression._type) {
      case "Constant":
        switch (typeof expression.value) {
          case "number":
          case "bigint":
            outValue = "value: ".concat(expression.value.toString());
            break;

          case "string":
          case "boolean":
            outValue = "value: '".concat(expression.value.toString(), "'");
            break;

          default:
            outValue = "value: ''";
            break;
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      case "DefaultBinding":
      case "Binding":
        outValue = "path:'".concat(expression.modelName ? "".concat(expression.modelName, ">") : "").concat(expression.path, "'");

        if (expression.type) {
          outValue += ", type : '".concat(expression.type, "'");
        } else {
          outValue += ", targetType : 'any'";
        }

        if (expression.constraints && Object.keys(expression.constraints).length > 0) {
          outValue += ", constraints: ".concat(compileBinding(expression.constraints));
        }

        if (expression.formatOptions && Object.keys(expression.formatOptions).length > 0) {
          outValue += ", formatOptions: ".concat(compileBinding(expression.formatOptions));
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      default:
        return "";
    }
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpbmRpbmdFeHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbImV4cHJlc3Npb25FcXVhbHMiLCJhIiwiYiIsIl90eXBlIiwidmFsdWUiLCJvcGVyYW5kIiwib3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlbmd0aCIsImV2ZXJ5IiwiZXhwcmVzc2lvbiIsInNvbWUiLCJvdGhlckV4cHJlc3Npb24iLCJjb25kaXRpb24iLCJvblRydWUiLCJvbkZhbHNlIiwib3BlcmFuZDEiLCJvcGVyYW5kMiIsImFFeHByZXNzaW9ucyIsImV4cHJlc3Npb25zIiwiYkV4cHJlc3Npb25zIiwiaW5kZXgiLCJtb2RlbE5hbWUiLCJwYXRoIiwidGFyZ2V0RW50aXR5U2V0IiwiZm4iLCJwYXJhbWV0ZXJzIiwidHlwZSIsImJpbmRpbmdQYXJhbWV0ZXJzIiwib3RoZXJGdW5jdGlvbiIsIm9iaiIsInVuZGVmaW5lZCIsInJlZiIsImZsYXR0ZW5TZXRFeHByZXNzaW9uIiwicmVkdWNlIiwicmVzdWx0IiwiY2FuZGlkYXRlc0ZvckZsYXR0ZW5pbmciLCJmb3JFYWNoIiwiY2FuZGlkYXRlIiwiZSIsInB1c2giLCJpc1RhdXRvbG9neSIsImkiLCJuZWdhdGVkRXhwcmVzc2lvbiIsIm5vdCIsImoiLCJhbmQiLCJtYXAiLCJ3cmFwUHJpbWl0aXZlIiwiaXNTdGF0aWNGYWxzZSIsIm5vblRyaXZpYWxFeHByZXNzaW9uIiwiZmlsdGVyIiwiaXNDb25zdGFudCIsImNvbnN0YW50IiwiaXNWYWxpZCIsIm9yIiwiaXNTdGF0aWNUcnVlIiwiaXNDb21wYXJpc29uIiwiZXF1YWwiLCJncmVhdGVyT3JFcXVhbCIsImdyZWF0ZXJUaGFuIiwibm90RXF1YWwiLCJsZXNzT3JFcXVhbCIsImxlc3NUaGFuIiwiYmluZGluZ0V4cHJlc3Npb24iLCJ2aXNpdGVkTmF2aWdhdGlvblBhdGhzIiwibG9jYWxQYXRoIiwiY29uY2F0Iiwiam9pbiIsImNvbnN0YW50VmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJpc1ByaW1pdGl2ZU9iamVjdCIsInZhbHVlT2YiLCJ2YWwiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwicmVzb2x2ZUJpbmRpbmdTdHJpbmciLCJ0YXJnZXRUeXBlIiwic3RhcnRzV2l0aCIsImlzRXhwcmVzc2lvbiIsInNvbWV0aGluZyIsIm1heWJlQ29uc3RhbnQiLCJvYmplY3RUeXBlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiaXNDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb24iLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsImRlZmF1bHRWYWx1ZSIsImFubm90YXRpb25JZkV4cHJlc3Npb24iLCJJZiIsImFubm90YXRpb25BcHBseUV4cHJlc3Npb24iLCJwYXJzZUFubm90YXRpb25Db25kaXRpb24iLCJhbm5vdGF0aW9uVmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsIiRPciIsIiRBbmQiLCIkTm90IiwiJEVxIiwiJE5lIiwiJEd0IiwiJEdlIiwiJEx0IiwiJExlIiwiJFBhdGgiLCJGdW5jdGlvbiIsIiRGdW5jdGlvbiIsIkFwcGx5IiwiJEFwcGx5IiwiJElmIiwicmVzb2x2ZUVudW1WYWx1ZSIsIiRFbnVtTWVtYmVyIiwiaWZFbHNlIiwiYXBwbHlQYXJhbSIsImFwcGx5UGFyYW1Db252ZXJ0ZWQiLCJjb21wYXJpc29uIiwibGVmdE9wZXJhbmQiLCJyaWdodE9wZXJhbmQiLCJsZWZ0RXhwcmVzc2lvbiIsInJpZ2h0RXhwcmVzc2lvbiIsImNvbmRpdGlvbkV4cHJlc3Npb24iLCJvblRydWVFeHByZXNzaW9uIiwib25GYWxzZUV4cHJlc3Npb24iLCJoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0IiwiZm9ybWF0UmVzdWx0IiwiZm9ybWF0dGVyRnVuY3Rpb24iLCJjb250ZXh0RW50aXR5VHlwZSIsInBhcmFtZXRlckV4cHJlc3Npb25zIiwiX19mdW5jdGlvbk5hbWUiLCJzcGxpdCIsImZvcm1hdHRlckNsYXNzIiwiZm9ybWF0dGVyTmFtZSIsInVuc2hpZnQiLCJhZGRUeXBlSW5mb3JtYXRpb24iLCJmb3JtYXRPcHRpb25zIiwib24iLCJmdW5jdGlvbk5hbWUiLCJpc0VtcHR5IiwiaW5FeHByZXNzaW9ucyIsImNvbmNhdGVuYXRlZCIsInRvU3RyaW5nIiwidHJhbnNmb3JtUmVjdXJzaXZlbHkiLCJpbkV4cHJlc3Npb24iLCJleHByZXNzaW9uVHlwZSIsInRyYW5zZm9ybUZ1bmN0aW9uIiwiY29tcGlsZUJpbmRpbmciLCJlbWJlZGRlZEluQmluZGluZyIsImV4cHIiLCJvdXRQcm9wZXJ0eSIsImVudHJpZXMiLCJvIiwicHJvcGVydGllcyIsImFyZ3VtZW50U3RyaW5nIiwiYXJnIiwic3Vic3RyIiwib3V0QmluZGluZyIsImNvbnN0cmFpbnRzIiwiY29tcGFyaXNvblBhcnQiLCJjb21waWxlUGF0aFBhcmFtZXRlciIsInBhcmFtIiwib3V0cHV0RW5kIiwic2luZ2xlUGF0aCIsIm91dFZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdKQTs7Ozs7OztBQU9PLFdBQVNBLGdCQUFULENBQTZCQyxDQUE3QixFQUErQ0MsQ0FBL0MsRUFBMEU7QUFDaEYsUUFBSUQsQ0FBQyxDQUFDRSxLQUFGLEtBQVlELENBQUMsQ0FBQ0MsS0FBbEIsRUFBeUI7QUFDeEIsYUFBTyxLQUFQO0FBQ0E7O0FBRUQsWUFBUUYsQ0FBQyxDQUFDRSxLQUFWO0FBQ0MsV0FBSyxVQUFMO0FBQ0EsV0FBSyxpQkFBTDtBQUNBLFdBQUssMkJBQUw7QUFDQyxlQUFPRixDQUFDLENBQUNHLEtBQUYsS0FBYUYsQ0FBRCxDQUE2QkUsS0FBaEQ7O0FBRUQsV0FBSyxLQUFMO0FBQ0MsZUFBT0osZ0JBQWdCLENBQUNDLENBQUMsQ0FBQ0ksT0FBSCxFQUFhSCxDQUFELENBQXFCRyxPQUFqQyxDQUF2Qjs7QUFFRCxXQUFLLEtBQUw7QUFDQyxlQUNDSixDQUFDLENBQUNLLFFBQUYsS0FBZ0JKLENBQUQsQ0FBcUJJLFFBQXBDLElBQ0FMLENBQUMsQ0FBQ00sUUFBRixDQUFXQyxNQUFYLEtBQXVCTixDQUFELENBQXFCSyxRQUFyQixDQUE4QkMs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aUJ6SixVQUFVLENBQUNpQixJQUE1QixNQUFSO0FBQ0EsU0FGRCxNQUVPO0FBQ053SSxVQUFBQSxRQUFRLDBCQUFSO0FBQ0E7O0FBQ0QsWUFBSXpKLFVBQVUsQ0FBQ21KLFdBQVgsSUFBMEJsRixNQUFNLENBQUNDLElBQVAsQ0FBWWxFLFVBQVUsQ0FBQ21KLFdBQXZCLEVBQW9DckosTUFBcEMsR0FBNkMsQ0FBM0UsRUFBOEU7QUFDN0UySixVQUFBQSxRQUFRLDZCQUFzQmpCLGNBQWMsQ0FBQ3hJLFVBQVUsQ0FBQ21KLFdBQVosQ0FBcEMsQ0FBUjtBQUNBOztBQUNELFlBQUluSixVQUFVLENBQUM2SCxhQUFYLElBQTRCNUQsTUFBTSxDQUFDQyxJQUFQLENBQVlsRSxVQUFVLENBQUM2SCxhQUF2QixFQUFzQy9ILE1BQXRDLEdBQStDLENBQS9FLEVBQWtGO0FBQ2pGMkosVUFBQUEsUUFBUSwrQkFBd0JqQixjQUFjLENBQUN4SSxVQUFVLENBQUM2SCxhQUFaLENBQXRDLENBQVI7QUFDQTs7QUFDRCxZQUFJMkIsVUFBSixFQUFnQjtBQUNmLGlCQUFPQyxRQUFQO0FBQ0E7O0FBQ0QsMEJBQVdBLFFBQVg7O0FBQ0Q7QUFDQyxlQUFPLEVBQVA7QUF4Q0Y7QUEwQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0Q29uZGl0aW9uYWxDaGVja09yVmFsdWUsXG5cdEVudGl0eVR5cGUsXG5cdEVxQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRHZUNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0R3RDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdElmQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdElmQW5ub3RhdGlvbkV4cHJlc3Npb25WYWx1ZSxcblx0TGVDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdEx0Q29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHROZUNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0Tm90Q29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRPckNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0UGF0aENvbmRpdGlvbkV4cHJlc3Npb24sXG5cdFByb3BlcnR5QW5ub3RhdGlvblZhbHVlXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbiwgUGF0aEFubm90YXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3R5cGVzL0VkbVwiO1xuaW1wb3J0IHsgRW50aXR5U2V0IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvQ29udmVydGVyXCI7XG5pbXBvcnQgeyByZXNvbHZlRW51bVZhbHVlIH0gZnJvbSBcIi4vQW5ub3RhdGlvbkVudW1cIjtcblxudHlwZSBQcmltaXRpdmVUeXBlID0gc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG9iamVjdCB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbnR5cGUgQmFzZUV4cHJlc3Npb248VD4gPSB7XG5cdF90eXBlOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBDb25zdGFudEV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiQ29uc3RhbnRcIjtcblx0dmFsdWU6IFQ7XG59O1xuXG50eXBlIFNldE9wZXJhdG9yID0gXCImJlwiIHwgXCJ8fFwiO1xuZXhwb3J0IHR5cGUgU2V0RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJTZXRcIjtcblx0b3BlcmF0b3I6IFNldE9wZXJhdG9yO1xuXHRvcGVyYW5kczogRXhwcmVzc2lvbjxib29sZWFuPltdO1xufTtcblxuZXhwb3J0IHR5cGUgTm90RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJOb3RcIjtcblx0b3BlcmFuZDogRXhwcmVzc2lvbjxib29sZWFuPjtcbn07XG5cbmV4cG9ydCB0eXBlIFJlZmVyZW5jZUV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxvYmplY3Q+ICYge1xuXHRfdHlwZTogXCJSZWZcIjtcblx0cmVmOiBzdHJpbmcgfCBudWxsO1xufTtcblxuZXhwb3J0IHR5cGUgRm9ybWF0dGVyRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJGb3JtYXR0ZXJcIjtcblx0Zm46IHN0cmluZztcblx0cGFyYW1ldGVyczogRXhwcmVzc2lvbjxhbnk+W107XG59O1xuXG5leHBvcnQgdHlwZSBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIjtcblx0dHlwZTogc3RyaW5nO1xuXHRmb3JtYXRPcHRpb25zOiBvYmplY3Q7XG5cdHBhcmFtZXRlcnM6IG9iamVjdDtcblx0YmluZGluZ1BhcmFtZXRlcnM6IEV4cHJlc3Npb248YW55PltdO1xufTtcblxuZXhwb3J0IHR5cGUgRnVuY3Rpb25FeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkZ1bmN0aW9uXCI7XG5cdG9iaj86IEV4cHJlc3Npb248b2JqZWN0Pjtcblx0Zm46IHN0cmluZztcblx0cGFyYW1ldGVyczogRXhwcmVzc2lvbjxhbnk+W107XG59O1xuXG5leHBvcnQgdHlwZSBDb25jYXRFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248c3RyaW5nPiAmIHtcblx0X3R5cGU6IFwiQ29uY2F0XCI7XG5cdGV4cHJlc3Npb25zOiBFeHByZXNzaW9uPHN0cmluZz5bXTtcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uXG4gKi9cbmV4cG9ydCB0eXBlIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJCaW5kaW5nXCI7XG5cdG1vZGVsTmFtZT86IHN0cmluZztcblx0cGF0aDogc3RyaW5nO1xuXHR0YXJnZXRFbnRpdHlTZXQ/OiBFbnRpdHlTZXQ7XG5cdHR5cGU/OiBzdHJpbmc7XG5cdGNvbnN0cmFpbnRzPzogYW55O1xuXHRwYXJhbWV0ZXJzPzogYW55O1xuXHR0YXJnZXRUeXBlPzogc3RyaW5nO1xuXHRmb3JtYXRPcHRpb25zPzogYW55O1xufTtcblxuZXhwb3J0IHR5cGUgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJEZWZhdWx0QmluZGluZ1wiO1xuXHRtb2RlbE5hbWU/OiBzdHJpbmc7XG5cdHBhdGg6IHN0cmluZztcblx0dHlwZT86IHN0cmluZztcblx0Y29uc3RyYWludHM/OiBvYmplY3Q7XG5cdHBhcmFtZXRlcnM/OiBhbnk7XG5cdHRhcmdldFR5cGU/OiBzdHJpbmc7XG5cdGZvcm1hdE9wdGlvbnM/OiBvYmplY3Q7XG59O1xuXG5leHBvcnQgdHlwZSBFbWJlZGRlZEJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkVtYmVkZGVkQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxudHlwZSBDb21wYXJpc29uT3BlcmF0b3IgPSBcIj09PVwiIHwgXCIhPT1cIiB8IFwiPj1cIiB8IFwiPlwiIHwgXCI8PVwiIHwgXCI8XCI7XG5leHBvcnQgdHlwZSBDb21wYXJpc29uRXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJDb21wYXJpc29uXCI7XG5cdG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cdG9wZXJhbmQxOiBFeHByZXNzaW9uPGFueT47XG5cdG9wZXJhbmQyOiBFeHByZXNzaW9uPGFueT47XG59O1xuXG5leHBvcnQgdHlwZSBJZkVsc2VFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIklmRWxzZVwiO1xuXHRjb25kaXRpb246IEV4cHJlc3Npb248Ym9vbGVhbj47XG5cdG9uVHJ1ZTogRXhwcmVzc2lvbjxUPjtcblx0b25GYWxzZTogRXhwcmVzc2lvbjxUPjtcbn07XG5cbi8qKlxuICogQW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0eXBlIFQuXG4gKlxuICogQHR5cGVkZWYgRXhwcmVzc2lvblxuICovXG5leHBvcnQgdHlwZSBFeHByZXNzaW9uPFQ+ID1cblx0fCBDb25zdGFudEV4cHJlc3Npb248VD5cblx0fCBTZXRFeHByZXNzaW9uXG5cdHwgTm90RXhwcmVzc2lvblxuXHR8IENvbmNhdEV4cHJlc3Npb25cblx0fCBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD5cblx0fCBFbWJlZGRlZEJpbmRpbmdFeHByZXNzaW9uPFQ+XG5cdHwgRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD5cblx0fCBEZWZhdWx0QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+XG5cdHwgQ29tcGFyaXNvbkV4cHJlc3Npb25cblx0fCBJZkVsc2VFeHByZXNzaW9uPFQ+XG5cdHwgRm9ybWF0dGVyRXhwcmVzc2lvbjxUPlxuXHR8IENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPlxuXHR8IFJlZmVyZW5jZUV4cHJlc3Npb25cblx0fCBGdW5jdGlvbkV4cHJlc3Npb248VD47XG5cbi8qKlxuICogQW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0eXBlIFQsIG9yIGEgY29uc3RhbnQgdmFsdWUgb2YgdHlwZSBUXG4gKi9cbmV4cG9ydCB0eXBlIEV4cHJlc3Npb25PclByaW1pdGl2ZTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4gPSBFeHByZXNzaW9uPFQ+IHwgVDtcblxuLyoqXG4gKiBDaGVjayB0d28gZXhwcmVzc2lvbnMgZm9yIChkZWVwKSBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0gYVx0LSBleHByZXNzaW9uXG4gKiBAcGFyYW0gYiAtIGV4cHJlc3Npb25cbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSB0d28gZXhwcmVzc2lvbnMgYXJlIGVxdWFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHByZXNzaW9uRXF1YWxzPFQ+KGE6IEV4cHJlc3Npb248VD4sIGI6IEV4cHJlc3Npb248VD4pOiBib29sZWFuIHtcblx0aWYgKGEuX3R5cGUgIT09IGIuX3R5cGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRzd2l0Y2ggKGEuX3R5cGUpIHtcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRjYXNlIFwiRW1iZWRkZWRCaW5kaW5nXCI6XG5cdFx0Y2FzZSBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIjpcblx0XHRcdHJldHVybiBhLnZhbHVlID09PSAoYiBhcyBDb25zdGFudEV4cHJlc3Npb248VD4pLnZhbHVlO1xuXG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb25FcXVhbHMoYS5vcGVyYW5kLCAoYiBhcyBOb3RFeHByZXNzaW9uKS5vcGVyYW5kKTtcblxuXHRcdGNhc2UgXCJTZXRcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEub3BlcmF0b3IgPT09IChiIGFzIFNldEV4cHJlc3Npb24pLm9wZXJhdG9yICYmXG5cdFx0XHRcdGEub3BlcmFuZHMubGVuZ3RoID09PSAoYiBhcyBTZXRFeHByZXNzaW9uKS5vcGVyYW5kcy5sZW5ndGggJiZcblx0XHRcdFx0YS5vcGVyYW5kcy5ldmVyeShleHByZXNzaW9uID0+XG5cdFx0XHRcdFx0KGIgYXMgU2V0RXhwcmVzc2lvbikub3BlcmFuZHMuc29tZShvdGhlckV4cHJlc3Npb24gPT4gZXhwcmVzc2lvbkVxdWFscyhleHByZXNzaW9uLCBvdGhlckV4cHJlc3Npb24pKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0ZXhwcmVzc2lvbkVxdWFscyhhLmNvbmRpdGlvbiwgKGIgYXMgSWZFbHNlRXhwcmVzc2lvbjxUPikuY29uZGl0aW9uKSAmJlxuXHRcdFx0XHRleHByZXNzaW9uRXF1YWxzKGEub25UcnVlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vblRydWUpICYmXG5cdFx0XHRcdGV4cHJlc3Npb25FcXVhbHMoYS5vbkZhbHNlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vbkZhbHNlKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm9wZXJhdG9yID09IChiIGFzIENvbXBhcmlzb25FeHByZXNzaW9uKS5vcGVyYXRvciAmJlxuXHRcdFx0XHRleHByZXNzaW9uRXF1YWxzKGEub3BlcmFuZDEsIChiIGFzIENvbXBhcmlzb25FeHByZXNzaW9uKS5vcGVyYW5kMSkgJiZcblx0XHRcdFx0ZXhwcmVzc2lvbkVxdWFscyhhLm9wZXJhbmQyLCAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmFuZDIpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIkNvbmNhdFwiOlxuXHRcdFx0Y29uc3QgYUV4cHJlc3Npb25zID0gYS5leHByZXNzaW9ucztcblx0XHRcdGNvbnN0IGJFeHByZXNzaW9ucyA9IChiIGFzIENvbmNhdEV4cHJlc3Npb24pLmV4cHJlc3Npb25zO1xuXHRcdFx0aWYgKGFFeHByZXNzaW9ucy5sZW5ndGggIT09IGJFeHByZXNzaW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFFeHByZXNzaW9ucy5ldmVyeSgoZXhwcmVzc2lvbiwgaW5kZXgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGV4cHJlc3Npb25FcXVhbHMoZXhwcmVzc2lvbiwgYkV4cHJlc3Npb25zW2luZGV4XSk7XG5cdFx0XHR9KTtcblxuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm1vZGVsTmFtZSA9PT0gKGIgYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+KS5tb2RlbE5hbWUgJiZcblx0XHRcdFx0YS5wYXRoID09PSAoYiBhcyBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4pLnBhdGggJiZcblx0XHRcdFx0YS50YXJnZXRFbnRpdHlTZXQgPT09IChiIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikudGFyZ2V0RW50aXR5U2V0XG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm1vZGVsTmFtZSA9PT0gKGIgYXMgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikubW9kZWxOYW1lICYmXG5cdFx0XHRcdGEucGF0aCA9PT0gKGIgYXMgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikucGF0aFxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJGb3JtYXR0ZXJcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEuZm4gPT09IChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLmZuICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5sZW5ndGggPT09IChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLnBhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBleHByZXNzaW9uRXF1YWxzKChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLnBhcmFtZXRlcnNbaW5kZXhdLCB2YWx1ZSkpXG5cdFx0XHQpO1xuXHRcdGNhc2UgXCJDb21wbGV4VHlwZVwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS50eXBlID09PSAoYiBhcyBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4pLnR5cGUgJiZcblx0XHRcdFx0YS5iaW5kaW5nUGFyYW1ldGVycy5sZW5ndGggPT09IChiIGFzIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPikuYmluZGluZ1BhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEuYmluZGluZ1BhcmFtZXRlcnMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT5cblx0XHRcdFx0XHRleHByZXNzaW9uRXF1YWxzKChiIGFzIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPikuYmluZGluZ1BhcmFtZXRlcnNbaW5kZXhdLCB2YWx1ZSlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiRnVuY3Rpb25cIjpcblx0XHRcdGNvbnN0IG90aGVyRnVuY3Rpb24gPSBiIGFzIEZ1bmN0aW9uRXhwcmVzc2lvbjxUPjtcblx0XHRcdGlmIChhLm9iaiA9PT0gdW5kZWZpbmVkIHx8IG90aGVyRnVuY3Rpb24ub2JqID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGEub2JqID09PSBvdGhlckZ1bmN0aW9uO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLmZuID09PSBvdGhlckZ1bmN0aW9uLmZuICYmXG5cdFx0XHRcdGV4cHJlc3Npb25FcXVhbHMoYS5vYmosIG90aGVyRnVuY3Rpb24ub2JqKSAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMubGVuZ3RoID09PSBvdGhlckZ1bmN0aW9uLnBhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBleHByZXNzaW9uRXF1YWxzKG90aGVyRnVuY3Rpb24ucGFyYW1ldGVyc1tpbmRleF0sIHZhbHVlKSlcblx0XHRcdCk7XG5cblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0XHRyZXR1cm4gYS5yZWYgPT09IChiIGFzIFJlZmVyZW5jZUV4cHJlc3Npb24pLnJlZjtcblx0fVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgbmVzdGVkIFNldEV4cHJlc3Npb24gYnkgaW5saW5pbmcgb3BlcmFuZHMgb2YgdHlwZSBTZXRFeHByZXNzaW9uIHdpdGggdGhlIHNhbWUgb3BlcmF0b3IuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gLSB0aGUgZXhwcmVzc2lvbiB0byBmbGF0dGVuXG4gKiBAcmV0dXJucyB7U2V0RXhwcmVzc2lvbn0gYSBuZXcgU2V0RXhwcmVzc2lvbiB3aXRoIHRoZSBzYW1lIG9wZXJhdG9yXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW5TZXRFeHByZXNzaW9uKGV4cHJlc3Npb246IFNldEV4cHJlc3Npb24pOiBTZXRFeHByZXNzaW9uIHtcblx0cmV0dXJuIGV4cHJlc3Npb24ub3BlcmFuZHMucmVkdWNlKFxuXHRcdChyZXN1bHQ6IFNldEV4cHJlc3Npb24sIG9wZXJhbmQpID0+IHtcblx0XHRcdGNvbnN0IGNhbmRpZGF0ZXNGb3JGbGF0dGVuaW5nID1cblx0XHRcdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJiBvcGVyYW5kLm9wZXJhdG9yID09PSBleHByZXNzaW9uLm9wZXJhdG9yID8gb3BlcmFuZC5vcGVyYW5kcyA6IFtvcGVyYW5kXTtcblx0XHRcdGNhbmRpZGF0ZXNGb3JGbGF0dGVuaW5nLmZvckVhY2goY2FuZGlkYXRlID0+IHtcblx0XHRcdFx0aWYgKHJlc3VsdC5vcGVyYW5kcy5ldmVyeShlID0+ICFleHByZXNzaW9uRXF1YWxzKGUsIGNhbmRpZGF0ZSkpKSB7XG5cdFx0XHRcdFx0cmVzdWx0Lm9wZXJhbmRzLnB1c2goY2FuZGlkYXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sXG5cdFx0eyBfdHlwZTogXCJTZXRcIiwgb3BlcmF0b3I6IGV4cHJlc3Npb24ub3BlcmF0b3IsIG9wZXJhbmRzOiBbXSB9XG5cdCk7XG59XG5cbi8qKlxuICogRGV0ZWN0cyB3aGV0aGVyIGFuIGFycmF5IG9mIGJvb2xlYW4gZXhwcmVzc2lvbnMgY29udGFpbnMgYW4gZXhwcmVzc2lvbiBhbmQgaXRzIG5lZ2F0aW9uLlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uc1x0LSBhcnJheSBvZiBleHByZXNzaW9uc1xuICogQHJldHVybnMge2Jvb2xlYW59XHR0cnVlIGlmIHRoZSBzZXQgb2YgZXhwcmVzc2lvbnMgY29udGFpbnMgYW4gZXhwcmVzc2lvbiBhbmQgaXRzIG5lZ2F0aW9uXG4gKi9cbmZ1bmN0aW9uIGlzVGF1dG9sb2d5KGV4cHJlc3Npb25zOiBFeHByZXNzaW9uPGJvb2xlYW4+W10pOiBib29sZWFuIHtcblx0aWYgKGV4cHJlc3Npb25zLmxlbmd0aCA8IDIpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRsZXQgaSA9IGV4cHJlc3Npb25zLmxlbmd0aDtcblx0d2hpbGUgKGktLSkge1xuXHRcdGNvbnN0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uc1tpXTtcblx0XHRjb25zdCBuZWdhdGVkRXhwcmVzc2lvbiA9IG5vdChleHByZXNzaW9uKTtcblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuXHRcdFx0aWYgKGV4cHJlc3Npb25FcXVhbHMoZXhwcmVzc2lvbnNbal0sIG5lZ2F0ZWRFeHByZXNzaW9uKSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIExvZ2ljYWwgYGFuZGAgZXhwcmVzc2lvbi5cbiAqXG4gKiBUaGUgZXhwcmVzc2lvbiBpcyBzaW1wbGlmaWVkIHRvIGZhbHNlIGlmIHRoaXMgY2FuIGJlIGRlY2lkZWQgc3RhdGljYWxseSAodGhhdCBpcywgaWYgb25lIG9wZXJhbmQgaXMgYSBjb25zdGFudFxuICogZmFsc2Ugb3IgaWYgdGhlIGV4cHJlc3Npb24gY29udGFpbnMgYW4gb3BlcmFuZCBhbmQgaXRzIG5lZ2F0aW9uKS5cbiAqXG4gKiBAcGFyYW0gb3BlcmFuZHMgXHQtIGV4cHJlc3Npb25zIHRvIGNvbm5lY3QgYnkgYGFuZGBcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBleHByZXNzaW9uIGV2YWx1YXRpbmcgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5kKC4uLm9wZXJhbmRzOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj5bXSk6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBleHByZXNzaW9ucyA9IGZsYXR0ZW5TZXRFeHByZXNzaW9uKHtcblx0XHRfdHlwZTogXCJTZXRcIixcblx0XHRvcGVyYXRvcjogXCImJlwiLFxuXHRcdG9wZXJhbmRzOiBvcGVyYW5kcy5tYXAod3JhcFByaW1pdGl2ZSlcblx0fSkub3BlcmFuZHM7XG5cblx0bGV0IGlzU3RhdGljRmFsc2U6IGJvb2xlYW4gPSBmYWxzZTtcblx0Y29uc3Qgbm9uVHJpdmlhbEV4cHJlc3Npb24gPSBleHByZXNzaW9ucy5maWx0ZXIoZXhwcmVzc2lvbiA9PiB7XG5cdFx0aWYgKGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgJiYgIWV4cHJlc3Npb24udmFsdWUpIHtcblx0XHRcdGlzU3RhdGljRmFsc2UgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gIWlzQ29uc3RhbnQoZXhwcmVzc2lvbik7XG5cdH0pO1xuXHRpZiAoaXNTdGF0aWNGYWxzZSkge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0Ly8gUmVzb2x2ZSB0aGUgY29uc3RhbnQgdGhlblxuXHRcdGNvbnN0IGlzVmFsaWQgPSBleHByZXNzaW9ucy5yZWR1Y2UoKGlzVmFsaWQsIGV4cHJlc3Npb24pID0+IHtcblx0XHRcdHJldHVybiBpc1ZhbGlkICYmIGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi52YWx1ZTtcblx0XHR9LCB0cnVlKTtcblx0XHRyZXR1cm4gY29uc3RhbnQoaXNWYWxpZCk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIG5vblRyaXZpYWxFeHByZXNzaW9uWzBdO1xuXHR9IGVsc2UgaWYgKGlzVGF1dG9sb2d5KG5vblRyaXZpYWxFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIlNldFwiLFxuXHRcdFx0b3BlcmF0b3I6IFwiJiZcIixcblx0XHRcdG9wZXJhbmRzOiBub25Ucml2aWFsRXhwcmVzc2lvblxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBMb2dpY2FsIGBvcmAgZXhwcmVzc2lvbi5cbiAqXG4gKiBUaGUgZXhwcmVzc2lvbiBpcyBzaW1wbGlmaWVkIHRvIHRydWUgaWYgdGhpcyBjYW4gYmUgZGVjaWRlZCBzdGF0aWNhbGx5ICh0aGF0IGlzLCBpZiBvbmUgb3BlcmFuZCBpcyBhIGNvbnN0YW50XG4gKiB0cnVlIG9yIGlmIHRoZSBleHByZXNzaW9uIGNvbnRhaW5zIGFuIG9wZXJhbmQgYW5kIGl0cyBuZWdhdGlvbikuXG4gKlxuICogQHBhcmFtIG9wZXJhbmRzIFx0LSBleHByZXNzaW9ucyB0byBjb25uZWN0IGJ5IGBvcmBcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBleHByZXNzaW9uIGV2YWx1YXRpbmcgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gb3IoLi4ub3BlcmFuZHM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGV4cHJlc3Npb25zID0gZmxhdHRlblNldEV4cHJlc3Npb24oe1xuXHRcdF90eXBlOiBcIlNldFwiLFxuXHRcdG9wZXJhdG9yOiBcInx8XCIsXG5cdFx0b3BlcmFuZHM6IG9wZXJhbmRzLm1hcCh3cmFwUHJpbWl0aXZlKVxuXHR9KS5vcGVyYW5kcztcblx0bGV0IGlzU3RhdGljVHJ1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdCBub25Ucml2aWFsRXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zLmZpbHRlcihleHByZXNzaW9uID0+IHtcblx0XHRpZiAoaXNDb25zdGFudChleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnZhbHVlKSB7XG5cdFx0XHRpc1N0YXRpY1RydWUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gIWlzQ29uc3RhbnQoZXhwcmVzc2lvbikgfHwgZXhwcmVzc2lvbi52YWx1ZTtcblx0fSk7XG5cdGlmIChpc1N0YXRpY1RydWUpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAwKSB7XG5cdFx0Ly8gUmVzb2x2ZSB0aGUgY29uc3RhbnQgdGhlblxuXHRcdGNvbnN0IGlzVmFsaWQgPSBleHByZXNzaW9ucy5yZWR1Y2UoKGlzVmFsaWQsIGV4cHJlc3Npb24pID0+IHtcblx0XHRcdHJldHVybiBpc1ZhbGlkICYmIGlzQ29uc3RhbnQoZXhwcmVzc2lvbikgJiYgZXhwcmVzc2lvbi52YWx1ZTtcblx0XHR9LCB0cnVlKTtcblx0XHRyZXR1cm4gY29uc3RhbnQoaXNWYWxpZCk7XG5cdH0gZWxzZSBpZiAobm9uVHJpdmlhbEV4cHJlc3Npb24ubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIG5vblRyaXZpYWxFeHByZXNzaW9uWzBdO1xuXHR9IGVsc2UgaWYgKGlzVGF1dG9sb2d5KG5vblRyaXZpYWxFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiU2V0XCIsXG5cdFx0XHRvcGVyYXRvcjogXCJ8fFwiLFxuXHRcdFx0b3BlcmFuZHM6IG5vblRyaXZpYWxFeHByZXNzaW9uXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIExvZ2ljYWwgYG5vdGAgb3BlcmF0b3IuXG4gKlxuICogQHBhcmFtIG9wZXJhbmQgXHQtIHRoZSBleHByZXNzaW9uIHRvIHJldmVyc2VcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSB0aGUgcmVzdWx0aW5nIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90KG9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRvcGVyYW5kID0gd3JhcFByaW1pdGl2ZShvcGVyYW5kKTtcblx0aWYgKGlzQ29uc3RhbnQob3BlcmFuZCkpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoIW9wZXJhbmQudmFsdWUpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdHR5cGVvZiBvcGVyYW5kID09PSBcIm9iamVjdFwiICYmXG5cdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmF0b3IgPT09IFwifHxcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmFuZHMuZXZlcnkoZXhwcmVzc2lvbiA9PiBpc0NvbnN0YW50KGV4cHJlc3Npb24pIHx8IGlzQ29tcGFyaXNvbihleHByZXNzaW9uKSlcblx0KSB7XG5cdFx0cmV0dXJuIGFuZCguLi5vcGVyYW5kLm9wZXJhbmRzLm1hcChleHByZXNzaW9uID0+IG5vdChleHByZXNzaW9uKSkpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdHR5cGVvZiBvcGVyYW5kID09PSBcIm9iamVjdFwiICYmXG5cdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmF0b3IgPT09IFwiJiZcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmFuZHMuZXZlcnkoZXhwcmVzc2lvbiA9PiBpc0NvbnN0YW50KGV4cHJlc3Npb24pIHx8IGlzQ29tcGFyaXNvbihleHByZXNzaW9uKSlcblx0KSB7XG5cdFx0cmV0dXJuIG9yKC4uLm9wZXJhbmQub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gbm90KGV4cHJlc3Npb24pKSk7XG5cdH0gZWxzZSBpZiAoaXNDb21wYXJpc29uKG9wZXJhbmQpKSB7XG5cdFx0Ly8gQ3JlYXRlIHRoZSByZXZlcnNlIGNvbXBhcmlzb25cblx0XHRzd2l0Y2ggKG9wZXJhbmQub3BlcmF0b3IpIHtcblx0XHRcdGNhc2UgXCIhPT1cIjpcblx0XHRcdFx0cmV0dXJuIGVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIjxcIjpcblx0XHRcdFx0cmV0dXJuIGdyZWF0ZXJPckVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIjw9XCI6XG5cdFx0XHRcdHJldHVybiBncmVhdGVyVGhhbihvcGVyYW5kLm9wZXJhbmQxLCBvcGVyYW5kLm9wZXJhbmQyKTtcblx0XHRcdGNhc2UgXCI9PT1cIjpcblx0XHRcdFx0cmV0dXJuIG5vdEVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIj5cIjpcblx0XHRcdFx0cmV0dXJuIGxlc3NPckVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIj49XCI6XG5cdFx0XHRcdHJldHVybiBsZXNzVGhhbihvcGVyYW5kLm9wZXJhbmQxLCBvcGVyYW5kLm9wZXJhbmQyKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAob3BlcmFuZC5fdHlwZSA9PT0gXCJOb3RcIikge1xuXHRcdHJldHVybiBvcGVyYW5kLm9wZXJhbmQ7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIk5vdFwiLFxuXHRcdFx0b3BlcmFuZDogb3BlcmFuZFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYmluZGluZyBleHByZXNzaW9uIHRoYXQgd2lsbCBiZSBldmFsdWF0ZWQgYnkgdGhlIGNvcnJlc3BvbmRpbmcgbW9kZWwuXG4gKlxuICogQHRlbXBsYXRlIFRhcmdldFR5cGVcbiAqIEBwYXJhbSBwYXRoIHRoZSBwYXRoIG9uIHRoZSBtb2RlbFxuICogQHBhcmFtIFttb2RlbE5hbWVdIHRoZSBuYW1lIG9mIHRoZSBtb2RlbFxuICogQHBhcmFtIFt2aXNpdGVkTmF2aWdhdGlvblBhdGhzXSB0aGUgcGF0aHMgZnJvbSB0aGUgcm9vdCBlbnRpdHlTZXRcbiAqIEByZXR1cm5zIHtCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VGFyZ2V0VHlwZT59IHRoZSBkZWZhdWx0IGJpbmRpbmcgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZGluZ0V4cHJlc3Npb248VGFyZ2V0VHlwZSBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRwYXRoOiBzdHJpbmcsXG5cdG1vZGVsTmFtZT86IHN0cmluZyxcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXVxuKTogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFRhcmdldFR5cGU+IHtcblx0Y29uc3QgbG9jYWxQYXRoID0gdmlzaXRlZE5hdmlnYXRpb25QYXRocy5jb25jYXQoKTtcblx0bG9jYWxQYXRoLnB1c2gocGF0aCk7XG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiQmluZGluZ1wiLFxuXHRcdG1vZGVsTmFtZTogbW9kZWxOYW1lLFxuXHRcdHBhdGg6IGxvY2FsUGF0aC5qb2luKFwiL1wiKVxuXHR9O1xufVxuXG50eXBlIFBsYWluRXhwcmVzc2lvbk9iamVjdCA9IHsgW2luZGV4OiBzdHJpbmddOiBFeHByZXNzaW9uPGFueT4gfTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY29uc3RhbnQgZXhwcmVzc2lvbiBiYXNlZCBvbiBhIHByaW1pdGl2ZSB2YWx1ZS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHZhbHVlIHRoZSBjb25zdGFudCB0byB3cmFwIGluIGFuIGV4cHJlc3Npb25cbiAqIEByZXR1cm5zIHtDb25zdGFudEV4cHJlc3Npb248VD59IHRoZSBjb25zdGFudCBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4odmFsdWU6IFQpOiBDb25zdGFudEV4cHJlc3Npb248VD4ge1xuXHRsZXQgY29uc3RhbnRWYWx1ZTogVDtcblxuXHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZS5tYXAod3JhcFByaW1pdGl2ZSkgYXMgVDtcblx0XHR9IGVsc2UgaWYgKGlzUHJpbWl0aXZlT2JqZWN0KHZhbHVlIGFzIG9iamVjdCkpIHtcblx0XHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCkgYXMgVDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgdmFsID0gdmFsdWUgYXMgeyBbbmFtZTogc3RyaW5nXTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGFueT4gfTtcblx0XHRcdGNvbnN0IG9iaiA9IE9iamVjdC5rZXlzKHZhbCkucmVkdWNlKChvYmosIGtleSkgPT4ge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHdyYXBQcmltaXRpdmUodmFsW2tleV0pO1xuXHRcdFx0XHRpZiAodmFsdWUuX3R5cGUgIT09IFwiQ29uc3RhbnRcIiB8fCB2YWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0b2JqW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSwge30gYXMgUGxhaW5FeHByZXNzaW9uT2JqZWN0KTtcblxuXHRcdFx0Y29uc3RhbnRWYWx1ZSA9IG9iaiBhcyBUO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb25zdGFudFZhbHVlID0gdmFsdWU7XG5cdH1cblxuXHRyZXR1cm4geyBfdHlwZTogXCJDb25zdGFudFwiLCB2YWx1ZTogY29uc3RhbnRWYWx1ZSB9O1xufVxuXG50eXBlIEV2YWx1YXRpb25UeXBlID0gXCJib29sZWFuXCI7XG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUJpbmRpbmdTdHJpbmc8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHR2YWx1ZTogc3RyaW5nIHwgYm9vbGVhbiB8IG51bWJlcixcblx0dGFyZ2V0VHlwZT86IEV2YWx1YXRpb25UeXBlXG4pOiBDb25zdGFudEV4cHJlc3Npb248VD4gfCBFbWJlZGRlZEJpbmRpbmdFeHByZXNzaW9uPFQ+IHwgRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD4ge1xuXHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUuc3RhcnRzV2l0aChcIntcIikpIHtcblx0XHRpZiAodmFsdWUuc3RhcnRzV2l0aChcIns9XCIpKSB7XG5cdFx0XHQvLyBFeHByZXNzaW9uIGJpbmRpbmcsIHdlIGNhbiBqdXN0IHJlbW92ZSB0aGUgb3V0ZXIgYmluZGluZyB0aGluZ3Ncblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdF90eXBlOiBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIixcblx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRfdHlwZTogXCJFbWJlZGRlZEJpbmRpbmdcIixcblx0XHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRzd2l0Y2ggKHRhcmdldFR5cGUpIHtcblx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgKHZhbHVlID09PSBcInRydWVcIiB8fCB2YWx1ZSA9PT0gXCJmYWxzZVwiKSkge1xuXHRcdFx0XHRcdHJldHVybiBjb25zdGFudCh2YWx1ZSA9PT0gXCJ0cnVlXCIpIGFzIENvbnN0YW50RXhwcmVzc2lvbjxUPjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQodmFsdWUpIGFzIENvbnN0YW50RXhwcmVzc2lvbjxUPjtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudCh2YWx1ZSkgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+O1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEEgbmFtZWQgcmVmZXJlbmNlLlxuICpcbiAqIEBzZWUgZm5cbiAqXG4gKiBAcGFyYW0gcmVmXHQtIFJlZmVyZW5jZVxuICogQHJldHVybnMge1JlZmVyZW5jZUV4cHJlc3Npb259XHR0aGUgb2JqZWN0IHJlZmVyZW5jZSBiaW5kaW5nIHBhcnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZihyZWY6IHN0cmluZyB8IG51bGwpOiBSZWZlcmVuY2VFeHByZXNzaW9uIHtcblx0cmV0dXJuIHsgX3R5cGU6IFwiUmVmXCIsIHJlZiB9O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSB0eXBlIGlzIGFuIGV4cHJlc3Npb24uXG4gKlxuICogRXZlcnkgb2JqZWN0IGhhdmluZyBhIHByb3BlcnR5IG5hbWVkIGBfdHlwZWAgb2Ygc29tZSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFuIGV4cHJlc3Npb24sIGV2ZW4gaWYgdGhlcmUgaXMgYWN0dWFsbHlcbiAqIG5vIHN1Y2ggZXhwcmVzc2lvbiB0eXBlIHN1cHBvcnRlZC5cbiAqXG4gKiBAcGFyYW0gc29tZXRoaW5nXHQtIHR5cGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufVx0YHRydWVgIGlmIHRoZSB0eXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgYW4gZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpc0V4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KHNvbWV0aGluZzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogc29tZXRoaW5nIGlzIEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gc29tZXRoaW5nICE9PSBudWxsICYmIHR5cGVvZiBzb21ldGhpbmcgPT09IFwib2JqZWN0XCIgJiYgKHNvbWV0aGluZyBhcyBCYXNlRXhwcmVzc2lvbjxUPikuX3R5cGUgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBXcmFwIGEgcHJpbWl0aXZlIGludG8gYSBjb25zdGFudCBleHByZXNzaW9uIGlmIGl0IGlzIG5vdCBhbHJlYWR5IGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBzb21ldGhpbmcgXHQtIHRoZSBvYmplY3QgdG8gd3JhcCBpbiBhIENvbnN0YW50IGV4cHJlc3Npb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSBlaXRoZXIgdGhlIG9yaWdpbmFsIG9iamVjdCBvciB0aGUgd3JhcHBlZCBvbmUgZGVwZW5kaW5nIG9uIHRoZSBjYXNlXG4gKi9cbmZ1bmN0aW9uIHdyYXBQcmltaXRpdmU8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KHNvbWV0aGluZzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogRXhwcmVzc2lvbjxUPiB7XG5cdGlmIChpc0V4cHJlc3Npb24oc29tZXRoaW5nKSkge1xuXHRcdHJldHVybiBzb21ldGhpbmc7XG5cdH1cblxuXHRyZXR1cm4gY29uc3RhbnQoc29tZXRoaW5nKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZXhwcmVzc2lvbiBvciB2YWx1ZSBwcm92aWRlZCBpcyBhIGNvbnN0YW50IG9yIG5vdC5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtICBtYXliZUNvbnN0YW50IFx0LSB0aGUgZXhwcmVzc2lvbiBvciBwcmltaXRpdmUgdmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGl0IGlzIGEgY29uc3RhbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ29uc3RhbnQ8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KG1heWJlQ29uc3RhbnQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPik6IG1heWJlQ29uc3RhbnQgaXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+IHtcblx0cmV0dXJuIHR5cGVvZiBtYXliZUNvbnN0YW50ICE9PSBcIm9iamVjdFwiIHx8IChtYXliZUNvbnN0YW50IGFzIEJhc2VFeHByZXNzaW9uPFQ+KS5fdHlwZSA9PT0gXCJDb25zdGFudFwiO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBleHByZXNzaW9uIHByb3ZpZGVkIGlzIGEgY29tcGFyaXNvbiBvciBub3QuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBleHByZXNzaW9uIFx0LSB0aGUgZXhwcmVzc2lvblxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSBDb21wYXJpc29uRXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpc0NvbXBhcmlzb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KGV4cHJlc3Npb246IEV4cHJlc3Npb248VD4pOiBleHByZXNzaW9uIGlzIENvbXBhcmlzb25FeHByZXNzaW9uIHtcblx0cmV0dXJuIGV4cHJlc3Npb24uX3R5cGUgPT09IFwiQ29tcGFyaXNvblwiO1xufVxuXG50eXBlIENvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPiA9IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPiB8IEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248UD4gfCBJZkFubm90YXRpb25FeHByZXNzaW9uPFA+O1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZU9iamVjdChvYmplY3RUeXBlOiBvYmplY3QpOiBib29sZWFuIHtcblx0c3dpdGNoIChvYmplY3RUeXBlLmNvbnN0cnVjdG9yLm5hbWUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0Y2FzZSBcIk51bWJlclwiOlxuXHRcdGNhc2UgXCJCb29sZWFuXCI6XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4vKipcbiAqIENoZWNrIGlmIHRoZSBwYXNzZWQgYW5ub3RhdGlvbiBleHByZXNzaW9uIGlzIGEgQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gIGFubm90YXRpb25FeHByZXNzaW9uIFx0LSB0aGUgYW5ub3RhdGlvbiBleHByZXNzaW9uIHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGEge0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbn1cbiAqL1xuZnVuY3Rpb24gaXNDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb248VD4oXG5cdGFubm90YXRpb25FeHByZXNzaW9uOiBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxUPlxuKTogYW5ub3RhdGlvbkV4cHJlc3Npb24gaXMgQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uPFQ+IHtcblx0cmV0dXJuIHR5cGVvZiBhbm5vdGF0aW9uRXhwcmVzc2lvbiA9PT0gXCJvYmplY3RcIiAmJiAhaXNQcmltaXRpdmVPYmplY3QoYW5ub3RhdGlvbkV4cHJlc3Npb24gYXMgb2JqZWN0KTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uIGZvciBhIGdpdmVuIGFubm90YXRpb24gZXhwcmVzc2lvbi5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGFubm90YXRpb25FeHByZXNzaW9uIFx0XHQtIHRoZSBzb3VyY2UgYW5ub3RhdGlvbiBleHByZXNzaW9uXG4gKiBAcGFyYW0gdmlzaXRlZE5hdmlnYXRpb25QYXRocyBcdC0gdGhlIHBhdGggZnJvbSB0aGUgcm9vdCBlbnRpdHkgc2V0XG4gKiBAcGFyYW0gZGVmYXVsdFZhbHVlIFx0XHRcdFx0LSBkZWZhdWx0IHZhbHVlIGlmIHRoZSBhbm5vdGF0aW9uRXhwcmVzc2lvbiBpcyB1bmRlZmluZWRcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSB0aGUgZXhwcmVzc2lvbiBlcXVpdmFsZW50IHRvIHRoYXQgYW5ub3RhdGlvbiBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0aW9uRXhwcmVzc2lvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGFubm90YXRpb25FeHByZXNzaW9uOiBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxUPixcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXSxcblx0ZGVmYXVsdFZhbHVlPzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGFubm90YXRpb25FeHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gd3JhcFByaW1pdGl2ZShkZWZhdWx0VmFsdWUgYXMgVCk7XG5cdH1cblx0aWYgKCFpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbihhbm5vdGF0aW9uRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoYW5ub3RhdGlvbkV4cHJlc3Npb24pO1xuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAoYW5ub3RhdGlvbkV4cHJlc3Npb24udHlwZSkge1xuXHRcdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdFx0cmV0dXJuIGJpbmRpbmdFeHByZXNzaW9uKGFubm90YXRpb25FeHByZXNzaW9uLnBhdGgsIHVuZGVmaW5lZCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocyk7XG5cdFx0XHRjYXNlIFwiSWZcIjpcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25JZkV4cHJlc3Npb24oYW5ub3RhdGlvbkV4cHJlc3Npb24uSWYpO1xuXHRcdFx0Y2FzZSBcIkFwcGx5XCI6XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uKFxuXHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uIGFzIEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248c3RyaW5nPixcblx0XHRcdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzXG5cdFx0XHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgYW5ub3RhdGlvbiBjb25kaXRpb24gaW50byBhbiBleHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gYW5ub3RhdGlvblZhbHVlIFx0LSB0aGUgY29uZGl0aW9uIG9yIHZhbHVlIGZyb20gdGhlIGFubm90YXRpb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSBhbiBlcXVpdmFsZW50IGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihhbm5vdGF0aW9uVmFsdWU6IENvbmRpdGlvbmFsQ2hlY2tPclZhbHVlKTogRXhwcmVzc2lvbjxUPiB7XG5cdGlmIChhbm5vdGF0aW9uVmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIGFubm90YXRpb25WYWx1ZSAhPT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiBjb25zdGFudChhbm5vdGF0aW9uVmFsdWUgYXMgVCk7XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJE9yXCIpKSB7XG5cdFx0cmV0dXJuIG9yKFxuXHRcdFx0Li4uKCgoYW5ub3RhdGlvblZhbHVlIGFzIE9yQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kT3IubWFwKHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbikgYXMgdW5rbm93bikgYXMgRXhwcmVzc2lvbjxib29sZWFuPltdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkQW5kXCIpKSB7XG5cdFx0cmV0dXJuIGFuZChcblx0XHRcdC4uLigoKGFubm90YXRpb25WYWx1ZSBhcyBBbmRDb25kaXRpb25hbEV4cHJlc3Npb24pLiRBbmQubWFwKHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbikgYXMgdW5rbm93bikgYXMgRXhwcmVzc2lvbjxib29sZWFuPltdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0cmV0dXJuIG5vdChwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBOb3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiROb3RbMF0pKSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRFcVwiKSkge1xuXHRcdHJldHVybiBlcXVhbChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEVxQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kRXFbMF0pLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgRXFDb25kaXRpb25hbEV4cHJlc3Npb24pLiRFcVsxXSlcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJE5lXCIpKSB7XG5cdFx0cmV0dXJuIG5vdEVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTmVDb25kaXRpb25hbEV4cHJlc3Npb24pLiROZVswXSksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBOZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5lWzFdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkR3RcIikpIHtcblx0XHRyZXR1cm4gZ3JlYXRlclRoYW4oXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBHdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEd0WzBdKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEd0Q29uZGl0aW9uYWxFeHByZXNzaW9uKS4kR3RbMV0pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRHZVwiKSkge1xuXHRcdHJldHVybiBncmVhdGVyT3JFcXVhbChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEdlQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kR2VbMF0pLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR2VDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHZVsxXSlcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEx0XCIpKSB7XG5cdFx0cmV0dXJuIGxlc3NUaGFuKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTHRDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMdFswXSksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBMdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEx0WzFdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTGVcIikpIHtcblx0XHRyZXR1cm4gbGVzc09yRXF1YWwoXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBMZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJExlWzBdKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIExlQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kTGVbMV0pXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0cmV0dXJuIGJpbmRpbmdFeHByZXNzaW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgUGF0aENvbmRpdGlvbkV4cHJlc3Npb248VD4pLiRQYXRoKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkQXBwbHlcIikpIHtcblx0XHRyZXR1cm4gYW5ub3RhdGlvbkV4cHJlc3Npb24oe1xuXHRcdFx0dHlwZTogXCJBcHBseVwiLFxuXHRcdFx0RnVuY3Rpb246IChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRnVuY3Rpb24sXG5cdFx0XHRBcHBseTogKGFubm90YXRpb25WYWx1ZSBhcyBhbnkpLiRBcHBseVxuXHRcdH0gYXMgVCk7XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJElmXCIpKSB7XG5cdFx0cmV0dXJuIGFubm90YXRpb25FeHByZXNzaW9uKHtcblx0XHRcdHR5cGU6IFwiSWZcIixcblx0XHRcdElmOiAoYW5ub3RhdGlvblZhbHVlIGFzIGFueSkuJElmXG5cdFx0fSBhcyBUKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkRW51bU1lbWJlclwiKSkge1xuXHRcdHJldHVybiBjb25zdGFudChyZXNvbHZlRW51bVZhbHVlKChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRW51bU1lbWJlcikgYXMgVCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlIGFzIFQpO1xuXHR9XG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUge0lmQW5ub3RhdGlvbkV4cHJlc3Npb25WYWx1ZX0gaW50byBhbiBleHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gYW5ub3RhdGlvbklmRXhwcmVzc2lvbiBcdC0gYW4gSWYgZXhwcmVzc2lvbiByZXR1cm5pbmcgdGhlIHR5cGUgVFxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IHRoZSBlcXVpdmFsZW50IGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25JZkV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KGFubm90YXRpb25JZkV4cHJlc3Npb246IElmQW5ub3RhdGlvbkV4cHJlc3Npb25WYWx1ZTxUPik6IEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uSWZFeHByZXNzaW9uWzBdKSxcblx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbklmRXhwcmVzc2lvblsxXSBhcyBhbnkpLFxuXHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uSWZFeHByZXNzaW9uWzJdIGFzIGFueSlcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25BcHBseUV4cHJlc3Npb24oXG5cdGFubm90YXRpb25BcHBseUV4cHJlc3Npb246IEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248c3RyaW5nPixcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW11cbik6IEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdHN3aXRjaCAoYW5ub3RhdGlvbkFwcGx5RXhwcmVzc2lvbi5GdW5jdGlvbikge1xuXHRcdGNhc2UgXCJvZGF0YS5jb25jYXRcIjpcblx0XHRcdHJldHVybiBjb25jYXQoXG5cdFx0XHRcdC4uLmFubm90YXRpb25BcHBseUV4cHJlc3Npb24uQXBwbHkubWFwKChhcHBseVBhcmFtOiBhbnkpID0+IHtcblx0XHRcdFx0XHRsZXQgYXBwbHlQYXJhbUNvbnZlcnRlZCA9IGFwcGx5UGFyYW07XG5cdFx0XHRcdFx0aWYgKGFwcGx5UGFyYW0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHRcdFx0YXBwbHlQYXJhbUNvbnZlcnRlZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJQYXRoXCIsXG5cdFx0XHRcdFx0XHRcdHBhdGg6IGFwcGx5UGFyYW0uJFBhdGhcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhcHBseVBhcmFtLmhhc093blByb3BlcnR5KFwiJElmXCIpKSB7XG5cdFx0XHRcdFx0XHRhcHBseVBhcmFtQ29udmVydGVkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIklmXCIsXG5cdFx0XHRcdFx0XHRcdElmOiBhcHBseVBhcmFtLiRJZlxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFwcGx5UGFyYW0uaGFzT3duUHJvcGVydHkoXCIkQXBwbHlcIikpIHtcblx0XHRcdFx0XHRcdGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiQXBwbHlcIixcblx0XHRcdFx0XHRcdFx0RnVuY3Rpb246IGFwcGx5UGFyYW0uJEZ1bmN0aW9uLFxuXHRcdFx0XHRcdFx0XHRBcHBseTogYXBwbHlQYXJhbS4kQXBwbHlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uRXhwcmVzc2lvbihhcHBseVBhcmFtQ29udmVydGVkLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzKTtcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblx0fVxufVxuXG4vKipcbiAqIEdlbmVyaWMgaGVscGVyIGZvciB0aGUgY29tcGFyaXNvbiBvcGVyYXRpb25zIChlcXVhbCwgbm90RXF1YWwsIC4uLikuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBvcGVyYXRvciBcdFx0LSB0aGUgb3BlcmF0b3IgdG8gYXBwbHlcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgb3BlcmF0b3JcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgXHQtIHRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBvcGVyYXRvclxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmlzb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yLFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGxlZnRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShsZWZ0T3BlcmFuZCk7XG5cdGNvbnN0IHJpZ2h0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUocmlnaHRPcGVyYW5kKTtcblxuXHRpZiAoaXNDb25zdGFudChsZWZ0RXhwcmVzc2lvbikgJiYgaXNDb25zdGFudChyaWdodEV4cHJlc3Npb24pKSB7XG5cdFx0aWYgKGxlZnRFeHByZXNzaW9uLnZhbHVlID09PSB1bmRlZmluZWQgfHwgcmlnaHRFeHByZXNzaW9uLnZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA9PT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKG9wZXJhdG9yKSB7XG5cdFx0XHRjYXNlIFwiIT09XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSAhPT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI8XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA8IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPD1cIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlIDw9IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPlwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPiByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIj49XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA+PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIj09PVwiOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlID09PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiQ29tcGFyaXNvblwiLFxuXHRcdFx0b3BlcmF0b3I6IG9wZXJhdG9yLFxuXHRcdFx0b3BlcmFuZDE6IGxlZnRFeHByZXNzaW9uLFxuXHRcdFx0b3BlcmFuZDI6IHJpZ2h0RXhwcmVzc2lvblxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImVxdWFsXCIgKD09PSkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGxlZnRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShsZWZ0T3BlcmFuZCk7XG5cdGNvbnN0IHJpZ2h0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUocmlnaHRPcGVyYW5kKTtcblxuXHRpZiAoZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0fVxuXG5cdGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBleHByZXNzaW9uRXF1YWxzKGxlZnRFeHByZXNzaW9uLm9uVHJ1ZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBsZWZ0RXhwcmVzc2lvbi5jb25kaXRpb247XG5cdH0gZWxzZSBpZiAobGVmdEV4cHJlc3Npb24uX3R5cGUgPT09IFwiSWZFbHNlXCIgJiYgZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlLCByaWdodEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIG5vdChsZWZ0RXhwcmVzc2lvbi5jb25kaXRpb24pO1xuXHR9XG5cblx0cmV0dXJuIGNvbXBhcmlzb24oXCI9PT1cIiwgbGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbik7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJub3QgZXF1YWxcIiAoIT09KS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3RFcXVhbDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgbGVmdEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGxlZnRPcGVyYW5kKTtcblx0Y29uc3QgcmlnaHRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShyaWdodE9wZXJhbmQpO1xuXG5cdGlmIChleHByZXNzaW9uRXF1YWxzKGxlZnRFeHByZXNzaW9uLCByaWdodEV4cHJlc3Npb24pKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fVxuXG5cdGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBleHByZXNzaW9uRXF1YWxzKGxlZnRFeHByZXNzaW9uLm9uVHJ1ZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBub3QobGVmdEV4cHJlc3Npb24uY29uZGl0aW9uKTtcblx0fSBlbHNlIGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBleHByZXNzaW9uRXF1YWxzKGxlZnRFeHByZXNzaW9uLm9uRmFsc2UsIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gbGVmdEV4cHJlc3Npb24uY29uZGl0aW9uO1xuXHR9IGVsc2UgaWYgKFxuXHRcdGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmXG5cdFx0bGVmdEV4cHJlc3Npb24ub25UcnVlLl90eXBlID09PSByaWdodEV4cHJlc3Npb24uX3R5cGUgJiZcblx0XHQhZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vblRydWUsIHJpZ2h0RXhwcmVzc2lvbikgJiZcblx0XHRsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlLl90eXBlID09PSByaWdodEV4cHJlc3Npb24uX3R5cGUgJiZcblx0XHQhZXhwcmVzc2lvbkVxdWFscyhsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlLCByaWdodEV4cHJlc3Npb24pXG5cdCkge1xuXHRcdC8vIElmIHRoZSBsZWZ0IGV4cHJlc3Npb24gaXMgYW4gaWYgZWxzZSB3aGVyZSBib3RoIG9uVHJ1ZSBhbmQgb25GYWxzZSBhcmUgbm90IGVxdWFscyB0byB0aGUgcmlnaHQgZXhwcmVzc2lvbiAtPiBzaW1wbGlmeSBhcyB0cnVlXG5cdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHR9XG5cblx0cmV0dXJuIGNvbXBhcmlzb24oXCIhPT1cIiwgbGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbik7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJncmVhdGVyIG9yIGVxdWFsXCIgKD49KS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmVhdGVyT3JFcXVhbDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNvbXBhcmlzb24oXCI+PVwiLCBsZWZ0T3BlcmFuZCwgcmlnaHRPcGVyYW5kKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImdyZWF0ZXIgdGhhblwiICg+KS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFx0LSB0aGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IGFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmVhdGVyVGhhbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNvbXBhcmlzb24oXCI+XCIsIGxlZnRPcGVyYW5kLCByaWdodE9wZXJhbmQpO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibGVzcyBvciBlcXVhbFwiICg8PSkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVzc09yRXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPD1cIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJsZXNzIHRoYW5cIiAoPCkuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBcdC0gdGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBhbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVzc1RoYW48VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPFwiLCBsZWZ0T3BlcmFuZCwgcmlnaHRPcGVyYW5kKTtcbn1cblxuLyoqXG4gKiBJZi10aGVuLWVsc2UgZXhwcmVzc2lvbi5cbiAqXG4gKiBFdmFsdWF0ZXMgdG8gb25UcnVlIGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWUsIGVsc2UgZXZhbHVhdGVzIHRvIG9uRmFsc2UuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBjb25kaXRpb24gLSB0aGUgY29uZGl0aW9uIHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0gb25UcnVlIFx0LSBleHByZXNzaW9uIHJlc3VsdCBpZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlXG4gKiBAcGFyYW0gb25GYWxzZSBcdC0gZXhwcmVzc2lvbiByZXN1bHQgaWYgdGhlIGNvbmRpdGlvbiBldmFsdWF0ZXMgdG8gZmFsc2VcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSB0aGUgZXhwcmVzc2lvbiB0aGF0IHJlcHJlc2VudHMgdGhpcyBjb25kaXRpb25hbCBjaGVja1xuICovXG5leHBvcnQgZnVuY3Rpb24gaWZFbHNlPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0Y29uZGl0aW9uOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4sXG5cdG9uVHJ1ZTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRvbkZhbHNlOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248VD4ge1xuXHRsZXQgY29uZGl0aW9uRXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUoY29uZGl0aW9uKTtcblx0bGV0IG9uVHJ1ZUV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKG9uVHJ1ZSk7XG5cdGxldCBvbkZhbHNlRXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUob25GYWxzZSk7XG5cblx0Ly8gc3dhcCBicmFuY2hlcyBpZiB0aGUgY29uZGl0aW9uIGlzIGEgbmVnYXRpb25cblx0aWYgKGNvbmRpdGlvbkV4cHJlc3Npb24uX3R5cGUgPT09IFwiTm90XCIpIHtcblx0XHQvLyBpZkVsc2Uobm90KFgpLCBhLCBiKSAtLT4gaWZFbHNlKFgsIGIsIGEpXG5cdFx0W29uVHJ1ZUV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uXSA9IFtvbkZhbHNlRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbl07XG5cdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uKTtcblx0fVxuXG5cdC8vIGlubGluZSBuZXN0ZWQgaWYtZWxzZSBleHByZXNzaW9uczogb25UcnVlIGJyYW5jaFxuXHQvLyBpZkVsc2UoWCwgaWZFbHNlKFgsIGEsIGIpLCBjKSA9PT4gaWZFbHNlKFgsIGEsIGMpXG5cdGlmIChvblRydWVFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmIGV4cHJlc3Npb25FcXVhbHMoY29uZGl0aW9uRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbi5jb25kaXRpb24pKSB7XG5cdFx0b25UcnVlRXhwcmVzc2lvbiA9IG9uVHJ1ZUV4cHJlc3Npb24ub25UcnVlO1xuXHR9XG5cblx0Ly8gaW5saW5lIG5lc3RlZCBpZi1lbHNlIGV4cHJlc3Npb25zOiBvbkZhbHNlIGJyYW5jaFxuXHQvLyBpZkVsc2UoWCwgYSwgaWZFbHNlKFgsIGIsIGMpKSA9PT4gaWZFbHNlKFgsIGEsIGMpXG5cdGlmIChvbkZhbHNlRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBleHByZXNzaW9uRXF1YWxzKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uLmNvbmRpdGlvbikpIHtcblx0XHRvbkZhbHNlRXhwcmVzc2lvbiA9IG9uRmFsc2VFeHByZXNzaW9uLm9uRmFsc2U7XG5cdH1cblxuXHQvLyBpbmxpbmUgbmVzdGVkIGlmLWVsc2UgZXhwcmVzc2lvbnM6IGNvbmRpdGlvblxuXHRpZiAoY29uZGl0aW9uRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIikge1xuXHRcdGlmIChcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vbkZhbHNlKSAmJlxuXHRcdFx0IWNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZS52YWx1ZSAmJlxuXHRcdFx0aXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZSkgJiZcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24ub25UcnVlLnZhbHVlXG5cdFx0KSB7XG5cdFx0XHQvLyBpZkVsc2UoaWZFbHNlKFgsIHRydWUsIGZhbHNlKSwgYSwgYikgPT0+IGlmRWxzZShYLCBhLCBiKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IGNvbmRpdGlvbkV4cHJlc3Npb24uY29uZGl0aW9uO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZSkgJiZcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZS52YWx1ZSAmJlxuXHRcdFx0aXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZSkgJiZcblx0XHRcdCFjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZS52YWx1ZVxuXHRcdCkge1xuXHRcdFx0Ly8gaWZFbHNlKGlmRWxzZShYLCBmYWxzZSwgdHJ1ZSksIGEsIGIpID09PiBpZkVsc2Uobm90KFgpLCBhLCBiKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uLmNvbmRpdGlvbik7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUpICYmXG5cdFx0XHQhY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUudmFsdWUgJiZcblx0XHRcdCFpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZSlcblx0XHQpIHtcblx0XHRcdC8vIGlmRWxzZShpZkVsc2UoWCwgZmFsc2UsIGEpLCBiLCBjKSA9PT4gaWZFbHNlKGFuZChub3QoWCksIGEpLCBiLCBjKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IGFuZChub3QoY29uZGl0aW9uRXhwcmVzc2lvbi5jb25kaXRpb24pLCBjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdC8vIGFnYWluIHN3YXAgYnJhbmNoZXMgaWYgbmVlZGVkIChpbiBjYXNlIG9uZSBvZiB0aGUgb3B0aW1pemF0aW9ucyBhYm92ZSBsZWQgdG8gYSBuZWdhdGVkIGNvbmRpdGlvbilcblx0aWYgKGNvbmRpdGlvbkV4cHJlc3Npb24uX3R5cGUgPT09IFwiTm90XCIpIHtcblx0XHQvLyBpZkVsc2Uobm90KFgpLCBhLCBiKSAtLT4gaWZFbHNlKFgsIGIsIGEpXG5cdFx0W29uVHJ1ZUV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uXSA9IFtvbkZhbHNlRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbl07XG5cdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uKTtcblx0fVxuXG5cdC8vIGNvbXB1dGUgZXhwcmVzc2lvbiByZXN1bHQgZm9yIGNvbnN0YW50IGNvbmRpdGlvbnNcblx0aWYgKGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uZGl0aW9uRXhwcmVzc2lvbi52YWx1ZSA/IG9uVHJ1ZUV4cHJlc3Npb24gOiBvbkZhbHNlRXhwcmVzc2lvbjtcblx0fVxuXG5cdC8vIGNvbXB1dGUgZXhwcmVzc2lvbiByZXN1bHQgaWYgb25UcnVlIGFuZCBvbkZhbHNlIGJyYW5jaGVzIGFyZSBlcXVhbFxuXHRpZiAoZXhwcmVzc2lvbkVxdWFscyhvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gb25UcnVlRXhwcmVzc2lvbjtcblx0fVxuXG5cdC8vIElmIGVpdGhlciB0cnVlRXhwcmVzc2lvbiBvciBmYWxzZUV4cHJlc3Npb24gaXMgYSB2YWx1ZSBlcXVhbHMgdG8gZmFsc2UgdGhlIGV4cHJlc3Npb24gY2FuIGJlIHNpbXBsaWZpZWRcblx0Ly8gSWYoQ29uZGl0aW9uKSBUaGVuIFhYWCBFbHNlIEZhbHNlIC0+IENvbmRpdGlvbiAmJiBYWFhcblx0aWYgKGlzQ29uc3RhbnQob25GYWxzZUV4cHJlc3Npb24pICYmIG9uRmFsc2VFeHByZXNzaW9uLnZhbHVlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBhbmQoY29uZGl0aW9uRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbiBhcyBFeHByZXNzaW9uPGJvb2xlYW4+KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9XG5cdC8vIElmKENvbmRpdGlvbikgVGhlbiBGYWxzZSBFbHNlIFhYWCAtPiAhQ29uZGl0aW9uICYmIFhYWFxuXHRpZiAoaXNDb25zdGFudChvblRydWVFeHByZXNzaW9uKSAmJiBvblRydWVFeHByZXNzaW9uLnZhbHVlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBhbmQobm90KGNvbmRpdGlvbkV4cHJlc3Npb24pLCBvbkZhbHNlRXhwcmVzc2lvbiBhcyBFeHByZXNzaW9uPGJvb2xlYW4+KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJJZkVsc2VcIixcblx0XHRjb25kaXRpb246IGNvbmRpdGlvbkV4cHJlc3Npb24sXG5cdFx0b25UcnVlOiBvblRydWVFeHByZXNzaW9uLFxuXHRcdG9uRmFsc2U6IG9uRmFsc2VFeHByZXNzaW9uXG5cdH07XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBoYXMgYSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgbW9kZWwgKHVuZGVmaW5lZCkuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gXHQtIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgZGVmYXVsdCBjb250ZXh0XG4gKi9cbmZ1bmN0aW9uIGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+KTogYm9vbGVhbiB7XG5cdHN3aXRjaCAoZXhwcmVzc2lvbi5fdHlwZSkge1xuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdGNhc2UgXCJGb3JtYXR0ZXJcIjpcblx0XHRjYXNlIFwiQ29tcGxleFR5cGVcIjpcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRjYXNlIFwiU2V0XCI6XG5cdFx0XHRyZXR1cm4gZXhwcmVzc2lvbi5vcGVyYW5kcy5zb21lKGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQpO1xuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gZXhwcmVzc2lvbi5tb2RlbE5hbWUgPT09IHVuZGVmaW5lZDtcblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0cmV0dXJuIGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vcGVyYW5kMSkgfHwgaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dChleHByZXNzaW9uLm9wZXJhbmQyKTtcblx0XHRjYXNlIFwiRGVmYXVsdEJpbmRpbmdcIjpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhc2UgXCJJZkVsc2VcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5jb25kaXRpb24pIHx8XG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vblRydWUpIHx8XG5cdFx0XHRcdGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vbkZhbHNlKVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRyZXR1cm4gaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dChleHByZXNzaW9uLm9wZXJhbmQpO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxudHlwZSBGbjxUPiA9ICgoLi4ucGFyYW1zOiBhbnkpID0+IFQpICYge1xuXHRfX2Z1bmN0aW9uTmFtZTogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiBXcmFwcGVkVHVwbGVcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuLy8gQHRzLWlnbm9yZVxudHlwZSBXcmFwcGVkVHVwbGU8VD4gPSB7IFtLIGluIGtleW9mIFRdOiBXcmFwcGVkVHVwbGU8VFtLXT4gfCBFeHByZXNzaW9uT3JQcmltaXRpdmU8VFtLXT4gfTtcblxuLy8gU28sIHRoaXMgd29ya3MgYnV0IEkgY2Fubm90IGdldCBpdCB0byBjb21waWxlIDpELCBidXQgaXQgc3RpbGwgZG9lcyB3aGF0IGlzIGV4cGVjdGVkLi4uXG5cbi8qKlxuICogQSBmdW5jdGlvbiByZWZlcmVuY2Ugb3IgYSBmdW5jdGlvbiBuYW1lLlxuICovXG50eXBlIEZ1bmN0aW9uT3JOYW1lPFQ+ID0gRm48VD4gfCBzdHJpbmc7XG5cbi8qKlxuICogRnVuY3Rpb24gcGFyYW1ldGVycywgZWl0aGVyIGRlcml2ZWQgZnJvbSB0aGUgZnVuY3Rpb24gb3IgYW4gdW50eXBlZCBhcnJheS5cbiAqL1xudHlwZSBGdW5jdGlvblBhcmFtZXRlcnM8VCwgRiBleHRlbmRzIEZ1bmN0aW9uT3JOYW1lPFQ+PiA9IEYgZXh0ZW5kcyBGbjxUPiA/IFBhcmFtZXRlcnM8Rj4gOiBhbnlbXTtcblxuLyoqXG4gKiBDYWxscyBhIGZvcm1hdHRlciBmdW5jdGlvbiB0byBwcm9jZXNzIHRoZSBwYXJhbWV0ZXJzLlxuICogSWYgcmVxdWlyZUNvbnRleHQgaXMgc2V0IHRvIHRydWUgYW5kIG5vIGNvbnRleHQgaXMgcGFzc2VkIGEgZGVmYXVsdCBjb250ZXh0IHdpbGwgYmUgYWRkZWQgYXV0b21hdGljYWxseS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHRlbXBsYXRlIFVcbiAqIEBwYXJhbSBwYXJhbWV0ZXJzIHRoZSBsaXN0IG9mIHBhcmFtZXRlciB0aGF0IHNob3VsZCBtYXRjaCB0aGUgdHlwZSBhbmQgbnVtYmVyIG9mIHRoZSBmb3JtYXR0ZXIgZnVuY3Rpb25cbiAqIEBwYXJhbSBmb3JtYXR0ZXJGdW5jdGlvbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtIFtjb250ZXh0RW50aXR5VHlwZV0gdGhlIGNvbnRleHQgZW50aXR5IHR5cGUgdG8gY29uc2lkZXJcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSB0aGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRSZXN1bHQ8VCwgVSBleHRlbmRzIEZuPFQ+Pihcblx0cGFyYW1ldGVyczogV3JhcHBlZFR1cGxlPFBhcmFtZXRlcnM8VT4+LFxuXHRmb3JtYXR0ZXJGdW5jdGlvbjogVSxcblx0Y29udGV4dEVudGl0eVR5cGU/OiBFbnRpdHlUeXBlXG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0Y29uc3QgcGFyYW1ldGVyRXhwcmVzc2lvbnMgPSAocGFyYW1ldGVycyBhcyBhbnlbXSkubWFwKHdyYXBQcmltaXRpdmUpO1xuXG5cdC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIHBhcmFtZXRlciBhbmQgaXQgaXMgYSBjb25zdGFudCBhbmQgd2UgZG9uJ3QgZXhwZWN0IHRoZSBjb250ZXh0IHRoZW4gcmV0dXJuIHRoZSBjb25zdGFudFxuXHRpZiAocGFyYW1ldGVyRXhwcmVzc2lvbnMubGVuZ3RoID09PSAxICYmIGlzQ29uc3RhbnQocGFyYW1ldGVyRXhwcmVzc2lvbnNbMF0pICYmICFjb250ZXh0RW50aXR5VHlwZSkge1xuXHRcdHJldHVybiBwYXJhbWV0ZXJFeHByZXNzaW9uc1swXTtcblx0fSBlbHNlIGlmICghIWNvbnRleHRFbnRpdHlUeXBlKSB7XG5cdFx0Ly8gT3RoZXJ3aXNlLCBpZiB0aGUgY29udGV4dCBpcyByZXF1aXJlZCBhbmQgbm8gY29udGV4dCBpcyBwcm92aWRlZCBtYWtlIHN1cmUgdG8gYWRkIHRoZSBkZWZhdWx0IGJpbmRpbmdcblx0XHRpZiAoIXBhcmFtZXRlckV4cHJlc3Npb25zLnNvbWUoaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dCkpIHtcblx0XHRcdGNvbnRleHRFbnRpdHlUeXBlLmtleXMuZm9yRWFjaChrZXkgPT4gcGFyYW1ldGVyRXhwcmVzc2lvbnMucHVzaChiaW5kaW5nRXhwcmVzc2lvbihrZXkubmFtZSwgXCJcIikpKTtcblx0XHR9XG5cdH1cblxuXHQvLyBGb3JtYXR0ZXJOYW1lIGNhbiBiZSBvZiBmb3JtYXQgc2FwLmZlLmNvcmUueHh4I21ldGhvZE5hbWUgdG8gaGF2ZSBtdWx0aXBsZSBmb3JtYXR0ZXIgaW4gb25lIGNsYXNzXG5cdGNvbnN0IFtmb3JtYXR0ZXJDbGFzcywgZm9ybWF0dGVyTmFtZV0gPSBmb3JtYXR0ZXJGdW5jdGlvbi5fX2Z1bmN0aW9uTmFtZS5zcGxpdChcIiNcIik7XG5cblx0aWYgKCEhZm9ybWF0dGVyTmFtZSAmJiBmb3JtYXR0ZXJOYW1lLmxlbmd0aCA+IDApIHtcblx0XHRwYXJhbWV0ZXJFeHByZXNzaW9ucy51bnNoaWZ0KGNvbnN0YW50KGZvcm1hdHRlck5hbWUpKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiRm9ybWF0dGVyXCIsXG5cdFx0Zm46IGZvcm1hdHRlckNsYXNzLFxuXHRcdHBhcmFtZXRlcnM6IHBhcmFtZXRlckV4cHJlc3Npb25zXG5cdH07XG59XG5cbi8qKlxuICogQ2FsbHMgYSBjb21wbGV4IHR5cGUgIHRvIHByb2Nlc3MgdGhlIHBhcmFtZXRlcnMuXG4gKiBJZiByZXF1aXJlQ29udGV4dCBpcyBzZXQgdG8gdHJ1ZSBhbmQgbm8gY29udGV4dCBpcyBwYXNzZWQgYSBkZWZhdWx0IGNvbnRleHQgd2lsbCBiZSBhZGRlZCBhdXRvbWF0aWNhbGx5LlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdGVtcGxhdGUgVVxuICogQHBhcmFtIHBhcmFtZXRlcnMgdGhlIGxpc3Qgb2YgcGFyYW1ldGVyIHRoYXQgc2hvdWxkIG1hdGNoIHRoZSB0eXBlIGZvciB0aGUgY29tcHBsZXggdHlwZVxuICogQHBhcmFtIHR5cGUgdGhlIGNvbXBsZXggdHlwZSB0byB1c2VcbiAqIEBwYXJhbSBbY29udGV4dEVudGl0eVR5cGVdIHRoZSBjb250ZXh0IGVudGl0eSB0eXBlIHRvIGNvbnNpZGVyXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxUPn0gdGhlIGNvcnJlc3BvbmRpbmcgZXhwcmVzc2lvblxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVHlwZUluZm9ybWF0aW9uPFQsIFUgZXh0ZW5kcyBGbjxUPj4oXG5cdHBhcmFtZXRlcnM6IFdyYXBwZWRUdXBsZTxQYXJhbWV0ZXJzPFU+Pixcblx0dHlwZTogc3RyaW5nLFxuXHRjb250ZXh0RW50aXR5VHlwZT86IEVudGl0eVR5cGVcbik6IEV4cHJlc3Npb248VD4ge1xuXHRjb25zdCBwYXJhbWV0ZXJFeHByZXNzaW9ucyA9IChwYXJhbWV0ZXJzIGFzIGFueVtdKS5tYXAod3JhcFByaW1pdGl2ZSk7XG5cblx0Ly8gSWYgdGhlcmUgaXMgb25seSBvbmUgcGFyYW1ldGVyIGFuZCBpdCBpcyBhIGNvbnN0YW50IGFuZCB3ZSBkb24ndCBleHBlY3QgdGhlIGNvbnRleHQgdGhlbiByZXR1cm4gdGhlIGNvbnN0YW50XG5cdGlmIChwYXJhbWV0ZXJFeHByZXNzaW9ucy5sZW5ndGggPT09IDEgJiYgaXNDb25zdGFudChwYXJhbWV0ZXJFeHByZXNzaW9uc1swXSkgJiYgIWNvbnRleHRFbnRpdHlUeXBlKSB7XG5cdFx0cmV0dXJuIHBhcmFtZXRlckV4cHJlc3Npb25zWzBdO1xuXHR9IGVsc2UgaWYgKCEhY29udGV4dEVudGl0eVR5cGUpIHtcblx0XHQvLyBPdGhlcndpc2UsIGlmIHRoZSBjb250ZXh0IGlzIHJlcXVpcmVkIGFuZCBubyBjb250ZXh0IGlzIHByb3ZpZGVkIG1ha2Ugc3VyZSB0byBhZGQgdGhlIGRlZmF1bHQgYmluZGluZ1xuXHRcdGlmICghcGFyYW1ldGVyRXhwcmVzc2lvbnMuc29tZShoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KSkge1xuXHRcdFx0Y29udGV4dEVudGl0eVR5cGUua2V5cy5mb3JFYWNoKGtleSA9PiBwYXJhbWV0ZXJFeHByZXNzaW9ucy5wdXNoKGJpbmRpbmdFeHByZXNzaW9uKGtleS5uYW1lLCBcIlwiKSkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIixcblx0XHR0eXBlOiB0eXBlLFxuXHRcdGZvcm1hdE9wdGlvbnM6IHt9LFxuXHRcdHBhcmFtZXRlcnM6IHt9LFxuXHRcdGJpbmRpbmdQYXJhbWV0ZXJzOiBwYXJhbWV0ZXJFeHByZXNzaW9uc1xuXHR9O1xufVxuLyoqXG4gKiBGdW5jdGlvbiBjYWxsLCBvcHRpb25hbGx5IHdpdGggYXJndW1lbnRzLlxuICpcbiAqIEBwYXJhbSBmblx0XHRcdC0gRnVuY3Rpb24gbmFtZSBvciByZWZlcmVuY2UgdG8gZnVuY3Rpb25cbiAqIEBwYXJhbSBwYXJhbWV0ZXJzXHQtIEFyZ3VtZW50c1xuICogQHBhcmFtIG9uXHRcdFx0LSBPYmplY3QgdG8gY2FsbCB0aGUgZnVuY3Rpb24gb25cbiAqIEByZXR1cm5zIHtGdW5jdGlvbkV4cHJlc3Npb248VD59IC0gRXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGZ1bmN0aW9uIGNhbGwgKG5vdCB0aGUgcmVzdWx0IG9mIHRoZSBmdW5jdGlvbiBjYWxsISlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZuPFQsIFUgZXh0ZW5kcyBGdW5jdGlvbk9yTmFtZTxUPj4oXG5cdGZuOiBVLFxuXHRwYXJhbWV0ZXJzOiBXcmFwcGVkVHVwbGU8RnVuY3Rpb25QYXJhbWV0ZXJzPFQsIFU+Pixcblx0b24/OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8b2JqZWN0PlxuKTogRnVuY3Rpb25FeHByZXNzaW9uPFQ+IHtcblx0Y29uc3QgZnVuY3Rpb25OYW1lID0gdHlwZW9mIGZuID09PSBcInN0cmluZ1wiID8gZm4gOiAoZm4gYXMgRm48VD4pLl9fZnVuY3Rpb25OYW1lO1xuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkZ1bmN0aW9uXCIsXG5cdFx0b2JqOiBvbiAhPT0gdW5kZWZpbmVkID8gd3JhcFByaW1pdGl2ZShvbikgOiB1bmRlZmluZWQsXG5cdFx0Zm46IGZ1bmN0aW9uTmFtZSxcblx0XHRwYXJhbWV0ZXJzOiAocGFyYW1ldGVycyBhcyBhbnlbXSkubWFwKHdyYXBQcmltaXRpdmUpXG5cdH07XG59XG5cbi8qKlxuICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgYmluZGluZyB2YWx1ZSBpcyBudWxsLCB1bmRlZmluZWQgb3IgZW1wdHkuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb25cbiAqIEByZXR1cm5zIGEgYm9vbGVhbiBleHByZXNzaW9uIGV2YWx1YXRpbmcgdGhlIGZhY3QgdGhhdCB0aGUgY3VycmVudCBlbGVtZW50IGlzIGVtcHR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KGV4cHJlc3Npb246IEV4cHJlc3Npb248c3RyaW5nPik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRpZiAoZXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJDb25jYXRcIikge1xuXHRcdHJldHVybiBvciguLi5leHByZXNzaW9uLmV4cHJlc3Npb25zLm1hcChpc0VtcHR5KSk7XG5cdH1cblx0cmV0dXJuIG9yKGVxdWFsKGV4cHJlc3Npb24sIFwiXCIpLCBlcXVhbChleHByZXNzaW9uLCB1bmRlZmluZWQpLCBlcXVhbChleHByZXNzaW9uLCBudWxsKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQoLi4uaW5FeHByZXNzaW9uczogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPHN0cmluZz5bXSk6IEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IGV4cHJlc3Npb25zID0gaW5FeHByZXNzaW9ucy5tYXAod3JhcFByaW1pdGl2ZSk7XG5cdGlmIChleHByZXNzaW9ucy5ldmVyeShpc0NvbnN0YW50KSkge1xuXHRcdHJldHVybiBjb25zdGFudChcblx0XHRcdGV4cHJlc3Npb25zLnJlZHVjZSgoY29uY2F0ZW5hdGVkOiBzdHJpbmcsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdHJldHVybiBjb25jYXRlbmF0ZWQgKyAodmFsdWUgYXMgQ29uc3RhbnRFeHByZXNzaW9uPGFueT4pLnZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR9LCBcIlwiKVxuXHRcdCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJDb25jYXRcIixcblx0XHRleHByZXNzaW9uczogZXhwcmVzc2lvbnNcblx0fTtcbn1cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtRnVuY3Rpb24gPSA8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGUgfCB1bmtub3duPihleHByZXNzaW9uUGFydDogYW55KSA9PiBFeHByZXNzaW9uPFQ+O1xuZXhwb3J0IHR5cGUgRXhwcmVzc2lvblR5cGUgPSBQaWNrPEV4cHJlc3Npb248YW55PiwgXCJfdHlwZVwiPltcIl90eXBlXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUmVjdXJzaXZlbHk8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGUgfCB1bmtub3duPihcblx0aW5FeHByZXNzaW9uOiBFeHByZXNzaW9uPFQ+LFxuXHRleHByZXNzaW9uVHlwZTogRXhwcmVzc2lvblR5cGUsXG5cdHRyYW5zZm9ybUZ1bmN0aW9uOiBUcmFuc2Zvcm1GdW5jdGlvblxuKTogRXhwcmVzc2lvbjxUPiB7XG5cdGxldCBleHByZXNzaW9uID0gaW5FeHByZXNzaW9uO1xuXHRpZiAoZXhwcmVzc2lvblR5cGUgPT09IGV4cHJlc3Npb24uX3R5cGUpIHtcblx0XHRleHByZXNzaW9uID0gdHJhbnNmb3JtRnVuY3Rpb24oaW5FeHByZXNzaW9uKTtcblx0fSBlbHNlIHtcblx0XHRzd2l0Y2ggKGV4cHJlc3Npb24uX3R5cGUpIHtcblx0XHRcdGNhc2UgXCJGdW5jdGlvblwiOlxuXHRcdFx0XHRleHByZXNzaW9uLnBhcmFtZXRlcnMgPSBleHByZXNzaW9uLnBhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkNvbmNhdFwiOlxuXHRcdFx0XHRleHByZXNzaW9uLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbi5leHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PlxuXHRcdFx0XHRcdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24sIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbilcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiQ29tcGxleFR5cGVcIjpcblx0XHRcdFx0ZXhwcmVzc2lvbi5iaW5kaW5nUGFyYW1ldGVycyA9IGV4cHJlc3Npb24uYmluZGluZ1BhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkZvcm1hdHRlclwiOlxuXHRcdFx0XHRleHByZXNzaW9uLnBhcmFtZXRlcnMgPSBleHByZXNzaW9uLnBhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiSWZFbHNlXCI6XG5cdFx0XHRcdGV4cHJlc3Npb24ub25UcnVlID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vblRydWUsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbik7XG5cdFx0XHRcdGV4cHJlc3Npb24ub25GYWxzZSA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub25GYWxzZSwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0Ly8gZXhwcmVzc2lvbi5jb25kaXRpb24gPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLmNvbmRpdGlvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZCA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub3BlcmFuZCwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiU2V0XCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZHMgPSBleHByZXNzaW9uLm9wZXJhbmRzLm1hcChleHByZXNzaW9uID0+XG5cdFx0XHRcdC8vIFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKVxuXHRcdFx0XHQvLyApO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRcdC8vIGV4cHJlc3Npb24ub3BlcmFuZDEgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9wZXJhbmQxLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24pO1xuXHRcdFx0XHQvLyBleHByZXNzaW9uLm9wZXJhbmQyID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vcGVyYW5kMiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRGVmYXVsdEJpbmRpbmdcIjpcblx0XHRcdGNhc2UgXCJSZWZcIjpcblx0XHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRcdFx0Ly8gRG8gbm90aGluZ1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cmV0dXJuIGV4cHJlc3Npb247XG59XG5cbmV4cG9ydCB0eXBlIEJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gVCB8IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDb21waWxlIGFuIGV4cHJlc3Npb24gaW50byBhbiBleHByZXNzaW9uIGJpbmRpbmcuXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBleHByZXNzaW9uXHRcdFx0LSB0aGUgZXhwcmVzc2lvbiB0byBjb21waWxlXG4gKiBAcGFyYW0gZW1iZWRkZWRJbkJpbmRpbmcgXHQtIHdoZXRoZXIgdGhlIGV4cHJlc3Npb24gdG8gY29tcGlsZSBpcyBlbWJlZGRlZCBpbnRvIGFub3RoZXIgZXhwcmVzc2lvblxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uPFQ+fSB0aGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uIGJpbmRpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVCaW5kaW5nPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0ZXhwcmVzc2lvbjogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRlbWJlZGRlZEluQmluZGluZzogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgZXhwciA9IHdyYXBQcmltaXRpdmUoZXhwcmVzc2lvbik7XG5cdGxldCBvdXRQcm9wZXJ0eSA9IFwiXCI7XG5cdHN3aXRjaCAoZXhwci5fdHlwZSkge1xuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdFx0aWYgKGV4cHIudmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIFwibnVsbFwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV4cHIudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gXCJ1bmRlZmluZWRcIjtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgZXhwci52YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShleHByLnZhbHVlKSkge1xuXHRcdFx0XHRcdGNvbnN0IGVudHJpZXMgPSBleHByLnZhbHVlLm1hcChleHByZXNzaW9uID0+IGNvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24sIHRydWUpKTtcblx0XHRcdFx0XHRyZXR1cm4gYFske2VudHJpZXMuam9pbihcIiwgXCIpfV1gO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIE9iamVjdHNcblx0XHRcdFx0XHRjb25zdCBvID0gZXhwci52YWx1ZSBhcyBQbGFpbkV4cHJlc3Npb25PYmplY3Q7XG5cdFx0XHRcdFx0Y29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5rZXlzKG8pLm1hcChrZXkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvW2tleV07XG5cdFx0XHRcdFx0XHRyZXR1cm4gYCR7a2V5fTogJHtjb21waWxlQmluZGluZyh2YWx1ZSwgdHJ1ZSl9YDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gYHske3Byb3BlcnRpZXMuam9pbihcIiwgXCIpfX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGVvZiBleHByLnZhbHVlKSB7XG5cdFx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOlxuXHRcdFx0XHRcdGNhc2UgXCJiaWdpbnRcIjpcblx0XHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGV4cHIudmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRjYXNlIFwic3RyaW5nXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gYCcke2V4cHIudmFsdWUudG9TdHJpbmcoKX0nYDtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBleHByLnZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0XHRyZXR1cm4gZXhwci5yZWYgfHwgXCJudWxsXCI7XG5cblx0XHRjYXNlIFwiRnVuY3Rpb25cIjpcblx0XHRcdGNvbnN0IGFyZ3VtZW50U3RyaW5nID0gYCR7ZXhwci5wYXJhbWV0ZXJzLm1hcChhcmcgPT4gY29tcGlsZUJpbmRpbmcoYXJnLCB0cnVlKSkuam9pbihcIiwgXCIpfWA7XG5cdFx0XHRyZXR1cm4gZXhwci5vYmogPT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IGAke2V4cHIuZm59KCR7YXJndW1lbnRTdHJpbmd9KWBcblx0XHRcdFx0OiBgJHtjb21waWxlQmluZGluZyhleHByLm9iaiwgdHJ1ZSl9LiR7ZXhwci5mbn0oJHthcmd1bWVudFN0cmluZ30pYDtcblx0XHRjYXNlIFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7ZXhwci52YWx1ZS5zdWJzdHIoMiwgZXhwci52YWx1ZS5sZW5ndGggLSAzKX0pYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgJHtleHByLnZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcIkVtYmVkZGVkQmluZGluZ1wiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgXFwlJHtleHByLnZhbHVlfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYCR7ZXhwci52YWx1ZX1gO1xuXHRcdFx0fVxuXHRcdGNhc2UgXCJEZWZhdWx0QmluZGluZ1wiOlxuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRpZiAoZXhwci50eXBlIHx8IGV4cHIucGFyYW1ldGVycyB8fCBleHByLnRhcmdldFR5cGUpIHtcblx0XHRcdFx0bGV0IG91dEJpbmRpbmcgPSBcIlwiO1xuXHRcdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0XHRvdXRCaW5kaW5nICs9IGBcXCVgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dEJpbmRpbmcgKz0gYHtwYXRoOicke2V4cHIubW9kZWxOYW1lID8gYCR7ZXhwci5tb2RlbE5hbWV9PmAgOiBcIlwifSR7ZXhwci5wYXRofSdgO1xuXHRcdFx0XHRpZiAoZXhwci50eXBlKSB7XG5cdFx0XHRcdFx0b3V0QmluZGluZyArPSBgLCB0eXBlOiAnJHtleHByLnR5cGV9J2A7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIuY29uc3RyYWludHMgJiYgT2JqZWN0LmtleXMoZXhwci5jb25zdHJhaW50cykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCwgY29uc3RyYWludHM6ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5jb25zdHJhaW50cyl9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXhwci5mb3JtYXRPcHRpb25zKSB7XG5cdFx0XHRcdFx0b3V0QmluZGluZyArPSBgLCBmb3JtYXRPcHRpb25zOiAke2NvbXBpbGVCaW5kaW5nKGV4cHIuZm9ybWF0T3B0aW9ucyl9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXhwci5wYXJhbWV0ZXJzICYmIE9iamVjdC5rZXlzKGV4cHIucGFyYW1ldGVycykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCwgcGFyYW1ldGVyczogJHtjb21waWxlQmluZGluZyhleHByLnBhcmFtZXRlcnMpfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCwgdGFyZ2V0VHlwZTogJyR7ZXhwci50YXJnZXRUeXBlfSdgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dEJpbmRpbmcgKz0gXCJ9XCI7XG5cdFx0XHRcdHJldHVybiBvdXRCaW5kaW5nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGBcXCV7JHtleHByLm1vZGVsTmFtZSA/IGAke2V4cHIubW9kZWxOYW1lfT5gIDogXCJcIn0ke2V4cHIucGF0aH19YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gYHske2V4cHIubW9kZWxOYW1lID8gYCR7ZXhwci5tb2RlbE5hbWV9PmAgOiBcIlwifSR7ZXhwci5wYXRofX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0Y29uc3QgY29tcGFyaXNvblBhcnQgPSBgJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQxLCB0cnVlKX0gJHtleHByLm9wZXJhdG9yfSAke2NvbXBpbGVCaW5kaW5nKGV4cHIub3BlcmFuZDIsIHRydWUpfWA7XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGNvbXBhcmlzb25QYXJ0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGB7PSAke2NvbXBhcmlzb25QYXJ0fX1gO1xuXG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7Y29tcGlsZUJpbmRpbmcoZXhwci5jb25kaXRpb24sIHRydWUpfSA/ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5vblRydWUsIHRydWUpfSA6ICR7Y29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0ZXhwci5vbkZhbHNlLFxuXHRcdFx0XHRcdHRydWVcblx0XHRcdFx0KX0pYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgez0gJHtjb21waWxlQmluZGluZyhleHByLmNvbmRpdGlvbiwgdHJ1ZSl9ID8gJHtjb21waWxlQmluZGluZyhleHByLm9uVHJ1ZSwgdHJ1ZSl9IDogJHtjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRleHByLm9uRmFsc2UsXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpfX1gO1xuXHRcdFx0fVxuXG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7ZXhwci5vcGVyYW5kcy5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlKSkuam9pbihgICR7ZXhwci5vcGVyYXRvcn0gYCl9KWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICgke2V4cHIub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gY29tcGlsZUJpbmRpbmcoZXhwcmVzc2lvbiwgdHJ1ZSkpLmpvaW4oYCAke2V4cHIub3BlcmF0b3J9IGApfSl9YDtcblx0XHRcdH1cblxuXHRcdGNhc2UgXCJDb25jYXRcIjpcblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRyZXR1cm4gYCR7ZXhwci5leHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlKSkuam9pbihgICsgYCl9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgez0gJHtleHByLmV4cHJlc3Npb25zLm1hcChleHByZXNzaW9uID0+IGNvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24sIHRydWUpKS5qb2luKGAgKyBgKX0gfWA7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGAhJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQsIHRydWUpfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICEke2NvbXBpbGVCaW5kaW5nKGV4cHIub3BlcmFuZCwgdHJ1ZSl9fWA7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0XHRpZiAoZXhwci5wYXJhbWV0ZXJzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRvdXRQcm9wZXJ0eSArPSBgeyR7Y29tcGlsZVBhdGhQYXJhbWV0ZXIoZXhwci5wYXJhbWV0ZXJzWzBdLCB0cnVlKX0sIGZvcm1hdHRlcjogJyR7ZXhwci5mbn0nfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRQcm9wZXJ0eSArPSBge3BhcnRzOlske2V4cHIucGFyYW1ldGVycy5tYXAoKHBhcmFtOiBhbnkpID0+IGNvbXBpbGVQYXRoUGFyYW1ldGVyKHBhcmFtKSkuam9pbihcIixcIil9XSwgZm9ybWF0dGVyOiAnJHtcblx0XHRcdFx0XHRleHByLmZuXG5cdFx0XHRcdH0nfWA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0b3V0UHJvcGVydHkgPSBgXFwkJHtvdXRQcm9wZXJ0eX1gO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dFByb3BlcnR5O1xuXHRcdGNhc2UgXCJDb21wbGV4VHlwZVwiOlxuXHRcdFx0aWYgKGV4cHIuYmluZGluZ1BhcmFtZXRlcnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ICs9IGB7JHtjb21waWxlUGF0aFBhcmFtZXRlcihleHByLmJpbmRpbmdQYXJhbWV0ZXJzWzBdLCB0cnVlKX0sIHR5cGU6ICcke2V4cHIudHlwZX0nfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsZXQgb3V0cHV0RW5kO1xuXHRcdFx0XHQvLyB0aGlzIGNvZGUgaXMgYmFzZWQgb24gc2FwLnVpLm1vZGVsLm9kYXRhLnY0Ll9Bbm5vdGF0aW9uSGVscGVyRXhwcmVzc2lvbi5mZXRjaEN1cnJlbmN5T3JVbml0XG5cdFx0XHRcdHN3aXRjaCAoZXhwci50eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlVuaXRcIjpcblx0XHRcdFx0XHRcdG91dHB1dEVuZCA9IGAse21vZGU6J09uZVRpbWUnLHBhdGg6Jy8jI0BAcmVxdWVzdFVuaXRzT2ZNZWFzdXJlJyx0YXJnZXRUeXBlOidhbnknfV0sdHlwZTonc2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVW5pdCdgO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkN1cnJlbmN5XCI6XG5cdFx0XHRcdFx0XHRvdXRwdXRFbmQgPSBgLHttb2RlOidPbmVUaW1lJyxwYXRoOicvIyNAQHJlcXVlc3RDdXJyZW5jeUNvZGVzJyx0YXJnZXRUeXBlOidhbnknfV0sdHlwZTonc2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQ3VycmVuY3knYDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRvdXRwdXRFbmQgPSBgXSwgdHlwZTogJyR7ZXhwci50eXBlfSdgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHByLmZvcm1hdE9wdGlvbnMgJiYgT2JqZWN0LmtleXMoZXhwci5mb3JtYXRPcHRpb25zKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0b3V0cHV0RW5kICs9IGAsIGZvcm1hdE9wdGlvbnM6ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5mb3JtYXRPcHRpb25zKX1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHByLnBhcmFtZXRlcnMgJiYgT2JqZWN0LmtleXMoZXhwci5wYXJhbWV0ZXJzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0b3V0cHV0RW5kICs9IGAsIHBhcmFtZXRlcnM6ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5wYXJhbWV0ZXJzKX1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG91dHB1dEVuZCArPSBcIn1cIjtcblx0XHRcdFx0b3V0UHJvcGVydHkgKz0gYHttb2RlOidUd29XYXknLCBwYXJ0czpbJHtleHByLmJpbmRpbmdQYXJhbWV0ZXJzXG5cdFx0XHRcdFx0Lm1hcCgocGFyYW06IGFueSkgPT4gY29tcGlsZVBhdGhQYXJhbWV0ZXIocGFyYW0pKVxuXHRcdFx0XHRcdC5qb2luKFwiLFwiKX0ke291dHB1dEVuZH1gO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ID0gYFxcJCR7b3V0UHJvcGVydHl9YDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBvdXRQcm9wZXJ0eTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdH1cbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSBwYXRoIHBhcmFtZXRlciBvZiBhIGZvcm1hdHRlciBjYWxsLlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uIFx0LSB0aGUgYmluZGluZyBwYXJ0IHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0gc2luZ2xlUGF0aCBcdC0gd2hldGhlciB0aGVyZSBpcyBvbmUgb3IgbXVsdGlwbGUgcGF0aCB0byBjb25zaWRlclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIHN0cmluZyBzbmlwcGV0IHRvIGluY2x1ZGUgaW4gdGhlIG92ZXJhbGwgYmluZGluZyBkZWZpbml0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoUGFyYW1ldGVyKGV4cHJlc3Npb246IEV4cHJlc3Npb248YW55Piwgc2luZ2xlUGF0aDogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcblx0bGV0IG91dFZhbHVlID0gXCJcIjtcblx0c3dpdGNoIChleHByZXNzaW9uLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkNvbnN0YW50XCI6XG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiBleHByZXNzaW9uLnZhbHVlKSB7XG5cdFx0XHRcdGNhc2UgXCJudW1iZXJcIjpcblx0XHRcdFx0Y2FzZSBcImJpZ2ludFwiOlxuXHRcdFx0XHRcdG91dFZhbHVlID0gYHZhbHVlOiAke2V4cHJlc3Npb24udmFsdWUudG9TdHJpbmcoKX1gO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic3RyaW5nXCI6XG5cdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0b3V0VmFsdWUgPSBgdmFsdWU6ICcke2V4cHJlc3Npb24udmFsdWUudG9TdHJpbmcoKX0nYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRvdXRWYWx1ZSA9IFwidmFsdWU6ICcnXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2luZ2xlUGF0aCkge1xuXHRcdFx0XHRyZXR1cm4gb3V0VmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYHske291dFZhbHVlfX1gO1xuXG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0Y2FzZSBcIkJpbmRpbmdcIjpcblx0XHRcdG91dFZhbHVlID0gYHBhdGg6JyR7ZXhwcmVzc2lvbi5tb2RlbE5hbWUgPyBgJHtleHByZXNzaW9uLm1vZGVsTmFtZX0+YCA6IFwiXCJ9JHtleHByZXNzaW9uLnBhdGh9J2A7XG5cblx0XHRcdGlmIChleHByZXNzaW9uLnR5cGUpIHtcblx0XHRcdFx0b3V0VmFsdWUgKz0gYCwgdHlwZSA6ICcke2V4cHJlc3Npb24udHlwZX0nYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dFZhbHVlICs9IGAsIHRhcmdldFR5cGUgOiAnYW55J2A7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhwcmVzc2lvbi5jb25zdHJhaW50cyAmJiBPYmplY3Qua2V5cyhleHByZXNzaW9uLmNvbnN0cmFpbnRzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdG91dFZhbHVlICs9IGAsIGNvbnN0cmFpbnRzOiAke2NvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24uY29uc3RyYWludHMpfWA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zICYmIE9iamVjdC5rZXlzKGV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCBmb3JtYXRPcHRpb25zOiAke2NvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyl9YDtcblx0XHRcdH1cblx0XHRcdGlmIChzaW5nbGVQYXRoKSB7XG5cdFx0XHRcdHJldHVybiBvdXRWYWx1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBgeyR7b3V0VmFsdWV9fWA7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBcIlwiO1xuXHR9XG59XG4iXX0=