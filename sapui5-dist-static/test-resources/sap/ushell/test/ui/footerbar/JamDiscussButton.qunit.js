// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.JamDiscussButton
 */
sap.ui.require([
    "sap/collaboration/components/fiori/feed/dialog/Component",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/JamDiscussButton"
], function (
    FeedDialogComponent,
    resources,
    JamDiscussButton
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell.ui.footerbar.JamDiscussButton");

    QUnit.test("Constructor Test", function (assert) {
        var JamDiscussDialog = new JamDiscussButton();
        assert.strictEqual(JamDiscussDialog.getIcon(), "sap-icon://discussion-2", "Check dialog icon");
        assert.strictEqual(JamDiscussDialog.getText(), resources.i18n.getText("discussBtn"), "Check dialog title");
    });

    QUnit.test("showDiscussDialog Test", function (assert) {
        var oSettingsData = {},
            oSandBox = sinon.sandbox.create();

        oSandBox.stub(FeedDialogComponent.prototype, "createContent", function () { });
        oSandBox.stub(FeedDialogComponent.prototype, "setSettings", function (settingObject) {
            oSettingsData = settingObject;
        });
        oSandBox.stub(FeedDialogComponent.prototype, "open", function () { });

        var JamDiscussDialog = new sap.ushell.ui.footerbar.JamDiscussButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({ text: "Test One" })
                },
                oDataServiceUrl: "Some url",
                feedType: "type",
                groupIds: "noGroups"
            }
        });

        // Show the dialog
        JamDiscussDialog.showDiscussDialog();
        assert.strictEqual(oSettingsData.object.id, window.location.href, "Check id");
        assert.strictEqual(oSettingsData.object.display.getText(), "Test One", "Check display text");
        assert.strictEqual(oSettingsData.oDataServiceUrl, "Some url", "Check oDataServiceUrl");
        assert.strictEqual(oSettingsData.feedType, "type", "Check feedType");
        assert.strictEqual(oSettingsData.groupIds, "noGroups", "Check groupIds");
        oSandBox.restore();
    });
});
