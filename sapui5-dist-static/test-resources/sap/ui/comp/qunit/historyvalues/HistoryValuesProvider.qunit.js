/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/historyvalues/HistoryValuesProvider"
], function(HistoryValuesProvider) {
	"use strict";

	QUnit.module("sap.ui.comp.providers.HistoryValuesProvider");

	QUnit.test("control and fieldName should be set on init", function (assert) {
		// Arrange
		var oControl = { name: "control", isA: this.stub(), destroy: this.stub() },
			oHVP = new HistoryValuesProvider(oControl, "fieldName");

		// Assert
		assert.deepEqual(oHVP._oControl, oControl, "control is set");
		assert.equal(oHVP._sFieldName, "fieldName", "field name is set");

		// Cleanup
		oControl.destroy();
		oHVP.destroy();
	});

	QUnit.test("attachChangeListener/_detachChangeListener should attach/detach to attachTokenUpdate when MultiInput is used", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(true);

		var oControl = {
			isA: oIsA,
			attachTokenUpdate: this.spy(),
			detachTokenUpdate: this.spy()
		};

		// Act
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		oHVP.attachChangeListener();
		oHVP.destroy();

		// Assert
		assert.equal(oControl.attachTokenUpdate.callCount, 1, "attachTokenUpdate should be called once");
		assert.equal(oControl.detachTokenUpdate.callCount, 1, "detachTokenUpdate should be called once");
	});

	QUnit.test("attachChangeListener/_detachChangeListener should attach/detach to attachTokenUpdate when MultiComboBox is used", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(false);
		oIsA.withArgs("sap.m.MultiComboBox").returns(true);

		var oControl = {
			isA: oIsA,
			attachSelectionChange: this.spy(),
			detachSelectionChange: this.spy()
		};

		// Act
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		oHVP.attachChangeListener();
		oHVP.destroy();

		// Assert
		assert.equal(oControl.attachSelectionChange.callCount, 1, "attachSelectionChange should be called once");
		assert.equal(oControl.detachSelectionChange.callCount, 1, "detachSelectionChange should be called once");
	});

	QUnit.test("attachChangeListener/_detachChangeListener should attach/detach to attachTokenUpdate when Input is used", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(false);
		oIsA.withArgs("sap.m.MultiComboBox").returns(false);
		oIsA.withArgs("sap.m.Input").returns(true);

		var oControl = {
			isA: oIsA,
			attachChange: this.spy(),
			detachChange: this.spy()
		};

		// Act
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		oHVP.attachChangeListener();
		oHVP.destroy();

		// Assert
		assert.equal(oControl.attachChange.callCount, 1, "attachChange should be called once");
		assert.equal(oControl.detachChange.callCount, 1, "detachChange should be called once");
	});

	QUnit.test("attachChangeListener/_detachChangeListener should attach/detach to attachTokenUpdate when ComboBox is used", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(false);
		oIsA.withArgs("sap.m.MultiComboBox").returns(false);
		oIsA.withArgs("sap.m.Input").returns(false);
		oIsA.withArgs("sap.m.ComboBox").returns(true);

		var oControl = {
			isA: oIsA,
			attachChange: this.spy(),
			detachChange: this.spy()
		};

		// Act
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		oHVP.attachChangeListener();
		oHVP.destroy();

		// Assert
		assert.equal(oControl.attachChange.callCount, 1, "attachChange should be called once");
		assert.equal(oControl.detachChange.callCount, 1, "detachChange should be called once");
	});

	QUnit.test("_onMultiInputChange should call setFieldData with the right data", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(true);
		var oControl = { isA: oIsA, attachTokenUpdate: this.stub(), detachTokenUpdate: this.stub() };
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		var aExpected = [{ dataKey: "data value" }],
			oToken = {
				data: function () {
					return { __metadata: "metadata", dataKey: "data value" };
				}
			},
			aTokens = [oToken],
			oEvent = { getParameter: this.stub() },
			oSetFieldData = this.stub(oHVP, "setFieldData");
		oEvent.getParameter.withArgs("type").returns("added");
		oEvent.getParameter.withArgs("addedTokens").returns(aTokens);

		// Act
		oHVP._onMultiInputChange(oEvent);

		// Assert
		var aResult = oSetFieldData.getCall(0).args[0];
		assert.deepEqual(aResult, aExpected);

		// Cleanup
		oHVP.destroy();
		oSetFieldData.restore();
	});

	QUnit.test("_onMultiComboBoxChange should call setFieldData with the right data", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(false);
		oIsA.withArgs("sap.m.MultiComboBox").returns(true);
		var oControl = { isA: oIsA, attachSelectionChange: this.stub(), detachSelectionChange: this.stub() };
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		var aExpected = [{ fieldName: "field value" }],
			oData = { __metadata: "metadata", fieldName: "field value" },
			oEvent = { getParameter: this.stub() },
			oSetFieldData = this.stub(oHVP, "setFieldData");

		oEvent.getParameter.withArgs("selected").returns(true);
		oEvent.getParameter.withArgs("changedItem").returns({
			getBindingContext: this.stub().returns({
				getObject: this.stub().returns(oData)
			})
		});

		// Act
		oHVP._onMultiComboBoxChange(oEvent);

		// Assert
		var aResult = oSetFieldData.getCall(0).args[0];
		assert.deepEqual(aResult, aExpected);

		// Cleanup
		oHVP.destroy();
		oSetFieldData.restore();
	});

	QUnit.test("_onComboBoxChange should call setFieldData with the right data", function (assert) {
		// Arrange
		var oIsA = this.stub();
		oIsA.withArgs("sap.m.MultiInput").returns(false);
		oIsA.withArgs("sap.m.MultiComboBox").returns(false);
		oIsA.withArgs("sap.m.Input").returns(false);
		oIsA.withArgs("sap.m.ComboBox").returns(true);
		var oControl = { isA: oIsA, attachChange: this.stub(), detachChange: this.stub() };
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		var aExpected = [{ fieldName: "field value" }],
			oData = { __metadata: "metadata", fieldName: "field value" },
			oEvent = {
				getParameter: this.stub(),
				getSource: function () {
					return {
						getSelectedItem: function () {
							return {
								getBindingContext: function () {
									return {
										getObject: function () {
											return oData;
										}
									};
								}
							};
						}
					};
				}
			},
			oSetFieldData = this.stub(oHVP, "setFieldData");

		oEvent.getParameter.withArgs("value").returns("value");
		oEvent.getParameter.withArgs("newValue").returns("newValue");

		// Act
		oHVP._onComboBoxChange(oEvent);

		// Assert
		var aResult = oSetFieldData.getCall(0).args[0];
		assert.deepEqual(aResult, aExpected);

		// Cleanup
		oHVP.destroy();
		oSetFieldData.restore();
	});

	QUnit.test("_processSingleValueControl should call setFieldData with the right data", function (assert) {
		// Arrange
		var aExpected = [{ fieldName: "field value", date: "/Date(1612910800000)/" }],
			oData = { __metadata: "metadata", fieldName: "field value", date: new Date(1612910800000) };
		var oControl = { isA: this.stub(), attachSelectionChange: this.stub(), detachSelectionChange: this.stub() };
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		var oSetFieldData = this.stub(oHVP, "setFieldData");

		// Act
		oHVP._processSingleValueControl(oData);
		var aResult = oSetFieldData.getCall(0).args[0];

		// Assert
		assert.deepEqual(aResult, aExpected);

		// Cleanup
		oHVP.destroy();
		oSetFieldData.restore();
	});

	QUnit.test("_getDistinct should return only unique entries from an array", function (assert) {
		// Arrange
		var oControl = { isA: this.stub(), attachSelectionChange: this.stub(), detachSelectionChange: this.stub() };
		var oHVP = new HistoryValuesProvider(oControl, "fieldName");
		var oItem1 = { firstName: "firstName1", lastName: "lastName1"  },
			oItem2 = { firstName: "firstName1", lastName: "lastName2" },
			oItem3 = { firstName: "firstName2", lastName: "lastName1" },
			aExpected = [oItem1, oItem2, oItem3],
			aTestArray = [oItem1, oItem2, oItem1, oItem2, oItem3, oItem3, oItem3];

		// Act
		var aResult = oHVP._getDistinct(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");

		// Cleanup
		oHVP.destroy();
	});

	QUnit.start();

});
