sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.WithValueListAndInOutParameters.Main", {
		onInit: function () {
			//JSON Model is only being used for edit mode
			var oViewModel = new JSONModel({
				editMode: true
			});
			this.getView().setModel(oViewModel, "view");
			this.byId("SC1").bindElement({
				path: "/Types('1001')"
			});
			this.oSplitApp = this.byId("app");
			oViewModel = this.getView().getModel("view");

		}
	});
});
