sap.ui.define(['sap/ui/core/UIComponent'],
	function (UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.RadialMicroChartInGridTable.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.RadialMicroChartInGridTable.Page",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"Page.view.xml",
						"Page.controller.js",
						"SampleData.json"
					]
				}
			}
		}
	});

	return Component;
});
