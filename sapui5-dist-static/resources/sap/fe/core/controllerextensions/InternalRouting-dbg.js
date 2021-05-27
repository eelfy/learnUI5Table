sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/fe/core/controllerextensions/ControllerExtensionMetadata",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/ui/core/Component",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/helpers/SemanticKeyHelper",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/Log",
		"sap/fe/core/actions/messageHandling",
		"sap/m/MessageBox",
		"sap/fe/core/helpers/EditState"
	],
	function(
		ControllerExtension,
		ControllerExtensionMetadata,
		OverrideExecution,
		Component,
		CommonUtils,
		BusyLocker,
		SemanticKeyHelper,
		Filter,
		FilterOperator,
		Log,
		messageHandling,
		MessageBox,
		EditState
	) {
		"use strict";

		//////////////////////////////////////////////
		// Helper functions for semantic keys
		//////////////////////////////////////////////

		/**
		 * Creates the filter to retrieve a context corresponding to a semantic path.
		 *
		 * @param {string} sSemanticPath the semantic path
		 * @param {Array} aSemanticKeys the semantic keys for the path
		 * @returns {sap.ui.model.Filter} the filter
		 *
		 * @ui5-restricted
		 */
		function createFilterFromSemanticPath(sSemanticPath, aSemanticKeys) {
			var aKeyValues = sSemanticPath.substring(sSemanticPath.indexOf("(") + 1, sSemanticPath.length - 1).split(","),
				aFilters;

			if (aSemanticKeys.length != aKeyValues.length) {
				return null;
			}

			if (aSemanticKeys.length === 1) {
				// Take the first key value
				var sKeyValue = aKeyValues[0];
				if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
					// Remove the quotes from the value and decode special chars
					sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
				}
				aFilters = [new Filter(aSemanticKeys[0].$PropertyPath, FilterOperator.EQ, sKeyValue)];
			} else {
				var mKeyValues = {};
				// Create a map of all key values
				aKeyValues.forEach(function(sKeyAssignment) {
					var aParts = sKeyAssignment.split("="),
						sKeyValue = aParts[1];

					if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
						// Remove the quotes from the value and decode special chars
						sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
					}

					mKeyValues[aParts[0]] = sKeyValue;
				});

				var bFailed = false;
				aFilters = aSemanticKeys.map(function(oSemanticKey) {
					var sKey = oSemanticKey.$PropertyPath,
						sValue = mKeyValues[sKey];

					if (sValue !== undefined) {
						return new Filter(sKey, FilterOperator.EQ, sValue);
					} else {
						bFailed = true;
						return "XX";
					}
				});

				if (bFailed) {
					return null;
				}
			}

			// Add a draft filter to make sure we take the draft entity if there is one
			// Or the active entity otherwise
			var oDraftFilter = new Filter({
				filters: [new Filter("IsActiveEntity", "EQ", false), new Filter("SiblingEntity/IsActiveEntity", "EQ", null)],
				and: false
			});
			aFilters.push(oDraftFilter);

			var oCombinedFilter = new Filter(aFilters, true);
			return oCombinedFilter;
		}

		/**
		 * Converts a path with semantic keys to a path with technical keys.
		 *
		 * @param {string} sSemanticPath the path with semantic keys
		 * @param {sap.ui.model.odata.v4.ODataModel} oModel the model for the path
		 * @param {Array} aSemanticKeys the semantic keys for the path
		 * @returns {Promise} promise containing the path with technical keys if sSemanticPath could be interpreted as a semantic path, null otherwise
		 *
		 * @ui5-restricted
		 */
		function getTechnicalPathFromSemanticPath(sSemanticPath, oModel, aSemanticKeys) {
			var oMetaModel = oModel.getMetaModel(),
				sEntitySetName = oMetaModel.getMetaContext(sSemanticPath).getPath();

			if (!aSemanticKeys || aSemanticKeys.length === 0) {
				// No semantic keys
				return Promise.resolve(null);
			}

			// Create a set of filters corresponding to all keys
			var oFilter = createFilterFromSemanticPath(sSemanticPath, aSemanticKeys);
			if (oFilter === null) {
				// Couldn't interpret the path as a semantic one
				return Promise.resolve(null);
			}

			// Load the corresponding object
			var oListBinding = oModel.bindList("/" + sEntitySetName, undefined, undefined, oFilter, { "$$groupId": "$auto.Heroes" });

			return oListBinding.requestContexts(0, 2).then(function(oContexts) {
				if (oContexts && oContexts.length) {
					return oContexts[0].getPath();
				} else {
					// No data could be loaded
					return null;
				}
			});
		}

		/**
		 * Checks if a path is eligible for semantic bookmarking.
		 *
		 * @param {string} sPath the path to test
		 * @param {sap.ui.model.odata.v4.ODataMetaModel} oMetaModel the associated metadata model
		 * @returns {boolean} true is the path is eligible
		 *
		 * @ui5-restricted
		 */
		function checkPathForSemanticBookmarking(sPath, oMetaModel) {
			// Only path on root objects allow semantic bookmarking, i.e. sPath = xxx(yyy)
			var aMatches = /^[\/]?(\w+)\([^\/]+\)$/.exec(sPath);
			if (!aMatches) {
				return false;
			}
			// Get the entitySet name
			var sEntitySetPath = "/" + aMatches[1];
			// Check the entity set supports draft (otherwise we don't support semantic bookmarking)
			var oDraftRoot = oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot");
			var oDraftNode = oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode");
			return oDraftRoot || oDraftNode ? true : false;
		}

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.InternalRouting
		 *
		 * @private
		 * @since 1.74.0
		 */
		return ControllerExtension.extend(
			"sap.fe.core.controllerextensions.InternalRouting",
			{
				metadata: {
					methods: {
						"navigateToTarget": { "public": true, "final": false },
						"byId": { "public": false },
						"getView": { "public": false },
						"onRouteMatched": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onRouteMatchedFinished": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onBeforeBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onAfterBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"navigateToContext": { "public": true, "final": true },
						"navigateBackFromContext": { "public": true, "final": true },
						"navigateForwardToContext": { "public": true, "final": true },
						"navigateBackFromTransientState": { "public": true, "final": true },
						"navigateToMessagePage": { "public": true, "final": true },
						"handleFCLFullScreen": {
							"public": true,
							"final": false,
							overrideExecution: sap.ui.core.mvc.OverrideExecution.Before
						},
						"handleFCLExitFullScreen": {
							"public": true,
							"final": false,
							overrideExecution: sap.ui.core.mvc.OverrideExecution.Before
						},
						"handleFCLClose": { "public": true, "final": false, overrideExecution: sap.ui.core.mvc.OverrideExecution.Before },
						"isCurrentStateImpactedBy": { "public": true, "final": true }
					}
				},
				/**
				 * Triggered everytime this controller is the target of a navigation.
				 */
				onRouteMatched: function() {},
				onRouteMatchedFinished: function() {},
				onBeforeBinding: function(oBindingContext, mParameters) {},
				onAfterBinding: function(oBindingContext, mParameters) {
					this._oAppComponent.getRootViewController().onContextBoundToView(oBindingContext);
				},

				///////////////////////////////////////////////////////////
				// Methods triggering a navigation after a user action
				// (e.g. click on a table row, button, etc...)
				///////////////////////////////////////////////////////////

				/**
				 * Navigate to specified navigation target name.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext					Context instance
				 * @param {string} sNavigationTargetName 	Navigation target name
				 *
				 * @ui5-restricted
				 */
				navigateToTarget: function(oContext, sNavigationTargetName) {
					var oNavigationConfiguration =
						this._oPageComponent &&
						this._oPageComponent.getNavigationConfiguration &&
						this._oPageComponent.getNavigationConfiguration(sNavigationTargetName);
					if (oNavigationConfiguration) {
						var oDetailRoute = oNavigationConfiguration.detail;
						var sRouteName = oDetailRoute.route;
						var mParameterMapping = oDetailRoute.parameters;
						this._oRoutingService.navigateTo(oContext, sRouteName, mParameterMapping, true);
					} else {
						this._oRoutingService.navigateTo(oContext, null, null, true);
					}
					this._oView.getViewData();
				},

				/**
				 * Navigates to a specific context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext to be navigated to
				 * @param {object} mParameters optional navigation parameters
				 * @returns {Promise} promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateToContext: function(oContext, mParameters) {
					var that = this;
					var oContextInfo = {};
					mParameters = mParameters || {};
					if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding")) {
						if (mParameters.asyncContext) {
							// the context is either created async (Promise)
							// We need to activate the routeMatchSynchro on the RouterProxy to avoid that
							// the subsequent call to navigateToContext conflicts with the current one
							this._oRouterProxy.activateRouteMatchSynchronization();

							mParameters.asyncContext
								.then(function(oContext) {
									// once the context is returned we navigate into it
									that.navigateToContext(oContext, {
										checkNoHashChange: mParameters.checkNoHashChange,
										editable: mParameters.editable,
										bPersistOPScroll: mParameters.bPersistOPScroll,
										updateFCLLevel: mParameters.updateFCLLevel
									});
								})
								.catch(function(oError) {
									Log.error("Error with the async context", oError);
								});
						} else if (!mParameters.bDeferredContext) {
							// Navigate to a list binding not yet supported
							throw "navigation to a list binding is not yet supported";
						}
					} else if (oContext.getBinding() && oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")) {
						if (CommonUtils.hasTransientContext(oContext.getBinding())) {
							return this.oView
								.getModel("sap.fe.i18n")
								.getResourceBundle()
								.then(function(oResourceBundle) {
									var sTitle = CommonUtils.getTranslatedText(
										"C_ROUTING_NAVIGATION_DISABLED_TITLE",
										oResourceBundle,
										null,
										oContext
											.getBinding()
											.getPath()
											.substr(1)
									);
									Log.warning(sTitle);
									MessageBox.show(sTitle, {
										icon: MessageBox.Icon.WARNING,
										title: sTitle,
										actions: [MessageBox.Action.CLOSE],
										details: oResourceBundle.getText("C_TRANSACTION_HELPER_TRANSIENT_CONTEXT_DESCRIPTION"),
										contentWidth: "100px"
									});
								});
						}
					}

					if (mParameters.callExtension) {
						oContextInfo.sourceBindingContext = oContext.getObject();
						if (mParameters.oEvent) {
							oContextInfo.oEvent = mParameters.oEvent;
						}
						if (
							this.base
								.getView()
								.getController()
								.routing.onBeforeNavigation(oContextInfo)
						) {
							return Promise.resolve();
						}
					}
					mParameters.FCLLevel = this._getFCLLevel();

					return this._oRoutingService.navigateToContext(
						oContext,
						mParameters,
						this._oView.getViewData(),
						this._oTargetInformation
					);
				},

				/**
				 * Navigates backwards from a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext to be navigated from
				 * @param {object} mParameters optional navigation parameters
				 * @returns {Promise} promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateBackFromContext: function(oContext, mParameters) {
					mParameters = mParameters || {};
					mParameters.updateFCLLevel = -1;

					return this.navigateToContext(oContext, mParameters);
				},

				/**
				 * Navigates forwards to a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext to be navigated to
				 * @param {object} mParameters optional navigation parameters
				 * @returns {Promise} promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateForwardToContext: function(oContext, mParameters) {
					if (this._oView.getBindingContext("internal").getProperty("messageFooterContainsErrors") === true) {
						return Promise.resolve();
					}
					mParameters = mParameters || {};
					mParameters.updateFCLLevel = 1;

					return this.navigateToContext(oContext, mParameters, true);
				},

				/**
				 * Navigates back in history if the current hash corresponds to a transient state.
				 */
				navigateBackFromTransientState: function() {
					var sHash = this._oRouterProxy.getHash();

					// if triggered while navigating to (...), we need to navigate back
					if (sHash.indexOf("(...)") !== -1) {
						this._oRouterProxy.navBack();
					}
				},

				navigateToMessagePage: function(sErrorMessage, mParameters) {
					mParameters = mParameters || {};
					if (this._oRouterProxy.getHash().indexOf("i-action=create") > -1) {
						this._oRouterProxy.navToHash(this._oRoutingService.getDefaultCreateHash());
					}

					mParameters.FCLLevel = this._getFCLLevel();

					this._oAppComponent.getRootViewController().displayMessagePage(sErrorMessage, mParameters);
				},

				/**
				 * Checks if one of the current views on the screen is bound to a given context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext the context
				 * @returns {boolean} true or false
				 *
				 * @ui5-restricted
				 */
				isCurrentStateImpactedBy: function(oContext) {
					return this._oRoutingService.isCurrentStateImpactedBy(oContext);
				},

				///////////////////////////////////////////////////////////
				// Methods to bind the page when a route is matched
				///////////////////////////////////////////////////////////

				/**
				 * Called when a route is matched.
				 * Builds the binding context from the navigation parameters, and bind the page accordingly.
				 *
				 * @param {object} oEvent the event
				 *
				 * @ui5-restricted
				 */
				_onRouteMatched: function(oEvent) {
					// Check if the target for this view is part of the event targets
					var aTargets = oEvent.getParameter("routeInformation") && oEvent.getParameter("routeInformation").targets;
					if (!aTargets || aTargets.indexOf(this._oTargetInformation.targetName) === -1) {
						return;
					}

					// Retrieve the binding context pattern
					var sTarget;
					if (this._oPageComponent && this._oPageComponent.getBindingContextPattern) {
						sTarget = this._oPageComponent.getBindingContextPattern();
					}
					sTarget = sTarget || this._oTargetInformation.contextPattern;

					if (sTarget === null || sTarget === undefined) {
						// Don't do this if we already got sTarget == '', which is a valid target pattern
						sTarget = oEvent.getParameter("routePattern");
					}
					sTarget = sTarget.replace(":?query:", "");

					// Replace the parameters by their values in the binding context pattern
					var mArguments = oEvent.getParameters().arguments,
						bDeferred = false,
						oNavigationParameters = oEvent.getParameter("navigationInfo");

					for (var sKey in mArguments) {
						var sValue = mArguments[sKey];
						if (sValue === "..." && sTarget.indexOf("{" + sKey + "}") >= 0) {
							bDeferred = true;
							// Sometimes in preferredMode = create, the edit button is shown in background when the
							// action parameter dialog shows up, setting bTargetEditable passes editable as true
							// to onBeforeBinding in _bindTargetPage function
							oNavigationParameters.bTargetEditable = true;
						}
						sTarget = sTarget.replace("{" + sKey + "}", sValue);
					}

					// the binding target is always absolute
					if (sTarget && sTarget[0] !== "/") {
						sTarget = "/" + sTarget;
					}

					this.onRouteMatched();

					var oOut;
					if (bDeferred) {
						oOut = this._bindDeferred(sTarget, oNavigationParameters);
					} else {
						oOut = this._bindPage(sTarget, oNavigationParameters);
					}
					var that = this;
					// eslint-disable-next-line promise/catch-or-return
					oOut.finally(function() {
						that.onRouteMatchedFinished();
					});

					this._oAppComponent.getRootViewController().updateUIStateForView(this._oView, this._getFCLLevel());
				},

				/**
				 * Deferred binding (during object creation).
				 *
				 * @param {string} sTargetPath the path to the deffered context
				 * @param {object} oNavigationParameters navigation parameters
				 * @returns {Promise}
				 * @ui5-restricted
				 */
				_bindDeferred: function(sTargetPath, oNavigationParameters) {
					this.onBeforeBinding(null, { editable: oNavigationParameters.bTargetEditable });

					if (oNavigationParameters.bDeferredContext || !oNavigationParameters.oAsyncContext) {
						// either the context shall be created in the target page (deferred Context) or it shall
						// be created async but the user refreshed the page / bookmarked this URL
						// TODO: currently the target component creates this document but we shall move this to
						// a central place
						if (this._oPageComponent && this._oPageComponent.createDeferredContext) {
							this._oPageComponent.createDeferredContext(sTargetPath);
						}
					}

					if (this._getBindingContext() && this._getBindingContext().hasPendingChanges()) {
						// For now remove the pending changes to avoid the model raises errors and the object page is at least bound
						// Ideally the user should be asked for
						this._getBindingContext()
							.getBinding()
							.resetChanges();
					}

					// remove the context to avoid showing old data
					this._setBindingContext(null);

					this.onAfterBinding(null);
					return Promise.resolve();
				},

				/**
				 * Sets the binding context of the page from a path.
				 *
				 * @param {string} sTargetPath the path to the context
				 * @param {object} oNavigationParameters navigation parameters
				 * @returns {Promise}
				 * @ui5-restricted
				 */
				_bindPage: function(sTargetPath, oNavigationParameters) {
					var that = this;

					if (sTargetPath === "") {
						return Promise.resolve(this._bindPageToContext(null, oNavigationParameters));
					} else {
						return this._resolveSemanticPath(sTargetPath)
							.then(function(sTechnicalPath) {
								that._bindPageToPath(sTechnicalPath, oNavigationParameters);
							})
							.catch(function(oError) {
								// Error handling for erroneous metadata request
								var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

								that.navigateToMessagePage(oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
									title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
									description: oError.message
								});
							});
					}
				},

				/**
				 * Builds a path with semantic keys from a path with technical keys.
				 *
				 * @param {string} sPathToResolve the path to be transformed
				 * @returns {Promise} String promise for the new path. If sPathToResolved couldn't be interpreted as a semantic path, it is returned as is.
				 *
				 * @ui5-restricted
				 */
				_resolveSemanticPath: function(sPathToResolve) {
					var oModel = this._oView.getModel(),
						oMetaModel = oModel.getMetaModel(),
						oLastSemanticMapping = this._oRoutingService.getLastSemanticMapping(),
						sCurrentHashNoParams = this._oRouter
							.getHashChanger()
							.getHash()
							.split("?")[0],
						that = this;

					if (sCurrentHashNoParams && sCurrentHashNoParams.lastIndexOf("/") === sCurrentHashNoParams.length - 1) {
						// Remove trailing '/'
						sCurrentHashNoParams = sCurrentHashNoParams.substring(0, sCurrentHashNoParams.length - 1);
					}

					var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));
					if (sRootEntityName.indexOf("/") === 0) {
						sRootEntityName = sRootEntityName.substring(1);
					}
					var bAllowSemanticBookmark = checkPathForSemanticBookmarking(sCurrentHashNoParams, oMetaModel),
						aSemanticKeys = bAllowSemanticBookmark && SemanticKeyHelper.getSemanticKeys(oMetaModel, sRootEntityName);
					if (!aSemanticKeys) {
						// No semantic keys available --> use the path as is
						return Promise.resolve(sPathToResolve);
					} else if (oLastSemanticMapping && oLastSemanticMapping.semanticPath === sPathToResolve) {
						// This semantic path has been resolved previously
						return Promise.resolve(oLastSemanticMapping.technicalPath);
					} else {
						// We need resolve the semantic path to get the technical keys
						return getTechnicalPathFromSemanticPath(sCurrentHashNoParams, oModel, aSemanticKeys).then(function(sTechnicalPath) {
							if (sTechnicalPath && sTechnicalPath !== sPathToResolve) {
								// The semantic path was resolved (otherwise keep the original value for target)
								that._oRoutingService.setLastSemanticMapping({
									technicalPath: sTechnicalPath,
									semanticPath: sPathToResolve
								});
								return sTechnicalPath;
							} else {
								return sPathToResolve;
							}
						});
					}
				},

				/**
				 * Sets the binding context of the page from a path.
				 *
				 * @param {string} sTargetPath the path to build the context. Needs to contain technical keys only.
				 * @param {object} oNavigationParameters navigation parameters
				 *
				 * @ui5-restricted
				 */
				_bindPageToPath: function(sTargetPath, oNavigationParameters) {
					var oCurrentContext = this._getBindingContext(),
						sCurrentPath = oCurrentContext && oCurrentContext.getPath(),
						oUseContext = oNavigationParameters.useContext;

					// We set the binding context only if it's different from the current one
					// or if we have a context already selected
					if (sCurrentPath !== sTargetPath || (oUseContext && oUseContext.getPath() === sTargetPath)) {
						var oTargetContext;
						if (oUseContext && oUseContext.getPath() === sTargetPath) {
							// We already have the context to be used
							oTargetContext = oUseContext;
						} else {
							// Otherwise we need to create it from sTargetPath
							oTargetContext = this._createBindingContext(sTargetPath);
						}

						this._bindPageToContext(oTargetContext, oNavigationParameters);
					} else if (!oNavigationParameters.bReasonIsIappState && EditState.isEditStateDirty()) {
						this._refreshBindingContext(oCurrentContext);
					}
				},

				/**
				 * Binds the page to a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext to be bound
				 * @param {object} oNavigationParameters navigation parameters
				 *
				 * @ui5-restricted
				 */
				_bindPageToContext: function(oContext, oNavigationParameters) {
					var that = this;

					if (!oContext) {
						this.onBeforeBinding(null);
						this.onAfterBinding(null);
					} else {
						var oParentListBinding = oContext.getBinding();

						if (!oContext.getBinding() || oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")) {
							// We need to recreate the context otherwise we get errors
							oContext = this._createBindingContext(oContext.getPath());

							if (EditState.isEditStateDirty()) {
								// TODO: as a workaround we invalidate the model cache while the app is dirty
								// as the manage model sets the parent in an async task and the request side effects
								// relies on the parent relationship we have to set a timeout 0
								setTimeout(function() {
									that._refreshBindingContext(oContext);
								}, 0);
							}
						}

						// Set the binding context with the proper before/after callbacks
						this.onBeforeBinding(oContext, {
							editable: oNavigationParameters.bTargetEditable,
							listBinding: oParentListBinding,
							bPersistOPScroll: oNavigationParameters.bPersistOPScroll
						});

						this._setBindingContext(oContext);

						this.onAfterBinding(oContext);
					}
				},

				/**
				 * Creates a binding context from a path.
				 *
				 * @param {string} sPath the path
				 * @returns {sap.ui.model.odata.v4.Context} created context
				 *
				 * @ui5-restricted
				 */
				_createBindingContext: function(sPath) {
					var sEntitySet = this._oPageComponent && this._oPageComponent.getEntitySet && this._oPageComponent.getEntitySet(),
						oModel = this._oView.getModel(),
						oMetaModel = oModel.getMetaModel(),
						that = this,
						mParameters = {
							$$patchWithoutSideEffects: true,
							$$groupId: "$auto.Heroes",
							$$updateGroupId: "$auto"
						};

					if (sEntitySet) {
						var sMessagesPath = oMetaModel.getProperty("/" + sEntitySet + "/@com.sap.vocabularies.Common.v1.Messages/$Path");
						if (sMessagesPath) {
							mParameters.$select = sMessagesPath;
						}
					}

					// In case of draft: $select the state flags (HasActiveEntity, HasDraftEntity, and IsActiveEntity)
					var oDraftRoot = oMetaModel.getObject("/" + sEntitySet + "@com.sap.vocabularies.Common.v1.DraftRoot");
					var oDraftNode = oMetaModel.getObject("/" + sEntitySet + "@com.sap.vocabularies.Common.v1.DraftNode");
					if (oDraftRoot || oDraftNode) {
						if (mParameters.$select === undefined) {
							mParameters.$select = "HasActiveEntity,HasDraftEntity,IsActiveEntity";
						} else {
							mParameters.$select += ",HasActiveEntity,HasDraftEntity,IsActiveEntity";
						}
					}

					var oHiddenBinding = oModel.bindContext(sPath, undefined, mParameters);

					oHiddenBinding.attachEventOnce("dataRequested", function() {
						BusyLocker.lock(that._oView);
					});
					oHiddenBinding.attachEventOnce("dataReceived", function(oEvent) {
						var sErrorDescription = oEvent && oEvent.getParameter("error");
						BusyLocker.unlock(that._oView);
						if (sErrorDescription) {
							// TODO: in case of 404 the text shall be different
							sap.ui
								.getCore()
								.getLibraryResourceBundle("sap.fe.core", true)
								.then(function(oResourceBundle) {
									messageHandling.removeUnboundTransitionMessages();
									that.navigateToMessagePage(oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
										title: oResourceBundle.getText("SAPFE_ERROR"),
										description: sErrorDescription
									});
								})
								.catch(function(oError) {
									Log.error("Error while getting the core resource bundle", oError);
								});
						}
					});

					return oHiddenBinding.getBoundContext();
				},

				/**
				 * Requests side effects on a binding context to "refresh" it.
				 * TODO: get rid of this once provided by the model
				 * a refresh on the binding context does not work in case a creation row with a transient context is
				 * used. also a requestSideEffects with an empty path would fail due to the transient context
				 * therefore we get all dependent bindings (via private model method) to determine all paths and then
				 * request them.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oBindingContext context to be refreshed
				 *
				 * @ui5-restricted
				 */
				_refreshBindingContext: function(oBindingContext) {
					var sEntitySet = this._oPageComponent && this._oPageComponent.getEntitySet && this._oPageComponent.getEntitySet(),
						oMetaModel = this._oView.getModel().getMetaModel(),
						sMessagesPath,
						aNavigationPropertyPaths = [],
						aPropertyPaths = [],
						aSideEffects = [];

					function getBindingPaths(oBinding) {
						var aDependentBindings,
							sPath = oBinding.getPath();

						if (oBinding.isA("sap.ui.model.odata.v4.ODataContextBinding")) {
							// if (sPath === "") {
							// now get the dependent bindings
							aDependentBindings = oBinding.getDependentBindings();
							if (aDependentBindings) {
								// ask the dependent bindings (and only those with the specified groupId
								//if (aDependentBindings.length > 0) {
								for (var i = 0; i < aDependentBindings.length; i++) {
									getBindingPaths(aDependentBindings[i]);
								}
							} else if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
								aNavigationPropertyPaths.push(sPath);
							}
						} else if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
							if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
								aNavigationPropertyPaths.push(sPath);
							}
						} else if (oBinding.isA("sap.ui.model.odata.v4.ODataPropertyBinding")) {
							if (aPropertyPaths.indexOf(sPath) === -1) {
								aPropertyPaths.push(sPath);
							}
						}
					}

					if (sEntitySet) {
						sMessagesPath = oMetaModel.getProperty("/" + sEntitySet + "/@com.sap.vocabularies.Common.v1.Messages/$Path");
					}

					// binding of the context must have $$PatchWithoutSideEffects true, this bound context may be needed to be fetched from the dependent binding
					getBindingPaths(oBindingContext.getBinding());

					var i;
					for (i = 0; i < aNavigationPropertyPaths.length; i++) {
						aSideEffects.push({
							$NavigationPropertyPath: aNavigationPropertyPaths[i]
						});
					}
					for (i = 0; i < aPropertyPaths.length; i++) {
						aSideEffects.push({
							$PropertyPath: aPropertyPaths[i]
						});
					}
					if (sMessagesPath) {
						aSideEffects.push({
							$PropertyPath: sMessagesPath
						});
					}
					oBindingContext.requestSideEffects(aSideEffects);
				},

				/**
				 * Get the binding context of the page or the component.
				 *
				 * @returns {sap.ui.model.odata.v4.Context} the binding context
				 *
				 * @ui5-restricted
				 */
				_getBindingContext: function() {
					if (this._oPageComponent) {
						return this._oPageComponent.getBindingContext();
					} else {
						return this._oView.getBindingContext();
					}
				},

				/**
				 * Set the binding context of the page or the component.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext the binding context
				 *
				 * @ui5-restricted
				 */
				_setBindingContext: function(oContext) {
					if (this._oPageComponent) {
						this._oPageComponent.setBindingContext(oContext);
					} else {
						this._oView.setBindingContext(oContext);
					}
				},

				/**
				 * Gets the FCL level corresponding to the view (-1 if the app is not FCL).
				 *
				 * @returns {number} the level
				 *
				 * @ui5-restricted
				 */
				_getFCLLevel: function() {
					return this._oTargetInformation.FCLLevel;
				},

				/**
				 * Sets the current column of a flexible column layout (FCL) to full-screen mode.
				 *
				 * @ui5-restricted
				 */
				enterFullScreen: function() {
					var oSource = this.base.getView();
					var oContext = oSource.getBindingContext(),
						sNextLayout = oSource.getModel("fclhelper").getProperty("/actionButtonsInfo/fullScreen");

					this.base._routing.navigateToContext(oContext, { sLayout: sNextLayout });
				},

				/**
				 * Exits fullscreen mode for the current column of a flexible column layout.
				 *
				 * @ui5-restricted
				 */
				exitFullScreen: function() {
					var oSource = this.base.getView();
					var oContext = oSource.getBindingContext(),
						sNextLayout = oSource.getModel("fclhelper").getProperty("/actionButtonsInfo/exitFullScreen");

					this.base._routing.navigateToContext(oContext, { sLayout: sNextLayout });
				},

				/**
				 * Closes the column for the current view in a FCL.
				 *
				 * @ui5-restricted
				 */
				closeColumn: function() {
					var oSource = this.base.getView();
					var oContext = oSource.getBindingContext();
					this.base._routing.navigateBackFromContext(oContext, { noPreservationCache: true });
				},

				override: {
					onExit: function() {
						this._oRoutingService.detachRouteMatched(this._fnRouteMatchedBound);
					},
					onInit: function() {
						var that = this;
						this._oView = this.base.getView();
						this._oAppComponent = CommonUtils.getAppComponent(this._oView);
						this._oPageComponent = Component.getOwnerComponentFor(this._oView);
						this._oRouter = this._oAppComponent.getRouter();
						this._oRouterProxy = this._oAppComponent.getRouterProxy();

						if (!this._oAppComponent || !this._oPageComponent) {
							throw new Error("Failed to initialize controler extension 'sap.fe.core.controllerextesions.InternalRouting");
						}

						if (this._oAppComponent === this._oPageComponent) {
							// The view isn't hosted in a dedicated UIComponent, but directly in the app
							// --> just keep the view
							this._oPageComponent = null;
						}

						this._oAppComponent
							.getService("routingService")
							.then(function(oRoutingService) {
								that._oRoutingService = oRoutingService;
								that._fnRouteMatchedBound = that._onRouteMatched.bind(that);
								that._oRoutingService.attachRouteMatched(that._fnRouteMatchedBound);
								that._oTargetInformation = oRoutingService.getTargetInformationFor(that._oPageComponent || that._oView);
							})
							.catch(function() {
								throw new Error(
									"This controller extension cannot work without a 'routingService' on the main AppComponent"
								);
							});
					}
				}
			},
			ControllerExtensionMetadata
		);
	}
);
