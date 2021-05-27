import {
	CriticalityType,
	DataField,
	DataFieldAbstractTypes,
	DataFieldForAnnotation,
	DataFieldForAction,
	DataFieldForIntentBasedNavigation,
	EnumValue,
	LineItem,
	PathAnnotationExpression,
	PresentationVariantTypeTypes,
	PropertyAnnotationValue,
	PropertyPath,
	SelectionVariantType,
	SelectOptionType,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import {
	ActionType,
	AvailabilityType,
	CreationMode,
	FormatOptionsType,
	HorizontalAlign,
	ManifestTableColumn,
	ManifestWrapper,
	NavigationSettingsConfiguration,
	NavigationTargetConfiguration,
	SelectionMode,
	TableColumnSettings,
	TableManifestConfiguration,
	VariantManagementType,
	VisualizationType
} from "../../ManifestSettings";
import { EntitySet, EntityType, Property } from "@sap-ux/annotation-converter";
import { ConverterContext, TemplateType } from "../../templates/BaseConverter";
import { TableID } from "../../helpers/ID";
import {
	AnnotationAction,
	BaseAction,
	CustomAction,
	getActionsFromManifest,
	isActionNavigable,
	removeDuplicateActions
} from "sap/fe/core/converters/controls/Common/Action";
import { ConfigurableObject, CustomElement, insertCustomElements, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	collectRelatedPropertiesRecursively,
	ComplexPropertyInfo,
	isDataFieldAlwaysHidden,
	isDataFieldForActionAbstract,
	isDataFieldTypes,
	getSemanticObjectPath,
	collectRelatedProperties,
	CollectedProperties
} from "sap/fe/core/converters/annotations/DataField";
import {
	and,
	annotationExpression,
	BindingExpression,
	bindingExpression,
	compileBinding,
	constant,
	equal,
	Expression,
	ExpressionOrPrimitive,
	formatResult,
	ifElse,
	isConstant,
	not,
	or,
	resolveBindingString
} from "sap/fe/core/helpers/BindingExpression";
import { Draft, UI } from "sap/fe/core/converters/helpers/BindingHelper";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import tableFormatters from "sap/fe/core/formatters/TableFormatter";
import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";
import {
	DataModelObjectPath,
	getTargetObjectPath,
	isPathDeletable,
	isPathInsertable,
	isPathUpdatable
} from "sap/fe/core/templating/DataModelPathHelper";
import { replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import { IssueCategory, IssueSeverity, IssueType } from "sap/fe/core/converters/helpers/IssueManager";
import * as Edm from "@sap-ux/vocabularies-types/dist/Edm";
import { isProperty, getAssociatedUnitProperty, getAssociatedCurrencyProperty } from "sap/fe/core/templating/PropertyHelper";

import { AggregationHelper } from "../../helpers/Aggregation";

export type TableAnnotationConfiguration = {
	autoBindOnInit: boolean;
	collection: string;
	enableControlVM?: boolean;
	filterId?: string;
	id: string;
	isEntitySet: boolean;
	navigationPath: string;
	p13nMode?: string;
	row?: {
		action?: string;
		press?: string;
		rowHighlighting: BindingExpression<MessageType>;
		rowNavigated: BindingExpression<boolean>;
	};
	selectionMode: string | undefined;
	show?: {
		create?: string | boolean;
		delete?: string | boolean;
		paste?: BindingExpression<boolean>;
	};
	displayMode?: boolean;
	threshold: number;
	entityName: string;
	sortConditions?: string;
	groupConditions?: string;
	aggregateConditions?: string;

	/** Create new entries */
	create: CreateBehaviour | CreateBehaviourExternal;
	parentEntityDeleteEnabled?: BindingExpression<boolean>;
	title: string;
};

/**
 * New entries are created within the app (default case)
 */
type CreateBehaviour = {
	mode: CreationMode;
	append: Boolean;
	newAction?: string;
	navigateToTarget?: string;
};

/**
 * New entries are created by navigating to some target
 */
type CreateBehaviourExternal = {
	mode: "External";
	outbound: string;
	outboundDetail: NavigationTargetConfiguration["outboundDetail"];
	navigationSettings: NavigationSettingsConfiguration;
};

export type TableCapabilityRestriction = {
	isDeletable: boolean;
	isUpdatable: boolean;
};

export type TableFiltersConfiguration = {
	enabled?: string | boolean;
	paths: [
		{
			annotationPath: string;
		}
	];
	showCounts?: boolean;
};

export type SelectionVariantConfiguration = {
	propertyNames: string[];
	text?: string;
};

export type TableControlConfiguration = {
	createAtEnd: boolean;
	creationMode: CreationMode;
	disableAddRowButtonForEmptyData: boolean;
	useCondensedTableLayout: boolean;
	enableExport: boolean;
	headerVisible: boolean;
	filters?: Record<string, TableFiltersConfiguration>;
	type: TableType;
	selectAll?: boolean;
	selectionLimit: number;
	enablePaste: boolean;
	enableFullScreen: boolean;
};

export type TableType = "GridTable" | "ResponsiveTable" | "AnalyticalTable";

enum ColumnType {
	Default = "Default", // Default Type
	Annotation = "Annotation"
}

export type BaseTableColumn = ConfigurableObject & {
	id: string;
	width?: string;
	name: string;
	availability?: AvailabilityType;
	type: ColumnType; //Origin of the source where we are getting the templated information from,
	isNavigable?: boolean;
	settings?: TableColumnSettings;
	semanticObjectPath?: string;
	propertyInfos?: string[];
	sortable: boolean;
	horizontalAlign?: HorizontalAlign;
	formatOptions: FormatOptionsType;
};

export type CustomTableColumn = BaseTableColumn & {
	header?: string;
	template: string;
};

export type AnnotationTableColumn = BaseTableColumn & {
	annotationPath: string;
	relativePath: string;
	label?: string;
	groupLabel?: string;
	group?: string;
	isGroupable?: boolean;
	isKey?: boolean;
	unit?: string;
	exportSettings?: {
		template?: string;
		labels?: string[];
	};
};

type TableColumn = CustomTableColumn | AnnotationTableColumn;

export type CustomColumn = CustomElement<TableColumn>;

export type AggregateData = {
	defaultAggregate: {
		contextDefiningProperties?: string[];
	};
	relativePath: string;
};

export type TableVisualization = {
	type: VisualizationType.Table;
	annotation: TableAnnotationConfiguration;
	control: TableControlConfiguration;
	columns: TableColumn[];
	actions: BaseAction[];
	aggregates?: Record<string, AggregateData>;
	enableAnalytics?: boolean;
};

type SorterType = {
	name: string;
	descending: boolean;
};

/**
 * Returns an array of all annotation based and manifest based table actions.
 *
 * @param {LineItem} lineItemAnnotation
 * @param {string} visualizationPath
 * @param {ConverterContext} converterContext
 * @param {NavigationSettingsConfiguration} navigationSettings
 * @returns {BaseAction} the complete table actions
 */
export function getTableActions(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): BaseAction[] {
	const aTableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
	const aAnnotationActions = aTableActions.tableActions;
	const aHiddenActions = aTableActions.hiddenTableActions;
	return insertCustomElements(
		aAnnotationActions,
		getActionsFromManifest(
			converterContext.getManifestControlConfiguration(visualizationPath).actions,
			converterContext,
			aAnnotationActions,
			navigationSettings,
			true,
			aHiddenActions
		),
		{ isNavigable: "overwrite", enableOnSelect: "overwrite", enableAutoScroll: "overwrite", enabled: "overwrite" }
	);
}

/**
 * Returns an array off all columns, annotation based as well as manifest based.
 * They are sorted and some properties of can be overwritten through the manifest (check out the overwrite-able Keys).
 *
 * @param {LineItem} lineItemAnnotation Collection of data fields for representation in a table or list
 * @param {string} visualizationPath
 * @param {ConverterContext} converterContext
 * @param {NavigationSettingsConfiguration} navigationSettings
 * @returns {TableColumn[]} Returns all table columns that should be available, regardless of templating or personalization or their origin
 */
export function getTableColumns(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings?: NavigationSettingsConfiguration
): TableColumn[] {
	const annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
	const manifestColumns = getColumnsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).columns,
		annotationColumns as AnnotationTableColumn[],
		converterContext,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		navigationSettings
	);

	return insertCustomElements(annotationColumns, manifestColumns, {
		width: "overwrite",
		isNavigable: "overwrite",
		availability: "overwrite",
		settings: "overwrite",
		horizontalAlign: "overwrite",
		formatOptions: "overwrite"
	});
}

