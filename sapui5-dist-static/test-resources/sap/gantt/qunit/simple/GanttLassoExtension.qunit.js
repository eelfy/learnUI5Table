/*global QUnit*/
sap.ui.define([
	"sap/gantt/simple/GanttLassoExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function (GanttLassoExtension, BaseRectangle, GanttRowSettings, qunits, utils) {
	"use strict";

	var fnCreateShapeBindingSettings = function() {
		return new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					selectable: true,
					connectable: true
				})
			]
		});
	};

	QUnit.module("Basic - GanttLassoExtension");

	QUnit.test("default values", function (assert) {
		var oLassoExt = new GanttLassoExtension({});
		assert.strictEqual(oLassoExt.mDom.lassoRect, undefined, "Default mDom.lassoRect is undefined");
		assert.strictEqual(oLassoExt.isLassoDrawing(), false, "Default _bShapeConnecting is false");
		assert.strictEqual(oLassoExt._oLassoStartPoint.x, undefined, "Default _oLassoStartPoint.x is undefined");
		assert.strictEqual(oLassoExt._oLassoStartPoint.y, undefined, "Default _oLassoStartPoint.y is undefined");
	});

	QUnit.module("Interaction - GanttLassoExtension", {
		beforeEach: function() {
			this.oGanttChart = utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oGanttChart.placeAt("qunit-fixture");
		},
		getSvgOffset: function() {
			var popoverExt = this.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().gantt),
				$vsb = jQuery(this.oGanttChart.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {
			var oShapeDom = jQuery(".baseShapeSelection").get(5);
			var oShape = jQuery(oShapeDom).control(0, true);
			var oRowArea = jQuery(".sapGanttBackgroundSVGRow").get(0);
			return {
				svg: this.oGanttChart._getLassoExtension().getDomRefs().ganttSvg,
				shapeDom: oShapeDom,
				shape: oShape,
				rowArea: oRowArea
			};
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
			qunits.triggerEvent("mousedown", oShape, oEventParams);
		},
		mousemove: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qunits.triggerEvent("mousemove", oShape, oEventParams);
		},
		mouseup: function(oShape, x, y) {
			var oEventParams = this.createEventParam(x, y);
			qunits.triggerEvent("mouseup", oShape, oEventParams);
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Lasso in different selection modes", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;
			var oSelection = this.oGanttChart.getSelection();

			this.mousemove(document, iSvgLeft + 216, iPageY);

			var lassoExt = this.oGanttChart._getLassoExtension();

			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Before mousedown: _bLassoDrawing is false");
			assert.strictEqual(lassoExt.mDom.lassoRect, undefined, "Before mousedown: mDom.lassoRect is undefined");

			var oRowArea = this.getDoms().rowArea;
			var oSvg = this.getDoms().svg;
			var oShapeDom = this.getDoms().shapeDom;

			oSelection.setSelectionMode("Single");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in Single shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("Multiple");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in Multiple shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultiWithKeyboard");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start in MultiWithKeyboard shape selecion mode");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultipleWithLasso");
			this.mousedown(oShapeDom, iSvgLeft + 115, iPageY);
			this.mousemove(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), false, "Lasso didn't start as starting point is on a shape");
			this.mouseup(this.getDoms().svg, iSvgLeft + 650, iPageY + 150);

			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started in MultipleWithLasso shape selecion mode");
			assert.strictEqual(jQuery(".lassoRect").length, 1, "Lasso DOM exists");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);

			oSelection.setSelectionMode("MultiWithKeyboardAndLasso");
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 650, iPageY + 150);
			assert.strictEqual(lassoExt.isLassoDrawing(), true, "Lasso started in MultiWithKeyboardAndLasso shape selecion mode");
			assert.strictEqual(jQuery(".lassoRect").length, 1, "Lasso DOM exists");
			this.mouseup(oSvg, iSvgLeft + 650, iPageY + 150);
		}.bind(this));
	});

	QUnit.test("Lasso shape selection", function (assert) {
		return utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;
			var oSelection = this.oGanttChart.getSelection();

			this.mousemove(document, iSvgLeft + 216, iPageY);

			var oRowArea = this.getDoms().rowArea;
			var oSvg = this.getDoms().svg;
			var oShape = this.getDoms().shape;
			var oShapeDom = this.getDoms().shapeDom;

			var oShapeUid1 = oShape.getShapeUid();
			var oShapeUid2 = jQuery(jQuery(".baseShapeSelection").get(11)).control(0, true).getShapeUid();

			oSelection.setSelectionMode("MultipleWithLasso");
			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 3, "Shapes inside lasso and already selected shapes outside lasso got selected");

			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.oGanttChart.setEnableLassoInvert(true);

			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 2, "Already selected shapes inside lasso got deselected when invert is true");

			oSelection.setSelectionMode("MultiWithKeyboardAndLasso");
			this.oGanttChart.setEnableLassoInvert(false);

			this.oGanttChart.setSelectedShapeUid([oShapeUid1, oShapeUid2]);
			this.mousedown(oRowArea, iSvgLeft + 125, iPageY - 20);
			assert.strictEqual(oSelection.allUid().length, 0, "Already selected shapes got deselected as Ctrl isn't pressed");
            this.mousemove(oSvg, iSvgLeft + 250, iPageY + 50);
            this.mousemove(oSvg, iSvgLeft + 350, iPageY + 50);
			this.mouseup(oShapeDom, iSvgLeft + 350, iPageY + 50);
			assert.strictEqual(oSelection.allUid().length, 2, "Shapes inside lasso got selected");
		}.bind(this));
	});
});