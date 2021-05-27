sap.ui.define(["sap/ui/test/opaQunit"], function(opaTest) {
	"use strict";

	QUnit.module("EditableFieldFor - LR");

	var sValue = "400000001";

	[{sFilterField: "SalesOrderForEdit", sManifest: "", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrder", sManifest: "manifestOriginalFieldInSFB", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrderForEdit", sManifest: "manifestForEditFieldInSemanticKey", bExpectedHeaderExpanded: true},
	 {sFilterField: "SalesOrder", sManifest: "manifestOrigFieldInSFBandForEditFieldInSemanticKey"}].forEach(function(oAppConfig) {

		["SalesOrderForEdit", "SalesOrder"].forEach(function (sParameter) {
			// Convert to computed property of ES6 feature once we don't support IE11
			var oAppParams = {"sapTheme": "sap_belize"};
			oAppParams[sParameter] = sValue;
			opaTest("Manifest: " + oAppConfig.sManifest + "Parameter: " + sParameter, function (Given, When, Then) {

				Given.iStartMyAppInSandbox("SalesOrderItems-EditableFieldFor#SalesOrderItems-EditableFieldFor", oAppConfig.sManifest, oAppParams);
				When.onTheGenericListReport
					.iSetTheHeaderExpanded(oAppConfig.bExpectedHeaderExpanded);
				Then.onTheListReportPage
					.theFilterIsFilled(oAppConfig.sFilterField, sValue);

				Then.iTeardownMyApp();

			});
		});
	 });
});
