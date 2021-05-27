// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.LaunchPageAdapter
 */
sap.ui.require([
    "sap/ushell/adapters/local/LaunchPageAdapter"
], function (
   LaunchPageAdapter
) {
    "use strict";

    /* global QUnit*/

    QUnit.module("_getCatalogTileIndex", {
        beforeEach: function () {
            var oConfig = {
                    config: {
                        groups: {},
                        catalogs: {}
                    }
            };

            this.oLaunchPageAdapter = new LaunchPageAdapter({}, {}, oConfig);
        },
        afterEach: function () {
        }
    });

    QUnit.test("returns the correct value", function (assert) {
        //Act
        return this.oLaunchPageAdapter._getCatalogTileIndex().then(function (oCatalogTileIndex) {
            // Assert
            assert.deepEqual(oCatalogTileIndex, {}, "An empty catalogTileIndex was returned");
        });
    });

});