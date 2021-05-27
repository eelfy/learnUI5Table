(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("procurement.ext.list.Component");
    jQuery.sap.require("sap.ovp.cards.custom.Component");

    sap.ovp.cards.custom.Component.extend("procurement.ext.list.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            properties: {
                "contentFragment": {
                    "type": "string",
                    "defaultValue": "procurement.ext.list.List"
                },
                "annotationPath": {
                    "type": "string",
                    "defaultValue": "com.sap.vocabularies.UI.v1.LineItem"
                },
                "countHeaderFragment":{
                    "type": "string",
                    "defaultValue": "sap.ovp.cards.generic.CountHeader"
                },
                "headerFragment": {
                    "type": "string",
                    "defaultValue": ""
                },
                "footerFragment":{
                    "type": "string",
                    "defaultValue": ""
                },
                "headerExtensionFragment":{
                    "type": "string",
                    "defaultValue": "sap.ovp.cards.generic.KPIHeader"
                }
            },

            version: "@version@",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: [ "sap.m" ,"sap.suite.ui.microchart"],
                components: []
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "procurement.ext.list.List"
                    }
                }
            }
        }
    });
})();
