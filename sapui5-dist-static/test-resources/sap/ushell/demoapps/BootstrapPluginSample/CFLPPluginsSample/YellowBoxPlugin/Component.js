// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer"
], function (Component, ComponentContainer) {
    "use strict";

    var oRenderer = sap.ushell.Container.getRenderer("fiori2");

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.yellowBoxPlugin.Component", {

        metadata: {
            version: "1.88.1",
            library: "sap.ushell.demo.CFLPPluginsSample.yellowBoxPlugin"
        },

        init: function () {
            this.createLogScreen();
            oRenderer.addHeaderEndItem(
                "sap.ushell.ui.shell.ShellHeadItem", {
                    icon: "sap-icon://co",
                    id: "copilotBtn",
                    press: function() {oRenderer.setFloatingContainerVisibility(!oRenderer.getFloatingContainerVisiblity());}
                },
                true,
                false);
        },

        createLogScreen: function () {
            var oComponent = sap.ui.getCore().createComponent({
                name: "sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.yellowBoxPlugin.floatingWindow",
            });

            this._oCopilotCoreComponentContainer = new ComponentContainer({
                height: this._calculateCopilotContainerHeight(),
                width: "100%",
                component: oComponent
            });

            oRenderer.setFloatingContainerContent(this._oCopilotCoreComponentContainer);
            setTimeout(function () {
                oRenderer.setFloatingContainerDragSelector(".copilotDragableHandle");
            }, 1000);
            oRenderer.setFloatingContainerVisibility(false);

            sap.ui.getCore().getEventBus().publish("ybplugin", "registerPostMessages", this.getComponentData().oPostMessageInterface);
        },

        _calculateCopilotContainerHeight: function (iModify) {
            var nWindowREMHeight = parseInt(jQuery(window).height() / parseFloat(jQuery("html").css("font-size")), 10) - 8;
            return Math.min(nWindowREMHeight, 46) + "rem";
        },

        exit: function () {
        }
    });
});
