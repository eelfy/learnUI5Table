/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttDragDropExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseConditionalShape"
], function (GanttDragDropExtension, BaseRectangle, GanttRowSettings, qutils, utils, BaseConditionalShape) {
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
					draggable: true,
					selectable: true,
					resizable: true
				})
			]
		});
	};

	QUnit.test("default values", function (assert) {
		var dragDropExt = new GanttDragDropExtension({});
		assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Default oMouseDownTarget is null");
		assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Default oLastDraggedShape is null");
		assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Default mDragPoint.shapeX is undefined");
		assert.strictEqual(dragDropExt.$ghost, null, "Default $ghost is null");
	});

	QUnit.module("Functions - GanttDragDropExtension", {
		beforeEach: function(assert){
			utils.createGantt(true, fnCreateShapeBindingSettings());
			window.oGanttChart.placeAt("qunit-fixture");
			this.oGanttChart = window.oGanttChart;
		},
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().gantt),
				$vsb = jQuery(window.oGanttChart.getTable().getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top,
				iSvgRight = iSvgLeft + $svgCtn.width() - $vsb.width();

			return {left: iSvgLeft, top: iSvgTop, right: iSvgRight};
		},
		getDoms: function() {

			return {
				sourceRow:  jQuery("rect[data-sap-ui-index=0]").get(0),
				droppedRow:  jQuery("rect[data-sap-ui-index=4]").get(0),
				draggedShape: jQuery("rect[data-sap-gantt-shape-id=0]").get(0),
				header: jQuery(".sapGanttChartHeader").get(0),
				ghost: jQuery(document.getElementById("sapGanttDragGhostWrapper"))
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
		afterEach: function(assert) {
			utils.destroyGantt();
		}
	});

	QUnit.test("Drag In Free Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oSourceRowDom = this.getDoms().sourceRow;
			var oHeader = this.getDoms().header;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");

			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "Before mousedown: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");

			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");

			var sShapUid = "PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]";
			assert.strictEqual(dragDropExt.oLastDraggedShapeData.shapeUid, sShapUid, "After mousedown: The last dragged shape uid is '" + sShapUid + "'");
			assert.strictEqual(jQuery(dragDropExt.oMouseDownTarget).data("sapGanttShapeId"), 0, "After mousedown: The loMouseDownTarget shape id is '0'");
			assert.ok(dragDropExt.mDragPoint.shapeX > 0, "After mousedown: mDragPoint.shapeX > 0");

			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mouseup(oHeader, iSvgLeft + 16, iPageY);
			assert.equal(fnGetGhostTime.callCount, 0, "Before mouseup, drag not ended, no shapeDrop event fired");

			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 16, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iSvgTop - 30);
			this.mouseup(oHeader, iSvgLeft + 20, iSvgTop - 30);
			assert.equal(fnGetGhostTime.callCount, 1, "Drop to invalide area, no shapeDrop event fired");
			oDragShapeDom = this.getDoms().draggedShape;
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY);
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY);

			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");

			var iOriginalShapeDuration = dragDropExt.oLastDraggedShapeData.endTime - dragDropExt.oLastDraggedShapeData.startTime;
			var iCurrentShapeDuration = fnGetGhostTime.returnValues[0].endTime - fnGetGhostTime.returnValues[0].time;
			assert.equal(iOriginalShapeDuration, iCurrentShapeDuration, "Shape Duration remains same on drag");

			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);

			this.mouseup(oDragShapeDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			// set shape undraggable
			var oDraggedShape = dragDropExt.getShapeElementByTarget(oDragShapeDom);
			assert.ok(oDraggedShape !== null, "Dragged shape is not null");
			oDraggedShape.setDraggable(false);
			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			return new Promise(function (fnResolve) {
				setTimeout(function(){
					assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mousedown on a undraggable shape: oMouseDownTarget is null");
					assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mousedown on a undraggable shape: oLastDraggedShapeData is null");
					assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mousedown on a undraggable shape: mDragPoint.shapeX is undefined");
					fnResolve();
				}, 1500);
			});
		}.bind(this));

	});

	QUnit.test("Drag In Horizontal Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oDropppedRowDom = this.getDoms().droppedRow;
			var oSourceRowDom = this.getDoms().sourceRow;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Horizontal);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iTop = dragDropExt.$ghost.position().top;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentTop = dragDropExt.$ghost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 400);
			iCurrentTop = dragDropExt.$ghost.position().top;
			assert.equal(iTop, iCurrentTop, "When drag in horizontal direction, axis-y will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");
			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.equal(oEvent.mParameters.targetRow.getIndex(), 0, "Target Row has data for Row of Index 0");
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);
			this.mouseup(oDropppedRowDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			assert.equal(oDragShapeDom.getAttribute("data-sap-gantt-shape-id"), 0, "Dragged Shape is from row 0.");
			assert.equal(oDropppedRowDom.getAttribute("data-sap-ui-index"), 4, "Mouse Pointer is at row 4 when shape is dropped.");
		}.bind(this));

	});

	QUnit.test("Drag In Vertical Direction", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var fnDone = assert.async();
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;

			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oDropppedRowDom = this.getDoms().droppedRow;
			var oSourceRowDom = this.getDoms().sourceRow;
			var fnGetGhostTime = sinon.spy(dragDropExt, "_getGhostTime");
			this.oGanttChart.setDragOrientation(sap.gantt.DragOrientation.Vertical);

			//select shape
			jQuery(oDragShapeDom).control(0, true).setSelected(true);

			this.mousedown(oDragShapeDom, iSvgLeft + 15, iPageY);
			assert.equal(oSourceRowDom.getAttribute("data-sap-ui-index"), 0, "Mouse Pointer is at row 0 when shape is selected.");
			this.mousemove(oDragShapeDom, iSvgLeft + 20, iPageY + 100);
			this.mousemove(oDragShapeDom, iSvgLeft + 35, iPageY + 200);
			var iLeft = dragDropExt.$ghost.position().left;
			this.mousemove(oDragShapeDom, iSvgLeft + 75, iPageY + 300);
			var iCurrentLeft = dragDropExt.$ghost.position().left;
			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");

			this.mousemove(oDragShapeDom, iSvgLeft + 175, iPageY + 300);
			iCurrentLeft = dragDropExt.$ghost.position().left;

			assert.equal(iLeft, iCurrentLeft, "When drag in vertical direction, axis-x will not change");
			assert.equal(fnGetGhostTime.callCount, 1, "Before mouseup, drag not ended, no shapeDrop event fired");
			window.oGanttChart.attachEventOnce("shapeDrop", function (oEvent) {
				assert.equal(oEvent.mParameters.targetRow.getIndex(), 4, "TargetRow has data for Row of Index 4");
				assert.strictEqual(!!oEvent.mParameters.sourceRowData, true, "After shapeDrop: Source row data is available");
				fnDone();
			}, this);
			this.mouseup(oDropppedRowDom, iSvgLeft + 75, iPageY);
			assert.equal(fnGetGhostTime.callCount, 2, "After mouseup, drag ended, fire shapeDrop event");
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "After mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.oLastDraggedShapeData, null, "After mouseup: oLastDraggedShapeData is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "After mouseup: mDragPoint.shapeX is undefined");
			assert.equal(oDragShapeDom.getAttribute("data-sap-gantt-shape-id"), 0, "Dragged Shape is from row 0.");
			assert.equal(oDropppedRowDom.getAttribute("data-sap-ui-index"), 4, "Mouse Pointer is at row 4 when shape is dropped.");
		}.bind(this));

	});

	QUnit.test("isEventTargetDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oDragShapeDom = this.getDoms().draggedShape;
			var oEventParams = {};
			oEventParams.button = 0;
			oEventParams.target = oDragShapeDom;
			this.oGanttChart.setEnableSelectAndDrag(true);
			oEventParams.ctrlKey = false;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable without ctrl key in MultiWithKeyboard mode");
			oEventParams.ctrlKey = true;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), false, "The unselected shape is not draggable with ctrl key in MultiWithKeyboard mode");
			this.oGanttChart.setEnableSelectAndDrag(false);
			oEventParams.ctrlKey = false;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), true, "The unselected shape can be dragged without ctrl key in MultiWithKeyboard mode if EnableSelectAndDrag set as false");
			oEventParams.ctrlKey = true;
			assert.strictEqual(dragDropExt.isEventTargetDraggable(oEventParams), true, "The unselected shape can be dragged with ctrl key in MultiWithKeyboard mode if EnableSelectAndDrag set as false");
		}.bind(this));
	});

	QUnit.test("isValidDropZone", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var oDragShapeDom = this.getDoms().draggedShape;
			var oHeader = this.getDoms().header;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = oDragShapeDom;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), true, "valid drop area");
			oEvent.target = oHeader;
			assert.strictEqual(dragDropExt.isValidDropZone(oEvent), false, "invalid drop area");
		}.bind(this));
	});

	QUnit.module("Functions - Lines - GanttDragDropExtension", {
		beforeEach: function(assert){
			//utils.createGantt(true, fnCreateShapeBindingSettings());
			this.oShape = new BaseConditionalShape({
				shapes: [
					new BaseRectangle({
						id: "r1",
						shapeId: "r1",
						x: 0,
						y: 0,
						rx: 10,
						ry: 10
					}),
					new BaseRectangle({
						id: "r2",
						shapeId: "r2",
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
		getSvgOffset: function() {
			var popoverExt = window.oGanttChart._getPopoverExtension(),
				$svgCtn = jQuery(popoverExt.getDomRefs().header),
				svgOffset = $svgCtn.offset(),
				iSvgLeft = svgOffset.left,
				iSvgTop = svgOffset.top;

			return {left: iSvgLeft, top: iSvgTop};
		},
		getDoms: function() {

			return {
				chart: jQuery(".sapGanttChartSvg").get(0),
				header: jQuery(".sapGanttChartHeaderSvg").get(0),
				table: jQuery(".sapGanttChartLayoutBG").get(0),
				adhocMarker: jQuery("path.sapGanntChartMarkerCursorPointer").get(0),
				deltaMarker: jQuery('rect.sapGanntChartMarkerCursorPointer').get(0),
				ghost: jQuery(document.getElementById("sapGanttDragGhostWrapper"))
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
		getMouseEvent: function(event, oTarget, x, y) {
			var oEvent = jQuery.Event({type : event});
			oEvent.target = oTarget;
			var oParams = this.createEventParam(x,y);
			if (oParams) {
				for (var x in oParams) {
					oEvent[x] = oParams[x];
					oEvent.originalEvent[x] = oParams[x];
				}
			}
			return oEvent;
		},
		afterEach: function(assert) {
			this.oGanttChart.destroy(true/**bSuppressInvalidate*/);
			this.oGanttChart = null;
		}
	});

	QUnit.test("isValidDropZoneForLines", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var oChart = this.getDoms().chart;
			var oHeader = this.getDoms().header;
			var oTable = this.getDoms().table;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = oChart;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), true, "Chart is valid drop area");
			oEvent.target = oHeader;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), true, "Header is valid drop area");
			oEvent.target = oTable;
			assert.strictEqual(dragDropExt.isValidDropZoneForLines(oEvent), false, "Table is an invalid drop area");
		}.bind(this));
	});

	QUnit.test("isAdhocLineDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var adhocMarkar = this.getDoms().adhocMarker;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = adhocMarkar;
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), false, "By default adhoc Line is not Draggable");
			var adhocLines = this.oGanttChart.getSimpleAdhocLines()[0];
			adhocLines.setDraggable(true);
			adhocLines._setSelected(true);
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), true, "Selected adhocLine can be dragged if draggable property is set to true");
			adhocLines._setSelected(false);
			assert.strictEqual(dragDropExt.isAdhocLineDraggable(oEvent), false, "Unselected adhocLine cannot be dragged if draggable property is set to true");
		}.bind(this));
	});

	QUnit.test("isDeltaLineDraggable", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oEvent = {};
			var deltaMarker = this.getDoms().deltaMarker;
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			oEvent.target = deltaMarker;
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), false, "By default Delta Line is not Draggable");
			var deltaLines = this.oGanttChart.getDeltaLines()[0];
			deltaLines.setDraggable(true);
			deltaLines._setIsSelected(true);
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), true, "Selected delta line can be dragged if draggable property is set to true");
			deltaLines._setIsSelected(false);
			assert.strictEqual(dragDropExt.isDeltaLineDraggable(oEvent), false, "Unselected adhocLine cannot be dragged if draggable property is set to true");
		}.bind(this));
	});

	QUnit.test("Adhoc Line Drag", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oTarget = this.getDoms().adhocMarker;
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.$ghost, null, "Before mousedown: Ghost image is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			jQuery(oTarget).control(0, true).getParent().setDraggable(true);
			jQuery(oTarget).control(0, true).getParent()._setSelected(true);
			var mouseDownEvent = this.getMouseEvent("mousedown", oTarget, iSvgLeft, iPageY);
			dragDropExt.onAdhocMarkerMouseDown(mouseDownEvent);
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			assert.ok(dragDropExt.mDragPoint.shapeX != undefined,"After mousedown: mDragPoint.shapeX is not undefined");
			assert.strictEqual(dragDropExt.adhocLineDrag, true, "AdhocLineDrag falg is set to true");

			var mouseMoveEvent = this.getMouseEvent("mousemove", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onAdhocLineMove(mouseMoveEvent);
			assert.strictEqual(dragDropExt.adhocLineDragStart, true, "adhocLineDragStart flag is set to true");
			assert.ok(dragDropExt.$ghost != null,"Ghost image is not null after drag started");
			assert.strictEqual(dragDropExt.isAdhocLineDragging(), true, "Adhocline dragging started");

			var mouseUpEvent = this.getMouseEvent("mouseup", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onAdhocLineDrop(mouseUpEvent);
			assert.strictEqual(dragDropExt.$ghost, null, "after mouseup: Ghost image is null");
			dragDropExt._initDragStates();
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "after mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "after mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));
	});

	QUnit.test("Delta Line Drag", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var dragDropExt = this.oGanttChart._getDragDropExtension();
			var oTarget = this.getDoms().deltaMarker;
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 10;
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "Before mousedown: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.$ghost, null, "Before mousedown: Ghost image is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "Before mousedown: mDragPoint.shapeX is undefined");

			jQuery(oTarget).control(0, true).getParent().setDraggable(true);
			jQuery(oTarget).control(0, true).getParent()._setIsSelected(true);
			var mouseDownEvent = this.getMouseEvent("mousedown", oTarget, iSvgLeft, iPageY);
			dragDropExt.onDeltaAreaMouseDown(mouseDownEvent);
			assert.ok(dragDropExt.oMouseDownTarget != null, "After mousedown: oMouseDownTarget is not null");
			assert.ok(dragDropExt.mDragPoint.shapeX != undefined,"After mousedown: mDragPoint.shapeX is not undefined");
			assert.strictEqual(dragDropExt.deltaLineDrag, true, "deltaLineDrag falg is set to true");

			var mouseMoveEvent = this.getMouseEvent("mousemove", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onDeltaLineMove(mouseMoveEvent);
			assert.strictEqual(dragDropExt.deltaLineDragStart, true, "deltaLineDragStart falg is set to true");
			assert.ok(dragDropExt.$ghost != null,"Ghost image is not null after drag started");
			assert.strictEqual(dragDropExt.isDeltaLineDragging(), true, "Deltaline dragging started");

			var mouseUpEvent = this.getMouseEvent("mouseup", oTarget, iSvgLeft + 10, iPageY);
			dragDropExt.onDeltaLineDrop(mouseUpEvent);
			assert.strictEqual(dragDropExt.$ghost, null, "after mouseup: Ghost image is null");
			dragDropExt._initDragStates();
			assert.strictEqual(dragDropExt.oMouseDownTarget, null, "after mouseup: oMouseDownTarget is null");
			assert.strictEqual(dragDropExt.mDragPoint.shapeX, undefined, "after mouseup: mDragPoint.shapeX is undefined");
		}.bind(this));
	});

});
