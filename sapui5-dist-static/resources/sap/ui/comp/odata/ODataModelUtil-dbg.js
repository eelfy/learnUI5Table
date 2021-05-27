/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

// -------------------------------------------------------------------------------
// Helper class used for generic ODataModel related handling
// -------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel"
], function(ODataModelV2) {
	"use strict";

	/**
	 * Object used to for generic ODataModel related handling
	 *
	 * @private
	 * @experimental This module is only for internal/experimental use!
	 */
	var ODataModelUtil = {
		/**
		 * Static function that takes care of ODataModel initialisation (all parameters are mandatory)
		 *
		 * @param {Object} oSmartControl - the Smart control (e.g. SmartTable, SmartFilter)
		 * @param {function} fModelInitCallback - the callback function (will be triggered in the SmartControl scope)
		 * @param {boolean} bWaitForFlexChanges - defines whether an await for flex changes is to be done
		 * @private
		 */
		handleModelInit: function(oSmartControl, fModelInitCallback, bWaitForFlexChanges) {
			var bLoadMetadataAsync = false, oModel;
			if (oSmartControl && !oSmartControl._bMetaModelLoadAttached && fModelInitCallback) {
				oModel = oSmartControl.getModel();
				if (oModel) {
					// Check if ODataMetaModel was loaded
					// If not, delay the creation of table content/helpers until ODataMetaModel is loaded!
					// Do this only for async ODataModel
					if (oModel.getMetadata() && oModel instanceof ODataModelV2) {
						bLoadMetadataAsync = true; // always true for v2.ODataModel
					} else if (oModel.bLoadMetadataAsync || (oModel.getServiceMetadata && !oModel.getServiceMetadata())) {
						bLoadMetadataAsync = true; // assume async if bLoadMetadataAsync or if no service metadata has been loaded for the ODataModel
					}
					oSmartControl._bMetaModelLoadAttached = true;
					if (bLoadMetadataAsync && oModel.getMetaModel() && oModel.getMetaModel().loaded) {
						if (!bWaitForFlexChanges) {
							// wait for the ODataMetaModel loaded promise to be resolved
							oModel.getMetaModel().loaded().then(fModelInitCallback.bind(oSmartControl));
						} else {
							this._getFlexRuntimeInfoAPI().then(function(FlexRuntimeInfoAPI) {
								var pFlexChanges;
								if (!FlexRuntimeInfoAPI.isFlexSupported({element: oSmartControl})) {
									pFlexChanges = Promise.resolve();
								} else {
									pFlexChanges = FlexRuntimeInfoAPI.waitForChanges({element: oSmartControl});
								}
								Promise.all([oModel.getMetaModel().loaded(), pFlexChanges]).then(fModelInitCallback.bind(oSmartControl));
							});
						}
					} else {
						// Could be a non ODataModel or a synchronous ODataModel --> just create the necessary helpers
						fModelInitCallback.apply(oSmartControl);
					}
				}
			}
		},

		_getFlexRuntimeInfoAPI: function() {
			return sap.ui.getCore().loadLibrary('sap.ui.fl', {
				async: true
			}).then(function() {
				return new Promise(function(fResolve) {
					sap.ui.require([
						"sap/ui/fl/apply/api/FlexRuntimeInfoAPI"
					], function(FlexRuntimeInfoAPI) {
						fResolve(FlexRuntimeInfoAPI);
					});
				});
			});
		}
	};

	return ODataModelUtil;

}, /* bExport= */true);
