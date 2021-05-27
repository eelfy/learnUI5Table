/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/library",
		"sap/base/Log",
		"sap/ui/mdc/enum/ConditionValidated",
		"sap/fe/macros/field/FieldRuntime",
		"sap/ui/core/ValueState",
		"sap/fe/macros/table/TableHelper"
	],
	function(JSONModel, CommonHelper, CommonUtils, FELibrary, Log, ConditionValidated, FieldRuntime, ValueState, TableHelper) {
		"use strict";

		var CreationMode = FELibrary.CreationMode;
		/**
		 * Static class used by MDC Table during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableRuntime = {
			displayTableSettings: function(oEvent) {
				/*
				 Temporary solution
				 Wait for mdc Table to provide public api to either get button 'Settings' or fire event on this button
				 */
				var oParent = oEvent.getSource().getParent(),
					oSettingsButton = sap.ui.getCore().byId(oParent.getId() + "-settings");
				CommonHelper.fireButtonPress(oSettingsButton);
			},
			executeConditionalActionShortcut: function(sButtonMatcher, oSource) {
				// Get the button related to keyboard shortcut
				var oParent = oSource.getParent();
				if (sButtonMatcher !== CreationMode.CreationRow) {
					var oButton = oParent.getActions().find(function(oElement) {
						return oElement.getId().endsWith(sButtonMatcher);
					});
					CommonHelper.fireButtonPress(oButton);
				} else {
					var oCreationRow = oParent.getAggregation("creationRow");
					if (oCreationRow && oCreationRow.getApplyEnabled() && oCreationRow.getVisible()) {
						oCreationRow.fireApply();
					}
				}
			},
			setContexts: function(oTable, sDeletablePath, oDraft, sCollection, sNavigationAvailableMap, sActionsMultiselectDisabled) {
				var aActionsMultiselectDisabled = sActionsMultiselectDisabled ? sActionsMultiselectDisabled.split(",") : [];
				var oActionOperationAvailableMap = JSON.parse(sCollection);
				var oNavigationAvailableMap =
					sNavigationAvailableMap && sNavigationAvailableMap !== "undefined" && JSON.parse(sNavigationAvailableMap);
				var aSelectedContexts = oTable.getSelectedContexts();
				var isDeletable = false;
				var aDeletableContexts = [];
				var aUnsavedContexts = [];
				var aLockedContexts = [];
				// oDynamicActions are bound actions that are available according to some property
				// in each item
				var oDynamicActions = {};
				var oIBN = {};
				var oLockedAndUnsavedContexts = {};
				var oModelObject;
				var oInternalModelContext = oTable.getBindingContext("internal");

				oLockedAndUnsavedContexts.aUnsavedContexts = [];
				oLockedAndUnsavedContexts.aLockedContexts = [];

				oInternalModelContext.setProperty("", {
					selectedContexts: aSelectedContexts,
					numberOfSelectedContexts: aSelectedContexts.length,
					dynamicActions: oDynamicActions,
					ibn: oIBN,
					deleteEnabled: true,
					deletableContexts: [],
					unSavedContexts: [],
					lockedContexts: []
				});

				for (var i = 0; i < aSelectedContexts.length; i++) {
					var oSelectedContext = aSelectedContexts[i];
					var oContextData = oSelectedContext.getObject();
					for (var key in oContextData) {
						if (key.indexOf("#") === 0) {
							var sActionPath = key;
							sActionPath = sActionPath.substring(1, sActionPath.length);
							oModelObject = oInternalModelContext.getObject();
							oModelObject.dynamicActions[sActionPath] = { enabled: true };
							oInternalModelContext.setProperty("", oModelObject);
						}
					}
					oModelObject = oInternalModelContext.getObject();
					if (sDeletablePath != "undefined") {
						if (oSelectedContext && oSelectedContext.getProperty(sDeletablePath)) {
							if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
								oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
							} else {
								aDeletableContexts.push(oSelectedContext);
								oLockedAndUnsavedContexts.isDeletable = true;
							}
						}
						oModelObject["deleteEnabled"] = oLockedAndUnsavedContexts.isDeletable;
					} else if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
						oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
					} else {
						aDeletableContexts.push(oSelectedContext);
					}
				}
				function getUnsavedAndLockedContexts(oContextData, oSelectedContext) {
					if (oContextData.DraftAdministrativeData.InProcessByUser) {
						aLockedContexts.push(oSelectedContext);
					} else {
						aUnsavedContexts.push(oSelectedContext);
						isDeletable = true;
					}
					return {
						aLockedContexts: aLockedContexts,
						aUnsavedContexts: aUnsavedContexts,
						isDeletable: isDeletable
					};
				}
				CommonUtils.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts);
				if (!oTable.data("enableAnalytics")) {
					TableHelper.setIBNEnablement(oInternalModelContext, oNavigationAvailableMap, aSelectedContexts);
				}

				if (aSelectedContexts.length > 1) {
					this.disableAction(aActionsMultiselectDisabled, oDynamicActions);
				}

				oModelObject["deletableContexts"] = aDeletableContexts;
				oModelObject["unSavedContexts"] = oLockedAndUnsavedContexts.aUnsavedContexts;
				oModelObject["lockedContexts"] = oLockedAndUnsavedContexts.aLockedContexts;
				oModelObject["controlId"] = oTable.getId();
				oInternalModelContext.setProperty("", oModelObject);
			},
			disableAction: function(aActionsMultiselectDisabled, oDynamicActions) {
				aActionsMultiselectDisabled.forEach(function(sAction) {
					oDynamicActions[sAction] = { bEnabled: false };
				});
			},
			onFieldChangeInCreationRow: function(oController, oEvent, sNavigationPath) {
				// CREATION ROW CASE
				var oSourceField = oEvent.getSource();
				if (oSourceField.isA("sap.fe.macros.FieldAPI")) {
					oSourceField = oSourceField.getContent();
				}

				if (oSourceField.isA("sap.fe.core.controls.FieldWrapper") && oSourceField.getEditMode() === "Editable") {
					oSourceField = oSourceField.getContentEdit()[0];
				}

				var sFieldId = oSourceField.getId();
				var bIsMDCFIeld = oSourceField.isA("sap.ui.mdc.Field");
				var oInternalModelContext = oSourceField.getBindingContext("internal");

				var mFieldValidity = oInternalModelContext.getProperty("creationRowFieldValidity"),
					mNewFieldValidity = Object.assign({}, mFieldValidity),
					bIsValid = oEvent.getParameter("isValid"),
					oFieldValue;
				if (bIsMDCFIeld) {
					if (bIsValid === undefined) {
						if (oSourceField.getMaxConditions() === 1) {
							bIsValid =
								oSourceField.getConditions()[0] &&
								oSourceField.getConditions()[0].validated === ConditionValidated.Validated;
						}
						if (oSourceField.getValue() === "" && !oSourceField.getProperty("required")) {
							bIsValid = true;
						}
					}

					oFieldValue = oSourceField.getValue();
					mNewFieldValidity[sFieldId] = {
						fieldValue: oFieldValue,
						validity: !!bIsValid
					};
					oInternalModelContext.setProperty("creationRowFieldValidity", mNewFieldValidity);
				} else {
					var oValue = oSourceField.getBinding("value") || oEvent.getBinding("selected");
					mNewFieldValidity[sFieldId] = {
						fieldValue: oValue.getValue(),
						validity: oValue.getDataState() ? oValue.getDataState().getMessages().length === 0 : true
					};
					oInternalModelContext.setProperty("creationRowFieldValidity", mNewFieldValidity);
				}
			},
			getVBoxVisibility: function() {
				var aItems = this.getItems();
				var bLastElementFound = false;
				for (var index = aItems.length - 1; index >= 0; index--) {
					if (!bLastElementFound) {
						if (arguments[index] !== true) {
							bLastElementFound = true;
							if (CommonHelper._isRatingIndicator(aItems[index])) {
								CommonHelper._updateStyleClassForRatingIndicator(aItems[index], true);
							} else {
								aItems[index].removeStyleClass("sapUiTinyMarginBottom");
							}
						}
					} else {
						if (CommonHelper._isRatingIndicator(aItems[index])) {
							CommonHelper._updateStyleClassForRatingIndicator(aItems[index], false);
						} else {
							aItems[index].addStyleClass("sapUiTinyMarginBottom");
						}
					}
				}
				return true;
			}
		};

		return TableRuntime;
	},
	/* bExport= */ true
);
