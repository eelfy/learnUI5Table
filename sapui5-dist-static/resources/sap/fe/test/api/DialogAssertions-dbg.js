sap.ui.define(["./DialogAPI", "sap/fe/test/Utils"], function(DialogAPI, Utils) {
	"use strict";

	/**
	 * Constructs a new DialogAssertions instance.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @param {int} [iConfirmButtonIndex] Index of the 'confirm' button in the button aggregation; the default setting is 0 (first button from the left)
	 * @returns {sap.fe.test.api.DialogAssertions} The new instance
	 * @alias sap.fe.test.api.DialogAssertions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogAssertions = function(oDialogBuilder, vDialogDescription, iConfirmButtonIndex) {
		return DialogAPI.call(this, oDialogBuilder, vDialogDescription, iConfirmButtonIndex);
	};
	DialogAssertions.prototype = Object.create(DialogAPI.prototype);
	DialogAssertions.prototype.constructor = DialogAssertions;
	DialogAssertions.prototype.isAction = false;

	/**
	 * Checks the dialog.
	 *
	 * @param {object} [mDialogState] Defines the expected state of the dialog
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 *
	 * @public
	 */
	DialogAssertions.prototype.iCheckState = function(mDialogState) {
		return this.prepareResult(
			this.getBuilder()
				.hasState(mDialogState)
				.description(Utils.formatMessage("Checking dialog '{0}' in state '{1}'", this.getIdentifier(), mDialogState))
				.execute()
		);
	};

	/**
	 * Checks the confirmation button of the dialog.
	 *
	 * @param {object} [mButtonState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckConfirm = function(mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getConfirmButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking dialog '{0}' having confirmation button with state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	/**
	 * Checks the cancellation button of the dialog.
	 *
	 * @param {object} [mButtonState] Defines the expected state of the button
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogAssertions.prototype.iCheckCancel = function(mButtonState) {
		return this.prepareResult(
			this.getBuilder()
				.hasFooterButton(this._getCancelButtonMatcher(), mButtonState)
				.description(
					Utils.formatMessage(
						"Checking dialog '{0}' having cancellation button with state '{1}'",
						this.getIdentifier(),
						mButtonState
					)
				)
				.execute()
		);
	};

	return DialogAssertions;
});
