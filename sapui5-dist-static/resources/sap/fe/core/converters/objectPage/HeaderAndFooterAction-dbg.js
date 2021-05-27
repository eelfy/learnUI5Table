sap.ui.define(["../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper"], function (ManifestSettings, Action, ConfigurableObject, BindingExpression, Key, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var KeyHelper = Key.KeyHelper;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var not = BindingExpression.not;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var Placement = ConfigurableObject.Placement;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var ButtonType = Action.ButtonType;
  var ActionType = ManifestSettings.ActionType;

  /**
   * Retrieve all the data field for actions for the identification annotation
   * They must be
   * - Not statically hidden
   * - Either linked to an Unbound action or to an action which has an OperationAvailable not statically false.
   *
   * @param {EntityType} entityType the current entitytype
   * @param {boolean} bDetermining whether or not the action should be determining
   * @returns {DataFieldForActionTypes[]} an array of datafield for action respecting the bDetermining property
   */
  function getIdentificationDataFieldForActions(entityType, bDetermining) {
    var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    return ((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Identification) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.filter(function (identificationDataField) {
      var _identificationDataFi, _identificationDataFi2, _identificationDataFi3;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi = identificationDataField.annotations) === null || _identificationDataFi === void 0 ? void 0 : (_identificationDataFi2 = _identificationDataFi.UI) === null || _identificationDataFi2 === void 0 ? void 0 : (_identificationDataFi3 = _identificationDataFi2.Hidden) === null || _identificationDataFi3 === void 0 ? void 0 : _identificationDataFi3.valueOf()) !== true) {
        var _identificationDataFi4, _identificationDataFi5, _identificationDataFi6, _identificationDataFi7, _identificationDataFi8;

        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" && !!identificationDataField.Determining === bDetermining && (!(identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi4 = identificationDataField.ActionTarget) === null || _identificationDataFi4 === void 0 ? void 0 : _identificationDataFi4.isBound) || (identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi5 = identificationDataField.ActionTarget) === null || _identificationDataFi5 === void 0 ? void 0 : (_identificationDataFi6 = _identificationDataFi5.annotations) === null || _identificationDataFi6 === void 0 ? void 0 : (_identificationDataFi7 = _identificationDataFi6.Core) === null || _identificationDataFi7 === void 0 ? void 0 : (_identificationDataFi8 = _identificationDataFi7.OperationAvailable) === null || _identificationDataFi8 === void 0 ? void 0 : _identificationDataFi8.valueOf()) !== false)) {
          return true;
        }
      }

      return false;
    })) || [];
  }
  /**
   * Retrieve all the IBN actions for the identification annotation.
   * They must be
   * - Not statically hidden.
   * @param {EntityType} entityType the current entitytype
   * @param {boolean} bDetermining whether or not the action should be determining
   * @returns {DataFieldForIntentBasedNavigationTypes[]} an array of datafield for action respecting the bDetermining property.
   */


  _exports.getIdentificationDataFieldForActions = getIdentificationDataFieldForActions;

  function getIdentificationDataFieldForIBNActions(entityType, bDetermining) {
    var _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

    return ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Identification) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.filter(function (identificationDataField) {
      var _identificationDataFi9, _identificationDataFi10, _identificationDataFi11;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi9 = identificationDataField.annotations) === null || _identificationDataFi9 === void 0 ? void 0 : (_identificationDataFi10 = _identificationDataFi9.UI) === null || _identificationDataFi10 === void 0 ? void 0 : (_identificationDataFi11 = _identificationDataFi10.Hidden) === null || _identificationDataFi11 === void 0 ? void 0 : _identificationDataFi11.valueOf()) !== true) {
        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !!identificationDataField.Determining === bDetermining) {
          return true;
        }
      }

      return false;
    })) || [];
  }

  var IMPORTANT_CRITICALITIES = ["UI.CriticalityType/VeryPositive", "UI.CriticalityType/Positive", "UI.CriticalityType/Negative", "UI.CriticalityType/VeryNegative"];

  function getHeaderDefaultActions(converterContext) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3, _entitySet$annotation4, _entitySet$annotation5, _entitySet$annotation6, _entitySet$annotation7, _oEntityDeleteRestric;

    var entitySet = converterContext.getEntitySet();
    var oStickySessionSupported = entitySet && ((_entitySet$annotation = entitySet.annotations) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.Session) === null || _entitySet$annotation2 === void 0 ? void 0 : _entitySet$annotation2.StickySessionSupported),
        //for sticky app
    oDraftRoot = entitySet && ((_entitySet$annotation3 = entitySet.annotations.Common) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.DraftRoot),
        oEntityDeleteRestrictions = entitySet && ((_entitySet$annotation4 = entitySet.annotations) === null || _entitySet$annotation4 === void 0 ? void 0 : (_entitySet$annotation5 = _entitySet$annotation4.Capabilities) === null || _entitySet$annotation5 === void 0 ? void 0 : _entitySet$annotation5.DeleteRestrictions),
        bUpdateHidden = entitySet && ((_entitySet$annotation6 = entitySet.annotations.UI) === null || _entitySet$annotation6 === void 0 ? void 0 : (_entitySet$annotation7 = _entitySet$annotation6.UpdateHidden) === null || _entitySet$annotation7 === void 0 ? void 0 : _entitySet$annotation7.valueOf());
    var oDataModelObjectPath = converterContext.getDataModelObjectPath(),
        isParentDeletable = isPathDeletable(oDataModelObjectPath),
        bParentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
    var headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), false); // First add the "Critical" DataFieldForActions

    var headerActions = headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      var _dataField$annotation, _dataField$annotation2;

      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden), true))),
        isNavigable: true
      };
    }); // Then the edit action if it exists

    if (((oDraftRoot === null || oDraftRoot === void 0 ? void 0 : oDraftRoot.EditAction) || (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.EditAction)) && bUpdateHidden !== true) {
      headerActions.push({
        type: ActionType.Primary,
        key: "EditAction"
      });
    } // Then the delete action if we're not statically not deletable


    if (bParentEntitySetDeletable && bParentEntitySetDeletable !== "false" || (oEntityDeleteRestrictions === null || oEntityDeleteRestrictions === void 0 ? void 0 : (_oEntityDeleteRestric = oEntityDeleteRestrictions.Deletable) === null || _oEntityDeleteRestric === void 0 ? void 0 : _oEntityDeleteRestric.valueOf()) !== false && bParentEntitySetDeletable !== "false") {
      headerActions.push({
        type: ActionType.Secondary,
        key: "DeleteAction",
        parentEntityDeleteEnabled: bParentEntitySetDeletable
      });
    }

    var headerDataFieldForIBNActions = getIdentificationDataFieldForIBNActions(converterContext.getEntityType(), false);
    headerDataFieldForIBNActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$RequiresCo, _dataField$Inline, _dataField$Label, _dataField$annotation3, _dataField$annotation4, _dataField$annotation5, _dataField$Navigation;

      var oNavigationParams = {
        semanticObjectMapping: dataField.Mapping ? getSemanticObjectMapping(dataField.Mapping) : []
      };

      if (((_dataField$RequiresCo = dataField.RequiresContext) === null || _dataField$RequiresCo === void 0 ? void 0 : _dataField$RequiresCo.valueOf()) === true) {
        throw new Error("RequiresContext property should not be true for header IBN action : " + dataField.Label);
      } else if (((_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) === true) {
        throw new Error("Inline property should not be true for header IBN action : " + dataField.Label);
      }

      headerActions.push({
        type: ActionType.DataFieldForIntentBasedNavigation,
        text: (_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString(),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        buttonType: ButtonType.Ghost,
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation3 = dataField.annotations) === null || _dataField$annotation3 === void 0 ? void 0 : (_dataField$annotation4 = _dataField$annotation3.UI) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.Hidden) === null || _dataField$annotation5 === void 0 ? void 0 : _dataField$annotation5.valueOf()), true))),
        enabled: dataField.NavigationAvailable !== undefined ? compileBinding(equal(annotationExpression((_dataField$Navigation = dataField.NavigationAvailable) === null || _dataField$Navigation === void 0 ? void 0 : _dataField$Navigation.valueOf()), true)) : true,
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true,
        press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), oNavigationParams])),
        customData: compileBinding({
          semanticObject: annotationExpression(dataField.SemanticObject),
          action: annotationExpression(dataField.Action)
        })
      });
    }); // Finally the non critical DataFieldForActions

    headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$annotation6, _dataField$annotation7;

      headerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation6 = dataField.annotations) === null || _dataField$annotation6 === void 0 ? void 0 : (_dataField$annotation7 = _dataField$annotation6.UI) === null || _dataField$annotation7 === void 0 ? void 0 : _dataField$annotation7.Hidden), true))),
        isNavigable: true
      });
    });
    return headerActions;
  }

  _exports.getHeaderDefaultActions = getHeaderDefaultActions;

  function getHiddenHeaderActions(converterContext) {
    var _entityType$annotatio7, _entityType$annotatio8, _entityType$annotatio9;

    var entityType = converterContext.getEntityType();
    var hiddenActions = ((_entityType$annotatio7 = entityType.annotations) === null || _entityType$annotatio7 === void 0 ? void 0 : (_entityType$annotatio8 = _entityType$annotatio7.UI) === null || _entityType$annotatio8 === void 0 ? void 0 : (_entityType$annotatio9 = _entityType$annotatio8.Identification) === null || _entityType$annotatio9 === void 0 ? void 0 : _entityType$annotatio9.filter(function (identificationDataField) {
      var _identificationDataFi12, _identificationDataFi13, _identificationDataFi14;

      return (identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi12 = identificationDataField.annotations) === null || _identificationDataFi12 === void 0 ? void 0 : (_identificationDataFi13 = _identificationDataFi12.UI) === null || _identificationDataFi13 === void 0 ? void 0 : (_identificationDataFi14 = _identificationDataFi13.Hidden) === null || _identificationDataFi14 === void 0 ? void 0 : _identificationDataFi14.valueOf()) === true;
    })) || [];
    return hiddenActions.map(function (dataField) {
      return {
        type: ActionType.Default,
        key: KeyHelper.generateKeyFromDataField(dataField)
      };
    });
  }

  _exports.getHiddenHeaderActions = getHiddenHeaderActions;

  function getFooterDefaultActions(viewLevel, converterContext) {
    var _entitySet$annotation8, _entitySet$annotation9, _entitySet$annotation10, _entitySet$annotation11, _entitySet$annotation12, _entitySet$annotation13, _entitySet$annotation14;

    var entitySet = converterContext.getEntitySet();
    var oStickySessionSupported = entitySet && ((_entitySet$annotation8 = entitySet.annotations) === null || _entitySet$annotation8 === void 0 ? void 0 : (_entitySet$annotation9 = _entitySet$annotation8.Session) === null || _entitySet$annotation9 === void 0 ? void 0 : _entitySet$annotation9.StickySessionSupported),
        //for sticky app
    sEntitySetDraftRoot = entitySet && (((_entitySet$annotation10 = entitySet.annotations.Common) === null || _entitySet$annotation10 === void 0 ? void 0 : (_entitySet$annotation11 = _entitySet$annotation10.DraftRoot) === null || _entitySet$annotation11 === void 0 ? void 0 : _entitySet$annotation11.term) || ((_entitySet$annotation12 = entitySet.annotations) === null || _entitySet$annotation12 === void 0 ? void 0 : (_entitySet$annotation13 = _entitySet$annotation12.Session) === null || _entitySet$annotation13 === void 0 ? void 0 : (_entitySet$annotation14 = _entitySet$annotation13.StickySessionSupported) === null || _entitySet$annotation14 === void 0 ? void 0 : _entitySet$annotation14.term)),
        bConditionSave = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.SaveAction),
        bConditionApply = viewLevel > 1,
        bConditionCancel = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.DiscardAction); // Retrieve all determining actions

    var headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), true); // First add the "Critical" DataFieldForActions

    var footerActions = headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      };
    }); // Then the save action if it exists

    if (bConditionSave) {
      footerActions.push({
        type: ActionType.Primary,
        key: "SaveAction"
      });
    } // Then the apply action if it exists


    if (bConditionApply) {
      footerActions.push({
        type: ActionType.DefaultApply,
        key: "ApplyAction"
      });
    } // Then the non critical DataFieldForActions


    headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      footerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true
      });
    }); // Then the cancel action if it exists

    if (bConditionCancel) {
      footerActions.push({
        type: ActionType.Secondary,
        key: "CancelAction",
        position: {
          placement: Placement.End
        }
      });
    }

    return footerActions;
  }

  _exports.getFooterDefaultActions = getFooterDefaultActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckFuZEZvb3RlckFjdGlvbi50cyJdLCJuYW1lcyI6WyJnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMiLCJlbnRpdHlUeXBlIiwiYkRldGVybWluaW5nIiwiYW5ub3RhdGlvbnMiLCJVSSIsIklkZW50aWZpY2F0aW9uIiwiZmlsdGVyIiwiaWRlbnRpZmljYXRpb25EYXRhRmllbGQiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwiJFR5cGUiLCJEZXRlcm1pbmluZyIsIkFjdGlvblRhcmdldCIsImlzQm91bmQiLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwiZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zIiwiSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMiLCJnZXRIZWFkZXJEZWZhdWx0QWN0aW9ucyIsImNvbnZlcnRlckNvbnRleHQiLCJlbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsIlNlc3Npb24iLCJTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwib0RyYWZ0Um9vdCIsIkNvbW1vbiIsIkRyYWZ0Um9vdCIsIm9FbnRpdHlEZWxldGVSZXN0cmljdGlvbnMiLCJDYXBhYmlsaXRpZXMiLCJEZWxldGVSZXN0cmljdGlvbnMiLCJiVXBkYXRlSGlkZGVuIiwiVXBkYXRlSGlkZGVuIiwib0RhdGFNb2RlbE9iamVjdFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwiaXNQYXJlbnREZWxldGFibGUiLCJpc1BhdGhEZWxldGFibGUiLCJiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlIiwiY29tcGlsZUJpbmRpbmciLCJoZWFkZXJEYXRhRmllbGRGb3JBY3Rpb25zIiwiZ2V0RW50aXR5VHlwZSIsImhlYWRlckFjdGlvbnMiLCJkYXRhRmllbGQiLCJpbmRleE9mIiwiQ3JpdGljYWxpdHkiLCJtYXAiLCJ0eXBlIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImtleSIsIktleUhlbHBlciIsImdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZCIsInZpc2libGUiLCJub3QiLCJlcXVhbCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiaXNOYXZpZ2FibGUiLCJFZGl0QWN0aW9uIiwicHVzaCIsIlByaW1hcnkiLCJEZWxldGFibGUiLCJTZWNvbmRhcnkiLCJwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkIiwiaGVhZGVyRGF0YUZpZWxkRm9ySUJOQWN0aW9ucyIsIm9OYXZpZ2F0aW9uUGFyYW1zIiwic2VtYW50aWNPYmplY3RNYXBwaW5nIiwiTWFwcGluZyIsImdldFNlbWFudGljT2JqZWN0TWFwcGluZyIsIlJlcXVpcmVzQ29udGV4dCIsIkVycm9yIiwiTGFiZWwiLCJJbmxpbmUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJ0ZXh0IiwidG9TdHJpbmciLCJidXR0b25UeXBlIiwiQnV0dG9uVHlwZSIsIkdob3N0IiwiZW5hYmxlZCIsIk5hdmlnYXRpb25BdmFpbGFibGUiLCJ1bmRlZmluZWQiLCJwcmVzcyIsImZuIiwiU2VtYW50aWNPYmplY3QiLCJBY3Rpb24iLCJjdXN0b21EYXRhIiwic2VtYW50aWNPYmplY3QiLCJhY3Rpb24iLCJnZXRIaWRkZW5IZWFkZXJBY3Rpb25zIiwiaGlkZGVuQWN0aW9ucyIsIkRlZmF1bHQiLCJnZXRGb290ZXJEZWZhdWx0QWN0aW9ucyIsInZpZXdMZXZlbCIsInNFbnRpdHlTZXREcmFmdFJvb3QiLCJ0ZXJtIiwiYkNvbmRpdGlvblNhdmUiLCJTYXZlQWN0aW9uIiwiYkNvbmRpdGlvbkFwcGx5IiwiYkNvbmRpdGlvbkNhbmNlbCIsIkRpc2NhcmRBY3Rpb24iLCJmb290ZXJBY3Rpb25zIiwiRGVmYXVsdEFwcGx5IiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJFbmQiXSwibWFw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Q0EsU0FBUyxDQUFFRSxXQUEzQyxNQUFzRSxDQUFDLENBQTlFO0FBQ0EsS0FIRixFQUlFQyxHQUpGLENBSU0sVUFBQUgsU0FBUyxFQUFJO0FBQ2pCNkQsTUFBQUEsYUFBYSxDQUFDMUMsSUFBZCxDQUFtQjtBQUNsQmYsUUFBQUEsSUFBSSxFQUFFQyxVQUFVLENBQUNDLGtCQURDO0FBRWxCQyxRQUFBQSxjQUFjLEVBQUU5QixnQkFBZ0IsQ0FBQytCLCtCQUFqQixDQUFpRFIsU0FBUyxDQUFDUyxrQkFBM0QsQ0FGRTtBQUdsQkMsUUFBQUEsR0FBRyxFQUFFQyxTQUFTLENBQUNDLHdCQUFWLENBQW1DWixTQUFuQyxDQUhhO0FBSWxCaUIsUUFBQUEsV0FBVyxFQUFFO0FBSkssT0FBbkI7QUFNQSxLQVhGLEVBekM0RyxDQXNENUc7O0FBQ0EsUUFBSTBDLGdCQUFKLEVBQXNCO0FBQ3JCRSxNQUFBQSxhQUFhLENBQUMxQyxJQUFkLENBQW1CO0FBQ2xCZixRQUFBQSxJQUFJLEVBQUVDLFVBQVUsQ0FBQ2lCLFNBREM7QUFFbEJaLFFBQUFBLEdBQUcsRUFBRSxjQUZhO0FBR2xCcUQsUUFBQUEsUUFBUSxFQUFFO0FBQUVDLFVBQUFBLFNBQVMsRUFBRUMsU0FBUyxDQUFDQztBQUF2QjtBQUhRLE9BQW5CO0FBS0E7O0FBQ0QsV0FBT0wsYUFBUDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IEVudGl0eVR5cGUgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkFjdGlvbiwgQmFzZUFjdGlvbiwgQnV0dG9uVHlwZSwgZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgRGF0YUZpZWxkRm9yQWN0aW9uVHlwZXMsIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBQbGFjZW1lbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgQ29udmVydGVyQ29udGV4dCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL3RlbXBsYXRlcy9CYXNlQ29udmVydGVyXCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcsIG5vdCwgZXF1YWwsIGZuIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBpc1BhdGhEZWxldGFibGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5cbi8qKlxuICogUmV0cmlldmUgYWxsIHRoZSBkYXRhIGZpZWxkIGZvciBhY3Rpb25zIGZvciB0aGUgaWRlbnRpZmljYXRpb24gYW5ub3RhdGlvblxuICogVGhleSBtdXN0IGJlXG4gKiAtIE5vdCBzdGF0aWNhbGx5IGhpZGRlblxuICogLSBFaXRoZXIgbGlua2VkIHRvIGFuIFVuYm91bmQgYWN0aW9uIG9yIHRvIGFuIGFjdGlvbiB3aGljaCBoYXMgYW4gT3BlcmF0aW9uQXZhaWxhYmxlIG5vdCBzdGF0aWNhbGx5IGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7RW50aXR5VHlwZX0gZW50aXR5VHlwZSB0aGUgY3VycmVudCBlbnRpdHl0eXBlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJEZXRlcm1pbmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgYWN0aW9uIHNob3VsZCBiZSBkZXRlcm1pbmluZ1xuICogQHJldHVybnMge0RhdGFGaWVsZEZvckFjdGlvblR5cGVzW119IGFuIGFycmF5IG9mIGRhdGFmaWVsZCBmb3IgYWN0aW9uIHJlc3BlY3RpbmcgdGhlIGJEZXRlcm1pbmluZyBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JBY3Rpb25zKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGJEZXRlcm1pbmluZzogYm9vbGVhbik6IERhdGFGaWVsZEZvckFjdGlvblR5cGVzW10ge1xuXHRyZXR1cm4gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRpZiAoaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0aWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiICYmXG5cdFx0XHRcdCEhaWRlbnRpZmljYXRpb25EYXRhRmllbGQuRGV0ZXJtaW5pbmcgPT09IGJEZXRlcm1pbmluZyAmJlxuXHRcdFx0XHQoIWlkZW50aWZpY2F0aW9uRGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQgfHxcblx0XHRcdFx0XHRpZGVudGlmaWNhdGlvbkRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCkgIT09IGZhbHNlKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pIHx8IFtdKSBhcyBEYXRhRmllbGRGb3JBY3Rpb25UeXBlc1tdO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGFsbCB0aGUgSUJOIGFjdGlvbnMgZm9yIHRoZSBpZGVudGlmaWNhdGlvbiBhbm5vdGF0aW9uLlxuICogVGhleSBtdXN0IGJlXG4gKiAtIE5vdCBzdGF0aWNhbGx5IGhpZGRlbi5cbiAqIEBwYXJhbSB7RW50aXR5VHlwZX0gZW50aXR5VHlwZSB0aGUgY3VycmVudCBlbnRpdHl0eXBlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJEZXRlcm1pbmluZyB3aGV0aGVyIG9yIG5vdCB0aGUgYWN0aW9uIHNob3VsZCBiZSBkZXRlcm1pbmluZ1xuICogQHJldHVybnMge0RhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW119IGFuIGFycmF5IG9mIGRhdGFmaWVsZCBmb3IgYWN0aW9uIHJlc3BlY3RpbmcgdGhlIGJEZXRlcm1pbmluZyBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGJEZXRlcm1pbmluZzogYm9vbGVhbik6IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW10ge1xuXHRyZXR1cm4gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRpZiAoaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0aWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiICYmXG5cdFx0XHRcdCEhaWRlbnRpZmljYXRpb25EYXRhRmllbGQuRGV0ZXJtaW5pbmcgPT09IGJEZXRlcm1pbmluZ1xuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSkgfHwgW10pIGFzIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW107XG59XG5cbmNvbnN0IElNUE9SVEFOVF9DUklUSUNBTElUSUVTID0gW1xuXHRcIlVJLkNyaXRpY2FsaXR5VHlwZS9WZXJ5UG9zaXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvTmVnYXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvVmVyeU5lZ2F0aXZlXCJcbl07XG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVyRGVmYXVsdEFjdGlvbnMoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IG9TdGlja3lTZXNzaW9uU3VwcG9ydGVkID0gZW50aXR5U2V0ICYmIGVudGl0eVNldC5hbm5vdGF0aW9ucz8uU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCwgLy9mb3Igc3RpY2t5IGFwcFxuXHRcdG9EcmFmdFJvb3QgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zLkNvbW1vbj8uRHJhZnRSb290LFxuXHRcdG9FbnRpdHlEZWxldGVSZXN0cmljdGlvbnMgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkRlbGV0ZVJlc3RyaWN0aW9ucyxcblx0XHRiVXBkYXRlSGlkZGVuID0gZW50aXR5U2V0ICYmIGVudGl0eVNldC5hbm5vdGF0aW9ucy5VST8uVXBkYXRlSGlkZGVuPy52YWx1ZU9mKCk7XG5cdGNvbnN0IG9EYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUob0RhdGFNb2RlbE9iamVjdFBhdGgpLFxuXHRcdGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlKSA6IGlzUGFyZW50RGVsZXRhYmxlO1xuXG5cdGNvbnN0IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIGZhbHNlKTtcblxuXHQvLyBGaXJzdCBhZGQgdGhlIFwiQ3JpdGljYWxcIiBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGNvbnN0IGhlYWRlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPiAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiksIHRydWUpKSksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdC8vIFRoZW4gdGhlIGVkaXQgYWN0aW9uIGlmIGl0IGV4aXN0c1xuXHRpZiAoKG9EcmFmdFJvb3Q/LkVkaXRBY3Rpb24gfHwgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQ/LkVkaXRBY3Rpb24pICYmIGJVcGRhdGVIaWRkZW4gIT09IHRydWUpIHtcblx0XHRoZWFkZXJBY3Rpb25zLnB1c2goeyB0eXBlOiBBY3Rpb25UeXBlLlByaW1hcnksIGtleTogXCJFZGl0QWN0aW9uXCIgfSk7XG5cdH1cblx0Ly8gVGhlbiB0aGUgZGVsZXRlIGFjdGlvbiBpZiB3ZSdyZSBub3Qgc3RhdGljYWxseSBub3QgZGVsZXRhYmxlXG5cdGlmIChcblx0XHQoYlBhcmVudEVudGl0eVNldERlbGV0YWJsZSAmJiBiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHx8XG5cdFx0KG9FbnRpdHlEZWxldGVSZXN0cmljdGlvbnM/LkRlbGV0YWJsZT8udmFsdWVPZigpICE9PSBmYWxzZSAmJiBiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpXG5cdCkge1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuU2Vjb25kYXJ5LCBrZXk6IFwiRGVsZXRlQWN0aW9uXCIsIHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ6IGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgfSk7XG5cdH1cblxuXHRjb25zdCBoZWFkZXJEYXRhRmllbGRGb3JJQk5BY3Rpb25zID0gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBmYWxzZSk7XG5cblx0aGVhZGVyRGF0YUZpZWxkRm9ySUJOQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA9PT0gLTE7XG5cdFx0fSlcblx0XHQubWFwKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRjb25zdCBvTmF2aWdhdGlvblBhcmFtcyA9IHtcblx0XHRcdFx0c2VtYW50aWNPYmplY3RNYXBwaW5nOiBkYXRhRmllbGQuTWFwcGluZyA/IGdldFNlbWFudGljT2JqZWN0TWFwcGluZyhkYXRhRmllbGQuTWFwcGluZykgOiBbXVxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGRhdGFGaWVsZC5SZXF1aXJlc0NvbnRleHQ/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSZXF1aXJlc0NvbnRleHQgcHJvcGVydHkgc2hvdWxkIG5vdCBiZSB0cnVlIGZvciBoZWFkZXIgSUJOIGFjdGlvbiA6IFwiICsgZGF0YUZpZWxkLkxhYmVsKTtcblx0XHRcdH0gZWxzZSBpZiAoZGF0YUZpZWxkLklubGluZT8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIklubGluZSBwcm9wZXJ0eSBzaG91bGQgbm90IGJlIHRydWUgZm9yIGhlYWRlciBJQk4gYWN0aW9uIDogXCIgKyBkYXRhRmllbGQuTGFiZWwpO1xuXHRcdFx0fVxuXHRcdFx0aGVhZGVyQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24sXG5cdFx0XHRcdHRleHQ6IGRhdGFGaWVsZC5MYWJlbD8udG9TdHJpbmcoKSxcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0YnV0dG9uVHlwZTogQnV0dG9uVHlwZS5HaG9zdCxcblx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpKSwgdHJ1ZSkpKSxcblx0XHRcdFx0ZW5hYmxlZDpcblx0XHRcdFx0XHRkYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHQ/IGNvbXBpbGVCaW5kaW5nKGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5OYXZpZ2F0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCkpLCB0cnVlKSlcblx0XHRcdFx0XHRcdDogdHJ1ZSxcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlLFxuXHRcdFx0XHRwcmVzczogY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0Zm4oXCIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5uYXZpZ2F0ZVwiLCBbXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuU2VtYW50aWNPYmplY3QpLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkFjdGlvbiksXG5cdFx0XHRcdFx0XHRvTmF2aWdhdGlvblBhcmFtc1xuXHRcdFx0XHRcdF0pXG5cdFx0XHRcdCksXG5cdFx0XHRcdGN1c3RvbURhdGE6IGNvbXBpbGVCaW5kaW5nKHtcblx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRhY3Rpb246IGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5BY3Rpb24pXG5cdFx0XHRcdH0pXG5cdFx0XHR9IGFzIEFubm90YXRpb25BY3Rpb24pO1xuXHRcdH0pO1xuXHQvLyBGaW5hbGx5IHRoZSBub24gY3JpdGljYWwgRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRoZWFkZXJEYXRhRmllbGRGb3JBY3Rpb25zXG5cdFx0LmZpbHRlcihkYXRhRmllbGQgPT4ge1xuXHRcdFx0cmV0dXJuIElNUE9SVEFOVF9DUklUSUNBTElUSUVTLmluZGV4T2YoZGF0YUZpZWxkPy5Dcml0aWNhbGl0eSBhcyBzdHJpbmcpID09PSAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdGhlYWRlckFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiksIHRydWUpKSksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9IGFzIEFubm90YXRpb25BY3Rpb24pO1xuXHRcdH0pO1xuXG5cdHJldHVybiBoZWFkZXJBY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlkZGVuSGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBoaWRkZW5BY3Rpb25zID0gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRyZXR1cm4gaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWU7XG5cdH0pIHx8IFtdKSBhcyBEYXRhRmllbGRGb3JBY3Rpb25UeXBlc1tdO1xuXHRyZXR1cm4gaGlkZGVuQWN0aW9ucy5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHR9O1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvb3RlckRlZmF1bHRBY3Rpb25zKHZpZXdMZXZlbDogbnVtYmVyLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0Y29uc3Qgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkLCAvL2ZvciBzdGlja3kgYXBwXG5cdFx0c0VudGl0eVNldERyYWZ0Um9vdCA9XG5cdFx0XHRlbnRpdHlTZXQgJiYgKGVudGl0eVNldC5hbm5vdGF0aW9ucy5Db21tb24/LkRyYWZ0Um9vdD8udGVybSB8fCBlbnRpdHlTZXQuYW5ub3RhdGlvbnM/LlNlc3Npb24/LlN0aWNreVNlc3Npb25TdXBwb3J0ZWQ/LnRlcm0pLFxuXHRcdGJDb25kaXRpb25TYXZlID1cblx0XHRcdHNFbnRpdHlTZXREcmFmdFJvb3QgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiIHx8XG5cdFx0XHQob1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgJiYgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQ/LlNhdmVBY3Rpb24pLFxuXHRcdGJDb25kaXRpb25BcHBseSA9IHZpZXdMZXZlbCA+IDEsXG5cdFx0YkNvbmRpdGlvbkNhbmNlbCA9XG5cdFx0XHRzRW50aXR5U2V0RHJhZnRSb290ID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3RcIiB8fFxuXHRcdFx0KG9TdGlja3lTZXNzaW9uU3VwcG9ydGVkICYmIG9TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5EaXNjYXJkQWN0aW9uKTtcblxuXHQvLyBSZXRyaWV2ZSBhbGwgZGV0ZXJtaW5pbmcgYWN0aW9uc1xuXHRjb25zdCBoZWFkZXJEYXRhRmllbGRGb3JBY3Rpb25zID0gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JBY3Rpb25zKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCB0cnVlKTtcblxuXHQvLyBGaXJzdCBhZGQgdGhlIFwiQ3JpdGljYWxcIiBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGNvbnN0IGZvb3RlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPiAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWVcblx0XHRcdH07XG5cdFx0fSk7XG5cblx0Ly8gVGhlbiB0aGUgc2F2ZSBhY3Rpb24gaWYgaXQgZXhpc3RzXG5cdGlmIChiQ29uZGl0aW9uU2F2ZSkge1xuXHRcdGZvb3RlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuUHJpbWFyeSwga2V5OiBcIlNhdmVBY3Rpb25cIiB9KTtcblx0fVxuXG5cdC8vIFRoZW4gdGhlIGFwcGx5IGFjdGlvbiBpZiBpdCBleGlzdHNcblx0aWYgKGJDb25kaXRpb25BcHBseSkge1xuXHRcdGZvb3RlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdEFwcGx5LCBrZXk6IFwiQXBwbHlBY3Rpb25cIiB9KTtcblx0fVxuXG5cdC8vIFRoZW4gdGhlIG5vbiBjcml0aWNhbCBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPT09IC0xO1xuXHRcdH0pXG5cdFx0Lm1hcChkYXRhRmllbGQgPT4ge1xuXHRcdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZVxuXHRcdFx0fSBhcyBBbm5vdGF0aW9uQWN0aW9uKTtcblx0XHR9KTtcblxuXHQvLyBUaGVuIHRoZSBjYW5jZWwgYWN0aW9uIGlmIGl0IGV4aXN0c1xuXHRpZiAoYkNvbmRpdGlvbkNhbmNlbCkge1xuXHRcdGZvb3RlckFjdGlvbnMucHVzaCh7XG5cdFx0XHR0eXBlOiBBY3Rpb25UeXBlLlNlY29uZGFyeSxcblx0XHRcdGtleTogXCJDYW5jZWxBY3Rpb25cIixcblx0XHRcdHBvc2l0aW9uOiB7IHBsYWNlbWVudDogUGxhY2VtZW50LkVuZCB9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGZvb3RlckFjdGlvbnM7XG59XG4iXX0=