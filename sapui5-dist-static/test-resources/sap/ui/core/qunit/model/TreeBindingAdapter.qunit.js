/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/base/Log",
	"sap/ui/model/TreeAutoExpandMode",
	"sap/ui/model/TreeBinding",
	"sap/ui/model/TreeBindingAdapter",
	"sap/ui/test/TestUtils"
], function (Log, TreeAutoExpandMode, TreeBinding, TreeBindingAdapter, TestUtils) {
	/*global QUnit */
	"use strict";

	//*********************************************************************************************
	QUnit.module("sap.ui.model.TreeBindingAdapter", {
		beforeEach : function () {
			this.oLogMock = this.mock(Log);
			this.oLogMock.expects("error").never();
			this.oLogMock.expects("warning").never();
		},

		afterEach : function (assert) {
			return TestUtils.awaitRendering();
		}
	});

	//*********************************************************************************************
[{
	mParameters : undefined,
	sAutoExpandMode : TreeAutoExpandMode.Sequential,
	bCollapseRecursive : true
}, {
	mParameters : {collapseRecursive : false},
	sAutoExpandMode : TreeAutoExpandMode.Sequential,
	bCollapseRecursive : false
}, {
	mParameters : {collapseRecursive : null},
	sAutoExpandMode : TreeAutoExpandMode.Sequential,
	bCollapseRecursive : false
}, {
	mParameters : {autoExpandMode : "~autoExpandMode", collapseRecursive : true},
	sAutoExpandMode : "~autoExpandMode",
	bCollapseRecursive : true
}, {
	mParameters : {collapseRecursive : "truthy"},
	sAutoExpandMode : TreeAutoExpandMode.Sequential,
	bCollapseRecursive : true
}].forEach(function (oFixture) {
	QUnit.test("initialization: applying on TreeBinding instance", function (assert) {
		var oBinding = new TreeBinding({/*oModel*/}, "/path", /*oContext*/undefined,
				/*aFilters*/undefined, oFixture.mParameters),
			aMethodNames = Object.keys(TreeBindingAdapter.prototype);

		aMethodNames.forEach(function (sMethodName) {
			oBinding[sMethodName] = function () {};
		});
		assert.strictEqual(oBinding._bIsAdapted, undefined);
		this.mock(TreeBindingAdapter.prototype).expects("_createTreeState").withExactArgs();
		this.mock(TreeBindingAdapter.prototype).expects("setAutoExpandMode")
			.withExactArgs(oFixture.sAutoExpandMode);

		// code under test
		TreeBindingAdapter.apply(oBinding);

		aMethodNames.forEach(function (sMethodName) {
			assert.strictEqual(oBinding[sMethodName], TreeBindingAdapter.prototype[sMethodName]);
		});
		assert.strictEqual(oBinding.bCollapseRecursive, oFixture.bCollapseRecursive);
		assert.strictEqual(oBinding._bIsAdapted, true);
		assert.strictEqual(oBinding._iPageSize, 0);
		if (!oFixture.mParameters) {
			assert.deepEqual(oBinding.mParameters, {});
		} else {
			assert.strictEqual(oBinding.mParameters, oFixture.mParameters);
		}
		assert.deepEqual(oBinding._aRowIndexMap, []);
		assert.strictEqual(oBinding._iThreshold, 0);
	});
});

	//*********************************************************************************************
	QUnit.test("initialization: skipped for non-TreeBinding", function (assert) {
		var oBinding = {},
			aMethodNames = Object.keys(TreeBindingAdapter.prototype);

		aMethodNames.forEach(function (sMethodName) {
			oBinding[sMethodName] = function () {};
		});

		// code under test
		TreeBindingAdapter.apply(oBinding);

		aMethodNames.forEach(function (sMethodName) {
			assert.notStrictEqual(oBinding[sMethodName], TreeBindingAdapter.prototype[sMethodName]);
		});
	});

	//*********************************************************************************************
	QUnit.test("initialization: skip if already applied", function (assert) {
		var oBinding = new TreeBinding({/*oModel*/}, "/path"),
			aMethodNames = Object.keys(TreeBindingAdapter.prototype);

		oBinding._bIsAdapted = true; // simulate already applied
		oBinding._iThreshold = "~_iThreshold";

		// code under test
		TreeBindingAdapter.apply(oBinding);

		// functions and members are not overwritten
		aMethodNames.forEach(function (sMethodName) {
			assert.notStrictEqual(oBinding[sMethodName], TreeBindingAdapter.prototype[sMethodName]);
		});
		assert.strictEqual(oBinding._iThreshold, "~_iThreshold");
	});

	//*********************************************************************************************
	QUnit.test("getContexts: delegates to _getContextsOrNodes", function (assert) {
		var oBinding = new TreeBinding({/*oModel*/}, "/path");

		TreeBindingAdapter.apply(oBinding);

		this.mock(oBinding).expects("_getContextsOrNodes")
			.withExactArgs(false, "~iStartIndex", "~iLength", "~iThreshold")
			.returns("~result");

		// code under test
		assert.strictEqual(oBinding.getContexts("~iStartIndex", "~iLength", "~iThreshold"),
			"~result");
	});

	//*********************************************************************************************
	QUnit.test("getNodes: delegates to _getContextsOrNodes", function (assert) {
		var oBinding = new TreeBinding({/*oModel*/}, "/path");

		TreeBindingAdapter.apply(oBinding);

		this.mock(oBinding).expects("_getContextsOrNodes")
			.withExactArgs(true, "~iStartIndex", "~iLength", "~iThreshold")
			.returns("~result");

		// code under test
		assert.strictEqual(oBinding.getNodes("~iStartIndex", "~iLength", "~iThreshold"),
			"~result");
	});

	//*********************************************************************************************
	QUnit.test("_getContextsOrNodes: unresolved binding", function (assert) {
		var oBinding = {
				isResolved : function () {}
			};

		this.mock(oBinding).expects("isResolved").withExactArgs().returns(false);

		// code under test - parameters are not relevant for this test
		assert.deepEqual(TreeBindingAdapter.prototype._getContextsOrNodes.call(oBinding), []);
	});
});