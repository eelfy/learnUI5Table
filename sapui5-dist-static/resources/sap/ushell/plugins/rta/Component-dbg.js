// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ushell/plugins/BaseRTAPlugin",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer"
], function (
	BaseRTAPlugin,
	CheckConditions,
	Renderer
) {
	"use strict";

	var RTAPlugin = BaseRTAPlugin.extend("sap.ushell.plugins.rta.Component", {
		sType: "rta",
		metadata: {
			manifest: "json",
			library: "sap.ushell"
		},

		init: function () {
			var oConfig = {
				sComponentName: "sap.ushell.plugins.rta",
				layer: "CUSTOMER",
				developerMode: false,
				id: "RTA_Plugin_ActionButton",
				text: "RTA_BUTTON_TEXT",
				icon: "sap-icon://wrench",
				visible: true,
				checkRestartRTA: true
			};
			BaseRTAPlugin.prototype.init.call(this, oConfig);
            var bButtonIsVisible = this.mConfig.visible && CheckConditions.checkUI5App();
            Renderer.createActionButton(this, this._onAdapt.bind(this), bButtonIsVisible);
		}

	});
	return RTAPlugin;

}, true /* bExport */);