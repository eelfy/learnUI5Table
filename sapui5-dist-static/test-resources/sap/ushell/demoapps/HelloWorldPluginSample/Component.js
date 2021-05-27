// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Component",
    "sap/bsae/Log"
], function (
    Component,
    Log
) {
    "use strict";

    Component.extend("sap.ushell.demo.HelloWorldPluginSample.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            Log.info("HelloWorldPluginSample initialized", undefined, "sap.ushell.demo.HelloWorldPluginSample.Component");

            // just for demo - do NOT directly trigger UI actions in productive plug-ins.
            // UI5 is available, but DOM might not be ready yet.
            if (sap.ui.getCore().isInitialized()) {
                this._sayHello();
            } else {
                sap.ui.getCore().attachInit(this._sayHello.bind(this));
            }
        },

        _sayHello: function () {
            var oConfig = this.getComponentData().config,
                sMessage = (oConfig && oConfig.message) || "Hello World from SAP Fiori launchpad plug-in",
                iDuration = oConfig && oConfig.duration;

            sap.m.MessageToast.show(sMessage, {
                duration: iDuration
            });
        }
    });
});
