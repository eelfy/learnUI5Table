sap.ui.define(["sap/ui/Device", "./../common/utility", "sap/base/util/LoaderExtensions"], function(Device, oUtility, LoaderExtensions) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "GENERAL";

	sap.ui.loader.config({ paths: { "/test/sap/fe/core/qunit": "/test-resources/sap/fe/core/qunit" } });
	var aTests = LoaderExtensions.loadResource("/test/sap/fe/core/qunit/apps/generalTests.json");

	return {
		aTestList: aTests.map(function(oTest) {
			if (oTest.skip === undefined) {
				oTest.skip = notInTestSuite;
			}
			return oTest;
		}),
		appName: appName
	};
});
