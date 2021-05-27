import { getDisplayMode, MetaModelContext, ComputedAnnotationInterface } from "sap/fe/core/templating/UIFormatters";
import { hasValueHelp, getProperty, getPropertyObjectPath } from "sap/fe/core/templating/PropertyFormatters";

import { Property } from "@sap-ux/vocabularies-types/dist/Converter";

export const getDisplayProperty = function(oContext: MetaModelContext, oInterface: ComputedAnnotationInterface): string {
	const propertyPath = getPropertyObjectPath(oContext, oInterface);
	const oProperty: Property = getProperty(oContext, oInterface);

	return hasValueHelp(oContext, oInterface) ? getDisplayMode(oProperty, propertyPath) : "Value";
};
