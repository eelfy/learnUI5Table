// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/userAccount/UserAccountEntry",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (XMLView, Log, UserAccountEntry, Config, resources) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("UserAccountEntry", {
        beforeEach: function () {
            this.fnGetShellConfigStub = sinon.stub();
            this.sFullname = "Firstname Lastname";

            this.fnXMLViewCreate = sinon.stub(XMLView, "create");
            this.fnLogWarningSpy = sinon.spy(Log, "warning");

            sap.ushell.Container = {
                getRenderer: sinon.stub().returns({
                    getShellConfig: this.fnGetShellConfigStub
                }),
                getUser: sinon.stub().returns({
                    getFullName: sinon.stub().returns(this.sFullname)
                })
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
            Config._reset();
            this.fnXMLViewCreate.restore();
            this.fnLogWarningSpy.restore();
        }
    });

    QUnit.test("Check contract property", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        // Assert
        assert.equal(oContract.entryHelpID, "userAccountEntry", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("UserAccountFld"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://account", "icon is correct");
        assert.equal(oContract.provideEmptyWrapper, true, "provideEmptyWrapper is correct");
        assert.equal(oContract.valueArgument, this.sFullname, "valueArgument is correct");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("contentFunc: create userAccountSetting view", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        this.fnXMLViewCreate.returns(Promise.resolve({}));
        var oExpectedView = {
            id: "userAccountSetting",
            viewName: "sap.ushell.components.shell.Settings.userAccount.UserAccountSetting"
        };
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.deepEqual(oView, {}, "The view was returned");
            assert.ok(this.fnXMLViewCreate.calledOnce, "create xml view was called");
            assert.deepEqual(this.fnXMLViewCreate.getCall(0).args, [oExpectedView], "The userAccountSetting was created");
            fnDone();
        }.bind(this));

    });

    QUnit.test("contentFunc: create userAccountSelector view", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: true
        });
        this.fnXMLViewCreate.returns(Promise.resolve({}));
        var oExpectedView = {
            id: "userAccountSelector",
            viewName: "sap.ushell.components.shell.Settings.userAccount.UserAccountSelector"
        };
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.deepEqual(oView, {}, "The view was returned");
            assert.ok(this.fnXMLViewCreate.calledOnce, "create xml view was called");
            assert.deepEqual(this.fnXMLViewCreate.getCall(0).args, [oExpectedView], "The userAccountSetting was created");
            fnDone();
        }.bind(this));
    });

    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        }).then(fnDone);
    });

    QUnit.test("onSave: call the onSave from controller", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        var oController = {
            onSave: sinon.stub().returns(Promise.resolve())
        };
        this.fnXMLViewCreate.returns(Promise.resolve({
            getController: sinon.stub().returns(oController)
        }));
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.contentFunc().then(function () {
            return oContract.onSave();
        }).then(function () {
            // Assert
            assert.ok(oController.onSave.calledOnce, "onSave of the controller was called");
        }, function () {
            assert.ok(false, "The promise should be resolved when no view");
        }).then(fnDone);
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.fnGetShellConfigStub.returns({
            enableUserImgConsent: false
        });
        var oController = {
            onCancel: sinon.stub().returns(Promise.resolve())
        };
        this.fnXMLViewCreate.returns(Promise.resolve({
            getController: sinon.stub().returns(oController)
        }));
        // Act
        var oContract = UserAccountEntry.getEntry();
        oContract.contentFunc().then(function () {
            oContract.onCancel();
            // Assert
            assert.ok(oController.onCancel.calledOnce, "onCancel of the controller was called");
        }).then(fnDone);
    });


});
