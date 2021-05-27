import {
	AvailabilityType,
	FilterFieldManifestConfiguration,
	FilterManifestConfiguration,
	MultipleViewsConfiguration,
	ViewPathConfiguration,
	VisualizationType,
	FilterSettings
} from "../ManifestSettings";
import { getTargetObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { EntitySet, EntityType, NavigationProperty, Property } from "@sap-ux/annotation-converter";
import { ConverterContext, TemplateType } from "./BaseConverter";
import {
	DataVisualizationAnnotations,
	DataVisualizationDefinition,
	getDataVisualizationConfiguration,
	getDefaultChart,
	getDefaultLineItem,
	getDefaultPresentationVariant,
	getSelectionPresentationVariant,
	isPresentationCompliant,
	getSelectionVariant,
	isSelectionPresentationCompliant
} from "../controls/Common/DataVisualization";
import {
	LineItem,
	PresentationVariantTypeTypes,
	SelectionPresentationVariantTypeTypes,
	SelectOptionType,
	SelectionVariantTypeTypes,
	FieldGroupType
} from "@sap-ux/vocabularies-types/dist/generated/UI";
import { AnnotationTerm, DataFieldAbstractTypes, ReferenceFacetTypes, UIAnnotationTerms } from "@sap-ux/vocabularies-types";
import { FilterBarID, FilterVariantManagementID, TableID } from "../helpers/ID";
import {
	getSelectionVariantConfiguration,
	SelectionVariantConfiguration,
	TableVisualization
} from "sap/fe/core/converters/controls/Common/Table";
import { BaseAction, getActionsFromManifest } from "sap/fe/core/converters/controls/Common/Action";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { annotationExpression, compileBinding } from "sap/fe/core/helpers/BindingExpression";
import { IssueType, IssueSeverity, IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";

type ViewAnnotationsTypeTypes = SelectionPresentationVariantTypeTypes | SelectionVariantTypeTypes;
type VariantManagementDefinition = {
	id: string;
	targetControlIds: string;
};

type MultipleViewConfiguration = ViewPathConfiguration & {
	annotation?: DataVisualizationAnnotations;
};

type SingleViewConfiguration = {
	annotation?: DataVisualizationAnnotations;
};

type ViewConfiguration = MultipleViewConfiguration | SingleViewConfiguration;

type FilterField = ConfigurableObject & {
	conditionPath: string;
	availability: AvailabilityType;
	annotationPath: string;
	label?: string;
	template?: string;
	group?: string;
	groupLabel?: string;
	settings?: FilterSettings;
};

type FilterGroup = {
	group?: string;
	groupLabel?: string;
};

type ViewConverterSettings = ViewConfiguration & {
	converterContext: ConverterContext;
	entitySet: EntitySet;
};

type CustomElementFilterField = CustomElement<FilterField>;

export type ListReportDefinition = {
	mainEntitySet: string;
	mainEntityType: string; // entityType> at the start of LR templating
	singleTableId?: string; // only with single Table mode
	singleChartId?: string; // only with single Table mode
	showTabCounts?: boolean; // only with multi Table mode
	headerActions: BaseAction[];
	filterBar: {
		selectionFields: FilterField[];
		hideBasicSearch: boolean;
	};
	views: ListReportViewDefinition[];
	filterConditions: object;
	isMultiEntitySets: boolean;
	filterBarId: string;
	variantManagement: VariantManagementDefinition;
	isAlp: boolean;
	useSemanticDateRange?: boolean;
};

export type ListReportViewDefinition = {
	selectionVariantPath?: string; // only with on multi Table mode
	title?: string; // only with multi Table mode
	entitySet: string;
	presentation: DataVisualizationDefinition;
	tableControlId: string;
	chartControlId: string;
};

type ContentAreaID = {
	chartId: string;
	tableId: string;
};

/**
 * Returns the condition path required for the condition model. It looks like follow:
 * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
 *
 * @param entityType the root entity type
 * @param propertyPath the full path to the target property
 * @returns {string} the formatted condition path
 */
const _getConditionPath = function(entityType: EntityType, propertyPath: string): string {
	const parts = propertyPath.split("/");
	let partialPath;
	let key = "";
	while (parts.length) {
		let part = parts.shift() as string;
		partialPath = partialPath ? partialPath + "/" + part : part;
		const property: Property | NavigationProperty = entityType.resolvePath(partialPath);
		if (property._type === "NavigationProperty" && property.isCollection) {
			part += "*";
		}
		key = key ? key + "/" + part : part;
	}
	return key;
};

const _createFilterSelectionField = function(
	entityType: EntityType,
	property: Property,
	fullPropertyPath: string,
	includeHidden: boolean,
	converterContext: ConverterContext
): FilterField | undefined {
	// ignore complex property types and hidden annotated ones
	if (
		property !== undefined &&
		property.targetType === undefined &&
		(includeHidden || property.annotations?.UI?.Hidden?.valueOf() !== true)
	) {
		const targetEntityType = converterContext.getAnnotationEntityType(property);
		return {
			key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
			annotationPath: converterContext.getAbsoluteAnnotationPath(fullPropertyPath),
			conditionPath: _getConditionPath(entityType, fullPropertyPath),
			availability:
				property.annotations?.UI?.HiddenFilter?.valueOf() === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
			label: compileBinding(annotationExpression(property.annotations.Common?.Label?.valueOf() || property.name)),
			group: targetEntityType.name,
			groupLabel: compileBinding(
				annotationExpression(targetEntityType?.annotations?.Common?.Label?.valueOf() || targetEntityType.name)
			)
		};
	}
	return undefined;
};

const _getSelectionFields = function(
	entityType: EntityType,
	navigationPath: string,
	properties: Array<Property> | undefined,
	includeHidden: boolean,
	converterContext: ConverterContext
): Record<string, FilterField> {
	const selectionFieldMap: Record<string, FilterField> = {};
	if (properties) {
		properties.forEach((property: Property) => {
			const propertyPath: string = property.name;
			const fullPath: string = (navigationPath ? navigationPath + "/" : "") + propertyPath;
			const selectionField = _createFilterSelectionField(entityType, property, fullPath, includeHidden, converterContext);
			if (selectionField) {
				selectionFieldMap[fullPath] = selectionField;
			}
		});
	}
	return selectionFieldMap;
};

const _getSelectionFieldsByPath = function(
	entityType: EntityType,
	propertyPaths: Array<string> | undefined,
	includeHidden: boolean,
	converterContext: ConverterContext
): Record<string, FilterField> {
	let selectionFields: Record<string, FilterField> = {};
	if (propertyPaths) {
		propertyPaths.forEach((propertyPath: string) => {
			let localSelectionFields: Record<string, FilterField>;

			const property: Property | NavigationProperty = entityType.resolvePath(propertyPath);
			if (property === undefined) {
				return;
			}
			if (property._type === "NavigationProperty") {
				// handle navigation properties
				localSelectionFields = _getSelectionFields(
					entityType,
					propertyPath,
					property.targetType.entityProperties,
					includeHidden,
					converterContext
				);
			} else if (property.targetType !== undefined) {
				// handle ComplexType properties
				localSelectionFields = _getSelectionFields(
					entityType,
					propertyPath,
					property.targetType.properties,
					includeHidden,
					converterContext
				);
			} else {
				const navigationPath = propertyPath.includes("/")
					? propertyPath
							.split("/")
							.splice(0, 1)
							.join("/")
					: "";
				localSelectionFields = _getSelectionFields(entityType, navigationPath, [property], includeHidden, converterContext);
			}

			selectionFields = {
				...selectionFields,
				...localSelectionFields
			};
		});
	}
	return selectionFields;
};

/**
 * Enter all DataFields of a given FieldGroup into the filterFacetMap.
 *
 * @param {AnnotationTerm<FieldGroupType>} fieldGroup
 * @returns {Record<string, FilterGroup>} filterFacetMap for the given fieldGroup
 */
function getFieldGroupFilterGroups(fieldGroup: AnnotationTerm<FieldGroupType>): Record<string, FilterGroup> {
	const filterFacetMap: Record<string, FilterGroup> = {};
	fieldGroup.Data.forEach((dataField: DataFieldAbstractTypes) => {
		if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
			filterFacetMap[dataField.Value.path] = {
				group: fieldGroup.fullyQualifiedName,
				groupLabel:
					compileBinding(
						annotationExpression(fieldGroup.Label || fieldGroup.annotations?.Common?.Label || fieldGroup.qualifier)
					) || fieldGroup.qualifier
			};
		}
	});
	return filterFacetMap;
}

/**
 * Get all List Report Tables.
 * @param {ListReportViewDefinition[]} views List Report views configured into manifest
 * @returns {TableVisualization[]} List Report Table
 */
function getTableVisualizations(views: ListReportViewDefinition[]): TableVisualization[] {
	const tables: TableVisualization[] = [];
	views.forEach(function(view) {
		view.presentation.visualizations.forEach(function(visualization) {
			if (visualization.type === VisualizationType.Table) {
				tables.push(visualization);
			}
		});
	});
	return tables;
}

/**
 * Is FilterBar search field hidden or not.
 *
 * @param {TableVisualization[]} listReportTables List Report tables
 * @param {ConverterContext} converterContext
 * @returns {boolean} Is FilterBar search field hidden or not
 */
function getFilterBarhideBasicSearch(listReportTables: TableVisualization[], converterContext: ConverterContext): boolean {
	if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
		return true;
	}
	/**
	 * Try to find a non analytical table with the main entity set (page entity set) as collection
	 * if at least one table matches these conditions, basic search field must be displayed
	 */
	return checkAllTableForEntitySetAreAnalytical(listReportTables, (converterContext.getEntitySet() as Required<EntitySet>).name);
}

