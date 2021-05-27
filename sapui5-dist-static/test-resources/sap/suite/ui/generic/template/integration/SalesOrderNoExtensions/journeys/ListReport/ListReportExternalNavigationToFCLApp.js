sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report: External Navigation to FCL app");

		opaTest("Check Destination app loads in fullscreen when FCL configured when navigated from a source app", function (Given, When, Then) {

			Given.iStartMyAppInSandbox("STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet#STTASOWD20-STTASOWD20");

			When.onTheGenericListReport
				.iSetTheSearchField("500000000")
				.and
				.iClickTheLink("100000000");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("100000000");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("MidColumnFullScreen");

			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("exitFullScreen");

			Then.onTheGenericFCLApp
				.iCheckFCLLayout("TwoColumnsBeginExpanded");
			
			When.onTheGenericFCLApp
				.iClickTheFCLActionButton("closeColumn");
			
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
				
			Then.iTeardownMyApp();
		});
	}
);
