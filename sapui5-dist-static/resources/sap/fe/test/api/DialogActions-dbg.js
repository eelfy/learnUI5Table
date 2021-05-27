sap.ui.define(["./DialogAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function(DialogAPI, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new DialogActions instance.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @param {int} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
	 * @returns {sap.fe.test.api.DialogActions} The new DialogActions instance
	 * @alias sap.fe.test.api.DialogActions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogActions = function(oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, iConfirmButtonIndex);
	};
	DialogActions.prototype = Object.create(DialogAPI.prototype);
	DialogActions.prototype.constructor = DialogActions;
	DialogActions.prototype.isAction = true;

	/**
	 * Confirms the dialog by clicking the corresponding button (for example, 'OK').
	 *
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iConfirm = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getConfirmButtonMatcher())
				.description(Utils.formatMessage("Confirming dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Cancels the dialog by clicking the corresponding button (for example, 'Cancel').
	 *
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iCancel = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(this._getCancelButtonMatcher())
				.description(Utils.formatMessage("Cancelling dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Closes the dialog by pressing the 'Escape' key.
	 *
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogActions.prototype.iClose = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressKeyboardShortcut("Escape")
				.description(Utils.formatMessage("Closing dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	return DialogActions;
});
