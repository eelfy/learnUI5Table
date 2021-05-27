// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.FailedTileDialog"
 */
sap.ui.require([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/mvc/JSONView",
    "sap/ushell/ui/launchpad/FailedTileDialog",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/ui/launchpad/TileContainer"
], function (
    ManagedObject,
    JSONView,
    FailedTileDialog,
    Tile,
    TileContainer
) {
    "use strict";

    /* global QUnit */

    QUnit.module("openFor()", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            this.oFailedTileDialog = new FailedTileDialog();
            this.oTile = new Tile({
                tileCatalogId: "tileCatalogId",
                debugInfo: ManagedObject.escapeSettingsValue(JSON.stringify({ chipId: "chipId" }))
            });
            this.oTileContainer = new TileContainer({ tiles: this.oTile });
            JSONView.create({ definition: {} }).then(function (oView) {
                this.oView = oView;
                this.oView.addContent(this.oTileContainer);
                this.oView.placeAt("qunit-fixture");
                fnDone();
            }.bind(this));
        },
        afterEach: function () {
            this.oView.destroy();
        }
    });

    QUnit.test("The FailedTileDialog instance is created and saved", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oFailedTileDialog.openFor(this.oTile).then(function () {
            // Assert
            assert.ok(this.oView.oFailedTileDialog.isA("sap.m.Dialog"), "The instance is created and saved");

            fnDone();
        }.bind(this));
    });

    QUnit.test("The FailedTileDialog instance is reused", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oFailedTileDialog;

        // Act
        this.oFailedTileDialog.openFor(this.oTile).then(function () {
            oFailedTileDialog = this.oView.oFailedTileDialog;
            this.oFailedTileDialog.openFor(this.oTile).then(function () {
                // Assert
                assert.strictEqual(this.oView.oFailedTileDialog, oFailedTileDialog, "The instance is reused");

                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("The \"tileCatalogId\" (aka \"chipId\") is obtained from \"getTileCatalogId()\" when available", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oFailedTileDialog.openFor(this.oTile).then(function () {
            // Assert
            var sChipId = this.oView.oFailedTileDialog.getModel().getProperty("/chipId");
            assert.strictEqual(sChipId, "tileCatalogId", "The property has the expected value");

            fnDone();
        }.bind(this));
    });

    QUnit.test("The \"tileCatalogId\" (aka \"chipId\") is not obtained from \"getTileCatalogId()\" when not available", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oTile.setTileCatalogId();

        // Act
        this.oFailedTileDialog.openFor(this.oTile).then(function () {
            // Assert
            var sChipId = this.oView.oFailedTileDialog.getModel().getProperty("/chipId");
            assert.strictEqual(sChipId, "chipId", "The property has the expected value");

            fnDone();
        }.bind(this));
    });
});
