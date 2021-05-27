// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.ShellHeader
 */

 /* global QUnit, sinon */

sap.ui.require([
    "jquery.sap.global",
    "sap/ui/core/IconPool",
    "sap/base/util/ObjectPath",
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (jQuery, IconPool, ObjectPath, ShellHeader, ShellAppTitle, ShellHeadItem) {
    "use strict";

    var sandbox = sinon.createSandbox({
        useFakeTimers: false
    });

    // for the AppTitle control
    sap.ushell.Container = {
        getService: function (sServiceName) {
            switch (sServiceName) {
                case "ShellNavigation":
                    return {
                        unregisterNavigationFilter: sinon.stub()
                    };
                default:
                    throw new Error("The service " + sServiceName + " has not been mocked");
            }
        }
    };

    QUnit.module("basic test", {
        beforeEach: function (assert) {
            var done = assert.async();
            // this setTimeout fixes an issue with the not completely deleted objects
            setTimeout(function () {
                this.oShellHeader = new ShellHeader("shell-header", {
                    logo: jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/SAPLogo.svg",
                    showLogo: true,
                    visible: true,
                    headItems: [
                        new ShellHeadItem("backBtn", {icon: IconPool.getIconURI("nav-back"), ariaLabel: "Back"})
                    ],
                    headEndItems: [
                        new ShellHeadItem("sf", {icon: IconPool.getIconURI("search"), ariaLabel: "Search"})
                    ],
                    title: "Subtitle with a long text",
                    appTitle: new ShellAppTitle("shellAppTitle", { text: "AppTitle with a long text" }),
                    search: new sap.m.Input()
                });
                this.oShellHeader.placeAt("qunit-fixture");
                sap.ui.getCore().applyChanges();

                done();
            }.bind(this), 0);
        },
        afterEach: function () {
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("Logo linked if not on homepage, navigate home", function (assert) {
        // Arrange
        this.oShellHeader.destroy();
        window.hasher = { getHash: sinon.stub().returns("aaa-bbb-ccc") };

        this.oShellHeader = new ShellHeader("shell-header", {
            homeUri: "#Shell-home"
        });

        // Act
        this.oShellHeader.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        // Assert
        assert.equal(jQuery(".sapUshellShellIco").attr("href"), "#Shell-home", "Logo is linked");
        assert.equal(jQuery(".sapUshellShellIco").attr("aria-label"), "Home", "Aria-label is set correct for logo");
        // Navigate home
        var oLogo = this.oShellHeader.$("logo")[0];
        this.oShellHeader.onsapspace({
            target: oLogo
        });
        assert.strictEqual(oLogo.href, window.location.href, "Navigate home by space on the logo");

        // Cleanup
        delete window.hasher;
        this.oShellHeader.destroy();
    });

    QUnit.test("Logo is linked on homepage", function (assert) {
        // Arrange
        this.oShellHeader.destroy();

        window.hasher = { getHash: sinon.stub().returns("Shell-home") };
        this.oShellHeader = new ShellHeader("shell-header", {
            visible: true,
            homeUri: "#Shell-home"
        });

        // Act
        this.oShellHeader.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        // Assert
        assert.notOk(jQuery(".sapUshellShellIco").attr("tabindex"), "tabindex is not set");
        assert.ok(jQuery(".sapUshellShellIco").attr("title"), "title is set");
        delete window.hasher;
    });

    QUnit.test("Rendering", function (assert) {
        // Arrange
        // Act
        // Assert
        assert.ok(this.oShellHeader.getId() === "shell-header", "Shell Header is rendered");
        assert.ok(jQuery("#shellAppTitle .sapUshellHeadTitle").text() === this.oShellHeader.getAppTitle().getText(), "Apptitle is rendered");
        assert.ok(jQuery(".sapUshellShellHeadSubtitle .sapUshellHeadTitle").text() === this.oShellHeader.getTitle(), "Title is rendered");
        assert.ok(jQuery(".sapUshellShellIco").length === 1, "Logo is rendered");
        assert.ok(jQuery(".sapUshellShellIco").attr("id") === "shell-header-logo", "Logo has an ID");
        assert.ok(jQuery("#sf").length === 1, "Search button is rendered");
    });

    QUnit.test("Test that accessibility property is set correctly", function (assert) {
        // Arrange
        // Act
        // Assert
        var aHeadItems = this.oShellHeader.getHeadItems(),
            aHeadEndItems = this.oShellHeader.getHeadEndItems();

        function assertShellHeaderItem (oItem) {
            if (!oItem.getDomRef()) {
                return;
            }
            var jQueryItem = jQuery(oItem.getDomRef()),
                sId = oItem.getId();
            assert.equal(jQueryItem.attr("tabindex"), 0, "tabindex is set correctly for ShellHeaderItem: " + sId);
            assert.equal(jQueryItem.attr("role"), "button", "role is set correctly for ShellHeaderItem: " + sId);
            assert.ok(!!jQueryItem.attr("aria-label"), "aria-label is not empty for ShellHeaderItem: " + sId);
        }

        aHeadItems.forEach(assertShellHeaderItem);
        aHeadEndItems.forEach(assertShellHeaderItem);
    });

    QUnit.test("_handleFocus:", function (assert) {
        [
            {
                sTestDescription: "navigation from outside and navigation direction forward, no HeadItems",
                bFromOutside: true,
                bForwardNavigation: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: true,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction forward, with HeadItems",
                bFromOutside: true,
                bForwardNavigation: true,
                bShellHeadItems: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: true,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction backwards, no HeadEndItems",
                bFromOutside: true,
                bForwardNavigation: false,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: true,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction backwards, with HeadEndItems",
                bFromOutside: true,
                bForwardNavigation: false,
                bShellHeadEndItems: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: true,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from inside and navigation direction backwards",
                bFromOutside: false,
                bForwardNavigation: false,
                bExpectedFocusOnShell: false,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            var bHandleEventUsingExternalKeysHandlerCalled = false;
            var oAccessKeyHandler = {
                fromOutside: oFixture.bFromOutside,
                bForwardNavigation: oFixture.bForwardNavigation,
                bFocusOnShell: true,
                _handleEventUsingExternalKeysHandler: function () {
                    bHandleEventUsingExternalKeysHandlerCalled = true;
                }
            };

            var oFocusResult = {
                bShellHeadItem: false,
                bAppTitle: false,
                bShellHeadEndItem: false
            };

            var fnGetHeadItemsStub = sinon.stub(this.oShellHeader, "getHeadItems").callsFake(
                    function () {
                        return oFixture.bShellHeadItems ? [{
                            focus: function () {
                                oFocusResult.bShellHeadItem = true;
                            }
                        }] : [];
                    }
                ),
                fnGetAppTitleStub = sinon.stub(this.oShellHeader, "getAppTitle").returns({
                    focus: function () {
                        oFocusResult.bAppTitle = true;
                    }
                }),
                fnGetHeadEndItemsStub = sinon.stub(this.oShellHeader, "getHeadEndItems").callsFake(
                    function () {
                        return oFixture.bShellHeadEndItems ? [{
                            focus: function () {
                                oFocusResult.bShellHeadEndItem = true;
                            }
                        }] : [];
                    }
                ),
                fnIsHomepageStub = sinon.stub(this.oShellHeader, "isHomepage").returns(true);

            this.oShellHeader.setAccessKeyHandler(oAccessKeyHandler);

            // Act
            this.oShellHeader._handleFocus();

            // Assert
            assert.strictEqual(
                oAccessKeyHandler.bFocusOnShell,
                oFixture.bExpectedFocusOnShell,
                "Focus was (not) set on the shell when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bShellHeadItem,
                oFixture.bExpectedFocusOnShellHeadItem,
                "Focus was (not) set on the first shellHeadItem when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bAppTitle,
                oFixture.bExpectedFocusOnAppTitle,
                "Focus was (not) set on the appTitle when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bShellHeadEndItem,
                oFixture.bExpectedFocusOnShellHeadEndItem,
                "Focus was (not) set on the last shellHeadEndItem when " + oFixture.sTestDescription);
            assert.strictEqual(
                bHandleEventUsingExternalKeysHandlerCalled,
                oFixture.bExpectedHandleEventUsingExternalKeysHandlerCalled,
                "_handleEventUsingExternalKeysHandler was (not) called when " + oFixture.sTestDescription);

            fnGetAppTitleStub.restore();
            fnGetHeadItemsStub.restore();
            fnGetHeadEndItemsStub.restore();
            fnIsHomepageStub.restore();
        }.bind(this));
    });

    QUnit.test("Search State", function (assert) {
        // open search
        this.oShellHeader.setSearchState("EXP", 10, true);
        sap.ui.getCore().applyChanges();

        var searchContainer = jQuery("#shell-header-hdr-search");
        var maxWidth = searchContainer[0].style.maxWidth;
        assert.strictEqual(maxWidth, "10rem", "Search field width is correctly set");
        assert.strictEqual(searchContainer.width() > 0, true, "Search Field container is visible");

        // close search
        this.oShellHeader.setSearchState("COL", 10, true);
        sap.ui.getCore().applyChanges();

        searchContainer = jQuery("#shell-header-hdr-search");
        maxWidth = searchContainer[0].style.maxWidth;
        assert.strictEqual(maxWidth, "0rem", "Search field width is correctly set");
        assert.strictEqual(searchContainer.width(), 0, "Search Field container is invisible");
    });

    /**
     * Theme Designer calls the onThemeChanged function when e.g. the Logo was updated
     * With that, a rerendering should happen - although the theme stays the same
     * (as Theme Desginer just changes the current theme).
     */
    QUnit.test("Rerender when onThemeChange is called", function (assert) {
        // Arrange
        var oRenderer = this.oShellHeader.getRenderer();
        var oRendererStub = sandbox.stub(oRenderer, "render");

        var oEventMock = {
            theme: sap.ui.getCore().getConfiguration().getTheme()
        };

        // Act
        this.oShellHeader.onThemeChanged(oEventMock);
        sap.ui.getCore().applyChanges();

        // Assert
        assert.ok(oRendererStub.called, "onThemeChanged() caused rerendering.");

        // Cleanup
        sandbox.restore();
    });

    QUnit.module("test accessibility roles", {
        beforeEach: function () {
            this.oShellHeader = new ShellHeader("shell-header", {
                showLogo: true,
                visible: true,
                headItems: [
                    new ShellHeadItem("backBtn", {
                        icon: IconPool.getIconURI("nav-back"),
                        target: "#Shell-home",
                        ariaLabel: "Back"
                    })
                ],
                headEndItems: [
                    new ShellHeadItem("userMenu", {
                        icon: IconPool.getIconURI("action-settings"),
                        ariaLabel: "User Settings",
                        ariaHaspopup: "dialog"
                    })
                ],
                title: "Subtitle with a long text",
                appTitle: new ShellAppTitle("shellAppTitle", { text: "AppTitle with a long text" })
            });
            this.oShellHeader.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oShellHeader.destroy();
        }
    });

    QUnit.test("Accessibility role's set correctly", function (assert) {
        var oButton1 = this.oShellHeader.getHeadItems()[0];
        var oButton2 = this.oShellHeader.getHeadEndItems()[0];
        assert.strictEqual(oButton1.$().attr("role"), "link", "navigation items should have aria role 'link'.");
        assert.strictEqual(oButton1.$().attr("aria-haspopup"), undefined, "aria-haspopup is not set specified.");
        assert.strictEqual(oButton2.$().attr("role"), "button", "normal items should have aria role 'button'.");
        assert.strictEqual(oButton2.$().attr("aria-haspopup"), "dialog", "aria-haspopup is correctly specified.");
    });

    QUnit.module("isHomepage", {
        beforeEach: function () {
            this.originalRootIntent = ObjectPath.get("renderers.fiori2.componentData.config.rootIntent", window["sap-ushell-config"]);
            this.oShellHeader = new ShellHeader();
            this.oHashStub = sinon.stub();
            window.hasher = {
                getHash: this.oHashStub
            };
            this.setHomeUri = function (sIntent) {
                this.oShellHeader.setHomeUri(sIntent);
                ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", sIntent, window["sap-ushell-config"]);
            };
        },
        afterEach: function () {
            ObjectPath.set("renderers.fiori2.componentData.config.rootIntent", this.originalRootIntent, window["sap-ushell-config"]);
            this.oShellHeader.destroy();
            delete window.hasher;
        }
    });

    QUnit.test("no special root intent - hash is #Shell-home", function (assert) {
        // Arrange
        this.oHashStub.returns("Shell-home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Shell-home?", function (assert) {
        // Arrange
        this.oHashStub.returns("Shell-home?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.oHashStub.returns("Launchpad-openFLPPage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId", function (assert) {
        // Arrange
        this.oHashStub.returns("Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #Sales-manage", function (assert) {
        // Arrange
        this.oHashStub.returns("Sales-manage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("no special root intent - hash is #some-hash?withParam=value", function (assert) {
        // Arrange
        this.oHashStub.returns("some-hash?withParam=value");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Shell-home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Shell-home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Shell-home?", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Shell-home?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Launchpad-openFLPPage", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Launchpad-openFLPPage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Launchpad-openFLPPage?pageId=somePageId&spaceId=someSpaceId");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage - hash is #Sales-manage", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, true, "Should return true.");
    });

    QUnit.test("no special root intent - hash is #some-hash?withParam=value", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("some-hash?withParam=value");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManage?");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manag", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManag");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?param1=1", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("SalesManage?param1=1");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return true.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage&/home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage&/home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.test("root intent is #Sales-manage and hash is Sales-manage?param1=1&/home", function (assert) {
        // Arrange
        this.setHomeUri("#Sales-manage");
        this.oHashStub.returns("Sales-manage?param1=1&/home");

        // Act
        var bIsHomepage = this.oShellHeader.isHomepage();
        // Assert
        assert.strictEqual(bIsHomepage, false, "Should return false.");
    });

    QUnit.module("Event delegates", {
        beforeEach: function () {
            this.oPreventDefaultStub = sandbox.stub();
            this.oAddDelegateStub = sandbox.stub(ShellHeader.prototype, "addDelegate");
            this.oShellHeader = new ShellHeader();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onBeforeFastNavigationFocus", function (assert) {
        // Arrange
        var oEventMock = {
            preventDefault: this.oPreventDefaultStub
        };

        var oSendFocusBackToShellStub = sandbox.stub();
        this.oShellHeader._accessKeyHandler = {
            sendFocusBackToShell: oSendFocusBackToShellStub
        };
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onBeforeFastNavigationFocus;
        // Act
        fnDelegate(oEventMock);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oSendFocusBackToShellStub.callCount, 1, "sendFocusBackToShell was called once");
        assert.strictEqual(oSendFocusBackToShellStub.getCall(0).args[0], oEventMock, "sendFocusBackToShell was called with correct parameters");
    });
});
