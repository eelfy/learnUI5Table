import { ActionType } from "../ManifestSettings";
import { EntityType } from "@sap-ux/annotation-converter";
import { AnnotationAction, BaseAction, ButtonType, getSemanticObjectMapping } from "sap/fe/core/converters/controls/Common/Action";
import { DataFieldForActionTypes, DataFieldForIntentBasedNavigationTypes } from "@sap-ux/vocabularies-types";
import { Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { ConverterContext } from "sap/fe/core/converters/templates/BaseConverter";
import { annotationExpression, compileBinding, not, equal, fn } from "sap/fe/core/helpers/BindingExpression";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { isPathDeletable } from "sap/fe/core/templating/DataModelPathHelper";

/**
 * Retrieve all the data field for actions for the identification annotation
 * They must be
 * - Not statically hidden
 * - Either linked to an Unbound action or to an action which has an OperationAvailable not statically false.
 *
 * @param {EntityType} entityType the current entitytype
 * @param {boolean} bDetermining whether or not the action should be determining
 * @returns {DataFieldForActionTypes[]} an array of datafield for action respecting the bDetermining property
 */
export function getIdentificationDataFieldForActions(entityType: EntityType, bDetermining: boolean): DataFieldForActionTypes[] {
	return (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		if (identificationDataField?.annotations?.UI?.Hidden?.valueOf() !== true) {
			if (
				identificationDataField?.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
				!!identificationDataField.Determining === bDetermining &&
				(!identificationDataField?.ActionTarget?.isBound ||
					identificationDataField?.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false)
			) {
				return true;
			}
		}
		return false;
	}) || []) as DataFieldForActionTypes[];
}

/**
 * Retrieve all the IBN actions for the identification annotation.
 * They must be
 * - Not statically hidden.
 * @param {EntityType} entityType the current entitytype
 * @param {boolean} bDetermining whether or not the action should be determining
 * @returns {DataFieldForIntentBasedNavigationTypes[]} an array of datafield for action respecting the bDetermining property.
 */
function getIdentificationDataFieldForIBNActions(entityType: EntityType, bDetermining: boolean): DataFieldForIntentBasedNavigationTypes[] {
	return (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		if (identificationDataField?.annotations?.UI?.Hidden?.valueOf() !== true) {
			if (
				identificationDataField?.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
				!!identificationDataField.Determining === bDetermining
			) {
				return true;
			}
		}

		return false;
	}) || []) as DataFieldForIntentBasedNavigationTypes[];
}