/**
 * Retrieve the custom aggregation definitions from the entityType.
 *
 * @param entityType The target entity type.
 * @param tableColumns The array of columns for the entity type.
 * @param converterContext The converter context.
 * @returns the aggregate definitions from the entityType, or udefined if the entity doesn't support anaytical queries
 */
export const getAggregateDefinitionsFromEntityType = function(
	entityType: EntityType,
	tableColumns: TableColumn[],
	converterContext: ConverterContext
): Record<string, AggregateData> | undefined {
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	function findColumnFromPath(path: string): TableColumn | undefined {
		return tableColumns.find(column => {
			const annotationColumn = column as AnnotationTableColumn;
			return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
		});
	}

	if (!aggregationHelper.isAnalyticsSupported()) {
		return undefined;
	}

	// Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
	// They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint
	const mCurrencyOrUnitProperties = new Set();
	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.unit) {
			mCurrencyOrUnitProperties.add(oTableColumn.unit);
		}
	});

	const mRawDefinitions = aggregationHelper.getCustomAggregateDefinitions();
	const mResult: Record<string, AggregateData> = {};

	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
			const aRawContextDefiningProperties = mRawDefinitions[oTableColumn.relativePath];

			// Ignore aggregates corresponding to currencies or units pf measure
			if (aRawContextDefiningProperties && !mCurrencyOrUnitProperties.has(oTableColumn.name)) {
				mResult[oTableColumn.name] = {
					defaultAggregate: {},
					relativePath: oTableColumn.relativePath
				};
				const aContextDefiningProperties: string[] = [];
				aRawContextDefiningProperties.forEach(contextDefiningPropertyName => {
					const oColumn = findColumnFromPath(contextDefiningPropertyName);
					if (oColumn) {
						aContextDefiningProperties.push(oColumn.name);
					}
				});

				if (aContextDefiningProperties.length) {
					mResult[oTableColumn.name].defaultAggregate.contextDefiningProperties = aContextDefiningProperties;
				}
			}
		}
	});

	return mResult;
};

/**
 * Updates a table visualization for analytical use cases.
 *
 * @param tableVisualization the visualization to be updated
 * @param entityType the entity type displayed in the table
 * @param converterContext the converter context
 * @param presentationVariantAnnotation the presentationVariant annotation (if any)
 */
function updateTableVisualizationForAnalytics(
	tableVisualization: TableVisualization,
	entityType: EntityType,
	converterContext: ConverterContext,
	presentationVariantAnnotation?: PresentationVariantTypeTypes
) {
	if (tableVisualization.control.type === "AnalyticalTable") {
		const aggregatesDefinitions = getAggregateDefinitionsFromEntityType(entityType, tableVisualization.columns, converterContext);

		if (aggregatesDefinitions) {
			tableVisualization.enableAnalytics = true;
			tableVisualization.aggregates = aggregatesDefinitions;

			// Add group and sort conditions from the presentation variant
			tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns);
			tableVisualization.annotation.aggregateConditions = getAggregateConditions(
				presentationVariantAnnotation,
				tableVisualization.columns
			);
		}

		tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
	}
}

/**
 * Sets the 'unit' property in columns when necessary.
 *
 * @param entityType the entity type displayed in the table
 * @param tableColumns the columns to be updated
 */
function updateUnitProperties(entityType: EntityType, tableColumns: TableColumn[]) {
	tableColumns.forEach(oColumn => {
		const oTableColumn = oColumn as AnnotationTableColumn;
		if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
			const oProperty = entityType.entityProperties.find(oProp => oProp.name === oTableColumn.relativePath);
			if (oProperty) {
				const sUnit = getAssociatedCurrencyProperty(oProperty)?.name || getAssociatedUnitProperty(oProperty)?.name;
				if (sUnit) {
					const oUnitColumn = tableColumns.find(column => {
						const annotationColumn = column as AnnotationTableColumn;
						return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === sUnit;
					});

					oTableColumn.unit = oUnitColumn?.name;
				}
			}
		}
	});
}

export function createTableVisualization(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext,
	presentationVariantAnnotation?: PresentationVariantTypeTypes,
	isCondensedTableLayoutCompliant?: boolean
): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(
		lineItemAnnotation,
		visualizationPath,
		converterContext,
		isCondensedTableLayoutCompliant
	);
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const dataModelPath = converterContext.getDataModelObjectPath();
	const entityName: string = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name,
		isEntitySet: boolean = navigationPropertyPath.length === 0;
	const navigationOrCollectionName = isEntitySet ? entityName : navigationPropertyPath;
	const navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationOrCollectionName);
	const columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);

	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			tableManifestConfig,
			columns,
			presentationVariantAnnotation
		),
		control: tableManifestConfig,
		actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
		columns: columns
	};

	updateUnitProperties(converterContext.getAnnotationEntityType(lineItemAnnotation), columns);
	updateTableVisualizationForAnalytics(
		oVisualization,
		converterContext.getAnnotationEntityType(lineItemAnnotation),
		converterContext,
		presentationVariantAnnotation
	);

	return oVisualization;
}

export function createDefaultTableVisualization(converterContext: ConverterContext): TableVisualization {
	const tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
	const columns = getColumnsFromEntityType({}, converterContext.getEntityType(), [], [], converterContext);
	const oVisualization: TableVisualization = {
		type: VisualizationType.Table,
		annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
		control: tableManifestConfig,
		actions: [],
		columns: columns
	};

	updateUnitProperties(converterContext.getEntityType(), columns);
	updateTableVisualizationForAnalytics(oVisualization, converterContext.getEntityType(), converterContext);

	return oVisualization;
}

/**
 * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and return all the
 * Hidden UI annotation expressions.
 *
 * @param lineItemAnnotation Collection of data fields for representation in a table or list
 * @param contextDataModelObjectPath DataModelObjectPath
 * @param isEntitySet true or false
 * @returns {Expression<boolean>[]} All the UI Hidden path expressions found in the relevant actions
 */
function getUIHiddenExpForActionsRequiringContext(
	lineItemAnnotation: LineItem,
	contextDataModelObjectPath: DataModelObjectPath,
	isEntitySet: boolean
): Expression<boolean>[] {
	const aUiHiddenPathExpressions: Expression<boolean>[] = [];
	lineItemAnnotation.forEach(dataField => {
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction && dataField?.ActionTarget?.isBound) ||
			(dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation &&
				dataField.RequiresContext &&
				dataField?.Inline?.valueOf() !== true)
		) {
			if (typeof dataField.annotations?.UI?.Hidden?.valueOf() === "object") {
				aUiHiddenPathExpressions.push(
					equal(
						getBindingExpFromContext(
							dataField as DataFieldForAction | DataFieldForIntentBasedNavigation,
							contextDataModelObjectPath,
							isEntitySet
						),
						false
					)
				);
			}
		}
	});
	return aUiHiddenPathExpressions;
}

/**
 * This method is used to change the context currently referenced by this binding by removing the last navigation property.
 *
 * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
 * into a binding on the previous context /MainObject/NavProp1.
 *
 * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
 * @param contextDataModelObjectPath DataModelObjectPath
 * @param isEntitySet true or false
 * @returns the binding expression
 */
function getBindingExpFromContext(
	source: DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction,
	contextDataModelObjectPath: DataModelObjectPath,
	isEntitySet: boolean
): Expression<any> {
	let sExpression: any | undefined;
	if (
		(source as DataFieldForAction)?.$Type === UIAnnotationTypes.DataFieldForAction ||
		(source as DataFieldForIntentBasedNavigation)?.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation
	) {
		sExpression = (source as DataFieldForAction | DataFieldForIntentBasedNavigation)?.annotations?.UI?.Hidden;
	} else {
		sExpression = (source as CustomAction)?.visible;
	}
	let sPath: string;
	if (sExpression?.path) {
		sPath = sExpression.path;
	} else {
		sPath = sExpression;
	}
	if (sPath) {
		if ((source as CustomAction)?.visible) {
			sPath = sPath.substring(1, sPath.length - 1);
		}
		if (sPath.indexOf("/") > 0) {
			//check if the navigation property is correct:
			const aSplitPath = sPath.split("/");
			const sNavigationPath = aSplitPath[0];
			if (
				contextDataModelObjectPath?.targetObject?._type === "NavigationProperty" &&
				contextDataModelObjectPath.targetObject.partner === sNavigationPath
			) {
				return bindingExpression(aSplitPath.slice(1).join("/"));
			} else {
				return constant(true);
			}
			// In case there is no navigation property, if it's an entitySet, the expression binding has to be returned:
		} else if (isEntitySet) {
			return bindingExpression(sPath);
			// otherwise the expression binding cannot be taken into account for the selection mode evaluation:
		} else {
			return constant(true);
		}
	}
	return constant(true);
}

