/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

// Provides static functions for the draft programming model
sap.ui.define(
	[
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/Text",
		"sap/m/MessageBox",
		"sap/fe/core/actions/messageHandling",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/SideEffectsUtil",
		"sap/base/Log"
	],
	function(Dialog, Button, Text, MessageBox, messageHandling, CommonUtils, SideEffectsUtil, Log) {
		"use strict";

		/**
		 * Interface for callbacks used in the functions
		 *
		 *
		 * @author SAP SE
		 * @since 1.54.0
		 * @interface
		 * @name sap.fe.core.actions.draft.ICallback
		 * @private
		 */

		/**
		 * Callback to approve or reject the creation of a draft
		 * @name sap.fe.core.actions.draft.ICallback.beforeCreateDraftFromActiveDocument
		 * @function
		 * @static
		 * @abstract
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
		 * @returns {(boolean|Promise)} Approval of draft creation [true|false] or Promise that resolves with the boolean value
		 *
		 * @private
		 */

		/**
		 * Callback after a draft was successully created
		 * @name sap.fe.core.actions.draft.ICallback.afterCreateDraftFromActiveDocument
		 * @function
		 * @static
		 * @abstract
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the new draft
		 * @param {sap.ui.model.odata.v4.Context} oActiveDocumentContext Context of the active document for the new draft
		 * @returns {sap.ui.model.odata.v4.Context} oActiveDocumentContext
		 *
		 * @private
		 */

		/**
		 * Callback to approve or reject overwriting an unsaved draft of another user
		 * @name sap.fe.core.actions.draft.ICallback.whenDecisionToOverwriteDocumentIsRequired
		 * @function
		 * @public
		 * @static
		 * @abstract
		 *
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
		 * @returns {(boolean|Promise)} Approval to overwrite unsaved draft [true|false] or Promise that resolves with the boolean value
		 *
		 * @ui5-restricted
		 */

		/* Constants for draft operations */
		var draftOperations = {
			EDIT: "EditAction",
			ACTIVATION: "ActivationAction",
			DISCARD: "DiscardAction",
			PREPARE: "PreparationAction"
		};

		/**
		 * Determines action name for a draft operation.
		 *
		 * @param {sap.ui.model.odata.v4.Context} oContext The context that should be bound to the operation
		 * @param {string} sOperation The operation name
		 * @returns {string} The name of the draft operation
		 */
		function getActionName(oContext, sOperation) {
			var oModel = oContext.getModel(),
				oMetaModel = oModel.getMetaModel(),
				sEntitySetPath = oMetaModel.getMetaPath(oContext.getPath());

			return oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot/" + sOperation);
		}

		/**
		 * Creates an operation context binding for the given context and operation.
		 *
		 * @param {sap.ui.model.odata.v4.Context} oContext The context that should be bound to the operation
		 * @param {string} sOperation The operation (action or function import)
		 * @param oOptions options to create the operation context
		 * @returns {sap.ui.model.odata.v4.ODataContextBinding} The context binding of the bound operation
		 */
		function createOperation(oContext, sOperation, oOptions) {
			var sOperationName = getActionName(oContext, sOperation);

			return oContext.getModel().bindContext(sOperationName + "(...)", oContext, oOptions);
		}

		/**
		 * Check if optional draft prepare action exists.
		 *
		 * @param {sap.ui.model.odata.v4.Context} oContext The context that should be bound to the operation
		 * @returns {boolean} True if a a prepare action exists
		 */
		function hasPrepareAction(oContext) {
			return !!getActionName(oContext, draftOperations.PREPARE);
		}

		/**
		 * Creates a new draft from an active document.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the action should be performed
		 * @param {boolean} bPreserveChanges
		 *  <ul>
		 * 		<li>true - existing changes from another user that are not locked are preserved and an error message (http status 409) is send from the backend</li>
		 * 		<li>false - existing changes from another user that are not locked are overwritten</li>
		 * 	</ul>
		 * @returns {Promise.<sap.ui.model.odata.v4.Context>} Resolve function returns the context of the operation
		 * @private
		 * @ui5-restricted
		 */

		function executeDraftEditAction(oContext, bPreserveChanges) {
			if (oContext.getProperty("IsActiveEntity")) {
				var oOptions = { $$inheritExpandSelect: true };
				var oOperation = createOperation(oContext, draftOperations.EDIT, oOptions);
				oOperation.setParameter("PreserveChanges", bPreserveChanges);
				var oEditPromise = oOperation.execute("direct").then(function(oDraftDocumentContext) {
					return oDraftDocumentContext;
				});
				oOperation.getModel().submitBatch("direct");
				return oEditPromise;
			} else {
				throw new Error("The edit action cannot be executed on a draft document");
			}
		}

		/**
		 * Activates a draft document. The draft will replace the sibling entity and will be deleted by the backend.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the action should be performed
		 * @param {string} [sGroupId] the optional batch group where we want to execute the operation in
		 * @returns {Promise.<sap.ui.model.odata.v4.Context>} Resolve function returns the context of the operation
		 * @private
		 * @ui5-restricted
		 */

		function executeDraftActivationAction(oContext, sGroupId) {
			if (!oContext.getProperty("IsActiveEntity")) {
				var oOperation = createOperation(oContext, draftOperations.ACTIVATION, { $$inheritExpandSelect: true });
				return oOperation
					.execute(sGroupId)
					.then(function(oActiveDocumentContext) {
						return oActiveDocumentContext;
					})
					.catch(
						//if ACTIVATE action fails then we request either the sideEffects against PREPARE action (if annotated) or the messages as fallback:
						function() {
							if (hasPrepareAction(oContext)) {
								var sActionName = getActionName(oContext, draftOperations.PREPARE),
									oBindingParameters = SideEffectsUtil.getSideEffectsForAction(sActionName, oContext),
									aTargetPaths = oBindingParameters && oBindingParameters.pathExpressions;
								if (aTargetPaths) {
									oContext.requestSideEffects(aTargetPaths).catch(function(oError) {
										Log.error("Error while requesting side effects", oError);
									});
								} else {
									requestMessages(oContext).catch(function(oError) {
										Log.error("Error while requesting messages", oError);
									});
								}
							}
							return Promise.reject();
						}
					);
			} else {
				throw new Error("The activation action cannot be executed on an active document");
			}
		}

		/**
		 * Execute a preparation action.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the action should be performed
		 * @param {string} [sGroupId] the optional batch group where we want to execute the operation in
		 * @param {boolean} [bPrepareForEdit] shall the messages be requested if supported by service
		 * @returns {Promise.<sap.ui.model.odata.v4.Context>} Resolve function returns the context of the operation
		 * @private
		 * @ui5-restricted
		 */
		function executeDraftPreparationAction(oContext, sGroupId, bPrepareForEdit) {
			if (!oContext.getProperty("IsActiveEntity")) {
				var oOperation = createOperation(oContext, draftOperations.PREPARE);

				// TODO: side effects qualifier shall be even deprecated to be checked
				oOperation.setParameter("SideEffectsQualifier", "");

				sGroupId = sGroupId || oOperation.getGroupId();
				var oPreparationPromise = oOperation
					.execute(sGroupId)
					.then(function() {
						return oOperation;
					})
					.catch(function(oError) {
						Log.error("Error while executing the operation", oError);
					});

				if (bPrepareForEdit) {
					// if PREPARE action is triggered after Edit then either the sideEffects (if annotated against PREPARE) are executed or the messages are requested as fallback if no sideEffects:
					var sActionName = getActionName(oContext, draftOperations.PREPARE),
						oBindingParameters = SideEffectsUtil.getSideEffectsForAction(sActionName, oContext),
						aTargetPaths = oBindingParameters && oBindingParameters.pathExpressions;
					if (aTargetPaths) {
						oContext.requestSideEffects(aTargetPaths, sGroupId).catch(function(oError) {
							Log.error("Error while requesting side effects", oError);
						});
					} else {
						requestMessages(oContext);
					}
				}
				return oPreparationPromise;
			} else {
				throw new Error("The preparation action cannot be executed on an active document");
			}
		}

		/**
		 * Determines the message path for a context.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the path shall be determined
		 * @returns {string} message path, empty if not annotated
		 * @private
		 * @ui5-restricted
		 */
		function getMessagesPath(oContext) {
			var oModel = oContext.getModel(),
				oMetaModel = oModel.getMetaModel(),
				sEntitySetPath = oMetaModel.getMetaPath(oContext.getPath());
			return oMetaModel.getObject(sEntitySetPath + "/@com.sap.vocabularies.Common.v1.Messages/$Path");
		}

		/**
		 * Requests the messages if annotated for a given context.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the messages shall be requested
		 * @returns {Promise} Promise which is resolved once messages were requested
		 * @private
		 * @ui5-restricted
		 */
		function requestMessages(oContext) {
			var sMessagesPath = getMessagesPath(oContext);
			if (sMessagesPath) {
				return oContext.requestSideEffects([{ $PropertyPath: sMessagesPath }]);
			}
		}

		/**
		 * Executes discard of a draft function using HTTP Post.
		 *
		 * @function
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the action should be performed
		 * @returns {Promise.<sap.ui.model.odata.v4.Context>} Resolve function returns the context of the operation
		 * @private
		 * @ui5-restricted
		 */

		function executeDraftDiscardAction(oContext) {
			if (!oContext.getProperty("IsActiveEntity")) {
				var oDiscardOperation = createOperation(oContext, draftOperations.DISCARD);
				var oDiscardPromise = oDiscardOperation.execute("direct");
				oContext.getModel().submitBatch("direct");
				return oDiscardPromise;
			} else {
				throw new Error("The discard action cannot be executed on an active document");
			}
		}

		/**
		 * Creates a draft document from an existing document.
		 *
		 * The function supports several hooks as there is a certain coreography defined.
		 *
		 * @function
		 * @name sap.fe.core.actions.draft#createDraftFromActiveDocument
		 * @memberof sap.fe.core.actions.draft
		 * @static
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
		 * @param {object} mParameters The parameters
		 * @param {boolean} [mParameters.bPreserveChanges] [true] Preserve changes of an existing draft of another user
		 * @param {boolean} [mParameters.bPrepareOnEdit] [false] Also call prepare when calling draft creation
		 * @param {sap.fe.core.actions.draft.ICallback.beforeCreateDraftFromActiveDocument} [mParameters.fnBeforeCreateDraftFromActiveDocument] Callback that allows veto before create request is executed
		 * @param {sap.fe.core.actions.draft.ICallback.afterCreateDraftFromActiveDocument} [mParameters.fnAfterCreateDraftFromActiveDocument] Callback for postprocessiong after draft document was created
		 * @param {sap.fe.core.actions.draft.ICallback.whenDecisionToOverwriteDocumentIsRequired} [mParameters.fnWhenDecisionToOverwriteDocumentIsRequired] Callback for deciding on overwriting an unsaved change by another user
		 * @returns {Promise} Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
		 * @private
		 * @ui5-restricted
		 */
		function createDraftFromActiveDocument(oContext, mParameters) {
			var mParam = mParameters || {},
				localI18nRef = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
				bRunPreserveChangesFlow =
					typeof mParam.bPreserveChanges === "undefined" ||
					(typeof mParam.bPreserveChanges === "boolean" && mParam.bPreserveChanges); //default true

			/**
			 * Overwrite or reject based on fnWhenDecisionToOverwriteDocumentIsRequired.
			 *
			 * @param {*} bOverwrite Overwrite the change or not
			 * @returns {Promise} Resolves with result of {@link sap.fe.core.actions#executeDraftEditAction}
			 */
			function overwriteOnDemand(bOverwrite) {
				if (bOverwrite) {
					//Overwrite existing changes
					var oModel = oContext.getModel(),
						oResourceBundle,
						draftDataContext = oModel.bindContext(oContext.getPath() + "/DraftAdministrativeData").getBoundContext();
					return mParameters.oView
						.getModel("sap.fe.i18n")
						.getResourceBundle()
						.then(function(_oResourceBundle) {
							oResourceBundle = _oResourceBundle;
							return draftDataContext.requestObject();
						})
						.then(function(draftAdminData) {
							if (draftAdminData) {
								// remove all unbound transition messages as we show a special dialog
								messageHandling.removeUnboundTransitionMessages();
								var sInfo = draftAdminData.InProcessByUserDescription || draftAdminData.InProcessByUser;
								var sEntitySet = mParameters.oView.getViewData().entitySet;
								if (sInfo) {
									var sLockedByUserMsg = CommonUtils.getTranslatedText(
										"C_DRAFT_OBJECT_PAGE_DRAFT_LOCKED_BY_USER",
										oResourceBundle,
										sInfo,
										sEntitySet
									);
									MessageBox.error(sLockedByUserMsg);
									throw new Error(sLockedByUserMsg);
								} else {
									sInfo = draftAdminData.CreatedByUserDescription || draftAdminData.CreatedByUser;
									var sUnsavedChangesMsg = CommonUtils.getTranslatedText(
										"C_DRAFT_OBJECT_PAGE_DRAFT_UNSAVED_CHANGES",
										oResourceBundle,
										sInfo,
										sEntitySet
									);
									return showMessageBox(sUnsavedChangesMsg).then(function() {
										return executeDraftEditAction(oContext, false);
									});
								}
							}
						});
				}
				return Promise.reject(new Error("Draft creation aborted for document: " + oContext.getPath()));
			}

			function showMessageBox(sUnsavedChangesMsg) {
				return new Promise(function(resolve, reject) {
					var oDialog = new Dialog({
						title: localI18nRef.getText("C_DRAFT_OBJECT_PAGE_WARNING"),
						state: "Warning",
						content: new Text({
							text: sUnsavedChangesMsg
						}),
						beginButton: new Button({
							text: localI18nRef.getText("C_COMMON_OBJECT_PAGE_EDIT"),
							type: "Emphasized",
							press: function() {
								oDialog.close();
								resolve(true);
							}
						}),
						endButton: new Button({
							text: localI18nRef.getText("C_COMMON_OBJECT_PAGE_CANCEL"),
							press: function() {
								oDialog.close();
								reject("Draft creation aborted for document: " + oContext.getPath());
							}
						}),
						afterClose: function() {
							oDialog.destroy();
						}
					});
					oDialog.addStyleClass("sapUiContentPadding");
					oDialog.open();
				});
			}

			if (!oContext) {
				return Promise.reject(new Error("Binding context to active document is required"));
			}

			return Promise.resolve(
				mParam.fnBeforeCreateDraftFromActiveDocument
					? mParam.fnBeforeCreateDraftFromActiveDocument(oContext, bRunPreserveChangesFlow)
					: true
			)
				.then(function(bExecute) {
					if (!bExecute) {
						throw new Error("Draft creation was aborted by extension for document: " + oContext.getPath());
					}
					return executeDraftEditAction(oContext, bRunPreserveChangesFlow).catch(function(oResponse) {
						//Only call back if error 409
						if (bRunPreserveChangesFlow && oResponse.status === 409) {
							return Promise.resolve(
								mParam.fnWhenDecisionToOverwriteDocumentIsRequired
									? mParam.fnWhenDecisionToOverwriteDocumentIsRequired()
									: true
							).then(overwriteOnDemand);
						} else {
							throw new Error(oResponse);
						}
					});
				})
				.then(function(oDraftContext) {
					return Promise.resolve(
						mParam.fnAfterCreateDraftFromActiveDocument
							? mParam.fnAfterCreateDraftFromActiveDocument(oContext, oDraftContext)
							: oDraftContext
					);
				})
				.then(function(oDraftContext) {
					if (mParam.bPrepareOnEdit && hasPrepareAction(oDraftContext)) {
						return executeDraftPreparationAction(oDraftContext, undefined, true).then(function() {
							return oDraftContext;
						});
					}
					return oDraftContext;
				})
				.catch(function(exc) {
					return Promise.reject(exc);
				});
		}

		/**
		 * Creates an active document from a draft document.
		 *
		 * The function supports several hooks as there is a certain choreography defined.
		 *
		 * @function
		 * @name sap.fe.core.actions.draft#activateDocument
		 * @memberof sap.fe.core.actions.draft
		 * @static
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document for the new draft
		 * @param {object} mParameters The parameters
		 * @param {sap.fe.core.actions.draft.ICallback.fnBeforeActivateDocument} [mParameters.fnBeforeActivateDocument] Callback that allows veto before create request is executed
		 * @param {sap.fe.core.actions.draft.ICallback.fnAfterActivateDocument} [mParameters.fnAfterActivateDocument] Callback for postprocessiong after document was activated.
		 * @returns {Promise} Promise resolves with the {@link sap.ui.model.odata.v4.Context context} of the new draft document
		 * @private
		 * @ui5-restricted
		 */
		function activateDocument(oContext, mParameters) {
			var mParam = mParameters || {};

			if (!oContext) {
				return Promise.reject(new Error("Binding context to draft document is required"));
			}
			return Promise.resolve(mParam.fnBeforeActivateDocument ? mParam.fnBeforeActivateDocument(oContext) : true)
				.then(function(bExecute) {
					if (!bExecute) {
						return Promise.reject(
							new Error("Activation of the document was aborted by extension for document: " + oContext.getPath())
						);
					}

					if (!hasPrepareAction(oContext)) {
						return executeDraftActivationAction(oContext);
					}

					/* activation requires preparation */
					var sBatchGroup = "draft";
					// we use the same batchGroup to force prepare and activate in a same batch but with different changeset
					var oPreparePromise = executeDraftPreparationAction(oContext, sBatchGroup, false);
					oContext.getModel().submitBatch(sBatchGroup);

					var oActivatePromise = executeDraftActivationAction(oContext, sBatchGroup);

					return Promise.all([oPreparePromise, oActivatePromise])
						.then(function(values) {
							return values[1];
						})
						.catch(function(exc) {
							return Promise.reject(exc);
						});
				})
				.then(function(oActiveDocumentContext) {
					return Promise.resolve(
						mParam.fnAfterActivateDocument
							? mParam.fnAfterActivateDocument(oContext, oActiveDocumentContext)
							: oActiveDocumentContext
					);
				})
				.catch(function(exc) {
					return Promise.reject(exc);
				});
		}

		/**
		 * HTTP POST call when DraftAction is present for Draft Delete; HTTP DELETE for Draft(when no DraftAction)
		 * and Active Instance uses DELETE always.
		 *
		 * @function
		 * @name sap.fe.core.actions.draft#deleteDraft
		 * @memberof sap.fe.core.actions.draft
		 * @static
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be discarded
		 * @private
		 * @returns {Promise}
		 * @ui5-restricted
		 */
		function deleteDraft(oContext) {
			var sDiscardAction = getActionName(oContext, draftOperations.DISCARD),
				bIsActiveEntity = oContext.getObject().IsActiveEntity;

			if (bIsActiveEntity || (!bIsActiveEntity && !sDiscardAction)) {
				//Use Delete in case of active entity and no discard action available for draft
				return oContext.delete();
			} else {
				//Use Discard Post Action if it is a draft entity and discard action exists
				return executeDraftDiscardAction(oContext);
			}
		}
		/**
		 * Static functions for the draft programming model
		 *
		 * @namespace
		 * @alias sap.fe.core.actions.draft
		 * @private
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.54.0
		 */
		var draft = {
			createDraftFromActiveDocument: createDraftFromActiveDocument,
			activateDocument: activateDocument,
			deleteDraft: deleteDraft
		};

		return draft;
	}
);
