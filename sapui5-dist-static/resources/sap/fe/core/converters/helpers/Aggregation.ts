import { EntityType, Property } from "@sap-ux/annotation-converter";
import { AnnotationTerm } from "@sap-ux/vocabularies-types";
import { AggregationAnnotationTerms, CustomAggregate } from "@sap-ux/vocabularies-types/dist/generated/Aggregation";
import { PropertyPath } from "@sap-ux/vocabularies-types/dist/Edm";

import { ConverterContext } from "../templates/BaseConverter";

/**
 * helper class for Aggregation annotations.
 */
export class AggregationHelper {
	_entityType: EntityType;
	_converterContext: ConverterContext;
	_bApplySupported: boolean;
	_bHasPropertyRestrictions: boolean;
	_aRestrictedGroupableProperties: PropertyPath[];

	/**
	 * Creates a helper for a specific entity type and a converter context.
	 *
	 * @param entityType the entity type
	 * @param converterContext the context
	 */
	constructor(entityType: EntityType, converterContext: ConverterContext) {
		this._entityType = entityType;
		this._converterContext = converterContext;

		this._bApplySupported =
			converterContext.getEntitySet()?.annotations?.Aggregation?.ApplySupported ||
			converterContext.getEntityContainer().annotations?.Aggregation?.ApplySupported
				? true
				: false;

		const entitySetRestrictions = converterContext.getEntitySet()?.annotations?.Aggregation?.ApplySupported?.PropertyRestrictions;
		if (entitySetRestrictions !== undefined) {
			this._bHasPropertyRestrictions = entitySetRestrictions ? true : false;
		} else {
			this._bHasPropertyRestrictions = converterContext.getEntityContainer().annotations?.Aggregation?.ApplySupported
				?.PropertyRestrictions
				? true
				: false;
		}

		if (this._bHasPropertyRestrictions) {
			const groupablePropsFromContainer = (converterContext.getEntityContainer().annotations?.Aggregation?.ApplySupported
				?.GroupableProperties || []) as PropertyPath[];
			const groupablePropsFromEntitySet = (converterContext.getEntitySet()?.annotations?.Aggregation?.ApplySupported
				?.GroupableProperties || []) as PropertyPath[];
			this._aRestrictedGroupableProperties = groupablePropsFromContainer.concat(groupablePropsFromEntitySet);
		} else {
			this._aRestrictedGroupableProperties = [];
		}
	}

	/**
	 * Checks if the entity supports analytical queries.
	 *
	 * @returns true if analytical queries are supported, false otherwise.
	 */
	public isAnalyticsSupported(): boolean {
		return this._bApplySupported;
	}

	/**
	 * Checks if a property is groupable.
	 *
	 * @param property the property to check
	 * @returns undefined if the entity doesn't support analytical queries, true or false otherwise
	 */
	public isPropertyGroupable(property: Property): boolean | undefined {
		if (!this._bApplySupported) {
			return undefined;
		} else {
			return (
				!this._bHasPropertyRestrictions ||
				property.annotations?.Aggregation?.Groupable?.valueOf() === true ||
				this._aRestrictedGroupableProperties.findIndex(path => path.$target.fullyQualifiedName === property.fullyQualifiedName) >= 0
			);
		}
	}

	/**
	 * Returns the list of custom aggregate definitions for the entity type.
	 *
	 * @returns A map (propertyName --> array of context-defining property names) for each custom aggregate corresponding to a property. The array of
	 * context-refining property names is empty if the aggregates doesn't have any context-defining property.
	 */
	public getCustomAggregateDefinitions(): Record<string, string[]> {
		const mDefinitions: Record<string, string[]> = {};

		// Get the custom aggregates on the entity type AND the entity set
		const aCustomAggregateAnnotations: AnnotationTerm<CustomAggregate>[] = this._converterContext
			.getEntityContainerAnnotationsByTerm("Aggregation", AggregationAnnotationTerms.CustomAggregate)
			.concat(this._converterContext.getEntitySetAnnotationsByTerm("Aggregation", AggregationAnnotationTerms.CustomAggregate));

		aCustomAggregateAnnotations.forEach(annotation => {
			// Check if there's a property with the same name as the custom aggregate
			const oAggregatedProperty = this._entityType.entityProperties.find(oProperty => {
				return oProperty.name === annotation.qualifier;
			});
			if (oAggregatedProperty) {
				const aContextDefiningProperties = annotation.annotations?.Aggregation?.ContextDefiningProperties;

				mDefinitions[oAggregatedProperty.name] = aContextDefiningProperties
					? aContextDefiningProperties.map(oCtxDefProperty => {
							return oCtxDefProperty.value;
					  })
					: [];
			}
		});

		return mDefinitions;
	}
}
