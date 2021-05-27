/* global QUnit */
sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion'

], function(
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion
) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I look at the screen, a table with links should appear", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Name", "Product ID", "Category"
		]);
		Then.iShouldSeeTheColumnInATable("Name");
		Then.iShouldSeeTheColumnInATable("Product ID");
		Then.iShouldSeeTheColumnInATable("Category");
	});

	opaTest("When I click on 'Power Projector 4713' link in the 'Name' column, popover should open with 1 superior link and with link personalization button", function(Given, When, Then) {
		When.iPressOnLink("Power Projector 4713");

		Then.iShouldSeeAnOpenNavigationPopover();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Name Link2"
		]);
		Then.iShouldSeeTheMoreLinksButton();

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on 'Flat S' link in the 'Name' column, popover should open with 1 superior link and with link personalization button", function(Given, When, Then) {
		When.iPressOnLink("Flat S");

		Then.iShouldSeeAnOpenNavigationPopover();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Name Link2"
		]);
		Then.iShouldSeeTheMoreLinksButton();
	});

	opaTest("When I click on link personalization button, selection dialog should open", function(Given, When, Then) {
		When.iPressOnMoreLinksButton();
		Then.thePersonalizationDialogOpens();

		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on '1239102' link in the 'ProductId' column, popover should open with 2 links but without link personalization button", function(Given, When, Then) {
		When.iPressOnLink("1239102");

		Then.iShouldSeeAnOpenNavigationPopover();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"ProductId Link2", "ProductId Link3"
		]);
		// Then.iShouldSeeTheMoreLinksButton();

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on 'Laptop' link in the 'Category' column, popover should open with 1 superior link and with link personalization button", function(Given, When, Then) {
		When.iPressOnLink("Laptop");

		Then.iShouldSeeAnOpenNavigationPopover();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);
		Then.iShouldSeeTheMoreLinksButton();

		Given.closeAllNavigationPopovers();
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
