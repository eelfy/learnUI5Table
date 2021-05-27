/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseTriangle", "sap/ui/core/Core"], function (
	BaseTriangle,
	Core
) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oTriangle = new BaseTriangle();
		},
		afterEach: function () {
			this.oTriangle = null;
		}
	});

	QUnit.test("default values of properties", function (assert) {
		assert.strictEqual(this.oTriangle.getWidth(), 0, "Default width is 0");
		assert.strictEqual(this.oTriangle.getHeight(), 0, "Default height is 0");
		assert.strictEqual(
			this.oTriangle.getOrientation(),
			"right",
			"Default orientation is right"
		);
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oTriangle = new BaseTriangle({
				x: 0,
				y: 0,
				width: 30,
				height: 20,
				rowYCenter: 10,
				orientation: "left"
			});
		},
		afterEach: function () {
			this.oTriangle = null;
		}
	});

	QUnit.test("getD for left orientation", function (assert) {
		var sPath;

		Core.getConfiguration().setRTL(true);
		sPath = "M 1 10 l -30 10 l 30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In RTL mode, the return value is '" + sPath + "'"
		);

		Core.getConfiguration().setRTL(false);
		sPath = "M 1 10 l -30 10 l 30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In non RTL mode, the return value is '" + sPath + "'"
		);
	});

	QUnit.test("getD for right orientation", function (assert) {
		this.oTriangle = new BaseTriangle({
			x: 0,
			y: 0,
			width: 30,
			height: 20,
			rowYCenter: 10,
			orientation: "right"
		});
		var sPath;

		Core.getConfiguration().setRTL(true);
		sPath = "M -1 10 l 30 10 l -30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In RTL mode, the return value is '" + sPath + "'"
		);

		Core.getConfiguration().setRTL(false);
		sPath = "M -1 10 l 30 10 l -30 10 Z";
		assert.strictEqual(
			this.oTriangle.getD(),
			sPath,
			"In non RTL mode, the return value is '" + sPath + "'"
		);
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = Core.createRenderManager();
		this.oTriangle.renderElement(oRm, this.oTriangle);
		oRm.flush(window.document.getElementById("qunit-fixture"));
		oRm.destroy();
		assert.ok(
			jQuery("#qunit-fixture").find("path").length === 1,
			"Rendering triangle is OK"
		);
	});
	QUnit.test("Event Click.", function (assert) {
		var oRm = Core.createRenderManager();
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oTriangle.attachPress(function (oEvent) {
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		this.oTriangle.onclick(new jQuery.Event("sapselect"));
	});
	QUnit.test("Event Mouse Enter.", function (assert) {
		var oRm = Core.createRenderManager();
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oTriangle.attachMouseEnter(function (oEvent) {
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		this.oTriangle.onmouseover(new jQuery.Event("mouseenter"));
	});
	QUnit.test("Event Mouse Leave.", function (assert) {
		var oRm = Core.createRenderManager();
		oRm.flush(window.document.getElementById("content"));
		oRm.destroy();
		var done = assert.async();
		this.oTriangle.attachMouseLeave(function (oEvent) {
			assert.strictEqual(oEvent.getSource().getWidth(), 30);
			done();
		});
		this.oTriangle.onmouseout(new jQuery.Event("mouseout"));
	});
});
