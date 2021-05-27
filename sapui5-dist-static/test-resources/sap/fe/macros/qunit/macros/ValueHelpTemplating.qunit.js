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

		var oResourceModel = new ResourceModel({ bundleName: "sap.ui.mdc.messagebundle", async: true });

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.macros.internal.valuehelp.ValueHelp",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"idPrefix": "somePrefix",
							"conditionModel": "someConditionModel",
							"requestGroupId": "$auto.Heroes"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyQuatity -> PropertyUnit via @Unit
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/0/Value"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyQuantity::PropertyUnit",
									"delegate":
										"{name: 'sap/fe/macros/FieldValueHelpDelegate', payload: {propertyPath: '/someEntitySet/PropertyUnit', conditionModel: 'someConditionModel'}}",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyUnit
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/1/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyUnit",
									"delegate":
										"{name: 'sap/fe/macros/FieldValueHelpDelegate', payload: {propertyPath: '/someEntitySet/PropertyUnit', conditionModel: 'someConditionModel'}}",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/1/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyUnit",
									"validateInput": "false",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/2/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyAmount::PropertyCurrency",
									"delegate":
										"{name: 'sap/fe/macros/FieldValueHelpDelegate', payload: {propertyPath: '/someEntitySet/PropertyCurrency', conditionModel: 'someConditionModel'}}",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/3/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyCurrency",
									"delegate":
										"{name: 'sap/fe/macros/FieldValueHelpDelegate', payload: {propertyPath: '/someEntitySet/PropertyCurrency', conditionModel: 'someConditionModel'}}",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/3/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragment": {
									"id": "somePrefix::PropertyCurrency",
									"validateInput": "false",
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/4/Value",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"ValueHelpMacroFragmentWithDateTimeFilters": {
									"id": "somePrefix::PropertyDate",
									"open": null,
									"customData:requestGroupId": "$auto.Heroes"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Value Help Fragment with Simple Metadata",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
