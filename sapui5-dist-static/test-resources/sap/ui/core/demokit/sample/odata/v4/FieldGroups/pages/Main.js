/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"sap/ui/test/TestUtils"
], function (Opa5, EnterText, Press, TestUtils) {
	"use strict";
	var sViewName = "sap.ui.core.sample.odata.v4.FieldGroups.FieldGroups";

	Opa5.createPageObjects({
		onTheMainPage : {
			actions : {
				enterValue : function (sId, sValue) {
					return this.waitFor({
						actions : new EnterText({text : sValue, keepFocus : true}),
						controlType : "sap.m.Input",
						id : sId,
						viewName : sViewName
					});
				},
				resetRequestCount : function () {
					return this.waitFor({
						success : function () {
							TestUtils.resetRequestCount();
						},
						viewName : sViewName
					});
				},
				selectField : function (sId) {
					return this.waitFor({
						actions : new Press(),
						controlType : "sap.m.Input",
						id : sId,
						viewName : sViewName
					});
				}
			},
			assertions : {
				checkField : function (sId, sExpectedValue) {
					return this.waitFor({
						controlType : "sap.m.Input",
						id : sId,
						success : function (oInput) {
							Opa5.assert.strictEqual(oInput.getValue(), sExpectedValue,
								sId + "=" + sExpectedValue);
						},
						viewName : sViewName
					});
				},
				checkRequestCount : function (iRequestCount) {
					return this.waitFor({
						success : function () {
							Opa5.assert.strictEqual(TestUtils.getRequestCount(), iRequestCount,
								iRequestCount + " requests");
						},
						viewName : sViewName
					});
				}
			}
		}
	});
});
