/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/comp/integration/testlibrary/CompTestLibrary"
], function(
	Opa5
) {
	"use strict";

	Opa5.extendConfig({
		autoWait: true,
		async: true,
		appParams: {
			"sap-ui-animation": false
		},
		testLibs: {
			compTestLibrary: {
				viewName: "applicationUnderTest.view.Main"
			}
		}
	});

	sap.ui.require([
		"applicationUnderTest/test/SelectionPanel01Journey"
	], function() {
		QUnit.start();
	});
});
