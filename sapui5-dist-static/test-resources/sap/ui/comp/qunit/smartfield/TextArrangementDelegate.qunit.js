 /* globals QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfield/TextArrangementDelegate",
	"sap/ui/comp/smartfield/SmartField"
], function(
	compLibrary,
	TextArrangementDelegate,
	SmartField
) {
	"use strict";
	var DisplayBehaviour = compLibrary.smartfield.DisplayBehaviour;

	QUnit.module("Text arrangement annotation utilities");

	QUnit.test("calling .getPaths() should return the corrects paths (test case 1)", function(assert) {

		// arrange
		var oMetadata = {
			annotations: {
				text: {
					entityType: {
						key: {
							propertyRef: [{
								name: "IDNavigationProperty"
							}]
						}
					},
					property: {
						typePath: "DescriptionNavigationProperty"
					},
					entitySet: {
						name: "Category"
					}
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.NavigationProperty, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionNavigationProperty");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "Category");
	});

	QUnit.test("calling .getPaths() should not throw error if NavigationProperty metadata is missing", function(assert) {

		// arrange
		var oMetadata = {annotations: {}};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.NavigationProperty, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");
	});


	QUnit.test("calling .getPaths() method should return the corrects paths (test case 2)", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListAnnotation: {
					keyField: "IDValueList",
					descriptionField: "DescriptionValueList"
				},
				valueListEntitySet: {
					name: "VL_Suppliers"
				}
			}
		};

		// act
		var mTextArrangementPaths = TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);

		// assert
		assert.strictEqual(mTextArrangementPaths.keyField, "IDValueList");
		assert.strictEqual(mTextArrangementPaths.descriptionField, "DescriptionValueList");
		assert.strictEqual(mTextArrangementPaths.entitySetName, "VL_Suppliers");
	});

	QUnit.test("calling .getPaths() method should not throw error if ValueList annotation is missing", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListEntitySet: {
					name: "VL_Suppliers"
				}
			}
		};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");
	});

	QUnit.test("calling .getPaths() method should not throw error if ValueList entity set is missing", function(assert) {

		// arrange
		var oMetadata = {
			property: {
				valueListAnnotation: {
					keyField: "IDValueList",
					descriptionField: "DescriptionValueList"
				}
			}
		};

		// act
		try {
			TextArrangementDelegate.getPaths(compLibrary.smartfield.TextInEditModeSource.ValueList, oMetadata);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true, "No exception thrown");

	});

	QUnit.test("onFetchIDAndDescriptionCollectionSuccess called after SmartField is destroyed", function (assert) {
		// Arrange
		assert.expect(1); // We expect only 1 assertion

		// Act -> call the method directly on the prototype simulating the scenario when the callback is called after
		// the SmartField control is destroyed should not throw an exception.
		try {
			TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionSuccess();
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method directly should not throw an exception");
		}

		// If no exception is raised the test succeeds
		assert.ok(true);
	});

	QUnit.test("bindPropertyForValueList called with no binding type should not throw an exception", function (assert) {
		// Arrange
		var oModel = new sap.ui.model.json.JSONModel({value:"test"}),
			oDelegate = new TextArrangementDelegate({
				_oParent: {
					getTextInEditModeSource: function () {
						return "ValueList";
					},
					_getComputedTextInEditModeSource: function () {
						return "ValueList";
					}
				},
				_getTextArrangementType: function () {}
			}),
			oInput = new sap.m.Input({value: "{value}"}).setModel(oModel);

		// Empty these two methods - we are interested only in the code contained in the main method
		oInput.bindProperty = function () {}; // Does nothing
		oDelegate.getBindingInfo = function () {}; // Does nothing

		assert.expect(1); // We expect only 1 assertion

		try {
			// Call method
			oDelegate.bindPropertyForValueList("value", oInput);
		} catch (e) {
			// If we are here - we have failed
			assert.ok(false, "calling the method should not throw an exception.");
		}

		// If no exception is raised the test succeeds
		assert.ok(true);
	});

	QUnit.test("getBindingInfo with ValueListNoValidation returns object with oMetadata.path not parts", function (assert) {
		// Arrange
		var oModel = new sap.ui.model.json.JSONModel({value:"test"}),
			oDelegate = new TextArrangementDelegate({
				_oParent: {
					getTextInEditModeSource: function () {
						return "ValueListNoValidation";
					},
					_getComputedTextInEditModeSource: function () {
						return "ValueListNoValidation";
					},
					getBinding: function () {
						return {
							vOriginalValue : "value",
							getValue: function () {
								return "value";
							}
						};
					}
				},
				_oMetaData: {
						property: {
							valueListKeyProperty: {
								"description": "sTXT",
								"displayBehaviour": "idAndDescription",
								"name": "sID",
								"nullable": "false"
							}
						}
					},
				_oHelper: {
					getAbsolutePropertyPathToValueListEntity: function() {
						return "/test/sTXT";
					}
				}
			}),
			oInput = new sap.m.Input({value: "{value}"}).setModel(oModel),
			oTextArragementFormatOptions = {
				textArrangement: "idAndDescription"
			},
			oTextArragementSettings = {
				keyField: "ID",
				descriptionField: "Text"
			},
			oType = new sap.ui.comp.smartfield.type.TextArrangementString(oTextArragementFormatOptions, null, oTextArragementSettings),
			result = {},
			oSettings = {
				type: oType,
				skipValidation: true,
				valueListNoValidation: true
			};

		sinon.stub(oInput, "bindProperty").returns(undefined);

		try {
			result = oDelegate.getBindingInfo(oSettings, true);
		} catch (e) {

			assert.ok(false, "Calling the method should not throw an exception.");
		}

		// If no exception is raised the test succeeds
		assert.ok(result.hasOwnProperty("path") === true, "When textInEditSourceMode is ValueListNoValidation result object should contain path");
		assert.ok(result.hasOwnProperty("parts") === false, "When textInEditSourceMode is ValueListNoValidation result object shouldn't  contain parts");
	});

	QUnit.test("No request for description should be sent if TextArrangementType/TextSeparate", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oTextArrangement = DisplayBehaviour.idOnly,
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations :{
							text:"test"
						}
					};
				},
				_getDisplayBehaviourConfiguration: function () {
					return oTextArrangement;
				}
			},
			oDelegate = new TextArrangementDelegate({
				getMetaData: function () {
						return {
							annotations: {
								text: "test"
							}
						};
					},
				_getDisplayBehaviourConfiguration: function(){
					return oTextArrangement;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			});

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {};
			},
			getBinding: function () {
				return {
					vOriginalValue: "test1",
					getValue: function () {
						return "test";
					}
				};
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired();

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 0);

		// Arrange
		oTextArrangement = DisplayBehaviour.descriptionAndId;

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired();

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 1);

		// Clean
		oTextArrangementDelegateStub.restore();
	});


	QUnit.test("No request for description when has Text annotation with not changed values", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations :{
							text:"test"
						}
					};
				},
				_getDisplayBehaviourConfiguration: function () {
					return DisplayBehaviour.descriptionAndId;
				}
			},
			oDelegate = new TextArrangementDelegate({
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			});

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {};
			},
			getBinding: function () {
				return {
					vOriginalValue: "test",
					getValue: function () {
						return "test";
					}
				};
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired();

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 0);

		// Clean
		oTextArrangementDelegateStub.restore();
	});

	QUnit.test("Has request for description when has Text annotation with changed values", function (assert) {
		// Arrange
		var oTextArrangementDelegateStub,
			oControlFactory = {
				getMetaData: function () {
					return {
						annotations :{
							text:"test"
						}
					};
				},
				_getDisplayBehaviourConfiguration: function () {
					return DisplayBehaviour.descriptionAndId;
				}
			},
			oDelegate = new TextArrangementDelegate({
				getMetaData: function () {
					return {
						annotations: {
							text: {
								path: "test"
							}
						}
					};
				},
				_getDisplayBehaviourConfiguration: function(){
					return DisplayBehaviour.descriptionAndId;
				},
				fetchIDAndDescriptionCollection: function () {
				},
				onFetchIDAndDescriptionCollectionSuccess: function () {
				}
			});

		sinon.stub(oDelegate, 'oSmartField').value({
			_getComputedTextInEditModeSource: function () {
				return "ValueListNoValidation";
			},
			getControlFactory: function () {
				return oControlFactory;
			},
			getModel: function () {
				return {};
			},
			getBinding: function () {
				return {
					vOriginalValue: "test",
					getValue: function () {
						return "test1";
					}
				};
			}
		});

		oTextArrangementDelegateStub = sinon.stub(oDelegate, "fetchIDAndDescriptionCollection");

		// Action
		oDelegate.fetchIDAndDescriptionCollectionIfRequired();

		// Assertion
		assert.strictEqual(oTextArrangementDelegateStub.callCount, 1);

		// Clean
		oTextArrangementDelegateStub.restore();
	});

	QUnit.start();
});
