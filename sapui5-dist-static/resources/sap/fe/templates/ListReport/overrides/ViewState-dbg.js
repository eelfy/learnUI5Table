sap.ui.define(
	[
		"sap/fe/core/library",
		"sap/fe/navigation/library",
		"sap/fe/core/CommonUtils",
		"sap/ui/fl/apply/api/ControlVariantApplyAPI",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/ui/Device",
		"sap/ui/mdc/enum/ConditionValidated"
	],
	function(CoreLibrary, NavLibrary, CommonUtils, ControlVariantApplyAPI, StateUtil, Device, ConditionValidated) {
		"use strict";

		var NavType = NavLibrary.NavType,
			VariantManagement = CoreLibrary.VariantManagement,
			TemplateContentView = CoreLibrary.TemplateContentView,
			InitialLoadMode = CoreLibrary.InitialLoadMode;

		return {
			applyInitialStateOnly: function() {
				return true;
			},
			onBeforeStateApplied: function(aPromises) {
				var oView = this.getView(),
					oController = oView.getController(),
					oFilterBar = oController._getFilterBarControl(),
					aTables = oController._getTables();

				oFilterBar.setSuspendSelection(true);
				aTables.forEach(function(oTable) {
					aPromises.push(oTable.initialized());
				});
				aPromises.push(oFilterBar.initialized());

				delete this._bSearchTriggered;
			},
			onAfterStateApplied: function() {
				var oView = this.getView(),
					oController = oView.getController();
				oController._getFilterBarControl().setSuspendSelection(false);
			},
			adaptStateControls: function(aStateControls) {
				var oView = this.getView(),
					oController = oView.getController(),
					oViewData = oView.getViewData(),
					bControlVM = oViewData.variantManagement === VariantManagement.Control;

				if (oController._isMultiMode()) {
					aStateControls.push(oController._getMultiModeControl());
				}

				var oFilterBarVM = this._getFilterBarVM(oView);
				if (oFilterBarVM) {
					aStateControls.push(oFilterBarVM);
				}
				oController._getTables().forEach(function(oTable) {
					if (oTable.getQuickFilter()) {
						aStateControls.push(oTable.getQuickFilter().getSelector());
					}
					if (bControlVM) {
						aStateControls.push(oTable.getVariant());
					}
				});

				if (oController._isAlp()) {
					aStateControls.push(oController._getSegmentedButton(TemplateContentView.Chart));
					aStateControls.push(oController._getSegmentedButton(TemplateContentView.Table));
				}
				aStateControls.push(oController._getFilterBarControl());
				aStateControls.push(oView.byId("fe::ListReport"));
			},
			retrieveAdditionalStates: function(mAdditionalStates) {
				var oView = this.getView(),
					oController = oView.getController(),
					bPendingFilter = oView.getBindingContext("internal").getProperty("hasPendingFilters");

				mAdditionalStates.dataLoaded = !bPendingFilter || !!this._bSearchTriggered;
				if (oController._isAlp()) {
					var sAlpContentView = oView.getBindingContext("internal").getProperty("alpContentView");
					mAdditionalStates.alpContentView = sAlpContentView;
				}

				delete this._bSearchTriggered;
			},
			applyAdditionalStates: function(oAdditionalStates) {
				var oView = this.getView(),
					oController = oView.getController(),
					oFilterBar = oController._getFilterBarControl();

				if (oAdditionalStates) {
					// explicit check for boolean values - 'undefined' should not alter the triggered search property
					if (oAdditionalStates.dataLoaded === false) {
						oFilterBar._bSearchTriggered = false;
					} else if (oAdditionalStates.dataLoaded === true) {
						oController._getFilterBarControl().triggerSearch();
						this._bSearchTriggered = true;
					}
					if (oController._isAlp()) {
						var oInternalModelContext = oView.getBindingContext("internal");
						if (!Device.system.desktop && oAdditionalStates.alpContentView == TemplateContentView.Hybrid) {
							oAdditionalStates.alpContentView = TemplateContentView.Chart;
						}
						oInternalModelContext
							.getModel()
							.setProperty(oInternalModelContext.getPath() + "/alpContentView", oAdditionalStates.alpContentView);
					}
				}
			},
			applyNavigationParameters: function(oNavigationParameter) {
				var oView = this.getView(),
					that = this;
				return this._applySelectionVariant(oView, oNavigationParameter).then(function() {
					var oController = oView.getController();
					var oDynamicPage = oView.byId("fe::ListReport");
					var bHeaderExpanded = false;
					var oFilterBarVM = that._getFilterBarVM(oView);
					var oFilterBarControl = oController._getFilterBarControl();
					if (
						oNavigationParameter.navigationType !== NavType.initial ||
						(!oFilterBarVM && oView.getViewData().initialLoad === InitialLoadMode.Enabled) ||
						oController._shouldAutoTriggerSearch(oFilterBarVM)
					) {
						oFilterBarControl.triggerSearch();
					} else {
						bHeaderExpanded = that._isHeaderExpanded(oFilterBarVM);
					}
					that._bSearchTriggered = !bHeaderExpanded;
					oDynamicPage.setHeaderExpanded(bHeaderExpanded);
				});
			},

			/************************************* private helper *****************************************/

			_getFilterBarVM: function(oView) {
				var oViewData = oView.getViewData();
				switch (oViewData.variantManagement) {
					case VariantManagement.Page:
						return oView.byId("fe::PageVariantManagement");
					case VariantManagement.Control:
						return oView.byId(oView.getContent()[0].data("filterBarVariantId"));
					case VariantManagement.None:
						return null;
					default:
						throw new Error("unhandled variant setting: " + oViewData.variantManagement);
				}
			},

			_isHeaderExpanded: function(oVariantManagement) {
				if (!oVariantManagement) {
					return true;
				}
				var aVariants = oVariantManagement.getVariants();
				var oCurrentVariant = aVariants.find(function(oItem) {
					return oItem.key === oVariantManagement.getCurrentVariantKey();
				});
				return !oCurrentVariant.executeOnSelect;
			},

			_applySelectionVariant: function(oView, oNavigationParameter) {
				var oSelectionVariant = oNavigationParameter.selectionVariant,
					oSelectionVariantDefaults = oNavigationParameter.selectionVariantDefaults;
				if (!oSelectionVariant) {
					return Promise.resolve();
				}

				var oConditions = {},
					oMetaModel = oView.getModel().getMetaModel(),
					oViewData = oView.getViewData(),
					sEntitySet = oViewData.entitySet,
					oFilterBar = oView.byId(oView.getContent()[0].data("filterBarId")),
					aMandatoryFilterFields = CommonUtils.getMandatoryFilterFields(oMetaModel, sEntitySet),
					oVariant,
					bRequiresStandardVariant = oNavigationParameter.requiresStandardVariant;

				CommonUtils.addDefaultDisplayCurrency(aMandatoryFilterFields, oSelectionVariant, oSelectionVariantDefaults);
				CommonUtils.addSelectionVariantToConditions(oSelectionVariant, oConditions, oMetaModel, sEntitySet);
				switch (oViewData.variantManagement) {
					case VariantManagement.Page:
						oVariant = oView.byId("fe::PageVariantManagement");
						break;
					case VariantManagement.Control:
						oVariant = oView.byId(oView.getContent()[0].data("filterBarVariantId"));
						break;
					case VariantManagement.None:
					default:
						break;
				}
				return this._activateSelectionVariant(oFilterBar, oConditions, oVariant, bRequiresStandardVariant);
			},
			_activateSelectionVariant: function(oFilterBar, oConditions, oVariant, bRequiresStandardVariant) {
				var that = this,
					oPromise;

				if (oVariant) {
					var oVariantKey = bRequiresStandardVariant ? oVariant.getStandardVariantKey() : oVariant.getDefaultVariantKey();
					if (oVariantKey === null) {
						oVariantKey = oVariant.getId();
					}
					oPromise = ControlVariantApplyAPI.activateVariant({
						element: oVariant,
						variantReference: oVariantKey
					}).then(function() {
						return bRequiresStandardVariant || oVariant.getDefaultVariantKey() === oVariant.getStandardVariantKey();
					});
				} else {
					oPromise = Promise.resolve(true);
				}

				return oPromise.then(function(bClearFilterAndReplaceWithAppState) {
					if (bClearFilterAndReplaceWithAppState) {
						return that._fnClearFilterAndReplaceWithAppState(oFilterBar, oConditions);
					}
				});
			},
			_fnApplyConditions: function(oFilterBar, oConditions) {
				var mFilter = {},
					aItems = [],
					fnAdjustValueHelpCondition = function(oCondition) {
						// in case the condition is meant for a field having a VH, the format required by MDC differs
						oCondition.validated = ConditionValidated.Validated;
						if (oCondition.operator === "Empty") {
							oCondition.operator = "EQ";
							oCondition.values = [""];
						} else if (oCondition.operator === "NotEmpty") {
							oCondition.operator = "NE";
							oCondition.values = [""];
						}
						delete oCondition.isEmpty;
					};
				return oFilterBar.initialized().then(function() {
					oFilterBar
						.getPropertyInfoSet()
						.filter(function(oPropertyInfo) {
							return oPropertyInfo.path !== "$editState" && oPropertyInfo.path !== "$search";
						})
						.forEach(function(oPropertyInfo) {
							if (oPropertyInfo.path in oConditions) {
								mFilter[oPropertyInfo.path] = oConditions[oPropertyInfo.path];
								if (!oPropertyInfo.hiddenFilter) {
									aItems.push({ name: oPropertyInfo.path });
								}
								if (oPropertyInfo.hasValueHelp) {
									mFilter[oPropertyInfo.path].forEach(fnAdjustValueHelpCondition);
								}
							} else {
								mFilter[oPropertyInfo.path] = [];
							}
						});
					return StateUtil.applyExternalState(oFilterBar, { filter: mFilter, items: aItems });
				});
			},
			_fnClearFilterAndReplaceWithAppState: function(oFilterBar, oConditions) {
				return this._fnApplyConditions(oFilterBar, {}).then(this._fnApplyConditions.bind(this, oFilterBar, oConditions));
			}
		};
	}
);
