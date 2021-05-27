// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the chart/item and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	["sap/fe/macros/ChartDelegate", "sap/fe/macros/CommonHelper", "sap/ui/fl/Utils", "sap/fe/navigation/library"],
	function(BaseChartDelegate, CommonHelper, flUtils, navLibrary) {
		"use strict";
		//	var NavType = navLibrary.NavType;
		var ChartDelegate = Object.assign({}, BaseChartDelegate);
		/**
		 * @param oMDCChart mdc chart control
		 * @param oBindingInfo binding info of chart
		 * data in chart and table must be synchronised. every
		 * time the chart refreshes, the table must be refreshed too.
		 */
		ChartDelegate.rebindChart = function(oMDCChart, oBindingInfo) {
			//	var oComponent = flUtils.getAppComponentForControl(oMDCChart);
			//	var bIsSearchTriggered = oComponent.getAppStateHandler().getIsSearchTriggered();
			// workaround in place to prevent chart from loading when go button is present and initial load is false
			//	if (bIsSearchTriggered) {
			var oInternalModelContext = oMDCChart.getBindingContext("pageInternal");
			var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
			if (!sTemplateContentView || sTemplateContentView !== "Table") {
				BaseChartDelegate.rebindChart(oMDCChart, oBindingInfo);
			}
		};

		return ChartDelegate;
	},
	/* bExport= */ false
);
