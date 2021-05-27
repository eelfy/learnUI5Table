/* global QUnit sinon */
sap.ui.define(
	[
		"sap/base/util/deepEqual",
		"sap/ui/test/TestUtils",
		"sap/ui/model/odata/v4/ODataModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/table/delegates/TableDelegate",
		"sap/fe/macros/DelegateUtil"
	],
	function(deepEqual, TestUtils, ODataModel, JSONModel, TableDelegate, DelegateUtil) {
		"use strict";
		QUnit.module("Table Delegate Tests fetch Properties", {
			before: function() {
				var sServiceUrl = "/fake/";
				this.oModel = new ODataModel({
					groupId: "$direct",
					operationMode: "Server",
					serviceUrl: TestUtils.proxy(sServiceUrl),
					synchronizationMode: "None"
				});
				this.oTable = {
					data: function() {
						return {
							"sap.fe.TableDelegate.propertyInfoMap": {
								"name": "DataFieldForIntentBasedNavigation::v4Freestyle::Inbound",
								"path": "DataFieldForIntentBasedNavigation::v4Freestyle::Inbound",
								"metadataPath": "@com.sap.vocabularies.UI.v1.LineItem/12",
								"groupLabel": null,
								"group": null,
								"label": "IBN Inline",
								"description": "IBN Inline",
								"filterable": false,
								"sortable": false,
								"visible": true
							}
						};
					},
					getModel: function() {
						return this.oModel;
					}.bind(this),
					getDelegate: function() {
						return {
							"name": "sap/fe/macros/table/delegates/TableDelegate",
							"payload": { "modelName": "SalesOrderManage" }
						};
					}
				};
				var oModel = this.oModel;
				this.fetchModelStub = sinon.stub(DelegateUtil, "fetchModel").callsFake(function() {
					return Promise.resolve(oModel);
				});
			},
			after: function() {
				this.oModel.destroy();
				this.oModel = null;
				this.fetchModelStub.restore();
				this.fetchModelStub = null;
			}
		});

		QUnit.test("Fetch Properties returns Table data", function(assert) {
			var done = assert.async();

			TableDelegate.fetchProperties(this.oTable).then(
				function(aProperties) {
					var oExpectedResults = this.oTable.data();
					var bDeepEqual = deepEqual(aProperties, oExpectedResults);
					assert.equal(bDeepEqual, true, "FetchProperties returns a part of the Table metadata");
					done();
				}.bind(this)
			);
		});

		var oMetaModel = new JSONModel({
			"SalesOrderManage": {
				"StringProp": {
					$Type: "Edm.String",
					$kind: "Property",
					"@sapui.name": "StringProp",
					"@com.sap.vocabularies.Common.v1.Label": "String property"
				},
				"NavProp": {
					// named on purpose like a root property to check that it is not mistaken as it (therefore different datatype)
					"StringProp": {
						$Type: "Edm.Stream",
						$kind: "Property",
						"@sapui.name": "StringProp",
						"@com.sap.vocabularies.Common.v1.Label": "Stream property"
					}
				},
				"DescriptionProp": {
					"Name": {
						// Navigation String Property
						$Type: "Edm.String",
						$kind: "Property",
						"@sapui.name": "DescriptionProp",
						"@com.sap.vocabularies.Common.v1.Label": "DescriptionProp"
					}
				},
				"StringPropHidden": {
					$Type: "Edm.String",
					$kind: "Property",
					"@sapui.name": "StringPropHidden",
					"@com.sap.vocabularies.Common.v1.Label": "Hidden string property",
					"@com.sap.vocabularies.UI.v1.Hidden": true
				},
				"DecimalProp": {
					$Type: "Edm.Decimal",
					$kind: "Property",
					$Precision: 15,
					$Scale: 7,
					"@sapui.name": "DecimalProp",
					"@com.sap.vocabularies.Common.v1.Label": "Decimal property"
				},
				"DoubleProp": {
					$Type: "Edm.Double",
					$kind: "Property",
					$Precision: 15,
					$Scale: 7,
					"@sapui.name": "DoubleProp",
					"@com.sap.vocabularies.Common.v1.Label": "Double property"
				},
				"Integer64Prop": {
					$Type: "Edm.Int64",
					$kind: "Property",
					$Precision: undefined,
					$Scale: undefined,
					$delimiter: true,
					"@sapui.name": "Integer64Prop",
					"@com.sap.vocabularies.Common.v1.Label": "Integer64 property"
				},
				"Amount": {
					$Type: "Edm.Decimal",
					$kind: "Property",
					$Precision: 15,
					$Scale: 7,
					"@sapui.name": "Amount",
					"@com.sap.vocabularies.Common.v1.Label": "Total Amount",
					"@Org.OData.Measures.V1.ISOCurrency": {
						$Path: "Currency"
					}
				},
				"Unit": {
					$Type: "Edm.String",
					$kind: "Property",
					"@sapui.name": "Unit",
					"@com.sap.vocabularies.Common.v1.Label": "Requested Quantity",
					"@Org.OData.Measures.V1.Unit": {
						$Path: "RequestedQuantityUnit"
					}
				},
				"ShippingDate": {
					$Type: "Edm.Date",
					$kind: "Property",
					"@sapui.name": "ShippingDate",
					"@com.sap.vocabularies.Common.v1.Label": "Shipping date"
				},
				"CreationDateTimestamp": {
					$Type: "Edm.DateTimeOffset",
					$kind: "Property",
					"@sapui.name": "CreationDateTimestamp",
					"@com.sap.vocabularies.Common.v1.Label": "Creation date timestamp"
				},
				"UsageStartTime": {
					$Type: "Edm.TimeOfDay",
					$kind: "Property",
					"@sapui.name": "UsageStartTime",
					"@com.sap.vocabularies.Common.v1.Label": "Usage Start Time"
				},
				"Overdue": {
					$Type: "Edm.Boolean",
					$kind: "Property",
					"@sapui.name": "Overdue",
					"@com.sap.vocabularies.Common.v1.Label": "Is overdue"
				},
				"@com.sap.vocabularies.UI.v1.LineItem": [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataField",
						Value: {
							$Path: {
								$Type: "Edm.String"
							}
						},
						"@com.sap.vocabularies.Common.v1.Label": "String in datafield"
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						"@com.sap.vocabularies.Common.v1.Label": "Action column"
					}
				]
			}
		});

		var oBindingContext = {
			getModel: function() {
				return oMetaModel;
			}
		};

		var aTestData = [
			{
				desc: "String property",
				columnInfo: {
					name: "StringProp",
					label: "String property",
					annotationPath: "/SalesOrderManage/StringProp",
					availability: "Adaptation",
					relativePath: "StringProp",
					sortable: true
				},
				expected: {
					name: "StringProp",
					label: "String property",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "String property",
						type: "String"
					}
				}
			},
			{
				desc: "Stream property within NavProperty",
				columnInfo: {
					name: "NavProp/StringProp",
					annotationPath: "/SalesOrderManage/NavProp/StringProp",
					label: "Stream property",
					availability: "Adaptation",
					relativePath: "StringProp",
					sortable: true
				},
				expected: {
					name: "NavProp/StringProp",
					label: "Stream property",
					filterable: false,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Stream property",
						type: "String"
					}
				}
			},
			{
				desc: "String property (hidden)",
				columnInfo: {
					name: "StringPropHidden",
					label: "Hidden string property",
					annotationPath: "/SalesOrderManage/StringPropHidden",
					availability: "Hidden",
					relativePath: "StringPropHidden",
					sortable: true
				},
				expected: {
					name: "StringPropHidden",
					label: "Hidden string property",
					filterable: false,
					sortable: true,
					visible: false,
					exportSettings: {
						label: "Hidden string property",
						type: "String"
					}
				}
			},
			{
				desc: "Decimal property",
				columnInfo: {
					name: "DecimalProp",
					label: "Decimal property",
					annotationPath: "/SalesOrderManage/DecimalProp",
					availability: "Adaptation",
					relativePath: "DecimalProp",
					sortable: true
				},
				expected: {
					name: "DecimalProp",
					label: "Decimal property",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Decimal property",
						type: "Number",
						scale: 7
					}
				}
			},
			{
				desc: "Double property",
				columnInfo: {
					name: "DoubleProp",
					label: "Double property",
					annotationPath: "/SalesOrderManage/DoubleProp",
					availability: "Adaptation",
					relativePath: "DoubleProp",
					sortable: true
				},
				expected: {
					name: "DoubleProp",
					label: "Double property",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Double property",
						type: "Number"
					}
				}
			},
			{
				desc: "Integer64 property",
				columnInfo: {
					name: "Integer64Prop",
					label: "Integer64 property",
					annotationPath: "/SalesOrderManage/Integer64Prop",
					availability: "Adaptation",
					relativePath: "Integer64Prop",
					sortable: true
				},
				expected: {
					name: "Integer64Prop",
					label: "Integer64 property",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Integer64 property",
						type: "Number",
						delimiter: true
					}
				}
			},
			{
				desc: "Decimal property with currency",
				columnInfo: {
					name: "Amount",
					annotationPath: "/SalesOrderManage/Amount",
					availability: "Adaptation",
					label: "Total Amount",
					relativePath: "Amount",
					sortable: true,
					exportSettings: {
						type: "Number"
					}
				},
				expected: {
					name: "Amount",
					label: "Total Amount",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Total Amount",
						type: "Number",
						scale: 7
					}
				}
			},
			{
				desc: "Decimal property with units",
				columnInfo: {
					name: "Unit",
					annotationPath: "/SalesOrderManage/Unit",
					label: "Requested Quantity",
					availability: "Adaptation",
					relativePath: "Unit",
					sortable: true,
					exportSettings: {
						Type: "String"
					}
				},
				expected: {
					name: "Unit",
					label: "Requested Quantity",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Requested Quantity",
						type: "String"
					}
				}
			},
			{
				desc: "Date property",
				columnInfo: {
					name: "ShippingDate",
					label: "Shipping date",
					annotationPath: "/SalesOrderManage/ShippingDate",
					availability: "Adaptation",
					relativePath: "ShippingDate",
					sortable: true
				},
				expected: {
					name: "ShippingDate",
					label: "Shipping date",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Shipping date",
						type: "Date",
						inputFormat: "YYYY-MM-DD"
					}
				}
			},
			{
				desc: "DateTimeOffset property",
				columnInfo: {
					name: "CreationDateTimestamp",
					label: "Creation date timestamp",
					annotationPath: "/SalesOrderManage/CreationDateTimestamp",
					availability: "Adaptation",
					relativePath: "CreationDateTimestamp",
					sortable: true
				},
				expected: {
					name: "CreationDateTimestamp",
					label: "Creation date timestamp",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Creation date timestamp",
						type: "DateTime"
					}
				}
			},
			{
				desc: "TimeOfDay property",
				columnInfo: {
					name: "UsageStartTime",
					annotationPath: "/SalesOrderManage/UsageStartTime",
					label: "Usage Start Time",
					availability: "Adaptation",
					relativePath: "UsageStartTime",
					sortable: true
				},
				expected: {
					name: "UsageStartTime",
					label: "Usage Start Time",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Usage Start Time",
						type: "Time"
					}
				}
			},
			{
				desc: "Boolean property",
				columnInfo: {
					name: "Overdue",
					label: "Is overdue",
					annotationPath: "/SalesOrderManage/Overdue",
					availability: "Adaptation",
					relativePath: "Overdue",
					sortable: true
				},
				expected: {
					name: "Overdue",
					label: "Is overdue",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Is overdue",
						type: "Boolean",
						trueValue: "Yes",
						falseValue: "No"
					}
				}
			},
			{
				desc: "String property (through datafield)",
				columnInfo: {
					name: "StringProp",
					label: "String in datafield",
					annotationPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/0",
					availability: "Default",
					relativePath: "StringProp",
					sortable: true
				},
				expected: {
					name: "StringProp",
					label: "String in datafield",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "String in datafield",
						type: "String"
					}
				}
			},
			{
				desc: "Action column",
				columnInfo: {
					name: "StringProp",
					label: "Action column",
					annotationPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1",
					availability: "Default",
					relativePath: "StringProp",
					sortable: false
				},
				expected: {
					name: "StringProp",
					label: "Action column",
					filterable: false,
					sortable: false,
					visible: true,
					exportSettings: {
						label: "Action column",
						type: undefined
					}
				}
			},
			{
				desc: "Check property from a text arrangement column (simple property created from complexProperty)",
				columnInfo: {
					name: "DescriptionProp/Name",
					label: "Description column",
					annotationPath: "/SalesOrderManage/DescriptionProp/Name",
					availability: "Hidden",
					relativePath: "DescriptionProp/Name",
					sortable: true,
					exportSettings: {
						labels: ["Sold-ToParty", "Name"]
					},
					type: "Annotation"
				},
				expected: {
					name: "DescriptionProp/Name",
					label: "Description column",
					filterable: false,
					sortable: false,
					visible: false,
					exportSettings: {
						label: "Sold-ToParty - Name",
						delimiter: false,
						type: "String"
					},
					path: "DescriptionProp/Name",
					metadataPath: "/SalesOrderManage/DescriptionProp/Name"
				}
			},
			{
				desc: "Check property from a fieldGroup column (simple property created from complexProperty)",
				columnInfo: {
					name: "SimplePropFromFieldGroup",
					label: "Rating",
					annotationPath: "/SalesOrderManage/DecimalProp",
					availability: "Adaptation",
					relativePath: "Rating",
					sortable: true,
					exportSettings: {
						labels: ["Sold-ToParty", "Rating"]
					}
				},
				expected: {
					name: "SimplePropFromFieldGroup",
					label: "Rating",
					filterable: true,
					sortable: true,
					visible: true,
					exportSettings: {
						label: "Sold-ToParty - Rating",
						type: "Number"
					}
				}
			},
			{
				desc:
					"Check property from a fieldGroup column (dummy property created from complexProperty including TargetValue when datapoint)",
				columnInfo: {
					name: "SimpleTargetValuePropFromFieldGroup",
					label: "Rating",
					annotationPath: "/SalesOrderManage/StringProp",
					availability: "Hidden",
					relativePath: "@com.sap.vocabularies.UI.v1.DataPoint#Rating",
					sortable: false,
					exportSettings: {
						labels: ["Sold-ToParty", "Rating", "TargetValue"]
					}
				},
				expected: {
					name: "SimpleTargetValuePropFromFieldGroup",
					label: "Rating",
					filterable: true,
					sortable: false,
					visible: false,
					exportSettings: {
						label: "Sold-ToParty - Rating - TargetValue",
						type: "String"
					}
				}
			},
			{
				desc: "Check property from a datapoint column",
				columnInfo: {
					name: "SimplePropFromDataPoint",
					label: "Rating",
					annotationPath: "/SalesOrderManage/DecimalProp",
					availability: "Hidden",
					relativePath: "Rating",
					sortable: false,
					exportSettings: {
						labels: ["Rating"]
					}
				},
				expected: {
					name: "SimplePropFromDataPoint",
					label: "Rating",
					filterable: true,
					sortable: false,
					visible: false,
					exportSettings: {
						label: "Rating",
						type: "Number"
					}
				}
			},
			{
				desc: "Check property from a datapoint column (dummy property added to complexProperty including TargetValue)",
				columnInfo: {
					name: "SimpleTargetValuePropFromDataPoint",
					label: "Rating",
					annotationPath: "/SalesOrderManage/StringProp",
					availability: "Hidden",
					relativePath: "@com.sap.vocabularies.UI.v1.DataPoint#Rating",
					sortable: false,
					exportSettings: {
						labels: ["Rating", "TargetValue"]
					}
				},
				expected: {
					name: "SimpleTargetValuePropFromDataPoint",
					label: "Rating",
					filterable: true,
					sortable: false,
					visible: false,
					exportSettings: {
						label: "Rating - TargetValue",
						type: "String"
					}
				}
			},
			{
				desc: "Check Date property with one entry into propertyInfos",
				// It's a self reference from an existing column is created pointing to a dummy PropertyInfo for setting correct export settings.
				columnInfo: {
					name: "ShippingDate",
					label: "Shipping date",
					annotationPath: "/SalesOrderManage/ShippingDate",
					availability: "Default",
					propertyInfos: ["Property::ShippingDate"],
					exportSettings: {
						template: "{0}"
					},
					sortable: true
				},
				expected: {
					name: "ShippingDate",
					label: "Shipping date",
					visible: true,
					exportSettings: {
						template: "{0}",
						label: "Shipping date",
						type: "Date",
						inputFormat: "YYYY-MM-DD"
					}
				}
			},
			{
				desc: "Check DateTime property with one entry into propertyInfos",
				// It's a self reference from an existing column is created pointing to a dummy PropertyInfo for setting correct export settings.
				columnInfo: {
					name: "CreationDateTimestamp",
					label: "Creation date timestamp",
					annotationPath: "/SalesOrderManage/CreationDateTimestamp",
					availability: "Default",
					relativePath: "CreationDateTimestamp",
					propertyInfos: ["Property::CreationDateTimestamp"],
					exportSettings: {
						template: "{0}"
					},
					sortable: true
				},
				expected: {
					name: "CreationDateTimestamp",
					label: "Creation date timestamp",
					visible: true,
					exportSettings: {
						label: "Creation date timestamp",
						type: "DateTime",
						template: "{0}",
						format: "mmm d, yyyy, h:mm:ss AM/PM"
					}
				}
			},
			{
				desc: "Check TimeOfDay property with one entry into propertyInfos",
				columnInfo: {
					name: "UsageStartTime",
					annotationPath: "/SalesOrderManage/UsageStartTime",
					label: "Usage Start Time",
					availability: "Default",
					relativePath: "UsageStartTime",
					propertyInfos: ["Property::usageStartTime"],
					sortable: true,
					exportSettings: {
						template: "{0}"
					}
				},
				expected: {
					name: "UsageStartTime",
					label: "Usage Start Time",
					visible: true,
					exportSettings: {
						label: "Usage Start Time",
						type: "Time",
						template: "{0}",
						format: "h:mm:ss AM/PM"
					}
				}
			},
			{
				desc: "Check Decimal property with one entry into propertyInfos",
				columnInfo: {
					name: "DecimalProp",
					label: "Decimal property",
					annotationPath: "/SalesOrderManage/DecimalProp",
					availability: "Default",
					relativePath: "DecimalProp",
					propertyInfos: ["Property::DecimalProp"],
					sortable: true,
					exportSettings: {
						template: "{0}"
					}
				},
				expected: {
					name: "DecimalProp",
					label: "Decimal property",
					visible: true,
					exportSettings: {
						label: "Decimal property",
						type: "Number",
						scale: 7
					}
				}
			},
			{
				desc: "Double property",
				columnInfo: {
					name: "DoubleProp",
					label: "Double property",
					annotationPath: "/SalesOrderManage/DoubleProp",
					availability: "Default",
					relativePath: "DoubleProp",
					propertyInfos: ["Property::DoubleProp"],
					sortable: true,
					exportSettings: {
						template: "{0}"
					}
				},
				expected: {
					name: "DoubleProp",
					label: "Double property",
					visible: true,
					exportSettings: {
						label: "Double property",
						type: "Number"
					}
				}
			},
			{
				desc: "Integer64 property",
				columnInfo: {
					name: "Integer64Prop",
					label: "Integer64 property",
					annotationPath: "/SalesOrderManage/Integer64Prop",
					availability: "Default",
					relativePath: "Integer64Prop",
					propertyInfos: ["Property::Integer64Prop"],
					sortable: true,
					exportSettings: {
						template: "{0}"
					}
				},
				expected: {
					name: "Integer64Prop",
					label: "Integer64 property",
					visible: true,
					exportSettings: {
						label: "Integer64 property",
						type: "Number",
						delimiter: true,
						template: "{0}"
					}
				}
			}
		];

		aTestData.forEach(function(oTestData) {
			QUnit.test("_fetchPropertyInfo unit tests - " + oTestData.desc, function(assert) {
				var oPropertyInfo = TableDelegate._fetchPropertyInfo(oBindingContext, oTestData.columnInfo);
				for (var key in oTestData.expected) {
					if (key !== "exportSettings") {
						assert.equal(oPropertyInfo[key], oTestData.expected[key], "Checking " + key);
					} else {
						for (var settingsKey in oTestData.expected[key]) {
							assert.equal(
								oPropertyInfo[key][settingsKey],
								oTestData.expected[key][settingsKey],
								"Checking " + key + "/" + settingsKey
							);
						}
					}
				}
			});
		});

		var aTestExportLabelsData = [
			{
				desc: "One Label",
				columnInfo: {
					label: "One Label"
				},
				bRTLLanguage: false,
				expected: "One Label"
			},
			{
				desc: "Two Labels - LRT",
				columnInfo: {
					label: "Two Labels",
					exportSettings: {
						labels: ["First Label", "Second Label"]
					}
				},
				bRTLLanguage: false,
				expected: "First Label - Second Label"
			},
			{
				desc: "Two Labels - RTL",
				columnInfo: {
					label: "Two Labels RTL",
					exportSettings: {
						labels: ["First Label", "Second Label"]
					}
				},
				bRTLLanguage: true,
				expected: "Second Label - First Label"
			},
			{
				desc: "Three Labels - LTR",
				columnInfo: {
					label: "Three Labels LTR",
					exportSettings: {
						labels: ["First Label", "Second Label", "Third Label"]
					}
				},
				bRTLLanguage: false,
				expected: "First Label - Second Label - Third Label"
			},
			{
				desc: "Three Labels - RTL",
				columnInfo: {
					label: "Three Labels",
					exportSettings: {
						labels: ["First Label", "Second Label", "Third Label"]
					}
				},
				bRTLLanguage: true,
				expected: "Third Label - Second Label - First Label"
			},
			{
				desc: "Three Labels - RTL - one of them to be translated i18n",
				columnInfo: {
					label: "Three Labels",
					exportSettings: {
						labels: ["{@i18n>FirstLabel}", "Second Label", "Third Label"]
					}
				},
				bRTLLanguage: true,
				expected: "Third Label - Second Label - First Label translated"
			},
			{
				desc: "Four Labels - RTL - one of them to be translated from messagebundle on macros - TargetValue from DataPoint",
				columnInfo: {
					label: "Three Labels",
					exportSettings: {
						labels: ["{@i18n>FirstLabel}", "Second Label", "Third Label", "DataPoint.TargetValue"]
					}
				},
				bRTLLanguage: true,
				expected: "Target Value - Third Label - Second Label - First Label translated"
			}
		];

		aTestExportLabelsData.forEach(function(oTestData) {
			var oTable = {
				getModel: function() {
					return {
						getResourceBundle: function() {
							return {
								getText: function() {
									return "First Label translated";
								}
							};
						}
					};
				}
			};
			QUnit.test("_getExportLabel unit tests - " + oTestData.desc, function(assert) {
				var sExportLabel = TableDelegate._getExportLabel(
					oTestData.columnInfo,
					oTestData.columnInfo.label,
					oTable,
					undefined,
					oTestData.bRTLLanguage
				);
				assert.equal(sExportLabel, oTestData.expected, "Checking Export label");
			});
		});
	}
);
