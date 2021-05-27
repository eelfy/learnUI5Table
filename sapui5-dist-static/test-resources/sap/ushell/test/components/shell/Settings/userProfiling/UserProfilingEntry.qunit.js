// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/userProfiling/UserProfilingEntry",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/m/Text"
], function (XMLView, Log, UserProfilingEntry, Config, resources, Text) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("UserProfilingEntry", {
        beforeEach: function () {
            var oFakeProfileWithJQueryContent = new jQuery.Deferred();
            oFakeProfileWithJQueryContent.resolve(new Text({text: "jQuery"}));
            this.oFakeProfileWithJQuery = {
                title: "jQuery",
                contentFunc: sinon.stub().returns(oFakeProfileWithJQueryContent.promise()),
                onSave: sinon.stub().returns(new jQuery.Deferred().resolve().promise()),
                onCancel: sinon.stub()
            };

            this.oFakeProfileWithPromise = {
                title: "Promise",
                contentFunc: sinon.stub().returns(Promise.resolve(new Text({text: "promise"}))),
                onSave: sinon.stub().returns(Promise.resolve()),
                onCancel: sinon.stub()
            };

            this.fnLogWarningSpy = sinon.spy(Log, "warning");
            this.fnLogErrorSpy = sinon.spy(Log, "error");

        },
        afterEach: function () {
            Config._reset();
            this.fnLogWarningSpy.restore();
            this.fnLogErrorSpy.restore();
        }
    });

    QUnit.test("Check contract properties", function (assert) {
        // Arrange

        // Act
        var oContract = UserProfilingEntry.getEntry();
        // Assert
        assert.equal(oContract.id, "userProfiling", "id is correct");
        assert.equal(oContract.entryHelpID, "userProfiling", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("userProfiling"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://user-settings", "icon is correct");
        assert.equal(oContract.provideEmptyWrapper, false, "provideEmptyWrapper is correct");
        assert.equal(oContract.visible, false, "Entry should be hidden");

        assert.equal(typeof oContract.valueArgument, "function", "valueArgument is function");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("contentFunc: create userProfilingView view", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        var oExpectedView = {
            id: "userProfilingView",
            viewName: "sap.ushell.components.shell.Settings.userProfiling.UserProfiling"
        };
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            aProfiles.forEach(function (oProfile) {
                assert.ok(oProfile.contentFunc.calledOnce, oProfile.title + " profile: content was loaded");
            });

            var aBoxItems = oView.byId("profilingContent").getItems();
            assert.equal(aBoxItems.length, 4, "all conyent was added");
            assert.ok(aBoxItems[0].isA("sap.m.Title"), "The first control in the title");
            assert.equal(aBoxItems[0].getText(), aProfiles[0].title, "The title is correct");
            assert.ok(aBoxItems[1].isA("sap.m.Text"), "The second control in the text");
            assert.ok(aBoxItems[2].isA("sap.m.Title"), "The first control in the title");
            assert.equal(aBoxItems[2].getText(), aProfiles[1].title, "The title is correct");
            assert.ok(aBoxItems[3].isA("sap.m.Text"), "The second control in the text");

            oView.destroy();
            fnDone();
        });
    });

    QUnit.test("valueArgument: return 0 when profiling is empty", function (assert) {
        // Arrange
        var fnDone = assert.async();
        Config.emit("/core/userPreferences/profiling", []);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.valueArgument().then(function (oValue) {
            // Assert
            var oExpectedValue = {
                value: 0,
                displayText: ""
            };
            assert.deepEqual(oValue, oExpectedValue, "The value is correct");
            fnDone();
        });
    });

    QUnit.test("valueArgument: return 1 when profiling is not empty", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.valueArgument().then(function (oValue) {
            // Assert
            var oExpectedValue = {
                value: 1,
                displayText: ""
            };
            assert.deepEqual(oValue, oExpectedValue, "The value is correct");
            fnDone();
        });
    });


    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
            aProfiles.forEach(function (oProfile) {
                assert.ok(oProfile.onSave.notCalled, oProfile.title + " profile: onSave was not called");
            });
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        }).then(fnDone);
    });

    QUnit.test("onSave: resolve when all profiles are resolved", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function () {
            // Assert
            aProfiles.forEach(function (oProfile) {
                assert.ok(oProfile.onSave.calledOnce, oProfile.title + " profile: onSave was called");
            });
            oViewInstance.destroy();
        }, function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onSave: reject when one of profiles is rejected", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oViewInstance;
        this.oFakeProfileWithPromise.onSave = sinon.stub().returns(Promise.reject());
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function () {
            // Assert
            assert.ok(false, "The promise should be rejected");
            oViewInstance.destroy();
        }, function () {
            assert.ok(true, "The promise should be rejected");
            aProfiles.forEach(function (oProfile) {
                assert.ok(oProfile.onSave.calledOnce, oProfile.title + " profile: onSave was called");
            });
            assert.ok(this.fnLogErrorSpy.calledOnce, "the error message should be logged");
            oViewInstance.destroy();
        }.bind(this)).then(fnDone);
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        aProfiles.forEach(function (oProfile) {
            assert.ok(oProfile.onCancel.notCalled, oProfile.title + " profile: onCancel was not called");
        });
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aProfiles = [this.oFakeProfileWithJQuery, this.oFakeProfileWithPromise];
        Config.emit("/core/userPreferences/profiling", aProfiles);
        // Act
        var oContract = UserProfilingEntry.getEntry();
        oContract.contentFunc().then(function (oView) {
            oContract.onCancel();
            // Assert
            aProfiles.forEach(function (oProfile) {
                assert.ok(oProfile.onCancel.calledOnce, oProfile.title + " profile: onCancel was called");
            });
            oView.destroy();
        }).then(fnDone);
    });


});
