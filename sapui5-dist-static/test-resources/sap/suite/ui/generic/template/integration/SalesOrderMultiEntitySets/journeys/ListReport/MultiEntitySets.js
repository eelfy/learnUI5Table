sap.ui.define([
		"sap/ui/test/opaQunit",
		"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/utils/OpaManifest"
	], function (opaTest, OpaManifest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report");

		opaTest("Starting the app and checking the default date range field value", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-CreatedDate", {"visible": true, "value": "This year (Jan 1, 2021 - Dec 31, 2021)"});
		});

		opaTest("Change the date range field value and load the data", function (Given, When, Then) {
			When.onTheListReportPage
				.iEnterValueInField("Date Range (Jan 1, 2020 - Dec 31, 2020)", "listReportFilter-filterItemControl_BASIC-CreatedDate");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(8, 1);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-1", { "entitySet": "C_STTA_SalesOrder_WD_20", "enableAutoColumnWidth": true })
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-1")
				.and
				.iCheckDynamicPageProperty("getStickySubheaderProvider", "SOMULTIENTITY::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--template::IconTabBar", true);
		});

		opaTest("Filtering for Product = 'HT-1003'", function (Given, When, Then) {
			var iTabIndex = 1,
				sProduct = "Product",
				sValue = "HT-1003",
				iExpectedItems = 8;

			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct, Value: sValue});
			Then.onTheGenericListReport
				.iCheckOverlayForTable("responsiveTable-1", true);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 2)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
			Then.onTheListReportPage
				.theResultListFieldHasTheCorrectValue(iTabIndex, {Line: 1, Field: sProduct, Value: sValue})
				.and
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (8)"]}, "--responsiveTable-1");
		});

		opaTest("Switching to Tab 2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-2", {"entitySet": "C_STTA_SalesOrderItem_WD_20"})
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-2");
		});

		opaTest("Filtering for Product = 'HT-1007'", function (Given, When, Then) {
			var iTabIndex = 2,
				sProduct = "Product",
				sValue = "HT-1007",
				iExpectedItems = 1;

			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct, Value: sValue})
				.and
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
			Then.onTheListReportPage
				.theResultListFieldHasTheCorrectValue(iTabIndex, {Line: 0, Field: sProduct, Value: sValue})
				.and
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Order Items (1)"]}, "--responsiveTable-2");
		});

		opaTest("Switching to Tab 3", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItem_WD_20"
				})
				.and
				.iCheckCustomDataOfControl("sap.ui.comp.smartchart.SmartChart", "--listReport-3", {
					"presentationVariantQualifier": "VAR3",
					"chartQualifier": "Chart1",
					"variantAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#VAR3",
					"text": "Sales Order Items Chart"
				});
		});

		opaTest("Filtering for CurrencyCode = 'EUR'", function (Given, When, Then) {
			var iTabIndex = 3,
				sCurrencyCode = "CurrencyCode",
				sValue = "EUR",
				iExpectedItems = 4;

			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: ""})
				.and
				.iSetTheFilter({Field: sCurrencyCode, Value: sValue})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true});
			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 8)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
		});

		opaTest("Check NoData text for SmartChart", function (Given, When, Then) {
			var iTabIndex = 3,
				sCurrencyCode = "Product",
				sValue = "Prod",
				iExpectedItems = 0;

			When.onTheGenericListReport
				.iClickOnIconTabFilter("3")
				.and
				.iSetTheFilter({
					Field: sCurrencyCode,
					Value: ""
				})
				.and
				.iSetTheFilter({
					Field: sCurrencyCode,
					Value: sValue
				})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true})
				.and
				.iCheckSmartChartNoDataTextForFilter();

			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);

			When.onTheGenericListReport
				.iSetTheFilter({
					Field: sCurrencyCode,
					Value: ""
				})
				.iExecuteTheSearch();

		});

		opaTest("Switching to Tab 4", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-4", {"entitySet": "C_STTA_SalesOrderItemSL_WD_20"})
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-4")
				.and
				.iCheckControlPropertiesByControlType("sap.m.MessageStrip", {
					"visible": true,
					"text": "Some of the filters are not relevant for the tab \"Sales Order Items SL\" (ISO Currency Code, Created Date). Setting these filters has no effect on the results."
				});
		});

		opaTest("Switching to Tab 5", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("5");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItemSL_WD_20"
				})
				.and
				.iCheckControlPropertiesByControlType("sap.m.MessageStrip", {
					"visible": true,
					"text": "Some of the filters are not relevant for the tab \"Sales Order Items SL Chart\" (ISO Currency Code, Created Date). Setting these filters has no effect on the results."
				});
		});

		opaTest("Switching back to Tab 1 and clear filters", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iSetTheFilter({Field: "CurrencyCode", Value: ""})
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (8)"]}, "--responsiveTable-1");
		});

		opaTest("Set filter LifecycleStatus and load data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("LifecycleStatus")
				.and
				.iSelectItemsFromMultiComboBox("LifecycleStatus", "Closed")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (1)"]}, "--responsiveTable-1");
		});

		var oManifestJSONModel = OpaManifest.demokit["sample.stta.sales.order.multi.entitysets"];
		var oGenericApp = oManifestJSONModel.getProperty("/sap.ui.generic.app");
		var bShowDraftToggle = oGenericApp.settings.showDraftToggle;
		if (bShowDraftToggle) {

			opaTest("Check for 'Show Active Items Only' Button on the List Report", function (Given, When, Then) {
				Then.onTheListReportPage
					.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-1", {"entitySet": "C_STTA_SalesOrder_WD_20"});
			});

			opaTest("Switching to Tab 2", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickOnIconTabFilter("2");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckControlPropertiesById("activeStateToggle-2",  {"text":  "Hide Draft Values"});
			});

			opaTest("Switch to Active only state in Tab 2", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheControlWhichContainsId("activeStateToggle");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckControlPropertiesById("activeStateToggle-2",  {"text":  "Show Draft Values"});
			});

			opaTest("Switching to Tab 1", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickOnIconTabFilter("1");
				Then.onTheGenericListReport
					.theResultListIsVisible();
				Then.onTheListReportPage
					.iCheckControlPropertiesById("activeStateToggle-1",  {"text":  "Hide Draft Values"});
			});
		}

		opaTest("Check for Semantic Date Range Values excluded with key configuration in manifest", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-DeliveryDate");
			Then.onTheListReportPage
				.iCheckTheItemPresentIntheSelectDropDown("listReportFilter-filterItemControl_BASIC-DeliveryDateselect", "Today" , false)
				.and
				.iCheckTheItemPresentIntheSelectDropDown("listReportFilter-filterItemControl_BASIC-DeliveryDateselect", "Today - X / + Y days" , true);
		});

		opaTest("Check if Semantic date range is succesfully stored in iappstate", function (Given, When, Then) {
			When.onTheGenericListReport	
				.iChoosetheItemInSelect("Today - X / + Y days", "Time Period")
				.and
				.iExecuteTheSearch();
			When.onTheListReportPage
				.iClickTheControlWithId("shellAppTitle");
			When.onTheGenericListReport
				.iClickOnItemFromTheShellNavigationMenu("Home")
				.and
				.iNavigateBack();
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-DeliveryDate", {"value": "Today - 1 / + 1 days"});
		});

		opaTest("Tear Down App", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckDynamicPageProperty("getStickySubheaderProvider", "SOMULTIENTITY::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--template::IconTabBar", true);
			Then.iTeardownMyApp();
		});

		QUnit.module("External Navigation");

		opaTest("#1: Starting the app, loading data, see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4")
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iClickTheLink("500000000");
			Then.onTheListReportPage
				.iCheckForStringInAppUrl("ScheduleLine", false);
			
		});

		opaTest("#2: Testing OP - DataFieldForIntentBasedNavigation: see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateBack()
			    .and
				.iClickOnIconTabFilter("1")
				.and
				.iSetTheHeaderExpanded(true);
			When.onTheListReportPage
				.iEnterValueInField("Date Range (Jan 1, 2020 - Dec 31, 2020)", "listReportFilter-filterItemControl_BASIC-CreatedDate");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 1);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "SalesOrderItemsID::responsiveTable")
			    .and
				.iClickTheButtonHavingLabel("To SOWD");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("CurrencyCode", false)
				.and
				.iCheckForStringInAppUrl("GrossAmount", false)
				.and
				.iCheckForStringInAppUrl("CreatedDate", false)
		});

		opaTest("#3: Testing the OP - DataFieldWithIntentBasedNavigation:  see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items");
		    When.onTheGenericObjectPage
				.iClickTheLink("HT-1002");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Product");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("CurrencyCode", false)
				.and
				.iCheckForStringInAppUrl("GrossAmount", false)
				.and
				.iCheckForStringInAppUrl("CreatedDate", false)
				.and
				.iCheckForStringInAppUrl("Product", false)
				.and
				.iCheckForStringInAppUrl("Copyitem_ac", false);
			Then.iTeardownMyApp();
		});
	}
);
