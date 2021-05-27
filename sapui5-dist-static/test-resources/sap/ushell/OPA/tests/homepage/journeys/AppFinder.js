// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/AppFinder",
    "sap/ushell/opa/tests/homepage/pages/Browser",
    "sap/ushell/opa/tests/header/pages/MeArea"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("AppFinder");

    opaTest("Open the appfinder", function (Given, When, Then) {
        Given.iStartMyFLP("cdm");

        When.onTheHomepage.iPressOnTheMeAreaButton();
        When.onTheMeArea.iPressOnActionButtonWithTitle("App Finder");

        When.onTheAppFinder.iClickOnAllCatalogs();
        When.onTheAppFinder.iClickThePinButtonOnTheTileWithIndex(2);

        Then.onTheAppFinder.iSeeThePopover();
    });

    opaTest("Adds the tile to a group and closes the popover", function (Given, When, Then) {
        When.onTheAppFinder.iAddTileToGroup("My Home");
        When.onTheAppFinder.iAddTileToGroup("S/4 - Sales Orders");
        When.onTheAppFinder.iClickTheCloseButtonOnTheGroupListPopover();

        When.onTheBrowser.iChangeTheHash("#Shell-home");

        Then.onTheHomepage.iShouldSeeTheGroupWithTitle("My Home");
        Then.onTheHomepage.iShouldSeeTheGroupWithTitle("S/4 - Sales Orders");
        Then.onTheHomepage.iShouldSeeTheGenericTileWithTitleNTimes("FLP - Test App", 2);
    });

    opaTest("Adds the tile to a new group and closes the popover", function (Given, When, Then) {
        When.onTheHomepage.iPressOnTheMeAreaButton();
        When.onTheMeArea.iPressOnActionButtonWithTitle("App Finder");

        When.onTheAppFinder.iClickOnAllCatalogs();
        When.onTheAppFinder.iClickThePinButtonOnTheTileWithIndex(2);

        Then.onTheAppFinder.iSeeThePopover();

        When.onTheAppFinder.iEnterTheNewGroupTitle("Awesome group");
        When.onTheAppFinder.iClickTheOKButtonOnTheGroupListPopover();

        When.onTheBrowser.iChangeTheHash("#Shell-home");

        Then.onTheHomepage.iShouldSeeTheGroupWithTitle("Awesome group");
        Then.onTheHomepage.iShouldSeeTheGenericTileWithTitleNTimes("FLP - Test App", 3);
    });
});
