/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	Opa5.createPageObjects({
		onThePersonalizationPage: {
			actions: {
				iPressOnLink: function(sText) {
					return this.compTestLibrary.iPressOnLink(sText);
				},
				iRightClickOnLinkInElementOverlay: function(sText) {
					return this.compTestLibrary.iRightClickOnLinkInElementOverlay(sText);
				},
				iSelectALinkOnP13nDialog: function(sColumnName) {
					return this.compTestLibrary.iSelectALinkOnP13nDialog(sColumnName);
				},
				iPressOnMoreLinksButton: function() {
					return this.compTestLibrary.iPressOnMoreLinksButton();
				},
				iCloseAllNavigationPopovers: function() {
					return this.compTestLibrary.iCloseAllNavigationPopovers();
				}
			},
			assertions: {
				iShouldSeeTheColumnInATable: function(sColumnName) {
					return this.compTestLibrary.iShouldSeeTheColumnInATable(sColumnName);
				},
				iShouldSeeAnOpenNavigationPopover: function() {
					return this.compTestLibrary.iShouldSeeAnOpenNavigationPopover();
				},
				iShouldSeeOrderedLinksOnNavigationContainer: function(aTexts) {
					return this.compTestLibrary.iShouldSeeOrderedLinksOnNavigationContainer(aTexts);
				},
				iShouldSeeTheMoreLinksButton: function() {
					return this.compTestLibrary.iShouldSeeTheMoreLinksButton();
				},
				iShouldSeeLinkItemOnP13nDialog: function(sItemText, iIndex, bSelected, bEnabled) {
					return this.compTestLibrary.iShouldSeeLinkItemOnP13nDialog(sItemText, iIndex, bSelected, bEnabled);
				}
			}
		}
	});
});
