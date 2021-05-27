// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._VisualizationInstantiation.VizInstanceLaunchPage
 */

QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceLaunchPage",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance"
], function (
    VizInstanceLaunchPage,
    VizInstance
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.start();
    var sandbox = sinon.createSandbox();

    QUnit.module("The constructor");

    QUnit.test("Stores the visualization data", function (assert) {
        // Arrange
        var oTestVizData = {
            title: "The title"
        };

        // Act
        var oVizInstance = new VizInstanceLaunchPage(oTestVizData);

        // Assert
        assert.ok(typeof oVizInstance, VizInstance, "The data was correctly saved to the instance");

        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the _oContent property to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceLaunchPage();

        // Assert
        var oTile = oVizInstance._oContent;
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");

        var oStateBindingInfo = oTile.getBindingInfo("state");
        assert.strictEqual(oStateBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oStateBindingInfo.parts[0].path, "state", "The correct path has been found.");

        var oFrameTypeBindingInfo = oTile.getBindingInfo("frameType");
        assert.strictEqual(typeof oFrameTypeBindingInfo.formatter, "function", "There was a formatter set.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[0].path, "displayFormat", "The correct path has been found.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[1].path, "tileSize", "The correct path has been found.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The load function", {
        beforeEach: function () {
            this.oLaunchpageTile = {
                launchPageTile: {
                    id: "launchPageTile"
                }
            };
            this.oVizData = {
                title: "The Title",
                subtitle: "The Subtitle",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncher"
                        }
                    },
                    launchPageTile: this.oGetInstantiationDataStub
                }
            };
            this.oVizInstance = new VizInstanceLaunchPage(this.oVizData);
            this.oGetInstantiationDataStub = sandbox.stub(this.oVizInstance, "getInstantiationData");
            this.oGetInstantiationDataStub.returns(this.oLaunchpageTile);
            this.oSetContentStub = sandbox.stub(this.oVizInstance, "_setContent");
            this.oSetSizeStub = sandbox.stub(this.oVizInstance, "_setSize");
            this.oTileView = {
                id: "tileView"
            };
            this.oGetCatalogTileViewControlStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(this.oTileView));
            this.oGetTileViewStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(this.oTileView));
            this.oGetTileSizeStub = sandbox.stub().returns("2x2");
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("LaunchPage").resolves({
                getCatalogTileViewControl: this.oGetCatalogTileViewControlStub,
                getTileSize: this.oGetTileSizeStub,
                getTileView: this.oGetTileViewStub
            });
            sap.ushell = {Container: {}};
            sap.ushell.Container.getServiceAsync = this.oGetServiceAsyncStub;

        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("creates a VizInstanceLaunchPage tile successfully.", function (assert) {
        // Act
        return this.oVizInstance.load().then(function () {
            // Assert
            assert.strictEqual(this.oVizInstance.getTileSize(), "2x2", "The vizInstance's tile size was set correctly");
            assert.strictEqual(this.oSetSizeStub.callCount, 1, "The visualization size was set");

            assert.strictEqual(this.oSetContentStub.callCount, 1, "The visualization content was set");
            assert.strictEqual(this.oSetContentStub.getCall(0).args[0], this.oTileView, "The setContent of the visualization was called with the correct parameter.");

            assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

            assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
            assert.strictEqual(this.oGetCatalogTileViewControlStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getCatalogTileViewControl was called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("creates a VizInstanceLaunchPage group tile successfully when the catalog tile UI is not available", function (assert) {
        // Arrange
        this.oGetCatalogTileViewControlStub.callsFake(function () {
            throw new Error();
        });
        // Act
        return this.oVizInstance.load().then(function () {
            // Assert
            assert.strictEqual(this.oVizInstance.getTileSize(), "2x2", "The vizInstance's tile size was set correctly");
            assert.strictEqual(this.oSetSizeStub.callCount, 1, "The visualization size was set");

            assert.strictEqual(this.oSetContentStub.callCount, 1, "The visualization content was set");
            assert.strictEqual(this.oSetContentStub.getCall(0).args[0], this.oTileView, "The setContent of the visualization was called with the correct parameter.");

            assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

            assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
            assert.strictEqual(this.oGetCatalogTileViewControlStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getCatalogTileViewControl was called with the correct parameter.");

            assert.strictEqual(this.oGetTileViewStub.callCount, 1, "The getTileView was called once.");
            assert.strictEqual(this.oGetTileViewStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getTileView was called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("returns a rejected promise when the VizInstanceLaunchPage catalog tile instantiation was rejected", function (assert) {
        // Arrange
        this.oGetCatalogTileViewControlStub.returns((new jQuery.Deferred()).reject());

        // Act
        return this.oVizInstance.load()
            .then(function () {
                assert.ok(false, "A VizInstanceLaunchPage tile was accidentally created.");
            })
            .catch(function () {
                // Assert
                assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

                assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
                assert.strictEqual(this.oGetCatalogTileViewControlStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getCatalogTileViewControl was called with the correct parameter.");

                assert.strictEqual(this.oGetTileViewStub.callCount, 0, "The getTileView was not called once.");
            }.bind(this));
    });

    QUnit.test("returns a rejected promise when no VizInstanceLaunchPage catalog or group tile instantiation is available", function (assert) {
        // Arrange
        this.oGetCatalogTileViewControlStub.callsFake(function () {
            throw new Error();
        });
        this.oGetTileViewStub.returns((new jQuery.Deferred()).reject());

        // Act
        return this.oVizInstance.load()
            .then(function () {
                assert.ok(false, "A VizInstanceLaunchPage tile was accidentally created.");
            })
            .catch(function () {
                // Assert
                assert.strictEqual(this.oGetInstantiationDataStub.callCount, 1, "The getInstantiationData was called once.");

                assert.strictEqual(this.oGetCatalogTileViewControlStub.callCount, 1, "The getCatalogTileViewControl was called once.");
                assert.strictEqual(this.oGetCatalogTileViewControlStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getCatalogTileViewControl was called with the correct parameter.");

                assert.strictEqual(this.oGetTileViewStub.callCount, 1, "The getTileView was called once.");
                assert.strictEqual(this.oGetTileViewStub.getCall(0).args[0], this.oLaunchpageTile.launchPageTile, "The getTileView was called with the correct parameter.");
            }.bind(this));
    });
});
