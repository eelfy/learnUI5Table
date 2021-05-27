sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("List Report Page Rendering - Smart Variant");

		opaTest("Smart Variant - Loading the app and checking smart variant", function (Given, When, Then) {

            Given.iStartMyAppInSandboxWithNoParams("#EPMProduct-manage_st");
			// actions
			When.onTheGenericListReport
				.iLookAtTheScreen();

            Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);

			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);

            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("0");

            When.onTheGenericListReport
                .iExecuteTheSearch();

            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("125");
        });

        opaTest("Smart Variant - changing Apply Automatically for standard variant", function (Given, When, Then) {

			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);

			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");

			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "ageVariant-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save")
                .and
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Manage Products (STTA)"});
			Then.onTheListReportPage
                .theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);

            Then.onTheGenericListReport
                .theAvailableNumberOfItemsIsCorrect("125")
                .and
                .iTeardownMyApp();
		});
	}
);
