import { ActionType, ManifestSubSection, ManifestAction } from "../../ManifestSettings";
import {
	AnnotationTerm,
	CollectionFacetTypes,
	DataFieldAbstractTypes,
	FacetTypes,
	FieldGroup,
	Identification,
	OperationGroupingType,
	ReferenceFacetTypes,
	StatusInfo,
	UIAnnotationTerms,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import { CommunicationAnnotationTerms } from "@sap-ux/vocabularies-types/dist/generated/Communication";
import { CustomSubSectionID, FormID, SubSectionID, SideContentID } from "../../helpers/ID";
import { ConverterContext } from "../../templates/BaseConverter";
import { createFormDefinition, FormDefinition, isReferenceFacet } from "../Common/Form";
import { DataVisualizationDefinition, getDataVisualizationConfiguration } from "../Common/DataVisualization";
import { ConfigurableObject, ConfigurableRecord, CustomElement, insertCustomElements, Placement } from "../../helpers/ConfigurableObject";
import {
	ConverterAction,
	CustomAction,
	getActionsFromManifest,
	getEnabledBinding,
	isActionNavigable,
	ButtonType,
	getSemanticObjectMapping,
	removeDuplicateActions,
	BaseAction
} from "sap/fe/core/converters/controls/Common/Action";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import {
	annotationExpression,
	bindingExpression,
	BindingExpression,
	compileBinding,
	equal,
	fn,
	not,
	ref
} from "sap/fe/core/helpers/BindingExpression";
import { IssueType, IssueSeverity, IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";
import { FlexSettings, getDesignTimeMetadata } from "sap/fe/core/converters/controls/ObjectPage/HeaderFacet";
import { getVisibilityEnablementFormMenuActions, getFormHiddenActions, getFormActions } from "../../objectPage/FormMenuActions";

export enum SubSectionType {
	Unknown = "Unknown", // Default Type
	Form = "Form",
	DataVisualization = "DataVisualization",
	XMLFragment = "XMLFragment",
	Placeholder = "Placeholder",
	Mixed = "Mixed"
}

type ObjectPageSubSection =
	| UnsupportedSubSection
	| FormSubSection
	| DataVisualizationSubSection
	| ContactSubSection
	| XMLFragmentSubSection
	| PlaceholderFragmentSubSection
	| MixedSubSection;

type BaseSubSection = {
	id: string;
	key: string;
	title: BindingExpression<string>;
	annotationPath: string;
	type: SubSectionType;
	visible: BindingExpression<boolean>;
	flexSettings?: FlexSettings;
	level: number;
	sideContent?: SideContentDef;
};

type UnsupportedSubSection = BaseSubSection & {
	text: string;
};

type DataVisualizationSubSection = BaseSubSection & {
	type: SubSectionType.DataVisualization;
	presentation: DataVisualizationDefinition;
	showTitle: boolean;
};

type ContactSubSection = UnsupportedSubSection & {};

type XMLFragmentSubSection = Omit<BaseSubSection, "annotationPath"> & {
	type: SubSectionType.XMLFragment;
	template: string;
	actions: Record<string, CustomAction>;
};

type Emphasized = {
	path: string;
};

type PlaceholderFragmentSubSection = Omit<BaseSubSection, "annotationPath"> & {
	type: SubSectionType.Placeholder;
	actions: Record<string, CustomAction>;
};

type MixedSubSection = BaseSubSection & {
	content: Array<ObjectPageSubSection>;
};

export type FormSubSection = BaseSubSection & {
	type: SubSectionType.Form;
	formDefinition: FormDefinition;
	actions: ConverterAction[] | BaseAction[];
};

export type ObjectPageSection = ConfigurableObject & {
	id: string;
	title: BindingExpression<string>;
	showTitle?: BindingExpression<boolean>;
	visible: BindingExpression<boolean>;
	subSections: ObjectPageSubSection[];
};

type SideContentDef = {
	template?: string;
	id?: string;
	sideContentFallDown?: string;
	containerQuery?: string;
	visible?: boolean;
};

export type CustomObjectPageSection = CustomElement<ObjectPageSection>;

export type CustomObjectPageSubSection = CustomElement<ObjectPageSubSection>;

const targetTerms: string[] = [
	UIAnnotationTerms.LineItem,
	UIAnnotationTerms.PresentationVariant,
	UIAnnotationTerms.SelectionPresentationVariant
];

// TODO: Need to handle Table case inside createSubSection function if CollectionFacet has Table ReferenceFacet
const hasTable = (facets: any[] = []) => {
	return facets.some(facetType => targetTerms.indexOf(facetType?.Target?.$target?.term) > -1);
};

/**
 * Create subsections based on facet definition.
 *
 * @param facetCollection
 * @param converterContext
 * @returns {ObjectPageSubSection[]} the current subections
 */
export function createSubSections(facetCollection: FacetTypes[], converterContext: ConverterContext): ObjectPageSubSection[] {
	// First we determine which sub section we need to create
	const facetsToCreate = facetCollection.reduce((facetsToCreate: FacetTypes[], facetDefinition) => {
		switch (facetDefinition.$Type) {
			case UIAnnotationTypes.ReferenceFacet:
				facetsToCreate.push(facetDefinition);
				break;
			case UIAnnotationTypes.CollectionFacet:
				// TODO If the Collection Facet has a child of type Collection Facet we bring them up one level (Form + Table use case) ?
				// first case facet Collection is combination of collection and reference facet or not all facets are reference facets.
				if (facetDefinition.Facets.find(facetType => facetType.$Type === UIAnnotationTypes.CollectionFacet)) {
					facetsToCreate.splice(facetsToCreate.length, 0, ...facetDefinition.Facets);
				} else {
					facetsToCreate.push(facetDefinition);
				}
				break;
			case UIAnnotationTypes.ReferenceURLFacet:
				// Not supported
				break;
		}
		return facetsToCreate;
	}, []);

	// Then we create the actual subsections
	return facetsToCreate.map(facet => createSubSection(facet, facetsToCreate, converterContext, 0, !(facet as any)?.Facets?.length));
}

// function isTargetForCompliant(annotationPath: AnnotationPath) {
// 	return /.*com\.sap\.vocabularies\.UI\.v1\.(FieldGroup|Identification|DataPoint|StatusInfo).*/.test(annotationPath.value);
// }
const getSubSectionKey = (facetDefinition: FacetTypes, fallback: string): string => {
	return facetDefinition.ID?.toString() || facetDefinition.Label?.toString() || fallback;
};
/**
 * Add Form menu action to all form actios, remove duplicate action and hidden actions.
 * @param actions
 * @param facetDefinition
 * @param converterContext
 * @returns {BaseAction[] | ConverterAction[]}
 */
function addFormMenuActions(
	actions: ConverterAction[],
	facetDefinition: FacetTypes,
	converterContext: ConverterContext
): BaseAction[] | ConverterAction[] {
	const hiddenActions: BaseAction[] = getFormHiddenActions(facetDefinition, converterContext) || [],
		formActions: ConfigurableRecord<ManifestAction> = getFormActions(facetDefinition, converterContext),
		formAllActions = insertCustomElements(
			actions,
			getActionsFromManifest(formActions, converterContext, actions, undefined, undefined, hiddenActions)
		);
	return formAllActions ? getVisibilityEnablementFormMenuActions(removeDuplicateActions(formAllActions)) : actions;
}

/**
 * Retrieves the action form a facet.
 * @param facetDefinition
 * @param converterContext
 * @returns {ConverterAction[] | BaseAction[]} the current facet actions
 */
function getFacetActions(facetDefinition: FacetTypes, converterContext: ConverterContext): BaseAction[] | ConverterAction[] {
	let actions = new Array<ConverterAction>();
	switch (facetDefinition.$Type) {
		case UIAnnotationTypes.CollectionFacet:
			actions = (facetDefinition.Facets.filter(facetDefinition => isReferenceFacet(facetDefinition)) as ReferenceFacetTypes[]).reduce(
				(actions: ConverterAction[], facetDefinition) => createFormActionReducer(actions, facetDefinition, converterContext),
				[]
			);
			break;
		case UIAnnotationTypes.ReferenceFacet:
			actions = createFormActionReducer([], facetDefinition as ReferenceFacetTypes, converterContext);
			break;
	}
	return addFormMenuActions(actions, facetDefinition, converterContext);
}
/**
 * Retruns the button type based on @UI.Emphasized annotation.
 * @param Emphasized Emphasized annotation value.
 * @returns {ButtonType | string} returns button type or path based expression.
 */
function getButtonType(Emphasized: Emphasized): ButtonType | string {
	const PathForButtonType: string = Emphasized?.path;
	if (PathForButtonType) {
		return "{= " + "!${" + PathForButtonType + "} ? '" + ButtonType.Transparent + "' : ${" + PathForButtonType + "}" + "}";
	} else if (Emphasized) {
		return ButtonType.Ghost;
	}
	return ButtonType.Transparent;
}

/**
 * Create a subsection based on a FacetTypes.
 * @param facetDefinition
 * @param facetsToCreate
 * @param converterContext
 * @param level
 * @param hasSingleContent
 * @returns {ObjectPageSubSection} one sub section definition
 */
export function createSubSection(
	facetDefinition: FacetTypes,
	facetsToCreate: FacetTypes[],
	converterContext: ConverterContext,
	level: number,
	hasSingleContent: boolean
): ObjectPageSubSection {
	const subSectionID = SubSectionID({ Facet: facetDefinition });
	const subSection: BaseSubSection = {
		id: subSectionID,
		key: getSubSectionKey(facetDefinition, subSectionID),
		title: compileBinding(annotationExpression(facetDefinition.Label)),
		type: SubSectionType.Unknown,
		annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName),
		visible: compileBinding(not(equal(annotationExpression(facetDefinition.annotations?.UI?.Hidden), true))),
		flexSettings: { designtime: getDesignTimeMetadata(facetDefinition, facetDefinition, converterContext) },
		level: level,
		sideContent: undefined
	};
	let content: Array<ObjectPageSubSection> = [];
	const tableContent: Array<ObjectPageSubSection> = [];
	const index: Array<number> = [];
	let unsupportedText = "";
	level++;
	switch (facetDefinition.$Type) {
		case UIAnnotationTypes.CollectionFacet:
			const facets = facetDefinition.Facets;
			if (hasTable(facets)) {
				// if we have tables in a collection facet then we create separate subsection for them
				for (let i = 0; i < facets.length; i++) {
					if (targetTerms.indexOf((facets[i] as any).Target?.$target?.term) > -1) {
						//creating separate array for tables
						tableContent.push(createSubSection(facets[i], [], converterContext, level, facets.length === 1));
						index.push(i);
					}
				}
				for (let i = index.length - 1; i >= 0; i--) {
					//remove table facets from facet definition
					facets.splice(index[i], 1);
				}
				if (facets.length) {
					facetDefinition.Facets = facets;
					//create a form subsection from the remaining facets
					content.push(createSubSection(facetDefinition, [], converterContext, level, hasSingleContent));
				}
				content = content.concat(tableContent);
				const mixedSubSection: MixedSubSection = {
					...subSection,
					type: SubSectionType.Mixed,
					level: level,
					content: content
				};
				return mixedSubSection;
			} else {
				const formCollectionSubSection: FormSubSection = {
					...subSection,
					type: SubSectionType.Form,
					formDefinition: createFormDefinition(facetDefinition, converterContext),
					level: level,
					actions: getFacetActions(facetDefinition, converterContext)
				};
				return formCollectionSubSection;
			}
		case UIAnnotationTypes.ReferenceFacet:
			if (!facetDefinition.Target.$target) {
				unsupportedText = `Unable to find annotationPath ${facetDefinition.Target.value}`;
			} else {
				switch (facetDefinition.Target.$target.term) {
					case UIAnnotationTerms.LineItem:
					case UIAnnotationTerms.Chart:
					case UIAnnotationTerms.PresentationVariant:
					case UIAnnotationTerms.SelectionPresentationVariant:
						const presentation = getDataVisualizationConfiguration(
							facetDefinition.Target.value,
							getCondensedTableLayoutCompliance(facetDefinition, facetsToCreate, converterContext),
							converterContext
						);
						let controlTitle = (presentation.visualizations[0] as any)?.annotation?.title;
						controlTitle ? controlTitle : (controlTitle = (presentation.visualizations[0] as any)?.title);
						const dataVisualizationSubSection: DataVisualizationSubSection = {
							...subSection,
							type: SubSectionType.DataVisualization,
							level: level,
							presentation: presentation,
							showTitle: isSubsectionTitleShown(hasSingleContent, subSection.title, controlTitle)
						};
						return dataVisualizationSubSection;

					case UIAnnotationTerms.FieldGroup:
					case UIAnnotationTerms.Identification:
					case UIAnnotationTerms.DataPoint:
					case UIAnnotationTerms.StatusInfo:
					case CommunicationAnnotationTerms.Contact:
						// All those element belong to a form facet
						const formElementSubSection: FormSubSection = {
							...subSection,
							type: SubSectionType.Form,
							level: level,
							formDefinition: createFormDefinition(facetDefinition, converterContext),
							actions: getFacetActions(facetDefinition, converterContext)
						};
						return formElementSubSection;

					default:
						unsupportedText = `For ${facetDefinition.Target.$target.term} Fragment`;
						break;
				}
			}
			break;
		case UIAnnotationTypes.ReferenceURLFacet:
			unsupportedText = "For Reference URL Facet";
			break;
		default:
			break;
	}
	// If we reach here we ended up with an unsupported SubSection type
	const unsupportedSubSection: UnsupportedSubSection = {
		...subSection,
		text: unsupportedText
	};
	return unsupportedSubSection;
}
function isSubsectionTitleShown(hasSingleContent: boolean, subSectionTitle: BindingExpression<string>, controlTitle: string): boolean {
	if (hasSingleContent && controlTitle === subSectionTitle) {
		return false;
	}
	return true;
}
function createFormActionReducer(
	actions: ConverterAction[],
	facetDefinition: ReferenceFacetTypes,
	converterContext: ConverterContext
): ConverterAction[] {
	const referenceTarget: AnnotationTerm<any> = facetDefinition.Target.$target;
	const targetValue = facetDefinition.Target.value;
	let manifestActions: Record<string, CustomAction> = {};
	let dataFieldCollection: DataFieldAbstractTypes[] = [];
	let [navigationPropertyPath]: any = targetValue.split("@");
	if (navigationPropertyPath.length > 0) {
		if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
			navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
		}
	} else {
		navigationPropertyPath = undefined;
	}

	if (referenceTarget) {
		switch (referenceTarget.term) {
			case UIAnnotationTerms.FieldGroup:
				dataFieldCollection = (referenceTarget as FieldGroup).Data;
				manifestActions = getActionsFromManifest(
					converterContext.getManifestControlConfiguration(referenceTarget).actions,
					converterContext
				);
				break;
			case UIAnnotationTerms.Identification:
			case UIAnnotationTerms.StatusInfo:
				if (referenceTarget.qualifier) {
					dataFieldCollection = referenceTarget as Identification | StatusInfo;
				}
				break;
		}
	}

	return dataFieldCollection.reduce((actions, dataField: DataFieldAbstractTypes) => {
		const UIAnnotation: any = dataField?.annotations?.UI;
		switch (dataField.$Type) {
			case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
				if (dataField.RequiresContext?.valueOf() === true) {
					converterContext
						.getDiagnostics()
						.addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.REQUIRESCONTEXT);
				}
				if (dataField.Inline?.valueOf() === true) {
					converterContext
						.getDiagnostics()
						.addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.INLINE);
				}
				const mNavigationParameters: any = {};
				if (dataField.Mapping) {
					mNavigationParameters.semanticObjectMapping = getSemanticObjectMapping(dataField.Mapping);
				}
				actions.push({
					type: ActionType.DataFieldForIntentBasedNavigation,
					id: FormID({ Facet: facetDefinition }, dataField),
					key: KeyHelper.generateKeyFromDataField(dataField),
					text: dataField.Label?.toString(),
					annotationPath: "",
					enabled:
						dataField.NavigationAvailable !== undefined
							? compileBinding(equal(annotationExpression(dataField.NavigationAvailable?.valueOf()), true))
							: true,
					visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden?.valueOf()), true))),
					buttonType: getButtonType(UIAnnotation?.Emphasized),
					press: compileBinding(
						fn("._intentBasedNavigation.navigate", [
							annotationExpression(dataField.SemanticObject),
							annotationExpression(dataField.Action),
							mNavigationParameters
						])
					),
					customData: compileBinding({
						semanticObject: annotationExpression(dataField.SemanticObject),
						action: annotationExpression(dataField.Action)
					})
				});
				break;
			case UIAnnotationTypes.DataFieldForAction:
				const formManifestActionsConfiguration: any = converterContext.getManifestControlConfiguration(referenceTarget).actions;
				const key: string = KeyHelper.generateKeyFromDataField(dataField);
				actions.push({
					type: ActionType.DataFieldForAction,
					id: FormID({ Facet: facetDefinition }, dataField),
					key: key,
					text: dataField.Label?.toString(),
					annotationPath: "",
					enabled: getEnabledBinding(dataField.ActionTarget),
					binding: navigationPropertyPath ? "{ 'path' : '" + navigationPropertyPath + "'}" : undefined,
					visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden?.valueOf()), true))),
					requiresDialog: isDialog(dataField.ActionTarget),
					buttonType: getButtonType(UIAnnotation?.Emphasized),
					press: compileBinding(
						fn(
							"invokeAction",
							[
								dataField.Action,
								{
									contexts: fn("getBindingContext", [], bindingExpression("", "$source")),
									invocationGrouping: (dataField.InvocationGrouping === "UI.OperationGroupingType/ChangeSet"
										? "ChangeSet"
										: "Isolated") as OperationGroupingType,
									label: annotationExpression(dataField.Label),
									model: fn("getModel", [], bindingExpression("/", "$source")),
									isNavigable: isActionNavigable(
										formManifestActionsConfiguration && formManifestActionsConfiguration[key]
									)
								}
							],
							ref(".editFlow")
						)
					)
				});
				break;
		}
		actions = insertCustomElements(actions, manifestActions);
		return actions;
	}, actions);
}

