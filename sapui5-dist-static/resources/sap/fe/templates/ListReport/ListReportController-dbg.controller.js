/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/fe/core/controllerextensions/SideEffects",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/fe/macros/field/FieldRuntime",
		"sap/fe/core/actions/messageHandling",
		"sap/base/Log",
		"sap/base/util/ObjectPath",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/CommonUtils",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/fe/macros/table/Utils",
		"sap/fe/macros/ResourceModel",
		"sap/fe/core/controllerextensions/InternalRouting",
		"sap/ui/Device",
		"sap/fe/core/controllerextensions/IntentBasedNavigation",
		"./overrides/IntentBasedNavigation",
		"sap/fe/core/controllerextensions/InternalIntentBasedNavigation",
		"sap/fe/macros/chart/ChartRuntime",
		"sap/fe/templates/controls/Share/ShareUtils",
		"sap/base/util/merge",
		"sap/fe/templates/ListReport/ExtensionAPI",
		"sap/fe/macros/filter/FilterUtils",
		"sap/fe/macros/chart/ChartUtils",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/controllerextensions/ViewState",
		"./overrides/ViewState",
		"sap/fe/templates/RootContainer/overrides/EditFlow",
		"sap/fe/core/helpers/EditState",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/library",
		"sap/fe/core/helpers/SemanticDateOperators"
	],
	function(
		PageController,
		SideEffects,
		EditFlow,
		FieldRuntime,
		messageHandling,
		Log,
		ObjectPath,
		SelectionVariant,
		CommonUtils,
		StateUtil,
		TableUtils,
		ResourceModel,
		InternalRouting,
		Device,
		IntentBasedNavigation,
		IntentBasedNavigationOverride,
		InternalIntentBasedNavigation,
		ChartRuntime,
		ShareUtils,
		merge,
		ExtensionAPI,
		FilterUtils,
		ChartUtils,
		OverrideExecution,
		ViewState,
		ViewStateOverrides,
		EditFlowOverrides,
		EditState,
		JSONModel,
		CoreLibrary,
		SemanticDateOperators
	) {
		"use strict";
		var TemplateContentView = CoreLibrary.TemplateContentView,
			InitialLoadMode = CoreLibrary.InitialLoadMode;

		return PageController.extend("sap.fe.templates.ListReport.ListReportController", {
			metadata: {
				methods: {
					getExtensionAPI: {
						"public": true,
						"final": true
					},
					onPageReady: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					}
				}
			},
			_routing: InternalRouting.override({
				onAfterBinding: function(oContext, mParameters) {
					this.getView()
						.getController()
						._onAfterBinding(oContext, mParameters);
				}
			}),
			_intentBasedNavigation: InternalIntentBasedNavigation.override({
				getEntitySet: function() {
					return this.base.getCurrentEntitySet();
				}
			}),
			sideEffects: SideEffects,

			intentBasedNavigation: IntentBasedNavigation.override(IntentBasedNavigationOverride),
			editFlow: EditFlow.override(EditFlowOverrides),
			viewState: ViewState.override(ViewStateOverrides),

			getExtensionAPI: function() {
				if (!this.extensionAPI) {
					this.extensionAPI = new ExtensionAPI(this);
				}
				return this.extensionAPI;
			},

			// TODO: get rid of this
			// it's currently needed to show the transient messages after the table request fails
			// we assume that the table should show those messages in the future
			messageHandling: messageHandling,

			onInit: function() {
				PageController.prototype.onInit.apply(this);
				var that = this;
				var aTables = this._getTables();
				var oInternalModelContext = this.getView().getBindingContext("internal");
				if (that._isMultiMode()) {
					var oMultiModeTab = that._getMultiModeControl();
					oInternalModelContext.setProperty("tabs", {
						selected: oMultiModeTab.getSelectedKey() || oMultiModeTab.getItems()[0].getKey()
					});
					aTables.forEach(function(oTable) {
						var oUpdateCounts = function() {
							that._updateCounts();
						};
						TableUtils.addEventToBindingInfo(oTable, "dataRequested", oUpdateCounts);
					});
				}

				oInternalModelContext.setProperty("hasPendingFilters", true);
				oInternalModelContext.setProperty("appliedFilters", "");

				if (this._isAlp()) {
					var alpContentView = TemplateContentView.Hybrid;
					if (!Device.system.desktop) {
						alpContentView = TemplateContentView.Chart;
					}
					oInternalModelContext.setProperty("alpContentView", alpContentView);
				}

				// Store conditions from filter bar
				// this is later used before navigation to get conditions applied on the filter bar
				this.filterBarConditions = {};

				// As AppStateHandler.applyAppState triggers a navigation we want to make sure it will
				// happen after the routeMatch event has been processed (otherwise the router gets broken)
				this.getAppComponent()
					.getRouterProxy()
					.waitForRouteMatchBeforeNavigation();

				this._updateMultiTableHiddenStatus();

				FilterUtils.attachConditionHandling(this._getFilterBarControl());
			},
			onExit: function() {
				FilterUtils.detachConditionHandling(this._getFilterBarControl());

				delete this._sEntitySet;
				delete this.filterBarConditions;
				delete this._oListReportControl;
				delete this._bMultiMode;
				this.extensionAPI && this.extensionAPI.destroy();
				delete this.extensionAPI;
			},
			_onBeforeExport: function(oEvent) {
				var oTable = oEvent.getSource();
				TableUtils.onBeforeExport(oEvent, oTable);
			},
			_onAfterBinding: function() {
				var aTables = this._getTables();
				var that = this;
				if (EditState.isEditStateDirty()) {
					var oTableBinding = this._getTableBinding();
					if (!this.sUpdateTimer) {
						this.sUpdateTimer = setTimeout(function() {
							if (oTableBinding) {
								oTableBinding.refresh();
							}
							delete that.sUpdateTimer;
						}, 0);
					}
					EditState.setEditStateProcessed();
				}
				var aIBNActions = [];
				aTables.forEach(function(oTable) {
					aIBNActions = CommonUtils.getIBNActions(oTable, aIBNActions);
					TableUtils.getSemanticTargetsFromTable(that, oTable);
				});
				CommonUtils.updateDataFieldForIBNButtonsVisibility(aIBNActions, this.getView());

				this.getAppComponent()
					.getAppStateHandler()
					.applyAppState();
			},
			onAfterRendering: function(oEvent) {
				var that = this;
				this.getView()
					.getModel("sap.fe.i18n")
					.getResourceBundle()
					.then(function(response) {
						that.oResourceBundle = response;
					})
					.catch(function(oError) {
						Log.error("Error while retrieving the resource bundle", oError);
					});
			},
			onPageReady: function(mParameters) {
				var oLastFocusedControl = mParameters.lastFocusedControl;
				var oView = this.getView();
				// set the focus to the first action button, or to the first editable input if in editable mode
				if (oLastFocusedControl && oLastFocusedControl.controlId && oLastFocusedControl.focusInfo) {
					var oFocusControl = oView.byId(oLastFocusedControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(oLastFocusedControl.focusInfo);
					}
				}
			},
			getCurrentEntitySet: function() {
				if (!this._sEntitySet) {
					var oTable = this._getCurrentTable();
					this._sEntitySet = oTable.data("targetCollectionName").slice(1);
				}
				return this._sEntitySet;
			},
			/**
			 * Scroll the Tables to the Row with the sPath.
			 *
			 * @function
			 * @name sap.fe.templates.ListReport.ListReportController.controller#_scrollTablesToRow
			 * @param {string} sRowPath 'sPath of the table row'
			 *
			 */
			_scrollTablesToRow: function(sRowPath) {
				var aTables, oTable, oTableRow, oTableRowBinding;
				if (this._getTables && this._getTables().length > 0) {
					aTables = this._getTables();
					for (var i = 0; i < aTables.length; i++) {
						oTable = aTables[i];
						oTableRowBinding = oTable.getRowBinding();
						if (oTableRowBinding) {
							var oTableRowBindingContexts;
							switch (oTable.data().tableType) {
								case "GridTable":
									oTableRowBindingContexts = oTableRowBinding.getContexts(0);
									break;
								case "ResponsiveTable":
									oTableRowBindingContexts = oTableRowBinding.getCurrentContexts();
									break;
								default:
							}
							oTableRow = oTableRowBindingContexts.find(function(item) {
								return item && item.getPath().indexOf(sRowPath) !== -1;
							});
						}
						if (oTableRow) {
							var iPos = oTableRow.iIndex;
							oTable.scrollToIndex(iPos);
						}
					}
				}
			},
			_getPageTitleInformation: function() {
				var that = this;
				return new Promise(function(resolve, reject) {
					var oTitleInfo = { title: "", subtitle: "", intent: "", icon: "" };
					oTitleInfo.title = that
						.getView()
						.getContent()[0]
						.data().ListReportTitle;
					oTitleInfo.subtitle = that
						.getView()
						.getContent()[0]
						.data().ListReportSubtitle;
					resolve(oTitleInfo);
				});
			},
			_getFilterBarControl: function() {
				return this.getView().byId(this._getFilterBarControlId());
			},
			_getSegmentedButton: function(sControl) {
				return this.getView().byId(this._getSegmentedButtonId(sControl));
			},
			_getSegmentedButtonId: function(sControl) {
				if (sControl === "Chart") {
					return this.getChartControl().data("segmentedButtonId");
				} else {
					return this._getCurrentTable().data("segmentedButtonId");
				}
			},
			_getFilterBarControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("filterBarId");
			},
			_getChartControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("singleChartId");
			},

			getChartControl: function() {
				return this.getView().byId(this._getChartControlId());
			},
			_getMultiModeControl: function() {
				return this.getView().byId("fe::TabMultipleMode");
			},
			_getTableControlId: function() {
				return this.getView()
					.getContent()[0]
					.data("singleTableId");
			},
			_getCurrentTable: function() {
				if (!this._oListReportControl) {
					var oMultiModeTab = this._getMultiModeControl();
					if (oMultiModeTab) {
						this._oListReportControl = this.getView().byId(
							oMultiModeTab.getSelectedKey() || oMultiModeTab.getItems()[0].getKey()
						);
					} else {
						this._oListReportControl = this.getView().byId(this._getTableControlId());
					}
				}
				return this._oListReportControl;
			},
			_getTableBinding: function(sTableId) {
				var oTableControl = sTableId ? this.getView().byId(sTableId) : this._getCurrentTable(),
					oBinding = oTableControl && oTableControl._getRowBinding();

				return oBinding;
			},
			_getTables: function() {
				var that = this;
				if (this._isMultiMode()) {
					var aTables = [];
					var oTabMultiMode = this._getMultiModeControl();
					oTabMultiMode.getItems().forEach(function(oItem) {
						var oTable = that.getView().byId(oItem.getKey());
						if (oTable) {
							aTables.push(oTable);
						}
					});
					return aTables;
				}
				return [this._getCurrentTable()];
			},
			/**
			 * Method to merge selected contexts and filters.
			 *
			 * @param {object|Array} aContexts Array or single Context
			 * @param {object} filterBarConditions FilterBar conditions
			 * @returns {object} Selection Variant Object
			 */
			_getMergedContext: function(aContexts, filterBarConditions) {
				var oFilterBarSV, aAttributes;
				oFilterBarSV = CommonUtils.addExternalStateFiltersToSelectionVariant(new SelectionVariant(), filterBarConditions);
				// Get single from array if necessary
				if (aContexts && aContexts.length) {
					var oMetaModel = this.getView()
						.getModel()
						.getMetaModel();

					aAttributes = aContexts.map(function(oC) {
						return {
							contextData: oC.getObject(),
							entitySet: oMetaModel.getMetaPath(oC.getPath()).replace(/^\/*/, "")
						};
					});
					aAttributes = CommonUtils.removeSensitiveData(aAttributes, oMetaModel);
				}
				return {
					selectionVariant: oFilterBarSV,
					attributes: aAttributes
				};
			},
			/**
			 * Method to know if ListReport is configured with Multiple Table mode.
			 *
			 * @function
			 * @name _isMultiMode
			 * @returns {boolean} Is Multiple Table mode set?
			 */
			_isMultiMode: function() {
				if (!this._oListReportControl) {
					this._bMultiMode = !!this._getMultiModeControl();
				}
				return this._bMultiMode;
			},
			/**
			 * Method to know if ListReport is configured with Multiple EntitySets.
			 *
			 * @function
			 * @name _isMultiEntitySets
			 * @returns {boolean} Is Multiple EntitySets configuration?
			 */
			_isMultiEntitySets: function() {
				return (
					this.getView()
						.getContent()[0]
						.data("isMultiEntitySets") === "true"
				);
			},
			_isAlp: function() {
				return (
					this.getView()
						.getContent()[0]
						.data("isAlp") === "true"
				);
			},
			_setShareModel: function() {
				// TODO: deactivated for now - currently there is no _templPriv anymore, to be discussed
				// this method is currently not called anymore from the init method

				var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
				//var oManifest = this.getOwnerComponent().getAppComponent().getMetadata().getManifestEntry("sap.ui");
				//var sBookmarkIcon = (oManifest && oManifest.icons && oManifest.icons.icon) || "";

				//shareModel: Holds all the sharing relevant information and info used in XML view
				var oShareInfo = {
					bookmarkTitle: document.title, //To name the bookmark according to the app title.
					bookmarkCustomUrl: function() {
						var sHash = window.hasher.getHash();
						return sHash ? "#" + sHash : window.location.href;
					},
					/*
						To be activated once the FLP shows the count - see comment above
						bookmarkServiceUrl: function() {
							//var oTable = oTable.getInnerTable(); oTable is already the sap.fe table (but not the inner one)
							// we should use table.getListBindingInfo instead of the binding
							var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");
							return oBinding ? fnGetDownloadUrl(oBinding) : "";
						},*/
					isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive()
				};

				var oTemplatePrivateModel = this.getOwnerComponent().getModel("_templPriv");
				oTemplatePrivateModel.setProperty("/listReport/share", oShareInfo);
			},

			/**
			 * Hidden tables must be marked as hidden to avoid sending
			 * requests when FilterBar is changed or LR is initialized
			 * Best workflow would be to suspend table binding but
			 * if the user switch quickly between tabs the batch response of previous
			 * is recevied when previous tab is already disabled (binding is suspended) and
			 * generates error.
			 * A temporary solution (if we find better workflow) is to set a customData and don't trigger
			 * rebindTable if this customData is set to true.
			 */
			_updateMultiTableHiddenStatus: function() {
				var oDisplayedTable = this._getCurrentTable();
				if (this._isMultiMode() && oDisplayedTable) {
					var sDisplayTableId = oDisplayedTable.getId();
					var aTables = this._getTables();
					aTables.forEach(function(oTable) {
						var sTableId = oTable.getId();
						oTable.data("tableHidden", sTableId !== sDisplayTableId);
					});
				}
			},
			/**
			 * Method to update Page local UI Model with Filter Bar not applicable fields (specific to Multi Tables scenario).
			 *
			 * @param {sap.ui.model.context} oInternalModelContext Internal Model Context
			 * @param {sap.ui.mdc.FilterBar} oFilterBar MDC FilterBar
			 */
			_updateMultiNotApplicableFields: function(oInternalModelContext, oFilterBar) {
				var mCache = {};
				var ignoredFields = {},
					aTables = this._getTables();
				aTables.forEach(function(oTable) {
					var sTableEntityPath = oTable.data("targetCollectionName"),
						sTableEntitySet = sTableEntityPath.slice(1),
						sTabId = oTable
							.getParent()
							.getParent()
							.getKey(),
						sCacheKey = sTableEntitySet + (oTable.data("enableAnalytics") === "true" ? "Analytical" : "Regular");
					if (!mCache[sCacheKey]) {
						mCache[sCacheKey] = FilterUtils.getNotApplicableFiltersForTable(oFilterBar, oTable);
					}
					ignoredFields[sTabId] = mCache[sCacheKey];
				});
				oInternalModelContext.setProperty("tabs/ignoredFields", ignoredFields);
			},
			_updateTableControl: function() {
				this._sEntitySet = undefined;
				this._oListReportControl = undefined;
				this._getCurrentTable();
			},
			_updateCounts: function() {
				this._updateMutliModeCounts();
			},
			_updateMutliModeCounts: function() {
				var that = this;
				var aBindingPromises = [];
				var oMutliModeControl = this._getMultiModeControl();
				if (oMutliModeControl && oMutliModeControl.data("showCounts") === "true") {
					var oDisplayedTable = this._getCurrentTable();
					var sDisplayedTableId = oDisplayedTable.getId();
					var aCompliantTabs = [];
					var aItems = oMutliModeControl.getItems();
					aItems.forEach(function(oItem) {
						var oTable = that.getView().byId(oItem.getKey());
						if (oTable && (oItem.data("outdatedCounts") || oTable.getId() === sDisplayedTableId)) {
							aCompliantTabs.push({
								table: oTable,
								item: oItem
							});
						}
					});

					aBindingPromises = aCompliantTabs.map(function(mTab) {
						mTab.item.setCount("...");
						var oTable = mTab.table;
						var oFilterInfos = TableUtils.getFiltersInfoforSV(oTable, mTab.item.data("selectionVariant"));
						return TableUtils.getListBindingForCount(oTable, that.getView().getBindingContext(), {
							batchGroupId: oTable.getId() === sDisplayedTableId ? oTable.data("batchGroupId") : "$auto",
							additionalFilters: oFilterInfos.filters
						});
					});

					Promise.all(aBindingPromises)
						.then(function(aCounts) {
							for (var k in aCounts) {
								var oItem = aCompliantTabs[k].item;
								oItem.setCount(TableUtils.getCountFormatted(aCounts[k]));
								oItem.data("outdatedCounts", false);
							}
						})
						.catch(function(oError) {
							Log.error("Error while retrieving the values for the icon tab bar", oError);
						});
				}
			},
			_shouldAutoTriggerSearch: function(oVM) {
				if (
					this.getView().getViewData().initialLoad === InitialLoadMode.Auto &&
					(!oVM || oVM.getStandardVariantKey() === oVM.getCurrentVariantKey())
				) {
					var oFilterBar = this._getFilterBarControl(),
						oConditions = oFilterBar.getConditions();
					for (var sKey in oConditions) {
						// ignore filters starting with $ (e.g. $search, $editState)
						if (!sKey.startsWith("$") && Array.isArray(oConditions[sKey]) && oConditions[sKey].length) {
							return true;
						}
					}
				}

				return false;
			},
			_updateTable: function(oTable) {
				if (!oTable.isTableBound() || this.hasPendingChartChanges) {
					oTable.rebindTable();
					this.hasPendingChartChanges = false;
				}
			},
			_updateChart: function(oChart) {
				if (!oChart.isInnerChartBound() || this.hasPendingTableChanges) {
					oChart.getControlDelegate().rebindChart(oChart, oChart.getBindingInfo("data"));
					this.hasPendingTableChanges = false;
				}
			},
			handlers: {
				/**
				 * Handles the errors from any table.
				 *
				 * @function
				 * @name handleErrorOfTable
				 * @param {object} oEvent Event object
				 */
				handleErrorOfTable: function(oEvent) {
					if (oEvent.getParameter("error")) {
						// show the unbound messages but with a timeout as the messages are otherwise not yet in the message model
						setTimeout(messageHandling.showUnboundMessages, 0);
					}
				},

				onShareListReportActionButtonPress: function(oEvent, oController, bUseSemanticDateRange) {
					var oControl = oController.getView().byId("fe::Share");
					var oFilterBar = oController.getView().byId(
						oController
							.getView()
							.getContent()[0]
							.data("filterBarId")
					);
					var oConditions = oFilterBar.getFilterConditions();
					var bServiceUrlAllowed = bUseSemanticDateRange && SemanticDateOperators.hasSemanticDateOperations(oConditions);
					if (oControl && (oControl.getVisible() || (oControl.getEnabled && oControl.getEnabled()))) {
						ShareUtils.onShareActionButtonPressImpl(oControl, oController, null, bServiceUrlAllowed);
					}
				},
				onTabMultiModeChange: function(oEvent) {
					this._updateTableControl();
					this._updateMultiTableHiddenStatus();
					var oFilterBar = this._getFilterBarControl();
					var oInternalModelContext = this.getView().getBindingContext("internal");
					var oDisplayedTable = this._getCurrentTable();
					oInternalModelContext.setProperty("tabs/selected", this._getMultiModeControl().getSelectedKey());
					if (
						oFilterBar &&
						oInternalModelContext.getProperty("hasPendingFilters") !== true && // No pending filters into FitlerBar
						(!oDisplayedTable.getRowBinding() || // first time the tab/table is displayed
							oDisplayedTable.data("outdatedRows") === true) // Search has been triggered on a different tab
					) {
						oDisplayedTable.rebindTable();
						oDisplayedTable.data("outdatedRows", false);
					}
					this.getExtensionAPI().updateAppState();
				},
				onFiltersChanged: function(oEvent) {
					var oFilterBar = oEvent.getSource(),
						oInternalModelContext = this.getView().getBindingContext("internal");

					oInternalModelContext.setProperty("appliedFilters", oFilterBar.getAssignedFiltersText().filtersText);
					oInternalModelContext.setProperty("hasPendingFilters", true);
					if (oEvent.getParameter("conditionsBased")) {
						this.getExtensionAPI().updateAppState();
					}
				},
				onVariantSelected: function(oEvent) {
					var that = this,
						oVM = oEvent.getSource();
					// setTimeout cause the variant needs to be applied before judging the auto search or updating the app state
					setTimeout(function() {
						if (that._shouldAutoTriggerSearch(oVM)) {
							// the app state will be updated via onSearch handler
							return that._getFilterBarControl().triggerSearch();
						} else {
							that.getExtensionAPI().updateAppState();
						}
					}, 0);
				},
				onVariantSaved: function(oEvent) {
					var that = this;
					//TODO: Should remove this setTimeOut once Variant Management provides an api to fetch the current variant key on save!!!
					setTimeout(function() {
						that.getExtensionAPI().updateAppState();
					}, 1000);
				},
				onSearch: function(oEvent) {
					var that = this;
					var sDisplayedTableId = this._getCurrentTable().getId();
					var oFilterBar = oEvent.getSource();
					var oInternalModelContext = this.getView().getBindingContext("internal");
					var oMdcChart = this.getChartControl();

					oInternalModelContext.setProperty("hasPendingFilters", false);
					if (this._isMultiMode()) {
						var aTables = this._getTables();
						var oMultiModeControl = this._getMultiModeControl();
						if (oMultiModeControl && oMultiModeControl.data("showCounts") === "true") {
							var aItems = oMultiModeControl.getItems();
							aItems.forEach(function(oItem) {
								oItem.data("outdatedCounts", true);
							});
						}
						this._updateMultiNotApplicableFields(oInternalModelContext, oFilterBar);
						aTables.forEach(function(oTable) {
							oTable.data("outdatedRows", oTable.getId() !== sDisplayedTableId);
						});
					}
					if (oMdcChart) {
						// disable bound actions TODO: this clears everything for the chart?
						oMdcChart.getBindingContext("internal").setProperty("", {});

						var oPageInternalModelContext = oMdcChart.getBindingContext("pageInternal");
						var sTemplateContentView = oPageInternalModelContext.getProperty(
							oPageInternalModelContext.getPath() + "/alpContentView"
						);
						if (sTemplateContentView === TemplateContentView.Chart) {
							this.hasPendingChartChanges = true;
						}
						if (sTemplateContentView === TemplateContentView.Table) {
							this.hasPendingTableChanges = true;
						}
					}
					// store filter bar conditions to use later while navigation
					StateUtil.retrieveExternalState(oFilterBar)
						.then(function(oExternalState) {
							that.filterBarConditions = oExternalState.filter;
						})
						.catch(function(oError) {
							Log.error("Error while retrieving the external state", oError);
						});
					if (this.getView().getViewData().liveMode === false) {
						this.getExtensionAPI().updateAppState();
					}
				},
				/**
				 * Triggers an outbound navigation on Chevron Press.
				 *
				 * @param {object} oController
				 * @param {string} sOutboundTarget name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} oContext that contain the data for the target app
				 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
				 * @ui5-restricted
				 * @final
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext) {
					// TODO: remove this to directly use the intent based navigation controller in the macro.
					var oOutbounds = oController
							.getAppComponent()
							.getRoutingService()
							.getOutbounds(),
						oDisplayOutbound = oOutbounds[sOutboundTarget];
					if (oDisplayOutbound && oDisplayOutbound.semanticObject && oDisplayOutbound.action) {
						oContext = oContext && oContext.isA && oContext.isA("sap.ui.model.odata.v4.Context") ? [oContext] : oContext;
						oController._intentBasedNavigation.navigate(oDisplayOutbound.semanticObject, oDisplayOutbound.action, {
							navigationContexts: oContext
						});

						//TODO: check why returning a promise is required
						return Promise.resolve();
					} else {
						throw new Error("outbound target " + sOutboundTarget + " not found in cross navigation definition of manifest");
					}
				},
				onChartSelectionChanged: function(oEvent) {
					var oMdcChart = oEvent.getSource(),
						oTable = this._getCurrentTable(),
						oDataContext = oEvent.getParameter("dataContext"),
						oInternalModelContext = this.getView().getBindingContext("internal");
					if (oDataContext && oDataContext.data) {
						// update action buttons enablement / disablement
						ChartRuntime.fnUpdateChart(oEvent);
						// update selections on selection or deselection
						ChartUtils.setChartFilters(oMdcChart);
					}
					var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
					if (sTemplateContentView === TemplateContentView.Chart) {
						this.hasPendingChartChanges = true;
					} else {
						oTable && oTable.rebindTable();
						this.hasPendingChartChanges = false;
					}
				},
				onSegmentedButtonPressed: function(oEvent) {
					var sSelectedKey = oEvent.mParameters.key ? oEvent.mParameters.key : null;
					var oInternalModelContext = this.getView().getBindingContext("internal");
					oInternalModelContext.setProperty("alpContentView", sSelectedKey);
					var oChart = this.getChartControl();
					var oTable = this._getCurrentTable();
					switch (sSelectedKey) {
						case TemplateContentView.Table:
							this._updateTable(oTable);
							break;
						case TemplateContentView.Chart:
							this._updateChart(oChart);
							break;
						case TemplateContentView.Hybrid:
							this._updateTable(oTable);
							this._updateChart(oChart);
							break;
						default:
							break;
					}
					this.getExtensionAPI().updateAppState();
				}
			},
			formatters: {
				/**
				 * Method to set Message text on multi EntitySet scenario when FitlerBar fields need to be ingored.
				 *
				 * @param {Array} aIgnoredFields Array of ignored filterBar for the current Tab (Multi EntitySet scenario)
				 * @param {string} sTabTitle Tab Title
				 * @returns {string} Message Text
				 */
				setTabMessageStrip: function(aIgnoredFields, sTabTitle) {
					var sText = "";
					if (Array.isArray(aIgnoredFields) && aIgnoredFields.length > 0 && sTabTitle) {
						var oFilterBar = this._getFilterBarControl(),
							sFilterBarEntityPath = oFilterBar.data("entityType"),
							oMetaModel = this.getView()
								.getModel()
								.getMetaModel(),
							oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
							aIgnoredLabels = aIgnoredFields.map(function(sProperty) {
								if (sProperty === "$search") {
									var oMacroResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
									return oMacroResourceBundle ? oMacroResourceBundle.getText("M_FILTERBAR_SEARCH") : "";
								}
								return oMetaModel.getObject(sFilterBarEntityPath + sProperty + "@com.sap.vocabularies.Common.v1.Label");
							});
						if (oResourceBundle) {
							var sRessource =
								"C_LR_MULTITABLES_" +
								(aIgnoredLabels.length === 1 ? "SINGLE" : "MULTI") +
								"_IGNORED_FILTER_" +
								(Device.system.desktop ? "LARGE" : "SMALL");
							sText = oResourceBundle.getText(sRessource, [aIgnoredLabels.join(", "), sTabTitle]);
						}
					}
					return sText;
				}
			}
		});
	}
);
