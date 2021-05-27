import { AnnotationTerm } from "@sap-ux/vocabularies-types";
import {
	AnyAnnotation,
	ConverterOutput,
	EntitySet,
	EntityType,
	EntityContainer,
	NavigationProperty,
	Property
} from "@sap-ux/annotation-converter";
import { BaseManifestSettings, createManifestWrapper, ManifestWrapper } from "sap/fe/core/converters/ManifestSettings";
import {
	ConverterContext,
	IShellServicesProxy,
	TemplateType,
	ResolvedAnnotationContext
} from "sap/fe/core/converters/templates/BaseConverter";
import { Context, ODataMetaModel } from "sap/ui/model/odata/v4";
import { convertTypes, ResolvedTarget } from "sap/fe/core/converters/MetaModelConverter";
import { IDiagnostics } from "sap/fe/core/converters/TemplateConverter";
import { DataModelObjectPath, getTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { EntityTypeAnnotations } from "@sap-ux/vocabularies-types/types/generated/Edm_Types";

/**
 * Checks whether an object is an annotation term.
 *
 * @param {string|AnnotationTerm<object>} vAnnotationPath
 * @returns {boolean}
 */
const isAnnotationTerm = function(vAnnotationPath: string | AnnotationTerm<any>): vAnnotationPath is AnnotationTerm<any> {
	return typeof vAnnotationPath === "object";
};

const getDataModelPathForEntitySet = function(entitySet: EntitySet): DataModelObjectPath {
	const dataModelPath: DataModelObjectPath = {
		startingEntitySet: entitySet,
		targetEntityType: entitySet.entityType,
		targetEntitySet: entitySet,
		navigationProperties: [],
		contextLocation: undefined,
		targetObject: entitySet
	};
	dataModelPath.contextLocation = dataModelPath;
	return dataModelPath;
};

/**
 * Create a ConverterContext object that will be used within the converters.
 *
 * @param {ConverterOutput} oConvertedTypes the converted annotation and service types
 * @param {BaseManifestSettings} oManifestSettings the manifestSettings that applies to this page
 * @param {TemplateType} templateType the type of template we're looking at right now
 * @param {IShellServicesProxy} shellServices the current instance of the shellservice
 * @param {IDiagnostics} diagnostics the diagnostics shim
 * @param {Function} mergeFn the function to be used to perfom some deep merges between object
 * @param {DataModelObjectPath} targetDataModelPath the global path to reach the entitySet
 *
 * @returns {ConverterContext} a converter context for the converters
 */
export function createConverterContext(
	oConvertedTypes: ConverterOutput,
	oManifestSettings: BaseManifestSettings,
	templateType: TemplateType,
	shellServices: IShellServicesProxy,
	diagnostics: IDiagnostics,
	mergeFn: Function,
	targetDataModelPath: DataModelObjectPath
): ConverterContext {
	const oManifestWrapper = createManifestWrapper(oManifestSettings, mergeFn);
	const sBaseContextPath = getTargetObjectPath(targetDataModelPath);

	const getEntityTypeFromFullyQualifiedName = function(fullyQualifiedName: string): EntityType | undefined {
		const targetEntityType = oConvertedTypes.entityTypes.find(entityType => {
			if (fullyQualifiedName.startsWith(entityType.fullyQualifiedName)) {
				const replaceAnnotation = fullyQualifiedName.replace(entityType.fullyQualifiedName, "");
				return replaceAnnotation.startsWith("/") || replaceAnnotation.startsWith("@");
			}
			return false;
		});
		return targetEntityType;
	};

	const getAnnotationEntityType = function(annotation?: AnnotationTerm<any>): EntityType {
		if (annotation) {
			const annotationPath = annotation.fullyQualifiedName;
			const targetEntityType = getEntityTypeFromFullyQualifiedName(annotationPath);
			if (!targetEntityType) {
				throw new Error("Cannot find Entity Type for " + annotation.fullyQualifiedName);
			}
			return targetEntityType;
		} else {
			return targetDataModelPath.targetEntityType;
		}
	};

	const getManifestControlConfiguration = function(vAnnotationPath: string | AnnotationTerm<any>): any {
		if (isAnnotationTerm(vAnnotationPath)) {
			return oManifestWrapper.getControlConfiguration(
				getRelativeAnnotationPath(vAnnotationPath.fullyQualifiedName, targetDataModelPath.targetEntityType)
			);
		}
		return oManifestWrapper.getControlConfiguration(vAnnotationPath);
	};

	const getAbsoluteAnnotationPath = function(sAnnotationPath: string): string {
		if (!sAnnotationPath) {
			return sAnnotationPath;
		}
		if (sAnnotationPath[0] === "/") {
			return sAnnotationPath;
		}
		return sBaseContextPath + "/" + sAnnotationPath;
	};

	const getEntitySet = function(): EntitySet | undefined {
		return targetDataModelPath.targetEntitySet;
	};

	const getDataModelObjectPath = function(): DataModelObjectPath {
		return targetDataModelPath;
	};

	const findEntitySet = function(entitySetName: string | undefined): EntitySet | undefined {
		if (entitySetName === undefined) {
			return targetDataModelPath.targetEntitySet;
		}
		return oConvertedTypes.entitySets.find(entitySet => entitySet.name === entitySetName);
	};

	const getEntitySetForEntityType = function(entityType: EntityType): EntitySet | undefined {
		return oConvertedTypes.entitySets.find(entitySet => entitySet.entityType === entityType);
	};

	const getEntityContainer = function(): EntityContainer {
		return oConvertedTypes.entityContainer;
	};

	const getEntityType = function(): EntityType {
		return targetDataModelPath.targetEntityType;
	};

	const getEntityPropertyFromFullyQualifiedName = function(fullyQualifiedName: string): Property | undefined {
		if (fullyQualifiedName) {
			const targetEntityType = getEntityTypeFromFullyQualifiedName(fullyQualifiedName);
			return targetEntityType?.entityProperties?.find(
				(propertyName: any) => propertyName.name === fullyQualifiedName.split("/").pop()
			) as Property;
		}
		return undefined;
	};

	const getEntityTypeAnnotation = function(annotationPath: string): ResolvedAnnotationContext {
		if (annotationPath.indexOf("@") === -1) {
			annotationPath = "@" + annotationPath;
		}
		const targetObject: ResolvedTarget = targetDataModelPath.targetEntityType.resolvePath(annotationPath, true);

		let rootEntitySet = targetDataModelPath.targetEntitySet;
		let currentEntityType = targetDataModelPath.targetEntityType;
		const navigationProperties = targetDataModelPath.navigationProperties.concat();
		let i = 1;
		let currentObject;
		let navigatedPaths = [];
		while (i < targetObject.visitedObjects.length) {
			currentObject = targetObject.visitedObjects[i++];
			if (currentObject._type === "NavigationProperty") {
				navigatedPaths.push(currentObject.name);
				navigationProperties.push(currentObject as NavigationProperty);
				currentEntityType = (currentObject as NavigationProperty).targetType;
				if (rootEntitySet && rootEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
					rootEntitySet = rootEntitySet.navigationPropertyBinding[currentObject.name];
					navigatedPaths = [];
				}
			}
			if (currentObject._type === "EntitySet") {
				rootEntitySet = currentObject as EntitySet;
				currentEntityType = rootEntitySet.entityType;
			}
		}
		const outDataModelPath = {
			startingEntitySet: targetDataModelPath.startingEntitySet,
			targetEntitySet: rootEntitySet,
			targetEntityType: currentEntityType,
			targetObject: navigationProperties[navigationProperties.length - 1],
			navigationProperties,
			contextLocation: targetDataModelPath.contextLocation
		};
		return {
			annotation: targetObject.target as AnyAnnotation,
			converterContext: createConverterContext(
				oConvertedTypes,
				oManifestSettings,
				templateType,
				shellServices,
				diagnostics,
				mergeFn,
				outDataModelPath
			)
		};
	};

	const getTemplateType = function(): TemplateType {
		return templateType;
	};

	const getRelativeAnnotationPath = function(annotationPath: string, entityType: EntityType): string {
		return annotationPath.replace(entityType.fullyQualifiedName, "");
	};

	const getEntitySetBasedAnnotationPath = function(annotationPath: string): string {
		if (!annotationPath) {
			return annotationPath;
		}
		const entityTypeFQN = targetDataModelPath.targetEntityType.fullyQualifiedName;
		if (targetDataModelPath.targetEntitySet || ((sBaseContextPath.startsWith("/") && sBaseContextPath.match(/\//g)) || []).length > 1) {
			let replacedAnnotationPath = annotationPath.replace(entityTypeFQN, "/");
			if (replacedAnnotationPath.length > 2 && replacedAnnotationPath[0] === "/" && replacedAnnotationPath[1] === "/") {
				replacedAnnotationPath = replacedAnnotationPath.substr(1);
			}
			return sBaseContextPath + replacedAnnotationPath;
		} else {
			return "/" + annotationPath;
		}
	};

	const getManifestWrapper = function(): ManifestWrapper {
		return oManifestWrapper;
	};

	const getShellServices = function(): IShellServicesProxy {
		return shellServices;
	};

	const getDiagnostics = function(): IDiagnostics {
		return diagnostics;
	};

	const getConverterContextFor = function(targetEntitySet: EntitySet): ConverterContext {
		const targetPath = getDataModelPathForEntitySet(targetEntitySet);
		return createConverterContext(oConvertedTypes, oManifestSettings, templateType, shellServices, diagnostics, mergeFn, targetPath);
	};

	const _filterAnnotations = function(
		annotations: Record<string, AnnotationTerm<any>>,
		vocabularyName: keyof EntityTypeAnnotations,
		annotationTerm: string
	): AnnotationTerm<any>[] {
		let outAnnotations: AnnotationTerm<any> = [];
		if (annotations) {
			outAnnotations = Object.keys(annotations)
				.filter(annotation => annotations[annotation].term === annotationTerm)
				.reduce((previousValue: AnnotationTerm<any>[], key: string) => {
					previousValue.push(annotations[key]);
					return previousValue;
				}, []);
		}
		return outAnnotations;
	};

	const getAnnotationsByTerm = function(
		vocabularyName: keyof EntityTypeAnnotations,
		annotationTerm: string,
		entityType: EntityType = getEntityType()
	): AnnotationTerm<any>[] {
		const annotations: Record<string, AnnotationTerm<any>> = entityType?.annotations[vocabularyName] || {};

		return _filterAnnotations(annotations, vocabularyName, annotationTerm);
	};

	const getEntitySetAnnotationsByTerm = function(
		vocabularyName: keyof EntityTypeAnnotations,
		annotationTerm: string
	): AnnotationTerm<any>[] {
		const annotations: Record<string, AnnotationTerm<any>> = getEntitySet()?.annotations[vocabularyName] || {};

		return _filterAnnotations(annotations, vocabularyName, annotationTerm);
	};

	const getEntityContainerAnnotationsByTerm = function(
		vocabularyName: keyof EntityTypeAnnotations,
		annotationTerm: string
	): AnnotationTerm<any>[] {
		const annotations: Record<string, AnnotationTerm<any>> = getEntityContainer()?.annotations?.[vocabularyName] || {};

		return _filterAnnotations(annotations, vocabularyName, annotationTerm);
	};

	return {
		getAnnotationEntityType,
		getManifestControlConfiguration,
		getAbsoluteAnnotationPath,
		getEntitySet,
		getDataModelObjectPath,
		findEntitySet,
		getEntitySetForEntityType,
		getEntityContainer,
		getEntityType,
		getEntityTypeAnnotation,
		getTemplateType,
		getRelativeAnnotationPath,
		getEntitySetBasedAnnotationPath,
		getManifestWrapper,
		getShellServices,
		getDiagnostics,
		getConverterContextFor,
		getEntityPropertyFromFullyQualifiedName,
		getAnnotationsByTerm,
		getEntitySetAnnotationsByTerm,
		getEntityContainerAnnotationsByTerm
	};
}

/**
 * Create the converter context necessary for a macro based on a metamodel context.
 * @param sEntitySetName
 * @param oMetaModelContext
 * @param templateType
 * @param shellServices
 * @param diagnostics
 * @param mergeFn
 * @param targetDataModelPath
 * @param manifestSettings
 * @returns {ConverterContext} the current converter context
 */
export function createConverterContextForMacro(
	sEntitySetName: string,
	oMetaModelContext: Context | ODataMetaModel,
	templateType: TemplateType,
	shellServices: IShellServicesProxy,
	diagnostics: IDiagnostics,
	mergeFn: Function,
	targetDataModelPath: DataModelObjectPath | undefined,
	manifestSettings: BaseManifestSettings = {} as BaseManifestSettings
): ConverterContext {
	const oMetaModel: ODataMetaModel = oMetaModelContext.isA("sap.ui.model.odata.v4.ODataMetaModel")
		? (oMetaModelContext as ODataMetaModel)
		: (((oMetaModelContext as Context).getModel() as unknown) as ODataMetaModel);
	const oConverterOutput = convertTypes(oMetaModel);
	const targetEntitySet = oConverterOutput.entitySets.find(entitySet => entitySet.name === sEntitySetName) as EntitySet;
	if (!targetDataModelPath) {
		targetDataModelPath = {
			startingEntitySet: targetEntitySet,
			navigationProperties: [],
			targetEntitySet: targetEntitySet,
			targetEntityType: targetEntitySet.entityType,
			targetObject: targetEntitySet
		};
	}
	return createConverterContext(
		oConverterOutput,
		manifestSettings,
		templateType,
		shellServices,
		diagnostics,
		mergeFn,
		targetDataModelPath
	);
}
