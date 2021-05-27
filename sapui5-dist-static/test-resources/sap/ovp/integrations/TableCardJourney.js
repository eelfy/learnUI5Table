/*global QUnit */
// TableCardJourneys
sap.ui.define(["sap/ui/test/Opa5",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!	
		"test-resources/sap/ovp/integrations/pages/CommonArrangements",
		"test-resources/sap/ovp/integrations/pages/CommonActions",
		"test-resources/sap/ovp/integrations/pages/CommonAssertions"
	],
	function (Opa5, opaQunit, CommonArrangements, CommonActions, CommonAssertions) {
        "use strict";
        Opa5.extendConfig({
			arrangements: new CommonArrangements(),
			actions: new CommonActions(),
			assertions: new CommonAssertions(),
            autoWait: true,
            viewNamespace: "view."
		});
		
		opaQunit("Open app", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			Then.checkAppTitle("Procurement Overview Page");
		});
		opaQunit("Click on search", function (Given, When, Then) {
			When.iClickDropdownPopoverSearchFieldWithFilter('');
		});
		opaQunit("Check for the number of table cards present", function (Given, When, Then) {
			Then.checkForNumberOFTableCard();
		});
		opaQunit("Check for the title of table cards present", function (Given, When, Then) {
			Then.checkForTableCardTitle();
		});
        opaQunit("Check for the sub-title of table cards present", function (Given, When, Then) {
			Then.checkForTableCardSubTitle();
		});
		opaQunit("Check for the header count of table cards present", function (Given, When, Then) {
			Then.checkForTableCardHeaderCount();
		});
		opaQunit("Check value selection info", function (Given, When, Then) {
			Then.checkForTableCardValueSelectionInfo();
		});
		
		opaQunit("TableCard cell criticality", function (Given, When, Then) {
			Then.checkCriticalityForTableCard("card011");
		});
		opaQunit("Number of Columns in Table Card", function (Given, When, Then) {
			Then.checkForNumberOFColumnsInTableCard("card011");
		});
		opaQunit("TableCard Header Navigation", function (Given, When, Then) {
			When.iClickTheCardHeader("card011");
			Then.checkAppTitle("Sales Overview Page");
			When.iClickBackButton();
			Then.checkAppTitle("Procurement Overview Page");
		});
        // opaQunit("Row Navigation", function (Given, When, Then) {
		// 	When.iClickTheCardItem("card011", "ovpTable-0");
		// 	Then.iCheckRowAfterNav("card011");
		// 	Then.checkNavParams("P_DisplayCurrency", "EUR");
		// 	Then.checkNavParams("NetAmount", "16474");
		// 	Then.checkNavParams("CreatedAt", "2017-07-05");
		// 	Then.checkNavParams("LifecycleStatusDescription", "Approved");
		// 	Then.checkNavParams("CustomerID", "0100000008");
		// 	Then.checkNavParams("GrossAmount", "19895.16");
		// 	Then.checkNavParams("SalesOrderID", "0500000008");
		// 	Then.checkNavParams("SupplierName", "SAP");
		// 	Then.checkNavParams("CurrencyCode", "EUR");
		// });
		// opaQunit("Navigate back using back button", function (Given, When, Then) {
		// 	When.iClickBackButton();
		// 	Then.checkAppTitle("Procurement Overview Page");
		// });
		opaQunit("Close app", function (Given, When, Then) {
			// Arrangements
			Given.iTeardownMyApp();
			expect(0);
		});
})