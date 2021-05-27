/*global QUnit,sinon */

sap.ui.define([
	"sap/gantt/library",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/misc/Format",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Table",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/BaseCalendar",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/shapes/Task",
	"sap/m/OverflowToolbar",
	"sap/m/OverflowToolbarLayoutData",
	"sap/m/OverflowToolbarButton",
	'sap/ui/export/ExportUtils',
	'sap/base/util/deepEqual',
	"sap/ui/Device",
	"sap/ui/table/Column",
	"sap/m/Panel",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/TimeInterval",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/misc/Utility"
], function (
	library,
	GanttChartContainer,
	FullScreenStrategy,
	ProportionZoomStrategy,
	StepwiseZoomStrategy,
	TimeHorizon,
	Format,
	TreeTable,
	Table,
	GanttChartWithTable,
	BaseCalendar,
	BaseRectangle,
	BaseText,
	GanttUtils,
	GanttQUnitUtils,
	Task,
	OverflowToolbar,
	OverflowToolbarLayoutData,
	OverflowToolbarButton,
	ExportUtils,
	deepEqual,
	Device,
	Column,
	Panel,
	JSONModel,
	BaseChevron,
	CalendarDefs,
	Calendar,
	TimeInterval,
	GanttRowSettings,
	Utility
) {
	"use strict";

	var AdhocLineLayer = library.AdhocLineLayer,
		DragOrientation = library.DragOrientation,
		GanttChartWithTableDisplayType = library.simple.GanttChartWithTableDisplayType,
		GhostAlignment = library.dragdrop.GhostAlignment,
		SelectionMode = library.SelectionMode,
		VisibleHorizonUpdateType = library.simple.VisibleHorizonUpdateType;

	QUnit.module("basic", {
		beforeEach: function() {
			this.sut = new GanttChartWithTable();
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("default properties", function(assert){
		assert.strictEqual(this.sut.getWidth(), "100%", "default width");
		assert.strictEqual(this.sut.getHeight(), "100%", "default height");
		assert.strictEqual(this.sut.getDisplayType(), GanttChartWithTableDisplayType.Both, "default displayType");
		assert.strictEqual(this.sut.getSelectionPanelSize(), "30%", "default selectionPanelSize");
		assert.strictEqual(this.sut.getShapeSelectionMode(), SelectionMode.MultiWithKeyboard, "default shapeSelectionMode");
		assert.strictEqual(this.sut.getShapeSelectionSettings(), null, "default selection settings");
		assert.strictEqual(this.sut.getDatePattern(), library.config.DEFAULT_DATE_PATTERN, "default date pattern");
		assert.strictEqual(this.sut.getTimePattern(), library.config.DEFAULT_TIME_PATTERN, "default time pattern");

		["getEnableCursorLine", "getEnableNowLine", "getEnableVerticalLine", "getEnableAdhocLine", "getEnableExpandedRowBorders", "getEnableExpandedRowBackground", "getEnableNonWorkingTime"].forEach(function(sName){
			assert.ok(this[sName](), "default " + sName);
		}.bind(this.sut));

		assert.strictEqual(this.sut.getAdhocLineLayer(), AdhocLineLayer.Top, "default adhocLineLayer");
		assert.strictEqual(this.sut.getDragOrientation(), DragOrientation.Free, "default dragOrientation");
		assert.strictEqual(this.sut.getGhostAlignment(), GhostAlignment.None, "default ghostAlignment");

		assert.notOk(this.sut.getDisableShapeDoubleClickEvent(), "default disableShapeDoubleClickEvent");
		assert.ok(this.sut.getNowLineInUTC(), "default nowLineInUTC");
		assert.notOk(this.sut.getShowShapeTimeOnDrag(), "default showShapeTimeOnDrag");
	});

	QUnit.test("non-default properties", function (assert) {
		this.sut.destroy();
		this.sut = new GanttChartWithTable({
			adhocLineLayer: AdhocLineLayer.Bottom,
			disableShapeDoubleClickEvent: true,
			displayType: GanttChartWithTableDisplayType.Chart,
			dragOrientation: DragOrientation.Horizontal,
			datePattern: "dd.MM.yyyy",
			timePattern: "hh:mm a",
			enableCursorLine: false,
			enableNowLine: false,
			enableVerticalLine: false,
			enableAdhocLine: false,
			enableDeltaLine: false,
			enableNonWorkingTime: false,
			enableExpandedRowBorders: false,
			enableExpandedRowBackground: false,
			expandedRowHeight: 50,
			ghostAlignment: GhostAlignment.End,
			height: "auto",
			nowLineInUTC: false,
			selectionPanelSize: "40%",
			shapeSelectionMode: SelectionMode.Single,
			shapeSelectionSettings: {
				color: "#808080",
				strokeWidth: 2,
				strokeDasharray: "5,1"
			},
			showShapeTimeOnDrag: true,
			width: "auto"
		});

		assert.strictEqual(this.sut.getWidth(), "auto", "width should be set correctly");
		assert.strictEqual(this.sut.getHeight(), "auto", "height should be set correctly");
		assert.strictEqual(this.sut.getDisplayType(), GanttChartWithTableDisplayType.Chart, "displayType should be set correctly");
		assert.strictEqual(this.sut.getSelectionPanelSize(), "40%", "selectionPanelSize should be set correctly");
		assert.strictEqual(this.sut.getShapeSelectionMode(), SelectionMode.Single, "shapeSelectionMode should be set correctly");
		assert.strictEqual(this.sut.getExpandedRowHeight(), 50, "rowHeight should be set correctly");
		assert.strictEqual(this.sut.getDatePattern(), "dd.MM.yyyy", "datePattern should be set correctly");
		assert.strictEqual(this.sut.getTimePattern(), "hh:mm a", "timePattern should be set correctly");
		assert.deepEqual(this.sut.getShapeSelectionSettings(), {
			color: "#808080",
			strokeWidth: 2,
			strokeDasharray: "5,1"
		}, "selection settings should be set correctly");

		["getEnableCursorLine", "getEnableNowLine", "getEnableVerticalLine", "getEnableAdhocLine", "getEnableExpandedRowBorders", "getEnableExpandedRowBackground", "getEnableNonWorkingTime"].forEach(function(sName){
			assert.notOk(this[sName](), "default " + sName);
		}.bind(this.sut));

		assert.strictEqual(this.sut.getAdhocLineLayer(), AdhocLineLayer.Bottom, "adhocLineLayer should be set correctly");
		assert.strictEqual(this.sut.getDragOrientation(), DragOrientation.Horizontal, "dragOrientation should be set correctly");
		assert.strictEqual(this.sut.getGhostAlignment(), GhostAlignment.End, "ghostAlignment should be set correctly");

		assert.ok(this.sut.getDisableShapeDoubleClickEvent(), "disableShapeDoubleClickEvent should be set correctly");
		assert.notOk(this.sut.getNowLineInUTC(), "nowLineInUTC should be set correctly");
		assert.ok(this.sut.getShowShapeTimeOnDrag(), "showShapeTimeOnDrag should be set correctly");
	});

	QUnit.test("default aggregation", function(assert){
		assert.strictEqual(this.sut.getTable(), null, "default table");
		assert.strictEqual(this.sut.getAdhocLines().length, 0, "default adhocLines");
		assert.strictEqual(this.sut.getSimpleAdhocLines().length, 0, "default simple adhocLines");
		assert.strictEqual(this.sut.getSvgDefs(), null, "default svgDefs");
		assert.strictEqual(this.sut.getCalendarDef(), null, "default calendarDef");

		// a primary shape scheme is provided
		var aSchemes = this.sut.getShapeSchemes();
		assert.strictEqual(aSchemes.length, 1, "1 default shape schemes");
		assert.ok(aSchemes[0].getPrimary(), "default scheme is primary");

		var oAxisStrategy = this.sut.getAxisTimeStrategy();
		assert.ok(oAxisStrategy != null, "axis zoom strategy has default values");
		assert.ok(oAxisStrategy.isA("sap.gantt.axistime.ProportionZoomStrategy"), "is a ProportionZoomStrategy");

		var oLocale = this.sut.getLocale();
		assert.ok(oLocale != null, "locale has default value");
		assert.ok(oLocale.isA("sap.gantt.config.Locale"), "isA config.Locale");

		assert.strictEqual(oLocale.getTimeZone(), "CET", "timezone cloned");
		assert.strictEqual(oLocale.getUtcdiff(), "000000", "utcdiff cloned");
		assert.strictEqual(oLocale.getUtcsign(), "+", "utcsign cloned");
		assert.ok(true, "locale is cloned from sap.gantt.config.DEFAULT_LOCALE_CET");
	});

	QUnit.test("internal methods/properties availability", function(assert){

		assert.ok(this.sut.getPrimaryShapeScheme() != null, "has primary scheme");
		assert.ok(this.sut.getInnerGantt() != null, "has inner gantt");
		var oSyncedControl = this.sut.getSyncedControl();
		assert.ok(oSyncedControl != null, "has synced control");
		assert.ok(oSyncedControl.isA("sap.gantt.simple.GanttSyncedControl"), "isA oSyncedControl");

		assert.ok(this.sut.getAxisTime() != null, "getAxisTime is available");

		assert.ok(this.sut.getSelection() != null, "getSelection is available");
	});

	QUnit.test("GanttExtension", function(assert){
		assert.ok(this.sut._bExtensionsInitialized === false, "Gantt Extension is not initialized");
		assert.strictEqual(this.sut._aExtensions, undefined, "no extension is initialized");
	});

	QUnit.module("functions", {
		beforeEach: function () {
			this.sut = GanttQUnitUtils.createGantt(true);
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		assertSelectionState: function (assert, aExpectedSelectedShapeUids) {
			var aAllNonExpandedShapeUids = [
				"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
				"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
				"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
				"PATH:3|SCHEME:default[0]|DATA:/tree/rows/3[3]",
				"PATH:4|SCHEME:default[0]|DATA:/tree/rows/4[4]",
				"PATH:5|SCHEME:default[0]|DATA:/tree/rows/5[5]",
				"PATH:6|SCHEME:default[0]|DATA:/tree/rows/6[6]",
				"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
			];
			GanttUtils.getShapesWithUid(this.sut.getId(), aAllNonExpandedShapeUids).forEach(function (oShape) {
				assert.ok(
					aExpectedSelectedShapeUids.indexOf(oShape.getShapeUid()) > -1 ? oShape.getSelected() : !oShape.getSelected(),
					"Shape should have correct selection state. Shape UID is " + oShape.getShapeUid()
				);
			});
			assert.deepEqual(this.sut.getSelection().allUid(), aExpectedSelectedShapeUids, "SelectionModel's state should be correctly updated.");
		}
	});

	QUnit.test("getTable", function(assert){
		assert.ok(this.sut.getTable()._bVariableRowHeightEnabled, "enable variable row heights");

		var oSplitter = this.sut._oSplitter,
			oFirstCA = oSplitter.getContentAreas()[0],
			oSecondCA = oSplitter.getContentAreas()[1];
		assert.ok(oFirstCA != null, "first content is not null");
		assert.ok(oFirstCA.isA("sap.gantt.control.AssociateContainer"), "first content is AssociateContainer");
		assert.ok(oFirstCA.getEnableRootDiv(), "table is enabled enableRootDiv");

		assert.ok(oSecondCA != null, "second content is not null");
		assert.ok(oSecondCA.isA("sap.gantt.simple.GanttSyncedControl"), "second content is also GanttSyncedControl");
	});

	QUnit.test("setTable", function(assert){
		var setTableSpy = sinon.spy(this.sut, "setTable");
		var oSyncedControl = this.sut.getSyncedControl();
		var syncWithSpy = sinon.spy(oSyncedControl, "syncWith");

		var oNewTable = new Table();
		this.sut.destroyTable();
		this.sut.setTable(oNewTable);
		assert.ok(setTableSpy.calledOnce, "setTable is called once");

		assert.ok(syncWithSpy.calledOnce, "syncWith called only once");
		assert.ok(syncWithSpy.calledOn(oSyncedControl), "called on oSyncedControl");
		assert.ok(syncWithSpy.calledWithExactly(oNewTable), "called on oSyncedControl");

		setTableSpy.restore();
		syncWithSpy.restore();
	});

	QUnit.test("setAxisTimeStrategy", function (assert) {
		this.sut.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			// Create dates for the new AxisTimeStrategy
			var oAxisTimeStrategy = this.sut.getAxisTimeStrategy();
			var dNewVisibleStart = Format.abapTimestampToDate(oAxisTimeStrategy.getVisibleHorizon().getStartTime());
			var dNewVisibleEnd = Format.abapTimestampToDate(oAxisTimeStrategy.getVisibleHorizon().getEndTime());
			var dNewTotalStart = Format.abapTimestampToDate(oAxisTimeStrategy.getTotalHorizon().getStartTime());
			var dNewTotalEnd = Format.abapTimestampToDate(oAxisTimeStrategy.getTotalHorizon().getEndTime());
			dNewVisibleStart.setDate(dNewVisibleStart.getDate() + 7);
			dNewVisibleEnd.setDate(-7);
			dNewTotalStart.setDate(dNewTotalStart.getDate() + 14);
			dNewTotalEnd.setDate(-14);

			// Set the new AxisTimeStrategy
			var oNewAxisTimeStrategy = this.sut.getAxisTimeStrategy().clone();
			oNewAxisTimeStrategy.getVisibleHorizon().setStartTime(dNewVisibleStart);
			oNewAxisTimeStrategy.getVisibleHorizon().setEndTime(dNewVisibleEnd);
			oNewAxisTimeStrategy.getTotalHorizon().setStartTime(dNewTotalStart);
			oNewAxisTimeStrategy.getTotalHorizon().setEndTime(dNewTotalEnd);
			this.sut.destroyAxisTimeStrategy();
			this.sut.setAxisTimeStrategy(oNewAxisTimeStrategy);

			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				assert.notStrictEqual(this.sut._getScrollExtension()._getGanttHsbScrollLeft(), 0, "After setting new wider AxisTimeStrategy, the horizontal scrollbar should NOT reset to 0.");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("selectShapes", function (assert) {
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
		];
		this.sut.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.selectShapes(aShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				this.assertSelectionState(assert, aShapeUids);
				aShapeUids.pop(); // remove last shape Uid
				this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
				return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
					this.assertSelectionState(assert, aShapeUids);
					this.sut.selectShapes([], false); // not exclusive
					return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
						this.assertSelectionState(assert, aShapeUids);
						aShapeUids = []; // remove all selections
						this.sut.selectShapes(aShapeUids, true); // do exclusive selection now
						return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
							this.assertSelectionState(assert, aShapeUids);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("deselectShapes", function (assert) {
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
		];
		this.sut.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.selectShapes(aShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				this.sut.deselectShapes();
				this.assertSelectionState(assert, aShapeUids);
				this.sut.deselectShapes([aShapeUids[0], aShapeUids[3]]);
				return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
					aShapeUids.shift(); // removes first
					aShapeUids.pop(); // removes last
					this.assertSelectionState(assert, aShapeUids);
					this.sut.deselectShapes(aShapeUids);
					return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
						this.assertSelectionState(assert, []);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("deselectShapes with setSelected", function (assert) {
		var aShapeUids = [
			"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
			"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
			"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
			"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
		];
		this.sut.placeAt("qunit-fixture");

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			this.sut.setSelectedShapeUid(aShapeUids); // exclusive parameter is not specified
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				this.sut.deselectShapes();
				this.assertSelectionState(assert, aShapeUids);
				this.sut.setSelectedShapeUid([aShapeUids[1], aShapeUids[2]]);
				return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
					aShapeUids.shift(); // removes first
					aShapeUids.pop(); // removes last
					this.assertSelectionState(assert, aShapeUids);
					this.sut.setSelectedShapeUid();
					return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
						this.assertSelectionState(assert, []);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("jumpToPosition", function (assert) {
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var oVisibleHorizon = this.sut.getAxisTimeStrategy().getVisibleHorizon();
			var oTotalHorizon = this.sut.getAxisTimeStrategy().getTotalHorizon();
			var dVisibleHorizonStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dVisibleHorizonEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());

			dVisibleHorizonStartTime.setDate(dVisibleHorizonStartTime.getDate() + 14);

			this.sut.jumpToPosition(dVisibleHorizonStartTime);

			assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");

			dVisibleHorizonStartTime.setDate(-7);

			this.sut.jumpToPosition(Format.dateToAbapTimestamp(dVisibleHorizonStartTime));

			assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");

			dVisibleHorizonStartTime.setDate(-7);
			dVisibleHorizonEndTime.setDate(-14);

			this.sut.jumpToPosition([dVisibleHorizonStartTime, dVisibleHorizonEndTime]);

			assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
			assert.strictEqual(oVisibleHorizon.getEndTime(), Format.dateToAbapTimestamp(dVisibleHorizonEndTime), "Visible horizon's endTime should be updated.");

			dVisibleHorizonStartTime.setDate(dVisibleHorizonStartTime.getDate() + 1);
			dVisibleHorizonEndTime.setDate(dVisibleHorizonEndTime.getDate() + 7);

			this.sut.jumpToPosition([Format.dateToAbapTimestamp(dVisibleHorizonStartTime), Format.dateToAbapTimestamp(dVisibleHorizonEndTime)]);

			assert.strictEqual(oVisibleHorizon.getStartTime(), Format.dateToAbapTimestamp(dVisibleHorizonStartTime), "Visible horizon's startTime should be updated.");
			assert.strictEqual(oVisibleHorizon.getEndTime(), Format.dateToAbapTimestamp(dVisibleHorizonEndTime), "Visible horizon's endTime should be updated.");

			this.sut.jumpToPosition();

			assert.ok(oVisibleHorizon.equals(oTotalHorizon), "Calling the function with no parameters should change the visible horizon to the total horizon.");
		}.bind(this));
	});

	QUnit.test("selectionMode", function(assert){
		var oSelection = this.sut.getSelection();
		assert.equal(this.sut.getShapeSelectionMode(), oSelection.getSelectionMode(), "initial value is correct");
		this.sut.setShapeSelectionMode("Single");
		assert.equal(oSelection.getSelectionMode(), "Single", "oSelection mode also updated");
	});

	QUnit.test("handleShapePress", function(assert){
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(3);
			var oNow = new Date(),
				oEnd = new Date(oNow.getTime() + 24 * 3600000),
				oRect = new BaseRectangle({
					selected: false,
					selectable: true,
					draggable: false,
					time: oNow,
					endTime: oEnd
				}),
				sFakeShapeUid = "PATH:0|abcde|SCHEME:ac_main[0]";
			var oRectGetShapeUidStub = sinon.stub(oRect, "getShapeUid").returns(sFakeShapeUid);
			var mParam = {
				shape: oRect,
				ctrlOrMeta: false
			};

			var oSelection = this.sut.getSelection();
			this.sut.attachEventOnce("shapeSelectionChange", function (oEvent) {
				assert.deepEqual(oEvent.getParameter("shapeUids"), [sFakeShapeUid], "The selectionChange event should contain all selected shapes.");
				assert.deepEqual(oSelection.allUid(), [sFakeShapeUid], "The allUid function should return only one selected shape.");
				assert.deepEqual(oSelection.getSelectedShapeDataByUid(sFakeShapeUid), {
					draggable: false,
					time: oNow,
					endTime: oEnd,
					shapeUid: sFakeShapeUid
				}, "The getSelectedShapeDataByUid function should return correct data.");
				oRectGetShapeUidStub.restore();
			});

			this.sut.handleShapePress(mParam);
		}.bind(this));
	});

	QUnit.test("setRowsHeight", function(assert){
		this.sut.placeAt("qunit-fixture");
		var done = assert.async();

		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			var aRows = this.sut.getTable().getRows(),
			iDefaultRowHeight = this.sut.getTable()._getDefaultRowHeight();
			assert.equal(parseInt(aRows[1].getDomRef().style.height.replace('px',''), 10), iDefaultRowHeight, "1st row height is same as the table default row height.");
			assert.equal(parseInt(aRows[7].getDomRef().style.height.replace('px',''), 10), iDefaultRowHeight, "7th row height is same as the table default row height.");
			var oRowsCustomHeight = {};
			oRowsCustomHeight[aRows[1].getAggregation("_settings").getRowId()] = 50;
			oRowsCustomHeight[aRows[7].getAggregation("_settings").getRowId()] = 70;
			this.sut.setRowsHeight(oRowsCustomHeight);
			return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
				setTimeout(function() {
					assert.equal(aRows[1].getDomRef().style.height, 50 + "px", "1st row height is set to the given height.");
					assert.equal(aRows[7].getDomRef().style.height, 70 + "px", "7th row height is set to the given height.");
					done();
				}, 1000);
			});
		}.bind(this));
	});

	QUnit.module("axisTimeStrategy binding", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt(true);
			var oVisibleHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon();
			var oTotalHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
			this.sOriginalVisibleHorizonStartTime = oVisibleHorizon.getStartTime();
			this.sOriginalVisibleHorizonEndTime = oVisibleHorizon.getEndTime();
			this.sOriginalTotalHorizonStartTime = oTotalHorizon.getStartTime();
			this.sOriginalTotalHorizonEndTime = oTotalHorizon.getEndTime();

			// calculate new visible horizon dates
			var dNewVisibleStart = Format.abapTimestampToDate(this.sOriginalVisibleHorizonStartTime);
			var dNewVisibleEnd = Format.abapTimestampToDate(this.sOriginalVisibleHorizonEndTime);
			dNewVisibleStart.setDate(dNewVisibleStart.getDate() + 14);
			dNewVisibleEnd.setDate(-12);

			// add data to the model
			var oModel = this.gantt.getModel();
			oModel.setProperty("/totalHorizonStartTime", this.sOriginalTotalHorizonStartTime);
			oModel.setProperty("/totalHorizonEndTime", this.sOriginalTotalHorizonEndTime);
			oModel.setProperty("/visibleHorizonStartTime", Format.dateToAbapTimestamp(dNewVisibleStart));
			oModel.setProperty("/visibleHorizonEndTime", Format.dateToAbapTimestamp(dNewVisibleEnd));
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		},
		fnAssert: function (assert, bHorizontalScrollbarShouldEndUpLeftAtZero) {
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				if (bHorizontalScrollbarShouldEndUpLeftAtZero) {
					assert.strictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "1st render should end up with horizontal scrollbar left at 0.");
				} else {
					assert.notStrictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "1st render should end up with horizontal scrollbar NOT left at 0.");
				}

				var oModel = this.gantt.getModel();
				oModel.setProperty("/totalHorizonStartTime", this.sOriginalTotalHorizonStartTime);
				oModel.setProperty("/totalHorizonEndTime", this.sOriginalTotalHorizonEndTime);
				oModel.setProperty("/visibleHorizonStartTime", this.sOriginalVisibleHorizonStartTime);
				oModel.setProperty("/visibleHorizonEndTime", this.sOriginalVisibleHorizonEndTime);

				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					if (bHorizontalScrollbarShouldEndUpLeftAtZero) {
						assert.strictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "2nd render should end up with horizontal scrollbar left at 0.");
					} else {
						assert.notStrictEqual(this.gantt._getScrollExtension()._getGanttHsbScrollLeft(), 0, "2nd render should end up with horizontal scrollbar NOT left at 0.");
					}
				}.bind(this));
			}.bind(this));
		}
	});

	QUnit.test("FullScreenStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({ // same as visible horizon
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return this.fnAssert(assert, true);
	});

	QUnit.test("ProportionZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return this.fnAssert(assert, false);
	});

	QUnit.test("StepwiseZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			})
		}));

		this.gantt.placeAt("qunit-fixture");

		return this.fnAssert(assert, false);
	});

	QUnit.test("Test Zoom Level for ProportionZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			zoomLevel: 3
		}));

		this.gantt.placeAt("qunit-fixture");
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 3, "setZoomLevel property is correct.");
		this.gantt.getAxisTimeStrategy().setZoomLevel(5);
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 5, "setZoomLevel property is updated.");
	});

	QUnit.test("Test Zoom Level for StepwiseZoomStrategy", function (assert) {
		this.gantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "{/totalHorizonStartTime}",
				endTime: "{/totalHorizonEndTime}"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "{/visibleHorizonStartTime}",
				endTime: "{/visibleHorizonEndTime}"
			}),
			zoomLevel: 3
		}));

		this.gantt.placeAt("qunit-fixture");
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 3, "setZoomLevel property is correct.");
		this.gantt.getAxisTimeStrategy().setZoomLevel(5);
		assert.equal(this.gantt.getAxisTimeStrategy().getProperty("zoomLevel"), 5, "setZoomLevel property is updated.");
	});

	QUnit.module("Horizontal Scrollbar Visibility", {
		beforeEach: function() {
			this.gantt = GanttQUnitUtils.createGantt(true);
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("HSb hidden when entire gantt chart is visible", function (assert) {
		var oGantt = this.gantt;
		oGantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20160501000000",
					endTime: "20160601000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20160501000000",
					endTime: "20160601000000"
				})
			}));
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var $hsb = document.getElementById(oGantt.getId() + "-hsb");
				var $hsbContent = document.getElementById(oGantt.getId() + "-hsb-content");
				assert.strictEqual($hsbContent.clientWidth <= $hsb.clientWidth, true, "Horizontal Scrollbar is not visible");
			});
		});
	});

	QUnit.test("HSb appears when entire gantt chart is not visible", function (assert) {
		var oGantt = this.gantt;
		oGantt.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
				totalHorizon: new TimeHorizon({
					startTime: "20160501000000",
					endTime: "20180501000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20160501000000",
					endTime: "20160601000000"
				})
			}));
			return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var $hsb = document.getElementById(oGantt.getId() + "-hsb");
				var $hsbContent = document.getElementById(oGantt.getId() + "-hsb-content");
				assert.strictEqual($hsbContent.clientWidth > $hsb.clientWidth, true, "Horizontal Scrollbar is visible");
			});
		});
	});

	QUnit.module("selectionPanelSize", {
		beforeEach: function() {
			// set fixed width to prevent different Gantt rendering on different window sizes
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.gantt = GanttQUnitUtils.createGantt();
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("Splitter resize changes selectionPanelSize", function (assert) {
		var oGantt = this.gantt;
		assert.expect(2);

		return GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
			var iExpectedTableWidth = oGantt.$().width() * 0.3;
			var iTableWidth = oGantt.$().find("#table").width();
			assert.ok(
					(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
					"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + oGantt.$().width() + "px."
			);
			oGantt._oSplitter.getContentAreas()[0].getLayoutData().setSize("50px");
			oGantt._oSplitter.triggerResize(true);
			assert.equal(oGantt.getSelectionPanelSize(), "50px", "selectionPanelSize should be unchanged.");
		});
	});

	QUnit.test("Test resize of gantt doesn't change selectionPanelSize", function (assert) {
		var oGantt = this.gantt;
		assert.expect(2);

		return new Promise(function (resolve) {
			function onResize() {
				assert.equal(oGantt.getSelectionPanelSize(), "30%", "selectionPanelSize should be unchanged.");
				resolve();
			}

			GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
				var iExpectedTableWidth = oGantt.$().width() * 0.3;
				var iTableWidth = oGantt.$().find("#table").width();
				assert.ok(
						(iTableWidth > (iExpectedTableWidth - 10)) && (iTableWidth < (iExpectedTableWidth + 10)),
						"Table on load should have " + iExpectedTableWidth + "px (+-10px) because selection panel size is set to 30% and Gantt width is " + oGantt.$().width() + "px."
				);
				oGantt._oSplitter.attachEventOnce("resize", onResize);
				oGantt.$().width(100);
			});
		});
	});


	QUnit.test("Test resize of gantt when Table size is updated", function (assert) {

		this.gantt.setSelectionPanelSize("40%");
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
				oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
				oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();
				assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
				assert.strictEqual(oTableAreaLayoutData.getSize(), "40%", "Default table size is 40%");
				assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Default chart layout size is auto");
				this.gantt.setSelectionPanelSize("0%");//set Table width to 0px so the _onResize updates the default width of the table to 60px
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					//parameter passed to _onResize will be true if the method is called from onSplitterResize()
					//In this case do not set the value from SelectionPanelSize
					this.gantt._onResize(true);
					assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
					assert.strictEqual(oTableAreaLayoutData.getSize(), "60px", "Table size of 60px is set when table width is set to to 0px");
					assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Cchart layout size is auto");
					this.gantt.setSelectionPanelSize("0%");
					return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
						this.gantt.setSelectionPanelSize("40%");
						//Event object will be sent to _onResize when the event is trigerred from ResizeHandler.
						//In this case set the value form SelectionPanelSize
						this.gantt._onResize(false);
						assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
						assert.strictEqual(oTableAreaLayoutData.getSize(), "40%", "Table size is updated to 40% based on SelectionPanelSize");
						assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Chart layout size is auto");
					}.bind(this));
				}.bind(this));
			}.bind(this));
	});

	QUnit.test("Test displayTypes", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			var aSplitterContentAreas = this.gantt._oSplitter.getContentAreas(),
				oTableAreaLayoutData = aSplitterContentAreas[0].getLayoutData(),
				oChartAreaLayoutData = aSplitterContentAreas[1].getLayoutData();

			assert.strictEqual(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			assert.strictEqual(oTableAreaLayoutData.getSize(), "30%", "Default table size is 30%");
			assert.strictEqual(oChartAreaLayoutData.getSize(), "auto", "Default chart layout size is auto");
			assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "inline-flex", "Default display of splitter bar is inline flex");

			// Set displayType to Chart
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				assert.strictEqual(oTableAreaLayoutData.getSize(), "0px");
				assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
				assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "none", "Display of splitter bar is none in chart only mode");

				// Set displayType to Table
				this.gantt.setDisplayType(GanttChartWithTableDisplayType.Table);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					var oTargetHorizon = this.gantt.getAxisTimeStrategy().getTotalHorizon();
					var oTimeHorizon = Utility.calculateHorizonByWidth(oTargetHorizon, 0, 0);
					assert.strictEqual(oTimeHorizon.getStartTime() === oTargetHorizon.getStartTime() && oTimeHorizon.getEndTime() === oTargetHorizon.getEndTime(), true);
					oTimeHorizon = Utility.calculateHorizonByWidth(this.gantt.getAxisTimeStrategy().getTotalHorizon(), 875, 612);
					assert.strictEqual(oTimeHorizon.getStartTime() === oTargetHorizon.getStartTime() && oTimeHorizon.getEndTime() !== oTargetHorizon.getEndTime(), true);
					assert.strictEqual(oTableAreaLayoutData.getSize(), "auto");
					if (Device.browser.msie) {
						assert.strictEqual(oChartAreaLayoutData.getSize(), "19px");//for the vertical scroll
					} else {
						assert.strictEqual(oChartAreaLayoutData.getSize(), "17px");//for the vertical scroll
					}

					assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "none", "Display of splitter bar is none in table only mode");

					// Test if Gantt remembers the last table width from the last Both displayMode
					this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
					return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
						assert.strictEqual(oTableAreaLayoutData.getSize(), "30%"); // Splitter-calculated value from 30%
						assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
						assert.equal(this.gantt._oSplitter.$("splitbar-0").css("display"), "inline-flex", "Default display of splitter bar is inline flex");

						// Test selectionPanelSize change (splitter left area resize)
						this.gantt.setSelectionPanelSize("200px");
						return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
							assert.strictEqual(oTableAreaLayoutData.getSize(), "200px");
							assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");

							// Test change to Chart and back to Both, table and chart should have same size as before change displayType
							this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
							return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
								assert.strictEqual(oTableAreaLayoutData.getSize(), "0px");
								assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");

								this.gantt.setDisplayType(GanttChartWithTableDisplayType.Both);
								return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
									assert.strictEqual(oTableAreaLayoutData.getSize(), "200px");
									assert.strictEqual(oChartAreaLayoutData.getSize(), "auto");
								});
							}.bind(this));
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Change the default settings property getEnableVerticalLine with chart displayTypes and check for gantt chart header height in compact mode", function (assert) {
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.equal(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			var sGanttId = this.gantt.getId(),
			$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]"),
			//get the initial height of the header
			nGanttHeaderHeight = $GanttHeader.height();
			//change to chart only mode
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
				assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
				//disable vertical line
				this.gantt.setEnableVerticalLine(false);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
					assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
					//enable vertical line
					this.gantt.setEnableVerticalLine(true);
					return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
						$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
						assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
					});
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Change the default settings property getEnableVerticalLine with chart displayTypes and check for gantt chart header height in cozy mode", function (assert) {
		document.querySelector('.sapUiBody').classList.remove("sapUiSizeCompact");
		document.querySelector('.sapUiBody').classList.add("sapUiSizeCozy");
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			assert.equal(this.gantt.getDisplayType(), GanttChartWithTableDisplayType.Both, "Default displayType is Both");
			var sGanttId = this.gantt.getId(),
			$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]"),
			///get the initial height of the header
			nGanttHeaderHeight = $GanttHeader.height();
			//change to chart only
			this.gantt.setDisplayType(GanttChartWithTableDisplayType.Chart);
			return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
				$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
				assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
				//disable vertical line
				this.gantt.setEnableVerticalLine(false);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
					assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
					//enable vertical line
					this.gantt.setEnableVerticalLine(true);
					return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
						$GanttHeader = jQuery("div.sapGanttChartWithTableHeader[data-sap-ui-related=" + sGanttId.replace(/([:.\[\],=@])/g, "\\$1") + "]");
						assert.equal($GanttHeader.height(), nGanttHeaderHeight, "height has not changed from initial");
						document.querySelector('.sapUiBody').classList.remove("sapUiSizeCozy");
						document.querySelector('.sapUiBody').classList.add("sapUiSizeCompact");
					});
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("Test isShapeVisible", function(assert){
		var oGanttChartWithTable = this.gantt,
			oShape0 = new BaseRectangle(),
			oShape1 = new BaseText(),
			oShapeCalendar = new BaseCalendar();

		assert.expect(6);

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape0));
		oShape0.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape0));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShape1));
		oShape1.setVisible(false);
		assert.notOk(oGanttChartWithTable.isShapeVisible(oShape1));

		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
		oShapeCalendar.setVisible(false);
		assert.ok(oGanttChartWithTable.isShapeVisible(oShapeCalendar));
	});

	QUnit.module("visibleHorizonUpdate event", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt();
		},
		afterEach: function () {
			GanttQUnitUtils.destroyGantt();
		}
	});

	QUnit.test("HorizontalScroll fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
					assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.HorizontalScroll, "HorizontalScroll event should have happened.");
					assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
					assert.ok(this.gantt.getAxisTimeStrategy().getVisibleHorizon().equals(oEvent.getParameter("currentVisibleHorizon")), "Current VisibleHorizon should be correct.");
					assert.notOk(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
					fnDone();
				}, this);
				this.gantt.$("hsb").scrollLeft(0);
			}.bind(this), 100); // need to wait because Table updates its rows async (50ms)
		}.bind(this));
	});

	QUnit.test("InitialRender fired", function (assert) {
		var fnDone = assert.async();
		var oOriginalHorizon = this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone();
		this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
				assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.InitialRender, "InitialRender event should have happened.");
				assert.ok(oOriginalHorizon.equals(oEvent.getParameter("lastVisibleHorizon")), "HorizontalScroll event should have happened.");
				assert.ok(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
				fnDone();
		});
	});

	QUnit.test("TotalHorizonUpdated fired", function (assert) {
		var fnDone = assert.async();
		this.gantt.attachVisibleHorizonUpdate(function (oEvent) {
			if (oEvent.getParameter("type") === VisibleHorizonUpdateType.TotalHorizonUpdated) {
				assert.ok(true, "Correct event should get fired");
				fnDone();
			}
		});
		this.gantt.getAxisTimeStrategy().setTotalHorizon(this.gantt.getAxisTimeStrategy().getVisibleHorizon().clone());
	});

	QUnit.module("GanttChart in RTL Mode", {
		beforeEach: function() {
			//Set the RTL to true before creating the Gantt Chart
			sap.ui.getCore().getConfiguration().setRTL(true);
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
			sap.ui.getCore().getConfiguration().setRTL(false);
		}
	});

	QUnit.test("HorizontalScroll fired for RTL Mode", function (assert) {
		var fnDone = assert.async();
		this.gantt = GanttQUnitUtils.createGantt(false);//Create new instance of the Gantt Chart
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.attachEventOnce("visibleHorizonUpdate", function (oEvent) {
					assert.equal(oEvent.getParameter("type"), VisibleHorizonUpdateType.HorizontalScroll, "HorizontalScroll event should have happened.");
					assert.ok(this.gantt.getAxisTimeStrategy().getVisibleHorizon().equals(oEvent.getParameter("currentVisibleHorizon")), "Current VisibleHorizon should be correct.");
					assert.notOk(oEvent.getParameter("lastVisibleHorizon").equals(oEvent.getParameter("currentVisibleHorizon")), "Visible horizon should have changed.");
					fnDone();
				}, this);
				this.gantt.$("hsb").scrollLeft(0);
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	QUnit.test("Shape texts in RTL Mode", function (assert) {
		var fnDone = assert.async();
		this.gantt = GanttQUnitUtils.createGantt(false);//Create new instance of the Gantt Chart
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				var aAllNonExpandedShapeUids = [
					"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
					"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
					"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
					"PATH:3|SCHEME:default[0]|DATA:/tree/rows/3[3]",
					"PATH:4|SCHEME:default[0]|DATA:/tree/rows/4[4]",
					"PATH:5|SCHEME:default[0]|DATA:/tree/rows/5[5]",
					"PATH:6|SCHEME:default[0]|DATA:/tree/rows/6[6]",
					"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
				];
				GanttUtils.getShapesWithUid(this.gantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var currentText = document.getElementsByClassName("sapGanttTextNoPointerEvents")[index];
					assert.equal( (oShape.getDomRef().x.baseVal.value + oShape.getDomRef().width.baseVal.value - 2).toFixed(2), parseFloat((currentText.getAttribute("x"))).toFixed(2), "Text " + oShape.getTitle() + " is added at the end of the shape.");
				});
				fnDone();
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	QUnit.test("Shape texts in RTL Mode horizontalTextAlignment = Start - IE", function (assert) {
		var fnDone = assert.async();
		var bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		this.gantt = GanttQUnitUtils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						connectable: true,
						horizontalTextAlignment: "Start"
					})
				]
			})
		);//Create new instance of the Gantt Chart
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				var aAllNonExpandedShapeUids = [
					"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
					"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
					"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
					"PATH:3|SCHEME:default[0]|DATA:/tree/rows/3[3]",
					"PATH:4|SCHEME:default[0]|DATA:/tree/rows/4[4]",
					"PATH:5|SCHEME:default[0]|DATA:/tree/rows/5[5]",
					"PATH:6|SCHEME:default[0]|DATA:/tree/rows/6[6]",
					"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
				];
				GanttUtils.getShapesWithUid(this.gantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var currentText = document.getElementsByClassName("sapGanttTextNoPointerEvents")[index];
					assert.equal(oShape.getParent().getDomRef().querySelector(".sapGanttTextNoPointerEvents").getAttribute("text-anchor"), "end", "textAnchor changes to End in IE.");
					assert.equal( (oShape.getDomRef().x.baseVal.value + oShape.getDomRef().width.baseVal.value - 2).toFixed(2), parseFloat((currentText.getAttribute("x"))).toFixed(2), "Text " + oShape.getTitle() + " is added at the end of the shape.");
				});
				Device.browser.msie = bOriginalMsie;
				fnDone();
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	QUnit.test("Shape texts in RTL Mode horizontalTextAlignment = End - IE", function (assert) {
		var fnDone = assert.async();
		var bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		this.gantt = GanttQUnitUtils.createGantt(false, new GanttRowSettings({
			rowId: "{Id}",
			shapes1: [
				new BaseRectangle({
					shapeId: "{Id}",
					time: "{StartDate}",
					endTime: "{EndDate}",
					title: "{Name}",
					fill: "#008FD3",
					selectable: true,
					connectable: true,
					horizontalTextAlignment: "End"
				})
			]
		}));//Create new instance of the Gantt Chart
		GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				var aAllNonExpandedShapeUids = [
					"PATH:0|SCHEME:default[0]|DATA:/tree/rows/0[0]",
					"PATH:1|SCHEME:default[0]|DATA:/tree/rows/1[1]",
					"PATH:2|SCHEME:default[0]|DATA:/tree/rows/2[2]",
					"PATH:3|SCHEME:default[0]|DATA:/tree/rows/3[3]",
					"PATH:4|SCHEME:default[0]|DATA:/tree/rows/4[4]",
					"PATH:5|SCHEME:default[0]|DATA:/tree/rows/5[5]",
					"PATH:6|SCHEME:default[0]|DATA:/tree/rows/6[6]",
					"PATH:7|SCHEME:default[0]|DATA:/tree/rows/7[7]"
				];
				GanttUtils.getShapesWithUid(this.gantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var currentText = document.getElementsByClassName("sapGanttTextNoPointerEvents")[index];
					assert.equal(oShape.getParent().getDomRef().querySelector(".sapGanttTextNoPointerEvents").getAttribute("text-anchor"), "start", "textAnchor changes to Start in IE.");
					assert.equal( (oShape.getDomRef().x.baseVal.value + 2).toFixed(2), parseFloat((currentText.getAttribute("x"))).toFixed(2), "Text " + oShape.getTitle() + " is added at the end of the shape.");
				});
				Device.browser.msie = bOriginalMsie;
				fnDone();
			}.bind(this), 500); // Upated time to 500 ms to wait for the Gantt to complete loading and Table to update its rows.
		}.bind(this));
	});

	//qunits for testing align shapes value
    QUnit.module("GanttChart Tasks", {
        beforeEach: function() {
        },
        afterEach: function() {
			this.gantt.destroy();
        }
    });

    //qunit for alignShape as default
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be set as default which would be on middle", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20
			}),
			new Task({
                shapeId: "1",
                time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
                height: 20
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
					"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
                    var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
					assert.equal(currentText,true,"Default Shapes should be Aligned to the Middle");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

    //qunit for alignShape as botttom
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the bottom", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            }),
			new Task({
                shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
					"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) + (oShape._iBaseRowHeight / 2) - ((oShape.getPixelHeight() - oShape.getRowPadding()) / 2));
					assert.equal(currentText,true,"Shape Aligned to the Bottom");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

	//qunit for alignShape as top
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the top", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            }),
			new Task({
                shapeId: "1",
				time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
					"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) - (oShape._iBaseRowHeight / 2) + ((oShape.getPixelHeight() - oShape.getRowPadding()) / 2));
					assert.equal(currentText,true,"Shape Aligned to the Top");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

	//qunit for alignShape as center
    QUnit.test("Gantt Chart Tasks for SummaryExpanded and SummaryCollapsed should be alligned to the Middle", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "SummaryExpanded",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Middle
            }),
			new Task({
                shapeId: "1",
                time: Format.abapTimestampToDate("20181102000000"),
                endTime: Format.abapTimestampToDate("20181122000000"),
                type: "SummaryCollapsed",
				height: 20,
				alignShape : sap.gantt.simple.shapes.ShapeAlignment.Middle
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
					"PATH:row1|SCHEME:default[0]|DATA:/root/0[0]",
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[1]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
					assert.equal(currentText,true,"Shape Aligned to the Middle");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

    //qunit for type normal. It should always be middle aligned
    QUnit.test("Gantt Chart Tasks for type normal with Bottom Alignment", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Normal",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Bottom
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
					assert.equal(currentText,true,"Shape Aligned to the Middle");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

    //qunit for task for type error. It should always be middle aligned.
    QUnit.test("Gantt Chart Tasks for type error with Top Alignment", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Error",
                height: 20,
                alignShape : sap.gantt.simple.shapes.ShapeAlignment.Top
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
					assert.equal(currentText,true,"Shape Aligned to the Middle");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
    });

	//qunit with default align shape with type as error. It should be middle aligned
    QUnit.test("Gantt Chart Tasks for type error", function (assert) {
        var oShape = [
            new Task({
                shapeId: "0",
                time: Format.abapTimestampToDate("20181002000000"),
                endTime: Format.abapTimestampToDate("20181022000000"),
                type: "Error",
                height: 20
            })];
        this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181129000000");
        this.gantt.placeAt("qunit-fixture");
        var oGantt = this.gantt;
        var fnDone = assert.async();
        GanttQUnitUtils.waitForGanttRendered(oGantt).then(function () {
            setTimeout(function () {
                var aAllNonExpandedShapeUids = [
                    "PATH:row1|SCHEME:default[0]|DATA:/root/0[0]"
                ];
                GanttUtils.getShapesWithUid(oGantt.getId(), aAllNonExpandedShapeUids).forEach(function (oShape, index) {
					var iIndex = Device.browser.msie ? 1 : 0;
					var currentText = document.getElementsByClassName("sapGanttShapeOverlappingBorder")[index].attributes[iIndex].nodeValue.includes( (oShape.getRowYCenter()) );
					assert.equal(currentText,true,"Shape Aligned to the Middle");
                });
                fnDone();
            }.bind(this), 500); // need to wait because Table updates its rows async
        }.bind(this));
	});

	QUnit.module("GanttChart with fixed height", {
		beforeEach: function () {
			var oShape = [
				        new Task({
				            shapeId: "0",
				            time: Format.abapTimestampToDate("20181002000000"),
				            endTime: Format.abapTimestampToDate("20181022000000"),
				            type: "Error",
				            height: 20
				        })];
			this.gantt =  GanttQUnitUtils.createSimpleGantt(oShape, "20181001000000", "20181229000000");
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("GanttChart with fixed GanttChartWithTable height and visibleRowCountMode Auto", function (assert) {
		var fnDone = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.getAxisTimeStrategy().setVisibleHorizon(new TimeHorizon({
					startTime: "20181001000000",
					endTime: "20181129000000"
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function () {
						assert.ok("VisibleHorizon of the GanttChart is updated");
						this.gantt.getTable().setVisibleRowCountMode("Fixed");
						this.gantt.setHeight("200px");
						return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
							setTimeout(function () {
								var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
								var ganttDom = this.gantt.getSyncedControl().getDomRefs();
								var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
								var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
								assert.equal(this.gantt.getHeight(), "200px", "Height of the Gantt is set to 200px");
								assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
								assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
								this.gantt.getTable().setVisibleRowCountMode("Fixed");
								this.gantt.setHeight("300px");
								return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
									setTimeout(function () {
										var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
										var ganttDom = this.gantt.getSyncedControl().getDomRefs();
										var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
										var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
										assert.equal(this.gantt.getHeight(), "300px", "Height of the Gantt is set to 300px");
										assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
										assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
										this.gantt.getTable().setVisibleRowCountMode("Fixed");
										this.gantt.setHeight("370px");
										return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
											setTimeout(function () {
												var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
												var ganttDom = this.gantt.getSyncedControl().getDomRefs();
												var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
												var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
												assert.equal(this.gantt.getHeight(), "370px", "Height of the Gantt is set to 370px");
												assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
												assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
												this.gantt.getTable().setVisibleRowCountMode("Fixed");
												this.gantt.setHeight("400px");
												return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
													setTimeout(function () {
														var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
														var ganttDom = this.gantt.getSyncedControl().getDomRefs();
														var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
														var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
														assert.equal(this.gantt.getHeight(), "400px", "Height of the Gantt is set to 400px");
														assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
														assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
														this.gantt.getTable().setVisibleRowCountMode("Fixed");
														this.gantt.setHeight("500px");
														return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
															setTimeout(function () {
																var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
																var ganttDom = this.gantt.getSyncedControl().getDomRefs();
																var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
																var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
																assert.equal(this.gantt.getHeight(), "500px", "Height of the Gantt is set to 500px");
																assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
																assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
																this.gantt.getTable().setVisibleRowCountMode("Auto");
																this.gantt.getTable().setMinAutoRowCount(15);
																this.gantt.setHeight("200px");
																return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
																	setTimeout(function () {
																		var splitterHeight = parseInt(this.gantt.getAggregation("_splitter").getDomRef().querySelector(".sapUiLoSplitterBar").style.height,10);
																		var ganttDom = this.gantt.getSyncedControl().getDomRefs();
																		var GanttContainerHeight = parseInt(window.getComputedStyle(ganttDom.header).height,10) + parseInt(window.getComputedStyle(ganttDom.content).height,10) + parseInt(window.getComputedStyle(ganttDom.hsbContainer).height,10);
																		var scrollDisplayed = splitterHeight > GanttContainerHeight ? true : false;
																		assert.equal(this.gantt.getHeight(), "200px", "Height of the Gantt is set to 500px");
																		assert.equal(this.gantt.getTable().getVisibleRowCountMode(), "Auto", "VisibleRowCountMode is set to Auto");
																		assert.ok(scrollDisplayed, "GanttChart HorizontalScroll is visible");
																		fnDone();
																	}.bind(this), 500); // need to wait because Table updates its rows async
																}.bind(this));
															}.bind(this), 500); // need to wait because Table updates its rows async
														}.bind(this));
													}.bind(this), 500); // need to wait because Table updates its rows async
												}.bind(this));
											}.bind(this), 500); // need to wait because Table updates its rows async
										}.bind(this));
									}.bind(this), 500); // need to wait because Table updates its rows async
								}.bind(this));
							}.bind(this), 500); // need to wait because Table updates its rows async
						}.bind(this));
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("GanttChart Export Table to Excel - Export Popup, Export Button Positioning", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGanttWithOData();
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate scenarios for Export Button Positioning", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is false by default.");
				assert.equal(this.gantt.getTable().getExtension().length, 0, "Table doesnot have any extension. No export Button displayed.");
				this.dummyDownloadButton = new OverflowToolbarButton(this.gantt.getId() + "-dummyButton", {
					icon: "sap-icon://download",
					text: "DummyButton",
					tooltip: "DummyButton"
				});
				var oOverFlowToolBar = new OverflowToolbar();
				oOverFlowToolBar.addContent(this.dummyDownloadButton);
				this.gantt.getTable().addExtension(oOverFlowToolBar);

				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function () {
							assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is false by default.");
							assert.equal(this.gantt.getTable().getExtension().length, 1, "Table has extension created.");
							assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getText(), "DummyButton", "Table Dummy Download Button is created.");

							this.gantt.setShowExportTableToExcel(true);
							return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
								setTimeout(function () {
									assert.equal(this.gantt.getShowExportTableToExcel(), true, "ShowExportTableToExcel is changed to true.");
									assert.equal(this.gantt.getTable().getExtension()[0].getContent().length, 2, "Table has 2 extension.");
									assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getText(), "DummyButton", "Table Dummy Download Button is created.");
									assert.equal(this.gantt.getTable().getExtension()[0].getContent()[1].getTooltip(), "Export Table To Excel", "Table Export Button is created.");
									assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].getText(), "Export", "Table Export Menu Button is created.");
									assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].getText(), "Export As...", "Table Export Menu Button is created.");

									this.gantt.getTable().getExtension()[0].removeContent(0);
									return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
										setTimeout(function () {
											assert.equal(this.gantt.getShowExportTableToExcel(), true, "ShowExportTableToExcel is changed to true.");
											assert.equal(this.gantt.getTable().getExtension().length, 1, "Table has 1 extension.");
											assert.equal(this.gantt.getTable().getExtension()[0].getContent()[0].getTooltip(), "Export Table To Excel", "Table Export Button is present.");
											assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].getText(), "Export", "Table Export Menu Button is created.");
											assert.equal(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].getText(), "Export As...", "Table Export Menu Button is created.");

											this.gantt.setShowExportTableToExcel(false);
											return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
												setTimeout(function () {
													assert.equal(this.gantt.getShowExportTableToExcel(), false, "ShowExportTableToExcel is changed to false.");
													assert.equal(this.gantt.getTable().getExtension().length, 0, "Table doesnot have any extension.");
													done();
												}.bind(this), 500); // need to wait because Table updates its rows async
											}.bind(this));
										}.bind(this), 500); // need to wait because Table updates its rows async
									}.bind(this));
								}.bind(this), 500); // need to wait because Table updates its rows async
							}.bind(this));
						}.bind(this), 500); // need to wait because Table updates its rows async
					}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test('Validate Export Dialog Box for default Settings', function(assert) {
		var done = assert.async();

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt._getExportSettingsViaDialog( function(oExportSettingsDialog) {
					assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');
					var oExportButton = oExportSettingsDialog.getBeginButton();
					oExportButton.firePress();
					assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
					var oEndButton = oExportSettingsDialog.getEndButton();
					oEndButton.firePress();
				}).then(function(oUserConfig) {
					assert.equal(oUserConfig.fileName, "GanttTableExport", 'Promise returned with default filename Standard');
					assert.equal(oUserConfig.fileType[0].key, "xlsx", 'Promise returned with default fileType xlsx');
					done();
				});
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Validate Export Dialog Box for Custom filename Settings", function(assert) {
		var done = assert.async();

		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt._getExportSettingsViaDialog(function(oExportSettingsDialog) {
					var sLongFileName = 'TestFile';
					var oInput = sap.ui.getCore().byId(oExportSettingsDialog.getId() + '-fileName');
					oInput.setValue(sLongFileName);
					oInput.fireLiveChange({value: sLongFileName});
					assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');
					var oExportButton = oExportSettingsDialog.getBeginButton();
					oExportButton.firePress();
					assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
				}).then(function(oUserConfig) {
					assert.equal(oUserConfig.fileName, "TestFile", 'Promise returned with filename Standard');
					assert.equal(oUserConfig.fileType[0].key, "xlsx", 'Promise returned with fileType xlsx');
					done();
				});

			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("GanttChart Export Table to Excel - JSON Model", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGantt();
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate Table Export Button click", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setShowExportTableToExcel(true);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var exportTableButtonSpy = sinon.stub(this.gantt.oExportTableToExcelButton, "fireDefaultAction");
						var exportTableMenuButton1Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0], "firePress");
						var exportTableMenuButton2Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1], "firePress");
						this.gantt.oExportTableToExcelButton.getAggregation('_button').firePress();
						this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].firePress();
						this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].firePress();
						assert.ok(exportTableButtonSpy.calledOnce, "Export button Press is called once.");
						assert.equal(this.gantt.oExportTableToExcelButton.getAggregation('_button').getMetadata().getName() === 'sap.m.SplitButton', true, 'Split button.');
						assert.ok(this.gantt.oExportTableToExcelButton.getDomRef().classList.contains('sapMMenuBtnSplit'), 'Split button rendered.');
						assert.ok(exportTableMenuButton1Spy.calledOnce, "Export button Menu1 Press is called once.");
						assert.ok(exportTableMenuButton2Spy.calledOnce, "Export button Menu2 Press is called once.");
						exportTableButtonSpy.restore();
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Validate column configuration created for Table Export", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setShowExportTableToExcel(true);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var customDataCol1 = {key:"exportTableColumnConfig",value:{"columnKey": "Name", "leadingProperty":"Name", "dataType": "string", "wrap": true}};
						var customDataCol2 = {key:"exportTableColumnConfig",value:{"columnKey": "StartDate", "leadingProperty":"StartDate", "dataType": "date", "wrap": true, "displayFormat": "mmm dd, yyyy"}};
						this.gantt.getTable().getColumns()[0].addCustomData(new sap.ui.core.CustomData(customDataCol1));
						this.gantt.getTable().getColumns()[1].addCustomData(new sap.ui.core.CustomData(customDataCol2));
						var oColumns = this.gantt._createColumnConfig();
						for (var i = 0; i < oColumns.length; i++) {
							assert.equal(oColumns[i].label, this.gantt.getTable().getColumns()[i].getLabel().getText(),'Label has been set correctly for column ' + oColumns[i].label );
							assert.equal(oColumns[i].property, this.gantt.getTable().getColumns()[i].data("exportTableColumnConfig").leadingProperty,'Binding Property has been set correctly.');
							assert.ok(oColumns[i].type,'Type has been set correctly.');

							if (oColumns[i].type === "DateTime" || oColumns[i].type === "Date") {
								assert.ok(oColumns[i].format,'Date Format has been set correctly.');
							}
							if (oColumns[i].type === "Boolean") {
								assert.equal(oColumns[i].trueValue, "true",'Value has been set as true.');
								assert.equal(oColumns[i].falseValue, "false",'Value has been set as false.');
							}
							if (oColumns[i].type === "Currency") {
								assert.ok(oColumns[i].unitProperty,'Currency property has been set.');
								assert.equal(oColumns[i].displayUnit, true,'Display currency unit is true.');
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("GanttChart Export Table to Excel - ODATA Model", {
		beforeEach: function () {
			this.gantt = GanttQUnitUtils.createGanttWithOData();
			this.gantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Validate Table Export Button click", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function () {
				this.gantt.setShowExportTableToExcel(true);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var exportTableButtonSpy = sinon.stub(this.gantt.oExportTableToExcelButton, "fireDefaultAction");
						var exportTableMenuButton1Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[0], "firePress");
						var exportTableMenuButton2Spy = sinon.stub(this.gantt.oExportTableToExcelButton.getMenu().getItems()[1], "firePress");
						this.gantt.oExportTableToExcelButton.getAggregation('_button').firePress();
						this.gantt.oExportTableToExcelButton.getMenu().getItems()[0].firePress();
						this.gantt.oExportTableToExcelButton.getMenu().getItems()[1].firePress();
						assert.ok(exportTableButtonSpy.calledOnce, "Export button Press is called once.");
						assert.equal(this.gantt.oExportTableToExcelButton.getAggregation('_button').getMetadata().getName() === 'sap.m.SplitButton', true, 'Split button.');
						assert.ok(this.gantt.oExportTableToExcelButton.getDomRef().classList.contains('sapMMenuBtnSplit'), 'Split button rendered.');
						assert.ok(exportTableMenuButton1Spy.calledOnce, "Export button Menu1 Press is called once.");
						assert.ok(exportTableMenuButton2Spy.calledOnce, "Export button Menu2 Press is called once.");
						exportTableButtonSpy.restore();
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Validate column configuration created for Table Export", function (assert) {
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setShowExportTableToExcel(true);
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var oColumns = this.gantt._createColumnConfig();
						for (var i = 0; i < oColumns.length; i++) {
							assert.equal(oColumns[i].label, this.gantt.getTable().getColumns()[i].getLabel().getText(),'Label has been set correctly for column ' + oColumns[i].label );
							assert.equal(oColumns[i].property, this.gantt.getTable().getColumns()[i].data("exportTableColumnConfig").leadingProperty,'Binding Property has been set correctly.');
							assert.ok(oColumns[i].type,'Type has been set correctly.');

							if (oColumns[i].type === "DateTime" || oColumns[i].type === "Date") {
								assert.ok(oColumns[i].format,'Date Format has been set correctly.');
							}
							if (oColumns[i].type === "Boolean") {
								assert.equal(oColumns[i].trueValue, "true",'Value has been set as true.');
								assert.equal(oColumns[i].falseValue, "false",'Value has been set as false.');
							}
							if (oColumns[i].type === "Currency") {
								assert.ok(oColumns[i].unitProperty,'Currency property has been set.');
								assert.equal(oColumns[i].displayUnit, true,'Display currency unit is true.');
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	var fnCreateShapeBindingSettings = function(calendarName, isVisible) {
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
			],
			calendars: [
				new BaseCalendar({
					shapeId: "{Id}",
					calendarName : calendarName,
					visible: isVisible != null ? isVisible : true
				})
			]
		});
	};

	QUnit.module("GanttChart Validate CalendarDef", {
		afterEach: function () {
			this.gantt.destroy();
		}
	});

	QUnit.test("Check for CalendarDefs in key attribute", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_" + this.calendarName + ")", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_" + this.calendarName + "\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space at the beginning.", function (assert) {
		this.calendarName = " CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_%20" + this.calendarName.trim() + ")", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_%20" + this.calendarName.trim() + "\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in between.", function (assert) {
		this.calendarName = "Calendar Test";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									var acalendarName = this.calendarName.split(" ");
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_" + acalendarName[0] + "%20" + acalendarName[1] + ")", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_" + acalendarName[0] + "%20" + acalendarName[1] + "\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in the end.", function (assert) {
		this.calendarName = "CalendarTest ";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_" + this.calendarName.trim() + "%20)", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_" + this.calendarName.trim() + "%20\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for CalendarDefs in key attribute with space in multiple places.", function (assert) {
		this.calendarName = " Calendar Test ";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									var acalendarName = this.calendarName.split(" ");
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_%20" + acalendarName[1] + "%20" + acalendarName[2] + "%20)", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_%20" + acalendarName[1] + "%20" + acalendarName[2] + "%20\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for visibility property of BaseCalendar", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElement = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes;
						assert.ok(aGanttCalendarElement != null, "Base Calendar are visible.");
						for (var i = 0; i < aGanttCalendarElement.length; i++) {
							for (var j = 0; j < aGanttCalendarElement[i].style.length; j++) {
								if (aGanttCalendarElement[i].style[j] === "fill") {
									if (Device.browser.msie) {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(#" + this.gantt.sId + "_" + this.calendarName + ")", "Calendar Name is set correctly.");
									} else {
										assert.equal(aGanttCalendarElement[i].style.fill,
											"url(\"#" + this.gantt.sId + "_" + this.calendarName + "\")", "Calendar Name is set correctly.");
									}
								}
							}
						}
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.test("Check for visibility property of BaseCalendar", function (assert) {
		this.calendarName = "CalendarTest";
		this.gantt = GanttQUnitUtils.createGantt(false, fnCreateShapeBindingSettings(this.calendarName, false));
		this.gantt.placeAt("qunit-fixture");
		var done = assert.async();
		return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
			setTimeout(function(){
				this.gantt.setCalendarDef(new CalendarDefs({
					defs: [
							new Calendar({
							key: this.calendarName,
							color: "grey",
							timeIntervals: new TimeInterval({
								startTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getStartTime(),
								endTime: this.gantt.getAxisTimeStrategy().getVisibleHorizon().getEndTime()
							})
						})
					]
				}));
				return GanttQUnitUtils.waitForGanttRendered(this.gantt).then(function () {
					setTimeout(function(){
						var aGanttCalendarElementLength = this.gantt.getDomRef().querySelector(".sapGanttChartCalendar").childNodes.length;
						assert.equal(aGanttCalendarElementLength, 0, "Base Calendar are not visible.");
						done();
					}.bind(this), 500); // need to wait because Table updates its rows async
				}.bind(this));
			}.bind(this), 500); // need to wait because Table updates its rows async
		}.bind(this));
	});

	QUnit.module("Interaction - BaseShape", {
		beforeEach: function(){
			this.sut = GanttQUnitUtils.createGantt(true);
			this.sut.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttQUnitUtils.destroyGantt();
		},
		getFirstShape: function(){
			var oFirstShape = this.sut.getTable().getRows()[0].getAggregation("_settings").getShapes1()[0];
			return oFirstShape;
		},

		delayedAssert: function(fnAssertion) {
			setTimeout(function(){
				fnAssertion();
			}, 2000);
		}
	});

	QUnit.test("handleShapeMouseEnter", function(assert){
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(2);
			var oRect = this.getFirstShape();
			var mParam = {
				shape: oRect,
				ctrlOrMeta: false
			};

			this.sut.handleShapeMouseEnter(mParam);
			assert.strictEqual(oRect.getSelected(), false, "Shape is not selected and is hovered");

			oRect.setDraggable(true);
			this.sut.handleShapeMouseEnter(mParam);
			assert.strictEqual(document.body.style.cursor, "move", "Shape is draggable and is hovered. The cursor style is set to 'move'");
		}.bind(this));
	});
	QUnit.test("handleShapeMouseLeave", function(assert){
		this.sut.placeAt("qunit-fixture");
		return GanttQUnitUtils.waitForGanttRendered(this.sut).then(function () {
			assert.expect(2);
			var oRect = this.getFirstShape();
			var mParam = {
				shape: oRect,
				ctrlOrMeta: false
			};

			oRect.setDraggable(true);
			this.sut.handleShapeMouseEnter(mParam);
			assert.strictEqual(document.body.style.cursor, "move", "Shape is draggable and is hovered. The cursor style is set to 'move'");

			this.sut.handleShapeMouseLeave(mParam);
			assert.strictEqual(document.body.style.cursor, "default", "Cursor is moved out of the shape. The cursor style is set to 'default'");
		}.bind(this));
	});

	QUnit.module("Vertical Scrollbar Container Visibility for multiple gantt charts", {
		beforeEach: function() {
			this.oGanttChartContainer = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({label: "Name", template: "name"}),
								new Column({label: "Description", template: "description"})
							],
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							visibleRowCountMode: "Auto",
							minAutoRowCount: 3,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape1ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron1ID}",
									time: "{Chevron1StartDate}",
									endTime: "{Chevron1EndDate}",
									title: "{Chevron1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								}),
								shapes2: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: false
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					}),
					new GanttChartWithTable({
						table: new TreeTable({
							columns: [
								new Column({label: "Name", template: "name"}),
								new Column({label: "Description", template: "description"})
							],
							selectionMode: sap.ui.table.SelectionMode.Single,
							enableColumnReordering: true,
							expandFirstLevel: true,
							visibleRowCountMode: "Auto",
							minAutoRowCount: 3,
							rowSettingsTemplate: new GanttRowSettings({
								rowId: "{Shape2ID}",
								shapes1: new BaseChevron({
									shapeId: "{Chevron2ID}",
									time: "{Chevron2StartDate}",
									endTime: "{Chevron2EndDate}",
									title: "{Chevron2Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new ProportionZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20140628000000",
								endTime: "20170101000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20150101000000",
								endTime: "20150315000000"
							})
						})
					})
				]
			});
			var sHeight = "700px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttChartContainer]
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Chevron1ID: "0-0",
						Chevron1StartDate: new Date(2015, 4, 20),
						Chevron1EndDate: new Date(2015, 5, 21),
						Chevron1Desc: "Test Chevron 1",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2015, 2, 20),
						Rectangle1EndDate: new Date(2015, 3, 21),
						Rectangle1Desc: "Test Rectangle 1",
						Shape2ID: "1",
						Chevron2ID: "1-0",
						Chevron2StartDate: new Date(2015, 6, 20),
						Chevron2EndDate: new Date(2015, 7, 21),
						Chevron2Desc: "Test Chevron 2"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");
			return GanttQUnitUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		},
		afterEach: function(){
			this.oGanttChartContainer.destroy();
		},
		delayedAssert: function (fnAssertion, iMillisecond) {
			setTimeout(function () {
				fnAssertion();
			}, iMillisecond !== undefined ? iMillisecond : 500);
		}
	});

	QUnit.test("No vertical scrollbar for both the gantt charts", function (assert) {
		var done = assert.async();
		this.delayedAssert(function() {
			var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
			var oGantt2 = this.oGanttChartContainer.getGanttCharts()[1];
			var aClassList1 = oGantt1.getTable()._getScrollExtension().getVerticalScrollbar().classList;
			var aClassList2 = oGantt2.getTable()._getScrollExtension().getVerticalScrollbar().classList;
			assert.strictEqual(aClassList1.contains("sapUiTableHidden") && !aClassList1.contains("sapVerticalScrollBarContainer"), true, "Vertical scrollbar is not visible for 1st gantt chart");
			assert.strictEqual(aClassList2.contains("sapUiTableHidden") && !aClassList2.contains("sapVerticalScrollBarContainer"), true, "Vertical scrollbar is not visible for 2nd gantt chart");
			done();
		}.bind(this));
	});

	QUnit.test("Vertical scrollbar for 1st gantt chart and only vsb container for 2nd gantt chart", function (assert) {
		var done = assert.async();
		this.delayedAssert(function() {
			var oGantt1 = this.oGanttChartContainer.getGanttCharts()[0];
			oGantt1.setHeight("50%");
			this.delayedAssert(function() {
				var oGantt2 = this.oGanttChartContainer.getGanttCharts()[1];
				var aClassList1 = oGantt1.getTable()._getScrollExtension().getVerticalScrollbar().classList;
				var aClassList2 = oGantt2.getTable()._getScrollExtension().getVerticalScrollbar().classList;
				assert.strictEqual(!aClassList1.contains("sapUiTableHidden") && !aClassList1.contains("sapVerticalScrollBarContainer"), true, "Vertical scrollbar is visible for 1st gantt chart");
				assert.strictEqual(aClassList2.contains("sapUiTableHidden") && aClassList2.contains("sapVerticalScrollBarContainer"), true, "Only vertical scrollbar container is visible for 2nd gantt chart");
				done();
			}.bind(this));
		}.bind(this));
	});
});


