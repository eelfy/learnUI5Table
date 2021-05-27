sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report with copy and multi edit functionality");

		opaTest("Starting the app and loading data, check MultiEdit Action Enablement", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestWithCopyBreakout");
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
		});

		opaTest("Check MultiEdit Action Enablement based on updatable and non updatable records selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, true]});
			When.onTheListReportPage
				.iDeselectItemsInTheTable([0, 1]);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], true);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, false]});
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0, 1, 3], true); //Item at index 3 is not updatable
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"MultiEdit": [true, true]});
		});

		opaTest("Launch the Multi Edit Dialog and check Cancel", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheButtonsOnTheDialog(["Edit", "Cancel"])
				.and
				.iShouldSeeTheDialogWithContent("1 of 3 objects cannot be edited. Do you still want to edit the remaining 2 objects?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheListReportPage
				.iCheckTheRowSelectionInTheTable([
					{Index:0,Selected:true}, 
					{Index:1,Selected:true}, 
					{Index:2,Selected:false}, 
					{Index:3,Selected:true}
				]);
		});

		opaTest("Launch the Multi Edit Dialog and verify the Multi Edit Dialog and it's components", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportAction:::MultiEdit");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Edit");
			Then.onTheListReportPage
				.iVerifyTheMultiEditDialogAttributesAreCorrect("Edit 2 Objects",["BusinessPartnerID", "CurrencyCode", "GrossAmount", "NetAmount",
			"TaxAmount", "LifecycleStatus", "BillingStatus", "DeliveryStatus", "OpportunityID"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonsOnTheDialog(["Save", "Cancel"]);
		});

		opaTest("Launch the Multi Edit Dialog and change properties and validate save", function (Given, When, Then) {
			When.onTheListReportPage
				.iSetSmartMultiEditField([
					{Choice:"Replace",PropertyName:"BusinessPartnerID",Value:"100000011"}, 
					{Choice:"Keep",PropertyName:"CurrencyCode"}, 
					{Choice:"Index",PropertyName:"GrossAmount",Value:2}, 
					{Choice:"Index",PropertyName:"NetAmount",Value:3}, 
					{Choice:"Replace",PropertyName:"TaxAmount",Value:"30"},
					{Choice:"Clear",PropertyName:"LifecycleStatus"},
					{Choice:"Keep",PropertyName:"BillingStatus"},
					{Choice:"Replace",PropertyName:"DeliveryStatus",Value:"Initial"},
					{Choice:"Index",PropertyName:"OpportunityID",Value:4}
				]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
					["100000011", "500000010", "Peseta (777)", "15,637.790", "12,271.000", "30.000", "New", "Initial (P)", "Initial", "TEST SHARON"]);

			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(2, [1,2,3,4,5,6,7,8,9,10], 
					["100000011", "500000011", "Peseta (E1E)", "15,637.790", "12,271.000", "30.000", "New", "Initial (P)", "Initial", "TEST SHARON"]);

			Then.onTheListReportPage
				.iCheckRenderedColumnTextOnNthRowOfTable(4, [1,2,3,4,5,6,7,8,9,10], 
					["100000006", "500000013", "Peseta (EUR)", "1,704.040", "1,431.970", "272.070", "New (C)", "Initial (P)", "Initial (D)", "123"]);
		});

		opaTest("Check for Delete Object Confirmation Pop up message", function (Given, When, Then) {
			When.onTheListReportPage
				.iDeselectItemsInTheTable([0, 1, 3]);
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2])
				.and
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000012?");
		});

		opaTest("Copy the third line", function (Given, When, Then) {
			// Cancel the Delete Object Confirmation pop up
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheButtonWithId("Copy");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("<Unnamed Object>");

			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field: "BusinessPartnerID",
					Value: "100000005"
				})
				.and
				.iTeardownMyApp();
		});
	}
);
