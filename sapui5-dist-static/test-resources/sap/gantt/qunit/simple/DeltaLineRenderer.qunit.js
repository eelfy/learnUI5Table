/*global QUnit */
sap.ui.define(
	[
		"sap/gantt/simple/DeltaLine",
		"sap/gantt/simple/DeltaLineRenderer",
		"sap/ui/core/Core",
		"sap/gantt/simple/BaseConditionalShape",
		"./GanttQUnitUtils",
		"sap/gantt/simple/BaseRectangle",
		"sap/gantt/simple/BaseDeltaRectangle",
		"sap/gantt/simple/BaseTriangle",
		"sap/gantt/simple/BaseLine"
	],
	function (
		DeltaLine,
		DeltaLineRenderer,
		Core,
		BaseConditionalShape,
		GanttUtils,
		BaseRectangle,
		BaseDeltaRectangle,
		BaseTriangle,
		BaseLine
	) {
		"use strict";

		QUnit.module("Rendering.", {
			beforeEach: function () {
				this.oDeltaLine = new DeltaLine({
					stroke: "#DC143C",
					strokeDasharray: "5,5",
					strokeOpacity: 0.5,
					timeStamp: "20170315000000",
					endTimeStamp: "20170315000000",
					description: "Delta Line Demo"
				});

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
				this.oGantt = GanttUtils.createSimpleGantt(
					this.oShape,
					"20180101000000",
					"20180102000000"
				);
				this.oGantt.placeAt("content");
			},
			afterEach: function () {
				this.oDeltaLine.destroy();
				this.oDeltaLine = undefined;
				this.oGantt.destroy();
				this.oGantt = undefined;
			}
		});
		QUnit.test("Render Header", function (assert) {
			var oRm = Core.createRenderManager();
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				70,
				20
			);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("path").length === 2,
				"Rendering Header is OK"
			);
			assert.ok(
				jQuery("#content").find("rect").length === 1,
				"Rendering Header is OK"
			);
		});

		QUnit.test("Render Header by disabling enableDeltaLine property", function (
			assert
		) {
			var oRm = Core.createRenderManager();
			this.oGantt.setEnableDeltaLine(false);
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				70,
				20
			);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("path").length === 0,
				"Rendering Header is OK"
			);
			assert.ok(
				jQuery("#content").find("rect").length === 0,
				"Rendering Header is OK"
			);
		});
		QUnit.test("Render Header by providing the Delta Markers", function (
			assert
		) {
			var oRm = Core.createRenderManager();
			var oHeaderDeltaArea = new BaseDeltaRectangle({
				x: 412.258,
				y: 61.5,
				height: 20,
				width: 513.87 - 412.258,
				opacity: 0.4
			});
			var oForwardMarker = new BaseTriangle({
				x: 412.258,
				y: 0,
				height: 20,
				width: 12,
				rowYCenter: 70,
				orientation: "right"
			});
			var oBackwardMarker = new BaseTriangle({
				x: 513.87,
				y: 0,
				height: 20,
				width: 12,
				rowYCenter: 70,
				orientation: "left"
			});
			var oHeaderStartLine = new BaseLine({
				x1: 413.87,
				y1: 30,
				x2: 413.87,
				y2: 40
			});
			var oHeaderEndLine = new BaseLine({
				x1: 513.87,
				y1: 30,
				x2: 513.87,
				y2: 40
			});
			this.oDeltaLine._setHeaderDeltaArea(oHeaderDeltaArea);
			this.oDeltaLine._setForwardMarker(oForwardMarker);
			this.oDeltaLine._setBackwardMarker(oBackwardMarker);
			this.oDeltaLine._setHeaderStartLine(oHeaderStartLine);
			this.oDeltaLine._setHeaderEndLine(oHeaderEndLine);
			DeltaLineRenderer.renderDeltaLineHeader(
				oRm,
				this.oDeltaLine,
				this.oGantt,
				70,
				20
			);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("path").length === 2,
				"Rendering Header is OK"
			);
			assert.ok(
				jQuery("#content").find("rect").length === 1,
				"Rendering Header is OK"
			);
		});

		QUnit.test("Render Line", function (assert) {
			var oRm = Core.createRenderManager();
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("line").length === 2,
				"Rendering line is OK"
			);
		});
		QUnit.test("Render Line by setting line objects", function (assert) {
			var oRm = Core.createRenderManager();
			var oStartLine = new BaseLine({
				x1: 412.258,
				y1: 0,
				x2: 412.258,
				y2: "100%"
			});
			var oEndLine = new BaseLine({
				x1: 513.87,
				y1: 0,
				x2: 513.87,
				y2: "100%"
			});
			var oChartDeltaArea = new BaseDeltaRectangle({
				x: 412.258,
				y: 0,
				height: "100%",
				width: 513.87 - 412.258,
				opacity: 0.0
			});
			this.oDeltaLine._setChartDeltaArea(oChartDeltaArea);
			this.oDeltaLine._setStartLine(oStartLine);
			this.oDeltaLine._setEndLine(oEndLine);
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("line").length === 2,
				"Rendering line is OK"
			);
		});
		QUnit.test("Render Line by setting isSelected property value as true", function (assert) {
			var oRm = Core.createRenderManager();
			var oStartLine = new BaseLine({
				x1: 412.258,
				y1: 0,
				x2: 412.258,
				y2: "100%",
				opacity: 0.0
			});
			var oEndLine = new BaseLine({
				x1: 513.87,
				y1: 0,
				x2: 513.87,
				y2: "100%",
				opacity: 0.0
			});
			var oChartDeltaArea = new BaseDeltaRectangle({
				x: 412.258,
				y: 0,
				height: "100%",
				width: 513.87 - 412.258,
				opacity: 0.0
			});
			this.oDeltaLine._setChartDeltaArea(oChartDeltaArea);
			this.oDeltaLine._setStartLine(oStartLine);
			this.oDeltaLine._setEndLine(oEndLine);
			this.oDeltaLine._setIsSelected(true);
			DeltaLineRenderer.renderDeltaLines(oRm, this.oDeltaLine, this.oGantt);
			oRm.flush(window.document.getElementById("content"));
			oRm.destroy();
			assert.ok(
				jQuery("#content").find("line").length === 2,
				"Rendering line is OK"
			);
			assert.strictEqual(oStartLine.getProperty("strokeDasharray"), "solid");
			assert.strictEqual(oEndLine.getProperty("strokeDasharray"), "solid");
			assert.strictEqual(oEndLine.getProperty("strokeWidth"), 2);
		});
	}
);
