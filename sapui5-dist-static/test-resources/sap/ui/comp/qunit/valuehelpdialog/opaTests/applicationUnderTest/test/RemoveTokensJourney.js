/* global QUnit */

sap.ui.require(
	[
		"sap/ui/test/opaQunit",
		"sap/ui/comp/qunit/valuehelpdialog/opaTests/applicationUnderTest/test/pages/ValueHelpDialog"
	],
	function (opaTest) {
		"use strict";

		var sInputId = "valuehelpdialog---mainView--MI-mInput";

		QUnit.module("Tokenizer");

		opaTest( "Should remove all tokens", function(Given, When, Then) {
			Given.iEnsureMyAppIsRunning();

			When.onTheValueHelpDialogPage.iOpenValueHelpDialogForInput(sInputId);
			When.onTheValueHelpDialogPage.iRemoveAllTokensFromValueHelpDialog();

			Then.onTheValueHelpDialogPage.iCheckTokensCountInValueHelpDialogEqualsTo(0);

			Given.iStopMyApp();
		});
	}
);
