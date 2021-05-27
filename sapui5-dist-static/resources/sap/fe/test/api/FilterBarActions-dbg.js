sap.ui.define(
	[
		"./FilterBarAPI",
		"sap/fe/test/Utils",
		"sap/fe/macros/filter/DraftEditState",
		"sap/fe/test/builder/FEBuilder",
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/VMBuilder"
	],
	function(FilterBarAPI, Utils, EditState, FEBuilder, Opa5, OpaBuilder, VMBuilder) {
		"use strict";

		/**
		 * Constructs a new FilterBarActions instance.
		 *
		 * @param {sap.fe.test.builder.FilterBarBuilder} oFilterBarBuilder The {@link sap.fe.test.builder.FilterBarBuilder} instance used to interact with the UI
		 * @param {string} [vFilterBarDescription] Description (optional) of the filter bar to be used for logging messages
		 * @returns {sap.fe.test.api.FilterBarActions} The new instance
		 * @alias sap.fe.test.api.FilterBarActions
		 * @class
		 * @extends sap.fe.test.api.FilterBarAPI
		 * @hideconstructor
		 * @public
		 */
		var FilterBarActions = function(oFilterBarBuilder, vFilterBarDescription) {
			return FilterBarAPI.call(this, oFilterBarBuilder, vFilterBarDescription);
		};
		FilterBarActions.prototype = Object.create(FilterBarAPI.prototype);
		FilterBarActions.prototype.constructor = FilterBarActions;
		FilterBarActions.prototype.isAction = true;

		/**
		 * Changes the value of the defined filter field.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier for the filter field
		 * @param {string} [vValue] The new target value
		 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		FilterBarActions.prototype.iChangeFilterField = function(vFieldIdentifier, vValue, bClearFirst) {
			var aArguments = Utils.parseArguments([[String, Object], String, Boolean], arguments),
				oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), aArguments[0]);

			return this.prepareResult(
				oFieldBuilder
					.doChangeValue(aArguments[1], aArguments[2])
					.description(
						Utils.formatMessage(
							"Changing the filter field '{1}' of filter bar '{0}' by adding '{2}' (was cleared first: {3})",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1],
							!!aArguments[2]
						)
					)
					.execute()
			);
		};

		/**
		 * Opens the value help of the given field.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the filter field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, that can be used for chaining statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iOpenValueHelp = function(vFieldIdentifier) {
			var oFieldBuilder = FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), vFieldIdentifier);
			return this.prepareResult(
				oFieldBuilder
					.doOpenValueHelp()
					.description(
						Utils.formatMessage(
							"Opening the value help for filter field '{1}' of filter bar '{0}'",
							this.getIdentifier(),
							vFieldIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Changes the search field.
		 *
		 * @param {string} [sSearchText] The new search text
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iChangeSearchField = function(sSearchText) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doChangeSearch(sSearchText)
					.description(
						Utils.formatMessage(
							"Changing the search text on filter bar '{0}' to '{1}'",
							this.getIdentifier(),
							sSearchText || ""
						)
					)
					.execute()
			);
		};

		/**
		 * Resets the search field.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iResetSearchField = function() {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doResetSearch()
					.description(Utils.formatMessage("Resetting the search field on filter bar '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Changes the editing status filter field.
		 *
		 * @param {sap.fe.test.api.EditState} sEditState Value of an edit state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iChangeEditingStatus = function(sEditState) {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doChangeEditingStatus(sEditState && EditState[sEditState])
					.description(
						Utils.formatMessage(
							"Changing the editing status on filter bar '{0}' to '{1}'",
							this.getIdentifier(),
							sEditState && EditState[sEditState].display
						)
					)
					.execute()
			);
		};

		/**
		 * Executes the search with the current filters.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iExecuteSearch = function() {
			var oFilterBarBuilder = this.getBuilder();
			return this.prepareResult(
				oFilterBarBuilder
					.doSearch()
					.description(Utils.formatMessage("Executing search on filter bar '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Adds a field as a filter field.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iAddAdaptationFilterField = function(vFieldIdentifier) {
			return this.filterFieldAdaptation(
				vFieldIdentifier,
				{ selected: false },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Adding field '{1}' to filter bar '{0}'", this.getIdentifier(), vFieldIdentifier)
			);
		};

		/**
		 * Removes a field as a filter field.
		 *
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} vFieldIdentifier The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iRemoveAdaptationFilterField = function(vFieldIdentifier) {
			return this.filterFieldAdaptation(
				vFieldIdentifier,
				{ selected: true },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Removing field '{1}' to filter bar '{0}'", this.getIdentifier(), vFieldIdentifier)
			);
		};

		/**
		 * Executes a keyboard shortcut.
		 *
		 * @param {string} sShortcut Pattern for the shortcut
		 * @param {string | sap.fe.test.api.FilterFieldIdentifier} [vFieldIdentifier] The identifier of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iExecuteKeyboardShortcut = function(sShortcut, vFieldIdentifier) {
			var oBuilder = vFieldIdentifier
				? FilterBarAPI.createFilterFieldBuilder(this.getBuilder(), vFieldIdentifier)
				: this.getBuilder();
			return this.prepareResult(
				oBuilder
					.doPressKeyboardShortcut(sShortcut)
					.description(
						Utils.formatMessage(
							"Execute keyboard shortcut '{1}' on filter bar '{0}' on field '{2}'",
							this.getIdentifier(),
							sShortcut,
							vFieldIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Saves a variant under the given name, or overwrites the current variant.
		 *
		 * @param {string} [sVariantName] The name of the new variant. If omitted, the current variant will be overwritten.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		FilterBarActions.prototype.iSaveVariant = function(sVariantName) {
			var fnSuccessFunction = Utils.isOfType(sVariantName, String)
				? function(oFilterBar) {
						return VMBuilder.create(this)
							.hasId(oFilterBar.getId() + "::VariantManagement")
							.doSaveAs(sVariantName)
							.description(Utils.formatMessage("Saving variant for '{0}' as '{1}'", this.getIdentifier(), sVariantName))
							.execute();
				  }
				: function(oFilterBar) {
						return VMBuilder.create(this)
							.hasId(oFilterBar.getId() + "::VariantManagement")
							.doSave()
							.description(Utils.formatMessage("Saving current variant for '{0}'", this.getIdentifier()))
							.execute();
				  };

			return this.prepareResult(
				this.getBuilder()
					.success(fnSuccessFunction.bind(this))
					.execute()
			);
		};

		return FilterBarActions;
	}
);
