// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SearchableContent
 */
sap.ui.require([
    "sap/ushell/services/SearchableContent",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/Config"
], function (
    SearchableContent,
    readApplications,
    readPages,
    readUtils,
    Config
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor");

    QUnit.test("Initial Properties are set correctly", function (assert) {
        //Act
        var oSearchableContentService = new SearchableContent();

        //Assert
        assert.deepEqual(Object.keys(oSearchableContentService), [], "SearchableContent has no properties");
        assert.strictEqual(SearchableContent.COMPONENT_NAME, "sap/ushell/services/SearchableContent", "initial value was succesfully set");
    });

    QUnit.module("The getApps function", {
        beforeEach: function () {
            this.aAppDataMock = [
                {
                    id: "firstApp"
                },
                {
                    id: "secondApp"
                }
            ];
            this.aReducedAppDataMock = [
                {
                    id: "firstApp"
                }
            ];
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);

            this.oSearchableContentService = new SearchableContent();

            this.oGetPagesAppDataStub = sandbox.stub(this.oSearchableContentService, "_getPagesAppData");
            this.oGetPagesAppDataStub.resolves(this.aAppDataMock);
            this.oGetLaunchPageAppDataStub = sandbox.stub(this.oSearchableContentService, "_getLaunchPageAppData");
            this.oGetLaunchPageAppDataStub.resolves(this.aAppDataMock);
            this.oFilterGetAppsStub = sandbox.stub(this.oSearchableContentService, "_filterGetApps");
            this.oFilterGetAppsStub.withArgs(this.aAppDataMock).resolves(this.aReducedAppDataMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct values is spaces is enabled", function (assert) {
        // Arrange
        // Act
        return this.oSearchableContentService.getApps().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, this.aReducedAppDataMock, "The correct result was returned");
            assert.strictEqual(this.oGetPagesAppDataStub.callCount, 1, "_getAllPagesVisualizations was called once");
            assert.strictEqual(this.oFilterGetAppsStub.callCount, 1, "_filterGetApps was called once");
        }.bind(this));
    });

    QUnit.test("Returns an empty array if spaces is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        return this.oSearchableContentService.getApps().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, this.aReducedAppDataMock, "The correct result was returned");
            assert.strictEqual(this.oGetLaunchPageAppDataStub.callCount, 1, "_getAllPagesVisualizations was called once");
            assert.strictEqual(this.oFilterGetAppsStub.callCount, 1, "_filterGetApps was called once");
        }.bind(this));
    });

    QUnit.module("The _filterGetApps function", {
        beforeEach: function () {
            this.aAppDataMock = [
                {
                    id: "appId1Mock",
                    title: "appTitleMock",
                    subtitle: "appSubtitleMock",
                    icon: "appIconMock",
                    info: "appInfoMock",
                    keywords: ["appKeywordMock"],
                    target: {
                        id: "targetMock"
                    },
                    visualizations: [
                        {
                            id: "vizDataId1Mock",
                            vizId: "vizDataVizIdMock",
                            vizTypeId: "vizDataVizTypeMock",
                            title: "vizDataTitleMock",
                            subtitle: "vizDataSubtitleMock",
                            icon: "vizDataIconMock",
                            info: "vizDataInfoMock",
                            keywords: ["vizDataKeywordMock"],
                            target: {
                                id: "targetMock"
                            }
                        }, {
                            id: "vizDataId2Mock",
                            vizId: "vizDataVizIdMock",
                            vizTypeId: "vizDataVizTypeMock",
                            title: "vizDataTitleMock",
                            subtitle: "vizDataSubtitleMock",
                            icon: "vizDataIconMock",
                            info: "vizDataInfoMock",
                            keywords: ["vizDataKeywordMock"],
                            target: {
                                id: "targetMock"
                            }
                        }, {
                            id: "vizDataId3Mock",
                            vizId: "vizDataVizIdMock",
                            vizTypeId: "vizDataVizTypeMock",
                            title: "ImSpecial",
                            subtitle: "vizDataSubtitleMock",
                            icon: "vizDataIconMock",
                            info: "vizDataInfoMock",
                            keywords: ["vizDataKeywordMock"],
                            target: {
                                id: "targetMock"
                            }
                        }
                    ]
                },
                {
                    id: "appId2Mock",
                    title: "ImEmpty",
                    subtitle: "appSubtitleMock",
                    icon: "appIconMock",
                    info: "appInfoMock",
                    keywords: ["appKeywordMock"],
                    target: {
                        id: "targetMock"
                    },
                    visualizations: []
                }
            ];
            this.aExpectedAppData = [
                {
                    id: "appId1Mock",
                    title: "appTitleMock",
                    subtitle: "appSubtitleMock",
                    icon: "appIconMock",
                    info: "appInfoMock",
                    keywords: ["appKeywordMock"],
                    target: {
                        id: "targetMock"
                    },
                    visualizations: [
                        {
                            id: "vizDataId1Mock",
                            vizId: "vizDataVizIdMock",
                            vizTypeId: "vizDataVizTypeMock",
                            title: "vizDataTitleMock",
                            subtitle: "vizDataSubtitleMock",
                            icon: "vizDataIconMock",
                            info: "vizDataInfoMock",
                            keywords: ["vizDataKeywordMock"],
                            target: {
                                id: "targetMock"
                            }
                        }, {
                            id: "vizDataId3Mock",
                            vizId: "vizDataVizIdMock",
                            vizTypeId: "vizDataVizTypeMock",
                            title: "ImSpecial",
                            subtitle: "vizDataSubtitleMock",
                            icon: "vizDataIconMock",
                            info: "vizDataInfoMock",
                            keywords: ["vizDataKeywordMock"],
                            target: {
                                id: "targetMock"
                            }
                        }
                    ]
                }
            ];
            this.oSearchableContentService = new SearchableContent();
        }
    });

    QUnit.test("Filters duplicates and empty applications", function (assert) {
        // Arrange
        // Act
        var aResult = this.oSearchableContentService._filterGetApps(this.aAppDataMock);
        // Assert
        assert.deepEqual(aResult, this.aExpectedAppData, "returned the correct result");
    });

    QUnit.module("The _getLaunchPageAppData function", {
        beforeEach: function () {
            this.oLaunchPageServiceMock = {
                id: "LaunchPageServiceMock"
            };

            this.aLaunchPageTileMock = [
                {
                    id: "Tile1"
                },
                {
                    id: "Tile2"
                },
                {
                    id: "Tile3"
                },
                {
                    id: "Tile3"
                }
            ];

            this.aVizDataMock = [
                {
                    id: "vizData1",
                    targetURL: "#Action-toSample1"
                },
                {
                    id: "vizData2",
                    targetURL: "#Action-toSample1"
                },
                undefined,
                {
                    id: "vizData4",
                    targetURL: "#Action-toSample2"
                }
            ];

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oGetServiceAsyncStub.withArgs("LaunchPage").resolves(this.oLaunchPageServiceMock);

            this.oSearchableContentService = new SearchableContent();

            this.oCollectLaunchPageTilesStub = sandbox.stub(this.oSearchableContentService, "_collectLaunchPageTiles");
            this.oCollectLaunchPageTilesStub.resolves(this.aLaunchPageTileMock);
            this.oBuildVizDataFromLaunchPageTileStub = sandbox.stub(this.oSearchableContentService, "_buildVizDataFromLaunchPageTile");
            this.oBuildVizDataFromLaunchPageTileStub.callsFake(function (oTile) {
                var iIndex = this.aLaunchPageTileMock.indexOf(oTile);
                return this.aVizDataMock[iIndex];
            }.bind(this));
            this.oBuildAppDataFromVizStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromViz");
            this.oBuildAppDataFromVizStub.callsFake(function (oVizData) {
                return {
                    id: oVizData.targetURL,
                    visualizations: [oVizData]
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct value", function (assert) {
        // Arrange
        var aExpectedResult = [
            {
                id: "#Action-toSample1",
                visualizations: [
                    {
                        id: "vizData1",
                        targetURL: "#Action-toSample1"
                    },
                    {
                        id: "vizData2",
                        targetURL: "#Action-toSample1"
                    }
                ]
            },
            {
                id: "#Action-toSample2",
                visualizations: [
                    {
                        id: "vizData4",
                        targetURL: "#Action-toSample2"
                    }
                ]
            }
        ];
        // Act
        return this.oSearchableContentService._getLaunchPageAppData().then(function (aResult) {
            //Assert
            assert.deepEqual(aResult, aExpectedResult, "Returned the correct result");
            assert.strictEqual(this.oSearchableContentService._oLaunchPageService, this.oLaunchPageServiceMock, "LaunchPageService was set");

            assert.strictEqual(this.oCollectLaunchPageTilesStub.callCount, 1, "_collectLaunchPageTiles was called once");
            assert.strictEqual(this.oBuildVizDataFromLaunchPageTileStub.callCount, 4, "_buildVizDataFromLaunchPageTile was called four times");
            assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 2, "_buildAppDataFromViz was called twice");

        }.bind(this));
    });

    QUnit.module("The _collectLaunchPageTiles function", {
        beforeEach: function () {
            this.aCatalogsMock = [
                {
                    id: "Catalog1"
                },
                {
                    id: "Catalog2"
                }
            ];
            this.aCatalogTilesMock = [
                [
                    {
                        id: "CatalogTile1"
                    },
                    {
                        id: "CatalogTile2"
                    }
                ],
                [
                    {
                        id: "CatalogTile3"
                    }
                ]
            ];
            this.aGroupsMock = [
                {
                    id: "Group1"
                },
                {
                    id: "Group2"
                }
            ];
            this.aGroupTilesMock = [
                [
                    {
                        id: "GroupTile1"
                    },
                    {
                        id: "GroupTile2"
                    }
                ],
                [
                    {
                        id: "GroupTile3"
                    }
                ]
            ];

            this.oSearchableContentService = new SearchableContent();

            this.oGetCatalogsStub = sandbox.stub();
            this.oGetCatalogsStub.returns(new jQuery.Deferred().resolve(this.aCatalogsMock));
            this.oGetCatalogTilesStub = sandbox.stub();
            this.oGetCatalogTilesStub.callsFake(function (oCatalog) {
                var iIndex = this.aCatalogsMock.indexOf(oCatalog);
                return new jQuery.Deferred().resolve(this.aCatalogTilesMock[iIndex]);
            }.bind(this));
            this.oGetGroupsStub = sandbox.stub();
            this.oGetGroupsStub.returns(new jQuery.Deferred().resolve(this.aGroupsMock));
            this.oGetGroupTilesStub = sandbox.stub();
            this.oGetGroupTilesStub.callsFake(function (oGroup) {
                var iIndex = this.aGroupsMock.indexOf(oGroup);
                return this.aGroupTilesMock[iIndex];
            }.bind(this));

            this.oSearchableContentService._oLaunchPageService = {
                getCatalogs: this.oGetCatalogsStub,
                getCatalogTiles: this.oGetCatalogTilesStub,
                getGroups: this.oGetGroupsStub,
                getGroupTiles: this.oGetGroupTilesStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        var aExpectedResult = [
            {
                id: "CatalogTile1"
            },
            {
                id: "CatalogTile2"
            },
            {
                id: "CatalogTile3"
            },
            {
                id: "GroupTile1"
            },
            {
                id: "GroupTile2"
            },
            {
                id: "GroupTile3"
            }
        ];
        // Act
        return this.oSearchableContentService._collectLaunchPageTiles().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "Returned the correct result");

            assert.strictEqual(this.oGetCatalogsStub.callCount, 1, "getCatalogs was called once");
            assert.strictEqual(this.oGetCatalogTilesStub.callCount, 2, "getCatalogTiles was called twice");
            assert.strictEqual(this.oGetGroupsStub.callCount, 1, "getGroups was called once");
            assert.strictEqual(this.oGetGroupTilesStub.callCount, 2, "getGroupTiles was called twice");
        }.bind(this));
    });

    QUnit.module("The _getPagesAppData function", {
        beforeEach: function () {
            this.aPagesMock = [
                {
                    id: "page1"
                }
            ];
            this.oSiteMock = {
                visualizations: {
                    id: "visualizations"
                },
                applications: {
                    app1: {
                        id: "app1"
                    }
                },
                vizTypes: {
                    id: "vizTypes"
                }
            };
            this.oURLParsingMock = {
                id: "URLParsing"
            };
            this.oCSTRMock = {
                id: "ClientSideTargetResolution"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oGetAllPagesStub = sandbox.stub();
            this.oGetAllPagesStub.resolves(this.aPagesMock);
            this.oGetApplicationsStub = sandbox.stub();
            this.oGetApplicationsStub.resolves(this.oSiteMock.applications);
            this.oGetVisualizationsStub = sandbox.stub();
            this.oGetVisualizationsStub.resolves(this.oSiteMock.visualizations);
            this.oGetVizTypesStub = sandbox.stub();
            this.oGetVizTypesStub.resolves(this.oSiteMock.vizTypes);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getAllPages: this.oGetAllPagesStub,
                getApplications: this.oGetApplicationsStub,
                getVisualizations: this.oGetVisualizationsStub,
                getVizTypes: this.oGetVizTypesStub
            });

            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(this.oURLParsingMock);

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves(this.oCSTRMock);

            this.oSearchableContentService = new SearchableContent();

            this.oApplyCdmVisualizationsStub = sandbox.stub(this.oSearchableContentService, "_applyCdmVisualizations");
            this.oApplyCdmVisualizationsStub.withArgs(this.oSiteMock, sinon.match.any, this.oURLParsingMock).callsFake(function (oSite, oAppData, oUrlParsing) {
                oAppData._applyCdmVisualizations = {
                    id: "_applyCdmVisualizations was here"
                };
            });

            this.oApplyCdmPagesStub = sandbox.stub(this.oSearchableContentService, "_applyCdmPages");
            this.oApplyCdmPagesStub.withArgs(this.oSiteMock, this.aPagesMock, sinon.match.any, this.oURLParsingMock).callsFake(function (oSite, aPages, oAppData, oUrlParsing) {
                oAppData._applyCdmPages = {
                    id: "_applyCdmPages was here"
                };
            });

            this.oFilterAppDataByIntentStub = sandbox.stub(this.oSearchableContentService, "_filterAppDataByIntent");
            this.oFilterAppDataByIntentStub.withArgs(sinon.match.any, this.oURLParsingMock, this.oCSTRMock).callsFake(function (oAppData, oUrlParsing, oCSTR) {
                oAppData._filterAppDataByIntent = {
                    id: "_filterAppDataByIntent was here"
                };
            });

            this.oApplyCdmApplicationsStub = sandbox.stub(this.oSearchableContentService, "_applyCdmApplications");
            this.oApplyCdmApplicationsStub.withArgs(this.oSiteMock, sinon.match.any).callsFake(function (oSite, oAppData) {
                oAppData._applyCdmApplications = {
                    id: "_applyCdmApplications was here"
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct Result", function (assert) {

        // Arrange
        var aExpectedResult = [
            {
                id: "_applyCdmVisualizations was here"
            },
            {
                id: "_applyCdmPages was here"
            },
            {
                id: "_filterAppDataByIntent was here"
            },
            {
                id: "_applyCdmApplications was here"
            }
        ];
        // Act
        return this.oSearchableContentService._getPagesAppData().then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "returned the correct result");
            assert.strictEqual(this.oApplyCdmApplicationsStub.callCount, 1, "_applyCdmApplications was called once");
            assert.strictEqual(this.oApplyCdmPagesStub.callCount, 1, "_applyCdmPages was called once");
        }.bind(this));
    });

    QUnit.module("The _filterAppDataByIntent, function", {
        beforeEach: function () {
            this.oIsIntentUrlStub = sandbox.stub();
            this.oIsIntentUrlStub.returns(true);
            this.oURLParsingMock = {
                isIntentUrl: this.oIsIntentUrlStub
            };

            this.oSupportedMock = {
                "#Action-toSample": {
                    supported: true
                },
                "#Action-toNotSupported": {
                    supported: false
                }
            };

            this.oIsIntentSupportedStub = sandbox.stub();
            this.oIsIntentSupportedStub.returns(new jQuery.Deferred().resolve(this.oSupportedMock));
            this.oCSTRMock = {
                isIntentSupported: this.oIsIntentSupportedStub
            };
            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters unsupported intents", function (assert) {
        // Arrange
        var oAppData = {
            "#Action-toSample": {
                id: "#Action-toSample"
            },
            "#Action-toNotSupported": {
                id: "#Action-toNotSupported"
            }
        };
        var oExpectedAppData = {
            "#Action-toSample": {
                id: "#Action-toSample"
            }
        };
        //Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oURLParsingMock, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "applied the correct result");

            assert.strictEqual(this.oIsIntentUrlStub.callCount, 2, "isIntentUrl was called twice");
            assert.strictEqual(this.oIsIntentSupportedStub.callCount, 1, "isIntentSupported was called once");
        }.bind(this));
    });

    QUnit.test("Keeps url targets", function (assert) {
        // Arrange
        this.oIsIntentUrlStub.withArgs("www.sap.com").returns(false);
        var oAppData = {
            "www.sap.com": {
                id: "www.sap.com"
            }
        };
        var oExpectedAppData = {
            "www.sap.com": {
                id: "www.sap.com"
            }
        };
        //Act
        return this.oSearchableContentService._filterAppDataByIntent(oAppData, this.oURLParsingMock, this.oCSTRMock).then(function () {
            // Assert
            assert.deepEqual(oAppData, oExpectedAppData, "applied the correct result");

            assert.strictEqual(this.oIsIntentUrlStub.callCount, 1, "isIntentUrl was called once");
            assert.strictEqual(this.oIsIntentSupportedStub.callCount, 0, "isIntentSupported was not called");
        }.bind(this));
    });

    QUnit.module("The _applyCdmApplications function", {
        beforeEach: function () {
            this.oSiteMock = {
                visualizations: {
                    id: "visualizations"
                },
                applications: {
                    someAppId: {
                        id: "someAppId"
                    }
                }
            };
            this.oInboundMock = {
                id: "someInboundId"
            };

            this.oAppDataMock = {
                toAppWithAppId: {
                    visualizations: [
                        {
                            target: {
                                appId: "someAppId",
                                inboundId: "someInboundId"
                            }
                        }
                    ]
                },
                toAppWithSemanticObject: {
                    visualizations: [
                        {
                            target: {
                                semanticObject: "someSemanticObject",
                                action: "someAction"
                            }
                        }
                    ]
                }
            };

            this.oGetInboundsStub = sandbox.stub(readApplications, "getInbound");
            this.oGetInboundsStub.withArgs(this.oSiteMock.applications.someAppId, "someInboundId").returns(this.oInboundMock);

            this.oSearchableContentService = new SearchableContent();

            this.oBuildAppDataFromVizStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromViz");
            this.oBuildAppDataFromVizStub.withArgs(this.oAppDataMock.toAppWithSemanticObject.visualizations[0])
                .returns({
                    id: "builtWithVizData"
                });
            this.oBuildAppDataFromAppAndInboundStub = sandbox.stub(this.oSearchableContentService, "_buildAppDataFromAppAndInbound");
            this.oBuildAppDataFromAppAndInboundStub.withArgs(this.oSiteMock.applications.someAppId, this.oInboundMock)
                .returns({
                    id: "builtWithAppData"
                });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds appData based on application", function (assert) {
        // Arrange
        delete this.oAppDataMock.toAppWithSemanticObject;

        var oExpectedAppData = {
            toAppWithAppId: {
                id: "builtWithAppData",
                target: {
                    appId: "someAppId",
                    inboundId: "someInboundId"
                },
                visualizations: [
                    {
                        target: {
                            appId: "someAppId",
                            inboundId: "someInboundId"
                        }
                    }
                ]
            }
        };
        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock);
        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");

        assert.strictEqual(this.oBuildAppDataFromAppAndInboundStub.callCount, 1, "_buildAppDataFromAppAndInbound was called once");
        assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 0, "_buildAppDataFromViz was not called");
    });

    QUnit.test("Adds appData based on vizData", function (assert) {
        // Arrange
        delete this.oAppDataMock.toAppWithAppId;

        var oExpectedAppData = {
            toAppWithSemanticObject: {
                id: "builtWithVizData",
                target: {
                    semanticObject: "someSemanticObject",
                    action: "someAction"
                },
                visualizations: [
                    {
                        target: {
                            semanticObject: "someSemanticObject",
                            action: "someAction"
                        }
                    }
                ]
            }
        };
        // Act
        this.oSearchableContentService._applyCdmApplications(this.oSiteMock, this.oAppDataMock);
        // Assert
        assert.deepEqual(this.oAppDataMock, oExpectedAppData, "applied the correct result");

        assert.strictEqual(this.oBuildAppDataFromAppAndInboundStub.callCount, 0, "_buildAppDataFromAppAndInbound was not called");
        assert.strictEqual(this.oBuildAppDataFromVizStub.callCount, 1, "_buildAppDataFromViz was called once");
    });

    QUnit.module("The _applyCdmVisualizations function", {
        beforeEach: function () {
            this.oSiteMock = {
                visualizations: {
                    viz1: {
                        id: "viz1"
                    },
                    viz2: {
                        id: "viz2"
                    }
                }
            };

            this.oURLParsingMock = {
                id: "URLParsing"
            };

            this.oGetVizDataStub = sandbox.stub(readUtils, "getVizData");
            this.oGetVizDataStub.withArgs(this.oSiteMock, sinon.match.any, this.oURLParsingMock).callsFake(function (oSite, oVizRef, oUrlParsing) {
                return {
                    id: oVizRef.vizId,
                    targetURL: "#Action-toSample"
                };
            });

            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        var oAppData = {};
        var oExpectedAppData = {
            "#Action-toSample": {
                visualizations: [
                    {
                        id: "viz1",
                        targetURL: "#Action-toSample"
                    },
                    {
                        id: "viz2",
                        targetURL: "#Action-toSample"
                    }
                ]
            }
        };
        // Act
        this.oSearchableContentService._applyCdmVisualizations(this.oSiteMock, oAppData, this.oURLParsingMock);
        // Assert
        assert.deepEqual(oAppData, oExpectedAppData, "Applied the correct result");
    });

    QUnit.module("The _applyCdmPages function", {
        beforeEach: function () {
            this.aPagesMock = [
                {
                    id: "page1"
                },
                {
                    id: "page2"
                }
            ];
            this.aVizRefMock = [
                [
                    {
                        id: "vizRef1",
                        targetURL: "#Action-toSample1"
                    },
                    {
                        id: "vizRef2",
                        targetURL: "#Action-toSample2"
                    }
                ], [
                    {
                        id: "vizRef3",
                        targetURL: "#Action-toSample1"
                    }
                ]
            ];
            this.oSiteMock = {
                id: "site"
            };
            this.oURLParsingMock = {
                id: "URLParsing"
            };

            this.oGetVisualizationReferencesStub = sandbox.stub(readPages, "getVisualizationReferences");
            this.oGetVisualizationReferencesStub.withArgs(this.aPagesMock[0]).returns(this.aVizRefMock[0]);
            this.oGetVisualizationReferencesStub.withArgs(this.aPagesMock[1]).returns(this.aVizRefMock[1]);

            this.oGetVizDataStub = sandbox.stub(readUtils, "getVizData");
            this.oGetVizDataStub.withArgs(this.oSiteMock, sinon.match.any, this.oURLParsingMock).callsFake(function (oSite, oVizRef) {
                return oVizRef;
            });

            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds vizData to existing appData and creates new appData", function (assert) {
        // Arrange
        var oAppData = {};
        var oExpectedResult = {
            "#Action-toSample1": {
                visualizations: [
                    {
                        id: "vizRef1",
                        targetURL: "#Action-toSample1"
                    },
                    {
                        id: "vizRef3",
                        targetURL: "#Action-toSample1"
                    }
                ]
            },
            "#Action-toSample2": {
                visualizations: [
                    {
                        id: "vizRef2",
                        targetURL: "#Action-toSample2"
                    }
                ]
            }
        };
        // Act
        this.oSearchableContentService._applyCdmPages(this.oSiteMock, this.aPagesMock, oAppData, this.oURLParsingMock);
        // Assert
        assert.deepEqual(oAppData, oExpectedResult, "returned the correct result");
        assert.strictEqual(this.oGetVisualizationReferencesStub.callCount, 2, "getVisualizationReferences was called twice");
        assert.strictEqual(this.oGetVizDataStub.callCount, 3, "getVizData was called three times");
    });

    QUnit.module("The _buildAppDataFromAppAndInbound function", {
        beforeEach: function () {
            this.oApplicationMock = {
                id: "application"
            };
            this.oGetIdStub = sandbox.stub(readApplications, "getId");
            this.oGetIdStub.withArgs(this.oApplicationMock).returns("id");
            this.oGetTitleStub = sandbox.stub(readApplications, "getTitle");
            this.oGetTitleStub.withArgs(this.oApplicationMock).returns("title");
            this.oGetSubTitleStub = sandbox.stub(readApplications, "getSubTitle");
            this.oGetSubTitleStub.withArgs(this.oApplicationMock).returns("subTitle");
            this.oGetIconStub = sandbox.stub(readApplications, "getIcon");
            this.oGetIconStub.withArgs(this.oApplicationMock).returns("icon");
            this.oGetInfoStub = sandbox.stub(readApplications, "getInfo");
            this.oGetInfoStub.withArgs(this.oApplicationMock).returns("info");
            this.oGetKeywordsStub = sandbox.stub(readApplications, "getKeywords");
            this.oGetKeywordsStub.withArgs(this.oApplicationMock).returns(["keywords"]);

            this.oSearchableContentService = new SearchableContent();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns correct appData with empty inbound", function (assert) {
        // Arrange
        var oInbound = {};
        var oExpectedResult = {
            id: "id",
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            info: "info",
            keywords: ["keywords"],
            visualizations: []
        };
        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(this.oApplicationMock, oInbound);
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 1, "getTitle was called once");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 1, "getSubTitle was called once");
        assert.strictEqual(this.oGetIconStub.callCount, 1, "getIcon was called once");
        assert.strictEqual(this.oGetInfoStub.callCount, 1, "getInfo was called once");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 1, "getKeywords was called once");
    });

    QUnit.test("Returns correct appData with an inbound", function (assert) {
        // Arrange
        var oInbound = {
            title: "inboundTitle",
            subTitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"]
        };
        var oExpectedResult = {
            id: "id",
            title: "inboundTitle",
            subtitle: "inboundSubTitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            keywords: ["inboundKeywords"],
            visualizations: []
        };
        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromAppAndInbound(this.oApplicationMock, oInbound);
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct Result");

        assert.strictEqual(this.oGetIdStub.callCount, 1, "getId was called once");
        assert.strictEqual(this.oGetTitleStub.callCount, 0, "getTitle was not called");
        assert.strictEqual(this.oGetSubTitleStub.callCount, 0, "getSubTitle was not called");
        assert.strictEqual(this.oGetIconStub.callCount, 0, "getIcon was not called");
        assert.strictEqual(this.oGetInfoStub.callCount, 0, "getInfo was not called");
        assert.strictEqual(this.oGetKeywordsStub.callCount, 0, "getKeywords was not called");
    });

    QUnit.module("The _buildAppDataFromViz function", {
        beforeEach: function () {
            this.oSearchableContentService = new SearchableContent();
        }
    });

    QUnit.test("Builds tha appData based on vizData", function (assert) {
        // Arrange
        var oVizData = {
            id: "idMock",
            vizId: "vizIdMock",
            title: "titleMock",
            subtitle: "subtitleMock",
            icon: "iconMock",
            info: "infoMock",
            keywords: ["keywordsMock"],
            target: {
                id: "targetMock"
            }
        };
        var oExpectedResult = {
            id: "vizIdMock",
            title: "titleMock",
            subtitle: "subtitleMock",
            icon: "iconMock",
            info: "infoMock",
            keywords: ["keywordsMock"],
            target: {
                id: "targetMock"
            },
            visualizations: [
                {
                    id: "idMock",
                    vizId: "vizIdMock",
                    title: "titleMock",
                    subtitle: "subtitleMock",
                    icon: "iconMock",
                    info: "infoMock",
                    keywords: ["keywordsMock"],
                    target: {id: "targetMock"}
                }
            ]
        };
        // Act
        var oResult = this.oSearchableContentService._buildAppDataFromViz(oVizData);
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.module("The _buildVizDataFromLaunchPageTile function", {
        beforeEach: function () {
            this.oDestroyStub = sandbox.stub();
            this.oViewMock = {
                destroy: this.oDestroyStub
            };
            this.oFirstOptionTileMock = {
                id: "FirstOptionTile"
            };
            this.oSecondOptionTileMock = {
                id: "SecondOptionTile"
            };
            this.oThirdOptionTileMock = {
                id: "ThirdOptionTile"
            };

            this.oSearchableContentService = new SearchableContent();

            this.oIsTileIntentSupportedStub = sandbox.stub();
            this.oIsTileIntentSupportedStub.withArgs(this.oFirstOptionTileMock).returns(true);
            this.oIsTileIntentSupportedStub.withArgs(this.oSecondOptionTileMock).returns(true);
            this.oIsTileIntentSupportedStub.withArgs(this.oThirdOptionTileMock).returns(true);
            this.oGetCatalogTileTargetURLStub = sandbox.stub();
            this.oGetCatalogTileTargetURLStub.withArgs(this.oFirstOptionTileMock).returns("someUrl");
            this.oGetCatalogTileTargetURLStub.withArgs(this.oSecondOptionTileMock).returns("someUrl");
            this.oGetCatalogTileTargetURLStub.withArgs(this.oThirdOptionTileMock).returns("someUrl");
            this.oGetCatalogTileViewStub = sandbox.stub();
            this.oGetCatalogTileViewStub.withArgs(this.oSecondOptionTileMock).returns(this.oViewMock);
            this.oGetCatalogTileViewStub.withArgs(this.oThirdOptionTileMock).returns(this.oViewMock);
            this.oGetTileIdStub = sandbox.stub();
            this.oGetTileIdStub.withArgs(this.oFirstOptionTileMock).returns("tileId");
            this.oGetTileIdStub.withArgs(this.oThirdOptionTileMock).returns("tileId");
            this.oGetCatalogTileIdStub = sandbox.stub();
            this.oGetCatalogTileIdStub.withArgs(this.oFirstOptionTileMock).returns("catalogTileId");
            this.oGetCatalogTileIdStub.withArgs(this.oSecondOptionTileMock).returns("catalogTileId");
            this.oGetCatalogTilePreviewTitleStub = sandbox.stub();
            this.oGetCatalogTilePreviewTitleStub.withArgs(this.oFirstOptionTileMock).returns("previewTitle");
            this.oGetCatalogTileTitleStub = sandbox.stub();
            this.oGetCatalogTileTitleStub.withArgs(this.oSecondOptionTileMock).returns("catalogTitle");
            this.oGetTileTitleStub = sandbox.stub();
            this.oGetTileTitleStub.withArgs(this.oThirdOptionTileMock).returns("tileTitle");
            this.oGetCatalogTilePreviewSubtitleStub = sandbox.stub();
            this.oGetCatalogTilePreviewSubtitleStub.withArgs(this.oFirstOptionTileMock).returns("previewSubtitle");
            this.oGetCatalogTilePreviewIconStub = sandbox.stub();
            this.oGetCatalogTilePreviewIconStub.withArgs(this.oFirstOptionTileMock).returns("previewIcon");
            this.oGetCatalogTilePreviewInfoStub = sandbox.stub();
            this.oGetCatalogTilePreviewInfoStub.withArgs(this.oFirstOptionTileMock).returns("previewInfo");
            this.oGetCatalogTileKeywordsStub = sandbox.stub();
            this.oGetCatalogTileKeywordsStub.withArgs(this.oFirstOptionTileMock).returns(["previewKeyword"]);

            this.oSearchableContentService._oLaunchPageService = {
                isTileIntentSupported: this.oIsTileIntentSupportedStub,
                getCatalogTileTargetURL: this.oGetCatalogTileTargetURLStub,
                getCatalogTileView: this.oGetCatalogTileViewStub,
                getTileId: this.oGetTileIdStub,
                getCatalogTileId: this.oGetCatalogTileIdStub,
                getCatalogTilePreviewTitle: this.oGetCatalogTilePreviewTitleStub,
                getCatalogTileTitle: this.oGetCatalogTileTitleStub,
                getTileTitle: this.oGetTileTitleStub,
                getCatalogTilePreviewSubtitle: this.oGetCatalogTilePreviewSubtitleStub,
                getCatalogTilePreviewIcon: this.oGetCatalogTilePreviewIconStub,
                getCatalogTilePreviewInfo: this.oGetCatalogTilePreviewInfoStub,
                getCatalogTileKeywords: this.oGetCatalogTileKeywordsStub
            };

            this.oExpectedResult = {
                id: "tileId",
                vizId: "catalogTileId",
                vizTypeId: "",
                target: {
                    type: "URL",
                    url: "someUrl"
                },
                targetURL: "someUrl"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result if every property is present", function (assert) {
        // Arrange
        this.oExpectedResult.title = "previewTitle";
        this.oExpectedResult.subtitle = "previewSubtitle";
        this.oExpectedResult.icon = "previewIcon";
        this.oExpectedResult.info = "previewInfo";
        this.oExpectedResult.keywords = ["previewKeyword"];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oFirstOptionTileMock
        };
        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock);
        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Returns the correct result for first fallback", function (assert) {
        // Arrange
        this.oExpectedResult.id = "catalogTileId";
        this.oExpectedResult.title = "catalogTitle";
        this.oExpectedResult.subtitle = "";
        this.oExpectedResult.icon = "sap-icon://business-objects-experience";
        this.oExpectedResult.info = "";
        this.oExpectedResult.keywords = [];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oSecondOptionTileMock
        };
        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oSecondOptionTileMock);
        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Returns the correct result for second fallback", function (assert) {
        // Arrange
        this.oExpectedResult.vizId = "tileId";
        this.oExpectedResult.title = "tileTitle";
        this.oExpectedResult.subtitle = "";
        this.oExpectedResult.icon = "sap-icon://business-objects-experience";
        this.oExpectedResult.info = "";
        this.oExpectedResult.keywords = [];
        this.oExpectedResult._instantiationData = {
            platform: "LAUNCHPAGE",
            launchPageTile: this.oThirdOptionTileMock
        };
        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oThirdOptionTileMock);
        // Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Returned the correct Result");
    });

    QUnit.test("Creates and destroys the view if needed", function (assert) {
        // Arrange
        // Act
        this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oSecondOptionTileMock);
        // Assert
        assert.strictEqual(this.oGetCatalogTileViewStub.callCount, 1, "getCatalogTileView was called once");
        assert.strictEqual(this.oDestroyStub.callCount, 1, "destroy was called once");
    });

    QUnit.test("Throws an error if destroy is not implemented", function (assert) {
        // Arrange
        this.oGetCatalogTileViewStub.withArgs(this.oThirdOptionTileMock).returns({});
        // Act
        try {
            this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oThirdOptionTileMock);
        } catch (oError) {
            // Assert
            assert.strictEqual(oError.message, "The tileview \"tileTitle\" with target url \"someUrl\" does not implement mandatory function destroy!", "The correct messag was returned");
            assert.strictEqual(this.oGetCatalogTileViewStub.callCount, 1, "getCatalogTileView was called once");
        }
    });

    QUnit.test("Returns undefined if target url is missing", function (assert) {
        // Arrange
        this.oGetCatalogTileTargetURLStub.withArgs(this.oFirstOptionTileMock).returns();
        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock);
        // Assert
        assert.deepEqual(oResult, undefined, "Returned the correct Result");
    });

    QUnit.test("Returns undefined if tile intent is not supported", function (assert) {
        // Arrange
        this.oIsTileIntentSupportedStub.withArgs(this.oFirstOptionTileMock).returns(false);
        // Act
        var oResult = this.oSearchableContentService._buildVizDataFromLaunchPageTile(this.oFirstOptionTileMock);
        // Assert
        assert.deepEqual(oResult, undefined, "Returned the correct Result");
    });
});