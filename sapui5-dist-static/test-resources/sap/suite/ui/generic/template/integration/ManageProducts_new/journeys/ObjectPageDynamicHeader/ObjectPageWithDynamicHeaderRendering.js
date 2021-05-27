sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Dynamic Header Rendering");

		opaTest("The Dynamic header & pin header is rendered correctly", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestDynamicHeaderInFCL", {"sapUiLayer": "VENDOR"});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectImage", {"displayShape": "Square"})
				.and
				.theObjectMarkerIsInContentAggregation()
				.and
				.theLayoutActionsShouldBeSeparatedFromGlobalActions()
				.and
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": true});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("template::ObjectPage::ObjectPageVariant")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-collapseBtn")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-pinBtn");
		});

		opaTest("The Expand Header Button is correctly rendered", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("objectPage-OPHeaderContent-collapseBtn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("template::ObjectPage::ObjectPageHeader-expandBtn");
		});

		opaTest("The Default Inline Create Sort is disabled", function(Given, When, Then) {
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 1100);
			Then.onTheObjectPage
				.iCheckTableForDefaultInlineCreateSort(false);
		});

		opaTest("The Expand/Collapse Header Button is not rendered in Edit Mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": false});
			Then.iTeardownMyApp();
		});
	}
);
