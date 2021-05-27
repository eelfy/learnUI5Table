/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/GanttZoomExtension",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/GanttRowSettings",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function (GanttZoomExtension, BaseRectangle, GanttRowSettings, qutils, utils) {
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

	QUnit.module("Functions - GanttDragDropExtension", {
		beforeEach: function(assert){
			this.oGanttChart = utils.createGantt(true, fnCreateShapeBindingSettings());
			window.oGanttChart.placeAt("qunit-fixture");
		},
		afterEach: function(assert) {
			utils.destroyGantt();
		},
		fnGetFakedEvent : function () {
			return {
				originalEvent: {
					shiftKey: false,
					ctrlKey: false,
					detail: 100,
					deltaX: 200,
					deltaY: 300,
					pageX: 450
				},
				preventDefault: function () { },
				stopPropagation: function () { }
			};
		}
	});


	QUnit.test("Test GanttZoomExtension --  decideMouseWheelZoom", function (assert) {
		return utils.waitForGanttRendered(window.oGanttChart).then(function () {
			var oZoomExtension = this.oGanttChart._getZoomExtension();
			var onMouseWheelZoomingStub =  sinon.stub(oZoomExtension, "onMouseWheelZooming");

			var oEvent = this.fnGetFakedEvent();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.equal(onMouseWheelZoomingStub.called, true, "Decide MouseWheelZoom is triggered.");
			assert.equal(oZoomExtension.iMouseWheelZoomDelayedCallId, undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted without time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");

			oZoomExtension.iLastMouseWheelZoomTimeInMs = Date.now();
			oZoomExtension.decideMouseWheelZoom(oEvent, -100);
			assert.ok(oZoomExtension.iMouseWheelZoomDelayedCallId !== undefined, "GanttZoomExtension.decideMouseWheelZoom successfully excuted in a time out.");
		}.bind(this));
	});
});
