/*global QUnit, sinon */

sap.ui.define([
	"sap/gantt/simple/ContainerToolbar",
	"sap/gantt/simple/GanttChartWithTable",
	"sap/gantt/simple/GanttChartContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseRectangle",
	"sap/ui/layout/SplitterLayoutData",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/table/TreeTable",
	"sap/ui/table/Column",
	"sap/m/Panel",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/misc/Format",
	"sap/gantt/config/SettingItem"
], function (
	ContainerToolbar,
	GanttChartWithTable,
	GanttChartContainer,
	GanttRowSettings,
	ProportionZoomStrategy,
	StepwiseZoomStrategy,
	FullScreenStrategy,
	TimeHorizon,
	BaseChevron,
	BaseRectangle,
	SplitterLayoutData,
	GanttUtils,
	TreeTable,
	Column,
	Panel,
	JSONModel,
	Format,
	SettingItem
) {
	"use strict";

	QUnit.module("Test Zoom Sync.", {
		beforeEach: function () {
			this.assertGanttChartsVisibleHorizon = function (assert) {
				var oAxisTimeStrategy1 = this.oGantt1.getAxisTimeStrategy();
				var oAxisTimeStrategy2 = this.oGantt2.getAxisTimeStrategy();

				var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
				var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
				this.assertVisibleHorizon(assert, oVisibleHorizon1, oVisibleHorizon2);
			};

			this.assertVisibleHorizon = function (assert, oVisibleHorizon1, oVisibleHorizon2) {
				assert.strictEqual(oVisibleHorizon1.getStartTime(), oVisibleHorizon2.getStartTime(), "Expect: " + oVisibleHorizon2.getStartTime() + "; Result:" + oVisibleHorizon1.getStartTime());
				assert.strictEqual(oVisibleHorizon1.getEndTime(), oVisibleHorizon2.getEndTime(), "Expect: " + oVisibleHorizon2.getEndTime() + "; Result:" + oVisibleHorizon1.getEndTime());
			};

			return this.fnCreateGanttContainer();
		},
		afterEach: function () {
			this.oGanttChartContainer.destroy();
			this.oGanttChartContainer = undefined;
			this.oToolbar = undefined;
			this.aGanttCharts =  undefined;
			this.oGantt1 = undefined;
			this.oGantt2 =  undefined;
		},
		fnCreateGanttContainer: function () {
			this.oGanttChartContainer = new GanttChartContainer("container", {
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
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

			this.oToolbar = this.oGanttChartContainer.getToolbar();
			this.oStatusBar = this.oGanttChartContainer.getStatusBar();
			this.oGanttChartContainer.setProperty("statusMessage","Testing Message property");
			this.aGanttCharts = this.oGanttChartContainer.getGanttCharts();
			this.oGantt1 = this.aGanttCharts[0];
			this.oGantt2 = this.aGanttCharts[1];
			this.oToolbar.insertSettingItem(new SettingItem("settings1", {
				key: "setting1",
				displayText: "Custom Setting1",
				checked: false
			}), 7);

			var sHeight = "500px";
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

			return GanttUtils.waitForGanttRendered(this.oGanttChartContainer.getGanttCharts()[0], true);
		},
		delayedAssert: function (fnAssertion, iMillisecond) {
			setTimeout(function () {
				fnAssertion();
			}, iMillisecond !== undefined ? iMillisecond : 500);
		}
	});

	 QUnit.test("Test statusMessage property on StatusBar" , function (assert) {
		this.oGanttChartContainer.msgText.setText("Testing Message property");
		assert.strictEqual(this.oGanttChartContainer.getStatusMessage(),this.oStatusBar.getItems()[0].getText(),"Message property is set");
	 });

	QUnit.test("Test StableID" , function (assert) {
		var done = assert.async();
		this.delayedAssert(function() {
			//OuterContainer
			assert.ok(this.oGanttChartContainer.getDomRef("ganttContainerContent"), "ContainerContent has StableID");
			assert.ok(this.oGanttChartContainer.getDomRef("ganttContainerSplitter"), "ContainerSplitter has StableID");
			//Toolbar
			assert.ok(this.oToolbar.getDomRef("toolbarSpacer"), "ToolBarSpacer has StableID");
			assert.ok(this.oToolbar.getDomRef("timeZoomFlexBox"), "Zoom FlexBox has StableID");
			assert.ok(this.oToolbar.getDomRef("zoomInButton"), "Zoom in button has StableID");
			assert.ok(this.oToolbar.getDomRef("zoomOutButton"), "Zoom out button has StableID");
			assert.ok(this.oToolbar.getDomRef("zoomSlider"), "Zoom slider has StableID");
			assert.ok(this.oToolbar.getDomRef("settingsButton"), "Settings button has StableID");
			assert.ok(this.oToolbar.getDomRef("birdEyeButton"), "birds eye button has StableID");
			assert.ok(this.oToolbar.getDomRef("displayTypeSegmentedButton"), "display type segmented button has StableID");
			var aSettingsItemsId = ["enableNowLineSettingItem", "enableCurserLineSettingItem", "enableVerticalLineSettingItem","enableAdhocLineSettingItem", "enableDeltaLineSettingItem", "enableNonWorkingTimeSettingItem", "enableTimeScrollSyncSettingItem","settings1","enableStatusBar"];
			var aSettingItemObj = this.oToolbar.getSettingItems();
			for (var i = 0; i < aSettingItemObj.length; i++) {
				assert.ok(aSettingItemObj[i].getId().indexOf(aSettingsItemsId[i]) > -1, "SettingsItems have Stable ID");
			}
			//GanttChartWithTable - 1
			assert.ok(this.oGantt1.getDomRef("ganttChartSplitter"), "GanttChartWithTable splitter has StableID");
			assert.ok(this.oGantt1.getDomRef("ganttBGFlexContainer"), "GanttChart FlexContainer has StableID");
			assert.ok(this.oGantt1.getDomRef("ganttBGContainerWithScrollBar"), "Gantt chart background container has StableID");
			assert.ok(this.oGantt1.getDomRef("ganttSyncedControlTable"), "Gantt chart synced control table area has StableID");
			assert.ok(this.oGantt1.getDomRef("ganttHeader"), "Gantt header has StableID");
			assert.ok(this.oGantt1.getDomRef("header-svg"), "Header SVG has StableID");
			assert.ok(this.oGantt1.getDomRef("sapGanttBackgroundTableContent"), "Gantt Chart Table background content has StableID");
			assert.ok(this.oGantt1.getDomRef("gantt"), "Background gantt has StableID");
			assert.ok(this.oGantt1.getDomRef("cnt"), "Background content has StableID");
			assert.ok(this.oGantt1.getDomRef("svg"), "Background content svg has StableID");
			assert.ok(this.oGantt1.getDomRef("helperDef-linePattern"), "Helper defs have StableID");
			assert.ok(this.oGantt1.getDomRef("bg"), "Gantt Chart background row/border has StableID");
			assert.ok(this.oGantt1.getDomRef("rowBackgrounds"), "Gantt Chart background row has StableID");
			assert.ok(this.oGantt1.getDomRef("rowBorders"), "Gantt Chart background row border has StableID");
			assert.ok(this.oGantt1.getDomRef("shapes"), "Gantt Chart shapes have StableID");
			assert.ok(this.oGantt1.getDomRef("horizontalScrollContainer"), "Gantt Chart horizontal scroll have StableID");
			assert.ok(this.oGantt1.getDomRef("sapGanttVerticalScrollBarContainer"), "Gantt Chart vertical scroll have StableID");
			//GanttChartWithTable - 2
			assert.ok(this.oGantt2.getDomRef("ganttChartSplitter"), "GanttChartWithTable splitter has StableID");
			assert.ok(this.oGantt2.getDomRef("ganttBGFlexContainer"), "GanttChart FlexContainer has StableID");
			assert.ok(this.oGantt2.getDomRef("ganttBGContainerWithScrollBar"), "Gantt chart background container has StableID");
			assert.ok(this.oGantt2.getDomRef("ganttSyncedControlTable"), "Gantt chart synced control table area has StableID");
			assert.ok(this.oGantt2.getDomRef("ganttHeader"), "Gantt header has StableID");
			assert.ok(this.oGantt2.getDomRef("header-svg"), "Header SVG has StableID");
			assert.ok(this.oGantt2.getDomRef("sapGanttBackgroundTableContent"), "Gantt Chart Table background content has StableID");
			assert.ok(this.oGantt2.getDomRef("gantt"), "Background gantt has StableID");
			assert.ok(this.oGantt2.getDomRef("cnt"), "Background content has StableID");
			assert.ok(this.oGantt2.getDomRef("svg"), "Background content svg has StableID");
			assert.ok(this.oGantt2.getDomRef("helperDef-linePattern"), "Helper defs have StableID");
			assert.ok(this.oGantt2.getDomRef("bg"), "Gantt Chart background row/border has StableID");
			assert.ok(this.oGantt2.getDomRef("rowBackgrounds"), "Gantt Chart background row has StableID");
			assert.ok(this.oGantt2.getDomRef("rowBorders"), "Gantt Chart background row border has StableID");
			assert.ok(this.oGantt2.getDomRef("shapes"), "Gantt Chart shapes have StableID");
			assert.ok(this.oGantt2.getDomRef("horizontalScrollContainer"), "Gantt Chart horizontal scroll have StableID");
			assert.ok(this.oGantt2.getDomRef("sapGanttVerticalScrollBarContainer"), "Gantt Chart vertical scroll have StableID");
			done();
		}.bind(this));
	});
	QUnit.test("Test initial visibleHorizonSync." , function (assert) {
		var done = assert.async();
		this.delayedAssert(function() {
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test time scroll sync." , function (assert) {
		var done = assert.async();
		var oHSB1 = this.oGantt1._getScrollExtension().getGanttHsb();
		oHSB1.scrollLeft = 1000;

		this.delayedAssert(function() {
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test bird eye." , function (assert) {
		var done = assert.async();
		this.oToolbar._oBirdEyeButton.firePress();

		this.delayedAssert(function() {
			var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

			assert.strictEqual(oVisibleHorizon1.getStartTime().substr(0,8), "20150519");
			assert.strictEqual(oVisibleHorizon1.getEndTime().substr(0,8), "20150821");
			assert.strictEqual(oAxisTimeStrategy1.bBirdEyeTriggered === undefined, true, "bBirdEyeTriggered should not defined in propotion zoom strategy");
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this));
	});

	QUnit.test("Test kept visible horizon when resize container" , function (assert) {
		var done = assert.async();

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();

		this.oGanttChartContainer.getParent().setHeight("800px");
		this.delayedAssert(function() {
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();

			this.assertVisibleHorizon(assert, oVisibleHorizon1, oOldVisibleHorizon);
			this.assertGanttChartsVisibleHorizon(assert);
			done();
		}.bind(this), 1000);
	});

	QUnit.test("Test kept zoom rate when resize column" , function (assert) {
		var done = assert.async();

		var oAxisTimeStrategy1 =  this.oGantt1.getAxisTimeStrategy();
		var oAxisTimeStrategy2 =  this.oGantt2.getAxisTimeStrategy();

		var oOldVisibleHorizon = oAxisTimeStrategy1.getVisibleHorizon();
		var fOldZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

		this.oGantt1.getTable().getColumns()[1].setWidth("150px");
		this.oGantt2.getTable().getColumns()[1].setWidth("150px");
		this.delayedAssert(function() {
			var oVisibleHorizon1 = oAxisTimeStrategy1.getVisibleHorizon();
			var oVisibleHorizon2 = oAxisTimeStrategy2.getVisibleHorizon();
			var fCurrentZoomRate = oAxisTimeStrategy1.getAxisTime().getZoomRate();

			assert.strictEqual(fOldZoomRate, fCurrentZoomRate);
			assert.strictEqual(oVisibleHorizon1.getStartTime(), oOldVisibleHorizon.getStartTime());
			assert.strictEqual(oVisibleHorizon2.getStartTime(), oOldVisibleHorizon.getStartTime());
			done();
		}, 1000);
	});

	QUnit.test("Test zoom control sync." , function (assert) {
		var oZoomOutButton = this.oToolbar._oZoomOutButton;
		var oZoomSlider = this.oToolbar._oZoomSlider;
		var oZoomInButton = this.oToolbar._oZoomInButton;

		oZoomInButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomSlider.setValue(3);
		this.assertGanttChartsVisibleHorizon(assert);

		oZoomOutButton.firePress();
		this.assertGanttChartsVisibleHorizon(assert);
	});

	QUnit.test("Test enableNowLine." , function (assert) {
		this.oGanttChartContainer.setEnableNowLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[0];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableNowLine(), false);
		assert.strictEqual(this.oGantt2.getEnableNowLine(), false);
	});

	QUnit.test("Test enableCursorLine." , function (assert) {
		this.oGanttChartContainer.setEnableCursorLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[1];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableCursorLine(), false);
		assert.strictEqual(this.oGantt2.getEnableCursorLine(), false);
	});

	QUnit.test("Test enableVerticalLine." , function (assert) {
		this.oGanttChartContainer.setEnableVerticalLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[2];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableVerticalLine(), false);
		assert.strictEqual(this.oGantt2.getEnableVerticalLine(), false);
	});

	QUnit.test("Test enableAdhocLine." , function (assert) {
		this.oGanttChartContainer.setEnableAdhocLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[3];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableAdhocLine(), false);
		assert.strictEqual(this.oGantt2.getEnableAdhocLine(), false);
	});

	QUnit.test("Test enableDeltaLine." , function (assert) {
		this.oGanttChartContainer.setEnableDeltaLine(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[4];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableDeltaLine(), false);
		assert.strictEqual(this.oGantt2.getEnableDeltaLine(), false);
	});

	QUnit.test("Test enableTimeScrollSync property" , function (assert) {
		this.oGanttChartContainer.setEnableTimeScrollSync(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableTimeScrollSynx = aSettingItems[6];
		assert.strictEqual(oEnableTimeScrollSynx.getSelected(), false);
	});

	QUnit.test("Test enableNonWorkingTime." , function (assert) {
		this.oGanttChartContainer.setEnableNonWorkingTime(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableNonWorkingTime = aSettingItems[5];
		assert.strictEqual(oEnableNonWorkingTime.getSelected(), false);

		assert.strictEqual(this.oGantt1.getEnableNonWorkingTime(), false);
		assert.strictEqual(this.oGantt2.getEnableNonWorkingTime(), false);
	});

	QUnit.test("Test hideSettingsItem." , function (assert) {
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		this.oGanttChartContainer.setHideSettingsItem(['enableNowLine','enableDeltaLine']);
		this.oGanttChartContainer.observePropertiesChanges();
		var hiddenItems = this.oGanttChartContainer.getHideSettingsItem();
		aSettingItems.forEach(function(oCheckBox){
			hiddenItems.forEach(function(item){
				if (oCheckBox.getName().endsWith(item)){
					assert.strictEqual(oCheckBox.getVisible(),false,"visibility of " + item + " set to false");
				}
			 });
		 });
	});

	QUnit.test("Test custom setting item." , function (assert) {
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oCustomSettingItem = aSettingItems[7];
		assert.strictEqual(oCustomSettingItem.getSelected(), false);
		assert.strictEqual(this.oToolbar.mSettingsConfig.setting1, false);

		var done = assert.async();

		this.oToolbar._oSettingsButton.firePress();

		setTimeout(function(){
			assert.ok(this.oToolbar._oSettingsDialog.getDomRef() !== null);

			var oSettingItems = this.oToolbar._oSettingsBox.getItems();
			assert.equal(oSettingItems.length, 9);
			assert.equal(Object.keys(this.oToolbar.mSettingsConfig).length, 9);
			oSettingItems[7].setSelected(true);
			var sSettingDialogID = this.oToolbar._oSettingsDialog.getId();
			sap.ui.getCore().byId(sSettingDialogID + "-acceptbutton").firePress();
			setTimeout(function(){
				assert.equal(Object.keys(this.oToolbar.mSettingsConfig).length, 9);
				assert.equal(oSettingItems[7].getSelected(), true);
				assert.equal(this.oToolbar.mSettingsConfig.setting1, true);
				done();
			}.bind(this),500);
		}.bind(this), 500);
	});

	QUnit.test("Test enableStatusBar." , function (assert) {
		this.oGanttChartContainer.setEnableStatusBar(false);
		var aSettingItems = this.oToolbar._oSettingsBox.getItems();
		var oEnableStatusBar = aSettingItems[8];
		assert.strictEqual(oEnableStatusBar.getSelected(), false);
	});

	QUnit.module("Shared Properties Sync", {
		beforeEach: function() {
			this.oContainer = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable("gantt1", {
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					}),
					new GanttChartWithTable("gantt2",{
						table: new sap.ui.table.Table({
							rowSettingsTemplate: new sap.gantt.simple.GanttRowSettings()
						})
					})
				]
			});
		},
		afterEach: function(){
			this.oContainer.destroy();
		},

		assertGanttPropertyEquals: function(assert, sProperty, bValue) {
			this.oContainer.getGanttCharts().forEach(function(oGantt) {
				var sMsg = "property: " + sProperty + "is set correctly on Gantt: " + oGantt.getId();
				assert.strictEqual(oGantt.getProperty(sProperty), bValue, sMsg);
			});
		}
	});

	QUnit.test("Test shared property values is set on child Gantt Chart", function(assert) {
		var fnTestCase = function(sProperty, bValue) {
			this.oContainer["set" + jQuery.sap.charToUpperCase(sProperty)](bValue);
			this.assertGanttPropertyEquals(assert, sProperty, bValue);
		}.bind(this);

		var sProperty = "enableCursorLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableNowLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableAdhocLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableDeltaLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableVerticalLine";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);

		sProperty = "enableNonWorkingTime";
		fnTestCase(sProperty, false);
		fnTestCase(sProperty, true);
	});

	QUnit.test("Gantt chart shared property dominated by container", function(assert) {
		var oLastRemovedGantt = this.oContainer.removeGanttChart(1);

		assert.ok(oLastRemovedGantt.getEnableCursorLine(), "the enableCursorLine is true by default");
		this.oContainer.setEnableCursorLine(false);
		var fnInvalidateGantt = sinon.spy(oLastRemovedGantt, "invalidate");
		this.oContainer.addGanttChart(oLastRemovedGantt);
		assert.ok(fnInvalidateGantt.notCalled, "Invalidate Gantt not called");
		assert.notOk(oLastRemovedGantt.getEnableCursorLine(), "now enableCursorLine is false because property value on container changed");
	});

	QUnit.module("gantt chart layout on empty Container", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				layoutOrientation: "Vertical"
			});
		},
		afterEach: function(){
			this.sut.destroy();
		}
	});
	QUnit.test("The container has correct default value on property", function(assert){
		var sOrientation = this.sut.getLayoutOrientation();
		assert.strictEqual(sOrientation, sap.ui.core.Orientation.Vertical, "Default splitter orientation is Vertical");
		assert.strictEqual(sOrientation, this.sut._oSplitter.getOrientation(), "Inner splitter has the same value");
	});

	QUnit.test("layoutOrientation value synced between splitter", function(assert){
		this.sut.setLayoutOrientation("Horizontal");
		assert.strictEqual(this.sut.getLayoutOrientation(), "Horizontal", "property value changed");
		assert.strictEqual(this.sut._oSplitter.getOrientation(), "Horizontal", "splitter property value changed");
	});

	QUnit.module("gantt chart layout data", {
		beforeEach: function(){
			this.sut = new GanttChartContainer({
				ganttCharts: [
					new GanttChartWithTable({
						layoutData: new SplitterLayoutData({size: "60%", minSize: 500})
					}),
					new GanttChartWithTable()
				]
			});
		},
		afterEach: function() {
			this.sut.destroy();
		}
	});

	QUnit.test("layoutData cloned to splitter content", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		assert.ok(aContents.length === this.sut.getGanttCharts().length, "contents length equals");
		assert.ok(aContents[0].isA("sap.gantt.control.AssociateContainer"), "contentArea aggregation has AssociateContainer type");

		// first gantt chart layout data cloned to splitter first content
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "size propogated to splitter content");
		assert.strictEqual(aContents[0].getLayoutData().getMinSize(), 500, "size propogated to splitter content");

		assert.strictEqual(aContents[1].getLayoutData().getSize(), "auto", "a default LayoutData is initialized by default");

		assert.ok(this.sut.getGanttCharts()[0].isA("sap.gantt.simple.GanttChartWithTable"), "ganttCharts aggregation stay still");
	});

	QUnit.test("layoutData changed on GanttChartWithTable", function(assert){
		var aContents = this.sut._oSplitter.getContentAreas();

		// Action: update size only
		this.sut.getGanttCharts()[0].getLayoutData().setSize("800px");
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "60%", "update the size won't propogated to container");

		// replace the layoutData
		this.sut.getGanttCharts()[0].setLayoutData(new SplitterLayoutData({size: "800px"}));
		assert.strictEqual(aContents[0].getLayoutData().getSize(), "800px", "size updated on splitter as well");
	});

	QUnit.module("Single gantt");

	QUnit.test("selectionPanelSize should work in chart container as well", function (assert) {
		var oGantt = GanttUtils.createGantt(true);
		oGantt.setSelectionPanelSize("77px"); // 60px is minimum so we have to set more
		var oContainer = new GanttChartContainer({
			ganttCharts: [oGantt]
		});
		oContainer.placeAt("qunit-fixture");
		return GanttUtils.waitForGanttRendered(oGantt).then(function () {
			assert.strictEqual(oGantt.getSelectionPanelSize(), "77px", "Selection panel size should be 77px.");
			oContainer.destroy();
		});
	});

	QUnit.module("Zoom buttons Enable/Disable", {
		beforeEach: function(){
			this.oGantt = GanttUtils.createGantt(true);
			this.oContainer = new GanttChartContainer({
				toolbar: new ContainerToolbar(),
				ganttCharts: [this.oGantt]
			});
			this.oContainer.placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oContainer.destroy();
		}
	});

	QUnit.test("Zoom out disable for proportion strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomOutButton = oToolBar._oZoomOutButton;
			assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom in disable for proportion strategy", function (assert) {
		var fnDone = assert.async();
		this.oGantt.setAxisTimeStrategy(new ProportionZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
			setTimeout(function () {
				this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
					setTimeout(function () {
						var oToolBar = this.oContainer.getToolbar();
						var oZoomInButton = oToolBar._oZoomInButton;
						assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
						fnDone();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Zoom out disable for stepwise strategy", function (assert) {
		var fnDone = assert.async();
		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				this.oGantt.getAxisTimeStrategy().setZoomLevel(0);
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
					setTimeout(function () {
						var oToolBar = this.oContainer.getToolbar();
						var oZoomOutButton = oToolBar._oZoomOutButton;
						assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
						fnDone();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Zoom in disable for stepwise strategy", function (assert) {
		var fnDone = assert.async();
		this.oGantt.setAxisTimeStrategy(new StepwiseZoomStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function () {
				this.oGantt.getAxisTimeStrategy().setZoomLevel(9);
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function() {
					setTimeout(function () {
						var oToolBar = this.oContainer.getToolbar();
						var oZoomInButton = oToolBar._oZoomInButton;
						assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
						fnDone();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Zoom out disable for fullscreen strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			})
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomOutButton = oToolBar._oZoomOutButton;
			assert.strictEqual(oZoomOutButton.getEnabled(), false, "Zoom out button is disabled");
		}.bind(this));
	});

	QUnit.test("Zoom in disable for fullscreen strategy", function (assert) {
		this.oGantt.setAxisTimeStrategy(new FullScreenStrategy({
			totalHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			visibleHorizon: new TimeHorizon({
				startTime: "20160501000000",
				endTime: "20170901000000"
			}),
			zoomLevel: 9
		}));
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var oToolBar = this.oContainer.getToolbar();
			var oZoomInButton = oToolBar._oZoomInButton;
			assert.strictEqual(oZoomInButton.getEnabled(), false, "Zoom in button is disabled");
		}.bind(this));
	});

	QUnit.module("Test Bird Eye", {
		beforeEach: function () {
			return this.fnCreateGanttContainer();
		},
		afterEach: function () {
			this.oGanttStepWiseContainer.destroy();
			this.oGanttStepWiseContainer = undefined;
			this.oGantt = undefined;
		},
		fnCreateGanttContainer: function () {
			this.oGanttStepWiseContainer = new GanttChartContainer("containerStepwise", {
				toolbar: new ContainerToolbar({
					showBirdEyeButton: true,
					showDisplayTypeButton: true,
					showLegendButton: true,
					content: [
						new sap.m.Text({
							text: "This is gantt toolbar--"
						})
					]
				}),
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
								shapes1: new BaseRectangle({
									shapeId: "{Rectangle1ID}",
									time: "{Rectangle1StartDate}",
									endTime: "{Rectangle1EndDate}",
									title: "{Rectangle1Desc}",
									fill: "#0092D1",
									countInBirdEye: true
								})
							})
						}).bindRows("/root"),
						axisTimeStrategy: new StepwiseZoomStrategy({
							totalHorizon: new TimeHorizon({
								startTime: "20160501000000",
								endTime: "20170901000000"
							}),
							visibleHorizon: new TimeHorizon({
								startTime: "20160501000000",
								endTime: "20170901000000"
							})
						})
					})
				]
			});

			this.oGantt = this.oGanttStepWiseContainer.getGanttCharts()[0];

			var sHeight = "500px";
			document.getElementById("qunit-fixture").style.height = sHeight;
			var oPanel = new Panel({
				height: sHeight,
				content: [this.oGanttStepWiseContainer]
			});

			var oData = {
				root : {
					name: "root",
					description: "root description",
					0: {
						name: "item1",
						description: "item1 description",
						Shape1ID: "0",
						Rectangle1ID: "0-1",
						Rectangle1StartDate: new Date(2016, 2, 20),
						Rectangle1EndDate: new Date(2017, 9, 21),
						Rectangle1Desc: "Test Rectangle 1"
					}
				}
			};

			var oModel = new JSONModel();
			oModel.setData(oData);
			oPanel.setModel(oModel);

			oPanel.placeAt("qunit-fixture");

			return GanttUtils.waitForGanttRendered(this.oGanttStepWiseContainer.getGanttCharts()[0], true);
		}
	});

	QUnit.test("Test bird eye with stepwise zoom strategy." , function (assert) {
		var oAxisTimeStrategy = this.oGantt.getAxisTimeStrategy();
		oAxisTimeStrategy.setZoomLevel(0);
		var oToolBar = this.oGanttStepWiseContainer.getToolbar();
		var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
		var oRectangleShape = oRowSettings.getShapes1()[0];
		var oVisibleHorizon = oAxisTimeStrategy.getVisibleHorizon();
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getTime()).substr(0,8) >= oVisibleHorizon.getStartTime().substr(0,8), true, "Visible horizon start time should be less than shape start time");
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getEndTime()).substr(0,8) <= oVisibleHorizon.getEndTime().substr(0,8), true, "Visible horizon end time should be greater than shape end time");
		assert.strictEqual(oToolBar.getZoomLevel() === 0, true, "Zoom level should be zero");
		assert.strictEqual(oAxisTimeStrategy.bBirdEyeTriggered === undefined, true, "bBirdEyeTriggered should be undefined before bird eye triggered");
		oToolBar._oBirdEyeButton.firePress();
		assert.strictEqual(oAxisTimeStrategy.bBirdEyeTriggered === false, true, "bBirdEyeTriggered should be false");
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getTime()).substr(0,8) >= oVisibleHorizon.getStartTime().substr(0,8), true, "Shape start time should be greater than Visible horizon start time");
		assert.strictEqual(Format.dateToAbapTimestamp(oRectangleShape.getEndTime()).substr(0,8) <= oVisibleHorizon.getEndTime().substr(0,8), true, "Shape end time should be less than Visible horizon end time");
		assert.strictEqual(oToolBar.getZoomLevel() != 0, true, "Zoom level has been changed.");
	});
});
