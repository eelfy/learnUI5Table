/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/ui/core/HTML", "sap/m/Button",
		"sap/m/Dialog"
	],
	function(Object, Html, Button, Dialog) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.ui.IFrameVisual", {
			_oConfig: {},
			_oResourceBundle: null,
			_oInvisibleSurveyButton: null,
			_oHeaderItemOptions: {},
			_oHeaderItem: null,
			_oCurrentDialog: null,

			constructor: function(oConfig, oResourceBundle) {
				this._oConfig = oConfig;
				this._oResourceBundle = oResourceBundle;
			},
			_getText: function(sTextKey) {
				var sText = this._oResourceBundle.getText(sTextKey);
				return sText;
			},
			show: function(sContextDataUriParams) {
				var sSurveyUri = this._buildUri(sContextDataUriParams);
				var oIFrame = this._addIFrame(sSurveyUri);

				var oDialogSettings = this._defineDialogSettings(oIFrame);
				oDialogSettings = this._updateDialogDimensions(oDialogSettings);

				this._oCurrentDialog = new Dialog(oDialogSettings);
				this._oCurrentDialog.open();
			},
			_defineDialogSettings: function(oIFrame) {
				var oDialogSettings = {
					title: this._getText("DIALOG_TITLE"),
					showHeader: true,
					content: oIFrame,
					buttons: [new Button({
						text: this._getText("DIALOG_CLOSE_BUTTON"),
						type: "Transparent",
						press: function() {
							this._oCurrentDialog.close();
						}.bind(this)
					})]
				};
				return oDialogSettings;
			},
			_updateDialogDimensions: function(oDialogSettings) {
				if (sap.ui.Device.system.desktop || sap.ui.Device.system.tablet) {
					oDialogSettings.contentWidth = "1000px";
					oDialogSettings.contentHeight = "500px";
				} else {
					oDialogSettings.stretch = true;
				}
				return oDialogSettings;
			},
			_buildUri: function(sContextDataUriParams) {
				var sSurveyUri = this._oConfig.getQualtricsUri();
				sSurveyUri += sContextDataUriParams;
				return sSurveyUri;
			},
			_addIFrame: function(sIFrameUrl) {
				var oHtml = new Html();
				var sContentString =
					"<iframe src='" +
					sIFrameUrl +
					"' scrolling='auto' frameborder='no' width='99%' style='position: absolute; height: 95%;'></iframe>";
				oHtml.setContent(sContentString);
				return oHtml;
			}
		});
	});