/*global sap */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.localApp.Component", {

        oMainView : null,

        metadata : {
            version : "1.88.1",
            library : "sap.ushell.demo.localApp",
            dependencies : {
                libs : [ "sap.m" ],
                components : []
            },
            config: {
                "title": "Local App",
                "icon" : "sap-icon://Fiori2/F0429"
            }
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.localApp.App");
            return this.oMainView;
        }

    });

});

