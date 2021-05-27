sap.ui.define(["sap/ui/mdc/condition/Condition", "sap/ui/mdc/enum/ConditionValidated"], function (Condition, ConditionValidated) {
  "use strict";

  var _exports = {};
  var createCondition = Condition.createCondition;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var aValidTypes = ["Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Float", "Edm.Guid", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.String", "Edm.Time", "Edm.TimeOfDay"];
  var oExcludeMap = {
    "Contains": "NotContains",
    "StartsWith": "NotStartsWith",
    "EndsWith": "NotEndsWith",
    "Empty": "NotEmpty",
    "NotEmpty": "Empty",
    "LE": "NOTLE",
    "GE": "NOTGE",
    "LT": "NOTLT",
    "GT": "NOTGT",
    "BT": "NOTBT",
    "NE": "EQ",
    "EQ": "NE"
  };
  /**
   * Method to get the compliant value type based on data type.
   *
   * @param  sValue - Raw value
   * @param  sType - Property Metadata type for type conversion
   * @returns - value to be propagated to the condition.
   */

  function getTypeCompliantValue(sValue, sType) {
    var oValue;

    if (aValidTypes.indexOf(sType) > -1) {
      oValue = sValue;

      if (sType === "Edm.Boolean") {
        oValue = sValue === "true" || (sValue === "false" ? false : undefined);
      } else if (sType === "Edm.Double" || sType === "Edm.Single") {
        oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
      } else if (sType === "Edm.Byte" || sType === "Edm.Int16" || sType === "Edm.Int32" || sType === "Edm.SByte") {
        oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
      } else if (sType === "Edm.Date") {
        oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) ? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] : sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
      } else if (sType === "Edm.DateTimeOffset") {
        if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] + "+0000";
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] + "T00:00:00+0000";
        } else if (sValue.indexOf("Z") === sValue.length - 1) {
          oValue = sValue.split("Z")[0] + "+0100";
        } else {
          oValue = undefined;
        }
      } else if (sType === "Edm.TimeOfDay") {
        oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
      }
    }

    return oValue;
  }
  /**
   * Method to create a condition.
   * @param  sOption - Operator to be used.
   * @param  oV1 - Lower Value
   * @param  oV2 - Higher Value
   * @param sSign
   * @returns - condition.
   */


  _exports.getTypeCompliantValue = getTypeCompliantValue;

  function resolveConditionValues(sOption, oV1, oV2, sSign) {
    var oValue = oV1,
        oValue2,
        sInternalOperation;
    var oCondition = {};
    oCondition.values = [];
    oCondition.isEmpty = null;

    if (oV1 === undefined || oV1 === null) {
      return;
    }

    switch (sOption) {
      case "CP":
        sInternalOperation = "Contains";

        if (oValue) {
          var nIndexOf = oValue.indexOf("*");
          var nLastIndex = oValue.lastIndexOf("*"); // only when there are '*' at all

          if (nIndexOf > -1) {
            if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
              sInternalOperation = "EndsWith";
              oValue = oValue.substring(1, oValue.length);
            } else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
              sInternalOperation = "StartsWith";
              oValue = oValue.substring(0, oValue.length - 1);
            } else {
              oValue = oValue.substring(1, oValue.length - 1);
            }
          } else {
            /* TODO Add diagonostics Log.warning("Contains Option cannot be used without '*'.") */
            return;
          }
        }

        break;

      case "EQ":
        sInternalOperation = oV1 === "" ? "Empty" : sOption;
        break;

      case "NE":
        sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
        break;

      case "BT":
        if (oV2 === undefined || oV2 === null) {
          return;
        }

        oValue2 = oV2;
        sInternalOperation = sOption;
        break;

      case "LE":
      case "GE":
      case "GT":
      case "LT":
        sInternalOperation = sOption;
        break;

      default:
        /* TODO Add diagonostics Log.warning("Selection Option is not supported : '" + sOption + "'"); */
        return;
    }

    if (sSign === "E") {
      sInternalOperation = oExcludeMap[sInternalOperation];
    }

    oCondition.operator = sInternalOperation;

    if (sInternalOperation !== "Empty") {
      oCondition.values.push(oValue);

      if (oValue2) {
        oCondition.values.push(oValue2);
      }
    }

    return oCondition;
  }
  /* Method to get the operator from the Selection Option */


  _exports.resolveConditionValues = resolveConditionValues;

  function getOperator(sOperator) {
    return sOperator.indexOf("/") > 0 ? sOperator.split("/")[1] : sOperator;
  }

  _exports.getOperator = getOperator;

  function getFiltersConditionsFromSelectionVariant(entityTypeProperties, selectionVariant) {
    var ofilterConditions = {};

    if (selectionVariant) {
      var aSelectOptions = selectionVariant.SelectOptions;
      var aValidProperties = entityTypeProperties;
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var sPropertyName = propertyName.value;
        var Ranges = selectOption.Ranges;

        for (var key in aValidProperties) {
          if (sPropertyName === key) {
            (function () {
              var oValidProperty = aValidProperties[key];
              var aConditions = [];
              Ranges === null || Ranges === void 0 ? void 0 : Ranges.forEach(function (Range) {
                var oCondition = getConditions(Range, oValidProperty);
                aConditions.push(oCondition);

                if (aConditions.length) {
                  ofilterConditions[sPropertyName] = aConditions;
                }
              });
            })();
          }
        }
      });
    }

    return ofilterConditions;
  }

  _exports.getFiltersConditionsFromSelectionVariant = getFiltersConditionsFromSelectionVariant;

  function getConditions(Range, oValidProperty) {
    var oCondition;
    var sign = Range.Sign;
    var sOption = Range.Option ? getOperator(Range.Option) : undefined;
    var oValue1 = getTypeCompliantValue(Range.Low, oValidProperty.$Type);
    var oValue2 = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.$Type) : undefined;
    var oConditionValues = resolveConditionValues(sOption, oValue1, oValue2, sign);

    if (oConditionValues) {
      oCondition = createCondition(oConditionValues.operator, oConditionValues.values, null, null, ConditionValidated.Validated);
    }

    return oCondition;
  }

  _exports.getConditions = getConditions;

  var getDefaultValueFilters = function (oContext, properties) {
    var filterConditions = {};
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel();

    if (properties) {
      for (var key in properties) {
        var defaultFilterValue = oMetaModel.getObject(entitySetPath + "/" + key + "@com.sap.vocabularies.Common.v1.FilterDefaultValue");

        if (defaultFilterValue) {
          var PropertyName = key;
          filterConditions[PropertyName] = [createCondition("EQ", [defaultFilterValue], null, null, ConditionValidated.Validated)];
        }
      }
    }

    return filterConditions;
  };

  function getEditStatusFilter() {
    var ofilterConditions = {};
    ofilterConditions["$editState"] = [createCondition("DRAFT_EDIT_STATE", ["ALL"], null, null, ConditionValidated.Validated)];
    return ofilterConditions;
  }

  function getFilterConditions(oContext, filterConditions) {
    var _filterConditions;

    var editStateFilter;
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel(),
        entityTypeAnnotations = oMetaModel.getObject(entitySetPath + "@"),
        entityTypeProperties = oMetaModel.getObject(entitySetPath + "/");

    if (entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftRoot"] || entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftNode"]) {
      editStateFilter = getEditStatusFilter();
    }

    var selectionVariant = (_filterConditions = filterConditions) === null || _filterConditions === void 0 ? void 0 : _filterConditions.selectionVariant;
    var defaultFilters = getDefaultValueFilters(oContext, entityTypeProperties);

    if (selectionVariant) {
      filterConditions = getFiltersConditionsFromSelectionVariant(entityTypeProperties, selectionVariant);
    } else if (defaultFilters) {
      filterConditions = defaultFilters;
    }

    if (editStateFilter) {
      filterConditions = _objectSpread({}, filterConditions, {}, editStateFilter);
    }

    return JSON.stringify(filterConditions);
  }

  _exports.getFilterConditions = getFilterConditions;
  getFilterConditions.requiresIContext = true;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlckhlbHBlci50cyJdLCJuYW1lcyI6WyJhVmFsaWRUeXBlcyIsIm9FeGNsdWRlTWFwIiwiZ2V0VHlwZUNvbXBsaWFudFZhbHVlIiwic1ZhbHVlIiwic1R5cGUiLCJvVmFsdWUiLCJpbmRleE9mIiwidW5kZWZpbmVkIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwicGFyc2VJbnQiLCJtYXRjaCIsImxlbmd0aCIsInNwbGl0IiwicmVzb2x2ZUNvbmRpdGlvblZhbHVlcyIsInNPcHRpb24iLCJvVjEiLCJvVjIiLCJzU2lnbiIsIm9WYWx1ZTIiLCJzSW50ZXJuYWxPcGVyYXRpb24iLCJvQ29uZGl0aW9uIiwidmFsdWVzIiwiaXNFbXB0eSIsIm5JbmRleE9mIiwibkxhc3RJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwib3BlcmF0b3IiLCJwdXNoIiwiZ2V0T3BlcmF0b3IiLCJzT3BlcmF0b3IiLCJnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50IiwiZW50aXR5VHlwZVByb3BlcnRpZXMiLCJzZWxlY3Rpb25WYXJpYW50Iiwib2ZpbHRlckNvbmRpdGlvbnMiLCJhU2VsZWN0T3B0aW9ucyIsIlNlbGVjdE9wdGlvbnMiLCJhVmFsaWRQcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInNlbGVjdE9wdGlvbiIsInByb3BlcnR5TmFtZSIsIlByb3BlcnR5TmFtZSIsInNQcm9wZXJ0eU5hbWUiLCJ2YWx1ZSIsIlJhbmdlcyIsImtleSIsIm9WYWxpZFByb3BlcnR5IiwiYUNvbmRpdGlvbnMiLCJSYW5nZSIsImdldENvbmRpdGlvbnMiLCJzaWduIiwiU2lnbiIsIk9wdGlvbiIsIm9WYWx1ZTEiLCJMb3ciLCIkVHlwZSIsIkhpZ2giLCJvQ29uZGl0aW9uVmFsdWVzIiwiY3JlYXRlQ29uZGl0aW9uIiwiQ29uZGl0aW9uVmFsaWRhdGVkIiwiVmFsaWRhdGVkIiwiZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyIsIm9Db250ZXh0IiwicHJvcGVydGllcyIsImZpbHRlckNvbmRpdGlvbnMiLCJlbnRpdHlTZXRQYXRoIiwiZ2V0SW50ZXJmYWNlIiwiZ2V0UGF0aCIsIm9NZXRhTW9kZWwiLCJnZXRNb2RlbCIsImRlZmF1bHRGaWx0ZXJWYWx1ZSIsImdldE9iamVjdCIsImdldEVkaXRTdGF0dXNGaWx0ZXIiLCJnZXRGaWx0ZXJDb25kaXRpb25zIiwiZWRpdFN0YXRlRmlsdGVyIiwiZW50aXR5VHlwZUFubm90YXRpb25zIiwiZGVmYXVsdEZpbHRlcnMiLCJKU09OIiwic3RyaW5naWZ5IiwicmVxdWlyZXNJQ29udGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBV0EsTUFBTUEsV0FBVyxHQUFHLENBQ25CLGFBRG1CLEVBRW5CLFVBRm1CLEVBR25CLFVBSG1CLEVBSW5CLGNBSm1CLEVBS25CLG9CQUxtQixFQU1uQixhQU5tQixFQU9uQixZQVBtQixFQVFuQixXQVJtQixFQVNuQixVQVRtQixFQVVuQixXQVZtQixFQVduQixXQVhtQixFQVluQixXQVptQixFQWFuQixXQWJtQixFQWNuQixZQWRtQixFQWVuQixZQWZtQixFQWdCbkIsVUFoQm1CLEVBaUJuQixlQWpCbUIsQ0FBcEI7QUFvQkEsTUFBTUMsV0FBZ0MsR0FBRztBQUN4QyxnQkFBWSxhQUQ0QjtBQUV4QyxrQkFBYyxlQUYwQjtBQUd4QyxnQkFBWSxhQUg0QjtBQUl4QyxhQUFTLFVBSitCO0FBS3hDLGdCQUFZLE9BTDRCO0FBTXhDLFVBQU0sT0FOa0M7QUFPeEMsVUFBTSxPQVBrQztBQVF4QyxVQUFNLE9BUmtDO0FBU3hDLFVBQU0sT0FUa0M7QUFVeEMsVUFBTSxPQVZrQztBQVd4QyxVQUFNLElBWGtDO0FBWXhDLFVBQU07QUFaa0MsR0FBekM7QUFlQTs7Ozs7Ozs7QUFRTyxXQUFTQyxxQkFBVCxDQUErQkMsTUFBL0IsRUFBNENDLEtBQTVDLEVBQTJEO0FBQ2pFLFFBQUlDLE1BQUo7O0FBQ0EsUUFBSUwsV0FBVyxDQUFDTSxPQUFaLENBQW9CRixLQUFwQixJQUE2QixDQUFDLENBQWxDLEVBQXFDO0FB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QUEsUUFFQ00scUJBQXFCLEdBQUdQLFVBQVUsQ0FBQ0csU0FBWCxDQUFxQk4sYUFBYSxHQUFHLEdBQXJDLENBRnpCO0FBQUEsUUFHQ2pDLG9CQUFvQixHQUFHb0MsVUFBVSxDQUFDRyxTQUFYLENBQXFCTixhQUFhLEdBQUcsR0FBckMsQ0FIeEI7O0FBSUEsUUFDQ1UscUJBQXFCLENBQUMsMkNBQUQsQ0FBckIsSUFDQUEscUJBQXFCLENBQUMsMkNBQUQsQ0FGdEIsRUFHRTtBQUNERCxNQUFBQSxlQUFlLEdBQUdGLG1CQUFtQixFQUFyQztBQUNBOztBQUNELFFBQU12QyxnQkFBZ0Isd0JBQUcrQixnQkFBSCxzREFBRyxrQkFBa0IvQixnQkFBM0M7QUFDQSxRQUFNMkMsY0FBYyxHQUFHZixzQkFBc0IsQ0FBQ0MsUUFBRCxFQUFXOUIsb0JBQVgsQ0FBN0M7O0FBQ0EsUUFBSUMsZ0JBQUosRUFBc0I7QUFDckIrQixNQUFBQSxnQkFBZ0IsR0FBR2pDLHdDQUF3QyxDQUFDQyxvQkFBRCxFQUF1QkMsZ0JBQXZCLENBQTNEO0FBQ0EsS0FGRCxNQUVPLElBQUkyQyxjQUFKLEVBQW9CO0FBQzFCWixNQUFBQSxnQkFBZ0IsR0FBR1ksY0FBbkI7QUFDQTs7QUFDRCxRQUFJRixlQUFKLEVBQXFCO0FBQ3BCVixNQUFBQSxnQkFBZ0IscUJBQVFBLGdCQUFSLE1BQTZCVSxlQUE3QixDQUFoQjtBQUNBOztBQUVELFdBQU9HLElBQUksQ0FBQ0MsU0FBTCxDQUFlZCxnQkFBZixDQUFQO0FBQ0E7OztBQUVEUyxFQUFBQSxtQkFBbUIsQ0FBQ00sZ0JBQXBCLEdBQXVDLElBQXZDIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWxlY3RPcHRpb25UeXBlLCBTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL1VJXCI7XG5pbXBvcnQgeyBjcmVhdGVDb25kaXRpb24gfSBmcm9tIFwic2FwL3VpL21kYy9jb25kaXRpb24vQ29uZGl0aW9uXCI7XG5pbXBvcnQgeyBDb25kaXRpb25WYWxpZGF0ZWQgfSBmcm9tIFwic2FwL3VpL21kYy9lbnVtXCI7XG5cbmV4cG9ydCB0eXBlIEZpbHRlckNvbmRpdGlvbnMgPSB7XG5cdG9wZXJhdG9yOiBzdHJpbmc7XG5cdHZhbHVlczogQXJyYXk8c3RyaW5nPjtcblx0aXNFbXB0eT86IGJvb2xlYW4gfCBudWxsO1xuXHR2YWxpZGF0ZWQ/OiBzdHJpbmc7XG59O1xuXG5jb25zdCBhVmFsaWRUeXBlcyA9IFtcblx0XCJFZG0uQm9vbGVhblwiLFxuXHRcIkVkbS5CeXRlXCIsXG5cdFwiRWRtLkRhdGVcIixcblx0XCJFZG0uRGF0ZVRpbWVcIixcblx0XCJFZG0uRGF0ZVRpbWVPZmZzZXRcIixcblx0XCJFZG0uRGVjaW1hbFwiLFxuXHRcIkVkbS5Eb3VibGVcIixcblx0XCJFZG0uRmxvYXRcIixcblx0XCJFZG0uR3VpZFwiLFxuXHRcIkVkbS5JbnQxNlwiLFxuXHRcIkVkbS5JbnQzMlwiLFxuXHRcIkVkbS5JbnQ2NFwiLFxuXHRcIkVkbS5TQnl0ZVwiLFxuXHRcIkVkbS5TaW5nbGVcIixcblx0XCJFZG0uU3RyaW5nXCIsXG5cdFwiRWRtLlRpbWVcIixcblx0XCJFZG0uVGltZU9mRGF5XCJcbl07XG5cbmNvbnN0IG9FeGNsdWRlTWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuXHRcIkNvbnRhaW5zXCI6IFwiTm90Q29udGFpbnNcIixcblx0XCJTdGFydHNXaXRoXCI6IFwiTm90U3RhcnRzV2l0aFwiLFxuXHRcIkVuZHNXaXRoXCI6IFwiTm90RW5kc1dpdGhcIixcblx0XCJFbXB0eVwiOiBcIk5vdEVtcHR5XCIsXG5cdFwiTm90RW1wdHlcIjogXCJFbXB0eVwiLFxuXHRcIkxFXCI6IFwiTk9UTEVcIixcblx0XCJHRVwiOiBcIk5PVEdFXCIsXG5cdFwiTFRcIjogXCJOT1RMVFwiLFxuXHRcIkdUXCI6IFwiTk9UR1RcIixcblx0XCJCVFwiOiBcIk5PVEJUXCIsXG5cdFwiTkVcIjogXCJFUVwiLFxuXHRcIkVRXCI6IFwiTkVcIlxufTtcblxuLyoqXG4gKiBNZXRob2QgdG8gZ2V0IHRoZSBjb21wbGlhbnQgdmFsdWUgdHlwZSBiYXNlZCBvbiBkYXRhIHR5cGUuXG4gKlxuICogQHBhcmFtICBzVmFsdWUgLSBSYXcgdmFsdWVcbiAqIEBwYXJhbSAgc1R5cGUgLSBQcm9wZXJ0eSBNZXRhZGF0YSB0eXBlIGZvciB0eXBlIGNvbnZlcnNpb25cbiAqIEByZXR1cm5zIC0gdmFsdWUgdG8gYmUgcHJvcGFnYXRlZCB0byB0aGUgY29uZGl0aW9uLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlQ29tcGxpYW50VmFsdWUoc1ZhbHVlOiBhbnksIHNUeXBlOiBzdHJpbmcpIHtcblx0bGV0IG9WYWx1ZTtcblx0aWYgKGFWYWxpZFR5cGVzLmluZGV4T2Yoc1R5cGUpID4gLTEpIHtcblx0XHRvVmFsdWUgPSBzVmFsdWU7XG5cdFx0aWYgKHNUeXBlID09PSBcIkVkbS5Cb29sZWFuXCIpIHtcblx0XHRcdG9WYWx1ZSA9IHNWYWx1ZSA9PT0gXCJ0cnVlXCIgfHwgKHNWYWx1ZSA9PT0gXCJmYWxzZVwiID8gZmFsc2UgOiB1bmRlZmluZWQpO1xuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkRvdWJsZVwiIHx8IHNUeXBlID09PSBcIkVkbS5TaW5nbGVcIikge1xuXHRcdFx0b1ZhbHVlID0gaXNOYU4oc1ZhbHVlKSA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQoc1ZhbHVlKTtcblx0XHR9IGVsc2UgaWYgKHNUeXBlID09PSBcIkVkbS5CeXRlXCIgfHwgc1R5cGUgPT09IFwiRWRtLkludDE2XCIgfHwgc1R5cGUgPT09IFwiRWRtLkludDMyXCIgfHwgc1R5cGUgPT09IFwiRWRtLlNCeXRlXCIpIHtcblx0XHRcdG9WYWx1ZSA9IGlzTmFOKHNWYWx1ZSkgPyB1bmRlZmluZWQgOiBwYXJzZUludChzVmFsdWUsIDEwKTtcblx0XHR9IGVsc2UgaWYgKHNUeXBlID09PSBcIkVkbS5EYXRlXCIpIHtcblx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pXG5cdFx0XHRcdD8gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLylbMF1cblx0XHRcdFx0OiBzVmFsdWUubWF0Y2goL14oXFxkezh9KS8pICYmIHNWYWx1ZS5tYXRjaCgvXihcXGR7OH0pLylbMF07XG5cdFx0fSBlbHNlIGlmIChzVHlwZSA9PT0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIikge1xuXHRcdFx0aWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KVxcKyhcXGR7MSw0fSkvKSkge1xuXHRcdFx0XHRvVmFsdWUgPSBzVmFsdWUubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSlUKFxcZHsxLDJ9KTooXFxkezEsMn0pOihcXGR7MSwyfSlcXCsoXFxkezEsNH0pLylbMF07XG5cdFx0XHR9IGVsc2UgaWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KS8pKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KS8pWzBdICsgXCIrMDAwMFwiO1xuXHRcdFx0fSBlbHNlIGlmIChzVmFsdWUubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKSkge1xuXHRcdFx0XHRvVmFsdWUgPSBzVmFsdWUubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKVswXSArIFwiVDAwOjAwOjAwKzAwMDBcIjtcblx0XHRcdH0gZWxzZSBpZiAoc1ZhbHVlLmluZGV4T2YoXCJaXCIpID09PSBzVmFsdWUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRvVmFsdWUgPSBzVmFsdWUuc3BsaXQoXCJaXCIpWzBdICsgXCIrMDEwMFwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b1ZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLlRpbWVPZkRheVwiKSB7XG5cdFx0XHRvVmFsdWUgPSBzVmFsdWUubWF0Y2goLyhcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLykgPyBzVmFsdWUubWF0Y2goLyhcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLylbMF0gOiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvVmFsdWU7XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGNyZWF0ZSBhIGNvbmRpdGlvbi5cbiAqIEBwYXJhbSAgc09wdGlvbiAtIE9wZXJhdG9yIHRvIGJlIHVzZWQuXG4gKiBAcGFyYW0gIG9WMSAtIExvd2VyIFZhbHVlXG4gKiBAcGFyYW0gIG9WMiAtIEhpZ2hlciBWYWx1ZVxuICogQHBhcmFtIHNTaWduXG4gKiBAcmV0dXJucyAtIGNvbmRpdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVDb25kaXRpb25WYWx1ZXMoc09wdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkLCBvVjE6IGFueSwgb1YyOiBhbnksIHNTaWduOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcblx0bGV0IG9WYWx1ZSA9IG9WMSxcblx0XHRvVmFsdWUyLFxuXHRcdHNJbnRlcm5hbE9wZXJhdGlvbjogYW55O1xuXHRjb25zdCBvQ29uZGl0aW9uOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdG9Db25kaXRpb24udmFsdWVzID0gW107XG5cdG9Db25kaXRpb24uaXNFbXB0eSA9IG51bGwgYXMgYW55O1xuXHRpZiAob1YxID09PSB1bmRlZmluZWQgfHwgb1YxID09PSBudWxsKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0c3dpdGNoIChzT3B0aW9uKSB7XG5cdFx0Y2FzZSBcIkNQXCI6XG5cdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBcIkNvbnRhaW5zXCI7XG5cdFx0XHRpZiAob1ZhbHVlKSB7XG5cdFx0XHRcdGNvbnN0IG5JbmRleE9mID0gb1ZhbHVlLmluZGV4T2YoXCIqXCIpO1xuXHRcdFx0XHRjb25zdCBuTGFzdEluZGV4ID0gb1ZhbHVlLmxhc3RJbmRleE9mKFwiKlwiKTtcblxuXHRcdFx0XHQvLyBvbmx5IHdoZW4gdGhlcmUgYXJlICcqJyBhdCBhbGxcblx0XHRcdFx0aWYgKG5JbmRleE9mID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobkluZGV4T2YgPT09IDAgJiYgbkxhc3RJbmRleCAhPT0gb1ZhbHVlLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IFwiRW5kc1dpdGhcIjtcblx0XHRcdFx0XHRcdG9WYWx1ZSA9IG9WYWx1ZS5zdWJzdHJpbmcoMSwgb1ZhbHVlLmxlbmd0aCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChuSW5kZXhPZiAhPT0gMCAmJiBuTGFzdEluZGV4ID09PSBvVmFsdWUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gXCJTdGFydHNXaXRoXCI7XG5cdFx0XHRcdFx0XHRvVmFsdWUgPSBvVmFsdWUuc3Vic3RyaW5nKDAsIG9WYWx1ZS5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0b1ZhbHVlID0gb1ZhbHVlLnN1YnN0cmluZygxLCBvVmFsdWUubGVuZ3RoIC0gMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8qIFRPRE8gQWRkIGRpYWdvbm9zdGljcyBMb2cud2FybmluZyhcIkNvbnRhaW5zIE9wdGlvbiBjYW5ub3QgYmUgdXNlZCB3aXRob3V0ICcqJy5cIikgKi9cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJFUVwiOlxuXHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gb1YxID09PSBcIlwiID8gXCJFbXB0eVwiIDogc09wdGlvbjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJORVwiOlxuXHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gb1YxID09PSBcIlwiID8gXCJOb3RFbXB0eVwiIDogc09wdGlvbjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJCVFwiOlxuXHRcdFx0aWYgKG9WMiA9PT0gdW5kZWZpbmVkIHx8IG9WMiA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRvVmFsdWUyID0gb1YyO1xuXHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gc09wdGlvbjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJMRVwiOlxuXHRcdGNhc2UgXCJHRVwiOlxuXHRcdGNhc2UgXCJHVFwiOlxuXHRcdGNhc2UgXCJMVFwiOlxuXHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gc09wdGlvbjtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvKiBUT0RPIEFkZCBkaWFnb25vc3RpY3MgTG9nLndhcm5pbmcoXCJTZWxlY3Rpb24gT3B0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgOiAnXCIgKyBzT3B0aW9uICsgXCInXCIpOyAqL1xuXHRcdFx0cmV0dXJuO1xuXHR9XG5cdGlmIChzU2lnbiA9PT0gXCJFXCIpIHtcblx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBvRXhjbHVkZU1hcFtzSW50ZXJuYWxPcGVyYXRpb25dO1xuXHR9XG5cdG9Db25kaXRpb24ub3BlcmF0b3IgPSBzSW50ZXJuYWxPcGVyYXRpb247XG5cdGlmIChzSW50ZXJuYWxPcGVyYXRpb24gIT09IFwiRW1wdHlcIikge1xuXHRcdG9Db25kaXRpb24udmFsdWVzLnB1c2gob1ZhbHVlKTtcblx0XHRpZiAob1ZhbHVlMikge1xuXHRcdFx0b0NvbmRpdGlvbi52YWx1ZXMucHVzaChvVmFsdWUyKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9Db25kaXRpb247XG59XG5cbi8qIE1ldGhvZCB0byBnZXQgdGhlIG9wZXJhdG9yIGZyb20gdGhlIFNlbGVjdGlvbiBPcHRpb24gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcGVyYXRvcihzT3BlcmF0b3I6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBzT3BlcmF0b3IuaW5kZXhPZihcIi9cIikgPiAwID8gc09wZXJhdG9yLnNwbGl0KFwiL1wiKVsxXSA6IHNPcGVyYXRvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdGlvblZhcmlhbnQoXG5cdGVudGl0eVR5cGVQcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBvYmplY3Q+LFxuXHRzZWxlY3Rpb25WYXJpYW50OiBTZWxlY3Rpb25WYXJpYW50VHlwZVR5cGVzXG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3Qgb2ZpbHRlckNvbmRpdGlvbnM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0aWYgKHNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRjb25zdCBhU2VsZWN0T3B0aW9ucyA9IHNlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucztcblx0XHRjb25zdCBhVmFsaWRQcm9wZXJ0aWVzID0gZW50aXR5VHlwZVByb3BlcnRpZXM7XG5cdFx0YVNlbGVjdE9wdGlvbnM/LmZvckVhY2goKHNlbGVjdE9wdGlvbjogU2VsZWN0T3B0aW9uVHlwZSkgPT4ge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lOiBhbnkgPSBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lO1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5TmFtZTogc3RyaW5nID0gcHJvcGVydHlOYW1lLnZhbHVlO1xuXHRcdFx0Y29uc3QgUmFuZ2VzOiBhbnkgPSBzZWxlY3RPcHRpb24uUmFuZ2VzO1xuXHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gYVZhbGlkUHJvcGVydGllcykge1xuXHRcdFx0XHRpZiAoc1Byb3BlcnR5TmFtZSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1ZhbGlkUHJvcGVydHkgPSBhVmFsaWRQcm9wZXJ0aWVzW2tleV0gYXMgYW55O1xuXHRcdFx0XHRcdGNvbnN0IGFDb25kaXRpb25zOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRcdFJhbmdlcz8uZm9yRWFjaCgoUmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0NvbmRpdGlvbiA9IGdldENvbmRpdGlvbnMoUmFuZ2UsIG9WYWxpZFByb3BlcnR5KTtcblx0XHRcdFx0XHRcdGFDb25kaXRpb25zLnB1c2gob0NvbmRpdGlvbik7XG5cdFx0XHRcdFx0XHRpZiAoYUNvbmRpdGlvbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdG9maWx0ZXJDb25kaXRpb25zW3NQcm9wZXJ0eU5hbWVdID0gYUNvbmRpdGlvbnM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gb2ZpbHRlckNvbmRpdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25kaXRpb25zKFJhbmdlOiBhbnksIG9WYWxpZFByb3BlcnR5OiBhbnkpIHtcblx0bGV0IG9Db25kaXRpb247XG5cdGNvbnN0IHNpZ246IHN0cmluZyB8IHVuZGVmaW5lZCA9IFJhbmdlLlNpZ247XG5cdGNvbnN0IHNPcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IFJhbmdlLk9wdGlvbiA/IGdldE9wZXJhdG9yKFJhbmdlLk9wdGlvbikgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9WYWx1ZTE6IGFueSA9IGdldFR5cGVDb21wbGlhbnRWYWx1ZShSYW5nZS5Mb3csIG9WYWxpZFByb3BlcnR5LiRUeXBlKTtcblx0Y29uc3Qgb1ZhbHVlMjogYW55ID0gUmFuZ2UuSGlnaCA/IGdldFR5cGVDb21wbGlhbnRWYWx1ZShSYW5nZS5IaWdoLCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSkgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9Db25kaXRpb25WYWx1ZXMgPSByZXNvbHZlQ29uZGl0aW9uVmFsdWVzKHNPcHRpb24sIG9WYWx1ZTEsIG9WYWx1ZTIsIHNpZ24pIGFzIGFueTtcblx0aWYgKG9Db25kaXRpb25WYWx1ZXMpIHtcblx0XHRvQ29uZGl0aW9uID0gY3JlYXRlQ29uZGl0aW9uKG9Db25kaXRpb25WYWx1ZXMub3BlcmF0b3IsIG9Db25kaXRpb25WYWx1ZXMudmFsdWVzLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkKTtcblx0fVxuXHRyZXR1cm4gb0NvbmRpdGlvbjtcbn1cblxuY29uc3QgZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyA9IGZ1bmN0aW9uKG9Db250ZXh0OiBhbnksIHByb3BlcnRpZXM6IGFueSk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRjb25zdCBmaWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdGNvbnN0IGVudGl0eVNldFBhdGggPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0UGF0aCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0TW9kZWwoKTtcblx0aWYgKHByb3BlcnRpZXMpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRjb25zdCBkZWZhdWx0RmlsdGVyVmFsdWUgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcblx0XHRcdFx0ZW50aXR5U2V0UGF0aCArIFwiL1wiICsga2V5ICsgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZVwiXG5cdFx0XHQpO1xuXHRcdFx0aWYgKGRlZmF1bHRGaWx0ZXJWYWx1ZSkge1xuXHRcdFx0XHRjb25zdCBQcm9wZXJ0eU5hbWUgPSBrZXk7XG5cdFx0XHRcdGZpbHRlckNvbmRpdGlvbnNbUHJvcGVydHlOYW1lXSA9IFtcblx0XHRcdFx0XHRjcmVhdGVDb25kaXRpb24oXCJFUVwiLCBbZGVmYXVsdEZpbHRlclZhbHVlXSwgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLlZhbGlkYXRlZCkgYXMgRmlsdGVyQ29uZGl0aW9uc1xuXHRcdFx0XHRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZmlsdGVyQ29uZGl0aW9ucztcbn07XG5cbmZ1bmN0aW9uIGdldEVkaXRTdGF0dXNGaWx0ZXIoKTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGNvbnN0IG9maWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdG9maWx0ZXJDb25kaXRpb25zW1wiJGVkaXRTdGF0ZVwiXSA9IFtcblx0XHRjcmVhdGVDb25kaXRpb24oXCJEUkFGVF9FRElUX1NUQVRFXCIsIFtcIkFMTFwiXSwgbnVsbCwgbnVsbCwgQ29uZGl0aW9uVmFsaWRhdGVkLlZhbGlkYXRlZCkgYXMgRmlsdGVyQ29uZGl0aW9uc1xuXHRdO1xuXHRyZXR1cm4gb2ZpbHRlckNvbmRpdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJDb25kaXRpb25zKG9Db250ZXh0OiBhbnksIGZpbHRlckNvbmRpdGlvbnM6IGFueSk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRsZXQgZWRpdFN0YXRlRmlsdGVyO1xuXHRjb25zdCBlbnRpdHlTZXRQYXRoID0gb0NvbnRleHQuZ2V0SW50ZXJmYWNlKDEpLmdldFBhdGgoKSxcblx0XHRvTWV0YU1vZGVsID0gb0NvbnRleHQuZ2V0SW50ZXJmYWNlKDEpLmdldE1vZGVsKCksXG5cdFx0ZW50aXR5VHlwZUFubm90YXRpb25zID0gb01ldGFNb2RlbC5nZXRPYmplY3QoZW50aXR5U2V0UGF0aCArIFwiQFwiKSxcblx0XHRlbnRpdHlUeXBlUHJvcGVydGllcyA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGVudGl0eVNldFBhdGggKyBcIi9cIik7XG5cdGlmIChcblx0XHRlbnRpdHlUeXBlQW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiXSB8fFxuXHRcdGVudGl0eVR5cGVBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnROb2RlXCJdXG5cdCkge1xuXHRcdGVkaXRTdGF0ZUZpbHRlciA9IGdldEVkaXRTdGF0dXNGaWx0ZXIoKTtcblx0fVxuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50ID0gZmlsdGVyQ29uZGl0aW9ucz8uc2VsZWN0aW9uVmFyaWFudDtcblx0Y29uc3QgZGVmYXVsdEZpbHRlcnMgPSBnZXREZWZhdWx0VmFsdWVGaWx0ZXJzKG9Db250ZXh0LCBlbnRpdHlUeXBlUHJvcGVydGllcyk7XG5cdGlmIChzZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IGdldEZpbHRlcnNDb25kaXRpb25zRnJvbVNlbGVjdGlvblZhcmlhbnQoZW50aXR5VHlwZVByb3BlcnRpZXMsIHNlbGVjdGlvblZhcmlhbnQpO1xuXHR9IGVsc2UgaWYgKGRlZmF1bHRGaWx0ZXJzKSB7XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IGRlZmF1bHRGaWx0ZXJzO1xuXHR9XG5cdGlmIChlZGl0U3RhdGVGaWx0ZXIpIHtcblx0XHRmaWx0ZXJDb25kaXRpb25zID0geyAuLi5maWx0ZXJDb25kaXRpb25zLCAuLi5lZGl0U3RhdGVGaWx0ZXIgfTtcblx0fVxuXG5cdHJldHVybiBKU09OLnN0cmluZ2lmeShmaWx0ZXJDb25kaXRpb25zKSBhcyBhbnk7XG59XG5cbmdldEZpbHRlckNvbmRpdGlvbnMucmVxdWlyZXNJQ29udGV4dCA9IHRydWU7XG4iXX0=