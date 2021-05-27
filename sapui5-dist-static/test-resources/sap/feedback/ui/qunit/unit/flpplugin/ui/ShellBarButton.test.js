/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/ui/ShellBarButton",
	"sap/feedback/ui/flpplugin/utils/Utils",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ShellBarButton, Utils, sinon, sinonQunit) {
	"use strict";

	QUnit.module("ShellBar button unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("ShellBar button init procedure");

	QUnit.test("ctor", function(assert) {
		// arrangement
		var fnRendererDummy = function() {

		};
		var fnDialogCallbackDummy = function() {

		};
		var oResourceBundleDummy = {
			name: "resources"
		};

		// action
		var oShellBarButton = new ShellBarButton(fnRendererDummy, fnDialogCallbackDummy, oResourceBundleDummy);

		// assertions
		assert.equal(oShellBarButton._fnRendererPromise, fnRendererDummy);
		assert.equal(oShellBarButton._fnDialogCallback, fnDialogCallbackDummy);
		assert.equal(oShellBarButton._oResourceBundle, oResourceBundleDummy);
	});

	QUnit.test("init", function(assert) {
		// arrangement
		var oAddHeaderEndItemStub = sinon.stub();
		var oRendererDummy = {
			addHeaderEndItem: oAddHeaderEndItemStub
		};
		var oHeaderOptionsDummy = {
			name: "headerOptions"
		};
		var fnRendererDummy = new Promise(function(resolve, reject) {
			resolve(oRendererDummy);
		});
		var fnDialogCallbackDummy = function() {

		};
		var oResourceBundleDummy = {
			name: "resources"
		};
		var oShellBarBtnCreateInvisibleTextStub = sinon.stub(ShellBarButton.prototype, "_createInvisibleText");
		var oShellBarBtnDefineButtonOptionsStub = sinon.stub(ShellBarButton.prototype, "_defineButtonOptions");

		// action
		var oShellBarButton = new ShellBarButton(fnRendererDummy, fnDialogCallbackDummy, oResourceBundleDummy);
		oShellBarButton._oHeaderItemOptions = oHeaderOptionsDummy;
		var oResultPromise = oShellBarButton.init();

		return oResultPromise.then(function() {
			// assertions
			assert.ok(oShellBarBtnCreateInvisibleTextStub.called);
			assert.ok(oShellBarBtnDefineButtonOptionsStub.called);
			assert.ok(oAddHeaderEndItemStub.calledWith("sap.ushell.ui.shell.ShellHeadItem", oHeaderOptionsDummy, true));
		}).finally(function() {
			//teardown
			oShellBarBtnCreateInvisibleTextStub.restore();
			oShellBarBtnDefineButtonOptionsStub.restore();
		});
	});

	QUnit.module("ShellBar button");
	QUnit.test("updateButtonState when UI5 app", function(assert) {
		// arrangement
		var oUtilsIsUI5AppStub = sinon.stub(Utils, "isUI5Application").returns(true);
		var oUtilsGetAppStub = sinon.stub(Utils, "getCurrentApp");
		var oShellBarBtnShowBtnStub = sinon.stub(ShellBarButton.prototype, "_showButton");

		// action
		var oShellBarButton = new ShellBarButton(null, null, null);
		oShellBarButton.updateButtonState();

		// assertions
		assert.ok(oUtilsIsUI5AppStub.called);
		assert.ok(oUtilsGetAppStub.called);
		assert.ok(oShellBarBtnShowBtnStub.called);

		//teardown
		oUtilsIsUI5AppStub.restore();
		oUtilsGetAppStub.restore();
		oShellBarBtnShowBtnStub.restore();
	});

	QUnit.test("updateButtonState when NOT UI5 app", function(assert) {
		// arrangement
		var oUtilsIsUI5AppStub = sinon.stub(Utils, "isUI5Application").returns(false);
		var oUtilsGetAppStub = sinon.stub(Utils, "getCurrentApp");
		var oShellBarBtnHideBtnStub = sinon.stub(ShellBarButton.prototype, "_hideButton");

		// action
		var oShellBarButton = new ShellBarButton(null, null, null);
		oShellBarButton.updateButtonState();

		// assertions
		assert.ok(oUtilsIsUI5AppStub.called);
		assert.ok(oUtilsGetAppStub.called);
		assert.ok(oShellBarBtnHideBtnStub.called);

		//teardown
		oUtilsIsUI5AppStub.restore();
		oUtilsGetAppStub.restore();
		oShellBarBtnHideBtnStub.restore();
	});
});