const IMPORTANT_CRITICALITIES = [
	"UI.CriticalityType/VeryPositive",
	"UI.CriticalityType/Positive",
	"UI.CriticalityType/Negative",
	"UI.CriticalityType/VeryNegative"
];
export function getHeaderDefaultActions(converterContext: ConverterContext): BaseAction[] {
	const entitySet = converterContext.getEntitySet();
	const oStickySessionSupported = entitySet && entitySet.annotations?.Session?.StickySessionSupported, //for sticky app
		oDraftRoot = entitySet && entitySet.annotations.Common?.DraftRoot,
		oEntityDeleteRestrictions = entitySet && entitySet.annotations?.Capabilities?.DeleteRestrictions,
		bUpdateHidden = entitySet && entitySet.annotations.UI?.UpdateHidden?.valueOf();
	const oDataModelObjectPath = converterContext.getDataModelObjectPath(),
		isParentDeletable = isPathDeletable(oDataModelObjectPath),
		bParentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;

	const headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), false);

	// First add the "Critical" DataFieldForActions
	const headerActions: BaseAction[] = headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) > -1;
		})
		.map(dataField => {
			return {
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				isNavigable: true
			};
		});

	// Then the edit action if it exists
	if ((oDraftRoot?.EditAction || oStickySessionSupported?.EditAction) && bUpdateHidden !== true) {
		headerActions.push({ type: ActionType.Primary, key: "EditAction" });
	}
	// Then the delete action if we're not statically not deletable
	if (
		(bParentEntitySetDeletable && bParentEntitySetDeletable !== "false") ||
		(oEntityDeleteRestrictions?.Deletable?.valueOf() !== false && bParentEntitySetDeletable !== "false")
	) {
		headerActions.push({ type: ActionType.Secondary, key: "DeleteAction", parentEntityDeleteEnabled: bParentEntitySetDeletable });
	}

	const headerDataFieldForIBNActions = getIdentificationDataFieldForIBNActions(converterContext.getEntityType(), false);

	headerDataFieldForIBNActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			const oNavigationParams = {
				semanticObjectMapping: dataField.Mapping ? getSemanticObjectMapping(dataField.Mapping) : []
			};

			if (dataField.RequiresContext?.valueOf() === true) {
				throw new Error("RequiresContext property should not be true for header IBN action : " + dataField.Label);
			} else if (dataField.Inline?.valueOf() === true) {
				throw new Error("Inline property should not be true for header IBN action : " + dataField.Label);
			}
			headerActions.push({
				type: ActionType.DataFieldForIntentBasedNavigation,
				text: dataField.Label?.toString(),
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				buttonType: ButtonType.Ghost,
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden?.valueOf()), true))),
				enabled:
					dataField.NavigationAvailable !== undefined
						? compileBinding(equal(annotationExpression(dataField.NavigationAvailable?.valueOf()), true))
						: true,
				key: KeyHelper.generateKeyFromDataField(dataField),
				isNavigable: true,
				press: compileBinding(
					fn("._intentBasedNavigation.navigate", [
						annotationExpression(dataField.SemanticObject),
						annotationExpression(dataField.Action),
						oNavigationParams
					])
				),
				customData: compileBinding({
					semanticObject: annotationExpression(dataField.SemanticObject),
					action: annotationExpression(dataField.Action)
				})
			} as AnnotationAction);
		});
	// Finally the non critical DataFieldForActions
	headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			headerActions.push({
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				isNavigable: true
			} as AnnotationAction);
		});

	return headerActions;
}

export function getHiddenHeaderActions(converterContext: ConverterContext): BaseAction[] {
	const entityType = converterContext.getEntityType();
	const hiddenActions = (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		return identificationDataField?.annotations?.UI?.Hidden?.valueOf() === true;
	}) || []) as DataFieldForActionTypes[];
	return hiddenActions.map(dataField => {
		return {
			type: ActionType.Default,
			key: KeyHelper.generateKeyFromDataField(dataField)
		};
	});
}

export function getFooterDefaultActions(viewLevel: number, converterContext: ConverterContext): BaseAction[] {
	const entitySet = converterContext.getEntitySet();
	const oStickySessionSupported = entitySet && entitySet.annotations?.Session?.StickySessionSupported, //for sticky app
		sEntitySetDraftRoot =
			entitySet && (entitySet.annotations.Common?.DraftRoot?.term || entitySet.annotations?.Session?.StickySessionSupported?.term),
		bConditionSave =
			sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" ||
			(oStickySessionSupported && oStickySessionSupported?.SaveAction),
		bConditionApply = viewLevel > 1,
		bConditionCancel =
			sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" ||
			(oStickySessionSupported && oStickySessionSupported?.DiscardAction);

	// Retrieve all determining actions
	const headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), true);

	// First add the "Critical" DataFieldForActions
	const footerActions: BaseAction[] = headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) > -1;
		})
		.map(dataField => {
			return {
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				isNavigable: true
			};
		});

	// Then the save action if it exists
	if (bConditionSave) {
		footerActions.push({ type: ActionType.Primary, key: "SaveAction" });
	}

	// Then the apply action if it exists
	if (bConditionApply) {
		footerActions.push({ type: ActionType.DefaultApply, key: "ApplyAction" });
	}

	// Then the non critical DataFieldForActions
	headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			footerActions.push({
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				isNavigable: true
			} as AnnotationAction);
		});

	// Then the cancel action if it exists
	if (bConditionCancel) {
		footerActions.push({
			type: ActionType.Secondary,
			key: "CancelAction",
			position: { placement: Placement.End }
		});
	}
	return footerActions;
}
