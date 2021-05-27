sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Delete");

		opaTest("Start the app and check the number of items", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(125);
		});

		opaTest("Navigate to the ObjectPage", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(3);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information","Sales Data","Sales Revenue"]);
		});

		opaTest("Scroll down to table and check for sticky header and toolbar", function(Given, When, Then) {
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 1100);
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.OverflowToolbar", {"visible": true})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Column", {"visible": true});
		});

		opaTest("Check user defined input field in toolbar breakout - Language filter", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("CustomFilter-Language", {"visible": true, "enabled":true});
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("EN","Language Filter");
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1], ["English (EN)"], "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iChoosetheItemInSelect("ZH","Language Filter");
			Then.onTheObjectPage
				.iCheckRenderedColumnTextOnNthRowOfTable(1, [1], ["Chinese (ZH)"], "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
            When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://overflow");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.DatePicker", {"visible": true, "enabled":true, "editable": true});
		});

		opaTest("Click the Delete button", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Delete");
		});

		opaTest("Confirm the delete action", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(124);
		});

		opaTest("Table toolbar Create button controlled via NavigationRestrictions - Path", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(0);
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"AddEntry": [true, true], "DeleteEntry": [true, false], "Validate": [true, true]}, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Create Button visibility on the OP during Edit Draft object which is not yet activated", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theButtonWithLabelIsEnabled("Create", true);
			Then.iTeardownMyApp();
		});
	}
);