/**
 * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and check
 * if at least one of them is always visible in the table toolbar (and requires a context).
 *
 * @param lineItemAnnotation Collection of data fields for representation in a table or list
 * @returns {boolean} true if there is at least 1 actions that meets the criteria
 */
function hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation: LineItem): boolean {
	return lineItemAnnotation.some(dataField => {
		if (
			(dataField.$Type === UIAnnotationTypes.DataFieldForAction ||
				dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) &&
			dataField?.Inline?.valueOf() !== true &&
			(dataField.annotations?.UI?.Hidden?.valueOf() === false || dataField.annotations?.UI?.Hidden?.valueOf() === undefined)
		) {
			if (dataField.$Type === UIAnnotationTypes.DataFieldForAction) {
				return dataField?.ActionTarget?.isBound;
			} else if (dataField.$Type === UIAnnotationTypes.DataFieldForIntentBasedNavigation) {
				return dataField.RequiresContext;
			}
		}
		return false;
	});
}

function hasCustomActionsAlwaysVisibleInToolBar(manifestActions: Record<string, CustomAction>): boolean {
	return Object.keys(manifestActions).some(actionKey => {
		const action = manifestActions[actionKey];
		if (action.requiresSelection && action.visible?.toString() === "true") {
			return true;
		}
		return false;
	});
}

/**
 * Loop through the Custom Actions (with key requiresSelection) declared in the manifest for the current line item and return all the
 * visible key values as an expression.
 *
 * @param manifestActions the manifest defined actions
 * @returns {Expression<boolean>[]} all the visible path expressions of the actions that meet the criteria
 */
function getVisibleExpForCustomActionsRequiringContext(manifestActions: Record<string, CustomAction>): Expression<boolean>[] {
	const aVisiblePathExpressions: Expression<boolean>[] = [];
	if (manifestActions) {
		Object.keys(manifestActions).forEach(actionKey => {
			const action = manifestActions[actionKey];
			if (action.requiresSelection === true && action.visible !== undefined) {
				if (typeof action.visible === "string") {
					/*The final aim would be to check if the path expression depends on the parent context
					and considers only those expressions for the expression evaluation,
					but currently not possible from the manifest as the visible key is bound on the parent entity.
					Tricky to differenciate the path as it's done for the Hidden annotation.
					For the time being we consider all the paths of the manifest*/

					aVisiblePathExpressions.push(resolveBindingString(action?.visible?.valueOf()));
				}
			}
		});
	}
	return aVisiblePathExpressions;
}

/**
 * Evaluate if the path is statically deletable or updatable.
 *
 * @param converterContext
 * @returns {TableCapabilityRestriction} the table capabilities
 */
export function getCapabilityRestriction(converterContext: ConverterContext): TableCapabilityRestriction {
	const isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
	const isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
	return {
		isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
		isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
	};
}

export function getSelectionMode(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	isEntitySet: boolean,
	targetCapabilities: TableCapabilityRestriction
): string | undefined {
	if (!lineItemAnnotation) {
		return SelectionMode.None;
	}
	const tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
	let selectionMode = tableManifestSettings.tableSettings?.selectionMode;
	let aHiddenBindingExpressions: Expression<boolean>[] = [],
		aVisibleBindingExpressions: Expression<boolean>[] = [];
	const manifestActions = getActionsFromManifest(
		converterContext.getManifestControlConfiguration(visualizationPath).actions,
		converterContext,
		[],
		undefined,
		false
	);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined);
		parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
	}
	if (selectionMode && selectionMode === SelectionMode.None) {
		if (!isEntitySet) {
			if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
				selectionMode = SelectionMode.Multi;
				return compileBinding(
					ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant("None"))
				);
			} else {
				selectionMode = SelectionMode.None;
			}
		} else if (isEntitySet) {
			if (targetCapabilities.isDeletable) {
				selectionMode = SelectionMode.Multi;
				return selectionMode;
			} else {
				selectionMode = SelectionMode.None;
			}
		}
	} else if (!selectionMode || selectionMode === SelectionMode.Auto) {
		selectionMode = SelectionMode.Multi;
	}

	if (hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation) || hasCustomActionsAlwaysVisibleInToolBar(manifestActions)) {
		return selectionMode;
	}
	aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(
		lineItemAnnotation,
		converterContext.getDataModelObjectPath(),
		isEntitySet
	);
	aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions);

	// No action requiring a context:
	if (aHiddenBindingExpressions.length === 0 && aVisibleBindingExpressions.length === 0) {
		if (!isEntitySet) {
			if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
				return compileBinding(
					ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant(SelectionMode.None))
				);
			} else {
				return SelectionMode.None;
			}
			// EntitySet deletable:
		} else if (targetCapabilities.isDeletable) {
			return selectionMode;
			// EntitySet not deletable:
		} else {
			return SelectionMode.None;
		}
		// There are actions requiring a context:
	} else if (!isEntitySet) {
		if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
			return compileBinding(
				ifElse(
					equal(bindingExpression("/editMode", "ui"), "Editable"),
					constant(selectionMode),
					ifElse(
						or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
						constant(selectionMode),
						constant(SelectionMode.None)
					)
				)
			);
		} else {
			return compileBinding(
				ifElse(
					or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
					constant(selectionMode),
					constant(SelectionMode.None)
				)
			);
		}
		//EntitySet deletable:
	} else if (targetCapabilities.isDeletable) {
		return SelectionMode.Multi;
		//EtitySet not deletable:
	} else {
		return compileBinding(
			ifElse(
				or(...aHiddenBindingExpressions.concat(aVisibleBindingExpressions)),
				constant(selectionMode),
				constant(SelectionMode.None)
			)
		);
	}
}

/**
 * Method to retrieve all table actions from annotations.
 *
 * @param lineItemAnnotation
 * @param visualizationPath
 * @param converterContext
 * @returns {Record<BaseAction, BaseAction>} the table annotation actions
 */
function getTableAnnotationActions(lineItemAnnotation: LineItem, visualizationPath: string, converterContext: ConverterContext) {
	const tableActions: BaseAction[] = [];
	const hiddenTableActions: BaseAction[] = [];
	if (lineItemAnnotation) {
		lineItemAnnotation.forEach((dataField: DataFieldAbstractTypes) => {
			let tableAction: AnnotationAction | undefined;
			if (
				isDataFieldForActionAbstract(dataField) &&
				!(dataField.annotations?.UI?.Hidden?.valueOf() === true) &&
				!dataField.Inline &&
				!dataField.Determining
			) {
				const key = KeyHelper.generateKeyFromDataField(dataField);
				switch (dataField.$Type) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
						tableAction = {
							type: ActionType.DataFieldForAction,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key,
							visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
							isNavigable: true
						};
						break;

					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						tableAction = {
							type: ActionType.DataFieldForIntentBasedNavigation,
							annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
							key: key,
							visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true)))
						};
						break;
					default:
						break;
				}
			} else if (dataField.annotations?.UI?.Hidden?.valueOf() === true) {
				hiddenTableActions.push({
					type: ActionType.Default,
					key: KeyHelper.generateKeyFromDataField(dataField)
				});
			}
			if (tableAction) {
				tableActions.push(tableAction);
			}
		});
	}
	return {
		tableActions: tableActions,
		hiddenTableActions: hiddenTableActions
	};
}

function getCriticalityBindingByEnum(CriticalityEnum: EnumValue<CriticalityType>) {
	let criticalityProperty;
	switch (CriticalityEnum) {
		case "UI.CriticalityType/Negative":
			criticalityProperty = MessageType.Error;
			break;
		case "UI.CriticalityType/Critical":
			criticalityProperty = MessageType.Warning;
			break;
		case "UI.CriticalityType/Positive":
			criticalityProperty = MessageType.Success;
			break;
		case "UI.CriticalityType/Information":
			criticalityProperty = MessageType.Information;
			break;
		case "UI.CriticalityType/Neutral":
		default:
			criticalityProperty = MessageType.None;
	}
	return criticalityProperty;
}

