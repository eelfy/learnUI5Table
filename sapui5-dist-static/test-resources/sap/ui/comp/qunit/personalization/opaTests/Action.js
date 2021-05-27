/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/Ancestor",
	"./Util",
	"sap/ui/comp/state/UIState",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/actions/EnterText",
	"sap/ui/Device"
], function(
	Opa5,
	Press,
	Properties,
	Ancestor,
	TestUtil,
	UIState,
	PropertyStrictEquals,
	AggregationContainsPropertyEqual,
	EnterText,
	Device
) {
	"use strict";

	var iRemoveAConditionLine = function(oP13nConditionPanel, iIndex, bIsFilterLine) {
		this.waitFor({
			controlType: "sap.ui.layout.Grid",
			matchers: new Ancestor(oP13nConditionPanel),
			success: function(aGrids) {
				var oGrid = aGrids[iIndex + 1];
				this.waitFor({
					controlType: "sap.m.Button",
					matchers: [
						new Ancestor(oGrid, false),
						new PropertyStrictEquals({
							name: "icon",
							value: bIsFilterLine ? "sap-icon://decline" : "sap-icon://sys-cancel"
						})
					],
					actions: new Press()
				});
			}
		});
	};

	var waitForPanel = function(oSettings) {
		return this.waitFor({
			controlType: "sap.m.Panel",
			searchOpenDialogs: true,
			actions: oSettings.actions,
			success: oSettings.success
		});
	};

	var waitForP13nConditionPanelOfPanel = function(oSettings) {
		return waitForPanel.call(this, {
			success: function(aPanels) {
				var oPanel = aPanels[0];
				this.waitFor({
					controlType: "sap.ui.comp.p13n.P13nConditionPanel",
					matchers: new Ancestor(oPanel),
					actions: oSettings.actions,
					success: oSettings.success
				});
			}
		});
	};

	/**
	 * The Action can be used to...
	 *
	 * @class Action
	 * @extends sap.ui.test.Opa5
	 * @author SAP
	 * @private
	 * @alias sap.ui.comp.qunit.personalization.test.Action
	 */
	var Action = Opa5.extend("sap.ui.comp.qunit.personalization.test.Action", {

		iLookAtTheScreen: function() {
			return this;
		},

		iPressOnPersonalizationButton: function(bWaitForVariant) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://action-settings"
				}),
				actions: (Device.browser.msie || Device.browser.edge) && bWaitForVariant ? function(oControl) {
					// added 1000ms delay for IE and Edge as the animation for applying the variant takes more time than in other browsers
					setTimeout(function() {
						(new Press()).executeOn(oControl);
					}, 1000);
				} : new Press()
			});
		},

		iClickOnTheCheckboxSelectAll: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				check: function(aCheckboxes) {
					return aCheckboxes.filter(function(oCheckbox) {
						if (jQuery.sap.endsWith(oCheckbox.getId(), '-sa')) {
							return true;
						}
						return false;
					});
				},
				actions: new Press()
			});
		},

		iClickOnTheCheckboxShowFieldAsColumn: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.CheckBox",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_LABELGROUPING")
				}),
				success: function(aCheckBoxes) {
					Opa5.assert.equal(aCheckBoxes.length, 1, "One CheckBox found");
				},
				actions: new Press()
			});
		},

		iNavigateToPanel: function(sPanelName) {
			var sNavigationControlType = sap.ui.Device.system.phone ? "sap.m.List" : "sap.m.SegmentedButton",
				sInnerControlType = sap.ui.Device.system.phone ? "sap.m.StandardListItem" : "sap.m.Button",
				sInnerControlPropertyName = sap.ui.Device.system.phone ? "title" : "text";
			return this.waitFor({
				controlType: sNavigationControlType,
				success: function(aNavigationControls) {
					var oNavigationControl = aNavigationControls[0];
					this.waitFor({
						controlType: sInnerControlType,
						matchers: [
							new Ancestor(oNavigationControl),
							new PropertyStrictEquals({
								name: sInnerControlPropertyName,
								value: sPanelName
							})
						],
						actions: new Press()
					});
				}
			});
		},

		iSelectColumn: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.ColumnListItem",
				matchers: new AggregationContainsPropertyEqual({
					aggregationName: "cells",
					propertyName: "text",
					propertyValue: sColumnName
				}),
				success: function(aColumnListItems) {
					var oColumnListItem = aColumnListItems[0];
					this.waitFor({
						controlType: "sap.m.CheckBox",
						matchers: new Ancestor(oColumnListItem),
						actions: new Press()
					});
				}
			});
		},

		iRemoveASortLine: function(iIndex) {
			return this.waitFor({
				controlType: "sap.m.P13nSortPanel",
				success: function(aP13nSortPanels) {
					var oP13nSortPanel = aP13nSortPanels[0];
					this.waitFor({
						controlType: "sap.m.P13nConditionPanel",
						matchers: new Ancestor(oP13nSortPanel),
						success: function(aP13nConditionPanels) {
							var oP13nConditionPanel = aP13nConditionPanels[0];
							iRemoveAConditionLine.call(this, oP13nConditionPanel, iIndex, false);
						}
					});
				}
			});
		},

		iRemoveAGroupLine: function(iIndex) {
			return this.waitFor({
				controlType: "sap.m.P13nGroupPanel",
				success: function(aP13nGroupPanels) {
					var oP13nGroupPanel = aP13nGroupPanels[0];
					this.waitFor({
						controlType: "sap.m.P13nConditionPanel",
						matchers: new Ancestor(oP13nGroupPanel),
						success: function(aP13nConditionPanels) {
							var oP13nConditionPanel = aP13nConditionPanels[0];
							iRemoveAConditionLine.call(this, oP13nConditionPanel, iIndex, false);
						}
					});
				}
			});
		},

		iRemoveAFilterLine: function(iIndex) {
			if (iIndex === undefined) {
				iIndex = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					iRemoveAConditionLine.call(this, oP13nConditionPanel, iIndex, true);
				}
			});
		},

		iPressRestoreButton: function() {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				success: function(aP13nDialogs) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_RESET")
							}),
							new PropertyStrictEquals({
								name: "enabled",
								value: true
							})
						],
						actions: new Press(),
						errorMessage: "Could not find the 'Restore' button"
					});
				}
			});
		},

		iPressCancelButton: function() {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				success: function(aP13nDialogs) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_CANCEL")
						}),
						actions: new Press(),
						errorMessage: "Could not find the 'Cancel' button"
					});
				}
			});
		},

		iPressEscape: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Dialog",
				success: function(aDialogs) {
					aDialogs[0].$().trigger(jQuery.Event("keydown", { keyCode: 27 }));
				}
			});
		},

		iPressOkButton: function() {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				success: function(aP13nDialogs) {
					this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.m", "P13NDIALOG_OK")
						}),
						actions: new Press(),
						errorMessage: "Could not find the 'OK' button"
					});
				}
			});
		},

		iPressDeleteRowButton: function(iIndex) {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://decline"
				}),
				success: function(aButtons) {
					if (iIndex < aButtons.length) {
						new Press().executeOn(aButtons[iIndex]);
					}
				}
			});
		},

		iChangeSortSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sTextOld
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "SortSelections Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sTextNew
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sTextNew, "SortSelection changed to '" + sTextNew + "'");
						},
						errorMessage: "Cannot select '" + sTextNew + "' from SortSelections Combobox"
					});
				}
			});
		},
		iChangeGroupSelection: function(sTextOld, sTextNew) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sTextOld
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "GroupSelections Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sTextNew
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sTextNew, "GroupSelection changed to '" + sTextNew + "'");
						},
						errorMessage: "Cannot select '" + sTextNew + "' from GroupSelections Combobox"
					});
				}
			});
		},

		iClickOnComboBox: function(sValue) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "value",
					value: sValue
				}),
				success: function(aComboBoxes) {
					new Press().executeOn(aComboBoxes[0]);
				}
			});
		},

		iClickOnSelect: function(sValue) {
			return this.waitFor({
				controlType: "sap.m.Select",
				matchers: new PropertyStrictEquals({
					name: "selectedKey",
					value: sValue
				}),
				success: function(aSelectLists) {
					new Press().executeOn(aSelectLists[0]);
				}
			});
		},

		iChangeTheCondition: function(sNewCondition, iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aGrids) {
									var oGrid = aGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.ComboBox",
										matchers: [
											new Ancestor(oGrid),
											new AggregationContainsPropertyEqual({
												aggregationName: "items",
												propertyName: "text",
												propertyValue: "Include"
											})
										],
										actions: new Press(),
										success: function(aComboBoxes) {
											var oComboBox = aComboBoxes[0];
											this.waitFor({
												controlType: "sap.m.StandardListItem",
												matchers: [
													new Ancestor(oComboBox),
													new PropertyStrictEquals({
														name: "title",
														value: sNewCondition
													})
												],
												actions: new Press(),
												timeout: 20
											});
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iChangeTheFilterField: function(sNewField, iCondition) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aConditionGrids) {
									var oConditionGrid = aConditionGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.ComboBox",
										matchers: [
											new Ancestor(oConditionGrid)
										],
										success: function(aComboBoxes) {
											var oComboBox = aComboBoxes[0];
											this.waitFor({
												controlType: "sap.ui.core.Icon",
												matchers: [
													new Ancestor(oComboBox)
												],
												actions: [
													new Press()
												],
												success: function() {
													this.waitFor({
														controlType: "sap.m.StandardListItem",
														matchers: [
															new Ancestor(oComboBox),
															new PropertyStrictEquals({
																name: "title",
																value: sNewField
															})
														],
														actions: new Press(),
														timeout: 20
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iPressTheFilterAddButton: function() {
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						matchers: [
							new Ancestor(oP13nConditionPanel),
							new PropertyStrictEquals({
								name: "tooltip",
								value: TestUtil.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_ADD_FILTER_TOOLTIP")
							}),
							new PropertyStrictEquals({
								name: "text",
								value: "Add"
							})
						],
						actions: new Press()
					});
				}
			});
		},

		iEnterTextInConditionField: function(iCondition, sText1, sText2) {
			if (iCondition === undefined) {
				iCondition = 0;
			}

			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oWrapperGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.ui.layout.Grid",
								matchers: new Ancestor(oWrapperGrid),
								success: function(aConditionGrids) {
									var oConditionGrid = aConditionGrids[iCondition];
									this.waitFor({
										controlType: "sap.m.Input",
										matchers: new Ancestor(oConditionGrid),
										success: function(aInputs) {
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
								}
							});
						}
					});
				}
			});
		},

		iOpenTheP13nDialogAndNavigateToTheFilterTab: function() {
			this.iPressOnPersonalizationButton().and.iNavigateToPanel(TestUtil.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		},

		iChangeSelectSelection: function(sNew) {
			return waitForP13nConditionPanelOfPanel.call(this, {
				success: function(aP13nConditionPanels) {
					var oP13nConditionPanel = aP13nConditionPanels[0];
					this.waitFor({
						controlType: "sap.ui.layout.Grid",
						matchers: new Ancestor(oP13nConditionPanel, true),
						success: function(aGrids) {
							var oGrid = aGrids[0];
							this.waitFor({
								controlType: "sap.m.Select",
								matchers: new Ancestor(oGrid),
								actions: new Press(),
								success: function(aSelects) {
									var oSelect = aSelects[0];
									this.waitFor({
										controlType: "sap.m.SelectList",
										matchers: new Ancestor(oSelect, false),
										success: function(aSelectLists) {
											var oSelectList = aSelectLists[0];
											this.waitFor({
												controlType: "sap.ui.core.Item",
												matchers: [
													new Ancestor(oSelectList),
													new PropertyStrictEquals({
														name: "text",
														value: sNew
													})
												],
												actions: new Press()
											});
										}
									});
								}
							});
						}
					});
				}
			});
		},

		iEnterTextInInput: function(sPlaceHolder, sText) {
			return this.waitFor({
				controlType: "sap.m.Input",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				success: function(aInput) {
					return new EnterText({
						text: sText
					}).executeOn(aInput[0]);
				}
			});
		},

		iEnterTextInDatePicker: function(sPlaceHolder, sText) {
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: sPlaceHolder
				}),
				actions: new EnterText({
					text: sText
				})
			});
		},

		iChangeFilterSelectionToDate: function(sDate) {
			return this.waitFor({
				controlType: "sap.m.DatePicker",
				success: function(aDatePickers) {
					var oDatePicker = aDatePickers[0];
					oDatePicker.setValue(sDate);
				}
			});
		},

		iChangeComboBoxWithChartTypeTo: function(sChartTypeText) {
			return this.waitFor({
				controlType: "sap.m.ComboBox",
				matchers: new PropertyStrictEquals({
					name: "placeholder",
					value: TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
				}),
				actions: new Press(),
				success: function(aComboBoxes) {
					Opa5.assert.equal(aComboBoxes.length, 1, "ChartType Combobox found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						matchers: [
							new Ancestor(aComboBoxes[0]), new Properties({
								title: sChartTypeText
							})
						],
						actions: new Press(),
						success: function(aCoreItems) {
							Opa5.assert.equal(aCoreItems[0].getTitle(), sChartTypeText, "ChartType changed to '" + sChartTypeText + "'");
						},
						errorMessage: "Cannot select '" + sChartTypeText + "' from ChartType Combobox"
					});
				}
			});
		},

		// iChangeRoleOfColumnTo: function(sColumnName, sRole) {
		// this.waitFor({
		// controlType: "sap.m.ColumnListItem",
		// });
		// return this.waitFor({
		// controlType: "sap.m.Select",
		// matchers: new PropertyStrictEquals({
		// name: "text",
		// value: "Category"//TestUtil.getTextFromResourceBundle("sap.m", "COLUMNSPANEL_CHARTTYPE")
		// }),
		// actions: new EnterText({
		// text: sRole
		// })
		// // success: function(aSelects) {
		// // var aSelect = aSelects.filter(function(oSelect) {
		// // return oSelect.getParent().getCells()[0].getText() === sColumnName;
		// // });
		// // Opa5.assert.equal(aSelect.length, 1);
		// // aSelect[0].getFocusDomRef().value = sRole;
		// // // sap.ui.qunit.QUnitUtils.triggerEvent("input", oT);
		// // aSelect[0].$().trigger("tap");
		// // // oSelect.onSelectionChange();
		// // }
		// });
		// },

		iPressBackButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "type",
					value: "Back"
				}),
				actions: new Press()
			});
		},

		iSetDataSuiteFormat: function(sControlType, oDataSuiteFormat) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1, "'" + sControlType + "' has been found");
					aControls[0].setUiState(new UIState({
						presentationVariant: oDataSuiteFormat
					}));
				}
			});
		},

		iSelectVariant: function(sVariantName) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				actions: new Press(),
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					var oSmartVariantManagement = aSmartVariantManagements[0];
					this.waitFor({
						controlType: "sap.m.SelectList",
						matchers: new Ancestor(oSmartVariantManagement),
						success: function(aSelectLists) {
							Opa5.assert.equal(aSelectLists.length, 1, "SmartVariantManagement SelectList found");
							var oSelectList = aSelectLists[0];
							this.waitFor({
								controlType: "sap.ui.comp.variants.VariantItem",
								matchers: [
									new Ancestor(oSelectList),
									new PropertyStrictEquals({
										name: "text",
										value: sVariantName
									})
								],
								success: function(aVariantItems) {
									Opa5.assert.equal(aVariantItems.length, 1, "Variant '" + sVariantName + "' found");
								},
								actions: Device.browser.msie || Device.browser.edge ? function(oControl) {
									// added 500ms delay for IE and Edge as the animation for opening the SelectList takes more time than in other browsers
									setTimeout(function() {
										(new Press()).executeOn(oControl);
									}, 500);
								} : new Press(),
								errorMessage: "Cannot select '" + sVariantName + "' from VariantManagement"
							});
						}
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iSaveVariantAs: function(sVariantNameOld, sVariantNameNew) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
				matchers: new PropertyStrictEquals({
					name: "defaultVariantKey",
					value: "*standard*"
				}),
				actions: new Press(),
				success: function(aSmartVariantManagements) {
					Opa5.assert.equal(aSmartVariantManagements.length, 1, "SmartVariantManagement found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVEAS")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'Save As' button found");
							this.waitFor({
								controlType: "sap.m.Input",
								matchers: new PropertyStrictEquals({
									name: "value",
									value: sVariantNameOld
								}),
								actions: new EnterText({
									text: sVariantNameNew
								}),
								success: function(aInputs) {
									Opa5.assert.ok(aInputs[0].getValue() === sVariantNameNew, "Input value is set to '" + sVariantNameNew + "'");
									this.waitFor({
										controlType: "sap.m.Button",
										matchers: new PropertyStrictEquals({
											name: "text",
											value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "VARIANT_MANAGEMENT_SAVE")
										}),
										actions: new Press(),
										success: function(aButtons) {
											Opa5.assert.equal(aButtons.length, 1, "'OK' button found");
										}
									});
								}
							});
						},
						errorMessage: "Cannot find 'Save As' button on VariantManagement"
					});
				},
				errorMessage: "Could not find SmartVariantManagement"
			});
		},

		iExcludeColumnKeysOnControl: function(aColumnKeys, sControlType) {
			return this.waitFor({
				controlType: sControlType,
				success: function(aControls) {
					Opa5.assert.equal(aControls.length, 1);
					aControls[0].deactivateColumns(aColumnKeys);
				}
			});
		},

		iFreezeColumn: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.Table",
				success: function(aTables) {
					Opa5.assert.equal(aTables.length, 1, "'sap.ui.table.Table' found");
					var aColumn = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getLabel().getText() === sColumnName;
					});
					Opa5.assert.equal(aColumn.length, 1, "Column '" + sColumnName + "' found");
					Opa5.assert.equal(aColumn[0].getVisible(), true, "Column '" + sColumnName + "' is visible");
					var aVisibleColumns = aTables[0].getColumns().filter(function(oColumn) {
						return oColumn.getVisible() === true;
					});
					aTables[0].setFixedColumnCount(aVisibleColumns.indexOf(aColumn[0]) + 1);
					Opa5.assert.ok(aVisibleColumns.indexOf(aColumn[0]) > -1, true, "Column '" + sColumnName + "' is fixed on position " + (aVisibleColumns.indexOf(aColumn[0]) + 1));
				}
			});
		},

		iPressOnDrillUpButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-up"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillUp' button found");
				},
				errorMessage: "DrillUp button could not be found"
			});
		},
		iPressOnDrillDownButton: function(sDimensionName) {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://drill-down"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'DrillDown' button found");
					this.waitFor({
						controlType: "sap.m.StandardListItem",
						// Retrieve all list items in the table
						matchers: [
							function(oStandardListItem) {
								return oStandardListItem.getTitle() === sDimensionName;
							}
						],
						actions: new Press(),
						success: function(aStandardListItems) {
							Opa5.assert.equal(aStandardListItems.length, 1);
							Opa5.assert.equal(aStandardListItems[0].getTitle(), sDimensionName, "List item '" + sDimensionName + "' has been found");
						},
						errorMessage: "Dimension '" + sDimensionName + "' could not be found in the list"
					});
				},
				errorMessage: "DrillDown button could not be found"
			});
		},

		iPressOnIgnoreButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: "Ignore"
				}),
				actions: new Press()
			});
		},

		iPressOnMoveToBottomButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://expand-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Botton' button found");
				},
				errorMessage: "'Move To Botton' button could not be found"
			});
		},
		iPressOnMoveToTopButton: function() {
			return this.waitFor({
				controlType: "sap.m.OverflowToolbarButton",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://collapse-group"
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Move to Top' button found");
				},
				errorMessage: "'Move to Top' button could not be found"
			});
		},
		iPressOnControlWithText: function(sControlType, sText) {
			return this.waitFor({
				id: this.getContext()[sText],
				controlType: sControlType,
				actions: new Press(),
				errorMessage: "The given control was not pressable"
			});
		},
		iPressOnMoreLinksButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "The 'More Links' button found");
				}
			});
		},
		iPressOnStartRtaButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "icon",
					value: "sap-icon://wrench"
				}),
				actions: new Press()
			});
		},
		iWaitUntilTheBusyIndicatorIsGone: function(sId) {
			return this.waitFor({
				id: sId,
				check: function(oRootView) {
					return !!oRootView && oRootView.getBusy() === false;
				},
				success: function() {
					Opa5.assert.ok(true, "the App is not busy anymore");
				},
				errorMessage: "The app is still busy.."
			});
		},
		iPressOnSettingsOfContextMenu: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "CTX_SETTINGS")
				}),
				actions: new Press(),
				errorMessage: "The Settings of context menu was not pressable"
			});
		},
		iPressOnRtaResetButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_RESTORE")
				}),
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Reset' button found");
					this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BTN_FREP_OK")
						}),
						actions: new Press(),
						success: function(aButtons) {
							Opa5.assert.equal(aButtons.length, 1, "'OK' button of the warning dialog found");
						}
					});
				}
			});
		},

		iPressOnRtaSaveButton: function(bWithReload) {
			var oResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: function(oButton) {
					return oButton.$().closest(".sapUiRtaToolbar").length > 0 && oButton.getProperty("text") === oResources.getText("BTN_EXIT");
				},
				actions: new Press(),
				success: function(aButtons) {
					Opa5.assert.equal(aButtons.length, 1, "'Save & Exit' button found");
					if (bWithReload) {
						this.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: TestUtil.getTextFromResourceBundle("sap.ui.rta", "BUTTON_RELOAD_NEEDED")
							}),
							actions: new Press(),
							success: function(aButtons) {
								Opa5.assert.equal(aButtons.length, 1, "'Reload' button of the info dialog found");
							}
						});
					}
				}
			});
		},

		iPressColumnHeader: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.ui.table.AnalyticalColumn",
				matchers: new PropertyStrictEquals({
					name: "tooltip",
					value: sColumnName
				}),
				actions: new Press(),
				success: function(aAnalyticalColumn) {
					Opa5.assert.equal(aAnalyticalColumn.length, 1, "analyticalColumn " + sColumnName + " found");
				},
				errorMessage: "Could not find AnalyticalColumn " + sColumnName
			});
		}
	});

	return Action;
}, true);
