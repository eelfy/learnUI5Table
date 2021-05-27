sap.ui.define([
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/ControllerImplementation",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/base/util/isEmptyObject",
	"sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper"
], function(ControllerImplementation, ShareUtils, isEmptyObject, SemanticDateRangeHelper) {
	"use strict";
	var oOpenSharePopupStub;	
	QUnit.module("Fragment controller functions", {
		beforeEach: function(assert) {
			oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
			var oView = {
				byId: function() {
					return {
						focus: Function.prototype,
						setBeforePressHandler: Function.prototype
					};
				}
			};
			this.oController = {
				getView: sinon.stub().returns(oView),
				onSaveAsTileExtension : function() {}
			};
			this.oTemplateUtils = {
				oCommonUtils: {
					executeIfControlReady: {}
				},
				oComponentUtils: {
					getSettings: function() {}
				}
			};
			var oEvent = {
				getSource: sinon.stub().returns({})
			};
			var oSandbox = sinon.sandbox.create();
			var oController = this.oController;
			oSandbox.stub(this.oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
				var newFnHandler = fnHandler.bind(oController);
				newFnHandler(oEvent.getSource());
			});
			ControllerImplementation.getMethods(null, this.oTemplateUtils, this.oController).handlers.onShareListReportActionButtonPress.apply(this.oController, [oEvent]);
			this.oFragmentController = oOpenSharePopupStub.firstCall.args[2];
			assert.strictEqual(isEmptyObject(this.oFragmentController), false, "The fragment controller has been found.");
		},
		afterEach: function() {
			this.oController = null;
			this.oTemplateUtils = null;
			this.oFragmentController = null;
			oOpenSharePopupStub.restore();
			oOpenSharePopupStub = null;
		}
	});	
	QUnit.test("The fragmentController's getServiceUrl returns a string", function(assert) {
		// Arrange
		var oStub = sinon.stub(this.oFragmentController, "getDownloadUrl");
		oStub.onCall(0).returns("");
		sinon.stub(SemanticDateRangeHelper, "isServiceUrlAllowedBySemanticDateRangeFilter").returns(true);
		// Act
		var sResult = this.oFragmentController.getServiceUrl();
		// Assert
		assert.strictEqual(oStub.callCount, 1, "The function getDownloadUrl has been called once.");
		assert.strictEqual(sResult, "", "The correct service URL has been returned.");
		
		// Arrange
		var oDateSettings = {
			filterSettings: {
				dateSettings: {
					"useDateRange": true
				}
			}
		};
		sinon.stub(this.oTemplateUtils.oComponentUtils, "getSettings").returns(oDateSettings);
		oStub.onCall(1).returns("");
		// Act
		var sResult = this.oFragmentController.getServiceUrl();
		// Assert
		assert.strictEqual(sResult, "", "The correct service URL has been returned by using useDateRange property.");

		// Arrange
		oDateSettings.filterSettings.dateSettings = {
			selectedValues: []
		};
		oStub.onCall(2).returns("ServiceUrl");
		// Act
		var sResult = this.oFragmentController.getServiceUrl();
		// Assert
		assert.strictEqual(sResult, "ServiceUrl&$top=0&$inlinecount=allpages", "The correct service URL has been returned by mentioning specific date field with selectedvalues.");

		// Arrange
		oDateSettings.filterSettings.dateSettings = {
			fields: {
				DateField: {}
			}
		};
		// Act
		oStub.onCall(3).returns("ServiceUrl");
		var sResult = this.oFragmentController.getServiceUrl();
		// Assert
		assert.strictEqual(sResult, "ServiceUrl&$top=0&$inlinecount=allpages", "The correct service URL has been returned by mentioning specific date field without selectedvalues.");
	});	
});
