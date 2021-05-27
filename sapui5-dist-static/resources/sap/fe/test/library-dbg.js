/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore()
		"sap/ui/core/library" // library dependency
	],
	function() {
		"use strict";

		/**
		 * Test library for SAP Fiori elements
		 *
		 * @namespace
		 * @name sap.fe.test
		 * @public
		 */

		// library dependencies
		sap.ui.getCore().initLibrary({
			name: "sap.fe.test",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.88.0",
			noLibraryCSS: true
		});

		return sap.fe.test;
	}
);
