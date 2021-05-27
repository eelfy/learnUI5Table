/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/odata/v4/TableDelegate",
		"sap/fe/macros/table/TableDelegateBaseMixin",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/DelegateUtil"
	],
	function(BaseTableDelegate, TableDelegateBaseMixin, CommonHelper, DelegateUtil) {
		"use strict";

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.TableDelegate
		 */
		var AnalyticalTableDelegate = Object.assign({}, BaseTableDelegate, TableDelegateBaseMixin, {
			_getDelegateParentClass: function() {
				return BaseTableDelegate;
			},

			/**
			 * Fetches the property extensions.
			 * TODO: document structure of the extension.
			 *
			 * @param {sap.ui.mdc.Table} oTable Instance of the MDC table
			 * @returns {Promise<object<string, object>>} Key-value map, where the key is the name of the property, and the value is the extension
			 * @protected
			 */
			fetchPropertyExtensions: function(oTable) {
				var mCustomAggregates = CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates"));

				return Promise.resolve(mCustomAggregates || {});
			}
		});

		return AnalyticalTableDelegate;
	},
	/* bExport= */ false
);
