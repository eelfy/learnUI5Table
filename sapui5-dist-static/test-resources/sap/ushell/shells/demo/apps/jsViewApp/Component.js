// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.letterBoxing.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("shells.demo.apps.jsViewApp.Component", {

	metadata : {

		version : "1.88.1",

		library : "shells.demo.apps.jsViewApp",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
            "title": "App letterBoxing",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0429",
			fullWidth: true
        }
	},

	createContent : function() {
		return sap.ui.xmlview("shells.demo.apps.jsViewApp.App");
	}
});
