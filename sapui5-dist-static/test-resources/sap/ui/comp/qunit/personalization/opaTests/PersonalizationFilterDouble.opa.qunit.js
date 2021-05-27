/* global QUnit */

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'./Arrangement',
	'./Action',
	'./Assertion',
	'sap/ui/Device'
], function (
	Opa5,
	opaTest,
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

	opaTest("When adding a Filter for 'Number' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("equal to");
		When.iPressDeleteRowButton(1);
		When.iEnterTextInInput("Value", "123.456");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "EQ",
					"oValue1": 123.456,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Number' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "1");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "LT",
					"oValue1": 1,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Number' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "12");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "LE",
					"oValue1": 12,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Number' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "1.45");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "GT",
					"oValue1": 1.45,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);

	});

	opaTest("When adding a Filter for 'Number' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "1.5");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "GE",
					"oValue1": 1.5,
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Number' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Number").and.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "1");
		When.iEnterTextInInput("to", "5000");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Number",
					"sOperator": "BT",
					"oValue1": 1,
					"oValue2": 5000,
					"_bMultiFilter": false
				}
			]
		);
		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
