// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Avatar",
    "sap/m/library",
    "sap/ui/Device",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/renderers/fiori2/AccessKeysHandler"
], function (
    Avatar,
    mobileLibrary,
    Device,
    EventHub,
    resources,
    ShellHeadItem,
    AccessKeysHandler
) {
    "use strict";

    // shortcut for sap.m.AvatarSize
    var AvatarSize = mobileLibrary.AvatarSize;

    // List of the dangling controls created for the ShellHeader
    var aCreatedControlIds = [];

    function init (oConfig, oHeaderController, oShellModel) {
        //create only MeArea, because it is the hero element
        //the other button is created after core-ext-light
        aCreatedControlIds.push(_createMeAreaButton(oShellModel));

    }

    function destroy () {
        aCreatedControlIds.forEach(function (sId) {
            var oControl = sap.ui.getCore().byId(sId);
            if (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            }
        });
        aCreatedControlIds = [];
    }

    function _createMeAreaButton (oShellModel) {
        var sId = "meAreaHeaderButton",
            oUser = sap.ushell.Container.getUser(),
            sTooltip = resources.i18n.getText("MeAreaToggleButtonAria", oUser.getFullName());

        var oMeAreaAvatar = new Avatar({
            id: sId,
            src: "{/userImage/personPlaceHolder}",
            initials: oUser.getInitials(),
            customDisplaySize: "2.25rem",
            displaySize: AvatarSize.Custom,
            tooltip: sTooltip,
            press: function () {
                EventHub.emit("showMeArea", Date.now());
            }
        });
        if (Device.system.desktop) {
            oMeAreaAvatar.addEventDelegate({
                onsapskipforward: function (oEvent) {
                    AccessKeysHandler.bForwardNavigation = true;
                    oEvent.preventDefault();
                    window.document.getElementById("sapUshellHeaderAccessibilityHelper").focus();
                }
            });
        }
        oMeAreaAvatar.setModel(oShellModel);
        return sId;
    }

    return {
        init: init,
        destroy: destroy
    };
});
