sap.ui.define(["./DialogActions", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder"], function(DialogActions, Utils, OpaBuilder) {
	"use strict";

	/**
	 * Constructs a new DialogMessageActions instance.
	 *
	 * @param {sap.fe.test.builder.DialogBuilder} oDialogBuilder The {@link sap.fe.test.builder.DialogBuilder} instance used to interact with the UI
	 * @param {string} [vDialogDescription] Description (optional) of the dialog to be used for logging messages
	 * @returns {sap.fe.test.api.DialogMessageActions} The new instance
	 * @extends sap.fe.test.api.DialogActions
	 * @alias sap.fe.test.api.DialogMessageActions
	 * @class
	 * @hideconstructor
	 * @public
	 */
	var DialogMessageActions = function(oDialogBuilder, vDialogDescription) {
		return DialogActions.call(this, oDialogBuilder, vDialogDescription, 1);
	};
	DialogMessageActions.prototype = Object.create(DialogActions.prototype);
	DialogMessageActions.prototype.constructor = DialogMessageActions;
	DialogMessageActions.prototype.isAction = true;

	/**
	 * Executes the <code>Back</code> action on the message dialog.
	 *
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogMessageActions.prototype.iExecuteBack = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressHeaderButton(OpaBuilder.Matchers.properties({ icon: "sap-icon://nav-back" }))
				.description(Utils.formatMessage("Pressing back button on dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	/**
	 * Executes the <code>Refresh</code> action on the message dialog.
	 *
	 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
	 * @public
	 */
	DialogMessageActions.prototype.iExecuteRefresh = function() {
		return this.prepareResult(
			this.getBuilder()
				.doPressFooterButton(OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "C_COMMON_SAPFE_REFRESH"))
				.description(Utils.formatMessage("Pressing refresh button on dialog '{0}'", this.getIdentifier()))
				.execute()
		);
	};

	return DialogMessageActions;
});
