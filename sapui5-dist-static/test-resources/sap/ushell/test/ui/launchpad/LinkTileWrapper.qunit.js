// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.LinkTileWrapper"
 */
sap.ui.require([
    "sap/m/GenericTile",
    "sap/ushell/ui/launchpad/FailedTileDialog",
    "sap/ushell/ui/launchpad/LinkTileWrapper"
], function (
    GenericTile,
    FailedTileDialog,
    LinkTileWrapper
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("_onPress() & _launchTileViaKeyboard()", {
        beforeEach: function () {
            this.oGenericTile = new GenericTile();
            this.oLinkTileWrapper = new LinkTileWrapper({ tileViews: this.oGenericTile }).setDebugInfo(JSON.stringify({ test: "test" }));
            this.oLinkTileWrapper.FailedTileDialog = new FailedTileDialog();
            this.openForStub = sinon.stub(this.oLinkTileWrapper.FailedTileDialog, "openFor");
        }
    });

    QUnit.test("Calls \"FailedTileDialog.openFor()\" when the wrapped Tile \"state\" is \"Failed\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oGenericTile.setState("Failed");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.strictEqual(this.openForStub.callCount, 2, "The method was called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when the wrapped Tile \"state\" is not \"Failed\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oGenericTile.setState("Loaded");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when \"tileActionModeActive\" is \"true\"", function (assert) {
        // Arrange
        var oEvent = { target: { tagName: "test" } };
        this.oLinkTileWrapper.setTileActionModeActive(true);
        this.oGenericTile.setState("Failed");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");

        // Arrange
        this.oGenericTile.setState("Loaded");

        // Act
        this.oLinkTileWrapper._onPress();
        this.oLinkTileWrapper._launchTileViaKeyboard(oEvent);

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });
});
