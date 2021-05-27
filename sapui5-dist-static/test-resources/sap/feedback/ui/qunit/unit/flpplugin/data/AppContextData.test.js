/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/data/AppContextData",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/feedback/ui/flpplugin/utils/Utils",
	"sap/ui/VersionInfo",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(AppContextData, Constants, Utils, VersionInfo, sinon, sinonQunit) {
	"use strict";

	QUnit.module("Data-App context data unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("App context data init procedure");

	QUnit.test("ctor", function(assert) {
		// arrangement
		var oUIShellService = {
			getTitle: function() {
				return "myTitle";
			}
		};

		// action
		var oAppContextData = new AppContextData(oUIShellService);

		// assertions
		assert.equal(oAppContextData._oShellUIService, oUIShellService);
		assert.equal(oAppContextData._dataV1, null);
		assert.equal(oAppContextData._dataV2, null);
	});

	QUnit.test("getData data and reset format v1", function(assert) {
		// arrangement
		var oUIShellService = {};
		var oCollectedData = {
			testSuccess: true
		};
		var oCollectDataStub = sinon.stub(AppContextData.prototype, "_collectData").returns(new Promise(function(resolve, reject) {
			resolve(oCollectedData);
		}));
		var oSetDataStub = sinon.stub(AppContextData.prototype, "_setData");

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		var oResultPromise = oAppContextData.getData(Constants.E_DATA_FORMAT.version1);

		// assertions
		return oResultPromise.then(function(oResult) {
			assert.equal(oResult.ui5Version, Constants.S_DEFAULT_VALUE);
			assert.ok(oCollectDataStub.called);
			assert.ok(oSetDataStub.withArgs(oCollectedData));
			assert.equal(oAppContextData._dataV1.ui5Version, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.ui5Theme, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.fioriId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.appTitle, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.language, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.componentId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.appVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.ach, Constants.S_DEFAULT_VALUE);

			assert.equal(oAppContextData._dataV2.appFrameworkId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appFrameworkVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.theme, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appTitle, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.languageTag, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.technicalAppComponentId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appSupportInfo, Constants.S_DEFAULT_VALUE);
		}).finally(function() {
			// teardown
			oCollectDataStub.restore();
			oSetDataStub.restore();
		});
	});

	QUnit.test("getData data and reset format v2", function(assert) {
		// arrangement
		var oUIShellService = {};
		var oCollectedData = {
			testSuccess: true
		};
		var oCollectDataStub = sinon.stub(AppContextData.prototype, "_collectData").returns(new Promise(function(resolve, reject) {
			resolve(oCollectedData);
		}));
		var oSetDataStub = sinon.stub(AppContextData.prototype, "_setData");

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		var oResultPromise = oAppContextData.getData(Constants.E_DATA_FORMAT.version2);

		// assertions
		return oResultPromise.then(function(oResult) {
			assert.equal(oResult.appFrameworkId, Constants.S_DEFAULT_VALUE);
			assert.ok(oCollectDataStub.called);
			assert.ok(oSetDataStub.withArgs(oCollectedData));
			assert.equal(oAppContextData._dataV1.ui5Version, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.ui5Theme, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.fioriId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.appTitle, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.language, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.componentId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.appVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV1.ach, Constants.S_DEFAULT_VALUE);

			assert.equal(oAppContextData._dataV2.appFrameworkId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appFrameworkVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.theme, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appTitle, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.languageTag, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.technicalAppComponentId, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appVersion, Constants.S_DEFAULT_VALUE);
			assert.equal(oAppContextData._dataV2.appSupportInfo, Constants.S_DEFAULT_VALUE);
		}).finally(function() {
			// teardown
			oCollectDataStub.restore();
			oSetDataStub.restore();
		});
	});

	QUnit.test("setData data for v1 and v2", function(assert) {
		// arrangement
		var oUIShellService = {};

		var oContextTestData = {
			appFrameworkId: "00",
			appFrameworkVersion: "01",
			theme: "02",
			appId: "03",
			appTitle: "04",
			languageTag: "05",
			technicalAppComponentId: "06",
			appVersion: "07",
			appSupportInfo: "08"
		};

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		oAppContextData._setData(oContextTestData);

		// assertions
		assert.equal(oAppContextData._dataV1.ui5Version, "01");
		assert.equal(oAppContextData._dataV1.ui5Theme, "02");
		assert.equal(oAppContextData._dataV1.fioriId, "03");
		assert.equal(oAppContextData._dataV1.appTitle, "04");
		assert.equal(oAppContextData._dataV1.language, "05");
		assert.equal(oAppContextData._dataV1.componentId, "06");
		assert.equal(oAppContextData._dataV1.appVersion, "07");
		assert.equal(oAppContextData._dataV1.ach, "08");

		assert.equal(oAppContextData._dataV2.appFrameworkId, "00");
		assert.equal(oAppContextData._dataV2.appFrameworkVersion, "01");
		assert.equal(oAppContextData._dataV2.theme, "02");
		assert.equal(oAppContextData._dataV2.appId, "03");
		assert.equal(oAppContextData._dataV2.appTitle, "04");
		assert.equal(oAppContextData._dataV2.languageTag, "05");
		assert.equal(oAppContextData._dataV2.technicalAppComponentId, "06");
		assert.equal(oAppContextData._dataV2.appVersion, "07");
		assert.equal(oAppContextData._dataV2.appSupportInfo, "08");

	});

	QUnit.module("Context Data - get app id");
	QUnit.test("get App Id for Launchpad", function(assert) {
		// arrangement
		var oUIShellService = {};
		var oCurrentApplication = {
			homePage: true
		};

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		var oResultPromise = oAppContextData._getFioriAppId(oCurrentApplication);

		// assertions
		return oResultPromise.then(function(sAppId) {
			assert.equal(sAppId, "LAUNCHPAD");
		});
	});

	QUnit.test("get App Id for app with Fiori Id", function(assert) {
		// arrangement
		var oUIShellService = {};
		var sExpectedAppId = "F1234";
		var oCurrentApplication = {
			homePage: false,
			getTechnicalParameter: function() {
				return new Promise(function(resolve, reject) {
					resolve([sExpectedAppId]);
				});
			}
		};

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		var oResultPromise = oAppContextData._getFioriAppId(oCurrentApplication);

		// assertions
		return oResultPromise.then(function(sAppId) {
			assert.equal(sAppId, sExpectedAppId);
		});
	});

	QUnit.test("get App Id default", function(assert) {
		// arrangement
		var oUIShellService = {};
		var sProvidedAppId = null;
		var oCurrentApplication = {
			homePage: false,
			getTechnicalParameter: function() {
				return new Promise(function(resolve, reject) {
					resolve(sProvidedAppId);
				});
			}
		};

		// action
		var oAppContextData = new AppContextData(oUIShellService);
		var oResultPromise = oAppContextData._getFioriAppId(oCurrentApplication);

		// assertions
		return oResultPromise.then(function(sAppId) {
			assert.equal(sAppId, Constants.S_DEFAULT_VALUE);
		});
	});

	QUnit.module("ContextData - get app title");
	QUnit.test("get App title from ui service", function(assert) {
		// arrangement
		var sExpectedTitle = "This is a title";
		// arrangement
		var oGetShellUIService = {
			getTitle: function() {
				return sExpectedTitle;
			}
		};
		var oComponentInstanceDummy = {
			getManifestEntry: function() {
				return {
					title: "dummy title"
				};
			}
		};

		// action
		var oAppContextData = new AppContextData(oGetShellUIService);
		var sResultTitle = oAppContextData._getAppTitle(oComponentInstanceDummy);

		// assertions
		assert.equal(sResultTitle, sExpectedTitle);
	});

	QUnit.test("get App title from manifest (empty title, expected title from manifest)", function(assert) {
		// arrangement
		var sExpectedTitle = "This is a title";
		// arrangement
		var oGetShellUIService = {
			getTitle: function() {
				return null;
			}
		};
		var oComponentInstanceDummy = {
			getManifestEntry: function() {
				return {
					title: sExpectedTitle
				};
			}
		};

		// action
		var oAppContextData = new AppContextData(oGetShellUIService);
		var sResultTitle = oAppContextData._getAppTitle(oComponentInstanceDummy);

		// assertions
		assert.equal(sResultTitle, sExpectedTitle);
	});

	QUnit.test("get App title default fallback value", function(assert) {
		// arrangement
		var oGetShellUIService = {
			getTitle: function() {
				return null;
			}
		};
		var oComponentInstanceDummy = {
			getManifestEntry: function() {
				return {
					title: null
				};
			}
		};

		// action
		var oAppContextData = new AppContextData(oGetShellUIService);
		var sResultTitle = oAppContextData._getAppTitle(oComponentInstanceDummy);

		// assertions
		assert.equal(sResultTitle, Constants.S_DEFAULT_VALUE);
	});

	QUnit.test("collect data", function(assert) {
		// arrangement
		var sExpectedAppFrameworkVersion = "1.2.3";
		var sExpectedTheme = "myTheme";
		var sExpectedLanguage = "XY";
		var sExpectedACH = "ABC-DEF-GHI-JKL-MNO";
		var sExpectedAppId = "F1234";
		var sExpectedComponentId = "app-maincomponent-id";
		var sExpectedApplicationVersion = "0.1.2";
		var sExpectedAppTitle = "myAppTitle";
		var oGetCurrentApp = {
			componentInstance: {
				getManifestEntry: function() {
					return {
						title: null,
						applicationVersion: {
							version: sExpectedApplicationVersion
						},
						ach: sExpectedACH
					};
				},
				getId: function() {
					return sExpectedComponentId;
				}
			},
			applicationType: "ui5",
			homePage: false,
			getTechnicalParameter: function() {
				return new Promise(function(resolve, reject) {
					resolve([sExpectedAppId]);
				});
			}
		};
		var oGetCurrentAppStub = sinon.stub(Utils, "getCurrentApp").returns(oGetCurrentApp);
		var oGetShellUIService = {
			getTitle: function() {
				return sExpectedAppTitle;
			}
		};
		var oVersionInfoStub = sinon.stub(VersionInfo, "load").returns(new Promise(function(resolve, reject) {
			resolve({
				version: sExpectedAppFrameworkVersion
			});
		}));
		var oUserInfoStub = sinon.stub(AppContextData.prototype, "_getUserInfo").returns({
			getUser: function() {
				return {
					getTheme: function() {
						return sExpectedTheme;
					},
					getLanguage: function() {
						return sExpectedLanguage;
					}
				};
			}
		});
		var oGetFioriAppIdStub = sinon.stub(AppContextData.prototype, "_getFioriAppId").returns(sExpectedAppId);

		// action
		var oAppContextData = new AppContextData(oGetShellUIService);
		var oResultPromise = oAppContextData._collectData();

		// assertions
		return oResultPromise.then(function(oResultValue) {
			assert.equal(oResultValue.appFrameworkId, Constants.E_APP_FRAMEWORK.ui5);
			assert.equal(oResultValue.appFrameworkVersion, sExpectedAppFrameworkVersion);
			assert.equal(oResultValue.theme, sExpectedTheme);
			assert.equal(oResultValue.appId, sExpectedAppId);
			assert.equal(oResultValue.appTitle, sExpectedAppTitle);
			assert.equal(oResultValue.languageTag, sExpectedLanguage);
			assert.equal(oResultValue.technicalAppComponentId, sExpectedComponentId);
			assert.equal(oResultValue.appVersion, sExpectedApplicationVersion);
			assert.equal(oResultValue.appSupportInfo, sExpectedACH);
		}).finally(function() {
			// teardown
			oGetCurrentAppStub.restore();
			oVersionInfoStub.restore();
			oUserInfoStub.restore();
			oGetFioriAppIdStub.restore();
		});
	});

});