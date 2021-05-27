sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/strings/formatMessage"
], function (Controller, formatMessage) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.demokit.tutorial.icecream.07.controller.ChartContainer", {
		formatMessage: formatMessage,

		onNavButtonPressed: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("home");
		}
	});
});