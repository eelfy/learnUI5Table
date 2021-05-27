/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/core/TemplateComponent", "sap/fe/macros/macroLibrary"],
	function(TemplateComponent, macroLibrary) {
		"use strict";

		var FPMComponent = TemplateComponent.extend("sap.fe.core.fpm.Component", {
			metadata: {
				properties: {
					"viewName": {
						type: "string"
					}
				},
				manifest: "json"
			}
		});
		return FPMComponent;
	},
	/* bExport= */ true
);
