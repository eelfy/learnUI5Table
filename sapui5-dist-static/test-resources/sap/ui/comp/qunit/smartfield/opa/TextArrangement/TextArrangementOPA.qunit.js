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
				appUrl: "test-resources/sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/TextArrangement.html"
			}
		},
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: false,
		timeout: 30
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/TextArrangement/applicationUnderTest/test/pages/Application"
	]);

	QUnit.module("ValueList single KEY relationship");

	opaTest("Requests are only for Key - no substringof in the request", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("Name", "2");

		// Assert
		Then.onTheApplicationPage.iShouldCheckTheRequestParameters();
	});

	opaTest("Only one request is made per value change", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("Name", "3");

		// Assert
		Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

		// Act
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("Name", "1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

		// Act - value does not exist in value list
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("Name", "7");

		// Assert
		Then.onTheApplicationPage.iShouldSeeNumberOfRequests(1, "StringVH");

		// Shutdown
		Given.iStopMyApp();
	});

	QUnit.module("ValueListNoValidation compound KEY relationship");

	opaTest("Requests are only for Key - no substringof in the request", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')");

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("ProductName", "3");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "3 (ValueList 3)");
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '3' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')");
		Then.onTheApplicationPage.iCheckTheRequestHasNoSubstringText();

		// Shutdown
		Given.iStopMyApp();
	});

	QUnit.module("ValueListNoValidation synchronous model update");

	opaTest("Value written to the model synchronous", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		When.onTheApplicationPage.iClearTheLog();

		// Assert
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
		Then.waitFor({
			id: "ProductName",
			success: function (oSmartField) {
				Opa5.assert.strictEqual(
					oSmartField.getTextInEditModeSource(), "ValueListNoValidation",
					"SmartField is in ValueListNoValidation mode");
			}
		});

		// Act
		When.onTheApplicationPage.iChangeTheValueTo("ProductName", "3");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 3", 0);
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '3' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 1);

		// Act - non existing value
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("ProductName", "7");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 7", 0);
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '7' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 1);
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "7");

		// Act - existing value
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("ProductName", "1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 1", 0);
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '1' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 1);
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "1 (ValueList 1)");

		// Act - initial value
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheValueTo("ProductName", "2");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': undefined", 0);
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '2' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 1);
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "2 (ValueList 2)");
	});

	QUnit.module("ValueListNoValidation description update on model change");

	opaTest("Value written to the model synchronous", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();
		When.onTheApplicationPage.iClearTheLog();

		// Act
		When.onTheApplicationPage.iChangeTheInputValueTo("1");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSimpleLogEntry("Change event fired for 'ProductName': 1", null, 0);
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "1 (ValueList 1)");
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '1' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 0);

		// Act - non existing value
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheInputValueTo("9");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "9");
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '9' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 0);

		// Act - existing value
		When.onTheApplicationPage.iClearTheLog();
		When.onTheApplicationPage.iChangeTheInputValueTo("4");

		// Assert
		Then.onTheApplicationPage.iShouldSeeSmartFieldWithIdAndValue("ProductName", "4 (ValueList 4)");
		Then.onTheApplicationPage.iShouldSeeRequest("testService/ProductVH?$select=KEY,TXT&$top=2&$filter=KEY eq '4' and (CONSTANT eq 'Bulgaria' and KEY2 eq 'AAA')", 0);

		// Shutdown
		Given.iStopMyApp();
	});

	QUnit.start();
});
