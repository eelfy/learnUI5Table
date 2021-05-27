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
					sFragmentName: "sap.fe.macros.Chart",
					sDescription: "Chart validate",
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"collection": "/someEntitySet",
								"presentation": "/someEntitySet/@com.sap.vocabularies.UI.v1.Chart"
							},
							mModels: {
								"sap.ui.mdc.i18n": oResourceModel,
								//For macro fragments we need to simulate the this model
								"this": new JSONModel({
									id: "someEntitySet::someEntitySetList--fe::Chart::someEntitySet::Chart",
									onCallAction: ".editFlow.invokeAction"
								})
							},
							oExpectedResultsPerTest: {
								"ChartMacroFragment": {
									"id": "someEntitySet::someEntitySetList--fe::Chart::someEntitySet::Chart",
									"data": "{path: '/someEntitySet', parameters:{$$groupId:'$auto.Workers'}}",
									"chartType": "column",
									"delegate": "{name:'sap/fe/macros/ChartDelegate', payload: {collectionName: 'someEntitySet'}}",
									"selectionDetailsActionPressed": "HELPER.onSelectionDetailsActionPressed",
									"customData:targetCollectionName": null,
									"customData:operationAvailableMap": null,
									"customData:multiSelectDisabledActions": null
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Chart Fragment with Simple Metadata.",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
