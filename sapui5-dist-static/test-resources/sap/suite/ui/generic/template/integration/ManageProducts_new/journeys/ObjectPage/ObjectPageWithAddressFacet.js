sap.ui.define(["sap/ui/test/opaQunit", "sap/suite/ui/generic/template/js/StableIdHelper"],
	function(opaTest, StableIdHelper) {
		"use strict";

		QUnit.module("Object Page Address Facet Rendering");

		opaTest("The Address Facet is rendered correctly", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)","manifestAddressFacet");
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.theHeaderFacetCommunicationAddressIsRendered();
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Communication Address"])
				.and
				.theObjectPageDataFieldWithStableIdHasTheCorrectValue({
					StableId: StableIdHelper.getStableId({
						type: "ObjectPageSection",
						subType: "AddressDataField",
						sFacet: StableIdHelper.getStableId({
							type: "ObjectPage",
							subType: "Facet",
							sRecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							sAnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
						}),
						sAnnotationPath: "to_Supplier/to_Address/@com.sap.vocabularies.Communication.v1.Address"
					}),
					Field: "",
					Value : "Av Alicia Moreau de Justo 302\n1147 Buenos Aires\nArgentina"
				});
			Then.iTeardownMyApp();
		});
	}
);
