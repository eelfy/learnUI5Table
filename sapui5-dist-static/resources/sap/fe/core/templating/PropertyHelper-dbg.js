sap.ui.define(["sap/fe/core/helpers/BindingExpression"], function (BindingExpression) {
  "use strict";

  var _exports = {};
  var or = BindingExpression.or;
  var equal = BindingExpression.equal;
  var annotationExpression = BindingExpression.annotationExpression;

  /**
   * Identify if the given property passed is a "Property" (has a _type).
   *
   * @param {Property} property a target property to evaluate
   * @returns {boolean} validate that property is a Property
   */
  function isProperty(property) {
    return property && property.hasOwnProperty("_type") && property._type === "Property";
  }
  /**
   * Check whether the property has the Core.Computed annotation or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's computed
   */


  _exports.isProperty = isProperty;

  var isComputed = function (oProperty) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3;

    return !!((_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Core) === null || _oProperty$annotation2 === void 0 ? void 0 : (_oProperty$annotation3 = _oProperty$annotation2.Computed) === null || _oProperty$annotation3 === void 0 ? void 0 : _oProperty$annotation3.valueOf());
  };
  /**
   * Check whether the property has the Core.Immutable annotation or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's immutable
   */


  _exports.isComputed = isComputed;

  var isImmutable = function (oProperty) {
    var _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6;

    return !!((_oProperty$annotation4 = oProperty.annotations) === null || _oProperty$annotation4 === void 0 ? void 0 : (_oProperty$annotation5 = _oProperty$annotation4.Core) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Immutable) === null || _oProperty$annotation6 === void 0 ? void 0 : _oProperty$annotation6.valueOf());
  };
  /**
   * Check whether the property is a key or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it's a key
   */


  _exports.isImmutable = isImmutable;

  var isKey = function (oProperty) {
    return !!oProperty.isKey;
  };
  /**
   * Checks whether the property has a date time or not.
   *
   * @param oProperty
   * @returns true if it is of type date / datetime / datetimeoffset
   */


  _exports.isKey = isKey;

  var hasDateType = function (oProperty) {
    return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oProperty.type) !== -1;
  };
  /**
   * Retrieve the label annotation.
   *
   * @param oProperty the target property
   * @returns the label string
   */


  _exports.hasDateType = hasDateType;

  var getLabel = function (oProperty) {
    var _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9;

    return ((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Common) === null || _oProperty$annotation8 === void 0 ? void 0 : (_oProperty$annotation9 = _oProperty$annotation8.Label) === null || _oProperty$annotation9 === void 0 ? void 0 : _oProperty$annotation9.toString()) || "";
  };
  /**
   * Check whether the property has a semantic object defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a semantic object
   */


  _exports.getLabel = getLabel;

  var hasSemanticObject = function (oProperty) {
    var _oProperty$annotation10, _oProperty$annotation11;

    return !!((_oProperty$annotation10 = oProperty.annotations) === null || _oProperty$annotation10 === void 0 ? void 0 : (_oProperty$annotation11 = _oProperty$annotation10.Common) === null || _oProperty$annotation11 === void 0 ? void 0 : _oProperty$annotation11.SemanticObject);
  };
  /**
   * Create the binding expression to check if the property is non editable or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's non editable
   */


  _exports.hasSemanticObject = hasSemanticObject;

  var isNonEditableExpression = function (oProperty) {
    return or(isReadOnlyExpression(oProperty), isDisabledExpression(oProperty));
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
   */


  _exports.isNonEditableExpression = isNonEditableExpression;

  var isReadOnlyExpression = function (oProperty) {
    var _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14;

    var oFieldControlValue = (_oProperty$annotation12 = oProperty.annotations) === null || _oProperty$annotation12 === void 0 ? void 0 : (_oProperty$annotation13 = _oProperty$annotation12.Common) === null || _oProperty$annotation13 === void 0 ? void 0 : (_oProperty$annotation14 = _oProperty$annotation13.FieldControl) === null || _oProperty$annotation14 === void 0 ? void 0 : _oProperty$annotation14.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 1);
    }

    return oFieldControlValue === "Common.FieldControlType/ReadOnly";
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
   */


  _exports.isReadOnlyExpression = isReadOnlyExpression;

  var isRequiredExpression = function (oProperty) {
    var _oProperty$annotation15, _oProperty$annotation16, _oProperty$annotation17;

    var oFieldControlValue = (_oProperty$annotation15 = oProperty.annotations) === null || _oProperty$annotation15 === void 0 ? void 0 : (_oProperty$annotation16 = _oProperty$annotation15.Common) === null || _oProperty$annotation16 === void 0 ? void 0 : (_oProperty$annotation17 = _oProperty$annotation16.FieldControl) === null || _oProperty$annotation17 === void 0 ? void 0 : _oProperty$annotation17.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 7);
    }

    return oFieldControlValue === "Common.FieldControlType/Mandatory";
  };
  /**
   * Create the binding expression to check if the property is disabled or not.
   *
   * @param {Property} oProperty the target property
   * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's disabled
   */


  _exports.isRequiredExpression = isRequiredExpression;

  var isDisabledExpression = function (oProperty) {
    var _oProperty$annotation18, _oProperty$annotation19, _oProperty$annotation20;

    var oFieldControlValue = (_oProperty$annotation18 = oProperty.annotations) === null || _oProperty$annotation18 === void 0 ? void 0 : (_oProperty$annotation19 = _oProperty$annotation18.Common) === null || _oProperty$annotation19 === void 0 ? void 0 : (_oProperty$annotation20 = _oProperty$annotation19.FieldControl) === null || _oProperty$annotation20 === void 0 ? void 0 : _oProperty$annotation20.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 0);
    }

    return oFieldControlValue === "Common.FieldControlType/Inapplicable";
  };

  _exports.isDisabledExpression = isDisabledExpression;

  var isPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "Path";
  };
  /**
   * Retrieves the associated unit property for that property if it exists.
   *
   * @param {Property} oProperty the target property
   * @returns {Property | undefined} the unit property if it exists
   */


  _exports.isPathExpression = isPathExpression;

  var getAssociatedUnitProperty = function (oProperty) {
    var _oProperty$annotation21, _oProperty$annotation22, _oProperty$annotation23, _oProperty$annotation24;

    return isPathExpression((_oProperty$annotation21 = oProperty.annotations) === null || _oProperty$annotation21 === void 0 ? void 0 : (_oProperty$annotation22 = _oProperty$annotation21.Measures) === null || _oProperty$annotation22 === void 0 ? void 0 : _oProperty$annotation22.Unit) ? (_oProperty$annotation23 = oProperty.annotations) === null || _oProperty$annotation23 === void 0 ? void 0 : (_oProperty$annotation24 = _oProperty$annotation23.Measures) === null || _oProperty$annotation24 === void 0 ? void 0 : _oProperty$annotation24.Unit.$target : undefined;
  };

  _exports.getAssociatedUnitProperty = getAssociatedUnitProperty;

  var getAssociatedUnitPropertyPath = function (oProperty) {
    var _oProperty$annotation25, _oProperty$annotation26, _oProperty$annotation27, _oProperty$annotation28;

    return isPathExpression((_oProperty$annotation25 = oProperty.annotations) === null || _oProperty$annotation25 === void 0 ? void 0 : (_oProperty$annotation26 = _oProperty$annotation25.Measures) === null || _oProperty$annotation26 === void 0 ? void 0 : _oProperty$annotation26.Unit) ? (_oProperty$annotation27 = oProperty.annotations) === null || _oProperty$annotation27 === void 0 ? void 0 : (_oProperty$annotation28 = _oProperty$annotation27.Measures) === null || _oProperty$annotation28 === void 0 ? void 0 : _oProperty$annotation28.Unit.path : undefined;
  };
  /**
   * Retrieves the associated currency property for that property if it exists.
   *
   * @param {Property} oProperty the target property
   * @returns {Property | undefined} the unit property if it exists
   */


  _exports.getAssociatedUnitPropertyPath = getAssociatedUnitPropertyPath;

  var getAssociatedCurrencyProperty = function (oProperty) {
    var _oProperty$annotation29, _oProperty$annotation30, _oProperty$annotation31, _oProperty$annotation32;

    return isPathExpression((_oProperty$annotation29 = oProperty.annotations) === null || _oProperty$annotation29 === void 0 ? void 0 : (_oProperty$annotation30 = _oProperty$annotation29.Measures) === null || _oProperty$annotation30 === void 0 ? void 0 : _oProperty$annotation30.ISOCurrency) ? (_oProperty$annotation31 = oProperty.annotations) === null || _oProperty$annotation31 === void 0 ? void 0 : (_oProperty$annotation32 = _oProperty$annotation31.Measures) === null || _oProperty$annotation32 === void 0 ? void 0 : _oProperty$annotation32.ISOCurrency.$target : undefined;
  };

  _exports.getAssociatedCurrencyProperty = getAssociatedCurrencyProperty;

  var getAssociatedCurrencyPropertyPath = function (oProperty) {
    var _oProperty$annotation33, _oProperty$annotation34, _oProperty$annotation35, _oProperty$annotation36;

    return isPathExpression((_oProperty$annotation33 = oProperty.annotations) === null || _oProperty$annotation33 === void 0 ? void 0 : (_oProperty$annotation34 = _oProperty$annotation33.Measures) === null || _oProperty$annotation34 === void 0 ? void 0 : _oProperty$annotation34.ISOCurrency) ? (_oProperty$annotation35 = oProperty.annotations) === null || _oProperty$annotation35 === void 0 ? void 0 : (_oProperty$annotation36 = _oProperty$annotation35.Measures) === null || _oProperty$annotation36 === void 0 ? void 0 : _oProperty$annotation36.ISOCurrency.path : undefined;
  };
  /**
   * Retrieves the Common.Text property path if it exists.
   *
   * @param {Property} oProperty the target property
   * @returns {string | undefined} the Common.Text property path or undefined if it does not exit
   */


  _exports.getAssociatedCurrencyPropertyPath = getAssociatedCurrencyPropertyPath;

  var getAssociatedTextPropertyPath = function (oProperty) {
    var _oProperty$annotation37, _oProperty$annotation38, _oProperty$annotation39, _oProperty$annotation40;

    return isPathExpression((_oProperty$annotation37 = oProperty.annotations) === null || _oProperty$annotation37 === void 0 ? void 0 : (_oProperty$annotation38 = _oProperty$annotation37.Common) === null || _oProperty$annotation38 === void 0 ? void 0 : _oProperty$annotation38.Text) ? (_oProperty$annotation39 = oProperty.annotations) === null || _oProperty$annotation39 === void 0 ? void 0 : (_oProperty$annotation40 = _oProperty$annotation39.Common) === null || _oProperty$annotation40 === void 0 ? void 0 : _oProperty$annotation40.Text.path : undefined;
  };
  /**
   * Check whether the property has a value help annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.getAssociatedTextPropertyPath = getAssociatedTextPropertyPath;

  var hasValueHelp = function (oProperty) {
    var _oProperty$annotation41, _oProperty$annotation42, _oProperty$annotation43, _oProperty$annotation44, _oProperty$annotation45, _oProperty$annotation46, _oProperty$annotation47, _oProperty$annotation48;

    return !!((_oProperty$annotation41 = oProperty.annotations) === null || _oProperty$annotation41 === void 0 ? void 0 : (_oProperty$annotation42 = _oProperty$annotation41.Common) === null || _oProperty$annotation42 === void 0 ? void 0 : _oProperty$annotation42.ValueList) || !!((_oProperty$annotation43 = oProperty.annotations) === null || _oProperty$annotation43 === void 0 ? void 0 : (_oProperty$annotation44 = _oProperty$annotation43.Common) === null || _oProperty$annotation44 === void 0 ? void 0 : _oProperty$annotation44.ValueListReferences) || !!((_oProperty$annotation45 = oProperty.annotations) === null || _oProperty$annotation45 === void 0 ? void 0 : (_oProperty$annotation46 = _oProperty$annotation45.Common) === null || _oProperty$annotation46 === void 0 ? void 0 : _oProperty$annotation46.ValueListWithFixedValues) || !!((_oProperty$annotation47 = oProperty.annotations) === null || _oProperty$annotation47 === void 0 ? void 0 : (_oProperty$annotation48 = _oProperty$annotation47.Common) === null || _oProperty$annotation48 === void 0 ? void 0 : _oProperty$annotation48.ValueListMapping);
  };
  /**
   * Check whether the property has a value help with fixed value annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.hasValueHelp = hasValueHelp;

  var hasValueHelpWithFixedValues = function (oProperty) {
    var _oProperty$annotation49, _oProperty$annotation50, _oProperty$annotation51;

    return !!((_oProperty$annotation49 = oProperty.annotations) === null || _oProperty$annotation49 === void 0 ? void 0 : (_oProperty$annotation50 = _oProperty$annotation49.Common) === null || _oProperty$annotation50 === void 0 ? void 0 : (_oProperty$annotation51 = _oProperty$annotation50.ValueListWithFixedValues) === null || _oProperty$annotation51 === void 0 ? void 0 : _oProperty$annotation51.valueOf());
  };
  /**
   * Check whether the property has a value help for validation annotation defined or not.
   *
   * @param {Property} oProperty the target property
   * @returns {boolean} true if it has a value help
   */


  _exports.hasValueHelpWithFixedValues = hasValueHelpWithFixedValues;

  var hasValueListForValidation = function (oProperty) {
    var _oProperty$annotation52, _oProperty$annotation53;

    return ((_oProperty$annotation52 = oProperty.annotations) === null || _oProperty$annotation52 === void 0 ? void 0 : (_oProperty$annotation53 = _oProperty$annotation52.Common) === null || _oProperty$annotation53 === void 0 ? void 0 : _oProperty$annotation53.ValueListForValidation) !== undefined;
  };
  /**
   * Checks whether the property is a unit property.
   *
   * @param oProperty the property to check
   * @returns true if it is a unit
   */


  _exports.hasValueListForValidation = hasValueListForValidation;

  var isUnit = function (oProperty) {
    var _oProperty$annotation54, _oProperty$annotation55, _oProperty$annotation56;

    return !!((_oProperty$annotation54 = oProperty.annotations) === null || _oProperty$annotation54 === void 0 ? void 0 : (_oProperty$annotation55 = _oProperty$annotation54.Common) === null || _oProperty$annotation55 === void 0 ? void 0 : (_oProperty$annotation56 = _oProperty$annotation55.IsUnit) === null || _oProperty$annotation56 === void 0 ? void 0 : _oProperty$annotation56.valueOf());
  };
  /**
   * Checks whether the property is a currency property.
   *
   * @param oProperty the property to check
   * @returns true if it is a currency
   */


  _exports.isUnit = isUnit;

  var isCurrency = function (oProperty) {
    var _oProperty$annotation57, _oProperty$annotation58, _oProperty$annotation59;

    return !!((_oProperty$annotation57 = oProperty.annotations) === null || _oProperty$annotation57 === void 0 ? void 0 : (_oProperty$annotation58 = _oProperty$annotation57.Common) === null || _oProperty$annotation58 === void 0 ? void 0 : (_oProperty$annotation59 = _oProperty$annotation58.IsCurrency) === null || _oProperty$annotation59 === void 0 ? void 0 : _oProperty$annotation59.valueOf());
  };

  _exports.isCurrency = isCurrency;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb3BlcnR5SGVscGVyLnRzIl0sIm5hbWVzIjpbImlzUHJvcGVydHkiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiX3R5cGUiLCJpc0NvbXB1dGVkIiwib1Byb3BlcnR5IiwiYW5ub3RhdGlvbnMiLCJDb3JlIiwiQ29tcHV0ZWQiLCJ2YWx1ZU9mIiwiaXNJbW11dGFibGUiLCJJbW11dGFibGUiLCJpc0tleSIsImhhc0RhdGVUeXBlIiwiaW5kZXhPZiIsInR5cGUiLCJnZXRMYWJlbCIsIkNvbW1vbiIsIkxhYmVsIiwidG9TdHJpbmciLCJoYXNTZW1hbnRpY09iamVjdCIsIlNlbWFudGljT2JqZWN0IiwiaXNOb25FZGl0YWJsZUV4cHJlc3Npb24iLCJvciIsImlzUmVhZE9ubHlFeHByZXNzaW9uIiwiaXNEaXNhYmxlZEV4cHJlc3Npb24iLCJvRmllbGRDb250cm9sVmFsdWUiLCJGaWVsZENvbnRyb2wiLCJlcXVhbCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiaXNSZXF1aXJlZEV4cHJlc3Npb24iLCJpc1BhdGhFeHByZXNzaW9uIiwiZXhwcmVzc2lvbiIsInVuZGVmaW5lZCIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJNZWFzdXJlcyIsIlVuaXQiLCIkdGFyZ2V0IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGgiLCJwYXRoIiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJJU09DdXJyZW5jeSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoIiwiVGV4dCIsImhhc1ZhbHVlSGVscCIsIlZhbHVlTGlzdCIsIlZhbHVlTGlzdFJlZmVyZW5jZXMiLCJWYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXMiLCJWYWx1ZUxpc3RNYXBwaW5nIiwiaGFzVmFsdWVIZWxwV2l0aEZpeGVkVmFsdWVzIiwiaGFzVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiIsIlZhbHVlTGlz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O0FBTU8sTUFBTW9CLE1BQU0sR0FBRyxVQUFTaEQsU0FBVCxFQUF1QztBQUFBOztBQUM1RCxXQUFPLENBQUMsNkJBQUNBLFNBQVMsQ0FBQ0MsV0FBWCx1RkFBQyx3QkFBdUJXLE1BQXhCLHVGQUFDLHdCQUErQnFDLE1BQWhDLDREQUFDLHdCQUF1QzdDLE9BQXZDLEVBQUQsQ0FBUjtBQUNBLEdBRk07QUFJUDs7Ozs7Ozs7OztBQU1PLE1BQU04QyxVQUFVLEdBQUcsVUFBU2xELFNBQVQsRUFBdUM7QUFBQTs7QUFDaEUsV0FBTyxDQUFDLDZCQUFDQSxTQUFTLENBQUNDLFdBQVgsdUZBQUMsd0JBQXVCVyxNQUF4Qix1RkFBQyx3QkFBK0J1QyxVQUFoQyw0REFBQyx3QkFBMkMvQyxPQUEzQyxFQUFELENBQVI7QUFDQSxHQUZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlLCBlcXVhbCwgb3IsIEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgUGF0aEFubm90YXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5cbi8qKlxuICogSWRlbnRpZnkgaWYgdGhlIGdpdmVuIHByb3BlcnR5IHBhc3NlZCBpcyBhIFwiUHJvcGVydHlcIiAoaGFzIGEgX3R5cGUpLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IHByb3BlcnR5IGEgdGFyZ2V0IHByb3BlcnR5IHRvIGV2YWx1YXRlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdmFsaWRhdGUgdGhhdCBwcm9wZXJ0eSBpcyBhIFByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5KHByb3BlcnR5OiBhbnkpOiBwcm9wZXJ0eSBpcyBQcm9wZXJ0eSB7XG5cdHJldHVybiBwcm9wZXJ0eSAmJiAocHJvcGVydHkgYXMgUHJvcGVydHkpLmhhc093blByb3BlcnR5KFwiX3R5cGVcIikgJiYgKHByb3BlcnR5IGFzIFByb3BlcnR5KS5fdHlwZSA9PT0gXCJQcm9wZXJ0eVwiO1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyB0aGUgQ29yZS5Db21wdXRlZCBhbm5vdGF0aW9uIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQncyBjb21wdXRlZFxuICovXG5leHBvcnQgY29uc3QgaXNDb21wdXRlZCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db3JlPy5Db21wdXRlZD8udmFsdWVPZigpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgdGhlIENvcmUuSW1tdXRhYmxlIGFubm90YXRpb24gb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCdzIGltbXV0YWJsZVxuICovXG5leHBvcnQgY29uc3QgaXNJbW11dGFibGUgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29yZT8uSW1tdXRhYmxlPy52YWx1ZU9mKCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGlzIGEga2V5IG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQncyBhIGtleVxuICovXG5leHBvcnQgY29uc3QgaXNLZXkgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5pc0tleTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIGRhdGUgdGltZSBvciBub3QuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eVxuICogQHJldHVybnMgdHJ1ZSBpZiBpdCBpcyBvZiB0eXBlIGRhdGUgLyBkYXRldGltZSAvIGRhdGV0aW1lb2Zmc2V0XG4gKi9cbmV4cG9ydCBjb25zdCBoYXNEYXRlVHlwZSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIFtcIkVkbS5EYXRlXCIsIFwiRWRtLkRhdGVUaW1lXCIsIFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCJdLmluZGV4T2Yob1Byb3BlcnR5LnR5cGUpICE9PSAtMTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGxhYmVsIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB0aGUgbGFiZWwgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRMYWJlbCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBzdHJpbmcge1xuXHRyZXR1cm4gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy50b1N0cmluZygpIHx8IFwiXCI7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIHNlbWFudGljIG9iamVjdCBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaGFzIGEgc2VtYW50aWMgb2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBoYXNTZW1hbnRpY09iamVjdCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiB0byBjaGVjayBpZiB0aGUgcHJvcGVydHkgaXMgbm9uIGVkaXRhYmxlIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge0V4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPn0gdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiByZXNvbHZpbmcgdG8gYSBib29sZWFuIGJlaW5nIHRydWUgaWYgaXQncyBub24gZWRpdGFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IGlzTm9uRWRpdGFibGVFeHByZXNzaW9uID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gb3IoaXNSZWFkT25seUV4cHJlc3Npb24ob1Byb3BlcnR5KSwgaXNEaXNhYmxlZEV4cHJlc3Npb24ob1Byb3BlcnR5KSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSB0aGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIHJlYWQgb25seVxuICovXG5leHBvcnQgY29uc3QgaXNSZWFkT25seUV4cHJlc3Npb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+IHtcblx0Y29uc3Qgb0ZpZWxkQ29udHJvbFZhbHVlID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpZWxkQ29udHJvbD8udmFsdWVPZigpO1xuXHRpZiAodHlwZW9mIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiAhIW9GaWVsZENvbnRyb2xWYWx1ZSAmJiBlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihvRmllbGRDb250cm9sVmFsdWUpIGFzIEV4cHJlc3Npb25PclByaW1pdGl2ZTxudW1iZXI+LCAxKTtcblx0fVxuXHRyZXR1cm4gb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIkNvbW1vbi5GaWVsZENvbnRyb2xUeXBlL1JlYWRPbmx5XCI7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSB0aGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIHJlYWQgb25seVxuICovXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZEV4cHJlc3Npb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+IHtcblx0Y29uc3Qgb0ZpZWxkQ29udHJvbFZhbHVlID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LkZpZWxkQ29udHJvbD8udmFsdWVPZigpO1xuXHRpZiAodHlwZW9mIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiAhIW9GaWVsZENvbnRyb2xWYWx1ZSAmJiBlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihvRmllbGRDb250cm9sVmFsdWUpIGFzIEV4cHJlc3Npb25PclByaW1pdGl2ZTxudW1iZXI+LCA3KTtcblx0fVxuXHRyZXR1cm4gb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIkNvbW1vbi5GaWVsZENvbnRyb2xUeXBlL01hbmRhdG9yeVwiO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiB0byBjaGVjayBpZiB0aGUgcHJvcGVydHkgaXMgZGlzYWJsZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSB0aGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIGRpc2FibGVkXG4gKi9cbmV4cG9ydCBjb25zdCBpc0Rpc2FibGVkRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4ge1xuXHRjb25zdCBvRmllbGRDb250cm9sVmFsdWUgPSBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uRmllbGRDb250cm9sPy52YWx1ZU9mKCk7XG5cdGlmICh0eXBlb2Ygb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuICEhb0ZpZWxkQ29udHJvbFZhbHVlICYmIGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKG9GaWVsZENvbnRyb2xWYWx1ZSkgYXMgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPG51bWJlcj4sIDApO1xuXHR9XG5cdHJldHVybiBvRmllbGRDb250cm9sVmFsdWUgPT09IFwiQ29tbW9uLkZpZWxkQ29udHJvbFR5cGUvSW5hcHBsaWNhYmxlXCI7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoRXhwcmVzc2lvbiA9IGZ1bmN0aW9uPFQ+KGV4cHJlc3Npb246IGFueSk6IGV4cHJlc3Npb24gaXMgUGF0aEFubm90YXRpb25FeHByZXNzaW9uPFQ+IHtcblx0cmV0dXJuICEhZXhwcmVzc2lvbiAmJiBleHByZXNzaW9uLnR5cGUgIT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uLnR5cGUgPT09IFwiUGF0aFwiO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGFzc29jaWF0ZWQgdW5pdCBwcm9wZXJ0eSBmb3IgdGhhdCBwcm9wZXJ0eSBpZiBpdCBleGlzdHMuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtQcm9wZXJ0eSB8IHVuZGVmaW5lZH0gdGhlIHVuaXQgcHJvcGVydHkgaWYgaXQgZXhpc3RzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IFByb3BlcnR5IHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdClcblx0XHQ/ICgob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdC4kdGFyZ2V0IGFzIHVua25vd24pIGFzIFByb3BlcnR5KVxuXHRcdDogdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHlQYXRoID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdC5wYXRoIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGFzc29jaWF0ZWQgY3VycmVuY3kgcHJvcGVydHkgZm9yIHRoYXQgcHJvcGVydHkgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7UHJvcGVydHkgfCB1bmRlZmluZWR9IHRoZSB1bml0IHByb3BlcnR5IGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSlcblx0XHQ/ICgob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kuJHRhcmdldCBhcyB1bmtub3duKSBhcyBQcm9wZXJ0eSlcblx0XHQ6IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGggPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kucGF0aCA6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBDb21tb24uVGV4dCBwcm9wZXJ0eSBwYXRoIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH0gdGhlIENvbW1vbi5UZXh0IHByb3BlcnR5IHBhdGggb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXMgbm90IGV4aXRcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0KSA/IG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5UZXh0LnBhdGggOiB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIHZhbHVlIGhlbHAgYW5ub3RhdGlvbiBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaGFzIGEgdmFsdWUgaGVscFxuICovXG5leHBvcnQgY29uc3QgaGFzVmFsdWVIZWxwID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gKFxuXHRcdCEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlZhbHVlTGlzdCB8fFxuXHRcdCEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlZhbHVlTGlzdFJlZmVyZW5jZXMgfHxcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXMgfHxcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RNYXBwaW5nXG5cdCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIHZhbHVlIGhlbHAgd2l0aCBmaXhlZCB2YWx1ZSBhbm5vdGF0aW9uIGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCBoYXMgYSB2YWx1ZSBoZWxwXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXM/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgdmFsdWUgaGVscCBmb3IgdmFsaWRhdGlvbiBhbm5vdGF0aW9uIGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCBoYXMgYSB2YWx1ZSBoZWxwXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNWYWx1ZUxpc3RGb3JWYWxpZGF0aW9uID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlZhbHVlTGlzdEZvclZhbGlkYXRpb24gIT09IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGlzIGEgdW5pdCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IHRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIHVuaXRcbiAqL1xuZXhwb3J0IGNvbnN0IGlzVW5pdCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LklzVW5pdD8udmFsdWVPZigpO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSBjdXJyZW5jeSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IHRoZSBwcm9wZXJ0eSB0byBjaGVja1xuICogQHJldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIGN1cnJlbmN5XG4gKi9cbmV4cG9ydCBjb25zdCBpc0N1cnJlbmN5ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uSXNDdXJyZW5jeT8udmFsdWVPZigpO1xufTtcbiJdfQ==