function getHighlightRowBinding(
	criticalityAnnotation: PathAnnotationExpression<CriticalityType> | EnumValue<CriticalityType> | undefined,
	isDraftRoot: boolean
): Expression<MessageType> {
	let defaultHighlightRowDefinition: MessageType | Expression<MessageType> = MessageType.None;
	if (criticalityAnnotation) {
		if (typeof criticalityAnnotation === "object") {
			defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation) as Expression<MessageType>;
		} else {
			// Enum Value so we get the corresponding static part
			defaultHighlightRowDefinition = getCriticalityBindingByEnum(criticalityAnnotation);
		}
	}
	return ifElse(
		isDraftRoot && Draft.IsNewObject,
		MessageType.Information as MessageType,
		formatResult([defaultHighlightRowDefinition], tableFormatters.rowHighlighting)
	);
}

function _getCreationBehaviour(
	lineItemAnnotation: LineItem | undefined,
	tableManifestConfiguration: TableControlConfiguration,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration
): TableAnnotationConfiguration["create"] {
	const navigation = navigationSettings?.create || navigationSettings?.detail;

	// cross-app
	if (navigation?.outbound && navigation.outboundDetail && navigationSettings?.create) {
		return {
			mode: "External",
			outbound: navigation.outbound,
			outboundDetail: navigation.outboundDetail,
			navigationSettings: navigationSettings
		};
	}

	let newAction;
	if (lineItemAnnotation) {
		// in-app
		const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
		const targetAnnotations = converterContext.getEntitySetForEntityType(targetEntityType)?.annotations;
		newAction = targetAnnotations?.Common?.DraftRoot?.NewAction || targetAnnotations?.Session?.StickySessionSupported?.NewAction; // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

		if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
			// A combination of 'CreationRow' and 'NewAction' does not make sense
			// TODO: Or does it?
			throw Error(`Creation mode '${CreationMode.CreationRow}' can not be used with a custom 'new' action (${newAction})`);
		}
		if (navigation?.route) {
			// route specified
			return {
				mode: tableManifestConfiguration.creationMode,
				append: tableManifestConfiguration.createAtEnd,
				newAction: newAction?.toString(),
				navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode
			};
		}
	}

	// no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'
	if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
		tableManifestConfiguration.creationMode = CreationMode.Inline;
	}

	return {
		mode: tableManifestConfiguration.creationMode,
		append: tableManifestConfiguration.createAtEnd,
		newAction: newAction?.toString()
	};
}

const _getRowConfigurationProperty = function(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	navigationSettings: NavigationSettingsConfiguration,
	targetPath: string
) {
	let pressProperty, navigationTarget;
	let criticalityProperty: ExpressionOrPrimitive<MessageType> = MessageType.None;
	const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
	if (navigationSettings && lineItemAnnotation) {
		navigationTarget = navigationSettings.display?.target || navigationSettings.detail?.outbound;
		if (navigationTarget) {
			pressProperty =
				".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
		} else if (targetEntityType) {
			const targetEntitySet = converterContext.getEntitySetForEntityType(targetEntityType);
			navigationTarget = navigationSettings.detail?.route;
			if (navigationTarget) {
				criticalityProperty = getHighlightRowBinding(
					lineItemAnnotation.annotations?.UI?.Criticality,
					!!targetEntitySet?.annotations?.Common?.DraftRoot || !!targetEntitySet?.annotations?.Common?.DraftNode
				);
				pressProperty =
					"._onTableRowPress(${$parameters>bindingContext}, { callExtension: true, targetPath: '" +
					targetPath +
					"', editable : " +
					(targetEntitySet?.annotations?.Common?.DraftRoot || targetEntitySet?.annotations?.Common?.DraftNode
						? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')"
						: "undefined") +
					"})"; //Need to access to DraftRoot and DraftNode !!!!!!!
			} else {
				criticalityProperty = getHighlightRowBinding(lineItemAnnotation.annotations?.UI?.Criticality, false);
			}
		}
	}
	const rowNavigatedExpression: Expression<boolean> = formatResult(
		[bindingExpression("/deepestPath", "internal")],
		tableFormatters.navigatedRow,
		targetEntityType
	);
	return {
		press: pressProperty,
		action: pressProperty ? "Navigation" : undefined,
		rowHighlighting: compileBinding(criticalityProperty),
		rowNavigated: compileBinding(rowNavigatedExpression)
	};
};

/**
 * Retrieve the columns from the entityType.
 *
 * @param columnsToBeCreated The columns to be created.
 * @param entityType The target entity type.
 * @param annotationColumns The array of columns created based on LineItem annotations.
 * @param nonSortableColumns The array of all non sortable column names.
 * @param converterContext The converter context.
 * @returns {AnnotationTableColumn[]} the column from the entityType
 */
export const getColumnsFromEntityType = function(
	columnsToBeCreated: Record<string, CollectedProperties>,
	entityType: EntityType,
	annotationColumns: AnnotationTableColumn[] = [],
	nonSortableColumns: string[],
	converterContext: ConverterContext
): AnnotationTableColumn[] {
	const tableColumns: AnnotationTableColumn[] = [];
	// Catch already existing columns - which were added before by LineItem Annotations
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	entityType.entityProperties.forEach((property: Property) => {
		// Catch already existing columns - which were added before by LineItem Annotations
		const exists = annotationColumns.some(column => {
			return column.name === property.name;
		});

		// if target type exists, it is a complex property and should be ignored
		if (!property.targetType && !exists) {
			const description = columnsToBeCreated.hasOwnProperty(property.name)
				? columnsToBeCreated[property.name].description
				: undefined;
			const fieldGroup = columnsToBeCreated.hasOwnProperty(property.name) ? columnsToBeCreated[property.name].fieldGroup : undefined;
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedProperties(property.name, property, converterContext, true);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const columnInfo = getColumnDefinitionFromProperty(
				property,
				converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName),
				property.name,
				true,
				true,
				nonSortableColumns,
				aggregationHelper,
				converterContext,
				description,
				fieldGroup
			);
			if (relatedPropertyNames.length > 0) {
				columnInfo.propertyInfos = relatedPropertyNames;
				columnInfo.exportSettings = {
					...columnInfo.exportSettings,
					template: relatedPropertiesInfo.exportSettingsTemplate
				};

				// Collect information of related columns to be created.
				relatedPropertyNames.forEach(name => {
					columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
				});
			}

			tableColumns.push(columnInfo);
		}
	});
	return tableColumns;
};

/**
 * Create a column definition from a property.
 * @param property {Property} Entity type property for which the column is created
 * @param fullPropertyPath {string} the full path to the target property
 * @param relativePath {string} the relative path to the target property based on the context
 * @param useDataFieldPrefix {boolean} should be prefixed with "DataField::", else it will be prefixed with "Property::"
 * @param availableForAdaptation {boolean} decides whether column should be available for adaptation
 * @param nonSortableColumns {string[]} the array of all non sortable column names
 * @param aggregationHelper {AggregationHelper} the aggregationHelper for the entity
 * @param converterContext {ConverterContext} the converter context
 * @param descriptionProperty {Property} Entity type property for the column containing the description
 * @param fieldGroup {DataFieldAbstractTypes} FieldGroup datafield for the column containing the property
 * @returns {AnnotationTableColumn} the annotation column definition
 */
const getColumnDefinitionFromProperty = function(
	property: Property,
	fullPropertyPath: string,
	relativePath: string,
	useDataFieldPrefix: boolean,
	availableForAdaptation: boolean,
	nonSortableColumns: string[],
	aggregationHelper: AggregationHelper,
	converterContext: ConverterContext,
	descriptionProperty?: Property,
	fieldGroup?: DataFieldAbstractTypes
): AnnotationTableColumn {
	const name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
	const key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
	const semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property.fullyQualifiedName);
	const isHidden = property.annotations?.UI?.Hidden?.valueOf() === true;
	const groupPath: string | undefined = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
	const isGroup: boolean = groupPath != property.name;
	const sLabel: string | undefined = _getLabel(property, isGroup);
	const exportLabels: (string | undefined)[] | undefined =
		descriptionProperty || fieldGroup || name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1
			? _getExportLabel(sLabel, name, {
					value: property,
					description: descriptionProperty,
					fieldGroup: fieldGroup
			  })
			: undefined;

	return {
		key: key,
		isGroupable: aggregationHelper.isPropertyGroupable(property),
		type: ColumnType.Annotation,
		label: sLabel,
		groupLabel: isGroup ? _getLabel(property) : null,
		group: isGroup ? groupPath : null,
		annotationPath: fullPropertyPath,
		semanticObjectPath: semanticObjectAnnotationPath,
		// A fake property was created for the TargetValue used on DataPoints, this property should be hidden and non sortable
		availability:
			!availableForAdaptation || isHidden || name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1
				? AvailabilityType.Hidden
				: AvailabilityType.Adaptation,
		name: name,
		relativePath: relativePath,
		sortable:
			!isHidden && nonSortableColumns.indexOf(relativePath) === -1 && !(name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1),
		exportSettings: {
			labels: exportLabels
		},
		isKey: property.isKey
	} as AnnotationTableColumn;
};

