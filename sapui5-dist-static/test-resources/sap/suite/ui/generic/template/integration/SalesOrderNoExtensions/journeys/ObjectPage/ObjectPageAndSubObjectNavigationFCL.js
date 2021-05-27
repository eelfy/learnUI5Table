sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Navigations For Object Page and Sub Object Page - FCL");

		opaTest("Starting the app and loading the OP", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000001',DraftUUID=guid'00505691-2ec5-1ee6-b990-e386f7cdbdd3',IsActiveEntity=false)", "manifestFCL");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("ApplyButton: Navigate to Sub-Object page in 3 column layout and check the Apply button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithLabel("Apply");
		});

		opaTest("ApplyButton: Navigate Back to Object Page from Sub-Object Page", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Apply")
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001");
		});

		opaTest("Check the Delete Item Dialog text when the item is deleted from the OP table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20 (SalesOrderItem)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20?");
		});


		opaTest("Check the Delete Item Dialog text when the item is deleted from the Sub Object page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"})
				.and
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Schedule Lines", null, 2);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Schedule Lines", false, 2);
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete", "C_STTA_SalesOrderItem_WD_20");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 20 (SalesOrderItem)?");
		});

		opaTest("Check the Delete Object Dialog text when the Object is deleted from the Object page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard")
				.and
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000001 (SalesOrder)?");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000001?");
			Then.iTeardownMyApp();
		});

	}
);
