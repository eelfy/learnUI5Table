sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/comp/integration/testlibrary/TestUtils",
    "sap/ui/test/OpaBuilder"
], function (Opa5, Press, EnterText, TestUtils, OpaBuilder) {
	"use strict";

	return {
		/**
		 * Opens <code>ValueHelpDialog</code> for an input control with ID <code>sInputId</code>
		 * @param {string} sInputId The ID of the input
		 */
		iOpenValueHelpDialogForInput: function (sInputId) {
			this.waitFor({
				id: sInputId + "-vhi",
				controlType: "sap.ui.core.Icon",
				actions: new Press(),
				errorMessage: "Could not open value help dialog",
				timeout: 15
			});
		},
		/**
		 * Closes <code>ValueHelpDialog</code> for an input control with ID <code>sInputId</code>
		 * @param {string} sInputId The ID of the input
		 */
		iCloseValueHelpDialogForInput: function (sInputId) {
			var sVHD = Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME)
				.valueHelpDialogId;
			this.waitFor({
				id: TestUtils.getValueHelpDialogId(sInputId, sVHD),
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				success: function (oValueHelpDialog) {
					oValueHelpDialog.close();
				},
				errorMessage: "Could not find ValueHelpDialog",
				timeout: 10
			});
		},
        /**
		 * Opens the <code>ValueHelpDialog</code> section "Search and Select"
		 */
		iOpenTabSearchAndSelect: function () {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oControl = oValueHelpDialog._getTabSearchAndSelect();
						return new Press().executeOn(oControl);
					})
					.build()
			);
		},
		/**
		 * Opens the <code>ValueHelpDialog</code> section "Define Conditions"
		 */
		iOpenTabDefineConditions: function () {
			this.waitFor(
				new OpaBuilder()
				.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
				.isDialogElement(true)
				.do(function(oValueHelpDialog){
					var oControl = oValueHelpDialog._getTabDefneConditions();
					return new Press().executeOn(oControl);
				})
				.build()
			);
		},
		/**
		 * Presses the OK button of the <code>ValueHelpDialog</code> for an input with ID <code>sInputId</code>
		 * @param {string} sInputId The ID of the input control
		 */
		iPressValueHelpDialogOKButton: function (sInputId) {
			var sVHD = Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME).valueHelpDialogId;
			var sId = TestUtils.getValueHelpDialogId(sInputId, sVHD);

			this.waitFor(
				new OpaBuilder()
					.hasId(sId)
					.do(function(oValueHelpDialog){
						return new Press().executeOn(oValueHelpDialog._oButtonOk);
					})
					.description("Press ValueHelpDialog OK button")
					.build()
			);
		},
		/**
		 * Presses the Cancel button of the <code>ValueHelpDialog</code> for an input with ID <code>sInputId</code>
		 * @param {string} sInputId The ID of the input control
		 */
		iPressValueHelpDialogCancelButton: function (sInputId) {
			var sVHD = Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME).valueHelpDialogId;
			var sId = TestUtils.getValueHelpDialogId(sInputId, sVHD);

			this.waitFor(
				new OpaBuilder()
					.hasId(sId)
					.do(function(oValueHelpDialog){
						return new Press().executeOn(oValueHelpDialog._oButtonCancel);
					})
					.description("Press ValueHelpDialog OK button")
					.build()
			);
		},
		/**
		 * Presses the Back button of a currently opened <code>ValueHelpDialog</code>
		 * Applicable for mobile devices
		 */
		iPressBackButton: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oButton = oValueHelpDialog._oBackButton;
						if (TestUtils.isPhone() && oButton) {
							oButton.firePress();
						}
					})
					.description("Press the Back button")
					.build()
			);
		},
        /**
         * Creates a new row for search conditions
         */
        iAddNewCondition: function () {
            this.waitFor(
                new OpaBuilder()
                    .hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
                    .isDialogElement(true)
                    .do(function (oValueHelpDialog) {
                        var oFilterPanel = oValueHelpDialog._oFilterPanel;
                        var oConditionPanel = oFilterPanel.getConditionPanel();
                        var length = oConditionPanel._getConditionsCount();
                        var oConditionGrid = oConditionPanel._getConditionsGridAtPosition(
                            length - 1
                        );
                        if (oConditionGrid) {
                            var oButton = oConditionGrid.add;
                            if (oButton.getVisible()) {
                                new Press().executeOn(oButton);
                            }
                        }
                    })
                    .build()
            );
        },
        /**
         * Removes search condition at index <code>nIndex</code>
         * @param {number} nIndex The position index of the condition we want to remove
         */
        iRemoveConditionAtIndex: function (nIndex) {
            this.waitFor(
                new OpaBuilder()
                    .hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
                    .isDialogElement(true)
                    .do(function (oValueHelpDialog) {
                        var oFilterPanel = oValueHelpDialog._oFilterPanel;
                        var oConditionGrid = oFilterPanel
                            .getConditionPanel()
                            ._getConditionsGridAtPosition(nIndex);
                        if (oConditionGrid) {
                            var oButton = oConditionGrid.remove;
                            new Press().executeOn(oButton);
                        }
                    })
                    .build()
            );
        },
        /**
         * Opens the dropdown for selecting an operator of a particular condition
         * @param {number} nIndex The position index of the condition
         */
        iOpenConditionOperations: function (nIndex) {
            this.waitFor(
                new OpaBuilder()
                    .hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
                    .isDialogElement(true)
                    .do(function (oValueHelpDialog) {
                        var oFilterPanel = oValueHelpDialog._oFilterPanel;
                        var oConditionGrid = oFilterPanel
                            .getConditionPanel()
                            ._getConditionsGridAtPosition(nIndex);
                        if (oConditionGrid) {
                            var oSelectControl = oConditionGrid.operation;
                            new Press().executeOn(oSelectControl);
                        }
                    })
                    .build()
            );
        },
        /**
         * Selects an operator with key equal to <code>sOperationKey</code> for condition at position <code>nIndex</code>
         * @param {number} nIndex The condition position
         * @param {string} sOperationKey The key of the operation
         */
        iSelectConditionOperator: function (nIndex, sOperationKey) {
            this.iOpenConditionOperations(nIndex);
            this.waitFor(
                new OpaBuilder()
                    .hasType("sap.m.List")
                    .isDialogElement(true)
                    .mustBeVisible(true)
                    .doOnChildren(
                        OpaBuilder.create()
                            .hasType("sap.ui.core.ListItem")
                            .hasProperties({ key: sOperationKey })
                            .doPress()
                    )
                    .build()
            );
        },
        /**
         * Enters values for condition at position <code>nIndex</code>
         * @param {number} nIndex The position index of the condition
         * @param {string} sValue1 First value
         * @param {string} sValue2 Second value (optional). Applicable for operations with 2 values such as <code>BT</code>
         */
        iEnterConditionValues: function (nIndex, sValue1, sValue2) {
            this.waitFor(
                new OpaBuilder()
                    .hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
                    .isDialogElement(true)
                    .do(function (oValueHelpDialog) {
                        var oFilterPanel = oValueHelpDialog._oFilterPanel;
                        var oConditionGrid = oFilterPanel
                            .getConditionPanel()
                            ._getConditionsGridAtPosition(nIndex);
                        if (oConditionGrid) {
                            var oInput1 = oConditionGrid.value1;
                            new EnterText({ text: sValue1 }).executeOn(oInput1);
                            if (
                                sValue2 &&
                                oConditionGrid.value2 &&
                                oConditionGrid.value2.getVisible()
                            ) {
                                var oInput2 = oConditionGrid.value2;
                                new EnterText({ text: sValue2 }).executeOn(oInput2);
                            }
                        }
                    })
                    .build()
            );
        },
        /**
		 * Enters text in ValueHelpDialog basic search field
		 * @param {string} sText Text to enter in the basic search
		 */
		iEnterSearchText: function (sText) {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar) {
							var oBasicSearch = oFilterBar._oBasicSearchField;
							if (oBasicSearch) {
								return new EnterText({text: sText}).executeOn(oBasicSearch);
							}
						}
					})
					.build()
			);
		},
		/**
		 * Opens the Advanced Search area - applicable for mobile devices
		 */
		iOpenAdvancedSearch: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oLink = oValueHelpDialog._oAdvancedSearchLink;
						if (oLink && oValueHelpDialog._isPhone()) {
							return new Press().executeOn(oLink);
						}
					})
					.build()
			);
		},
		/**
		 * Presses the Go/Search button of the currently opened <code>ValueHelpDialog</code>
		 */
		iPressGoButton: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function (oValueHelpDialog) {
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar) {
							var oButtonGo = oFilterBar._oSearchButton;
							if (oButtonGo) {
								oButtonGo.firePress();
							}
						}
					})
					.build()
			);
		},
		/**
		 * Submits the <code>ValueHelpDialog</code> search
		 */
		iSubmitSearch: function () {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function (oValueHelpDialog) {
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar) {
							oFilterBar.search();
						}
					})
					.build()
			);
		},
		/**
		 * Presses the "Show Filters" button
		 */
		iPressShowFiltersButton: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oButton = oFilterBar._oHideShowButton;
							if (oButton
									&& oButton.getVisible()
									&& oButton.getText() === TestUtils.getTextFromResourceBundle("sap.ui.comp","FILTER_BAR_VH_SHOW_FILTERS")){
								return new Press().executeOn(oButton);
							}
						}
					})
					.description("Press 'Show Filters' button")
					.build()
			);
		},
		/**
		 * Presses the "Hide Filters" button
		 */
		iPressHideFiltersButton: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oButton = oFilterBar._oHideShowButton;
							if (oButton
									&& oButton.getVisible()
									&& oButton.getText() === TestUtils.getTextFromResourceBundle("sap.ui.comp","FILTER_BAR_VH_HIDE_FILTERS")){
								return new Press().executeOn(oButton);
							}
						}
					})
					.description("Press 'Hide Filters' button")
					.build()
			);
		},
		/**
		 * Shows all filters in the <code>ValueHelpDialog</code>. Only a number of filters will be displayed by default
		 * In order to show the rest of the filters a button "Show all filters" has to be pressed
		 */
		iShowAllFilters: function(){
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oButton = oFilterBar.getShowAllFiltersButton();
							if (oButton && oButton.getVisible()){
								return new Press().executeOn(oButton);
							}
						}
					})
					.description("Press 'Show All Filters' button")
					.build()
			);
		},
		/**
		 * Enters a value for particular filter
		 * @param {string} sFilterId The ID of the filter
		 * @param {string} sValue The new value of the filter
		 */
		iSearchByFilterIdAndValue: function (sFilterId, sValue) {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oFilterControl = oFilterBar._getFilterControlById(sFilterId);
							return new EnterText({text: sValue}).executeOn(oFilterControl);
						}
					})
					.description("Search by filter Id and value")
					.build()
			);
		},
		/**
		 * Enters a value for particular filter
		 * @param {string} sFilterName The name of the filter
		 * @param {string} sValue The new value of the filter
		 */
		iSearchByFilterNameAndValue: function (sFilterName, sValue) {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oFilterControl = oFilterBar._determineItemByName(sFilterName);
							return new EnterText({text: sValue}).executeOn(oFilterControl);
						}
					})
					.success(function(){
						this.iSubmitSearch();
					}.bind(this))
					.description("Search by filter name and value")
					.build()
			);
		},
		/**
		 * Enters a value for particular filter
		 * @param {string} nIndex The position index of the filter
		 * @param {string} sValue The new value of the filter
		 */
		iSearchByFilterIndexAndValue: function (nIndex, sValue) {
			this.waitFor(
				new OpaBuilder()
					.hasType("sap.ui.comp.valuehelpdialog.ValueHelpDialog")
					.isDialogElement(true)
					.do(function(oValueHelpDialog){
						var oFilterBar = oValueHelpDialog.getFilterBar();
						if (oFilterBar){
							var oFilterControl = oFilterBar._getFilterControlByIndex(nIndex);
							return new EnterText({text: sValue}).executeOn(oFilterControl);
						}
					})
					.success(function(){
						this.iSubmitSearch();
					}.bind(this))
					.description("Search by filter index and value")
					.build()
			);
		},
		/**
		 * Selects a row from the <code>ValueHelpDialog</code> Items table at particular position
		 * @param {number} nIndex The index of the table row to be selected
		 */
		iSelectItemByIndex: function (nIndex) {
            this.waitFor({
                controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
                success: function (aValueHelpDialogs) {
                    var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					// TODO: sap.ui.table.Table only displays fixed number of rows
					if (oTable.isA("sap.ui.table.Table")) {
                        this.waitFor({
                            controlType: "sap.ui.table.Row",
                            success: function (oRows) {
								if (oTable.getSelectedIndices().indexOf(nIndex) === -1){
									new Press().executeOn(oRows[nIndex].getCells()[0]);
								}
                            },
                            errorMessage: "Did not find row in ValueHelpDialog table",
                            timeout: 10
                        });
                    } else if (oTable.isA("sap.m.Table")) {
                        oTable.getItems()[nIndex].setSelected(true);
                    }
                },
                errorMessage: "Did not find table in ValueHelpDialog",
                timeout: 10
            });
		},
		/**
		 * Deselects a row from the <code>ValueHelpDialog</code> Items table at a particular position
		 * @param {number} nIndex The index of the table row to be deselected
		 */
        iDeselectItemByIndex: function (nIndex) {
            this.waitFor({
                controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
                success: function (aValueHelpDialogs) {
                    var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
                    if (oTable.isA("sap.ui.table.Table")) {
						// TODO: sap.ui.table.Table only displays fixed number of rows
                        this.waitFor({
                            controlType: "sap.ui.table.Row",
                            success: function (oRows) {
								if (nIndex < oTable.getBinding("rows").getLength() &&
									oTable.getSelectedIndices().indexOf(nIndex) > -1 ){
                                    return new Press().executeOn(oRows[nIndex].getCells()[0]);
                                }
                            },
                            errorMessage: "Did not find item in ValueHelpDialog table",
                            timeout: 10
                        });
                    } else if (oTable.isA("sap.m.Table")) {
                        oTable.getItems()[nIndex].setSelected(false);
                    }
                },
                errorMessage: "Did not find table in ValueHelpDialog",
                timeout: 10
            });
		},
		/**
		 * Selects all rows from the <code>ValueHelpDialog</code> Items table
		 * When using {@link sap.m.Table} on mobile devices, only the visible rows will be selected
		 */
		iSelectAllItems: function () {
            this.waitFor({
                controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
                success: function (aValueHelpDialogs) {
                    var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					if (oTable.isA("sap.ui.table.Table")) {
						var $SelectAll = oTable.$("selall");
						if ($SelectAll.attr("aria-checked") === "false"){
							$SelectAll.trigger("click");
						}
					}else if (oTable.isA("sap.m.Table")) {
						var oSelectAllCheckBox = oTable._getSelectAllCheckbox();
						if (!oSelectAllCheckBox.getSelected()){
							return new Press().executeOn(oSelectAllCheckBox);
						}
					}
                },
                errorMessage: "Did not find ValueHelpDialog",
                timeout: 10
            });
		},
		/**
		 * Deselects all rows from the <code>ValueHelpDialog</code> Items table
		 * When using {@link sap.m.Table} on mobile devices, only the visible rows will be deselected
		 */
		iDeselectAllItems: function () {
            this.waitFor({
                controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
                success: function (aValueHelpDialogs) {
                    var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					if (oTable.isA("sap.ui.table.Table")) {
						var $SelectAll = oTable.$("selall");
						if ($SelectAll.attr("aria-checked") === "true"){
							$SelectAll.trigger("click");
						}
					}else if (oTable.isA("sap.m.Table")) {
						var oSelectAllCheckBox = oTable._getSelectAllCheckbox();
						if (oSelectAllCheckBox.getSelected()){
							return new Press().executeOn(oSelectAllCheckBox);
						}
					}
                },
                errorMessage: "Did not find ValueHelpDialog",
                timeout: 10
            });
		}
    };
});