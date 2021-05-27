import { getDisplayMode, PropertyOrPath, DisplayMode } from "sap/fe/core/templating/UIFormatters";
import {
	DataModelObjectPath,
	enhanceDataModelPath,
	getPathRelativeLocation,
	getContextRelativeTargetObjectPath
} from "sap/fe/core/templating/DataModelPathHelper";
import { Property } from "@sap-ux/annotation-converter";
import {
	Expression,
	annotationExpression,
	formatResult,
	addTypeInformation,
	transformRecursively,
	BindingExpressionExpression,
	BindingExpression,
	compileBinding,
	constant,
	bindingExpression
} from "sap/fe/core/helpers/BindingExpression";
import {
	isPathExpression,
	getAssociatedUnitProperty,
	getAssociatedCurrencyProperty,
	isProperty,
	getAssociatedUnitPropertyPath,
	getAssociatedCurrencyPropertyPath,
	hasValueHelp,
	getAssociatedTextPropertyPath
} from "sap/fe/core/templating/PropertyHelper";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import * as PropertyHelper from "sap/fe/core/templating/PropertyHelper";
import { DataFieldWithUrl, UIAnnotationTypes } from "@sap-ux/vocabularies-types";

export type FormatOptions = {
	valueFormat: String;
	textAlignMode: String;
	displayMode: DisplayMode;
	textLinesDisplay: String;
	textLinesEdit: String;
	showEmptyIndicator: boolean;
	semanticKeyStyle: String;
	showIconUrl: boolean;
};

export type EditStyle =
	| "InputWithValueHelp"
	| "TextArea"
	| "DatePicker"
	| "TimePicker"
	| "DateTimePicker"
	| "CheckBox"
	| "InputWithUnit"
	| "Input";

export type DisplayStyle =
	| "Text"
	| "Avatar"
	| "DataPoint"
	| "Contact"
	| "Button"
	| "Link"
	| "ObjectStatus"
	| "AmountWithCurrency"
	| "SemanticKeyWithDraftIndicator"
	| "ObjectIdentifier"
	| "LabelSemanticKey"
	| "LinkWithQuickViewForm"
	| "LinkWrapper";

/**
 * Recursively add the text arrangement to a binding expression.
 *
 * @param bindingExpression the binding expression to enhance
 * @param fullContextPath the current context path we're on (to properly resolve the text arrangement properties)
 * @returns an updated expression.
 */
export const addTextArrangementToBindingExpression = function(
	bindingExpression: Expression<any>,
	fullContextPath: DataModelObjectPath
): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
		}
		return outExpression;
	});
};

export const getBindingWithUnitOrCurrency = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>
): Expression<string> {
	const oPropertyDefinition = oPropertyDataModelPath.targetObject as Property;
	const unit = oPropertyDefinition.annotations?.Measures?.Unit;
	const relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties);
	//TODO we might want to do a format label of the unit
	propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
	let output = propertyBindingExpression;
	if (unit) {
		output = addTypeInformation(
			[
				propertyBindingExpression,
				formatWithTypeInformation((unit as any).$target, annotationExpression(unit, relativeLocation) as Expression<string>)
			],
			"sap.ui.model.odata.type.Unit"
		);
	} else {
		const currency = oPropertyDefinition.annotations?.Measures?.ISOCurrency;
		if (currency) {
			output = addTypeInformation(
				[propertyBindingExpression, annotationExpression(currency, relativeLocation) as Expression<string>],
				"sap.ui.model.odata.type.Currency"
			);
		}
	}
	return output;
};

export const getBindingWithTextArrangement = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>,
	formatOptions?: FormatOptions
): Expression<string> {
	const targetDisplayModeOverride = formatOptions?.displayMode;
	let outExpression = propertyBindingExpression;
	const oPropertyDefinition = oPropertyDataModelPath.targetObject as Property;
	let expressionFormatOptions;
	if (oPropertyDefinition.type === "Edm.Date" && formatOptions?.valueFormat) {
		expressionFormatOptions = { style: formatOptions.valueFormat };
	}
	const targetDisplayMode = targetDisplayModeOverride || getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
	const commonText = oPropertyDefinition.annotations?.Common?.Text;
	const relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties);
	propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression, expressionFormatOptions);
	if (targetDisplayMode !== "Value" && commonText) {
		switch (targetDisplayMode) {
			case "Description":
				outExpression = annotationExpression(commonText, relativeLocation) as Expression<string>;
				break;
			case "DescriptionValue":
				outExpression = formatResult(
					[annotationExpression(commonText, relativeLocation) as Expression<string>, propertyBindingExpression],
					valueFormatters.formatWithBrackets
				);
				break;
			case "ValueDescription":
				outExpression = formatResult(
					[propertyBindingExpression, annotationExpression(commonText, relativeLocation) as Expression<string>],
					valueFormatters.formatWithBrackets
				);
				break;
		}
	}
	return outExpression;
};

