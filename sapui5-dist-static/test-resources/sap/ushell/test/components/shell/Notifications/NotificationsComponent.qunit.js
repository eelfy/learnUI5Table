// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Components
 *
 */
sap.ui.require([
    "sap/ui/core/Component",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/services/Container",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (Component, JSONModel, Container, Config, ShellHeadItem) {
    "use strict";
    /*global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.renderers.fiori2.notifications.Notifications, Fiori 3 tests", {

        beforeEach: function () {
            window["sap-ushell-config"] = {
                "services": {
                    "Notifications": {
                        config: {
                            enabled: true
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "enableNotificationsUI": true,
                                "applications": {
                                    "Shell-home": {}
                                },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
        },
        afterEach: function () {
            // delete Container; will not work have to use delete sap.ushell.Container;
            delete sap.ushell.Container;
        }
    });
    var createRenderer = function () {
        sap.ushell.Container.getRenderer = function () {
            return {
                getModelConfiguration: function () {
                    return {
                        enableNotificationsUI: true
                    };
                },
                getShellConfig: function () {
                    return {
                        enableNotificationsUI: false
                    };
                },
                addShellDanglingControl: function () {
                },
                oShellModel: {
                    getModel: function () {
                        return {
                            getProperty: function () {
                                return 10;
                            },
                            setProperty: function () {
                            }
                        };
                    }
                },
                shellCtrl: {
                    getModel: function () {
                        return {
                            setProperty: function () {
                            }
                        };
                    }
                }
            };
        };
    };

    QUnit.test("Notification count is preset correctly", function (assert) {
        var done = assert.async();
        // arrange


        sap.ushell.bootstrap("local").then(function () {
            this.oService = sap.ushell.Container.getService("Notifications");
            this.init = sinon.stub(this.oService, "init").returns({
                fail: function () {
                },
                done: function () {
                }
            });
            createRenderer();
            var oNotificationCountButton = new ShellHeadItem("NotificationsCountButton");

            // act
            var oComponent = sap.ui.component({
                id: "sap-ushell-components-Notifications-component",
                name: "sap.ushell.components.shell.Notifications",
                componentData: {}
            });
            assert.equal(!!oComponent, true, "Notification component created");
            var oModel = sap.ushell.Container.getRenderer().oShellModel.getModel();
                assert.equal(oModel.getProperty("/notificationsCount"), 10, "expected Notification count returned");

            // clean up
            oNotificationCountButton.destroy();
            oComponent.destroy();

            done();
        });
    });

    QUnit.module("Notification ShellHeader button", {

        beforeEach: function () {
            this.oNotificationServiceStub = {
                isEnabled: sandbox.stub().returns(true),
                init: sandbox.stub(),
                registerDependencyNotificationsUpdateCallback: sandbox.stub(),
                destroy: sandbox.stub()
            };
            this.oShellModel = new JSONModel({});
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Notifications").returns(Promise.resolve(this.oNotificationServiceStub));
            this.oAddHeaderEndItemStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub,
                getRenderer: function () {
                    return {
                        getShellConfig: sandbox.stub().returns({
                            rootIntent: "Shell-home"
                        }),
                        shellCtrl: {
                            getModel: sandbox.stub().returns(this.oShellModel)
                        },
                        oShellModel: {
                            addHeaderEndItem: this.oAddHeaderEndItemStub
                        },
                        hideHeaderEndItem: sandbox.stub()
                    };
                }.bind(this)
            };
            this.oNotificationComponent = null;
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
            this.oNotificationComponent.destroy();
        }
    });

    QUnit.test("create shell button when server is enabled", function (assert) {
        var fnDone = assert.async();
        // arrange

        // act
        Component.create({
            id: "sap-ushell-components-Notifications-component",
            name: "sap.ushell.components.shell.Notifications",
            componentData: {}
          }).then(function (oNotificationComponent) {
            this.oNotificationComponent = oNotificationComponent;
            assert.ok(sap.ui.getCore().byId("NotificationsCountButton"), "button was created");
            assert.ok(this.oAddHeaderEndItemStub.calledOnce, "button was added");
            assert.deepEqual(this.oAddHeaderEndItemStub.getCall(0).args,
                [["NotificationsCountButton"], false, ["home", "app", "minimal"], true],
                "addHeaderEndItem called with correct parameters");
            fnDone();
          }.bind(this));
    });

    QUnit.test("Don't create a button if notification service is disabled", function (assert) {
        var fnDone = assert.async();
        // arrange
        this.oNotificationServiceStub.isEnabled.returns(false);
        // act
        Component.create({
            id: "sap-ushell-components-Notifications-component1",
            name: "sap.ushell.components.shell.Notifications",
            componentData: {}
          }).then(function (oNotificationComponent) {
            this.oNotificationComponent = oNotificationComponent;
            assert.notOk(sap.ui.getCore().byId("NotificationsCountButton"), "button was not created");
            assert.ok(this.oAddHeaderEndItemStub.notCalled, "button was added");
            fnDone();
          }.bind(this));
    });


});


