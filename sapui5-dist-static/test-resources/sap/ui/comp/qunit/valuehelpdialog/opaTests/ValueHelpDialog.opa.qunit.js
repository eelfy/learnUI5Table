/* global QUnit */

sap.ui.require(
	[
		"sap/ui/test/Opa5",
		"sap/ui/comp/integration/testlibrary/CompTestLibrary"
	],
	function (Opa5) {
		"use strict";

		QUnit.config.testTimeout = 90000;

		Opa5.extendConfig({
			autoWait: true,
			testLibs: {
				compTestLibrary: {
					namespace: "test.sap.ui.comp.valuehelpdialog",
					viewName: "ValueHelpDialog",
					appUrl:
						"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/ValueHelpDialog.html"
				}
			}
		});

		sap.ui.require([
			"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/OpenCloseJourney",
			"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/ShowFiltersJourney",
			"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/UpdateCountInTabsJourney",
			"test-resources/sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/RemoveTokensJourney"
		], function() {
			QUnit.start();
		});
	}
);
