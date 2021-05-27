sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/comp/integration/testlibrary/TestUtils"
], function (Opa5, TestUtils) {
	"use strict";

	return {
		/**
		 * Checks if the <code>ValueHelpDialog</code> for an input control with ID <code>sInputId</code> is open
		 * @param {string} sInputId The ID of the input control
		 */
		iCheckValueHelpDialogIsOpened: function (sInputId) {
			var sVHD = Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME)
				.valueHelpDialogId;
			this.waitFor({
				id: TestUtils.getValueHelpDialogId(sInputId, sVHD),
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				success: function (oValueHelpDialog) {
					Opa5.assert.ok(
						oValueHelpDialog,
						"ValueHelpDialog should be visible and opened"
					);
				},
				errorMessage: "Did not find the ValueHelpDialog",
				timeout: 15
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> for an input control with ID <code>sInputId</code> is not open
		 * @param {string} sInputId The ID of the input control
		 */
		iCheckValueHelpDialogIsNotOpened: function(sInputId){
			var sVHD = Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME)
				.valueHelpDialogId;

			this.waitFor({
				check: function () {
					var oValueHlepDialog = sap.ui.getCore().byId(TestUtils.getValueHelpDialogId(sInputId, sVHD));
					return !oValueHlepDialog;
				},
				success: function () {
					Opa5.assert.ok(true, "The ValueHelpDialog is not present");
				},
				errorMessage: "The ValueHelpDialog is present",
				timeout: 15
			});
		},
        /**
		 * Checks that the number of conditions is equal to <code>nCount</code>
		 * @param {number} nCount The number against which we want to perform the check
		 */
		iCheckConditionsCountEqualTo: function (nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterPanel = oValueHelpDialog._oFilterPanel;
					var oConditionPanel = oFilterPanel.getConditionPanel();
					var length = oConditionPanel._getConditionsCount();

					Opa5.assert.strictEqual(
						length,
						nCount,
						"The number of conditions should be " + nCount
					);
				},
				errorMessage: "Could not find ValueHelpDialog"
			});
		},
		/**
		 * Checks that the condition at position <code>nIndex</code> has selected operator with key equal to <code>sOperator</code>
		 * @param {number} nIndex The position index of the condition
		 * @param {string} sOperatorKey The operator key
		 */
		iCheckConditionsOperatorAtPositionIsMatching: function (
			nIndex,
			sOperatorKey
		) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterPanel = oValueHelpDialog._oFilterPanel;
					var oConditionGrid = oFilterPanel
						.getConditionPanel()
						._getConditionsGridAtPosition(nIndex);
					var oSelect = oConditionGrid.operation;
					var sSelectedOperatorKey = oSelect.getSelectedItem().getKey();

					Opa5.assert.strictEqual(
						sSelectedOperatorKey,
						sOperatorKey,
						"The selected operator for condition at position '" + nIndex + "' should be " + sOperatorKey
					);
				},
				errorMessage: "Could not find ValueHelpDialog"
			});
		},
		/**
		 * Checks that the values of a condition at position <code>nIndex</code> are <code>sValue1</code> and <code>sValue2</code>
		 * @param {number} nIndex The position index of the condition
		 * @param {string} sValue1 First value
		 * @param {string} sValue2 Second value (optional)
		 */
		iCheckConditionsValuesAtPositionEqualTo: function (
			nIndex,
			sValue1,
			sValue2
		) {
            this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterPanel = oValueHelpDialog._oFilterPanel;
					var oConditionGrid = oFilterPanel
						.getConditionPanel()
                        ._getConditionsGridAtPosition(nIndex);

					var oInput1 = oConditionGrid.value1;
					var oInput2 =  oConditionGrid.value2;

					Opa5.assert.strictEqual(
						oInput1.getValue(),
						sValue1,
						"The value for condition at position '" + nIndex + "' should be " + sValue1
                    );

                    if (oInput2.getVisible()) {
                        Opa5.assert.strictEqual(
                            oInput2.getValue(),
                            sValue2,
                            "The second value for condition at position '" + nIndex + "' should be " + sValue2
                        );
                    }
				},
				errorMessage: "Could not find ValueHelpDialog"
			});
		},
		/**
		 * Checks that the title of the conditions tab contains a number equal to <code>nCount</code>
		 * @param {number} nCount The number to check against
		 */
		iCheckConditionsTabTitleContainsCount: function(nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oTabConditions = oValueHelpDialog._getTabDefneConditions();
					var sText = oTabConditions.getText();
					var sTranslation = TestUtils.getTextFromResourceBundle("sap.ui.comp","VALUEHELPDLG_RANGES", [nCount]);
					if (nCount === 0) {
						sTranslation = TestUtils.getTextFromResourceBundle("sap.ui.comp","VALUEHELPDLG_RANGES").replace("({0})", "");
					}
					Opa5.assert.strictEqual(sText, sTranslation, "Conditions tab text is not correct");
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 5
			});
        },
        /**
		 * Checks that the <code>ValueHelpDialog</code> filter bar displays all filters
		 */
		iCheckFilterBarDisplaysAllFilters: function () {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();

					Opa5.assert.ok(oFilterBar.getFilterBarExpanded(),"FilterBar should be expanded");

					var nTotalItemsCount = oFilterBar.getFilterGroupItems().length;
					var nRenderedFiltersCount = oFilterBar._oBasicAreaLayout
						.getContent()
						.length;

					Opa5.assert.equal(
						nRenderedFiltersCount,
						nTotalItemsCount,
						"All filters should be displayed"
					);
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 10
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> filter bar displays only <code>nCount</code> filters
		 * @param {number} nCount The number of filyers to be displayed
		 */
		iCheckFilterBarDisplaysNFilters: function (nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					Opa5.assert.ok(oFilterBar.getFilterBarExpanded(),"FilterBar should be expanded");

					var nRenderedFiltersCount = oFilterBar._oBasicAreaLayout.getContent().length;

					Opa5.assert.equal(
						nRenderedFiltersCount,
						nCount,
						"FilterBar should display only " + nCount + " filters"
					);
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 10
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> filters contain a filter with particular label text
		 * @param {string} sFilterLabel The label text of a filter
		 */
		iCheckFilterBarHasFilterWithLabel: function (sFilterLabel) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					var oControl = oFilterBar._getFilterControlByLabel(sFilterLabel);

					Opa5.assert.ok(
						!!oControl,
						"FilterBar should contain filter with label " + sFilterLabel
					);
				},
				errorMessage: "Cannot find ValueHelpDialog",
				timeout: 10
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> filters contain a filter with particular name
		 * @param {string} sFilterName The name of the filter
		 */
		iCheckFilterBarHasFilterByName: function (sFilterName) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					var oControl = oFilterBar._determineItemByName(sFilterName);

					Opa5.assert.ok(
						!!oControl,
						"FilterBar should contain filter with name " + sFilterName
					);
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 10
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> filter bar has a field with label and value
		 * @param {string} sFilterLabel The label of the filter field
		 * @param {string} sValue The value of the filter field
		 */
		iCheckFilterBarHasFilterWithLabelAndValue: function (sFilterLabel, sValue) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					var oControl = oFilterBar._getFilterControlByLabel(sFilterLabel);

					Opa5.assert.ok(
						!!oControl,
						"FilterBar should contain filter with label " + sFilterLabel
					);
					Opa5.assert.equal(oControl.getValue(), sValue, "Filter with label '" + sFilterLabel + "' should have value " + sValue);
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 10
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> Items table contain a total of <code>nCount</code> items (including the hidden ones)
		 * @param {number} nCount The number of items
		 */
		iCheckItemsCountEqualTo: function (nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					var nItemsCount = 0;
					if (oTable.isA("sap.ui.table.Table")) {
						// N.B: oTable.getRows() will return only the visible rows of the table!
						nItemsCount = oTable.getBinding("rows").getLength();
					} else if (oTable.isA("sap.m.Table")){
						nItemsCount = oTable.getBinding("items").getLength();
					}
					Opa5.assert.equal(
						nItemsCount,
						nCount,
						"Items count should be " + nCount
					);
				}
			});
		},
		/**
		 * Checks that the row of the <code>ValueHelpDialog</code> Items table at position <code>nIndex</code> is slected
		 * @param {number} nIndex The row number
		 */
		iCheckItemIsSelected: function (nIndex) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					var bIsSelected = false;
					if (oTable.isA("sap.ui.table.Table")) {
						bIsSelected = oTable.getSelectedIndices().indexOf(nIndex) > -1;
					} else if (oTable.isA("sap.m.Table")){
						// getItems() only returns the first page of the list!
						// The problem is that the selectAll checkbox also marks only the first page selected
						if (nIndex < oTable.getItems().length){
							bIsSelected = oTable.getItems()[nIndex].isSelected();
						}
					}
					Opa5.assert.ok(
						bIsSelected,
						"Item on position " + nIndex + " should be selected!"
					);
				}
			});
		},
		/**
		 * Checks that the row of the <code>ValueHelpDialog</code> Items table at position <code>nIndex</code> is not selected
		 * @param {number} nIndex The row number
		 */
		iCheckItemIsNotSelected: function (nIndex) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oTable = oValueHelpDialog.getTable();
					var bNotSelected = true;
					if (oTable.isA("sap.ui.table.Table")) {
						bNotSelected = oTable.getSelectedIndices().indexOf(nIndex) === -1;
					} else if (oTable.isA("sap.m.Table")){
						if (nIndex < oTable.getItems().length){
							bNotSelected = !oTable.getItems()[nIndex].isSelected();
						}
					}
					Opa5.assert.ok(
						bNotSelected,
						"Item on position " + nIndex + " should not be selected!"
					);
				}
			});
		},
		/**
		 * Checks that the name of the tab "Search and Select" contains count of the selected table items
		 * @param {number} nCount The number of selected items
		 */
		iCheckSearchAndSelectTabTitleContainsCount: function(nCount) {
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function (aValueHelpDialogs) {
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oTabSearchAndSelect = oValueHelpDialog._getTabSearchAndSelect();
					var sText = oTabSearchAndSelect.getText();
					var sTranslation = TestUtils.getTextFromResourceBundle("sap.ui.comp", "VALUEHELPDLG_ITEMSTABLE_SELECT", [nCount]);
					if (nCount === 0) {
						sTranslation = TestUtils.getTextFromResourceBundle("sap.ui.comp", "VALUEHELPDLG_ITEMSTABLE_SELECT").replace("({0})", "");
					}
					Opa5.assert.strictEqual(sText, sTranslation, "Search and Select tab text is not correct");
				},
				errorMessage: "Can not find ValueHelpDialog",
				timeout: 5
			});
		},
		/**
		 * Checks that <code>ValueHelpDialog</code> has title <code>sTitle</code>
		 * @param {string} sTritle The title of check for
		 */
		iCheckValuHelpDialogHasTitle: function(sTritle){
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function(aValueHelpDialogs){
					var oValueHelpDialog = aValueHelpDialogs[0];
					Opa5.assert.strictEqual(oValueHelpDialog.getTitle(), sTritle, "The ValueHelpDialog has the correct title");
				}
			});
		},
		/**
		 * Checks that <code>ValueHelpDialog</code> filters area is expanded
		 */
		iCheckValuHelpDialogFiltersAreExpanded: function(){
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function(aValueHelpDialogs){
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					Opa5.assert.ok(oFilterBar.getFilterBarExpanded(), "The ValueHelpDialog filters are expanded");
				}
			});
		},
		/**
		 * Checks that <code>ValueHelpDialog</code> filters area is collapsed
		 */
		iCheckValuHelpDialogFiltersAreCollapsed: function(){
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function(aValueHelpDialogs){
					var oValueHelpDialog = aValueHelpDialogs[0];
					var oFilterBar = oValueHelpDialog.getFilterBar();
					Opa5.assert.ok(!oFilterBar.getFilterBarExpanded(), "The ValueHelpDialog filters are collapsed");
				}
			});
		},
		/**
		 * Checks that the <code>ValueHelpDialog</code> basic search has text <code>sText</code>
		 * @param {string} sText The text to check
		 */
		iCheckValueHelpDialogBasicSearchTextEqualsTo: function(sText){
			this.waitFor({
				controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
				searchOpenDialogs: true,
				success: function(aValueHelpDialogs){
					var oValueHelpDialog = aValueHelpDialogs[0];
					Opa5.assert.equal(oValueHelpDialog.getBasicSearchText(), sText, "ValueHelpDialog basic search text is correct!");
				}
			});
		}
    };
});