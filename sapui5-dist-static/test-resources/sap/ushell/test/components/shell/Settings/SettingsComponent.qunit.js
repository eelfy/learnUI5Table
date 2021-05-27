// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Settings.Components
 *
 */
sap.ui.require([
    "sap/ui/core/Component",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/services/Container",
    "sap/ushell/Config"
], function (Component, JSONModel, Container, Config) {
    "use strict";
    /*global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("Settings ShellHeader button", {

        beforeEach: function () {
            this.oSettingsComponent = null;
            Config.emit("/core/shell/model/enableNotifications", false);
            this.oUsageAnalyticsServiceStub = {
                systemEnabled: sandbox.stub().returns(false),
                isSetUsageAnalyticsPermitted: sandbox.stub()
            };
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("UsageAnalytics").returns(Promise.resolve(this.oUsageAnalyticsServiceStub));
            this.oShellConfigStub = sandbox.stub();
            this.oAddHeaderEndItemStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub,
                getRenderer: function () {
                    return {
                        getShellConfig: this.oShellConfigStub,
                        reorderUserPrefEntries: sandbox.stub().returns([]),
                        oShellModel: {
                            addHeaderEndItem: this.oAddHeaderEndItemStub
                        }
                    };
                }.bind(this),
                getUser: sandbox.stub().returns({
                    getFullName: sandbox.stub()
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
            if (this.oSettingsComponent) {
                this.oSettingsComponent.destroy();
            }
        }
    });

    QUnit.test("create shell button if button is moved to header", function (assert) {
        var fnDone = assert.async();
        this.oShellConfigStub.returns({
            moveUserSettingsActionToShellHeader: true,
            enableSearch: false
        });
        Component.create({
            id: "sap-ushell-components-Settings-component",
            name: "sap.ushell.components.shell.Settings",
            componentData: {}
        }).then(function (oSettingsComponent) {
            this.oSettingsComponent = oSettingsComponent;
            assert.ok(sap.ui.getCore().byId("userSettingsBtn"), "button was created");
            assert.ok(this.oAddHeaderEndItemStub.calledOnce, "addHeaderEndItem was called");
            fnDone();
        }.bind(this));
    });

    QUnit.test("don't create button if the button is not moved", function (assert) {
        var fnDone = assert.async();
        this.oShellConfigStub.returns({
            moveUserSettingsActionToShellHeader: false,
            enableSearch: false
        });
        Component.create({
            id: "sap-ushell-components-Settings-component",
            name: "sap.ushell.components.shell.Settings",
            componentData: {}
        }).then(function (oSettingsComponent) {
            this.oSettingsComponent = oSettingsComponent;
            assert.notOk(sap.ui.getCore().byId("userSettingsBtn"), "button was not created");
            assert.ok(this.oAddHeaderEndItemStub.notCalled, "addHeaderEndItem was not called");
            fnDone();
        }.bind(this));
    });

});