/**
 * Check that all the tables for a dedicated entityset are configured as analytical table.
 * @param {TableVisualization[]} listReportTables List Report tables
 * @param {string} entitySetName
 * @returns {boolean} Is FilterBar search field hidden or not
 */
function checkAllTableForEntitySetAreAnalytical(listReportTables: TableVisualization[], entitySetName: string) {
	if (listReportTables.length > 0) {
		return listReportTables.every(visualization => {
			return visualization.enableAnalytics && "/" + entitySetName === visualization.annotation.collection;
		});
	}
	return false;
}

/**
 * Retrieve the configuration for the selection fields that will be used within the filter bar
 * This configuration takes into account annotation and the selection variants.
 *
 * @param {ConverterContext} converterContext
 * @param {TableVisualization[]} lrTables
 * @returns {FilterSelectionField[]} an array of selection fields
 */

export const getSelectionFields = function(converterContext: ConverterContext, lrTables: TableVisualization[] = []): FilterField[] {
	const selectionVariantPaths: string[] = [];
	// Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)
	const selectionVariants: SelectionVariantConfiguration[] = lrTables
		.map(visualization => {
			const tableFilters = visualization.control.filters;
			const tableSVConfigs: SelectionVariantConfiguration[] = [];
			for (const key in tableFilters) {
				if (Array.isArray(tableFilters[key].paths)) {
					const paths = tableFilters[key].paths;
					paths.forEach(path => {
						if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
							selectionVariantPaths.push(path.annotationPath);
							const selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);
							if (selectionVariantConfig) {
								tableSVConfigs.push(selectionVariantConfig);
							}
						}
					});
				}
			}
			return tableSVConfigs;
		})
		.reduce((svConfigs, selectionVariant) => svConfigs.concat(selectionVariant), []);

	// create a map of properties to be used in selection variants
	const excludedFilterProperties: Record<string, boolean> = selectionVariants.reduce(
		(previousValue: Record<string, boolean>, selectionVariant) => {
			selectionVariant.propertyNames.forEach(propertyName => {
				previousValue[propertyName] = true;
			});
			return previousValue;
		},
		{}
	);
	const entityType = converterContext.getEntityType();
	const filterFacets = converterContext.getAnnotationEntityType().annotations.UI?.FilterFacets;
	let filterFacetMap: Record<string, FilterGroup> = {};

	const aFieldGroups = converterContext.getAnnotationsByTerm("UI", UIAnnotationTerms.FieldGroup) || [];

	if (filterFacets === undefined || filterFacets.length < 0) {
		for (const i in aFieldGroups) {
			filterFacetMap = {
				...filterFacetMap,
				...getFieldGroupFilterGroups(aFieldGroups[i] as AnnotationTerm<FieldGroupType>)
			};
		}
	} else {
		filterFacetMap = filterFacets.reduce((previousValue: Record<string, FilterGroup>, filterFacet: ReferenceFacetTypes) => {
			for (let i = 0; i < filterFacet.Target.$target.Data.length; i++) {
				previousValue[filterFacet.Target.$target.Data[i].Value.path] = {
					group: filterFacet?.ID?.toString(),
					groupLabel: filterFacet?.Label?.toString()
				};
			}
			return previousValue;
		}, {});
	}

	let aSelectOptions: any[] = [];
	const selectionVariant = getSelectionVariant(entityType, converterContext);
	if (selectionVariant) {
		aSelectOptions = selectionVariant.SelectOptions;
	}

	// create a map of all potential filter fields based on...
	const filterFields: Record<string, FilterField> = {
		// ...non hidden properties of the entity
		..._getSelectionFields(entityType, "", entityType.entityProperties, false, converterContext),
		// ...additional manifest defined navigation properties
		..._getSelectionFieldsByPath(
			entityType,
			converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties,
			false,
			converterContext
		)
	};

	//Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields
	const defaultFilters = _getDefaultFilterFields(filterFields, aSelectOptions, entityType, converterContext, excludedFilterProperties);

	// finally create final list of filter fields by adding the SelectionFields first (order matters)...
	let allFilters = (
		entityType.annotations?.UI?.SelectionFields?.reduce((selectionFields: FilterField[], selectionField) => {
			const propertyPath = selectionField.value;
			if (!(propertyPath in excludedFilterProperties)) {
				const filterField: FilterField | undefined = _getFilterField(filterFields, propertyPath, converterContext, entityType);
				if (filterField) {
					filterField.group = "";
					filterField.groupLabel = "";
					selectionFields.push(filterField);
				}
			}
			return selectionFields;
		}, []) || []
	)
		// To add the FilterField which is not part of the Selection Fields but the property is mentioned in the Selection Variant
		.concat(defaultFilters || [])
		// ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
		.concat(
			Object.keys(filterFields)
				.filter(propertyPath => !(propertyPath in excludedFilterProperties))
				.map(propertyPath => {
					return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
				})
		);

	//if all tables are analytical tables "aggregatable" properties must be excluded
	if (checkAllTableForEntitySetAreAnalytical(lrTables, (converterContext.getEntitySet() as Required<EntitySet>).name)) {
		/**
		 * Currently all agregates are root entity properties (no properties coming from navigation) and all
		 * tables with same entitySet gets same aggreagte configuration that's why we can use frist table into
		 * LR to get aggregates (without currency/unit properties since we expect to be able to filter them)
		 */
		const aggregates = lrTables[0].aggregates;
		if (aggregates) {
			const aggregatableProperties: string[] = Object.keys(aggregates).map(aggregateKey => aggregates[aggregateKey].relativePath);
			allFilters = allFilters.filter(filterField => {
				return aggregatableProperties.indexOf(filterField.key) === -1;
			});
		}
	}

	return allFilters;
};

