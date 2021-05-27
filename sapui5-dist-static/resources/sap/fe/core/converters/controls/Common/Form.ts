import {
	AnnotationTerm,
	CollectionFacetTypes,
	CommunicationAnnotationTerms,
	FacetTypes,
	FieldGroup,
	Identification,
	ReferenceFacetTypes,
	UIAnnotationTerms,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import { BindingExpression } from "sap/fe/core/helpers/BindingExpression";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "../../helpers/ConfigurableObject";
import { FormID } from "../../helpers/ID";
import { KeyHelper } from "../../helpers/Key";
import { FormManifestConfiguration, FormatOptionsType } from "../../ManifestSettings";
import { ConverterContext } from "../../templates/BaseConverter";
import { getSemanticObjectPath } from "sap/fe/core/converters/annotations/DataField";
import { getTargetEntitySetPath, getTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";

export type FormDefinition = {
	id: string;
	useFormContainerLabels: boolean;
	hasFacetsNotPartOfPreview: boolean;
};

export enum FormElementType {
	Default = "Default",
	Annotation = "Annotation"
}

export type BaseFormElement = ConfigurableObject & {
	type: FormElementType;
	label?: string;
	visible?: BindingExpression<boolean>;
	formatOptions?: FormatOptionsType;
};

export type AnnotationFormElement = BaseFormElement & {
	idPrefix?: string;
	annotationPath?: string;
	isValueMultilineText?: boolean;
	semanticObjectPath?: string;
};

export type CustomFormElement = CustomElement<
	BaseFormElement & {
		type: FormElementType.Default;
		template: string;
	}
>;

export type FormElement = CustomFormElement | AnnotationFormElement;

type FormContainer = {
	id?: string;
	formElements: FormElement[];
	annotationPath: string;
	entitySet?: string;
};

function getFormElementsFromAnnotations(facetDefinition: ReferenceFacetTypes, converterContext: ConverterContext): AnnotationFormElement[] {
	const formElements: AnnotationFormElement[] = [];
	const resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
	const formAnnotation: AnnotationTerm<Identification> | AnnotationTerm<FieldGroup> = resolvedTarget.annotation as
		| AnnotationTerm<Identification>
		| AnnotationTerm<FieldGroup>;
	converterContext = resolvedTarget.converterContext;
	switch (formAnnotation?.term) {
		case UIAnnotationTerms.FieldGroup:
			(formAnnotation as AnnotationTerm<FieldGroup>).Data.forEach(field => {
				const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);
				if (
					field.$Type !== UIAnnotationTypes.DataFieldForAction &&
					field.$Type !== UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
					field.annotations?.UI?.Hidden?.valueOf() !== true
				) {
					formElements.push({
						key: KeyHelper.generateKeyFromDataField(field),
						type: FormElementType.Annotation,
						annotationPath: converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName) + "/",
						semanticObjectPath: semanticObjectAnnotationPath,
						formatOptions: {
							textLinesDisplay: 0,
							textLinesEdit: 4
						}
					});
				}
			});
			break;
		case UIAnnotationTerms.Identification:
			(formAnnotation as AnnotationTerm<Identification>).forEach(field => {
				const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);
				if (
					field.$Type !== UIAnnotationTypes.DataFieldForAction &&
					field.$Type !== UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
					field.annotations?.UI?.Hidden?.valueOf() !== true
				) {
					formElements.push({
						key: KeyHelper.generateKeyFromDataField(field),
						type: FormElementType.Annotation,
						annotationPath: converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName) + "/",
						semanticObjectPath: semanticObjectAnnotationPath,
						formatOptions: {
							textLinesDisplay: 0,
							textLinesEdit: 4
						}
					});
				}
			});
			break;
		case UIAnnotationTerms.DataPoint:
			formElements.push({
				// key: KeyHelper.generateKeyFromDataField(formAnnotation),
				key: "DataPoint::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
				type: FormElementType.Annotation,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
			});
			break;
		case CommunicationAnnotationTerms.Contact:
			formElements.push({
				// key: KeyHelper.generateKeyFromDataField(formAnnotation),
				key: "Contact::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
				type: FormElementType.Annotation,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
			});
			break;
		default:
			break;
	}
	return formElements;
}

