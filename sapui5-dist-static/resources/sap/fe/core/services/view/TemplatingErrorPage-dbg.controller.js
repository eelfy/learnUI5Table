/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/fe/core/controllerextensions/InternalRouting"], function(Controller, InternalRouting) {
	"use strict";

	return Controller.extend("sap.fe.core.services.view.TemplatingErrorPage", {
		_routing: InternalRouting
	});
});
