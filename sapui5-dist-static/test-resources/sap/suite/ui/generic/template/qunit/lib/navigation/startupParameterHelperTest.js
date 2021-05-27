/**
 * tests for the sap.suite.ui.generic.template.lib.startupParameterHelper
 */
sap.ui.define(["testUtils/sinonEnhanced", "sap/ui/model/Filter", "sap/ui/model/odata/ODataMetaModel", "sap/ui/model/odata/v2/ODataModel", "sap/suite/ui/generic/template/lib/navigation/startupParameterHelper",
		"sap/suite/ui/generic/template/lib/CRUDHelper", "sap/suite/ui/generic/template/genericUtilities/testableHelper"
	],
	function(sinon, Filter, ODataMetaModel, ODataModel, startupParameterHelper, CRUDHelper, testableHelper) {
		"use strict";

		var oTestStub;
/*		var fakePromise = {
			then : function (callback){
				callback();
			}
		}

		var oSandbox;
		var oModel;
		var oNavigationControllerProxy = {
			oAppComponent: {
				getModel: function(){
					return oModel;
				},
				getConfig: function(){
					return {"pages": [{"pages": [{}]}]};
				},
				getFlexibleColumnLayout: sinon.stub(),
				getComponentData: sinon.stub()
			},
			oHashChanger: {
				getHash: function(){
					return "";
				}
			},
			fnInitializationResolve: Function.prototype,
			oTemplateContract: {
				oNavContainer: {},
				mEntityTree:{
					"STTA_C_MP_Product":{},
					"STTA_C_MP_ProductText":{}
				},
				mRoutingTree:{
					root:{

					}
				}
			},
			navigateToMessagePage: Function.prototype,
			navigate: Function.prototype,
			navigateToIdentity: Function.prototype
			
		};

		var fnReadObject;
		var oSpy_initialiseRouting;
		module("lib.navigation.routingHelper.readObject", {
			setup: function() {
				testableHelper.startTest();
				oTestStub = testableHelper.getStaticStub();
				oSandbox = sinon.sandbox.create();
				oModel = sinon.createStubInstance(ODataModel);
				oNavigationControllerProxy.oRouter = sinon.createStubInstance(Router);
				oSpy_initialiseRouting = oSandbox.spy(oTestStub, "routingHelper_initialiseRouting");
				oSandbox.spy(oNavigationControllerProxy, "initialize");
				fnReadObject = oTestStub.routingHelper_readObject; // the function to be tested
				oSandbox.stub(oNavigationControllerProxy, "navigate", Function.prototype);
				oSandbox.stub(oNavigationControllerProxy, "navigateToIdentity", function(){
					return {
						then: function(fn) {
							fn()
						}
					}
				});
				oSandbox.stub(oNavigationControllerProxy.oAppComponent, "getTransactionController", function() {
					return {
						getDraftController: function() {
							return {
								getDraftContext: function() {
									return {
										isDraftEnabled: function() {
											return true;
										}
									};
								}
							};
						}
					};
				});

			},
			teardown: function() {
				oSandbox.restore();
				testableHelper.endTest();
			}
		});

		test("readObject shall trigger read with specified filters", function(assert) {
			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var aReadPromises = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];
			var aFilters = oReadParameters.filters;
			assert.strictEqual(aFilters.length, 1);

			var oFilter = aFilters[0];
			assert.strictEqual(oFilter instanceof Filter, true);

			assert.strictEqual(oFilter.aFilters.length, 2, "Complex Filter build of 2 filters");
			oFilter = oFilter.aFilters[0]; // First property given in StartupParameters
			assert.strictEqual(oFilter.sPath, "SalesOrderId", "First one being Filter on given property from StartupParameters");
			assert.strictEqual(oFilter.oValue1, "1");
		});

		test("readObject shall trigger read and intitialise routing on success - no result returned", function(assert) {
			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};

			var oPagePromise = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];
			oReadParameters.success();
			var done = assert.async();
			oPagePromise.then(function() {
					done();
			}, function() {
				setTimeout(function() {
					assert.ok(!oModel.getKey.called);
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
				});
			});
		});

		test("readObject shall trigger read and use the ActiveEntity from result", function(assert) {

			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var oPagePromise = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);

			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];
			assert.ok(!oModel.getKey.calledOnce);
			oReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "12300000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}, {
					"row2": "dummy",
					"DraftUUID": "45600000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}, {
					"row3": "dummy",
					"DraftUUID": "00000000-0000-0000-0000-000000000000",
					"IsActiveEntity": true
				}]
			});

			var done = assert.async();
			oPagePromise.then(function(){
				setTimeout(function() {
					done();
				});
			}, function() {
				setTimeout(function() {
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
				});

			});

			assert.ok(oModel.getKey.calledOnce);
			assert.deepEqual(oModel.getKey.calledWith({
				"row3": "dummy",
				"DraftUUID": "00000000-0000-0000-0000-000000000000",
				"IsActiveEntity": true
			}), true);

		});

		test("readObject shall trigger read and use the 1st key from result, when startup parameters do not have DraftUUID", function(assert) {

			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var oPagePromise = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];
			assert.ok(!oModel.getKey.calledOnce);
			oReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "12300000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}, {
					"row2": "dummy",
					"DraftUUID": "45600000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}]
			});
			var done = assert.async();
			oPagePromise.then(function(){
				setTimeout(function() {
					done();
				});
			}, function() {
				setTimeout(function() {
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
				});
			});
			assert.ok(oModel.getKey.calledOnce);
			assert.deepEqual(oModel.getKey.calledWith({
				"row1": "dummy",
				"DraftUUID": "12300000-0000-0000-0000-000000000000",
				"IsActiveEntity": false
			}), true);
		});

		test("readObject shall trigger read correct record, when startup parameters contain DraftUUID", function(assert) {

			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"],
				"DraftUUID": ["12300000-0000-0000-0000-000000000000"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var oPagePromise = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];
			assert.ok(!oModel.getKey.calledOnce);
			oReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "12300000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}, {
					"row2": "dummy",
					"DraftUUID": "45600000-0000-0000-0000-000000000000",
					"IsActiveEntity": false
				}]
			});
			var done = assert.async();
			oPagePromise.then(function(){
				setTimeout(function() {
					done();
				});
			}, function() {
				setTimeout(function() {
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
				});
			});
			assert.ok(oModel.getKey.calledOnce);
			assert.deepEqual(oModel.getKey.calledWith({
				"row1": "dummy",
				"DraftUUID": "12300000-0000-0000-0000-000000000000",
				"IsActiveEntity": false
			}), true);
		});

		test("readObject shall trigger read and navigate to Object page using Semantic key", function(assert) {

			var aSemanticKey = [{
				PropertyPath: "ProductForEdit"
			}];
			var oStartupParameters = {
				"Product": ["HT-1003"],
				"ProductForEdit" : ["HT-1003"],
				"LanguageForEdit" : ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "STTA_C_MP_Product"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var oPagePromise = fnReadObject(oNavigationControllerProxy, "STTA_C_MP_Product", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);

			assert.ok(oModel.read.calledOnce);
			assert.ok(!oModel.getKey.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			oModel.getKey.returns("(abc)");
			var oReadParameters = oModel.read.args[0][1];
			oReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "00000000-0000-0000-0000-000000000000",
					"IsActiveEntity": true
				}]
			});

			var done = assert.async();
			oPagePromise.then(function(){
				assert.ok(oModel.getKey.calledOnce);
				var oIdentity = {
					treeNode: {},
					keys: ["", "abc"],
					appStates: {}
				};
				assert.ok(oNavigationControllerProxy.navigateToIdentity.calledWith(oIdentity,true, 1));
				assert.ok(oSpy_initialiseRouting.calledOnce);
				done();
			}, function() {
					assert.notOk(oModel.getKey.called,"Promise did not resolve with status:success");
					done();
			});

			assert.ok(oModel.getKey.calledOnce);
			assert.deepEqual(oModel.getKey.calledWith({
				"row1": "dummy",
				"DraftUUID": "00000000-0000-0000-0000-000000000000",
				"IsActiveEntity": true
			}), true);

		});

		test("readObject shall trigger read and initialise routing when no row result obtained", function(assert) {

			var aSemanticKey = [{
				PropertyPath: "ProductForEdit"
			}];
			var oStartupParameters = {
				"Product": ["HT-1003"],
				"ProductForEdit" : ["HT-1003"],
				"LanguageForEdit" : ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "STTA_C_MP_Product"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			var oPagePromise = fnReadObject(oNavigationControllerProxy, "STTA_C_MP_Product", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			var oReadParameters = oModel.read.args[0][1];
			oReadParameters.success({
				results: []
			});
			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var done = assert.async();
			oPagePromise.then(function(){
				assert.ok(!oModel.getKey.called);
				assert.ok(oSpy_initialiseRouting.calledOnce);
				done();
			}, function() {
					assert.notOk(oModel.getKey.called,"Promise did not resolve with status:success");
					done();
			});
		});


		test("readObject shall trigger read and navigate to Object page using Technical key", function(assert) {

			var aTechnicalKey = [{
				"name": "Product"}, {
				"name": "DraftUUID"},{
				"name": "IsActiveEntity"}];

			var aNavigablePages = [{
				"aTechnicalKey" : aTechnicalKey,
				"bNavigationWithTechnicalKeyPossible" : true

			}];

			var oStartupParameters = {
				"Product": ["HT-1003"],
				"DraftUUID" : ["00000000-0000-0000-0000-000000000000"],
				"IsActiveEntity" : ["true"]
			};
			var oNavigationPossible = {
				"aNavigablePages" : aNavigablePages
			};
			var sHash = "abc";
			var oPagePromise = fnReadObject(oNavigationControllerProxy, "STTA_C_MP_Product", aTechnicalKey, oStartupParameters, oModel, oNavigationPossible, sHash);

			assert.ok(!oModel.read.calledOnce);
			assert.ok(!oModel.getKey.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var done = assert.async();
			oPagePromise.then(function(){
				assert.ok(oNavigationControllerProxy.navigate.calledWith("abc",true));
				assert.ok(oSpy_initialiseRouting.calledOnce);
				done();
			}, function() {
					assert.notOk(oModel.getKey.called,"Promise did not resolve with status:success");
					done();
			});
		});

		test("readObject shall trigger read and navigate to Sub Object page using Semantic Key", function(assert) {

			var aObjectPageSemanticKey = [{
				PropertyPath: "ProductForEdit"
			}];
			var aSubObjectPageSemanticKey = [{
				PropertyPath: "LanguageForEdit"
			},
			{
				PropertyPath: "Product"
			}];
			var oStartupParameters = {
				"Product": ["HT-1003"],
				"ProductForEdit" : ["HT-1003"],
				"LanguageForEdit" : ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aObjectPageSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "STTA_C_MP_Product"
			},
			{
				"aSemanticKey" : aSubObjectPageSemanticKey,
				"iLevel" : 1,
				"sEntitySet" : "STTA_C_MP_ProductText",
				"sNavigationProperty" : "to_ProductText"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};
			oModel.getKey.returns("(abc)");
			var oPagePromise = fnReadObject(oNavigationControllerProxy, "STTA_C_MP_Product", aObjectPageSemanticKey, oStartupParameters, oModel, oNavigationPossible);
			var oObjectPageReadParameters = oModel.read.args[0][1];
			oObjectPageReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "00000000-0000-0000-0000-000000000000",
					"IsActiveEntity": true
				}]
			});
			var oSubObjectPageReadParameters = oModel.read.args[1][1];
			oSubObjectPageReadParameters.success({
				results: [{
					"row1": "dummy",
					"DraftUUID": "00000000-0000-0000-0000-000000000000",
					"IsActiveEntity": true
				}]
			});
			assert.ok(!oSpy_initialiseRouting.calledOnce);
			var done = assert.async();
			oPagePromise.then(function(oResult){
					assert.ok(oModel.getKey.calledTwice);
					var oIdentity = {
						treeNode: {},
						keys: ["", "abc","abc"],
						appStates: {}
					};
					assert.ok(oNavigationControllerProxy.navigateToIdentity.calledWith(oIdentity,true, 1));
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
			}, function() {
					assert.notOk(oModel.getKey.called,"Promise did not resolve with status:success");
					done();
			});
		});

		test("readObject shall trigger read and intitialise routing on error", function() {

			var aSemanticKey = [{
				PropertyPath: "SalesOrderId"
			}];
			var oStartupParameters = {
				"SalesOrderId": ["1"]
			};
			var aNavigablePages = [{
				"aSemanticKey" : aSemanticKey,
				"iLevel" : 0,
				"sEntitySet" : "I_AIS_E_SalesOrder_A"
			}];
			var oNavigationPossible = {
				"aNavigablePages": aNavigablePages
			};

			var oPagePromise = fnReadObject(oNavigationControllerProxy,"I_AIS_E_SalesOrder_A", aSemanticKey, oStartupParameters, oModel, oNavigationPossible);

			assert.ok(oModel.read.calledOnce);
			assert.ok(!oSpy_initialiseRouting.called);
			var oReadParameters = oModel.read.args[0][1];

			oReadParameters.error();
			var done = assert.async();
			oPagePromise.then(function(){
				setTimeout(function() {
					done();
				});
			}, function() {
				setTimeout(function() {
					assert.ok(oSpy_initialiseRouting.calledOnce);
					done();
				});
			});
		});


		var fnProcessStartupParameters;
		var oSpy_readObject;
		var fnDetermineEntitySetsForStartup;
		module("lib.routingHelper.processStartupParameters", {
			setup: function() {
				testableHelper.startTest();
				oTestStub = testableHelper.getStaticStub();
				oSandbox = sinon.sandbox.create();
				oModel = sinon.createStubInstance(ODataModel);
				oNavigationControllerProxy.oRouter = sinon.createStubInstance(Router);
				oNavigationControllerProxy.prepareHostView = Function.prototype,
				oNavigationControllerProxy.oTemplateContract = {
						oAppComponent:{
							getApplicationController: function(){
								return {};
							}
						},
						componentRegistry: {
							id:{
								viewRegistered: Promise.resolve({}),
								oController: {}
							}
						},
						oApplicationProxy: {
						},
						oBusyHelper: {
							setBusy: Function.prototype
						},
						getText: Function.prototype,
						mEntityTree:{
							"I_AIS_E_SalesOrder_A":{
								componentCreated: Promise.resolve({getId: function(){return "id";}})
							}
						},
						mRoutingTree:{
							root:{
								children:{

								}
							}
						}
				};
				oSpy_initialiseRouting = oSandbox.spy(oTestStub, "routingHelper_initialiseRouting");
				oSpy_readObject = oSandbox.spy(oTestStub, "routingHelper_readObject");
				fnProcessStartupParameters = oTestStub.routingHelper_processStartupParameters; // the function to be tested
				fnDetermineEntitySetsForStartup = function(){
				   return new Promise (function(fnResolve){
					   		setTimeout(function(){
								fnResolve(true);
							   });
				   }) ;
				};
				oNavigationControllerProxy.oAppComponent.getConfig = function() {
					return {
						pages: [{
							pages: [{}]
						}]
					};
				};
				oNavigationControllerProxy.getParsedShellHashFromFLP = function(){
					var results = {
						parseShellHash : function() { return {semanticObject:'dummy'}}
					};
				   return new Promise (function(fnResolve){
							fnResolve(results);
				   }) ;
				};
			},
			teardown: function() {
				oSandbox.restore();
				testableHelper.endTest();
			}
		});


		test("processStartupParameters with no page as target", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(false);
			var oStartupParameters = {"SalesOrderId":["1"],"SalesOrderDraftUUID":["00000000-0000-0000-0000-000000000000"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
								[{
									"type": "Edm.Guid",
									"name": "SalesOrderDraftUUID"
								}]
							};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
				assert.ok(oModel.createKey.called);
				assert.ok(!oSpy_readObject.called);
				assert.ok(oSpy_initialiseRouting.calledOnce);
				done();
			});
		//	assert.ok(!oMetaModel.getODataEntitySet.called);
			
		});

		test("processStartupParameters with target page hidden by navigation", function(assert) {

			// must just return sth. to make this test meaningful - otherwise internal navigation would be prohibited
			// before the external navigation is checked at all
			oNavigationControllerProxy.oRouter.getRoute.returns({});

			var oStartupParameters = {"SalesOrderId":["1"],"SalesOrderDraftUUID":["00000000-0000-0000-0000-000000000000"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(Promise.resolve());
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);


			oSandbox.stub(oNavigationControllerProxy.oAppComponent, "getConfig", function() {
				return {
					pages: [{
						pages: [{
							navigation: {
								display: "someOutbound"
							}
						}]
					}]
				};
			});

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			var done = assert.async();
			setTimeout(function() {
				oMetaModel.loaded().then(
						function() {
							// processing of startup parameters happens only after metaModel is loaded - so checking whether these
							// functions are called also makes sense only after the promise is resolved
							var testpromise = fnDetermineEntitySetsForStartup();
		    				testpromise.then(function(){
							assert.notOk(oModel.createKey.called,
							"Don't check the technical key if navigation to object page is not allowed anyway");
							assert.notOk(oSpy_readObject.called,
							"Don't check the semantical key if navigation to object page is not allowed anyway");
							assert.ok(oSpy_initialiseRouting.calledOnce,
							"Initialisation of router has always to be called - leading to opening of ListReport here");
							done();
						});
					});
			});
		});

		test("processStartupParameters with full key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);
			var oStartupParameters = {"SalesOrderId":["1"],"SalesOrderDraftUUID":["00000000-0000-0000-0000-000000000000"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			// todo: rework test. Don't check the implementation (very weak, as any additional functionality might need to change call counts), but check the the functionality (i.e. the result)
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			assert.ok(oMetaModel.getODataEntitySet.calledThrice);
			assert.ok(oModel.createKey.calledOnce);
			assert.ok(oSpy_readObject.notCalled);
			assert.ok(oSpy_initialiseRouting.calledOnce);
			done();
			});

		});

		test("processStartupParameters with more than one full key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {"SalesOrderId":["1","2"],"SalesOrderDraftUUID":["00000000-0000-0000-0000-000000000000","00000000-0000-0000-0000-000000000001"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			// todo: rework test. Don't check the implementation (very weak, as any additional functionality might need to change call counts), but check the the functionality (i.e. the result)
			//indpendent from the test case
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			assert.ok(oMetaModel.getODataEntitySet.calledThrice);
			//test specific
			assert.ok(!oModel.createKey.called);
			assert.ok(!oSpy_readObject.called);
			assert.ok(oSpy_initialiseRouting.calledOnce);
			done();
			});

		});

		test("processStartupParameters with no full key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {"NoKeyField":["ABC"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			// todo: rework test. Don't check the implementation (very weak, as any additional functionality might need to change call counts), but check the the functionality (i.e. the result)
			//indpendent from the test case
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			strictEqual(oMetaModel.getODataEntitySet.calledThrice, true);
			//test specific
			strictEqual(oModel.createKey.calledOnce, false);
			strictEqual(oSpy_readObject.calledOnce, false);
			strictEqual(oSpy_initialiseRouting.calledOnce, true);
			done();
			});

		});

		test("processStartupParameters with semantic key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			oSandbox.stub(oNavigationControllerProxy.oAppComponent, "getTransactionController", function() {
				return {
					getDraftController: function() {
						return {
							getDraftContext: function() {
								return {
									isDraftEnabled: function() {
										return true;
									}
								};
							}
						};
					}
				};
			});

			var oStartupParameters = {"SalesOrderId":["1"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});

			var oEntityType = {
					key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]},
					"com.sap.vocabularies.Common.v1.SemanticKey": [{PropertyPath: "SalesOrderId"}],
					property: []
			};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			// todo: rework test. Don't check the implementation (very weak, as any additional functionality might need to change call counts), but check the the functionality (i.e. the result)
			//indpendent from the test case
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			assert.ok(oMetaModel.getODataEntitySet.calledThrice);
			//test specific
			assert.ok(oModel.createKey.notCalled);
			assert.ok(oSpy_readObject.calledOnce);
			assert.ok(oSpy_initialiseRouting.notCalled);
			done();
			});

		});

		test("processStartupParameters with more than one semantic key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {"SalesOrderId":["1", "2"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
			                    "com.sap.vocabularies.Common.v1.SemanticKey": [{PropertyPath: "SalesOrderId"}],
			                    property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
			                  };
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			//indpendent from the test case
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			assert.ok(oMetaModel.getODataEntitySet.called);
			//test specific
			assert.ok(!oModel.createKey.called);
			assert.ok(!oSpy_readObject.calledOnce);
			assert.ok(oSpy_initialiseRouting.calledOnce);
			done();
			});
		});

		test("processStartupParameters with no full semantic key", function(assert) {
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {"SalesOrderId":["1"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
			                    "com.sap.vocabularies.Common.v1.SemanticKey": [{PropertyPath: "SalesOrderId"},
			                                                                   {PropertyPath: "SalesOrderIdItem"}],
                               property:
								[{
									"type": "Edm.Guid",
									"name": "SalesOrderDraftUUID"
								}]
			                  };
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			// todo: rework test. Don't check the implementation (very weak, as any additional functionality might need to change call counts), but check the the functionality (i.e. the result)
			//indpendent from the test case
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			assert.ok(oMetaModel.getODataEntitySet.calledThrice);
			//test specific
			assert.ok(!oModel.createKey.called);
			assert.ok(!oSpy_readObject.called);
			assert.ok(oSpy_initialiseRouting.calledOnce);
			done();
			});

		});

		test("_processStartupParameters with wrong mode and preferredMode passed", function() {
			var oSpy_CRUDHelper_create = oSandbox.spy(CRUDHelper, "create");
			var oSpy_CRUDHelper_edit   = oSandbox.spy(CRUDHelper, "edit");
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {};
			//mock startup parameters
			oStartupParameters.mode          = ["create"];
			oStartupParameters.preferredMode = ["create"];

			var oMetaModel = sinon.createStubInstance(sap.ui.model.odata.ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			var oModel = oNavigationControllerProxy.oAppComponent.getModel();
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			oSandbox.stub(oNavigationControllerProxy, "navigateToMessagePage", Function.prototype);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);

			//Test
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			strictEqual(oSpy_CRUDHelper_create.called, false);
			strictEqual(oSpy_CRUDHelper_edit.called,   false );
			strictEqual(oSpy_initialiseRouting.called, false);
			assert.ok(oNavigationControllerProxy.navigateToMessagePage.calledOnce, "Unsupported parameter combination leads to message page");
			done();
			});
		});

		test("_processStartupParameters with mode create", function() {
			var oSpy_CRUDHelper_create = oSandbox.stub(CRUDHelper, "create", function(){ return { then: Function.prototype }; });
			var oSpy_CRUDHelper_edit   = oSandbox.spy(CRUDHelper, "edit");
			oNavigationControllerProxy.oRouter.getRoute.returns(true);
			oNavigationControllerProxy.oRouter.getTargets.returns({display: Function.prototype});
			oSandbox.stub(oNavigationControllerProxy.oAppComponent, "getInboundParameters", function(){
				return [];
			});

			var oStartupParameters = {};
			//mock startup parameters
			oStartupParameters.mode = ["create"];

			var oMetaModel = sinon.createStubInstance(sap.ui.model.odata.ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			oModel.getMetaModel.returns(oMetaModel);
			oSandbox.stub(oNavigationControllerProxy.oAppComponent, "getTransactionController", function(){
				return {
					getDraftController: function(){
						return {
							getDraftContext: function(){
								return {
									isDraftEnabled: function(){
										return true;
									}
								};
							}
						};
					}
				};
			});

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);
			//Test
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			strictEqual(oSpy_CRUDHelper_create.calledOnce, true);
			strictEqual(oSpy_CRUDHelper_edit.calledOnce,   false );
			done();
			});
		});

		test("_processStartupParameters with no full key and preferredMode edit", function() {
			var oSpy_CRUDHelper_create = oSandbox.spy(CRUDHelper, "create");
			var oSpy_CRUDHelper_edit   = oSandbox.spy(CRUDHelper, "edit");
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {};
			//mock startup parameters
			oStartupParameters.preferredMode = ["edit"];

			var oMetaModel = sinon.createStubInstance(sap.ui.model.odata.ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			var oModel = oNavigationControllerProxy.oAppComponent.getModel();
			oModel.getMetaModel.returns(oMetaModel);

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
					property:
						[{
							"type": "Edm.Guid",
							"name": "SalesOrderDraftUUID"
						}]
			};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);
			//Test
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			strictEqual(oSpy_CRUDHelper_create.calledOnce, false);
			strictEqual(oSpy_CRUDHelper_edit.calledOnce,   false );
			strictEqual(oSpy_initialiseRouting.calledOnce, true);
			done();
			});
		});

		test("_processStartupParameters with full key and preferredMode edit", function() {
			var oSpy_CRUDHelper_create = oSandbox.spy(CRUDHelper, "create");
			var oSpy_CRUDHelper_edit   = oSandbox.spy(CRUDHelper, "edit");
			oNavigationControllerProxy.oRouter.getRoute.returns(true);

			var oStartupParameters = {"SalesOrderId":["1"],"SalesOrderDraftUUID":["00000000-0000-0000-0000-000000000000"]};
			//mock startup parameters
			oStartupParameters.preferredMode = ["edit"];

			var oMetaModel = sinon.createStubInstance(sap.ui.model.odata.ODataMetaModel);
			oMetaModel.loaded.returns(fakePromise);
			var oModel = oNavigationControllerProxy.oAppComponent.getModel();
			oModel.getMetaModel.returns(oMetaModel);
			oNavigationControllerProxy.oAppComponent.getTransactionController = function(){
				return {
					getDraftController: function(){
						return {
							getDraftContext: function(){
								return {
									isDraftEnabled: function(){
										return true;
									}
								};
							}
						};
					}
				};
			};

			//mock the entityset
			oMetaModel.getODataEntitySet.returns({name:"SalesOrder"});
			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}]  },
								property:
									[{
										"type": "Edm.Guid",
										"name": "SalesOrderDraftUUID"
									}]
								};
			oMetaModel.getODataEntityType.returns(oEntityType);

			fnProcessStartupParameters(oNavigationControllerProxy, "I_AIS_E_SalesOrder_A", oStartupParameters);
			//Test
			var testpromise = fnDetermineEntitySetsForStartup();
			var done = assert.async();
		    testpromise.then(function(){
			strictEqual(oSpy_CRUDHelper_create.calledOnce, false);
			strictEqual(oSpy_CRUDHelper_edit.calledOnce,   true );
			done();
			});
			//strictEqual(oSpy_initialiseRouting.calledOnce, true); /can't be checked yet...
		});
*/		
		
		module("lib.navigation.startupParameterHelper.transformGuidParameters", {
			setup: function() {
				testableHelper.startTest();
				oTestStub = testableHelper.getStaticStub();
			},
			teardown: function() {
				testableHelper.endTest();
			}
		});

		test("Test fnTransformStartupParameters", function(assert) {
			var mParameters = {"SalesOrderId":["1"],"SalesOrderDraftUUID":["00000000000000000000000000000000"], "CreatedOn": ["2021-02-10T10:10:10.100Z"]};

			var oMetaModel = sinon.createStubInstance(ODataMetaModel);
			var oModel = sinon.createStubInstance(ODataModel);
			oModel.getMetaModel.returns(oMetaModel);

			var oEntityType = { key: {propertyRef: [{name: "SalesOrderId"}, {name: "SalesOrderDraftUUID"}, , {name: "CreatedOn"}]  },
					property: [
						{
							"type": "Edm.Guid",
							"name": "SalesOrderDraftUUID"
						},
						{
							"type": "Edm.DateTime",
							"name": "CreatedOn",
							"sap:display-format": "Date"
						}
					]
					};
			oMetaModel.getODataEntityType.returns(oEntityType);

			var sEntitySet = "test";

			var fnTransformStartupParameters = oTestStub.startupParameterHelper_fnTransformStartupParameters; // the function to be tested
			fnTransformStartupParameters(oModel, sEntitySet, mParameters);

			var sExpectedGuid = "00000000-0000-0000-0000-000000000000";
			assert.equal(mParameters.SalesOrderDraftUUID[0], sExpectedGuid, "the Guid '00000000000000000000000000000000' is transformed correctly to '00000000-0000-0000-0000-000000000000'");
			var sExpectedDate = "2021-02-10T00:00:00";
			assert.equal(mParameters.CreatedOn[0], sExpectedDate, "the date '2021-02-10T10:10:10.100Z' should be transformed correctly to '2021-02-10T00:00:00'");

			mParameters.CreatedOn[0] = "2021-02-10T10:10:10.100Z";
			sExpectedGuid = "c3863685-df9c-483c-9347-388622a6187d";
			mParameters.SalesOrderDraftUUID[0] = "C3863685-Df9C-483C-9347-388622A6187D";
			fnTransformStartupParameters(oModel, sEntitySet, mParameters);
			assert.equal(mParameters.SalesOrderDraftUUID[0], sExpectedGuid, "the capital letters are transformed ok");

			mParameters.CreatedOn[0] = "2021-02-10T10:10:10.100Z";
			sExpectedGuid = "c3863685-df9c-483c-9347-388622a6187d";
			mParameters.SalesOrderDraftUUID[0] = "guid'c3863685-df9c-483c-9347-388622a6187d'";
			fnTransformStartupParameters(oModel, sEntitySet, mParameters);
			assert.equal(mParameters.SalesOrderDraftUUID[0], sExpectedGuid, "'guid' should be deleted from the Guid string");
			
		});
	});
