import { AnnotationTerm } from "@sap-ux/vocabularies-types";
import { ManifestWrapper } from "../ManifestSettings";
import { AnyAnnotation, EntitySet, EntityType, Property, EntityContainer } from "@sap-ux/annotation-converter";
import { IDiagnostics } from "sap/fe/core/converters/TemplateConverter";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { EntityTypeAnnotations } from "@sap-ux/vocabularies-types/types/generated/Edm_Types";

/**
 * Template Type
 */
export enum TemplateType {
	ListReport = "ListReport",
	ObjectPage = "ObjectPage",
	AnalyticalListPage = "AnalyticalListPage"
}

export interface IShellServicesProxy {
	getContentDensity(): string;
}

export type ResolvedAnnotationContext = {
	annotation: AnyAnnotation;
	converterContext: ConverterContext;
};

export type ConverterContext = {
	/**
	 * Retrieve the entityType associated with an annotation object
	 *
	 * @param annotation
	 * @returns {EntityType} the entity type the annotation refers to
	 */
	getAnnotationEntityType(annotation?: AnnotationTerm<any>): EntityType;

	/**
	 * Retrieve the manifest settings defined for a specific control within controlConfiguration
	 *
	 * @param annotationPath
	 */
	getManifestControlConfiguration(annotationPath: string | AnnotationTerm<any>): any;

	/**
	 * Create an absolute annotation path based on the current meta model context
	 *
	 * @param annotationPath
	 */
	getAbsoluteAnnotationPath(annotationPath: string): string;

	/**
	 * Retrieve the current entitySet
	 */
	getEntitySet(): EntitySet | undefined;

	/**
	 * Retrieve the current data model object path
	 */
	getDataModelObjectPath(): DataModelObjectPath;

	/**
	 * Find an entity set based on its name
	 */
	findEntitySet(entitySetName: string | undefined): EntitySet | undefined;

	/**
	 * Get the entity set associated to an entitytype (assuming there is only one...)
	 *
	 * @param entityType
	 */
	getEntitySetForEntityType(entityType: EntityType): EntitySet | undefined;

	/**
	 * Get the entity container.
	 */
	getEntityContainer(): EntityContainer;

	/**
	 * Get the entitytype based on the fully qualified name.
	 */
	getEntityType(): EntityType;

	/**
	 * Retrieve an annotation from an entitytype based on an annotation path
	 *
	 * @param annotationPath
	 */
	getEntityTypeAnnotation(annotationPath: string): ResolvedAnnotationContext;

	/**
	 * Retrieve the type of template we're working on (e.g. ListReport / ObjectPage / ...)
	 */
	getTemplateType(): TemplateType;

	/**
	 * Retrieve a relative annotation path between an annotationpath and an entity type
	 *
	 * @param annotationPath
	 * @param entityType
	 */
	getRelativeAnnotationPath(annotationPath: string, entityType: EntityType): string;

	/**
	 * Transform an entityType based path to an entitySet based one (ui5 templating generally expect an entitySetBasedPath)
	 *
	 * @param annotationPath
	 */
	getEntitySetBasedAnnotationPath(annotationPath: string): string;

	/**
	 * Retrieve the manifest wrapper for the current context
	 *
	 * @returns {ManifestWrapper}
	 */
	getManifestWrapper(): ManifestWrapper;

	/**
	 * Retrieve the instance of the shell service class currently in place
	 *
	 * @returns {IShellServicesProxy}
	 */
	getShellServices(): IShellServicesProxy;

	getDiagnostics(): IDiagnostics;
	/**
	 * Retrieve a new converter context, scoped for a different entityset
	 *
	 * @param {EntitySet} targetEntitySet the entityset we want the new context around
	 * @returns {ConverterContext}
	 */
	getConverterContextFor(targetEntitySet: EntitySet): ConverterContext;

	/**
	 * Retrieve the property based on the path
	 *
	 * @param fullyQualifiedName fullyQualifiedName the fully qualified name
	 * @returns {Property} the property EntityType based
	 */
	getEntityPropertyFromFullyQualifiedName(fullyQualifiedName: string): Property | undefined;

	/**
	 * Get all annotations of a given term and vocabulary on an entity type
	 * (or on the current entity type if entityType isn't specified)
	 *
	 * @param vocabularyName
	 * @param annotationTerm
	 * @param entityType?
	 */
	getAnnotationsByTerm(
		vocabularyName: keyof EntityTypeAnnotations,
		annotationTerm: string,
		entityType?: EntityType
	): AnnotationTerm<any>[];

	/**
	 * Get all annotations of a given term and vocabulary on the current entity set.
	 *
	 * @param vocabularyName
	 * @param annotationTerm
	 */
	getEntitySetAnnotationsByTerm(vocabularyName: keyof EntityTypeAnnotations, annotationTerm: string): AnnotationTerm<any>[];

	/**
	 * Get all annotations of a given term and vocabulary on the entity container.
	 *
	 * @param vocabularyName
	 * @param annotationTerm
	 */
	getEntityContainerAnnotationsByTerm(vocabularyName: keyof EntityTypeAnnotations, annotationTerm: string): AnnotationTerm<any>[];
};
