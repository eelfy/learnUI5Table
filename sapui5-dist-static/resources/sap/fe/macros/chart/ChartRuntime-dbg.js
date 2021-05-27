/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/model/json/JSONModel", "sap/fe/macros/CommonHelper", "sap/fe/macros/chart/ChartUtils", "sap/fe/macros/DelegateUtil"],
	function(JSONModel, CommonHelper, ChartUtils, DelegateUtil) {
		"use strict";
		/**
		 * Static class used by MDC Chart during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var ChartRuntime = {
			/**
			 * Updates the chart after selection or deselection of datapoints.
			 *
			 * @function
			 * @static
			 * @name sap.fe.macros.chart.ChartRuntime.fnUpdateChart
			 * @memberof sap.fe.macros.chart.ChartRuntime
			 * @param {object} oEvent Event triggered after selection or deselection of datapoints on chart
			 * @ui5-restricted
			 **/
			fnUpdateChart: function(oEvent) {
				var oMdcChart = oEvent.getSource(),
					oInnerChart = oMdcChart.getAggregation("_chart"),
					oActionOperationAvailableMap = {},
					sActionsMultiselectDisabled,
					aActionsMultiselectDisabled = [];
				// changing drill stack changes order of custom data, looping through all
				oMdcChart.getCustomData().forEach(function(oCustomData) {
					if (oCustomData.getKey() === "operationAvailableMap") {
						oActionOperationAvailableMap = JSON.parse(
							DelegateUtil.getCustomData(oMdcChart, "operationAvailableMap") &&
								DelegateUtil.getCustomData(oMdcChart, "operationAvailableMap").customData
						);
					} else if (oCustomData.getKey() === "multiSelectDisabledActions") {
						sActionsMultiselectDisabled = oCustomData.getValue();
						aActionsMultiselectDisabled = sActionsMultiselectDisabled ? sActionsMultiselectDisabled.split(",") : [];
					}
				});
				var oInternalModelContext = oMdcChart.getBindingContext("internal");

				var aSelectedContexts = [];
				var oModelObject;
				var aSelectedDataPoints = ChartUtils.getChartSelectedData(oInnerChart);
				for (var i = 0; i < aSelectedDataPoints.length; i++) {
					aSelectedContexts.push(aSelectedDataPoints[i].context);
				}
				oInternalModelContext.setProperty("selectedContexts", aSelectedContexts);
				oInternalModelContext
					.getModel()
					.setProperty(oInternalModelContext.getPath() + "/numberOfSelectedContexts", oInnerChart.getSelectedDataPoints().count);
				for (var j = 0; j < aSelectedContexts.length; j++) {
					var oSelectedContext = aSelectedContexts[j];
					var oContextData = oSelectedContext.getObject();
					for (var key in oContextData) {
						if (key.indexOf("#") === 0) {
							var sActionPath = key;
							sActionPath = sActionPath.substring(1, sActionPath.length);
							oModelObject = oInternalModelContext.getObject();
							oModelObject[sActionPath] = true;
							oInternalModelContext.setProperty("", oModelObject);
						}
					}
					oModelObject = oInternalModelContext.getObject();
				}

				// TODO: use one in common utils
				this.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts);

				if (aSelectedContexts.length > 1) {
					aActionsMultiselectDisabled.forEach(function(sAction) {
						oInternalModelContext.setProperty(sAction, false);
					});
				}
			},

			// TODO: merge with one in common utils
			/**
			 * Sets the action enablement.
			 *
			 * @function
			 * @static
			 * @name sap.fe.macros.chart.ChartRuntime.setActionEnablement
			 * @memberof sap.fe.macros.chart.ChartRuntime
			 * @param {object} oInternalModelContext Object containing the context model
			 * @param {object} oActionOperationAvailableMap Map containing the operation availability of actions
			 * @param {Array} aSelectedContexts Array containing selected contexts of the chart
			 * @ui5-restricted
			 **/
			setActionEnablement: function(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts) {
				for (var sAction in oActionOperationAvailableMap) {
					oInternalModelContext.setProperty(sAction, false);
					var sProperty = oActionOperationAvailableMap[sAction];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						var oContextData = oSelectedContext.getObject();
						if (sProperty === null && !!oContextData["#" + sAction]) {
							//look for action advertisement if present and its value is not null
							oInternalModelContext.setProperty(sAction, true);
							break;
						} else if (!!oSelectedContext.getObject(sProperty)) {
							oInternalModelContext.setProperty(sAction, true);
							break;
						}
					}
				}
			}
		};
		return ChartRuntime;
	},
	/* bExport= */
	true
);
