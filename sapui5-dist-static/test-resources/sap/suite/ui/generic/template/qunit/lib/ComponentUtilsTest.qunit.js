/**
 * tests for the sap.suite.ui.generic.template.lib.ComponentUtils
 */

sap.ui.define(["testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/lib/ComponentUtils"
	],
	function (sinon, ComponentUtils) {
		"use strict";

		var oSandbox;
		var oComponentUtils;

		var oTemplatePrivateGlobalModel = {
			"placeHolderValue": true
		};
		
		var oApplication = {
			getStatePreserver: function () {
				return {
					getAsStateChanger: Function.prototype
				};
			},
			getModel: sinon.stub().withArgs("_templPrivGlobal").returns(oTemplatePrivateGlobalModel)
		};
		
		var oComponent = {
			getAppComponent: sinon.stub().returns(oApplication)
		};

		var oView = {
			getModel: sinon.stub()
		};
		
		var oComponentRegistryEntry = {
			methods: {
				executeAfterInvokeActionFromExtensionAPI: Function.prototype,
				executeBeforeInvokeActionFromExtensionAPI: Function.prototype
			},
			oTemplateContract: {
				mRoutingTree: {
					route: {
						getPath: Function.prototype
					}
				},
				oNavigationControllerProxy: {
					preloadComponent: sinon.stub()
				}
			},
			route: "route",
			oControllerUtils: {
				oCommonUtils: {}
			},
			reuseComponentsReady: Promise.resolve([]),
			oApplication: oApplication,
			oController: {
				getView: sinon.stub().returns(oView)
			}
		};
		
		var oState = {};

		function fnGeneralSetup() {
			oSandbox = sinon.sandbox.create();
			oComponentUtils = new ComponentUtils(oComponent, oComponentRegistryEntry);
		}

		function fnGeneralTeardown() {
			oSandbox.restore();
		}

		module("lib.ComponentUtils Test the setup of an instance", {
			setup: fnGeneralSetup,
			teardown: fnGeneralTeardown
		});

		QUnit.test("Test that the ComponentUtils is registered correctly", function (assert) {
			assert.ok(!!oComponentUtils, "ComponentUtils was created");
		});

		QUnit.test("Test getTemplatePrivateGlobalModel method", function (assert) {
			//Invoke
			var oModel = oComponentUtils.getTemplatePrivateGlobalModel();

			//Assert
			assert.deepEqual(oTemplatePrivateGlobalModel, oModel, "Correct Model is returned");
		});

		QUnit.test("Test preloadComponent method", function (assert) {
			//Invoke
			 oComponentUtils.preloadComponent("C_STTA_SalesOrder_WD_20");

			//Assert
			assert.ok(oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy
				.preloadComponent.calledOnce, "Correct Model is returned");
			
			assert.deepEqual(oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy
				.preloadComponent.args[0][0], "C_STTA_SalesOrder_WD_20", "Correct Model is returned");
		});

		QUnit.test("Test isComponentDirty method - Model is dirty", function (assert) {
			// Prepare
			var oModel = {
				hasPendingChanges: sinon.stub().returns(true)
			};
			oView.getModel.returns(oModel);

			// Invoke
			var bIsDirty = oComponentUtils.isComponentDirty();

			// Assert
			assert.ok(oModel.hasPendingChanges.calledOnce, "Model dirty check was performed called");
			assert.deepEqual(oModel.hasPendingChanges.args[0][0], true, "hasPendingChanges was called to even check deffered changes");
			assert.ok(bIsDirty, "Component should be dirty because Model is dirty");
		});

		QUnit.test("Test isComponentDirty method - Model is not dirty & no custom unsaved calculation", function (assert) {
			// Prepare
			var oModel = {
				hasPendingChanges: sinon.stub().returns(false)
			};
			oView.getModel.returns(oModel);

			// Invoke
			var bIsDirty = oComponentUtils.isComponentDirty();

			// Assert
			assert.ok(oModel.hasPendingChanges.calledOnce, "Model dirty check was performed called");
			assert.deepEqual(oModel.hasPendingChanges.args[0][0], true, "hasPendingChanges was called to even check deffered changes");
			assert.ok(!bIsDirty, "Component should not be dirty because Model is not dirty & no custom usaved calculation");
		});

		QUnit.test("Test isComponentDirty method - Model is not dirty & custom unsaved calculation making it dirty", function (assert) {
			// Prepare
			var oModel = {
				hasPendingChanges: sinon.stub().returns(false)
			};
			oView.getModel.returns(oModel);

			oComponentRegistryEntry.aUnsavedDataCheckFunctions = [];
			oComponentRegistryEntry.aUnsavedDataCheckFunctions.push(function(){
				return true;
			});


			// Invoke
			var bIsDirty = oComponentUtils.isComponentDirty();

			// Assert
			assert.ok(oModel.hasPendingChanges.calledOnce, "Model dirty check was performed called");
			assert.deepEqual(oModel.hasPendingChanges.args[0][0], true, "hasPendingChanges was called to even check deffered changes");
			assert.ok(bIsDirty, "Component should be dirty because custom usaved calculation which returns to dirty as true");

			// Restore
			oComponentRegistryEntry.aUnsavedDataCheckFunctions = undefined;
		});

		module("lib.ComponentUtils executeAfterInvokeActionFromExtensionAPI Function", {
			setup: fnGeneralSetup,
			teardown: fnGeneralTeardown
		});

		QUnit.test("Function executeAfterInvokeActionFromExtensionAPI test", function (assert) {
			//Arrange
			var oExpectedArgs = [{},
				{}
			];
			var executeAfterInvokeActionFromExtensionAPISpy = oSandbox.spy(oComponentRegistryEntry.methods, "executeAfterInvokeActionFromExtensionAPI", undefined);
			//Invoke
			oComponentUtils.executeAfterInvokeActionFromExtensionAPI(oState);
			//assert
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPISpy is called");
			assert.deepEqual(executeAfterInvokeActionFromExtensionAPISpy.args[0], oExpectedArgs, "executeAfterInvokeActionFromExtensionAPISpy called with correct parameters");
			//Clean
			executeAfterInvokeActionFromExtensionAPISpy.restore();
		});

		module("lib.ComponentUtils executeBeforeInvokeActionFromExtensionAPI Function", {
			setup: fnGeneralSetup,
			teardown: fnGeneralTeardown
		});

		QUnit.test("Function executeBeforeInvokeActionFromExtensionAPI test", function (assert) {
			//Arrange
			var oExpectedArgs = [{},
				{}
			];
			var executeBeforeInvokeActionFromExtensionAPISpy = oSandbox.spy(oComponentRegistryEntry.methods, "executeBeforeInvokeActionFromExtensionAPI", undefined);
			//Invoke
			oComponentUtils.executeBeforeInvokeActionFromExtensionAPI(oState);
			//assert
			assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI is called");
			assert.deepEqual(executeBeforeInvokeActionFromExtensionAPISpy.args[0], oExpectedArgs, "executeBeforeInvokeActionFromExtensionAPI called with correct parameters");
			//Clean
			executeBeforeInvokeActionFromExtensionAPISpy.restore();
		});

	});
