import { Property } from "@sap-ux/annotation-converter";
import { annotationExpression, ExpressionOrPrimitive, equal, or, Expression } from "sap/fe/core/helpers/BindingExpression";
import { PathAnnotationExpression } from "@sap-ux/vocabularies-types";

/**
 * Identify if the given property passed is a "Property" (has a _type).
 *
 * @param {Property} property a target property to evaluate
 * @returns {boolean} validate that property is a Property
 */
export function isProperty(property: any): property is Property {
	return property && (property as Property).hasOwnProperty("_type") && (property as Property)._type === "Property";
}

/**
 * Check whether the property has the Core.Computed annotation or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it's computed
 */
export const isComputed = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Core?.Computed?.valueOf();
};

/**
 * Check whether the property has the Core.Immutable annotation or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it's immutable
 */
export const isImmutable = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Core?.Immutable?.valueOf();
};

/**
 * Check whether the property is a key or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it's a key
 */
export const isKey = function(oProperty: Property): boolean {
	return !!oProperty.isKey;
};

/**
 * Checks whether the property has a date time or not.
 *
 * @param oProperty
 * @returns true if it is of type date / datetime / datetimeoffset
 */
export const hasDateType = function(oProperty: Property): boolean {
	return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oProperty.type) !== -1;
};

/**
 * Retrieve the label annotation.
 *
 * @param oProperty the target property
 * @returns the label string
 */
export const getLabel = function(oProperty: Property): string {
	return oProperty.annotations?.Common?.Label?.toString() || "";
};

/**
 * Check whether the property has a semantic object defined or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it has a semantic object
 */
export const hasSemanticObject = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Common?.SemanticObject;
};

/**
 * Create the binding expression to check if the property is non editable or not.
 *
 * @param {Property} oProperty the target property
 * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's non editable
 */
export const isNonEditableExpression = function(oProperty: Property): Expression<boolean> {
	return or(isReadOnlyExpression(oProperty), isDisabledExpression(oProperty));
};

/**
 * Create the binding expression to check if the property is read only or not.
 *
 * @param {Property} oProperty the target property
 * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
 */
export const isReadOnlyExpression = function(oProperty: Property): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oProperty.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 1);
	}
	return oFieldControlValue === "Common.FieldControlType/ReadOnly";
};

/**
 * Create the binding expression to check if the property is read only or not.
 *
 * @param {Property} oProperty the target property
 * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's read only
 */
export const isRequiredExpression = function(oProperty: Property): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oProperty.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 7);
	}
	return oFieldControlValue === "Common.FieldControlType/Mandatory";
};

/**
 * Create the binding expression to check if the property is disabled or not.
 *
 * @param {Property} oProperty the target property
 * @returns {ExpressionOrPrimitive<boolean>} the binding expression resolving to a boolean being true if it's disabled
 */
export const isDisabledExpression = function(oProperty: Property): ExpressionOrPrimitive<boolean> {
	const oFieldControlValue = oProperty.annotations?.Common?.FieldControl?.valueOf();
	if (typeof oFieldControlValue === "object") {
		return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue) as ExpressionOrPrimitive<number>, 0);
	}
	return oFieldControlValue === "Common.FieldControlType/Inapplicable";
};

export const isPathExpression = function<T>(expression: any): expression is PathAnnotationExpression<T> {
	return !!expression && expression.type !== undefined && expression.type === "Path";
};

/**
 * Retrieves the associated unit property for that property if it exists.
 *
 * @param {Property} oProperty the target property
 * @returns {Property | undefined} the unit property if it exists
 */
export const getAssociatedUnitProperty = function(oProperty: Property): Property | undefined {
	return isPathExpression(oProperty.annotations?.Measures?.Unit)
		? ((oProperty.annotations?.Measures?.Unit.$target as unknown) as Property)
		: undefined;
};

export const getAssociatedUnitPropertyPath = function(oProperty: Property): string | undefined {
	return isPathExpression(oProperty.annotations?.Measures?.Unit) ? oProperty.annotations?.Measures?.Unit.path : undefined;
};

/**
 * Retrieves the associated currency property for that property if it exists.
 *
 * @param {Property} oProperty the target property
 * @returns {Property | undefined} the unit property if it exists
 */
export const getAssociatedCurrencyProperty = function(oProperty: Property): Property | undefined {
	return isPathExpression(oProperty.annotations?.Measures?.ISOCurrency)
		? ((oProperty.annotations?.Measures?.ISOCurrency.$target as unknown) as Property)
		: undefined;
};

export const getAssociatedCurrencyPropertyPath = function(oProperty: Property): string | undefined {
	return isPathExpression(oProperty.annotations?.Measures?.ISOCurrency) ? oProperty.annotations?.Measures?.ISOCurrency.path : undefined;
};

/**
 * Retrieves the Common.Text property path if it exists.
 *
 * @param {Property} oProperty the target property
 * @returns {string | undefined} the Common.Text property path or undefined if it does not exit
 */
export const getAssociatedTextPropertyPath = function(oProperty: Property): string | undefined {
	return isPathExpression(oProperty.annotations?.Common?.Text) ? oProperty.annotations?.Common?.Text.path : undefined;
};

/**
 * Check whether the property has a value help annotation defined or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it has a value help
 */
export const hasValueHelp = function(oProperty: Property): boolean {
	return (
		!!oProperty.annotations?.Common?.ValueList ||
		!!oProperty.annotations?.Common?.ValueListReferences ||
		!!oProperty.annotations?.Common?.ValueListWithFixedValues ||
		!!oProperty.annotations?.Common?.ValueListMapping
	);
};

/**
 * Check whether the property has a value help with fixed value annotation defined or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it has a value help
 */
export const hasValueHelpWithFixedValues = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Common?.ValueListWithFixedValues?.valueOf();
};

/**
 * Check whether the property has a value help for validation annotation defined or not.
 *
 * @param {Property} oProperty the target property
 * @returns {boolean} true if it has a value help
 */
export const hasValueListForValidation = function(oProperty: Property): boolean {
	return oProperty.annotations?.Common?.ValueListForValidation !== undefined;
};

/**
 * Checks whether the property is a unit property.
 *
 * @param oProperty the property to check
 * @returns true if it is a unit
 */
export const isUnit = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Common?.IsUnit?.valueOf();
};

/**
 * Checks whether the property is a currency property.
 *
 * @param oProperty the property to check
 * @returns true if it is a currency
 */
export const isCurrency = function(oProperty: Property): boolean {
	return !!oProperty.annotations?.Common?.IsCurrency?.valueOf();
};
