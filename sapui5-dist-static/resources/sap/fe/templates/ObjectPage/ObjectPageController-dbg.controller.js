/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/controllerextensions/InternalRouting",
		"./overrides/Routing",
		"./overrides/InternalRouting",
		"sap/ui/Device",
		"sap/fe/core/controllerextensions/SideEffects",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/fe/core/controllerextensions/PageReady",
		"sap/fe/core/controllerextensions/InternalIntentBasedNavigation",
		"sap/fe/core/controllerextensions/IntentBasedNavigation",
		"./overrides/IntentBasedNavigation",
		"sap/fe/macros/field/FieldRuntime",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/macros/table/Utils",
		"sap/m/MessageBox",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/actions/messageHandling",
		"sap/fe/macros/ResourceModel",
		"sap/m/Link",
		"sap/fe/macros/chart/ChartRuntime",
		"sap/fe/templates/controls/Share/ShareUtils",
		"sap/fe/templates/ObjectPage/ExtensionAPI",
		"sap/fe/core/helpers/PasteHelper",
		"sap/fe/core/library",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/controllerextensions/ViewState",
		"./overrides/ViewState",
		"sap/fe/templates/RootContainer/overrides/EditFlow",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/controllerextensions/Routing",
		"sap/m/InstanceManager"
	],
	function(
		PageController,
		JSONModel,
		InternalRouting,
		RoutingOverride,
		InternalRoutingOverride,
		Device,
		SideEffects,
		EditFlow,
		PageReady,
		InternalIntentBasedNavigation,
		IntentBasedNavigation,
		IntentBasedNavigationOverride,
		FieldRuntime,
		Log,
		merge,
		CommonUtils,
		SelectionVariant,
		TableUtils,
		MessageBox,
		BusyLocker,
		messageHandling,
		ResourceModel,
		Link,
		ChartRuntime,
		ShareUtils,
		ExtensionAPI,
		FEPasteHelper,
		FELibrary,
		OverrideExecution,
		ViewState,
		ViewStateOverrides,
		EditFlowOverrides,
		ModelHelper,
		Routing,
		InstanceManager
	) {
		"use strict";

		var iMessages;

		return PageController.extend("sap.fe.templates.ObjectPage.ObjectPageController", {
			metadata: {
				methods: {
					getExtensionAPI: {
						"public": true,
						"final": true
					},
					onPageReady: {
						"public": true,
						"final": false,
						overrideExecution: OverrideExecution.After
					}
				}
			},
			sideEffects: SideEffects,
			editFlow: EditFlow.override(EditFlowOverrides),
			_routing: InternalRouting.override(InternalRoutingOverride),
			intentBasedNavigation: IntentBasedNavigation.override(IntentBasedNavigationOverride),
			_intentBasedNavigation: InternalIntentBasedNavigation.override({
				getNavigationMode: function() {
					var bIsStickyEditMode =
						this._oView.getController().getStickyEditMode && this._oView.getController().getStickyEditMode();
					return bIsStickyEditMode ? "explace" : "inplace";
				}
			}),
			routing: Routing.override(RoutingOverride),
			viewState: ViewState.override(ViewStateOverrides),
			pageReady: PageReady.override({
				isContextExpected: function() {
					return true;
				}
			}),

			getExtensionAPI: function(sId) {
				if (sId) {
					// to allow local ID usage for custom pages we'll create/return own instances for custom sections
					this.mCustomSectionExtensionAPIs = this.mCustomSectionExtensionAPIs || {};

					if (!this.mCustomSectionExtensionAPIs[sId]) {
						this.mCustomSectionExtensionAPIs[sId] = new ExtensionAPI(this, sId);
					}
					return this.mCustomSectionExtensionAPIs[sId];
				} else {
					if (!this.extensionAPI) {
						this.extensionAPI = new ExtensionAPI(this);
					}
					return this.extensionAPI;
				}
			},

			onInit: function() {
				PageController.prototype.onInit.apply(this);
				var oObjectPage = this.byId("fe::ObjectPage");

				// Setting defaults of internal model context
				var oInternalModelContext = this.getView().getBindingContext("internal");
				oInternalModelContext.setProperty("externalNavigationContext", { "page": true });
				oInternalModelContext.setProperty("relatedApps", {
					visibility: false,
					items: null
				});
				oInternalModelContext.setProperty("batchGroups", this._getBatchGroupsForView());

				if (oObjectPage.getEnableLazyLoading()) {
					//Attaching the event to make the subsection context binding active when it is visible.
					oObjectPage.attachEvent("subSectionEnteredViewPort", this._handleSubSectionEnteredViewPort.bind(this));
				}
			},

			onExit: function() {
				var that = this;
				if (this.mCustomSectionExtensionAPIs) {
					Object.keys(this.mCustomSectionExtensionAPIs).forEach(function(sId) {
						that.mCustomSectionExtensionAPIs[sId] && that.mCustomSectionExtensionAPIs[sId].destroy();
					});
					delete this.mCustomSectionExtensionAPIs;
				}
				this.extensionAPI && this.extensionAPI.destroy();
				delete this.extensionAPI;
			},

			_getTableBinding: function(oTable) {
				return oTable && oTable.getRowBinding();
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

			_onBeforeBinding: function(oContext, mParameters) {
				// TODO: we should check how this comes together with the transaction helper, same to the change in the afterBinding
				var that = this,
					aTables = this._findTables(),
					oFastCreationRow,
					oObjectPage = this.byId("fe::ObjectPage"),
					oBinding = mParameters.listBinding,
					oInternalModelContext = that.getView().getBindingContext("internal"),
					aBatchGroups = oInternalModelContext.getProperty("batchGroups");
				aBatchGroups.push("$auto");
				if (
					oObjectPage.getBindingContext() &&
					oObjectPage.getBindingContext().hasPendingChanges() &&
					!aBatchGroups.some(
						oObjectPage
							.getBindingContext()
							.getModel()
							.hasPendingChanges.bind(oObjectPage.getBindingContext().getModel())
					)
				) {
					/* 	In case there are pending changes for the creation row and no others we need to reset the changes
						TODO: this is just a quick solution, this needs to be reworked
				 	*/

					oObjectPage
						.getBindingContext()
						.getBinding()
						.resetChanges();
				}

				// For now we have to set the binding context to null for every fast creation row
				// TODO: Get rid of this coding or move it to another layer - to be discussed with MDC and model
				for (var i = 0; i < aTables.length; i++) {
					oFastCreationRow = aTables[i].getCreationRow();
					if (oFastCreationRow) {
						oFastCreationRow.setBindingContext(null);
					}
				}

				// Scroll to present Section so that bindings are enabled during navigation through paginator buttons, as there is no view rerendering/rebind
				var fnScrollToPresentSection = function(oEvent) {
					if (!oObjectPage.isFirstRendering() && !mParameters.bPersistOPScroll) {
						oObjectPage.setSelectedSection(null);
					}
				};
				oObjectPage.attachEventOnce("modelContextChange", fnScrollToPresentSection);

				// if the structure of the ObjectPageLayout is changed then scroll to present Section
				// FIXME Is this really working as intended ? Initially this was onBeforeRendering, but never triggered onBeforeRendering because it was registered after it
				var oDelegateOnBefore = {
					onAfterRendering: fnScrollToPresentSection
				};
				oObjectPage.addEventDelegate(oDelegateOnBefore, that);
				this.pageReady.attachEventOnce("pageReady", function(oEvent) {
					oObjectPage.removeEventDelegate(oDelegateOnBefore);
				});

				//Set the Binding for Paginators using ListBinding ID
				if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					var oPaginator = that.byId("fe::Paginator");
					if (oPaginator) {
						oPaginator.setListBinding(oBinding);
					}
				}

				if (oObjectPage.getEnableLazyLoading()) {
					var aSections = oObjectPage.getSections(),
						bUseIconTabBar = oObjectPage.getUseIconTabBar(),
						iSkip = 2;
					for (var iSection = 0; iSection < aSections.length; iSection++) {
						var oSection = aSections[iSection];
						var aSubSections = oSection.getSubSections();
						for (var iSubSection = 0; iSubSection < aSubSections.length; iSubSection++, iSkip--) {
							if (iSkip < 1 || (bUseIconTabBar && iSection > 0)) {
								var oSubSection = aSubSections[iSubSection];
								oSubSection.setBindingContext(null);
							}
						}
					}
				}
			},

			_handleSubSectionEnteredViewPort: function(oEvent) {
				var oSubSection = oEvent.getParameter("subSection");
				oSubSection.setBindingContext(undefined);
			},

			_onAfterBinding: function(oBindingContext, mParameters) {
				var oObjectPage = this.byId("fe::ObjectPage"),
					that = this,
					aTables = this._findTables();

				// TODO: this is only a temp solution as long as the model fix the cache issue and we use this additional
				// binding with ownRequest
				oBindingContext = oObjectPage.getBindingContext();
				var aIBNActions = [];
				oObjectPage.getSections().forEach(function(oSection) {
					oSection.getSubSections().forEach(function(oSubSection) {
						aIBNActions = CommonUtils.getIBNActions(oSubSection, aIBNActions);
					});
				});
				aTables.forEach(function(oTable) {
					var oInternalModelContext = oTable.getBindingContext("internal");
					oInternalModelContext.setProperty("creationRowFieldValidity", {});

					aIBNActions = CommonUtils.getIBNActions(oTable, aIBNActions);
					// temporary workaround for BCP: 2080218004
					// Need to fix with BLI: FIORITECHP1-15274
					// only for edit mode, we clear the table cache
					// Workaround starts here!!
					var oTableRowBinding = oTable.getRowBinding();
					if (oTableRowBinding) {
						if (ModelHelper.isStickySessionSupported(oTableRowBinding.getModel().getMetaModel())) {
							// apply for both edit and display mode in sticky
							oTableRowBinding.removeCachesAndMessages("");
						}
					}
					// Workaround ends here!!
					TableUtils.getSemanticTargetsFromTable(that, oTable);
				});
				CommonUtils.getSemanticTargetsFromPageModel(that, "_pageModel");
				//Retrieve Object Page header actions from Object Page title control
				var oObjectPageTitle = oObjectPage.getHeaderTitle();
				var aIBNHeaderActions = [];
				aIBNHeaderActions = CommonUtils.getIBNActions(oObjectPageTitle, aIBNHeaderActions);
				aIBNActions = aIBNActions.concat(aIBNHeaderActions);
				CommonUtils.updateDataFieldForIBNButtonsVisibility(aIBNActions, this.getView());

				var oModel, oFinalUIState;

				// TODO: this should be moved into an init event of the MDC tables (not yet existing) and should be part
				// of any controller extension
				/**
				 * @param oTable
				 * @param oListBinding
				 */
				function enableFastCreationRow(oTable, oListBinding) {
					var oFastCreationRow = oTable.getCreationRow(),
						oFastCreationListBinding,
						oFastCreationContext;

					if (oFastCreationRow) {
						oFinalUIState
							.then(function() {
								if (oFastCreationRow.getModel("ui").getProperty("/isEditable")) {
									oFastCreationListBinding = oModel.bindList(oListBinding.getPath(), oListBinding.getContext(), [], [], {
										$$updateGroupId: "doNotSubmit",
										$$groupId: "doNotSubmit"
									});
									// Workaround suggested by OData model v4 colleagues
									oFastCreationListBinding.refreshInternal = function() {};
									/*
															oFastCreationListBinding.hasPendingChanges = function() {
								return false;
							};
															*/

									oFastCreationContext = oFastCreationListBinding.create();
									oFastCreationRow.setBindingContext(oFastCreationContext);

									// this is needed to avoid console error
									oFastCreationContext.created().catch(function() {
										Log.trace("transient fast creation context deleted");
									});
								}
							})
							.catch(function(oError) {
								Log.error("Error while computing the final UI state", oError);
							});
					}
				}

				// this should not be needed at the all
				/**
				 * @param oTable
				 */
				function handleTableModifications(oTable) {
					var oBinding = that._getTableBinding(oTable),
						fnHandleTablePatchEvents = function() {
							enableFastCreationRow(oTable, oBinding);
						};

					if (!oBinding) {
						Log.error("Expected binding missing for table: " + oTable.getId());
						return;
					}

					if (oBinding.oContext) {
						fnHandleTablePatchEvents();
					} else {
						var fnHandleChange = function() {
							if (oBinding.oContext) {
								fnHandleTablePatchEvents();
								oBinding.detachChange(fnHandleChange);
							}
						};
						oBinding.attachChange(fnHandleChange);
					}
				}

				if (oBindingContext) {
					oModel = oBindingContext.getModel();

					// Compute Edit Mode
					oFinalUIState = this.editFlow.computeEditMode(oBindingContext);

					// update related apps once Data is received in case of binding cache is not available
					// TODO: this is only a temp solution since we need to call _updateRelatedApps method only after data for Object Page is received (if there is no binding)
					if (oBindingContext.getBinding().oCache) {
						that._updateRelatedApps();
					} else {
						var fnUpdateRelatedApps = function() {
							that._updateRelatedApps();
							oBindingContext.getBinding().detachDataReceived(fnUpdateRelatedApps);
						};
						oBindingContext.getBinding().attachDataReceived(fnUpdateRelatedApps);
					}

					//Attach the patch sent and patch completed event to the object page binding so that we can react
					var oBinding = (oBindingContext.getBinding && oBindingContext.getBinding()) || oBindingContext;
					oBinding.attachEvent("patchSent", this.handlers.handlePatchSent, this);
					oBinding.attachEvent("patchCompleted", this.handlers.handlePatchCompleted, this);

					aTables.forEach(function(oTable) {
						// access binding only after table is bound
						TableUtils.whenBound(oTable)
							.then(handleTableModifications)
							.catch(function(oError) {
								Log.error("Error while waiting for the table to be bound", oError);
							});
					});

					// should be called only after binding is ready hence calling it in onAfterBinding
					oObjectPage._triggerVisibleSubSectionsEvents();
					this.getAppComponent()
						.getAppStateHandler()
						.applyAppState();
				}
			},

			onPageReady: function(mParameters) {
				var oLastFocusedControl = mParameters.lastFocusedControl;
				if (oLastFocusedControl && oLastFocusedControl.controlId && oLastFocusedControl.focusInfo) {
					var oView = this.getView();
					var oFocusControl = oView.byId(oLastFocusedControl.controlId);
					if (oFocusControl) {
						oFocusControl.applyFocusInfo(oLastFocusedControl.focusInfo);
						return;
					}
				}
				var oObjectPage = this.byId("fe::ObjectPage");
				// set the focus to the first action button, or to the first editable input if in editable mode
				var isInDisplayMode = oObjectPage.getModel("ui").getProperty("/editMode") === "Display";
				var firstElementClickable;
				if (isInDisplayMode) {
					var aActions = oObjectPage.getHeaderTitle() && oObjectPage.getHeaderTitle().getActions();
					if (aActions && aActions.length) {
						firstElementClickable = aActions.find(function(action) {
							// do we need && action.mProperties["enabled"] ?
							return action.mProperties["visible"];
						});
						if (firstElementClickable) {
							firstElementClickable.focus();
						}
					}
				} else {
					var firstEditableInput = oObjectPage._getFirstEditableInput();
					if (firstEditableInput) {
						firstEditableInput.focus();
					}
				}
				this._checkDataPointTitleForExternalNavigation();
			},
			/**
			 * Get sticky edit mode.
			 *
			 * @returns {boolean} Sticky edit mode status
			 *
			 *
			 */
			getStickyEditMode: function() {
				var oBindingContext = this.oView.getBindingContext && this.oView.getBindingContext(),
					bIsStickyEditMode = false;
				if (oBindingContext) {
					var bIsStickyMode = ModelHelper.isStickySessionSupported(oBindingContext.getModel().getMetaModel());
					if (bIsStickyMode) {
						bIsStickyEditMode = this.oView.getModel("ui").getProperty("/isEditable");
					}
				}
				return bIsStickyEditMode;
			},
			_getPageTitleInformation: function() {
				var oObjectPage = this.byId("fe::ObjectPage");
				var oObjectPageSubtitle = oObjectPage.getCustomData().find(function(oCustomData) {
					return oCustomData.getKey() === "ObjectPageSubtitle";
				});
				var oTitleInfo = {
					title: oObjectPage.data("ObjectPageTitle") || "",
					subtitle: oObjectPageSubtitle && oObjectPageSubtitle.getValue(),
					intent: "",
					icon: ""
				};

				return Promise.resolve(oTitleInfo);
			},

			_executeHeaderShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::ObjectPage")
						.getHeaderTitle()
						.getActions()
						.find(function(oElement) {
							return oElement.getId() === sButtonId;
						});
				CommonUtils.fireButtonPress(oButton);
			},

			_executeFooterShortcut: function(sId) {
				var sButtonId = this.getView().getId() + "--" + sId,
					oButton = this.byId("fe::ObjectPage")
						.getFooter()
						.getContent()
						.find(function(oElement) {
							return oElement.getMetadata().getName() === "sap.m.Button" && oElement.getId() === sButtonId;
						});
				CommonUtils.fireButtonPress(oButton);
			},

			_executeTabShortCut: function(oExecution) {
				var oObjectPage = this.byId("fe::ObjectPage"),
					iSelectedSectionIndex = oObjectPage.indexOfSection(this.byId(oObjectPage.getSelectedSection())),
					aSections = oObjectPage.getSections(),
					iSectionIndexMax = aSections.length - 1,
					sCommand = oExecution.oSource.getCommand(),
					newSection;
				if (iSelectedSectionIndex !== -1 && iSectionIndexMax > 0) {
					if (sCommand === "NextTab") {
						if (iSelectedSectionIndex <= iSectionIndexMax - 1) {
							newSection = aSections[++iSelectedSectionIndex];
						}
					} else {
						// PreviousTab
						if (iSelectedSectionIndex !== 0) {
							newSection = aSections[--iSelectedSectionIndex];
						}
					}
					if (newSection) {
						oObjectPage.setSelectedSection(newSection);
						newSection.focus();
					}
				}
			},

			_getFooterVisibility: function(oEvent) {
				var oInternalModelContext = this.getView().getBindingContext("internal");
				var sViewId = this.getView().getId();
				iMessages = oEvent.getParameter("iMessageLength");
				// as per UX guidelines, the footer bar must not be visible when the dialog is open
				iMessages > 0 && !oInternalModelContext.getProperty("bIsCreateDialogOpen")
					? oInternalModelContext.setProperty("showMessageFooter", true)
					: oInternalModelContext.setProperty("showMessageFooter", false);
				oInternalModelContext.setProperty("messageFooterContainsErrors", false);
				sap.ui
					.getCore()
					.getMessageManager()
					.getMessageModel()
					.getData()
					.forEach(function(oMessage) {
						if (oMessage.validation && oMessage.type === "Error" && oMessage.target.indexOf(sViewId) > -1) {
							oInternalModelContext.setProperty("messageFooterContainsErrors", true);
						}
					});
			},

			_showMessagePopover: function(oMessageButton) {
				var oMessagePopover = oMessageButton.oMessagePopover,
					oItemBinding = oMessagePopover.getBinding("items");
				if (oItemBinding.getLength() > 0) {
					// workaround to ensure that oMessageButton is rendered when openBy is called
					setTimeout(function() {
						oMessagePopover.openBy(oMessageButton);
					}, 0);
				}
			},

			_editDocument: function(oContext) {
				var oModel = this.getView().getModel("ui");
				BusyLocker.lock(oModel);
				return this.editFlow.editDocument
					.apply(this.editFlow, [oContext, this.getView().getViewData().prepareOnEdit])
					.finally(function() {
						BusyLocker.unlock(oModel);
					});
			},

			_saveDocument: function(oContext) {
				var that = this,
					oModel = this.getView().getModel("ui"),
					aWaitCreateDocuments = [];
				// indicates if we are creating a new row in the OP
				var bExecuteSideEffectsOnError = false;
				BusyLocker.lock(oModel);
				this._findTables().forEach(function(oTable) {
					var oBinding = that._getTableBinding(oTable);
					var mParameters = {
						creationMode: oTable.data("creationMode"),
						creationRow: oTable.getCreationRow(),
						createAtEnd: oTable.data("createAtEnd") === "true"
					};
					var bCreateDocument =
						mParameters.creationRow &&
						mParameters.creationRow.getBindingContext() &&
						Object.keys(mParameters.creationRow.getBindingContext().getObject()).length > 1;
					if (bCreateDocument) {
						// the bSkipSideEffects is a parameter created when we click the save key. If we press this key
						// we don't execute the handleSideEffects funciton to avoid batch redundancy
						mParameters.bSkipSideEffects = true;
						bExecuteSideEffectsOnError = true;
						aWaitCreateDocuments.push(
							that.editFlow.createDocument(oBinding, mParameters).then(function() {
								return oBinding;
							})
						);
					}
				});
				return Promise.all(aWaitCreateDocuments).then(function(aBindings) {
					return that.editFlow
						.saveDocument(oContext, bExecuteSideEffectsOnError, aBindings)
						.then(function() {
							var oMessageButton = that.getView().byId("fe::FooterBar::MessageButton");
							var oDelegateOnAfter = {
								onAfterRendering: function(oEvent) {
									that._showMessagePopover(oMessageButton);
									oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
									delete that._oDelegateOnAfter;
								}
							};
							that._oDelegateOnAfter = oDelegateOnAfter;
							oMessageButton.addEventDelegate(oDelegateOnAfter, that);
						})
						.catch(function(err) {
							var oMessageButton = that.getView().byId("fe::FooterBar::MessageButton");
							if (oMessageButton) {
								that._showMessagePopover(oMessageButton);
							}
						})
						.finally(function() {
							BusyLocker.unlock(oModel);
						});
				});
			},

			_cancelDocument: function(oContext, mParameters) {
				mParameters.cancelButton = this.getView().byId(mParameters.cancelButton); //to get the reference of the cancel button from command execution
				return this.editFlow.cancelDocument(oContext, mParameters);
			},

			_applyDocument: function(oContext) {
				var that = this;
				return this.editFlow.applyDocument(oContext).catch(function(err) {
					Log.error(err);
					var oMessageButton = that.getView().byId("fe::FooterBar::MessageButton");
					if (oMessageButton) {
						that._showMessagePopover(oMessageButton);
					}
				});
			},

			_updateRelatedApps: function() {
				var oObjectPage = this.byId("fe::ObjectPage");
				if (CommonUtils.resolveStringtoBoolean(oObjectPage.data("showRelatedApps"))) {
					CommonUtils.updateRelatedAppsDetails(oObjectPage);
				}
			},

			_findTableInSubSection: function(aParentElement, aSubsection, aTables) {
				var aSubSectionTables = [];
				for (var element = 0; element < aParentElement.length; element++) {
					var oElement = aParentElement[element].getContent instanceof Function && aParentElement[element].getContent();
					if (oElement && oElement.isA && oElement.isA("sap.ui.layout.DynamicSideContent")) {
						oElement = oElement.getMainContent instanceof Function && oElement.getMainContent();
						if (oElement && oElement.length > 0) {
							oElement = oElement[0];
						}
					}
					if (oElement && oElement.isA && oElement.isA("sap.fe.macros.TableAPI")) {
						oElement = oElement.getContent instanceof Function && oElement.getContent();
						if (oElement && oElement.length > 0) {
							oElement = oElement[0];
						}
					}
					if (oElement && oElement.isA && oElement.isA("sap.ui.mdc.Table")) {
						aTables.push(oElement);
						aSubSectionTables.push({
							"table": oElement,
							"gridTable": oElement.getType().isA("sap.ui.mdc.table.GridTableType")
						});
					}
				}
				if (
					aSubSectionTables.length === 1 &&
					aParentElement.length === 1 &&
					aSubSectionTables[0].gridTable &&
					!aSubsection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")
				) {
					//In case there is only a single table in a section we fit that to the whole page so that the scrollbar comes only on table and not on page
					aSubsection.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
				} else {
					if (aSubSectionTables && !aSubsection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")) {
						aSubSectionTables.forEach(function(oTable) {
							if (oTable.gridTable) {
								//Resetting the row count to default value in case we have a combination of forms and tables or multiple tables in a subsection
								oTable.table.getType().setRowCount(null);
							}
						});
					}
				}
			},

			//TODO: This is needed for two workarounds - to be removed again
			_findTables: function() {
				var oObjectPage = this.byId("fe::ObjectPage"),
					aTables = [];
				var aSections = oObjectPage.getSections();
				for (var section = 0; section < aSections.length; section++) {
					var aSubsections = aSections[section].getSubSections();
					for (var subSection = 0; subSection < aSubsections.length; subSection++) {
						this._findTableInSubSection(aSubsections[subSection].getBlocks(), aSubsections[subSection], aTables);
						this._findTableInSubSection(aSubsections[subSection].getMoreBlocks(), aSubsections[subSection], aTables);
					}
				}

				return aTables;
			},

			/**
			 * Chart Context is resolved for 1:n microcharts.
			 *
			 * @param {sap.ui.model.Context} oChartContext 'Context of the MicroChart'
			 * @param {string} sChartPath 'sCollectionPath of the the chart'
			 * @returns {Array} Array of Attributes of the chart Context
			 */
			_getChartContextData: function(oChartContext, sChartPath) {
				var oContextData = oChartContext.getObject(),
					oChartContextData = [oContextData];
				if (oChartContext && sChartPath) {
					if (oContextData[sChartPath]) {
						oChartContextData = oContextData[sChartPath];
						delete oContextData[sChartPath];
						oChartContextData.push(oContextData);
					}
				}
				return oChartContextData;
			},

			/**
			 * Get the Row that has the corresponding binding context
			 *
			 * @function
			 * @name sap.fe.templates.ObjectPage.ObjectPageController.controller#_getTableRow
			 * @param {object} oTableRowBindingContexts 'contexts of the table rows'
			 * @param {string} sRowPath 'sPath of the table row'
			 * @returns {object} row satisfying the criterias passed in parameter
			 */

			_getTableRow: function(oTableRowBindingContexts, sRowPath) {
				if (
					oTableRowBindingContexts.filter(function(item) {
						return item !== undefined;
					}).length > 0
				) {
					var oTableRow = oTableRowBindingContexts.find(function(item) {
						return item.getPath().indexOf(sRowPath) !== -1;
					});
					return oTableRow;
				} else {
					return undefined;
				}
			},

			/**
			 * Scroll the table to the Row that has the corresponding sPath
			 *
			 * @function
			 * @name sap.fe.templates.ObjectPage.ObjectPageController.controller#_scrollTableToRow
			 * @param {object} oTable 'table to be scrolled'
			 * @param {string} sRowPath 'sPath of the table row'
			 *
			 */

			_scrollTableToRow: function(oTable, sRowPath) {
				var oTableRowBinding = oTable.getRowBinding();
				var that = this;
				var pWait = new Promise(function(resolve, reject) {
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
						//wait for the bindingContexts to be ready when a view enters/goes out of FCL fullscreen :
						if (
							oTableRowBindingContexts.filter(function(item) {
								return item === undefined;
							}).length > 0 ||
							oTableRowBindingContexts.length === 0
						) {
							oTableRowBinding.attachChange(function getTableRowCallBack(oEvent) {
								var oTableRowBindingContexts = that._getTableRow(oEvent.getSource().getCurrentContexts(), sRowPath);
								if (oTableRowBindingContexts) {
									oTableRowBinding.detachChange(getTableRowCallBack);
									resolve(oTableRowBindingContexts);
								}
							});
						} else {
							resolve(that._getTableRow(oTableRowBindingContexts, sRowPath));
						}
					} else {
						reject();
					}
				});
				pWait
					.then(function(oTableRow) {
						if (oTableRow) {
							var iPos = oTableRow.iIndex;
							oTable.scrollToIndex(iPos);
						}
					})
					.catch(function() {
						Log.warning("Could not find any matched row");
					});
			},

			/**
			 * Scroll the Tables to the Row with the sPath
			 *
			 * @function
			 * @name sap.fe.templates.ObjectPage.ObjectPageController.controller#_scrollTablesToRow
			 * @param {string} sRowPath 'sPath of the table row'
			 *
			 */

			_scrollTablesToRow: function(sRowPath) {
				if (this._findTables && this._findTables().length > 0) {
					var aTables = this._findTables();
					for (var i = 0; i < aTables.length; i++) {
						this._scrollTableToRow(aTables[i], sRowPath);
					}
				}
			},

			/**
			 * Method to merge selected contexts and filters.
			 *
			 * @function
			 * @name _mergeMultipleContexts
			 * @param {object} oPageContext Page context
			 * @param {object|Array} aLineContext Selected Contexts
			 * @param {string} sChartPath Collection name of the chart
			 * @returns {object} Selection Variant Object
			 */
			_mergeMultipleContexts: function(oPageContext, aLineContext, sChartPath) {
				var that = this;
				var aAttributes = [],
					aPageAttributes = [],
					oMetaModel,
					oContext,
					sMetaPathLine,
					sMetaPathPage,
					sPathLine,
					oPageLevelSV,
					sPagePath;

				sPagePath = oPageContext.getPath();
				oMetaModel = oPageContext && oPageContext.getModel() && oPageContext.getModel().getMetaModel();
				sMetaPathPage = oMetaModel && oMetaModel.getMetaPath(sPagePath).replace(/^\/*/, "");

				// Get single line context if necessary
				if (aLineContext && aLineContext.length) {
					oContext = aLineContext[0];
					sPathLine = oContext.getPath();
					sMetaPathLine = oMetaModel && oMetaModel.getMetaPath(sPathLine).replace(/^\/*/, "");

					aLineContext.map(function(oSingleContext) {
						if (sChartPath) {
							var oChartContextData = that._getChartContextData(oSingleContext, sChartPath);
							if (oChartContextData) {
								aAttributes = oChartContextData.map(function(oChartContextData) {
									return {
										contextData: oChartContextData,
										entitySet: sMetaPathPage + "/" + sChartPath
									};
								});
							}
						} else {
							aAttributes.push({
								contextData: oSingleContext.getObject(),
								entitySet: sMetaPathLine
							});
						}
					});
				}
				aPageAttributes.push({
					contextData: oPageContext.getObject(),
					entitySet: sMetaPathPage
				});
				// Adding Page Context to selection variant
				aPageAttributes = CommonUtils.removeSensitiveData(aPageAttributes, oMetaModel);
				oPageLevelSV = CommonUtils.addPageContextToSelectionVariant(new SelectionVariant(), aPageAttributes, that.getView());
				aAttributes = CommonUtils.removeSensitiveData(aAttributes, oMetaModel);
				return {
					selectionVariant: oPageLevelSV,
					attributes: aAttributes
				};
			},

			_getBatchGroupsForView: function() {
				var that = this,
					oViewData = that.getView().getViewData(),
					oConfigurations = oViewData.controlConfiguration,
					aConfigurations = oConfigurations && Object.keys(oConfigurations),
					aBatchGroups = ["$auto.Heroes", "$auto.Decoration", "$auto.Workers"];

				if (aConfigurations && aConfigurations.length > 0) {
					aConfigurations.forEach(function(sKey) {
						var oConfiguration = oConfigurations[sKey];
						if (oConfiguration.requestGroupId === "LongRunners") {
							aBatchGroups.push("$auto.LongRunners");
						}
					});
				}
				return aBatchGroups;
			},

			/*
			 * Reset Breadcrumb links
			 *
			 * @function
			 * @param {sap.m.Breadcrumbs} [oSource] parent control
			 * @description Used when context of the objectpage changes.
			 *              This event callback is attached to modelContextChange
			 *              event of the Breadcrumb control to catch context change.
			 *              Then element binding and hrefs are updated for each Link.
			 *
			 * @ui5-restricted
			 * @experimental
			 */
			_setBreadcrumbLinks: function(oSource) {
				var oContext = oSource.getBindingContext();
				var oAppComponent = this.getAppComponent();
				if (oContext) {
					var sNewPath = oContext.getPath(),
						aPathParts = sNewPath.split("/"),
						sPath = "";
					aPathParts.shift();
					aPathParts.splice(-1, 1);
					aPathParts.forEach(function(sPathPart, i) {
						sPath += "/" + sPathPart;
						var oRootViewController = oAppComponent.getRootViewController();
						var oTitleHierarchyCache = oRootViewController.getTitleHierarchyCache();
						var pWaitForTitleHiearchyInfo;
						if (!oTitleHierarchyCache[sPath]) {
							pWaitForTitleHiearchyInfo = oRootViewController.addNewEntryInCacheTitle(sPath, oAppComponent);
						} else {
							pWaitForTitleHiearchyInfo = Promise.resolve(oTitleHierarchyCache[sPath]);
						}
						pWaitForTitleHiearchyInfo
							.then(function(oTitleHiearchyInfo) {
								var oLink = oSource.getLinks()[i] ? oSource.getLinks()[i] : new Link();
								// sCurrentEntity is a fallback value in case of empty title
								oLink.setText(oTitleHiearchyInfo.subtitle || oTitleHiearchyInfo.title);
								oLink.setHref(oTitleHiearchyInfo.intent);
								if (!oSource.getLinks()[i]) {
									oSource.addLink(oLink);
								}
							})
							.catch(function(oError) {
								Log.error("Error while computing the title hierarchy", oError);
							});
					});
				}
			},
			_checkDataPointTitleForExternalNavigation: function() {
				var oView = this.getView();
				var oInternalModelContext = oView.getBindingContext("internal");
				var oDataPoints = CommonUtils.getHeaderFacetItemConfigForExternalNavigation(
					oView.getViewData(),
					this.getAppComponent()
						.getRoutingService()
						.getOutbounds()
				);
				var oShellServices = this.getAppComponent().getShellServices();
				var oPageContext = oView && oView.getBindingContext();
				oInternalModelContext.setProperty("isHeaderDPLinkVisible", {});
				if (oPageContext) {
					oPageContext
						.requestObject()
						.then(function(oData) {
							fnGetLinks(oDataPoints, oData);
						})
						.catch(function(oError) {
							Log.error("Cannot retrieve the links from the shell service", oError);
						});
				}
				/**
				 * @param oError
				 */
				function fnOnError(oError) {
					Log.error(oError);
				}
				/**
				 * @param aSupportedLinks
				 */
				function fnSetLinkEnablement(aSupportedLinks) {
					var sLinkId = this.id;
					// process viable links from getLinks for all datapoints having outbound
					if (aSupportedLinks && aSupportedLinks.length === 1 && aSupportedLinks[0].supported) {
						oInternalModelContext.setProperty("isHeaderDPLinkVisible/" + sLinkId, true);
					}
				}
				/**
				 * @param oDataPoints
				 * @param oPageData
				 */
				function fnGetLinks(oDataPoints, oPageData) {
					for (var sId in oDataPoints) {
						var oDataPoint = oDataPoints[sId];
						var oParams = {};
						var oLink = oView.byId(sId);
						if (!oLink) {
							// for data points configured in app descriptor but not annotated in the header
							continue;
						}
						var oLinkContext = oLink.getBindingContext();
						var oLinkData = oLinkContext && oLinkContext.getObject();
						var oMixedContext = merge({}, oPageData, oLinkData);
						// process semantic object mappings
						if (oDataPoint.semanticObjectMapping) {
							var aSemanticObjectMapping = oDataPoint.semanticObjectMapping;
							for (var item in aSemanticObjectMapping) {
								var oMapping = aSemanticObjectMapping[item];
								var sMainProperty = oMapping["LocalProperty"]["$PropertyPath"];
								var sMappedProperty = oMapping["SemanticObjectProperty"];
								if (sMainProperty !== sMappedProperty) {
									if (oMixedContext.hasOwnProperty(sMainProperty)) {
										var oNewMapping = {};
										oNewMapping[sMappedProperty] = oMixedContext[sMainProperty];
										oMixedContext = merge({}, oMixedContext, oNewMapping);
										delete oMixedContext[sMainProperty];
									}
								}
							}
						}

						if (oMixedContext) {
							for (var sKey in oMixedContext) {
								if (sKey.indexOf("_") !== 0 && sKey.indexOf("odata.context") === -1) {
									oParams[sKey] = oMixedContext[sKey];
								}
							}
						}
						// validate if a link must be rendered
						oShellServices
							.isNavigationSupported([
								{
									target: {
										semanticObject: oDataPoint.semanticObject,
										action: oDataPoint.action
									},
									params: oParams
								}
							])
							.then(
								fnSetLinkEnablement.bind({
									id: sId
								})
							)
							.catch(fnOnError);
					}
				}
			},
			_onBeforeExport: function(oEvent) {
				var oTable = oEvent.getSource();
				TableUtils.onBeforeExport(oEvent, oTable);
			},
			handlers: {
				onTableContextChange: function(oEvent) {
					var that = this;
					var oSource = oEvent.getSource();
					var oTable;
					this._findTables().some(function(_oTable) {
						if (_oTable.getRowBinding() === oSource) {
							oTable = _oTable;
							return true;
						}
						return false;
					});

					var oCurrentActionPromise = this.editFlow.getCurrentActionPromise();
					if (oCurrentActionPromise) {
						var aTableContexts;
						if (
							oTable
								.getType()
								.getMetadata()
								.isA("sap.ui.mdc.table.GridTableType")
						) {
							aTableContexts = oSource.getContexts(0);
						} else {
							aTableContexts = oSource.getCurrentContexts();
						}
						//if contexts are not fully loaded the getcontexts function above will trigger a new change event call
						if (!aTableContexts[0]) {
							return;
						}
						oCurrentActionPromise
							.then(function(oActionResponse) {
								if (!oActionResponse || oActionResponse.controlId !== oTable.sId) {
									return;
								}
								var oActionData = oActionResponse.oData;
								var aKeys = oActionResponse.keys;
								var iNewItemp = -1;
								aTableContexts.find(function(oTableContext, i) {
									var oTableData = oTableContext.getObject();
									var bCompare = aKeys.every(function(sKey) {
										return oTableData[sKey] === oActionData[sKey];
									});
									if (bCompare) {
										iNewItemp = i;
									}
									return bCompare;
								});
								if (iNewItemp !== -1) {
									var aDialogs = InstanceManager.getOpenDialogs();
									var oDialog = aDialogs.length > 0 ? aDialogs[0] : null;
									if (oDialog) {
										// by design, a sap.m.dialog set the focus to the previous focused element when closing.
										// we should wait for the dialog to be close before to focus another element
										oDialog.attachEventOnce("afterClose", function() {
											oTable.focusRow(iNewItemp, true);
										});
									} else {
										oTable.focusRow(iNewItemp, true);
									}
									that.editFlow.deleteCurrentActionPromise();
								}
							})
							.catch(function(err) {
								Log.error("An error occurs while scrolling to the newly created Item: " + err);
							});
					}
				},

				onShareObjectPageActionButtonPress: function(oEvent, oController) {
					var oControl = oController.getView().byId("fe::Share");
					oController
						._getPageTitleInformation()
						.then(function(pageTitleInfo) {
							if (oControl && (oControl.getVisible() || (oControl.getEnabled && oControl.getEnabled()))) {
								ShareUtils.onShareActionButtonPressImpl(oControl, oController, pageTitleInfo);
							}
						})
						.catch(function(oError) {
							Log.error("Error while retrieving the page title information", oError);
						});
				},
				/**
				 * Invokes an action - bound/unbound and sets the page dirty.
				 *
				 * @param oView
				 * @param {string} sActionName The name of the action to be called
				 * @param {map} [mParameters] contains the following attributes:
				 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] contexts Mandatory for a bound action, Either one context or an array with contexts for which the action shall be called
				 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] oModel Mandatory for an unbound action, An instance of an OData v4 model
				 * @returns {Promise}
				 * @ui5-restricted
				 * @final
				 */
				onCallActionFromFooter: function(oView, sActionName, mParameters) {
					var oController = oView.getController();
					var that = oController;
					return oController.editFlow
						.invokeAction(sActionName, mParameters)
						.then(function() {
							var oMessageButton = that.getView().byId("fe::FooterBar::MessageButton");
							if (oMessageButton.isActive()) {
								that._showMessagePopover(oMessageButton);
							} else if (iMessages) {
								that._oDelegateOnAfter = {
									onAfterRendering: function(oEvent) {
										that._showMessagePopover(oMessageButton);
										oMessageButton.removeEventDelegate(that._oDelegateOnAfter);
										delete that._oDelegateOnAfter;
									}
								};
								oMessageButton.addEventDelegate(that._oDelegateOnAfter, that);
							}
						})
						.catch(function(err) {
							var oMessageButton = that.getView().byId("fe::FooterBar::MessageButton");
							if (oMessageButton) {
								that._showMessagePopover(oMessageButton);
							}
						});
				},
				onDataPointTitlePressed: function(oController, oSource, oManifestOutbound, sControlConfig, sCollectionPath) {
					oManifestOutbound = typeof oManifestOutbound === "string" ? JSON.parse(oManifestOutbound) : oManifestOutbound;
					var oTargetInfo = oManifestOutbound[sControlConfig],
						aSemanticObjectMapping = CommonUtils.getSemanticObjectMapping(oTargetInfo),
						oDataPointOrChartBindingContext = oSource.getBindingContext(),
						sMetaPath = oDataPointOrChartBindingContext
							.getModel()
							.getMetaModel()
							.getMetaPath(oDataPointOrChartBindingContext.getPath()),
						aNavigationData = oController._getChartContextData(oDataPointOrChartBindingContext, sCollectionPath);

					aNavigationData = aNavigationData.map(function(oNavigationData) {
						return {
							data: oNavigationData,
							metaPath: sMetaPath + (sCollectionPath ? "/" + sCollectionPath : "")
						};
					});
					if (oTargetInfo && oTargetInfo.semanticObject && oTargetInfo.action) {
						oController._intentBasedNavigation.navigate(oTargetInfo.semanticObject, oTargetInfo.action, {
							navigationContexts: aNavigationData,
							semanticObjectMapping: aSemanticObjectMapping
						});
					}
				},
				/**
				 * Triggers an outbound navigation on Chevron Press.
				 *
				 * @param oController
				 * @param {string} sOutboundTarget name of the outbound target (needs to be defined in the manifest)
				 * @param {sap.ui.model.odata.v4.Context} oContext that contain the data for the target app
				 * @returns {Promise} Promise which is resolved once the navigation is triggered (??? maybe only once finished?)
				 */
				onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext) {
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
						// If there is no reason for the promise then this function can be removed
						// and instead intentBasedNavigation.navigate can be directly used.
						return Promise.resolve();
					} else {
						throw new Error("outbound target " + sOutboundTarget + " not found in cross navigation definition of manifest");
					}
				},
				onNavigateChange: function(oEvent) {
					//will be called always when we click on a section tab
					this.getExtensionAPI().updateAppState();
					this.bSectionNavigated = true;
				},
				onVariantSelected: function(oEvent) {
					this.getExtensionAPI().updateAppState();
				},
				onVariantSaved: function(oEvent) {
					var that = this;
					//TODO: Should remove this setTimeOut once Variant Management provides an api to fetch the current variant key on save
					setTimeout(function() {
						that.getExtensionAPI().updateAppState();
					}, 500);
				},
				navigateToSubSection: function(oController, vDetailConfig) {
					var oDetailConfig = typeof vDetailConfig === "string" ? JSON.parse(vDetailConfig) : vDetailConfig,
						oObjectPage = oController.getView().byId("fe::ObjectPage"),
						oSection,
						oSubSection;
					if (oDetailConfig.sectionId) {
						oSection = oController.getView().byId(oDetailConfig.sectionId);
						oSubSection = oDetailConfig.subSectionId
							? oController.getView().byId(oDetailConfig.subSectionId)
							: oSection && oSection.getSubSections() && oSection.getSubSections()[0];
					} else if (oDetailConfig.subSectionId) {
						oSubSection = oController.getView().byId(oDetailConfig.subSectionId);
						oSection = oSubSection && oSubSection.getParent();
					}
					if (!oSection || !oSubSection || !oSection.getVisible() || !oSubSection.getVisible()) {
						oController
							.getView()
							.getModel("sap.fe.i18n")
							.getResourceBundle()
							.then(function(oResourceBundle) {
								var sTitle = CommonUtils.getTranslatedText(
									"C_ROUTING_NAVIGATION_DISABLED_TITLE",
									oResourceBundle,
									null,
									oController.getView().getViewData().entitySet
								);
								Log.error(sTitle);
								MessageBox.error(sTitle);
							})
							.catch(function(error) {
								Log.error(error);
							});
					} else {
						oObjectPage.scrollToSection(oSubSection.getId());
						// trigger iapp state change
						oObjectPage.fireNavigate({
							section: oSection,
							subSection: oSubSection
						});
					}
				},
				onChartSelectionChanged: function(oEvent) {
					ChartRuntime.fnUpdateChart(oEvent);
				},

				/**
				 * Handles the patchSent event: register document modification.
				 *
				 * @param oEvent
				 * @memberof sap.fe.core.controllerextensions.EditFlow
				 */
				handlePatchSent: function(oEvent) {
					var that = this;
					var oPatchPromise = new Promise(function(resolve, reject) {
						that.resolvePatchPromise = resolve;
						that.rejectPatchPromise = reject;
					});

					this.editFlow.updateDocument(oPatchPromise, oEvent.getSource());
				},

				/**
				 * Handles the patchCompleted event: resolves or rejects document modification.
				 *
				 * @param oEvent
				 * @memberof sap.fe.core.controllerextensions.EditFlow
				 */
				handlePatchCompleted: function(oEvent) {
					var bSuccess = oEvent.getParameter("success");
					if (bSuccess) {
						this.resolvePatchPromise();
					} else {
						this.rejectPatchPromise();
					}
				},

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
				}
			}
		});
	}
);
