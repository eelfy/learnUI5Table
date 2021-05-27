/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/core/CommonUtils",
		"sap/m/library",
		"sap/base/strings/formatMessage",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/helpers/ModelHelper"
	],
	function(Log, ODataModelAnnotationHelper, CommonUtils, mLibrary, formatMessage, CommonHelper, StableIdHelper, ModelHelper) {
		"use strict";

		var ButtonType = mLibrary.ButtonType;

		var AnnotationHelper = {
			/* this helper can be activated to debug template processing
			 debug: function (oContext) {
			 //debugger;
			 },
			 */

			getTargetContext: function(oTarget) {
				var sTarget = oTarget.getObject(oTarget.getPath()),
					sNavigationPath = ODataModelAnnotationHelper.getNavigationPath(oTarget.getPath());
				return sNavigationPath + "/" + sTarget;
			},

			getNavigationContext: function(oContext) {
				return ODataModelAnnotationHelper.getNavigationPath(oContext.getPath());
			},

			/**
			 * Checks if the navigation collection is insertable.
			 *
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getNavigationInsertableRestrictions
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param oCollection
			 * @param {string} sCurrentCollectionName The name of the navigation collection
			 * @param {Array} aRestrictedProperties array of RestrictedProperties of NavigationRestrictions of the root collection
			 * @param {boolean} bInsertable Insertable value of the navigation collection
			 * @param bCreationRow
			 * @returns {string} expression if insertable or insertable path, false otherwise
			 * @private
			 * @ui5-restricted
			 */
			getNavigationInsertableRestrictions: function(
				oCollection,
				sCurrentCollectionName,
				aRestrictedProperties,
				bInsertable,
				bCreationRow
			) {
				// If insertable = true via NavigationRestriction of root collection, navigation collection is insertable
				// If NOT insertable via NavigationRestriction of root collection, navigation collection is NOT insertable
				// If insertable property is undefined for the NavigationRestrictions of the root collection,
				// 	then insertable property of the navigation collection is considered.
				// 	If insertable = true, navigation collection is insertable
				// 	If insertable = false, navigation collection is NOT insertable
				// If Insertable is undefined via navigation restriction of root collection
				// 	and Insertable is undefined at navigation collection,
				// 	then navigation collection is insertable.
				var i,
					oNavigationProperty,
					sPath = "";
				for (i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.InsertRestrictions
					) {
						if (oNavigationProperty.InsertRestrictions.Insertable && oNavigationProperty.InsertRestrictions.Insertable.$Path) {
							if (bCreationRow) {
								sPath = oCollection.$Partner + "/";
							}
							return (
								"{= ${" +
								sPath +
								oNavigationProperty.InsertRestrictions.Insertable.$Path +
								"}  && ${ui>/editMode} === 'Editable' }"
							);
						}
						return oNavigationProperty.InsertRestrictions.Insertable ? "{= ${ui>/editMode} === 'Editable' }" : false;
					}
				}
				if (bInsertable && bInsertable.$Path && bInsertable.$Path.indexOf("/") > -1) {
					var aSplitInsertablePath = bInsertable.$Path.split("/");
					var sNavigationPath = aSplitInsertablePath[0];
					var sPartner = oCollection.$Partner;
					if (sNavigationPath !== sPartner) {
						// check for parent property
						return "{= ${ui>/editMode} === 'Editable'}";
					}
					if (bCreationRow) {
						sCurrentCollectionName = "";
					} else {
						sCurrentCollectionName = sCurrentCollectionName + "/";
					}
					return "{=  ${ui>/editMode} === 'Editable' && ${" + sCurrentCollectionName + bInsertable.$Path + "}}";
				}
				return "{= " + (bInsertable !== false) + " && ${ui>/editMode} === 'Editable'}";
			},
			/**
			 * Checks if the footer is visible or not.
			 *
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.showFooter
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {Array} aDataFields array of DataFields in the identification
			 * @param {boolean} bConsiderEditable boolean value to check whether the edit mode binding is required or not
			 * @returns {string} expression if all the actions are ui.hidden, true otherwise
			 * @private
			 * @ui5-restricted
			 **/
			showFooter: function(aDataFields, bConsiderEditable) {
				var sHiddenExpression = "";
				var sSemiHiddenExpression;
				var aHiddenActionPath = [];

				for (var i in aDataFields) {
					var oDataField = aDataFields[i];
					if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && oDataField.Determining === true) {
						if (!oDataField["@com.sap.vocabularies.UI.v1.Hidden"]) {
							return true;
						} else if (oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path) {
							if (aHiddenActionPath.indexOf(oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path) === -1) {
								aHiddenActionPath.push(oDataField["@com.sap.vocabularies.UI.v1.Hidden"].$Path);
							}
						}
					}
				}

				if (aHiddenActionPath.length) {
					for (var index in aHiddenActionPath) {
						if (aHiddenActionPath[index]) {
							sSemiHiddenExpression = "(%{" + aHiddenActionPath[index] + "} === true ? false : true )";
						}
						if (index == aHiddenActionPath.length - 1) {
							sHiddenExpression = sHiddenExpression + sSemiHiddenExpression;
						} else {
							sHiddenExpression = sHiddenExpression + sSemiHiddenExpression + "||";
						}
					}
					return (
						"{= " +
						sHiddenExpression +
						(bConsiderEditable ? " || ${ui>/editMode} === 'Editable' " : " ") +
						"|| ${internal>showMessageFooter} === true}"
					);
				} else {
					return (
						"{= " + (bConsiderEditable ? "${ui>/editMode} === 'Editable' || " : "") + "${internal>showMessageFooter} === true}"
					);
				}
			},

			/**
			 * Returns the metamodel path correctly for bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getActionContext
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getActionContext: function(oAction) {
				return CommonUtils.getActionPath(oAction, true);
			},
			/**
			 * Returns the metamodel path correctly for overloaded bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction/@$ui5.overload/0" is returned.
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.getPathToBoundActionOverload
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound action overload and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getPathToBoundActionOverload: function(oAction) {
				var sPath = CommonUtils.getActionPath(oAction, true);
				return sPath + "/@$ui5.overload/0";
			},

			/**
			 * Returns an expression to set button type based on Criticality set to DataField
			 * Supported Criticality: Positive and Negative leading to Accept and Reject button type respectively.
			 *
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.buildButtonTypeExpressionForCriticality
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {object} oDataPoint - a DataField in the identification
			 * @returns {string} - an expression to deduce button type
			 * @private
			 * @ui5-restricted
			 **/
			buildButtonTypeExpressionForCriticality: function(oDataPoint) {
				var sFormatCriticalityExpression = ButtonType.Default;
				var sExpressionTemplate;
				var oCriticalityProperty = oDataPoint.Criticality;
				if (oCriticalityProperty) {
					sExpressionTemplate =
						"'{'= ({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Negative'') || ({0} === ''1'') || ({0} === 1) ? ''" +
						ButtonType.Reject +
						"'' : " +
						"({0} === ''com.sap.vocabularies.UI.v1.CriticalityType/Positive'') || ({0} === ''3'') || ({0} === 3) ? ''" +
						ButtonType.Accept +
						"'' : " +
						"''" +
						ButtonType.Default +
						"'' '}'";
					if (oCriticalityProperty.$Path) {
						var sCriticalitySimplePath = "${" + oCriticalityProperty.$Path + "}";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticalitySimplePath);
					} else if (oCriticalityProperty.$EnumMember) {
						var sCriticality = "'" + oCriticalityProperty.$EnumMember + "'";
						sFormatCriticalityExpression = formatMessage(sExpressionTemplate, sCriticality);
					}
				}
				return sFormatCriticalityExpression;
			},
			/**
			 * Returns an expression to determine Emphasized  button type based on Criticality across all actions
			 * If critical action is rendered, its considered to be the primary action. Hence template's default primary action is set back to Default.
			 * @function
			 * @static
			 * @name sap.fe.core.AnnotationHelper.buildEmphasizedButtonExpression
			 * @memberof sap.fe.core.AnnotationHelper
			 * @param {Array} aIdentification - array of all the DataFields in Identification
			 * @returns {string} - an expression to deduce if button type is Default or Emphasized
			 * @private
			 * @ui5-restricted
			 **/
			buildEmphasizedButtonExpression: function(aIdentification) {
				if (!aIdentification) {
					return ButtonType.Emphasized;
				}
				var sFormatEmphasizedExpression;
				var bIsAlwaysDefault,
					sHiddenSimplePath,
					sHiddenExpression = "";
				aIdentification.forEach(function(oDataField) {
					var oCriticalityProperty = oDataField.Criticality;
					var oDataFieldHidden = oDataField["@com.sap.vocabularies.UI.v1.Hidden"];
					if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && !bIsAlwaysDefault && oCriticalityProperty) {
						if (!sFormatEmphasizedExpression && oDataFieldHidden === true) {
							// if DataField is set to hidden, we can skip other checks and return Default button type
							sFormatEmphasizedExpression = ButtonType.Emphasized;
							return;
						}
						if (oDataFieldHidden && oDataFieldHidden.$Path) {
							// when visibility of critical button is based on path, collect all paths for expression
							sHiddenSimplePath = oDataFieldHidden.$Path;
							if (sHiddenExpression) {
								sHiddenExpression = sHiddenExpression + " && ";
							}
							sHiddenExpression = sHiddenExpression + "%{" + sHiddenSimplePath + "} === true";
							sFormatEmphasizedExpression = "{= (" + sHiddenExpression + ") ? 'Emphasized' : 'Default' }";
						}
						switch (oCriticalityProperty.$EnumMember) {
							// supported criticality are [Positive/3/'3'] and [Negative/1/'1']
							case "com.sap.vocabularies.UI.v1.CriticalityType/Negative":
							case "com.sap.vocabularies.UI.v1.CriticalityType/Positive":
							case "1":
							case 1:
							case "3":
							case 3:
								if (!oDataFieldHidden) {
									sFormatEmphasizedExpression = ButtonType.Default;
									bIsAlwaysDefault = true;
								}
								sFormatEmphasizedExpression = sFormatEmphasizedExpression || ButtonType.Default;
								break;
							default:
								sFormatEmphasizedExpression = ButtonType.Emphasized;
						}
						if (oCriticalityProperty.$Path) {
							// when Criticality is set using a path, use the path for deducing the Emphsized type for default Primary Action
							var sCombinedHiddenExpression = sHiddenExpression ? "!(" + sHiddenExpression + ") && " : "";
							sFormatEmphasizedExpression =
								"{= " +
								sCombinedHiddenExpression +
								"((${" +
								oCriticalityProperty.$Path +
								"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${" +
								oCriticalityProperty.$Path +
								"} === '1') || (${" +
								oCriticalityProperty.$Path +
								"} === 1) " +
								"|| (${" +
								oCriticalityProperty.$Path +
								"} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${" +
								oCriticalityProperty.$Path +
								"} === '3') || (${" +
								oCriticalityProperty.$Path +
								"} === 3)) ? " +
								"'Default'" +
								" : " +
								"'Emphasized'" +
								" }";
						}
					}
				});
				return sFormatEmphasizedExpression || ButtonType.Emphasized;
			},
			/**
			 * Method to determine if the programming model is sticky.
			 *
			 * @function
			 * @name isStickySessionSupported
			 * @param {object} [vCollectionOrMetaModel] - the collection or the metadata model
			 * @param {object} [oInterface] - contains the context, used in oDataContext
			 * @returns {boolean} - returns true if sticky, else false
			 */
			isStickySessionSupported: function(vCollectionOrMetaModel, oInterface) {
				var oMetaModel;
				if (arguments.length > 1) {
					oMetaModel = oInterface.context.getModel();
				} else {
					oMetaModel = vCollectionOrMetaModel;
				}
				return ModelHelper.isStickySessionSupported(oMetaModel);
			},
			/**
			 * Method returns Whether the action type is manifest or not.
			 *
			 * @function
			 * @name isManifestActionVisible
			 * @param {object} [oAction] - the action object
			 * @returns {boolean} - returns true if action is coming from manifest, else false
			 */
			isManifestAction: function(oAction) {
				var aActions = ["Primary", "DefaultApply", "Secondary", "ForAction", "ForNavigation"];
				return aActions.indexOf(oAction.type) < 0;
			},

			/**
			 * Method returns whether footer is visible or not on object / sub object page.
			 *
			 * @function
			 * @name getFooterVisible
			 * @param {object} [oFooterActions] - the footer action object coming from convertor
			 * @param {Array} [aDataFields] - Data field array for normal footer visiblity processing
			 * @returns {boolean} - returns true if custom actions are present otherwise call function showFooter
			 */
			getFooterVisible: function(oFooterActions, aDataFields) {
				var bCustomActionFlag = false;
				oFooterActions.forEach(
					function(action) {
						var isCustomAction = this.isManifestAction(action);
						if (isCustomAction) {
							bCustomActionFlag = true;
						}
					}.bind(this)
				);
				if (bCustomActionFlag) {
					return true;
				} else {
					return this.showFooter(aDataFields, true);
				}
			},

			/**
			 * Build an expression calling an action handler via the FPM helper's actionWrapper function
			 *
			 * This function assumes that the 'FPM.actionWrapper()' function is available at runtime.
			 *
			 * @param {object} oAction - Action metadata
			 * @param {string} oAction.handlerModule - Module containing the action handler method
			 * @param {string} oAction.handlerMethod - Action handler method name
			 * @param {object} [oThis] - 'this' (if the function is called from a macro)
			 * @param {string} oThis.id - The table's ID
			 * @returns {string}	Expression
			 */
			buildActionWrapper: function(oAction, oThis) {
				var aParams = [
					"$event",
					CommonHelper.addSingleQuotes(oAction.handlerModule),
					CommonHelper.addSingleQuotes(oAction.handlerMethod)
				];

				if (oThis && oThis.id) {
					var oAdditionalParams = {
						contexts: "${internal>selectedContexts}"
					};
					aParams.push(CommonHelper.objectToString(oAdditionalParams));
				}

				return "FPM.actionWrapper(" + aParams.join(", ") + ")";
			},

			/**
			 * Method returns an VariantBackReference expression based on variantManagement and oConverterContext value.
			 *
			 * @function
			 * @name getVariantBackReference
			 * @param {object} oViewData - Object Containing View Data
			 * @param {object} oConverterContext - Object containing converted context
			 * @returns {string}	Expression
			 */
			getVariantBackReference: function(oViewData, oConverterContext) {
				if (oViewData && oViewData.variantManagement === "Page") {
					return "fe::PageVariantManagement";
				}
				if (oViewData && oViewData.variantManagement === "Control") {
					return StableIdHelper.generate([oConverterContext.filterBarId, "VariantManagement"]);
				}
				return undefined;
			}
		};
		return AnnotationHelper;
	},
	true
);
