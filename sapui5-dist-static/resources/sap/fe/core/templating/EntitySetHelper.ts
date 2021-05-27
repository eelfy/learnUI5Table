import { EntitySet } from "@sap-ux/annotation-converter";

export const isEntitySet = function(dataObject: any): dataObject is EntitySet {
	return dataObject && dataObject.hasOwnProperty("_type") && dataObject._type === "EntitySet";
};

export const getFilterExpressionRestrictions = function(entitySet: EntitySet) {
	return entitySet.annotations?.Capabilities?.FilterRestrictions?.FilterExpressionRestrictions || [];
};

export const isStickySessionSupported = function(entitySet: EntitySet): boolean {
	return !!entitySet.annotations.Session?.StickySessionSupported;
};
