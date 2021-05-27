/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
        "moveControls": "default",
        "GanttTableColumnOrder": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oView = mPropertyBag.view,
						oAppComponent = mPropertyBag.appComponent,
						oChangeDefinition = oChange.getDefinition(),
						sAggregationName = oChangeDefinition.content["aggregationName"],
						aNewColumnIds = oChangeDefinition.content["newValue"],
						aOldColumnIds = oChangeDefinition.content["oldValue"];

					// collect the columns before removing them
					var oNewColumns = [];
					aNewColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						oNewColumns.push(oColumn);
					});

					// move children in `columns` aggregation around
					if (oNewColumns.length > 0) {
						oModifier.removeAllAggregation(oControl, sAggregationName);
						oNewColumns.forEach(function (column, idx) {
							oModifier.insertAggregation(oControl, sAggregationName, column, idx, oView);
						});
					}

					oChange.setRevertData(aOldColumnIds);
					return true;
				},

				revertChange: function (oChange, oControl, mPropertyBag) {
					var oAppComponent = mPropertyBag.appComponent,
						oView = mPropertyBag.view,
						oModifier = mPropertyBag.modifier,
						aOldColumnIds = oChange.getRevertData(),
						oChangeDefinition = oChange.getDefinition(),
						sAggregationName = oChangeDefinition.content["aggregationName"];

					// collect the columns before removing them
					var aOldColumns = [];
					aOldColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						aOldColumns.push(oColumn);
					});

					// move children in `columns` aggregation around
					if (aOldColumns.length > 0) {
						oModifier.removeAllAggregation(oControl, sAggregationName);
						aOldColumns.forEach(function (column, idx) {
							oModifier.insertAggregation(oControl, sAggregationName, column, idx, oView);
						});
					}

					oChange.resetRevertData();
					return true;
				},

				completeChangeContent: function (oChange, mSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "14"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnSortOrder": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
                    oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "13"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnFilterValue": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
                    oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
                    oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "12"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnVisibility": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "11"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		}
    };
}, /* bExport= */ true);
