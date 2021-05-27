sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Object Page");

		opaTest("Starting the app and Navigating to the Object Page", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb#/C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestWithoutReusable");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.SegmentedButton", {"visible": true, "enabled": true});
		});

        opaTest("Click on segmented button 2", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSegmentedButton("_tab2");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smarttable.SmartTable", {"visible": true});
        });

		opaTest("Click on segmented button 1", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSegmentedButton("_tab1");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smarttable.SmartTable", {"visible": true});
		});
		
		opaTest("OP beforeSaveExtension - Save action is not executed when the beforeSaveExtension logic is not successful", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			When.onTheObjectPage
				.iEnterValuesInCellsOnNthRowOfTable(1, [2], ["HT-1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("activate");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("BeforeSaveExtension");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel Save");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});
		
		opaTest("OP beforeSaveExtension - Save action is executed when the beforeSaveExtension logic is successful", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("activate");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("BeforeSaveExtension");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Continue to Save");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [2], ["HT-1000"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.iTeardownMyApp();
		});
	}
);