/**
 * Returns boolean true for valid columns, false for invalid columns.
 *
 * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
 * @returns {boolean} True for valid columns, false for invalid columns
 * @private
 */
const _isValidColumn = function(dataField: DataFieldAbstractTypes) {
	switch (dataField.$Type) {
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			return !!dataField.Inline;
		case UIAnnotationTypes.DataFieldWithAction:
		case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
			return false;
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithUrl:
		case UIAnnotationTypes.DataFieldForAnnotation:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
			return true;
		default:
		// Todo: Replace with proper Log statement once available
		//  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);
	}
};

/**
 * Returns label for property and dataField.
 * @param {DataFieldAbstractTypes | Property} property Entity type property or DataField defined in the annotations
 * @param isGroup
 * @returns {string} Label of the property or DataField
 * @private
 */
const _getLabel = function(property: DataFieldAbstractTypes | Property, isGroup: boolean = false): string | undefined {
	if (!property) {
		return undefined;
	}
	if (isProperty(property)) {
		const dataFieldDefault = property.annotations?.UI?.DataFieldDefault;
		if (dataFieldDefault && !dataFieldDefault.qualifier && dataFieldDefault.Label?.valueOf()) {
			return compileBinding(annotationExpression(dataFieldDefault.Label?.valueOf()));
		}
		return compileBinding(annotationExpression(property.annotations.Common?.Label?.valueOf() || property.name));
	} else if (isDataFieldTypes(property)) {
		if (!!isGroup && property.$Type === UIAnnotationTypes.DataFieldWithIntentBasedNavigation) {
			return compileBinding(annotationExpression(property.Label?.valueOf()));
		}
		return compileBinding(
			annotationExpression(
				property.Label?.valueOf() || property.Value?.$target?.annotations?.Common?.Label?.valueOf() || property.Value?.$target?.name
			)
		);
	} else if (property.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		return compileBinding(
			annotationExpression(
				property.Label?.valueOf() || property.Target?.$target?.Value?.$target?.annotations?.Common?.Label?.valueOf()
			)
		);
	} else {
		return compileBinding(annotationExpression(property.Label?.valueOf()));
	}
};

/**
 * Returns an array of export labels as properties could inherited from FieldGroups and we want
 * to keep FielpGroup label and property label.
 *
 * @param {string} sLabel property's label
 * @param {string} columnName This column named is only used to identify dummy property created for the TargetValue in DataPoints
 * @param {CollectedProperties} properties properties collected from property (it could be a description or FieldGroup)
 * @returns {string[]} the array of labels to be considered on the exportSettings.
 * @private
 */
const _getExportLabel = function(sLabel: string | undefined, columnName: string, properties: CollectedProperties): (string | undefined)[] {
	let exportLabels: (string | undefined)[] = [];
	if (properties.description) {
		const descriptionLabel: string | undefined = _getLabel(properties.description);
		exportLabels.push(descriptionLabel);
	}
	if (properties.fieldGroup) {
		const fieldGroupLabel: string | undefined = _getLabel(properties.fieldGroup);
		exportLabels.push(fieldGroupLabel);
	}
	exportLabels.push(sLabel);
	// Remove duplicate labels (e.g. FieldGroup label is the same as the label of one of the properties)
	exportLabels = exportLabels.filter(function(label, index) {
		if (exportLabels.indexOf(label) == index) {
			return label;
		}
	});

	// Set export label for Fake property containing Datapoint TargetValue
	if (columnName?.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1) {
		exportLabels.push("DataPoint.TargetValue");
	}

	return exportLabels;
};
/**
 * Create a PropertyInfo for each identified property consumed by a LineItem.
 * @param columnsToBeCreated {Record<string, Property>} Identified properties.
 * @param existingColumns The list of columns created for LineItems and Properties of entityType.
 * @param nonSortableColumns The array of column names which cannot be sorted.
 * @param converterContext The converter context.
 * @param entityType The entity type for the LineItem
 * @returns {AnnotationTableColumn[]} the array of columns created.
 */
const _createRelatedColumns = function(
	columnsToBeCreated: Record<string, CollectedProperties>,
	existingColumns: AnnotationTableColumn[],
	nonSortableColumns: string[],
	converterContext: ConverterContext,
	entityType: EntityType
): AnnotationTableColumn[] {
	const relatedColumns: AnnotationTableColumn[] = [];
	const relatedPropertyNameMap: Record<string, string> = {};
	const aggregationHelper = new AggregationHelper(entityType, converterContext);

	Object.keys(columnsToBeCreated).forEach(name => {
		const { value, description, fieldGroup } = columnsToBeCreated[name],
			annotationPath = converterContext.getAbsoluteAnnotationPath(name),
			// Check whether the related column already exists.
			relatedColumn = existingColumns.find(column => column.name === name);
		if (relatedColumn === undefined) {
			// Case 1: Create a new property column, this property shouldn't be hidden
			// as it could added/removed via table personalization dialog.
			// Key contains DataField prefix to ensure all property columns have the same key format.
			relatedColumns.push(
				getColumnDefinitionFromProperty(
					value,
					annotationPath,
					name,
					true,
					false,
					nonSortableColumns,
					aggregationHelper,
					converterContext,
					description,
					fieldGroup
				)
			);
		} else if (
			relatedColumn.annotationPath !== annotationPath ||
			(relatedColumn.propertyInfos && relatedColumn.propertyInfos.indexOf(name) !== -1)
		) {
			// Case 2: The existing column points to a LineItem (or)
			// Case 3: This is a self reference from an existing column and
			// both cases require a dummy PropertyInfo for setting correct export settings.

			const newName = "Property::" + name;
			// Checking whether the related property column has already been created in a previous iteration.
			if (!existingColumns.some(column => column.name === newName)) {
				// Create a new property column with 'Property::' prefix,
				// Set it to hidden as it is only consumed by Complex property infos.
				relatedColumns.push(
					getColumnDefinitionFromProperty(
						value,
						annotationPath,
						name,
						false,
						false,
						nonSortableColumns,
						aggregationHelper,
						converterContext,
						description
					)
				);
				relatedPropertyNameMap[name] = newName;
			}
		}
	});

	// The property 'name' has been prefixed with 'Property::' for uniqueness.
	// Update the same in other propertyInfos[] references which point to this property.
	existingColumns.forEach(column => {
		column.propertyInfos = column.propertyInfos?.map(propertyInfo => relatedPropertyNameMap[propertyInfo] ?? propertyInfo);
	});

	return relatedColumns;
};

/**
 * Getting the Column Name
 * If it points to a DataField with one property or DataPoint with one property it will use the property name
 * here to be consistent with the existing flex changes.
 *
 * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
 * @returns {string} Returns name of annotation columns
 * @private
 */
const _getAnnotationColumnName = function(dataField: DataFieldAbstractTypes) {
	// This is needed as we have flexibility changes already that we have to check against
	if (isDataFieldTypes(dataField)) {
		return dataField.Value?.path;
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation && dataField.Target?.$target?.Value?.path) {
		// This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
		return dataField.Target.$target.Value.path;
	} else {
		return KeyHelper.generateKeyFromDataField(dataField);
	}
};

/**
 * Determine the property relative path with respect to the root entity.
 * @param dataField The Data field being processed.
 * @returns {string} The relative path
 */
const _getRelativePath = function(dataField: DataFieldAbstractTypes): string {
	let relativePath: string = "";

	switch (dataField.$Type) {
		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
		case UIAnnotationTypes.DataFieldWithUrl:
			relativePath = (dataField as DataField)?.Value?.path;
			break;

		case UIAnnotationTypes.DataFieldForAnnotation:
			relativePath = (dataField as DataFieldForAnnotation)?.Target?.value;
			break;

		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			relativePath = KeyHelper.generateKeyFromDataField(dataField);
			break;
	}

	return relativePath;
};

const _sliceAtSlash = function(path: string, isLastSlash: boolean, isLastPart: boolean) {
	const iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

	if (iSlashIndex === -1) {
		return path;
	}
	return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
};

/**
 * Determine whether a column is sortable.
 *
 * @param dataField The data field being processed
 * @param propertyPath The property path
 * @param nonSortableColumns Collection of non-sortable column names as per annotation
 * @returns {boolean} True if the column is sortable
 */
