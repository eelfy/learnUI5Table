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
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "Semantic key shown as Label",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "LabelSemanticKey",
							formatOptions: {
								displayMode: "Value",
								semanticKeyStyle: "Label"
							}
						})
					},
					tests: [
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/0/Value",
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/0",
								"entitySet": "/someEntitySet",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldLabel": {
									"text":
										"{= (!%{IsActiveEntity} ? !%{HasActiveEntity} ? (${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === '' || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === undefined || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === null ? 'New Object': ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}) : (${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === '' || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === undefined || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === null ? '<Unnamed Object>': ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}) : (${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === '' || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === undefined || ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'} === null ? '<Unnamed Object>': ${mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}))}"
								}
							}
							//semantic as label
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "ObjectStatus icon binding",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "ObjectStatus",
							formatOptions: {
								displayMode: "Value"
							},
							text:
								"{path:'PropertyString',type:'sap.ui.model.odata.type.String',formatOptions:{'parseKeepsEmptyString':true}}"
						})
					},
					tests: [
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/7/Value",
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/7",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldObjectStatus": {
									"icon":
										"{= (${propertyIcon} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${propertyIcon} === '1') || (${propertyIcon} === 1) ? 'sap-icon://message-error' : (${propertyIcon} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${propertyIcon} === '2') || (${propertyIcon} === 2) ? 'sap-icon://message-warning' : (${propertyIcon} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${propertyIcon} === '3') || (${propertyIcon} === 3) ? 'sap-icon://message-success' : (${propertyIcon} === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || (${propertyIcon} === '5') || (${propertyIcon} === 5) ? 'sap-icon://message-information' : '' }",
									"text":
										"{path:'PropertyString',type:'sap.ui.model.odata.type.String',formatOptions:{'parseKeepsEmptyString':true}}"
								}
							}
							// object status icon binding
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataField property validate contentDisplay Label text",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "LabelSemanticKey",
							formatOptions: {
								semanticKeyStyle: "Label"
							}
						})
					},
					tests: [
						{
							mBindingContexts: {
								"property": "/someEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/0/Value",
								"dataField": "/someEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/0",
								"entitySet": "/someEntitySetNew",
								"entityType": "/someEntitySet/"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldLabel": {
									"text":
										"{mode:'TwoWay',parts:[{path:'PropertyQuantity',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':15,'scale':3}},{path:'PropertyUnit',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':3},formatOptions:{'parseKeepsEmptyString':true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}"
								}
							}
							// decimal with constraints
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataField property validate contentDisplay Label with Text annotation passed",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "LabelSemanticKey",
							formatOptions: {
								semanticKeyStyle: "Label"
							}
						})
					},
					tests: [
						{
							mBindingContexts: {
								"property": "/some2ndEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/8/Value",
								"dataField": "/some2ndEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/8/",
								"entitySet": "/some2ndEntitySetNew",
								"entityType": "/some2ndEntitySetNew/"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldLabel": {
									"text": "{ path : '_Unit/UnitOfMeasure_Text', parameters: {'$$noPatch': true}}"
								}
							}
							// semantic key label with a description annotation text
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataFieldForAnnotation on a DataPoint uses ValueFormat",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "DataPoint",
							formatOptions: {
								displayMode: "Value"
							}
						})
					},
					tests: [
						{
							mBindingContexts: {
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/9/",
								"entitySet": "/someEntitySet",
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#withValueFormat/Value"
							},
							oExpectedResultsPerTest: {
								"MacroDataPointObjectStatus": {
									"text":
										"{path:'PropertyDecimal',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':4,'scale':1}}"
								}
							}
							// datafield for annotation on a datapoint with value format
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataField action validate",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							idPrefix: "fe::table::SalesOrderManage::LineItem::DataFieldForAction::SomeAction",
							navigateAfterAction: "false",
							displayStyle: "Button"
						})
					},
					tests: [
						{
							mBindingContexts: {
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/5/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldActionButton": {
									"press":
										".editFlow.invokeAction('SomeAction', { contexts: ${$source>/}.getBindingContext(), invocationGrouping: 'Isolated', model: ${$source>/}.getModel(), label: 'BreakUp', isNavigable: false})",
									"enabled": "true",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataField for IBN validate",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							displayStyle: "Button"
						})
					},
					tests: [
						{
							mBindingContexts: {
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/6/"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldForIntentBasedNavigationButton": {
									"press":
										'._intentBasedNavigation.navigate(\'v4Freestyle\', \'Inbound\', { navigationContexts: ${$source>/}.getBindingContext(), semanticObjectMapping: \'[{"LocalProperty":{"$PropertyPath":"Delivered"},"SemanticObjectProperty":"Completed"}]\'})',
									"visible": "true"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataPoint validate",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							displayStyle: "DataPoint"
						})
					},
					tests: [
						{
							mBindingContexts: {
								"dataField": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount"
							},
							oExpectedResultsPerTest: {
								"MacroDataPointProgressIndicator": {
									"displayValue": "{PropertyInt16} of {PropertyInt32}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.field.DraftPopOverAdminData",
					sDescription: "DataPoint Draft popover validate",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel()
					},
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem/6",
								"IsActiveEntity": true
							},
							oExpectedResultsPerTest: {
								"MacroDraftPopOverAdminDataPopover": {
									"title":
										"{= !%{IsActiveEntity} ? ${i18n>M_COMMON_DRAFT_OBJECT} : (%{HasDraftEntity} ? (%{DraftAdministrativeData/InProcessByUser} ? ${i18n>M_COMMON_DRAFT_LOCKED_OBJECT} : ${i18n>M_DRAFT_POPOVER_ADMIN_UNSAVED_OBJECT}) : (${prop>bIndicatorType} ==='IconAndText' ? ' ' : ${sap.fe.i18n>C_DRAFT_POPOVER_ADMIN_DATA_DRAFTINFO_FLAGGED_OBJECT} ) ) }"
								},
								"MacroDraftPopOverAdminDataLastChangeDateTime": {
									"text":
										"{parts:[ {path: 'i18n>M_DRAFT_POPOVER_ADMIN_LAST_CHANGE_TEXT'}, {path: 'DraftAdministrativeData/LastChangeDateTime'}], formatter: 'formatMessage' }"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.internal.Field",
					sDescription: "DataField property validate semanticKey with semanticObject",
					fileType: "fragment",
					mModels: {
						"this": new JSONModel({
							editMode: "Display",
							wrap: true,
							displayStyle: "ObjectIdentifier",
							formatOptions: {
								semanticKeyStyle: "ObjectIdentifier"
							}
						})
					},
					tests: [
						{
							mBindingContexts: {
								"property": "/someEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/10/Value",
								"dataField": "/someEntitySetNew/@com.sap.vocabularies.UI.v1.LineItem/10/",
								"entitySet": "/someEntitySetNew",
								"entityType": "/someEntitySetNew/"
							},
							oExpectedResultsPerTest: {
								"MacroDataFieldObjectIdentifier": {
									"titleActive":
										"{parts:[{path:'pageInternal>semanticsTargets/someEntitySet/_someEntitySetNew_SemanticKeyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Macro Field Fragment with Simple Metadata.",
				simpleMetadata(),
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
