sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.MicroProcessFlowSmartForm.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.MicroProcessFlowSmartForm.MicroProcessFlow",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					files: [
						"MicroProcessFlow.view.xml",
						"MicroProcessFlow.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Products.json"
					]
				}
			}
		}
	});
});
