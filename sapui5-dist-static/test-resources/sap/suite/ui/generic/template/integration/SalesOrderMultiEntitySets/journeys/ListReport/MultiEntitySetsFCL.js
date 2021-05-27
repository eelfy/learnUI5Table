sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report - FCL");

		opaTest("Save as Tile - Static tile is created when useDateRange is set to true in the manifest for smartfilterBar", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews", "manifestWithFCL");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share");
			Then.onTheListReportPage
				.iCheckTheServiceUrlIsSetInTheAddBookmarkButton(false);
			When.onTheGenericListReport
				.iClickTheButtonWithId("bookmarkButton");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Save as Tile");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Tile created.");
		});

		opaTest("Internal Navigation to OP1-Tab1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(2, 1);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Internal Navigation to OP2-Extension", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 1);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("I_AIVS_Confirm_Status");
		});

		opaTest("Internal Navigation to OP3-Tab2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 2);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
		});

		opaTest("Create OP for EntitySet2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheControlWithId("template::ListReport::TableToolbar-2-overflowButton")
				.and
				.iClickTheControlWithId("addEntry-2");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
		});

		opaTest("Create OP for EntitySet1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iClickTheControlWithId("template::ListReport::TableToolbar-1-overflowButton")
				.and
				.iClickTheControlWithId("addEntry-1");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
			Then.iTeardownMyApp();
		});
	}
);