const _getDefaultFilterFields = function(
	filterFields: Record<string, FilterField>,
	aSelectOptions: any[],
	entityType: EntityType,
	converterContext: ConverterContext,
	excludedFilterProperties: Record<string, boolean>
): FilterField[] {
	const selectionFields: FilterField[] = [];
	const UISelectionFields: any = {};
	const properties = entityType.entityProperties;
	// Using entityType instead of entitySet
	entityType.annotations?.UI?.SelectionFields?.forEach(SelectionField => {
		UISelectionFields[SelectionField.value] = true;
	});
	if (aSelectOptions && aSelectOptions.length > 0) {
		aSelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const sPropertyPath: string = propertyName.value;
			const UISelectionFields: any = {};
			entityType.annotations?.UI?.SelectionFields?.forEach(SelectionField => {
				UISelectionFields[SelectionField.value] = true;
			});
			if (!(sPropertyPath in excludedFilterProperties)) {
				if (!(sPropertyPath in UISelectionFields)) {
					const FilterField: FilterField | undefined = _getFilterField(filterFields, sPropertyPath, converterContext, entityType);
					if (FilterField) {
						selectionFields.push(FilterField);
					}
				}
			}
		});
	} else if (properties) {
		properties.forEach((property: Property) => {
			const defaultFilterValue = property.annotations?.Common?.FilterDefaultValue;
			const PropertyPath = property.name;
			if (!(PropertyPath in excludedFilterProperties)) {
				if (defaultFilterValue && !(PropertyPath in UISelectionFields)) {
					const FilterField: FilterField | undefined = _getFilterField(filterFields, PropertyPath, converterContext, entityType);
					if (FilterField) {
						selectionFields.push(FilterField);
					}
				}
			}
		});
	}
	return selectionFields;
};

