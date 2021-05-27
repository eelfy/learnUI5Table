module.exports = function(testId, projectName) {
	return `
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.${testId}.controller.App", {

		onInit: function() {



		}

	});
});

`
};