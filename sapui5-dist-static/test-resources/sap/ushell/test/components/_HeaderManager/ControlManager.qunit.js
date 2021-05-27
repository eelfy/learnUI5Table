// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager.ControlManager
 */
sap.ui.require([
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/EventHub",
    "sap/ushell/components/_HeaderManager/ControlManager",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
], function (mobileLibrary, JSONModel, EventHub, ControlManager, resources) {
    "use strict";

    // shortcut for sap.m.AvatarSize
    var AvatarSize = mobileLibrary.AvatarSize;

    /* global QUnit, sinon */

    QUnit.module("init", {
        beforeEach: function () {

            this.oConfig = {
                rootIntent: "Shell-home"
            };

            this.oHeaderController = {
                pressNavBackButton: sinon.stub()
            };

            this.oModel = new JSONModel({
                notificationsCount: 5
            });

            return sap.ushell.bootstrap("local");
        },
        afterEach: function () {
            ControlManager.destroy();
            delete sap.ushell.Container;
            EventHub._reset();
        }
    });

    QUnit.test("MeArea Avatar correctly created", function (assert) {
        // Act
        ControlManager.init(this.oConfig, this.oHeaderController, this.oModel);

        // Assert
        var oMeAreaAvatar = sap.ui.getCore().byId("meAreaHeaderButton");
        var oUser = sap.ushell.Container.getUser();
        assert.strictEqual(oMeAreaAvatar.isA("sap.m.Avatar"), true, "The control type is correct.");
        assert.strictEqual(oMeAreaAvatar.getInitials(), oUser.getInitials(), "The initials property is correct.");
        assert.strictEqual(oMeAreaAvatar.getDisplaySize(), AvatarSize.Custom, "The displaySize property is correct.");
        assert.strictEqual(oMeAreaAvatar.getCustomDisplaySize(), "2.25rem", "The customDisplaySize property is correct.");
        assert.strictEqual(oMeAreaAvatar.getTooltip(), resources.i18n.getText("MeAreaToggleButtonAria", oUser.getFullName()),
            "The tooltip is correct.");
        assert.strictEqual(oMeAreaAvatar.getModel(), this.oModel, "The model is set correctly.");
    });

});
