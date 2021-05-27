// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings",
    "sap/ushell/opa/tests/homepage/pages/AppFinder",
    "sap/ushell/opa/tests/homepage/pages/AnchorNavigationBar"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    // TODO
    // Add tests for:
    // - using the Anchor Navigation Bar


    QUnit.module("AnchorNavigationBar: Render only when more-than-one Group exists", {
        before: function () {
            this.defaultConfig = {};
        }
    });

    opaTest("Enable 'Show one group at a time' - AnchorNavBar not rendered", function (Given, When, Then) {
        // START
        Given.iStartMyFLP("cdm", this.defaultConfig);

        // Actions
        When.onTheHomepage.iPressOnTheMeAreaButton();
        When.onTheMeArea.iPressOnActionButton("userSettingsBtn");
        When.onTheUserSettings.iPressOnTheHomePageListItem();
        When.onTheUserSettings.iPressOnTheShowOneGroutAtATimeRadioButton();
        When.onTheUserSettings.iPressOnTheSaveButton();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldNotFindTheAnchorNavigationBar();
    });

    opaTest("Add some tiles - AnchorNavBar should be rendered", function (Given, When, Then) {
        // Actions -> Go to Action Mode
        When.onTheHomepage.iPressOnTheMeAreaButton();
        When.onTheMeArea.iPressOnActionButton("ActionModeBtn");

        // Actions -> Add some Tiles to "My Home" group
        When.onTheHomepageInActionMode.iPressOnPlusTileInMyHomeGroup();
        When.onTheAppFinder.iPressAllAppsPinButtons();
        When.onShellHeader.iPressTheBackButton();
        When.onTheHomepageInActionMode.iPressCloseToLeave();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldFindTheAnchorNavigationBar();
    });

    opaTest("Remove all tiles - AnchorNavigationBar should not be rendered", function (Given, When, Then) {
        // Actions -> Remove all tiles from "My Home" group
        When.onTheHomepage.iPressOnTheMeAreaButton();
        When.onTheMeArea.iPressOnActionButton("ActionModeBtn");
        When.onTheHomepageInActionMode.iPressOnPlusTileInMyHomeGroup();
        When.onTheAppFinder.iPressAllAppsPinButtons();
        When.onShellHeader.iPressTheBackButton();
        When.onTheHomepageInActionMode.iPressCloseToLeave();

        // Assertion
        Then.onTheAnchorNavigationBar.iShouldNotFindTheAnchorNavigationBar();

        // DONE
        Then.iTeardownMyFLP();
    });
});