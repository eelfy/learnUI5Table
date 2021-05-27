// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationDataProvider
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/VisualizationDataProvider",
    "sap/ushell/resources"
], function (VisualizationDataProvider, resources) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.start();
    QUnit.module("The constructor");

    QUnit.test("Sets the right class properties", function (assert) {
        // Arrange
        var oLaunchPageAdapter = {
            getCatalogTileId: function () {
            }
        };

        // Act
        var oService = new VisualizationDataProvider(oLaunchPageAdapter);

        // Assert
        assert.strictEqual(oService.oLaunchPageAdapter, oLaunchPageAdapter, "The constructor sets the oLaunchPageAdapter property correctly.");
        assert.equal(oService.S_COMPONENT_NAME, "sap.ushell.services.VisualizationDataProvider", "The component name is set correctly.");
    });

    QUnit.module("The function getVisualizationData", {
        beforeEach: function () {
            var getRowColConfigurationStub = function (row, col) {
                var stub = sinon.stub();
                stub.withArgs("row").returns(row);
                stub.withArgs("col").returns(col);
                return stub;
            };

            this.oGetTypeStub = sandbox.stub().returns("TYPE");

            this.aCatalogs = [
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:/UI2/CONFIG_NAVIGATION_MODE",
                    title: "Configuration for in-place navigation of classic UIs",
                    tiles: [],
                    ui2catalog: {
                        getType: this.oGetTypeStub
                    }
                },
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                    title: "/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                    tiles: [
                        {
                            id: 1,
                            title: "Tile 1",
                            subtitle: "Subtitle tile 1",
                            icon: "sap-icon://add",
                            info: "",
                            numberUnit: "EUR",
                            size: "1x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service1/$count",
                                refresh: 200
                            },
                            isCustomTile: false,
                            getChip: sinon.stub().returns({
                                getBaseChipId: sinon.stub().returns("/UI2/BASE/CHIP1")
                            }),
                            getContract: sinon.stub().withArgs("types").returns({
                                getAvailableTypes: sinon.stub().returns(["standard", "standardWide", "compact"]),
                                getDefaultType: sinon.stub().returns("standard")
                            }),
                            getConfigurationParameter: getRowColConfigurationStub(undefined, undefined)
                        },
                        {
                            id: 2,
                            title: "Tile 2",
                            subtitle: "Subtitle tile 2",
                            icon: "sap-icon://mail",
                            numberUnit: "EUR",
                            info: "info 2",
                            size: "2x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service2/$count",
                                refresh: 800
                            },
                            isCustomTile: false,
                            getChip: sinon.stub().returns({
                                getBaseChipId: sinon.stub().returns("/UI2/BASE/CHIP2")
                            }),
                            getContract: sinon.stub().withArgs("types").returns(undefined),
                            getConfigurationParameter: getRowColConfigurationStub(undefined, undefined)
                        },
                        {
                            id: 3,
                            title: "Tile 3",
                            subtitle: "Subtitle tile 3",
                            icon: "sap-icon://documents",
                            numberUnit: "EUR",
                            info: "info 3",
                            size: "1x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service3/$count"
                            },
                            isCustomTile: true,
                            getChip: sinon.stub().returns({
                                getBaseChipId: sinon.stub().returns("/UI2/BASE/CHIP3")
                            }),
                            getContract: sinon.stub().withArgs("types").returns(undefined),
                            getConfigurationParameter: getRowColConfigurationStub("1", "2")
                        },
                        {
                            id: 5,
                            title: "Tile 5",
                            subtitle: "Subtitle tile 5",
                            icon: "sap-icon://workflow",
                            numberUnit: "EUR",
                            info: "",
                            size: "2x2",
                            indicatorDataSource: undefined,
                            isCustomTile: false,
                            url: "www.sap.url.com",
                            getChip: sinon.stub().returns({
                                getBaseChipId: sinon.stub().returns("/UI2/BASE/CHIP5")
                            }),
                            getContract: sinon.stub().withArgs("types").returns({
                                getAvailableTypes: sinon.stub().returns(["tile", "link"]),
                                getDefaultType: sinon.stub().returns("tile")
                            }),
                            getConfigurationParameter: getRowColConfigurationStub(undefined, undefined)
                        }
                    ],
                    ui2catalog: {
                        getType: this.oGetTypeStub
                    }
                },
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:SAP_PRC_BC_PURCHASER_PIR",
                    title: "Purchasing - Source Assignment",
                    tiles: [
                        {
                            id: 4,
                            title: "Tile 4",
                            subtitle: "Subtitle tile 4",
                            icon: "sap-icon://workflow",
                            numberUnit: "EUR",
                            info: "",
                            size: "2x2",
                            indicatorDataSource: undefined,
                            isCustomTile: true,
                            getChip: sinon.stub().returns({
                                getBaseChipId: sinon.stub().returns("/UI2/BASE/CHIP4")
                            }),
                            getContract: sinon.stub().withArgs("types").returns({
                                getAvailableTypes: sinon.stub().returns(["tile", "link"]),
                                getDefaultType: sinon.stub().returns("tile")
                            }),
                            getConfigurationParameter: getRowColConfigurationStub(undefined, undefined)
                        }
                    ],
                    ui2catalog: {
                        getType: this.oGetTypeStub
                    }
                }
            ];

            var oCatalogTileIndex = {
                1: {
                    CHIP: "data1"
                },
                2: {
                    CHIP: "data2"
                },
                3: {
                    CHIP: "data3"
                }
            };

            this.oLaunchPageGetCatalogsStub = sinon.stub().returns(
                new jQuery.Deferred().resolve(this.aCatalogs).promise()
            );

            this.oIsTileIntentSupportedStub = sandbox.stub().returns(true);

            var oAdapterStub = {
                getCatalogs: this.oLaunchPageGetCatalogsStub,
                getCatalogTiles: function (catalog) {
                    return new jQuery.Deferred().resolve(catalog.tiles).promise();
                },
                getCatalogTileId: function (tile) {
                    return tile.id;
                },
                getCatalogTilePreviewTitle: function (tile) {
                    return tile.title;
                },
                getCatalogTilePreviewSubtitle: function (tile) {
                    return tile.subtitle;
                },
                getCatalogTilePreviewIcon: function (tile) {
                    return tile.icon;
                },
                getCatalogTilePreviewInfo: function (tile) {
                    return tile.info;
                },
                getCatalogTileNumberUnit: function (tile) {
                    return tile.numberUnit;
                },
                getCatalogTileSize: function (tile) {
                    return tile.size;
                },
                getCatalogTilePreviewIndicatorDataSource: function (tile) {
                    return tile.indicatorDataSource;
                },
                getCatalogTileTargetURL: function (tile) {
                    return tile.url || undefined;
                },
                isCustomTile: function (tile) {
                    return tile.isCustomTile;
                },
                isTileIntentSupported: this.oIsTileIntentSupportedStub
            };

            this.oService = new VisualizationDataProvider(oAdapterStub);
            sandbox.stub(this.oService, "_getCatalogTileIndex").returns(oCatalogTileIndex);
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("This is the translated error message.");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters out a tile without supported target mapping.", function (assert) {
        // Arrange
        this.oIsTileIntentSupportedStub
            .withArgs(this.aCatalogs[1].tiles[0])
            .returns(false);

        var oExpectedCatalogTiles = {
            2: {
                icon: "sap-icon://mail",
                numberUnit: "EUR",
                info: "info 2",
                size: "2x2",
                subTitle: "Subtitle tile 2",
                title: "Tile 2",
                isCustomTile: false,
                indicatorDataSource: {
                    path: "url/to/odata/service2/$count",
                    refresh: 800
                },
                url: undefined,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {
                        CHIP: "data2"
                    },
                    catalogTile: {
                        baseChipId: "_UI2_BASE_CHIP2",
                        contracts: {},
                        configuration: {
                            row: undefined,
                            col: undefined
                        }
                    }
                }
            },
            3: {
                icon: "sap-icon://documents",
                numberUnit: "EUR",
                info: "info 3",
                size: "1x2",
                subTitle: "Subtitle tile 3",
                title: "Tile 3",
                isCustomTile: true,
                indicatorDataSource: {
                    path: "url/to/odata/service3/$count"
                },
                url: undefined,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {
                        CHIP: "data3"
                    },
                    catalogTile: {
                        baseChipId: "_UI2_BASE_CHIP3",
                        contracts: {},
                        configuration: {
                            row: "1",
                            col: "2"
                        }
                    }
                }
            },
            4: {
                icon: "sap-icon://workflow",
                numberUnit: "EUR",
                info: "",
                size: "2x2",
                subTitle: "Subtitle tile 4",
                title: "Tile 4",
                isCustomTile: true,
                indicatorDataSource: undefined,
                url: undefined
            },
            5: {
                title: "Tile 5",
                subTitle: "Subtitle tile 5",
                icon: "sap-icon://workflow",
                numberUnit: "EUR",
                info: "",
                size: "2x2",
                indicatorDataSource: undefined,
                isCustomTile: false,
                url: "www.sap.url.com"
            }
        };

        // Act
        return this.oService.getVisualizationData().then(function (catalogTiles) {
            // Assert
            assert.deepEqual(catalogTiles, oExpectedCatalogTiles, "The function returns correctly formatted catalog tiles.");
        });
    });

    QUnit.test("Returns a promise containing an object of formatted catalog tiles", function (assert) {
        // Arrange
        var oExpectedCatalogTiles = {
            1: {
                icon: "sap-icon://add",
                numberUnit: "EUR",
                info: "",
                size: "1x2",
                subTitle: "Subtitle tile 1",
                title: "Tile 1",
                isCustomTile: false,
                indicatorDataSource: {
                    path: "url/to/odata/service1/$count",
                    refresh: 200
                },
                url: undefined,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {
                        CHIP: "data1"
                    },
                    catalogTile: {
                        baseChipId: "_UI2_BASE_CHIP1",
                        contracts: {
                            types: {
                                availableTypes: ["standard", "standardWide", "compact"],
                                defaultType: "standard"
                            }
                        },
                        configuration: {
                            row: undefined,
                            col: undefined
                        }
                    }
                }
            },
            2: {
                icon: "sap-icon://mail",
                numberUnit: "EUR",
                info: "info 2",
                size: "2x2",
                subTitle: "Subtitle tile 2",
                title: "Tile 2",
                isCustomTile: false,
                indicatorDataSource: {
                    path: "url/to/odata/service2/$count",
                    refresh: 800
                },
                url: undefined,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {
                        CHIP: "data2"
                    },
                    catalogTile: {
                        baseChipId: "_UI2_BASE_CHIP2",
                        contracts: {},
                        configuration: {
                            row: undefined,
                            col: undefined
                        }
                    }
                }
            },
            3: {
                icon: "sap-icon://documents",
                numberUnit: "EUR",
                info: "info 3",
                size: "1x2",
                subTitle: "Subtitle tile 3",
                title: "Tile 3",
                isCustomTile: true,
                indicatorDataSource: {
                    path: "url/to/odata/service3/$count"
                },
                url: undefined,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {
                        CHIP: "data3"
                    },
                    catalogTile: {
                        baseChipId: "_UI2_BASE_CHIP3",
                        contracts: {},
                        configuration: {
                            row: "1",
                            col: "2"
                        }
                    }
                }
            },
            4: {
                icon: "sap-icon://workflow",
                numberUnit: "EUR",
                info: "",
                size: "2x2",
                subTitle: "Subtitle tile 4",
                title: "Tile 4",
                isCustomTile: true,
                indicatorDataSource: undefined,
                url: undefined
            },
            5: {
                title: "Tile 5",
                subTitle: "Subtitle tile 5",
                icon: "sap-icon://workflow",
                numberUnit: "EUR",
                info: "",
                size: "2x2",
                indicatorDataSource: undefined,
                isCustomTile: false,
                url: "www.sap.url.com"
            }
        };

        // Act
        return this.oService.getVisualizationData().then(function (catalogTiles) {
            assert.deepEqual(catalogTiles, oExpectedCatalogTiles, "The function returns correctly formatted catalog tiles.");
        });
    });

    QUnit.test("Rejects the promise when the LaunchPageAdapter throws an error.", function (assert) {
        // Arrange
        this.oLaunchPageGetCatalogsStub.returns(new jQuery.Deferred().reject("LaunchPageAdapter error").promise());
        var oExpectedError = {
            component: "sap.ushell.services.VisualizationDataProvider",
            description: "This is the translated error message.",
            detail: "LaunchPageAdapter error"
        };

        // Act
        return this.oService.getVisualizationData().catch(function (error) {
            assert.ok(this.oResourceI18nGetTextStub.calledOnce, "The getText of resource.i18n is called once");
            assert.deepEqual(this.oResourceI18nGetTextStub.getCall(0).args, [ "VisualizationDataProvider.CannotLoadData" ], "The getText of resource.i18n is called with correct parameters");
            assert.deepEqual(error, oExpectedError, "The function returns a rejected promise containing an error message.");
        }.bind(this));
    });

    QUnit.module("The function _getCatalogTileIndex", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider();

            this.oCatalogTileIndexMock = { id: "SomeResult" };
            this.oGetCatalogTileIndexStub = sandbox.stub().resolves(this.oCatalogTileIndex);
            this.oService.oLaunchPageAdapter = {
                _getCatalogTileIndex: this.oGetCatalogTileIndexStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the result of LPA._getCatalogTileIndex()", function (assert) {
        //Arrange

        //Act
        var oCatalogTileIndexPromise = this.oService._getCatalogTileIndex();

        //Assert
        return oCatalogTileIndexPromise.then(function (oCatalogTileIndex) {
            assert.strictEqual(this.oCatalogTileIndex, oCatalogTileIndex, "The right result was returned");
            assert.strictEqual(this.oGetCatalogTileIndexStub.callCount, 1, "'getCatalogTileIndex was called exactly once'");

        }.bind(this));
    });

    QUnit.test("Returns the cached promise if the request has already been triggered", function (assert) {
        //Arrange
        var oCachedCatalogTileIndexPromise = Promise.resolve();
        this.oService._oCatalogTileIndexPromise = oCachedCatalogTileIndexPromise;

        //Act
        var oCatalogTileIndexPromise = this.oService._getCatalogTileIndex();

        //Assert
        return oCatalogTileIndexPromise.then(function () {
            assert.deepEqual(oCatalogTileIndexPromise, oCachedCatalogTileIndexPromise, "The cached promise was returned");
        });
    });

});