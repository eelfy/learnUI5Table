/*global QUnit */
sap.ui.define([
	"sap/ui/comp/p13n/P13nConditionPanel"
], function(
	P13nConditionPanel
) {
	"use strict";

	QUnit.module("Events", {
		beforeEach: function() {
			this.oP13nConditionPanel = new P13nConditionPanel();
		},
		afterEach: function() {
			this.oP13nConditionPanel = null;
		}
	});

	QUnit.test("fireDataChange with Exclude Operation", function (assert) {
		// Arrange
		var done = assert.async();
		this.oP13nConditionPanel.attachDataChange(function(oEvent){
			var oNewData = oEvent.getParameter("newData");
			// Assert
			assert.strictEqual(
				oNewData.operation,
				"Contains",
				"Types should match"
			);
			done();
		});

		// Act
		this.oP13nConditionPanel.fireDataChange({
			key: "sKey",
			index: 1,
			operation: "remove",
			newData: {
				"index": 1,
				"key": "condition_1",
				"exclude": false,
				"operation": "NotContains",
				"keyField": "ItemId",
				"value1": "TESTVOD1",
				"value2": null
			  }
		});
	});

	QUnit.start();
});