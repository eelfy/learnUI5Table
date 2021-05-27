import { Context } from "sap/ui/model/odata/v4";
import { convertMetaModelContext, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import {
	and,
	BindingExpression,
	compileBinding,
	equal,
	Expression,
	ExpressionOrPrimitive,
	ifElse,
	isConstant,
	not,
	or
} from "sap/fe/core/helpers/BindingExpression";
import { UI } from "sap/fe/core/converters/helpers/BindingHelper";
import {
	getAssociatedUnitProperty,
	getAssociatedCurrencyProperty,
	hasSemanticObject,
	hasValueHelp,
	isComputed,
	isDisabledExpression,
	isImmutable,
	isKey,
	isNonEditableExpression,
	isPathExpression,
	isReadOnlyExpression
} from "sap/fe/core/templating/PropertyHelper";
import { PropertyPath } from "@sap-ux/vocabularies-types";
import { Property } from "@sap-ux/annotation-converter";
import { PathAnnotationExpression } from "@sap-ux/vocabularies-types/types/Edm";
import { DataModelObjectPath, getTargetEntitySetPath, isPathUpdatable } from "sap/fe/core/templating/DataModelPathHelper";

export type PropertyOrPath<P> = string | P | PathAnnotationExpression<P>;
export type MetaModelContext = {
	$kind: string;
};
export type ComputedAnnotationInterface = {
	context: Context;
	arguments: any[];
	$$valueAsPromise: boolean;
};
/**
 * Create the expression to generate an "editable" boolean value.
 *
 * @param {PropertyPath} oPropertyPath the input property
 * @param {DataModelObjectPath} oDataModelObjectPath the path to this property object
 * @param {boolean} bAsObject whether or not this should be returned as an object or a binding string
 * @returns {string} the binding string
 */
export const getEditableExpression = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataModelObjectPath?: DataModelObjectPath,
	bAsObject: boolean = false
): BindingExpression<boolean> | ExpressionOrPrimitive<boolean> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return compileBinding(false);
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// Editability depends on the field control expression
	// If the Field control is statically in ReadOnly or Inapplicable (disabled) -> not editable
	// If the property is a key -> not editable except in creation if not computed
	// If the property is computed -> not editable
	// If the property is not updatable -> not editable
	// If the property is immutable -> not editable except in creation
	// If the property has a SemanticObject and no ValueList defined -> not editable
	// If the Field control is a path resolving to ReadOnly or Inapplicable (disabled) (<= 1) -> not editable
	// Else, to be editable you need
	// immutable and key while in the creation row
	// ui/isEditable
	const isPathUpdatableExpression = isPathUpdatable(oDataModelObjectPath, oPropertyPath);
	const editableExpression = ifElse(
		or(
			not(isPathUpdatableExpression),
			isComputed(oProperty),
			isKey(oProperty),
			isImmutable(oProperty),
			hasSemanticObject(oProperty) && !hasValueHelp(oProperty),
			isNonEditableExpression(oProperty)
		),
		ifElse(
			(isImmutable(oProperty) || isKey(oProperty)) && !isComputed(oProperty),
			and(isPathUpdatableExpression, UI.IsTransientBinding),
			false
		),
		UI.IsEditable
	);
	if (bAsObject) {
		return editableExpression;
	}
	return compileBinding(editableExpression);
};

/**
 * Create the expression to generate an "enabled" boolean value.
 *
 * @param {PropertyPath} oPropertyPath the input property
 * @param {boolean} bAsObject whether or not this should be returned as an object or a binding string
 * @returns {string} the binding string
 */
export const getEnabledExpression = function(
	oPropertyPath: PropertyOrPath<Property>,
	bAsObject: boolean = false
): BindingExpression<boolean> | ExpressionOrPrimitive<boolean> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return compileBinding(true);
	}
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// Enablement depends on the field control expression
	// If the Field control is statically in Inapplicable (disabled) -> not enabled
	const enabledExpression = ifElse(isDisabledExpression(oProperty), false, true);
	if (bAsObject) {
		return enabledExpression;
	}
	return compileBinding(enabledExpression);
};

/**
 * Create the expression to generate an "editMode" enum value.
 * @param {PropertyPath} oPropertyPath the input property
 * @param {DataModelObjectPath} oDataModelObjectPath the list of involved data model object to reach that property
 * @param {boolean} bAsObject return this as an expression
 * @returns {BindingExpression<string> | ExpressionOrPrimitive<string>} the binding string or part
 */
