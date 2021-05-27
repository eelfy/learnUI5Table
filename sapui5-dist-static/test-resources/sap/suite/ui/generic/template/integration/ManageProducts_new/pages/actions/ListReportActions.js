/*** List Report Actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled"],

	function (PropertyStrictEquals, AggregationFilled) {
		'use strict';

		return function (prefix, viewName, viewNamespace) {

			return {

				iClickOnACellInTheTable: function (iRow, sColumnIdentifiedByColumnTitle) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oTable) {
							//find the right column
							var aTableColumns = oTable.getColumns();
							var iMarkedColumn = -1;
							for (var i = 0; i < aTableColumns.length; i++) {
								var oTableColumn = aTableColumns[i];
								var oHeader = oTableColumn.getHeader();
								var sText = oHeader && oHeader.getText && oHeader.getText();
								if (sText === sColumnIdentifiedByColumnTitle){
									iMarkedColumn = i;
									break;
								}
							}
							if (iMarkedColumn > 0){
								var aTableItems = oTable.getItems();
								var oTableItem = aTableItems[iRow];
								var aCells = oTableItem.getCells();
								var oCell = aCells[iMarkedColumn];
								if (oCell.firePress) {
									oCell.firePress();
								}
							}
						},
						errorMessage: "Couldn't click on a link in the table."
					});
				},

				/* SET AN ITEM TO NOT DELETABLE (BY UPDATING DELETABLE-PATH) */
				iSetItemsToNotDeletableInTheTable: function (aItemIndex) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oModel = oControl.getModel();
							var aTableItems = oControl.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								var sPath = aTableItems[aItemIndex[i]].getBindingContext().getPath();
								oModel.setProperty(sPath + "/Delete_mc", false);
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				}
			};
		};
});
