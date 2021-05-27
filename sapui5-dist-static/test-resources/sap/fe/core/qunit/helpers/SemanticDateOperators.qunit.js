/* global QUnit */
sap.ui.define(["sap/fe/core/helpers/SemanticDateOperators"], function(SemanticDateOperators) {
	"use strict";

	QUnit.module("SemanticDate Operators", {});

	var aSemanticMappingTestData = [
		{
			desc: "with 'key' and 'equals'",
			operatorConfiguration: [
				{
					"path": "key",
					"equals": "TODAY,YESTERDAY",
					"exclude": false
				}
			],
			expectedOperations: ["TODAY", "YESTERDAY"]
		},
		{
			desc: "with 'key' and 'contains'",
			operatorConfiguration: [
				{
					"path": "key",
					"contains": "QUARTER",
					"exclude": false
				}
			],
			expectedOperations: [
				"THISQUARTER",
				"LASTQUARTER",
				"LASTQUARTERS",
				"NEXTQUARTER",
				"NEXTQUARTERS",
				"QUARTER1",
				"QUARTER2",
				"QUARTER3",
				"QUARTER4"
			]
		},
		{
			desc: "with 'category' and 'equals'",
			operatorConfiguration: [
				{
					"path": "category",
					"equals": "FIXED.DATE",
					"exclude": false
				}
			],
			expectedOperations: ["TODAY", "YESTERDAY", "TOMORROW"]
		},
		{
			desc: "with 'category' and 'contains'",
			operatorConfiguration: [
				{
					"path": "category",
					"contains": "DYNAMIC.DATE",
					"exclude": false
				}
			],
			expectedOperations: ["DATE", "FROM", "TO", "DATERANGE", "TODAYFROMTO", "LASTDAYS", "NEXTDAYS"]
		},
		{
			desc: "with 'key' and 'equals' - exclude: true",
			operatorConfiguration: [
				{
					"path": "key",
					"equals": "TODAY",
					"exclude": true
				}
			],
			expectedOperations: [
				"DATE",
				"FROM",
				"TO",
				"DATERANGE",
				"SPECIFICMONTH",
				"TODAYFROMTO",
				"YESTERDAY",
				"TOMORROW",
				"LASTDAYS",
				"NEXTDAYS",
				"THISWEEK",
				"LASTWEEK",
				"LASTWEEKS",
				"NEXTWEEK",
				"NEXTWEEKS",
				"THISMONTH",
				"LASTMONTH",
				"LASTMONTHS",
				"NEXTMONTH",
				"NEXTMONTHS",
				"THISQUARTER",
				"LASTQUARTER",
				"LASTQUARTERS",
				"NEXTQUARTER",
				"NEXTQUARTERS",
				"QUARTER1",
				"QUARTER2",
				"QUARTER3",
				"QUARTER4",
				"THISYEAR",
				"LASTYEAR",
				"LASTYEARS",
				"NEXTYEAR",
				"NEXTYEARS",
				"YEARTODATE"
			]
		},
		{
			desc: "with 'category' and 'contains' - exclude: true",
			operatorConfiguration: [
				{
					"path": "category",
					"contains": "DYNAMIC",
					"exclude": true
				}
			],
			expectedOperations: [
				"TODAY",
				"YESTERDAY",
				"TOMORROW",
				"THISWEEK",
				"LASTWEEK",
				"NEXTWEEK",
				"THISMONTH",
				"LASTMONTH",
				"NEXTMONTH",
				"THISQUARTER",
				"LASTQUARTER",
				"NEXTQUARTER",
				"QUARTER1",
				"QUARTER2",
				"QUARTER3",
				"QUARTER4",
				"THISYEAR",
				"LASTYEAR",
				"NEXTYEAR",
				"YEARTODATE"
			]
		},
		{
			desc: "with empty filter settings",
			operatorConfiguration: [],
			expectedOperations: []
		},
		{
			desc: "with multiple filter settings",
			operatorConfiguration: [
				{
					"path": "key",
					"equals": "TODAY,LASTYEAR,NEXTYEAR",
					"exclude": true
				},
				{
					"path": "category",
					"contains": "MONTH",
					"exclude": true
				},
				{
					"path": "key",
					"contains": "QUARTER",
					"exclude": true
				}
			],
			expectedOperations: [
				"DATE",
				"FROM",
				"TO",
				"DATERANGE",
				"TODAYFROMTO",
				"YESTERDAY",
				"TOMORROW",
				"LASTDAYS",
				"NEXTDAYS",
				"THISWEEK",
				"LASTWEEK",
				"LASTWEEKS",
				"NEXTWEEK",
				"NEXTWEEKS",
				"THISYEAR",
				"LASTYEARS",
				"NEXTYEARS",
				"YEARTODATE"
			]
		}
	];

	aSemanticMappingTestData.forEach(function(oTestData) {
		QUnit.test("getFilterOperations - " + oTestData.desc, function(assert) {
			var aSemanticDateOps = SemanticDateOperators.getFilterOperations(oTestData.operatorConfiguration);
			assert.equal(
				JSON.stringify(aSemanticDateOps),
				JSON.stringify(oTestData.expectedOperations),
				"testing semantic date settings " + oTestData.desc + " - done"
			);
		});
	});

	var aFilterConditionsTestMapping = [
		{
			desc: "with no semantic date entered in the Filter Bar",
			condition: {
				"$editState": [
					{
						operator: "DRAFT_EDIT_STATE",
						values: ["ALL"]
					}
				],
				LastChangedDateTime: [
					{
						operator: "EQ",
						values: ["2020-12-03T15:32:05+0530"]
					}
				]
			},
			expectedResult: true
		},
		{
			desc: "with semantic date entered in the Filter Bar",
			condition: {
				"$editState": [
					{
						operator: "DRAFT_EDIT_STATE",
						values: ["ALL"]
					}
				],
				LastChangedDateTime: [
					{
						operator: "EQ",
						values: ["2020-12-03T15:32:05+0530"]
					}
				],
				SalesOrderDate: [
					{
						operator: "YESTERDAY",
						values: ["Dec 2, 2020"]
					}
				]
			},
			expectedResult: false
		}
	];
	aFilterConditionsTestMapping.forEach(function(oTestData) {
		QUnit.test("hasSemanticDateOperations - " + oTestData.desc, function(assert) {
			var bHasSemanticDateOperation = SemanticDateOperators.hasSemanticDateOperations(oTestData.condition);
			assert.equal(
				bHasSemanticDateOperation,
				oTestData.expectedResult,
				"testing hasSemanticDateOperations " + oTestData.desc + " - done"
			);
		});
	});
});
