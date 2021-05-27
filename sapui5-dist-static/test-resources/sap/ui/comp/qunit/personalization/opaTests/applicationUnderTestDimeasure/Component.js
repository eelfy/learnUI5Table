sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer',
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
],
	function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestDimeasure.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			var oMockServer = new MockServer({
				rootUri: "applicationUnderTestDimeasure/"
			});
			oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			oMockServer.start();

			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();

			// Save Variant
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestDimeasure00_table", {
				changeType: "table",
				conditions: {},
				content: {
					dimeasure: {
						chartTypeKey: "pie",
						dimeasureItems: [
							{
								columnKey: "ProductPicUrl",
								visible: true
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestDimeasure00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestDimeasure/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestDimeasure.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestDimeasure"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Contains ignoreFromPersonalisation property"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}
			});

			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_1611312095314_51_addFavorite",{"fileName":"id_1611312095314_51_addFavorite","fileType":"change","changeType":"addFavorite","moduleName":"","reference":"applicationUnderTestDimeasure.Component","packageName":"","content":{"key":"id_applicationUnderTestDimeasure00_table","visible":true},"selector":{"persistencyKey":"PKeyApplicationUnderTestDimeasure"},"layer":"USER","texts":{},"namespace":"apps/applicationUnderTestDimeasure/changes/","projectId":"applicationUnderTestDimeasure","creation":"2021-01-22T10:41:35.324Z","originalLanguage":"EN","support":{"generator":"Change.createInitialFileContent","service":"","user":"","sapui5Version":"1.87.0-SNAPSHOT","sourceChangeFileName":"","compositeCommand":"","command":""},"oDataInformation":{},"dependentSelector":{},"jsOnly":false,"variantReference":"","appDescriptorChange":false});


			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
