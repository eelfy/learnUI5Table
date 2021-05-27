/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */

//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.bookmark.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmark.Component", {
    metadata: {
        "manifest": "json"
    }
});
