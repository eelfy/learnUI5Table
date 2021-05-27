sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Canvas Page");

		opaTest("Starting the app, navigating to the Canvas Page and calling Extension API refreshAncestor()", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb", "manifestWithCanvas");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000000"});
			When.onTheObjectPage
				.iEnterValueInField("UpdatePath", "listReportFilter-filterItemControl_BASIC-SalesOrder");
			When.onTheObjectPage
				.iClickOnButtonWithText("RefreshAncestor");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Input", {"value": "SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true"});
		});

		opaTest("Use Canvas Page Extension API onCustomStateChange()", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("Details");
			When.onTheObjectPage
				.iClickOnButtonWithText("Save Icon Tab Bar State");
			When.onTheObjectPage
				.iClickTheControlWithId("Info");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000002"});
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.IconTabFilter", {"text": "Details"});
			Then.iTeardownMyApp();
		});
	}
);
