/*global sap */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.app4ContentProviderA", {

        oMainView : null,

        metadata : {
            version : "1.88.1",
            library : "sap.ushell.demo.app4ContentProviderA",
            dependencies : {
                libs : [ "sap.m" ],
                components : []
            },
            config: {
                "title": "App4",
                "icon" : "sap-icon://Fiori2/F0429"
            }
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.app4ContentProviderA.App");
            return this.oMainView;
        }

    });

});

