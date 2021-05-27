/* globals QUnit */

sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device',
	"applicationUnderTest/test/pages/Personalization"
], function(
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	Device
) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		asyncPolling: true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		autoWait: true
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	// ----------------------------------------------
	// Test scenario:
	//  t   Key-User   End-User   Result
	// ----------------------------------------------
	//  0                         L2 (superior link)
	// ----------------------------------------------
	//  1               L3 on     L2 (superior link)
	// 							  L3
	// ----------------------------------------------
	//  2               L3 off    L2
	// ----------------------------------------------
	//  3   L2 off,
	//      L3 on                 ----
	// ----------------------------------------------
	//  4               L4 on     L4
	// ----------------------------------------------
	//  5              Restore,
	//                  L4 on     L3
	//                            L4
	// ----------------------------------------------

	QUnit.module("SelectionPanel02");

	opaTest("When I start the app again, a table with SmartLinks should appear", function(Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTest");
		Given.iEnableTheLocalLRep();
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Name", "Product ID", "Category"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Name");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Product ID");
		Then.onThePersonalizationPage.iShouldSeeTheColumnInATable("Category");
	});
	opaTest("When I click on 'Projector' link in the 'Category' column, popover should open with one link", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnLink("Projector");

		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});
	opaTest("When I click on 'More Links' button, the selection dialog opens", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.thePersonalizationDialogOpens();

		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link2", 0, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link3", 1, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link4", 2, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link5", 3, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link6", 4, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link7", 5, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link8", 6, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link9", 7, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link10", 8, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link11", 9, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link12", 10, false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Category Link3' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.onThePersonalizationPage.iSelectALinkOnP13nDialog("Category Link3");

		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link2", 0, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link3", 1, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link4", 2, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link5", 3, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link6", 4, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link7", 5, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link8", 6, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link9", 7, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link10", 8, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link11", 9, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link12", 10, false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2", "Category Link3"
		]);
	});
	opaTest("When I click on 'More Links' button again, the selection dialog opens", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();

		Then.thePersonalizationDialogOpens();

		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link2", 0, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link3", 1, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link4", 2, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link5", 3, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link6", 4, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link7", 5, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link8", 6, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link9", 7, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link10", 8, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link11", 9, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link12", 10, false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I deselect the 'Category Link3' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.onThePersonalizationPage.iSelectALinkOnP13nDialog("Category Link3");

		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link2", 0, true);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link3", 1, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link4", 2, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link5", 3, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link6", 4, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link7", 5, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link8", 6, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link9", 7, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link10", 8, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link11", 9, false);
		Then.onThePersonalizationPage.iShouldSeeLinkItemOnP13nDialog("Category Link12", 10, false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);

		When.onThePersonalizationPage.iCloseAllNavigationPopovers();

		Then.iTeardownMyUIComponent();
	});
});
