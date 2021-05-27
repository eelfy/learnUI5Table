sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Applicable Path Object Page Charts");

		opaTest("Applicable-path based Action buttons on the Object Page Chart are rendered correctly and check the Standard variant name", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", null, {bWithChange: true});
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iClickTheButtonHavingLabel("Sales Data");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", {"visible": true})
				.and
				.iCheckChartToolbarControlProperty({"EPMProduct::EPMProduct": [true, false]}, "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart") // EPMProduct::EPMProduct text is Manage Products (STTA)
				.and
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("Save a variant in Chart and check the variant is retained for the record after navigating to LR and Open again", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSmartVariantViewSelection("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant")
				.and
				.iClickTheButtonWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-saveas")
				.and
				.iSetTheInputFieldWithId("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart-variant-name", "Sorted")
				.and
				.iClickTheButtonOnTheDialog("Save");

			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iClickTheButtonHavingLabel("Sales Data");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Sorted");
		});

		opaTest("New chart variant is not retained for a different record - Standard variant is selected", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(4);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			When.onTheGenericObjectPage
			    .iClickTheButtonHavingLabel("Sales Data");
			Then.onTheObjectPage
				.theCorrectSmartVariantIsSelected("Standard");
			Then.iTeardownMyApp();
		});
	}
);
