/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/ui/mdc/condition/Operator",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/ValidateException"
	],
	function(FilterOperatorUtil, Operator, ModelOperator, ValidateException) {
		"use strict";
		var aSupportedOperations = ["DATE", "FROM", "TO", "DATERANGE"];
		var mSemanticDateOperations = {
			"DATE": {
				"key": "DATE",
				"category": "DYNAMIC.DATE"
			},
			"FROM": {
				"key": "FROM",
				"category": "DYNAMIC.DATE"
			},
			"TO": {
				"key": "TO",
				"category": "DYNAMIC.DATE"
			},
			"DATERANGE": {
				"key": "DATERANGE",
				"category": "DYNAMIC.DATERANGE"
			},
			"SPECIFICMONTH": {
				"key": "SPECIFICMONTH",
				"category": "DYNAMIC.MONTH"
			},
			"TODAY": {
				"key": "TODAY",
				"category": "FIXED.DATE"
			},
			"TODAYFROMTO": {
				"key": "TODAYFROMTO",
				"category": "DYNAMIC.DATE.INT"
			},
			"YESTERDAY": {
				"key": "YESTERDAY",
				"category": "FIXED.DATE"
			},
			"TOMORROW": {
				"key": "TOMORROW",
				"category": "FIXED.DATE"
			},
			"LASTDAYS": {
				"key": "LASTDAYS",
				"category": "DYNAMIC.DATE.INT"
			},
			"NEXTDAYS": {
				"key": "NEXTDAYS",
				"category": "DYNAMIC.DATE.INT"
			},
			"THISWEEK": {
				"key": "THISWEEK",
				"category": "FIXED.WEEK"
			},
			"LASTWEEK": {
				"key": "LASTWEEK",
				"category": "FIXED.WEEK"
			},
			"LASTWEEKS": {
				"key": "LASTWEEKS",
				"category": "DYNAMIC.WEEK.INT"
			},
			"NEXTWEEK": {
				"key": "NEXTWEEK",
				"category": "FIXED.WEEK"
			},
			"NEXTWEEKS": {
				"key": "NEXTWEEKS",
				"category": "DYNAMIC.WEEK.INT"
			},
			"THISMONTH": {
				"key": "THISMONTH",
				"category": "FIXED.MONTH"
			},
			"LASTMONTH": {
				"key": "LASTMONTH",
				"category": "FIXED.MONTH"
			},
			"LASTMONTHS": {
				"key": "LASTMONTHS",
				"category": "DYNAMIC.MONTH.INT"
			},
			"NEXTMONTH": {
				"key": "NEXTMONTH",
				"category": "FIXED.MONTH"
			},
			"NEXTMONTHS": {
				"key": "NEXTMONTHS",
				"category": "DYNAMIC.MONTH.INT"
			},
			"THISQUARTER": {
				"key": "THISQUARTER",
				"category": "FIXED.QUARTER"
			},
			"LASTQUARTER": {
				"key": "LASTQUARTER",
				"category": "FIXED.QUARTER"
			},
			"LASTQUARTERS": {
				"key": "LASTQUARTERS",
				"category": "DYNAMIC.QUARTER.INT"
			},
			"NEXTQUARTER": {
				"key": "NEXTQUARTER",
				"category": "FIXED.QUARTER"
			},
			"NEXTQUARTERS": {
				"key": "NEXTQUARTERS",
				"category": "DYNAMIC.QUARTER.INT"
			},
			"QUARTER1": {
				"key": "QUARTER1",
				"category": "FIXED.QUARTER"
			},
			"QUARTER2": {
				"key": "QUARTER2",
				"category": "FIXED.QUARTER"
			},
			"QUARTER3": {
				"key": "QUARTER3",
				"category": "FIXED.QUARTER"
			},
			"QUARTER4": {
				"key": "QUARTER4",
				"category": "FIXED.QUARTER"
			},
			"THISYEAR": {
				"key": "THISYEAR",
				"category": "FIXED.YEAR"
			},
			"LASTYEAR": {
				"key": "LASTYEAR",
				"category": "FIXED.YEAR"
			},
			"LASTYEARS": {
				"key": "LASTYEARS",
				"category": "DYNAMIC.YEAR.INT"
			},
			"NEXTYEAR": {
				"key": "NEXTYEAR",
				"category": "FIXED.YEAR"
			},
			"NEXTYEARS": {
				"key": "NEXTYEARS",
				"category": "DYNAMIC.YEAR.INT"
			},
			"YEARTODATE": {
				"key": "YEARTODATE",
				"category": "FIXED.YEAR"
			}
		};
		function _getDateRangeOperator(oResourceBundle) {
			var sDateRange = oResourceBundle && oResourceBundle.getText("C_DATE_RANGE");
			return new Operator({
				name: "DATERANGE",
				filterOperator: ModelOperator.BT,
				tokenParse: "^#tokenText# \\(([^!].*) \\- (.+)\\)$",
				tokenFormat: "#tokenText# ({0} - {1})",
				valueTypes: [Operator.ValueType.Self, Operator.ValueType.Self],
				longText: sDateRange,
				tokenText: sDateRange,
				additionalInfo: "",
				validate: function(aValues, oType) {
					if (aValues.length < 2) {
						throw new ValidateException("Date Range must have two values");
					} else {
						var fromDate = new Date(aValues[0]);
						var toDate = new Date(aValues[1]);
						if (fromDate.getTime() > toDate.getTime()) {
							throw new ValidateException("From Date Should Be Less Than To Date");
						}
					}
					Operator.prototype.validate.apply(this, [aValues, oType]);
				}
			});
		}

		function _getDateOperator(oResourceBundle) {
			var sDate = oResourceBundle && oResourceBundle.getText("C_DATE");
			return new Operator({
				name: "DATE",
				filterOperator: ModelOperator.EQ,
				tokenParse: "^#tokenText# \\((.+)\\)$",
				tokenFormat: "#tokenText# ({0})",
				valueTypes: [Operator.ValueType.Self],
				longText: sDate,
				tokenText: sDate,
				additionalInfo: ""
			});
		}

		function _getFromOperator(oResourceBundle) {
			var sFrom = oResourceBundle && oResourceBundle.getText("C_FROM");
			return new Operator({
				name: "FROM",
				filterOperator: ModelOperator.GE,
				tokenParse: "^#tokenText# \\((.+)\\)$",
				tokenFormat: "#tokenText# ({0})",
				valueTypes: [Operator.ValueType.Self],
				longText: sFrom,
				tokenText: sFrom,
				additionalInfo: ""
			});
		}

		function _getToOperator(oResourceBundle) {
			var sTo = oResourceBundle && oResourceBundle.getText("C_TO");
			return new Operator({
				name: "TO",
				filterOperator: ModelOperator.LE,
				tokenParse: "^#tokenText# \\((.+)\\)$",
				tokenFormat: "#tokenText# ({0})",
				valueTypes: [Operator.ValueType.Self],
				longText: sTo,
				tokenText: sTo,
				additionalInfo: ""
			});
		}

		function _filterOperation(oOperation, aOperatorConfiguration) {
			if (!aOperatorConfiguration) {
				return true;
			}
			var aOperatorConfiguration = Array.isArray(aOperatorConfiguration) ? aOperatorConfiguration : [aOperatorConfiguration],
				bResult;

			aOperatorConfiguration.some(function(oOperatorConfiguration) {
				if (!oOperatorConfiguration.path) {
					return false;
				}

				var sValue = oOperation[oOperatorConfiguration.path];
				var bExclude = oOperatorConfiguration.exclude || false;
				var aOperatorValues;

				if (oOperatorConfiguration.contains && sValue) {
					aOperatorValues = oOperatorConfiguration.contains.split(",");
					bResult = bExclude;
					for (var j = 0; j < aOperatorValues.length; j++) {
						if (bExclude && sValue.indexOf(aOperatorValues[j]) > -1) {
							bResult = false;
							return true;
						} else if (!bExclude && sValue.indexOf(aOperatorValues[j]) > -1) {
							bResult = true;
							return true;
						}
					}
				}

				if (oOperatorConfiguration.equals && sValue) {
					aOperatorValues = oOperatorConfiguration.equals.split(",");
					bResult = bExclude;
					for (var j = 0; j < aOperatorValues.length; j++) {
						if (bExclude && sValue === aOperatorValues[j]) {
							bResult = false;
							return true;
						} else if (!bExclude && sValue === aOperatorValues[j]) {
							bResult = true;
							return true;
						}
					}
				}

				return false;
			});
			return bResult;
		}

		var SemanticDateOperators = {
			// Extending operators for Sematic Date Control
			addSemanticDateOperators: function() {
				var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
				FilterOperatorUtil.addOperator(_getDateRangeOperator(oResourceBundle));
				FilterOperatorUtil.addOperator(_getDateOperator(oResourceBundle));
				FilterOperatorUtil.addOperator(_getFromOperator(oResourceBundle));
				FilterOperatorUtil.addOperator(_getToOperator(oResourceBundle));
			},
			getSupportedOperations: function() {
				return aSupportedOperations;
			},
			getSemanticDateOperations: function() {
				return Object.keys(mSemanticDateOperations);
			},
			// TODO: Would need to check with MDC for removeOperator method
			removeSemanticDateOperators: function() {},
			// To filter operators based on manifest aOperatorConfiguration settings
			getFilterOperations: function(aOperatorConfiguration) {
				var aOperations = [];
				for (var n in mSemanticDateOperations) {
					var oOperation = mSemanticDateOperations[n];
					if (_filterOperation(oOperation, aOperatorConfiguration)) {
						aOperations.push(oOperation);
					}
				}
				return aOperations.map(function(oOperation) {
					return oOperation.key;
				});
			},
			hasSemanticDateOperations: function(oConditions) {
				var aSemanticDateOps = this.getSemanticDateOperations();
				for (var n in oConditions) {
					var aFilterCondtion = oConditions[n];
					var oSemanticOperator = aFilterCondtion.find(function(oCondition) {
						return aSemanticDateOps.indexOf(oCondition.operator) > -1;
					});
					if (oSemanticOperator) {
						return false;
					}
				}
				return true;
			}
		};
		return SemanticDateOperators;
	},
	/* bExport= */ true
);
