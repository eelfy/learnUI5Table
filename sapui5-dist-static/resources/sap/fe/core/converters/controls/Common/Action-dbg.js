sap.ui.define(["sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/formatters/FPMFormatter"], function (ManifestSettings, ConfigurableObject, ID, StableIdHelper, BindingExpression, fpmFormatter) {
  "use strict";

  var _exports = {};
  var resolveBindingString = BindingExpression.resolveBindingString;
  var isConstant = BindingExpression.isConstant;
  var formatResult = BindingExpression.formatResult;
  var or = BindingExpression.or;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var CustomActionID = ID.CustomActionID;
  var Placement = ConfigurableObject.Placement;
  var ActionType = ManifestSettings.ActionType;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ButtonType;

  (function (ButtonType) {
    ButtonType["Accept"] = "Accept";
    ButtonType["Attention"] = "Attention";
    ButtonType["Back"] = "Back";
    ButtonType["Critical"] = "Critical";
    ButtonType["Default"] = "Default";
    ButtonType["Emphasized"] = "Emphasized";
    ButtonType["Ghost"] = "Ghost";
    ButtonType["Negative"] = "Negative";
    ButtonType["Neutral"] = "Neutral";
    ButtonType["Reject"] = "Reject";
    ButtonType["Success"] = "Success";
    ButtonType["Transparent"] = "Transparent";
    ButtonType["Unstyled"] = "Unstyled";
    ButtonType["Up"] = "Up";
  })(ButtonType || (ButtonType = {}));

  _exports.ButtonType = ButtonType;

  /**
   * Prepare menu action from manifest actions.
   * @param {Record<string, CustomAction>} actions the manifest definition
   * @param {BaseAction[]} aAnnotationActions the annotation actions definition
   * @param aHiddenHeaderActions
   * @returns {Record<string, CustomAction>} the actions from the manifest and menu option added
   */
  function prepareMenuAction(actions, aAnnotationActions, aHiddenHeaderActions) {
    var _menuItemKeys2;

    var allActions = {};
    var menuItemKeys = [];

    var _loop = function (actionKey) {
      var manifestAction = actions[actionKey];

      if (manifestAction.type === ActionType.Menu) {
        var _manifestAction$menu$, _manifestAction$menu;

        var menuItems = [];
        var menuVisible = false;

        var _menuItemKeys = (_manifestAction$menu$ = (_manifestAction$menu = manifestAction.menu) === null || _manifestAction$menu === void 0 ? void 0 : _manifestAction$menu.map(function (menuKey) {
          var _action, _action2, _action3;

          var action = aAnnotationActions.find(function (action) {
            return action.key === menuKey;
          });

          if (!action) {
            action = actions[menuKey];
          }

          if ((((_action = action) === null || _action === void 0 ? void 0 : _action.visible) || ((_action2 = action) === null || _action2 === void 0 ? void 0 : _action2.type) === ActionType.DataFieldForAction || ((_action3 = action) === null || _action3 === void 0 ? void 0 : _action3.type) === ActionType.DataFieldForIntentBasedNavigation) && !aHiddenHeaderActions.find(function (hiddenAction) {
            return hiddenAction.key === menuKey;
          })) {
            menuVisible = compileBinding(or(resolveBindingString(action.visible, "boolean"), resolveBindingString(menuVisible, "boolean")));
            menuItems.push(action);
          }

          return menuKey;
        })) !== null && _manifestAction$menu$ !== void 0 ? _manifestAction$menu$ : []; // Show menu button if it has one or more then 1 items visible


        if (menuItems.length) {
          manifestAction.visible = menuVisible;
          manifestAction.menu = menuItems;
        } else {
          _menuItemKeys = [actionKey];
        }

        menuItemKeys = [].concat(_toConsumableArray(menuItemKeys), _toConsumableArray(_menuItemKeys));
      }

      if (aHiddenHeaderActions.find(function (hiddenAction) {
        return hiddenAction.key === actionKey;
      })) {
        manifestAction.visible = false;
      }

      allActions[actionKey] = manifestAction;
    };

    for (var actionKey in actions) {
      _loop(actionKey);
    } // eslint-disable-next-line no-unused-expressions


    (_menuItemKeys2 = menuItemKeys) === null || _menuItemKeys2 === void 0 ? void 0 : _menuItemKeys2.forEach(function (actionKey) {
      return delete allActions[actionKey];
    });
    return allActions;
  }

  var removeDuplicateActions = function (actions) {
    var oMenuItemKeys = {};
    actions.forEach(function (action) {
      var _action$menu;

      if (action === null || action === void 0 ? void 0 : (_action$menu = action.menu) === null || _action$menu === void 0 ? void 0 : _action$menu.length) {
        action.menu.reduce(function (item, _ref) {
          var key = _ref.key;

          if (key && !item[key]) {
            item[key] = true;
          }

          return item;
        }, oMenuItemKeys);
      }
    });
    return actions.filter(function (action) {
      return !oMenuItemKeys[action.key];
    });
  };
  /**
   * Retrieves an action default value based on its kind.
   *
   * Default property value for custom actions if not overwritten in manifest.
   * @param manifestSetting {any} The column property defined in the manifest
   * @param isAnnotationAction {boolean} Whether the action, defined in manifest, corresponds to an existing annotation action.
   * @param converterContext
   * @returns {BindingExpression<string> | string | boolean} Determined property value for the column
   */


  _exports.removeDuplicateActions = removeDuplicateActions;

  var _getManifestEnabled = function (manifestSetting, isAnnotationAction, converterContext) {
    if (manifestSetting === undefined) {
      // If annotation action has no property defined in manifest,
      // do not overwrite it with manifest action's default value.
      return isAnnotationAction ? undefined : true;
    } // Return what is defined in manifest.


    return getManifestActionEnablement(manifestSetting, converterContext);
  };
  /**
   * Create the action configuration based on the manifest settings.
   * @param {Record<string, ManifestAction> | undefined} manifestActions the manifest
   * @param converterContext
   * @param {BaseAction[]} aAnnotationActions the annotation actions definition
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @param {boolean} considerNavigationSettings
   * @param {BaseAction[]} aHiddenHeaderActions
   * @returns {Record<string, CustomAction>} the actions from the manifest
   */


  function getActionsFromManifest(manifestActions, converterContext, aAnnotationActions, navigationSettings, considerNavigationSettings, aHiddenHeaderActions) {
    var actions = {};

    var _loop2 = function (actionKey) {
      var _manifestAction$press, _manifestAction$posit, _manifestAction$menu2;

      var manifestAction = manifestActions[actionKey];
      var lastDotIndex = (_manifestAction$press = manifestAction.press) === null || _manifestAction$press === void 0 ? void 0 : _manifestAction$press.lastIndexOf("."); // To identify the annotation action property overwrite via manifest use-case.

      var isAnnotationAction = (aAnnotationActions === null || aAnnotationActions === void 0 ? void 0 : aAnnotationActions.some(function (action) {
        return action.key === actionKey;
      })) || false;
      actions[actionKey] = {
        id: (aAnnotationActions === null || aAnnotationActions === void 0 ? void 0 : aAnnotationActions.some(function (action) {
          return action.key === actionKey;
        })) ? actionKey : CustomActionID(actionKey),
        visible: manifestAction.visible === undefined ? "true" : manifestAction.visible,
        enabled: _getManifestEnabled(manifestAction.enabled, isAnnotationAction, converterContext),
        handlerModule: manifestAction.press && manifestAction.press.substring(0, lastDotIndex).replace(/\./gi, "/"),
        handlerMethod: manifestAction.press && manifestAction.press.substring(lastDotIndex + 1),
        press: manifestAction.press,
        type: manifestAction.menu ? ActionType.Menu : ActionType.Default,
        text: manifestAction.text,
        key: replaceSpecialChars(actionKey),
        enableOnSelect: manifestAction.enableOnSelect,
        position: {
          anchor: (_manifestAction$posit = manifestAction.position) === null || _manifestAction$posit === void 0 ? void 0 : _manifestAction$posit.anchor,
          placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
        },
        isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
        requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
        enableAutoScroll: enableAutoScroll(manifestAction),
        menu: (_manifestAction$menu2 = manifestAction.menu) !== null && _manifestAction$menu2 !== void 0 ? _manifestAction$menu2 : []
      };
    };

    for (var actionKey in manifestActions) {
      _loop2(actionKey);
    }

    return prepareMenuAction(actions, aAnnotationActions !== null && aAnnotationActions !== void 0 ? aAnnotationActions : [], aHiddenHeaderActions !== null && aHiddenHeaderActions !== void 0 ? aHiddenHeaderActions : []);
  }

  _exports.getActionsFromManifest = getActionsFromManifest;

  function getManifestActionEnablement(enabledString, converterContext) {
    var resolvedBinding = resolveBindingString(enabledString, "boolean");

    if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
      // true / false
      return resolvedBinding.value;
    } else if (resolvedBinding._type !== "EmbeddedBinding" && resolvedBinding._type !== "EmbeddedExpressionBinding") {
      // Then it's a module-method reference "sap.xxx.yyy.doSomething"
      var methodPath = resolvedBinding.value;
      return compileBinding(formatResult([bindingExpression("/", "$view"), methodPath, bindingExpression("selectedContexts", "internal")], fpmFormatter.customIsEnabledCheck, converterContext.getAnnotationEntityType()));
    } else {
      // then it's a binding
      return compileBinding(resolvedBinding);
    }
  }

  function getEnabledBinding(actionDefinition) {
    var _actionDefinition$ann, _actionDefinition$ann2;

    if (!actionDefinition) {
      return "true";
    }

    if (!actionDefinition.isBound) {
      return "true";
    }

    var operationAvailable = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Core) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.OperationAvailable;

    if (operationAvailable) {
      var _bindingExpression = compileBinding(annotationExpression(operationAvailable));

      if (_bindingExpression) {
        var _actionDefinition$par, _actionDefinition$par2;

        /**
         * Action Parameter is ignored by the formatter when trigger by templating
         * here it's done manually
         **/
        var paramSuffix = (_actionDefinition$par = actionDefinition.parameters) === null || _actionDefinition$par === void 0 ? void 0 : (_actionDefinition$par2 = _actionDefinition$par[0]) === null || _actionDefinition$par2 === void 0 ? void 0 : _actionDefinition$par2.fullyQualifiedName;

        if (paramSuffix) {
          paramSuffix = paramSuffix.replace(actionDefinition.fullyQualifiedName + "/", "");
          _bindingExpression = _bindingExpression.replace(paramSuffix + "/", "");
        }

        return _bindingExpression;
      }

      return "true";
    }

    return "true";
    /*
       FIXME Disable failing music tests
    	Due to limitation on CAP the following binding (which is the good one) generates error:
    			   return "{= !${#" + field.Action + "} ? false : true }";
    	CAP tries to read the action as property and doesn't find it
    */
  }

  _exports.getEnabledBinding = getEnabledBinding;

  function getSemanticObjectMapping(aMappings) {
    var aSemanticObjectMappings = [];
    aMappings.forEach(function (oMapping) {
      var oSOMapping = {
        "LocalProperty": {
          "$PropertyPath": oMapping.LocalProperty.value
        },
        "SemanticObjectProperty": oMapping.SemanticObjectProperty
      };
      aSemanticObjectMappings.push(oSOMapping);
    });
    return aSemanticObjectMappings;
  }

  _exports.getSemanticObjectMapping = getSemanticObjectMapping;

  function isActionNavigable(action, navigationSettings, considerNavigationSettings) {
    var _action$afterExecutio, _action$afterExecutio2;

    var bIsNavigationConfigured = true;

    if (considerNavigationSettings) {
      var detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
      bIsNavigationConfigured = (detailOrDisplay === null || detailOrDisplay === void 0 ? void 0 : detailOrDisplay.route) ? true : false;
    } // when enableAutoScroll is true the navigateToInstance feature is disabled


    if (action && action.afterExecution && (((_action$afterExecutio = action.afterExecution) === null || _action$afterExecutio === void 0 ? void 0 : _action$afterExecutio.navigateToInstance) === false || ((_action$afterExecutio2 = action.afterExecution) === null || _action$afterExecutio2 === void 0 ? void 0 : _action$afterExecutio2.enableAutoScroll) === true) || !bIsNavigationConfigured) {
      return false;
    }

    return true;
  }

  _exports.isActionNavigable = isActionNavigable;

  function enableAutoScroll(action) {
    var _action$afterExecutio3;

    return (action === null || action === void 0 ? void 0 : (_action$afterExecutio3 = action.afterExecution) === null || _action$afterExecutio3 === void 0 ? void 0 : _action$afterExecutio3.enableAutoScroll) === true;
  }

  _exports.enableAutoScroll = enableAutoScroll;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbi50cyJdLCJuYW1lcyI6WyJCdXR0b25UeXBlIiwicHJlcGFyZU1lbnVBY3Rpb24iLCJhY3Rpb25zIiwiYUFubm90YXRpb25BY3Rpb25zIiwiYUhpZGRlbkhlYWRlckFjdGlvbnMiLCJhbGxBY3Rpb25zIiwibWVudUl0ZW1LZXlzIiwiYWN0aW9uS2V5IiwibWFuaWZlc3RBY3Rpb24iLCJ0eXBlIiwiQWN0aW9uVHlwZSIsIk1lbnUiLCJtZW51SXRlbXMiLCJtZW51VmlzaWJsZSIsIl9tZW51SXRlbUtleXMiLCJtZW51IiwibWFwIiwibWVudUtleSIsImFjdGlvbiIsImZpbmQiLCJrZXkiLCJ2aXNpYmxlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiaGlkZGVuQWN0aW9uIiwiY29tcGlsZUJpbmRpbmciLCJvciIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwicHVzaCIsImxlbmd0aCIsImZvckVhY2giLCJyZW1vdmVEdXBsaWNhdGVBY3Rpb25zIiwib01lbnVJdGVtS2V5cyIsInJlZHVjZSIsIml0ZW0iLCJmaWx0ZXIiLCJfZ2V0TWFuaWZlc3RFbmFibGVkIiwibWFuaWZlc3RTZXR0aW5nIiwiaXNBbm5vdGF0aW9uQWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsInVuZGVmaW5lZCIsImdldE1hbmlmZXN0QWN0aW9uRW5hYmxlbWVudCIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdEFjdGlvbnMiLCJuYXZpZ2F0aW9uU2V0dGluZ3MiLCJjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncyIsImxhc3REb3RJbmRleCIsInByZXNzIiwibGFzdEluZGV4T2YiLCJzb21lIiwiaWQiLCJDdXN0b21BY3Rpb25JRCIsImVuYWJsZWQiLCJoYW5kbGVyTW9kdWxlIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsImhhbmRsZXJNZXRob2QiLCJEZWZhdWx0IiwidGV4dCIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJlbmFibGVPblNlbGVjdCIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc05hdmlnYWJsZSIsImlzQWN0aW9uTmF2aWdhYmxlIiwicmVxdWlyZXNTZWxlY3Rpb24iLCJlbmFibGVBdXRvU2Nyb2xsIiwiZW5hYmxlZFN0cmluZyIsInJlc29sdmVkQmluZGluZyIsImlzQ29uc3RhbnQiLCJ2YWx1ZSIsIl90eXBlIiwibWV0aG9kUGF0aCIsImZvcm1hdFJlc3VsdCIsImJpbmRpbmdFeHByZXNzaW9uIiwiZnBtRm9ybWF0dGVyIiwiY3VzdG9tSXNFbmFibGVkQ2hlY2siLCJnZXRBbm5vdGF0aW9uRW50aXR5VHlwZSIsImdldEVuYWJsZWRCaW5kaW5nIiwiYWN0aW9uRGVmaW5pdGlvbiIsImlzQm91bmQiLCJvcGVyYXRpb25BdmFpbGFibGUiLCJhbm5vdGF0aW9ucyIsIkNvcmUiLCJPcGVyYXRpb25BdmFpbGFibGUiLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsInBhcmFtU3VmZml4IiwicGFyYW1ldGVycyIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsImFNYXBwaW5ncyIsImFTZW1hbnRpY09iamVjdE1hcHBpbmdzIiwib01hcHBpbmciLCJvU09NYXBwaW5nIiwiTG9jYWxQcm9wZXJ0eSIsIlNlbWFudGljT2JqZWN0UHJvcGVydHkiLCJiSXNOYXZpZ2F0aW9uQ29uZmlndXJlZCIsImRldGFpbE9yRGlzcGxheSIsImRldGFpbCIsImRpc3BsYXkiLCJyb3V0ZSIsImFmdGVyRXhlY3V0aW9uIiwibmF2aWdhdGVUb0luc3RhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Ba0JZQSxVOzthQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFB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RSxXQUFPLENBQUFBLE1BQU0sU0FBTixJQUFBQSxNQUFNLFdBQU4sc0NBQUFBLE1BQU0sQ0FBRXNGLGNBQVIsa0ZBQXdCbkMsZ0JBQXhCLE1BQTZDLElBQXBEO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQWN0aW9uVHlwZSwgTWFuaWZlc3RBY3Rpb24sIE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sIE1hbmlmZXN0VGFibGVDb2x1bW4gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVPYmplY3QsIEN1c3RvbUVsZW1lbnQsIFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBDdXN0b21BY3Rpb25JRCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IHJlcGxhY2VTcGVjaWFsQ2hhcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IHtcblx0YW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdGJpbmRpbmdFeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdG9yLFxuXHRmb3JtYXRSZXN1bHQsXG5cdGlzQ29uc3RhbnQsXG5cdHJlc29sdmVCaW5kaW5nU3RyaW5nXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgZnBtRm9ybWF0dGVyIGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL0ZQTUZvcm1hdHRlclwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5cbmV4cG9ydCBlbnVtIEJ1dHRvblR5cGUge1xuXHRBY2NlcHQgPSBcIkFjY2VwdFwiLFxuXHRBdHRlbnRpb24gPSBcIkF0dGVudGlvblwiLFxuXHRCYWNrID0gXCJCYWNrXCIsXG5cdENyaXRpY2FsID0gXCJDcml0aWNhbFwiLFxuXHREZWZhdWx0ID0gXCJEZWZhdWx0XCIsXG5cdEVtcGhhc2l6ZWQgPSBcIkVtcGhhc2l6ZWRcIixcblx0R2hvc3QgPSBcIkdob3N0XCIsXG5cdE5lZ2F0aXZlID0gXCJOZWdhdGl2ZVwiLFxuXHROZXV0cmFsID0gXCJOZXV0cmFsXCIsXG5cdFJlamVjdCA9IFwiUmVqZWN0XCIsXG5cdFN1Y2Nlc3MgPSBcIlN1Y2Nlc3NcIixcblx0VHJhbnNwYXJlbnQgPSBcIlRyYW5zcGFyZW50XCIsXG5cdFVuc3R5bGVkID0gXCJVbnN0eWxlZFwiLFxuXHRVcCA9IFwiVXBcIlxufVxuXG5leHBvcnQgdHlwZSBCYXNlQWN0aW9uID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHRpZD86IHN0cmluZztcblx0dGV4dD86IHN0cmluZztcblx0dHlwZTogQWN0aW9uVHlwZTtcblx0cHJlc3M/OiBzdHJpbmc7XG5cdGVuYWJsZWQ/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0dmlzaWJsZT86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRlbmFibGVPblNlbGVjdD86IHN0cmluZztcblx0aXNOYXZpZ2FibGU/OiBib29sZWFuO1xuXHRlbmFibGVBdXRvU2Nyb2xsPzogYm9vbGVhbjtcblx0cmVxdWlyZXNEaWFsb2c/OiBzdHJpbmc7XG5cdGJpbmRpbmc/OiBzdHJpbmc7XG5cdGJ1dHRvblR5cGU/OiBCdXR0b25UeXBlLkdob3N0IHwgQnV0dG9uVHlwZS5UcmFuc3BhcmVudCB8IHN0cmluZztcblx0cGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZD86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRtZW51PzogKHN0cmluZyB8IEN1c3RvbUFjdGlvbiB8IEJhc2VBY3Rpb24pW107XG59O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uQWN0aW9uID0gQmFzZUFjdGlvbiAmIHtcblx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gfCBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbjtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0aWQ/OiBzdHJpbmc7XG5cdGN1c3RvbURhdGE/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEN1c3RvbSBBY3Rpb24gRGVmaW5pdGlvblxuICpcbiAqIEB0eXBlZGVmIEN1c3RvbUFjdGlvblxuICovXG5leHBvcnQgdHlwZSBDdXN0b21BY3Rpb24gPSBDdXN0b21FbGVtZW50PFxuXHRCYXNlQWN0aW9uICYge1xuXHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCB8IEFjdGlvblR5cGUuTWVudTtcblx0XHRoYW5kbGVyTWV0aG9kOiBzdHJpbmc7XG5cdFx0aGFuZGxlck1vZHVsZTogc3RyaW5nO1xuXHRcdG1lbnU/OiAoc3RyaW5nIHwgQ3VzdG9tQWN0aW9uIHwgQmFzZUFjdGlvbilbXTtcblx0XHRyZXF1aXJlc1NlbGVjdGlvbj86IGJvb2xlYW47XG5cdH1cbj47XG5cbi8vIFJldXNlIG9mIENvbmZpZ3VyYWJsZU9iamVjdCBhbmQgQ3VzdG9tRWxlbWVudCBpcyBkb25lIGZvciBvcmRlcmluZ1xuZXhwb3J0IHR5cGUgQ29udmVydGVyQWN0aW9uID0gQW5ub3RhdGlvbkFjdGlvbiB8IEN1c3RvbUFjdGlvbjtcblxuLyoqXG4gKiBQcmVwYXJlIG1lbnUgYWN0aW9uIGZyb20gbWFuaWZlc3QgYWN0aW9ucy5cbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPn0gYWN0aW9ucyB0aGUgbWFuaWZlc3QgZGVmaW5pdGlvblxuICogQHBhcmFtIHtCYXNlQWN0aW9uW119IGFBbm5vdGF0aW9uQWN0aW9ucyB0aGUgYW5ub3RhdGlvbiBhY3Rpb25zIGRlZmluaXRpb25cbiAqIEBwYXJhbSBhSGlkZGVuSGVhZGVyQWN0aW9uc1xuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj59IHRoZSBhY3Rpb25zIGZyb20gdGhlIG1hbmlmZXN0IGFuZCBtZW51IG9wdGlvbiBhZGRlZFxuICovXG5mdW5jdGlvbiBwcmVwYXJlTWVudUFjdGlvbihcblx0YWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPixcblx0YUFubm90YXRpb25BY3Rpb25zOiBCYXNlQWN0aW9uW10sXG5cdGFIaWRkZW5IZWFkZXJBY3Rpb25zOiBCYXNlQWN0aW9uW11cbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4ge1xuXHRjb25zdCBhbGxBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+ID0ge307XG5cdGxldCBtZW51SXRlbUtleXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkID0gW107XG5cblx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gYWN0aW9ucykge1xuXHRcdGNvbnN0IG1hbmlmZXN0QWN0aW9uOiBDdXN0b21BY3Rpb24gPSBhY3Rpb25zW2FjdGlvbktleV07XG5cdFx0aWYgKG1hbmlmZXN0QWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuTWVudSkge1xuXHRcdFx0Y29uc3QgbWVudUl0ZW1zOiAoQ3VzdG9tQWN0aW9uIHwgQmFzZUFjdGlvbilbXSA9IFtdO1xuXHRcdFx0bGV0IG1lbnVWaXNpYmxlOiBhbnkgPSBmYWxzZTtcblx0XHRcdGxldCBfbWVudUl0ZW1LZXlzID1cblx0XHRcdFx0bWFuaWZlc3RBY3Rpb24ubWVudT8ubWFwKChtZW51S2V5OiBzdHJpbmcgfCBDdXN0b21BY3Rpb24pID0+IHtcblx0XHRcdFx0XHRsZXQgYWN0aW9uOiBCYXNlQWN0aW9uIHwgQ3VzdG9tQWN0aW9uIHwgdW5kZWZpbmVkID0gYUFubm90YXRpb25BY3Rpb25zLmZpbmQoXG5cdFx0XHRcdFx0XHQoYWN0aW9uOiBCYXNlQWN0aW9uKSA9PiBhY3Rpb24ua2V5ID09PSBtZW51S2V5XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoIWFjdGlvbikge1xuXHRcdFx0XHRcdFx0YWN0aW9uID0gYWN0aW9uc1ttZW51S2V5IGFzIHN0cmluZ107XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0KGFjdGlvbj8udmlzaWJsZSB8fFxuXHRcdFx0XHRcdFx0XHRhY3Rpb24/LnR5cGUgPT09IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uIHx8XG5cdFx0XHRcdFx0XHRcdGFjdGlvbj8udHlwZSA9PT0gQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24pICYmXG5cdFx0XHRcdFx0XHQhYUhpZGRlbkhlYWRlckFjdGlvbnMuZmluZChoaWRkZW5BY3Rpb24gPT4gaGlkZGVuQWN0aW9uLmtleSA9PT0gbWVudUtleSlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdG1lbnVWaXNpYmxlID0gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0XHRcdG9yKHJlc29sdmVCaW5kaW5nU3RyaW5nKChhY3Rpb24gYXMgYW55KS52aXNpYmxlLCBcImJvb2xlYW5cIiksIHJlc29sdmVCaW5kaW5nU3RyaW5nKG1lbnVWaXNpYmxlLCBcImJvb2xlYW5cIikpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0bWVudUl0ZW1zLnB1c2goYWN0aW9uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbWVudUtleSBhcyBzdHJpbmc7XG5cdFx0XHRcdH0pID8/IFtdO1xuXG5cdFx0XHQvLyBTaG93IG1lbnUgYnV0dG9uIGlmIGl0IGhhcyBvbmUgb3IgbW9yZSB0aGVuIDEgaXRlbXMgdmlzaWJsZVxuXHRcdFx0aWYgKG1lbnVJdGVtcy5sZW5ndGgpIHtcblx0XHRcdFx0bWFuaWZlc3RBY3Rpb24udmlzaWJsZSA9IG1lbnVWaXNpYmxlO1xuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbi5tZW51ID0gbWVudUl0ZW1zO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0X21lbnVJdGVtS2V5cyA9IFthY3Rpb25LZXldO1xuXHRcdFx0fVxuXG5cdFx0XHRtZW51SXRlbUtleXMgPSBbLi4ubWVudUl0ZW1LZXlzLCAuLi5fbWVudUl0ZW1LZXlzXTtcblx0XHR9XG5cdFx0aWYgKGFIaWRkZW5IZWFkZXJBY3Rpb25zLmZpbmQoaGlkZGVuQWN0aW9uID0+IGhpZGRlbkFjdGlvbi5rZXkgPT09IGFjdGlvbktleSkpIHtcblx0XHRcdG1hbmlmZXN0QWN0aW9uLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdFx0YWxsQWN0aW9uc1thY3Rpb25LZXldID0gbWFuaWZlc3RBY3Rpb247XG5cdH1cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdG1lbnVJdGVtS2V5cz8uZm9yRWFjaCgoYWN0aW9uS2V5OiBzdHJpbmcpID0+IGRlbGV0ZSBhbGxBY3Rpb25zW2FjdGlvbktleV0pO1xuXHRyZXR1cm4gYWxsQWN0aW9ucztcbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMgPSAoYWN0aW9uczogQmFzZUFjdGlvbltdKTogQmFzZUFjdGlvbltdID0+IHtcblx0Y29uc3Qgb01lbnVJdGVtS2V5czogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXHRhY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcblx0XHRpZiAoYWN0aW9uPy5tZW51Py5sZW5ndGgpIHtcblx0XHRcdGFjdGlvbi5tZW51LnJlZHVjZSgoaXRlbSwgeyBrZXkgfTogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChrZXkgJiYgIWl0ZW1ba2V5XSkge1xuXHRcdFx0XHRcdGl0ZW1ba2V5XSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9LCBvTWVudUl0ZW1LZXlzKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYWN0aW9ucy5maWx0ZXIoYWN0aW9uID0+ICFvTWVudUl0ZW1LZXlzW2FjdGlvbi5rZXldKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIGFuIGFjdGlvbiBkZWZhdWx0IHZhbHVlIGJhc2VkIG9uIGl0cyBraW5kLlxuICpcbiAqIERlZmF1bHQgcHJvcGVydHkgdmFsdWUgZm9yIGN1c3RvbSBhY3Rpb25zIGlmIG5vdCBvdmVyd3JpdHRlbiBpbiBtYW5pZmVzdC5cbiAqIEBwYXJhbSBtYW5pZmVzdFNldHRpbmcge2FueX0gVGhlIGNvbHVtbiBwcm9wZXJ0eSBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGlzQW5ub3RhdGlvbkFjdGlvbiB7Ym9vbGVhbn0gV2hldGhlciB0aGUgYWN0aW9uLCBkZWZpbmVkIGluIG1hbmlmZXN0LCBjb3JyZXNwb25kcyB0byBhbiBleGlzdGluZyBhbm5vdGF0aW9uIGFjdGlvbi5cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB8IHN0cmluZyB8IGJvb2xlYW59IERldGVybWluZWQgcHJvcGVydHkgdmFsdWUgZm9yIHRoZSBjb2x1bW5cbiAqL1xuY29uc3QgX2dldE1hbmlmZXN0RW5hYmxlZCA9IGZ1bmN0aW9uKFxuXHRtYW5pZmVzdFNldHRpbmc6IGFueSxcblx0aXNBbm5vdGF0aW9uQWN0aW9uOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHwgc3RyaW5nIHwgYm9vbGVhbiB7XG5cdGlmIChtYW5pZmVzdFNldHRpbmcgPT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIElmIGFubm90YXRpb24gYWN0aW9uIGhhcyBubyBwcm9wZXJ0eSBkZWZpbmVkIGluIG1hbmlmZXN0LFxuXHRcdC8vIGRvIG5vdCBvdmVyd3JpdGUgaXQgd2l0aCBtYW5pZmVzdCBhY3Rpb24ncyBkZWZhdWx0IHZhbHVlLlxuXHRcdHJldHVybiBpc0Fubm90YXRpb25BY3Rpb24gPyB1bmRlZmluZWQgOiB0cnVlO1xuXHR9XG5cdC8vIFJldHVybiB3aGF0IGlzIGRlZmluZWQgaW4gbWFuaWZlc3QuXG5cdHJldHVybiBnZXRNYW5pZmVzdEFjdGlvbkVuYWJsZW1lbnQobWFuaWZlc3RTZXR0aW5nLCBjb252ZXJ0ZXJDb250ZXh0KTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBhY3Rpb24gY29uZmlndXJhdGlvbiBiYXNlZCBvbiB0aGUgbWFuaWZlc3Qgc2V0dGluZ3MuXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIE1hbmlmZXN0QWN0aW9uPiB8IHVuZGVmaW5lZH0gbWFuaWZlc3RBY3Rpb25zIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSB7QmFzZUFjdGlvbltdfSBhQW5ub3RhdGlvbkFjdGlvbnMgdGhlIGFubm90YXRpb24gYWN0aW9ucyBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHBhcmFtIHtib29sZWFufSBjb25zaWRlck5hdmlnYXRpb25TZXR0aW5nc1xuICogQHBhcmFtIHtCYXNlQWN0aW9uW119IGFIaWRkZW5IZWFkZXJBY3Rpb25zXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPn0gdGhlIGFjdGlvbnMgZnJvbSB0aGUgbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoXG5cdG1hbmlmZXN0QWN0aW9uczogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RBY3Rpb24+IHwgdW5kZWZpbmVkLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhQW5ub3RhdGlvbkFjdGlvbnM/OiBCYXNlQWN0aW9uW10sXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzPzogYm9vbGVhbixcblx0YUhpZGRlbkhlYWRlckFjdGlvbnM/OiBCYXNlQWN0aW9uW11cbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4ge1xuXHRjb25zdCBhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+ID0ge307XG5cdGZvciAoY29uc3QgYWN0aW9uS2V5IGluIG1hbmlmZXN0QWN0aW9ucykge1xuXHRcdGNvbnN0IG1hbmlmZXN0QWN0aW9uOiBNYW5pZmVzdEFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdGNvbnN0IGxhc3REb3RJbmRleCA9IG1hbmlmZXN0QWN0aW9uLnByZXNzPy5sYXN0SW5kZXhPZihcIi5cIik7XG5cblx0XHQvLyBUbyBpZGVudGlmeSB0aGUgYW5ub3RhdGlvbiBhY3Rpb24gcHJvcGVydHkgb3ZlcndyaXRlIHZpYSBtYW5pZmVzdCB1c2UtY2FzZS5cblx0XHRjb25zdCBpc0Fubm90YXRpb25BY3Rpb24gPSBhQW5ub3RhdGlvbkFjdGlvbnM/LnNvbWUoYWN0aW9uID0+IGFjdGlvbi5rZXkgPT09IGFjdGlvbktleSkgfHwgZmFsc2U7XG5cblx0XHRhY3Rpb25zW2FjdGlvbktleV0gPSB7XG5cdFx0XHRpZDogYUFubm90YXRpb25BY3Rpb25zPy5zb21lKGFjdGlvbiA9PiBhY3Rpb24ua2V5ID09PSBhY3Rpb25LZXkpID8gYWN0aW9uS2V5IDogQ3VzdG9tQWN0aW9uSUQoYWN0aW9uS2V5KSxcblx0XHRcdHZpc2libGU6IG1hbmlmZXN0QWN0aW9uLnZpc2libGUgPT09IHVuZGVmaW5lZCA/IFwidHJ1ZVwiIDogbWFuaWZlc3RBY3Rpb24udmlzaWJsZSxcblx0XHRcdGVuYWJsZWQ6IF9nZXRNYW5pZmVzdEVuYWJsZWQobWFuaWZlc3RBY3Rpb24uZW5hYmxlZCwgaXNBbm5vdGF0aW9uQWN0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdGhhbmRsZXJNb2R1bGU6IG1hbmlmZXN0QWN0aW9uLnByZXNzICYmIG1hbmlmZXN0QWN0aW9uLnByZXNzLnN1YnN0cmluZygwLCBsYXN0RG90SW5kZXgpLnJlcGxhY2UoL1xcLi9naSwgXCIvXCIpLFxuXHRcdFx0aGFuZGxlck1ldGhvZDogbWFuaWZlc3RBY3Rpb24ucHJlc3MgJiYgbWFuaWZlc3RBY3Rpb24ucHJlc3Muc3Vic3RyaW5nKGxhc3REb3RJbmRleCArIDEpLFxuXHRcdFx0cHJlc3M6IG1hbmlmZXN0QWN0aW9uLnByZXNzLFxuXHRcdFx0dHlwZTogbWFuaWZlc3RBY3Rpb24ubWVudSA/IEFjdGlvblR5cGUuTWVudSA6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdHRleHQ6IG1hbmlmZXN0QWN0aW9uLnRleHQsXG5cdFx0XHRrZXk6IHJlcGxhY2VTcGVjaWFsQ2hhcnMoYWN0aW9uS2V5KSxcblx0XHRcdGVuYWJsZU9uU2VsZWN0OiBtYW5pZmVzdEFjdGlvbi5lbmFibGVPblNlbGVjdCxcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGFuY2hvcjogbWFuaWZlc3RBY3Rpb24ucG9zaXRpb24/LmFuY2hvcixcblx0XHRcdFx0cGxhY2VtZW50OiBtYW5pZmVzdEFjdGlvbi5wb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gUGxhY2VtZW50LkFmdGVyIDogbWFuaWZlc3RBY3Rpb24ucG9zaXRpb24ucGxhY2VtZW50XG5cdFx0XHR9LFxuXHRcdFx0aXNOYXZpZ2FibGU6IGlzQWN0aW9uTmF2aWdhYmxlKG1hbmlmZXN0QWN0aW9uLCBuYXZpZ2F0aW9uU2V0dGluZ3MsIGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzKSxcblx0XHRcdHJlcXVpcmVzU2VsZWN0aW9uOiBtYW5pZmVzdEFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBtYW5pZmVzdEFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbixcblx0XHRcdGVuYWJsZUF1dG9TY3JvbGw6IGVuYWJsZUF1dG9TY3JvbGwobWFuaWZlc3RBY3Rpb24pLFxuXHRcdFx0bWVudTogbWFuaWZlc3RBY3Rpb24ubWVudSA/PyBbXVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHByZXBhcmVNZW51QWN0aW9uKGFjdGlvbnMsIGFBbm5vdGF0aW9uQWN0aW9ucyA/PyBbXSwgYUhpZGRlbkhlYWRlckFjdGlvbnMgPz8gW10pO1xufVxuXG5mdW5jdGlvbiBnZXRNYW5pZmVzdEFjdGlvbkVuYWJsZW1lbnQoZW5hYmxlZFN0cmluZzogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdGNvbnN0IHJlc29sdmVkQmluZGluZyA9IHJlc29sdmVCaW5kaW5nU3RyaW5nKGVuYWJsZWRTdHJpbmcsIFwiYm9vbGVhblwiKTtcblx0aWYgKGlzQ29uc3RhbnQocmVzb2x2ZWRCaW5kaW5nKSAmJiB0eXBlb2YgcmVzb2x2ZWRCaW5kaW5nLnZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdC8vIHRydWUgLyBmYWxzZVxuXHRcdHJldHVybiByZXNvbHZlZEJpbmRpbmcudmFsdWU7XG5cdH0gZWxzZSBpZiAocmVzb2x2ZWRCaW5kaW5nLl90eXBlICE9PSBcIkVtYmVkZGVkQmluZGluZ1wiICYmIHJlc29sdmVkQmluZGluZy5fdHlwZSAhPT0gXCJFbWJlZGRlZEV4cHJlc3Npb25CaW5kaW5nXCIpIHtcblx0XHQvLyBUaGVuIGl0J3MgYSBtb2R1bGUtbWV0aG9kIHJlZmVyZW5jZSBcInNhcC54eHgueXl5LmRvU29tZXRoaW5nXCJcblx0XHRjb25zdCBtZXRob2RQYXRoID0gcmVzb2x2ZWRCaW5kaW5nLnZhbHVlIGFzIHN0cmluZztcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRmb3JtYXRSZXN1bHQoXG5cdFx0XHRcdFtiaW5kaW5nRXhwcmVzc2lvbihcIi9cIiwgXCIkdmlld1wiKSwgbWV0aG9kUGF0aCwgYmluZGluZ0V4cHJlc3Npb24oXCJzZWxlY3RlZENvbnRleHRzXCIsIFwiaW50ZXJuYWxcIildLFxuXHRcdFx0XHRmcG1Gb3JtYXR0ZXIuY3VzdG9tSXNFbmFibGVkQ2hlY2ssXG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUoKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gdGhlbiBpdCdzIGEgYmluZGluZ1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhyZXNvbHZlZEJpbmRpbmcpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmFibGVkQmluZGluZyhhY3Rpb25EZWZpbml0aW9uOiBBY3Rpb24gfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuXHRpZiAoIWFjdGlvbkRlZmluaXRpb24pIHtcblx0XHRyZXR1cm4gXCJ0cnVlXCI7XG5cdH1cblx0aWYgKCFhY3Rpb25EZWZpbml0aW9uLmlzQm91bmQpIHtcblx0XHRyZXR1cm4gXCJ0cnVlXCI7XG5cdH1cblx0Y29uc3Qgb3BlcmF0aW9uQXZhaWxhYmxlID0gYWN0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlO1xuXHRpZiAob3BlcmF0aW9uQXZhaWxhYmxlKSB7XG5cdFx0bGV0IGJpbmRpbmdFeHByZXNzaW9uID0gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24ob3BlcmF0aW9uQXZhaWxhYmxlKSk7XG5cdFx0aWYgKGJpbmRpbmdFeHByZXNzaW9uKSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIEFjdGlvbiBQYXJhbWV0ZXIgaXMgaWdub3JlZCBieSB0aGUgZm9ybWF0dGVyIHdoZW4gdHJpZ2dlciBieSB0ZW1wbGF0aW5nXG5cdFx0XHQgKiBoZXJlIGl0J3MgZG9uZSBtYW51YWxseVxuXHRcdFx0ICoqL1xuXHRcdFx0bGV0IHBhcmFtU3VmZml4ID0gYWN0aW9uRGVmaW5pdGlvbi5wYXJhbWV0ZXJzPy5bMF0/LmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdGlmIChwYXJhbVN1ZmZpeCkge1xuXHRcdFx0XHRwYXJhbVN1ZmZpeCA9IHBhcmFtU3VmZml4LnJlcGxhY2UoYWN0aW9uRGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgKyBcIi9cIiwgXCJcIik7XG5cdFx0XHRcdGJpbmRpbmdFeHByZXNzaW9uID0gYmluZGluZ0V4cHJlc3Npb24ucmVwbGFjZShwYXJhbVN1ZmZpeCArIFwiL1wiLCBcIlwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBiaW5kaW5nRXhwcmVzc2lvbjtcblx0XHR9XG5cdFx0cmV0dXJuIFwidHJ1ZVwiO1xuXHR9XG5cdHJldHVybiBcInRydWVcIjtcblx0Lypcblx0ICAgRklYTUUgRGlzYWJsZSBmYWlsaW5nIG11c2ljIHRlc3RzXG5cdFx0RHVlIHRvIGxpbWl0YXRpb24gb24gQ0FQIHRoZSBmb2xsb3dpbmcgYmluZGluZyAod2hpY2ggaXMgdGhlIGdvb2Qgb25lKSBnZW5lcmF0ZXMgZXJyb3I6XG5cdFx0XHRcdCAgIHJldHVybiBcIns9ICEkeyNcIiArIGZpZWxkLkFjdGlvbiArIFwifSA/IGZhbHNlIDogdHJ1ZSB9XCI7XG5cdFx0Q0FQIHRyaWVzIHRvIHJlYWQgdGhlIGFjdGlvbiBhcyBwcm9wZXJ0eSBhbmQgZG9lc24ndCBmaW5kIGl0XG5cdCovXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZW1hbnRpY09iamVjdE1hcHBpbmcoYU1hcHBpbmdzOiBhbnlbXSk6IGFueVtdIHtcblx0Y29uc3QgYVNlbWFudGljT2JqZWN0TWFwcGluZ3M6IGFueVtdID0gW107XG5cdGFNYXBwaW5ncy5mb3JFYWNoKG9NYXBwaW5nID0+IHtcblx0XHRjb25zdCBvU09NYXBwaW5nID0ge1xuXHRcdFx0XCJMb2NhbFByb3BlcnR5XCI6IHtcblx0XHRcdFx0XCIkUHJvcGVydHlQYXRoXCI6IG9NYXBwaW5nLkxvY2FsUHJvcGVydHkudmFsdWVcblx0XHRcdH0sXG5cdFx0XHRcIlNlbWFudGljT2JqZWN0UHJvcGVydHlcIjogb01hcHBpbmcuU2VtYW50aWNPYmplY3RQcm9wZXJ0eVxuXHRcdH07XG5cdFx0YVNlbWFudGljT2JqZWN0TWFwcGluZ3MucHVzaChvU09NYXBwaW5nKTtcblx0fSk7XG5cdHJldHVybiBhU2VtYW50aWNPYmplY3RNYXBwaW5ncztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQWN0aW9uTmF2aWdhYmxlKFxuXHRhY3Rpb246IE1hbmlmZXN0QWN0aW9uIHwgTWFuaWZlc3RUYWJsZUNvbHVtbixcblx0bmF2aWdhdGlvblNldHRpbmdzPzogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0Y29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3M/OiBib29sZWFuXG4pOiBib29sZWFuIHtcblx0bGV0IGJJc05hdmlnYXRpb25Db25maWd1cmVkOiBib29sZWFuID0gdHJ1ZTtcblx0aWYgKGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzKSB7XG5cdFx0Y29uc3QgZGV0YWlsT3JEaXNwbGF5ID0gbmF2aWdhdGlvblNldHRpbmdzICYmIChuYXZpZ2F0aW9uU2V0dGluZ3MuZGV0YWlsIHx8IG5hdmlnYXRpb25TZXR0aW5ncy5kaXNwbGF5KTtcblx0XHRiSXNOYXZpZ2F0aW9uQ29uZmlndXJlZCA9IGRldGFpbE9yRGlzcGxheT8ucm91dGUgPyB0cnVlIDogZmFsc2U7XG5cdH1cblx0Ly8gd2hlbiBlbmFibGVBdXRvU2Nyb2xsIGlzIHRydWUgdGhlIG5hdmlnYXRlVG9JbnN0YW5jZSBmZWF0dXJlIGlzIGRpc2FibGVkXG5cdGlmIChcblx0XHQoYWN0aW9uICYmXG5cdFx0XHRhY3Rpb24uYWZ0ZXJFeGVjdXRpb24gJiZcblx0XHRcdChhY3Rpb24uYWZ0ZXJFeGVjdXRpb24/Lm5hdmlnYXRlVG9JbnN0YW5jZSA9PT0gZmFsc2UgfHwgYWN0aW9uLmFmdGVyRXhlY3V0aW9uPy5lbmFibGVBdXRvU2Nyb2xsID09PSB0cnVlKSkgfHxcblx0XHQhYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWRcblx0KSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlQXV0b1Njcm9sbChhY3Rpb246IE1hbmlmZXN0QWN0aW9uKTogYm9vbGVhbiB7XG5cdHJldHVybiBhY3Rpb24/LmFmdGVyRXhlY3V0aW9uPy5lbmFibGVBdXRvU2Nyb2xsID09PSB0cnVlO1xufVxuIl19