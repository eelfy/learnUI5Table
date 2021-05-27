/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/macroLibrary",
		"sap/fe/test/TemplatingTestUtils",
		"./metadata/simpleMetadata"
		/* All controls that must be loaded for the tests */
	],
	function(ResourceModel, JSONModel, macroLibrary, TemplatingTestUtils, simpleMetadata) {
		"use strict";

		var oResourceModel = new ResourceModel({ bundleName: "sap.ui.mdc.messagebundle", async: true });

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.macros.fragments.FilterFieldMacro",
					sDescription: "idPrefix/vhIdPrefix defined",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						"setup": new JSONModel({
							idPrefix: "MY_PREFIX",
							vhIdPrefix: "MY_VH_PREFIX"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyQuatity -> PropertyUnit via @Unit
								"property": "/someEntitySet/PropertyString",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "MY_PREFIX::PropertyString",
									"dataType": "Edm.String",
									"fieldHelp": "MY_VH_PREFIX::PropertyString",
									"display": "Value",
									"editMode":
										"{= ${_valueList>Parameters} ? FIELD.getFieldEditModeInValueHelp(${_valueList>}, ${property>@@FIELD.propertyName}) : undefined}",
									"delegate": "{name: 'sap/ui/mdc/odata/v4/FieldBaseDelegate'}"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/PropertyBoolean",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "MY_PREFIX::PropertyBoolean",
									"dataType": "Edm.Boolean",
									"fieldHelp": undefined,
									"display": "Value",
									"editMode":
										"{= ${_valueList>Parameters} ? FIELD.getFieldEditModeInValueHelp(${_valueList>}, ${property>@@FIELD.propertyName}) : undefined}",
									"delegate": "{name: 'sap/ui/mdc/odata/v4/FieldBaseDelegate'}"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/PropertyBoolean"
							},
							sExpectedException: "sap.fe.macros.FilterField: Required metadataContext 'entityType' is missing"
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.fragments.FilterFieldMacroMissingID",
					sDescription: "idPrefix/vhIdPrefix NOT defined",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						"setup": new JSONModel({})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyQuatity -> PropertyUnit via @Unit
								"property": "/someEntitySet/PropertyString",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "FilterField::PropertyString",
									"dataType": "Edm.String",
									"display": "Value",
									"fieldHelp": "FilterFieldValueHelp::PropertyString",
									"editMode":
										"{= ${_valueList>Parameters} ? FIELD.getFieldEditModeInValueHelp(${_valueList>}, ${property>@@FIELD.propertyName}) : undefined}",
									"delegate": "{name: 'sap/ui/mdc/odata/v4/FieldBaseDelegate'}"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/PropertyBoolean",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "FilterField::PropertyBoolean",
									"dataType": "Edm.Boolean",
									"display": "Value",
									"fieldHelp": undefined,
									"editMode":
										"{= ${_valueList>Parameters} ? FIELD.getFieldEditModeInValueHelp(${_valueList>}, ${property>@@FIELD.propertyName}) : undefined}",
									"delegate": "{name: 'sap/ui/mdc/odata/v4/FieldBaseDelegate'}"
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