const _isColumnSortable = function(dataField: DataFieldAbstractTypes, propertyPath: string, nonSortableColumns: string[]): boolean {
	let isSortable: boolean = false;
	if (nonSortableColumns.indexOf(propertyPath) === -1) {
		// Column is not marked as non-sortable via annotation
		switch (dataField.$Type) {
			case UIAnnotationTypes.DataField:
			case UIAnnotationTypes.DataFieldWithUrl:
				isSortable = true;
				break;

			case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldForAction:
				// Action columns are not sortable
				isSortable = false;
				break;
		}
	}
	return isSortable;
};

/**
 * Returns line items from metadata annotations.
 *
 * @param lineItemAnnotation
 * @param visualizationPath
 * @param converterContext
 * @returns {TableColumn[]} the columns from the annotations
 */
const getColumnsFromAnnotations = function(
	lineItemAnnotation: LineItem,
	visualizationPath: string,
	converterContext: ConverterContext
): TableColumn[] {
	const entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
		annotationColumns: AnnotationTableColumn[] = [],
		columnsToBeCreated: Record<string, CollectedProperties> = {},
		nonSortableColumns: string[] =
			(converterContext.getEntitySet()?.annotations?.Capabilities?.SortRestrictions
				?.NonSortableProperties as Edm.PropertyPath[])?.map((property: PropertyPath) => property.value) ?? [];

	if (lineItemAnnotation) {
		// Get columns from the LineItem Annotation
		lineItemAnnotation.forEach(lineItem => {
			if (!_isValidColumn(lineItem)) {
				return;
			}
			const semanticObjectAnnotationPath =
				isDataFieldTypes(lineItem) && lineItem.Value?.$target?.fullyQualifiedName
					? getSemanticObjectPath(converterContext, lineItem)
					: undefined;
			const relativePath = _getRelativePath(lineItem);
			// Determine properties which are consumed by this LineItem.
			const relatedPropertiesInfo: ComplexPropertyInfo = collectRelatedPropertiesRecursively(lineItem, converterContext);
			const relatedPropertyNames: string[] = Object.keys(relatedPropertiesInfo.properties);
			const groupPath: string = _sliceAtSlash(relativePath, true, false);
			const isGroup: boolean = groupPath != relativePath;
			const sLabel: string | undefined = _getLabel(lineItem, isGroup);
			annotationColumns.push({
				key: KeyHelper.generateKeyFromDataField(lineItem),
				type: ColumnType.Annotation,
				label: sLabel,
				groupLabel: isGroup ? _getLabel(lineItem) : null,
				group: isGroup ? groupPath : null,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
				semanticObjectPath: semanticObjectAnnotationPath,
				availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
				name: _getAnnotationColumnName(lineItem),
				relativePath: relativePath,
				sortable: _isColumnSortable(lineItem, relativePath, nonSortableColumns),
				propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
				exportSettings: {
					template: relatedPropertiesInfo.exportSettingsTemplate
				},
				width: lineItem.annotations?.HTML5?.CssDefaults?.width || undefined,
				isNavigable: true,
				formatOptions: {
					textLinesDisplay: 4,
					textLinesEdit: 4
				}
			} as AnnotationTableColumn);

			// Collect information of related columns to be created.
			relatedPropertyNames.forEach(name => {
				columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
			});
		});
	}

	// Get columns from the Properties of EntityType
	let tableColumns = getColumnsFromEntityType(columnsToBeCreated, entityType, annotationColumns, nonSortableColumns, converterContext);
	tableColumns = tableColumns.concat(annotationColumns);

	// Create a propertyInfo for each related property.
	const relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);
	tableColumns = tableColumns.concat(relatedColumns);

	return tableColumns;
};

/**
 * Gets the property names from the manifest and checks against existing properties already added by annotations.
 * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
 * @param properties {string[] | undefined}
 * @param annotationColumns {AnnotationTableColumn[]}
 * @param converterContext {ConverterContext}
 * @param entityType
 * @returns {string[]} the columns from the annotations
 */
const _getPropertyNames = function(
	properties: string[] | undefined,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType
): string[] | undefined {
	let matchedProperties: string[] | undefined;

	if (properties) {
		matchedProperties = properties.map(function(propertyPath) {
			const annotationColumn = annotationColumns.find(function(annotationColumn) {
				return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
			});
			if (annotationColumn) {
				return annotationColumn.name;
			} else {
				const relatedColumns = _createRelatedColumns(
					{ [propertyPath]: { value: entityType.resolvePath(propertyPath) } },
					annotationColumns,
					[],
					converterContext,
					entityType
				);
				annotationColumns.push(relatedColumns[0]);
				return relatedColumns[0].name;
			}
		});
	}

	return matchedProperties;
};

/**
 * Retrieves the table column property value based on certain conditions.
 *
 * Manifest defined property value for custom / annotation columns
 * Default property value for custom column if not overwritten in manifest.
 * @param property {any} The column property defined in the manifest
 * @param defaultValue {any} The default value of the property
 * @param isAnnotationColumn {boolean} Whether the column, defined in manifest, corresponds to an existing annotation column.
 * @returns {any} Determined property value for the column
 */
const _getManifestOrDefaultValue = function(property: any, defaultValue: any, isAnnotationColumn: boolean): any {
	if (property === undefined) {
		// If annotation column has no property defined in manifest,
		// do not overwrite it with manifest column's default value.
		return isAnnotationColumn ? undefined : defaultValue;
	}
	// Return what is defined in manifest.
	return property;
};

/**
 * Returns table column definitions from manifest.
 * @param columns
 * @param annotationColumns
 * @param converterContext
 * @param entityType
 * @param navigationSettings
 * @returns {Record<string, CustomColumn>} the columns from the manifest
 */
const getColumnsFromManifest = function(
	columns: Record<string, ManifestTableColumn>,
	annotationColumns: AnnotationTableColumn[],
	converterContext: ConverterContext,
	entityType: EntityType,
	navigationSettings?: NavigationSettingsConfiguration
): Record<string, CustomColumn> {
	const internalColumns: Record<string, CustomColumn> = {};

	for (const key in columns) {
		const manifestColumn = columns[key];
		// To identify the annotation column property overwrite via manifest use-case.
		const isAnnotationColumn = annotationColumns.some(column => column.key === key);
		KeyHelper.validateKey(key);

		internalColumns[key] = {
			key: key,
			id: "CustomColumn::" + key,
			name: "CustomColumn::" + key,
			header: manifestColumn.header,
			width: manifestColumn.width || undefined,
			horizontalAlign: _getManifestOrDefaultValue(manifestColumn?.horizontalAlign, HorizontalAlign.Begin, isAnnotationColumn),
			type: ColumnType.Default,
			availability: _getManifestOrDefaultValue(manifestColumn?.availability, AvailabilityType.Default, isAnnotationColumn),
			template: manifestColumn.template || "undefined",
			position: {
				anchor: manifestColumn.position?.anchor,
				placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
			},
			isNavigable: isAnnotationColumn ? undefined : isActionNavigable(manifestColumn, navigationSettings, true),
			settings: manifestColumn.settings,
			sortable: false,
			propertyInfos: _getPropertyNames(manifestColumn.properties, annotationColumns, converterContext, entityType),
			formatOptions: {
				textLinesDisplay: 4,
				textLinesEdit: 4,
				...manifestColumn.formatOptions
			}
		};
	}
	return internalColumns;
};

export function getP13nMode(
	visualizationPath: string,
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration
): string | undefined {
	const manifestWrapper: ManifestWrapper = converterContext.getManifestWrapper();
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const variantManagement: VariantManagementType = manifestWrapper.getVariantManagement();
	const hasVariantManagement: boolean = ["Page", "Control"].indexOf(variantManagement) > -1;
	const aPersonalization: string[] = [];
	if (hasVariantManagement) {
		const bAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";
		if (tableManifestSettings?.tableSettings?.personalization !== undefined) {
			// Personalization configured in manifest.
			const personalization: any = tableManifestSettings.tableSettings.personalization;
			if (personalization === true) {
				// Table personalization fully enabled.
				return bAnalyticalTable ? "Sort,Column,Filter,Group,Aggregate" : "Sort,Column,Filter";
			} else if (typeof personalization === "object") {
				// Specific personalization options enabled in manifest. Use them as is.
				if (personalization.sort) {
					aPersonalization.push("Sort");
				}
				if (personalization.column) {
					aPersonalization.push("Column");
				}
				if (personalization.filter) {
					aPersonalization.push("Filter");
				}
				if (personalization.group && bAnalyticalTable) {
					aPersonalization.push("Group");
				}
				if (personalization.aggregate && bAnalyticalTable) {
					aPersonalization.push("Aggregate");
				}
				return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
			}
		} else {
			// No personalization configured in manifest.
			aPersonalization.push("Sort");
			aPersonalization.push("Column");
			if (variantManagement === VariantManagementType.Control) {
				// Feature parity with V2.
				// Enable table filtering by default only in case of Control level variant management.
				aPersonalization.push("Filter");
			}
			if (bAnalyticalTable) {
				aPersonalization.push("Group");
				aPersonalization.push("Aggregate");
			}
			return aPersonalization.join(",");
		}
	}
	return undefined;
}

