// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SettingsButton
 */

sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/services/Container", // needed for sap.ushell.bootstrap
    "sap/ushell/ui/footerbar/AboutButton",
    "sap/ushell/ui/footerbar/SettingsButton"
], function (resources, Container, AboutButton, SettingsButton) {
    "use strict";
    /* global QUnit start*/

    QUnit.module("sap.ushell.ui.footerbar.SettingsButton", {
        beforeEach: function () {
            this.oSettingsButton = new SettingsButton();
            return sap.ushell.bootstrap("local");
        },
        afterEach: function () {
            this.oSettingsButton.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        assert.strictEqual(this.oSettingsButton.getIcon(), "sap-icon://action-settings", "Check button icon");
        assert.strictEqual(this.oSettingsButton.getTooltip(), resources.i18n.getText("helpBtn_tooltip"), "Check button tooltip");
    });

    QUnit.asyncTest("showSettingsMenu Test", function (assert) {
        // Act
        this.oSettingsButton.showSettingsMenu();

        // Assert
        setTimeout(function () {
            var oSettingsMenu = sap.ui.getCore().byId("settingsMenu"),
                aMenuButtons = oSettingsMenu.getButtons();

            assert.strictEqual(aMenuButtons.length, 3, "Check number of buttons");
            assert.ok(aMenuButtons[0].isA("sap.ushell.ui.footerbar.AboutButton"), "Check about button");
            assert.ok(aMenuButtons[1].isA("sap.ushell.ui.footerbar.UserPreferencesButton"), "Check user preferences button");
            assert.ok(aMenuButtons[2].isA("sap.ushell.ui.footerbar.LogoutButton"), "Check logout button");

            // Destroy the settings menu
            oSettingsMenu.destroy();
            start();
        }, 150);
    });

    QUnit.asyncTest("setMenuItems Test", function (assert) {
        // Arrange
        this.oSettingsButton.setMenuItems([new AboutButton()]);

        // Act
        this.oSettingsButton.showSettingsMenu();

        setTimeout(function () {
            var oSettingsMenu = sap.ui.getCore().byId("settingsMenu"),
                aMenuButtons = oSettingsMenu.getButtons();

            assert.strictEqual(aMenuButtons.length, 4, "Check number of buttons");
            assert.ok(aMenuButtons[0].isA("sap.ushell.ui.footerbar.AboutButton"), "Check about button");
            assert.ok(aMenuButtons[1].isA("sap.ushell.ui.footerbar.AboutButton"), "Check about button");
            assert.ok(aMenuButtons[2].isA("sap.ushell.ui.footerbar.UserPreferencesButton"), "Check user preferences button");
            assert.ok(aMenuButtons[3].isA("sap.ushell.ui.footerbar.LogoutButton"), "Check logout button");

            // Destroy the settings menu
            oSettingsMenu.destroy();
            start();
        }, 250);
    });
});
