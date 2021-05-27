sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/BindingMode",
	'sap/ui/comp/navpopover/FakeFlpConnector'
], function (
	UIComponent,
	MockServer,
	ODataModel,
	BindingMode,
	FakeFlpConnector
) {
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_01_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'A'",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});

			//OData model contains the actual data for the smartfields, using the mockserver
			this.oMockServer = new MockServer({
				rootUri: "odata/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();
			this.oModel = new ODataModel("odata");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function(){
			FakeFlpConnector.disableFakeConnector();
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
