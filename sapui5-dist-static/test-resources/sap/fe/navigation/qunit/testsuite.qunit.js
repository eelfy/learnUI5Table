sap.ui.define(["sap/ui/Device", "sap/base/util/LoaderExtensions"], function(Device, LoaderExtensions) {
	"use strict";
	sap.ui.loader.config({ paths: { "/test/sap/fe/navigation/qunit": "/test-resources/sap/fe/navigation/qunit" } });
	var oTests = LoaderExtensions.loadResource("/test/sap/fe/navigation/qunit/index.json");
	return {
		name: "Library 'sap.fe.navigation'" /* Just for a nice title on the pages */,
		defaults: {
			group: "Library",
			qunit: {
				version: 2
				// Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 4
				// Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en",
				rtl: false, // Whether to run the tests in RTL mode
				libs: ["sap.ui.mdc"], // Libraries to load upfront in addition to the library which is tested (sap.ui.mdc), if null no libs are loaded
				"xx-waitForTheme": true
				// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only: "[sap/ui/mdc]", // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true
				// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			page: "test-resources/sap/fe/navigation/qunit/teststarter.qunit.html?testsuite={suite}&test={name}",
			autostart: true,
			module: "./{name}.qunit"
			// Whether to call QUnit.start() when the test setup is done
		},
		tests: oTests
	};
});
