/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRequestOptions');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.modeler.ui.controller.requestOptions');
jQuery.sap.require('sap.apf.cloudFoundry.uiHandler');
(function() {
	'use strict';
	QUnit.module("test cloud foundry value help: on cf", {
		beforeEach : function() {
			var that = this;
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				isUsingCloudFoundryProxy: function() {
					return true;
				}
			};
			this.spyIsUsingCloudFoundryProxy = sinon.spy(this.oCoreApi, "isUsingCloudFoundryProxy");
			this.oController = new sap.ui.controller("sap.apf.modeler.ui.controller.requestOptions");
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
			this.stubShowValueHelp = sinon.stub(sap.apf.cloudFoundry.uiHandler, "showValueHelp");
		},
		afterEach : function() {
			this.stubShowValueHelp.restore();
		}
	});
	QUnit.test("handle show value help request", function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyIsUsingCloudFoundryProxy.calledOnce, "isUsingCloudFoundryProxy is called once");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].oTextReader, this.oTextReader, "showValueHelp is called with the text reader");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].parentControl, parent, "showValueHelp is called with the parent control");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].getCalatogServiceUri, this.getCalatogServiceUri, "showValueHelp is called with the catalog service uri");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[1], this.oCoreApi, "showValueHelp is called with the core api");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[2], this.oController, "showValueHelp is called with the controller");
	});

	QUnit.module("test cloud foundry value help: not on cf", {
		beforeEach : function() {
			var that = this;
			this.orgView = sap.ui.view;
			this.spyView = sinon.spy();
			sap.ui.view = this.spyView;
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				isUsingCloudFoundryProxy: function() {
					return false;
				}
			};
			this.spyIsUsingCloudFoundryProxy = sinon.spy(this.oCoreApi, "isUsingCloudFoundryProxy");
			this.oController = new sap.ui.controller("sap.apf.modeler.ui.controller.requestOptions");
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
		},
		afterEach : function() {
			sap.ui.view = this.orgView;
		}
	});
	QUnit.test("handle show value help request", function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyIsUsingCloudFoundryProxy.calledOnce, "isUsingCloudFoundryProxy is called once");
		assert.ok(this.spyView.calledOnce, "sap.ui.view is called once");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.oTextReader, this.oTextReader, "sap.ui.view is called with the text reader in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.parentControl, parent, "sap.ui.view is called with the parent control in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewData.getCalatogServiceUri, this.getCalatogServiceUri, "sap.ui.view is called with the catalog service uri in the view data");
		assert.strictEqual(this.spyView.firstCall.args[0].viewName, "sap.apf.modeler.ui.view.catalogService", "sap.ui.view is called to show the catalog service view");
	});
}());
