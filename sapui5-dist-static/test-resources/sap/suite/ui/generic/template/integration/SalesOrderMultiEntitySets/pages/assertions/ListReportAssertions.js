/*** List Report assertions ***/
sap.ui.define(["sap/ui/test/Opa5",
"sap/ui/test/matchers/AggregationFilled"],
	function (Opa5,AggregationFilled) {
		'use strict';

		return function () {

			return {

				/**
				 * Check a field within the responsive table for correct values.
				 */
				theResultListFieldHasTheCorrectValue: function (iTabIndex, oItem) {
					return this.waitFor({
						id: new RegExp("--responsiveTable-" + iTabIndex + "$"),
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function (oControl) {
							var aTableItems = oControl.getItems();
							var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
							QUnit.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue);
						},
						errorMessage: "The Responsive Table is not rendered correctly"
					});
				},

				iCheckSmartChartNoDataTextForFilter: function () {
					return this.waitFor({
						controlType: "sap.ui.comp.smartchart.SmartChart",
						success: function (aNodes) {
							return aNodes[0].getChartAsync().then(function (chart) {
								QUnit.equal(
									chart.getCustomMessages().NO_DATA,
									"No data found. Try adjusting the search or filter parameters.",
									"Correct Message about NoData is displayed"
								);
							});
						},
						errorMessage: "The SmartChart with Id containing 'tab3' could not be found "
					});
				}
			};
		};
	});