export function isDialog(actionDefinition: any | undefined): string {
	if (actionDefinition) {
		const bCritical = actionDefinition.annotations?.Common?.IsActionCritical;
		if (actionDefinition.parameters.length > 1 || bCritical) {
			return "Dialog";
		} else {
			return "None";
		}
	} else {
		return "None";
	}
}

export function createCustomSubSections(
	manifestSubSections: Record<string, ManifestSubSection>,
	converterContext: ConverterContext
): Record<string, CustomObjectPageSubSection> {
	const subSections: Record<string, CustomObjectPageSubSection> = {};
	Object.keys(manifestSubSections).forEach(
		subSectionKey =>
			(subSections[subSectionKey] = createCustomSubSection(manifestSubSections[subSectionKey], subSectionKey, converterContext))
	);
	return subSections;
}

export function createCustomSubSection(
	manifestSubSection: ManifestSubSection,
	subSectionKey: string,
	converterContext: ConverterContext
): CustomObjectPageSubSection {
	const sideContent: SideContentDef | undefined = manifestSubSection.sideContent
		? {
				template: manifestSubSection.sideContent.template,
				id: SideContentID(subSectionKey),
				visible: false
		  }
		: undefined;
	let position = manifestSubSection.position;
	if (!position) {
		position = {
			placement: Placement.After
		};
	}
	const subSectionDefinition = {
		type: SubSectionType.Unknown,
		id: manifestSubSection.id || CustomSubSectionID(subSectionKey),
		actions: getActionsFromManifest(manifestSubSection.actions, converterContext),
		key: subSectionKey,
		title: manifestSubSection.title,
		level: 1,
		position: position,
		visible: manifestSubSection.visible,
		sideContent: sideContent
	};
	if (manifestSubSection.template || manifestSubSection.name) {
		subSectionDefinition.type = SubSectionType.XMLFragment;
		((subSectionDefinition as unknown) as XMLFragmentSubSection).template =
			manifestSubSection.template || manifestSubSection.name || "";
	} else {
		subSectionDefinition.type = SubSectionType.Placeholder;
	}
	return subSectionDefinition as CustomObjectPageSubSection;
}

