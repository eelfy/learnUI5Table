/* global QUnit sap
 */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/fe/test/TemplatingTestUtils",
		"./metadata/simpleMetadata",
		"sap/ui/model/json/JSONModel"
		/* All controls that must be loaded for the tests */
	],
	function(ResourceModel, TemplatingTestUtils, simpleMetadata, JSONModel) {
		"use strict";

		var oResourceModel = new ResourceModel({
			bundleName: "sap.ui.mdc.messagebundle",
			async: true
		});

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Bullet MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitBulletChart",
								"collection": "/CreditLimitDetailsMicroChart"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::CreditLimitChartHeader",
									size: "S"
								})
							},
							oExpectedResultsPerTest: {
								"BulletMicroChart": {
									"actualValueLabel":
										"{ path: 'PropertyAmount', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 1 }, formatOptions: { style: 'short' } }",
									"targetValueLabel": null,
									"size": "S"
								},
								"BulletMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::CreditLimitChartHeader::BulletMicroChart",
									"binding":
										"{ path: 'CreditLimitDetailsMicroChart', parameters : {$$groupId : '$auto.LongRunners',$select : 'PropertyCurrency'} }",
									"visible": "true",
									"uomPath": "PropertyCurrency"
								},
								"BulletMicroChartData": {
									"value": "{PropertyAmount}",
									"color":
										"{= (${propertyColor} === 'Negative' || ${propertyColor} === '1' || ${propertyColor} === 1 ) ? 'Error' : (${propertyColor} === 'Critical' || ${propertyColor} === '2' || ${propertyColor} === 2 ) ? 'Critical' : (${propertyColor} === 'Positive' || ${propertyColor} === '3' || ${propertyColor} === 3 ) ? 'Good' : 'Neutral'}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Comparison MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitComparisonChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::ComparisonMicroChart",
									size: "M"
								})
							},
							oExpectedResultsPerTest: {
								"ComparisonMicroChart": {
									"data":
										"{path:'/some2ndEntitySet', parameters : {$select : 'propertyColor,PropertyCurrency,SalesOrderItem'} }",
									"size": "M"
								},
								"ComparisonMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::ComparisonMicroChart::ComparisonMicroChart",
									"dataPointQualifiers": "CustomerCreditExposureAmountBulletChart",
									"binding": "{path:'', parameters : { $$groupId: '$auto.LongRunners'} }",
									"uomPath": "PropertyCurrency"
								},
								"ComparisonMicroChartData": {
									"title": "{SalesOrderItem}",
									"displayValue":
										"{ path: 'PropertyAmount', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 1 }, formatOptions: { style: 'short' } }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Area MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitAreaChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::AreaMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"AreaMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::AreaMicroChart::AreaMicroChart",
									"renderLabels": "true",
									"uomPath": "PropertyCurrency",
									"dimension": "SalesOrderItem",
									"measurePrecision": null,
									"measureScale": "1",
									"dimensionPrecision": null,
									"dataPointQualifiers": "CustomerCreditExposureAmountBulletChart",
									"binding": "{path:'', parameters : { $$groupId: '$auto.LongRunners'} }"
								},
								"AreaMicroChartItem": {
									"points": "{path:'/some2ndEntitySet', parameters : {$select : 'PropertyCurrency,SalesOrderItem'} }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Column MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitColumnChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::ColumnMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"ColumnMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::ColumnMicroChart::ColumnMicroChart",
									"renderLabels": "true",
									"uomPath": "PropertyCurrency",
									"dimension": "SalesOrderItem",
									"measureScale": "1",
									"dataPointQualifiers": "CustomerCreditExposureAmountBulletChart"
								},
								"ColumnMicroChart": {
									"columns":
										"{path:'/some2ndEntitySet', parameters : {$select : 'propertyColor,PropertyCurrency,SalesOrderItem'} }"
								},
								"ColumnMicroChartData": {
									"value": "{PropertyAmount}",
									"color":
										"{= (${propertyColor} === 'Negative' || ${propertyColor} === '1' || ${propertyColor} === 1 ) ? 'Error' : (${propertyColor} === 'Critical' || ${propertyColor} === '2' || ${propertyColor} === 2 ) ? 'Critical' : (${propertyColor} === 'Positive' || ${propertyColor} === '3' || ${propertyColor} === 3 ) ? 'Good' : 'Neutral'}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "HarveyBall MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitHarveyBallChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::HarveyBallMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"HarveyBallMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::HarveyBallMicroChart::HarveyBallMicroChart",
									"uomPath": "PropertyCurrency",
									"binding":
										"{ path: '', parameters : {$$groupId : '$auto.LongRunners',$select : 'propertyColor,PropertyCurrency'} }",
									"visible": "true"
								},
								"HarveyBallMicroChart": {
									"totalLabel":
										"{ path: 'PropertyInt32', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 1 }, formatOptions: { style: 'short' } }",
									"colorPalette": null
								},
								"HarveyBallMicroChartItem": {
									"fractionLabel":
										"{ path: 'PropertyAmount', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 1 }, formatOptions: { style: 'short' } }",
									"fraction": "{PropertyAmount}",
									"color":
										"{= (${propertyColor} === 'Negative' || ${propertyColor} === '1' || ${propertyColor} === 1 ) ? 'Error' : (${propertyColor} === 'Critical' || ${propertyColor} === '2' || ${propertyColor} === 2 ) ? 'Critical' : (${propertyColor} === 'Positive' || ${propertyColor} === '3' || ${propertyColor} === 3 ) ? 'Good' : 'Neutral'}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "HarveyBall MicroChart validate colorPalette",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation":
									"/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitHarveyBallChartWithoutCriticallity",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::HarveyBallMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"HarveyBallMicroChart": {
									"colorPalette":
										"sapUiChartPaletteQualitativeHue1, sapUiChartPaletteQualitativeHue2, sapUiChartPaletteQualitativeHue3,          sapUiChartPaletteQualitativeHue4, sapUiChartPaletteQualitativeHue5, sapUiChartPaletteQualitativeHue6, sapUiChartPaletteQualitativeHue7,          sapUiChartPaletteQualitativeHue8, sapUiChartPaletteQualitativeHue9, sapUiChartPaletteQualitativeHue10, sapUiChartPaletteQualitativeHue11"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Line MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitLineChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::LineMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"LineMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::LineMicroChart::LineMicroChart",
									"uomPath": "PropertyCurrency",
									"dimension": "SalesOrderItem",
									"measureScale": "1",
									"binding": "{path:'', parameters : { $$groupId: '$auto.LongRunners'} }"
								},
								"LineMicroChartLine": {
									"points": "{path:'/some2ndEntitySet', parameters : {$select : 'PropertyCurrency,SalesOrderItem'} }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Line MicroChart validate Measure Scale",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation":
									"/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitLineChartWithoutCriticallity",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::LineMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"LineMicroChartContainer": {
									"measureScale": "5",
									"binding": "{path:'', parameters : { $$groupId: '$auto.LongRunners'} }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Radial MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#CreditLimitRadialChart",
								"collection": "/CreditLimitDetailsMicroChart"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									hideOnNoData: "true",
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::RadialMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"RadialMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::RadialMicroChart::RadialMicroChart",
									"binding": "{ path: 'CreditLimitDetailsMicroChart', parameters : {$$groupId : '$auto.LongRunners'} }",
									"visible": "true"
								},
								"RadialMicroChart": {
									"total": "5",
									"hideOnNoData": "true",
									"percentage": "{= !${DataPoint>TargetValue} ? ${{DataPoint>Value@@MODEL.value} : undefined }",
									"valueColor":
										"{= (${propertyColor} === 'Negative' || ${propertyColor} === '1' || ${propertyColor} === 1 ) ? 'Error' : (${propertyColor} === 'Critical' || ${propertyColor} === '2' || ${propertyColor} === 2 ) ? 'Critical' : (${propertyColor} === 'Positive' || ${propertyColor} === '3' || ${propertyColor} === 3 ) ? 'Good' : 'Neutral'}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.MicroChart",
					sDescription: "Stacked Bar MicroChart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"chartAnnotation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart#creditLimitBarStackedChart",
								"collection": "/some2ndEntitySet"
							},
							mModels: {
								"this": new JSONModel({
									groupId: "$auto.LongRunners",
									renderLabels: true,
									id: "SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::StackedBarMicroChart"
								})
							},
							oExpectedResultsPerTest: {
								"StackedBarMicroChartContainer": {
									"id":
										"SalesOrder::SalesOrderManageObjectPage--fe::HeaderFacet::MicroChart::StackedBarMicroChart::StackedBarMicroChart",
									"dataPointQualifiers": "CustomerCreditExposureAmountBulletChart",
									"binding": "{path:'', parameters : { $$groupId: '$auto.LongRunners'} }"
								},
								"StackedBarMicroChart": {
									"bars": "{path:'/some2ndEntitySet', parameters : {$select : 'propertyColor,PropertyCurrency'} }"
								},
								"StackedBarMicroChartBar": {
									"value": "{PropertyAmount}",
									"displayValue": null,
									"valueColor":
										"{= (${propertyColor} === 'Negative' || ${propertyColor} === '1' || ${propertyColor} === 1 ) ? 'Error' : (${propertyColor} === 'Critical' || ${propertyColor} === '2' || ${propertyColor} === 2 ) ? 'Critical' : (${propertyColor} === 'Positive' || ${propertyColor} === '3' || ${propertyColor} === 3 ) ? 'Good' : 'Neutral'}"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"MicroChart Fragments with Simple Metadata.",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
