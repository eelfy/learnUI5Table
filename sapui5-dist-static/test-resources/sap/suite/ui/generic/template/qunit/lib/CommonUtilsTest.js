/**
 * tests for the sap.suite.ui.generic.template.lib.CommonUtils
 */
sap.ui.define([ "testUtils/sinonEnhanced", "sap/m/Table", "sap/ui/model/Context", "sap/ui/model/json/JSONModel",
                 "sap/suite/ui/generic/template/genericUtilities/testableHelper",
             		"sap/suite/ui/generic/template/lib/CommonUtils", "sap/suite/ui/generic/template/genericUtilities/controlHelper" ], function(sinon, Table, Context, JSONModel, testableHelper, CommonUtils, controlHelper) {
	"use strict";

	var sandbox;
	var sFunctionName, oState, oTemplateUtils;
	var sRequestedModelId;
	var sRequestedTextId;
	var sPath;
	var sGlobFunctionName;
	var oEntityType = {
			entityType: "testEntityType",
			"com.sap.vocabularies.UI.v1.Identification": [],
			"com.sap.vocabularies.UI.v1.LineItem": []
	};
	var oEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: oEntityType
	};
	var mPrivateModelData = {
		generic: {
			listCommons : {
				breakoutActionsEnabled: {}
			},
			controlProperties: {}
		}
	};
	var oPrivateModel = new JSONModel(mPrivateModelData);
	var oModelObject = {};
	var oMetaModelObject = {};
	var oManifestActions = {};
	var oExtensions = {};
	var aPages = [];
	var oController = {
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {
					sRequestedModelId = sId;
					return {
						getResourceBundle : function() {
							return {
								getText : function(sId) {
									sRequestedTextId = sId;
								}
							};
						},
						getMetaModel : function() {
							return {
								getODataEntitySet: function(sEntitySet) {
									return oEntitySet;
								},
								getODataEntityType: function(sEntityType) {
									return oEntityType;
								},
								getODataFunctionImport: function(sFunctionName, bBool) {
									return sGlobFunctionName;
								},
								getObject: function(sPath) {
									return oMetaModelObject;
								}
							};
						},
						getObject: function(sPath) {
							return oModelObject;
						}
					};
				},
				getComponentContainer: function(){
					return {
						getElementBinding: function(){
							return {
								getPath: function(){
									return sPath;
								}
							};
						}
					};
				},
				getEntitySet: function() {
					return oEntitySet.name;
				},
				getAppComponent: function() {
					return {
						getConfig: function() {
							return {
									pages: aPages
							};
						}
					};
				},
				getTemplateName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				},
				getForwardNavigationProperty: function() {
					return false;
				}
			};
		},
		getInnerAppState: Function.prototype,
		byId: function(sId) {
		},
		getMetadata: function () {
			return {
				getName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				}
			};
		}
	};

	var oNavigationHandler = {};
	
	var oServices = {
		oDraftController: {
			isActiveEntity: function(){ return true; }
		},
		oApplication: {
			getBusyHelper: function() {
				return {
					isBusy: function() {
						return false;
					},
					setBusy: Function.prototype
				};
			},
			performAfterSideEffectExecution: function(fnFunction){
				fnFunction();
			},
			getForwardNavigationProperty: function(iViewLevel){
				return "";
			},
			getCurrentKeys: function(iViewLevel){
				return [""];
			},
			getNavigationHandler: function(){
				return oNavigationHandler;
			}
		},
		oDataLossHandler: {
			performIfNoDataLoss: function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical){
			}
		}
	};
	var bIsDraftEnabled;
	var oNavigationContext;
	var oComponentUtils = {
		isDraftEnabled: function(){ return bIsDraftEnabled; },
		getViewLevel: function(){ return 0; },
		navigateAccordingToContext: function(oContext, iDisplayMode, bReplace){
			if (bReplace){
				oNavigationContext = oContext;
			}
		},
		getControllerExtensions: function(){
			return oExtensions;
		},
		getTemplatePrivateModel: function(){
			return oPrivateModel;
		}
	};

	var oCommonUtils;
	var oStubForPrivate;

	module("lib.CommonUtils", {
		setup : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	test("Dummy", function() {
		ok(true, "Test - Always Good!");
	});

	QUnit.test("Function semanticObjectLinkNavigation with adaptNavigationParameterExtension", function(assert) {
		var sSelectionVariant = "";
		var sSelectionVariantPrepared;
		var oEventParameters = {
			semanticObject: "SemanticTestObject2",
			semanticAttributesOfSemanticObjects: {
				"": {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject2: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711",
					"SemanticTestObjectNull": null,
					"SemanticTestObjectUndefined": undefined,
					"SemanticTestObject0": 0,
					"SemanticTestObjectNumber4711": 4711,
					"SemanticTestObjectString4711": "4711"
				}
			},
			semanticAttributes: {
				"Currency": "EUR",
				"Price": "120",
				"ParameterToBeDeleted": "4711"
			}
		};
		var oEvent = {
			getParameters: function() {
				return oEventParameters;
			},
			getSource: function () {
				return {};
			}
		};
		var mSelectionVariantPreparedExpectedResult = {
			SelectOptions: {
				"Currency": [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
				"Price": [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
			},
			Parameters: {
				"SemanticTestObjectNull": "",
				"SemanticTestObjectUndefined": "",
				"SemanticTestObject0": "0",
				"SemanticTestObjectNumber4711": "4711",
				"SemanticTestObjectString4711": "4711"
			}
		};
		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			toJSONString: function() {
				return JSON.stringify(this);
			},
			addParameter: function(sName, sValue) {
				this.Parameters[sName] = sValue;
			},
			removeParameter: function(sName) {
				delete this.Parameters[sName];
			},
			getParameterNames: function() {
				return Object.keys(this.Parameters);
			},
			getParameter: function(sName) {
				return this.Parameters[sName];
			},
			getSelectOption: function(sProperty) {
				return this.SelectOptions[sProperty];
			},
			getSelectOptionsPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			},
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};
		var oObjectInfo = {
			semanticObject : oEventParameters.semanticObject,
			action: ""
		};
		var oNavigationExtensionStub = sandbox.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			oSelectionVariant.removeParameter("ParameterToBeDeleted");
		});
		function isEmpty(myObject) {
			for(var key in myObject) {
				if (myObject.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		};
		sandbox.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function(semanticAttributesOfSemanticObjects, sSelectionVariant) {
				return oSelectionVariant;
		});
		sandbox.stub(oStubForPrivate, "removePropertiesFromNavigationContext", function(oSelectionVariant) {
			return oSelectionVariant;
		});
		sandbox.stub(oNavigationHandler, "processBeforeSmartLinkPopoverOpens", function(eventParameters, selectionVariantPrepared) {
			sSelectionVariantPrepared = selectionVariantPrepared;
		});

		oCommonUtils.semanticObjectLinkNavigation(oEvent, sSelectionVariant, oController);

		assert.ok(oNavigationExtensionStub.calledWith(oSelectionVariant, oObjectInfo), "Navigation extension called with the SelectionVariant and the ObjectInfo");
		assert.ok(!oSelectionVariant.Parameters.ParameterToBeDeleted, "Property ParameterToBeDeleted was removed from Parameters");
		assert.ok(oSelectionVariant.SelectOptions.Currency, "Property Currency is still available in SelectOptions");
		assert.ok(oSelectionVariant.SelectOptions.Price, "Property Price is still available in SelectOptions");
		assert.deepEqual(JSON.parse(sSelectionVariantPrepared), mSelectionVariantPreparedExpectedResult, "SelectionVariant contains expected parameters");
	});

	QUnit.test("Function formatDraftLockText", function(assert) {
		oCommonUtils.formatDraftLockText(true, true, "User");
		assert.strictEqual(sRequestedModelId, "i18n", "only i18n Modell should be retrieved");
		assert.strictEqual(sRequestedTextId, "LOCKED_OBJECT", "Text LOCKED_OBJECT should be retrieved");

		oCommonUtils.formatDraftLockText(true, true);
		assert.strictEqual(sRequestedTextId, "UNSAVED_CHANGES", "Text UNSAVED_CHANGES should be retrieved");

		oCommonUtils.formatDraftLockText(false, true);
		assert.strictEqual(sRequestedTextId, "DRAFT_OBJECT", "Text DRAFT_OBJECT should be retrieved");

		var sText = oCommonUtils.formatDraftLockText(true, false);
		assert.strictEqual(sText, "", "Text should be empty");
	});

	QUnit.test("navigatefromlistitem", function(assert){
		var oContext = { };
		oCommonUtils.navigateFromListItem(oContext, true);
		assert.equal(oNavigationContext, oContext, "Navigate to context as given");
	});

	QUnit.test("navigateExternal", function(assert) {
		var sNavParameters = "json string";
		var oNavigateStub = sinon.stub(oNavigationHandler, "navigate");
		var oMixAttributesStub = sinon.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function() {
			return {
				toJSONString: function() {
					return sNavParameters;
				}
			}
		});

		var oNavigationExtensionStub = sinon.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			return;
		});
		
		sandbox.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			fnProcessFunction();
		});

		var oOutbound = {
			semanticObject: "Semantic Object",
			action: "action",
			parameters: {
				a: "a",
				b: "b"
			}
		};
		oCommonUtils.navigateExternal(oOutbound, {});

		assert.ok(oMixAttributesStub.calledWith(oOutbound.parameters),
		"Mix attributes called with map containing navigation parameters");
		assert.ok(oNavigateStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"NavigationHanlder was called with semantic object, action and navigation parameters");

		var oInnerAppState = {
				a: "a"
		};
		var oState = {
				getCurrentAppState: function() {
					return oInnerAppState;
				}
		};
		oCommonUtils.navigateExternal(oOutbound, oState);
		assert.ok(oNavigateStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"... and with inner app state if provided by state");
	});

	QUnit.test("fnSetControlSortOrder - PresentationVariant as a JSON string", function(assert){
		var oMetaModel = {
			getODataEntitySet: function(s) {
				return {
					entityType: "dummyEntityType"
				};
			},
			getODataEntityType: function(s) {
				return {
					property: [
						{name: "A"}, {name: "C"}
					]
				}
			}
		};
		var oModel = {
			getMetaModel: function() {
				return oMetaModel;
			}
		}
		var oUiState = {
			getPresentationVariant: function() {
				return {
					SortOrder: undefined
				};
			},
			setPresentationVariant: function(oParam) {
				return;
			}
		};
		var oSmartTable = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel: function() {
				return oModel;
			},
			getUiState: function() {
				return oUiState;
			},
			setUiState: function(oParam) {
				return;
			},
			getCustomData: function() {
				return [];
			},
			isA: function(sControl) {
				return true;
			}
		}
		var oState = {
			oSmartTable: oSmartTable
		};
		var aSortOrder = [
				{
					Property: "A",
					Descending: true
				},
				{
					Property: "C",
					Descending: false
				}
			];
		var sPresentationVariant = JSON.stringify({"SortOrder": aSortOrder});
		var setPresentationVariantStub = sinon.stub(oSmartTable.getUiState(), "setPresentationVariant");
		var getUiStateStub = sinon.stub(oSmartTable, "getUiState");
		getUiStateStub.returns(oUiState);
		oCommonUtils.setControlSortOrder(oState, sPresentationVariant);

		assert.ok(setPresentationVariantStub.calledWith({SortOrder: aSortOrder}), "Sort Order is set to the table correctly");
	});

	QUnit.test("fnSetControlSortOrder - PresentationVariant as an object", function(assert){
		var oMetaModel = {
			getODataEntitySet: function(s) {
				return {
					entityType: "dummyEntityType"
				};
			},
			getODataEntityType: function(s) {
				return {
					property: [
						{name: "A"}, {name: "C"}
					]
				}
			}
		};
		var oModel = {
			getMetaModel: function() {
				return oMetaModel;
			}
		}
		var oUiState = {
			getPresentationVariant: function() {
				return {
					SortOrder: undefined
				};
			},
			setPresentationVariant: function(oParam) {
				return;
			}
		};
		var oSmartTable = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel: function() {
				return oModel;
			},
			getUiState: function() {
				return oUiState;
			},
			setUiState: function(oParam) {
				return;
			},
			getCustomData: function() {
				return [];
			},
			isA: function(sControl) {
				return true;
			}
		}
		var oState = {
			oSmartTable: oSmartTable
		};
		var aSortOrder = [
				{
					Property: "A",
					Descending: true
				},
				{
					Property: "C",
					Descending: false
				}
			];
		var setPresentationVariantStub = sinon.stub(oSmartTable.getUiState(), "setPresentationVariant");
		var getUiStateStub = sinon.stub(oSmartTable, "getUiState");
		getUiStateStub.returns(oUiState);
		oCommonUtils.setControlSortOrder(oState, {"SortOrder": aSortOrder});

		assert.ok(setPresentationVariantStub.calledWith({SortOrder: aSortOrder}), "Sort Order is set to the table correctly");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - SmartLink Navigation", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return true;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return false;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - SmartTable Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return true;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - Link Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return {
				getParent: function() {
					return;
				}
			};
		});

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return false;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - Button Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return {
				getParent: function() {
					return Object.assign({bParent: true}, oControl);
				}
			};
		});

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function(obj) {
			return obj.bParent === true; //To return true the second time this method is called with parent control object. 
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Draft case - Promise from App resolved", function(assert) {

		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve(oAppResult);
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		var oDataLossStub = sinon.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});		

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {
			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function(oResult) {
				assert.ok(true, "...that is resolved");
				assert.equal(oResult,oAppResult,"...to the result provided by the app");
				oDataLossStub.restore();
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				oDataLossStub.restore();
				done();
			});
		});
	});

	QUnit.test("Draft case - Promise from App rejected", function(assert) {

		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				reject(oAppResult);
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		
		var oDataLossStub = sinon.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});	

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				oDataLossStub.restore();
				done();
			}, function(oResult) {
				assert.ok(true, "...that is rejected");
				assert.equal(oResult,oAppResult,"...to the result provided by the app");
				oDataLossStub.restore();
				done();
			});
		});
	});

	QUnit.test("Draft case - no Promise from App", function(assert) {

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		var oDataLossStub = sinon.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});	

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				oDataLossStub.restore();
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				oDataLossStub.restore();
				done();
			});
		});
	});

	QUnit.test("Non-Draft case without changes - Promise from App resolved", function(assert) {
		bIsDraftEnabled = false;
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return {
						hasPendingChanges: function() {
							return false;
						}
					};
				}
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		var oDataLossStub = sinon.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});	
		
		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				oDataLossStub.restore();
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				oDataLossStub.restore();
				done();
			});
		});
	});
	
