/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/mdc/link/Panel",
		"sap/ui/mdc/link/PanelItem",
		"sap/ui/mdc/LinkDelegate",
		"sap/ui/mdc/link/LinkItem",
		"sap/ui/mdc/link/Factory",
		"sap/ui/mdc/link/Log",
		"sap/base/Log",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/Fragment",
		"sap/fe/macros/field/FieldHelper",
		"sap/base/util/isPlainObject",
		"sap/ui/mdc/link/SemanticObjectMapping",
		"sap/ui/mdc/link/SemanticObjectMappingItem",
		"sap/ui/mdc/link/SemanticObjectUnavailableAction",
		"sap/base/util/merge",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/CommonUtils",
		"sap/ui/model/json/JSONModel",
		"sap/ui/fl/Utils",
		"sap/ui/util/openWindow"
	],
	function(
		Panel,
		PanelItem,
		LinkDelegate,
		LinkItem,
		Factory,
		Log,
		SapBaseLog,
		XMLPreprocessor,
		XMLTemplateProcessor,
		Fragment,
		FieldHelper,
		isPlainObject,
		SemanticObjectMapping,
		SemanticObjectMappingItem,
		SemanticObjectUnavailableAction,
		merge,
		SelectionVariant,
		CommonUtils,
		JSONModel,
		Utils,
		openWindow
	) {
		"use strict";
		var SimpleLinkDelegate = Object.assign({}, LinkDelegate);

		/**
		 * This will return an array of the SemanticObjects as strings given by the payload.
		 * @private
		 * @param {object} oPayLoad defined by the application
		 * @param {object} oMetaModel received from the Link
		 * @returns {string[]} containing SemanticObjects based of the payload
		 */
		SimpleLinkDelegate._getEntityType = function(oPayLoad, oMetaModel) {
			if (oMetaModel) {
				return oMetaModel.createBindingContext(oPayLoad.entityType);
			}
		};

		/**
		 * This will return an array of the SemanticObjects as strings given by the payload.
		 * @private
		 * @param {object} oPayLoad defined by the application
		 * @param {object} oMetaModel received from the Link
		 * @returns {string[]} containing SemanticObjects based of the payload
		 */
		SimpleLinkDelegate._getSemanticsModel = function(oPayLoad, oMetaModel) {
			if (oMetaModel) {
				var oSemanticModel = new JSONModel(oPayLoad);
				return oSemanticModel;
			}
		};

		/**
		 * This will return an array of the SemanticObjects as strings given by the payload.
		 * @private
		 * @param {object} oPayload defined by the application
		 * @param {object} oMetaModel received from the Link
		 * @returns {string[]} containing SemanticObjects based of the payload
		 */
		SimpleLinkDelegate._getDataField = function(oPayload, oMetaModel) {
			return oMetaModel.createBindingContext(oPayload.dataField);

			// return oPayload.dataField;
		};

		/**
		 * This will return an array of the SemanticObjects as strings given by the payload.
		 * @private
		 * @param {object} oPayload defined by the application
		 * @param {object} oMetaModel received from the Link
		 * @returns {string[]} containing SemanticObjects based of the payload
		 */
		SimpleLinkDelegate._getContact = function(oPayload, oMetaModel) {
			return oMetaModel.createBindingContext(oPayload.contact);
		};

		SimpleLinkDelegate.fnTemplateFragment = function(sFragmentName) {
			var that = this;
			var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");

			var oSemanticsModel = this._getSemanticsModel(this.payLoad, this.oMetaModel);

			var oFragmentModel = {};
			if (this.payLoad.entityType && this._getEntityType(this.payLoad, this.oMetaModel)) {
				oFragmentModel.bindingContexts = {
					"entityType": this._getEntityType(this.payLoad, this.oMetaModel),
					"semantic": oSemanticsModel.createBindingContext("/")
				};
				oFragmentModel.models = {
					"entityType": this.oMetaModel,
					"semantic": oSemanticsModel
				};
			} else if (this.payLoad.dataField && this._getDataField(this.payLoad, this.oMetaModel)) {
				oFragmentModel.bindingContexts = {
					"dataField": this._getDataField(this.payLoad, this.oMetaModel),
					"semantic": oSemanticsModel.createBindingContext("/")
				};
				oFragmentModel.models = {
					"dataField": this.oMetaModel,
					"semantic": oSemanticsModel
				};
			} else if (this.payLoad.contact && this._getContact(this.payLoad, this.oMetaModel)) {
				oFragmentModel.bindingContexts = {
					"contact": this._getContact(this.payLoad, this.oMetaModel)
				};
				oFragmentModel.models = {
					"contact": this.oMetaModel
				};
			}
			oFragmentModel.models.entitySet = this.oMetaModel;
			oFragmentModel.models.metaModel = this.oMetaModel;
			if (this.oControl && this.oControl.getModel("viewData")) {
				oFragmentModel.models.viewData = this.oControl.getModel("viewData");
				oFragmentModel.bindingContexts.viewData = this.oControl.getModel("viewData").createBindingContext("/");
			}

			return Promise.resolve(XMLPreprocessor.process(oFragment, { name: sFragmentName }, oFragmentModel)).then(function(oFragment) {
				return Fragment.load({
					definition: oFragment,
					controller: that
				});
			});
		};

		SimpleLinkDelegate.onPressTitleLink = function(oEvent) {
			if (oEvent.getParameter("target") !== "_blank") {
				var sHref = oEvent.getSource().getHref();
				var oURLParsing = Factory.getService("URLParsing");
				var oTitleLink = oEvent.getSource();
				var sHref = oTitleLink.getHref();
				var oTitleShellHash = sHref && oURLParsing.parseShellHash(sHref);
				var sIntent =
					oTitleShellHash &&
					oTitleShellHash.semanticObject &&
					oTitleShellHash.action &&
					oTitleShellHash.semanticObject + "-" + oTitleShellHash.action;
				var aLinks = oEvent
					.getSource()
					.getCustomData()[0]
					.getValue();
				for (var i = 0; i < aLinks.length; i++) {
					if (aLinks[i].key === sIntent) {
						oTitleLink.setHref(aLinks[i].href);
						break;
					}
				}
				sHref = oTitleLink.getHref();
				var oView = sap.ui.fl.Utils.getViewForControl(oTitleLink);
				var oAppComponent = CommonUtils.getAppComponent(oView);
				var oController = oView.getController();
				var oControl = oController && oController.getView(),
					oBindingContext = oControl && oControl.getBindingContext();
				if (!oBindingContext) {
					oBindingContext = oTitleLink.getBindingContext();
				}
				oEvent.preventDefault();
				this.beforeNavigationCallback(oEvent)
					.then(function(bNavigate) {
						if (bNavigate) {
							var oShellHash = oURLParsing.parseShellHash(sHref);
							var oShellServices = oAppComponent.getShellServices();
							var oNavArgs = {
								target: {
									semanticObject: oShellHash.semanticObject,
									action: oShellHash.action
								},
								params: oShellHash.params
							};

							if (CommonUtils.isStickyEditMode(oControl) !== true) {
								//URL params and xappState has been generated earlier hence using toExternal
								oShellServices.toExternal(oNavArgs, oAppComponent);
							} else {
								var sNewHref = oShellServices.hrefForExternal(oNavArgs, oAppComponent, false);
								openWindow(sNewHref);
							}
						}
					})
					.catch(function(oError) {
						SapBaseLog.error("Error while resolving field value", oError);
					});
			}
		};

		SimpleLinkDelegate.fetchAdditionalContent = function(oPayLoad, oBindingContext, oControl) {
			this.oControl = oControl || oBindingContext;
			this.payLoad = oPayLoad;
			if (oBindingContext && (oBindingContext.isA("sap.ui.model.odata.v4.Context") || oBindingContext.isA("sap.ui.mdc.Link"))) {
				this.oMetaModel = oBindingContext.getModel().getMetaModel();
				return this.fnTemplateFragment("sap.fe.macros.field.QuickViewLinkDelegate").then(function(oPopoverContent) {
					return [oPopoverContent];
				});
			}
			return Promise.resolve([]);
		};

		/**
		 * Fetches the relevant {@link sap.ui.mdc.link.LinkItem} for the Link and returns them.
		 * @public
		 * @param {object} oPayload - The Payload of the Link given by the application
		 * @param {object} oBindingContext - The ContextObject of the Link
		 * @param {object} oInfoLog - The InfoLog of the Link
		 * @returns {Promise} once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
		 */
		SimpleLinkDelegate.fetchLinkItems = function(oPayload, oBindingContext, oInfoLog) {
			if (oBindingContext && SimpleLinkDelegate._getSemanticObjects(oPayload)) {
				var oContextObject = oBindingContext.getObject();
				var aItemsToReturn = [];
				if (oInfoLog) {
					oInfoLog.initialize(SimpleLinkDelegate._getSemanticObjects(oPayload));
					aItemsToReturn.forEach(function(oItem) {
						oInfoLog.addIntent(Log.IntentType.API, {
							text: oItem.getText(),
							intent: oItem.getHref()
						});
					});
				}
				var oSemanticAttributes = SimpleLinkDelegate._calculateSemanticAttributes(oContextObject, oPayload, oInfoLog);
				return SimpleLinkDelegate._retrieveNavigationTargets("", oSemanticAttributes, oPayload, oInfoLog, this._link).then(function(
					aLinks,
					oOwnNavigationLink
				) {
					return aLinks.length === 0 ? null : aLinks;
				});
			} else {
				return Promise.resolve(null);
			}
		};

		SimpleLinkDelegate.fetchLinkType = function(oPayload, oLink) {
			var that = this;
			return new Promise(function(resolve) {
				if (oPayload) {
					if (oPayload.semanticObjects) {
						that._link = oLink;
						var oLinkItemsPromise = oLink.retrieveLinkItems();
						return Promise.all([oLinkItemsPromise]).then(function(values) {
							var aLinkItems = values[0];
							var oLinkItem;
							var nLinkType = 2;
							if (aLinkItems && aLinkItems.length === 1) {
								oLinkItem = new LinkItem({
									text: aLinkItems[0].getText(),
									href: aLinkItems[0].getHref()
								});
							}
							if (oLinkItem) {
								nLinkType = 1;
							} else if (aLinkItems.length === 0) {
								nLinkType = 0;
							} else {
								nLinkType = 2;
							}
							resolve({
								initialType: {
									type: nLinkType,
									directLink: oLinkItem ? oLinkItem : undefined
								},
								runtimeType: undefined
							});
						});
					} else if (oPayload.contact && oPayload.contact.length > 0) {
						resolve({
							initialType: {
								type: 2,
								directLink: undefined
							},
							runtimeType: undefined
						});
					} else if (oPayload.entityType && oPayload.navigationPath) {
						resolve({
							initialType: {
								type: 2,
								directLink: undefined
							},
							runtimeType: undefined
						});
					}
				} else {
					throw new Error("no payload or semanticObjects found");
				}
			}).catch(function(oError) {
				SapBaseLog.error("Error in SimpleLinkDelegate.fetchLinkType", oError);
			});
		};

		/**
		 * Enables the modification of LinkItems before the popover opens. This enables additional parameters
		 * to be added to the link.
		 *
		 * @param {object} oPayload - The payload of the Link given by the application
		 * @param {object} oBindingContext - The binding context of the Link
		 * @param {sap.ui.mdc.link.LinkItem} aLinkItems - The LinkItems of the Link that can be modified
		 * @returns {Promise} once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
		 */
		SimpleLinkDelegate.modifyLinkItems = function(oPayload, oBindingContext, aLinkItems) {
			if (aLinkItems.length !== 0) {
				var oLink = aLinkItems[0].getParent();
				var oView = sap.ui.fl.Utils.getViewForControl(oLink);
				var oMetaModel = oView.getModel().getMetaModel();
				var oAppComponent = CommonUtils.getAppComponent(oView);
				var mLineContext = oLink.getBindingContext();
				var oSelectionVariant;
				var oShellServices;
				var oTargetInfo = {
					semanticObject: oPayload.mainSemanticObject,
					action: ""
				};
				return new Promise(function(resolve) {
					var oNavigationService = oAppComponent.getNavigationService();
					var oController = oView.getController();
					oShellServices = oAppComponent.getShellServices();
					if (!oShellServices.hasUShell()) {
						SapBaseLog.error("QuickViewLinkDelegate: Service 'URLParsing' could not be obtained");
						return Promise.reject();
					}
					if (oView.getAggregation("content")[0] && oView.getAggregation("content")[0].getBindingContext()) {
						var oContext = oView.getAggregation("content")[0].getBindingContext();
						var sEntitySet = oMetaModel.getMetaPath(oContext.getPath()).replace(/^\/*/, "");
						var mPageContextData = oContext.getObject();
						var mLineContextData = mLineContext.getObject();
						var aPageContextAttributes = [
							{
								contextData: mPageContextData,
								entitySet: sEntitySet
							}
						];
						aPageContextAttributes = CommonUtils.removeSensitiveData(aPageContextAttributes, oMetaModel);
						var aLineContextAttributes = [
							{
								contextData: mLineContextData,
								entitySet: sEntitySet
							}
						];
						aLineContextAttributes = CommonUtils.removeSensitiveData(aLineContextAttributes, oMetaModel);
						var oMixedContext = merge({}, aPageContextAttributes[0], aLineContextAttributes[0]);
						oSelectionVariant = oNavigationService.mixAttributesAndSelectionVariant(oMixedContext, new SelectionVariant());
					} else {
						var oConditions = oController.filterBarConditions;
						oSelectionVariant = SimpleLinkDelegate._getMergedContext(mLineContext, oConditions, oNavigationService);
					}
					//TO modify the selection variant from the Extension API
					oView.getController().intentBasedNavigation.adaptNavigationContext(oSelectionVariant, oTargetInfo);
					SimpleLinkDelegate._removeTechnicalParameters(oSelectionVariant);
					if (oView.getViewData().entitySet && oSelectionVariant) {
						var sContextUrl = oNavigationService.constructContextUrl(oView.getViewData().entitySet, oView.getModel());
						oSelectionVariant.setFilterContextUrl(sContextUrl);
					}
					return oNavigationService
						.getAppStateKeyAndUrlParameters(oSelectionVariant.toJSONString())
						.then(function(oParams, appStateKey) {
							var sAppStateKey = appStateKey;
							oPayload.aSemanticLinks = [];
							var oShellHash, oNewShellHash;
							resolve(
								Promise.all(
									aLinkItems.map(function(oLinkItem) {
										return oShellServices.expandCompactHash(oLinkItem.getHref()).then(function(sHash) {
											oShellHash = oShellServices.parseShellHash(sHash);
											var _oContext = oContext === undefined ? mLineContext : oContext;
											var aNewParams = [
												{
													contextData: oShellHash.params,
													entitySet: oMetaModel.getMetaPath(_oContext.getPath()).replace(/^\/*/, "")
												}
											];
											aNewParams = CommonUtils.removeSensitiveData(aNewParams, oMetaModel);
											oNewShellHash = {
												target: {
													semanticObject: oShellHash.semanticObject,
													action: oShellHash.action
												},
												params: Object.assign(oParams, aNewParams[0]),
												appStateKey: sAppStateKey
											};
											delete oNewShellHash.params["sap-xapp-state"];
											oLinkItem.setHref(oShellServices.crossAppNavService.hrefForExternal(oNewShellHash));
											oPayload.aSemanticLinks.push(oLinkItem.getHref());
											return oLinkItem;
										});
									})
								)
							);
						});
				}).catch(function(oError) {
					SapBaseLog.error("Error while getting the navigation service", oError);
				});
			} else {
				return Promise.resolve(aLinkItems);
			}
		};

		SimpleLinkDelegate.beforeNavigationCallback = function(oPayload, oEvent) {
			return Promise.resolve(true);
		};

		SimpleLinkDelegate._removeTechnicalParameters = function(oSelectionVariant) {
			oSelectionVariant.removeSelectOption("@odata.context");
			oSelectionVariant.removeSelectOption("@odata.metadataEtag");
			oSelectionVariant.removeSelectOption("SAP__Messages");
		};

		SimpleLinkDelegate._getMergedContext = function(oContext, oConditions, oNavigationService) {
			var oConditionsSV, oSelectionVariant;
			var oMetaModel = oContext.getModel().getMetaModel();
			oConditionsSV = CommonUtils.addExternalStateFiltersToSelectionVariant(new SelectionVariant(), oConditions);
			var aAttributes = [
				{
					contextData: oContext.getObject(),
					entitySet: oMetaModel.getMetaPath(oContext.getPath()).replace(/^\/*/, "")
				}
			];
			aAttributes = CommonUtils.removeSensitiveData(aAttributes, oMetaModel);
			oSelectionVariant = oNavigationService.mixAttributesAndSelectionVariant(aAttributes[0], oConditionsSV.toJSONString());
			return oSelectionVariant;
		};

		/**
		 * Checks which attributes of the ContextObject belong to which SemanticObject and maps them into a two dimensional array.
		 * @private
		 * @param {object} oContextObject the BindingContext of the SourceControl of the Link / of the Link itself if not set
		 * @param {object} oPayload given by the application
		 * @param {object} oInfoLog of type {@link sap.ui.mdc.link.Log} - the corresponding InfoLog of the Link
		 * @returns {object} two dimensional array which maps a given SemanticObject name together with a given attribute name to the value of that given attribute
		 */
		SimpleLinkDelegate._calculateSemanticAttributes = function(oContextObject, oPayload, oInfoLog) {
			var aSemanticObjects = SimpleLinkDelegate._getSemanticObjects(oPayload);
			var mSemanticObjectMappings = SimpleLinkDelegate._convertSemanticObjectMapping(
				SimpleLinkDelegate._getSemanticObjectMappings(oPayload)
			);
			if (!aSemanticObjects.length) {
				aSemanticObjects.push("");
			}

			var oResults = {};
			aSemanticObjects.forEach(function(sSemanticObject) {
				if (oInfoLog) {
					oInfoLog.addContextObject(sSemanticObject, oContextObject);
				}
				oResults[sSemanticObject] = {};
				for (var sAttributeName in oContextObject) {
					var oAttribute = null,
						oTransformationAdditional = null;
					if (oInfoLog) {
						oAttribute = oInfoLog.getSemanticObjectAttribute(sSemanticObject, sAttributeName);
						if (!oAttribute) {
							oAttribute = oInfoLog.createAttributeStructure();
							oInfoLog.addSemanticObjectAttribute(sSemanticObject, sAttributeName, oAttribute);
						}
					}
					// Ignore undefined and null values
					if (oContextObject[sAttributeName] === undefined || oContextObject[sAttributeName] === null) {
						if (oAttribute) {
							oAttribute.transformations.push({
								value: undefined,
								description: "\u2139 Undefined and null values have been removed in SimpleLinkDelegate."
							});
						}
						continue;
					}
					// Ignore plain objects (BCP 1770496639)
					if (isPlainObject(oContextObject[sAttributeName])) {
						if (oAttribute) {
							oAttribute.transformations.push({
								value: undefined,
								description: "\u2139 Plain objects has been removed in SimpleLinkDelegate."
							});
						}
						continue;
					}

					// Map the attribute name only if 'semanticObjectMapping' is defined.
					// Note: under defined 'semanticObjectMapping' we also mean an empty annotation or an annotation with empty record
					var sAttributeNameMapped =
						mSemanticObjectMappings &&
						mSemanticObjectMappings[sSemanticObject] &&
						mSemanticObjectMappings[sSemanticObject][sAttributeName]
							? mSemanticObjectMappings[sSemanticObject][sAttributeName]
							: sAttributeName;

					if (oAttribute && sAttributeName !== sAttributeNameMapped) {
						oTransformationAdditional = {
							value: undefined,
							description:
								"\u2139 The attribute " +
								sAttributeName +
								" has been renamed to " +
								sAttributeNameMapped +
								" in SimpleLinkDelegate.",
							reason:
								"\ud83d\udd34 A com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation is defined for semantic object " +
								sSemanticObject +
								" with source attribute " +
								sAttributeName +
								" and target attribute " +
								sAttributeNameMapped +
								". You can modify the annotation if the mapping result is not what you expected."
						};
					}

					// If more then one local property maps to the same target property (clash situation)
					// we take the value of the last property and write an error log
					if (oResults[sSemanticObject][sAttributeNameMapped]) {
						SapBaseLog.error(
							"SimpleLinkDelegate: The attribute " +
								sAttributeName +
								" can not be renamed to the attribute " +
								sAttributeNameMapped +
								" due to a clash situation. This can lead to wrong navigation later on."
						);
					}

					// Copy the value replacing the attribute name by semantic object name
					oResults[sSemanticObject][sAttributeNameMapped] = oContextObject[sAttributeName];

					if (oAttribute) {
						if (oTransformationAdditional) {
							oAttribute.transformations.push(oTransformationAdditional);
							var aAttributeNew = oInfoLog.createAttributeStructure();
							aAttributeNew.transformations.push({
								value: oContextObject[sAttributeName],
								description:
									"\u2139 The attribute " +
									sAttributeNameMapped +
									" with the value " +
									oContextObject[sAttributeName] +
									" has been added due to a mapping rule regarding the attribute " +
									sAttributeName +
									" in SimpleLinkDelegate."
							});
							oInfoLog.addSemanticObjectAttribute(sSemanticObject, sAttributeNameMapped, aAttributeNew);
						}
					}
				}
			});
			return oResults;
		};

		/**
		 * Retrieves the actual targets for the navigation of the link. This uses the UShell loaded by the {@link sap.ui.mdc.link.Factory} to retrieve
		 * the navigation targets from the FLP service.
		 * @private
		 * @param {string} sAppStateKey key of the appstate (not used yet)
		 * @param {object} oSemanticAttributes calculated by _calculateSemanticAttributes
		 * @param {object} oPayload given by the application
		 * @param {object} oInfoLog of type {@link sap.ui.mdc.link.Log} - the corresponding InfoLog of the Link
		 * @param {object} oLink of type {@link sap.ui.mdc.link} - the corresponding Link
		 * @returns {Promise} resolving into availableAtions and ownNavigation containing an array of {@link sap.ui.mdc.link.LinkItem}
		 */
		SimpleLinkDelegate._retrieveNavigationTargets = function(sAppStateKey, oSemanticAttributes, oPayload, oInfoLog, oLink) {
			if (!oPayload.semanticObjects) {
				return new Promise(function(resolve) {
					resolve([]);
				});
			}
			var oThis = this;
			var aSemanticObjects = oPayload.semanticObjects;
			//var sSourceControlId = oPayload.sourceControl;
			var oNavigationTargets = {
				ownNavigation: undefined,
				availableActions: []
			};
			return sap.ui
				.getCore()
				.loadLibrary("sap.ui.fl", {
					async: true
				})
				.then(function() {
					return new Promise(function(resolve) {
						sap.ui.require(["sap/ui/fl/Utils"], function(Utils) {
							var oAppComponent = Utils.getAppComponentForControl(oLink === undefined ? oThis.oControl : oLink);
							var oShellServices = oAppComponent ? oAppComponent.getShellServices() : null;
							if (!oShellServices) {
								return resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
							}
							if (!oShellServices.hasUShell()) {
								SapBaseLog.error(
									"SimpleLinkDelegate: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained"
								);
								return resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
							}
							//var oControl = sap.ui.getCore().byId(sSourceControlId);
							//var oAppComponent = Utils.getAppComponentForControl(oControl);
							var aParams = aSemanticObjects.map(function(sSemanticObject) {
								return [
									{
										semanticObject: sSemanticObject,
										params: oSemanticAttributes ? oSemanticAttributes[sSemanticObject] : undefined,
										appStateKey: sAppStateKey,
										ui5Component: oAppComponent,
										sortResultsBy: "text"
									}
								];
							});

							return new Promise(function() {
								// We have to wrap getLinks method into Promise. The returned jQuery.Deferred.promise brakes the Promise chain.
								return oShellServices.getLinks(aParams).then(
									function(aLinks) {
										var bHasLinks = false;
										for (var i = 0; i < aLinks.length; i++) {
											for (var j = 0; j < aLinks[i].length; j++) {
												if (aLinks[i][j].length > 0) {
													bHasLinks = true;
													break;
												}
												if (bHasLinks) {
													break;
												}
											}
										}

										if (!aLinks || !aLinks.length || !bHasLinks) {
											return resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
										}
										var aSemanticObjectUnavailableActions = SimpleLinkDelegate._getSemanticObjectUnavailableActions(
											oPayload
										);
										var oUnavailableActions = SimpleLinkDelegate._convertSemanticObjectUnavailableAction(
											aSemanticObjectUnavailableActions
										);
										var sCurrentHash = oShellServices.hrefForExternal();
										if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
											// sCurrentHash can contain query string, cut it off!
											sCurrentHash = sCurrentHash.split("?")[0];
										}
										if (sCurrentHash) {
											// BCP 1770315035: we have to set the end-point '?' of action in order to avoid matching of "#SalesOrder-manage" in "#SalesOrder-manageFulfillment"
											sCurrentHash += "?";
										}
										// var fnGetDescription = function(sSubTitle, sShortTitle) {
										// 	if (sSubTitle && !sShortTitle) {
										// 		return sSubTitle;
										// 	} else if (!sSubTitle && sShortTitle) {
										// 		return sShortTitle;
										// 	} else if (sSubTitle && sShortTitle) {
										// 		return sSubTitle + " - " + sShortTitle;
										// 	}
										// };

										var fnIsUnavailableAction = function(sSemanticObject, sAction) {
											return (
												!!oUnavailableActions &&
												!!oUnavailableActions[sSemanticObject] &&
												oUnavailableActions[sSemanticObject].indexOf(sAction) > -1
											);
										};
										var fnAddLink = function(oLink) {
											var oShellHash = oShellServices.parseShellHash(oLink.intent);
											if (fnIsUnavailableAction(oShellHash.semanticObject, oShellHash.action)) {
												return;
											}
											var sHref = oShellServices.hrefForExternal(
												{ target: { shellHash: oLink.intent } },
												oAppComponent
											);

											if (oLink.intent && oLink.intent.indexOf(sCurrentHash) === 0) {
												// Prevent current app from being listed
												// NOTE: If the navigation target exists in
												// multiple contexts (~XXXX in hash) they will all be skipped
												oNavigationTargets.ownNavigation = new LinkItem({
													href: sHref,
													text: oLink.text
												});
												return;
											}
											var oLinkItem = new LinkItem({
												// As the retrieveNavigationTargets method can be called several time we can not create the LinkItem instance with the same id
												key:
													oShellHash.semanticObject && oShellHash.action
														? oShellHash.semanticObject + "-" + oShellHash.action
														: undefined,
												text: oLink.text,
												description: undefined,
												href: sHref,
												// target: not supported yet
												icon: undefined, //oLink.icon,
												initiallyVisible: oLink.tags && oLink.tags.indexOf("superiorAction") > -1
											});
											oNavigationTargets.availableActions.push(oLinkItem);

											if (oInfoLog) {
												oInfoLog.addSemanticObjectIntent(oShellHash.semanticObject, {
													intent: oLinkItem.getHref(),
													text: oLinkItem.getText()
												});
											}
										};
										for (var n = 0; n < aSemanticObjects.length; n++) {
											aLinks[n][0].forEach(fnAddLink);
										}
										return resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
									},
									function() {
										SapBaseLog.error(
											"SimpleLinkDelegate: '_retrieveNavigationTargets' failed executing getLinks method"
										);
										return resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
									}
								);
							}).catch();
						});
					});
				});
		};

		/**
		 * This will return an array of the SemanticObjects as strings given by the payload.
		 * @private
		 * @param {object} oPayload defined by the application
		 * @returns {string[]} containing SemanticObjects based of the payload
		 */
		SimpleLinkDelegate._getSemanticObjects = function(oPayload) {
			return oPayload.semanticObjects ? oPayload.semanticObjects : [];
		};

		/**
		 * This will return an array of {@link sap.ui.mdc.link.SemanticObjectUnavailableAction} depending on the given payload.
		 * @private
		 * @param {object} oPayload defined by the application
		 * @returns {object[]} of type {@link sap.ui.mdc.link.SemanticObjectUnavailableAction}
		 */
		SimpleLinkDelegate._getSemanticObjectUnavailableActions = function(oPayload) {
			var aSemanticObjectUnavailableActions = [];
			if (oPayload.semanticObjectUnavailableActions) {
				oPayload.semanticObjectUnavailableActions.forEach(function(oSemanticObjectUnavailableAction) {
					aSemanticObjectUnavailableActions.push(
						new SemanticObjectUnavailableAction({
							semanticObject: oSemanticObjectUnavailableAction.semanticObject,
							actions: oSemanticObjectUnavailableAction.actions
						})
					);
				});
			}
			return aSemanticObjectUnavailableActions;
		};

		/**
		 * This will return an array of {@link sap.ui.mdc.link.SemanticObjectMapping} depending on the given payload.
		 * @private
		 * @param {object} oPayload defined by the application
		 * @returns {object[]} of type {@link sap.ui.mdc.link.SemanticObjectMapping}
		 */
		SimpleLinkDelegate._getSemanticObjectMappings = function(oPayload) {
			var aSemanticObjectMappings = [];
			var aSemanticObjectMappingItems = [];
			if (oPayload.semanticObjectMappings) {
				oPayload.semanticObjectMappings.forEach(function(oSemanticObjectMapping) {
					aSemanticObjectMappingItems = [];
					if (oSemanticObjectMapping.items) {
						oSemanticObjectMapping.items.forEach(function(oSemanticObjectMappingItem) {
							aSemanticObjectMappingItems.push(
								new SemanticObjectMappingItem({
									key: oSemanticObjectMappingItem.key,
									value: oSemanticObjectMappingItem.value
								})
							);
						});
					}
					aSemanticObjectMappings.push(
						new SemanticObjectMapping({
							semanticObject: oSemanticObjectMapping.semanticObject,
							items: aSemanticObjectMappingItems
						})
					);
				});
			}
			return aSemanticObjectMappings;
		};

		/**
		 * Converts a given array of SemanticObjectMapping into a Map containing SemanticObjects as Keys and a Map of it's corresponding SemanticObjectMappings as values.
		 * @private
		 * @param {object[]} aSemanticObjectMappings of type {@link sap.ui.mdc.link.SemanticObjectMapping}
		 * @returns {Map<string, Map<string, string>>} mSemanticObjectMappings
		 */
		SimpleLinkDelegate._convertSemanticObjectMapping = function(aSemanticObjectMappings) {
			if (!aSemanticObjectMappings.length) {
				return undefined;
			}
			var mSemanticObjectMappings = {};
			aSemanticObjectMappings.forEach(function(oSemanticObjectMapping) {
				if (!oSemanticObjectMapping.getSemanticObject()) {
					throw Error(
						"SimpleLinkDelegate: 'semanticObject' property with value '" +
							oSemanticObjectMapping.getSemanticObject() +
							"' is not valid"
					);
				}
				mSemanticObjectMappings[oSemanticObjectMapping.getSemanticObject()] = oSemanticObjectMapping
					.getItems()
					.reduce(function(oMap, oItem) {
						oMap[oItem.getKey()] = oItem.getValue();
						return oMap;
					}, {});
			});
			return mSemanticObjectMappings;
		};

		/**
		 * Converts a given array of SemanticObjectUnavailableActions into a Map containing SemanticObjects as Keys and a Map of it's corresponding SemanticObjectUnavailableActions as values.
		 * @private
		 * @param {object[]} aSemanticObjectUnavailableActions of type {@link sap.ui.mdc.link.SemanticObjectUnavailableAction}
		 * @returns {Map<string, Map<string, string>>} mSemanticObjectUnavailableActions
		 */
		SimpleLinkDelegate._convertSemanticObjectUnavailableAction = function(aSemanticObjectUnavailableActions) {
			if (!aSemanticObjectUnavailableActions.length) {
				return undefined;
			}
			var mSemanticObjectUnavailableActions = {};
			aSemanticObjectUnavailableActions.forEach(function(oSemanticObjectUnavailableActions) {
				if (!oSemanticObjectUnavailableActions.getSemanticObject()) {
					throw Error(
						"SimpleLinkDelegate: 'semanticObject' property with value '" +
							oSemanticObjectUnavailableActions.getSemanticObject() +
							"' is not valid"
					);
				}
				mSemanticObjectUnavailableActions[
					oSemanticObjectUnavailableActions.getSemanticObject()
				] = oSemanticObjectUnavailableActions.getActions();
			});
			return mSemanticObjectUnavailableActions;
		};

		return SimpleLinkDelegate;
	},
	/* bExport= */
	true
);
