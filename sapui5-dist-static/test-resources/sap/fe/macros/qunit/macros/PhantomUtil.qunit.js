/* eslint-disable consistent-return */
/* global QUnit sinon */
sap.ui.define(["sap/base/Log", "sap/fe/macros/PhantomUtil"], function(Log, PhantomUtil) {
	"use strict";

	function MyContext(oContext) {
		this.oContext = oContext || {};
	}

	MyContext.prototype = {
		// simple getObject mock
		getObject: function(sProp) {
			var oContext = this.oContext;

			if (sProp) {
				// _empty is special for testing
				if (oContext._empty && oContext.hasOwnProperty(oContext._empty)) {
					oContext = oContext[oContext._empty];
				}
				// for path navigate in object hierarchy
				sProp.split("/").forEach(function(sProp) {
					oContext = oContext[sProp];
				});
			} else if (oContext._empty) {
				// _empty is used to get context, if sProp is not specified
				oContext = oContext._empty;
			}
			return oContext;
		},
		getPath: function() {
			return "MyPath";
		}
	};

	function MyNode(oNode) {
		var aAttributes = [];

		this.oNode = oNode || {};

		Object.keys(this.oNode).forEach(function(sKey) {
			aAttributes.push({
				name: sKey
			});
		});
		this.attributes = aAttributes;
	}

	MyNode.prototype = {
		hasAttribute: function(sKey) {
			return this.oNode.hasOwnProperty(sKey);
		},
		setAttribute: function(sKey, sValue) {
			this.oNode[sKey] = sValue;
		},
		testGetAttribute: function(sKey) {
			return this.oNode[sKey];
		}
	};

	function validateMacroSignature(oMetadata, oContexts, oNode, oProps) {
		var sError = "";

		try {
			PhantomUtil.register._validateMacroSignature("MyMacro", oMetadata, oContexts, oNode, oProps);
		} catch (e) {
			sError = String(e);
		}
		return sError;
	}

	QUnit.module("Unit Test for PhantomUtil", {
		beforeEach: function() {}
	});

	QUnit.test("Test with empty context and metadataContexts", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {}
			},
			oContexts = {},
			oNode = new MyNode();

		sError = validateMacroSignature(oMetadata, oContexts, oNode);
		assert.strictEqual(sError, "", "empty context");
	});

	QUnit.test("Test with metadataContext EntitySet as object", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					entitySet: {
						$kind: "EntitySet"
					}
				}
			},
			oContexts = {
				entitySet: new MyContext({
					$kind: "EntitySet"
				})
			},
			oContextsWithPath = {
				entitySet: new MyContext({
					$Path: {
						$kind: "EntitySet"
					}
				})
			};

		sError = validateMacroSignature(oMetadata, oContexts, new MyNode());
		assert.strictEqual(sError, "", "entitySet: $kind EntitySet");

		sError = validateMacroSignature(oMetadata, oContextsWithPath, new MyNode());
		assert.strictEqual(sError, "", "entitySet: $Path/$kind EntitySet");

		oMetadata.metadataContexts.entitySet.$kind = "NavigationProperty";
		sError = validateMacroSignature(oMetadata, oContexts, new MyNode());
		assert.strictEqual(
			sError,
			"Error: MyMacro: 'entitySet' must be '$kind' 'NavigationProperty' but is 'EntitySet': MyPath",
			"Test EntitySet with unexpected $kind NavigationProperty"
		);

		oMetadata.metadataContexts.entitySet.$kind = ["EntitySet", "NavigationProperty"];
		sError = validateMacroSignature(oMetadata, oContexts, new MyNode());
		assert.strictEqual(sError, "", "entitySet: $kind EntitySet or NavigationProperty");
	});

	QUnit.test("Test with metadataContext Property as string", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					property: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					}
				}
			},
			oContexts = {
				property: new MyContext({
					_empty: "SalesOrder",
					"SalesOrder": {
						$kind: "Property"
					}
				})
			},
			oContexts2 = {
				property: new MyContext({
					_empty: "Link2Map"
				})
			};

		sError = validateMacroSignature(oMetadata, oContexts, new MyNode());
		assert.strictEqual(sError, "", "entitySet: $kind Property via SalesOrder as string");

		sError = validateMacroSignature(oMetadata, oContexts2, new MyNode());
		assert.strictEqual(sError, "", "entitySet: No check for $kind Property as string: Link2Map");
	});

	QUnit.test("Test with metadataContext required property which is missing", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {
					property: {
						type: "sap.ui.model.Context",
						required: true
					}
				}
			},
			oContexts = {};

		sError = validateMacroSignature(oMetadata, oContexts, new MyNode());
		assert.strictEqual(
			sError,
			"Error: MyMacro: Required metadataContext 'property' is missing",
			"metadataContext: missing required property"
		);
	});

	QUnit.test("Test without checking metadataContexts", function(assert) {
		var sError,
			oMetadata = {
				metadataContexts: {}
			},
			oContexts = {
				uncheckedEntitySet: new MyContext()
			},
			oNode = new MyNode(),
			oLogStub = sinon.stub(Log, "warning").returns(true);

		sError = validateMacroSignature(oMetadata, oContexts, oNode);
		assert.strictEqual(oLogStub.calledOnce, true, "warning message logged"); // warning: "Unchecked parameter: MyMacro: uncheckedEntitySet"
		assert.strictEqual(sError, "", "uncheckedEntitySet");

		oLogStub.restore();
	});

	QUnit.test("Test other properties", function(assert) {
		var sError,
			oMetadata = {
				properties: {
					property1: {}
				}
			},
			oNode = new MyNode({
				property1: "value1"
			}),
			oNode2 = new MyNode();

		sError = validateMacroSignature(oMetadata, {}, oNode);
		assert.strictEqual(sError, "", "ok");

		oMetadata.properties.property1.required = true;
		sError = validateMacroSignature(oMetadata, {}, oNode2);
		assert.strictEqual(sError, "Error: MyMacro: Required property 'property1' is missing", "required property which is missing");
	});

	QUnit.test("Test with unchecked properties", function(assert) {
		var sError,
			oMetadata = {
				properties: {}
			},
			oNode = new MyNode({
				uncheckedProperty1: "value1"
			}),
			oLogStub = sinon.stub(Log, "warning").returns(true);

		sError = validateMacroSignature(oMetadata, {}, oNode);
		assert.strictEqual(oLogStub.calledOnce, true, "warning message logged"); // warning: "Unchecked parameter: MyMacro: uncheckedProperty1"
		assert.strictEqual(sError, "", "uncheckedProperty1");

		oLogStub.restore();
	});

	QUnit.test("Unit test with multiple contexts and properties", function(assert) {
		var sError,
			oContexts = {
				entitySet: new MyContext({
					$kind: "EntitySet",
					path: "/entitySet1"
				}),
				property: new MyContext({
					$kind: "Property",
					path: "/property1"
				}),
				requiredProperty: new MyContext({
					$kind: "Property",
					path: "/requiredProperty1",
					required: true
				}),
				propertyWithKindInPath: new MyContext({
					$Path: {
						$kind: "Property"
					},
					path: "/propertyWithKindInPath"
				})
			},
			oMetadata = {
				metadataContexts: {
					entitySet: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "EntitySet"
					},
					property: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					},
					requiredProperty: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					},
					propertyWithKindInPath: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					}
				},
				properties: {
					id: {
						type: "string"
					},
					idPrefix1: {
						type: "string",
						defaultValue: "VH"
					},
					displayHeader1: {
						type: "boolean",
						defaultValue: true
					},
					required1: {
						type: "string",
						required: true
					}
				}
			},
			oNode = new MyNode({
				displayHeader1: false,
				required1: ""
			});

		sError = validateMacroSignature(oMetadata, oContexts, oNode, {});
		assert.strictEqual(sError, "", "Test: ok");
	});
});