export const formatValueRecursively = function(bindingExpression: Expression<any>, fullContextPath: DataModelObjectPath): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = formatWithTypeInformation(oPropertyDataModelPath.targetObject, expression);
		}
		return outExpression;
	});
};

const EDM_TYPE_MAPPING: Record<string, any> = {
	"Edm.Boolean": { type: "sap.ui.model.odata.type.Boolean" },
	"Edm.Byte": { type: "sap.ui.model.odata.type.Byte" },
	"Edm.Date": { type: "sap.ui.model.odata.type.Date" },
	"Edm.DateTimeOffset": {
		constraints: {
			"$Precision": "precision"
		},
		type: "sap.ui.model.odata.type.DateTimeOffset"
	},
	"Edm.Decimal": {
		constraints: {
			"@Org.OData.Validation.V1.Minimum/$Decimal": "minimum",
			"@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive": "minimumExclusive",
			"@Org.OData.Validation.V1.Maximum/$Decimal": "maximum",
			"@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive": "maximumExclusive",
			"$Precision": "precision",
			"$Scale": "scale"
		},
		type: "sap.ui.model.odata.type.Decimal"
	},
	"Edm.Double": { type: "sap.ui.model.odata.type.Double" },
	"Edm.Guid": { type: "sap.ui.model.odata.type.Guid" },
	"Edm.Int16": { type: "sap.ui.model.odata.type.Int16" },
	"Edm.Int32": { type: "sap.ui.model.odata.type.Int32" },
	"Edm.Int64": { type: "sap.ui.model.odata.type.Int64" },
	"Edm.SByte": { type: "sap.ui.model.odata.type.SByte" },
	"Edm.Single": { type: "sap.ui.model.odata.type.Single" },
	"Edm.Stream": { type: "sap.ui.model.odata.type.Stream" },
	"Edm.String": {
		constraints: {
			"@com.sap.vocabularies.Common.v1.IsDigitSequence": "isDigitSequence",
			"$MaxLength": "maxLength",
			"$Nullable": "nullable"
		},
		type: "sap.ui.model.odata.type.String"
	},
	"Edm.TimeOfDay": {
		constraints: {
			"$Precision": "precision"
		},
		type: "sap.ui.model.odata.type.TimeOfDay"
	}
};

export const formatWithTypeInformation = function(
	oProperty: Property,
	propertyBindingExpression: Expression<string>,
	expressionFormatOptions?: object
): Expression<string> {
	const outExpression: BindingExpressionExpression<any> = propertyBindingExpression as BindingExpressionExpression<any>;
	if (oProperty._type === "Property") {
		const oTargetMapping = EDM_TYPE_MAPPING[(oProperty as Property).type];
		if (oTargetMapping) {
			outExpression.type = oTargetMapping.type;
			if (oTargetMapping.constraints) {
				outExpression.constraints = {};
				if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
					outExpression.constraints.scale = oProperty.scale;
				}
				if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
					outExpression.constraints.precision = oProperty.precision;
				}
				if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
					outExpression.constraints.maxLength = oProperty.maxLength;
				}
				if (oTargetMapping.constraints.$Nullable && oProperty.nullable === false) {
					outExpression.constraints.nullable = oProperty.nullable;
				}
			}
			if (expressionFormatOptions && outExpression.type === "sap.ui.model.odata.type.Date") {
				outExpression.formatOptions = expressionFormatOptions;
			}
			if (outExpression.type === "sap.ui.model.odata.type.String") {
				if (!outExpression.formatOptions) {
					outExpression.formatOptions = {};
				}
				outExpression.formatOptions.parseKeepsEmptyString = true;
			}
		}
	}
	return outExpression;
};

