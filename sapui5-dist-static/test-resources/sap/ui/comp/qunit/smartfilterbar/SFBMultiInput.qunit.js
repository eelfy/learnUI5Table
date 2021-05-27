/* globals QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfilterbar/SFBMultiInput",
	"sap/m/MultiInput",
	"sap/ui/core/Core",
	"sap/ui/comp/smartfilterbar/FilterProvider",
	"sap/m/Token"
], function(
	SFBMultiInput,
	MultiInput,
	Core,
	FilterProvider,
	Token
) {
	"use strict";

	QUnit.module("Generic", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
			this.oControl = null;
		}
	});

	QUnit.test("Override onBeforeRendering method calls parent method", function (assert) {
		// Arrange
		var oSpy = sinon.spy(MultiInput.prototype, "onBeforeRendering");

		// Act
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Overridden method called once");

		// Cleanup
		oSpy.restore();
	});

	QUnit.module("Token creation from initial value", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
		}
	});

	QUnit.test("With value", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.setValue("test");
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_validateCurrentText called once");
		assert.ok(oSpy.calledWith(true), "Method called with bExactMatch=true");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("Without value", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 0, "_validateCurrentText not called");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("Flag _pendingAutoTokenGeneration lifecycle", function (assert) {
		// Arrange
		assert.expect(3);

		// Mock method so we can validate if the property is set before
		this.oControl._validateCurrentText = function () {
			assert.strictEqual(this.oControl._pendingAutoTokenGeneration, true,
				"Property set to true prior to calling _validateCurrentText method onBeforeRendering phase");
		}.bind(this);

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, undefined, "By default the property is undefined");

		// Act
		this.oControl.setValue("test");
		this.oControl.onBeforeRendering();

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, false,
			"Property set to false after calling _validateCurrentText method onBeforeRendering phase");
	});

	QUnit.test("setTokens should update the filter model", function (assert) {
		// Arrange
		var oFilterProvider = sinon.createStubInstance(FilterProvider),
			sFieldName = "fieldName",
			oItemToken = new Token({
				key: "1",
				text: "Key 1 (1)"
			}),
			oRangeToken = new Token({
				key: "2",
				text: "Key 2 (2)"
			}).data("range", {});

		sinon.stub(this.oControl, "_getFilterProvider").returns(oFilterProvider);
		sinon.stub(this.oControl, "_getFieldViewMetadata").returns({fieldName: sFieldName});

		// Act
		this.oControl.setTokens([oItemToken, oRangeToken]);

		// Assert
		assert.ok(oFilterProvider._tokenUpdate.calledOnce);
	});

	QUnit.test("setTokens rises the _pendingAutoTokenGeneration flag", function (assert) {
		// Arrange
		var oFPMock = {
			_tokenUpdate: function (oSettings) {
				// Assert
				assert.strictEqual(oSettings.control._pendingAutoTokenGeneration, true,
					"flag set to true prior to calling _tokenUpdate");
			}
		};

		this.oControl._setFilterProvider(oFPMock);

		// Act
		this.oControl.setTokens([new Token()]);

		// Assert
		assert.strictEqual(this.oControl._pendingAutoTokenGeneration, false,
			"flag set to false after to calling _tokenUpdate");
	});

	QUnit.start();

});
