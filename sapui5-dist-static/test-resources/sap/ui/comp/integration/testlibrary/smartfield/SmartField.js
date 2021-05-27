/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/comp/integration/testlibrary/smartfield/SmartFieldActions",
	"sap/ui/comp/integration/testlibrary/smartfield/SmartFieldAssertions"
], function (Opa5, SmartFieldActions, SmartFieldAssertions) {
	"use strict";

	Opa5.extendConfig({
		// Define utility functions that can be used by user page objects
		testLibBase: {
			compTestLibrary: {
				actions: SmartFieldActions,
				assertions: SmartFieldAssertions
			}
		}
	});
});
