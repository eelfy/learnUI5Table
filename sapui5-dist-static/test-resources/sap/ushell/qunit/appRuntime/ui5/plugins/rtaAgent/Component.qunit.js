// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/appRuntime/ui5/plugins]");
sap.ui.require([
	"sap/ui/thirdparty/jquery",
	"sap/ushell/appRuntime/ui5/plugins/rtaAgent/Component",
	"sap/ushell/plugin/utils/TestUtil",
	"sap/ui/fl/write/api/FeaturesAPI",
	"sap/base/i18n/ResourceBundle",
	"sap/base/Log",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
	"sap/m/MessageBox",
	"sap/ui/thirdparty/sinon-4"
],
function (
	jQuery,
	RTAPlugin,
	TestUtil,
	FlFeaturesAPI,
	ResourceBundle,
	Log,
	AppLifeCycleUtils,
	CheckConditions,
	Trigger,
	MessageBox,
	sinon
) {
	"use strict";
	QUnit.start();

	var sandbox = sinon.sandbox.create();
	var sPostMessageGroupId = "user.postapi.rtaPlugin";
	var sSwitchToolbarVisibilityPostMessageId = "switchToolbarVisibility";
	var sShowAdaptUIPostMessageId = "showAdaptUI";
	var sActivatePostMessageId = "activatePlugin";

	QUnit.module("Given a application that is of type UI5 but without key user enablement", {
		beforeEach: function () {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			// disables key user specific funtionality on start
			this.oIsKeyUserStub = sandbox.stub(FlFeaturesAPI, "isKeyUser").resolves(false);
			this.oRegisterPostMessageAPIsStub = sandbox.stub();
			this.oPostMessageToFlpStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
			this.oPlugin = new RTAPlugin(TestUtil.createComponentData.call(this));
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when app gets loaded and is not enabled for key user adaptation", function (assert) {
			var mInitialConfiguration = this.oPlugin.mConfig;
			assert.strictEqual(mInitialConfiguration.sComponentName, "sap.ushell.appRuntime.ui5.plugins.rtaAgent",
				"then the component name is set");
			assert.strictEqual(mInitialConfiguration.layer, "CUSTOMER", "then the layer is set");
			assert.strictEqual(mInitialConfiguration.developerMode, false, "then the developer mode is set");
			assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
		});
	});

	function createMockedContainer (assert, sAppType) {
		var fnAttachAppLoaded = function (onAppLoaded) {
			assert.strictEqual(typeof onAppLoaded, "function",
				"then handler function for 'AppLifeCycleService.onAppLoadded' event is attached");
		};
		return TestUtil.createContainerObject.call(this,
			sAppType, undefined, undefined, undefined, undefined, fnAttachAppLoaded);
	}

	function createDefaultStubs (oContainer) {
		sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
		this.oIsKeyUserStub = sandbox.stub(FlFeaturesAPI, "isKeyUser").resolves(true);
		this.oRegisterPostMessageAPIsStub = sandbox.stub();
		this.oPostMessageToFlpStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
		this.oRestartRtaIfRequiredSpy = sandbox.spy(RTAPlugin.prototype, "_restartRtaIfRequired");
		this.oGetAppLifeCycleServiceSpy = sandbox.spy(AppLifeCycleUtils, "getAppLifeCycleService");
	}

	function instantiatePlugin () {
		return new Promise(function (resolve) {
			var RTAPluginExtended = RTAPlugin.extend("test", {
				init: function () {
					return RTAPlugin.prototype.init.apply(this, arguments).then(resolve);
				}
			});
			this.oPlugin = new RTAPluginExtended(TestUtil.createComponentData.call(this));
		}.bind(this));
	}

	QUnit.module("Given a application that is of type UI5 and key user enabled", {
		beforeEach: function (assert) {
			var oContainer = createMockedContainer.call(this, assert, "UI5");
			createDefaultStubs.call(this, oContainer);
			return instantiatePlugin.call(this);
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when 'init' function is called and key user adaptation is enabled", function (assert) {
			var mConfig = this.oPlugin.mConfig;
			assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.getCall(0)),
				"then the postmessage 'activatePlugin' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[1], sActivatePostMessageId,
				"then the postmessage id is provided");
			assert.ok(mConfig.i18n instanceof ResourceBundle, "then 'i18n' resource bundle is instantiated");
			assert.ok(mConfig.onStartHandler, "then 'onStartHandler' is available");
			assert.ok(mConfig.onErrorHandler, "then 'onErrorHandler' is available");
			assert.ok(mConfig.onStopHandler, "then 'onStopHandler' is available");
			assert.ok(this.oPlugin.oTrigger instanceof Trigger, "then 'trigger' module is instantiated");
			var mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
			assert.strictEqual(typeof mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn, "function",
				"then the 'startUIAdaptation' function is registered as inCall in the post message interface");
			assert.ok(typeof mPostMessageRegistration.outCalls.activatePlugin,
				"then the 'activatePlugin' function is registered as outCall in the post message interface");
			assert.ok(typeof mPostMessageRegistration.outCalls.showAdaptUI,
				"then the 'showAdaptUI' function is registered as outCall in the post message interface");
			assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce, "then '_restartRtaIfRequired' function is called");
			assert.ok(this.oGetAppLifeCycleServiceSpy.called, "then 'getAppLifeCycleService' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.getCall(1)),
				"then the postmessage 'showAdaptUI' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(1).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(1).args[1], sShowAdaptUIPostMessageId,
				"then the postmessage id is provided");
		});

		QUnit.test("when 'init' function is called and an exception is thrown during execution", function (assert) {
			var sTestErrorMessage = "testError";
			this.oPlugin._restartRtaIfRequired.restore();
			sandbox.stub(this.oPlugin, "_restartRtaIfRequired").throws(new Error(sTestErrorMessage));
			var oErrorSpy = sandbox.spy(Log, "error");
			return this.oPlugin.init()
				.then(function () {
					assert.strictEqual(oErrorSpy.getCall(0).args[0].message, sTestErrorMessage, "then the error is logged in console");
				});
		});

		QUnit.test("when 'startUIAdaptation' is triggered by post message call", function (assert) {
			var mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
			var fnExecuteServiceCallFn = mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn;
			var oTriggerStartRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStartRta");
			var oReturn = fnExecuteServiceCallFn();
			assert.ok(oTriggerStartRtaStub.calledOnce, "then the trigger start rta function is called");
			assert.notStrictEqual(oReturn, undefined, "then the function returns a promise");
		});

		QUnit.test("when '_restartRtaIfRequired' function is called", function (assert) {
			var oTriggerStartRtaStub = sandbox.stub(this.oPlugin.oTrigger, "triggerStartRta");
			var oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
			var oCheckRestartRTAStub = sandbox.stub(CheckConditions, "checkRestartRTA").returns(true);
			return this.oPlugin._restartRtaIfRequired()
				.then(function () {
					assert.ok(oCheckUI5AppSpy.calledOnce, "then 'checkUI5App' function is called");
					assert.ok(oCheckRestartRTAStub.calledOnce, "then 'checkRestartRTA' function is called");
					var oMessageContent = { visible: false };
					assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
						"then the postmessage 'switchToolbarVisibility' is triggered");
					assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
						"then the postmessage group id is provided");
					assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
						"then the postmessage id is provided");
					assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], oMessageContent,
						"then the postmessage content is provided");
					assert.ok(oTriggerStartRtaStub.calledOnce, "then 'triggerStartRta' function is called");
				}.bind(this));
		});

		QUnit.test("when the app gets loaded", function (assert) {
			var oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
			this.oPlugin._onAppLoaded();
			assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
			assert.ok(!!(this.oRestartRtaIfRequiredSpy.called), "then '_restartRtaIfRequired' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
				"then the postmessage 'switchToolbarVisibility' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sShowAdaptUIPostMessageId,
				"then the postmessage id is provided");
		});

		QUnit.test("when the rta gets stopped", function (assert) {
			var oExitRtaStub = sandbox.stub(this.oPlugin.oTrigger, "exitRta");
			this.oPlugin._onStopHandler();
			assert.ok(oExitRtaStub.called, "then 'exitRta' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
				"then the postmessage 'switchToolbarVisibility' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
				"then the postmessage id is provided");
			assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], { visible: true },
				"then the postmessage content is provided");
		});

		QUnit.test("when 'reload triggered' error gets thrown during rta execution", function (assert) {
			var oErrorHandlerStub = sandbox.stub(this.oPlugin.oTrigger, "errorHandler");
			var oErrorLogSpy = sandbox.spy(Log, "error");
			this.oPlugin._onErrorHandler("Reload triggered");
			assert.ok(oErrorHandlerStub.calledOnce, "then 'errorHandler' function is called");
			assert.notOk(oErrorLogSpy.called, "then the error is not logged in the console");
		});

		QUnit.test("when error gets thrown during rta execution", function (assert) {
			var fnDone = assert.async();
			var oErrorHandlerStub = sandbox.stub(this.oPlugin.oTrigger, "errorHandler");
			var oErrorLogStub = sandbox.stub(Log, "error");
			var oMessageBoxErrorStub = sandbox.stub(MessageBox, "error");
			var RtaUtils = { getRtaStyleClassName: function () { return "rtaStyleClassName"; }};
			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils", "sap/m/MessageBox"])
				.callsFake(function (sResourceName, fnResolve) {
					fnResolve(RtaUtils, MessageBox);
					assert.strictEqual(oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
					fnDone();
				});
			this.oPlugin._onErrorHandler(new Error("test_error"));
			assert.ok(oErrorHandlerStub.calledOnce, "then 'errorHandler' function is called");
			assert.ok(oErrorLogStub.calledOnce, "then the error is not logged in the console");
		});

		QUnit.test("when 'exit' function is called", function (assert) {
			var oDetachAppLoadedStub = sandbox.stub()
				.callsFake(function (onAppLoaded) {
					assert.strictEqual(typeof onAppLoaded, "function",
						"then handler function for 'AppLifeCycleService.onAppLoadded' event is detached");
				});
			AppLifeCycleUtils.getContainer.restore();
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns({
				getService: function () {
					return {
						detachAppLoaded: oDetachAppLoadedStub
					};
				}
			});
			this.oPlugin.exit();
			assert.ok(oDetachAppLoadedStub.called, "then 'detachAppLoaded' is called");
			assert.ok(!!(this.oPostMessageToFlpStub.getCall(2)),
				"then the postmessage 'switchToolbarVisibility' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(2).args[1], sSwitchToolbarVisibilityPostMessageId,
				"then the postmessage id is provided");
			assert.deepEqual(this.oPostMessageToFlpStub.getCall(2).args[2], { visible: true },
				"then the postmessage content is provided");
		});
	});

	QUnit.module("Given an application that is not UI5 and backend is enabled for key user adaptation", {
		beforeEach: function (assert) {
			var oContainer = createMockedContainer.call(this, assert, "notUI5");
			createDefaultStubs.call(this, oContainer);
			return instantiatePlugin.call(this);
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when 'init' function is called", function (assert) {
			var mConfig = this.oPlugin.mConfig;
			assert.ok(this.oIsKeyUserStub.calledOnce, "then the 'isKeyUser' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.called),
				"then the postmessage 'activatePlugin' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.getCall(0).args[1], sActivatePostMessageId,
				"then the postmessage id is provided");
			assert.ok(mConfig.i18n instanceof ResourceBundle, "then 'i18n' resource bundle is instantiated");
			assert.ok(mConfig.onStartHandler, "then 'onStartHandler' is available");
			assert.ok(mConfig.onErrorHandler, "then 'onErrorHandler' is available");
			assert.ok(mConfig.onStopHandler, "then 'onStopHandler' is available");
			assert.ok(this.oPlugin.oTrigger instanceof Trigger, "then 'trigger' module is instantiated");
			var mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
			assert.strictEqual(typeof mPostMessageRegistration.inCalls.startUIAdaptation.executeServiceCallFn, "function",
				"then the 'startUIAdaptation' function is registered as inCall in the post message interface");
			assert.ok(typeof mPostMessageRegistration.outCalls.activatePlugin,
				"then the 'activatePlugin' function is registered as outCall in the post message interface");
			assert.ok(typeof mPostMessageRegistration.outCalls.showAdaptUI,
				"then the 'showAdaptUI' function is registered as outCall in the post message interface");
			assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce, "then '_restartRtaIfRequired' function is called");
			assert.ok(this.oGetAppLifeCycleServiceSpy.called, "then 'getAppLifeCycleService' function is called");
			assert.notStrictEqual(this.oPostMessageToFlpStub.lastCall.args[1], sShowAdaptUIPostMessageId,
				"then the postmessage 'showAdaptUI' is NOT sent");
		});

		QUnit.test("when a new not UI5 app gets loaded", function (assert) {
			var oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
			this.oRestartRtaIfRequiredSpy.resetHistory();
			this.oPostMessageToFlpStub.resetHistory();
			this.oPlugin._onAppLoaded();
			assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
			assert.notOk(this.oRestartRtaIfRequiredSpy.called, "then '_restartRtaIfRequired' function is NOT called");
			assert.notOk(this.oPostMessageToFlpStub.called, "then the postmessage 'showAdaptUI' is NOT sent");
		});

		QUnit.test("when a new app of type UI5 gets loaded", function (assert) {
			AppLifeCycleUtils.getContainer.restore();
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			var oCheckUI5AppSpy = sandbox.spy(CheckConditions, "checkUI5App");
			this.oRestartRtaIfRequiredSpy.resetHistory();
			this.oPostMessageToFlpStub.resetHistory();
			this.oPlugin._onAppLoaded();
			assert.ok(oCheckUI5AppSpy.called, "then 'checkUI5App' function is called");
			assert.ok(this.oRestartRtaIfRequiredSpy.calledOnce, "then '_restartRtaIfRequired' function is called");
			assert.ok(!!(this.oPostMessageToFlpStub.called),
				"then the postmessage 'showAdaptUI' is triggered");
			assert.strictEqual(this.oPostMessageToFlpStub.lastCall.args[0], sPostMessageGroupId,
				"then the postmessage group id is provided");
			assert.strictEqual(this.oPostMessageToFlpStub.lastCall.args[1], sShowAdaptUIPostMessageId,
				"then the postmessage with id 'showAdaptUI' is provided");
		});
	});
});