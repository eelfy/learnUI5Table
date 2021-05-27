// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.JamShareButton
 */
sap.ui.require([
    "sap/collaboration/components/fiori/sharing/dialog/Component",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/JamShareButton"
], function (SharingComponent, AppRuntimeService, resources, JamShareButton) {
    "use strict";
    /* global QUnit sinon start*/

    QUnit.module("sap.ushell.ui.footerbar.JamShareButton");

    QUnit.test("Constructor Test", function (assert) {
        var oJamShareButton = new JamShareButton();
        assert.strictEqual(oJamShareButton.getIcon(), "sap-icon://share-2", "Check button icon");
        assert.strictEqual(oJamShareButton.getText(), resources.i18n.getText("shareBtn"), "Check button title");
    });


    QUnit.test("showShareDialog Test", function (assert) {
        var oSettingsData = {};
        var oSandBox = sinon.sandbox.create();

        oSandBox.stub(SharingComponent.prototype, "createContent", function () {});
        oSandBox.stub(SharingComponent.prototype, "setSettings", function (settingObject) {
            oSettingsData = settingObject.object;
        });
        oSandBox.stub(SharingComponent.prototype, "open", function () {});

        var oJamShareButton = new sap.ushell.ui.footerbar.JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test title"}),
                    share: "sharing"
                }
            }
        });

        //Show the dialog
        oJamShareButton.showShareDialog();
        assert.strictEqual(oSettingsData.id, window.location.href, "Check id");
        assert.strictEqual(oSettingsData.display.getText(), "Test title", "Check display title");
        assert.strictEqual(oSettingsData.share, "sharing", "Check share");
        oSandBox.restore();
    });

    QUnit.asyncTest("showShareDialog in cFLP Test", function (assert) {
        var oSettingsData = {};

        var SharingDialogComponent = sap.ui.require("sap/collaboration/components/fiori/sharing/dialog/Component");

        var oSandBox = sinon.sandbox.create();

        oSandBox.stub(SharingDialogComponent.prototype, "createContent", function () {});
        oSandBox.stub(SharingDialogComponent.prototype, "setSettings", function (settingObject) {
            oSettingsData = settingObject.object;
        });

        var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test title"}),
                    share: "sharing"
                }
            }
        });

        sinon.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
            new jQuery.Deferred().resolve("www.flp.com").promise()
        );

        sap.ushell.Container = {
            inAppRuntime: sinon.stub().returns(true),
            getFLPUrl: function (bIncludeHash) {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.Container.getFLPUrl", {
                        bIncludeHash: bIncludeHash
                    });
            }
        };

        var getFLPUrlStub = sinon.spy(sap.ushell.Container, "getFLPUrl");

        oSandBox.stub(SharingDialogComponent.prototype, "open", function () {
            assert.ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            assert.ok(getFLPUrlStub.calledOnce, "getFLPUrl should be called only once");
            assert.strictEqual(oSettingsData.id, "www.flp.com", "Check id");
            assert.strictEqual(oSettingsData.display.getText(), "Test title", "Check display title");
            assert.strictEqual(oSettingsData.share, "sharing", "Check share");
            start();
            AppRuntimeService.sendMessageToOuterShell.restore();
            getFLPUrlStub.restore();
            delete sap.ushell.Container;
            oSandBox.restore();
        });

        //Show the dialog
        jamShareButton.showShareDialog();
    });

    QUnit.asyncTest("adjustFLPUrl", function (assert) {
        var jamShareButton = new JamShareButton();

        sinon.stub(AppRuntimeService, "sendMessageToOuterShell").returns(
                new jQuery.Deferred().resolve("www.flp.com").promise()
            );

        sap.ushell.Container = {
            getFLPUrl: function (bIncludeHash) {
                return AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.Container.getFLPUrl", {
                        bIncludeHash: bIncludeHash
                    });
            }
        };

        var oJamData = {
                object: {
                    id: window.location.href,
                    share: "static text to share in JAM together with the URL"
                }
            },
            getFLPUrlStub = sinon.spy(sap.ushell.Container, "getFLPUrl");

        jamShareButton.adjustFLPUrl(oJamData).then(function () {
            assert.ok(AppRuntimeService.sendMessageToOuterShell.calledOnce, "sendMessageToOuterShell should be called only once");
            assert.ok(getFLPUrlStub.calledOnce, "getFLPUrl should be called only once");
            assert.strictEqual(oJamData.object.id, "www.flp.com");
            assert.strictEqual(oJamData.object.share, "static text to share in JAM together with the URL");
            start();
            AppRuntimeService.sendMessageToOuterShell.restore();
            getFLPUrlStub.restore();
            delete sap.ushell.Container;
        });
    });
});
