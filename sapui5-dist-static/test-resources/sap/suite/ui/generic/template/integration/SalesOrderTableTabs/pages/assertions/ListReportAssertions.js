/*** List Report assertions ***/
sap.ui.define(
	[],
	function () {
		'use strict';

		return function (prefix) {

			return {
				checkTheColumnOnTheLRTable: function (oColumnData, sTabKey) {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						id: sTabKey ? prefix + "listReport-" + sTabKey : prefix + "listReport",
						success: function (oSmartTable) {
							var sColumnId = oSmartTable.getTable().getColumns()[oColumnData.Index].getId();
							var sColumnHeader = oSmartTable.getTable().getColumns()[oColumnData.Index].getAggregation("header").getText();
							var sColumnHeaderId = oSmartTable.getTable().getColumns()[oColumnData.Index].getAggregation("header").getId();
							assert.ok(sColumnId === prefix + oColumnData.ColId, "Column id is correct");
							assert.ok(sColumnHeader === oColumnData.ColHeader, "Column header is correct");
							assert.ok(sColumnHeaderId === prefix + oColumnData.ColHeaderId, "Column header id is correct");
						},
						errorMessage: "Smart table not found on the screen"
					});
				},
			};
		};
	});