/**
 * Evaluate if the condensed mode can be appli3ed on the table.
 *
 * @param currentFacet
 * @param facetsToCreateInSection
 * @param converterContext
 *
 * @returns {boolean}  true for compliant, false otherwise
 */
function getCondensedTableLayoutCompliance(
	currentFacet: FacetTypes,
	facetsToCreateInSection: FacetTypes[],
	converterContext: ConverterContext
): boolean {
	const manifestWrapper = converterContext.getManifestWrapper();
	if (manifestWrapper.useIconTabBar()) {
		// If the OP use the tab based we check if the facets that will be created for this section are all non visible
		return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
	} else {
		const entityType = converterContext.getEntityType();
		if (entityType.annotations?.UI?.Facets?.length && entityType.annotations?.UI?.Facets?.length > 1) {
			return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
		} else {
			return true;
		}
	}
}

function hasNoOtherVisibleTableInTargets(currentFacet: FacetTypes, facetsToCreateInSection: FacetTypes[]): boolean {
	return facetsToCreateInSection.every(function(subFacet) {
		if (subFacet !== currentFacet) {
			if (subFacet.$Type === UIAnnotationTypes.ReferenceFacet) {
				const refFacet = subFacet as ReferenceFacetTypes;
				if (
					refFacet.Target?.$target?.term === UIAnnotationTerms.LineItem ||
					refFacet.Target?.$target?.term === UIAnnotationTerms.PresentationVariant ||
					refFacet.Target.$target?.term === UIAnnotationTerms.SelectionPresentationVariant
				) {
					return refFacet.annotations?.UI?.Hidden !== undefined ? refFacet.annotations?.UI?.Hidden : false;
				}
				return true;
			} else {
				const subCollectionFacet = subFacet as CollectionFacetTypes;
				return subCollectionFacet.Facets.every(function(facet) {
					const subRefFacet = facet as ReferenceFacetTypes;
					if (
						subRefFacet.Target?.$target?.term === UIAnnotationTerms.LineItem ||
						subRefFacet.Target?.$target?.term === UIAnnotationTerms.PresentationVariant ||
						subRefFacet.Target?.$target?.term === UIAnnotationTerms.SelectionPresentationVariant
					) {
						return subRefFacet.annotations?.UI?.Hidden !== undefined ? subRefFacet.annotations?.UI?.Hidden : false;
					}
					return true;
				});
			}
		}
		return true;
	});
}
