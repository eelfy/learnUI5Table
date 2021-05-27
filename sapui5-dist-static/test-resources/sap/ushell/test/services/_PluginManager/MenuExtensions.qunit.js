// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._PluginManager.MenuExtensions
 */
sap.ui.require([
    "sap/ushell/services/_PluginManager/MenuExtensions",
    "sap/ushell/EventHub"
], function (fnMenuExtensions) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.services._PluginManager.MenuExtensions", {
        beforeEach: function () {
            if (!sap.ushell) { sap.ushell = {}; }
            if (!sap.ushell.Container) {
                sap.ushell.Container = {
                    getServiceAsync: function () {}
                };
            }

            this.oGetEntryProviderStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub(sap.ushell.Container, "getServiceAsync").returns(Promise.resolve({
                getEntryProvider: this.oGetEntryProviderStub
            }));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("MenuExtensions: getMenuEntryProvider", function (assert) {
        // Arrange
        var oMenuExtensions = fnMenuExtensions("test-plugin");
        // Act
        return oMenuExtensions.getMenuEntryProvider(["test-node"]).then(function () {
            // Assert
            assert.ok(this.oGetEntryProviderStub.calledOnce, "getMenuEntryProvider was called once.");
            assert.ok(this.oGetEntryProviderStub.calledWith("test-plugin", ["test-node"]), "getMenuEntryProvider was called with the expected arguments.");
        }.bind(this));
    });
});
