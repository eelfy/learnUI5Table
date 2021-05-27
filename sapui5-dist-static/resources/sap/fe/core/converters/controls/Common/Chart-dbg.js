sap.ui.define(["../../templates/BaseConverter", "../../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/annotations/DataField", "../../helpers/ID", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper"], function (BaseConverter, ManifestSettings, Action, DataField, ID, ConfigurableObject, Key, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var KeyHelper = Key.KeyHelper;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var FilterBarID = ID.FilterBarID;
  var ChartID = ID.ChartID;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var ActionType = ManifestSettings.ActionType;
  var VisualizationType = ManifestSettings.VisualizationType;
  var TemplateType = BaseConverter.TemplateType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  /**
   * Method to retrieve all chart actions from annotations.
   *
   * @param chartAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {BaseAction[]} the table annotation actions
   */
  function getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext) {
    var chartActions = [];

    if (chartAnnotation) {
      var aActions = chartAnnotation.Actions || [];
      aActions.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        var chartAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              chartAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              chartAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;
          }
        }

        if (chartAction) {
          chartActions.push(chartAction);
        }
      });
    }

    return chartActions;
  }

  function getChartActions(chartAnnotation, visualizationPath, converterContext) {
    var aAnnotationActions = getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext);
    return insertCustomElements(aAnnotationActions, getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions), {
      enableOnSelect: "overwrite",
      enabled: "overwrite"
    });
  }

  _exports.getChartActions = getChartActions;

  function getP13nMode(visualizationPath, converterContext) {
    var _chartManifestSetting;

    var manifestWrapper = converterContext.getManifestWrapper();
    var chartManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var hasVariantManagement = ["Page", "Control"].indexOf(manifestWrapper.getVariantManagement()) > -1;
    var personalization = true;
    var aPersonalization = [];

    if ((chartManifestSettings === null || chartManifestSettings === void 0 ? void 0 : (_chartManifestSetting = chartManifestSettings.chartSettings) === null || _chartManifestSetting === void 0 ? void 0 : _chartManifestSetting.personalization) !== undefined) {
      personalization = chartManifestSettings.chartSettings.personalization;
    }

    if (hasVariantManagement && personalization) {
      if (personalization === true) {
        return "Sort,Type,Item";
      } else if (typeof personalization === "object") {
        if (personalization.type) {
          aPersonalization.push("Type");
        }

        if (personalization.item) {
          aPersonalization.push("Item");
        }

        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }
  /**
   * Create the ChartVisualization configuration that will be used to display a chart via Chart Macro.
   *
   * @param {ChartDefinitionTypeTypes} chartAnnotation the target chart annotation
   * @param {string} visualizationPath the current visualization annotation path
   * @param {ConverterContext} converterContext the converter context
   * @returns {ChartVisualization} the chart visualization based on the annotation
   */


  _exports.getP13nMode = getP13nMode;

  function createChartVisualization(chartAnnotation, visualizationPath, converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var chartActions = getChartActions(chartAnnotation, visualizationPath, converterContext);

    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 1),
        navigationPropertyPath
    /*, annotationPath*/
    = _visualizationPath$sp2[0];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    var title = (_converterContext$get = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderInfo) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.TypeNamePlural;
    var dataModelPath = converterContext.getDataModelObjectPath();
    var isEntitySet = navigationPropertyPath.length === 0;
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
    var sFilterbarId = isEntitySet ? FilterBarID(entityName) : undefined;
    var oVizProperties = {
      "legendGroup": {
        "layout": {
          "position": "bottom"
        }
      }
    };
    return {
      type: VisualizationType.Chart,
      id: ChartID(isEntitySet ? entityName : navigationPropertyPath, VisualizationType.Chart),
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      entityName: entityName,
      p13nMode: getP13nMode(visualizationPath, converterContext),
      navigationPath: navigationPropertyPath,
      annotationPath: converterContext.getAbsoluteAnnotationPath(visualizationPath),
      filterId: sFilterbarId,
      vizProperties: JSON.stringify(oVizProperties),
      actions: chartActions,
      title: title,
      autoBindOnInit: converterContext.getTemplateType() === TemplateType.ObjectPage
    };
  }

  _exports.createChartVisualization = createChartVisualization;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoYXJ0LnRzIl0sIm5hbWVzIjpbImdldENoYXJ0QWN0aW9uc0Zyb21Bbm5vdGF0aW9ucyIsImNoYXJ0QW5ub3RhdGlvbiIsInZpc3VhbGl6YXRpb25QYXRoIiwiY29udmVydGVyQ29udGV4dCIsImNoYXJ0QWN0aW9ucyIsImFBY3Rpb25zIiwiQWN0aW9ucyIsImZvckVhY2giLCJkYXRhRmllbGQiLCJjaGFydEFjdGlvbiIsImlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QiLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIklubGluZSIsIkRldGVybWluaW5nIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiJFR5cGUiLCJ0eXBlIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiIsInB1c2giLCJnZXRDaGFydEFjdGlvbnMiLCJhQW5ub3RhdGlvbkFjdGlvbnMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJnZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uIiwiYWN0aW9ucyIsImVuYWJsZU9uU2VsZWN0IiwiZW5hYmxlZCIsImdldFAxM25Nb2RlIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiY2hhcnRNYW5pZmVzdFNldHRpbmdzIiwiaGFzVmFyaWFudE1hbmFnZW1lbnQiLCJpbmRleE9mIiwiZ2V0VmFyaWFudE1hbmFnZW1lbnQiLCJwZXJzb25hbGl6YXRpb24iLCJhUGVyc29uYWxpemF0aW9uIiwiY2hhcnRTZXR0aW5ncyIsInVuZGVmaW5lZCIsIml0ZW0iLCJzb3J0Iiwiam9pbiIsImNyZWF0ZUNoYXJ0VmlzdWFsaXphdGlvbiIsInNwbGl0IiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsImxhc3RJbmRleE9mIiwibGVuZ3RoIiwic3Vic3RyIiwidGl0bGUiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0RW50aXR5VHlwZSIsIkhlYWRlckluZm8iLCJUeXBlTmFtZVBsdXJhbCIsImRhdGFNb2RlbFBhdGgiLCJpc0VudGl0eVNldCIsImVudGl0eU5hbWUiLCJ0YXJnZXRFbnRpdHlTZXQiLCJuYW1lIiwic3RhcnRpbmdFbnRpdHlTZXQiLCJzRmlsdGVyYmFySWQiLCJGaWx0ZXJCYXJJRCIsIm9WaXpQcm9wZXJ0aWVzIiwiVmlzdWFsaXphdGlvblR5cGUiLCJDaGFydCIsImlkIiwiQ2hhcnRJRCIsImNvbGxlY3Rpb24iLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwicDEzbk1vZGUiLCJuYXZpZ2F0aW9uUGF0aCIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJmaWx0ZXJJZCIsInZpelByb3BlcnRpZXMiLCJKU09OIiwic3RyaW5naWZ5IiwiYXV0b0JpbmRPbkluaXQiLCJnZXRUZW1wbGF0ZVR5cGUiLCJUZW1wbGF0ZVR5cGUiLCJPYmplY3RQYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0E7Ozs7Ozs7O0FBUUEsV0FBU0EsOEJBQVQsQ0FDQ0MsZUFERCxFQUVDQyxpQkFGRCxFQUdDQyxnQkFIRCxFQUlnQjtBQUNmLFFBQU1DLFlBQTBCLEdBQUcsRUFBbkM7O0FBQ0EsUUFBSUgsZUFBSixFQUFxQjtBQUNwQixVQUFNSSxRQUFRLEdBQUdKLGVBQWUsQ0FBQ0ssT0FBaEIsSUFBMkIsRUFBNUM7QUFDQUQsTUFBQUEsUUFBUSxDQUFDRSxPQUFULENBQWlCLFVBQUNDLFNBQUQsRUFBdUM7QUFBQTs7QUFDdkQsWUFBSUMsV0FBSjs7QUFDQSxZQUNDQyw0QkFBNEIsQ0FBQ0YsU0FBRCxDQUE1QixJQUNBLEVBQUUsMEJBQUFBLFNBQVMsQ0FBQ0csV0FBViwwR0FBdUJD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QztBQVo5RCxLQUFQO0FBY0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnZlcnRlckNvbnRleHQsIFRlbXBsYXRlVHlwZSB9IGZyb20gXCIuLi8uLi90ZW1wbGF0ZXMvQmFzZUNvbnZlcnRlclwiO1xuaW1wb3J0IHtcblx0Q2hhcnRNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdENoYXJ0UGVyc29uYWxpemF0aW9uTWFuaWZlc3RTZXR0aW5ncyxcblx0TWFuaWZlc3RXcmFwcGVyLFxuXHRWaXN1YWxpemF0aW9uVHlwZSxcblx0QWN0aW9uVHlwZVxufSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ2hhcnREZWZpbml0aW9uVHlwZVR5cGVzLCBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uQWN0aW9uLCBCYXNlQWN0aW9uLCBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgaXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2Fubm90YXRpb25zL0RhdGFGaWVsZFwiO1xuaW1wb3J0IHsgQ2hhcnRJRCwgRmlsdGVyQmFySUQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHsgaW5zZXJ0Q3VzdG9tRWxlbWVudHMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IGdldFRhcmdldE9iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5cbi8qKlxuICogQHR5cGVkZWYgQ2hhcnRWaXN1YWxpemF0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIENoYXJ0VmlzdWFsaXphdGlvbiA9IHtcblx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuQ2hhcnQ7XG5cdGlkOiBzdHJpbmc7XG5cdGNvbGxlY3Rpb246IHN0cmluZztcblx0ZW50aXR5TmFtZTogc3RyaW5nO1xuXHRwMTNuTW9kZT86IHN0cmluZztcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZztcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0ZmlsdGVySWQ/OiBzdHJpbmc7XG5cdHZpelByb3BlcnRpZXM6IHN0cmluZztcblx0YWN0aW9uczogQmFzZUFjdGlvbltdO1xuXHR0aXRsZTogc3RyaW5nO1xuXHRhdXRvQmluZE9uSW5pdDogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogTWV0aG9kIHRvIHJldHJpZXZlIGFsbCBjaGFydCBhY3Rpb25zIGZyb20gYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIGNoYXJ0QW5ub3RhdGlvblxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge0Jhc2VBY3Rpb25bXX0gdGhlIHRhYmxlIGFubm90YXRpb24gYWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRDaGFydEFjdGlvbnNGcm9tQW5ub3RhdGlvbnMoXG5cdGNoYXJ0QW5ub3RhdGlvbjogQ2hhcnREZWZpbml0aW9uVHlwZVR5cGVzLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCYXNlQWN0aW9uW10ge1xuXHRjb25zdCBjaGFydEFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRpZiAoY2hhcnRBbm5vdGF0aW9uKSB7XG5cdFx0Y29uc3QgYUFjdGlvbnMgPSBjaGFydEFubm90YXRpb24uQWN0aW9ucyB8fCBbXTtcblx0XHRhQWN0aW9ucy5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGxldCBjaGFydEFjdGlvbjogQW5ub3RhdGlvbkFjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGlmIChcblx0XHRcdFx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQpICYmXG5cdFx0XHRcdCEoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuSW5saW5lICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuRGV0ZXJtaW5pbmdcblx0XHRcdCkge1xuXHRcdFx0XHRjb25zdCBrZXkgPSBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdFx0XHRcdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiOlxuXHRcdFx0XHRcdFx0Y2hhcnRBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0XHRcdFx0Y2hhcnRBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hhcnRBY3Rpb24pIHtcblx0XHRcdFx0Y2hhcnRBY3Rpb25zLnB1c2goY2hhcnRBY3Rpb24pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBjaGFydEFjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFydEFjdGlvbnMoXG5cdGNoYXJ0QW5ub3RhdGlvbjogQ2hhcnREZWZpbml0aW9uVHlwZVR5cGVzLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCYXNlQWN0aW9uW10ge1xuXHRjb25zdCBhQW5ub3RhdGlvbkFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGdldENoYXJ0QWN0aW9uc0Zyb21Bbm5vdGF0aW9ucyhjaGFydEFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0YUFubm90YXRpb25BY3Rpb25zLFxuXHRcdGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLmFjdGlvbnMsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0YUFubm90YXRpb25BY3Rpb25zXG5cdFx0KSxcblx0XHR7IGVuYWJsZU9uU2VsZWN0OiBcIm92ZXJ3cml0ZVwiLCBlbmFibGVkOiBcIm92ZXJ3cml0ZVwiIH1cblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFAxM25Nb2RlKHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXI6IE1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IGNoYXJ0TWFuaWZlc3RTZXR0aW5nczogQ2hhcnRNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBoYXNWYXJpYW50TWFuYWdlbWVudDogYm9vbGVhbiA9IFtcIlBhZ2VcIiwgXCJDb250cm9sXCJdLmluZGV4T2YobWFuaWZlc3RXcmFwcGVyLmdldFZhcmlhbnRNYW5hZ2VtZW50KCkpID4gLTE7XG5cdGxldCBwZXJzb25hbGl6YXRpb246IENoYXJ0UGVyc29uYWxpemF0aW9uTWFuaWZlc3RTZXR0aW5ncyA9IHRydWU7XG5cdGNvbnN0IGFQZXJzb25hbGl6YXRpb246IHN0cmluZ1tdID0gW107XG5cdGlmIChjaGFydE1hbmlmZXN0U2V0dGluZ3M/LmNoYXJ0U2V0dGluZ3M/LnBlcnNvbmFsaXphdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGVyc29uYWxpemF0aW9uID0gY2hhcnRNYW5pZmVzdFNldHRpbmdzLmNoYXJ0U2V0dGluZ3MucGVyc29uYWxpemF0aW9uO1xuXHR9XG5cdGlmIChoYXNWYXJpYW50TWFuYWdlbWVudCAmJiBwZXJzb25hbGl6YXRpb24pIHtcblx0XHRpZiAocGVyc29uYWxpemF0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gXCJTb3J0LFR5cGUsSXRlbVwiO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHBlcnNvbmFsaXphdGlvbiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi50eXBlKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlR5cGVcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGVyc29uYWxpemF0aW9uLml0ZW0pIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiSXRlbVwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uc29ydCkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJTb3J0XCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBDaGFydFZpc3VhbGl6YXRpb24gY29uZmlndXJhdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBkaXNwbGF5IGEgY2hhcnQgdmlhIENoYXJ0IE1hY3JvLlxuICpcbiAqIEBwYXJhbSB7Q2hhcnREZWZpbml0aW9uVHlwZVR5cGVzfSBjaGFydEFubm90YXRpb24gdGhlIHRhcmdldCBjaGFydCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdmlzdWFsaXphdGlvblBhdGggdGhlIGN1cnJlbnQgdmlzdWFsaXphdGlvbiBhbm5vdGF0aW9uIHBhdGhcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIHtDaGFydFZpc3VhbGl6YXRpb259IHRoZSBjaGFydCB2aXN1YWxpemF0aW9uIGJhc2VkIG9uIHRoZSBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGFydFZpc3VhbGl6YXRpb24oXG5cdGNoYXJ0QW5ub3RhdGlvbjogQ2hhcnREZWZpbml0aW9uVHlwZVR5cGVzLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDaGFydFZpc3VhbGl6YXRpb24ge1xuXHRjb25zdCBjaGFydEFjdGlvbnMgPSBnZXRDaGFydEFjdGlvbnMoY2hhcnRBbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGxldCBbbmF2aWdhdGlvblByb3BlcnR5UGF0aCAvKiwgYW5ub3RhdGlvblBhdGgqL10gPSB2aXN1YWxpemF0aW9uUGF0aC5zcGxpdChcIkBcIik7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA9PT0gbmF2aWdhdGlvblByb3BlcnR5UGF0aC5sZW5ndGggLSAxKSB7XG5cdFx0Ly8gRHJvcCB0cmFpbGluZyBzbGFzaFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLnN1YnN0cigwLCBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpO1xuXHR9XG5cdGNvbnN0IHRpdGxlOiBhbnkgPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS50YXJnZXRFbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uSGVhZGVySW5mbz8uVHlwZU5hbWVQbHVyYWw7XG5cdGNvbnN0IGRhdGFNb2RlbFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgaXNFbnRpdHlTZXQ6IGJvb2xlYW4gPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA9PT0gMDtcblx0Y29uc3QgZW50aXR5TmFtZTogc3RyaW5nID0gZGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQgPyBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldC5uYW1lIDogZGF0YU1vZGVsUGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lO1xuXHRjb25zdCBzRmlsdGVyYmFySWQgPSBpc0VudGl0eVNldCA/IEZpbHRlckJhcklEKGVudGl0eU5hbWUpIDogdW5kZWZpbmVkO1xuXHRjb25zdCBvVml6UHJvcGVydGllcyA9IHtcblx0XHRcImxlZ2VuZEdyb3VwXCI6IHtcblx0XHRcdFwibGF5b3V0XCI6IHtcblx0XHRcdFx0XCJwb3NpdGlvblwiOiBcImJvdHRvbVwiXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4ge1xuXHRcdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0LFxuXHRcdGlkOiBDaGFydElEKGlzRW50aXR5U2V0ID8gZW50aXR5TmFtZSA6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsIFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0KSxcblx0XHRjb2xsZWN0aW9uOiBnZXRUYXJnZXRPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKSxcblx0XHRlbnRpdHlOYW1lOiBlbnRpdHlOYW1lLFxuXHRcdHAxM25Nb2RlOiBnZXRQMTNuTW9kZSh2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCksXG5cdFx0bmF2aWdhdGlvblBhdGg6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aCh2aXN1YWxpemF0aW9uUGF0aCksXG5cdFx0ZmlsdGVySWQ6IHNGaWx0ZXJiYXJJZCxcblx0XHR2aXpQcm9wZXJ0aWVzOiBKU09OLnN0cmluZ2lmeShvVml6UHJvcGVydGllcyksXG5cdFx0YWN0aW9uczogY2hhcnRBY3Rpb25zLFxuXHRcdHRpdGxlOiB0aXRsZSxcblx0XHRhdXRvQmluZE9uSW5pdDogY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2Vcblx0fTtcbn1cbiJdfQ==