sap.ui.define(["sap/ui/test/opaQunit", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function (opaTest, OpaManifest) {
		"use strict";

		QUnit.module("List Report Page - Filter Search");

		// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
		opaTest("The Search with no Filter displays all items", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckComboboxSelectedValue("editStateFilter", "All");
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Adapt Filters");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageHeader-collapseBtn");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterText", {"text": "Not Filtered"});
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theAvailableNumberOfItemsIsCorrect(125);
		});

		opaTest("Searching for 'Own Draft' in the Filter should return 3 items", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "editStateFilter", Value: 2});
			Then.onTheListReportPage
				.iCheckComboboxSelectedValue("editStateFilter", "Own Draft");
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Adapt Filters (1)");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageHeader-collapseBtn");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterText", {"text": "Filtered By (1): Editing Status"});
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(3)
				.and
				.theAvailableNumberOfItemsIsCorrect(3);
			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					EditingStatus: 2
				});
		});

		opaTest("Searching for Editing Status = 'All' & Supplier = '100000046' in the Filter should return 3 items", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "editStateFilter", Value: 0});
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Adapt Filters");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageHeader-collapseBtn");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterText", {"text": "Not Filtered"});
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
				.and
				.iSetTheFilter({Field: "Supplier", Value: "100000046"});
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Adapt Filters (1)");
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageHeader-collapseBtn");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("template::FilterText", {"text": "Filtered By (1): Supplier"});
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(3)
				.and
				.theAvailableNumberOfItemsIsCorrect(3);
			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					Supplier: "100000046",
					EditingStatus: 0
				});
		});

		opaTest("Editing Status should be placed as the first filter field in the smart filter bar", function (Given, When, Then) {
			Then.onTheListReportPage
				.EditingStatusShouldBeTheFirstFilter({Field: "EditState"});
		});

		opaTest("Adapt Filter: Reload all items", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Supplier", Value: ""})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theAvailableNumberOfItemsIsCorrect(125);
		});

		opaTest("Adapt Filter: Press the Adapt Filters action", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("listReportFilter-btnFilters");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Adapt Filters");
		});

		opaTest("Adapt Filter: Expand the Product Information list and Check the Category list item", function (Given, When, Then) {
			When.onTheListReportPage
				.iExpandThePaneltInAdpatFilterDialog("Product Information");
			When.onTheGenericListReport
				.iClickTheListItemWithLabel("Category", true);
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Adapt Filters");
		});
		opaTest("Adapt Filter: Press OK button and set filter value", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iSetTheFilter({Field: "MainProductCategory", Value: "Computer Components"})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(43);
		});

		opaTest("Adapt Filter: Again press the Adapt Filters action", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("listReportFilter-btnFilters");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Adapt Filters");
		});

		opaTest("Adapt Filter: Press Restore and OK button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Reset")
				.and
				.iClickTheButtonOnTheDialog("OK")
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Warning");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(125);
		});

		var bShowDraftToggle = OpaManifest.demokit["sample.stta.manage.products"].getProperty("/sap.ui.generic.app/settings/showDraftToggle");

		if (bShowDraftToggle) {
			opaTest("Check for 'Show Active Items Only' Button on the List Report", function (Given, When, Then) {
				When.onTheListReportPage
					.iLookAtTheScreen();
				Then.onTheGenericListReport
					.iShouldSeeTheControlWithId("activeStateToggle");
			});

			opaTest("Clicking on 'Show Active Items Only' button should return 122 items", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonWithId("activeStateToggle")
					.and
					.iLookAtTheScreen();
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.theAvailableNumberOfItemsIsCorrect(122);
			});

			opaTest("Clicking on 'Show All Items(Draft and Active)' button should return 125 items", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonWithId("activeStateToggle")
					.and
					.iLookAtTheScreen();
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.theAvailableNumberOfItemsIsCorrect(125);
			});

			opaTest("Changing the Editing status to 'Own Draft' should return 3 items", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheFilter({Field: "editStateFilter", Value: 2})
					.and
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.theSmartTableIsRenderedCorrectly();
			});

			opaTest("Checking if 'Show Active Items Only' button is enabled when editing status is 'All'", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheFilter({Field: "editStateFilter", Value: 0})
					.and
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theButtonWithIdIsEnabled("activeStateToggle");

			});
		}

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});
	}
);
