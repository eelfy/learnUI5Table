/* global QUnit */
sap.ui.define(["sap/fe/core/helpers/SideEffectsUtil", "sap/base/util/deepEqual"], function(SideEffectsUtil, deepEqual) {
	"use strict";
	QUnit.module("Unit test for side effect in case of empty navigation string");
	QUnit.test("Unit test to check resolveAnnotationPathForForm for fomrs with navigation", function(assert) {
		var aPathExpression = [
				{
					$PropertyPath: "SAP__Messages"
				},
				{
					$PropertyPath: "ItemGeneralIncompletionStatus"
				},
				{
					$PropertyPath: "SalesOrderItemCategory"
				},
				{
					$PropertyPath: "ShippingType"
				}
			],
			output = [
				{
					$PropertyPath: "SAP__Messages"
				},
				{
					$PropertyPath: "ItemGeneralIncompletionStatus"
				},
				{
					$PropertyPath: "SalesOrderItemCategory"
				},
				{
					$PropertyPath: "ShippingType"
				},
				{
					$PropertyPath: "data_text"
				}
			],
			sBaseEntityType = "com.sap.gateway.srvd.c_salesordermanage_sd.v0001.SalesOrderItemType",
			oMetaModel = {
				getObject: function(sPath) {
					if (sPath.indexOf("ItemGeneralIncompletionStatus") > -1) {
						return { $Path: "data_text" };
					} else {
						return undefined;
					}
				}
			};
		var result = deepEqual(SideEffectsUtil.addTextProperties(aPathExpression, oMetaModel, sBaseEntityType), output);
		assert.equal(result, true, "Unit test for adding text properties");
	});

	QUnit.test("Unit test to check remove of binding parameter for Actions, where binding parameter is defined", function(assert) {
		var aPathExpression = [
				{
					$PropertyPath: "_it/SalesOrderType"
				}
			],
			output = [
				{
					$PropertyPath: "SalesOrderType"
				}
			];
		var bDeepEqual = deepEqual(SideEffectsUtil.removeBindingPaths(aPathExpression, "$PropertyPath", "_it", "SomeAction"), output);
		assert.equal(bDeepEqual, true, "Unit test removing binding parameter");
	});

	QUnit.test("Unit test to check remove of binding parameter for Actions, where binding parameter is not in PropertyPath", function(
		assert
	) {
		// This is not formally correct, but is allowed for compatibility reasons
		var aPathExpression = [
				{
					$PropertyPath: "SalesOrderType"
				}
			],
			output = [
				{
					$PropertyPath: "SalesOrderType"
				}
			];
		var bDeepEqual = deepEqual(SideEffectsUtil.removeBindingPaths(aPathExpression, "$PropertyPath", "_it", "SomeAction"), output);
		assert.equal(bDeepEqual, true, "Unit test removing binding parameter");
	});

	QUnit.test("Convert side-effect (old vocabulary)", function(assert) {
		var oSideEffect = {
			TargetProperties: [{ $PropertyPath: "a" }, { $PropertyPath: "b" }],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		var oExpectedResult = {
			TargetProperties: [{ $PropertyPath: "a" }, { $PropertyPath: "b" }],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		assert.deepEqual(SideEffectsUtil.convertSideEffect(oSideEffect), oExpectedResult);
	});

	QUnit.test("Convert side-effect (new vocabulary)", function(assert) {
		var oSideEffect = {
			TargetProperties: ["a", "b"],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		var oExpectedResult = {
			TargetProperties: [{ $PropertyPath: "a" }, { $PropertyPath: "b" }],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		assert.deepEqual(SideEffectsUtil.convertSideEffect(oSideEffect), oExpectedResult);
	});

	QUnit.test("Convert side-effect (new vocabulary, *)", function(assert) {
		var oSideEffect = {
			TargetProperties: ["*", "b"],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		var oExpectedResult = {
			TargetProperties: [{ $PropertyPath: "*" }, { $PropertyPath: "b" }],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		assert.deepEqual(SideEffectsUtil.convertSideEffect(oSideEffect), oExpectedResult);
	});

	QUnit.test("Convert side-effect (new vocabulary, path/*)", function(assert) {
		var oSideEffect = {
			TargetProperties: ["a/*", "b"],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		var oExpectedResult = {
			TargetProperties: [{ $PropertyPath: "a/*" }, { $PropertyPath: "b" }],
			TargetEntities: [{ $NavigationPropertyPath: "c" }],
			TriggerAction: "foo"
		};
		assert.deepEqual(SideEffectsUtil.convertSideEffect(oSideEffect), oExpectedResult);
	});

	QUnit.test("Convert side-effect (new vocabulary, path/*, no TargetEntities)", function(assert) {
		var oSideEffect = {
			TargetProperties: ["a/*", "b"]
		};
		var oExpectedResult = {
			TargetProperties: [{ $PropertyPath: "a/*" }, { $PropertyPath: "b" }],
			TargetEntities: []
		};
		assert.deepEqual(SideEffectsUtil.convertSideEffect(oSideEffect), oExpectedResult);
	});
});
