/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/test/TemplatingTestUtils",
		"./metadata/simpleMetadata"
		/* All controls that must be loaded for the tests */
	],
	function(ResourceModel, JSONModel, TemplatingTestUtils, simpleMetadata) {
		"use strict";

		var oResourceModel = new ResourceModel({
			bundleName: "sap.ui.mdc.messagebundle",
			async: true
		});

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					// Testing EditMode: 'Display'
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable false",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"partOfPreview": "true",
							"valueHelpRequestGroupId": "$auto.Heroes"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "GeneralInformation",
										"formElements": [
											{
												"key": "DataField::PropertyQuantity",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::PropertyUnit",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::PropertyAmount",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/2/"
											},
											{
												"key": "DataField::PropertyCurrency",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/3/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::Property2Quantity",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/2/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/1"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/2"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true",
									"macrodata:valueHelpRequestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "Description",
										"formElements": [
											{
												"key": "DataField::PropertyString",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::PropertyDate",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true",
									"macrodata:valueHelpRequestGroupId": "$auto.Heroes"
								}
							}
						}
					]
				},
				{
					// Testing EditMode: 'Editable'
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable true",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"useFormContainerLabels": "true",
							"partOfPreview": "true"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "GeneralInformation",
										"formElements": [
											{
												"key": "DataField::PropertyQuantity",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::PropertyUnit",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::PropertyAmount",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/2/"
											},
											{
												"key": "DataField::PropertyCurrency",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/3/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::Property2Quantity",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/2/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/1"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/2"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "Description",
										"formElements": [
											{
												"key": "DataField::PropertyString",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::PropertyDate",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					// Testing EditMode as binding
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"partOfPreview": "true"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "GeneralInformation",
										"formElements": [
											{
												"key": "DataField::PropertyQuantity",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::PropertyUnit",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::PropertyAmount",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/2/"
											},
											{
												"key": "DataField::PropertyCurrency",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/3/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::Property2Quantity",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/2/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/1"
									},
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/2"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "Description",
										"formElements": [
											{
												"key": "DataField::PropertyString",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::PropertyDate",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					// Testing Form with FormContainer having navigation to another entitySet.
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model and form container",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"useFormContainerLabels": "true",
							"partOfPreview": "true"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/$Type/@com.sap.vocabularies.UI.v1.Facets/2/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "some2ndEntity",
										"formElements": [
											{
												"key": "DataField::Property2String",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::Property2Quantity",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::Property2Date",
												"type": "Annotation",
												"annotationPath":
													"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/2/"
											}
										],
										"annotationPath": "/someEntitySet/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Facets/0"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true",
									"title": "Title"
								}
							}
						}
					]
				},
				{
					// Testing Form with FormContainer.
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model and form container with navigation",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"partOfPreview": "false"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/3/",
								"entitySet": "/someEntitySet",
								"formContainers": [
									{
										"id": "Description",
										"formElements": [
											{
												"key": "DataField::PropertyString",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
											},
											{
												"key": "DataField::PropertyDate",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/3/Facets/0"
									},
									{
										"id": "GeneralInformation",
										"formElements": [
											{
												"key": "DataField::PropertyQuantity",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/0/"
											},
											{
												"key": "DataField::PropertyUnit",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/1/"
											},
											{
												"key": "DataField::PropertyAmount",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/2/"
											},
											{
												"key": "DataField::PropertyCurrency",
												"type": "Annotation",
												"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/3/"
											}
										],
										"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/3/Facets/1"
									}
								]
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true",
									"title": "Title"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Form Fragment with Simple Metadata",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
