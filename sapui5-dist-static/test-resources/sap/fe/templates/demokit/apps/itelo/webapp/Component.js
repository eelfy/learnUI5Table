sap.ui.define(["sap/fe/core/AppComponent", "sap/fe/test/Utils"], function(AppComponent, Utils) {
	"use strict";

	return AppComponent.extend("itelo.Component", {
		metadata: {
			"manifest": Utils.getManifest("itelo")
		}
	});
});
