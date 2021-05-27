// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._VisualizationInstantiation.VizInstanceCdm
 */

QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceCdm",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ui/core/Component",
    "sap/base/util/ObjectPath"
], function (
    VizInstanceCdm,
    VizInstance,
    Component,
    ObjectPath
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
        var oVizInstance = new VizInstanceCdm(oTestVizData);

        // Assert
        assert.ok(typeof oVizInstance, VizInstance, "The data was correctly saved to the instance");

        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the _oContent property to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceCdm();

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
            this.oVizData = {
                active: true,
                title: "The Title",
                subtitle: "The Subtitle",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "sap.ushell.components.tiles.cdm.applauncher"
                        }
                    }
                }
            };
            this.oVizInstance = new VizInstanceCdm(this.oVizData);
            this.oSetContentStub = sandbox.stub(this.oVizInstance, "_setContent");
            this.oSetComponentTileVisibleStub = sandbox.stub(this.oVizInstance, "_setComponentTileVisible");

            this.oSetParentStub = sandbox.spy(Component.prototype, "setParent");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Creates the tile component and sets the properties", function (assert) {
        // Act
        return this.oVizInstance.load(false)
            .then(function () {
                // Assert
                var oComponentContainer = this.oSetContentStub.firstCall.args[0];
                var sComponentContainerName = oComponentContainer.getMetadata().getName();
                var oComponent = oComponentContainer.getComponentInstance();
                var sComponentName = oComponent.getMetadata().getName();
                assert.strictEqual(sComponentContainerName, "sap.ui.core.ComponentContainer", "The tile componentContainer was created");
                assert.strictEqual(sComponentName, "sap.ushell.components.tiles.cdm.applauncher.Component", "The tile component was created");

                assert.strictEqual(this.oSetParentStub.getCall(0).args[0], this.oVizInstance, "the correct parent was set");

                assert.strictEqual(this.oVizInstance.getTitle(), this.oVizData.title, "The title property was correctly set");
                assert.strictEqual(this.oVizInstance.getSubtitle(), this.oVizData.subtitle, "The subtitle property was correctly set");
                assert.deepEqual(this.oSetComponentTileVisibleStub.getCall(0).args, [true], "_setComponentTileVisible was called with correct parameters");

                oComponent.destroy();
            }.bind(this));
    });

    QUnit.test("Rejects and sets the VizInstance to an error state if the component creation fails", function (assert) {
        // Arrange
        var oExpectedError = { error: "error" };
        var oComponentCreateStub = sandbox.stub(Component, "create");
        oComponentCreateStub.rejects(oExpectedError);

        // Act
        return this.oVizInstance.load()
            .catch(function (oError) {
                // Assert
                assert.deepEqual(oError, oExpectedError, "The error object was returned");
                assert.strictEqual(this.oVizInstance.getState(), "Failed", "The state was set to failed");
            }.bind(this));
    });

    QUnit.module("The _getComponentConfiguration function", {
        beforeEach: function () {
            this.oVizData = {
                title: "The Tile",
                subtitle: "The subtitle",
                icon: "The icon",
                info: "The info",
                numberUnit: "EUR",
                indicatorDataSource: { testPath: "path/$count" },
                dataSource: { uri: "/test/"},
                contentProviderId: "The content provider id",
                targetURL: "Target URL",
                anotherProperty: "Another property",
                instantiationData: {
                    vizType: {
                        "sap.ui5": {
                            componentName: "visualization.component.name"
                        },
                        "sap.flp": {
                            tileSize: "1x1"
                        }
                    }
                }
            };

            this.oVizInstance = new VizInstanceCdm(this.oVizData);
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the basic component configuration", function (assert) {
        //Arrange
        var oExpectedComponentConfiguration = {
            name: "visualization.component.name",
            componentData: {
                properties: {
                    title: "The Tile",
                    subtitle: "The subtitle",
                    icon: "The icon",
                    info: "The info",
                    numberUnit: "EUR",
                    indicatorDataSource: { testPath: "path/$count" },
                    dataSource: { uri: "/test/"},
                    contentProviderId: "The content provider id",
                    targetURL: "Target URL",
                    displayFormat: "standard"
                }
            },
            url: undefined,
            manifest: undefined,
            asyncHints: undefined
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration, oExpectedComponentConfiguration, "The basic component configuration was created correctly");

    });

    QUnit.test("Sets the alternative component URL", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "url"], "/component/url", this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.url, "/component/url", "The component url was taken over");
    });

    QUnit.test("Sets the alternative component manifest", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "manifest"], "/manifest/url", this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, "/manifest/url", "The component url was taken over");
    });

    QUnit.test("Uses the vizType as manifest if includeManifest is specified", function (assert) {
        //Arrange
        ObjectPath.set(["instantiationData", "vizType", "sap.platform.runtime", "includeManifest"], true, this.oVizData);

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, this.oVizData.instantiationData.vizType, "The vizType was taken over as component manifest.");
    });

    QUnit.test("Merges the vizConfig with the vizType if includeManifest is specified", function (assert) {
        //Arrange
        var oVizConfig = {
            "sap.platform.runtime": {
                includeManifest: true
            },
            "sap.flp": {
                tileSize: "1x2"
            }
        };
        this.oVizInstance.setVizConfig(oVizConfig);
        ObjectPath.set([ "instantiationData", "vizType", "sap.platform.runtime", "includeManifest" ], true, this.oVizData);

        var oExpectedManifest = {
            "sap.flp": {
                tileSize: "1x2"
            },
            "sap.platform.runtime": {
                includeManifest: true
            },
            "sap.ui5": {
                componentName: "visualization.component.name"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.manifest, oExpectedManifest, "The correct merged manifest was returned.");
    });

    QUnit.test("Merges the provided componentProperties with the default componentProperties", function (assert) {
        //Arrange
        var oComponentProperties = {
            special: "variable",
            manifest: true
        };
        ObjectPath.set([ "instantiationData", "vizType", "sap.platform.runtime", "componentProperties" ], oComponentProperties, this.oVizData);

        var oExpectedComponentData = {
            properties: {
                contentProviderId: "The content provider id",
                icon: "The icon",
                indicatorDataSource: { testPath: "path/$count" },
                dataSource: {
                    uri: "/test/"
                },
                info: "The info",
                numberUnit: "EUR",
                special: "variable",
                subtitle: "The subtitle",
                targetURL: "Target URL",
                title: "The Tile",
                manifest: true,
                displayFormat: "standard"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.componentData, oExpectedComponentData, "The correct merged componentData was returned.");
    });

    QUnit.test("Replaces manifest=true with the manifest object when the manifest is provided as an object", function (assert) {
        //Arrange
        var oComponentProperties = {
            special: "variable",
            manifest: true
        };
        ObjectPath.set([ "instantiationData", "vizType", "sap.platform.runtime", "componentProperties" ], oComponentProperties, this.oVizData);
        ObjectPath.set([ "instantiationData", "vizType", "sap.platform.runtime", "includeManifest" ], true, this.oVizData);

        var oExpectedComponentData = {
            properties: {
                contentProviderId: "The content provider id",
                icon: "The icon",
                indicatorDataSource: { testPath: "path/$count"},
                dataSource: {
                    uri: "/test/"
                },
                info: "The info",
                numberUnit: "EUR",
                special: "variable",
                subtitle: "The subtitle",
                targetURL: "Target URL",
                title: "The Tile",
                manifest: {
                    "sap.flp": {
                        tileSize: "1x1"
                    },
                    "sap.platform.runtime": {
                        componentProperties: {
                            manifest: true,
                            special: "variable"
                        },
                        includeManifest: true
                    },
                    "sap.ui5": {
                        componentName: "visualization.component.name"
                    }
                },
                displayFormat: "standard"
            }
        };

        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.componentData, oExpectedComponentData, "The correct merged componentData was returned.");
    });

    QUnit.test("Adds asyncHints to the componentConfiguration", function (assert) {
        //Arrange
        var oAsyncHints = {
            components: [],
            libs: [{
                lazy: false,
                name: "sap.cloudfnd.smartbusiness.lib.reusetiles",
                url: {
                    final: true,
                    url: "/some/other/url/~0000~/"
                }
            }]
        };
        ObjectPath.set([ "instantiationData", "vizType", "sap.platform.runtime", "componentProperties", "asyncHints" ], oAsyncHints, this.oVizData);

        var oExpectedAsyncHints = {
            components: [],
            libs: [{
                lazy: false,
                name: "sap.cloudfnd.smartbusiness.lib.reusetiles",
                url: {
                    final: true,
                    url: "/some/other/url/~0000~/"
                }
            }]
        };
        //Act
        var oComponentConfiguration = this.oVizInstance._getComponentConfiguration(this.oVizData);

        //Assert
        assert.deepEqual(oComponentConfiguration.asyncHints, oExpectedAsyncHints, "The correct asyncHints array was returned.");
    });

    QUnit.module("The method _setComponentTileVisible", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oTileSetVisibleStub = sandbox.stub();
            this.oVizInstance._oComponent = {
                tileSetVisible: this.oTileSetVisibleStub
            };
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls tileSetVisible of the component", function (assert) {
        // Arrange
        // Act
        this.oVizInstance._setComponentTileVisible(true);
        // Assert
        assert.deepEqual(this.oTileSetVisibleStub.getCall(0).args, [true], "tileSetVisible waa called with correct parameters");
    });

    QUnit.module("The method setActive", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
            this.oRefreshStub = sandbox.stub(VizInstanceCdm.prototype, "refresh");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("correctly sets the active state on the content", function (assert) {
        // Arrange
        var oTileSetVisibleStub = sinon.stub();
        this.oVizInstance._oComponent = {
            tileSetVisible: oTileSetVisibleStub
        };
        // Act
        this.oVizInstance.setActive(true, true);
        assert.strictEqual(oTileSetVisibleStub.callCount, 1, "was called exactly once");
        assert.strictEqual(oTileSetVisibleStub.getCall(0).args[0], true, "was called with correct param");
        assert.strictEqual(this.oRefreshStub.callCount, 1, "refresh was called exactly once");
    });

    QUnit.module("The method refresh", {
        beforeEach: function () {
            this.oVizInstance = new VizInstanceCdm();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("correctly sets the refresh state on the content", function (assert) {
        // Arrange
        var oTileRefreshStub = sinon.stub();
        this.oVizInstance._oComponent = {
            tileRefresh: oTileRefreshStub
        };
        // Act
        this.oVizInstance.refresh();
        assert.strictEqual(oTileRefreshStub.callCount, 1, "was called exactly once");
    });
});
