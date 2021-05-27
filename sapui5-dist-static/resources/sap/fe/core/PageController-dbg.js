/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/core/BaseController",
		"sap/fe/core/controllerextensions/InternalRouting",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/PageReady"
	],
	function(Controller, InternalRouting, Routing, PageReady) {
		"use strict";

		/**
		 * @class Base controller class for your custom page used inside a SAP Fiori elements application.
		 *
		 * This controller provides preconfigured extensions that will ensure you have the basic functionalities required to use the macro.
		 *
		 * @hideconstructor
		 * @public
		 * @name sap.fe.core.PageController
		 * @since 1.88.0
		 */
		return Controller.extend("sap.fe.core.PageController", {
			routing: Routing,
			_routing: InternalRouting,
			pageReady: PageReady,

			/**
			 * @private
			 * @name sap.fe.core.PageController.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.PageController.extend
			 * @function
			 */

			onInit: function() {
				var oUIModel = this.getAppComponent().getModel("ui"),
					oInternalModel = this.getAppComponent().getModel("internal"),
					sPath = "/pages/" + this.getView().getId();

				oUIModel.setProperty(sPath, {
					controls: {}
				});
				oInternalModel.setProperty(sPath, {
					controls: {}
				});
				this.getView().bindElement({
					path: sPath,
					model: "ui"
				});
				this.getView().bindElement({
					path: sPath,
					model: "internal"
				});

				// for the time being provide it also pageInternal as some macros access it - to be removed
				this.getView().bindElement({
					path: sPath,
					model: "pageInternal"
				});
				this.getView().setModel(oInternalModel, "pageInternal");

				// as the model propagation happens after init but we actually want to access the binding context in the
				// init phase already setting the model here
				this.getView().setModel(oUIModel, "ui");
				this.getView().setModel(oInternalModel, "internal");
			},

			// FIXME: move this in the macro when possible
			_onTableRowPress: function(oContext, mParameters) {
				// In the case of an analytical table, if we're trying to navigate to a context corresponding to a visual group or grand total
				// --> Cancel navigation
				if (
					oContext &&
					oContext.isA("sap.ui.model.odata.v4.Context") &&
					typeof oContext.getProperty("@$ui5.node.isExpanded") === "boolean"
				) {
					return;
				} else {
					this._routing.navigateForwardToContext(oContext, mParameters);
				}
			}
		});
	}
);
