sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("List Report Page Rendering");

		opaTest("The Filter Bar is rendered correctly", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.theFilterBarIsRenderedCorrectly()
				.and
				.iCheckComboboxValues("editStateFilter", 5, ["All", "Own Draft", "Locked by Another User", "Unsaved Changes by Another User", "Unchanged"])
				.and
				.iCheckComboboxValues("CustomFilter-Price-combobox", 4, ["Price between 0-100", "Price between 100-500", "Price between 500-1000", "Price: Over 1000"])
				.and
				.thePageVariantShouldBeMarked(false);
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: "HT-1000"});
			Then.onTheListReportPage
				.thePageVariantShouldBeMarked(true);

			Then.onTheGenericListReport
				.iShouldSeeTheControlWithId("template::Share")
				.and
				.iShouldSeeTheControlWithId("template:::ListReportPage:::DynamicPageTitle");
		});

		opaTest("The Table is rendered correctly and \"PopinDisplay\"=\"WithoutHeader\" for columns checked", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.theSmartTableIsRenderedCorrectly()
				.and
				.theCustomToolbarForTheSmartTableIsRenderedCorrectly()
				.and
				.iCheckControlPropertiesById("responsiveTable", {"fixedLayout": "Strict", "growing": true, "growingScrollToLoad": true, "growingThreshold": 20})
				.and
				.theResponsivetableHasColumnsWithPopinDisplay("WithoutHeader");
		});

		opaTest("Check the importance of the Semntic Key Field column - 'Product' is set to HIGH", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-ProductForEdit", { "visible": true, "importance": "High" });
		});

		opaTest("Check the Show Details button on the Table and None, Low and Medium importance columns are hidden from the table popin", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("btnShowHideDetails", {"visible": true, "enabled": true, "text": "Show Details"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable(["None", "Low", "Medium"])
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Image", false)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Sales", false)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", false);
		});

		opaTest("Click on the Show Details button and check None, Low and Medium importance columns are displayed as table popin", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheShowDetailsButtonOnTheTableToolBar();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("btnShowHideDetails", {"visible": true, "enabled": true, "text": "Hide Details"})
				.and
				.iCheckTheCoulmnsHiddenInPoppinForTheTable("")
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Image", true)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Sales", true)
				.and
				.iCheckTheColumnDisplayedInTheTablePopin("Revenue", true);
		});

		opaTest("Determining Actions, Micro Charts, Rating & Progress Indicator, Image icon, Title, row highlight are rendered correctly", function (Given, When, Then) {
			When.onTheListReportPage
				.iLookAtTheScreen();
			Then.onTheListReportPage
				.thePageShouldContainTheCorrectDeterminingActions()
				.and
				.theSmartTableContainsMicroCharts()
				.and
				.theSmartTableContainsRatingIndicator()
				.and
				.theSmartTableContainsProgressIndicator()
				.and
				.theObjectMarkerContainsUserInfo()
				.and
				.iCheckControlPropertiesByControlType("sap.m.Avatar", {"visible": true, "displayShape": "Square", "displaySize": "S"})
				.and
				.checkRowHighlight()
				.and
				.checkDefaultTitle();
		});

		opaTest("Global action is present in toolbar", function (Given, When, Then) {
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Global Action");
			Then.iTeardownMyApp();
		});
	}
);
