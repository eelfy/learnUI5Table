/*global QUnit, sinon*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/Guid",
	"sap/ui/comp/smartfield/type/TextArrangement",
	"sap/ui/comp/smartfield/type/TextArrangementString",
	"sap/ui/model/ParseException",
	"sap/ui/model/ValidateException",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/ODataControlFactory",
	"sap/m/Input",
	"sap/ui/model/odata/v2/ODataModel"
], function (
	library,
	StringType,
	GuidType,
	TextArrangement,
	TextArrangementString,
	ParseException,
	ValidateException,
	SmartField,
	ODataControlFactory,
	Input,
	ODataModel) {
	"use strict";

	QUnit.module("");

	QUnit.test("with String type as primary type, it should format the value to an empty string (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(StringType);

		// system under test
		var oType = new TextArrangement(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), "");

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("with Guid type as primary type, it should format the value to an empty string (description only test case)", function (assert) {

		// arrange
		var oFormatOptions = {
			textArrangement: "descriptionOnly"
		};

		var oSettings = {
			keyField: "ID",
			descriptionField: "Text"
		};

		var fnStubGetPrimaryType = sinon.stub(TextArrangement.prototype, "getPrimaryType").returns(GuidType);

		// system under test
		var oType = new TextArrangement(oFormatOptions, null, oSettings);

		// assert
		assert.strictEqual(oType.formatValue([null, "Lorem Ipsum"], "string"), null);

		// cleanup
		oType.destroy();
		fnStubGetPrimaryType.restore();
	});

	QUnit.test("getFilterFields", function (assert) {
		assert.deepEqual(TextArrangement.prototype.getFilterFields(), ["keyField"], "Only the keyField should be returned");
	});

	QUnit.start();
});
