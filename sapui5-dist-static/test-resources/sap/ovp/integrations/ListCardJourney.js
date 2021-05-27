/*global opaTest QUnit */
//ListCard Journey
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
		opaQunit("Number of lists Cards", function (Given, When, Then) {
			Then.checkForNumberOFListCards();
		});
		opaQunit("List Card Header Title - mandatory", function (Given, When, Then) {
			Then.checkForListCardsHeaderTitles();
		});
		//opaQunit("List Card Header SubTitle - optional", function (Given, When, Then) {
			//Then.checkForListCardsHeaderSubTitles();
		//});
		opaQunit("List card value selection info", function (Given, When, Then) {
			Then.checkForListCardValueSelectionInfo();
		});
		opaQunit("KPI Info", function (Given, When, Then) {
			Then.iCheckListCardKpiInfo("card009");
		});
		opaQunit("KPI Info Colouring", function (Given, When, Then) {
			Then.iCheckListCardKpiInfoColouring("card009");
		});
		opaQunit("KPI arrow indicator direction", function (Given, When, Then) {
			Then.iCheckListCardKpiArrow("card009");
		});
		opaQunit("Target Value", function (Given, When, Then) {
			Then.iCheckListCardTargetValue("card009");
		});
		opaQunit("Deviation Value", function (Given, When, Then) {
			Then.iCheckListCardDeviation("card009");
		});
		opaQunit("Header Count", function (Given, When, Then) {
			Then.checkForTableCardHeaderCount();
		});
		opaQunit("Criticality", function (Given, When, Then) {
			Then.checkCriticalityForListCard("card002");
		});
        opaQunit("Card header Navigation", function (Given, When, Then) {
			When.iClickTheCardHeader("card002");
			Then.checkAppTitle("Sales Overview Page");
			When.iClickBackButton();
			Then.checkAppTitle("Procurement Overview Page");
		});
		// opaQunit("Row Navigation", function (Given, When, Then) {
		// 	When.iClickTheListCardItem("card007", "ovpList-0");

		// 	Then.checkNavParams("P_DisplayCurrency", "EUR");

		// 	Then.checkNavParams("ContractAmount", "12271");

		// 	Then.checkNavParams("NetAmount", "12271");
			
		// 	Then.checkNavParams("LifecycleStatusDescription", "Rejected");

		// 	Then.checkNavParams("CustomerID", "0100000001");

		// 	Then.checkNavParams("GrossAmount", "14602.49");

		// 	Then.checkNavParams("SalesOrderID", "0500000001");

		// 	Then.checkNavParams("SupplierName", "SAP");

		// 	Then.checkNavParams("CurrencyCode", "EUR");

		// });
		opaQunit("Close app", function (Given, When, Then) {
			// Arrangements
			Given.iTeardownMyApp();
			expect(0);
		}); 
})
