/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

/**
 * @namespace
 * @name sap.fe.placeholder
 * @private
 * @experimental
 */

/**
 * Initialization Code and shared classes of library sap.fe.core
 */
sap.ui.define(
	[
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore()
		"sap/ui/core/library" // library dependency
	],
	function() {
		"use strict";

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe.placeholder",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.88.0",
			noLibraryCSS: false,
			extensions: {}
		});

		return sap.fe.placeholder;
	}
);
