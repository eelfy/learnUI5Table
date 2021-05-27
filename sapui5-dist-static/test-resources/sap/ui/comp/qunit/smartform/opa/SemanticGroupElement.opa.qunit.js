	/* eslint-disable no-undef */
	sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'./actions/SemanticGroupElement',
	'./assertions/SemanticGroupElement'
	], function (
	Opa5,
	opaTest,
	Arrangement,
	Actions,
	Assertions
	) {
	"use strict";

	var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/qunit/smartform/opa/SematicGroupElement/applicationUnderTest/SmartForm_sematicGroupElement.html");

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		arrangements: new Arrangement({}),
		assertions: Assertions,
		actions: Actions
	});

	// --- Default Field tests
	QUnit.module("Default Setup");

	opaTest("Should see the SmartForm", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeSmartForm();

		// Cleanup
		Then.iTeardownMyApp();

	});

	QUnit.module("Edit mode");

	opaTest("Should see SmartFields in edit mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeSmartFieldWithIdAndValue("__component0---IDView--Office", 1);

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see delimiters of SmartFields in edit mode", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Arrangements
		When.iToggleFormEditMode(true);

		// Assertions
		Then.iShouldSeeDelimiterOfSemanticFieldsInEditMode("__component0---IDView--SemanticGroupElement1-delimiter-0", "/");

		// Cleanup
		Then.iTeardownMyApp();
	});

	QUnit.module("Display mode");

	opaTest("Should see the semantically connected fields as text with delimiters", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame(appUrl);

		// Assertions
		Then.iShouldSeeSemanticFieldsAsText("__component0---IDView--SemanticGroupElement1-display");

		// Cleanup
		Then.iTeardownMyApp();
	});

});
