// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Config",
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device",
    "sap/base/Log",
    "sap/ushell/services/DarkModeSupport",
    "sap/ui/core/message/Message",
    "sap/ushell/components/shell/Settings/appearance/Appearance.controller"
], function (Component, Controller, JSONModel, jQuery, Config, themeParameters, Device, Log, DarkModeSupport, Message) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("Appearance.controller", {
        beforeEach: function (assert) {
            var done = assert.async();

            Device.system.phone = false;

            this.fnGetThemeParameterStub = sinon.stub(themeParameters, "get");

            this.oTestUser = {
                getTheme: sinon.stub(),
                getContentDensity: sinon.stub(),
                isSetThemePermitted: sinon.stub,
                resetChangedProperty: sinon.spy()
            };

            this.oUserInfoService = {
                updateUserPreferences: sinon.stub()
            };

            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oUserInfoService),
                getUser: sinon.stub().returns(this.oTestUser)
            };

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                getViewData: sinon.stub(),
                byId: sinon.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                sinon.stub(this.oController, "getView").returns(this.oView);
                done();
            }.bind(this));

        },
        afterEach: function () {
            this.oController.destroy();
            delete sap.ushell.Container;
            Config._reset();
            this.fnGetThemeParameterStub.restore();
        }
    });

    QUnit.test("onInit", function (assert) {
        // Arrange
        var bSetTheme = true,
            bSizeBehaviorConfigurable = true,
            sSizeBehavior = "Small";

        Config.emit("/core/shell/model/setTheme", bSetTheme);
        Config.emit("/core/shell/model/contentDensity", false);
        Config.emit("/core/home/sizeBehaviorConfigurable", bSizeBehaviorConfigurable);
        Config.emit("/core/home/sizeBehavior", sSizeBehavior);
        Config.emit("/core/darkMode/enabled", false);
        this.oTestUser.getContentDensity.returns("cozy");
        this.oTestUser.getTheme.returns("sap_fiori_3");
        this.oTestUser.isSetThemePermitted.returns(false);
        this.fnGetThemeParameterStub.returns("test");
        this.oView.getViewData.returns({
            themeList: []
        });
        var oExpectedConfigModel = {
            themeConfigurable: bSetTheme,
            sizeBehaviorConfigurable: bSizeBehaviorConfigurable,
            tileSize: 0,
            contentDensityConfigurable: false,
            isCozyContentMode: true,
            sapUiContentIconColor: "test",
            textAlign: "Right"
        };
        var oExpectedDarkModeModel = {
            enabled: false,
            detectionSupported: false,
            detectionEnabled: true,
            isDarkThemeApplied: false,
            supportedThemes: {}
        };
        this.oView.getModel.withArgs("darkMode").returns({
            getData: sinon.stub.returns(oExpectedDarkModeModel)
        });

        // Act
        this.oController.onInit();
        // Assert
        assert.deepEqual(this.oController.oPersonalizers, {}, "The correct value of oPersonalizers has been assigned.");
        assert.equal(this.oView.setModel.callCount, 4, "4 models should be set");
        assert.deepEqual(this.oView.setModel.getCall(0).args[1], "i18n", "i18n model was set");
        var oConfigModel = this.oView.setModel.getCall(1);
        assert.deepEqual(oConfigModel.args[0].getData(), oExpectedConfigModel, "The correct config model is set");
        assert.equal(oConfigModel.args[1], "config", "The correct name of the second setModel");
        var oDarkModeModel = this.oView.setModel.getCall(2);
        assert.deepEqual(oDarkModeModel.args[0].getData(), oExpectedDarkModeModel, "The correct dark model is set");
        assert.equal(oDarkModeModel.args[1], "darkMode", "The correct name of darkMode model");
        var oThemeOptioneModel = this.oView.setModel.getCall(3);
        assert.deepEqual(oThemeOptioneModel.args[0].getData(), {options: []}, "The correct options are set");
    });

    QUnit.test("_getThemeListData: theme sorted", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: false,
                supportedThemes: {}
            });
        this.oController.oUser = {
            isSetThemePermitted: sinon.stub().returns(true)
        };

        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        this.oController._oDarkModeModel = oDarkModeModel;

        var aThemeListFromServer = [
            {id: "cola", name: "Cola Theme"},
            {id: "sap_fiori_3_dark", name: "SAP Quartz Dark"}
        ];
        // Act
        var aThemeList = this.oController._getThemeListData(aThemeListFromServer, "sap_fiori_3_dark");

        // Assert
        var aExpectedList = [
            {
                id: "cola",
                name: "Cola Theme",
                isVisible: true,
                isSelected: false,
                isSapTheme: false
            },
            {
                id: "sap_fiori_3_dark",
                name: "SAP Quartz Dark",
                isVisible: true,
                isSelected: true,
                isSapTheme: true
            }
        ];
        assert.deepEqual(aThemeList, aExpectedList, "theme sorted with correct properties");
    });

    QUnit.module("onCancel", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            this.oTestUser = {
                getTheme: sinon.stub(),
                getContentDensity: sinon.stub()
            };

            this.oView = {
                getModel: sinon.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.oUser = this.oTestUser;
                sinon.stub(this.oController, "getView").returns(this.oView);
                fnDone();
            }.bind(this));

        },
        afterEach: function () {
            this.oController.destroy();
            Config._reset();
        }
    });

    QUnit.test("reset the model", function (assert) {
        // Arrange
        Config.emit("/core/home/sizeBehavior", "Small");
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: true,
            isCozyContentMode: false,
            sizeBehaviorConfigurable: true,
            tileSize: 1
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        var oThemeModel = new JSONModel({
            options: [
                {id: "sap_fiori", isSelected: false},
                {id: "sap_belize", isSelected: true}
            ]
        });
        this.oView.getModel.returns(oThemeModel);
        this.oTestUser.getTheme.returns("sap_fiori");
        this.oTestUser.getContentDensity.returns("cozy");

        // Act
        this.oController.onCancel();

        // Assert
        var oExpectedConfigData = {
            themeConfigurable: true,
            contentDensityConfigurable: true,
            isCozyContentMode: true,
            sizeBehaviorConfigurable: true,
            tileSize: 0
        };
        assert.deepEqual(oConfigModel.getData(), oExpectedConfigData, "Config model was reset");
        var oExpectedThemeData = { options: [
                {id: "sap_fiori", isSelected: true},
                {id: "sap_belize", isSelected: false}
        ]};
        assert.deepEqual(oThemeModel.getData(), oExpectedThemeData, "Theme model was reset");
    });

    QUnit.module("onSave", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            this.oTestUser = {
                getTheme: sinon.stub(),
                setTheme: sinon.spy(),
                getContentDensity: sinon.stub(),
                setContentDensity: sinon.spy(),
                resetChangedProperty: sinon.spy()
            };

            this.oUserInfoService = {
                updateUserPreferences: sinon.stub()
            };

            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.oUser = this.oTestUser;
                this.oController.userInfoService = this.oUserInfoService;
                sinon.stub(this.oController, "getView").returns(this.oView);
                fnDone();
            }.bind(this));

        },
        afterEach: function () {
            this.oController.destroy();
            Config._reset();
        }
    });

    QUnit.test("resolve promise when not possible to configure", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oConfigModel = new JSONModel({
            themeConfigurable: false,
            contentDensityConfigurable: false,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveThemes = sinon.spy();
        this.oController.onSaveContentDensity = sinon.spy();
        this.oController.onSaveTileSize = sinon.spy();

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.ok(true, "onSave should be resolved");
            assert.ok(this.oController.onSaveThemes.notCalled, "onSaveThemes should not be called");
            assert.ok(this.oController.onSaveContentDensity.notCalled, "onSaveContentDensity should not be called");
            assert.ok(this.oController.onSaveTileSize.notCalled, "onSaveTileSize should not be called");
        }.bind(this), function () {
            assert.ok(false, "onSave should be resolved");
        }).then(fnDone);
    });

    QUnit.test("call save method of each config", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: true,
            sizeBehaviorConfigurable: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveThemes = sinon.stub().returns(Promise.resolve());
        this.oController.onSaveContentDensity = sinon.stub().returns(Promise.resolve());
        this.oController.onSaveTileSize = sinon.stub().returns(Promise.resolve());

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.ok(true, "onSave should be resolved");
            assert.ok(this.oController.onSaveThemes.calledOnce, "onSaveThemes should be called");
            assert.ok(this.oController.onSaveContentDensity.calledOnce, "onSaveContentDensity not be called");
            assert.ok(this.oController.onSaveTileSize.calledOnce, "onSaveTileSize not be called");
        }.bind(this), function () {
            assert.ok(false, "onSave should be resolved");
        }).then(fnDone);
    });

    QUnit.test("reject promise if there is error", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: true,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveThemes = sinon.stub().returns(Promise.resolve(new Message({
            message: "testMessage"
        })));
        this.oController.onSaveContentDensity = sinon.stub().returns(Promise.resolve());

        // Act
        this.oController.onSave().then(function () {
            // Assert
            assert.ok(false, "onSave should be rejected");
        }, function () {
            assert.ok(true, "onSave should be rejected");
        }).then(fnDone);
    });

    QUnit.module("Dark mode", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            Config.emit("/core/darkMode/enabled", true);

            this.aThemeList = [
                {id: "cocacola2016", name: "Coca Cola 2016"},
                {id: "sap_belize", name: "SAP Belize"},
                {id: "sap_belize_plus", name: "SAP Belize Deep"},
                {id: "sap_fiori_3_dark", name: "SAP Quartz Dark"},
                {id: "sap_fiori_3", name: "SAP Quartz Light"}
            ];

            this.oDarkModeSupport = {
                canAutomaticallyToggleDarkMode: sinon.stub().returns(true),
                attachModeChanged: sinon.stub(),
                enableDarkModeBasedOnSystem: sinon.spy(),
                disableDarkModeBasedOnSystem: sinon.spy()
            };

            this.fnGetService = sinon.stub();
            this.fnGetService.withArgs("DarkModeSupport").returns(this.oDarkModeSupport);

            sap.ushell.Container = {
                getService: this.fnGetService
            };

            sap.ushell.services = {
                DarkModeSupport: DarkModeSupport
            };

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                getViewData: sinon.stub(),
                invalidate: sinon.spy()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.aThemeListFromServer = this.aThemeList;
                sinon.stub(this.oController, "getView").returns(this.oView);
                fnDone();
            }.bind(this));
        },

        afterEach: function () {
            Config._reset();
            this.oController.destroy();
            this.oController = null;

            delete sap.ushell.Container;
            delete sap.ushell.services;

        }
    });

    QUnit.test("create model and don't attach the listener when dark mode is disabled", function (assert) {
        // Arrange
        Config.emit("/core/darkMode/enabled", false);
        var oExpectedData = {
            enabled: false,
            detectionSupported: false,
            detectionEnabled: true,
            isDarkThemeApplied: false,
            supportedThemes: {}
        };

        // Act
        var oDarkModeModel = this.oController.getDarkModeModel(this.aThemeList);

        // Assert
        assert.deepEqual(oDarkModeModel.getData(), oExpectedData, "The correct dark mode model is created");
        assert.ok(this.oDarkModeSupport.attachModeChanged.notCalled, "the listener was not attached");
    });

    QUnit.test("create model when dark mode is enabled", function (assert) {
        // Arrange
        var oExpectedData = {
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true, //enabled by default in DarkModeSupport service
            isDarkThemeApplied: false,
            supportedThemes: {
                "sap_fiori_3_dark": {
                    mode: "dark",
                    complementaryTheme: "sap_fiori_3",
                    combineName: "SAP Quartz"
                },
                "sap_fiori_3": {
                    mode: "light",
                    complementaryTheme: "sap_fiori_3_dark",
                    combineName: "SAP Quartz"
                }
            }
        };

        // Act
        var oDarkModeModel = this.oController.getDarkModeModel(this.aThemeList);

        // Assert
        assert.deepEqual(oDarkModeModel.getData(), oExpectedData, "The correct dark mode model is created");
        assert.ok(this.oDarkModeSupport.attachModeChanged.calledOnce, "the listener is attached");
    });

    QUnit.test("update model when mode is changed", function (assert) {
        // Arrange
        var fnCallback,
            oDarkModeModel;
        // Act
        oDarkModeModel = this.oController.getDarkModeModel(this.aThemeList);
        assert.equal(oDarkModeModel.getProperty("/isDarkThemeApplied"), false, "isDarkThemeApplied set correctly");
        fnCallback = this.oDarkModeSupport.attachModeChanged.getCall(0).args[0];
        fnCallback("dark");

        // Assert
        assert.equal(oDarkModeModel.getProperty("/isDarkThemeApplied"), true, "isDarkThemeApplied set correctly");
    });

    QUnit.test("_isDarkModeActive: return false when dark mode is disabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: false
            });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, false, "_isDarkModeActive is false when dark mode is disabled");
    });

    QUnit.test("_isDarkModeActive: return true when dark mode is enabled and detection is supported", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: true,
                detectionSupported: false
            });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, true, "_isDarkModeActive is true when dark mode is enabled and detection is not supported");
    });

    QUnit.test("_isDarkModeActive: return true when dark mode is enabled and detection is supported and enabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: true,
                detectionSupported: true,
                detectionEnabled: true
            });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, true, "_isDarkModeActive is true when dark mode is enabled and detection is not supported");
    });

    QUnit.test("changeSystemModeDetection: enable detection", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: true,
                detectionSupported: true,
                detectionEnabled: true,
                supportedThemes: {}
            });
        this.oController.oUser = {
            getTheme: sinon.stub().returns("sap_fiori"),
            isSetThemePermitted: sinon.stub().returns(false)
        };
        var oGetThemeListDataStub = sinon.spy(this.oController, "_getThemeListData");
        var oEvent = {
            getSource: sinon.stub().returns({
                getState: sinon.stub().returns(true)
            })
        };
        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        var oSetPropStub = sinon.spy();
        this.oView.getModel.returns({
            setProperty: oSetPropStub
        });
        // Act
        this.oController.changeSystemModeDetection(oEvent);

        // Assert
        assert.ok(this.oDarkModeSupport.enableDarkModeBasedOnSystem.calledOnce, "enableDarkModeBasedOnSystem called");
        assert.ok(this.oDarkModeSupport.disableDarkModeBasedOnSystem.notCalled, "enableDarkModeBasedOnSystem called");
        assert.ok(oGetThemeListDataStub.calledOnce, "new theme model was calculated");
        assert.ok(oSetPropStub.getCall(0).args[0], "/options", "the options was updated");
        assert.ok(this.oView.invalidate.calledOnce, "View was invalidated");
    });

    QUnit.test("changeSystemModeDetection: disable detection", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: true,
                detectionSupported: true,
                detectionEnabled: true,
                supportedThemes: {}
            });
        this.oController.oUser = {
            getTheme: sinon.stub().returns("sap_fiori"),
            isSetThemePermitted: sinon.stub().returns(false)
        };
        var oGetThemeListDataStub = sinon.spy(this.oController, "_getThemeListData");
        var oEvent = {
            getSource: sinon.stub().returns({
                getState: sinon.stub().returns(false)
            })
        };
        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        var oSetPropStub = sinon.spy();
        this.oView.getModel.returns({
            setProperty: oSetPropStub
        });
        // Act
        this.oController.changeSystemModeDetection(oEvent);

        // Assert
        assert.ok(this.oDarkModeSupport.enableDarkModeBasedOnSystem.notCalled, "disableDarkModeBasedOnSystem called");
        assert.ok(this.oDarkModeSupport.disableDarkModeBasedOnSystem.calledOnce, "disableDarkModeBasedOnSystem called");
        assert.ok(oGetThemeListDataStub.calledOnce, "new theme model was calculated");
        assert.ok(oSetPropStub.getCall(0).args[0], "/options", "the options was updated");
        assert.ok(this.oView.invalidate.calledOnce, "View was invalidated");
    });


    QUnit.test("Hide theme from pair if dark mode is active", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
                enabled: true,
                detectionSupported: true,
                detectionEnabled: true,
                supportedThemes: {
                    "sap_fiori_3_dark": {
                        mode: "dark",
                        complementaryTheme: "sap_fiori_3",
                        combineName: "SAP Quartz"
                    },
                    "sap_fiori_3": {
                        mode: "light",
                        complementaryTheme: "sap_fiori_3_dark",
                        combineName: "SAP Quartz"
                    }
                }
            });
        this.oController.oUser = {
            isSetThemePermitted: sinon.stub().returns(true)
        };

        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        this.oController._oDarkModeModel = oDarkModeModel;

        var aThemeListFromServer = [
            {id: "sap_fiori_3", name: "SAP Quartz Light"},
            {id: "sap_fiori_3_dark", name: "SAP Quartz Dark"}
        ];
        // Act
        var aThemeList = this.oController._getThemeListData(aThemeListFromServer, "sap_fiori_3");

        // Assert
        var aExpectedList = [
            {
                id: "sap_fiori_3_dark",
                name: "SAP Quartz Dark",
                isVisible: false,
                isSelected: false,
                isSapTheme: true,
                combineName: "SAP Quartz"
            },
            {
                id: "sap_fiori_3",
                name: "SAP Quartz Light",
                isVisible: true,
                isSelected: true,
                isSapTheme: true,
                combineName: "SAP Quartz"
            }
        ];
        assert.deepEqual(aThemeList, aExpectedList, "the selected theme should be visible");
    });

    QUnit.module("The writeToPersonalization function", {
        beforeEach: function (assert) {
            var done = assert.async();

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;

                this.oSetPersDataStub = sinon.stub();
                var oPersonalizer = {
                    setPersData: this.oSetPersDataStub
                };
                this.oGetPersonalizerStub = sinon.stub(this.oController, "getPersonalizer").returns(oPersonalizer);
                done();
            }.bind(this));
        },

        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
            this.oGetPersonalizerStub = null;
            this.oSetPersDataStub = null;
        }
    });

    QUnit.test("Returns the result of the function call to setPersData", function (assert) {
        // Arrange
        var oReturnValue = {};
        var oContainer = {};
        var oItem = {};
        var oValue = {};
        this.oSetPersDataStub.returns(oReturnValue);

        // Act
        var oResult = this.oController.writeToPersonalization(oContainer, oItem, oValue);

        // Assert
        assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[0], oContainer, "The function getPersonalizer has been called with the correct parameter.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[1], oItem, "The function getPersonalizer has been called with the correct parameter.");
        assert.strictEqual(this.oSetPersDataStub.callCount, 1, "The function setPersData has been called once.");
        assert.strictEqual(this.oSetPersDataStub.firstCall.args[0], oValue, "The function setPersData has been called with the correct parameter.");
        assert.strictEqual(oResult, oReturnValue, "The function setPersData has returned the correct value.");
    });

    QUnit.test("Returns a rejected promise if setPersData throws an error", function (assert) {
        // Arrange
        this.oSetPersDataStub.throws({});

        // Act
        var oResult = this.oController.writeToPersonalization();

        // Assert
        assert.strictEqual(typeof oResult.then, "function", "The returned object has a 'then' function.");
        assert.strictEqual(typeof oResult.fail, "function", "The returned object has a 'fail' function.");
        assert.strictEqual(typeof oResult.done, "function", "The returned object has a 'done' function.");
    });

    QUnit.test("Logs error messages if setPersData throws an error", function (assert) {
        // Arrange
        var oError = {
            name: "!ErrorName!",
            message: "!ErrorMessage!"
        };
        this.oSetPersDataStub.throws(oError);
        var oLogErrorStub = sinon.stub(Log, "error");

        // Act
        this.oController.writeToPersonalization();

        // Assert
        assert.strictEqual(oLogErrorStub.callCount, 2, "The function jQuery.sap.log.error has been called twice.");
        assert.strictEqual(oLogErrorStub.firstCall.args[0], "Personalization service does not work:", "The function jQuery.sap.log.error has been called with the correct parameter.");
        assert.strictEqual(oLogErrorStub.secondCall.args[0], "!ErrorName!: !ErrorMessage!", "The function jQuery.sap.log.error has been called with the correct parameter.");

        // Cleanup
        oLogErrorStub.restore();
    });

    QUnit.module("The getPersonalizer function", {
        beforeEach: function (assert) {
            var fnDone = assert.async();

            this.oGetServiceStub = sinon.stub();
            window.sap.ushell = {
                Container: {
                    getService: this.oGetServiceStub
                }
            };

            this.oGetComponentStub = sinon.stub(Component, "getOwnerComponentFor");
            this.oGetComponentStub.returns("SomeComponentInstance");

            this.oGetPersonalizerStub = sinon.stub();

            this.oPersonalizationService = {
                constants: {
                    keyCategory: {
                        FIXED_KEY: "FIXED_KEY"
                    },
                    writeFrequency: {
                        LOW: "LOW"
                    }
                },
                getPersonalizer: this.oGetPersonalizerStub
            };

            this.oGetServiceStub.withArgs("Personalization").returns(this.oPersonalizationService);

            Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                fnDone();
            }.bind(this));
        },

        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
            this.oGetServiceStub = null;

            this.oGetComponentStub.restore();
            this.oGetComponentStub = null;

            delete window.sap.ushell;
        }
    });

    QUnit.test("Returns an already existing Personalizer instance with matching container and item ID", function (assert) {
        // Arrange
        var oPersonalizer = {};
        this.oController.oPersonalizers = {
            "some.container.ID-some.item.ID": oPersonalizer
        };

        // Act
        var oResult = this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
    });

    QUnit.test("Returns the result of the getPersonalizer function call if no Personalizer exists yet", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        var oResult = this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
        assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[0], {
            container: "some.container.ID",
            item: "some.item.ID"
        }, "The function getPersonalizer has been called with the correct 1st parameter.");
        assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[1], {
            keyCategory: "FIXED_KEY",
            writeFrequency: "LOW",
            clientStorageAllowed: true
        }, "The function getPersonalizer has been called with the correct 2nd parameter.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[2], "SomeComponentInstance", "The function getPersonalizer has been called with the correct 3rd parameter.");
        assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
    });

    QUnit.test("Stores the Personalizer instance in an internal map", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(this.oController.oPersonalizers["some.container.ID-some.item.ID"], oPersonalizer, "The correct object reference has been stored.");
    });

});
