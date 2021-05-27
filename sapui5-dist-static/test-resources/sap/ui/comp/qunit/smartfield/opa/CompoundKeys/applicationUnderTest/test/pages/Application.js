sap.ui.define(
	[
		"sap/ui/test/Opa5"
	],
	function (Opa5) {
		"use strict";

		var sIdSmartField = "Name";
		var sIdUrl = "url";
		var sIdResponse = "response";

		Opa5.createPageObjects({
			onTheApplicationPage: {
				actions: {
					iChangeTheValueTo: function (sValue) {
						return this.compTestLibrary.iEnterTextInSmartField(sIdSmartField, sValue, false);
					}
				},
				assertions: {
					iShouldSeeAValue: function(oValue){
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndValue(sIdSmartField, oValue);
					},
					controlShouldNotBeInErrorState: function(){
						return this.compTestLibrary.iShouldSeeSmartFieldWithValueState(sIdSmartField, "None");
					},
					modelValueShouldMatch: function (sValue) {
						return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndBindingValue(sIdSmartField, sValue);
					},
					theRequestURLShouldMatch: function (sRequestURL, sErrorMessage) {
						return this.waitFor({
							id: sIdUrl,
							success: function (oText) {
								Opa5.assert.strictEqual(
									oText.getText(),
									sRequestURL,
									sErrorMessage ? sErrorMessage : "Request URL should match"
								);
							}
						});
					},
					theResponseCountShouldMatch: function (iCount, sErrorMessage) {
						return this.waitFor({
							id: sIdResponse,
							success: function (oText) {
								var oResponse = JSON.parse(oText.getText().trim());

								Opa5.assert.strictEqual(
									parseInt(oResponse.d["__count"]),
									iCount,
									sErrorMessage ? sErrorMessage : "Request '__count' should match"
								);

								Opa5.assert.strictEqual(
									oResponse.d.results.length,
									iCount,
									sErrorMessage ? sErrorMessage : "Request count should match"
								);
							}
						});
					},
					theResponseCountShouldHaveAKey: function (sKey, iMatches, sErrorMessage) {
						return this.waitFor({
							id: sIdResponse,
							success: function (oText) {
								var oResponse = JSON.parse(oText.getText().trim()),
									iKeyMatched = 0;

								oResponse.d.results.forEach(function (oResult) {
									if (oResult.KEY === sKey) {
										iKeyMatched++;
									}
								});

								Opa5.assert.strictEqual(
									iKeyMatched,
									iMatches,
									sErrorMessage ? sErrorMessage : "There should be " + iMatches + " records with matching key"
								);
							}
						});
					}
				}
			}
		});
	}
);