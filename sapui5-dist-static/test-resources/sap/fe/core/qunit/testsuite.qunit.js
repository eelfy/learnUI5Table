sap.ui.define(["./common/testHelper", "./common/utility"], function(TestHelper, Utility) {
	"use strict";
	var sSelectedTests = Utility.searchParams("runTests"),
		sSelectedTestGroups = Utility.searchParams("runTestGroups"),
		sExcludeTestGroups = Utility.searchParams("excludeTestGroups");

	return {
		name: "QUnit TestSuite for sap.fe (runs only under /testsuite)",
		defaults: {
			ui5: {
				language: "en",
				noConflict: true,
				theme: "sap_fiori_3",
				resourceRoots: {
					"test.sap.fe.core.internal": "/test-resources/sap/fe/core/internal"
				},
				libs: ["sap.fe.core", "sap.fe.test"]
			},
			sinon: true,
			loader: {
				paths: {
					tests: "test-resources/sap/fe/core/qunit",
					qunit: "test-resources/sap/fe/core/qunit"
				}
			},
			bootCore: true,
			qunit: {
				version: 1
			}
		},
		tests: TestHelper.createTestSuite(sSelectedTestGroups, sSelectedTests, sExcludeTestGroups)
	};
});
