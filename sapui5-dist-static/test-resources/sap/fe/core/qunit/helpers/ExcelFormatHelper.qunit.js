/* global QUnit */
sap.ui.define(["sap/fe/core/helpers/ExcelFormatHelper"], function(ExcelFormatHelper) {
	"use strict";
	QUnit.module("Excel Format checks on Date/Time/DateTime dataTypes");

	QUnit.test("Get excel format for a Date property from JS Date", function(assert) {
		assert.equal(ExcelFormatHelper.getExcelDatefromJSDate(), "mmm d, yyyy", "Date Format for excel = mmm d, yyyy");
	});
	QUnit.test("Get excel format for a DateTime property from JS DateTime", function(assert) {
		assert.equal(
			ExcelFormatHelper.getExcelDateTimefromJSDateTime(),
			"mmm d, yyyy, h:mm:ss AM/PM",
			"DateTime Format for excel = mmm d, yyyy, h:mm:ss AM/PM"
		);
	});
	QUnit.test("Get excel format for a Time property from JS Time", function(assert) {
		assert.equal(ExcelFormatHelper.getExcelTimefromJSTime(), "h:mm:ss AM/PM", "Time Format for excel = h:mm:ss AM/PM");
	});
});
