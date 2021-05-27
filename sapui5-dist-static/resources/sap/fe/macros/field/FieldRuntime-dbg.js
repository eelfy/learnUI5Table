/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/fe/core/helpers/SideEffectsUtil",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/DelegateUtil",
		"sap/ui/util/openWindow",
		"sap/fe/macros/FieldAPI"
	],
	function(ResourceModel, SideEffectsUtil, Log, CommonUtils, DelegateUtil, openWindow, FieldAPI) {
		"use strict";

		/**
		 * Get the appropriate context on which side effects can be requested.
		 * The correct one must have a binding parameter $$patchWithoutSideEffects.
		 *
		 * @function
		 * @name getContextForSideEffects
		 * @param {object} oSourceField field changed or focused out which may cause side effect
		 * @param {string} sSideEffectEntityType Target entity type of the side effect annotation
		 * @returns {object} oContext valid to request side effects
		 */
		function _getContextForSideEffects(oSourceField, sSideEffectEntityType) {
			var oBindingContext = oSourceField.getBindingContext(),
				oMetaModel = oBindingContext.getModel().getMetaModel(),
				sMetaPath = oMetaModel.getMetaPath(oBindingContext.getPath()),
				sEntityType = oMetaModel.getObject(sMetaPath)["$Type"],
				oContextForSideEffects = oBindingContext;

			/**
			 * If the field's context belongs to a list binding OR belongs to a 1:1,
			 *        If target entity of the side effect annotation is different
			 *            Use context of list binding or 1:1
			 *        If target entity of the side effect annotation is same
			 *            Use field's context
			 */
			if (sSideEffectEntityType !== sEntityType) {
				oContextForSideEffects = oBindingContext.getBinding().getContext();
				if (oContextForSideEffects) {
					sMetaPath = oMetaModel.getMetaPath(oContextForSideEffects.getPath());
					sEntityType = oMetaModel.getObject(sMetaPath)["$Type"];
					// 1:1 inside a 1:1
					// to support this, we can recurse up until sSideEffectEntityType matches sEntityType

					/*
					In case of fields added as columns from personalisation, the side effect binding context
					is not getting formed correctly. Hence this check was added to get the correct binding context.
					This is a workaround fix only. The root cause of this binding issue needs to be analyzed
					and resolved, afterwards this check can be removed.
					*/
					if (sSideEffectEntityType !== sEntityType) {
						oContextForSideEffects = oContextForSideEffects.getBinding().getContext();
						if (oContextForSideEffects) {
							sMetaPath = oMetaModel.getMetaPath(oContextForSideEffects.getPath());
							sEntityType = oMetaModel.getObject(sMetaPath)["$Type"];
							if (sSideEffectEntityType !== sEntityType) {
								return undefined;
							}
						}
					}
				}
			}

			return oContextForSideEffects || undefined;
		}

		/**
		 * Static class used by MDC Field during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var FieldRuntime = {
			formatDraftOwnerTextInPopover: function(
				bHasDraftEntity,
				sDraftInProcessByUser,
				sDraftLastChangedByUser,
				sDraftInProcessByUserDesc,
				sDraftLastChangedByUserDesc
			) {
				if (bHasDraftEntity) {
					var sUserDescription =
						sDraftInProcessByUserDesc || sDraftInProcessByUser || sDraftLastChangedByUserDesc || sDraftLastChangedByUser;

					if (!sUserDescription) {
						return ResourceModel.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_UNSAVED_CHANGES_BY_UNKNOWN");
					} else {
						return sDraftInProcessByUser
							? ResourceModel.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_LOCKED_BY_KNOWN", sUserDescription)
							: ResourceModel.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_UNSAVED_CHANGES_BY_KNOWN", sUserDescription);
					}
				} else {
					return ResourceModel.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_NO_DATA_TEXT");
				}
			},

			/**
			 * Triggers an internal navigation on link pertaining to DataFieldWithNavigationPath.
			 *
			 * @param {object} oSource Source of the press event
			 * @param {object} oController Instance of the controller
			 * @param {string} sSemanticObjectName Semantic object name
			 */
			onDataFieldWithNavigationPath: function(oSource, oController, sSemanticObjectName) {
				var oBindingContext = oSource.getBindingContext();
				// ToDo: Assumes that the controller has the routing listener extension. Candidate for macroData?
				if (oController.routing) {
					oController._routing.navigateToTarget(oBindingContext, sSemanticObjectName);
				} else {
					Log.error(
						"FieldRuntime: No routing listener controller extension found. Internal navigation aborted.",
						"sap.fe.macros.field.FieldRuntime",
						"onDataFieldWithNavigationPath"
					);
				}
			},

			/**
			 * Method to initialize or enhance if already initialized, the queue of side effects requests
			 * in the format - { 'sContextPath' : { 'context': oContextForSideEffects, 'pathExpressions': [aPathExpressions] } }.
			 *
			 * @function
			 * @name _initSideEffectsQueue
			 * @param {string} sContextPath Binding path for the field that triggers the side effect
			 * @param {object} oContextForSideEffects Context used to request the side effect
			 * @private
			 */
			_initSideEffectsQueue: function(sContextPath, oContextForSideEffects) {
				this.sideEffectsRequestsQueue = this.sideEffectsRequestsQueue || {};
				this.sideEffectsRequestsQueue[sContextPath] = this.sideEffectsRequestsQueue[sContextPath] || {};
				this.sideEffectsRequestsQueue[sContextPath]["context"] =
					this.sideEffectsRequestsQueue[sContextPath]["context"] || oContextForSideEffects;
				this.sideEffectsRequestsQueue[sContextPath]["pathExpressions"] =
					this.sideEffectsRequestsQueue[sContextPath]["pathExpressions"] || [];
				// add the previously failed relevant side effects
				if (this.aFailedSideEffects && this.aFailedSideEffects[sContextPath]) {
					this.sideEffectsRequestsQueue[sContextPath]["pathExpressions"] = this.sideEffectsRequestsQueue[sContextPath][
						"pathExpressions"
					].concat(this.aFailedSideEffects[sContextPath]["pathExpressions"]);
					// remove from failed queue as this will now be retried
					delete this.aFailedSideEffects[sContextPath];
				}
			},

			_feedSideEffectsQueue: function(oSideEffect, sSideEffectEntityType, oSourceField) {
				var that = this,
					oBindingContext = oSourceField.getBindingContext(),
					oMetaModel = oBindingContext.getModel().getMetaModel(),
					sContextPath,
					aPathExpressions = [],
					aPropertiesToRequest, // target properties
					aQueuedPropertiesToRequest, // target properties already in queue
					aEntitiesToRequest, // target entities
					aQueuedEntitiesToRequest, // target entities already in queue
					fnGetPropertyPath = function(oPathExpression) {
						return oPathExpression["$PropertyPath"];
					},
					fnGetNavigationPropertyPath = function(oPathExpression) {
						return oPathExpression["$NavigationPropertyPath"];
					},
					oContextForSideEffects = _getContextForSideEffects(oSourceField, sSideEffectEntityType);
				if (!oContextForSideEffects) {
					// nothing to prepare
					return Promise.resolve();
				}
				sContextPath = oContextForSideEffects.getPath();
				aPathExpressions = aPathExpressions.concat(oSideEffect.TargetProperties).concat(oSideEffect.TargetEntities);
				// add additional text associations for the target properties
				aPathExpressions = SideEffectsUtil.addTextProperties(aPathExpressions, oMetaModel, sSideEffectEntityType);
				if (aPathExpressions.length) {
					// initialize queue of side effects waiting to be requested
					that._initSideEffectsQueue(sContextPath, oContextForSideEffects);

					// remove duplicates before adding to queue
					aQueuedPropertiesToRequest = that.sideEffectsRequestsQueue[sContextPath]["pathExpressions"]
						.filter(fnGetPropertyPath)
						.map(fnGetPropertyPath);
					aQueuedEntitiesToRequest = that.sideEffectsRequestsQueue[sContextPath]["pathExpressions"]
						.filter(fnGetNavigationPropertyPath)
						.map(fnGetNavigationPropertyPath);
					aPropertiesToRequest = aPathExpressions
						.map(fnGetPropertyPath)
						.filter(function(sPath) {
							return sPath && aQueuedPropertiesToRequest.indexOf(sPath) < 0;
						})
						.map(function(sPath) {
							return { "$PropertyPath": sPath };
						});
					aEntitiesToRequest = aPathExpressions
						.map(fnGetNavigationPropertyPath)
						.filter(function(sPath) {
							return (sPath || sPath === "") && aQueuedEntitiesToRequest.indexOf(sPath) < 0;
						})
						.map(function(sPath) {
							return { "$NavigationPropertyPath": sPath };
						});
					aPathExpressions = aPropertiesToRequest.concat(aEntitiesToRequest);
					// add to queue
					that.sideEffectsRequestsQueue[sContextPath]["pathExpressions"] = that.sideEffectsRequestsQueue[sContextPath][
						"pathExpressions"
					].concat(aPathExpressions);

					that.sideEffectsRequestsQueue[sContextPath]["triggerAction"] = oSideEffect.TriggerAction;
				}
				return Promise.resolve();
			},

			/**
			 * Prepare for a specific side effect request.
			 * SideEffects to be requested on the same context are clubbed together in one request.
			 *
			 * @function
			 * @name prepareForSideEffects
			 * @param {string} sFieldGroupId The (virtual) field group for which side effect needs to be requested
			 * @param {object} oSourceField field changed or focused out which may cause side effect
			 * @returns {Promise} Promise that resolves when the side effects have been prepared
			 */
			prepareForSideEffects: function(sFieldGroupId, oSourceField) {
				var that = this,
					bWithQualifier = sFieldGroupId.indexOf("#") > -1,
					sSideEffectEntityType = (bWithQualifier && sFieldGroupId.split("#")[0]) || sFieldGroupId,
					sQualifier = (bWithQualifier && sFieldGroupId.split("#")[1]) || "",
					sSideEffectAnnotationPath = "/" + sSideEffectEntityType + "@com.sap.vocabularies.Common.v1.SideEffects",
					// oContext = oBindingContext.getBinding().getContext(),
					oBindingContext = oSourceField.getBindingContext(),
					oMetaModel = oBindingContext.getModel().getMetaModel(),
					oSideEffect,
					// for filtering and mapping, we use the below two functions
					sSideEffectAnnotationPath =
						(bWithQualifier && sSideEffectAnnotationPath + "#" + sQualifier) || sSideEffectAnnotationPath;
				oSideEffect = SideEffectsUtil.convertSideEffect(oMetaModel.getObject(sSideEffectAnnotationPath));
				// Only request side effects when there has been an actual change in the value of field, confirmed by aPendingSideEffects
				if (oSideEffect && that.aPendingSideEffects.indexOf(sFieldGroupId) > -1) {
					this._feedSideEffectsQueue(oSideEffect, sSideEffectEntityType, oSourceField);
					// dequeue from pending side effects to ensure no duplicate requests
					that.aPendingSideEffects.splice(that.aPendingSideEffects.indexOf(sFieldGroupId), 1);
				}
				return Promise.resolve();
			},

			prepareForAppSideEffects: function(oSourceField) {
				var oAppSideEffect,
					oView = CommonUtils.getTargetView(oSourceField);
				if (oView) {
					var oController = oView.getController(),
						sEntitySetPath = "/" + oView.getViewData().entitySet + "/",
						sSideEffectEntityType = oView
							.getModel()
							.getMetaModel()
							.getObject(sEntitySetPath + "$Type"),
						sFieldEntityProperty = DelegateUtil.getCustomData(oSourceField, "sourcePath").replace(sEntitySetPath, "");
					oAppSideEffect = oController.sideEffects.getEntitySideEffects(sSideEffectEntityType)[sFieldEntityProperty];
					if (oAppSideEffect) {
						this._feedSideEffectsQueue(oAppSideEffect, sSideEffectEntityType, oSourceField);
					}
				}
				return Promise.resolve(oAppSideEffect);
			},

			/**
			 * Request all side effects queued in this.sideEffectsRequestsQueue.
			 * Reset the queue.
			 *
			 * @function
			 * @name requestSideEffects
			 * @returns {Promise|void}
			 */
			requestSideEffects: function() {
				if (!this.sideEffectsRequestsQueue) {
					return;
				}
				var that = this,
					oSideEffectsRequestQueue = this.sideEffectsRequestsQueue,
					oSideEffectQueuePromise = this.oSideEffectQueuePromise || Promise.resolve(),
					oTriggerAction;
				//reset the queue
				this.sideEffectsRequestsQueue = null;
				return oSideEffectQueuePromise.then(function() {
					var mSideEffectInProgress = Object.keys(oSideEffectsRequestQueue).map(function(sPath) {
						var oSideEffectRequest = oSideEffectsRequestQueue[sPath];
						// log info for the request being attempted
						SideEffectsUtil.logRequest(oSideEffectRequest);

						if (oSideEffectRequest.triggerAction) {
							oTriggerAction = oSideEffectRequest.context
								.getModel()
								.bindContext(oSideEffectRequest.triggerAction + "(...)", oSideEffectRequest.context);
							oTriggerAction.execute(oSideEffectRequest.context.getBinding().getUpdateGroupId());
						}

						return oSideEffectRequest["context"].requestSideEffects(oSideEffectRequest["pathExpressions"]).then(
							function() {
								// unlock fields affected by side effects
							},
							function() {
								// retry loading side effects or cancel
								Log.info(
									"FieldRuntime: Failed to request side effect - " + sPath,
									"sap.fe.macros.field.FieldRuntime",
									"requestSideEffects"
								);
								// add to failed side effects queue for next relevant retrial
								that.aFailedSideEffects[sPath] = oSideEffectRequest;
							}
						);
					});
					that.oSideEffectQueuePromise = Promise.all(mSideEffectInProgress);
				});
			},

			/**
			 * Request for additionalValue if required
			 * Since additionalValue is a one-way binding, we need to request it explicitly if the value is changed.
			 *
			 * @function
			 * @name requestTextIfRequired
			 * @param {object} oSourceField field changed
			 */
			requestTextIfRequired: function(oSourceField) {
				var oAdditionalValueBindingInfo = oSourceField.getBindingInfo("additionalValue");
				if (!oAdditionalValueBindingInfo) {
					return;
				}

				if (oSourceField.getBinding("value").getPath()) {
					var oMetaModel = oSourceField.getModel().getMetaModel(),
						sPath = oSourceField.getBindingContext().getPath() + "/" + oSourceField.getBinding("value").getPath(),
						sValueListType = oMetaModel.getValueListType(sPath);

					if (sValueListType === "Standard" || sValueListType === "Fixed") {
						// in case there's a value help the field retrieves the additional value from there
						return;
					}
				}

				var aPropertyPaths = oAdditionalValueBindingInfo.parts.map(function(oPart) {
						return SideEffectsUtil.determinePathOrNavigationPath(oPart.path);
					}),
					oContextForSideEffects = oSourceField.getBindingContext();
				if (aPropertyPaths.length) {
					oContextForSideEffects
						.requestSideEffects(aPropertyPaths)
						.then(function() {
							// unlock busy fields
						})
						.catch(function() {
							// retry request or cancel
							Log.info(
								"FieldRuntime: Failed to request Text association - " +
									(aPropertyPaths[0] && aPropertyPaths[0]["$PropertyPath"]),
								"sap.fe.macros.field.FieldRuntime",
								"requestTextIfRequired"
							);
						});
				}
			},
			hasTargets: function(bSemanticObjectHasTargets) {
				return bSemanticObjectHasTargets ? bSemanticObjectHasTargets : false;
			},
			/**
			 * Handler for change event.
			 * Store field group ids of this field for requesting side effects when required.
			 * We store them here to ensure a change in value of the field has taken place.
			 * @function
			 * @name handleChange
			 * @param {Controller} oController the controller of the page the field is on
			 * @param {object} oEvent event object passed by the change event
			 */
			handleChange: function(oController, oEvent) {
				var that = this,
					oSourceField = oEvent.getSource(),
					bIsTransient = oSourceField && oSourceField.getBindingContext().isTransient(),
					pValueResolved = oEvent.getParameter("promise") || Promise.resolve(),
					pSideEffectsPrepared = pValueResolved,
					bAtLeastOneImmediate = false,
					aFieldGroupIds = oSourceField.getFieldGroupIds() || [],
					oSource = oEvent.getSource(),
					bValid = oEvent.getParameter("valid");

				// TODO: currently we have undefined and true... and our creation row implementation relies on this.
				// I would move this logic to this place as it's hard to understand for field consumer

				pValueResolved
					.then(function(oVent) {
						// FIXME: the event is gone. For now we'll just recreate it again
						oEvent.oSource = oSource;
						oEvent.mParameters = {
							valid: bValid
						};
						FieldAPI.handleChange(oEvent, oController);
					})
					.catch(function(oError) {
						// FIXME: the event is gone. For now we'll just recreate it again
						oEvent.oSource = oSource;
						oEvent.mParameters = {
							valid: false
						};

						// TODO: for sure it makes sense to inform also in case of non valid entries
						// as the UI might need to react on. We could provide a parameter to inform if validation
						// was successful?
						FieldAPI.handleChange(oEvent, oController);
					});
				if (oController.isA("sap.fe.templates.ExtensionAPI")) {
					oController._controller.editFlow.syncTask(pValueResolved);
				} else {
					oController.editFlow.syncTask(pValueResolved);
				}

				// SIDE EFFECTS

				// if the context is transient, it means the request would fail anyway as the record does not exist in reality
				// TODO: should the request be made in future if the context is transient?
				if (bIsTransient) {
					return;
				}
				// queue of side effects for current change
				this.aPendingSideEffects = this.aPendingSideEffects || [];
				// queue of resolved current set of changes (group of fields)
				this.mFieldGroupResolves = this.mFieldGroupResolves || {};
				// queue of failed side effects request (due to failing PATCH), that need to be retried on next relevant change
				this.aFailedSideEffects = this.aFailedSideEffects || {};

				aFieldGroupIds.forEach(function(sFieldGroupId) {
					var bImmediate = sFieldGroupId.indexOf("$$ImmediateRequest") > -1;
					// on change, only the side effects which are required immediately, are requested
					// store the promise for resolution of value so it can be used if the side effect is not required immediately
					if (bImmediate) {
						bAtLeastOneImmediate = true;
						sFieldGroupId = sFieldGroupId.substr(0, sFieldGroupId.indexOf("$$ImmediateRequest"));
					} else if (that.mFieldGroupResolves.hasOwnProperty(sFieldGroupId)) {
						that.mFieldGroupResolves[sFieldGroupId].push(pValueResolved);
					} else {
						that.mFieldGroupResolves[sFieldGroupId] = [pValueResolved];
					}
					// queue to pending side effects, it is not necessary that the side effect is requested immediately
					if (that.aPendingSideEffects.indexOf(sFieldGroupId) === -1) {
						that.aPendingSideEffects.push(sFieldGroupId);
					}

					// if not required immediately, request will be handled later when user focuses out of the virtual field group of source properties for this side effect
					if (bImmediate) {
						pSideEffectsPrepared = pSideEffectsPrepared.then(function() {
							// The side effect must be requested on the appropriate context
							// TODO why not pass bindingContext
							return that.prepareForSideEffects(sFieldGroupId, oSourceField);
						});
					}
				});

				// Check if there are App Side Effects for the Field entity property
				pSideEffectsPrepared = pSideEffectsPrepared
					.then(function() {
						return that.prepareForAppSideEffects(oSourceField);
					})
					.then(function(oAppSideEffect) {
						if (oAppSideEffect) {
							bAtLeastOneImmediate = true;
						}
					});

				pSideEffectsPrepared
					.then(function() {
						if (bAtLeastOneImmediate) {
							that.requestSideEffects();
						}
					})
					.catch(function(oError) {
						Log.error("Error while processing side effects", oError);
					});
			},

			/**
			 * Handler for validateFieldGroup event.
			 * Used to request side effects that are now required.
			 * Only side effects annotated on the root entity type will be requested.
			 * @function
			 * @name handleSideEffect
			 * @param {object} oEvent event object passed by the validateFieldGroup event
			 */
			handleSideEffect: function(oEvent) {
				// If there are no pending side effects in records, there is nothing to do here
				if (!this.aPendingSideEffects || this.aPendingSideEffects.length === 0) {
					return;
				}
				var that = this,
					aFieldGroupIds = oEvent.getParameter("fieldGroupIds"),
					oSourceField = oEvent.getSource(),
					// promise to ensure side effects have been prepared before requesting
					pSideEffectsPrepared = Promise.resolve();

				aFieldGroupIds = aFieldGroupIds || [];

				aFieldGroupIds.forEach(function(sFieldGroupId) {
					var aFieldGroupResolves = [Promise.resolve()];
					if (that.mFieldGroupResolves && that.mFieldGroupResolves[sFieldGroupId]) {
						// Promise to ensure ALL involved fields' values have been resolved
						aFieldGroupResolves = that.mFieldGroupResolves[sFieldGroupId];
						// delete the stored promises for value resolution
						delete (that.mFieldGroupResolves && that.mFieldGroupResolves[sFieldGroupId]);
					}
					// TODO: Promise should be to ensure all value resolve promises are completed and at least one was resolved
					pSideEffectsPrepared = pSideEffectsPrepared
						.then(function() {
							// The side effect must be requested on the appropriate context
							return Promise.all(aFieldGroupResolves);
						})
						.then(that.prepareForSideEffects.bind(that, sFieldGroupId, oSourceField));
				});
				pSideEffectsPrepared.then(this.requestSideEffects.bind(this)).catch(function(oError) {
					Log.error("Error while requesting side effects", oError);
				});
			},

			/**
			 * Handler for patch events of list bindings (if field is in table) or context bindings (in form).
			 * This is only a fallback to request side effects (when PATCH failed previously) when some PATCH gets a success.
			 * Model would retry previously failed PATCHes and field needs to take care of requesting corresponding side effects.
			 * @function
			 * @name handlePatchEvents
			 * @param {object} oBinding - OP controller may send a binding or a binding context, this is uncertain
			 */
			handlePatchEvents: function(oBinding) {
				if (!oBinding) {
					return;
				}
				var that = this;
				// oBinding could be binding or binding context, this correction should be in OP controller
				oBinding = (oBinding.getBinding && oBinding.getBinding()) || oBinding;
				oBinding.attachEvent("patchCompleted", function(oEvent) {
					if (oEvent.getParameter("success") !== false && that.aFailedSideEffects) {
						Object.keys(that.aFailedSideEffects).forEach(function(sContextPath) {
							// initialize if not already
							that._initSideEffectsQueue(sContextPath, that.aFailedSideEffects[sContextPath]["context"]);
						});
						// request the failed side effects now as there was a successful PATCH
						that.requestSideEffects();
					}
				});
			},
			formatWithBrackets: function(sText1, sText2) {
				if (sText2) {
					return sText1 ? sText1 + " (" + sText2 + ")" : sText2;
				} else {
					return sText1 ? sText1 : "";
				}
			},
			formatWithPercentage: function(sValue) {
				return sValue !== null && sValue !== undefined ? sValue + " %" : "";
			},
			_fnSetFieldWidth: function(oFieldInfo) {
				var _fnSetWidthInModel = function(oFieldInfo, oAvatar, oVBox) {
					var oAvatarDom = oAvatar ? oAvatar.getDomRef() : undefined;
					var iWidth = 0;
					if (oAvatarDom) {
						iWidth =
							parseInt(getComputedStyle(oAvatarDom).marginRight, 10) +
							parseInt(getComputedStyle(oAvatarDom).marginLeft, 10) +
							oAvatar.getDomRef().offsetWidth;
					}
					var iVBoxWidth = oVBox.getDomRef().offsetWidth;
					var iFinalWidth = iVBoxWidth - iWidth;
					oFieldInfo.getModel("internal").setProperty("/QuickViewLinkContainerWidth", iFinalWidth + "px");
				};
				var oAvatar = oFieldInfo.findElements(true, function(oElement) {
					return oElement.isA("sap.m.Avatar");
				})[0];
				var oVBox = oFieldInfo.findElements(true, function(oElement) {
					return oElement.isA("sap.m.VBox");
				})[0];
				if (oVBox.getDomRef().offsetWidth === 0) {
					oVBox.onAfterRendering = function() {
						_fnSetWidthInModel(oFieldInfo, oAvatar, oVBox);
					};
				} else {
					_fnSetWidthInModel(oFieldInfo, oAvatar, oVBox);
				}
			},
			popoverAfterOpen: function(oEvent) {
				var oLink = oEvent.getSource();
				if (oLink.getDependents() && oLink.getDependents().length > 0) {
					var oFieldInfo = oLink.getDependents()[0];
					if (oFieldInfo && oFieldInfo.isA("sap.m.ResponsivePopover")) {
						FieldRuntime._fnSetFieldWidth(oFieldInfo);
					}
				}
			},
			pressLink: function(oEvent) {
				var oLink = oEvent.getSource();
				if (oLink.getDependents() && oLink.getDependents().length > 0) {
					var oFieldInfo = oLink.getDependents()[0];
					if (oFieldInfo && oFieldInfo.isA("sap.ui.mdc.Link")) {
						oFieldInfo
							.getTriggerHref()
							.then(function(sHref) {
								if (!sHref) {
									oFieldInfo
										.open(oLink)
										.then(function() {
											FieldRuntime._fnSetFieldWidth(oFieldInfo);
										})
										.catch(function(oError) {
											Log.error("Cannot retrieve the QuickView Popover dialog", oError);
										});
								} else {
									var oView = sap.ui.fl.Utils.getViewForControl(oLink);
									var oAppComponent = CommonUtils.getAppComponent(oView);
									var oShellServiceHelper = oAppComponent.getShellServices();
									var oShellHash = oShellServiceHelper.parseShellHash(sHref);
									var oNavArgs = {
										target: {
											semanticObject: oShellHash.semanticObject,
											action: oShellHash.action
										},
										params: oShellHash.params
									};
									if (CommonUtils.isStickyEditMode(oLink) !== true) {
										//URL params and xappState has been generated earlier hence using toExternal
										oShellServiceHelper.toExternal(oNavArgs, oAppComponent);
									} else {
										var sNewHref = oShellServiceHelper.hrefForExternal(oNavArgs, oAppComponent, false);
										openWindow(sNewHref);
									}
								}
							})
							.catch(function(oError) {
								Log.error("Error triggering link Href", oError);
							});
					}
				}
			}
		};

		return FieldRuntime;
	},
	/* bExport= */ true
);
