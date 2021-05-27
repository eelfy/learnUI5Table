sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report UI Changes");

		opaTest("#1: Starting the app, loading data and checking the Excel button", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet#STTASOWD20-STTASOWD20", null, {"sapTheme": "sap_belize", "bWithChange": true});
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://excel-attachment");
		});

		opaTest("#2: Click Business Partner link for external navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheLink("100000006");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("100000006");
		});

		opaTest("#3: Navigate back to Sales Order List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Check for Delete Object Confirmation Pop up message", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0]);
			When.onTheListReportPage
				.iClickTheControlWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000000?");
			Then.iTeardownMyApp();
		});
	}
);