export const getTextBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	formatOptions: FormatOptions
): BindingExpression<string> {
	if (
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataPointType" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl"
	) {
		// there is no resolved property so we return the value has a constant
		const fieldValue = oPropertyDataModelObjectPath.targetObject.Value || "";
		return compileBinding(constant(fieldValue));
	}
	if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
		const oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
		oPropertyDataModelObjectPath.targetObject = oNavPath.target;
		oNavPath.visitedObjects.forEach((oNavObj: any) => {
			if (oNavObj && oNavObj._type === "NavigationProperty") {
				oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
			}
		});
	}
	const oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
	const oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
	const oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);
	let oTargetBinding;
	if (oPropertyUnit || oPropertyCurrency) {
		oTargetBinding = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);
	} else {
		oTargetBinding = getBindingWithTextArrangement(oPropertyDataModelObjectPath, oBindingExpression, formatOptions);
	}
	// We don't include $$nopatch and parseKeepEmptyString as they make no sense in the text binding case
	return compileBinding(oTargetBinding);
};

export const getValueBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	formatOptions: FormatOptions,
	ignoreUnit: boolean = false,
	ignoreFormatting: boolean = false,
	bindingParameters?: object,
	targetTypeAny?: boolean
): BindingExpression<string> {
	if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
		const oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
		oPropertyDataModelObjectPath.targetObject = oNavPath.target;
		oNavPath.visitedObjects.forEach((oNavObj: any) => {
			if (oNavObj && oNavObj._type === "NavigationProperty") {
				oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
			}
		});
	}

	const targetObject = oPropertyDataModelObjectPath.targetObject;
	if (isProperty(targetObject)) {
		let oBindingExpression: BindingExpressionExpression<string> = bindingExpression(
			getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath)
		);
		if (targetObject.annotations?.Communication?.IsEmailAddress) {
			oBindingExpression.type = "sap.fe.core.type.Email";
		} else {
			const oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
			const oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);
			if (!ignoreUnit && (oPropertyUnit || oPropertyCurrency)) {
				oBindingExpression = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression) as any;
				if ((oPropertyUnit && !hasValueHelp(oPropertyUnit)) || (oPropertyCurrency && !hasValueHelp(oPropertyCurrency))) {
					// If there is a unit or currency without a value help we need to configure the binding to not show the measure, otherwise it's needed for the mdc field
					oBindingExpression.formatOptions = {
						showMeasure: false
					};
				}
			} else {
				oBindingExpression = formatWithTypeInformation(targetObject, oBindingExpression) as BindingExpressionExpression<string>;
				if (oBindingExpression.type === "sap.ui.model.odata.type.String") {
					oBindingExpression.formatOptions = {
						parseKeepsEmptyString: true
					};
				}
			}
		}
		if (ignoreFormatting) {
			delete oBindingExpression.formatOptions;
			delete oBindingExpression.constraints;
			delete oBindingExpression.type;
		}
		if (bindingParameters) {
			oBindingExpression.parameters = bindingParameters;
		}
		if (targetTypeAny) {
			oBindingExpression.targetType = "any";
		}

		return compileBinding(oBindingExpression);
	} else {
		if (targetObject && targetObject.$Type === UIAnnotationTypes.DataFieldWithUrl) {
			return compileBinding(annotationExpression((targetObject as DataFieldWithUrl).Value));
		} else {
			return "";
		}
	}
};

export const getUnitBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	formatOptions: FormatOptions
): BindingExpression<string> {
	const sUnitPropertyPath = getAssociatedUnitPropertyPath(oPropertyDataModelObjectPath.targetObject);
	const sCurrencyPropertyPath = getAssociatedCurrencyPropertyPath(oPropertyDataModelObjectPath.targetObject);
	if (sUnitPropertyPath || sCurrencyPropertyPath) {
		const targetPropertyPath = sUnitPropertyPath || sCurrencyPropertyPath;
		const oUOMPropertyDataModelObjectPath = enhanceDataModelPath(oPropertyDataModelObjectPath, targetPropertyPath);
		return getValueBinding(oUOMPropertyDataModelObjectPath, formatOptions);
	}
	return undefined;
};

export const getAssociatedTextBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	formatOptions: FormatOptions
): BindingExpression<string> {
	const textPropertyPath = getAssociatedTextPropertyPath(oPropertyDataModelObjectPath.targetObject);
	if (textPropertyPath) {
		const oTextPropertyPath = enhanceDataModelPath(oPropertyDataModelObjectPath, textPropertyPath);
		const oValueBinding = getValueBinding(oTextPropertyPath, formatOptions, true, true, { $$noPatch: true });
		return oValueBinding;
	}
	return undefined;
};

