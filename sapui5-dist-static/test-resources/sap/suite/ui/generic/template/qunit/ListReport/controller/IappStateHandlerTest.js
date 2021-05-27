/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.IappStateHandler.js
 */
sap.ui.define([ "testUtils/sinonEnhanced",
                 "sap/suite/ui/generic/template/genericUtilities/testableHelper",
                 "sap/suite/ui/generic/template/ListReport/controller/IappStateHandler",
                 "sap/ui/generic/app/navigation/service/SelectionVariant",
				 "sap/ui/generic/app/navigation/service/NavigationHandler",
				 "sap/base/util/extend",
				 "sap/base/util/isEmptyObject",
				 "sap/base/util/deepEqual"
                 ], function(sinon, testableHelper, IappStateHandler, SelectionVariant, navigationHandler, extend, isEmptyObject, deepEqual){
	"use strict";

	var bSmartVariantManagement = false;
	var annotationPath;
	var bEnableAutoBinding = false;
	var bExecuteOnSelect = false;
	var bSuppressSelection;
	var fnDialogClosed;
	var bIsAutoBinding;
	var filter = {
		getName: function(){
			return "P_DisplayCurrency";
		}
	};
	var filter2 ={
		getName: function(){
			return "SalesOrderID";
		}
	}
	var oState = {
		oSmartFilterbar: {
			getLiveMode: function(){
				return true;
			},
			attachFiltersDialogClosed: function(fnHandler){
				if (fnDialogClosed){
					throw new Error("Only one handler must be registered");
				}
				if (!fnHandler){
					throw new Error("A handler must be registered");
				}
				fnDialogClosed = fnHandler;
			},
			setSuppressSelection: function(bSuppress){
				bSuppressSelection = bSuppress;
			},
			determineMandatoryFilterItems: function(){
				return [filter];
			},
			getUiState: function(){
				return {
					getSelectionVariant: function() {
						var oSFBSelectionVariant = new SelectionVariant().toJSONObject();
						return oSFBSelectionVariant;
					},
					getSemanticDates: function() {
						return {};
					}
				}
			},
			addCustomData: Function.prototype,
			setUiState: Function.prototype,
			isCurrentVariantStandard: function(){
				return true;
			},
			isCurrentVariantExecuteOnSelectEnabled: function(){
				return false;
			},
			getSmartVariant: function(){
				return {
					isPageVariant: function(){
						return true;
					},
					bExecuteOnSelectForStandardByUser: null
				}
			},
			getFiltersWithValues: function(){
				return [filter];
			},
			search: Function.prototype,
			isDialogOpen: function(){
				return false;
			},
			fireFilterChange: Function.prototype
		},
		oSmartTable: {
			getEnableAutoBinding: function(){
				return bIsAutoBinding;
			},
			setEnableAutoBinding: function(enableAutoBinding) {
				bIsAutoBinding = enableAutoBinding;
			}
		},
		oWorklistData: {
			bWorklistEnabled: false
		},
		oMultipleViewsHandler: {
			setControlVariant: Function.prototype,
			getEnableAutoBinding: function(){
				return false;
			},
			getOriginalEnableAutoBinding: function(){
				return null;
			},
			handleStartUpObject: Function.prototype,
			getMode: Function.prototype,
			getSelectedKeyPropertyName: Function.prototype
		}
	};
	var oEditStateFilter = {};
	var oPageVariant = {
		currentVariantSetModified: Function.prototype
	};
	var oComponent = {
		getSmartVariantManagement: function(){
			return bSmartVariantManagement;
		},
		getAnnotationPath: function() {
			return annotationPath;
		},
		getEntitySet: Function.prototype,
		getModel: function(){
			return {
				getMetaModel: function(){
					return {
						getODataEntitySet: function(){
							return {
								entityType: ""
							}
						},
						getODataEntityType: function(){
							return {
								property: []
							}
						}
					};
				},
				setProperty: Function.prototype
			};
		}
	};

	var oController = {
		getOwnerComponent: function(){
			return oComponent;
		},
		byId: function(sId){
			if (sId === "editStateFilter"){
				return oEditStateFilter;
			} else if (sId === "template::PageVariant") {
				return oPageVariant;
			}
			throw new Error("Only EditStateFilter must be looked up");
		},
		restoreCustomAppStateDataExtension: Function.prototype,
		modifyStartupExtension: Function.prototype
	};
	var bParseUrlFails = false;
	var oAppData, oAppDataLib, oURLParameters, sNavType;
	var oNavigationHandler = {
		parseNavigation: function(){
			return {
				done: function(fnDone){
					if (bParseUrlFails){
						return;
					}
					fnDone(oAppData, oURLParameters, sNavType);
				},
				fail: function(fnFail){
					if (bParseUrlFails){
						fnFail({getErrorCode: Function.prototype});
					}
				}
			};
		}
	};

	var oTemplateUtils = {
		oServices: {
			oApplication: {
				getNavigationHandler: function () {
					return oNavigationHandler;
				}
			}
		},
		oComponentUtils : {
			getTemplatePrivateModel: function () {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			},
			getTemplatePrivateGlobalModel: function () {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			},
			getSettings: function () {
				return {}
			},
			stateChanged: Function.prototype
		}
	}

	var sandbox;
	var oStubForPrivate;
	var oIappStateHandler;

	module("Initialization", {
		setup : function() {
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		},
		teardown : function() {
			bSmartVariantManagement = false;
		}
	});

	test("Constructor", function(assert) {
		assert.ok(!!oIappStateHandler, "Constructor could be called");
		assert.ok(bSuppressSelection, "Selection must be supressed initially");
	});

	test("Complete initialization", function(assert) {
		assert.ok(!fnDialogClosed, "Do not register handler too early");
		oIappStateHandler.onSmartFilterBarInitialise();
		oIappStateHandler.onSFBVariantInitialise();
		assert.equal(bIsAutoBinding, oState.oSmartTable.getEnableAutoBinding());
		assert.strictEqual(typeof fnDialogClosed, "function", "A function must be registered as handler");
	});

	module("Parse url", {
		setup : function() {
			fnDialogClosed = null;
			bParseUrlFails = false;
			bEnableAutoBinding = false;
			bExecuteOnSelect = false;
		},
		teardown : function() {
			bSmartVariantManagement = false;
		}
	});

	test("parse Navigation fails", function(assert) {
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var done = assert.async();
		bParseUrlFails = true;
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oNavigationPromise.then(function(){
			assert.ok(true, "Failure of NaviagtionHandler to parse URL does not lead to error of iAppstateHandler");
			done();
		});
	});

	test("parse Navigation success no auto select", function(assert) {
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var done = assert.async();
		oAppData = {};
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oNavigationPromise.then(function(){
			assert.ok(true, "Success is called correctly");
			done();
		});
	});

	test("parse Navigation success with auto select", function(assert) {
		var done = assert.async();
		oAppData = {};
		bEnableAutoBinding = true;
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var oSearchSpy = sinon.spy(oState.oSmartFilterbar, "search");
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		oNavigationPromise.then(function(){
			assert.ok(oSearchSpy.calledOnce, "Search should be triggered Mandatory fields are filled.");
			oSearchSpy.restore();
			done();
		});
	});

	module("Data Load Tests", {
		setup: function(){
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	test("Don't trigger search when mandatory filters are not filled", function(assert) {
		var done = assert.async();
		oAppData = {};
		var oSearchSpy = sinon.spy(oState.oSmartFilterbar, "search");
		sandbox.stub(oState.oSmartFilterbar, "getFiltersWithValues", function(){
			return [filter2];
		});
		sandbox.stub(oTemplateUtils.oComponentUtils,"getSettings", function(){
			return {
				"dataLoadSettings": {
					"loadDataOnAppLaunch":"always"
				}
			}
		});
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oNavigationPromise.then(function(){
			assert.ok(!oSearchSpy.calledOnce, "Search should not be triggered Mandatory fields are not filled.");
			oSearchSpy.restore();
			done();
		});
	});

	test("Consider manifest settings in Live Mode Custom Variant", function(assert){
		var done = assert.async();
		oAppData = {};
		var oSearchSpy = sinon.spy(oState.oSmartFilterbar, "search");
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantStandard", function(){
			return false;
		});
		sandbox.stub(oTemplateUtils.oComponentUtils,"getSettings", function(){
			return {
				"dataLoadSettings": {
					"loadDataOnAppLaunch":"always"
				}
			}
		});
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oNavigationPromise.then(function(){
			assert.ok(oSearchSpy.calledOnce, "Search should be triggered for custom variant in live mode for manifest settings always");
			oSearchSpy.restore();
			done();
		});
	});

	module("Parse URL: set Filterbar", {
		setup: function(){
			oStubForPrivate = testableHelper.startTest();
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
			sandbox = sinon.sandbox.create();
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	function configurableTest(assert, oIAppState, oNavigationParameterURL, oNavigationParameterXAppState, oUserDefaultVariant, oUserDefaultValues, oBackendDefaultValues){
		/*
		 * currently there are 6 different known sources for filter values in SFB on startup of the app, some with different
		 * flavors:
		 * - iAppState: Any kind of back navigation or restoring a app to an older state by navigating to the URL
		 * 		stored at that time
		 * - navigationParameters: parameters given in any (forward) cross app navigation. There are two
		 * 		flavors:
		 * 		a) URLParameters: parameters given directly in the URL
		 * 		b) xAppState: navigation parameters encapsulated by an xAppState
		 * - userDefaultVariant: Parameters stored in a variant that the user marked as default. This
		 * 		information is stored in LREP
		 * 		=> As although delivered standard variants are using the same mechanism, the
		 * 				current assumption is, that they are handled the same way
		 * - userDefaultValues: In FLP (with some special preconditions) the user can set values for specific parameters
		 * 		that should be used for all apps
		 * - backendStandardVariant (not yet supported): A standard variant defined via annotations in the backend
		 * - backendDefaultValues: Default values for single properties defined via annotations in the backend
		 *
		 * Some of these support only single values, while others support full-fledged select options.
		 * If several of these sources contain values, the SFB should be filled according to the decision tree blow.
		 * "|" means property wise or, with priority from left to right (i.e. take the value for each property from the
		 * first place where it's specified)
		 *
		 * iAppState given?
		 * -> yes: use only the values from iAppstate
		 * -> no: navigationParameters given?
		 * 				-> yes: userDefaultVariant given?
		 * 								-> yes: use navigationParameters | userDefaultVariant
		 * 								-> no: use navigationParameters | userDefaultValues | backendStandardVariant | backendDefaultValues
		 * 				-> no: userDefaultVariant given?
		 * 								-> yes: use userDefaultVariant
		 * 								-> no: use userDefaultValues | backendStandardVariant | backendDefaultValues
		 */

//		preparation
//		data needed to provide in stubs
		var oSFBSelectionVariant = new SelectionVariant();
//		data set in stubs
		var aSFBAdvancedArea = [];
		var sSFBUiStateSelectionVariant;
		var oSFBUiStateSemanticDates;
		var oSFBUiStateProperties;
//		data to be checked
		var aSFBAdvancedAreaExpected = [];
//		needed stubs
		sandbox.stub(oState.oSmartFilterbar, "addFieldToAdvancedArea", function(sField){
			aSFBAdvancedArea.push(sField);
		});
//      variable to check if DisplayCurrency is there and value is comming from flp
		var flpValueforDisplayCurrency = false;
		sandbox.stub(oState.oSmartFilterbar, "clearVariantSelection");
		sandbox.stub(oState.oSmartFilterbar, "clear");
		sandbox.stub(oState.oSmartFilterbar, "getUiState", function(){
			return {
				getSelectionVariant : function(){
					return oSFBSelectionVariant;
				},
				getSemanticDates: function() {
					return {};
				}
			};
		});
		sandbox.stub(oState.oSmartFilterbar, "setUiState", function(oUiState, mProperties){
			sSFBUiStateSelectionVariant = oUiState.getSelectionVariant();
			oSFBUiStateProperties = mProperties;
			oSFBUiStateSemanticDates = oUiState.getSemanticDates();
		});
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantStandard", function(){
			return true;
		});
		sandbox.stub(oState.oMultipleViewsHandler, "getEnableAutoBinding", function(){
			return false;
		});

		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		var iExpectedSearchCount = 1; // default

//		default values, if none of the sources contains values
		oAppData = {
				oDefaultedSelectionVariant: new SelectionVariant(),
				oSelectionVariant: new SelectionVariant(),
				semanticDates: {}
		};
		oURLParameters = {};
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
//		checks: methods from SFB should only be called if needed:
		var bSFBaddFieldToAdvancedAreaCalled = false;
		var bSFBsetUiStateCalled = false;
		// since modifyStartup extension is called, UI state is retrieved in startup case
		var bSFBgetUiStateCalled = true;
		var bSFBisCurrentVariantStandardCalled = false;
		var bMVgetEnableAutoBindingCalled = false;


//		default values provided in the different sources are reflect differently:
//		userDefaultVariant: not provided in interface, but already applied to SFB
		for( var sProp in oUserDefaultVariant){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultVariant[sProp]);
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = true;
		}

//		backendDefaultValues: not provided in interface, but already applied to SFB, but only if no userDefaultVariant exists
		if (!oUserDefaultVariant || isEmptyObject(oUserDefaultVariant)){}
		for( var sProp in oBackendDefaultValues){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oBackendDefaultValues[sProp]);
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = true;
		}

//		iAppstate
		if (oIAppState && !isEmptyObject(oIAppState)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.iAppState;
			for (var sProp in oIAppState) {
				if (sProp !== "semanticDates") {
					oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oIAppState[sProp]);
					aSFBAdvancedAreaExpected.push(sProp);
				}
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBgetUiStateCalled = false;
			bSFBsetUiStateCalled = true;
			iExpectedSearchCount = 0;
		}

//		navigationParameters: a) directly in URL
		if (oNavigationParameterURL && !isEmptyObject(oNavigationParameterURL)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.URLParams;
			oURLParameters = oNavigationParameterURL;
			for( var sProp in oNavigationParameterURL){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterURL[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBgetUiStateCalled = false;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = false;
			iExpectedSearchCount = 1;
		}

//		navigationParameters b) in xAppState
		if (oNavigationParameterXAppState && !isEmptyObject(oNavigationParameterXAppState)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.xAppState;
			for( var sProp in oNavigationParameterXAppState){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterXAppState[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBgetUiStateCalled = false;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = false;
			iExpectedSearchCount = 1;
		}

//		userDefaultValues
		if (oUserDefaultValues && !isEmptyObject(oUserDefaultValues)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.xAppState;
			for( var sProp in oUserDefaultValues){
				if(sProp != "DisplayCurrency"){
					oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				else {
					oAppData.oDefaultedSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				aSFBAdvancedAreaExpected.push(sProp);
			}
			oAppData.bNavSelVarHasDefaultsOnly = true;
			bSFBisCurrentVariantStandardCalled = true;
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bMVgetEnableAutoBindingCalled = true;
			flpValueforDisplayCurrency = true;
		}

//		finalize interface
		oSFBSelectionVariant = oSFBSelectionVariant.toJSONObject();
		oAppData.selectionVariant = oAppData.oSelectionVariant.toJSONString();
		oAppData.semanticDates = oIAppState && oIAppState.semanticDates || {};

		/*********************************************************************************************************************
		 * execution * ***********
		 */
		var done = assert.async();
		var oNavigationPromise;
		if (sNavType === sap.ui.generic.app.navigation.service.NavType.iAppState){
			oIappStateHandler.applyState(oAppData);
			oNavigationPromise = Promise.resolve();
		} else {
			oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		}
		oAppDataLib = oAppData;
//		checks
		oNavigationPromise.then(function(){
//			no unneeded calls to SFB
			if(!flpValueforDisplayCurrency){
				assert.equal(oState.oSmartFilterbar.addFieldToAdvancedArea.called, bSFBaddFieldToAdvancedAreaCalled, "addFieldToAdvancedArea called");
			}
			assert.equal(oState.oSmartFilterbar.setUiState.called, bSFBsetUiStateCalled, "setUiState called");
			assert.equal(oState.oSmartFilterbar.getUiState.called, bSFBgetUiStateCalled, "getUiState called");
			assert.equal(oState.oSmartFilterbar.isCurrentVariantStandard.called, bSFBisCurrentVariantStandardCalled, "isCurrentVariantStandard called");
			assert.equal(oSearchSpy.callCount, iExpectedSearchCount, "Search must have been triggered exactly " + iExpectedSearchCount + " times");

			if(bSFBsetUiStateCalled){
//				build expected result according to described decision tree, but without the parts that are preset by SFB (as the
//				mixing is not done by us but by the SFB)
//				check is only possible, when set by us (not handled by SFB itself)
//				if we would need to handle everything, the expected values would look like this:
//				var oExpectedValues =
//					oIAppState ||
//					((oNavigationParameterURL || oNavigationParameterXAppState) ?
//							(oUserDefaultVariant ? extend({}, oUserDefaultVariant, oNavigationParameterURL, oNavigationParameterXAppState) :
//								extend({}, oBackendDefaultValues, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
//								(oUserDefaultVariant ? oUserDefaultVariant : extend({}, oBackendDefaultValues, oUserDefaultValues)) );
				var oExpectedValues =
					oIAppState ||
					((oNavigationParameterURL || oNavigationParameterXAppState) ?
							(oUserDefaultVariant ? extend({}, oNavigationParameterURL, oNavigationParameterXAppState) :
								extend({}, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
									(oUserDefaultVariant ? extend({}, oUserDefaultVariant, oUserDefaultValues) : extend({}, oBackendDefaultValues, oUserDefaultValues)) );
				var oSelectionVariant = new SelectionVariant();
				for ( var sProp in oExpectedValues) {
					if (sProp !== "semanticDates") {
						if (sProp == "DisplayCurrency") {
							oSelectionVariant.addParameter("P_DisplayCurrency",oExpectedValues[sProp]);
						}
						else {
							oSelectionVariant.addSelectOption(sProp, "I", "EQ", oExpectedValues[sProp]);
						}
					}
				}
				var bReplaceable;
				// Even when user default values are available, if these are modified through the modifyStartupextension
				// in all cases except when navType is iappState, then these default values are replaced by modified values
				if (!oUserDefaultValues || sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState){
					bReplaceable=true;
				} else {
					bReplaceable=false;
				}


				assert.ok(oState.oSmartFilterbar.setUiState.calledOnce, "setUiState called exactly once");
				assert.ok(areTwoVariantsEquivalent(sSFBUiStateSelectionVariant, oSelectionVariant.toJSONObject()), "selectionVariant correctly set");
				assert.equal(oSFBUiStateSemanticDates, oAppData.semanticDates, "semantic date correctly set");

				assert.deepEqual(oSFBUiStateProperties,{
					replace: bReplaceable,
					strictMode: false
				}, "correct filter values set");

			}

			if(oState.oSmartFilterbar.addFieldToAdvancedArea.called){
				if(!flpValueforDisplayCurrency){
					assert.deepEqual(aSFBAdvancedArea, aSFBAdvancedAreaExpected, "correct fields added to advanced area");
				}
			}

			done();
		}).catch(function(){
			assert.ok(false, "parseUrlAndApplyAppState failed");
			done();
		});
	}

	// util function to compare parameters and options of the variants irrespective of the array order
	function areTwoVariantsEquivalent(oVariant1, oVariant2) {
		return areArrayContentsSame(oVariant1.Parameters, oVariant2.Parameters, "PropertyName")
			&& areArrayContentsSame(oVariant1.SelectOptions, oVariant2.SelectOptions, "PropertyName");
	}

	function areArrayContentsSame(array1, array2, key) {
		function fnComparator(a, b) {
			if (a[key] === b[key]) return 0;
			return a[key] > b[key] ? 1 : -1;
		}
		array1 = array1.sort(fnComparator);
		array2 = array2.sort(fnComparator);

		return deepEqual(array1, array2);
	}

// simple tests - only one source used
	test("app startup with iAppState", function(assert){
		configurableTest(assert, {a: "1", b: "2"});
	});

	test("app startup with iAppState with Semantic Dates", function(assert){
		configurableTest(assert, {a: "1", b: "2", semanticDates: {c: "3"}});
	});

	test("cross app navigation with URL parameters", function(assert){
		configurableTest(assert, null, {a: "1", b: "2"});
	});

	test("cross app navigation with x-app-state", function(assert){
		configurableTest(assert, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default variant", function(assert){
		configurableTest(assert, null, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default parameters", function(assert){
		configurableTest(assert, null, null, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default parameters for DisplayCurrency", function(assert){
		configurableTest(assert, null, null, null, null, {DisplayCurrency: "Eur"});
	});

	test("app startup with a backenddefault parameters", function(assert){
		configurableTest(assert, null, null, null, null, null, {a: "1", b: "2"});
	});

	test("app startup with user default variant and user default parameters", function(assert){
		configurableTest(assert, null, null, null, {a: "1", b: "2"}, {a: "3", c: "4"});
	});


// combined sources
	test("backenddefault and user default parameters", function(assert){
		configurableTest(assert, null, null, null, null, {a: "1"}, {b: "2"});
	});

});
