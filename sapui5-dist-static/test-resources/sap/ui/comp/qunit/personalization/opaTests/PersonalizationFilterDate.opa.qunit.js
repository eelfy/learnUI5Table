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

	opaTest("When adding a Filter for 'Date' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("equal to");
		When.iEnterTextInDatePicker("Value", "May 14, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "EQ",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "May 15, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "BT",
					"oValue1": "2019-05-14T00:00:00.000Z",
					"oValue2": "2019-05-15T00:00:00.000Z",
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("Entering only a 'from' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "May 14, 2019");
		When.iEnterTextInDatePicker("to", "");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	opaTest("Entering only a 'to' value for the 'between' operator should cause a warning", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("between");
		When.iEnterTextInDatePicker("from", "");
		When.iEnterTextInDatePicker("to", "May 14, 2019");
		When.iPressOkButton();

		//Assertions
		Then.iShouldSeeWarning();

		//Actions - cleanup for next tests
		When.iPressOnIgnoreButton();
	});

	opaTest("When adding a Filter for 'Date' using 'before' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("before");

		When.iEnterTextInDatePicker("Value", "May 17, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (before)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LT",
					"oValue1": "2019-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("after");
		When.iEnterTextInDatePicker("Value", "May 17, 2018");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GT",
					"oValue1": "2018-05-17T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'before or on' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("before or on");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (before or on)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "LE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Date' using 'on or after' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iPressRestoreButton(); // Cleanup from previous tests
		When.iChangeTheFilterField("Date").and.iChangeTheCondition("on or after");
		When.iEnterTextInDatePicker("Value", "May 13, 2019");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (on or after)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Date",
					"sOperator": "GE",
					"oValue1": "2019-05-13T00:00:00.000Z",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
