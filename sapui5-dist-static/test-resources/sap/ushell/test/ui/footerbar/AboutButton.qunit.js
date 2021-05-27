// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/services/Container", // needed for sap.ushell.bootstrap
    "sap/ushell/ui/footerbar/AboutButton"
], function (Config, resources, Container, AboutButton) {
    "use strict";
    /* global QUnit sinon */
    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.ui.footerbar.AboutButton", {
        beforeEach: function () {
            this.oAboutButton = new AboutButton();
        },
        afterEach: function () {
            this.oAboutButton.destroy();
        }
    });

    QUnit.test("init: should instantiate the about button", function (assert) {
        // Assert
        assert.strictEqual(this.oAboutButton.getIcon(), "sap-icon://hint", "button icon is correct");
        assert.strictEqual(this.oAboutButton.getText(), resources.i18n.getText("about"), "button title is correct");
        assert.strictEqual(this.oAboutButton.getTooltip(), resources.i18n.getText("about"), "button tooltip is correct");
    });

    QUnit.module("showAboutDialog", {
        beforeEach: function () {
            this.oAboutButton = new AboutButton();
            return sap.ushell.bootstrap("local");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            // Destroy the about dialog
            sap.ui.getCore().byId("aboutContainerDialogID").destroy();
            this.oAboutButton.destroy();
            Config._reset();
            sandbox.restore();
        }
    });

    function showAboutDialogTest (assert) {
        // Arrange
        sinon.stub(sap.ushell.Container, "getServiceAsync").withArgs("AppLifeCycle").returns(Promise.resolve({
            getCurrentApplication: sinon.stub().returns({
                getInfo: sinon.stub().returns(
                    Promise.resolve({
                        technicalAppComponentId: this.technicalAppComponentId,
                        appVersion: this.appVersion,
                        appFrameworkId: this.appFrameworkId,
                        appFrameworkVersion: this.appFrameworkVersion,
                        appId: this.appId,
                        appSupportInfo: this.appSupportInfo
                    })
                ),
                getSystemContext: sinon.stub().returns(
                    Promise.resolve({
                        label: this.providerId
                    })
                ),
                homePage: this.homePage
            })
        }));

        // Act & Assert
        return this.oAboutButton.showAboutDialog().then(function () {
            // Get the about dialog content form
            var oDialog = sap.ui.getCore().byId("aboutDialogFormID"),
                aDialogContent = oDialog.getContent(),
                oLogonSystem = sap.ushell.Container.getLogonSystem(),
                aExpectedValues = [
                    this.technicalAppComponentId || "",
                    this.appVersion || "",
                    this.appFrameworkId || "",
                    this.appFrameworkVersion || "",
                    this.providerId || "",
                    navigator.userAgent,
                    oLogonSystem.getProductName() || "",
                    oLogonSystem.getProductVersion() || "",
                    oLogonSystem.getSystemName() || "",
                    oLogonSystem.getSystemRole() || "",
                    oLogonSystem.getTenantRole() || "",
                    this.appId || "",
                    this.appSupportInfo || ""
                ];

            [
                "technicalAppComponentId",
                "appVersion",
                "appFrameworkId",
                "appFrameworkVersion",
                "contentProviderLabel",
                "userAgentFld",
                "productName",
                "productVersionFld",
                "systemName",
                "systemRole",
                "tenantRole",
                "appId",
                "appSupportInfo"
            ].forEach(function (sField, index) {
                assert.ok(aDialogContent[index * 2].isA("sap.m.Label"), "Content " + (index * 2) + " is a label");
                assert.strictEqual(aDialogContent[index * 2].getText(), resources.i18n.getText(sField),
                    "Value of label for " + sField + "  at " + (index * 2) + " is correct (" + resources.i18n.getText(sField) + ").");
                assert.ok(aDialogContent[index * 2 + 1].isA("sap.m.Text"), "Content " + (index * 2 + 1) + " is a text");
                assert.strictEqual(aDialogContent[index * 2 + 1].getText(), aExpectedValues[index],
                    "Value of text for " + sField + " at " + (index * 2 + 1) + " is correct (" + aExpectedValues[index] + ")."
                );
                assert.strictEqual(aDialogContent[index * 2 + 1].getVisible(), !!aExpectedValues[index],
                    "Text for " + sField + " at " + (index * 2 + 1) + " is " + (aExpectedValues[index] ? "visible" : "hidden")
                );
            });
        }.bind(this));
    }

    QUnit.test("getInfo returns all parameters as undefined", function (assert) {
        // Arrange & Act & Assert
        return showAboutDialogTest.call(this, assert);
    });

    QUnit.test("getInfo returns all parameters, if they are defined", function (assert) {
        // Arrange
        this.technicalAppComponentId = "techAppCompId";
        this.appVersion = "appVer";
        this.appFrameworkId = "appFrameId";
        this.appId = "appId";
        this.appSupportInfo = "appSupportInfo";

        sandbox.stub(sap.ushell.Container, "getLogonSystem").returns({
            getProductName: sandbox.stub().returns("Demo Product Name"),
            getProductVersion: sandbox.stub().returns("Demo Product Version"),
            getSystemName: sandbox.stub().returns("Demo System Name"),
            getSystemRole: sandbox.stub().returns("Demo System Role"),
            getTenantRole: sandbox.stub().returns("Demo Tenant Role")
        });

        // Arrange & Act & Assert
        return showAboutDialogTest.call(this, assert);
    });

    QUnit.test("appFrameworkVersion is displayed, if the current application id the homepage", function (assert) {
        // Arrange
        this.appFrameworkVersion = "appFrameVer";
        this.homePage = true;

        // Arrange & Act & Assert
        return showAboutDialogTest.call(this, assert);
    });

    QUnit.test("providerId is displayed, if the config setting is enabled", function (assert) {
        // Arrange
        Config.emit("/core/contentProviders/providerInfo/show", true);
        this.providerId = "provId";

        // Arrange & Act & Assert
        return showAboutDialogTest.call(this, assert);
    });

}, /* bExport= */false);
