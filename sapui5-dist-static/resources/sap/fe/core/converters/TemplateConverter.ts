import { BaseManifestSettings } from "./ManifestSettings";
import * as ListReportConverter from "./templates/ListReportConverter";
import * as ObjectPageConverter from "./templates/ObjectPageConverter";
import { convertTypes, getInvolvedDataModelObjects, EnvironmentCapabilities } from "./MetaModelConverter";
import { ODataMetaModel } from "sap/ui/model/odata/v4";
import { IShellServicesProxy, TemplateType } from "./templates/BaseConverter";
import { createConverterContext } from "sap/fe/core/converters/ConverterContext";
import { IssueCategory, IssueSeverity, IssueCategoryType } from "sap/fe/core/converters/helpers/IssueManager";

import { merge } from "sap/base/util";
import { FacetTypes, UIAnnotationTypes } from "@sap-ux/vocabularies-types";

/**
 * @typedef PageDefinition
 */
export type PageDefinition = {
	template: string;
};

/** @typedef IDiagnostics **/
export interface IDiagnostics {
	addIssue(
		issueCategory: IssueCategory | string,
		issueSeverity: IssueSeverity,
		details: string,
		issueCategoryType?: any,
		issueSubCategory?: string
	): void;
	getIssues(): any[];
	checkIfIssueExists(
		issueCategory: IssueCategory,
		issueSeverity: IssueSeverity,
		details: string,
		issueCategoryType?: any,
		issueSubCategory?: string
	): boolean;
}

function handleErrorForCollectionFacets(oFacets: FacetTypes[], oDiagnostics: IDiagnostics, sEntitySetName: string, level: number) {
	oFacets.forEach((oFacet: any) => {
		let Message = "For entity set " + sEntitySetName;
		if (oFacet?.$Type === UIAnnotationTypes.CollectionFacet && !oFacet?.ID) {
			Message = Message + ", " + "level " + level + ", the collection facet does not have an ID.";
			oDiagnostics.addIssue(
				IssueCategory.Facets,
				IssueSeverity.High,
				Message,
				IssueCategoryType,
				IssueCategoryType?.Facets?.MissingID
			);
		}
		if (oFacet?.$Type === UIAnnotationTypes.CollectionFacet && level >= 3) {
			Message = Message + ", collection facet " + oFacet.Label + " is not supported at " + "level " + level;
			oDiagnostics.addIssue(
				IssueCategory.Facets,
				IssueSeverity.Medium,
				Message,
				IssueCategoryType,
				IssueCategoryType?.Facets?.UnSupportedLevel
			);
		}
		if (oFacet?.Facets) {
			handleErrorForCollectionFacets(oFacet?.Facets, oDiagnostics, sEntitySetName, ++level);
			level = level - 1;
		}
	});
}

/**
 * Based on a template type, convert the metamodel and manifest definition into a json structure for the page.
 * @param {TemplateType} sTemplateType the template type
 * @param {ODataMetaModel} oMetaModel the odata model metaModel
 * @param {BaseManifestSettings} oManifestSettings current manifest settings
 * @param {IShellServicesProxy} oShellServices the shellservice instance
 * @param {IDiagnostics} oDiagnostics the diagnostics wrapper
 * @param {string} sFullContextPath the context path to reach this page
 * @param oCapabilities
 * @returns {PageDefinition} the target page definition
 */
export function convertPage(
	sTemplateType: TemplateType,
	oMetaModel: ODataMetaModel,
	oManifestSettings: BaseManifestSettings,
	oShellServices: IShellServicesProxy,
	oDiagnostics: IDiagnostics,
	sFullContextPath: string,
	oCapabilities?: EnvironmentCapabilities
) {
	const oConverterOutput = convertTypes(oMetaModel, oCapabilities);
	oConverterOutput.diagnostics.forEach(annotationErrorDetail => {
		const checkIfIssueExists = oDiagnostics.checkIfIssueExists(
			IssueCategory.Annotation,
			IssueSeverity.High,
			annotationErrorDetail.message
		);
		if (!checkIfIssueExists) {
			oDiagnostics.addIssue(IssueCategory.Annotation, IssueSeverity.High, annotationErrorDetail.message);
		}
	});
	oConverterOutput?.entityTypes?.forEach((oEntitySet: any) => {
		if (oEntitySet?.annotations?.UI?.Facets) {
			handleErrorForCollectionFacets(oEntitySet?.annotations?.UI?.Facets, oDiagnostics, oEntitySet?.name, 1);
		}
	});
	const sTargetEntitySetName = oManifestSettings.entitySet;
	const oFullContext = getInvolvedDataModelObjects(
		oMetaModel.createBindingContext(sFullContextPath === "/" ? sFullContextPath + sTargetEntitySetName : sFullContextPath)
	);

	if (oFullContext) {
		let oConvertedPage = {};
		switch (sTemplateType) {
			case TemplateType.ListReport:
			case TemplateType.AnalyticalListPage:
				oConvertedPage = ListReportConverter.convertPage(
					createConverterContext(
						oConverterOutput,
						oManifestSettings,
						sTemplateType,
						oShellServices,
						oDiagnostics,
						merge,
						oFullContext
					)
				);
				break;
			case TemplateType.ObjectPage:
				oConvertedPage = ObjectPageConverter.convertPage(
					createConverterContext(
						oConverterOutput,
						oManifestSettings,
						sTemplateType,
						oShellServices,
						oDiagnostics,
						merge,
						oFullContext
					)
				);
				break;
		}
		return oConvertedPage;
	}
	return undefined;
}
