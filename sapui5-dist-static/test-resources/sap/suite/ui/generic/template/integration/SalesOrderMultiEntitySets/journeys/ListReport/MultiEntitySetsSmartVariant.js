sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report: Smart Variant");

		opaTest("#1: Smart Variant - rendering on start-up", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iLookAtTheScreen();
            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(false);
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			When.onTheListReportPage
				.iEnterValueInField("Date Range (Jan 1, 2020 - Dec 31, 2020)", "listReportFilter-filterItemControl_BASIC-CreatedDate");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(8, 1);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);
		});

		opaTest("#2: Smart Variant - Check for standard text displayed when Apply Automatically checkbox is not available", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheGenericListReport
				.iSeeTheDialogWithContent("For preset filters");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
		});

		opaTest("Check restricted filter parameters are not passed to the external App during external navigation", function (Given, When, Then) {
			When.onTheListReportPage
					.iEnterValueInField("Date Range (Jan 1, 2020 - Dec 31, 2020)", "listReportFilter-filterItemControl_BASIC-CreatedDate");	
			When.onTheGenericListReport
					.iSetTheFilter({Field: "CurrencyCode", Value: "EUR"})
					.and
					.iSetTheFilter({Field: "Product", Value: "HT-1003"})
					.and
					.iExecuteTheSearch()
					.and
					.iClickOnIconTabFilter("2");
				Then.onTheGenericListReport
					.theResultListContainsTheCorrectNumberOfItems(2, 2);
				When.onTheGenericListReport
					.iClickTheButtonHavingLabel("To SOWD");
				Then.onTheGenericListReport
					.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
				When.onTheGenericListReport
					.iSetTheHeaderExpanded(true);
				Then.onTheListReportPage
					.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", [])
					.and
					.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-Product", [])
					.and
					.iCheckForStringInAppUrl("CurrencyCode", false)
					.and
					.iCheckForStringInAppUrl("Product", false);
		});

		opaTest("Check that Navigation handler does not pass fields with only blank values in the SV of navigation context", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP()
				.and
				.iSetTheFilter({Field: "OpportunityID", Value: "<empty>"})
				.and
				.iExecuteTheSearch()
				.and
				.iClickOnIconTabFilter("2")
				.and
				.iSelectListItemsByLineNo([1], true, 2)
				.and
				.iClickTheButtonHavingLabel("To SOWD");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Sales Order w/o Extensions");
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-GrossAmount", [])//checking for blank fields
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-SalesOrder", ["=500000123"])//checking for non-empty field
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-OpportunityID", ["=<empty>"])//checking for manually set empty value
		});

		opaTest("Save as Tile - Static tile is created when Semantic date range value passed from smartfilterBar", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP()
				.and
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
				.iShouldSeeTheMessageToastWithText("Tile created.")
		});

		opaTest("Save as Tile - Dynamic tile created when Semantic date range value is not passed from smartfilterBar", function (Given, When, Then) {
			When.onTheListReportPage
				.iEnterValueInField("","listReportFilter-filterItemControl_BASIC-CreatedDate");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iClickTheButtonWithId("template::Share");
			Then.onTheListReportPage
				.iCheckTheServiceUrlIsSetInTheAddBookmarkButton(true);
			//Not checking the Save as tile pop up dialog and complete tile creation due to the existing console error in Demokit app
			Then.iTeardownMyApp();
		});
	}
);
