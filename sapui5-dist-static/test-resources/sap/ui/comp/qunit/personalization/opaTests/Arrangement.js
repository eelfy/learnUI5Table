/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/fl/FakeLrepConnectorLocalStorage"

], function(
	Opa5,
	FakeLrepConnectorLocalStorage
) {
	"use strict";

	return Opa5.extend("sap.ui.comp.qunit.personalization.test.Arrangement", {
		iEnableTheLocalLRep: function() {
			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
		},

		iClearTheLocalStorageFromRtaRestart: function() {
			window.localStorage.removeItem("sap.ui.rta.restart.CUSTOMER");
			window.localStorage.removeItem("sap.ui.rta.restart.USER");
		},
		iStartMyUIComponentInViewMode: function(sComponentName) {
			return this.iStartMyUIComponent({
				componentConfig: {
					name: sComponentName,
					async: true
				},
				hash: "",
				autowait: true
			});
		}
	});

}, true);
