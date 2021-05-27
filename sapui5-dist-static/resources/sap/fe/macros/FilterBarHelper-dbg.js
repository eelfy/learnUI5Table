/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * Filter Bar helper
 */
sap.ui.define(
	["sap/fe/macros/CommonHelper"],
	function(CommonHelper) {
		"use strict";

		var FilterBarHelper = {
			/*
			 * Method to check if the Basic Serch Field in FilterBar is visible.
			 * @function
			 * @name checkIfBasicSearchIsVisible
			 * @memberof sap.fe.macros.FilterBarHelper.js
			 * @param {boolean} - hideBasicSearch: visibility of Basic Search Field
			 * @param {String} - searchRestrictions to be checked
			 * @return : {boolean} True, if property hideBasisSearch is not equal "true" and
			 * 					   either there are no SearchRestrictions or property SearchRestrictions.Searchable is equal true.
			 */
			checkIfBasicSearchIsVisible: function(hideBasicSearch, searchRestrictionAnnotation) {
				return hideBasicSearch !== "true" && (!searchRestrictionAnnotation || searchRestrictionAnnotation.Searchable)
					? true
					: false;
			},

			getTargetEntityContext: function(oContext, sPath) {
				var sFullPath = sPath || oContext.getPath(),
					sCurrentEntitySet = sFullPath.substring(0, sFullPath.indexOf("/", 1)),
					sNavigationPath = CommonHelper.getNavigationPath(sFullPath),
					sBindingPath = sCurrentEntitySet;

				if (sNavigationPath) {
					sBindingPath =
						sCurrentEntitySet +
						"/$NavigationPropertyBinding/" +
						sNavigationPath.split("/").join("/$NavigationPropertyBinding/") +
						"/$";
				}

				return oContext.getModel().createBindingContext(sBindingPath);
			}
		};

		return FilterBarHelper;
	},
	/* bExport= */ true
);
