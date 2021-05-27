// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module deals with the retrieval of visualization data in a platform independent way.</p>
 *
 * @version 1.88.1
 */

 sap.ui.define([
    "sap/ushell/resources",
    "sap/base/util/ObjectPath"
 ], function (resources, ObjectPath) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getServiceAsync("VisualizationDataProvider").then(function (VisualizationDataProvider) {});</code>.
     * Constructs a new instance of the visualization data provider service.
     *
     * @namespace sap.ushell.services.VisualizationDataProvider
     *
     * @constructor
     * @see sap.ushell.services.Container#getServiceAsync
     * @since 1.68.0
     *
     * @private
     */
    function VisualizationDataProvider () {
        this.S_COMPONENT_NAME = "sap.ushell.services.VisualizationDataProvider";
        this._init.apply(this, arguments);
    }

    /**
     * Private initializer.
     *
     * @param {object} launchPageAdapter The LaunchPageAdapter for the specific platform.
     * @since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._init = function (launchPageAdapter) {
        this.oLaunchPageAdapter = launchPageAdapter;
        this.oCatalogTilePromise = null;
    };


    /**
     * Returns raw catalog tile data that can be used to instantiate the tile
     *
     * @returns {Promise<object>} The catalog tile index
     *
     * @since 1.78.0
     * @private
     */
    VisualizationDataProvider.prototype._getCatalogTileIndex = function () {

        if (this._oCatalogTileIndexPromise) {
            return this._oCatalogTileIndexPromise;
        }

        var oLaunchPageAdapter = this.oLaunchPageAdapter;
        return oLaunchPageAdapter._getCatalogTileIndex();
    };

    /**
     * Retrieves and returns a map of all catalog tiles.
     *
     * @returns {Promise<Object>} The map of catalog tiles
     * @since 1.70.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._getCatalogTiles = function () {

        if (this.oCatalogTilePromise) {
            return this.oCatalogTilePromise;
        }

        var oLaunchPageAdapter = this.oLaunchPageAdapter;
        this.oCatalogTilePromise = new Promise(function (resolve, reject) {
            oLaunchPageAdapter.getCatalogs().then(function (catalogs) {
                var aDeferreds = [];
                var aCatalogTiles = [];
                var aFlattenedCatalogTiles = [];
                var oCatalogTiles = {};

                for (var i = 0; i < catalogs.length; i++) {
                    // REMOTE catalogs are deprecated and not supported in the pages runtime
                    if (typeof catalogs[i].ui2catalog === 'undefined' || catalogs[i].ui2catalog.getType() !== 'REMOTE') {
                        aDeferreds.push(oLaunchPageAdapter.getCatalogTiles(catalogs[i]).then(function (catalogTile) {
                            aCatalogTiles.push(catalogTile);
                        }));
                    }
                }

                jQuery.when.apply(null, aDeferreds).done(function () {
                    // Convert a two-dimensional array into a flat array
                    aFlattenedCatalogTiles = [].concat.apply([], aCatalogTiles);

                    for (var y = 0; y < aFlattenedCatalogTiles.length; y++) {
                        oCatalogTiles[oLaunchPageAdapter.getCatalogTileId(aFlattenedCatalogTiles[y])] = aFlattenedCatalogTiles[y];
                    }

                    resolve(oCatalogTiles);
                }).fail(reject);
            }).fail(reject);
        });

        return this.oCatalogTilePromise;
    };

    /**
     * @typedef {object} VisualizationData
     * An object representing a visualization in a format which is independent of the adapter.
     * @property {string} object.title The title.
     * @property {string} object.subTitle The subtitle.
     * @property {string} object.icon The icon.
     * @property {string} object.info The info.
     * @property {string} object.size The size.
     * @property {boolean} object.isCustomTile Is it a custom tile?
     */


    /**
     * Returns all visualization data.
     *
     * @returns {Promise<Object<string,VisualizationData>>} The visualization data.
     * @since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype.getVisualizationData = function () {
        var oLaunchPageAdapter = this.oLaunchPageAdapter,
            oCatalogTile;

        return Promise.all([
            this._getCatalogTiles(),
            this._getCatalogTileIndex()
        ])
            .then(function (aResults) {
                var oCatalogTiles = aResults[0];
                var aCatalogTileIndex = aResults[1];
                return Object.keys(oCatalogTiles).reduce(function (oVisualizationData, sId) {
                    oCatalogTile = oCatalogTiles[sId];

                    var bIsTileIntentSupported = oLaunchPageAdapter.isTileIntentSupported(oCatalogTile);
                    if (!bIsTileIntentSupported) {
                        return oVisualizationData;
                    }

                    oVisualizationData[sId] = {
                        title: oLaunchPageAdapter.getCatalogTilePreviewTitle(oCatalogTile),
                        subTitle: oLaunchPageAdapter.getCatalogTilePreviewSubtitle(oCatalogTile),
                        icon: oLaunchPageAdapter.getCatalogTilePreviewIcon(oCatalogTile),
                        info: oLaunchPageAdapter.getCatalogTilePreviewInfo(oCatalogTile),
                        size: oLaunchPageAdapter.getCatalogTileSize(oCatalogTile),
                        indicatorDataSource: oLaunchPageAdapter.getCatalogTilePreviewIndicatorDataSource(oCatalogTile),
                        url: oLaunchPageAdapter.getCatalogTileTargetURL(oCatalogTile),
                        numberUnit: oLaunchPageAdapter.getCatalogTileNumberUnit(oCatalogTile),
                        // The special custom tile logic is not needed on all the platforms so it doesn't have to be implemented
                        isCustomTile: oLaunchPageAdapter.isCustomTile && oLaunchPageAdapter.isCustomTile(oCatalogTile)
                    };

                    if (aCatalogTileIndex[sId]) {
                        // The catalog tile index is only available on the ABAP platform.
                        oVisualizationData[sId]._instantiationData = {
                            platform: "ABAP",
                            chip: aCatalogTileIndex[sId],
                            catalogTile: {
                                // We need to replace / with _ otherwise getProperty of sap.ui.model.json.JSONModel doesn't work anymore.
                                baseChipId: oCatalogTile.getChip().getBaseChipId().replace(/\//g, "_"),
                                contracts: {},
                                configuration: {
                                    row: oCatalogTile.getConfigurationParameter("row"),
                                    col: oCatalogTile.getConfigurationParameter("col")
                                }
                            }
                        };

                        var oTypeContracts = oCatalogTile.getContract("types");
                        if (oTypeContracts) {
                            ObjectPath.set("catalogTile.contracts.types.availableTypes", oTypeContracts.getAvailableTypes(), oVisualizationData[sId]._instantiationData);
                            ObjectPath.set("catalogTile.contracts.types.defaultType", oTypeContracts.getDefaultType(), oVisualizationData[sId]._instantiationData);
                        }
                    }

                    return oVisualizationData;
                }, {});
            })
            .catch(function (error) {
                var oError = {
                    component: this.S_COMPONENT_NAME,
                    description: resources.i18n.getText("VisualizationDataProvider.CannotLoadData"),
                    detail: error
                };
                return Promise.reject(oError);
            }.bind(this));
    };

    VisualizationDataProvider.hasNoAdapter = false;
    return VisualizationDataProvider;
});
