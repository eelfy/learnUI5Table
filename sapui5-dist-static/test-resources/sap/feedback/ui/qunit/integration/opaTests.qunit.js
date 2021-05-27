/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";
	sap.ui.require([
		"sap/feedback/ui/flpplugin/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});

});