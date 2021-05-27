sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Table Toolbar Buttons in Object Page");

		opaTest("The 'Delete' button in Object Page Tables is initially not visible", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "responsiveTable", "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"deleteEntry": [false, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The Excel export button is rendered for the table when Copy & Paste is available - Display Mode ", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true });
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' 'Paste' button enabled", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonHavingLabel("Sales Order Items");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckTableToolbarControlProperty({"pasteEntries": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The 'Paste' button in Object Page Tables is visible and Info dialog seen when pressed", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::pasteEntries");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Information")
				.and
				.iShouldSeeTheDialogWithContent("To paste in this browser, use the keyboard shortcut Ctrl+V (for Windows) or Cmd+V (for Mac).");
		});

		opaTest("The Excel export button is rendered for the table when Copy & Paste is available - Edit Mode ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheDialogButtonWithLabel("OK");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-btnExcelExport", { "icon": "sap-icon://excel-attachment", "visible": true, "enabled": true });
		});

		opaTest("The 'Delete' button in Object Page Tables is enabled after selecting an item", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([1], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The 'Delete' button in Object Page Tables is not visible after pressing 'Cancel'", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([1], false, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [false, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The 'Delete' button in Object Page Tables is visible and disabled after pressing 'Edit' again", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("The SmartmultiInput and smart toggle field is rendered on the Object page table", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCancelTheDraft(true);
			Then.onTheObjectPage
				.iCheckRenderedColumnControlTypeOnNthRowOfTable(3, [1, 3], ["sap.ui.comp.SmartToggle", "sap.ui.comp.smartmultiinput.SmartMultiInput"], "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check the table entries are marked which contains error", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSelectSectionOrSubSectionByName("General Information")
				.and
				.iSetTheObjectPageDataField("Amount", "CurrencyCode", "abcdefg");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "1", "type": "Negative", "icon": "sap-icon://message-error" });
			When.onTheObjectPage
				.iToggleMessagePopoverDialog()
				.and
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Error Message 1", "msgType": "Error", "fullTarget": "/to_Item(SalesOrder='500000000',SalesOrderItem='100',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "persistent": false },
												{ "msg": "Error Message 1", "msgType": "Error", "fullTarget": "/to_Item(SalesOrder='500000000',SalesOrderItem='80',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "persistent": false }])
				.and
				.iCloseMessagePopover();
			Then.onTheObjectPage
				.iShouldSeeTheRowHighlighted("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0, "Error")
				.and
				.iShouldSeeTheRowHighlighted("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 2, "Error");
		});

		opaTest("Check the error rows are filtered after clicking on the Filter Items link on the message strip", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckMessageStripValueOnTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "Error", "The table contains errors.")
				.and
				.iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheLink("Filter Items");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(2, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-infoToolbarText", { "visible": true, "text": "Filtered By: Errors" });
		});

		opaTest("Check the error row filtering is removed after clicking on the Clear Filter link on the message strip", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("Clear Filter");
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(10, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.iTeardownMyApp();
		});

		QUnit.module("Table Variants in Object Page");

		opaTest("#1: Starting the app, loading data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet,SalesOrder-MultiViews#STTASOWD20-STTASOWD20", "manifestVariantManagementOnObjectPage", {"sapTheme": "sap_belize"});
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("#2: Navigate to ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Sales Order Items");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageTableFieldHasTheCorrectValue("to_Item", {
					Line   : 0,
					Field  : "SalesOrderItem",
					Value : "100"
				});
		});

		/* do not create a new variant but work on an existing one */
		opaTest("#3: Sort the item list", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Sort")
				.and
				.iChoosetheItemInComboBox("Item Position")
				.and
				.iClickTheButtonHavingLabel("OK");

			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-modified");
		});

		opaTest("#4: Save the variant", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-trigger")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-saveas")
				.and
				.iSetTheInputFieldWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-name", "Sorted")
				.and
				.iClickTheButtonOnTheDialog("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted");
		});

		opaTest("#5: External navigation to EPM Manage Products ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("HT-1010");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
		});

		opaTest("#6: Navigate back to Sales Order Object Page and check the Table variant name is retained", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted");
		});

		opaTest("#7:Select a different record on LR Page and navigate to Object Page - Check Table variant name", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Sales Order Items");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("#8:External navigation to the OP of MultiEntity App - OP having Entity set other than main entity", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([6], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::action::SalesOrder::MultiViews");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("20");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrderItem_WD_20");
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SalesOrder_WD_20");
		});

		opaTest("#9:Delete the newly created Table variant ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSmartVariantViewSelection("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-trigger")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table-variant-manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard");
			Then.iTeardownMyApp();
		});

	}
);
