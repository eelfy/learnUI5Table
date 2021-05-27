// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for bookmark functionality of sap.ushell.adapters.cdm.LaunchPageAdapter.js
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/v3/LaunchPageAdapter",
    "sap/ushell/services/URLParsing"
], function (
    LaunchPageAdapter,
    URLParsing
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("addCustomBookmark", {
        beforeEach: function () {
            this.oSiteMock = {
                groups: {
                    someGroup: {
                        payload: {
                            tiles: []
                        },
                        identification: {
                            id: "someGroup"
                        }
                    }
                }
            };

            this.oGetServiceStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oAdapter = new LaunchPageAdapter(undefined, undefined, { config: {} });
            this.oResolveTileByVizIdStub = sandbox.stub(this.oAdapter, "_resolveTileByVizId");
            this.oSaveStub = sinon.stub();

            var oCdmService = {
                getSite: sinon.stub().returns(new jQuery.Deferred().resolve(this.oSiteMock).promise()),
                save: this.oSaveStub.returns(new jQuery.Deferred().resolve().promise())
            };
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(oCdmService);

            var oUrlParsingService = new URLParsing();
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(oUrlParsingService);
        },
        afterEach: function () {
            sandbox.restore();
            delete this.oAdapter;
            delete sap.ushell.Container;
        }
    });

    QUnit.test("resolves the tile and adds it to the site when the target is an intent", function (assert) {
        // Arrange
        var oBookmarkConfig = {
                vizType: "someVizType",
                title: "someTitle",
                subTitle: "someSubtitle",
                icon: "someIcon",
                info: "someInfo",
                serviceUrl: "someServiceUrl",
                serviceRefreshInterval: "someServiceRefreshInterval",
                vizConfig: "someVizConfig",
                url: "#Some-Intent?withParams=true"
            },
            oTargetGroup = {
                identification: {
                    id: "someGroup"
                }
            },
            oExpectedTile = {
                id: "", // To be acquired from the generated tile
                vizType: oBookmarkConfig.vizType,
                title: oBookmarkConfig.title,
                subTitle: oBookmarkConfig.subtitle,
                icon: oBookmarkConfig.icon,
                info: oBookmarkConfig.info,
                target: {
                    semanticObject: "Some",
                    action: "Intent",
                    parameters: [{
                        name: "withParams",
                        value: "true"
                    }]
                },
                indicatorDataSource: {
                    path: oBookmarkConfig.serviceUrl,
                    refresh: oBookmarkConfig.serviceRefreshInterval
                },
                vizConfig: oBookmarkConfig.vizConfig,
                isBookmark: true,
                isLink: false
            };

        this.oResolveTileByVizIdStub
            .callsFake(function (oTile, oSite) {
                oExpectedTile.id = oTile.id;
                return new jQuery.Deferred().resolve(oTile).promise();
            });

        // Act
        return this.oAdapter.addCustomBookmark(oBookmarkConfig, oTargetGroup)
            .then(function (oResult) {
                // Assert
                assert.deepEqual(oResult, oExpectedTile, "The expected tile object was returned");
                assert.deepEqual(this.oAdapter._mResolvedTiles[oExpectedTile.id], oExpectedTile, "The tile was added to the internal tile storage");
                assert.deepEqual(this.oSiteMock.groups.someGroup.payload.tiles[0], oExpectedTile, "The tile was added to the site");
                assert.strictEqual(this.oSaveStub.callCount, 1, "CommonDataModel.save was called");
            }.bind(this));
    });

    QUnit.test("resolves the tile and adds it to the site when the target is a URL", function (assert) {
        // Arrange
        var oBookmarkConfig = {
                vizType: "someVizType",
                title: "someTitle",
                subTitle: "someSubtitle",
                icon: "someIcon",
                info: "someInfo",
                serviceUrl: "someServiceUrl",
                serviceRefreshInterval: "someServiceRefreshInterval",
                vizConfig: "someVizConfig",
                url: "www.sap.com?someParameter=true"
            },
            oTargetGroup = {
                identification: {
                    id: "someGroup"
                }
            },
            oExpectedTile = {
                id: "", // To be acquired from the generated tile
                vizType: oBookmarkConfig.vizType,
                title: oBookmarkConfig.title,
                subTitle: oBookmarkConfig.subtitle,
                icon: oBookmarkConfig.icon,
                info: oBookmarkConfig.info,
                target: {
                    url: "www.sap.com?someParameter=true"
                },
                indicatorDataSource: {
                    path: oBookmarkConfig.serviceUrl,
                    refresh: oBookmarkConfig.serviceRefreshInterval
                },
                vizConfig: oBookmarkConfig.vizConfig,
                isBookmark: true,
                isLink: false
            };

        this.oResolveTileByVizIdStub
            .callsFake(function (oTile, oSite) {
                oExpectedTile.id = oTile.id;
                return new jQuery.Deferred().resolve(oTile).promise();
            });

        // Act
        return this.oAdapter.addCustomBookmark(oBookmarkConfig, oTargetGroup)
            .then(function (oResult) {
                // Assert
                assert.deepEqual(oResult, oExpectedTile, "The expected tile object was returned");
                assert.deepEqual(this.oAdapter._mResolvedTiles[oExpectedTile.id], oExpectedTile, "The tile was added to the internal tile storage");
                assert.deepEqual(this.oSiteMock.groups.someGroup.payload.tiles[0], oExpectedTile, "The tile was added to the site");
                assert.strictEqual(this.oSaveStub.callCount, 1, "CommonDataModel.save was called");
            }.bind(this));
    });

    QUnit.test("resolves the tile and adds it to the site's default group when no target group is provided", function (assert) {
        // Arrange
        var oBookmarkConfig = {
                vizType: "someVizType",
                title: "someTitle",
                subTitle: "someSubtitle",
                icon: "someIcon",
                info: "someInfo",
                serviceUrl: "someServiceUrl",
                serviceRefreshInterval: "someServiceRefreshInterval",
                vizConfig: "someVizConfig",
                url: "#Some-Intent?withParams=true"
            },
            oExpectedTile = {
                id: "", // To be acquired from the generated tile
                vizType: oBookmarkConfig.vizType,
                title: oBookmarkConfig.title,
                subTitle: oBookmarkConfig.subtitle,
                icon: oBookmarkConfig.icon,
                info: oBookmarkConfig.info,
                target: {
                    semanticObject: "Some",
                    action: "Intent",
                    parameters: [{
                        name: "withParams",
                        value: "true"
                    }]
                },
                indicatorDataSource: {
                    path: oBookmarkConfig.serviceUrl,
                    refresh: oBookmarkConfig.serviceRefreshInterval
                },
                vizConfig: oBookmarkConfig.vizConfig,
                isBookmark: true,
                isLink: false
            },
            oGetDefaultGroupStub = sandbox.stub(this.oAdapter, "getDefaultGroup");

        oGetDefaultGroupStub.returns(new jQuery.Deferred().resolve(this.oSiteMock.groups.someGroup));

        this.oResolveTileByVizIdStub
            .callsFake(function (oTile, oSite) {
                oExpectedTile.id = oTile.id;
                return new jQuery.Deferred().resolve(oTile).promise();
            });

        // Act
        return this.oAdapter.addCustomBookmark(oBookmarkConfig)
            .then(function (oResult) {
                // Assert
                assert.deepEqual(oResult, oExpectedTile, "The expected tile object was returned");
                assert.deepEqual(this.oAdapter._mResolvedTiles[oExpectedTile.id], oExpectedTile, "The tile was added to the internal tile storage");
                assert.deepEqual(this.oSiteMock.groups.someGroup.payload.tiles[0], oExpectedTile, "The tile was added to the site");
                assert.strictEqual(this.oSaveStub.callCount, 1, "CommonDataModel.save was called once");
                assert.strictEqual(oGetDefaultGroupStub.callCount, 1, "getDefaultGroup was called once");
            }.bind(this));
    });

    QUnit.module("countCustomBookmarks", {
        beforeEach: function () {
            this.oLPA = new LaunchPageAdapter(undefined, undefined, { config: {} });

            this.oVisitBookmarksStub = sandbox.stub(this.oLPA, "_visitBookmarks").returns(new jQuery.Deferred().resolve().promise());
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects promise if vizType was not provided", function (assert) {
        //Act
        return this.oLPA.countCustomBookmarks({ url: "#Action-toAppNavSample" })
            .then(function () {
                //Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sErrorMessage) {
                //Assert
                assert.strictEqual(sErrorMessage, "countCustomBookmarks: Required parameter is missing: oIdentifier.vizType", "The promise was rejected with the correct error message.");
            });
    });

    QUnit.test("Calls '_visitBookmarks' with the right parameters", function (assert) {
        //Act
        return this.oLPA.countCustomBookmarks({ url: "#Action-toAppNavSample", vizType: "CustomVizType" }).then(function () {
            //Assert
            assert.deepEqual(this.oVisitBookmarksStub.firstCall.args, ["#Action-toAppNavSample", undefined, "CustomVizType"], "_visitBookmarks was called with the right bookmark URL & viz type.");
        }.bind(this));
    });

    QUnit.module("deleteCustomBookmarks", {
        beforeEach: function () {
            this.oLPA = new LaunchPageAdapter(undefined, undefined, { config: {} });
            this.oDeleteBookmarksStub = sandbox.stub(this.oLPA, "deleteBookmarks").returns(new jQuery.Deferred().resolve().promise());
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects promise if vizType was not provided", function (assert) {
        //Act
        return this.oLPA.deleteCustomBookmarks({ url: "#Action-toAppNavSample" })
            .then(function () {
                //Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sErrorMessage) {
                //Assert
                assert.strictEqual(sErrorMessage, "deleteCustomBookmarks: Required parameter is missing: oIdentifier.vizType", "The promise was rejected with the correct error message.");
            });
    });

    QUnit.test("Calls 'deleteBookmarks' with the right parameters", function (assert) {
        // Arrange
        var oIdentifier = {
            url: "#Action-toAppNavSample",
            vizType: "CustomVizType"
        };

        //Act
        return this.oLPA.deleteCustomBookmarks(oIdentifier).then(function () {
            //Assert
            assert.deepEqual(this.oDeleteBookmarksStub.firstCall.args, ["#Action-toAppNavSample", "CustomVizType"], "deleteBookmarks was called with the right bookmark URL & viz type.");
        }.bind(this));
    });

    QUnit.module("updateCustomBookmarks", {
        beforeEach: function () {
            this.oLPA = new LaunchPageAdapter(undefined, undefined, { config: {} });
            this.oUpdateBookmarksStub = sandbox.stub(this.oLPA, "updateBookmarks").returns(new jQuery.Deferred().resolve().promise());
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects promise if vizType was not provided", function (assert) {
        //Act
        return this.oLPA.updateCustomBookmarks({ url: "#Action-toAppNavSample" })
            .then(function () {
                //Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sErrorMessage) {
                //Assert
                assert.strictEqual(sErrorMessage, "updateCustomBookmarks: Required parameter is missing: oIdentifier.vizType", "The promise was rejected with the correct error message.");
            });
    });

    QUnit.test("Rejects promise if bookmark title is an empty string", function (assert) {
        //Act
        return this.oLPA.updateCustomBookmarks({ url: "#Action-toAppNavSample", vizType: "CustomVizType" }, { title: "", url: "#New-hash"})
            .then(function () {
                //Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sErrorMessage) {
                //Assert
                assert.strictEqual(sErrorMessage, "updateCustomBookmarks: The bookmark title cannot be an empty string", "The promise was rejected with the correct error message.");
            });
    });

    QUnit.test("Rejects promise if bookmark url is an empty string", function (assert) {
        //Act
        return this.oLPA.updateCustomBookmarks({ url: "#Action-toAppNavSample", vizType: "CustomVizType" }, { title: "New Bookmark Title", url: ""})
            .then(function () {
                //Assert
                assert.ok(false, "Promise was resolved");
            })
            .catch(function (sErrorMessage) {
                //Assert
                assert.strictEqual(sErrorMessage, "updateCustomBookmarks: The bookmark url cannot be an empty string", "The promise was rejected with the correct error message.");
            });
    });

    QUnit.test("Calls 'updateBookmarks' with the right parameters", function (assert) {
        // Arrange
        var oIdentifier = {
            url: "#Action-toAppNavSample",
            vizType: "CustomVizType"
        };

        var oConfig = {
            url: "#Action-toUpdatedHash"
        };

        //Act
        return this.oLPA.updateCustomBookmarks(oIdentifier, oConfig).then(function () {
            //Assert
            assert.deepEqual(this.oUpdateBookmarksStub.firstCall.args, ["#Action-toAppNavSample", oConfig, "CustomVizType"], "updateBookmarks was called with the right bookmark URL & viz type.");
        }.bind(this));
    });
});