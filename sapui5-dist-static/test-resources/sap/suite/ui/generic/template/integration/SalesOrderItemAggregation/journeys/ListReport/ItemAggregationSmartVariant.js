sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation LR - Smart Variant");

		opaTest("Smart Variant - Loading the app and checking smart variant", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-itemaggregation");
			When.onTheGenericListReport
				.iLookAtTheScreen();
            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect("0", "_tab1");
            When.onTheGenericListReport
                .iExecuteTheSearch();
            Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(182,"_tab1");
        });

        opaTest("Smart Variant - Check for standard text displayed when Apply Automatically is not available", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheGenericListReport
				.iSeeTheDialogWithContent("For preset filters");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
            Then.iTeardownMyApp();
		});
	}
);
