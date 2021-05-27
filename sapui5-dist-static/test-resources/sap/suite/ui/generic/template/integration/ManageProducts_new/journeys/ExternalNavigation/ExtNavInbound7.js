sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("External Navigation Inbound 7: Filters");

		opaTest("Check default filter", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st#EPMProduct-manage_st");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters");
		});

		opaTest("Filter with CustomPriceFilter=500-1000", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: "HT-1000"})
				.and
				.iSelectTheFirstComboBox()
				.and
				.iSelectTheItemFromFirstComboBox("Price between 500-1000")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(1)
				.and
				.theAvailableNumberOfItemsIsCorrect(1)
				.and
				.iSeeTheButtonWithLabel("Adapt Filters (2)");
		});

		opaTest("Navigate external to the ObjectPage via button", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithLabel("Manage Products (ST)"); // HT-1000
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
		});

		opaTest("Navigate back to LR", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("Expand header: Same filter count", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn");
			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters (2)");
		});

		opaTest("Remove filters", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: ""})
				.and
				.iSetTheFilter({Field: "combobox", Value: ""}) // "CustomPriceFilter-combobox"
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters");
			Then.iTeardownMyApp();
		});
	}
);
