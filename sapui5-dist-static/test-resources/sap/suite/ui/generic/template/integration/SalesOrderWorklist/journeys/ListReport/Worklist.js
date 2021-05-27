sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/SalesOrderWorklist/utils/OpaManifest"],
	function (opaTest, OpaManifest) {
		"use strict";

		QUnit.module("Sales Order Worklist");

		var oManifestJSONModel = OpaManifest.demokit["sample.stta.sales.order.worklist"];
		var oGenericApp = oManifestJSONModel.getProperty("/sap.ui.generic.app").pages["ListReport|C_STTA_SalesOrder_WD_20"];
		var bSmartVariantManagement = oGenericApp.component.settings.smartVariantManagement;
		var bEnableTableFilterInPageVariant = oGenericApp.component.settings.enableTableFilterInPageVariant;

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesorderwklt");
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(11);
		});

		opaTest("Searching for SalesOrder '500000003' in the Search Field should return 1 items", function (Given, When, Then) {
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("500000003");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(1);
		});

		opaTest("The Search with no Filter displays all items", function (Given, When, Then) {
			When.onTheListReportPage
				.iSearchInTableToolbarOrSearchInputField("");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(11);
		});

		opaTest("Check for personalisation buttons", function(Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"Sort": [true, true], "Group": [true, true], "Personalize": [true, true], "Showsinglemsg": [true, false]});
			if (!bSmartVariantManagement || (bSmartVariantManagement && bEnableTableFilterInPageVariant)) {
				Then.onTheListReportPage.iCheckTableToolbarControlProperty({"Filter": [true, true]});
			}
		});

		opaTest("Check for Export to Excel button", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://overflow");
			Then.onTheListReportPage
				.iShouldNotSeeTheExportToExcelButton();
			});

		opaTest("Check Sort Popup Dialog Comes Up", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://sort");
			Then.onTheListReportPage
				.iCheckSmartTableViewSettingsDialogProperty("Define Sorting");
			When.onTheListReportPage
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-persoController-P13nDialog-cancel");
		});

		opaTest("Check Grouping Popup Dialog Comes Up", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://overflow")
				.and
				.iClickTheButtonWithIcon("sap-icon://group-2");
			Then.onTheListReportPage
				.iCheckSmartTableViewSettingsDialogProperty("Define Groups");
			When.onTheListReportPage
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-persoController-P13nDialog-cancel");
		});

		// filter dialog should be available irrespective of smartvariant management in worklist
		opaTest("Check Filter Popup Dialog Comes Up", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://overflow")
				.and
				.iClickTheButtonWithIcon("sap-icon://filter");
			Then.onTheListReportPage
				.iCheckSmartTableViewSettingsDialogProperty("Define Filters");
			When.onTheListReportPage
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-persoController-P13nDialog-cancel");
		});

		opaTest("Check Column Settings Popup Dialog Comes Up", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://overflow")
				.and
				.iClickTheButtonWithIcon("sap-icon://action-settings");
			Then.onTheListReportPage
				.iCheckSmartTableViewSettingsDialogProperty("Define Column Properties");
			When.onTheListReportPage
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--listReport-persoController-P13nDialog-cancel");
		});

		opaTest("Check Visibility of Dialog and close the dialog", function(Given, When, Then) {
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(11);
			When.onTheListReportPage
				.iClickTheControlWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--addEntry");
			Then.onTheListReportPage
				.iCheckFieldsAndTitleOfCreateObjectDialog("New Sales order", ["Business Partner ID", "ISO Currency Code", "Confirmation Status", "SO Ordering Status", "Opportunity ID"]);
			Then.onTheGenericListReport
				.iShouldSeeTheButtonOnTheDialog("Create")
				.and
				.iShouldSeeTheButtonOnTheDialog("Cancel");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(11);
		});

		opaTest("Save data in dialog and check for table count", function(Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheControlWithId("sttasalesorderwklt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--addEntry")
				.and
				.iSetTheFieldValuesInsideCreateObjectDialog({"Business Partner ID":"100000008","ISO Currency Code":"EUR"});
			Then.onTheListReportPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Business Partner ID":"100000008","ISO Currency Code":"EUR"});
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Create");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object Created")
				.and
				.theAvailableNumberOfItemsIsCorrect(12);
			Then.iTeardownMyApp();
		});
	}
);
