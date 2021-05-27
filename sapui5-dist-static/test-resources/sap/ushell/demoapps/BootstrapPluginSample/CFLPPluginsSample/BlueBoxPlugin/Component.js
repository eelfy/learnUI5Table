// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer"
], function (Component, ComponentContainer) {
    "use strict";

    var oPostMessageInterface;

    return Component.extend("sap.ushell.demo.BootstrapPluginSample.CFLPPluginsSample.blueBoxPlugin.Component", {

        metadata: {
            version: "1.88.1",
            library: "sap.ushell.demo.CFLPPluginsSample.blueBoxPlugin"
        },

        init: function () {
            oPostMessageInterface = this.getComponentData().oPostMessageInterface;

            oPostMessageInterface.registerPostMessageAPIs({
                "user.postapi.bbactions": {
                    inCalls: {
                        "helloFromParent": {
                            executeServiceCallFn: function (oServiceParams) {
                                return new jQuery.Deferred().resolve({result: "Response from Plugin 1234"}).promise();
                            }
                        }
                    }
                }
            });

            oPostMessageInterface.postMessageToFlp(
                "user.postapi.ybactions",
                "agentStarted");

            function treatHashChanged (newHash/*, oldHash*/) {
                if (newHash && typeof newHash === "string" && newHash.length > 0) {
                    oPostMessageInterface.postMessageToFlp(
                        "user.postapi.ybactions",
                        "writeLog",
                        {
                            "sMsg" : newHash
                        });
                }
            }
            window.hasher.changed.add(treatHashChanged.bind(this), this);
        },

        exit: function () {
        }
    });
});
