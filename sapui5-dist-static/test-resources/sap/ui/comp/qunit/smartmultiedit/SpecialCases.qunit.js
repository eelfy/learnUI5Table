/*global QUnit*/

sap.ui.define([
	"test-resources/sap/ui/comp/qunit/smartmultiedit/TestUtils",
	"sap/ui/comp/smartmultiedit/Field",
	"sap/ui/comp/smartmultiedit/Container",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/Context",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (TestUtils, Field, Container, MockServer, SmartForm, Group, GroupElement, ODataModel, ResourceModel,
             Context, NumberFormat, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("Special Case: EntitySet is creatable and has updatable path", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer("metadataSpecialCase.xml", "smartmultiedit.EmployeesUpdatable/");
			this.i18nModel = TestUtils.createI18nModel();

			TestUtils.createDataModel("smartmultiedit.EmployeesUpdatable", "EmployeesUpdatable").then(function (oData) {
				this.oDataModel = oData.oModel;

				var aContexts = [
					new Context(this.oDataModel, "/EmployeesUpdatable('0001')"),
					new Context(this.oDataModel, "/EmployeesUpdatable('0003')")
				];

				this.oContainer = TestUtils.createContainer(aContexts, this.oDataModel, this.i18nModel, TestUtils.createSimpleSmartForm(["FirstName"]), "EmployeesUpdatable");
				fnDone();
			}.bind(this));
		},
		afterEach: function () {
			this.oContainer.destroy();
			this.oMockServer.destroy();
		}
	});

	QUnit.test("Basic Checks: Number of fields", function (assert) {
		this.oContainer.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(this.oContainer.getFields().length, 1, "Container has 1 field");
	});
	QUnit.test("Check if field is editable", function (assert) {
		this.oContainer.placeAt("content");
		sap.ui.getCore().applyChanges();
		var oFirstNameField = this.oContainer.getFields()[0];
		return oFirstNameField._pInitialised.then(function () {
			oFirstNameField.focus();
			oFirstNameField._updateSpecialSelectItems();

			assert.strictEqual(oFirstNameField.getSmartField().getDomRef(), null, "Smart Field not rendered on inital load");

			oFirstNameField.setSelectedIndex(2);
			sap.ui.getCore().applyChanges();

			assert.ok(!!oFirstNameField.getSmartField().getDomRef(), "Smart Field rendered when item is selected");
			assert.equal(oFirstNameField.getSmartField().getEditable(), true, "Smart Field should be editable.");
		});
	});

	QUnit.module("Special cases");
	QUnit.test("Combo box without text annotation returns row value", function (assert) {
		var oMockServer = TestUtils.createMockServer("metadata.xml"),
			i18nModel = TestUtils.createI18nModel();

		return TestUtils.createDataModel().then(function (oData) {
			var oDataModel = oData.oModel;

			var aContexts = [
				new Context(oDataModel, "/Employees('0002')"),
				new Context(oDataModel, "/Employees('0003')")
			];

			var oContainer = TestUtils.createContainer(aContexts, oDataModel, i18nModel, TestUtils.createSimpleSmartForm(["GenderWithoutText"]));
			oContainer.placeAt("content");
			var oField = oContainer.getFields()[0];
			// eslint-disable-next-line max-nested-callbacks
			return oField._pInitialised.then(function () {
				oField.focus();
				oField._updateSpecialSelectItems();
				oField.setSelectedIndex(1);
				sap.ui.getCore().applyChanges();

				var oValue = oField.getRawValue();
				assert.equal(Object.keys(oValue).length, 1, "Row value return only one value");
				assert.strictEqual(oValue["GenderWithoutText"], "", "GenderWithoutText value returned");

				oContainer.destroy();
				oMockServer.destroy();
			});
		});
	});

});
