// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview The file provides helper functions for PagesCommonDataModelAdater.
 *
 * @version 1.88.1
 * @private
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/util/AppForInbound",
    "sap/base/Log",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/library"
], function (AppForInbound, Log, utilsCdm, ushellLibrary) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;

    var cdmSiteUtils = {
        _VISUALIZATION_TYPES: {
            STATIC_TILE: "sap.ushell.StaticAppLauncher",
            DYNAMIC_TILE: "sap.ushell.DynamicAppLauncher"
        }
    };

    /**
     * Returns all available visualizations from the given visualization data.
     *
     * @param {object} visualizationData Visualization data as a hash map (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     * @param {object} urlParsing The UrlParsing Service
     * @returns {object} An object with all visualizations.
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getVisualizations = function (visualizationData, urlParsing) {
        var oVisualizations = {};

        Object.keys(visualizationData).forEach(function (vizKey) {
            var oVisualizationData = visualizationData[vizKey];
            var sVizType;

            if (oVisualizationData.isCustomTile) {
                sVizType = oVisualizationData._instantiationData.catalogTile.baseChipId;
            } else if (oVisualizationData.indicatorDataSource) {
                sVizType = this._VISUALIZATION_TYPES.DYNAMIC_TILE;
            } else {
                sVizType = this._VISUALIZATION_TYPES.STATIC_TILE;
            }

            var oVisualization = {
                vizType: sVizType,
                vizConfig: {
                    "sap.app": {
                        title: oVisualizationData.title,
                        subTitle: oVisualizationData.subTitle,
                        info: oVisualizationData.info
                    },
                    "sap.ui": {
                        icons: {
                            icon: oVisualizationData.icon
                        }
                    },
                    "sap.flp": {
                        tileSize: oVisualizationData.size,
                        indicatorDataSource: oVisualizationData.indicatorDataSource,
                        numberUnit: oVisualizationData.numberUnit
                    }
                }
            };

            // For non custom tiles the instantiationData is not set, so cdm tiles are used in the abap scenario.
            if (oVisualizationData.isCustomTile) {
                oVisualization.vizConfig["sap.flp"]._instantiationData = oVisualizationData._instantiationData;
            }

            oVisualization.vizConfig["sap.flp"].target = utilsCdm.toTargetFromHash(oVisualizationData.url, urlParsing);

            oVisualizations[vizKey] = oVisualization;
        }.bind(this));

        return oVisualizations;
    };

    /**
     * Returns applications with the given navigation data.
     *
     * An empty object is returned for an app which cannot be created.
     *
     * @param {object} navigationData Navigation data as hash map.
     * @returns {objects} Dereferenced applications object.
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getApplications = function (navigationData) {

        return Object.keys(navigationData).reduce(function (oApplications, navigationDataId) {
            var oInbound = navigationData[navigationDataId],
                sInboundPermanentKey = oInbound.permanentKey || oInbound.id;

            // the navigation data ID becomes the application ID
            try {
                oApplications[sInboundPermanentKey] = AppForInbound.get(navigationDataId, oInbound);
            } catch (error) {
                Log.error("Unable to dereference app '" + navigationDataId + "' of CDM page.");
                oApplications[navigationDataId] = {};
            }

            return oApplications;
        }, {});
    };

    /**
     * Returns built-in visualization types.
     *
     * Currently there is only the generic platform visualization type that indicates
     * that the visualization has to be created in a platform-dependent way.
     *
     * @param {object} visualizationData Visualization data as a hash map (@see sap.ushell.services.VisualizationDataProvider#getVisualizationData).
     *
     * @returns {object} Visualization types
     *
     * @since 1.75.0
     * @private
     */
    cdmSiteUtils.getVizTypes = function (visualizationData) {
        return Object.keys(visualizationData)
            .filter(function (sVizKey) {
                var oVisualizationData = visualizationData[sVizKey];
                return oVisualizationData.isCustomTile;
            })
            .reduce(function (oVizTypes, sVizKey) {
                var oVisualizationData = visualizationData[sVizKey];
                var oCatalogTile = oVisualizationData._instantiationData.catalogTile;

                var sVizTypeId = oCatalogTile.baseChipId;
                if (!oVizTypes[sVizTypeId]) {
                    oVizTypes[sVizTypeId] = {
                        "sap.app": {
                            id: sVizTypeId,
                            type: "platformVisualization"
                        },
                        "sap.flp": {
                            vizOptions: {
                                displayFormats: this._getDisplayFormats(oCatalogTile)
                            }
                        }
                    };
                }

                // for ABAP tiles there is no standardWide. this has to be expressed
                // with display format standard and a tile size
                var sTileSize = this._getTileSize(oCatalogTile);
                if (sTileSize) {
                    oVizTypes[sVizTypeId]["sap.flp"].tileSize = sTileSize;
                }

                return oVizTypes;
            }.bind(this), {});
    };

    /**
     * Returns the supported & default display format options for a particular catalog tile.
     * It uses the "types" contract and implements special handling for news tiles.
     *
     * @param {object} catalogTile A catalog tile (CHIP Instance)
     *
     * @returns {object} Display formats
     *
     * @since 1.86
     * @private
     */
    cdmSiteUtils._getDisplayFormats = function (catalogTile) {
        // Default displayFormat configuration if the types contract is not available.
        var aAvailableTypes = [DisplayFormat.Standard];
        var sDefaultType = DisplayFormat.Standard;

        if (catalogTile.contracts.types) {
            // Get available types & default type from chip contract.
            aAvailableTypes = catalogTile.contracts.types.availableTypes;
            sDefaultType = catalogTile.contracts.types.defaultType;

            // the types contract returns all types in lower case, therefore a mapping
            // for types in camel case is needed.
            aAvailableTypes = aAvailableTypes.map(function (sType) {
                if (sType === "flatwide") {
                    return DisplayFormat.FlatWide;
                }
                return sType;
            });

            if (sDefaultType === "flatwide") {
                sDefaultType = DisplayFormat.FlatWide;
            }
        }

        return {
            supported: aAvailableTypes,
            default: sDefaultType
        };
    };

    /**
     * Returns a CDM tile size from the CHIP configuration's rows and columns
     *
     * @param {object} catalogTile A catalog tile (CHIP Instance)
     *
     * @returns {string|null} Tile size or null if the tile size could not be created
     *
     * @since 1.88
     * @private
     */
    cdmSiteUtils._getTileSize = function (catalogTile) {
        if (catalogTile.configuration && catalogTile.configuration.row && catalogTile.configuration.col) {
            return catalogTile.configuration.row + "x" + catalogTile.configuration.col;
        }
        return null;
    };

    return cdmSiteUtils;

});
