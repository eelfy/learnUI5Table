// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Press, PropertiesMatcher) {
    "use strict";

    function checkboxCheckProperty (iRow, sPropertyName, bValue) {
        return this.waitFor({
            id: "notificationsSetting--table",
            matchers: function (oTable) {
                var oItem = oTable.getItems()[iRow];
                return oItem.getCells()[2];
            },
            success: function (oElement) {
                Opa5.assert.strictEqual(oElement.getProperty(sPropertyName),
                bValue, "Checkbox is " + (bValue ? " " : "not ") + sPropertyName + ": " +
                    oElement.getBindingContext().getProperty("NotificationTypeDesc"));
            },
            errorMessage: "No Checkbox found"
        });
    }



    Opa5.createPageObjects({
        onTheUserSettings: {
            actions: {
                iPressOnTheNotificationsListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getIcon() === "sap-icon://bell") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press(),
                        errorMessage: "No notifications list item"
                    });
                },
                iPressOnTheCancelButton: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingCancelButton",
                        actions: new Press(),
                        errorMessage: "No cancel button"
                    });
                },
                iPressOnTheSaveButton: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingSaveButton",
                        actions: new Press(),
                        errorMessage: "No save button"
                    });
                },
                iPressOnTheAppearanceListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            return oList.getItems()[1];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheHomePageListItem: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingEntryList",
                        matchers: function (oList) {
                            return oList.getItems().find(function (oListItem) {
                                return oListItem.getTitle() === "Home Page";
                            });
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheDisplaySettingsTab: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("idIconTabBar").getItems()[1];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheShowOneGroutAtATimeRadioButton: function () {
                    return this.waitFor({
                        id: "UserSettingsHomepageSettingsView--anchorBarDisplayMode",
                        controlType: "sap.m.RadioButtonGroup",
                        matchers: function (oRadioButtonGroup) {
                            return oRadioButtonGroup.getButtons()[1];
                        },
                        actions: new Press()
                    });
                },
                iPressOnTheSmallTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[0];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at first position"
                    });
                },
                iPressOnTheResponsiveTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[1];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at second position"
                    });
                }
            },
            assertions: {
                iShouldNotSeeTheTileSizeSetting: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        success: function (oElement) {
                            Opa5.assert.ok(!oElement.byId("tileSizeRadioButtonGroup").getDomRef(), "No tile size selector");
                        },
                        errorMessage: "Tiles size selector visible but should not."
                    });
                },
                iShouldSeeNoEmailColumn: function () {
                    return this.waitFor({
                        id: "notificationsSetting--table",
                        matchers: function (oTable) {
                            return oTable.getColumns()[2];
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.getVisible(), false, "no email column visible");
                        },
                        errorMessage: "no notification settings table found"
                    });
                },
                iShouldSeeAnEnabledCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "enabled", true);
                },
                iShouldSeeASelectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", true);
                },
                iShouldSeeAnUnselectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", false);
                },
                iShouldNotSeeACheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "visible", false);
                },
                iShouldSeeSettingsDialog: function () {
                    return this.waitFor({
                        id: "settingsView--userSettingsDialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "userSettingsDialog was opened");
                        },
                        errorMessage: "userSettingsDialog was not found"
                    });
                },
                iShouldSeeContentDensityCheckboxSelected: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector--contentDensityCheckBox",
                        controlType: "sap.m.CheckBox",
                        matchers: new PropertiesMatcher({
                            selected: true
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "contentDensityCheckBox should be selected.");
                        },
                        errorMessage: "contentDensityCheckBox was not found."
                    });
                }
            }
        }
    });
});