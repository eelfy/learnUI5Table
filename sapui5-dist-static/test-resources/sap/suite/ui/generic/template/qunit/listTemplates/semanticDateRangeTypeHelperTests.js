/**
 * tests for the sap.suite.ui.generic.template.listTemplates.semanticDateRangeHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper"], function (sinon, semanticDateRangeTypeHelper) {
	"use strict";
	QUnit.test("Support for Semantic Date - getDateSettingsMetadata", function () {
		var oExpectedMetadata = {
				type: "object",
				useDateRange: {
					type: "boolean",
					defaultValue: false
				},
				selectedValues: {
					type: "string",
					defaultValue: ""
				},
				exclude: {
					type: "boolean",
					defaultValue: true
				},
				customDateRangeImplementation: {
					type: "string",
					defaultValue: ""
				},
				fields: {
					type: "object"
				}
			},
			oResult;
		oResult = semanticDateRangeTypeHelper.getDateSettingsMetadata();
		assert.deepEqual(oResult, oExpectedMetadata);
	})
	QUnit.test("Support for Semantic Date - getSemanticDateRangeSettingsForDateProperties", function () {
		var oLRSettings = {
				allControlConfiguration: [{
						PropertyPath: "SupplierName"
					},
					{
						PropertyPath: "MaterialName"
					},
					{
						PropertyPath: "PurchasingGroup"
					},
					{
						PropertyPath: "CurrencyCode"
					},
					{
						PropertyPath: "DeliveryDate"
					},
					{
						PropertyPath: "CreatedDate"
					}
				],
				filterSettings: {
					dateSettings: {
						selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
						fields: {
							DeliveryDate: {
								filter: [
									{path: 'category', contains: 'DYNAMIC', exclude:true},
									{path: 'category', contains: 'YEAR', exclude:true},
									{path: 'category', contains: 'QUARTER', exclude:true},
									{path: 'category', equals: 'MONTH', exclude:true},
									{path: 'category', contains: 'WEEK', exclude:true},
									{path: 'category', equals: 'DAY', exclude:true},
									{path: 'key', equals: 'DAY', exclude: false},
									{path: 'key', cotains: 'WEEK', exclude:true}
								]
							},
							CreatedDate: {
								customDateRangeImplementation: "SOMULTIENTITY.ext.controller.customDateRangeType",
								selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
								exclude: true
							},
							ReopenedDate: {
								selectedValues: "FROM,TO,TODAY,TOMORROW,YESTERDAY",
								exclude: false
							}
						}
					}
				}
			},
			oLeadingEntityType = {
				name: "FilterBarEntity",
				property: [{
						name: "DeliveryDate",
						type: "Edm.DateTime",
						"sap:display-format": "Date",
						"sap:filter-restriction": "interval"

					},
					{
						name: "CreatedDate",
						type: "Edm.DateTime",
						"sap:display-format": "Date",
						"sap:filter-restriction": "interval"

					},
					{
						name: "LastUpdatedDate",
						type: "Edm.String",
						"sap:semantics": "yearmonthday",
						"com.sap.vocabularies.Common.v1.IsCalendarDate": {
							"Bool": "true"
						},
						"sap:filter-restriction": "interval"

					},
					{
						name: "ReopenedDate",
						type: "Edm.DateTime",
						"sap:display-format": "Date",
						"sap:filter-restriction": "interval"

					},
					{
						name: "StartDate",
						type: "Edm.DateTime",
						"sap:display-format": "Date",
						"sap:filter-restriction": "single-value"

					},
					{
						name: "EndDate",
						type: "Edm.String",
						"sap:semantics": "yearmonthday",
						"sap:filter-restriction": "single-value"

					},
					{
						name: "DeliveryMonth",
						type: "Edm.String",
						"sap:semantics": "yearmonth"
					},
					{
						name: "SupplierName",
						type: "Edm.String",
						"sap:filter-restriction": "multi-value"
					},
					{
						name: "MaterialName",
						type: "Edm.String",
						"sap:filter-restriction": "single-value"
					}

				]
			},
			oExpectedResult = {
				"DeliveryDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [
							{path: 'category', contains: 'DYNAMIC', exclude:true},
							{path: 'category', contains: 'YEAR', exclude:true},
							{path: 'category', contains: 'QUARTER', exclude:true},
							{path: 'category', equals: 'MONTH', exclude:true},
							{path: 'category', contains: 'WEEK', exclude:true},
							{path: 'category', equals: 'DAY', exclude:true},
							{path: 'key', equals: 'DAY', exclude: false},
							{path: 'key', cotains: 'WEEK', exclude:true}
						]
					}
				}),
				"CreatedDate": "SOMULTIENTITY.ext.controller.customDateRangeType",
				"LastUpdatedDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
							exclude: true
						}]
					}
				}),
				"ReopenedDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "FROM,TO,TODAY,TOMORROW,YESTERDAY",
							exclude: false
						}]
					}
				})
			},
			oResult;
		oResult = semanticDateRangeTypeHelper.getSemanticDateRangeSettingsForDateProperties(oLRSettings, oLeadingEntityType);
		assert.deepEqual(oResult, oExpectedResult, "configuration of date range setting is valid");

		var oWrongDateOperatorLRSettings = {
			allControlConfiguration: [{
				PropertyPath: "SupplierName"
			},
			{
			    PropertyPath: "CreatedDate"
			}
			],
			filterSettings: {
				dateSettings: {
					selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
					fields: {
						CreatedDate: {
							exclude: true
						}
					}
				}
			}
		};

		oLeadingEntityType = {
			name: "FilterBarEntity",
			property: [
				{
					name: "CreatedDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"

				}
			]
		};
		var oExpectedError = new Error("listTemplates.semanticDateRangeTypeHelper: Wrong Date Range configuration set in manifest");
		try{
			oResult = semanticDateRangeTypeHelper.getSemanticDateRangeSettingsForDateProperties(oWrongDateOperatorLRSettings, oLeadingEntityType);
		} catch(err) {
			assert.deepEqual(err.name, "FioriElements", "Error of type FioriElements thrown");
			assert.deepEqual(err.message, oExpectedError.message, "Invalid date range operator");
		}
	});

	QUnit.test("SemanticDateRangeType Helper - isServiceUrlAllowedBySemanticDateRangeFilter", function() {
		var bExpectedResult = true,
			bResult,
			oFilterBar = {
				mProperties: {
					entityType: ""
				},
				getModel: function() {}
			},
			oPageSettings = {
				allControlConfiguration: [{
						PropertyPath: "SupplierName"
					},
					{
						PropertyPath: "MaterialName"
					},
					{
						PropertyPath: "PurchasingGroup"
					},
					{
						PropertyPath: "CurrencyCode"
					},
					{
						PropertyPath: "DeliveryDate"
					},
					{
						PropertyPath: "CreatedDate"
					}
				],
				filterSettings: {
					dateSettings: {
						selectedValues: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
						fields: {
							DeliveryDate: {
								filter: [
									{path: 'category', contains: 'DYNAMIC', exclude:true},
									{path: 'category', contains: 'YEAR', exclude:true},
									{path: 'category', contains: 'QUARTER', exclude:true},
									{path: 'category', equals: 'MONTH', exclude:true},
									{path: 'category', contains: 'WEEK', exclude:true},
									{path: 'category', equals: 'DAY', exclude:true},
									{path: 'key', equals: 'DAY', exclude: false},
									{path: 'key', cotains: 'WEEK', exclude:true}
								]
							},
							CreatedDate: {
								customDateRangeImplementation: "SOMULTIENTITY.ext.controller.customDateRangeType",
								selectedValues: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
								exclude: true
							},
							ReopenedDate: {
								selectedValues: "FROM,TO,TODAY,TOMORROW,YESTERDAY",
								exclude: false
							}
						}
					}
				}
			};

		var oStub = sinon.stub(oFilterBar, "getFiltersWithValues");
		oStub.onCall(0).returns([]);
		bResult = semanticDateRangeTypeHelper.isServiceUrlAllowedBySemanticDateRangeFilter(oPageSettings, oFilterBar);
		assert.ok(bResult === bExpectedResult);

		var oFilterBarEntityType = {
			name: "FilterBarEntity",
			property: [
				{
					name: "DeliveryDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				},
				{
					name: "CreatedDate",
					type: "Edm.DateTime",
					"sap:display-format": "Date",
					"sap:filter-restriction": "interval"
				},
				{
					name: "LastUpdatedDate",
					type: "Edm.String",
					"sap:semantics": "yearmonthday",
					"com.sap.vocabularies.Common.v1.IsCalendarDate": {
						"Bool": "true"
					},
					"sap:filter-restriction": "interval"
				}
			]
		};
		bExpectedResult = false;
		oStub.onCall(1).returns([
			{
				mProperties: {
					name: "DeliveryDate"
				}
			}
		]);
		sinon.stub(oFilterBar, "getModel").returns({});
		sinon.stub(oFilterBar.getModel(), "getMetaModel").returns({});
		sinon.stub(oFilterBar.getModel().getMetaModel(), "getODataEntityType").returns(oFilterBarEntityType);
		bResult = semanticDateRangeTypeHelper.isServiceUrlAllowedBySemanticDateRangeFilter(oPageSettings, oFilterBar);
		assert.ok(bResult === bExpectedResult);
	});

	QUnit.module("Support for Semantic Date - Templating methods", {
		beforeEach: function () {
			this.oDateSettings = {
				"DeliveryDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
							exclude: true
						}]
					}
				}),
				"CreatedDate": "SOMULTIENTITY.ext.controller.customDateRangeType",
				"LastUpdatedDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
							exclude: false
						}]
					}
				}),
				"StartDate": JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
							exclude: true
						}]
					}
				})
			};
			this.allControlConfiguration = [{
					PropertyPath: "SupplierName"
				},
				{
					PropertyPath: "MaterialName"
				},
				{
					PropertyPath: "PurchasingGroup"
				},
				{
					PropertyPath: "CurrencyCode"
				},
				{
					PropertyPath: "DeliveryDate"
				},
				{
					PropertyPath: "CreatedDate"
				},
				{
					PropertyPath: "LastUpdatedDate"
				},
				{
					PropertyPath: "StartDate",
					bNotPartOfSelectionField: true
				}
			];
			this.allDateControlConfiguration = [{
					PropertyPath: "DeliveryDate"
				},
				{
					PropertyPath: "CreatedDate"
				},
				{
					PropertyPath: "LastUpdatedDate"
				},
				{
					PropertyPath: "StartDate",
					bNotPartOfSelectionField: true
				}
			];

		},
		afterEach: function () {
			this.oDateSettings = {};
			this.allControlConfiguration = [];
			this.allDateControlConfiguration = [];
		}
	});
	QUnit.test("SemanticDateRangeType Helper - isDateRangeType", function () {
		var oExpectedResult = {
				"SupplierName": false,
				"MaterialName": false,
				"PurchasingGroup": false,
				"CurrencyCode": false,
				"DeliveryDate": true,
				"CreatedDate": true,
				"LastUpdatedDate": true,
				"StartDate": true
			},
			bResult;
		for (var i = 0; i < this.allControlConfiguration.length; i++) {
			bResult = semanticDateRangeTypeHelper.isDateRangeType(this.allControlConfiguration[i].PropertyPath, this.oDateSettings);
			assert.ok(bResult === oExpectedResult[this.allControlConfiguration[i].PropertyPath]);
		}
	});
	QUnit.test("SemanticDateRangeType Helper - getConditionTypeForDateProperties", function () {
		var oExpectedResult = [
				JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "FROM,TO,DAYS,WEEK,MONTH,DATERANGE,TODAY,TOMORROW,YEAR,YESTERDAY",
							exclude: true
						}]
					}
				}),
				"SOMULTIENTITY.ext.controller.customDateRangeType",
				JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
							exclude: false
						}]
					}
				}),
				JSON.stringify({
					module: 'sap.ui.comp.config.condition.DateRangeType',
					operations: {
						filter: [{
							path: 'key',
							contains: "DAYS,WEEK,MONTH,DATERANGE,QUARTER,YEAR",
							exclude: true
						}]
					}
				})
			],
			sResult;
		for (var i = 0; i < this.allDateControlConfiguration.length; i++) {
			sResult = semanticDateRangeTypeHelper.getConditionTypeForDateProperties(this.allDateControlConfiguration[i].PropertyPath, this.oDateSettings);
			assert.ok(sResult === oExpectedResult[i]);
		}
	});
});
