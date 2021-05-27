/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/controller/ContextDataController",
	"sap/feedback/ui/flpplugin/data/AppContextData",
	"sap/feedback/ui/flpplugin/data/PushContextData",
	"sap/feedback/ui/flpplugin/data/Config",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ContextDataController, AppContextData, PushContextData, Config, Constants, sinon, sinonQunit) {
	"use strict";

	QUnit.module("Context data controller unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("Context data controller init procedure");

	QUnit.test("ctor", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);

		// assertions
		assert.equal(oContextDataController._oConfig, oConfigDummy);
		assert.equal(oContextDataController._oShellUIService, oShellUIServiceDummy);

	});

	QUnit.test("init succeeded (full config)", function(assert) {
		// arrangement
		var sQualtricsUri = "abcdef";
		var sTenantId = "12345";
		var sTenantRole = "07";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		oConfigDummy.setTenantRole(sTenantRole);
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataControllerRestoreStub = sinon.stub(ContextDataController.prototype, "_resetContextData");
		var oContextDataControllerCollectStub = sinon.stub(ContextDataController.prototype, "_collectSessionContextData");

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController.init();

		// assertions
		assert.ok(oContextDataControllerRestoreStub.notCalled);
		assert.ok(oContextDataControllerCollectStub.calledWith(sTenantId, sTenantRole));
		assert.equal(oContextDataController._oConfig, oConfigDummy);
		assert.equal(oContextDataController._oShellUIService, oShellUIServiceDummy);
		assert.notEqual(oContextDataController._oAppContextData, null);

		//teardown
		oContextDataControllerRestoreStub.restore();
		oContextDataControllerCollectStub.restore();

	});

	QUnit.test("init not succeeded (shellUIService null)", function(assert) {
		// arrangement
		var sQualtricsUri = "";
		var sTenantId = "12345";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		var oShellUIServiceDummy = null;
		var oContextDataControllerRestoreStub = sinon.stub(ContextDataController.prototype, "_resetContextData");
		var oContextDataControllerCollectStub = sinon.stub(ContextDataController.prototype, "_collectSessionContextData");

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController.init();

		// assertions
		assert.ok(oContextDataControllerRestoreStub.calledWith(Constants.E_PLUGIN_STATE.init));
		assert.ok(oContextDataControllerCollectStub.notCalled);
		assert.equal(oContextDataController._oConfig, oConfigDummy);
		assert.equal(oContextDataController._oShellUIService, oShellUIServiceDummy);

		//teardown
		oContextDataControllerRestoreStub.restore();
		oContextDataControllerCollectStub.restore();
	});

	QUnit.test("init not succeeded (config null)", function(assert) {
		// arrangement
		var oConfigDummy = null;
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataControllerRestoreStub = sinon.stub(ContextDataController.prototype, "_resetContextData");
		var oContextDataControllerCollectStub = sinon.stub(ContextDataController.prototype, "_collectSessionContextData");

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController.init();

		// assertions
		assert.ok(oContextDataControllerRestoreStub.calledWith(Constants.E_PLUGIN_STATE.init));
		assert.ok(oContextDataControllerCollectStub.notCalled);
		assert.equal(oContextDataController._oConfig, oConfigDummy);
		assert.equal(oContextDataController._oShellUIService, oShellUIServiceDummy);

		//teardown
		oContextDataControllerRestoreStub.restore();
		oContextDataControllerCollectStub.restore();
	});

	QUnit.test("updateContextData", function(assert) {
		// arrangement
		var sQualtricsUri = "abcdef";
		var sTenantId = "12345";
		var sTenantRole = "07";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		oConfigDummy.setTenantRole(sTenantRole);
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataControllerRestoreStub = sinon.stub(ContextDataController.prototype, "_resetContextData");
		var oContextDataControllerSessionStub = sinon.stub(ContextDataController.prototype, "_setSessionContextData");
		var oContextDataControllerCollectStub = sinon.stub(ContextDataController.prototype, "_collectAppContextData").returns(new Promise(
			function(resolve, reject) {
				resolve();
			}));

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController.init();
		var oResultPromise = oContextDataController.updateContextData();

		// assertions
		return oResultPromise.then(function() {
			assert.ok(oContextDataControllerRestoreStub.calledWith(Constants.E_PLUGIN_STATE.update));
			assert.ok(oContextDataControllerSessionStub.calledWith(iDataFormat));
			assert.ok(oContextDataControllerCollectStub.calledWith(iDataFormat));
		}).finally(function() {
			//teardown
			oContextDataControllerRestoreStub.restore();
			oContextDataControllerSessionStub.restore();
			oContextDataControllerCollectStub.restore();
		});
	});

	QUnit.test("setPushContextData", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oPushDummyData = new PushContextData("SALESORDER", "ON_CREATE", 1);
		var oExpectedPushDummyDataJSON = {
			srcType: 1,
			srcAppId: "SALESORDER",
			srcAppTrigger: "ON_CREATE"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._setPushContextData(oPushDummyData);

		// assertions
		assert.equal(sap.qtx.push.srcType, oExpectedPushDummyDataJSON.srcType);
		assert.equal(sap.qtx.push.srcAppId, oExpectedPushDummyDataJSON.srcAppId);
		assert.equal(sap.qtx.push.srcAppTrigger, oExpectedPushDummyDataJSON.srcAppTrigger);

		//teardown
		sap.qtx = null;
	});

	QUnit.test("getContextDataAsUrlParameter with escaping (data format version 1)", function(assert) {
		// arrangement
		var sQualtricsUri = "abcdef";
		var sTenantId = "12345";
		var sTenantRole = "07";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		oConfigDummy.setTenantRole(sTenantRole);
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataDummy = {
			language: "EN",
			ui5Version: "1.0.0",
			ui5Theme: "any",
			fioriId: "&F99&99&",
			appVersion: "2.0.0",
			componentId: "CID='abc'",
			appTitle: "HOME",
			ach: "SAP-ACH-FOO",
			tenantId: "0815",
			tenantRole: "07",
			pluginState: 1
		};

		var oSurveyUrlConstructed = "?Q_Language=EN";
		oSurveyUrlConstructed += "&language=EN";
		oSurveyUrlConstructed += "&ui5Version=1.0.0";
		oSurveyUrlConstructed += "&ui5Theme=any";
		oSurveyUrlConstructed += "&fioriId=%26F99%2699%26";
		oSurveyUrlConstructed += "&appVersion=2.0.0";
		oSurveyUrlConstructed += "&componentId=CID%3D'abc'";
		oSurveyUrlConstructed += "&appTitle=HOME";
		oSurveyUrlConstructed += "&ach=SAP-ACH-FOO";
		oSurveyUrlConstructed += "&tenantId=0815";
		oSurveyUrlConstructed += "&tenantRole=07";
		oSurveyUrlConstructed += "&pluginState=1";

		sap.qtxAppContext = oContextDataDummy;
		if (!sap.qtx) {
			sap.qtx = {};
		}

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		var oResult = oContextDataController.getContextDataAsUrlParameter();

		// assertions
		assert.equal(oResult, oSurveyUrlConstructed);
	});

	QUnit.test("getContextDataAsUrlParameter with escaping (data format version 2)", function(assert) {
		// arrangement
		var sQualtricsUri = "abcdef";
		var sTenantId = "12345";
		var sTenantRole = "07";
		var iDataFormat = Constants.E_DATA_FORMAT.version2;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		oConfigDummy.setTenantRole(sTenantRole);
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataDummy = {
			appcontext: {
				languageTag: "EN",
				appFrameworkId: "ui5",
				appFrameworkVersion: "1.0.0",
				theme: "any",
				appId: "&F99&99&",
				appVersion: "2.0.0",
				technicalAppComponentId: "CID='abc'",
				appTitle: "HOME",
				appSupportInfo: "SAP-ACH-FOO"
			},
			session: {
				tenantId: "0815",
				tenantRole: "07",
				productName: "S/4HANACLOUD",
				platformType: "CLOUD"
			},
			push: {
				srcType: 1,
				srcAppId: "SALESORDER",
				srcAppTrigger: "ON_CREATE"
			},
			debug: {
				pluginState: 1
			}
		};

		var oSurveyUrlConstructed = "?Q_Language=EN";
		oSurveyUrlConstructed += "&language=EN";
		oSurveyUrlConstructed += "&appFrameworkId=ui5";
		oSurveyUrlConstructed += "&appFrameworkVersion=1.0.0";
		oSurveyUrlConstructed += "&theme=any";
		oSurveyUrlConstructed += "&appId=%26F99%2699%26";
		oSurveyUrlConstructed += "&appVersion=2.0.0";
		oSurveyUrlConstructed += "&technicalAppComponentId=CID%3D'abc'";
		oSurveyUrlConstructed += "&appTitle=HOME";
		oSurveyUrlConstructed += "&appSupportInfo=SAP-ACH-FOO";
		oSurveyUrlConstructed += "&tenantId=0815";
		oSurveyUrlConstructed += "&tenantRole=07";
		oSurveyUrlConstructed += "&productName=S%2F4HANACLOUD";
		oSurveyUrlConstructed += "&platformType=CLOUD";
		oSurveyUrlConstructed += "&pluginState=1";
		oSurveyUrlConstructed += "&pushSrcType=1";
		oSurveyUrlConstructed += "&pushSrcAppId=SALESORDER";
		oSurveyUrlConstructed += "&pushSrcTrigger=ON_CREATE";

		sap.qtx = oContextDataDummy;
		if (!sap.qtx) {
			sap.qtx = {};
		}

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		var oResult = oContextDataController.getContextDataAsUrlParameter();

		// assertions
		assert.equal(oResult, oSurveyUrlConstructed);
	});

	QUnit.test("_collectSessionContextData", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._collectSessionContextData(sTenantId, sTenantRole);

		// assertions
		assert.equal(oContextDataController._oSessionData.tenantId, sTenantId);
		assert.equal(oContextDataController._oSessionData.tenantRole, sTenantRole);
	});

	QUnit.test("_setSessionContextData blank (data format version 1)", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oGivenSessionContextData = {
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		sap.qtxAppContext = null;
		oContextDataController._oSessionData = oGivenSessionContextData;
		oContextDataController._setSessionContextData(Constants.E_DATA_FORMAT.version1);

		// assertions
		assert.equal(sap.qtxAppContext.tenantId, sTenantId);
		assert.equal(sap.qtxAppContext.tenantRole, sTenantRole);
	});

	QUnit.test("_setSessionContextData non-blank (data format version 1)", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var sAppId = "F9876";
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oGivenSessionContextData = {
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		sap.qtxAppContext = {
			appId: sAppId
		};
		oContextDataController._oSessionData = oGivenSessionContextData;
		oContextDataController._setSessionContextData(Constants.E_DATA_FORMAT.version1);

		// assertions
		assert.equal(sap.qtxAppContext.tenantId, sTenantId);
		assert.equal(sap.qtxAppContext.tenantRole, sTenantRole);
		assert.equal(sap.qtxAppContext.appId, sAppId);
	});

	QUnit.test("_setSessionContextData blank (data format version 2)", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oGivenSessionContextData = {
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		sap.qtx = null;
		oContextDataController._oSessionData = oGivenSessionContextData;
		oContextDataController._setSessionContextData(Constants.E_DATA_FORMAT.version2);

		// assertions
		assert.equal(sap.qtx.session.tenantId, sTenantId);
		assert.equal(sap.qtx.session.tenantRole, sTenantRole);
	});

	QUnit.test("_setSessionContextData non-blank (data format version 2)", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var sAppId = "F9876";
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oGivenSessionContextData = {
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		sap.qtx = {};
		sap.qtx.appcontext = {
			appId: sAppId
		};
		oContextDataController._oSessionData = oGivenSessionContextData;
		oContextDataController._setSessionContextData(Constants.E_DATA_FORMAT.version2);

		// assertions
		assert.equal(sap.qtx.session.tenantId, sTenantId);
		assert.equal(sap.qtx.session.tenantRole, sTenantRole);
		assert.equal(sap.qtx.appcontext.appId, sAppId);
	});

	QUnit.test("_resetContextData blank", function(assert) {
		// arrangement
		sap.qtxAppContext = undefined;
		sap.qtx = undefined;

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._resetContextData(Constants.E_PLUGIN_STATE.init);

		// assertions
		assert.ok(sap.qtxAppContext);
		assert.equal(sap.qtxAppContext.pluginState, Constants.E_PLUGIN_STATE.init);
		assert.ok(sap.qtx);
		assert.ok(sap.qtx.appcontext);
		assert.ok(sap.qtx.push);
		assert.equal(sap.qtx.debug.pluginState, Constants.E_PLUGIN_STATE.init);
	});

	QUnit.test("_resetContextData non-blank", function(assert) {
		// arrangement
		var sTenantId = "12345";
		var sTenantRole = "07";
		var sAppId = "F9876";
		var sPushSourceId = "ABCDEF";
		sap.qtxAppContext = {
			appId: sAppId,
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};
		sap.qtx = {
			session: {
				tenantId: sTenantId,
				tenantRole: sTenantRole
			},
			appcontext: {
				appId: sAppId
			},
			push: {
				sourceId: sPushSourceId
			},
			debug: {
				pluginState: Constants.E_PLUGIN_STATE.init
			}
		};

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._resetContextData(Constants.E_PLUGIN_STATE.init);

		// assertions
		assert.ok(sap.qtxAppContext);
		assert.equal(sap.qtxAppContext.pluginState, Constants.E_PLUGIN_STATE.init);
		assert.ok(sap.qtx);
		assert.ok(sap.qtx.appcontext);
		assert.notOk(sap.qtx.appcontext.appId);
		assert.ok(sap.qtx.push);
		assert.notOk(sap.qtx.push.sourceId);
		assert.ok(sap.qtx.session);
		assert.ok(sap.qtx.session.tenantId);
		assert.ok(sap.qtx.session.tenantRole);
		assert.equal(sap.qtx.debug.pluginState, Constants.E_PLUGIN_STATE.init);
	});

	QUnit.test("_collectAppContextData", function(assert) {
		// arrangement
		var sQualtricsUri = "abcdef";
		var sTenantId = "12345";
		var sTenantRole = "07";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var oConfigDummy = new Config(sQualtricsUri, sTenantId, iDataFormat);
		oConfigDummy.setTenantRole(sTenantRole);
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oGivenSessionContextData = {
			tenantId: sTenantId,
			tenantRole: sTenantRole
		};
		var oContextDataControllerCollectStub = sinon.stub(ContextDataController.prototype, "_collectSessionContextData");
		var oContextDataControllerSetStub = sinon.stub(ContextDataController.prototype, "_setAppContextData");
		var oAppContextDataGetDataStub = sinon.stub(AppContextData.prototype, "getData").returns(new Promise(function(resolve, reject) {
			resolve(oGivenSessionContextData);
		}));

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController.init();
		var oResultPromise = oContextDataController._collectAppContextData(iDataFormat);

		// assertions
		return oResultPromise.then(function() {
			assert.ok(oAppContextDataGetDataStub.calledWith(iDataFormat));
			assert.ok(oContextDataControllerSetStub.calledWith(oGivenSessionContextData, iDataFormat, Constants.E_PLUGIN_STATE.update));
		}).finally(function() {
			//teardown
			oContextDataControllerCollectStub.restore();
			oContextDataControllerSetStub.restore();
			oAppContextDataGetDataStub.restore();
		});
	});

	QUnit.test("_setAppContextData blank (data format version 1)", function(assert) {
		// arrangement
		var sAppId = "F9876";
		var sAppVersion = "1.2.3";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var iPluginState = Constants.E_PLUGIN_STATE.init;
		var oExpectedContextData = {
			appId: sAppId,
			appVersion: sAppVersion
		};
		sap.qtxAppContext = {};

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._setAppContextData(oExpectedContextData, iDataFormat, iPluginState);

		// assertions
		assert.ok(sap.qtxAppContext);
		assert.equal(sap.qtxAppContext.appVersion, sAppVersion);
		assert.equal(sap.qtxAppContext.appId, sAppId);
		assert.equal(sap.qtxAppContext.pluginState, iPluginState);
	});

	QUnit.test("_setAppContextData non-blank (data format version 1)", function(assert) {
		// arrangement
		var sAppId = "F9876";
		var sAppVersion = "1.2.3";
		var iDataFormat = Constants.E_DATA_FORMAT.version1;
		var iPluginState = Constants.E_PLUGIN_STATE.init;
		var oExpectedContextData = {
			appVersion: sAppVersion
		};
		sap.qtxAppContext = {};
		sap.qtxAppContext.appId = sAppId;

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._setAppContextData(oExpectedContextData, iDataFormat, iPluginState);

		// assertions
		assert.ok(sap.qtxAppContext);
		assert.equal(sap.qtxAppContext.appVersion, sAppVersion);
		assert.equal(sap.qtxAppContext.appId, sAppId);
		assert.equal(sap.qtxAppContext.pluginState, iPluginState);
	});

	QUnit.test("_setAppContextData blank (data format version 2)", function(assert) {
		// arrangement
		var sAppId = "F9876";
		var iDataFormat = Constants.E_DATA_FORMAT.version2;
		var iPluginState = Constants.E_PLUGIN_STATE.init;
		var oExpectedContextData = {
			appId: sAppId
		};
		sap.qtx = {};

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._setAppContextData(oExpectedContextData, iDataFormat, iPluginState);

		// assertions
		assert.ok(sap.qtx);
		assert.ok(sap.qtx.appcontext);
		assert.equal(sap.qtx.appcontext.appId, sAppId);
		assert.equal(sap.qtx.debug.pluginState, iPluginState);
	});

	QUnit.test("_setAppContextData non-blank (data format version 2)", function(assert) {
		// arrangement
		var sAppId = "F9876";
		var iDataFormat = Constants.E_DATA_FORMAT.version2;
		var iPluginState = Constants.E_PLUGIN_STATE.init;
		var oExpectedContextData = {
			appId: sAppId
		};
		sap.qtx = {
			appcontext: {
				appVersion: "1.2.3"
			}
		};

		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oContextDataController = new ContextDataController(oConfigDummy, oShellUIServiceDummy);
		oContextDataController._setAppContextData(oExpectedContextData, iDataFormat, iPluginState);

		// assertions
		assert.ok(sap.qtx);
		assert.ok(sap.qtx.appcontext);
		assert.equal(sap.qtx.appcontext.appId, sAppId);
		assert.notOk(sap.qtx.appcontext.appVersion);
		assert.equal(sap.qtx.debug.pluginState, iPluginState);
	});
});