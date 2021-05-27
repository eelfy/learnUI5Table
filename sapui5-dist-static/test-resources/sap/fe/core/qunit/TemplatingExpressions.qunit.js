/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/test/TemplatingTestUtils",
		"./test/simpleMetadata",
		"./test/iteloMetadata",
		/* All controls that must be loaded for the tests */
		"sap/m/RatingIndicator"
	],
	function(ResourceModel, JSONModel, TemplatingTestUtils, simpleMetadata, iteloMetadata) {
		"use strict";
		var oResourceModel = new ResourceModel({ bundleName: "sap.fe.templates.messagebundle", async: true });
		var oConverterModel = new JSONModel({
			filterBarId: "filterBar_ID",
			presentation: {},
			variantManagement: { targetControlIds: "fe::ListReport" },
			showHeader: true,
			showAnchorBar: true,
			headerFacets: [
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/0/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/1/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/2/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/3/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/4/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/5/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/6/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/7/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/8/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/9/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/10/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/11/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/12/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNav"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/13/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDVH"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/14/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDH"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/15/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDM"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/16/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDL"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/17/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGID"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/18/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DP"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/19/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDVH"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/20/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDH"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/21/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDM"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/22/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDL"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/23/",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#DPGID"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/24/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/25/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/26/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/27/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/28/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/29/",
					"targetAnnotationType": "Chart"
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Form/0",
					"targetAnnotationType": "FieldGroup",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.FieldGroup#test",
					"headerFormData": {
						"id": "fe::HeaderFacet::Form::TestData",
						"label": "Test Data",
						"formElements": [
							{
								"isValueMultilineText": true,
								"type": "Annotation",
								"visible": true,
								"label": "Group field 1",
								"idPrefix": "fe::HeaderFacet::Form::TestData::DataField::Field1",
								"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#test/Data/0/"
							},
							{}
						]
					}
				},
				{
					"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Form/1",
					"targetAnnotationType": "DataPoint",
					"targetAnnotationValue": "@com.sap.vocabularies.UI.v1.DataPoint#NetValue"
				}
			],
			headerActions: [
				{ type: "Primary" },
				{ type: "Secondary" },
				{
					type: "ForAction",
					annotationPath: simpleMetadata().someNamespace["$Annotations"]["someNamespace.someEntityType"][
						"@com.sap.vocabularies.UI.v1.Identification"
					][0]
				},
				{ type: "ManifestActionTest", text: "Manifest Action", id: "ManifestAction--Button", visible: true, enabled: false }
			],
			footerActions: [
				{ type: "Primary" },
				{ type: "Secondary" },
				{ type: "DefaultApply" },
				{
					type: "ForAction",
					annotationPath: simpleMetadata().someNamespace["$Annotations"]["someNamespace.someEntityType"][
						"@com.sap.vocabularies.UI.v1.Identification"
					][1]
				},
				{ type: "ManifestActionTest", text: "Manifest Action", id: "ManifestAction--Button", visible: true, enabled: false }
			]
		});
		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderFacet",
					mModels: {
						"viewData": new JSONModel({
							controlConfiguration: {
								"_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDVH": {
									requestGroupId: "Heroes"
								},
								"_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDH": {
									requestGroupId: "Decoration"
								},
								"_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDM": {
									requestGroupId: "Workers"
								},
								"_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDL": {
									requestGroupId: "LongRunners"
								},
								"_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGID": {
									requestGroupId: "microChart"
								},
								"@com.sap.vocabularies.UI.v1.Chart#ChartGIDVH": {
									requestGroupId: "Heroes"
								},
								"@com.sap.vocabularies.UI.v1.Chart#ChartGIDH": {
									requestGroupId: "Decoration"
								},
								"@com.sap.vocabularies.UI.v1.Chart#ChartGIDM": {
									requestGroupId: "Workers"
								},
								"@com.sap.vocabularies.UI.v1.Chart#ChartGIDL": {
									requestGroupId: "LongRunners"
								},
								"@com.sap.vocabularies.UI.v1.Chart#ChartGID": {
									requestGroupId: "microChart"
								},
								"_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDVH": {
									requestGroupId: "Heroes"
								},
								"_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDH": {
									requestGroupId: "Decoration"
								},
								"_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDM": {
									requestGroupId: "Workers"
								},
								"_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDL": {
									requestGroupId: "LongRunners"
								},
								"_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGID": {
									requestGroupId: "dataPoint"
								},
								"@com.sap.vocabularies.UI.v1.DataPoint#DPGIDVH": {
									requestGroupId: "Heroes"
								},
								"@com.sap.vocabularies.UI.v1.DataPoint#DPGIDH": {
									requestGroupId: "Decoration"
								},
								"@com.sap.vocabularies.UI.v1.DataPoint#DPGIDM": {
									requestGroupId: "Workers"
								},
								"@com.sap.vocabularies.UI.v1.DataPoint#DPGIDL": {
									requestGroupId: "LongRunners"
								},
								"@com.sap.vocabularies.UI.v1.DataPoint#DPGID": {
									requestGroupId: "dataPoint"
								},
								"_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDVH": {
									requestGroupId: "Heroes"
								},
								"_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDH": {
									requestGroupId: "Decoration"
								},
								"_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDM": {
									requestGroupId: "Workers"
								},
								"_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDL": {
									requestGroupId: "LongRunners"
								},
								"_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGID": {
									requestGroupId: "dataPoint"
								}
							}
						}),
						"converterHeaderFacet": oConverterModel
					},
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/0/",
								"converterHeaderFacet": "/headerFacets/0"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/1/",
								"converterHeaderFacet": "/headerFacets/1"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/2/",
								"converterHeaderFacet": "/headerFacets/2"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Decoration"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/3/",
								"converterHeaderFacet": "/headerFacets/3"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Workers"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/4/",
								"converterHeaderFacet": "/headerFacets/4"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.LongRunners"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/5/",
								"converterHeaderFacet": "/headerFacets/5"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/6/",
								"converterHeaderFacet": "/headerFacets/6"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/7/",
								"converterHeaderFacet": "/headerFacets/7"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/8/",
								"converterHeaderFacet": "/headerFacets/8"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Decoration"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/9/",
								"converterHeaderFacet": "/headerFacets/9"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Workers"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/10/",
								"converterHeaderFacet": "/headerFacets/10"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.LongRunners"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/11/",
								"converterHeaderFacet": "/headerFacets/11"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"groupId": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/12/",
								"converterHeaderFacet": "/headerFacets/12"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/13/",
								"converterHeaderFacet": "/headerFacets/13"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Heroes' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/14/",
								"converterHeaderFacet": "/headerFacets/14"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Decoration' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/15/",
								"converterHeaderFacet": "/headerFacets/15"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Workers' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/16/",
								"converterHeaderFacet": "/headerFacets/16"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.LongRunners' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/17/",
								"converterHeaderFacet": "/headerFacets/17"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/18/",
								"converterHeaderFacet": "/headerFacets/18"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/19/",
								"converterHeaderFacet": "/headerFacets/19"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Heroes' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/20/",
								"converterHeaderFacet": "/headerFacets/20"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Decoration' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/21/",
								"converterHeaderFacet": "/headerFacets/21"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.Workers' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/22/",
								"converterHeaderFacet": "/headerFacets/22"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": "{ path : '', parameters : { $$groupId : '$auto.LongRunners' } }"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/23/",
								"converterHeaderFacet": "/headerFacets/23"
							},
							oExpectedResultsPerTest: {
								"headerFacetContent": {
									"binding": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/24/",
								"converterHeaderFacet": "/headerFacets/24"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Decoration"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/25/",
								"converterHeaderFacet": "/headerFacets/25"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/26/",
								"converterHeaderFacet": "/headerFacets/26"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Decoration"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/27/",
								"converterHeaderFacet": "/headerFacets/27"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Workers"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/28/",
								"converterHeaderFacet": "/headerFacets/28"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.LongRunners"
								}
							}
						},
						{
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.HeaderFacets/29/",
								"converterHeaderFacet": "/headerFacets/29"
							},
							oExpectedResultsPerTest: {
								"macroMicroChart": {
									"groupId": "$auto.Decoration"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderRatingIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#noTargetValue"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of 5"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueStatic"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of 5"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueDynamic"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of {PropertyInt32}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					sDescription: "#1",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel,
						"manifest": new JSONModel({ "sap.app": { subTitle: "Sample Title", title: "Sample Title1" }, async: true }),
						"viewData": new JSONModel({ "variantManagement": "Page" })
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entitySetPath: "/someEntitySet",
								converterContext: "/",
								collection: "/someEntitySet/someNamespace.someEntityType",
								visualizationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								presentationContext: "/"
							},
							oExpectedResultsPerTest: {
								"listReportFooterTest": {
									"showFooter": "false"
								},
								"listReportVMPageTest": {
									"id": "fe::PageVariantManagement"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					sDescription: "#2",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel,
						"manifest": new JSONModel({ "sap.app": { subTitle: "Sample Title", title: "Sample Title1" }, async: true }),
						"viewData": new JSONModel({ "variantManagement": "Control" })
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entitySetPath: "/someEntitySet",
								converterContext: "/",
								collection: "/someEntitySet/someNamespace.someEntityType",
								visualizationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								presentationContext: "/"
							},
							oExpectedResultsPerTest: {
								"listReportFooterTest": {
									"showFooter": "false"
								},
								"listReportVMControlTest": {
									"id": "filterBar_ID::VariantManagement"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					sDescription: "#3",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel,
						"manifest": new JSONModel({ "sap.app": { subTitle: "Sample Title", title: "Sample Title1" }, async: true }),
						"viewData": new JSONModel({ "variantManagement": "None" })
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entitySetPath: "/someEntitySet",
								converterContext: "/",
								collection: "/someEntitySet/someNamespace.someEntityType",
								visualizationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								presentationContext: "/"
							},
							oExpectedResultsPerTest: {
								"listReportTitleTest": {
									"text": "Sample Title"
								},
								"listReportFooterTest": {
									"showFooter": "false"
								},
								"listReportFilterBarTest": {
									"variantBackreference": null
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					sDescription: "Variant Management Control",
					mModels: {
						"converterContext": oConverterModel,
						"viewData": new JSONModel({
							"variantManagement": "Page"
						})
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								viewData: "/",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"listReportFilterBarTest": {
									"variantBackreference": "fe::PageVariantManagement"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					sDescription: "Variant Management Page",
					mModels: {
						"converterContext": oConverterModel,
						"viewData": new JSONModel({
							"variantManagement": "Control"
						})
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								viewData: "/",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"listReportFilterBarTest": {
									"variantBackreference": "filterBar_ID::VariantManagement"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Square Avatar with image displayed",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarImageUrlTest": {
									"src": "sap-icon://customer-and-supplier",
									"initials": "",
									"fallbackIcon": "sap-icon://product",
									"displayShape": "Square"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Circle Avatar with fallback icon displayed",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet2",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarImageUrlTest": {
									"src": "sap-icon://xxxx",
									"initials": "",
									"fallbackIcon": "sap-icon://add-contact",
									"displayShape": "Circle"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Circle Avatar with placeholder fallback icon displayed",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet3",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarImageUrlTest": {
									"src": "sap-icon://xxxx",
									"initials": "",
									"fallbackIcon": "sap-icon://person-placeholder",
									"displayShape": "Circle"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Square Avatar with icon displayed",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet4",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarTypeImageUrlTest": {
									"src": "sap-icon://add-contact",
									"initials": "",
									"fallbackIcon": "sap-icon://product",
									"displayShape": "Square"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Circle Avatar with Initials as fallback",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet5",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarTypeImageUrlTest": {
									"src": "sap-iconXXXX://add-contact",
									"initials": "SG",
									"fallbackIcon": "sap-icon://person-placeholder",
									"displayShape": "Circle"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					sDescription: "OP Header Circle Avatar with Initials displayed",
					mModels: {
						"converterContext": oConverterModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/headerInfoAvatarEntitySet6",
								converterContext: "/"
							},
							oExpectedResultsPerTest: {
								"AvatarTypeInitialsTest": {
									"initials": "SG",
									"displayShape": "Circle"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.FooterContent",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel,
						"viewData": new JSONModel({
							"resourceBundle": oResourceModel._oResourceBundle
						})
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								fullContextPath: "/someEntitySet",
								converterContext: "/",
								entitySetPath: "/someEntitySet",
								viewData: "/"
							},
							oExpectedResultsPerTest: {
								"OverflowToolbarTest": {
									"visible":
										"{= CORE.getFooterVisible(${converterContext>footerActions}, ${entityType>./@com.sap.vocabularies.UI.v1.Identification})}"
								},
								"ApplyActionTest": {
									"text": "Apply",
									"type": "Emphasized",
									"enabled": "true",
									"visible": "{= ${ui>/editMode} === 'Editable'}",
									"press": "._applyDocument(${$view>/getBindingContext})"
								},
								"PrimaryActionTest": {
									"id": "fe::FooterBar::StandardAction::Save",
									"text": "{= (!%{HasActiveEntity} && !%{IsActiveEntity}) ? 'Create' : 'Save'}",
									"type": "Emphasized",
									"enabled": "true",
									"visible": "{= ${ui>/editMode} === 'Editable' }",
									"press": "cmd:Save"
								},
								"SecondaryActionTest": {
									"id": "fe::FooterBar::StandardAction::Cancel",
									"text": "C_COMMON_OBJECT_PAGE_CANCEL",
									"enabled": "true",
									"visible": "{= ${ui>/editMode} === 'Editable' }",
									"press": "cmd:Cancel"
								},
								"ManifestActionTest": {
									"id": "fe::FooterBar::ManifestAction--Button",
									"text": "Manifest Action",
									"type": "Transparent",
									"enabled": "false",
									"visible": "true",
									"press": "FPM.actionWrapper($event, 'undefined', 'undefined')"
								},
								"AnnotationActionTest": {
									"type": "Default",
									"enabled": "true",
									"visible": "true",
									"press":
										".handlers.onCallActionFromFooter(${$view>/}, 'hello()', { contexts: ${$view>/#fe::ObjectPage/}.getBindingContext(), entitySetName: 'someEntitySet', invocationGrouping: 'Isolated', model: ${$source>/}.getModel(), label: 'undefined', isNavigable: undefined})"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.EditableHeaderFacet",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								converterContext: "/",
								entitySetPath: "/someEntitySet",
								viewData: "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"HeaderInfoFormContainerTest": {
									"title": "Object Information",
									"visible":
										"{= OP.getVisiblityOfHeaderFacet(${entityType>@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value/$Path@},${entityType>@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value/$Path@@FIELD.fieldControl}) }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.Actions",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"converterContext": oConverterModel
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entityType: "someNamespace.someEntityType",
								converterContext: "/",
								entitySetPath: "/someEntitySet",
								viewData: "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"EditActionTest": {
									"id": "fe::StandardAction::Edit",
									"type": "Emphasized",
									"enabled": "true",
									"visible": "{= !(${ui>/editMode} === 'Editable')}"
								},
								"DeleteActionTest": {
									"id": "fe::StandardAction::Delete",
									"type": "Default",
									"enabled": "true",
									"visible": "{= !(${ui>/editMode} === 'Editable')}",
									"press": "cmd:DeleteObject"
								},
								"RelatedAppActionTest": {
									"id": "fe::Share",
									"text": "T_COMMON_SAPFE_ACTION_SHARE",
									"type": "Transparent",
									"enabled": "true",
									"visible": "{= ${fclhelper>/} ? ${fclhelper>/showShareIcon} : true }",
									"press": "cmd:Share"
								},
								"ManifestActionTest": {
									"id": "fe::ManifestAction--Button",
									"text": "Manifest Action",
									"type": "Default",
									"enabled": "false",
									"visible": "true",
									"press": "FPM.actionWrapper($event, 'undefined', 'undefined')"
								},
								"AnnotationActionTest": {
									"type": "Default",
									"enabled": "true",
									"visible": "true",
									"press":
										".editFlow.invokeAction('hello()', { contexts: ${$view>/getBindingContext}, entitySetName: 'someEntitySet', invocationGrouping: 'Isolated', model: ${$source>/}.getModel(), label: 'undefined', isNavigable: undefined})"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderDataPointContent",
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								dataPoint: "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#noTargetValue",
								entitySet: "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"ObjectNumberTest": {
									"state": "None",
									"number":
										'{"path":"PropertyInt16","type":"sap.ui.model.odata.type.Int16","constraints":{"nullable":false},"formatOptions":{"showMeasure":false}}',
									"visible": "true"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderDataPointTitle",
					sDescription: "#1",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mModels: {
								"converterHeaderFacet": oConverterModel
							},
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Form/1/",
								"viewData": "/someEntitySetForViewData1",
								"manifest": "/manifestData1",
								"converterHeaderFacet": "/headerFacets/31"
							},
							oExpectedResultsPerTest: {
								"headerDataPointLinkTest": {
									"visible":
										"{= COMMON.getHeaderDataPointLinkVisibility(ID.generate(['fe', 'HeaderDPLink', ${converterHeaderFacet>targetAnnotationValue}]), true, ${dataPoint>@@FIELD.isNotAlwaysHidden}) }",
									"press": '.handlers.onDataPointTitlePressed($controller, ${$source>}, undefined,"FreestyleNav")'
								},
								"headerDataPointTitleTest": {
									"visible":
										"{= COMMON.getHeaderDataPointLinkVisibility(ID.generate(['fe', 'HeaderDPLink', ${converterHeaderFacet>targetAnnotationValue}]), false, ${dataPoint>@@FIELD.isNotAlwaysHidden}) }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderDataPointTitle",
					sDescription: "#2",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mModels: {
								"converterHeaderFacet": oConverterModel
							},
							mBindingContexts: {
								"headerFacet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Form/1/",
								"viewData": "/someEntitySetForViewData2",
								"converterHeaderFacet": "/headerFacets/31"
							},
							oExpectedResultsPerTest: {
								"HeaderDataPointInternalLinkTest": {
									"press": '.handlers.navigateToSubSection($controller, \'{"subsection":"subsection_New111"}\')'
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.ObjectPageHeaderForm",
					fileType: "fragment",
					tests: [
						{
							mModels: {
								"converterHeaderFacet": oConverterModel
							},
							mBindingContexts: {
								headerForm: "/someEntitySet/@com.sap.vocabularies.UI.v1.Form/0",
								"converterHeaderFacet": "/headerFacets/30"
							},
							oExpectedResultsPerTest: {
								"ObjectPageHeaderHorizontalLayoutTest": {
									"visible": "true"
								},
								"ObjectPageHeaderLabelTest": {
									"vAlign": "Middle",
									"id": "fe::HeaderFacet::Form::TestData::DataField::Field1::Label"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderProgressIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount"
							},
							oExpectedResultsPerTest: {
								"a": {
									"displayValue": "{PropertyInt16} of {PropertyInt32}",
									"percentValue":
										"{= ((${PropertyInt32} > 0) ? ((${PropertyInt16} > ${PropertyInt32}) ? 100 : ((${PropertyInt16} < 0) ? 0 : (${PropertyInt16} / ${PropertyInt32} * 100))) : 0) }"
								},
								"b": {
									"text": "Property of Type Int16"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#HelpfulTotal"
							},
							oExpectedResultsPerTest: {
								"a": {
									"displayValue": "{PropertyInt16} of {PropertyInt32}",
									"percentValue":
										"{= ((${PropertyInt32} > 0) ? ((${PropertyInt16} > ${PropertyInt32}) ? 100 : ((${PropertyInt16} < 0) ? 0 : (${PropertyInt16} / ${PropertyInt32} * 100))) : 0) }"
								},
								"b": {
									"text": "Property of Type Int16"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.core.controls.ActionParameterDialog",
					mModels: {},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someEntitySet/someNamespace.someCollectionBoundAction1/@$ui5.overload/0",
								actionName: "/someEntitySet/someNamespace.someCollectionBoundAction1"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label 1"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "true",
									"display": "Value",
									"value":
										"{path:'someParameter1',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4,'nullable':false},formatOptions:{'parseKeepsEmptyString':true}}",
									"fieldHelp": "someNamespace.someCollectionBoundAction1::someParameter1"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "false",
									"id": "someNamespace.someCollectionBoundAction1::someParameter1"
								}
							}
						},
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someEntitySet/someNamespace.someCollectionBoundAction2/@$ui5.overload/0",
								actionName: "/someEntitySet/someNamespace.someCollectionBoundAction2"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label 2"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "false",
									"display": "{actionParameter>@@FIELD.getAPDialogDisplayFormat}",
									"value":
										"{path:'someParameter2',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4},formatOptions:{'parseKeepsEmptyString':true}}",
									"change": ".handleChange($event, 'someParameter2')",
									"fieldHelp": "someNamespace.someCollectionBoundAction2::someParameter2"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "true",
									"id": "someNamespace.someCollectionBoundAction2::someParameter2",
									"delegate":
										"{ name: 'sap/fe/macros/FieldValueHelpDelegate', payload: { propertyPath: '/someEntitySet/someNamespace.someCollectionBoundAction2/someParameter2'}}"
								}
							}
						},
						// {
						// 	mBindingContexts: {
						// 		entitySet: "/someEntitySet",
						// 		action: "/someEntitySet/someNamespace.someCollectionBoundAction3/@$ui5.overload/0",
						// 		actionName: "/someEntitySet/someNamespace.someCollectionBoundAction3"
						// 	},
						// 	oExpectedResultsPerTest: {
						// 		"ActionParameterDialogLabelExpressionTest": {},
						// 		"ActionParameterDialogFieldExpressionTest": {},
						// 		"ActionParameterDialogValuehelpExpressionTest": {}
						// 	}
						// },
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someNamespace.someUnboundAction1/0",
								actionName: "/someNamespace.someUnboundAction1"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "false",
									"display": "{actionParameter>@@FIELD.getAPDialogDisplayFormat}",
									"value":
										"{path:'someParameter',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4},formatOptions:{'parseKeepsEmptyString':true}}",
									"change": ".handleChange($event, 'someParameter')",
									"fieldHelp": "someNamespace.someUnboundAction1::someParameter"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "true",
									"id": "someNamespace.someUnboundAction1::someParameter",
									"delegate":
										"{ name: 'sap/fe/macros/FieldValueHelpDelegate', payload: { propertyPath: '/someUnboundAction1/someParameter'}}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.core.controls.ActionPartial",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entityType: "/someNamespace.deleteRestrictedEntityType/",
								headerInfo: "/someNamespace.deleteRestrictedEntityType/"
							},
							oExpectedResultsPerTest: {
								"ActionPartialHeaderInfoListHeaderText": {
									"headerText": "Delete Restricted Entities"
								}
							}
						},
						{
							mBindingContexts: {
								entityType: "/someNamespace.deleteRestrictedEntityType/",
								headerInfo: "/someNamespace.deleteRestrictedEntityType/"
							},
							oExpectedResultsPerTest: {
								"ActionPartialHeaderInfoListItemText": {
									"text": "{notApplicable>Name}"
								}
							}
						},
						{
							mBindingContexts: {
								entityType: "/someNamespace.noHeaderInfoEntityType/"
							},
							oExpectedResultsPerTest: {
								"ActionPartialSemanticKeyListItemText": {
									"text": "{notApplicable>key1}"
								}
							}
						}
					]
				}
			];
			TemplatingTestUtils.testFragments(QUnit, "Simple Metadata", simpleMetadata(), aSimpleMetadataFragmentTests);
			var aIteloFragmentTests = [
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderRatingIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/Products/@com.sap.vocabularies.UI.v1.DataPoint#averageRating"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{averageRating} out of 5"
								},
								"HeaderRatingIndicatorLabelTest": {
									"text": "4 ratings",
									"visible": "true"
								},
								"HeaderRatingIndicatorTest": {
									"editable": "false"
								}
							}
						}
					]
				}
			];
			TemplatingTestUtils.testFragments(QUnit, "Itelo Metadata", iteloMetadata, aIteloFragmentTests);
		});
	}
);
