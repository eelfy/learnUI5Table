/*global QUnit */
sap.ui.define([
	"sap/gantt/GanttChartWithTable",
	"sap/m/Label",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Column",
	"sap/ui/table/plugins/MultiSelectionPlugin",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/qunit/data/DataProducer"
], function(GanttChartWithTable, Label, JSONModel, Column, MultiSelectionPlugin, qutils, DataProducer){
	"use strict";

	// qutils.delayTestStart();
	QUnit.module("Basic Rendering Tests", {
		beforeEach: function () {
			var oDataProducer = new DataProducer();
			oDataProducer.produceData();
			// create model and load data
			var oModel = new JSONModel();
			oModel.setData(oDataProducer.getData("sap_hierarchy"));

			// create GanttChart
			this.oGanttChartWithTable = new GanttChartWithTable({
				columns: [new Column({
					label: "Unique ID",
					sortProperty: "uuid",
					filterProperty: "uuid",
					template: new Label({
						text: {
							path: "uuid",
							model: "test"
						}
					})
				})],
				rows: {
					path: "test>/root",
					parameters: {
						arrayNames: ["children"]
					}
				}
			});
			this.oGanttChartWithTable.setModel(oModel, "test");
			this.oGanttChartWithTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});
	QUnit.test("TreeTable API test", function (assert) {
		var done = assert.async();
		assert.equal(this.oGanttChartWithTable.getSelectedIndex(), this.oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Default selected index");
		this.oGanttChartWithTable.setSelectedIndex(0);
		assert.equal(this.oGanttChartWithTable.getSelectedIndex(), this.oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Return index that was set");

		assert.equal(this.oGanttChartWithTable.getVisibleRowCount(), this.oGanttChartWithTable._oTT.getVisibleRowCount(), "Number of visible rows");

		assert.equal(this.oGanttChartWithTable.getRows().length, this.oGanttChartWithTable._oTT.getRows().length, "Number of rows");

		assert.equal(this.oGanttChartWithTable.getFirstVisibleRow(), 0, "Default visible row");
		this.oGanttChartWithTable.setFirstVisibleRow(1);
		assert.equal(this.oGanttChartWithTable.getFirstVisibleRow(), 1, "Should be 1");

		//Flat mode test
		assert.ok(this.oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length > 0, "Tree Icons available in TreeMode");
		this.oGanttChartWithTable.setUseFlatMode(true);
		setTimeout(function () {
			assert.strictEqual(this.oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length, 0, "Tree Icons not available in FlatMode");
			done();
		}.bind(this), 0);
	});

	QUnit.module("Collapse/Expand mock tests", {
		beforeEach: function () {
			this.oGanttChartWithTable = new GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Expand test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.expand = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Expand method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.expand(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.test("Collapse test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.collapse = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Collapse method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.collapse(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.module("Functions", {
		beforeEach: function () {
			this.oGanttChartWithTable = new sap.gantt.GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Test for getShapeSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("shapeSelectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setShapeSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setShapeSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("shapeSelectionMode"), "Changed to expectation");
	});

	QUnit.test("Test for getSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("selectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("selectionMode"), "Changed to expectation");
	});

	QUnit.test("Test for useSelectionPlugin function", function (assert) {
		var oLeftTable = this.oGanttChartWithTable.getAggregation("_selectionPanel");
		var oRightTable = this.oGanttChartWithTable.getAggregation("_chart").getAggregation("_treeTable");

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used by default."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set by default.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set by default.");

		var oSelectionPlugin1 = new MultiSelectionPlugin({limit: 0});
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin1);

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), oSelectionPlugin1,
			"Selection plugin should be used after setting it."
		);
		assert.ok(oLeftTable._hasSelectionPlugin(), "Selection panel should have selection plugin set after setting it.");
		assert.ok(oRightTable._hasSelectionPlugin(), "Tree table should have selection plugin set after setting it.");

		this.oGanttChartWithTable.useSelectionPlugin(); // no parameter removes the selection plugin

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used after removing it."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set after removing usage of it.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set after removing usage of it.");

		var oSelectionPlugin2 = new MultiSelectionPlugin({limit: 0});
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin1);
		this.oGanttChartWithTable.useSelectionPlugin(oSelectionPlugin2);

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), oSelectionPlugin2,
			"The latest set selection plugin should be used."
		);
		assert.ok(oLeftTable._hasSelectionPlugin(), "Selection panel should have selection plugin set after setting it.");
		assert.ok(oRightTable._hasSelectionPlugin(), "Tree table should have selection plugin set after setting it.");

		this.oGanttChartWithTable.useSelectionPlugin(); // no parameter removes the selection plugin

		assert.strictEqual(
			this.oGanttChartWithTable._getSelectionHandler(), this.oGanttChartWithTable.getAggregation("_selectionPanel"),
			"Selection plugin should NOT be used after removing it even if multiple ones were set previously."
		);
		assert.notOk(oLeftTable._hasSelectionPlugin(), "Selection panel should NOT have selection plugin set after removing usage of it.");
		assert.notOk(oRightTable._hasSelectionPlugin(), "Tree table should NOT have selection plugin set after removing usage of it.");

		assert.strictEqual(oLeftTable.getPlugins().length, 0, "Selection panel should NOT have any selection plugins left.");
		assert.strictEqual(oRightTable.getPlugins().length, 0, "Tree table should NOT have any selection plugins left.");
	});

}, false);
