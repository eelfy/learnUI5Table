sap.ui.define(
	["./Value"],
	function(Value) {
		"use strict";

		/**
		 * Handle format/parse of range filter values.
		 */
		return Value.extend("sap.fe.macros.filter.type.Range", {
			formatConditionValues: function(vValues) {
				return vValues;
			},

			formatValue: function(vValue, sInternalType) {
				var aResults = Value.prototype.formatValue.apply(this, arguments);

				if (!aResults) {
					var vMinValue = this.oFormatOptions.min || Number.MIN_SAFE_INTEGER,
						vMaxValue = this.oFormatOptions.max || Number.MAX_SAFE_INTEGER;

					aResults = [vMinValue, vMaxValue];
				}

				return aResults;
			},

			getDefaultOperatorName: function() {
				return "BT";
			}
		});
	},
	true
);
