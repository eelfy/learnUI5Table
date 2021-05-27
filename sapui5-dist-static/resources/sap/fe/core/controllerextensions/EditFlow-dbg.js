/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/actions/messageHandling",
		"sap/fe/core/actions/sticky",
		"sap/fe/core/TransactionHelper",
		"sap/base/Log",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/base/util/merge",
		"sap/fe/core/helpers/SideEffectsUtil",
		"sap/fe/core/library",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/core/helpers/SemanticKeyHelper",
		"sap/fe/core/helpers/EditState"
	],
	function(
		ControllerExtension,
		OverrideExecution,
		messageHandling,
		sticky,
		TransactionHelper,
		Log,
		Text,
		Button,
		Dialog,
		CommonUtils,
		BusyLocker,
		mergeObjects,
		SideEffectsUtil,
		FELibrary,
		ODataListBinding,
		SemanticKeyHelper,
		EditState
	) {
		"use strict";

		var CreationMode = FELibrary.CreationMode,
			ProgrammingModel = FELibrary.ProgrammingModel,
			Constants = FELibrary.Constants,
			DraftStatus = FELibrary.DraftStatus,
			EditMode = FELibrary.EditMode;

		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.EditFlow", {
			metadata: {
				methods: {
					editDocument: { "public": true, "final": true },
					updateDocument: { "public": true, "final": true },
					createDocument: { "public": true, "final": true },
					saveDocument: { "public": true, "final": true },
					cancelDocument: { "public": true, "final": true },
					deleteDocument: { "public": true, "final": true },
					applyDocument: { "public": true, "final": true },
					invokeAction: { "public": true, "final": true },
					securedExecution: { "public": true, "final": true },

					setCreateMode: { "public": false, "final": false, overrideExecution: OverrideExecution.After },

					setEditMode: { "public": false, "final": true },
					setDraftStatus: { "public": false, "final": true },
					getGlobalUIModel: { "public": false, "final": true },
					getInternalModel: { "public": false, "final": true },
					getProgrammingModel: { "public": false, "final": true },
					getTransactionHelper: { "public": false, "final": true },
					getRoutingListener: { "public": false, "final": true }
				}
			},

			/*
			 TO BE CHECKED / DISCUSSED
			 syncTask / computeEditMode - currently only called by OP, to be checked if needed by FPM full page, guess yes
			 createMultipleDocuments and deleteMultiDocument - couldn't we combine them with create and delete document?
			 createActionPromise, getCurrentActionPromise and deleteCurrentActionPromise -> next step

			 */

			/**
			 * Sets the edit mode.
			 *
			 * @param {string} sEditMode
			 * @param {boolean} bCreationMode createMode flag to identify the creation mode
			 */
			setEditMode: function(sEditMode, bCreationMode) {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				var oGlobalModel = this.getGlobalUIModel();

				if (sEditMode) {
					oGlobalModel.setProperty("/editMode", sEditMode, undefined, true);
					oGlobalModel.setProperty("/isEditable", sEditMode === "Editable", undefined, true);
				}

				if (bCreationMode !== undefined) {
					this.setCreationMode(bCreationMode);
				}
			},
			setCreationMode: function(bCreationMode) {
				// to be overridden
			},
			setDraftStatus: function(sDraftState) {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				this.base
					.getView()
					.getModel("ui")
					.setProperty("/draftStatus", sDraftState, undefined, true);
			},
			getRoutingListener: function() {
				// at this point of time it's not meant to release the edit flow for FPM custom pages and the routing
				// listener is not yet public therefore keep the logic here for now

				if (this.base._routing) {
					return this.base._routing;
				} else {
					throw new Error("Edit Flow works only with a given routing listener");
				}
			},
			getGlobalUIModel: function() {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				return this.base.getView().getModel("ui");
			},

			getInternalModel: function() {
				return this.base.getView().getModel("internal");
			},

			/**
			 * Performs a task in sync with other tasks created via this function.
			 * Returns the task promise chain.
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.EditFlow#syncTask
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @static
			 * @param {Promise|Function} [vTask] Optional, a promise or function to be executed and waitFor
			 * @returns {Promise} Promise resolves with ???
			 *
			 * @ui5-restricted
			 * @final
			 */
			syncTask: function(vTask) {
				var fnNewTask;
				if (vTask instanceof Promise) {
					fnNewTask = function() {
						return vTask;
					};
				} else if (typeof vTask === "function") {
					fnNewTask = vTask;
				}

				this._pTasks = this._pTasks || Promise.resolve();
				if (!!fnNewTask) {
					this._pTasks = this._pTasks.then(fnNewTask).catch(function() {
						return Promise.resolve();
					});
				}

				return this._pTasks;
			},

			/**
			 * Secured execution of the given function. Ensures that the function is only executed when certain conditions are fulfilled.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Function} fnFunction The function to be executed. Should return a promise that is settled after completion of the execution. If nothing is returned, immediate completion is assumed.
			 * @param {map} [mParameters] Parameters to define the preconditions to be checked before execution
			 * @param {object} [mParameters.busy] Parameters regarding busy indication
			 * @param {boolean} [mParameters.busy.set=true] Triggers a busy indication during function execution. Can be set to false in case of immediate completion.
			 * @param {boolean} [mParameters.busy.check=true] Checks whether the application is currently busy. Function is only executed if not. Has to be set to false, if function is not triggered by direct user interaction, but as result of another function, that set the application busy.
			 * @param {boolean} [mParameters.updatesDocument] This operation updates the current document without using the bound model and context therefore draft status is updated in case of draft and user has to confirm cancelling the edit
			 * @returns {Promise} A Promise that is rejected, if execution is prohibited, and settled equivalent to the one returned by fnFunction.
			 *
			 */
			securedExecution: function(fnFunction, mParameters) {
				var bBusySet = mParameters && mParameters.busy && mParameters.busy.set !== undefined ? mParameters.busy.set : true,
					bBusyCheck = mParameters && mParameters.busy && mParameters.busy.check !== undefined ? mParameters.busy.check : true,
					bUpdatesDocument = (mParameters && mParameters.updatesDocument) || false,
					oLockObject = this.getGlobalUIModel(),
					oContext = this.base.getView().getBindingContext(),
					bIsDraft = oContext && this.getProgrammingModel(oContext) === ProgrammingModel.Draft,
					that = this;

				if (bBusyCheck && BusyLocker.isLocked(oLockObject)) {
					return Promise.reject("Application already busy therefore execution rejected");
				}

				// we have to set busy and draft indicator immediately also the function might be executed later in queue
				if (bBusySet) {
					BusyLocker.lock(oLockObject);
				}
				if (bUpdatesDocument && bIsDraft) {
					this.setDraftStatus(DraftStatus.Saving);
				}

				return this.syncTask(fnFunction)
					.then(function() {
						if (bUpdatesDocument) {
							that.getTransactionHelper().handleDocumentModifications();
							EditState.setEditStateDirty();
							if (bIsDraft) {
								that.setDraftStatus(DraftStatus.Saved);
							}
						}
					})
					.catch(function(oError) {
						if (bUpdatesDocument && bIsDraft) {
							that.setDraftStatus(DraftStatus.Clear);
						}
						return Promise.reject(oError);
					})
					.finally(function() {
						if (bBusySet) {
							BusyLocker.unlock(oLockObject);
						}
						return messageHandling.showUnboundMessages();
					});
			},

			getProgrammingModel: function(oContext) {
				return this.getTransactionHelper().getProgrammingModel(oContext);
			},

			/**
			 * Create new document.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.ODataListBinding|string} vListBinding  ODataListBinding object or the binding path for a temporary listbinding
			 * @param {map} [mParameters] Optional, can contain the following attributes:
			 * @param {string} mParameters.creationMode the creation mode to be used
			 *                    NewPage - the created document is shown in a new page, depending on metadata Sync, Async or Deferred is used
			 *                    Sync - the creation is triggered, once the document is created the navigation is done
			 *                    Async - the creation and the navigation to the instance is done in parallel
			 *                    Deferred - the creation is done at the target page
			 *                    Inline - The creation is done inline (in a table)
			 *                    CreationRow - The creation is done with the special creation row
			 * @param {object} mParameters.creationRow instance of the creation row (TODO: get rid but use list bindings only)
			 * @returns {string} the draft admin owner string to be shown
			 */
			createDocument: function(vListBinding, mParameters) {
				var that = this,
					transactionHelper = this.getTransactionHelper(),
					oLockObject = this.getGlobalUIModel(),
					oTable,
					iCountTableItems,
					oResourceBundle = that.getView().getController().oResourceBundle,
					bShouldBusyLock =
						!mParameters ||
						(mParameters.creationMode !== CreationMode.Inline &&
							mParameters.creationMode !== CreationMode.CreationRow &&
							mParameters.creationMode !== CreationMode.External);

				if (mParameters.creationMode === CreationMode.External) {
					// Create by navigating to an external target
					// TODO: Call appropriate function (currently using the same as for outbound chevron nav, and without any context - 3rd param)
					return this.syncTask().then(function() {
						var oController = that.getView().getController();
						oController.handlers.onChevronPressNavigateOutBound(oController, mParameters.outbound, undefined);
					});
				}

				if (mParameters.creationMode === CreationMode.CreationRow && mParameters.creationRow) {
					oTable = mParameters.creationRow.getParent();
					if (oTable.getCreationRow().data("disableAddRowButtonForEmptyData") === "true") {
						var oInternalModelContext = oTable.getBindingContext("internal");
						oInternalModelContext.setProperty("creationRowFieldValidity", {});
					}
				}
				if (mParameters.creationMode === CreationMode.Inline && mParameters.tableId) {
					oTable = this.getView().byId(mParameters.tableId);
				}

				function handleSideEffects(oListBinding, oCreationPromise) {
					oCreationPromise
						.then(function(oNewContext) {
							var oBindingContext = that.getView().getBindingContext();
							// if there are transient contexts, we must avoid requesting side effects
							// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
							// if list binding is refreshed, transient contexts might be lost
							if (!CommonUtils.hasTransientContext(oListBinding)) {
								SideEffectsUtil.requestSideEffects(oListBinding.getPath(), oBindingContext);
							}
						})
						.catch(function(oError) {
							Log.error("Error while creating the document", oError);
						});
				}
				bShouldBusyLock && BusyLocker.lock(oLockObject);
				return this.syncTask()
					.then(function() {
						var sProgrammingModel, oListBinding, oModel;

						mParameters = mParameters || {};

						if (vListBinding && typeof vListBinding === "object") {
							// we already get a list binding use this one
							oListBinding = vListBinding;
						} else if (typeof vListBinding === "string") {
							oListBinding = new ODataListBinding(that.getView().getModel(), vListBinding);
							mParameters.creationMode = CreationMode.Sync;
							delete mParameters.createAtEnd;
						} else {
							throw new Error("Binding object or path expected");
						}

						oModel = oListBinding.getModel();
						iCountTableItems = oListBinding.iMaxLength || 0;
						var sCreationMode = mParameters.creationMode;

						return Promise.resolve(that.getProgrammingModel(oListBinding))
							.then(function(programmingModel) {
								sProgrammingModel = programmingModel;
								if (sCreationMode && sCreationMode !== CreationMode.NewPage) {
									// use the passed creation mode
									return sCreationMode;
								} else {
									var oMetaModel = oModel.getMetaModel();
									// NewAction is not yet supported for NavigationProperty collection
									if (!oListBinding.isRelative()) {
										var sPath = oListBinding.getPath(),
											// if NewAction with parameters is present, then creation is 'Deferred'
											// in the absence of NewAction or NewAction with parameters, creation is async
											sNewAction =
												sProgrammingModel === ProgrammingModel.Draft
													? oMetaModel.getObject(sPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")
													: oMetaModel.getObject(
															sPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"
													  );
										if (sNewAction) {
											var aParameters = oMetaModel.getObject("/" + sNewAction + "/@$ui5.overload/0/$Parameter") || [];
											// binding parameter (eg: _it) is not considered
											if (aParameters.length > 1) {
												return CreationMode.Deferred;
											}
										}
									}
									var sMetaPath = oMetaModel.getMetaPath(oListBinding.getHeaderContext().getPath());
									var aNonComputedVisibleKeyFields = CommonUtils.getNonComputedVisibleFields(oMetaModel, sMetaPath);
									if (aNonComputedVisibleKeyFields.length > 0) {
										return CreationMode.Deferred;
									}
									return CreationMode.Async;
								}
							})
							.then(function(sCreationMode) {
								var oCreation,
									mArgs,
									oCreationRow = mParameters.creationRow,
									oCreationRowContext,
									oValidationCheck = Promise.resolve(),
									oPayload,
									sMetaPath,
									oMetaModel = oModel.getMetaModel(),
									oRoutingListener = that.getRoutingListener();

								if (sCreationMode !== CreationMode.Deferred) {
									if (sCreationMode === CreationMode.CreationRow) {
										oCreationRowContext = oCreationRow.getBindingContext();
										sMetaPath = oMetaModel.getMetaPath(oCreationRowContext.getPath());
										// prefill data from creation row
										oPayload = oCreationRowContext.getObject();
										mParameters.data = {};
										Object.keys(oPayload).forEach(function(sPropertyPath) {
											var oProperty = oMetaModel.getObject(sMetaPath + "/" + sPropertyPath);
											// ensure navigation properties are not part of the payload, deep create not supported
											if (oProperty && oProperty.$kind === "NavigationProperty") {
												return;
											}
											mParameters.data[sPropertyPath] = oPayload[sPropertyPath];
										});
										oValidationCheck = that._checkForValidationErrors(oCreationRowContext);
									}
									if (sCreationMode === CreationMode.CreationRow || sCreationMode === CreationMode.Inline) {
										// in case the creation failed we keep the failed context
										mParameters.keepTransientContextOnFailed = true;
										// busy handling shall be done locally only
										mParameters.busyMode = "Local";

										if (sCreationMode === CreationMode.Inline) {
											// As the transient lines are not fully implemented and some input from UX is missing
											// we deactivate it for Inline and keep it only for the CreationRow which is anyway
											// not yet final
											mParameters.keepTransientContextOnFailed = false;
										}
										// take care on message handling, draft indicator (in case of draft)
										// Attach the create sent and create completed event to the object page binding so that we can react
										that._handleCreateEvents(oListBinding);
									}

									oCreation = oValidationCheck.then(function() {
										if (!mParameters.parentControl) {
											mParameters.parentControl = that.getView();
										}
										return transactionHelper.createDocument(oListBinding, mParameters, oResourceBundle);
									});
								}

								var oNavigation;
								switch (sCreationMode) {
									case CreationMode.Deferred:
										oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
											bDeferredContext: true,
											editable: true
										});
										break;
									case CreationMode.Async:
										oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
											asyncContext: oCreation,
											editable: true
										});
										break;
									case CreationMode.Sync:
										mArgs = {
											editable: true
										};
										if (sProgrammingModel == ProgrammingModel.Sticky) {
											mArgs.transient = true;
										}
										oNavigation = oCreation.then(function(oNewDocumentContext) {
											if (!oNewDocumentContext) {
												var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
												return oRoutingListener.navigateToMessagePage(
													oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"),
													{
														title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
														description: oResourceBundle.getText("C_EDITFLOW_SAPFE_CREATION_FAILED_DESCRIPTION")
													}
												);
											} else {
												return oRoutingListener.navigateForwardToContext(oNewDocumentContext, mArgs);
											}
										});
										break;
									case CreationMode.Inline:
										oNavigation = handleSideEffects(oListBinding, oCreation);
										that.syncTask(oCreation);
										break;
									case CreationMode.CreationRow:
										// the creation row shall be cleared once the validation check was successful and
										// therefore the POST can be sent async to the backend
										oNavigation = oValidationCheck
											.then(function() {
												var oCreationRowListBinding = oCreationRowContext.getBinding(),
													oNewTransientContext;

												if (!mParameters.bSkipSideEffects) {
													handleSideEffects(oListBinding, oCreation);
												}

												oNewTransientContext = oCreationRowListBinding.create();
												oCreationRow.setBindingContext(oNewTransientContext);

												// this is needed to avoid console errors TO be checked with model colleagues
												oNewTransientContext.created().catch(function() {
													Log.trace("transient fast creation context deleted");
												});
												return oCreationRowContext.delete("$direct");
											})
											.catch(function(oError) {
												Log.error("CreationRow navigation error: ", oError);
											});
										break;
									default:
										oNavigation = Promise.reject("Unhandled creationMode " + sCreationMode);
										break;
								}

								if (sProgrammingModel === ProgrammingModel.Sticky) {
									that.getInternalModel().setProperty("/sessionOn", true);
								}
								if (oCreation) {
									return Promise.all([oCreation, oNavigation])
										.then(function(aParams) {
											that.setEditMode(EditMode.Editable, true);
											var oNewDocumentContext = aParams[0];
											if (oNewDocumentContext) {
												EditState.setEditStateDirty();

												if (sProgrammingModel === ProgrammingModel.Sticky) {
													that._handleStickyOn(oNewDocumentContext);
												}
											}
										})
										.catch(function(oError) {
											if (oError && oError.navigateBackFromTransientState) {
												oRoutingListener.navigateBackFromTransientState();
											}

											return Promise.reject(oError);
										});
								}
							});
					})
					.finally(function() {
						if (oTable && oTable.isA("sap.ui.mdc.Table")) {
							var fnFocusOrScroll =
								mParameters.creationMode === CreationMode.Inline
									? oTable.focusRow.bind(oTable)
									: oTable.scrollToIndex.bind(oTable);
							oTable.getRowBinding().attachEventOnce("change", function() {
								switch (mParameters.createAtEnd) {
									case true:
										if (oTable.data("tableType") === "ResponsiveTable" && oTable.getThreshold()) {
											fnFocusOrScroll(oTable.getThreshold(), true);
										} else {
											fnFocusOrScroll(iCountTableItems, true);
										}
										break;
									case false:
										fnFocusOrScroll(0, true);
										break;
								}
							});
						}
						bShouldBusyLock && BusyLocker.unlock(oLockObject);
					});
			},

			createMultipleDocuments: function(oListBinding, aData, bCreateAtEnd) {
				var that = this,
					transactionHelper = this.getTransactionHelper(),
					oLockObject = this.getGlobalUIModel(),
					oResourceBundle = that.getView().getController().oResourceBundle;

				BusyLocker.lock(oLockObject);
				return this.syncTask()
					.then(function() {
						var oModel = oListBinding.getModel(),
							oMetaModel = oModel.getMetaModel(),
							sMetaPath;

						if (oListBinding.getContext()) {
							sMetaPath = oMetaModel.getMetaPath(oListBinding.getContext().getPath() + "/" + oListBinding.getPath());
						} else {
							sMetaPath = oMetaModel.getMetaPath(oListBinding.getPath());
						}

						that._handleCreateEvents(oListBinding);

						// Iterate on all items and store the corresponding creation promise
						var aCreationPromises = aData.map(function(mPropertyValues) {
							var mParameters = { data: {} };

							mParameters.keepTransientContextOnFailed = true;
							mParameters.busyMode = "None";
							mParameters.creationMode = "CreationRow";
							mParameters.parentControl = that.getView();
							mParameters.createAtEnd = bCreateAtEnd;

							// Remove navigation properties as we don't support deep create
							for (var sPropertyPath in mPropertyValues) {
								var oProperty = oMetaModel.getObject(sMetaPath + "/" + sPropertyPath);
								if (oProperty && oProperty.$kind !== "NavigationProperty") {
									mParameters.data[sPropertyPath] = mPropertyValues[sPropertyPath];
								}
							}

							return transactionHelper.createDocument(oListBinding, mParameters, oResourceBundle);
						});

						return Promise.all(aCreationPromises);
					})
					.then(function() {
						var oBindingContext = that.getView().getBindingContext();

						// if there are transient contexts, we must avoid requesting side effects
						// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
						// if list binding is refreshed, transient contexts might be lost
						if (!CommonUtils.hasTransientContext(oListBinding)) {
							SideEffectsUtil.requestSideEffects(oListBinding.getPath(), oBindingContext);
						}
					})
					.catch(function(err) {
						Log.error("Error while creating multiple documents.");
						return Promise.reject(err);
					})
					.finally(function() {
						BusyLocker.unlock(oLockObject);
					});
			},

			editDocument: function(oContext, bPrepareOnEdit) {
				var that = this,
					transactionHelper = this.getTransactionHelper();

				return transactionHelper.editDocument(oContext, bPrepareOnEdit, that.getView()).then(function(oNewDocumentContext) {
					var sProgrammingModel = that.getProgrammingModel(oContext);

					if (sProgrammingModel === ProgrammingModel.Sticky) {
						that.getInternalModel().setProperty("/sessionOn", true);
					}
					that.setEditMode(EditMode.Editable, false);

					if (oNewDocumentContext !== oContext) {
						return that._handleNewContext(oNewDocumentContext, true).then(function() {
							if (sProgrammingModel === ProgrammingModel.Sticky) {
								// The stickyOn handler must be set after the navigation has been done,
								// as the URL may change in the case of FCL
								that._handleStickyOn(oNewDocumentContext);
							}
						});
					}
				});
			},

			updateDocument: function(oPatchPromise, oContext) {
				var that = this,
					transactionHelper = that.getTransactionHelper(),
					bIsDraft = that.getProgrammingModel(oContext) === ProgrammingModel.Draft;

				return this.syncTask(function() {
					transactionHelper.handleDocumentModifications();
					EditState.setEditStateDirty();
					messageHandling.removeBoundTransitionMessages();

					if (bIsDraft) {
						that.setDraftStatus(DraftStatus.Saving);
					}
					return oPatchPromise
						.then(
							function() {
								if (bIsDraft) {
									that.setDraftStatus(DraftStatus.Saved);
								}
							},
							function() {
								if (bIsDraft) {
									that.setDraftStatus(DraftStatus.Clear);
								}
							}
						)
						.finally(function() {
							var oBindingContext = that.getView().getBindingContext();
							messageHandling.showUnboundMessages(undefined, oBindingContext);
						});
				});
			},

			/*
			 * Saves a new document after checking it
			 *
			 * @name saveDocument
			 * @param {object} oContext
			 * @param {boolean} bExecuteSideEffectsOnError  	indicates if we have created a new item in the OP in order to not execute the handleSideEffects method if an item has not been created and the save fails
			 * @param {array} aBindings
			 * @returns {promise}
			 */
			saveDocument: function(oContext, bExecuteSideEffectsOnError, aBindings) {
				var that = this,
					transactionHelper = this.getTransactionHelper(),
					oResourceBundle = that.getView().getController().oResourceBundle;
				// first of all wait until all key-match-requests are done
				return (
					this.syncTask()
						// submit any open changes if there any (although there are validation/parse errors)
						.then(this._submitOpenChanges.bind(this, oContext))
						// check if there are any validation/parse errors
						.then(this._checkForValidationErrors.bind(this, oContext))
						// and finally if all user changes are submitted and valid save the document
						.then(
							transactionHelper.saveDocument.bind(
								transactionHelper,
								oContext,
								oResourceBundle,
								bExecuteSideEffectsOnError,
								aBindings
							)
						)
						.then(function(oActiveDocumentContext) {
							var sProgrammingModel = that.getProgrammingModel(oContext);

							that._removeContextsFromPages();
							if (sProgrammingModel === ProgrammingModel.Sticky) {
								that.getInternalModel().setProperty("/sessionOn", false);
								that._handleStickyOff(oContext);
							}

							that.setEditMode(EditMode.Display, false);

							if (oActiveDocumentContext !== oContext) {
								that._handleNewContext(oActiveDocumentContext, false);
							}
						})
						.catch(function(oError) {
							Log.error("Error while saving the document", oError);
						})
				);
			},

			cancelDocument: function(oContext, mParameters) {
				var that = this,
					transactionHelper = this.getTransactionHelper(),
					oResourceBundle = that.getView().getController().oResourceBundle;
				return this.syncTask()
					.then(transactionHelper.cancelDocument.bind(transactionHelper, oContext, mParameters, oResourceBundle))
					.then(function(oActiveDocumentContext) {
						var sProgrammingModel = that.getProgrammingModel(oContext);

						that._removeContextsFromPages();
						if (sProgrammingModel === ProgrammingModel.Sticky) {
							that.getInternalModel().setProperty("/sessionOn", false);
							that._handleStickyOff(oContext);
						}

						that.setEditMode(EditMode.Display, false);
						that.setDraftStatus(DraftStatus.Clear);

						//in case of a new document, the value of hasActiveEntity is returned. navigate back.
						if (!oActiveDocumentContext) {
							EditState.setEditStateDirty();
							that.getRoutingListener().navigateBackFromContext(oContext);
						} else if (sProgrammingModel === ProgrammingModel.Draft) {
							// We need to load the semantic keys of the active context, as we need them
							// for the navigation
							return that._fetchSemanticKeyValues(oActiveDocumentContext).then(function() {
								// We force the recreation of the context, so that it's created and bound in the same microtask,
								// so that all properties are loaded together by autoExpandSelect, so that when switching back to Edit mode
								// $$inheritExpandSelect takes all loaded properties into account (BCP 2070462265)
								return that._handleNewContext(oActiveDocumentContext, false, true);
							});
						} else {
							//active context is returned in case of cancel of existing document
							return that._handleNewContext(oActiveDocumentContext, false);
						}
					});
			},

			deleteDocument: function(oContext, mParameters) {
				var that = this;
				if (!mParameters) {
					mParameters = {
						bFindActiveContexts: false
					};
				} else {
					mParameters.bFindActiveContexts = false;
				}
				return this._deleteDocumentTransaction(oContext, mParameters).then(function() {
					// Single objet deletion is triggered from an OP header button (not from a list)
					// --> Mark UI dirty and navigate back to dismiss the OP
					EditState.setEditStateDirty();

					that.getRoutingListener().navigateBackFromContext(oContext);
				});
			},

			deleteMultipleDocuments: function(aContexts, mParameters) {
				var that = this,
					oRoutingListener = this.getRoutingListener(),
					oLockObject = this.getGlobalUIModel();
				var oTable = that.getView().byId(mParameters.controlId);
				if (!oTable || !oTable.isA("sap.ui.mdc.Table")) {
					throw new Error("parameter controlId missing or incorrect");
				}
				var oListBinding = oTable.getRowBinding();
				mParameters.bFindActiveContexts = true;
				BusyLocker.lock(oLockObject);
				return this._deleteDocumentTransaction(aContexts, mParameters)
					.then(function() {
						var oResult;

						// Multiple object deletion is triggered from a list
						// First clear the selection in the table as it's not valid any more
						oTable.clearSelection();

						// Then refresh the list-binding (LR), or require side-effects (OP)
						var oBindingContext = that.getView().getBindingContext();
						if (oListBinding.isRoot()) {
							// keep promise chain pending until refresh of listbinding is completed
							oResult = new Promise(function(resolve) {
								oListBinding.attachEventOnce("dataReceived", function() {
									resolve();
								});
							});
							oListBinding.refresh();
						} else if (oBindingContext) {
							// if there are transient contexts, we must avoid requesting side effects
							// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
							// if list binding is refreshed, transient contexts might be lost
							if (!CommonUtils.hasTransientContext(oListBinding)) {
								SideEffectsUtil.requestSideEffects(oListBinding.getPath(), oBindingContext);
							}
						}

						// deleting at least one object should also set the UI to dirty
						EditState.setEditStateDirty();

						// Finally, check if the current state can be impacted by the deletion, i.e. if there's
						// an OP displaying a deleted object. If yes navigate back to dismiss the OP
						for (var index = 0; index < aContexts.length; index++) {
							if (oRoutingListener.isCurrentStateImpactedBy(aContexts[index])) {
								oRoutingListener.navigateBackFromContext(aContexts[index]);
								break;
							}
						}

						return oResult;
					})
					.finally(function() {
						BusyLocker.unlock(oLockObject);
					});
			},

			_deleteDocumentTransaction: function(oContext, mParameters) {
				var that = this,
					oResourceBundle = this.getView().getController().oResourceBundle,
					transactionHelper = this.getTransactionHelper();

				mParameters = mParameters || {};

				// TODO: this setting and removing of contexts shouldn't be in the transaction helper at all
				// for the time being I kept it and provide the internal model context to not break something
				mParameters.internalModelContext = mParameters.id
					? this.getView()
							.byId(mParameters.id)
							.getBindingContext("internal")
					: null;

				return this.syncTask()
					.then(transactionHelper.deleteDocument.bind(transactionHelper, oContext, mParameters, oResourceBundle))
					.then(function() {
						that.getInternalModel().setProperty("/sessionOn", false);
					});
			},

			applyDocument: function(oContext) {
				var that = this,
					oLockObject = this.getGlobalUIModel();

				BusyLocker.lock(oLockObject);

				return (
					this._submitOpenChanges(oContext)
						// check if there are any validation/parse errors
						.then(this._checkForValidationErrors.bind(this, oContext))
						.then(function() {
							messageHandling.showUnboundMessages();
							that.getRoutingListener().navigateBackFromContext(oContext);
							return true;
						})
						.finally(function() {
							BusyLocker.unlock(oLockObject);
						})
				);
			},

			_submitOpenChanges: function(oContext) {
				var oModel = oContext.getModel();

				//Currently we are using only 1 updateGroupId, hence submitting the batch directly here
				return oModel.submitBatch("$auto").then(function() {
					if (oModel.hasPendingChanges("$auto")) {
						// the submit was not successful
						return Promise.reject("submit of open changes failed");
					}
				});
			},

			_handleStickyOn: function(oContext) {
				var that = this,
					oAppComponent = CommonUtils.getAppComponent(this.getView());

				if (!oAppComponent.getRouterProxy().hasNavigationGuard()) {
					var sHashTracker = oAppComponent.getRouterProxy().getHash(),
						oInternalModel = this.getInternalModel();

					// Set a guard in the RouterProxy
					// A timeout is necessary, as with deferred creation the hashChanger is not updated yet with
					// the new hash, and the guard cannot be found in the managed history of the router proxy
					setTimeout(function() {
						oAppComponent.getRouterProxy().setNavigationGuard();
					}, 0);

					// Setting back navigation on shell service, to get the dicard message box in case of sticky
					oAppComponent.getShellServices().setBackNavigation(that._onBackNavigationInSession.bind(that));

					this.fnDirtyStateProvider = function(oNavigationContext) {
						var sTargetHash = oNavigationContext.innerAppRoute,
							oRouterProxy = oAppComponent.getRouterProxy(),
							bDirty,
							bSessionON = oInternalModel.getProperty("/sessionOn");

						if (!bSessionON) {
							// If the sticky session was terminated before hand.
							// Eexample in case of navigating away from application using IBN.
							return;
						}

						if (!oRouterProxy.isNavigationFinalized()) {
							// If navigation is currently happening in RouterProxy, it's a transient state
							// (not dirty)
							bDirty = false;
							sHashTracker = sTargetHash;
						} else if (sHashTracker === sTargetHash) {
							// the hash didn't change so either the user attempts to refresh or to leave the app
							bDirty = true;
						} else if (oRouterProxy.checkHashWithGuard(sTargetHash) || oRouterProxy.isGuardCrossAllowedByUser()) {
							// the user attempts to navigate within the root object
							// or crossing the guard has already been allowed by the RouterProxy
							sHashTracker = sTargetHash;
							bDirty = false;
						} else {
							// the user attempts to navigate within the app, for example back to the list report
							bDirty = true;
						}

						if (bDirty) {
							// the FLP doesn't call the dirty state provider anymore once it's dirty, as they can't
							// change this due to compatibility reasons we set it back to not-dirty
							setTimeout(function() {
								oAppComponent.getShellServices().setDirtyFlag(false);
							}, 0);
						}

						return bDirty;
					};

					oAppComponent.getShellServices().registerDirtyStateProvider(this.fnDirtyStateProvider);

					var i18nModel = this.getView().getModel("sap.fe.i18n");

					this.fnHandleSessionTimeout = function() {
						// remove transient messages since we will showing our own message
						messageHandling.removeBoundTransitionMessages();
						messageHandling.removeUnboundTransitionMessages();

						var oDialog = new Dialog({
							title: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",
							state: "Warning",
							content: new Text({ text: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}" }),
							beginButton: new Button({
								text: "{sap.fe.i18n>C_COMMON_DIALOG_OK}",
								type: "Emphasized",
								press: function() {
									// remove sticky handling after navigation since session has already been terminated
									that._handleStickyOff();
									that.getRoutingListener().navigateBackFromContext(oContext);
								}
							}),
							afterClose: function() {
								oDialog.destroy();
							}
						});
						oDialog.addStyleClass("sapUiContentPadding");
						oDialog.setModel(i18nModel, "sap.fe.i18n");
						that.getView().addDependent(oDialog);
						oDialog.open();
					};
					// handle session timeout
					this.getView()
						.getModel()
						.attachSessionTimeout(this.fnHandleSessionTimeout);

					this._fnStickyDiscardAfterNavigation = function() {
						var sCurrentHash = oAppComponent.getRouterProxy().getHash();
						// either current hash is empty so the user left the app or he navigated away from the object
						if (!sCurrentHash || !oAppComponent.getRouterProxy().checkHashWithGuard(sCurrentHash)) {
							that._discardStickySession(oContext);
						}
					};
					oAppComponent.getRoutingService().attachRouteMatched(this._fnStickyDiscardAfterNavigation);
				}
			},
			_handleStickyOff: function() {
				var oAppComponent = CommonUtils.getAppComponent(this.getView());

				if (oAppComponent.getRouterProxy) {
					// If we have exited from the app, CommonUtils.getAppComponent doesn't return a
					// sap.fe.core.AppComponent, hence the 'if' above
					oAppComponent.getRouterProxy().discardNavigationGuard();
				}

				if (this.fnDirtyStateProvider) {
					oAppComponent.getShellServices().deregisterDirtyStateProvider(this.fnDirtyStateProvider);
					this.fnDirtyStateProvider = null;
				}

				if (this.getView().getModel() && this.fnHandleSessionTimeout) {
					this.getView()
						.getModel()
						.detachSessionTimeout(this.fnHandleSessionTimeout);
				}

				oAppComponent.getRoutingService().detachRouteMatched(this._fnStickyDiscardAfterNavigation);
				this._fnStickyDiscardAfterNavigation = null;

				this.setEditMode(EditMode.Display, false);

				if (oAppComponent) {
					// If we have exited from the app, CommonUtils.getAppComponent doesn't return a
					// sap.fe.core.AppComponent, hence the 'if' above
					oAppComponent.getShellServices().setBackNavigation();
				}
			},

			_handleNewContext: function(oContext, bEditable, bRecreateContext) {
				EditState.setEditStateDirty();

				return this.getRoutingListener().navigateToContext(oContext, {
					checkNoHashChange: true,
					editable: bEditable,
					bPersistOPScroll: true,
					bRecreateContext: bRecreateContext
				});
			},

			/**
			 * create a new promise to wait for an Action to be executed
			 * @function
			 * @name createActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 *
			 * @returns {Function} the resolver function . It can be used to externally resolve the promise
			 */

			createActionPromise: function(sActionName, sControlId) {
				var that = this,
					fResolver,
					fRejector;
				this.oActionPromise = new Promise(function(resolve, reject) {
					fResolver = resolve;
					fRejector = reject;
				}).then(function(oResponse) {
					return Object.assign({ controlId: sControlId }, that._getActionResponseDataAndKeys(sActionName, oResponse));
				});
				return { fResolver: fResolver, fRejector: fRejector };
			},

			/**
			 * Get the getCurrentActionPromise object.
			 *
			 * @function
			 * @name getCurrentActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 *
			 * @returns {Promise} return a the Promise
			 */
			getCurrentActionPromise: function() {
				return this.oActionPromise;
			},

			/**
			 * Delete a previously created promise.
			 *
			 * @function
			 * @name deleteCurrentActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 */
			deleteCurrentActionPromise: function() {
				this.oActionPromise = null;
			},

			/**
			 * Invokes an action - bound/unbound and sets the page dirty.
			 *
			 * @static
			 * @name sap.fe.core.controllerextensions.EditFlow.invokeAction
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action to be called
			 * @param {map} [mParameters] contains the following attributes:
			 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] contexts Mandatory for a bound action, Either one context or an array with contexts for which the action shall be called
			 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] oModel Mandatory for an unbound action, An instance of an OData v4 model
			 * @param {boolean} [mParameters.bStaticAction] boolean value for static action, undefined for other actions
			 * @param {boolean} [mParameters.isNavigable] boolean value indicating whether the action is navigatable or not
			 * @param {string} [mParameters.label] a human-readable label for the action
			 * @returns {Promise}
			 * @ui5-restricted
			 * @final
			 **/
			invokeAction: function(sActionName, mParameters) {
				var that = this,
					oTable,
					transactionHelper = this.getTransactionHelper(),
					oControl,
					oBindingContext,
					aParts,
					sOverloadEntityType,
					oCurrentActionCallBacks;
				var oView = this.getView();

				if (!mParameters.parentControl) {
					mParameters.parentControl = this.getView();
				}

				if (mParameters.prefix) {
					oTable = this.getView().byId(mParameters.prefix);
					if (oTable) {
						// TODO: currently this selected contexts update is done within the operation, should be moved out
						mParameters.internalModelContext = oTable.getBindingContext("internal");
					}
				}

				if (sActionName && sActionName.indexOf("(") > -1) {
					// get entity type of action overload and remove it from the action path
					// Example sActionName = "<ActionName>(Collection(<OverloadEntityType>))"
					// sActionName = aParts[0] --> <ActionName>
					// sOverloadEntityType = aParts[2] --> <OverloadEntityType>
					aParts = sActionName.split("(");
					sActionName = aParts[0];
					sOverloadEntityType = aParts[aParts.length - 1].replaceAll(")", "");
				}

				if (mParameters.bStaticAction) {
					if (oTable.isTableBound()) {
						mParameters.contexts = oTable.getRowBinding().getHeaderContext();
					} else {
						var sBindingPath = oTable.data("rowsBindingInfo").path,
							oListBinding = new ODataListBinding(that.getView().getModel(), sBindingPath);
						mParameters.contexts = oListBinding.getHeaderContext();
					}

					if (sOverloadEntityType) {
						var sTableContextEntityType = mParameters.contexts
							.getModel()
							.getMetaModel()
							.getMetaContext(mParameters.contexts.getPath())
							.getObject("$Type");
						if (sOverloadEntityType !== sTableContextEntityType) {
							// search for context in control tree hierarchy
							oControl = oTable;
							while (oControl) {
								oBindingContext = oControl.getBindingContext();
								if (
									oBindingContext &&
									oBindingContext
										.getModel()
										.getMetaModel()
										.getMetaContext(oBindingContext.getPath())
										.getObject("$Type") === sOverloadEntityType
								) {
									mParameters.contexts = oBindingContext;
									break;
								} else {
									// check parent
									oControl = oControl.getParent();
								}
							}
							if (!mParameters.contexts) {
								return Promise.reject("Context not found for entity type " + sOverloadEntityType);
							}
						}
					}

					if (mParameters.enableAutoScroll) {
						oCurrentActionCallBacks = this.createActionPromise(sActionName, oTable.sId);
					}
				}

				if (mParameters.isNavigable) {
					mParameters.bGetBoundContext = false;
				} else {
					mParameters.bGetBoundContext = true;
				}
				return this.syncTask()
					.then(transactionHelper.callAction.bind(transactionHelper, sActionName, mParameters))
					.then(function(oResponse) {
						// if the returned context for the bound action is different than the context on which action was called,
						// refresh the corresponding list binding
						return that
							._refreshListIfRequired(that._getActionResponseDataAndKeys(sActionName, oResponse), mParameters.contexts[0])
							.then(function() {
								return oResponse;
							});
					})
					.then(function(oResponse) {
						if (oCurrentActionCallBacks) {
							oCurrentActionCallBacks.fResolver(oResponse);
						}
						/*
					 We set the (upper) pages to dirty after an execution of an action
					 TODO: get rid of this workaround
					 This workaround is only needed as long as the model does not support the synchronization.
					 Once this is supported we don't need to set the pages to dirty anymore as the context itself
					 is already refreshed (it's just not reflected in the object page)
					 we explicitly don't call this method from the list report but only call it from the object page
					 as if it is called in the list report it's not needed - as we anyway will remove this logic
					 we can live with this
					 we need a context to set the upper pages to dirty - if there are more than one we use the
					 first one as they are anyway siblings
					 */
						if (mParameters.contexts) {
							EditState.setEditStateDirty();
						}
						if (mParameters.isNavigable) {
							var vContext = oResponse;
							if (Array.isArray(vContext) && vContext.length === 1) {
								vContext = vContext[0];
							}
							if (vContext && !Array.isArray(vContext)) {
								var oMetaModel = oView.getModel().getMetaModel();
								var sContextMetaPath = oMetaModel.getMetaPath(vContext.getPath());
								var oActionContext = Array.isArray(mParameters.contexts) ? mParameters.contexts[0] : mParameters.contexts;
								var sActionContextMetaPath = oActionContext && oMetaModel.getMetaPath(oActionContext.getPath());
								if (sContextMetaPath != undefined && sContextMetaPath === sActionContextMetaPath) {
									if (oActionContext.getPath() !== vContext.getPath()) {
										that.getRoutingListener().navigateForwardToContext(vContext, {
											noHistoryEntry: false
										});
									} else {
										Log.info("Navigation to the same context is not allowed");
									}
								}
							}
						}
					})
					.catch(function(err) {
						if (oCurrentActionCallBacks) {
							oCurrentActionCallBacks.fRejector();
						}
						if (err == Constants.CancelActionDialog) {
							return Promise.reject("Dialog cancelled.");
						} else {
							return Promise.reject("Error in EditFlow.invokeAction:" + err);
						}
					});
			},

			/**
			 * Handles the create event: shows messages and in case of draft updates draft indicator.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oBinding odata list binding object
			 */
			_handleCreateEvents: function(oBinding) {
				var that = this,
					sProgrammingModel;
				if (that.editFlow) {
					that = that.editFlow;
				}
				var transactionHelper = that.getTransactionHelper();

				that.setDraftStatus(DraftStatus.Clear);

				oBinding = (oBinding.getBinding && oBinding.getBinding()) || oBinding;
				sProgrammingModel = that.getProgrammingModel(oBinding);

				oBinding.attachEvent("createSent", function() {
					transactionHelper.handleDocumentModifications();
					if (sProgrammingModel === ProgrammingModel.Draft) {
						that.setDraftStatus(DraftStatus.Saving);
					}
				});
				oBinding.attachEvent("createCompleted", function(oEvent) {
					var bSuccess = oEvent.getParameter("success");
					if (sProgrammingModel === ProgrammingModel.Draft) {
						that.setDraftStatus(bSuccess ? DraftStatus.Saved : DraftStatus.Clear);
					}
					messageHandling.showUnboundMessages();
				});
			},

			/**
			 * The method decided if a document is to be shown in display or edit mode
			 * @function
			 * @name computeEditMode
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.Context} context The context to be displayed / edited
			 * @returns {Promise} Promise resolves once the edit mode is computed
			 */

			computeEditMode: function(oContext) {
				var that = this;

				return Promise.resolve(
					(function() {
						var sProgrammingModel = that.getProgrammingModel(oContext);

						if (sProgrammingModel === ProgrammingModel.Draft) {
							that.setDraftStatus(DraftStatus.Clear);

							return oContext
								.requestObject("IsActiveEntity")
								.then(function(bIsActiveEntity) {
									if (bIsActiveEntity === false) {
										// in case the document is draft set it in edit mode
										that.setEditMode(EditMode.Editable);
										return oContext.requestObject("HasActiveEntity").then(function(bHasActiveEntity) {
											that.setEditMode(undefined, !bHasActiveEntity);
										});
									} else {
										// active document, stay on display mode
										that.setEditMode(EditMode.Display, false);
									}
								})
								.catch(function(oError) {
									Log.error("Error while determining the editMode for draft", oError);
									throw oError;
								});
						}
					})()
				);
			},

			/**
			 * Checks if there are validation (parse) errors for controls bound to a given context
			 * @function
			 * @name _checkForValidationErrors
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.Context} context which should be checked
			 * @returns {Promise} Promise resolves if there are no validation errors and rejects if there are any
			 */

			_checkForValidationErrors: function(oContext) {
				return this.syncTask().then(function() {
					var sPath = oContext.getPath(),
						aMessages = sap.ui
							.getCore()
							.getMessageManager()
							.getMessageModel()
							.getData(),
						oControl,
						oMessage;

					if (!aMessages.length) {
						return Promise.resolve("No validation errors found");
					}

					for (var i = 0; i < aMessages.length; i++) {
						oMessage = aMessages[i];
						if (oMessage.validation) {
							oControl = sap.ui.getCore().byId(oMessage.getControlId());
							if (
								oControl &&
								oControl.getBindingContext() &&
								oControl
									.getBindingContext()
									.getPath()
									.indexOf(sPath) === 0
							) {
								return Promise.reject("validation errors exist");
							}
						}
					}
				});
			},

			getTransactionHelper: function() {
				if (!this._oTransactionHelper) {
					var oAppComponent = CommonUtils.getAppComponent(this.getView());
					// currently also the transaction helper is locking therefore passing lock object
					this._oTransactionHelper = new TransactionHelper(oAppComponent, this.getGlobalUIModel());
				}

				return this._oTransactionHelper;
			},
			/**
			 * @description Method to bring discard popover in case of exiting sticky session.
			 *
			 * @function
			 * @name _onBackNavigationInSession
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 */
			_onBackNavigationInSession: function() {
				var that = this,
					oView = that.getView(),
					oAppComponent = CommonUtils.getAppComponent(oView),
					oRouterProxy = oAppComponent.getRouterProxy();

				if (oRouterProxy.checkIfBackIsOutOfGuard()) {
					var oBindingContext = oView && oView.getBindingContext();

					CommonUtils.processDataLossConfirmation(
						function() {
							that._discardStickySession(oBindingContext);
							history.back();
						},
						oView,
						that.getProgrammingModel(oBindingContext)
					);

					return;
				}
				history.back();
			},

			_discardStickySession: function(oContext) {
				sticky.discardDocument(oContext);
				this._handleStickyOff();
			},

			/**
			 * @function
			 * @name _getActionResponseDataAndKeys
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action executed
			 * @param {object} oResponse The bound action's response data or response context
			 * @returns {object} Object with data and key fields' names of the response
			 */
			_getActionResponseDataAndKeys: function(sActionName, oResponse) {
				if (Array.isArray(oResponse)) {
					if (oResponse.length === 1) {
						oResponse = oResponse[0];
					} else {
						return null;
					}
				}
				if (!oResponse) {
					return null;
				}
				var oView = this.getView(),
					oMetaModel = oView
						.getModel()
						.getMetaModel()
						.getData(),
					sActionReturnType =
						oMetaModel && oMetaModel[sActionName] && oMetaModel[sActionName][0] && oMetaModel[sActionName][0].$ReturnType
							? oMetaModel[sActionName][0].$ReturnType.$Type
							: null,
					aKey = sActionReturnType && oMetaModel[sActionReturnType] ? oMetaModel[sActionReturnType].$Key : null;

				return {
					oData: oResponse.getObject(),
					keys: aKey
				};
			},

			/**
			 * @function
			 * @name _refreshListIfRequired
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oResponse The bound action's response data and key fields' names
			 * @param {sap.ui.model.odata.v4.Context} oContext The bound context on which action was executed
			 * @returns {Promise} Always resolves to param oResponse
			 */
			_refreshListIfRequired: function(oResponse, oContext) {
				if (!oContext || !oResponse || !oResponse.oData) {
					return Promise.resolve();
				}
				var oBinding = oContext.getBinding();
				// refresh only lists
				if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					var oContextData = oResponse.oData,
						aKeys = oResponse.keys,
						oCurrentData = oContext.getObject(),
						bReturnedContextIsSame = true;
					// ensure context is in the response
					if (Object.keys(oContextData).length) {
						// check if context in response is different than the bound context
						bReturnedContextIsSame = aKeys.every(function(sKey) {
							return oCurrentData[sKey] === oContextData[sKey];
						});
						if (!bReturnedContextIsSame) {
							return new Promise(function(resolve, reject) {
								if (oBinding.isRoot()) {
									oBinding.attachEventOnce("dataReceived", function() {
										resolve();
									});
									oBinding.refresh();
								} else {
									oBinding
										.getContext()
										.requestSideEffects([{ $NavigationPropertyPath: oBinding.getPath() }])
										.then(
											function() {
												resolve();
											},
											function() {
												Log.error("Error while refreshing the table");
												resolve();
											}
										)
										.catch(function(e) {
											Log.error("Error while refreshing the table", e);
										});
								}
							});
						}
					}
				}
				// resolve with oResponse to not disturb the promise chain afterwards
				return Promise.resolve();
			},

			_fetchSemanticKeyValues: function(oContext) {
				var oMetaModel = oContext.getModel().getMetaModel(),
					sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name"),
					aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName);

				if (aSemanticKeys && aSemanticKeys.length) {
					var aRequestPromises = aSemanticKeys.map(function(oKey) {
						return oContext.requestObject(oKey.$PropertyPath);
					});

					return Promise.all(aRequestPromises);
				} else {
					return Promise.resolve();
				}
			},

			// Ugly Workaround to overcome mdc field issue, we remove the binding context before
			// switching to display mode to avoid the field reads additional values for non existing
			// drafts or sticky sessions in the backend
			_removeContextsFromPages: function() {
				var aPages = [];
				var oAppComponent = CommonUtils.getAppComponent(this.getView());
				if (oAppComponent._isFclEnabled()) {
					aPages = aPages.concat(oAppComponent.getRootContainer().getMidColumnPages() || []);
					aPages = aPages.concat(oAppComponent.getRootContainer().getEndColumnPages() || []);
				} else {
					aPages = oAppComponent.getRootContainer().getPages() || [];
				}

				aPages.forEach(function(oPage) {
					if (oPage.isA("sap.ui.core.ComponentContainer")) {
						oPage = oPage.getComponentInstance(); // The binding context is set at the component level, not the component container
					}

					if (oPage.getBindingContext()) {
						oPage.setBindingContext(null);
					}
				});
			}
		});

		return Extension;
	}
);
