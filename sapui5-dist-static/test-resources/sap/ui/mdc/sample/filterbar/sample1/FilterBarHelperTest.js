/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/odata/v4/FilterBarDelegate"
], function(FilterBarDelegate) {
	"use strict";

	var ODataFilterBarTestHelper = Object.assign({}, FilterBarDelegate);

	ODataFilterBarTestHelper.fetchProperties = function(oFilterBar) {
		return new Promise(function(fResolve) {
			FilterBarDelegate.fetchProperties(oFilterBar).then(function(aProperties) {

				aProperties.forEach(function(oProperty) {
					if (oProperty.maxConditions === -1) {
						oProperty.fieldHelp = "FVH_Multi";
					}
				});

				aProperties.some(function(oProperty) {
					if (oProperty.path === "to_Supplier/SupplierID") {
						oProperty.name = "nav_SupplierID";
						return true;
					}
					return false;
				});

				aProperties.some(function(oProperty) {
					if (oProperty.name === "SupplierID") {
						oProperty.fieldHelp = "FVH01";
						return true;
					}
					return false;
				});

				aProperties.some(function(oProperty) {
					if (oProperty.name === "ProductID") {
						oProperty.fieldHelp = "FVH02";
						return true;
					}
					return false;
				});

				var oBasicSearchProperty = null;
				aProperties.some(function(oProperty) {
					if (oProperty.name === "$search") {
						oBasicSearchProperty = oProperty;
						return true;
					}
					return false;
				});				
				
				if (!oBasicSearchProperty) {
					oBasicSearchProperty = {
						name: "$search",
						maxConditions: 1,
						visible: true
					};
					oBasicSearchProperty.typeConfig = FilterBarDelegate.getTypeUtil().getTypeConfig("sap.ui.model.odata.type.String");
					aProperties.push(oBasicSearchProperty);
				}

				fResolve(aProperties);
			});
		});
	};
	return ODataFilterBarTestHelper;
});
