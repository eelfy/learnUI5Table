/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(jQuery, UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.internal.chart.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {

			UIComponent.prototype.init.apply(this, arguments);
			FakeLrepConnectorLocalStorage.enableFakeConnector();
		},
		config: {
			sample: {
				stretch: true,
				files: [
					"Test.view.xml", "Test.controller.js"
				]
			}
		}
	});
});
