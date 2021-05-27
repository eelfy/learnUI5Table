sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/actions/Press",
		"sap/base/util/deepEqual",
		"sap/ui/comp/integration/testlibrary/TestUtils"
	],
	function (Opa5, Press, deepEqual, TestUtils) {
		"use strict";

		var fnMatchData = function (sProperty, vValue) {
			return function (oCodeEditor) {
				var sValue = oCodeEditor.getValue();
				var oDataValues = sValue ? JSON.parse(sValue) : {};
				var bIsMatching = true;

				if (
					!oDataValues.hasOwnProperty(sProperty) ||
					!deepEqual(vValue, oDataValues[sProperty])
				) {
					bIsMatching = false;
				}

				return bIsMatching;
			};
		};

		Opa5.createPageObjects({
			onTheSmartFieldTypesPage: {
				actions: {
					iExpandVHDFilters: function () {
						return TestUtils.isPhone()
							? this.compTestLibrary.iOpenAdvancedSearch()
							: this.compTestLibrary.iPressShowFiltersButton();
					},
					iOpenVHD: function (sInputId) {
						return this.compTestLibrary.iOpenValueHelpDialogForInput(sInputId);
					},
					iPressTheVHDFilterGoButton: function () {
						return this.compTestLibrary.iPressGoButton();
					},
					iSelectSecondRowInVHDTable: function () {
						return this.compTestLibrary.iSelectItemByIndex(1);
					},
					iEnterTextInSmartField: function (sId, sText, bKeepFocus) {
						return this.compTestLibrary.iEnterTextInSmartField(
							sId,
							sText,
							bKeepFocus
						);
					},
					iEnterValueInUomRelatedField: function (sId, oValue) {
						return this.compTestLibrary.iEnterValueInUomRelatedField(
							sId,
							oValue
						);
					},
					iToggleUomEditMode: function (sId, bEditable) {
						return this.compTestLibrary.iToggleUomEditMode(sId, bEditable);
					},
					iSetSmartFieldControlProperty: function (sId, sProperty, oValue) {
						return this.compTestLibrary.iSetSmartFieldControlProperty(
							sId,
							sProperty,
							oValue
						);
					},
					iSetSmartFormControlProperty: function (sId, sProperty, oValue) {
						return this.compTestLibrary.iSetSmartFormControlProperty(
							sId,
							sProperty,
							oValue
						);
					},
					iSetSmartFieldInnerControlProperties: function (sId, aProperties) {
						return this.compTestLibrary.iSetSmartFieldInnerControlProperties(
							sId,
							aProperties
						);
					},
					iSelectSmartFieldFirstDropdownItem: function (sId) {
						return this.compTestLibrary.iSelectSmartFieldFirstDropdownItem(sId);
					},
					iOpenSuggestionsForSmartField: function (sId) {
						return this.compTestLibrary.iOpenSuggestionsForSmartField(sId);
					},
					iCheckSmartFieldItem: function (sId) {
						return this.compTestLibrary.iCheckSmartFieldItem(sId);
					},
					iUncheckSmartFieldItem: function (sId) {
						return this.compTestLibrary.iUncheckSmartFieldItem(sId);
					},
					iDisableSmartFieldTimePickerMask: function (sId) {
						return this.compTestLibrary.iDisableSmartFieldTimePickerMask(sId);
					},
					iSelectDropdownItemWithKey: function (sId, sKey) {
						return this.compTestLibrary.iSelectSmartFieldItemByKey(sId, sKey);
					},
					iPressButton: function (sId) {
						return this.waitFor({
							id: sId,
							actions: new Press()
						});
					},
					iToggleFormEditMode: function (bEditable) {
						return this.waitFor({
							id: "__xmlview0--form",
							success: function (oForm) {
								if (oForm.getEditable() === bEditable) {
									return;
								}

								this.iWaitForPromise(
									new Promise(function (resolve, reject) {
										oForm.attachEventOnce("editToggled", function () {
											resolve();
										});
									})
								);
								oForm.setEditable(bEditable);
							}
						});
					},
					iChangeFirstItemKeyInInnerControl: function (sId, sText, bKeepFocus) {
						return this.waitFor({
							id: sId,
							success: function (oControl) {
								if (!oControl.getEditable() || !oControl.getFirstInnerControl().isA("sap.m.ComboBox")) {
									return;
								}
								oControl.getFirstInnerControl().getFirstItem().setKey(sText);
							}
						});
					}
				},
				assertions: {
					iShouldSeeValueHelpDialogWithFiltersAndRows: function (
						nFiltersCount,
						nRowsCount
					) {
						this.compTestLibrary.iCheckFilterBarDisplaysNFilters(nFiltersCount);
						this.compTestLibrary.iCheckItemsCountEqualTo(nRowsCount);
					},
					iShouldSeeValueHelpDialogWithTitle: function (sTitle) {
						return this.compTestLibrary.iCheckValuHelpDialogHasTitle(sTitle);
					},
					iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndValue(
							sId,
							oValue
						);
					},
					iShouldSeeSmartFieldWithIdAndBindingValue: function (sId, oValue) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndBindingValue(
							sId,
							oValue
						);
					},
					iShouldSeeSmartFieldWithIdAndDateTimeValue: function (sId, oValue) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndDateTimeValue(
							sId,
							oValue
						);
					},
					iShouldSeeSmartFieldWithValueState: function (sId, sState) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithValueState(
							sId,
							sState
						);
					},
					iShouldSeeSmartFieldWithValueStateText: function (sId, sText) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithValueStateText(
							sId,
							sText
						);
					},
					iShouldSeeSmartFiledPopupFiltered: function (sId, nItemsCount) {
						return this.compTestLibrary.iShouldSeeSmartFiledPopupFiltered(
							sId,
							nItemsCount
						);
					},
					iShouldSeeSmartFieldWithEmptyIndicator: function (sId) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithEmptyIndicator(
							sId
						);
					},
					iShouldNotSeeSmartFieldWithEmptyIndicator: function (sId) {
						return this.compTestLibrary.iShouldNotSeeSmartFieldWithEmptyIndicator(
							sId
						);
					},
					iShouldSeeUomFieldWithShrinkFactorOf: function (sId, iShrinkFactor) {
						return this.compTestLibrary.iShouldSeeUomFieldWithShrinkFactorOf(
							sId,
							iShrinkFactor
						);
					},
					iShouldSeeSmartFieldWithDomAttribute: function (
						sId,
						sDomAttribute,
						sValue
					) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithDomAttribute(
							sId,
							sDomAttribute,
							sValue
						);
					},
					iShouldSeeSmartFieldWithoutDomAttribute: function (
						sId,
						sDomAttribute
					) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithoutDomAttribute(
							sId,
							sDomAttribute
						);
					},
					iCheckFieldContainsToken: function (sId, sTokenText) {
						return this.compTestLibrary.iCheckFieldContainsTokenAtPosition(
							sId,
							sTokenText,
							0
						);
					},
					iCheckFieldContainsTokenAtPosition: function (
						sId,
						sTokenText,
						nIndex
					) {
						return this.compTestLibrary.iCheckFieldContainsTokenAtPosition(
							sId,
							sTokenText,
							nIndex
						);
					},
					iCheckValueHelpDialogBasicSearchTextEqualsTo: function (sText) {
						return this.compTestLibrary.iCheckValueHelpDialogBasicSearchTextEqualsTo(
							sText
						);
					},
					iCheckVHDFilterBarHasFilterWithLabelAndValue: function (
						sFilterLabel,
						sValue
					) {
						return this.compTestLibrary.iCheckFilterBarHasFilterWithLabelAndValue(
							sFilterLabel,
							sValue
						);
					},
					iShouldSeeSmartFieldWithIdAndInnerControlValue: function (
						sId,
						sValue
					) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndInnerControlValue(
							sId,
							sValue
						);
					},
					iShouldSeeGroupElementWithCSSDisplay: function (
						sGroupId,
						sFieldId,
						sDisplay
					) {
						return this.compTestLibrary.iShouldSeeGroupElementWithCSSDisplay(
							sGroupId,
							sFieldId,
							sDisplay
						);
					},
					iShouldSeeData: function (sProperty, oValue) {
						return this.waitFor({
							controlType: "sap.ui.codeeditor.CodeEditor",
							id: "__xmlview0--outputAreaChangedData",
							matchers: fnMatchData(sProperty, oValue),
							success: function (oCodeEditor) {
								Opa5.assert.ok(
									oCodeEditor.getValue(),
									"Data property " + sProperty + " has value " + oValue + "!"
								); // tested in matcher
							},
							errorMessage:
								"Data property " + sProperty + " has not value " + oValue + "!"
						});
					}
				}
			}
		});
	}
);
