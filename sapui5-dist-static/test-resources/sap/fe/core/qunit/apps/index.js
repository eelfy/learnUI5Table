sap.ui.define(["./generalTests"], function(generalTests) {
	"use strict";

	// adding app tests
	var appTests = [generalTests];

	function addAppName(app) {
		if (!app || !app.aTestList) {
			throw new Error("aTestList is required for app " + app.appName + ".");
		}
		if (!app.appName) {
			throw new Error("appName is required for test.");
		}

		return app.aTestList.map(function(test) {
			test.group.unshift(app.appName);
			return test;
		});
	}

	var oTestList = appTests
		.reduce(function(reducer, test) {
			return reducer.concat(addAppName(test));
		}, [])
		.reduce(function(reducer, oTestData) {
			reducer[oTestData.name] = oTestData;
			return reducer;
		}, {});

	return {
		oTestList: oTestList
	};
});
