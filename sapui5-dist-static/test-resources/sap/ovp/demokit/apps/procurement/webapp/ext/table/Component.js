(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("procurement.ext.table.Component");
    jQuery.sap.require("sap.ovp.cards.custom.Component");

    sap.ovp.cards.custom.Component.extend("procurement.ext.table.Component", {
        // use inline declaration instead of component.json to save 1 round trip
        metadata: {
            properties: {
                "contentFragment": {
                    "type": "string",
                    "defaultValue": "procurement.ext.table.Table"
                },
                "annotationPath": {
                    "type": "string",
                    "defaultValue": "com.sap.vocabularies.UI.v1.LineItem"
                },
                "countHeaderFragment":{
                    "type": "string",
                    "defaultValue": "sap.ovp.cards.generic.CountHeader"
                },
                "footerFragment":{
                    "type": "string",
                    "defaultValue": "sap.ovp.cards.generic.CountFooter"
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
                libs: [ "sap.m" ],
                components: []
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "procurement.ext.table.Table"
                    }
                }
            }
        }
    });
})();

