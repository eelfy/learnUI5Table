// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.require([
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/plugin/utils/TestUtil",
	"sap/ui/thirdparty/sinon-4"
],
function (
	CheckConditions,
	AppLifeCycleUtils,
	TestUtil,
	sinon
) {
	"use strict";
	QUnit.start();

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given an application that is not of type UI5", {
		beforeEach: function (assert) {
			var oContainer = TestUtil.createContainerObject.call(this, "notUI5");
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(oContainer);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("checkUI5App when the plugin gets initialized", function (assert) {
			assert.notOk(CheckConditions.checkUI5App(), "checkUI5App returns false");
		});
	});

	QUnit.module("Given a application that is of type UI5", {
		beforeEach: function (assert) {
			this.oContainer = TestUtil.createContainerObject.call(this, "UI5", undefined, undefined, undefined, true/*flexEnabled*/);
			sandbox.stub(AppLifeCycleUtils, "getContainer").returns(this.oContainer);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("checkUI5App when the plugin gets initialized", function (assert) {
			assert.ok(CheckConditions.checkUI5App(), "checkUI5App returns true");
		});

		QUnit.test("when checkFlexEnabledOnStart is called", function (assert) {
			var oAppDescriptor = {
				"sap.ui5": {
					flexEnabled: true
				}
			};
			sandbox.stub(CheckConditions, "_getAppDescriptor").returns(oAppDescriptor);
			assert.ok(CheckConditions.checkFlexEnabledOnStart(), "the function returns true");

			oAppDescriptor["sap.ui5"].flexEnabled = false;
			assert.notOk(CheckConditions.checkFlexEnabledOnStart(), "the function returns false");

			oAppDescriptor["sap.ui5"].flexEnabled = undefined;
			assert.ok(CheckConditions.checkFlexEnabledOnStart(), "the function returns true");

			delete oAppDescriptor["sap.ui5"].flexEnabled;
			assert.ok(CheckConditions.checkFlexEnabledOnStart(), "the function returns true");
		});

		QUnit.test("checkRestartRTA is called and restart is not triggert via session storage", function (assert) {
			var sLayer = "CUSTOMER";
			assert.notOk(CheckConditions.checkRestartRTA(sLayer), "checkFlexEnabledOnStart returns false");
		});

		QUnit.test("checkRestartRTA is called and restart is triggert via session storage", function (assert) {
			var sKey = "sap.ui.rta.restart.CUSTOMER";
			window.sessionStorage.setItem(sKey, true);
			var sLayer = "CUSTOMER";
			assert.ok(CheckConditions.checkRestartRTA(sLayer), "checkFlexEnabledOnStart returns true");
			assert.notOk(window.sessionStorage.getItem(sKey), "then sessionstorage is cleand up again");
		});
	});
});