sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Journey - ManageProducts - Direct Navigation from List Report to SubObject Page");

		opaTest("Navigation not configured message is displayed", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts");
			When.onTheGenericListReport
				.iSetTheFilter({
					Field: "Product",
					Value: "HT-1002"
				})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					Product: "HT-1002"
				});

			When.onTheGenericListReport
				.iClickTheLink("NavToSubObjectPage");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Navigation has not been configured");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Close");

		});

		opaTest("Navigate directly to SubObject page", function (Given, When, Then) {
			// clear the exiting filter and set new value
			When.onTheGenericListReport
				.iSetTheFilter({
					Field: "Product",
					Value: ""
				}).
				and
				.iSetTheFilter({
					Field: "Product",
					Value: "HT-1000"
				}).and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theResponsiveTableContainsTheCorrectItems({
					Product: "HT-1000"
				});

			When.onTheGenericListReport
				.iClickTheLink("NavToSubObjectPage");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information", "Technical reuse component for state testing"]);

		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack(); // Navigate from Sub Object page to List Report
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});

		opaTest("ForwardNavigationProperty navigate to NavigationProperty defined in manifest", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts","manifestForwardNavigationProperty");
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information", "Technical reuse component for state testing"]);
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_ProductText");
		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			Then.iTeardownMyApp();
		});

		opaTest("ForwardNavigationProperty 1toN navigate to NavigationProperty defined in manifest", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts","manifestForward1ToNNavigationProperty");
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true)
				.and
				.iClickTheButtonWithLabel("Go");
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(0);

			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17")
				.and
				.iShouldSeeTheSections(["General Information", "Sales Data"]);

			When.onTheGenericObjectPage
				.iNavigateBack();

			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1);

			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("基础版笔记本电脑 17")
				.and
				.iShouldSeeTheSections(["General Information", "Sales Data"]);
		});

		opaTest("Navigate back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
