/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/controller/PluginController",
	"sap/feedback/ui/flpplugin/controller/ContextDataController",
	"sap/feedback/ui/flpplugin/controller/PushClient",
	"sap/feedback/ui/flpplugin/controller/WebAppFeedbackLoader",
	"sap/feedback/ui/flpplugin/ui/PopOverVisual",
	"sap/feedback/ui/flpplugin/ui/IFrameVisual",
	"sap/feedback/ui/flpplugin/ui/ShellBarButton",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(PluginController, ContextDataController, PushClient, WebAppFeedbackLoader, PopOverVisual, IFrameVisual, ShellBarButton, Constants,
	sinon, sinonQunit) {
	"use strict";
	/* global QSI */

	QUnit.module("Plugin controller unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("Plugin controller init procedure");

	QUnit.test("ctor", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var fnRenderPromiseDummy = function() {

		};
		var oResourceBundleDummy = {
			name: "resourceBundle"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		// action
		var oPluginController = new PluginController(oConfigDummy, fnRenderPromiseDummy, oResourceBundleDummy, oShellUIServiceDummy);

		// assertions
		assert.equal(oPluginController._oConfig, oConfigDummy);
		assert.equal(oPluginController._fnRendererPromise, fnRenderPromiseDummy);
		assert.equal(oPluginController._oResourceBundle, oResourceBundleDummy);
		assert.equal(oPluginController._oShellUIService, oShellUIServiceDummy);

	});

	QUnit.module("Plugin Controller init procedure");

	QUnit.test("init", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oPluginControllerInitContextDataStub = sinon.stub(PluginController.prototype, "_initContextData");
		var oPluginControllerInitPushChannelStub = sinon.stub(PluginController.prototype, "_initPushChannel");
		var oPluginControllerInitUIStub = sinon.stub(PluginController.prototype, "_initUI");
		var oPluginControllerInitWebAppStub = sinon.stub(PluginController.prototype, "_initWebAppFeedback");
		var oPluginControllerInitInitialCtxtDataStub = sinon.stub(PluginController.prototype, "_updateInitialContextData").returns(new Promise(
			function(
				resolve, reject) {
				resolve();
			}));

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, null);
		var oResultPromise = oPluginController.init();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oPluginControllerInitContextDataStub.called);
			assert.ok(oPluginControllerInitPushChannelStub.called);
			assert.ok(oPluginControllerInitUIStub.called);
			assert.ok(oPluginControllerInitWebAppStub.called);
			assert.ok(oPluginControllerInitInitialCtxtDataStub.called);
		}).finally(function() {
			//teardown
			oPluginControllerInitContextDataStub.restore();
			oPluginControllerInitPushChannelStub.restore();
			oPluginControllerInitUIStub.restore();
			oPluginControllerInitWebAppStub.restore();
			oPluginControllerInitInitialCtxtDataStub.restore();
		});
	});

	QUnit.test("init context data", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};

		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._initContextData();

		// assertions
		assert.ok(oContextDataCtrlInitStub.called);

		//teardown
		oContextDataCtrlInitStub.restore();

	});

	QUnit.test("init push channel", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getPushChannelPath: function() {
				return "websocket";
			},
			getIsPushEnabled: function() {
				return true;
			}
		};
		var oPushClientInitStub = sinon.stub(PushClient.prototype, "init");

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, null);
		oPluginController._initPushChannel();

		// assertions
		assert.ok(oPushClientInitStub.called);
		assert.notEqual(oPluginController._oPushClient, null);

		//teardown
		oPushClientInitStub.restore();
	});

	QUnit.test("init UI for displayformat popover", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getDisplayFormat: function() {
				return Constants.E_DISPLAY_FORMAT.popover;
			}
		};
		var fnRenderPromiseDummy = function() {

		};
		var oResourceBundleDummy = {
			name: "resourceBundle"
		};

		var oShellBarButtonInitStub = sinon.stub(ShellBarButton.prototype, "init");

		// action
		var oPluginController = new PluginController(oConfigDummy, fnRenderPromiseDummy, oResourceBundleDummy, null);
		oPluginController._initUI();

		// assertions
		assert.ok(oShellBarButtonInitStub.called);
		assert.notEqual(oPluginController._oVisual, null);
		assert.notEqual(oPluginController._oShellButton, null);
		assert.notEqual(oPluginController._oShellButton._fnRendererPromise, null);
		assert.notEqual(oPluginController._oShellButton._oResourceBundle, null);
		assert.notEqual(oPluginController._oShellButton._fnDialogCallback, null);

		//teardown
		oShellBarButtonInitStub.restore();
	});

	QUnit.test("init UI for displayformat iframe", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getDisplayFormat: function() {
				return Constants.E_DISPLAY_FORMAT.iframe;
			}
		};
		var fnRenderPromiseDummy = function() {

		};
		var oResourceBundleDummy = {
			name: "resourceBundle"
		};

		var oShellBarButtonInitStub = sinon.stub(ShellBarButton.prototype, "init");

		// action
		var oPluginController = new PluginController(oConfigDummy, fnRenderPromiseDummy, oResourceBundleDummy, null);
		oPluginController._initUI();

		// assertions
		assert.ok(oShellBarButtonInitStub.called);
		assert.notEqual(oPluginController._oVisual, null);
		assert.notEqual(oPluginController._oVisual._oConfig, null);
		assert.notEqual(oPluginController._oVisual._oResourceBundle, null);
		assert.notEqual(oPluginController._oShellButton, null);
		assert.notEqual(oPluginController._oShellButton._fnRendererPromise, null);
		assert.notEqual(oPluginController._oShellButton._oResourceBundle, null);
		assert.notEqual(oPluginController._oShellButton._fnDialogCallback, null);

		//teardown
		oShellBarButtonInitStub.restore();
	});

	QUnit.test("init WebApp", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getQualtricsUri: function() {
				return "dummyUri";
			}
		};

		var oWebAppFeedbackCtrlInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppFeedbackCtrlLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, null);
		oPluginController._initWebAppFeedback();

		// assertions
		assert.ok(oWebAppFeedbackCtrlInitStub.called);
		assert.ok(oWebAppFeedbackCtrlLoadAPIStub.called);
		assert.notEqual(oPluginController._oWebAppFeedbackLoader, null);
		assert.notEqual(oPluginController._oWebAppFeedbackLoader._oConfig, null);

		//teardown
		oWebAppFeedbackCtrlInitStub.restore();
		oWebAppFeedbackCtrlLoadAPIStub.restore();
	});

	QUnit.module("Plugin Controller callbacks");
	QUnit.test("API Loaded Callback", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getQualtricsUri: function() {
				return "dummyUri";
			}
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));
		var oAppLifecycleAppLoadedStub = sinon.stub();
		var oPluginCtrlAppLifecycleSrvcStub = sinon.stub(PluginController.prototype, "_getAppLifeCycleService").returns({
			attachAppLoaded: oAppLifecycleAppLoadedStub
		});

		var oQSIrunStub = sinon.stub();
		var oQSIloadStub = sinon.stub().returns(new Promise(function(resolve, reject) {
			resolve();
		}));
		var qsiAPIDummy = {
			API: {
				run: oQSIrunStub,
				load: oQSIloadStub
			}
		};
		//Qualtrics API loaded at runtime is mocked here
		/* eslint-disable sap-no-global-define */
		window.QSI = qsiAPIDummy;

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._initContextData();
		var oResultPromise = oPluginController._onAPILoadedCallback();
		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.called);
			assert.ok(oAppLifecycleAppLoadedStub.called);
			assert.ok(oQSIloadStub.called);
			assert.ok(oQSIrunStub.called);
		}).finally(function() {
			//teardown
			oPluginCtrlAppLifecycleSrvcStub.restore();
			oContextDataCtrlInitStub.restore();
			oContextDataCtrlUpdateStub.restore();
			//Qualtrics API loaded at runtime is mocked here
			/* eslint-disable sap-no-global-define */
			window.QSI = null;
		});
	});

	QUnit.test("Push Callback on API loaded", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getQualtricsUri: function() {
				return "dummyUri";
			}
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oEventData = {
			name: "eventData"
		};

		var oWebAppIsAPILoadedStub = sinon.stub(WebAppFeedbackLoader.prototype, "getIsAPILoaded").returns(true);
		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));

		var oPluginCtrlOpenSurveyStub = sinon.stub(PluginController.prototype, "_openSurvey");

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onPushCallback(oEventData);

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.calledWith(Constants.E_INTERCEPT_ID.push, oEventData));
			assert.ok(oPluginCtrlOpenSurveyStub.called);
		}).finally(function() {
			//teardown
			oWebAppIsAPILoadedStub.restore();
			oWebAppInitStub.restore();
			oWebAppLoadAPIStub.restore();
			oContextDataCtrlInitStub.restore();
			oContextDataCtrlUpdateStub.restore();
			oPluginCtrlOpenSurveyStub.restore();
		});
	});

	QUnit.test("Push Callback on API NOT loaded", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getQualtricsUri: function() {
				return "dummyUri";
			}
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var oEventData = {
			name: "eventData"
		};

		var oWebAppIsAPILoadedStub = sinon.stub(WebAppFeedbackLoader.prototype, "getIsAPILoaded").returns(false);
		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onPushCallback(oEventData);

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.notCalled);
		}).finally(function() {
			//teardown
			oWebAppIsAPILoadedStub.restore();
			oWebAppInitStub.restore();
			oWebAppLoadAPIStub.restore();
			oContextDataCtrlInitStub.restore();
			oContextDataCtrlUpdateStub.restore();
		});
	});

	QUnit.test("Show survey callback - iframe", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getDisplayFormat: function() {
				return Constants.E_DISPLAY_FORMAT.iframe;
			}
		};
		var oResourceBundleDummy = {
			name: "resource"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};
		var sUrlParams = "abc&def-ghi";

		var oWebAppIsAPILoadedStub = sinon.stub(WebAppFeedbackLoader.prototype, "getIsAPILoaded").returns(true);
		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlContextAsUrlStub = sinon.stub(ContextDataController.prototype, "getContextDataAsUrlParameter").returns(
			sUrlParams);
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));
		var oVisualShowStub = sinon.stub(IFrameVisual.prototype, "show");
		var oVisualDummy = new IFrameVisual(oConfigDummy, oResourceBundleDummy);

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._oVisual = oVisualDummy;
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onSurveyShow();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.calledWith(Constants.E_INTERCEPT_ID.ux, null));
			assert.ok(oContextDataCtrlContextAsUrlStub.called);
			assert.ok(oVisualShowStub.calledWith(sUrlParams));
		}).finally(function() {
			//teardown
			oWebAppIsAPILoadedStub.restore();
			oWebAppInitStub.restore();
			oWebAppLoadAPIStub.restore();
			oContextDataCtrlInitStub.restore();
			oContextDataCtrlUpdateStub.restore();
			oVisualShowStub.restore();
			oContextDataCtrlContextAsUrlStub.restore();
		});
	});

	QUnit.test("Show survey callback - popover", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config",
			getDisplayFormat: function() {
				return Constants.E_DISPLAY_FORMAT.popover;
			}
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		var oWebAppIsAPILoadedStub = sinon.stub(WebAppFeedbackLoader.prototype, "getIsAPILoaded").returns(true);
		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));
		var oVisualShowStub = sinon.stub(PopOverVisual.prototype, "show");
		var oVisualDummy = new PopOverVisual();

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._oVisual = oVisualDummy;
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onSurveyShow();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.calledWith(Constants.E_INTERCEPT_ID.ux, null));
			assert.ok(oVisualShowStub.called);
		}).finally(function() {
			//teardown
			oWebAppIsAPILoadedStub.restore();
			oWebAppInitStub.restore();
			oWebAppLoadAPIStub.restore();
			oContextDataCtrlInitStub.restore();
			oContextDataCtrlUpdateStub.restore();
			oVisualShowStub.restore();
		});
	});

	QUnit.test("App loaded callback on restart state", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppFeedbackCtrlLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oWebAppReloadInterceptsStub = sinon.stub(WebAppFeedbackLoader.prototype, "reloadIntercepts");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));
		var oShellBarBtnUpdateStateStub = sinon.stub(ShellBarButton.prototype, "updateButtonState").returns(Constants.E_SHELLBAR_BUTTON_STATE
			.restart);
		var oShellBarBtnDummy = new ShellBarButton(null, null, null);

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._oShellButton = oShellBarBtnDummy;
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onAppLoaded();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.called);
			assert.ok(oShellBarBtnUpdateStateStub.called);
			assert.ok(oWebAppReloadInterceptsStub.called);
		}).finally(function() {
			//teardown
			oContextDataCtrlInitStub.restore();
			oShellBarBtnUpdateStateStub.restore();
			oContextDataCtrlUpdateStub.restore();
			oWebAppInitStub.restore();
			oWebAppFeedbackCtrlLoadAPIStub.restore();
			oWebAppReloadInterceptsStub.restore();
		});
	});

	QUnit.test("App loaded callback on unchanged state", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oShellUIServiceDummy = {
			name: "shell"
		};

		var oWebAppInitStub = sinon.stub(WebAppFeedbackLoader.prototype, "init");
		var oWebAppFeedbackCtrlLoadAPIStub = sinon.stub(WebAppFeedbackLoader.prototype, "loadAPI");
		var oWebAppReloadInterceptsStub = sinon.stub(WebAppFeedbackLoader.prototype, "reloadIntercepts");
		var oContextDataCtrlInitStub = sinon.stub(ContextDataController.prototype, "init");
		var oContextDataCtrlUpdateStub = sinon.stub(ContextDataController.prototype, "updateContextData").returns(new Promise(function(
			resolve, reject) {
			resolve();
		}));
		var oShellBarBtnUpdateStateStub = sinon.stub(ShellBarButton.prototype, "updateButtonState").returns(Constants.E_SHELLBAR_BUTTON_STATE
			.unchanged);
		var oShellBarBtnDummy = new ShellBarButton(null, null, null);

		// action
		var oPluginController = new PluginController(oConfigDummy, null, null, oShellUIServiceDummy);
		oPluginController._oShellButton = oShellBarBtnDummy;
		oPluginController._initContextData();
		oPluginController._initWebAppFeedback();
		var oResultPromise = oPluginController._onAppLoaded();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oContextDataCtrlUpdateStub.called);
			assert.ok(oShellBarBtnUpdateStateStub.called);
			assert.ok(oWebAppReloadInterceptsStub.notCalled);
		}).finally(function() {
			//teardown
			oContextDataCtrlInitStub.restore();
			oShellBarBtnUpdateStateStub.restore();
			oContextDataCtrlUpdateStub.restore();
			oWebAppInitStub.restore();
			oWebAppFeedbackCtrlLoadAPIStub.restore();
			oWebAppReloadInterceptsStub.restore();
		});
	});
});