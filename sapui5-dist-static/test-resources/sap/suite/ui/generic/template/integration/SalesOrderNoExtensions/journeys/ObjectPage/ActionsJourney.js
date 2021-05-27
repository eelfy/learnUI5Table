sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Actions Journey");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);

		});
		opaTest("Create: Click the Create button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheCreateButton();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("4711")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("The table and search field is rendered correctly and i check no data text on both the tables present in OP", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No data found."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableProperties({"visible": true, "noDataText": "No contacts found."}, "responsiveTable", "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"SearchField": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Discard Creation: Click the Discard button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard");
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Avatar", {"visible": true, "src": "sap-icon://accept", "displayShape": "Square"});
		});

		opaTest("The Semantic actions are rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid", {"type": "Accept", "visible": true})
				.and
				.iCheckControlPropertiesById("edit", {"type": "Default", "visible": true});//Edit button is not Emphasized when criticality is defined for another action
		});

		opaTest("The table and search field is renderd correctly on object page", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"SearchField": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I fire the search and check the no-data text", function(Given, When, Then) {
			When.onTheObjectPage
				.iSearchInTableToolbarOrSearchInputField("Some random text which give 0 result", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No data found. Try adjusting the search or filter parameters."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I clear the search ", function(Given, When, Then) {
			When.onTheObjectPage
				.iSearchInTableToolbarOrSearchInputField("", "to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("I apply filters on both the tables present in object page and check no data text", function(Given, When, Then) {
			When.onTheObjectPage
				.iApplyFiltersOnOPTable()
				.and
				.iApplyFiltersOnOPTable('to_BPAContact');
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No data found. Try adjusting the search or filter parameters."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableProperties({"visible": true, "noDataText": "No contacts present. Adjust filters."}, "responsiveTable", "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Press the Share button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://action");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage of a Draft item", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000005"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://user-edit");
		});

		opaTest("Press the Draft-Info icon", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://user-edit");
			Then.onTheGenericObjectPage
				.iShouldSeeThePopoverWithTitle("Unsaved Changes");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the ObjectPage of a Draft item", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");
		});

		opaTest("I Check already applied filters present on the table", function(Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true, "noDataText": "No data found. Try adjusting the search or filter parameters."}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableProperties({"visible": true, "noDataText": "No contacts present. Adjust filters."}, "responsiveTable", "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Transient Message Dialog rendering TC-1", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid")
				.and
				.iClickTheButtonOnTheDialog("Set Opportunity 'ID");
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.Dialog", [{ "msg": "New Error Message", "description": "Error Message", "msgType": "Error", "persistent": true },
												{ "msg": "New Warning Message", "description": "Warning Message", "msgType": "Warning", "persistent": true} ,
												{ "msg": "New Information Message", "description": "Information Message", "msgType": "Information", "persistent": true }]);
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-2", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheMessageListItem("New Error Message");
			Then.onTheObjectPage
				.iCheckTheMessagePropertyInDetailedMessagesPage("New Error Message","Error Message","error");
		});

		opaTest("Transient Message Dialog rendering TC-3", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnPopoverButton("nav-back");
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-4", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickOnPopoverButton("message-Warning");
			Then.onTheObjectPage
				.iCheckMessageCountInTransientMessagesDialog(4);
		});

		opaTest("Transient Message Dialog rendering TC-5", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheMessageListItem("New Warning Message");
			Then.onTheObjectPage
				.iCheckTheMessagePropertyInDetailedMessagesPage("New Warning Message","Warning Message","warning");
		});

		opaTest("Press the Set Opportunity action button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Close")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");

			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("Cancel the dialog", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://nav-back");
		});

		opaTest("Back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://nav-back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
