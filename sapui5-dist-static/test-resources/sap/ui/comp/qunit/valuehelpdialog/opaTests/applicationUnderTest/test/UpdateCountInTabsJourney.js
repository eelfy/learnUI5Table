/* global QUnit */

sap.ui.require(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/pages/ValueHelpDialog"
	],
	function (opaTest) {
		"use strict";

		var sInputId = "valuehelpdialog---mainView--MI-mInput";

		QUnit.module("Tabs");

		opaTest( "1 items is selected from the items list and the count is in the tab title",
			function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
				When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
				When.onTheValueHelpDialogPage.iSearchByText("");
				When.onTheValueHelpDialogPage.iSelectItemByIndex(0);

				Then.onTheValueHelpDialogPage.iCheckItemIsSelected(0);
				Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(1);
			}
		);

		opaTest("Selecting 1 more item from the items list increases the count in the 'Search and Select' tab name",
			function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
				When.onTheValueHelpDialogPage.iSelectItemByIndex(1);

				Then.onTheValueHelpDialogPage.iCheckItemIsSelected(1);
				Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(2);
			}
		);

		opaTest( "Deselecting 1 item from the items list decreases the count in the 'Search and Select' tab name",
			function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenTabSearchAndSelect();
				When.onTheValueHelpDialogPage.iDeselectItemByIndex(1);

				Then.onTheValueHelpDialogPage.iCheckItemIsNotSelected(1);
				Then.onTheValueHelpDialogPage.iCheckSearchAndSelectTabTitleContainsCount(1);
			}
		);

		opaTest( "1 condition is selected and the count is in the tab title", function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
				When.onTheValueHelpDialogPage.iEnterConditionValues(0,"Test");
				When.onTheValueHelpDialogPage.iSelectConditionOperator(0,"EQ");

				Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(1);
				Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(1);
			}
		);

		opaTest(
			"Adding new condition increases the count in the 'Define Conditions' tab name",
			function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
				When.onTheValueHelpDialogPage.iAddNewCondition();
				When.onTheValueHelpDialogPage.iEnterConditionValues(1,"Test-2");
				When.onTheValueHelpDialogPage.iSelectConditionOperator(1,"EQ");

				Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(2);
				Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(2);
			}
		);

		opaTest( "Removing existing condition decreases the count in the 'Define Conditions' tab name",
			function (Given, When, Then) {
				Given.iEnsureMyAppIsRunning();

				When.onTheValueHelpDialogPage.iOpenTabDefineConditions();
				When.onTheValueHelpDialogPage.iRemoveConditionAtIndex(1);

				Then.onTheValueHelpDialogPage.iCheckConditionsCountEqualTo(1);
				Then.onTheValueHelpDialogPage.iCheckConditionsTabTitleContainsCount(1);

				Given.iStopMyApp();
			}
		);
	}
);
