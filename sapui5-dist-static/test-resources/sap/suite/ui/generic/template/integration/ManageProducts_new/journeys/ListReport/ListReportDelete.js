sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
	"use strict";

	QUnit.module("List Report Delete");

	opaTest("Delete 2 items at the same time", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("sttaproducts");
		When.onTheGenericListReport
			.iExecuteTheSearch();
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([3,6])
			.and
			.iClickTheButtonWithId("deleteEntry");
		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Delete (2)");
	});

	opaTest("Confirm dialog to delete 2 items", function (Given, When, Then) {
		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("Delete");
		Then.onTheGenericListReport
			.theAvailableNumberOfItemsIsCorrect(123);
	});

	opaTest("Delete 1 item with Draft", function (Given, When, Then) {
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0])
			.and
			.iClickTheButtonWithId("deleteEntry");
		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Delete")
			.and
			.iShouldSeeTheDialogWithContent("Delete product?");
		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("Delete");
		Then.onTheGenericListReport
			.theAvailableNumberOfItemsIsCorrect(122);
	});

	opaTest("Check Delete button status when selecting Locked item in table", function (Given, When, Then) {
		When.onTheListReportPage
			.iSelectAnItemOnLRTableWithStatus("Locked");
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]});
		Then.iTeardownMyApp();
	});

	opaTest("Disabled Delete button based on Deletable-Path", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("sttaproducts");
		When.onTheGenericListReport
			.iExecuteTheSearch();
		When.onTheListReportPage
			.iLookAtTheScreen()
			.and
			.iSetItemsToNotDeletableInTheTable([5, 3]);
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([5, 3]);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]});

		When.onTheListReportPage
			.iDeselectItemsInTheTable([5, 3])
			.and
			.iSetItemsToNotDeletableInTheTable([1]);
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0, 1]);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, true]});

		When.onTheListReportPage
			.iDeselectItemsInTheTable([0, 1])
			.and
			.iSetItemsToNotDeletableInTheTable([5]);
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([5, 3]);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]});

		When.onTheListReportPage
			.iDeselectItemsInTheTable([0, 1]);
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0]);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, true]});
		Then.iTeardownMyApp();
	});

	opaTest("Delete button and FE rendered column checks in the Grid Table", function (Given, When, Then) {
		Given.iStartMyAppInDemokit("sttaproducts", "manifestLRGridTable");
		When.onTheGenericListReport
			.iExecuteTheSearch();
		Then.onTheListReportPage
			.iCheckControlPropertiesById("listReport:::sSemanticObject::EPMProduct:::sAction::manage1", { "visible": true, "sortProperty": "", "filterProperty": "", "showFilterMenuEntry": false })
			.and
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, false]}, null, "gridTable");
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0]);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({"deleteEntry": [true, true]}, null, "gridTable");
		When.onTheGenericListReport
			.iClickTheButtonWithId("deleteEntry");
		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Delete");
	});

	opaTest("Navigate to OP and check FE rendered column properties on the Grid Table", function (Given, When, Then) {
		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("Cancel")
			.and
			.iNavigateFromListItemByLineNo(3);
		Then.onTheGenericObjectPage
			.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
		When.onTheGenericObjectPage
			.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
		Then.onTheObjectPage
			.iCheckControlPropertiesById("sSemanticObject::EPMProduct:::sAction::manage_st", { "visible": true, "sortProperty": "", "filterProperty": "", "showFilterMenuEntry": true })
			.and
			.iCheckControlPropertiesById("sProperty::Name:::sTarget::to_Product", { "visible": true, "sortProperty": "Name", "filterProperty": "Name", "showFilterMenuEntry": true })
		Then.iTeardownMyApp();
	});
});