export const getDisplayStyle = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataField: any,
	oDataModelPath: DataModelObjectPath,
	formatOptions: FormatOptions
): DisplayStyle {
	// algorithm to determine the field fragment to use
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Text";
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	if (oProperty.annotations?.UI?.IsImageURL) {
		return "Avatar";
	}
	if (oProperty.type === "Edm.Stream") {
		return "Avatar";
	}
	switch (oDataField.$Type) {
		case "com.sap.vocabularies.UI.v1.DataPointType":
			return "DataPoint";
		case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
			if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
				return "DataPoint";
			} else if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
				return "Contact";
			}
			break;
		case "com.sap.vocabularies.UI.v1.DataFieldForAction":
		case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
			return "Button";
		case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
			return "Link";
	}
	if (oDataField.Criticality) {
		return "ObjectStatus";
	}
	if (oProperty.annotations?.Measures?.ISOCurrency) {
		return "AmountWithCurrency";
	}
	if (oProperty.annotations?.Communication?.IsEmailAddress || oProperty.annotations?.Communication?.IsPhoneNumber) {
		return "Link";
	}
	if (oDataModelPath?.targetEntitySet?.entityType?.annotations?.Common?.SemanticKey) {
		const aSemanticKeys = oDataModelPath.targetEntitySet.entityType.annotations.Common.SemanticKey;
		const bIsSemanticKey = !aSemanticKeys.every(function(oKey) {
			return oKey?.$target?.name !== oProperty.name;
			// need to check if it works also for direct properties
		});
		if (bIsSemanticKey && formatOptions.semanticKeyStyle) {
			if (oDataModelPath.targetEntitySet?.annotations?.Common?.DraftRoot) {
				// we then still check whether this is available at designtime on the entityset
				return "SemanticKeyWithDraftIndicator";
			}
			return formatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
		}
	}
	if (oProperty.annotations?.UI?.MultiLineText) {
		return "Text";
	}
	const aNavigationProperties = oDataModelPath?.targetEntitySet?.entityType?.navigationProperties || [];
	let bIsUsedInNavigationWithQuickViewFacets = false;
	aNavigationProperties.forEach(oNavProp => {
		if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
			oNavProp.referentialConstraint.forEach(oRefConstraint => {
				if (oRefConstraint?.sourceProperty === oProperty.name) {
					if (oNavProp?.targetType?.annotations?.UI?.QuickViewFacets) {
						bIsUsedInNavigationWithQuickViewFacets = true;
					}
				}
			});
		}
	});
	if (bIsUsedInNavigationWithQuickViewFacets) {
		return "LinkWithQuickViewForm";
	}
	if (oProperty.annotations?.Common?.SemanticObject) {
		return "LinkWrapper";
	}
	if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
		return "Link";
	}
	return "Text";
};

export const getEditStyle = function(oPropertyPath: PropertyOrPath<Property>, oDataField: any): EditStyle | null {
	// algorithm to determine the field fragment to use
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return null;
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	switch (oDataField.$Type) {
		case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
			if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
				return null;
			}
			break;
		//case "com.sap.vocabularies.UI.v1.DataPointType":TODO special handling for rating indicator
		case "com.sap.vocabularies.UI.v1.DataFieldForAction":
		case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
		case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
			return null;
	}
	const oPropertyUnit = getAssociatedUnitProperty(oProperty);
	const oPropertyCurrency = getAssociatedCurrencyProperty(oProperty);
	if (
		PropertyHelper.hasValueHelp(oProperty) ||
		(oPropertyUnit && PropertyHelper.hasValueHelp(oPropertyUnit)) ||
		(oPropertyCurrency && PropertyHelper.hasValueHelp(oPropertyCurrency))
	) {
		return "InputWithValueHelp";
	}
	if (oProperty.annotations?.UI?.MultiLineText && oProperty.type === "Edm.String") {
		return "TextArea";
	}
	switch (oProperty.type) {
		case "Edm.Date":
			return "DatePicker";
		case "Edm.Time":
		case "Edm.TimeOfDay":
			return "TimePicker";
		case "Edm.DateTime":
		case "Edm.DateTimeOffset":
			return "DateTimePicker";
		case "Edm.Boolean":
			return "CheckBox";
	}
	if (oProperty.annotations?.Measures?.ISOCurrency || oProperty.annotations?.Measures?.Unit) {
		return "InputWithUnit";
	}
	return "Input";
};
