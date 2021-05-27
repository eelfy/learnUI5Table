/* global QUnit */
sap.ui.define(["sap/fe/macros/flexibility/FormDelegate", "sap/fe/macros/DelegateUtil"], function(FormDelegate, DelegateUtil) {
	"use strict";

	QUnit.module("FormDelegate Tests", {
		before: function() {
			var oTestContext = {
				testGetAllAnnotations: function(oItem) {
					var oAnnotations = {},
						sProperty;

					for (sProperty in oItem) {
						if (sProperty.indexOf("@") >= 0) {
							oAnnotations[sProperty] = oItem[sProperty];
						}
					}
					return oAnnotations;
				},

				testGetObject: function(sPath) {
					var oItem = oTestContext.getModel().getData(), //oTestContext.oTestMetadata,
						aParts,
						sPart,
						iIndex,
						sProp;

					if (sPath) {
						sPath = sPath.replace("testService1.", ""); // ignore service name
						aParts = sPath.split("/");
						while (aParts.length) {
							sPart = aParts.shift();
							if (sPart) {
								iIndex = sPart.indexOf("@");
								if (iIndex >= 0) {
									// has annotation?
									sProp = sPart.substr(0, iIndex);
									oItem = oItem[sProp]; // e.g. property
									if (sProp === "$Path") {
										// resolve path
										oItem = oTestContext.testGetObject("/TestEntityT1/" + oItem);
									}
									sPart = sPart.substr(iIndex); // annotation
									if (oItem) {
										oItem = sPart === "@" ? oTestContext.testGetAllAnnotations(oItem) : oItem[sPart];
									}
								} else {
									oItem = oItem[sPart];
								}
							}
						}
					}
					return oItem;
				},

				oMetaModel: {
					_testInfo: "MetaModel",
					createBindingContext: function(sPath) {
						// e.g. "/TestEntityT1" or "/TestEntityT1/TestProperty1"
						var oItem = oTestContext.testGetObject(sPath),
							oContext = null;

						if (oItem.$kind === "EntityType") {
							oContext = {
								_testInfo: "Context: " + sPath,
								getPath: function() {
									return "/TestEntityT1";
								},
								getObject: function(sPath) {
									return oTestContext.testGetObject(sPath);
								},
								getModel: function() {
									return oTestContext.oMetaModel;
								}
							};
						} else if (oItem.$kind === "Property") {
							oContext = {
								_testInfo: "Context: " + sPath,
								getPath: function() {
									return "/TestEntityT1/TestProperty1";
								},
								getObject: function(sInnerPath) {
									var sFinalPath = sPath;
									if (sInnerPath) {
										if (sInnerPath.startsWith("/")) {
											sFinalPath = sInnerPath;
										} else {
											sFinalPath += "/" + sInnerPath;
										}
									}
									return oTestContext.testGetObject(sFinalPath);
								},
								getModel: function() {
									return oTestContext.oMetaModel;
								}
							};
						}
						return oContext;
					},
					getMetaContext: function(sPath) {
						return {
							_testInfo: "MetaContext: " + sPath,
							getObject: function(sPath) {
								// e.g. "testService1.TestEntityT1" or undefined
								return oTestContext.testGetObject(sPath);
							}
						};
					},
					getObject: function(sPath) {
						// e.g. "/testService1.TestEntityT1/TestProperty1@"
						return oTestContext.testGetObject(sPath);
					},
					requestObject: function(sPath) {
						// e.g. "/TestEntityT1/TestProperty1@com.sap.vocabularies.Common.v1.ValueList"
						return oTestContext.testGetObject(sPath);
					}
				},

				oModel: {
					oData: null,
					_testInfo: "Model",
					getMetaModel: function() {
						return oTestContext.oMetaModel;
					},
					isA: function(sClass) {
						return sClass === "sap.ui.model.odata.v4.ODataModel";
					},
					getData: function() {
						return this.oData;
					},
					setData: function(oData) {
						this.oData = oData;
					}
				},

				getModel: function() {
					return oTestContext.oModel;
				}
			};
			this.oTestContext = oTestContext;
		},
		beforeEach: function() {},
		afterEach: function() {},
		after: function() {}
	});

	function stringifySortedObjectProperties(oObj) {
		return Object.getOwnPropertyNames(oObj)
			.sort()
			.map(function(sKey) {
				return [sKey, oObj[sKey]].join("=");
			})
			.join(",");
	}

	function getPropertyBagForGetPropertyInfo(oTestContext) {
		var oPropertyBag = {
			element: {
				_testInfo: "FormContainer::Facet1",
				oBinding: {
					getPath: function() {
						return "/TestEntityT1(ID=...,IsActiveEntity=...)";
					},
					getProperty: function(sPath) {
						return oTestContext.testGetObject("/TestEntityT1/" + sPath);
					}
				},
				getModel: function() {
					return oTestContext.getModel();
				},
				getBinding: function(sAggregationName) {
					return {};
				},
				getBindingContext: function() {
					return this.oBinding;
				}
			},
			aggregationName: "formElements",
			payload: {}
		};
		return oPropertyBag;
	}

	QUnit.test("Delegate: getPropertyInfo: fields", function(assert) {
		var oTestContext = this.oTestContext,
			done = assert.async(),
			oTestMetadata1 = {
				$Type: "testService1.TestEntityT1",
				"TestEntityT1": {
					$kind: "EntityType",
					TestProperty1: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.Label": "Label for TestProperty1",
						"@com.sap.vocabularies.Common.v1.ValueList": {
							_testInfo: "@ValueList"
						}
					},
					TestProperty2NoLabel: {
						$kind: "Property",
						$Type: "Edm.String"
					},
					TestProperty3DataFieldDefault: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.UI.v1.DataFieldDefault": {
							Label: "Label for TestProperty3DataFieldDefault"
						}
					},
					TestProperty4Complex: {
						// complex property is unsupported
						$kind: "Property",
						$Type: "No_Edm"
					},
					TestProperty5Hidden: {
						// hidden property is unsupported
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.UI.v1.Hidden": true
					},

					TestPropertyTrue: true,

					TestProperty6HiddenViaPath: {
						// hidden property is unsupported
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.UI.v1.Hidden": { $Path: "TestPropertyTrue" }
					},
					TestProperty7FcHidden: {
						// property hidden by field control is unsupported
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.FieldControl": {
							$EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
						}
					},

					TestFieldControlProperty0: 0,

					TestProperty8FcPath0: {
						// property is supported
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.FieldControl": {
							Path: "TestFieldControlProperty0"
						}
					},

					TestFieldControlProperty1: 1,

					TestProperty9FcPath1: {
						// property is unsupported
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.FieldControl": {
							Path: "TestFieldControlProperty1"
						}
					},

					TestNavigationProperty1: {
						$kind: "NavigationProperty"
					},
					"TestNavigationProperty1_TestProperty9": {
						// a property which starts with a NavigationProperty is unsupported
						$kind: "Property",
						$Type: "Edm.String"
					}
				}
			},
			oExpectedForAll = {
				entityType: "testService1.TestEntityT1"
			},
			aExpectedResults = [
				{
					name: "TestProperty1",
					label: "Label for TestProperty1",
					unsupported: false
				},
				{
					name: "TestProperty2NoLabel",
					label: "[LABEL_MISSING: TestProperty2NoLabel]",
					unsupported: false
				},
				{
					name: "TestProperty3DataFieldDefault",
					label: "Label for TestProperty3DataFieldDefault",
					unsupported: false
				},
				{
					name: "TestProperty4Complex",
					label: "[LABEL_MISSING: TestProperty4Complex]",
					unsupported: true
				},
				{
					name: "TestProperty5Hidden",
					label: "[LABEL_MISSING: TestProperty5Hidden]",
					unsupported: true
				},
				{
					name: "TestProperty6HiddenViaPath",
					label: "[LABEL_MISSING: TestProperty6HiddenViaPath]",
					unsupported: true
				},
				{
					name: "TestProperty7FcHidden",
					label: "[LABEL_MISSING: TestProperty7FcHidden]",
					unsupported: true
				},
				{
					name: "TestProperty8FcPath0",
					label: "[LABEL_MISSING: TestProperty8FcPath0]",
					unsupported: false
				},
				{
					name: "TestProperty9FcPath1",
					label: "[LABEL_MISSING: TestProperty9FcPath1]",
					unsupported: true
				},
				{
					name: "TestNavigationProperty1_TestProperty9",
					label: "[LABEL_MISSING: TestNavigationProperty1_TestProperty9]",
					unsupported: true
				}
			],
			oPropertyBag;

		oTestContext.getModel().setData(oTestMetadata1);
		oPropertyBag = getPropertyBagForGetPropertyInfo(oTestContext);

		FormDelegate.getPropertyInfo(oPropertyBag).then(function(aPropertyInfo) {
			var i, sExpected, oInfo, sResult;

			for (i = 0; i < aPropertyInfo.length; i++) {
				oInfo = Object.assign({}, oExpectedForAll, aExpectedResults[i]);
				oInfo.bindingPath = oInfo.name;
				sExpected = stringifySortedObjectProperties(oInfo);

				oInfo = aPropertyInfo[i];
				sResult = stringifySortedObjectProperties(oInfo);

				assert.strictEqual(sResult, sExpected, "getPropertyInfo: " + oInfo.name + ": unsupported=" + oInfo.unsupported);
			}
			done();
		});
	});

	function getPropertyBagForCreateLayout(assert, oTestContext, sPropertyName) {
		var sEntityType = oTestContext
				.getModel()
				.getMetaModel()
				.getMetaContext("/TestEntityT1")
				.getObject("/$Type")
				.split(".")[1], // e.g. "TestEntityT1"
			oPropertyBag = {
				modifier: {
					targets: "jsControlTree", // "jsControlTree" or "xmlTree"
					bySelector: function(oSelector, oAppComponent, oView) {
						var mControls = oPropertyBag._mControls;

						return mControls[oSelector.id];
					},
					getId: function() {
						return "modifierId";
					},
					getAggregation: function(oControl, sOption) {
						return oControl.mAggregations[0][sOption];
					},
					getProperty: function(oCustomData, sOpt) {
						return oCustomData.mProperties[sOpt];
					},
					templateControlFragment: function(sFragmentName, oPreprocessorSettings, oView) {
						var oMetaModel = oTestContext.getModel().getMetaModel(),
							bIsValueHelp = sFragmentName === "sap.fe.macros.flexibility.ValueHelpWrapper",
							sEntityType = oPropertyBag.element.data("entitySet"),
							sPropertyName = oPropertyBag.bindingPath,
							oControl = {
								ValueHelpWrapper: {
									_testInfo: "ValueHelpControl"
								},
								FormElement: {
									_testInfo: "FormElementControl"
								}
							},
							oExpected = {
								ValueHelpWrapper: {
									id: "FormId",
									idPrefix: "fieldSelectorId",
									valueHelpRequestGroupId: "$auto.Heroes"
								},
								FormElement: {
									_flexId: "fieldSelectorId",
									onChange: "testOnChange",
									displayMode: ""
								}
							},
							sContextProperty,
							sControlType,
							sExpected,
							sResult,
							oThis;

						sContextProperty = bIsValueHelp ? "property" : "dataField";

						sExpected = bIsValueHelp ? "sap.fe.macros.flexibility.ValueHelpWrapper" : "sap.fe.macros.form.FormElement";
						assert.strictEqual(sFragmentName, sExpected, "templateControlFragment: fragmentName: " + sFragmentName);

						sControlType = bIsValueHelp ? "ValueHelpWrapper" : "FormElement";
						sExpected = "MetaContext: /" + sEntityType + ", Context: /" + sEntityType + "/" + sPropertyName;
						sResult =
							oPreprocessorSettings.bindingContexts.entitySet._testInfo +
							", " +
							oPreprocessorSettings.bindingContexts[sContextProperty]._testInfo;
						assert.strictEqual(sResult, sExpected, "bindingContexts.entitySet, bindingContexts." + sContextProperty);

						oThis = oPreprocessorSettings.bindingContexts.this;

						sExpected = stringifySortedObjectProperties(oExpected[sControlType]);
						sResult = stringifySortedObjectProperties(oThis.getModel().getData());
						assert.strictEqual(sResult, sExpected, "bindingContexts.this");

						sExpected = oMetaModel._testInfo + ", " + oMetaModel._testInfo;
						sResult =
							oPreprocessorSettings.models.entitySet._testInfo +
							", " +
							oPreprocessorSettings.models[sContextProperty]._testInfo;
						assert.strictEqual(sResult, sExpected, "models.entitySet, models." + sContextProperty);

						oThis = oPreprocessorSettings.models.this;

						sExpected = stringifySortedObjectProperties(oExpected[sControlType]);
						sResult = stringifySortedObjectProperties(oThis.getData());
						assert.strictEqual(sResult, sExpected, "models.this");

						sExpected = bIsValueHelp ? undefined : oPropertyBag.view._testInfo;
						assert.strictEqual(oView && oView._testInfo, sExpected, "templateControlFragment: view");

						return Promise.resolve(oControl[sControlType]);
					}
				},
				appComponent: {
					getModel: function() {
						return oTestContext.getModel();
					}
				},
				element: {
					sId: "FormId", // or property id
					data: function(sPath) {
						if (sPath === "entitySet") {
							return sEntityType; // e.g. "TestEntityT1"
						}
						return undefined;
					},
					mAggregations: [
						{
							customData: [
								{
									mProperties: {
										key: "entitySet",
										value: "TestEntityT1"
									}
								},
								{
									mProperties: {
										key: "valueHelpRequestGroupId",
										value: "$auto.Heroes"
									}
								},
								{
									mProperties: {
										key: "onChange",
										value: "testOnChange"
									}
								},
								{
									mProperties: {
										key: "editMode",
										value: "testEditMode"
									}
								}
							]
						}
					]
				},
				_mControls: {
					parentSelectorId: {
						// FormContainer
						sId: "FormContainerId",
						mAggregations: [
							{
								customData: [
									{
										mProperties: {}
									}
								]
							}
						]
					}
				},
				parentSelector: {
					id: "parentSelectorId"
				},
				fieldSelector: {
					id: "fieldSelectorId"
				},
				view: {
					_testInfo: "view"
				},
				bindingPath: sPropertyName, // e.g. "TestProperty1"
				payload: {}
			};
		return oPropertyBag;
	}

	QUnit.test("Delegate: createLayout: Field with value help", function(assert) {
		var oTestContext = this.oTestContext,
			done = assert.async(),
			oTestMetadata2 = {
				$Type: "testService1.TestEntityT1",
				"TestEntityT1": {
					$kind: "EntityType",
					TestProperty1: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.Label": "Label for TestProperty1",
						"@com.sap.vocabularies.Common.v1.ValueList": {
							_testInfo: "@ValueList"
						}
					}
				}
			},
			oPropertyBag;

		oTestContext.getModel().setData(oTestMetadata2);
		oPropertyBag = getPropertyBagForCreateLayout(assert, oTestContext, "TestProperty1");

		return FormDelegate.createLayout(oPropertyBag).then(function(oResult) {
			assert.strictEqual(oResult.control._testInfo, "FormElementControl", "createLayout: FormElementControl");
			assert.strictEqual(oResult.valueHelp._testInfo, "ValueHelpControl", "createLayout: ValueHelpControl");
			done();
		});
	});

	QUnit.test("Delegate: createLayout: Field with currency value help", function(assert) {
		var oTestContext = this.oTestContext,
			done = assert.async(),
			oTestMetadata2 = {
				$Type: "testService1.TestEntityT1",
				"TestEntityT1": {
					$kind: "EntityType",
					TestProperty1: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.Label": "Label for TestProperty1",
						"@Org.OData.Measures.V1.ISOCurrency": {
							$Path: "TestPropertyCurrency1"
						}
					},
					TestPropertyCurrency1: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.Label": "Label for TestPropertyCurrency1",
						"@com.sap.vocabularies.Common.v1.ValueList": {
							_testInfo: "@ValueList"
						}
					}
				}
			},
			oPropertyBag;

		oTestContext.getModel().setData(oTestMetadata2);
		oPropertyBag = getPropertyBagForCreateLayout(assert, oTestContext, "TestProperty1");

		return FormDelegate.createLayout(oPropertyBag).then(function(oResult) {
			assert.strictEqual(oResult.control._testInfo, "FormElementControl", "createLayout: FormElementControl");
			assert.strictEqual(oResult.valueHelp._testInfo, "ValueHelpControl", "createLayout: ValueHelpControl");

			done();
		});
	});

	QUnit.test("Delegate: createLayout: Field without value help", function(assert) {
		var oTestContext = this.oTestContext,
			done = assert.async(),
			oTestMetadata2 = {
				$Type: "testService1.TestEntityT1",
				"TestEntityT1": {
					$kind: "EntityType",
					TestProperty2: {
						$kind: "Property",
						$Type: "Edm.String",
						"@com.sap.vocabularies.Common.v1.Label": "Label for TestProperty2"
					}
				}
			},
			oPropertyBag;

		oTestContext.getModel().setData(oTestMetadata2);
		oPropertyBag = getPropertyBagForCreateLayout(assert, oTestContext, "TestProperty2");

		return FormDelegate.createLayout(oPropertyBag).then(function(oResult) {
			assert.strictEqual(oResult.control._testInfo, "FormElementControl", "createLayout: FormElementControl");
			assert.strictEqual(oResult.valueHelp, undefined, "createLayout: no ValueHelpControl");

			done();
		});
	});
});
