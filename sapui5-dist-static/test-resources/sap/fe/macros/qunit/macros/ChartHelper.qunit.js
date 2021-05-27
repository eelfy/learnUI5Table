/* eslint-disable consistent-return */
/* global QUnit sinon */
sap.ui.define(["sap/fe/macros/chart/ChartHelper"], function(ChartHelper) {
	"use strict";
	QUnit.module("Unit Test for ChartHelper");
	QUnit.test("Unit test for formatDimensions", function(assert) {
		[
			{
				annotationContext: {
					getPath: function() {
						return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath";
					},
					getObject: function(sPath) {
						var oChartAnnotation = {
							$Type: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
							ChartType: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column" },
							Description: "Testing Line Chart",
							DimensionAttributes: [
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
									Dimension: { $PropertyPath: "SalesOrder" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Axis1" }
								},
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
									Dimension: { $PropertyPath: "SoldToParty" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Axis1" }
								}
							],
							Dimensions: [{ $PropertyPath: "SalesOrder" }, { $PropertyPath: "SoldToParty" }],
							MeasureAttributes: [
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Measure: { $PropertyPath: "maxPricing" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
								}
							],
							Measures: [{ $PropertyPath: "maxPricing" }],
							Title: "Height Line Chart"
						};
						return oChartAnnotation;
					},
					getModel: function() {
						return {
							getObject: function(sPath) {
								return "some label";
							},
							createBindingContext: function() {
								return {
									oModel: {},
									sPath: "/SalesOrderManage/SalesOrder",
									bForceRefresh: false,
									sDeepPath: ""
								};
							},
							requestObject: function() {
								return Promise.resolve({});
							}
						};
					}
				},
				expectedValue:
					'[{"key":"SalesOrder","label":"some label","role":"category","criticality":{}},{"key":"SoldToParty","label":"some label","role":"category","criticality":{}}]'
			}
		].forEach(function(oData) {
			var result = ChartHelper.formatDimensions(oData.annotationContext);
			assert.equal(result.getModel().getJSON(), oData.expectedValue, "chart dimensions have been verified");
		});
	});
	QUnit.test("Unit test for formatMeasures", function(assert) {
		[
			{
				annotationContext: {
					getPath: function() {
						return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath";
					},
					getObject: function(sPath) {
						var oChartAnnotation = {
							$Type: "com.sap.vocabularies.UI.v1.ChartDefinitionType",
							ChartType: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column" },
							Description: "Testing Line Chart",
							DimensionAttributes: [
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
									Dimension: { $PropertyPath: "SalesOrder" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Axis1" }
								},
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartDimensionAttributeType",
									Dimension: { $PropertyPath: "SoldToParty" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Axis1" }
								}
							],
							Dimensions: [{ $PropertyPath: "SalesOrder" }, { $PropertyPath: "SoldToParty" }],
							MeasureAttributes: [
								{
									$Type: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
									Measure: { $PropertyPath: "maxPricing" },
									Role: { $EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
								}
							],
							Measures: [{ $PropertyPath: "maxPricing" }],
							Title: "Height Line Chart"
						};
						return oChartAnnotation;
					},
					getModel: function() {
						return {
							getObject: function(sPath) {
								if (sPath.indexOf("AggregatedProperties") > -1) {
									return [
										{
											"@com.sap.vocabularies.Common.v1.Label": "Minimal Net Amount",
											$Type: "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
											Value: "minPricing",
											AggregationMethod: "min",
											AggregatableProperty: { $PropertyPath: "NetPricing" }
										},
										{
											"@com.sap.vocabularies.Common.v1.Label": "Maximal Net Amount",
											$Type: "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
											Value: "maxPricing",
											AggregationMethod: "max",
											AggregatableProperty: { $PropertyPath: "NetPricing" }
										},
										{
											"@com.sap.vocabularies.Common.v1.Label": "Average Net Amount",
											$Type: "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType",
											Value: "avgPricing",
											AggregationMethod: "average",
											AggregatableProperty: { $PropertyPath: "NetPricing" }
										}
									];
								}
								return "Maximal Net Amount";
							},
							createBindingContext: function() {
								return {
									oModel: {},
									sPath: "/SalesOrderManage/SalesOrder",
									bForceRefresh: false,
									sDeepPath: ""
								};
							},
							requestObject: function() {
								return Promise.resolve({});
							}
						};
					}
				},
				expectedValue:
					'[{"key":"maxPricing","label":"Maximal Net Amount","role":"axis1","propertyPath":"NetPricing","aggregationMethod":"max"}]'
			}
		].forEach(function(oData) {
			var result = ChartHelper.formatMeasures(oData.annotationContext);
			assert.equal(result.getModel().getJSON(), oData.expectedValue, "chart measures have been verified");
		});
	});
	QUnit.test("Unit test for getUiChart", function(assert) {
		[
			{
				presentationContext: {
					sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath",
					getPath: function() {
						return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath";
					},
					getObject: function() {
						return "@com.sap.vocabularies.UI.v1.Chart";
					},
					getModel: function() {}
				},
				expectedValue: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath"
			},
			{
				presentationContext: {
					sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant",
					getPath: function() {
						return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant";
					},
					getObject: function() {
						return {
							$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
							Visualizations: [
								{ $AnnotationPath: "@com.sap.vocabularies.UI.v1.Chart" },
								{ $AnnotationPath: "@com.sap.vocabularies.UI.v1.Line" }
							]
						};
					},
					getModel: function() {
						return {
							getMetaContext: function(sPath) {
								return {
									sPath: sPath
								};
							}
						};
					}
				},
				expectedValue: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Chart"
			}
		].forEach(function(oData) {
			var result = ChartHelper.getUiChart(oData.presentationContext);
			assert.deepEqual(result.sPath, oData.expectedValue, "getUiChart verififed");
		});
	});
	QUnit.test("test for getMultiSelectDisabledActions", function(assert) {
		var fnGetActionPathStub = sap.fe.macros.CommonHelper.getActionPath;
		sap.fe.macros.CommonHelper.getActionPath = function(sActionName) {
			return "/SalesOrderManage/" + sActionName;
		};
		[
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						oModel: {},
						getObject: function(sPath) {
							if (sPath.indexOf("@$ui5.overload") > -1) {
								return {
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "_it"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
									}
								};
							}
							return {};
						},
						sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions"
					}
				},
				expectedValue: [],
				sMessage: "no annotations for action parameter"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("@$ui5.overload") > -1) {
								return {
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "_it"
										},
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "someParameter"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
									}
								};
							} else if (sPath.endsWith("@")) {
								return {
									"@com.sap.vocabularies.UI.v1.Hidden": true
								};
							}
							return {};
						}
					}
				},
				expectedValue: [],
				sMessage: "static value of ui.hidden annotated for action parameter"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("@$ui5.overload") > -1) {
								return {
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "_it"
										},
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "someParameter"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
									}
								};
							} else if (sPath.endsWith("@")) {
								return {
									"@com.sap.vocabularies.UI.v1.Hidden": {
										$Path: "somePath"
									}
								};
							}
							return {};
						}
					}
				},
				expectedValue: ["com.service.someBoundAction"],
				sMessage: "path based ui.hidden annotated for action parameter"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("@$ui5.overload") > -1) {
								return {
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "_it"
										},
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "someParameter"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
									}
								};
							} else if (sPath.endsWith("@")) {
								return {
									"@com.sap.vocabularies.Common.v1.FieldControl": {
										$Path: "somePath"
									}
								};
							}
							return {};
						}
					}
				},
				expectedValue: ["com.service.someBoundAction"],
				sMessage: "path based field control annotated for action parameter"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getObject: function(sPath) {
							if (sPath.indexOf("@$ui5.overload") > -1) {
								return {
									$kind: "Action",
									$IsBound: true,
									$EntitySetPath: "_it",
									$Parameter: [
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "_it"
										},
										{
											$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage",
											$Name: "someParameter"
										}
									],
									$ReturnType: {
										$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
									}
								};
							} else if (sPath.endsWith("@")) {
								return {
									"@com.sap.vocabularies.Common.v1.FieldControl": "ReadOnly"
								};
							}
							return {};
						}
					}
				},
				expectedValue: [],
				sMessage: "action parameter annotated with static field control"
			}
		].forEach(function(oData) {
			var result = ChartHelper.getMultiSelectDisabledActions(oData.chartCollection, oData.oInterface);
			assert.equal(result.length, oData.expectedValue.length, "verified with " + oData.sMessage);
		});
		sap.fe.macros.CommonHelper.getActionPath = fnGetActionPathStub;
	});
	QUnit.test("test for getOperationAvailableMap", function(assert) {
		var fnGetEntitySetName = sap.fe.macros.CommonHelper.getActionPath;
		sap.fe.macros.CommonHelper.getEntitySetName = function(sActionName) {
			return "SalesOrderManage";
		};
		[
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getModel: function() {},
						getObject: function(sPath) {
							if (sPath.endsWith("@Org.OData.Core.V1.OperationAvailable")) {
								return true;
							} else if (sPath.endsWith("/$Path")) {
								return;
							} else if (sPath.endsWith("/@$ui5.overload/0/$Parameter/0/$Name")) {
								return "_it";
							}
							return {
								$kind: "EntitySet",
								$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
							};
						},
						sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions",
						getPath: function() {
							return "/ SalesOrderManage /@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/ $AnnotationPath/actions";
						}
					}
				},
				expectedValue: "{}",
				sMessage: "static value of operation available"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getModel: function() {},
						getObject: function(sPath) {
							if (sPath.endsWith("@Org.OData.Core.V1.OperationAvailable")) {
								return null;
							} else if (sPath.endsWith("/$Path")) {
								return;
							} else if (sPath.endsWith("/@$ui5.overload/0/$Parameter/0/$Name")) {
								return "_it";
							}
							return {
								$kind: "EntitySet",
								$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
							};
						},
						sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions",
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions";
						}
					}
				},
				expectedValue: '{"com.service.someBoundAction":null}',
				sMessage: "operation available annotated as null"
			},
			{
				chartCollection: [
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
						SemanticObject: "someSO",
						Action: "someAction",
						Label: "IBN",
						RequiresContext: true
					},
					{
						$Type: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: "Dummy action",
						Action: "com.service.someBoundAction",
						RequiresContext: true
					}
				],
				oInterface: {
					context: {
						getModel: function() {},
						getObject: function(sPath) {
							if (sPath.endsWith("@Org.OData.Core.V1.OperationAvailable")) {
								return { $Path: "_it/somePath" };
							} else if (sPath.endsWith("/$Path")) {
								return "_it/somePath";
							} else if (sPath.endsWith("/@$ui5.overload/0/$Parameter/0/$Name")) {
								return "_it";
							}
							return {
								$kind: "EntitySet",
								$Type: "com.c_salesordermanage_sd_aggregate.SalesOrderManage"
							};
						},
						sPath: "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions",
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.PresentationVariant/Visualizations/0/$AnnotationPath/actions";
						}
					}
				},
				expectedValue: '{"com.service.someBoundAction":"somePath"}',
				sMessage: "operation available having $path"
			}
		].forEach(function(oData) {
			var result = ChartHelper.getOperationAvailableMap(oData.chartCollection, oData.oInterface);
			assert.equal(result, oData.expectedValue, "verified with " + oData.sMessage);
		});
		sap.fe.macros.CommonHelper.getEntitySetName = fnGetEntitySetName;
	});
});
