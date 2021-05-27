// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/*global jQuery, sap, window */
jQuery.sap.require("sap.m.MessageToast");

var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
    oShellHeadItem = undefined;

sap.ui.controller("sap.ushell.demo.AppRuntimeRendererSample.App", {

    onCreateBtn : function() {
        var that = this;

        oRenderer.addHeaderItem(
            "sap.ushell.ui.shell.ShellHeadItem",
            {
                id: "idButtonAdd",
                icon: "sap-icon://flight",
                tooltip: "add 2 numbers",
                click: function () {
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) + Number(oView.byId("idNumber2").getValue()));
                }
            },
            true,
            true,
            ["app"]);
    },

    onCreateEndBtn : function() {
        var that = this;
        oRenderer.addHeaderEndItem(
            "sap.ushell.ui.shell.ShellHeadItem",
            {
                id: "idButtonSub",
                icon: "sap-icon://flight",
                tooltip: "subtrut 2 numbers",
                click: function () {
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
                }
            },
            true,
            true,
            ["app"]);
    },

    onRemoveBtn : function() {
        oRenderer.hideHeaderItem(
            ["idButtonAdd"],
            false
        );
    },

    onRemoveEndBtn : function() {
        oRenderer.hideHeaderEndItem(
            ["idButtonSub"],
            true
        );
    },

    onShowBtn : function() {
        oRenderer.showHeaderItem(
            ["idButtonAdd"],
            true
        );
    },

    onShowEndBtn : function() {
        oRenderer.showHeaderEndItem(
            ["idButtonSub"],
            true
        );
    },

    onSetHeaderTitle : function() {
        oRenderer.setHeaderTitle(
            this.getView().byId("idTitle").getValue()
        );
    },

    onHideHeader : function() {
        oRenderer.setHeaderVisibility(
            false,
            true
        );
    },

    onShowHeader : function() {
        oRenderer.setHeaderVisibility(
            true,
            true
        );
    },

    onCreateShellItem: function() {
        var that = this;
        if (!oShellHeadItem) {
            oShellHeadItem = new sap.ushell.ui.shell.ShellHeadItem({
                id: "idAlon",
                icon: "sap-icon://account",
                tooltip: "this is ShellHeadItem",
                press: function () {
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) * Number(oView.byId("idNumber2").getValue()));
                }
            });
        }
    },

    onShowShellItem : function() {
        if (oShellHeadItem) {
            oRenderer.showHeaderItem(
                oShellHeadItem.id,
                true
            );
        }
    },

    onHideShellItem : function() {
        if (oShellHeadItem) {
            oRenderer.hideHeaderItem(
                oShellHeadItem.id,
                true
            );
        }
    },

    onShowShellItemEnd : function() {
        if (oShellHeadItem) {
            oRenderer.showHeaderEndItem(
                oShellHeadItem.id,
                true
            );
        }
    },

    onAddUserAction: function () {
        var that = this;

        oRenderer.addUserAction({
            controlType : "sap.m.Button",
            oControlProperties : {
                id: "idUserAction",
                text: "User Action Button",
                icon: "sap-icon://refresh",
                press: function () {
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) / Number(oView.byId("idNumber2").getValue()));
                }
            },
            bIsVisible: true,
            bCurrentState: true
        });
    },

    onHideActionButton : function() {
        oRenderer.hideActionButton(
            "idUserAction",
            true
        );
    },

    onShowActionButton : function() {
        oRenderer.showActionButton(
            "idUserAction",
            true
        );
    }
});