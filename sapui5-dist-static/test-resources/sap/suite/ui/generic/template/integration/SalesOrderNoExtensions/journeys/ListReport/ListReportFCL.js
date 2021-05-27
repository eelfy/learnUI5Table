sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order No Extensions - FCL");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext", "manifestFCL");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted(3, true)
				.and
				.iShouldSeeTheNavigatedRowHighlighted(2, false);
		});

		opaTest("Check the Delete Object Dialog text in When the App is in Split Screen mode", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0])
				.and
				.iClickTheButtonWithId("template::ListReport::TableToolbar-overflowButton")
				.and
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000000 (SalesOrder)?");
		});

		opaTest("Check the Delete Object Dialog text in When the App is in Full Screen mode", function (Given, When, Then) {

			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			When.onTheGenericListReport
				.iClickTheButtonWithId("deleteEntry");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000000?");
			Then.iTeardownMyApp();
		});
	}
);
