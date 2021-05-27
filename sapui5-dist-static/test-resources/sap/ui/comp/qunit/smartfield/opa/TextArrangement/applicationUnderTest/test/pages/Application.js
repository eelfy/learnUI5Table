sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
	"use strict";

	var sIdEvents = "events";

	Opa5.createPageObjects({
		onTheApplicationPage: {
			actions: {
				iChangeTheValueTo: function (sId, sValue) {
					return this.compTestLibrary.iEnterTextInSmartField(
						sId,
						sValue,
						false
					);
				},
				iChangeTheInputValueTo: function (sValue) {
					return this.waitFor({
						id: "productNameInput",
						success: function (oInput) {
							oInput.setValue(sValue);
						}
					});
				},
				iClearTheLog: function () {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							oList.removeAllItems(); // Clear the list
						}
					});
				}
			},
			assertions: {
				iShouldSeeSmartFieldWithIdAndValue: function (sId, oValue) {
					return this.compTestLibrary.iShouldSeeSmartFieldWithIdAndValue(
						sId,
						oValue
					);
				},
				iShouldSeeNumberOfRequests: function (nCount, sEntitySet) {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var aResult = oList.getItems().filter(function (oItem) {
								var sRequest = oItem.data("request");
								return (
									sRequest &&
									sRequest.indexOf("testService/" + sEntitySet) !== -1
								);
							});
							Opa5.assert.strictEqual(
								aResult.length,
								nCount,
								"Expected requests: " + nCount
							);
						}
					});
				},
				iShouldCheckTheRequestParameters: function () {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							oList.getItems().forEach(function (oItem) {
								var sLog = oItem.data("request");

								if (sLog && sLog.startsWith("testService/StringVH")) {
									Opa5.assert.notStrictEqual(
										sLog.indexOf("$filter=KEY eq '"),
										-1,
										"Filter for `key` exists"
									);
									Opa5.assert.strictEqual(
										sLog.indexOf("substringof"),
										-1,
										"There is no substringof filter"
									);
								}
							});
						}
					});
				},
				iShouldSeeSimpleLogEntry: function (sExpectedText, iExpectedIndex, iExpectedResults) {
					// Explicit check for null/undefined
					if (iExpectedResults === null || iExpectedResults === undefined) {
						iExpectedResults = 1; // Default positive
					}
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var iFoundAtIndex,
								aItems = oList.getItems().filter(function (oItem, iIndex) {
									if (oItem.isA("sap.m.StandardListItem") && oItem.getTitle() === sExpectedText) {
										iFoundAtIndex = iIndex;
										return true;
									}
									return false;
								});

							Opa5.assert.strictEqual(aItems.length, iExpectedResults, "One such request exist in log");

							// Explicit check for null/undefined
							if (iExpectedIndex !== null && iExpectedIndex !== undefined) {
								Opa5.assert.strictEqual(iFoundAtIndex, iExpectedIndex,
									"Log entry found at expected index");
							}
						}
					});
				},
				iShouldSeeRequest: function (sRequest, iExpectedIndex) {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var iFoundAtIndex,
								aItems = oList.getItems().filter(function (oItem, iIndex) {
									if (oItem.data("request") === sRequest) {
										iFoundAtIndex = iIndex;
										return true;
									}
									return false;
								});
							Opa5.assert.strictEqual(
								aItems.length,
								1,
								"One such request exist in log"
							);
							// Explicit check for null/undefined
							if (iExpectedIndex !== null && iExpectedIndex !== undefined) {
								Opa5.assert.strictEqual(iFoundAtIndex, iExpectedIndex,
									"Request found at expected index");
							}
						}
					});
				},
				iCheckTheRequestHasNoSubstringText: function () {
					return this.waitFor({
						id: sIdEvents,
						success: function (oList) {
							var aItems = oList.getItems().filter(function (oItem) {
								var sLog = oItem.data("request");
								return sLog && sLog.indexOf("substringof") !== -1;
							});
							Opa5.assert.strictEqual(
								aItems.length,
								0,
								"There should be no requests with substringof operation"
							);
						}
					});
				}
			}
		}
	});
});
