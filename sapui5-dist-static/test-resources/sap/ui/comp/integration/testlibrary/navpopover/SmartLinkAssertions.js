/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationContainsPropertyEqual",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/comp/integration/testlibrary/TestUtils"
], function(
	Opa5,
	AggregationContainsPropertyEqual,
	Ancestor,
	PropertyStrictEquals,
	TestUtils
) {
	"use strict";

	return {
		/**
		 * Checks if there is a single column in a {@link sap.m.Table} with a given header.
		 * @param {string} sColumnName Name of the column / text in the column header
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iShouldSeeTheColumnInATable: function(sColumnName) {
			return this.waitFor({
				controlType: "sap.m.Table",
				matchers: function(oTable) {
					var aColumns = oTable.getColumns(),
					bExists = aColumns.some(function(oColumn) {
						return new AggregationContainsPropertyEqual({
							aggregationName : "header",
							propertyName : "text",
							propertyValue : sColumnName
						}).isMatching(oColumn);
					});
					return bExists;
				},
				errorMessage: "Column with header text '" + sColumnName + "' not found"
			});
		},
		/**
		 * Checks if there is an open {@link sap.ui.comp.navpopover.NavigationPopover}.
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iShouldSeeAnOpenNavigationPopover: function() {
			return this.waitFor({
				controlType: "sap.ui.comp.navpopover.NavigationPopover",
				check: function(aNavigationPopovers) {
					return aNavigationPopovers.length === 1;
				},
				success: function(aNavigationPopovers) {
					Opa5.assert.ok(aNavigationPopovers.length, 'NavigationPopover is open');
				},
				errorMessage: "No open NavigationPopover found"
			});
		},
		/**
		 * Checks if there is a {@link sap.ui.comp.navpopover.NavigationContainer} containing links which are represented by an array of texts. This function also checks if the order of the links is correct.
		 * @param {string[]} aTexts The texts of the links on the popover in given order
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iShouldSeeOrderedLinksOnNavigationContainer: function(aTexts) {
			var aVisibleAvailableActions;
			return this.waitFor({
				controlType: "sap.ui.comp.navpopover.NavigationContainer",
				check: function(aNavigationContainers) {
					Opa5.assert.ok(aNavigationContainers.length === 1, "NavigationContainer found");
					var oNavigationContainer = aNavigationContainers[0];
					aVisibleAvailableActions = oNavigationContainer.getAvailableActions().filter(function(oAvailableAction) {
						return !!oAvailableAction.getVisible() && !!oAvailableAction.getHref();
					});
					Opa5.assert.equal(aVisibleAvailableActions.length, aTexts.length, "Amount of visible Links is as expected");
					return aVisibleAvailableActions.every(function(oAction, iIndex) {
						return oAction.getText() === aTexts[iIndex];
					});
				},
				error: function(oError) {
					var aVisibleAvailableActionTexts = [];
					aVisibleAvailableActionTexts = aVisibleAvailableActions.map(function(oVisibleAvailableAction) {
						return oVisibleAvailableAction.getText();
					});
					oError.errorMessage = "Links " + JSON.stringify(aTexts) + " not found in NavigationContainer " + JSON.stringify(aVisibleAvailableActionTexts) + " found instead.";
				}
			});
		},
		/**
		 * Checks if the More Links button is present on the {@link sap.ui.comp.navpopover.NavigationPopover}.
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iShouldSeeTheMoreLinksButton: function() {
			return this.waitFor({
				controlType: "sap.m.Button",
				matchers: new PropertyStrictEquals({
					name: "text",
					value: TestUtils.getTextFromResourceBundle("sap.ui.comp", "POPOVER_DEFINE_LINKS")
				}),
				success: function(aButton) {
					Opa5.assert.equal(aButton.length, 1, "The 'More Links' button found");
				},
				errorMessage: "No 'More Links' button found"
			});
		},
		/**
		 * Checks if the {@link sap.m.Table} in the personalization dialog contains an item of type {@link sap.m.Link} with the given properties.
		 * @param {string} sItemText The text of the link
		 * @param {Number} iIndex The index of the link is ignored if <code>undefined</code> / <code>null</code>
		 * @param {Boolean} bSelected Selected value of the link is ignored if <code>undefined</code> / <code>null</code>
		 * @param {Boolean} [bEnabled=true] Enabled value of the link default <code>true</code>
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		iShouldSeeLinkItemOnP13nDialog: function(sItemText, iIndex, bSelected, bEnabled) {
			return this.waitFor({
				controlType: "sap.m.P13nDialog",
				matchers: new PropertyStrictEquals({
					name: "title",
					value: TestUtils.getTextFromResourceBundle("sap.ui.comp", "POPOVER_SELECTION_TITLE")
				}),
				success: function(aP13nDialogs) {
					this.waitFor({
						controlType: "sap.m.Table",
						matchers: new Ancestor(aP13nDialogs[0], false),
						success: function(aTables) {
							if (bEnabled === undefined || bEnabled === null) {
								bEnabled = true;
							}
							this.waitFor({
								controlType: "sap.m.Link",
								// also search for disabled links as this is needed for the keyuser adaptation scenario
								enabled: false,
								matchers: [
									// check if link is in the table
									new Ancestor(aTables[0], false),
									// check for text value of the link
									new PropertyStrictEquals({
										name: "text",
										value: sItemText
									}),
									// check for enabled value of the link
									new PropertyStrictEquals({
										name: "enabled",
										value: bEnabled
									}),
									// check for index of the link in the table
									function(oLink) {
										if (iIndex === undefined || iIndex === null) {
											return true;
										}
										var aItems = aTables[0].getItems().filter(function(oItem){
											return oItem.getCells()[0].getItems()[0] === oLink;
										});
										return aTables[0].getItems().indexOf(aItems[0]) === iIndex;
									},
									// check for selected value of the link
									function(oLink) {
										if (bSelected === undefined || bSelected === null) {
											return true;
										}
										var aItems = aTables[0].getItems().filter(function(oItem){
											return oItem.getCells()[0].getItems()[0] === oLink;
										});
										return aItems[0].getSelected() === bSelected;
									}
								],
								success: function(oLink) {
									Opa5.assert.equal(oLink.length, 1, "Link with text '" + sItemText + "' found on the P13n Dialog");
								},
								errorMessage: "Link with text '" + sItemText + "' not found in the P13n dialog"
							});
						}
					});
				}
			});
		},
		/**
		 * Checks if a {@link sap.ui.comp.navpopover.NavigationContainer} contains a {@link sap.ui.layout.form.SimpleForm} which represents a {@link sap.ui.comp.navpopover.ContactDetailsController}.
		 * @returns {object} An object extending a jQuery <code>Promise</code> - see {@link sap.ui.test.Opa5#waitFor}
		 */
		contactInformationExists: function() {
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.ui.comp.navpopover.NavigationContainer",
				success: function(aNavigationContainers) {
					this.waitFor({
						controlType: "sap.ui.layout.form.SimpleForm",
						matchers: new Ancestor(aNavigationContainers[0], false),
						errorMessage: "No ContactInformation found in the NavigationContainer"
					});
				},
				errorMessage: "No NavigationContainer found"
			});
		}
	};
});
