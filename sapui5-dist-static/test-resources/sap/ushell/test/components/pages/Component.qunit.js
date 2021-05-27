// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.Component
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/Component",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/resources",
    "sap/ushell/services/Pages"
], function (PagesComponent, SharedComponentUtils, resources, PagesService) {
    "use strict";

    var sandbox = sinon.createSandbox();

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oToggleUserActivityLogStub = sandbox.stub(SharedComponentUtils, "toggleUserActivityLog");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting");

            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };

            this.oGetServiceAsyncStub = sandbox.stub(sap.ushell.Container, "getServiceAsync");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Toggles user activity log", function (assert) {
        // Act
        new PagesComponent(); // eslint-disable-line no-new

        // Assert
        assert.deepEqual(this.oToggleUserActivityLogStub.callCount, 1, "The function toggleUserActivityLog of the SharedComponentUtils is called once.");
    });

    QUnit.test("Gets the effective homepage settings", function (assert) {
        // Act
        new PagesComponent(); // eslint-disable-line no-new

        // Assert
        assert.deepEqual(this.oGetEffectiveHomepageSettingStub.firstCall.args, ["/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable"], "The function getEffectiveHomepageSetting of the SharedComponentUtils is called with the right parameters.");
    });

    QUnit.test("Sets the i18n model", function (assert) {
        // Act
        var oComponent = new PagesComponent();

        // Assert
        assert.strictEqual(oComponent.getModel("i18n"), resources.i18nModel, "The i18n model is set correctly.");
        oComponent.destroy();
    });

    QUnit.test("Calls the Pages service", function (assert) {
        // Act
        var oComponent = new PagesComponent();

        // Assert
        assert.deepEqual(this.oGetServiceAsyncStub.firstCall.args, ["Pages"]);
        oComponent.destroy();
    });

    QUnit.module("The getInvisibleMessageInstance function", {
        beforeEach: function () {
            this.oToggleUserActivityLogStub = sandbox.stub(SharedComponentUtils, "toggleUserActivityLog");
            this.oGetEffectiveHomepageSettingStub = sandbox.stub(SharedComponentUtils, "getEffectiveHomepageSetting");

            sap.ushell = {
                Container: {
                    getServiceAsync: sandbox.stub()
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the invisibleMessage instance", function (assert) {
        // Arrange
        var oComponent = new PagesComponent();

        // Act
        var oResult = oComponent.getInvisibleMessageInstance();

        // Assert
        assert.strictEqual(oResult.isA("sap.ui.core.InvisibleMessage"), true, "The return object is a invisible message instance.");
        assert.deepEqual(oResult, oComponent._oInvisibleMessageInstance, "The internal invisible message instance is returned.");
        oComponent.destroy();
    });

    QUnit.module("The getComponentData function", {
        beforeEach: function () {
            this.oPagesComponent = new PagesComponent();
        },
        afterEach: function () {
            this.oPagesComponent.destroy();
        }
    });

    QUnit.test("Always returns an empty object", function (assert) {
        // Act
        var oComponentData = this.oPagesComponent.getComponentData();

        // Assert
        assert.deepEqual(oComponentData, {}, "The function getComponentData returns an empty object.");
    });

    QUnit.module("The getPagesService function", {
        beforeEach: function () {
            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };
            this.oMockService = {
                TEST: "SERVICE"
            };

            this.oGetServiceAsyncStub = sandbox.stub(sap.ushell.Container, "getServiceAsync")
                .withArgs("Pages")
                .returns(Promise.resolve(this.oMockService));
            this.oPagesComponent = new PagesComponent();
        },
        afterEach: function () {
            this.oPagesComponent.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns an instance of the pages service", function (assert) {
        // Act
        var oServicePromise = this.oPagesComponent.getPagesService();
        return oServicePromise.then(function (oService) {
            // Assert
            assert.deepEqual(oService, this.oMockService, "The correct service was returned.");
        }.bind(this)).catch(function (e) {
            assert.ok(false, "Calling the service resulted in an error");
        });
    });
});
