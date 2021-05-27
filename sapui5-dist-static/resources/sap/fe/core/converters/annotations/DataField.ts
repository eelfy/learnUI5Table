import { DataFieldAbstractTypes, DataFieldForActionAbstractTypes, DataFieldTypes, UIAnnotationTypes } from "@sap-ux/vocabularies-types";
import * as Edm from "@sap-ux/vocabularies-types/dist/Edm";
import { ConverterContext } from "sap/fe/core/converters/templates/BaseConverter";
import { getDisplayMode, PropertyOrPath } from "sap/fe/core/templating/UIFormatters";
import { Property } from "@sap-ux/annotation-converter";
import { getAssociatedCurrencyProperty, getAssociatedUnitProperty } from "sap/fe/core/templating/PropertyHelper";

export type CollectedProperties = {
	value: Property;
	description?: Property;
	fieldGroup?: DataFieldAbstractTypes;
};

export type ComplexPropertyInfo = {
	properties: Record<string, CollectedProperties>;
	exportSettingsTemplate?: string;
};

/**
 * Identify if the given dataFieldAbstract passed is a "DataFieldForActionAbstract" (has Inline defined).
 *
 * @param {DataFieldAbstractTypes} dataField a datafield to evalute
 * @returns {boolean} validate that dataField is a DataFieldForActionAbstractTypes
 */
export function isDataFieldForActionAbstract(dataField: DataFieldAbstractTypes): dataField is DataFieldForActionAbstractTypes {
	return (dataField as DataFieldForActionAbstractTypes).hasOwnProperty("Action");
}

/**
 * Identify if the given dataFieldAbstract passed is a "DataField" (has a Value).
 *
 * @param {DataFieldAbstractTypes} dataField a dataField to evaluate
 * @returns {boolean} validate that dataField is a DataFieldTypes
 */
export function isDataFieldTypes(dataField: DataFieldAbstractTypes): dataField is DataFieldTypes {
	return (dataField as DataFieldTypes).hasOwnProperty("Value");
}

/**
 * Returns whether given data field has a static hidden annotation.
 *
 * @param {DataFieldAbstractTypes} dataField the datafield to check
 * @returns {boolean} true if datafield or referenced property has a static Hidden annotation, false else
 * @private
 */
export function isDataFieldAlwaysHidden(dataField: DataFieldAbstractTypes): boolean {
	return (
		dataField.annotations?.UI?.Hidden?.valueOf() === true ||
		(isDataFieldTypes(dataField) && dataField.Value?.$target?.annotations?.UI?.Hidden === true)
	);
}

export function getSemanticObjectPath(converterContext: ConverterContext, object: any): string | undefined {
	if (typeof object === "object") {
		if (isDataFieldTypes(object) && object.Value?.$target?.fullyQualifiedName) {
			const property = converterContext.getEntityPropertyFromFullyQualifiedName(object.Value?.$target?.fullyQualifiedName);
			if (property?.annotations?.Common?.SemanticObject !== undefined) {
				return converterContext.getEntitySetBasedAnnotationPath(property?.fullyQualifiedName);
			}
		}
	} else {
		const property = converterContext.getEntityPropertyFromFullyQualifiedName(object);
		if (property?.annotations?.Common?.SemanticObject !== undefined) {
			return converterContext.getEntitySetBasedAnnotationPath(property?.fullyQualifiedName);
		}
	}
	return undefined;
}

/**
 * Collect related properties from a property's annotations.
 *
 * @param path The property path
 * @param property The property to be considered
 * @param converterContext The converter context
 * @param ignoreSelf Whether to exclude the same property from related properties.
 * @param relatedProperties The related properties identified so far.
 * @param fieldGroupProperty The fieldGroup property to which the property inherits.
 * @returns {ComplexPropertyInfo} The related properties identified.
 */
