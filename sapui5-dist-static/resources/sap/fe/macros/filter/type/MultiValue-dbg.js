sap.ui.define(
	["./Value"],
	function(Value) {
		"use strict";

		/**
		 * Handle format/parse of multi value filters.
		 */
		return Value.extend("sap.fe.macros.filter.type.MultiValue", {
			formatConditionValues: function(vValues) {
				return vValues;
			},

			formatValue: function(vValue, sInternalType) {
				var vResult = vValue;

				if (typeof vResult === "string") {
					vResult = vResult.split("; ");
				}

				if (Array.isArray(vResult)) {
					vResult = vResult
						.map(
							function(sValue) {
								return Value.prototype.formatValue.call(this, sValue, this.getElementTypeName(sInternalType));
							}.bind(this)
						)
						.filter(function(sValue) {
							return sValue !== undefined;
						});
				}

				return vResult || [];
			},

			parseValue: function(vValue, sSourceType) {
				var oOperator = this.getOperator();
				if (!vValue) {
					vValue = [];
				}
				return vValue.map(function(oValue) {
					return oOperator.format({ values: oValue || [] });
				});
			}
		});
	},
	true
);
