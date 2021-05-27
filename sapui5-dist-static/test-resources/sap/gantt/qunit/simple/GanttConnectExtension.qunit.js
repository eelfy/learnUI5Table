/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttConnectExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function (GanttConnectExtension, BaseRectangle, GanttRowSettings, qunits, utils) {
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

	QUnit.module("Basic - GanttConnectExtension");

	QUnit.test("default values", function (assert) {
		var oConnectExt = new GanttConnectExtension({});
		assert.strictEqual(oConnectExt.mDom.connectLine, undefined, "Default mDom.connectLine is undefined");
		assert.strictEqual(oConnectExt.isShapeConnecting(), false, "Default _bShapeConnecting is false");
		assert.strictEqual(oConnectExt._oScrollDistance.x, 0, "Default _oScrollDistance.x == 0");
		assert.strictEqual(oConnectExt._oScrollDistance.y, 0, "Default _oScrollDistance.y == 0");
	});

	QUnit.module("Interaction - GanttConnectExtension", {
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
			var oDragShapeDom = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape = jQuery(oDragShapeDom).control(0, true);
			var sRightTriggerSelector = ".sapGanttChartSelection g[sap-gantt-select-for='" + oShape.getShapeUid() + "'].resizeContainer .shapeConnectTrigger.rightTrigger";
			var oDestShape = jQuery("rect[data-sap-gantt-shape-id=1]").control(0);
			var sDestIndicatorSelector = ".sapGanttChartShapeConnect g[sap-gantt-shape-connect-for='" + oDestShape.getId() + "'].shapeConnectContainer .rightIndicator";

			return {
				svg: this.oGanttChart._getConnectExtension().getDomRefs().ganttSvg,
				sourceShape: oDragShapeDom,
				rightTrigger: jQuery(sRightTriggerSelector).get(0),
				rightIndicator: jQuery(sDestIndicatorSelector).get(0)
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

	QUnit.test("Connect", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.oGanttChart).then(function () {
			var oSvgOffset = this.getSvgOffset();
			var iSvgLeft = oSvgOffset.left;
			var iSvgTop = oSvgOffset.top;
			var iPageY = iSvgTop + 30;

			this.mousemove(document, iSvgLeft + 216, iPageY);

			var connectExt = this.oGanttChart._getConnectExtension();
			var fnFireShapeConnect = sinon.spy(this.oGanttChart, "fireShapeConnect");

			assert.strictEqual(connectExt.isShapeConnecting(), false, "Before mousedown: oLastDraggedShapeData is false");
			assert.strictEqual(connectExt.mDom.connectLine, undefined, "Before mousedown: mDom.connectLine is undefined");

			//select shape
			var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
			oShape.setSelected(true);

			this.mousedown(this.getDoms().rightTrigger, iSvgLeft + 115, iPageY);

			assert.strictEqual(connectExt.isShapeConnecting(), false, "After mousedown: oLastDraggedShapeData is false");
			assert.strictEqual(connectExt.mDom.connectLine, undefined, "After mousedown: mDom is undefined");

			this.mousemove(this.getDoms().svg, iSvgLeft + 216, iPageY);

			assert.strictEqual(connectExt.isShapeConnecting(), true, "After mousemove: oLastDraggedShapeData is false");
			assert.strictEqual(connectExt.mDom.connectLine.length, 1, "After mousemove: mDom is not empty");

			// mouse up on svg, not on indicator
			this.mouseup(this.getDoms().svg, iSvgLeft + 221, iSvgTop - 30);
			assert.equal(fnFireShapeConnect.callCount, 0, "Drop to invalide area, no shapeDrop event fired");

			// mouse up on indicator
			jQuery(this.getDoms().sourceShape).control(0, true).setSelected(true);

			this.mousedown(this.getDoms().rightTrigger, iSvgLeft + 115, iPageY);
			this.mousemove(this.getDoms().svg, iSvgLeft + 216, iPageY);
			this.mousemove(this.getDoms().svg, iSvgLeft + 221, iSvgTop - 30);

			var oRightIndicator = this.getDoms().rightIndicator;
			this.mouseup(oRightIndicator, iSvgLeft + 216, iPageY);
			assert.equal(fnFireShapeConnect.callCount, 1, "After mouseup on indicator, shapeConnect event fired");

			// auto scroll left
			jQuery(this.getDoms().sourceShape).control(0, true).setSelected(true);

			this.mousedown(this.getDoms().rightTrigger, iSvgLeft + 115, iPageY);
			this.mousemove(this.getDoms().svg, iSvgLeft + 3, iPageY);

			setTimeout(function () {
				var oRightIndicator = this.getDoms().rightIndicator;
				this.mouseup(oRightIndicator, iSvgLeft + 216, iPageY);
				assert.equal(fnFireShapeConnect.callCount, 2, "After autoscroll and mouseup on indicator, shapeConnect event fired");
				done();
			}.bind(this), 1500);
		}.bind(this));
	});

	QUnit.test("Connect - xBias/yBias", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.oGanttChart).then(function () {
			setTimeout(function(){
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 30;

				this.mousemove(document, iSvgLeft + 216, iPageY);

				//select shape
				var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
				var sRectFirstShapeElementId = oShape.getShapeUid();
				oShape.setSelected(true);

				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);

				var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				oShape.setYBias(-5);
				oShape.setXBias(10);
				return utils.waitForGanttRendered(this.oGanttChart).then(function () {
					setTimeout(function(){
						var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
						var sRectFirstShapeElementId = oShape.getShapeUid();
						oShape.setSelected(true);
						var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
						var $ShapeSelectionRoot = jQuery(oSelectionDom);

						var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
						var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
						var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

						var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
						var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
						var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

						assert.equal(oNewPositionTriggerLeftX - oPositionTriggerLeftX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oNewPositionTriggerLeftY - oPositionTriggerLeftY, -5, "LeftTriggers y coordinate are places correctly");

						assert.equal(oNewPositionTriggerRightX - oPositionTriggerRightX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oNewPositionTriggerRightY - oPositionTriggerRightY, -5, "LeftTriggers y coordinate are places correctly");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("Interaction - GanttConnectExtension - RTL", {
		beforeEach: function() {
			sap.ui.getCore().getConfiguration().setRTL(true);
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
			var oDragShapeDom = jQuery("rect[data-sap-gantt-shape-id=0]").get(0);
			var oShape = jQuery(oDragShapeDom).control(0, true);
			var sRightTriggerSelector = ".sapGanttChartSelection g[sap-gantt-select-for='" + oShape.getShapeUid() + "'].resizeContainer .shapeConnectTrigger.rightTrigger";
			var oDestShape = jQuery("rect[data-sap-gantt-shape-id=1]").control(0);
			var sDestIndicatorSelector = ".sapGanttChartShapeConnect g[sap-gantt-shape-connect-for='" + oDestShape.getId() + "'].shapeConnectContainer .rightIndicator";

			return {
				svg: this.oGanttChart._getConnectExtension().getDomRefs().ganttSvg,
				sourceShape: oDragShapeDom,
				rightTrigger: jQuery(sRightTriggerSelector).get(0),
				rightIndicator: jQuery(sDestIndicatorSelector).get(0)
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
			sap.ui.getCore().getConfiguration().setRTL(false);
		}
	});

	QUnit.test("Connect - xBias/yBias RTL", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(this.oGanttChart).then(function () {
			setTimeout(function(){
				var oSvgOffset = this.getSvgOffset();
				var iSvgLeft = oSvgOffset.left;
				var iSvgTop = oSvgOffset.top;
				var iPageY = iSvgTop + 30;

				this.mousemove(document, iSvgLeft + 216, iPageY);

				//select shape
				var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
				var sRectFirstShapeElementId = oShape.getShapeUid();
				oShape.setSelected(true);

				var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
				var $ShapeSelectionRoot = jQuery(oSelectionDom);

				var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
				var oPositionTriggerLeftX = $LineTriggerLeft.position().left;
				var oPositionTriggerLeftY = $LineTriggerLeft.position().top;

				var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
				var oPositionTriggerRightX = $LineTriggerRight.position().left;
				var oPositionTriggerRightY = $LineTriggerRight.position().top;

				oShape.setYBias(-5);
				oShape.setXBias(10);
				return utils.waitForGanttRendered(this.oGanttChart).then(function () {
					setTimeout(function(){
						var oShape = jQuery(this.getDoms().sourceShape).control(0, true);
						var sRectFirstShapeElementId = oShape.getShapeUid();
						oShape.setSelected(true);
						var oSelectionDom = document.getElementById(sRectFirstShapeElementId + "-selected");
						var $ShapeSelectionRoot = jQuery(oSelectionDom);

						var $LineTriggerLeft = $ShapeSelectionRoot.find(".rectTrigger.leftTrigger");
						var oNewPositionTriggerLeftX = $LineTriggerLeft.position().left;
						var oNewPositionTriggerLeftY = $LineTriggerLeft.position().top;

						var $LineTriggerRight = $ShapeSelectionRoot.find(".rectTrigger.rightTrigger");
						var oNewPositionTriggerRightX = $LineTriggerRight.position().left;
						var oNewPositionTriggerRightY = $LineTriggerRight.position().top;

						assert.equal(oPositionTriggerLeftX - oNewPositionTriggerLeftX , 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerLeftY - oNewPositionTriggerLeftY, 5, "LeftTriggers y coordinate are places correctly");

						assert.equal(oPositionTriggerRightX - oNewPositionTriggerRightX, 10, "LeftTriggers x coordinate are places correctly");
						assert.equal(oPositionTriggerRightY - oNewPositionTriggerRightY, 5, "LeftTriggers y coordinate are places correctly");
						done();
					}.bind(this), 500);
			}.bind(this));
			}.bind(this), 1000); // need to wait because Table updates its rows async
		}.bind(this));
	});

});
