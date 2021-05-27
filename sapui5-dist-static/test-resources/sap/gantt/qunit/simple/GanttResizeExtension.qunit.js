/*global QUnit sinon*/
sap.ui.define([
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/Device",
	"sap/gantt/simple/BaseConditionalShape"
], function (KeyCodes, qutils, BaseRectangle, GanttRowSettings, utils, Device, BaseConditionalShape) {
	"use strict";

	QUnit.module("Interaction - Shape selection and resizing", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		getSecondShape: function () {
			return this.oGantt.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
		},
		getThirdShape: function () {
			return this.oGantt.getTable().getRows()[2].getAggregation("_settings").getShapes1()[0];
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		},
		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		}
	});

	QUnit.test("Interaction - Resizable outline rendering", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			this.oGantt.setShapeSelectionSettings({
				color: "red",
				strokeWidth: 4,
				shapeColor: "green",
				fillOpacity: 0.5,
				strokeDasharray: "1,0"
			});
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			if (Device.browser.msie) {
				assert.strictEqual(document.getElementById(oRect.sId).style.fill, "#008fd3", "Shape Color before setting");
			} else {
				assert.strictEqual(document.getElementById(oRect.sId).style.fill, "rgb(0, 143, 211)", "Shape Color before setting");
			}
			assert.strictEqual(document.getElementById(oRect.sId).style.fillOpacity, "1", "Fill Opacity before setting");
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $BorderTop = $ShapeSelectionRoot.find(".border.topLine");
			var $BorderRight = $ShapeSelectionRoot.find(".border.rightLine");
			var $BorderBottom = $ShapeSelectionRoot.find(".border.bottomLine");
			var $BorderLeft = $ShapeSelectionRoot.find(".border.leftLine");
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var $RectTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
			var $RectTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
			var $ResizeCover = $ShapeSelectionRoot.find(".resizeCover");
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 1, "Shape selection root node is rendered");
			assert.strictEqual($BorderTop.length, 1, "Top outline is rendered");
			assert.strictEqual($BorderRight.length, 1, "Right outline is rendered");
			assert.strictEqual($BorderBottom.length, 1, "Bottom outline is rendered");
			assert.strictEqual($BorderLeft.length, 1, "Left outline is rendered");
			assert.strictEqual($LineTriggerLeft.length, 1, "Left line trigger is rendered");
			assert.strictEqual($LineTriggerRight.length, 1, "Right line trigger is rendered");
			assert.strictEqual($RectTriggerLeft.length, 0, "Left Rect trigger is rendered");
			assert.strictEqual($RectTriggerRight.length, 0, "Right Rect trigger is rendered");
			assert.strictEqual($ResizeCover.length, 1, "Resize cover is rendered");
			assert.strictEqual(oResizeOutline.getSelectionSettings().shapeColor, "green", "Shape Color after setting");
			assert.strictEqual(oResizeOutline.getSelectionSettings().fillOpacity, 0.5, "Fill Opacity after setting");
		}.bind(this));
	});

	QUnit.test("Interaction - Trigger cursor style", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			qutils.triggerEvent("mouseover", $LineTriggerLeft);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
			//Act
			qutils.triggerEvent("mouseover", $LineTriggerRight);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
		}.bind(this));
	});

	QUnit.test("Interaction - Resize shape", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				//Arrange
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
				var oRectSecondShape = this.getSecondShape();
				var sRectSecondShapeElementId = oRectSecondShape.getShapeUid();
				var oRectThirdShape = this.getThirdShape();
				var sRectThirdShapeElementId = oRectThirdShape.getShapeUid();
				var oEndResizingSpy = sinon.spy(oResizeOutline, "_fireShapeResizeEvent");
				var $Svg = jQuery(document.getElementById(this.oGantt.getId() + "-svg"));

				this.oGantt.attachEvent("shapeResize", function (oEvent) {
					var aOldTimes = oEvent.getParameter("oldTime");
					var aNewTimes = oEvent.getParameter("newTime");
					assert.ok(
						(aOldTimes[0].getTime() === aNewTimes[0].getTime()) || (aOldTimes[1].getTime() === aNewTimes[1].getTime()),
						"Time for the non-dragged side should not change in shapeResize event's parameters."
					);
					assert.ok(
						(aOldTimes[0].getTime() !== aNewTimes[0].getTime()) || (aOldTimes[1].getTime() !== aNewTimes[1].getTime()),
						"Time for the dragged side should change in shapeResize event's parameters."
					);
				});

				//Act
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Right Resizing End");

				//Act
				oRectSecondShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectSecondShape);
				oSelectionDom = document.getElementById(sRectSecondShapeElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				this.mousedown($LineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
				this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Left Resizing");

				this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Left Resizing End");

				oRectThirdShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectThirdShape);
				oSelectionDom = document.getElementById(sRectThirdShapeElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				$LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				oPositionTriggerRightX = $LineTriggerRight.position().left;
				oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

				//Assert
				assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

				//Clean-up
				this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);

				done();
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check resize Outline for xBias/yBias", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				//Arrange
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();

				//Act
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				oRectFirstShape.setYBias(-5);
				oRectFirstShape.setXBias(10);
				return utils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						var oResizeOutline = this.oGantt._getResizeExtension();
						var oRectFirstShape = this.getFirstShape();
						var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
						oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
						oResizeOutline.toggleOutline(oRectFirstShape);
						var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
						var $ShapeSelectionRoot = jQuery(oSelectionDom);
						var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
						var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
						var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

						var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
						var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
						var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

						assert.equal(oNewPositionTriggerLeftX - oPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oNewPositionTriggerLeftY - oPositionTriggerLeftY, -5, "LeftTriggers y coordinate are places correctly");

						assert.equal(oNewPositionTriggerRightX - oPositionTriggerRightX, 10, "RightTriggers x coordinate are places correctly");
						assert.equal(oNewPositionTriggerRightY - oPositionTriggerRightY, -5, "RightTriggers y coordinate are places correctly");

						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});


	QUnit.test("Interaction - Resize shape on hover", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			var oEndResizingSpy = sinon.spy(oResizeOutline, "_fireShapeResizeEvent");
			var $Svg = jQuery(document.getElementById(this.oGantt.getId() + "-svg"));

			this.oGantt.attachEventOnce("shapeResize", function (oEvent) {
				var aOldTimes = oEvent.getParameter("oldTime");
				var aNewTimes = oEvent.getParameter("newTime");
				assert.ok(
					(aOldTimes[0].getTime() === aNewTimes[0].getTime()) || (aOldTimes[1].getTime() === aNewTimes[1].getTime()),
					"Time for the non-dragged side should not change in shapeResize event's parameters."
				);
			});

			//Act
			oResizeOutline.addResizerOnMouseOver(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
			var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
			var oPositionTriggerRightX = $LineTriggerLeft.position().left;
			qutils.triggerEvent("mousedown", $LineTriggerRight);
			qutils.triggerMouseEvent($Svg, "mousemove", 0, 0, oPositionTriggerRightX, 10, 0);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Right Resizing");

			//Act
			qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 10, 0);

			//Assert
			assert.ok(oEndResizingSpy.called, "Right Resizing End");

			//Act
			oSelectionDom = document.getElementById(sRectElementId + "-selected");
			$ShapeSelectionRoot = jQuery(oSelectionDom);
			$LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
			oPositionTriggerLeftX = $LineTriggerLeft.position().left;
			qutils.triggerEvent("mousedown", $LineTriggerLeft);
			qutils.triggerMouseEvent($Svg, "mousemove", 0, 0, oPositionTriggerLeftX, 10, 0);

			//Assert
			assert.ok(oResizeOutline.isResizing(), "Left Resizing");

			//Act
			qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

			//Assert
			assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

			//Clean-up
			qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerLeftX - 2, 0, 0);
		}.bind(this));
	});

	QUnit.test("Interaction - Deselect shape", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oResizeOutline = this.oGantt._getResizeExtension();
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var $ShapeSelectionRoot = jQuery(oSelectionDom);
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 1, "Shape selection outline is rendered");
			oRect.setSelected(false, true/**suppressInvalidate*/);
			oResizeOutline.toggleOutline(oRect);
			oSelectionDom = document.getElementById(sRectElementId + "-selected");
			$ShapeSelectionRoot = jQuery(oSelectionDom);
			//Assert
			assert.strictEqual($ShapeSelectionRoot.length, 0, "Shape selection outline is removed");

			//Act
			oRect.setResizable(false, true/**suppressInvalidate*/);
			oRect.setSelected(true, true/**suppressInvalidate*/);

			return utils.waitForGanttRendered(this.oGantt).then(function () {

				oResizeOutline.toggleOutline(oRect);
				oSelectionDom = document.getElementById(sRectElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				//Assert
				assert.strictEqual($ShapeSelectionRoot.length, 1, "Default non-resizable outline is rendered");
				oRect.setSelected(false, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRect);
				oSelectionDom = document.getElementById(sRectElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				//Assert
				assert.strictEqual($ShapeSelectionRoot.length, 0, "Default non-resizable outline is removed");
			});
		}.bind(this));
	});

	QUnit.module("Interaction - Delta line selection and resizing", {
		beforeEach: function () {

			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					})
				]
			});
			utils.createGanttWithLines(
				this.oShape,
				"20180101000000",
				"20180105000000"
			);

			window.oGanttChart.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
		},
		afterEach: function () {
			this.oGanttChart.destroy(true/**bSuppressInvalidate*/);
			this.oGanttChart = null;
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		},
		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		getDeltaLine: function () {
			return this.oGanttChart.getDeltaLines()[0];
		},
		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		}
	});

	QUnit.test("Interaction - Trigger cursor style Deltaline", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			//Arrange
			var oResizeOutline = this.oGanttChart._getResizeExtension();
			var oDeltaLine = this.getDeltaLine();
			oDeltaLine.setResizable(true);
			oDeltaLine._setIsSelected(true);
			var deltaMarker = oDeltaLine._getHeaderDeltaArea();
			oResizeOutline.addDeltaLineResizer(deltaMarker);
			var oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
			var $DeltaSelectionRoot = jQuery(oSelectionDom);
			var $LineTriggerLeft = $DeltaSelectionRoot.find(".lineTrigger.leftTrigger");
			var $LineTriggerRight = $DeltaSelectionRoot.find(".lineTrigger.rightTrigger");
			qutils.triggerEvent("mouseover", $LineTriggerLeft);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
			//Act
			qutils.triggerEvent("mouseover", $LineTriggerRight);
			//Assert
			assert.strictEqual($LineTriggerRight.css("cursor"), "ew-resize", "Mouse cursor style of left resize trigger");
		}.bind(this));
	});

	QUnit.test("Interaction - Resize DeltaLine", function (assert) {
		// var done = assert.async();
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
				//Arrange
				var oResizeOutline = this.oGanttChart._getResizeExtension();
				var oEndResizingSpy = sinon.spy(oResizeOutline, "onDeltaResize");
				var oDeltaLine = this.getDeltaLine();
				oDeltaLine.setResizable(true);
				oDeltaLine._setIsSelected(true);
				var deltaMarker = oDeltaLine._getHeaderDeltaArea();
				var $Svg = jQuery(document.getElementById(this.oGanttChart.getId() + "-svg"));

				this.oGanttChart.attachEvent("deltalineResize", function (oEvent) {
					var newTimeStamp = oEvent.getParameter("newTimeStamp");
					var newEndTimeStamp = oEvent.getParameter("newEndTimeStamp");
					var oldTimeStamp = oEvent.getParameter("oldTimeStamp");
					var oldEndTimeStamp = oEvent.getParameter("oldEndTimeStamp");
					assert.ok(
						(newTimeStamp === oldTimeStamp) || (newEndTimeStamp === oldEndTimeStamp),
						"Time for the non-dragged side should not change in deltalineResize event's parameters."
					);
					assert.ok(
						(oldTimeStamp !== newTimeStamp) || (oldEndTimeStamp !== newEndTimeStamp),
						"Time for the dragged side should change in deltalineResize event's parameters."
					);
				});

				//Act
				oResizeOutline.addDeltaLineResizer(deltaMarker);
				var oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Right Resizing End");

				//Act
				oResizeOutline.addDeltaLineResizer(deltaMarker);
				oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				this.mousedown($LineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
				this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Left Resizing");

				this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);

				//Assert
				assert.ok(oEndResizingSpy.called, "Left Resizing End");


				oResizeOutline.addDeltaLineResizer(deltaMarker);
				oSelectionDom = document.getElementById(deltaMarker.getId() + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				$LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				oPositionTriggerRightX = $LineTriggerRight.position().left;
				oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

				//Assert
				assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

				//Clean-up
				this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);


			}.bind(this));
	});

	QUnit.module("Theme Adaptation", {
		before: function () {
			this.oTheme = sap.ui.getCore().getConfiguration().getTheme();
		},
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		after: function () {
			sap.ui.getCore().applyTheme(this.oTheme);
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("adaptToHcbTheme", function (assert) {
		sap.ui.getCore().applyTheme("sap_hcb");
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			//Assert
			assert.ok(borderTop.getAttribute("stroke").includes("#fff"), "Top outline stroke color is correct");
			assert.ok(borderRight.getAttribute("stroke").includes("#fff"), "Right outline stroke color is correct");
			assert.ok(borderBottom.getAttribute("stroke").includes("#fff"), "Bottom outline stroke color is correct");
			assert.ok(borderLeft.getAttribute("stroke").includes("#fff"), "Left outline stroke color is correct");
		}.bind(this));
	});

	QUnit.test("adaptToHcwTheme", function (assert) {
		sap.ui.getCore().applyTheme("sap_fiori_3_hcw");
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			//Assert
			assert.ok(borderTop.getAttribute("stroke").includes("#000"), "Top outline stroke color is correct");
			assert.ok(borderRight.getAttribute("stroke").includes("#000"), "Right outline stroke color is correct");
			assert.ok(borderBottom.getAttribute("stroke").includes("#000"), "Bottom outline stroke color is correct");
			assert.ok(borderLeft.getAttribute("stroke").includes("#000"), "Left outline stroke color is correct");
		}.bind(this));
	});

	QUnit.test("adaptToDarkTheme", function (assert) {
		sap.ui.getCore().applyTheme("sap_fiori_3_dark");
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			//Arrange
			var oRect = this.getFirstShape();
			var sRectElementId = oRect.getShapeUid();
			//Act
			oRect.setSelected(true, true/**suppressInvalidate*/);
			var oSelectionDom = document.getElementById(sRectElementId + "-selected");
			var borderTop = oSelectionDom.querySelector(".border.topLine");
			var borderRight = oSelectionDom.querySelector(".border.rightLine");
			var borderBottom = oSelectionDom.querySelector(".border.bottomLine");
			var borderLeft = oSelectionDom.querySelector(".border.leftLine");
			//Assert
			assert.strictEqual(borderTop.getAttribute("stroke"), "#fafafa", "Top outline stroke color is correct");
			assert.strictEqual(borderRight.getAttribute("stroke"), "#fafafa", "Right outline stroke color is correct");
			assert.strictEqual(borderBottom.getAttribute("stroke"), "#fafafa", "Bottom outline stroke color is correct");
			assert.strictEqual(borderLeft.getAttribute("stroke"), "#fafafa", "Left outline stroke color is correct");
		}.bind(this));
	});

	QUnit.module("Interaction - Shape selection and resizing in RTL", {
		beforeEach: function () {
			sap.ui.getCore().getConfiguration().setRTL(true);
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
			sap.ui.getCore().getConfiguration().setRTL(false);
		},
		getFirstShape: function () {
			return this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
		},
		getSecondShape: function () {
			return this.oGantt.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
		},
		getThirdShape: function () {
			return this.oGantt.getTable().getRows()[2].getAggregation("_settings").getShapes1()[0];
		},
		createEventParam: function(x, y) {
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.pageX = x;
			oEventParams.clientX = x;
			oEventParams.pageY = y;
			oEventParams.clientY = y;
			return oEventParams;
		},
		mousedown: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qutils.triggerEvent("mouseup", oShape, oEventParams);
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		}
	});
	QUnit.test("Interaction - Resize shape in RTL mode", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				//Arrange
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
				var oRectSecondShape = this.getSecondShape();
				var sRectSecondShapeElementId = oRectSecondShape.getShapeUid();
				var oRectThirdShape = this.getThirdShape();
				var sRectThirdShapeElementId = oRectThirdShape.getShapeUid();
				var oEndResizingSpy = sinon.spy(oResizeOutline, "_fireShapeResizeEvent");
				var $Svg = jQuery(document.getElementById(this.oGantt.getId() + "-svg"));

				this.oGantt.attachEvent("shapeResize", function (oEvent) {
					var aOldTimes = oEvent.getParameter("oldTime");
					var aNewTimes = oEvent.getParameter("newTime");
					assert.ok(
						(aOldTimes[0].getTime() === aNewTimes[0].getTime()) || (aOldTimes[1].getTime() === aNewTimes[1].getTime()),
						"Time for the non-dragged side should not change in shapeResize event's parameters."
					);
					assert.ok(
						(aOldTimes[0].getTime() !== aNewTimes[0].getTime()) || (aOldTimes[1].getTime() !== aNewTimes[1].getTime()),
						"Time for the dragged side should change in shapeResize event's parameters."
					);
				});

				//Act
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				//qutils.triggerEvent("mousedown", $LineTriggerRight);

				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);
				//qutils.triggerMouseEvent($Svg, "mousemove", 0, 0, oPositionTriggerRightX, 10, 0);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				this.mouseup($LineTriggerRight, oPositionTriggerRightX + 16, oPositionTriggerRightY);
				//qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 10, 0);

				//Assert
				assert.ok(oEndResizingSpy.called, "Right Resizing End");

				//Act
				oRectSecondShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectSecondShape);
				oSelectionDom = document.getElementById(sRectSecondShapeElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				this.mousedown($LineTriggerLeft, oPositionTriggerLeftX, oPositionTriggerLeftY);
				//qutils.triggerEvent("mousedown", $LineTriggerLeft);

				this.mousemove($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);
				//qutils.triggerMouseEvent($Svg, "mousemove", oPositionTriggerLeftX - 2, 10, 0, 0, 0);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Left Resizing");

				this.mouseup($LineTriggerLeft, oPositionTriggerLeftX + 10, oPositionTriggerLeftY);
				//qutils.triggerMouseEvent($Svg, "mouseup", oPositionTriggerLeftX - 2, 10, 0, 0, 0);

				//Assert
				assert.ok(oEndResizingSpy.called, "Left Resizing End");

				oRectThirdShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectThirdShape);
				oSelectionDom = document.getElementById(sRectThirdShapeElementId + "-selected");
				$ShapeSelectionRoot = jQuery(oSelectionDom);
				$LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				oPositionTriggerRightX = $LineTriggerRight.position().left;
				oPositionTriggerRightY = $LineTriggerRight.position().top;

				this.mousedown($LineTriggerRight, oPositionTriggerRightX, oPositionTriggerRightY);
				// /qutils.triggerEvent("mousedown", $LineTriggerRight);
				this.mousemove($LineTriggerRight, oPositionTriggerRightX + 10, oPositionTriggerRightY);
				//qutils.triggerMouseEvent($Svg, "mousemove", oPositionTriggerRightX - 2, 10, 0, 0, 0);

				//Assert
				assert.ok(oResizeOutline.isResizing(), "Right Resizing");

				//Act
				qutils.triggerKeydown($Svg, KeyCodes.ESCAPE);

				//Assert
				assert.strictEqual(oResizeOutline.isResizing(), false, "Resizing cancelled");

				//Clean-up
				this.mouseup($LineTriggerRight, oPositionTriggerLeftX + 10, oPositionTriggerRightY);
				//qutils.triggerMouseEvent($Svg, "mouseup", 0, 0, oPositionTriggerRightX - 2, 0, 0);

				done();
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check resize Outline for xBias/yBias - RTL Mode", function (assert) {
		var done = assert.async();
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				//Arrange
				var oResizeOutline = this.oGantt._getResizeExtension();
				var oRectFirstShape = this.getFirstShape();
				var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();

				//Act
				oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
				oResizeOutline.toggleOutline(oRectFirstShape);
				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);
				var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				oRectFirstShape.setYBias(-5);
				oRectFirstShape.setXBias(10);
				return utils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						var oResizeOutline = this.oGantt._getResizeExtension();
						var oRectFirstShape = this.getFirstShape();
						var sRectFirstShapeElementId = oRectFirstShape.getShapeUid();
						oRectFirstShape.setSelected(true, true/**suppressInvalidate*/);
						oResizeOutline.toggleOutline(oRectFirstShape);
						var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
						var $ShapeSelectionRoot = jQuery(oSelectionDom);
						var $LineTriggerLeft = $ShapeSelectionRoot.find(".lineTrigger.leftTrigger");
						var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
						var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

						var $LineTriggerRight = $ShapeSelectionRoot.find(".lineTrigger.rightTrigger");
						var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
						var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

						assert.equal(oPositionTriggerLeftX - oNewPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerLeftY - oNewPositionTriggerLeftY, 5, "LeftTriggers y coordinate are places correctly");

						assert.equal(oPositionTriggerRightX - oNewPositionTriggerRightX, 10, "RightTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerRightY - oNewPositionTriggerRightY, 5, "RightTriggers y coordinate are places correctly");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});
});
