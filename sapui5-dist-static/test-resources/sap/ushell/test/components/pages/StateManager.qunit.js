// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.StateManager
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/StateManager",
    "sap/ushell/EventHub"
], function (oStateManager, EventHub) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.start();
    QUnit.module("The function init", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sinon.stub();
            sap.ushell = {
                Container: {
                    getServiceAsync: this.oGetServiceAsyncStub
                }
            };
            this.oAttachNavigateStub = sinon.stub();

            this.pagesRuntimeNavContainer = {
                id: "pagesRuntime",
                attachNavigate: this.oAttachNavigateStub
            };
            this.pagesNavContainer = {
                id: "pages",
                attachNavigate: this.oAttachNavigateStub
            };
            this.oEventBusSubscribeStub = sinon.stub(sap.ui.getCore().getEventBus(), "subscribe");
            this.oAddEventListenerStub = sinon.stub(document, "addEventListener");

            this.oEventHubDoStub = sinon.stub();
            this.oEventHubOnceStub = sinon.stub(EventHub, "once");
            this.oEventHubOnceStub.returns({
                do: this.oEventHubDoStub
            });

            this.oSetCurrentPageVisibilityStub = sinon.stub(oStateManager, "_setCurrentPageVisibility");

            // Act
            oStateManager.init(this.pagesRuntimeNavContainer, this.pagesNavContainer);
        },
        afterEach: function () {
            this.oAddEventListenerStub.restore();
            this.oEventBusSubscribeStub.restore();
            this.oEventHubOnceStub.restore();
            this.oSetCurrentPageVisibilityStub.restore();
        }
    });

    QUnit.test("Sets the pagesRuntimeNavContainer & pagesNavContainer correctly", function (assert) {
        // Assert
        assert.strictEqual(oStateManager.oPagesRuntimeNavContainer, this.pagesRuntimeNavContainer, "The pagesRuntimeNavContainer is set correctly");
        assert.strictEqual(oStateManager.oPagesNavContainer, this.pagesNavContainer, "The pagesNavContainer is set correctly");
    });

    QUnit.test("Gets the URL parsing service asynchronously", function (assert) {
        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The method getServiceAsync is called once.");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["URLParsing"], "The method getServiceAsync is called with 'URLParsing'.");
    });

    QUnit.test("Adds listeners for visibility handling", function (assert) {
        // Assert
        assert.ok(this.oAddEventListenerStub.calledOnce, "The function addEventListener is called once.");
        assert.strictEqual(this.oAddEventListenerStub.getCall(0).args[0], "visibilitychange", "The function addEventListener is called with correct parameters.");
        assert.strictEqual(this.oAttachNavigateStub.callCount, 2, "The function attachNavigate is called twice.");
        assert.strictEqual(this.oEventBusSubscribeStub.callCount, 2, "The function subscribe is called twice.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[0], "launchpad", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[1], "setConnectionToServer", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[0], "sap.ushell", "The function subscribe is called with correct parameters.");
        assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[1], "navigated", "The function subscribe is called with correct parameters.");
    });

    QUnit.test("Initializes the first page with true", function (assert) {
        // Arrange
        var fnHandler = this.oEventHubDoStub.getCall(0).args[0];
        // Act
        fnHandler();
        // Assert
        assert.deepEqual(this.oEventHubOnceStub.getCall(0).args, ["PagesRuntimeRendered"], "StateManager listened to the correct event");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true], "the current page was set to active");
    });

    QUnit.module("The function _onEnableRequests", {
        beforeEach: function () {
            this.oSetCurrentPageVisibilityStub = sinon.stub(oStateManager, "_setCurrentPageVisibility");
        },
        afterEach: function () {
            this.oSetCurrentPageVisibilityStub.restore();
        }
    });

    QUnit.test("Calls _setCurrentPageVisibility with correct parameters when the event data is { active : true }", function (assert) {
        // Act
        oStateManager._onEnableRequests("channel", "event", {active: true});

        // Assert
        assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true], "The function _setCurrentPageVisibility is called with [true].");
    });

    QUnit.test("Calls _setCurrentPageVisibility with correct parameters when the event data is { active : false }", function (assert) {
        // Act
        oStateManager._onEnableRequests("channel", "event", {active: false});

        // Assert
        assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [false], "The function _setCurrentPageVisibility is called with [false].");
    });

    QUnit.test("Does not call _setCurrentPageVisibility when the event data is invalid", function (assert) {
        // Act
        oStateManager._onEnableRequests("channel", "event", {});

        // Assert
        assert.strictEqual(this.oSetCurrentPageVisibilityStub.callCount, 0, "The function _setCurrentPageVisibility is not called.");
    });

    QUnit.module("The function _onShellNavigated", {
        beforeEach: function () {
            this.oGetHashStub = sinon.stub();
            window.hasher = {
                getHash: this.oGetHashStub
            };
            this.oParseShellHashStub = sinon.stub();
            oStateManager._oURLParsingService = Promise.resolve({
                parseShellHash: this.oParseShellHashStub
            });
            this.oSetCurrentPageVisibilityStub = sinon.stub(oStateManager, "_setCurrentPageVisibility");
        },
        afterEach: function () {
            this.oSetCurrentPageVisibilityStub.restore();
            delete window.hasher;
        }
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is Shell-home", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.withArgs("Shell-home").returns({
            semanticObject: "Shell",
            action: "home"
        });

        // Act
        return oStateManager._onShellNavigated().then(function () {
            // Assert
            assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
            assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true, true], "The function _setCurrentPageVisibility is called with [true, true].");
        }.bind(this));
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Launchpad-openFLPPage");
        this.oParseShellHashStub.withArgs("Launchpad-openFLPPage").returns({
            semanticObject: "Launchpad",
            action: "openFLPPage"
        });

        // Act
        return oStateManager._onShellNavigated().then(function () {
            // Assert
            assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
            assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true, true], "The function _setCurrentPageVisibility is called with [true, true].");
        }.bind(this));
    });

    QUnit.test("Sets the correct page visibility of the current page when the intent is not Launchpad-openFLPPage or Shell-home", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-appFinder");
        this.oParseShellHashStub.withArgs("Shell-appFinder").returns({
            semanticObject: "Shell",
            action: "appFinder"
        });

        // Act
        return oStateManager._onShellNavigated().then(function () {
            // Assert
            assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
            assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [false, false], "The function _setCurrentPageVisibility is called with [false, false].");
        }.bind(this));
    });

    QUnit.module("The function _onTabNavigated", {
        beforeEach: function () {
            this.oGetHashStub = sinon.stub();
            window.hasher = {
                getHash: this.oGetHashStub
            };
            this.oParseShellHashStub = sinon.stub();
            oStateManager._oURLParsingService = Promise.resolve({
                parseShellHash: this.oParseShellHashStub
            });
            this.oSetCurrentPageVisibilityStub = sinon.stub(oStateManager, "_setCurrentPageVisibility");
        },
        afterEach: function () {
            this.oSetCurrentPageVisibilityStub.restore();
            delete window.hasher;
        }
    });

    QUnit.test("Sets the visibility of the current page to when the tab is switched and the intent is Shell-home", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-home");
        this.oParseShellHashStub.withArgs("Shell-home").returns({
            semanticObject: "Shell",
            action: "home"
        });

        // Act
        return oStateManager._onTabNavigated().then(function () {
            // Assert
            assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        }.bind(this));
    });

    QUnit.test("Sets the visibility of the current page to when the tab is switched and the intent is Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Launchpad-openFLPPage");
        this.oParseShellHashStub.withArgs("Launchpad-openFLPPage").returns({
            semanticObject: "Launchpad",
            action: "openFLPPage"
        });

        // Act
        return oStateManager._onTabNavigated().then(function () {
            // Assert
            assert.ok(this.oSetCurrentPageVisibilityStub.calledOnce, "The function _setCurrentPageVisibility is called once.");
        }.bind(this));
    });

    QUnit.test("Does not set the visibility of the current page to when the tab is switched and the intent is not Launchpad-openFLPPage or Shell-home", function (assert) {
        // Arrange
        this.oGetHashStub.returns("Shell-appFinder");
        this.oParseShellHashStub.withArgs("Shell-appFinder").returns({
            semanticObject: "Shell",
            action: "appFinder"
        });

        // Act
        return oStateManager._onTabNavigated().then(function () {
            // Assert
            assert.strictEqual(this.oSetCurrentPageVisibilityStub.callCount, 0, "The function _setCurrentPageVisibility is not called.");
        }.bind(this));
    });

    QUnit.module("The function exit", {
        beforeEach: function () {
            this.oEventBusUnsubscribeStub = sinon.stub();
            oStateManager.oEventBus = {
                unsubscribe: this.oEventBusUnsubscribeStub
            };
            this.oRemoveEventListenerStub = sinon.stub(document, "removeEventListener");
            this.oDetachNavigateStub = sinon.stub();
            oStateManager.oPagesNavContainer = {
                detachNavigate: this.oDetachNavigateStub
            };
            oStateManager.oPagesRuntimeNavContainer = {
                detachNavigate: this.oDetachNavigateStub
            };
            this.oEventHubOffStub = sinon.stub();
            oStateManager.oEventHubListener = {
                off: this.oEventHubOffStub
            };
        },
        afterEach: function () {
            this.oRemoveEventListenerStub.restore();
        }
    });

    QUnit.test("Unsubscribes the events sap.ushell.navigated and launchpad/setConnectionToServer", function (assert) {
        // Act
        oStateManager.exit();

        // Assert
        assert.strictEqual(this.oEventBusUnsubscribeStub.callCount, 2, "The function 'unsubscribe' was called twice.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[0], "sap.ushell", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[1], "navigated", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[1], "setConnectionToServer", "The function 'unsubscribe' was called with correct parameters.");
    });

    QUnit.test("Removes visibilitychange listener", function (assert) {
        // Act
        oStateManager.exit();

        // Assert
        assert.strictEqual(this.oDetachNavigateStub.callCount, 2, "The function 'detachNavigate' was called twice.");
    });

    QUnit.test("Detaches navContainer navigate handler", function (assert) {
        // Act
        oStateManager.exit();

        // Assert
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 1, "The function 'removeEventListener' was called.");
        assert.deepEqual(this.oRemoveEventListenerStub.getCall(0).args, ["visibilitychange", oStateManager._onTabNavigatedBind], "The function 'removeEventListener' was called with correct parameters.");
    });

    QUnit.test("Removed EventHub listener", function (assert) {
        // Act
        oStateManager.exit();

        // Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "The function 'off' was called.");
        assert.deepEqual(this.oEventHubOffStub.getCall(0).args, [], "The function 'off' was called with correct parameters.");
    });

    QUnit.module("The function _onPageNavigated", {
        beforeEach: function () {
            this.oSetPageVisibilityStub = sinon.stub(oStateManager, "_setPageVisibility");
        },
        afterEach: function () {
            this.oSetPageVisibilityStub.restore();
        }
    });

    QUnit.test("Sets the visibility of the current page to true and the previous page to false", function (assert) {
        // Arrange
        var oEvent = {
            getParameters: sinon.stub().returns({
                from: "previousPage",
                to: "currentPage"
            })
        };

        // Act
        oStateManager._onPageNavigated(oEvent);

        // Assert
        assert.strictEqual(this.oSetPageVisibilityStub.callCount, 2, "The function _setPageVisibility is called twice.");
        assert.deepEqual(this.oSetPageVisibilityStub.getCall(0).args, ["previousPage", false, false], "The function _setPageVisibility is called with correct parameters.");
        assert.deepEqual(this.oSetPageVisibilityStub.getCall(1).args, ["currentPage", true, true], "The function _setPageVisibility is called with correct parameters.");
    });

    QUnit.module("The function _onErrorPageNavigated", {
        beforeEach: function () {
            this.oSetCurrentPageVisibilityStub = sinon.stub(oStateManager, "_setCurrentPageVisibility");
            this.oIsAStub = sinon.stub();
            this.oEvent = {
                getParameter: sinon.stub().returns({
                    isA: this.oIsAStub
                })
            };
        },
        afterEach: function () {
            this.oSetCurrentPageVisibilityStub.restore();
        }
    });

    QUnit.test("Sets the current page to visible when it is the target page", function (assert) {
        // Arrange
        this.oIsAStub.returns(false);
        // Act
        oStateManager._onErrorPageNavigated(this.oEvent);

        // Assert
        assert.strictEqual(this.oSetCurrentPageVisibilityStub.callCount, 1, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [true, undefined, true], "The function _setCurrentPageVisibility is called with correct parameters.");
    });

    QUnit.test("Sets the current page to invisible when it is the source page", function (assert) {
        // Arrange
        this.oIsAStub.returns(true);

        // Act
        oStateManager._onErrorPageNavigated(this.oEvent);

        // Assert
        assert.strictEqual(this.oSetCurrentPageVisibilityStub.callCount, 1, "The function _setCurrentPageVisibility is called once.");
        assert.deepEqual(this.oSetCurrentPageVisibilityStub.getCall(0).args, [false, undefined, true], "The function _setCurrentPageVisibility is called with correct parameters.");
    });

    QUnit.module("The function _setCurrentPageVisibility", {
        beforeEach: function () {
            this.oIsAStub = sinon.stub();
            this.oPage = {
                isA: this.oIsAStub
            };
            this.oGetCurrentPageStub = sinon.stub().returns(this.oPage);
            oStateManager.oPagesNavContainer = {
                getCurrentPage: this.oGetCurrentPageStub
            };
            oStateManager.oPagesRuntimeNavContainer = {
                getCurrentPage: this.oGetCurrentPageStub
            };
            this.oSetPageVisibilityStub = sinon.stub(oStateManager, "_setPageVisibility");
        },
        afterEach: function () {
            this.oSetPageVisibilityStub.restore();
        }
    });

    QUnit.test("Sets the visibility of the current page", function (assert) {
        // Arrange
        var bVisible = false;
        var bRefresh = true;

        // Act
        oStateManager._setCurrentPageVisibility(bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oGetCurrentPageStub.callCount, 2, "The function getCurrentStub is called twice.");
        assert.strictEqual(this.oSetPageVisibilityStub.callCount, 1, "The function _setPageVisibility is called once.");
        assert.strictEqual(this.oIsAStub.callCount, 1, "The function isA is called once.");
        assert.deepEqual(this.oIsAStub.getCall(0).args, ["sap.m.MessagePage"], "The function isA is called with correct parameters.");
        assert.deepEqual(this.oSetPageVisibilityStub.getCall(0).args, [this.oPage, bVisible, bRefresh], "The function _setPageVisibility is called with correct parameters.");
    });

    QUnit.module("The function _setPageVisibility", {
        beforeEach: function () {
            oStateManager.oPagesVisibility = {};
            this.oSetActiveStub = sinon.stub();
            this.oGetVisualizationsStub = sinon.stub().returns([{
                setActive: this.oSetActiveStub
            }]);
            this.oGetPathStub = sandbox.stub();
            this.oGetPathStub.returns("/pages/0");
            this.oPage = {
                getContent: function () {
                    return [{
                        getSections: function () {
                            return [{
                                getVisualizations: this.oGetVisualizationsStub
                            }];
                        }.bind(this)
                    }];
                }.bind(this),
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                })
            };
        },
        afterEach: function () {}
    });

    QUnit.test("Does not set the visibility & refresh of an empty page", function (assert) {
        // Act
        oStateManager._setPageVisibility();

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 0, "The function setActive is not called.");
    });

    QUnit.test("Sets the visibility & refresh of the current page", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;

        // Act
        oStateManager._setPageVisibility(this.oPage, bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 1, "The function setActive is called once.");
        assert.deepEqual(this.oSetActiveStub.getCall(0).args, [bVisible, bRefresh], "The function setActive is called with correct parameters.");
    });

    QUnit.test("Calls setActive only if the control has access to the function", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;
        this.oGetVisualizationsStub.returns([]);

        // Act
        oStateManager._setPageVisibility(this.oPage, bVisible, bRefresh);

        // Assert
        assert.strictEqual(this.oSetActiveStub.callCount, 0, "The function setActive is never called.");
    });

    QUnit.test("Saves the page visibility", function (assert) {
        // Arrange
        var bVisible = true;
        var bRefresh = false;
        var oExpectedResult = {
            "/pages/0": true
        };

        // Act
        oStateManager._setPageVisibility(this.oPage, bVisible, bRefresh);
        // Assert
        assert.deepEqual(oStateManager.oPagesVisibility, oExpectedResult, "Saved the correct pages");
    });

    QUnit.module("The function getPageVisibility", {
        beforeEach: function () {
            oStateManager.oPagesVisibility = {};
        },
        afterEach: function () {}
    });

    QUnit.test("Returns the page visibility", function (assert) {
        // Arrange
        oStateManager.oPagesVisibility = {
            "/pages/1": true
        };
        // Act
        var bResult = oStateManager.getPageVisibility("/pages/1");
        // Assert
        assert.strictEqual(bResult, true, "returned the correct result");
    });

});