/* To be moved to checks of DataLossHandler class

	QUnit.test("Non-Draft case with changes - user confirms - no Promise from App provided", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return Promise.resolve(oDialogFragment);
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
		setTimeout(function() {

			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes, but no dataloss check requestes - Promise from App resolved",
			function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"dataloss" : {
					"popup": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks
		// are done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				assert.notOk(oServices.oApplication.getDialogFragmentForViewAsync.called, "Dataloss Popup shown");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes - user cancels", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossCancel();
			});
			return Promise.resolve(oDialogFragment)
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
		setTimeout(function() {
			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});
	


	QUnit.test("Busy Indicator checked", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("No Busy Indicator check requested", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"check": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit
	.test(
			"Busy Indicator set (immediately) and restored (after Promise is settled) - Non-Draft case with changes - user confirms - Promise from App rejected",
			function(assert) {
				var oBusyHelper = {};
				sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
					return oBusyHelper;
				});
				var bBusyPromiseResolved = false;
				sandbox.stub(oBusyHelper, "isBusy", function() {
					return false;
				});
				sandbox.stub(oBusyHelper, "setBusy", function(oPromise) {
					oPromise.then(Function.prototype, function() {
						bBusyPromiseResolved = true;
					});
				});

				bIsDraftEnabled = false;
				var oModel = {
						hasPendingChanges: Function.prototype,
						resetChanges: Function.prototype
				};
				sandbox.stub(oController, "getView", function() {
					return {
						getModel: function() {
							return oModel;
						},
						setBindingContext: Function.prototype
					};
				});
				sandbox.stub(oModel, "hasPendingChanges", function() {
					return true;
				});
				sandbox.stub(oModel, "resetChanges");

				var oDialogFragment = {
						getModel: function() {
							return {
								setProperty: Function.prototype
							};
						},
						open: Function.prototype,
						close: Function.prototype
				};

				sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync",
						function(oView, sName, oController) {
					sandbox.stub(oDialogFragment, "open", function() {
						oController.onDataLossOK();
					});
					return Promise.resolve(oDialogFragment);
				});
				sandbox.stub(oComponentUtils, "fire");

				var bSpyCalled = false;
				var fnFunction = function() {
					bSpyCalled = true;
					return new Promise(function(resolve, reject) {
						reject();
					});
				};
				var mParameters = {
						"sActionLabel": "Action Name that was executed"
				};


				var done = assert.async(); // provides a done function to signal the test framework, that all
				// checks are done
				var oResult = oCommonUtils.securedExecution(fnFunction, mParameters)//.then(function (res) {

				assert.ok(oBusyHelper.setBusy.called, "Set busy was called");
				assert.notOk(bBusyPromiseResolved, "Busy Promise resolved");
				setTimeout(function() {
					assert.ok(oDialogFragment.open.called, "Popup was opened");
					assert.ok(bSpyCalled, "Spy was called");
					assert.ok(oResult instanceof Promise, "returned a promise");
					oResult.then(function() {
						assert.notOk(true, "...that is resolved");
						done();
					}, function() {
						assert.ok(true, "...that is rejected");
						assert.ok(bBusyPromiseResolved, "Busy Promise resolved");
						done();
					});

				});
			});
			
*/

	QUnit.test("No setting of Busy Indicator requested", function(assert) {
		var oBusyHelper = {};
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return oBusyHelper;
		});
		var bBusyPromiseResolved = false;
		sandbox.stub(oBusyHelper, "isBusy", function() {
			return false;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return Promise.resolve(oDialogFragment);
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				reject();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"set": false
				}
		};

		oCommonUtils.securedExecution(fnFunction, mParameters);
		assert.notOk(oBusyHelper.setBusy.called, "Set busy was called");
	});

	//---------  breakout action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	module("lib.CommonUtils.fillEnabledMapForBreakoutActions", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : false
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : false
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true
				}
			}
		};
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, [{}], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : ""
				}
			}
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : ""
				}
			}
		};
		var aContexts = [];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath true", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : "IsActiveEntity"
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : true
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath false", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : "IsActiveEntity"
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : false
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];
		var aButtons = ["VisibilityActionExt"];

		oCommonUtils.fillEnabledMapForBreakoutActions(aButtons, aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	//---------  action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	module("lib.CommonUtils.getBreakoutActionsFromManifest", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("getBreakoutActionsFromManifest - No Breakouts defined", function(assert) {
		oExtensions = {};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should return undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Complete Breakout defined", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions.VisibilityActionExt.id, "VisibilityActionExt", "Breakout action should not be a breakout object");
	});

	module("lib.CommonUtils ObjectPage Self-Linking", {
		setup : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
			oEntitySet = {
					entityType:"CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type",
					name: "CDN_C_STTA_SO_WD_20"
			};
			oEntityType = {
					extensions : "",
					key: {
						propertyRef: [{name: "SalesOrder"},{name: "DraftUUID"},{name: "IsActiveEntity"}]
					},
					name: "CDN_C_STTA_SO_WD_20Type",
					namespace: "CDN_C_STTA_SO_WD_20_CDS",
					property: [{name: "DraftUUID", type: "Edm.Guid"},{name: "SalesOrder", type: "Edm.String"},{name: "IsActiveEntity", type: "Edm.Boolean"}],
			};
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Function getNavigationKeyProperties MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeysExpected = [{name: "SalesOrder", type: "Edm.String"},{name: "DraftUUID", type: "Edm.Guid"},{name: "IsActiveEntity", type: "Edm.Boolean"}];

		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);

		assert.strictEqual(aKeys[0].entitySet, "CDN_C_STTA_SO_WD_20", "EntitySet is correct determined");
		assert.strictEqual(aKeys[0].navigationProperty, undefined, "NavigationProperty is correct determined, it is 'undefined'!");
		for (var i = 0, ilength = aKeys[0].aKeys.length; i < ilength; i++ ) {
			if (aKeys[0].aKeys[i].name === aKeysExpected[i].name) {
				assert.ok(true, "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are equal");
			} else {
				assert.ok(false,  "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are NOT equal");
			}
			if (aKeys[0].aKeys[i].type === aKeysExpected[i].type) {
				assert.ok(true, "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are equal");
			} else {
				assert.ok(false,  "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are NOT equal");
			}
		}
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);
		var oResponse = {DraftAdministrativeData: null, DraftUUID: "00000000-0000-0000-0000-000000000000", HasActiveEntity: false, HasDraftEntity: false, IsActiveEntity: true,
										SalesOrder: "500000207", SalesOrder3:"0500000120"};
		var sExpectedRoute = "/CDN_C_STTA_SO_WD_20(SalesOrder='500000207',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);

		assert.strictEqual(sRoute, sExpectedRoute, "NavigationPath is correct determined");
	});

	module("lib.CommonUtils invokeActionsForExtensionAPI function", {
		setup : function() {
			sandbox = sinon.sandbox.create();
			sFunctionName = "test";
			oState = {};
			oTemplateUtils = {};
			oServices = {
				oApplicationController: {
					invokeActions: function() {
						return Promise.resolve({});
					}
				}
			};
			oComponentUtils = {
				isDraftEnabled: function() {
					return true;
				},
				executeBeforeInvokeActionFromExtensionAPI: Function.prototype,
				executeAfterInvokeActionFromExtensionAPI: Function.prototype,
				getBusyHelper: function() {
					return {
						setBusy: Function.prototype
					}
				}
			};
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		teardown : function() {
			sandbox.restore();
		}
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 1", function(assert) {
		var vContext, mUrlParameters, oSettings;
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			sFunctionName,
			[],
			{triggerChanges: true}
		];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 2", function(assert) {
		var vContext = {}, mUrlParameters = {}, oSettings = {bInvocationGroupingChangeSet: true};
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			"test",
			[
			  {}
			],
			{
			  "operationGrouping": "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
			  "triggerChanges": true,
			  "urlParameters": {}
			}
		  ];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 3", function(assert) {
		var vContext = [{},{}], mUrlParameters = {}, oSettings = {bInvocationGroupingChangeSet: true};
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			"test",
			[
			  {}, {}
			],
			{
			  "operationGrouping": "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
			  "triggerChanges": true,
			  "urlParameters": {}
			}
		  ];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});
	
});
