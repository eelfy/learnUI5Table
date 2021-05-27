sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Smart Link QuickView ");

		opaTest("Start the List Report and load data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st,EPMManageProduct-displayFactSheet#EPMProduct-manage_st");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Check for QuickView content on the Object Page", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(5);
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheObjectPage
				.iClickOnASmartLink("100000049 (Talpa)");
			Then.onTheObjectPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: FieldGroup_2");
		});

		opaTest("Check for QuickView clicking the title area link to navigate to external application", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheTitleAreaLinkOnTheSmLiQvPopover();
			Then.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "SEPMRA_C_PD_Product");
		});

		opaTest("Check for QuickView contact content on the Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP()
				.and
				.iClickTheLinkWithId("header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::WeightUnit::Field-sl");
			Then.onTheObjectPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: Contact 1");
		});

		opaTest("Click the QV link to navigate to external application", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheListReportPage
				.iClickOnACellInTheTable(1, "Supplier [SmLiQv]");
			Then.onTheListReportPage
				.theSmLiQvPopoverOpensAndContainsExtraContent("Label: FieldGroup_1");
		});

		opaTest("Click the QV link to navigate to external application", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheTitleAreaLinkOnTheSmLiQvPopover();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Back to main app", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
