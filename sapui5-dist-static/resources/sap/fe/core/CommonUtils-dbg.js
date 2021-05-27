/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/View",
		"sap/ui/core/Component",
		"sap/m/MessageBox",
		"sap/base/Log",
		"sap/fe/navigation/SelectionVariant",
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/library",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/helpers/SemanticDateOperators",
		"sap/fe/core/templating/FilterHelper",
		"sap/ui/mdc/condition/Condition",
		"sap/ui/mdc/enum/ConditionValidated"
	],
	function(
		View,
		Component,
		MessageBox,
		Log,
		SelectionVariant,
		FilterOperatorUtil,
		TypeUtil,
		StableIdHelper,
		FELibrary,
		ModelHelper,
		SemanticDateOperators,
		FilterHelper,
		Condition,
		ConditionValidated
	) {
		"use strict";

		var ProgrammingModel = FELibrary.ProgrammingModel;

		var aValidTypes = [
			"Edm.Boolean",
			"Edm.Byte",
			"Edm.Date",
			"Edm.DateTime",
			"Edm.DateTimeOffset",
			"Edm.Decimal",
			"Edm.Double",
			"Edm.Float",
			"Edm.Guid",
			"Edm.Int16",
			"Edm.Int32",
			"Edm.Int64",
			"Edm.SByte",
			"Edm.Single",
			"Edm.String",
			"Edm.Time",
			"Edm.TimeOfDay"
		];

		/**
		 * Returns the actual property type of a given datafield or property.
		 *
		 * @param {sap.ui.model.Context} oNavigationContext the metamodel context
		 * @returns {string} the name of the actual data type
		 */
		function getPropertyDataType(oNavigationContext) {
			var sDataType = oNavigationContext.getProperty("$Type");
			// if $kind exists, it's not a DataField and we have the final type already
			if (!oNavigationContext.getProperty("$kind")) {
				switch (sDataType) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						sDataType = undefined;
						break;

					case "com.sap.vocabularies.UI.v1.DataField":
					case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
					case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
						sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
						break;

					case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
					default:
						var sAnnotationPath = oNavigationContext.getProperty("Target/$AnnotationPath");
						if (sAnnotationPath) {
							if (sAnnotationPath.indexOf("com.sap.vocabularies.Communication.v1.Contact") > -1) {
								sDataType = oNavigationContext.getProperty("Target/$AnnotationPath/fn/$Path/$Type");
							} else if (sAnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint") > -1) {
								sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
							} else {
								// e.g. FieldGroup or Chart
								sDataType = undefined;
							}
						} else {
							sDataType = undefined;
						}
						break;
				}
			}

			return sDataType;
		}

		function fnHasTransientContexts(oListBinding) {
			var bHasTransientContexts = false;
			if (oListBinding) {
				oListBinding.getCurrentContexts().forEach(function(oContext) {
					if (oContext && oContext.isTransient()) {
						bHasTransientContexts = true;
					}
				});
			}
			return bHasTransientContexts;
		}

		function getNavigationRestrictions(oModel, sEntitySetPath, sNavigationPath) {
			var oNavigationRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.NavigationRestrictions");
			var aRestrictedProperties = oNavigationRestrictions && oNavigationRestrictions.RestrictedProperties;
			return (
				aRestrictedProperties &&
				aRestrictedProperties.find(function(oRestrictedProperty) {
					return oRestrictedProperty.NavigationProperty.$NavigationPropertyPath === sNavigationPath;
				})
			);
		}

		function _isInNonFilterableProperties(oModel, sEntitySetPath, sContextPath) {
			var bIsNotFilterable = false;
			var oAnnotation = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
			if (oAnnotation && oAnnotation.NonFilterableProperties) {
				bIsNotFilterable = oAnnotation.NonFilterableProperties.some(function(property) {
					return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
				});
			}
			return bIsNotFilterable;
		}

		// TODO rework this!
		function _isContextPathFilterable(oModel, sEntitySetPath, sContexPath) {
			var aContext = sContexPath.split("/"),
				bIsNotFilterable = false,
				sContext = "";

			aContext.some(function(item, index, array) {
				if (sContext.length > 0) {
					sContext += "/" + item;
				} else {
					sContext = item;
				}
				if (index === array.length - 2) {
					// In case of "/Customer/Set/Property" this is to check navigation restrictions of "Customer" for non-filterable properties in "Set"
					var oNavigationRestrictions = getNavigationRestrictions(oModel, sEntitySetPath, item);
					var oFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions.FilterRestrictions;
					var aNonFilterableProperties = oFilterRestrictions && oFilterRestrictions.NonFilterableProperties;
					var sTargetPropertyPath = array[array.length - 1];
					if (
						aNonFilterableProperties &&
						aNonFilterableProperties.find(function(oPropertyPath) {
							return oPropertyPath.$PropertyPath === sTargetPropertyPath;
						})
					) {
						return false;
					}
				}
				if (index === array.length - 1) {
					//last path segment
					bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
				} else if (oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item)) {
					//check existing context path and initialize it
					bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
					sContext = "";
					//set the new EntitySet
					sEntitySetPath = "/" + oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item);
				}
				return bIsNotFilterable === true;
			});
			return bIsNotFilterable;
		}

		// TODO check used places and rework this
		/**
		 * Checks if the property is filterable.
		 *
		 * @param {object} oModel - MetaModel
		 * @param {string} sEntitySetPath - EntitySet Path
		 * @param {string} sProperty - Entityset's Property
		 * @param {boolean} bSkipHiddenFilter - if HiddenFilters annotation check needs to be skipped
		 * @returns {boolean} bIsNotFilterable - True, if the property is filterable
		 *
		 */
		function isPropertyFilterable(oModel, sEntitySetPath, sProperty, bSkipHiddenFilter) {
			if (typeof sProperty !== "string") {
				throw new Error("sProperty parameter must be a string", sProperty);
			}
			var bIsFilterable;
			var oNavigationContext = oModel.createBindingContext(sEntitySetPath + "/" + sProperty);

			if (oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.Hidden") === true) {
				return false;
			}

			if (!bSkipHiddenFilter && oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.HiddenFilter")) {
				return false;
			}

			if (sProperty.indexOf("/") < 0) {
				bIsFilterable = !_isInNonFilterableProperties(oModel, sEntitySetPath, sProperty);
			} else {
				bIsFilterable = !_isContextPathFilterable(oModel, sEntitySetPath, sProperty);
			}
			// check if type can be used for filtering
			if (bIsFilterable && oNavigationContext) {
				var sPropertyDataType = getPropertyDataType(oNavigationContext);
				if (sPropertyDataType) {
					bIsFilterable = aValidTypes.indexOf(sPropertyDataType) !== -1;
				} else {
					bIsFilterable = false;
				}
			}

			return bIsFilterable;
		}

		function getShellServices(oControl) {
			return getAppComponent(oControl).getShellServices();
		}

		function _getSOIntents(oObjectPageLayout, oSemanticObject, oParam) {
			var oShellServiceHelper = CommonUtils.getShellServices(oObjectPageLayout);
			return oShellServiceHelper.getLinks({
				semanticObject: oSemanticObject,
				params: oParam
			});
		}
		// TO-DO add this as part of applySemanticObjectmappings logic in IntentBasednavigation controller extension
		function _createMappings(oMapping) {
			var aSOMappings = [];
			var aMappingKeys = Object.keys(oMapping);
			for (var i = 0; i < aMappingKeys.length; i++) {
				var oSemanticMapping = {
					"LocalProperty": {
						"$PropertyPath": aMappingKeys[i]
					},
					"SemanticObjectProperty": oMapping[aMappingKeys[i]]
				};
				aSOMappings.push(oSemanticMapping);
			}

			return aSOMappings;
		}

		function _getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aItems) {
			for (var i = 0; i < aLinks.length; i++) {
				var oLink = aLinks[i];
				var sIntent = oLink.intent;
				var sAction = sIntent.split("-")[1].split("?")[0];
				if (aExcludedActions && aExcludedActions.indexOf(sAction) === -1) {
					aItems.push({
						text: oLink.text,
						targetSemObject: sIntent.split("#")[1].split("-")[0],
						targetAction: sAction.split("~")[0],
						targetParams: oTargetParams
					});
				}
			}
		}
		function _getRelatedIntents(oAdditionalSemanticObjects, oBindingContext, aManifestSOItems, aLinks) {
			if (aLinks && aLinks.length > 0) {
				var aExcludedActions = oAdditionalSemanticObjects.unavailableActions ? oAdditionalSemanticObjects.unavailableActions : [];
				var aSOMappings = oAdditionalSemanticObjects.mapping ? _createMappings(oAdditionalSemanticObjects.mapping) : [];
				var oTargetParams = { navigationContexts: oBindingContext, semanticObjectMapping: aSOMappings };
				_getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aManifestSOItems);
			}
		}
		function updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath) {
			var oShellServiceHelper = getShellServices(oObjectPageLayout),
				oParam = {},
				sCurrentSemObj = "",
				sCurrentAction = "";
			var oSemanticObjectAnnotations;
			var aRelatedAppsMenuItems = [];
			var aExcludedActions = [];

			if (oEntry) {
				if (aSemKeys && aSemKeys.length > 0) {
					for (var j = 0; j < aSemKeys.length; j++) {
						var sSemKey = aSemKeys[j].$PropertyPath;
						if (!oParam[sSemKey]) {
							oParam[sSemKey] = { value: oEntry[sSemKey] };
						}
					}
				} else {
					// fallback to Technical Keys if no Semantic Key is present
					var aTechnicalKeys = oMetaModel.getObject(oMetaPath + "/$Type/$Key");
					for (var key in aTechnicalKeys) {
						var sObjKey = aTechnicalKeys[key];
						if (!oParam[sObjKey]) {
							oParam[sObjKey] = { value: oEntry[sObjKey] };
						}
					}
				}
			}
			// Logic to read additional SO from manifest and updated relatedapps model

			var oManifestData = getTargetView(oObjectPageLayout).getViewData();
			var aManifestSOItems = [];
			if (oManifestData.additionalSemanticObjects) {
				var aManifestSOKeys = Object.keys(oManifestData.additionalSemanticObjects);
				for (var key = 0; key < aManifestSOKeys.length; key++) {
					_getSOIntents(oObjectPageLayout, aManifestSOKeys[key], oParam)
						.then(
							_getRelatedIntents.bind(
								this,
								oManifestData.additionalSemanticObjects[aManifestSOKeys[key]],
								oBindingContext,
								aManifestSOItems
							)
						)
						.catch(function(oError) {
							Log.error("Error while retrieving SO Intents", oError);
						});
				}
			}
			function fnGetParseShellHashAndGetLinks() {
				var oParsedUrl = oShellServiceHelper.parseShellHash(document.location.hash);
				sCurrentSemObj = oParsedUrl.semanticObject; // Current Semantic Object
				sCurrentAction = oParsedUrl.action;
				return _getSOIntents(oObjectPageLayout, sCurrentSemObj, oParam);
			}

			fnGetParseShellHashAndGetLinks()
				.then(function(aLinks) {
					if (aLinks && aLinks.length > 0) {
						var oTargetParams = {};
						var aAnnotationsSOItems = [];
						var sEntitySetPath = oMetaPath + "@";
						var sEntityTypePath = oMetaPath + "/@";
						var oEntitySetAnnotations = oMetaModel.getObject(sEntitySetPath);
						oSemanticObjectAnnotations = _getSemanticObjectAnnotations(oEntitySetAnnotations, sCurrentSemObj);
						if (!oSemanticObjectAnnotations.bHasEntitySetSO) {
							var oEntityTypeAnnotations = oMetaModel.getObject(sEntityTypePath);
							oSemanticObjectAnnotations = _getSemanticObjectAnnotations(oEntityTypeAnnotations, sCurrentSemObj);
						}
						aExcludedActions = oSemanticObjectAnnotations.aUnavailableActions;
						//Skip same application from Related Apps
						aExcludedActions.push(sCurrentAction);
						oTargetParams.navigationContexts = oBindingContext;
						oTargetParams.semanticObjectMapping = oSemanticObjectAnnotations.aMappings;
						_getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aAnnotationsSOItems);
						aRelatedAppsMenuItems = aAnnotationsSOItems.concat(aManifestSOItems);
						// If no app in list, related apps button will be hidden
						oObjectPageLayout
							.getBindingContext("internal")
							.setProperty("relatedApps/visibility", aRelatedAppsMenuItems.length > 0);
						oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/items", aRelatedAppsMenuItems);
					} else {
						oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/visibility", false);
					}
				})
				.catch(function(oError) {
					Log.error("Cannot read links", oError);
				});
			return aRelatedAppsMenuItems;
		}
		/**
		 * @param {object} oEntityAnnotations - Annotations at the EntitySet/EntityType level
		 * @param sCurrentSemObj
		 * @returns {object} oSemanticObjectAnnotations - Object containing one array of all semantic object mappings and another containing all SO unavailable actions
		 */
		function _getSemanticObjectAnnotations(oEntityAnnotations, sCurrentSemObj) {
			var oSemanticObjectAnnotations = {
				bHasEntitySetSO: false,
				aUnavailableActions: [],
				aMappings: []
			};
			var sAnnotationMappingTerm, sAnnotationActionTerm;
			var sQualifier;
			for (var key in oEntityAnnotations) {
				if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 && oEntityAnnotations[key] === sCurrentSemObj) {
					oSemanticObjectAnnotations.bHasEntitySetSO = true;
					sAnnotationMappingTerm = "@com.sap.vocabularies.Common.v1.SemanticObjectMapping";
					sAnnotationActionTerm = "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";

					if (key.indexOf("#") > -1) {
						sQualifier = key.split("#")[1];
						sAnnotationMappingTerm = sAnnotationMappingTerm + "#" + sQualifier;
						sAnnotationActionTerm = sAnnotationActionTerm + "#" + sQualifier;
					}

					oSemanticObjectAnnotations.aMappings = oSemanticObjectAnnotations.aMappings.concat(
						oEntityAnnotations[sAnnotationMappingTerm]
					);
					oSemanticObjectAnnotations.aUnavailableActions = oSemanticObjectAnnotations.aUnavailableActions.concat(
						oEntityAnnotations[sAnnotationActionTerm]
					);

					break;
				}
			}
			return oSemanticObjectAnnotations;
		}
		function fnUpdateRelatedAppsDetails(oObjectPageLayout) {
			var oMetaModel = oObjectPageLayout.getModel().getMetaModel();
			var oBindingContext = oObjectPageLayout.getBindingContext();
			var oPath = oBindingContext && oBindingContext.getPath();
			var oMetaPath = oMetaModel.getMetaPath(oPath);
			// Semantic Key Vocabulary
			var sSemanticKeyVocabulary = oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticKey";
			//Semantic Keys
			var aSemKeys = oMetaModel.getObject(sSemanticKeyVocabulary);
			// Unavailable Actions
			var oEntry = oBindingContext.getObject();
			if (!oEntry) {
				oBindingContext
					.requestObject()
					.then(function(oEntry) {
						return updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
					})
					.catch(function(oError) {
						Log.error("Cannot update the related app details", oError);
					});
			} else {
				return updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
			}
		}

		/**
		 * Fire Press on a Button.
		 * Test if oButton is an enabled and visible sap.m.Button before triggering a press event.
		 *
		 * @param {sap.m.Button | sap.m.OverflowToolbarButton} oButton a SAP UI5 Button
		 */
		function fnFireButtonPress(oButton) {
			var aAuthorizedTypes = ["sap.m.Button", "sap.m.OverflowToolbarButton"];
			if (
				oButton &&
				aAuthorizedTypes.indexOf(oButton.getMetadata().getName()) !== -1 &&
				oButton.getVisible() &&
				oButton.getEnabled()
			) {
				oButton.firePress();
			}
		}

		function fnResolveStringtoBoolean(sValue) {
			if (sValue === "true" || sValue === true) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Retrieves the main component associated with a given control / view.
		 *
		 * @param {sap.ui.base.ManagedObject} oControl a managed object
		 * @returns {sap.fe.core.AppComponent} the fiori Element AppComponent
		 */
		function getAppComponent(oControl) {
			if (oControl.isA("sap.fe.core.AppComponent")) {
				return oControl;
			}
			var oOwner = Component.getOwnerComponentFor(oControl);
			if (!oOwner) {
				return oControl;
			} else {
				return getAppComponent(oOwner);
			}
		}

		/**
		 * Returns the containing view for the current control.
		 * In case the provided control is a {@link sap.ui.core.ComponentContainer},
		 * the root control of the contained component is used as a starting point,
		 * which might be the returned view itself.
		 *
		 * @param {sap.ui.base.ManagedObject} oControl the control to get the view for
		 * @returns {sap.ui.mvc.View} the view containing the given control
		 */
		function getTargetView(oControl) {
			if (oControl && oControl.isA("sap.ui.core.ComponentContainer")) {
				oControl = oControl.getComponentInstance();
				oControl = oControl && oControl.getRootControl();
			}
			while (oControl && !(oControl instanceof View)) {
				oControl = oControl.getParent();
			}
			return oControl;
		}

		/**
		 * FE MessageBox to confirm in case data loss warning is to be given.
		 *
		 * @param {Function} fnProcess - Task to be performed if user confirms.
		 * @param {sap.ui.core.Control} oControl - Control responsible for the the trigger of the dialog
		 * @param {string} programmingModel - Type of transaction model
		 * @param oController
		 * @returns {object} MessageBox if confirmation is required else the fnProcess function.
		 */
		function fnProcessDataLossConfirmation(fnProcess, oControl, programmingModel, oController) {
			var bUIEditable = oControl.getModel("ui").getProperty("/isEditable"),
				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
				sWarningMsg = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_MSG"),
				sConfirmButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CONFIRM_BUTTON"),
				sCancelButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CANCEL_BUTTON");

			if (programmingModel === ProgrammingModel.Sticky && bUIEditable) {
				return MessageBox.warning(sWarningMsg, {
					actions: [sConfirmButtonTxt, sCancelButtonTxt],
					onClose: function(sAction) {
						if (sAction === sConfirmButtonTxt) {
							var oInternalModel = oControl && oControl.getModel("internal");

							Log.info("Navigation confirmed.");
							if (oInternalModel) {
								oInternalModel.setProperty("/sessionOn", false);
							} else {
								Log.warning("Local UIModel couldn't be found.");
							}
							fnProcess();
						} else {
							Log.info("Navigation rejected.");
						}
					}
				});
			}
			return fnProcess();
		}

		/**
		 * Check if Path based FieldControl Evaluates to inapplicable.
		 *
		 * @param {string} sFieldControlPath - Field control path
		 * @param {object} oAttribute - SemanticAttributes
		 * @returns {boolean} true if inapplicable
		 *
		 */
		function isFieldControlPathInapplicable(sFieldControlPath, oAttribute) {
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
		}

		/**
		 * Removes sensitive data from the semantic attribute with respect to entitySet.
		 *
		 * @param {Array} aAttributes Array of 'semantic Attributes' - context Data
		 * @param {boolean} oMetaModel V4 MetaModel for anntations
		 * @returns {Array} Array of semantic Attributes
		 **/

		function removeSensitiveData(aAttributes, oMetaModel) {
			var aOutAttributes = [];
			for (var i = 0; i < aAttributes.length; i++) {
				var sEntitySet = aAttributes[i].entitySet,
					oAttribute = aAttributes[i].contextData,
					aProperties;

				delete oAttribute["@odata.context"];
				delete oAttribute["@odata.metadataEtag"];
				delete oAttribute["SAP__Messages"];
				aProperties = Object.keys(oAttribute);
				for (var j = 0; j < aProperties.length; j++) {
					var sProp = aProperties[j],
						aPropertyAnnotations = oMetaModel.getObject("/" + sEntitySet + "/" + sProp + "@");
					if (aPropertyAnnotations) {
						if (
							aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
							aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
							aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]
						) {
							delete oAttribute[sProp];
						} else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
							var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
							if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
								delete oAttribute[sProp];
							} else if (
								oFieldControl["$Path"] &&
								CommonUtils.isFieldControlPathInapplicable(oFieldControl["$Path"], oAttribute)
							) {
								delete oAttribute[sProp];
							}
						}
					}
				}
				aOutAttributes.push(oAttribute);
			}

			return aOutAttributes;
		}

		/**
		 * Method to get metadata of entityset properties.
		 *
		 * @param {object} oMetaModel - MetaModel for annotations
		 * @param {string} sEntitySet - EntitySet for properities
		 * @returns {object} the entity set properties
		 */
		function fnGetEntitySetProperties(oMetaModel, sEntitySet) {
			var oEntityType = oMetaModel.getObject("/" + sEntitySet + "/") || {},
				oProperties = {};

			for (var sKey in oEntityType) {
				if (
					oEntityType.hasOwnProperty(sKey) &&
					!/^\$/i.test(sKey) &&
					oEntityType[sKey].$kind &&
					oEntityType[sKey].$kind === "Property"
				) {
					oProperties[sKey] = oEntityType[sKey];
				}
			}
			return oProperties;
		}

		/**
		 * Method to get madatory filterfields.
		 *
		 * @param {object} oMetaModel - MetaModel for annotations
		 * @param {string} sEntitySet - EntitySet for properities
		 * @returns {object[]} the mandatory filter fields
		 */
		function fnGetMandatoryFilterFields(oMetaModel, sEntitySet) {
			var aMandatoryFilterFields;
			if (oMetaModel && sEntitySet) {
				aMandatoryFilterFields = oMetaModel.getObject(
					"/" + sEntitySet + "@Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties"
				);
			}
			return aMandatoryFilterFields;
		}

		/**
		 * Method to get madatory filterfields
		 *
		 * @param {object} oControl - Control containing IBN Actions
		 * @param {Array} aIBNActions - array filled with IBN Actions
		 * @returns {Array} array containing the IBN Actions
		 *
		 */

		function fnGetIBNActions(oControl, aIBNActions) {
			var aActions = oControl && oControl.getActions();
			if (aActions) {
				aActions.forEach(function(oAction) {
					if (oAction.data("IBNData")) {
						aIBNActions.push(oAction);
					}
				});
			}
			return aIBNActions;
		}

		/**
		 * Method to update the IBN Buttons Visibility.
		 *
		 * @param {Array} aIBNActions - array containing all the IBN Actions with requires context false
		 * @param {object} oView - Instance of the view
		 */
		function fnUpdateDataFieldForIBNButtonsVisibility(aIBNActions, oView) {
			var that = this;
			var oParams = {};
			var fnGetLinks = function(oData) {
				if (oData) {
					var aKeys = Object.keys(oData);
					aKeys.map(function(sKey) {
						if (sKey.indexOf("_") !== 0 && sKey.indexOf("odata.context") === -1) {
							oParams[sKey] = { value: oData[sKey] };
						}
					});
				}
				if (aIBNActions.length) {
					aIBNActions.forEach(function(oIBNAction) {
						var sSemanticObject = oIBNAction.data("IBNData").semanticObject;
						var sAction = oIBNAction.data("IBNData").action;
						that.getShellServices(oView)
							.getLinks({
								semanticObject: sSemanticObject,
								action: sAction,
								params: oParams
							})
							.then(function(aLink) {
								oIBNAction.setVisible(aLink && aLink.length === 1);
							})
							.catch(function(oError) {
								Log.error("Cannot retrieve the links from the shell service", oError);
							});
					});
				}
			};
			if (oView && oView.getBindingContext()) {
				oView
					.getBindingContext()
					.requestObject()
					.then(function(oData) {
						return fnGetLinks(oData);
					})
					.catch(function(oError) {
						Log.error("Cannot retrieve the links from the shell service", oError);
					});
			} else {
				fnGetLinks();
			}
		}
		/**
		 * Creates the updated key to check the i18n override and fallbacks to the old value if the new value is not available for the same key.
		 *
		 * @param {string} sFrameworkKey - current key.
		 * @param {object} oResourceBundle - contains the local resource bundle
		 * @param {object} oParams - parameter object for the resource value
		 * @param {object} sEntitySetName - entity set name of the control where the resource is being used
		 * @returns {string} the translated text
		 */
		function getTranslatedText(sFrameworkKey, oResourceBundle, oParams, sEntitySetName) {
			var sResourceKey = sFrameworkKey;
			if (oResourceBundle) {
				if (sEntitySetName) {
					// There are console errors logged when making calls to getText for keys that are not defined in the resource bundle
					// for instance keys which are supposed to be provided by the application, e.g, <key>|<entitySet> to override instance specific text
					// hence check if text exists (using "hasText") in the resource bundle before calling "getText"

					// "hasText" only checks for the key in the immediate resource bundle and not it's custom bundles
					// hence we need to do this recurrsively to check if the key exists in any of the bundles the forms the FE resource bundle
					var bResourceKeyExists = _checkIfResourceKeyExists(
						oResourceBundle.aCustomBundles,
						sFrameworkKey + "|" + sEntitySetName
					);

					// if resource key with entity set name for instance specific text overriding is provided by the application
					// then use the same key otherwise use the Framework key
					sResourceKey = bResourceKeyExists ? sFrameworkKey + "|" + sEntitySetName : sFrameworkKey;
				}
				return oResourceBundle.getText(sResourceKey, oParams);
			}

			// do not allow override so get text from the internal bundle directly
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			return oResourceBundle.getText(sResourceKey, oParams);
		}

		function _checkIfResourceKeyExists(aCustomBundles, sKey) {
			if (aCustomBundles.length) {
				for (var i = aCustomBundles.length - 1; i >= 0; i--) {
					var sValue = aCustomBundles[i].hasText(sKey);
					// text found return true
					if (sValue) {
						return true;
					}
					_checkIfResourceKeyExists(aCustomBundles[i].aCustomBundles, sKey);
				}
			}
			return false;
		}

		/**
		 * Returns the metamodel path correctly for bound actions if used with bReturnOnlyPath as true,
		 * else returns an object which has 3 properties related to the action. They are the entity set name,
		 * the $Path value of the OperationAvailable annotation and the binding parameter name. If
		 * bCheckStaticValue is true, returns the static value of OperationAvailable annotation, if present.
		 * e.g. for bound action someNameSpace.SomeBoundAction
		 * of entity set SomeEntitySet, the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
		 *
		 * @param {oAction} oAction - context object of the action
		 * @param {boolean} bReturnOnlyPath - if false, additional info is returned along with metamodel path to the bound action
		 * @param {string} sActionName - name of the bound action of the form someNameSpace.SomeBoundAction
		 * @param {boolean} bCheckStaticValue - if true, the static value of OperationAvailable is returned, if present
		 * @returns {string|object} - string or object as specified by bReturnOnlyPath
		 * @private
		 * @ui5-restricted
		 */
		function getActionPath(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
			sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;
			var sEntityName = oAction.getPath().split("/@")[0];
			sEntityName = oAction.getObject(sEntityName).$Type;
			sEntityName = getEntitySetName(oAction.getModel(), sEntityName);
			if (bCheckStaticValue) {
				return oAction.getObject("/" + sEntityName + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable");
			}
			if (bReturnOnlyPath) {
				return "/" + sEntityName + "/" + sActionName;
			} else {
				return {
					sEntityName: sEntityName,
					sProperty: oAction.getObject("/" + sEntityName + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable/$Path"),
					sBindingParameter: oAction.getObject("/" + sEntityName + "/" + sActionName + "/@$ui5.overload/0/$Parameter/0/$Name")
				};
			}
		}

		function getEntitySetName(oMetaModel, sEntityType) {
			var oEntityContainer = oMetaModel.getObject("/");
			for (var key in oEntityContainer) {
				if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
					return key;
				}
			}
		}

		function computeDisplayMode(oPropertyAnnotations, oCollectionAnnotations) {
			var oTextAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"],
				oTextArrangementAnnotation =
					oTextAnnotation &&
					((oPropertyAnnotations &&
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]) ||
						(oCollectionAnnotations && oCollectionAnnotations["@com.sap.vocabularies.UI.v1.TextArrangement"]));

			if (oTextArrangementAnnotation) {
				if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
					return "Description";
				} else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
					return "ValueDescription";
				} else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate") {
					return "Value";
				}
				//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
				return "DescriptionValue";
			}
			return oTextAnnotation ? "DescriptionValue" : "Value";
		}

		function setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts) {
			for (var sAction in oActionOperationAvailableMap) {
				oInternalModelContext.setProperty("dynamicActions/" + sAction, {
					bEnabled: false,
					aApplicable: [],
					aNotApplicable: []
				});
				// Note that non dynamic actions are not processed here. They are enabled because
				// one or more are selected and the second part of the condition in the templating
				// is then undefined and thus the button takes the default enabling, which is true!
				var aApplicable = [],
					aNotApplicable = [];
				var sProperty = oActionOperationAvailableMap[sAction];
				for (var i = 0; i < aSelectedContexts.length; i++) {
					var oSelectedContext = aSelectedContexts[i];
					var oContextData = oSelectedContext.getObject();
					if (sProperty === null && !!oContextData["#" + sAction]) {
						//look for action advertisement if present and its value is not null
						oInternalModelContext
							.getModel()
							.setProperty(oInternalModelContext.getPath() + "/dynamicActions/" + sAction + "/bEnabled", true);
						break;
					} else if (oSelectedContext.getObject(sProperty)) {
						oInternalModelContext
							.getModel()
							.setProperty(oInternalModelContext.getPath() + "/dynamicActions/" + sAction + "/bEnabled", true);
						aApplicable.push(oSelectedContext);
					} else {
						aNotApplicable.push(oSelectedContext);
					}
				}
				oInternalModelContext
					.getModel()
					.setProperty(oInternalModelContext.getPath() + "/dynamicActions/" + sAction + "/aApplicable", aApplicable);
				oInternalModelContext
					.getModel()
					.setProperty(oInternalModelContext.getPath() + "/dynamicActions/" + sAction + "/aNotApplicable", aNotApplicable);
			}
		}
		function _getDefaultOperators(oRealProperty) {
			// mdc defines the full set of operations that are meaningful for each Edm Type
			var oDataClass = TypeUtil.getDataTypeClassName(oRealProperty);
			var oBaseType = TypeUtil.getBaseType(oDataClass);
			return FilterOperatorUtil.getOperatorsForType(oBaseType);
		}

		function _getRestrictions(aDefaultOps, aExpressionOps) {
			// From the default set of Operators for the Base Type, select those that are defined in the Allowed Value.
			// In case that no operators are found, return undefined so that the default set is used.
			var aOperators = aDefaultOps.filter(function(sElement) {
				return aExpressionOps.indexOf(sElement) > -1;
			});
			return aOperators.toString() || undefined;
		}

		function getOperatorsForProperty(sProperty, sEntitySetPath, oContext, sType, bUseSemanticDateRange, sSettings) {
			var oFilterRestrictions = oContext.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
			var aEqualsOps = ["EQ"];
			var aSingleRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
			var aMultiRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NE", "NOTBT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
			var aSearchExpressionOps = ["Contains", "NotContains", "StartsWith", "NotStartsWith", "EndsWith", "NotEndsWith"];
			var aSemanticDateOpsExt = SemanticDateOperators.getSupportedOperations();
			var bSemanticDateRange = bUseSemanticDateRange === "true" || bUseSemanticDateRange === true;
			var aSemanticDateOps = [];
			var oSettings = typeof sSettings === "string" ? JSON.parse(sSettings).customData : sSettings;
			if (oSettings && oSettings.operatorConfiguration && oSettings.operatorConfiguration.length > 0) {
				aSemanticDateOps = SemanticDateOperators.getFilterOperations(oSettings.operatorConfiguration);
			} else {
				aSemanticDateOps = SemanticDateOperators.getSemanticDateOperations();
			}

			// Get the default Operators for this Property Type
			var aDefaultOperators = _getDefaultOperators(sType);

			// Is there a Filter Restriction defined for this property?
			if (
				oFilterRestrictions &&
				oFilterRestrictions.FilterExpressionRestrictions &&
				oFilterRestrictions.FilterExpressionRestrictions.some(function(oRestriction) {
					return oRestriction.Property.$PropertyPath === sProperty;
				})
			) {
				// Extending the default operators list with Semantic Date options DATERANGE, DATE, FROM and TO
				if (bSemanticDateRange) {
					aDefaultOperators = aSemanticDateOpsExt.concat(aDefaultOperators);
				}

				var aRestriction = oFilterRestrictions.FilterExpressionRestrictions.filter(function(oRestriction) {
					return oRestriction.Property.$PropertyPath === sProperty;
				});

				// In case more than one Allowed Expressions has been defined for a property
				// choose the most restrictive Allowed Expression

				// MultiValue has same Operator as SingleValue, but there can be more than one (maxConditions)
				if (
					aRestriction.some(function(oRestriction) {
						return oRestriction.AllowedExpressions === "SingleValue" || oRestriction.AllowedExpressions === "MultiValue";
					})
				) {
					return _getRestrictions(aDefaultOperators, aEqualsOps);
				}

				if (
					aRestriction.some(function(oRestriction) {
						return oRestriction.AllowedExpressions === "SingleRange";
					})
				) {
					var sOperators = _getRestrictions(
						aDefaultOperators,
						sType === "Edm.Date" && bSemanticDateRange ? aSemanticDateOps : aSingleRangeOps
					);
					return sOperators ? sOperators : "";
				}

				if (
					aRestriction.some(function(oRestriction) {
						return oRestriction.AllowedExpressions === "MultiRange";
					})
				) {
					return _getRestrictions(aDefaultOperators, aMultiRangeOps);
				}

				if (
					aRestriction.some(function(oRestriction) {
						return oRestriction.AllowedExpressions === "SearchExpression";
					})
				) {
					return _getRestrictions(aDefaultOperators, aSearchExpressionOps);
				}

				if (
					aRestriction.some(function(oRestriction) {
						return oRestriction.AllowedExpressions === "MultiRangeOrSearchExpression";
					})
				) {
					return _getRestrictions(aDefaultOperators, aSearchExpressionOps.concat(aMultiRangeOps));
				}
				// In case AllowedExpressions is not recognised, undefined in return results in the default set of
				// operators for the type.
				return undefined;
			} else if (sType === "Edm.Date") {
				// In case AllowedExpressions is not provided for type Edm.Date then all the default
				// operators for the type should be returned excluding semantic operators from the list.
				aSemanticDateOps = SemanticDateOperators.getSemanticDateOperations();
				var aOperators = aDefaultOperators.filter(function(sElement) {
					return aSemanticDateOps.indexOf(sElement) < 0;
				});
				return aOperators.toString();
			}
		}

		/**
		 * Method to convert selection variant to conditions.
		 * @param {object} oSelectionVariant - SelectionVariant to be converted.
		 * @param {object} oConditions - oConditions object to be extended.
		 * @param {object} oMetaModel - Odata V4 metamodel.
		 * @param {string} sEntitySet - EntitySet for the SV properties.
		 * @returns {object} - condition.
		 */
		function addSelectionVariantToConditions(oSelectionVariant, oConditions, oMetaModel, sEntitySet) {
			var aSelectOptionsPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames(),
				oValidProperties = CommonUtils.getEntitySetProperties(oMetaModel, sEntitySet),
				aParameterNames = oSelectionVariant.getParameterNames();

			// Remove all parameter names without 'P_' in them

			aParameterNames.forEach(function(sParameterName) {
				//check only those parameterNames starting from 'P_'
				if (sParameterName.substring(0, 2) === "P_") {
					var sOrigParamName = sParameterName;
					sParameterName = sParameterName.slice(2, sParameterName.length);
					//check if SO already has sParameterName, if so, then ignore sParameterName.
					if (aSelectOptionsPropertyNames.indexOf(sParameterName) == -1) {
						if (sParameterName in oValidProperties) {
							var sParameter = oSelectionVariant.getParameter(sOrigParamName),
								oValue = FilterHelper.getTypeCompliantValue(sParameter, oValidProperties[sParameterName].$Type),
								oCondition;
							if (oValue !== undefined || oValue !== null) {
								oCondition = {
									isEmpty: null,
									operator: "EQ",
									values: [oValue]
								};
								oConditions[sParameterName] = oConditions.hasOwnProperty(sParameterName)
									? oConditions[sParameterName].concat([oCondition])
									: [oCondition];
							}
						}
					}
				}
			});

			// Looping through all the propeties within selectOptions.
			aSelectOptionsPropertyNames.forEach(function(sPropertyName) {
				var sOrigPropertyName = sPropertyName;
				//check if propertyname starts with 'P_' or not, if it does, replace P_propertyName with propertyName
				if (sPropertyName.substring(0, 2) === "P_") {
					//Check if a matching propertyName is also present, if so ignore this value.
					sPropertyName = sPropertyName.slice(2, sPropertyName.length);
					if (aSelectOptionsPropertyNames.indexOf(sPropertyName) > -1) {
						sPropertyName = "";
					}
				}

				if (sPropertyName in oValidProperties) {
					var aConditions = [],
						aSelectOptions,
						aValidOperators;

					if (CommonUtils.isPropertyFilterable(oMetaModel, "/" + sEntitySet, sPropertyName, true)) {
						aSelectOptions = oSelectionVariant.getSelectOption(
							sOrigPropertyName == sPropertyName ? sPropertyName : sOrigPropertyName
						);
						aValidOperators = CommonUtils.getOperatorsForProperty(sPropertyName, "/" + sEntitySet, oMetaModel);

						// Create conditions for all the selectOptions of the property
						aConditions = aSelectOptions.reduce(function(aCumulativeConditions, oSelectOption) {
							var oCondition = FilterHelper.getConditions(oSelectOption, oValidProperties[sPropertyName]);
							if (oCondition) {
								if (!aValidOperators || aValidOperators.indexOf(oCondition.operator) > -1) {
									aCumulativeConditions.push(oCondition);
								}
							}
							return aCumulativeConditions;
						}, aConditions);
						if (aConditions.length) {
							oConditions[sPropertyName] = oConditions.hasOwnProperty(sPropertyName)
								? oConditions[sPropertyName].concat(aConditions)
								: aConditions;
						}
					}
				}
			});

			return oConditions;
		}

		/**
		 * Method to add condtions of page context to SelectionVariant.
		 * @param {object} oSelectionVariant Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant to be used.
		 * @param {Array} mPageContext Conditons to be added to the SelectionVariant
		 * @param oView
		 * @returns {object} Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant with the conditions.
		 * @private
		 * @ui5-restricted
		 * @example <code>
		 * </code>
		 */
		function addPageContextToSelectionVariant(oSelectionVariant, mPageContext, oView) {
			var oAppComponent = CommonUtils.getAppComponent(oView);
			var oNavigationService = oAppComponent.getNavigationService();
			return oNavigationService.mixAttributesAndSelectionVariant(mPageContext, oSelectionVariant.toJSONString());
		}

		/**
		 * Method to add condtions to SelectionVariant.
		 * @param {object} oSelectionVariant Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant to be used.
		 * @param {object} mFilters Conditons to be added to the SelectionVariant
		 * @returns {object} Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant with the conditions.
		 * @private
		 * @ui5-restricted
		 * @example <code>
		 * </code>
		 */
		function addExternalStateFiltersToSelectionVariant(oSelectionVariant, mFilters) {
			var sFilter,
				sLow = "",
				sHigh = null;
			var fnGetSignAndOption = function(sOperator, sLowValue, sHighValue) {
				var oSelectOptionState = {
					option: "",
					sign: "I",
					low: sLowValue,
					high: sHighValue
				};
				switch (sOperator) {
					case "Contains":
						oSelectOptionState.option = "CP";
						break;
					case "StartsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low += "*";
						break;
					case "EndsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low = "*" + oSelectOptionState.low;
						break;
					case "BT":
					case "LE":
					case "LT":
					case "GT":
					case "NE":
					case "EQ":
						oSelectOptionState.option = sOperator;
						break;
					case "EEQ":
						oSelectOptionState.option = "EQ";
						break;
					case "Empty":
						oSelectOptionState.option = "EQ";
						oSelectOptionState.low = "";
						break;
					case "NotContains":
						oSelectOptionState.option = "CP";
						oSelectOptionState.sign = "E";
						break;
					case "NOTBT":
						oSelectOptionState.option = "BT";
						oSelectOptionState.sign = "E";
						break;
					case "NotStartsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low += "*";
						oSelectOptionState.sign = "E";
						break;
					case "NotEndsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low = "*" + oSelectOptionState.low;
						oSelectOptionState.sign = "E";
						break;
					case "NotEmpty":
						oSelectOptionState.option = "NE";
						oSelectOptionState.low = "";
						break;
					case "NOTLE":
						oSelectOptionState.option = "LE";
						oSelectOptionState.sign = "E";
						break;
					case "NOTGE":
						oSelectOptionState.option = "GE";
						oSelectOptionState.sign = "E";
						break;
					case "NOTLT":
						oSelectOptionState.option = "LT";
						oSelectOptionState.sign = "E";
						break;
					case "NOTGT":
						oSelectOptionState.option = "GT";
						oSelectOptionState.sign = "E";
						break;
					default:
						Log.warning(sOperator + " is not supported. " + sFilter + " could not be added to the navigation context");
				}
				return oSelectOptionState;
			};
			mFilters = mFilters.filter || mFilters;
			for (var sFilter in mFilters) {
				// only add the filter values if it is not already present in the SV already
				if (!oSelectionVariant.getSelectOption(sFilter)) {
					// TODO : custom filters should be ignored more generically
					if (sFilter === "$editState") {
						continue;
					}
					var aFilters = mFilters[sFilter];
					for (var item in aFilters) {
						var oFilter = aFilters[item];
						sLow = (oFilter.values[0] && oFilter.values[0].toString()) || "";
						sHigh = (oFilter.values[1] && oFilter.values[1].toString()) || null;
						var oSelectOptionValues = fnGetSignAndOption(oFilter.operator, sLow, sHigh);
						if (oSelectOptionValues.option) {
							oSelectionVariant.addSelectOption(
								sFilter,
								oSelectOptionValues.sign,
								oSelectOptionValues.option,
								oSelectOptionValues.low,
								oSelectOptionValues.high
							);
						}
					}
				}
			}
			return oSelectionVariant;
		}

		/**
		 * Returns true if Application is in sticky edit mode.
		 *
		 * @param {object} oControl
		 * @returns {boolean} if we are in sticky mode
		 */
		function isStickyEditMode(oControl) {
			var bIsStickyMode = ModelHelper.isStickySessionSupported(oControl.getModel().getMetaModel());
			var bUIEditable = oControl.getModel("ui").getProperty("/isEditable");
			return bIsStickyMode && bUIEditable;
		}

		/**
		 * Method to add display currency to selection variant.
		 * @param {Array} aMandatoryFilterFields - mandatory filterfields of entitySet.
		 * @param {object} oSelectionVariant - the selection variant
		 * @param {object} oSelectionVariantDefaults - the defaulted selection variant
		 */
		function addDefaultDisplayCurrency(aMandatoryFilterFields, oSelectionVariant, oSelectionVariantDefaults) {
			if (oSelectionVariant && aMandatoryFilterFields && aMandatoryFilterFields.length) {
				for (var i = 0; i < aMandatoryFilterFields.length; i++) {
					var aSVOption = oSelectionVariant.getSelectOption("DisplayCurrency"),
						aDefaultSVOption = oSelectionVariantDefaults && oSelectionVariantDefaults.getSelectOption("DisplayCurrency");
					if (
						aMandatoryFilterFields[i].$PropertyPath === "DisplayCurrency" &&
						(!aSVOption || !aSVOption.length) &&
						aDefaultSVOption &&
						aDefaultSVOption.length
					) {
						var displayCurrencySelectOption = aDefaultSVOption[0];
						var sSign = displayCurrencySelectOption["Sign"];
						var sOption = displayCurrencySelectOption["Option"];
						var sLow = displayCurrencySelectOption["Low"];
						var sHigh = displayCurrencySelectOption["High"];
						oSelectionVariant.addSelectOption("DisplayCurrency", sSign, sOption, sLow, sHigh);
					}
				}
			}
		}

		/**
		 * Returns an array of visible, non-computed key and immutable properties.
		 *
		 * @param {object} oMetaModel
		 * @param sPath
		 * @returns {Array} aNonComputedVisibleFields
		 */
		function getNonComputedVisibleFields(oMetaModel, sPath) {
			var aTechnicalKeys = oMetaModel.getObject(sPath + "/").$Key;
			var aNonComputedVisibleFields = [];
			var oEntityType = oMetaModel.getObject(sPath + "/");
			for (var item in oEntityType) {
				if (oEntityType[item].$kind && oEntityType[item].$kind === "Property") {
					var oAnnotations = oMetaModel.getObject(sPath + "/" + item + "@") || {},
						bIsKey = aTechnicalKeys.indexOf(item) > -1,
						bIsImmutable = bIsKey || oAnnotations["@Org.OData.Core.V1.Immutable"],
						bIsNonComputed = !oAnnotations["@Org.OData.Core.V1.Computed"],
						bIsVisible = !oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];
					if (bIsImmutable && bIsNonComputed && bIsVisible) {
						aNonComputedVisibleFields.push(item);
					}
				}
			}
			return aNonComputedVisibleFields;
		}

		/**
		 * Sets the FLP user defaults.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.setUserDefaults
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oAppComponent] app's onwer component
		 * @param {Array} [aParameters]  parameters in the dialog
		 * @param {object} [oModel] model to which the default value has to be set
		 * @param {boolean} [bIsAction] true if aParameters contains action parameters
		 * @returns {Promise}
		 * @ui5-restricted
		 * @final
		 **/
		function setUserDefaults(oAppComponent, aParameters, oModel, bIsAction) {
			return new Promise(function(resolve, reject) {
				var oComponentData = oAppComponent.getComponentData(),
					oStartupParameters = (oComponentData && oComponentData.startupParameters) || {},
					oShellServices = oAppComponent.getShellServices();

				if (!oShellServices.hasUShell()) {
					aParameters.map(function(oParameter) {
						var sPropertyName = bIsAction
							? "/" + oParameter.$Name
							: oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
						var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;
						if (oStartupParameters[sParameterName]) {
							oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
						}
					});
					return resolve(true);
				}
				return oShellServices.getStartupAppState(oAppComponent).then(function(oStartupAppState) {
					var oData = oStartupAppState.getData() || {},
						aExtendedParameters = (oData.selectionVariant && oData.selectionVariant.SelectOptions) || [];
					aParameters.map(function(oParameter) {
						var sPropertyName = bIsAction
							? "/" + oParameter.$Name
							: oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
						var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;
						if (oStartupParameters[sParameterName]) {
							oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
						} else if (aExtendedParameters.length > 0) {
							for (var i in aExtendedParameters) {
								var oExtendedParameter = aExtendedParameters[i];
								if (oExtendedParameter.PropertyName === sParameterName) {
									var oRange = oExtendedParameter.Ranges.length ? oExtendedParameter.Ranges[0] : undefined;
									if (oRange && oRange.Sign === "I" && oRange.Option === "EQ") {
										oModel.setProperty(sPropertyName, oRange.Low); // high is ignored when Option=EQ
									}
								}
							}
						}
					});
					return resolve(true);
				});
			});
		}
		/**
		 * Gets semantic object mappings defined in app descriptor outbounds.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getSemanticObjectMapping
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oOutbound] outbound defined in app descriptor
		 * @returns {Array} [aSemanticObjectMapping] a collection of semantic object mappings defined for one outbound
		 * @ui5-restricted
		 * @final
		 **/
		function getSemanticObjectMapping(oOutbound) {
			var aSemanticObjectMapping = [];
			if (oOutbound.parameters) {
				var aParameters = Object.keys(oOutbound.parameters) || [];
				if (aParameters.length > 0) {
					aParameters.forEach(function(sParam) {
						var oMapping = oOutbound.parameters[sParam];
						if (oMapping.value && oMapping.value.value && oMapping.value.format === "binding") {
							// using the format of UI.Mapping
							var oSemanticMapping = {
								"LocalProperty": {
									"$PropertyPath": oMapping.value.value
								},
								"SemanticObjectProperty": sParam
							};

							if (aSemanticObjectMapping.length > 0) {
								// To check if the semanticObject Mapping is done for the same local property more that once then first one will be considered
								for (var i = 0; i < aSemanticObjectMapping.length; i++) {
									if (
										aSemanticObjectMapping[i]["LocalProperty"]["$PropertyPath"] !==
										oSemanticMapping["LocalProperty"]["$PropertyPath"]
									) {
										aSemanticObjectMapping.push(oSemanticMapping);
									}
								}
							} else {
								aSemanticObjectMapping.push(oSemanticMapping);
							}
						}
					});
				}
			}
			return aSemanticObjectMapping;
		}

		/**
		 * Returns the datapoints/ microcharts for which target outbound is configured.
		 *
		 * @param {object} oViewData view data as given in app descriptor
		 * @param {object} oCrossNav the target outbound in cross navigation in manifest
		 * @returns {object} oHeaderFacetItems datapoints/microcharts with outbound defined
		 */
		function getHeaderFacetItemConfigForExternalNavigation(oViewData, oCrossNav) {
			var aSemanticObjectMapping = [];
			var oHeaderFacetItems = {};
			var sId;
			var oControlConfig = oViewData.controlConfiguration;
			for (var config in oControlConfig) {
				if (
					config.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 ||
					config.indexOf("@com.sap.vocabularies.UI.v1.Chart") > -1
				) {
					if (
						oControlConfig[config].navigation &&
						oControlConfig[config].navigation.targetOutbound &&
						oControlConfig[config].navigation.targetOutbound.outbound
					) {
						var sOutbound = oControlConfig[config].navigation.targetOutbound.outbound;
						var oOutbound = oCrossNav[sOutbound];
						if (oOutbound.semanticObject && oOutbound.action) {
							if (config.indexOf("Chart") > -1) {
								sId = StableIdHelper.generate(["fe", "MicroChartLink", config]);
							} else {
								sId = StableIdHelper.generate(["fe", "HeaderDPLink", config]);
							}
							var aSemanticObjectMapping = CommonUtils.getSemanticObjectMapping(oOutbound);
							oHeaderFacetItems[sId] = {
								semanticObject: oOutbound.semanticObject,
								action: oOutbound.action,
								semanticObjectMapping: aSemanticObjectMapping
							};
						} else {
							Log.error("Cross navigation outbound is configured without semantic object and action for " + sOutbound);
						}
					}
				}
			}
			return oHeaderFacetItems;
		}

		/**
		 * Method to replace Local Properties with Semantic Object mappings.
		 *
		 * @param {object} oSelectionVariant - SelectionVariant consisting of filterbar, Table and Page Context
		 * @param {object} vMappings - stringified version of semantic object mappinghs
		 * @returns {object} - Modified SelectionVariant with LocalProperty replaced with SemanticObjectProperties.
		 */
		function setSemanticObjectMappings(oSelectionVariant, vMappings) {
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
		}

		/**
		 * Method to retrieve Semantic Object annotations from meta model.
		 *
		 * @param {oMetaModel} oMetaModel - The Meta Model.
		 * @param {sPath} sPath - Property path.
		 * @returns {object} - Object containing name of Semantic Object.
		 */
		function fnGetSemanticObjectsFromPath(oMetaModel, sPath) {
			var sSemanticObject = oMetaModel.getObject(sPath + "@com.sap.vocabularies.Common.v1.SemanticObject");
			var aSemanticObjectUnavailableActions = oMetaModel.getObject(
				sPath + "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"
			);
			var aSemanticObjectForGetLinks;
			var oSemanticObject;
			if (!(sSemanticObject === undefined)) {
				aSemanticObjectForGetLinks = [{ semanticObject: sSemanticObject }];
				oSemanticObject = {
					semanticObject: sSemanticObject
				};
			}
			return {
				semanticObjectForGetLinks: aSemanticObjectForGetLinks,
				semanticObject: oSemanticObject,
				unavailableActions: aSemanticObjectUnavailableActions
			};
		}

		/**
		 * Method to retrieve Semantic Object targets from page model and set the internal model.
		 *
		 * @param oController
		 * @param {string} sPageModel - Name of the page model
		 */
		function fnGetSemanticTargetsFromPageModel(oController, sPageModel) {
			var _fnfindValues = function(obj, key) {
				return _fnfindValuesHelper(obj, key, []);
			};
			var _fnfindValuesHelper = function(obj, key, list) {
				if (!obj) {
					return list;
				}
				if (obj instanceof Array) {
					for (var i in obj) {
						list = list.concat(_fnfindValuesHelper(obj[i], key, []));
					}
					return list;
				}
				if (obj[key]) {
					list.push(obj[key]);
				}

				if (typeof obj == "object" && obj !== null) {
					var children = Object.keys(obj);
					if (children.length > 0) {
						for (i = 0; i < children.length; i++) {
							list = list.concat(_fnfindValuesHelper(obj[children[i]], key, []));
						}
					}
				}
				return list;
			};
			var _fnDeleteDuplicateSemanticObjects = function(aSemanticObjectPath) {
				return aSemanticObjectPath.filter(function(value, index) {
					return aSemanticObjectPath.indexOf(value) === index;
				});
			};
			var _fnGetTargetEntitySetBasedPath = function(oMetaModel, sPath) {
				var sNavigationPath = sPath.substring(0, sPath.lastIndexOf("/"));
				if (sNavigationPath.lastIndexOf("/") === 0) {
					return sPath;
				} else {
					// Navigation property found.
					var sPropertyName = sPath.substring(sPath.lastIndexOf("/") + 1),
						oContext = oMetaModel.getContext(sNavigationPath),
						sEntitySetName = ModelHelper.getTargetEntitySet(oContext);
					return sEntitySetName + "/" + sPropertyName;
				}
			};

			var oView = oController.getView();
			var oInternalModelContext = oView.getBindingContext("internal");

			if (oInternalModelContext) {
				var oComponent = oController.getOwnerComponent();
				var oAppComponent = sap.ui.core.Component.getOwnerComponentFor(oComponent);
				var oMetaModel = oAppComponent.getMetaModel();
				var oPageModel = oComponent.getModel(sPageModel).getData();

				if (JSON.stringify(oPageModel) === "{}") {
					oPageModel = oComponent.getModel(sPageModel)._getObject("/", undefined);
				}

				var aSemanticObjectsFound = _fnfindValues(oPageModel, "semanticObjectPath");
				aSemanticObjectsFound = _fnDeleteDuplicateSemanticObjects(aSemanticObjectsFound);
				var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);
				var sCurrentHash = oShellServiceHelper.hrefForExternal();
				var aSemanticObjectsForGetLinks = [];
				var aSemanticObjects = [];
				var aFinalLinks = [];
				var sPath;
				var _oSemanticObject;

				if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
					// sCurrentHash can contain query string, cut it off!
					sCurrentHash = sCurrentHash.split("?")[0];
				}

				for (var i = 0; i < aSemanticObjectsFound.length; i++) {
					sPath = aSemanticObjectsFound[i];
					_oSemanticObject = CommonUtils.getSemanticObjectsFromPath(oMetaModel, sPath);
					if (_oSemanticObject.semanticObject) {
						aSemanticObjectsForGetLinks.push(_oSemanticObject.semanticObjectForGetLinks);
						aSemanticObjects.push({
							semanticObject: _oSemanticObject.semanticObject.semanticObject,
							unavailableActions: _oSemanticObject.unavailableActions,
							path: _fnGetTargetEntitySetBasedPath(oMetaModel, sPath)
						});
					}
				}

				oShellServiceHelper
					.getLinksWithCache(aSemanticObjectsForGetLinks)
					.then(function(aLinks) {
						if (aLinks && aLinks.length > 0 && aLinks[0] !== undefined) {
							var oSemanticObject = {};
							var oTmp = {};
							var sAlternatePath;
							var fnRemoveCurrentHashInLink = function(oLinkItem) {
								if (!(sCurrentHash === oLinkItem.intent)) {
									if (
										aSemanticObjects[i].unavailableActions &&
										aSemanticObjects[i].unavailableActions.find(function(sAction) {
											if (sAction === oLinkItem.intent.split("-")[1]) {
												return true;
											}
										})
									) {
										return false;
									} else {
										aFinalLinks[i].push(oLinkItem);
									}
								}
							};
							for (var i = 0; i < aLinks.length; i++) {
								aFinalLinks.push([]);
								aLinks[i][0].forEach(fnRemoveCurrentHashInLink);
								oTmp = {
									semanticObject: aSemanticObjects[i].semanticObject,
									HasTargets: aFinalLinks[i].length > 0 ? true : false,
									HasTargetsNotFiltered: aLinks[i][0].length > 0 ? true : false
								};
								if (oSemanticObject[aSemanticObjects[i].semanticObject] === undefined) {
									oSemanticObject[aSemanticObjects[i].semanticObject] = {};
								}
								sAlternatePath = aSemanticObjects[i].path.replace(/\//g, "_");
								if (oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] === undefined) {
									oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] = {};
								}
								oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] = Object.assign(
									oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath],
									oTmp
								);
							}
							oInternalModelContext.setProperty("semanticsTargets", oSemanticObject);
						}
					})
					.catch(function(oError) {
						Log.error("fnGetSemanticTargets: Cannot read links", oError);
					});
			}
		}

		var CommonUtils = {
			isPropertyFilterable: isPropertyFilterable,
			isFieldControlPathInapplicable: isFieldControlPathInapplicable,
			removeSensitiveData: removeSensitiveData,
			fireButtonPress: fnFireButtonPress,
			getTargetView: getTargetView,
			hasTransientContext: fnHasTransientContexts,
			updateRelatedAppsDetails: fnUpdateRelatedAppsDetails,
			resolveStringtoBoolean: fnResolveStringtoBoolean,
			getAppComponent: getAppComponent,
			processDataLossConfirmation: fnProcessDataLossConfirmation,
			getMandatoryFilterFields: fnGetMandatoryFilterFields,
			getEntitySetProperties: fnGetEntitySetProperties,
			updateDataFieldForIBNButtonsVisibility: fnUpdateDataFieldForIBNButtonsVisibility,
			getTranslatedText: getTranslatedText,
			getEntitySetName: getEntitySetName,
			getActionPath: getActionPath,
			computeDisplayMode: computeDisplayMode,
			setActionEnablement: setActionEnablement,
			isStickyEditMode: isStickyEditMode,
			getOperatorsForProperty: getOperatorsForProperty,
			addSelectionVariantToConditions: addSelectionVariantToConditions,
			addExternalStateFiltersToSelectionVariant: addExternalStateFiltersToSelectionVariant,
			addPageContextToSelectionVariant: addPageContextToSelectionVariant,
			addDefaultDisplayCurrency: addDefaultDisplayCurrency,
			getNonComputedVisibleFields: getNonComputedVisibleFields,
			setUserDefaults: setUserDefaults,
			getShellServices: getShellServices,
			getIBNActions: fnGetIBNActions,
			getHeaderFacetItemConfigForExternalNavigation: getHeaderFacetItemConfigForExternalNavigation,
			getSemanticObjectMapping: getSemanticObjectMapping,
			setSemanticObjectMappings: setSemanticObjectMappings,
			getSemanticTargetsFromPageModel: fnGetSemanticTargetsFromPageModel,
			getSemanticObjectsFromPath: fnGetSemanticObjectsFromPath,
			getPropertyDataType: getPropertyDataType,
			getNavigationRestrictions: getNavigationRestrictions
		};

		return CommonUtils;
	}
);
