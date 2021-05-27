import { compileBinding, BindingExpression } from "sap/fe/core/helpers/BindingExpression";
import { StableIdHelper } from "sap/fe/core/helpers";
import { Property } from "@sap-ux/annotation-converter";
import {
	hasValueHelpWithFixedValues,
	hasValueListForValidation,
	hasValueHelp,
	isUnit,
	isCurrency,
	hasDateType
} from "sap/fe/core/templating/PropertyHelper";
import { DataModelObjectPath, checkFilterExpressionRestrictions } from "sap/fe/core/templating/DataModelPathHelper";
import { getDisplayMode } from "sap/fe/core/templating/UIFormatters";

/**
 * Retrieve the displayMode for the value help.
 * The main rule is that if a property is used in a VHTable then we don't want to display the text arrangement directly.
 *
 * @param propertyPath the current property
 * @returns the target displayMode
 */
export const getValueHelpTableDisplayMode = function(propertyPath: DataModelObjectPath): string {
	const sDisplayMode = getDisplayMode(propertyPath.targetObject, propertyPath);
	// if the property is used in a VHTable consider only #TextOnly else show the value
	return sDisplayMode === "Description" ? "Description" : "Value";
};

/**
 * Method to return delegate property of Value Help.
 *
 * @function
 * @name getDelegateConfiguration
 * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
 * @param propertyPath property name
 * @param conditionModelName Condition model of the Value Help
 * @returns returns an expression
 */
export const getDelegateConfiguration = function(propertyPath: string, conditionModelName: string): BindingExpression<string> {
	const delegateConfiguration = {
		name: "sap/fe/macros/FieldValueHelpDelegate",
		payload: {
			propertyPath: propertyPath,
			conditionModel: conditionModelName
		}
	};
	return compileBinding(delegateConfiguration);
};

/**
 * Method to generate the ID for Value Help.
 *
 * @function
 * @name generateID
 * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
 * @param {string} sFlexId Flex ID of the current object
 * @param {string} sIdPrefix Prefix for the ValueHelp ID
 * @param {string} sOriginalPropertyName Name of the property
 * @param {string} sPropertyName Name of the ValueHelp Property
 * @returns {string} returns the Id generated for the ValueHelp
 */
export const generateID = function(sFlexId: string, sIdPrefix: string, sOriginalPropertyName: string, sPropertyName: string): string {
	if (sFlexId) {
		return sFlexId;
	}
	let sProperty = sPropertyName;
	if (sOriginalPropertyName !== sPropertyName) {
		sProperty = sOriginalPropertyName + "::" + sPropertyName;
	}
	return StableIdHelper.generate([sIdPrefix, sProperty]);
};

/**
 * Method to check if a property needs to be validated or not when used in the valuehelp.
 *
 * @function
 * @name requiresValidation
 * @memberof sap.fe.macros.internal.valuehelp.ValueHelpTemplating.js
 * @param  oProperty value help property type annotations
 * @returns returns true if the value help need to be validated
 */
export const requiresValidation = function(oProperty: Property): boolean {
	return (
		hasValueHelpWithFixedValues(oProperty) ||
		hasValueListForValidation(oProperty) ||
		(hasValueHelp(oProperty) && (isUnit(oProperty) || isCurrency(oProperty)))
	);
};

export const isSemanticDateRange = function(oDataModelPath: DataModelObjectPath) {
	const targetProperty = oDataModelPath.targetObject as Property;
	const targetRestrictions = checkFilterExpressionRestrictions(oDataModelPath, ["SingleRange"]);
	return hasDateType(targetProperty) && compileBinding(targetRestrictions);
};

export const shouldShowConditionPanel = function(oDataModelPath: DataModelObjectPath): boolean {
	return compileBinding(checkFilterExpressionRestrictions(oDataModelPath, ["SingleValue", "MultiValue"])) === "false";
};
