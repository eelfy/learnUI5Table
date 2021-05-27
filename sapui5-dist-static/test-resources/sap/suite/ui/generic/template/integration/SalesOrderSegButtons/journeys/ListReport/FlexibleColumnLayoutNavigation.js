sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Navigation");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-SegButtons#SalesOrder-SegButtons", null, {"sapTheme": "sap_belize"});
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the main ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true});
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.m.Button", "ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--SalesOrderInfo", true);
		});


		opaTest("Change to fullscreen, close the column and open another item", function (Given, When, Then) {
			When.onTheGenericListReport
			// Header could be collapsed when window vertical size is very small and system starts to scroll
//				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
//				.and
				.iSetTheFilter({Field:"editStateFilter", Value:1})
				.and
				.iExecuteTheSearch();
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen")
				.and
				.iClickTheFCLActionButton("closeColumn")

			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"closeColumn": true});
		});

		opaTest("Maximize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"exitFullScreen": true});
		});

		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");
			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({"fullScreen": true});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
//				.and
//				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

/* Maximizing on SubObjectPage does not work if the winodow is too small which is the case when running in the test-suite.
 * In that case the maximize button is not visible which seems to be a bug

		opaTest("Maximize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

		opaTest("Minimize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});
*/
		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Navigate to Canvas page by clicking on an Custom Action onSalesOrderInfo", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("SalesOrderInfo");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");

			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.core.mvc.XMLView", {"viewName": "sap.suite.ui.generic.template.Canvas.view.Canvas"})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Page", {"Title": "Information for the Sales Order"})
				.and
				.iCheckControlPropertiesByControlType("sap.uxap.ObjectPageHeaderActionButton", {"text": "Full Screen"})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.layout.form.SimpleForm", {"visible": true})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.core.Title", {"text": "Look at the following information"})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Text", {"text": "Display"});
		});

		opaTest("Collapse/Expand the Sub-ObjectPage/Canvas", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsMidExpanded");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");

			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("FullScreen Close the Canvas page and app teardown", function (Given, When, Then) {
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("fullScreen");

			Then.onTheGenericFCLApp
				.iCheckFCLHeaderActionButtonsVisibility({exitFullScreen: true, closeColumn: true})
				.and
				.iCheckFCLLayout("EndColumnFullScreen");

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("ThreeColumnsEndExpanded");

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsMidExpanded");

			Then.iTeardownMyApp();
		});

	}
);
