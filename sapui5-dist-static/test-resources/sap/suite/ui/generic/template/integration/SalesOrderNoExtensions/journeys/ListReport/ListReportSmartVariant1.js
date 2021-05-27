sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: Smart Variant 1");

		opaTest("#1: Smart Variant - rendering on start-up", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(false);
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartvariants.SmartVariantManagement", {"visible": true})
				.and
				.theCorrectSmartVariantIsSelected("Standard");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("#2: Smart Variant - changing Apply Automatically for standard variant", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSmartVariantViewSelection("template::PageVariant");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage");
			Then.onTheListReportPage
				.iCheckCheckboxSelectedValue("", "ageVariant-manage-exe-0", true);
			When.onTheListReportPage
				.iClickOnCheckboxWithText("", "ageVariant-manage-exe-0");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save")
				.and
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(0);
			Then.iTeardownMyApp();
		});

		opaTest("#3: Smart Variant - Change on applying search", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iSetTheSearchField("500000000");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("#4: Smart Variant - Creating a new Smart Variant with Apply Automatically false", function (Given, When, Then) {
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
		});

		opaTest("#5: Smart Variant - Switch Smart Variant back to standard and check table data", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true)
				.and
				.iSelectVariantByName("Standard", "PageVariant", true);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard", "PageVariant", true);
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(20);
		});

		opaTest("#6: Smart Variant - Check that the custom variant is loaded correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant", true);
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(0);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("#7: Smart Variant - Delete created variant", function (Given, When, Then) {
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