function getDeleteHidden(currentEntitySet: EntitySet | undefined, navigationPath: string) {
	let isDeleteHidden: any = false;
	if (currentEntitySet && navigationPath) {
		// Check if UI.DeleteHidden is pointing to parent path
		const deleteHiddenAnnotation = currentEntitySet.navigationPropertyBinding[navigationPath]?.annotations?.UI?.DeleteHidden;
		if (deleteHiddenAnnotation && (deleteHiddenAnnotation as any).path) {
			if ((deleteHiddenAnnotation as any).path.indexOf("/") > 0) {
				const aSplitHiddenPath = (deleteHiddenAnnotation as any).path.split("/");
				const sNavigationPath = aSplitHiddenPath[0];
				const partnerName = (currentEntitySet as any).entityType.navigationProperties.find(
					(navProperty: any) => navProperty.name === navigationPath
				).partner;
				if (partnerName === sNavigationPath) {
					isDeleteHidden = deleteHiddenAnnotation;
				}
			} else {
				isDeleteHidden = false;
			}
		} else {
			isDeleteHidden = deleteHiddenAnnotation;
		}
	} else {
		isDeleteHidden = currentEntitySet && currentEntitySet.annotations?.UI?.DeleteHidden;
	}
	return isDeleteHidden;
}

/**
 * Returns visibility for Delete button
 * @param converterContext
 * @param navigationPath
 * @param isTargetDeletable
 */

export function getDeleteVisible(
	converterContext: ConverterContext,
	navigationPath: string,
	isTargetDeletable: boolean
): BindingExpression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const isDeleteHidden: any = getDeleteHidden(currentEntitySet, navigationPath);
	let isParentDeletable, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
		parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
	}
	//do not show case the delete button if parentEntitySetDeletable is false
	if (parentEntitySetDeletable === "false") {
		return false;
	} else if (parentEntitySetDeletable && isDeleteHidden !== true) {
		//Delete Hidden in case of true and path based
		if (isDeleteHidden) {
			return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
		} else {
			return "{= ${ui>/editMode} === 'Editable'}";
		}
	} else if (isDeleteHidden === true || !isTargetDeletable || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
		return false;
	} else if (converterContext.getTemplateType() !== TemplateType.ListReport) {
		if (isDeleteHidden) {
			return "{= !${" + (navigationPath ? navigationPath + "/" : "") + isDeleteHidden.path + "} && ${ui>/editMode} === 'Editable'}";
		} else {
			return "{= ${ui>/editMode} === 'Editable'}";
		}
	} else {
		return true;
	}
}

/**
 * Returns visibility for Create button
 *
 * @param converterContext
 * @param creationBehaviour
 * @returns {*} Expression or Boolean value of create hidden
 */

export function getCreateVisible(
	converterContext: ConverterContext,
	creationMode: CreationMode | "External",
	isInsertable: Expression<boolean>
): Expression<boolean> {
	const currentEntitySet = converterContext.getEntitySet();
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const isCreateHidden: Expression<boolean> = currentEntitySet
		? annotationExpression(
				(currentEntitySet?.annotations.UI?.CreateHidden as PropertyAnnotationValue<boolean>) || false,
				dataModelObjectPath.navigationProperties.map(navProp => navProp.name)
		  )
		: constant(false);
	// if there is a custom new action the create button will be bound against this new action (instead of a POST action).
	// The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
	// OperationAvailable = true or undefined -> create is visible
	// OperationAvailable = false -> create is not visible
	const newActionName: BindingExpression<string> = currentEntitySet?.annotations.Common?.DraftRoot?.NewAction?.toString();
	const showCreateForNewAction = newActionName
		? annotationExpression(
				converterContext?.getEntityType().actions[newActionName].annotations?.Core?.OperationAvailable?.valueOf(),
				[],
				true
		  )
		: undefined;

	// - If it's statically not insertable -> create is not visible
	// - If create is statically hidden -> create is not visible
	// - If it's an ALP template -> create is not visible
	// -
	// - Otherwise
	// 	 - If the create mode is external -> create is visible
	// 	 - If we're on the list report -> create is visible
	// 	 - Otherwise
	// 	   - This depends on the value of the the UI.IsEditable
	return ifElse(
		or(
			or(
				equal(showCreateForNewAction, false),
				and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))
			),
			isConstant(isCreateHidden) && equal(isCreateHidden, true),
			converterContext.getTemplateType() === TemplateType.AnalyticalListPage
		),
		false,
		ifElse(
			or(creationMode === "External", converterContext.getTemplateType() === TemplateType.ListReport),
			true,
			and(not(isCreateHidden), UI.IsEditable)
		)
	);
}

/**
 * Returns visibility for Create button
 *
 * @param converterContext
 * @param creationBehaviour
 * @returns {*} Expression or Boolean value of createhidden
 */

export function getPasteEnabled(
	converterContext: ConverterContext,
	creationBehaviour: TableAnnotationConfiguration["create"],
	isInsertable: Expression<boolean>
): Expression<boolean> {
	// If create is not visible -> it's not enabled
	// If create is visible ->
	// 	 If it's in the ListReport -> not enabled
	//	 If it's insertable -> enabled
	return ifElse(
		equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable), true),
		converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable,
		false
	);
}

/**
 * Returns a JSON string containing Presentation Variant sort conditions.
 *
 * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Sort conditions for a Presentation variant.
 */
function getSortConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let sortConditions: string | undefined;
	if (presentationVariantAnnotation?.SortOrder) {
		const sorters: SorterType[] = [];
		const conditions = {
			sorters: sorters
		};
		presentationVariantAnnotation.SortOrder.forEach(condition => {
			const propertyName = (condition.Property as PropertyPath)?.$target?.name;
			const sortColumn = columns.find(column => column.name === propertyName) as AnnotationTableColumn;
			sortColumn?.propertyInfos?.forEach(relatedPropertyName => {
				// Complex PropertyInfo. Add each related property for sorting.
				conditions.sorters.push({
					name: relatedPropertyName,
					descending: !!condition.Descending
				});
			});

			if (!sortColumn?.propertyInfos?.length) {
				// Not a complex PropertyInfo. Consider the property itself for sorting.
				conditions.sorters.push({
					name: propertyName,
					descending: !!condition.Descending
				});
			}
		});
		sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
	}
	return sortConditions;
}

/**
 * Converts an array of prpertyPath to an array of propertyInfo names.
 *
 * @param paths the array to be converted
 * @param columns the array of propertyInfos
 * @returns an array of proprtyInfo names
 */

function convertPropertyPathsToInfoNames(paths: PropertyPath[], columns: TableColumn[]): string[] {
	const infoNames: string[] = [];
	paths.forEach(currentPath => {
		if (currentPath?.$target?.name) {
			const propertyInfo = columns.find(column => {
				const annotationColumn = column as AnnotationTableColumn;
				return !annotationColumn.propertyInfos && annotationColumn.relativePath === currentPath?.$target?.name;
			});
			if (propertyInfo) {
				infoNames.push(propertyInfo.name);
			}
		}
	});

	return infoNames;
}

/**
 * Returns a JSON string containing Presentation Variant group conditions.
 *
 * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Group conditions for a Presentation variant.
 */
function getGroupConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let groupConditions: string | undefined;
	if (presentationVariantAnnotation?.GroupBy) {
		const aGroupBy = presentationVariantAnnotation.GroupBy as PropertyPath[];
		const aGroupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map(infoName => {
			return { name: infoName };
		});

		groupConditions = aGroupLevels.length ? JSON.stringify({ groupLevels: aGroupLevels }) : undefined;
	}
	return groupConditions;
}

/**
 * Returns a JSON string containing Presentation Variant aggregate conditions.
 *
 * @param presentationVariantAnnotation {PresentationVariantTypeTypes | undefined} Presentation variant annotation
 * @param columns Converter processed table columns
 * @returns {string | undefined} Group conditions for a Presentation variant.
 */
