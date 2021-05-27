sap.ui.define([], function() {
	"use strict";
	return function() {
		return {
			"$Version": "4.0",
			"$Reference": {
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_UI',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["com.sap.vocabularies.UI.v1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMUNICATION',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["com.sap.vocabularies.Communication.v1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_COMMON',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["com.sap.vocabularies.Common.v1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_MEASURES',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["Org.OData.Measures.V1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CORE',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["Org.OData.Core.V1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_CAPABILITIES',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["Org.OData.Capabilities.V1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_AGGREGATION',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["Org.OData.Aggregation.V1."]
				},
				"/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName='%2FIWBEP%2FVOC_VALIDATION',Version='0001',SAP__Origin='LOCAL')/$value": {
					"$Include": ["Org.OData.Validation.V1."]
				}
			},
			//ODataMetaModel.js expects the annotations under the namespace and moves it a level higher
			"someNamespace": {
				"$kind": "Schema",
				"$Annotations": {
					"someNamespace.someEntityType": {
						"@com.sap.vocabularies.UI.v1.DataPoint#noTargetValue": {
							"Value": {
								"$Path": "PropertyInt16"
							},
							"Title": "Property Int 16"
						},
						"@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueDynamic": {
							"Value": {
								"$Path": "PropertyInt16"
							},
							"TargetValue": {
								"$Path": "PropertyInt32"
							},
							"Title": "Property Int 16"
						},
						"@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueStatic": {
							"Value": {
								"$Path": "PropertyInt16"
							},
							"TargetValue": 5,
							"Title": "Property Int 16"
						},
						"@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount": {
							"Value": {
								"$Path": "PropertyInt16"
							},
							"Title": "Feedback",
							"TargetValue": {
								"$Path": "PropertyInt32"
							},
							"Visualization": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
							}
						},
						"@com.sap.vocabularies.UI.v1.DataPoint#HelpfulTotal": {
							"Value": {
								"$Path": "PropertyInt16"
							},
							"Title": "Feedback",
							"TargetValue": {
								"$Path": "PropertyInt32"
							},
							"Visualization": {
								"$EnumMember": "com.sap.vocabularies.UI.v1.VisualizationType/Progress"
							}
						},
						"@com.sap.vocabularies.UI.v1.Facets": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.LineItem"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.Form": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.FieldGroup#test"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Net Amount",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#NetValue"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.HeaderFacets": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNav"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDVH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDM"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGIDL"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.Chart#ChartNavGID"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#Chart"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#ChartGIDVH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#ChartGIDH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#ChartGIDM"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#ChartGIDL"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#ChartGID"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNav"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDVH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDM"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGIDL"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.DataPoint#DPNavGID"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DP"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDVH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDM"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DPGIDL"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#DPGID"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavC"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDVH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDH"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDM"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGIDL"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_TitleCollection/@com.sap.vocabularies.UI.v1.Chart#ChartNavCGID"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.LineItem": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "PropertyInt16",
								"Value": {
									"$Path": "PropertyInt16"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "PropertyInt32",
								"Value": {
									"$Path": "PropertyInt32"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "PropertyString",
								"Value": {
									"$Path": "PropertyString"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.FieldGroup#test": {
							"Data": [
								{
									"$Type": "com.sap.vocabularies.UI.v1.DataField",
									"Value": {
										"$Path": "multipleLineField"
									},
									"@com.sap.vocabularies.UI.v1.Hidden": false
								},
								{
									"$Type": "com.sap.vocabularies.UI.v1.DataField",
									"Label": "PropertyInt32",
									"Value": {
										"$Path": "PropertyInt32"
									},
									"@com.sap.vocabularies.UI.v1.Hidden": true
								}
							]
						},
						"@com.sap.vocabularies.UI.v1.Identification": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
								"Determining": false,
								"Action": "hello()"
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
								"Determining": true,
								"Action": "hello()"
							}
						]
					},
					"someNamespace.deleteRestrictedEntityType": {
						"@com.sap.vocabularies.Common.v1.Label": "Delete Restricted Entity",
						"@com.sap.vocabularies.Common.v1.SemanticKey": [
							{
								"$PropertyPath": "key1"
							}
						],
						"@com.sap.vocabularies.UI.v1.Facets": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.LineItem"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Delete Restricted Entity",
							"TypeNamePlural": "Delete Restricted Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							}
						},
						"@com.sap.vocabularies.UI.v1.LineItem": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column1",
								"Value": {
									"$Path": "Column1"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column2",
								"Value": {
									"$Path": "Column2"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column3",
								"Value": {
									"$Path": "Column3"
								}
							}
						]
					},
					"someNamespace.noHeaderInfoEntityType": {
						"@com.sap.vocabularies.Common.v1.Label": "Delete Restricted Entity",
						"@com.sap.vocabularies.Common.v1.SemanticKey": [
							{
								"$PropertyPath": "key1"
							}
						]
					},
					"someNamespace.dataFieldForActionEntityType": {
						"@Org.OData.Capabilities.V1.DeleteRestrictions": {
							"Deletable": false
						},
						"@com.sap.vocabularies.Common.v1.Label": "Delete Restricted Entity",
						"@com.sap.vocabularies.Common.v1.SemanticKey": [
							{
								"$PropertyPath": "key1"
							}
						],
						"@com.sap.vocabularies.UI.v1.Facets": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.LineItem"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Delete Restricted Entity",
							"TypeNamePlural": "Delete Restricted Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							}
						},
						"@com.sap.vocabularies.UI.v1.LineItem": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column1",
								"Value": {
									"$Path": "Column1"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
								"Label": "column2",
								"Value": {
									"$Path": "Column2"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column3",
								"Value": {
									"$Path": "Column3"
								}
							}
						]
					},
					"someNamespace.dataFieldForIntentBasedNavigationType": {
						"@Org.OData.Capabilities.V1.DeleteRestrictions": {
							"Deletable": false
						},
						"@com.sap.vocabularies.Common.v1.Label": "Delete Restricted Entity",
						"@com.sap.vocabularies.Common.v1.SemanticKey": [
							{
								"$PropertyPath": "key1"
							}
						],
						"@com.sap.vocabularies.UI.v1.Facets": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.ReferenceFacet",
								"Label": "Titles",
								"Target": {
									"$AnnotationPath": "_Title/@com.sap.vocabularies.UI.v1.LineItem"
								}
							}
						],
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Delete Restricted Entity",
							"TypeNamePlural": "Delete Restricted Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							}
						},
						"@com.sap.vocabularies.UI.v1.LineItem": [
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column1",
								"Value": {
									"$Path": "Column1"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
								"Label": "column2",
								"Value": {
									"$Path": "Column2"
								}
							},
							{
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Label": "column3",
								"Value": {
									"$Path": "Column3"
								}
							}
						]
					},
					"someNamespace.headerInfoAvatarEntityType": {
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"ImageUrl": "sap-icon://customer-and-supplier"
						}
					},
					"someNamespace.headerInfoAvatarEntityType2": {
						"@com.sap.vocabularies.Common.v1.IsNaturalPerson": true,
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"ImageUrl": "sap-icon://xxxx",
							"TypeImageUrl": "sap-icon://add-contact"
						}
					},
					"someNamespace.headerInfoAvatarEntityType3": {
						"@com.sap.vocabularies.Common.v1.IsNaturalPerson": true,
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"ImageUrl": "sap-icon://xxxx"
						}
					},
					"someNamespace.headerInfoAvatarEntityType4": {
						"@com.sap.vocabularies.Common.v1.IsNaturalPerson": false,
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"TypeImageUrl": "sap-icon://add-contact"
						}
					},
					"someNamespace.headerInfoAvatarEntityType5": {
						"@com.sap.vocabularies.Common.v1.IsNaturalPerson": true,
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"TypeImageUrl": "sap-iconXXXX://add-contact",
							"Initials": "SG"
						}
					},
					"someNamespace.headerInfoAvatarEntityType6": {
						"@com.sap.vocabularies.Common.v1.IsNaturalPerson": true,
						"@com.sap.vocabularies.UI.v1.HeaderInfo": {
							"TypeName": "Header Info Entity",
							"TypeNamePlural": "Header Info Entities",
							"Title": {
								"$Type": "com.sap.vocabularies.UI.v1.DataField",
								"Value": {
									"$Path": "Name"
								}
							},
							"Initials": "SG"
						}
					},
					"someNamespace.someEntityType/PropertyInt16": {
						"@com.sap.vocabularies.Common.v1.Label": "Property of Type Int16"
					},
					"someNamespace.someEntityType/multipleLineField": {
						"@com.sap.vocabularies.Common.v1.Label": "Multiple Line properties",
						"@com.sap.vocabularies.UI.v1.MultiLineText": true
					},
					"someNamespace.Container/deleteRestrictedEntitySet": {
						"@Org.OData.Capabilities.V1.DeleteRestrictions": {
							"Deletable": false
						}
					},
					"someNamespace.Container/deleteNotRestrictedEntitySet": {
						"@Org.OData.Capabilities.V1.DeleteRestrictions": {
							"Deletable": true
						}
					},
					"someNamespace.Container/draftNodeEntitySet": {
						"@com.sap.vocabularies.Common.v1.DraftRoot": {}
					},
					"someNamespace.Container/draftRootEntitySet": {
						"@com.sap.vocabularies.Common.v1.DraftRoot": {}
					},
					"someNamespace.someCollectionBoundAction1(Collection(someNamespace.someEntityType))/someParameter1": {
						"@com.sap.vocabularies.Common.v1.FieldControl": {
							"$EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Mandatory"
						},
						"@com.sap.vocabularies.Common.v1.Label": "some label 1",
						"@com.sap.vocabularies.Common.v1.ValueListMapping": {
							"Label": "some label",
							"CollectionPath": "someEntitySet",
							"Parameters": [
								{
									"$Type": "com.sap.vocabularies.Common.v1.ValueListParameterInOut",
									"LocalDataProperty": { "$PropertyPath": "SalesOrderType" },
									"ValueListProperty": "SalesOrderType"
								},
								{
									"$Type": "com.sap.vocabularies.Common.v1.ValueListDisplayOnly",
									"ValueListProperty": "SalesOrderType"
								}
							]
						}
					},
					"someNamespace.someCollectionBoundAction2(someNamespace.someEntityType)/someParameter2": {
						"@com.sap.vocabularies.Common.v1.Label": "some label 2",
						"@com.sap.vocabularies.Common.v1.ValueListReferences": ["../valuehelpMetadata"],
						"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {}
					},
					"someNamespace.someUnboundAction1/someParameter": {
						"@com.sap.vocabularies.Common.v1.ValueListReferences": ["../valuehelpMetadata"],
						"@com.sap.vocabularies.Common.v1.Label": "some label",
						"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {}
					}
				}
			},
			"someNamespace.someEntityType": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				},
				"PropertyInt16": {
					"$kind": "Property",
					"$Type": "Edm.Int16",
					"$Nullable": false
				},
				"multipleLineField": {
					"$kind": "Property",
					"$Type": "Edm.Int16",
					"$Nullable": false
				},
				"PropertyString": {
					"$kind": "Property",
					"$Type": "Edm.String"
				},
				"PropertyBoolean": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"PropertyByte": {
					"$kind": "Property",
					"$Type": "Edm.Byte"
				},
				"PropertySByte": {
					"$kind": "Property",
					"$Type": "Edm.SByte"
				},
				"PropertyInt32": {
					"$kind": "Property",
					"$Type": "Edm.Int32"
				},
				"PropertyInt64": {
					"$kind": "Property",
					"$Type": "Edm.Int64"
				},
				"PropertySingle": {
					"$kind": "Property",
					"$Type": "Edm.Single"
				},
				"PropertyDouble": {
					"$kind": "Property",
					"$Type": "Edm.Double"
				},
				"PropertyDecimal": {
					"$kind": "Property",
					"$Type": "Edm.Decimal"
				},
				"PropertyBinary": {
					"$kind": "Property",
					"$Type": "Edm.Binary"
				},
				"PropertyDate": {
					"$kind": "Property",
					"$Type": "Edm.Date"
				},
				"PropertyDateTimeOffset": {
					"$kind": "Property",
					"$Type": "Edm.DateTimeOffset"
				},
				"PropertyDuration": {
					"$kind": "Property",
					"$Type": "Edm.Duration"
				},
				"PropertyGuid": {
					"$kind": "Property",
					"$Type": "Edm.Guid"
				},
				"PropertyTimeOfDay": {
					"$kind": "Property",
					"$Type": "Edm.TimeOfDay"
				},
				"PropertyStream": {
					"$kind": "Property",
					"$Type": "Edm.Stream",
					"$Nullable": false
				},
				"_Title": {
					"$kind": "NavigationProperty",
					"$Type": "someNamespace.some2ndEntityType",
					"$isCollection": false
				},
				"_TitleCollection": {
					"$kind": "NavigationProperty",
					"$Type": "someNamespace.some2ndEntityType",
					"$isCollection": true
				}
			},
			"someNamespace.noHeaderInfoEntityType": {
				"$kind": "EntityType",
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				}
			},
			"someNamespace.deleteRestrictedEntityType": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				},
				"Column1": {
					"$kind": "Property",
					"$Type": "Edm.Int16",
					"$Nullable": false
				},
				"Column2": {
					"$kind": "Property",
					"$Type": "Edm.String"
				},
				"Column3": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				}
			},
			"someNamespace.headerInfoAvatarEntityType": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.headerInfoAvatarEntityType2": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.headerInfoAvatarEntityType3": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.headerInfoAvatarEntityType4": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.headerInfoAvatarEntityType5": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.headerInfoAvatarEntityType6": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				}
			},
			"someNamespace.dataFieldForActionEntityType": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				},
				"Column1": {
					"$kind": "Property",
					"$Type": "Edm.Int16",
					"$Nullable": false
				},
				"Column2": {
					"$kind": "Property",
					"$Type": "Edm.String"
				},
				"Column3": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				}
			},
			"someNamespace.dataFieldForIntentBasedNavigationType": {
				"$kind": "EntityType",
				"$Key": ["key1", "IsActiveEntity"],
				"key1": {
					"$kind": "Property",
					"$Type": "Edm.Guid",
					"$Nullable": false
				},
				"HasActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				},
				"IsActiveEntity": {
					"$kind": "Property",
					"$Type": "Edm.Boolean",
					"$Nullable": false
				},
				"Column1": {
					"$kind": "Property",
					"$Type": "Edm.Int16",
					"$Nullable": false
				},
				"Column2": {
					"$kind": "Property",
					"$Type": "Edm.String"
				},
				"Column3": {
					"$kind": "Property",
					"$Type": "Edm.Boolean"
				}
			},
			"someNamespace.someCollectionBoundAction1": [
				{
					"$kind": "Action",
					"$EntitySetPath": "_bindingParameter",
					"ReturnType": {
						"$Nullable": false,
						"$Type": "someNamespace.someEntityType"
					},
					"$IsBound": true,
					"$Parameter": [
						{
							"$Name": "_bindingParameter",
							"$Nullable": false,
							"$Type": "someNamespace.someEntityType",
							"$isCollection": true
						},
						{
							"$Name": "someParameter1",
							"$Nullable": false,
							"$Type": "Edm.String",
							"$MaxLength": 4
						}
					]
				}
			],
			"someNamespace.someCollectionBoundAction2": [
				{
					"$kind": "Action",
					"$EntitySetPath": "_bindingParameter",
					"ReturnType": {
						"$Nullable": false,
						"$Type": "someNamespace.someEntityType"
					},
					"$IsBound": true,
					"$Parameter": [
						{
							"$Name": "_bindingParameter",
							"$Nullable": false,
							"$Type": "someNamespace.someEntityType"
						},
						{
							"$Name": "someParameter2",
							"$Nullable": true,
							"$Type": "Edm.String",
							"$MaxLength": 4
						}
					]
				}
			],
			"someNamespace.someCollectionBoundAction3": [
				{
					"$kind": "Action",
					"$EntitySetPath": "_bindingParameter",
					"ReturnType": {
						"$Nullable": false,
						"$Type": "someNamespace.someEntityType"
					},
					"$IsBound": true,
					"$Parameter": [
						{
							"$Name": "_bindingParameter",
							"$Nullable": false,
							"$Type": "someNamespace.someEntityType"
						}
					]
				}
			],
			"someNamespace.someUnboundAction1": [
				{
					"$kind": "Action",
					"ReturnType": {
						"$Nullable": false,
						"$Type": "someNamespace.someEntityType"
					},
					"$Parameter": [
						{
							"$Name": "someParameter",
							"$Nullable": true,
							"$Type": "Edm.String",
							"$MaxLength": 4
						}
					]
				}
			],
			"someNamespace.Container": {
				"$kind": "EntityContainer",
				"someEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.someEntityType"
				},
				"someEntitySetForViewData1": {
					"controlConfiguration": {
						"@com.sap.vocabularies.UI.v1.DataPoint#NetValue": {
							"navigation": {
								"targetOutbound": { "outbound": "FreestyleNav" }
							}
						}
					}
				},
				"manifestData1": {
					"sap.app": {
						"crossNavigation": {
							"outbounds": "FreestyleNav"
						}
					}
				},
				"someEntitySetForViewData2": {
					"controlConfiguration": {
						"@com.sap.vocabularies.UI.v1.DataPoint#NetValue": {
							"navigation": {
								"targetSections": { "subsection": "subsection_New111" }
							}
						}
					}
				},
				"deleteRestrictedEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.deleteRestrictedEntityType"
				},
				"deleteNotRestrictedEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.deleteRestrictedEntityType"
				},
				"dataFieldForActionEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.dataFieldForActionEntityType"
				},
				"dataFieldForIntentBasedNavigationSet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.dataFieldForIntentBasedNavigationType"
				},
				"headerInfoAvatarEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType"
				},
				"headerInfoAvatarEntitySet2": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType2"
				},
				"headerInfoAvatarEntitySet3": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType3"
				},
				"headerInfoAvatarEntitySet4": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType4"
				},
				"headerInfoAvatarEntitySet5": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType5"
				},
				"headerInfoAvatarEntitySet6": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.headerInfoAvatarEntityType6"
				},
				"someUnboundAction1": {
					"$kind": "ActionImport",
					"$Action": "someNamespace.someUnboundAction1"
				},
				"draftNodeEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.someEntityType"
				},
				"draftRootEntitySet": {
					"$kind": "EntitySet",
					"$Type": "someNamespace.someEntityType"
				}
			},
			"$EntityContainer": "someNamespace.Container"
		};
	};
});
