// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.ShellAppTitle
 */
sap.ui.require([
    "sap/ui/Device",
    "sap/m/Button",
    "sap/ui/core/IconPool",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/services/Container",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/core/mvc/View",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellNavigationMenu",
    "sap/ui/core/mvc/XMLView"
], function (
    Device,
    Button,
    IconPool,
    AppLifeCycle,
    Container, EventHub,
    Config,
    View,
    JSONModel,
    ShellAppTitle,
    ShellNavigationMenu,
    XMLView) {
    "use strict";

    /* global QUnit, sinon */

    var AppTitleState = sap.ushell.AppTitleState;
    var AllMyAppsState = sap.ushell.AllMyAppsState;

    var sandbox = sinon.createSandbox();

    QUnit.module("The init function");

    QUnit.test("Calls the super class's init function", function (assert) {
        // Arrange
        var oButtonInitStub = sinon.stub(Button.prototype, "init");

        // Act
        var oShellAppTitle = new ShellAppTitle();

        // Assert
        assert.strictEqual(oButtonInitStub.callCount, 1, "The function has been called once.");

        // Cleanup
        oButtonInitStub.restore();
        oShellAppTitle.destroy();
    });

    QUnit.test("Creates an icon instance", function (assert) {
        // Arrange
        var oAddStyleClassStub = sinon.stub();
        var oIconMock = {
            addStyleClass: oAddStyleClassStub,
            destroy: function () {}
        };
        var oCreateIconStub = sinon.stub(IconPool, "createControlByURI").returns(oIconMock);

        // Act
        var oShellAppTitle = new ShellAppTitle();

        // Assert
        assert.strictEqual(oCreateIconStub.callCount, 1, "The function createControlByURI has been called once.");
        assert.strictEqual(oCreateIconStub.firstCall.args[0], "sap-icon://megamenu", "The function has been called with the correct parameter.");
        assert.strictEqual(oAddStyleClassStub.callCount, 1, "The function addStyleClass has been called once.");
        assert.strictEqual(oAddStyleClassStub.firstCall.args[0], "sapUshellAppTitleMenuIcon", "The function has been called with the correct parameter.");
        assert.strictEqual(oShellAppTitle.oIcon, oIconMock, "The property has the correct value.");

        // Cleanup
        oCreateIconStub.restore();
        oShellAppTitle.destroy();
    });

    QUnit.module("The exit function", {
        beforeEach: function () {
            this.oShellAppTitle = new ShellAppTitle();

            this.oByIdStub = sinon.stub(sap.ui.getCore(), "byId");
        },
        afterEach: function () {
            this.oByIdStub.restore();
        }
    });

    QUnit.test("Does not call destroy if no associated navigation menu exists", function (assert) {
        // Arrange
        var oDestroyStub = sinon.stub(ShellNavigationMenu.prototype, "destroy");

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 0, "The destroy function has not been called.");

        // Cleanup
        oDestroyStub.restore();
    });

    QUnit.test("Destroys the associated navigation menu", function (assert) {
        // Arrange
        sinon.stub(this.oShellAppTitle, "getNavigationMenu").returns("NavMenuId");

        var oDestroyStub = sinon.stub();
        var oNavMenuMock = {
            destroy: oDestroyStub
        };
        this.oByIdStub.withArgs("NavMenuId").returns(oNavMenuMock);

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Does not call destroy if no associated AllMyApps view exists", function (assert) {
        // Arrange
        var oDestroyStub = sinon.stub(View.prototype, "destroy");

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 0, "The destroy function has not been called.");

        // Cleanup
        oDestroyStub.restore();
    });

    QUnit.test("Destroys the associated AllMyApps view", function (assert) {
        // Arrange
        sinon.stub(this.oShellAppTitle, "getAllMyApps").returns("AllMyAppsViewId");

        var oDestroyStub = sinon.stub();
        var oViewMock = {
            destroy: oDestroyStub
        };
        this.oByIdStub.withArgs("AllMyAppsViewId").returns(oViewMock);

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(this.oByIdStub.callCount, 2, "The byId function has been called twice.");
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oAllMyAppsPopover", function (assert) {
        // Arrange
        var oDestroyStub = sinon.stub();
        this.oShellAppTitle.oAllMyAppsPopover = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oNavMenuPopover", function (assert) {
        // Arrange
        var oDestroyStub = sinon.stub();
        this.oShellAppTitle.oNavMenuPopover = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.test("Destroys the oIcon", function (assert) {
        // Arrange
        var oDestroyStub = sinon.stub();
        this.oShellAppTitle.oIcon = {
            destroy: oDestroyStub
        };

        // Act
        this.oShellAppTitle.destroy();

        // Assert
        assert.strictEqual(oDestroyStub.callCount, 1, "The destroy function has been called once.");
    });

    QUnit.module("The getControlVisibilityAndState function", {
        beforeEach: function () {
            this.oSetPropertyStub = sandbox.stub();

            this.oShellAppTitle = new ShellAppTitle({ text: "text" });
            sandbox.stub(this.oShellAppTitle, "getModel").returns({ setProperty: this.oSetPropertyStub });
            this.oIsNavMenuEnableStub = sandbox.stub(this.oShellAppTitle, "_isNavMenuEnabled").returns(true);

            return sap.ushell.bootstrap("local").then(function () {
                sandbox.stub(sap.ushell.Container, "getService").callsFake(function (sName) {
                    if (sName === "AllMyApps") {
                        return {
                            isEnabled: function () {
                                return true;
                            }
                        };
                    }
                });
            });
        },
        afterEach: function () {
            sandbox.restore();

            EventHub._reset();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns true if Shell state is home, _isNavMenuEnabled = true, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        Config.emit("/core/shell/model/currentState/stateName", "home");

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is home, 2._isNavMenuEnabled = true, 3.AllMyAppsEnabled = true");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "Model setProperty called once");
        assert.strictEqual(this.oSetPropertyStub.args[0][0], "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
        assert.strictEqual(this.oSetPropertyStub.args[0][1], AppTitleState.ShellNavMenu, "Model property ShellAppTitleState was set to SHELL_NAV_MENU");
    });

    QUnit.test("Returns true if Shell state is minimal and _isNavMenuEnabled = true", function (assert) {
        // Arrange
        Config.emit("/core/shell/model/currentState/stateName", "minimal");

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is minimal, 2._isNavMenuEnabled = true");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "Model setProperty called once");
        assert.strictEqual(this.oSetPropertyStub.args[0][0], "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
        assert.strictEqual(this.oSetPropertyStub.args[0][1], AppTitleState.ShellNavMenuOnly, "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");
    });

    QUnit.test("Returns true if Shell state is app, _isNavMenuEnabled = false, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        this.oIsNavMenuEnableStub.returns(false);
        Config.emit("/core/shell/model/currentState/stateName", "app");

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, true, "bTitleVisible is true when: 1.Shell state is app, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "Model setProperty called once");
        assert.strictEqual(this.oSetPropertyStub.args[0][0], "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
        assert.strictEqual(this.oSetPropertyStub.args[0][1], AppTitleState.AllMyAppsOnly, "Model property ShellAppTitleState was set to ALL_MY_APPS_ONLY");
    });


    QUnit.test("Returns false if Shell state is neither app nor home, _isNavMenuEnabled = false, and AllMyAppsEnabled = true", function (assert) {
        // Arrange
        this.oIsNavMenuEnableStub.returns(false);
        Config.emit("/core/shell/model/currentState/stateName", "minimal");

        // Act
        var bTitleVisible = this.oShellAppTitle._getControlVisibilityAndState();

        // Assert
        assert.strictEqual(bTitleVisible, false, "bTitleVisible is false when: 1.Shell state is  not app|home, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "Model setProperty called once");
        assert.strictEqual(this.oSetPropertyStub.args[0][0], "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
        assert.strictEqual(this.oSetPropertyStub.args[0][1], AppTitleState.ShellNavMenuOnly, "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");
    });

    QUnit.module("Integration test - The function _popoverBackButtonPressHandler", {
        beforeEach: function () {
            this.oShellAppTitle = new ShellAppTitle({ text: "text" });

            var oModel = new JSONModel({
                ShellAppTitleState: AppTitleState.ShellNavMenu
            });

            this.oOrigDeviceSystemPhone = sap.ui.Device.system.phone;
            this.oShellAppTitle.setModel(oModel);

            this.oModelSetPropertyStub = sinon.stub(oModel, "setProperty");

            this.oAllMyAppsPopoverCloseStub = sinon.stub();
            this.oShellAppTitle.oAllMyAppsPopover = {
                close: this.oAllMyAppsPopoverCloseStub,
                destroy: function () {}
            };

            this.oNavMenuPopoverOpenByStub = sinon.stub();
            this.oShellAppTitle.oNavMenuPopover = {
                openBy: this.oNavMenuPopoverOpenByStub,
                destroy: function () {}
            };

            this.oGetCurrentStateStub = sinon.stub().returns(AllMyAppsState.FirstLevel);
            this.oSwitchToInitialStateStub = sinon.stub();
            this.oHandleSwitchToMasterAreaOnPhoneStub = sinon.stub();
            this.oUpdateHeaderButtonsStateStub = sinon.stub();
            sinon.stub(this.oShellAppTitle, "getAllMyAppsController").returns({
                getCurrentState: this.oGetCurrentStateStub,
                switchToInitialState: this.oSwitchToInitialStateStub,
                handleSwitchToMasterAreaOnPhone: this.oHandleSwitchToMasterAreaOnPhoneStub,
                updateHeaderButtonsState: this.oUpdateHeaderButtonsStateStub
            });
        },
        afterEach: function () {
            this.oShellAppTitle.destroy();

            sap.ui.Device.system.phone = this.oOrigDeviceSystemPhone;

            EventHub._reset();
        }
    });

    QUnit.test("Sets the correct AppTitleState and closes all popups if the current state is AllMyApps on the FirstLevel",
        function (assert) {
        // Arrange
        var done = assert.async();
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            // Assert
            assert.strictEqual(this.oModelSetPropertyStub.callCount, 1, "Back from AllMyApps: Model setProperty called");
            assert.strictEqual(
                this.oModelSetPropertyStub.args[0][0],
                "/ShellAppTitleState", "Back from AllMyApps: Model setProperty called for property ShellAppTitleState"
            );
            assert.strictEqual(
                this.oModelSetPropertyStub.args[0][1],
                AppTitleState.ShellNavMenu,
                "Back from AllMyApps: Model setProperty called for setting ShellAppTitleStat to SHELL_NAV_MENU"
            );
            assert.strictEqual(this.oAllMyAppsPopoverCloseStub.callCount, 1, "Back from AllMyApps: AllMyApps Popover Close called");
            assert.strictEqual(this.oNavMenuPopoverOpenByStub.callCount, 1, "Back from AllMyApps: NavMenu Popover Open called");
        }.bind(this)).finally(done);
    });

    QUnit.test("Calls switchToInitialState if the current state is SecondLevel", function (assert) {
        // Arrange
        this.oGetCurrentStateStub.returns(AllMyAppsState.SecondLevel);
        var done = assert.async();
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            // Assert
            assert.strictEqual(this.oSwitchToInitialStateStub.callCount, 1, "Back from SecondLevel: SwitchToInitialState called");

        }.bind(this)).finally(done);

    });

    QUnit.test("Calls handleSwitchToMasterAreaOnPhone on a phone device from Details state", function (assert) {
        // Arrange
        this.oGetCurrentStateStub.returns(AllMyAppsState.Details);
        sap.ui.Device.system.phone = true;

        var done = assert.async();
        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            this.oShellAppTitle.setAllMyApps(view);
            // Act
            this.oShellAppTitle._popoverBackButtonPressHandler();
            // Assert
            assert.strictEqual(
                this.oHandleSwitchToMasterAreaOnPhoneStub.callCount,
                1,
                "Back from Details state on Phone: handleSwitchToMasterAreaOnPhone called"
            );

        }.bind(this)).finally(done);
    });

    QUnit.module("sap.ushell.ui.shell.ShellAppTitle", {
        afterEach: function () {
            EventHub._reset();
        }
    });

    QUnit.test("Renderer Test", function (assert) {
        jQuery.sap.getObject("sap-ushell-config", 0).renderers = {
            fiori2: {
                componentData: {
                    config: {
                        rootIntent: "Shell-home"
                    }
                }
            }
        };

        var fnDone = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var shell = sap.ui.getCore().byId("shell"),
                oShellHeader = shell.getHeader(),
                oAppTitle = oShellHeader.getAppTitle(),
                // prepare event data to simulate ShellUIService callback on the shell-controller for setting title
                sNavMenu,
                oNavMenu,
                oHierarchyItem,
                expectedRes,
                oRelatedAppMiniTile;

            EventHub.emit("CoreResourcesComplementLoaded");

            // To avoid problems with the Scheduler, we need to fake the loading of MessagePopoverInit
            // which normally would be triggered by the shell.controller
            EventHub.on("StepDone").do(function (sStepName) {
                if (sStepName === "UsageAnalytics") {
                    EventHub.emit("StepDone", "MessagePopoverInit");
                }
            });

            EventHub.join(
                // need to wait until Nav Menu gets created as it is post-core-ext control now....
                EventHub.once("loadRendererExtensions"),
                // Sometimes the test runs before the initial title got set,
                // leading to the title set by the test being overwritten by e.g. "Home"
                EventHub.once("TitleChanged")
            )
                .do(function () {
                    var eventData = "Application's title";
                    var oEvent = {
                        getParameters: function () {
                            return { data: eventData };
                        }
                    };
                    AppLifeCycle.getAppMeta().onTitleChange(oEvent);

                    Config.wait("/core/shellHeader").then(function () {
                        Config.once("/core/shellHeader").do(function () {
                            sNavMenu = oAppTitle.getNavigationMenu();
                            oNavMenu = sap.ui.getCore().byId(sNavMenu);
                            assert.ok(!(oNavMenu.getItems() && oNavMenu.getItems().length > 0), "check that no hierarchy items exist on nav menu");
                            // (1) check text was modified in app title
                            assert.strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

                            // (2) see that navigation menu exists but no hierarchy items added

                            // prepare event data to simulate ShellUIService callback on the shell-controller for setting hierarchy which was changed
                            eventData = [{
                                title: "Item",
                                subtitle: "Item 2",
                                icon: "someIconURI"
                            }];

                            // trigger the event callback
                            Config.wait("/core/shellHeader").then(function () {
                                Config
                                    .once("/core/shellHeader")
                                    .do(function () {
                                        AppLifeCycle.getAppMeta().onHierarchyChange(oEvent);
                                    })
                                    .do(function () {
                                        Config
                                            .wait("/core/shellHeader")
                                            .then(function () {
                                                Config
                                                    .once("/core/shellHeader")
                                                    .do(function () {
                                                        // (4) check that title was not changed
                                                        assert.strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

                                                        // (5) check that a hierarchy item was created
                                                        assert.ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created on the navigation menu");

                                                        // (6) validate the hierarchy item which was created according to the factory method as created within the shell-view
                                                        oHierarchyItem = oNavMenu.getItems()[0];
                                                        expectedRes = eventData[0];
                                                        assert.ok(oHierarchyItem instanceof sap.m.StandardListItem, "check that hierarchy item created");
                                                        assert.ok(oHierarchyItem.getProperty("title") === expectedRes.title, "check that hierarchy property assigned");
                                                        assert.ok(oHierarchyItem.getProperty("description") === expectedRes.subtitle, "check that hierarchy property assigned");
                                                        assert.ok(oHierarchyItem.getProperty("icon") === expectedRes.icon, "check that hierarchy property assigned");


                                                        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
                                                        eventData = [{
                                                            title: "App 1",
                                                            subtitle: "App1 subtitle",
                                                            icon: "someIconURI",
                                                            intent: "#someintent1"
                                                        }, {
                                                            title: "Item",
                                                            subtitle: "Item 2",
                                                            icon: "someIconURI",
                                                            intent: "#someintent2"
                                                        }];

                                                        // trigger the event callback
                                                        AppLifeCycle.getAppMeta().onRelatedAppsChange(oEvent);

                                                        Config.wait("/core/shell/model/currentState").then(function () {
                                                            Config
                                                                .once("/core/shellHeader")
                                                                .do(function (oCurrentState) {

                                                                    assert.strictEqual(oCurrentState.application.hierarchy.length, 1, "/core/shell/model/application/hierarchy contains the expected number of entries");

                                                                    var oNavMenuItems = oNavMenu.getItems();
                                                                    var oNavMenuMiniTiles = oNavMenu.getMiniTiles();

                                                                    // (7) check that title was not changed
                                                                    assert.ok(oAppTitle.getText() === "Application's title", "Check application title");

                                                                    // (8) check that a hierarchy item was not modified AND relatedApps created correctly
                                                                    assert.strictEqual(Object.prototype.toString.apply(oNavMenuItems), "[object Array]", "got nav menu items as an array");
                                                                    assert.strictEqual(Object.prototype.toString.apply(oNavMenuMiniTiles), "[object Array]", "got nav menu mini tiles as an array");
                                                                    assert.strictEqual(oNavMenuItems.length, 1, "check that hierarchy item created was not changed due to setting related apps");
                                                                    assert.strictEqual(oNavMenuMiniTiles.length, 2, "check that related apps hierarchy item created on the navigation menu");

                                                                    // (9) validate the related Apps items which was created according to the factory method as created within the shell-view
                                                                    oRelatedAppMiniTile = oNavMenuMiniTiles[0];
                                                                    expectedRes = eventData[0];
                                                                    assert.ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                    oRelatedAppMiniTile = oNavMenu.getMiniTiles()[1];
                                                                    expectedRes = eventData[1];
                                                                    assert.ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                    assert.ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                    // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
                                                                    eventData = [
                                                                        {
                                                                            title: "App 1",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 2",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 3",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 4",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 5",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 6",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 7",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 8 ",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 9",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 10",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 11",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        }
                                                                    ];

                                                                    // trigger the event callback
                                                                    AppLifeCycle.getAppMeta().onRelatedAppsChange(oEvent);

                                                                    Config.wait("/core/shell/model/currentState").then(function () {
                                                                        Config
                                                                            .once("/core/shell/model/currentState")
                                                                            .do(function () {
                                                                                // (10) check that a hierarchy item was not modified due to related apps change
                                                                                assert.ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created was not changed due to setting related apps");

                                                                                // (11) MAKE SURE no more than 9 related apps reside on the navigation menu although event passed 11 related apps in array
                                                                                assert.ok(oNavMenu.getMiniTiles() && oNavMenu.getMiniTiles().length === 9, "check that related apps hierarchy item created on the navigation menu");

                                                                                oRelatedAppMiniTile = oNavMenu.getMiniTiles()[8];
                                                                                expectedRes = eventData[8];

                                                                                // (12) MAKE SURE last related app created is the 9th related app from the event data
                                                                                assert.ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                                assert.ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                                assert.ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                                assert.ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                                assert.ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                                fnDone();
                                                                            });
                                                                    });
                                                                });
                                                        });
                                                    });
                                            });
                                    });
                            });
                        });
                    });
                });
        });
    });

    QUnit.module("The static _getCurrentState function");

    QUnit.test("Calls the UShell Config with the correct parameter", function (assert) {
        // Arrange
        var oValue = {};
        var oLastStub = sinon.stub(Config, "last");
        oLastStub.returns(oValue); // Use an object reference to check if the exact same value is returned

        // Act
        var oResult = ShellAppTitle._getCurrentState();

        // Assert
        assert.strictEqual(oResult, oValue, "The correct value has been returned.");
        assert.strictEqual(oLastStub.callCount, 1, "The function has been called once.");
        assert.strictEqual(oLastStub.firstCall.args[0], "/core/shellHeader/ShellAppTitleState", "The function has been called with the correct parameter.");

        // Cleanup
        oLastStub.restore();
    });

    QUnit.module("The onclick function", {
        beforeEach: function () {
            this.oCurrentStateStub = sinon.stub(ShellAppTitle, "_getCurrentState");

            this.oShellAppTitle = new ShellAppTitle();

            this.oEvent = {
                preventDefault: sinon.stub()
            };

            this.oFirePressStub = sinon.stub(this.oShellAppTitle, "firePress");
            this.oGetControlVisibilityAndStateStub = sinon.stub(this.oShellAppTitle, "_getControlVisibilityAndState").returns(true);
            this.oOpenCloseNavMenuPopoverStub = sinon.stub(this.oShellAppTitle, "_openCloseNavMenuPopover");
            this.oOpenCloseAllMyAppsPopoverStub = sinon.stub(this.oShellAppTitle, "_openCloseAllMyAppsPopover");
        },
        afterEach: function () {
            this.oShellAppTitle.destroy();

            this.oCurrentStateStub.restore();
        }
    });

    QUnit.test("Prevents the default behavior of the given event", function (assert) {
        // Arrange
        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oEvent.preventDefault.callCount, 1, "The function has been called once.");
    });

    QUnit.test("Triggers the ShellAppTitle's press event", function (assert) {
        // Arrange
        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oFirePressStub.callCount, 1, "The function has been called once.");
    });

    QUnit.test("Updates the hash if on a phone while not clickable", function (assert) {
        // Arrange
        var oConfigStub = sinon.stub(Config, "last").returns("SomeHash");
        var oSetHashStub = sinon.stub(window.hasher, "setHash");
        var bOriginalPhone = Device.system.phone;
        Device.system.phone = true;

        this.oGetControlVisibilityAndStateStub.returns(false);

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oGetControlVisibilityAndStateStub.callCount, 1, "The function _getControlVisibilityAndState has been called once.");
        assert.strictEqual(oSetHashStub.callCount, 1, "The function setHash has been called once.");
        assert.strictEqual(oSetHashStub.firstCall.args[0], "SomeHash", "The function setHash has been called with the correct parameter.");
        assert.strictEqual(oConfigStub.callCount, 1, "The function Config.last has been called once.");
        assert.strictEqual(oConfigStub.firstCall.args[0], "/core/shellHeader/rootIntent", "The function Config.last has been called with the correct parameter.");

        // Cleanup
        Device.system.phone = bOriginalPhone;
        oSetHashStub.restore();
        oConfigStub.restore();
    });

    QUnit.test("Calls _openCloseAllMyAppsPopover if the control is clickable and the current state is ALL_MY_APPS_ONLY", function (assert) {
        // Arrange
        this.oCurrentStateStub.returns(AppTitleState.AllMyAppsOnly);

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oOpenCloseAllMyAppsPopoverStub.callCount, 1, "The function _openCloseAllMyAppsPopover has been called once.");
    });

    QUnit.test("Calls _openCloseNavMenuPopover if the control is clickable and the current state is not ALL_MY_APPS_ONLY", function (assert) {
        // Arrange
        this.oCurrentStateStub.returns("SomeOtherState");

        // Act
        this.oShellAppTitle.onclick(this.oEvent);

        // Assert
        assert.strictEqual(this.oOpenCloseNavMenuPopoverStub.callCount, 1, "The function _openCloseNavMenuPopover has been called once.");
    });
});
