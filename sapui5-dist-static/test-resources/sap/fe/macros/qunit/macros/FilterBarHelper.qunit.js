/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/FilterBarHelper"], function(FilterBarHelper) {
	"use strict";

	QUnit.module("Unit Test for check if BasicSearch Field is visible in the FilterBar");
	QUnit.test("Unit test to check hideBasicSearch with SearchRestriction properties", function(assert) {
		[
			{
				oCollectionAnnotations: {
					"@Org.OData.Capabilities.V1.SearchRestrictions": { "Searchable": true }
				},
				hideBasicSearch: "false",
				bExpectedValue: true,
				sMessage: "visible with hideBasicSearch as 'false' and Org.OData.Capabilities.V1.SearchRestrictions/Searchable as 'true'"
			},
			{
				oCollectionAnnotations: {
					"@Org.OData.Capabilities.V1.SearchRestrictions": { "Searchable": true }
				},
				hideBasicSearch: "true",
				bExpectedValue: false,
				sMessage: "not visible with hideBasicSearch as 'true' and Org.OData.Capabilities.V1.SearchRestrictions/Searchable as 'true'"
			},
			{
				oCollectionAnnotations: {
					"@Org.OData.Capabilities.V1.SearchRestrictions": { "Searchable": false }
				},
				hideBasicSearch: "false",
				bExpectedValue: false,
				sMessage:
					"not visible with hideBasicSearch as 'false' and Org.OData.Capabilities.V1.SearchRestrictions/Searchable as 'false'"
			},
			{
				oCollectionAnnotations: {
					"@Org.OData.Capabilities.V1.SearchRestrictions": { "Searchable": false }
				},
				hideBasicSearch: "true",
				bExpectedValue: false,
				sMessage:
					"not visible with hideBasicSearch as 'true' and Org.OData.Capabilities.V1.SearchRestrictions/Searchable as 'false'"
			},
			{
				oCollectionAnnotations: {},
				hideBasicSearch: "false",
				bExpectedValue: true,
				sMessage: "not visible with hideBasicSearch as 'false' and no Org.OData.Capabilities.V1.SearchRestrictions"
			}
		].forEach(function(oProperty) {
			var actualValue = FilterBarHelper.checkIfBasicSearchIsVisible(
				oProperty.hideBasicSearch,
				oProperty.oCollectionAnnotations["@Org.OData.Capabilities.V1.SearchRestrictions"]
			);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check if Basic Search Field is " + oProperty.sMessage + " : ok"
			);
		});
	});

	QUnit.test("Unit test to check getTargetEntityContext", function(assert) {
		var oContext = {
			getModel: function() {
				return {
					createBindingContext: function(sBindingPath) {
						return sBindingPath;
					}
				};
			}
		};
		[
			{
				path: "/MyEntityType/myProperty",
				expectedValue: "/MyEntityType"
			},
			{
				path: "/MyEntityType/myNavigationProperty/myProperty",
				expectedValue: "/MyEntityType/$NavigationPropertyBinding/myNavigationProperty/$"
			},
			{
				path: "/MyEntityType/myNavigationProperty/mySecondNavigationProperty/myLastNavigationProperty/myProperty",
				expectedValue:
					"/MyEntityType/$NavigationPropertyBinding/myNavigationProperty/$NavigationPropertyBinding/mySecondNavigationProperty/$NavigationPropertyBinding/myLastNavigationProperty/$"
			}
		].forEach(function(oProperty) {
			var actualValue = FilterBarHelper.getTargetEntityContext(oContext, oProperty.path);
			assert.equal(
				actualValue,
				oProperty.expectedValue,
				"getTargetEntityContext('" + oProperty.path + "') should return '" + oProperty.expectedValue + "'"
			);
		});
	});
});
