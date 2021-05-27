sap.ui.define(["sap/ui/core/Component", "sap/fe/plugins/preload/FilePreload", "sap/base/util/UriParameters"], function(
	Component,
	FilePreload,
	UriParameters
) {
	"use strict";
	return Component.extend("sap.fe.plugins.preload.Component", {
		metadata: {
			manifest: {
				"sap.ui5": {
					dependencies: {
						libs: {}
					},
					services: {
						ShellUIService: {
							factoryName: "sap.ushell.ui5service.ShellUIService"
						}
					},
					routing: {
						routes: [],
						targets: []
					}
				}
			},
			library: "sap.fe"
		},
		init: function() {
			if (UriParameters.fromURL(window.location.href).get("sap-ui-xx-fePreload") !== "false") {
				var oPluginParameters = this.getComponentData().config;
				var iStartupDelay = oPluginParameters.chunkStartUpDelay ? oPluginParameters.chunkStartUpDelay : 1000;
				setTimeout(function() {
					FilePreload.start(oPluginParameters.chunkSize, oPluginParameters.chunkInterval);
				}, iStartupDelay);
			}
		},
		exit: function() {}
	});
});