export const getEditMode = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataModelObjectPath: DataModelObjectPath,
	bAsObject: boolean = false
): BindingExpression<string> | ExpressionOrPrimitive<string> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Display";
	}
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// if the property is not enabled => Disabled
	// if the property is enabled && not editable => ReadOnly
	// if the property is enabled && editable => Editable
	// If there is an associated unit, and it has a field control also use consider the following
	// if the unit field control is readonly -> EditableReadOnly
	// otherwise -> Editable
	const editableExpression = getEditableExpression(oPropertyPath, oDataModelObjectPath, true) as ExpressionOrPrimitive<boolean>;
	const enabledExpression = getEnabledExpression(oPropertyPath, true) as ExpressionOrPrimitive<boolean>;
	const unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);
	let resultExpression: ExpressionOrPrimitive<string> = "Editable";
	if (unitProperty) {
		resultExpression = ifElse(or(isReadOnlyExpression(unitProperty), isComputed(unitProperty)), "EditableReadOnly", "Editable");
	}
	const readOnlyExpression = isReadOnlyExpression(oProperty);

	// if the property is from a non-updatable entity => Read only mode, previously calculated edit Mode is ignored
	// if the property is from an updatable entity => previously calculated edit Mode expression
	const editModeExpression = ifElse(
		enabledExpression,
		ifElse(
			editableExpression,
			resultExpression,
			ifElse(and(!isConstant(readOnlyExpression) && readOnlyExpression, UI.IsEditable), "ReadOnly", "Display")
		),
		ifElse(UI.IsEditable, "Disabled", "Display")
	);
	if (bAsObject) {
		return editModeExpression;
	}
	return compileBinding(editModeExpression);
};

export const ifUnitEditable = function(
	oPropertyPath: PropertyOrPath<Property>,
	sEditableValue: ExpressionOrPrimitive<string>,
	sNonEditableValue: ExpressionOrPrimitive<string>
): BindingExpression<string> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Display";
	}
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	const unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);
	if (!unitProperty) {
		return compileBinding(sNonEditableValue);
	}
	const editableExpression = and(not(isReadOnlyExpression(unitProperty)), not(isComputed(unitProperty)));
	return compileBinding(ifElse(editableExpression, sEditableValue, sNonEditableValue));
};

export type DisplayMode = "Value" | "Description" | "DescriptionValue" | "ValueDescription";
export const getDisplayMode = function(oPropertyPath: PropertyOrPath<Property>, oDataModelObjectPath: DataModelObjectPath): DisplayMode {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Value";
	}
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	const oEntityType = oDataModelObjectPath && oDataModelObjectPath.targetEntityType;
	const oTextAnnotation = oProperty.annotations?.Common?.Text;
	const oTextArrangementAnnotation =
		(typeof oTextAnnotation !== "string" && oTextAnnotation?.annotations?.UI?.TextArrangement?.toString()) ||
		oEntityType?.annotations?.UI?.TextArrangement?.toString();

	let sDisplayValue = oTextAnnotation ? "DescriptionValue" : "Value";
	if (oTextAnnotation && oTextArrangementAnnotation) {
		if (oTextArrangementAnnotation === "UI.TextArrangementType/TextOnly") {
			sDisplayValue = "Description";
		} else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextLast") {
			sDisplayValue = "ValueDescription";
		} else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextSeparate") {
			sDisplayValue = "Value";
		} else {
			//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
			sDisplayValue = "DescriptionValue";
		}
	}
	return sDisplayValue as DisplayMode;
};

export const getFieldDisplay = function(
	oPropertyPath: PropertyOrPath<Property>,
	sTargetDisplayMode: string,
	oComputedEditMode: ExpressionOrPrimitive<string>
): BindingExpression<string> {
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);

	return hasValueHelp(oProperty)
		? compileBinding(sTargetDisplayMode)
		: compileBinding(ifElse(equal(oComputedEditMode, "Editable"), "Value", sTargetDisplayMode));
};

export const getAlignmentExpression = function(
	oComputedEditMode: Expression<string>,
	sAlignDisplay: string = "Begin",
	sAlignEdit: string = "Begin"
): BindingExpression<string> | Expression<string> {
	return compileBinding(ifElse(equal(oComputedEditMode, "Display"), sAlignDisplay, sAlignEdit));
};

/**
 * Formatter helper to retrieve the converterContext from the metamodel context.
 *
 * @param {Context} oContext the original metamodel context
 * @param {ComputedAnnotationInterface} oInterface the current templating context
 * @returns {object} the converter context representing that object
 */
export const getConverterContext = function(oContext: MetaModelContext, oInterface: ComputedAnnotationInterface): object | null {
	if (oInterface && oInterface.context) {
		return convertMetaModelContext(oInterface.context);
	}
	return null;
};
getConverterContext.requiresIContext = true;

/**
 * Formatter helper to retrieve the involved data model object from the metamodel context.
 *
 * @param {Context} oContext the original metamodel context
 * @param {ComputedAnnotationInterface} oInterface the current templating context
 * @returns {object[]} an array of entityset and navproperty involved to get to a specific object in the metamodel
 */
export const getDataModelObjectPath = function(
	oContext: MetaModelContext,
	oInterface: ComputedAnnotationInterface
): DataModelObjectPath | null {
	if (oInterface && oInterface.context) {
		return getInvolvedDataModelObjects(oInterface.context);
	}
	return null;
};
getDataModelObjectPath.requiresIContext = true;

/**
 * Retrieves the expressionBinding created out of a binding expression.
 *
 * @param {Expression<any>} expression the expression to compile
 * @returns {BindingExpression<string>} the expression binding string
 */
export const getExpressionBinding = function(expression: Expression<any>): BindingExpression<string> {
	return compileBinding(expression);
};

/**
 * Retrieve the target entityset for a context path if it exists.
 *
 * @param oContext
 * @returns {string}
 */
export const getTargetEntitySet = function(oContext: Context): string | null {
	if (oContext) {
		const oDataModelPath = getInvolvedDataModelObjects(oContext);
		return getTargetEntitySetPath(oDataModelPath);
	}

	return null;
};
