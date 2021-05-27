// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.require([
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/base/util/ObjectPath",
	"sap/ui/thirdparty/sinon-4"
],
function (
	AppLifeCycleUtils,
	ObjectPath,
	sinon
) {
	"use strict";
	QUnit.start();

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given ushell container with AppLifeCycle service", {
		beforeEach: function () {
			this.oGetCurrentApplicationStub = sandbox.stub();
			this.oContainer = {
				getService: function () {
					return {
						getCurrentApplication: this.oGetCurrentApplicationStub
					};
				}.bind(this)
			};
			this.oObjectPathGetStub = sandbox.stub(ObjectPath, "get").returns(this.oContainer);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("When getContainer is called", function (assert) {
			AppLifeCycleUtils.getContainer();
			assert.ok(this.oObjectPathGetStub.calledWith("sap.ushell.Container"), "then the ushell container is called");
		});

		QUnit.test("When getContainer is called without existing container", function (assert) {
			ObjectPath.get.restore();
			sandbox.stub(ObjectPath, "get").returns(undefined);
			assert.throws(function () {
				AppLifeCycleUtils.getContainer();
			}, /Illegal state: shell container not available; this component must be executed in a unified shell runtime context./,
			"then an exception is trown");
		});

		QUnit.test("When getAppLifeCycleService is called", function (assert) {
			var oGetServiceSpy = sandbox.spy(this.oContainer, "getService");
			var oGetContainerSpy = sandbox.spy(AppLifeCycleUtils, "getContainer");
			AppLifeCycleUtils.getAppLifeCycleService();
			assert.ok(oGetContainerSpy.calledOnce, "then the getContainer function is called");
			assert.ok(oGetServiceSpy.calledWith("AppLifeCycle"), "then the container is called for the AppLifeCycleService");
		});

		QUnit.test("When getCurrentRunningApplication is called", function (assert) {
			var oGetAppLifeCycleServiceSpy = sandbox.spy(AppLifeCycleUtils, "getAppLifeCycleService");
			AppLifeCycleUtils.getCurrentRunningApplication();
			assert.ok(oGetAppLifeCycleServiceSpy.calledOnce, "then the getAppLifeCycleService function is called");
			assert.ok(this.oGetCurrentApplicationStub.calledOnce,
				"then the getCurrentApplication function from AppLifeCycleService is called");
		});
	});

});