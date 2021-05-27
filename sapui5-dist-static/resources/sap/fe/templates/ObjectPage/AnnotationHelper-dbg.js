/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/ui/base/ManagedObject",
		"sap/base/util/JSTokenizer",
		"sap/base/util/merge",
		"sap/base/strings/formatMessage",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/field/FieldHelper",
		"sap/fe/macros/CommonHelper"
	],
	function(Log, ODataModelAnnotationHelper, ManagedObject, JSTokenizer, merge, formatMessage, CommonUtils, FieldHelper, CommonHelper) {
		"use strict";

		/*
	 This class contains annotation helpers that might be used from several templates or controls
	 */

		var AnnotationHelper = {
			buildExpressionForProgressIndicatorPercentValue: function(oInterface, dataPoint, mUoM) {
				var sPercentValueExpression = "0";
				var sExpressionTemplate;
				var oModel = oInterface.getModel(1);
				var oBindingContext = oModel.createBindingContext("/");

				if (dataPoint.Value && dataPoint.Value.$Path) {
					// Value is mandatory and it must be a path
					var valuePath = ODataModelAnnotationHelper.value(dataPoint.Value, { context: oBindingContext });
					var sValue = "$" + valuePath; // Value is expected to be always a path. ${Property}
					var sTarget;
					if (dataPoint.TargetValue) {
						// Target can be a path or Edm Primitive Type
						sTarget = ODataModelAnnotationHelper.value(dataPoint.TargetValue, { context: oBindingContext });
						if (dataPoint.TargetValue.$Path) {
							sTarget = "$" + sTarget;
						}
					}
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
				}
				return sPercentValueExpression;
			},

			buildExpressionForProgressIndicatorDisplayValue: function(oInterface, dataPoint, mUoM) {
				var oModel = oInterface.getModel(1);
				var oBindingContext = oModel.createBindingContext("/");
				var aParts = [];
				aParts.push(ODataModelAnnotationHelper.value(dataPoint.Value, { context: oBindingContext }));
				aParts.push(ODataModelAnnotationHelper.value(dataPoint.TargetValue, { context: oBindingContext }));
				aParts.push(mUoM);
				var sDisplayValue = AnnotationHelper.formatDisplayValue(aParts);
				return sDisplayValue;
			},

			/**
			 * This function is meant to run at runtime, so the control and resource bundle can be available.
			 *
			 * @private
			 * @param {string[]} aParts
			 * param {string} sValue A string containing the value
			 * param {string} sTarget A string containing the target value
			 * param {string} sUoM A string containing the unit of measure
			 * @returns {string} A string containing the text that will be used in the display value of the Progress Indicator
			 */
			formatDisplayValue: function(aParts) {
				var sDisplayValue = "",
					sValue = aParts[0],
					sTarget = aParts[1],
					sUoM = aParts[2];

				if (sValue) {
					return sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.templates", true)
						.then(function(oResourceBundle) {
							if (sUoM) {
								if (sUoM === "%") {
									// uom.String && uom.String === '%'
									sDisplayValue = oResourceBundle.getText(
										"T_ANNOTATION_HELPER_PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_PERCENT",
										[sValue]
									);
								} else {
									// (uom.String and not '%') or uom.Path
									if (sTarget) {
										sDisplayValue = oResourceBundle.getText(
											"T_ANNOTATION_HELPER_PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT",
											[sValue, sTarget, sUoM]
										);
									} else {
										sDisplayValue = oResourceBundle.getText(
											"T_ANNOTATION_HELPER_PROGRESS_INDICATOR_DISPLAY_VALUE_UOM_IS_NOT_PERCENT_NO_TARGET_VALUE",
											[sValue, sUoM]
										);
									}
								}
							} else if (sTarget) {
								sDisplayValue = oResourceBundle.getText("T_COMMON_PROGRESS_INDICATOR_DISPLAY_VALUE_NO_UOM", [
									sValue,
									sTarget
								]);
							} else {
								sDisplayValue = sValue;
							}
							return sDisplayValue;
						});
				} else {
					// Cannot do anything
					Log.warning("Value property is mandatory, the default (empty string) will be returned");
				}
			},

			buildExpressionForCriticality: function(dataPoint) {
				var sFormatCriticalityExpression = sap.ui.core.ValueState.None;
				var sExpressionTemplate;
				var oCriticalityProperty = dataPoint.Criticality;

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
			buildRatingIndicatorSubtitleExpression: function(oContext, mSampleSize) {
				if (mSampleSize) {
					return sap.fe.templates.ObjectPage.AnnotationHelper.formatRatingIndicatorSubTitle(
						ODataModelAnnotationHelper.value(mSampleSize, { context: oContext })
					);
				}
			},
			/**
			 * This function is used to get the header text of rating indicator.
			 * @param oContext
			 * @param oDataPoint
			 * @function param {object} oContext context of interface
			 * param {object} oDataPoint data point object
			 * @returns {string} Expression binding for rating indicator text
			 */
			getHeaderRatingIndicatorText: function(oContext, oDataPoint) {
				if (oDataPoint && oDataPoint.SampleSize) {
					return AnnotationHelper.buildRatingIndicatorSubtitleExpression(oContext, oDataPoint.SampleSize);
				} else if (oDataPoint && oDataPoint.Description) {
					var sModelValue = ODataModelAnnotationHelper.value(oDataPoint.Description, { context: oContext });
					return "${path:" + sModelValue + "}";
				}
			},
			// returns the text for the Rating Indicator Subtitle (e.g. '7 reviews')
			formatRatingIndicatorSubTitle: function(iSampleSizeValue) {
				if (iSampleSizeValue) {
					return sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.templates", true)
						.then(function(oResourceBundle) {
							var sSubTitleLabel =
								iSampleSizeValue > 1
									? oResourceBundle.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL_PLURAL")
									: oResourceBundle.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE_LABEL");
							return oResourceBundle.getText("T_ANNOTATION_HELPER_RATING_INDICATOR_SUBTITLE", [
								iSampleSizeValue,
								sSubTitleLabel
							]);
						});
				}
			},

			getElementBinding: function(sPath) {
				var sNavigationPath = ODataModelAnnotationHelper.getNavigationPath(sPath);
				if (sNavigationPath) {
					return "{path:'" + sNavigationPath + "'}";
				} else {
					//no navigation property needs empty object
					return "{path: ''}";
				}
			},
			/**
			 * Function to get the visibility for the Delete button in case of Delete Hidden.
			 *
			 * @param {object} [oDeleteHidden] Entity Set delete hidden value.
			 * @param {string} [sDeleteHiddenInEntityType] Entity Type delete hidden value.
			 * @returns {string} Returns expression binding or boolean value based on oDeleteHidden
			 */
			getButtonVisiblityForDeleteHidden: function(oDeleteHidden, sDeleteHiddenInEntityType) {
				if (oDeleteHidden) {
					return oDeleteHidden === "false"
						? "{= (${ui>/editMode} === 'Editable')}"
						: "{= (${ui>/editMode} === 'Editable') &&  !$" + oDeleteHidden + "}";
				} else if (sDeleteHiddenInEntityType) {
					return sDeleteHiddenInEntityType === "false"
						? "{= (${ui>/editMode} === 'Editable')}"
						: "{= (${ui>/editMode} === 'Editable') &&  !$" + sDeleteHiddenInEntityType + "}";
				} else {
					return "{= (${ui>/editMode} === 'Editable')}";
				}
			},
			/**
			 * Function to get the visibility for the Delete button in the object page/sub-object page.
			 *
			 * @param {object} [oDeletable] Current Entity Set delete restriction value.
			 * @param {number} [viewLevel] view level to differenciate between object page and sub-object page[Only passed in case of Delete]
			 * @param {object} [oDeleteHidden] Entity Set delete hidden value.
			 * @param {*}	[bParentDeleteRestrictionEnabled] parent entity's delete restriction value via navigation restriction.
			 * @param {string} [sDeleteHiddenInEntityType] Entity Type delete hidden value
			 * @returns {string} Returns expression binding or boolean value based on oDeleteHidden, viewLevel
			 */
			getDeleteButtonVisibility: function(
				oDeletable,
				viewLevel,
				oDeleteHidden,
				bParentDeleteRestrictionEnabled,
				sDeleteHiddenInEntityType
			) {
				var bParentDeletable =
					bParentDeleteRestrictionEnabled === "true" ||
					(bParentDeleteRestrictionEnabled !== "false" && typeof bParentDeleteRestrictionEnabled === "string");
				if ((oDeletable === "false" && !bParentDeletable) || oDeleteHidden === "true" || sDeleteHiddenInEntityType === "true") {
					return false;
				}
				if (viewLevel > 1) {
					return AnnotationHelper.getButtonVisiblityForDeleteHidden(oDeleteHidden, sDeleteHiddenInEntityType);
				} else if (oDeleteHidden) {
					return oDeleteHidden === "false"
						? "{= !(${ui>/editMode} === 'Editable')}"
						: "{= !(${ui>/editMode} === 'Editable') && !$" + oDeleteHidden + "}";
				} else if (sDeleteHiddenInEntityType) {
					return sDeleteHiddenInEntityType === "false"
						? "{= !(${ui>/editMode} === 'Editable')}"
						: "{= !(${ui>/editMode} === 'Editable') && !$" + sDeleteHiddenInEntityType + "}";
				} else {
					return "{= !(${ui>/editMode} === 'Editable')}";
				}
			},

			/**
			 * Function to format enable property for the Delete button in the object page/sub-object page in case of Command Execution.
			 * @param {object} oDeletable Current Entity Set delete restriction value.
			 * @param {Array}	aConverterContextHeaderActions Array of Header actions in Object page.
			 * @returns {string} Returns expression binding or boolean value based on oDeleteHidden, viewLevel.
			 */
			getDeleteCommandExecutionEnabled: function(oDeletable, aConverterContextHeaderActions) {
				var oDeleteAction = aConverterContextHeaderActions.find(function(oAction) {
					return oAction.type === "Secondary";
				});
				return this.getDeleteButtonEnabled(oDeletable, oDeleteAction.parentEntityDeleteEnabled);
			},
			/**
			 * Function to format visible property for the Delete button in the object page/sub-object page in case of Command Execution.
			 * @param {object} oDeletable Current Entity Set delete restriction value.
			 * @param {number} viewLevel view level to differenciate between object page and sub-object page[Only passed in case of Delete
			 * @param {object} oDeleteHidden Entity Set delete hidden value.
			 * @param {Array}	aConverterContextHeaderActions Array of Header actions in Object page.
			 * @param {string} sDeleteHiddenInEntityType Entity Type delete hidden value.
			 * @returns {string} Returns expression binding or boolean value based on oDeleteHidden, viewLevel.
			 */
			getDeleteCommandExecutionVisible: function(
				oDeletable,
				viewLevel,
				oDeleteHidden,
				aConverterContextHeaderActions,
				sDeleteHiddenInEntityType
			) {
				var oDeleteAction = aConverterContextHeaderActions.find(function(oAction) {
					return oAction.type === "Secondary";
				});
				return this.getDeleteButtonVisibility(
					oDeletable,
					viewLevel,
					oDeleteHidden,
					oDeleteAction.parentEntityDeleteEnabled,
					sDeleteHiddenInEntityType
				);
			},
			/**
			 * Function to get the enablement for the Delete button in the object page/sub-object page.
			 *
			 * @param {object} [oDeletable] Current Entity Set delete restriction value.
			 * @returns {string} Returns expression binding or boolean value based on oDeletable
			 */
			fnGetDeleteButtonEnabled: function(oDeletable) {
				if (oDeletable === "false") {
					return false;
				} else if (oDeletable && oDeletable !== "true") {
					return "{= $" + oDeletable + "}";
				} else {
					return true;
				}
			},

			/**
			 * Function to get the enablement for the Delete button in the object page/sub-object page based on current and parent entity-set restrictions.
			 *
			 * @param {object} [oDeletable] Current Entity Set delete restriction value.
			 * @param {object} [bParentDeleteRestrictionEnabled] parent entity's delete restriction value via navigation restriction.
			 * @returns {string} Returns expression binding or boolean value based on oDeletable
			 */
			getDeleteButtonEnabled: function(oDeletable, bParentDeleteRestrictionEnabled) {
				var bDeletable = AnnotationHelper.fnGetDeleteButtonEnabled(oDeletable);
				return bParentDeleteRestrictionEnabled ? bParentDeleteRestrictionEnabled : bDeletable;
			},
			/**
			 * Function to get the EditAction from the Entityset based on Draft or sticky based application.
			 *
			 * @param {object} [oEntitySet] The value from the expression.
			 * @returns {string} Returns expression binding or boolean value based on vRawValue & oDraftNode
			 */
			getEditAction: function(oEntitySet) {
				var sPath = oEntitySet.getPath(),
					oAnnotations = oEntitySet.getObject(sPath + "@");
				var bDraftRoot = oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.DraftRoot");
				var bStickySession = oAnnotations.hasOwnProperty("@com.sap.vocabularies.Session.v1.StickySessionSupported");
				var sActionName;
				if (bDraftRoot) {
					sActionName = oEntitySet.getObject(sPath + "@com.sap.vocabularies.Common.v1.DraftRoot/EditAction");
				} else if (bStickySession) {
					sActionName = oEntitySet.getObject(sPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/EditAction");
				}
				return !sActionName ? sActionName : sPath + "/" + sActionName;
			},
			isReadOnlyFromStaticAnnotations: function(oAnnotations, oFieldControl) {
				var bComputed, bImmutable, bReadOnly;
				if (oAnnotations["@Org.OData.Core.V1.Computed"]) {
					bComputed = oAnnotations["@Org.OData.Core.V1.Computed"].Bool
						? oAnnotations["@Org.OData.Core.V1.Computed"].Bool == "true"
						: true;
				}
				if (oAnnotations["@Org.OData.Core.V1.Immutable"]) {
					bImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"].Bool
						? oAnnotations["@Org.OData.Core.V1.Immutable"].Bool == "true"
						: true;
				}
				bReadOnly = bComputed || bImmutable;

				if (oFieldControl) {
					bReadOnly = bReadOnly || oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";
				}
				if (bReadOnly) {
					return false;
				} else {
					return true;
				}
			},
			isReadOnlyFromDynamicAnnotations: function(oFieldControl) {
				var sIsFieldControlPathReadOnly;
				if (oFieldControl) {
					if (ManagedObject.bindingParser(oFieldControl)) {
						sIsFieldControlPathReadOnly = "$" + oFieldControl + " === '1'";
					}
				}
				if (sIsFieldControlPathReadOnly) {
					return "{= " + sIsFieldControlPathReadOnly + "? false : true }";
				} else {
					return true;
				}
			},
			getBindingWithoutMeasure: function(sBinding) {
				var oBinding = JSTokenizer.parseJS(sBinding, 0).result,
					oFormatOptions = {
						showMeasure: false
					};
				oBinding = merge(oBinding, {
					formatOptions: oFormatOptions
				});
				return JSON.stringify(oBinding);
			},
			/*
			 * Function to get the expression for chart Title Press
			 *
			 * @function
			 * @param {oConfiguration} [oConfigurations] control configuration from manifest
			 *  @param {oManifest} [oManifest] Outbounds from manifest
			 * returns {String} [sCollectionName] Collection Name of the Micro Chart
			 *
			 * returns {String} [Expression] Handler Expression for the title press
			 *
			 */
			getExpressionForMicroChartTitlePress: function(oConfiguration, oManifestOutbound, sCollectionName) {
				if (oConfiguration) {
					if (
						(oConfiguration["targetOutbound"] && oConfiguration["targetOutbound"]["outbound"]) ||
						(oConfiguration["targetOutbound"] &&
							oConfiguration["targetOutbound"]["outbound"] &&
							oConfiguration["targetSections"])
					) {
						return (
							".handlers.onDataPointTitlePressed($controller, ${$source>/},'" +
							JSON.stringify(oManifestOutbound) +
							"','" +
							oConfiguration["targetOutbound"]["outbound"] +
							"','" +
							sCollectionName +
							"' )"
						);
					} else if (oConfiguration["targetSections"]) {
						return ".handlers.navigateToSubSection($controller, '" + JSON.stringify(oConfiguration["targetSections"]) + "')";
					} else {
						return undefined;
					}
				}
			},
			/*
			 * Function to render Chart Title as Link
			 *
			 * @function
			 * @param {oControlConfiguration} [oConfigurations] control configuration from manifest
			 * returns {String} [sKey] For the TargetOutbound and TargetSection
			 *
			 */
			getMicroChartTitleAsLink: function(oControlConfiguration) {
				if (
					oControlConfiguration &&
					(oControlConfiguration["targetOutbound"] ||
						(oControlConfiguration["targetOutbound"] && oControlConfiguration["targetSections"]))
				) {
					return "External";
				} else if (oControlConfiguration && oControlConfiguration["targetSections"]) {
					return "InPage";
				} else {
					return "None";
				}
			},

			/* Get groupId from control configuration
			 *
			 * @function
			 * @param {Object} [oConfigurations] control configuration from manifest
			 * @param {String} [sAnnotationPath] Annotation Path for the configuration
			 * @description Used to get the groupId for DataPoints and MicroCharts in the Header.
			 *
			 */
			getGroupIdFromConfig: function(oConfigurations, sAnnotationPath, sDefaultGroupId) {
				var oConfiguration = oConfigurations[sAnnotationPath],
					aAutoPatterns = ["Heroes", "Decoration", "Workers", "LongRunners"],
					sGroupId = sDefaultGroupId;
				if (
					oConfiguration &&
					oConfiguration.requestGroupId &&
					aAutoPatterns.some(function(autoPattern) {
						return autoPattern === oConfiguration.requestGroupId;
					})
				) {
					sGroupId = "$auto." + oConfiguration.requestGroupId;
				}
				return sGroupId;
			},

			/*
			 * Get Context Binding with groupId from control configuration
			 *
			 * @function
			 * @param {Object} [oConfigurations] control configuration from manifest
			 * @param {String} [sKey] Annotation Path for of the configuration
			 * @description Used to get the binding for DataPoints in the Header.
			 *
			 */
			getBindingWithGroupIdFromConfig: function(oConfigurations, sKey) {
				var sGroupId = AnnotationHelper.getGroupIdFromConfig(oConfigurations, sKey),
					sBinding;
				if (sGroupId) {
					sBinding = "{ path : '', parameters : { $$groupId : '" + sGroupId + "' } }";
				}
				return sBinding;
			},
			/**
			 * Method to check whether a FieldGroup consists of only 1 DataField with MultiLine Text annotation.
			 * @param aFormElements {DataFieldAbstractTypes[]} collection of form elements in a field group
			 * @returns {boolean} Returns true if only 1 data field with Multiline Text annotation exists.
			 */
			doesFieldGroupContainOnlyOneMultiLineDataField: function(aFormElements) {
				return aFormElements && aFormElements.length === 1 && !!aFormElements[0].isValueMultilineText;
			},
			/*
			 * Get Visiblity of breadcrumbs.
			 *
			 * @function
			 * @param {Object} [oViewData] ViewData model
			 * returns {*} Expression or boolean
			 */
			getVisibleExpressionForBreadcrumbs: function(oViewData) {
				return oViewData.showBreadCrumbs && oViewData.fclEnabled !== undefined
					? "{fclhelper>/breadCrumbIsVisible}"
					: oViewData.showBreadCrumbs;
			},
			/*
			 * Get expression for header action's enable property.
			 *
			 * @function
			 * @param {Object} [operationAvailable] operationAvailable object,
			 * @param {object} [oEntitySet] entity set information
			 * @param {string} [sOperationAvailableFormatted] formatted value of operational available
			 * returns {*} Expression or boolean values true if operationAvailable is not path based
			 */
			getEnabledExpressionForHeaderActions: function(operationAvailable, oEntitySet, sOperationAvailableFormatted) {
				if (operationAvailable === null) {
					var oEditAction =
						(oEntitySet["@com.sap.vocabularies.Common.v1.DraftRoot"] &&
							oEntitySet["@com.sap.vocabularies.Common.v1.DraftRoot"].EditAction) ||
						(oEntitySet["@com.sap.vocabularies.Common.v1.StickySessionSupported"] &&
							oEntitySet["@com.sap.vocabularies.Common.v1.StickySessionSupported"].EditAction);
					if (oEditAction) {
						return "{= ${#" + oEditAction + "} ? true : false }";
					}
				}
				if (operationAvailable && operationAvailable.$Path) {
					return sOperationAvailableFormatted;
				} else {
					return true;
				}
			},
			/*
			 * Get expression for header action's visible property.
			 *
			 * @function
			 * @param {object} [oEntitySet] entity set information
			 * @param {string} [sHiddenBindingExpression] hidden binding expression resolved from model
			 * @param {string} [sUpdateHiddenInEntityType] update hidden binding expression from entityType
			 * returns {string} Expression based on ui model's property editMode
			 */
			getButtonVisiblityForHeaderActions: function(oEntitySet, sHiddenBindingExpression, sUpdateHiddenInEntityType) {
				var sResult = "{= !(${ui>/editMode} === 'Editable')";
				if (sHiddenBindingExpression === "true" || sUpdateHiddenInEntityType === "true") {
					return false;
				} else if (sHiddenBindingExpression === "false" || sUpdateHiddenInEntityType === "false") {
					sResult = sResult + "";
				} else if (sHiddenBindingExpression) {
					sResult = sResult + " && !$" + sHiddenBindingExpression;
				} else if (sUpdateHiddenInEntityType) {
					sResult = sResult + " && !$" + sUpdateHiddenInEntityType;
				} else if (oEntitySet && !oEntitySet["@com.sap.vocabularies.UI.v1.UpdateHidden"]) {
					sResult = sResult + "";
				}
				return sResult + "}";
			},
			/*
			 * Get expression for annotation action's enable property.
			 *
			 * @function
			 * @param {object} [oBound] bound action context
			 * @param {object} [oActionContext] action context object
			 * @param {object} [oDataField] data field object
			 * @param {string} [sFormattedValueOperationalAvailable] string value of operational available
			 * returns {*}  both string and expressions if none of the condition satisfies the button is enabled in case of bound is false a string true is return
			 */
			getButtonEnabledForAnnotationAction: function(oBound, oActionContext, oDataField, sFormattedValueOperationalAvailable) {
				if (oBound && oBound.$IsBound !== true) {
					return "true";
				}
				if (oActionContext && oActionContext["@Org.OData.Core.V1.OperationAvailable"] === null && oDataField) {
					return "{= !${#" + oDataField.Action + "} ? false : true } }";
				}
				if (
					oActionContext &&
					oActionContext["@Org.OData.Core.V1.OperationAvailable"] &&
					oActionContext["@Org.OData.Core.V1.OperationAvailable"].$Path
				) {
					return "{= $" + sFormattedValueOperationalAvailable + "}";
				}
				return true;
			},
			/**
			 * @function
			 * @name getMenuButtonEnabled
			 * @param {iContext} iContext
			 * @param {Array} aMenuActions Menu Actions
			 * @param {object} oEntityType Entity Type Details
			 * @param {object} oEntitySet Entity Set Details
			 * @returns {string|boolean} - returns true, false, or expression with path, for example "{= (${path:'_ShipToParty/isVerified',type:'sap.ui.model.odata.type.Boolean'}) }"
			 */
			getMenuButtonEnabled: function(iContext, aMenuActions, oEntityType, oEntitySet) {
				var combinedConditions = [];
				var oAction;
				var sEntityType = oEntitySet && oEntitySet.$Type;
				for (var i = 0; i < aMenuActions.length; i++) {
					var oMenuItemAction = aMenuActions[i];
					if (oMenuItemAction.enabled) {
						return true;
					} else if (oMenuItemAction.type === "ForAction") {
						var sDataFieldEnabledExp = "";
						var sFormattedValueOperationalAvailable;
						var oInterface = iContext.getInterface(1);
						var oModel = oInterface.getModel();
						var oDataField = oModel.getObject(oMenuItemAction.annotationPath);
						var oActionContext = oModel.getObject(oInterface.getPath() + oDataField.Action),
							oActionAnnotations = oModel.getObject(oInterface.getPath() + oDataField.Action + "@"),
							oContext = oModel.createBindingContext(oInterface.getPath() + oDataField.Action),
							oOperationAvailableContext = oModel.createBindingContext(
								oInterface.getPath() + oDataField.Action + "@Org.OData.Core.V1.OperationAvailable"
							),
							oOperationAvailable = oModel.getObject(oContext.getPath() + "@Org.OData.Core.V1.OperationAvailable");
						if (oOperationAvailable) {
							var sOperationAvailableExpression = oOperationAvailable.$Path ? oOperationAvailable.$Path : oOperationAvailable;
							var oOperationAvailableAnnotation = { $Path: sOperationAvailableExpression.replace("_it/", "") };
						}
						sFormattedValueOperationalAvailable = oOperationAvailable
							? ODataModelAnnotationHelper.format(oOperationAvailableAnnotation, {
									arguments: [],
									context: oOperationAvailableContext
							  })
							: undefined;
						if (Array.isArray(oActionContext)) {
							if (sEntityType) {
								oAction = oActionContext.find(function(action) {
									return action.$IsBound && action.$Parameter[0].$Type === sEntityType;
								});
							} else {
								oAction = oActionContext[0];
							}
						} else {
							oAction = oActionContext;
						}

						sDataFieldEnabledExp = AnnotationHelper.getButtonEnabledForAnnotationAction(
							oAction,
							oActionAnnotations,
							oDataField,
							sFormattedValueOperationalAvailable
						);

						if (sDataFieldEnabledExp === true || sDataFieldEnabledExp === "true") {
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
			/*
			 * Get visiblity for editable header facet.
			 *
			 * @function
			 * @param {object} [oAnnotations] Annotations object for given entity set
			 * @param {object} [oFieldControl] field control
			 * returns {*}  binding expression or boolean value resolved form funcitons isReadOnlyFromStaticAnnotations and isReadOnlyFromDynamicAnnotations
			 */
			getVisiblityOfHeaderFacet: function(oAnnotations, oFieldControl) {
				return (
					AnnotationHelper.isReadOnlyFromStaticAnnotations(oAnnotations, oFieldControl) &&
					AnnotationHelper.isReadOnlyFromDynamicAnnotations(oFieldControl)
				);
			},
			/*
			 * Get Expression of press event of delete button.
			 *
			 * @function
			 * @param {string} [sEntitySetName] Entity set name
			 * returns {string}  binding expression / function string generated from commanhelper's function generateFunction
			 */
			getPressExpressionForDelete: function(sEntitySetName) {
				var sDeletableContexts = "${$view>/getBindingContext}",
					sTitle = "${$view>/#fe::ObjectPage/getHeaderTitle/getExpandedHeading/getItems/0/getText}",
					sDescription = "${$view>/#fe::ObjectPage/getHeaderTitle/getExpandedHeading/getItems/1/getText}";
				var oParams = {
					title: sTitle,
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					description: sDescription
				};
				return CommonHelper.generateFunction(".editFlow.deleteDocument", sDeletableContexts, CommonHelper.objectToString(oParams));
			},
			/*
			 * Get Expression of press event of Edit button.
			 *
			 * @function
			 * @param {object} [oDataField] Data field object
			 * @param {string} [sEntitySetName] Entity set name
			 * @param {object} [oHeaderAction] Header action object
			 * returns {string}  binding expression / function string generated from commanhelper's function generateFunction
			 */
			getPressExpressionForEdit: function(oDataField, sEntitySetName, oHeaderAction) {
				var sEditableContexts = CommonHelper.addSingleQuotes(oDataField && oDataField.Action),
					sDataFieldEnumMember = oDataField && oDataField.InvocationGrouping && oDataField.InvocationGrouping["$EnumMember"],
					sInvocationGroup =
						sDataFieldEnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated";
				var oParams = {
					contexts: "${$view>/getBindingContext}",
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGroup),
					model: "${$source>/}.getModel()",
					label: CommonHelper.addSingleQuotes(oDataField && oDataField.Label),
					isNavigable: oHeaderAction && oHeaderAction.isNavigable
				};
				return CommonHelper.generateFunction(".editFlow.invokeAction", sEditableContexts, CommonHelper.objectToString(oParams));
			},
			/*
			 * Get Expression of press of anotation actions.
			 *
			 * @function
			 * @param {object} [oDataField] Data field object
			 * @param {string} [sEntitySetName] Entity set name
			 * @param {object} [oHeaderAction] Header action object
			 * returns {string}  binding expression / function string generated from commanhelper's function generateFunction
			 */
			getPressExpressionForFooterAnnotationAction: function(oDataField, sEntitySetName, oHeaderAction) {
				var sActionContexts = CommonHelper.addSingleQuotes(oDataField && oDataField.Action),
					sDataFieldEnumMember = oDataField && oDataField.InvocationGrouping && oDataField.InvocationGrouping["$EnumMember"],
					sInvocationGroup =
						sDataFieldEnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated";
				var oParams = {
					contexts: "${$view>/#fe::ObjectPage/}.getBindingContext()",
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGroup),
					model: "${$source>/}.getModel()",
					label: CommonHelper.addSingleQuotes(oDataField && oDataField.Label),
					isNavigable: oHeaderAction && oHeaderAction.isNavigable
				};
				return CommonHelper.generateFunction(
					".handlers.onCallActionFromFooter",
					"${$view>/}",
					sActionContexts,
					CommonHelper.objectToString(oParams)
				);
			},
			/*
			 * Get Visiblity of container HBox for headerfacet .
			 *
			 * @function
			 * @param {object} [oHiddenAnnotation] hidden annotation for given header facet
			 * @param {object} [oHiddenValue] Hidden value resolved from model
			 * returns {*}  hidden binding expression or boolean value.
			 */
			getStashableHBoxVisiblity: function(oHiddenAnnotation, oHiddenValue) {
				return oHiddenAnnotation === false ? true : oHiddenValue && "{= !%" + oHiddenValue + "}";
			},
			/*
			 * Get binding of container HBox for header facet.
			 *
			 * @function
			 * @param {object} [oControlConfiguration] control configuration form viewData model
			 * @param {object} [oHeaderFacet] header facet object
			 * returns {*}  binding expression from function getBindingWithGroupIdFromConfig or undefined.
			 */
			getStashableHBoxBinding: function(oControlConfiguration, oHeaderFacet) {
				if (oHeaderFacet && oHeaderFacet.Facet && oHeaderFacet.Facet.targetAnnotationType === "DataPoint") {
					return AnnotationHelper.getBindingWithGroupIdFromConfig(
						oControlConfiguration,
						oHeaderFacet.Facet.targetAnnotationValue
					);
				}
			},
			/*
			 * Get chart title for microchart in headerfacet .
			 *
			 * @function
			 * @param {object} [oViewData] view data model
			 * @param {object} [oHeaderFacet] header facet object
			 * @param {string} [sCommonHeaderTitle] comman used header title string
			 * returns {*}  string (commanly used header string => sCommonHeaderTitle) or undefied
			 */
			getChartTitleDescribedBy: function(oViewData, oHeaderFacet, sCommonHeaderTitle) {
				var sAnnotationPath = oHeaderFacet && oHeaderFacet.Target && oHeaderFacet.Target["$AnnotationPath"],
					bCondition =
						oViewData &&
						oViewData.controlConfiguration &&
						oViewData.controlConfiguration[sAnnotationPath] &&
						oViewData.controlConfiguration[sAnnotationPath]["navigation"] &&
						oViewData.controlConfiguration[sAnnotationPath]["navigation"]["targetSections"];
				return bCondition ? sCommonHeaderTitle : undefined;
			},
			buildFieldBindingExpression: function(
				iContext,
				oProperty,
				oPropertyAnnotations,
				oCollectionAnnotations,
				sDescriptionExpression,
				oDataPoint,
				sPropertyType
			) {
				return FieldHelper.buildFieldBindingExpression(
					iContext,
					oProperty,
					oPropertyAnnotations,
					sDescriptionExpression,
					{ "displayMode": FieldHelper.displayMode(oPropertyAnnotations, oCollectionAnnotations) },
					oDataPoint,
					sPropertyType
				).then(function(sBinding) {
					if (!oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"]) {
						return AnnotationHelper.getBindingWithoutMeasure(sBinding);
					}
					return sBinding;
				});
			},

			/*
			 * Get Press event expression for external and internal data point link .
			 *
			 * @function
			 * @param {object} [oConfiguration] view data model
			 * @param {object} [oManifestOutbound] Manifest setting object
			 * returns {string} the function's press event's run time binding
			 */
			getPressExpressionForLink: function(oConfiguration, oManifestOutbound) {
				if (oConfiguration) {
					if (oConfiguration["targetOutbound"] && oConfiguration["targetOutbound"]["outbound"]) {
						return (
							".handlers.onDataPointTitlePressed($controller, ${$source>}, " +
							JSON.stringify(oManifestOutbound) +
							"," +
							JSON.stringify(oConfiguration["targetOutbound"]["outbound"]) +
							")"
						);
					} else if (oConfiguration["targetSections"]) {
						return ".handlers.navigateToSubSection($controller, '" + JSON.stringify(oConfiguration["targetSections"]) + "')";
					} else {
						return undefined;
					}
				}
			},
			/**
			 * Method to retreive expression binding for properties using text annotation.
			 *
			 * @function
			 * @name buildExpressionForTextValue
			 * @param {string} sPropertyPath Path of the Property using text annotation.
			 * @param {object} oHeaderInfo header info object.
			 * @returns {string} [Expression]
			 * @private
			 * @ui5-restricted
			 */
			buildExpressionForTextValue: function(sPropertyPath, oHeaderInfo) {
				var oMetaModel = oHeaderInfo.context.getModel(),
					sPath = oHeaderInfo.context.getPath(),
					oTextAnnotationContext = oMetaModel.createBindingContext(sPath + "@com.sap.vocabularies.Common.v1.Text"),
					oTextAnnotation = oTextAnnotationContext.getProperty(),
					sTextExpression = oTextAnnotation
						? ODataModelAnnotationHelper.value(oTextAnnotation, { context: oTextAnnotationContext })
						: undefined;

				sPropertyPath = ODataModelAnnotationHelper.getNavigationPath(sPropertyPath);
				if (sTextExpression) {
					// format value
					var oTextValueAnnotation = { $Path: sTextExpression.substr(1, sTextExpression.length - 2) };
					var Format = ODataModelAnnotationHelper.format(
						{ $Path: oTextValueAnnotation.$Path },
						{
							arguments: [],
							context: oTextAnnotationContext
						}
					);
					if (typeof Format === "string") {
						sTextExpression = Format.substr(0, Format.length - 1) + ", parameters: {'$$noPatch': true}}";
					} else {
						return Format.then(function(result) {
							return result.substr(0, result.length - 1) + ", parameters: {'$$noPatch': true}}";
						});
					}
				}
				return sTextExpression;
			},
			/**
			 * Method to retreive binding expression for properties defining an format (ex: decimal, dates ...).
			 *
			 * @function
			 * @name getValueFormatted
			 * @param {object} oProperty Property object.
			 * @param {object} oHeaderInfo header info object.
			 * @returns {string} [Expression]
			 * @private
			 * @ui5-restricted
			 *
			 */
			getValueFormatted: function(oProperty, oHeaderInfo) {
				if (typeof oProperty === "object") {
					var oMetaModel = oHeaderInfo.context.getModel(),
						sPath = oHeaderInfo.context.getPath(),
						oContext = oMetaModel.createBindingContext(sPath);
					return ODataModelAnnotationHelper.format(
						{ $Path: oProperty.$Path },
						{
							arguments: [],
							context: oContext
						}
					);
				} else {
					return undefined;
				}
			}
		};
		AnnotationHelper.buildExpressionForProgressIndicatorPercentValue.requiresIContext = true;
		AnnotationHelper.buildExpressionForProgressIndicatorDisplayValue.requiresIContext = true;
		AnnotationHelper.buildRatingIndicatorSubtitleExpression.requiresIContext = true;
		AnnotationHelper.getHeaderRatingIndicatorText.requiresIContext = true;
		AnnotationHelper.buildExpressionForTextValue.requiresIContext = true;
		AnnotationHelper.getValueFormatted.requiresIContext = true;
		AnnotationHelper.buildFieldBindingExpression.requiresIContext = true;
		AnnotationHelper.getMenuButtonEnabled.requiresIContext = true;
		return AnnotationHelper;
	},
	true
);
