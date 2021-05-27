/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/comp/integration/testlibrary/actions/OpenContextMenu",
	"sap/ui/comp/integration/testlibrary/actions/CloseNavigationPopover",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/comp/integration/testlibrary/TestUtils"
], function(
	Opa5,
	Press,
	OpenContextMenu,
	CloseNavigationPopover,
	PropertyStrictEquals,
	Ancestor,
	AggregationContainsPropertyEqual,
	TestUtils
) {
	"use strict";

	return {
		/**
		 * Triggers a <code>Press</code> action for a {@link sap.m.Link} with a given text.
		 * @param {string} sText Text of the link which is to be clicked
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iPressOnLink: function(sText) {
			return this.waitFor({
				controlType: "sap.m.Link",
				check: function(aLinks) {
					return !!aLinks.length;
				},
				matchers: new PropertyStrictEquals({
					name: "text",
					value: sText
				}),
				actions: new Press(),
				errorMessage: "SmartLink with text '" + sText + "' not found."
			});
		},
		/**
		 * Triggers the event which is thrown when right-clicking an element while RTA is active.
		 * @param {string} sText Text of the link which is to be clicked
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iRightClickOnLinkInElementOverlay: function(sText) {
			return this.waitFor({
				controlType: "sap.ui.dt.ElementOverlay",
				matchers: function(oElementOverlay) {
					return (oElementOverlay.getElementInstance().getMetadata().getElementName() === "sap.ui.comp.navpopover.SmartLink"
						&& oElementOverlay.getElementInstance().getText() === sText)
						|| (oElementOverlay.getElementInstance().getMetadata().getElementName() === "sap.m.ObjectIdentifier"
						&& oElementOverlay.getElementInstance().getTitle() === sText);
				},
				actions: new OpenContextMenu(),
				errorMessage: "ElementOverlay '" + sText + "' not found"
			});
		},
		/**
		 * Selects a <code>Link</code> control in the personalization dialog to be displayed in the popover.
		 * @param {string} sColumnName Text of the link which should be selected
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iSelectALinkOnP13nDialog: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: TestUtils.getTextFromResourceBundle("sap.ui.comp", "POPOVER_SELECTION_TITLE")
				}),
				success: function(aP13nDialogs) {
					this.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers: [
							new Ancestor(aP13nDialogs[0], false),
							function(oColumnListItem) {
								var oCell = oColumnListItem.getCells()[0];
								var bExist = new AggregationContainsPropertyEqual({
									aggregationName : "items",
									propertyName : "text",
									propertyValue : sColumnName
								}).isMatching(oCell);
								return bExist;
							}
						],
						success: function(aColumnListItems) {
							this.waitFor({
								controlType: "sap.m.CheckBox",
								matchers: new Ancestor(aColumnListItems[0], false),
								actions: new Press(),
								errorMessage: "CheckBox for ColumnListItem with text '" + sColumnName + "' not found"
							});
						},
						errorMessage: "ColumnListItem with text '" + sColumnName + "' not found"
					});
				}
			});
		},
		/**
		 * Triggers a <code>Press</code> action for the More Links button on the popover.
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iPressOnMoreLinksButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtils.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				actions: new Press(),
				errorMessage: "Button with text 'More Links' not found"
			});
		},
		/**
		 * Closes all open {@link sap.ui.comp.navpopover.NavigationPopover} dialogs which are currently open.
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iCloseAllNavigationPopovers: function() {
			return this.waitFor({
				controlType: "sap.ui.comp.navpopover.NavigationPopover",
				actions: new CloseNavigationPopover()
			});
		}
	};
});
