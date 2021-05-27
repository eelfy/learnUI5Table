sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest, OpaManifest) {
		"use strict";

		QUnit.module("Object Page Rendering");

		opaTest("The Title is rendered correctly", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("objectImage")
				.and
				.theButtonWithIdIsEnabled("edit", true)
				.and
				.theButtonWithLabelIsEnabled("Delete", true);
		});

		opaTest("The Header Content breakout is rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.Identification::AfterReferenceExtension", {"visible": true})
				.and
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::StockLevel::BeforeReferenceExtension", {"visible": true});
		});

		opaTest("The icons are rendered correctly on the SmartForm", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.core.Icon", {"color": "Negative", "visible": true, "src": "sap-icon://account"})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.core.Icon", {"color": "Positive", "visible": true, "src": "sap-icon://accept"});
		});

        opaTest("The Semantic actions are rendered correctly when criticality is configured with path", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("action::STTA_PROD_MAN.STTA_PROD_MAN_Entities::STTA_C_MP_ProductFavorites_remove::Determining", {"type": "Reject", "visible": true})
				.and
				.iCheckControlPropertiesById("edit", {"type": "Default", "visible": true});//Edit button is not Emphasized when criticality is defined for another button
		});

		opaTest("Clicking the image should show a popup then close the popup", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheControlWithId("objectImage");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("imageDialog");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Close");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("objectImage");
		});

		opaTest("The Global & Determining Actions are rendered correctly", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.thePageShouldContainTheCorrectGlobalActions()
				.and
				.thePageShouldContainTheCorrectDeterminingActions();
		});

		opaTest("The Header Facets are rendered correctly", function (Given, When, Then) {
			var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
			if (oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/component/settings/simpleHeaderFacets")) {
				Then.onTheObjectPage
					.theSimpleHeaderFacetGeneralInformationIsRendered();
			} else {
				Then.onTheObjectPage
					.theHeaderFacetGeneralInformationIsRendered()
					.and
					.theHeaderFacetProductCategoryIsRendered()
					.and
					.theHeaderFacetPriceDataPointIsRendered()
					.and
					.theHeaderFacetStockAvailabilityDataPointIsRendered()
					.and
					.theHeaderFacetProductDescriptionPlainTextIsRendered()
					.and
					.theHeaderFacetSmartMicroChartIsAnnotatedAndIsRendered()
					.and
					.theHeaderFacetProgressIndicatorIsAnnotatedAndIsRendered()
					.and
					.theHeaderFacetRatingIndicactorIsRendered(true /* Aggregated */);
			}
		});
		opaTest("The Facets are rendered correctly", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Information");
			Then.onTheObjectPage
				.theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1,1);
			Then.onTheObjectPage
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts()
				.and
				.iSearchInTableToolbarOrSearchInputField();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue");
			Then.onTheObjectPage
				.theFacetSalesRevenueIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(8);
			Then.onTheObjectPage
				.theFacetContactsIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.theExtensionFacetSalesDataIsRenderedCorrectly();

			//First level ReferenceFacet - action button rendering
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Target Rating")
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "text": "Manage Rating"});
			
			//Reference facet inside CollectionFacet - action button rendering
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Rating (CollectionFacet)");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "text": "Manage Rating 1"});
		});

		opaTest("The Subsection title is hidden when the title of the table and subsection are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(1, 1, false)
				.and
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "header": "Product Texts" });
		});

		opaTest("The Subsection title is hidden when the title of the chart and subsection are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data", "Product Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(2, 0, false)
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "header": "Product Sales Data" });
		});

		//Based on the property hideChevronForUnauthorizedExtNav in manifest the chevron visibity is maintained where navigation is not possible
		opaTest("Row Action Chevron Rendering in Table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue");
			var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
			if (oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/pages/1/component/settings/hideChevronForUnauthorizedExtNav")) {
				Then.onTheObjectPage
					.theChevronIsVisibleInSalesRevenueTable(false);
			} else {
				Then.onTheObjectPage
					.theChevronIsVisibleInSalesRevenueTable(true);
			}
		});

		opaTest("Dynamic Side Content Validation- Show Content", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue")
				.and
				.iClickTheButtonHavingLabel("Show File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": true});
		});

		opaTest("Dynamic Side Content Validation- Hide Content, inline create sort & subsection rendering", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Hide File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": false})
				.and
				.iCheckTableForDefaultInlineCreateSort(true);
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue", "Target Sales Data");
			Then.onTheObjectPage
				.theSmartTableIsVisible("to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table");
		});

		opaTest("Focus set on First Editable Input Field of Header section", function(Given, When, Then){
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			Then.onTheGenericObjectPage
				.theButtonWithIdIsEnabled("edit", true);
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheGenericObjectPage
				.iExpectFocusSetOnControlById("headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Title::Field-input");
		});

		opaTest("Reused Components are refreshed on changing the Price value", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			When.onTheObjectPage
				.iEnterValueInField("900.00", "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Price::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Refreshed Price");
		});

		opaTest("Reused Components are refreshed on changing the Supplier value", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			When.onTheObjectPage
				.iEnterValueInField("100000047", "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Supplier::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Refreshed Supplier");
			Then.iTeardownMyApp();
		});
	}
);
