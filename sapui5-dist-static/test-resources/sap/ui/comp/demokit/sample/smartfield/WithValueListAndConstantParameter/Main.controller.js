sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.WithValueListAndConstantParameter.Main", {
		onInit: function () {
			this.byId("form").bindElement({
				path: "/Main('1')"
			});
		}
	});
});
