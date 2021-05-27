/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/ui/core/InvisibleText", "../utils/Constants", "../utils/Utils"],
	function(Object, InvisibleText, Constants, Utils) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.ui.ShellBarButton", {
			_fnRendererPromise: null,
			_oResourceBundle: null,
			_oInvisibleSurveyButton: null,
			_oHeaderItemOptions: {},
			_oHeaderItem: null,
			_fnDialogCallback: null,
			_bIsButtonHidden: false,
			constructor: function(fnRendererPromise, fnDialogCallback, oResourceBundle) {
				this._fnRendererPromise = fnRendererPromise;
				this._fnDialogCallback = fnDialogCallback;
				this._oResourceBundle = oResourceBundle;
			},
			init: function() {
				this._createInvisibleText();
				this._defineButtonOptions();
				return this._fnRendererPromise.then(function(oRenderer) {
					this._oHeaderItem = oRenderer.addHeaderEndItem(
						"sap.ushell.ui.shell.ShellHeadItem", this._oHeaderItemOptions,
						true
					);
				}.bind(this));
			},
			_createInvisibleText: function() {
				this._oInvisibleSurveyButton = new InvisibleText({
					id: Constants.S_INVISIBLE_ITEM_ID,
					text: this._getText("SHELLBAR_BUTTON_TOOLTIP")
				}).toStatic();
			},
			_defineButtonOptions: function() {
				this._oHeaderItemOptions = {
					id: Constants.S_SHELL_BTN_ID,
					icon: "sap-icon://feedback",
					tooltip: this._getText("SHELLBAR_BUTTON_TOOLTIP"),
					ariaLabel: this._getText("SHELLBAR_BUTTON_TOOLTIP"),
					ariaHaspopup: "dialog",
					text: this._getText("SHELLBAR_BUTTON_TOOLTIP"),
					press: this._fnDialogCallback.bind(this)
				};
			},
			updateButtonState: function() {
				if (Utils.isUI5Application(Utils.getCurrentApp())) {
					this._showButton();
				} else {
					this._hideButton();
				}
			},
			_showButton: function() {
				this._showHeaderItem();
				this._bIsButtonHidden = false;
			},
			_hideButton: function() {
				this._bIsButtonHidden = true;
				this._hideHeaderItem();
				return Constants.E_SHELLBAR_BUTTON_STATE.unchanged;
			},
			_showHeaderItem: function() {
				sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem([Constants.S_SHELL_BTN_ID]);
			},
			_hideHeaderItem: function() {
				sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem([Constants.S_SHELL_BTN_ID]);
			},
			_getText: function(sTextKey) {
				var text = this._oResourceBundle.getText(sTextKey);
				return text;
			}
		});
	});