/*global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/Relationship"
], function (
	Core,
	GanttUtils,
	GanttQUnitUtils,
	Relationship
) {
	"use strict";

	QUnit.module("BaseShape - Chain Selection", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		getFirstShape: function () {
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			oFirstShape.setEnableChainSelection(true);
			return oFirstShape;
		},
		getSecondShape: function () {
			var oSecondShape = this.sut.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			oSecondShape.setEnableChainSelection(true);
			return oSecondShape;
		},
		createRelationship: function () {
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			var oSecondShape = this.sut.getTable().getRows()[1].getAggregation("_settings").getShapes1()[0];
			var oRls = new Relationship({
				type: "FinishToStart",
				shapeId: "rls-1",
				selectable: true,
				predecessor: oFirstShape.getShapeId(),
				successor: oSecondShape.getShapeId()
			});
			this.sut.getTable().getRows()[0].getAggregation("_settings").addRelationship(oRls);
			this.sut.getTable().getRows()[1].getAggregation("_settings").addRelationship(oRls);

			var oChart = this.sut;
			var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
			var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
			var oRm = Core.createRenderManager();
			oRls.renderElement(oRm, oRls, oChart.getId());
			oRm.flush(oRlsCnt);
		},

		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("Chain selection", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			var oRect = this.getFirstShape();
			this.createRelationship();
			var aShapes = GanttUtils.selectAssociatedShapes({
				shape: oRect,
				ctrlOrMeta: true
			}, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Associated shapes have been selected");
		}.bind(this));
	});

	QUnit.test("Get Predecessors", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			this.createRelationship();
			var oRect = this.getSecondShape();
			var aShapes = GanttUtils.getShapePredeccessors(oRect, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Predecessors are fetched");
		}.bind(this));
	});

	QUnit.test("Get Successors", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(1);
			this.createRelationship();
			var oRect = this.getFirstShape();
			var aShapes = GanttUtils.getShapeSuccessors(oRect, this.sut);
			assert.strictEqual(aShapes.length > 0, true, "Successors are fetched");
		}.bind(this));
	});
});
