sap.ui.define([ "sap/ui/core/Item" ], function(Item) {
	"use strict";

	return {
		initializeSelectionDetails: function(chartContainerContent) {
			this.oSelectionDetails = chartContainerContent.getSelectionDetails();
			var oActionGroup1 = new Item({
				key: "1",
				text: "Action Group 1"
			});
			var oActionGroup2 = new Item({
				key: "2",
				text: "Action Group 2"
			});
			this.oSelectionDetails.addActionGroup(oActionGroup1);
			this.oSelectionDetails.addActionGroup(oActionGroup2);
			this.oSelectionDetails.attachActionPress(this._onSelectionDetailsActionPress, this);
		},

		_onSelectionDetailsActionPress: function(oEvent) {
			if (oEvent.getParameter("level") === "Group") {
				var oActionsList1, oActionsList2;
				sap.ui.core.Fragment.load({
					name: "sap.suite.ui.commons.sample.ChartContainerActionGroups.ActionGroups1",
					type: "XML"
				}).then(function(oActionList) {
					oActionsList1 = oActionList;
				});
				sap.ui.core.Fragment.load({
					name: "sap.suite.ui.commons.sample.ChartContainerActionGroups.ActionGroups2",
					type: "XML"
				}).then(function(oActionList) {
					oActionsList2 = oActionList;
				});
				switch (oEvent.getParameter("action").getKey()) {
					case "1":
						this.oSelectionDetails.navTo("Action list 1", oActionsList1);
						break;
					case "2":
						this.oSelectionDetails.navTo("Action list 2", oActionsList2);
						break;
					default:
						break;
				}
			}
		}
	};
});
