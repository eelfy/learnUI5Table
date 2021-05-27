import { ConverterContext, TemplateType } from "../../templates/BaseConverter";
import {
	Chart,
	ChartDefinitionTypeTypes,
	EntityType,
	LineItem,
	PresentationVariantTypeTypes,
	SelectionPresentationVariantTypeTypes,
	SelectionVariantTypeTypes,
	UIAnnotationTerms
} from "@sap-ux/vocabularies-types";

import { createDefaultTableVisualization, createTableVisualization, TableVisualization } from "./Table";
import { ChartVisualization, createChartVisualization } from "./Chart";
import { IssueType, IssueSeverity, IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";

export type DataVisualizationAnnotations =
	| LineItem
	| Chart
	| PresentationVariantTypeTypes
	| SelectionVariantTypeTypes
	| SelectionPresentationVariantTypeTypes;
// | ChartDefinitionTypeTypes;

export type ActualVisualizationAnnotations = LineItem | ChartDefinitionTypeTypes;

type VisualizationAndPath = {
	visualization: ActualVisualizationAnnotations;
	annotationPath: string;
	selectionVariantPath?: string;
	converterContext: ConverterContext;
};

export type DataVisualizationDefinition = {
	visualizations: (TableVisualization | ChartVisualization)[];
	annotationPath: string;
};

const getVisualizationsFromPresentationVariant = function(
	presentationVariantAnnotation: PresentationVariantTypeTypes,
	visualizationPath: string,
	converterContext: ConverterContext
): VisualizationAndPath[] {
	const visualizationAnnotations: VisualizationAndPath[] = [];
	const visualizations = presentationVariantAnnotation.Visualizations || [];
	const baseVisualizationPath = visualizationPath.split("@")[0];
	if (visualizations) {
		// Only allow one line item / chart
		let hasLineItem = false;
		let hasChart = false;
		let hasVisualization = false; // used to allow only first visualization in OP
		visualizations.forEach(visualization => {
			switch (visualization.$target.term) {
				case UIAnnotationTerms.LineItem:
					if (!hasLineItem) {
						if (!(converterContext.getTemplateType() === TemplateType.ObjectPage && hasVisualization)) {
							visualizationAnnotations.push({
								visualization: visualization.$target as ActualVisualizationAnnotations,
								annotationPath: `${baseVisualizationPath}${visualization.value}`,
								converterContext: converterContext
							});
							hasLineItem = true;
							hasVisualization = true;
						}
					}
					break;
				case UIAnnotationTerms.Chart:
					if (
						!hasChart &&
						((converterContext.getTemplateType() === TemplateType.AnalyticalListPage &&
							!converterContext.getManifestWrapper().getViewConfiguration()) ||
							(converterContext.getTemplateType() === TemplateType.ObjectPage && !hasVisualization))
					) {
						visualizationAnnotations.push({
							visualization: visualization.$target as ActualVisualizationAnnotations,
							annotationPath: `${baseVisualizationPath}${visualization.value}`,
							converterContext: converterContext
						});
						hasChart = true;
						hasVisualization = true;
					}
					break;
				default:
					break;
			}
		});
	}
	return visualizationAnnotations;
};

export function getSelectionPresentationVariant(
	entityType: EntityType,
	annotationPath: string | undefined,
	converterContext: ConverterContext
): any {
	if (annotationPath) {
		const resolvedTarget = converterContext.getEntityTypeAnnotation(annotationPath);
		const selectionPresentationVariant = resolvedTarget.annotation as SelectionPresentationVariantTypeTypes;
		if (selectionPresentationVariant) {
			if (selectionPresentationVariant.term === UIAnnotationTerms.SelectionPresentationVariant) {
				return selectionPresentationVariant;
			}
		} else {
			throw new Error("Annotation Path for the SPV mentioned in the manifest is not found, Please add the SPV in the annotation");
		}
	} else {
		return entityType.annotations?.UI?.SelectionPresentationVariant;
	}
}

export function isSelectionPresentationCompliant(
	SelectionPresentationVariant: SelectionPresentationVariantTypeTypes,
	bIsALP: Boolean
): Boolean | undefined {
	const presentationVariant = SelectionPresentationVariant && SelectionPresentationVariant.PresentationVariant;
	if (presentationVariant) {
		return isPresentationCompliant(presentationVariant, bIsALP);
	}
}

export function isPresentationCompliant(presentationVariant: PresentationVariantTypeTypes, bIsALP?: Boolean): Boolean {
	let bHasTable = false,
		bHasChart = false;
	if (bIsALP) {
		if (presentationVariant && presentationVariant.Visualizations) {
			const aVisualizations = presentationVariant.Visualizations;
			aVisualizations.map(oVisualization => {
				if (oVisualization.$target.term === UIAnnotationTerms.LineItem) {
					bHasTable = true;
				}
				if (oVisualization.$target.term === UIAnnotationTerms.Chart) {
					bHasChart = true;
				}
			});
		}
		return bHasChart && bHasTable;
	} else {
		return (
			presentationVariant &&
			presentationVariant.Visualizations &&
			!!presentationVariant.Visualizations.find(visualization => {
				return visualization.$target.term === UIAnnotationTerms.LineItem;
			})
		);
	}
}

export function getDefaultLineItem(entityType: EntityType): LineItem | undefined {
	return entityType.annotations.UI?.LineItem;
}
export function getDefaultChart(entityType: EntityType): Chart | undefined {
	return entityType.annotations.UI?.Chart;
}
export function getDefaultPresentationVariant(entityType: EntityType): PresentationVariantTypeTypes | undefined {
	return entityType.annotations?.UI?.PresentationVariant;
}

export function getDefaultSelectionVariant(entityType: EntityType): SelectionVariantTypeTypes | undefined {
	return entityType.annotations?.UI?.SelectionVariant;
}

export function getSelectionVariant(entityType: EntityType, converterContext: ConverterContext): SelectionVariantTypeTypes | undefined {
	const annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
	const selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);
	let selectionVariant;
	if (selectionPresentationVariant) {
		const selectionVariant = selectionPresentationVariant.SelectionVariant;
		if (selectionVariant) {
			return selectionVariant;
		}
	} else {
		selectionVariant = getDefaultSelectionVariant(entityType);
		return selectionVariant;
	}
}

