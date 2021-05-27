sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - List Report");

		opaTest("Starting the app and check default filters coming from Selection Variant", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-SegButtons");
			When.onTheGenericListReport
			    .iSetTheHeaderExpanded(true);
			When.onTheListReportPage
			    .iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode",  ["=EUR"]);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");	
		});

		opaTest("Click on segmented button 2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab2");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Click on segmented button 1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab1");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Click a draft link in the ListReport", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheLinkWithId("DraftObjectMarker-__clone3-link");
			Then.onTheGenericListReport
				.iShouldSeeThePopoverWithTitle("Draft");
		});

		opaTest("ApplicablePath - Select 3rd sales order and check extension button enablement", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iSelectListItemsByLineNo([0]);
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"EnabledStatus", Value:false})
				.and
				.theButtonWithIdIsEnabled("EnableExt")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable via Extension", false);
		});

		opaTest("ApplicablePath - Press Enable via Extension and check buttons and field", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("EnableExt");
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"EnabledStatus", Value:true})
				.and
				.theOverflowToolBarButtonIsEnabled("Enable via Extension", false)
				.and
				.theButtonWithIdIsEnabled("DisableExt");
		});

		opaTest("Click the unsaved changes link in the ListReport", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheLink("Unsaved Changes by Cristian Croitoru");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.m.Popover", {"title": "Unsaved Changes"});
		});

		opaTest("Create a new variant for the same filter field Currency Code", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "CurrencyCode", Value: ""})
				.and
				.iSetTheFilter({Field: "CurrencyCode", Value: "USD"})
				.and
				.iExecuteTheSearch();
		    Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(0);

			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Test", "template::PageVariant-name")
				.and
				.iClickOnCheckboxWithText("Set as Default", "PageVariant-default");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant", true);

			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Segmented Buttons in FCL"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant", true);

			When.onTheGenericListReport
			    .iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", ["USD"]);
				
		    When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(0);
			});

		opaTest("Switch back to Standard variant and check the filter field Currency Code", function (Given, When, Then) {
		    When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true)
				.and
				.iSelectVariantByName("Standard", "PageVariant", true)
				.and
				.iCheckTheMultiInputFieldValues("listReportFilter-filterItemControl_BASIC-CurrencyCode", ["=EUR"]);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
			    .and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");
		});

		opaTest("Delete the newly created variant", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);
			Then.iTeardownMyApp();
		});
	}
);
