/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/comp/integration/testlibrary/CompTestLibrary"
], function (
	Opa5,
	opaTest
) {
	"use strict";

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/CompoundKeys/applicationUnderTest/CompoundKeys.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: false,
		timeout: 120
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/CompoundKeys/applicationUnderTest/test/pages/Application"
	]);


	QUnit.module("Defaults");

	opaTest("Initial load -> Value 1 -> 1 result with the same key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '1' and (CategoryType eq 'Automotive' and KEY2 eq 'AAA' and KEY3 eq 'BBB')");
		Then.onTheApplicationPage.theResponseCountShouldMatch(1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("1", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});
	opaTest("Value 2 -> 1 result with a matching key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2 (ValueList 2)");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2' and (CategoryType eq 'Automotive' and KEY2 eq 'AAA' and KEY3 eq 'BBB')");
		Then.onTheApplicationPage.theResponseCountShouldMatch(1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("2", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
		Given.iStopMyApp();
	});

	QUnit.start();
});
