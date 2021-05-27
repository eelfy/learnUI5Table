sap.ui.define(["./BaseAPI", "sap/fe/test/Utils", "sap/fe/test/builder/DialogBuilder"], function(BaseAPI, Utils, DialogBuilder) {
	"use strict";

	/**
	 * Constructs a new DialogAPI instance.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @param {int} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
	 * @returns {sap.fe.test.api.DialogAPI} The new instance
	 * @class
	 * @private
	 */
	var DialogAPI = function(oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
		if (!Utils.isOfType(oDialogBuilder, DialogBuilder)) {
			throw new Error("oDialogBuilder parameter must be a DialogBuilder instance");
		}
		this._iConfirmButtonIndex = iConfirmButtonIndex || 0;
		return BaseAPI.call(this, oDialogBuilder, vDialogDescription);
	};
	DialogAPI.prototype = Object.create(BaseAPI.prototype);
	DialogAPI.prototype.constructor = DialogAPI;

	DialogAPI.prototype._getConfirmButtonMatcher = function() {
		var iConfirmButtonIndex = this._iConfirmButtonIndex;
		return function(oButton) {
			var aButtons = oButton.getParent().getButtons();
			// Confirm is (usually) the first button
			return aButtons.indexOf(oButton) === Math.min(aButtons.length - 1, iConfirmButtonIndex);
		};
	};

	DialogAPI.prototype._getCancelButtonMatcher = function() {
		var iConfirmButtonIndex = this._iConfirmButtonIndex;
		return function(oButton) {
			var aButtons = oButton.getParent().getButtons();
			// Cancel is (usually) right next to the first (confirm) button
			return aButtons.indexOf(oButton) === Math.min(aButtons.length - 1, iConfirmButtonIndex + 1);
		};
	};

	return DialogAPI;
});
