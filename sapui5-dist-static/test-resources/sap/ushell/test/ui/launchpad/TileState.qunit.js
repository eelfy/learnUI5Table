// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.TileState"
 */
sap.ui.require([
    "sap/ushell/ui/launchpad/FailedTileDialog",
    "sap/ushell/ui/launchpad/TileState"
], function (
    FailedTileDialog,
    TileState
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("_onPress()", {
        beforeEach: function () {
            this.oTileState = new TileState();
            this.oTileState.FailedTileDialog = new FailedTileDialog();
            this.openForStub = sinon.stub(this.oTileState.FailedTileDialog, "openFor");
        }
    });

    QUnit.test("Calls \"FailedTileDialog.openFor()\" when the \"state\" is \"Failed\"", function (assert) {
        // Arrange
        this.oTileState.setState("Failed");

        // Act
        this.oTileState._onPress();

        // Assert
        assert.ok(this.openForStub.called, "The method was called");
    });

    QUnit.test("Does not call \"FailedTileDialog.openFor()\" when the \"state\" is not \"Failed\"", function (assert) {
        // Arrange
        this.oTileState.setState("Loaded");

        // Act
        this.oTileState._onPress();

        // Assert
        assert.ok(this.openForStub.notCalled, "The method was not called");
    });
});
