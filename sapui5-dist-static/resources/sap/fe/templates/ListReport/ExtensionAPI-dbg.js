/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/templates/ExtensionAPI", "sap/fe/macros/filter/FilterUtils"], function(ExtensionAPI, FilterUtils) {
	"use strict";

	/**
	 * @class Extension API for list reports on SAP Fiori elements for OData V4.
	 * @alias sap.fe.templates.ListReport.ExtensionAPI
	 * @extends sap.fe.templates.ExtensionAPI
	 * @public
	 * @hideconstructor
	 * @final
	 * @since 1.79.0
	 */
	var extensionAPI = ExtensionAPI.extend("sap.fe.templates.ListReport.ExtensionAPI", {
		/**
		 * @private
		 * @name sap.fe.templates.ListReport.ExtensionAPI.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.templates.ListReport.ExtensionAPI.extend
		 * @function
		 */

		/**
		 * Refreshes the List Report.
		 * This method currently only supports triggering the search (by clicking on the GO button)
		 * in the List Report Filter Bar. It can be used to request the initial load or to refresh the
		 * currently shown data based on the filters entered by the user.
		 * Please note: The Promise is resolved once the search is triggered and not once the data is returned.
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#refresh
		 * @returns {Promise} Resolved once the data is refreshed or rejected if the request failed
		 *
		 * @public
		 */
		refresh: function() {
			var oFilterBar = this._controller._getFilterBarControl();
			return oFilterBar.waitForInitialization().then(function() {
				oFilterBar.triggerSearch();
			});
		},

		/**
		 * Set the filter values for the given property in the filterbar.
		 * The filter values can be either a single value or an array of values.
		 * Each filter value must be represented as a string corresponding to the given operator.
		 *
		 * @param {string} sConditionPath the path to the property as condition path
		 * @param {string} [sOperator] the operator to be used (optional) - if not set, the default operator (EQ) will be used
		 * @param {Array | string} vValues the values to be applied
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#setFilterValues
		 * @returns {Promise} a promise for async handling
		 * @public
		 */
		setFilterValues: function(sConditionPath, sOperator, vValues) {
			return FilterUtils.setFilterValues(this._controller._getFilterBarControl(), sConditionPath, sOperator, vValues);
		}
	});

	return extensionAPI;
});
