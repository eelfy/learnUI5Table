sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function(
	ControllerExtension,
	OverrideExecution
) {
	"use strict";

	/**
	 * @class A controller extension offering hooks into the routing flow of the application
	 *
	 * @name sap.fe.core.controllerextensions.Routing
	 * @hideconstructor
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.Routing", {
		metadata: {
			methods: {
				"onBeforeNavigation": { "public": true, "final": false, overrideExecution: OverrideExecution.After }
			}
		},

		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.Routing.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.Routing.extend
		 * @function
		 */

		/**
		 * This function can be used to intercept the routing event happening during the normal process of navigating from one page to another.
		 *
		 * If declared as an extension, it allows you to intercept and change the normal navigation flow.
		 * If you decide to do your own navigation processing, you can return `true` to prevent the default routing behavior.
		 *
		 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
		 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
		 *
		 * @param {object} oContextInfo Object containing row context and page context
		 * @returns {boolean} true to prevent the default execution, false to keep the standard behavior
		 * @alias sap.fe.core.controllerextensions.Routing#onBeforeNavigation
		 * @public
		 * @since 1.86.0
		 */
		onBeforeNavigation: function(oContextInfo) {
			// to be overriden by the application
			return false;
		}
	});
});
