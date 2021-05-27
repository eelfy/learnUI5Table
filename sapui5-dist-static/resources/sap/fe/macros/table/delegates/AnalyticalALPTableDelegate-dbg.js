/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	["sap/fe/macros/table/delegates/AnalyticalTableDelegate", "sap/fe/macros/table/ALPTableDelegateBaseMixin"],
	function(AnalyticalTableDelegate, ALPTableDelegateBaseMixin) {
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
		 * @alias sap.fe.macros.AnalyticalALPTableDelegate
		 */
		var AnalyticalALPTableDelegate = Object.assign({}, AnalyticalTableDelegate, ALPTableDelegateBaseMixin, {
			_getDelegateParentClass: function() {
				return AnalyticalTableDelegate;
			}
		});

		return AnalyticalALPTableDelegate;
	},
	/* bExport= */ false
);
