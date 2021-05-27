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
					// Testing ...
					sFragmentName: "sap.fe.macros.form.FormElement",
					sDescription: "FormElementTemplating with _flexId",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							_flexId: "flexId1",
							vhIdPrefix: "vhIdPrefix1",
							onChange: "onChange1"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// dataField with ValueHelp
							mBindingContexts: {
								entitySet: "/someEntitySet",
								dataField: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/1"
							},
							oExpectedResultsPerTest: {
								FormElement: {
									// unittest:id
									id: "flexId1_FormElement",
									label: "PropertyUnit",
									visible: "true"
								},
								MacroDataField: {
									editMode: "{= %{ui>/isEditable} ? 'Editable' : 'Display'}",
									change: "FieldRuntime.handleChange($controller, $event)",
									fieldHelp: "flexId1-content_FieldValueHelp"
								}
							}
						},
						{
							// dataField with ValueHelp
							mBindingContexts: {
								entitySet: "/someEntitySet",
								dataField: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/9/"
							},
							oExpectedResultsPerTest: {
								MacroDataPointObjectStatus: {
									// unittest:id
									"text":
										"{path:'PropertyDecimal',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':4,'scale':1}}"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"FormElement Fragment with Simple Metadata",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
