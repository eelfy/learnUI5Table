// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/components/shell/Settings/UserSettings.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/base/Log",
    "sap/base/util/UriParameters",
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/ushell/utils/WindowUtils",
    "sap/m/Text",
    "sap/ushell/components/shell/Settings/ErrorMessageHelper",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/message/Message"
], function (
    UserSettingsController,
    Controller,
    JSONModel,
    Device,
    Log,
    UriParameters,
    resources,
    EventHub,
    ushellUtils,
    windowUtils,
    Text,
    ErrorMessageHelper,
    XMLView,
    Message
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("The onInit function", {
        beforeEach: function (assert) {
            var done = assert.async();

            Device.system.phone = false;

            this.fnByIdStub = sandbox.stub();
            var oView = {
                byId: this.fnByIdStub
            };

            this.oUserSettingList = {
                addEventDelegate: sandbox.spy(),
                setSelectedItem: sandbox.spy(),
                getItems: sandbox.stub()
            };

            this.fnByIdStub.withArgs("userSettingEntryList").returns(this.oUserSettingList);

            this.oOrientationAttachHandlerStub = sandbox.stub(Device.orientation, "attachHandler");

            Controller.create({
                name: "sap.ushell.components.shell.Settings.UserSettings"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView").returns(oView);
                done();
            }.bind(this));
        },

        afterEach: function () {
            this.oController.destroy();
            this.oController = null;

            this.oUserSettingList = null;
            this.oOrientationAttachHandlerStub.restore();
            sandbox.restore();

        }
    });

    QUnit.test("Check all listener is added", function (assert) {
        // Arrange
        var oDialog = {
            addEventDelegate: sandbox.spy()
        };
        this.fnByIdStub.withArgs("userSettingsDialog").returns(oDialog);

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.fnByIdStub.calledTwice, "addEventDelegate for userSettingEntryList and userSettingsDialog");
        //userSettingEntryList
        assert.ok(this.oUserSettingList.addEventDelegate.calledOnce, "addEventDelegate for userSettingEntryList was added");
        assert.ok(!!this.oUserSettingList.addEventDelegate.getCall(0).args[0].onAfterRendering,
            "onAfterRendering listener for userSettingEntryList was added");
        //userSettingsDialog
        assert.ok(oDialog.addEventDelegate.calledOnce, "addEventDelegate for userSettingsDialog was added");
        assert.ok(!!oDialog.addEventDelegate.getCall(0).args[0].onkeydown, "onkeydown listener for userSettingsDialog was added");

        assert.ok(this.oOrientationAttachHandlerStub.calledOnce, "A function was attached to the orientation change event of the device.");
    });

    QUnit.test("_listAfterRendering load values for all entry", function (assert) {
        // Arrange
        var aEntries = [
            {
                getBindingContextPath: sandbox.spy(),
                getDomRef: sandbox.stub().returns({
                    focus: sandbox.spy()
                })
            },
            {
                getBindingContextPath: sandbox.spy(),
                getDomRef: sandbox.stub().returns({
                    focus: sandbox.spy()
                })
            }
        ];
        this.oUserSettingList.getItems.returns(aEntries);
        var oStub = sandbox.stub(this.oController, "_setEntryValueResult");
        sandbox.stub(this.oController, "_toDetail");
        // Act
        this.oController._listAfterRendering();
        // Assert
        assert.equal(oStub.callCount, aEntries.length, "update values for all entries");
    });

    QUnit.test("_listAfterRendering navigate to the first entry if device is not phone", function (assert) {
        // Arrange
        var aEntries = [
            {
                getBindingContextPath: sandbox.spy(),
                getDomRef: sandbox.stub().returns({
                    focus: sandbox.spy()
                })
            },
            {
                getBindingContextPath: sandbox.spy(),
                getDomRef: sandbox.stub().returns({
                    focus: sandbox.spy()
                })
            }
        ];
        this.oUserSettingList.getItems.returns(aEntries);
        sandbox.stub(this.oController, "_setEntryValueResult");
        var oStub = sandbox.stub(this.oController, "_toDetail");
        // Act
        this.oController._listAfterRendering();
        // Assert
        assert.ok(oStub.calledOnce, "_toDetail was called in after rendering for not mobile devices");
        assert.deepEqual(oStub.getCall(0).args, [ aEntries[0] ], "_toDetail was called with the first entry");

        assert.ok(this.oUserSettingList.setSelectedItem.calledOnce, "setSelectedItem was called in after rendering for not mobile devices");
        assert.deepEqual(this.oUserSettingList.setSelectedItem.getCall(0).args, [ aEntries[0] ], "_toDetail was called with the first entry");

        assert.ok(aEntries[0].getDomRef.calledOnce, "focus was set for the first entry");
        assert.ok(aEntries[1].getDomRef.notCalled, "focus was not called for other entries");

    });

    QUnit.test("_listAfterRendering don't navigate to entry if device is phone", function (assert) {
        // Arrange
        Device.system.phone = true;
        var aEntries = [
            {
                getBindingContextPath: sandbox.spy(),
                getDomRef: sandbox.stub().returns({
                    focus: sandbox.spy()
                })
            }
        ];
        this.oUserSettingList.getItems.returns(aEntries);
        sandbox.stub(this.oController, "_setEntryValueResult");
        var oStub = sandbox.stub(this.oController, "_toDetail");
        // Act
        this.oController._listAfterRendering();
        // Assert
        assert.ok(oStub.notCalled, "_toDetail was not called for mobile devices");
        assert.ok(this.oUserSettingList.setSelectedItem.notCalled, "setSelectedItem was not called for mobile devices");
        assert.ok(aEntries[0].getDomRef.notCalled, "focus was not called");
    });

    QUnit.test("close dialog on ESC key down", function (assert) {
        // Arrange
        var oEvent = {
            keyCode: 27
        };
        var oStub = sandbox.stub(this.oController, "_handleCancelButtonPress");
        // Act
        this.oController._keyDown(oEvent);
        // Assert
        assert.ok(oStub.calledOnce, "cancel handler was called");
    });

    QUnit.module("valueResult handling", {
        beforeEach: function (assert) {
            var done = assert.async();

            var oEntry = {
                title: "test"
            };
            this.oModel = new JSONModel({});
            this.oModel.setProperty("/entries", [ oEntry ]);
            var oView = {
                getModel: sandbox.stub().returns(this.oModel)
            };

            this.oLogErrorSpy = sandbox.spy(Log, "error");

            Controller.create({
                name: "sap.ushell.components.shell.Settings.UserSettings"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView").returns(oView);
                done();
            }.bind(this));
        },

        afterEach: function () {
            this.oLogErrorSpy.restore();
            this.oController.destroy();
            this.oController = null;
            sandbox.restore();
        }
    });


    QUnit.test("set valueResult empty string when no valueArgument is defined", function (assert) {
        // Arrange
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, "", "empty string is set as valueResult");
    });

    QUnit.test("don't update model if valueResult is not empty and valueArgument is not function", function (assert) {
        // Arrange
        var sValueResult = "testResult";
        this.oModel.setProperty("/entries/0/valueResult", sValueResult);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, sValueResult, "correct valueResult value");
        assert.ok(oSetPropertySpy.notCalled, "setProperty was not called");
    });

    QUnit.test("update valueResult with valueArgument value", function (assert) {
        // Arrange
        var sValueResult = "valueArgumentValue";
        this.oModel.setProperty("/entries/0/valueArgument", sValueResult);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, sValueResult, "correct valueResult value");
        assert.ok(oSetPropertySpy.calledOnce, "setProperty was called");
    });

    QUnit.test("update valueResult when valueArgument is function", function (assert) {
        // Arrange
        var sValueResult = "functionValue";
        var fnValueArgument = function () {
            var oDfd = new jQuery.Deferred();
            oDfd.resolve(sValueResult);
            return oDfd.promise();
        };
        this.oModel.setProperty("/entries/0/valueArgument", fnValueArgument);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, sValueResult, "correct valueResult value");
        assert.ok(oSetPropertySpy.calledTwice, "setProperty was called");
        assert.equal(oSetPropertySpy.getCall(0).args[1], resources.i18n.getText("genericLoading"), "correct valueResult value");
        assert.equal(oSetPropertySpy.getCall(1).args[1], sValueResult, "correct valueResult value");
    });

    QUnit.test("set error for valueResult when valueArgument is rejected", function (assert) {
        // Arrange
        var sValueResult = "functionValue";
        var fnValueArgument = function () {
            var oDfd = new jQuery.Deferred();
            oDfd.reject(sValueResult);
            return oDfd.promise();
        };
        this.oModel.setProperty("/entries/0/valueArgument", fnValueArgument);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, resources.i18n.getText("loadingErrorMessage"), "correct valueResult value");
        assert.ok(oSetPropertySpy.calledTwice, "setProperty was called");
        assert.equal(oSetPropertySpy.getCall(0).args[1], resources.i18n.getText("genericLoading"), "correct valueResult value");
        assert.equal(oSetPropertySpy.getCall(1).args[1], resources.i18n.getText("loadingErrorMessage"), "correct valueResult value");
    });

    QUnit.test("update valueResult and visibility when valueArgument returns object", function (assert) {
        // Arrange
        var sValueResult = "someText";
        var fnValueArgument = function () {
            var oDfd = new jQuery.Deferred();
            oDfd.resolve({
                value: false,
                displayText: sValueResult
            });
            return oDfd.promise();
        };
        this.oModel.setProperty("/entries/0/valueArgument", fnValueArgument);
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, sValueResult, "correct valueResult value");
        assert.equal(oEntry.visible, false, "visibility was updated");
    });

    QUnit.test("update valueResult when valueArgument return normal promise", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sValueResult = "promiseTest";
        var fnValueArgument = function () {
            return Promise.resolve(sValueResult);
        };
        this.oModel.setProperty("/entries/0/valueArgument", fnValueArgument);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        setTimeout(function () {
            var oEntry = this.oModel.getProperty("/entries/0");
            assert.equal(oEntry.valueResult, sValueResult, "correct valueResult value");
            assert.ok(oSetPropertySpy.calledTwice, "setProperty was called");
            fnDone();
        }.bind(this), 0);
    });

    QUnit.test("handle the case when error in the valueArgument function", function (assert) {
        // Arrange
        var fnValueArgument = function () {
            //simulate js runtime error
            var test = {}.test.test;
            return Promise.resolve(test);
        };
        this.oModel.setProperty("/entries/0/valueArgument", fnValueArgument);
        var oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");
        // Act
        this.oController._setEntryValueResult("/entries/0");
        // Assert
        var oEntry = this.oModel.getProperty("/entries/0");
        assert.equal(oEntry.valueResult, resources.i18n.getText("loadingErrorMessage"), "correct valueResult value");
        assert.ok(oSetPropertySpy.calledTwice, "setProperty was called");
        assert.equal(oSetPropertySpy.getCall(0).args[1], resources.i18n.getText("genericLoading"), "correct valueResult value");
        assert.equal(oSetPropertySpy.getCall(1).args[1], resources.i18n.getText("loadingErrorMessage"), "correct valueResult value");
        assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
    });

    QUnit.module("Content loading and navigation", {
        beforeEach: function (assert) {
            var done = assert.async();

            Device.system.phone = false;
            Device.system.tablet = false;

            this.fnByIdStub = sandbox.stub();
            this.oModel = new JSONModel({
                entries: []
            });
            var oView = {
                byId: this.fnByIdStub,
                getModel: sandbox.stub().returns(this.oModel)
            };

            this.oSplitApp = {
                getMode: sandbox.stub().returns("StretchCompressMode"),
                toDetail: sandbox.stub(),
                hideMaster: sandbox.spy(),
                addDetailPage: sandbox.stub()
            };
            this.fnByIdStub.withArgs("settingsApp").returns(this.oSplitApp);

            this.fnGenerateId = sandbox.stub(ushellUtils, "_getUid");

            Controller.create({
                name: "sap.ushell.components.shell.Settings.UserSettings"
            }).then(function (oController) {
                this.oController = oController;
                sandbox.stub(this.oController, "getView").returns(oView);
                done();
            }.bind(this));
        },

        afterEach: function () {
            this.oController.destroy();
            this.oController = null;

            this.oSplitApp = null;
            this.oModel = null;
            EventHub._reset();
            sandbox.restore();

        }
    });

    QUnit.test("pressHandler calls the correct method", function (assert) {
        // Arrange
        var oTestSelectedItem = {
            title: "helloWorld"
        };
        var oEvent = {
            getSource: sandbox.stub().returns({
                getSelectedItem: sandbox.stub().returns(oTestSelectedItem)
            })
        };
        var oStub = sandbox.stub(this.oController, "_toDetail");
        // Act
        this.oController._itemPress(oEvent);
        // Assert
        assert.ok(oStub.calledOnce, "item press handler called toDetail");
        assert.deepEqual(oStub.getCall(0).args, [ oTestSelectedItem ], "The selected item is used");
    });

    QUnit.test("navigate to already created view", function (assert) {
        // Arrange
        var oSelectedItem = {
            getBindingContextPath: sandbox.stub().returns("/entries/0")
        };
        this.oModel.setProperty("/entries/0", {
            title: "testTitle",
            contentResult: "wrapperId",
            id: "testId"
        });

        // Act
        this.oController._toDetail(oSelectedItem);

        // Assert
        assert.ok(this.oSplitApp.toDetail.calledOnce, "execute navigation in SplittApp");
        assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ "wrapperId" ], "The navigation to the correct detail page");
        assert.deepEqual(EventHub.last("UserSettingsOpened"), { "testId": true }, "event value was updated");
    });

    QUnit.test("create the view and navigate to created view", function (assert) {
        // Arrange
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0")
            },
            sFakeWrapperId = "sFakeWrapperId",
            oEntry = {
                title: "testTitle",
                id: "testId"
            };
        this.oModel.setProperty("/entries/0", oEntry);
        var oStub = sandbox.stub(this.oController, "_createEntryContent").returns({
            then: function (fnCallback) {
                fnCallback(sFakeWrapperId);
            }
        });
        // Act
        this.oController._toDetail(oSelectedItem);

        // Assert
        assert.ok(oStub.calledOnce, "_createEntryContent was called");
        assert.equal(this.oModel.getProperty("/entries/0/contentResult"), sFakeWrapperId, "contentResult was updated");
        assert.ok(this.oSplitApp.toDetail.calledOnce, "execute navigation in SplittApp");
        assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ sFakeWrapperId ], "The navigation to the correct detail page");
        assert.deepEqual(EventHub.last("UserSettingsOpened"), { "testId": true }, "event value was updated");
    });

    QUnit.test("Create view with error message when contentFunc is not defined", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0")
            },
            oEntry = {
                title: "testTitle",
                id: "testId"
            };
        this.oModel.setProperty("/entries/0", oEntry);
        var oSpy = sandbox.spy(this.oController, "_addErrorContentToWrapper");
        // Act
        this.oController._toDetail(oSelectedItem).then(function () {
            // Assert
            assert.ok(this.oSplitApp.addDetailPage.calledOnce, "detail page should be added");
            var oDetailPage = this.oSplitApp.addDetailPage.getCall(0).args[0];
            assert.ok(oSpy.calledOnce, "error content was added");
            assert.deepEqual(oSpy.getCall(0).args, [ resources.i18n.getText("userSettings.noContent"), oDetailPage ],
                "_addErrorContentToWrapper called with correct argument");
            assert.deepEqual(oDetailPage.getBusy(), false, "the busy indicator was set to false");
            assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ oDetailPage.getId() ], "The navigation to the correct detail page");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Create view with error message when contentFunc does not return control object", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0")
            },
            oEntry = {
                title: "testTitle",
                id: "testId",
                contentFunc: function () {
                    var oDfd = new jQuery.Deferred();
                    oDfd.resolve(null);
                    return oDfd.promise();
                }
            };
        this.oModel.setProperty("/entries/0", oEntry);
        var oSpy = sandbox.spy(this.oController, "_addErrorContentToWrapper");
        // Act
        this.oController._toDetail(oSelectedItem).then(function () {
            // Assert
            assert.ok(this.oSplitApp.addDetailPage.calledOnce, "detail page should be added");
            var oDetailPage = this.oSplitApp.addDetailPage.getCall(0).args[0];
            assert.ok(oSpy.calledOnce, "error content was added");
            assert.deepEqual(oSpy.getCall(0).args, [ resources.i18n.getText("loadingErrorMessage"), oDetailPage ],
                "_addErrorContentToWrapper called with correct argument");
            assert.deepEqual(oDetailPage.getBusy(), false, "the busy indicator was set to false");
            assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ oDetailPage.getId() ], "The navigation to the correct detail page");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Create view and add content when contentFunc returns control object", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0")
            },
            oText = new Text(),
            oEntry = {
                title: "testTitle",
                id: "testId",
                contentFunc: function () {
                    var oDfd = new jQuery.Deferred();
                    oDfd.resolve(oText);
                    return oDfd.promise();
                }
            };
        this.oModel.setProperty("/entries/0", oEntry);
        // Act
        this.oController._toDetail(oSelectedItem).then(function () {
            // Assert
            assert.ok(this.oSplitApp.addDetailPage.calledOnce, "detail page should be added");
            var oDetailPage = this.oSplitApp.addDetailPage.getCall(0).args[0],
                aContent = oDetailPage.getContent();
            assert.deepEqual(aContent[aContent.length - 1], oText, "correct content was added");
            assert.deepEqual(oDetailPage.getBusy(), false, "the busy indicator was set to false");
            assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ oDetailPage.getId() ], "The navigation to the correct detail page");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Create view and add content when contentFunc returns normal promise with control object", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0")
            },
            oText = new Text("someText"),
            oEntry = {
                title: "testTitle",
                id: "testId",
                contentFunc: function () {
                    return Promise.resolve(oText);
                }
            };
        this.oModel.setProperty("/entries/0", oEntry);
        // Act
        this.oController._toDetail(oSelectedItem).then(function () {
            // Assert
            assert.ok(this.oSplitApp.addDetailPage.calledOnce, "detail page should be added");
            var oDetailPage = this.oSplitApp.addDetailPage.getCall(0).args[0],
                aContent = oDetailPage.getContent();
            assert.deepEqual(aContent[aContent.length - 1], oText, "correct content was added");
            assert.deepEqual(oDetailPage.getBusy(), false, "the busy indicator was set to false");
            assert.deepEqual(this.oSplitApp.toDetail.getCall(0).args, [ oDetailPage.getId() ], "The navigation to the correct detail page");
            fnDone();
        }.bind(this));
    });


    QUnit.test("navigate when deice is mobile", function (assert) {
        // Arrange
        Device.system.phone = true;
        var oSelectedItem = {
                getBindingContextPath: sandbox.stub().returns("/entries/0"),
                setSelected: sandbox.stub()
            },
            oBackButton = {
                setVisible: sandbox.spy()
            };
        this.oModel.setProperty("/entries/0", {
            title: "testTitle",
            contentResult: "wrapperId",
            id: "testId"
        });

        this.oSplitApp.getMode = sandbox.stub().returns("ShowHideMode");
        this.fnByIdStub.withArgs("userSettingsNavBackButton").returns(oBackButton);


        // Act
        this.oController._toDetail(oSelectedItem);

        // Assert
        assert.ok(oSelectedItem.setSelected.calledOnce, "unselect item");
        assert.deepEqual(oSelectedItem.setSelected.getCall(0).args, [ false ], "unselect item");
        assert.ok(this.oSplitApp.hideMaster.calledOnce, "master p age was hidden");
        assert.ok(oBackButton.setVisible.calledOnce, "setVisible of the back button was called");
        assert.deepEqual(oBackButton.setVisible.getCall(0).args, [ true ], "show back button");
    });


    QUnit.test("correct updating the UserSettingsOpened event", function (assert) {
        // Arrange
        var oTestState = {
                "id1": true,
                "id10": true
            },
            oExpectedState = {
                "id1": true,
                "id10": true,
                "id5": true
            };
        EventHub.emit("UserSettingsOpened", oTestState);
        this.fnGenerateId.returns("id5");
        this.oModel.setProperty("/entries/5", {
            title: "testTitle"
        });

        // Act
        this.oController._emitEntryOpened("/entries/5");

        // Assert
        assert.deepEqual(EventHub.last("UserSettingsOpened"), oExpectedState, "UserSettingsOpened was updated correctly");
    });

    QUnit.module("Buttons handling", {
        beforeEach: function () {
            Device.system.phone = false;
            Device.system.tablet = false;

            this.oModel = new JSONModel({
                entries: []
            });

            this.fnResetChangedProperties = sandbox.spy();
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().returns(Promise.resolve({
                    error: this.oMessageErrorStub
                })),
                getUser: sandbox.stub().returns({
                    resetChangedProperties: this.fnResetChangedProperties
                })
            };

            this.oLogErrorSpy = sandbox.spy(Log, "error");

            this.oAddMessageSpy = sandbox.spy(ErrorMessageHelper, "addMessage");

            return XMLView.create({
                id: "settingsView",
                viewName: "sap.ushell.components.shell.Settings.UserSettings"
            }).then(function (oSettingsView) {
                this.oSettingsView = oSettingsView;

                this.oController = oSettingsView.getController();

                this.oSplitApp = oSettingsView.byId("settingsApp");
                sandbox.spy(this.oSplitApp, "backDetail");
                sandbox.stub(this.oSplitApp, "isMasterShown");
                sandbox.spy(this.oSplitApp, "showMaster");
                sandbox.spy(this.oSplitApp, "hideMaster");
                sandbox.spy(this.oSplitApp, "toMaster");

                this.oBackButton = oSettingsView.byId("userSettingsNavBackButton");
                sandbox.spy(this.oBackButton, "setVisible");

                this.oToggleButton = oSettingsView.byId("userSettingsMenuButton");
                sandbox.spy(this.oToggleButton, "setVisible");
                sandbox.spy(this.oToggleButton, "setPressed");
                sandbox.spy(this.oToggleButton, "setTooltip");

                this.oDialog = oSettingsView.byId("userSettingsDialog");
                sandbox.spy(this.oDialog, "close");

                oSettingsView.setModel(resources.i18nModel, "i18n");
                oSettingsView.setModel(this.oModel);
                oSettingsView.byId("userSettingsDialog").open();
            }.bind(this));
        },

        afterEach: function () {
            this.oSettingsView.destroy();
            EventHub._reset();

            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("back button press handler", function (assert) {
        // Arrange
        Device.system.phone = true;

        // Act
        this.oController._navBackButtonPressHandler();

        // Assert
        assert.ok(this.oSplitApp.backDetail.calledOnce, "backDetail was called");
        assert.ok(this.oBackButton.setVisible.calledOnce, "the back button visibility was changed");
        assert.deepEqual(this.oBackButton.setVisible.getCall(0).args, [ false ], "the correct visibility of the back button was set");
        assert.ok(this.oToggleButton.setVisible.notCalled, "the toggle button visibility was not changed");

    });

    QUnit.test("toggle button was press when master page is hidden", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait;
        Device.orientation.portrait = true;
        this.oSplitApp.isMasterShown.returns(false);
        this.oToggleButton.setTooltip.reset();
        // Act
        this.oController._navToggleButtonPressHandler();

        // Assert
        assert.ok(this.oSplitApp.showMaster.calledOnce, "master page should be shown");
        assert.ok(this.oBackButton.setVisible.notCalled, "the back button visibility was not changed");
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ true ], "the correct visibility of the toggle button was set");
        assert.ok(this.oToggleButton.setPressed.calledOnce, "the toggle button press state was set");
        assert.deepEqual(this.oToggleButton.setPressed.getCall(0).args, [ true ], "The toggle button should be shown as pressed");
        assert.ok(this.oToggleButton.setTooltip.calledOnce, "the toggle button tooltip was set");
        assert.deepEqual(
            this.oToggleButton.setTooltip.getCall(0).args,
            [ resources.i18n.getText("ToggleButtonHide") ],
            "the correct tooltip was set"
        );

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
    });

    QUnit.test("toggle button was press when master page is shown", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait;
        Device.orientation.portrait = true;
        this.oSplitApp.isMasterShown.returns(true);
        this.oToggleButton.setTooltip.reset();
        // Act
        this.oController._navToggleButtonPressHandler();

        // Assert
        assert.ok(this.oSplitApp.hideMaster.calledOnce, "master page should be shown");
        assert.ok(this.oBackButton.setVisible.notCalled, "the back button visibility was not changed");
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ true ], "the correct visibility of the toggle button was set");
        assert.ok(this.oToggleButton.setPressed.calledOnce, "the toggle button press state was set");
        assert.deepEqual(this.oToggleButton.setPressed.getCall(0).args, [ false ], "The toggle button should be shown as not pressed");
        assert.ok(this.oToggleButton.setTooltip.calledOnce, "the toggle button tooltip was set");
        assert.deepEqual(
            this.oToggleButton.setTooltip.getCall(0).args,
            [ resources.i18n.getText("ToggleButtonShow") ],
            "the correct tooltip was set"
        );

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
    });

    QUnit.test("tablet in landscape mode ", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait,
            bOldOrientationLandscape = Device.orientation.landscape,
            bOldSystemTablet = Device.system.tablet;

        Device.orientation.portrait = false;
        Device.orientation.landscape = true;
        Device.system.tablet = true;

        // Act
        this.oController._updateHeaderButtonVisibility(false);

        // Assert
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ false ], "the correct visibility of the toggle button was set");

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
        Device.orientation.landscape = bOldOrientationLandscape;
        Device.system.tablet = bOldSystemTablet;
    });

    QUnit.test("tablet in portrait mode ", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait,
            bOldOrientationLandscape = Device.orientation.landscape,
            bOldSystemTablet = Device.system.tablet;

        Device.orientation.portrait = true;
        Device.orientation.landscape = false;
        Device.system.tablet = true;

        // Act
        this.oController._updateHeaderButtonVisibility(false);

        // Assert
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ true ], "the correct visibility of the toggle button was set");

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
        Device.orientation.landscape = bOldOrientationLandscape;
        Device.system.tablet = bOldSystemTablet;
    });

    QUnit.test("desktop in landscape mode ", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait,
            bOldOrientationLandscape = Device.orientation.landscape,
            bOldSystemDesktop = Device.system.desktop;

        Device.orientation.portrait = false;
        Device.orientation.landscape = true;
        Device.system.desktop = true;

        // Act
        this.oController._updateHeaderButtonVisibility(false);

        // Assert
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ false ], "the correct visibility of the toggle button was set");

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
        Device.orientation.landscape = bOldOrientationLandscape;
        Device.system.desktop = bOldSystemDesktop;
    });

    QUnit.test("tablet in portrait mode ", function (assert) {
        // Arrange
        var bOldOrientationPortrait = Device.orientation.portrait,
            bOldOrientationLandscape = Device.orientation.landscape,
            bOldSystemDesktop = Device.system.desktop;

        Device.orientation.portrait = true;
        Device.orientation.landscape = false;
        Device.system.desktop = true;

        // Act
        this.oController._updateHeaderButtonVisibility(false);

        // Assert
        assert.ok(this.oToggleButton.setVisible.calledOnce, "the toggle button visibility was set");
        assert.deepEqual(this.oToggleButton.setVisible.getCall(0).args, [ true ], "the correct visibility of the toggle button was set");

        // Clean-up
        Device.orientation.portrait = bOldOrientationPortrait;
        Device.orientation.landscape = bOldOrientationLandscape;
        Device.system.desktop = bOldSystemDesktop;
    });

    QUnit.test("press cancel when there is no entries", function (assert) {
        // Arrange
        EventHub.emit("UserSettingsOpened", {});
        // Act
        this.oController._handleCancelButtonPress();

        // Assert
        assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
        assert.ok(this.fnResetChangedProperties.calledOnce, "user change properties were reset");
        assert.ok(this.oDialog.close.calledOnce, "settings dialog should be closed");
        assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for dialog close");
    });

    QUnit.test("press cancel reset open enties", function (assert) {
        // Arrange
        var aEntries = [
            {
                onCancel: sandbox.spy()
            },
            {
                id: "1",
                onCancel: sandbox.spy()
            },
            {
                id: "2",
                onCancel: sandbox.spy()
            },
            {
                id: "3"
                //no onCancel
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "1": true,
            "3": true
        });
        // Act
        this.oController._handleCancelButtonPress();

        // Assert
        assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
        assert.ok(aEntries[0].onCancel.notCalled, "don't call onCancel for not opened entry");
        assert.ok(aEntries[1].onCancel.calledOnce, "call onCancel for opened entry");
        assert.ok(aEntries[2].onCancel.notCalled, "don't call onCancel for not opened entry");
        assert.ok(this.oDialog.close.calledOnce, "settings dialog should be closed");
        assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for dialog close");
    });

    QUnit.test("press cancel button on mobile", function (assert) {
        // Arrange
        Device.system.phone = true;
        // Act
        this.oController._handleCancelButtonPress();

        // Assert
        assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
        assert.ok(this.oSplitApp.toMaster.calledOnce, "toMaster was called");
        assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for dialog close");

        assert.deepEqual(
            this.oSplitApp.toMaster.getCall(0).args,
            [ "settingsView--userSettingMaster" ],
            "toMaster was called with correct argument"
        );
    });

    QUnit.test("press cancel button - js runtime error onCancel", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "1",
                onCancel: function () {
                    var test = {}.test;
                    test();
                }
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "1": true
        });
        // Act
        this.oController._handleCancelButtonPress();

        // Assert
        assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
        assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
        assert.ok(this.oDialog.close.calledOnce, "settings dialog should be closed");
        assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for dialog close");

    });

    QUnit.test("press save button - save only opened entries", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(Promise.resolve())
            },
            {
                id: "1",
                onSave: sandbox.stub().returns(Promise.resolve())
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "1": true
        });
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
            assert.ok(aEntries[0].onSave.notCalled, "don't call onSave for not opened entry");
            assert.ok(aEntries[1].onSave.calledOnce, "call onSave for opened entry");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 2, "resetChangedProperties was called for each item - and dialog close");
            assert.ok(this.oController._showSuccessMessageToast.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._handleSettingsDialogClose.calledOnce, "Message toast should be shown");
            assert.strictEqual(sap.ui.getCore().byId("userSettingsMessagePopover"), undefined, "Control with id userSettingsMessagePopover was not created");
        }.bind(this));
    });

    QUnit.test("press save button - onSave is jQuery promise", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "0": true
        });
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        this.oLogSpy = sandbox.spy(Log, "warning");
        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.equal(EventHub.last("UserSettingsOpened"), null, "UserSettingsOpened was reset");
            assert.ok(aEntries[0].onSave.calledOnce, "don't call onSave for not opened entry");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 2, "resetChangedProperties was called for each item - and dialog close");
            assert.ok(this.oController._showSuccessMessageToast.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._handleSettingsDialogClose.calledOnce, "Message toast should be shown");
            assert.ok(this.oLogSpy.calledWithMatch(sinon.match(/jQuery\.promise is used to save/)), "the warning message should be logged");
            assert.strictEqual(sap.ui.getCore().byId("userSettingsMessagePopover"), undefined, "Control with id userSettingsMessagePopover was not created");

            // Cleanup
            this.oLogSpy.restore();
        }.bind(this));
    });

    QUnit.test("press save button - browser should be refresh after save", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(Promise.resolve({ refresh: true }))
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "0": true
        });
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        sandbox.stub(windowUtils, "refreshBrowser");
        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            assert.ok(this.oController._showSuccessMessageToast.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._handleSettingsDialogClose.calledOnce, "Message toast should be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 2, "resetChangedProperties was called for each item - and dialog close");

            assert.ok(windowUtils.refreshBrowser.calledOnce, "the browser should be refreshed");
            assert.strictEqual(sap.ui.getCore().byId("userSettingsMessagePopover"), undefined, "Control with id userSettingsMessagePopover was not created");
        }.bind(this));
    });

    QUnit.test("press save button - error message should be shown if one of save operation fails", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(Promise.resolve())
            },
            {
                id: "1",
                onSave: sandbox.stub().returns(Promise.reject("test"))
            }
        ];
        var oChangedEntries = {
            "0": true,
            "1": true
        };
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 2, "resetChangedProperties was called for each item");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");
            assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - error message should be shown if js runtime error", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: function () {
                    //simulate runtime error
                    var test = {}.test;
                    test();
                }
            }
        ];
        var oChangedEntries = {
            "0": true
        };

        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for each item");

            assert.strictEqual(this.oAddMessageSpy.callCount, 1, "addMessage was called exactly once");
            assert.strictEqual(this.oAddMessageSpy.firstCall.args[0].getMessage(), resources.i18n.getText("userSettings.SavingError.WithMessage", "test is not a function"),
                "Function is called with expected message");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - mix native and jQuery promises", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(new jQuery.Deferred().reject("test").promise())
            },
            {
                id: "1",
                onSave: sandbox.stub().returns(Promise.reject("test"))
            }
        ];
        var oChangedEntries = {
            "0": true,
            "1": true
        };
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        this.oLogWarningSpy = sandbox.spy(Log, "warning");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 2, "resetChangedProperties was called for each item");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");
            assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
            assert.ok(this.oLogWarningSpy.callCount > 0, "warning should be logged");

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - setting rejects with undefined error", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(new jQuery.Deferred().reject().promise())
            }
        ];
        var oChangedEntries = {
            "0": true
        };
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        this.oLogWarningSpy = sandbox.spy(Log, "warning");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for each item");

            assert.strictEqual(this.oAddMessageSpy.callCount, 1, "addMessage was called exactly once");
            assert.strictEqual(this.oAddMessageSpy.firstCall.args[0].getMessage(), resources.i18n.getText("userSettings.SavingError.Undefined"), "Function is called with expected message");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");

            assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
            assert.ok(this.oLogWarningSpy.callCount > 0, "warning should be logged");
            this.oLogWarningSpy.restore();

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - setting rejects with Message", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(new jQuery.Deferred().reject(new Message({
                    message: "testMessage"
                })))
            }
        ];
        var oChangedEntries = {
            "0": true
        };
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        this.oLogWarningSpy = sandbox.spy(Log, "warning");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for each item");

            assert.strictEqual(this.oAddMessageSpy.callCount, 1, "addMessage was called exactly once");
            assert.strictEqual(this.oAddMessageSpy.firstCall.args[0].getMessage(), "testMessage", "Function is called with expected message");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");

            assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
            assert.ok(this.oLogWarningSpy.callCount > 0, "warning should be logged");
            this.oLogWarningSpy.restore();

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - setting rejects with multiple Messages", function (assert) {
        // Arrange
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(new jQuery.Deferred().reject([
                    new Message({
                        message: "firstMessage"
                    }),
                    new Message({
                        message: "secondMessage"
                    })
                ]))
            }
        ];
        var oChangedEntries = {
            "0": true
        };
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", oChangedEntries);
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        this.oLogWarningSpy = sandbox.spy(Log, "warning");

        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.deepEqual(EventHub.last("UserSettingsOpened"), oChangedEntries, "UserSettingsOpened should not be reset");

            assert.ok(this.oController._showSuccessMessageToast.notCalled, "Message toast should not be shown");
            assert.ok(this.oController._handleSettingsDialogClose.notCalled, "Message toast should not be shown");
            assert.strictEqual(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for each item");

            assert.strictEqual(this.oAddMessageSpy.callCount, 2, "addMessage was called twice");
            assert.strictEqual(this.oAddMessageSpy.firstCall.args[0].getMessage(), "firstMessage", "Function is called with expected message");
            assert.strictEqual(this.oAddMessageSpy.secondCall.args[0].getMessage(), "secondMessage", "Function is called with expected message");

            var oErrorMessagePopover = sap.ui.getCore().byId("userSettingsMessagePopover");
            assert.notEqual(oErrorMessagePopover, undefined, "Control with id userSettingsMessagePopover created");
            assert.strictEqual(oErrorMessagePopover.isA("sap.m.MessagePopover"), true, "Control with id userSettingsMessagePopover is a MessagePopover");

            assert.ok(this.oLogErrorSpy.calledOnce, "error should be logged");
            assert.ok(this.oLogWarningSpy.callCount > 0, "warning should be logged");
            this.oLogWarningSpy.restore();

            // Cleanup
            oErrorMessagePopover.destroy();
        }.bind(this));
    });

    QUnit.test("press save button - no changed entries", function (assert) {
        // Arrange
        EventHub.emit("UserSettingsOpened", {});
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        sandbox.spy(this.oController, "_executeEntrySave");
        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.strictEqual(sap.ui.getCore().byId("userSettingsMessagePopover"), undefined, "Control with id userSettingsMessagePopover was not created");
            assert.ok(this.oController._showSuccessMessageToast.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._handleSettingsDialogClose.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._executeEntrySave.notCalled, "No onSave functions were executed");
            assert.ok(this.fnResetChangedProperties.callCount, 1, "resetChangedProperties was called for dialog close");

        }.bind(this));
    });

    QUnit.test("press save button - browser should be refresh after save and new url parameter was added", function (assert) {
        // Arrange
        var aUrlParams = [
            {
                "sap-language": "EN"
            },
            {
                "sap-client": "010"
            }
        ];
        var aEntries = [
            {
                id: "0",
                onSave: sandbox.stub().returns(Promise.resolve({ refresh: true, urlParams: [ aUrlParams[0] ] }))
            },
            {
                id: "1",
                onSave: sandbox.stub().returns(Promise.resolve({ refresh: true, urlParams: [ aUrlParams[1] ] }))
            }
        ];
        this.oModel.setProperty("/entries", aEntries);
        EventHub.emit("UserSettingsOpened", {
            "0": true,
            "1": true
        });
        sandbox.spy(this.oController, "_showSuccessMessageToast");
        sandbox.spy(this.oController, "_handleSettingsDialogClose");
        sandbox.stub(windowUtils, "refreshBrowser");
        // Act
        return this.oController._handleSaveButtonPress().then(function () {
            // Assert
            assert.ok(this.oController._showSuccessMessageToast.calledOnce, "Message toast should be shown");
            assert.ok(this.oController._handleSettingsDialogClose.calledOnce, "Message toast should be shown");
            assert.ok(windowUtils.refreshBrowser.calledOnce, "the browser should be refreshed");
            assert.deepEqual(
                windowUtils.refreshBrowser.getCall(0).args[0],
                aUrlParams,
                "the browser should be refreshed with new query string"
            );
            assert.strictEqual(this.fnResetChangedProperties.callCount, 3, "resetChangedProperties was called for each item - and for dialog close");
            assert.strictEqual(sap.ui.getCore().byId("userSettingsMessagePopover"), undefined, "Control with id userSettingsMessagePopover was not created");
        }.bind(this));
    });

    QUnit.module("_handleMessagePopoverPress", {
        beforeEach: function () {
            this.oModel = new JSONModel({
                entries: []
            });

            this.fnResetChangedProperties = sandbox.spy();

            return XMLView.create({
                id: "settingsView",
                viewName: "sap.ushell.components.shell.Settings.UserSettings"
            })
                .then(function (oSettingsView) {
                    this.oSettingsView = oSettingsView;

                    this.oController = oSettingsView.getController();

                    oSettingsView.setModel(resources.i18nModel, "i18n");
                    oSettingsView.setModel(this.oModel);
                    oSettingsView.byId("userSettingsDialog").open();
                }.bind(this))
                .then(function () {
                    return this.oController._createMessagePopover();
                }.bind(this));
        },

        afterEach: function () {
            this.oSettingsView.destroy();

            sandbox.restore();
        }
    });

    QUnit.test("MessagePopover.toggle is called", function (assert) {
        // Arrange
        var oToggleSpy = sandbox.stub(this.oController.oMessagePopover, "toggle");
        var oButton = {};

        // Act
        this.oController._handleMessagePopoverPress({
            getSource: sandbox.stub().returns(oButton)
        });

        // Assert
        assert.strictEqual(oToggleSpy.callCount, 1, "Toggle was called exactly once");
        assert.deepEqual(oToggleSpy.firstCall.args, [oButton], "Toggle was called with the correct parameters");
    });
});