const _getFilterField = function(
	filterFields: Record<string, FilterField>,
	propertyPath: string,
	converterContext: ConverterContext,
	entityType: EntityType
): FilterField | undefined {
	let filterField: FilterField | undefined = filterFields[propertyPath];
	if (filterField) {
		delete filterFields[propertyPath];
	} else {
		filterField = _createFilterSelectionField(entityType, entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
	}
	if (!filterField) {
		converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
	}
	// defined SelectionFields are available by default
	if (filterField) {
		filterField.availability = AvailabilityType.Default;
	}
	return filterField;
};

/**
 * Retrieves filter fields from the manifest.
 *
 * @param entityType the current entityType
 * @param converterContext the converter context
 * @returns {Record<string, CustomElementFilterField>} the manifest defined filter fields
 */
const getManifestFilterFields = function(
	entityType: EntityType,
	converterContext: ConverterContext
): Record<string, CustomElementFilterField> {
	const fbConfig: FilterManifestConfiguration = converterContext.getManifestWrapper().getFilterConfiguration();
	const definedFilterFields: Record<string, FilterFieldManifestConfiguration> = fbConfig?.filterFields || {};
	const selectionFields: Record<string, FilterField> = _getSelectionFieldsByPath(
		entityType,
		Object.keys(definedFilterFields).map(key => KeyHelper.getPathFromSelectionFieldKey(key)),
		true,
		converterContext
	);
	const filterFields: Record<string, CustomElementFilterField> = {};

	for (const sKey in definedFilterFields) {
		const filterField = definedFilterFields[sKey];
		const propertyName = KeyHelper.getPathFromSelectionFieldKey(sKey);
		const selectionField = selectionFields[propertyName];
		filterFields[sKey] = {
			key: sKey,
			annotationPath: selectionField?.annotationPath,
			conditionPath: selectionField?.conditionPath || propertyName,
			template: filterField.template,
			label: filterField.label,
			position: filterField.position || { placement: Placement.After },
			availability: filterField.availability || AvailabilityType.Default,
			settings: filterField.settings
		};
	}
	return filterFields;
};

/**
 * Find a visualization annotation that can be used for rendering the list report.
 *
 * @param {EntityType} entityType the current entityType
 * @param converterContext
 * @param bIsALP
 * @returns {LineItem | PresentationVariantTypeTypes | undefined} one compliant annotation for rendering the list report
 */
function getCompliantVisualizationAnnotation(
	entityType: EntityType,
	converterContext: ConverterContext,
	bIsALP: Boolean
): LineItem | PresentationVariantTypeTypes | SelectionPresentationVariantTypeTypes | undefined {
	const annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
	const selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);
	if (annotationPath && selectionPresentationVariant) {
		const presentationVariant = selectionPresentationVariant.PresentationVariant;
		if (!presentationVariant) {
			throw new Error("Presentation Variant is not configured in the SPV mentioned in the manifest");
		}
		const bPVComplaint = isPresentationCompliant(selectionPresentationVariant.PresentationVariant);
		if (!bPVComplaint) {
			return undefined;
		}
		if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
			return selectionPresentationVariant;
		}
	}
	if (selectionPresentationVariant) {
		if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
			return selectionPresentationVariant;
		}
	}
	const presentationVariant = getDefaultPresentationVariant(entityType);
	if (presentationVariant) {
		if (isPresentationCompliant(presentationVariant, bIsALP)) {
			return presentationVariant;
		}
	}
	if (!bIsALP) {
		const defaultLineItem = getDefaultLineItem(entityType);
		if (defaultLineItem) {
			return defaultLineItem;
		}
	}
	return undefined;
}

