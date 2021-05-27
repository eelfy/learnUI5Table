/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/BaseConditionalShape",
	"./GanttQUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText",
	"sap/gantt/misc/Format"
], function (BaseConditionalShape, GanttUtils, BaseRectangle, BaseGroup,BaseText, Format) {
	"use strict";

	QUnit.module("Conditional Shape", {
		beforeEach: function () {
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000")
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
						time: Format.abapTimestampToDate("20180101100000"),
						endTime: Format.abapTimestampToDate("20180101900000")
					}),
					new BaseGroup({
						shapes: [
							new BaseRectangle({
								id: "r3",
								shapeId: "r3",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000")
							}),
							new BaseText({
								id: "t1",
								shapeId: "t2",
								time: Format.abapTimestampToDate("20180101100000"),
								endTime: Format.abapTimestampToDate("20180101900000")
							})
						]
					})
				]
			});
			this.oGantt = GanttUtils.createSimpleGantt(this.oShape, "20180101000000", "20180110000000");
			this.oGantt.placeAt("content");
		},
		afterEach: function () {
			this.oShape = null;
			this.oGantt.destroy();
			this.oGantt = null;
		}
	});

	QUnit.test("Active shape selects correct value", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				assert.equal($element.attr("data-sap-gantt-shape-id"), "r1", "First shape should be selected by default.");
				var oShape = sap.ui.getCore().byId($element.attr("id")).getParent();
				oShape.setActiveShape(1);
				sap.ui.getCore().applyChanges();
				$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				assert.equal($element.attr("data-sap-gantt-shape-id"), "r2", "Second shape should be selected by default.");
				done();
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Active shape out of bounds doesn't render any shape", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oShape = sap.ui.getCore().byId($element.attr("id")).getParent();
				oShape.setActiveShape(-1);
				sap.ui.getCore().applyChanges();
				$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				assert.equal($element.length, 0, "No shape should be rendered.");
				oShape.setActiveShape(3);
				sap.ui.getCore().applyChanges();
				$element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				assert.equal($element.length, 0, "No shape should be rendered.");
				done();
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("countInBirdEye property", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oConShape = sap.ui.getCore().byId($element.attr("id")).getParent();
				var aShapes = oConShape.getShapes();
				oConShape.setActiveShape(-1);
				assert.equal(oConShape.getCountInBirdEye(), false);

				oConShape.setActiveShape(0);
				assert.equal(oConShape.getCountInBirdEye(), false);
				aShapes[0].setCountInBirdEye(true);
				assert.equal(aShapes[0].getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				oConShape.setActiveShape(1);
				assert.equal(oConShape.getCountInBirdEye(), false);
				done();
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("countInBirdEye StartTime/EndTime Validations", function (assert) {
		var oGantt = this.oGantt;
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var $element = oGantt.$("svg").find("[data-sap-gantt-row-id='row1']").children();
				var oConShape = sap.ui.getCore().byId($element.attr("id")).getParent();
				var aShapes = oConShape.getShapes();
				var oHorizonRange = {};
				oConShape.setActiveShape(-1);
				assert.equal(oConShape.getCountInBirdEye(), false);

				oConShape.setActiveShape(0);
				assert.equal(oConShape.getCountInBirdEye(), false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has not been set.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has not been set.");

				oHorizonRange = {};
				aShapes[0].setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[0].getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				aShapes[0].setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[0].getCountInBirdEye(), false);
				assert.equal(oConShape.getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been reset.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been reset.");

				oHorizonRange = {};
				oConShape.setActiveShape(1);
				aShapes[1].setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[1].getCountInBirdEye(), true);
				assert.equal(oConShape.getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				oConShape.setActiveShape(1);
				aShapes[1].setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[1].getCountInBirdEye(), false);
				assert.equal(oConShape.getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been reset.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been reset.");

				oHorizonRange = {};
				oConShape.setActiveShape(2);
				aShapes[2].getShapes()[0].setCountInBirdEye(true);
				aShapes[2].getShapes()[1].setCountInBirdEye(true);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[2].getShapes()[0].getCountInBirdEye(), true);
				assert.equal(aShapes[2].getShapes()[1].getCountInBirdEye(), true);
				assert.notEqual(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.notEqual(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");

				oHorizonRange = {};
				oConShape.setActiveShape(2);
				aShapes[2].getShapes()[0].setCountInBirdEye(false);
				aShapes[2].getShapes()[1].setCountInBirdEye(false);
				oHorizonRange = oGantt._getZoomExtension()._getBirdEyeRangeOnRow(0);
				assert.equal(aShapes[2].getShapes()[0].getCountInBirdEye(), false);
				assert.equal(aShapes[2].getShapes()[1].getCountInBirdEye(), false);
				assert.equal(oHorizonRange.startTime, undefined, "Horizon Range StartDate has been set.");
				assert.equal(oHorizonRange.endTime, undefined, "Horizon Range EndDate has been set.");
				done();
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("Stand Alone");

	QUnit.test("Important properties get propagated", function (assert) {
		var oInnerShape = new BaseRectangle();
		var oShape = new BaseConditionalShape({
			shapes: oInnerShape
		});
		oShape.setRowYCenter(5);
		oShape.setSelected(true);
		oShape.setProperty("shapeUid", "test");
		assert.equal(oInnerShape.getRowYCenter(), 5, "rowYCenter should be propagated.");
		assert.equal(oInnerShape.getSelected(), true, "selected should be propagated.");
		assert.equal(oInnerShape.getShapeUid(), "test", "shapeUid should be propagated.");
		oShape.destroy();
	});

	QUnit.test("ShapeId is propagated only if not set", function (assert) {
		var oInnerShapeWith = new BaseRectangle({
				shapeId: "inner"
			}),
			oInnerShapeWithout = new BaseRectangle(),
			oShape = new BaseConditionalShape({
				shapes: [oInnerShapeWith, oInnerShapeWithout]
			});
		oShape.setShapeId("test");
		assert.equal(oInnerShapeWith.getShapeId(), "inner", "Shape with defined rowId should keep the row ID.");
		assert.equal(oInnerShapeWithout.getShapeId(), "test", "Shape without defined rowId should get propagated ID.");
		oShape.destroy();
	});
});
