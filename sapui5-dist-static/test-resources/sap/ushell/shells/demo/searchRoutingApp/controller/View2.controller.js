sap.ui.define( [
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("sap.ushell.shells.demo.searchRoutingApp.controller.View2", {
		onInit : function () {
		},

		onToPage1 : function () {
			this.getOwnerComponent().getRouter().navTo("page1");
		},

		onToPage3 : function () {
			var searchInputHelpWizard = sap.ui.getCore().byId(this.getView().getId()+'--searchInputHelpWizard');
			searchInputHelpWizard.selectItems();
			this.getOwnerComponent().getRouter().navTo("page3");
		},

		onBack : function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// There is no history!
				// replace the current hash with page 1 (will not add an history entry)
				this.getOwnerComponent().getRouter().navTo("page1", null, true);
			}
		}
	});

});
