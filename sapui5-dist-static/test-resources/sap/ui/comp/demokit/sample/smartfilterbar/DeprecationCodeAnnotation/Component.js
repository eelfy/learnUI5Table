sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.DeprecationCodeAnnotation.Component", {

		_oMockServer: null,

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartfilterbar.DeprecationCodeAnnotation.SmartFilterBar",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"SmartFilterBar.controller.js",
						"SmartFilterBar.view.xml",
						"mockserver/metadata.xml",
						"mockserver/LineItemsSet.json",
						"mockserver/VL_SH_H_T001.json"
					]
				}
			}
		},
		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
