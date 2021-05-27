// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/AnchorNavigationBar",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/common/pages/Common",
    "sap/ushell/resources"
], function (opaTest, AnchorNavigationBar, ShellHeader, Homepage, Common, resources) {
    "use strict";

    /**
     * This OPA journey will test the accessibilty features of the classic homepage.
     */

    /* global QUnit */
    QUnit.module("Accessibility tests");

    opaTest("Should open the FLP", function (Given, When, Then) {
        Given.iStartMyFLP("cdm", {
            "services": {
                "CommonDataModel": {
                    "adapter": {
                        "config": {
                            "siteDataUrl": "../OPA/testSiteData/cdmTestSiteWithMultipleGroups.json"
                        }
                    }
                }
            }
        });
        When.onTheBrowser.iHideQUnit();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    opaTest("Should rotate the focus via F6 forwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressF6();
        Then.onShellHeader.iShouldSeeFocusOnAppTitle();
        When.onTheBrowser.iPressF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("S/4 - Sales Orders");
        When.onTheBrowser.iPressF6();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    opaTest("Should rotate the focus via F6 backwards.", function (Given, When, Then) {
        When.onTheBrowser.iPressShiftF6();
        Then.onTheAnchorNavigationBar.iShouldSeeFocusOnAnchorItem("S/4 - Sales Orders");
        When.onTheBrowser.iPressShiftF6();
        Then.onShellHeader.iShouldSeeFocusOnAppTitle();
        When.onTheBrowser.iPressShiftF6();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
    });

    opaTest("Should close the FLP", function (Given, When, Then) {
        When.onTheBrowser.iShowQUnit();
        Then.onTheHomepage.iShouldSeeFocusOnTile("firstGroup-firstTile");
        Then.iTeardownMyFLP();
    });

});