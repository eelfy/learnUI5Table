sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"./TimelineTestUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/Timeline"
], function ($, TestUtils, KeyCodes, createAndAppendDiv, JSONModel, Timeline) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 100%;");

	QUnit.module("TimelineTest");

	var aData = [
		{
			dateTime: new Date(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 3"
		}
	];

	var aData2 = [
		{
			dateTime: new Date(2016, 0, 1),
			title: "Item 1"
		}, {
			dateTime: new Date(2016, 0, 2),
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 4"
		}, {
			dateTime: new Date(2016, 0, 3),
			title: "Item 5"
		}
	];

	var aDataScroll = [
		{
			dateTime: new Date(2016, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: new Date(2016, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: new Date(2016, 1, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: new Date(2016, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: new Date(2017, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		},
		{
			dateTime: new Date(2019, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: new Date(2019, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: new Date(2019, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: new Date(2019, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: new Date(2018, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		},
		{
			dateTime: new Date(2018, 0, 1),
			visible: true,
			filterValue: "1",
			title: "Item 1"
		},
		{
			dateTime: new Date(2018, 0, 2),
			visible: false,
			filterValue: "1",
			title: "Item 2"
		}, {
			dateTime: new Date(2018, 0, 10),
			visible: true,
			filterValue: "3",
			title: "Item 3"
		}, {
			dateTime: new Date(2018, 1, 7),
			visible: true,
			filterValue: "4",
			title: "Item 4"
		}, {
			dateTime: new Date(2020, 8, 30),
			visible: true,
			filterValue: "5",
			title: "Item 5"
		}
	];

	var oOptions = {
		sortOldestFirst: true,
		showIcons: false
	};

	QUnit.test("Select fired by click", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Click should fire select with userAction = true");
		});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline.getContent()[0].$("outline").mousedown().mouseup().click();

		oTimeline.destroy();
	});

	QUnit.test("Enter key fires select", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ENTER;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapenter(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("Arrow key fires select without userAction", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oItem = oTimeline.getContent()[0];
		oItem.$("outline").mousedown().mouseup().click();
		oTimeline.attachSelect(function (oEvent) {
			assert.ok(!oEvent.getParameter("userAction"), "Enter should fire select with userAction = true");
		});
		var oEvent = $.Event("keypress");
		oEvent.which = KeyCodes.ARROW_DOWN;
		oEvent.target = oItem.getDomRef("outline");
		oTimeline.oItemNavigation.onsapnext(oEvent);

		oTimeline.destroy();
	});

	QUnit.test("BindingChange", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowing(true);
		oTimeline.setGrowingThreshold(2);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oTimeline._loadMore();
		sap.ui.getCore().applyChanges();

		// check load
		assert.equal(oTimeline.getContent().length, 4, "Items count");
		assert.equal(oTimeline._iItemCount, 4, "Items count");

		var oModel = new JSONModel({
			Items: aData
		});
		oTimeline.setModel(oModel);

		sap.ui.getCore().applyChanges();

		assert.equal(oTimeline._iItemCount, 2, "Items count");

		oTimeline.destroy();
	});

	QUnit.test("Grow on scroll", function (assert) {
		oOptions.lazyLoading = true;
		oOptions.growingThreshold = 5;
		var oTimeline = TestUtils.buildTimeline(aDataScroll, oOptions);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();
		var done = assert.async();

		var $Timeline = $('.sapSuiteUiCommonsTimelineContents');
		var oSpy = sinon.spy(Timeline.prototype, "_loadMore");
		$Timeline.scrollTop($('.sapSuiteUiCommonsTimelineContents')[0].scrollHeight);
		var iScrollPosition = $Timeline.scrollTop();
		sap.ui.getCore().applyChanges();

		setTimeout(function() {
			assert.equal(oSpy.called,true, "Load data is called");
			assert.equal($Timeline.scrollTop(), iScrollPosition, "Scroll postions is not changed after data is loaded");
			oTimeline.destroy();
			done();
		});
	});

	QUnit.test("Timeline Sort Icon Aria-Label Validation - sortOldestFirst: true", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, {sortOldestFirst: true, showIcons: true});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has default value as Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has value changed to Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Ascending.");

		oTimeline.destroy();
	});

	QUnit.test("Timeline Sort Icon Aria-Label Validation - sortOldestFirst: false", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData, {sortOldestFirst: false, showIcons: true});
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Ascending", "Tooltip has default value as Sort Ascending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Ascending", "aria-label has value as Sort Descending.");

		oTimeline._sortClick();
		sap.ui.getCore().applyChanges();
		assert.equal(oTimeline._objects.getSortIcon().getTooltip(), "Sort Descending", "Tooltip has value changed to Sort Descending.");
		assert.equal(oTimeline._objects.getSortIcon().getDomRef().getAttribute("aria-label"), "Sort Descending", "aria-label has value as Sort Descending.");

		oTimeline.destroy();
	});

	QUnit.test("Mannual size limit", function (assert) {
		var oTimeline = TestUtils.buildTimeline(aData2);
		oTimeline.setEnableScroll(false);
		oTimeline.setGrowing(true);
		oTimeline.setGrowingThreshold(2);

		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();



		var oModel1 = new JSONModel({
			Items: aData
		});
		var iManualSizeLimit = 2;
		oModel1.setSizeLimit(iManualSizeLimit);
		oTimeline.setModel(oModel1);

		sap.ui.getCore().applyChanges();

		assert.equal(oTimeline._getMaxItemsCount(), iManualSizeLimit);

		oTimeline.destroy();
	});

	QUnit.test("ariaLabelledBy for Timeline", function(assert) {
		var oLabel = new sap.m.Label({
			id: "testLabel",
			text: "Timeline ARIA-Label"
		});
		var oLabel2 = new sap.m.Label({
			id: "testLabel2",
			text: "Timeline ARIA-Label"
		});
		oLabel.placeAt("content");
		oLabel2.placeAt("content");
		var oTimeline = TestUtils.buildTimeline(aData, { sortOldestFirst: false, showIcons: true });
		oTimeline.addAriaLabelledBy(oLabel);
		oTimeline.placeAt("content");
		assert.equal(oTimeline.getAriaLabelledBy()[0], oLabel.sId, "ariaLabelledBy property is set for Timeline");
		oTimeline.addAriaLabelledBy(oLabel2);
		var aLabelIds = [];
		aLabelIds.push(oLabel.sId);
		aLabelIds.push(oLabel2.sId);
		assert.equal(oTimeline.getAriaLabelledBy().join(" "), aLabelIds.join(" "), "Multiple associations added to Timeline");
		oTimeline.removeAllAriaLabelledBy();
		assert.equal(oTimeline.getAriaLabelledBy().length, 0, "All ariaLabelledBy associations are removed using removeAllAriaLabelledBy()");
		oTimeline.destroy();
		oLabel.destroy();
		oLabel2.destroy();
	});

});
