// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
        oPostMessageInterface;

    return Controller.extend("sap.ushell.demo.CFLPPluginsSample.yellowBoxPlugin.floating.controller", {

        onInit: function(oEvent) {
            this.oModel = new sap.ui.model.json.JSONModel();
            this.oModel.setData([]);
            this.getView().setModel(this.oModel);
            this.waitForCommEstablished();
            sap.ui.getCore().getEventBus().subscribe("ybplugin", "registerPostMessages", this.registerPostMessages, this);
        },

        onClose: function () {
            oRenderer.setFloatingContainerVisibility(false);
        },

        registerPostMessages: function (oEvent, sChannel, oData) {
            var that = this;

            oPostMessageInterface = oData;

            oPostMessageInterface.registerPostMessageAPIs({
                "user.postapi.ybactions": {
                    inCalls: {
                        "agentStarted": {
                            executeServiceCallFn: function (oServiceParams) {
                                that.addLogItem("Agent connected successfully");
                                that.checkConnToAgent();
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "writeLog": {
                            executeServiceCallFn: function (oServiceParams) {
                                that.addLogItem(oServiceParams.oMessageData.body.sMsg);
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                },
                "user.postapi.bbactions": {
                    outCalls: {
                        "helloFromParent": {}
                    }
                }
            });
        },

        checkConnToAgent: function () {
            var that = this;
            setTimeout(function () {
                oPostMessageInterface.postMessageToApp(
                    "user.postapi.bbactions",
                    "helloFromParent").done(function (oRes) {
                    that.addLogItem(oRes.result)
                });
            }, 1);
        },

        waitForCommEstablished: function() {
            this.bCommEstablished = false;
            this.addLogItem("Waiting for agent to connect...")
        },

        addLogItem: function (sMsg) {
            var oData = this.oModel.getProperty("/");
            oData.push({ "Value": (new Date().toLocaleTimeString()) + " - " + sMsg });
            this.oModel.setProperty("/", oData);
        }
    });
});