/*global QUnit */
sap.ui.define(["sap/gantt/simple/BaseRectangle", "sap/ui/core/Core"], function (BaseRectangle, Core) {
    "use strict";
	QUnit.module("Property", {
		beforeEach: function () {
			this.oRectangle = new BaseRectangle();
		},
		afterEach: function () {
			this.oRectangle = null;
		}
	});
	QUnit.test("Verify Default values", function (assert) {
        assert.strictEqual(this.oRectangle.getTitle(), "", "Default Title is empty");
        assert.strictEqual(this.oRectangle.getShowTitle(), true, "Default showtitle is True");
	});

	QUnit.test("Verify the title property", function (assert) {
		assert.strictEqual(this.oRectangle.getTitle(), "", "Default value for title is set");
		this.oRectangle.setTitle("Test Title");
		Core.applyChanges();
		assert.strictEqual(this.oRectangle.getTitle(), "Test Title", "Value of the title property is set");
	});

	QUnit.test("Verify the showTitle property", function (assert) {
		assert.strictEqual(this.oRectangle.getShowTitle(), true, "Default value for the showTitle is true");
		this.oRectangle.setShowTitle(false);
		Core.applyChanges();
		assert.strictEqual(this.oRectangle.getShowTitle(), false, "Value of the showTitle property is false");
	});

});
