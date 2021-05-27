// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.MenuBar.Component
 */
sap.ui.require([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/PostLoadingHeaderEnhancement/Component"
], function (JSONModel, PostLoadingHeaderEnhancementComponent) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function init", {
        beforeEach: function () {
            var fnOriginById = sap.ui.getCore().byId;
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId").callsFake(function (sId) {
                if (sId === "shell-header") {
                    return {
                        getModel: sandbox.stub(),
                        updateAggregation: sandbox.stub()
                    };
                }
                return fnOriginById(sId);
            });

            this.oShellModel = new JSONModel({
                notificationsCount: 5
            });
            sap.ushell.Container = {
                getRenderer: sandbox.stub().returns({
                    getShellController: sandbox.stub().returns({
                        getModel: sandbox.stub().returns(this.oShellModel)
                    }),
                    getShellConfig: sandbox.stub().returns({
                        moveAppFinderActionToShellHeader: false,
                        moveContactSupportActionToShellHeader: false,
                        moveGiveFeedbackActionToShellHeader: false
                    })
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("OverflowButton floating Number is populated, when floating number is part of the model", function (assert) {
        sandbox.stub(sap.ui, "require");
        // Act
        var oComponent = new PostLoadingHeaderEnhancementComponent();

        // Assert
        var sFloatingNumber = sap.ui.getCore().byId("endItemsOverflowBtn").getFloatingNumber();
        assert.equal(sFloatingNumber, 5, "The Floating Number is as expected");

        oComponent.destroy();
    });

    QUnit.test("Shell back button on RTL hash correct icon", function (assert) {
        sandbox.stub(sap.ui, "require");
        var oGetConfigurationStub = sandbox.stub(sap.ui.getCore().getConfiguration(), "getRTL").returns(true);
        var oComponent = new PostLoadingHeaderEnhancementComponent();

        var oBackBtn = sap.ui.getCore().byId("backBtn");
        assert.ok(oBackBtn.getIcon().indexOf("feeder-arrow") > 0, "Back button should be with Right Orientation when RTL is ON");

        oGetConfigurationStub.restore();
        oComponent.destroy();
    });
});
