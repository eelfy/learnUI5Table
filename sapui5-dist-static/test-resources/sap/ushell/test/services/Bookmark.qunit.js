// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
sap.ui.require([
    "sap/ushell/services/Bookmark",
    "sap/ushell/test/utils",
    "sap/ushell/Config",
    "sap/ushell/library"
], function (Bookmark, testUtils, Config, library) {
    "use strict";
    /*global QUnit, sinon */

    // require early so that we can spy on them (and esp. try to restore the spies in teardown)

    var oBookmarkService,
        oLaunchPageService,
        oConfigStub,
        oAddBookmarkToPageStub,
        sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.Bookmark", {
        beforeEach: function () {
            oLaunchPageService = {
                addBookmark: sinon.stub().returns(jQuery.Deferred().promise()),
                onCatalogTileAdded: sinon.stub(),
                updateBookmarks: sinon.stub().returns({}),
                getGroupId: function (oGroup) {
                    return oGroup.id;
                },
                getGroupTitle: function (oGroup) {
                    return oGroup.title;
                }
            };
            oAddBookmarkToPageStub = sinon.stub();
            sap.ushell.Container = {
                getService: function (sName) {
                    return oLaunchPageService;
                },
                getServiceAsync: sinon.stub().returns(Promise.resolve({
                    addBookmarkToPage: oAddBookmarkToPageStub
                }))
            };
            oBookmarkService = new Bookmark();

            oConfigStub = sinon.stub(Config, "last");
            oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            testUtils.restoreSpies(
            );
            delete sap.ushell.Container;

            oConfigStub.restore();
        }
    });

    QUnit.test("addBookmarkByGroupId while personalization is disabled", function (assert) {
        var oBookmarkConfig = { title: "AddedById", url: "#FioriToExtAppTarget-Action" },
            groupId = "group_0";

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "group_0" }]).promise();
        };

        // code under test
        oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, groupId);

        // test
        assert.ok(oLaunchPageService.addBookmark.notCalled);
    });

    QUnit.test("addBookmarkByGroupId while personalization is enabled", function (assert) {
        var oBookmarkConfig = { title: "AddedById", url: "#FioriToExtAppTarget-Action" },
            groupId = "group_0";
        oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "group_0" }]).promise();
        };

        // code under test
        oBookmarkService.addBookmarkByGroupId(oBookmarkConfig, groupId);

        // test
        assert.ok(oLaunchPageService.addBookmark.calledOnce);
        assert.ok(oLaunchPageService.addBookmark.calledWith(oBookmarkConfig));
    });

    QUnit.test("getGroupsIdsForBookmarks", function (assert) {
        oLaunchPageService.getGroupsForBookmarks = function () {
            return (new jQuery.Deferred()).resolve([
                { id: "1", title: "group1", object: { id: 1, title: "group1" } },
                { id: "2", title: "group2", object: { id: 2, title: "group2" } },
                { id: "3", title: "group3", object: { id: 3, title: "group3" } }
            ]).promise();
        };

        return oBookmarkService.getShellGroupIDs().done(function (aGroups) {
            assert.strictEqual(aGroups.length, 3, "groups were filtered correctly");
            assert.deepEqual(aGroups[0], { id: 1, title: "group1" });
            assert.deepEqual(aGroups[1], { id: 2, title: "group2" });
            assert.deepEqual(aGroups[2], { id: 3, title: "group3" });
        });
    });

    QUnit.test("_isMatchingRemoteCatalog", function (assert) {
        var oCatalog = {
            getCatalogData: sinon.stub().returns({ remoteId: "foo", baseUrl: "/bar" })
        };

        oLaunchPageService.getCatalogData = function (oCatalog0) {
            return oCatalog0.getCatalogData();
        };
        // remote catalogs
        assert.strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            { remoteId: "bar", baseUrl: "/bar" }), false);
        assert.strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            { remoteId: "foo", baseUrl: "/baz" }), false);
        assert.strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            { remoteId: "foo", baseUrl: "/bar" }), true);
        assert.strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            { remoteId: "foo", baseUrl: "/bar/" }), true);
        oCatalog.getCatalogData.returns({ remoteId: "foo", baseUrl: "/bar/" });
        assert.strictEqual(oBookmarkService._isMatchingRemoteCatalog(oCatalog,
            { remoteId: "foo", baseUrl: "/bar" }), true);
    });

    /*
     * Resolve the promise with the given index and result or fail if it is bound to fail
     * currently.
     *
     * @param {number} iFailAtPromiseNo
     *   the index for which to fail
     * @param {number} iIndex
     *   the index of the current resolution
     * @param {object} oResult
     *   argument to jQuery.Deferred#resolve
     * @returns the given deferred object's promise
     */
    function resolveOrFail (iFailAtPromiseNo, iIndex, oResult) {
        var oDeferred = new jQuery.Deferred();
        // return results asynchronously, otherwise LPA.getCatalogs() reports only the last catalog
        // via progress
        sap.ushell.utils.call(function () {
            if (iFailAtPromiseNo === iIndex) {
                oDeferred.reject("Fail at promise #" + iFailAtPromiseNo);
            } else {
                if (sap.ushell.utils.isArray(oResult)) {
                    oResult.forEach(function (oSingleResult) {
                        oDeferred.notify(oSingleResult);
                    });
                }
                oDeferred.resolve(oResult);
            }
        }, testUtils.onError, true);
        return oDeferred.promise();
    }

    function testDoAddCatalogTileToGroup (iFailAtPromiseNo, sGroupId, bCatalogTileSuffix) {
        var bAddTileCalled = false,
            oCatalog = {},
            sCatalogTileId = "foo",
            fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // stubs and tests
        oLaunchPageService.addTile = function (oCatalogTile, oGroup) {
            QUnit.assert.deepEqual(oCatalogTile, { id: sCatalogTileId });
            QUnit.assert.deepEqual(oGroup, { id: sGroupId });
            QUnit.assert.strictEqual(bAddTileCalled, false, "addTile() not yet called!");
            bAddTileCalled = true;
            return fnResolveOrFail(1);
        };
        oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        oLaunchPageService.getCatalogTileId = function (oCatalogTile) {
            if (bCatalogTileSuffix) {
                // see BCP 0020751295 0000142292 2017
                return oCatalogTile.id + "_SYS.ALIAS";
            }
            return oCatalogTile.id;
        };
        oLaunchPageService.getCatalogTiles = function (oCatalog0) {
            QUnit.assert.strictEqual(oCatalog0, oCatalog);
            return fnResolveOrFail(2,
                // simulate broken HANA catalog with duplicate CHIP IDs
                [{}, { id: sCatalogTileId }, { id: sCatalogTileId }]);
        };
        oLaunchPageService.getDefaultGroup = function () {
            return fnResolveOrFail(3, { id: undefined });
        };
        oLaunchPageService.getGroups = function () {
            return fnResolveOrFail(3, [{}, { id: sGroupId }]);
        };
        oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };


        // code under test
        return new Promise(function (resolve, reject) {
            oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), sCatalogTileId, oCatalog,
            sGroupId)
            .fail(function (sMessage) {
                QUnit.assert.strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
               resolve();
            })
            .done(function () {
                QUnit.assert.strictEqual(iFailAtPromiseNo, 0, "Success");
                resolve();
            });
        });



    }

    [true, false].forEach(function (bCatalogTileSuffix) {
        [0, 1, 2, 3].forEach(function (iFailAtPromiseNo) {
            var sTitle = "catalog tile ID " + (bCatalogTileSuffix ? "with" : "without") + " suffix; ";
            sTitle += (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
            QUnit.test("_doAddCatalogTileToGroup (default); " + sTitle, function (assert) {
                return testDoAddCatalogTileToGroup(iFailAtPromiseNo, undefined, bCatalogTileSuffix);
            });
            QUnit.test("_doAddCatalogTileToGroup (given); " + sTitle, function (assert) {
                return testDoAddCatalogTileToGroup(iFailAtPromiseNo, {}, bCatalogTileSuffix);
            });
        });
    });

    QUnit.test("_doAddCatalogTileToGroup (missing group)", function (assert) {
        var sGroupId = "unknown",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error("Group 'unknown' is unknown", null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getGroups = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };
        oLaunchPageService.getGroupId = function (oGroup) {
            return oGroup.id;
        };

        // code under test
        oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {}, sGroupId)
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, "Group 'unknown' is unknown");
                oLogMock.verify();
            })
            .done(function () {
                testUtils.onError();
            })
            .always(assert.async());
    });

    QUnit.test("_doAddCatalogTileToGroup (missing tile)", function (assert) {
        var sError = "No tile 'foo' in catalog 'bar'",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getDefaultGroup = function () {
            return (new jQuery.Deferred()).resolve({}).promise();
        };
        oLaunchPageService.getCatalogTiles = function (oCatalog) {
            return (new jQuery.Deferred()).resolve([{}, {}]).promise();
        };
        oLaunchPageService.getCatalogId = function () {
            return "bar";
        };
        oLaunchPageService.getCatalogTileId = function () {
            return "";
        };
        oLaunchPageService.getGroupId = function () {
            return "testGroupId";
        };

        // code under test
        oBookmarkService._doAddCatalogTileToGroup(new jQuery.Deferred(), "foo", {})
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .done(function () {
                testUtils.onError();
            })
            .always(assert.async());
    });

    function testAddCatalogTileToGroup (iFailAtPromiseNo, oTargetCatalog, oCatalogData) {
        var sCatalogTileId = "foo",
            oTestGroup = {},
            oSecondMatchingCatalog = JSON.parse(JSON.stringify(oTargetCatalog)),
            fnResolveOrFail = resolveOrFail.bind(null, iFailAtPromiseNo);

        // preparation
        sinon.stub(oBookmarkService, "_doAddCatalogTileToGroup").callsFake(function (oDeferred, sTileId, oCatalog, oGroup) {
            QUnit.assert.strictEqual(sTileId, sCatalogTileId);
            QUnit.assert.strictEqual(oCatalog, oTargetCatalog);
            QUnit.assert.strictEqual(oGroup, oTestGroup);
            if (iFailAtPromiseNo === 2) {
                oDeferred.reject("Fail at #" + iFailAtPromiseNo);
            } else {
                oDeferred.resolve();
            }
        });
        oLaunchPageService.getCatalogs = function () {
            QUnit.assert.ok(oLaunchPageService.onCatalogTileAdded.calledWith(sCatalogTileId));
            return fnResolveOrFail(1, [{}, oTargetCatalog, oSecondMatchingCatalog]);
        };

        // code under test
        return oBookmarkService.addCatalogTileToGroup(sCatalogTileId, oTestGroup, oCatalogData)
            .fail(function (sMessage) {
                QUnit.assert.strictEqual(sMessage, "Fail at promise #" + iFailAtPromiseNo);
            })
            .done(function () {
                QUnit.assert.strictEqual(iFailAtPromiseNo, 0, "Success");
            });
        //TODO catalog refresh call with catalog ID
        //TODO enhance LPA.onCatalogTileAdded by optional sCatalogId parameter
    }

    [0, 1].forEach(function (iFailAtPromiseNo) {
        var sTitle = (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
        QUnit.test("addCatalogTileToGroup (HANA legacy catalog), " + sTitle, function (assert) {

            oLaunchPageService.getCatalogId = function (oCatalog) {
                return oCatalog.id;
            };

            testAddCatalogTileToGroup(iFailAtPromiseNo,
                { id: "X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG" });
        });
    });

    [0, 1].forEach(function (iFailAtPromiseNo) {
        var sTitle = (iFailAtPromiseNo > 0) ? "fail at #" + iFailAtPromiseNo : "success";
        QUnit.test("addCatalogTileToGroup (remote catalog), " + sTitle, function (assert) {
            var oCatalogData = {},
                oRemoteCatalog = { remoteId: "foo" },
                oLogMock = testUtils.createLogMock()
                    .filterComponent("sap.ushell.services.Bookmark")
                    .warning("More than one matching catalog: " + JSON.stringify(oCatalogData),
                        null, "sap.ushell.services.Bookmark");

            oBookmarkService._isMatchingRemoteCatalog = function (oCatalog, oCatalogData0) {
                return oCatalog.remoteId === "foo";
            };

            testAddCatalogTileToGroup(iFailAtPromiseNo, oRemoteCatalog, oCatalogData)
                .done(function () {
                    oLogMock.verify();
                });
        });
    });

    QUnit.test("addCatalogTileToGroup (missing remote catalog)", function (assert) {
        var sError = "No matching catalog found: {}",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oBookmarkService._isMatchingRemoteCatalog = function () {
            return false;
        };

        oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };

        // code under test
        oBookmarkService.addCatalogTileToGroup("foo", "groupId", {})
            .done(function () {
                testUtils.onError();
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .always(assert.async());
    });

    QUnit.test("addCatalogTileToGroup (missing legacy HANA catalog)", function (assert) {
        var sError = "No matching catalog found: "
            + "{\"id\":\"X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG\"}",
            oLogMock = testUtils.createLogMock()
                .filterComponent("sap.ushell.services.Bookmark")
                .error(sError, null, "sap.ushell.services.Bookmark");

        oLaunchPageService.getCatalogs = function () {
            return (new jQuery.Deferred()).resolve([{ id: "default" }, { id: "bar" }]).promise();
        };
        oLaunchPageService.getCatalogId = function (oCatalog) {
            return oCatalog.id;
        };

        // code under test
        oBookmarkService.addCatalogTileToGroup("foo", "groupId")
            .done(function () {
                testUtils.onError();
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, sError);
                oLogMock.verify();
            })
            .always(assert.async());
    });

    QUnit.test("'addBookmarkByGroupId' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var sExpectedErrorMessage = "Bookmark Service: The API 'addBookmarkByGroupId' is not supported in launchpad spaces mode.";

        // Act
        var oResult = oBookmarkService.addBookmarkByGroupId();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    QUnit.test("'getShellGroupIDs' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var sExpectedErrorMessage = "Bookmark Service: The API 'getShellGroupIDs' is not supported in launchpad spaces mode.";

        // Act
        var oResult = oBookmarkService.getShellGroupIDs();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    QUnit.test("'addCatalogTileToGroup' returns a rejected promise in spaces mode", function (assert) {
        // Arrange
        oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var sExpectedErrorMessage = "Bookmark Service: The API 'addCatalogTileToGroup' is not supported in launchpad spaces mode.";

        // Act
        var oResult = oBookmarkService.addCatalogTileToGroup();

        oResult
            .done(function () {
                assert.ok(false, "The promise resolved.");
            })
            .fail(function (sError) {
                // Assert
                assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with defined error message");
            })
            .always(assert.async());
    });

    QUnit.module("The constructor", {
        beforeEach: function () {
            var oGetServiceAsyncStub = sandbox.stub();
            var oGetServiceStub = sandbox.stub();

            this.oGetPagesServiceStub = oGetServiceAsyncStub.withArgs("Pages").resolves("Pages");
            this.oGetLaunchPageServiceStub = oGetServiceStub.withArgs("LaunchPage").returns("LaunchPage");

            sap.ushell.Container = {
                getServiceAsync: oGetServiceAsyncStub,
                getService: oGetServiceStub
            };

            this.oConfigStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Initializes the required services correctly if spaces mode is off", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        var oService = new Bookmark();

        // Assert
        return oService._oPagesServicePromise.catch(function (sErrorMessage) {
            assert.strictEqual(this.oGetLaunchPageServiceStub.callCount, 1, "The function requested the LaunchPage service.");
            assert.strictEqual(sErrorMessage, "Pages service is not available in classic homepage mode.", "The function rejects the pages service promise if the service was initialized in classic homepage mode.");
        }.bind(this));
    });

    QUnit.test("Initializes the required services correctly if spaces mode is on", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        var oService = new Bookmark();

        // Assert
        return oService._oPagesServicePromise.then(function (sServiceName) {
            assert.strictEqual(this.oGetLaunchPageServiceStub.callCount, 1, "The function requested the LaunchPage service.");
            assert.strictEqual(sServiceName, "Pages", "The function requested the Pages service only if spaces where enabled.");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmarkToPage'", {
        beforeEach: function () {
            this.oAddBookmarkToPageStub = sinon.stub();
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().withArgs("Pages").resolves({
                    addBookmarkToPage: this.oAddBookmarkToPageStub
                }),
                getService: function () {}
            };

            this.oConfigStub = sinon.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            this.oConfigStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns a rejected promise in the launchpad homepage mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var sExpectedErrorMessage = "Bookmark Service: 'addBookmarkToPage' is not valid in launchpad homepage mode, use 'addBookmark' instead.";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage();

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise when personalization is not enabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        var sExpectedErrorMessage = "Bookmark Service: Add bookmark is not allowed as the personalization functionality is not enabled.";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage();

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a rejected promise if invalid bookmark data is passed", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
        var oParams = {};
        var sPageId = "pageId";


        var sExpectedErrorMessage = "Bookmark Service - Invalid bookmark data.";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        return oResult.catch(function (sError) {
            // Assert
            assert.strictEqual(sError, sExpectedErrorMessage, "The Promise has been rejected with the predefined error message.");
        });
    });

    QUnit.test("Returns a resolved promise when the configurations are correctly set", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

        var oParams = {
            title: "bookmark-title",
            url: "bookmark-url"
        };
        var sPageId = "pageId";

        // Act
        var oResult = this.oBookmarkService.addBookmarkToPage(oParams, sPageId);

        return oResult.then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "The addBookmarkToPage of the pages service is called once.");
            assert.deepEqual(this.oAddBookmarkToPageStub.firstCall.args, [sPageId, oParams], "The addBookmarkToPage of the pages service is called with right parameters.");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmark'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

            this.oGetDefaultPageStub = sandbox.stub().resolves({
                id: "myId",
                title: "myTitle"
            });

            this.oBookmarkMock = {
                id: "SomeId",
                title: "Some Title"
            };

            sap.ushell.Container = {
                getService: function () {},
                getServiceAsync: sandbox.stub().withArgs("Menu").resolves({
                    getDefaultPage: this.oGetDefaultPageStub
                })
            };

            this.oBookmarkService = new Bookmark();

            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Resolves the promise without adding a bookmark if the personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        return this.oBookmarkService.addBookmark().done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the default group in classic homepage scenario if container wasn't provided", function (assert) {
        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], undefined, "'addBookmarkToHomepageGroup' was called with the right group.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to a classic homepage group if the provided container is a legacy Launchpage group object", function (assert) {
        // Arrange
        var oLaunchpageGroup = {
            id: "group1",
            title: "Group 1"
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oLaunchpageGroup).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 0, "'_addBookmarkToContentNodes' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], oLaunchpageGroup, "'addBookmarkToHomepageGroup' was called with the right group.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the provided content node", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: library.ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to multiple provided content nodes", function (assert) {
        // Arrange
        var aContentNodes = [
            {
                id: "page1",
                label: "Page 1",
                type: library.ContentNodeType.Page,
                isContainer: true
            },
            {
                id: "page2",
                label: "Page 2",
                type: library.ContentNodeType.Page,
                isContainer: true
            }
        ];

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, aContentNodes).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], aContentNodes, "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to the defaultPage if no content node was provided and spaces mode is active", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var oExpectedContentNode = {
            id: "myId",
            label: "myTitle",
            type: library.ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService.addBookmark(this.oBookmarkMock, undefined).done(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oExpectedContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the bookmark couldn't be added to a content node", function (assert) {
        // Arrange
        this.oAddBookmarkToContentNodesStub.rejects("ContentNode 'page1' couldn't be saved.");

        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: library.ContentNodeType.Page,
            isContainer: true
        };

        // Act
        this.oBookmarkService.addBookmark(this.oBookmarkMock, oContentNode)
            .done(function () {
                assert.ok(false, "The promise wasn't rejected.");
            })
            .fail(function (oError) {
                // Assert
                assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
                assert.strictEqual(this.oAddBookmarkToContentNodesStub.callCount, 1, "'_addBookmarkToContentNodes' was called exactly once.");
                assert.strictEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[0], this.oBookmarkMock, "'_addBookmarkToContentNodes' was called with the right bookmark.");
                assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args[1], [oContentNode], "'_addBookmarkToContentNodes' was called with the right content nodes.");

                assert.strictEqual(oError.toString(), "ContentNode 'page1' couldn't be saved.", "The promise was rejected with the correct error message.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.module("The function '_addBookmarkToContentNodes'", {
        beforeEach: function () {
            this.oMockGroups = {
                group1: {
                    id: "group1",
                    title: "Group One"
                },
                group2: {
                    id: "group2",
                    title: "Group Two"
                }
            };

            this.oBookmarkMock = {
                id: "SomeId",
                title: "Some Title"
            };

            this.oGetGroupByIdStub = sandbox.stub().callsFake(function (sGroupId) {
                return new jQuery.Deferred().resolve(this.oMockGroups[sGroupId]).promise();
            }.bind(this));

            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("LaunchPage").returns({
                    getGroupById: this.oGetGroupByIdStub
                }),
                getServiceAsync: sandbox.stub()
            };

            this.oBookmarkService = new Bookmark();

            this.oAddBookmarkToHomepageGroupStub = sandbox.stub(this.oBookmarkService, "addBookmarkToHomepageGroup").resolves();
            this.oAddBookmarkToPageStub = sandbox.stub(this.oBookmarkService, "addBookmarkToPage").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Adds the bookmark to a page if the provided content node type is 'Page'", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: library.ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroup' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to a classic homepage group if the provided content node type is 'HomepageGroup'", function (assert) {
        // Arrange
        var oContentNode = {
            id: "group1",
            label: "Group 1",
            type: library.ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).then(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
        }.bind(this));
    });

    QUnit.test("Adds the bookmark to multiple content nodes if multiple content nodes were provided", function (assert) {
        // Arrange
        var aContentNodes = [
            {
                id: "group1",
                label: "Group 1",
                type: library.ContentNodeType.HomepageGroup,
                isContainer: true
            },
            {
                id: "page1",
                label: "Page 1",
                type: library.ContentNodeType.Page,
                isContainer: true
            }
        ];

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, aContentNodes).then(function () {
            // Assert
            // HomepageGroup (first content node)
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");

            // Page (second content node)
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if one of the multiple content nodes couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToPageStub.rejects("Error while adding content node of type 'Page'");

        var aContentNodes = [
            {
                id: "group1",
                label: "Group 1",
                type: library.ContentNodeType.HomepageGroup,
                isContainer: true
            },
            {
                id: "page1",
                label: "Page 1",
                type: library.ContentNodeType.Page,
                isContainer: true
            }
        ];

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, aContentNodes).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'Page'", "The promise was rejected with the correct error message.");

            // HomepageGroup (first content node)
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");

            // Page (second content node)
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if a content node of type 'HomepageGroup' couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToHomepageGroupStub.rejects("Error while adding content node of type 'HomepageGroup'");

        var oContentNode = {
            id: "group1",
            label: "Group 1",
            type: library.ContentNodeType.HomepageGroup,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'HomepageGroup'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 1, "'addBookmarkToHomepageGroup' was called exactly once.");
            assert.strictEqual(this.oGetGroupByIdStub.firstCall.args[0], "group1", "'getGroupById' of the launchpage service was called with the right group id.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToHomepageGroup' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.firstCall.args[1], this.oMockGroups.group1, "'addBookmarkToHomepageGroup' was called with the right launchpage group.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if a content node of type 'Page' couldn't be saved", function (assert) {
        // Arrange
        this.oAddBookmarkToPageStub.rejects("Error while adding content node of type 'Page'");

        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: library.ContentNodeType.Page,
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Error while adding content node of type 'Page'", "The promise was rejected with the correct error message.");

            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "'addBookmarkToPage' was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[0], this.oBookmarkMock, "'addBookmarkToPage' was called with the right bookmark.");
            assert.strictEqual(this.oAddBookmarkToPageStub.firstCall.args[1], "page1", "'addBookmarkToPage' was called with the right page id.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the provided content node type is not supported", function (assert) {
        // Arrange
        var oContentNode = {
            id: "container",
            label: "Some container",
            type: "UnsupportedType",
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Bookmark Service: The API needs to be called with a valid content node type. 'UnsupportedType' is not supported.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if one of the provided content nodes doesn't have a type", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            isContainer: true
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if the provided content node is not a container", function (assert) {
        // Arrange
        var oContentNode = {
            id: "page1",
            label: "Page 1",
            type: library.ContentNodeType.Page,
            isContainer: false
        };

        // Act
        return this.oBookmarkService._addBookmarkToContentNodes(this.oBookmarkMock, [oContentNode]).catch(function (oError) {
            // Assert
            assert.strictEqual(oError.toString(), "Bookmark Service: Not a valid content node.", "The promise was rejected with the correct error message.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 0, "'addBookmarkToPage' wasn't called.");
            assert.strictEqual(this.oAddBookmarkToHomepageGroupStub.callCount, 0, "'addBookmarkToHomepageGroupStub' wasn't called.");
        }.bind(this));
    });

    QUnit.module("The function 'addCustomBookmark'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

            sap.ushell.Container = {
                getService: sandbox.stub(),
                getServiceAsync: sandbox.stub()
            };

            this.oBookmarkService = new Bookmark();
            this.oAddBookmarkToContentNodesStub = sandbox.stub(this.oBookmarkService, "_addBookmarkToContentNodes").resolves();

            this.oMockContentNode = {
                id: "mockContentNode",
                label: "Mock Content Node",
                type: library.ContentNodeType.Page,
                isContainer: true
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves with the correct bookmark config if loadManifest='true'", function (assert) {
        // Arrange
        var oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            },
            loadManifest: true
        };

        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            },
            loadManifest: true
        };

        var oEnhancedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizType: "custom.abap.tile",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                },
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: false
                }
            }
        };

        // Act
        return this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode).then(function () {
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args, [ oEnhancedConfig, [ this.oMockContentNode ], true ], "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
            assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
        }.bind(this));
    });

    QUnit.test("Enhances the bookmark config with additional properties without modifying the provided config object", function (assert) {
        // Arrange
        var oOriginalConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            }
        };

        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            }
        };

        var oEnhancedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizType: "custom.abap.tile",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                },
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: true
                }
            }
        };

        // Act
        return this.oBookmarkService.addCustomBookmark("custom.abap.tile", oBookmarkConfig, this.oMockContentNode).then(function () {
            assert.deepEqual(this.oAddBookmarkToContentNodesStub.firstCall.args, [oEnhancedConfig, [this.oMockContentNode], true], "The function '_addBookmarkToContentNodes' was called with the enhanced config.");
            assert.deepEqual(oBookmarkConfig, oOriginalConfig, "The provided bookmark config was not altered.");
        }.bind(this));
    });

    QUnit.module("The function 'getContentNodes'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

            this.oHierarchyMock = {
                spaces: [
                  {
                    title: "Space with 2 pages",
                    id: "space0",
                    pages: [
                      {
                        title: "Page 0-0",
                        id: "page0-0"
                      },
                      {
                        title: "Page 0-1",
                        id: "page0-1"
                      }
                    ]
                  },
                  {
                    title: "Space without page",
                    id: "space1",
                    pages: [
                    ]
                  },
                  {
                    title: "Space with one page",
                    id: "space2",
                    pages: [
                      {
                        title: "Page 2-0",
                        id: "page2-0"
                      }
                    ]
                  }
                ]
              };
            this.oGroupsMock = [
                {
                  id: "group_0",
                  title: "Group 0",
                  isPreset: true,
                  isVisible: true,
                  isDefaultGroup: true,
                  isGroupLocked: false,
                  tiles: []
                },
                {
                  id: "group_1",
                  title: "Group 1",
                  isPreset: false,
                  isVisible: true,
                  isGroupLocked: false,
                  tiles: [
                    {
                      id: "tile_0",
                      title: "Long Tile 1",
                      size: "1x2",
                      tileType: "sap.ushell.ui.tile.StaticTile",
                      isLinkPersonalizationSupported: true,
                      chipId: "catalogTile_38",
                      properties: {
                        title: "Long Tile 1",
                        subtitle: "Long Tile 1",
                        infoState: "Neutral",
                        info: "0 days running without bugs",
                        icon: "sap-icon://flight",
                        targetURL: "#Action-todefaultapp"
                      }
                    }
                  ]
                }
              ];

            this.oGetSpacesPagesHierarchyStub = sandbox.stub().returns(this.oHierarchyMock);

            this.oGetGroupsStub = sandbox.stub().callsFake(function () {
                return new jQuery.Deferred().resolve(this.oGroupsMock).promise();
            }.bind(this));

            this.oLaunchPageServiceStub = {
                getGroups: this.oGetGroupsStub,
                getGroupId: function (oGroup) {
                    return oGroup.id;
                },
                getGroupTitle: function (oGroup) {
                    return oGroup.title;
                }
            };

            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("Menu").resolves({
                    getSpacesPagesHierarchy: this.oGetSpacesPagesHierarchyStub
                }),
                getService: sandbox.stub().withArgs("LaunchPage").returns(this.oLaunchPageServiceStub)
            };

            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct contentNodes if in spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        var oExpectedContentNodes = [
            {
              id: "space0",
              label: "Space with 2 pages",
              type: "Space",
              isContainer: false,
              children: [
                {
                  id: "page0-0",
                  label: "Page 0-0",
                  type: "Page",
                  isContainer: true
                },
                {
                  id: "page0-1",
                  label: "Page 0-1",
                  type: "Page",
                  isContainer: true
                }
              ]
            },
            {
              id: "space1",
              label: "Space without page",
              type: "Space",
              isContainer: false,
              children: []
            },
            {
              id: "space2",
              label: "Space with one page",
              type: "Space",
              isContainer: false,
              children: [
                {
                  id: "page2-0",
                  label: "Page 2-0",
                  type: "Page",
                  isContainer: true
                }
              ]
            }
          ];

        // Act
        return this.oBookmarkService.getContentNodes().then(function (aContentNodes) {
            // Assert
            assert.deepEqual(aContentNodes, oExpectedContentNodes, "The right content nodes were returned in spaces mode");
            assert.strictEqual(this.oGetSpacesPagesHierarchyStub.callCount, 1, "Get SpacesPagesHierarchy was called exactly once");
        }.bind(this));
    });

    QUnit.test("Returns the correct contentNodes if in classic home page", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var oExpectedContentNodes = [
            {
                id: "group_0",
                label: "Group 0",
                type: "HomepageGroup",
                isContainer: true
            },
            {
                id: "group_1",
                label: "Group 1",
                type: "HomepageGroup",
                isContainer: true
            }
        ];

        // Act
        return this.oBookmarkService.getContentNodes().then(function (aContentNodes) {

            // Assert
            assert.deepEqual(aContentNodes, oExpectedContentNodes, "The right content nodes were returned in spaces mode");
            assert.strictEqual(this.oGetGroupsStub.callCount, 1, "Get SpacesPagesHierarchy was called exactly once");
        }.bind(this));
    });

    QUnit.module("The function 'addBookmarkToHomepageGroup'", {
        beforeEach: function () {
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oTileMock = {
                title: "Tile 1",
                tileType: "sap.ushell.ui.tile.StaticTile",
                id: "tile1"
            };
            this.oAddBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oTileMock).promise());
            this.oAddCustomBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oTileMock).promise());

            this.oLaunchPageServiceStub = {
               addBookmark: this.oAddBookmarkStub,
               addCustomBookmark: this.oAddCustomBookmarkStub
            };

            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("LaunchPage").returns(this.oLaunchPageServiceStub),
                getServiceAsync: sandbox.stub()
            };

            this.oBookmarkService = new Bookmark();

            this.oPublishStub = sandbox.stub();

            this.oGetCoreStub = sandbox.stub(sap.ui.getCore(), "getEventBus").callsFake(function () {
                return {
                    publish: this.oPublishStub
                };
            }.bind(this));
        },

        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects if in launchpad spaces mode", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);
        var sExpectedError = "Bookmark Service: The API is not available in spaces mode.";

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup().catch(function (oReturn) {
            assert.strictEqual(oReturn, sExpectedError, "The function resolved with the right error");
        });
    });

    QUnit.test("Calls addBookmark on the LaunchPage service and fires the bookmarkTileAdded event", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        var oBookmark = {
            title: "Bookmark Tile",
            url: "https://sap.com"
        };

        var oGroup = {
            id: "group1",
            title: "Group 1"
        };

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup).then(function () {
            assert.deepEqual(this.oAddBookmarkStub.firstCall.args, [oBookmark, oGroup], "'addBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
            assert.deepEqual(this.oPublishStub.firstCall.args, ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }], "'bookmarkTileAdded' event is called with the correct data.");
        }.bind(this));
    });

    QUnit.test("Rejects the promise if 'addBookmark' fails.", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);
        this.oAddBookmarkStub.returns(new jQuery.Deferred().reject("Error message").promise());

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup().catch(function (sError) {
            assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "'addBookmark' of the Launchpage service is called once.");
            assert.strictEqual(this.oPublishStub.callCount, 0, "'bookmarkTileAdded' event is not fired if 'addBookmark' failed.");
            assert.strictEqual(sError, "Error message", "The error message is passed into the rejected promise.");
        }.bind(this));
    });

    QUnit.test("Calls addCustomBookmark on the LaunchPage service and fires the bookmarkTileAdded event if bCustom is true", function (assert) {
        // Arrange
        var oBookmark = {
            title: "Bookmark Tile",
            url: "https://sap.com"
        };

        var oGroup = {
            id: "group1",
            title: "Group 1"
        };

        // Act
        return this.oBookmarkService.addBookmarkToHomepageGroup(oBookmark, oGroup, true).then(function () {
            assert.deepEqual(this.oAddCustomBookmarkStub.firstCall.args, [oBookmark, oGroup], "'addBookmark' of the Launchpage service is called with the correct bookmark parameters & group.");
            assert.deepEqual(this.oPublishStub.firstCall.args, ["sap.ushell.services.Bookmark", "bookmarkTileAdded", { tile: this.oTileMock, group: oGroup }], "'bookmarkTileAdded' event is called with the correct data.");
        }.bind(this));
    });

    QUnit.module("The function countBookmarks", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                countBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                countBookmarks: sandbox.stub()
            };
            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("LaunchPage").returns(this.oLaunchPageServiceStub),
                getServiceAsync: sandbox.stub().withArgs("Pages").returns(Promise.resolve(this.oPagesServiceStub))
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();

        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that resolves to the number of bookmarks", function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.resolve(3));

        // Act
        var oCountDeferred = this.oBookmarkService.countBookmarks("http://www.sap.com");

        //Assert
        oCountDeferred
            .done(function (iCount) {
                assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
                assert.strictEqual(iCount, 3, "The deferred resolves to the correct value.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.countBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.reject("error"));

        // Act
        var oCountDeferred = this.oBookmarkService.countBookmarks("http://www.sap.com");

        //Assert
        oCountDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.countBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", function (assert) {
        //Arrange
        this.oConfigStub.returns(false);
        var oDeferredStub = { then: "function" };
        this.oLaunchPageServiceStub.countBookmarks.withArgs("http://www.sap.com").returns(oDeferredStub);

        // Act
        var oCountDeferred = this.oBookmarkService.countBookmarks("http://www.sap.com");

        //Assert
        assert.strictEqual(this.oLaunchPageServiceStub.countBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.deepEqual(oCountDeferred, oDeferredStub, "The Deferred from the Launchpage service is returned");
    });

    QUnit.module("The function deleteBookmarks", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                deleteBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                deleteBookmarks: sandbox.stub()
            };
            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("LaunchPage").returns(this.oLaunchPageServiceStub),
                getServiceAsync: sandbox.stub().withArgs("Pages").returns(Promise.resolve(this.oPagesServiceStub))
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that resolves to the number of bookmarks", function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.resolve(3));

        // Act
        var oDeleteDeferred = this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        //Assert
        oDeleteDeferred
            .done(function (iCount) {
                assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
                assert.strictEqual(iCount, 3, "The deferred resolves to the correct value.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.deleteBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.reject("error"));

        // Act
        var oDeleteDeferred = this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        //Assert
        oDeleteDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.deleteBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", function (assert) {
        //Arrange
        this.oConfigStub.returns(false);
        var oDeferred = jQuery.Deferred().resolve();
        var oPromise = oDeferred.promise();
        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").returns(oPromise);

        // Act
        var oDeleteDeferred = this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        //Assert
        assert.strictEqual(this.oLaunchPageServiceStub.deleteBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.deepEqual(oDeleteDeferred, oPromise, "The Deferred from the Launchpage service is returned");
    });

    QUnit.test("Publishes the bookmarkTileDeleted event in classic homepage mode", function (assert) {
        //Arrange
        this.oConfigStub.returns(false);
        var oDeferred = jQuery.Deferred();
        oDeferred.resolve();
        var oPromise = oDeferred.promise();
        this.oLaunchPageServiceStub.deleteBookmarks.withArgs("http://www.sap.com").returns(oPromise);
        var oPublishStub;
        var oPublishPromise = new Promise(function (resolve) {
            oPublishStub = sandbox.stub(sap.ui.getCore().getEventBus(), "publish").callsFake(resolve);
        });
        var oExpectedEventParameters = [
            "sap.ushell.services.Bookmark",
            "bookmarkTileDeleted",
            "http://www.sap.com"
        ];

        // Act
        this.oBookmarkService.deleteBookmarks("http://www.sap.com");

        //Assert
        return oPublishPromise.
            then(function () {
                assert.deepEqual(oPublishStub.args[0], oExpectedEventParameters, "The event is published with the correct parameters.");
            });
    });

    QUnit.module("The function updateBookmarks", {
        beforeEach: function () {
            this.oPagesServiceStub = {
                updateBookmarks: sandbox.stub()
            };
            this.oLaunchPageServiceStub = {
                updateBookmarks: sandbox.stub()
            };
            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("LaunchPage").returns(this.oLaunchPageServiceStub),
                getServiceAsync: sandbox.stub().withArgs("Pages").resolves(this.oPagesServiceStub)
            };
            this.oConfigStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");
            this.oConfigStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred", function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.resolve());

        // Act
        var oUpdateDeferred = this.oBookmarkService.updateBookmarks("http://www.sap.com");

        //Assert
        oUpdateDeferred
            .done(function (iCount) {
                assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise is not rejected.");
            })
            .always(assert.async());
    });

    QUnit.test("Calls the Pages service in spaces mode and returns a Deferred that rejects in case of an error", function (assert) {
        //Arrange
        this.oPagesServiceStub.updateBookmarks.withArgs({ url: "http://www.sap.com" }).returns(Promise.reject("error"));

        // Act
        var oUpdateDeferred = this.oBookmarkService.updateBookmarks("http://www.sap.com");

        //Assert
        oUpdateDeferred
            .done(function () {
                assert.ok(false, "The promise is not resolved.");
            })
            .fail(function (sError) {
                assert.deepEqual(this.oPagesServiceStub.updateBookmarks.args[0][0], { url: "http://www.sap.com" }, "The URL is passed to the Pages service.");
                assert.strictEqual(sError, "error", "The deferred rejects with the error.");
            }.bind(this))
            .always(assert.async());
    });

    QUnit.test("Calls the Launchpage service in classic homepage mode and passes the return value through", function (assert) {
        //Arrange
        this.oConfigStub.returns(false);
        var oDeferred = jQuery.Deferred().resolve();
        var oPromise = oDeferred.promise();
        this.oLaunchPageServiceStub.updateBookmarks.withArgs("http://www.sap.com").returns(oPromise);

        // Act
        var oUpdateDeferred = this.oBookmarkService.updateBookmarks("http://www.sap.com");

        //Assert
        assert.strictEqual(this.oLaunchPageServiceStub.updateBookmarks.args[0][0], "http://www.sap.com", "The URL is passed to the Launchpage service.");
        assert.deepEqual(oUpdateDeferred, oPromise, "The Deferred from the Launchpage service is returned");
    });

    QUnit.module("countCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oCountCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                countCustomBookmarks: this.oCountCustomBookmarksStub
            });
            this.oCountBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                countBookmarks: this.oCountBookmarksPagesStub
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oCountCustomBookmarksStub.callCount, 1, "countCustomBookmarks was called once");
                assert.deepEqual(this.oCountCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock], "countCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oCountBookmarksPagesStub.callCount, 1, "countCustomBookmarks was called exactly once");
                assert.deepEqual(this.oCountBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock], "countCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if no parameters are supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks()
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the URL is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks({ vizType: "newstile" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the vizType is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.countCustomBookmarks({ url: "#Action-toappnavsample" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.module("deleteCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oDeleteCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                deleteCustomBookmarks: this.oDeleteCustomBookmarksStub
            });
            this.oDeleteBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                deleteBookmarks: this.oDeleteBookmarksPagesStub
            });

            this.oPublishStub = sandbox.stub();
            this.oGetCoreStub = sandbox.stub(sap.ui.getCore(), "getEventBus").callsFake(function () {
                return {
                    publish: this.oPublishStub
                };
            }.bind(this));

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oDeleteCustomBookmarksStub.callCount, 1, "deleteCustomBookmarks was called once");
                assert.deepEqual(this.oDeleteCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock], "deleteCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Publishes 'bookmarkTileDeleted' event on the event bus after a successful bookmark update", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.deepEqual(this.oPublishStub.firstCall.args, ["sap.ushell.services.Bookmark", "bookmarkTileDeleted", "someUrl"], "The event 'bookmarkTileDeleted' was published on channel 'sap.ushell.services.Bookmark' with the bookmark URL.");
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks(this.oIdentifierMock)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oDeleteBookmarksPagesStub.callCount, 1, "deleteCustomBookmarks was called exactly once");
                assert.deepEqual(this.oDeleteBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock], "deleteCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if no parameters are supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks()
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the URL is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks({ vizType: "newstile" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Rejects if the vizType is not supplied", function (assert) {
        // Act
        return this.oBookmarkService.deleteCustomBookmarks({ url: "#Action-toappnavsample" })
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.module("updateCustomBookmarks", {
        beforeEach: function () {
            this.oIdentifierMock = {
                url: "someUrl",
                vizType: "someVizType",
                chipId: "someChipId"
            };

            this.oGetServiceStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSpacesEnabledStub = sandbox.stub(Config, "last").withArgs("/core/spaces/enabled");

            this.oUpdateCustomBookmarksStub = sandbox.stub().resolves();
            this.oGetServiceStub.withArgs("LaunchPage").returns({
                updateCustomBookmarks: this.oUpdateCustomBookmarksStub
            });
            this.oUpdateBookmarksPagesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Pages").resolves({
                updateBookmarks: this.oUpdateBookmarksPagesStub
            });

            this.oSpacesEnabledStub.returns(true);
            this.oBookmarkService = new Bookmark();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls LaunchPage Service if spaces is disabled", function (assert) {
        // Arrange
        this.oSpacesEnabledStub.returns(false);

        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            },
            loadManifest: true
        };

        var oExpectedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                },
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: false
                }
            }
        };

        // Act
        return this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmarkConfig)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oUpdateCustomBookmarksStub.callCount, 1, "updateCustomBookmarks was called once");
                assert.deepEqual(this.oUpdateCustomBookmarksStub.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Calls Pages Service if spaces is enabled", function (assert) {
        // Arrange
        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            },
            loadManifest: true
        };

        var oExpectedConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                },
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: false
                }
            }
        };

        //Act
        return this.oBookmarkService.updateCustomBookmarks(this.oIdentifierMock, oBookmarkConfig)
            .then(function () {
                // Assert
                assert.ok(true, "promise was resolved");
                assert.strictEqual(this.oUpdateBookmarksPagesStub.callCount, 1, "updateCustomBookmarks was called exactly once");
                assert.deepEqual(this.oUpdateBookmarksPagesStub.getCall(0).args, [this.oIdentifierMock, oExpectedConfig], "updateCustomBookmarks was called with correct parameters");
            }.bind(this));
    });

    QUnit.test("Rejects if mandatory parameters are not supplied", function (assert) {
        // Arrange
        var oBookmarkConfig = {
            title: "Bookmark",
            subtitle: "Launch app",
            url: "https://sap.com",
            vizConfig: {
                "sap.app": {
                    title: "Bookmark"
                }
            },
            chipConfig: {
                chipId: "chip1"
            },
            loadManifest: true
        };

        // Act
        return this.oBookmarkService.updateCustomBookmarks({}, oBookmarkConfig)
            .then(function () {
                // Assert
                assert.ok(false, "promise was resolved");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
            });
    });

});