const getView = function(viewConverterConfiguration: ViewConverterSettings): ListReportViewDefinition {
	const config = viewConverterConfiguration;
	let converterContext = config.converterContext;
	const presentation: DataVisualizationDefinition = getDataVisualizationConfiguration(
		config.annotation
			? converterContext.getRelativeAnnotationPath(config.annotation.fullyQualifiedName, converterContext.getEntityType())
			: "",
		true,
		converterContext
	);
	let tableControlId = "";
	let chartControlId = "";
	let title: string | undefined = "";
	let selectionVariantPath = "";
	const isMultipleViewConfiguration = function(config: ViewConfiguration): config is MultipleViewConfiguration {
		return (config as MultipleViewConfiguration).key !== undefined;
	};

	if (isMultipleViewConfiguration(config)) {
		// key exists only on multi tables mode
		const resolvedTarget = converterContext.getEntityTypeAnnotation(config.annotationPath);
		const viewAnnotation: ViewAnnotationsTypeTypes = resolvedTarget.annotation as ViewAnnotationsTypeTypes;
		converterContext = resolvedTarget.converterContext;
		title = compileBinding(annotationExpression(viewAnnotation.Text));
		/**
		 * Need to loop on views and more precisely to table into views since
		 * multi table mode get specific configuration (hidden filters or Table Id)
		 */
		presentation.visualizations.forEach((visualizationDefinition, index) => {
			switch (visualizationDefinition.type) {
				case VisualizationType.Table:
					const tableVisualization = presentation.visualizations[index] as TableVisualization;
					const filters = tableVisualization.control.filters || {};
					filters.hiddenFilters = filters.hiddenFilters || { paths: [] };
					if (!config.keepPreviousPresonalization) {
						// Need to override Table Id to match with Tab Key (currently only table is managed in multiple view mode)
						tableVisualization.annotation.id = TableID(config.key, "LineItem");
					}

					if (config && config.annotation && config.annotation.term === UIAnnotationTerms.SelectionPresentationVariant) {
						selectionVariantPath = (config.annotation as SelectionPresentationVariantTypeTypes).SelectionVariant.fullyQualifiedName.split(
							"@"
						)[1];
					} else {
						selectionVariantPath = config.annotationPath;
					}
					/**
					 * Provide Selection Variant to hiddenFilters in order to set the SV filters to the table
					 * MDC Table override binding Filter and from SAP FE the only method where we are able to add
					 * additional filter is 'rebindTable' into Table delegate
					 * In order to avoid implementing specific LR feature to SAP FE Macro Table, the filter(s) related
					 * to the Tab (multi table mode) can be passed to macro table via parameter/context named filters
					 * and key hiddenFilters
					 */
					filters.hiddenFilters.paths.push({ annotationPath: selectionVariantPath });
					tableVisualization.control.filters = filters;
					break;
				case VisualizationType.Chart:
					// Not currently managed
					break;
				default:
					break;
			}
		});
	}

	presentation.visualizations.forEach(visualizationDefinition => {
		if (visualizationDefinition.type === VisualizationType.Table) {
			tableControlId = visualizationDefinition.annotation.id;
		} else if (visualizationDefinition.type === VisualizationType.Chart) {
			chartControlId = visualizationDefinition.id;
		}
	});
	return {
		presentation,
		tableControlId,
		chartControlId,
		entitySet: "/" + viewConverterConfiguration.entitySet.name,
		title,
		selectionVariantPath
	};
};

