sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log"
	],
	function(
		ControllerExtension,
		OverrideExecution,
		SelectionVariant,
		ModelHelper,
		XMLPreprocessor,
		XMLTemplateProcessor,
		Fragment,
		JSONModel,
		Log
	) {
		"use strict";

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.InternalInternalBasedNavigation
		 *
		 * @private
		 * @since 1.84.0
		 */
		return ControllerExtension.extend("sap.fe.core.controllerextensions.InternalInternalBasedNavigation", {
			metadata: {
				methods: {
					navigate: {
						"final": true,
						"public": true
					},
					getEntitySet: {
						"final": false,
						"public": false
					},
					navigateOutbound: {
						"final": true,
						"public": true
					},
					navigateWithConfirmationDialog: {
						"final": true,
						"public": true
					},
					getNavigationMode: {
						"final": false,
						"public": true,
						overrideExecution: OverrideExecution.Instead
					}
				}
			},
			/**
			 * Allows for Navigation to a given Intent(SemanticObject-Action) with the provided context.
			 * If Semantic Object mapping is provided that is also applied to the Selection Variant after adaptation by a consumer.
			 * This takes care of removing any technical parameters and determines if an explace or inplace navigation should take place.
			 *
			 * @param {string} sSemanticObject Semantic Object for the target app
			 * @param {string} sAction  Action for the target app
			 * @param {object} [mNavigationParameters] Optional parameters to be passed to the external navigation
			 * @param {Array|object} [mNavigationParameters.navigationContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects to be passed to intent.
			 *		  if an array of contexts is passed the context is used to determine the meta path and accordingly remove the sensitive data
			 *		  if an array of objects is passed the following format is expected :
			 *		  {
			 *			data: {
			 *	 			ProductID: 7634,
			 *				Name: "Laptop"
			 *			 },
			 *			 metaPath: "/SalesOrderManage"
			 *        }
			 *		The metaPath is used to remove any sensitive data.
			 * @param {string | object} [mNavigationParameters.semanticObjectMapping] stringified SemanticObjectMapping or SemanticObjectMapping that applies to this navigation
			 **/
			navigate: function(sSemanticObject, sAction, mNavigationParameters) {
				var vNavigationContexts = mNavigationParameters && mNavigationParameters.navigationContexts,
					aNavigationContexts =
						vNavigationContexts && !Array.isArray(vNavigationContexts) ? [vNavigationContexts] : vNavigationContexts,
					vSemanticObjectMapping = mNavigationParameters && mNavigationParameters.semanticObjectMapping,
					oTargetInfo = {
						semanticObject: sSemanticObject,
						action: sAction
					};

				if (sSemanticObject && sAction) {
					var aSemanticAttributes,
						oSelectionVariant = new SelectionVariant(),
						that = this;

					// 1. get SemanticAttributes for navigation
					if (aNavigationContexts && aNavigationContexts.length) {
						aSemanticAttributes = aNavigationContexts.map(function(oNavigationContext) {
							// 1.1.a if navigation context is instance of sap.ui.mode.odata.v4.Context
							// else check if navigation context is of type object
							if (oNavigationContext.isA && oNavigationContext.isA("sap.ui.model.odata.v4.Context")) {
								// 1.1.b remove sensitive data
								var oSemanticAttributes = oNavigationContext.getObject(),
									sMetaPath = that._oMetaModel.getMetaPath(oNavigationContext.getPath());
								return that._removeSensitiveData(oSemanticAttributes, sMetaPath);
							} else if (typeof oNavigationContext === "object") {
								// 1.1.b remove sensitive data from object
								return that._removeSensitiveData(oNavigationContext.data, oNavigationContext.metaPath);
							}
						});
					}
					// 2.1 Merge base selection variant and sanitized semantic attributes into one SelectionVariant
					if (aSemanticAttributes && aSemanticAttributes.length) {
						oSelectionVariant = this._oNavigationService.mixAttributesAndSelectionVariant(
							aSemanticAttributes,
							oSelectionVariant.toJSONString()
						);
					}

					// 3. Add filterContextUrl to SV so the NavigationHandler can remove any sensitive data based on view entitySet
					var oModel = this._oView.getModel(),
						sEntitySet = this.getEntitySet(),
						sContextUrl = sEntitySet ? this._oNavigationService.constructContextUrl(sEntitySet, oModel) : undefined;
					if (sContextUrl) {
						oSelectionVariant.setFilterContextUrl(sContextUrl);
					}

					// 4. give an opportunity for the application to influence the SelectionVariant
					this.base
						.getView()
						.getController()
						.intentBasedNavigation.adaptNavigationContext(oSelectionVariant, oTargetInfo);

					// 5. Apply semantic object mappings to the SV
					if (vSemanticObjectMapping) {
						this._applySemanticObjectMappings(oSelectionVariant, vSemanticObjectMapping);
					}

					// 6. remove tehnical parameters from Selection Variant
					this._removeTechnicalParameters(oSelectionVariant);

					// 7. check if programming model is sticky and page is editable
					var sNavMode = this.base
						.getView()
						.getController()
						._intentBasedNavigation.getNavigationMode();

					// 7. Navigate via NavigationHandler
					var onError = function() {
						sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
							var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
							MessageBox.show(oResourceBundle.getText("C_COMMON_HELPER_NAVIGATION_ERROR_MESSAGE"), {
								title: oResourceBundle.getText("C_COMMON_NAVIGATION_ERROR_TITLE")
							});
						});
					};
					this._oNavigationService.navigate(
						sSemanticObject,
						sAction,
						oSelectionVariant.toJSONString(),
						null,
						onError,
						null,
						sNavMode
					);
				} else {
					throw new Error("Semantic Object/action is not provided");
				}
			},

			/**
			 * Get Navigation mode.
			 *
			 * @returns {string} navigation mode
			 *
			 *
			 */
			getNavigationMode: function() {
				return "inplace";
			},
			/**
			 * Allows for Navigation to a given Intent(SemanticObject-Action) with the provided context with a dialog showing the contexts which cannot be passed
			 * If Semantic Object mapping is provided that is also applied to the Selection Variant after adaptation by a consumer.
			 * This takes care of removing any technical parameters and determines if an explace or inplace navigation should take place.
			 *
			 * @param {string} sSemanticObject Semantic Object for the target app
			 * @param {string} sAction  Action for the target app
			 * @param {object} [mNavigationParameters] Optional parameters to be passed to the external navigation
			 * @param {Array|object} [mNavigationParameters.navigationContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects to be passed to intent.
			 * @param {Array|object} [mNavigationParameters.applicableContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects to be passed to intent and for which the IBN button is enabled
			 * @param {Array|object} [mNavigationParameters.notApplicableContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects which cannot be passed to the intent.
			 *		  if an array of contexts is passed the context is used to determine the meta path and accordingly remove the sensitive data
			 *		  if an array of objects is passed the following format is expected :
			 *		  {
			 *			data: {
			 *	 			ProductID: 7634,
			 *				Name: "Laptop"
			 *			 },
			 *			 metaPath: "/SalesOrderManage"
			 *        }
			 *		The metaPath is used to remove any sensitive data.
			 * @param {string | object} [mNavigationParameters.semanticObjectMapping] stringified SemanticObjectMapping or SemanticObjectMapping that applies to this navigation
			 **/
			navigateWithConfirmationDialog: function(sSemanticObject, sAction, mNavigationParameters) {
				var that = this;
				if (mNavigationParameters.notApplicableContexts && mNavigationParameters.notApplicableContexts.length >= 1) {
					var oApplicableContextDialog;
					var oController = {
						onClose: function() {
							// User cancels action
							oApplicableContextDialog.close();
						},
						onContinue: function() {
							// Users continues the action with the bound contexts
							mNavigationParameters.navigationContexts = mNavigationParameters.applicableContexts;
							oApplicableContextDialog.close();
							that.navigate(sSemanticObject, sAction, mNavigationParameters);
						}
					};
					var fnOpenAndFillDialog = function() {
						var oDialogContent,
							nNotApplicable = mNavigationParameters.notApplicableContexts.length,
							aNotApplicableItems = [];
						for (var i = 0; i < mNavigationParameters.notApplicableContexts.length; i++) {
							oDialogContent = mNavigationParameters.notApplicableContexts[i].getObject();
							aNotApplicableItems.push(oDialogContent);
						}
						var oNotApplicableItemsModel = new JSONModel(aNotApplicableItems);
						var oTotals = new JSONModel({ total: nNotApplicable, label: mNavigationParameters.label });
						oApplicableContextDialog.setModel(oNotApplicableItemsModel, "notApplicable");
						oApplicableContextDialog.setModel(oTotals, "totals");
						oApplicableContextDialog.open();
					};
					// Show the contexts that are not applicable and will not therefore be processed
					var sFragmentName = "sap.fe.core.controls.ActionPartial";
					var oDialogFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
					var oModel = this._oView.getModel();
					var oMetaModel = oModel.getMetaModel();
					var sCanonicalPath = mNavigationParameters.notApplicableContexts[0].getCanonicalPath();
					var sEntitySet = sCanonicalPath.substr(0, sCanonicalPath.indexOf("(")) + "/";
					Promise.resolve(
						XMLPreprocessor.process(
							oDialogFragment,
							{ name: sFragmentName },
							{
								bindingContexts: {
									entityType: oMetaModel.createBindingContext(sEntitySet)
								},
								models: {
									entityType: oMetaModel,
									metaModel: oMetaModel
								}
							}
						)
					)
						.then(function(oFragment) {
							return Fragment.load({ definition: oFragment, controller: oController });
						})
						.then(function(oPopover) {
							oApplicableContextDialog = oPopover;
							that.getView().addDependent(oPopover);
							fnOpenAndFillDialog();
						})
						.catch(function() {
							Log.error("Error");
						});
				} else {
					that.navigate(sSemanticObject, sAction, mNavigationParameters);
				}
			},
			_removeTechnicalParameters: function(oSelectionVariant) {
				oSelectionVariant.removeSelectOption("@odata.context");
				oSelectionVariant.removeSelectOption("@odata.metadataEtag");
				oSelectionVariant.removeSelectOption("SAP__Messages");
			},
			/**
			 * Get targeted Entity set.
			 *
			 * @returns {string} Entity set name
			 *
			 *
			 */
			getEntitySet: function() {
				return this._oView.getViewData().entitySet;
			},
			/**
			 * Removes sensitive data from the semantic attribute with respect to entitySet.
			 *
			 * @param {object} oAttributes context data
			 * @param {boolean} sMetaPath Meta path to reach the entityset in the MetaModel
			 * @returns {Array} Array of semantic Attributes
			 * @private
			 **/
			_removeSensitiveData: function(oAttributes, sMetaPath) {
				var aProperties = Object.keys(oAttributes);
				if (aProperties.length) {
					delete oAttributes["@odata.context"];
					delete oAttributes["@odata.metadataEtag"];
					delete oAttributes["SAP__Messages"];
					for (var j = 0; j < aProperties.length; j++) {
						var sProp = aProperties[j],
							aPropertyAnnotations = this._oMetaModel.getObject(sMetaPath + "/" + sProp + "@");
						if (aPropertyAnnotations) {
							if (
								aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
								aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
								aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]
							) {
								delete oAttributes[sProp];
							} else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
								var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
								if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
									delete oAttributes[sProp];
								} else if (
									oFieldControl["$Path"] &&
									this._isFieldControlPathInapplicable(oFieldControl["$Path"], oAttributes)
								) {
									delete oAttributes[sProp];
								}
							}
						}
					}
				}
				return oAttributes;
			},

			/**
			 * Check if Path based FieldControl Evaluates to inapplicable.
			 *
			 * @param {string} sFieldControlPath - Field control path
			 * @param {object} oAttribute - SemanticAttributes
			 * @returns {boolean} true if inapplicable
			 *
			 */
			_isFieldControlPathInapplicable: function(sFieldControlPath, oAttribute) {
				var bInapplicable = false,
					aParts = sFieldControlPath.split("/");
				// sensitive data is removed only if the path has already been resolved.
				if (aParts.length > 1) {
					bInapplicable =
						oAttribute[aParts[0]] && oAttribute[aParts[0]].hasOwnProperty(aParts[1]) && oAttribute[aParts[0]][aParts[1]] === 0;
				} else {
					bInapplicable = oAttribute[sFieldControlPath] === 0;
				}
				return bInapplicable;
			},
			/**
			 * Method to replace Local Properties with Semantic Object mappings.
			 *
			 * @param {object} oSelectionVariant - SelectionVariant consisting of filterbar, Table and Page Context
			 * @param {object} vMappings - stringified version of semantic object mapping
			 * @returns {object} - Modified SelectionVariant with LocalProperty replaced with SemanticObjectProperties.
			 */
			_applySemanticObjectMappings: function(oSelectionVariant, vMappings) {
				var oMappings = typeof vMappings === "string" ? JSON.parse(vMappings) : vMappings;
				for (var i = 0; i < oMappings.length; i++) {
					var sLocalProperty =
						(oMappings[i]["LocalProperty"] && oMappings[i]["LocalProperty"]["$PropertyPath"]) ||
						(oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"] &&
							oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"]["$Path"]);
					var sSemanticObjectProperty =
						oMappings[i]["SemanticObjectProperty"] || oMappings[i]["@com.sap.vocabularies.Common.v1.SemanticObjectProperty"];
					if (oSelectionVariant.getSelectOption(sLocalProperty)) {
						var oSelectOption = oSelectionVariant.getSelectOption(sLocalProperty);

						//Create a new SelectOption with sSemanticObjectProperty as the property Name and remove the older one
						oSelectionVariant.removeSelectOption(sLocalProperty);
						oSelectionVariant.massAddSelectOption(sSemanticObjectProperty, oSelectOption);
					}
				}
				return oSelectionVariant;
			},
			/**
			 * Navigates to an Outbound provided in the manifest.
			 * @function
			 * @param {string} sOutbound Identifier to location the outbound in the manifest
			 * @param {object} mNavigationParameters Optional map containing key/value pairs to be passed to the intent
			 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#navigateOutbound
			 * @since 1.86.0
			 **/
			navigateOutbound: function(sOutbound, mNavigationParameters) {
				var oManifestEntry = this.base.getAppComponent().getManifestEntry("sap.app"),
					oOutbound = oManifestEntry.crossNavigation && oManifestEntry.crossNavigation.outbounds[sOutbound];
				if (!oOutbound) {
					Log.error("Outbound is not defined in manifest!!");
					return;
				}
				var sSemanticObject = oOutbound.semanticObject,
					sAction = oOutbound.action,
					outboundParams = oOutbound.parameters && this._getOutboundParams(oOutbound.parameters);

				if (mNavigationParameters || outboundParams) {
					mNavigationParameters = {
						navigationContexts: {
							data: mNavigationParameters || outboundParams
						}
					};
				}
				this.base._intentBasedNavigation.navigate(sSemanticObject, sAction, mNavigationParameters);
			},

			/**
			 * Gets parameters in app descriptor outbounds.
			 *
			 * @function
			 * @param {object} [oOutboundParams] parameters defined in the outbounds. Only "plain" is supported
			 * @returns {Array} [aParamsMapping] parameters with the key-Value pair
			 **/
			_getOutboundParams: function(oOutboundParams) {
				var oParamsMapping = {};
				if (oOutboundParams) {
					var aParameters = Object.keys(oOutboundParams) || [];
					if (aParameters.length > 0) {
						aParameters.forEach(function(key) {
							var oMapping = oOutboundParams[key];
							if (oMapping.value && oMapping.value.value && oMapping.value.format === "plain") {
								if (!oParamsMapping[key]) {
									oParamsMapping[key] = oMapping.value.value;
								}
							}
						});
					}
				}
				return oParamsMapping;
			},
			override: {
				onInit: function() {
					this._oAppComponent = this.base.getAppComponent();
					this._oMetaModel = this._oAppComponent.getModel().getMetaModel();
					this._oNavigationService = this._oAppComponent.getNavigationService();
					this._oView = this.base.getView();
				}
			}
		});
	}
);
