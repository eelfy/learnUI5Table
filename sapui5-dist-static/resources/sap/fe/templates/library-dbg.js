/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
/**
 * Initialization Code and shared classes of library sap.fe.templates
 */
sap.ui.define(
	[
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore()
		"sap/ui/core/library", // library dependency
		"sap/fe/core/library", // library dependency
		"sap/f/library", // library dependency
		"sap/fe/macros/library" // library dependency
	],
	function() {
		"use strict";

		/**
		 * Library providing the official templates supported by SAP Fiori elements.
		 *
		 * @namespace
		 * @name sap.fe.templates
		 * @public
		 */

		/**
		 * @namespace
		 * @name sap.fe.templates.ListReport
		 * @public
		 */

		/**
		 * @namespace
		 * @name sap.fe.templates.ObjectPage
		 * @public
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe.templates",
			dependencies: ["sap.ui.core", "sap.fe.core", "sap.fe.macros", "sap.f"],
			types: ["sap.fe.templates.ObjectPage.SectionLayout"],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.88.0",
			noLibraryCSS: true,
			extensions: {
				flChangeHandlers: {
					"sap.fe.templates.ObjectPage.controls.StashableHBox": "sap/fe/templates/ObjectPage/flexibility/StashableHBox",
					"sap.fe.templates.ObjectPage.controls.StashableVBox": {
						"stashControl": "default",
						"unstashControl": "default",
						"moveControls": "default"
					}
				}
			}
		});
		if (!sap.fe.templates.ObjectPage) {
			sap.fe.templates.ObjectPage = {};
		}
		sap.fe.templates.ObjectPage.SectionLayout = {
			/**
			 * All sections are shown in one page
			 * @public
			 */
			Page: "Page",

			/**
			 * All top-level sections are shown in an own tab
			 * @public
			 */
			Tabs: "Tabs"
		};

		return sap.fe.templates;
	}
);
