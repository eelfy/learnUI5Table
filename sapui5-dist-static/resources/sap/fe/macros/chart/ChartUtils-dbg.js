/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	["sap/ui/model/Filter", "sap/fe/macros/filter/FilterUtils", "sap/ui/model/FilterOperator", "sap/fe/core/CommonUtils"],
	function(Filter, FilterUtil, FilterOperator, CommonUtils) {
		"use strict";
		var aPrevDrillStack = [];
		var oChartUtils = {
			/**
			 * Method to check if selections exist in the chart.
			 *
			 * @param {object} oMdcChart the mdc chart control
			 * @param {object} oSource the control that has to apply chart filters
			 * @returns {boolean} true if chart selection exists, false otherwise
			 */
			getChartSelectionsExist: function(oMdcChart, oSource) {
				// consider chart selections in the current drill stack or on any further drill downs
				oSource = oSource || oMdcChart;
				if (oMdcChart) {
					var oChart = oMdcChart.getAggregation("_chart");
					if (oChart) {
						var aDimensions = oChartUtils.getDimensionsFromDrillStack(oChart);
						var bIsDrillDown = aDimensions.length > aPrevDrillStack.length;
						var bIsDrillUp = aDimensions.length < aPrevDrillStack.length;
						var bNoChange = aDimensions.toString() === aPrevDrillStack.toString();
						var aFilters;
						if (bIsDrillUp && aDimensions.length === 1) {
							// drilling up to level0 would clear all selections
							aFilters = oChartUtils.getChartSelections(oMdcChart, true);
						} else {
							// apply filters of selections of previous drillstack when drilling up/down
							// to the chart and table
							aFilters = oChartUtils.getChartSelections(oMdcChart);
						}
						if (bIsDrillDown || bIsDrillUp) {
							// update the drillstack on a drill up/ drill down
							aPrevDrillStack = aDimensions;
							return aFilters.length > 0;
						} else if (bNoChange && oSource.isA("sap.ui.mdc.Table")) {
							// bNoChange is true when chart is selected
							return aFilters.length > 0;
						}
					}
				}
				return false;
			},
			/**
			 * Method that returns the chart filters stored in the ui model.
			 *
			 * @param {object} oMdcChart the mdc chart control
			 * @param {boolean} bClearSelections clears chart selections in the ui model if true
			 * @returns {Array} aVizSelections - chart selections
			 */
			getChartSelections: function(oMdcChart, bClearSelections) {
				// get chart selections
				if (bClearSelections) {
					oChartUtils.getChartModel(oMdcChart, "", {});
				}
				var aVizSelections = oChartUtils.getChartModel(oMdcChart, "filters");
				return aVizSelections || [];
			},
			/**
			 * Method that returns the chart selections as a filter.
			 *
			 * @param {object} oMdcChart the mdc chart control
			 * @returns {object} filter containing chart selections
			 */
			getChartFilters: function(oMdcChart) {
				// get chart selections as a filter
				var aFilters = oChartUtils.getChartSelections(oMdcChart) || [];
				return new Filter(aFilters);
			},
			/**
			 * Method that sets the chart selections as in the ui model.
			 *
			 * @param {object} oMdcChart the mdc chart control
			 */
			setChartFilters: function(oMdcChart) {
				var oChart = oMdcChart.getAggregation("_chart");
				var aChartFilters = [];
				function addChartFilters(aSelectedData) {
					for (var item in aSelectedData) {
						var aDimFilters = [];
						for (var i in aVisibleDimensions) {
							var sPath = aVisibleDimensions[i];
							var sValue = aSelectedData[item].data[sPath];
							if (sValue !== undefined) {
								aDimFilters.push(
									new Filter({
										path: sPath,
										operator: FilterOperator.EQ,
										value1: sValue
									})
								);
							}
						}
						if (aDimFilters.length > 0) {
							aChartFilters.push(new Filter(aDimFilters, true));
						}
					}
				}
				if (oChart) {
					var aVizSelections = oChartUtils.getVizSelection(oChart);
					var aVisibleDimensions = oChart.getVisibleDimensions();
					var aDimensions = oChartUtils.getDimensionsFromDrillStack(oChart);
					if (aDimensions.length > 0) {
						// saving selections in each drill stack for future use
						var oDrillStack = oChartUtils.getChartModel(oMdcChart, "drillStack") || {};
						oChartUtils.getChartModel(oMdcChart, "drillStack", {});
						oDrillStack[aDimensions.toString()] = aVizSelections;
						oChartUtils.getChartModel(oMdcChart, "drillStack", oDrillStack);
					}
					if (aVizSelections.length > 0) {
						// creating filters with selections in the current drillstack
						addChartFilters(aVizSelections);
					} else {
						// creating filters with selections in the previous drillstack when there are no selections in the current drillstack
						var aDrillStackKeys = Object.keys(oDrillStack) || [];
						var aPrevDrillStackData = oDrillStack[aDrillStackKeys[aDrillStackKeys.length - 2]] || [];
						addChartFilters(aPrevDrillStackData);
					}
					oChartUtils.getChartModel(oMdcChart, "filters", aChartFilters);
				}
			},
			/**
			 * Method that returns the chart selections as a filter.
			 *
			 * @param {object} oChart the inner chart control
			 * @returns {object} filterbar filters
			 */
			getFilterBarFilterInfo: function(oChart) {
				return FilterUtil.getFilterInfo(oChart.getFilter());
			},
			/**
			 * Method that returns chart and filterbar filters.
			 *
			 * @param {object} oChart the inner chart control
			 * @returns {object} oFilters - new filter having both chart and filterbar filters
			 */
			getAllFilterInfo: function(oChart) {
				var oFilters = oChartUtils.getFilterBarFilterInfo(oChart);
				var aChartFilters = oChartUtils.getChartFilters(oChart);

				if (aChartFilters && aChartFilters.aFilters && aChartFilters.aFilters.length) {
					oFilters.filters.push(aChartFilters);
				}
				// filterbar + chart filters
				return oFilters;
			},
			/**
			 * Method that returns selected data in the chart.
			 *
			 * @param {object} oChart the inner chart control
			 * @returns {Array} aSelectedPoints - selected chart data
			 */
			getChartSelectedData: function(oChart) {
				var aSelectedPoints = [];
				switch (oChart.getSelectionBehavior()) {
					case "DATAPOINT":
						aSelectedPoints = oChart.getSelectedDataPoints().dataPoints;
						break;
					case "CATEGORY":
						aSelectedPoints = oChart.getSelectedCategories().categories;
						break;
					case "SERIES":
						aSelectedPoints = oChart.getSelectedSeries().series;
						break;
				}
				return aSelectedPoints;
			},
			/**
			 * Method to get filters, drillstack and selected contexts in the ui model.
			 * Can also be used to set data in the model.
			 *
			 * @param {object} oMdcChart mdc chart control
			 * @param {string} sPath path in the ui model from which chart data is to be set/fetched
			 * @param {object|Array} vData chart info to be set
			 * @returns {object|Array} chart info (filters/drillstack/selectedContexts)
			 */
			getChartModel: function(oMdcChart, sPath, vData) {
				var oInternalModelContext = oMdcChart.getBindingContext("internal");
				if (!oInternalModelContext) {
					return false;
				}

				if (vData) {
					oInternalModelContext.setProperty(sPath, vData);
				}
				return oInternalModelContext && oInternalModelContext.getObject(sPath);
			},
			/**
			 * Method to fetch the current drillstack dimensions.
			 *
			 * @param {object} oChart inner chart control
			 * @returns {Array} aDimensions - current drillstack dimensions
			 */
			getDimensionsFromDrillStack: function(oChart) {
				var aCurrentDrillStack = oChart.getDrillStack() || [];
				var aCurrentDrillView = aCurrentDrillStack.pop() || {};
				var aDimensions = aCurrentDrillView.dimension || [];
				return aDimensions;
			},
			/**
			 * Method to fetch chart selections.
			 *
			 * @param {object} oChart inner chart control
			 * @returns {Array} chart selections
			 */
			getVizSelection: function(oChart) {
				return (oChart && oChart._getVizFrame() && oChart._getVizFrame().vizSelection()) || [];
			}
		};

		return oChartUtils;
	}
);
