sap.ui.define(["sap/fe/test/JourneyRunner", "sap/fe/test/Utils", "./FEArrangements", "sap/base/Log"], function(
	JourneyRunner,
	Utils,
	FEArrangements
) {
	"use strict";

	var FERunner = JourneyRunner.extend("sap.fe.test.internal.FEJourneyRunner", {
		getBaseArrangements: function(mSettings) {
			return new FEArrangements(mSettings);
		}
	});

	var DEFAULT_RUNNER = new FERunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {},
		opaConfig: {
			frameWidth: 1280,
			frameHeight: 1024
		}
	});
	var FCL_RUNNER = new FERunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {},
		opaConfig: {
			frameWidth: 1900,
			frameHeight: 1440
		}
	});
	var DEFAULT_JAVA_RUNNER = new JourneyRunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {
			manifest: "test/manifestJava.json"
		},
		opaConfig: {
			frameWidth: 1280,
			frameHeight: 1024
		}
	});

	FERunner.run = DEFAULT_RUNNER.run.bind(DEFAULT_RUNNER);
	FERunner.runFCL = FCL_RUNNER.run.bind(FCL_RUNNER);
	FERunner.runJava = DEFAULT_JAVA_RUNNER.run.bind(DEFAULT_JAVA_RUNNER);

	return FERunner;
});
