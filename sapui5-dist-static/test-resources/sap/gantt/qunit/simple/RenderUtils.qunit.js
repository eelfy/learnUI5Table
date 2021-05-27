/* eslint-disable no-extra-bind */
/*global QUnit */
sap.ui.define([
	"sap/gantt/simple/RenderUtils",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/UtilizationLineChart",
	"sap/gantt/simple/BaseChevron",
	"sap/gantt/simple/BaseShape",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/BaseLine",
	"sap/gantt/simple/shapes/Task",
	"sap/ui/core/Core",
	"sap/gantt/library"
], function(RenderUtils,
	GanttRowSettings,
	GanttUtils,
	BaseGroup,
	UtilizationLineChart,
	BaseChevron,
	BaseShape,
	BaseText,
	BaseRectangle,
	BaseLine,
	Task,
	Core,
	library
	) {
	"use strict";

	var verticalTextAlignment = library.simple.verticalTextAlignment;
	var horizontalTextAlignment = library.simple.horizontalTextAlignment;

	QUnit.module("RenderUtils.pushOrUnshift");

	QUnit.test("Item is prepended at the beginning of the given array when bUnshift is set to true ", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["a", "b", "c"];

		RenderUtils.pushOrUnshift(aArray, "a", true);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the beginning of the array.");
	});

	QUnit.test("Item is prepended at the end of the given array when bUnshift is undefined", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["b", "c", "d"];

		RenderUtils.pushOrUnshift(aArray, "d", undefined);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the end of the array.");
	});

	QUnit.test("Item is prepended at the end of the given array when bUnshift is set to false", function (assert) {
		var aArray = ["b", "c"];
		var aExpectedArray = ["b", "c", "d"];
		RenderUtils.pushOrUnshift(aArray, "d", false);

		assert.deepEqual(aArray, aExpectedArray, "Item was inserted at the end of the array.");
	});

	var fn1, fn2, fn3, fn4;
	QUnit.module("RenderUtils.createOrderedListOfRenderFunctions", {
		before: function() {
			fn1 = function(){};
			fn2 = function(){};
			fn3 = function(){};
			fn4 = function(){};
		},
		after: function() {
			fn1 = undefined;
			fn2 = undefined;
			fn3 = undefined;
			fn4 = undefined;
		}
	});

	QUnit.test("When bUnshift is undefined, then the item is added at the end of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2}
		];
		var aExpectedOrderedList = [
			fn1, fn2
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The item was put at the end of the array");
	});

	QUnit.test("When bUnshift is set to true, then the item is put at the beginning of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn2, fn1
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The item was put at the beginning of the array");
	});

	QUnit.test("When bUnshift is true, then the last item is put at the beginning of the array", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2},
			{fnCallback: fn3},
			{fnCallback: fn4, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn4, fn1, fn2, fn3
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "The last item was put at the beginning of the array");
	});

	QUnit.test("When bUnshift set to true for the fn2 and fn4, then fn2 will be second and fn4 will be the first in the ordered array.", function(assert) {
		var aTemplateForOrderedRenderFunctions = [
			{fnCallback: fn1},
			{fnCallback: fn2, bUnshift: true},
			{fnCallback: fn3},
			{fnCallback: fn4, bUnshift: true}
		];
		var aExpectedOrderedList = [
			fn4, fn2, fn1, fn3
		];

		var aOrderedList = RenderUtils.createOrderedListOfRenderFunctionsFromTemplate(
			aTemplateForOrderedRenderFunctions
		);

		assert.deepEqual(aOrderedList, aExpectedOrderedList, "List of functions was ordered according to the given template");
	});

	var ProjectUtilization = BaseGroup.extend("sap.gantt.simple.test.ProjectUtilization", {
		metadata: {
			aggregations: {
				utilizationLine: {
					type: "sap.gantt.simple.UtilizationLineChart",
					multiple: false,
					sapGanttOrder: 1
				},
				chevron: {
					type: "sap.gantt.simple.BaseChevron",
					multiple: false,
					sapGanttLazy: true
				}
			}
		}
	});

	QUnit.module("RenderUtils.setSpecialProperties", {
		beforeEach: function() {
			this.oGantt = GanttUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new ProjectUtilization({
						utilizationLine: new UtilizationLineChart(),
						chevron: new BaseChevron()
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
		},
		afterEach: function() {
			GanttUtils.destroyGantt();
		}
	});

	QUnit.test("When main row shape is an instance of utilization chart reduce height by a pixel ", function (assert) {
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			var aRowStates = this.oGantt.getSyncedControl().getRowStates();
			var oRowSetting = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
			var mPosition = RenderUtils.calcRowDomPosition(oRowSetting, aRowStates);
			var oShape = oRowSetting.getShapes1()[0];
			assert.deepEqual(mPosition.rowHeight - 1 , oShape._iBaseRowHeight, "Main row height reduced by a pixel");
		}.bind(this));
	});

	QUnit.module("RenderUtils.renderElementTitle", {
		beforeEach: function() {
			this.sText = "abcdefg1234567890";
			this.oText = new BaseText({
				x: 100
			});
			this.oShape = new BaseShape({
				title: this.sText,
				horizontalTextAlignment: horizontalTextAlignment.Start,
				verticallTextAlignment: verticalTextAlignment.Center,
				textRepetition: false
			});
			this.oRectangle = new BaseRectangle({
				width: 50
			});
			this.mTextSettings = {
				title: "",
				textAnchor: "",
				verticallTextAlignment: "",
				textRepetition: false
			};
			this.oRm = Core.getRenderManager();
			this.oTitle = new BaseText(this.mTextSettings);
			this.oTitle.addStyleClass("sapGanttTextNoPointerEvents");
			this.oTitle.setProperty("childElement", true, true);
		},
		afterEach: function() {
			this.sText = null;
			this.oText = null;
			this.oShape = null;
			this.oRectangle = null;
			this.mTextSettings = null;
			this.oRm = null;
			this.oTitle = null;
			Core.getConfiguration().setRTL(false);
		}
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Start", function (assert) {
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(false);
		var iCornerPaddingPixel = 2;
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is Start");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test(" Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Start", function (assert) {
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(true);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is Start" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is End", function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.End;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(false);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is End", function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.End;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(true);
		var iCornerPaddingPixel = 2;
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is End");
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Middle", function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Middle;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(false);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(125, this.oText.getX() + this.oRectangle.getWidth() / 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Middle", function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Middle;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(true);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(125, this.oText.getX() + this.oRectangle.getWidth() / 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is End" );
		assert.ok(this.oTitle.hasStyleClass("sapGanttTextNoPointerEvents"), "oTitle contains sapGanttTextNoPointerEvents Style Class");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is false and horizontalTextAlignment is Ribbon/any", function (assert) {
		this.oShape.horizontalTextAlignment = horizontalTextAlignment.Ribbon;
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(false);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(148, this.oText.getX() + this.oRectangle.getWidth() - 2, "X coordinate is valid when RTL mode is false and horizontalTextAlignment is Ribbon");
		assert.ok(RenderUtils.renderRepetitiveTextLTR.call, "The renderer's renderRepetitiveTextLTR function is called");
	});

	QUnit.test("Validate x coordinate for text when RTL mode is true and horizontalTextAlignment is Ribbon/any", function (assert) {
		this.oShape.horizontalTextAlignment = "horizontalTextAlignment.Ribbon";
		this.mTextSettings.textAnchor = this.oShape.horizontalTextAlignment;
		var iCornerPaddingPixel = 2;
		this.oTitle.setTextAnchor(this.mTextSettings.textAnchor);
		Core.getConfiguration().setRTL(true);
		this.oTitle.renderElement(this.oRm, this.oTitle);
		assert.strictEqual(102, this.oText.getX() + iCornerPaddingPixel, "X coordinate is valid when RTL mode is true and horizontalTextAlignment is Ribbon");
		assert.ok(RenderUtils.renderRepetitiveTextRTL.call, "The renderer's renderRepetitiveTextRTL function is called");
	});

	QUnit.module("RenderUtils.setVerticalAlignment", {
		beforeEach: function() {
			this.sText = "abcdefg1234567890";
			this.iDefaultFontSize = 12;
			this.oShape = new BaseShape({
				title: this.sText,
				rowYCenter: 8.88,
				verticalTextAlignment: "Center",
				height: 10
			});
			this.oText = new BaseText({
				y: 100
			});
			this.mTextSettings = {
				y: 0,
				verticallTextAlignment: ""
			};
			this.height = "8.88";
		},
		afterEach: function() {
			this.sText = null;
			this.oText = null;
			this.oShape = null;
			this.mTextSettings = null;
			this.height = null;
			Core.getConfiguration().setRTL(false);
		}
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Top", function (assert) {
		this.oShape.verticalTextAlignment = "Top";
		this.mTextSettings.verticalTextAlignment = this.oShape.verticalTextAlignment;
		assert.strictEqual(100, this.oText.getY() + parseInt(this.height, 10) - this.iDefaultFontSize / 1.5, "Y coordinate is valid when verticalTextAlignment is Top" );
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Bottom", function (assert) {
		this.oShape.verticalTextAlignment = "Bottom";
		this.mTextSettings.verticalTextAlignment = this.oShape.verticalTextAlignment;
		assert.strictEqual(16.880000000000003, this.oShape.getRowYCenter() + this.iDefaultFontSize / 1.5, "Y coordinate is valid when verticalTextAlignment is Bottom" );
	});

	QUnit.test("Validate y coordinate when verticalTextAlignment is Center/any", function (assert) {
		this.mTextSettings.verticalTextAlignment = this.oShape.verticalTextAlignment;
		assert.strictEqual(13.68, this.oShape.getRowYCenter() + this.iDefaultFontSize / 2.5, "Y coordinate is valid when verticalTextAlignment is Center/any" );
	});

	QUnit.module("RenderUtils.renderRepetitiveTextLTR", {
		beforeEach: function() {
			this.sText = "Test text";
			this.oShape = new BaseShape({
			});
			this.oText = new BaseText({
				x: 100
			});
			this.mTextSettings = {
				x: 0,
				textAnchor: "",
				text: this.sText
			};
		},
		afterEach: function() {
			this.sText = null;
			this.oText = null;
			this.oShape = null;
			this.mTextSettings = null;
			Core.getConfiguration().setRTL(false);
		}
	});

	QUnit.test("Validate repetitive text when RTL mode is true", function (assert) {
		Core.getConfiguration().setRTL(true);
		this.mTextSettings.textAnchor = "Start";
		var whiteSpaces = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
		assert.strictEqual('Test text' + whiteSpaces + 'Test text', this.mTextSettings.text + Array(10).fill('\xa0').join('')  + this.mTextSettings.text, "Rendered text is repetitive with spaces in between when RTL mode is true");
		assert.strictEqual(91, this.oText.getX() - this.mTextSettings.text.length, "Rendered text length is x coordinate minus text length");
	});

	QUnit.test("Validate repetitive text when RTL mode is false", function (assert) {
		Core.getConfiguration().setRTL(false);
		this.mTextSettings.textAnchor = "Start";
		var whiteSpaces = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
		assert.strictEqual('Test text' + whiteSpaces + 'Test text', this.mTextSettings.text + Array(10).fill('\xa0').join('')  + this.mTextSettings.text, "Rendered text is repetitive with spaces in between when RTL mode is false");
		assert.strictEqual(109, this.oText.getX() + this.mTextSettings.text.length, "Rendered text length is x coordinate plus text length");
	});

	QUnit.module("Text alignment - when xBias and yBias are set", {
		beforeEach: function() {
			this.oGantt = GanttUtils.createGantt(true, new GanttRowSettings({
				rowId: "row01",
				shapes1: [
					new BaseRectangle({
						title: "row01",
						time: new Date(2021, 1, 20),
						endTime:  new Date(2021, 2, 20)
					})
				]
			}), true);
			this.oGantt.placeAt("qunit-fixture");
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Test text alignment with xBias and yBias in non RTL mode", function (assert) {
		var done = assert.async();
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				this.oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
				this.oBaseRectangle = this.oRowSettings.getShapes1()[0];
				this.oText = this.oRowSettings.getDomRef().querySelector("g > text");
				var nPrevTextX = this.oText.getAttribute("x"),
					nPrevTextY = this.oText.getAttribute("y");
				this.oBaseRectangle.setXBias(10);
				this.oBaseRectangle.setYBias(-5);
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						var nCurTextX = this.oText.getAttribute("x"),
							nCurTextY = this.oText.getAttribute("y");
						assert.equal(nCurTextX - nPrevTextX, 10, "Text x coordinate aligned with the shape");
						assert.equal(nCurTextY - nPrevTextY, -5, "Text y coordinate aligned with the shape");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Test text alignment with xBias and yBias in RTL mode", function (assert) {
		var done = assert.async();
		Core.getConfiguration().setRTL(true);
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				this.oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
				this.oBaseRectangle = this.oRowSettings.getShapes1()[0];
				this.oText = this.oRowSettings.getDomRef().querySelector("g > text");
				var nPrevTextX = this.oText.getAttribute("x"),
					nPrevTextY = this.oText.getAttribute("y");
				this.oBaseRectangle.setXBias(10);
				this.oBaseRectangle.setYBias(-5);
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						this.oNewText = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getDomRef().querySelector("g > text");
						var nCurTextX = this.oNewText.getAttribute("x"),
							nCurTextY = this.oNewText.getAttribute("y");
						assert.equal(nPrevTextX - nCurTextX, 10, "Text x coordinate aligned with the shape");
						assert.equal(nPrevTextY - nCurTextY, 5, "Text y coordinate aligned with the shape");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.module("RenderUtils.renderElementAnimation", {
		beforeEach: function() {
        },
        afterEach: function() {
			this.oGantt.destroy();
        }
	});

	QUnit.test("Shape flickering enable/disable", function (assert) {
		var done = assert.async();
		this.mAnimationSettings = {
			values: "#800;#f00;#800;#800",
			duration: "2s",
			repeatCount: "indefinite"
		};
		this.oGantt = GanttUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new BaseRectangle({
					animationSettings: this.mAnimationSettings,
					time: new Date(2021, 1, 20),
					endTime:  new Date(2021, 2, 20),
					showAnimation: true
				}),
				new BaseChevron({
					animationSettings: this.mAnimationSettings,
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 2, 20),
					showAnimation: true
				}),
				new BaseText({
					animationSettings: this.mAnimationSettings,
					text: "abcdefg1234567890",
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 2, 20),
					showAnimation: true
				}),
				new BaseLine({
					x1: 413.87,
					y1: 30,
					x2: 413.87,
					y2: 40
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var mAnimationSettings = {
					values: "#800;#f00;#800;#800",
					duration: "2s",
					repeatCount: "indefinite"
				};
				var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
				var oBaseRectangle = oRowSettings.getShapes1()[0],
					oBaseChevron = oRowSettings.getShapes1()[1],
					oBaseText = oRowSettings.getShapes1()[2],
					oBaseLine = oRowSettings.getShapes1()[3];
				oBaseLine.setAnimationSettings(mAnimationSettings);
				oBaseLine.setShowAnimation(true);
				assert.deepEqual(oBaseRectangle.getAnimationSettings(), mAnimationSettings, "animationSettings property is set for the shape");
				assert.strictEqual(oBaseRectangle.getShowAnimation(), true, "Show animation is set to true for the shape");
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						assert.strictEqual(oBaseRectangle.getDomRef().childNodes[0].tagName, "animate", "BaseRectangle contains animate element");
						assert.strictEqual(oBaseChevron.getDomRef().childNodes[0].tagName, "animate", "BaseChevron contains animate element");
						assert.strictEqual(oBaseText.getDomRef().childNodes[0].tagName, "animate", "BaseText contains animate element");
						assert.strictEqual(oBaseLine.getDomRef().childNodes[0].tagName, "animate", "BaseLine contains animate element");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Shape flickering disabled when animationSettings values property don't exists", function (assert) {
		var done = assert.async();
		this.mAnimationSettings = {
			duration: "2s",
			repeatCount: "indefinite"
		};
		this.oGantt = GanttUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new BaseRectangle({
					animationSettings: this.mAnimationSettings,
					time: new Date(2021, 1, 20),
					endTime:  new Date(2021, 2, 20),
					showAnimation: true
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var oRowSettings = this.oGantt.getTable().getRows()[0].getAggregation("_settings");
				var oBaseRectangle = oRowSettings.getShapes1()[0];
				assert.strictEqual(oBaseRectangle.getShowAnimation(), true, "Show animation is set to true for the shape");
				return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
					setTimeout(function(){
						assert.strictEqual(oBaseRectangle.getDomRef().childNodes[0], undefined, "BaseRectangle do not contains animate element");
						done();
					}.bind(this), 500);
				}.bind(this));
			}.bind(this), 500);
		}.bind(this));
	});

	QUnit.test("Gantt chart tasks flickering enable/disable", function (assert) {
		var done = assert.async();
		this.oGantt = GanttUtils.createGantt(true, new GanttRowSettings({
			rowId: "row01",
			shapes1: [
				new Task({
					shapeId: "0",
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 3, 20),
					type: "SummaryExpanded",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "1",
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 3, 20),
					type: "SummaryCollapsed",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "2",
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 3, 20),
					type: "Normal",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				}),
				new Task({
					shapeId: "3",
					time: new Date(2021, 1, 20),
					endTime: new Date(2021, 3, 20),
					type: "Error",
					height: 20,
					animationSettings: {values:'#800;#f00;#800;#800'},
					showAnimation: true
				})
			]
		}), true);
		this.oGantt.placeAt("qunit-fixture");
		return GanttUtils.waitForGanttRendered(this.oGantt).then(function () {
			setTimeout(function(){
				var aShapes = this.oGantt.getTable().getRows()[0].getAggregation("_settings").getShapes1();
				aShapes.forEach(function(oShape) {
					var oShapeDom = oShape.getDomRef().querySelector("path > animate");
					assert.strictEqual(oShapeDom.tagName, "animate", oShape.getType() + " task contains the animate element");
					assert.strictEqual(oShapeDom.getAttribute("dur"), '1s', "animation duration is set");
					assert.strictEqual(oShapeDom.getAttribute("repeatCount"), 'indefinite', "repeatCount for animation is set");
				});
				done();
			}.bind(this), 500);
		}.bind(this));
	});
});
