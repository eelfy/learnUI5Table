/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/GanttHeader",
	"sap/gantt/simple/RenderUtils",
	"./GanttQUnitUtils",
	"sap/gantt/misc/Format"
], function (GanttHeader, RenderUtils, GanttQUnitUtils, Format) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.ganttHeader = new GanttHeader();
		},
		afterEach: function () {
			this.ganttHeader.destroy();
			this.ganttHeader = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.ganttHeader.iHeaderMinheight, undefined);
        assert.strictEqual(this.ganttHeader._getIHeaderHeight(), 0, "default height");
	});

	QUnit.test("Test chart width and header width", function(assert) {
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var domRef = this.gantt.getDomRef();
			var ganttHeaderSvgWidth = Math.round(domRef.querySelector('.sapGanttChartHeaderSvg').getBoundingClientRect().width);
			var ganttChartSvgWidth = Math.round(domRef.querySelector('.sapGanttChartSvg').getBoundingClientRect().width);
			assert.equal(ganttChartSvgWidth, ganttHeaderSvgWidth, "Chart width and header width should be same");
			this.gantt.destroy();
		}.bind(this));
	}.bind(this));

	QUnit.test("Test gantt header large interval labels", function(assert) {
		this.gantt = GanttQUnitUtils.createGantt();
		this.gantt.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var oGantt = this.gantt;
			var oAxisTime = oGantt.getAxisTime();
			var oAxisTimeStrategy = oGantt.getAxisTimeStrategy();
			assert.equal(oAxisTime.largeIntervalLabel, true, "Large interval label present on top of first visible small interval tick");
			var iHeaderWidth = RenderUtils.getGanttRenderWidth(oGantt);
			var oTimelineOption   = oAxisTimeStrategy.getTimeLineOption();

			var aTicks = oAxisTime.getTickTimeIntervalLabel(oTimelineOption, null, [0, iHeaderWidth]);
			var aSmallIntervalTicks = aTicks[1];
			var aLargeIntervalTicks = aTicks[0];
			var startTime = oGantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime();
			var iFirstIndex = oAxisTime.getFirstSmallIntervalIndex(aSmallIntervalTicks, startTime);
			var sFirstIntervalLabel = aSmallIntervalTicks[iFirstIndex].largeLabel;
			var iFirstTickPosition = aSmallIntervalTicks[iFirstIndex].value;

			for (var i = 0; i < aLargeIntervalTicks.length; i++) {
				if (aLargeIntervalTicks[i].label === sFirstIntervalLabel) {
					assert.equal(aLargeIntervalTicks[i].value, iFirstTickPosition, "Large interval label placed at correct position");
					break;
				}
			}
			oAxisTimeStrategy.getVisibleHorizon().setStartTime("20210224121318");
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				assert.equal(oAxisTime.largeIntervalLabel, false, "No large interval label on first visible small interval tick due to overlap");
				this.gantt.destroy();
			}.bind(this));
		}.bind(this));
	}.bind(this));

});
