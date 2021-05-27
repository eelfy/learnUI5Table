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

	["Date", "Date Time Offset"].forEach(function (sField) {
		opaTest(sField + " nullable - include and exclude operations", function(Given, When, Then) {
			//Arrangements
			Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));
			var sFieldId = sField.split(" ").join("") + "Nullable";

			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iChangeTheFilterField(sField + " nullable").and.iChangeTheCondition("empty");
			When.iPressTheFilterAddButton();
			When.iChangeTheFilterField(sField + " nullable", 1).and.iChangeTheCondition("not empty", 1);
			When.iPressOkButton();

			//Assertions
			//-------------- operation: 'EQ' (empty)-------------------
			Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
				[
					{
						"aFilters": [
							{
								"sPath": sFieldId,
								"sOperator": "NE",
								"oValue1": null,
								"_bMultiFilter": false
							}
						],
						"bAnd": true,
						"_bMultiFilter": true
					},
					{
						"sPath": sFieldId,
						"sOperator": "EQ",
						"oValue1": null,
						"_bMultiFilter": false
					}
				]
			);
		});

		opaTest(sField + " - no empty operation should be available", function(Given, When, Then) {
			//Actions
			When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
			When.iChangeTheFilterField(sField);

			//Assertions
			Then.iShouldSeeNoEmptyOperation();

			//Actions - cleanup for the next test
			When.iPressOkButton();

			//Cleanup
			Then.iTeardownMyAppFrame();
		});
	});

	opaTest("StringDate nullable - include and exclude operations", function(Given, When, Then) {
		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("String date nullable", 0).and.iChangeTheCondition("empty");
		When.iPressTheFilterAddButton();
		// return;
		When.iChangeTheFilterField("String date nullable", 1).and.iChangeTheCondition("not empty", 1);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						},
						{
							"sPath": "StringDateNullable",
							"sOperator": "NE",
							"oValue1": null,
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				},
				{
					"sPath": "StringDateNullable",
					"sOperator": "EQ",
					"oValue1": null,
					"_bMultiFilter": false
				}
			]
		);

		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	opaTest("StringDate - include and exclude operations", function(Given, When, Then) {

		//Arrangements
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestFiltering/start.html"));

		//Actions
		When.iOpenTheP13nDialogAndNavigateToTheFilterTab();
		When.iChangeTheFilterField("String date", 0).and.iChangeTheCondition("empty");
		When.iPressTheFilterAddButton();
		// return;
		When.iChangeTheFilterField("String date", 1).and.iChangeTheCondition("not empty", 1);
		When.iPressOkButton();

		//Assertions
		//-------------- operation: 'EQ' (empty)-------------------
		Then.iShouldSeeFilterValueInCodeEditor("applicationUnderTestFiltering---IDView--dataTable",
			[
				{
					"aFilters": [
						{
							"sPath": "StringDate",
							"sOperator": "NE",
							"oValue1": "",
							"_bMultiFilter": false
						}
					],
					"bAnd": true,
					"_bMultiFilter": true
				},
				{
					"sPath": "StringDate",
					"sOperator": "EQ",
					"oValue1": "",
					"_bMultiFilter": false
				}
			]
		);
		//Cleanup
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
