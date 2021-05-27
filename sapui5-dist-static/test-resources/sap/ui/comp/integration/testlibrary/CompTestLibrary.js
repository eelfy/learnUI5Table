/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/comp/integration/testlibrary/TestUtils",
	"sap/ui/comp/integration/testlibrary/navpopover/SmartLink",
	"sap/ui/comp/integration/testlibrary/smartfield/SmartField",
	"sap/ui/comp/integration/testlibrary/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/integration/testlibrary/valuehelpdialog/ValueHelpDialog",
	"sap/ui/comp/integration/testlibrary/tokenizer/Tokenizer"
], function(Opa5, TestUtils) {
	"use strict";

	Opa5.extendConfig({
		// Define functionality that can be used on the global Given, When, Then constructs
		arrangements: {
			iStartMyApp: function (sAppUrl) {
				return this.iStartMyAppInAFrame(sAppUrl);
			},
			iEnsureMyAppIsRunning: function (sUrl) {
				var sAppUrl = sUrl
					? sUrl
					: Opa5.getTestLibConfig(TestUtils.COMP_TEST_LIBRARY_NAME).appUrl; // Gets the url from test library config settings

				if (this._myApplicationIsRunning && sAppUrl !== this._myAppUrl){
					this.iStopMyApp();
				}

				if (!this._myApplicationIsRunning) {
					this.iStartMyApp(sAppUrl);
					this._myApplicationIsRunning = true;
					this._myAppUrl = sAppUrl;
				}
			},
			iStopMyApp: function(){
				this._myApplicationIsRunning = false;
				this._myAppUrl = null;
				this.iTeardownMyApp();
			}
		},
		actions: {},
		assertions: {
			/**
			 * Checks if the test app was started
			 */
			iCheckMyAppIsRunning: function () {
				Opa5.assert.strictEqual(
					this._myApplicationIsRunning,
					true,
					"The application should be running"
				);
			}
		}
	});
});
