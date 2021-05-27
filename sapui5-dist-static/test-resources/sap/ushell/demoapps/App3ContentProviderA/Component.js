/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.app3ContentProviderA.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.app3ContentProviderA.Component", {
    oMainView : null,

    metadata : {
        version : "1.88.1",
        library : "sap.ushell.demo.app3ContentProviderA",
        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "G/L Account S/4HANA",
            "icon" : "sap-icon://Fiori2/F0429"
        }
    },

    createContent : function () {
        "use strict";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.app3ContentProviderA.App");
        return this.oMainView;
    }
});