// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.MenuBar.Component
 */
sap.ui.require([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/MenuBar/Component",
    "sap/ushell/Config"
], function (UIComponent, JSONModel, MenuBarComponent, Config) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function init", {
        beforeEach: function () {
            this.bIsEnabledMock = true;
            this.oMenuModel = new JSONModel([
                {
                    id: 1
                }
            ]);

            this.oInitStub = sandbox.spy(UIComponent.prototype, "init");

            this.oSetComponentStub = sandbox.stub();
            this.oSetVisibleStub = sandbox.stub();
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("menuBarComponentContainer").returns({
                setComponent: this.oSetComponentStub,
                setVisible: this.oSetVisibleStub
            });

            this.oLastStub = sandbox.stub(Config, "last");

            this.oIsMenuEnabledStub = sandbox.stub().resolves();
            this.oGetMenuModelStub = sandbox.stub().resolves(this.oMenuModel);
            this.oMenuServiceMock = {
                isMenuEnabled: this.oIsMenuEnabledStub,
                getMenuModel: this.oGetMenuModelStub
            };
            this.oMenuServiceResultThen = sandbox.stub();
            this.oMenuServiceResultThen.yields([this.bIsEnabledMock, this.aMenuEntriesMock]);
            this.oMenuServiceThen = sandbox.stub();
            this.oMenuServiceThen.yields(this.oMenuServiceMock);
            this.oMenuServiceThen.returns({
                then: this.oMenuServiceResultThen
            });

            this.oGetCurrentApplication = sinon.stub();
            this.oAppLifeCycleServiceMock = {
                getCurrentApplication: this.oGetCurrentApplication
            };
            this.oAppLifeCycleServiceThen = sandbox.stub();
            this.oAppLifeCycleServiceThen.yields(this.oAppLifeCycleServiceMock);

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").returns({
                then: this.oMenuServiceThen
            });
            this.oGetServiceAsyncStub.withArgs("AppLifeCycle").returns({
                then: this.oAppLifeCycleServiceThen
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Sets the correct parameters", function (assert) {
        // Arrange
        // Act
        var oComponent = new MenuBarComponent();
        // Assert
        assert.strictEqual(this.oInitStub.callCount, 1, "init was called once");
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 2, "getService was called twice");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "getService was called the first time with correct parameters");
        assert.strictEqual(this.oIsMenuEnabledStub.callCount, 1, "isMenuEnabled was called once");
        assert.strictEqual(this.oGetMenuModelStub.callCount, 1, "getMenuEntries was called once");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("Calls the Menu service correctly", function (assert) {
        // Arrange
        // Act
        var oComponent = new MenuBarComponent();
        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 2, "getService was called twice");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["Menu"], "getService was called the first time with correct parameters");
        assert.strictEqual(this.oIsMenuEnabledStub.callCount, 1, "isMenuEnabled was called once");
        assert.strictEqual(this.oGetMenuModelStub.callCount, 1, "getMenuEntries was called once");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("Handles the data correctly if menuBar is enabled", function (assert) {
        // Arrange
        this.oGetCurrentApplication.returns({
            homePage: false
        });
        // Act
        var oComponent = new MenuBarComponent();
        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "byId was called twice");
        assert.strictEqual(this.oSetComponentStub.callCount, 1, "setComponent was called once");
        assert.deepEqual(this.oSetComponentStub.getCall(0).args, [oComponent], "setComponent was called the first time with correct parameters");
        assert.strictEqual(this.oLastStub.callCount, 1, "last was called once");
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [false], "setComponent was called the first time with correct parameters");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("menuBar is always visible when core/menu/visibleInAllStates === true", function (assert) {
        // Arrange
        this.oLastStub.withArgs("/core/menu/visibleInAllStates").returns(true);
        // Act
        var oComponent = new MenuBarComponent();
        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "byId was called twice");
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [true], "setComponent was called the first time with correct parameters");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("Handles the data correctly if menuBar is disabled", function (assert) {
        // Arrange
        this.oMenuServiceResultThen.yields([false, this.aMenuEntriesMock]);
        this.oGetCurrentApplication.returns({
            homePage: true
        });
        // Act
        var oComponent = new MenuBarComponent();
        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 0, "byId was not called");
        assert.strictEqual(this.oSetComponentStub.callCount, 0, "setComponent was not called");
        assert.strictEqual(this.oGetCurrentApplication.callCount, 1, "getCurrentApplication was called once");
        assert.strictEqual(this.oSetVisibleStub.callCount, 0, "setVisible was not called");
        // Cleanup
        oComponent.destroy();
    });
});