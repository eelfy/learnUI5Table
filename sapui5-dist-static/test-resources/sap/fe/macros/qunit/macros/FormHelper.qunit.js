/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/form/FormHelper", "sap/base/Log"], function(FormHelper, Log) {
	"use strict";
	// var sandbox = sinon.sandbox.create();

	QUnit.module("Unit Test for checkIfCollectionFacetNeedsToBeRendered");
	QUnit.test("Unit test to check checkIfCollectionFacetNeedsToBeRendered with partOfPreview", function(assert) {
		[
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'true' for some ReferenceFacet, and as 'false' for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "false",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false' for some ReferenceFacets, and as 'true' for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false' for one ReferenceFacet, and not available for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						}
					]
				},
				partOfPreview: "false",
				bExpectedValue: false,
				sMessage: "all ReferenceFacets without 'com.sap.vocabularies.UI.v1.PartOfPreview'"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: false,
				sMessage: "all ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false'"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: []
				},
				partOfPreview: "false",
				bExpectedValue: false,
				sMessage: "no ReferenceFacets"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: []
				},
				partOfPreview: "true",
				bExpectedValue: false,
				sMessage: "no ReferenceFacets"
			}
		].forEach(function(oProperty) {
			var actualValue = FormHelper.checkIfCollectionFacetNeedsToBeRendered(oProperty.collectionFacet, oProperty.partOfPreview);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check checkIfCollectionFacetNeedsToBeRendered with partOfPreview: " +
					oProperty.partOfPreview +
					" and collectionFacet with " +
					oProperty.sMessage +
					" : ok"
			);
		});
	});

	QUnit.module("Unit Test for generateBindingExpression");
	QUnit.test("Unit test to check binding expression generated with different combinations of navigation path and semantic keys", function(
		assert
	) {
		[
			{
				sNavigationPath: "_ShipToParty",
				aSemanticKeys: undefined,
				sExpectedValue: '{"path":"_ShipToParty"}',
				sMessage: "navigation path is there and semantic key is not defined"
			},
			{
				sNavigationPath: undefined,
				aSemanticKeys: [
					{
						$PropertyPath: "SalesOrder"
					}
				],
				sExpectedValue: '{"path":"","parameters":{"$select":"SalesOrder"}}',
				sMessage: "navigation path is not defined and semantic key is defined"
			},
			{
				sNavigationPath: undefined,
				aSemanticKeys: [
					{
						$PropertyPath: "materialdetail.owner_ID"
					},
					{
						$PropertyPath: "materialdetail.FabricationCountry"
					}
				],
				sExpectedValue: '{"path":"","parameters":{"$select":"materialdetail.owner_ID,materialdetail.FabricationCountry"}}',
				sMessage: "navigation path is not defined and more than one semantic key is defined"
			},
			{
				sNavigationPath: undefined,
				aSemanticKeys: undefined,
				sExpectedValue: "",
				sMessage: "both navigation path and semantic key are not defined"
			},
			{
				sNavigationPath: "_ShipToParty",
				aSemanticKeys: [
					{
						$PropertyPath: "ID"
					}
				],
				sExpectedValue: '{"path":"_ShipToParty","parameters":{"$select":"ID"}}',
				sMessage: "both navigation path and semantic key are defined"
			}
		].forEach(function(oProperty) {
			var actualValue = FormHelper.generateBindingExpression(oProperty.sNavigationPath, oProperty.aSemanticKeys);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check binding expression when " + oProperty.sMessage + " : ok"
			);
		});
	});
});
