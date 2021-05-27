sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("CRUD Journey");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000010')", "manifestReuse");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("attachPageDataLoaded extension example")
				.and
				.theObjectPageHeaderTitleIsCorrect("500000010");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"dummyAction": [true, false], "deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check delete and custom action enablement on selection/deselection and Check for Delete Item Confirmation Pop up message when deleting an item from the object table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"dummyAction": [true, true], "deleteEntry": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"dummyAction": [true, false], "deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 30?");
		});

		opaTest("Click the Edit button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"dummyAction": [true, true], "deleteEntry": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Toggle between Disaplay and Cancel Mode- Check table toolbar delete action and custom action enablement", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"dummyAction": [true, false], "deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Change the Opportunity Id and Ordering Status fields in the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","1111");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrderID",
					Value : "500000010"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "1111"
				});
			When.onTheGenericObjectPage
				.iChoosetheItemInComboBox("Initial", "Ordering Status")
			Then.onTheObjectPage
				.iCheckControlPropertiesById("GeneralInformation::DeliveryStatus::Field-comboBoxEdit", {"visible": true, "value": "Initial"});
		});

		opaTest("Object Page Reuse Component Tests", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckSubsectionNameGroupedUnderSection("Reuse Group", ["Reuse Component bound to Root Object", "Reuse Component bound to Root Object 3"])
				.and
				.iCheckSubsectionNameGroupedUnderSection("General Information", ["General Information", "Reuse Component bound to Root Object 2"]);
		});

		opaTest("Click the save button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSaveTheDraft(true);
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theListReportPageIsVisible();
		});

		opaTest("Click the save button without changes", function (Given, When, Then) {
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrderID", Value:"500000010"});
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.")
				.and
				.theListReportPageIsVisible()
				.and
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"OpportunityID", Value:"1111"});
		});

		opaTest("SubObject Create with Dialog - Check the dialog and Cancel the Dialog", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrderID", Value:"500000010"});
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Order Items");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");
			Then.onTheObjectPage
				.iCheckFieldsAndTitleOfCreateObjectDialog("New Item", ["Product ID", "Int.Measurement Unit", "Quantity", "Currency", "Gross Amount", "Net Amount", "Tax Amount"]);
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonsOnTheDialog(["Create", "Cancel"]);
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});
		
		opaTest("SubObject Create with Dialog - Enter the field values and create the item", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");
			When.onTheObjectPage
				.iSetTheFieldValuesInsideCreateObjectDialog({"Product ID":"HT-1000", "Int.Measurement Unit":"EA", "Quantity":"1", "Currency":"EUR",
															"Gross Amount":"100", "Net Amount":"80", "Tax Amount":"20"});
			Then.onTheObjectPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Product ID":"HT-1000", "Int.Measurement Unit":"EA", "Quantity":"1.000", "Currency":"EUR",
															"Gross Amount":"100.00", "Net Amount":"80.00", "Tax Amount":"20.00"});
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Create");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Item created");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(8, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckRenderedColumnTextOnNthRowOfTable(8, [6,7,8,9,10,11], ["1.000 EA", "% (EA)", "EUR", "100.00 EUR", "80.00 EUR", "20.00 EUR"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("SubObject Create with Dialog - Navigation to SubObject is not maintained", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_BusinessPartner::com.sap.vocabularies.UI.v1.LineItem::Table-header", {"text":"BusinessPartner (56)"});
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_BusinessPartner::com.sap.vocabularies.UI.v1.LineItem::addEntry");
			Then.onTheObjectPage
				.iCheckFieldsAndTitleOfCreateObjectDialog("New BusinessPartner", ["Business Partner ID", "Company", "Legal Form", "Bus. Part. Role"]);
			When.onTheObjectPage
				.iSetTheFieldValuesInsideCreateObjectDialog({"Business Partner ID":"100000000", "Company":"SAP", "Legal Form":"AB", "Bus. Part. Role":"01"});
			Then.onTheObjectPage
				.iCheckTheFieldValuesInsideCreateDialogIsCorrect({"Business Partner ID":"100000000", "Company":"SAP", "Legal Form":"AB", "Bus. Part. Role":"01"});
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Create");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("BusinessPartner created");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_BusinessPartner::com.sap.vocabularies.UI.v1.LineItem::Table-header", {"text":"BusinessPartner (57)"});
			Then.iTeardownMyAppFrame();
		});
	}
);
