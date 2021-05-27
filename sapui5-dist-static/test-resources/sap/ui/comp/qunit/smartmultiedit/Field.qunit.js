/*global QUnit, sinon */

sap.ui.define("test.sap.ui.comp.qunit.smartmultiedit.Field", [
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/comp/qunit/smartmultiedit/TestUtils",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/core/CustomData",
	"sap/ui/comp/smartfield/Configuration",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/Context"
], function (jQuery, TestUtils, Field, Container, MockServer, SmartForm, Group, GroupElement, CustomData, Configuration, createAndAppendDiv, Context) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Field's basic behaviour", {
		beforeEach: function () {
			var oForm = new SmartForm({
				editable: true,
				groups: [
					new Group({
						groupElements: [
							new GroupElement({
								elements: [new Field({
									propertyName: "test",
									description: "XYZ",
									useApplyToEmptyOnly: true
								})]
							})
						]
					})
				]
			});
			this.oContainer = new Container();
			this.oContainer.setLayout(oForm);
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Description", function (assert) {
		var aFields;

		// Render
		this.oContainer.placeAt("content");
		this.oContainer._onMetadataInitialized();
		sap.ui.getCore().applyChanges();

		aFields = this.oContainer._getFields();
		assert.equal(aFields.length, 1, "The container should corrctly return 1 field.");
		assert.equal(aFields[0].getDescription(), "XYZ", "description of the field should read 'XYZ'.");
	});

	QUnit.test("Container's custom data propagation", function (assert) {
		var oSmarty = this.oContainer._getFields()[0].getSmartField(),
			oCD1 = new CustomData({key: "addedKey", value: "addedValue"});

		assert.equal(oSmarty.getCustomData().length, 0, "There should be no custom data present at the start.");

		this.oContainer.addCustomData(oCD1);
		this.oContainer.insertCustomData(new CustomData({key: "insertedKey", value: "insertedValue"}), 0);
		this.oContainer.addCustomData(null);
		this.oContainer.insertCustomData(null);

		assert.equal(oSmarty.getCustomData().length, 2, "There should be 2 custom data present after two additions.");
		assert.equal(oSmarty.getCustomData()[0].getKey(), "addedKey", "Added custom data's key should be 'addedKey'.");
		assert.equal(oSmarty.getCustomData()[0].getValue(), "addedValue", "Added custom data's value should be 'addedValue'.");
		assert.equal(oSmarty.getCustomData()[1].getKey(), "insertedKey", "Inserted custom data's key should be 'insertedKey', insert index should be ignored.");
		assert.equal(oSmarty.getCustomData()[1].getValue(), "insertedValue", "Inserted custom data's value should be 'insertedValue', insert index should be ignored.");

		this.oContainer.removeCustomData(oCD1); // How is this supposed to work anyway?
		this.oContainer.removeAllCustomData();
		this.oContainer.destroyCustomData();
	});

	QUnit.test("Field's custom data propagation", function (assert) {
		var oField = this.oContainer._getFields()[0],
			oSmarty = oField.getSmartField(),
			oCD1 = new CustomData({key: "addedKey", value: "addedValue"});

		assert.equal(oField.getCustomData().length, 0, "There should be no custom data present at the start.");

		oField.addCustomData(oCD1);
		oField.insertCustomData(new CustomData({key: "insertedKey", value: "insertedValue"}), 0);
		oField.addCustomData(null);
		oField.insertCustomData(null);

		assert.equal(oSmarty.getCustomData().length, 2, "There should be 2 custom data present after two additions.");
		assert.equal(oSmarty.getCustomData()[0].getKey(), "addedKey", "Added custom data's key should be 'addedKey'.");
		assert.equal(oSmarty.getCustomData()[0].getValue(), "addedValue", "Added custom data's value should be 'addedValue'.");
		assert.equal(oSmarty.getCustomData()[1].getKey(), "insertedKey", "Inserted custom data's key should be 'insertedKey', insert index should be ignored.");
		assert.equal(oSmarty.getCustomData()[1].getValue(), "insertedValue", "Inserted custom data's value should be 'insertedValue', insert index should be ignored.");

		oField.removeCustomData(oCD1); // How is this supposed to work anyway?
		oField.removeAllCustomData();
		oField.destroyCustomData();
	});

	QUnit.test("Field's configuration propagation", function (assert) {
		var oField = this.oContainer._getFields()[0],
			oSmarty = oField.getSmartField(),
			setConfig = new Configuration({
				controlType: "dropDownList",
				displayBehaviour: "idAndDescription",
				preventInitialDataFetchInValueHelpDialog: false
			});

		oField.setConfiguration(setConfig);
		var getConfig = oSmarty.getConfiguration();

		assert.equal(
			getConfig.getControlType(),
			setConfig.getControlType(),
			"Control type of the configuration should be propagated properly.");
		assert.equal(
			getConfig.getDisplayBehaviour(),
			setConfig.getDisplayBehaviour(),
			"Display behaviour of the configuration should be propagated properly.");
		assert.equal(
			getConfig.getPreventInitialDataFetchInValueHelpDialog(),
			setConfig.getPreventInitialDataFetchInValueHelpDialog(),
			"That crazy named flag of the configuration should be propagated properly.");
	});

	QUnit.test("Field _handleInputChange", function (assert) {
		var oField = this.oContainer._getFields()[0];

		var getValueStub = sinon.stub(oField, "_getInnerEdit");
		getValueStub.returns({
			getValue: function () {
				return "0002";
			}
		});

		var isStringStub = sinon.stub(oField, "isString");
		isStringStub.returns(false);
		oField._handleInputChange();

		assert.equal(oField._oSmartField.getValue(), "2");

		isStringStub.returns(true);
		oField._handleInputChange();
		assert.equal(oField._oSmartField.getValue(), "0002");

		getValueStub.restore();
		isStringStub.restore();
	});

	QUnit.module("Field's value", {

		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer("metadata.xml");
			this.i18nModel = TestUtils.createI18nModel();

			TestUtils.createDataModel().then(function (oData) {
				this.oDataModel = oData.oModel;

				var aContexts = [
					new Context(this.oDataModel, "/Employees('0002')"),
					new Context(this.oDataModel, "/Employees('0003')")
				];

				this.oContainer = TestUtils.createContainer(aContexts, this.oDataModel, this.i18nModel);
				fnDone();

		}.bind(this));
	},
		afterEach: function () {
			this.oMockServer.destroy();
			this.oContainer.destroy();
		}
	});

	QUnit.test("Checking Mandate Fields", function (assert) {
		var oFields = this.oContainer._getFields();

		for (var i = 0; i < oFields.length; i++) {
			if (oFields[i]._oSmartField.getMandatory()) {
				assert.ok(oFields[i].getLabel().getRequired(),"Required should be true");
			} else {
				assert.ok(!oFields[i].getLabel().getRequired(), "Required should be false");
			}
		}
	});

	QUnit.test("Check for all fields value", function (assert) {

			var oExpectedResult = {
				"Edm.String" : "string",
				"Edm.Int64" : "string",
				"Edm.Float" : "string",
				"Edm.Boolean" : "boolean",
				"Edm.Byte" :   "number",
				"Edm.Decimal" : "string",
				"Edm.Single" : "string",
				"Edm.Double" : "string",
				"Edm.DateTime" : "object",
				"Edm.DateTimeOffset" : "object",
				"Edm.Guid" : "string"
			};

			this.oContainer.placeAt("content");

			this.oContainer.getFields().forEach(function (oField) {

					oField.setSelectedIndex(oField._oSelect.getSelectableItems().length - 1);
					sap.ui.getCore().applyChanges();

					assert.equal(typeof oField.getRawValue()[oField.getPropertyName()], oExpectedResult[oField.getDataType()], "Success");
				});
	});
	QUnit.test("Check to see if thousands seperator comma is removed from raw value in decimals", function (assert) {
		this.oContainer.placeAt("content");
		var oDecimalField  = this.oContainer.getFields()[5];
		oDecimalField.setSelectedIndex(3);
		assert.equal(oDecimalField.getValue(), "1,230.01", "Expected FormattedsValue present");
		assert.equal(oDecimalField.getRawValue()[oDecimalField.getPropertyName()], "1230.01", "Expected RawValue present");
	});
});
