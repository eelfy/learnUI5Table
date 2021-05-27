/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe.plugins
 * @private
 */

/**
 * Initialization Code and shared classes of library sap.fe.templates
 */
sap.ui.define(
	[
		"sap/ui/core/Core" // implicit dependency, provides sap.ui.getCore()
	],
	function() {
		"use strict";

		/**
		 * Fiori Elements Plugins Library
		 *
		 * @namespace
		 * @name sap.fe.plugins
		 * @private
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe.plugins",
			dependencies: ["sap.ui.core", "sap.fe.templates"],
			types: [],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.88.0",
			noLibraryCSS: true
		});

		return sap.fe.plugins;
	}
);
