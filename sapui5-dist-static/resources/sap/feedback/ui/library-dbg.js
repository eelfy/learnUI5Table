/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * Initialization Code and shared classes of library sap.feedback.ui.
 */
sap.ui.define(["sap/ui/core/library"],
	function(library1) {
    //Keep library dependency even if not used.
	"use strict";


	/**
	 * UI5 library: sap.feedback.ui.
	 *
	 * @namespace
	 * @name sap.feedback.ui
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.feedback.ui",
		dependencies : ["sap.ui.core"],
		interfaces: [],
		elements: [],
		noLibraryCSS: true,
		version: "1.88.0"
	});

	return sap.feedback.ui;

});
