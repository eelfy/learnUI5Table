
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HomepageManager.PersistentPageOperationAdapter
 */


sap.ui.require([
    "sap/ushell/components/_HomepageManager/PersistentPageOperationAdapter",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/ui/performance/Measurement",
    "sap/ushell/services/Container"
], function (
    PersistentPageOperationAdapter,
    HomepageManager,
    EventHub,
    Config,
    jQuery,
    Measurement,
    Container
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    /*global QUnit, sinon */
    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter () {
        var oAdapter = sap.ushell.Container.getService("LaunchPage");
        jQuery.extend(oAdapter, {
            moveTile: function () { return new jQuery.Deferred().resolve(); },
            getTileView: function () {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve({
                    destroy: function () {},
                    attachPress: function () {}
                });
                return oDfd.promise();
            },
            getTileId: function (oTile) {
                if (oTile) {
                    return oTile.id;
                }
            },
            getTileTarget: function () {
            },
            getTileTitle: function () {
                return "TileDummyTitle";
            },
            setTileVisible: function () {
            },
            isTileIntentSupported: function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") !== -1);
            },
            addTile: function (oCatalogTile, oGroup) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid: function (oCatalog) {
                return true;
            },
            getGroups: function () {
                return new jQuery.Deferred().resolve(mockData.groups);
            },
            addGroup: function (sTitle) {
                var oGroup = {
                    id: sTitle,
                    groupId: sTitle,
                    title: sTitle,
                    tiles: []
                };
                return new jQuery.Deferred().resolve(oGroup);
            },
            getCatalogs: function () {
                var oDfd = new jQuery.Deferred();

                //Simulate an async function with a loading delay of up to 5 sec
                // Simulates a progress call (the progress function of the promise will be called)
                mockData.catalogs.forEach(function (oCatalog) {
                    window.setTimeout(function () {
                        oDfd.notify(oCatalog);
                    }, 50);
                });
                // TODO: simulate a failure (which will trigger the fail function of the promise)
                //oDfd.reject();

                window.setTimeout(function () {
                    oDfd.resolve(mockData.catalogs);
                }, 350);

                return oDfd.promise();
            },
            getGroupId: function (oGroup) {
                return oGroup.id;
            },
            getDefaultGroup: function () {
                return new jQuery.Deferred().resolve([mockData.groups[0]]);
            },
            getGroupTiles: function (oGroup) {
                return oGroup.tiles;
            },
            getGroupTitle: function (oGroup) {
                return oGroup.title;
            },
            setGroupTitle: function (oGroup, sTitle) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup: function (oGroup, iIndex) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup: function (oGroup, iIndex) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile: function (oGroup, oTile) {
                var oDfd = new jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            isGroupRemovable: function () {
                return true;
            },
            getTileSize: function () {
                return "1x1";
            },
            getCatalogTileSize: function () {
                return "1x1";
            },
            getTileDebugInfo: function () {
                return "";
            },
            getCatalogError: function () {
                return "";
            },
            getCatalogId: function (oCatalog) {
                return oCatalog.id;
            },
            getCatalogTitle: function (oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles: function (oCatalog) {
                return new jQuery.Deferred().resolve(oCatalog.tiles);
            },
            getCatalogTileTitle: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileKeywords: function () {
                return [];
            },
            getCatalogTileId: function (oCatalogTile) {
                return oCatalogTile ? oCatalogTile.id : undefined;
            },
            getCatalogTileView: function () {
                return {destroy: function () {}};
            },
            isLinkPersonalizationSupported: function (oTile) {
                if (oTile) {
                    return oTile.isLinkPersonalizationSupported;
                }
                    return false;

            }
        });
        //mock data for jsview object
        sap.ui.jsview = function () {
            return {
                setWidth: function () {
                },
                setDisplayBlock: function () {
                },
                addEventDelegate: function () {
                }
            };
        };
    }

    var oHomepageManager = null,
        mockData,
        oldsap_ui_jsview,
        oUserRecentsStub,
        oUsageAnalyticsLogStub;

    QUnit.module("sap.ushell.components.HomepageManager", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").then(function () {

                jQuery("<div id=\"layoutWrapper\" style=\"position: absolute;\"></div>").width(1800).appendTo("body");
                oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
                oUsageAnalyticsLogStub = sinon.stub(sap.ushell.Container.getService("UsageAnalytics"), "logCustomEvent");
                oldsap_ui_jsview = sap.ui.jsview;
                overrideLaunchPageAdapter();
                mockData = {
                    groups: [
                        {
                            id: "group_0",
                            groupId: "group_0",
                            title: "group_0",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 0,
                            object: {
                                id: "group_0",
                                groupId: "group_0",
                                title: "group_0",
                                tiles: [
                                    {
                                        id: "tile_00",
                                        uuid: "tile_00",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_00",
                                            uuid: "tile_00"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_01",
                                        uuid: "tile_01",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_01",
                                            uuid: "tile_01"
                                        },
                                        properties: {
                                            formFactor: "Tablet,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_02",
                                        uuid: "tile_02",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_02",
                                            uuid: "tile_02"
                                        },
                                        properties: {
                                            formFactor: "Desktop"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_03",
                                        uuid: "tile_03",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_03",
                                            uuid: "tile_03"
                                        },
                                        properties: {
                                            formFactor: "Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_04",
                                        uuid: "tile_04",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_04",
                                            uuid: "tile_04"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Tablet"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_05",
                                        uuid: "tile_05",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_05",
                                            uuid: "tile_05"
                                        },
                                        properties: {
                                            formFactor: "Tablet"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_000",
                                        uuid: "tile_000",
                                        isTileIntentSupported: true,
                                        isLink: true,
                                        object: {
                                            id: "tile_000",
                                            uuid: "tile_000"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }
                                ]
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_03",
                                    uuid: "tile_03",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_03",
                                        uuid: "tile_03"
                                    },
                                    properties: {
                                        formFactor: "Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_04",
                                    uuid: "tile_04",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_04",
                                        uuid: "tile_04"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_05",
                                    uuid: "tile_05",
                                    isTileIntentSupported: false,
                                    object: {
                                        id: "tile_05",
                                        uuid: "tile_05"
                                    },
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_000",
                                    uuid: "tile_000",
                                    isTileIntentSupported: true,
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [
                                {
                                    id: "tile_001",
                                    uuid: "tile_001",
                                    size: "1x1",
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            links: [
                                {
                                    id: "tile_001",
                                    uuid: "tile_001",
                                    size: "1x1",
                                    isLink: true,
                                    object: {
                                        id: "tile_000",
                                        uuid: "tile_000"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ]
                        },
                        {
                            id: "group_1",
                            groupId: "group_1",
                            title: "group_1",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 1,
                            object: {
                                id: "group_1",
                                groupId: "group_1",
                                title: "group_1"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_2",
                            groupId: "group_2",
                            title: "group_2",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 2,
                            object: {
                                id: "group_2",
                                groupId: "group_2",
                                title: "group_2",
                                tiles: [
                                    {
                                        id: "tile_00",
                                        uuid: "tile_00",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_00",
                                            uuid: "tile_00"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    }
                                ]
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_hidden",
                            groupId: "group_hidden",
                            title: "group_hidden",
                            isGroupVisible: false,
                            isRendered: false,
                            index: 3,
                            object: {
                                id: "group_hidden",
                                groupId: "group_hidden",
                                title: "group_hidden"
                            },
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet,Phone"
                                    },
                                    content: []
                                }
                            ],
                            pendingLinks: [],
                            links: []
                        },
                        {
                            id: "group_03",
                            groupId: "group_03",
                            title: "group_03",
                            isGroupVisible: true,
                            isRendered: false,
                            index: 4,
                            object: {
                                id: "group_03",
                                groupId: "group_03",
                                title: "group_03"
                            },
                            tiles: [],
                            pendingLinks: [],
                            links: []
                        }
                    ],
                    catalogs: [
                        {
                            id: "catalog_0",
                            title: "catalog_0",
                            tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Tablet,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_02",
                                    uuid: "tile_02",
                                    object: {
                                        id: "tile_02",
                                        uuid: "tile_02"
                                    },
                                    properties: {
                                        formFactor: "Desktop"
                                    },
                                    content: []
                                }
                            ]
                        },
                        {
                            id: "catalog_1",
                            title: "catalog_1",
                            tiles: [
                                {
                                    id: "tile_11",
                                    uuid: "tile_11",
                                    object: {
                                        id: "tile_11",
                                        uuid: "tile_11"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_12",
                                    uuid: "tile_12",
                                    properties: {
                                        formFactor: "Tablet"
                                    },
                                    content: []
                                }
                            ]
                        }
                    ],
                    catalogTiles: [
                        {
                            id: "tile_00",
                            uuid: "tile_00",
                            src: {
                                id: "tile_00",
                                uuid: "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: {
                                    formFactor: "Desktop,Phone"
                                }
                            },
                            properties: {
                                formFactor: "Desktop,Phone"
                            },
                            associatedGroups: []
                        }, {
                            id: "tile_01",
                            uuid: "tile_01",
                            object: {
                                id: "tile_01",
                                uuid: "tile_01"
                            },
                            src: {
                                id: "tile_01",
                                uuid: "tile_01",
                                properties: {
                                    formFactor: "Tablet,Phone"
                                }
                            },
                            properties: {
                                formFactor: "Tablet,Phone"
                            },
                            associatedGroups: []
                        }, {
                            id: "tile_02",
                            uuid: "tile_02",
                            object: {
                                id: "tile_02",
                                uuid: "tile_02"
                            },
                            src: {
                                id: "tile_02",
                                uuid: "tile_02",
                                properties: {
                                    formFactor: "Desktop"
                                }
                            },
                            properties: {
                                formFactor: "Desktop"
                            },
                            associatedGroups: []
                        },
                        {
                            id: "tile_11",
                            uuid: "tile_11",
                            src: {
                                id: "tile_11",
                                uuid: "tile_11",
                                object: {
                                    id: "tile_11",
                                    uuid: "tile_11"
                                },
                                properties: {
                                    formFactor: "Desktop,Tablet"
                                }
                            },
                            properties: {
                                formFactor: "Desktop,Tablet"
                            },
                            associatedGroups: []
                        },
                        {
                            id: "tile_12",
                            uuid: "tile_12",
                            src: {
                                id: "tile_12",
                                uuid: "tile_12",
                                object: {
                                    id: "tile_12",
                                    uuid: "tile_12"
                                },
                                properties: {
                                    formFactor: "Tablet"
                                }
                            },
                            properties: {
                                formFactor: "Tablet"
                            },
                            associatedGroups: []
                        }
                    ],
                    tagList: []
                };
                done();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            if (oHomepageManager) {
              oHomepageManager.destroy();
            }
            oHomepageManager = null;
            sap.ui.jsview = oldsap_ui_jsview;
            oUserRecentsStub.restore();
            oUsageAnalyticsLogStub.restore();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });
    // getPreparedTileModel _getTileModel

    QUnit.test("getPreparedTileModel - returns the correct model when a tile is provided", function (assert) {
        var oUidStub,
            oGetTileSizeStub,
            oGetTileIdStub,
            oGetCatalogTileIdStub,
            oEncodeURIComponentStub,
            oGetTileTargetStub,
            oGetTileDebugInfoStub,
            oIsTileIntentSupportedStub,
            oGetCardManifestStub,
            oGetIsAppBoxStub,
            oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
            oDummyTile = {
                controlId: "someId",
                object: "someObject",
                manifest: "someManifest",
                "isLinkPersonalizationSupported": true,
                _getIsAppBox: function () {
                    return true;
                }
            },
            bIsGroupLocked = false,
            sTileType = "tile",
            oReturnValue,
            oExpectedReturnValue = {
                "isCustomTile": false,
                "object": oDummyTile,
                "isLinkPersonalizationSupported": true,
                "originalTileId": "someTileId",
                "uuid": "someUID",
                "tileCatalogId": "someCatalogTileId",
                "content": [],
                "long": false,
                "target": "someTarget",
                "debugInfo": "someTileDebugInfo",
                "isTileIntentSupported": true,
                "rgba": "",
                "isLocked": bIsGroupLocked,
                "showActionsIcon": false,
                "navigationMode": undefined
            };

        // Arrange
        oUidStub = sinon.stub(jQuery.sap, "uid").returns("someUID");
        oGetTileSizeStub = sinon.stub(oLaunchPageService, "getTileSize").returns("1x1");
        oGetTileIdStub = sinon.stub(oLaunchPageService, "getTileId").returns("someTileId");
        oGetCatalogTileIdStub = sinon.stub(oLaunchPageService, "getCatalogTileId");
        oEncodeURIComponentStub = sinon.stub(window, "encodeURIComponent").returns("someCatalogTileId");
        oGetTileTargetStub = sinon.stub(oLaunchPageService, "getTileTarget").returns("someTarget");
        oGetTileDebugInfoStub = sinon.stub(oLaunchPageService, "getTileDebugInfo").returns("someTileDebugInfo");
        oIsTileIntentSupportedStub = sinon.stub(oLaunchPageService, "isTileIntentSupported").returns(true);
        oGetCardManifestStub = sinon.stub(oLaunchPageService, "getCardManifest");

        var oPersistentPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
        oGetIsAppBoxStub = sinon.stub(oPersistentPageOperationAdapter, "_getIsAppBox").returns(true);

        // Act
        oReturnValue = oPersistentPageOperationAdapter.getPreparedTileModel(oDummyTile, bIsGroupLocked, sTileType);

        // Assert
        oReturnValue.uuid = "someUID";//uid generated by sap/base/util/uid
        assert.deepEqual(oReturnValue, oExpectedReturnValue, "The tile model contains the expected data");

        // Cleanup
        oUidStub.restore();
        oGetTileSizeStub.restore();
        oGetTileIdStub.restore();
        oGetCatalogTileIdStub.restore();
        oEncodeURIComponentStub.restore();
        oGetTileTargetStub.restore();
        oGetTileDebugInfoStub.restore();
        oIsTileIntentSupportedStub.restore();
        oGetCardManifestStub.restore();
        oGetIsAppBoxStub.restore();
    });

    QUnit.test("create instance", function (assert) {
        oHomepageManager = new HomepageManager("homepageMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oPersistentPageOperationAdapter = PersistentPageOperationAdapter.getInstance();
        assert.ok(oPersistentPageOperationAdapter, "Instance was created");
    });

    QUnit.module("The method loadGroupsFromArray", {
        beforeEach: function () {
            this.oDefaultGroupMock = {
                id: "defaultGroup"
            };
            this.aGroupsMock = [
                this.oDefaultGroupMock,
                {
                    id: "group1"
                }
            ];

            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oDefaultGroupDeferred = new jQuery.Deferred();
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                getDefaultGroup: sandbox.stub().returns(this.oDefaultGroupDeferred)
            });

            this.oMeasurementStartStub = sandbox.stub(Measurement, "start");
            this.oMeasurementEndStub = sandbox.stub(Measurement, "end");

            this.oAdapter = PersistentPageOperationAdapter.getInstance();

            this.oGetPreparedGroupModelStub = sandbox.stub(this.oAdapter, "getPreparedGroupModel");
            this.oGetPreparedGroupModelStub.callsFake(function (oGroup, bDefault, bLast, oData) {
                if (bDefault) {
                    oGroup.default = true;
                }
                oGroup.prepared = true;
                return oGroup;
            });
            this.oSortGroupsStub = sandbox.stub(this.oAdapter, "_sortGroups");
            this.oSortGroupsStub.withArgs(this.oDefaultGroupMock, this.aGroupsMock).callsFake(function (oDefaultGroup, aGroups) {
                return aGroups;
            });
        },
        afterEach: function () {
            PersistentPageOperationAdapter.destroy();
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Resolves with the correct groups array.", function (assert) {
        // Arrange
        this.oDefaultGroupDeferred.resolve(this.oDefaultGroupMock);
        var aExpectedGroups = [
            {
                default: true,
                id: "defaultGroup",
                index: 0,
                prepared: true
            },
            {
                id: "group1",
                index: 1,
                prepared: true
            }
        ];
        // Act
        return this.oAdapter.loadGroupsFromArray(this.aGroupsMock).then(function (aGroups) {
            // Assert
            assert.deepEqual(aGroups, aExpectedGroups, "loadGroupsFromArray returned the correct groups");

            assert.strictEqual(this.oSortGroupsStub.callCount, 1, "_sortGroups was called once");
        }.bind(this));
    });

    QUnit.test("Resolves with the correct groups array when default group is a different object.", function (assert) {
        // Arrange
        this.oDefaultGroupDeferred.resolve({
            id: "defaultGroup"
        });
        var aExpectedGroups = [
            {
                default: true,
                id: "defaultGroup",
                index: 0,
                prepared: true
            },
            {
                id: "group1",
                index: 1,
                prepared: true
            }
        ];
        // Act
        return this.oAdapter.loadGroupsFromArray(this.aGroupsMock).then(function (aGroups) {
            // Assert
            assert.deepEqual(aGroups, aExpectedGroups, "loadGroupsFromArray returned the correct groups");

            assert.strictEqual(this.oSortGroupsStub.callCount, 1, "_sortGroups was called once");
        }.bind(this));
    });

    QUnit.module("The method _sortGroups", {
        beforeEach: function () {
            this.aGroupsMock = [
                {
                    id: "group1"
                },
                {
                    id: "defaultGroup"
                },
                {
                    "id": "group2"
                }
            ];

            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oGetServiceStub.withArgs("LaunchPage").returns({
                isGroupLocked: sandbox.stub().returns(false)
            });

            this.oAdapter = PersistentPageOperationAdapter.getInstance();
        },
        afterEach: function () {
            PersistentPageOperationAdapter.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the sorted groups array.", function (assert) {
        // Arrange
        var aExpectedGroups = [
            {
                "id": "defaultGroup"
            },
            {
                "id": "group1"
            },
            {
                "id": "group2"
            }
        ];
        // Act
        var aResult = this.oAdapter._sortGroups(this.aGroupsMock[1], this.aGroupsMock);
        // Assert
        assert.deepEqual(aResult, aExpectedGroups, "_sortgroups returned the correct groups array.");
    });

    QUnit.test("Returns the sorted groups array when default group is a different object.", function (assert) {
        // Arrange
        var oDefaultGroupMock = {
            "id": "defaultGroup"
        };
        var aExpectedGroups = [
            {
                "id": "defaultGroup"
            },
            {
                "id": "group1"
            },
            {
                "id": "group2"
            }
        ];
        // Act
        var aResult = this.oAdapter._sortGroups(oDefaultGroupMock, this.aGroupsMock);
        // Assert
        assert.deepEqual(aResult, aExpectedGroups, "_sortgroups returned the correct groups array.");
    });


    QUnit.module("The method getPreparedGroupModel", {
        beforeEach: function () {
            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oLaunchPageStub = {
                getGroupTiles: sandbox.stub().returns([]),
                isGroupLocked: sandbox.stub().returns(false),
                isGroupFeatured: sandbox.stub().returns(false),
                getGroupTitle: sandbox.stub().returns("Test"),
                isGroupRemovable: sandbox.stub().returns(true),
                isGroupVisible: sandbox.stub().returns(true),
                getGroupId: sandbox.stub()
            };

            this.oGetServiceStub.withArgs("LaunchPage").returns(this.oLaunchPageStub);

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/model/personalization").returns(true);

            this.oAdapter = PersistentPageOperationAdapter.getInstance();
        },
        afterEach: function () {
            PersistentPageOperationAdapter.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Don't set helpId if enableHelp is false", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/extension/enableHelp").returns(false);
        this.oLaunchPageStub.getGroupId.returns("test_id");

        // Act
        var oResult = this.oAdapter.getPreparedGroupModel({}, false, false);
        // Assert
        assert.strictEqual(oResult.helpId, null, "helpId was not set");
        assert.strictEqual(this.oLaunchPageStub.getGroupId.callCount, 0, "getGroupId was not called");
    });

    QUnit.test("Set helpId as group Id if enableHelp is true", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/extension/enableHelp").returns(true);
        this.oLaunchPageStub.getGroupId.returns("test_id");

        // Act
        var oResult = this.oAdapter.getPreparedGroupModel({}, false, false);
        // Assert
        assert.strictEqual(oResult.helpId, "test_id", "helpId was set");
        assert.strictEqual(this.oLaunchPageStub.getGroupId.callCount, 1, "getGroupId was called");
    });

    QUnit.test("Set null helpId if enableHelp is true and groupId is null", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/extension/enableHelp").returns(true);
        this.oLaunchPageStub.getGroupId.returns(null);

        // Act
        var oResult = this.oAdapter.getPreparedGroupModel({}, false, false);
        // Assert
        assert.strictEqual(oResult.helpId, null, "null helpId was set");
        assert.strictEqual(this.oLaunchPageStub.getGroupId.callCount, 1, "getGroupId was called");
    });

});
