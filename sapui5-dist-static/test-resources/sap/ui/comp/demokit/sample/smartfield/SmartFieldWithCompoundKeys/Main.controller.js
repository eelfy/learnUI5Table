sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.SmartFieldWithCompoundKeys.Main", {
		onInit: function () {
			this.byId("form").bindElement({
				path: "/Main('1')"
			});
			var oModelRequest = new JSONModel();
			this.getView().setModel(oModelRequest, "data");
		},
		changeSF: function (oEvent) {
			var oView = this.getView();
			oView.getModel().attachRequestSent(this.onRequestSent, this);
		},
		onRequestSent: function(oEvent){
			this.byId("request").setText(
				decodeURIComponent(oEvent.mParameters.url)
			);
		}
	});
});
