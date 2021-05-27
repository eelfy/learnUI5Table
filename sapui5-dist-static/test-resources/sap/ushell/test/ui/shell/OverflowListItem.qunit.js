// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.shell.OverflowListItem
 */
sap.ui.require([
    "sap/ushell/ui/shell/OverflowListItem"
], function (OverflowListItem) {
    "use strict";

    // shortcut for sap.ushell.ui.shell.OverflowListItem.prototype.FloatingNumberType
    var FloatingNumberType = OverflowListItem.prototype.FloatingNumberType;

    /* global QUnit */

    QUnit.module("sap.ushell.ui.shell.OverflowListItem", {});

    QUnit.test("Overflow item without floatingNumber: image without custom class", function (assert) {
        // Arrange
        var oConfig = {
            id: "testItem",
            title: "Head Item Text",
            icon: "sap-icon://home"
        };
        var oOverflowListItem;

        // Act
        oOverflowListItem = new OverflowListItem(oConfig);
        var oImage = oOverflowListItem._getImage();

        // Assert
        assert.notOk(oImage.hasStyleClass("sapUshellShellHeadItmCounter"), "Has no \"sapUshellShellHeadItmCounter\" custom class");
        assert.ok(oOverflowListItem.getFloatingNumberType() === FloatingNumberType.None,
            "Has floatingNumberType equals \"" + FloatingNumberType.None + "\"");

        oOverflowListItem.destroy();
    });

    QUnit.test("Overflow item with floatingNumber for Notifications: image with custom class and custom data", function (assert) {
        // Arrange
        var oConfig = {
            id: "testItem",
            title: "Head Item Text",
            icon: "sap-icon://home",
            floatingNumber: 3,
            floatingNumberType: FloatingNumberType.Notifications
        };
        var oOverflowListItem;

        // Act
        oOverflowListItem = new OverflowListItem(oConfig);
        var oImage = oOverflowListItem._getImage();
        var oCustomData = oImage.getCustomData();

        // Assert
        assert.ok(oImage.hasStyleClass("sapUshellShellHeadItmCounter"), "Has \"sapUshellShellHeadItmCounter\" custom class");
        assert.strictEqual(oCustomData.length, 1, "Has custom data");
        assert.strictEqual(oCustomData[0].getKey(), "counter-content", "Custom data contains key \"counter-content\"");
        assert.equal(oCustomData[0].getValue(), oConfig.floatingNumber, "\"counter-content\" custom data has the expected value");
        assert.strictEqual(oCustomData[0].getWriteToDom(), true, "and \"writeToDom\" set to \"true\"");
        assert.ok(oOverflowListItem.getFloatingNumberType() === FloatingNumberType.Notifications,
            "Has floatingNumberType equals \"" + FloatingNumberType.Notifications + "\"");

        oOverflowListItem.destroy();
    });
});
