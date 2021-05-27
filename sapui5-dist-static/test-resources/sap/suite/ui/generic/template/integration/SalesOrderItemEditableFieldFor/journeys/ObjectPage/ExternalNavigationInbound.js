sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
	"use strict";

	QUnit.module("EditableFieldFor - OP");

	var sValue1 = "400000000", sValue2 = "30";

	["", "manifestOriginalFieldInSFB", "manifestForEditFieldInSemanticKey", "manifestOrigFieldInSFBandForEditFieldInSemanticKey"].forEach(function(sManifest){

		[{sParameter1: "SalesOrder", sParameter2: "SalesOrderItem"}, {
			sParameter1: "SalesOrderForEdit",
			sParameter2: "SalesOrderItemForEdit"
		}].forEach(function (oParameter) {
			// Convert to computed property of ES6 feature once we don't support IE11
			var oAppParams = {"sapTheme": "sap_belize"};
			oAppParams[oParameter.sParameter1] = sValue1;
			oAppParams[oParameter.sParameter2] = sValue2;

			opaTest("Manifest: " + sManifest + "Parameter: " + oParameter.sParameter1, function (Given, When, Then) {
				Given.iStartMyAppInSandbox("SalesOrderItems-EditableFieldFor#SalesOrderItems-EditableFieldFor", sManifest, oAppParams);
				Then.onTheGenericObjectPage
					.theObjectPageDataFieldHasTheCorrectValue({Field: "SalesOrderForEdit", Value: sValue1});
				Then.iTeardownMyApp();
			});
		});
	});
});