function getAggregateConditions(
	presentationVariantAnnotation: PresentationVariantTypeTypes | undefined,
	columns: TableColumn[]
): string | undefined {
	let aggregateConditions: string | undefined;
	if (presentationVariantAnnotation?.Total) {
		const aTotals = presentationVariantAnnotation.Total as PropertyPath[];
		const aggregates: Record<string, object> = {};
		convertPropertyPathsToInfoNames(aTotals, columns).forEach(infoName => {
			aggregates[infoName] = {};
		});

		aggregateConditions = JSON.stringify(aggregates);
	}

	return aggregateConditions;
}

export function getTableAnnotationConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	tableManifestConfiguration: TableControlConfiguration,
	columns: TableColumn[],
	presentationVariantAnnotation?: PresentationVariantTypeTypes
): TableAnnotationConfiguration {
	// Need to get the target
	const { navigationPropertyPath } = splitPath(visualizationPath);
	const title: any = converterContext.getDataModelObjectPath().targetEntityType.annotations?.UI?.HeaderInfo?.TypeNamePlural;
	const entitySet = converterContext.getDataModelObjectPath().startingEntitySet;
	const pageManifestSettings: ManifestWrapper = converterContext.getManifestWrapper();
	const isEntitySet: boolean = navigationPropertyPath.length === 0,
		p13nMode: string | undefined = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration),
		id = isEntitySet && entitySet ? TableID(entitySet.name, "LineItem") : TableID(visualizationPath);
	const targetCapabilities = getCapabilityRestriction(converterContext);
	const selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities);
	let threshold = isEntitySet ? 30 : 10;
	if (presentationVariantAnnotation?.MaxItems) {
		threshold = presentationVariantAnnotation.MaxItems.valueOf() as number;
	}

	const navigationOrCollectionName = isEntitySet && entitySet ? entitySet.name : navigationPropertyPath;
	const navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationOrCollectionName);
	const creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);
	let isParentDeletable: any, parentEntitySetDeletable;
	if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
		isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);
		if (isParentDeletable?.currentEntityRestriction) {
			parentEntitySetDeletable = undefined;
		} else {
			parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
		}
	}
	const dataModelObjectPath = converterContext.getDataModelObjectPath();
	const isInsertable: Expression<boolean> = isPathInsertable(dataModelObjectPath);

	return {
		id: id,
		entityName: entitySet ? entitySet.name : "",
		collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
		navigationPath: navigationPropertyPath,
		isEntitySet: isEntitySet,
		row: _getRowConfigurationProperty(
			lineItemAnnotation,
			visualizationPath,
			converterContext,
			navigationSettings,
			navigationOrCollectionName
		),
		p13nMode: p13nMode,
		show: {
			"delete": getDeleteVisible(converterContext, navigationPropertyPath, targetCapabilities.isDeletable),
			create: compileBinding(getCreateVisible(converterContext, creationBehaviour?.mode, isInsertable)),
			paste: compileBinding(getPasteEnabled(converterContext, creationBehaviour, isInsertable))
		},
		displayMode: isInDisplayMode(converterContext),
		create: creationBehaviour,
		selectionMode: selectionMode,
		autoBindOnInit:
			converterContext.getTemplateType() !== TemplateType.ListReport &&
			converterContext.getTemplateType() !== TemplateType.AnalyticalListPage,
		enableControlVM: pageManifestSettings.getVariantManagement() === "Control" && !!p13nMode,
		threshold: threshold,
		sortConditions: getSortConditions(presentationVariantAnnotation, columns),
		parentEntityDeleteEnabled: parentEntitySetDeletable,
		title: title
	};
}

function isInDisplayMode(converterContext: ConverterContext): boolean {
	const templateType = converterContext.getTemplateType();
	if (templateType === TemplateType.AnalyticalListPage || templateType === TemplateType.ListReport) {
		return true;
	}
	// updatable will be handled at the property level
	return false;
}

/**
 * Split the visualization path into the navigation property path and annotation.
 *
 * @param visualizationPath
 * @returns {object}
 */
function splitPath(visualizationPath: string) {
	let [navigationPropertyPath, annotationPath] = visualizationPath.split("@");

	if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
		// Drop trailing slash
		navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
	}
	return { navigationPropertyPath, annotationPath };
}

export function getSelectionVariantConfiguration(
	selectionVariantPath: string,
	converterContext: ConverterContext
): SelectionVariantConfiguration | undefined {
	const resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
	const selection: SelectionVariantType = resolvedTarget.annotation as SelectionVariantType;

	if (selection) {
		const propertyNames: string[] = [];
		selection.SelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const PropertyPath: string = propertyName.value;
			if (propertyNames.indexOf(PropertyPath) === -1) {
				propertyNames.push(PropertyPath);
			}
		});
		return {
			text: selection?.Text?.toString(),
			propertyNames: propertyNames
		};
	}
	return undefined;
}

export function getTableManifestConfiguration(
	lineItemAnnotation: LineItem | undefined,
	visualizationPath: string,
	converterContext: ConverterContext,
	isCondensedTableLayoutCompliant: boolean = false
): TableControlConfiguration {
	const tableManifestSettings: TableManifestConfiguration = converterContext.getManifestControlConfiguration(visualizationPath);
	const tableSettings = tableManifestSettings.tableSettings;
	let quickSelectionVariant: any;
	const quickFilterPaths: { annotationPath: string }[] = [];
	let enableExport = true;
	let creationMode = CreationMode.NewPage;
	let filters;
	let createAtEnd = true;
	let disableAddRowButtonForEmptyData = false;
	let condensedTableLayout = false;
	let hideTableTitle = false;
	let tableType: TableType = "ResponsiveTable";
	let enableFullScreen = false;
	let selectionLimit = 200;
	let enablePaste = converterContext.getTemplateType() === "ObjectPage";
	const shellServices = converterContext.getShellServices();
	const userContentDensity = shellServices?.getContentDensity();
	const appContentDensity = converterContext.getManifestWrapper().getContentDensities();
	const entityType = converterContext.getEntityType();
	const aggregationHelper = new AggregationHelper(entityType, converterContext);
	if ((appContentDensity?.cozy === true && appContentDensity?.compact !== true) || userContentDensity === "cozy") {
		isCondensedTableLayoutCompliant = false;
	}
	if (tableSettings && lineItemAnnotation) {
		const targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
		tableSettings?.quickVariantSelection?.paths?.forEach((path: { annotationPath: string }) => {
			quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath);
			// quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);
			if (quickSelectionVariant) {
				quickFilterPaths.push({ annotationPath: path.annotationPath });
			}
			filters = {
				quickFilters: {
					enabled:
						converterContext.getTemplateType() === TemplateType.ListReport
							? "{= ${pageInternal>hasPendingFilters} !== true}"
							: true,
					showCounts: tableSettings?.quickVariantSelection?.showCounts,
					paths: quickFilterPaths
				}
			};
		});
		creationMode = tableSettings.creationMode?.name || creationMode;
		createAtEnd = tableSettings.creationMode?.createAtEnd !== undefined ? tableSettings.creationMode?.createAtEnd : true;
		disableAddRowButtonForEmptyData = !!tableSettings.creationMode?.disableAddRowButtonForEmptyData;
		condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
		hideTableTitle = !!tableSettings.quickVariantSelection?.hideTableTitle;
		tableType = tableSettings?.type || "ResponsiveTable";
		if (converterContext.getTemplateType() === "AnalyticalListPage") {
			if (tableSettings?.type === "AnalyticalTable" && !aggregationHelper.isAnalyticsSupported()) {
				tableType = "GridTable";
			}
			if (!tableSettings?.type) {
				if (converterContext.getManifestWrapper().isDesktop() && aggregationHelper.isAnalyticsSupported()) {
					tableType = "AnalyticalTable";
				} else {
					tableType = "ResponsiveTable";
				}
			}
		}
		enableFullScreen = tableSettings.enableFullScreen || false;
		if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
			enableFullScreen = false;
			converterContext
				.getDiagnostics()
				.addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
		}
		selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;
		enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
		enableExport =
			tableSettings.enableExport !== undefined
				? tableSettings.enableExport
				: converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
	}
	return {
		filters: filters,
		type: tableType,
		enableFullScreen: enableFullScreen,
		headerVisible: !(quickSelectionVariant && hideTableTitle),
		enableExport: enableExport,
		creationMode: creationMode,
		createAtEnd: createAtEnd,
		disableAddRowButtonForEmptyData: disableAddRowButtonForEmptyData,
		useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
		selectionLimit: selectionLimit,
		enablePaste: enablePaste
	};
}
