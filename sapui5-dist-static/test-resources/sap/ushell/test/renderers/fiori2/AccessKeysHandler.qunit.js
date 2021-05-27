// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for AccessKeysHandler
 */
sap.ui.require([
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/renderers/fiori2/AccessKeysHandler",
    "sap/ushell/services/Container",
    "sap/ushell/components/homepage/Component",
    "sap/ui/thirdparty/hasher",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (
    ComponentKeysHandler,
    AccessKeysHandler,
    Container,
    Component,
    hasher,
    JSONModel,
    Config,
    resources
) {
    "use strict";

    /* global QUnit sinon */
    var sandbox = sinon.createSandbox();

    // init must be only called once over all the tests
    AccessKeysHandler.init(new JSONModel({
        searchAvailable: false
    }));
    sinon.stub(AccessKeysHandler, "init");

    QUnit.module("AccessKeysHandler");

    QUnit.test("check AccessKeysHandler Class init flags values", function (assert) {
        assert.strictEqual(AccessKeysHandler.bFocusOnShell, true, "flag init value should be true");
        assert.strictEqual(AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime, true, "flag init value should be true");
        assert.strictEqual(AccessKeysHandler.isFocusHandledByAnotherHandler, false, "flag init value should be false");
    });

    QUnit.test("move focus to inner application", function (assert) {
        var done = assert.async();
        var fnCallbackAppKeysHandler = sinon.spy(),
            getHashStub = sinon.stub(hasher, "getHash").returns("shell-home");

        // register inner application keys handler
        AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);
        // Trigger the F6 key event to move keys handling to inner application
        var F6keyCode = 117;
        var oEvent;
        // IE doesn't support creating the KeyboardEvent object with a the "new" constructor, hence if this will fail, it will be created
        // using the document object- https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
        // This KeyboardEvent has a constructor, so checking for its ecsitaance will not solve this, hence, only solution found is try-catch
        try {
            oEvent = new KeyboardEvent("keydown");
        } catch (err) {
            var IEevent = document.createEvent("KeyboardEvent");
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
            IEevent.initKeyboardEvent("keydown", false, false, null, 0, 0, 0, 0, false);
            oEvent = IEevent;
        }

        oEvent.oEventkeyCode = F6keyCode;
        // Set flag to false because the focus moves to the application responsibility
        AccessKeysHandler.bFocusOnShell = false;
        document.dispatchEvent(oEvent);

        setTimeout(function () {
            assert.ok(fnCallbackAppKeysHandler.calledOnce, "Application's keys handler function was not executed");
            getHashStub.restore();
            done();
        }, 100);
    });

    QUnit.test("check focus back to shell flags validity", function (assert) {
        var instance = AccessKeysHandler;

        // Set flag to false because the focus moves to the application responsibility
        AccessKeysHandler.bFocusOnShell = false;

        // Move focus back to shell
        var F6keyCode = 117;
        var oEvent = jQuery.Event("keydown", { keyCode: F6keyCode, shiftKey: true });

        AccessKeysHandler.sendFocusBackToShell(oEvent);

        assert.strictEqual(instance.bFocusOnShell, true, "flag value should be true");
    });

    QUnit.test("test reset handlers after navigating to another application", function (assert) {
        var fnCallbackAppKeysHandler = sinon.spy(),
            currentKeysHandler,
            hasherGetHashStub = sinon.stub(hasher, "getHash").returns("some-app");

        // register inner application keys handler
        AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);

        currentKeysHandler = AccessKeysHandler.getAppKeysHandler();
        assert.ok(currentKeysHandler, "currently there is a registered keys handler");

        // this function will be called once 'appOpened' event will be fired
        hasherGetHashStub.returns("another-app");
        AccessKeysHandler.appOpenedHandler();
        currentKeysHandler = AccessKeysHandler.getAppKeysHandler();
        assert.strictEqual(currentKeysHandler, null, "currently there is no registered keys handler");

        hasherGetHashStub.restore();
    });

    QUnit.test("handleShortcuts:", function (assert) {
        [
            {
                sTestDescription: "ALT was pressed",
                oEvent: { altKey: true },
                bExpectedHandleAltShortcutKeys: true,
                bExpectedHandleCtrlShortcutKeys: false
            }, {
                sTestDescription: "CTRL was pressed",
                oEvent: { ctrlKey: true },
                bExpectedHandleAltShortcutKeys: false,
                bExpectedHandleCtrlShortcutKeys: true
            }, {
                sTestDescription: "CMD + SHIFT + F was pressed",
                oEvent: {
                    metaKey: true,
                    shiftKey: true,
                    keyCode: 70,
                    preventDefault: function () { }
                },
                bExpectedHandleAltShortcutKeys: false,
                bExpectedHandleCtrlShortcutKeys: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var oAccessKeysHandler = AccessKeysHandler,
                fnHandleAltShortcutKeysStub = sinon.stub(oAccessKeysHandler, "_handleAltShortcutKeys"),
                fnHandleCtrlShortcutKeysStub = sinon.stub(oAccessKeysHandler, "_handleCtrlShortcutKeys"),
                bTempMacintosh = sap.ui.Device.os.macintosh;

            sap.ui.Device.os.macintosh = true;

            // Act
            oAccessKeysHandler.handleShortcuts(oFixture.oEvent);

            // Assert
            assert.strictEqual(fnHandleAltShortcutKeysStub.called, oFixture.bExpectedHandleAltShortcutKeys,
                "_handleAltShortcutKeys was (not) called when ");
            assert.strictEqual(fnHandleCtrlShortcutKeysStub.called, oFixture.bExpectedHandleCtrlShortcutKeys,
                "_handleCtrlShortcutKeys was (not) called when ");

            fnHandleAltShortcutKeysStub.restore();
            fnHandleCtrlShortcutKeysStub.restore();

            sap.ui.Device.os.macintosh = bTempMacintosh;
        });
    });

    QUnit.test("_handleAltShortcutKeys:", function (assert) {
        var aTestCases = [
            {
                sTestDescription: "ALT + A was pressed",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: true,
                bExpectedFocusItemInOverflowPopover: false
            },
            {
                sTestDescription: "ALT + A was pressed, but bAdvancedShellActions is false",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: false,
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + A was pressed and moveAppFinderToShellHeader is true",
                oEvent: { keyCode: 65 },
                bAdvancedShellActions: true,
                bMoveAppFinderActionToShellHeader: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: true
            }, {
                sTestDescription: "ALT + B was pressed (hotkey not in use)",
                oEvent: { keyCode: 66 },
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + F was pressed",
                oEvent: { keyCode: 70 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + H was pressed",
                oEvent: { keyCode: 72 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + M was pressed",
                oEvent: { keyCode: 77 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + N was pressed",
                oEvent: { keyCode: 78 },
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + S was pressed",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: true,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + s was pressed, but bAdvancedShellActions is false",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: false,
                bExpectedBlockBrowserDefault: false,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: false
            }, {
                sTestDescription: "ALT + S was pressed and moveUserSettingsActionToShellHeader is true",
                oEvent: { keyCode: 83 },
                bAdvancedShellActions: true,
                bMoveUserSettingsActionToShellHeader: true,
                bExpectedBlockBrowserDefault: true,
                bExpectedFocusItemInUserMenu: false,
                bExpectedFocusItemInOverflowPopover: true
            }
        ];

        var done = assert.async(aTestCases.length);

        aTestCases.forEach(function (oFixture) {
            // Arrange
            var fnBlockBrowserDefaultStub = sinon.spy(AccessKeysHandler, "_blockBrowserDefault"),
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    byId: function (sId) {
                        if (sId === "shell-header") {
                            return {
                                getHomeUri: function () {
                                    return "#Shell-home";
                                }
                            };
                        }
                        return {
                            isOpen: function () {
                                return true;
                            }
                        };
                    }
                });

            if (!sap.ushell.Container) {
                sap.ushell.Container = {
                    getRenderer: function () {
                        return {
                            getShellConfig: function () {
                                return {
                                    moveAppFinderActionToShellHeader: oFixture.bMoveAppFinderActionToShellHeader,
                                    moveUserSettingsActionToShellHeader: oFixture.bMoveUserSettingsActionToShellHeader
                                };
                            }
                        };
                    }
                };
            }

            // Act
            AccessKeysHandler._handleAltShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            window.setTimeout(function () {
                assert.strictEqual(fnBlockBrowserDefaultStub.called, oFixture.bExpectedBlockBrowserDefault,
                    "Default Event prevented when " + oFixture.sTestDescription);

                delete sap.ushell.Container;
                done();
            }, 0);

            fnBlockBrowserDefaultStub.restore();
            fnGetCoreStub.restore();
        });
    });

    QUnit.test("_handleCtrlShortcutKeys:", function (assert) {
        [
            {
                sTestDescription: "CTRL + SHIFT + F was pressed",
                oEvent: { keyCode: 70, shiftKey: true, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + F was pressed (hotkey not in use)",
                oEvent: { keyCode: 70, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + COMMA was pressed",
                oEvent: { keyCode: 188, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + COMMA was pressed",
                oEvent: { keyCode: 188, preventDefault: function () {}, stopPropagation: function () {} },
                bAdvancedShellActions: true,
                bExpectedSettingsButtonPressed: true,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + F1 was pressed",
                oEvent: { keyCode: 112, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: true
            }, {
                sTestDescription: "CTRL + S was pressed",
                oEvent: {
                    keyCode: 83,
                    preventDefault: function () { }
                },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: false,
                bExpectedHandleAccessOverviewKey: false
            }, {
                sTestDescription: "CTRL + Enter was pressed",
                oEvent: { keyCode: 13, preventDefault: function () {}, stopPropagation: function () {} },
                bExpectedSettingsButtonPressed: false,
                bExpectedDoneButtonPressed: true,
                bExpectedHandleAccessOverviewKey: false
            }
        ].forEach(function (oFixture) {
            // Arrange
            var fnHandleAccessOverviewKeyStub = sinon.stub(AccessKeysHandler, "_handleAccessOverviewKey"),
                bSettingsButtonPressed = false,
                bDoneButtonPressed = false,
                fnGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                    byId: function (sId) {
                        if (sId === "userSettingsBtn") {
                            return {
                                firePress: function () {
                                    bSettingsButtonPressed = true;
                                }
                            };
                        } else if (sId === "sapUshellDashboardFooterDoneBtn") {
                            return {
                                getDomRef: function () {
                                    return {};
                                },
                                firePress: function () {
                                    bDoneButtonPressed = true;
                                }
                            };
                        }
                    }
                });

            // Act
            AccessKeysHandler._handleCtrlShortcutKeys(oFixture.oEvent, oFixture.bAdvancedShellActions);

            // Assert
            assert.strictEqual(fnHandleAccessOverviewKeyStub.called, oFixture.bExpectedHandleAccessOverviewKey,
                "AccessOverview Dialog was (not) created when ");
            assert.strictEqual(bSettingsButtonPressed, oFixture.bExpectedSettingsButtonPressed,
                "Settings Dialog was (not) created when ");
            assert.strictEqual(bDoneButtonPressed, oFixture.bExpectedDoneButtonPressed,
                "Done button was (not) pressed when ");
            fnHandleAccessOverviewKeyStub.restore();
            fnGetCoreStub.restore();
        });
    });

    QUnit.test("check that on mobile and tablet we do not have accessibility", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.createRenderer("fiori2", true).then(function () {
                var ComponentKeysHandlerInit = sinon.stub(ComponentKeysHandler, "init");

                sap.ui.Device.system.phone = true;
                var oHomepageComponent = new Component({
                    componentData: {
                        properties: {},
                        config: {}
                    }
                });
                assert.ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in phone mode");

                oHomepageComponent.destroy();

                sap.ui.Device.system.phone = false;
                sap.ui.Device.system.tablet = true;
                oHomepageComponent = new Component({
                    componentData: {
                        properties: {},
                        config: {}
                    }
                });

                assert.ok(!ComponentKeysHandlerInit.called, "Keys handler init was not called in tablet mode");

                oHomepageComponent.destroy();
                ComponentKeysHandlerInit.restore();
                done();
            });
        });
    });

    QUnit.test("suppress F1 help on CTRL + F1 in Internet Explorer", function (assert) {
        var isInternetExplorer = sap.ui.Device.browser.msie,
            oCancelHelpEventSpy,
            oHelpEvent1,
            oHelpEvent2,
            oRequireStub = sinon.stub(sap.ui, "require");

        AccessKeysHandler.aShortcutsDescriptions = [];

        if (!isInternetExplorer) {
            sap.ui.Device.browser.msie = true;
        }

        oCancelHelpEventSpy = sinon.spy(AccessKeysHandler, "_cancelHelpEvent");

        // simulate CTRL + F1
        AccessKeysHandler._handleAccessOverviewKey();

        if (isInternetExplorer) {
            oHelpEvent1 = document.createEvent("Event");
            oHelpEvent1.initEvent("help", true, true);
            oHelpEvent2 = document.createEvent("Event");
            oHelpEvent2.initEvent("help", true, true);
        } else {
            oHelpEvent1 = new Event("help", { bubbles: true, cancelable: true });
            oHelpEvent2 = new Event("help", { bubbles: true, cancelable: true });
        }

        // the help event is triggered together with CTRL + F1 in Internet Explorer
        document.dispatchEvent(oHelpEvent1);
        assert.strictEqual(oCancelHelpEventSpy.callCount, 1,
            "The help cancelling event handler was called for CTRL + F1");

        // the second help event is for F1 without CTRL
        document.dispatchEvent(oHelpEvent2);
        assert.strictEqual(oCancelHelpEventSpy.callCount, 1,
            "The help cancelling event handler was not called for F1");

        if (!isInternetExplorer) {
            // this cannot be tested in Internet Explorer as the original event is not changed here
            assert.strictEqual(oHelpEvent1.defaultPrevented, true,
                "For CTRL + F1 the help event was cancelled");
            assert.strictEqual(oHelpEvent2.defaultPrevented, false,
                "For F1 the help event was not cancelled");

            // cleanup: this attribute only exists in Internet Explorer
            delete sap.ui.Device.browser.msie;
        }
        oCancelHelpEventSpy.restore();
        oRequireStub.restore();
    });

    QUnit.test("Triggers the editModeDone event for Control + Enter if in spaces mode", function (assert) {
        // Arrange
        sandbox.stub(AccessKeysHandler, "_isFocusInDialog").returns(false);
        sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(true);
        var oFireEventStub = sandbox.stub(AccessKeysHandler, "fireEvent");

        var oEvent = {
            keyCode: 13
        };

        // Act
        AccessKeysHandler._handleCtrlShortcutKeys(oEvent);

        // Assert
        assert.strictEqual(oFireEventStub.callCount, 1, "The function fireEvent has been called once.");
        assert.deepEqual(oFireEventStub.firstCall.args, [ "editModeDone" ], "The function fireEvent has been called once.");

        // Cleanup
        sandbox.restore();
    });

    QUnit.module("_handleAccessOverviewKey method", {
        beforeEach: function () {
            this.oGetTextSpy = sinon.spy(resources.i18n, "getText");
            this.oConfigStub = sinon.stub(Config, "last");
            this.bOldSearchAvailable = AccessKeysHandler.oModel.getProperty("/searchAvailable");
            this.bOldPersonalization = AccessKeysHandler.oModel.getProperty("/personalization");

            this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(true);
            this.oConfigStub.withArgs("/core/catalog/enabled").returns(true);
            AccessKeysHandler.oModel.setProperty("/searchAvailable", true);
            AccessKeysHandler.oModel.setProperty("/personalization", true);

            this.oBody = window.document.getElementsByTagName("body")[0];
            this.oShellHeader = window.document.createElement("div");

            this.oShellHeader.setAttribute("id", "shell-header");
            this.oBody.appendChild(this.oShellHeader);

            this.oRequireStub = sinon.stub(sap.ui, "require");
        },
        afterEach: function () {
            this.oGetTextSpy.restore();
            this.oConfigStub.restore();
            AccessKeysHandler.oModel.setProperty("/searchAvailable", this.bOldSearchAvailable);
            AccessKeysHandler.oModel.setProperty("/personalization", this.bOldPersonalization);

            this.oBody.removeChild(this.oShellHeader);
            this.oRequireStub.restore();
        }
    });

    QUnit.test("Check short keys dialog is creating successfully with every shortcut available", function (assert) {
        // Arrange

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with notifications disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with personalization disabled", function (assert) {
        // Arrange
        AccessKeysHandler.oModel.setProperty("/personalization", false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with appfinder disabled", function (assert) {
        // Arrange
        AccessKeysHandler.oModel.setProperty("/personalization", true);
        this.oConfigStub.withArgs("/core/catalog/enabled").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with search unavailable", function (assert) {
        // Arrange
        AccessKeysHandler.oModel.setProperty("/searchAvailable", false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(true);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 1, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 1, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 1, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with advancedShellActions unavailable", function (assert) {
        // Arrange

        // Act
        AccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 1, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 1, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 1, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 1, "The focus search field text was requested.");
    });

    QUnit.test("Check short keys dialog is creating successfully with every flag on false", function (assert) {
        // Arrange
        AccessKeysHandler.oModel.setProperty("/searchAvailable", false);
        AccessKeysHandler.oModel.setProperty("/personalization", false);
        this.oConfigStub.withArgs("/core/shell/model/enableNotifications").returns(false);
        this.oConfigStub.withArgs("/core/catalog/enabled").returns(false);

        // Act
        AccessKeysHandler._handleAccessOverviewKey(false);

        // Assert
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnAppFinderButton").callCount, 0, "The focus appfinder text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchButton").callCount, 0, "The focus search button text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyHomePage").callCount, 1, "The homepage text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnUserActionMenu").callCount, 1, "The focus user actions menu text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnNotifications").callCount, 0, "The focus notifications text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSettingsButton").callCount, 0, "The focus settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyOpenSettings").callCount, 0, "The open settings text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyExitEditing").callCount, 0, "The save changes text was requested.");
        assert.strictEqual(this.oGetTextSpy.withArgs("hotkeyFocusOnSearchField").callCount, 0, "The focus search field text was requested.");
    });
});