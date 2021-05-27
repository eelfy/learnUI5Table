/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/f/library",
	"sap/ui/core/sample/common/Helper",
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Properties"
], function (library, Helper, Opa5, EnterText, Press, Properties) {
	"use strict";
	var LayoutType = library.LayoutType,
		sViewName = "sap.ui.core.sample.odata.v4.FlexibleColumnLayout.Main";

	Opa5.createPageObjects({
		onTheApplication : {
			actions : {
				closeDialog : function (sTitle) {
					return this.waitFor({
						controlType : "sap.m.Dialog",
						matchers : new Properties({title : sTitle}),
						success : function (aControls) {
							new Press().executeOn(aControls[0].getButtons()[0]);
							Opa5.assert.ok(true, "Success Dialog closed");
						}
					});
				},
				pressCancel : function () {
					return Helper.pressButton(this, sViewName, "cancel");
				},
				pressSave : function () {
					return Helper.pressButton(this, sViewName, "save");
				}
			},
			assertions : {
				checkMessagesButtonCount : function (iExpectedCount) {
					return this.waitFor({
						controlType : "sap.m.Button",
						id : "showMessages",
						success : function (oButton) {
							Opa5.assert.strictEqual(parseInt(oButton.getText()), iExpectedCount,
								"Message count is as expected: " + iExpectedCount);
						},
						viewName : sViewName
					});
				},
				checkObjectPageNotVisible : function () {
					return this.waitFor({
						controlType : "sap.f.FlexibleColumnLayout",
						id : "layout",
						success : function (oLayout) {
							Opa5.assert.strictEqual(oLayout.getLayout(), LayoutType.OneColumn,
								"Object page not visible");
						},
						viewName : sViewName
					});
				},
				checkSubObjectPageNotVisible : function () {
					return this.waitFor({
						controlType : "sap.f.FlexibleColumnLayout",
						id : "layout",
						success : function (oLayout) {
							Opa5.assert.strictEqual(oLayout.getLayout(),
								LayoutType.TwoColumnsMidExpanded, "Sub-object page not visible");
						},
						viewName : sViewName
					});
				}
			}
		},
		onTheListReport : {
			actions : {
				filterByGrossAmount : function (sGrossAmount) {
					return this.waitFor({
						actions: new EnterText({clearTextFirst: true, text: sGrossAmount}),
						controlType : "sap.m.SearchField",
						id : "filterGrossAmount",
						success : function (oSearchField) {
							Opa5.assert.ok(true, "Filter by GrossAmount gt :" + sGrossAmount);
						},
						viewName : sViewName
					});
				},
				refresh : function () {
					return Helper.pressButton(this, sViewName, "refreshSalesOrderList");
				},
				selectSalesOrder : function (iRow) {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Text",
						id : /salesOrderId/,
						matchers : function (oControl) {
							return oControl.getBindingContext().getIndex() === iRow;
						},
						success : function (aControls) {
							Opa5.assert.ok(true, "Sales Order selected: " + aControls[0].getText());
						},
						viewName : sViewName
					});
				},
				sortBySalesOrderID  : function () {
					return Helper.pressButton(this, sViewName, "sortBySalesOrderId");
				}
			},
			assertions : {
				checkSalesOrder : function (iRow, sSalesOrderID, sNote) {
					Helper.waitForSortedByID(this, {
						controlType : "sap.m.Text",
						id : /salesOrderId|salesOrderNote/,
						matchers : function (oControl) {
							return oControl.getBindingContext().getIndex() === iRow;
						},
						success : function (aControls) {
							Opa5.assert.strictEqual(aControls[0].getText(), sSalesOrderID,
								"Sales Order Id is " + sSalesOrderID);
							Opa5.assert.strictEqual(aControls[1].getText(), sNote,
								"Note is " + sNote);
						},
						viewName : sViewName
					});
				},
				checkSalesOrderNotInTheList : function (sSalesOrderID) {
					this.waitFor({
						controlType : "sap.m.Text",
						id : /salesOrderId/,
						success : function (aControls) {
							Opa5.assert.ok(
								aControls.every(function (oControl) {
									return oControl.getText() !== sSalesOrderID;
								}), "Sales Order '" + sSalesOrderID + "' not found"
							);
						},
						viewName : sViewName
					});
				},
				checkSalesOrdersCount : function (iCount) {
					Helper.waitForSortedByID(this, {
						id : /SalesOrderList-trigger|salesOrderListTitle/,
						success : function (aControls) {
							Helper.checkMoreButtonCount(aControls[0], "[5/" + iCount + "]");
							Opa5.assert.strictEqual(aControls[1].getText(),
								iCount + " New Sales Orders", "Count in title is " + iCount);
						},
						viewName : sViewName
					});
				}
			}
		},
		onTheObjectPage : {
			actions : {
				changeNote : function (sNote) {
					return Helper.changeInputValue(this, sViewName, "SalesOrder::note", sNote);
				},
				createSalesOrderItem : function () {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Button",
						id : "createSalesOrderLineItem",
						success : function () {
							Opa5.assert.ok(true, "Sales order line item created");
						},
						viewName : sViewName
					});
				},
				deleteSalesOrder : function () {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Button",
						id : "deleteSalesOrder",
						success : function () {
							Opa5.assert.ok(true, "Sales order deleted");
						},
						viewName : sViewName
					});
				},
				increaseSalesOrderItemsQuantity : function () {
					return Helper.pressButton(this, sViewName, "increaseSalesOrderItemsQuantity");
				},
				refresh : function () {
					return Helper.pressButton(this, sViewName, "refreshSalesOrder");
				},
				selectSalesOrderItem : function (iRow) {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Text",
						id : /itemPosition/,
						matchers : function (oControl) {
							return oControl.getBindingContext().getIndex() === iRow;
						},
						success : function (aControls) {
							Opa5.assert.ok(true, "Item selected: " + aControls[0].getText());
						},
						viewName : sViewName
					});
				},
				pressMore : function () {
					return this.waitFor({
						id : "SO_2_SOITEM-trigger",
						success : function (oTrigger) {
							new Press().executeOn(oTrigger);
							Opa5.assert.ok(true, "'More' Button pressed");
						},
						viewName : sViewName
					});
				},
				sortByGrossAmount : function () {
					return Helper.pressButton(this, sViewName, "sortByGrossAmount");
				}
			},
			assertions : {
				checkGrossAmount : function (sGrossAmount) {
					Helper.checkInputValue(this, sViewName, "SalesOrder::grossAmount",
						sGrossAmount);
				},
				checkNote : function (sNote) {
					Helper.checkInputValue(this, sViewName, "SalesOrder::note", sNote);
				},
				checkSalesOrderID : function (sSalesOrderID) {
					Helper.checkInputValue(this, sViewName, "SalesOrder::id", sSalesOrderID);
				},
				checkSalesOrderItem : function (iRow, sItemPosition, sQuantity) {
					Helper.waitForSortedByID(this, {
						controlType : "sap.m.Text",
						id : /itemPosition|itemQuantity/,
						matchers : function (oControl) {
							return oControl.getBindingContext().getIndex() === iRow;
						},
						success : function (aControls) {
							Opa5.assert.strictEqual(aControls[0].getText(), sItemPosition,
								"Item position is " + sItemPosition);
							Opa5.assert.strictEqual(aControls[1].getText(), sQuantity,
								"Quantity is " + sQuantity);
						},
						viewName : sViewName
					});
				},
				checkSalesOrderItemNotInTheList : function (sItemPosition) {
					this.waitFor({
						controlType : "sap.m.Text",
						id : /itemPosition/,
						success : function (aControls) {
							Opa5.assert.ok(
								aControls.every(function (oControl) {
									return oControl.getText() !== sItemPosition;
								}), "Item '" + sItemPosition + "' not found"
							);
						},
						viewName : sViewName
					});
				},
				checkSalesOrderItemsCount : function (iCount) {
					Helper.waitForSortedByID(this, {
						id : /SO_2_SOITEM-trigger|lineItemsTitle/,
						success : function (aControls) {
							Helper.checkMoreButtonCount(aControls[0], "[5/" + iCount + "]");
							Opa5.assert.strictEqual(aControls[1].getText(),
								iCount + " Sales Order Line Items", "Count in title is " + iCount);
						},
						viewName : sViewName
					});
				}
			}
		},
		onTheSubObjectPage : {
			actions : {
				changeQuantity : function (sQuantity) {
					return Helper.changeInputValue(this, sViewName, "SO_2_ITEM::quantity",
						sQuantity);
				},
				deleteSalesOrderItem : function () {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Button",
						id : "deleteSalesOrderItem",
						success : function () {
							Opa5.assert.ok(true, "Sales order item deleted");
						},
						viewName : sViewName
					});
				}
			},
			assertions : {
				checkItemPosition : function (sItemPosition) {
					Helper.checkInputValue(this, sViewName, "SO_2_ITEM::itemPosition",
						sItemPosition);
				},
				checkQuantity : function (sQuantity) {
					Helper.checkInputValue(this, sViewName, "SO_2_ITEM::quantity", sQuantity);
				}
			}
		}
	});
});