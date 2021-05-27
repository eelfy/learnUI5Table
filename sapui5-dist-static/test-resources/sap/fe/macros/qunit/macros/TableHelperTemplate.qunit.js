/* global QUnit sap
 */
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
					sFragmentName: "sap.fe.macros.fragments.TableMacro",
					sDescription: "Actions validate",
					mModels: {
						"setup": new JSONModel({
							parentEntitySet: {},
							create: { mode: "NewPage" },
							id: "fe::table::SomeEntitySet::LineItem",
							actions: [
								{
									type: "Default",
									enabled: true,
									handlerMethod: "someHandlerMethod"
								}
							],
							showDelete: true
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"metaPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								"collection": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								// ToDo: Commenting to see whether all other tests run through voter.
								// "DataFieldForActionButton": {
								// 	"press":
								// 		//".editFlow.invokeAction('SomeAction', { contexts: ${internal>selectedContexts}, entitySetName: 'someEntitySet', invocationGrouping: 'Isolated', prefix: 'fe::table::SomeEntitySet::LineItem', operationAvailableMap: '{}', model: ${$source>/}.getModel(), label: 'BreakUp'})",
								// 		".editFlow.invokeAction('SomeAction', { contexts: ${internal>selectedContexts}, entitySetName: 'someEntitySet', invocationGrouping: 'Isolated', prefix: 'fe::table::SomeEntitySet::LineItem', operationAvailableMap: '{}', model: ${$source>/}.getModel(), label: 'BreakUp', applicableContext: ${internal>dynamicActions/SomeAction/aApplicable/}, notApplicableContext: ${internal>dynamicActions/SomeAction/aNotApplicable/}})",
								// 	"enabled": "true"
								// },
								// "DataFieldForIntentBasedNavigationButton": {
								// 	"press":
								// 		'.handlers.onDataFieldForIntentBasedNavigation($controller, \'v4Freestyle\', \'Inbound\', \'[{"LocalProperty":{"$PropertyPath":"Delivered"},"SemanticObjectProperty":"Completed"}]\', ${internal>selectedContexts})',
								// 	"enabled": "{= %{internal>numberOfSelectedContexts} >= 1}"
								// },
								"CreateButtonTemplate": {
									"press": "cmd:Create",
									"enabled": null
								},
								"DeleteButtonTemplate": {
									"press": "cmd:DeleteEntry",
									"enabled":
										"{= ((%{internal>deletableContexts} && %{internal>deletableContexts}.length > 0) || (%{internal>unSavedContexts} && %{internal>unSavedContexts}.length > 0)) ? %{internal>deleteEnabled} : false}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.table.Column",
					sDescription: "Columns validate",
					fileType: "fragment",
					mModels: {
						"column": new JSONModel({
							name: "DataFieldForAnnotation::FieldGroup::multipleActionFields",
							width: undefined
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"collection": "/someEntitySet",
								"entitySet": "/someEntitySet",
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/0",
								"column": "/"
							},
							oExpectedResultsPerTest: {
								"MDCTableColumn": {
									"header": "PropertyQuantity",
									"dataProperty": "DataFieldForAnnotation::FieldGroup::multipleActionFields",
									"width": "auto"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.fragments.TableMacro",
					sDescription: "Table row creation validate",
					mModels: {
						"setup": new JSONModel({
							onCreate: ".editFlow.createDocument",
							creationMode: "CreationRow",
							create: {
								mode: "CreationRow"
							}
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"metaPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								"collection": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"TableMacroCreationRow": {
									"applyEnabled": "{= true && ${ui>/editMode} === 'Editable'}",
									"apply":
										".editFlow.createDocument(${$source>}.getParent()._getRowBinding(), { creationMode: 'CreationRow', creationRow: ${$source>}, createAtEnd: false})"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.fragments.TableMacro",
					sDescription: "Table fragment validate",
					mModels: {
						"setup": new JSONModel({
							"onPatchSent": ".handlers.handlePatchSent",
							"onPatchCompleted": ".handlers.handlePatchCompleted",
							"onDataReceived": ".handlers.handleErrorOfTable",
							"patchCompleted": "patchCompleted",
							"id": "fe::table::SomeEntitySet::LineItem"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"metaPath": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								"collection": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"TableMacroFragment": {
									"delegate":
										"{name:'sap/fe/macros/table/delegates/TableDelegate', payload: {collectionName: 'someEntitySet', entitySet: '/someEntitySet'}}",
									"selectionChange": "TableRuntime.setContexts(${$source>/}, 'undefined', '[object Object]', '{}', '')",
									"rowsBindingInfo":
										"{ ui5object: true, suspended: false, path: '/someEntitySet', parameters: { $count: true, $select: 'PropertyQuantity,SemanticKeyWithSemanticObject,PropertyUnit', $$groupId: '$auto.Workers', $$updateGroupId: '$auto'}, events: { patchSent: '.handlers.handlePatchSent', patchCompleted: '.handlers.handlePatchCompleted', dataReceived: '.handlers.handleErrorOfTable'}}",
									"macrodata:requestGroupId": "$auto.Workers"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.table.ColumnProperty",
					sDescription: "Column property validate",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							navigationPropertyPath: "/someNavigationPropertyPath"
						}),
						"column": new JSONModel({
							name: "someNavigationPropertyPath"
						})
					},
					tests: [
						{
							mBindingContexts: {
								"collection": "/someEntitySet",
								"entitySet": "/someEntitySet",
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/0",
								"column": "/"
							},
							oExpectedResultsPerTest: {
								"MDCTableColumnProperty": {
									"header": "PropertyQuantity",
									"dataProperty": "someNavigationPropertyPath",
									"width": "auto"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Table Fragment with Simple Metadata.",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
