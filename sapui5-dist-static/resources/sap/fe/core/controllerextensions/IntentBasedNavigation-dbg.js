sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function(
	ControllerExtension,
	OverrideExecution
) {
	"use strict";

	/**
	 * @class A generic IntentBasedNavigation controller extension to be consumed by controllers for navigating to the external application
	 *
	 * @name sap.fe.core.controllerextensions.IntentBasedNavigation
	 * @hideconstructor
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.IntentBasedNavigation", {
		metadata: {
			methods: {
				adaptNavigationContext: {
					"final": false,
					"public": true,
					overrideExecution: OverrideExecution.After
				}
			}
		},

		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.IntentBasedNavigation.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.IntentBasedNavigation.extend
		 * @function
		 */
		/**
		 * Customize the {@link sap.fe.navigation.SelectionVariant} being passed to this navigation.
		 *
		 * @function
		 * @param {sap.fe.navigation.SelectionVariant} oSelectionVariant SelectionVariant that the template has prepared
		 * @param {object} oTargetInfo SemanticObject and action of the target app
		 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#adaptNavigationContext
		 * @public
		 * @since 1.86.0
		 */
		adaptNavigationContext: function(oSelectionVariant, oTargetInfo) {
			// to be overriden by the application
		}
	});
});
