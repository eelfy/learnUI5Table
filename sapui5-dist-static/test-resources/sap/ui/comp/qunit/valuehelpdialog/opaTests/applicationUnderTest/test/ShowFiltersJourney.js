/* global QUnit */

sap.ui.require(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/pages/ValueHelpDialog"
	],
	function (opaTest) {
		"use strict";

		var sInputId = "valuehelpdialog---mainView--MI-mInput";
		var sInputIdSmartField = "valuehelpdialog---mainView--SF1-input";

		QUnit.module("FilterBar");

		opaTest("When Basic search is enabled the filters area is collapsed", function(Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();

			Then.onTheValueHelpDialogPage.iCheckFilterBarIsCollapsed();

			Given.iStopMyApp();
		});

		opaTest("When Basic search is disabled the filters area is expanded", function(Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputIdSmartField);

			Then.onTheValueHelpDialogPage.iCheckFilterBarIsExpanded();

			Given.iStopMyApp();
		});

		opaTest("FilterBar displays 2 filters", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iShowFilters();

			Then.onTheValueHelpDialogPage.iCheckFilterBarDisplaysNFilters(2);
		});

		opaTest("All filters are displayed", function (Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
			When.onTheValueHelpDialogPage.iShowFilters();

			Then.onTheValueHelpDialogPage.iCheckFilterBarDisplaysAllFilters();

			Given.iStopMyApp();
		});
	}
);
