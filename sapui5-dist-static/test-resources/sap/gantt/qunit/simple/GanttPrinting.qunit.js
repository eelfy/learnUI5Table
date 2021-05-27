/* global QUnit */

sap.ui.define([
	"sap/gantt/misc/Format",
	"sap/gantt/simple/GanttPrinting",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/core/Core",
	"sap/ui/test/actions/Press",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (Format, GanttPrinting, utils, Core, Press, Filter, FilterOperator, Sorter) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.sut = new GanttPrinting();
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Default dialog options", function (assert) {
		assert.deepEqual(this.sut._oModel.getData(), {
			"compressionQuality": 75,
			"cropMarks": false,
			"cropMarksOffset": 11.34,
			"cropMarksWeight": 0.25,
			"duration": "all",
			"endDate": this.sut._oModel.getProperty("/endDate"),
			"exportAll": true,
			"exportAsJPEG": true,
			"exportRange": "",
			"footerText": "",
			"headerText": "",
			"lastPageNumber": undefined,
			"marginBottom": 18.9,
			"marginLeft": 18.9,
			"marginLocked": false,
			"marginRight": 18.9,
			"marginTop": 18.9,
			"marginType": "default",
			"multiplePage": true,
			"paperHeight": GanttPrinting._oPaperSizes.A4.height,
			"paperSize": "A4",
			"paperWidth": GanttPrinting._oPaperSizes.A4.width,
			"portrait": true,
			"previewPageNumber": 1,
			"repeatSelectionPanel": false,
			"scale": 100,
			"showFooterText": false,
			"showHeaderText": false,
			"showPageNumber": false,
			"startDate": this.sut._oModel.getProperty("/startDate"),
			"unit": "mm"
		}, "Default dialog options should be correct.");
	});

	QUnit.module("Rendering", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(true, null, true);

			// limit the total horizon to prevent Gantt being too large
			var oTotalHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon();
			var oVisibleHorizon = this.oGantt.getAxisTimeStrategy().getVisibleHorizon();
			var dNewTotalStartTime = Format.abapTimestampToDate(oVisibleHorizon.getStartTime());
			var dNewTotalEndTime = Format.abapTimestampToDate(oVisibleHorizon.getEndTime());
			dNewTotalStartTime.setDate(-7);
			dNewTotalEndTime.setDate(dNewTotalStartTime.getDate() + 7);

			oTotalHorizon.setStartTime(dNewTotalStartTime);
			oTotalHorizon.setEndTime(dNewTotalEndTime);

			// set fixed width to prevent different Gantt rendering on different window size
			document.getElementById("qunit-fixture").style.width = "1920px";
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("PDF Export dialog - open and change duration", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			// expand all rows
			this.oGantt.getTable().expandToLevel(1);

			return utils.waitForGanttRendered(this.oGantt).then(function () {
				this.sut = new GanttPrinting({
					ganttChart: this.oGantt
				});
				return this.sut.open().then(function () {
					Core.applyChanges();

					var iCurrentPages = this.sut._getPagesInARow();
					// Assert 1 (Dialog opened and loaded)
					assert.strictEqual(
						this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
						"The text between the page number buttons should be correct."
					);
					assert.ok(
						this.sut._ganttChartClone.getInnerGantt().$("svg").find(".rowBackgrounds").children().size() >= 24,
						"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded)."
					);
					assert.strictEqual(
						this.sut._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().size(), 24,
						"Cloned Gantt should have 24 shapes rendered."
					);

					// change the Duration option to the Next Week
					var fnPress = new Press();
					fnPress.executeOn(this.sut._oComboBoxDuration);
					fnPress.executeOn(this.sut._oComboBoxDuration._getList().getItems()[1]); // Next Week

					return utils.waitForGanttRendered(this.sut._ganttChartClone).then(function () {
						return new Promise(function (fnResolve) {
							// wait for the busy indicator of the canvas preview
							var iIntervalId = setInterval(function () {
								if (!this.sut._oFlexBoxPreview.isBusy()) {
									clearInterval(iIntervalId);
									fnResolve();
								}
							}.bind(this), 100);
						}.bind(this)).then(function () {
							var iCurrentPages = this.sut._getPagesInARow();
							// Assert 2 (Dialog preview is updated after duration was changed to the Next Week)
							assert.strictEqual(
								this.sut._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages,
								"The text between the page number buttons should be correct after setting duration to the next week."
							);
							assert.ok(
								this.sut._ganttChartClone.getInnerGantt().$("svg").find(".rowBackgrounds").children().size() >= 24,
								"Cloned Gantt should have at least 24 rows rendered (8 + 16 expanded) after setting duration to the next week."
							);
							// assert for the number of shapes would be here if someone manages to write it
							resetGanttPrinting(this.sut);
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Table Binding", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var iCurrentPages = this.printGantt._getPagesInARow();
				assert.ok(this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding != null, "The binding of the table has been updated accordingly.");
				assert.strictEqual(this.printGantt._oDialog.getContent()[0].getItems()[0].getItems()[2].getItems()[2].getText(), "1 of " + iCurrentPages, "The text between the page number buttons should be correct.");
				assert.strictEqual(this.printGantt._ganttChartClone.getInnerGantt().$("svg").find(".sapGanttChartShapes").children().size(), 8, "Cloned Gantt should have 8 shapes rendered.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Missing Filter and sorter parameter", function (assert) {
		var oGanttAxisStrategyHorizon = this.oGantt.getAxisTimeStrategy().getTotalHorizon(),
			fromDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getStartTime()),
			toDateFilter = Format.abapTimestampToDate(oGanttAxisStrategyHorizon.getEndTime()),
			oFilter = new Filter({
					path: "StartDate",
					operator: FilterOperator.BT,
					value1: fromDateFilter,
					value2: toDateFilter
			}),
			oSorter = new Sorter("StartDate", true),
			sCustomParams = "$select=MaintenanceOrder,MaintenanceOrderDesc,MaintenanceOrderInternalID,OrderStartDateTime,OrderEndDateTime,ProcessingStatus,ProcessingStatusText,OrderOperationRowLevel,OrderOperationParentRowID,OrderOperationRowID,OrderOperationIsExpanded,MaintOrderRoutingNumber,LatestAcceptableCompletionDate,MainWorkCenter,MaintPriority,MaintPriorityDesc,FunctionalLocationName,FunctionalLocation";
		this.oGantt.getTable().getBinding("rows").filter(oFilter, sap.ui.model.FilterType.Application);
		this.oGantt.getTable().getBinding("rows").sort(oSorter);
		this.oGantt.getTable().getBinding("rows")['sCustomParams'] = sCustomParams;
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding = null;
			return this.printGantt.open().then(function () {
				var sCustomParamsCloned = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.sCustomParams;
				assert.deepEqual(sCustomParamsCloned, sCustomParams, "The binding has the correct custom params applied.");
				var oPrintGanttFilter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aApplicationFilters;
				assert.deepEqual(oPrintGanttFilter[0], oFilter, "The binding has the correct filter applied.");
				var oPrintGanttSorter = this.printGantt._ganttChartClone.getTable().getBindingInfo("rows").binding.aSorters[0];
				assert.deepEqual(oPrintGanttSorter, oSorter, "The binding has the correct sorter applied.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("PDF Export - Validate Scale Level of Gantt Chart", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			this.printGantt = new GanttPrinting({
				ganttChart: this.oGantt
			});
			return this.printGantt.open().then(function () {
				assert.equal(this.printGantt._oGanttCanvas.width, parseFloat(this.printGantt._oGanttCanvas.style.width) * 2, "Canvas Width of html2canvas has been scaled by 2.");
				assert.equal(this.printGantt._oGanttCanvas.height, parseFloat(this.printGantt._oGanttCanvas.style.height) * 2, "Canvas Height of html2canvas has been scaled by 2.");
				resetGanttPrinting(this.printGantt);
			}.bind(this));
		}.bind(this));
	});

	//Function to reset the GanttChart Printing parameters.
	function resetGanttPrinting(gantt){
		gantt._ganttChartClone.destroy();
		gantt._ganttChartContainer.destroy();
		document.body.removeChild(gantt._oClonedGanttDiv);
		gantt._oDialog.close();
		gantt._oDialog.destroy();
		gantt.destroy();
	}
});