export function collectRelatedProperties(
	path: string,
	property: Edm.PrimitiveType,
	converterContext: ConverterContext,
	ignoreSelf: boolean,
	relatedProperties: ComplexPropertyInfo = { properties: {} },
	fieldGroupProperty?: DataFieldAbstractTypes
): ComplexPropertyInfo {
	/**
	 * Helper to push unique related properties.
	 *
	 * @param key The property path
	 * @param properties The properties object containing value property, description property...
	 * @returns Index at which the property is available
	 */
	function _pushUnique(key: string, properties: CollectedProperties): number {
		if (!relatedProperties.properties.hasOwnProperty(key)) {
			relatedProperties.properties[key] = properties;
		}
		return Object.keys(relatedProperties.properties).indexOf(key);
	}

	/**
	 * Helper to append the export settings template with a formatted text.
	 *
	 * @param value Formatted text
	 */
	function _appendTemplate(value: string) {
		relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate
			? `${relatedProperties.exportSettingsTemplate}${value}`
			: `${value}`;
	}

	if (path && property) {
		const navigationPathPrefix = path.indexOf("/") > -1 ? path.substring(0, path.lastIndexOf("/") + 1) : "";

		// Check for Text annotation.
		const textAnnotation = property.annotations?.Common?.Text;
		let valueIndex: number;
		let currencyOrUoMIndex: number;

		if (relatedProperties.exportSettingsTemplate) {
			// FieldGroup use-case. Need to add each Field in new line.
			_appendTemplate("\n");
		}

		if (textAnnotation?.path && textAnnotation?.$target) {
			// Check for Text Arrangement.
			const dataModelObjectPath = converterContext.getDataModelObjectPath();
			const textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
			const displayMode = getDisplayMode(property as PropertyOrPath<Property>, dataModelObjectPath);
			let descriptionIndex: number;
			switch (displayMode) {
				case "Value":
					valueIndex = _pushUnique(path, { value: property, fieldGroup: fieldGroupProperty });
					_appendTemplate(`{${valueIndex}}`);
					break;

				case "Description":
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
						value: textAnnotation.$target,
						description: property,
						fieldGroup: fieldGroupProperty
					});
					// Keep value when exporting (split mode) on text Arrangement defined as #TextOnly (Only values are expected on paste from Excel functionality)
					_pushUnique(path, { value: property, fieldGroup: fieldGroupProperty });
					_appendTemplate(`{${descriptionIndex}}`);
					break;

				case "ValueDescription":
					valueIndex = _pushUnique(path, { value: property, fieldGroup: fieldGroupProperty });
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
						value: textAnnotation.$target,
						description: property,
						fieldGroup: fieldGroupProperty
					});
					_appendTemplate(`{${valueIndex}} ({${descriptionIndex}})`);
					break;

				case "DescriptionValue":
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, {
						value: textAnnotation.$target,
						description: property,
						fieldGroup: fieldGroupProperty
					});
					valueIndex = _pushUnique(path, { value: property, fieldGroup: fieldGroupProperty });
					_appendTemplate(`{${descriptionIndex}} ({${valueIndex}})`);
					break;
			}
		} else {
			// Check for field containing Currency Or Unit Properties.
			const currencyOrUoMProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
			const currencyOrUnitAnnotation = property?.annotations?.Measures?.ISOCurrency || property?.annotations?.Measures?.Unit;
			if (currencyOrUoMProperty && currencyOrUnitAnnotation?.$target) {
				valueIndex = _pushUnique(path, { value: property });
				currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, { value: currencyOrUnitAnnotation.$target });
				_appendTemplate(`{${valueIndex}}  {${currencyOrUoMIndex}}`);
			} else if (property.Target?.$target?.Visualization) {
				// DataPoint use-case. Need to include targetValue to the template.
				valueIndex = _pushUnique(path, { value: property.Target.$target.Value?.$target, fieldGroup: fieldGroupProperty });
				// Need to create a new fake property containing the Rating Target Value.
				// It'll be used for the export on split mode.
				_pushUnique(property.Target.value, { value: property, fieldGroup: fieldGroupProperty });
				_appendTemplate(`{${valueIndex}}/${property.Target.$target.TargetValue}`);
			} else if (!ignoreSelf) {
				// Collect underlying property
				valueIndex = _pushUnique(path, { value: property, fieldGroup: fieldGroupProperty });
				_appendTemplate(`{${valueIndex}}`);
			}
		}
	}

	return relatedProperties;
}

/**
 * Collect properties consumed by a Data Field.
 * This is for populating the ComplexPropertyInfos of the table delegate.
 *
 * @param dataField {DataFieldAbstractTypes} The Data Field for which the properties need to be identified.
 * @param converterContext The converter context
 * @param relatedProperties {ComplexPropertyInfo} The properties identified so far.
 * @param fieldGroupDataField {DataFieldAbstractTypes} The FieldGroup data Field to which the property belongs.
 * @returns {ComplexPropertyInfo} The properties related to the Data Field.
 */
export function collectRelatedPropertiesRecursively(
	dataField: DataFieldAbstractTypes,
	converterContext: ConverterContext,
	relatedProperties: ComplexPropertyInfo = { properties: {} },
	fieldGroupDataField?: DataFieldAbstractTypes | undefined
): ComplexPropertyInfo {
	if (dataField.$Type === UIAnnotationTypes.DataField && dataField.Value) {
		const propertyPath = dataField.Value;
		relatedProperties = collectRelatedProperties(
			propertyPath.path,
			propertyPath.$target,
			converterContext,
			false,
			relatedProperties,
			fieldGroupDataField
		);
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		switch (dataField.Target?.$target?.$Type) {
			case UIAnnotationTypes.FieldGroupType:
				const fieldGroup: DataFieldAbstractTypes | undefined = dataField;
				dataField.Target.$target.Data?.forEach((innerDataField: DataFieldAbstractTypes) => {
					relatedProperties = collectRelatedPropertiesRecursively(
						innerDataField,
						converterContext,
						relatedProperties,
						fieldGroup
					);
				});
				break;

			case UIAnnotationTypes.DataPointType:
				relatedProperties = collectRelatedProperties(
					dataField.Target.$target.Value.path,
					dataField,
					converterContext,
					false,
					relatedProperties,
					fieldGroupDataField
				);
				break;
		}
	}

	return relatedProperties;
}
