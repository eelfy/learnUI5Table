// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/* global QUnit, sinon */

/**
 * @file QUnit tests for sap.ushell.components.pages.controller.PagesRuntime
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ui/core/library",
    "sap/ushell/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/pages/controller/PageRuntime.controller",
    "sap/ushell/resources",
    "sap/ushell/Config",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/m/GenericTile",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/ushell/components/pages/StateManager",
    "sap/base/util/ObjectPath",
    "sap/ushell/components/pages/ActionMode",
    "sap/ushell/EventHub",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance"
], function (
    coreLibrary,
    ushellLibrary,
    JSONModel,
    PagesRuntimeController,
    resources,
    Config,
    Page,
    Section,
    ShellHeadItem,
    GenericTile,
    MessageToast,
    VBox,
    oStateManager,
    ObjectPath,
    ActionMode,
    EventHub,
    VizInstance
) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.start();

    QUnit.module("The onInit function", {
        beforeEach: function () {
            this.oAttachMatchedStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetRouteStub = sandbox.stub().returns({
                attachMatched: this.oAttachMatchedStub
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub,
                getRenderer: function () {
                    return {
                        getRouter: function () {
                            return {
                                getRoute: this.oGetRouteStub
                            };
                        }.bind(this),
                        getShellConfig: sandbox.stub().returns({
                            rootIntent: "Shell-home"
                        })
                    };
                }.bind(this)
            };

            this.oGetModelStub = sandbox.stub();
            this.oPagesServiceStub = {
                getModel: this.oGetModelStub
            };
            this.oGetPagesServiceStub = sandbox.stub().resolves(this.oPagesServiceStub);
            this.oGetServiceAsyncStub.withArgs("VisualizationInstantiation").resolves("vizInstantiation");
            this.oStateManagerInitStub = sandbox.stub(oStateManager, "init");

            this.oController = new PagesRuntimeController();
            this.oOnPageComponentNavigationStub = sandbox.stub(this.oController, "_onPageComponentNavigation");
            this.oOpenFLPPageStub = sandbox.stub(this.oController, "_openFLPPage");
            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: this.oGetPagesServiceStub
                };
            }.bind(this);
            this.oSetPerformanceMarkStub = sandbox.stub(this.oController, "_setPerformanceMark");
            this.oAttachNavigateStub = sandbox.stub();
            this.oByIdStub = sandbox.stub();
            this.oNavContainer = {
                attachNavigate: this.oAttachNavigateStub
            };
            this.oByIdStub.withArgs("pagesRuntimeNavContainer").returns(this.oNavContainer);
            this.oByIdStub.withArgs("pagesNavContainer").returns(this.oNavContainer);
            this.oController.byId = this.oByIdStub;

            this.oSetModelStub = sandbox.stub();
            this.oController.getView = function () {
                return {
                    setModel: this.oSetModelStub
                };
            }.bind(this);

            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oEventHubDoStub = sandbox.stub();
            this.oEventHubOnceStub = sandbox.stub(EventHub, "once");
            this.oEventHubOnceStub.withArgs("PagesRuntimeRendered").returns({
                do: this.oEventHubDoStub
            });
            this.oCreateActionModeButtonStub = sandbox.stub(this.oController, "_createActionModeButton");

            this.oEventBusSubscribeStub = sandbox.stub(sap.ui.getCore().getEventBus(), "subscribe");

        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });

    QUnit.test("Gets VisualizationInstantiation service and URL parsing service asynchronously", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 2, "The method getServiceAsync is called 2 times");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["VisualizationInstantiation"], "The method getServiceAsync is called with 'VisualizationInstantiation'");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(1).args, ["URLParsing"], "The method getServiceAsync is called with 'URLParsing'");
    });

    QUnit.test("Sets the correct data in the view settings model during instantiation", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/home/sizeBehavior").returns("Responsive");
        this.oConfigLastStub.withArgs("/core/catalog/enableHideGroups").returns(true);
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        var oExpectedJSONModelData = {
            sizeBehavior: "Responsive",
            actionModeActive: false,
            showHideButton: true,
            showPageTitle: false,
            personalizationEnabled: true
        };

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.firstCall.args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
        assert.deepEqual(this.oSetModelStub.firstCall.args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
        assert.strictEqual(this.oSetModelStub.firstCall.args[1], "viewSettings", "The model is set to the view with name 'viewSettings'.");
    });

    QUnit.test("Updates the sizeBehavior property on the view settings model on configuration change", function (assert) {
        // Arrange
        var done = assert.async();
        Config.emit("/core/home/sizeBehavior", "NewSizeBehaviour");

        // Act
        this.oController.onInit();

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            assert.strictEqual(this.oController._oViewSettingsModel.getProperty("/sizeBehavior"), "NewSizeBehaviour", "");
            done();
        }.bind(this));
    });

    QUnit.test("Sets the correct data in the error page model during instantiation", function (assert) {
        // Arrange
        var oExpectedJSONModelData = {
            icon: "sap-icon://documents",
            text: "",
            description: "",
            details: ""
        };

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.getCall(1).args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
        assert.deepEqual(this.oSetModelStub.getCall(1).args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
        assert.strictEqual(this.oSetModelStub.getCall(1).args[1], "errorPage", "The model is set to the view with name 'errorPage'.");
    });

    QUnit.test("Retrieves a model from pages services and set the model for the page runtime controller", function (assert) {
        // Arrange
        var oModel = { id: "model1" };
        this.oGetModelStub.returns(oModel);

        // Act
        this.oController.onInit();

        // Assert
        return Promise.all([
            this.oController._oVisualizationInstantiationService,
            this.oGetPagesServiceStub
        ]).then(function () {
            assert.strictEqual(this.oGetModelStub.callCount, 1, "The method getModel is called once");
            assert.deepEqual(this.oSetModelStub.getCall(2).args[0], oModel, "The method setModel is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Attaches handlers to matched routes", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oAttachMatchedStub.callCount, 2, "The function attachMatched is called twice");
        assert.strictEqual(this.oGetRouteStub.getCall(0).args[0], "home", "The function attachMatched is called on the 'home' route");
        assert.strictEqual(this.oGetRouteStub.getCall(1).args[0], "openFLPPage", "The function attachMatched is called on the 'openFLPPage' route");
        assert.strictEqual(this.oAttachMatchedStub.getCall(0).args[0], this.oOnPageComponentNavigationStub, "The function attachMatched is called with correct parameters");
        assert.strictEqual(this.oAttachMatchedStub.getCall(1).args[0], this.oOnPageComponentNavigationStub, "The function attachMatched is called with correct parameters");
    });

    QUnit.test("Calls the 'init' method of StateManager", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oStateManagerInitStub.callCount, 1, "The method 'init' of StateManager is called once");
        assert.deepEqual(this.oStateManagerInitStub.getCall(0).args, [this.oNavContainer, this.oNavContainer], "The method 'init' of StateManager is called once");
    });

    QUnit.test("Calls _createActionModeButton if personalization is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);

        // Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0]();

        // Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton was called once");
    });

    QUnit.test("Does not call _createActionModeButton if personalization is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0]();

        // Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 0, "_createActionModeButton was not called");
    });

    QUnit.test("Performance mark are set when VizInstanceLoaded is emitted", function (assert) {
        // Arrange
        var fnDone = assert.async();
        EventHub.emit("VizInstanceLoaded", "some_id");

        // Act
        this.oController.onInit();

        // Assert
        //can not mock "on" because used also for Config
        setTimeout(function () {
            assert.ok(this.oSetPerformanceMarkStub.calledOnce, "_setPerformanceMarkStub should be called");
            assert.ok(!!this.oController.oVisualizationInstantiationListenerTimeout, "timeout should be set");
            fnDone();
        }.bind(this), 20);
    });

    QUnit.test("Adds listeners to launchpad docking events", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oEventBusSubscribeStub.callCount, 2, "The function subscribe is called twice.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[0], "launchpad", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[1], "shellFloatingContainerIsDocked", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[0], "launchpad", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[1], "shellFloatingContainerIsUnDocked", "The function subscribe is called with correct parameters.");
    });

    QUnit.module("The function _getPageAndSpaceId", {
        beforeEach: function () {
            this.oGetHashStub = sandbox.stub();
            this.oGetHashStub.returns("some-intent");
            window.hasher = {
                getHash: this.oGetHashStub
            };
            this.oController = new PagesRuntimeController();
            this.oParseShellHashStub = sandbox.stub();
            this.oController._oURLParsingService = Promise.resolve({
                parseShellHash: this.oParseShellHashStub
            });
            this.oParsePageAndSpaceIdStub = sandbox.stub(this.oController, "_parsePageAndSpaceId");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the pageId and spaceId returned by the URL Parsing service", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            semanticObject: "some",
            action: "intent",
            params: {
                pageId: ["page1"],
                spaceId: ["space1"]
            }
        });
        var oExpectedResult = [
            ["page1"],
            ["space1"],
            {
                semanticObject: "some",
                action: "intent"
            }
        ];

        // Act
        var oResult = this.oController._getPageAndSpaceId();

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, oExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the emtpy arrays when no pageId and spaceId are returned by the URL Parsing service", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({});
        var oExpectedResult = [
            [],
            [],
            {
                semanticObject: "",
                action: ""
            }
        ];

        // Act
        var oResult = this.oController._getPageAndSpaceId();

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, oExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Returns the returned value of the function _parsePageAndSpaceId", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({});
        this.oParsePageAndSpaceIdStub.returns({
            pageId: "page1",
            spaceId: "space1"
        });

        // Act
        return this.oController._getPageAndSpaceId().then(function (result) {
            // Assert
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(result, { pageId: "page1", spaceId: "space1" }, "The correct result is returned");
        }.bind(this));
    });

    QUnit.module("The function _getUserDefaultPage", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oGetSpacesPagesHierarchyStub = sandbox.stub();
            this.oMenuServiceStub = sandbox.stub().withArgs("Menu").returns(Promise.resolve({
                getSpacesPagesHierarchy: this.oGetSpacesPagesHierarchyStub
            }));
            sap.ushell.Container = {
                getServiceAsync: this.oMenuServiceStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns a rejected promise with an error message when there is no entry in the spaces pages hierarchy", function (assert) {
        // Arrange
        this.oGetSpacesPagesHierarchyStub.resolves({ spaces: [] });

        // Act
        return this.oController._getUserDefaultPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetSpacesPagesHierarchyStub.calledOnce, "The function getSpacesPagesHierarchy of the menu service is called once.");
            assert.strictEqual(error, "PageRuntime.NoAssignedSpace", "A rejected promise with the correct translated error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise with an error message when there's no page in any of the spaces.", function (assert) {
        // Arrange
        this.oGetSpacesPagesHierarchyStub.resolves({
            spaces: [{
                title: "First Space",
                id: "space1",
                pages: []
            }, {
                title: "Second Space",
                id: "space2",
                pages: []
            }]
        });

        // Act
        return this.oController._getUserDefaultPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetSpacesPagesHierarchyStub.calledOnce, "The function getSpacesPagesHierarchy of the menu service is called once.");
            assert.strictEqual(error, "PageRuntime.NoAssignedPage", "A rejected promise with the correct translated error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a promise which resolves to an object with a spaceId and a pageId in the 1st space", function (assert) {
        // Arrange
        this.oGetSpacesPagesHierarchyStub.resolves({
            spaces: [{
                title: "First Space",
                id: "space1",
                pages: [
                    { id: "page1-in-space1" },
                    { id: "page2-in-space1" }
                ]
            }, {
                title: "Second Space",
                id: "space2",
                pages: [
                    { id: "page1-in-space2" },
                    { id: "page2-in-space2" }
                ]
            }]
        });

        var oExpectedResult = {
            spaceId: "space1",
            pageId: "page1-in-space1"
        };

        // Act and assert
        return this.oController._getUserDefaultPage().then(function (result) {
            assert.deepEqual(result, oExpectedResult, "The resolved default page is 'page1-in-space1' and default space is 'space1.");
        });
    });

    QUnit.test("Returns a promise which resolves to an object with a spaceId and a pageId of the 2nd space", function (assert) {
        // Arrange
        this.oGetSpacesPagesHierarchyStub.resolves({
            spaces: [{
                title: "First Space",
                id: "space1",
                pages: []
            }, {
                title: "Second Space",
                id: "space2",
                pages: [
                    { id: "page1-in-space2" },
                    { id: "page2-in-space2" }
                ]
            }]
        });

        var oExpectedResult = {
            spaceId: "space2",
            pageId: "page1-in-space2"
        };

        // Act and assert
        return this.oController._getUserDefaultPage().then(function (result) {
            assert.deepEqual(result, oExpectedResult, "The resolved default page is 'page1-in-space2' and default space is 'space2.");
        });
    });

    QUnit.module("The function _openFLPPage", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oController.oInitFinishedPromise = Promise.resolve();
            this.oLoadPageStub = sandbox.stub().resolves();
            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({
                            loadPage: this.oLoadPageStub
                        });
                    }.bind(this)
                };
            }.bind(this);
            this.oGetPageAndSpaceIdStub = sandbox.stub(this.oController, "_getPageAndSpaceId").resolves({
                spaceId: "space1",
                pageId: "page1"
            });
            this.oNavigateStub = sandbox.stub(this.oController, "_navigate");
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("This is a translated error message.");
            this.oNavContainerToStub = sandbox.stub();
            this.oSetPropertyStub = sandbox.stub();
            this.oController._oErrorPageModel = {
                setProperty: this.oSetPropertyStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
            this.oController.oErrorPage = {
                id: "page-1"
            };
            this.oEventHubEmitStub = sandbox.stub(EventHub, "emit");
            this.oEventHubLastStub = sandbox.stub(EventHub, "last");

            this.oShowActionModeButtonStub = sandbox.stub(this.oController, "_showActionModeButton");
            this.oHideActionModeButtonStub = sandbox.stub(this.oController, "_hideActionModeButton");
            this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Emits the PageRuntimeRendered event of the EventHub", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oEventHubEmitStub.firstCall.args, ["PagesRuntimeRendered"], "The init function emit the PagesRuntimeRendered event.");
        }.bind(this));
    });

    QUnit.test("Emits the AppRendered event of the EventHub when navigate back", function (assert) {
        // Arrange
        this.oEventHubLastStub.withArgs("AppRendered").returns({});
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oEventHubEmitStub.firstCall.args, ["PagesRuntimeRendered"], "The init function emit the PagesRuntimeRendered event.");
            assert.deepEqual(this.oEventHubEmitStub.secondCall.args, ["AppRendered", undefined], "The init function emit the PagesRuntimeRendered event.");
        }.bind(this));
    });

    QUnit.test("Gets the pageId and spaceId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oGetPageAndSpaceIdStub.callCount, 1, "The function _getPageAndSpaceId is called once.");
        }.bind(this));
    });

    QUnit.test("Loads the required page", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oLoadPageStub.getCall(0).args, ["page1"], "The function loadPage of the pages service is called with page id 'page1'.");
        }.bind(this));
    });

    QUnit.test("Navigates to the specified page", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oNavigateStub.firstCall.args, ["page1", "space1"], "The function navigate is called with page id 'page1' and space id 'space1'.");
            assert.strictEqual(this.oShowActionModeButtonStub.callCount, 1, "_showActionModeButton was called once");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when _getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when _getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 4, "The method setProperty of the error page model is called 4 times.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/icon", "sap-icon://documents"], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/text", oError], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(2).args, ["/description", ""], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(3).args, ["/details", ""], "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when an error that is a javascript error object occurs", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = function () {
            return {
                getPagesService: function () {
                    return Promise.reject(new Error("A javascript error object"));
                }
            };
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.deepEqual(this.oResourceI18nGetTextStub.getCall(0).args, ["PageRuntime.GeneralError.Text"], "The function getText of resource.i18n is called with correct parameters.");
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The method setProperty of the error page model is called once.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/text", "This is a translated error message."], "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when an error that is a javascript error object occurs", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = {
            getPagesService: function () {
                return Promise.reject(new Error("A javascript error object"));
            }
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when there is an error", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };

        this.oController.getOwnerComponent = function () {
            return {
                getPagesService: function () {
                    return Promise.reject(oError);
                }
            };
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 2, "The function getText of resource.i18n is called twice.");
            assert.strictEqual(this.oSetPropertyStub.callCount, 4, "The method setProperty of the error page model is called 4 times.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/icon", "sap-icon://documents"], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/text", "This is a translated error message."], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(2).args, ["/description", ""], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(3).args,
                ["/details", "This is a translated error message." + JSON.stringify(oError)],
                "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when there is an error", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = {
            getPagesService: function () {
                Promise.reject();
            }
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Updates the sCurrentTargetPageId property with the current pageId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oController.sCurrentTargetPageId, "page1", "The correct value has been found.");
        }.bind(this));
    });

    QUnit.test("Does not call _navigate if the pageId is no longer the current target", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = {
            getPagesService: function () {
                return Promise.resolve({
                    loadPage: function () {
                        // Use fake implementation to asynchronously set sCurrentTargetPageId.
                        // (Otherwise, the resolver function is executed synchronously.)
                        return new Promise(function (resolve) {
                            this.oController.sCurrentTargetPageId = "otherPageId";
                            resolve();
                        }.bind(this));
                    }.bind(this)
                });
            }
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavigateStub.callCount, 0, "The function _navigate has not been called.");
        }.bind(this));
    });

    QUnit.module("The function _navigate", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.aPages = [];
            this.oGetCurrentPageStub = sandbox.stub();
            this.oNavContainerToStub = sandbox.stub();
            this.oNavContainerGetPagesStub = function () {
                return this.aPages;
            }.bind(this);
            this.oController.oPagesNavContainer = {
                getCurrentPage: this.oGetCurrentPageStub,
                getPages: this.oNavContainerGetPagesStub,
                to: this.oNavContainerToStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
            this.oSetPropertyStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub();
            this.oController._oViewSettingsModel = {
                setProperty: this.oSetPropertyStub
            };
            this.oHasMultiplePagesStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("Menu").resolves({
                    hasMultiplePages: this.oHasMultiplePagesStub
                })
            };

            this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
        },
        afterEach: function () {
            this.oController.destroy();
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Navigates using the NavContainer to the specified page and hides the page title", function (assert) {
        // Arrange
        this.aPages = [
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE") },
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE_2") }
        ];
        this.oHasMultiplePagesStub.resolves(false);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/showPageTitle", false], "The view setting '/showPageTitle' was set to false.");
            assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
        }.bind(this));
    });

    QUnit.test("Navigates using the NavContainer to the specified page and shows the page title if the space has multiple pages", function (assert) {
        // Arrange
        this.aPages = [
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE") },
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE_2") }
        ];
        this.oHasMultiplePagesStub.resolves(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/showPageTitle", true], "The view setting '/showPageTitle' was set to true.");
            assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
        }.bind(this));
    });

    QUnit.test("Doesn't navigate if the navigation container has no pages", function (assert) {
        // Arrange

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").catch(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
        }.bind(this));
    });

    QUnit.test("Doesn't navigate if no page contains the target page id", function (assert) {
        // Arrange
        this.aPages = [
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE") }
        ];

        // Act
        return this.oController._navigate("ZTEST", "ZSPACE").catch(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
        }.bind(this));
    });

    QUnit.test("Cancels editmode if controller navigates to a different page", function (assert) {
        // Arrange
        this.aPages = [
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE") }
        ];
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Doesn't cancel editmode if controller navigates to a different page", function (assert) {
        // Arrange
        this.aPages = [
            { data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE") }
        ];
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);
        this.oGetCurrentPageStub.returns(this.aPages[0]);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oCancelActionModeStub.callCount, 0, "_cancelActionMode was not called");
        }.bind(this));
    });

    QUnit.module("The function _visualizationFactory", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oGetPageVisibilityStub = sandbox.stub(oStateManager, "getPageVisibility");

            this.oOnVisualizationPressStub = sandbox.stub(this.oController, "onVisualizationPress").returns({
                id: "visualizationPress"
            });
            this.oAddTileActionsStub = sandbox.stub(this.oController, "_addTileActions");

            sandbox.stub(resources.i18n, "getText").returnsArg(0);

            this.oAttachPressStub = sandbox.stub();
            this.oBindEditableStub = sandbox.stub();
            this.oSetActiveStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub();

            this.oVisualizationStub = {
                attachPress: this.oAttachPressStub,
                bindEditable: this.oBindEditableStub,
                setActive: this.oSetActiveStub
            };
            this.oInstantiateVisualizationStub = sandbox.stub().returns(this.oVisualizationStub);
            this.oController._oVisualizationInstantiationService = {
                instantiateVisualization: this.oInstantiateVisualizationStub
            };

            this.oContextMock = {
                getObject: sandbox.stub().returns({
                    tileId: "",
                    vizType: "sap.ushell.StaticAppLauncher"
                }),
                getPath: sandbox.stub().returns("/pages/0/sections/0/visualizations/0"),
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            };

            this.oGetPageVisibilityStub.withArgs("/pages/0").returns(true);
            this.oGetPropertyStub.withArgs("/vizTypes/sap.ushell.StaticAppLauncher").returns({
                "sap.app": {
                    id: "sap.ushell.components.tiles.cdm.applauncher",
                    type: "component"
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Instantiates a visualization without any tile actions in case the factory function was called by the default section", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/pages/0/sections/0").returns({
            default: true
        });

        var oExpectedVisualizationData = {
            tileId: "",
            vizType: "sap.ushell.StaticAppLauncher"
        };

        var oExpectedVizType = {
            "sap.app": {
                id: "sap.ushell.components.tiles.cdm.applauncher",
                type: "component"
            }
        };

        // Act
        var oControl = this.oController._visualizationFactory("someId", this.oContextMock);

        // Assert
        assert.deepEqual(this.oInstantiateVisualizationStub.firstCall.args[0],
            oExpectedVisualizationData,
            "The function instantiateVisualization of the VisualizationInstantiation service was called with the right visualization data.");
        assert.deepEqual(this.oInstantiateVisualizationStub.firstCall.args[1],
            oExpectedVizType,
            "The function instantiateVisualization of the VisualizationInstantiation service was called with the right vizType.");
        assert.strictEqual(oControl, this.oVisualizationStub, "The function returns the control from the VisualizationInstantiation service.");
        assert.strictEqual(this.oBindEditableStub.callCount, 1, "'bindEditable' was called exactly once");
        assert.deepEqual(this.oBindEditableStub.getCall(0).args, ["viewSettings>/actionModeActive"], "'bindEditable' was called with the right arguments");
        assert.strictEqual(this.oAttachPressStub.callCount, 1, "'attachPress' was called exactly once");
        assert.deepEqual(this.oAttachPressStub.getCall(0).args, [this.oOnVisualizationPressStub, this.oController], "'attachPress' was called with the right arguments");

        assert.strictEqual(this.oGetPageVisibilityStub.callCount, 1, "getPageVisibility was called once");
        assert.deepEqual(this.oSetActiveStub.getCall(0).args, [true], "setActive was called with correct args");

        assert.strictEqual(this.oAddTileActionsStub.callCount, 0, "The function didn't add any tile actions to the visualization.");
    });

    QUnit.test("Adds tile actions if the instantiated visualization is not inside a default section", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/pages/0/sections/0").returns({
            default: false
        });

        // Act
        this.oController._visualizationFactory("someId", this.oContextMock);

        // Assert
        assert.strictEqual(this.oAddTileActionsStub.callCount, 1, "The function addTileAction was called once.");
        assert.deepEqual(this.oAddTileActionsStub.firstCall.args[0], this.oVisualizationStub, "The function _addTileActions was called with the right visualization.");
    });

    QUnit.test("Returns a GenericTile if the VisualizationInstantiation service is not resolved", function (assert) {
        // Arrange
        delete this.oController._oVisualizationInstantiationService;

        // Act
        var oControl = this.oController._visualizationFactory();

        // Assert
        assert.strictEqual(oControl.getMetadata().getName(), "sap.m.GenericTile", "The function returns a sap.m.GenericTile as a fallback if the VisualizationInstantiation service is not resolved.");
        assert.strictEqual(oControl.getState(), "Failed", "The returned GenericTile has a failed loading state.");
    });

    QUnit.module("The function _addTileActions", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
            this.oGetAvailableDisplayFormatsStub = sandbox.stub(VizInstance.prototype, "getAvailableDisplayFormats").returns(["compact", "flat"]);
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Adds tile actions for every available display format", function (assert) {
        // Act
        this.oController._addTileActions(this.oVizInstance);

        var aVizInstanceTileActions = this.oVizInstance.getTileActions();

        // Assert
        assert.strictEqual(aVizInstanceTileActions[0].getText(), "VisualizationInstance.ConvertToCompactAction", "The correct tile action 'compact' was added to the action menu");
        assert.strictEqual(aVizInstanceTileActions[1].getText(), "VisualizationInstance.ConvertToFlatAction", "The correct tile action 'flat' was added to the action menu");
        assert.strictEqual(aVizInstanceTileActions.length, 3, "The correct amount of tile actions were added to the menu");

        // Cleanup
        this.oVizInstance.destroy();
    });

    QUnit.test("Adds a tile action for moving the visualization", function (assert) {
        // Arrange
        var oVizInstance = new VizInstance({});

        // Act
        this.oController._addTileActions(oVizInstance);
        var aVizInstanceTileActions = oVizInstance.getTileActions();

        // Assert
        assert.strictEqual(aVizInstanceTileActions[aVizInstanceTileActions.length - 1].getText(), "moveTileDialog_action", "The correct tile action 'Move' was added to the action menu");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The function onVisualizationPress", {
        beforeEach: function () {
            this.oEventGetParameterStub = sandbox.stub();
            this.oGetPathStub = sandbox.stub().returns("/pages/0/sections/1/visualizations/2");

            this.oVisualizationMock = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                })
            };

            this.oSectionMock = {
                getItemPosition: sandbox.stub().withArgs(this.oVisualizationMock).returns(1),
                _focusItem: sandbox.stub()
            };

            this.oEvent = {
                getParameter: this.oEventGetParameterStub,
                getSource: sandbox.stub().returns(this.oVisualizationMock)
            };

            this.oController = new PagesRuntimeController();
            this.oDeleteVisualizationStub = sandbox.stub();
            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({
                            deleteVisualization: this.oDeleteVisualizationStub
                        });
                    }.bind(this)
                };
            }.bind(this);

            sandbox.stub(this.oController, "_getAncestorControl").withArgs(this.oVisualizationMock, "sap.ushell.ui.launchpad.Section").returns(this.oSectionMock);
        },

        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Does nothing if scope is not 'Actions'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("NotActions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 0, "'deleteVisualization' was not called");
        }.bind(this));
    });

    QUnit.test("Does nothing if action is not 'Remove'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("NotRemove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 0, "'deleteVisualization' was not called");
        }.bind(this));
    });

    QUnit.test("Does call 'deleteVisualization' with the right parameters if scope is 'Actions' and action is 'Remove'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 1, "'deleteVisualization' was called exactly once");
            assert.deepEqual(this.oDeleteVisualizationStub.firstCall.args, ["0", "1", "2"], "'deleteVisualization' was called with the right parameters");
        }.bind(this));
    });

    QUnit.test("Calls _focusItem with the right args", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oSectionMock._focusItem.callCount, 1, "focusItem was called once");
            assert.strictEqual(this.oSectionMock._focusItem.getCall(0).args[0], 1, "focusItem was called with the right index");
            assert.strictEqual(this.oSectionMock._focusItem.getCall(0).args.length, 1, "focusItem was called with the right number of args");
        }.bind(this));
    });

    QUnit.module("The function onExit", {
        beforeEach: function () {
            this.oStateManagerExitStub = sandbox.stub(oStateManager, "exit");
            this.oController = new PagesRuntimeController();
            this.oHomeDetachedMatchedStub = sandbox.stub();
            this.oOpenFLPPageDetachedMatchedStub = sandbox.stub();
            this.oController.oContainerRouter = {
                getRoute: function () { }
            };
            this.oOffStub = sandbox.stub();
            this.oController._aConfigListeners = {
                off: this.oOffStub
            };
            this.oGetRouteStub = sandbox.stub(this.oController.oContainerRouter, "getRoute");
            this.oGetRouteStub.withArgs("home").returns({
                detachMatched: this.oHomeDetachedMatchedStub
            });
            this.oGetRouteStub.withArgs("openFLPPage").returns({
                detachMatched: this.oOpenFLPPageDetachedMatchedStub
            });
            this.oEventHubOffStub = sandbox.stub();
            this.oController.oEventHubListener = {
                off: this.oEventHubOffStub
            };
            this.oEventBusUnsubscribeStub = sinon.stub();
            this.oController._oEventBus = {
                unsubscribe: this.oEventBusUnsubscribeStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches matched event from home route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oHomeDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'home'.");
    });

    QUnit.test("Detaches matched event from openFLPPage route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOpenFLPPageDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'openFLPPage'.");
    });

    QUnit.test("Detaches all config listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.test("Calls the exit of the state manager", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oStateManagerExitStub.callCount, 1, "The function 'exit' was called once.");
    });

    QUnit.test("Detaches all EventHub listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.test("Unsubscribes the events launchpad/shellFloatingContainerIsDocked and launchpad/shellFloatingContainerIsUnDocked", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oEventBusUnsubscribeStub.callCount, 2, "The function 'unsubscribe' was called twice.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[1], "shellFloatingContainerIsDocked", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[1], "shellFloatingContainerIsUnDocked", "The function 'unsubscribe' was called with correct parameters.");
    });

    QUnit.module("The function _pressViewDetailsButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub();
            this.oController._oErrorPageModel = {
                getProperty: this.oGetPropertyStub,
                setProperty: this.oSetPropertyStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Sets the error description", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns("description-1");

        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The method setProperty of the error page model is called once.");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/description", "description-1"], "The method setProperty is called with correct parameters.");
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "The method getProperty of the error page model is called once.");
        assert.deepEqual(this.oGetPropertyStub.getCall(0).args, ["/details"], "The method getProperty of the error page model is called with correct parameters.");
    });

    QUnit.test("Uses the default description when it is not available", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns(undefined);

        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/description", ""], "The method setProperty is called with correct parameters.");
    });

    QUnit.module("The function _copyToClipboard", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetPropertyStub = sandbox.stub().returns("This is some text");
            this.oController._oErrorPageModel = {
                getProperty: this.oGetPropertyStub
            };
            this.oTextArea = {
                select: sandbox.stub(),
                parentNode: {
                    removeChild: sandbox.stub()
                }
            };
            var oOriginalDocumentMethods = {
                createElement: document.createElement,
                appendChild: document.documentElement.appendChild,
                execCommand: document.execCommand
            };
            this.oCreateElementStub = sandbox.stub(document, "createElement").callsFake(function (type) {
                if (type === "textarea") {
                    return this.oTextArea;
                }
                return oOriginalDocumentMethods.createElement.apply(document, arguments);
            }.bind(this));
            this.oAppendChildStub = sandbox.stub(document.documentElement, "appendChild").callsFake(function (element) {
                if (!element === this.oTextArea) {
                    return oOriginalDocumentMethods.appendChild.apply(document, arguments);
                }
            }.bind(this));
            this.oExecStub = sandbox.stub(document, "execCommand").callsFake(function (command) {
                if (!command === "copy") {
                    return oOriginalDocumentMethods.execCommand.apply(document, arguments);
                }
            });
            this.oShowStub = sandbox.stub(MessageToast, "show");
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Properly copies the string provided to the clipboard", function (assert) {
        // Arrange
        var oExpectedTextArea = {
            contentEditable: true,
            readonly: false,
            textContent: "This is some text"
        };

        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");

        // Act
        this.oController._copyToClipboard();

        // Assert
        assert.strictEqual(this.oTextArea.contentEditable, oExpectedTextArea.contentEditable, "contentEditable property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.readonly, oExpectedTextArea.readonly, "readonly property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.textContent, oExpectedTextArea.textContent, "textContent property of the textArea has the expected value");
        assert.deepEqual(this.oShowStub.firstCall.args, ["Success", { closeOnBrowserNavigation: false }], "MessageToast was displayed as expected");
        assert.deepEqual(this.oTextArea.parentNode.removeChild.firstCall.args[0], this.oTextArea, "TextArea was removed at the end");
    });

    QUnit.test("Shows a MessageToast containing an error when the content could not be copied to the clipboard", function (assert) {
        // Arrange
        this.oAppendChildStub.throws(new Error());
        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");

        // Act
        this.oController._copyToClipboard();

        // Assert
        assert.strictEqual(this.oShowStub.firstCall.args[0], "Fail", "MessageToast was displayed as expected");
    });

    QUnit.module("The function _parsePageAndSpaceId", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").returns("translation");
            this.oGetUserDefaultPageStub = sandbox.stub(this.oController, "_getUserDefaultPage").resolves("page1");
            this.oSomeIntent = {
                semanticObject: "some",
                intent: "intent"
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns a rejected promise when the intent is not Shell-home and no pageId and spaceId are provided", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId([/*pageId */], [/*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.NoPageIdAndSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns the result of _getUserDefaultPage when the intent is Shell-home and no pageId and spaceId are provided", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "Shell",
            action: "home"
        };

        // Act
        return this.oController._parsePageAndSpaceId([/*pageId*/], [/*spaceId*/], oIntent).then(function (result) {
            // Assert
            assert.strictEqual(this.oGetUserDefaultPageStub.callCount, 1, "The function _getUserDefaultPage is called once.");
            assert.strictEqual(result, "page1", "The correct result is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a spaceId is provided", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId([/*pageId*/], ["space1"], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlySpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a pageId are provided", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId(["page1"], [/*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlyPageIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when more than one pageId or spaceId are provided", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId(["page1", "page2"], [ /*spaceId*/], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.MultiplePageOrSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when the pageId is empty", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId([""], ["spaceId"], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.InvalidPageId", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when the spaceId is empty", function (assert) {
        // Act
        return this.oController._parsePageAndSpaceId(["pageId"], [""], this.oSomeIntent).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.InvalidSpaceId", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a resolved promise when the pageId and spaceId are not empty", function (assert) {
        // Arrange
        var oExpectedResult = {
            pageId: "providedPageId",
            spaceId: "providedSpaceId"
        };

        // Act
        return this.oController._parsePageAndSpaceId(["providedPageId"], ["providedSpaceId"], {/*intent*/ }).then(function (result) {
            // Assert
            assert.deepEqual(result, oExpectedResult, "The correct page and space ID is returned.");
        });
    });

    QUnit.module("The _createActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oController.bIsHomeIntentRootIntent = true;

            this.sActionButtonId = "ActionModeBtn";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Activate").returns("PageRuntime.EditMode.Activate");
            this.oExpectedUserActionButtonParameters = {
                controlType: "sap.ushell.ui.launchpad.ActionItem",
                oControlProperties: {
                    id: this.sActionButtonId,
                    text: "PageRuntime.EditMode.Activate",
                    tooltip: "PageRuntime.EditMode.Activate",
                    icon: "sap-icon://edit"
                },
                bIsVisible: true
            };

            this.oDoneStub = sandbox.stub();
            this.oAddUserActionStub = sandbox.stub();
            this.oAddUserActionStub.returns({
                done: this.oDoneStub
            });
            this.oShowHeaderEndItemStub = sandbox.stub();
            this.oGetShellConfigStub = sandbox.stub().returns({
                moveEditHomePageActionToShellHeader: false
            });
            this.oGetRendererStub = sandbox.stub();
            this.oGetRendererStub.withArgs("fiori2").returns({
                addUserAction: this.oAddUserActionStub,
                showHeaderEndItem: this.oShowHeaderEndItemStub,
                getShellConfig: this.oGetShellConfigStub
            });
            ObjectPath.set("ushell.Container.getRenderer", this.oGetRendererStub, sap);

            this.oAddStyleClassStub = sandbox.stub();
            this.oActionButtonMock = {
                addStyleClass: this.oAddStyleClassStub
            };

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/extension/enableHelp").returns(true);

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/ui/shell/ShellHeadItem"], sinon.match.any).callsArgWith(1, ShellHeadItem);
            this.oRequireStub.callThrough();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container.getRenderer;
            this.oController.destroy();
            if (sap.ui.getCore().byId(this.sActionButtonId)) {
                sap.ui.getCore().byId(this.sActionButtonId).destroy();
            }
        }
    });

    QUnit.test("Add button to the header to the home state when the home page is root intent", function (assert) {
        // Arrange
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });

        // Act
        this.oController._createActionModeButton();

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 2, "A text was required");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called once");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [this.sActionButtonId, false, ["home"]], "showHeaderEndItem called with correct arguments");
        var oHeadControl = sap.ui.getCore().byId(this.sActionButtonId);
        assert.ok(oHeadControl.hasStyleClass("help-id-ActionModeBtn"), "xRray style class was added");
    });

    QUnit.test("Add button to the header to the current state when the home page is not root intent", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });

        // Act
        this.oController._createActionModeButton();

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 2, "A text was required");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called once");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [this.sActionButtonId, true], "showHeaderEndItem called with correct arguments");
        var oHeadControl = sap.ui.getCore().byId(this.sActionButtonId);
        assert.ok(oHeadControl.hasStyleClass("help-id-ActionModeBtn"), "xRray style class was added");
    });

    QUnit.test("Add button to the user menu to the home state when the home page is root intent", function (assert) {
        // Arrange
        this.oExpectedUserActionButtonParameters.aStates = ["home"];

        // Act
        this.oController._createActionModeButton();
        this.oDoneStub.getCall(0).args[0](this.oActionButtonMock);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 2, "Correct text was required");
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "user action menu entry was added");
        assert.strictEqual(typeof this.oAddUserActionStub.getCall(0).args[0].oControlProperties.press[0], "function", "A handler was attached");
        var oAddUserActionsParameters = this.oAddUserActionStub.getCall(0).args[0];
        delete oAddUserActionsParameters.oControlProperties.press;
        assert.deepEqual(oAddUserActionsParameters, this.oExpectedUserActionButtonParameters, "correct parameters were applied");
        assert.strictEqual(this.oAddStyleClassStub.getCall(0).args[0], "help-id-ActionModeBtn", "xRray style class was added");
    });

    QUnit.test("Add button to the user menu to the current state when the home page is not root intent", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;
        this.oExpectedUserActionButtonParameters.aStates = null;
        this.oExpectedUserActionButtonParameters.bCurrentState = true;

        // Act
        this.oController._createActionModeButton();
        this.oDoneStub.getCall(0).args[0](this.oActionButtonMock);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 2, "Correct text was required");
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "user action menu entry was added");
        assert.strictEqual(typeof this.oAddUserActionStub.getCall(0).args[0].oControlProperties.press[0], "function", "A handler was attached");
        var oAddUserActionsParameters = this.oAddUserActionStub.getCall(0).args[0];
        delete oAddUserActionsParameters.oControlProperties.press;
        assert.deepEqual(oAddUserActionsParameters, this.oExpectedUserActionButtonParameters, "correct parameters were applied");
        assert.strictEqual(this.oAddStyleClassStub.getCall(0).args[0], "help-id-ActionModeBtn", "xRray style class was added");
    });

    QUnit.module("The pressActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.oGetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({
                getProperty: this.oGetPropertyStub
            });
            this.oGetViewStub = sandbox.stub();
            this.oGetViewStub.returns({
                getModel: this.oGetModelStub
            });
            this.oController.getView = this.oGetViewStub;
            this.oCancelStub = sandbox.stub(ActionMode, "cancel");
            this.oStartStub = sandbox.stub(ActionMode, "start");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Action mode is active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oCancelStub.callCount, 1, "cancel was called exactly once");
    });

    QUnit.test("Action mode is not active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oStartStub.callCount, 1, "start was called exactly once");
        assert.strictEqual(this.oStartStub.getCall(0).args[0], this.oController, "start was called with the right controller");
    });

    QUnit.module("The handleEditModeAction function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.sMockHandler = "sMockHandler";
            this.oMockEvent = { id: "oMockEvent" };
            this.oMockSource = { id: "oMockSource" };
            this.oMockParameters = { id: "oMockParameters" };

            this.oMockHandler = sandbox.stub();
            ActionMode[this.sMockHandler] = this.oMockHandler;
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        // Act
        this.oController.handleEditModeAction(this.sMockHandler, this.oMockEvent, this.oMockSource, this.oMockParameters);
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.deepEqual(this.oMockHandler.getCall(0).args[0], this.oMockEvent, "the event object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[1], this.oMockSource, "the source object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[2], this.oMockParameters, "the parameters object was passed");
    });

    QUnit.module("The moveVisualization function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oVBox = new VBox({
                items: {
                    path: "/pages",
                    factory: function (sPageId) {
                        return new Page({
                            id: sPageId,
                            sections: {
                                path: "sections",
                                factory: function (sSectionId) {
                                    return new Section({
                                        id: sSectionId,
                                        default: "{default}",
                                        visualizations: {
                                            path: "visualizations",
                                            factory: function (sTileId) {
                                                return new GenericTile({
                                                    id: sTileId
                                                });
                                            }
                                        },
                                        compactItems: {
                                            path: "compactItems",
                                            factory: function (sTileId) {
                                                return new GenericTile({
                                                    id: sTileId
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
            this.oVBox.setModel(new JSONModel({
                pages: [{
                    id: "page0",
                    sections: [{
                        id: "section0",
                        default: true,
                        visualizations: [
                            { id: "tile0" },
                            { id: "tile3" }
                        ],
                        compactItems: [
                            { id: "tile4" }
                        ]
                    }, {
                        id: "section1",
                        default: false,
                        visualizations: [
                            { id: "tile1" },
                            { id: "tile2" }
                        ],
                        compactItems: []
                    }, {
                        id: "section2",
                        default: false,
                        visualizations: [
                            { id: "tile5" },
                            { id: "tile6" }
                        ],
                        compactItems: [
                            { id: "tile7" }
                        ]
                    }]
                }]
            }));
            this.oVBox.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            var oPage = this.oVBox.getItems()[0];
            this.oTile0 = oPage.getSections()[0].getDefaultItems()[0];
            this.oTile3 = oPage.getSections()[0].getDefaultItems()[1];
            this.oTile4 = oPage.getSections()[0].getCompactItems()[0];

            this.oSection1 = oPage.getSections()[1];
            this.oTile1 = this.oSection1.getDefaultItems()[0];
            this.oTile2 = this.oSection1.getDefaultItems()[1];

            this.oSection2 = oPage.getSections()[2];
            this.oTile5 = this.oSection2.getDefaultItems()[0];
            this.oTile6 = this.oSection2.getDefaultItems()[1];
            this.oTile7 = this.oSection2.getCompactItems()[0];

            this.oMoveVisualizationStub = sandbox.stub().resolves({});
            this.oUpdateVisualizationStub = sandbox.stub().resolves();
            this.oEnableImplicitSaveStub = sandbox.stub();
            this.oSavePersonalizationStub = sandbox.stub().resolves();
            this.oInvisibleMessageAnnounceStub = sandbox.stub();
            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({
                            moveVisualization: this.oMoveVisualizationStub,
                            updateVisualization: this.oUpdateVisualizationStub,
                            enableImplicitSave: this.oEnableImplicitSaveStub,
                            savePersonalization: this.oSavePersonalizationStub
                        });
                    }.bind(this),
                    getInvisibleMessageInstance: sandbox.stub().returns({
                        announce: this.oInvisibleMessageAnnounceStub
                    })
                };
            }.bind(this);
        },
        afterEach: function () {
            sandbox.restore();
            this.oVBox.destroy();
            this.oController.destroy();
        }
    });

    QUnit.test("dropping a visualization before the next visualization doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile2,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 0, "announce was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization after the visualization before doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 0, "announce was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization in the CompactArea acts like dropping after last and calls moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile4,
            droppedControl: this.oSection2.oCompactArea,
            dropPosition: "On",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 1, "announce was called");
            assert.strictEqual(this.oMoveVisualizationStub.args[0][2], 1, "moveVisualization was called with expected iCurrentVizIndex");
            assert.strictEqual(this.oMoveVisualizationStub.args[0][4], 2, "moveVisualization was called with expected iTargetVizIndex");
        }.bind(this));
    });

    QUnit.test("dropping a visualization on itself doesn't call moveVisualization", function (assert) {
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile1,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 0, "announce was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization from a non-default section on the default section doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile0,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 0, "announce was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization from the default section on the default section calls moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile3,
            droppedControl: this.oTile0,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 1, "announce was called once");
        }.bind(this));
    });

    QUnit.test("dropping a visualization after another visualization calls moveVisualization correctly", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile2,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var aExpectedArguments = [
            0, // Page index
            1, // Source Section index
            0, // Source Viz index
            1, // Target Section index
            1 // Target Viz index
        ];

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            var sExpectedAnnounceMessage = resources.i18n.getText("PageRuntime.Message.TileMoved"),
                sExpectedType = coreLibrary.InvisibleMessageMode.Polite;

            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, aExpectedArguments, "moveVisualization was called correctly");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 1, "announce was called once");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.args[0][0], sExpectedAnnounceMessage,
                "announce was called with the correct message");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.args[0][1], sExpectedType,
                "announce was called with the correct message type");
        }.bind(this));
    });

    QUnit.test("dropping a visualization before another visualization calls moveVisualization correctly", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var aExpectedArguments = [
            0, // Page index
            1, // Source Section index
            1, // Source Viz index
            1, // Target Section index
            0 // Target Viz index
        ];

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            var sExpectedAnnounceMessage = resources.i18n.getText("PageRuntime.Message.TileMoved"),
                sExpectedType = coreLibrary.InvisibleMessageMode.Polite;

            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, aExpectedArguments, "moveVisualization was called correctly");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.callCount, 1, "announce was called once");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.args[0][0], sExpectedAnnounceMessage,
                "announce was called with the correct message");
            assert.strictEqual(this.oInvisibleMessageAnnounceStub.args[0][1], sExpectedType,
                "announce was called with the correct message type");

        }.bind(this));
    });

    QUnit.test("Calls _focusItem on the target section", function (assert) {
        // Arrange
        sandbox.stub(this.oSection1, "_focusItem");

        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var oExpectedPosition = {
            area: "standard",
            index: 0
        };

        this.oMoveVisualizationStub.resolves({
            visualizationIndex: 0
        });

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oSection1._focusItem.callCount, 1, "_focusItem was called once");
            assert.deepEqual(this.oSection1._focusItem.getCall(0).args, [oExpectedPosition],
                "_focusItem was called with the right position");
        }.bind(this));
    });

    QUnit.test("Updates the visualization with the correct displayFormatHint based on the area", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var oGetItemPositionStub = sandbox.stub(this.oSection1, "getItemPosition");
        oGetItemPositionStub.withArgs(this.oTile1).returns({
            index: 0,
            area: DisplayFormat.Compact
        });
        oGetItemPositionStub.callThrough();

        var aExpectedArguments = [
            0,
            1,
            0,
            { displayFormatHint: DisplayFormat.Compact }
        ];
        this.oMoveVisualizationStub.resolves({
            visualizationIndex: 0
        });

        sandbox.stub(this.oSection1, "focusVisualization"); // needed because section internals get corrupted due to the stubs
        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.deepEqual(this.oUpdateVisualizationStub.getCall(0).args, aExpectedArguments, "updateVisualization was called with correct args");
        }.bind(this));
    });

    QUnit.test("Does the save calls correctly", function (assert) {
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.deepEqual(this.oEnableImplicitSaveStub.getCall(0).args, [false], "enableImplicitSave was called correctly the first time");
            assert.deepEqual(this.oEnableImplicitSaveStub.getCall(1).args, [true], "enableImplicitSave was called correctly the second time");
            assert.deepEqual(this.oSavePersonalizationStub.getCall(0).args, [], "savePersonalization was called correctly");
        }.bind(this));
    });

    QUnit.module("_getVizMoveAnnouncement", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText").callsFake(function (sKey) {
                return sKey;
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns correct announcement for Tile Move", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Standard;

        // Act
        // Instead of the translated announcement the i18n key gets returned
        var sText = this.oController._getVizMoveAnnouncement(sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.TileMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link Move", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Compact;

        // Act
        var sText = this.oController._getVizMoveAnnouncement(sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.LinkMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link to Tile conversion", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Standard;

        // Act
        var sText = this.oController._getVizMoveAnnouncement(sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.LinkConverted", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Tile to Link conversion", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Compact;

        // Act
        var sText = this.oController._getVizMoveAnnouncement(sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.TileConverted", "returned the correct i18n key");
    });

    QUnit.module("The onDragEnter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetDefaultStub = sinon.stub();
            this.oGetDefaultStub.returns(false);
            this.oGetShowSectionStub = sinon.stub();
            this.oGetShowSectionStub.returns(true);
            this.oGetDropControlStub = sinon.stub();
            this.oGetDropControlStub.returns({
                getDefault: this.oGetDefaultStub,
                getShowSection: this.oGetShowSectionStub

            });
            this.oGetParameterStub = sinon.stub();
            this.oGetParameterStub.withArgs("dragSession").returns({
                getDropControl: this.oGetDropControlStub
            });
            this.oPreventDefaultStub = sinon.stub();
            this.oEventMock = {
                getParameter: this.oGetParameterStub,
                preventDefault: this.oPreventDefaultStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("drag enter on visible non default section", function (assert) {
        // Act
        this.oController.onDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("drag enter on default section", function (assert) {
        // Arrange
        this.oGetDefaultStub.returns(true);

        // Act
        this.oController.onDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
    });

    QUnit.module("The onAreaDragEnter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oGetParameterStub = sandbox.stub();
            this.oEventMock = {
                getParameter: this.oGetParameterStub
            };

            this.aAvailableDisplayFormats = [];
            this.oVizInstanceStub = {
                getAvailableDisplayFormats: sandbox.stub().returns(this.aAvailableDisplayFormats)
            };
            this.oGetParameterStub.withArgs("dragControl").returns(this.oVizInstanceStub);

            this.oOriginalEventMock = {
                preventDefault: sinon.stub()
            };
            this.oGetParameterStub.withArgs("originalEvent").returns(this.oOriginalEventMock);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Prevents the drop if the target area display format is not supported", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Flat);
        this.aAvailableDisplayFormats.push(DisplayFormat.Compact);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 1, "preventDefault was called");
    });

    QUnit.test("Allows the drop if the target area display format is supported", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Flat);
        this.aAvailableDisplayFormats.push(DisplayFormat.Flat);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("Allows the drop if source and target area display format are the same", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Standard);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.module("_handleUshellContainerDocked", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oSetPropertyStub = sandbox.stub();
            this.oController._oViewSettingsModel = {
                setProperty: this.oSetPropertyStub
            };
        }
    });

    QUnit.test("Sets ushellContainerDocked=true when sap ushell container is docked'", function (assert) {
        // Act
        this.oController._handleUshellContainerDocked("launchpad", "shellFloatingContainerIsDocked");

        // Assert
        assert.ok(this.oSetPropertyStub.calledOnce, " The function 'setProperty' is called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/ushellContainerDocked", true], " The function 'setProperty' is called with correct parameters");
    });

    QUnit.test("Sets ushellContainerDocked=false when sap ushell container is not docked'", function (assert) {
        // Act
        this.oController._handleUshellContainerDocked("launchpad", "shellFloatingContainerIsUnDocked");

        // Assert
        assert.ok(this.oSetPropertyStub.calledOnce, " The function 'setProperty' is called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/ushellContainerDocked", false], " The function 'setProperty' is called with correct parameters");
    });

    QUnit.module("_hideActionModeButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oSetVisibleStub = sandbox.stub();
            this.oByIdStub = sandbox.stub();
            this.oByIdStub.withArgs("ActionModeBtn").returns({
                setVisible: this.oSetVisibleStub
            });
            sandbox.stub(sap.ui, "getCore").returns({
                byId: this.oByIdStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Hides the button if available", function (assert) {
        // Act
        this.oController._hideActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [false], "setVisible was called with correct args");
    });

    QUnit.test("Does not hide the button if it is not available", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("ActionModeBtn").returns();

        // Act
        this.oController._hideActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 0, "setVisible was not called");
    });

    QUnit.module("_showActionModeButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oSetVisibleStub = sandbox.stub();
            this.oByIdStub = sandbox.stub();
            this.oByIdStub.withArgs("ActionModeBtn").returns({
                setVisible: this.oSetVisibleStub
            });
            sandbox.stub(sap.ui, "getCore").returns({
                byId: this.oByIdStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Shows the button if available", function (assert) {
        // Act
        this.oController._showActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [true], "setVisible was called with correct args");
    });

    QUnit.test("Does not show the button if it is not available", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("ActionModeBtn").returns();

        // Act
        this.oController._showActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 0, "setVisible was not called");
    });

    QUnit.module("_cancelActionMode", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).callsArgWith(1, ActionMode);
            this.oRequireStub.callThrough();

            this.oGetPropertyStub = sandbox.stub();
            this.oController.getView = sandbox.stub().returns({
                getModel: sandbox.stub().withArgs("viewSettings").returns({
                    getProperty: this.oGetPropertyStub
                })
            });
            this.oCancelStub = sandbox.stub(ActionMode, "cancel");
            this.oStartStub = sandbox.stub(ActionMode, "start");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Cancels action mode if its is active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        this.oController._cancelActionMode();

        // Assert
        assert.strictEqual(this.oCancelStub.callCount, 1, "cancel was called once");
    });

    QUnit.test("Does not cancel edit mode if is not active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);

        // Act
        this.oController._cancelActionMode();

        // Assert
        assert.strictEqual(this.oRequireStub.callCount, 0, "require was not called");
        assert.strictEqual(this.oCancelStub.callCount, 0, "cancel was not called");
    });

    QUnit.module("The function _updateVisualizationDisplayFormat", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.sPath = "/pages/2/sections/1/visualizations/3";
            this.oMockEvent = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns(this.sPath)
                    })
                })
            };

            this.oVizData = {
                displayFormatHint: DisplayFormat.Standard
            };
            this.oModelMock = {
                getProperty: sandbox.stub().withArgs(this.sPath).returns(this.oVizData)
            };

            this.oInvisibleMessageMock = {
                announce: sandbox.stub()
            };

            this.oUpdateVisualizationStub = sandbox.stub();
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getPagesService: function () {
                    return Promise.resolve({
                        updateVisualization: this.oUpdateVisualizationStub,
                        getModel: sandbox.stub().returns(this.oModelMock)
                    });
                }.bind(this),
                getInvisibleMessageInstance: sandbox.stub().returns(this.oInvisibleMessageMock)
            });

            this.oShowStub = sandbox.stub(MessageToast, "show");
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Updates the displayFormatHint property using the 'updateVisualization' function of the Pages service", function (assert) {
        // Arrange
        var oExpectedInvisibleMessageArgs = [
            "PageRuntime.Message.TileConverted",
            coreLibrary.InvisibleMessageMode.Polite
        ];

        // Act
        return this.oController._updateVisualizationDisplayFormat(this.oMockEvent, DisplayFormat.Compact).then(function () {
            // Assert
            assert.deepEqual(this.oUpdateVisualizationStub.callCount, 1, "The function 'updateVisualization' was called once.");
            assert.deepEqual(this.oUpdateVisualizationStub.firstCall.args,
                ["2", "1", "3", { displayFormatHint: "compact" }],
                "The function called 'updateVisualization' with the correct page index, section index, visualization index and the correct displayFormat.");
            assert.deepEqual(this.oInvisibleMessageMock.announce.firstCall.args, oExpectedInvisibleMessageArgs, "The invisible message was announced correctly.");
        }.bind(this));

    });

    QUnit.module("The function _confirmSelect", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oVizInstanceToBeMovedContextPath = "/pages/0/sections/1/visualizations/2";

            this.oVizInstance = {
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns(this.oVizInstanceToBeMovedContextPath)
                })
            };

            this.oController._oVizInstanceToBeMoved = this.oVizInstance;

            this.oDialogItemsBinding = { filter: sandbox.stub() };
            this.oEventStub = {
                getSource: sandbox.stub().returns({
                    getBinding: sandbox.stub().withArgs("items").returns(this.oDialogItemsBinding)
                }),
                getParameter: sandbox.stub().withArgs("selectedItem").returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/pages/3/sections/4")
                    })
                })
            };

            this.oSourceSection = {
                getItemPosition: sandbox.stub().withArgs(this.oVizInstance).returns({
                    area: "myArea"
                })
            };

            this.oVisualizations = [this.oVizInstance];

            this.oSection = {
                getVisualizations: sandbox.stub().returns(this.oVisualizations),
                focusVisualization: sandbox.stub()
            };

            this.aSections = [
                { id: "myFirstUnusedSection" },
                { id: "mySecondUnusedSection" },
                { id: "myThirdUnusedSection" },
                { id: "myFourthUnusedSection" },
                this.oSection
            ];

            this.oPage = {
                getSections: sandbox.stub().returns(this.aSections)
            };

            this.oGetAncestorControlStub = sandbox.stub(this.oController, "_getAncestorControl");
            this.oGetAncestorControlStub.withArgs(this.oVizInstance, "sap.ushell.ui.launchpad.Section").returns(this.oSourceSection);
            this.oGetAncestorControlStub.withArgs(this.oVizInstance, "sap.ushell.ui.launchpad.Page").returns(this.oPage);

            this.oMoveVisualizationPromise = Promise.resolve({ visualizationIndex: 0 });

            this.oMoveVisualizationStub = sandbox.stub().returns(this.oMoveVisualizationPromise);
            this.oAnnounceStub = sandbox.stub();

            this.oComponentStub = {
                getPagesService: sandbox.stub().resolves({
                    moveVisualization: this.oMoveVisualizationStub
                }),
                getInvisibleMessageInstance: sandbox.stub().returns({
                    announce: this.oAnnounceStub
                })
            };

            sandbox.stub(this.oController, "getOwnerComponent").returns(this.oComponentStub);

            this.sAnnouncementText = "myText";
            this._getVizMoveAnnouncementStub = sandbox.stub().withArgs("myArea", "myArea").returns(this.sAnnouncementText);

            this.oController._getVizMoveAnnouncement = this._getVizMoveAnnouncementStub;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions with the correct arguments", function (assert) {
        // Act
        return this.oController._confirmSelect(this.oEventStub).then(function () {
            var oFilter = this.oDialogItemsBinding.filter.getCall(0).args[0][0];
            // Assert
            assert.strictEqual(this.oAnnounceStub.callCount, 1, "Announce was called once");
            assert.deepEqual(this.oAnnounceStub.getCall(0).args, [this.sAnnouncementText, coreLibrary.InvisibleMessageMode.Polite]);
            assert.strictEqual(this.oDialogItemsBinding.filter.callCount, 1, "Filter was called once");
            assert.strictEqual(oFilter.oValue1, false, "The filter has the right value1");
            assert.strictEqual(oFilter.sOperator, "EQ", "The filter has the right operator");
            assert.strictEqual(oFilter.sPath, "default", "The filter has the right path");
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, ["0", "1", "2", "4", -1], "moveVisualization was called with the right arguments");
            assert.strictEqual(this.oController._oVizInstanceToBeMoved, null, "vizInstanceToBeMoved is null");
            assert.strictEqual(this.oSection.focusVisualization.callCount, 1, "focusVisualization on the section was called once");
            assert.strictEqual(this.oSection.focusVisualization.getCall(0).args[0], this.oVizInstance, "focusVisualization on the section was called with the right visualization");
        }.bind(this));
    });

    QUnit.module("The function _onMoveTileSearch", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oBinding = {
                filter: sandbox.stub()
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("value").returns("myValue");
            this.oGetParameterStub.withArgs("itemsBinding").returns(this.oBinding);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the right filters", function (assert) {
        // Act
        this.oController._onMoveTileSearch(this.oEvent);

        // Assert
        var aFilters = this.oBinding.filter.getCall(0).args[0];

        assert.strictEqual(this.oBinding.filter.callCount, 1, "Filter was called once");
        assert.strictEqual(aFilters[0].oValue1, "myValue", "The first filter has the right value1");
        assert.strictEqual(aFilters[0].sOperator, "Contains", "The first filter has the right operator");
        assert.strictEqual(aFilters[0].sPath, "title", "The first filter has the right path");

        assert.strictEqual(aFilters[1].oValue1, false, "The second filter has the right value1");
        assert.strictEqual(aFilters[1].sOperator, "EQ", "The second filter has the right operator");
        assert.strictEqual(aFilters[1].sPath, "default", "The second filter has the right path");
    });

    QUnit.module("The function _onMoveTileDialogClose", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oController._oVizInstanceToBeMoved = "SomeThing";

            this.oBinding = {
                filter: sandbox.stub()
            };

            this.oGetBindingStub = sandbox.stub();
            this.oGetBindingStub.withArgs("items").returns(this.oBinding);

            this.oEvent = {
                getSource: sandbox.stub().returns({
                    getBinding: this.oGetBindingStub
                })
            };

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the right filters", function (assert) {
        // Act
        this.oController._onMoveTileDialogClose(this.oEvent);

        // Assert
        var aFilters = this.oBinding.filter.getCall(0).args[0];

        assert.strictEqual(this.oBinding.filter.callCount, 1, "Filter was called once");
        assert.strictEqual(aFilters[0].oValue1, false, "The second filter has the right value1");
        assert.strictEqual(aFilters[0].sOperator, "EQ", "The second filter has the right operator");
        assert.strictEqual(aFilters[0].sPath, "default", "The second filter has the right path");
        assert.strictEqual(this.oController._oVizInstanceToBeMoved, null, "vizInstanceToBeMoved is null");
    });

    QUnit.module("The function _openMoveVisualizationDialog", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oAddDependentStub = sandbox.stub();

            sandbox.stub(this.oController, "getView").returns({
                addDependent: this.oAddDependentStub
            });

            this.oVizInstance = {
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/pages/3/sections/4")
                })
            };

            this.oDialogStub = {
                open: sandbox.stub(),
                bindObject: sandbox.stub()
            };

            this.oLoadStub = sandbox.stub().returns({
                then: sandbox.stub().callsArgWith(0, this.oDialogStub)
            });

            this.oFragment = {
                load: this.oLoadStub
            };

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ui/core/Fragment"], sinon.match.any).callsArgWith(1, this.oFragment);
            this.oRequireStub.callThrough();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Opens the dialog and calls the right functions if _oMoveVisualizationDialog is not set", function (assert) {
        // Arrange
        var oExpectedLoadArgs = {
            name: "sap.ushell.components.pages.MoveVisualization",
            controller: this.oController
        };
        var oExpectedBindingObject = { path: "/pages/3/sections" };

        // Act
        this.oController._openMoveVisualizationDialog({}, this.oVizInstance);

        // Assert
        assert.strictEqual(this.oDialogStub.open.callCount, 1, "open was called once");
        assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once");
        assert.strictEqual(this.oAddDependentStub.getCall(0).args[0], this.oDialogStub, "addDependent was called with the right arg");
        assert.strictEqual(this.oController._oVizInstanceToBeMoved, this.oVizInstance, "vizInstanceToBeMoved was set correctly");
        assert.strictEqual(this.oLoadStub.callCount, 1, "load was called once");
        assert.deepEqual(this.oLoadStub.getCall(0).args[0], oExpectedLoadArgs, "load was called with the right args");
        assert.strictEqual(this.oController._oMoveVisualizationDialog, this.oDialogStub, "the right dialog was set");
        assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once");
        assert.strictEqual(this.oAddDependentStub.getCall(0).args[0], this.oDialogStub, "addDependent was called with the right arg");
        assert.strictEqual(this.oDialogStub.bindObject.callCount, 1, "bindObject was called once");
        assert.deepEqual(this.oDialogStub.bindObject.getCall(0).args[0], oExpectedBindingObject, "bindObject was called with the right arg");
    });

    QUnit.test("Opens the dialog and calls the right functions if _oMoveVisualizationDialog is set", function (assert) {
        // Arrange
        this.oController._oMoveVisualizationDialog = this.oDialogStub;
        var oExpectedBindingObject = { path: "/pages/3/sections" };

        // Act
        this.oController._openMoveVisualizationDialog({}, this.oVizInstance);

        // Assert
        assert.strictEqual(this.oDialogStub.open.callCount, 1, "open was called once");
        assert.strictEqual(this.oAddDependentStub.callCount, 0, "addDependent was not called");
        assert.strictEqual(this.oController._oVizInstanceToBeMoved, this.oVizInstance, "vizInstanceToBeMoved was set correctly");
        assert.strictEqual(this.oLoadStub.callCount, 0, "load was not called");
        assert.strictEqual(this.oAddDependentStub.callCount, 0, "addDependent was not called");
        assert.strictEqual(this.oDialogStub.bindObject.callCount, 1, "bindObject was called once");
        assert.deepEqual(this.oDialogStub.bindObject.getCall(0).args[0], oExpectedBindingObject, "bindObject was called with the right arg");
    });

    QUnit.module("The function _onPageComponentNavigation", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oController.bIsHomeIntentRootIntent = true;
            this.oOpenFLPPage = sandbox.stub(this.oController, "_openFLPPage");

            this.sActionButtonId = "ActionModeBtn";

            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs(this.sActionButtonId).returns({
                getId: sandbox.stub().returns(this.sActionButtonId)
            });

            this.oShowActionButtonStub = sandbox.stub();
            this.oShowHeaderEndItemStub = sandbox.stub();
            this.oGetShellConfigStub = sandbox.stub().returns({
                moveEditHomePageActionToShellHeader: false
            });
            this.oGetRendererStub = sandbox.stub();
            this.oGetRendererStub.withArgs("fiori2").returns({
                showActionButton: this.oShowActionButtonStub,
                showHeaderEndItem: this.oShowHeaderEndItemStub,
                getShellConfig: this.oGetShellConfigStub
            });
            ObjectPath.set("ushell.Container.getRenderer", this.oGetRendererStub, sap);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Don't update visibility if home page is root intent", function (assert) {
        // Act
        this.oController._onPageComponentNavigation();

        // Assert
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "oOpenFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called");
    });

    QUnit.test("Don't update visibility when control was not found", function (assert) {
        // Arrange
        this.oByIdStub.withArgs(this.sActionButtonId).returns(null);

        // Act
        this.oController._onPageComponentNavigation();

        // Assert
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "oOpenFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called");
    });

    QUnit.test("update visibility of the header item if home page is not root intent and the button is in the header", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });

        // Act
        this.oController._onPageComponentNavigation();

        // Assert
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "oOpenFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called once");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [this.sActionButtonId, true], "showHeaderEndItem was called with correct parameters");
    });

    QUnit.test("update visibility of the user action item if home page is not root intent and the button is in the user menu", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;

        // Act
        this.oController._onPageComponentNavigation();

        // Assert
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "oOpenFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 1, "showActionButton was not called");
        assert.deepEqual(this.oShowActionButtonStub.getCall(0).args, [this.sActionButtonId, true], "showHeaderEndItem was called with correct parameters");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was called once");
    });
});