export function getFormElementsFromManifest(
	facetDefinition: ReferenceFacetTypes,
	converterContext: ConverterContext
): Record<string, CustomFormElement> {
	const manifestWrapper = converterContext.getManifestWrapper();
	const manifestFormContainer: FormManifestConfiguration = manifestWrapper.getFormContainer(facetDefinition.Target.value);
	const formElements: Record<string, CustomFormElement> = {};
	if (manifestFormContainer?.fields) {
		Object.keys(manifestFormContainer?.fields).forEach(fieldId => {
			formElements[fieldId] = {
				key: fieldId,
				type: FormElementType.Default,
				template: manifestFormContainer.fields[fieldId].template,
				label: manifestFormContainer.fields[fieldId].label,
				position: manifestFormContainer.fields[fieldId].position || {
					placement: Placement.After
				},
				formatOptions: {
					textLinesDisplay: 0,
					textLinesEdit: 4,
					...manifestFormContainer.fields[fieldId].formatOptions
				}
			};
		});
	}
	return formElements;
}

export function getFormContainer(facetDefinition: ReferenceFacetTypes, converterContext: ConverterContext): FormContainer {
	//TODO form container id
	const resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
	let sEntitySetPath!: string;
	if (resolvedTarget.converterContext.getEntitySet() !== converterContext.getEntitySet()) {
		sEntitySetPath = getTargetEntitySetPath(resolvedTarget.converterContext.getDataModelObjectPath());
	} else if (resolvedTarget.converterContext.getDataModelObjectPath().targetObject?.containsTarget === true) {
		sEntitySetPath = getTargetObjectPath(resolvedTarget.converterContext.getDataModelObjectPath(), false);
	}
	return {
		id: facetDefinition?.ID?.toString(),
		formElements: insertCustomElements(
			getFormElementsFromAnnotations(facetDefinition, converterContext),
			getFormElementsFromManifest(facetDefinition, converterContext),
			{ formatOptions: "overwrite" }
		),
		annotationPath: "/" + facetDefinition.fullyQualifiedName,
		entitySet: sEntitySetPath
	};
}

function getFormContainersForCollection(facetDefinition: CollectionFacetTypes, converterContext: ConverterContext): FormContainer[] {
	const formContainers: FormContainer[] = [];
	//TODO coll facet inside coll facet?
	facetDefinition.Facets?.forEach(facet => {
		// Ignore level 3 collection facet
		if (facet.$Type === UIAnnotationTypes.CollectionFacet) {
			return;
		}
		formContainers.push(getFormContainer(facet as ReferenceFacetTypes, converterContext));
	});
	return formContainers;
}

export function isReferenceFacet(facetDefinition: FacetTypes): facetDefinition is ReferenceFacetTypes {
	return facetDefinition.$Type === UIAnnotationTypes.ReferenceFacet;
}

export function createFormDefinition(facetDefinition: FacetTypes, converterContext: ConverterContext): FormDefinition {
	switch (facetDefinition.$Type) {
		case UIAnnotationTypes.CollectionFacet:
			// Keep only valid children
			const formCollectionDefinition = {
				id: FormID({ Facet: facetDefinition }),
				useFormContainerLabels: true,
				hasFacetsNotPartOfPreview: facetDefinition.Facets.some(
					childFacet => childFacet.annotations?.UI?.PartOfPreview?.valueOf() === false
				),
				formContainers: getFormContainersForCollection(facetDefinition, converterContext)
			};
			return formCollectionDefinition;
		case UIAnnotationTypes.ReferenceFacet:
			const formDefinition = {
				id: FormID({ Facet: facetDefinition }),
				useFormContainerLabels: false,
				hasFacetsNotPartOfPreview: facetDefinition.annotations?.UI?.PartOfPreview?.valueOf() === false,
				formContainers: [getFormContainer(facetDefinition, converterContext)]
			};
			return formDefinition;
		default:
			throw new Error("Cannot create form based on ReferenceURLFacet");
	}
}
