// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.controller.PagesRuntime
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/ushell/components/pages/ActionMode",
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/renderers/fiori2/AccessKeysHandler"
], function (coreLibrary, MessageBox, MessageToast, VBox, ActionMode, resources, EventHub, Log, JSONModel, Page, Section, AccessKeysHandler) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.start();

    QUnit.module("The start function", {
        beforeEach: function () {
            this.oSetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({ setProperty: this.oSetPropertyStub });
            this.oGetViewStub = sinon.stub();
            this.oGetViewStub.returns({ getModel: this.oGetModelStub });
            this.oMockController = {
                getView: this.oGetViewStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sinon.stub();
            this.oSetTextStub = sinon.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub
            };
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Exit").returns(this.sMockText);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.start(this.oMockController);
        //Assert
        assert.strictEqual(ActionMode.oController, this.oMockController, "Controller was saved to the ActionMode");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", true], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", false], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
    });

    QUnit.test("Attaches the correct handler to AccessKeysHandler's editModeDone event", function (assert) {
        // Arrange
       var oAttachEventStub = sandbox.stub(AccessKeysHandler, "attachEvent");

        // Act
        ActionMode.start(this.oMockController);

        // Assert
        assert.strictEqual(oAttachEventStub.callCount, 1, "The function attachEvent has been called once.");
        assert.strictEqual(oAttachEventStub.firstCall.args.length, 3, "The function attachEvent has been called with the correct number of arguments.");
        assert.strictEqual(oAttachEventStub.firstCall.args[0], "editModeDone", "The function attachEvent has been called with the correct parameter.");
        assert.strictEqual(oAttachEventStub.firstCall.args[1], ActionMode.save, "The function attachEvent has been called with the correct parameter.");
        assert.strictEqual(oAttachEventStub.firstCall.args[2], ActionMode, "The function attachEvent has been called with the correct parameter.");
    });

    QUnit.module("The cancel function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.cancel();
        //Assert
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The save function", {
        beforeEach: function () {
            this.oCleanupStub = sandbox.stub(ActionMode, "_cleanup");
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode.save();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "Log.info was called once");
        assert.strictEqual(this.oCleanupStub.callCount, 1, "cleanup was called once");
    });

    QUnit.module("The _cleanup function", {
        beforeEach: function () {
            this.oSetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({ setProperty: this.oSetPropertyStub });
            this.oGetViewStub = sinon.stub();
            this.oGetViewStub.returns({ getModel: this.oGetModelStub });
            ActionMode.oController = {
                getView: this.oGetViewStub
            };

            this.oEmitStub = sandbox.stub(EventHub, "emit");

            this.oSetTooltipStub = sinon.stub();
            this.oSetTextStub = sinon.stub();
            this.oButtonMock = {
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub
            };
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("ActionModeBtn").returns(this.oButtonMock);

            this.sMockText = "sMockText";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Activate").returns(this.sMockText);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        //Act
        ActionMode._cleanup();
        //Assert
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/actionModeActive", false], "set property was called with the right parameters");
        assert.deepEqual(this.oEmitStub.getCall(0).args, ["enableMenuBarNavigation", true], "EventHub was called with the right parameters");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");

        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.sMockText, "setTooltip was called with the right parameters");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.sMockText, "setText was called with the right parameters");
    });

    QUnit.test("Detaches the correct handler from AccessKeysHandler's editModeDone event", function (assert) {
        // Arrange
        var oDetachEventStub = sandbox.stub(AccessKeysHandler, "detachEvent");

        // Act
        ActionMode._cleanup();

        // Assert
        assert.strictEqual(oDetachEventStub.callCount, 1, "The function detachEvent has been called once.");
        assert.strictEqual(oDetachEventStub.firstCall.args.length, 3, "The function detachEvent has been called with the correct number of arguments.");
        assert.strictEqual(oDetachEventStub.firstCall.args[0], "editModeDone", "The function detachEvent has been called with the correct parameter.");
        assert.strictEqual(oDetachEventStub.firstCall.args[1], ActionMode.save, "The function detachEvent has been called with the correct parameter.");
        assert.strictEqual(oDetachEventStub.firstCall.args[2], ActionMode, "The function detachEvent has been called with the correct parameter.");
    });

    QUnit.module("The addVisualization function", {
        beforeEach: function () {
            this.oCrossApplicationNavigation = {
                toExternal: sinon.stub()
            };
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().returns({
                    then: function (fnCallback) {
                        fnCallback(this.oCrossApplicationNavigation);
                    }.bind(this)
                })
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oModel = new JSONModel(),
            oModelStub = sinon.stub(oModel, "getProperty");

        oModelStub.withArgs("/pages/3/id").returns("some_page_id");
        oModelStub.withArgs("/pages/3/sections/1/id").returns("some_section_id");


        var oSource = {
            getBindingContext: function () {
                return {
                    getModel: sinon.stub().returns(oModel),
                    getPath: sinon.stub().returns("/pages/3/sections/1")
                };
            }
        };

        var expectedCallParameter = {
            target: {
                shellHash: "Shell-appfinder?&/catalog/{\"pageID\":\"some_page_id\",\"sectionID\":\"some_section_id\"}"
            }
        };
        //Act
        ActionMode.addVisualization(null, oSource, null);
        //Assert
        assert.strictEqual(sap.ushell.Container.getServiceAsync.callCount, 1, "getServiceAsync was called once");
        assert.strictEqual(sap.ushell.Container.getServiceAsync.getCall(0).args[0], "CrossApplicationNavigation", "CrossApplicationNavigation service was used");

        assert.strictEqual(this.oCrossApplicationNavigation.toExternal.callCount, 1, "toExternal method of service was called");
        assert.deepEqual(this.oCrossApplicationNavigation.toExternal.getCall(0).args, [expectedCallParameter], "Correct shell hash was used for navigation");
    });

    QUnit.module("The addSection function", {
        beforeEach: function () {
            this.oAddSectionStub = sandbox.stub().callsFake(function (iPageIndex, iSectionIndex) {
                var aSections = this.oModel.getProperty("/pages/" + iPageIndex + "/sections");
                aSections.splice(iSectionIndex, 0, {});
                this.oModel.setProperty("/pages/" + iPageIndex + "/sections", aSections);
            }.bind(this));

            ActionMode.oController = {
                getOwnerComponent: sandbox.stub().returns({
                    getPagesService: sandbox.stub().returns(Promise.resolve({ addSection: this.oAddSectionStub }))
                })
            };

            this.oModel = new JSONModel({
                pages: [{
                    sections: []
                }]
            });
            this.oVBox = new VBox();
            this.oVBox.setModel(this.oModel);
            this.oVBox.bindAggregation("items", {
                path: "/pages",
                factory: function () {
                    return new Page({
                        edit: true,
                        sections: {
                            path: "sections",
                            factory: function () {
                                return new Section({
                                    title: "{title}",
                                    editable: true
                                });
                            }
                        }
                    });
                }
            });

            this.oVBox.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oPage = this.oVBox.getItems()[0];
            this.oPage.focus();
            this.oClock = sandbox.useFakeTimers();
        },
        afterEach: function () {
            this.oVBox.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Adds a section on an empty page", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        ActionMode.addSection({}, this.oPage, { index: 0 }).then(function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 1, "The page now has exactly one section.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 0, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[0].byId("title-edit").getFocusDomRef(),
                "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.test("Adds a section between other sections", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "first Section" },
            { title: "second Section" }
        ]);

        // Act
        ActionMode.addSection({}, this.oPage, { index: 1 }).then(function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 3, "The page now has exactly three sections.");
            assert.strictEqual(this.oPage.getSections()[0].getTitle(), "first Section", "The first section is correct.");
            assert.strictEqual(this.oPage.getSections()[1].getTitle(), "", "The second section is correct.");
            assert.strictEqual(this.oPage.getSections()[2].getTitle(), "second Section", "The thrid section is correct.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 1, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[1].byId("title-edit").getFocusDomRef(),
                "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.test("Adds a section at the end", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "first Section" },
            { title: "second Section" }
        ]);

        // Act
        ActionMode.addSection({}, this.oPage, { index: 2 }).then(function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 3, "The page now has exactly three sections.");
            assert.strictEqual(this.oPage.getSections()[0].getTitle(), "first Section", "The first section is correct.");
            assert.strictEqual(this.oPage.getSections()[1].getTitle(), "second Section", "The second section is correct.");
            assert.strictEqual(this.oPage.getSections()[2].getTitle(), "", "The thrid section is correct.");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "addSection was called exactly once.");
            assert.strictEqual(this.oAddSectionStub.args[0][0], 0, "addSection was called with the correct page index.");
            assert.strictEqual(this.oAddSectionStub.args[0][1], 2, "addSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();
            this.oClock.tick(1);

            assert.strictEqual(document.activeElement, this.oPage.getSections()[2].byId("title-edit").getFocusDomRef(),
                "Focus is set correctly.");
            fnDone();
        }.bind(this));
    });

    QUnit.module("The deleteSection function", {
        beforeEach: function () {
            this.oDeleteSectionStub = sandbox.stub().callsFake(function (iPageIndex, iSectionIndex) {
                var aSections = this.oModel.getProperty("/pages/" + iPageIndex + "/sections");
                aSections.splice(iSectionIndex, 1);
                this.oModel.setProperty("/pages/" + iPageIndex + "/sections", aSections);
            }.bind(this));

            ActionMode.oController = {
                getOwnerComponent: sandbox.stub().returns({
                    getPagesService: sandbox.stub().returns(Promise.resolve({ deleteSection: this.oDeleteSectionStub }))
                })
            };

            sap.ushell.Container = {
                getServiceAsync: function () {
                    return Promise.resolve({
                        confirm: function (sMsg, fnCallBack) {
                            fnCallBack.call(this, MessageBox.Action.DELETE);
                        }.bind(this)
                    });
                }.bind(this)
            };

            this.oMessageToastStub = sandbox.stub(MessageToast, "show");

            this.oModel = new JSONModel({ pages: [{ sections: [] }] });
            this.oVBox = new sap.m.VBox();
            this.oVBox.setModel(this.oModel);
            this.oVBox.bindAggregation("items", {
                path: "/pages",
                factory: function () {
                    return new Page({
                        edit: true,
                        sections: {
                            path: "sections",
                            factory: function () {
                                return new Section({
                                    title: "{title}",
                                    editable: true
                                });
                            }
                        }
                    });
                }
            });

            this.oVBox.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oPage = this.oVBox.getItems()[0];
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Deletes the last section", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" }
        ]);
        sap.ui.getCore().applyChanges();
        var oSection = this.oPage.getSections()[0];
        oSection.byId("delete").focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 0 }).then(function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 0, "The page now has no sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.MessageToast.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 0, "deleteSection was called with the correct section index.");
            sap.ui.getCore().applyChanges();
            assert.strictEqual(document.activeElement, this.oPage.getFocusDomRef(),
                "Focus is set correctly.");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Deletes first section", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" }
        ]);
        sap.ui.getCore().applyChanges();
        var oSection = this.oPage.getSections()[0];
        oSection.byId("delete").focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 0 }).then(function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 1, "The page now has one section.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.MessageToast.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 0, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();

            assert.strictEqual(document.activeElement, aSections[0].getFocusDomRef(), "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.test("Deletes a section between other sections", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" },
            { title: "third Section" }
        ]);
        sap.ui.getCore().applyChanges();
        var oSection = this.oPage.getSections()[1];
        oSection.byId("delete").focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 1 }).then(function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.MessageToast.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 1, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();

            assert.strictEqual(document.activeElement, aSections[0].getFocusDomRef(), "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.test("Deletes a section at the end", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" },
            { title: "third Section" }
        ]);
        sap.ui.getCore().applyChanges();
        var oSection = this.oPage.getSections()[2];
        oSection.byId("delete").focus();

        // Act
        ActionMode.deleteSection({}, this.oPage.getSections()[2], { index: 2 }).then(function () {
            // Assert
            var aSections = this.oPage.getSections();
            assert.strictEqual(aSections.length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 1, "MessageToast shown.");
            assert.strictEqual(this.oMessageToastStub.args[0][0],
                resources.i18n.getText("PageRuntime.MessageToast.SectionDeleted"),
                "MessageToast shows the correct message.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 1, "deleteSection was called exactly once.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][0], 0, "deleteSection was called with the correct page index.");
            assert.strictEqual(this.oDeleteSectionStub.args[0][1], 2, "deleteSection was called with the correct section index.");
            this.oPage.invalidate();
            sap.ui.getCore().applyChanges();

            assert.strictEqual(document.activeElement, aSections[1].getFocusDomRef(), "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.test("Deletes a section but cancels the deletion", function (assert) {
        // Arrange
        sap.ushell.Container = {
            getServiceAsync: function () {
                return Promise.resolve({
                    confirm: function (sMsg, fnCallBack) {
                        fnCallBack.call(this, MessageBox.Action.CANCEL);
                    }.bind(this)
                });
            }.bind(this)
        };
        var fnDone = assert.async();
        this.oModel.setProperty("/pages/0/sections", [
            { title: "some Section" },
            { title: "second Section" }
        ]);
        this.oPage.invalidate();
        sap.ui.getCore().applyChanges();
        var oSection = this.oPage.getSections()[1];
        oSection.byId("delete").focus();

        // Act
        ActionMode.deleteSection({}, oSection, { index: 1 }).then(function () {
            // Assert
            assert.strictEqual(this.oPage.getSections().length, 2, "The page now has two sections.");
            assert.strictEqual(this.oMessageToastStub.callCount, 0, "MessageToast not shown.");
            assert.strictEqual(this.oDeleteSectionStub.callCount, 0, "deleteSection was not called.");

            var oFocusElement = oSection.byId("delete").getFocusDomRef();
            assert.strictEqual(document.activeElement, oFocusElement, "Focus is set correctly.");

            fnDone();
        }.bind(this));
    });

    QUnit.module("The resetSection function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oResetSectionStub = sandbox.stub();

            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({ resetSection: this.oResetSectionStub });
                    }.bind(this)
                };
            }.bind(this);

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oMockControl = {
            getBindingContext: function () {
                return {
                    getPath: function () {
                        return "/pages/0/sections/1";
                    }
                };
            }
        };

        //Act
        return ActionMode.resetSection({}, oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oResetSectionStub.callCount, 1, "resetSection was called once");
            assert.deepEqual(this.oResetSectionStub.getCall(0).args, [0, 1], "resetSection was called with the right parameters");

        }.bind(this));
    });

    QUnit.module("The changeSectionTitle function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oRenameSectionStub = sandbox.stub();

            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({ renameSection: this.oRenameSectionStub });
                    }.bind(this)
                };
            }.bind(this);

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        var oMockControl = {
            getBindingContext: function () {
                return {
                    getPath: function () {
                        return "/pages/0/sections/1";
                    }
                };
            },
            getProperty: function () {
                return "new Title";
            }
        };

        //Act
        return ActionMode.changeSectionTitle({}, oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oRenameSectionStub.callCount, 1, "renameSection was called once");
            assert.deepEqual(this.oRenameSectionStub.getCall(0).args, [0, 1, "new Title"], "renameSection was called with the right parameters");

        }.bind(this));
    });

    QUnit.module("The moveSection function", {
        beforeEach: function () {
            this.oController = {};

            this.oGetDraggedPathStub = sandbox.stub();
            this.oGetDroppedPathStub = sandbox.stub();

            this.oParameters = {
                draggedControl: {
                    getBindingContext: function () {
                        return {
                            getPath: this.oGetDraggedPathStub
                        };
                    }.bind(this)
                },
                droppedControl: {
                    getBindingContext: function () {
                        return {
                            getPath: this.oGetDroppedPathStub
                        };
                    }.bind(this)
                }
            };

            this.oMoveSectionStub = sandbox.stub().returns(Promise.resolve());

            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({ moveSection: this.oMoveSectionStub });
                    }.bind(this)
                };
            }.bind(this);

            this.oInvisibleMessageStub = sandbox.stub();
            this.oSource = {
                announceMove: this.oInvisibleMessageStub
            };

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Dropping a section before the next section does nothing", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/1");
        this.oParameters.dropPosition = "Before";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 0, "moveSection was not called");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 0, "announceMove was not called");

        }.bind(this));
    });

    QUnit.test("Dropping a section after the section before does nothing", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/2");
        this.oGetDroppedPathStub.returns("/pages/0/sections/1");
        this.oParameters.dropPosition = "After";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 0, "moveSection was not called");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 0, "announceMove was not called");

        }.bind(this));
    });

    QUnit.test("Dropping a section after another section calls moveSection", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/2");
        this.oParameters.dropPosition = "After";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 1, "moveSection was called once");
            assert.deepEqual(this.oMoveSectionStub.getCall(0).args, [0, 0, 3], "moveSection was called with the right parameters");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 1, "announceMove was called once");
        }.bind(this));
    });

    QUnit.test("Dropping a section before another section calls moveSection", function (assert) {
        //Arrange
        this.sMockPath = "/pages/0/sections/";

        this.oGetDraggedPathStub.returns("/pages/0/sections/0");
        this.oGetDroppedPathStub.returns("/pages/0/sections/2");
        this.oParameters.dropPosition = "Before";

        //Act
        return ActionMode.moveSection({}, this.oSource, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oMoveSectionStub.callCount, 1, "moveSection was called once");
            assert.deepEqual(this.oMoveSectionStub.getCall(0).args, [0, 0, 2], "moveSection was called with the right parameters");
            assert.strictEqual(this.oInvisibleMessageStub.callCount, 1, "announce was called once");

        }.bind(this));
    });

    QUnit.module("The sectionVisibilityChange function", {
        beforeEach: function () {
            this.oController = {};
            this.oParameters = {};

            this.oSetSectionVisibilityStub = sandbox.stub();

            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: function () {
                        return Promise.resolve({ setSectionVisibility: this.oSetSectionVisibilityStub });
                    }.bind(this)
                };
            }.bind(this);

            this.oMockControl = {
                getBindingContext: function () {
                    return {
                        getPath: function () {
                            return "/pages/0/sections/1";
                        }
                    };
                },
                getProperty: function () {
                    return true;
                }
            };

            ActionMode.oController = this.oController;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Was called correctly", function (assert) {
        //Arrange
        this.oParameters.visible = false;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 1, "setSectionVisibility was called once");
            assert.deepEqual(this.oSetSectionVisibilityStub.getCall(0).args, [0, 1, false], "setSectionVisibility was called with the right parameters");

        }.bind(this));
    });

    QUnit.test("Doesn't call setSectionVisibility when no visibility is provided", function (assert) {
        //Arrange
        this.oParameters.visible = undefined;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 0, "setSectionVisibility was not called");

        }.bind(this));
    });

    QUnit.test("Doesn't call setSectionVisibility when the controller is not set", function (assert) {
        //Arrange
        this.oParameters.visible = true;
        ActionMode.oController = undefined;

        //Act
        return ActionMode.changeSectionVisibility({}, this.oMockControl, this.oParameters).then(function () {
            //Assert
            assert.strictEqual(this.oSetSectionVisibilityStub.callCount, 0, "setSectionVisibility was not called");

        }.bind(this));
    });
});
