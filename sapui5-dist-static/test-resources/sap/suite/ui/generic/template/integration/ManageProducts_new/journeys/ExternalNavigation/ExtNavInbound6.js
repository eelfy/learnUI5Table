sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("External Navigation Inbound 6");

		opaTest("Check Related Apps and UnavailableActions on Object Page", function(Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMProduct-manage_st#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(0);
			When.onTheGenericObjectPage
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedApps");
			Then.onTheObjectPage
				.iCheckRelatedAppsSheetList(true, ["Trace Navigation Parameters"])
				.and
				.iCheckRelatedAppsSheetList(true, ["STTA w/o Extension"])
				.and
				.iCheckRelatedAppsSheetList(false, ["EPM"])
				.and
				.iCheckRelatedAppsSheetList(false, ["Trace Navigation Parameters - Beta Version"]);
		});

		opaTest("Check the navigation to the Related app from the list of related apps", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateToRelatedApp(0);
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
		});

		opaTest("Check Related Apps and UnavailableActions on Sub-Object Page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(3);
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 500);
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_ProductText", 0)
				.and
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_ProductText--relatedApps");
			Then.onTheObjectPage
				.iCheckRelatedAppsSheetList(false, ["Trace Navigation Parameters"])
				.and
				.iCheckRelatedAppsSheetList(true, ["STTA w/o Extension"])
				.and
				.iCheckRelatedAppsSheetList(false, ["EPM"])
				.and
				.iCheckRelatedAppsSheetList(true, ["Trace Navigation Parameters - Beta Version"]);
			Then.iTeardownMyApp();
		});
	}
);
