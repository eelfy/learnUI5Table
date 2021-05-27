// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ShellHeader.controller
 */
sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/_HeaderManager/ShellHeader.controller",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (
    JSONModel,
    ShellHeaderController,
    ShellHeadItem
) {
    "use strict";

    // shortcut for sap.ushell.ui.shell.ShellHeadItem.prototype.FloatingNumberType
    var FloatingNumberType = ShellHeadItem.prototype.FloatingNumberType;

    /* global QUnit */

    var oController;

    QUnit.module("ShellHeader.controller - headEndItemsOverflowItemFactory", {
        beforeEach: function () {
            oController = new ShellHeaderController();
        },
        afterEach: function () {
            if (oController) {
                oController.destroy();
            }
        }
    });

    QUnit.test("Create an overflow item without floatingNumber", function (assert) {
        // Arrange
        var sItemId = "testOverflowItem",
            oConfig = {
                id: "testItem",
                text: "Head Item Text"
            },
            oShellHeadItemModel = new JSONModel({
                data: "test"
            }),
            oContext = {
                getObject: function () {
                    return "testItem";
                }
            },
            oShellHeadItem = new ShellHeadItem(oConfig);
        oShellHeadItem.setModel(oShellHeadItemModel);

        // Act
        var oOverflowItem = oController.headEndItemsOverflowItemFactory(sItemId, oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), sItemId + "-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(oOverflowItem.getFloatingNumber(), 0, "Overflow item floatingNumber equals \"0\"");
        assert.strictEqual(oOverflowItem.getFloatingNumberType(), FloatingNumberType.None,
            "Overflow item floatingNumberType equals \"" + FloatingNumberType.None + "\"");
        assert.notStrictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was not applied");

        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("Create an overflow item with floatingNumber for Notifications", function (assert) {
        //Arrange
        var sItemId = "testOverflowItem",
            oConfig = {
                id: "testItem",
                text: "Head Item Text",
                floatingNumber: "{/floatingNumber}",
                floatingNumberType: FloatingNumberType.Notifications
            },
            oShellHeadItemModel = new JSONModel({
                data: "test",
                floatingNumber: 10
            }),
            oContext = {
                getObject: function () {
                    return "testItem";
                }
            },
            oShellHeadItem = new ShellHeadItem(oConfig);
        oShellHeadItem.setModel(oShellHeadItemModel);

        // Act
        var oOverflowItem = oController.headEndItemsOverflowItemFactory(sItemId, oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), sItemId + "-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(
            oOverflowItem.getFloatingNumber(),
            oShellHeadItemModel.getProperty("/floatingNumber"),
            "Overflow item floatingNumber equals the value from the model");
        assert.strictEqual(oOverflowItem.getFloatingNumberType(), FloatingNumberType.Notifications,
            "Overflow item floatingNumberType equals \"" + FloatingNumberType.Notifications + "\"");
        assert.strictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was not applied");

        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });
});
