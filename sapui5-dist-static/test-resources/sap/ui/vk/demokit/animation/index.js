sap.ui.require([
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/Core"
], function(
	Shell,
	ComponentContainer,
	core
) {
	"use strict";

	core.attachInit(function() {
		new Shell(
			"appshell",
			{
				app: new ComponentContainer({
					name: "sap-demo-animation"
				}),
				appWidthLimited: false
			}
		).placeAt("content");
	});
});
