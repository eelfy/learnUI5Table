// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.ComponentKeysHandler
 */
sap.ui.require([
    "sap/ushell/components/ComponentKeysHandler",
    "sap/m/StandardTile",
    "sap/m/TileContainer",
    "sap/ui/core/ResizeHandler",
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ushell/EventHub"
], function (ComponentKeysHandler, StandardTile, TileContainer, ResizeHandler, DashboardGroupsContainer, EventHub) {
    "use strict";

    /* global module ok test sinon strictEqual deepEqual*/

    module("ComponentKeysHandler", {
        setup: function () {
            // prevent sideeffects from messing with the tests
            this.fnRegisterStub = sinon.stub(ResizeHandler, "register");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            // prevent sideeffects from messing with the tests
            this.fnRegisterStub.restore();
        }
    });

    test("create a new instance of ComponentKeysHandler Class", function () {
        var instance = ComponentKeysHandler;
        ok(instance, "create a new instance");
    });

    test("goToTileContainer:", function () {
        [
            {
                sTestDescription: "not in edit mode",
                bTileActionModeActive: false,
                bExpectedGoToFirstVisibleTileContainerCalled: false,
                bExpectedGoToLastVisitedTileCalled: true
            },
            {
                sTestDescription: "in edit mode",
                bTileActionModeActive: true,
                bExpectedGoToFirstVisibleTileContainerCalled: true,
                bExpectedGoToLastVisitedTileCalled: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oModel = new sap.ui.model.json.JSONModel({
                tileActionModeActive: oFixture.bTileActionModeActive
            }),
                fnGoToFirstVisibleTileContainerStub = sinon.stub(ComponentKeysHandler, "goToFirstVisibleTileContainer"),
                fnGoToLastVisitedTileStub = sinon.stub(ComponentKeysHandler, "goToLastVisitedTile");

            ComponentKeysHandler.oModel = oModel;

            // Act
            ComponentKeysHandler.goToTileContainer();

            // Assert
            strictEqual(fnGoToFirstVisibleTileContainerStub.calledOnce, oFixture.bExpectedGoToFirstVisibleTileContainerCalled,
                "goToFirstVisibleTileContainer was (not) called as expected when" + oFixture.sTestDescription);
            strictEqual(fnGoToLastVisitedTileStub.calledOnce, oFixture.bExpectedGoToLastVisitedTileCalled,
                "goToLastVisitedTile was (not) called as expected when" + oFixture.sTestDescription);

            fnGoToFirstVisibleTileContainerStub.restore();
            fnGoToLastVisitedTileStub.restore();
        });
    });

    test("goToFirstVisibleTileContainer:", function () {
        [
            {
                sTestDescription: "no groups are visible",
                nTopGroupInViewPortIndex: 0,
                bVisible: false,
                bExpectedSetTileContainerSelectiveFocusCalled: false
            },
            {
                sTestDescription: "group at index position is visible",
                nTopGroupInViewPortIndex: 0,
                bVisible: true,
                bExpectedSetTileContainerSelectiveFocusCalled: true
            },
            {
                sTestDescription: "index position is invaild",
                nTopGroupInViewPortIndex: 1,
                bVisible: true,
                bExpectedSetTileContainerSelectiveFocusCalled: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oModel = new sap.ui.model.json.JSONModel({
                    topGroupInViewPortIndex: oFixture.nTopGroupInViewPortIndex
                }),
                fnSetTileContainerSelectiveFocusStub = sinon.stub(ComponentKeysHandler, "_setTileContainerSelectiveFocus");

            var oDashboard = document.createElement("div");
            oDashboard.setAttribute("id", "dashboardGroups");
            document.body.appendChild(oDashboard);

            var oTileContainer = document.createElement("div");
            oTileContainer.hidden = !oFixture.bVisible;
            oTileContainer.classList.add("sapUshellTileContainer");
            oDashboard.appendChild(oTileContainer);
            ComponentKeysHandler.oModel = oModel;

            // Act
            ComponentKeysHandler.goToFirstVisibleTileContainer();

            // Assert
            strictEqual(fnSetTileContainerSelectiveFocusStub.calledOnce, oFixture.bExpectedSetTileContainerSelectiveFocusCalled,
                "goToFirstVisibleTileContainer was (not) called as expected when" + oFixture.sTestDescription);

            fnSetTileContainerSelectiveFocusStub.restore();

            document.body.removeChild(oDashboard);
        });
    });

    test("goToLastVisitedTile:", function () {
        [
            {
                sTestDescription: "no tabindex is set",
                bExpectedFocus: true,
                sExpectedFocusId: "tile1_0"
            },
            {
                sTestDescription: "no tabindex is set and a group is given",
                sGroupId: "group2",
                bLookInGivenGroup: true,
                bExpectedFocus: true,
                sExpectedFocusId: "tile2_0"
            },
            {
                sTestDescription: "a tabindex is set and no group is given",
                bExpectedFocus: true,
                bTabIndex: true,
                sExpectedFocusId: "tile2_1"
            },
            {
                sTestDescription: "a tabindex is set and a different group is given",
                sGroupId: "group1",
                bLookInGivenGroup: true,
                bTabIndex: true,
                bExpectedFocus: true,
                sExpectedFocusId: "tile1_0"
            },
            {
                sTestDescription: "a tabindex is set and the correct group is given",
                sGroupId: "group2",
                bLookInGivenGroup: true,
                bTabIndex: true,
                bExpectedFocus: true,
                sExpectedFocusId: "tile2_1"
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oDashboard = document.createElement("div");
            oDashboard.setAttribute("id", "dashboardGroups");
            document.body.appendChild(oDashboard);

            var oGroup1 = document.createElement("div");
            oGroup1.setAttribute("id", "group1");
            oGroup1.classList.add("sapUshellTileContainer");
            oDashboard.appendChild(oGroup1);

            var oGroup2 = document.createElement("div");
            oGroup2.setAttribute("id", "group2");
            oGroup2.classList.add("sapUshellTileContainer");
            oDashboard.appendChild(oGroup2);

            for (var i = 0; i < 2; i++) {
                var oTile1 = document.createElement("div");
                oTile1.setAttribute("id", "tile1_" + i);
                oTile1.classList.add("sapUshellTile");
                oGroup1.appendChild(oTile1);

                var oTile2 = document.createElement("div");
                oTile2.setAttribute("id", "tile2_" + i);
                oTile2.classList.add("sapUshellTile");
                oGroup2.appendChild(oTile2);
            }

            if (oFixture.bTabIndex) {
                document.getElementById("tile2_1").setAttribute("tabindex", "0");
            }

            ComponentKeysHandler.oModel = new sap.ui.model.json.JSONModel({ topGroupInViewPortIndex: 0 });

            var fnMoveScrollDashboardStub = sinon.stub(ComponentKeysHandler, "moveScrollDashboard");

            // Act
            ComponentKeysHandler.goToLastVisitedTile(jQuery("#" + oFixture.sGroupId), oFixture.bLookInGivenGroup);

            // Assert
            strictEqual(fnMoveScrollDashboardStub.calledOnce, oFixture.bExpectedFocus,
                "a focus has been set correctly when " + oFixture.sTestDescription);
            strictEqual(fnMoveScrollDashboardStub.args[0][0][0].id, oFixture.sExpectedFocusId,
                "a focus has been set on the correct tile when " + oFixture.sTestDescription);

            document.body.removeChild(oDashboard);
            fnMoveScrollDashboardStub.restore();
        });
    });

    test("_goToFirstTileOfNextGroup:", function () {
        [
            {
                sTestDescription: "direction is up and info is undefined",
                sDirection: "up",
                bExpectedGetNextGroupCalled: false,
                bExpectedGoToTileOfGroupCalled: false
            },
            {
                sTestDescription: "direction is up and there is not a next group",
                sDirection: "up",
                oInfo: {
                    oGroup: {
                        id: "group1"
                    }
                },
                bExpectedGetNextGroupCalled: true,
                bExpectedGoToTileOfGroupCalled: false
            },
            {
                sTestDescription: "direction is up and there is a next group",
                sDirection: "up",
                oInfo: {
                    oGroup: {
                        id: "group2"
                    }
                },
                oNextGroup: {
                    id: "group1"
                },
                bExpectedGetNextGroupCalled: true,
                bExpectedGoToTileOfGroupCalled: true
            },
            {
                sTestDescription: "direction is down and info is undefined",
                sDirection: "down",
                bExpectedGetNextGroupCalled: false,
                bExpectedGoToTileOfGroupCalled: false
            },
            {
                sTestDescription: "direction is down and there is not a next group",
                sDirection: "down",
                oInfo: {
                    oGroup: {
                        id: "group1"
                    }
                },
                bExpectedGetNextGroupCalled: true,
                bExpectedGoToTileOfGroupCalled: false
            },
            {
                sTestDescription: "direction is down and there is a next group",
                sDirection: "down",
                oInfo: {
                    oGroup: {
                        id: "group1"
                    }
                },
                oNextGroup: {
                    id: "group2"
                },
                bExpectedGetNextGroupCalled: true,
                bExpectedGoToTileOfGroupCalled: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnPreventDefaultStub = sinon.stub(ComponentKeysHandler, "_preventDefault"),
                fnGetGroupAndTilesInfoStub = sinon.stub(ComponentKeysHandler, "_getGroupAndTilesInfo").returns(oFixture.oInfo),
                fnGetNextGroupStub = sinon.stub(ComponentKeysHandler, "_getNextGroup").returns(oFixture.oNextGroup),
                fnGoToTileOfGroupStub = sinon.stub(ComponentKeysHandler, "_goToTileOfGroup");

            // Act
            ComponentKeysHandler._goToFirstTileOfNextGroup(oFixture.sDirection, undefined);

            // Assert
            strictEqual(fnPreventDefaultStub.calledOnce, true,
                "_preventDefault was called once when " + oFixture.sTestDescription);
            strictEqual(fnGetGroupAndTilesInfoStub.calledOnce, true,
                "_getGroupAndTilesInfo was called once when " + oFixture.sTestDescription);
            strictEqual(fnGetNextGroupStub.calledOnce, oFixture.bExpectedGetNextGroupCalled,
                "_getNextGroup was called once when " + oFixture.sTestDescription);
            if (oFixture.bExpectedGetNextGroupCalled) {
                strictEqual(fnGetNextGroupStub.args[0][0], oFixture.sDirection,
                    "1. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                strictEqual(fnGetNextGroupStub.args[0][1], oFixture.oInfo.oGroup,
                    "2. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                strictEqual(fnGetNextGroupStub.args[0][2], false,
                    "3. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
                strictEqual(fnGetNextGroupStub.args[0][3], true,
                    "4. argument of _getNextGroup was as expected " + oFixture.sTestDescription);
            }
            strictEqual(fnGoToTileOfGroupStub.calledOnce, oFixture.bExpectedGoToTileOfGroupCalled,
                "_goToTileOfGroup was called once when " + oFixture.sTestDescription);
            if (oFixture.bExpectedGoToTileOfGroupCalled) {
                strictEqual(fnGoToTileOfGroupStub.args[0][0], "first",
                "1. argument of _goToTileOfGroup was as expected " + oFixture.sTestDescription);
                strictEqual(fnGoToTileOfGroupStub.args[0][1], oFixture.oNextGroup,
                    "2. argument of _goToTileOfGroup was as expected " + oFixture.sTestDescription);
            }

            fnPreventDefaultStub.restore();
            fnGetGroupAndTilesInfoStub.restore();
            fnGetNextGroupStub.restore();
            fnGoToTileOfGroupStub.restore();
        });
    });

    test("_goToTileOfGroup:", function () {
        [
            {
                sTestDescription: "vPosition and oGroup are not given",
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is not given and oGroup has no tiles or links and the user is not in edit mode",
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is not given and oGroup has no tiles or links and the user is in edit mode",
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is not given and oGroup has has tiles",
                bHasTiles: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has no tiles or links and the user is not in edit mode",
                vPosition: "first",
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has no tiles or links and the user is in edit mode",
                vPosition: "first",
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "PlusTile"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has tiles and the user is not in edit mode",
                vPosition: "first",
                bHasTiles: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_1"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has tiles and the user is in edit mode",
                vPosition: "first",
                bHasTiles: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_1"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has links and the user is not in edit mode",
                vPosition: "first",
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_1"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has links and the user is in edit mode",
                vPosition: "first",
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "PlusTile"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has tiles and links and the user is not in edit mode",
                vPosition: "first",
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_1"
            },
            {
                sTestDescription: "vPosition is \"first\" and oGroup has has tiles and links and the user is in edit mode",
                vPosition: "first",
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_1"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has no tiles or links and the user is not in edit mode",
                vPosition: "last",
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has no tiles or links and the user is in edit mode",
                vPosition: "last",
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "PlusTile"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has tiles and the user is not in edit mode",
                vPosition: "last",
                bHasTiles: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_2"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has tiles and the user is in edit mode",
                vPosition: "last",
                bHasTiles: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "PlusTile"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has links and the user is not in edit mode",
                vPosition: "last",
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_2"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has links and the user is in edit mode",
                vPosition: "last",
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_2"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has tiles and links and the user is not in edit mode",
                vPosition: "last",
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_2"
            },
            {
                sTestDescription: "vPosition is \"last\" and oGroup has has tiles and links and the user is in edit mode",
                vPosition: "last",
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_2"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has no tiles or links and the user is not in edit mode",
                vPosition: 1,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has no tiles or links and the user is in edit mode",
                vPosition: 1,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: false
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has tiles and the user is not in edit mode",
                vPosition: 1,
                bHasTiles: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_2"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has tiles and the user is in edit mode",
                vPosition: 1,
                bHasTiles: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_2"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has links and the user is not in edit mode",
                vPosition: 1,
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_2"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has links and the user is in edit mode",
                vPosition: 1,
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Link_1"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has tiles and links and the user is not in edit mode",
                vPosition: 1,
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: false,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_2"
            },
            {
                sTestDescription: "vPosition is 1 and oGroup has has tiles and links and the user is in edit mode",
                vPosition: 1,
                bHasTiles: true,
                bHasLinks: true,
                bTileActionModeActive: true,
                bExpectedMoveScrollDashboardCalled: true,
                sExpectedDomRefId: "Tile_2"
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnMoveScrollDashboard = sinon.stub(ComponentKeysHandler, "moveScrollDashboard"),
                oModel = new sap.ui.model.json.JSONModel({
                    tileActionModeActive: oFixture.bTileActionModeActive
                }),
                oGroup = {};

            ComponentKeysHandler.oModel = oModel;

            if (oFixture.bTileActionModeActive) {
                oGroup.oPlusTile = {
                    getDomRef: function () {
                        return {
                            id: "PlusTile"
                        };
                    }
                };
            }

            if (oFixture.bHasTiles) {
                oGroup.getTiles = function () {
                    return [{
                        getDomRef: function () {
                            return {
                                id: "Tile_1"
                            };
                        }
                    },
                    {
                        getDomRef: function () {
                            return {
                                id: "Tile_2"
                            };
                        }
                    }];
                };
            } else {
                oGroup.getTiles = function () {
                    return [];
                };
            }

            if (oFixture.bHasLinks) {
                oGroup.getLinks = function () {
                    return [{
                        getDomRef: function () {
                            return {
                                id: "Link_1"
                            };
                        }
                    },
                    {
                        getDomRef: function () {
                            return {
                                id: "Link_2"
                            };
                        }
                    }];
                };
            } else {
                oGroup.getLinks = function () {
                    return [];
                };
            }

            // Act
            ComponentKeysHandler._goToTileOfGroup(oFixture.vPosition, oGroup);

            // Assert
            strictEqual(fnMoveScrollDashboard.calledOnce, oFixture.bExpectedMoveScrollDashboardCalled,
                "_moveScrollDashboard was called once when " + oFixture.sTestDescription);
            if (oFixture.bExpectedMoveScrollDashboardCalled) {
                strictEqual(fnMoveScrollDashboard.args[0][0][0].id, oFixture.sExpectedDomRefId,
                    "The correct content was passed when " + oFixture.sTestDescription);
            }

            fnMoveScrollDashboard.restore();
        });
    });

    test("_getGroupAndTilesInfo:", function () {
        var oDashboard = new DashboardGroupsContainer(),
            oGroup = new TileContainer(),
            oTile = new StandardTile();

        var oDomRefDashboard = document.createElement("div");
        oDomRefDashboard.setAttribute("id", "dashboardGroups");
        document.body.appendChild(oDomRefDashboard);

        var oDomRefGroup = document.createElement("div");
        oDomRefGroup.setAttribute("id", "group");
        oDomRefGroup.classList.add("sapUshellTileContainer");
        oDomRefDashboard.appendChild(oDomRefGroup);

        var oDomRefTile = document.createElement("div");
        oDomRefTile.setAttribute("id", "tile");
        oDomRefTile.setAttribute("tabindex", "0");
        oDomRefTile.classList.add("sapUshellTile");
        oDomRefGroup.appendChild(oDomRefTile);

        oDashboard.getDomRef = function () {
            return oDomRefDashboard;
        };
        oGroup.getDomRef = function () {
            return oDomRefGroup;
        };
        oTile.getDomRef = function () {
            return oDomRefTile;
        };

        oGroup.getTiles = function () {
            return [oTile];
        };
        oGroup.getLinks = function () {
            return [];
        };

        oGroup.getShowPlaceholder = function () {
            return false;
        };

        [
            {
                sTestDescription: "no tile is focused",
                bFocusOnTile: false,
                oExpectedResult: null
            },
            {
                sTestDescription: "a tile is focused",
                bFocusOnTile: true,
                oExpectedResult: {
                    oCurTile: oTile,
                    oGroup: oGroup,
                    aTiles: [oTile],
                    aLinks: []
                }
            }
        ].forEach(function (oFixture) {
            // Arrange
            var nHelper = 0;
            var fnControlStub = sinon.stub(jQuery.fn, "control", function () {
                if (nHelper === 0) {
                    nHelper++;
                    return oTile;
                }
                return oGroup;
            });

            if (oFixture.bFocusOnTile) {
                oTile.focus();
            } else {
                oDashboard.focus();
            }

            // Act
            var bResult = ComponentKeysHandler._getGroupAndTilesInfo();

            // Assert
            deepEqual(bResult, oFixture.oExpectedResult, "the result was correct when ");

            fnControlStub.restore();
        });

        document.body.removeChild(oDomRefDashboard);
        oDashboard.exit();
    });

    test("_dashboardKeydownHandle:", function () {
        var oEvent = {};

        [
            {
                sTestDescription: "after \"F2\" button was pressed",
                nKeyCode: 113, // F2
                sExpectedFunctionName: "_renameGroup"
            },
            {
                sTestDescription: "after \"F7\" button was pressed",
                nKeyCode: 118, // F7
                sExpectedFunctionName: "_groupHeaderNavigation"
            },
            {
                sTestDescription: "after \"Delete\" button was pressed",
                nKeyCode: 46, // Delete
                sExpectedFunctionName: "_deleteButtonHandler"
            },
            {
                sTestDescription: "after \"Backspace\" button was pressed",
                nKeyCode: 8, // Backspace
                sExpectedFunctionName: "_deleteButtonHandler"
            },
            {
                sTestDescription: "after \"Arrow UP\" button was pressed",
                nKeyCode: 38, // Arrow UP
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["up", oEvent]
            },
            {
                sTestDescription: "after \"Arrow DOWN\" button was pressed",
                nKeyCode: 40, // Arrow DOWN
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["down", oEvent]
            },
            {
                sTestDescription: "after \"Arrow RIGHT\" button was pressed",
                nKeyCode: 39, // Arrow RIGHT
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["right", oEvent]
            },
            {
                sTestDescription: "after \"Arrow LEFT\" button was pressed",
                nKeyCode: 37, // Arrow LEFT
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["left", oEvent]
            },
            {
                sTestDescription: "after \"Arrow RIGHT\" button was pressed and user has RTL",
                nKeyCode: 39, // Arrow RIGHT
                bRTL: true,
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["left", oEvent]
            },
            {
                sTestDescription: "after \"Arrow LEFT\" button was pressed and user has RTL",
                nKeyCode: 37, // Arrow LEFT
                bRTL: true,
                sExpectedFunctionName: "_arrowsButtonsHandler",
                aExpectedArguments: ["right", oEvent]
            },
            {
                sTestDescription: "after \"Page UP\" button was pressed",
                nKeyCode: 33, // Page UP
                sExpectedFunctionName: "_goToFirstTileOfNextGroup",
                aExpectedArguments: ["up", oEvent]
            },
            {
                sTestDescription: "after \"Page DOWN\" button was pressed",
                nKeyCode: 34, // Page DOWN
                sExpectedFunctionName: "_goToFirstTileOfNextGroup",
                aExpectedArguments: ["down", oEvent]
            },
            {
                sTestDescription: "after \"HOME\" button was pressed",
                nKeyCode: 36, // HOME
                sExpectedFunctionName: "_homeEndButtonsHandler",
                aExpectedArguments: ["first", oEvent]
            },
            {
                sTestDescription: "after \"END\" button was pressed",
                nKeyCode: 35, // END
                sExpectedFunctionName: "_homeEndButtonsHandler",
                aExpectedArguments: ["last", oEvent]
            },
            {
                sTestDescription: "after \"SPACE\" button was pressed",
                nKeyCode: 32, // SPACE
                sExpectedFunctionName: "_spaceButtonHandler",
                aExpectedArguments: [oEvent]
            },
            {
                sTestDescription: "after \"ENTER\" button was pressed",
                nKeyCode: 13, // ENTER
                sExpectedFunctionName: "_spaceButtonHandler"
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnStub = sinon.stub(ComponentKeysHandler, oFixture.sExpectedFunctionName),
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    getConfiguration: function () {
                        return {
                            getRTL: function () {
                                return oFixture.bRTL;
                            }
                        };
                    }
                });

            oEvent.keyCode = oFixture.nKeyCode;

            // Act
            ComponentKeysHandler._dashboardKeydownHandler(oEvent);

            // Assert
            strictEqual(fnStub.calledOnce, true, oFixture.sExpectedFunctionName + " was called as expected " + oFixture.sTestDescription);
            if (oFixture.aExpectedArguments) {
                for (var i = 0; i < oFixture.aExpectedArguments.length; i++) {
                    strictEqual(fnStub.args[0][i], oFixture.aExpectedArguments[i],
                        "argument " + i + " was given as expected " + oFixture.sTestDescription);
                }
            }

            fnStub.restore();
            fnGetCoreStub.restore();
        });
    });

    test("handleFocusOnMe:", function () {
        [
            {
                sTestDescription: "a different current core view is given",
                sCurrentCoreView: "something",
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: false,
                bExpectedSetFocusOnCatalogTile: false,
                bExpectedAppFinderFocusMenuButtons: false,
                bExpectedAppFinderKeydownHandler: false
            },
            {
                sTestDescription: "no current core view is given",
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: false,
                bExpectedSetFocusOnCatalogTile: false,
                bExpectedAppFinderFocusMenuButtons: false,
                bExpectedAppFinderKeydownHandler: false
            },
            {
                sTestDescription: "home is the current core view",
                sCurrentCoreView: "home",
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: true,
                bExpectedSetFocusOnCatalogTile: false,
                bExpectedAppFinderFocusMenuButtons: false,
                bExpectedAppFinderKeydownHandler: false
            },
            {
                sTestDescription: "appFinder is the current core view",
                sCurrentCoreView: "appFinder",
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: false,
                bExpectedSetFocusOnCatalogTile: false,
                bExpectedAppFinderFocusMenuButtons: false,
                bExpectedAppFinderKeydownHandler: true
            },
            {
                sTestDescription: "appFinder is the current core view and we pass the first time",
                sCurrentCoreView: "appFinder",
                bFocusPassedFirstTime: true,
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: false,
                bExpectedSetFocusOnCatalogTile: false,
                bExpectedAppFinderFocusMenuButtons: true,
                bExpectedAppFinderKeydownHandler: false
            },
            {
                sTestDescription: "appFinder is the current core view, we pass the first time and shift is pressed",
                sCurrentCoreView: "appFinder",
                bFocusPassedFirstTime: true,
                bShift: true,
                bExpectedGoToLastVisitedTile: false,
                bExpectedGoToSelectedAnchorNavigationItem: false,
                bExpectedDashboardKeydownHandler: false,
                bExpectedSetFocusOnCatalogTile: true,
                bExpectedAppFinderFocusMenuButtons: false,
                bExpectedAppFinderKeydownHandler: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            sap.ushell.Container = {
                getRenderer: sinon.stub().returns({
                    getCurrentCoreView: function () {
                        return oFixture.sCurrentCoreView;
                    }
                })
            };

            var oEvent = { shiftKey: oFixture.bShift };

            var fnGTLVTStub = sinon.stub(ComponentKeysHandler, "goToLastVisitedTile"),
                fnGTSANIStub = sinon.stub(ComponentKeysHandler, "goToSelectedAnchorNavigationItem").returns(
                    oFixture.bAnchorItemSelected
                ),
                fnDKHStub = sinon.stub(ComponentKeysHandler, "_dashboardKeydownHandler"),
                fnSFOCT = sinon.stub(ComponentKeysHandler, "setFocusOnCatalogTile"),
                fnAFFMB = sinon.stub(ComponentKeysHandler, "appFinderFocusMenuButtons"),
                fnAFKH = sinon.stub(ComponentKeysHandler, "_appFinderKeydownHandler");

            // Act
            ComponentKeysHandler.handleFocusOnMe(oEvent, oFixture.bFocusPassedFirstTime);

            // Assert
            strictEqual(fnGTLVTStub.calledOnce, oFixture.bExpectedGoToLastVisitedTile,
                "goToLastVisitedTile was (not) called as expected when " + oFixture.sTestDescription);
            strictEqual(fnGTSANIStub.calledOnce, oFixture.bExpectedGoToSelectedAnchorNavigationItem,
                "goToSelectedAnchorNavigationItem was (not) called as expected when " + oFixture.sTestDescription);
            strictEqual(fnDKHStub.calledOnce, oFixture.bExpectedDashboardKeydownHandler,
                "_dashboardKeydownHandler was (not) called as expected when " + oFixture.sTestDescription);
            strictEqual(fnSFOCT.calledOnce, oFixture.bExpectedSetFocusOnCatalogTile,
                "setFocusOnCatalogTile was (not) called as expected when " + oFixture.sTestDescription);
            strictEqual(fnAFFMB.calledOnce, oFixture.bExpectedAppFinderFocusMenuButtons,
                "appFinderFocusMenuButtons was (not) called as expected when " + oFixture.sTestDescription);
            strictEqual(fnAFKH.calledOnce, oFixture.bExpectedAppFinderKeydownHandler,
                "_appFinderKeydownHandler was (not) called as expected when " + oFixture.sTestDescription);

            delete sap.ushell.Container;
            fnGTLVTStub.restore();
            fnGTSANIStub.restore();
            fnDKHStub.restore();
            fnSFOCT.restore();
            fnAFFMB.restore();
            fnAFKH.restore();
        });
    });

    [
        {
            sTestDescription: "Some key is pressed",
            iKey: 35, // End
            bExpectedFocusOnTileContainerHeader: false
        },
        {
            sTestDescription: "Enter key is pressed",
            iKey: 13, // Enter
            bExpectedFocusOnTileContainerHeader: true
        }
    ].forEach(function (oFixture) {
            test("handleFocusOnMe when inside an input field when " + oFixture.sTestDescription, function (assert) {
            // Arrange
            sap.ushell.Container = {
                getRenderer: sinon.stub().returns({
                    getCurrentCoreView: sinon.stub().returns("home")
                })
            };
            var done = assert.async();
            var fnDKHStub = sinon.stub(ComponentKeysHandler, "_dashboardKeydownHandler"),
                oEvent = { keyCode: oFixture.iKey },
                oTileContainerHeader = window.document.createElement("div"),
                oInput = window.document.createElement("input"),
                oQunitFixture = window.document.getElementById("qunit-fixture");

            oTileContainerHeader.classList.add("sapUshellTileContainerHeader");
            oTileContainerHeader.setAttribute("tabindex", "0");
            oTileContainerHeader.setAttribute("id", "someId");
            oInput.setAttribute("tabindex", "0");
            oTileContainerHeader.appendChild(oInput);
            oQunitFixture.appendChild(oTileContainerHeader);
            oInput.focus();

            // Act
            ComponentKeysHandler.handleFocusOnMe(oEvent, false);

            // Assert
            window.setTimeout(function () {
                if (oFixture.bExpectedFocusOnTileContainerHeader) {
                    assert.strictEqual(window.document.activeElement, oTileContainerHeader,
                        "focus was set on the tile container header");
                } else {
                    assert.strictEqual(window.document.activeElement, oInput, "focus remains on the input");
                }
                assert.strictEqual(fnDKHStub.callCount, 0, "_dashboardKeydownHandler was not called");
                done();

                delete sap.ushell.Container;
                fnDKHStub.restore();
                oQunitFixture.removeChild(oTileContainerHeader);
            }, 100);
        });
    });

    test("test anchor-navigation-bar, navigation between items:", function () {
        [
            {
                sTestDescription: "after the right-arrow key was pressed",
                sDirection: "right",
                sExpectedFocusedElementId: "jqAnchorItem3"
            },
            {
                sTestDescription: "after the down-arrow key was pressed",
                sDirection: "down",
                sExpectedFocusedElementId: "jqAnchorItem3"
            },
            {
                sTestDescription: "after the left-arrow key was pressed",
                sDirection: "left",
                sExpectedFocusedElementId: "jqAnchorItem1"
            },
            {
                sTestDescription: "after the up-arrow key was pressed",
                sDirection: "up",
                sExpectedFocusedElementId: "jqAnchorItem1"
            }
        ].forEach(function (oFixture) {
            var oAnchorItem1 = document.createElement("div");
            oAnchorItem1.setAttribute("id", "jqAnchorItem1");
            oAnchorItem1.setAttribute("tabindex", "0");
            oAnchorItem1.classList.add("sapUshellAnchorItem");
            oAnchorItem1.style.height = "1rem";
            oAnchorItem1.style.width = "0";
            document.body.appendChild(oAnchorItem1);

            var oAnchorItem2 = document.createElement("div");
            oAnchorItem2.setAttribute("id", "jqAnchorItem2");
            oAnchorItem2.setAttribute("tabindex", "0");
            oAnchorItem2.classList.add("sapUshellAnchorItem");
            oAnchorItem2.style.height = "1rem";
            oAnchorItem2.style.width = "0";
            document.body.appendChild(oAnchorItem2);

            var oAnchorItem3 = document.createElement("div");
            oAnchorItem3.setAttribute("id", "jqAnchorItem3");
            oAnchorItem3.setAttribute("tabindex", "0");
            oAnchorItem3.classList.add("sapUshellAnchorItem");
            oAnchorItem3.style.height = "1rem";
            oAnchorItem3.style.width = "0";
            document.body.appendChild(oAnchorItem3);

            oAnchorItem2.focus();
            ComponentKeysHandler._handleAnchorNavigationItemsArrowKeys(oFixture.sDirection, jQuery(oAnchorItem2));
            strictEqual(document.activeElement.getAttribute("id"), oFixture.sExpectedFocusedElementId,
                "The focus has been moved correctly " + oFixture.sTestDescription);

            document.body.removeChild(oAnchorItem1);
            document.body.removeChild(oAnchorItem2);
            document.body.removeChild(oAnchorItem3);
        });
    });

    test("_getNextTile:", function () {
        [
            {
                testDescription: "direction right, with more tiles on the right",
                direction: "right",
                groupIndex: 0,
                tileIndex: 0,
                tile: 0,
                bMoveTile: false,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "direction right, with no more tiles on the right",
                direction: "right",
                groupIndex: 2,
                tileIndex: 1,
                tile: 3,
                bMoveTile: false,
                expectedSelectedTileIndex: -1
            },
            {
                testDescription: "direction right, with next tile in the next group after the empty group",
                direction: "right",
                groupIndex: 0,
                tileIndex: 1,
                tile: 1,
                bMoveTile: false,
                expectedSelectedTileIndex: 2
            },
            {
                testDescription: "direction left, with more tiles on the left",
                direction: "left",
                groupIndex: 0,
                tileIndex: 1,
                tile: 1,
                bMoveTile: false,
                expectedSelectedTileIndex: 0
            },
            {
                testDescription: "direction left, with no more tiles on the left",
                direction: "left",
                groupIndex: 0,
                tileIndex: 0,
                tile: 0,
                bMoveTile: false,
                expectedSelectedTileIndex: -1
            },
            {
                testDescription: "direction left, with next tile in the next group after the empty group",
                direction: "left",
                groupIndex: 2,
                tileIndex: 0,
                tile: 2,
                bMoveTile: false,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "direction up from first tile in group, with next tile in the next group after the empty group",
                direction: "up",
                groupIndex: 2,
                tileIndex: 0,
                tile: 2,
                bMoveTile: false,
                expectedSelectedTileIndex: 0
            },
            {
                testDescription: "direction up from second tile in group, with next tile in the next group after the empty group",
                direction: "up",
                groupIndex: 2,
                tileIndex: 0,
                tile: 3,
                bMoveTile: false,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "direction down from first tile in group, with next tile in the next group after the empty group",
                direction: "down",
                groupIndex: 0,
                tileIndex: 0,
                tile: 0,
                bMoveTile: false,
                expectedSelectedTileIndex: 2
            },
            {
                testDescription: "direction down from second tile in group, with next tile in the next group after the empty group",
                direction: "down",
                groupIndex: 0,
                tileIndex: 1,
                tile: 1,
                bMoveTile: false,
                expectedSelectedTileIndex: 3
            },
            {
                testDescription: "move tile, direction right, with next tile in the empty group",
                direction: "right",
                groupIndex: 0,
                tileIndex: 1,
                tile: 1,
                bMoveTile: true,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "move tile, direction left, with next tile in the empty group",
                direction: "left",
                groupIndex: 2,
                tileIndex: 0,
                tile: 2,
                bMoveTile: true,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "move tile, direction up, with next tile in the empty group",
                direction: "up",
                groupIndex: 2,
                tileIndex: 0,
                tile: 3,
                bMoveTile: true,
                expectedSelectedTileIndex: 1
            },
            {
                testDescription: "move tile, direction down, with next tile in the empty group",
                direction: "down",
                groupIndex: 0,
                tileIndex: 1,
                tile: 1,
                bMoveTile: true,
                expectedSelectedTileIndex: 1
            }
        ].forEach(function (oFixture) {
            // Arrange

            var mTileDomConfig = {
                "0": {
                    "top": 0,
                    "bottom": 175,
                    "left": 0,
                    "right": 175
                },
                "1": {
                    "top": 0,
                    "bottom": 175,
                    "left": 200,
                    "right": 375
                },
                "2": {
                    "top": 100,
                    "bottom": 275,
                    "left": 0,
                    "right": 175
                },
                "3": {
                    "top": 100,
                    "bottom": 275,
                    "left": 200,
                    "right": 375
                }
            };

            function mockDomRef (i) {
                return function () {
                    return {
                        getBoundingClientRect: function () {
                            return mTileDomConfig[i];
                        }
                    };
                };
            }

            var oDashboard = new DashboardGroupsContainer();
            var i;
            var aGroups = [];
            for (i = 0; i < 3; i++) {
                aGroups.push(new TileContainer());
                aGroups[i].getLinks = function () {
                    return [];
                };
                aGroups[i].getShowPlaceholder = function () {
                    return false;
                };
                aGroups[i].getIsGroupLocked = function () {
                    return false;
                };
                aGroups[i].getProperty = function () {
                    return false;
                };
                aGroups[i].getVisible = function () {
                    return true;
                };
            }

            var aTiles = [];
            for (i = 0; i < 4; i++) {
                aTiles.push(new StandardTile());
                aTiles[i].getDomRef = mockDomRef(i);
                aTiles[i].getBindingContext = function () {
                    return {
                        getObject: function () {
                            return {
                                object: undefined
                            };
                        }
                    };
                };
            }

            // add invisible plusTiles
            var aPlusTiles = [];
            aGroups.forEach(function (oGroup) {
                var oTile = new StandardTile();
                aPlusTiles.push(oTile);
                oGroup.oPlusTile = oTile;
            });

            aGroups[0].addTile(aTiles[0]);
            aGroups[0].addTile(aTiles[1]);

            aGroups[2].addTile(aTiles[2]);
            aGroups[2].addTile(aTiles[3]);

            aGroups.forEach(function (oGroup) {
                oDashboard.addGroup(oGroup);
            });

            var oInfo = {
                nCurTileIndex: oFixture.tileIndex,
                aTiles: aGroups[oFixture.groupIndex].getTiles(),
                oGroup: aGroups[oFixture.groupIndex],
                oCurTile: aTiles[oFixture.tile],
                aLinks: []
            };

            var oOldModel = ComponentKeysHandler.oModel;
            var oOldContainer = sap.ushell.Container;
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isLinkPersonalizationSupported: function () {
                            return true;
                        }
                    };
                }
            };
            ComponentKeysHandler.oModel = {
                getProperty: function () {
                    return false;
                }
            };

            var expectedTile;
            if (oFixture.bMoveTile) {
                expectedTile = aPlusTiles[oFixture.expectedSelectedTileIndex];
            } else {
                expectedTile = aTiles[oFixture.expectedSelectedTileIndex];
            }

            var fnGetProperty = sinon.stub(ComponentKeysHandler.oModel, "getProperty").returns(false);

            // Act
            var nextTile = ComponentKeysHandler._getNextTile(oFixture.direction, oFixture.bMoveTile, oInfo);

            // Assert
            strictEqual(nextTile, expectedTile, "correct Tile was selected when " + oFixture.testDescription);

            ComponentKeysHandler.oModel = oOldModel;
            sap.ushell.Container = oOldContainer;
            fnGetProperty.restore();
            oDashboard.exit();
        });
    });
});