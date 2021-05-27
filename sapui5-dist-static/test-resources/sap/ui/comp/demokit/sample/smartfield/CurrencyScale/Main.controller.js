sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.CurrencyScale.Main", {
		onInit: function () {
			var oView = this.getView();
			oView.bindElement("/Products('1239102')");
		}
	});
});
