// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/components/tiles/cdm/applauncherdynamic/DynamicTile.controller",
    "sap/ushell/components/tiles/cdm/applauncherdynamic/Component",
    "sap/ushell/utils/DynamicTileRequest",
    "sap/ushell/Config",
    "sap/base/Log",
    "sap/ushell/services/URLParsing"
], function (
    DynamicTileController,
    DynamicTileComponent,
    DynamicTileRequest,
    Config,
    Log,
    URLParsing
) {
    "use strict";

    /*global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("Component", {
        before: function (assert) {
            var oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: oGetServiceStub
            };
            oGetServiceStub.withArgs("URLParsing").returns(new URLParsing());

            this.oComponentData = {
                properties: {
                    displayFormat: "flat"
                }
            };
        },
        after: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Create DynamicTile Component Test", function (assert) {
        // Arrange
        var sComponentName = "DynamicTile";
        // Act
        var oComponent = new DynamicTileComponent({
            name: sComponentName,
            componentData: {
                properties: {},
                startupParameters: {}
            }
        });
        // Assert
        assert.ok(oComponent);
    });


    QUnit.test("Create DynamicTile Component Test with no componentData", function (assert) {
        // Arrange
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: {}
        });
        // Assert
        assert.ok(oComponent);
    });

    QUnit.test("Sets the correct frameType for displayFormat flat.", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = "flat";
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.oPromise.then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, "OneByHalf", "The frameType is correct");
        });
    });

    QUnit.test("Sets the correct frameType for displayFormat flatWide.", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = "flatWide";
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.oPromise.then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, "TwoByHalf", "The frameType is correct");
        });
    });

    QUnit.test("Sets the correct frameType for displayFormat standardWide.", function (assert) {
        // Arrange
        this.oComponentData.properties.displayFormat = "standardWide";
        // Act
        var oComponent = new DynamicTileComponent({
            componentData: this.oComponentData
        });
        // Assert
        return oComponent.oPromise.then(function (oView) {
            // Assert
            var sFrameType = oView.getModel().getProperty("/properties/frameType");
            assert.strictEqual(sFrameType, "TwoByOne", "The frameType is correct");
        });
    });

    QUnit.module("Controller: onInit", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oConfigDoStub = sandbox.stub();
            this.oConfigOnStub = sandbox.stub(Config, "on").returns({
                do: this.oConfigDoStub
            });
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(false);

            this.oErrorStub = sandbox.stub(Log, "error");

            this.oSystemContext = {label: "myLabel"};
            this.oGetSystemContextStub = sandbox.stub().resolves(this.oSystemContext);

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oController = new DynamicTileController();

            sandbox.stub(this.oController, "getView").returns({
                getViewData: sandbox.stub().returns({
                    properties: {},
                    configuration: {}
                }),
                setModel: sandbox.stub().callsFake(function (oModel) {
                    this.oModel = oModel;
                }.bind(this))
            });
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Correctly attaches to the sizeBehavior config", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.oConfigOnStub.getCall(0).args[0], "/core/home/sizeBehavior", "Attached to the correct config");
    });

    QUnit.test("Handles correctly sizeBehavior config change", function (assert) {
        // Arrange
        this.oController.onInit();
        this.oModel.setProperty("/properties/sizeBehavior", "Responsive");
        // Act
        this.oConfigDoStub.getCall(0).callArgWith(0, "Small");
        // Assert
        assert.strictEqual(this.oModel.getProperty("/properties/sizeBehavior"), "Small", "Updated the sizeBehavior in the model");
    });

    QUnit.test("Sets the correct contentProviderLabel", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(true);
        // Act
        this.oController.onInit();
        return this.oController.oSystemContextPromise.then(function () {
            // Assert
            var sContentProviderLabel = this.oModel.getProperty("/properties/contentProviderLabel");
            assert.strictEqual(sContentProviderLabel, "myLabel", "The contentProviderLabel is correct");
        }.bind(this));
    });

    QUnit.test("Does not set a contentProviderLabel if flag is set to false", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();
        // Assert
        var sContentProviderLabel = this.oModel.getProperty("/properties/contentProviderLabel");
        assert.strictEqual(sContentProviderLabel, undefined, "The contentProviderLabel was set to undefined");
    });

    QUnit.test("Logs an error if CSTR is not available", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(true);
        var oErrorMock = {message: "MyError"};
        this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").rejects(oErrorMock);
        // Act
        this.oController.onInit();
        return this.oController.oSystemContextPromise.then(function () {
            // Assert
            assert.strictEqual(this.oErrorStub.getCall(0).args[0], "DynamicTile.controller threw an error:", "error was called with the correct first parameter");
            assert.strictEqual(this.oErrorStub.getCall(0).args[1], oErrorMock, "error was called with the correct error");
        }.bind(this));
    });

    QUnit.test("Logs an error if getSystemContext rejects", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/contentProviders/providerInfo/show").returns(true);
        var oErrorMock = {message: "MyError"};
        this.oGetSystemContextStub.rejects(oErrorMock);
        // Act
        this.oController.onInit();
        return this.oController.oSystemContextPromise.then(function () {
            // Assert
            assert.strictEqual(this.oErrorStub.getCall(0).args[0], "DynamicTile.controller threw an error:", "Log.error was called with the correct first parameter");
            assert.strictEqual(this.oErrorStub.getCall(0).args[1], oErrorMock, "Log.error was called with the correct error");
        }.bind(this));
    });

    QUnit.module("Component: tileSetVisualProperties", {
        beforeEach: function () {
            var oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: oGetServiceStub
            };
            oGetServiceStub.withArgs("URLParsing").returns(new URLParsing());

            this.oComponentData = {
                properties: {
                    title: "dynamic_tile_1_title",
                    subtitle: "dynamic_tile_1_subtitle",
                    icon: "dynamic_tile_1_icon",
                    withMargin: "false",
                    targetURL: "dynamic_tile_1_URL",
                    info: "dynamic_tile_1_Info",
                    tilePersonalization: {}
                },
                startupParameters: {
                    "sap-system": ["dynamic_tile_1_system"]
                }
            };

            this.oComponent = new DynamicTileComponent({
                componentData: this.oComponentData
            });

            return this.oComponent.oPromise.then(function (oView) {
                this.oModel = oView.getModel();
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Sets the initial values correctly", function (assert) {
        // Arrange
        var oExpectedProperties = this.oComponentData.properties;
        var sSapSystem = this.oComponentData.startupParameters["sap-system"][0];
        // Act
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.title, oExpectedProperties.title, "title was correctly set");
        assert.strictEqual(oProperties.subtitle, oExpectedProperties.subtitle, "subtitle was correctly set");
        assert.strictEqual(oProperties.icon, oExpectedProperties.icon, "icon was correctly set");
        assert.strictEqual(oProperties.withMargin, oExpectedProperties.withMargin, "withMargin was correctly set");
        assert.strictEqual(oProperties.info, oExpectedProperties.info, "info was correctly set");
        assert.notEqual(oProperties.targetURL.indexOf(sSapSystem), -1, "targetURL contains sap-system");
    });

    QUnit.test("Updates visualProperties", function (assert) {
        // Arrange
        var oOriginalProperties = this.oComponentData.properties;
        var oNewProperties = {
            title: "newTitle"
        };
        // Act
        this.oComponent.tileSetVisualProperties(oNewProperties);
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.title, oNewProperties.title, "title was updated");
        assert.strictEqual(oProperties.subtitle, oOriginalProperties.subtitle, "subtitle was not updated");
        assert.strictEqual(oProperties.icon, oOriginalProperties.icon, "icon was not updated");
    });

    QUnit.test("Does not update non-visual properties", function (assert) {
        // Arrange
        var oNewProperties = {
            sizeBehavior: "Small",
            subtitle: "i am also changed",
            icon: "i am also changed",
            info: "i am also changed"
        };
        // Act
        this.oComponent.tileSetVisualProperties(oNewProperties);
        // Assert
        var oProperties = this.oModel.getProperty("/properties");
        assert.strictEqual(oProperties.sizeBehavior, "Responsive", "sizeBehavior was not updated");
        assert.strictEqual(oProperties.subtitle, oNewProperties.subtitle, "subtitle was updated");
        assert.strictEqual(oProperties.icon, oNewProperties.icon, "icon was updated");
        assert.strictEqual(oProperties.info, oNewProperties.info, "info was updated");
    });

    QUnit.module("Controller: loadData", {
        beforeEach: function () {
            this.oLogInfoStub = sandbox.stub(Log, "info");
            this.oLogErrorStub = sandbox.stub(Log, "error");
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();

            this.oController = new DynamicTileController();
            this.oSetTileIntoErrorStateStub = sandbox.stub(this.oController, "_setTileIntoErrorState");
            this.oLoadDataSpy = sandbox.spy(this.oController, "loadData");

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });

            this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("someUrl");

            this.oRefreshStub = sandbox.stub();
            this.oDestroyStub = sandbox.stub();

            this.oController.oDataRequest = {
                refresh: this.oRefreshStub,
                destroy: this.oDestroyStub,
                sUrl: "someUrl",
                abort: sandbox.stub()
            };
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Logs an info and sets the timer if the serviceRefreshInterval is bigger 0", function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        var aExpectedMessage = [
            "Wait 1 seconds before calling someUrl again",
            null,
            "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile"
        ];
        // Act
        this.oController.loadData(1);
        // Assert
        assert.deepEqual(this.oLogInfoStub.getCall(0).args, aExpectedMessage, "info was called with the right parameters");
        assert.notEqual(this.oController.timer, null, "The timer was set on a value"); //we can't test the exact value here as it is time dependent

        sandbox.clock.tick(1001);
        assert.strictEqual(this.oLoadDataSpy.callCount, 2, "'loadData' did call itself after one second");
    });

    QUnit.test("Does not create a request when no url was provided", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        var sExpectedMessage = "No service URL given!";
        this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("");
        // Act
        this.oController.loadData(0);
        // Assert
        assert.strictEqual(this.oController.oDataRequest, null, "The request was not created");
        assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "logged the correct error");
        assert.strictEqual(this.oSetTileIntoErrorStateStub.callCount, 1, "The tile was set into error state");
    });

    QUnit.test("Creates a new request when no requests exists", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        // Act
        this.oController.loadData();
        // Assert
        assert.ok(this.oController.oDataRequest instanceof DynamicTileRequest, "The request was created");
    });

    QUnit.test("Creates a new request when url changed", function (assert) {
        // Arrange
        var oOldRequest = this.oController.oDataRequest;
        oOldRequest.sUrl = "someOldUrl";
        // Act
        this.oController.loadData();
        // Assert
        assert.strictEqual(this.oDestroyStub.callCount, 1, "The old request was destroyed");
        assert.ok(this.oController.oDataRequest instanceof DynamicTileRequest, "The request was created");
    });

    QUnit.test("Calls refresh on an existing request", function (assert) {
        // Arrange
        // Act
        this.oController.loadData();
        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The request was refreshed");
    });

    QUnit.module("Component: tileSetVisible", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {}
            });

            return this.oComponent.oPromise.then(function (oView) {
                var oController = oView.getController();
                this.oStopRequestsSpy = sandbox.spy(oController, "stopRequests");
                this.oInitUpdateDynamicDataStub = sandbox.stub(oController, "initUpdateDynamicData");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Stops requests when the tile is invisible", function (assert) {
        // Arrange
        // Act
        this.oComponent.tileSetVisible(false);
        // Assert
        assert.strictEqual(this.oStopRequestsSpy.callCount, 1, "stopRequests was called once");
    });

    QUnit.test("Refreshes requests when the tile is invisible", function (assert) {
        // Arrange
        // Act
        this.oComponent.tileSetVisible(true);
        // Assert
        assert.strictEqual(this.oInitUpdateDynamicDataStub.callCount, 1, "refreshHandler was called once");
        assert.strictEqual(this.oStopRequestsSpy.callCount, 0, "stopRequests was not called");
    });


    QUnit.module("Component: tileRefresh", {
        beforeEach: function () {
            this.oComponent = new DynamicTileComponent({
                componentData: {}
            });

            return this.oComponent.oPromise.then(function (oView) {
                var oController = oView.getController();
                this.oLoadDataStub = sandbox.stub(oController, "loadData");
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
        }
    });

    QUnit.test("Calls refresh handler", function (assert) {
            // Arrange
            // Act
            this.oComponent.tileRefresh();
            // Assert
            assert.strictEqual(this.oLoadDataStub.callCount, 1, "loadData was called once");
    });

    QUnit.module("Controller: initUpdateDynamicData", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });

            this.oLoadDataStub = sandbox.stub(this.oController, "loadData");
            this.oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("someUrl");
            this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(0);
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Calls loadData correctly when interval 0", function (assert) {
        // Arrange
        // Act
        this.oController.initUpdateDynamicData(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 0, "loadData was called with the correct interval");
    });

    QUnit.test("Calls loadData correctly when interval 5", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(5);
        // Act
        this.oController.initUpdateDynamicData(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 10, "loadData was called with the correct interval");
    });

    QUnit.test("Calls loadData correctly when interval 50", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/configuration/serviceRefreshInterval").returns(50);
        // Act
        this.oController.initUpdateDynamicData(this.oController);
        // Assert
        assert.strictEqual(this.oLoadDataStub.getCall(0).args[0], 50, "loadData was called with the correct interval");
    });

    QUnit.module("Controller: updatePropertiesHandler", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub,
                    refresh: sandbox.stub()
                })
            });
            this.oGetPropertyStub.withArgs("/properties").returns({});

            this.oNormalizeNumberStub = sandbox.stub(this.oController, "_normalizeNumber").returns({});
            this.oShouldProcessDigitsStub = sandbox.stub(this.oController, "_shouldProcessDigits");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Processes a number correctly", function (assert) {
        // Arrange
        var oProperties = {
            number: "12345",
            numberDigits: "2",
            numberFactor: "3"
        };
        var aExpectedNormalizeArgs = ["12345", 5, "3", "2"];
        var aExpectedProcessArgs = ["12345", "2"];
        // Act
        this.oController.updatePropertiesHandler(oProperties);
        // Assert
        assert.deepEqual(this.oNormalizeNumberStub.getCall(0).args, aExpectedNormalizeArgs, "_normalizeNumber was called with correct args");
        assert.deepEqual(this.oShouldProcessDigitsStub.getCall(0).args, aExpectedProcessArgs, "_shouldProcessDigits was called with correct args");
    });

    QUnit.module("Controller: _normalizeNumber", {
        beforeEach: function () {
            this.oController = new DynamicTileController();
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result when number is: 'NaN'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("Not_a_Number", 5);
        // Assert
        assert.strictEqual(oResult.displayNumber, "Not_a", "Returned correct displayNumber");
    });

    QUnit.test("Returns correct result when number is: '1000000 > number > 999", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("123456", 5);
        // Assert
        assert.strictEqual(oResult.displayNumber, "123.4", "Returned correct displayNumber");
        assert.strictEqual(oResult.numberFactor, "K", "Returned correct numberFactor");
    });

    QUnit.test("Returns the correct result when number is: '1000000000 > number > 999999'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("1234567", 5);
        // Assert
        assert.strictEqual(oResult.displayNumber, "1.234", "Returned correct displayNumber");
        assert.strictEqual(oResult.numberFactor, "M", "Returned correct numberFactor");
    });

    QUnit.test("Returns the correct result when number is: '10000000000 > number > 999999999'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("1234567890", 5);
        // Assert
        assert.strictEqual(oResult.displayNumber, "1.234", "Returned correct displayNumber");
        assert.strictEqual(oResult.numberFactor, "B", "Returned correct numberFactor");
    });

    QUnit.test("Returns the correct result when the Number Factor is predifined", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("123", 5, "TEST");
        // Assert
        assert.strictEqual(oResult.numberFactor, "TEST", "Returned correct numberFactor");
    });

    QUnit.test("Returns the correct result when last character is '.'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oController._normalizeNumber("12.34", 3);
        // Assert
        assert.strictEqual(oResult.displayNumber, "12", "Returned correct displayNumber");
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

            this.oComponent = new DynamicTileComponent({
                componentData: {
                    isCreated: true,
                    properties: {},
                    startupParameters: {}
                }
            });

            return this.oComponent.oPromise.then(function (oTileView) {
                this.oView = oTileView;
            }.bind(this));
        },
        afterEach: function () {
            this.oComponent.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Sets the right additionalTooltip", function (assert) {
        // Arrange
        var oGenericTile = this.oView.getContent()[0];
        var sBindingPath = oGenericTile.getBindingPath("additionalTooltip");

        // Assert
        assert.strictEqual(sBindingPath, "/properties/contentProviderLabel", "There is the correct binding path");
    });

    QUnit.module("Controller: stopRequests", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oAbortStub = sandbox.stub();
            this.oController.oDataRequest = {
                abort: this.oAbortStub,
                destroy: sandbox.stub()
            };
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Aborts the running request", function (assert) {
        // Arrange
        // Act
        this.oController.stopRequests();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
    });

    QUnit.module("Controller: onExit", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oDestroyStub = sandbox.stub();
            this.oAbortStub = sandbox.stub();
            this.oController.oDataRequest = {
                abort: this.oAbortStub,
                destroy: this.oDestroyStub
            };

            this.oOffStub = sandbox.stub();
            this.oController._aDoableObject = {
                off: this.oOffStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts and destroys the data request", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
        assert.strictEqual(this.oDestroyStub.callCount, 1, "destroy was called once");
    });

    QUnit.test("Detaches doables", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "off was called once");
    });

    QUnit.module("Component: createContent", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: sandbox.stub().withArgs("URLParsing").returns(new URLParsing())
            };
            this.oProperties = {
                targetURL: "dynamic_tile_1_URL",
                indicatorDataSource: {
                    refresh: 0,
                    path: ""
                }
            };
            this.oComponentData = {
                properties: this.oProperties
            };
            this.oData = {
                componentData: this.oComponentData
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Handles serviceUrl correctly when legacy", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "/sap/opu/Service1/somePath";
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1/"
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        //Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1", "SYS2"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.equal(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath", "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system and missing '/'", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1", "SYS2"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1;o=SYS1/somePath", "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and empty array of sap-system", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "somePath";
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": []
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service1/somePath", "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system but no indicatorDataSource", function (assert) {
        // Arrange
        delete this.oProperties.indicatorDataSource;
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, undefined, "configured the correct url");
        });
    });

    QUnit.test("Handles serviceUrl correctly when it contains dataSource and sap-system but absolut path of indicatorDataSource", function (assert) {
        // Arrange
        this.oProperties.indicatorDataSource.path = "/sap/opu/Service2/somePath";
        this.oProperties.dataSource ={
            uri: "/sap/opu/Service1/"
        };
        this.oComponentData.startupParameters = {
            "sap-system": ["SYS1"]
        };
        this.oComponent = new DynamicTileComponent(this.oData);

        // Act
        return this.oComponent.oPromise.then(function (oTileView) {
            // Assert
            var sServiceUrl = oTileView.getModel().getProperty("/configuration/serviceUrl");
            assert.strictEqual(sServiceUrl, "/sap/opu/Service2/somePath", "configured the correct url");
        });
    });
});
