// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.componentData.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppComponentData.Component", {

    metadata: {

        version: "1.88.0-SNAPSHOT",

        library: "sap.ushell.demo.AppComponentData",

        includes: [ ],

        dependencies: {
            libs: [ "sap.m" ],
            components: []
        },
        config: {
            title: "App componentData",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            icon: "sap-icon://Fiori2/F0429",
            fullWidth: true
        }
    },

    // eslint-disable-next-line strict
    createContent: function () {
        return sap.ui.xmlview("sap.ushell.demo.AppComponentData.App");
    }
});
