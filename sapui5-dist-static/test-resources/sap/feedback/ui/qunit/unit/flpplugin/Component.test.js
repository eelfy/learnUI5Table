/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/Component",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(Component, Constants, sinon, sinonQunit) {
	"use strict";

	QUnit.module("FLP Plugin-in Component unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("Component load config procedure");

	QUnit.test("_loadPluginConfig - minimum (dataformat v1)", function(assert) {
		// arrangement
		var sGivenQualtricsUri = "abc/def/ghi?jkl=mno";
		var sGivenTenantId = "0123456789";
		var iExpectedDataFormat = Constants.E_DATA_FORMAT.version1;

		var oGivenConfigData = {
			qualtricsInternalUri: sGivenQualtricsUri,
			tenantId: sGivenTenantId
		};

		var oGetComponentDataStub = sinon.stub(Component.prototype, "getComponentData").returns({
			config: oGivenConfigData
		});

		// action
		var oComponent = new Component();
		var oCreatedConfig = oComponent._loadPluginConfig();

		// assertions
		assert.equal(oCreatedConfig.getQualtricsUri(), sGivenQualtricsUri);
		assert.equal(oCreatedConfig.getTenantId(), sGivenTenantId);
		assert.equal(oCreatedConfig.getDataFormat(), iExpectedDataFormat);

		// restore
		oGetComponentDataStub.restore();
	});

	QUnit.test("_loadPluginConfig - minimum + tenantRole (dataformat v1)", function(assert) {
		// arrangement
		var sGivenQualtricsUri = "abc/def/ghi?jkl=mno";
		var sGivenTenantId = "0123456789";
		var sGivenTenantRole = "07";
		var iExpectedDataFormat = Constants.E_DATA_FORMAT.version1;

		var oGivenConfigData = {
			qualtricsInternalUri: sGivenQualtricsUri,
			tenantId: sGivenTenantId,
			tenantRole: sGivenTenantRole
		};

		var oGetComponentDataStub = sinon.stub(Component.prototype, "getComponentData").returns({
			config: oGivenConfigData
		});

		// action
		var oComponent = new Component();
		var oCreatedConfig = oComponent._loadPluginConfig();

		// assertions
		assert.equal(oCreatedConfig.getQualtricsUri(), sGivenQualtricsUri);
		assert.equal(oCreatedConfig.getTenantId(), sGivenTenantId);
		assert.equal(oCreatedConfig.getTenantRole(), sGivenTenantRole);
		assert.equal(oCreatedConfig.getDataFormat(), iExpectedDataFormat);

		// restore
		oGetComponentDataStub.restore();
	});

	QUnit.test("_loadPluginConfig - minimum + push enabled without channel (dataformat v2)", function(assert) {
		// arrangement
		var sGivenQualtricsUri = "abc/def/ghi?jkl=mno";
		var sGivenTenantId = "0123456789";
		var sGivenTenantRole = "07";
		var sGivenProductName = "SANDBOX";
		var sGivenPlatformType = "PLATFORM";
		var sGivenPushIsEnabled = true;
		var iExpectedDataFormat = Constants.E_DATA_FORMAT.version2;

		var oGivenConfigData = {
			qualtricsInternalUri: sGivenQualtricsUri,
			tenantId: sGivenTenantId,
			tenantRole: sGivenTenantRole,
			isPushEnabled: sGivenPushIsEnabled,
			productName: sGivenProductName,
			platformType: sGivenPlatformType
		};

		var oGetComponentDataStub = sinon.stub(Component.prototype, "getComponentData").returns({
			config: oGivenConfigData
		});

		// action
		var oComponent = new Component();
		var oCreatedConfig = oComponent._loadPluginConfig();

		// assertions
		assert.equal(oCreatedConfig.getQualtricsUri(), sGivenQualtricsUri);
		assert.equal(oCreatedConfig.getTenantId(), sGivenTenantId);
		assert.equal(oCreatedConfig.getTenantRole(), sGivenTenantRole);
		assert.equal(oCreatedConfig.getIsPushEnabled(), sGivenPushIsEnabled);
		assert.equal(oCreatedConfig.getProductName(), sGivenProductName);
		assert.equal(oCreatedConfig.getPlatformType(), sGivenPlatformType);
		assert.equal(oCreatedConfig.getDataFormat(), iExpectedDataFormat);

		// restore
		oGetComponentDataStub.restore();
	});

	QUnit.test("_loadPluginConfig - minimum + push enabled empty channel (dataformat v2)", function(assert) {
		// arrangement
		var sGivenQualtricsUri = "abc/def/ghi?jkl=mno";
		var sGivenTenantId = "0123456789";
		var sGivenTenantRole = "07";
		var sGivenProductName = "SANDBOX";
		var sGivenPlatformType = "PLATFORM";
		var sGivenPushIsEnabled = true;
		var sGivenPushChannelPath = "";
		var iExpectedDataFormat = Constants.E_DATA_FORMAT.version2;

		var oGivenConfigData = {
			qualtricsInternalUri: sGivenQualtricsUri,
			tenantId: sGivenTenantId,
			tenantRole: sGivenTenantRole,
			isPushEnabled: sGivenPushIsEnabled,
			pushChannelPath: sGivenPushChannelPath,
			productName: sGivenProductName,
			platformType: sGivenPlatformType
		};

		var oGetComponentDataStub = sinon.stub(Component.prototype, "getComponentData").returns({
			config: oGivenConfigData
		});

		// action
		var oComponent = new Component();
		var oCreatedConfig = oComponent._loadPluginConfig();

		// assertions
		assert.equal(oCreatedConfig.getQualtricsUri(), sGivenQualtricsUri);
		assert.equal(oCreatedConfig.getTenantId(), sGivenTenantId);
		assert.equal(oCreatedConfig.getTenantRole(), sGivenTenantRole);
		assert.equal(oCreatedConfig.getIsPushEnabled(), sGivenPushIsEnabled);
		assert.equal(oCreatedConfig.getPushChannelPath(), null);
		assert.equal(oCreatedConfig.getProductName(), sGivenProductName);
		assert.equal(oCreatedConfig.getPlatformType(), sGivenPlatformType);
		assert.equal(oCreatedConfig.getDataFormat(), iExpectedDataFormat);

		// restore
		oGetComponentDataStub.restore();
	});

	QUnit.test("_loadPluginConfig - minimum + push enabled and valid channel (dataformat v2)", function(assert) {
		// arrangement
		var sGivenQualtricsUri = "abc/def/ghi?jkl=mno";
		var sGivenTenantId = "0123456789";
		var sGivenTenantRole = "07";
		var sGivenProductName = "SANDBOX";
		var sGivenPlatformType = "PLATFORM";
		var sGivenPushIsEnabled = true;
		var sGivenPushChannelPath = "/qrst/xyz/123";
		var iExpectedDataFormat = Constants.E_DATA_FORMAT.version2;

		var oGivenConfigData = {
			qualtricsInternalUri: sGivenQualtricsUri,
			tenantId: sGivenTenantId,
			tenantRole: sGivenTenantRole,
			isPushEnabled: sGivenPushIsEnabled,
			pushChannelPath: sGivenPushChannelPath,
			productName: sGivenProductName,
			platformType: sGivenPlatformType
		};

		var oGetComponentDataStub = sinon.stub(Component.prototype, "getComponentData").returns({
			config: oGivenConfigData
		});

		// action
		var oComponent = new Component();
		var oCreatedConfig = oComponent._loadPluginConfig();

		// assertions
		assert.equal(oCreatedConfig.getQualtricsUri(), sGivenQualtricsUri);
		assert.equal(oCreatedConfig.getTenantId(), sGivenTenantId);
		assert.equal(oCreatedConfig.getTenantRole(), sGivenTenantRole);
		assert.equal(oCreatedConfig.getIsPushEnabled(), sGivenPushIsEnabled);
		assert.equal(oCreatedConfig.getPushChannelPath(), sGivenPushChannelPath);
		assert.equal(oCreatedConfig.getProductName(), sGivenProductName);
		assert.equal(oCreatedConfig.getPlatformType(), sGivenPlatformType);
		assert.equal(oCreatedConfig.getDataFormat(), iExpectedDataFormat);

		// restore
		oGetComponentDataStub.restore();
	});


});