sap.ui.define(
	[
		"./TableAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/ui/test/matchers/Interactable",
		"sap/fe/test/builder/VMBuilder",
		"sap/ui/core/SortOrder",
		"sap/ui/core/Core",
		"sap/fe/test/builder/MdcFilterFieldBuilder",
		"./APIHelper"
	],
	function(TableAPI, Utils, OpaBuilder, FEBuilder, Interactable, VMBuilder, SortOrder, Core, FilterFieldBuilder, APIHelper) {
		"use strict";

		/**
		 * Constructs a new TableActions instance.
		 *
		 * @param {sap.fe.test.builder.TableBuilder} oBuilderInstance The builder instance used to interact with the UI
		 * @param {string} [vTableDescription] Description (optional) of the table to be used for logging messages
		 * @returns {sap.fe.test.api.TableActions} The new instance
		 * @alias sap.fe.test.api.TableActions
		 * @class
		 * @extends sap.fe.test.api.TableAPI
		 * @hideconstructor
		 * @public
		 */
		var Actions = function(oBuilderInstance, vTableDescription) {
			return TableAPI.call(this, oBuilderInstance, vTableDescription);
		};
		Actions.prototype = Object.create(TableAPI.prototype);
		Actions.prototype.constructor = Actions;
		Actions.prototype.isAction = true;

		/**
		 * Presses the control in the table cell.
		 *
		 * @param {object} [mRowValues] Specifies the target row by column-value map, e.g.
		 * <code><pre>
		 * {
		 *     0: "Max",
		 *     "Last Name": "Mustermann"
		 * }
		 * </pre></code>
		 * @param {string | number} vColumn The column name, label or index
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iPressCell = function(mRowValues, vColumn) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doClickOnCell(TableAPI.createRowMatchers(mRowValues), vColumn)
					.description(
						Utils.formatMessage(
							"Pressing cell of table '{0}' with row value = '{1}' and column {2} = '{3}' ",
							this.getIdentifier(),
							mRowValues,
							isNaN(vColumn) ? "header" : "index",
							vColumn
						)
					)
					.execute()
			);
		};

		/**
		 * Selects the specified rows.
		 *
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {object} [mState] Defines the expected state of the row
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSelectRows = function(vRowValues, mState) {
			var aArguments = Utils.parseArguments([[Object, Number], Object], arguments),
				oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doSelect(TableAPI.createRowMatchers(aArguments[0], aArguments[1]))
					.description(
						Utils.formatMessage(
							"Selecting rows of table '{0}' with values='{1}' and state='{2}'",
							this.getIdentifier(),
							aArguments[0],
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Selects all rows in a table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSelectAllRows = function() {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doSelectAll()
					.description(Utils.formatMessage("Selecting all rows in table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Clicks the specified row.
		 *
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iPressRow = function(vRowValues) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doNavigate(TableAPI.createRowMatchers(vRowValues))
					.description(Utils.formatMessage("Pressing row of table '{0}' with values='{1}'", this.getIdentifier(), vRowValues))
					.execute()
			);
		};

		/**
		 * Expands a row corresponding to a visual group.
		 *
		 * @param {number} iLevel The level of the group row to be expanded (1-based)
		 * @param {string} sTitle The title of the group row to be expanded
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExpandGroupRow = function(iLevel, sTitle) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doExpand(this.createGroupRowMatchers(iLevel, sTitle))
					.description(Utils.formatMessage("Expanding group row {0} - {1} of table '{2}'", iLevel, sTitle, this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Collapses a row corresponding to a visual group.
		 *
		 * @param {number} iLevel The level of the group row to be collapsed (1-based)
		 * @param {string} sTitle The title of the group row to be collapsed
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iCollapseGroupRow = function(iLevel, sTitle) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doCollapse(this.createGroupRowMatchers(iLevel, sTitle))
					.description(Utils.formatMessage("Collapsing group row {0} - {1} of table '{2}'", iLevel, sTitle, this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Scrolls up/down to the first/last row of the table.
		 *
		 * @param {string} [sDirection] The scroll direction "up" or "down" (default)
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @ui5-restricted
		 */
		Actions.prototype.iScroll = function(sDirection) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doScroll(sDirection)
					.description(Utils.formatMessage("Scrolling the table '{0}' '{1}'", this.getIdentifier(), sDirection))
					.execute()
			);
		};

		/**
		 * Changes the specified row. The given value map must match exactly one row.
		 *
		 * If only one parameter is provided, it must be the <code>mTargetValues</code> and <code>mRowValues</code> is considered undefined.
		 * If <code>vRowValues</code> are not defined, then the targetValues are inserted in the creationRow.
		 *
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {object} mTargetValues A map of columns (either name or index) to its new value. The columns do not need to match the ones defined in <code>vRowValues</code>.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iChangeRow = function(vRowValues, mTargetValues) {
			var oTableBuilder = this.getBuilder(),
				bIsCreationRow = false;

			if (arguments.length === 1) {
				bIsCreationRow = true;
				mTargetValues = vRowValues;
			}

			if (!bIsCreationRow) {
				oTableBuilder.checkNumberOfMatches(1).doEditValues(TableAPI.createRowMatchers(vRowValues), mTargetValues);
			} else {
				oTableBuilder.checkNumberOfMatches(1).doEditCreationRowValues(mTargetValues);
			}

			return this.prepareResult(
				oTableBuilder
					.description(
						Utils.formatMessage(
							"Changing row values of table '{0}' with old values='{1}' to new values='{2}'",
							this.getIdentifier(),
							bIsCreationRow ? "<CreationRow>" : vRowValues,
							mTargetValues
						)
					)
					.execute()
			);
		};

		/**
		 * Executes an action on the table.
		 *
		 * @param {string | sap.fe.test.api.ActionIdentifier} [vActionIdentifier] The identifier of the action, or its label
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteAction = function(vActionIdentifier) {
			var aArguments = Utils.parseArguments([[Object, String]], arguments),
				oTableBuilder = this.getBuilder();

			return this.prepareResult(
				oTableBuilder
					.doExecuteAction(this.createActionMatcher(vActionIdentifier))
					.description(Utils.formatMessage("Executing table action '{0}'", aArguments[0]))
					.execute()
			);
		};

		/**
		 * Executes an action form the drop-down menu that is currently open.
		 *
		 * @param {string | object} vAction The label of the action or its state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteMenuAction = function(vAction) {
			return this.prepareResult(APIHelper.createMenuActionExecutorBuilder(vAction).execute());
		};

		/**
		 * Executes the <code>Show/Hide details</code> action on the table.
		 *
		 * @param {boolean} [bShowDetails] Optional parameter to enforce a certain state (showing details yes/no corresponds to true/false); if not set, state is toggled
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteShowHideDetails = function(bShowDetails) {
			var oTableBuilder = this.getBuilder();
			return this.prepareResult(
				oTableBuilder
					.doShowHideDetails(bShowDetails)
					.description(
						Utils.formatMessage(
							"Executing the Show/Hide Details action for '{0}'{1}",
							this.getIdentifier(),
							bShowDetails !== undefined ? " enforcing 'Show Details' = " + bShowDetails : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Executes the <code>Delete</code> action on the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteDelete = function() {
			var oTableBuilder = this.getBuilder(),
				sDeleteId = "::StandardAction::Delete";

			return this.prepareResult(
				oTableBuilder
					.doExecuteAction(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sDeleteId))))
					.description(Utils.formatMessage("Pressing delete action of table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Selects a quick-filter item on the table.
		 *
		 * @param {object | string} [vItemIdentifier] If passed as an object, the following pattern will be considered:
		 * <code><pre>
		 * 	{
		 * 		<annotationPath>: <name of the key>
		 *  }
		 * </pre></code>
		 * If using a plain string as the identifier, it is considered the item label
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSelectQuickFilterItem = function(vItemIdentifier) {
			var oPropertyMatcher;
			if (Utils.isOfType(vItemIdentifier, String)) {
				oPropertyMatcher = { text: vItemIdentifier };
			} else if (Utils.isOfType(vItemIdentifier, Object)) {
				oPropertyMatcher = { key: vItemIdentifier.annotationPath };
			}
			return this.prepareResult(
				this.getBuilder()
					.doSelectQuickFilter(OpaBuilder.Matchers.properties(oPropertyMatcher))
					.description(
						Utils.formatMessage(
							"Selecting on table '{0}' quickFilter Item  with text '{1}'",
							this.getIdentifier(),
							vItemIdentifier
						)
					)
					.execute()
			);
		};

		/**
		 * Executes the <code>Create</code> action on the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteCreate = function() {
			var oTableBuilder = this.getBuilder(),
				sCreateId = "::StandardAction::Create";

			return this.prepareResult(
				oTableBuilder
					.doExecuteAction(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sCreateId))))
					.description(Utils.formatMessage("Pressing create action of table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Executes the <code>Paste</code> action on the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecutePaste = function() {
			var oTableBuilder = this.getBuilder(),
				sPasteId = "::StandardAction::Paste";

			return this.prepareResult(
				oTableBuilder
					.doExecuteAction(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sPasteId))))
					.description(Utils.formatMessage("Pressing paste action of table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Executes the <code>Fullscreen</code> action on the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteFullScreen = function() {
			var oTableBuilder = this.getBuilder(),
				sFullScreenId = "::StandardAction::FullScreen";

			return this.prepareResult(
				oTableBuilder
					.doExecuteAction(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sFullScreenId))))
					.description(Utils.formatMessage("Pressing fullscreen action of table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Executes the action to create a row in the table.
		 *
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteInlineCreate = function() {
			var oTableBuilder = this.getBuilder();

			return this.prepareResult(
				oTableBuilder
					.doOnChildren(
						OpaBuilder.create(this)
							.hasType("sap.ui.table.CreationRow")
							.has(FEBuilder.Matchers.bound())
							.checkNumberOfMatches(1)
							.doPress("applyBtn")
					)
					.description(Utils.formatMessage("Pressing inline create action of table '{0}'", this.getIdentifier()))
					.execute()
			);
		};

		/**
		 * Executes an action that is available in a certain column within a table row.
		 *
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {string | number} vColumn The column name, label or index
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteInlineAction = function(vRowValues, vColumn) {
			var aArguments = Utils.parseArguments(
					[
						[Object, Number],
						[String, Number]
					],
					arguments
				),
				oTableBuilder = this.getBuilder();

			return this.prepareResult(
				oTableBuilder
					.checkNumberOfMatches(1)
					.doExecuteInlineAction(TableAPI.createRowMatchers(aArguments[0]), aArguments[1])
					.description(
						Utils.formatMessage(
							"Pressing inline action of table '{0}' for row '{1}' and action " +
								(Utils.isOfType(aArguments[1], Number) ? "with column index '{2}'" : "'{2}'"),
							this.getIdentifier(),
							aArguments[0],
							aArguments[1]
						)
					)
					.execute()
			);
		};

		/**
		 * Executes a keyboard shortcut on the table or a cell control.
		 * If only <code>sShortcut</code> is defined, the shortcut is executed on the table directly.
		 * If additionally <code>vRowValues</code> and <code>vColumn</code> are defined, the shortcut is executed on table cell level.
		 *
		 * @param {string} sShortcut The shortcut pattern
		 * @param {object | number} [vRowValues] Defines the row values of the target row. The pattern is:
		 * <code><pre>
		 * 	{
		 * 		&lt;column-name-or-index>: &lt;expected-value>
		 *  }
		 * </pre></code>
		 * Alternatively, the 0-based row index can be used.
		 * @param {string | number} vColumn The column name, label or index
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iExecuteKeyboardShortcut = function(sShortcut, vRowValues, vColumn) {
			return this.prepareResult(
				this.getBuilder()
					.doPressKeyboardShortcut(sShortcut, vRowValues, vColumn)
					.description(
						Utils.formatMessage(
							vRowValues && vColumn
								? "Execute keyboard shortcut '{1}' on column '{3}' of row with values '{2}' of table '{0}'"
								: "Execute keyboard shortcut '{1}' on table '{0}'",
							this.getIdentifier(),
							sShortcut,
							vRowValues,
							vColumn
						)
					)
					.execute()
			);
		};

		/**
		 * Saves a variant under the given name, or overwrites the current one.
		 *
		 * @param {string} [sVariantName] The name of the new variant. If omitted, the current variant will be overwritten
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSaveVariant = function(sVariantName) {
			var fnSuccessFunction = Utils.isOfType(sVariantName, String)
				? function(oTable) {
						return VMBuilder.create(this)
							.hasId(oTable.getId ? oTable.getId() + "::VM" : oTable[0].getId() + "::VM")
							.doSaveAs(sVariantName)
							.description(Utils.formatMessage("Saving variant for '{0}' as '{1}'", this.getIdentifier(), sVariantName))
							.execute();
				  }
				: function(oTable) {
						return VMBuilder.create(this)
							.hasId(oTable.getId ? oTable.getId() + "::VM" : oTable[0].getId() + "::VM")
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

		/**
		 * Removes the variant of the given name.
		 *
		 * @param {string} sVariantName The name of the variant to be removed
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iRemoveVariant = function(sVariantName) {
			return this.prepareResult(
				this.getBuilder()
					.success(
						function(oTable) {
							return VMBuilder.create(this)
								.hasId(oTable.getId() + "::VM")
								.doRemoveVariant(sVariantName)
								.description(Utils.formatMessage("Removing variant '{1}' for '{0}'", this.getIdentifier(), sVariantName))
								.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		/**
		 * Selects the variant of the given name.
		 *
		 * @param {string} sVariantName The name of the variant to be selected
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSelectVariant = function(sVariantName) {
			return this.prepareResult(
				this.getBuilder()
					.success(
						function(oTable) {
							return VMBuilder.create(this)
								.hasId(oTable.getId() + "::VM")
								.doSelectVariant(sVariantName)
								.description(Utils.formatMessage("Selecting variant '{1}' for '{0}'", this.getIdentifier(), sVariantName))
								.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		/**
		 * Sets the variant as the default.
		 *
		 * @param {string} sVariantName The name of the variant to be set as the default variant. If omitted, the Standard variant is set as the default
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSetDefaultVariant = function(sVariantName) {
			return this.prepareResult(
				this.getBuilder()
					.success(
						function(oTable) {
							return sVariantName
								? VMBuilder.create(this)
										.hasId(oTable.getId ? oTable.getId() + "::VM" : oTable[0].getId() + "::VM")
										.doSetVariantAsDefault(sVariantName)
										.description(
											Utils.formatMessage(
												"Setting variant '{1}' as default for '{0}'",
												this.getIdentifier(),
												sVariantName
											)
										)
										.execute()
								: VMBuilder.create(this)
										.hasId(oTable.getId ? oTable.getId() + "::VM" : oTable[0].getId() + "::VM")
										.doResetDefaultVariant()
										.description(
											Utils.formatMessage("Setting Standard variant as default for '{0}'", this.getIdentifier())
										)
										.execute();
						}.bind(this)
					)
					.execute()
			);
		};

		/**
		 * Adds a field as a column to the table.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column field, or its label
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iAddAdaptationColumn = function(vColumnIdentifier) {
			return this.columnAdaptation(
				vColumnIdentifier,
				{ selected: false },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Adding column '{1}' to table '{0}'", this.getIdentifier(), vColumnIdentifier)
			);
		};

		/**
		 * Removes a field as a column from the table.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column field, or its label
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iRemoveAdaptationColumn = function(vColumnIdentifier) {
			return this.columnAdaptation(
				vColumnIdentifier,
				{ selected: true },
				OpaBuilder.Actions.press("selectMulti"),
				Utils.formatMessage("Removing column '{1}' from table '{0}'", this.getIdentifier(), vColumnIdentifier)
			);
		};

		/**
		 * Adds a field to the sorting of the table via the sort dialog.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column field, or its label
		 * @param {sap.ui.core.SortOrder} [sSortOrder] The sort order, default is {@link sap.ui.core.SortOrder.Ascending}
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iChangeSortOrder = function(vColumnIdentifier, sSortOrder) {
			var oOpaInstance = this.getOpaInstance(),
				aActions = [],
				oMdcResourceBundle = Core.getLibraryResourceBundle("sap.ui.mdc"),
				fnSortOrderAction = function(oColumnListItem) {
					var oChildBuilder = OpaBuilder.create(oOpaInstance).hasType("sap.m.Select"),
						vControls = OpaBuilder.Matchers.children(oChildBuilder)(oColumnListItem);
					// this function is not used in case of sSortOrder === SortOrder.None, so this case isn't handled
					return OpaBuilder.Actions.executor(
						OpaBuilder.Actions.enterText(
							sSortOrder === SortOrder.Ascending
								? oMdcResourceBundle.getText("sort.PERSONALIZATION_DIALOG_OPTION_ASCENDING")
								: oMdcResourceBundle.getText("sort.PERSONALIZATION_DIALOG_OPTION_DESCENDING")
						)
					)(vControls);
				};
			sSortOrder = sSortOrder || SortOrder.Ascending;
			switch (sSortOrder) {
				case SortOrder.Ascending:
					aActions.push(
						OpaBuilder.Actions.conditional(
							OpaBuilder.Matchers.properties({ selected: false }),
							OpaBuilder.Actions.press("selectMulti")
						)
					);
					aActions.push(fnSortOrderAction);
					break;
				case SortOrder.Descending:
					aActions.push(
						OpaBuilder.Actions.conditional(
							OpaBuilder.Matchers.properties({ selected: false }),
							OpaBuilder.Actions.press("selectMulti")
						)
					);
					aActions.push(fnSortOrderAction);
					break;
				case SortOrder.None:
					aActions.push(
						OpaBuilder.Actions.conditional(
							OpaBuilder.Matchers.properties({ selected: true }),
							OpaBuilder.Actions.press("selectMulti")
						)
					);
					break;
				default:
					throw new Error("unhandled switch case: " + sSortOrder);
			}
			return this.columnSorting(
				vColumnIdentifier,
				undefined,
				aActions,
				Utils.formatMessage("Setting sort of '{1}' from table '{0}' to '{2}'", this.getIdentifier(), vColumnIdentifier, sSortOrder)
			);
		};

		/**
		 * Sorts the table entries by the specified column.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier | number} vColumnIdentifier The identifier of the column field, its label or index
		 * @param {string} [sFieldLabel] The target field to sort by in case of a complex property
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iSortByColumn = function(vColumnIdentifier, sFieldLabel) {
			var oTableBuilder = this.getBuilder(),
				vColumn = Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier;
			return this.prepareResult(
				oTableBuilder
					.doSortByColumn(vColumn, sFieldLabel)
					.description(
						Utils.formatMessage(
							"Sorting column '{1}{2}' of table '{0}'",
							this.getIdentifier(),
							vColumnIdentifier,
							sFieldLabel ? "/" + sFieldLabel : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Groups the table entries by the specified column.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier | number} vColumnIdentifier The identifier of the column field, its label or index
		 * @param {string} [sFieldLabel] The target field to group on in case of a complex property
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iGroupByColumn = function(vColumnIdentifier, sFieldLabel) {
			var oTableBuilder = this.getBuilder(),
				vColumn = Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier;
			return this.prepareResult(
				oTableBuilder
					.doGroupByColumn(vColumn, sFieldLabel)
					.description(
						Utils.formatMessage(
							"Grouping column '{1}{2}' of table '{0}'",
							this.getIdentifier(),
							vColumnIdentifier,
							sFieldLabel ? "/" + sFieldLabel : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Aggregates the table entries by the specified column.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier | number} vColumnIdentifier The identifier of the column field, its label or index
		 * @param {string} [sFieldLabel] The target field to group on in case of a complex property
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iAggregateByColumn = function(vColumnIdentifier, sFieldLabel) {
			var oTableBuilder = this.getBuilder(),
				vColumn = Utils.isOfType(vColumnIdentifier, Object) ? vColumnIdentifier.name : vColumnIdentifier;
			return this.prepareResult(
				oTableBuilder
					.doAggregateByColumn(vColumn, sFieldLabel)
					.description(
						Utils.formatMessage(
							"Aggregating column '{1}{2}' of table '{0}'",
							this.getIdentifier(),
							vColumnIdentifier,
							sFieldLabel ? "/" + sFieldLabel : ""
						)
					)
					.execute()
			);
		};

		/**
		 * Adds a filter condition to the filter field.
		 *
		 * @param {string | sap.fe.test.api.ColumnIdentifier} vColumnIdentifier The identifier of the column
		 * @param {string | object} vValue Defines the value of the filter field condition
		 * @param {boolean} [bClearFirst] Set to <code>true</code> to clear previously set filters, otherwise all previously set values will be kept
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iChangeFilterField = function(vColumnIdentifier, vValue, bClearFirst) {
			var oFilterFieldBuilder = FilterFieldBuilder.create(this.getOpaInstance())
					.isDialogElement()
					.hasType("sap.ui.mdc.FilterField")
					.hasConditional(
						Utils.isOfType(vColumnIdentifier, String),
						OpaBuilder.Matchers.properties({ label: vColumnIdentifier }),
						OpaBuilder.Matchers.properties({ fieldPath: vColumnIdentifier.name })
					)
					.checkNumberOfMatches(1),
				bDialogOpen,
				sDescription = Utils.formatMessage(
					"Changing the filter field '{0}' of table '{1}' by adding '{2}' (was cleared first: {3})",
					vColumnIdentifier,
					this.getIdentifier(),
					vValue,
					bClearFirst
				),
				fnOpenDialog = this.iOpenFilterDialog.bind(this),
				fnCloseDialog = this.iConfirmFilterDialog.bind(this);

			return this.prepareResult(
				FEBuilder.create(this.getOpaInstance())
					.success(function() {
						bDialogOpen = FEBuilder.controlsExist(oFilterFieldBuilder);
						if (!bDialogOpen) {
							fnOpenDialog();
							oFilterFieldBuilder.success(fnCloseDialog);
						}
						return oFilterFieldBuilder
							.doChangeValue(vValue, bClearFirst)
							.description(sDescription)
							.execute();
					})
					.execute()
			);
		};

		/**
		 * Pastes data into the table.
		 *
		 * @param {string[][]} aData The data to be pasted
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 *
		 * @public
		 */
		Actions.prototype.iPasteData = function(aData) {
			return this.prepareResult(
				this.getBuilder()
					.doPasteData(aData)
					.description(Utils.formatMessage("Pasting {0} rows into table '{1}'", aData.length, this.getIdentifier()))
					.execute()
			);
		};

		return Actions;
	}
);
