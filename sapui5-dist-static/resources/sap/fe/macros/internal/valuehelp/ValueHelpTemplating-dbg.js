sap.ui.define(["sap/fe/core/helpers/BindingExpression", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/UIFormatters"], function (BindingExpression, StableIdHelper, PropertyHelper, DataModelPathHelper, UIFormatters) {
  "use strict";

  var _exports = {};
  var getDisplayMode = UIFormatters.getDisplayMode;
  var checkFilterExpressionRestrictions = DataModelPathHelper.checkFilterExpressionRestrictions;
  var hasDateType = PropertyHelper.hasDateType;
  var isCurrency = PropertyHelper.isCurrency;
  var isUnit = PropertyHelper.isUnit;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var hasValueListForValidation = PropertyHelper.hasValueListForValidation;
  var hasValueHelpWithFixedValues = PropertyHelper.hasValueHelpWithFixedValues;
  var compileBinding = BindingExpression.compileBinding;

  /**
   * Retrieve the displayMode for the value help.
   * The main rule is that if a property is used in a VHTable then we don't want to display the text arrangement directly.
   *
   * @param propertyPath the current property
   * @returns the target displayMode
   */
  var getValueHelpTableDisplayMode = function (propertyPath) {
    var sDisplayMode = getDisplayMode(propertyPath.targetObject, propertyPath); // if the property is used in a VHTable consider only #TextOnly else show the value

    return sDisplayMode === "Description" ? "Description" : "Value";
  };
  /**
   * Method to return delegate property of Value Help.
   *
   * @function
   * @name getDelegateConfiguration
   * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
   * @param propertyPath property name
   * @param conditionModelName Condition model of the Value Help
   * @returns returns an expression
   */


  _exports.getValueHelpTableDisplayMode = getValueHelpTableDisplayMode;

  var getDelegateConfiguration = function (propertyPath, conditionModelName) {
    var delegateConfiguration = {
      name: "sap/fe/macros/FieldValueHelpDelegate",
      payload: {
        propertyPath: propertyPath,
        conditionModel: conditionModelName
      }
    };
    return compileBinding(delegateConfiguration);
  };
  /**
   * Method to generate the ID for Value Help.
   *
   * @function
   * @name generateID
   * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
   * @param {string} sFlexId Flex ID of the current object
   * @param {string} sIdPrefix Prefix for the ValueHelp ID
   * @param {string} sOriginalPropertyName Name of the property
   * @param {string} sPropertyName Name of the ValueHelp Property
   * @returns {string} returns the Id generated for the ValueHelp
   */


  _exports.getDelegateConfiguration = getDelegateConfiguration;

  var generateID = function (sFlexId, sIdPrefix, sOriginalPropertyName, sPropertyName) {
    if (sFlexId) {
      return sFlexId;
    }

    var sProperty = sPropertyName;

    if (sOriginalPropertyName !== sPropertyName) {
      sProperty = sOriginalPropertyName + "::" + sPropertyName;
    }

    return StableIdHelper.generate([sIdPrefix, sProperty]);
  };
  /**
   * Method to check if a property needs to be validated or not when used in the valuehelp.
   *
   * @function
   * @name requiresValidation
   * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
   * @param  oProperty value help property type annotations
   * @returns returns true if the value help need to be validated
   */


  _exports.generateID = generateID;

  var requiresValidation = function (oProperty) {
    return hasValueHelpWithFixedValues(oProperty) || hasValueListForValidation(oProperty) || hasValueHelp(oProperty) && (isUnit(oProperty) || isCurrency(oProperty));
  };

  _exports.requiresValidation = requiresValidation;

  var isSemanticDateRange = function (oDataModelPath) {
    var targetProperty = oDataModelPath.targetObject;
    var targetRestrictions = checkFilterExpressionRestrictions(oDataModelPath, ["SingleRange"]);
    return hasDateType(targetProperty) && compileBinding(targetRestrictions);
  };

  _exports.isSemanticDateRange = isSemanticDateRange;

  var shouldShowConditionPanel = function (oDataModelPath) {
    return compileBinding(checkFilterExpressionRestrictions(oDataModelPath, ["SingleValue", "MultiValue"])) === "false";
  };

  _exports.shouldShowConditionPanel = shouldShowConditionPanel;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZhbHVlSGVscFRlbXBsYXRpbmcudHMiXSwibmFtZXMiOlsiZ2V0VmFsdWVIZWxwVGFibGVEaXNwbGF5TW9kZSIsInByb3BlcnR5UGF0aCIsInNEaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwidGFyZ2V0T2JqZWN0IiwiZ2V0RGVsZWdhdGVDb25maWd1cmF0aW9uIiwiY29uZGl0aW9uTW9kZWxOYW1lIiwiZGVsZWdhdGVDb25maWd1cmF0aW9uIiwibmFtZSIsInBheWxvYWQiLCJjb25kaXRpb25Nb2RlbCIsImNvbXBpbGVCaW5kaW5nIiwiZ2VuZXJhdGVJRCIsInNGbGV4SWQiLCJzSWRQcmVmaXgiLCJzT3JpZ2luYWxQcm9wZXJ0eU5hbWUiLCJzUHJvcGVydHlOYW1lIiwic1Byb3BlcnR5IiwiU3RhYmxlSWRIZWxwZXIiLCJnZW5lcmF0ZSIsInJlcXVpcmVzVmFsaWRhdGlvbiIsIm9Qcm9wZXJ0eSIsImhhc1ZhbHVlSGVscFdpdGhGaXhlZFZhbHVlcyIsImhhc1ZhbHVlTGlzdEZvclZhbGlkYXRpb24iLCJoYXNWYWx1ZUhlbHAiLCJpc1VuaXQiLCJpc0N1cnJlbmN5IiwiaXNTZW1hbnRpY0RhdGVSYW5nZSIsIm9EYXRhTW9kZWxQYXRoIiwidGFyZ2V0UHJvcGVydHkiLCJ0YXJnZXRSZXN0cmljdGlvbnMiLCJjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJoYXNEYXRlVHlwZSIsInNob3VsZFNob3dDb25kaXRpb25QYW5lbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFjQTs7Ozs7OztBQU9PLE1BQU1BLDRCQUE0QixHQUFHLFVBQVNDLFlBQVQsRUFBb0Q7QUFDL0YsUUFBTUMsWUFBWSxHQUFHQyxjQUFjLENBQUNGLFlBQVksQ0FBQ0csWUFBZCxFQUE0QkgsWUFBNUIsQ0FBbkMsQ0FEK0YsQ0FFL0Y7O0FBQ0EsV0FBT0MsWUFBWSxLQUFLLGFBQWpCLEdBQWlDLGFBQWpDLEdBQWlELE9BQXhEO0FBQ0EsR0FKTTtBQU1QOzs7Ozs7Ozs7Ozs7OztBQVVPLE1BQU1HLHdCQUF3QixHQUFHLFVBQVNKLFlBQVQsRUFBK0JLLGtCQUEvQixFQUFzRjtBQUM3SCxRQUFNQyxxQkFBcUIsR0FBRztBQUM3QkMsTUFBQUEsSUFBSSxFQUFFLHNDQUR1QjtBQUU3QkMsTUFBQUEsT0FBTyxFQUFFO0FBQ1JSLFFBQUFBLFlBQVksRUFBRUEsWUFETjtBQUVSUyxRQUFBQSxjQUFjLEVBQUVKO0FBRlI7QUFGb0IsS0FBOUI7QUFPQSxXQUFPSyxjQUFjLENBQUNKLHFCQUFELENBQXJCO0FBQ0EsR0FUTTtBQVdQOzs7Ozs7Ozs7Ozs7Ozs7O0FBWU8sTUFBTUssVUFBVSxHQUFHLFVBQVNDLE9BQVQsRUFBMEJDLFNBQTFCLEVBQTZDQyxxQkFBN0MsRUFBNEVDLGFBQTVFLEVBQTJHO0FBQ3BJLFFBQUlILE9BQUosRUFBYTtBQUNaLGFBQU9BLE9BQVA7QUFDQTs7QUFDRCxRQUFJSSxTQUFTLEdBQUdELGFBQWhCOztBQUNBLFFBQUlELHFCQUFxQixLQUFLQyxhQUE5QixFQUE2QztBQUM1Q0MsTUFBQUEsU0FBUyxHQUFHRixxQkFBcUIsR0FBRyxJQUF4QixHQUErQkMsYUFBM0M7QUFDQTs7QUFDRCxXQUFPRSxjQUFjLENBQUNDLFFBQWYsQ0FBd0IsQ0FBQ0wsU0FBRCxFQUFZRyxTQUFaLENBQXhCLENBQVA7QUFDQSxHQVRNO0FBV1A7Ozs7Ozs7Ozs7Ozs7QUFTTyxNQUFNRyxrQkFBa0IsR0FBRyxVQUFTQyxTQUFULEVBQXVDO0FBQ3hFLFdBQ0NDLDJCQUEyQixDQUFDRCxTQUFELENBQTNCLElBQ0FFLHlCQUF5QixDQUFDRixTQUFELENBRHpCLElBRUNHLFlBQVksQ0FBQ0gsU0FBRCxDQUFaLEtBQTRCSSxNQUFNLENBQUNKLFNBQUQsQ0FBTixJQUFxQkssVUFBVSxDQUFDTCxTQUFELENBQTNELENBSEY7QUFLQSxHQU5NOzs7O0FBUUEsTUFBTU0sbUJBQW1CLEdBQUcsVUFBU0MsY0FBVCxFQUE4QztBQUNoRixRQUFNQyxjQUFjLEdBQUdELGNBQWMsQ0FBQ3hCLFlBQXRDO0FBQ0EsUUFBTTBCLGtCQUFrQixHQUFHQyxpQ0FBaUMsQ0FBQ0gsY0FBRCxFQUFpQixDQUFDLGFBQUQsQ0FBakIsQ0FBNUQ7QUFDQSxXQUFPSSxXQUFXLENBQUNILGNBQUQsQ0FBWCxJQUErQmxCLGNBQWMsQ0FBQ21CLGtCQUFELENBQXBEO0FBQ0EsR0FKTTs7OztBQU1BLE1BQU1HLHdCQUF3QixHQUFHLFVBQVNMLGNBQVQsRUFBdUQ7QUFDOUYsV0FBT2pCLGNBQWMsQ0FBQ29CLGlDQUFpQyxDQUFDSCxjQUFELEVBQWlCLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUFqQixDQUFsQyxDQUFkLEtBQXFHLE9BQTVHO0FBQ0EsR0FGTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcGlsZUJpbmRpbmcsIEJpbmRpbmdFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IFN0YWJsZUlkSGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnNcIjtcbmltcG9ydCB7IFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7XG5cdGhhc1ZhbHVlSGVscFdpdGhGaXhlZFZhbHVlcyxcblx0aGFzVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbixcblx0aGFzVmFsdWVIZWxwLFxuXHRpc1VuaXQsXG5cdGlzQ3VycmVuY3ksXG5cdGhhc0RhdGVUeXBlXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoLCBjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyBnZXREaXNwbGF5TW9kZSB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1VJRm9ybWF0dGVyc1wiO1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBkaXNwbGF5TW9kZSBmb3IgdGhlIHZhbHVlIGhlbHAuXG4gKiBUaGUgbWFpbiBydWxlIGlzIHRoYXQgaWYgYSBwcm9wZXJ0eSBpcyB1c2VkIGluIGEgVkhUYWJsZSB0aGVuIHdlIGRvbid0IHdhbnQgdG8gZGlzcGxheSB0aGUgdGV4dCBhcnJhbmdlbWVudCBkaXJlY3RseS5cbiAqXG4gKiBAcGFyYW0gcHJvcGVydHlQYXRoIHRoZSBjdXJyZW50IHByb3BlcnR5XG4gKiBAcmV0dXJucyB0aGUgdGFyZ2V0IGRpc3BsYXlNb2RlXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZUhlbHBUYWJsZURpc3BsYXlNb2RlID0gZnVuY3Rpb24ocHJvcGVydHlQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogc3RyaW5nIHtcblx0Y29uc3Qgc0Rpc3BsYXlNb2RlID0gZ2V0RGlzcGxheU1vZGUocHJvcGVydHlQYXRoLnRhcmdldE9iamVjdCwgcHJvcGVydHlQYXRoKTtcblx0Ly8gaWYgdGhlIHByb3BlcnR5IGlzIHVzZWQgaW4gYSBWSFRhYmxlIGNvbnNpZGVyIG9ubHkgI1RleHRPbmx5IGVsc2Ugc2hvdyB0aGUgdmFsdWVcblx0cmV0dXJuIHNEaXNwbGF5TW9kZSA9PT0gXCJEZXNjcmlwdGlvblwiID8gXCJEZXNjcmlwdGlvblwiIDogXCJWYWx1ZVwiO1xufTtcblxuLyoqXG4gKiBNZXRob2QgdG8gcmV0dXJuIGRlbGVnYXRlIHByb3BlcnR5IG9mIFZhbHVlIEhlbHAuXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBnZXREZWxlZ2F0ZUNvbmZpZ3VyYXRpb25cbiAqIEBtZW1iZXJvZiBzYXAuZmUubWFjcm9zLmludGVybmFsLnZhbHVlaGVscC5WYWx1ZUhlbHBUZW1wbGF0aW5nLmpzXG4gKiBAcGFyYW0gcHJvcGVydHlQYXRoIHByb3BlcnR5IG5hbWVcbiAqIEBwYXJhbSBjb25kaXRpb25Nb2RlbE5hbWUgQ29uZGl0aW9uIG1vZGVsIG9mIHRoZSBWYWx1ZSBIZWxwXG4gKiBAcmV0dXJucyByZXR1cm5zIGFuIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGNvbnN0IGdldERlbGVnYXRlQ29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKHByb3BlcnR5UGF0aDogc3RyaW5nLCBjb25kaXRpb25Nb2RlbE5hbWU6IHN0cmluZyk6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBkZWxlZ2F0ZUNvbmZpZ3VyYXRpb24gPSB7XG5cdFx0bmFtZTogXCJzYXAvZmUvbWFjcm9zL0ZpZWxkVmFsdWVIZWxwRGVsZWdhdGVcIixcblx0XHRwYXlsb2FkOiB7XG5cdFx0XHRwcm9wZXJ0eVBhdGg6IHByb3BlcnR5UGF0aCxcblx0XHRcdGNvbmRpdGlvbk1vZGVsOiBjb25kaXRpb25Nb2RlbE5hbWVcblx0XHR9XG5cdH07XG5cdHJldHVybiBjb21waWxlQmluZGluZyhkZWxlZ2F0ZUNvbmZpZ3VyYXRpb24pO1xufTtcblxuLyoqXG4gKiBNZXRob2QgdG8gZ2VuZXJhdGUgdGhlIElEIGZvciBWYWx1ZSBIZWxwLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgZ2VuZXJhdGVJRFxuICogQG1lbWJlcm9mIHNhcC5mZS5tYWNyb3MuaW50ZXJuYWwudmFsdWVoZWxwLlZhbHVlSGVscFRlbXBsYXRpbmcuanNcbiAqIEBwYXJhbSB7c3RyaW5nfSBzRmxleElkIEZsZXggSUQgb2YgdGhlIGN1cnJlbnQgb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc0lkUHJlZml4IFByZWZpeCBmb3IgdGhlIFZhbHVlSGVscCBJRFxuICogQHBhcmFtIHtzdHJpbmd9IHNPcmlnaW5hbFByb3BlcnR5TmFtZSBOYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtzdHJpbmd9IHNQcm9wZXJ0eU5hbWUgTmFtZSBvZiB0aGUgVmFsdWVIZWxwIFByb3BlcnR5XG4gKiBAcmV0dXJucyB7c3RyaW5nfSByZXR1cm5zIHRoZSBJZCBnZW5lcmF0ZWQgZm9yIHRoZSBWYWx1ZUhlbHBcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlSUQgPSBmdW5jdGlvbihzRmxleElkOiBzdHJpbmcsIHNJZFByZWZpeDogc3RyaW5nLCBzT3JpZ2luYWxQcm9wZXJ0eU5hbWU6IHN0cmluZywgc1Byb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKHNGbGV4SWQpIHtcblx0XHRyZXR1cm4gc0ZsZXhJZDtcblx0fVxuXHRsZXQgc1Byb3BlcnR5ID0gc1Byb3BlcnR5TmFtZTtcblx0aWYgKHNPcmlnaW5hbFByb3BlcnR5TmFtZSAhPT0gc1Byb3BlcnR5TmFtZSkge1xuXHRcdHNQcm9wZXJ0eSA9IHNPcmlnaW5hbFByb3BlcnR5TmFtZSArIFwiOjpcIiArIHNQcm9wZXJ0eU5hbWU7XG5cdH1cblx0cmV0dXJuIFN0YWJsZUlkSGVscGVyLmdlbmVyYXRlKFtzSWRQcmVmaXgsIHNQcm9wZXJ0eV0pO1xufTtcblxuLyoqXG4gKiBNZXRob2QgdG8gY2hlY2sgaWYgYSBwcm9wZXJ0eSBuZWVkcyB0byBiZSB2YWxpZGF0ZWQgb3Igbm90IHdoZW4gdXNlZCBpbiB0aGUgdmFsdWVoZWxwLlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgcmVxdWlyZXNWYWxpZGF0aW9uXG4gKiBAbWVtYmVyb2Ygc2FwLmZlLm1hY3Jvcy5pbnRlcm5hbC52YWx1ZWhlbHAuVmFsdWVIZWxwVGVtcGxhdGluZy5qc1xuICogQHBhcmFtICBvUHJvcGVydHkgdmFsdWUgaGVscCBwcm9wZXJ0eSB0eXBlIGFubm90YXRpb25zXG4gKiBAcmV0dXJucyByZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGhlbHAgbmVlZCB0byBiZSB2YWxpZGF0ZWRcbiAqL1xuZXhwb3J0IGNvbnN0IHJlcXVpcmVzVmFsaWRhdGlvbiA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHRoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMob1Byb3BlcnR5KSB8fFxuXHRcdGhhc1ZhbHVlTGlzdEZvclZhbGlkYXRpb24ob1Byb3BlcnR5KSB8fFxuXHRcdChoYXNWYWx1ZUhlbHAob1Byb3BlcnR5KSAmJiAoaXNVbml0KG9Qcm9wZXJ0eSkgfHwgaXNDdXJyZW5jeShvUHJvcGVydHkpKSlcblx0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1NlbWFudGljRGF0ZVJhbmdlID0gZnVuY3Rpb24ob0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpIHtcblx0Y29uc3QgdGFyZ2V0UHJvcGVydHkgPSBvRGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cdGNvbnN0IHRhcmdldFJlc3RyaWN0aW9ucyA9IGNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyhvRGF0YU1vZGVsUGF0aCwgW1wiU2luZ2xlUmFuZ2VcIl0pO1xuXHRyZXR1cm4gaGFzRGF0ZVR5cGUodGFyZ2V0UHJvcGVydHkpICYmIGNvbXBpbGVCaW5kaW5nKHRhcmdldFJlc3RyaWN0aW9ucyk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2hvdWxkU2hvd0NvbmRpdGlvblBhbmVsID0gZnVuY3Rpb24ob0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBib29sZWFuIHtcblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyhvRGF0YU1vZGVsUGF0aCwgW1wiU2luZ2xlVmFsdWVcIiwgXCJNdWx0aVZhbHVlXCJdKSkgPT09IFwiZmFsc2VcIjtcbn07XG4iXX0=