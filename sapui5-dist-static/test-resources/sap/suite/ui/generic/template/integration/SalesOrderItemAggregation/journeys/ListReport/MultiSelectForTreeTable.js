sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Single Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestTreeTable");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.iShouldSeeTheExcelButton();
				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "treeTable", "TreeTable-_tab1");
			});

			opaTest("Checking the FE rendered column properties on the Tree Table", function (Given, When, Then) {
				When.onTheListReportPage
					.iLookAtTheScreen()
				Then.onTheListReportPage
					.iCheckControlPropertiesById("sAction::STTA_C_SO_ItemAggr", { "visible": true, "sortProperty": "", "filterProperty": "Category", "showFilterMenuEntry": false })
					.and
					.iCheckControlPropertiesById("sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "ProductId", "filterProperty": "", "showFilterMenuEntry": false })
					.and
					.iCheckControlPropertiesById("sProperty::SalesOrderId:::sSemanticObject::STTASOWD20:::sAction::STTASOWD20", { "visible": true, "sortProperty": "SalesOrderId", "filterProperty": "SalesOrderId", "showFilterMenuEntry": false })
					.and
					.iCheckControlPropertiesById("sTarget:::40com.sap.vocabularies.UI.v1.DataPoint:23Progress", { "visible": true, "sortProperty": "to_Product/Width", "filterProperty": "to_Product/Width", "showFilterMenuEntry": false });
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

			opaTest("Select another item and show selected", function (Given, When, Then) {
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


		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Multi Select", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestTreeTableMS");

				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "treeTable", "TreeTable-_tab1");
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


		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Multi Select with Limit", function () {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInDemokit("sttasalesorderitemaggr", "manifestTreeTableMSL");

				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.iCheckTableProperties({"visible": true}, "treeTable", "TreeTable-_tab1");
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
