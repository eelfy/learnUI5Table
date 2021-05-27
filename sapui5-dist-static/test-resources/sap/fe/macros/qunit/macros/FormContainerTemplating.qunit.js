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
					sFragmentName: "sap.fe.macros.FormContainer",
					sDescription: "Without NavigationProperty",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formContainerId",
							"idPrefix": "somePrefix",
							"title": "Form Container Title",
							"navigationPath": "",
							"visibilityPath": ""
						}),
						"dataFieldCollection": [
							{
								"key": "DataField::PropertyQuantity",
								"type": "Annotation",
								"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification/0"
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
						]
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"entitySet": "/someEntitySet",
								"dataFieldCollection": "/"
							},
							oExpectedResultsPerTest: {
								"formC": {
									"id": "formContainerId",
									"title": "Form Container Title",
									"binding":
										'{"path":"","parameters":{"$select":"PropertyQuantity,SemanticKeyWithSemanticObject,PropertyUnit"}}',
									"visible": "true"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.FormContainer",
					sDescription: "With NavigationProperty",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formContainerId",
							"idPrefix": "somePrefix",
							"title": "Form Container Title",
							"navigationPath": "_some2ndEntity",
							"visibilityPath": "Property2Boolean"
						}),
						"dataFieldCollection": [
							{
								"key": "DataField::Property2String",
								"type": "Annotation",
								"annotationPath": "/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/0/"
							},
							{
								"key": "DataField::Property2Quantity",
								"type": "Annotation",
								"annotationPath": "/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/1/"
							},
							{
								"key": "DataField::Property2Date",
								"type": "Annotation",
								"annotationPath": "/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification/2/"
							}
						]
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"entitySet": "/some2ndEntitySet",
								"dataFieldCollection": "/"
							},
							oExpectedResultsPerTest: {
								"formC": {
									"id": "formContainerId",
									"title": "Form Container Title",
									"binding": '{"path":"_some2ndEntity"}',
									"visible": "{= !${Property2Boolean} }"
								}
							}
						}
					]
				},
				// {
				// 	sFragmentName: "sap.fe.macros.form.DataFieldCollection",
				// 	sDescription: "Testing from Data Field Collection With NavigationProperty",
				// 	mModels: {
				// 		"sap.ui.mdc.i18n": oResourceModel,
				// 		//For macro fragements we need to simulate the this model
				// 		"this": new JSONModel({
				// 			"id": "formContainerId",
				// 			"idPrefix": "somePrefix",
				// 			"title": "Form Container Title",
				// 			"navigationPath": "_some2ndEntity",
				// 			"visibilityPath": "Property2Boolean"
				// 		}),
				// 		"formContainer": {
				// 			"id": "some2ndEntity",
				// 			"formElements": [
				// 				{
				// 					"key": "DataField::Property2String",
				// 					"type": "Annotation",
				// 					"annotationPath":
				// 						"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/0/"
				// 				},
				// 				{
				// 					"key": "DataField::Property2Date",
				// 					"type": "Annotation",
				// 					"annotationPath":
				// 						"/someEntitySet/_some2ndEntity/@com.sap.vocabularies.UI.v1.FieldGroup#F1/Data/1/"
				// 				}
				// 			],
				// 			"annotationPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/2"
				// 		}
				// 	},
				// 	/* tests is an array as you may test the same expression against different annotation examples */
				// 	tests: [
				// 		{
				// 			mBindingContexts: {
				// 				"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/2",
				// 				"entitySet": "/someEntitySet",
				// 				"formContainer": "/"
				// 			},
				// 			oExpectedResultsPerTest: {
				// 				"formC": {
				// 					"id": "fe::FormContainer::some2ndEntity",
				// 					"binding": '{"path":"_some2ndEntity"}',
				// 					"visible": "true"
				// 				}
				// 			}
				// 		}
				// 	]
				// },
				{
					sFragmentName: "sap.fe.macros.form.DataFieldCollection",
					sDescription: "Testing from Data Field Collection Without NavigationProperty",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formContainerId",
							"idPrefix": "somePrefix",
							"title": "Form Container Title",
							"navigationPath": "_some2ndEntity",
							"visibilityPath": "Property2Boolean"
						}),
						"formContainer": {
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
						}
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0",
								"entitySet": "/someEntitySet",
								"formContainer": "/"
							},
							oExpectedResultsPerTest: {
								"formC": {
									"id": "fe::FormContainer::GeneralInformation",
									"binding":
										'{"path":"","parameters":{"$select":"PropertyQuantity,SemanticKeyWithSemanticObject,PropertyUnit"}}',
									"visible": "true"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"FormContainer Fragment with Simple Metadata",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
