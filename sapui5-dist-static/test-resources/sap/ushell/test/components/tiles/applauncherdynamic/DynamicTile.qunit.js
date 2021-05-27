// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/components/tiles/applauncherdynamic/DynamicTile.controller",
    "sap/ushell/Config",
    "sap/base/Log",
    "sap/ushell/services/URLParsing",
    "sap/ushell/utils/DynamicTileRequest",
    "sap/ushell/components/tiles/utilsRT"
], function (
    DynamicTileController,
    Config,
    Log,
    URLParsing,
    DynamicTileRequest,
    utilsRT
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("onInit", {
        beforeEach: function () {
            sap.ushell.Container = {
                addRemoteSystemForServiceUrl: sandbox.stub()
            };
            this.oSubscribeStub = sandbox.stub(sap.ui.getCore().getEventBus(), "subscribe");
            sandbox.stub(utilsRT, "getConfiguration").returns({});

            this.oConfigDoStub = sandbox.stub();
            this.oConfigOnStub = sandbox.stub(Config, "on").returns({
                do: this.oConfigDoStub
            });

            this.oController = new DynamicTileController();
            this.oClearRequestStub = sandbox.stub(this.oController, "_clearRequest");
            sandbox.stub(this.oController, "getView").returns({
                getViewData: sandbox.stub().returns({
                    chip: {
                        configurationUi: {
                            isEnabled: sandbox.stub()
                        },
                        url: {
                            getApplicationSystem: sandbox.stub()
                        }
                    }
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
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Correctly attaches to the sessionTimeout eventBus event", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.oSubscribeStub.getCall(0).args[0], "launchpad", "subscribe was called with correct channel");
        assert.strictEqual(this.oSubscribeStub.getCall(0).args[1], "sessionTimeout", "subscribe was called with correct event");
        assert.strictEqual(this.oSubscribeStub.getCall(0).args[2], this.oController._clearRequest, "subscribe was called with correct handler");
    });

    QUnit.test("Handles correctly sessionTimeout eventBus event", function (assert) {
        // Arrange
        this.oController.onInit();
        // Act
        this.oSubscribeStub.getCall(0).callArg(2);
        // Assert
        assert.strictEqual(this.oClearRequestStub.callCount, 1, "_clearRequests was called once");
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
        this.oModel.setProperty("/sizeBehavior", "Responsive");
        // Act
        this.oConfigDoStub.getCall(0).callArgWith(0, "Small");
        // Assert
        assert.strictEqual(this.oModel.getProperty("/sizeBehavior"), "Small", "Updated the sizeBehavior in the model");
    });

    QUnit.module("constructTargetUrlWithSapSystem", {
        beforeEach: function () {
            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oGetServiceStub.withArgs("URLParsing").returns(new URLParsing());
            this.oController = new DynamicTileController();
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("constructTargetUrlWithSapSystem, when sap-system parameter is given", function (assert) {
        // Arrange
        // Act
        var sResult = this.oController.constructTargetUrlWithSapSystem("test://url", "XYZ");

        // Assert
        assert.strictEqual(sResult, "test://url?sap-system=XYZ", "is called correct");
    });

    QUnit.test("constructTargetUrlWithSapSystem, when sap-system parameter is not given", function (assert) {
        // Arrange
        // Act
        var sResult = this.oController.constructTargetUrlWithSapSystem("test://url", undefined);

        //assert
        assert.strictEqual(sResult, "test://url", "is called correct");
    });

    QUnit.module("loadData", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();

            this.oController = new DynamicTileController();

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getViewData: sandbox.stub().returns({}),
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });

            this.oGetPropertyStub.withArgs("/config/service_url").returns("someUrl");

            this.oSetTileIntoErrorStateStub = sandbox.stub(this.oController, "_setTileIntoErrorState");

            this.oDestroyStub = sandbox.stub();
            this.oRefreshStub = sandbox.stub();
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

    QUnit.test("Calls errorHandler when no url was provided", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/config/service_url").returns("");
        var sExpectedMessage = "No service URL given!";
        // Act
        this.oController.loadData(0);
        //Assert
        assert.strictEqual(this.oSetTileIntoErrorStateStub.callCount, 1, "errorHandler was called once");
        assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "Logged the correct error");
        assert.strictEqual(this.oRefreshStub.callCount, 0, "The request was not refreshed");
    });

    QUnit.module("visibleHandler", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oStopRequestsStub = sandbox.stub(this.oController, "stopRequests");
            this.oRefreshTileStub = sandbox.stub(this.oController, "refreshTile");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Handles requests correctly when tile is invisible", function (assert) {
        // Arrange
        // Act
        this.oController.visibleHandler(false);
        // Assert
        assert.strictEqual(this.oStopRequestsStub.callCount, 1, "stopRequests was called once");
        assert.strictEqual(this.oRefreshTileStub.callCount, 0, "refreshTile was not called");
    });

    QUnit.test("Handles requests correctly when tile is visible", function (assert) {
        // Arrange
        // Act
        this.oController.visibleHandler(true);
        // Assert
        assert.strictEqual(this.oStopRequestsStub.callCount, 0, "stopRequests was not called");
        assert.strictEqual(this.oRefreshTileStub.callCount, 1, "refreshTile was called once");
    });

    QUnit.module("stopRequests", {
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

    QUnit.test("Calls abort when requests exists", function (assert) {
        // Arrange
        // Act
        this.oController.stopRequests();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
        assert.strictEqual(this.oController.bNeedsRefresh, true, "needRefresh flag was set correctly");
    });

    QUnit.test("Calls abort when requests does not exist", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        // Act
        this.oController.stopRequests();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 0, "abort was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, undefined, "needRefresh flag was not set");
    });

    QUnit.module("refreshHandler", {
        beforeEach: function () {
            this.oController = new DynamicTileController();
            this.oController.bNeedsRefresh = false;

            this.oRefreshTileStub = sandbox.stub(this.oController, "refreshTile");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("refresh handler test", function (assert) {
        // Arrange
        // Act
        this.oController.refreshHandler();
        // Assert
        assert.strictEqual(this.oRefreshTileStub.callCount, 1, "refreshTile() was called like expected");
        assert.strictEqual(this.oController.bNeedsRefresh, true, "refresh status flag is set correctly");
    });

    QUnit.module("refreshTile", {
        beforeEach: function () {
            this.oController = new DynamicTileController();
            this.oController.bNeedsRefresh = true;

            this.oIsVisibleStub = sandbox.stub().returns(true);
            sandbox.stub(this.oController, "getView").returns({
                getViewData: sandbox.stub().returns({
                    chip: {
                        visible: {
                            isVisible: this.oIsVisibleStub
                        }
                    }
                })
            });

            this.oLoadDataStub = sandbox.stub(this.oController, "loadData");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Loads data when tile is visible and refresh is needed", function (assert) {
        // Arrange
        // Act
        this.oController.refreshTile();
        // Assert
        assert.strictEqual(this.oLoadDataStub.callCount, 1, "loadData was called once");
        assert.strictEqual(this.oController.bNeedsRefresh, false, "refresh status flag is set correctly");
    });

    QUnit.test("Does not load data when tile is visible and refresh is not needed", function (assert) {
        // Arrange
        this.oController.bNeedsRefresh = false;
        // Act
        this.oController.refreshTile();
        // Assert
        assert.strictEqual(this.oLoadDataStub.callCount, 0, "loadData was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, false, "refresh status flag is set correctly");
    });

    QUnit.test("Does not load data when tile is invisible and refresh is needed", function (assert) {
        // Arrange
        this.oIsVisibleStub.returns(false);
        // Act
        this.oController.refreshTile();
        // Assert
        assert.strictEqual(this.oLoadDataStub.callCount, 0, "loadData was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, true, "refresh status flag is set correctly");
    });

    QUnit.module("successHandlerFn", {
        beforeEach: function () {
            this.oController = new DynamicTileController();

            this.oRefeshAfterIntervalStub = sandbox.stub(this.oController, "refeshAfterInterval");
            sandbox.stub(utilsRT, "getDataToDisplay");
            sandbox.stub(utilsRT, "addParamsToUrl");

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub,
                    setProperty: sandbox.stub()
                }),
                getViewData: sandbox.stub().returns({
                    chip: {
                        url: {
                            getApplicationSystem: sandbox.stub().returns("")
                        }
                    }
                })
            });

            this.oConfig = {};
            this.oGetPropertyStub.withArgs("/config").returns(this.oConfig);
            this.oGetPropertyStub.withArgs("/config/service_refresh_interval").returns(0);
            this.oGetPropertyStub.withArgs("/config/navigation_target_url").returns("someUrl");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Does not refresh when interval is 0", function (assert) {
        // Arrange
        // Act
        this.oController.successHandlerFn("", "");
        // Assert
        assert.strictEqual(this.oRefeshAfterIntervalStub.callCount, 0, "refreshAfterInterval was not called");
    });

    QUnit.test("Does refresh when interval is 5", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/config/service_refresh_interval").returns(5);
        // Act
        this.oController.successHandlerFn("", "");
        // Assert
        assert.strictEqual(this.oRefeshAfterIntervalStub.callCount, 1, "refreshAfterInterval was called once");
        assert.strictEqual(this.oRefeshAfterIntervalStub.getCall(0).args[0], 10, "requested interval is as expected");
    });

    QUnit.test("Does refresh when interval is 15", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/config/service_refresh_interval").returns(15);
        // Act
        this.oController.successHandlerFn("", "");
        // Assert
        assert.strictEqual(this.oRefeshAfterIntervalStub.callCount, 1, "refreshAfterInterval was called once");
        assert.strictEqual(this.oRefeshAfterIntervalStub.getCall(0).args[0], 15, "requested interval is as expected");
    });

    QUnit.module("errorHandlerFn", {
        beforeEach: function () {
            sandbox.stub(utilsRT, "getDataToDisplay");
            this.oInfoStub = sandbox.spy(Log, "info");
            this.oWarningStub = sandbox.spy(Log, "warning");
            this.oErrorStub = sandbox.spy(Log, "error");

            this.oController = new DynamicTileController();

            this.oGetPropertyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub,
                    setProperty: sandbox.stub()
                })
            });

            this.oGetPropertyStub.withArgs("/config").returns({});
            this.oGetPropertyStub.withArgs("/config/service_url").returns("someUrl");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Logs an abort response correctly", function (assert) {
        // Arrange
        var oMessage = { statusText: "Abort" };
        // Act
        this.oController.errorHandlerFn(oMessage, false);
        // Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Logged with level `info`");
    });

    QUnit.test("Logs a response correctly as warning", function (assert) {
        // Arrange
        var oMessage = { message: "something else" };
        // Act
        this.oController.errorHandlerFn(oMessage, true);
        // Assert
        assert.strictEqual(this.oWarningStub.callCount, 1, "Logged with level `warning`");
    });

    QUnit.test("Logs a response correctly as error", function (assert) {
        // Arrange
        var oMessage = { message: "something else" };
        // Act
        this.oController.errorHandlerFn(oMessage, false);
        // Assert
        assert.strictEqual(this.oErrorStub.callCount, 1, "Logged with level `error`");
    });

    QUnit.module("refeshAfterInterval", {
        beforeEach: function () {
            sandbox.useFakeTimers();
            this.oController = new DynamicTileController();
            this.oRefreshTileStub = sandbox.stub(this.oController, "refreshTile");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("no other interval is running", function (assert) {
        // Arrange
        this.oController.iNrOfTimerRunning = 0;

        // Act
        this.oController.refeshAfterInterval(1);

        // Assert
        assert.strictEqual(this.oRefreshTileStub.callCount, 0, "refreshTile was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, undefined, "refresh status flag was not changed");
        assert.ok(this.oController.timer, "timer was set");

        sandbox.clock.tick(1000);
        assert.strictEqual(this.oRefreshTileStub.callCount, 1, "refreshTile was called once");
        assert.strictEqual(this.oController.bNeedsRefresh, true, "refresh status flag was set");
    });

    QUnit.test("another interval is running", function (assert) {
        // Arrange
        this.oController.iNrOfTimerRunning = 1;

        // Act
        this.oController.refeshAfterInterval(1);

        // Assert
        assert.strictEqual(this.oRefreshTileStub.callCount, 0, "refreshTile was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, undefined, "refresh status flag was not changed");
        assert.ok(this.oController.timer, "timer was set");

        sandbox.clock.tick(1000);
        assert.strictEqual(this.oRefreshTileStub.callCount, 0, "refreshTile was not called");
        assert.strictEqual(this.oController.bNeedsRefresh, undefined, "refresh status flag was not changed");
    });

    QUnit.module("_clearRequest", {
        beforeEach: function () {
            this.oController = new DynamicTileController();
            this.oStopRequestsStub = sandbox.stub(this.oController, "stopRequests");
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Calls stopReuests", function (assert) {
        // Arrange
        // Act
        this.oController._clearRequest();
        // Assert
        assert.strictEqual(this.oStopRequestsStub.callCount, 1, "stopRequests was called once.");
    });

    QUnit.module("onExit", {
        beforeEach: function () {
            this.oUnsubscribeSpy = sandbox.spy(sap.ui.getCore().getEventBus(), "unsubscribe");
            this.oController = new DynamicTileController();

            this.oOffStub = sandbox.stub();
            this.oController._aDoableObject = {
                off: this.oOffStub
            };

            this.oClearRequestStub = sandbox.stub(this.oController, "_clearRequest");

            this.oDestroyStub = sandbox.stub();
            this.oController.oDataRequest = {
                destroy: this.oDestroyStub
            };
        },
        afterEach: function () {
            this.oController._aDoableObject = { off: sandbox.stub() };
            this.oController.onExit();
            sandbox.restore();
        }
    });

    QUnit.test("Calls _clearRequest and destroys the request", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oClearRequestStub.callCount, 1, "_clearRequest was called once");
        assert.strictEqual(this.oDestroyStub.callCount, 1, "destroy was called once");
    });

    QUnit.test("Does not call _clearRequest and destroys the request when no request exists", function (assert) {
        // Arrange
        delete this.oController.oDataRequest;
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oClearRequestStub.callCount, 0, "_clearRequest was not called");
        assert.strictEqual(this.oDestroyStub.callCount, 0, "destroy was not called");
    });

    QUnit.test("Unsubscribes from EventBus and detaches doables", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "off was called once");
        assert.strictEqual(this.oUnsubscribeSpy.getCall(0).args[0], "launchpad", "unsubscribe was called with correct channel");
        assert.strictEqual(this.oUnsubscribeSpy.getCall(0).args[1], "sessionTimeout", "unsubscribe was called with correct event");
        assert.strictEqual(this.oUnsubscribeSpy.getCall(0).args[2], this.oController._clearRequest, "unsubscribe was called with correct handler");
    });
});