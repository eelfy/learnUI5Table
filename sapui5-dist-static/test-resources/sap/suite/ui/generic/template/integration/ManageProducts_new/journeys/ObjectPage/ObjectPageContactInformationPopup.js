sap.ui.define(["sap/ui/test/opaQunit"],
    function(opaTest) {
        "use strict";

        QUnit.module("Object Page Contact Information Popup");

        opaTest("The Contact Information popup should open when a contact is clicked", function(Given, When, Then) {
            Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheObjectPage
                .iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
            When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Contacts");
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Contacts");
			When.onTheGenericObjectPage
				.iClickTheLink("Walter Winter");
            Then.onTheObjectPage
				.theContactInformationShouldBeDisplayedFor("Walter Winter");
        });

        opaTest("The Contact Information popup should open when a new contact is clicked with the right information", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("Sally Spring");
            Then.onTheObjectPage
              .theContactInformationShouldBeDisplayedFor("Sally Spring");
            Then.iTeardownMyApp();
        });
    }
);

