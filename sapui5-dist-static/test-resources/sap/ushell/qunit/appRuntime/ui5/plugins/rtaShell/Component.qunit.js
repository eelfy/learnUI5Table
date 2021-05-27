// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/appRuntime/ui5/plugins]");
sap.ui.require([
	"sap/ui/thirdparty/jquery",
	"sap/ushell/plugin/utils/TestUtil",
	"sap/base/i18n/ResourceBundle",
	"sap/ushell/appRuntime/ui5/plugins/rtaShell/Component",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
	"sap/m/Button",
	"sap/ui/thirdparty/sinon-4"
],
function (
	jQuery,
	TestUtil,
	ResourceBundle,
	RTAPlugin,
	AppLifeCycleUtils,
	Renderer,
	Button,
	sinon
) {
	"use strict";
	QUnit.start();

	var sandbox = sinon.sandbox.create();
	var sPostMessageGroupId = "user.postapi.rtaPlugin";
	var sStartUIAdaptationPostMessageId = "startUIAdaptation";
	var sAppType = "Shell";

	function instantiatePlugin () {
		var oContainer = TestUtil.createContainerObject.call(this, sAppType);
		sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
		this.oRegisterPostMessageAPIsStub = sandbox.stub();
		this.oPostMessageToAppStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
		this.oPlugin = new RTAPlugin(TestUtil.createComponentData.call(this));
	}

	function getServiceCallFunction (sFunctionName, oRegisterPostMessageAPIsStub) {
		var mPostMessageRegistration = oRegisterPostMessageAPIsStub.lastCall.args[0][sPostMessageGroupId];
		return mPostMessageRegistration.inCalls[sFunctionName].executeServiceCallFn;
	}

	function createFioriHeaderMock (oAddStyleClassStub, oRemoveStyleClassStub) {
		return {
			addStyleClass: oAddStyleClassStub || sandbox.stub(),
			removeStyleClass: oRemoveStyleClassStub || sandbox.stub()
		};
	}

	function createRendererMock (oHeaderMock) {
		return {
			getRootControl: function () {
				return {
					getOUnifiedShell: function () {
						return {
							getHeader: function () {
								return oHeaderMock;
							}
						};
					}
				};
			}
		};
	}

	QUnit.module("Given the component is instantiated", {
		beforeEach: function () {
			instantiatePlugin.call(this);
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when app gets loaded and is not enabled for key user adaptation", function (assert) {
			var mInitialConfiguration = this.oPlugin.mConfig;
			assert.strictEqual(mInitialConfiguration.sComponentName, "sap.ushell.appRuntime.ui5.plugins.rtaShell",
				"then the component name is set");
			assert.strictEqual(mInitialConfiguration.layer, "CUSTOMER", "then the layer is set");
			assert.ok(mInitialConfiguration.id, "then the button id is prepared");
			assert.ok(mInitialConfiguration.text, "then the button text is prepared");
			assert.ok(mInitialConfiguration.icon.includes("sap-icon://"), "then the icon is prepared");
			assert.notOk(mInitialConfiguration.visible, "then the visibility of the button is initially set to 'false'");
			var mPostMessageRegistration = this.oRegisterPostMessageAPIsStub.getCall(0).args[0][sPostMessageGroupId];
			assert.strictEqual(typeof mPostMessageRegistration.inCalls.activatePlugin.executeServiceCallFn, "function",
				"then the 'activatePlugin' function is registered as inCall in the post message interface");
			assert.strictEqual(typeof mPostMessageRegistration.inCalls.showAdaptUI.executeServiceCallFn, "function",
				"then the 'showAdaptUI' function is registered as inCall in the post message interface");
			assert.strictEqual(typeof mPostMessageRegistration.inCalls.switchToolbarVisibility.executeServiceCallFn, "function",
				"then the 'switchToolbarVisibility' function is registered as inCall in the post message interface");
			assert.ok(typeof mPostMessageRegistration.outCalls.startUIAdaptation,
				"then the 'startUIAdaptation' function is registered as outCall in the post message interface");
		});

		QUnit.test("when 'exit' function is called", function (assert) {
			var oDetachAppLoadedStub = sandbox.stub()
				.callsFake(function (onAppLoaded) {
					assert.strictEqual(typeof onAppLoaded, "function",
						"then handler function for 'AppLifeCycleService.onAppLoadded' event is detached");
				});
			AppLifeCycleUtils.getContainer.restore();
			var oDetachRendererCreatedEventStub = sandbox.stub();
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns({
				getService: function () {
					return {
						detachAppLoaded: oDetachAppLoadedStub
					};
				},
				detachRendererCreatedEvent: oDetachRendererCreatedEventStub
			});
			var oRemoveStyleClassStub = sandbox.stub();
			this.oPlugin._oFioriHeader = {
				removeStyleClass: oRemoveStyleClassStub
			};
			this.oPlugin._onRendererCreated = sandbox.stub();
			this.oPlugin.exit();
			assert.ok(oRemoveStyleClassStub.called, "then 'oRemoveStyleClassStub' function is called");
			assert.ok(oDetachAppLoadedStub.called, "then 'detachAppLoaded' is called");
			assert.ok(oDetachRendererCreatedEventStub.called, "then 'detachRendererCreatedEvent' is called");
			assert.strictEqual(oDetachRendererCreatedEventStub.getCall(0).args[0], this.oPlugin._onRendererCreated,
				"then the '_onRendererCreated' function is passed as parameter to 'detachRendererCreatedEvent'");
		});

		function stubGetContainerWithAttachAppLoadedAssertion (assert, fnDone) {
			var fnAttachAppLoaded = function (onAppLoaded) {
				assert.strictEqual(typeof onAppLoaded, "function",
					"then handler function for 'AppLifeCycleService.onAppLoadded' event is attached");
				fnDone();
			};
			var oContainer = TestUtil.createContainerObject.call(this, sAppType,
				undefined, undefined, undefined, undefined, fnAttachAppLoaded);
			AppLifeCycleUtils.getContainer.restore();
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
		}

		QUnit.test("when 'activatePlugin' is triggered by post message call", function (assert) {
			var fnDone = assert.async(2);
			var fnExecuteServiceCallFn = getServiceCallFunction("activatePlugin", this.oRegisterPostMessageAPIsStub);
			var oFioriHeaderMock = createFioriHeaderMock();
			var oRendererMock = createRendererMock(oFioriHeaderMock);
			var oGetRendererStub = sandbox.stub(Renderer, "getRenderer").resolves(oRendererMock);
			var oCreateActionButtonStub = sandbox.stub(Renderer, "createActionButton");
			stubGetContainerWithAttachAppLoadedAssertion(assert, fnDone);

			assert.notOk(this.oPlugin.bIsInitialized,
				"then BEFORE post message service call the plugin is not marked as initialized");
			fnExecuteServiceCallFn()
				.done(function () {
					assert.ok(this.oPlugin.mConfig.i18n instanceof ResourceBundle, "then the resource bundle is prepared");
					assert.ok(this.oPlugin.bIsInitialized,
						"then AFTER post message service call the plugin is marked as initialized");
					assert.ok(oGetRendererStub.called, "then the 'getRenderer' function is called");
					assert.deepEqual(this.oPlugin.oRenderer, oRendererMock, "then the renderer is attached to the plugin");
					assert.deepEqual(this.oPlugin._oFioriHeader, oFioriHeaderMock, "then the fiori header is attached to the plugin");
					assert.ok(oCreateActionButtonStub, "then 'Renderer.createActionButton' function is called");
					assert.strictEqual(typeof oCreateActionButtonStub.lastCall.args[1], "function",
						"then 'handler' function is passed to the actionButton");
					assert.strictEqual(oCreateActionButtonStub.lastCall.args[2], false,
						"then visibility of the button is set to 'false'");
					fnDone();
				}.bind(this));

		});

		QUnit.test("when 'activatePlugin' is triggered by post message call and execution breaks", function (assert) {
			var fnDone = assert.async();
			sandbox.stub(Renderer, "getRenderer").rejects(new Error("Error_test"));
			var fnExecuteServiceCallFn = getServiceCallFunction("activatePlugin", this.oRegisterPostMessageAPIsStub);
			var oAttachAppLoadedStub = sandbox.stub();
			var oContainer = TestUtil.createContainerObject.call(this, sAppType,
				undefined, undefined, undefined, undefined, oAttachAppLoadedStub);
			AppLifeCycleUtils.getContainer.restore();
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);

			fnExecuteServiceCallFn()
				.done(function () {
					assert.notOk(true, "then done shouldn't be called");
				})
				.fail(function () {
					assert.ok(this.oPlugin.mConfig.i18n instanceof ResourceBundle, "then the resource bundle is prepared");
					assert.notOk(this.oPlugin.bIsInitialized,
						"then AFTER post message service call the plugin is NOT marked as initialized");
					assert.notOk(oAttachAppLoadedStub.called, "then the 'attachAppLoaded' function is not called");
					fnDone();
				}.bind(this));
		});
	});

	QUnit.module("Given the component is instantiated and activated via post message call", {
		beforeEach: function () {
			instantiatePlugin.call(this);
			this.oAddStyleClassStub = sandbox.stub();
			this.oRemoveStyleClassStub = sandbox.stub();
			this.oCreateActionButtonStub = sandbox.stub(Renderer, "createActionButton");
			var oFioriHeaderMock = createFioriHeaderMock(this.oAddStyleClassStub, this.oRemoveStyleClassStub);
			var oRendererMock = createRendererMock(oFioriHeaderMock);
			sandbox.stub(Renderer, "getRenderer").resolves(oRendererMock);
			var fnExecuteServiceCallFn = getServiceCallFunction("activatePlugin", this.oRegisterPostMessageAPIsStub);
			return new Promise(function (resolve, reject) {
				fnExecuteServiceCallFn().then(resolve, reject);
			});
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		function createServiceParameters (bVisible) {
			return {
				oMessageData: {
					body: {
						visible: bVisible
					}
				}
			};
		}

		[true, false].forEach(function (bVisible) {
			QUnit.test("when 'switchToolbarVisibility' functionality is triggered " +
				(bVisible ? "ON" : "OFF") + " by post message call", function (assert) {
				var fnDone = assert.async();
				var fnExecuteServiceCallFn = getServiceCallFunction("switchToolbarVisibility", this.oRegisterPostMessageAPIsStub);
				var oServiceParams = createServiceParameters(bVisible);
				fnExecuteServiceCallFn(oServiceParams)
					.done(function () {
						var stubName = bVisible ? "oRemoveStyleClassStub" : "oAddStyleClassStub";
						assert.ok(this[stubName].called, "then the styleclass is " +
							(bVisible ? "removed from" : "added to") + " the header control");
						fnDone();
					}.bind(this));
			});
		});

		function createButton (sId, sVisible) {
			var oButton = new Button(sId, {
				visible: sVisible
			});
			oButton.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			return oButton;
		}

		QUnit.test("when 'showAdaptUI' functionality is triggered by post message call", function (assert) {
			var fnDone = assert.async();
			var oButton = createButton(this.oPlugin.mConfig.id, false);
			var fnExecuteServiceCallFn = getServiceCallFunction("showAdaptUI", this.oRegisterPostMessageAPIsStub);
			assert.notOk(oButton.getVisible(), "then the action button is not visible before service call is triggered");
			fnExecuteServiceCallFn()
				.done(function () {
					assert.ok(oButton.getVisible(), "then the action button is set to visible 'true' afterwards");
					oButton.destroy();
					fnDone();
				});
		});

		QUnit.test("when 'showAdaptUI' functionality is triggered by post message call and action button do not exist", function (assert) {
			var fnDone = assert.async();
			var fnExecuteServiceCallFn = getServiceCallFunction("showAdaptUI", this.oRegisterPostMessageAPIsStub);
			fnExecuteServiceCallFn()
				.done(function () {
					assert.ok(true, "then the function call don't break");
					fnDone();
				})
				.fail(function () {
					assert.notOk(true, "then the error shouldn't be thrown");
				});
		});

		QUnit.test("when 'onAppLoaded' function is called", function (assert) {
			var oButton = createButton(this.oPlugin.mConfig.id, true);
			assert.ok(oButton.getVisible(), "then the action button is visible before 'onAppLoaded' handler is called");
			this.oPlugin._onAppLoaded();
			assert.notOk(oButton.getVisible(), "then the action button is hiden after 'onAppLoaded' handler is called");
			oButton.destroy();
		});

		QUnit.test("when 'postStartUIAdaptationToApp' function is triggered", function (assert) {
			var fnPostStartUIAdaptationHandler = this.oCreateActionButtonStub.lastCall.args[1];
			this.oAddStyleClassStub.resetHistory();
			this.oPostMessageToAppStub.resetHistory();
			return fnPostStartUIAdaptationHandler()
				.then(function () {
					assert.ok(this.oAddStyleClassStub.calledOnce, 2,
						"then the hiding styleclass is added to the header (header gets invisible)");
					assert.ok(this.oPostMessageToAppStub.calledOnce,
						"then the postmessage 'postStartUIAdaptationToApp' is triggered");
					assert.strictEqual(this.oPostMessageToAppStub.lastCall.args[0], sPostMessageGroupId,
						"then the postmessage group id is provided");
					assert.strictEqual(this.oPostMessageToAppStub.lastCall.args[1], sStartUIAdaptationPostMessageId,
						"then the postmessage id is provided");
				}.bind(this));
		});
	});
});