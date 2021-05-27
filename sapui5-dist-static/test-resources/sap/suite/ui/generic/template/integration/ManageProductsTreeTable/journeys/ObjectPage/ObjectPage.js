sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Tree Table Object Page");

		opaTest("Check Object page title and table column visibility", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproductstreetable");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iNavigateFromLRToOPUsingTable(1);
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information"])
				.and
				.theObjectPageHeaderTitleIsCorrect("Electronics");
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable")
				.and
				.iCheckTableColumnVisibility("BreakoutColumn", true, "treeTable");
		});

		opaTest("Tree table is visible edit mode and sections are visible", function (Given, When, Then) {
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Edit");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Cancel");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode()
				.and
				.iShouldSeeTheSections(["General Information", "Sales Price table", "Simple text facet"]);
			Then.onTheObjectPage
				.iCheckTableProperties({"visible": true}, "treeTable");
			Then.iTeardownMyApp();
		});
	}
);
