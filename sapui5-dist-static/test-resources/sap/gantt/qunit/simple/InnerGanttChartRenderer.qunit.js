/*global QUnit*/
sap.ui.define([
	"sap/gantt/simple/InnerGanttChartRenderer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/test/simple/SteppedTask",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/test/GanttQUnitUtils"
], function(InnerGanttChartRenderer, GanttRowSettings, SteppedTask, BaseRectangle, utils) {
	"use strict";

	QUnit.module("InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions");

	QUnit.test("Generated array is in format accepted by RenderUtils.createOrderedListOfRenderFunctionsFromTemplate", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return true;
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return true;
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var bContainsAtLeastOneUnshiftProperty = false,
			bAllItemsContainFnCallbackProperty = true;

		aTemplate.forEach(function(oItem) {
			if (oItem.hasOwnProperty("bUnshift")) {
				bContainsAtLeastOneUnshiftProperty = true;
			}
			if (!oItem.hasOwnProperty("fnCallback")) {
				bAllItemsContainFnCallbackProperty = false;
			}
		});

		assert.ok(bContainsAtLeastOneUnshiftProperty, "Array contains item with at least one bUnshift property");
		assert.ok(bAllItemsContainFnCallbackProperty, "Array contains item with at least one fnCallback property");
	});

	QUnit.test("Generated array contains all rendering functions when getEnableAdhocLine  and getEnableDeltaLine is true", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Top";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Top";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate1 = InnerGanttChartRenderer.createTemplateForRenderAdhocAndDeltaLines(oGantt);
		var aTemplate2 = InnerGanttChartRenderer.createTemplateForChartAreaOfDeltaLines(oGantt);
		var aExpectedTemplate1 = [
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			},
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];
		var aExpectedTemplate2 = [
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderChartAreaOfDeltaLines
			}
		];

		assert.deepEqual(aTemplate1, aExpectedTemplate1, "Rendered template contains all expected rendering functions");
		assert.deepEqual(aTemplate2, aExpectedTemplate2, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Generated array contains all rendering functions except renderAdhocLines when getEnableAdhocLine is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Top";
			},
			getEnableAdhocLine: function() {
				return false;
			},
			getDeltaLineLayer: function() {
				return "Top";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForRenderAdhocAndDeltaLines(oGantt);
		var aExpectedTemplate = [
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions except renderAdhocLines ");
	});

	QUnit.test("Generated array contains all rendering functions except renderDeltaLines when getEnableDeltaLine is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Top";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Top";
			},
			getEnableDeltaLine: function() {
				return false;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForRenderAdhocAndDeltaLines(oGantt);
		var aExpectedTemplate = [
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions except renderDeltaLines");
	});

	QUnit.test("Generated array contains all rendering functions", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Top";
			},
			getEnableAdhocLine: function() {
				return false;
			},
			getDeltaLineLayer: function() {
				return "Top";
			},
			getEnableDeltaLine: function() {
				return false;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Unshift for renderAdhocLines and renderDeltaLines callback is true when getAdhocLineLayer and getDeltaLineLayer is bottom", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return true;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForRenderAdhocAndDeltaLines(oGantt);
		var aExpectedTemplate = [
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderAdhocLines
			},
			{
				"bUnshift": true,
				"fnCallback": InnerGanttChartRenderer.renderDeltaLines
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.test("Unshift for renderRlsContainer callback is false when getShapeOverRelationship is false", function(assert) {
		var oGantt = {
			getShapeOverRelationship: function() {
				return false;
			},
			getAdhocLineLayer: function() {
				return "Bottom";
			},
			getEnableAdhocLine: function() {
				return true;
			},
			getDeltaLineLayer: function() {
				return "Bottom";
			},
			getEnableDeltaLine: function() {
				return true;
			}
		};
		var aTemplate = InnerGanttChartRenderer.createTemplateForOrderedListOfRenderFunctions(oGantt);
		var aExpectedTemplate = [
			{
				"fnCallback": InnerGanttChartRenderer.renderAllShapesInRows
			},
			{
				"bUnshift": false,
				"fnCallback": InnerGanttChartRenderer.renderRlsContainer
			},
			{
				"fnCallback": InnerGanttChartRenderer.renderAssistedContainer
			}
		];

		assert.deepEqual(aTemplate, aExpectedTemplate, "Rendered template contains all expected rendering functions");
	});

	QUnit.module("interactive expand chart", {
		beforeEach: function() {
			this.sut = utils.createGantt(true, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new SteppedTask({
						shapeId: "{Id}",
						expandable: true,
						task: new BaseRectangle({
							time: "{StartDate}",
							endTime: "{EndDate}",
							fill: "#008FD3",
							height: 20
						}),
						breaks: {
							path: "breaks",
							template: new BaseRectangle({
								scheme: "break",
								time: "{StartDate}",
								endTime: "{EndDate}",
								fill: "red",
								height: 20
							}),
							templateShareable: true
						}
					})
				]
			}), true/**bCreate expand data */);

			this.sut.addShapeScheme(new sap.gantt.simple.ShapeScheme({
				key: "break",
				rowSpan: 1
			}));

			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			utils.destroyGantt();
		},
		getMainShape: function(iIndex) {
			var oRowSettings = this.sut.getTable().getRows()[iIndex].getAggregation("_settings");
			return oRowSettings.getShapes1()[0];
		}
	});
	QUnit.test("Expand or collapse single rows by enabling the row border and disabling the row background color", function (assert) {
		var iExpandIndex = 0;
		this.sut.setEnableExpandedRowBackground(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					oMainShape.getBreaks().forEach(function (oBreak) {
						assert.notEqual(oBreak.getDomRef(), null, "each expand shape has DOM ref");
					});
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);

					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
	QUnit.test("Expand or collapse single row by disabling the row border and enabling the row background color", function (assert) {
		var iExpandIndex = 0;
		this.sut.setEnableExpandedRowBorders(false);
		return utils.waitForGanttRendered(this.sut).then(function () {
			this.sut.expand("break", iExpandIndex);
			return new Promise(function (resolve1) {
				setTimeout(function () {
					var oMainShape = this.getMainShape(iExpandIndex);
					assert.ok(oMainShape != null, "the main shape can be found");
					assert.ok(oMainShape.getBreaks().length > 1, "there has lazy and expandable shapes");
					oMainShape.getBreaks().forEach(function (oBreak) {
						assert.notEqual(oBreak.getDomRef(), null, "each expand shape has DOM ref");
					});
					var mExpanded = this.sut._oExpandModel.mExpanded;
					assert.notEqual(mExpanded, null, "mExpanded has values");
					assert.equal(Object.keys(mExpanded).length, 1, "only 1 key exists");
					resolve1();
				}.bind(this), 400); // leave 400 ms to render completely
			}.bind(this)).then(function () {
				return new Promise(function (resolveFinal) {
					this.sut.collapse("break", iExpandIndex);

					setTimeout(function () {
						this.getMainShape(iExpandIndex).getBreaks().forEach(function (oBreak) {
							assert.equal(oBreak.getDomRef(), null, "expand shape DOM refs are removed");
						});
						resolveFinal();
					}.bind(this), 400); // leave 400 ms to render completely
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});


});
