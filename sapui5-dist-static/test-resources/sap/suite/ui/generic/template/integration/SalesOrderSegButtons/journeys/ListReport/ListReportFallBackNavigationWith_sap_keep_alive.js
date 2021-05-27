sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Fallback navigation to LR: With sap-keep-alive property set to true");

		opaTest("Starting the app and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons", null, {sapKeepAlive: true});
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Navigate to Sub Object page in three column layout", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Navigate to Home page", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("shellAppTitle");
			When.onTheGenericObjectPage
				.iClickOnItemFromTheShellNavigationMenu("Home");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ushell.ui.shell.ShellAppTitle", { "visible": true, "text": "Home" });
		});

		opaTest("Do a back navigation and check page is in three column layout", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
		});

		opaTest("Close the 3rd column and navigate to two column layout", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Click on the Shell back button and check the fallback navigation to LR page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});

		opaTest("Starting the app and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons", null, {sapKeepAlive: true});
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Save as tile from the OP in two column layout - Check static tile is created", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("template::Share")
			Then.onTheObjectPage
				.iCheckTheServiceUrlIsSetInTheAddBookmarkButton(false);
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("bookmarkButton");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Tile created.");
		});

		opaTest("Close the two column and navigate to LR", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
		});

		opaTest("Go back to Home page and click on the newly created tile from the FLP", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("shellAppTitle");
			When.onTheGenericObjectPage
				.iClickOnItemFromTheShellNavigationMenu("Home");
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");
		});

		opaTest("Close the Object page column and check the fallback navigation to LR page", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			Then.iTeardownMyApp();
		});
	}
);
