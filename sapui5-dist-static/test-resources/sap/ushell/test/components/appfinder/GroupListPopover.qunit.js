// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.GroupListPopover
 */
sap.ui.require([
    "sap/base/util/includes",
    "sap/ui/core/Control",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/JSView",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
], function (includes, Control, Controller, JSView, JSONModel) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.components.appfinder.GroupListPopover", {
        beforeEach: function (assert) {
            var done = assert.async();

            this.oEndButton = {
                setVisible: sandbox.stub()
            };
            this.oPopover = {
                removeAllContent: sandbox.stub(),
                setContentHeight: sandbox.stub(),
                setVerticalScrolling: sandbox.stub(),
                setHorizontalScrolling: sandbox.stub(),
                addContent: sandbox.stub(),
                getContent: sandbox.stub().returns([]),
                getBeginButton: sandbox.stub(),
                getEndButton: sandbox.stub().returns(this.oEndButton),
                setTitle: sandbox.stub(),
                setCustomHeader: sandbox.stub(),
                close: sandbox.stub()
            };

            sap.ushell.bootstrap("local").then(function () {
                Controller.create({
                    name: "sap.ushell.components.appfinder.GroupListPopover"
                }).then(function (oController) {
                    this.oController = oController;

                    this.oController.oPopoverModel = new JSONModel({
                        userGroupList: [
                            { selected: true, initiallySelected: false },
                            { selected: false, initiallySelected: true }
                        ]
                    });

                    done();
                }.bind(this));
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
            this.oController.destroy();

            sandbox.restore();
        }
    });

    QUnit.test("okButtonHandler Test", function (assert) {
        var oReturnData;

        var oView = {
            oPopover: this.oPopover,
            deferred: {
                resolve: function (d) {
                    oReturnData = d;
                }
            }
        };
        this.oController.getView = function () {
            return oView;
        };
        this.oController.okButtonHandler(jQuery.Event("click"));

        assert.strictEqual(oReturnData.addToGroups.length, 1);
        assert.strictEqual(oReturnData.removeFromGroups.length, 1);
        assert.strictEqual(oReturnData.newGroups.length, 0);
        assert.equal(this.oPopover.close.callCount, 1);

        oView.newGroupInput = {
            getValue: function () {
                return "group name";
            }
        };

        this.oController.okButtonHandler(jQuery.Event("click"));
        assert.strictEqual(oReturnData.addToGroups.length, 1);
        assert.strictEqual(oReturnData.removeFromGroups.length, 1);
        assert.strictEqual(oReturnData.newGroups.length, 1);
    });

    QUnit.test("checkboxClickHandler Test", function (assert) {
        // Arrange
        var oView = {
            getViewData: function () {
                return {
                    sourceContext: {
                        sPath: "NOTHING"
                    }
                };
            }
        };
        this.oController.getView = function () {
            return oView;
        };

        sandbox.stub(this.oController, "getGroupsBeforeChanges").returns([
            "g1"
        ]);

        sandbox.stub(this.oController, "getGroupsAfterChanges").returns([
            {
                selected: true,
                oGroup: {
                    object: {
                        id: "g1"
                    }
                }
            }, {
                selected: true,
                oGroup: {
                    object: {
                        id: "g2"
                    }
                }
            }
        ]);

        sandbox.stub(sap.ushell.Container, "getService").returns({
            isGroupLocked: function () {
                return false;
            },
            getGroupId: function () {
                return "g2";
            }
        });

        var oList = {
            getModel: function () {
                return "m";
            }
        };

        var oGetParameterStub = sandbox.stub();
        oGetParameterStub.withArgs("selected").returns(true);

        var oEvent = {
            getSource: sandbox.stub().returns(oList),
            getParameter: oGetParameterStub
        };

        var AddRemoveTileFromGroupStub = sandbox.stub(this.oController, "addRemoveTileFromGroup").returns({});

        // Act
        this.oController.checkboxClickHandler(oEvent);

        // Assert
        assert.strictEqual(AddRemoveTileFromGroupStub.callCount, 1);
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][0], "/userGroupList/0");
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][1], "m");
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][2], true);
    });

    QUnit.test("_closeButtonHandler Test", function (assert) {
        var oRejectStub = sandbox.stub();
        var oDeferred = {
            reject: oRejectStub
        };

        var oView = {
            oPopover: this.oPopover,
            deferred: oDeferred
        };

        this.oController.getView = function () {
            return oView;
        };

        // Act
        this.oController._closeButtonHandler(jQuery.Event("click"));

        // Assert
        assert.strictEqual(this.oPopover.close.callCount, 1);
        assert.strictEqual(oRejectStub.callCount, 1);
    });

    QUnit.test("_navigateToCreateNewGroupPane Test", function (assert) {
        this.oPopover.getBeginButton.returns({
            setText: sandbox.stub()
        });

        this.oPopover.getEndButton.returns({
            setText: sandbox.stub(),
            setVisible: sandbox.stub()
        });

        var oSetFooterVisibilityStub = sandbox.spy(this.oController, "_setFooterVisibility");
        var oView = {
            oPopover: this.oPopover,
            _getNewGroupHeader: sandbox.stub(),
            _getNewGroupInput: sandbox.stub().returns({
                focus: sandbox.stub()
            }),
            getViewData: function () {
                return {singleGroupSelection: true};
            }
        };
        this.oController.getView = function () {
            return oView;
        };

        this.oController._navigateToCreateNewGroupPane();
        assert.strictEqual(this.oPopover.removeAllContent.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.callCount, 1);
        assert.strictEqual(this.oPopover.setCustomHeader.callCount, 1);
        assert.strictEqual(this.oPopover.setContentHeight.callCount, 1);
        assert.strictEqual(this.oPopover.getEndButton.callCount, 2);
        assert.strictEqual(this.oPopover.getBeginButton.callCount, 0);
        assert.strictEqual(oSetFooterVisibilityStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.args[0][0], true);

    });

    QUnit.test("_afterCloseHandler Test", function (assert) {
        // Arrange
        var oViewDestroyStub = sandbox.stub();

        var oView = {
            destroy: oViewDestroyStub,
            getViewData: function () {
                return {
                    catalogModel: {
                        getProperty: function () {
                            return [];
                        }
                    },
                    catalogController: {
                        prepareDetailedMessage: function () {
                        }
                    }
                };
            }
        };

        this.oController.getView = function () {
            return oView;
        };

        this.oController.setSelectedStart([]);

        // Act
        this.oController._afterCloseHandler();

        // Assert
        assert.strictEqual(oViewDestroyStub.callCount, 1);
    });

    QUnit.test("_backButtonHandler Test", function (assert) {
        this.oPopover.getBeginButton.returns({
            setText: sandbox.stub()
        });

        var oSetFooterVisibilityStub = sandbox.stub(this.oController, "_setFooterVisibility");

        var oSetValueStub = sandbox.stub();
        var oListContainer = {};

        var oView = {
            oPopover: this.oPopover,
            _getNewGroupInput: sandbox.stub().returns({
                setValue: oSetValueStub
            }),
            getViewData: function () {
                return {singleGroupSelection: true};
            },
            _getListContainer: function () {
                return oListContainer;
            }
        };
        this.oController.getView = function () {
            return oView;
        };

        this.oController._backButtonHandler();
        assert.strictEqual(this.oPopover.removeAllContent.callCount, 1);
        assert.strictEqual(this.oPopover.setVerticalScrolling.callCount, 1);
        assert.strictEqual(this.oPopover.setHorizontalScrolling.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.callCount, 1);
        assert.strictEqual(this.oPopover.addContent.firstCall.args[0], oListContainer);
        assert.strictEqual(this.oPopover.setTitle.callCount, 1);
        assert.strictEqual(this.oPopover.setCustomHeader.callCount, 1);
        assert.strictEqual(oSetValueStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.callCount, 1);
        assert.strictEqual(oSetFooterVisibilityStub.args[0][0], false);
    });

    QUnit.module("sap.ushell.components.appfinder.GroupListPopover", {
        beforeEach: function (assert) {
            var done = assert.async();

            sap.ushell.bootstrap("local").then(function () {
                Controller.create({
                    name: "sap.ushell.components.appfinder.GroupListPopover"
                }).then(function (oController) {
                    this.oController = oController;

                    done();
                }.bind(this));
            }.bind(this));
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            delete sap.ushell.Container;
            this.oController.destroy();

            sandbox.restore();
        }
    });

    //Test if click on displayListItem add and remove tile from group.
    QUnit.test("groupListItemClickHandler Test", function (assert) {
        var oList = {};

        var oListItem = {
            data: sandbox.stub().returns(false),
            setSelected: sandbox.stub(),
            getSelected: sandbox.stub().returns(true),
            getBindingContextPath: sandbox.stub().returns("p"),
            getModel: sandbox.stub().returns("m")
        };

        var oEvent = {
            getSource: sandbox.stub().returns(oList),
            getParameter: sandbox.stub().withArgs("listItem").returns(oListItem)
        };

        var AddRemoveTileFromGroupStub = sandbox.stub(this.oController, "addRemoveTileFromGroup").returns({});
        this.oController.groupListItemClickHandler(oEvent);

        assert.strictEqual(AddRemoveTileFromGroupStub.callCount, 1);
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][0], "p");
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][1], "m");
        assert.strictEqual(AddRemoveTileFromGroupStub.args[0][2], true);
    });

    QUnit.module("UI5 lifecycle handling", {
        beforeEach: function (assert) {
            this.oRegisterSpy = sandbox.spy(Control.prototype, "register");
            this.oDeregisterSpy = sandbox.spy(Control.prototype, "deregister");

            var done = assert.async();

            sap.ushell.bootstrap("local").then(done);
        },
        afterEach: function (assert) {
            var oControl;
            for (var i = 0; i < this.oRegisterSpy.callCount; i++) {
                oControl = this.oRegisterSpy.getCall(i).thisValue;

                assert.ok(includes(this.oDeregisterSpy.thisValues, oControl), oControl.getId() + " (" + oControl.getMetadata().getName() + ") has been destroyed.");
            }
            sandbox.restore();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("The view and all controls are correctly destroyed", function () {
        // Arrange
        return JSView.create({
            viewName: "sap.ushell.components.appfinder.GroupListPopover",
            viewData: {
                enableHideGroups: false
            }
        }).then(function (oView) {
            // Act
            oView.destroy();

            // Assert
            // Done in afterEach
        });
    });

    QUnit.test("The view and all controls are correctly destroyed if enableHideGroups = true", function () {
        // Arrange
        return JSView.create({
            viewName: "sap.ushell.components.appfinder.GroupListPopover",
            viewData: {
                enableHideGroups: true
            }
        }).then(function (oView) {
            // Act
            oView.destroy();

            // Assert
            // Done in afterEach
        });
    });
});
