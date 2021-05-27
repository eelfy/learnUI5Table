// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/components/tiles/cdm/applauncher/Component",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/base/Log",
    "sap/m/library",
    "sap/ushell/components/tiles/cdm/applauncher/StaticTile.controller",
    "sap/ushell/services/Container",
    "sap/ushell/resources"
], function (
    AppLauncherComponent,
    AppLifeCycle,
    Config,
    Log,
    mobileLibrary,
    Controller
) {
    "use strict";

    /*global QUnit sinon */
    var sandbox = sinon.createSandbox({});

    var GenericTileMode = mobileLibrary.GenericTileMode;

    var appIntStub;
    QUnit.module("sap.ushell.components.tiles.cdm.applauncher.Component", {
        beforeEach: function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").then(function () {
                appIntStub = sinon.stub(AppLifeCycle.getElementsModel(), "getModel").returns({
                    getProperty: function (property) {
                        if (property === "/sizeBehavior") {
                            return "Responsive";
                        }
                        return "";
                    }
                });
                done();
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
            appIntStub.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Create StaticTile Component Test", function (assert) {
        this.oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        assert.ok(this.oComponent.getComponentData().isCreated, "Component should be created with component data as specified");
        return this.oComponent.getRootControl().loaded();
    });


    QUnit.test("Component API tileSetVisualProperties : Static properties Test", function (assert) {

        var done = assert.async();

        var oComponentDataProperties = {
            title: "static_tile_1_title",
            subtitle: "static_tile_1_subtitle",
            icon: "static_tile_1_icon",
            targetURL: "#static_tile_1_URL",
            info: "static_tile_1_info",
            displayFormat: "compact",
            tilePersonalization: {}
        };

        var oComponentDataStartupParams = {
            "sap-system": ["static_tile_1_system"]
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties,
                startupParameters: oComponentDataStartupParams
            }
        });



        // check properties on tile's model
        this.oComponent.getRootControl().loaded().then(function (oTileView) {
            var oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oComponentDataProperties.title, "component data title and tile view title");
            assert.strictEqual(oProperties.subtitle, oComponentDataProperties.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oComponentDataProperties.icon, "component data icon and tile view icon");
            assert.strictEqual(oProperties.info, oComponentDataProperties.info, "component data info and tile view info");
            assert.strictEqual(oProperties.mode, GenericTileMode.LineMode, "the mode was set to line mode");

            // check URL contains sap-system
            // TODO: press handler tests are missing!
            assert.ok(oTileView.getController()._createTargetUrl().indexOf(oComponentDataStartupParams["sap-system"][0]) !== -1, "tile targetURL should contain sap-system from component startup parameters");

            var oNewVisualProperties_1 = {
                title: "title had changed",
                info: "info had changed"
            };
            this.oComponent.tileSetVisualProperties(oNewVisualProperties_1);
            oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oNewVisualProperties_1.title, "component data title and tile view title must have been changed by new visual property");
            assert.strictEqual(oProperties.info, oNewVisualProperties_1.info, "component data info and tile view info must have been changed by new visual property");
            assert.strictEqual(oProperties.subtitle, oComponentDataProperties.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oComponentDataProperties.icon, "component data icon and tile view icon");

            var oNewVisualProperties_2 = {
                subtitle: "i am also changed",
                icon: "i am also changed",
                info: "'i am also changed"
            };
            this.oComponent.tileSetVisualProperties(oNewVisualProperties_2);
            oProperties = oTileView.getController()._getCurrentProperties();
            assert.strictEqual(oProperties.title, oNewVisualProperties_1.title, "component data title and tile view title not changed by new visual property");
            assert.strictEqual(oProperties.info, oNewVisualProperties_2.info, "component data info and tile view info");
            assert.strictEqual(oProperties.subtitle, oNewVisualProperties_2.subtitle, "component data subtitle and tile view subtitle");
            assert.strictEqual(oProperties.icon, oNewVisualProperties_2.icon, "component data icon and tile view icon");

            done();
        }.bind(this));
    });

    QUnit.test("Tile property sizeBehavior test", function (assert) {
        var done = assert.async();
        this.oComponent = new AppLauncherComponent({
            componentData: {
                isCreated: true,
                properties: {},
                startupParameters: {}
            }
        });
        // check properties on tile's model
        this.oComponent.getRootControl().loaded().then(function (oTileView) {
            var sSizeBehaviorStart;
            var sNewSizeBehavior;
            var oTileModel = oTileView.getModel();

            if (Config.last("/core/home/sizeBehavior") === "Responsive") {
                sSizeBehaviorStart = "Responsive";
                sNewSizeBehavior = "Small";
            } else {
                sSizeBehaviorStart = "Small";
                sNewSizeBehavior = "Responsive";
            }
            // Check if default is set
            assert.strictEqual(oTileModel.getProperty("/properties/sizeBehavior"), sSizeBehaviorStart, "Size correctly set at startup.");
            // emit new configuration
            Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);
            // check if size property has changed
            Config.once("/core/home/sizeBehavior").do(function () {
                assert.strictEqual(oTileModel.getProperty("/properties/sizeBehavior"), sNewSizeBehavior, "Size correctly set after change.");
                done();
            });
        });
    });

    QUnit.module("GenericTile properties", {
        beforeEach: function () {
            this.oSystemContext = {};

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oSystemContext);

            this.oGetServiceAsyncStub = sandbox.stub().withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oComponent = new AppLauncherComponent({
                componentData: {
                    isCreated: true,
                    properties: {},
                    startupParameters: {}
                }
            });

            return this.oComponent.getRootControl().loaded().then(function (oTileView) {
                this.oGenericTile = oTileView.getContent()[0];
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Sets the right additionalTooltip", function (assert) {
        // Arrange
        var sBindingPath = this.oGenericTile.getBindingPath("additionalTooltip");

        // Assert
        assert.strictEqual(sBindingPath, "/properties/contentProviderLabel", "There is the correct binding path");
    });

    QUnit.test("Sets the right url path", function (assert) {
        // Arrange
        var oBindingInfo = this.oGenericTile.getBindingInfo("url");

        // Assert
        assert.strictEqual(oBindingInfo.binding.getPath(), "/properties/targetURL", "There is the correct binding path");
        assert.ok(oBindingInfo.formatter, "There is a formatter set");
    });

    QUnit.module("OnInit", {
        beforeEach: function () {
            this.oLogStub = sandbox.stub(Log, "error");

            this.oSystemContext = {label: "myLabel"};

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(true);

            this.oGetSystemContextPromise = Promise.resolve(this.oSystemContext);

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.returns(this.oGetSystemContextPromise);

            this.oGetServiceAsyncStub = sandbox.stub().withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oComponent = new AppLauncherComponent({
                componentData: {
                    isCreated: true,
                    properties: {},
                    startupParameters: {}
                }
            });
        },
        afterEach: function () {
            this.oComponent.destroy();
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Sets the correct contentProviderLabel", function (assert) {
        // Arrange

        // Act
        return this.oComponent.getRootControl().loaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sContentProviderLabel = oTileView.getModel().getProperty("/properties/contentProviderLabel");
                // Assert
                assert.strictEqual(sContentProviderLabel, "myLabel", "The contentProviderLabel is correct");
            });

        }.bind(this));
    });

    QUnit.test("Does not set a contentProviderLabel if flag is set to false", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(false);

        // Act
        return this.oComponent.getRootControl().loaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sContentProviderLabel = oTileView.getModel().getProperty("/properties/contentProviderLabel");
                // Assert
                assert.strictEqual(sContentProviderLabel, undefined, "The contentProviderLabel was set to undefined");
            });

        }.bind(this));
    });

    QUnit.test("Logs an error if CSTR is not available", function (assert) {
        var done = assert.async();
        // Arrange
        this.oErrorMock = {message: "MyError"};
        var oGetServicePromise = Promise.reject(this.oErrorMock);
        this.oGetServiceAsyncStub.returns(oGetServicePromise);

        // Act
        this.oComponent.getRootControl().loaded().then(function () {
            setTimeout(function () {
                // Assert
                assert.strictEqual(this.oLogStub.callCount, 1, "Log.error was called exactly once");
                assert.strictEqual(this.oLogStub.getCall(0).args[0], "StaticTile.controller threw an error:", "Log.error was called with the correct first parameter");
                assert.strictEqual(this.oLogStub.getCall(0).args[1], this.oErrorMock, "Log.error was called with the correct error");
                done();
            }.bind(this), 0);
        }.bind(this));
    });

    QUnit.test("Logs an error if getSystemContext rejects", function (assert) {
        var done = assert.async();
        // Arrange
        this.oErrorMock = {message: "MyError"};
        var oGetSystemContextPromise = Promise.reject(this.oErrorMock);
        this.oGetSystemContextStub.returns(oGetSystemContextPromise);

        // Act
        this.oComponent.getRootControl().loaded().then(function () {
            setTimeout(function () {
                // Assert
                assert.strictEqual(this.oLogStub.callCount, 1, "Log.error was called exactly once");
                assert.strictEqual(this.oLogStub.getCall(0).args[0], "StaticTile.controller threw an error:", "Log.error was called with the correct first parameter");
                assert.strictEqual(this.oLogStub.getCall(0).args[1], this.oErrorMock, "Log.error was called with the correct error");
                done();
            }.bind(this), 0);
        }.bind(this));
    });

    QUnit.test("Sets the correct frameType for displayFormat flat.", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "flat"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.getRootControl().loaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "OneByHalf", "The contentProviderLabel is correct");
            });

        }.bind(this));
    });

    QUnit.test("Sets the correct frameType for displayFormat flatWide.", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "flatWide"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.getRootControl().loaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "TwoByHalf", "The contentProviderLabel is correct");
            });

        }.bind(this));
    });

    QUnit.test("Sets the correct frameType for displayFormat standardWide.", function (assert) {
        // Arrange
        var oComponentDataProperties = {
            displayFormat: "standardWide"
        };

        this.oComponent = new AppLauncherComponent({
            componentData: {
                properties: oComponentDataProperties
            }
        });

        // Act
        return this.oComponent.getRootControl().loaded().then(function (oTileView) {
            return this.oGetSystemContextPromise.then(function () {
                var sFrameType = oTileView.getModel().getProperty("/properties/frameType");
                // Assert
                assert.strictEqual(sFrameType, "TwoByOne", "The contentProviderLabel is correct");
            });

        }.bind(this));
    });
});