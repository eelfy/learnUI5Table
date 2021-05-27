sap.ui.define(
	[],
	function() {
		"use strict";

		var oUrlParser = sap.ushell.Container.getService("URLParsing");
		var oUrlParams = oUrlParser.parseParameters(window.location.search);
		var sFioriToolsRtaMode = "fiori-tools-rta-mode";
		var sFioriToolsRtaModeValue = oUrlParams[sFioriToolsRtaMode] && oUrlParams[sFioriToolsRtaMode][0].toLowerCase();
		// To enable all actions, remove the propagateMetadata function. Or, remove this file and its entry in AppComponent.js referring 'designTime'.
		return {
			actions: "not-adaptable",
			aggregations: {
				rootControl: {
					actions: "not-adaptable",
					propagateMetadata: function(oElement) {
						// allow list of controls for which we want to enable DesignTime
						var mAllowList = {};
						var isOnDynamicPage = function(oElement) {
							if (oElement.getMetadata().getName() === "sap.f.DynamicPage") {
								return true;
							} else {
								var oParent = oElement.getParent();
								return oParent ? isOnDynamicPage(oParent) : false;
							}
						};
						if (sFioriToolsRtaModeValue === "true") {
							// allow list for the Fiori tools
							if (isOnDynamicPage(oElement)) {
								mAllowList = {
									"sap.ui.fl.variants.VariantManagement": true,
									"sap.ui.mdc.FilterBar": true,
									"sap.ui.mdc.Table": true
								};
							}
						} else {
							// allow list for key users
							mAllowList = {
								"sap.fe.templates.ObjectPage.controls.StashableVBox": true,
								"sap.fe.templates.ObjectPage.controls.StashableHBox": true,
								"sap.uxap.ObjectPageLayout": true,
								"sap.uxap.AnchorBar": true,
								"sap.uxap.ObjectPageSection": true,
								"sap.uxap.ObjectPageSubSection": true,
								"sap.m.Button": true,
								"sap.m.MenuButton": true,
								"sap.m.FlexBox": true,
								"sap.ui.fl.util.IFrame": true,
								"sap.ui.layout.form.Form": true,
								"sap.ui.layout.form.FormContainer": true,
								"sap.ui.layout.form.FormElement": true
							};
							if (
								oElement.getMetadata().getName() === "sap.m.MenuButton" &&
								oElement.getParent().sParentAggregationName !== "_anchorBar"
							) {
								mAllowList["sap.m.MenuButton"] = false;
							}
							if (
								oElement.getMetadata().getName() === "sap.m.Button" &&
								oElement.getParent().sParentAggregationName !== "_anchorBar"
							) {
								mAllowList["sap.m.Button"] = false;
							}
							if (
								oElement.getMetadata().getName() === "sap.m.FlexBox" &&
								oElement.getId().indexOf("--fe::HeaderContentContainer") < 0
							) {
								mAllowList["sap.m.FlexBox"] = false;
							}
						}
						if (mAllowList[oElement.getMetadata().getName()]) {
							return {};
						} else {
							return {
								actions: "not-adaptable"
							};
						}
					}
				}
			}
		};
	},
	false
);
