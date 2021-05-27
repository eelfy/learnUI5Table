/* global QUnit */

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Util',
	'./Arrangement',
	'./Action',
	'./Assertion',
	'sap/ui/Device'
], function (
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	Device
) {
	"use strict";

	Opa5.extendConfig({
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	opaTest("When I open the Settings dialog, I want to navigate to FilterPanel", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();

		//Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
	});

	opaTest("When clicking the KeyField ComboBox on the FilterPanel, I want a list of all filterable properties", function(Given, When, Then) {
		//Actions
		When.iClickOnComboBox("Category");

		//Assertions
		Then.iShouldSeeComboBoxItems([
			"Category",
			"Currency Code",
			"Date",
			"Name",
			"Price",
			"Product ID",
			"Status"
		]);
	});

	opaTest("When clicking the Operations control on the FilterPanel, I want a list of all possible operations", function(Given, When, Then) {
		//Actions
		When.iClickOnComboBox("contains", 1);

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"contains",
			"equal to",
			"between",
			"starts with",
			"ends with",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
	});

	opaTest("When changing from 'Category' to 'Date', the Select should have different items", function(Given, When, Then) {
		//Actions
		When.iClickOnComboBox("contains", 1); //close
		When.iChangeTheFilterField("Date");
		When.iClickOnComboBox("equal to", 1);

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"equal to",
			"between",
			"before",
			"before or on",
			"after",
			"on or after"
		]);
		When.iClickOnComboBox("equal to", 1);
	});

	opaTest("When changing from 'Date' to 'Supplier Name', the Select should have different items (maxlength: 1)", function(Given, When, Then) {
		//Actions
		When.iChangeTheFilterField("Supplier Name");
		When.iClickOnComboBox("equal to", 1);

		//Assertions
		Then.iShouldSeeIncludeOperations([
			"equal to",
			"between",
			"less than",
			"less than or equal to",
			"greater than",
			"greater than or equal to",
			"empty"
		]);
		When.iClickOnComboBox("equal to", 1);
	});

	opaTest("When switching from a 'Date' property to 'Boolean' the warning state should resolve upon changing the key", function(Given, When, Then) {
		//Actions
		When.iChangeTheFilterField("Depth");
		When.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "Test");
		When.iChangeTheFilterField("My Boolean");

		//Warning should disappear after the selection has been changed
		Then.iCheckSelectValueState("Warning");
		When.iChangeSelectSelection("Yes");
		Then.iCheckSelectValueState("None");
		When.iPressDeleteRowButton(0);

		//dialog needs to be closed for follow-up tests
		When.iPressOkButton();
		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
