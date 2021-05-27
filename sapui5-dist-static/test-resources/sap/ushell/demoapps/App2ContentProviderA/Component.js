/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.app2ContentProviderA.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.app2ContentProviderA.Component", {
    oMainView : null,

    metadata : {
        version : "1.88.1",
        library : "sap.ushell.demo.app2ContentProviderA",
        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "App2",
            "icon" : "sap-icon://Fiori2/F0429"
        }
    },

    createContent : function () {
        "use strict";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.app2ContentProviderA.App");
        return this.oMainView;
    }
});
