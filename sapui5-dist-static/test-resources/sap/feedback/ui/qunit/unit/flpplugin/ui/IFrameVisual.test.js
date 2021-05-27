/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/ui/IFrameVisual",
	"sap/m/Dialog",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(IFrameVisual, Dialog, sinon, sinonQunit) {
	"use strict";

	QUnit.module("IFrameVisual unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("IFrameVisual init procedure");

	QUnit.test("ctor", function(assert) {
		// arrangement
		var oConfigDummy = {
			name: "config"
		};
		var oResourceBundleDummy = {
			name: "resources"
		};

		// action
		var oIFrameVisual = new IFrameVisual(oConfigDummy, oResourceBundleDummy);

		// assertions
		assert.equal(oIFrameVisual._oConfig, oConfigDummy);
		assert.equal(oIFrameVisual._oResourceBundle, oResourceBundleDummy);
	});

	QUnit.test("show", function(assert) {
		// arrangement
		var sUriDummy = "xyz.corp";
		var sContextDataUriDummy = "?abc=def";
		var oIFrameDummy = {
			name: "iframe"
		};
		var oDialogSettings = {
			id: "dialogSettings"
		};
		var oUpdatedDialogSettings = {
			id: "dialogSettings",
			updated: true
		};
		var oIFrameVisualBuildUriStub = sinon.stub(IFrameVisual.prototype, "_buildUri").returns(sUriDummy);
		var oIFrameVisualAddIFrameStub = sinon.stub(IFrameVisual.prototype, "_addIFrame").returns(oIFrameDummy);
		var oIFrameVisualDefineDialogSettingsStub = sinon.stub(IFrameVisual.prototype, "_defineDialogSettings").returns(oDialogSettings);
		var oIFrameVisualUpdateDialogDimensionsStub = sinon.stub(IFrameVisual.prototype, "_updateDialogDimensions").returns(
			oUpdatedDialogSettings);
		var oDialogOpenStub = sinon.stub(Dialog.prototype, "open");

		// action
		var oIFrameVisual = new IFrameVisual(null, null);
		oIFrameVisual.show(sContextDataUriDummy);

		// assertions
		assert.ok(oIFrameVisualBuildUriStub.calledWith(sContextDataUriDummy));
		assert.ok(oIFrameVisualAddIFrameStub.calledWith(sUriDummy));
		assert.ok(oIFrameVisualDefineDialogSettingsStub.calledWith(oIFrameDummy));
		assert.ok(oIFrameVisualUpdateDialogDimensionsStub.calledWith(oDialogSettings));
		assert.equal(oIFrameVisual._oCurrentDialog.getId(), oDialogSettings.id);
		assert.ok(oDialogOpenStub.called);

		//teardown
		oIFrameVisualBuildUriStub.restore();
		oIFrameVisualAddIFrameStub.restore();
		oIFrameVisualDefineDialogSettingsStub.restore();
		oIFrameVisualUpdateDialogDimensionsStub.restore();
		oDialogOpenStub.restore();
	});

	QUnit.test("_buildUri", function(assert) {
		// arrangement
		var oConfigDummy = {
			getQualtricsUri: function() {
				return "abc.de.corp";
			}
		};
		var sContextDataUriDummy = "?abc=def";
		var sResultUriExpected = "abc.de.corp?abc=def";

		// action
		var oIFrameVisual = new IFrameVisual(oConfigDummy, null);
		var sResultUri = oIFrameVisual._buildUri(sContextDataUriDummy);

		// assertions
		assert.equal(sResultUri, sResultUriExpected);
	});
});