// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/mvc/Controller",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/utils/WindowUtils"
], function (
    Controller,
    jQuery,
    Config,
    resources,
    ushellUtils,
    windowUtils
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("UserAccountSelector.controller", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.fnGetShellConfigStub = sandbox.stub();
            this.oTestUser = {
                attachOnSetImage: sandbox.spy(),
                getImage: sandbox.stub(),
                getFullName: sandbox.stub(),
                getEmail: sandbox.stub(),
                getImageConsent: sandbox.stub(),
                resetChangedProperty: sandbox.spy(),
                setImageConsent: sandbox.spy()
            };

            this.oIsResetEntirePersonalizationSupportedStub = sandbox.stub()
                .resolves();
            this.oResetEntirePersonalizationStub = sandbox.stub()
                .resolves();
            this.oPersonalizationServiceMock = {
                isResetEntirePersonalizationSupported: this.oIsResetEntirePersonalizationSupportedStub
            };

            this.oUpdateUserPreferencesStub = sandbox.stub();
            this.oUserInfoService = { updateUserPreferences: this.oUpdateUserPreferencesStub };

            sap.ushell.Container = {
                getRenderer: sandbox.stub()
                    .returns({
                        getShellConfig: this.fnGetShellConfigStub
                    }),
                getService: sandbox.stub()
                    .returns(this.oUserInfoService),
                getServiceAsync: sandbox.stub()
                    .withArgs("Personalization")
                    .resolves(this.oPersonalizationServiceMock),
                getUser: sandbox.stub()
                    .returns(this.oTestUser)
            };

            this.oView = {
                getModel: sandbox.stub(),
                setModel: sandbox.spy(),
                byId: sandbox.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/userAccount/UserAccountSelector"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView")
                    .returns(this.oView);
                done();
            }.bind(this));

        },
        afterEach: function () {
            this.oController.destroy();
            delete sap.ushell.Container;
            Config._reset();
            sandbox.restore();

        }
    });

    QUnit.test("termsOfUserPress: open termsOfUseTextBox", function (assert) {
        // Arrange
        var oTextBox = {
                getVisible: sandbox.stub().returns(false),
                setVisible: sandbox.spy()
            },
            oLink = { setText: sandbox.spy() };
        this.oView.byId.withArgs("termsOfUseTextFlexBox").returns(oTextBox);
        this.oView.byId.withArgs("termsOfUseLink").returns(oLink);

        // Act
        this.oController.termsOfUserPress();

        // Assert
        assert.ok(oTextBox.setVisible.calledOnce, "The visibility of text box was changed");
        assert.deepEqual(oTextBox.setVisible.getCall(0).args, [ true ], "The visibility of text box was changed");
        assert.ok(oLink.setText.calledOnce, "The text of the link was changed");
        assert.deepEqual(
            oLink.setText.getCall(0).args,
            [ resources.i18n.getText("userImageConsentDialogHideTermsOfUse") ],
            "The text of the link was changed"
        );
    });

    QUnit.test("termsOfUserPress: close termsOfUseTextBox", function (assert) {
        // Arrange
        var oTextBox = {
                getVisible: sandbox.stub().returns(true),
                setVisible: sandbox.spy()
            },
            oLink = {
                setText: sandbox.spy()
            };
        this.oView.byId.withArgs("termsOfUseTextFlexBox").returns(oTextBox);
        this.oView.byId.withArgs("termsOfUseLink").returns(oLink);

        // Act
        this.oController.termsOfUserPress();

        // Assert
        assert.ok(oTextBox.setVisible.calledOnce, "The visibility of text box was changed");
        assert.deepEqual(oTextBox.setVisible.getCall(0).args, [ false ], "The visibility of text box was changed");
        assert.ok(oLink.setText.calledOnce, "The text of the link was changed");
        assert.deepEqual(
            oLink.setText.getCall(0).args,
            [ resources.i18n.getText("userImageConsentDialogShowTermsOfUse") ],
            "The text of the link was changed"
        );
    });

    QUnit.test("onCancel: do nothing when enableUserImgConsent is false", function (assert) {
        // Arrange
        this.fnGetShellConfigStub
            .returns({ enableUserImgConsent: false });

        // Act
        this.oController.onInit();
        this.oController.onCancel();

        // Assert
        assert.ok(this.oView.getModel.notCalled, "getModel should not be called");
    });

    QUnit.test("onCancel: reset isImageConsentForUser when enableUserImgConsent is true", function (assert) {
        // Arrange
        this.fnGetShellConfigStub
            .returns({ enableUserImgConsent: true });
        this.oTestUser.getImageConsent.returns(true);
        this.oController.onInit();
        var oConfigModel = this.oView.setModel.getCall(1).args[0];
        oConfigModel.setProperty("/isImageConsentForUser", false);
        this.oView.getModel.returns(oConfigModel);

        // Act
        this.oController.onCancel();
        this.oController.onCancel();

        // Assert
        assert.equal(oConfigModel.getProperty("/isImageConsentForUser"), true, "isImageConsentForUser in model should be reset");
    });

    QUnit.test("onSave: do nothing and return resolved promise when enableUserImgConsent is false", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub
            .returns({ enableUserImgConsent: false });
        this.oController.onInit();
        this.oController.onSaveUserImgConsent = sandbox.spy();

        // Act
        this.oController.onSave()
            .then(function () {
                    // Assert
                    assert.ok(true, "the promise was resolved");
                    assert.ok(this.oController.onSaveUserImgConsent.notCalled, "don't need to save because enableUserImgConsent is false");
                }.bind(this),
                function () {
                    assert.ok(false, "the promise should be resolved");
                })
            .then(fnDone);
    });

    QUnit.test("onSave: don't save when no changes", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub
            .returns({ enableUserImgConsent: true });
        this.oTestUser.getImageConsent.returns(true);
        this.oController.onInit();
        var oConfigModel = this.oView.setModel.getCall(1).args[0];
        this.oView.getModel.returns(oConfigModel);

        // Act
        this.oController.onSave()
            .then(function () {
                    // Assert
                    assert.ok(true, "the promise was resolved");
                    assert.ok(this.oUpdateUserPreferencesStub.notCalled, "service should not be called");
                }.bind(this),
                function () {
                    assert.ok(false, "the promise should be resolved");
                })
            .then(fnDone);
    });

    QUnit.test("onSave: save new value", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({ enableUserImgConsent: true });
        this.oTestUser.getImageConsent.returns(true);
        this.oController.onInit();
        var oConfigModel = this.oView.setModel.getCall(1).args[0];
        oConfigModel.setProperty("/isImageConsentForUser", false);
        this.oView.getModel.returns(oConfigModel);
        var oDfd = (new jQuery.Deferred()).resolve();
        this.oUpdateUserPreferencesStub.returns(oDfd.promise());

        // Act
        this.oController.onSave()
            .then(function () {
                    // Assert
                    assert.ok(true, "the promise was resolved");
                    assert.ok(this.oUpdateUserPreferencesStub.calledOnce, "service should be called");
                    assert.ok(this.oTestUser.setImageConsent.calledOnce, "setImageConsent was called");
                    assert.deepEqual(
                        this.oTestUser.setImageConsent.getCall(0).args,
                        [ false ],
                        "setImageConsent was called with correct arguments"
                    );
                    assert.ok(this.oTestUser.resetChangedProperty.calledOnce, "resetChangedProperty was called");
                    assert.deepEqual(
                        this.oTestUser.resetChangedProperty.getCall(0).args,
                        [ "isImageConsent" ],
                        "resetChangedProperty was called with correct arguments"
                    );
                }.bind(this),
                function () {
                    assert.ok(false, "the promise should be resolved");
                })
            .then(fnDone);
    });

    QUnit.test("onSave: service call fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sErrorMsg = "Error";
        this.fnGetShellConfigStub
            .returns({ enableUserImgConsent: true });
        this.oTestUser.getImageConsent.returns(true);
        this.oController.onInit();
        var oConfigModel = this.oView.setModel.getCall(1).args[0];
        oConfigModel.setProperty("/isImageConsentForUser", false);
        this.oView.getModel.returns(oConfigModel);
        var oDfd = (new jQuery.Deferred()).reject(sErrorMsg);
        this.oUpdateUserPreferencesStub.returns(oDfd.promise());

        // Act
        this.oController.onSave()
            .then(function () {
                    assert.ok(false, "the promise shoiuld be resolved");
                },
                function (sMsg) {
                    // Assert
                    assert.ok(true, "the promise was rejected");
                    assert.equal(sMsg, sErrorMsg, "The error message was sent");
                    assert.ok(this.oUpdateUserPreferencesStub.calledOnce, "service should be called");
                    assert.ok(this.oTestUser.setImageConsent.calledTwice, "setImageConsent was called");
                    assert.deepEqual(
                        this.oTestUser.setImageConsent.getCall(0).args,
                        [ false ],
                        "setImageConsent was called with correct arguments"
                    );
                    assert.deepEqual(
                        this.oTestUser.setImageConsent.getCall(1).args,
                        [ true ],
                        "setImageConsent was called with correct arguments"
                    );
                    assert.ok(this.oTestUser.resetChangedProperty.calledOnce, "resetChangedProperty was called");
                    assert.deepEqual(
                        this.oTestUser.resetChangedProperty.getCall(0).args,
                        [ "isImageConsent" ],
                        "resetChangedProperty was called with correct arguments"
                    );
                    assert.equal(oConfigModel.getProperty("/isImageConsentForUser"), true, "model was reset");
                }.bind(this)
            )
            .then(fnDone);
    });

    QUnit.module("The function onInit", {
        beforeEach: function () {
            this.fnGetShellConfigStub = sandbox.stub()
                .returns({
                    enableUserImgConsent: false
                });

            this.oTestUser = {
                attachOnSetImage: sandbox.spy(),
                getImage: sandbox.stub(),
                getFullName: sandbox.stub(),
                getEmail: sandbox.stub(),
                getImageConsent: sandbox.stub(),
                resetChangedProperty: sandbox.spy(),
                setImageConsent: sandbox.spy()
            };

            this.oIsResetEntirePersonalizationSupportedStub = sandbox.stub()
                .resolves(true);

            this.oPersonalizationServiceMock = {
                isResetEntirePersonalizationSupported: this.oIsResetEntirePersonalizationSupportedStub
            };
            this.oGetServiceAsyncStub = sandbox.stub()
                .resolves();
            this.oGetServiceAsyncStub
                .withArgs("Personalization")
                .resolves(this.oPersonalizationServiceMock);

            sap.ushell.Container = {
                getRenderer: sandbox.stub()
                    .returns({
                        getShellConfig: this.fnGetShellConfigStub
                    }),
                getServiceAsync: this.oGetServiceAsyncStub,
                getUser: sandbox.stub()
                    .returns(this.oTestUser)
            };

            this.oSetVisibleStub = sandbox.stub()
                .withArgs(false);
            this.oGetByIdStub = sandbox.stub()
                .withArgs("userAccountPersonalizationSection")
                .returns({
                    setVisible: this.oSetVisibleStub
                });

            this.oView = {
                getModel: sandbox.stub(),
                setModel: sandbox.spy(),
                byId: this.oGetByIdStub,
                setBusy: sandbox.stub()
            };

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/userAccount/UserAccountSelector"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView")
                    .returns(this.oView);
            }.bind(this));

        },
        afterEach: function () {
            this.oController.destroy();
            delete sap.ushell.Container;
            Config._reset();
            sandbox.restore();

        }
    });

    QUnit.test("onInit", function (assert) {
        // Arrange
        var oExpectedState = {
            icon: "sap-icon://person-placeholder",
            name: "Test Tester",
            mail: "test@sap.com",
            server: window.location.host,
            imgConsentEnabled: false,
            isImageConsentForUser: false,
            isResetPersonalizationVisible: true
        };

        this.fnGetShellConfigStub.returns({});
        this.oTestUser.getFullName.returns(oExpectedState.name);
        this.oTestUser.getEmail.returns(oExpectedState.mail);
        this.oTestUser.getImageConsent.returns(oExpectedState.isImageConsentForUser);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oTestUser.attachOnSetImage.callCount, 1, "attached listener to setImage");
        assert.ok(this.oView.setModel.calledTwice, "2 models should be set");
        assert.deepEqual(this.oView.setModel.getCall(0).args[1], "i18n", "i18n model was set");
        var oSecondSetModel = this.oView.setModel.getCall(1);
        assert.deepEqual(oSecondSetModel.args[0].getData(), oExpectedState, "The correct config model is set");
        assert.strictEqual(oSecondSetModel.args[1], "config", "The correct name of the second setModel");
    });

    QUnit.test("onInit: Hide deletion of personalization section.", function (assert) {
        // Arrange
        var done = assert.async();
        this.oIsResetEntirePersonalizationSupportedStub
            .resolves(false);
        this.oSetPropertyStub = sandbox.stub();
        sandbox.stub(this.oController, "getConfigurationModel")
            .returns({
                setProperty: this.oSetPropertyStub
            });

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The function GetServiceAsync was called once.");
        this.oGetServiceAsyncStub.call(0)
            .then(function () {
                assert.strictEqual(this.oIsResetEntirePersonalizationSupportedStub.callCount, 1, "The function isResetEntirePersonalizationSupportedStub was called once.");
                this.oIsResetEntirePersonalizationSupportedStub.call(0)
                    .then(function () {
                        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The visibility was changed.");
                        assert.strictEqual(this.oSetPropertyStub.getCall(0).args[1], false, "The visibility was changed to false.");
                        done();
                    }.bind(this));
            }.bind(this));
    });

    QUnit.test("onInit: Show deletion of personalization section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSetPropertyStub = sandbox.stub();
        sandbox.stub(this.oController, "getConfigurationModel")
            .returns({
                setProperty: this.oSetPropertyStub
            });

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The function getServiceAsync was called once.");
        this.oGetServiceAsyncStub.call(0)
            .then(function () {
                assert.strictEqual(this.oIsResetEntirePersonalizationSupportedStub.callCount, 1, "The function isResetEntirePersonalizationSupportedStub was called once.");
                this.oIsResetEntirePersonalizationSupportedStub.call(0)
                    .then(function () {
                        assert.strictEqual(this.oSetPropertyStub.callCount, 0, "The function setProperty was not called.");
                        done();
                    }.bind(this));
            }.bind(this));
    });

    QUnit.test("onInit: set image in model", function (assert) {
        // Arrange
        var sImageUrl = "/some/url/image.jpeg";
        var oExpectedState = {
            icon: sImageUrl,
            name: "Test Tester",
            mail: "test@sap.com",
            server: window.location.host,
            imgConsentEnabled: true,
            isImageConsentForUser: true,
            isResetPersonalizationVisible: true
        };

        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: true
        });
        this.oTestUser.getFullName.returns(oExpectedState.name);
        this.oTestUser.getEmail.returns(oExpectedState.mail);
        this.oTestUser.getImageConsent.returns(oExpectedState.isImageConsentForUser);
        this.oTestUser.getImage.returns(sImageUrl);
        Config.emit("/core/shell/model/userImage/personPlaceHolder", sImageUrl);

        // Act
        this.oController.onInit();

        // Assert
        var oConfigModel = this.oView.setModel.getCall(1).args[0];
        assert.deepEqual(oConfigModel.getData(), oExpectedState, "The correct config model is set");
    });

    QUnit.module("The function showMessageBoxWarningDeletePersonalization", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oView = {
                getModel: sandbox.stub(),
                setModel: sandbox.spy(),
                byId: sandbox.stub(),
                setBusy: sandbox.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/userAccount/UserAccountSelector"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView")
                    .returns(this.oView);
                done();
            }.bind(this));

            this.oWarningMessageBoxStub = sandbox.stub(sap.m.MessageBox, "warning");
        },
        afterEach: function () {
            this.oController.destroy();
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("shows a warning dialog.", function (assert) {
        // Act
        this.oController.showMessageBoxWarningDeletePersonalization();

        // Assert
        assert.strictEqual(this.oWarningMessageBoxStub.callCount, 1, "The dialog was shown once.");
    });

    QUnit.module("The function resetEntirePersonalization", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oView = {
                getModel: sandbox.stub(),
                setModel: sandbox.spy(),
                byId: sandbox.stub(),
                setBusy: sandbox.stub()
            };

            Controller.create({
                name: "sap/ushell/components/shell/Settings/userAccount/UserAccountSelector"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView")
                    .returns(this.oView);
                done();
            }.bind(this));

            this.oMessageToastStub = sandbox.stub(sap.m.MessageToast, "show");
            this.oWindowUtilStub = sandbox.stub(windowUtils, "refreshBrowser");

            this.oResetEntirePersonalizationStub = sandbox.stub()
                .resolves();

            this.oPersonalizationServiceMock = {
                resetEntirePersonalization: this.oResetEntirePersonalizationStub
            };
            this.oGetServiceAsyncStub = sandbox.stub()
                .withArgs("Personalization")
                .resolves(this.oPersonalizationServiceMock);

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("deletes all personalization data.", function (assert) {
        // Arrange
        var done = assert.async();
        this.aMessageToastParameter = [ resources.i18n.getText("userAccountResetPersonalizationWarningDialogSuccessToast"), {
            onClose: windowUtils.refreshBrowser
        } ];

        // Act
        this.oController.resetEntirePersonalization(sap.m.MessageBox.Action.OK);

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The service was retrieved.");
        this.oGetServiceAsyncStub.call(0)
            .then(function () {
                assert.strictEqual(this.oResetEntirePersonalizationStub.callCount, 1, "The function resetEntirePersonalization was called once.");
                this.oResetEntirePersonalizationStub.call(0)
                    .then(function () {
                        assert.strictEqual(this.oMessageToastStub.callCount, 1, "The toast was shown once.");
                        assert.deepEqual(this.oMessageToastStub.args[0], this.aMessageToastParameter, "The toast was called with the correct parameters.");
                        done();
                    }.bind(this));
            }.bind(this));
    });

    QUnit.test("does not delete all personalization data because the user clicked cancel.", function (assert) {
        // Act
        this.oController.resetEntirePersonalization(sap.m.MessageBox.Action.CANCEL);

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0, "The service was not retrieved.");
        assert.strictEqual(this.oWindowUtilStub.callCount, 0, "The function refreshBrowser was not called once.");
    });

    QUnit.test("does not delete all personalizatino data because the user is not allowed to.", function (assert) {
        // Arrange
        this.oResetEntirePersonalizationStub.rejects();
        var done = assert.async();
        this.oErrorMessageBoxStub = sandbox.stub(sap.m.MessageBox, "error")
            .withArgs(resources.i18n.getText("userAccountResetPersonalizationWarningDialogErrorDialog"), {
                contentWidth: "600px"
            })
            .resolves({});

        // Act
        this.oController.resetEntirePersonalization(sap.m.MessageBox.Action.OK);

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "The service was retrieved.");
        this.oGetServiceAsyncStub.call(0)
            .then(function () {
                assert.strictEqual(this.oResetEntirePersonalizationStub.callCount, 1, "The function resetEntirePersonalization was called once.");
                this.oResetEntirePersonalizationStub.call(0)
                    .catch(function () {
                        assert.strictEqual(this.oWindowUtilStub.callCount, 0, "The page was not reloaded.");
                        this.oErrorMessageBoxStub.call(0)
                            .then(function () {
                                assert.strictEqual(this.oErrorMessageBoxStub.callCount, 1, "The error dialog was opened.");
                                done();
                            }.bind(this));
                    }.bind(this));
            }.bind(this));
    });
});
