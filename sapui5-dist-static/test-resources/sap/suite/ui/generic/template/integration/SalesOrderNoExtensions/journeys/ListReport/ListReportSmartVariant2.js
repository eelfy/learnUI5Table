sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: Smart Variant 2");

		opaTest("#1: Smart Variant - Change on applying search", function (Given, When, Then) {
			Given.iStartMyAppInSandboxWithNoParams("#STTASOWD20-STTASOWD20");
			When.onTheGenericListReport
				.iSetTheSearchField("500000000");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("#2: Smart Variant - Creating a new Smart Variant with Apply Automatically true", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnVariantById("PageVariant", true);
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");
			When.onTheListReportPage
				.iEnterValueInField("Test", "template::PageVariant-name")
				.and
				.iClickOnCheckboxWithText("Set as Default", "PageVariant-default")
				.and
				.iClickOnCheckboxWithText("Apply Automatically", "PageVariant-execute");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant", true);
		});

		opaTest("#3: Smart Variant - Check that the custom variant is loaded correctly", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			When.onTheFLPPage
				.iClickTheControlByControlType("sap.m.GenericTile", {"visible": true, "header": "Sales Order with Draft"});
			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test", "PageVariant", true);
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("#4: Smart Variant - Delete created variant", function (Given, When, Then) {
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
