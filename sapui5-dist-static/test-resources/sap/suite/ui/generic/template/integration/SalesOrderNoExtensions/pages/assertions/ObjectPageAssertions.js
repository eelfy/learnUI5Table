/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5"],
	function (Opa5) {
		'use strict';

		return function () {
			return {
				iShouldSeeTheRowHighlighted: function (sId, iRowIndex, sExpectedHighlight) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						actions: function (oTable) {
							var sHighlight = oTable.getItems()[iRowIndex].getHighlight();
							Opa5.assert.equal(sHighlight, sExpectedHighlight, "The Row Item Highlight for the item at index: " + iRowIndex);
						},
						errorMessage: "The row item Highlight is incorrect"
					});
				},

				iCheckTextInPopover: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (oPopover) {
							var sActualText = oPopover[0].getContent()[0].getItems()[0].getText();
							Opa5.assert.ok(sActualText === sText, "MessagePopover with text '" + sText + "' found on the screen");
						},
						errorMessage: "Couldn't find the message popover on the screen"
					});
				}
			};
		};
	});
