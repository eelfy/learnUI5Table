// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for the module "cdmSiteUtils" in "sap.ushell.adapters.cdm.util.cdmSiteUtils"
 * "
 */

/* global QUnit, sinon */
sap.ui.require([
    "sap/ushell/adapters/cdm/util/cdmSiteUtils",
    "sap/ushell/adapters/cdm/util/AppForInbound",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/library"
], function (cdmSiteUtils, AppForInbound, utilsCdm, ushellLibrary) {
    "use strict";

    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getVisualizations", {
        beforeEach: function () {
            this.oUrlParsingMock = {
                id: "URLParsing"
            };

            this.oToTargetFromHashStub = sandbox.stub(utilsCdm, "toTargetFromHash");
            this.oToTargetFromHashStub.withArgs("#Action-toSample?A=B&/someInnerAppState", this.oUrlParsingMock).returns({
                semanticObject: "Action",
                action: "toSample",
                parameters: [
                    {
                        name: "A",
                        value: "B"
                    }
                ],
                appSpecificRoute: "/someInnerAppState"
            });
            this.oToTargetFromHashStub.withArgs("url-1", this.oUrlParsingMock).returns({
                type: "URL",
                url: "url-1"
            });
            this.oToTargetFromHashStub.withArgs(undefined, this.oUrlParsingMock).returns({
                type: "URL",
                url: undefined
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the visualizations from the visualization data handed over as parameter for non custom tiles", function (assert) {
        // Arrange
        var oVisualizationData = {
            "viz-1": {
                subTitle: "subTitle-1",
                icon: "icon-1",
                info: "info-1",
                numberUnit: "EUR-1",
                title: "title-1",
                size: "size-1",
                indicatorDataSource: {
                    path: "path-1",
                    refresh: 200
                },
                url: "#Action-toSample?A=B&/someInnerAppState",
                isCustomTile: false,
                _instantiationData: {
                    "I am": "a CHIP"
                }
            },
            "viz-2": {
                subTitle: "subTitle-2",
                icon: "icon-2",
                info: "info-2",
                numberUnit: "EUR-2",
                title: "title-2",
                size: "size-2",
                isCustomTile: false,
                _instantiationData: {
                    "I am": "a CHIP"
                }
            },
            "viz-3": {
                subTitle: "subTitle-2",
                icon: "icon-2",
                info: "info-2",
                numberUnit: "EUR-3",
                title: "title-2",
                size: "size-2",
                indicatorDataSource: {
                    path: "path-2",
                    refresh: 200
                },
                _instantiationData: {
                    "I am": "a CHIP"
                },
                url: "url-1",
                isCustomTile: false
            }
        };

        var oVisualizationsExpected = {
            "viz-1": {
                vizConfig: {
                    "sap.app": {
                        info: "info-1",
                        subTitle: "subTitle-1",
                        title: "title-1"
                    },
                    "sap.flp": {
                        indicatorDataSource: {
                            path: "path-1",
                            refresh: 200
                        },
                        target: {
                            semanticObject: "Action",
                            action: "toSample",
                            parameters: [
                                {
                                    name: "A",
                                    value: "B"
                                }
                            ],
                            appSpecificRoute: "/someInnerAppState"
                        },
                        tileSize: "size-1",
                        numberUnit: "EUR-1"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-1"
                        }
                    }
                },
                vizType: "sap.ushell.DynamicAppLauncher"
            },
            "viz-2": {
                vizConfig: {
                    "sap.app": {
                        info: "info-2",
                        subTitle: "subTitle-2",
                        title: "title-2"
                    },
                    "sap.flp": {
                        indicatorDataSource: undefined,
                        target: {
                            type: "URL",
                            url: undefined
                        },
                        tileSize: "size-2",
                        numberUnit: "EUR-2"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-2"
                        }
                    }
                },
                vizType: "sap.ushell.StaticAppLauncher"
            },
            "viz-3": {
                vizConfig: {
                    "sap.app": {
                        info: "info-2",
                        subTitle: "subTitle-2",
                        title: "title-2"
                    },
                    "sap.flp": {
                        indicatorDataSource: {
                            path: "path-2",
                            refresh: 200
                        },
                        target: {
                            type: "URL",
                            url: "url-1"
                        },
                        tileSize: "size-2",
                        numberUnit: "EUR-3"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-2"
                        }
                    }
                },
                vizType: "sap.ushell.DynamicAppLauncher"
            }
        };

        // Act
        var oVisualizations = cdmSiteUtils.getVisualizations(oVisualizationData, this.oUrlParsingMock);

        // Assert
        assert.deepEqual(oVisualizations, oVisualizationsExpected, "Correct visualisations were returned");
        assert.strictEqual(this.oToTargetFromHashStub.callCount, 3, "toTargetFromHash was called three times");
    });

    QUnit.test("Gets the visualizations from the visualization data handed over as parameter for custom tiles", function (assert) {
        // Arrange
        var oVisualizationData = {
            "viz-1": {
                subTitle: "subTitle-1",
                icon: "icon-1",
                info: "info-1",
                numberUnit: "EUR-1",
                title: "title-1",
                size: "size-1",
                indicatorDataSource: {
                    path: "path-1",
                    refresh: 200
                },
                url: "#Action-toSample?A=B&/someInnerAppState",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "baseChipId-1"
                    }
                }
            },
            "viz-2": {
                subTitle: "subTitle-2",
                icon: "icon-2",
                info: "info-2",
                numberUnit: "EUR-2",
                title: "title-2",
                size: "size-2",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "baseChipId-2"
                    }
                }
            },
            "viz-3": {
                subTitle: "subTitle-3",
                icon: "icon-3",
                info: "info-3",
                numberUnit: "EUR-3",
                title: "title-3",
                size: "size-3",
                indicatorDataSource: {
                    path: "path-3",
                    refresh: 200
                },
                url: "url-1",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "baseChipId-3"
                    }
                }
            }
        };

        var oVisualizationsExpected = {
            "viz-1": {
                vizConfig: {
                    "sap.app": {
                        info: "info-1",
                        subTitle: "subTitle-1",
                        title: "title-1"
                    },
                    "sap.flp": {
                        indicatorDataSource: {
                            path: "path-1",
                            refresh: 200
                        },
                        target: {
                            semanticObject: "Action",
                            action: "toSample",
                            parameters: [
                                {
                                    name: "A",
                                    value: "B"
                                }
                            ],
                            appSpecificRoute: "/someInnerAppState"
                        },
                        tileSize: "size-1",
                        _instantiationData: {
                            platform: "ABAP",
                            chip: {},
                            catalogTile: {
                                baseChipId: "baseChipId-1"
                            }
                        },
                        numberUnit: "EUR-1"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-1"
                        }
                    }
                },
                vizType: "baseChipId-1"
            },
            "viz-2": {
                vizConfig: {
                    "sap.app": {
                        info: "info-2",
                        subTitle: "subTitle-2",
                        title: "title-2"
                    },
                    "sap.flp": {
                        indicatorDataSource: undefined,
                        target: {
                            type: "URL",
                            url: undefined
                        },
                        tileSize: "size-2",
                        _instantiationData: {
                            platform: "ABAP",
                            chip: {},
                            catalogTile: {
                                baseChipId: "baseChipId-2"
                            }
                        },
                        numberUnit: "EUR-2"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-2"
                        }
                    }
                },
                vizType: "baseChipId-2"
            },
            "viz-3": {
                vizConfig: {
                    "sap.app": {
                        info: "info-3",
                        subTitle: "subTitle-3",
                        title: "title-3"
                    },
                    "sap.flp": {
                        indicatorDataSource: {
                            path: "path-3",
                            refresh: 200
                        },
                        target: {
                            type: "URL",
                            url: "url-1"
                        },
                        tileSize: "size-3",
                        _instantiationData: {
                            platform: "ABAP",
                            chip: {},
                            catalogTile: {
                                baseChipId: "baseChipId-3"
                            }
                        },
                        numberUnit: "EUR-3"
                    },
                    "sap.ui": {
                        icons: {
                            icon: "icon-3"
                        }
                    }
                },
                vizType: "baseChipId-3"
            }
        };

        // Act
        var oVisualizations = cdmSiteUtils.getVisualizations(oVisualizationData, this.oUrlParsingMock);

        // Assert
        assert.deepEqual(oVisualizations, oVisualizationsExpected, "Correct visualizations were returned");
        assert.strictEqual(this.oToTargetFromHashStub.callCount, 3, "toTargetFromHash was called three times");
    });

    QUnit.module("The function getApplications", {
        beforeEach: function () {
            this.oGetAppStub = sandbox.stub(AppForInbound, "get").returns({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Gets the applications from the navigation data handed over as parameter", function (assert) {
        // Arrange
        var oNavigationData = {
            "permanent-key-1": {
                permanentKey: "permanent-key-1"
            },
            "inbound-id-2": {
                id: "inbound-id-2"
            },
            "permanent-key-3": {
                permanentKey: "permanent-key-3"
            }
        };
        var oExpectedApplications = {
            "permanent-key-1": {},
            "inbound-id-2": {},
            "permanent-key-3": {}
        };

        // Act
        var oApplications = cdmSiteUtils.getApplications(oNavigationData);

        // Assert
        assert.deepEqual(oApplications, oExpectedApplications, "Correct applications are returned");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[0], "permanent-key-1", "The inbound id is used to .get the application.");
        assert.strictEqual(this.oGetAppStub.getCall(0).args[1], oNavigationData["permanent-key-1"], "The inbound id is used as well.");
    });

    QUnit.module("The function getVizTypes", {
        beforeEach: function () {
            this.oGetDisplayFormatsStub = sandbox.stub(cdmSiteUtils, "_getDisplayFormats").returns({
                supported: [DisplayFormat.Standard],
                default: DisplayFormat.Standard
            });
            this.oGetTileSizeStub = sandbox.stub(cdmSiteUtils, "_getTileSize");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns correct vizTypes", function (assert) {
        // Arrange
        var oVisualizationData = {
            viz1: {
                subTitle: "subTitle-1",
                icon: "icon-1",
                info: "info-1",
                numberUnit: "EUR-1",
                title: "title-1",
                size: "size-1",
                indicatorDataSource: {
                    path: "path-1",
                    refresh: 200
                },
                url: "#Action-toSample?A=B&/someInnerAppState",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "baseChipId-1"
                    }
                }
            },
            viz2: {
                subTitle: "subTitle-2",
                icon: "icon-2",
                info: "info-2",
                numberUnit: "EUR-2",
                title: "title-2",
                size: "size-2",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "baseChipId-2",
                        col: "2",
                        row: "1"
                    }
                }
            }
        };

        this.oGetTileSizeStub.withArgs(oVisualizationData.viz2._instantiationData.catalogTile).returns("1x2");

        var oExpectedVizTypes = {
            "baseChipId-1": {
                "sap.app": {
                    id: "baseChipId-1",
                    type: "platformVisualization"
                },
                "sap.flp": {
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard"],
                            default: "standard"
                        }
                    }
                }
            },
            "baseChipId-2": {
                "sap.app": {
                    id: "baseChipId-2",
                    type: "platformVisualization"
                },
                "sap.flp": {
                    tileSize: "1x2",
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard"],
                            default: "standard"
                        }
                    }
                }
            }
        };

        // Act
        var oVizTypes = cdmSiteUtils.getVizTypes(oVisualizationData);

        // Assert
        assert.deepEqual(oVizTypes, oExpectedVizTypes, "The function returns the correct vizTypes");
    });

    QUnit.test("Doesn't override vizTypes with the same key", function (assert) {
        // Arrange
        var oVisualizationData = {
            viz1: {
                subTitle: "subTitle-1",
                icon: "icon-1",
                info: "info-1",
                numberUnit: "EUR-1",
                title: "title-1",
                size: "size-1",
                indicatorDataSource: {
                    path: "path-1",
                    refresh: 200
                },
                url: "#Action-toSample?A=B&/someInnerAppState",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "identicalBaseChipId"
                    }
                }
            },
            viz2: {
                subTitle: "subTitle-2",
                icon: "icon-2",
                info: "info-2",
                numberUnit: "EUR-2",
                title: "title-2",
                size: "size-2",
                isCustomTile: true,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {
                        baseChipId: "identicalBaseChipId"
                    }
                }
            }
        };

        var oExpectedVizTypes = {
            identicalBaseChipId: {
                "sap.app": {
                    id: "identicalBaseChipId",
                    type: "platformVisualization"
                },
                "sap.flp": {
                    vizOptions: {
                        displayFormats: {
                            supported: ["standard"],
                            default: "standard"
                        }
                    }
                }
            }
        };

        // Act
        var oVizTypes = cdmSiteUtils.getVizTypes(oVisualizationData);

        // Assert
        assert.deepEqual(oVizTypes, oExpectedVizTypes, "The function returns the correct vizTypes");
        assert.strictEqual(this.oGetDisplayFormatsStub.callCount, 1, "The function doesn't override the already created vizType and therefore calls _getDisplayFormats only once.");
    });

    QUnit.module("The function _getDisplayFormats");

    QUnit.test("Returns the right display formats if types contract is not available", function (assert) {
        // Arrange
        var oCatalogTile = {
            contracts: {
                types: undefined
            }
        };

        // Act
        var oDisplayFormats = cdmSiteUtils._getDisplayFormats(oCatalogTile);

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.Standard],
            default: DisplayFormat.Standard
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.test("Returns the right display formats if chip implements the types contract", function (assert) {
        // Arrange
        var oCatalogTile = {
            contracts: {
                types: {
                    availableTypes: [DisplayFormat.Standard, DisplayFormat.Compact],
                    defaultType: DisplayFormat.Compact
                }
            }
        };

        // Act
        var oDisplayFormats = cdmSiteUtils._getDisplayFormats(oCatalogTile);

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.Standard, DisplayFormat.Compact],
            default: DisplayFormat.Compact
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.test("Maps tile types to display formats", function (assert) {
        // Arrange
        var oCatalogTile = {
            contracts: {
                types: {
                    availableTypes: ["flatwide"],
                    defaultType: "flatwide"
                }
            }
        };

        // Act
        var oDisplayFormats = cdmSiteUtils._getDisplayFormats(oCatalogTile);

        // Assert
        var oExpectedDisplayFormats = {
            supported: [DisplayFormat.FlatWide],
            default: DisplayFormat.FlatWide
        };
        assert.deepEqual(oDisplayFormats, oExpectedDisplayFormats, "The function returns the correct display formats.");
    });

    QUnit.module("The function _getTileSize");

    QUnit.test("Returns a CDM tile size from the CHIP config", function (assert) {
        //Arrange
        var oCatalogTile = {
            configuration: {
                row: "1",
                col: "2"
            }
        };

        //Act
        var sTileSize = cdmSiteUtils._getTileSize(oCatalogTile);

        //Assert
        assert.strictEqual(sTileSize, "1x2", "The correct tile size was returned");
    });

    QUnit.test("Doesn't return a tile size if there is no CHIP configuration", function (assert) {
        //Arrange
        var oCatalogTile = {};

        //Act
        var sTileSize = cdmSiteUtils._getTileSize(oCatalogTile);

        //Assert
        assert.strictEqual(sTileSize, null, "No tile size was returned");
    });

    QUnit.test("Doesn't return a tile size if the rows are missing in the CHIP configuration", function (assert) {
        //Arrange
        var oCatalogTile = {
            configuration: {
                col: "2"
            }
        };

        //Act
        var sTileSize = cdmSiteUtils._getTileSize(oCatalogTile);

        //Assert
        assert.strictEqual(sTileSize, null, "No tile size was returned");
    });

    QUnit.test("Doesn't return a tile size if the columns are missing in the CHIP configuration", function (assert) {
        //Arrange
        var oCatalogTile = {
            configuration: {
                row: "2"
            }
        };

        //Act
        var sTileSize = cdmSiteUtils._getTileSize(oCatalogTile);

        //Assert
        assert.strictEqual(sTileSize, null, "No tile size was returned");
    });
});