const getViews = function(
	entitySet: EntitySet,
	converterContext: ConverterContext,
	settingsViews: MultipleViewsConfiguration | undefined
): ListReportViewDefinition[] {
	let viewConverterConfigs: ViewConverterSettings[] = [];
	if (settingsViews) {
		settingsViews.paths.forEach(path => {
			const viewEntitySet = converterContext.findEntitySet(path.entitySet);
			const annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
			let annotation;
			if (viewEntitySet) {
				const viewConverterContext = converterContext.getConverterContextFor(viewEntitySet);
				const resolvedTarget = viewConverterContext.getEntityTypeAnnotation(path.annotationPath);
				const targetAnnotation = resolvedTarget.annotation as DataVisualizationAnnotations;
				converterContext = resolvedTarget.converterContext;
				if (targetAnnotation) {
					if (targetAnnotation.term === UIAnnotationTerms.SelectionVariant) {
						if (annotationPath) {
							annotation = getSelectionPresentationVariant(viewEntitySet.entityType, annotationPath, converterContext);
						} else {
							annotation = getDefaultLineItem(viewEntitySet.entityType) as LineItem;
						}
					} else {
						annotation = targetAnnotation;
					}
					viewConverterConfigs.push({
						converterContext: viewConverterContext,
						entitySet: viewEntitySet,
						annotation,
						annotationPath: path.annotationPath,
						keepPreviousPresonalization: path.keepPreviousPresonalization,
						key: path.key
					});
				}
			} else {
				// TODO Diagnostics message
			}
		});
	} else {
		const entityType = converterContext.getEntityType();
		if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
			viewConverterConfigs = getAlpViewConfig(entitySet, converterContext, viewConverterConfigs);
		} else {
			viewConverterConfigs.push({
				annotation: getCompliantVisualizationAnnotation(entityType, converterContext, false),
				entitySet,
				converterContext: converterContext
			});
		}
	}
	return viewConverterConfigs.map(viewConverterConfig => {
		return getView(viewConverterConfig);
	});
};
function getAlpViewConfig(
	entitySet: EntitySet,
	converterContext: ConverterContext,
	viewConfigs: ViewConverterSettings[]
): ViewConverterSettings[] {
	const annotation = getCompliantVisualizationAnnotation(entitySet.entityType, converterContext, true);
	let chart, table;
	if (annotation) {
		viewConfigs.push({
			entitySet,
			annotation: annotation,
			converterContext
		});
	} else {
		chart = getDefaultChart(entitySet.entityType);
		table = getDefaultLineItem(entitySet.entityType);
		if (chart) {
			viewConfigs.push({
				entitySet,
				annotation: chart,
				converterContext
			});
		}
		if (table) {
			viewConfigs.push({
				entitySet,
				annotation: table,
				converterContext
			});
		}
	}
	return viewConfigs;
}

