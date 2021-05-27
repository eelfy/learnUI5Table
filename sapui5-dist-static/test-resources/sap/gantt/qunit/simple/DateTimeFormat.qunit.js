/*global QUnit */
sap.ui.getCore().getConfiguration().getFormatSettings().setDatePattern("short", "dd.MM.yyyy");
sap.ui.getCore().getConfiguration().getFormatSettings().setTimePattern("short", "hh:mm a");
sap.ui.define(["sap/gantt/library"], function(library){
	"use strict";
	QUnit.test("test for date format", function (assert) {
		var tickTimeIntervalDefinition = library.config.DEFAULT_TIME_ZOOM_STRATEGY;
		var date = new Date(2015, 10, 2, 14, 10, 0, 0);

		//for largeInterval
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["5year"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 5year format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1year"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 1year format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["6month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2015", "Test 6month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1month"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1month format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1week"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1week format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ format: tickTimeIntervalDefinition["1day"]["largeInterval"].format }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November 2015", "Test 1day format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["12hour"]["largeInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02.11.2015", "Test 12hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1hour"]["largeInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02.11.2015", "Test 1hour format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["30min"]["largeInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02.11.2015", "Test 30min format: largeInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["5min"]["largeInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02.11.2015", "Test 5min format: largeInterval");

		//for smallInterval
		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["5min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02:10 PM", "Test 5min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["30min"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02:10 PM", "Test 30min format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02:10 PM", "Test 1hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["12hour"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "02:10 PM", "Test 12hour format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1day"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1day format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1week"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1week format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "2.11.", "Test 1month format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["6month"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November", "Test 6month format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["1year"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November", "Test 1year format: smallInterval");

		oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: tickTimeIntervalDefinition["5year"]["smallInterval"].pattern }, new sap.ui.core.Locale("en"));
		assert.strictEqual(oFormat.format(date), "November", "Test 5year format: smallInterval");

	});
});
