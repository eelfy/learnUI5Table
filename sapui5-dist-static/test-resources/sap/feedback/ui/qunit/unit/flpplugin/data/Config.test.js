/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/data/Config",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(Config, Constants, sinon, sinonQunit) {
	"use strict";

	var S_Q_INTERNAL_URI = "QUALTRICSINTERNALURI.siteintercept"; //siteintercept";
	var S_Q_INTERNAL_SURVEY_URI = "QUALTRICSINTERNALURI.survey"; //survey";

	QUnit.module("Data-Config unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("Config init procedure");

	QUnit.test("ctor with dataformat v1", function(assert) {
		// arrangement
		var sGivenTenantId = "24345285898";
		var iGivenDataFormatV1 = Constants.E_DATA_FORMAT.version1;
		var iExpectedDisplayFormat = Constants.E_DISPLAY_FORMAT.popover;

		// action
		var oConfig = new Config(S_Q_INTERNAL_URI, sGivenTenantId, iGivenDataFormatV1);

		// assertions
		assert.equal(oConfig.getQualtricsUri(), S_Q_INTERNAL_URI);
		assert.equal(oConfig.getTenantId(), sGivenTenantId);
		assert.equal(oConfig.getDataFormat(), iGivenDataFormatV1);
		assert.equal(oConfig.getDisplayFormat(), iExpectedDisplayFormat);
	});

	QUnit.test("ctor with dataformat v2", function(assert) {
		// arrangement
		var sGivenTenantId = "24345285898";
		var iGivenDataFormatV2 = Constants.E_DATA_FORMAT.version2;
		var iExpectedDisplayFormat = Constants.E_DISPLAY_FORMAT.popover;

		// action
		var oConfig = new Config(S_Q_INTERNAL_URI, sGivenTenantId, iGivenDataFormatV2);

		// assertions
		assert.equal(oConfig.getQualtricsUri(), S_Q_INTERNAL_URI);
		assert.equal(oConfig.getTenantId(), sGivenTenantId);
		assert.equal(oConfig.getDataFormat(), iGivenDataFormatV2);
		assert.equal(oConfig.getDisplayFormat(), iExpectedDisplayFormat);
	});

	QUnit.test("ctor with url for iframe", function(assert) {
		// arrangement
		var sGivenTenantId = "24345285898";
		var iGivenDataFormatV2 = Constants.E_DATA_FORMAT.version2;
		var iExpectedDisplayFormat = Constants.E_DISPLAY_FORMAT.iframe;

		// action
		var oConfig = new Config(S_Q_INTERNAL_SURVEY_URI, sGivenTenantId, iGivenDataFormatV2);

		// assertions
		assert.equal(oConfig.getQualtricsUri(), S_Q_INTERNAL_SURVEY_URI);
		assert.equal(oConfig.getTenantId(), sGivenTenantId);
		assert.equal(oConfig.getDataFormat(), iGivenDataFormatV2);
		assert.equal(oConfig.getDisplayFormat(), iExpectedDisplayFormat);
	});

	QUnit.test("getter setter", function(assert) {
		// arrangement
		var sGivenTenantId = "24345285898";
		var iGivenDataFormatV1 = Constants.E_DATA_FORMAT.version1;
		var iGivenDataFormatV2 = Constants.E_DATA_FORMAT.version2;
		var iExpectedDisplayFormat = Constants.E_DISPLAY_FORMAT.popover;
		var sGivenTenantRole = "07";
		var bGivenIsPushEnabled = true;
		var sGivenPushChannelPath = "/sap/abc/def/endpoint";
		var sGivenProductName = "S/4HANA Cloud";
		var sGivenPlatformType = "S/4";

		// action
		var oConfig = new Config(S_Q_INTERNAL_URI, sGivenTenantId, iGivenDataFormatV1);
		oConfig.setTenantRole(sGivenTenantRole);
		oConfig.setIsPushEnabled(bGivenIsPushEnabled);
		oConfig.setPushChannelPath(sGivenPushChannelPath);
		oConfig.setDataFormat(iGivenDataFormatV2);
		oConfig.setProductName(sGivenProductName);
		oConfig.setPlatformType(sGivenPlatformType);

		// assertions
		assert.equal(oConfig.getQualtricsUri(), S_Q_INTERNAL_URI);
		assert.equal(oConfig.getTenantId(), sGivenTenantId);
		assert.equal(oConfig.getDataFormat(), iGivenDataFormatV2);
		assert.equal(oConfig.getDisplayFormat(), iExpectedDisplayFormat);
		assert.equal(oConfig.getTenantRole(), sGivenTenantRole);
		assert.equal(oConfig.getIsPushEnabled(), bGivenIsPushEnabled);
		assert.equal(oConfig.getPushChannelPath(), sGivenPushChannelPath);
		assert.equal(oConfig.getProductName(), sGivenProductName);
		assert.equal(oConfig.getPlatformType(), sGivenPlatformType);
	});
});