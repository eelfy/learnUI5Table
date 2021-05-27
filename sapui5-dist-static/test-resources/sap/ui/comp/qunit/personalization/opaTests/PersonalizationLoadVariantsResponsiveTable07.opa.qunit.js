/* global QUnit */

sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device',
	'sap/m/library'
], function(
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	Device,
	mlibrary
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
		viewNamespace: "view."
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/appUnderTestResponsiveTableWithVariant/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.theTableShouldContainColumns("sap.m.Table", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Product Name", "Product Category"
		]);
	});

	opaTest("When I load 'Compatibility08' variant and open columns panel of the dialog, some columns should be changed", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("Compatibility08").and.iPressOnPersonalizationButton(true).and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));

		// Assertions
		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Price", 0);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Product Name", 1);
		Then.iShouldSeeItemWithSelection("Product Name", true);

		Then.iShouldSeeItemOnPosition("Product Category", 2);
		Then.iShouldSeeItemWithSelection("Product Category", true);

		Then.iShouldSeeItemOnPosition("Bool", 3);
		Then.iShouldSeeItemWithSelection("Bool", false);

		Then.iShouldSeeItemOnPosition("Company Name", 4);
		Then.iShouldSeeItemWithSelection("Company Name", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 6);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Depth", 8);
		Then.iShouldSeeItemWithSelection("Dimension Depth", false);

		Then.iShouldSeeItemOnPosition("Dimension Height", 9);
		Then.iShouldSeeItemWithSelection("Dimension Height", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 10);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Dimension Width", 11);
		Then.iShouldSeeItemWithSelection("Dimension Width", false);

		Then.iShouldSeeItemOnPosition("GUID", 12);
		Then.iShouldSeeItemWithSelection("GUID", false);

		Then.iShouldSeeItemOnPosition("Product ID", 13);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Quantity", 14);
		Then.iShouldSeeItemWithSelection("Quantity", false);

		Then.iShouldSeeItemOnPosition("Status", 15);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Time", 16);
		Then.iShouldSeeItemWithSelection("Time", false);

		Then.iShouldSeeItemOnPosition("Unit Of Measure", 17);
		Then.iShouldSeeItemWithSelection("Unit Of Measure", false);

		Then.iShouldSeeItemOnPosition("Weight", 18);
		Then.iShouldSeeItemWithSelection("Weight", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 19);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to sort panel, the sorting should be empty", function(Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nSortPanel");
		Then.iShouldSeeSortSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
		Then.iShouldSeeSortSelectionWithSortOrder(Util.getTextFromResourceBundle("sap.m", "VIEWSETTINGS_ASCENDING_ITEM"));
	});

	opaTest("When I navigate to filter panel, the filter should be empty", function(Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nFilterPanel");
		Then.iShouldSeeFilterSelectionWithColumnName("Company Name");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("");
	});

	opaTest("When I navigate to group panel, the group should be empty", function(Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nGroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
	QUnit.start();
});
