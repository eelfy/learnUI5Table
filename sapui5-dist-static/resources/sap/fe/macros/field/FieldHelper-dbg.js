/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/ui/base/ManagedObject",
		"sap/base/Log",
		"sap/base/strings/formatMessage",
		"sap/ui/model/json/JSONModel",
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/library",
		"sap/fe/macros/internal/valuehelp/ValueListHelper",
		"sap/fe/core/templating/UIFormatters"
	],
	function(
		ResourceModel,
		CommonHelper,
		CommonUtils,
		TypeUtil,
		AnnotationHelper,
		ManagedObject,
		Log,
		formatMessage,
		JSONModel,
		FilterOperatorUtil,
		StableIdHelper,
		MacrosLibrary,
		ValueListHelper,
		UIFormatters
	) {
		"use strict";
		var ISOCurrency = "@Org.OData.Measures.V1.ISOCurrency",
			Unit = "@Org.OData.Measures.V1.Unit";

		/**
		 * What does the map look like?
		 *    {
		 *  	'namespace.of.entityType' : [
		 * 			[namespace.of.entityType1#Qualifier,namespace.of.entityType2#Qualifier], --> Search For: mappingSourceEntities
		 * 			{
		 * 				'property' : [namespace.of.entityType3#Qualifier,namespace.of.entityType4#Qualifier] --> Search For: mappingSourceProperties
		 * 			}
		 * 	}.
		 *
		 * @param {object} oInterface Interface instance
		 * @returns {Promise} Promise resolved when the map is ready and provides the map
		 */
		function _generateSideEffectsMap(oInterface) {
			var oMetaModel = oInterface.getModel(),
				oFieldSettings = oInterface.getSetting("sap.fe.macros.internal.Field"),
				oSideEffects = oFieldSettings.sideEffects;

			// Generate map once
			if (oSideEffects) {
				return Promise.resolve(oSideEffects);
			}

			oSideEffects = {};
			return oMetaModel.requestObject("/$").then(function(oEverything) {
				var // just get the entity types
					fnFilterEntityTypes = function(sKey) {
						return oEverything[sKey]["$kind"] === "EntityType";
					},
					// map each side effect
					fnMapSideEffect = function(sEntityType, sSideEffectAnnotation, oSideEffectAnnotation) {
						var sQualifier =
								(sSideEffectAnnotation.indexOf("#") > -1 &&
									sSideEffectAnnotation.substr(sSideEffectAnnotation.indexOf("#"))) ||
								"",
							aSourceProperties = oSideEffectAnnotation.SourceProperties || [],
							aSourceEntities = oSideEffectAnnotation.SourceEntities || [],
							// for each source property, source entity, there could be a oMetaModel.requestObject(...) to get the target entity type of the navigation involved
							aPromises = [];
						aSourceProperties.forEach(function(oSourceProperty) {
							var sPath = oSourceProperty["$PropertyPath"],
								// if the property path has a navigation, get the target entity type of the navigation
								sNavigationPath =
									sPath.indexOf("/") > 0
										? "/" + sEntityType + "/" + sPath.substr(0, sPath.lastIndexOf("/") + 1) + "@sapui.name"
										: false,
								pOwnerEntity = !sNavigationPath ? Promise.resolve(sEntityType) : oMetaModel.requestObject(sNavigationPath);

							sPath = sNavigationPath ? sPath.substr(sPath.lastIndexOf("/") + 1) : sPath;

							aPromises.push(
								pOwnerEntity.then(function(sOwnerEntityType) {
									oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}];
									oSideEffects[sOwnerEntityType][1][sPath] = oSideEffects[sOwnerEntityType][1][sPath] || [];
									// if there is only one source property, side effect request is required immediately
									oSideEffects[sOwnerEntityType][1][sPath].push(
										sEntityType + sQualifier + ((aSourceProperties.length === 1 && "$$ImmediateRequest") || "")
									); // --> mappingSourceProperties
								})
							);
						});
						aSourceEntities.forEach(function(oSourceEntity) {
							var sNavigationPath = oSourceEntity["$NavigationPropertyPath"],
								pOwnerEntity;
							// Source entities will have an empty path, meaning same as the target entity type of the side effect annotation
							// or will always have navigation, get target entity for this navigation path
							if (sNavigationPath === "") {
								pOwnerEntity = Promise.resolve(sEntityType);
							} else {
								pOwnerEntity = oMetaModel.requestObject("/" + sEntityType + "/" + sNavigationPath + "/@sapui.name");
							}
							aPromises.push(
								pOwnerEntity.then(function(sOwnerEntityType) {
									oSideEffects[sOwnerEntityType] = oSideEffects[sOwnerEntityType] || [[], {}];
									// side effects for fields referenced via source entities must always be requested immediately
									oSideEffects[sOwnerEntityType][0].push(sEntityType + sQualifier + "$$ImmediateRequest"); // --> mappingSourceEntities
								})
							);
						});
						// returned promise is resolved when all the source properties and source entities of the side effect have been mapped
						return Promise.all(aPromises);
					},
					// map each entity type which has side effects annotated
					fnMapEntityType = function(sEntityType) {
						return oMetaModel.requestObject("/" + sEntityType + "@").then(function(oAnnotations) {
							var aSideEffects = Object.keys(oAnnotations)
								.filter(function(sAnnotation) {
									return sAnnotation.indexOf("@com.sap.vocabularies.Common.v1.SideEffects") > -1;
								})
								.map(function(sSideEffectAnnotation) {
									return fnMapSideEffect(sEntityType, sSideEffectAnnotation, oAnnotations[sSideEffectAnnotation]);
								});
							// returned promise is resolved when all the side effects annotated on this entity type have been mapped
							return Promise.all(aSideEffects);
						});
					};
				// get everything --> filter the entity types which have side effects annotated --> map each side effect --> then return the map
				// returned promise is resolved when the map is ready
				return Promise.all(
					Object.keys(oEverything)
						.filter(fnFilterEntityTypes)
						.map(fnMapEntityType)
				).then(function() {
					oFieldSettings.sideEffects = oSideEffects;
					return oSideEffects;
				});
			});
		}
		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var FieldHelper = {
			/**
			 * Determine how to show the value by analyzing Text and TextArrangement Annotations.
			 *
			 * @function
			 * @name sap.fe.macros.field.FieldHelper#displayMode
			 * @memberof sap.fe.macros.field.FieldHelper
			 * @static
			 * @param {object} oPropertyAnnotations property type annotations
			 * @param {object} oCollectionAnnotations entity type annotations
			 * @returns {string} display mode of the field
			 * @private
			 * @ui5-restricted
			 **/
			displayMode: function(oPropertyAnnotations, oCollectionAnnotations) {
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
					}
					//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
					return "DescriptionValue";
				}
				return oTextAnnotation ? "DescriptionValue" : "Value";
			},
			//FilterField
			isRequiredInFilter: function(path, oDetails) {
				var sEntitySetPath,
					sProperty,
					bIsRequired = false,
					oFilterRestrictions,
					oModel = oDetails.context.getModel(),
					sPropertyPath = oDetails.context.getPath();

				sEntitySetPath = CommonHelper.getEntitySetForPropertyPath(oModel, sPropertyPath);
				if (typeof path === "string") {
					sProperty = path;
				} else {
					sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
				}
				oFilterRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
				if (oFilterRestrictions && oFilterRestrictions.RequiredProperties) {
					bIsRequired = oFilterRestrictions.RequiredProperties.some(function(property) {
						return property.$PropertyPath === sProperty;
					});
				}
				return bIsRequired;
			},
			maxConditions: function(path, oDetails) {
				var sEntitySetPath,
					sProperty,
					oFilterRestrictions,
					maxConditions = -1,
					oModel = oDetails.context.getModel(),
					sPropertyPath = oDetails.context.getPath();

				sEntitySetPath = CommonHelper.getEntitySetForPropertyPath(oModel, sPropertyPath);
				if (typeof path === "string") {
					sProperty = path;
				} else {
					sProperty = oModel.getObject(sPropertyPath + "@sapui.name");
				}
				oFilterRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
				var oProperty = oModel.getObject(sEntitySetPath + "/" + sProperty);
				if (!oProperty) {
					oProperty = oModel.getObject(sPropertyPath);
				}
				if (oProperty.$Type === "Edm.Boolean") {
					maxConditions = 1;
				} else if (
					oFilterRestrictions &&
					oFilterRestrictions.FilterExpressionRestrictions &&
					oFilterRestrictions.FilterExpressionRestrictions.some(function(property) {
						return (
							property.Property.$PropertyPath === sProperty &&
							(property.AllowedExpressions === "SingleValue" || property.AllowedExpressions === "SingleRange")
						);
					})
				) {
					maxConditions = 1;
				}
				return maxConditions;
			},
			getDecimalFormat: function(sResult, property, sValueFormat) {
				var iPrecisionValueIndex = sResult.search("'precision':") + "'precision':".length;
				var sIntegerFraction = sResult.substr(iPrecisionValueIndex, sResult.search(",'scale':") - iPrecisionValueIndex);
				var iDecimalFraction = sValueFormat[sValueFormat.length - 1];
				return (
					"{path:'" +
					property.$Path +
					"',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':" +
					sIntegerFraction +
					",'scale':" +
					iDecimalFraction +
					"}}"
				);
			},
			getValueFormatted: function(iContext, property, oFormatOptions) {
				if (!property.$Path) {
					return property;
				}
				var iContextInterface = iContext.getInterface(0);
				var oModel = iContextInterface.getModel();
				var sPath = iContextInterface.getPath();
				var oContext = oModel.createBindingContext(sPath);
				if (oFormatOptions && oFormatOptions.valueFormat) {
					// Check if a ValueFormat annotation exists
					var sValueFormat = oFormatOptions.valueFormat;
					if (sValueFormat.substr(0, 7) === "Decimal") {
						var formatDecimal = AnnotationHelper.format(
							{ $Path: property.$Path },
							{
								arguments: [],
								context: oContext
							}
						);
						// for the listReport, the decimal fields are formatted by returning a string
						// for the facets of the OP, the decimal fields are formatted by returning a promise, so we manage all the cases
						if (typeof formatDecimal === "string") {
							return FieldHelper.getDecimalFormat(formatDecimal, property, sValueFormat);
						} else {
							return formatDecimal.then(function(result) {
								return FieldHelper.getDecimalFormat(result, property, sValueFormat);
							});
						}
					}
					var result = AnnotationHelper.format(
						{ $Path: property.$Path },
						{ arguments: [null, { style: sValueFormat }], context: oContext }
					);
					return result;
				} else {
					return AnnotationHelper.format({ $Path: property.$Path }, { arguments: [], context: oContext });
				}
			},
			buildExpressionForCriticalityIcon: function(sCriticalityProperty) {
				if (sCriticalityProperty) {
					var sExpression =
						"{= (${" +
						sCriticalityProperty +
						"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${" +
						sCriticalityProperty +
						"} === '1') || (${" +
						sCriticalityProperty +
						"} === 1) ? 'sap-icon://message-error' : " +
						"(${" +
						sCriticalityProperty +
						"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${" +
						sCriticalityProperty +
						"} === '2') || (${" +
						sCriticalityProperty +
						"} === 2) ? 'sap-icon://message-warning' : " +
						"(${" +
						sCriticalityProperty +
						"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${" +
						sCriticalityProperty +
						"} === '3') || (${" +
						sCriticalityProperty +
						"} === 3) ? 'sap-icon://message-success' : " +
						"(${" +
						sCriticalityProperty +
						"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || (${" +
						sCriticalityProperty +
						"} === '5') || (${" +
						sCriticalityProperty +
						"} === 5) ? 'sap-icon://message-information' : " +
						"'' }";

					return sExpression;
				}
				return undefined;
			},
			buildExpressionForCriticalityColor: function(oDataPoint) {
				var sFormatCriticalityExpression = sap.ui.core.ValueState.None;
				var sExpressionTemplate;
				var oCriticalityProperty = oDataPoint.Criticality;

				if (oCriticalityProperty) {
					sExpressionTemplate =
						"'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''" +
						sap.ui.core.ValueState.Error +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Critical'') || ({0} === ''2'') || ({0} === 2) ? ''" +
						sap.ui.core.ValueState.Warning +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''" +
						sap.ui.core.ValueState.Success +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Information'') || ({0} === ''5'') || ({0} === 5) ? ''" +
						sap.ui.core.IndicationColor.Indication05 +
						"'' : " +
						"''" +
						sap.ui.core.ValueState.None +
						"'' '}'";
					if (oCriticalityProperty.$Path) {
						var sCriticalitySimplePath = "${" + oCriticalityProperty.$Path + "}";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticalitySimplePath);
					} else if (oCriticalityProperty.$EnumMember) {
						var sCriticality = "'" + oCriticalityProperty.$EnumMember + "'";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticality);
					} else {
						Log.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
					}
				} else {
					// Any other cases are not valid, the default value of 'None' will be returned
					Log.warning("Case not supported, returning the default sap.ui.core.ValueState.None");
				}

				return sFormatCriticalityExpression;
			},
			buildExpressionForTextValue: function(sPropertyPath, oDataField) {
				var oMetaModel = oDataField.context.getModel(),
					sPath = oDataField.context.getPath(),
					oTextAnnotationContext = oMetaModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.Text"),
					oTextAnnotation = oTextAnnotationContext.getProperty(),
					sTextExpression = oTextAnnotation
						? AnnotationHelper.value(oTextAnnotation, { context: oTextAnnotationContext })
						: undefined,
					sExpression = "",
					sPropertyPath = AnnotationHelper.getNavigationPath(sPropertyPath);
				if (sPropertyPath.indexOf("/") > -1 && sTextExpression) {
					sExpression = sPropertyPath.replace(/[^\/]*$/, sTextExpression.substr(1, sTextExpression.length - 2));
				} else {
					sExpression = sTextExpression;
				}
				if (sExpression) {
					sExpression =
						"{ path : '" + sExpression.replace(/^\{+/g, "").replace(/\}+$/g, "") + "', parameters: {'$$noPatch': true}}";
				}
				return sExpression;
			},
			/**
			 * Format the field value in case its a DataPoint and may have additional annotation for formatting.
			 *
			 * @param iContext {object}  -   context for the FieldHelper
			 * @param oProperty {object}  -  property we want to format
			 * @param sValueFormat {string}  -  macroField format option
			 * @param oDataPoint {object}  - the DataPoint
			 * @param sPropertyType {string} - the oData property type
			 * @returns {string} - a bindingExpression
			 */
			formatDataPointField: function(iContext, oProperty, sValueFormat, oDataPoint, sPropertyType) {
				if (sPropertyType === "Edm.Decimal" && oDataPoint.ValueFormat) {
					if (oDataPoint.ValueFormat.NumberOfFractionalDigits) {
						sValueFormat = "Decimal:" + oDataPoint.ValueFormat.NumberOfFractionalDigits;
					}
				}
				return FieldHelper.getValueFormatted(iContext, oProperty, sValueFormat);
			},
			hasSemanticObjectTargets: function(
				sSemanticObject,
				aSemanticObjectUnavailableActions,
				oProperty,
				oPropertyDataModelObjectPath
			) {
				var sPropertyFQN = oProperty.$target.fullyQualifiedName;
				var sEntitySet = oPropertyDataModelObjectPath.targetEntitySet
					? oPropertyDataModelObjectPath.targetEntitySet.name
					: oPropertyDataModelObjectPath.startEntitySet.name;
				var sPropertyPath = sPropertyFQN.replace(
					oPropertyDataModelObjectPath.targetEntityType.fullyQualifiedName,
					"/" + sEntitySet
				);
				if (sPropertyPath && sSemanticObject && sSemanticObject.length > 0) {
					var sAlternatePath = sPropertyPath.replace(/\//g, "_"); //replaceAll("/","_");
					var sBindingPath =
						"pageInternal>semanticsTargets/" +
						sSemanticObject +
						"/" +
						sAlternatePath +
						(!aSemanticObjectUnavailableActions ? "/HasTargetsNotFiltered" : "/HasTargets");
					return "{parts:[{path:'" + sBindingPath + "'}], formatter:'FieldRuntime.hasTargets'}";
				} else {
					return false;
				}
			},
			buildFieldBindingExpression: function(
				iContext,
				oProperty,
				oPropertyAnnotations,
				sDescriptionExpression,
				oFormatOptions,
				oDataPoint,
				sPropertyType
			) {
				var sValueFormat;
				if (oFormatOptions && oFormatOptions.valueFormat) {
					sValueFormat = oFormatOptions.valueFormat;
				}
				// Since sValueFormat is undefined, this supports the decimal ValueFormat annotation
				if (sPropertyType === "Edm.Decimal" && oDataPoint.ValueFormat) {
					if (oDataPoint.ValueFormat.NumberOfFractionalDigits) {
						sValueFormat = "Decimal:" + oDataPoint.ValueFormat.NumberOfFractionalDigits;
					}
				}
				return Promise.resolve(FieldHelper.getValueFormatted(iContext, oProperty, { valueFormat: sValueFormat })).then(function(
					sValueExpression
				) {
					var sDisplayMode = oFormatOptions.displayMode;
					var sExpression;
					switch (sDisplayMode) {
						case "Description":
							sExpression = sDescriptionExpression;
							break;
						case "ValueDescription":
							sExpression =
								"{ parts:[" +
								sValueExpression +
								", " +
								sDescriptionExpression +
								"], formatter:'FieldRuntime.formatWithBrackets'}";
							break;
						case "DescriptionValue":
							sExpression =
								"{ parts:[" +
								sDescriptionExpression +
								", " +
								sValueExpression +
								"], formatter:'FieldRuntime.formatWithBrackets'}";
							break;
						default:
							var sValue = oPropertyAnnotations["@Org.OData.Measures.V1.Unit"];
							if (sValue === "%") {
								sExpression = "{ parts:[" + sValueExpression + "], formatter:'FieldRuntime.formatWithPercentage'}";
							} else {
								sExpression = sValueExpression;
							}
					}
					return sExpression;
				});
			},
			_buildExpressionForTextProperty: function(sPropertyPath, oInterface) {
				var oMetaModel = oInterface.context.getModel(),
					sPath = oInterface.context.getPath(), // "/RootEntity/_Navigation1/_Navigation2/Property"
					aPaths = sPath.split("/"),
					oTextAnnotationContext = oMetaModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.Text"),
					oTextAnnotation = oTextAnnotationContext.getProperty(),
					sTextExpression = oTextAnnotation
						? AnnotationHelper.value(oTextAnnotation, { context: oTextAnnotationContext })
						: undefined,
					sExpression = "";

				if (sTextExpression) {
					sExpression = sTextExpression;
					sTextExpression = sTextExpression.substr(1, sTextExpression.length - 2);
					if (aPaths.length > 2) {
						aPaths.shift(); // remove ""
						aPaths.shift(); // remove "RootEntity"
						aPaths.pop(); // remove "Property"
						sExpression = "{" + (aPaths.length > 0 ? aPaths.join("/") + "/" : "") + sTextExpression + "}";
					}
				}

				if (sExpression) {
					sExpression = "{ path : '" + sExpression.substr(1, sExpression.length - 2) + "', parameters: {'$$noPatch': true}}";
				}

				return sExpression;
			},
			isNotAlwaysHidden: function(oDataField, oDetails) {
				var oContext = oDetails.context,
					isAlwaysHidden = false;
				if (oDataField.Value && oDataField.Value.$Path) {
					isAlwaysHidden = oContext.getObject("Value/$Path@com.sap.vocabularies.UI.v1.Hidden");
				}
				if (!isAlwaysHidden || isAlwaysHidden.$Path) {
					isAlwaysHidden = oContext.getObject("@com.sap.vocabularies.UI.v1.Hidden");
					if (!isAlwaysHidden || isAlwaysHidden.$Path) {
						isAlwaysHidden = false;
					}
				}
				return !isAlwaysHidden;
			},
			isSemanticKey: function(aSemanticKeys, oValue) {
				return (
					(oValue &&
						aSemanticKeys &&
						!aSemanticKeys.every(function(oKey) {
							return oKey["$PropertyPath"] !== oValue["$Path"] && oKey["$PropertyPath"] !== oValue;
						})) ||
					false
				);
			},
			isLineItem: function(oProperty, oInterface) {
				if (oInterface.context.getPath().indexOf("@com.sap.vocabularies.UI.v1.LineItem") > -1) {
					return true;
				}
				return false;
			},
			getRequiredForDataField: function(oFieldControl, sEditMode) {
				var sEditExpression;
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					return false;
				}
				//sEditMode returns Binding in few cases hence resolving the binding
				if (oFieldControl && sEditMode) {
					// If the editMode we received was not a static value we only want to check
					// compared to the page editMode and not to the actually mode for the field (so not including fieldcontrol and the likes)
					if (sEditMode.startsWith("{")) {
						sEditMode = "{ui>/editMode}";
					}
					if (sEditMode.indexOf("{") > -1) {
						sEditExpression = "%" + sEditMode + " === 'Editable'";
					}
					if (oFieldControl.indexOf("{") > -1) {
						var sExpression = "%" + oFieldControl + " === 7";
						return sEditMode === "Editable" ? "{=" + sExpression + "}" : "{= " + sExpression + " && " + sEditExpression + "}";
					} else {
						return sEditMode === "Editable"
							? oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
							: oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory" && "{= " + sEditExpression + "}";
					}
				}
				return false;
			},
			isRequired: function(oFieldControl, sEditMode) {
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					return false;
				}
				if (oFieldControl) {
					if (ManagedObject.bindingParser(oFieldControl)) {
						var sExpression = "{= %" + oFieldControl + " === 7}";
						return sExpression;
					} else {
						return oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory";
					}
				}
				return false;
			},

			_getDraftAdministrativeDataType: function(oMetaModel, sEntityType) {
				return oMetaModel.requestObject("/" + sEntityType + "/DraftAdministrativeData/");
			},

			getBindingForDraftAdminBlockInline: function(iContext, sEntityType) {
				return FieldHelper._getDraftAdministrativeDataType(iContext.getModel(), sEntityType).then(function(oDADEntityType) {
					var aBindings = [];

					if (oDADEntityType.InProcessByUserDescription) {
						aBindings.push("${DraftAdministrativeData/InProcessByUserDescription}");
					}

					aBindings.push("${DraftAdministrativeData/InProcessByUser}");

					if (oDADEntityType.LastChangedByUserDescription) {
						aBindings.push("${DraftAdministrativeData/LastChangedByUserDescription}");
					}

					aBindings.push("${DraftAdministrativeData/LastChangedByUser}");

					return "{= %{HasDraftEntity} ? (" + aBindings.join(" || ") + ") : '' }";
				});
			},

			/**
			 * Computed annotation that returns vProperty for a string and @sapui.name for an object.
			 *
			 * @param {*} vProperty The property
			 * @param {object} oInterface The interface instance
			 * @returns {string} The property name
			 */
			propertyName: function(vProperty, oInterface) {
				var sPropertyName;
				if (typeof vProperty === "string") {
					if (oInterface.context.getPath().indexOf("$Path") > -1 || oInterface.context.getPath().indexOf("$PropertyPath") > -1) {
						// We could end up with a pure string property (no $Path), and this is not a real property in that case
						sPropertyName = vProperty;
					}
				} else if (vProperty.$Path || vProperty.$PropertyPath) {
					var sPath = vProperty.$Path ? "/$Path" : "/$PropertyPath";
					var sContextPath = oInterface.context.getPath();
					sPropertyName = oInterface.context.getObject(sContextPath + sPath + "/$@sapui.name");
				} else {
					sPropertyName = oInterface.context.getObject("@sapui.name");
				}

				return sPropertyName;
			},

			/**
			 * To Create binding for mdc:filterfield conditions.
			 *
			 * @param {object} iContext interface with context to the path to be considered for binding
			 * @param {object | string} vProperty the property to create the condition binding for
			 * @param {object} oEntityType entityType
			 * @returns {string} Expression binding for conditions for the field
			 */
			getConditionsBinding: function(iContext, vProperty, oEntityType) {
				var oPropertyInterface = iContext.getInterface(0),
					oMetaModel = oPropertyInterface.getModel(),
					sFullPropertyPath = oPropertyInterface.getPath(),
					sConditionPath = "",
					sEntityTypePath,
					aPropertyPathParts,
					i;

				if (oEntityType && oEntityType["$kind"] === "EntityType") {
					sEntityTypePath = iContext.getInterface(1).getPath();
					var sPropertyPath = sFullPropertyPath.replace(sEntityTypePath, "");
					aPropertyPathParts = sPropertyPath.split("/");
				} else {
					aPropertyPathParts = sFullPropertyPath.substring(1).split("/");
					sEntityTypePath = "/" + aPropertyPathParts.shift() + "/";
				}

				for (i = 0; i < aPropertyPathParts.length; ++i) {
					vProperty = oMetaModel.getProperty(sEntityTypePath + aPropertyPathParts.slice(0, i + 1).join("/"));
					if (vProperty.$kind === "NavigationProperty" && vProperty.$isCollection) {
						sConditionPath += aPropertyPathParts[i] + "*/";
					} else if (typeof vProperty !== "string") {
						sConditionPath += aPropertyPathParts[i] + "/";
					}
				}
				// remove the last slash from the conditionPath
				return "{$filters>/conditions/" + sConditionPath.substring(0, sConditionPath.length - 1) + "}";
			},
			_context: function(oProperty, oInterface) {
				return oInterface;
			},
			constraints: function(oProperty, oInterface) {
				var sValue = AnnotationHelper.format(oProperty, oInterface),
					aMatches = sValue && sValue.match(/constraints:.*?({.*?})/),
					sConstraints = aMatches && aMatches[1];
				// Workaround. Add "V4: true" to DateTimeOffset constraints. AnnotationHelper is not aware of this flag.
				if (sValue.indexOf("sap.ui.model.odata.type.DateTimeOffset") > -1) {
					if (sConstraints) {
						sConstraints = sConstraints.substr(0, aMatches[1].indexOf("}")) + ", V4: true}";
					} else {
						sConstraints = "{V4: true}";
					}
				}
				return sConstraints || undefined;
			},
			formatOptions: function(oProperty, oInterface) {
				var sValue = AnnotationHelper.format(oProperty, oInterface),
					aMatches = sValue && sValue.match(/formatOptions:.*?({.*?})/);
				return (aMatches && aMatches[1]) || undefined;
			},
			/**
			 * This method getFieldGroupIDs uses a map stored in preprocessing data for the macro Field
			 * _generateSideEffectsMap generates this map once during templating for the first macro field
			 * and then resuses it. Map is only during templating.
			 * The map is used to set the field group ids to the macro field.
			 * A field group id has the format -- namespace.of.entityType#Qualifier
			 * where 'namespace.of.entityType' is the target entity type of the side effect annotation
			 * and 'Qualifier' is the qualififer of the side effect annotation.
			 * This information is enough to identify the side effect annotation.
			 *
			 * @param {object} oContext Context instance
			 * @param {string} sPropertyPath Property path
			 * @param {object} oEntityType Entity type
			 * @returns {Promise<number>|undefined} a promise for string with comma separated field group ids
			 */
			getFieldGroupIds: function(oContext, sPropertyPath, oEntityType) {
				if (!sPropertyPath) {
					return undefined;
				}
				var oInterface = oContext.getInterface(0);
				// generate the mapping for side effects or get the generated map if it is already generated
				return _generateSideEffectsMap(oInterface).then(function(oSideEffects) {
					var oMetaModel = oInterface.getModel(),
						sPath = sPropertyPath,
						// if the property path has a navigation, get the target entity type of the navigation
						sEntityType = oContext.getPath(1).substr(1),
						sNavigationPath =
							sPath.indexOf("/") > 0
								? "/" + sEntityType + "/" + sPath.substr(0, sPath.lastIndexOf("/") + 1) + "@sapui.name"
								: false,
						pOwnerEntity = !sNavigationPath ? Promise.resolve(sEntityType) : oMetaModel.requestObject(sNavigationPath),
						aFieldGroupIds,
						sFieldGroupIds;

					sPath = sNavigationPath ? sPath.substr(sPath.lastIndexOf("/") + 1) : sPath;

					return pOwnerEntity.then(function(sOwnerEntityType) {
						// add to fieldGroupIds, all side effects which mention sPath as source property or sOwnerEntityType as source entity
						aFieldGroupIds =
							(oSideEffects[sOwnerEntityType] &&
								oSideEffects[sOwnerEntityType][0].concat(oSideEffects[sOwnerEntityType][1][sPath] || [])) ||
							[];
						if (aFieldGroupIds.length) {
							sFieldGroupIds = aFieldGroupIds.reduce(function(sResult, sId) {
								return (sResult && sResult + "," + sId) || sId;
							});
						}
						// if (sFieldGroupIds) {
						// 	Log.info('FieldGroupIds--' + sPropertyPath + ': ' + sFieldGroupIds);
						// }
						return sFieldGroupIds; //"ID1,ID2,ID3..."
					});
				});
			},
			fieldControl: function(sPropertyPath, oInterface) {
				var oModel = oInterface && oInterface.context.getModel();
				var sPath = oInterface && oInterface.context.getPath();
				var oFieldControlContext = oModel && oModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.FieldControl");
				var oFieldControl = oFieldControlContext && oFieldControlContext.getProperty();
				if (oFieldControl) {
					if (oFieldControl.hasOwnProperty("$EnumMember")) {
						return oFieldControl.$EnumMember;
					} else if (oFieldControl.hasOwnProperty("$Path")) {
						return AnnotationHelper.value(oFieldControl, { context: oFieldControlContext });
					}
				} else {
					return undefined;
				}
			},
			/**
			 * Method to get the navigation entity(the entity where should i look for the available quick view facets)
			 *    -Loop over all navigation property
			 *    -Look into ReferentialConstraint constraint
			 *    -If ReferentialConstraint.Property = property(Semantic Object) ==> success QuickView Facets from this entity type can be retrieved
			 * @function
			 * @name getNavigationEntity
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oProperty - property object on which semantic object is configured
			 * @param {object} oContext - Metadata Context(Not passed when called with template:with)
			 * @returns {string|undefined} - if called with context then navigation entity relative binding like "{supplier}" is returned
			 *    else context path for navigation entity for templating is returned  e.g “/Products/$Type/supplier”
			 *  where Products - Parent entity, supplier - Navigation entity name
			 */

			getNavigationEntity: function(oProperty, oContext) {
				var oContextObject = (oContext && oContext.context) || oProperty,
					//Get the entity type path ex. /Products/$Type from /Products/$Type@com.sap.vocabularies.UI.v1.HeaderInfo/Description/Value...
					sNavigationPath = AnnotationHelper.getNavigationPath(oContextObject.getPath()) + "/",
					sPropertyPath = oContextObject.getObject().$Path,
					sNavigationPart = "",
					sPropertyName = sPropertyPath.split("/").pop();

				if (sPropertyPath.indexOf("/") > -1) {
					// Navigation property detected.
					sNavigationPart = sPropertyPath.substring(0, sPropertyPath.lastIndexOf("/")) + "/";
					sNavigationPath += sNavigationPart;
				}

				//Get the entity set object
				var oEntitySet = oContextObject.getObject(sNavigationPath),
					//Get the navigation entity details
					aKeys = Object.keys(oEntitySet),
					length = aKeys.length,
					index = 0;

				for (; index < length; index++) {
					if (
						oEntitySet[aKeys[index]].$kind === "NavigationProperty" &&
						oEntitySet[aKeys[index]].$ReferentialConstraint &&
						oEntitySet[aKeys[index]].$ReferentialConstraint.hasOwnProperty(sPropertyName)
					) {
						return oContext
							? AnnotationHelper.getNavigationBinding(sNavigationPart + aKeys[index])
							: sNavigationPath + aKeys[index];
					}
				}
			},

			/**
			 * Method to find the navigation path for the property
			 * @function
			 * @name getNavigationPath
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oInterface - Interface instance
			 * @param {string} sEntitySetName - Entity Set Name
			 * @param {object} oProperty - property object
			 * @returns {string} - navigation path i.e. association for the property
			 */

			getNavigationPath: function(oInterface, sEntitySet, oProperty) {
				var oContext = oInterface.getModel(1).createBindingContext(oInterface.getPath(1));
				var sPropertyName = oContext.getObject("@sapui.name");
				var sPropertyPath = oInterface.getPath(1);
				var aPath = sPropertyPath.split("/");
				var index = aPath.indexOf(sEntitySet);
				aPath.splice(index, 1); // remove entity set from path
				index = aPath.indexOf(sPropertyName);
				aPath.splice(index, 1); // remove property from the path
				var filteredPath = aPath.filter(function(path) {
					// remove empty strings from array
					return path !== "";
				});
				var sAssociation = filteredPath.join("/"); //joining the path back after removing entity set and property
				return "{" + sAssociation + "}";
			},

			/**
			 * Method to get the valuehelp property from a DataField or a PropertyPath(in case of SeclectionField)
			 * Priority form where to get the field property value(example: "Name" or "Supplier"):
			 * 1. If oPropertyContext.getObject() has key '$Path', then we take the value at '$Path'.
			 * 2. Else, value at oPropertyContext.getObject().
			 * In case, there exists ISOCurrency or Unit annotations for the field property, then Path at the ISOCurrency
			 * or Unit annotations of the field property is considered.
			 *
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oPropertyContext - context from which valuehelp property need to be extracted.
			 * @param {boolean} bInFilterField - whether or not we're in the filter field and should ignore
			 * @returns {string}
			 */
			valueHelpProperty: function(oPropertyContext, bInFilterField) {
				/* For currency (and later Unit) we need to forward the value help to the annotated field */
				var sContextPath = oPropertyContext.getPath(),
					oContent = oPropertyContext.getObject() || {},
					sPath = oContent.$Path ? sContextPath + "/$Path" : sContextPath,
					sAnnoPath = sPath + "@",
					oPropertyAnnotations = oPropertyContext.getObject(sAnnoPath),
					sAnnotation;
				if (oPropertyAnnotations) {
					sAnnotation =
						(oPropertyAnnotations.hasOwnProperty(ISOCurrency) && ISOCurrency) ||
						(oPropertyAnnotations.hasOwnProperty(Unit) && Unit);
					if (sAnnotation && !bInFilterField) {
						sPath = sPath + sAnnotation + "/$Path";
					}
				}
				return sPath;
			},

			/**
			 * Dedicated method to avoid looking for unit properties.
			 *
			 * @param oPropertyContext
			 * @returns {string}
			 */
			valueHelpPropertyForFilterField: function(oPropertyContext) {
				return FieldHelper.valueHelpProperty(oPropertyContext, true);
			},

			/**
			 * Method to generate the ID for Value Help.
			 *
			 * @function
			 * @name getIDForFieldValueHelp
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sFlexId Flex ID of the current object
			 * @param {string} sIdPrefix Prefix for the ValueHelp ID
			 * @param {string} sOriginalPropertyName Name of the property
			 * @param {string} sPropertyName Name of the ValueHelp Property
			 * @returns {string} returns the Id generated for the ValueHelp
			 */
			getIDForFieldValueHelp: function(sFlexId, sIdPrefix, sOriginalPropertyName, sPropertyName) {
				if (sFlexId) {
					return sFlexId;
				}
				var sProperty = sPropertyName;
				if (sOriginalPropertyName !== sPropertyName) {
					sProperty = sOriginalPropertyName + "::" + sPropertyName;
				}
				return StableIdHelper.generate([sIdPrefix, sProperty]);
			},

			/**
			 * Method to test if the property annotations are of Value Help.
			 *
			 * @function
			 * @name isValueHelp
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {object} oPropertyAnnotations property type annotations
			 * @returns {object} returns the information of the value help property annotations if present
			 */
			isValueHelp: function(oPropertyAnnotations) {
				if (oPropertyAnnotations) {
					return (
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.ValueList"]
					);
				}
			},
			/**
			 * Method to get the fieldHelp property of the Filter Field.
			 *
			 * @function
			 * @name getFieldHelpPropertyForFilterField
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sPropertyType $Type of the property
			 * @param {string} sVhIdPrefix ID Prefix of the value help
			 * @param {string} sPropertyName Property Name
			 * @param {string} sValueHelpPropertyName Value help property name
			 * @param {boolean} bHasValueListWithFixedValues if there is a value list with fixed value annotation
			 * @returns {string} returns the field help property of Value Help
			 */
			getFieldHelpPropertyForFilterField: function(
				sPropertyType,
				sVhIdPrefix,
				sPropertyName,
				sValueHelpPropertyName,
				bHasValueListWithFixedValues
			) {
				if (sPropertyType === "Edm.Boolean" && !bHasValueListWithFixedValues) {
					return undefined;
				}
				return FieldHelper.getIDForFieldValueHelp(
					null,
					sVhIdPrefix || "FilterFieldValueHelp",
					sPropertyName,
					sValueHelpPropertyName
				);
			},
			/**
			 * Method to get semantic key title
			 * @function
			 * @name getSemanticKeyTitle
			 * @memberof sap.fe.macros.field.FieldHelper.js
			 * @param {string} sPropertyTextValue - string containing the binding of text associated to property
			 * @param {string} sPropertyValue - string containing binding of property
			 * @param {string} sDataField - string containing name of datafield
			 * @param {object} oTextArrangement - object containing text arrangement
			 * @param {string} sSemanticKeyStyle - enum containing Style of the Semantic Key
			 * @param {object} oDraftRoot - draft root
			 * @returns {string} - binding that resolves to title of the semantic key
			 */

			getSemanticKeyTitle: function(sPropertyTextValue, sPropertyValue, sDataField, oTextArrangement, sSemanticKeyStyle, oDraftRoot) {
				var sNewObject = ResourceModel.getText("M_FIELD_HELPER_NEW_OBJECT");
				var sUnnamedObject = ResourceModel.getText("M_FIELD_HELPER_UNNAMED_OBJECT");
				var sNewObjectExpression, sUnnnamedObjectExpression;
				var sSemanticKeyTitleExpression;
				var addNewObjectUnNamedObjectExpression = function(sValue) {
					sNewObjectExpression =
						"($" +
						sValue +
						" === '' || $" +
						sValue +
						" === undefined || $" +
						sValue +
						" === null ? '" +
						sNewObject +
						"': $" +
						sValue +
						")";
					sUnnnamedObjectExpression =
						"($" +
						sValue +
						" === '' || $" +
						sValue +
						" === undefined || $" +
						sValue +
						" === null ? '" +
						sUnnamedObject +
						"': $" +
						sValue +
						")";
					return (
						"(!%{IsActiveEntity} ? !%{HasActiveEntity} ? " +
						sNewObjectExpression +
						" : " +
						sUnnnamedObjectExpression +
						" : " +
						sUnnnamedObjectExpression +
						")"
					);
				};
				var buildExpressionForSemantickKeyTitle = function(sValue, bIsExpressionBinding) {
					var sExpression;
					if (oDraftRoot) {
						//check if it is draft root so that we can add NewObject and UnnamedObject feature
						sExpression = addNewObjectUnNamedObjectExpression(sValue);
						return bIsExpressionBinding ? "{= " + sExpression + "}" : sExpression;
					} else {
						return bIsExpressionBinding ? sValue : "$" + sValue;
					}
				};

				if (sPropertyTextValue) {
					// check for text association
					if (oTextArrangement && sSemanticKeyStyle !== "ObjectIdentifier") {
						// check if text arrangement is present and table type is GridTable
						var sTextArrangement = oTextArrangement.$EnumMember;
						if (sTextArrangement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst") {
							// Eg: English (EN)
							sSemanticKeyTitleExpression = buildExpressionForSemantickKeyTitle(sPropertyTextValue, false);
							return (
								"{= " +
								sSemanticKeyTitleExpression +
								" +' (' + " +
								"($" +
								sPropertyValue +
								(sDataField ? " || ${" + sDataField + "}" : "") +
								") +')' }"
							);
						} else if (sTextArrangement === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
							// Eg: EN (English)
							sSemanticKeyTitleExpression = buildExpressionForSemantickKeyTitle(sPropertyTextValue, false);
							return (
								"{= ($" +
								sPropertyValue +
								(sDataField ? " || ${" + sDataField + "}" : "") +
								")" +
								" + ' (' + " +
								sSemanticKeyTitleExpression +
								" +')' }"
							);
						} else {
							// for a Grid table when text is available and text arrangement is TextOnly or TextSeperate or no text arrangement then we return Text
							return buildExpressionForSemantickKeyTitle(sPropertyTextValue, true);
						}
					} else {
						return buildExpressionForSemantickKeyTitle(sPropertyTextValue, true);
					}
				} else {
					// if there is no text association then we return the property value
					return buildExpressionForSemantickKeyTitle(sPropertyValue, true);
				}
			},

			getObjectIdentifierText: function(oTextAnnotation, oTextArrangementAnnotation, sPropertyValueBinding, sDataFieldName) {
				if (oTextAnnotation) {
					// There is a text annotation. In this case, the ObjectIdentifier shows:
					//  - the *text* as the ObjectIdentifier's title
					//  - the *value* as the ObjectIdentifier's text
					//
					// So if the TextArrangement is #TextOnly or #TextSeparate, do not set the ObjectIdentifier's text
					// property
					if (
						oTextArrangementAnnotation &&
						(oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" ||
							oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate")
					) {
						return undefined;
					} else {
						return sPropertyValueBinding || "{" + sDataFieldName + "}";
					}
				}

				// no text annotation: the property value is part of the ObjectIdentifier's title already
				return undefined;
			},

			/**
			 * Method to calculate the perceentage value of Progress Indicator. Basic formula is Value/Target * 100.
			 *
			 * @param {*} sValue - Datapoint's value
			 * @param {*} sTarget - DataPoint's Target
			 * @param {*} mUoM  - Datapoint's Unit of Measure
			 * @returns {Binding} Expression binding that will calculate the percent value to be shown in progress indicator. Formula given above.
			 */
			buildExpressionForProgressIndicatorPercentValue: function(sValue, sTarget, mUoM) {
				var sPercentValueExpression = "0";
				var sExpressionTemplate;
				sValue = sValue.charAt(0) === "{" ? "$" + sValue : sValue;
				sTarget = sTarget && sTarget.charAt(0) === "{" ? "$" + sTarget : sTarget;
				// The expression consists of the following parts:
				// 1) When UoM is '%' then percent = value (target is ignored), and check for boundaries (value > 100 and value < 0).
				// 2) When UoM is not '%' (or is not provided) then percent = value / target * 100, check for division by zero and boundaries:
				// percent > 100 (value > target) and percent < 0 (value < 0)
				// Where 0 is Value, 1 is Target, 2 is UoM
				var sExpressionForUoMPercent = "(({0} > 100) ? 100 : (({0} < 0) ? 0 : ({0} * 1)))";
				var sExpressionForUoMNotPercent = "(({1} > 0) ? (({0} > {1}) ? 100 : (({0} < 0) ? 0 : ({0} / {1} * 100))) : 0)";
				if (mUoM) {
					mUoM = "'" + mUoM + "'";
					sExpressionTemplate =
						"'{'= ({2} === ''%'') ? " + sExpressionForUoMPercent + " : " + sExpressionForUoMNotPercent + " '}'";
					sPercentValueExpression = formatMessage(sExpressionTemplate, [sValue, sTarget, mUoM]);
				} else {
					sExpressionTemplate = "'{'= " + sExpressionForUoMNotPercent + " '}'";
					sPercentValueExpression = formatMessage(sExpressionTemplate, [sValue, sTarget]);
				}
				return sPercentValueExpression;
			},

			/**
			 * Method to formulate the display value of Progress Indicator.
			 * @param {*} sValue - Datapoint's value
			 * @param {*} sTarget - DataPoint's Target
			 * @param {*} sUoM  - Datapoint's Unit of Measure
			 * @returns {string} Display value of Progress Indicator
			 */
			buildExpressionForProgressIndicatorDisplayValue: function(sValue, sTarget, sUoM) {
				//Commenting the below line as we aren't supporting the UX requirement as of now.
				//sValue = sap.fe.macros.field.FieldHelper.getProgressIndicatorValue(sValue);
				var sDisplayValue = "";

				if (sValue) {
					if (sUoM) {
						if (sUoM === "%") {
							// uom.String && uom.String === '%'
							sDisplayValue = sValue + " %";
						} else if (sTarget) {
							sDisplayValue =
								ResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [sValue, sTarget]) + " " + sUoM;
						} else {
							sDisplayValue = sValue + " " + sUoM;
						}
					} else if (sTarget) {
						sDisplayValue = ResourceModel.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [sValue, sTarget]);
					} else {
						sDisplayValue = sValue;
					}
				} else {
					// Cannot do anything
					Log.warning("Value property is mandatory, the default (empty string) will be returned");
				}

				return sDisplayValue;
			},

			/**
			 * Method to set the edit mode of the field in valuehelp.
			 *
			 * @function
			 * @name getFieldEditModeInValueHelp
			 * @param {object} oValueList - valuelist
			 * @param {string} sProperty - property name
			 * @returns {string} - Returns the edit mode of the field
			 */
			getFieldEditModeInValueHelp: function(oValueList, sProperty) {
				var aParameters = (oValueList && oValueList.Parameters) || [],
					sEditMode = "Editable",
					oParameter;
				if (aParameters.length) {
					for (var i in aParameters) {
						oParameter = aParameters[i];
						if (oParameter.ValueListProperty === sProperty) {
							if (oParameter.$Type.indexOf("Out") > 48) {
								return "Editable";
							} else if (oParameter.$Type.indexOf("In") > 48) {
								sEditMode = "ReadOnly";
							}
						}
					}
				}
				return sEditMode;
			},
			joinArray: function(aStringArray) {
				return aStringArray.join(",");
			},
			getSemanticObjectsList: function(propertyAnnotations) {
				// look for annotations SemanticObject with and without qualifier
				// returns : list of SemanticObjects
				var annotations = propertyAnnotations;
				var aSemanticObjects = [];
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 &&
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") === -1 &&
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") === -1
					) {
						var semanticObjectValue = annotations.getObject()[key];
						if (aSemanticObjects.indexOf(semanticObjectValue) === -1) {
							aSemanticObjects.push(semanticObjectValue);
						}
					}
				}
				var oSemanticObjectsModel = new JSONModel(aSemanticObjects);
				oSemanticObjectsModel.$$valueAsPromise = true;
				return oSemanticObjectsModel.createBindingContext("/");
			},
			getSemanticObjectsQualifiers: function(propertyAnnotations) {
				// look for annotations SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping
				// returns : list of qualifiers (array of objects with qualifiers : {qualifier, SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping for this qualifier}
				var annotations = propertyAnnotations;
				var qualifiersAnnotations = [];
				var findObject = function(qualifier) {
					return qualifiersAnnotations.find(function(object) {
						return object.qualifier === qualifier;
					});
				};
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject#") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping#") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions#") > -1
					) {
						var annotationContent = annotations.getObject()[key],
							annotation = key.split("#")[0],
							qualifier = key.split("#")[1],
							qualifierObject = findObject(qualifier);

						if (!qualifierObject) {
							qualifierObject = {
								qualifier: qualifier
							};
							qualifierObject[annotation] = annotationContent;
							qualifiersAnnotations.push(qualifierObject);
						} else {
							qualifierObject[annotation] = annotationContent;
						}
					}
				}
				qualifiersAnnotations = qualifiersAnnotations.filter(function(oQualifier) {
					return !!oQualifier["@com.sap.vocabularies.Common.v1.SemanticObject"];
				});
				var oQualifiersModel = new JSONModel(qualifiersAnnotations);
				oQualifiersModel.$$valueAsPromise = true;
				return oQualifiersModel.createBindingContext("/");
			},
			// returns array of semanticObjects including main and additional, with their mapping and unavailable Actions
			getSemanticObjectsWithAnnotations: function(propertyAnnotations) {
				// look for annotations SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping
				// returns : list of qualifiers (array of objects with qualifiers : {qualifier, SemanticObject, SemanticObjectUnavailableActions, SemanticObjectMapping for this qualifier}
				var annotations = propertyAnnotations;
				var semanticObjectList = [];
				var findObject = function(qualifier) {
					return semanticObjectList.find(function(object) {
						return object.qualifier === qualifier;
					});
				};
				for (var key in annotations.getObject()) {
					// var qualifier;
					if (
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") > -1 ||
						key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") > -1
					) {
						if (key.indexOf("#") > -1) {
							var annotationContent = annotations.getObject()[key],
								annotation = key.split("#")[0],
								qualifier = key.split("#")[1],
								listItem = findObject(qualifier);
							if (!listItem) {
								listItem = {
									qualifier: qualifier
								};
								listItem[annotation] = annotationContent;
								semanticObjectList.push(listItem);
							} else {
								listItem[annotation] = annotationContent;
							}
						} else {
							var annotationContent = annotations.getObject()[key],
								annotation,
								qualifier;
							if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectMapping") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObjectMapping";
							} else if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";
							} else if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1) {
								annotation = "@com.sap.vocabularies.Common.v1.SemanticObject";
							}
							var listItem = findObject("main");
							if (!listItem) {
								listItem = {
									qualifier: "main"
								};
								listItem[annotation] = annotationContent;
								semanticObjectList.push(listItem);
							} else {
								listItem[annotation] = annotationContent;
							}
						}
					}
				}
				// filter if no semanticObject was defined
				semanticObjectList = semanticObjectList.filter(function(oQualifier) {
					return !!oQualifier["@com.sap.vocabularies.Common.v1.SemanticObject"];
				});
				var oSemanticObjectsModel = new JSONModel(semanticObjectList);
				oSemanticObjectsModel.$$valueAsPromise = true;
				return oSemanticObjectsModel.createBindingContext("/");
			},
			// returns the list of parameters to pass to the Link delegates
			computeLinkParameters: function(
				delegateName,
				entityType,
				semanticObjectsList,
				semanticObjectsWithAnnotations,
				dataField,
				contact,
				mainSemanticObject,
				navigationPath
			) {
				// sPath = AnnotationHelper.getNavigationPath(property.getPath()) + "/";

				return Promise.resolve().then(function(aValues) {
					var semanticObjectMappings = [],
						semanticObjectUnavailableActions = [],
						aSemObjectPrimaryAction = [],
						aPromises = [];
					if (semanticObjectsWithAnnotations) {
						semanticObjectsWithAnnotations.forEach(function(semObject) {
							if (semObject["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]) {
								var unAvailableAction = {
									semanticObject: semObject["@com.sap.vocabularies.Common.v1.SemanticObject"],
									actions: semObject["@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]
								};
								semanticObjectUnavailableActions.push(unAvailableAction);
							}
							if (semObject["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"]) {
								var items = [];
								semObject["@com.sap.vocabularies.Common.v1.SemanticObjectMapping"].forEach(function(mappingItem) {
									items.push({
										key: mappingItem.LocalProperty.$PropertyPath,
										value: mappingItem.SemanticObjectProperty
									});
								});
								var mapping = {
									semanticObject: semObject["@com.sap.vocabularies.Common.v1.SemanticObject"],
									items: items
								};
								semanticObjectMappings.push(mapping);
							}
						});
						if (semanticObjectsList) {
							var oUshellContainer = sap.ushell && sap.ushell.Container;
							var oService = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
							semanticObjectsList.forEach(function(semObject) {
								if (typeof semObject === "string") {
									aPromises.push(oService.getPrimaryIntent(semObject, {}));
								}
							});
						}
						return Promise.all(aPromises).then(function(aSemObjectPrimaryAction) {
							return JSON.stringify({
								name: delegateName,
								payload: {
									semanticObjects: semanticObjectsList,
									entityType: entityType,
									semanticObjectUnavailableActions: semanticObjectUnavailableActions,
									semanticObjectMappings: semanticObjectMappings,
									semanticPrimaryActions: aSemObjectPrimaryAction,
									mainSemanticObject: mainSemanticObject,
									dataField: dataField,
									contact: contact,
									navigationPath: navigationPath
								}
							});
						});
					} else {
						return JSON.stringify({
							name: delegateName,
							payload: {
								semanticObjects: semanticObjectsList,
								entityType: entityType,
								semanticObjectUnavailableActions: semanticObjectUnavailableActions,
								semanticObjectMappings: semanticObjectMappings,
								semanticPrimaryActions: aSemObjectPrimaryAction,
								mainSemanticObject: mainSemanticObject,
								dataField: dataField,
								contact: contact,
								navigationPath: navigationPath
							}
						});
					}
				});
			},
			checkPrimaryActions: function(oSemantics) {
				var oPrimaryAction = oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)];
				var oUshellContainer = sap.ushell && sap.ushell.Container;
				var oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");
				var sCurrentHash = oXApplNavigation.hrefForExternal();
				if (oSemantics.mainSemanticObject && oPrimaryAction !== null && oPrimaryAction.intent !== sCurrentHash) {
					for (var i = 0; i < oSemantics.semanticObjectUnavailableActions.length; i++) {
						if (oSemantics.mainSemanticObject.indexOf(oSemantics.semanticObjectUnavailableActions[i].semanticObject) === 0) {
							for (var j = 0; j < oSemantics.semanticObjectUnavailableActions[i].actions.length; j++) {
								if (
									oPrimaryAction.intent
										.split("-")[1]
										.indexOf(oSemantics.semanticObjectUnavailableActions[i].actions[j]) === 0
								) {
									return false;
								}
							}
						}
					}
					return true;
				} else {
					return false;
				}
			},
			getPrimaryAction: function(oSemantics) {
				return oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)].intent
					? oSemantics.semanticPrimaryActions[oSemantics.semanticObjects.indexOf(oSemantics.mainSemanticObject)].intent
					: oSemantics.primaryIntentAction;
			},
			operators: function(iContext, oProperty, bUseSemanticDateRange, sSettings) {
				if (!oProperty) {
					return undefined;
				}
				// Complete possible set of Operators for AllowedExpression Types
				var oContext = iContext
					.getInterface(0)
					.getModel(1)
					.createBindingContext(iContext.getInterface(0).getPath(1));
				var sProperty = FieldHelper.propertyName(oProperty, { context: oContext });
				var oModel = oContext.getModel(),
					sPropertyPath = oContext.getPath(),
					sEntitySetPath = CommonHelper.getEntitySetForPropertyPath(oModel, sPropertyPath),
					sType = oProperty.$Type;
				return CommonUtils.getOperatorsForProperty(sProperty, sEntitySetPath, oContext, sType, bUseSemanticDateRange, sSettings);
			},
			/**
			 * Return the property context for usage in QuickViewForm.
			 *
			 * @param oDataFieldContext	Context of the data field or associated property
			 * @returns {sap.ui.model.Context} Binding context
			 */
			getPropertyContextForQuickViewForm: function(oDataFieldContext) {
				var sType = oDataFieldContext.getObject("$Type");
				if (sType === "com.sap.vocabularies.UI.v1.DataField" || sType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
					// Create a binding context to the property from the data field.
					var oInterface = oDataFieldContext.getInterface(),
						oModel = oInterface.getModel(),
						sPath = oInterface.getPath();
					sPath = sPath + (sPath.endsWith("/") ? "Value" : "/Value");
					return oModel.createBindingContext(sPath);
				} else {
					// It is a property. Just return the context as it is.
					return oDataFieldContext;
				}
			},
			/**
			 * Return the binding context corresponding to the property path.
			 *
			 * @param oPropertyContext Context of the property
			 * @returns {sap.ui.model.Context} Binding context
			 */
			getPropertyPathForQuickViewForm: function(oPropertyContext) {
				if (oPropertyContext && oPropertyContext.getObject("$Path")) {
					var oInterface = oPropertyContext.getInterface(),
						oModel = oInterface.getModel(),
						sPath = oInterface.getPath();
					sPath = sPath + (sPath.endsWith("/") ? "$Path" : "/$Path");
					return oModel.createBindingContext(sPath);
				}

				return oPropertyContext;
			},
			/*
			 * Method to get visible expression for DataFieldActionButton
			 * @function
			 * @name isDataFieldActionButtonVisible
			 * @param {object} oThis - Current Object
			 * @param {object} oDataField - DataPoint's Value
			 * @param {boolean} bIsBound - DataPoint action bound
			 * @param {object} oActionContext - ActionContext Value
			 * @return {boolean} - returns boolean
			 */
			isDataFieldActionButtonVisible: function(oThis, oDataField, bIsBound, oActionContext) {
				return oDataField["@com.sap.vocabularies.UI.v1.Hidden"] !== true && (bIsBound !== true || oActionContext !== false);
			},
			/**
			 * Method to get press event for DataFieldActionButton.
			 *
			 * @function
			 * @name getPressEventForDataFieldActionButton
			 * @param {object} oThis - Current Object
			 * @param {object} oDataField - DataPoint's Value
			 * @returns {string} - returns expression for DataFieldActionButton press
			 */
			getPressEventForDataFieldActionButton: function(oThis, oDataField) {
				var sInvocationGrouping = "Isolated";
				if (
					oDataField.InvocationGrouping &&
					oDataField.InvocationGrouping.$EnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"
				) {
					sInvocationGrouping = "ChangeSet";
				}
				var bIsNavigable = oThis.navigateAfterAction;
				bIsNavigable = bIsNavigable === "false" ? false : true;
				var oParams = {
					contexts: "${$source>/}.getBindingContext()",
					invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGrouping),
					model: "${$source>/}.getModel()",
					label: CommonHelper.addSingleQuotes(oDataField.Label),
					isNavigable: bIsNavigable
				};

				return CommonHelper.generateFunction(
					".editFlow.invokeAction",
					CommonHelper.addSingleQuotes(oDataField.Action),
					CommonHelper.objectToString(oParams)
				);
			},

			isNumericDataType: function(sDataFieldType) {
				var _sDataFieldType = sDataFieldType;
				if (_sDataFieldType !== undefined) {
					var aNumericDataTypes = [
						"Edm.Int16",
						"Edm.Int32",
						"Edm.Int64",
						"Edm.Byte",
						"Edm.SByte",
						"Edm.Single",
						"Edm.Decimal",
						"Edm.Double"
					];
					return aNumericDataTypes.indexOf(_sDataFieldType) === -1 ? false : true;
				} else {
					return false;
				}
			},

			isDateOrTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateTimeDataTypes = ["Edm.DateTimeOffset", "Edm.DateTime", "Edm.Date", "Edm.TimeOfDay", "Edm.Time"];
					return aDateTimeDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},
			isDateTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateDataTypes = ["Edm.DateTimeOffset", "Edm.DateTime"];
					return aDateDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},
			isDateDataType: function(sPropertyType) {
				return sPropertyType === "Edm.Date";
			},
			isTimeDataType: function(sPropertyType) {
				if (sPropertyType !== undefined) {
					var aDateDataTypes = ["Edm.TimeOfDay", "Edm.Time"];
					return aDateDataTypes.indexOf(sPropertyType) > -1;
				} else {
					return false;
				}
			},

			/**
			 * Method to return the underlying property data type in case TextArrangement annotation of Text annotation 'TextOnly' exists.
			 *
			 * @param oAnnotations {object} contains all annotations of a property
			 * @param oModel {object} instance of OData v4 model
			 * @param sEntityPath {string} path to root Entity
			 * @param sType {string} property data type
			 * @returns {string} The underlying property data type for TextOnly annotated property, otherwise the original data type.
			 * @private
			 */
			getUnderlyingPropertyDataType: function(oAnnotations, oModel, sEntityPath, sType) {
				var sTextAnnotation = "@com.sap.vocabularies.Common.v1.Text",
					sTextArrangementAnnotation = "@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement";
				if (
					!!oAnnotations &&
					!!oAnnotations[sTextArrangementAnnotation] &&
					oAnnotations[sTextArrangementAnnotation].$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" &&
					!!oAnnotations[sTextAnnotation] &&
					!!oAnnotations[sTextAnnotation].$Path
				) {
					return oModel.getObject(sEntityPath + "/" + oAnnotations[sTextAnnotation].$Path + "/$Type");
				}

				return sType;
			},

			getColumnAlignment: function(oDataField, oTable) {
				var sEntityPath = oTable.collection.sPath,
					oModel = oTable.collection.oModel;
				if (
					(oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
						oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") &&
					oDataField.Inline &&
					oDataField.IconUrl
				) {
					return "Center";
				}
				return FieldHelper.getDataFieldAlignment(oDataField, oModel, sEntityPath);
			},
			/**
			 * Get alignment based only on the property.
			 * @param sType {string}  property's type
			 * @param oFormatOptions {object} field format options
			 * @param [oComputedEditMode] {object} computed Edit mode of the property when directly called from the ColumnProperty.fragment it is empty
			 * @returns {string}
			 */
			getPropertyAlignment: function(sType, oFormatOptions, oComputedEditMode) {
				var sDefaultAlignment = "Begin";
				var sTextAlignment = oFormatOptions ? oFormatOptions.textAlignMode : "";
				switch (sTextAlignment) {
					case "Form":
						if (this.isNumericDataType(sType)) {
							sDefaultAlignment = "Begin";
							if (oComputedEditMode) {
								sDefaultAlignment = UIFormatters.getAlignmentExpression(oComputedEditMode, "Begin", "End");
							}
						}
						break;
					default:
						if (this.isNumericDataType(sType) || this.isDateOrTimeDataType(sType)) {
							sDefaultAlignment = "End";
						}
						break;
				}
				return sDefaultAlignment;
			},

			getDataFieldAlignment: function(oDataField, oModel, sEntityPath, oFormatOptions, oComputedEditMode) {
				var sDataFieldPath,
					sDefaultAlignment = "Begin",
					sType,
					oAnnotations;

				if (oDataField["$Type"] === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
					sDataFieldPath = oDataField.Target.$AnnotationPath;
					if (
						oDataField.Target["$AnnotationPath"] &&
						oDataField.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.FieldGroup") >= 0
					) {
						var oFieldGroup = oModel.getObject(sEntityPath + "/" + sDataFieldPath);

						for (var i = 0; i < oFieldGroup.Data.length; i++) {
							sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Data/" + i.toString() + "/Value/$Path/$Type");
							oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Data/" + i.toString() + "/Value/$Path@");
							sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
							sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);

							if (sDefaultAlignment === "Begin") {
								break;
							}
						}
						return sDefaultAlignment;
					} else if (
						oDataField.Target["$AnnotationPath"] &&
						oDataField.Target["$AnnotationPath"].indexOf("com.sap.vocabularies.UI.v1.DataPoint") >= 0 &&
						oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Visualization/$EnumMember") ===
							"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
					) {
						return sDefaultAlignment;
					} else {
						sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/$Type");
						if (sType === "com.sap.vocabularies.UI.v1.DataPointType") {
							sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Value/$Path/$Type");
							oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/Value/$Path@");
							sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
						}
						sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);
					}
				} else {
					sDataFieldPath = oDataField.Value.$Path;
					sType = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "/$Type");
					oAnnotations = oModel.getObject(sEntityPath + "/" + sDataFieldPath + "@");
					sType = this.getUnderlyingPropertyDataType(oAnnotations, oModel, sEntityPath, sType);
					if (!(oModel.getObject(sEntityPath + "/")["$Key"].indexOf(sDataFieldPath) === 0)) {
						sDefaultAlignment = this.getPropertyAlignment(sType, oFormatOptions, oComputedEditMode);
					}
				}
				return sDefaultAlignment;
			},
			getTypeAlignment: function(oContext, oDataField, oFormatOptions, sEntityPath, oComputedEditMode, oProperty) {
				var oInterface = oContext.getInterface(0);
				var oModel = oInterface.getModel();

				if (sEntityPath === "/undefined" && oProperty && oProperty.$target) {
					sEntityPath = "/" + oProperty.$target.fullyQualifiedName.split("/")[0];
				}
				return FieldHelper.getDataFieldAlignment(oDataField, oModel, sEntityPath, oFormatOptions, oComputedEditMode);
			},

			getImportance: function(oDataField, aSemanticKeys, aFieldGroupData) {
				//Evaluate default Importance is not set excplicitely
				if (!oDataField["@com.sap.vocabularies.UI.v1.Importance"]) {
					//Check if semanticKeys are defined at the EntitySet level
					if (aSemanticKeys && aSemanticKeys.length > 0) {
						var mSemanticKeys = aSemanticKeys.map(function(oKey) {
							return oKey.$PropertyPath;
						});

						switch (oDataField.$Type) {
							case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
								//If a FieldGroup contains a semanticKey, importance set to High
								if (
									oDataField.Target &&
									oDataField.Target.$AnnotationPath &&
									oDataField.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1
								) {
									return aFieldGroupData.some(function(oFieldGroupDataField) {
										return (
											oFieldGroupDataField.Value &&
											oFieldGroupDataField.Value.$Path &&
											oFieldGroupDataField.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
											mSemanticKeys.includes(oFieldGroupDataField.Value.$Path)
										);
									})
										? "High"
										: "None";
								}
								break;
							default:
								//If current field is a semanticKey, importance set to High
								if (oDataField.Value && oDataField.Value.$Path) {
									return mSemanticKeys.includes(oDataField.Value.$Path) ? "High" : "None";
								}
						}
					}
					return "None";
				} else {
					switch (oDataField["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember) {
						case "com.sap.vocabularies.UI.v1.ImportanceType/High":
							return "High";
						case "com.sap.vocabularies.UI.v1.ImportanceType/Medium":
							return "Medium";
						case "com.sap.vocabularies.UI.v1.ImportanceType/Low":
							return "Low";
						default:
							return "None";
					}
				}
			},

			/**
			 * Method to get enabled expression for DataFieldActionButton.
			 *
			 * @function
			 * @name isDataFieldActionButtonEnabled
			 * @param {object} oDataField - DataPoint's Value
			 * @param {boolean} bIsBound - DataPoint action bound
			 * @param {object} oActionContext - ActionContext Value
			 * @param {string} sActionContextFormat - Formatted value of ActionContext
			 * @returns {*} - returns boolean or string expression for enabled property
			 */
			isDataFieldActionButtonEnabled: function(oDataField, bIsBound, oActionContext, sActionContextFormat) {
				if (bIsBound !== true) {
					return "true";
				}
				return (oActionContext === null
				? "{= !${#" + oDataField.Action + "} ? false : true }"
				: oActionContext.$Path)
					? sActionContextFormat
					: "true";
			},
			/**
			 * Method to get labelText for DataField.
			 *
			 * @function
			 * @name getLabelTextForDataField
			 * @param {object} oEntitySetModel - entity set model Object
			 * @param {object} oPropertyPath - Property path's object
			 * @param {string} sPropertyPathBuildExpression - evaluated value of expression ${property>$Path@@FIELD.buildExpressionForTextValue}
			 * @param {string} sPropertyValue - Property value from model
			 * @param {string} sUiName - sapui.name annotation value
			 * @param sSemanticKeyStyle
			 * @returns {string} - returns expression for datafield label.
			 */
			getLabelTextForDataField: function(
				oEntitySetModel,
				oPropertyPath,
				sPropertyPathBuildExpression,
				sPropertyValue,
				sUiName,
				sSemanticKeyStyle
			) {
				var sResult;
				var oDraftRoot = oEntitySetModel["@com.sap.vocabularies.Common.v1.DraftRoot"];
				sResult = FieldHelper.getSemanticKeyTitle(
					oPropertyPath["@com.sap.vocabularies.Common.v1.Text"] && sPropertyPathBuildExpression,
					sPropertyValue,
					sUiName,
					oPropertyPath["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"],
					sSemanticKeyStyle,
					oDraftRoot
				);
				return sResult;
			},
			/**
			 * Method to get MultipleLines for DataField.
			 *
			 * @function
			 * @name getMultipleLinesForDataField
			 * @param {object} oThis - Current Object
			 * @param {string} sPropertyType - Property type
			 * @param {string} sPropertyMultiLineText - Property multiline text
			 * @returns {*} - returns expression or boolean
			 */
			getMultipleLinesForDataField: function(oThis, sPropertyType, sPropertyMultiLineText) {
				if (oThis.wrap === "false") {
					return false;
				}
				if (sPropertyType !== "Edm.String") {
					return sPropertyMultiLineText;
				}
				if (oThis.editMode === "Display") {
					return true;
				}
				if (oThis.editMode.indexOf("{") > -1) {
					// If the editMode is computed then we just care about the page editMode to determine if the multiline property should be taken into account
					return "{= ${ui>/editMode} === 'Display' ? true : " + sPropertyMultiLineText + "}";
				}
				return sPropertyMultiLineText;
			},

			/**
			 * Method to get Icon for Datapoint.
			 *
			 * @function
			 * @name getIConForDataPoint
			 * @param {object} oDataPoint - data point object
			 * @returns {string} - returns string the icon path associated
			 */
			getIconForDataPoint: function(oDataPoint) {
				var bCondition =
						oDataPoint.CriticalityRepresentation &&
						oDataPoint.CriticalityRepresentation["$EnumMember"] ===
							"com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon",
					sDataPointCriticalityPath = oDataPoint.Criticality && oDataPoint.Criticality["$Path"],
					sIconPath = "";
				if (!bCondition) {
					sIconPath = FieldHelper.buildExpressionForCriticalityIcon(sDataPointCriticalityPath);
				}
				return sIconPath;
			},
			/**
			 * Method to check ValueListReferences, ValueListMapping and ValueList inside ActionParameters for FieldHelp.
			 *
			 * @function
			 * @name checkFieldHelp
			 * @param {object} oActionParameter - Action parameter object
			 * @returns {boolean} - returns boolean
			 */
			checkFieldHelp: function(oActionParameter) {
				return (
					oActionParameter["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
					oActionParameter["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
					oActionParameter["@com.sap.vocabularies.Common.v1.ValueList"]
				);
			},
			/**
			 * Method to get display property for ActionParameter dialog.
			 *
			 * 	@function
			 * @name getAPDialogDisplayFormat
			 * @param {object} oProperty - action parameter instance
			 * @param {object} oInterface - interface for context instance
			 * @returns {string} - returns 'DescriptionValue' or 'Value'
			 */
			getAPDialogDisplayFormat: function(oProperty, oInterface) {
				var oAnnotation,
					oModel = oInterface.context.getModel(),
					sContextPath = oInterface.context.getPath(),
					sPropertyName = oProperty.$Name || oInterface.context.getProperty(sContextPath + "@sapui.name"),
					oActionParameterAnnotations = oModel.getObject(sContextPath + "@"),
					oValueHelpAnnotation =
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueList"] ||
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
						oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"],
					getValueListPropertyName = function(oValueList) {
						var oValueListParameter = oValueList.Parameters.find(function(oParameter) {
							return oParameter.LocalDataProperty && oParameter.LocalDataProperty.$PropertyPath === sPropertyName;
						});
						return oValueListParameter && oValueListParameter.ValueListProperty;
					},
					sValueListPropertyName;
				if (
					oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.TextArrangement"] ||
					oActionParameterAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]
				) {
					return CommonUtils.computeDisplayMode(oActionParameterAnnotations, undefined);
				} else if (oValueHelpAnnotation) {
					if (oValueHelpAnnotation.CollectionPath) {
						// get the name of the corresponding property in value list collection
						sValueListPropertyName = getValueListPropertyName(oValueHelpAnnotation);
						if (!sValueListPropertyName) {
							return "Value";
						}
						// get text for this property
						oAnnotation = oModel.getObject("/" + oValueHelpAnnotation.CollectionPath + "/" + sValueListPropertyName + "@");
						return oAnnotation && oAnnotation["@com.sap.vocabularies.Common.v1.Text"]
							? CommonUtils.computeDisplayMode(oAnnotation, undefined)
							: "Value";
					} else {
						return oModel.requestValueListInfo(sContextPath, true).then(function(oValueListInfo) {
							// get the name of the corresponding property in value list collection
							sValueListPropertyName = getValueListPropertyName(oValueListInfo[""]);
							if (!sValueListPropertyName) {
								return "Value";
							}
							// get text for this property
							oAnnotation = oValueListInfo[""].$model
								.getMetaModel()
								.getObject("/" + oValueListInfo[""]["CollectionPath"] + "/" + sValueListPropertyName + "@");
							return oAnnotation && oAnnotation["@com.sap.vocabularies.Common.v1.Text"]
								? CommonUtils.computeDisplayMode(oAnnotation, undefined)
								: "Value";
						});
					}
				} else {
					return "Value";
				}
			},
			/**
			 * Method to get display property for ActionParameter dialog FieldHelp.
			 *
			 * @function
			 * @name getActionParameterDialogFieldHelp
			 * @param {object} oActionParameter - Action parameter object
			 * @param {string} sSapUIName - Action sapui name
			 * @param {string} sParamName - parameter name
			 * @returns {string} - returns 'DescriptionValue' or 'Value'
			 */
			getActionParameterDialogFieldHelp: function(oActionParameter, sSapUIName, sParamName) {
				return this.checkFieldHelp(oActionParameter) ? StableIdHelper.generate([sSapUIName, sParamName]) : undefined;
			},
			/**
			 * Method to get display property for ActionParameter dialog delegate.
			 *
			 * @function
			 * @name getFieldValueHelpDelegate
			 * @param {boolean} bIsBound - Action is bound
			 * @param {string} sEsName - esName sapui name
			 * @param {string} sSapUIName - Action sapui name
			 * @param {string} sParamName - parameter name
			 * @returns {string} - returns 'DescriptionValue' or 'Value'
			 */
			getFieldValueHelpDelegate: function(bIsBound, sEsName, sSapUIName, sParamName) {
				return CommonHelper.objectToString({
					name: CommonHelper.addSingleQuotes("sap/fe/macros/FieldValueHelpDelegate"),
					payload: {
						propertyPath: CommonHelper.addSingleQuotes(
							ValueListHelper.getPropertyPath({
								UnboundAction: !bIsBound,
								EntitySet: sEsName,
								Action: sSapUIName,
								Property: sParamName
							})
						)
					}
				});
			},
			/**
			 * Method to fetch entity from a path containing multiple associations.
			 *
			 * @function
			 * @name _getEntitySetFromMultiLevel
			 * @param {object} oContext - context whose path is to be checked
			 * @param {string} sPath - path from which entity has to be fetched
			 * @param {string} sSourceEntity - entity path in which nav entity exists
			 * @param {integer} iStart - start index : beginning parts of the path to be ignored
			 * @param {integer} iDiff - diff index : end parts of the path to be ignored
			 * @returns {string} sSourceEntity - path of the entity set
			 */
			_getEntitySetFromMultiLevel: function(oContext, sPath, sSourceEntity, iStart, iDiff) {
				var aNavParts = sPath.split("/").filter(Boolean);
				aNavParts = aNavParts.filter(function(sPart) {
					return sPart !== "$NavigationPropertyBinding";
				});
				if (aNavParts.length > 0) {
					for (var i = iStart; i < aNavParts.length - iDiff; i++) {
						sSourceEntity = "/" + oContext.getObject(sSourceEntity + "/$NavigationPropertyBinding/" + aNavParts[i]);
					}
				}
				return sSourceEntity;
			},
			/**
			 * Method to find the entity of the property.
			 *
			 * @function
			 * @name getPropertyCollection
			 * @param {object} oProperty - context from which datafield's path needs to be extracted.
			 * @param {object} oContextObject - Metadata Context(Not passed when called with template:with)
			 * @returns {string} sFieldSourceEntity - entity set path of the property
			 */
			getPropertyCollection: function(oProperty, oContextObject) {
				var oContext = (oContextObject && oContextObject.context) || oProperty;
				var sPath = oContext.getPath(),
					aMainEntityParts = sPath.split("/").filter(Boolean),
					sMainEntity = aMainEntityParts[0],
					sPropertyPath = oContext.getObject("$Path"),
					sFieldSourceEntity = "/" + sMainEntity;
				// checking against prefix of annotations, ie. @com.sap.vocabularies.
				// as annotation path can be of a line item, field group or facet
				if (sPath.indexOf("/@com.sap.vocabularies.") > -1) {
					var iAnnoIndex = sPath.indexOf("/@com.sap.vocabularies.");
					var sInnerPath = sPath.substring(0, iAnnoIndex);
					// the facet or line item's entity could be a navigation entity
					sFieldSourceEntity = FieldHelper._getEntitySetFromMultiLevel(oContext, sInnerPath, sFieldSourceEntity, 1, 0);
				}
				if (sPropertyPath && sPropertyPath.indexOf("/") > -1) {
					// the field within facet or line item could be from a navigation entity
					sFieldSourceEntity = FieldHelper._getEntitySetFromMultiLevel(oContext, sPropertyPath, sFieldSourceEntity, 0, 1);
				}
				return sFieldSourceEntity;
			},
			/**
			 * Method to find SingleRange field.
			 *
			 * @function
			 * @name isSingleRangeDateField
			 * @param {object} oProperty - context from which datafield's path needs to be extracted
			 * @param {object} oInterface - The interface instance
			 * @returns {boolean} - returns a boolean value based on AllowedExpressions
			 */
			isSingleRangeDateField: function(oProperty, oInterface) {
				if (oProperty.$Type === "Edm.Date") {
					var sProperty = FieldHelper.propertyName(oProperty, oInterface);
					var oContext = oInterface.context,
						oModel = oContext.getModel(),
						sPropertyPath = oContext.getPath(),
						sEntitySetPath = CommonHelper.getEntitySetForPropertyPath(oModel, sPropertyPath);
					var oFilterRestrictions = oContext.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
					if (
						oFilterRestrictions &&
						oFilterRestrictions.FilterExpressionRestrictions &&
						oFilterRestrictions.FilterExpressionRestrictions.some(function(oRestriction) {
							return oRestriction.Property.$PropertyPath === sProperty;
						})
					) {
						var aRestriction = oFilterRestrictions.FilterExpressionRestrictions.filter(function(oRestriction) {
							return oRestriction.Property.$PropertyPath === sProperty;
						});
						if (
							aRestriction.some(function(oRestriction) {
								return oRestriction.AllowedExpressions === "SingleRange";
							})
						) {
							return true;
						}
					}
				}
				return false;
			},
			/**
			 * Method used in a template with to retrieve the currency or the unit property inside a templating variable.
			 * @param oPropertyAnnotations
			 * @returns {string} the annotationPath to be dealt with by template:with
			 */
			getUnitOrCurrency: function(oPropertyAnnotations) {
				var oPropertyAnnotationsObject = oPropertyAnnotations.getObject();
				var sAnnotationPath = oPropertyAnnotations.sPath;
				if (oPropertyAnnotationsObject["@Org.OData.Measures.V1.ISOCurrency"]) {
					sAnnotationPath = sAnnotationPath + "Org.OData.Measures.V1.ISOCurrency";
				} else {
					sAnnotationPath = sAnnotationPath + "Org.OData.Measures.V1.Unit";
				}

				return sAnnotationPath;
			},
			hasStaticUnitOrCurrency: function(oPropertyAnnotations) {
				return oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"]
					? !oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"].$Path
					: !oPropertyAnnotations["@Org.OData.Measures.V1.Unit"].$Path;
			},
			getStaticUnitOrCurrency: function(oPropertyAnnotations) {
				return oPropertyAnnotations["@Org.OData.Measures.V1.ISOCurrency"] || oPropertyAnnotations["@Org.OData.Measures.V1.Unit"];
			},
			formatValueWithoutUnit: function(oInterface, property) {
				var oModel = oInterface.getModel();
				var sPath = oInterface.getPath();
				var oContext = oModel.createBindingContext(sPath);
				return Promise.resolve()
					.then(function() {
						return AnnotationHelper.format({ $Path: property.$Path }, { arguments: [], context: oContext });
					})
					.then(function(sResult) {
						// if annotationHelper returns a binding with several parts we only take the first part and disregards the others (used for the unit)
						var propertyOnly = /(.*,type:'sap\.ui\.model\.odata\.type\.(Unit|Currency)')}/;
						var aMatches = sResult && sResult.match(propertyOnly);
						if (aMatches && aMatches[1]) {
							sResult = aMatches[1] + ",formatOptions:{showMeasure:false}}";
						}
						return sResult;
					});
			},
			getEmptyIndicatorTrigger: function(bActive, sBinding, sFullTextBinding) {
				if (sFullTextBinding) {
					return bActive ? sFullTextBinding : "inactive";
				}
				return bActive ? sBinding : "inactive";
			},
			/**
			 * When the value displayed is in text arrangement TextOnly we also want to retrieve the Text value for tables even if we don't show it.
			 * This method will return the value of the original data field.
			 *
			 * @param {object} oThis - Current Object
			 * @param {object} oDataFieldTextArrangement - DataField using text arrangement annotation
			 * @param {object} oDataField - DataField containing the value using text arrangement annotation
			 * @returns {string} the binding to the value
			 */
			getBindingInfoForTextArrangement: function(oThis, oDataFieldTextArrangement, oDataField) {
				if (
					oDataFieldTextArrangement &&
					oDataFieldTextArrangement.$EnumMember &&
					oDataFieldTextArrangement.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly" &&
					oDataField
				) {
					return "{" + oDataField.Value.$Path + "}";
				}
			}
		};

		FieldHelper.getConditionsBinding.requiresIContext = true;
		FieldHelper.buildExpressionForTextValue.requiresIContext = true;
		FieldHelper.getRequiredForDataField.requiresIContext = true;
		FieldHelper.getBindingForDraftAdminBlockInline.requiresIContext = true;
		FieldHelper.getFieldGroupIds.requiresIContext = true;
		FieldHelper.fieldControl.requiresIContext = true;
		FieldHelper.getValueFormatted.requiresIContext = true;
		FieldHelper.buildFieldBindingExpression.requiresIContext = true;
		FieldHelper.formatDataPointField.requiresIContext = true;
		FieldHelper.getNavigationPath.requiresIContext = true;
		FieldHelper.getTypeAlignment.requiresIContext = true;
		FieldHelper.getPropertyCollection.requiresIContext = true;
		FieldHelper.getAPDialogDisplayFormat.requiresIContext = true;
		FieldHelper.operators.requiresIContext = true;
		FieldHelper.formatValueWithoutUnit.requiresIContext = true;

		return FieldHelper;
	},
	/* bExport= */
	true
);
