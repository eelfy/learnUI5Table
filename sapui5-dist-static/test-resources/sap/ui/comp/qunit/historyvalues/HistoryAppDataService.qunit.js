/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/historyvalues/HistoryAppDataService",
	"sap/ui/comp/historyvalues/Constants"
], function(HistoryAppDataService, constants) {
	"use strict";

	QUnit.module("sap.ui.comp.providers.HistoryAppDataService", {
		beforeEach: function () {
			this.mockUShellServices();
			this.oHistoryAppDataService = HistoryAppDataService.getInstance();
		},

		afterEach: function () {
			this.oHistoryAppDataService.destroy();
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
				oAppLifeCycleStub = {
					getCurrentApplication: function () {
						return {
							componentInstance: {
								getMetadata: function () {
									return {
										getManifest: function () {
											return { "sap.app": { id: sApplicationId } };
										}
									};
								}
							}
						};
					}
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
				oAppPersonalizerStub = {
					getPersData: function () {
						return Promise.resolve({
							field1: ["item11", "item12", "item13"],
							field2: ["item21", "item22", "item23"]
						});
					}
				},
				oGetServiceStub = this.stub();

			oGetServiceStub.withArgs("Personalization").returns(oPersonalizationStub);
			oGetServiceStub.withArgs("AppLifeCycle").returns(oAppLifeCycleStub);

			oPersonalizationStub.getPersonalizer.onFirstCall().returns(oGlobalPersonalizerStub);
			oPersonalizationStub.getPersonalizer.onSecondCall().returns(oAppPersonalizerStub);

			if (!(sap.ushell && sap.ushell.Container)) {
				sap.ushell = {
					Container: {
						getService: oGetServiceStub
					}
				};
			}
		},

		mockUShellServicesForDifferentApp: function () {
			var sApplicationId = "applicationID2",
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
				oAppLifeCycleStub = {
					getCurrentApplication: function () {
						return {
							componentInstance: {
								getMetadata: function () {
									return {
										getManifest: function () {
											return { "sap.app": { id: sApplicationId } };
										}
									};
								}
							}
						};
					}
				},
				oGlobalPersonalizerStub = {
					getPersData: function () {
						var oApps = {};
						oApps[constants.getHistoryPrefix() + sApplicationId] = "applicationContainerID2";
						return Promise.resolve({
							historyEnabled: true,
							apps: oApps
						});
					},
					setPersData: this.spy()
				},
				oAppPersonalizerStub = {
					getPersData: function () {
						return Promise.resolve({
							field1: ["item11", "item12", "item13"],
							field2: ["item21", "item22", "item23"]
						});
					}
				},
				oGetServiceStub = this.stub();

			oGetServiceStub.withArgs("Personalization").returns(oPersonalizationStub);
			oGetServiceStub.withArgs("AppLifeCycle").returns(oAppLifeCycleStub);

			oPersonalizationStub.getPersonalizer.onFirstCall().returns(oGlobalPersonalizerStub);
			oPersonalizationStub.getPersonalizer.onSecondCall().returns(oAppPersonalizerStub);


			sap.ushell = {
				Container: {
					getService: oGetServiceStub
				}
			};
		}
	});

	QUnit.test("getInstance should create new instance if the current application is changed", function (assert) {
		// Arrange - Simulate that the application is changed
		var sExpected = constants.getHistoryPrefix() + "applicationID2";
		this.mockUShellServicesForDifferentApp();
		var oDestroySpy = this.spy(this.oHistoryAppDataService, "destroy");

		// Act
		var oNewInstance = HistoryAppDataService.getInstance();

		// Assert
		assert.equal(oDestroySpy.callCount, 1, "the old instance should be destroyed");
		assert.equal(oNewInstance._sAppId, sExpected, "the new app id is used");

		// Cleanup
		oDestroySpy.restore();
	});

	QUnit.test("_initializeAppContainerId should get container id from global service data", function (assert) {
		// Arrange
		var sExpected = "appContainerId";
		var sAppId = "appId";
		this.oHistoryAppDataService._sAppId = sAppId;
		var oData = {};
		oData[sAppId] = sExpected;

		// Act
		var sResult = this.oHistoryAppDataService._initializeAppContainerId(oData);

		// Assert
		assert.equal(sResult, sExpected);
	});

	QUnit.test("_initializeAppContainerId should create container id if it is not in global service data", function (assert) {
		// Arrange
		var oCreateAndSaveContainerIdStub = this.stub(this.oHistoryAppDataService, "_createAndSaveContainerId");

		// Act
		this.oHistoryAppDataService._initializeAppContainerId({});

		// Assert
		assert.equal(oCreateAndSaveContainerIdStub.callCount, 1, "new container id should be created if is not in global service data");

		// Cleanup
		oCreateAndSaveContainerIdStub.restore();
	});

	QUnit.test("_initializeAppData should set the data from the service to _oData property", function (assert) {
		// Arrange
		var oExpectedData = { fieldName: [1, 2, 3] };
		var oGetPersonalizerStub = this.stub(this.oHistoryAppDataService, "_getPersonalizer").returns({
			getPersData: this.stub().returns({
				then: function (fnCallback) {
					return fnCallback(oExpectedData);
				}
			})
		});

		// Act
		this.oHistoryAppDataService._initializeAppData();

		assert.deepEqual(this.oHistoryAppDataService._oData, oExpectedData, "data from the service should be set to the _oData");

		// Cleanup
		oGetPersonalizerStub.restore();
	});

	QUnit.test("getFieldData should return the data for the field", function (assert) {
		// Arrange
		var oExpectedData = [1, 2, 3];
		this.oHistoryAppDataService._oData = { fieldName: oExpectedData };
		var oGetHistoryEnabledStub = this.stub(this.oHistoryAppDataService, "_getHistoryEnabled").returns({
			then: function (fnCallback) {
				return fnCallback(true);
			}
		});
		var oIsDataReadyStub = this.stub(this.oHistoryAppDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback(oExpectedData.fieldName);
			}
		});

		// Act
		var oResult = this.oHistoryAppDataService.getFieldData("fieldName");

		// Assert
		assert.deepEqual(oResult, oExpectedData, "data for the field should be get from the service");

		// Cleanup
		oGetHistoryEnabledStub.restore();
		oIsDataReadyStub.restore();
	});

	QUnit.test("getFieldData should return the data for the field for different languages", function (assert) {
		// Arrange
		var oExpectedData = [1, 2, 3];
		var sLanguage = "bg";
		this.oHistoryAppDataService._oData[constants.getHistoryPrefix() + sLanguage] = { fieldName: oExpectedData };
		var oGetHistoryEnabledStub = this.stub(this.oHistoryAppDataService, "_getHistoryEnabled").returns({
			then: function (fnCallback) {
				return fnCallback(true);
			}
		});
		var oIsDataReadyStub = this.stub(this.oHistoryAppDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback(oExpectedData.fieldName);
			}
		});

		var oGetLanguageStub = this.stub(this.oHistoryAppDataService, "_getLanguage").returns(sLanguage);

		// Act
		var oResult = this.oHistoryAppDataService.getFieldData("fieldName");

		// Assert
		assert.deepEqual(oResult, oExpectedData, "data for the field should be get from the service");

		// Cleanup
		oGetHistoryEnabledStub.restore();
		oIsDataReadyStub.restore();
		oGetLanguageStub.restore();
	});

	QUnit.test("setFieldData should set the data and call the service", function (assert) {
		// Arrange
		var aFieldData = [1, 2, 3];
		var sFieldName = "fieldName";
		var oExpected = { fieldName: aFieldData };
		var oSetPersDataSpy = this.spy();
		var oGetPersonalizerStub = this.stub(this.oHistoryAppDataService, "_getPersonalizer").returns({
			setPersData: oSetPersDataSpy
		});
		var oGetHistoryEnabledStub = this.stub(this.oHistoryAppDataService, "_getHistoryEnabled").returns({
			then: function (fnCallback) {
				return fnCallback(true);
			}
		});
		var oIsDataReadyStub = this.stub(this.oHistoryAppDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});

		// Act
		this.oHistoryAppDataService.setFieldData(sFieldName, aFieldData);

		// Assert
		assert.deepEqual(this.oHistoryAppDataService._oData, oExpected, "data should be set to the local data object");
		assert.equal(oSetPersDataSpy.callCount, 1, "setPersData should be called once");
		assert.deepEqual(oSetPersDataSpy.getCall(0).args[0], oExpected, "setPersData should be called with the data object");

		// Cleanup
		oGetHistoryEnabledStub.restore();
		oIsDataReadyStub.restore();
		oGetPersonalizerStub.restore();
	});

	QUnit.test("setFieldData should set the data and call the service for different languages", function (assert) {
		// Arrange
		var sLanguage = "bg";
		var aFieldData = [1, 2, 3];
		var sFieldName = "fieldName";
		var oExpected = { fieldName: aFieldData };
		var oSetPersDataSpy = this.spy();
		var oGetPersonalizerStub = this.stub(this.oHistoryAppDataService, "_getPersonalizer").returns({
			setPersData: oSetPersDataSpy
		});
		var oGetHistoryEnabledStub = this.stub(this.oHistoryAppDataService, "_getHistoryEnabled").returns({
			then: function (fnCallback) {
				return fnCallback(true);
			}
		});
		var oIsDataReadyStub = this.stub(this.oHistoryAppDataService, "_isDataReady").returns({
			then: function (fnCallback) {
				return fnCallback();
			}
		});
		var oGetLanguageStub = this.stub(this.oHistoryAppDataService, "_getLanguage").returns(sLanguage);

		// Act
		this.oHistoryAppDataService.setFieldData(sFieldName, aFieldData);

		// Assert
		assert.deepEqual(this.oHistoryAppDataService._oData[constants.getHistoryPrefix() + sLanguage], oExpected, "data should be set to the local data object");
		assert.equal(oSetPersDataSpy.callCount, 1, "setPersData should be called once");

		// Cleanup
		oGetHistoryEnabledStub.restore();
		oIsDataReadyStub.restore();
		oGetPersonalizerStub.restore();
		oGetLanguageStub.restore();
	});

	QUnit.test("_isDefaultLanguage should return correct value", function (assert) {
		// Arrange
		assert.ok(this.oHistoryAppDataService._isDefaultLanguage("en"), "english is the default language");
		assert.notOk(this.oHistoryAppDataService._isDefaultLanguage("bg"), "bulgarian is not the default language");

	});

	QUnit.start();

});
