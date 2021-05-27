/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	Opa5.createPageObjects({
		onTheContactAnnotationPage: {
			viewName: "applicationUnderTestContactAnnotation.view.Main",
			actions: {
				iPressOnLink: function(sText) {
					return this.compTestLibrary.iPressOnLink(sText);
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
				contactInformationExists: function() {
					return this.compTestLibrary.contactInformationExists();
				}
			}
		}
	});
});
