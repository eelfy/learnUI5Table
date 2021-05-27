/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/base/Object", "sap/ui/thirdparty/jquery"
], function(Object, $) {
	"use strict";

	return Object.extend("sap.feedback.ui.flpplugin.ui.PopOverVisual", {
		constructor: function() {

		},
		show: function() {
			var hiddenElement = $("#surveyTriggerButton");
			hiddenElement.click();
			/*QSI.API.unload();
			QSI.API.load().then(function() {
				QSI.API.run();
			});*/
		}
	});
});