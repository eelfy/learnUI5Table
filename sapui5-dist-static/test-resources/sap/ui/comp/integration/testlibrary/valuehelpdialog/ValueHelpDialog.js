/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/comp/integration/testlibrary/valuehelpdialog/ValueHelpDialogActions",
	"sap/ui/comp/integration/testlibrary/valuehelpdialog/ValueHelpDialogAssertions"
], function (Opa5, ValueHelpDialogActions, ValueHelpDialogAssertions) {
	"use strict";

	Opa5.extendConfig({
		// Define utility functions that can be used by user page objects
		testLibBase: {
			compTestLibrary: {
				actions: ValueHelpDialogActions,
				assertions: ValueHelpDialogAssertions
			}
		}
	});
});
