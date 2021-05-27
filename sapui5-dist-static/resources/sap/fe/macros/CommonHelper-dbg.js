/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/ResourceModel",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/model/Context",
		"sap/ui/Device",
		"sap/base/strings/formatMessage",
		"sap/fe/core/library"
	],
	function(
		ResourceModel,
		ODataModelAnnotationHelper,
		Log,
		CommonUtils,
		SelectionVariant,
		StableIdHelper,
		ModelHelper,
		Context,
		Device,
		formatMessage,
		CoreLibrary
	) {
		"use strict";
		var Helper = {
			getPathToKey: function(oCtx) {
				return oCtx.getObject();
			},

			/**
			 * Determine if field is visible (= not hidden).
			 *
			 * @param {object} target Target instance
			 * @param {object} oInterface Interface instance
			 * @returns {string|boolean} - returns true, false, or expression with path, for example "{= !${IsActiveEntity} }"
			 */
			isVisible: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					hidden = oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];

				return typeof hidden === "object" ? "{= !${" + hidden.$Path + "} }" : !hidden;
			},
			fireButtonPress: function(oButton) {
				return CommonUtils.fireButtonPress(oButton);
			},

			/**
			 * Determine if the action opens up a dialog.
			 * @param oActionContext
			 * @param oInterface
			 * @returns {string} - returns sap.ui.core.aria.HasPopup
			 */
			isDialog: function(oActionContext, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					isCritical = oModel.getObject(sPropertyPath + "/@$ui5.overload@com.sap.vocabularies.Common.v1.IsActionCritical");
				if (isCritical) {
					return "Dialog";
				} else if (oActionContext) {
					var oAction = Array.isArray(oActionContext) ? oActionContext[0] : oActionContext;
					if (oAction.$Parameter && oAction.$Parameter.length > 1) {
						return "Dialog";
					} else {
						return "None";
					}
				}
			},
			/**
			 * Determine if field is editable.
			 *
			 * @param {object} target Target instance
			 * @param {object} oInterface Interface instance
			 * @returns {string} - returns sap.ui.mdc.enum.EditMode.Editable, sap.ui.mdc.enum.EditMode.ReadOnly
			 * 					  or expression with path, for example "{= %{HasDraftEntity} ? 'ReadOnly' : 'Editable' }"
			 */
			getParameterEditMode: function(target, oInterface) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					oAnnotations = oModel.getObject(sPropertyPath + "@"),
					fieldControl = oAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"],
					immutable = oAnnotations["@Org.OData.Core.V1.Immutable"],
					computed = oAnnotations["@Org.OData.Core.V1.Computed"];

				if (fieldControl && fieldControl.$Path) {
					if (fieldControl.$Path === "ReadOnly") {
						return sap.ui.mdc.enum.EditMode.ReadOnly;
					} else {
						return (
							"{= %{" +
							fieldControl.$Path +
							"} ? " +
							"'" +
							sap.ui.mdc.enum.EditMode.ReadOnly +
							"'" +
							" : " +
							"'" +
							sap.ui.mdc.enum.EditMode.Editable +
							"'" +
							" }"
						);
					}
				}

				if (fieldControl && fieldControl.$EnumMember) {
					if (fieldControl.$EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
						return sap.ui.mdc.enum.EditMode.ReadOnly;
					}
				}

				if (immutable || computed) {
					return sap.ui.mdc.enum.EditMode.ReadOnly;
				}

				return sap.ui.mdc.enum.EditMode.Editable;
			},
			/**
			 * Get the complete metapath to the target.
			 *
			 * @param target
			 * @param oInterface
			 * @returns {string | undefined}
			 */
			getMetaPath: function(target, oInterface) {
				return (oInterface && oInterface.context && oInterface.context.getPath()) || undefined;
			},
			isDesktop: function() {
				return Device.system.desktop === true;
			},
			getTargetCollection: function(oContext, navCollection) {
				var sPath = oContext.getPath(),
					aParts,
					entitySet,
					navigationCollection;
				if (oContext.getMetadata().getName() === "sap.ui.model.Context" && oContext.getObject("$kind") === "EntitySet") {
					return sPath;
				}
				if (oContext.getModel) {
					sPath =
						(oContext.getModel().getMetaPath && oContext.getModel().getMetaPath(sPath)) ||
						oContext
							.getModel()
							.getMetaModel()
							.getMetaPath(sPath);
				}
				//Supporting sPath of any format, either '/<entitySet>/<navigationCollection>' <OR> '/<entitySet>/$Type/<navigationCollection>'
				aParts = sPath.split("/").filter(function(sPart) {
					return sPart && sPart != "$Type";
				}); //filter out empty strings and parts referring to '$Type'
				entitySet = "/" + aParts[0];
				if (aParts.length === 1) {
					return entitySet;
				}
				navigationCollection = navCollection === undefined ? aParts.slice(1).join("/$NavigationPropertyBinding/") : navCollection;
				return entitySet + "/$NavigationPropertyBinding/" + navigationCollection; // used in gotoTargetEntitySet method in the same file
			},

			isPropertyFilterable: function(property, oInterface, oDataField) {
				var oModel = oInterface.context.getModel(),
					sPropertyPath = oInterface.context.getPath(),
					sEntitySetPath = Helper.getEntitySetForPropertyPath(oModel, sPropertyPath),
					sProperty = sPropertyPath.replace(sEntitySetPath + "/", "");

				if (
					oDataField &&
					(oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
						oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation")
				) {
					return false;
				}

				return CommonUtils.isPropertyFilterable(oModel, sEntitySetPath, sProperty);
			},

			formatDraftLockText: function(IsActiveEntity, HasDraftEntity, LockedBy) {
				if (!IsActiveEntity) {
					return ResourceModel.getText("M_COMMON_DRAFT_OBJECT");
				} else if (HasDraftEntity) {
					if (LockedBy) {
						return ResourceModel.getText("M_COMMON_DRAFT_LOCKED_OBJECT");
					} else {
						return ResourceModel.getText("draft.UNSAVED_CHANGES");
					}
				} else {
					return ""; // not visible
				}
			},

			getEntitySetForPropertyPath: function(oModel, sPropertyPath) {
				var iLength;
				var sEntitySetPath = sPropertyPath.slice(0, sPropertyPath.indexOf("/", 1));
				if (oModel.getObject(sEntitySetPath + "/$kind") === "EntityContainer") {
					iLength = sEntitySetPath.length + 1;
					sEntitySetPath = sPropertyPath.slice(iLength, sPropertyPath.indexOf("/", iLength));
				}
				return sEntitySetPath;
			},

			_resolveValueHelpField: function(oContext) {
				// context is a value list property - we need to jump to its value list model to return context to the field
				var oValueListModel = oContext.getModel();
				var oValueListData = oValueListModel.getObject("/");
				return oValueListData.$model
					.getMetaModel()
					.createBindingContext("/" + oValueListData.CollectionPath + "/" + oContext.getObject());
			},
			/**
			 * Method to fetch the boolean property value from an annotation.
			 * @param {object} oAnnotation Annotation
			 * @returns {boolean} Value of the annotation
			 */
			getBoolAnnotationValue: function(oAnnotation) {
				var bValue = oAnnotation || false;
				bValue = bValue === true || (bValue && bValue["Bool"] !== "false");
				return bValue;
			},
			gotoTargetEntitySet: function(oContext) {
				var sPath = Helper.getTargetCollection.call(Helper, oContext);
				return sPath + "/$";
			},
			gotoActionParameter: function(oContext) {
				var sPath = oContext.getPath(),
					sPropertyName = oContext.getObject(sPath + "/$Name");
				var sContext;
				if (sPath.indexOf("@$ui5.overload") > -1) {
					sContext = sPath.split("@$ui5.overload")[0];
				} else {
					// For Unbound Actions in Action Parameter Dialogs
					var aAction = sPath.split("/0/")[0].split(".");
					sContext = "/" + aAction[aAction.length - 1] + "/";
				}
				return sContext + sPropertyName;
			},

			getLabel: function(oMetadataContext, sPath) {
				sPath = sPath || "";
				return (
					oMetadataContext.getProperty(sPath + "@@sap.ui.model.odata.v4.AnnotationHelper.label") ||
					oMetadataContext.getProperty(sPath + "@com.sap.vocabularies.Common.v1.Label") ||
					oMetadataContext.getProperty(sPath + "/@com.sap.vocabularies.Common.v1.Label") ||
					oMetadataContext.getProperty(sPath + "@sapui.name")
				);
			},

			/**
			 * Returns the entity set name from the entity type name.
			 *
			 * @param {object} oMetaModel - OData v4 metamodel instance
			 * @param {string} sEntityType sEntity - EntityType of the actiom
			 * @returns {string} - EntitySet of the bound action
			 * @private
			 * @ui5-restricted
			 */
			getEntitySetName: function(oMetaModel, sEntityType) {
				var oEntityContainer = oMetaModel.getObject("/");
				for (var key in oEntityContainer) {
					if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
						return key;
					}
				}
			},
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
			getActionPath: function(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
				var sEntityName = oAction.getPath().split("/@")[0];

				sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;

				if (sActionName && sActionName.indexOf("(") > -1) {
					// action bound to another entity type
					sActionName = sActionName.split("(")[0];
					sEntityName = sEntityName.substr(1);
				} else {
					// TODO: this logic sounds wrong, to be corrected
					sEntityName = oAction.getObject(sEntityName).$Type;
					sEntityName = this.getEntitySetName(oAction.getModel(), sEntityName);
				}

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
			},
			/**
			 * Helper to get Edit Mode for a DataField or Rating Indicator.
			 *
			 * @function
			 * @name getEditMode
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAnnotations Object containing all the Annotations of a Field
			 * @param {string} sDataFieldType Type of the Field
			 * @param {object} oFieldControl Object containing FieldControl Type for a Field
			 * @param {string} sEditMode Edit Mode fetched from the parent of the field
			 * @param {string} sCreateMode Create Mode fetched from the parent of the field. This is used to check if the object is in create mode or edit mode so as to correcltly render the immutable fields
			 * @param oUoMFieldControl
			 * @param {object} oEntityType Entity Type
			 * @param {string} sPropertyPath property path
			 * @returns {string|boolean} the edit Mode
			 * A runtime binding or fixed string value for Field
			 * true/false for Rating Indicator
			 */
			getEditMode: function(
				oAnnotations,
				sDataFieldType,
				oFieldControl,
				sEditMode,
				sCreateMode,
				oUoMFieldControl,
				oEntityType,
				sPropertyPath
			) {
				if (sEditMode === "Display" || sEditMode === "ReadOnly" || sEditMode === "Disabled") {
					// the edit mode is hardcoded to a non-editable mode so no need to check any annotations
					return sEditMode;
				}
				var bComputed,
					bImmutable,
					sSemiExpression,
					sExpression,
					bDisplayOnly,
					sCheckUiEditMode,
					sFieldControlForUoM,
					sEditableReadOnly,
					bCanCreateProperty,
					sIsFieldControlPathReadOnly,
					sIsFieldControlPathDisabled,
					bIsKey = oEntityType && oEntityType.$Key.indexOf(sPropertyPath) > -1;

				if (
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" ||
					(oAnnotations &&
						oAnnotations["@com.sap.vocabularies.Common.v1.SemanticObject"] &&
						!(
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListReferences"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListMapping"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueList"] ||
							oAnnotations["@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"]
						))
				) {
					return "Display";
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Computed"]) {
					bComputed = oAnnotations["@Org.OData.Core.V1.Computed"].Bool
						? oAnnotations["@Org.OData.Core.V1.Computed"].Bool == "true"
						: true;
				}
				if (oAnnotations && oAnnotations["@Org.OData.Core.V1.Immutable"]) {
					bImmutable = oAnnotations["@Org.OData.Core.V1.Immutable"].Bool
						? oAnnotations["@Org.OData.Core.V1.Immutable"].Bool == "true"
						: true;
				}

				if (bIsKey && !bComputed && bImmutable) {
					// non-computed key shall be only editable in new transient contexts
					// TODO: ui mode is not considered but as a simple version expect new transient contexts as editable
					// anything else doesn't make any sense -> to be refactored (as the whole method)
					return "{= %{@$ui5.context.isTransient} === true ? 'Editable' : 'Display'}";
				}

				bDisplayOnly = bComputed || bImmutable || bIsKey;
				if (sCreateMode && sCreateMode.indexOf("{") === 0) {
					sCreateMode = "$" + sCreateMode;
				}
				bCanCreateProperty = typeof bComputed === "undefined" ? typeof bImmutable === "undefined" : !bComputed;
				if (oFieldControl) {
					if (oFieldControl.indexOf("{") === 0) {
						sIsFieldControlPathReadOnly = "$" + oFieldControl + " === '1'";
						sIsFieldControlPathDisabled = "$" + oFieldControl + " === '0'";
					} else {
						bDisplayOnly = bDisplayOnly || oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly";
					}
				}
				var sEditableExpression;
				var sDisplayOrReadOnly;
				var sDisplayOrDisabled;
				var sFieldControlDisplayOrReadOnly;

				if (sIsFieldControlPathReadOnly) {
					sFieldControlDisplayOrReadOnly =
						sEditMode === "Editable" ? "'ReadOnly'" : "$" + sEditMode + " === 'Editable' ? 'ReadOnly'  : 'Display'";
					if (bCanCreateProperty) {
						sDisplayOrReadOnly =
							sEditMode === "Editable"
								? sCreateMode + " ? 'Editable' : 'ReadOnly'"
								: "$" + sEditMode + " === 'Editable' ? " + sCreateMode + "? 'Editable' : 'ReadOnly'  : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					} else {
						sDisplayOrReadOnly =
							sEditMode === "Editable" ? "'ReadOnly'" : "$" + sEditMode + " === 'Editable' ? 'ReadOnly' : 'Display'";
						sDisplayOrDisabled =
							sEditMode === "Editable" ? "'Disabled'" : "$" + sEditMode + " === 'Editable' ? 'Disabled' : 'Display'";
					}
				} else {
					sDisplayOrReadOnly = "'Display'";
					sDisplayOrDisabled = "'Display'";
					sFieldControlDisplayOrReadOnly = "'Display'";
				}
				sCheckUiEditMode = sEditMode && sEditMode.indexOf("{") === 0 ? "$" + sEditMode : "'" + sEditMode + "'";
				if (bDisplayOnly) {
					if (!bCanCreateProperty) {
						if (sEditMode && sEditMode.indexOf("{") === 0) {
							return "{= " + sDisplayOrReadOnly + "}";
						}
						sDisplayOrReadOnly = sDisplayOrReadOnly.split("'") && sDisplayOrReadOnly.split("'")[1];
						return sDisplayOrReadOnly;
					} else {
						if (sIsFieldControlPathReadOnly) {
							if (sCreateMode && sCreateMode.indexOf("$") === 0) {
								return (
									"{= " +
									sCreateMode +
									" ? (" +
									sIsFieldControlPathDisabled +
									"? " +
									"'Disabled'" +
									" : " +
									sIsFieldControlPathReadOnly +
									"? " +
									"'ReadOnly'" +
									" : " +
									sCheckUiEditMode +
									") : " +
									sDisplayOrReadOnly +
									"}"
								);
							} else if (sCreateMode == "true") {
								return (
									"{= " +
									sIsFieldControlPathDisabled +
									"? " +
									"'Disabled'" +
									" : " +
									sIsFieldControlPathReadOnly +
									"? " +
									"'ReadOnly'" +
									" : " +
									"${ui>/editMode} === 'Editable'" +
									"}"
								);
							} else {
								return "{= " + sDisplayOrReadOnly + "}";
							}
						} else if (oFieldControl == "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
							sCheckUiEditMode = "'ReadOnly'";
						}
						if (sCreateMode && sCreateMode.indexOf("$") === 0) {
							return "{= " + sCreateMode + " ?" + "${ui>/editMode} === 'Editable'" + " : " + sDisplayOrReadOnly + "}";
						} else if (sCreateMode == "true") {
							return "{= " + sCheckUiEditMode + "}";
						} else {
							return "{= " + sDisplayOrReadOnly + "}";
						}
					}
				}
				if (sIsFieldControlPathReadOnly) {
					if (oUoMFieldControl && oUoMFieldControl.indexOf("{") === 0) {
						sCheckUiEditMode = "$" + oUoMFieldControl + " === '1' ? 'EditableReadOnly' : " + sCheckUiEditMode;
					} else if (oUoMFieldControl === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly") {
						sCheckUiEditMode = "EditableReadOnly";
					}
					sSemiExpression =
						sIsFieldControlPathDisabled +
						" ? " +
						sDisplayOrDisabled +
						" :" +
						sIsFieldControlPathReadOnly +
						" ? " +
						sFieldControlDisplayOrReadOnly +
						" :" +
						sCheckUiEditMode;
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else if (
					oUoMFieldControl &&
					(oUoMFieldControl.indexOf("{") === 0 || oUoMFieldControl === "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly")
				) {
					sFieldControlForUoM = oUoMFieldControl.indexOf("{") === 0 ? "$" + oUoMFieldControl + " === '1'" : undefined;
					sEditableReadOnly =
						sEditMode === "Editable"
							? "'EditableReadOnly'"
							: "$" + sEditMode + " === 'Editable' ? 'EditableReadOnly' : 'Display'";
					if (sFieldControlForUoM) {
						sSemiExpression = sFieldControlForUoM + " ? " + sEditableReadOnly + " :" + sCheckUiEditMode;
					} else {
						sSemiExpression = sEditableReadOnly;
					}
					sEditableExpression = "{= " + sSemiExpression + "}";
				} else {
					sSemiExpression = sCheckUiEditMode;
					sEditableExpression = sEditMode;
				}
				var sExpressionForCreatemode;
				if (sCreateMode && sCreateMode.indexOf("$") === 0) {
					sExpressionForCreatemode = "{= " + sCreateMode + " ? " + sDisplayOrReadOnly + " : " + sSemiExpression + "}";
				} else if (sCreateMode == "true") {
					sExpressionForCreatemode = "{= " + sDisplayOrReadOnly + "}";
				} else {
					sExpressionForCreatemode = "{= " + sSemiExpression + "}";
				}
				sExpression = bCanCreateProperty ? sEditableExpression : sExpressionForCreatemode;
				return sExpression;
			},

			getNavigationContext: function(oContext) {
				return ODataModelAnnotationHelper.getNavigationPath(oContext.getPath());
			},

			/**
			 * Returns the path without the entity type (potentially first) and property (last) part (optional).
			 * The result can be an empty string if it is a simple direct property.
			 *
			 * If and only if the given property path starts with a slash (/), it is considered that the entity type
			 * is part of the path and will be stripped away.
			 *
			 * @param sPropertyPath
			 * @param bKeepProperty
			 * @returns {string} the navigation path
			 */
			getNavigationPath: function(sPropertyPath, bKeepProperty) {
				var bStartsWithEntityType = sPropertyPath.startsWith("/");
				var aParts = sPropertyPath.split("/").filter(function(part) {
					return !!part;
				});
				if (bStartsWithEntityType) {
					aParts.shift();
				}
				if (!bKeepProperty) {
					aParts.pop();
				}
				return aParts.join("/");
			},

			/**
			 * Method to get the Hidden Value Expression property from a DataField or a DataFieldforAnnotation
			 * 1. If UI.Hidden has '$Path', then we take the value at '$Path' directly for same entity set.
			 * 2. Else, value at navigationEntity then check if it is 1:1 assosciation for the entityset and allow to take the correspoind '$Path'.
			 *
			 * @param {object} oDataField - context from which DataField needs to be extracted.
			 * @param {object} oDetails - context from which EntitySet needs to be extracted.
			 * @returns {string|boolean} - if Hidden is a path string is been returned if the association is not collection then it returns true by default
			 */
			getHiddenPathExpression: function(oDataField, oDetails) {
				var oContext = oDetails.context,
					sPropertyPath = oContext.getPath(),
					sEntitySetPath = ODataModelAnnotationHelper.getNavigationPath(sPropertyPath),
					aHiddenPath = [],
					sHiddenPath,
					sPropertyHiddenPath;
				// get sHiddenPath at DataField Level
				if (oContext.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden")) {
					aHiddenPath.push(oContext.getObject(sPropertyPath + "@com.sap.vocabularies.UI.v1.Hidden"));
				}
				// get sHiddenPath at referenced Property Level
				if (sPropertyPath.lastIndexOf("/") === sPropertyPath.length - 1) {
					sPropertyHiddenPath = "Value/$Path@com.sap.vocabularies.UI.v1.Hidden";
				} else {
					sPropertyHiddenPath = "/Value/$Path@com.sap.vocabularies.UI.v1.Hidden";
				}
				if (oContext.getObject(sPropertyPath + sPropertyHiddenPath)) {
					aHiddenPath.push(oContext.getObject(sPropertyPath + sPropertyHiddenPath));
				}
				if (aHiddenPath.length) {
					var aHiddenExpression = [];
					for (var i = 0; i < aHiddenPath.length; i++) {
						sHiddenPath = aHiddenPath[i];
						if (sHiddenPath.$Path) {
							if (sHiddenPath.$Path.indexOf("/") > 0) {
								var sNavigationPath = sHiddenPath.$Path.split("/")[0];
								if (
									oContext.getObject(sEntitySetPath + "/" + sNavigationPath) &&
									!oContext.getObject(sEntitySetPath + "/" + sNavigationPath).$isCollection
								) {
									aHiddenExpression.push("%{" + sHiddenPath.$Path + "}");
								} else {
									aHiddenExpression.push(false);
								}
							} else {
								aHiddenExpression.push("%{" + sHiddenPath.$Path + "}");
							}
						} else {
							aHiddenExpression.push(sHiddenPath);
						}
					}
					if (aHiddenExpression.length === 1) {
						return "{= " + aHiddenExpression[0] + " === true ? false : true }";
					} else {
						return "{= (" + aHiddenExpression[0] + " === true || " + aHiddenExpression[1] + " === true ) ? false : true }";
					}
				}
				return true;
			},
			/**
			 * Returns the metamodel path correctly for bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
			 * @function
			 * @static
			 * @name sap.fe.macros.CommonHelper.getActionContext
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getActionContext: function(oAction) {
				return Helper.getActionPath(oAction, true);
			},
			/**
			 * Returns the metamodel path correctly for overloaded bound actions. For unbound actions,
			 * incorrect path is returned but during templating it is ignored.
			 * e.g. for bound action someNameSpace.SomeBoundAction of entity set SomeEntitySet,
			 * the string "/SomeEntitySet/someNameSpace.SomeBoundAction/@$ui5.overload/0" is returned.
			 * @function
			 * @static
			 * @name sap.fe.macros.CommonHelper.getPathToBoundActionOverload
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oAction - context object for the action
			 * @returns {string} - Correct metamodel path for bound action overload and incorrect path for unbound actions
			 * @private
			 * @ui5-restricted
			 **/
			getPathToBoundActionOverload: function(oAction) {
				var sPath = Helper.getActionPath(oAction, true);
				return sPath + "/@$ui5.overload/0";
			},

			/**
			 * Returns the string with single quotes.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sValue - Some string that needs to be converted into single quotes
			 * @returns {string} - String with single quotes
			 **/
			addSingleQuotes: function(sValue) {
				return "'" + sValue + "'";
			},

			/**
			 * Returns function string,
			 * First argument of generateFunction is name of the generated function string.
			 * Remaining arguments of generateFunction are args to generated function string.
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sFuncName - Some string for the function name
			 * @returns {string} - Function string depends on args passed
			 **/
			generateFunction: function(sFuncName) {
				var sParams = "";
				for (var i = 1; i < arguments.length; i++) {
					sParams += arguments[i];
					if (i < arguments.length - 1) {
						sParams += ", ";
					}
				}

				var sFunction = sFuncName + "()";
				if (sParams) {
					sFunction = sFuncName + "(" + sParams + ")";
				}
				return sFunction;
			},
			/*
			 * Returns the visibility expression for datapoint title/link
			 *
			 * @function
			 * @param {string} [sPath] annotation path of data point or Microchart
			 * @param {boolean} [bLink] true if link visibility is being determined, false if title visibility is being determined
			 * @param {boolean} [bFieldVisibility] true if field is vsiible, false otherwise
			 * @returns  {string} sVisibilityExp Used to get the  visibility binding for DataPoints title in the Header.
			 *
			 */

			getHeaderDataPointLinkVisibility: function(sPath, bLink, bFieldVisibility) {
				var sVisibilityExp;
				if (bFieldVisibility) {
					sVisibilityExp = bLink
						? "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} === true && " + bFieldVisibility + "}"
						: "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} !== true && " + bFieldVisibility + "}";
				} else {
					sVisibilityExp = bLink
						? "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} === true}"
						: "{= ${internal>isHeaderDPLinkVisible/" + sPath + "} !== true}";
				}
				return sVisibilityExp;
			},

			/**
			 * Converts object to string(different from JSON.stringify or.toString).
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} oParams - Some object
			 * @returns {string} - Object string
			 **/
			objectToString: function(oParams) {
				var iNumberOfKeys = Object.keys(oParams).length,
					sParams = "";

				for (var sKey in oParams) {
					var sValue = oParams[sKey];
					if (sValue && typeof sValue === "object") {
						sValue = this.objectToString(sValue);
					}
					sParams += sKey + ": " + sValue;
					if (iNumberOfKeys > 1) {
						--iNumberOfKeys;
						sParams += ", ";
					}
				}

				var sObject = "{ " + sParams + "}";
				return sObject;
			},

			/**
			 * Removes escape characters (\) from an expression.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {string} sExpression - An expression with escape characters
			 * @returns {string} - Expression string without escape characters or undefined
			 **/
			removeEscapeCharacters: function(sExpression) {
				return sExpression ? sExpression.replace(/\\?\\([{}])/g, "$1") : undefined;
			},

			/**
			 * Checks if the stashed property is set for a facet in the controlConfiguration section of the manifest.
			 * Note: This is currently only relevant for header facets.
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {object} oViewData - The viewData object from the manifest
			 * @param {object} oFacet - The facet metadata
			 * @param {object} oCollectionFacet - The collection facet metadata, if there is any, else the header facet itself
			 * @returns {boolean} - true if the facet should be stashed
			 **/
			getStashed: function(oViewData, oFacet, oCollectionFacet) {
				// When a HeaderFacet is nested inside a CollectionFacet, stashing is not supported
				if (
					oCollectionFacet &&
					oCollectionFacet.Facet &&
					oCollectionFacet.Facet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet" &&
					oFacet &&
					oFacet.Facet &&
					oFacet.Facet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet"
				) {
					return false;
				}
				var oControlConfiguration = oViewData.controlConfiguration,
					// For EditableHeaderFacet we use oFacet.Facet.id
					sFacetId = oFacet.Facet.id
						? oFacet.Facet.id.substring(oFacet.Facet.id.lastIndexOf("::") + 2)
						: StableIdHelper.generate([oFacet]),
					bStashed =
						oControlConfiguration &&
						oControlConfiguration["@com.sap.vocabularies.UI.v1.HeaderFacets"] &&
						oControlConfiguration["@com.sap.vocabularies.UI.v1.HeaderFacets"]["facets"] &&
						oControlConfiguration["@com.sap.vocabularies.UI.v1.HeaderFacets"]["facets"][sFacetId] &&
						oControlConfiguration["@com.sap.vocabularies.UI.v1.HeaderFacets"]["facets"][sFacetId]["stashed"];
				return bStashed === true;
			},

			/**
			 * Updates a stringified object in order to work properly in a template (adds ui5Object:true).
			 *
			 * @param {string} sStringified
			 * @returns {string} the updated stringified object
			 */
			stringifyObject: function(sStringified) {
				if (!sStringified) {
					return undefined;
				} else {
					var oObject = JSON.parse(sStringified);
					if (typeof oObject === "object" && !Array.isArray(oObject)) {
						var oUI5Object = {
							ui5object: true
						};
						Object.assign(oUI5Object, oObject);
						return JSON.stringify(oUI5Object);
					} else {
						var sType = Array.isArray(oObject) ? "Array" : typeof oObject;
						Log.error("Unexpected object type in stringifyObject (" + sType + ") - only works with object");
						throw new Error("stringifyObject only works with objects!");
					}
				}
			},

			/**
			 * Stringifies the given data, taking care that it is not treated as a binding expression.
			 * @param {object} vData the data to stringify
			 * @returns {string} the stringified data
			 */
			stringifyCustomData: function(vData) {
				var oObject = {
					ui5object: true
				};
				oObject["customData"] = vData instanceof Context ? vData.getObject() : vData;
				return JSON.stringify(oObject);
			},

			/**
			 * Parses the given data, potentially unwraps the data.
			 * @param {object | string} vData the data to parse
			 * @returns {object} the parsed data
			 */
			parseCustomData: function(vData) {
				var vData = typeof vData === "string" ? JSON.parse(vData) : vData;
				if ("customData" in vData) {
					return vData["customData"];
				}
				return vData;
			},
			/**
			 * @function
			 * @name _getDraftAdministrativeDataType
			 * @param {object} oMetaModel
			 * @param {string} sEntityType entity name
			 * @returns {object} DraftAdministrativeData
			 */
			_getDraftAdministrativeDataType: function(oMetaModel, sEntityType) {
				return oMetaModel.requestObject("/" + sEntityType + "/DraftAdministrativeData/");
			},
			/**
			 * @function
			 * @name getPopoverText
			 * @param {iContext} iContext
			 * @param {string} sEntityType entity name
			 * @returns {string} sBindings
			 */
			getPopoverText: function(iContext, sEntityType) {
				return Helper._getDraftAdministrativeDataType(iContext.getModel(), sEntityType).then(function(oDADEntityType) {
					var sBinding =
						"{parts: [{path: 'HasDraftEntity', targetType: 'any'}, " +
						//"{path: 'DraftAdministrativeData/LastChangeDateTime'}, " +
						"{path: 'DraftAdministrativeData/InProcessByUser'}, " +
						"{path: 'DraftAdministrativeData/LastChangedByUser'} ";
					if (oDADEntityType.InProcessByUserDescription) {
						sBinding += " ,{path: 'DraftAdministrativeData/InProcessByUserDescription'}";
					}

					if (oDADEntityType.LastChangedByUserDescription) {
						sBinding += ", {path: 'DraftAdministrativeData/LastChangedByUserDescription'}";
					}
					sBinding += "], formatter: 'sap.fe.macros.field.FieldRuntime.formatDraftOwnerTextInPopover'}";
					return sBinding;
				});
			},
			getContextPath: function(oValue, oInterface) {
				return oInterface && oInterface.context && oInterface.context.getPath();
			},
			/**
			 * Returns a stringified JSON object containing  Presentation Variant sort conditions.
			 * @param {object} oPresentationVariant Presentation variant Annotation
			 * @param sPresentationVariantPath
			 * @returns {string} Stringified JSON object
			 */
			getSortConditions: function(oPresentationVariant, sPresentationVariantPath) {
				if (
					oPresentationVariant &&
					this._isPresentationVariantAnnotation(sPresentationVariantPath) &&
					oPresentationVariant.SortOrder
				) {
					var aSortConditions = {
						sorters: []
					};
					oPresentationVariant.SortOrder.forEach(function(oCondition) {
						var oSorter = {};
						oSorter.name = oCondition.Property.$PropertyPath;
						oSorter.descending = !!oCondition.Descending;
						aSortConditions.sorters.push(oSorter);
					});
					return JSON.stringify(aSortConditions);
				}
				return undefined;
			},
			_isPresentationVariantAnnotation: function(sAnnotationPath) {
				return (
					sAnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.PresentationVariant") > -1 ||
					sAnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.SelectionPresentationVariant") > -1
				);
			},
			createPresentationPathContext: function(oPresentationContext) {
				var aPaths = oPresentationContext.sPath.split("@") || [];
				var oModel = oPresentationContext.getModel();
				if (aPaths.length && aPaths[aPaths.length - 1].indexOf("com.sap.vocabularies.UI.v1.SelectionPresentationVariant") > -1) {
					var sPath = oPresentationContext.sPath.split("/PresentationVariant")[0];
					return oModel.createBindingContext(sPath + "@sapui.name");
				}
				return oModel.createBindingContext(oPresentationContext.sPath + "@sapui.name");
			},
			getPressHandlerForDataFieldForIBN: function(oDataField, sContext, bNavigateWithConfirmationDialog) {
				var mNavigationParameters = {
					navigationContexts: sContext ? sContext : "${$source>/}.getBindingContext()"
				};
				if (oDataField.RequiresContext && !oDataField.Inline && bNavigateWithConfirmationDialog) {
					mNavigationParameters.applicableContexts =
						"${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/aApplicable/}";
					mNavigationParameters.notApplicableContexts =
						"${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/aNotApplicable/}";
					mNavigationParameters.label = "'" + oDataField.Label + "'";
				}
				if (oDataField.Mapping) {
					mNavigationParameters.semanticObjectMapping = this.addSingleQuotes(JSON.stringify(oDataField.Mapping));
				}
				return this.generateFunction(
					bNavigateWithConfirmationDialog
						? "._intentBasedNavigation.navigateWithConfirmationDialog"
						: "._intentBasedNavigation.navigate",
					this.addSingleQuotes(oDataField.SemanticObject),
					this.addSingleQuotes(oDataField.Action),
					this.objectToString(mNavigationParameters)
				);
			},
			getEntitySet: function(oContext) {
				var sPath = oContext.getPath();
				return ModelHelper.getEntitySetPath(sPath);
			},
			_isRatingIndicator: function(oControl) {
				if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
					var vContentDisplay = Array.isArray(oControl.getContentDisplay())
						? oControl.getContentDisplay()[0]
						: oControl.getContentDisplay();
					if (vContentDisplay && vContentDisplay.isA("sap.m.RatingIndicator")) {
						return true;
					}
				}
				return false;
			},
			_updateStyleClassForRatingIndicator: function(oFieldWrapper, bLast) {
				var vContentDisplay = Array.isArray(oFieldWrapper.getContentDisplay())
					? oFieldWrapper.getContentDisplay()[0]
					: oFieldWrapper.getContentDisplay();
				var vContentEdit = Array.isArray(oFieldWrapper.getContentEdit())
					? oFieldWrapper.getContentEdit()[0]
					: oFieldWrapper.getContentEdit();

				if (bLast) {
					vContentDisplay.addStyleClass("sapUiNoMarginBottom");
					vContentDisplay.addStyleClass("sapUiNoMarginTop");
					vContentEdit.removeStyleClass("sapUiTinyMarginBottom");
				} else {
					vContentDisplay.addStyleClass("sapUiNoMarginBottom");
					vContentDisplay.removeStyleClass("sapUiNoMarginTop");
					vContentEdit.addStyleClass("sapUiTinyMarginBottom");
				}
			},
			/**
			 * Handles the enablement of form menu actions both in path based and static value scenarios.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {*} sEnabledValue - Either static boolean values or Array of path expressions for enablement of menu button.
			 * @returns {*} - path expression or boolean value.
			 **/
			handleEnablementOfMenuActions: function(sEnabledValue) {
				var sPath = "";
				if (Array.isArray(sEnabledValue)) {
					sPath = "{= (" + sEnabledValue[0] + ")";
					for (var i = 1; i < sEnabledValue.length; i++) {
						sPath = sPath + " || (" + sEnabledValue[i] + ")";
					}
					sPath = sPath + " }";
					return sPath;
				}
				return sEnabledValue;
			},
			/**
			 * Handles the visibility of form menu actions both in path based and static value scenarios.
			 *
			 * @function
			 * @memberof sap.fe.macros.CommonHelper
			 * @param {*} sVisibleValue - Either static boolean values or Array of path expressions for visibility of menu button.
			 * @returns {*} - path expression or boolean value.
			 **/
			handleVisibilityOfMenuActions: function(sVisibleValue) {
				var sPath = "";
				if (Array.isArray(sVisibleValue)) {
					sPath = "{= (" + sVisibleValue[0] + ")";
					for (var i = 1; i < sVisibleValue.length; i++) {
						sPath = sPath + " || (" + sVisibleValue[i] + ")";
					}
					sPath = sPath + " }";
					return sPath;
				}
				return sVisibleValue;
			}
		};

		Helper.isPropertyFilterable.requiresIContext = true;
		Helper.getPopoverText.requiresIContext = true;

		return Helper;
	},
	/* bExport= */
	true
);
