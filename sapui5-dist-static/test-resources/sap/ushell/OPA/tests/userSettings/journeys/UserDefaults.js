// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/userSettings/pages/UserDefaults"
], function (opaTest, resources) {
    "use strict";

    /**
     * This OPA journey will test the UserDefaults in the UserSettings dialog.
     */

    /* global QUnit */
    QUnit.module("UserDefaults tests");

    opaTest("Should show the input fields", function (Given, When, Then) {
        Given.iStartMyUIComponent(
            {
                componentConfig: {
                    name: "sap.ushell.components.shell.Settings.userDefaults"
                }
            }
        );

        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(false);

        Then.iTeardownMyUIComponent();
    });

    opaTest("Should display the correct values for each view", function (Given, When, Then) {
        Given.iStartMyUIComponent(
            {
                componentConfig: {
                    name: "sap.ushell.components.shell.Settings.userDefaults"
                }
            }
        );

        When.onTheUserDefaultsPage.iSelectView("View1");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "View1 First");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "View1 Second");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "View1 Extended Value");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(true);

        When.onTheUserDefaultsPage.iSelectView("View2");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("First", "View2 First");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("Second", "View2 Second");
        Then.onTheUserDefaultsPage.iSeeTheInputFieldWithNameAndValue("AdditionalValueParam", "View2 Extended Value");
        Then.onTheUserDefaultsPage.iSeeTheAdditionalValuesButton(false);



        Then.iTeardownMyUIComponent();
    });

    opaTest("Should display the dirty state asterisk if a view is modified", function (Given, When, Then) {
        Given.iStartMyUIComponent(
            {
                componentConfig: {
                    name: "sap.ushell.components.shell.Settings.userDefaults"
                }
            }
        );

        When.onTheUserDefaultsPage.iTypeIntoInputFieldWithName("First", "a");
        Then.onTheUserDefaultsPage.iSeeTheDirtyStateAsterisk();
        When.onTheUserDefaultsPage.iSelectView("View1");
        When.onTheUserDefaultsPage.iTypeIntoInputFieldWithName("First", "a");
        Then.onTheUserDefaultsPage.iSeeTheDirtyStateAsterisk();
        Then.iTeardownMyUIComponent();
    });

    opaTest("Should display the diff state text if a view except Standard is loaded", function (Given, When, Then) {
        Given.iStartMyUIComponent(
            {
                componentConfig: {
                    name: "sap.ushell.components.shell.Settings.userDefaults"
                }
            }
        );

        When.onTheUserDefaultsPage.iSelectView("View1");
        Then.onTheUserDefaultsPage.iSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        When.onTheUserDefaultsPage.iSelectView("View2");
        Then.onTheUserDefaultsPage.iSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        When.onTheUserDefaultsPage.iSelectView(resources.i18n.getText("userDefaultsStandardView"));
        Then.onTheUserDefaultsPage.iDoNotSeeTheDiffStateText(resources.i18n.getText("userDefaultsDiffState"));
        Then.iTeardownMyUIComponent();
    });
});