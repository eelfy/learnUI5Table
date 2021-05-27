/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage', 'sap/ui/core/mvc/View'
], function(jQuery, UIComponent, FakeLrepConnectorLocalStorage, View) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.filterbar.sample2.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {

			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function() {
			UIComponent.prototype.exit.apply(this, arguments);
			FakeLrepConnectorLocalStorage.disableFakeConnector();
		},
		createContent: function() {
			this._bCalled = true;
			return this.oView;
		},
		_addContent: function(oView) {
			this.oView = oView;
			if (this._bCalled) {
				this.setAggregation("rootControl", oView);
			}
		}
	});
});
