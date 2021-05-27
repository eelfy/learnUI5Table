/*global QUnit*/
sap.ui.define(["sap/feedback/ui/flpplugin/data/PushContextData",
	"sap/feedback/ui/flpplugin/utils/Constants",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(PushContextData, Constants, sinon, sinonQunit) {
	"use strict";

	QUnit.module("Data-Push context data unit tests", {

		beforeEach: function() {

		},

		afterEach: function() {

		}
	});

	QUnit.module("Push Context Data init procedure");

	QUnit.test("ctor Backend push", function(assert) {
		// arrangement
		var sGivenAppSourceId = "SALESORDER";
		var sGivenAppTrigger = "ON_CREATE";
		var iGivenSourceType = 1;

		// action
		var oPushContextData = new PushContextData(sGivenAppSourceId, sGivenAppTrigger, iGivenSourceType);

		// assertions
		assert.equal(oPushContextData.getSourceAppId(), sGivenAppSourceId);
		assert.equal(oPushContextData.getSourceAppTrigger(), sGivenAppTrigger);
		assert.equal(oPushContextData.getSourceType(), iGivenSourceType);
		assert.equal(oPushContextData.getIsBackendPushedSurvey(), true);
	});

	QUnit.test("ctor User in-App push", function(assert) {
		// arrangement
		var sGivenAppSourceId = "SITUATIONPAGE";
		var sGivenAppTrigger = "SolutionProposals";
		var iGivenSourceType = 2;

		// action
		var oPushContextData = new PushContextData(sGivenAppSourceId, sGivenAppTrigger, iGivenSourceType);

		// assertions
		assert.equal(oPushContextData.getSourceAppId(), sGivenAppSourceId);
		assert.equal(oPushContextData.getSourceAppTrigger(), sGivenAppTrigger);
		assert.equal(oPushContextData.getSourceType(), iGivenSourceType);
		assert.equal(oPushContextData.getIsBackendPushedSurvey(), false);
	});
});