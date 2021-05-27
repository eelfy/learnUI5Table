sap.ui.define([
	"sap/suite/ui/commons/TimelineItem",
	"sap/suite/ui/commons/Timeline",
	"sap/ui/core/Control",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/base/Object"
], function (TimelineItem, Timeline, Control, createAndAppendDiv, BaseObject) {
	"use strict";

	createAndAppendDiv("content").setAttribute("style", "height: 700px;");

	QUnit.module("TimelineItemTest");
	QUnit.test("getDateTime test", function (assert) {
		var oMockItem = {
				dateTime: new Date(),
				getProperty: function (sPropName) {
					if (sPropName !== "dateTime") {
						throw new Error("Cannot return property: " + sPropName);
					}
					return this.dateTime;
				}
			},
			fnGetDateTime = (new TimelineItem()).getDateTime.bind(oMockItem),
			iDateNumber = 1475154256914;
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Date type should be returned right away.");
		oMockItem.dateTime = iDateNumber;
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "Number date should be converted to date.");
		oMockItem.dateTime = "Date(" + iDateNumber + ")";
		assert.equal(typeof fnGetDateTime(), "object", "String date should be parsed to date.");
		assert.equal(fnGetDateTime().valueOf(), iDateNumber, "String date should be parsed to date.");

		oMockItem.dateTime = "incorrect 12345566";
		assert.equal(fnGetDateTime(), oMockItem.dateTime, "Mall formatted string should be returned as is.");
	});

	QUnit.test("Short text renders all.", function (assert) {
		var sText = Array(500).join("a");
		var oItem = new TimelineItem({
			text: sText
		});
		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		var renderedStr = oItem.$("realtext").text();
		assert.equal(renderedStr, sText, "Short text should render completely.");
		oItem.destroy();
	});

	QUnit.test("Long text renders partially.", function (assert) {
		var sText = Array(1000).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline(),
			sRenderedStr,
			$button;
		oItem._orientation = "H";
		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		sRenderedStr = oItem.$("realtext").text();
		assert.ok(sRenderedStr.length < sText.length, "Long text should be rendered partially.");
		assert.equal(sRenderedStr, sText.substr(0, sRenderedStr.length), "Rendered text should be a substring of the original text.");
		$button = oItem.$("fullTextBtn");
		assert.equal($button.size(), 1, "Show more button should be rendered.");

		$button.mousedown().mouseup().click();
		sap.ui.getCore().applyChanges();
		sRenderedStr = oItem._objects.getFullTextPopover().getContent()[0].getText();
		assert.equal(sRenderedStr, sText, "Popover text should have full text.");
		oTimeline.destroy();
	});


	QUnit.test("More & Less text renders in small size", function (assert) {
		var sText = Array(800).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline({
				alignment:"Right",
				textHeight:"7",
				width:"100px",
				height:"150px",
				content:[oItem]
			}),
			$button;
		oItem._orientation = "H";
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		$button = oItem.$("fullTextBtn");
		assert.ok($button.parent().is(":visible"), "Show more button should be visible.");
		oTimeline.destroy();
	});

	QUnit.test("More & Less text should not render in large size", function (assert) {
		var sText = Array(500).join("a"),
			oItem = new TimelineItem({
				text: sText
			}),
			oTimeline = new Timeline({
				alignment:"Right",
				textHeight:"7",
				width:"1000px",
				height:"1000px",
				content:[oItem]
			}),
			$button;
		oItem._orientation = "H";
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		$button = oItem.$("fullTextBtn");
		assert.notOk($button.parent().is(":visible"), "Show more button should not be visible.");
		oTimeline.destroy();
	});

	QUnit.test("Reply link.", function (assert) {
		var oTimeline = new Timeline({enableSocial: true}),
			oItem = new TimelineItem({replyCount: 3});
		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oItem.$("replyLink").text(), "Reply (3)", "Reply cound should be set.");
		oTimeline.destroy();
	});

	QUnit.test("Post reply.", function (assert) {
		var fnDone = assert.async(),
			sExpectedMessage = "Testing message",
			oTimeline = new Timeline({enableSocial: true}),
			oItem = new TimelineItem({
				replyPost: replyPost
			});

		function replyPost(oEvent) {
			assert.equal(oEvent.getParameter("value"), sExpectedMessage, "Generated message differs from input.");
			setTimeout(function () {
				oTimeline.destroy();
				fnDone();
			}, 0);
		}

		oTimeline.addContent(oItem);
		oTimeline.placeAt("content");
		sap.ui.getCore().applyChanges();

		oItem.$("replyLink").mousedown().mouseup().click();
		oItem._objects.getReplyPop().attachAfterOpen(function (oEvent) {
			var oInputArea = oItem._objects.getReplyInputArea();
			oInputArea.setValue(sExpectedMessage);

			setTimeout(function () {
				oItem.$("replyButton").mousedown().mouseup().click();
			}, 0);
		});
	});

	QUnit.test("User name click event works.", function (assert) {
		var fnDone = assert.async(),
			sUserName = "User Name",
			oItem = new TimelineItem({
				userNameClickable: true,
				userName: sUserName,
				userNameClicked: userNameClicked
			});

		function userNameClicked(oevent) {
			assert.ok(true, "User name clicked event raised.");
			assert.ok(oevent.getParameter("uiElement") instanceof Control, "Returned uiElement is Control.");
			oItem.destroy();
			fnDone();
		}

		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		oItem.$("userNameLink").mousedown().mouseup().click();
	});

	QUnit.test("Test default properties related to icon", function (assert) {
		var oItem = new TimelineItem();
		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getTooltip(), null);
		assert.ok(oIcon.getUseIconTooltip());
	});

	QUnit.test("Properties are passed to icon", function (assert) {
		var sExpectedIconId = "icon-01";
		var sExpectedTooltip = "Cool Tooltip 1";
		var oItem = new TimelineItem({
			icon: sExpectedIconId,
			iconTooltip: sExpectedTooltip,
			useIconTooltip: false
		});

		var oIcon = oItem._getLineIcon();

		assert.equal(oIcon.getSrc(), sExpectedIconId);
		assert.equal(oIcon.getTooltip(), sExpectedTooltip);
		assert.notOk(oIcon.getUseIconTooltip());
	});

	QUnit.test("Avatar properties are passed", function (assert) {
		var sExpectedIcon = "icon-01";
		var sExpectedTooltip = "User picture";
		var oItem = new TimelineItem({
			userPicture: sExpectedIcon,
			initials: "IT",
			displayShape: "Circle",
			displaySize: "XS"
		});

		oItem.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oIcon = oItem._getUserPictureControl();

		assert.equal(oIcon.getSrc(), sExpectedIcon);
		assert.equal(oIcon.getTooltip(), sExpectedTooltip);
		assert.equal(oIcon.getInitials(), "");
		assert.equal(oIcon.getDisplayShape(), "Circle");
		assert.equal(oIcon.getDisplaySize(), "XS");

		oItem.destroy();
	});

	QUnit.test("ariaLabelledBy for TimelineItem", function(assert) {
		var oLabel = new sap.m.Label({
			id: "testLabel",
			text: "TimelineItem ARIA-Label"
		});
		var oLabel2 = new sap.m.Label({
			id: "testLabel2",
			text: "TimelineItem ARIA-Label"
		});
		oLabel.placeAt("content");
		oLabel2.placeAt("content");
		var oItem = new TimelineItem({
			ariaLabelledBy: "testLabel"
		});
		oItem.placeAt("content");
		assert.equal(oItem.getAriaLabelledBy()[0], oLabel.sId, "ariaLabelledBy property is set for TimelineItem");
		oItem.addAriaLabelledBy(oLabel2);
		var labelSIds = [];
		labelSIds.push(oLabel.sId);
		labelSIds.push(oLabel2.sId);
		assert.equal(JSON.stringify(oItem.getAriaLabelledBy()), JSON.stringify(labelSIds), "Multiple associations added to TimelineItem");
		oItem.removeAllAriaLabelledBy();
		assert.equal(oItem.getAriaLabelledBy().length, 0, "All ariaLabelledBy associations are removed using removeAllAriaLabelledBy()");
		oItem.destroy();
		oLabel.destroy();
		oLabel2.destroy();
	});

	QUnit.test("setDateTime test with MilliSeconds", function (assert) {
		var oTimeLineItem = new TimelineItem();

		var sDateTime = "2020-01-01T15:29:04.";
		var sMilliSec = "";

		for ( var i = 0; i <= 10; i++ ) {
			sMilliSec = sMilliSec + i;
			oTimeLineItem.setDateTime(sDateTime + sMilliSec + "Z");
			createAsserts_setDateTime(assert, sDateTime, oTimeLineItem.getProperty("dateTime"), oTimeLineItem.getDateTime());
		}

		oTimeLineItem.destroy();
	});

	QUnit.test("setDateTime test.", function (assert) {
		var oTimeLineItem = new TimelineItem();

		var sDateTime = "2020-01-01T15:29:04";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem.getProperty("dateTime"), oTimeLineItem.getDateTime());

		sDateTime = "2020-01-01T15:29";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem.getProperty("dateTime"), oTimeLineItem.getDateTime());

		sDateTime = "2020-01-01";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem.getProperty("dateTime"), oTimeLineItem.getDateTime());

		sDateTime = "Date(1371020400000)";
		oTimeLineItem.setDateTime(sDateTime);
		createAsserts_setDateTime(assert, sDateTime, oTimeLineItem.getProperty("dateTime"), oTimeLineItem.getDateTime());

		oTimeLineItem.destroy();
	});

	//Function to create asserts for the SetDateTime Qunit
	function createAsserts_setDateTime(assert, sDateTime, oPropertyDateTime, oGetDateTime) {
		assert.ok(sDateTime, "Date is " + sDateTime);
		assert.ok(oPropertyDateTime instanceof Date, "Date should be parsed correctly." + oPropertyDateTime);
		assert.ok(oGetDateTime instanceof Date, "Date should be parsed correctly." + oGetDateTime);
	}

});
