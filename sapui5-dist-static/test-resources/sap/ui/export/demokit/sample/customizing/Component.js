sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.export.sample.customizing.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.export.sample.customizing.Spreadsheet",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Spreadsheet.view.xml",
						"Spreadsheet.controller.js",
						"../localService/metadata.xml"
					]
				}
			}
		}
	});
});
