/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/base/Log",
	"sap/ui/model/ContextBinding",
	"sap/ui/test/TestUtils"
], function (Log, ContextBinding, TestUtils) {
	/*global QUnit*/
	"use strict";

	//*********************************************************************************************
	QUnit.module("sap.ui.model.ContextBinding", {
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
	QUnit.test("getInterface().getBoundContext()", function (assert) {
		var oContextBinding = new ContextBinding({/*oModel*/}, "/"),
			oInterface = oContextBinding.getInterface();

		this.mock(oContextBinding).expects("getBoundContext")
			.withExactArgs()
			.returns("boundContext");

		// code under test
		assert.strictEqual(oInterface.getBoundContext(), "boundContext");
	});
});