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

	var fnGetTextArrangementUrl = function(sTextArrangement){
		var sParams = sTextArrangement ? "?TextArrangement=" + sTextArrangement : "";
		return "test-resources/sap/ui/comp/qunit/smartfield/opa/ValueListNoValidation/applicationUnderTest/ValueListNoValidation.html" + sParams;
	};

	var fnGetTextAnnotationUrl = function(sSetting){
		return "test-resources/sap/ui/comp/qunit/smartfield/opa/ValueListNoValidation/TextAnnotation/" + sSetting + "TextAnnotationValueListNoValidation.html";
	};

	Opa5.extendConfig({
		testLibs: {
			compTestLibrary: {}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: false,
		timeout: 60
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/ValueListNoValidation/applicationUnderTest/test/pages/Application"
	]);


	QUnit.module("Defaults");

	opaTest("Initial load -> Value 2 -> 2 results with the same key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Assert
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(2);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("2", 2);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 1 -> 1 result with a matching key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("1 (Key One Record)");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '1'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("1", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 3 -> zero results", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("3");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("3");
		Then.onTheApplicationPage.modelValueShouldMatch("3");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '3'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(0);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("3", 0);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 4 -> 4 records containing keys from 1 to 4 returned", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("4");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("4");
		Then.onTheApplicationPage.modelValueShouldMatch("4");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '4'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(4);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("1", 1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("2", 1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("3", 1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("4", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 5 -> 1 result with a matching key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("5");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("5 (Key Five)");
		Then.onTheApplicationPage.modelValueShouldMatch("5");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '5'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("5", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 6 -> 1 result with a not matching key (this should be addressed)", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("6");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("6 (Key does not match (0) instead of (5))");
		Then.onTheApplicationPage.modelValueShouldMatch("6");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '6'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(1);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("6", 0);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("0", 1);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 2 -> 2 results with the same key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl());

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2'");
		Then.onTheApplicationPage.theResponseCountShouldMatch(2);
		Then.onTheApplicationPage.theResponseCountShouldHaveAKey("2", 2);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Stop the app at the last config
		Given.iStopMyApp();
	});

	QUnit.module("TextArrangement=TextOnly");

	opaTest("Initial load -> Value 2 -> 2 results with the same key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Assert
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 1 -> 1 result with a matching key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("Key One Record");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 3 -> zero results", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("3");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("3");
		Then.onTheApplicationPage.modelValueShouldMatch("3");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '3'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 4 -> 4 records containing keys from 1 to 4 returned", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("4");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("4");
		Then.onTheApplicationPage.modelValueShouldMatch("4");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '4'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 5 -> 1 result with a matching key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("5");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("Key Five");
		Then.onTheApplicationPage.modelValueShouldMatch("5");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '5'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 6 -> 1 result with a not matching key (this should be addressed)", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("6");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("Key does not match (0) instead of (5)");
		Then.onTheApplicationPage.modelValueShouldMatch("6");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '6'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 2 -> 2 results with the same key", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldMatch("testService/StringVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2'");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
	});

	opaTest("Value 1 -> '' From a value with successful text retrieved to empty field with TextOnly text arrangement the field becomes busy forever", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextArrangementUrl("TextOnly"));

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("Key One Record");

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("");
		Then.onTheApplicationPage.modelValueShouldMatch(null);
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
		Then.onTheApplicationPage.iCheckSmartFieldIsNotBusy();

		Given.iStopMyApp();
	});


	QUnit.module("TextAnnotation");

	opaTest("V2 annotation", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextAnnotationUrl("V2"));

		Then.onTheApplicationPage.iShouldSeeAValue("1 (Local Text)");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.theRequestURLShouldMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2 (ValueList 2)");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldNotMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
		// Stop the app at the last config
		Given.iStopMyApp();
	});

	opaTest("V4 annotation", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextAnnotationUrl("V4"));

		Then.onTheApplicationPage.iShouldSeeAValue("1 (Local Text)");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.theRequestURLShouldMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2 (ValueList 2)");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldNotMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();
		// Stop the app at the last config
		Given.iStopMyApp();
	});

	opaTest("ControlConfiguration", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextAnnotationUrl("ControlConfiguration"));

		Then.onTheApplicationPage.iShouldSeeAValue("1 (Local Text)");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.theRequestURLShouldMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2 (ValueList 2)");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldNotMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Stop the app at the last config
		Given.iStopMyApp();
	});

	opaTest("CustomData", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning(fnGetTextAnnotationUrl("CustomData"));

		Then.onTheApplicationPage.iShouldSeeAValue("1 (Local Text)");
		Then.onTheApplicationPage.modelValueShouldMatch("1");
		Then.onTheApplicationPage.theRequestURLShouldMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeAValue("2 (ValueList 2)");
		Then.onTheApplicationPage.modelValueShouldMatch("2");
		Then.onTheApplicationPage.theRequestURLShouldNotMatch("");
		Then.onTheApplicationPage.controlShouldNotBeInErrorState();

		// Stop the app at the last config
		Given.iStopMyApp();
	});

	QUnit.start();
});
