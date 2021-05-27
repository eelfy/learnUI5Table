/* global QUnit */

QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/core/ValueState"
], function (
	Opa5,
	opaTest,
	Press,
	EnterText,
	PropertyStrictEquals,
	ValueState
) {
	"use strict";

	var oRB;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		enabled: false,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
					)).then(function () {
						// Cache resource bundle URL
						oRB = Opa5.getWindow().sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
					});
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			}
		}),
		actions: new Opa5({
			iPressTheAdaptFiltersGoButton: function () {
				return this.waitFor({
					id: "smartFilterBar-btnGoFilterDialog",
					searchOpenDialogs: true,
					actions: new Press()
				});
			},
			iPressTheRestoreButton: function () {
				return this.waitFor({
					id: "smartFilterBar-btnRestore",
					controlType: "sap.m.Button",
					actions: new Press(),
					errorMessage: "Did not find the restore button"
				});
			},
			iPressTheErrorDialogCloseButton: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					actions: new Press(),
					searchOpenDialogs: true,
					matchers: new PropertyStrictEquals({
						name: "text",
						value: "Close"
					})
				});
			},
			iPressTheFilterGoButton: function () {
				return this.waitFor({
					id: "smartFilterBar-btnGo",
					controlType: "sap.m.Button",
					actions: new Press(),
					errorMessage: "Did not find the button 'Go'"
				});
			},
			iPressSearchFieldIconButton:function (sId) {
				return this.waitFor({
					id: sId,
					controlType: "sap.m.Button",
					actions: new Press(),
					searchOpenDialogs: true
				});
			},
			iPressValueHelpIcon: function(sFieldID) {
				return this.waitFor({
					id: sFieldID,
					controlType: "sap.ui.core.Icon",
					actions: new Press(),
					errorMessage: "Did not find the Value help with ID" + sFieldID
				});
			},
			iEnterStringInFiled: function (sFieldID, sString, sErrorMessage, bKeepFocus) {
				return this.waitFor({
					id: sFieldID,
					actions: new EnterText({
						text: sString,
						keepFocus: !!bKeepFocus
					}),
					errorMessage: sErrorMessage ? sErrorMessage : "Did not find the field"
				});
			},
			iNavigateToTheDefineConditionsTab: function () {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					success: function (aDialogs) {
						aDialogs[0]._updateView("DESKTOP_CONDITIONS_VIEW");
					}
				});
			},
			iSelectOperation: function (sOperation, bExclude) {
				return this.waitFor({
					controlType: "sap.m.ComboBox",
					success: function (aControls) {
						// First control should be the include operations select and second the exclude
						aControls[bExclude ? 1 : 0].setSelectedKey(sOperation).fireEvent("change");
					},
					searchOpenDialogs: true
				});
			},
			iPressTheVHDOKButton: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: function (oControl) {
						return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === sap.m.ButtonType.Emphasized;
					},
					actions: new Press(),
					searchOpenDialogs: true
				});
			},
			iPressTheVHDCancelButton: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: function (oControl) {
						return oControl.getText() === oRB.getText("VALUEHELPDLG_CANCEL");
					},
					actions: new Press(),
					searchOpenDialogs: true
				});
			},
			iOpenTheVHD: function (sControlID) {
				return this.waitFor({
					id: sControlID + "-vhi",
					controlType: "sap.ui.core.Icon",
					actions: new Press()
				});
			},
			iOpenTheDropdown: function () {
				return this.waitFor({
					controlType: "sap.m.P13nConditionPanel",
					searchOpenDialogs: true,
					success: function (aConditionPanels) {
						var oConditionPanel = aConditionPanels[0],
							aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
								return oControl.isA("sap.ui.layout.Grid");
							}),
							oComboBox = aGrids[1].findAggregatedObjects(true, function (oControl) {
								// Heuristics: the first sap.m.ComboBox control in the condition panel is the operations select
								return oControl.isA("sap.m.ComboBox") && oControl.getItemByText("Include");
							})[0];
						oComboBox.open();
					}
				});
			},
			iChangeTheCondition: function (sNewCondition, bExclude, iCondition) {
				if (iCondition === undefined) {
					iCondition = 0;
				}

				return this.waitFor({
					controlType: "sap.m.P13nConditionPanel",
					searchOpenDialogs: true,
					success: function (aConditionPanels) {
						var oItem,
							oConditionPanel = aConditionPanels[0],
							aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
								return oControl.isA("sap.ui.layout.Grid");
							}),
							oComboBox = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
								// Heuristics: the first sap.m.ComboBox control in the condition panel is the operations select
								return oControl.isA("sap.m.ComboBox") && oControl.getItemByText("Include");
							})[0];
						oComboBox.open();
						oItem = oComboBox._getList().findAggregatedObjects(false, function (oItem) {
							return oItem.mProperties && oItem.mProperties.title === sNewCondition;
						})[0];
						oItem.$().trigger("tap");
					}
				});
			},
			iEnterTextInConditionField: function(bExclude, iCondition, sText1, sText2){
				if (iCondition === undefined) {
					iCondition = 0;
				}

				return this.waitFor({
					controlType: "sap.m.P13nConditionPanel",
					searchOpenDialogs: true,
					success: function (aConditionPanels) {
						var oConditionPanel = aConditionPanels[0],
							aGrids = oConditionPanel.findAggregatedObjects(true, function (oControl) {
								return oControl.isA("sap.ui.layout.Grid");
							}),
							aInputs = aGrids[iCondition + 1].findAggregatedObjects(true, function (oControl) {
								// Heuristics find input fields
								return oControl.isA("sap.m.Input");
							});

						new EnterText({
							text: sText1
						}).executeOn(aInputs[0]);

						if (aInputs[1]) {
							new EnterText({
								text: sText2
							}).executeOn(aInputs[1]);
						}
					}
				});
			},
			iPressTheFilterAddButton: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					searchOpenDialogs: true,
					matchers: [
						new PropertyStrictEquals({
							name: "tooltip",
							value: "Add Condition"
						}),
						new PropertyStrictEquals({
							name: "text",
							value: "Add"
						})
					],
					success: function (aButtons) {
						new Press().executeOn(aButtons[0]);
					}
				});
			},
			iOpenTheAdaptFiltersDialog: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					id: "smartFilterBar-btnFilters",
					actions: new Press()
				});
			},
			iExpandVHDFilters: function (sControlID) {
				return this.waitFor({
					controlType: "sap.m.Button",
					id: sControlID + "-valueHelpDialog-smartFilterBar-btnShowHide",
					searchOpenDialogs: true,
					actions: new Press()
				});
			}
		}),
		assertions: new Opa5({
			theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
				return this.waitFor({
					id: "outputAreaUrl",
					success: function (oText) {
						Opa5.assert.strictEqual(
							oText.getText(),
							sRequestURL,
							sErrorMessage ? sErrorMessage : "Request URL should match"
						);
					}
				});
			},
			theFiltersShouldMatch: function (sFilters, sErrorMessage) {
				return this.waitFor({
					id: "outputAreaFilters",
					success: function (oText) {
						Opa5.assert.strictEqual(
							oText.getText(),
							sFilters,
							sErrorMessage ? sErrorMessage : "Filters should match"
						);
					}
				});
			},
			theErrorDialogIsOpen: function () {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true,
					success: function (aDialogs) {
						var oDialog = aDialogs[0];

						Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
						// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
						// 	"Error dialog title should match");
						Opa5.assert.strictEqual(
							oDialog.getContent()[0].getText(),
							oRB.getText("VALIDATION_ERROR_MESSAGE"), "Error message in dialog should match"
						);
					},
					errorMessage: "did not find the filters dialog",
					timeout: 15
				});
			},
			theWarningDialogIsOpen: function () {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true,
					success: function (aDialogs) {
						var oDialog = aDialogs[1];

						Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Warning Dialog should be open');

						Opa5.assert.strictEqual(
							oDialog.getTitle(),
							oRB.getText("VALUEHELPDLG_SELECTIONFAILEDLOADTITLE"), "Warning message in dialog should match"
						);
					},
					errorMessage: "did not find the warning filters dialog",
					timeout: 15
				});
			},
			thereIsNoEmptyOperation: function (sControl, bExclude) {
				return this.waitFor({
					controlType: "sap.m.ComboBox",
					searchOpenDialogs: true,
					success: function (aControls) {
						var sOperation = bExclude ? "NotEmpty" : "Empty";
						Opa5.assert.strictEqual(
							!!aControls[0].findItem("key", sOperation),
							false,
							"There is no Empty operation in " + (bExclude ? "include" : "exclude") + " operations select for " + sControl
						);
					}
				});
			},
			setCountableTypeToModule: function (sDefaultCountModelType) {
				return this.waitFor({
					success: function () {
						Opa5.getWindow().jQuery("#__xmlview0").control(0).getModel().setDefaultCountMode(sDefaultCountModelType);
					},
					errorMessage: "Did not find the view"
				});
			},
			iShouldSeeValueHelpDialog: function (sId, iBaseSearchFilters, iRows) {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					id: sId,
					success: function (oVHD) {
						var sBasicSearchText = oVHD.getBasicSearchText(),
							aContexts = oVHD.getTable().getBinding("rows").getCurrentContexts();
						Opa5.assert.equal(sBasicSearchText, iBaseSearchFilters, "The ValueHelpDialog " + sId + " contains the correct base search filter");
						Opa5.assert.equal(aContexts.length, iRows, "The ValueHelpDialog " + sId + " contains the correct number of Rows");
					}
				});
			},
			iShouldSeeIncludAndExcludeGroupHeaders: function (sIncludeText, sExcludeText) {
				return this.waitFor({
					controlType: "sap.m.GroupHeaderListItem",
					success: function (aItems) {
						Opa5.assert.equal(aItems.length, 2, "There should be only two GroupHeaderListItems");
						Opa5.assert.equal(aItems[0].getTitle(), sIncludeText, "The first GroupHeaderListItem is 'Include'");
						Opa5.assert.equal(aItems[1].getTitle(), sExcludeText, "The second GroupHeaderListItem is 'Exclude'");
					}
				});
			},
			iShouldSeeValueHelpDialogWithoutMatchingItsTableData: function (sId, sTitle) {
				return this.waitFor({
					controlType: "sap.ui.comp.valuehelpdialog.ValueHelpDialog",
					id: sId,
					success: function (oVHD) {
						var sVHDTitle = oVHD.getTitle();
						Opa5.assert.equal(sVHDTitle, sTitle, "The ValueHelpDialog " + sId + " have the correct title");
					}
				});
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("Default settings", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");

		// Act
		When.iPressTheFilterGoButton();

		// Assert
		Then.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S')/Results");
		Then.theFiltersShouldMatch("");

		// Arrange
		var controlId = "multiComboBoxWithTooltip";

		//Overwrite Tooltip from view.xml BCP: 1970470346
		// Act

		// Assert
		Then.waitFor({
			id: controlId,
			success: function (oControl) {
				Opa5.assert.equal(oControl.getTooltip(), "Tooltip View overwrite",
					"Control with ID '" + controlId + "' is with expected tooltip 'Tooltip View overwrite'");
			},
			errorMessage: "Tooltip is not overwrite from the view.xml"
		});

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Input types", function(Given, When, Then) {
		var oExpectedFieldTypes = {
			"smartFilterBar-btnBasicSearch": "sap.m.SearchField",
			"smartFilterBar-filterItemControlA_-BOOL_SINGLE": "sap.m.Select",
			"smartFilterBar-filterItemControlA_-BOOL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-BOOL_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-BOOL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_OUT2": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-DECIMAL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-DECIMAL_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-FLOAT_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-FLOAT_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-FLOAT_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-FLOAT_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-NUMC_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-NUMC_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-NUMC_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-NUMC_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_IN1": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_INOUT": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-STRING_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_OUT1": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlA_-STRING_SINGLE": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_DisplayCurrency": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Int": "sap.m.Input",
			"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlA_-_Parameter.P_Time": "sap.m.TimePicker",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_INTERVAL": "sap.m.Input",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_SINGLE": "sap.m.DateTimePicker",
			"smartFilterBar-filterItemControlDate.Group-DATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL": "sap.m.DateRangeSelection",
			"smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlDate.Group-DATE_SINGLE": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO": "sap.m.Input",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_INTERVAL": "sap.m.DateRangeSelection",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_SINGLE": "sap.m.DatePicker",
			"smartFilterBar-filterItemControlTime.Group-TIME_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
			"smartFilterBar-filterItemControlTime.Group-TIME_SINGLE": "sap.m.TimePicker"
		};

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Object.keys(oExpectedFieldTypes).forEach(function (sKey) {
			var sType = oExpectedFieldTypes[sKey];
			Then.waitFor({
				id: sKey,
				success: function (oControl) {
					Opa5.assert.strictEqual(oControl.getMetadata().getName(), sType,
						"Control with ID '" + sKey + "' is of expected type '" + sType + "'");
				}
			});
		});

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Include and Exclude is added in the operators list for Define Conditions", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_AUTO");
		When.iOpenTheDropdown();

		// Assert
		Then.iShouldSeeIncludAndExcludeGroupHeaders("Include", "Exclude");

		// Cleanup
		When.iPressTheVHDCancelButton();
		When.iPressTheRestoreButton();
	});

	QUnit.module("Date fields");

	opaTest("Single date", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_SINGLE","1/1/19");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("DATE_SINGLE eq datetime'2019-01-01T00:00:00'");

		// Act - Open the Date Picker value help
		When.waitFor({
			id: "smartFilterBar-filterItemControlDate.Group-DATE_SINGLE-icon",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		});

		// Act - Select the date and trigger the filter generation
		When.waitFor({
			controlType: "sap.ui.unified.Calendar",
			searchOpenDialogs: true,
			success: function (aCalendars) {
				var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next().children("span.sapUiCalItemText").first(), // Should be the "1/2/19";
					oMouseDown = jQuery.Event("mousedown"),
					oMouseUp = jQuery.Event("mouseup");

				oMouseDown.clientX = oMouseDown.clientY = oMouseUp.clientX = oMouseUp.clientY = 0;
				$NextDate.trigger(oMouseDown);
				$NextDate.trigger(oMouseUp);
			}
		});
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("DATE_SINGLE eq datetime'2019-01-02T00:00:00'");

		// Act - enter invalid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_SINGLE","13/1/19" /* Invalid date - no 13'th month */);

		// Assert - test the DatePicker value state
		Then.waitFor({
			id: "smartFilterBar-filterItemControlDate.Group-DATE_SINGLE",
			controlType: "sap.m.DatePicker",
			success: function (oDatePicker) {
				Opa5.assert.strictEqual(oDatePicker.getValueState(), ValueState.Error,
					"DatePicker value state should be error");
			}
		});

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.theErrorDialogIsOpen();

		// Cleanup
		When.iPressTheErrorDialogCloseButton();
		When.iPressTheRestoreButton();
	});

	opaTest("Date multiple", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - Open the Date Multiple VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE");

		// Act - Press the + button 2 times to add two rows
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: [new Press(), new Press()],
			matchers: function (oControl) {
				return oControl.hasStyleClass("conditionAddBtnFloatRight");
			}
		});

		// Act - Select/Enter dates
		When.waitFor({
			controlType: "sap.m.DatePicker",
			searchOpenDialogs: true,
			success: function (aDatePickers) {
				// Act - Enter a dates in both DatePicker controls
				var oEnterText = new EnterText({
					text: "1/1/19"
				});
				oEnterText.executeOn(aDatePickers[0]);
				oEnterText.executeOn(aDatePickers[1]);

				// Act - Enter invalid date in the third DatePicker
				oEnterText.setText("13/13/19");
				oEnterText.executeOn(aDatePickers[2]);
				aDatePickers[2].$().trigger("blur");

				// Act - Change the date on the first DatePicker
				aDatePickers[0].toggleOpen();
				When.waitFor({
					controlType: "sap.ui.unified.Calendar",
					searchOpenDialogs: true,
					success: function (aCalendars) {
						var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next().children("span.sapUiCalItemText").first(), // Should be the "1/2/19";
							oMouseDown = jQuery.Event("mousedown"),
							oMouseUp = jQuery.Event("mouseup");

						oMouseDown.clientX = oMouseDown.clientY = oMouseUp.clientX = oMouseUp.clientY = 0;
						$NextDate.trigger(oMouseDown);
						$NextDate.trigger(oMouseUp);
					}
				});

				oEnterText.destroy();
			}
		});

		// Assert
		When.waitFor({
			controlType: "sap.m.DatePicker",
			searchOpenDialogs: true,
			success: function (aDatePickers) {
				// Assert
				Opa5.assert.strictEqual(
					aDatePickers[2].getValueState(),
					ValueState.Warning,
					"Value state should be 'warning'."
				);
			}
		});

		// Act - remove the last row
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: function (oControl) {
				return oControl.getId().indexOf("__button") !== -1;
			},
			success: function (aControls) {
				// Find remove button on the same row - by default it should be the first control in it's layout parent
				var oRemoveButton = aControls[aControls.length - 1].getParent().remove,
					oPress = new Press();

				// Act
				oPress.executeOn(oRemoveButton);

				// Cleanup
				oPress.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("DATE_MULTIPLE eq datetime'2019-01-02T00:00:00' or DATE_MULTIPLE eq datetime'2019-01-01T00:00:00'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Date interval", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter valid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL","1/1/19 - 1/31/19");

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(DATE_INTERVAL ge datetime'2019-01-01T00:00:00' and DATE_INTERVAL le datetime'2019-01-31T00:00:00')");

		// Act - enter invalid date in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL","1/1/19 - 31/31/19");

		Then.waitFor({
			id: "smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
			}
		});
		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Date Range", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO");

		// Act - close popover
		When.waitFor({
			controlType: "sap.m.Popover",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var i, oItem, oText = new EnterText({text: "1"}), oPopover = aPopovers[0], aItems = oPopover.getContent()[0].getItems();
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					if (oItem.getMetadata().getName() === "sap.m.DatePicker"){
						// Enter invalid dates
						oText.executeOn(oItem);
					}
				}

				oPopover.close();

				// Cleanup
				oText.destroy();
			}
		});

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO");


		Then.waitFor({
			controlType: "sap.m.Popover",
			searchOpenDialogs: true,
			success: function (aPopovers) {
				var i, oItem, oPopover = aPopovers[0], aItems = oPopover.getContent()[0].getItems();
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					if (oItem.getMetadata().getName() === "sap.m.DatePicker"){
						Opa5.assert.strictEqual(oItem.getValueState(), ValueState.None, "Value state should be None");
						Opa5.assert.strictEqual(oItem.getDateValue(), null, "Date value should be default");
						Opa5.assert.strictEqual(oItem.getValue(), "", "Value should be default");
					}
				}
			}
		});

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Time fields");

	opaTest("Single", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - Set time
		When.waitFor({
			id: "smartFilterBar-filterItemControlTime.Group-TIME_SINGLE",
			success: function (oInput) {
				oInput.setValue("12:34 PM");
			}
		});
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("TIME_SINGLE eq time'PT12H34M00S'");

		// Act - Open the VH
		When.waitFor({
			id: "smartFilterBar-filterItemControlTime.Group-TIME_SINGLE-icon",
			controlType: "sap.ui.core.Icon",
			actions: new Press()
		});

		// Act - click on the down arrow
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			matchers: function (oButton) {
				return oButton.hasStyleClass("sapMTimePickerItemArrowDown");
			},
			actions: new Press()
		});

		// Act - click on the ok button
		When.iPressTheVHDOKButton();

		// Act - filter
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("TIME_SINGLE eq time'PT13H34M00S'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Multiple", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE");

		// Act - Press the + button 1 time to add one row
		When.waitFor({
			controlType: "sap.m.Button",
			searchOpenDialogs: true,
			actions: new Press(),
			matchers: function (oControl) {
				return oControl.hasStyleClass("conditionAddBtnFloatRight");
			}
		});

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.TimePicker",
			searchOpenDialogs: true,
			success: function (aTimePickers) {
				var oText = new EnterText();

				// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
				// MaskInput control
				oText.setText("1");
				oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

				oText.setText("2");
				oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("TIME_MULTIPLE eq time'PT01H00M00S' or TIME_MULTIPLE eq time'PT02H00M00S'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Interval", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL");

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.TimePicker",
			searchOpenDialogs: true,
			success: function (aTimePickers) {
				var oText = new EnterText();

				// Populate both TimePicker fields: note using short 1 and 2 due to TimePicker specifics involving
				// MaskInput control
				oText.setText("1");
				oText.executeOn(aTimePickers[0]); // Should be 01:00 AM

				oText.setText("2");
				oText.executeOn(aTimePickers[1]); // Should be 02:00 AM

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(TIME_INTERVAL ge time'PT01H00M00S' and TIME_INTERVAL le time'PT02H00M00S')");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Interval validation for numeric fields", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-NUMC_INTERVAL");

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.Input",
			searchOpenDialogs: true,
			success: function (aInputs) {
				var oText = new EnterText({
					pressEnterKey: true
				});

				oText.setText("3");
				oText.executeOn(aInputs[0]);

				oText.setText("2");
				oText.executeOn(aInputs[1]); // 'To' field should be lower than 'From'

				Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.Warning, "'To' field should be in Warning state");

				oText.setText("1");
				oText.executeOn(aInputs[0]);

				Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "When setting the 'From' field to a valid range, " +
				"'To' field should be in None ValueState");

				oText.setText("3");
				oText.executeOn(aInputs[0]);

				Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.Warning, "'From' field should be in Warning state");

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - press the dialog ok button
		When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		//Assert that condition is not applied to the Numc Interval input
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-NUMC_INTERVAL",
			controlType: "sap.m.Input",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValue(), "", "Range is not created when the interval is wrong");
			}
		});

		// Cleanup
		When.iPressTheRestoreButton();
	});
	opaTest("Interval validation for Fiscal fields", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD");
		When.iSelectOperation("BT");

		// Act - Select/Enter times
		When.waitFor({
			controlType: "sap.m.Input",
			searchOpenDialogs: true,
			success: function (aInputs) {
				var oText = new EnterText({
					pressEnterKey: true
				});

				oText.setText("001/2021");
				oText.executeOn(aInputs[0]);

				oText.setText("001/2020");
				oText.executeOn(aInputs[1]); // 'To' field should be lower than 'From'

				Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.Warning, "'To' field should be in Warning state");

				oText.setText("001/2019");
				oText.executeOn(aInputs[0]);

				Opa5.assert.strictEqual(aInputs[1].getValueState(), ValueState.None, "When setting the 'From' field to a valid range, " +
				"'To' field should be in None ValueState");

				oText.setText("002/2020");
				oText.executeOn(aInputs[0]);

				Opa5.assert.strictEqual(aInputs[0].getValueState(), ValueState.Warning, "'From' field should be in Warning state");

				// Cleanup
				oText.destroy();
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - press the dialog ok button
		When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		//Assert that condition is not applied to the Numc Interval input
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-FISCAL_YEAR_PERIOD",
			controlType: "sap.m.Input",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValue(), "", "Range is not created when the interval is wrong");
			}
		});

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Strings");

	opaTest("Single", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "2");

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_SINGLE eq '2'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("MaxLength with value list BCP: 1970275439", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "4334" /* >3 characters */);
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.waitFor({
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			success: function(aDialogs) {
				var oDialog = aDialogs[0];

				Opa5.assert.ok(oDialog.isA("sap.m.Dialog"), 'Error Dialog should be open');
				// Opa5.assert.strictEqual(oDialog.getTitle(), oRB.getText("VALUEHELPDLG_SELECTIONFAILEDTITLE"),
				// 	"Error dialog title should match");
				Opa5.assert.strictEqual(
					oDialog.getContent()[0].getText(),
					oRB.getText("VALIDATION_ERROR_MESSAGE"),
					"Error message in dialog should match"
				);
			},
			errorMessage: "did not find the filters dialog",
			timeout: 15
		});

		// Act - press the dialog go button
		When.waitFor({
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_VL_MAXLENGTH", "1" /* <3 characters */);

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_VL_MAXLENGTH eq '1'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	// opaTest("String auto - token creation", function (Given, When, Then) {
	// 	// Arrange
	// 	Given.iEnsureMyAppIsRunning();

	// 	// Act - enter a valid strings directly in the input
	// 	When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "0002");
	// 	When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", ">0002");

	// 	// Act - Create filters
	// 	When.iPressTheFilterGoButton();

	// 	// Assert
	// 	Then.theFiltersShouldMatch("(STRING_AUTO gt '0002' or STRING_AUTO eq '0002') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'");

	// 	// Act - enter invalid string in the input and press the "go" button
	// 	When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "Some invalid strings");
	// 	When.iPressTheFilterGoButton();

	// 	// Assert
	// 	Then.theErrorDialogIsOpen();

	// 	// Cleanup
	// 	When.iPressTheErrorDialogCloseButton();
	// 	When.iPressTheRestoreButton();
	// });

	opaTest("String auto - test with a lot of tokens", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - Press button to open String Auto dialog
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

		// Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

		//Act - click on table
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function (oTable) {
				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-table-selall").trigger("click");
			}
		});

		//Assert warning dialog is open
		Then.theWarningDialogIsOpen();

		 // Act - press the dialog ok button
		 When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.sId.includes("__mbox-btn-");
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		//Assert 1500 tokens are displayed in the panel
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-tokenPanel",
			controlType: "sap.m.Panel",
			searchOpenDialogs: true,
			success: function (oPanel) {

				// Assert panel header should say that 1500 items are selected
				Opa5.assert.strictEqual(oPanel.getHeaderText(),oRB.getText("VALUEHELPDLG_SELECTEDITEMS_CONDITIONS", 1500), "Panel header should be correct");
			}
		});

		// Act - press the dialog ok button to trigger search
		When.waitFor({
			controlType: "sap.m.Button",
			matchers: function (oControl) {
				return oControl.getText() === oRB.getText("VALUEHELPDLG_OK") && oControl.getType() === sap.m.ButtonType.Emphasized;
			},
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Act - press the go button
		When.iPressTheFilterGoButton();

		// Assert string is equal
		Then.theFiltersShouldMatch(function () {
			return "(STRING_AUTO eq '0001' or STRING_AUTO eq '0002' or STRING_AUTO eq '0003' or STRING_AUTO eq '0004' or STRING_AUTO eq '0005' or STRING_AUTO eq '0006' or STRING_AUTO eq '0007' or STRING_AUTO eq '0008' or STRING_AUTO eq '0009' or STRING_AUTO eq '0010' or STRING_AUTO eq '0011' or STRING_AUTO eq '0012' or STRING_AUTO eq '0013' or STRING_AUTO eq '0014' or STRING_AUTO eq '0015' or STRING_AUTO eq '0016' or STRING_AUTO eq '0017' or STRING_AUTO eq '0018' or STRING_AUTO eq '0019' or STRING_AUTO eq '0020' or STRING_AUTO eq '0021' or STRING_AUTO eq '0022' or STRING_AUTO eq '0023' or STRING_AUTO eq '0024' or STRING_AUTO eq '0025' or STRING_AUTO eq '0026' or STRING_AUTO eq '0027' or STRING_AUTO eq '0028' or STRING_AUTO eq '0029' or STRING_AUTO eq '0030' or STRING_AUTO eq '0031' or STRING_AUTO eq '0032' or STRING_AUTO eq '0033' or STRING_AUTO eq '0034' or STRING_AUTO eq '0035' or STRING_AUTO eq '0036' or STRING_AUTO eq '0037' or STRING_AUTO eq '0038' or STRING_AUTO eq '0039' or STRING_AUTO eq '0040' or STRING_AUTO eq '0041' or STRING_AUTO eq '0042' or STRING_AUTO eq '0043' or STRING_AUTO eq '0044' or STRING_AUTO eq '0045' or STRING_AUTO eq '0046' or STRING_AUTO eq '0047' or STRING_AUTO eq '0048' or STRING_AUTO eq '0049' or STRING_AUTO eq '0050' or STRING_AUTO eq '0051' or STRING_AUTO eq '0052' or STRING_AUTO eq '0053' or STRING_AUTO eq '0054' or STRING_AUTO eq '0055' or STRING_AUTO eq '0056' or STRING_AUTO eq '0057' or STRING_AUTO eq '0058' or STRING_AUTO eq '0059' or STRING_AUTO eq '0060' or STRING_AUTO eq '0061' or STRING_AUTO eq '0062' or STRING_AUTO eq '0063' or STRING_AUTO eq '0064' or STRING_AUTO eq '0065' or STRING_AUTO eq '0066' or STRING_AUTO eq '0067' or STRING_AUTO eq '0068' or STRING_AUTO eq '0069' or STRING_AUTO eq '0070' or STRING_AUTO eq '0071' or STRING_AUTO eq '0072' or STRING_AUTO eq '0073' or STRING_AUTO eq '0074' or STRING_AUTO eq '0075' or STRING_AUTO eq '0076' or STRING_AUTO eq '0077' or STRING_AUTO eq '0078' or STRING_AUTO eq '0079' or STRING_AUTO eq '0080' or STRING_AUTO eq '0081' or STRING_AUTO eq '0082' or STRING_AUTO eq '0083' or STRING_AUTO eq '0084' or STRING_AUTO eq '0085' or STRING_AUTO eq '0086' or STRING_AUTO eq '0087' or STRING_AUTO eq '0088' or STRING_AUTO eq '0089' or STRING_AUTO eq '0090' or STRING_AUTO eq '0091' or STRING_AUTO eq '0092' or STRING_AUTO eq '0093' or STRING_AUTO eq '0094' or STRING_AUTO eq '0095' or STRING_AUTO eq '0096' or STRING_AUTO eq '0097' or STRING_AUTO eq '0098' or STRING_AUTO eq '0099' or STRING_AUTO eq '0100' or STRING_AUTO eq '0101' or STRING_AUTO eq '0102' or STRING_AUTO eq '0103' or STRING_AUTO eq '0104' or STRING_AUTO eq '0105' or STRING_AUTO eq '0106' or STRING_AUTO eq '0107' or STRING_AUTO eq '0108' or STRING_AUTO eq '0109' or STRING_AUTO eq '0110' or STRING_AUTO eq '0111' or STRING_AUTO eq '0112' or STRING_AUTO eq '0113' or STRING_AUTO eq '0114' or STRING_AUTO eq '0115' or STRING_AUTO eq '0116' or STRING_AUTO eq '0117' or STRING_AUTO eq '0118' or STRING_AUTO eq '0119' or STRING_AUTO eq '0120' or STRING_AUTO eq '0121' or STRING_AUTO eq '0122' or STRING_AUTO eq '0123' or STRING_AUTO eq '0124' or STRING_AUTO eq '0125' or STRING_AUTO eq '0126' or STRING_AUTO eq '0127' or STRING_AUTO eq '0128' or STRING_AUTO eq '0129' or STRING_AUTO eq '0130' or STRING_AUTO eq '0131' or STRING_AUTO eq '0132' or STRING_AUTO eq '0133' or STRING_AUTO eq '0134' or STRING_AUTO eq '0135' or STRING_AUTO eq '0136' or STRING_AUTO eq '0137' or STRING_AUTO eq '0138' or STRING_AUTO eq '0139' or STRING_AUTO eq '0140' or STRING_AUTO eq '0141' or STRING_AUTO eq '0142' or STRING_AUTO eq '0143' or STRING_AUTO eq '0144' or STRING_AUTO eq '0145' or STRING_AUTO eq '0146' or STRING_AUTO eq '0147' or STRING_AUTO eq '0148' or STRING_AUTO eq '0149' or STRING_AUTO eq '0150' or STRING_AUTO eq '0151' or STRING_AUTO eq '0152' or STRING_AUTO eq '0153' or STRING_AUTO eq '0154' or STRING_AUTO eq '0155' or STRING_AUTO eq '0156' or STRING_AUTO eq '0157' or STRING_AUTO eq '0158' or STRING_AUTO eq '0159' or STRING_AUTO eq '0160' or STRING_AUTO eq '0161' or STRING_AUTO eq '0162' or STRING_AUTO eq '0163' or STRING_AUTO eq '0164' or STRING_AUTO eq '0165' or STRING_AUTO eq '0166' or STRING_AUTO eq '0167' or STRING_AUTO eq '0168' or STRING_AUTO eq '0169' or STRING_AUTO eq '0170' or STRING_AUTO eq '0171' or STRING_AUTO eq '0172' or STRING_AUTO eq '0173' or STRING_AUTO eq '0174' or STRING_AUTO eq '0175' or STRING_AUTO eq '0176' or STRING_AUTO eq '0177' or STRING_AUTO eq '0178' or STRING_AUTO eq '0179' or STRING_AUTO eq '0180' or STRING_AUTO eq '0181' or STRING_AUTO eq '0182' or STRING_AUTO eq '0183' or STRING_AUTO eq '0184' or STRING_AUTO eq '0185' or STRING_AUTO eq '0186' or STRING_AUTO eq '0187' or STRING_AUTO eq '0188' or STRING_AUTO eq '0189' or STRING_AUTO eq '0190' or STRING_AUTO eq '0191' or STRING_AUTO eq '0192' or STRING_AUTO eq '0193' or STRING_AUTO eq '0194' or STRING_AUTO eq '0195' or STRING_AUTO eq '0196' or STRING_AUTO eq '0197' or STRING_AUTO eq '0198' or STRING_AUTO eq '0199' or STRING_AUTO eq '0200' or STRING_AUTO eq '0201' or STRING_AUTO eq '0202' or STRING_AUTO eq '0203' or STRING_AUTO eq '0204' or STRING_AUTO eq '0205' or STRING_AUTO eq '0206' or STRING_AUTO eq '0207' or STRING_AUTO eq '0208' or STRING_AUTO eq '0209' or STRING_AUTO eq '0210' or STRING_AUTO eq '0211' or STRING_AUTO eq '0212' or STRING_AUTO eq '0213' or STRING_AUTO eq '0214' or STRING_AUTO eq '0215' or STRING_AUTO eq '0216' or STRING_AUTO eq '0217' or STRING_AUTO eq '0218' or STRING_AUTO eq '0219' or STRING_AUTO eq '0220' or STRING_AUTO eq '0221' or STRING_AUTO eq '0222' or STRING_AUTO eq '0223' or STRING_AUTO eq '0224' or STRING_AUTO eq '0225' or STRING_AUTO eq '0226' or STRING_AUTO eq '0227' or STRING_AUTO eq '0228' or STRING_AUTO eq '0229' or STRING_AUTO eq '0230' or STRING_AUTO eq '0231' or STRING_AUTO eq '0232' or STRING_AUTO eq '0233' or STRING_AUTO eq '0234' or STRING_AUTO eq '0235' or STRING_AUTO eq '0236' or STRING_AUTO eq '0237' or STRING_AUTO eq '0238' or STRING_AUTO eq '0239' or STRING_AUTO eq '0240' or STRING_AUTO eq '0241' or STRING_AUTO eq '0242' or STRING_AUTO eq '0243' or STRING_AUTO eq '0244' or STRING_AUTO eq '0245' or STRING_AUTO eq '0246' or STRING_AUTO eq '0247' or STRING_AUTO eq '0248' or STRING_AUTO eq '0249' or STRING_AUTO eq '0250' or STRING_AUTO eq '0251' or STRING_AUTO eq '0252' or STRING_AUTO eq '0253' or STRING_AUTO eq '0254' or STRING_AUTO eq '0255' or STRING_AUTO eq '0256' or STRING_AUTO eq '0257' or STRING_AUTO eq '0258' or STRING_AUTO eq '0259' or STRING_AUTO eq '0260' or STRING_AUTO eq '0261' or STRING_AUTO eq '0262' or STRING_AUTO eq '0263' or STRING_AUTO eq '0264' or STRING_AUTO eq '0265' or STRING_AUTO eq '0266' or STRING_AUTO eq '0267' or STRING_AUTO eq '0268' or STRING_AUTO eq '0269' or STRING_AUTO eq '0270' or STRING_AUTO eq '0271' or STRING_AUTO eq '0272' or STRING_AUTO eq '0273' or STRING_AUTO eq '0274' or STRING_AUTO eq '0275' or STRING_AUTO eq '0276' or STRING_AUTO eq '0277' or STRING_AUTO eq '0278' or STRING_AUTO eq '0279' or STRING_AUTO eq '0280' or STRING_AUTO eq '0281' or STRING_AUTO eq '0282' or STRING_AUTO eq '0283' or STRING_AUTO eq '0284' or STRING_AUTO eq '0285' or STRING_AUTO eq '0286' or STRING_AUTO eq '0287' or STRING_AUTO eq '0288' or STRING_AUTO eq '0289' or STRING_AUTO eq '0290' or STRING_AUTO eq '0291' or STRING_AUTO eq '0292' or STRING_AUTO eq '0293' or STRING_AUTO eq '0294' or STRING_AUTO eq '0295' or STRING_AUTO eq '0296' or STRING_AUTO eq '0297' or STRING_AUTO eq '0298' or STRING_AUTO eq '0299' or STRING_AUTO eq '0300' or STRING_AUTO eq '0301' or STRING_AUTO eq '0302' or STRING_AUTO eq '0303' or STRING_AUTO eq '0304' or STRING_AUTO eq '0305' or STRING_AUTO eq '0306' or STRING_AUTO eq '0307' or STRING_AUTO eq '0308' or STRING_AUTO eq '0309' or STRING_AUTO eq '0310' or STRING_AUTO eq '0311' or STRING_AUTO eq '0312' or STRING_AUTO eq '0313' or STRING_AUTO eq '0314' or STRING_AUTO eq '0315' or STRING_AUTO eq '0316' or STRING_AUTO eq '0317' or STRING_AUTO eq '0318' or STRING_AUTO eq '0319' or STRING_AUTO eq '0320' or STRING_AUTO eq '0321' or STRING_AUTO eq '0322' or STRING_AUTO eq '0323' or STRING_AUTO eq '0324' or STRING_AUTO eq '0325' or STRING_AUTO eq '0326' or STRING_AUTO eq '0327' or STRING_AUTO eq '0328' or STRING_AUTO eq '0329' or STRING_AUTO eq '0330' or STRING_AUTO eq '0331' or STRING_AUTO eq '0332' or STRING_AUTO eq '0333' or STRING_AUTO eq '0334' or STRING_AUTO eq '0335' or STRING_AUTO eq '0336' or STRING_AUTO eq '0337' or STRING_AUTO eq '0338' or STRING_AUTO eq '0339' or STRING_AUTO eq '0340' or STRING_AUTO eq '0341' or STRING_AUTO eq '0342' or STRING_AUTO eq '0343' or STRING_AUTO eq '0344' or STRING_AUTO eq '0345' or STRING_AUTO eq '0346' or STRING_AUTO eq '0347' or STRING_AUTO eq '0348' or STRING_AUTO eq '0349' or STRING_AUTO eq '0350' or STRING_AUTO eq '0351' or STRING_AUTO eq '0352' or STRING_AUTO eq '0353' or STRING_AUTO eq '0354' or STRING_AUTO eq '0355' or STRING_AUTO eq '0356' or STRING_AUTO eq '0357' or STRING_AUTO eq '0358' or STRING_AUTO eq '0359' or STRING_AUTO eq '0360' or STRING_AUTO eq '0361' or STRING_AUTO eq '0362' or STRING_AUTO eq '0363' or STRING_AUTO eq '0364' or STRING_AUTO eq '0365' or STRING_AUTO eq '0366' or STRING_AUTO eq '0367' or STRING_AUTO eq '0368' or STRING_AUTO eq '0369' or STRING_AUTO eq '0370' or STRING_AUTO eq '0371' or STRING_AUTO eq '0372' or STRING_AUTO eq '0373' or STRING_AUTO eq '0374' or STRING_AUTO eq '0375' or STRING_AUTO eq '0376' or STRING_AUTO eq '0377' or STRING_AUTO eq '0378' or STRING_AUTO eq '0379' or STRING_AUTO eq '0380' or STRING_AUTO eq '0381' or STRING_AUTO eq '0382' or STRING_AUTO eq '0383' or STRING_AUTO eq '0384' or STRING_AUTO eq '0385' or STRING_AUTO eq '0386' or STRING_AUTO eq '0387' or STRING_AUTO eq '0388' or STRING_AUTO eq '0389' or STRING_AUTO eq '0390' or STRING_AUTO eq '0391' or STRING_AUTO eq '0392' or STRING_AUTO eq '0393' or STRING_AUTO eq '0394' or STRING_AUTO eq '0395' or STRING_AUTO eq '0396' or STRING_AUTO eq '0397' or STRING_AUTO eq '0398' or STRING_AUTO eq '0399' or STRING_AUTO eq '0400' or STRING_AUTO eq '0401' or STRING_AUTO eq '0402' or STRING_AUTO eq '0403' or STRING_AUTO eq '0404' or STRING_AUTO eq '0405' or STRING_AUTO eq '0406' or STRING_AUTO eq '0407' or STRING_AUTO eq '0408' or STRING_AUTO eq '0409' or STRING_AUTO eq '0410' or STRING_AUTO eq '0411' or STRING_AUTO eq '0412' or STRING_AUTO eq '0413' or STRING_AUTO eq '0414' or STRING_AUTO eq '0415' or STRING_AUTO eq '0416' or STRING_AUTO eq '0417' or STRING_AUTO eq '0418' or STRING_AUTO eq '0419' or STRING_AUTO eq '0420' or STRING_AUTO eq '0421' or STRING_AUTO eq '0422' or STRING_AUTO eq '0423' or STRING_AUTO eq '0424' or STRING_AUTO eq '0425' or STRING_AUTO eq '0426' or STRING_AUTO eq '0427' or STRING_AUTO eq '0428' or STRING_AUTO eq '0429' or STRING_AUTO eq '0430' or STRING_AUTO eq '0431' or STRING_AUTO eq '0432' or STRING_AUTO eq '0433' or STRING_AUTO eq '0434' or STRING_AUTO eq '0435' or STRING_AUTO eq '0436' or STRING_AUTO eq '0437' or STRING_AUTO eq '0438' or STRING_AUTO eq '0439' or STRING_AUTO eq '0440' or STRING_AUTO eq '0441' or STRING_AUTO eq '0442' or STRING_AUTO eq '0443' or STRING_AUTO eq '0444' or STRING_AUTO eq '0445' or STRING_AUTO eq '0446' or STRING_AUTO eq '0447' or STRING_AUTO eq '0448' or STRING_AUTO eq '0449' or STRING_AUTO eq '0450' or STRING_AUTO eq '0451' or STRING_AUTO eq '0452' or STRING_AUTO eq '0453' or STRING_AUTO eq '0454' or STRING_AUTO eq '0455' or STRING_AUTO eq '0456' or STRING_AUTO eq '0457' or STRING_AUTO eq '0458' or STRING_AUTO eq '0459' or STRING_AUTO eq '0460' or STRING_AUTO eq '0461' or STRING_AUTO eq '0462' or STRING_AUTO eq '0463' or STRING_AUTO eq '0464' or STRING_AUTO eq '0465' or STRING_AUTO eq '0466' or STRING_AUTO eq '0467' or STRING_AUTO eq '0468' or STRING_AUTO eq '0469' or STRING_AUTO eq '0470' or STRING_AUTO eq '0471' or STRING_AUTO eq '0472' or STRING_AUTO eq '0473' or STRING_AUTO eq '0474' or STRING_AUTO eq '0475' or STRING_AUTO eq '0476' or STRING_AUTO eq '0477' or STRING_AUTO eq '0478' or STRING_AUTO eq '0479' or STRING_AUTO eq '0480' or STRING_AUTO eq '0481' or STRING_AUTO eq '0482' or STRING_AUTO eq '0483' or STRING_AUTO eq '0484' or STRING_AUTO eq '0485' or STRING_AUTO eq '0486' or STRING_AUTO eq '0487' or STRING_AUTO eq '0488' or STRING_AUTO eq '0489' or STRING_AUTO eq '0490' or STRING_AUTO eq '0491' or STRING_AUTO eq '0492' or STRING_AUTO eq '0493' or STRING_AUTO eq '0494' or STRING_AUTO eq '0495' or STRING_AUTO eq '0496' or STRING_AUTO eq '0497' or STRING_AUTO eq '0498' or STRING_AUTO eq '0499' or STRING_AUTO eq '0500' or STRING_AUTO eq '0501' or STRING_AUTO eq '0502' or STRING_AUTO eq '0503' or STRING_AUTO eq '0504' or STRING_AUTO eq '0505' or STRING_AUTO eq '0506' or STRING_AUTO eq '0507' or STRING_AUTO eq '0508' or STRING_AUTO eq '0509' or STRING_AUTO eq '0510' or STRING_AUTO eq '0511' or STRING_AUTO eq '0512' or STRING_AUTO eq '0513' or STRING_AUTO eq '0514' or STRING_AUTO eq '0515' or STRING_AUTO eq '0516' or STRING_AUTO eq '0517' or STRING_AUTO eq '0518' or STRING_AUTO eq '0519' or STRING_AUTO eq '0520' or STRING_AUTO eq '0521' or STRING_AUTO eq '0522' or STRING_AUTO eq '0523' or STRING_AUTO eq '0524' or STRING_AUTO eq '0525' or STRING_AUTO eq '0526' or STRING_AUTO eq '0527' or STRING_AUTO eq '0528' or STRING_AUTO eq '0529' or STRING_AUTO eq '0530' or STRING_AUTO eq '0531' or STRING_AUTO eq '0532' or STRING_AUTO eq '0533' or STRING_AUTO eq '0534' or STRING_AUTO eq '0535' or STRING_AUTO eq '0536' or STRING_AUTO eq '0537' or STRING_AUTO eq '0538' or STRING_AUTO eq '0539' or STRING_AUTO eq '0540' or STRING_AUTO eq '0541' or STRING_AUTO eq '0542' or STRING_AUTO eq '0543' or STRING_AUTO eq '0544' or STRING_AUTO eq '0545' or STRING_AUTO eq '0546' or STRING_AUTO eq '0547' or STRING_AUTO eq '0548' or STRING_AUTO eq '0549' or STRING_AUTO eq '0550' or STRING_AUTO eq '0551' or STRING_AUTO eq '0552' or STRING_AUTO eq '0553' or STRING_AUTO eq '0554' or STRING_AUTO eq '0555' or STRING_AUTO eq '0556' or STRING_AUTO eq '0557' or STRING_AUTO eq '0558' or STRING_AUTO eq '0559' or STRING_AUTO eq '0560' or STRING_AUTO eq '0561' or STRING_AUTO eq '0562' or STRING_AUTO eq '0563' or STRING_AUTO eq '0564' or STRING_AUTO eq '0565' or STRING_AUTO eq '0566' or STRING_AUTO eq '0567' or STRING_AUTO eq '0568' or STRING_AUTO eq '0569' or STRING_AUTO eq '0570' or STRING_AUTO eq '0571' or STRING_AUTO eq '0572' or STRING_AUTO eq '0573' or STRING_AUTO eq '0574' or STRING_AUTO eq '0575' or STRING_AUTO eq '0576' or STRING_AUTO eq '0577' or STRING_AUTO eq '0578' or STRING_AUTO eq '0579' or STRING_AUTO eq '0580' or STRING_AUTO eq '0581' or STRING_AUTO eq '0582' or STRING_AUTO eq '0583' or STRING_AUTO eq '0584' or STRING_AUTO eq '0585' or STRING_AUTO eq '0586' or STRING_AUTO eq '0587' or STRING_AUTO eq '0588' or STRING_AUTO eq '0589' or STRING_AUTO eq '0590' or STRING_AUTO eq '0591' or STRING_AUTO eq '0592' or STRING_AUTO eq '0593' or STRING_AUTO eq '0594' or STRING_AUTO eq '0595' or STRING_AUTO eq '0596' or STRING_AUTO eq '0597' or STRING_AUTO eq '0598' or STRING_AUTO eq '0599' or STRING_AUTO eq '0600' or STRING_AUTO eq '0601' or STRING_AUTO eq '0602' or STRING_AUTO eq '0603' or STRING_AUTO eq '0604' or STRING_AUTO eq '0605' or STRING_AUTO eq '0606' or STRING_AUTO eq '0607' or STRING_AUTO eq '0608' or STRING_AUTO eq '0609' or STRING_AUTO eq '0610' or STRING_AUTO eq '0611' or STRING_AUTO eq '0612' or STRING_AUTO eq '0613' or STRING_AUTO eq '0614' or STRING_AUTO eq '0615' or STRING_AUTO eq '0616' or STRING_AUTO eq '0617' or STRING_AUTO eq '0618' or STRING_AUTO eq '0619' or STRING_AUTO eq '0620' or STRING_AUTO eq '0621' or STRING_AUTO eq '0622' or STRING_AUTO eq '0623' or STRING_AUTO eq '0624' or STRING_AUTO eq '0625' or STRING_AUTO eq '0626' or STRING_AUTO eq '0627' or STRING_AUTO eq '0628' or STRING_AUTO eq '0629' or STRING_AUTO eq '0630' or STRING_AUTO eq '0631' or STRING_AUTO eq '0632' or STRING_AUTO eq '0633' or STRING_AUTO eq '0634' or STRING_AUTO eq '0635' or STRING_AUTO eq '0636' or STRING_AUTO eq '0637' or STRING_AUTO eq '0638' or STRING_AUTO eq '0639' or STRING_AUTO eq '0640' or STRING_AUTO eq '0641' or STRING_AUTO eq '0642' or STRING_AUTO eq '0643' or STRING_AUTO eq '0644' or STRING_AUTO eq '0645' or STRING_AUTO eq '0646' or STRING_AUTO eq '0647' or STRING_AUTO eq '0648' or STRING_AUTO eq '0649' or STRING_AUTO eq '0650' or STRING_AUTO eq '0651' or STRING_AUTO eq '0652' or STRING_AUTO eq '0653' or STRING_AUTO eq '0654' or STRING_AUTO eq '0655' or STRING_AUTO eq '0656' or STRING_AUTO eq '0657' or STRING_AUTO eq '0658' or STRING_AUTO eq '0659' or STRING_AUTO eq '0660' or STRING_AUTO eq '0661' or STRING_AUTO eq '0662' or STRING_AUTO eq '0663' or STRING_AUTO eq '0664' or STRING_AUTO eq '0665' or STRING_AUTO eq '0666' or STRING_AUTO eq '0667' or STRING_AUTO eq '0668' or STRING_AUTO eq '0669' or STRING_AUTO eq '0670' or STRING_AUTO eq '0671' or STRING_AUTO eq '0672' or STRING_AUTO eq '0673' or STRING_AUTO eq '0674' or STRING_AUTO eq '0675' or STRING_AUTO eq '0676' or STRING_AUTO eq '0677' or STRING_AUTO eq '0678' or STRING_AUTO eq '0679' or STRING_AUTO eq '0680' or STRING_AUTO eq '0681' or STRING_AUTO eq '0682' or STRING_AUTO eq '0683' or STRING_AUTO eq '0684' or STRING_AUTO eq '0685' or STRING_AUTO eq '0686' or STRING_AUTO eq '0687' or STRING_AUTO eq '0688' or STRING_AUTO eq '0689' or STRING_AUTO eq '0690' or STRING_AUTO eq '0691' or STRING_AUTO eq '0692' or STRING_AUTO eq '0693' or STRING_AUTO eq '0694' or STRING_AUTO eq '0695' or STRING_AUTO eq '0696' or STRING_AUTO eq '0697' or STRING_AUTO eq '0698' or STRING_AUTO eq '0699' or STRING_AUTO eq '0700' or STRING_AUTO eq '0701' or STRING_AUTO eq '0702' or STRING_AUTO eq '0703' or STRING_AUTO eq '0704' or STRING_AUTO eq '0705' or STRING_AUTO eq '0706' or STRING_AUTO eq '0707' or STRING_AUTO eq '0708' or STRING_AUTO eq '0709' or STRING_AUTO eq '0710' or STRING_AUTO eq '0711' or STRING_AUTO eq '0712' or STRING_AUTO eq '0713' or STRING_AUTO eq '0714' or STRING_AUTO eq '0715' or STRING_AUTO eq '0716' or STRING_AUTO eq '0717' or STRING_AUTO eq '0718' or STRING_AUTO eq '0719' or STRING_AUTO eq '0720' or STRING_AUTO eq '0721' or STRING_AUTO eq '0722' or STRING_AUTO eq '0723' or STRING_AUTO eq '0724' or STRING_AUTO eq '0725' or STRING_AUTO eq '0726' or STRING_AUTO eq '0727' or STRING_AUTO eq '0728' or STRING_AUTO eq '0729' or STRING_AUTO eq '0730' or STRING_AUTO eq '0731' or STRING_AUTO eq '0732' or STRING_AUTO eq '0733' or STRING_AUTO eq '0734' or STRING_AUTO eq '0735' or STRING_AUTO eq '0736' or STRING_AUTO eq '0737' or STRING_AUTO eq '0738' or STRING_AUTO eq '0739' or STRING_AUTO eq '0740' or STRING_AUTO eq '0741' or STRING_AUTO eq '0742' or STRING_AUTO eq '0743' or STRING_AUTO eq '0744' or STRING_AUTO eq '0745' or STRING_AUTO eq '0746' or STRING_AUTO eq '0747' or STRING_AUTO eq '0748' or STRING_AUTO eq '0749' or STRING_AUTO eq '0750' or STRING_AUTO eq '0751' or STRING_AUTO eq '0752' or STRING_AUTO eq '0753' or STRING_AUTO eq '0754' or STRING_AUTO eq '0755' or STRING_AUTO eq '0756' or STRING_AUTO eq '0757' or STRING_AUTO eq '0758' or STRING_AUTO eq '0759' or STRING_AUTO eq '0760' or STRING_AUTO eq '0761' or STRING_AUTO eq '0762' or STRING_AUTO eq '0763' or STRING_AUTO eq '0764' or STRING_AUTO eq '0765' or STRING_AUTO eq '0766' or STRING_AUTO eq '0767' or STRING_AUTO eq '0768' or STRING_AUTO eq '0769' or STRING_AUTO eq '0770' or STRING_AUTO eq '0771' or STRING_AUTO eq '0772' or STRING_AUTO eq '0773' or STRING_AUTO eq '0774' or STRING_AUTO eq '0775' or STRING_AUTO eq '0776' or STRING_AUTO eq '0777' or STRING_AUTO eq '0778' or STRING_AUTO eq '0779' or STRING_AUTO eq '0780' or STRING_AUTO eq '0781' or STRING_AUTO eq '0782' or STRING_AUTO eq '0783' or STRING_AUTO eq '0784' or STRING_AUTO eq '0785' or STRING_AUTO eq '0786' or STRING_AUTO eq '0787' or STRING_AUTO eq '0788' or STRING_AUTO eq '0789' or STRING_AUTO eq '0790' or STRING_AUTO eq '0791' or STRING_AUTO eq '0792' or STRING_AUTO eq '0793' or STRING_AUTO eq '0794' or STRING_AUTO eq '0795' or STRING_AUTO eq '0796' or STRING_AUTO eq '0797' or STRING_AUTO eq '0798' or STRING_AUTO eq '0799' or STRING_AUTO eq '0800' or STRING_AUTO eq '0801' or STRING_AUTO eq '0802' or STRING_AUTO eq '0803' or STRING_AUTO eq '0804' or STRING_AUTO eq '0805' or STRING_AUTO eq '0806' or STRING_AUTO eq '0807' or STRING_AUTO eq '0808' or STRING_AUTO eq '0809' or STRING_AUTO eq '0810' or STRING_AUTO eq '0811' or STRING_AUTO eq '0812' or STRING_AUTO eq '0813' or STRING_AUTO eq '0814' or STRING_AUTO eq '0815' or STRING_AUTO eq '0816' or STRING_AUTO eq '0817' or STRING_AUTO eq '0818' or STRING_AUTO eq '0819' or STRING_AUTO eq '0820' or STRING_AUTO eq '0821' or STRING_AUTO eq '0822' or STRING_AUTO eq '0823' or STRING_AUTO eq '0824' or STRING_AUTO eq '0825' or STRING_AUTO eq '0826' or STRING_AUTO eq '0827' or STRING_AUTO eq '0828' or STRING_AUTO eq '0829' or STRING_AUTO eq '0830' or STRING_AUTO eq '0831' or STRING_AUTO eq '0832' or STRING_AUTO eq '0833' or STRING_AUTO eq '0834' or STRING_AUTO eq '0835' or STRING_AUTO eq '0836' or STRING_AUTO eq '0837' or STRING_AUTO eq '0838' or STRING_AUTO eq '0839' or STRING_AUTO eq '0840' or STRING_AUTO eq '0841' or STRING_AUTO eq '0842' or STRING_AUTO eq '0843' or STRING_AUTO eq '0844' or STRING_AUTO eq '0845' or STRING_AUTO eq '0846' or STRING_AUTO eq '0847' or STRING_AUTO eq '0848' or STRING_AUTO eq '0849' or STRING_AUTO eq '0850' or STRING_AUTO eq '0851' or STRING_AUTO eq '0852' or STRING_AUTO eq '0853' or STRING_AUTO eq '0854' or STRING_AUTO eq '0855' or STRING_AUTO eq '0856' or STRING_AUTO eq '0857' or STRING_AUTO eq '0858' or STRING_AUTO eq '0859' or STRING_AUTO eq '0860' or STRING_AUTO eq '0861' or STRING_AUTO eq '0862' or STRING_AUTO eq '0863' or STRING_AUTO eq '0864' or STRING_AUTO eq '0865' or STRING_AUTO eq '0866' or STRING_AUTO eq '0867' or STRING_AUTO eq '0868' or STRING_AUTO eq '0869' or STRING_AUTO eq '0870' or STRING_AUTO eq '0871' or STRING_AUTO eq '0872' or STRING_AUTO eq '0873' or STRING_AUTO eq '0874' or STRING_AUTO eq '0875' or STRING_AUTO eq '0876' or STRING_AUTO eq '0877' or STRING_AUTO eq '0878' or STRING_AUTO eq '0879' or STRING_AUTO eq '0880' or STRING_AUTO eq '0881' or STRING_AUTO eq '0882' or STRING_AUTO eq '0883' or STRING_AUTO eq '0884' or STRING_AUTO eq '0885' or STRING_AUTO eq '0886' or STRING_AUTO eq '0887' or STRING_AUTO eq '0888' or STRING_AUTO eq '0889' or STRING_AUTO eq '0890' or STRING_AUTO eq '0891' or STRING_AUTO eq '0892' or STRING_AUTO eq '0893' or STRING_AUTO eq '0894' or STRING_AUTO eq '0895' or STRING_AUTO eq '0896' or STRING_AUTO eq '0897' or STRING_AUTO eq '0898' or STRING_AUTO eq '0899' or STRING_AUTO eq '0900' or STRING_AUTO eq '0901' or STRING_AUTO eq '0902' or STRING_AUTO eq '0903' or STRING_AUTO eq '0904' or STRING_AUTO eq '0905' or STRING_AUTO eq '0906' or STRING_AUTO eq '0907' or STRING_AUTO eq '0908' or STRING_AUTO eq '0909' or STRING_AUTO eq '0910' or STRING_AUTO eq '0911' or STRING_AUTO eq '0912' or STRING_AUTO eq '0913' or STRING_AUTO eq '0914' or STRING_AUTO eq '0915' or STRING_AUTO eq '0916' or STRING_AUTO eq '0917' or STRING_AUTO eq '0918' or STRING_AUTO eq '0919' or STRING_AUTO eq '0920' or STRING_AUTO eq '0921' or STRING_AUTO eq '0922' or STRING_AUTO eq '0923' or STRING_AUTO eq '0924' or STRING_AUTO eq '0925' or STRING_AUTO eq '0926' or STRING_AUTO eq '0927' or STRING_AUTO eq '0928' or STRING_AUTO eq '0929' or STRING_AUTO eq '0930' or STRING_AUTO eq '0931' or STRING_AUTO eq '0932' or STRING_AUTO eq '0933' or STRING_AUTO eq '0934' or STRING_AUTO eq '0935' or STRING_AUTO eq '0936' or STRING_AUTO eq '0937' or STRING_AUTO eq '0938' or STRING_AUTO eq '0939' or STRING_AUTO eq '0940' or STRING_AUTO eq '0941' or STRING_AUTO eq '0942' or STRING_AUTO eq '0943' or STRING_AUTO eq '0944' or STRING_AUTO eq '0945' or STRING_AUTO eq '0946' or STRING_AUTO eq '0947' or STRING_AUTO eq '0948' or STRING_AUTO eq '0949' or STRING_AUTO eq '0950' or STRING_AUTO eq '0951' or STRING_AUTO eq '0952' or STRING_AUTO eq '0953' or STRING_AUTO eq '0954' or STRING_AUTO eq '0955' or STRING_AUTO eq '0956' or STRING_AUTO eq '0957' or STRING_AUTO eq '0958' or STRING_AUTO eq '0959' or STRING_AUTO eq '0960' or STRING_AUTO eq '0961' or STRING_AUTO eq '0962' or STRING_AUTO eq '0963' or STRING_AUTO eq '0964' or STRING_AUTO eq '0965' or STRING_AUTO eq '0966' or STRING_AUTO eq '0967' or STRING_AUTO eq '0968' or STRING_AUTO eq '0969' or STRING_AUTO eq '0970' or STRING_AUTO eq '0971' or STRING_AUTO eq '0972' or STRING_AUTO eq '0973' or STRING_AUTO eq '0974' or STRING_AUTO eq '0975' or STRING_AUTO eq '0976' or STRING_AUTO eq '0977' or STRING_AUTO eq '0978' or STRING_AUTO eq '0979' or STRING_AUTO eq '0980' or STRING_AUTO eq '0981' or STRING_AUTO eq '0982' or STRING_AUTO eq '0983' or STRING_AUTO eq '0984' or STRING_AUTO eq '0985' or STRING_AUTO eq '0986' or STRING_AUTO eq '0987' or STRING_AUTO eq '0988' or STRING_AUTO eq '0989' or STRING_AUTO eq '0990' or STRING_AUTO eq '0991' or STRING_AUTO eq '0992' or STRING_AUTO eq '0993' or STRING_AUTO eq '0994' or STRING_AUTO eq '0995' or STRING_AUTO eq '0996' or STRING_AUTO eq '0997' or STRING_AUTO eq '0998' or STRING_AUTO eq '0999' or STRING_AUTO eq '1000' or STRING_AUTO eq '1001' or STRING_AUTO eq '1002' or STRING_AUTO eq '1003' or STRING_AUTO eq '1004' or STRING_AUTO eq '1005' or STRING_AUTO eq '1006' or STRING_AUTO eq '1007' or STRING_AUTO eq '1008' or STRING_AUTO eq '1009' or STRING_AUTO eq '1010' or STRING_AUTO eq '1011' or STRING_AUTO eq '1012' or STRING_AUTO eq '1013' or STRING_AUTO eq '1014' or STRING_AUTO eq '1015' or STRING_AUTO eq '1016' or STRING_AUTO eq '1017' or STRING_AUTO eq '1018' or STRING_AUTO eq '1019' or STRING_AUTO eq '1020' or STRING_AUTO eq '1021' or STRING_AUTO eq '1022' or STRING_AUTO eq '1023' or STRING_AUTO eq '1024' or STRING_AUTO eq '1025' or STRING_AUTO eq '1026' or STRING_AUTO eq '1027' or STRING_AUTO eq '1028' or STRING_AUTO eq '1029' or STRING_AUTO eq '1030' or STRING_AUTO eq '1031' or STRING_AUTO eq '1032' or STRING_AUTO eq '1033' or STRING_AUTO eq '1034' or STRING_AUTO eq '1035' or STRING_AUTO eq '1036' or STRING_AUTO eq '1037' or STRING_AUTO eq '1038' or STRING_AUTO eq '1039' or STRING_AUTO eq '1040' or STRING_AUTO eq '1041' or STRING_AUTO eq '1042' or STRING_AUTO eq '1043' or STRING_AUTO eq '1044' or STRING_AUTO eq '1045' or STRING_AUTO eq '1046' or STRING_AUTO eq '1047' or STRING_AUTO eq '1048' or STRING_AUTO eq '1049' or STRING_AUTO eq '1050' or STRING_AUTO eq '1051' or STRING_AUTO eq '1052' or STRING_AUTO eq '1053' or STRING_AUTO eq '1054' or STRING_AUTO eq '1055' or STRING_AUTO eq '1056' or STRING_AUTO eq '1057' or STRING_AUTO eq '1058' or STRING_AUTO eq '1059' or STRING_AUTO eq '1060' or STRING_AUTO eq '1061' or STRING_AUTO eq '1062' or STRING_AUTO eq '1063' or STRING_AUTO eq '1064' or STRING_AUTO eq '1065' or STRING_AUTO eq '1066' or STRING_AUTO eq '1067' or STRING_AUTO eq '1068' or STRING_AUTO eq '1069' or STRING_AUTO eq '1070' or STRING_AUTO eq '1071' or STRING_AUTO eq '1072' or STRING_AUTO eq '1073' or STRING_AUTO eq '1074' or STRING_AUTO eq '1075' or STRING_AUTO eq '1076' or STRING_AUTO eq '1077' or STRING_AUTO eq '1078' or STRING_AUTO eq '1079' or STRING_AUTO eq '1080' or STRING_AUTO eq '1081' or STRING_AUTO eq '1082' or STRING_AUTO eq '1083' or STRING_AUTO eq '1084' or STRING_AUTO eq '1085' or STRING_AUTO eq '1086' or STRING_AUTO eq '1087' or STRING_AUTO eq '1088' or STRING_AUTO eq '1089' or STRING_AUTO eq '1090' or STRING_AUTO eq '1091' or STRING_AUTO eq '1092' or STRING_AUTO eq '1093' or STRING_AUTO eq '1094' or STRING_AUTO eq '1095' or STRING_AUTO eq '1096' or STRING_AUTO eq '1097' or STRING_AUTO eq '1098' or STRING_AUTO eq '1099' or STRING_AUTO eq '1100' or STRING_AUTO eq '1101' or STRING_AUTO eq '1102' or STRING_AUTO eq '1103' or STRING_AUTO eq '1104' or STRING_AUTO eq '1105' or STRING_AUTO eq '1106' or STRING_AUTO eq '1107' or STRING_AUTO eq '1108' or STRING_AUTO eq '1109' or STRING_AUTO eq '1110' or STRING_AUTO eq '1111' or STRING_AUTO eq '1112' or STRING_AUTO eq '1113' or STRING_AUTO eq '1114' or STRING_AUTO eq '1115' or STRING_AUTO eq '1116' or STRING_AUTO eq '1117' or STRING_AUTO eq '1118' or STRING_AUTO eq '1119' or STRING_AUTO eq '1120' or STRING_AUTO eq '1121' or STRING_AUTO eq '1122' or STRING_AUTO eq '1123' or STRING_AUTO eq '1124' or STRING_AUTO eq '1125' or STRING_AUTO eq '1126' or STRING_AUTO eq '1127' or STRING_AUTO eq '1128' or STRING_AUTO eq '1129' or STRING_AUTO eq '1130' or STRING_AUTO eq '1131' or STRING_AUTO eq '1132' or STRING_AUTO eq '1133' or STRING_AUTO eq '1134' or STRING_AUTO eq '1135' or STRING_AUTO eq '1136' or STRING_AUTO eq '1137' or STRING_AUTO eq '1138' or STRING_AUTO eq '1139' or STRING_AUTO eq '1140' or STRING_AUTO eq '1141' or STRING_AUTO eq '1142' or STRING_AUTO eq '1143' or STRING_AUTO eq '1144' or STRING_AUTO eq '1145' or STRING_AUTO eq '1146' or STRING_AUTO eq '1147' or STRING_AUTO eq '1148' or STRING_AUTO eq '1149' or STRING_AUTO eq '1150' or STRING_AUTO eq '1151' or STRING_AUTO eq '1152' or STRING_AUTO eq '1153' or STRING_AUTO eq '1154' or STRING_AUTO eq '1155' or STRING_AUTO eq '1156' or STRING_AUTO eq '1157' or STRING_AUTO eq '1158' or STRING_AUTO eq '1159' or STRING_AUTO eq '1160' or STRING_AUTO eq '1161' or STRING_AUTO eq '1162' or STRING_AUTO eq '1163' or STRING_AUTO eq '1164' or STRING_AUTO eq '1165' or STRING_AUTO eq '1166' or STRING_AUTO eq '1167' or STRING_AUTO eq '1168' or STRING_AUTO eq '1169' or STRING_AUTO eq '1170' or STRING_AUTO eq '1171' or STRING_AUTO eq '1172' or STRING_AUTO eq '1173' or STRING_AUTO eq '1174' or STRING_AUTO eq '1175' or STRING_AUTO eq '1176' or STRING_AUTO eq '1177' or STRING_AUTO eq '1178' or STRING_AUTO eq '1179' or STRING_AUTO eq '1180' or STRING_AUTO eq '1181' or STRING_AUTO eq '1182' or STRING_AUTO eq '1183' or STRING_AUTO eq '1184' or STRING_AUTO eq '1185' or STRING_AUTO eq '1186' or STRING_AUTO eq '1187' or STRING_AUTO eq '1188' or STRING_AUTO eq '1189' or STRING_AUTO eq '1190' or STRING_AUTO eq '1191' or STRING_AUTO eq '1192' or STRING_AUTO eq '1193' or STRING_AUTO eq '1194' or STRING_AUTO eq '1195' or STRING_AUTO eq '1196' or STRING_AUTO eq '1197' or STRING_AUTO eq '1198' or STRING_AUTO eq '1199' or STRING_AUTO eq '1200' or STRING_AUTO eq '1201' or STRING_AUTO eq '1202' or STRING_AUTO eq '1203' or STRING_AUTO eq '1204' or STRING_AUTO eq '1205' or STRING_AUTO eq '1206' or STRING_AUTO eq '1207' or STRING_AUTO eq '1208' or STRING_AUTO eq '1209' or STRING_AUTO eq '1210' or STRING_AUTO eq '1211' or STRING_AUTO eq '1212' or STRING_AUTO eq '1213' or STRING_AUTO eq '1214' or STRING_AUTO eq '1215' or STRING_AUTO eq '1216' or STRING_AUTO eq '1217' or STRING_AUTO eq '1218' or STRING_AUTO eq '1219' or STRING_AUTO eq '1220' or STRING_AUTO eq '1221' or STRING_AUTO eq '1222' or STRING_AUTO eq '1223' or STRING_AUTO eq '1224' or STRING_AUTO eq '1225' or STRING_AUTO eq '1226' or STRING_AUTO eq '1227' or STRING_AUTO eq '1228' or STRING_AUTO eq '1229' or STRING_AUTO eq '1230' or STRING_AUTO eq '1231' or STRING_AUTO eq '1232' or STRING_AUTO eq '1233' or STRING_AUTO eq '1234' or STRING_AUTO eq '1235' or STRING_AUTO eq '1236' or STRING_AUTO eq '1237' or STRING_AUTO eq '1238' or STRING_AUTO eq '1239' or STRING_AUTO eq '1240' or STRING_AUTO eq '1241' or STRING_AUTO eq '1242' or STRING_AUTO eq '1243' or STRING_AUTO eq '1244' or STRING_AUTO eq '1245' or STRING_AUTO eq '1246' or STRING_AUTO eq '1247' or STRING_AUTO eq '1248' or STRING_AUTO eq '1249' or STRING_AUTO eq '1250' or STRING_AUTO eq '1251' or STRING_AUTO eq '1252' or STRING_AUTO eq '1253' or STRING_AUTO eq '1254' or STRING_AUTO eq '1255' or STRING_AUTO eq '1256' or STRING_AUTO eq '1257' or STRING_AUTO eq '1258' or STRING_AUTO eq '1259' or STRING_AUTO eq '1260' or STRING_AUTO eq '1261' or STRING_AUTO eq '1262' or STRING_AUTO eq '1263' or STRING_AUTO eq '1264' or STRING_AUTO eq '1265' or STRING_AUTO eq '1266' or STRING_AUTO eq '1267' or STRING_AUTO eq '1268' or STRING_AUTO eq '1269' or STRING_AUTO eq '1270' or STRING_AUTO eq '1271' or STRING_AUTO eq '1272' or STRING_AUTO eq '1273' or STRING_AUTO eq '1274' or STRING_AUTO eq '1275' or STRING_AUTO eq '1276' or STRING_AUTO eq '1277' or STRING_AUTO eq '1278' or STRING_AUTO eq '1279' or STRING_AUTO eq '1280' or STRING_AUTO eq '1281' or STRING_AUTO eq '1282' or STRING_AUTO eq '1283' or STRING_AUTO eq '1284' or STRING_AUTO eq '1285' or STRING_AUTO eq '1286' or STRING_AUTO eq '1287' or STRING_AUTO eq '1288' or STRING_AUTO eq '1289' or STRING_AUTO eq '1290' or STRING_AUTO eq '1291' or STRING_AUTO eq '1292' or STRING_AUTO eq '1293' or STRING_AUTO eq '1294' or STRING_AUTO eq '1295' or STRING_AUTO eq '1296' or STRING_AUTO eq '1297' or STRING_AUTO eq '1298' or STRING_AUTO eq '1299' or STRING_AUTO eq '1300' or STRING_AUTO eq '1301' or STRING_AUTO eq '1302' or STRING_AUTO eq '1303' or STRING_AUTO eq '1304' or STRING_AUTO eq '1305' or STRING_AUTO eq '1306' or STRING_AUTO eq '1307' or STRING_AUTO eq '1308' or STRING_AUTO eq '1309' or STRING_AUTO eq '1310' or STRING_AUTO eq '1311' or STRING_AUTO eq '1312' or STRING_AUTO eq '1313' or STRING_AUTO eq '1314' or STRING_AUTO eq '1315' or STRING_AUTO eq '1316' or STRING_AUTO eq '1317' or STRING_AUTO eq '1318' or STRING_AUTO eq '1319' or STRING_AUTO eq '1320' or STRING_AUTO eq '1321' or STRING_AUTO eq '1322' or STRING_AUTO eq '1323' or STRING_AUTO eq '1324' or STRING_AUTO eq '1325' or STRING_AUTO eq '1326' or STRING_AUTO eq '1327' or STRING_AUTO eq '1328' or STRING_AUTO eq '1329' or STRING_AUTO eq '1330' or STRING_AUTO eq '1331' or STRING_AUTO eq '1332' or STRING_AUTO eq '1333' or STRING_AUTO eq '1334' or STRING_AUTO eq '1335' or STRING_AUTO eq '1336' or STRING_AUTO eq '1337' or STRING_AUTO eq '1338' or STRING_AUTO eq '1339' or STRING_AUTO eq '1340' or STRING_AUTO eq '1341' or STRING_AUTO eq '1342' or STRING_AUTO eq '1343' or STRING_AUTO eq '1344' or STRING_AUTO eq '1345' or STRING_AUTO eq '1346' or STRING_AUTO eq '1347' or STRING_AUTO eq '1348' or STRING_AUTO eq '1349' or STRING_AUTO eq '1350' or STRING_AUTO eq '1351' or STRING_AUTO eq '1352' or STRING_AUTO eq '1353' or STRING_AUTO eq '1354' or STRING_AUTO eq '1355' or STRING_AUTO eq '1356' or STRING_AUTO eq '1357' or STRING_AUTO eq '1358' or STRING_AUTO eq '1359' or STRING_AUTO eq '1360' or STRING_AUTO eq '1361' or STRING_AUTO eq '1362' or STRING_AUTO eq '1363' or STRING_AUTO eq '1364' or STRING_AUTO eq '1365' or STRING_AUTO eq '1366' or STRING_AUTO eq '1367' or STRING_AUTO eq '1368' or STRING_AUTO eq '1369' or STRING_AUTO eq '1370' or STRING_AUTO eq '1371' or STRING_AUTO eq '1372' or STRING_AUTO eq '1373' or STRING_AUTO eq '1374' or STRING_AUTO eq '1375' or STRING_AUTO eq '1376' or STRING_AUTO eq '1377' or STRING_AUTO eq '1378' or STRING_AUTO eq '1379' or STRING_AUTO eq '1380' or STRING_AUTO eq '1381' or STRING_AUTO eq '1382' or STRING_AUTO eq '1383' or STRING_AUTO eq '1384' or STRING_AUTO eq '1385' or STRING_AUTO eq '1386' or STRING_AUTO eq '1387' or STRING_AUTO eq '1388' or STRING_AUTO eq '1389' or STRING_AUTO eq '1390' or STRING_AUTO eq '1391' or STRING_AUTO eq '1392' or STRING_AUTO eq '1393' or STRING_AUTO eq '1394' or STRING_AUTO eq '1395' or STRING_AUTO eq '1396' or STRING_AUTO eq '1397' or STRING_AUTO eq '1398' or STRING_AUTO eq '1399' or STRING_AUTO eq '1400' or STRING_AUTO eq '1401' or STRING_AUTO eq '1402' or STRING_AUTO eq '1403' or STRING_AUTO eq '1404' or STRING_AUTO eq '1405' or STRING_AUTO eq '1406' or STRING_AUTO eq '1407' or STRING_AUTO eq '1408' or STRING_AUTO eq '1409' or STRING_AUTO eq '1410' or STRING_AUTO eq '1411' or STRING_AUTO eq '1412' or STRING_AUTO eq '1413' or STRING_AUTO eq '1414' or STRING_AUTO eq '1415' or STRING_AUTO eq '1416' or STRING_AUTO eq '1417' or STRING_AUTO eq '1418' or STRING_AUTO eq '1419' or STRING_AUTO eq '1420' or STRING_AUTO eq '1421' or STRING_AUTO eq '1422' or STRING_AUTO eq '1423' or STRING_AUTO eq '1424' or STRING_AUTO eq '1425' or STRING_AUTO eq '1426' or STRING_AUTO eq '1427' or STRING_AUTO eq '1428' or STRING_AUTO eq '1429' or STRING_AUTO eq '1430' or STRING_AUTO eq '1431' or STRING_AUTO eq '1432' or STRING_AUTO eq '1433' or STRING_AUTO eq '1434' or STRING_AUTO eq '1435' or STRING_AUTO eq '1436' or STRING_AUTO eq '1437' or STRING_AUTO eq '1438' or STRING_AUTO eq '1439' or STRING_AUTO eq '1440' or STRING_AUTO eq '1441' or STRING_AUTO eq '1442' or STRING_AUTO eq '1443' or STRING_AUTO eq '1444' or STRING_AUTO eq '1445' or STRING_AUTO eq '1446' or STRING_AUTO eq '1447' or STRING_AUTO eq '1448' or STRING_AUTO eq '1449' or STRING_AUTO eq '1450' or STRING_AUTO eq '1451' or STRING_AUTO eq '1452' or STRING_AUTO eq '1453' or STRING_AUTO eq '1454' or STRING_AUTO eq '1455' or STRING_AUTO eq '1456' or STRING_AUTO eq '1457' or STRING_AUTO eq '1458' or STRING_AUTO eq '1459' or STRING_AUTO eq '1460' or STRING_AUTO eq '1461' or STRING_AUTO eq '1462' or STRING_AUTO eq '1463' or STRING_AUTO eq '1464' or STRING_AUTO eq '1465' or STRING_AUTO eq '1466' or STRING_AUTO eq '1467' or STRING_AUTO eq '1468' or STRING_AUTO eq '1469' or STRING_AUTO eq '1470' or STRING_AUTO eq '1471' or STRING_AUTO eq '1472' or STRING_AUTO eq '1473' or STRING_AUTO eq '1474' or STRING_AUTO eq '1475' or STRING_AUTO eq '1476' or STRING_AUTO eq '1477' or STRING_AUTO eq '1478' or STRING_AUTO eq '1479' or STRING_AUTO eq '1480' or STRING_AUTO eq '1481' or STRING_AUTO eq '1482' or STRING_AUTO eq '1483' or STRING_AUTO eq '1484' or STRING_AUTO eq '1485' or STRING_AUTO eq '1486' or STRING_AUTO eq '1487' or STRING_AUTO eq '1488' or STRING_AUTO eq '1489' or STRING_AUTO eq '1490' or STRING_AUTO eq '1491' or STRING_AUTO eq '1492' or STRING_AUTO eq '1493' or STRING_AUTO eq '1494' or STRING_AUTO eq '1495' or STRING_AUTO eq '1496' or STRING_AUTO eq '1497' or STRING_AUTO eq '1498' or STRING_AUTO eq '1499' or STRING_AUTO eq '1500') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'";
		}());
		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("String auto - test counting", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - Press button to open String Auto dialog
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");

		// Count should stop counting the items
		Then.setCountableTypeToModule("None");

		// Assert - Dialog with the correct title is open
		Then.waitFor({
			controlType: "sap.m.Dialog",
			searchOpenDialogs: true,
			success: function(aDialogs) {
				Opa5.assert.strictEqual(aDialogs[0].getTitle(), "String Auto", 'Dialog title should be "String Auto"');
			},
			errorMessage: "did not find the filters dialog"
		});

		// Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

		// Assert counter didn't change
		Then.waitFor({
			controlType: "sap.m.Label",
			searchOpenDialogs: true,
			matchers: function (oLabel) {
				return oLabel.getText() === oRB.getText("VALUEHELPDLG_TABLETITLENOCOUNT", 1500);
			},
			success: function () {
				Opa5.assert.ok(true, "Counter in Table header should be deactivated and show only 'Items' text ");
			}
		});

		// Count should start counting the items
		Then.setCountableTypeToModule("Request");

        // Act - press the dialog go button to trigger search
		When.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_AUTO-valueHelpDialog-smartFilterBar-btnGo");

		// Assert counter should change
		Then.waitFor({
			controlType: "sap.m.Label",
			searchOpenDialogs: true,
			matchers: function (oLabel) {
				return oLabel.getText() === oRB.getText("VALUEHELPDLG_TABLETITLE1", 1500);
			},
			success: function () {
				Opa5.assert.ok(true, "Counter in Table header should be active and show only 'Items (1500)' text ");
			}
		});

		// Cleanup
		When.iPressTheVHDOKButton();
		When.iPressTheRestoreButton();
	});

	QUnit.module("In/Out parameters");

	opaTest("basic", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1", "foo");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_IN1 eq 'foo'");

		// Act - Open the String InOut VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");
		When.iExpandVHDFilters("smartFilterBar-filterItemControlA_-STRING_INOUT");

		// Assert - in Parameter should be present in the VH Dialog
		Then.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.MultiInput",
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-filterItemControlA_-IN1",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getTokens()[0].getText(), "=foo",
					"'in Param from STRING_SINGLE' field should equal the expected value");
			}
		});

		// Act - press the dialog go button
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Assert - check filter is applied to table and select all rows
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function (oTable) {
				// Assert
				Opa5.assert.strictEqual(oTable.getBindingInfo("rows").filters.length, 1, "Filter is applied to table");

				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").trigger("click");

				// Assert
				Opa5.assert.deepEqual(oTable.getSelectedIndices(), [0, 1], "We should have 2 indices selected");
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Assert - the correct tokens are created in the "String InOut" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 2, "There should be 2 tokens available in the control");
				Opa5.assert.strictEqual(aTokens[0].getKey(), "1", "Key of the first token should match");
				Opa5.assert.strictEqual(aTokens[0].getText(), "Key 1 (1)", "Text of the first token should match");
				Opa5.assert.strictEqual(aTokens[1].getKey(), "2", "Key of the second token should match");
				Opa5.assert.strictEqual(aTokens[1].getText(), "Key 2 (2)", "Text of the second token should match");
			}
		});

		// Assert - correct token is created in "String Out" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens(),
					oToken = aTokens[0],
					oCustomData = oToken.getCustomData()[0];

				Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
				Opa5.assert.strictEqual(oToken.getText(), "=outValue1", "Token with correct text is created");
				Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
				Opa5.assert.propEqual(
					oCustomData.getValue(),
					{
						exclude: false,
						keyField: "STRING_OUT1",
						operation: "EQ",
						tokenText: null,
						value1: "outValue1",
						value2: null
					},
					"Custom data should be as expected"
				);
			}
		});

		// Assert - Date out field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens(),
					oToken = aTokens[0],
					oCustomData = oToken.getCustomData()[0],
					oExcpectedDate = new Date(2014, 11, 5);

				Opa5.assert.strictEqual(aTokens.length, 1, "There should be one token created");
				Opa5.assert.strictEqual(oToken.getText(), "=12/5/14", "Token with correct text is created");
				Opa5.assert.strictEqual(oCustomData.getKey(), "range", "Key of the custom data should be `range`");
				Opa5.assert.propEqual(
					oCustomData.getValue(),
					{
						exclude: false,
						keyField: "STRING_OUT2",
						operation: "EQ",
						tokenText: null,
						value1: {},
						value2: null
					},
					"Custom data should be as expected"
				);
				Opa5.assert.strictEqual(
					oCustomData.getValue().value1.toString(),
					oExcpectedDate.toString(), // "Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)",
					"Date should match"
				);
			}
		});

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_IN1 eq 'foo' and (STRING_INOUT eq '1' or STRING_INOUT eq '2') and STRING_OUT1 eq 'outValue1' and STRING_OUT2 eq datetime'2014-12-05T00:00:00'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("multiple", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - clear the "String In" field
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_IN1","");

		// Act - Open the String InOut VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT");

		// Act - press the dialog go button
		When.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-smartFilterBar-btnGo",
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Act - select all rows
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table",
			controlType: "sap.ui.table.Table",
			searchOpenDialogs: true,
			success: function (oTable) {
				// Act - Check the select All checkbox - not a UI5 control so click should be done directly with jQuery
				// Also note that using oTable.selectAll is not an option due to event not being fired and we rely on it.
				Opa5.getWindow().jQuery("#__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT-valueHelpDialog-table-selall").trigger("click");
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Assert - Correct tokens are present in "String Out" field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT1",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 3, "There should be three tokens created");
				Opa5.assert.strictEqual(aTokens[0].getText(), "=outValue3", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[1].getText(), "=outValue2", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[2].getText(), "=outValue1", "Token with correct text is created");
				Opa5.assert.ok(aTokens.every(function (oToken) {
					return oToken.getCustomData().length === 1;
				}), "All tokens have custom data assigned to them");
			}
		});

		// Assert - Date out field
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_OUT2",
			controlType: "sap.m.MultiInput",
			success: function (oInput) {
				var aTokens = oInput.getTokens();

				Opa5.assert.strictEqual(aTokens.length, 2, "There should be two tokens created");
				Opa5.assert.strictEqual(aTokens[0].getText(), "=12/16/14", "Token with correct text is created");
				Opa5.assert.strictEqual(aTokens[1].getText(), "=12/5/14", "Token with correct text is created");
				Opa5.assert.ok(aTokens.every(function (oToken) {
					return oToken.getCustomData().length === 1;
				}), "All tokens have custom data assigned to them");
			}
		});

		// Act - open the "Date Out" field VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_OUT2");

		// Assert  - there should be 2 defined conditions
		Then.waitFor({
			controlType: "sap.m.P13nConditionPanel",
			searchOpenDialogs: true,
			success: function (aPanels) {
				var oIncludes = aPanels[0],
					aConditions = oIncludes.getConditions(),
					oExcpectedDate1 = new Date(2014, 11, 16, 13, 48, 20),
					oExcpectedDate2 = new Date(2014, 11, 5);

				Opa5.assert.strictEqual(aConditions.length, 2, "There should be 2 conditions");
				Opa5.assert.propEqual(
					aConditions[0],
					{
						exclude: false,
						key: "range_0",
						keyField: "STRING_OUT2",
						operation: "EQ",
						showIfGrouped: undefined,
						text: "=" + oExcpectedDate1.toString(), // Tue Dec 16 2014 13:48:20 GMT+0200 (Eastern European Standard Time)
						value1: {},
						value2: null
					},
					"Correct object is assigned"
				);
				Opa5.assert.propEqual(
					aConditions[1],
					{
						exclude: false,
						key: "range_1",
						keyField: "STRING_OUT2",
						operation: "EQ",
						showIfGrouped: undefined,
						text: "=" + oExcpectedDate2.toString(), // Fri Dec 05 2014 00:00:00 GMT+0200 (Eastern European Standard Time)
						value1: {},
						value2: null
					},
					"Correct object is assigned"
				);
			}
		});

		// Act - press the dialog ok button
		When.iPressTheVHDOKButton();

		// Act - Create filters
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_INOUT eq '1' or STRING_INOUT eq '2' or STRING_INOUT eq '3' or STRING_INOUT eq '4') and (STRING_OUT1 eq 'outValue3' or STRING_OUT1 eq 'outValue2' or STRING_OUT1 eq 'outValue1') and (STRING_OUT2 eq datetime'2014-12-16T00:00:00' or STRING_OUT2 eq datetime'2014-12-05T00:00:00')");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFilterBar it should hide revoked values", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - clear the "String In" field
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE","");

		// Act - Open the String InOut VH
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE");

		// Assert
		Then.iShouldSeeValueHelpDialogWithoutMatchingItsTableData("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog", "String InOut Deprecation code");

		// Act press the dialog go button to trigger search
		When.iPressSearchFieldIconButton("smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog-smartFilterBar-btnGo");

		//Assert counter should change
		Then.waitFor({
			controlType: "sap.m.Label",
			searchOpenDialogs: true,
			success: function (oAllLabels) {
                var oLabel = oAllLabels.filter(function(label) {
                        return label.oParent.sId === "__xmlview0--smartFilterBar-filterItemControlA_-STRING_INOUT_DEPRECATIONCODE-valueHelpDialog-table";
                });

                // Assert panel header should say that 1500 items are selected
				Opa5.assert.strictEqual(oLabel[0].getText(),oRB.getText("VALUEHELPDLG_TABLETITLE1", 4), "Counter in Table header should be active and show only 'Items (4)' text ");
			}
		});

		// Cleanup
		When.iPressTheVHDOKButton();
		When.iPressTheRestoreButton();
	});

	QUnit.module("Validation");

	opaTest("Single input field with associated value list", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "not existing key");
		When.iPressTheFilterGoButton();

		// Assert - Dialog with the correct error message is open
		Then.theErrorDialogIsOpen();

		// Act - close the error dialog
		When.waitFor({
			controlType: "sap.m.Button",
			actions: new Press(),
			searchOpenDialogs: true
		});

		// Assert
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
			}
		});

		// Act - enter a valid string which exist as a key in the associated value list
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_SINGLE", "1");
		When.iPressTheFilterGoButton();

		// Assert
		Then.waitFor({
			id: "smartFilterBar-filterItemControlA_-STRING_SINGLE",
			success: function (oInput) {
				Opa5.assert.strictEqual(oInput.getValueState(), ValueState.None, "Value state should be none");
			}
		});
		Then.theFiltersShouldMatch("STRING_SINGLE eq '1'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Empty for strings");

	opaTest("Empty operation for STRING_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "<empty>");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null)");

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", "!(<empty>)", "Field not found");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRING_AUTO eq '' or STRING_AUTO eq null) and (STRING_AUTO ne '' and STRING_AUTO ne null)");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Empty operation for STRING_AUTO with nullable=false - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO_NOT_NULLABLE", "<empty>");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_AUTO_NOT_NULLABLE eq ''");

		// Act
		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO_NOT_NULLABLE", "!(<empty>)", "Field not found");
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRING_AUTO_NOT_NULLABLE eq '' and STRING_AUTO_NOT_NULLABLE ne ''");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Empty for dates");

	opaTest("Empty operation for STRINGDATE_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO");

		When.iSelectOperation("Empty");
		When.iPressTheFilterAddButton();
		When.iSelectOperation("NotEmpty", true);

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("(STRINGDATE_AUTO eq '' or STRINGDATE_AUTO eq null) and (STRINGDATE_AUTO ne '' and STRINGDATE_AUTO ne null)");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	opaTest("Empty operation for STRINGDATE_AUTO auto nullable=false - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRINGDATE_AUTO_NOT_NULLABLE");

		When.iSelectOperation("Empty");
		When.iPressTheFilterAddButton();
		When.iSelectOperation("NotEmpty", true);

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("STRINGDATE_AUTO_NOT_NULLABLE eq '' and STRINGDATE_AUTO_NOT_NULLABLE ne ''");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	[
		{
			name: "DATE_AUTO",
			controlId: "smartFilterBar-filterItemControlDate.Group-DATE_AUTO",
			expected: "DATE_AUTO eq null and DATE_AUTO ne null"
		},
		{
			name: "DTOFFSET_AUTO",
			controlId: "smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO",
			expected: "DTOFFSET_AUTO eq null and DTOFFSET_AUTO ne null"
		},
		{
			name: "DATETIME_AUTO",
			controlId: "smartFilterBar-filterItemControlA_-DATETIME_AUTO",
			expected: "DATETIME_AUTO eq null and DATETIME_AUTO ne null"
		}
	].forEach(function (oField) {
		opaTest("Empty operation for " + oField.name + " - include and exclude", function (Given, When, Then) {
			// Arrange
			Given.iEnsureMyAppIsRunning();

			// Act
			When.iOpenTheVHD(oField.controlId);

			When.iSelectOperation("Empty");
			When.iPressTheFilterAddButton();
			When.iSelectOperation("NotEmpty", true);

			When.iPressTheVHDOKButton();
			When.iPressTheFilterGoButton();

			// Assert
			Then.theFiltersShouldMatch(oField.expected);

			// Cleanup
			When.iPressTheRestoreButton();
		});
	});

	opaTest("No empty operation for DATE_AUTO, DATETIME_AUTO and DTOFFSET_AUTO - include and exclude", function (Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act - DATE_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_AUTO_NOT_NULLABLE");

		// Assert
		Then.thereIsNoEmptyOperation("DATE_AUTO_NOT_NULLABLE");
		Then.thereIsNoEmptyOperation("DATE_AUTO_NOT_NULLABLE", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Act - DATETIME_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-DATETIME_AUTO_NOT_NULLABLE");

		// Assert
		Then.thereIsNoEmptyOperation("DATETIME_AUTO_NOT_NULLABLE");
		Then.thereIsNoEmptyOperation("DATETIME_AUTO_NOT_NULLABLE", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Act - DTOFFSET_AUTO
		When.iOpenTheVHD("smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO_NOT_NULLABLE");

		// Assert
		Then.thereIsNoEmptyOperation("DTOFFSET_AUTO_NOT_NULLABLE");
		Then.thereIsNoEmptyOperation("DTOFFSET_AUTO_NOT_NULLABLE", true);

		// Arrange
		When.iPressTheVHDOKButton();

		// Cleanup
		When.iPressTheRestoreButton();
	});

	QUnit.module("Exclude operations");

	opaTest("String operations", function (Given, When, Then) {
		// Arrangements
		var aConditions = [
				{operation: "does not contain", input1: "A"},
				{operation: "not equal to", input1: "B"},
				{operation: "not between", input1: "C", input2: "D"},
				{operation: "does not start with", input1: "E"},
				{operation: "does not end with", input1: "F"},
				{operation: "not less than", input1: "G"},
				{operation: "not less than or equal to", input1: "H"},
				{operation: "not greater than", input1: "I"},
				{operation: "not greater than or equal to", input1: "J"}
			],
			iCondition = 0;

		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_AUTO");
		When.iNavigateToTheDefineConditionsTab();

		aConditions.forEach(function (oCondition) {
			When.iChangeTheCondition(oCondition.operation, true, iCondition)
				.and.iEnterTextInConditionField(
				true,
				iCondition,
				oCondition.input1,
				(oCondition.input2 ? oCondition.input2 : undefined)
			);

			When.iPressTheFilterAddButton();
			iCondition++;
		});

		When.iPressTheVHDOKButton();
		When.iPressTheFilterGoButton();

		// Assert
		Then.theFiltersShouldMatch("not substringof('A',STRING_AUTO) and STRING_AUTO ne 'B' and not (STRING_AUTO ge 'C' and STRING_AUTO le 'D') and not startswith(STRING_AUTO,'E') and not endswith(STRING_AUTO,'F') and STRING_AUTO ge 'G' and STRING_AUTO gt 'H' and STRING_AUTO le 'I' and STRING_AUTO lt 'J'");

		// Cleanup
		When.iPressTheRestoreButton();
	});

	// opaTest("String operations from tokens", function (Given, When, Then) {
	// 	// Arrange
	// 	Given.iEnsureMyAppIsRunning();

	// 	// Act
	// 	["!*AAA*", "!=BBB", "!CCC...DDD", "!EEE*", "!*FFF", "!<GGG", "!<=HHH", "!>III", "!>=JJJ"].forEach(function (sToken) {
	// 		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
	// 	});

	// 	When.iPressTheFilterGoButton();

	// 	// Assert
	// 	Then.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

	// 	// Cleanup
	// 	When.iPressTheRestoreButton();
	// });

	// opaTest("String operations from tokens - alternative input - copy & paste scenario", function (Given, When, Then) {
	// 	// Arrange
	// 	Given.iEnsureMyAppIsRunning();

	// 	// Act
	// 	["!(*AAA*)", "!(=BBB)", "!(CCC...DDD)", "!(EEE*)", "!(*FFF)", "!(<GGG)", "!(<=HHH)", "!(>III)", "!(>=JJJ)"].forEach(function (sToken) {
	// 		When.iEnterStringInFiled("smartFilterBar-filterItemControlA_-STRING_AUTO", sToken);
	// 	});

	// 	When.iPressTheFilterGoButton();

	// 	// Assert
	// 	Then.theFiltersShouldMatch("not substringof('AAA',STRING_AUTO) and STRING_AUTO ne 'BBB' and not (STRING_AUTO ge 'CCC' and STRING_AUTO le 'DDD') and not startswith(STRING_AUTO,'EEE') and not endswith(STRING_AUTO,'FFF') and STRING_AUTO ge 'GGG' and STRING_AUTO gt 'HHH' and STRING_AUTO le 'III' and STRING_AUTO lt 'JJJ'");

	// 	// Cleanup
	// 	When.iPressTheRestoreButton();
	// });

	QUnit.module("Value help dialog");

	opaTest("When I use the ValueHelp dialog should take over a value into the basic search", function (Given, When, Then) {
		// Arrange
		var sControlName = "__xmlview0--smartFilterBar-filterItemControlA_-STRING_SINGLE";
		Given.iEnsureMyAppIsRunning();

		// Act - enter a valid date directly in the input
		When.iEnterStringInFiled(sControlName, "1","",true);
		When.iPressValueHelpIcon(sControlName + "-vhi");

		// Assert
		Then.iShouldSeeValueHelpDialog(sControlName + "-valueHelpDialog", 1, 1);

		// Cleanup
		When.iPressTheVHDCancelButton();
		When.iPressTheRestoreButton();
	});

	// QUnit.module("Adapt Filters");

	// opaTest("Adding more filters should not trigger scrolling to top", function (Given, When, Then) {
	// 	// Arrange
	// 	Given.iEnsureMyAppIsRunning();

	// 	// Actions
	// 	When.iOpenTheAdaptFiltersDialog();

	// 	// Act - Find the first More filters
	// 	When.waitFor({
	// 		controlType: "sap.m.Button",
	// 		searchOpenDialogs: true,
	// 		actions: new Press(),
	// 		matchers: function (oControl) {
	// 			return oControl.getId().indexOf("expandButton") !== -1;
	// 		}
	// 	});

	// Act - Scroll down to the last item
	// 	When.waitFor({
	// 		controlType: "sap.m.Label",
	// 		searchOpenDialogs: true,
	// 		matchers: new PropertyStrictEquals({
	// 			name: "text",
	// 			value: "ZEPM_C_SALESORDERITEMQUERYResults"
	// 		}),
	// 		actions: function (oLabel) {
	// 			// Scroll down
	// 			oLabel.getDomRef().scrollIntoView();
	// 		}
	// 	});

	// Assert - we successfully scrolled
	// 	When.waitFor({
	// 		controlType: "sap.m.Dialog",
	// 		searchOpenDialogs: true,
	// 		success: function (aDialogs) {
	// 			Opa5.assert.ok(
	// 				aDialogs[0].$().find(".sapMDialogSection").scrollTop() > 0,
	// 				"scrollTop is greater than zero."
	// 			);
	// 		}
	// 	});

	// Assert - we are not at the top of the scroll
	// 	When.waitFor({
	// 		controlType: "sap.m.Dialog",
	// 		searchOpenDialogs: true,
	// 		success: function (aDialogs) {
	// 			Opa5.assert.ok(
	// 				aDialogs[0].$().find(".sapMDialogSection").scrollTop() > 0,
	// 				"scrollTop is greater than zero."
	// 			);
	// 		}
	// 	});

	// 	// Cleanup
	// 	When.iPressTheAdaptFiltersGoButton();
	// 	When.iPressTheRestoreButton();
	// });

	QUnit.start();
});
