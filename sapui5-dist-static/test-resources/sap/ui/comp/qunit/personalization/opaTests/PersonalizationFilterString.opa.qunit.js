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

	opaTest("When adding a Filter for 'Category' using 'equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("equal to");
		When.iEnterTextInInput("Value", "Accessory");
		When.iPressOkButton();

		//Assertions
		Then.thePersonalizationDialogShouldBeClosed();

		/* CodeEditor ID's
		*
		* SmartTable personalization controller data: 'applicationUnderTestFiltering---IDView--dataTableController'
		* SmartTable _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--dataTable'
		* SmartChart personalization controller data: 'applicationUnderTestFiltering---IDView--currentSmartChartFilterDataController'
		* SmartChart _getPersonalizationData result : 'applicationUnderTestFiltering---IDView--currentSmartChartFilterData'
		*
		*/

		//-------------- operation: 'EQ' (equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "Accessory",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'contains' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("contains");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'Contains' (contains)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "Contains",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'starts with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("starts with");
		When.iEnterTextInInput("Value", "Ac");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'StartsWith' (starts with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "StartsWith",
					"oValue1": "Ac",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'ends with' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("ends with");

		When.iEnterTextInInput("Value", "ry");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EndsWith' (ends with)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EndsWith",
					"oValue1": "ry",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'less than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("less than");
		When.iEnterTextInInput("Value", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LT' (less than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LT",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'less than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("less than or equal to");
		When.iEnterTextInInput("Value", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'LE' (less than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "LE",
					"oValue1": "a",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'greater than' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("greater than");
		When.iEnterTextInInput("Value", "A");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GT' (greater than)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GT",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'greater than or equal to' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("greater than or equal to");
		When.iEnterTextInInput("Value", "A");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'GE' (greater than or equal to)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "GE",
					"oValue1": "A",
					"oValue2": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("empty");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category" field is annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category nullable' using 'empty' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category nullable").and.iChangeTheCondition("empty");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		// "Category nullable" field is not annotated as "nullable=false"
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "CategoryNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);
	});

	opaTest("When adding a Filter for 'Category' using 'between' the filter statement for the SmartTable should contain my entries", function(Given, When, Then) {
		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("Category").and.iChangeTheCondition("between");
		When.iEnterTextInInput("from", "A");
		When.iEnterTextInInput("to", "a");
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'BT' (between)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"sPath": "Category",
					"sOperator": "BT",
					"oValue1": "A",
					"oValue2": "a",
					"_bMultiFilter": false
				}
			]
		);
		// Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
