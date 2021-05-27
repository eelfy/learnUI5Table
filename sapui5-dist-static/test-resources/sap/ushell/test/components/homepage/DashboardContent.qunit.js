// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.DashboardContent
 */
sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/launchpad/AnchorNavigationBar",
    "sap/ushell/ui/launchpad/AnchorItem",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/services/Container",
    "sap/ushell/test/utils",
    "sap/ushell/Layout",
    "sap/ushell/components/homepage/DashboardUIActions"
], function (
    JSONModel,
    AnchorNavigationBar,
    AnchorItem,
    ActionItem,
    HomepageManager,
    ComponentKeysHandler,
    Container,
    utils,
    Layout,
    DashboardUIActions
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    var aGroups = [
        {
            isGroupVisible: true,
            visibilityModes: [false]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: true,
            visibilityModes: [true]
        }, {
            isGroupVisible: false,
            visibilityModes: [true]
        }
    ];

    // BCP 1780224822 - DashboardContent QUnit fails only in IE.
    // IE throws error in sap.ui.core.FocusHandler.prototype.getCurrentFocusedControlId function when stubbing sap.ui.core().byId function,
    // that is why we have overriden this function.
    sap.ui.core.FocusHandler.prototype.getCurrentFocusedControlId = function () { };

    var oController;
    var oEventHub = sap.ui.require("sap/ushell/EventHub");
    var oTestUtils = sap.ui.require("sap/ushell/test/utils");

    QUnit.module("sap.ushell.components.flp.Component", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").then(function () {
                oController = new sap.ui.controller("sap.ushell.components.homepage.DashboardContent");
                done();
            });
        },
        afterEach: function () {
            delete sap.ushell.Container;
            oController.destroy();

            // Reset the EventHub to avoid multiple subscriptions
            oEventHub._reset();

            oTestUtils.restoreSpies(
                sap.ui.core.Component.getOwnerComponentFor,
                sap.ui.getCore().byId,
                sap.ui.getCore().getEventBus
            );
        }
    });

    [
        {
            testDescription: "short drop to a locked groups",
            oMockData: {
                dstArea: undefined,
                dstGroup: {
                    getBindingContext: function () {
                        return {
                            getProperty: function () {
                                return {
                                    isGroupLocked: true
                                };
                            }
                        };
                    }
                },
                dstGroupData: {},
                dstTileIndex: 3,
                srcArea: "links",
                srcGroup: {},
                tile: {
                    getBindingContext: function () {
                        return {
                            getObject: function () {
                                return {
                                    object: ""
                                };
                            }
                        };
                    }
                },
                tileMovedFlag: true
            },
            oExpected: {
                sPubType: "sortableStop",
                obj: { sortableStop: undefined }
            }
        }, {
            testDescription: "convert tile to link in the group",
            oMockData: {
                dstArea: "links",
                dstGroup: {
                    getHeaderText: function () {
                        return "group4";
                    },
                    getBindingContext: function () {
                        return {
                            getProperty: function () {
                                return {
                                    isGroupLocked: false
                                };
                            }
                        };
                    }
                },
                dstGroupData: {
                    getGroupId: function () {
                        return "group4";
                    }
                },
                dstTileIndex: 5,
                srcArea: "tiles",
                srcGroup: {
                    getGroupId: function () {
                        return "group4";
                    }
                },
                tile: {
                    getMode: function () {
                        return "ContentMode";
                    },
                    getUuid: function () {
                        return "uuid1";
                    },
                    getBindingContext: function () {
                        return {
                            getPath: function () {
                                return "/groups/4/tiles/5";
                            },
                            getObject: function () {
                                return {
                                    object: ""
                                };
                            }
                        };
                    }

                },
                tileMovedFlag: true
            },
            oExpected: {
                sPubType: "convertTile",
                obj: {
                    convertTile: {
                        callBack: undefined,
                        longDrop: undefined,
                        srcGroupId: "group4",
                        tile: undefined,
                        toGroupId: "group4",
                        toIndex: 5
                    }
                }
            }
        },
        {
            testDescription: "tile is not defined",
            oMockData: {
                dstArea: undefined,
                dstGroup: null,
                dstGroupData: {},
                dstTileIndex: 3,
                srcArea: "links",
                srcGroup: {},
                tile: null
            },
            oExpected: {
                sPubType: "sortableStop",
                obj: { sortableStop: undefined }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("Test - _handleDrop: " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oModel = new JSONModel({
                    currentViewName: "home",
                    tileActionModeActive: true,
                    groups: [
                        {}, {}, {}, {},
                        {
                            tiles: [
                                {}, {}, {}, {}, {},
                                { object: { title: "grp4 tile5" } }
                            ],
                            links: []
                        }
                    ]
                }),
                oData = {
                    additionalInformation: {
                        indexOf: function (/*data*/) {
                            return -1;
                        }
                    }
                };
            oController.getOwnerComponent = function () {
                return {
                    getMetadata: function () {
                        return {
                            getComponentName: function () {
                                return 1;
                            }
                        };
                    }
                };
            };
            oController.getView = sinon.stub().returns({
                getModel: function () {
                    return oModel;
                }
            });
            jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
            sap.ushell.components.homepage.ActionMode.init(oModel);

            sap.ushell.Layout.getLayoutEngine = function () {
                return {
                    layoutEndCallback: function () {
                        return oFixture.oMockData;
                    },
                    _toggleAnchorItemHighlighting: function () {
                        return;
                    }
                };
            };

            sap.m.MessageToast.show = function () {
            };

            var getEventBusStub = sinon.stub(sap.ui.getCore(), "getEventBus").returns({
                publish: function (sTopic, sMsg, oEventBusData) {
                    var oExpected = oFixture.oExpected.obj[sMsg];
                    if (oEventBusData) {
                        oEventBusData.callBack = undefined;
                    }
                    assert.deepEqual(oEventBusData, oExpected, "Deep compare for: " + sMsg);
                }
            });
            setTimeout(function () {
                done();
                oController._handleDrop("", "", oData);
                getEventBusStub.restore();
            }, 0);
        });
    });

    QUnit.test("Test - _appOpenedHandler", function (assert) {
        var oModel = new JSONModel({
                currentViewName: "home",
                tileActionModeActive: true
            }),
            oData = {
                additionalInformation: {
                    indexOf: function (/*data*/) {
                        return -1;
                    }
                }
            };
        oController.getOwnerComponent = function () {
            return {
                getMetadata: function () {
                    return {
                        getComponentName: function () {
                            return 1;
                        }
                    };
                }
            };
        };
        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        oController.oDashboardUIActionsModule = {};
        oController.oDashboardUIActionsModule.disableAllDashboardUiAction = sinon.stub();

        jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
        sap.ushell.components.homepage.ActionMode.init(oModel);

        assert.ok(sap.ushell.components.homepage.ActionMode.oModel.getProperty("/tileActionModeActive") === true,
            "Action mode is true at start test");
        oController._appOpenedHandler("", "", oData);
        assert.ok(sap.ushell.components.homepage.ActionMode.oModel.getProperty("/tileActionModeActive") === false,
            "Action mode is false after _appOpenedHandler ");
        assert.ok(oController.oDashboardUIActionsModule.disableAllDashboardUiAction.calledOnce, "disableAllDashboardUiAction was called");
    });

    QUnit.test("Test modelLoaded", function (assert) {
        //jQuery.sap.require("sap.ushell.components.homepage.DashboardUIActions");
        var fOriginalModelInitialized = oController.bModelInitialized,
            layoutStub,
            uiActionsInitStub,
            oTempViewData = {
                bModelInitialized: false,
                getModel: function () {
                    return {};
                },
                getController: function () {
                    return oController;
                }
            };

        oController.bModelInitialized = false;
        uiActionsInitStub = sinon.stub(oController, "_initializeUIActions").returns();

        layoutStub = sinon.stub(Layout, "getInitPromise").returns(jQuery.Deferred().resolve());

        oController.getView = function () {
            return oTempViewData;
        };

        oController._modelLoaded.apply(oController);

        assert.ok(oController.bModelInitialized === true, "bModelInitialized is set to true");
        assert.ok(uiActionsInitStub.calledOnce, "_handleUIActions is called once");

        uiActionsInitStub.restore();
        layoutStub.restore();
        oController.bModelInitialized = fOriginalModelInitialized;
    });

    QUnit.test("Test scrollToGroup: no groups", function (assert) {
        var oData = {};

        oController.oView = {
            oDashboardGroupsBox: {
                getGroups: function () {
                    return null;
                }
            }
        };
        oController.getView = function () {
            return {
                getModel: function () {
                    return {
                        getProperty: function () {
                            return null;
                        }
                    };
                }
            };
        };
        try {
            oController._scrollToGroup(null, null, oData);
        } catch (e) {
            assert.ok(false, "scrollToGroup breaks on no-groups");
        }
        assert.ok(true, "scrollToGroup works with no groups");
    });

    QUnit.test("Test _onDashboardShown with home state", function (assert) {
        var done = assert.async();
        var oModel = new JSONModel({
                currentViewName: "home",
                tileActionModeActive: false,
                groups: []
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                }),
                showRightFloatingContainer: sinon.stub(),
                getCurrentCoreView: sinon.stub().returns("home"),
                getShellConfig: sinon.stub().returns({
                    rootIntent: "Shell-home"
                })
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);

        oView.loaded().then(function () {
            var fnHandleTilesVisibilityStub = sinon.stub(sap.ushell.utils, "handleTilesVisibility"),
                fnRefreshTilesStub = sinon.stub(sap.ushell.utils, "refreshTiles"),
                fnGoToTileContainerStub = sinon.stub(sap.ushell.components.ComponentKeysHandler, "goToTileContainer");

            sap.ui.getCore().getEventBus().publish("launchpad", "contentRefresh");
            window.setTimeout(function () {
                assert.ok(fnHandleTilesVisibilityStub.called, "handleTilesVisibility was called");
                assert.ok(fnRefreshTilesStub.called, "refreshTiles was called");
                assert.ok(fnGoToTileContainerStub.called, "goToTileContainer was called");

                oGetCoreByIdStub.restore();
                fnHandleTilesVisibilityStub.restore();
                fnRefreshTilesStub.restore();
                fnGoToTileContainerStub.restore();
                getRendererStub.restore();
                oView.destroy();
                done();
            }, 0);
        });
    });

    QUnit.test("Test handleDashboardScroll", function (assert) {
        var done = assert.async();
        var updateTopGroupInModelStub = sinon.stub(oController, "_updateTopGroupInModel"),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                addActionButton: sinon.spy(),
                getCurrentViewportState: function () {
                    return "Center";
                },
                showRightFloatingContainer: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy()
            }),
            handleTilesVisibilitySpy = sinon.spy(sap.ushell.utils, "handleTilesVisibility"),
            originView = oController.getView,
            reArrangeNavigationBarElementsSpy,
            closeOverflowPopupSpy,
            oModel = new JSONModel({
                scrollingToGroup: false
            }),
            oView = {
                oAnchorNavigationBar: {
                    reArrangeNavigationBarElements: function () { },
                    closeOverflowPopup: function () { }
                },
                getModel: function () {
                    return oModel;
                },
                _handleHeadsupNotificationsPresentation: sinon.spy()
            };

        oController.getView = function () {
            return oView;
        };

        reArrangeNavigationBarElementsSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "reArrangeNavigationBarElements");
        closeOverflowPopupSpy = sinon.spy(oController.getView().oAnchorNavigationBar, "closeOverflowPopup");

        oController._handleDashboardScroll();

        setTimeout(function () {
            assert.ok(updateTopGroupInModelStub.calledOnce, "updateTopGroupInModel is called once");
            assert.ok(handleTilesVisibilitySpy.calledOnce, "handleTilesVisibility is called once");
            assert.ok(reArrangeNavigationBarElementsSpy.calledOnce, "reArrangeNavigationBarElementsSpy is called once");
            assert.ok(closeOverflowPopupSpy.calledOnce, "closeOverflowPopupSpy is called once");
            updateTopGroupInModelStub.restore();

            handleTilesVisibilitySpy.restore();
            getRendererStub.restore();
            oController.getView = originView;
            done();
        }, 1001);
    });

    QUnit.test("Test - updateTopGroupInModel", function (assert) {
        var oModel = new JSONModel({
                groups: aGroups
            }),
            originView = oController.getView;

        var oGetIndexOfTopGroupInViewPort = sinon.stub(oController, "_getIndexOfTopGroupInViewPort").returns(5);

        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        oController._updateTopGroupInModel();

        assert.ok(oGetIndexOfTopGroupInViewPort.calledOnce, "getIndexOfTopGroupInViewPort is called once");

        assert.ok(oModel.getProperty("/iSelectedGroup") === 6, "selected group in model is 6");
        assert.ok(oModel.getProperty("/topGroupInViewPortIndex") === 5, "anchore bar tab number 5 is selected");

        oGetIndexOfTopGroupInViewPort.restore();
        oController.getView = originView;
    });

    QUnit.test("Test - handleDrag update model", function (assert) {
        var oModel = new JSONModel({
            draggedTileLinkPersonalizationSupported: false
        });

        oController.getView = sinon.stub().returns({
            getModel: function () {
                return oModel;
            }
        });

        var bIsLinkPersonalizationSupported = true;
        var oTestTile = {
            tile: {
                getBindingContext: function () {
                    return {
                        getObject: function () {
                            return {
                                isLinkPersonalizationSupported: bIsLinkPersonalizationSupported
                            };
                        }
                    };
                }
            }
        };

        sap.ushell.Layout.getLayoutEngine = function () {
            return {
                layoutEndCallback: function () {
                    return oTestTile;
                },
                _toggleAnchorItemHighlighting: function () {
                    return;
                }
            };
        };

        oController._handleDrag();
        assert.ok(oModel.getProperty("/draggedTileLinkPersonalizationSupported"), "draggedTileLinkPersonalizationSupported has changed");

        bIsLinkPersonalizationSupported = false;
        oController._handleDrag();
        assert.ok(!oModel.getProperty("/draggedTileLinkPersonalizationSupported"), "draggedTileLinkPersonalizationSupported has changed");
    });

    QUnit.test("Test - Groups Layout is re-arranged only when the dashboard is visible", function (assert) {
        var recalculateBottomSpaceStub = sinon.stub(sap.ushell.utils, "recalculateBottomSpace"),
            handleTilesVisibilitySpy = sinon.stub(sap.ushell.utils, "handleTilesVisibility"),
            jQueryStub = sinon.stub(jQuery, "filter").returns(["found"]),
            reRenderGroupsLayoutSpy = sinon.spy(sap.ushell.Layout, "reRenderGroupsLayout"),
            initializeUIActionsStub = sinon.stub(oController, "_initializeUIActions");

        oController.resizeHandler();
        assert.ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should be re-arranged if dashBoardGroupsContainer is visible");
        jQueryStub.restore();

        jQueryStub = sinon.stub(jQuery, "filter").returns([]);
        oController.resizeHandler();
        assert.ok(reRenderGroupsLayoutSpy.calledOnce, "Groups Layout should not be re-arranged if dashBoardGroupsContainer is invisible");

        jQueryStub.restore();
        recalculateBottomSpaceStub.restore();
        handleTilesVisibilitySpy.restore();
        initializeUIActionsStub.restore();
    });

    QUnit.test("show hide groups invoked upon 'actionModeInactive' event", function (assert) {
        var done = assert.async();
        var oModel = new JSONModel({}),
            oOwnerComponentStub = sinon.stub(sap.ui.core.Component, "getOwnerComponentFor").returns({
                getModel: function () {
                    return oModel;
                }
            }),
            oEventBus = sap.ui.getCore().getEventBus(),
            oHomepageManager = new sap.ushell.components.HomepageManager("dashboardMgr", { model: oModel }),
            getCurrentHiddenGroupIdsStub = sinon.stub(oHomepageManager, "getCurrentHiddenGroupIds").returns([]);

        oEventBus.publish("launchpad", "actionModeInactive", []);
        setTimeout(function () {
            assert.ok(getCurrentHiddenGroupIdsStub.called, "getCurrentHiddenGroups is called");
            oOwnerComponentStub.restore();

            getCurrentHiddenGroupIdsStub.restore();
            done();
        }, 350);
    });

    var fnHandleGroupVisibilityChangesTestHelper = function (assert, sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, bExpectedHideGroupsCalled) {
        var done = assert.async();
        var getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
            addActionButton: sinon.spy(),
            getCurrentViewportState: function () {
                return "Center";
            },
            showRightFloatingContainer: sinon.spy(),
            createExtendedShellState: sinon.spy(),
            applyExtendedShellState: sinon.spy(),
            getRightFloatingContainerVisibility: sinon.spy(),
            getRouter: sinon.stub().returns({
                getRoute: sinon.stub().returns({
                    attachMatched: sinon.stub()
                })
            }),
            getShellConfig: sinon.stub().returns({
                rootIntent: "Shell-home"
            })
        }),
            oModel = new JSONModel({
                currentViewName: undefined
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                setEnableBounceAnimations: function (/*bFlag*/) {
                    return;
                },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                setRight: function () { }
            }),
            getEventBusStub = sinon.stub(oOrigCore, "getEventBus").returns({
                subscribe: sinon.spy()
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);
        oView.loaded().then(function () {
            var fnHideGroupsStub = sinon.stub().returns(jQuery.Deferred().resolve());
            var getServiceStub = sinon.stub(sap.ushell.Container, "getServiceAsync").returns(
                Promise.resolve({
                    hideGroups: fnHideGroupsStub
                })),
                oTestController = oView.getController(),
                oHomepageManager = new sap.ushell.components.HomepageManager("dashboardMgr", { model: oModel }),
                oGetCurrentHiddenGroupIdsStub = sinon.stub(oHomepageManager, "getCurrentHiddenGroupIds")
                    .returns(sCurrentHiddenGroupIds);

            oTestController._handleGroupVisibilityChanges("test", "test", aOrigHiddenGroupsIds);

            getServiceStub().then(function () {
                assert.ok(fnHideGroupsStub.called === bExpectedHideGroupsCalled, "hideGroups is called");
            });


            //Clean after tests.
            getRendererStub.restore();

            oGetCoreByIdStub.restore();
            getEventBusStub.restore();
            getServiceStub.restore();
            oGetCurrentHiddenGroupIdsStub.restore();
            oView.destroy();
            done();
        });
    };

    QUnit.test("test show hide groups when user hides a group", function (assert) {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2", "testGroupId3"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(assert, sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    QUnit.test("test show hide groups when user un-hides a group", function (assert) {
        var sCurrentHiddenGroupIds = ["testGroupId1"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(assert, sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    QUnit.test("test show hide groups when originally hidden groups and the currentlly hidden groups are the same ", function (assert) {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2"];

        fnHandleGroupVisibilityChangesTestHelper(assert, sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, false);
    });

    QUnit.test("test show/hide groups when number of hidden groups does not change but the groups are different", function (assert) {
        var sCurrentHiddenGroupIds = ["testGroupId1", "testGroupId2", "testGroupId3", "testGroupId4"],
            aOrigHiddenGroupsIds = ["testGroupId1", "testGroupId2", "testGroupId5", "testGroupId6"];

        fnHandleGroupVisibilityChangesTestHelper(assert, sCurrentHiddenGroupIds, aOrigHiddenGroupsIds, true);
    });

    QUnit.test("Test deactivation of action/edit mode after click on 'Done' button of the footer", function (assert) {
        var done = assert.async();
        jQuery.sap.require("sap.ushell.components.homepage.ActionMode");
        var oModel = new JSONModel({
                currentViewName: "home",
                tileActionModeActive: true,
                groups: []
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                }),
                getShellConfig: sinon.stub().returns({
                    rootIntent: "Shell-home"
                })
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);
        oView.loaded().then(function () {
            var oActionModeDeactivationStub = sinon.stub(sap.ushell.components.homepage.ActionMode, "_deactivate");

            oView._createFooter();
            window.setTimeout(function () {
                var oDoneBtn = oView.oPage.getFooter().getContentRight()[1];
                oDoneBtn.firePress();
                assert.ok(oActionModeDeactivationStub.called, "Deactivate called after pressing on 'Done'");

                oActionModeDeactivationStub.restore();

                oGetCoreByIdStub.restore();
                getRendererStub.restore();
                oView.destroy();
                done();
            }, 0);
        });
    });

    QUnit.test("Test exit method", function (assert) {
        var done = assert.async();
        var oModel = new JSONModel({
                currentViewName: "home",
                tileActionModeActive: false
            }),
            oOrigCore = sap.ui.getCore(),
            oGetCoreByIdStub = sinon.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                enlargeCenterTransition: function (/*bFlag*/) { }
            }),
            getRendererStub = sinon.stub(sap.ushell.Container, "getRenderer").returns({
                getCurrentViewportState: sinon.spy(),
                createExtendedShellState: sinon.spy(),
                applyExtendedShellState: sinon.spy(),
                getRouter: sinon.stub().returns({
                    getRoute: sinon.stub().returns({
                        attachMatched: sinon.stub()
                    })
                }),
                getShellConfig: sinon.stub().returns({
                    rootIntent: "Shell-home"
                })
            }),
            oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });

        oView.setModel(oModel);

        oView.loaded().then(function () {
            var handleExitSpy = sinon.spy(oView.oAnchorNavigationBar, "handleExit");
            oView.destroy();
            assert.ok(handleExitSpy.called === true);
            oGetCoreByIdStub.restore();
            getRendererStub.restore();
            done();
        });
    });

    QUnit.module("Event delegates", {
        beforeEach: function () {
            // stub all calls for constructor
            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getRenderer: sandbox.stub().returns({
                    getRouter: sandbox.stub().returns({
                        getRoute: sandbox.stub().returns({
                            attachMatched: sandbox.stub()
                        })
                    }),
                    getShellConfig: sinon.stub().returns({
                        rootIntent: "Shell-home"
                    })
                })
            };
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                isLinkPersonalizationSupported: sandbox.stub()
            });

            // build view
            this.oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });
            this.oView.setModel(new JSONModel({}));

            this.oAddEventDelegateStub = sandbox.stub(AnchorNavigationBar.prototype, "addEventDelegate");

            //wait for view
            return this.oView.loaded();
        },
        afterEach: function () {
            sandbox.restore();
            this.oView.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("AnchorNavigationBar - onBeforeFastNavigationFocus", function (assert) {
        // Arrange
        // Act
        var fnDelegate = this.oAddEventDelegateStub.getCall(0).args[0].onBeforeFastNavigationFocus;
        // Assert
        assert.strictEqual(fnDelegate, this.oView._handleBeforeFastNavigationFocus, "_handleBeforeFastNavigationFocus was correctly set");
    });

    QUnit.module("The method _handleBeforeFastNavigationFocus", {
        beforeEach: function () {
            // stub all calls for constructor
            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getRenderer: sandbox.stub().returns({
                    getRouter: sandbox.stub().returns({
                        getRoute: sandbox.stub().returns({
                            attachMatched: sandbox.stub()
                        })
                    }),
                    getShellConfig: sinon.stub().returns({
                        rootIntent: "Shell-home"
                    })
                })
            };
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                isLinkPersonalizationSupported: sandbox.stub()
            });

            // build view
            this.oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });
            this.oView.setModel(new JSONModel({}));

            this.oPreventDefaultStub = sandbox.stub();
            this.oMockEvent = {
                preventDefault: this.oPreventDefaultStub
            };
            this.oGoToSelectedAnchorNavigationItemStub = sandbox.stub(sap.ushell.components.ComponentKeysHandler, "goToSelectedAnchorNavigationItem");
            //wait for view
            return this.oView.loaded();
        },
        afterEach: function () {
            sandbox.restore();
            this.oView.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Handles the event when AnchorNavigationBar is visible", function (assert) {
        // Arrange
        var done = assert.async();
        this.oView.oAnchorNavigationBar.addGroup(new AnchorItem());
        this.oView.oAnchorNavigationBar.placeAt(document.getElementById("qunit-fixture"));
        setTimeout(function () {
            // Act
            this.oView._handleBeforeFastNavigationFocus(this.oMockEvent);
            // Assert
            assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
            assert.strictEqual(this.oGoToSelectedAnchorNavigationItemStub.callCount, 1, "goToSelectedAnchorNavigationItem was called once");
            done();
        }.bind(this), 0);
    });

    QUnit.test("Does not handle the event when AnchorNavigationBar is not visible", function (assert) {
        // Arrange
        // Act
        this.oView._handleBeforeFastNavigationFocus(this.oMockEvent);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "preventDefault was not called");
        assert.strictEqual(this.oGoToSelectedAnchorNavigationItemStub.callCount, 0, "goToSelectedAnchorNavigationItem was not called");
    });

    QUnit.module("ActionModeButton", {
        beforeEach: function () {
            // stub all calls for constructor
            var oModel = new JSONModel({
                currentViewName: "home",
                groups: []
            });

            this.oGetShellConfig = sandbox.stub().returns({
                rootIntent: "Shell-home",
                moveEditHomePageActionToShellHeader: false
            });
            this.oActionItem = new ActionItem({});
            this.oAddUserActionStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oActionItem).promise());
            this.oShowHeaderEndItemStub = sandbox.stub();
            this.oShowActionButton = sandbox.stub();

            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getRenderer: sandbox.stub().returns({
                    getRouter: sandbox.stub().returns({
                        getRoute: sandbox.stub().returns({
                            attachMatched: sandbox.stub()
                        })
                    }),
                    getCurrentCoreView: sandbox.stub().returns(null),
                    getShellConfig: this.oGetShellConfig,
                    addUserAction: this.oAddUserActionStub,
                    showActionButton: this.oShowActionButton,
                    showHeaderEndItem: this.oShowHeaderEndItemStub
                })
            };
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                isLinkPersonalizationSupported: sandbox.stub()
            });

            var oOrigCore = sap.ui.getCore();
            this.oGetCoreByIdStub = sandbox.stub(oOrigCore, "byId").returns({
                shiftCenterTransitionEnabled: function () { },
                shiftCenterTransition: function () { },
                attachAfterNavigate: function () { },
                getCenterViewPort: function () {
                    return [{
                        getComponent: function () {
                            return "__renderer0---Shell-home-component";
                        }
                    }];
                },
                enlargeCenterTransition: function (/*bFlag*/) { }
            });

            // build view
            this.oView = sap.ui.view({
                viewName: "sap.ushell.components.homepage.DashboardContent",
                type: "JS",
                async: true
            });
            this.oView.setModel(oModel);

            //wait for view
            return this.oView.loaded();
        },
        afterEach: function () {
            sandbox.restore();
            this.oView.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Create action mode button in the user menu when flp home is root intent", function (assert) {
        // Arrange
        this.oView.bIsHomeIntentRootIntent = true;
        // Act
        this.oView._createActionModeButton();
        // Assert
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "Action button was added to the user menu");
        assert.deepEqual(this.oAddUserActionStub.getCall(0).args[0].aStates, ["home"], "button is add for home state");
        assert.equal(this.oAddUserActionStub.getCall(0).args[0].bCurrentState, undefined, "button is add for home state");
        assert.equal(this.oView.oTileActionsButton, this.oActionItem, "the button is added to the oTileActionsButton variable");
    });

    QUnit.test("Create action mode button in the user menu when flp home is not root intent", function (assert) {
        // Arrange
        this.oView.bIsHomeIntentRootIntent = false;
        // Act
        this.oView._createActionModeButton();
        // Assert
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "Action button was added to the user menu");
        assert.equal(this.oAddUserActionStub.getCall(0).args[0].aStates, null, "button is add for current state");
        assert.equal(this.oAddUserActionStub.getCall(0).args[0].bCurrentState, true, "button is add for current state");
        assert.equal(this.oView.oTileActionsButton, this.oActionItem, "the button is added to the oTileActionsButton variable");
    });

    QUnit.test("Create action mode button in the header when flp home is root intent", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oView.bIsHomeIntentRootIntent = true;
        this.oGetShellConfig.returns({
            moveEditHomePageActionToShellHeader: true
        });
        // Act
        this.oView._createActionModeButton();
        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "Action button was added to the header");
            assert.equal(this.oShowHeaderEndItemStub.getCall(0).args[1], false, "button is add for home state");
            assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args[2], ["home"], "button is add for home state");
            assert.ok(this.oView.oTileActionsButton, "the button is added to the oTileActionsButton variable");
            fnDone();
        }.bind(this, 0));
    });

    QUnit.test("Create action mode button in the header when flp home is not root intent", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oView.bIsHomeIntentRootIntent = false;
        this.oGetShellConfig.returns({
            moveEditHomePageActionToShellHeader: true
        });
        // Act
        this.oView._createActionModeButton();
        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "Action button was added to the header");
            assert.equal(this.oShowHeaderEndItemStub.getCall(0).args[1], true, "button is add for current state");
            assert.equal(this.oShowHeaderEndItemStub.getCall(0).args[2], undefined, "button is add for current state");
            assert.ok(this.oView.oTileActionsButton, "the button is added to the oTileActionsButton variable");
            fnDone();
        }.bind(this, 0));
    });

    QUnit.test("Don't update visibility of the button when flp home is root intent", function (assert) {
        // Arrange
        this.oView.bIsHomeIntentRootIntent = true;
        this.oView.oTileActionsButton = {
            destroy: sandbox.stub()
        };
        // Act
        this.oView._onHomeNavigation();
        // Assert
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called");
        assert.strictEqual(this.oShowActionButton.callCount, 0, "showActionButton was not called");
    });

    QUnit.test("Update visibility of the button in the user menu when flp home is not root intent", function (assert) {
        // Arrange
        this.oView.bIsHomeIntentRootIntent = false;
        var sControlId = "someId";
        this.oView.oTileActionsButton = {
            getId: sandbox.stub().returns(sControlId),
            destroy: sandbox.stub()
        };
        // Act
        this.oView._onHomeNavigation();
        // Assert
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called");
        assert.strictEqual(this.oShowActionButton.callCount, 1, "showActionButton was called");
        assert.deepEqual(this.oShowActionButton.getCall(0).args, [sControlId, true], "showActionButton was called with correct arguments");
    });

    QUnit.test("Update visibility of the button in the header when flp home is not root intent", function (assert) {
        // Arrange
        this.oView.bIsHomeIntentRootIntent = false;
        var sControlId = "someId";
        this.oView.oTileActionsButton = {
            getId: sandbox.stub().returns(sControlId),
            destroy: sandbox.stub()
        };
        this.oGetShellConfig.returns({
            moveEditHomePageActionToShellHeader: true
        });
        // Act
        this.oView._onHomeNavigation();
        // Assert
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called");
        assert.strictEqual(this.oShowActionButton.callCount, 0, "showActionButton was not called");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [sControlId, true], "showHeaderEndItem was called with correct arguments");
    });
});
