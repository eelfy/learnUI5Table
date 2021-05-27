// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings",
    "sap/ushell/opa/tests/userSettings/pages/AboutDialog"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("About Dialog", {
        before: function () {

        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Open dialog when clicking on UserSettings icon", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("aboutBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onTheHomepage.iShouldSeeAboutDialog();
            When.onTheAboutDialog.iPressTheOkButton();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("About dialog should show the system fields", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("aboutBtn");
            Then.onTheAboutDialog.iSeeTheFieldWithText("My Product Name");
            Then.onTheAboutDialog.iSeeTheFieldWithText("My Product Version");
            Then.onTheAboutDialog.iSeeTheFieldWithText("My System Name");
            Then.onTheAboutDialog.iSeeTheFieldWithText("My System Role");
            Then.onTheAboutDialog.iSeeTheFieldWithText("My Tenant Role");
            When.onTheAboutDialog.iPressTheOkButton();

            // Assertions
            Then.iTeardownMyFLP();
        });
    });
});
