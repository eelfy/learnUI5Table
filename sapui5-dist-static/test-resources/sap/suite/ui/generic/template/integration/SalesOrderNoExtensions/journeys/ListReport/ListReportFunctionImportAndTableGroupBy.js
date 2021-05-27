sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report");

		opaTest("#1: Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line: 2, Field: "TaxAmount", Value: "899.08"})
				.and
				.theResultListFieldHasTheCorrectValue({Line: 11, Field: "CurrencyCode", Value: "USD"});
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(12, [1, 7], ["500000011", "United States Dollar (USD)"]);
		});

		opaTest("#2: Parameter-Dialog - Select a draft item and press the action", function (Given, When, Then) {
			When.onTheListReportPage
				.iSelectAnItemOnLRTableWithStatus("Draft")
				.and
				.iClickTheControlWithId("Setopportunityid");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("#3: Parameter-Dialog - Wait for the dialog and press the cancel button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("#4: Parameter-Dialog - Select multiple items and press the action", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([7,8]);
			When.onTheListReportPage
				.iClickTheControlWithId("Setopportunityid");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("#5: Parameter-Dialog - Wait for the dialog and press the cancel button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("#6: ApplicablePath - Select 3rd sales order and check button enablement", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2]);
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:false})
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable", false);
		});

		opaTest("#7: ApplicablePath - Press Enable and check buttons and field", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus");
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:true})
				.and
				.theOverflowToolBarButtonIsEnabled("Enable", false)
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setdisabledstatus");
		});

		opaTest("Button is enabled without selection", function (Given, When, Then) {
			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");
		});

		opaTest("Context independent action is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Context independent determining action is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Select an item, then check if button is enabled", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo(1);
			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple")
		});

		opaTest("Context independent action is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Context independent determining action is triggered", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("#16: List Report Table Group By 'Sales Order Id'", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("Sales Order ID")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckGroupHeaderTitleOnTable("Sales Order ID: 500000004", 5);
		});

		opaTest("#17: List Report Table Group By 'Created At'", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("Created At")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckGroupHeaderTitleOnTable("Created At:", 1);
		});

		opaTest("#18: List Report Table Group By '(None)'", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("(none)")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