/**
 * Create the ListReportDefinition for the multi entitySets (multi table instances).
 *
 * @param converterContext
 * @returns {ListReportDefinition} the list report definition based on annotation + manifest
 */
export const convertPage = function(converterContext: ConverterContext): ListReportDefinition {
	const templateType = converterContext.getTemplateType();
	const entitySet = converterContext.getEntitySet();
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const entityType = converterContext.getEntityType();
	const sBaseContextPath = getTargetObjectPath(dataModelObjectPath);

	if (!entitySet) {
		// If we don't have an entitySet at this point we have an issue I'd say
		throw new Error(
			"An EntitySet is required to be able to display a ListReport, please adjust your `entitySet` property to point to one."
		);
	}
	const manifestWrapper = converterContext.getManifestWrapper();
	const viewsDefinition: MultipleViewsConfiguration | undefined = manifestWrapper.getViewConfiguration();
	const hasMultipleEntitySets = manifestWrapper.hasMultipleEntitySets();
	const views: ListReportViewDefinition[] = getViews(entitySet, converterContext, viewsDefinition);
	const showTabCounts = viewsDefinition ? viewsDefinition?.showCounts || hasMultipleEntitySets : undefined; // with multi EntitySets, tab counts are displayed by default
	const lrTableVisualizations = getTableVisualizations(views);
	let singleTableId = "";
	let singleChartId = "";
	const filterBarId = FilterBarID(entitySet.name);
	const filterVariantManagementID = FilterVariantManagementID(filterBarId);
	const targetControlIds = [filterBarId].concat(
		lrTableVisualizations.map(visualization => {
			return visualization.annotation.id;
		})
	);
	const fbConfig = manifestWrapper.getFilterConfiguration();
	const useSemanticDateRange = fbConfig.useSemanticDateRange !== undefined ? fbConfig.useSemanticDateRange : true;

	const oConfig = getContentAreaId(templateType, views);
	if (oConfig) {
		singleChartId = oConfig.chartId;
		singleTableId = oConfig.tableId;
	}
	const annotationSelectionFields = getSelectionFields(converterContext, lrTableVisualizations);
	const selectionFields = insertCustomElements(annotationSelectionFields, getManifestFilterFields(entityType, converterContext), {
		"availability": "overwrite",
		label: "overwrite",
		position: "overwrite",
		template: "overwrite",
		settings: "overwrite"
	});
	const hideBasicSearch = getFilterBarhideBasicSearch(lrTableVisualizations, converterContext);
	const selectionVariant = getSelectionVariant(entityType, converterContext);

	// Sort header actions according to position attributes in manifest
	const headerActions = insertCustomElements([], getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext));
	const isAlp: boolean = converterContext.getTemplateType() === TemplateType.AnalyticalListPage;

	return {
		mainEntitySet: "/" + entitySet.name,
		mainEntityType: sBaseContextPath + "/",
		singleTableId,
		singleChartId,
		showTabCounts,
		headerActions,
		filterBar: {
			selectionFields,
			hideBasicSearch
		},
		views: views,
		filterBarId,
		filterConditions: {
			selectionVariant: selectionVariant
		},
		variantManagement: {
			id: filterVariantManagementID,
			targetControlIds: targetControlIds.join(",")
		},
		isMultiEntitySets: hasMultipleEntitySets,
		isAlp: isAlp,
		useSemanticDateRange
	};
};

function getContentAreaId(templateType: TemplateType, views: ListReportViewDefinition[]): ContentAreaID | undefined {
	let singleTableId = "",
		singleChartId = "";
	if (views.length === 1) {
		singleTableId = views[0].tableControlId;
		singleChartId = views[0].chartControlId;
	} else if (templateType === TemplateType.AnalyticalListPage && views.length === 2) {
		views.map(oView => {
			if (oView.chartControlId) {
				singleChartId = oView.chartControlId;
			} else if (oView.tableControlId) {
				singleTableId = oView.tableControlId;
			}
		});
	}
	if (singleTableId || singleChartId) {
		return {
			chartId: singleChartId,
			tableId: singleTableId
		};
	}
	return undefined;
}
