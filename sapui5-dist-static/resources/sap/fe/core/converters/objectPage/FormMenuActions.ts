import { BaseAction } from "sap/fe/core/converters/controls/Common/Action";
import { FacetTypes } from "@sap-ux/vocabularies-types";
import { ConverterContext } from "sap/fe/core/converters/templates/BaseConverter";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { ConfigurableRecord, Position, Positionable } from "sap/fe/core/converters/helpers/ConfigurableObject";

enum ActionType {
	Default = "Default"
}
type ActionAfterExecutionConfiguration = {
	navigateToInstance: boolean;
	enableAutoScroll: boolean;
};
type ManifestAction = {
	menu?: string[];
	visible?: string;
	enabled?: string;
	position?: Position;
	press: string;
	text: string;
	enableOnSelect: string;
	requiresSelection?: boolean;
	afterExecution?: ActionAfterExecutionConfiguration;
};
type FormManifestConfiguration = {
	fields: ConfigurableRecord<ManifestFormElement>;
	actions?: BaseAction;
};
type ManifestFormElement = Positionable & {
	template: string;
	label?: string;
};
type FormMenuAction =
	| BaseAction
	| {
			visible?: string[];
			enabled?: string[];
			menu?: (string | BaseAction)[];
	  };

export const getVisibilityEnablementFormMenuActions = (actions: BaseAction[]): BaseAction[] => {
	let menuActionVisible: string | boolean,
		menuActionEnabled: string | boolean,
		menuActionVisiblePaths: string[],
		menuActionEnabledPaths: string[];
	actions.forEach((menuActions: FormMenuAction) => {
		menuActionVisible = false;
		menuActionEnabled = false;
		menuActionVisiblePaths = [];
		menuActionEnabledPaths = [];
		if (menuActions?.menu?.length) {
			menuActions?.menu?.forEach((menuItem: any) => {
				const menuItemVisible = menuItem.visible,
					menuItemEnabled = menuItem.enabled;
				if (!menuActionVisible) {
					if ((menuItemVisible && typeof menuItemVisible === "boolean") || menuItemVisible.valueOf() === "true") {
						menuActionVisible = true;
					} else if (menuItemVisible && menuItemVisible.valueOf() !== "false") {
						menuActionVisiblePaths.push("$" + menuItemVisible.valueOf());
					}
				}
				if (!menuActionEnabled) {
					if ((menuItemEnabled && typeof menuItemEnabled === "boolean") || menuItemEnabled.valueOf() === "true") {
						menuActionEnabled = true;
					} else if (menuItemEnabled && menuItemEnabled.valueOf() !== "false") {
						menuActionEnabledPaths.push("$" + menuItemEnabled.valueOf());
					}
				}
			});
			if (menuActionVisiblePaths.length) {
				menuActions.visible = menuActionVisiblePaths;
			} else {
				menuActions.visible = menuActionVisible;
			}
			if (menuActionEnabledPaths.length) {
				menuActions.enabled = menuActionEnabledPaths;
			} else {
				menuActions.enabled = menuActionEnabled;
			}
		}
	});
	return actions;
};

export const mergeFormActions = (
	source: ConfigurableRecord<ManifestAction>,
	target: ConfigurableRecord<ManifestAction>
): ConfigurableRecord<ManifestAction> => {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}
	return source;
};

export const getFormHiddenActions = (facetDefinition: FacetTypes, converterContext: ConverterContext): BaseAction[] => {
	const formActions: ConfigurableRecord<ManifestAction> = getFormActions(facetDefinition, converterContext) || [],
		annotations: any = converterContext?.getEntityType()?.annotations?.UI;
	const hiddenFormActions: BaseAction[] = [];
	for (const property in annotations) {
		if (annotations[property]?.$Type === "com.sap.vocabularies.UI.v1.FieldGroupType") {
			annotations[property]?.Data.forEach((dataField: any) => {
				if (
					dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
					formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)
				) {
					if (dataField?.annotations?.UI?.Hidden?.valueOf() === true) {
						hiddenFormActions.push({
							type: ActionType.Default,
							key: KeyHelper.generateKeyFromDataField(dataField)
						});
					}
				} else if (
					dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
					formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)
				) {
					if (dataField?.annotations?.UI?.Hidden?.valueOf() === true) {
						hiddenFormActions.push({
							type: ActionType.Default,
							key: KeyHelper.generateKeyFromDataField(dataField)
						});
					}
				}
			});
		} else if (
			annotations[property]?.term === "com.sap.vocabularies.UI.v1.Identification" ||
			annotations[property]?.term === "@com.sap.vocabularies.UI.v1.StatusInfo"
		) {
			annotations[property]?.forEach((dataField: any) => {
				if (
					dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
					formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)
				) {
					if (dataField?.annotations?.UI?.Hidden?.valueOf() === true) {
						hiddenFormActions.push({
							type: ActionType.Default,
							key: KeyHelper.generateKeyFromDataField(dataField)
						});
					}
				} else if (
					dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
					formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)
				) {
					if (dataField?.annotations?.UI?.Hidden?.valueOf() === true) {
						hiddenFormActions.push({
							type: ActionType.Default,
							key: KeyHelper.generateKeyFromDataField(dataField)
						});
					}
				}
			});
		}
	}
	return hiddenFormActions;
};

export const getFormActions = (facetDefinition: FacetTypes, converterContext: ConverterContext): ConfigurableRecord<ManifestAction> => {
	const manifestWrapper = converterContext.getManifestWrapper();
	let targetValue: string, manifestFormContainer: FormManifestConfiguration;
	let actions: ConfigurableRecord<ManifestAction> = {};
	if (facetDefinition?.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
		if (facetDefinition?.Facets) {
			facetDefinition?.Facets.forEach((facet: any) => {
				targetValue = facet?.Target?.value;
				manifestFormContainer = manifestWrapper.getFormContainer(targetValue);
				if (manifestFormContainer?.actions) {
					actions = mergeFormActions(manifestFormContainer?.actions as any, actions);
				}
			});
		}
	} else if (facetDefinition?.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
		targetValue = facetDefinition?.Target?.value;
		manifestFormContainer = manifestWrapper.getFormContainer(targetValue);
		actions = manifestFormContainer?.actions as any;
	}
	return actions;
};
