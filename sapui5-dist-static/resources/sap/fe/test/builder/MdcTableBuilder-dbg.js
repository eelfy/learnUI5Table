sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"./FEBuilder",
		"./MacroFieldBuilder",
		"./OverflowToolbarBuilder",
		"./DialogBuilder",
		"sap/fe/test/Utils",
		"sap/ui/test/matchers/Interactable",
		"sap/ui/core/SortOrder",
		"sap/ui/test/actions/EnterText"
	],
	function(
		Opa5,
		OpaBuilder,
		FEBuilder,
		MacroFieldBuilder,
		OverflowToolbarBuilder,
		DialogBuilder,
		Utils,
		Interactable,
		SortOrder,
		EnterText
	) {
		"use strict";

		// depending on the sap.ui.table creates now extra request which are not optimal for test execution
		var RowActionType = {
			/**
			 * Custom defined Row Action.
			 * @public
			 */
			Custom: "Custom",

			/**
			 * Navigation Row Action.
			 * @public
			 */
			Navigation: "Navigation",

			/**
			 * Delete Row Action.
			 * @public
			 */
			Delete: "Delete"
		};

		function _isGridTable(oMdcTable) {
			return oMdcTable.getType().isA("sap.ui.mdc.table.GridTableType");
		}

		function _getRowAggregationName(oMdcTable) {
			return _isGridTable(oMdcTable) ? "rows" : "items";
		}

		function _getColumnIndex(vColumn, oMdcTable) {
			var iIndex = Number(vColumn);
			return Number.isNaN(iIndex)
				? oMdcTable.getColumns().findIndex(function(oColumn) {
						return oColumn.getHeader() === vColumn || oColumn.getDataProperty() === vColumn;
				  })
				: iIndex;
		}

		function _getMdcTable(vTableElement) {
			var oMdcTable = vTableElement;
			while (oMdcTable && !oMdcTable.isA("sap.ui.mdc.Table")) {
				oMdcTable = oMdcTable._feMdcTableWrapper || oMdcTable.getParent();
			}
			return oMdcTable;
		}

		function _getCellIndex(vColumn, oRow) {
			var oMdcTable = _getMdcTable(oRow);
			return oMdcTable ? _getColumnIndex(vColumn, oMdcTable) : -1;
		}

		function _getCell(oRow, iColumn) {
			var oCell;
			if (!oRow) {
				return null;
			}
			if (oRow.isA("sap.ui.mdc.table.CreationRow")) {
				oCell = oRow._oInnerCreationRow._getCell(iColumn);
			} else if (oRow.isA("sap.ui.table.CreationRow")) {
				oCell = oRow._getCell(iColumn);
			} else {
				oCell = oRow.getCells()[iColumn];
			}

			if (oCell.isA("sap.fe.macros.MacroAPI")) {
				oCell = oCell.getContent();
			}
			return oCell;
		}

		function _getCellButtonsForInlineAction(oCell, sButtonText) {
			if (oCell.isA("sap.fe.macros.MacroAPI")) {
				oCell = oCell.getContent();
			}

			var mState = {
					controlType: "sap.m.Button"
				},
				oStateMatcher;
			if (sButtonText) {
				mState.text = sButtonText;
			}
			oStateMatcher = FEBuilder.Matchers.states(mState);
			return oStateMatcher(oCell) ? [oCell] : OpaBuilder.Matchers.children(oStateMatcher)(oCell);
		}

		function _getButtonsForInlineActions(vColumn, oRow) {
			var iIndex = Number(vColumn);
			if (Number.isNaN(iIndex)) {
				return oRow.getCells().reduce(function(aPrev, oCell) {
					return aPrev.concat(_getCellButtonsForInlineAction(oCell, vColumn));
				}, []);
			}
			return _getCellButtonsForInlineAction(_getCell(oRow, iIndex));
		}

		function _getRowNavigationIconOnGridTable(oRow) {
			var oRowAction = oRow.getRowAction();
			return oRowAction.getItems().reduce(function(oIcon, oActionItem, iIndex) {
				if (!oIcon && oActionItem.getType() === RowActionType.Navigation) {
					oIcon = oRowAction.getAggregation("_icons")[iIndex];
				}
				return oIcon;
			}, null);
		}

		function _getRowMatcher(vRowMatcher) {
			var aRowMatcher = [new Interactable(), FEBuilder.Matchers.bound()];
			if (Utils.isOfType(vRowMatcher, Object)) {
				vRowMatcher = TableBuilder.Row.Matchers.cellValues(vRowMatcher);
			}
			if (vRowMatcher) {
				aRowMatcher = aRowMatcher.concat(vRowMatcher);
			}
			return aRowMatcher;
		}

		function _getInnerTable(oMdcTable) {
			return oMdcTable && oMdcTable._oTable;
		}

		function _createTableInternalButtonBuilder(oTableBuilder, sButtonSuffix, vAction, sButtonType) {
			sButtonType = sButtonType || "sap.m.Button";
			return oTableBuilder.doOpenOverflow().success(function(oTable) {
				return OpaBuilder.create()
					.hasType(sButtonType)
					.hasId(RegExp(Utils.formatMessage("-{0}$", sButtonSuffix)))
					.has(OpaBuilder.Matchers.ancestor(oTable))
					.doConditional(!!vAction, vAction)
					.execute();
			});
		}

		function _createColumnWrapper(oColumn, bGridTable) {
			return {
				getHeader: function() {
					return bGridTable
						? (oColumn.getLabel() && oColumn.getLabel().getText()) || oColumn.getName()
						: oColumn.getHeader() && oColumn.getHeader().getText();
				},
				getDataProperty: function() {
					return "$data property not available$";
				}
			};
		}

		function _createTableWrapper(oInnerTable) {
			var bGridTable = oInnerTable.isA("sap.ui.table.Table"),
				oWrapper = {
					_oTable: oInnerTable,
					isA: function(sName) {
						return sName === "sap.ui.mdc.Table";
					},
					getType: function() {
						return {
							isA: function(sName) {
								return sName === (bGridTable ? "sap.ui.mdc.table.GridTableType" : "sap.ui.mdc.table.ResponsiveTableType");
							}
						};
					},
					getColumns: function() {
						return oInnerTable.getColumns().map(function(oColumn) {
							return _createColumnWrapper(oColumn, bGridTable);
						});
					},
					getRowBinding: function() {
						return oInnerTable.getBinding(_getRowAggregationName(oWrapper));
					}
				};
			oInnerTable._feMdcTableWrapper = oWrapper;
			return oWrapper;
		}

		var TableBuilder = function() {
			return FEBuilder.apply(this, arguments).hasType("sap.ui.mdc.Table");
		};

		TableBuilder.create = function(oOpaInstance) {
			return new TableBuilder(oOpaInstance);
		};

		TableBuilder.createWrapper = function(oOpaInstance, sTableType, vTableMatcher) {
			var oBuilder = new TableBuilder(oOpaInstance).hasType(sTableType);

			if (vTableMatcher) {
				oBuilder.has(vTableMatcher);
			}

			return oBuilder.has(function(oTable) {
				return _createTableWrapper(oTable);
			});
		};

		TableBuilder.prototype = Object.create(FEBuilder.prototype);
		TableBuilder.prototype.constructor = TableBuilder;

		TableBuilder.prototype.getStatesMatcher = function(mState) {
			return TableBuilder.Matchers.states(mState);
		};

		TableBuilder.prototype.hasColumns = function(mColumnMap, bIgnoreColumnState) {
			if (!mColumnMap || Object.keys(mColumnMap).length === 0) {
				return this;
			}
			return this.has(TableBuilder.Matchers.columnsMatcher(mColumnMap, bIgnoreColumnState));
		};

		TableBuilder.prototype.hasRows = function(vRowMatcher, bReturnAggregationItems) {
			vRowMatcher = _getRowMatcher(vRowMatcher);

			return bReturnAggregationItems
				? this.has(TableBuilder.Matchers.rows(vRowMatcher))
				: this.has(TableBuilder.Matchers.rowsMatcher(vRowMatcher));
		};

		TableBuilder.prototype.doOnRows = function(vRowMatcher, vRowAction) {
			if (arguments.length === 1) {
				vRowAction = vRowMatcher;
				vRowMatcher = undefined;
			}
			if (!vRowAction) {
				return this;
			}
			return this.hasRows(vRowMatcher, true).do(OpaBuilder.Actions.executor(vRowAction));
		};

		TableBuilder.prototype.doClickOnCell = function(vRowMatcher, vColumn) {
			return this.doOnRows(vRowMatcher, TableBuilder.Row.Actions.onCell(vColumn, OpaBuilder.Actions.press()));
		};

		TableBuilder.prototype.doScroll = function(sDirection) {
			return this.do(function(oTable) {
				switch (sDirection) {
					case "up":
						oTable.scrollToIndex(0);
						break;
					case "down":
					default:
						oTable.scrollToIndex(-1);
						break;
				}
			});
		};

		TableBuilder.prototype.doPressKeyboardShortcut = function(sShortcut, vRowMatcher, vColumn) {
			// All arguments are passed -> shortcut will be executed on cell level
			if (vRowMatcher && vColumn) {
				return this.doOnRows(
					vRowMatcher,
					TableBuilder.Row.Actions.onCell(vColumn, FEBuilder.Actions.keyboardShortcut(sShortcut, "input"))
				);
			}
			// else shortcut will be executed on table level
			return this.do(FEBuilder.Actions.keyboardShortcut(sShortcut, true));
		};

		TableBuilder.prototype.doEditValues = function(vRowMatcher, mColumnValueMap) {
			if (arguments.length === 1) {
				mColumnValueMap = vRowMatcher;
				vRowMatcher = undefined;
			}
			return this.hasColumns(mColumnValueMap, true).doOnRows(vRowMatcher, TableBuilder.Row.Actions.editCells(mColumnValueMap));
		};

		TableBuilder.prototype.doEditCreationRowValues = function(mColumnValueMap) {
			return this.hasColumns(mColumnValueMap, true)
				.has(OpaBuilder.Matchers.aggregation("creationRow"))
				.do(TableBuilder.Row.Actions.editCells(mColumnValueMap));
		};

		TableBuilder.prototype.doSelect = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					var oTable = oRow.getParent(),
						oRowIndex = oTable.indexOfRow(oRow);
					return OpaBuilder.Actions.press("rowsel" + oRowIndex).executeOn(oTable);
				}
				return OpaBuilder.Actions.press().executeOn(oRow.getMultiSelectControl() || oRow.getSingleSelectControl());
			});
		};
		TableBuilder.prototype.doSelectAll = function() {
			return this.do(function(oTable) {
				var bIsGridTable = _isGridTable(oTable);
				if (bIsGridTable) {
					return OpaBuilder.Actions.press("selall").executeOn(oTable.getAggregation("_content"));
				}
				return OpaBuilder.Actions.press("sa").executeOn(oTable.getAggregation("_content"));
			});
		};

		TableBuilder.prototype.doNavigate = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					return OpaBuilder.Actions.press().executeOn(_getRowNavigationIconOnGridTable(oRow));
				}
				return OpaBuilder.Actions.press("imgNav").executeOn(oRow);
			});
		};

		TableBuilder.prototype.doPressColumnHeader = function(vColumn) {
			return this.has(TableBuilder.Matchers.columnControl(vColumn))
				.has(FEBuilder.Matchers.singleElement())
				.doPress();
		};

		TableBuilder.prototype.doColumnHeaderAction = function(vColumn, sActionIconName, sFieldName) {
			var oSortPopoverBuilder = OpaBuilder.create()
				.isDialogElement()
				.hasType(sFieldName ? "sap.m.ToggleButton" : "sap.m.Button")
				.hasProperties({ icon: sActionIconName })
				.doPress();

			if (sFieldName) {
				oSortPopoverBuilder.success(
					OpaBuilder.create()
						.isDialogElement()
						.hasType("sap.m.StandardListItem")
						.hasProperties({ title: sFieldName })
						.doPress()
				);
			}
			return this.doPressColumnHeader(vColumn).success(oSortPopoverBuilder);
		};

		TableBuilder.prototype.doSortByColumn = function(vColumn, sFieldName) {
			return this.doColumnHeaderAction(vColumn, "sap-icon://sort", sFieldName);
		};

		TableBuilder.prototype.doGroupByColumn = function(vColumn, sFieldName) {
			return this.doColumnHeaderAction(vColumn, "sap-icon://group-2", sFieldName);
		};

		TableBuilder.prototype.doAggregateByColumn = function(vColumn, sFieldName) {
			return this.doColumnHeaderAction(vColumn, "sap-icon://sum", sFieldName);
		};

		TableBuilder.prototype.doExpand = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					oRow.expand();
				}
			});
		};

		TableBuilder.prototype.doCollapse = function(vRowMatcher) {
			return this.doOnRows(vRowMatcher, function(oRow) {
				if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
					oRow.collapse();
				}
			});
		};

		TableBuilder.prototype.hasOverlay = function(bHasOverlay) {
			return this.has(TableBuilder.Matchers.overlay(bHasOverlay));
		};

		TableBuilder.prototype.hasNumberOfRows = function(iNumberOfRows) {
			return this.has(function(oTable) {
				var oRowBinding = oTable.getRowBinding(),
					// when having an overlay, the table is dirty and the rows do not reflect the actual table state
					bHasOverlay = TableBuilder.Matchers.overlay(true)(oTable);
				return (
					(oRowBinding &&
						!bHasOverlay &&
						(iNumberOfRows === undefined ? oRowBinding.getLength() !== 0 : oRowBinding.getLength() === iNumberOfRows)) ||
					((!oRowBinding || bHasOverlay) && iNumberOfRows === 0)
				);
			});
		};

		TableBuilder.prototype.hasQuickFilterItems = function(iNumberOfItems) {
			return this.has(function(oTable) {
				var oQuickFilter = oTable.getQuickFilter();
				if (oQuickFilter) {
					var aItems = oQuickFilter.getSelector().getItems();
					if (Utils.isOfType(aItems, Array)) {
						return aItems.length === iNumberOfItems;
					}
					return false;
				}
				return false;
			});
		};

		TableBuilder.prototype.doSelectQuickFilter = function(oItemMatcher) {
			return this.has(function(oTable) {
				return oTable.getQuickFilter().getSelector();
			})
				.doConditional(FEBuilder.Matchers.state("controlType", "sap.m.Select"), OpaBuilder.Actions.press())
				.success(
					function(oQFControl) {
						return FEBuilder.create(this)

							.hasId([].concat(oQFControl)[0].getId())
							.doOnAggregation("items", oItemMatcher, OpaBuilder.Actions.press())
							.execute();
					}.bind(this)
				);
		};

		TableBuilder.prototype.doOpenOverflow = function() {
			return OverflowToolbarBuilder.openOverflow(this, "toolbar");
		};

		TableBuilder.prototype.doCloseOverflow = function() {
			return OverflowToolbarBuilder.closeOverflow(this, "toolbar");
		};

		TableBuilder.prototype.doExecuteAction = function(vActionMatcher) {
			var oSuccessBuilder = new TableBuilder(this.getOpaInstance(), this.build()).doOnAggregation(
				"actions",
				vActionMatcher,
				OpaBuilder.Actions.press()
			);
			return this.doOpenOverflow().success(oSuccessBuilder);
		};

		TableBuilder.prototype.hasShowHideDetails = function() {
			return _createTableInternalButtonBuilder(this, "showHideDetails", false);
		};

		TableBuilder.prototype.doShowHideDetails = function(bShowDetails) {
			return this.doOpenOverflow().success(function(oMdcTable) {
				if (_isGridTable(oMdcTable)) {
					return;
				}
				var oRb = Opa5.getWindow()
						.sap.ui.getCore()
						.getLibraryResourceBundle("sap.ui.mdc"),
					sExpectedText;
				if (bShowDetails !== undefined) {
					sExpectedText = bShowDetails ? oRb.getText("table.SHOWDETAILS_TEXT") : oRb.getText("table.HIDEDETAILS_TEXT");
				}
				return OpaBuilder.create()
					.hasType("sap.m.Button")
					.hasId(/-showHideDetails$/)
					.has(OpaBuilder.Matchers.ancestor(oMdcTable))
					.doConditional(function(oButton) {
						// only press button if currently in expected state
						return !sExpectedText || oButton.getText() === sExpectedText;
					}, OpaBuilder.Actions.press())
					.execute();
			});
		};

		TableBuilder.prototype.hasColumnAdaptation = function() {
			return _createTableInternalButtonBuilder(this, "settings", false);
		};

		TableBuilder.prototype.doOpenColumnAdaptation = function() {
			return _createTableInternalButtonBuilder(this, "settings", OpaBuilder.Actions.press());
		};

		TableBuilder.prototype.hasColumnSorting = function() {
			return _createTableInternalButtonBuilder(this, "sort", false);
		};

		TableBuilder.prototype.doOpenColumnSorting = function() {
			return _createTableInternalButtonBuilder(this, "sort", OpaBuilder.Actions.press());
		};

		TableBuilder.prototype.hasColumnFiltering = function() {
			return _createTableInternalButtonBuilder(this, "filter", false);
		};

		TableBuilder.prototype.doOpenColumnFiltering = function() {
			return _createTableInternalButtonBuilder(this, "filter", OpaBuilder.Actions.press());
		};

		TableBuilder.prototype.hasColumnExport = function() {
			return _createTableInternalButtonBuilder(this, "export", false, "sap.m.MenuButton");
		};

		TableBuilder.prototype.doExecuteInlineAction = function(vRowMatcher, vColumn) {
			return this.doOnRows(vRowMatcher, TableBuilder.Row.Actions.pressInlineAction(vColumn));
		};

		TableBuilder.prototype.doPasteData = function(aData) {
			return this.do(function(oMdcTable) {
				oMdcTable.firePaste({ data: aData });
			});
		};

		TableBuilder.createAdaptationDialogBuilder = function(oOpaInstance) {
			return DialogBuilder.create(oOpaInstance).has(
				OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "table.SETTINGS_COLUMN")
			);
		};

		TableBuilder.createSortingDialogBuilder = function(oOpaInstance) {
			return DialogBuilder.create(oOpaInstance).has(OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "table.SETTINGS_SORT"));
		};

		TableBuilder.createFilteringDialogBuilder = function(oOpaInstance) {
			return DialogBuilder.create(oOpaInstance).has(
				OpaBuilder.Matchers.resourceBundle("title", "sap.ui.mdc", "filter.PERSONALIZATION_DIALOG_TITLE")
			);
		};

		TableBuilder.Cell = {
			Matchers: {
				state: function(sName, vValue) {
					switch (sName) {
						case "editor":
						case "editors":
							return function(oCell) {
								return MacroFieldBuilder.Matchers.states(vValue)(oCell);
							};
						default:
							return FEBuilder.Matchers.state(sName, vValue);
					}
				},
				states: function(mStateMap) {
					return FEBuilder.Matchers.states(mStateMap, TableBuilder.Cell.Matchers.state);
				}
			}
		};

		TableBuilder.Column = {
			Matchers: {
				state: function(sName, vValue) {
					switch (sName) {
						case "sortOrder":
							return TableBuilder.Column.Matchers.sortOrder(vValue);
						case "template":
						case "creationTemplate":
							return function(oColumn) {
								return MacroFieldBuilder.Matchers.states(vValue)(oColumn.getAggregation(sName));
							};
						default:
							return FEBuilder.Matchers.state(sName, vValue);
					}
				},
				states: function(mStateMap) {
					return FEBuilder.Matchers.states(mStateMap, TableBuilder.Column.Matchers.state);
				},
				sortOrder: function(sSortOrder) {
					return function(oMdcColumn) {
						var oMdcTable = oMdcColumn.getParent(),
							bIsGridTable = _isGridTable(oMdcTable),
							mProperties = {};

						if (bIsGridTable) {
							mProperties.sorted = sSortOrder === SortOrder.None ? false : true;
							if (sSortOrder !== SortOrder.None) {
								mProperties.sortOrder = sSortOrder;
							}
						} else {
							mProperties.sortIndicator = sSortOrder;
						}

						return FEBuilder.controlsExist(
							FEBuilder.create()
								.hasId(oMdcColumn.getId() + "-innerColumn")
								.hasProperties(mProperties)
						);
					};
				}
			}
		};

		TableBuilder.Row = {
			Matchers: {
				cell: function(vColumn) {
					return function(oRow) {
						var iColumn = _getCellIndex(vColumn, oRow);
						return _getCell(oRow, iColumn);
					};
				},
				cellValue: function(vColumn, vExpectedValue) {
					return function(oRow) {
						var oCellField = TableBuilder.Row.Matchers.cell(vColumn)(oRow);
						while (oCellField.isA("sap.fe.macros.MacroAPI")) {
							oCellField = oCellField.getContent();
						}
						return MacroFieldBuilder.Matchers.value(vExpectedValue)(oCellField);
					};
				},
				cellValues: function(mColumnValueMap) {
					if (!mColumnValueMap) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mColumnValueMap).map(function(sColumnName) {
							return TableBuilder.Row.Matchers.cellValue(sColumnName, mColumnValueMap[sColumnName]);
						})
					);
				},
				cellProperty: function(vColumn, oExpectedState) {
					return function(oRow) {
						var oCell = TableBuilder.Row.Matchers.cell(vColumn)(oRow);
						while (oCell.isA("sap.fe.macros.MacroAPI")) {
							oCell = oCell.getContent();
						}
						return TableBuilder.Cell.Matchers.states(oExpectedState)(oCell);
					};
				},
				cellProperties: function(mCellStateMap) {
					if (!mCellStateMap) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mCellStateMap).map(function(sColumnName) {
							return TableBuilder.Row.Matchers.cellProperty(sColumnName, mCellStateMap[sColumnName]);
						})
					);
				},
				selected: function(bSelected) {
					return function(oRow) {
						var oTable = oRow.getParent(),
							oMdcTable = oTable.getParent(),
							bIsGridTable = _isGridTable(oMdcTable),
							bRowIsSelected = bIsGridTable
								? oTable.getSelectedIndices.includes(oTable.indexOfRow(oRow))
								: oRow.getSelected();

						return bSelected ? bRowIsSelected : !bRowIsSelected;
					};
				},
				navigated: function(bNavigated) {
					return function(oRow) {
						var bRowIsNavigated;

						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							bRowIsNavigated = oRow.getAggregation("_settings").getNavigated();
						} else {
							bRowIsNavigated = oRow.getNavigated();
						}
						return bNavigated ? bRowIsNavigated : !bRowIsNavigated;
					};
				},
				focused: function() {
					return function(oRow) {
						var aElementsToCheck = [oRow];
						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							aElementsToCheck.push(_getRowNavigationIconOnGridTable(oRow));
						}
						return aElementsToCheck.some(OpaBuilder.Matchers.focused(true));
					};
				},
				highlighted: function(sHighlight) {
					return function(oRow) {
						var sRowHighlight;

						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							sRowHighlight = oRow.getAggregation("_settings").getHighlight();
						} else {
							sRowHighlight = oRow.getHighlight();
						}
						return sHighlight === sRowHighlight;
					};
				},
				states: function(mStateMap) {
					if (!Utils.isOfType(mStateMap, Object)) {
						return OpaBuilder.Matchers.TRUE;
					}
					return FEBuilder.Matchers.match(
						Object.keys(mStateMap).map(function(sProperty) {
							switch (sProperty) {
								case "selected":
									return TableBuilder.Row.Matchers.selected(mStateMap.selected);
								case "focused":
									return TableBuilder.Row.Matchers.focused();
								case "navigated":
									return TableBuilder.Row.Matchers.navigated(mStateMap.navigated);
								case "highlight":
									return TableBuilder.Row.Matchers.highlighted(mStateMap.highlight);
								default:
									return FEBuilder.Matchers.state(sProperty, mStateMap[sProperty]);
							}
						})
					);
				},
				visualGroup: function(iLevel, sTitle) {
					return function(oRow) {
						if (oRow.getMetadata().getName() === "sap.ui.table.Row") {
							return oRow.getLevel() === iLevel && oRow.getTitle() === sTitle;
						} else {
							return false; // Visual grouping not supported in responsive table yet
						}
					};
				}
			},
			Actions: {
				onCell: function(vColumn, vCellAction) {
					return function(oRow) {
						var iColumn = _getCellIndex(vColumn, oRow),
							oCellControl = _getCell(oRow, iColumn);

						// if the cellControl is a FieldWrapper replace it by its active control (edit or display)
						if (oCellControl.isA("sap.fe.core.controls.FieldWrapper")) {
							oCellControl =
								oCellControl.getEditMode() === "Display"
									? oCellControl.getContentDisplay()
									: oCellControl.getContentEdit()[0];
						}
						if (oCellControl.isA("sap.fe.core.controls.ConditionalWrapper")) {
							oCellControl = oCellControl.getCondition() ? oCellControl.getContentTrue() : oCellControl.getContentFalse();
						}

						if (vCellAction.executeOn) {
							vCellAction.executeOn(oCellControl);
						} else {
							vCellAction(oCellControl);
						}
					};
				},
				editCell: function(vColumn, vValue) {
					return TableBuilder.Row.Actions.onCell(
						vColumn,
						new EnterText({
							text: vValue,
							clearTextFirst: true,
							keepFocus: false,
							idSuffix: null,
							pressEnterKey: true
						})
					);
				},
				editCells: function(mColumnValueMap) {
					return Object.keys(mColumnValueMap).map(function(sColumnName) {
						return TableBuilder.Row.Actions.editCell(sColumnName, mColumnValueMap[sColumnName]);
					});
				},
				onCellInlineAction: function(vColumn, vCellAction) {
					return function(oRow) {
						var aButtons = _getButtonsForInlineActions(vColumn, oRow);
						return OpaBuilder.Actions.executor(vCellAction)(aButtons);
					};
				},
				pressInlineAction: function(vColumn) {
					return TableBuilder.Row.Actions.onCellInlineAction(vColumn, OpaBuilder.Actions.press());
				}
			}
		};

		TableBuilder.Matchers = {
			isGridTable: function() {
				return _isGridTable;
			},
			rows: function(vRowMatcher) {
				return function(oMdcTable) {
					// when having an overlay, the table is dirty and the rows do not reflect the actual table state
					if (TableBuilder.Matchers.overlay(true)(oMdcTable)) {
						return [];
					}
					return OpaBuilder.Matchers.aggregation(_getRowAggregationName(oMdcTable), vRowMatcher)(oMdcTable._oTable);
				};
			},
			rowsMatcher: function(vRowMatcher) {
				var fnMatchRows = TableBuilder.Matchers.rows(vRowMatcher);
				return function(oMdcTable) {
					return fnMatchRows(oMdcTable).length > 0;
				};
			},
			columnControl: function(vColumn) {
				return function(oMdcTable) {
					var iColumnIndex = _getColumnIndex(vColumn, oMdcTable),
						oInnerTable = _getInnerTable(oMdcTable);
					return oInnerTable.getColumns()[iColumnIndex];
				};
			},
			column: function(vColumn, mStates) {
				return function(oMdcTable) {
					var iColumnIndex = _getColumnIndex(vColumn, oMdcTable),
						aColumns = Utils.getAggregation(oMdcTable, "columns");
					if (iColumnIndex === -1) {
						// check for non-existing columns 'false' - add 'null' in case there is no column on purpose
						if (mStates && mStates.visible === false) {
							return true;
						}
					} else {
						var oColumn = aColumns[iColumnIndex];
						if (!mStates || FEBuilder.Matchers.match(TableBuilder.Column.Matchers.states(mStates))(oColumn)) {
							return oColumn;
						}
					}
					return false;
				};
			},
			columns: function(mColumnsStatesMaps, bIgnoreColumnState) {
				return function(oMdcTable) {
					return Object.keys(mColumnsStatesMaps).reduce(function(aResult, vColumn) {
						var oColumn = TableBuilder.Matchers.column(
							vColumn,
							bIgnoreColumnState ? undefined : mColumnsStatesMaps[vColumn]
						)(oMdcTable);
						if (oColumn) {
							aResult.push(oColumn === true ? null : oColumn);
						}
						return aResult;
					}, []);
				};
			},
			columnsMatcher: function(mColumnMatchers, bIgnoreColumnState) {
				var fnMatchColumns = TableBuilder.Matchers.columns(mColumnMatchers, bIgnoreColumnState);
				return function(oMdcTable) {
					return fnMatchColumns(oMdcTable).length === Object.keys(mColumnMatchers).length;
				};
			},
			overlay: function(bHasOverlay) {
				if (bHasOverlay === undefined) {
					bHasOverlay = true;
				}
				return function(oMdcTable) {
					oMdcTable = oMdcTable._feMdcTableWrapper || oMdcTable;
					return oMdcTable && oMdcTable._oTable.getShowOverlay() === bHasOverlay;
				};
			},
			state: function(sName, vValue) {
				switch (sName) {
					case "overlay":
						return TableBuilder.Matchers.overlay(vValue);
					default:
						return FEBuilder.Matchers.state(sName, vValue);
				}
			},
			states: function(mStateMap) {
				return FEBuilder.Matchers.states(mStateMap, TableBuilder.Matchers.state);
			}
		};

		TableBuilder.Actions = {};

		return TableBuilder;
	}
);
