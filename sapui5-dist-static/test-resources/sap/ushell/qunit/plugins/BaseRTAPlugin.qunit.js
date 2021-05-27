// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.require([
	"sap/ui/thirdparty/jquery",
	"sap/ushell/plugin/utils/TestUtil",
	"sap/base/Log",
	"sap/base/util/UriParameters",
	"sap/ushell/plugins/rta/Component",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Renderer",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/thirdparty/sinon-4"
],
function (
	jQuery,
	TestUtil,
	Log,
	UriParameters,
	RTAPlugin,
	AppLifeCycleUtils,
	CheckConditions,
	Renderer,
	Trigger,
	MessageBox,
	BusyIndicator,
	sinon
) {
	"use strict";
	QUnit.start();

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given an application that is not of type UI5", {
		beforeEach: function () {
			var oContainer = TestUtil.createContainerObject.call(this, "notUI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when a new app of type UI5 gets loaded", function (assert) {
			AppLifeCycleUtils.getContainer.restore();
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			var oAdaptButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");
			this.oPlugin._onAppLoaded();
			assert.ok(oAdaptButtonVisilibitySpy.lastCall.args[1], "then the button was set to visible");
		});
	});

	QUnit.module("Given a application that is of type UI5", {
		beforeEach: function () {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when a new app (not UI5) gets loaded", function (assert) {
			AppLifeCycleUtils.getContainer.restore();
			var oContainer = TestUtil.createContainerObject.call(this, "notUI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			assert.notOk(CheckConditions.checkUI5App(), "_checkUI5App returns false");

			var oAdaptButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");
			this.oPlugin._onAppLoaded();
			assert.notOk(oAdaptButtonVisilibitySpy.lastCall.args[1], "then the button was set to invisible");
		});

		QUnit.test("when RTA gets started with the correct browser", function (assert) {
			var oOriginalBrowserObject = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.ui.Device.browser.edge = true;

			var oErrorBoxStub = sandbox.stub(MessageBox, "error");
			var oStartRtaStub = sandbox.stub(Trigger.prototype, "triggerStartRta");
			this.oPlugin._onAdapt();
			assert.equal(oErrorBoxStub.callCount, 0, "the Error MessageBox was not shown");
			assert.equal(oStartRtaStub.callCount, 1, "_startRta got called");

			sap.ui.Device.browser = oOriginalBrowserObject;
		});

		QUnit.test("when RTA gets started with the manifest entry flexEnabled=false", function (assert) {
			sandbox.stub(CheckConditions, "checkFlexEnabledOnStart").returns(false);
			var oHandleFlexDisabledStub = sandbox.stub(Trigger.prototype, "handleFlexDisabledOnStart");
			var oStartRtaStub = sandbox.stub(Trigger.prototype, "triggerStartRta");

			this.oPlugin._onAdapt();
			assert.equal(oStartRtaStub.callCount, 0, "_startRta didn't get called");
			assert.equal(oHandleFlexDisabledStub.callCount, 1, "_handleFlexDisabledOnStart did get called");
		});
	});

	QUnit.module("Given a UI5 application and restart enabled", {
		beforeEach: function () {
			this.sStorageKey = "sap.ui.rta.restart.CUSTOMER";
			window.sessionStorage.removeItem(this.sStorageKey);
			window.sessionStorage.setItem(this.sStorageKey, true);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("When the plugin gets initialized", function (assert) {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			var oRestartStub = sandbox.stub(Trigger.prototype, "triggerStartRta");
			this.oPlugin = new RTAPlugin();
			assert.equal(oRestartStub.callCount, 1, "then RTA Start is triggered");
			assert.notOk(window.sessionStorage.getItem(this.sStorageKey), "the item got deleted from the storage");
		});
	});

	QUnit.module("Given a UI5 application and restart in VENDOR layer enabled", {
		beforeEach: function () {
			this.sStorageKey = "sap.ui.rta.restart.VENDOR";
			window.sessionStorage.removeItem(this.sStorageKey);
			window.sessionStorage.setItem(this.sStorageKey, true);
			var oStub = sandbox.stub(UriParameters.prototype, "get");
			oStub.withArgs("sap-ui-layer").returns("VENDOR");
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("When the plugin gets initialized", function (assert) {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			var oRestartStub = sandbox.stub(Trigger.prototype, "triggerStartRta");
			this.oPlugin = new RTAPlugin();
			assert.equal(oRestartStub.callCount, 1, "then RTA Start is triggered");
			assert.notOk(window.sessionStorage.getItem(this.sStorageKey), "the item got deleted from the storage");
		});
	});

	QUnit.module("Error handling in the plugin", {
		before: function () {
			this.RtaUtils = sap.ui.requireSync("sap/ui/rta/Utils");
		},
		beforeEach: function () {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
			this.oBusyIndicatorHideStub = sandbox.stub(BusyIndicator, "hide");
			this.oMessageBoxErrorStub = sandbox.stub(MessageBox, "error");
			this.oErrorLogStub = sandbox.stub(Log, "error");
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when an error occurs with no specific error", function (assert) {
			var fnDone = assert.async();

			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils", "sap/m/MessageBox"])
				.callsFake(function (sResourceName, fnResolve) {
					fnResolve(this.RtaUtils, MessageBox);
					assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
					fnDone();
				}.bind(this));

			this.oPlugin._onErrorHandler(new Error());
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "an error is logged");
		});

		QUnit.test("when an error occurs with 'Reload triggered' instead of an Error", function (assert) {
			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils", "sap/m/MessageBox"])
				.callsFake(function (sResourceName, fnResolve) {
					fnResolve(this.RtaUtils, MessageBox);
					assert.strictEqual(this.oMessageBoxErrorStub.callCount, 0, "no error MessageBox is shown");
				}.bind(this));

			this.oPlugin._onErrorHandler("Reload triggered");
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oErrorLogStub.callCount, 0, "no error is logged");
		});

		QUnit.test("when an error occurs with an 'Reload triggered' Error", function (assert) {
			var fnDone = assert.async();

			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils", "sap/m/MessageBox"])
				.callsFake(function (sResourceName, fnResolve) {
					fnResolve(this.RtaUtils, MessageBox);
					assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
					fnDone();
				}.bind(this));

			this.oPlugin._onErrorHandler(new Error("Reload triggered"));
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "an error is logged");
		});

		QUnit.test("when an error comes as a string", function (assert) {
			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils", "sap/m/MessageBox"])
				.callsFake(function (sResourceName, fnResolve) {
					fnResolve(this.RtaUtils, MessageBox);
					assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error  MessageBox is shown");
				}.bind(this));

			this.oPlugin._onErrorHandler("Some error happens");
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "no error is logged");
		});
	});

	QUnit.module("Given a application that is of type UI5 and a renderer returned in the created callback", {
		beforeEach: function (assert) {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5", true, false, assert);
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
			return Renderer.createActionButton(this.oPlugin, function () {}, true);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the renderer created event is thrown", function (assert) {
			assert.expect(4);
			this.oPlugin.destroy();
			assert.ok(this.mAddActionParameters.visible, "the action button still got added");
			assert.equal(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
			assert.equal(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
		});
	});

	QUnit.module("Given a application that is of type UI5 and no renderer returned in the created callback", {
		beforeEach: function (assert) {
			var oContainer = TestUtil.createContainerObject.call(this, "UI5", true, true, assert);
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
			return Renderer.createActionButton(this.oPlugin, function () {}, true);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the renderer created event is thrown", function (assert) {
			assert.expect(4);
			this.oPlugin.destroy();
			assert.notOk(this.mAddActionParameters, "the action button didn't get added");
			assert.equal(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
			assert.equal(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
		});
	});
});