sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForAnalyticalTable: Single Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestAnalyticalTable");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.iShouldSeeTheExcelButton();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "analyticalTable", "AnalyticalTable-_tab1");
			});

			opaTest("Checking the FE rendered column properties on the Analytical Table", function (Given, When, Then) {
				When.onTheListReportPage
					.iLookAtTheScreen()
				Then.onTheListReportPage
					.iCheckControlPropertiesById("sAction::STTA_C_SO_ItemAggr", { "visible": true, "sortProperty": "", "filterProperty": "Category", "showFilterMenuEntry": true })
					.and
					.iCheckControlPropertiesById("sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "ProductId", "filterProperty": "", "showFilterMenuEntry": true })
					.and
					.iCheckControlPropertiesById("sProperty::SalesOrderId:::sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "SalesOrderId", "filterProperty": "SalesOrderId", "showFilterMenuEntry": true })
					.and
					.iCheckControlPropertiesById("sTarget:::40com.sap.vocabularies.UI.v1.DataPoint:23Progress", { "visible": true, "sortProperty": "to_Product/Width", "filterProperty": "to_Product/Width", "showFilterMenuEntry": true });
			});

			opaTest("Navigating to Object page from LR with Analytical Table", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(0, "listReport-_tab1");
				Then.onTheGenericObjectPage
					.theObjectPageIsInDisplayMode();
				When.onTheGenericObjectPage
					.iNavigateBack();
				Then.onTheGenericListReport
					.theResultListIsVisible();
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");
				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select one and then another item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iSelectListItemRange(10, 10, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Close dialog", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForAnalyticalTable: Multi Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestAnalyticalTableMS");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "analyticalTable", "AnalyticalTable-_tab1");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select multiple items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectListItemRange(0, 1, "_tab1")
					.and
					.iSelectListItemRange(5, 9, "_tab1")
					.and
					.iSelectListItemRange(11, 13, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"});
			});

			opaTest("Select all items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectAllListItems("_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (182)"}); // all items
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForAnalyticalTable: Multi Select with Limit", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestAnalyticalTableMSL");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "analyticalTable", "AnalyticalTable-_tab1");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (1)"});
			});

			opaTest("Select multiple items below limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 9, "_tab1") // 10 items (limit)
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"});
			});

			opaTest("Select multiple items above limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 10, "_tab1") // 11 items
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (10)"}); // limited to 10
			});

			opaTest("Select multiple items above limit several times and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(1, 11, "_tab1") // 11 items, only 10 will be selected
					.and
					.iSelectListItemRange(13, 23, "_tab1") // 11 items, only 10 will be selected
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.iCheckControlPropertiesByControlType("sap.m.List", {"headerText": "Sales Order Items (20)"}); // limited to 2*10
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");

				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.iTeardownMyApp();
			});
		});
	}
);
