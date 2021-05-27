// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/mvc/XMLView",
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsProfiling",
    "sap/ushell/resources"
], function (XMLView, Log, UsageAnalyticsProfiling, resources) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("UserAccountEntry", {
        beforeEach: function () {
            this.fnLogWarningSpy = sinon.spy(Log, "warning");

            this.oUser = {
                getTrackUsageAnalytics: sinon.stub()
            };
            this.oLegalText = "Some Text";
            this.oAnalyticsService = {
                getLegalText: sinon.stub().returns(this.oLegalText),
                setTrackUsageAnalytics: sinon.stub().returns(Promise.resolve())
            };

            sap.ushell.Container = {
                getUser: sinon.stub().returns(this.oUser),
                getService: sinon.stub().returns(this.oAnalyticsService)
            };
        },
        afterEach: function () {
            this.fnLogWarningSpy.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Check contract property", function (assert) {
        // Act
        var oContract = UsageAnalyticsProfiling.getProfiling();
        // Assert
        assert.equal(oContract.id, "usageAnalytics", "id is correct");
        assert.equal(oContract.entryHelpID, "usageAnalytics", "entryHelpID is correct");
        assert.equal(oContract.title, resources.i18n.getText("usageAnalytics"), "title is correct");

        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("contentFunc: create userPrefUsageAnalyticsSelector view", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oExpectedView = {
                id: "userPrefUsageAnalyticsSelector",
                viewName: "sap.ushell.components.shell.Settings.userProfiling.UsageAnalyticsSelector"
            },
            oExpectedModelData = {
                isTrackingUsageAnalytics: true,
                legalText: this.oLegalText
            };

        this.oUser.getTrackUsageAnalytics.returns(oExpectedModelData.isTrackingUsageAnalytics);
        // Act
        var oContract = UsageAnalyticsProfiling.getProfiling();
        oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "view is returned");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpectedModelData, "the correct model is created");
            assert.ok(oView.getModel("i18n"), "i18n model was set");
            oView.destroy();
            fnDone();
        });

    });

    QUnit.test("onSave: resolve promise when view was not created", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        var oContract = UsageAnalyticsProfiling.getProfiling();
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
        var oViewInstance;
        this.oUser.getTrackUsageAnalytics.returns(false);
        // Act
        var oContract = UsageAnalyticsProfiling.getProfiling();
        oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/isTrackingUsageAnalytics", true);
            return oContract.onSave();
        }).then(function () {
            // Assert
            assert.ok(this.oAnalyticsService.setTrackUsageAnalytics.calledOnce, "setTrackUsageAnalytics of service was called");
            assert.deepEqual(this.oAnalyticsService.setTrackUsageAnalytics.getCall(0).args, [true], "correct value is set");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        }).then(fnDone);
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        // Act
        var oContract = UsageAnalyticsProfiling.getProfiling();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var isTrackingUsageAnalytics = true;
        this.oUser.getTrackUsageAnalytics.returns(isTrackingUsageAnalytics);

        var oContract = UsageAnalyticsProfiling.getProfiling();
        oContract.contentFunc().then(function (oView) {
            var oModel = oView.getModel();
            oModel.setProperty("/isTrackingUsageAnalytics", !isTrackingUsageAnalytics);
            // Act
            oContract.onCancel();
            // Assert
            assert.equal(oModel.getProperty("/isTrackingUsageAnalytics"), isTrackingUsageAnalytics, "onCancel reset the isTrackingUsageAnalytics property");
            oView.destroy();
        }).then(fnDone);
    });


});
