/*global QUnit */
sap.ui.define(
	["sap/gantt/simple/BaseDeltaRectangle", "sap/ui/core/Core"],
	function (BaseDeltaRectangle, Core) {
		"use strict";
		QUnit.module("Property", {
			beforeEach: function () {
				this.oRectangle = new BaseDeltaRectangle();
			},
			afterEach: function () {
				this.oRectangle = null;
			}
		});
		QUnit.test("Verify Default values", function (assert) {
			assert.strictEqual(this.oRectangle.getRx(), 0);
			assert.strictEqual(this.oRectangle.getRy(), 0);
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"",
				"Default Title is empty"
			);
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				true,
				"Default showtitle is True"
			);
		 });

		QUnit.test("Verify width property", function (assert) {
			this.oRectangle.setWidth("10");
			Core.applyChanges();
			assert.strictEqual(
				this.oRectangle.getWidth(),
				"10",
				"Value of the width property is set"
			);
		});
		QUnit.test("Verify width property by providing null value", function (
			assert
		) {
			this.oRectangle.setWidth(null);
			Core.applyChanges();
			assert.ok(
				this.oRectangle.getWidth() !== null,
				"Value of the width property is set"
			);
			assert.strictEqual(
				this.oRectangle.getWidth(),
				0,
				"Value of the width property is 0"
			);
		});

		QUnit.test("Verify the title property", function (assert) {
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"",
				"Default value for title is set"
			);
			this.oRectangle.setTitle("Test Title");
			Core.applyChanges();
			assert.strictEqual(
				this.oRectangle.getTitle(),
				"Test Title",
				"Value of the title property is set"
			);
		});

		QUnit.test("Verify the showTitle property", function (assert) {
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				true,
				"Default value for the showTitle is true"
			);
			this.oRectangle.setShowTitle(false);
			Core.applyChanges();
			assert.strictEqual(
				this.oRectangle.getShowTitle(),
				false,
				"Value of the showTitle property is false"
			);
		});

		QUnit.module("Function", {
			beforeEach: function () {
				this.oRectangle = new BaseDeltaRectangle({
					x: 10.0,
					y: 20.0,
					height: 15,
					width: 30,
					opacity: 0.4
				});
			},
			afterEach: function () {
				this.oRectangle = null;
			}
		});

		QUnit.test("Render Element", function (assert) {
			var oRm = Core.createRenderManager();
			this.oRectangle.renderElement(oRm, this.oRectangle);
			oRm.flush(window.document.getElementById("qunit-fixture"));
			oRm.destroy();
			assert.ok(
				jQuery("#qunit-fixture").find("rect").length === 1,
				"Rendering Rectangle is OK"
			);
		});

		QUnit.test("Event Click.", function (assert) {
			var oRm = Core.createRenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachPress(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onclick(new jQuery.Event("sapselect"));
		});
		QUnit.test("Event Mouse Enter.", function (assert) {
			var oRm = Core.createRenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachMouseEnter(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onmouseover(new jQuery.Event("mouseenter"));
		});
		QUnit.test("Event Mouse Leave.", function (assert) {
			var oRm = Core.createRenderManager();
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			var done = assert.async();
			this.oRectangle.attachMouseLeave(function (oEvent) {
				assert.strictEqual(oEvent.getSource().getX(), 10);
				done();
			});
			this.oRectangle.onmouseout(new jQuery.Event("mouseout"));
		});
	}
);
