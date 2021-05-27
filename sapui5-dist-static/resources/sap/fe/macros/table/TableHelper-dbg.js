/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/library",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/AnnotationHelper",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/macros/SizeHelper",
		"sap/base/Log"
	],
	function(
		JSONModel,
		CommonHelper,
		FELibrary,
		StableIdHelper,
		AnnotationHelper,
		ODataModelAnnotationHelper,
		ConverterContext,
		SizeHelper,
		Log
	) {
		"use strict";

		var CreationMode = FELibrary.CreationMode;

		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableHelper = {
			/**
			 * Check if Action is a Static.
			 * @param {object} oActionContext - Action to check static
			 * @param {string} sActionName - Action name
			 * @param sAnnotationTargetEntityType
			 * @returns {bool} test result
			 * @private
			 * @ui5-restricted
			 */
			_isStaticAction: function(oActionContext, sActionName, sAnnotationTargetEntityType) {
				var aParts;
				var sEntityType;
				var oAction;

				if (sActionName && sActionName.indexOf("(") > -1) {
					aParts = sActionName.split("(");
					sEntityType = aParts[aParts.length - 1].replaceAll(")", "");
				}

				if (oActionContext) {
					if (Array.isArray(oActionContext)) {
						if (sEntityType) {
							oAction = oActionContext.find(function(action) {
								return action.$IsBound && action.$Parameter[0].$Type === sEntityType;
							});
						} else {
							// if this is just one - OK we take it. If it's more it's actually a wrong usage by the app
							// as we used the first one all the time we keep it as it is
							oAction = oActionContext[0];
						}
					} else {
						oAction = oActionContext;
					}
				}

				if (
					oAction &&
					oAction.$IsBound &&
					(oAction.$Parameter[0].$isCollection || (sEntityType && sAnnotationTargetEntityType !== sEntityType))
				) {
					// bound action to another entity type has to be treated as a static context
					return true;
				}
			},

			createButtonTemplating: function(oThis, bCreationRow) {
				var oTargetCollection = oThis.collection,
					sCreationMode = oThis.creationMode,
					oNavigationProperty,
					bNavigationInsertRestrictions,
					sCurrentCollectionName = oThis.navigationPath,
					sTargetCollectionPath = CommonHelper.getTargetCollection(oThis.collection, oThis.navigationPath),
					aRestrictedProperties = oThis.parentEntitySet.getObject(
						oThis.parentEntitySet.getPath() + "@Org.OData.Capabilities.V1.NavigationRestrictions/RestrictedProperties"
					);
				for (var i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.InsertRestrictions &&
						oNavigationProperty.InsertRestrictions.Insertable
					) {
						bNavigationInsertRestrictions = oNavigationProperty.InsertRestrictions.Insertable;
					}
				}
				if (oThis.showCreate === "false") {
					return false;
				}
				if (sCreationMode === CreationMode.CreationRow && bCreationRow === false) {
					return false;
				} else if (
					oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction")
				) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (bNavigationInsertRestrictions === false) {
					return false;
				} else if (bNavigationInsertRestrictions) {
					// if navigation insert restrictions are present and not static false then we render the button
					return true;
				} else if (sCreationMode === CreationMode.External) {
					// if outbound navigation with Create Button
					return true;
				}
				return (
					oTargetCollection.getObject(sTargetCollectionPath + "@Org.OData.Capabilities.V1.InsertRestrictions/Insertable") !==
					false
				);
			},

			deleteButtonTemplating: function(oThis) {
				if (oThis.showDelete !== undefined && oThis.showDelete !== null) {
					return oThis.showDelete;
				} else {
					return true;
				}
			},

			/**
			 * Returns a string of comma separated fields to add presentation variant to $select query of the table.
			 * The fields are the ones listed into PresentationVariantType RequestAtLeast.
			 * @param {object} oPresentationVariant - Annotation related to com.sap.vocabularies.UI.v1.PresentationVariant
			 * @param sPresentationVariantPath
			 * @returns {string} - CSV of fields listed into RequestAtLeast
			 * @private
			 * @ui5-restricted
			 */
			addPresentationVariantToSelectQuery: function(oPresentationVariant, sPresentationVariantPath) {
				var aRequested = [];
				if (
					!(
						oPresentationVariant &&
						CommonHelper._isPresentationVariantAnnotation(sPresentationVariantPath) &&
						oPresentationVariant.RequestAtLeast &&
						oPresentationVariant.RequestAtLeast.length > 0
					)
				) {
					return "";
				}
				oPresentationVariant.RequestAtLeast.forEach(function(oRequested) {
					aRequested.push(oRequested.$PropertyPath);
				});
				return aRequested.join(",");
			},
			/**
			 * Returns a string of comma separated fields to add operation to the $select query of the table.
			 * The fields are the ones used as path in OperationAvailable annotations for actions
			 * that are present in the UI.LineItem annotation.
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - CSV of path based OperationAvailable fields for actions of this table.
			 * @private
			 * @ui5-restricted
			 */
			addOperationAvailableFieldsToSelectQuery: function(aLineItemCollection, oContext) {
				var selectedFieldsArray = [],
					selectFields = "";
				aLineItemCollection.forEach(function(oRecord) {
					var sActionName = oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
						sActionName.indexOf("/") < 0 &&
						!oRecord.Determining
					) {
						if (CommonHelper.getActionPath(oContext.context, false, sActionName, true) === null) {
							selectedFieldsArray.push(sActionName);
						} else {
							var oResult = CommonHelper.getActionPath(oContext.context, false, sActionName);
							if (oResult.sProperty) {
								selectedFieldsArray.push(oResult.sProperty.substr(oResult.sBindingParameter.length + 1));
							}
						}
					}
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},
			addNavigationAvailableFieldsToSelectQuery: function(aLineItemCollection) {
				var selectedFieldsArray = [],
					selectFields = "";
				aLineItemCollection.forEach(function(oRecord) {
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
						!oRecord.Inline &&
						!oRecord.Determining &&
						oRecord.NavigationAvailable &&
						oRecord.NavigationAvailable.$Path
					) {
						selectedFieldsArray.push(oRecord.NavigationAvailable.$Path);
					}
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},
			/**
			 * Returns a string of comma separated fields having text annotation to the $select query of the table.
			 * The fields (simple dataField or Field Group) are retreived from the UI.LineItem annotation filtering
			 * on the fields using text arrangement as Text Only.  We will add the field containing the property path
			 * on the $select query requested during Excel Export (from the SpreadSheet).
			 *
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - CSV of path based data fields for properties defining text arrangement of this table.
			 * @private
			 * @ui5-restricted
			 */
			addFieldsHavingTextArrangementToSelectQuery: function(aLineItemCollection, oContext) {
				var selectedFieldsArray = [],
					aDataFieldsFromGroup = [],
					selectFields = "",
					n = 0,
					sPath = oContext.context.getPath();
				aLineItemCollection.forEach(function(oRecord) {
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
					) {
						var oField = oContext.context.getObject(sPath + "/" + n + "/Value/$Path@");
						if (
							oField &&
							oField["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
							oField["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"].$EnumMember ===
								"com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						) {
							selectedFieldsArray.push(oRecord.Value.$Path);
						} else {
							//For FieldGroup
							var oFieldGroup = oContext.context.getObject(sPath + "/" + n + "/Target/$AnnotationPath@/Data/");
							if (oField === undefined && oFieldGroup) {
								oFieldGroup.forEach(function(oField, i) {
									if (oField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
										return aDataFieldsFromGroup.push(
											oContext.context.getObject(
												sPath + "/" + n + "/Target/$AnnotationPath@/Data/" + i + "/Value/$Path@"
											)
										);
									}
								});
								if (aDataFieldsFromGroup.length > 0) {
									for (var field in aDataFieldsFromGroup) {
										if (
											aDataFieldsFromGroup[field][
												"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"
											] &&
											aDataFieldsFromGroup[field][
												"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"
											].$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
										) {
											selectedFieldsArray.push(field.Value.$Path);
										}
									}
								}
							}
						}
					}
					n++;
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},
			/**
			 * Returns a stringified JSON object where key-value pairs corresspond to the name of the
			 * action used in UI.DataFieldForAction and the property used as path in OperationAvailable
			 * annotation for this action. If static null is annotated, null is stored as the value.
			 * e.g. an entry of the JSON object would be "someNamespace.SomeBoundAction: SomeProperty".
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - Stringified JSON object
			 * @private
			 * @ui5-restricted
			 */
			getOperationAvailableMap: function(aLineItemCollection, oContext) {
				var oActionOperationAvailableMap = {},
					oResult;
				aLineItemCollection.forEach(function(oRecord) {
					var sActionName = oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
						sActionName.indexOf("/") < 0 &&
						!oRecord.Determining
					) {
						oResult = CommonHelper.getActionPath(oContext.context, false, sActionName, true);
						if (oResult === null) {
							oActionOperationAvailableMap[sActionName] = null;
						} else {
							oResult = CommonHelper.getActionPath(oContext.context, false, sActionName);
							if (oResult.sProperty) {
								oActionOperationAvailableMap[sActionName] = oResult.sProperty.substr(oResult.sBindingParameter.length + 1);
							}
						}
					}
				});
				return JSON.stringify(oActionOperationAvailableMap);
			},

			getNavigationAvailableMap: function(aLineItemCollection) {
				var oIBNNavigationAvailableMap = {};
				aLineItemCollection.forEach(function(oRecord) {
					var sKey = oRecord.SemanticObject + "-" + oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
						!oRecord.Inline &&
						oRecord.RequiresContext
					) {
						if (oRecord.NavigationAvailable !== undefined) {
							oIBNNavigationAvailableMap[sKey] = oRecord.NavigationAvailable.$Path
								? oRecord.NavigationAvailable.$Path
								: oRecord.NavigationAvailable;
						}
					}
				});
				return JSON.stringify(oIBNNavigationAvailableMap);
			},

			/**
			 * Returns a array of actions whether are not multi select enabled.
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {Array} - array of action pathstrings
			 * @private
			 * @ui5-restricted
			 */
			getMultiSelectDisabledActions: function(aLineItemCollection, oContext) {
				var aMultiSelectDisabledActions = [],
					sActionPath,
					sActionName,
					sAnnotationPath,
					oParameterAnnotations,
					oAction;
				var aActionMetadata = aLineItemCollection.filter(function(oItem) {
					return oItem.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction";
				});
				aActionMetadata.forEach(function(oActionMetadata) {
					sActionName = oActionMetadata.Action;
					sActionPath = CommonHelper.getActionPath(oContext.context, true, sActionName, false);
					oAction = oContext.context.getObject(sActionPath + "/@$ui5.overload/0");
					if (oAction && oAction.$Parameter && oAction.$IsBound) {
						for (var n in oAction.$Parameter) {
							sAnnotationPath = sActionPath + "/" + oAction.$Parameter[n].$Name + "@";
							oParameterAnnotations = oContext.context.getObject(sAnnotationPath);
							if (
								oParameterAnnotations &&
								((oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"] &&
									oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"].$Path) ||
									(oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"] &&
										oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"].$Path))
							) {
								aMultiSelectDisabledActions.push(sActionName);
								break;
							}
						}
					}
				});
				return aMultiSelectDisabledActions;
			},
			/**
			 * Return UI Line Item Context.
			 *
			 * @param {object} oPresentationContext Presentation context object (Presentation variant or UI.LineItem)
			 * @returns {object}
			 */
			getUiLineItem: function(oPresentationContext) {
				var oPresentation = oPresentationContext.getObject(oPresentationContext.sPath),
					oPresentationVariantPath = CommonHelper.createPresentationPathContext(oPresentationContext),
					oModel = oPresentationContext.getModel();
				if (CommonHelper._isPresentationVariantAnnotation(oPresentationVariantPath.getPath())) {
					// Uncomplete PresentationVariant can be passed to macro via SelectionPresentationVariant
					var sLineItemPath = "@com.sap.vocabularies.UI.v1.LineItem",
						aVisualizations = oPresentation.Visualizations;
					if (Array.isArray(aVisualizations)) {
						for (var i = 0; i < aVisualizations.length; i++) {
							if (aVisualizations[i].$AnnotationPath.indexOf(sLineItemPath) !== -1) {
								sLineItemPath = aVisualizations[i].$AnnotationPath;
								break;
							}
						}
					}
					return oModel.getMetaContext(oPresentationContext.getPath().split("@")[0] + sLineItemPath);
				}
				return oPresentationContext;
			},
			/**
			 * Get all fields from collection path.
			 *
			 * @param {string} sEntitySetPath Path of EntitySet
			 * @param {object} oMetaModel MetaModel instance
			 * @returns {Array} properties
			 */
			getCollectionFields: function(sEntitySetPath, oMetaModel) {
				var aProperties = [],
					oObj,
					oEntityType;
				oEntityType = oMetaModel.getObject(sEntitySetPath + "/");
				for (var sKey in oEntityType) {
					oObj = oEntityType[sKey];
					if (oObj && oObj.$kind === "Property") {
						aProperties.push({
							name: sKey,
							label: oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.Label"),
							type: oObj.$Type
						});
					}
				}
				return aProperties;
			},

			/**
			 * Creates and returns a select query with the selected fields from the parameters passed.
			 * @param {object} oCollection - Annotations related to the target collection
			 * @param {string} sOperationAvailableFields - Fields used as path in OperationAvaiable annotations for actions
			 * @param sNavigationAvailableFields - Fields used as path in NavigationAvailable annotations for IBN
			 * @param {Array} oPresentationVariant - Annotation related to com.sap.vocabularies.UI.v1.PresentationVariant
			 * @param sPresentationVariantPath
			 * @param {Array} aSemanticKeys - SemanticKeys included in the entity set
			 * @returns {string} select query having the selected fields from the parameters passed
			 */
			create$Select: function(
				oCollection,
				sOperationAvailableFields,
				sNavigationAvailableFields,
				oPresentationVariant,
				sPresentationVariantPath,
				aSemanticKeys
			) {
				var sPresentationVariantFields = TableHelper.addPresentationVariantToSelectQuery(
					oPresentationVariant,
					sPresentationVariantPath
				);

				var sSelectedFields =
					(sOperationAvailableFields ? sOperationAvailableFields : "") +
					(sOperationAvailableFields && sNavigationAvailableFields ? "," : "") +
					(sNavigationAvailableFields || "") +
					((sOperationAvailableFields || sNavigationAvailableFields) && sPresentationVariantFields ? "," : "") +
					sPresentationVariantFields;
				if (aSemanticKeys) {
					aSemanticKeys.forEach(function(oSemanticKey) {
						sSelectedFields += sSelectedFields ? "," + oSemanticKey.$PropertyPath : oSemanticKey.$PropertyPath;
					});
				}
				if (
					oCollection &&
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"] &&
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path
				) {
					var sRestriction = oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path;
					sSelectedFields += sSelectedFields ? "," + sRestriction : sRestriction;
				}
				return !sSelectedFields ? "" : ", $select: '" + sSelectedFields + "'";
			},

			/**
			 *
			 * Method to calculate the column minWidth for specific use cases.
			 *
			 * @function
			 * @name getColumnMinWidth
			 * @param {*} oAnnotations - Annotations of the field
			 * @param {string} sDataType - Datatype of the field
			 * @param {number} nMaxLength - Maximum length of the field
			 * @param {string} sDataFieldType - Type of the field
			 * @param {string} sFieldControl - Field control value
			 * @returns {number} - The column min width for specific conditions, otherwise a min width value is set by default.
			 */
			getColumnMinWidth: function(oAnnotations, sDataType, nMaxLength, sDataFieldType, sFieldControl) {
				var nWidth,
					bHasTextAnnotation = oAnnotations && oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.Text"),
					bIsUnitOrCurrency =
						typeof oAnnotations !== "undefined" &&
						(oAnnotations.hasOwnProperty("@Org.OData.Measures.V1.Unit") ||
							oAnnotations.hasOwnProperty("@Org.OData.Measures.V1.ISOCurrency"));
				if (sDataType === "Edm.String" && !bHasTextAnnotation && nMaxLength && nMaxLength < 10) {
					// Add additional .75 em (~12px) to avoid showing ellipsis in some cases!
					nMaxLength += 0.75;
					if (nMaxLength < 3) {
						// use a min width of 3em (default)
						nMaxLength = 3;
					}
					nWidth = nMaxLength;
				} else if (sDataType === "Edm.Decimal" && bIsUnitOrCurrency) {
					if (CommonHelper.getEditMode(oAnnotations, sDataFieldType, sFieldControl) !== "Display") {
						nWidth = 20;
					} else {
						nWidth = 12;
					}
				}
				if (nWidth) {
					return nWidth;
				} else {
					return 8;
				}
			},

			/**
			 *
			 * Method to get column's width if defined from manifest/customisation by annotations.
			 *
			 * There are issues when the cell in the column is a measure and has a UoM or currency associated to it
			 * In edit mode this results in two fields and that doesn't work very well for the cell and the fields get cut.
			 * So we are currently hardcoding width in several cases in edit mode where there are problems.
			 *
			 *
			 * @function
			 * @name getColumnWidth
			 * @param {string} sDefinedWidth - Defined width of the column, which is taken with priority if not null, undefined or empty
			 * @param {*} oAnnotations - Annotations of the field
			 * @param {string} sDataFieldType - Type of the field
			 * @param {string} sFieldControl - Field control value
			 * @param {string} sDataType - Datatype of the field
			 * @param {number} nTargetValueVisualization - Number for DataFieldForAnnotation Target Value (stars)
			 * @param {*} oDataField - Data Field
			 * @param {string} sDataFieldActionText - DataField's text from button
			 * @returns {string} - Column width if defined, otherwise width is set to auto
			 */
			getColumnWidth: function(
				sDefinedWidth,
				oAnnotations,
				sDataFieldType,
				sFieldControl,
				sDataType,
				nTargetValueVisualization,
				oDataField,
				sDataFieldActionText
			) {
				var sWidth,
					bHasTextAnnotation = false;
				if (sDefinedWidth) {
					return sDefinedWidth;
				} else if (
					sDataType === "Edm.Date" ||
					sDataType === "Edm.TimeOfDay" ||
					sDataFieldType === "Edm.Date" ||
					sDataFieldType === "Edm.TimeOfDay"
				) {
					sWidth = "10em";
				} else if (sDataType === "Edm.DateTimeOffset" || sDataFieldType === "Edm.DateTimeOffset") {
					sWidth = "14em";
				} else if (sDataType === "Edm.Boolean" || sDataFieldType === "Edm.Boolean") {
					sWidth = "8em";
				} else if (CommonHelper.getEditMode(oAnnotations, sDataFieldType, sFieldControl) === "Display") {
					bHasTextAnnotation = oAnnotations && oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.Text");
					if (
						sDataType === "Edm.Stream" &&
						!bHasTextAnnotation &&
						oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") &&
						oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/")
					) {
						sWidth = "7em";
					}
				} else if (
					oAnnotations &&
					((oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") &&
						oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") === true) ||
						(oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") &&
							oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/")))
				) {
					sWidth = "7em";
				} else if (
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
				) {
					var nTmpTextWidth, nTmpVisualizationWidth;

					// For FieldGroup having action buttons or visualization data points (as rating) on column.
					if (sDataFieldActionText && sDataFieldActionText.length >= oDataField.Label.length) {
						nTmpTextWidth = SizeHelper.getButtonWidth(sDataFieldActionText);
					} else if (oDataField) {
						nTmpTextWidth = SizeHelper.getButtonWidth(oDataField.Label);
					} else {
						nTmpTextWidth = SizeHelper.getButtonWidth(oAnnotations.Label);
					}
					if (nTargetValueVisualization) {
						//Each rating star has a width of 2em
						nTmpVisualizationWidth = nTargetValueVisualization * 2;
					}
					if (!isNaN(nTmpVisualizationWidth) && nTmpVisualizationWidth > nTmpTextWidth) {
						sWidth = nTmpVisualizationWidth + "em";
					} else if (
						sDataFieldActionText ||
						(oAnnotations &&
							(oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
								oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction"))
					) {
						// Add additional 2 em to avoid showing ellipsis in some cases.
						nTmpTextWidth += 2;
						sWidth = nTmpTextWidth + "em";
					}
				}
				if (sWidth) {
					return sWidth;
				} else {
					return "auto";
				}
			},
			/**
			 * Method to add a margin class at the end of control.
			 *
			 * @function
			 * @name getMarginClass
			 * @param {*} oCollection - DataPoint's Title
			 * @param {*} oDataField - DataPoint's Value
			 * @param sVisualization
			 * @returns {string} - returns classes for adjusting margin between controls.
			 */
			getMarginClass: function(oCollection, oDataField, sVisualization) {
				var bAllFalse = true;
				for (var i = 0; i < oCollection.length; i++) {
					if (
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== undefined &&
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== false
					) {
						bAllFalse = false;
					}
				}
				if (bAllFalse) {
					if (JSON.stringify(oCollection[oCollection.length - 1]) == JSON.stringify(oDataField)) {
						//If rating indicator is last element in fieldgroup, then the 0.5rem margin added by sapMRI class of interactive rating indicator on top and bottom must be nullified.
						if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
							return "sapUiNoMarginBottom sapUiNoMarginTop";
						}
						return "";
					} else {
						//If rating indicator is NOT the last element in fieldgroup, then to maintain the 0.5rem spacing between controls (as per UX spec),
						//only the top margin added by sapMRI class of interactive rating indicator must be nullified.
						if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
							return "sapUiNoMarginTop";
						}
						return "sapUiTinyMarginBottom";
					}
				} else {
					return undefined;
				}
			},

			getVBoxVisibility: function(oCollection) {
				var bAllStatic = true;
				var aHiddenPaths = [];
				for (var i = 0; i < oCollection.length; i++) {
					if (
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== undefined &&
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== false
					) {
						if (oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== true) {
							aHiddenPaths.push(oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"].$Path);
							bAllStatic = false;
						} else {
							aHiddenPaths.push(oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"]);
						}
					} else {
						aHiddenPaths.push(false);
					}
				}
				if (aHiddenPaths.length > 0 && bAllStatic !== true) {
					var sExpression = "{parts:[";
					for (var j = 0; j < aHiddenPaths.length; j++) {
						if (j !== aHiddenPaths.length - 1) {
							if (typeof aHiddenPaths[j] === "boolean") {
								sExpression = sExpression + "{value: '" + aHiddenPaths[j] + "'},";
							} else {
								sExpression = sExpression + "{path: '" + aHiddenPaths[j] + "'},";
							}
						} else {
							if (typeof aHiddenPaths[j] === "boolean") {
								sExpression =
									sExpression +
									"{value: '" +
									aHiddenPaths[j] +
									"'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}";
							} else {
								sExpression =
									sExpression +
									"{path: '" +
									aHiddenPaths[j] +
									"'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}";
							}
						}
					}
					return sExpression;
				} else if (aHiddenPaths.length > 0 && aHiddenPaths.indexOf(false) === -1 && bAllStatic) {
					return false;
				} else {
					return true;
				}
			},

			/**
			 * Method to prcovide Hidden filters to Table data.
			 *
			 * @function
			 * @name formatHiddenFilters
			 * @param {string} oHiddenFilter - hiddenFilters via context named filters (and key hiddenFilters) passed to Macro Table
			 * @returns {string} - returns stringify hidden filters
			 */
			formatHiddenFilters: function(oHiddenFilter) {
				if (oHiddenFilter) {
					try {
						return JSON.stringify(oHiddenFilter);
					} catch (ex) {
						return undefined;
					}
				}
				return undefined;
			},

			/**
			 * Method to get column stable ID.
			 *
			 * @function
			 * @name getColumnStableId
			 * @param {string} sId - Current Object id
			 * @param {object} oDataField - DataPoint's Value
			 * @returns {*} - returns string/undefined for column id
			 */
			getColumnStableId: function(sId, oDataField) {
				return sId
					? StableIdHelper.generate([
							sId,
							"C",
							(oDataField.Target && oDataField.Target.$AnnotationPath) ||
								(oDataField.Value && oDataField.Value.$Path) ||
								(oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
								oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction"
									? oDataField
									: "")
					  ])
					: undefined;
			},
			/**
			 * Method to row binding info.
			 * @function
			 * @name getRowsBindingInfo
			 * @param {object} oThis - Current object
			 * @param oCollection
			 * @param {string} sCollectionName - Name of collection
			 * @param {object} oTargetCollection - DataPoint's value
			 * @param {object} oLineItem - Line item value
			 * @param oNavigationAvailablePaths - Map containing all the NavigationAvailable paths
			 * @param {object} oPresentation - Presentation object
			 * @param sPresentationVariantPath
			 * @param {object} oSemanticKey - SemanticKey object
			 * @param {object} oTextLineItem - LineItem value from text properties
			 * @param {boolean} bEnableAnalytics - boolean to specify is this is an analytical table or not
			 * @returns {string} - Returns string
			 */
			getRowsBindingInfo: function(
				oThis,
				oCollection,
				sCollectionName,
				oTargetCollection,
				oLineItem,
				oNavigationAvailablePaths,
				oPresentation,
				sPresentationVariantPath,
				oSemanticKey,
				oTextLineItem,
				bEnableAnalytics
			) {
				var oRowBinding = {
					ui5object: true,
					suspended: false,
					path: CommonHelper.addSingleQuotes(
						(oCollection.$kind === "EntitySet" ? "/" : "") + (oThis.navigationPath || sCollectionName)
					),
					parameters: {
						$count: !bEnableAnalytics
					},
					events: {}
				};
				if (oTextLineItem && oLineItem !== "") {
					oLineItem = oLineItem + "," + oTextLineItem;
				} else if (oTextLineItem) {
					oLineItem = oTextLineItem;
				}
				var sSelect = TableHelper.create$Select(
					oTargetCollection,
					oLineItem,
					oNavigationAvailablePaths,
					oPresentation,
					sPresentationVariantPath,
					oSemanticKey
				);
				if (sSelect) {
					oRowBinding.parameters.$select = sSelect.split(": ")[1];
				}
				oRowBinding.parameters.$$groupId = CommonHelper.addSingleQuotes("$auto.Workers");
				oRowBinding.parameters.$$updateGroupId = CommonHelper.addSingleQuotes("$auto");
				if (oThis.onPatchSent) {
					oRowBinding.events.patchSent = CommonHelper.addSingleQuotes(oThis.onPatchSent);
				}
				if (oThis.onPatchCompleted) {
					oRowBinding.events.patchCompleted = CommonHelper.addSingleQuotes(oThis.onPatchCompleted);
				}
				if (oThis.onDataReceived) {
					oRowBinding.events.dataReceived = CommonHelper.addSingleQuotes(oThis.onDataReceived);
				}
				if (oThis.onContextChange) {
					oRowBinding.events.change = CommonHelper.addSingleQuotes(oThis.onContextChange);
				}
				return CommonHelper.objectToString(oRowBinding);
			},
			/**
			 * Method to filter line items for columns.
			 *
			 * @function
			 * @name filterLineItemsForColumn
			 * @param {object} oDataField - DataPoint's Value
			 * @param {boolean} bIsBound - DataPoint action bound
			 * @returns {boolean} - returns boolean
			 */
			filterLineItemsForColumn: function(oDataField, bIsBound) {
				return (
					(!oDataField.Action && !oDataField.SemanticObject && !oDataField.Inline) ||
					(oDataField.Inline &&
						((bIsBound && oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") ||
							oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")) ||
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath"
				);
			},

			/**
			 * Method to get Creation row applyEnabled property.
			 *
			 * @function
			 * @name creationRowApplyEnabled
			 * @param {object} oThis - Current Object
			 * @param {object} oCollection - Annotations related to the target collection
			 * @param {string} sCollectionName - Name of collection
			 * @param {object} oParentEntitySet - Annotations related to the parent entitySet
			 * @param {object} oTargetCollection - Annotations related to the target collection
			 * @returns {*} - returns boolean/string(expression) for creation row applyEnabled
			 */
			creationRowApplyEnabled: function(oThis, oCollection, sCollectionName, oParentEntitySet, oTargetCollection) {
				var sExpressionInsertable = AnnotationHelper.getNavigationInsertableRestrictions(
					oCollection,
					sCollectionName,
					oParentEntitySet,
					oTargetCollection,
					true
				);
				if (
					typeof sExpressionInsertable === "string" &&
					(oThis.disableAddRowButtonForEmptyData === "true" || oThis.disableAddRowButtonForEmptyData === true)
				) {
					sExpressionInsertable = sExpressionInsertable.substring(0, sExpressionInsertable.length - 1);
					return (
						sExpressionInsertable +
						" && ${path: 'creationRowFieldValidity' , model: 'internal', formatter: 'RUNTIME.validateCreationRowFields'}}"
					);
				}
				return sExpressionInsertable;
			},

			/**
			 * Method to get Creation row visible property.
			 *
			 * @function
			 * @name creationRowVisible
			 * @param {*} showCreate - Boolean or expression for table showCreate property
			 * @param {string} sCollectionName - CollectionName
			 * @returns {*} - returns string(expression) for creation row visible
			 */
			creationRowVisible: function(showCreate, sCollectionName) {
				if (showCreate && showCreate === "{=  ${ui>/editMode} === 'Editable'}") {
					return showCreate;
				} else {
					return showCreate.replace(sCollectionName + "/", "");
				}
			},
			/**
			 * Method to check Creation row fields validity.
			 *
			 * @function
			 * @name validateCreationRowFields
			 * @param {object} oFieldValidityObject - Current Object holding the fields
			 * @returns {*} - returns boolean
			 */
			validateCreationRowFields: function(oFieldValidityObject) {
				if (!oFieldValidityObject) {
					return false;
				}
				return (
					Object.keys(oFieldValidityObject).length > 0 &&
					Object.keys(oFieldValidityObject).every(function(key) {
						return oFieldValidityObject[key]["validity"];
					})
				);
			},
			/**
			 * Method to get press event expression for DataFieldForActionButton.
			 *
			 * @function
			 * @name pressEventDataFieldForActionButton
			 * @param {object} oThis - Current Object
			 * @param {object} oDataField - DataPoint's Value
			 * @param {string} sEntitySetName - EntitySet name
			 * @param {string} sOperationAvailableMap - OperationAvailableMap Stringified JSON object
			 * @param {object} oActionContext - Action object
			 * @param {bool} bIsNavigable - Action is navigable or not
			 * @param {bool} bEnableAutoScroll - this action will trigger a scroll to the newly created items for the related table
			 * @returns {string} - returns expression for DataFieldForActionButton
			 */
			pressEventDataFieldForActionButton: function(
				oThis,
				oDataField,
				sEntitySetName,
				sOperationAvailableMap,
				oActionContext,
				bIsNavigable,
				bEnableAutoScroll
			) {
				var bStaticAction, oContext;
				bStaticAction = this._isStaticAction(oActionContext, oDataField.Action, oThis && oThis.collection.getObject("$Type"));

				oContext = "${internal>selectedContexts}";
				var sInvocationGrouping =
					oDataField.InvocationGrouping &&
					oDataField.InvocationGrouping.$EnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"
						? "ChangeSet"
						: "Isolated";

				var oParams = {
					contexts: oContext,
					bStaticAction: bStaticAction ? bStaticAction : undefined,
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGrouping),
					prefix: CommonHelper.addSingleQuotes(oThis.id),
					operationAvailableMap: CommonHelper.addSingleQuotes(sOperationAvailableMap),
					model: "${$source>/}.getModel()",
					label: CommonHelper.addSingleQuotes(oDataField.Label),
					applicableContext: "${internal>dynamicActions/" + oDataField.Action + "/aApplicable/}",
					notApplicableContext: "${internal>dynamicActions/" + oDataField.Action + "/aNotApplicable/}",
					isNavigable: bIsNavigable,
					enableAutoScroll: bEnableAutoScroll
				};

				return CommonHelper.generateFunction(
					".editFlow.invokeAction",
					CommonHelper.addSingleQuotes(oDataField.Action),
					CommonHelper.objectToString(oParams)
				);
			},
			/**
			 * Method to get enabled expression for DataFieldForActionButton.
			 *
			 * @function
			 * @name isDataFieldForActionEnabled
			 * @param {object} oThis - Current Object
			 * @param {object} oDataField - DataPoint's Value
			 * @param {object} oRequiresContext - RequiresContext for IBN
			 * @param {boolean} bIsDataFieldForIBN - Flag for IBN
			 * @param {object} oActionContext - Action object
			 * @param {string} vActionEnabled - Action Enabled for single or multi select
			 * @returns {*} - returns boolean/string value
			 */
			isDataFieldForActionEnabled: function(oThis, oDataField, oRequiresContext, bIsDataFieldForIBN, oActionContext, vActionEnabled) {
				var bStaticAction = this._isStaticAction(oActionContext, oDataField.Action, oThis && oThis.collection.getObject("$Type"));
				var isAnalyticalTable =
					oThis &&
					oThis.tableDefinition &&
					oThis.tableDefinition.getObject() &&
					oThis.tableDefinition.getObject().enableAnalytics;
				if (!oRequiresContext || bStaticAction) {
					if (bIsDataFieldForIBN) {
						var sEntitySet = oThis.collection.getPath();
						var oMetaModel = oThis.collection.getModel();
						if (vActionEnabled === "false" && !isAnalyticalTable) {
							Log.warning("NavigationAvailable as false is incorrect usage");
							return false;
						} else if (
							!isAnalyticalTable &&
							oDataField &&
							oDataField.NavigationAvailable &&
							oDataField.NavigationAvailable.$Path &&
							oMetaModel.getObject(sEntitySet + "/$Partner") === oDataField.NavigationAvailable.$Path.split("/")[0]
						) {
							return "{= ${" + vActionEnabled.substr(vActionEnabled.indexOf("/") + 1, vActionEnabled.length) + "}";
						} else {
							return true;
						}
					}
					return true;
				}

				var sDataFieldForActionEnabledExpression = "",
					sNumberOfSelectedContexts,
					sAction;
				if (bIsDataFieldForIBN) {
					if (vActionEnabled === "true" || isAnalyticalTable) {
						sDataFieldForActionEnabledExpression = "%{internal>numberOfSelectedContexts} >= 1";
					} else if (vActionEnabled === "false") {
						Log.warning("NavigationAvailable as false is incorrect usage");
						return false;
					} else {
						sNumberOfSelectedContexts = "%{internal>numberOfSelectedContexts} >= 1";
						sAction = "${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/bEnabled" + "}";
						sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
					}
				} else {
					if (vActionEnabled === "single") {
						sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} === 1";
					} else {
						sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} > 0";
					}
					sAction = "${internal>dynamicActions/" + oDataField.Action + "/bEnabled" + "}";
					sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
				}
				return "{= " + sDataFieldForActionEnabledExpression + "}";
			},
			/**
			 * Method to get press event expression for CreateButton.
			 *
			 * @function
			 * @name pressEventForCreateButton
			 * @param {object} oThis - Current Object
			 * @param {boolean} bCmdExecutionFlag - Flag to indicate that the function is called from CMD Execution
			 * @returns {string} - returns expression for CreateButton
			 */
			pressEventForCreateButton: function(oThis, bCmdExecutionFlag) {
				var sCreationMode = oThis.creationMode,
					oParams,
					sMdcTable = bCmdExecutionFlag ? "${$source>}.getParent()" : "${$source>}.getParent().getParent().getParent()",
					sRowBinding = sMdcTable + ".getRowBinding() || " + sMdcTable + ".data('rowsBindingInfo').path";

				switch (sCreationMode) {
					case CreationMode.External:
						// navigate to external target for creating new entries
						// TODO: Add required parameters
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(CreationMode.External),
							outbound: CommonHelper.addSingleQuotes(oThis.createOutbound)
						};
						break;

					case CreationMode.CreationRow:
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(CreationMode.CreationRow),
							creationRow: "${$source>}",
							createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false
						};

						sRowBinding = "${$source>}.getParent()._getRowBinding()";
						break;

					case CreationMode.NewPage:
					case CreationMode.Inline:
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(sCreationMode),
							createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false,
							tableId: CommonHelper.addSingleQuotes(oThis.id)
						};

						if (oThis.createNewAction) {
							oParams.newAction = CommonHelper.addSingleQuotes(oThis.createNewAction);
						}
						break;

					default:
						// unsupported
						return undefined;
				}
				return CommonHelper.generateFunction(".editFlow.createDocument", sRowBinding, CommonHelper.objectToString(oParams));
			},

			pasteEvent: function(oThis) {
				if (!oThis.onPaste) {
					return undefined;
				}
				var sCreateAtEnd = oThis.createAtEnd,
					createAtEnd = sCreateAtEnd !== undefined ? sCreateAtEnd : false;
				return CommonHelper.generateFunction(oThis.onPaste, "$event", createAtEnd);
			},

			getIBNData: function(oThis) {
				var outboundDetail = oThis.createOutboundDetail;
				if (outboundDetail) {
					var oIBNData = {
						semanticObject: CommonHelper.addSingleQuotes(outboundDetail.semanticObject),
						action: CommonHelper.addSingleQuotes(outboundDetail.action)
					};
					return CommonHelper.objectToString(oIBNData);
				}
			},

			/**
			 * Method to get enabled expression for CreateButton.
			 *
			 * @function
			 * @name isCreateButtonEnabled
			 * @param {object} oCollection - Annotations related to the target collection
			 * @param {string} sCollectionName - Collection name
			 * @param {string} sRestrictedProperties - RestrictedProperties of parentEntitySet
			 * @param {string} sInsertable - Insertable of target collection
			 * @returns {string} - returns expression for enable create button
			 */
			isCreateButtonEnabled: function(oCollection, sCollectionName, sRestrictedProperties, sInsertable) {
				var bIsEntitySet = oCollection.$kind === "EntitySet";
				return bIsEntitySet
					? undefined
					: AnnotationHelper.getNavigationInsertableRestrictions(
							oCollection,
							sCollectionName,
							sRestrictedProperties,
							sInsertable,
							false
					  );
			},
			/**
			 * Method to get press event expression for DeleteButton.
			 *
			 * @function
			 * @name pressEventForDeleteButton
			 * @param {object} oThis - Current Object
			 * @param {string} sEntitySetName - EntitySet name
			 * @returns {string} - returns expression for DeleteButton
			 */
			pressEventForDeleteButton: function(oThis, sEntitySetName) {
				var sDeletableContexts = "${internal>deletableContexts}";

				var oParams = {
					id: CommonHelper.addSingleQuotes(oThis.id),
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					numberOfSelectedContexts: "${internal>selectedContexts}.length",
					unSavedContexts: "${internal>unSavedContexts}",
					lockedContexts: "${internal>lockedContexts}",
					controlId: "${internal>controlId}"
				};

				return CommonHelper.generateFunction(
					".editFlow.deleteMultipleDocuments",
					sDeletableContexts,
					CommonHelper.objectToString(oParams)
				);
			},
			/**
			 * Method to get enabled expression for DeleteButton.
			 *
			 * @function
			 * @name isDeleteButtonEnabled
			 * @param {object} oThis - Current Object
			 * @returns {string} - returns expression for enable delete button
			 */
			isDeleteButtonEnabled: function(oThis) {
				var sDeletableContexts = "%{internal>deletableContexts}",
					sNumberOfDeletableContexts = sDeletableContexts + ".length > 0",
					sDeletableContextsCheck = "(" + sDeletableContexts + " && " + sNumberOfDeletableContexts + ")",
					sUnSavedContexts = "%{internal>unSavedContexts}",
					sNumberOfUnSavedContexts = sUnSavedContexts + ".length > 0",
					sUnSavedContextsCheck = "(" + sUnSavedContexts + " && " + sNumberOfUnSavedContexts + ")",
					sDeleteEnabledCheck = "(" + sDeletableContextsCheck + " || " + sUnSavedContextsCheck + ")",
					sDeleteEnabled = "%{internal>deleteEnabled}",
					sNumberOfSelectedContext = "%{internal>numberOfSelectedContexts}",
					bParentEntityDeleteEnabled = oThis.parentEntityDeleteEnabled;
				var sExpression;
				if (bParentEntityDeleteEnabled === "true") {
					//return true
					sExpression = "{= " + sNumberOfSelectedContext + " ? " + true + " : false}";
				} else if (bParentEntityDeleteEnabled !== "false" && typeof bParentEntityDeleteEnabled === "string") {
					//parent entity set expression is there
					sExpression = "{= " + sNumberOfSelectedContext + " ? " + bParentEntityDeleteEnabled + ": false}";
				} else {
					//NO retriction applied / current entity set binding
					sExpression = "{= " + sDeleteEnabledCheck + " ? " + sDeleteEnabled + " : false}";
				}
				return sExpression;
			},

			/**
			 * Method to handles table's delete button's enable and disable state if requested in side effect.
			 * @function
			 *
			 * @name handleTableDeleteEnablementForSideEffects
			 * @param {object} oTable - Table instance
			 * @param {object} oInternalModelContext - internal model context
			 */
			handleTableDeleteEnablementForSideEffects: function(oTable, oInternalModelContext) {
				if (oTable && oInternalModelContext) {
					var sDeletablePath = TableHelper.getDeletablePathForTable(oTable),
						aSelectedContexts = oTable.getSelectedContexts(),
						aDeletableContexts = [],
						aExistingDeletableContext = oInternalModelContext.getProperty("deletableContexts") || [];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						if (typeof sDeletablePath === "string" && sDeletablePath !== undefined) {
							var oSelectedContext = aSelectedContexts[i];
							if (oSelectedContext && oSelectedContext.getProperty(sDeletablePath)) {
								oInternalModelContext.setProperty("deleteEnabled", true);
								aDeletableContexts.push(oSelectedContext);
							} else {
								oInternalModelContext.setProperty("deleteEnabled", false);
							}
						}
					}
					if (!aExistingDeletableContext.length && aDeletableContexts.length > 0) {
						oInternalModelContext.setProperty("deletableContexts", aDeletableContexts);
					}
				}
			},

			/**
			 * Method to get the delete restricitions Path associated.
			 *
			 * @function
			 * @name getDeletablePathForTable
			 * @param {object} oTable - Table instance
			 * @returns {string} path associated with delete's enable and disable
			 */
			getDeletablePathForTable: function(oTable) {
				var oMetamodel = oTable && oTable.getModel() && oTable.getModel().getMetaModel(),
					sPath = oTable.getRowBinding() && oTable.getRowBinding().getPath();
				if (oMetamodel && oTable && !oMetamodel.getObject(sPath)) {
					var sContextPath =
							oTable.getRowBinding() &&
							oTable.getRowBinding().getContext() &&
							oTable
								.getRowBinding()
								.getContext()
								.getPath(),
						sMetaPath = oMetamodel.getMetaPath(sContextPath);
					sPath =
						oMetamodel.getObject(sMetaPath) &&
						oMetamodel.getObject(sMetaPath)["$NavigationPropertyBinding"] &&
						oMetamodel.getObject(sMetaPath)["$NavigationPropertyBinding"][sPath];
					sPath = "/" + sPath;
				}
				var oDeletablePath = oMetamodel && oMetamodel.getObject(sPath + "@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable");
				return oDeletablePath && oDeletablePath.$Path;
			},

			/**
			 * Method to get press event expression for Paste button.
			 *
			 * @function
			 * @name pressEventForPasteButton
			 * @param {object} oThis - Current Object
			 * @returns {string} - returns expression for DeleteButton
			 */
			pressEventForPasteButton: function(oThis) {
				var sMdcTable = "${$source>}.getParent().getParent().getParent()";
				return CommonHelper.generateFunction(oThis.onPasteButtonPressed, sMdcTable);
			},

			/**
			 * Method to get enabled expression for DeleteButton.
			 *
			 * @function
			 * @name isDeleteButtonEnabled
			 * @param {object} oDataField - DataPoint's Value
			 * @returns {boolean} - returns boolean to value for DataFieldForAction & DataFieldForIntentBasedNavigation
			 */
			filterLineItems: function(oDataField) {
				return (
					oDataField.Inline !== true &&
					oDataField.Determining !== true &&
					oDataField["@com.sap.vocabularies.UI.v1.Hidden"] !== true
				);
			},
			getHiddenPathExpressionForTableActionsAndIBN: function(sHiddenPath, oDetails) {
				var oContext = oDetails.context,
					sPropertyPath = oContext.getPath(),
					sEntitySetPath = ODataModelAnnotationHelper.getNavigationPath(sPropertyPath);
				if (sHiddenPath.indexOf("/") > 0) {
					var aSplitHiddenPath = sHiddenPath.split("/");
					var sNavigationPath = aSplitHiddenPath[0];
					// supports visiblity based on the property from the partner association
					if (oContext.getObject(sEntitySetPath + "/$Partner") === sNavigationPath) {
						return "{= !%{" + aSplitHiddenPath.slice(1).join("/") + "} }";
					}
					// any other association will be ignored and the button will be made visible
				}
				return true;
			},

			/**
			 * Method to get visible expression for MenuButton.
			 *
			 * @function
			 * @name getHiddenPathExpressionForTableMenuActions
			 * @param {string} sHiddenPath - Hidden Path value
			 * @param {object} oDetails - Current Object
			 * @returns {boolean} - returns expression for visible property of menu button inside table
			 */
			getHiddenPathExpressionForTableMenuActions: function(sHiddenPath, oDetails) {
				var sEntityPath = oDetails.contextPath.getPath();
				var sPartnerProperty;
				if (oDetails.navigationPath) {
					//Check for partner property
					sPartnerProperty = oDetails.contextPath.getObject(sEntityPath + oDetails.navigationPath).$Partner;
				}
				if (sHiddenPath !== "true" && sHiddenPath !== "false" && sPartnerProperty) {
					//if hidden path is not static
					var conditions = sHiddenPath.split("||");
					var combinedConditions = [];
					for (var i = 0; i < conditions.length; i++) {
						var splitPath = conditions[i].split("/"); //separate partner property and condition property
						if (splitPath.length > 1) {
							var sPartner = splitPath[0].replace(/[^a-zA-Z ]/g, "").trim();
							if (sPartner === sPartnerProperty) {
								var sProperty = conditions[i].split("/")[1].split("}")[0];
								sProperty = "!%{" + sProperty + "} ";
								combinedConditions.push(sProperty);
							}
						}
					}
					if (combinedConditions.length) {
						combinedConditions = "{= " + combinedConditions.join(" || ") + " }";
						return combinedConditions;
					} else {
						return true;
					}
				}
				return sHiddenPath;
			},

			isMenuButtonEnabled: function(oContext, aMenuActions, oThis, vActionEnabled) {
				var combinedConditions = [];
				for (var i = 0; i < aMenuActions.length; i++) {
					var oMenuItemAction = aMenuActions[i],
						oTargetCollection = oThis.collection;
					if (oMenuItemAction.enabled) {
						// Handles default type scenario as well
						return true;
					} else if (oMenuItemAction.type === "ForAction" || oMenuItemAction.type === "ForNavigation") {
						var oDataField = oTargetCollection.getModel().getObject(oMenuItemAction.annotationPath);
						var sDataFieldEnabledExp = "";
						if (oMenuItemAction.type === "ForAction") {
							var oActionContext = oTargetCollection.getModel().getObject(oTargetCollection.sPath + "/" + oDataField.Action),
								oRequiresContext = oActionContext[0].$IsBound;
							sDataFieldEnabledExp = TableHelper.isDataFieldForActionEnabled(
								oThis,
								oDataField,
								oRequiresContext,
								undefined,
								oActionContext,
								vActionEnabled
							);
						} else if (oMenuItemAction.type === "ForNavigation") {
							var oRequiresContext = oDataField.RequiresContext,
								oContext = oTargetCollection.getModel().createBindingContext(oMenuItemAction.annotationPath),
								navigationAvailable = ODataModelAnnotationHelper.value(oDataField.NavigationAvailable, {
									context: oContext
								});
							sDataFieldEnabledExp = TableHelper.isDataFieldForActionEnabled(
								oThis,
								oDataField,
								oRequiresContext,
								true,
								undefined,
								navigationAvailable
							);
						}
						if (sDataFieldEnabledExp === true) {
							return true;
						} else {
							if (sDataFieldEnabledExp.split("{=").length > 0) {
								sDataFieldEnabledExp = sDataFieldEnabledExp.split("{=")[1].slice(0, -1);
							}
							combinedConditions.push("(" + sDataFieldEnabledExp + ")");
						}
					}
				}
				return combinedConditions.length > 0 ? "{= " + combinedConditions.join(" || ") + "}" : false;
			},

			/**
			 * Method to set visibility of column header label.
			 *
			 * @function
			 * @name setHeaderLabelVisibility
			 * @param {object} datafield - DataField
			 * @param {object} dataFieldCollection - List of items inside a fieldgroup (if any)
			 * @returns {boolean} - returns boolean true ff header label needs to be visible else false.
			 */
			setHeaderLabelVisibility: function(datafield, dataFieldCollection) {
				// If Inline button/navigation action, return false, else true;
				if (!dataFieldCollection) {
					if (datafield.$Type.indexOf("DataFieldForAction") > -1 && datafield.Inline) {
						return false;
					}
					if (datafield.$Type.indexOf("DataFieldForIntentBasedNavigation") > -1 && datafield.Inline) {
						return false;
					}
					return true;
				}

				// In Fieldgroup, If NOT all datafield/datafieldForAnnotation exists with hidden, return true;
				return dataFieldCollection.some(function(oDC) {
					if (
						(oDC.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
							oDC.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") &&
						oDC["@com.sap.vocabularies.UI.v1.Hidden"] !== true
					) {
						return true;
					}
				});
			},

			/**
			 * Method to get Target Value (# of stars) from Visualization Rating.
			 *
			 * @function
			 * @name getValueOnRatingField
			 * @param {object} oDataField - DataPoint's Value
			 * @param {object} oContext - context object of the LineItem
			 * @returns {number} - returns number for DataFieldForAnnotation Target Value
			 */
			getValueOnRatingField: function(oDataField, oContext) {
				// for FieldGroup containing visualizationTypeRating
				if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
					// For a data field having Rating as visualization type
					if (
						oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 &&
						oContext.context.getObject("Target/$AnnotationPath/$Type") == "com.sap.vocabularies.UI.v1.DataPointType" &&
						oContext.context.getObject("Target/$AnnotationPath/Visualization/$EnumMember") ==
							"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
					) {
						return oContext.context.getObject("Target/$AnnotationPath/TargetValue");
					}
					// for FieldGroup having Rating as visualization type in any of the data fields
					if (oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
						var sPathDataFields = "Target/$AnnotationPath/Data/";
						for (var i in oContext.context.getObject(sPathDataFields)) {
							if (
								oContext.context.getObject(sPathDataFields + i + "/$Type") ===
									"com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
								oContext.context
									.getObject(sPathDataFields + i + "/Target/$AnnotationPath")
									.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 &&
								oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/$Type") ==
									"com.sap.vocabularies.UI.v1.DataPointType" &&
								oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/Visualization/$EnumMember") ==
									"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
							) {
								return oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/TargetValue");
							}
						}
					}
				}
			},
			/**
			 * Method to get Text from DataFieldForAnnotation into Column.
			 *
			 * @function
			 * @name getTextOnActionField
			 * @param {object} oDataField - DataPoint's Value
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - returns string from label refering to action text
			 */
			getTextOnActionField: function(oDataField, oContext) {
				if (
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
				) {
					return oDataField.Label;
				}
				// for FieldGroup containing DataFieldForAnnotation
				if (
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
					oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1
				) {
					var sPathDataFields = "Target/$AnnotationPath/Data/";
					for (var i in oContext.context.getObject(sPathDataFields)) {
						if (
							oContext.context.getObject(sPathDataFields + i + "/$Type") ===
								"com.sap.vocabularies.UI.v1.DataFieldForAction" ||
							oContext.context.getObject(sPathDataFields + i + "/$Type") ===
								"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
						) {
							return oContext.context.getObject(sPathDataFields + i + "/Label");
						}
					}
				}
			},
			_getResponsiveTableColumnSettings: function(oThis, oColumn) {
				if (oThis.tableType === "ResponsiveTable") {
					return oColumn.settings;
				}
				return null;
			},

			getChartSize: function(oThis, oColumn) {
				var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);
				if (settings && settings.microChartSize) {
					return settings.microChartSize;
				}
				return "XS";
			},
			getChartRenderLabels: function(oThis, oColumn) {
				var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);
				if (settings && settings.showMicroChartLabel) {
					return settings.showMicroChartLabel;
				}
				return false;
			},
			getDelegate: function(bEnableAnalytics, bIsAlp, sEntityName) {
				var oDelegate;
				if (bIsAlp === "true") {
					oDelegate = {
						name: bEnableAnalytics
							? "sap/fe/macros/table/delegates/AnalyticalALPTableDelegate"
							: "sap/fe/macros/table/delegates/ALPTableDelegate",
						payload: {
							collectionName: sEntityName
						}
					};
				} else {
					oDelegate = {
						name: bEnableAnalytics
							? "sap/fe/macros/table/delegates/AnalyticalTableDelegate"
							: "sap/fe/macros/table/delegates/TableDelegate"
					};
				}

				return JSON.stringify(oDelegate);
			},
			setIBNEnablement: function(oInternalModelContext, oNavigationAvailableMap, aSelectedContexts) {
				for (var sKey in oNavigationAvailableMap) {
					oInternalModelContext.setProperty("ibn/" + sKey, {
						bEnabled: false,
						aApplicable: [],
						aNotApplicable: []
					});
					var aApplicable = [],
						aNotApplicable = [];
					var sProperty = oNavigationAvailableMap[sKey];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						if (oSelectedContext.getObject(sProperty)) {
							oInternalModelContext
								.getModel()
								.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/bEnabled", true);
							aApplicable.push(oSelectedContext);
						} else {
							aNotApplicable.push(oSelectedContext);
						}
					}
					oInternalModelContext
						.getModel()
						.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/aApplicable", aApplicable);
					oInternalModelContext
						.getModel()
						.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/aNotApplicable", aNotApplicable);
				}
			}
		};

		TableHelper.getOperationAvailableMap.requiresIContext = true;
		TableHelper.getNavigationAvailableMap.requiresIContext = true;
		TableHelper.addOperationAvailableFieldsToSelectQuery.requiresIContext = true;
		TableHelper.addNavigationAvailableFieldsToSelectQuery.requiresIContext = true;
		TableHelper.addFieldsHavingTextArrangementToSelectQuery.requiresIContext = true;
		TableHelper.getValueOnRatingField.requiresIContext = true;
		TableHelper.getTextOnActionField.requiresIContext = true;
		TableHelper.isMenuButtonEnabled.requiresIContext = true;
		return TableHelper;
	},
	/* bExport= */ true
);
