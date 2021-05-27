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

	QUnit.module("SelectionPanelRestore");

	opaTest("When I look at the screen, a table with SmartLinks should appear", function(Given, When, Then) {
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

	opaTest("When I click on 'Gladiator MX' link in the 'Name' column, popover should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnLink("Gladiator MX");

		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Name Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on link personalization button, selection dialog should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I set all links as invisible, the links on popover should not be shown", function(Given, When, Then) {
		When.iClickOnTheCheckboxSelectAll(); // select all
		When.iClickOnTheCheckboxSelectAll(); // deselect all
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed(); // wait until the P13nDialog with P13nSelectionPanel has been closed
		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onThePersonalizationPage.iCloseAllNavigationPopovers();
	});

	opaTest("When I click on 'Flat Medium' link in the 'Name' column, popover should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnLink("Flat Medium");

		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on link personalization button, selection dialog should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I click on 'Restore' and then on 'OK', popover should show previous link selection again", function(Given, When, Then) {
		When.iPressRestoreButton();
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed(); // wait until the P13nDialog with P13nSelectionPanel has been closed
		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Name Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onThePersonalizationPage.iCloseAllNavigationPopovers();
	});

	// ---------------------------------------------------------------------------------------------------------

	opaTest("When I click on 'Keyboard' link in the 'Category' column, popover should open with 1 superior link", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnLink("Keyboard");

		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on link personalization button, selection dialog should open", function(Given, When, Then) {
		When.onThePersonalizationPage.iPressOnMoreLinksButton();
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I set all links as invisible, the links shown on popover before are not changed", function(Given, When, Then) {
		When.iClickOnTheCheckboxSelectAll();
		When.iPressRestoreButton();
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed(); // wait until the P13nDialog with P13nSelectionPanel has been closed
		Then.onThePersonalizationPage.iShouldSeeAnOpenNavigationPopover();
		Then.onThePersonalizationPage.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);
		Then.onThePersonalizationPage.iShouldSeeTheMoreLinksButton();

		When.onThePersonalizationPage.iCloseAllNavigationPopovers();
		Then.iTeardownMyUIComponent();
	});
});
