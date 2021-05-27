sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Mid Column FullScreen Navigation");

		// Due to small screen size FCLLayout parameter might be different than what is expected from FCL settings.
		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartMyAppInDemokit("sttasalesordersb", "manifestMidColumnFullScreen");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.iShouldSeeTheExcelButton();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000012"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.iShouldSeeTheSections(["Sales Order Items", "ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"exitFullScreen": true});
		});

		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckComboboxSelectedValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", "Greater than 3000 and Less than 5000 (2)")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [4], ["3,998.00 EUR"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3 and selected Item Changed", function (Given, When, Then) {
			When.onTheObjectPage
				.iSelectComboboxValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", 5);
			Then.onTheObjectPage
				.iCheckComboboxSelectedValue("ObjectPageTable:::VariantSelection:::sFacet::to_Item:3a:3acom.sap.vocabularies.UI.v1.LineItem", "Net Amount greater than  1000 and Tax Amount less than equal to 600 (3)")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [3, 4], ["3,736.60 USD", "3,140.00 USD"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true, "exitFullScreen": false});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl("TwoColumnsMidExpanded");
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsMidExpanded");
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
			Then.onTheGenericFCLApp
				.iCheckForFCLLayoutAppStateInUrl();
		});

		opaTest("Check FCL Layout", function (Given, When, Then) {
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");
			Then.iTeardownMyApp();
		});
	}
);
