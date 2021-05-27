/**
 * tests for the sap.suite.ui.generic.template.lib.navigation.NavigationController
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/m/NavContainer",
	"sap/ui/base/Object",
	"sap/ui/core/Control",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/core/routing/Router",
	"sap/ui/core/routing/Views",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/lib/AppComponent",
	"sap/suite/ui/generic/template/lib/navigation/NavigationController",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/navigation/routingHelper"
], function (sinon, NavContainer, BaseObject, Control, HashChanger, Router, Views, Filter, ODataMetaModel, ODataModel, JSONModel, AppComponent, NavigationController, testableHelper, routingHelper) {
	"use strict";

	var oConfig = {
		"pages": [{
			"entitySet": "I_AIS_E_SalesOrder_A",
			"component": {
				"name": "sap.suite.ui.generic.template.ListReport"
			}
		}]
	};
	var oTemplatePrivateModel;
	var oTemplateContract = {
		oApplicationProxy: {
			onAfterNavigate: Function.prototype,
			onBypassed: Function.prototype,
			onRouteMatched: Function.prototype
		},
		oBusyHelper: {
			setBusy: Function.prototype,
			setBusyReason: Function.prototype
		},
		aStateChangers: [],
		componentRegistry: {
			component1: {
				methods: {
				},
				utils: {
					getTemplatePrivateModel: function () {
						return oTemplatePrivateModel;
					},
					suspendBinding: Function.prototype
				},
				oControllerUtils: {
					oServices: {
						oTemplateCapabilities: {}
					}
				},
				oStatePreserverPromise: {
					then: Function.prototype
				},
				viewRegistered: Promise.resolve()
			}
		},
		oPagesDataLoadedObserver: {
			getProcessFinished: function () {
				return {
					then: Function.prototype
				};
			}
		},
		routeViewLevel1: {
			pattern: ""
		},
		oShellServicePromise: {
			then: function() {
				return new Promise(function(resolve, reject) {});
			}
		},
		oStatePreserversAvailablePromise: Promise.resolve()
	};
	var oAppComponent;
	var oQueue = {
		makeQueuable: function(fnQueued){
			return fnQueued;
		},
		start: function(){
			return oQueue;
		},
		stop: Function.prototype		
	};
	var oHashChangerStub;
	var oSandbox;
	var oTargets = {
		addTarget: Function.prototype
	};
	var oTemplatePrivateGlobalModel;
	var oStubForPrivate;
	
	var sHistoryKey = "t";
	var oModel = sinon.createStubInstance(ODataModel);
			this.oMetaModel = {
				loaded: function () {
					return {
						then: function (fnThen) {}
					};
				}
			};
	oModel.getMetaModel.returns(this.oMetaModel);

	module("sap.suite.ui.generic.template.lib.navigation.NavigationController", {
		setup: function () {
			oStubForPrivate = testableHelper.startTest();
			var oStaticStub = testableHelper.getStaticStub();
			sHistoryKey =  sHistoryKey + "t";
			oSandbox = sinon.sandbox.create();
			oSandbox.stub(oStaticStub, "Queue", function() {
				return oQueue;
			});
			oSandbox.stub(routingHelper, "generateRoutingStructure", function(oTemplateContractPar){
				if (oTemplateContract === oTemplateContractPar){
					return {
						then: function(fnExecute){
							fnExecute();
							return Promise.resolve();
						}
					};
				}	
			});
			oSandbox.stub(oStubForPrivate, "getParsedShellHashFromFLP", function(){
				return {
					then: function(fnExecute){
						fnExecute();
						return Promise.resolve();
					}
				};
			})
			oHashChangerStub = {
				replaceHash: sinon.stub(),
				setHash: sinon.stub(),
				getHash: sinon.stub()
			};
			oAppComponent = sinon.createStubInstance(AppComponent);
			oAppComponent.getManifestEntry.returns({});
			oAppComponent.getConfig = function () {
				return oConfig;
			};
			oTemplatePrivateGlobalModel = {
				bindProperty: function (sPath) {
					return {
						attachChange: function (fnHandleNavigationMenu) {}
					};
				},
				setProperty: function(sPath, sValue){
					
				}
			};
			oTemplatePrivateModel = new JSONModel();
			var oNavigationHost = sinon.createStubInstance(NavContainer);
			oTemplateContract.oAppComponent = oAppComponent;
			oTemplateContract.oNavigationHost = oNavigationHost;
			oTemplateContract.getText = Function.prototype;
			oTemplateContract.oTemplatePrivateGlobalModel = oTemplatePrivateGlobalModel;
			var oModel = sinon.createStubInstance(ODataModel);
			this.oMetaModel = {
				loaded: function () {
					return {
						then: function (fnThen) {}
					};
				}
			};
			oModel.getMetaModel.returns(this.oMetaModel);
			oTemplateContract.oAppComponent.oModels = {
				"": oModel,
				"templatePrivateGlobalModel": oTemplatePrivateGlobalModel,
				"templatePrivateModel": oTemplatePrivateModel
			};
			oAppComponent.getModel.returns(oModel);
			this.oRouter = sinon.createStubInstance(Router);
			this.oRouter.getTargets.returns(oTargets);
			this.oRouter.getHashChanger.returns(oHashChangerStub);
			oAppComponent.getRouter.returns(this.oRouter);
			this.oRouter._oViews = sinon.createStubInstance(Views);
			this.oNavigationController = new NavigationController(oTemplateContract);
			oTemplateContract.mEntityTree = Object.create(null);
			oTemplateContract.mRoutingTree = Object.create(null);
			oTemplateContract.mEntityTree.SalesOrderItem = {
				sRouteName: "SalesOrderItem",
				entitySet: "SalesOrderItem",
				display: oSandbox.stub(),
				level: 2,
				fCLLevel: 0,
				parent: "SalesOrder",
				parentRoute: "SalesOrder",
				getPath: function(iMode, aKeys){
					var sRet = "SalesOrderItem({keys2})";
					if (aKeys){
						sRet = sRet.replace("{keys2}", aKeys[2]);
					}
					if (iMode > 1){
						sRet = "/" + sRet;
					}
					return sRet;
				},
				contextPath: "SalesOrderItem({keys2})"
			};
			oTemplateContract.mEntityTree.SalesOrder = {
				sRouteName: "SalesOrder",
				entitySet: "SalesOrder",
				display: oSandbox.stub(),
				page: {
					component: {
						name: "sap.suite.ui.generic.template.ObjectPage"
					}
				},
				level: 1,
				fCLLevel: 0,
				children: ["SalesOrderItem"],
				parentRoute: "root",
				getPath: function(iMode){
					return iMode === 1 ? "" : "SalesOrder";
				},
				contextPath: "SalesOrder"
			};
			oTemplateContract.mRoutingTree.SalesOrderItem = oTemplateContract.mEntityTree.SalesOrderItem;
			oTemplateContract.mRoutingTree.SalesOrder = oTemplateContract.mEntityTree.SalesOrder;
			oTemplateContract.mRoutingTree.root = {
				sRouteName: "root",
				level: 0,
				display: oSandbox.stub(),
				fCLLevel: 0,
				children: ["SalesOrder"],
				getPath:function(){
					return "";
				}
			};
			oTemplateContract.oTemplatePrivateGlobalModel = new JSONModel();
		},
		teardown: function () {
			this.oNavigationController.destroy();
			oSandbox.restore();
			testableHelper.endTest();
		}
	});

	test("Shall be instantiable", function (assert) {
		assert.ok(this.oNavigationController);
		assert.ok(!oHashChangerStub.setHash.called, "Instantiation should not set hash");
		assert.ok(!oHashChangerStub.replaceHash.called, "Instantiation should not replace hash");
	});
	
	function fnTestNavigateToContext(bReplace){
		test("navigateToContext shall call navTo on the Router with correct paranmeters when navigating to a main object with bReplace: " + bReplace, function (assert) {
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var sPath = "/SalesOrder(123)";
			var oContext = {
				getPath: function () {
					return sPath;
				},
				getModel: function () {
					return this.oModel;
				}
			};
			oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
				return ["", "123"];
			});
			var done = assert.async();
			this.oNavigationController.navigateToContext(oContext, null, bReplace);
			setTimeout(function() {
				assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
				assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
				assert.ok(this.oRouter.navTo.calledOnce, "navTo must have been called exactly once");
				var aArguments = this.oRouter.navTo.firstCall.args;
				assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
				assert.strictEqual(aArguments[0], "SalesOrderquery", "Correct route must have been passed");
				assert.deepEqual(aArguments[1], {
					keys1: "123",
					query: {
						"sap-iapp-state--history": sHistoryKey
					}
				}, "Correct keys must have been passed");
				assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
				done();
			}.bind(this), 0);
		}); 
	
		test("navigateToContext shall call navTo on the Router with correct paranmeters when navigating to a sub object with bReplace: " + bReplace, function (assert) {
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var sPath = "/SalesOrderItem(12345)";
			var oContext = {
				getPath: function () {
					return sPath;
				},
				getModel: function () {
					return this.oModel;
				}
			};
			var done = assert.async();
			oStubForPrivate.setCurrentIdentity({
				treeNode: oTemplateContract.mEntityTree.SalesOrder,
				keys: ["", "123"],
				appStates: Object.create(null)			
			});
			oStubForPrivate.setCurrentIdentity({
				treeNode: oTemplateContract.mEntityTree.SalesOrderItem,
				keys: ["", "123", "123xy"],
				appStates: Object.create(null)			
			});
			oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
				return ["", "123", "12345"];
			});
			this.oNavigationController.navigateToContext(oContext, null, bReplace);
			setTimeout(function () {
				assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
				assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
				assert.ok(this.oRouter.navTo.calledOnce, "navTo must have been called exactly once");
				var aArguments = this.oRouter.navTo.firstCall.args;
				assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
				assert.strictEqual(aArguments[0], "SalesOrderItemquery", "Correct route must have been passed");
				assert.deepEqual(aArguments[1], {
					keys1: "123",
					keys2: "12345",
					query: {
						"sap-iapp-state--history": sHistoryKey
					}					
				}, "Correct keys must have been passed");
				assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
				done();
			}.bind(this), 0);
		});
		
		test("navigateToContext shall call navTo on the Router with correct paranmeters when navigating to a sibling sub object with bReplace: " + bReplace, function (assert) {
			oStubForPrivate.setHistoryKey(sHistoryKey);
			var sPath = "/SalesOrderItem(12345)";
			var oContext = {
				getPath: function () {
					return sPath;
				},
				getModel: function () {
					return this.oModel;
				}
			};
			var done = assert.async();
			oStubForPrivate.setCurrentIdentity({
				treeNode: oTemplateContract.mEntityTree.SalesOrderItem,
				keys: ["", "123", "123xy"],
				appStates: Object.create(null)			
			});
			oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
				return ["", "123", "12345"];
			});
			
			this.oNavigationController.navigateToContext(oContext, null, bReplace);
			setTimeout(function () {
				assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
				assert.ok(!oHashChangerStub.setHash.called, "setHash must not have been called");
				assert.ok(this.oRouter.navTo.calledOnce, "navTo must have been called exactly once");
				var aArguments = this.oRouter.navTo.firstCall.args;
				assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
				assert.strictEqual(aArguments[0], "SalesOrderItemquery", "Correct route must have been passed");
				assert.deepEqual(aArguments[1], {
					keys1: "123",
					keys2: "12345",
					query: {
						"sap-iapp-state--history": sHistoryKey
					}					
				}, "Correct keys must have been passed");
				assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
				done();
			}.bind(this), 0);
		});
	
		test("navigateToRoot shall call navTo on the Router correctly with bReplace: " + bReplace, function (assert) {
			oStubForPrivate.setHistoryKey(sHistoryKey);
			oStubForPrivate.setCurrentIdentity({
				treeNode: oTemplateContract.mEntityTree.SalesOrder,
				keys: ["", "123"],
				appStates: Object.create(null)
			});
			var done = assert.async();
			oSandbox.stub(oTemplateContract.oApplicationProxy, "getIdentityKeyForContext", function () {
				return ["", "123"];
			});
			this.oNavigationController.navigateToRoot(bReplace);
			setTimeout(function() {
				assert.ok(this.oRouter.navTo.calledOnce, "navTo must have been called");
				var aArguments = this.oRouter.navTo.firstCall.args;
				assert.strictEqual(aArguments.length, 3, "Correct number of arguments must have been passed");
				assert.strictEqual(aArguments[0], "rootquery", "Correct route must have been passed");
				assert.deepEqual(aArguments[1], {
					query: {
						"sap-iapp-state--history": sHistoryKey
					}					
				}, "Correct keys must have been passed");				
				assert.strictEqual(aArguments[2], !!bReplace, "replace parameter must have been passed correctly");
				done();
			}.bind(this), 0);
		});
	}
	
	fnTestNavigateToContext();
	fnTestNavigateToContext(true);

	test("navigateToMessagePage shall navigate to the right target", function (assert) {
		oStubForPrivate.setCurrentIdentity({
			keys: [],
			appStates: Object.create(null)
		});
		var mParams = {
			title: "SomeTitle",
			text: "SomeText",
			icon: "SomeIcon",
			description: "SomeDescription"
		};

		oTemplateContract.oTemplatePrivateGlobalModel = {
			setProperty: sinon.stub()
		};
		var oDisplaySpy = oSandbox.spy(oTargets, "display");
		this.oNavigationController.navigateToMessagePage(mParams);
		assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
		var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
		assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
		assert.deepEqual(oArgs[1], {
			text: "SomeText",
			icon: "SomeIcon",
			description: "SomeDescription"
		}, "correct properties must have been set");
		assert.ok(oDisplaySpy.calledOnce, "display must have been called");
		assert.ok(oDisplaySpy.calledWithExactly("messagePage"), "display must have been called with correct parameter");
		delete oTemplateContract.oTemplatePrivateGlobalModel;
	});

	test("navigateToMessagePage shall navigate to the right target and take icon from entitySet", function (assert) {
		oStubForPrivate.setCurrentIdentity({
			keys: [],
			appStates: Object.create(null)
		});
		var mParams = {
			entitySet: "SalesOrder",
			description: "SomeDescription",
			title: "SomeTitle",
			text: "SomeText",
			icon: "SomeIcon"
		};

		var oEntityType = {
			name: "SalesOrder",
			"com.sap.vocabularies.UI.v1.HeaderInfo": {
				"TypeImageUrl": {
					"String": "SomeIconFromEntity"
				}
			}
		};

		this.oMetaModel.getODataEntitySet = sinon.stub();
		this.oMetaModel.getODataEntitySet.returns({
			entityType: "SalesOrder"
		});
		this.oMetaModel.getODataEntityType = sinon.stub();
		this.oMetaModel.getODataEntityType.returns(oEntityType);


		oTemplateContract.oTemplatePrivateGlobalModel = {
			setProperty: sinon.stub()
		};
		var oDisplaySpy = oSandbox.spy(oTargets, "display");
		this.oNavigationController.navigateToMessagePage(mParams);
		assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
		var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
		assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
		assert.deepEqual(oArgs[1], {
			text: "SomeText",
			description: "SomeDescription",
			icon: "SomeIconFromEntity"
		}, "correct properties must have been set");
		assert.ok(oDisplaySpy.calledOnce, "display must have been called");
		assert.ok(oDisplaySpy.calledWithExactly("messagePage"), "display must have been called with correct parameter");
		delete oTemplateContract.oTemplatePrivateGlobalModel;
	});

	function getComponent1() {
		var fnOnActivate = sinon.stub();
		fnOnActivate.returns(Promise.reject());
		return {
			getId: function () {
				return "component1";
			},
			onActivate: fnOnActivate
		};
	}

	test("Test preloadComponent method of NavigationControllerProxy", function(assert) {
		// Arrange
		var oPrepareHostViewStub = sinon.stub();
		oStubForPrivate.setPrepareHostView(oPrepareHostViewStub);

		// Invoke
		oStubForPrivate.preloadComponent("SalesOrder");
		// Assert
		assert.ok(oPrepareHostViewStub.calledOnce, "Method prepareHostView is called");
		assert.deepEqual(oPrepareHostViewStub.args[0][0], oTemplateContract.mRoutingTree.SalesOrder, 
			"Method prepareHostView is called with correct treeNode instance");
	});

	test("Test prepareHostView method of NavigationControllerProxy", function(assert) {
		// Arrange
		var oController = {
			setRouteName: sinon.stub()
		};
		var oTheComponentContainer = {
			setModel: sinon.stub(),
			setComponent: sinon.stub()
		};
		var oHostView = {
			byId: sinon.stub().returns(oTheComponentContainer),
			getController: sinon.stub().returns(oController)
		};
		oStubForPrivate.setCreateHostView(function() {
			return oHostView;
		});
		var oComponentStub = {
			onBeforeRendering: sinon.stub()
		};
		var fnCreateOriginal = sap.ui.core.Component.create;
		sap.ui.core.Component.create = sinon.stub().returns(Promise.resolve(oComponentStub));
		var oViews = {
			setView: sinon.stub()
		};
		this.oRouter.getViews = sinon.stub().returns(oViews);
		oTemplateContract.oHeaderLoadingObserver = {
			addObserver: sinon.stub()
		};
		oTemplateContract.oAppComponent.runAsOwner = function(fnMethodToExecute) {
			fnMethodToExecute();
		};
		
		var done = assert.async();

		// Invoke
		oStubForPrivate.preloadComponent("SalesOrder");
		// Assert
		assert.strictEqual(oHostView.byId.args[0][0], "host", 
		"Method byId should be called only with 'host' as Id");
		assert.strictEqual(oController.setRouteName.args[0][0], 
			"SalesOrder", "routename should be correct");
		assert.deepEqual(oViews.setView.args[0][1], oHostView, 
			"Second parameter should host view returned by CreateHostView method");

		setTimeout(function() {
			assert.ok(oTheComponentContainer.setComponent.calledOnce, 
				"Component should be set to the ComponentContainer");
			assert.strictEqual(oTheComponentContainer.setModel.callCount, 3, 
				"Models should be propogated to the ComponentContainer");
			done();

			// Restore
			sap.ui.core.Component.create = fnCreateOriginal;
		}, 100);
	});

	test("routeMatched event of the router shall call activateComponent", function (assert) {
		oStubForPrivate.setHistoryKey(sHistoryKey);
		var oComponent = getComponent1();
		oTemplateContract.mEntityTree.SalesOrderItem.componentCreated = {
			then: function (fnThen) {
				return fnThen(oComponent);
			}
		};
		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var fBeforeRouteMatched = this.oRouter.attachBeforeRouteMatched.args[0][0];
		var oEventParam = {
			getParameter: sinon.stub()
		};

		var oRouteConfig = {
			name: "SalesOrderItemquery",
			target: "theTarget",
			entitySet: "SalesOrderItem",
			viewLevel: 1,
			pattern: "",
			contextPath: ""
		};
		var oArgs = {
			"?query": {
				"sap-iapp-state--history": 	sHistoryKey
			}
		};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		var bBindComponentCalled = false;
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
			assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
			bBindComponentCalled = true;
		});
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
			assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
			done();
		});		
		var oHostView = {
			byId: function(sId){
				assert.equal(sId, "host", "only id 'host' should be used on host view");
				return oTheComponentContainer;
			},
			getController: function(){
				return {
					setRouteName: function(sRoutename){
						assert.equal(sRoutename, "SalesOrderItem", "routename should be correct");
					}
				};
			}
		};
		var fnSetView = oSandbox.spy();
		this.oRouter.getViews.returns({
			setView: fnSetView	
		});
		var oTheComponentContainer = {};
		oStubForPrivate.setCreateHostView(function(){
			return oHostView;
		});
		oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
			assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
			assert.equal(sRoute, "SalesOrderItem", "Correct route must have been used");
		});
		fBeforeRouteMatched.call(fThis, oEventParam);
		assert.ok(fnSetView.calledOnce);
		assert.equal(fnSetView.args[0][0], "SalesOrderItem", "View must be set at the router with correct target");
		assert.strictEqual(fnSetView.args[0][1], oHostView, "Correct view must be set for that target");
		fRouteMatched.call(fThis, oEventParam);
	});

	test("routeMatched event of the router - test for 'root' operation", function () {
		oStubForPrivate.setHistoryKey(sHistoryKey);
		var oComponent = getComponent1();
		oTemplateContract.mRoutingTree.root.componentCreated = {
			then: function (fnThen) {
				return fnThen(oComponent);
			}
		};

		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var fBeforeRouteMatched = this.oRouter.attachBeforeRouteMatched.args[0][0];
		var oEventParam = {
			getParameter: sinon.stub()
		};
		var oRouteConfig = {
			name: "root",
			operation: "root",
			target: "root",
			viewLevel: 0
		};
		var oArgs = {
			"?query": {
				"sap-iapp-state--history": 	sHistoryKey
			}
		};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		var bBindComponentCalled = false;
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
			assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
			bBindComponentCalled = true;
		});
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
			assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
			done();
		});		
		var oHostView = {
			byId: function(sId){
				assert.equal(sId, "host", "only id 'host' should be used on host view");
				return oTheComponentContainer;
			},
			getController: function(){
				return {
					setRouteName: function(sRoutename){
						assert.equal(sRoutename, "root", "routename should be correct");
					}
				};
			}
		};
		var fnSetView = oSandbox.spy();
		this.oRouter.getViews.returns({
			setView: fnSetView	
		});
		var oTheComponentContainer = {};
		oStubForPrivate.setCreateHostView(function(){
			return oHostView;
		});
		oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
			assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
			assert.equal(sRoute, "root", "Correct route must have been used");
		});
		fBeforeRouteMatched.call(fThis, oEventParam);
		assert.ok(fnSetView.calledOnce);
		assert.equal(fnSetView.args[0][0], "root", "View must be set at the router with correct target");
		assert.strictEqual(fnSetView.args[0][1], oHostView, "Correct view must be set for that target");
		fRouteMatched.call(fThis, oEventParam);
	});

	test("routeMatched event of the router", function (assert) {
		oStubForPrivate.setHistoryKey(sHistoryKey);
		var sBindingPath = "/SalesOrderItem(12345)";
		var sPattern = "SalesOrder({keys1})/toItem({keys2})";
		var sEntity = "SalesOrderItem";
		var sNavigationProp = "toItem";
		var oComponent = getComponent1();
		oTemplateContract.mRoutingTree.SalesOrderItem.componentCreated = {
			then: function (fnThen) {
				return fnThen(oComponent);
			}
		};		

		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var fBeforeRouteMatched = this.oRouter.attachBeforeRouteMatched.args[0][0];
		var oEventParam = {
			getParameter: sinon.stub()
		};
		var oRouteConfig = {
			name: sEntity,
			operation: "detail",
			pattern: sPattern,
			navigationProperty: sNavigationProp,
			entitySet: sEntity,
			target: "ttt",
			viewLevel: 2
		};
		var oArgs = {
			keys1: "123",
			keys2: "12345",
			"?query": {
				"sap-iapp-state--history": 	sHistoryKey
			}
		};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		var bBindComponentCalled = false;
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "bindComponent", function(){
			assert.ok(!bBindComponentCalled, "bindComponent should be called only once");
			bBindComponentCalled = true;
		});
		oSandbox.stub(oTemplateContract.componentRegistry.component1.utils, "refreshBinding", function(){
			assert.ok(bBindComponentCalled, "bindComponent must have been called before refreshBinding");
			done();
		});		
		var oHostView = {
			byId: function(sId){
				assert.equal(sId, "host", "only id 'host' should be used on host view");
				return oTheComponentContainer;
			},
			getController: function(){
				return {
					setRouteName: function(sRoutename){
						assert.equal(sRoutename, "SalesOrderItem", "routename should be correct");
					}
				};
			}
		};
		var fnSetView = oSandbox.spy();
		this.oRouter.getViews.returns({
			setView: fnSetView	
		});
		var oTheComponentContainer = {};
		oStubForPrivate.setCreateHostView(function(){
			return oHostView;
		});
		oSandbox.stub(oStubForPrivate, "createTemplateComponent", function(oComponentContainer, sRoute){
			assert.strictEqual(oComponentContainer, oTheComponentContainer, "Create component in the correct container");
			assert.equal(sRoute, "SalesOrderItem", "Correct route must have been used");
		});
		fBeforeRouteMatched.call(fThis, oEventParam);
		assert.ok(fnSetView.calledOnce);
		assert.equal(fnSetView.args[0][0], "SalesOrderItem", "View must be set at the router with correct target");
		assert.strictEqual(fnSetView.args[0][1], oHostView, "Correct view must be set for that target");
		fRouteMatched.call(fThis, oEventParam);
	});
});
