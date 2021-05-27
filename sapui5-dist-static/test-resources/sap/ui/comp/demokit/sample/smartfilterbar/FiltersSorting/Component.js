sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer'
], function(UIComponent, FakeLrepConnectorLocalStorage, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.FiltersSorting.Component", {

		_oMockServer: null,

		metadata: {
			rootView: {
			 "viewName": "sap.ui.comp.sample.smartfilterbar.FiltersSorting.SmartFilterBar",
			   "type": "XML",
			  "async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.ui.comp" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"SmartFilterBar.view.xml",
						"SmartFilterBar.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Items.json"
					]
				}
			}
		},
		constructor: function () {
			sap.ui.core.UIComponent.prototype.constructor.apply(this, arguments);
			sap.ui.fl.FakeLrepConnectorLocalStorage.enableFakeConnector();

			//Start Mockserver
			this._oMockServer = new MockServer({
				rootUri: "/MockDataService/"
			});
			var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar/FiltersSorting/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"Items"
				]
			});
			this._oMockServer.start();
		},

		destroy: function() {
			sap.ui.fl.FakeLrepConnectorLocalStorage.disableFakeConnector();
			sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);

			this._oMockServer.stop();
		}
	});
});