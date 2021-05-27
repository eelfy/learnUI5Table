/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/historyvalues/HistoryGlobalDataService",
	"sap/ui/comp/historyvalues/Constants"
], function(HistoryGlobalDataService, constants) {
	"use strict";

	QUnit.module("sap.ui.comp.providers.HistoryGlobalDataService", {
		beforeEach: function () {
			this.mockUShellServices();
			this.oHistoryGlobalDataService = HistoryGlobalDataService.getInstance();
		},

		afterEach: function () {
			this.oHistoryGlobalDataService.destroy();
		},

		mockUShellServices: function () {
			var sApplicationId = "applicationID",
				oPersonalizationStub = {
					constants: {
						keyCategory:  {
							FIXED_KEY: "FIXED_KEY",
							GENERATED_KEY: "GENERATED_KEY"
						},
						writeFrequency: {
							HIGH: "HIGH",
							LOW: "LOW"
						}
					},
					getPersonalizer: this.stub()
				},
				oGlobalPersonalizerStub = {
					getPersData: function () {
						var oApps = {};
						oApps[constants.getHistoryPrefix() + sApplicationId] = "applicationContainerID";
						return Promise.resolve({
							historyEnabled: true,
							apps: oApps
						});
					},
					setPersData: this.spy()
				},
				oGetServiceStub = this.stub();

			oGetServiceStub.withArgs("Personalization").returns(oPersonalizationStub);

			oPersonalizationStub.getPersonalizer.onFirstCall().returns(oGlobalPersonalizerStub);

			if (!(sap.ushell && sap.ushell.Container)) {
				sap.ushell = {
					Container: {
						getService: oGetServiceStub
					}
				};
			}
		}
	});

	QUnit.test("_initializeHistoryData should get container data and set it to _oData", function (assert) {
		// Arrange
		var oExpected = {
			historyEnabled: true,
			apps: ["appContainerId1", "appContainerId2"]
		};

		// Act
		this.oHistoryGlobalDataService._initializeHistoryData(oExpected);

		// Assert
		assert.deepEqual(this.oHistoryGlobalDataService._oData, oExpected);
	});

	QUnit.test("getHistoryEnabled should return historyEnabled", function (assert) {
		// Arrange
		var bExpected = true;
		this.oHistoryGlobalDataService._oData = { historyEnabled: bExpected, apps: [] };
		var oIsDataReadyStub = this.stub(this.oHistoryGlobalDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});

		// Act
		var bResult = this.oHistoryGlobalDataService.getHistoryEnabled();

		// Assert
		assert.equal(bResult, bExpected, "data for the historyEnabled should be get from the service");

		// Cleanup
		oIsDataReadyStub.restore();
	});

	QUnit.test("setHistoryEnabled should set the data and call the service", function (assert) {
		// Arrange
		var oExpected = { historyEnabled: false };
		var oPromiseStub = { then: function () {} };
		var oSetPersDataSpy = this.stub().returns(oPromiseStub);
		var oGetPersonalizerStub = this.stub(this.oHistoryGlobalDataService, "_getPersonalizer").returns({
			setPersData: oSetPersDataSpy
		});
		var oIsDataReadyStub = this.stub(this.oHistoryGlobalDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});

		// Act
		var oResultPromise = this.oHistoryGlobalDataService.setHistoryEnabled(false);

		// Assert
		assert.deepEqual(oResultPromise, oPromiseStub, "setHistoryEnabled should return promise");
		assert.deepEqual(this.oHistoryGlobalDataService._oData, oExpected, "data should be set to the local data object");
		assert.equal(oSetPersDataSpy.callCount, 1, "setPersData should be called once");
		assert.deepEqual(oSetPersDataSpy.getCall(0).args[0], oExpected, "setPersData should be called with the data object");

		// Cleanup
		oIsDataReadyStub.restore();
		oGetPersonalizerStub.restore();
	});

	QUnit.test("getApps should return historyEnabled", function (assert) {
		// Arrange
		var oExpectedApps = { appId: "continerId" };
		this.oHistoryGlobalDataService._oData = { historyEnabled: true, apps: oExpectedApps };
		var oIsDataReadyStub = this.stub(this.oHistoryGlobalDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});

		// Act
		var aResult = this.oHistoryGlobalDataService.getApps();

		// Assert
		assert.deepEqual(aResult, oExpectedApps, "data for the apps should be get from the service");

		// Cleanup
		oIsDataReadyStub.restore();
	});

	QUnit.test("setApps should set the data and call the service", function (assert) {
		// Arrange
		var aApps = [{ appId: "containerID" }];
		var oExpected = { apps: aApps };
		var oPromiseStub = { then: function () {} };
		var oSetPersDataSpy = this.stub().returns(oPromiseStub);
		var oGetPersonalizerStub = this.stub(this.oHistoryGlobalDataService, "_getPersonalizer").returns({
			setPersData: oSetPersDataSpy
		});
		var oIsDataReadyStub = this.stub(this.oHistoryGlobalDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});

		// Act
		var oPromiseResult = this.oHistoryGlobalDataService.setApps(aApps);

		// Assert
		assert.deepEqual(oPromiseResult, oPromiseStub, "setApps should return a promise");
		assert.deepEqual(this.oHistoryGlobalDataService._oData, oExpected, "data should be set to the local data object");
		assert.equal(oSetPersDataSpy.callCount, 1, "setPersData should be called once");
		assert.deepEqual(oSetPersDataSpy.getCall(0).args[0], oExpected, "setPersData should be called with the data object");

		// Cleanup
		oIsDataReadyStub.restore();
		oGetPersonalizerStub.restore();
	});

	QUnit.start();

});
