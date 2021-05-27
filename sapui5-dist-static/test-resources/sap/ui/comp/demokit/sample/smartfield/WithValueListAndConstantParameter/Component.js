sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode"
], function (UIComponent, MockServer, ODataModel, BindingMode) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfield.WithValueListAndConstantParameter.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartfield.WithValueListAndConstantParameter.Main",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: ["sap.m", "sap.ui.comp"]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Main.view.xml",
						"Main.controller.js",
						"Component.js",
						"mockserver/metadata.xml",
						"mockserver/Language.json",
						"mockserver/Main.json"
					]
				}
			}
		},
		init: function () {
			//initialize a mockserver
			this.oMockServer = new MockServer({
				rootUri: "smartfield.WithValueListAndConstantParameter.Main/"
			});

			//simulate the test data
			this.oMockServer.simulate(
				"test-resources/sap/ui/comp/demokit/sample/smartfield/WithValueListAndConstantParameter/mockserver/metadata.xml",
				"test-resources/sap/ui/comp/demokit/sample/smartfield/WithValueListAndConstantParameter/mockserver/");
			this.oMockServer.start();

			//define the model for the data, using the mockserver
			this.oModel = new ODataModel("smartfield.WithValueListAndConstantParameter.Main");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function () {
			if (this.oMockServer) {
				this.oMockServer.stop();
			}
			if (this.oModel) {
				this.oModel.destroy();
			}
			this.oMockServer = null;
			this.oModel = null;
		}
	});
});
