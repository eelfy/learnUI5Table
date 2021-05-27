sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("SUPPORT ASSISTANT - Sales Order No Extensions - List Report");

		opaTest("SUPPORT ASSISTANT - Starting the app without loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();
			Then.onTheListReportPage.iShouldSeeNoSupportAssistantErrors(); // checks for all rules, all severities on the app
			Then.onTheListReportPage.iShouldGetSupportRuleReport();
			Then.iTeardownMyApp();
		});
	}
);
