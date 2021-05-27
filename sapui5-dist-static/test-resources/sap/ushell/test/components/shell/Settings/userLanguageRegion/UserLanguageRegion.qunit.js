// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/base/Log",
    "sap/base/util/UriParameters",
    "sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegionEntry",
    "sap/ushell/components/shell/Settings/userLanguageRegion/LanguageRegionSelector.controller",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (Log, UriParameters, UserLanguageRegionEntry, LanguageRegionSelectorController, Config, resources) {
    "use strict";

    /* global QUnit sinon */
    var sandbox = sinon.createSandbox();

    QUnit.module("UserLanguageRegion", {
        beforeEach: function () {

            this.oUser = {
                getLanguage: sandbox.stub(),
                getLanguageText: sandbox.stub(),
                getTimeZone: sandbox.stub(),
                isLanguagePersonalized: sandbox.stub(),
                setLanguage: sandbox.spy(),
                resetChangedProperty: sandbox.spy()
            };

            this.oShellConfig = {
                enableSetLanguage: false
            };

            this.oUserInfoSetvice = {
                getLanguageList: sandbox.stub(),
                updateUserPreferences: sandbox.stub(),
                getUserSettingListEditSupported: sandbox.stub(),
                getUserSettingList: sandbox.stub()
            };

            sap.ushell.Container = {
                getUser: sandbox.stub().returns(this.oUser),
                getRenderer: sandbox.stub().returns({
                    getShellConfig: sandbox.stub().returns(this.oShellConfig)
                }),
                getService: sandbox.stub().returns(this.oUserInfoSetvice)
            };

            this.fnLogWarningSpy = sandbox.spy(Log, "warning");
            this.fnLogErrorSpy = sandbox.spy(Log, "error");

            sandbox.stub(LanguageRegionSelectorController.prototype, "_removeLanguageFromUserContextCookie");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Check contract properties", function (assert) {
        // Arrange

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        // Assert
        assert.equal(oContract.id, "language", "id is correct");
        assert.equal(oContract.entryHelpID, "language", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("languageRegionTit"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://globe", "icon is correct");

        assert.equal(typeof oContract.valueArgument, "function", "valueArgument is function");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("valueArgument: return correct value for american english", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oUser.getLanguageText.returns("English");
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.valueArgument().then(function (sResult) {
            // Assert
            var sExpectedResult = "English";
            assert.equal(sResult, sExpectedResult, "The correct value is returned");
            fnDone();
        });
    });

    QUnit.test("valueArgument: return correct value for british english", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oUser.getLanguageText.returns("English-British");
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.valueArgument().then(function (sResult) {
            // Assert
            var sExpectedResult = "English (British)";
            assert.equal(sResult, sExpectedResult, "The correct value is returned");
            fnDone();
        });
    });

    QUnit.test("contentFunc: create view when enableSetLanguage is false", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oExpextedModel = {
            languageList: null,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isLanguagePersonalized: true,
            isEnableSetLanguage: false,
            isEnableUserProfileSetting: false,
            selectedNumberformat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpextedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpextedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpextedModel.isLanguagePersonalized);
        this.oUserInfoSetvice.getUserSettingListEditSupported.returns(oExpextedModel.isEnableUserProfileSetting);

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpextedModel, "The correct model is set");

            var aFormItems = oView.byId("languageForm").getContent();
            //Language field
            assert.equal(aFormItems.length, 10, "all content was added");
            assert.ok(aFormItems[0].isA("sap.m.Label"), "The first control in the Label");
            assert.ok(aFormItems[1].isA("sap.m.VBox"), "The second control in the text");
            var aBoxContent = aFormItems[1].getItems();
            assert.equal(aBoxContent.length, 2, "all content was added");
            assert.ok(aBoxContent[0].isA("sap.m.Text"), "The first control in VBox in the Text");
            assert.ok(aBoxContent[1].isA("sap.m.Select"), "The second control in VBox in the Text");

            //Date Format field
            assert.ok(aFormItems[2].isA("sap.m.Label"), "The 3rd control in the Label");
            assert.ok(aFormItems[3].isA("sap.m.VBox"), "The second control in the text");
            aBoxContent = aFormItems[3].getItems();
            assert.equal(aBoxContent.length, 2, "all content was added");
            assert.ok(aBoxContent[0].isA("sap.m.Text"), "The 4th control in the text");
            assert.equal(aBoxContent[0].getText(), oExpextedModel.selectedDatePattern, "The text is correct");
            assert.ok(aBoxContent[1].isA("sap.m.Select"), "The second control in VBox in the Text");

            //Time Format field
            assert.ok(aFormItems[4].isA("sap.m.Label"), "The 5th control in the Label");
            assert.ok(aFormItems[5].isA("sap.m.VBox"), "The 6th control is the SegmentedButton");
            aBoxContent = aFormItems[5].getItems();
            assert.ok(aBoxContent[0].isA("sap.m.SegmentedButton"), "The 6th control in the SegmentedButton");
            assert.equal(aBoxContent[0].getItems().length, 2, "Correct items in the SegmentedButton");
            assert.ok(aBoxContent[1].isA("sap.m.Select"), "The second control in VBox in the Text");

            //Time Zone field
            assert.ok(aFormItems[6].isA("sap.m.Label"), "The 7th control in the Label");
            assert.ok(aFormItems[7].isA("sap.m.VBox"), "The 8th control is the Select");
            aBoxContent = aFormItems[7].getItems();
            assert.ok(aBoxContent[0].isA("sap.m.Select"), "The second control in VBox in the Select");

            //Decimal Format field
            assert.ok(aFormItems[4].isA("sap.m.Label"), "The 9th control in the Label");
            assert.ok(aFormItems[7].isA("sap.m.VBox"), "The 10th control is the Select");
            aBoxContent = aFormItems[7].getItems();
            assert.ok(aBoxContent[0].isA("sap.m.Select"), "The second control in VBox in the Select");

            assert.ok(this.oUserInfoSetvice.getLanguageList.notCalled, "getLanguageList not called");
            assert.ok(this.oUserInfoSetvice.getUserSettingListEditSupported.calledOnce, "getUserSettingListEditSupported called once");

            oView.destroy();
            fnDone();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when enableSetLanguage is true", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSetLanguage = true;
        var oExpextedModel = {
            languageList: [{
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ],
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            isEnableUserProfileSetting: false,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            selectedNumberformat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpextedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpextedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpextedModel.isLanguagePersonalized);
        this.oUserInfoSetvice.getUserSettingListEditSupported.returns(oExpextedModel.isEnableUserProfileSetting);

        this.oUserInfoSetvice.getLanguageList.returns(new jQuery.Deferred().resolve(oExpextedModel.languageList).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpextedModel, "The correct model is set");

            assert.ok(this.oUserInfoSetvice.getLanguageList.calledOnce, "getLanguageList was called once");

            oView.destroy();
            fnDone();
        }.bind(this));
    });

        QUnit.test("contentFunc: create view when isEnableUserProfileSetting is true", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSetLanguage = true;
        var oExpextedModel = {
            languageList: [{
                key: "EN",
                text: "English"
            }, {
                key: "DE",
                text: "Deutsch"
            }
            ],
            DateFormatList: [{value: "YYYY-MM-DD", description:"A"}],
            NumberFormatList: [{ value: "1,00,000.00", description: "A" }],
            TimeFormatList: [{ value: "12h", description: "A" }],
            TimeZoneList: [{ value: "CET + 1", description: "A" }],
            isEnableUserProfileSetting: true,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: undefined,
            selectedTimeFormat: undefined,
            isSettingsLoaded: true,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            selectedNumberformat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpextedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpextedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpextedModel.isLanguagePersonalized);
        this.oUserInfoSetvice.getUserSettingListEditSupported.returns(oExpextedModel.isEnableUserProfileSetting);
        this.oUserInfoSetvice.getLanguageList.returns(new jQuery.Deferred().resolve(oExpextedModel.languageList).promise());

        var ExpectedUserSettings = {
            "TIME_FORMAT": [{ value: "12h", description: "A" }],
            "DATE_FORMAT": [{ value: "YYYY-MM-DD", description: "A" }],
            "TIME_ZONE": [{ value: "CET + 1", description: "A" }],
            "NUMBER_FORMAT": [{ value: "1,00,000.00", description: "A" }]

        };
        this.oUserInfoSetvice.getUserSettingList.returns(new jQuery.Deferred().resolve(ExpectedUserSettings).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpextedModel, "The correct model is set");

            assert.ok(this.oUserInfoSetvice.getUserSettingList.calledOnce, "getLanguageList was called once");

            oView.destroy();
            fnDone();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when isEnableUserProfileSetting is true and reject getLanguageList", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSetLanguage = true;
        var oExpextedModel = {
            languageList: null,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            isEnableUserProfileSetting: false,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            selectedNumberformat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpextedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpextedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpextedModel.isLanguagePersonalized);
        this.oUserInfoSetvice.getUserSettingListEditSupported.returns(oExpextedModel.isEnableUserProfileSetting);
        this.oUserInfoSetvice.getLanguageList.returns(new jQuery.Deferred().reject().promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpextedModel, "The correct model is set");

            assert.ok(this.oUserInfoSetvice.getLanguageList.calledOnce, "getLanguageList was called once");
            assert.ok(this.fnLogErrorSpy.calledOnce, "log.error called once");
            oView.destroy();
            fnDone();
        }.bind(this));
    });

    QUnit.test("contentFunc: set default language", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSetLanguage = true;
        var oExpextedModel = {
            languageList: [{
                key: "default",
                text: "Browser Language"
            }, {
                key: "DE",
                text: "Deutsch"
            }],
            selectedLanguage: "default",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isLanguagePersonalized: false,
            isEnableSetLanguage: true,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            selectedNumberformat: undefined,
            selectedTimeZone: undefined,
            isEnableUserProfileSetting: undefined
        };

        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns(oExpextedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpextedModel.isLanguagePersonalized);
        this.oUserInfoSetvice.getLanguageList.returns(new jQuery.Deferred().resolve(oExpextedModel.languageList).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.deepEqual(oView.getModel().getData(), oExpextedModel, "The correct model is set");

            assert.ok(this.oUserInfoSetvice.getLanguageList.calledOnce, "getLanguageList was called once");

            oView.destroy();
            fnDone();
        }.bind(this));
    });


    QUnit.test("onSave: resolve promise when view not created", function (assert) {
        // Arrange
        var fnDone = assert.async();
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        }).then(fnDone);
    });

    QUnit.test("onSave: resolve when enableSetLanguage is false", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;

        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(true);
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.notCalled, "language should not be changed");
            assert.ok(this.oUserInfoSetvice.updateUserPreferences.notCalled, "language should not be changed");
            assert.equal(oResult, undefined, "no result is returned");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onSave: resolve when no changes", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(true);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
            );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.notCalled, "language should not be changed");
            assert.ok(this.oUserInfoSetvice.updateUserPreferences.notCalled, "language should not be changed");
            assert.equal(oResult, undefined, "no result is returned");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onSave: resolve when call service", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        this.oUserInfoSetvice.updateUserPreferences.returns(new jQuery.Deferred().resolve().promise());
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.calledOnce, "language should be changed");
            assert.ok(this.oUser.resetChangedProperty.calledOnce, "language should be changed");
            assert.ok(this.oUserInfoSetvice.updateUserPreferences.calledOnce, "language should be changed");
            assert.deepEqual(oResult, {refresh: true}, "FLP should be refreshed");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onSave: update sap-language in query string", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        this.oUserInfoSetvice.updateUserPreferences.returns(new jQuery.Deferred().resolve().promise());

        var fnGetParameter;
        var oFromQueryStub;
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            fnGetParameter = sandbox.stub().returns("EN");
            oFromQueryStub= sandbox.stub(UriParameters, "fromQuery").returns({
                get: fnGetParameter
            });
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.calledOnce, "language should be changed");
            assert.ok(this.oUser.resetChangedProperty.calledOnce, "language should be changed");
            assert.ok(this.oUserInfoSetvice.updateUserPreferences.calledOnce, "language should be changed");
            assert.equal(fnGetParameter.getCall(0).args[0], "sap-language", "sap-language param was checked");
            assert.deepEqual(oResult, {refresh: true, urlParams: [{"sap-language": "DE"}]}, "FLP should be refreshed");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(function () {
            oFromQueryStub.restore();
            fnDone();
        });
    });

    QUnit.test("onSave: don't update sap-language in query string if new language is default", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(true);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        this.oUserInfoSetvice.updateUserPreferences.returns(new jQuery.Deferred().resolve().promise());
        var fnGetParameter;
        var oFromQueryStub;

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "default");
            fnGetParameter = sandbox.stub().returns("EN");
            oFromQueryStub= sandbox.stub(UriParameters, "fromQuery").returns({
            get: fnGetParameter
        });
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.calledOnce, "language should be changed");
            assert.ok(this.oUser.resetChangedProperty.calledOnce, "language should be changed");
            assert.ok(this.oUserInfoSetvice.updateUserPreferences.calledOnce, "language should be changed");
            assert.equal(fnGetParameter.getCall(0).args[0], "sap-language", "sap-language param was checked");
            assert.deepEqual(oResult, {refresh: true}, "FLP should be refreshed");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(function () {
            oFromQueryStub.restore();
            fnDone();
        });
    });

    QUnit.test("onSave: remove language from sap-usercontext cookie", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        this.oUserInfoSetvice.updateUserPreferences.returns(new jQuery.Deferred().resolve().promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.strictEqual(oViewInstance.getController()._removeLanguageFromUserContextCookie.callCount, 1, "language should be removed from sap-usercontext cookie");
            oViewInstance.destroy();
        }, function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onSave: reject when service is rejected", function (assert) {
        var fnDone = assert.async();
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        this.oUserInfoSetvice.updateUserPreferences.returns(new jQuery.Deferred().reject().promise());
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave();
        }).then(function () {
            // Assert
            assert.ok(false, "The promise should be rejected");
            oViewInstance.destroy();
        }, function () {
            assert.ok(true, "The promise should be rejected");
            assert.ok(this.oUser.setLanguage.calledTwice, "setLanguage should be called");
            assert.ok(this.fnLogErrorSpy.calledOnce, "the error message should be logged");
            oViewInstance.destroy();
        }.bind(this)).then(fnDone);
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoSetvice.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                {
                    key: "default",
                    text: "Browser Language"
                },
                {
                    key: "EN",
                    text: "English"
                }, {
                    key: "DE",
                    text: "Deutsch"
                }
            ]).promise()
        );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oView.getModel().setProperty("/selectedLanguage", "DE");
            oContract.onCancel();
            // Assert
            assert.equal(oView.getModel().getProperty("/selectedLanguage"), "default", "the language was reset");
            oView.destroy();
        }).then(fnDone);
    });

    QUnit.module("The _removeLanguageFromUserContextCookie function", {
        beforeEach: function () {
            this.sUserContextCookie = document.cookie.split(";").find(function (cookie) {
                return cookie.indexOf("sap-usercontext") !== -1;
            });
            this.sUserContextCookie = this.sUserContextCookie && this.sUserContextCookie.trim();
            this.oController = new LanguageRegionSelectorController();
        },
        afterEach: function () {
            if (this.sUserContextCookie) {
                document.cookie = this.sUserContextCookie + ";path=/";
            } else {
                document.cookie = "sap-usercontext=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";
            }
            this.oController.destroy();
        }
    });

    QUnit.test("Removes the language from the first position", function (assert) {
        //Arrange
        document.cookie = "sap-usercontext=sap-language=EN&sap-client=120;path=/";

        //Act
        this.oController._removeLanguageFromUserContextCookie();
        var sUserContextCookie = document.cookie.split(";").find(function (cookie) {
            return cookie.indexOf("sap-usercontext") !== -1;
        }).trim();

        //Assert
        assert.strictEqual(sUserContextCookie, "sap-usercontext=sap-client=120", "The language was removed from the sap-usercontext cookie");
    });

    QUnit.test("Removes the language from the middle", function (assert) {
        //Arrange
        document.cookie = "sap-usercontext=some-other-parameter=1&sap-language=EN&sap-client=120;path=/";

        //Act
        this.oController._removeLanguageFromUserContextCookie();
        var sUserContextCookie = document.cookie.split(";").find(function (cookie) {
            return cookie.indexOf("sap-usercontext") !== -1;
        }).trim();

        //Assert
        assert.strictEqual(sUserContextCookie, "sap-usercontext=some-other-parameter=1&sap-client=120", "The language was removed from the sap-usercontext cookie");
    });

    QUnit.test("Removes the language from the last position", function (assert) {
        //Arrange
        document.cookie = "sap-usercontext=sap-client=120&sap-language=EN;path=/";

        //Act
        this.oController._removeLanguageFromUserContextCookie();
        var sUserContextCookie = document.cookie.split(";").find(function (cookie) {
            return cookie.indexOf("sap-usercontext") !== -1;
        }).trim();

        //Assert
        assert.strictEqual(sUserContextCookie, "sap-usercontext=sap-client=120", "The language was removed from the sap-usercontext cookie");
    });

    QUnit.test("Doesn't change the cookie if there is no language", function (assert) {
        //Arrange
        document.cookie = "sap-usercontext=sap-client=120;path=/";

        //Act
        this.oController._removeLanguageFromUserContextCookie();
        var sUserContextCookie = document.cookie.split(";").find(function (cookie) {
            return cookie.indexOf("sap-usercontext") !== -1;
        }).trim();

        //Assert
        assert.strictEqual(sUserContextCookie, "sap-usercontext=sap-client=120", "The cookie was not changed");
    });

    QUnit.test("Doesn't add the sap-usercontext cookie if it is not present", function (assert) {
        //Arrange
        document.cookie = "sap-usercontext=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC";

        //Act
        this.oController._removeLanguageFromUserContextCookie();
        var sUserContextCookie = document.cookie.split(";").find(function (cookie) {
            return cookie.indexOf("sap-usercontext") !== -1;
        });

        //Assert
        assert.strictEqual(sUserContextCookie, undefined, "The sap-usercontext cookie was not added");
    });
});