export function getDataVisualizationConfiguration(
	visualizationPath: string,
	isCondensedTableLayoutCompliant: boolean,
	converterContext: ConverterContext
): DataVisualizationDefinition {
	const resolvedTarget = converterContext.getEntityTypeAnnotation(visualizationPath);
	const visualization = resolvedTarget.annotation as DataVisualizationAnnotations;
	converterContext = resolvedTarget.converterContext;
	let visualizationAnnotations: VisualizationAndPath[] = [];
	let presentationVariantAnnotation: PresentationVariantTypeTypes;
	let presentationPath: string = "";
	let chartVisualization, tableVisualization;
	const sTerm = visualization?.term;
	if (sTerm) {
		switch (sTerm) {
			case UIAnnotationTerms.LineItem:
			case UIAnnotationTerms.Chart:
				visualizationAnnotations.push({
					visualization: visualization as ActualVisualizationAnnotations,
					annotationPath: visualizationPath,
					converterContext: converterContext
				});
				break;
			case UIAnnotationTerms.PresentationVariant:
				presentationVariantAnnotation = visualization as PresentationVariantTypeTypes;
				visualizationAnnotations = visualizationAnnotations.concat(
					getVisualizationsFromPresentationVariant(
						visualization as PresentationVariantTypeTypes,
						visualizationPath,
						converterContext
					)
				);
				break;
			case UIAnnotationTerms.SelectionPresentationVariant:
				presentationVariantAnnotation = (visualization as SelectionPresentationVariantTypeTypes).PresentationVariant;
				// Presentation can be inline or outside the SelectionPresentationVariant
				presentationPath = presentationVariantAnnotation.fullyQualifiedName;

				if (!isPresentationCompliant(presentationVariantAnnotation)) {
					const entityType = converterContext.getEntityType();
					const defaultLineItemAnnotation = getDefaultLineItem(entityType) as LineItem;
					if (defaultLineItemAnnotation) {
						visualizationAnnotations.push({
							visualization: defaultLineItemAnnotation,
							annotationPath: converterContext.getRelativeAnnotationPath(
								defaultLineItemAnnotation.fullyQualifiedName,
								entityType
							),
							converterContext: converterContext
						});
					}
				} else {
					visualizationAnnotations = visualizationAnnotations.concat(
						getVisualizationsFromPresentationVariant(presentationVariantAnnotation, visualizationPath, converterContext)
					);
				}
				break;
			default:
				break;
		}
		visualizationAnnotations.map(visualizationAnnotation => {
			const { visualization, annotationPath, converterContext } = visualizationAnnotation;
			switch (visualization.term) {
				case UIAnnotationTerms.Chart:
					chartVisualization = createChartVisualization(
						visualization as ChartDefinitionTypeTypes,
						annotationPath,
						converterContext
					);
					break;
				case UIAnnotationTerms.LineItem:
				default:
					tableVisualization = createTableVisualization(
						visualization as LineItem,
						annotationPath,
						converterContext,
						presentationVariantAnnotation,
						isCondensedTableLayoutCompliant
					);
					break;
			}
		});
	} else {
		tableVisualization = createDefaultTableVisualization(converterContext);
		converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.MISSING_LINEITEM);
	}
	const aVisualizations: any = [];
	let sPath =
		sTerm === UIAnnotationTerms.SelectionPresentationVariant ? presentationPath : visualization && visualization.fullyQualifiedName;
	if (sPath === undefined) {
		sPath = "/";
	}
	if (chartVisualization) {
		aVisualizations.push(chartVisualization);
	}
	if (tableVisualization) {
		aVisualizations.push(tableVisualization);
	}
	return {
		visualizations: aVisualizations,
		annotationPath: converterContext.getEntitySetBasedAnnotationPath(sPath)
	};
}
