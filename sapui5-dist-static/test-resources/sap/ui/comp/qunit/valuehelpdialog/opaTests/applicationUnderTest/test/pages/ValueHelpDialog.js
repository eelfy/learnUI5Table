sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/comp/integration/testlibrary/TestUtils"
	],
	function (Opa5, TestUtils) {
		"use strict";

		Opa5.createPageObjects({
			onTheValueHelpDialogPage: {
				actions: {
					iOpenValueHelpDialogForInput: function(sInputId){
						return this.compTestLibrary.iOpenValueHelpDialogForInput(sInputId);
					},
					iCloseValueHelpDialogForInput: function (sInputId){
						return this.compTestLibrary.iCloseValueHelpDialogForInput(sInputId);
					},
					iOpenTabSearchAndSelect: function () {
						return this.compTestLibrary.iOpenTabSearchAndSelect();
					},
					iOpenTabDefineConditions: function () {
						return this.compTestLibrary.iOpenTabDefineConditions();
					},
					iPressValueHelpDialogOKButton: function (sInputId) {
						return this.compTestLibrary.iPressValueHelpDialogOKButton(sInputId);
					},
					iPressValueHelpDialogCancelButton: function (sInputId) {
						return this.compTestLibrary.iPressValueHelpDialogCancelButton(sInputId);
					},
					iPressBackButton: function(){
						return this.compTestLibrary.iPressBackButton();
					},
					iAddNewCondition: function () {
						return this.compTestLibrary.iAddNewCondition();
					},
					iRemoveConditionAtIndex: function (nIndex) {
						return this.compTestLibrary.iRemoveConditionAtIndex(nIndex);
					},
					iOpenConditionOperations: function (nIndex) {
						return this.compTestLibrary.iOpenConditionOperations(nIndex);
					},
					iSelectConditionOperator: function (nIndex, sOperationKey) {
						return this.compTestLibrary.iSelectConditionOperator(nIndex, sOperationKey);
					},
					iEnterConditionValues: function (nIndex, sValue1, sValue2) {
						return this.compTestLibrary.iEnterConditionValues(nIndex, sValue1, sValue2);
					},
					iEnterSearchText: function (sText) {
						return this.compTestLibrary.iEnterSearchText(sText);
					},
					iOpenAdvancedSearch: function(){
						return this.compTestLibrary.iOpenAdvancedSearch();
					},
					iPressGoButton: function(){
						return this.compTestLibrary.iPressGoButton();
					},
					iSubmitSearch: function () {
						return this.compTestLibrary.iSubmitSearch();
					},
					iSearchByText: function (sText) {
						this.compTestLibrary.iEnterSearchText(sText);
						this.compTestLibrary.iSubmitSearch();
					},
					iPressShowFiltersButton: function(){
						return this.compTestLibrary.iPressShowFiltersButton();
					},
					iPressHideFiltersButton: function(){
						return this.compTestLibrary.iPressHideFiltersButton();
					},
					iShowFilters: function(){
						return TestUtils.isPhone() ?
							this.compTestLibrary.iOpenAdvancedSearch() :
							this.compTestLibrary.iPressShowFiltersButton();
					},
					iHideFilters: function(){
						return TestUtils.isPhone() ?
							this.compTestLibrary.iPressGoButton() :
							this.compTestLibrary.iPressHideFiltersButton();
					},
					iShowAllFilters: function(){
						return this.compTestLibrary.iShowAllFilters();
					},
					iSearchByFilterIdAndValue: function (sFilterId, sValue) {
						return this.compTestLibrary.iSearchByFilterIdAndValue(sFilterId, sValue);
					},
					iSearchByFilterNameAndValue: function (sFilterName, sValue) {
						return this.compTestLibrary.iSearchByFilterNameAndValue( sFilterName, sValue);
					},
					iSearchByFilterIndexAndValue: function (nIndex, sValue) {
						return this.compTestLibrary.iSearchByFilterIndexAndValue(nIndex, sValue);
					},
					iSelectItemByIndex: function (nIndex) {
						return this.compTestLibrary.iSelectItemByIndex(nIndex);
					},
                    iDeselectItemByIndex: function (nIndex) {
						return this.compTestLibrary.iDeselectItemByIndex(nIndex);
					},
					iSelectAllItems: function () {
                        return this.compTestLibrary.iSelectAllItems();
					},
					iDeselectAllItems: function () {
						return this.compTestLibrary.iDeselectAllItems();
					},
					iRemoveTokenByTextFromValueHelpDialog: function(sTokenText){
						return this.compTestLibrary.iRemoveTokenByTextFromValueHelpDialog(sTokenText);
					},
					iRemoveTokenByIndexFromValueHelpDialog: function(nIndex){
					   return  this.compTestLibrary.iRemoveTokenByIndexFromValueHelpDialog(nIndex);
					},
					iRemoveAllTokensFromValueHelpDialog: function(){
						return this.compTestLibrary.iRemoveAllTokensFromValueHelpDialog();
					}
				},
				assertions: {
					iCheckValueHelpDialogIsOpenedForInput: function (sInputId) {
						return this.compTestLibrary.iCheckValueHelpDialogIsOpened(sInputId);
					},
					iCheckValueHelpDialogIsNotOpenedForInput: function(sInputId){
						return this.compTestLibrary.iCheckValueHelpDialogIsNotOpened(sInputId);
					},
					iCheckConditionsCountEqualTo: function (nCount) {
						return this.compTestLibrary.iCheckConditionsCountEqualTo(nCount);
					},
					iCheckConditionsOperatorAtPositionIsMatching: function (
						nIndex,
						sOperatorKey
					) {
						return this.compTestLibrary.iCheckConditionsOperatorAtPositionIsMatching(nIndex, sOperatorKey);
					},
					iCheckConditionsValuesAtPositionEqualTo: function (
						nIndex,
						sValue1,
						sValue2
					) {
						return this.compTestLibrary.iCheckConditionsValuesAtPositionEqualTo(nIndex, sValue1, sValue2);
					},
					iCheckConditionsTabTitleContainsCount: function(nCount) {
						return this.compTestLibrary.iCheckConditionsTabTitleContainsCount(nCount);
					},
					iCheckFilterBarDisplaysAllFilters: function () {
						return this.compTestLibrary.iCheckFilterBarDisplaysAllFilters();
					},
					iCheckFilterBarDisplaysNFilters: function (nCount) {
						return this.compTestLibrary.iCheckFilterBarDisplaysNFilters(nCount);
					},
					iCheckFilterBarHasFilterWithLabel: function (sFilterLabel) {
						return this.compTestLibrary.iCheckFilterBarHasFilterWithLabel(sFilterLabel);
					},
					iCheckFilterBarHasFilterByName: function (sFilterName) {
						return this.compTestLibrary.iCheckFilterBarHasFilterByName(sFilterName);
					},
					iCheckFilterBarIsExpanded: function(){
						return this.compTestLibrary.iCheckValuHelpDialogFiltersAreExpanded();
					},
					iCheckFilterBarIsCollapsed: function(){
						return this.compTestLibrary.iCheckValuHelpDialogFiltersAreCollapsed();
					},
					iCheckItemsCountEqualTo: function (nCount) {
						return this.compTestLibrary.iCheckItemsCountEqualTo(nCount);
					},
					iCheckItemIsSelected: function (nIndex) {
						return this.compTestLibrary.iCheckItemIsSelected(nIndex);
					},
					iCheckItemIsNotSelected: function (nIndex) {
						return this.compTestLibrary.iCheckItemIsNotSelected(nIndex);
					},
					iCheckSearchAndSelectTabTitleContainsCount: function(nCount) {
						return this.compTestLibrary.iCheckSearchAndSelectTabTitleContainsCount(nCount);
					},
					iCheckTokensCountInValueHelpDialogEqualsTo: function(nCount){
						return this.compTestLibrary.iCheckTokensCountInValueHelpDialogEqualsTo(nCount);
					},
					iCheckTokenizerInValueHelpDialogContainsToken: function(sTokenText){
						return this.compTestLibrary.iCheckTokenizerInValueHelpDialogContainsToken(sTokenText);
					},
					iCheckTokenizerInValueHelpDialogContainsTokens: function(aTokens){
						return this.compTestLibrary.iCheckTokenizerInValueHelpDialogContainsTokens(aTokens);
					}
				}
			}
		});
	}
);
