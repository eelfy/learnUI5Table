sap.ui.define(["sap/fe/core/converters/helpers/Key"], function (Key) {
  "use strict";

  var _exports = {};
  var KeyHelper = Key.KeyHelper;
  var ActionType;

  (function (ActionType) {
    ActionType["Default"] = "Default";
  })(ActionType || (ActionType = {}));

  var getVisibilityEnablementFormMenuActions = function (actions) {
    var menuActionVisible, menuActionEnabled, menuActionVisiblePaths, menuActionEnabledPaths;
    actions.forEach(function (menuActions) {
      var _menuActions$menu;

      menuActionVisible = false;
      menuActionEnabled = false;
      menuActionVisiblePaths = [];
      menuActionEnabledPaths = [];

      if (menuActions === null || menuActions === void 0 ? void 0 : (_menuActions$menu = menuActions.menu) === null || _menuActions$menu === void 0 ? void 0 : _menuActions$menu.length) {
        var _menuActions$menu2;

        menuActions === null || menuActions === void 0 ? void 0 : (_menuActions$menu2 = menuActions.menu) === null || _menuActions$menu2 === void 0 ? void 0 : _menuActions$menu2.forEach(function (menuItem) {
          var menuItemVisible = menuItem.visible,
              menuItemEnabled = menuItem.enabled;

          if (!menuActionVisible) {
            if (menuItemVisible && typeof menuItemVisible === "boolean" || menuItemVisible.valueOf() === "true") {
              menuActionVisible = true;
            } else if (menuItemVisible && menuItemVisible.valueOf() !== "false") {
              menuActionVisiblePaths.push("$" + menuItemVisible.valueOf());
            }
          }

          if (!menuActionEnabled) {
            if (menuItemEnabled && typeof menuItemEnabled === "boolean" || menuItemEnabled.valueOf() === "true") {
              menuActionEnabled = true;
            } else if (menuItemEnabled && menuItemEnabled.valueOf() !== "false") {
              menuActionEnabledPaths.push("$" + menuItemEnabled.valueOf());
            }
          }
        });

        if (menuActionVisiblePaths.length) {
          menuActions.visible = menuActionVisiblePaths;
        } else {
          menuActions.visible = menuActionVisible;
        }

        if (menuActionEnabledPaths.length) {
          menuActions.enabled = menuActionEnabledPaths;
        } else {
          menuActions.enabled = menuActionEnabled;
        }
      }
    });
    return actions;
  };

  _exports.getVisibilityEnablementFormMenuActions = getVisibilityEnablementFormMenuActions;

  var mergeFormActions = function (source, target) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    return source;
  };

  _exports.mergeFormActions = mergeFormActions;

  var getFormHiddenActions = function (facetDefinition, converterContext) {
    var _converterContext$get, _converterContext$get2;

    var formActions = getFormActions(facetDefinition, converterContext) || [],
        annotations = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get = converterContext.getEntityType()) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.UI;
    var hiddenFormActions = [];

    for (var property in annotations) {
      var _annotations$property, _annotations$property3, _annotations$property4;

      if (((_annotations$property = annotations[property]) === null || _annotations$property === void 0 ? void 0 : _annotations$property.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
        var _annotations$property2;

        (_annotations$property2 = annotations[property]) === null || _annotations$property2 === void 0 ? void 0 : _annotations$property2.Data.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)) {
            var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)) {
            var _dataField$annotation4, _dataField$annotation5, _dataField$annotation6;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      } else if (((_annotations$property3 = annotations[property]) === null || _annotations$property3 === void 0 ? void 0 : _annotations$property3.term) === "com.sap.vocabularies.UI.v1.Identification" || ((_annotations$property4 = annotations[property]) === null || _annotations$property4 === void 0 ? void 0 : _annotations$property4.term) === "@com.sap.vocabularies.UI.v1.StatusInfo") {
        var _annotations$property5;

        (_annotations$property5 = annotations[property]) === null || _annotations$property5 === void 0 ? void 0 : _annotations$property5.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)) {
            var _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)) {
            var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      }
    }

    return hiddenFormActions;
  };

  _exports.getFormHiddenActions = getFormHiddenActions;

  var getFormActions = function (facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var targetValue, manifestFormContainer;
    var actions = {};

    if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      if (facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.Facets) {
        facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.Facets.forEach(function (facet) {
          var _facet$Target, _manifestFormContaine;

          targetValue = facet === null || facet === void 0 ? void 0 : (_facet$Target = facet.Target) === null || _facet$Target === void 0 ? void 0 : _facet$Target.value;
          manifestFormContainer = manifestWrapper.getFormContainer(targetValue);

          if ((_manifestFormContaine = manifestFormContainer) === null || _manifestFormContaine === void 0 ? void 0 : _manifestFormContaine.actions) {
            var _manifestFormContaine2;

            actions = mergeFormActions((_manifestFormContaine2 = manifestFormContainer) === null || _manifestFormContaine2 === void 0 ? void 0 : _manifestFormContaine2.actions, actions);
          }
        });
      }
    } else if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ, _manifestFormContaine3;

      targetValue = facetDefinition === null || facetDefinition === void 0 ? void 0 : (_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : _facetDefinition$Targ.value;
      manifestFormContainer = manifestWrapper.getFormContainer(targetValue);
      actions = (_manifestFormContaine3 = manifestFormContainer) === null || _manifestFormContaine3 === void 0 ? void 0 : _manifestFormContaine3.actions;
    }

    return actions;
  };

  _exports.getFormActions = getFormActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1NZW51QWN0aW9ucy50cyJdLCJuYW1lcyI6WyJBY3Rpb25UeXBlIiwiZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMiLCJhY3Rpb25zIiwibWVudUFjdGlvblZpc2libGUiLCJtZW51QWN0aW9uRW5hYmxlZCIsIm1lbnVBY3Rpb25WaXNpYmxlUGF0aHMiLCJtZW51QWN0aW9uRW5hYmxlZFBhdGhzIiwiZm9yRWFjaCIsIm1lbnVBY3Rpb25zIiwibWVudSIsImxlbmd0aCIsIm1lbnVJdGVtIiwibWVudUl0ZW1WaXNpYmxlIiwidmlzaWJsZSIsIm1lbnVJdGVtRW5hYmxlZCIsImVuYWJsZWQiLCJ2YWx1ZU9mIiwicHVzaCIsIm1lcmdlRm9ybUFjdGlvbnMiLCJzb3VyY2UiLCJ0YXJnZXQiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImdldEZvcm1IaWRkZW5BY3Rpb25zIiwiZmFjZXREZWZpbml0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImZvcm1BY3Rpb25zIiwiZ2V0Rm9ybUFjdGlvbnMiLCJhbm5vdGF0aW9ucyIsImdldEVudGl0eVR5cGUiLCJVSSIsImhpZGRlbkZvcm1BY3Rpb25zIiwicHJvcGVydHkiLCIkVHlwZSIsIkRhdGEiLCJkYXRhRmllbGQiLCJBY3Rpb24iLCJIaWRkZW4iLCJ0eXBlIiwiRGVmYXVsdCIsIktleUhlbHBlciIsImdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZCIsInRlcm0iLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJ0YXJnZXRWYWx1ZSIsIm1hbmlmZXN0Rm9ybUNvbnRhaW5lciIsIkZhY2V0cyIsImZhY2V0IiwiVGFyZ2V0IiwidmFsdWUiLCJnZXRGb3JtQ29udGFpbmVyIl0sIm1hcHBpbmdzIjoiOzs7OztNQU1LQSxVOzthQUFBQSxVO0FBQUFBLElBQUFBLFU7S0FBQUEsVSxLQUFBQSxVOztBQWtDRSxNQUFNQyxzQ0FBc0MsR0FBRyxVQUFDQyxPQUFELEVBQXlDO0FBQzlG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S0FBSyxDQUFFQyxNQUFWLGtEQUFHLGNBQWVDLEtBQTdCO0FBQ0FKLFVBQUFBLHFCQUFxQixHQUFHSCxlQUFlLENBQUNRLGdCQUFoQixDQUFpQ04sV0FBakMsQ0FBeEI7O0FBQ0EsdUNBQUlDLHFCQUFKLDBEQUFJLHNCQUF1QjVDLE9BQTNCLEVBQW9DO0FBQUE7O0FBQ25DQSxZQUFBQSxPQUFPLEdBQUdnQixnQkFBZ0IsMkJBQUM0QixxQkFBRCwyREFBQyx1QkFBdUI1QyxPQUF4QixFQUF3Q0EsT0FBeEMsQ0FBMUI7QUFDQTtBQUNELFNBTkQ7QUFPQTtBQUNELEtBVkQsTUFVTyxJQUFJLENBQUFzQixlQUFlLFNBQWYsSUFBQUEsZUFBZSxXQUFmLFlBQUFBLGVBQWUsQ0FBRVMsS0FBakIsTUFBMkIsMkNBQS9CLEVBQTRFO0FBQUE7O0FBQ2xGWSxNQUFBQSxXQUFXLEdBQUdyQixlQUFILGFBQUdBLGVBQUgsZ0RBQUdBLGVBQWUsQ0FBRXlCLE1BQXBCLDBEQUFHLHNCQUF5QkMsS0FBdkM7QUFDQUosTUFBQUEscUJBQXFCLEdBQUdILGVBQWUsQ0FBQ1EsZ0JBQWhCLENBQWlDTixXQUFqQyxDQUF4QjtBQUNBM0MsTUFBQUEsT0FBTyw2QkFBRzRDLHFCQUFILDJEQUFHLHVCQUF1QjVDLE9BQWpDO0FBQ0E7O0FBQ0QsV0FBT0EsT0FBUDtBQUNBLEdBcEJNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlQWN0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgRmFjZXRUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlUmVjb3JkLCBQb3NpdGlvbiwgUG9zaXRpb25hYmxlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcblxuZW51bSBBY3Rpb25UeXBlIHtcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiXG59XG50eXBlIEFjdGlvbkFmdGVyRXhlY3V0aW9uQ29uZmlndXJhdGlvbiA9IHtcblx0bmF2aWdhdGVUb0luc3RhbmNlOiBib29sZWFuO1xuXHRlbmFibGVBdXRvU2Nyb2xsOiBib29sZWFuO1xufTtcbnR5cGUgTWFuaWZlc3RBY3Rpb24gPSB7XG5cdG1lbnU/OiBzdHJpbmdbXTtcblx0dmlzaWJsZT86IHN0cmluZztcblx0ZW5hYmxlZD86IHN0cmluZztcblx0cG9zaXRpb24/OiBQb3NpdGlvbjtcblx0cHJlc3M6IHN0cmluZztcblx0dGV4dDogc3RyaW5nO1xuXHRlbmFibGVPblNlbGVjdDogc3RyaW5nO1xuXHRyZXF1aXJlc1NlbGVjdGlvbj86IGJvb2xlYW47XG5cdGFmdGVyRXhlY3V0aW9uPzogQWN0aW9uQWZ0ZXJFeGVjdXRpb25Db25maWd1cmF0aW9uO1xufTtcbnR5cGUgRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IHtcblx0ZmllbGRzOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RGb3JtRWxlbWVudD47XG5cdGFjdGlvbnM/OiBCYXNlQWN0aW9uO1xufTtcbnR5cGUgTWFuaWZlc3RGb3JtRWxlbWVudCA9IFBvc2l0aW9uYWJsZSAmIHtcblx0dGVtcGxhdGU6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG59O1xudHlwZSBGb3JtTWVudUFjdGlvbiA9XG5cdHwgQmFzZUFjdGlvblxuXHR8IHtcblx0XHRcdHZpc2libGU/OiBzdHJpbmdbXTtcblx0XHRcdGVuYWJsZWQ/OiBzdHJpbmdbXTtcblx0XHRcdG1lbnU/OiAoc3RyaW5nIHwgQmFzZUFjdGlvbilbXTtcblx0ICB9O1xuXG5leHBvcnQgY29uc3QgZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMgPSAoYWN0aW9uczogQmFzZUFjdGlvbltdKTogQmFzZUFjdGlvbltdID0+IHtcblx0bGV0IG1lbnVBY3Rpb25WaXNpYmxlOiBzdHJpbmcgfCBib29sZWFuLFxuXHRcdG1lbnVBY3Rpb25FbmFibGVkOiBzdHJpbmcgfCBib29sZWFuLFxuXHRcdG1lbnVBY3Rpb25WaXNpYmxlUGF0aHM6IHN0cmluZ1tdLFxuXHRcdG1lbnVBY3Rpb25FbmFibGVkUGF0aHM6IHN0cmluZ1tdO1xuXHRhY3Rpb25zLmZvckVhY2goKG1lbnVBY3Rpb25zOiBGb3JtTWVudUFjdGlvbikgPT4ge1xuXHRcdG1lbnVBY3Rpb25WaXNpYmxlID0gZmFsc2U7XG5cdFx0bWVudUFjdGlvbkVuYWJsZWQgPSBmYWxzZTtcblx0XHRtZW51QWN0aW9uVmlzaWJsZVBhdGhzID0gW107XG5cdFx0bWVudUFjdGlvbkVuYWJsZWRQYXRocyA9IFtdO1xuXHRcdGlmIChtZW51QWN0aW9ucz8ubWVudT8ubGVuZ3RoKSB7XG5cdFx0XHRtZW51QWN0aW9ucz8ubWVudT8uZm9yRWFjaCgobWVudUl0ZW06IGFueSkgPT4ge1xuXHRcdFx0XHRjb25zdCBtZW51SXRlbVZpc2libGUgPSBtZW51SXRlbS52aXNpYmxlLFxuXHRcdFx0XHRcdG1lbnVJdGVtRW5hYmxlZCA9IG1lbnVJdGVtLmVuYWJsZWQ7XG5cdFx0XHRcdGlmICghbWVudUFjdGlvblZpc2libGUpIHtcblx0XHRcdFx0XHRpZiAoKG1lbnVJdGVtVmlzaWJsZSAmJiB0eXBlb2YgbWVudUl0ZW1WaXNpYmxlID09PSBcImJvb2xlYW5cIikgfHwgbWVudUl0ZW1WaXNpYmxlLnZhbHVlT2YoKSA9PT0gXCJ0cnVlXCIpIHtcblx0XHRcdFx0XHRcdG1lbnVBY3Rpb25WaXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG1lbnVJdGVtVmlzaWJsZSAmJiBtZW51SXRlbVZpc2libGUudmFsdWVPZigpICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0XHRcdG1lbnVBY3Rpb25WaXNpYmxlUGF0aHMucHVzaChcIiRcIiArIG1lbnVJdGVtVmlzaWJsZS52YWx1ZU9mKCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIW1lbnVBY3Rpb25FbmFibGVkKSB7XG5cdFx0XHRcdFx0aWYgKChtZW51SXRlbUVuYWJsZWQgJiYgdHlwZW9mIG1lbnVJdGVtRW5hYmxlZCA9PT0gXCJib29sZWFuXCIpIHx8IG1lbnVJdGVtRW5hYmxlZC52YWx1ZU9mKCkgPT09IFwidHJ1ZVwiKSB7XG5cdFx0XHRcdFx0XHRtZW51QWN0aW9uRW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChtZW51SXRlbUVuYWJsZWQgJiYgbWVudUl0ZW1FbmFibGVkLnZhbHVlT2YoKSAhPT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdFx0XHRtZW51QWN0aW9uRW5hYmxlZFBhdGhzLnB1c2goXCIkXCIgKyBtZW51SXRlbUVuYWJsZWQudmFsdWVPZigpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aWYgKG1lbnVBY3Rpb25WaXNpYmxlUGF0aHMubGVuZ3RoKSB7XG5cdFx0XHRcdG1lbnVBY3Rpb25zLnZpc2libGUgPSBtZW51QWN0aW9uVmlzaWJsZVBhdGhzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVudUFjdGlvbnMudmlzaWJsZSA9IG1lbnVBY3Rpb25WaXNpYmxlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1lbnVBY3Rpb25FbmFibGVkUGF0aHMubGVuZ3RoKSB7XG5cdFx0XHRcdG1lbnVBY3Rpb25zLmVuYWJsZWQgPSBtZW51QWN0aW9uRW5hYmxlZFBhdGhzO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWVudUFjdGlvbnMuZW5hYmxlZCA9IG1lbnVBY3Rpb25FbmFibGVkO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBhY3Rpb25zO1xufTtcblxuZXhwb3J0IGNvbnN0IG1lcmdlRm9ybUFjdGlvbnMgPSAoXG5cdHNvdXJjZTogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPixcblx0dGFyZ2V0OiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+XG4pOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0+IHtcblx0Zm9yIChjb25zdCBrZXkgaW4gc291cmNlKSB7XG5cdFx0aWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHR0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gc291cmNlO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZvcm1IaWRkZW5BY3Rpb25zID0gKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSA9PiB7XG5cdGNvbnN0IGZvcm1BY3Rpb25zOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0gZ2V0Rm9ybUFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSB8fCBbXSxcblx0XHRhbm5vdGF0aW9uczogYW55ID0gY29udmVydGVyQ29udGV4dD8uZ2V0RW50aXR5VHlwZSgpPy5hbm5vdGF0aW9ucz8uVUk7XG5cdGNvbnN0IGhpZGRlbkZvcm1BY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBbXTtcblx0Zm9yIChjb25zdCBwcm9wZXJ0eSBpbiBhbm5vdGF0aW9ucykge1xuXHRcdGlmIChhbm5vdGF0aW9uc1twcm9wZXJ0eV0/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBUeXBlXCIpIHtcblx0XHRcdGFubm90YXRpb25zW3Byb3BlcnR5XT8uRGF0YS5mb3JFYWNoKChkYXRhRmllbGQ6IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiICYmXG5cdFx0XHRcdFx0Zm9ybUFjdGlvbnMuaGFzT3duUHJvcGVydHkoXCJEYXRhRmllbGRGb3JBY3Rpb246OlwiICsgZGF0YUZpZWxkLkFjdGlvbilcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0aGlkZGVuRm9ybUFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uXCIgJiZcblx0XHRcdFx0XHRmb3JtQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbjo6XCIgKyBkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRpZiAoZGF0YUZpZWxkPy5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRoaWRkZW5Gb3JtQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0YW5ub3RhdGlvbnNbcHJvcGVydHldPy50ZXJtID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklkZW50aWZpY2F0aW9uXCIgfHxcblx0XHRcdGFubm90YXRpb25zW3Byb3BlcnR5XT8udGVybSA9PT0gXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU3RhdHVzSW5mb1wiXG5cdFx0KSB7XG5cdFx0XHRhbm5vdGF0aW9uc1twcm9wZXJ0eV0/LmZvckVhY2goKGRhdGFGaWVsZDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgJiZcblx0XHRcdFx0XHRmb3JtQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkRhdGFGaWVsZEZvckFjdGlvbjo6XCIgKyBkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRpZiAoZGF0YUZpZWxkPy5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRoaWRkZW5Gb3JtQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdGRhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiAmJlxuXHRcdFx0XHRcdGZvcm1BY3Rpb25zLmhhc093blByb3BlcnR5KFwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOjpcIiArIGRhdGFGaWVsZC5BY3Rpb24pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGhpZGRlbkZvcm1BY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaGlkZGVuRm9ybUFjdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybUFjdGlvbnMgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPiA9PiB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGxldCB0YXJnZXRWYWx1ZTogc3RyaW5nLCBtYW5pZmVzdEZvcm1Db250YWluZXI6IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb247XG5cdGxldCBhY3Rpb25zOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0ge307XG5cdGlmIChmYWNldERlZmluaXRpb24/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbGxlY3Rpb25GYWNldFwiKSB7XG5cdFx0aWYgKGZhY2V0RGVmaW5pdGlvbj8uRmFjZXRzKSB7XG5cdFx0XHRmYWNldERlZmluaXRpb24/LkZhY2V0cy5mb3JFYWNoKChmYWNldDogYW55KSA9PiB7XG5cdFx0XHRcdHRhcmdldFZhbHVlID0gZmFjZXQ/LlRhcmdldD8udmFsdWU7XG5cdFx0XHRcdG1hbmlmZXN0Rm9ybUNvbnRhaW5lciA9IG1hbmlmZXN0V3JhcHBlci5nZXRGb3JtQ29udGFpbmVyKHRhcmdldFZhbHVlKTtcblx0XHRcdFx0aWYgKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uYWN0aW9ucykge1xuXHRcdFx0XHRcdGFjdGlvbnMgPSBtZXJnZUZvcm1BY3Rpb25zKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uYWN0aW9ucyBhcyBhbnksIGFjdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoZmFjZXREZWZpbml0aW9uPy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWZlcmVuY2VGYWNldFwiKSB7XG5cdFx0dGFyZ2V0VmFsdWUgPSBmYWNldERlZmluaXRpb24/LlRhcmdldD8udmFsdWU7XG5cdFx0bWFuaWZlc3RGb3JtQ29udGFpbmVyID0gbWFuaWZlc3RXcmFwcGVyLmdldEZvcm1Db250YWluZXIodGFyZ2V0VmFsdWUpO1xuXHRcdGFjdGlvbnMgPSBtYW5pZmVzdEZvcm1Db250YWluZXI/LmFjdGlvbnMgYXMgYW55O1xuXHR9XG5cdHJldHVybiBhY3Rpb25zO1xufTtcbiJdfQ==