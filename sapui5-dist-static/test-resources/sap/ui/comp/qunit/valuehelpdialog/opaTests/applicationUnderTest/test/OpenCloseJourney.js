/* global QUnit */

sap.ui.require(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/pages/ValueHelpDialog"
	],
	function (opaTest) {
		"use strict";

		var sInputId = "valuehelpdialog---mainView--MI-mInput";

		QUnit.module("Initialization");

		opaTest("Initial Display", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);

			Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsOpenedForInput(sInputId);
		});

		opaTest("I close ValueHelpDialog", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iCloseValueHelpDialogForInput(sInputId);

			Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsNotOpenedForInput(sInputId);
		});

		opaTest("I close ValueHelpDialog with the 'OK' button", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iPressValueHelpDialogOKButton(sInputId);

			Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsNotOpenedForInput(sInputId);
		});

		opaTest("I close ValueHelpDialog with the 'Cancel' button", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iPressValueHelpDialogCancelButton(sInputId);

			Then.onTheValueHelpDialogPage.iCheckValueHelpDialogIsNotOpenedForInput(sInputId);

			Given.iStopMyApp();
		});
	}
);
