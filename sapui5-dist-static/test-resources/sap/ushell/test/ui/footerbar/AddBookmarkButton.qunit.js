// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AddBookmarkButton
 */
sap.ui.require([
    "sap/m/MessageBox",
    "sap/ui/core/mvc/View",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/AddBookmarkButton",
    "sap/ushell/ui/footerbar/SaveAsTile.controller"
], function (
    MessageBox,
    View,
    Config,
    resources,
    AddBookmarkButton,
    SaveAsTileController
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.ui.footerbar.AddBookmarkButton", {
        beforeEach: function () {
            sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(false);
            window.hasher = {
                getHash: sandbox.stub()
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oGetConfigurationStub = sandbox.stub().returns({});
            sap.ushell.renderers = {
                fiori2: {
                    RendererExtensions: {
                        getConfiguration: this.oGetConfigurationStub
                    }
                }
            };

            sandbox.stub(SaveAsTileController.prototype, "loadPersonalizedGroups");

            this.oAddBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
            this.oGetServiceAsyncStub.withArgs("Bookmark").resolves({
                addBookmark: this.oAddBookmarkStub
            });

            this.oInfoStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Message").resolves({
                info: this.oInfoStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
            delete sap.ushell.Container;
            delete sap.ushell.renderers;
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        // Arrange
        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getIcon(), "sap-icon://add-favorite", "Check dialog icon");
        assert.strictEqual(this.oButton.getText("text"), resources.i18n.getText("addToHomePageBtn"), "Check button title");
        assert.strictEqual(this.oButton.getEnabled(), true, "Check if button is enabled");
    });

    QUnit.test("Custom Url, serviceURL Test 1 - a simple string", function (assert) {
        var fnDone = assert.async();
        // Arrange
        this.oButton = new AddBookmarkButton({
            appData: {
                customUrl: "TestUrl",
                serviceUrl: "testServiceUrl",
                title: "TestTitle"
            }
        });

        this.oButton.showAddBookmarkDialog()
            .then(function () {
                this.oButton.oDialog.attachAfterClose(function () {
                    // Assert
                    assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "addBookmark was called exactly once.");
                    assert.strictEqual(this.oAddBookmarkStub.getCall(0).args[0].url, "TestUrl", "expected value for customUrl is: \"TestUrl\".");
                    assert.strictEqual(this.oAddBookmarkStub.getCall(0).args[0].serviceUrl, "testServiceUrl", "service URL plain string came back ok.");

                    fnDone();
                }.bind(this));

                // Act
                this.oButton.oDialog.getBeginButton().firePress();
            }.bind(this));

    });

    QUnit.test("Custom Url, serviceURL Test 2 - a function", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oButton = new AddBookmarkButton({
            appData: {
                customUrl: function () {
                    return "TestUrl";
                },
                serviceUrl: function () {
                    return "functionServiceUrl";
                },
                title: "TestTitle"
            }
        });

        this.oButton.showAddBookmarkDialog()
            .then(function () {
                this.oButton.oDialog.attachAfterClose(function () {
                    // Assert
                    assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "addBookmark was called exactly once.");
                    assert.strictEqual(this.oAddBookmarkStub.getCall(0).args[0].url, "TestUrl", "expected value for customUrl is: \"TestUrl\".");
                    assert.strictEqual(this.oAddBookmarkStub.getCall(0).args[0].serviceUrl, "functionServiceUrl", "service URL plain string came back ok.");

                    fnDone();
                }.bind(this));

                // Act
                this.oButton.oDialog.getBeginButton().firePress();
            }.bind(this));
    });

    QUnit.test("Bookmark button setEnabled in standalone application and renderers is undefined", function (assert) {
        // Arrange
        delete sap.ushell.renderers;

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), true, "Check if disabled - shell is in standalone state and renderers = undefined");
    });

    QUnit.test("Bookmark button setEnabled in standalone application and renderers.fiori2 is undefined", function (assert) {
        // Arrange
        delete sap.ushell.renderers.fiori2;

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), true, "Check if disabled - shell is in standalone state and renderers.fiori2 = undefined");
    });

    QUnit.test("Bookmark button Disabled in standalone state", function (assert) {
        // Check that the button is disabled and invisible if the state of the shell is "standalone"
        // Arrange
        this.oGetConfigurationStub.returns({
            appState: "standalone"
        });

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), false, "Check if disabled - shell is in standalone state");
        assert.strictEqual(this.oButton.getVisible(), true, "Check if visible - shell is in standalone state");
    });

    QUnit.test("Bookmark button Disabled in headerless state", function (assert) {
        // Check that the button is disabled and invisible if the state of the shell is "headerless"
        // Arrange
        this.oGetConfigurationStub.returns({
            appState: "headerless"
        });

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), false, "Check if disabled - shell is in headerless state");
        assert.strictEqual(this.oButton.getVisible(), true, "Check if visible - shell is in headerless state");
    });

    QUnit.test("Bookmark button Disabled in embedded state", function (assert) {
        // Check that the button is disabled and invisible if the state of the shell is "embedded"
        // Arrange
        this.oGetConfigurationStub.returns({
            appState: "embedded"
        });

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), false, "Check if disabled - shell is in embedded state");
        assert.strictEqual(this.oButton.getVisible(), true, "Check if visible - shell is in embedded state");
    });

    QUnit.test("Disable bookmark button when personalization is switched off", function (assert) {
        // Arrange
        this.oGetConfigurationStub.returns({
            enablePersonalization: false
        });

        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), false, "Check if disabled - personalization is off");
        assert.strictEqual(this.oButton.getVisible(), true, "Check if visible - personalization is off");
    });

    QUnit.test("showAddBookmarkDialog Test", function (assert) {
        var fnDone = assert.async();
        // Act
        this.oButton = new AddBookmarkButton();

        // Assert
        assert.strictEqual(this.oButton.getEnabled(), true, "Enabled");

        // Act
        this.oButton.showAddBookmarkDialog()
            .then(function () {

                // Assert
                var oDialogContent = sap.ui.getCore().byId("bookmarkFormId").getContent()[0].getContent();
                assert.strictEqual(oDialogContent[0].isA("sap.m.Label"), true, "Check first label type");
                assert.strictEqual(oDialogContent[0].getText(), resources.i18n.getText("previewFld"), "Check first label");
                var oTile = oDialogContent[1].getItems()[1];
                assert.strictEqual(oTile.isA("sap.ushell.ui.launchpad.Tile"), true, "Check tile exists");
                assert.strictEqual(oDialogContent[2].isA("sap.m.Label"), true, "Check form field type #1");
                assert.strictEqual(oDialogContent[2].getText(), " " + resources.i18n.getText("titleFld"), "Check form field value #1");
                assert.strictEqual(oDialogContent[3].isA("sap.m.Input"), true, "Check form field type #2");
                assert.strictEqual(oDialogContent[3].getValue(), "", "Check form field value #2");
                assert.strictEqual(oDialogContent[4].isA("sap.m.Label"), true, "Check form field type #3");
                assert.strictEqual(oDialogContent[4].getText(), resources.i18n.getText("subtitleFld"), "Check form field value #3");
                assert.strictEqual(oDialogContent[5].isA("sap.m.Input"), true, "Check form field type #4");
                assert.strictEqual(oDialogContent[5].getValue(), "", "Check form field value #4");
                assert.strictEqual(oDialogContent[6].isA("sap.m.Label"), true, "Check form field type #5");
                assert.strictEqual(oDialogContent[6].getText(),
                    resources.i18n.getText("tileSettingsDialog_informationField"), "Check form field value #5");
                assert.strictEqual(oDialogContent[7].isA("sap.m.Input"), true, "Check form field type #6");
                assert.strictEqual(oDialogContent[7].getValue(), "", "Check form field value #6");

                // Clean-up
                sap.ui.getCore().byId("bookmarkDialog").destroy();
                fnDone();
            });
    });

    QUnit.test("Mark title field as error when Title Field is empty and ok was pressed", function (assert) {
        var fnDone = assert.async();
        // Arrange
        this.oButton = new AddBookmarkButton();

        // Act
        this.oButton.showAddBookmarkDialog()
            .then(function () {

                // Assert
                var oDialogContent = sap.ui.getCore().byId("bookmarkFormId").getContent()[0].getContent(),
                    oTitleInput = oDialogContent[3],
                    oDialogOkButton = sap.ui.getCore().byId("bookmarkDialog").getBeginButton();

                assert.strictEqual(oTitleInput.getValue(), "", "Check the title input is empty.");
                assert.strictEqual(oTitleInput.getValueState(), "None", "Check the value status of title input is NORMAL.");
                assert.strictEqual(oDialogOkButton.getProperty("enabled"), true, "Check the ok button is enabled.");

                // Act
                oDialogOkButton.firePress();

                // Assert
                assert.strictEqual(oTitleInput.getValueState(), "Error", "Check the value status of title input is ERROR.");

                // Act
                oTitleInput.setValue("not empty");
                oTitleInput.fireLiveChange();

                // Assert
                assert.strictEqual(oTitleInput.getValueState(), "None", "Check the value status of title input is NORMAL.");

                // Clean-up
                sap.ui.getCore().byId("bookmarkDialog").destroy();
                fnDone();
            });
    });


    QUnit.test("Test bookmark button cancel method", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oButton = new AddBookmarkButton();

        this.oButton.showAddBookmarkDialog()
            .then(function () {
                var oDialogContent = sap.ui.getCore().byId("bookmarkFormId").getContent()[0].getContent();
                var oTitleInput = oDialogContent[3];

                // Act
                oTitleInput.setValue("have title value");
                oTitleInput.fireLiveChange();

                // Assert
                assert.strictEqual(oTitleInput.getValue(), "have title value", "Check the value changed");

                // Arrange
                var oBookmarkDialog = sap.ui.getCore().byId("bookmarkDialog");
                var oCancelButton = oBookmarkDialog.getEndButton();

                oBookmarkDialog.attachAfterClose(function () {
                    // Assert
                    assert.strictEqual(this.oButton.oModel.getProperty("/title"), "", "Check the value is empty after cancel btn pressed");

                    fnDone();
                }.bind(this));
                // Act
                oCancelButton.firePress();
            }.bind(this));
    });
    QUnit.test("Test bookmark button exit method", function (assert) {
        // Arrange
        this.oButton = new AddBookmarkButton();
        var oModelDestroySpy = sandbox.spy(this.oButton.oModel, "destroy");

        // Act
        this.oButton.destroy();

        // Assert
        assert.strictEqual(oModelDestroySpy.callCount, 1, "The bookmark button model is destroyed");
    });

    QUnit.module("Cancel button, spaces mode", {
        beforeEach: function () {
            sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(true);

            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().rejects()
            };

            this.oButton = new AddBookmarkButton();
            return this.oButton.showAddBookmarkDialog()
                .then(function () {
                    this.oMessageBoxShowStub = sandbox.stub(MessageBox, "show");
                    this.oDialogDestroySpy = sandbox.spy(this.oButton.oDialog, "destroy");
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
            delete sap.ushell.Container;
        }
    });
    QUnit.test("all fields empty", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oDialogDestroySpy.callCount, 1, "The save as tile dialog was destroyed.");
            assert.strictEqual(this.oMessageBoxShowStub.called, false, "MessageBox.show was not called.");

            // Clean-up
            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getEndButton().firePress();
    });

    QUnit.test("title set", function (assert) {
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "some title"
        });

        // Act
        this.oButton.oDialog.getEndButton().firePress();

        // Assert
        assert.strictEqual(this.oDialogDestroySpy.called, false, "The save as tile dialog was not destroyed.");
        assert.strictEqual(this.oMessageBoxShowStub.callCount, 1, "MessageBox.show was called exactly once.");
        assert.strictEqual(this.oMessageBoxShowStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageBox.Message.Discard"), "MessageBox.show message is correct.");
    });

    QUnit.test("subtitle set", function (assert) {
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            subtitle: "some subtitle"
        });

        // Act
        this.oButton.oDialog.getEndButton().firePress();

        // Assert
        assert.strictEqual(this.oDialogDestroySpy.called, false, "The save as tile dialog was not destroyed.");
        assert.strictEqual(this.oMessageBoxShowStub.callCount, 1, "MessageBox.show was called exactly once.");
        assert.strictEqual(this.oMessageBoxShowStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageBox.Message.Discard"), "MessageBox.show message is correct.");
    });

    QUnit.test("info set", function (assert) {
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            info: "some description"
        });

        // Act
        this.oButton.oDialog.getEndButton().firePress();

        // Assert
        assert.strictEqual(this.oDialogDestroySpy.called, false, "The save as tile dialog was not destroyed.");
        assert.strictEqual(this.oMessageBoxShowStub.callCount, 1, "MessageBox.show was called exactly once.");
        assert.strictEqual(this.oMessageBoxShowStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageBox.Message.Discard"), "MessageBox.show message is correct.");
    });

    QUnit.module("OK button spaces mode", {
        beforeEach: function () {
            sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(true);

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            sandbox.stub(SaveAsTileController.prototype, "loadPersonalizedGroups");

            this.oAddBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
            this.oAddBookmarkToPageStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Bookmark").resolves({
                addBookmark: this.oAddBookmarkStub,
                addBookmarkToPage: this.oAddBookmarkToPageStub
            });

            this.oAddBookmarkToPageStub.rejects("PageId not found");
            this.oAddBookmarkToPageStub.withArgs(sinon.match.any, "page-1").resolves();
            this.oAddBookmarkToPageStub.withArgs(sinon.match.any, "page-2").resolves();

            this.oMessageInfoStub = sandbox.stub();
            this.oMessageErrorWithDetailsStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Message").resolves({
                info: this.oMessageInfoStub,
                errorWithDetails: this.oMessageErrorWithDetailsStub
            });

            this.oButton = new AddBookmarkButton();

            return this.oButton.showAddBookmarkDialog();
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("know page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["page-1"]
        });

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "page-1", "addBookmarkToPage: 2. Paramter is correct.");
            assert.strictEqual(this.oMessageInfoStub.callCount, 1, "info was called exactly once.");
            assert.strictEqual(this.oMessageInfoStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPage"), "info text is correct.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.called, false, "errorWithDetails was not called.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("no title given", function (assert) {
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            pages: ["page-1"]
        });

        // Act
        this.oButton.oDialog.getBeginButton().firePress();

        assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
        assert.strictEqual(this.oAddBookmarkToPageStub.called, false, "addBookmarkToPage was not called.");
        assert.strictEqual(this.oMessageInfoStub.called, false, "info was not called.");
        assert.strictEqual(this.oMessageErrorWithDetailsStub.called, false, "errorWithDetails was not called.");
    });

    QUnit.test("no pages given", function (assert) {
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: []
        });

        // Act
        this.oButton.oDialog.getBeginButton().firePress();

        assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
        assert.strictEqual(this.oAddBookmarkToPageStub.called, false, "addBookmarkToPage was not called.");
        assert.strictEqual(this.oMessageInfoStub.called, false, "info was not called.");
        assert.strictEqual(this.oMessageErrorWithDetailsStub.called, false, "errorWithDetails was not called.");
    });

    QUnit.test("unkown page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["unkownPage"]
        });

        var sExpectedErrorMessage = resources.i18n.getText("SaveAsTileDialog.MessageBox.SinglePageError");
        var sExpectedErrorDetail = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorDetail", ["bookmark-title", "unkownPage"]);
        var sExpectedErrorSolution = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorSolution");

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 1, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "unkownPage", "addBookmarkToPage: 2. Paramter is correct.");
            assert.strictEqual(this.oMessageInfoStub.called, false, "info was not called.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.callCount, 1, "errorWithDetails was called exactly once.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.args[0][0], sExpectedErrorMessage, "errorWithDetails: 1. Paramter is correct.");
            assert.deepEqual(this.oMessageErrorWithDetailsStub.args[0][1].isA("sap.m.VBox"), true, "errorWithDetails: 2. Paramter is a \"sap.m.VBox\".");

            var aItems = this.oMessageErrorWithDetailsStub.args[0][1].getItems();
            assert.strictEqual(aItems.length, 3, "errorWithDetails: 2. Paramter is a Control with 3 items.");
            assert.strictEqual(aItems[0].isA("sap.m.Text"), true, "1. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[0].hasStyleClass("sapUiSmallMarginBottom"), true, "1. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[0].getText(), sExpectedErrorDetail, "1. item text property is correct.");
            assert.strictEqual(aItems[1].isA("sap.m.Text"), true, "2. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[1].hasStyleClass("sapUiSmallMarginBottom"), true, "2. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[1].getText(), "PageId not found", "2. item text property is correct.");
            assert.strictEqual(aItems[2].isA("sap.m.Text"), true, "3. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[2].getText(), sExpectedErrorSolution, "3. item text property is correct.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("multiple pages", function (assert) {
        var fnDone = assert.async();
        // Arrange
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["page-1", "page-2"]
        });

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 2, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "page-1", "addBookmarkToPage: 2. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][1], "page-2", "addBookmarkToPage: 2. Paramter of second call is correct.");
            assert.strictEqual(this.oMessageInfoStub.callCount, 1, "info was called exactly once.");
            assert.strictEqual(this.oMessageInfoStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPages"), "info text is correct.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.called, false, "errorWithDetails was not called.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("multiple pages, one unkown page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["page-1", "page-2", "unkownPage"]
        });

        var sExpectedErrorMessage = resources.i18n.getText("SaveAsTileDialog.MessageBox.OnePageError");
        var sExpectedErrorDetail = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorDetail", ["bookmark-title", "unkownPage"]);
        var sExpectedErrorSolution = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorSolution");

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 3, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "page-1", "addBookmarkToPage: 2. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][1], "page-2", "addBookmarkToPage: 2. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[2][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of thrid call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[2][1], "unkownPage", "addBookmarkToPage: 2. Paramter of thrid call is correct.");
            assert.strictEqual(this.oMessageInfoStub.callCount, 1, "info was called exactly once.");
            assert.strictEqual(this.oMessageInfoStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPages"), "info text is correct.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.callCount, 1, "errorWithDetails was called exactly once.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.args[0][0], sExpectedErrorMessage, "errorWithDetails: 1. Paramter is correct.");
            assert.deepEqual(this.oMessageErrorWithDetailsStub.args[0][1].isA("sap.m.VBox"), true, "errorWithDetails: 2. Paramter is a \"sap.m.VBox\".");

            var aItems = this.oMessageErrorWithDetailsStub.args[0][1].getItems();
            assert.strictEqual(aItems.length, 3, "errorWithDetails: 2. Paramter is a Control with 3 items.");
            assert.strictEqual(aItems[0].isA("sap.m.Text"), true, "1. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[0].hasStyleClass("sapUiSmallMarginBottom"), true, "1. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[0].getText(), sExpectedErrorDetail, "1. item text property is correct.");
            assert.strictEqual(aItems[1].isA("sap.m.Text"), true, "2. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[1].hasStyleClass("sapUiSmallMarginBottom"), true, "2. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[1].getText(), "PageId not found", "2. item text property is correct.");
            assert.strictEqual(aItems[2].isA("sap.m.Text"), true, "3. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[2].getText(), sExpectedErrorSolution, "3. item text property is correct.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("multiple pages, multiple unkown pages", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["page-1", "unkownPage-1", "unkownPage-2"]
        });

        var sExpectedErrorMessage = resources.i18n.getText("SaveAsTileDialog.MessageBox.SomePagesError");
        var sExpectedErrorDetail = resources.i18n.getText("SaveAsTileDialog.MessageBox.PagesErrorDetail", ["bookmark-title", "unkownPage-1\nunkownPage-2"]);
        var sExpectedErrorSolution = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorSolution");

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 3, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "page-1", "addBookmarkToPage: 2. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][1], "unkownPage-1", "addBookmarkToPage: 2. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[2][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of thrid call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[2][1], "unkownPage-2", "addBookmarkToPage: 2. Paramter of thrid call is correct.");
            assert.strictEqual(this.oMessageInfoStub.callCount, 1, "info was called exactly once.");
            assert.strictEqual(this.oMessageInfoStub.args[0][0], resources.i18n.getText("SaveAsTileDialog.MessageToast.TileCreatedInPage"), "info text is correct.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.callCount, 1, "errorWithDetails was called exactly once.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.args[0][0], sExpectedErrorMessage, "errorWithDetails: 1. Paramter is correct.");
            assert.deepEqual(this.oMessageErrorWithDetailsStub.args[0][1].isA("sap.m.VBox"), true, "errorWithDetails: 2. Paramter is a \"sap.m.VBox\".");

            var aItems = this.oMessageErrorWithDetailsStub.args[0][1].getItems();
            assert.strictEqual(aItems.length, 3, "errorWithDetails: 2. Paramter is a Control with 3 items.");
            assert.strictEqual(aItems[0].isA("sap.m.Text"), true, "1. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[0].hasStyleClass("sapUiSmallMarginBottom"), true, "1. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[0].getText(), sExpectedErrorDetail, "1. item text property is correct.");
            assert.strictEqual(aItems[1].isA("sap.m.Text"), true, "2. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[1].hasStyleClass("sapUiSmallMarginBottom"), true, "2. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[1].getText(), "PageId not found\nPageId not found", "2. item text property is correct.");
            assert.strictEqual(aItems[2].isA("sap.m.Text"), true, "3. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[2].getText(), sExpectedErrorSolution, "3. item text property is correct.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("only multiple unkown pages", function (assert) {
        // Arrange
        var fnDone = assert.async();
        sandbox.stub(this.oButton.bookmarkTileView.getController(), "getBookmarkTileData").returns({
            title: "bookmark-title",
            pages: ["unkownPage-1", "unkownPage-2"]
        });

        var sExpectedErrorMessage = resources.i18n.getText("SaveAsTileDialog.MessageBox.AllPagesError");
        var sExpectedErrorDetail = resources.i18n.getText("SaveAsTileDialog.MessageBox.PagesErrorDetail", ["bookmark-title", "unkownPage-1\nunkownPage-2"]);
        var sExpectedErrorSolution = resources.i18n.getText("SaveAsTileDialog.MessageBox.PageErrorSolution");

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
            assert.strictEqual(this.oAddBookmarkToPageStub.callCount, 2, "addBookmarkToPage was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[0][1], "unkownPage-1", "addBookmarkToPage: 2. Paramter of first call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][0].title, "bookmark-title", "addBookmarkToPage: 1. Paramter of second call is correct.");
            assert.strictEqual(this.oAddBookmarkToPageStub.args[1][1], "unkownPage-2", "addBookmarkToPage: 2. Paramter of second call is correct.");
            assert.strictEqual(this.oMessageInfoStub.called, false, "info was not called.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.callCount, 1, "errorWithDetails was called exactly once.");
            assert.strictEqual(this.oMessageErrorWithDetailsStub.args[0][0], sExpectedErrorMessage, "errorWithDetails: 1. Paramter is correct.");
            assert.deepEqual(this.oMessageErrorWithDetailsStub.args[0][1].isA("sap.m.VBox"), true, "errorWithDetails: 2. Paramter is a \"sap.m.VBox\".");

            var aItems = this.oMessageErrorWithDetailsStub.args[0][1].getItems();
            assert.strictEqual(aItems.length, 3, "errorWithDetails: 2. Paramter is a Control with 3 items.");
            assert.strictEqual(aItems[0].isA("sap.m.Text"), true, "1. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[0].hasStyleClass("sapUiSmallMarginBottom"), true, "1. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[0].getText(), sExpectedErrorDetail, "1. item text property is correct.");
            assert.strictEqual(aItems[1].isA("sap.m.Text"), true, "2. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[1].hasStyleClass("sapUiSmallMarginBottom"), true, "2. item has the \"sapUiSmallMarginBottom\" style class.");
            assert.strictEqual(aItems[1].getText(), "PageId not found\nPageId not found", "2. item text property is correct.");
            assert.strictEqual(aItems[2].isA("sap.m.Text"), true, "3. item is a \"sap.m.Text\".");
            assert.strictEqual(aItems[2].getText(), sExpectedErrorSolution, "3. item text property is correct.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.module("OK button classic homepage", {
        beforeEach: function () {
            sandbox.stub(Config, "last").withArgs("/core/spaces/enabled").returns(false);

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            sandbox.stub(SaveAsTileController.prototype, "loadPersonalizedGroups");

            this.oAddBookmarkStub = sandbox.stub().returns(new jQuery.Deferred().resolve());
            this.oAddBookmarkToPageStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Bookmark").resolves({
                addBookmark: this.oAddBookmarkStub,
                addBookmarkToPage: this.oAddBookmarkToPageStub
            });

            this.oAddBookmarkToPageStub.rejects("PageId not found");
            this.oAddBookmarkToPageStub.withArgs(sinon.match.any, "page-1").resolves();
            this.oAddBookmarkToPageStub.withArgs(sinon.match.any, "page-2").resolves();

            this.oMessageInfoStub = sandbox.stub();
            this.oMessageErrorWithDetailsStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Message").resolves({
                info: this.oMessageInfoStub,
                errorWithDetails: this.oMessageErrorWithDetailsStub
            });

            this.oButton = new AddBookmarkButton();

            return this.oButton.showAddBookmarkDialog();
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("default", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oController = this.oButton.bookmarkTileView.getController();
        sandbox.stub(oController, "getBookmarkTileData").returns({
            title: "bookmark-title",
            group: {
                pages: [{
                    id: "page-1"
                }]
            }
        });

        this.oButton.oDialog.attachAfterClose(function () {
            // Assert
            assert.strictEqual(this.oAddBookmarkStub.callCount, 1, "addBookmark was called exactly once.");
            assert.strictEqual(this.oAddBookmarkToPageStub.called, false, "addBookmarkToPage was not called.");

            fnDone();
        }.bind(this));

        // Act
        this.oButton.oDialog.getBeginButton().firePress();
    });

    QUnit.test("missing title", function (assert) {
        // Arrange
        var oController = this.oButton.bookmarkTileView.getController();
        sandbox.stub(oController, "getBookmarkTileData").returns({
            group: {
                pages: [{
                    id: "page-1"
                }]
            }
        });

        // Act
        this.oButton.oDialog.getBeginButton().firePress();

        // Assert
        assert.strictEqual(this.oAddBookmarkStub.called, false, "addBookmark was not called.");
        assert.strictEqual(this.oAddBookmarkToPageStub.called, false, "addBookmarkToPage was not called.");
    });

    QUnit.module("beforePressHandler and afterPressHandler function", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().rejects()
            };

            this.oButton = new AddBookmarkButton();
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("beforePressHandler", function (assert) {
        // Arrange
        var oShowAddBookmarkDialogStub = sandbox.stub(this.oButton, "showAddBookmarkDialog");

        this.oButton.setBeforePressHandler(function () {
            // Assert
            assert.strictEqual(oShowAddBookmarkDialogStub.called, false, "The before function was executed before the dialog was opened.");
        });

        // Act
        this.oButton.firePress();
    });

    QUnit.test("afterPressHandler", function (assert) {
        // Arrange
        var oAfterStub = sandbox.stub(),
            fnDone = assert.async();

        this.oButton.setAfterPressHandler(oAfterStub);
        this.oButton.showAddBookmarkDialog()
            .then(function () {
                var oBookmarkDialog = sap.ui.getCore().byId("bookmarkDialog"),
                    oCancelButton = oBookmarkDialog.getEndButton();

                oBookmarkDialog.attachAfterClose(function () {
                    // Assert
                    assert.strictEqual(oAfterStub.callCount, 1, "The after function was executed exactly once after closing the dialog.");

                    fnDone();
                });

                // Act
                oCancelButton.firePress();

                // Assert
                assert.strictEqual(oAfterStub.called, false, "The after function was not called before closing the dialog.");
            });
    });

    QUnit.module("setTitle", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the title in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setTitle("someTitle");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/title"), "someTitle", "saved the correct title into the model");
        assert.strictEqual(this.oButton.getTitle(), "someTitle", "saved the correct title into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setTitle("someTitle");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setTitle("someTitle");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setSubtitle", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the subtitle in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setSubtitle("someSubtitle");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/subtitle"), "someSubtitle", "saved the correct subtitle into the model");
        assert.strictEqual(this.oButton.getSubtitle(), "someSubtitle", "saved the correct subtitle into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setSubtitle("someSubtitle");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setSubtitle("someSubtitle");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setInfo", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the info in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setInfo("someInfo");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/info"), "someInfo", "saved the correct info into the model");
        assert.strictEqual(this.oButton.getInfo(), "someInfo", "saved the correct info into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setInfo("someInfo");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setInfo("someInfo");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setTileIcon", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the icon in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setTileIcon("sap-icon://bell");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/icon"), "sap-icon://bell", "saved the correct icon into the model");
        assert.strictEqual(this.oButton.getTileIcon(), "sap-icon://bell", "saved the correct icon into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setTileIcon("sap-icon://bell");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setTileIcon("sap-icon://bell");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setShowGroupSelection", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the showGroupSelection in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setShowGroupSelection(true);
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/showGroupSelection"), true, "saved the correct showGroupSelection into the model");
        assert.strictEqual(this.oButton.getShowGroupSelection(), true, "saved the correct showGroupSelection into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setShowGroupSelection(true);
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setShowGroupSelection(true);
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setNumberUnit", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the numberUnit in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setNumberUnit("EUR");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/numberUnit"), "EUR", "saved the correct numberUnit into the model");
        assert.strictEqual(this.oButton.getNumberUnit(), "EUR", "saved the correct numberUnit into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setNumberUnit("EUR");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setNumberUnit("EUR");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setServiceRefreshInterval", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the serviceRefreshInterval in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setServiceRefreshInterval("300");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/serviceRefreshInterval"), "300", "saved the correct serviceRefreshInterval into the model");
        assert.strictEqual(this.oButton.getServiceRefreshInterval(), "300", "saved the correct serviceRefreshInterval into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setServiceRefreshInterval("300");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setServiceRefreshInterval("300");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setKeywords", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the keywords in the model", function (assert) {
        // Arrange
        // Act
        this.oButton.setKeywords("someKeywords");
        // Assert
        var oModel = this.oButton.oModel;
        assert.strictEqual(oModel.getProperty("/keywords"), "someKeywords", "saved the correct keywords into the model");
        assert.strictEqual(this.oButton.getKeywords(), "someKeywords", "saved the correct keywords into the button properties");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setKeywords("someKeywords");
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        // Act
        this.oButton.setKeywords("someKeywords");
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("setAppData", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oInvalidateSpy = sandbox.spy(this.oButton, "invalidate");
            this.oButton.oModel.setData({});
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Updates the model correctly", function (assert) {
        // Arrange
        var oAppData = {
            showGroupSelection: true,
            showInfo: true,
            showPreview: true,
            title: "someTitle",
            subtitle: "someSubtitle",
            info: "someInfo",
            icon: "sap-icon://bell",
            numberUnit: "EUR",
            keywords: "someKeywords",
            serviceRefreshInterval: "300"
        };
        var oExpectedResult = {
            showGroupSelection: true,
            showInfo: true,
            showPreview: true,
            title: "someTitle",
            subtitle: "someSubtitle",
            info: "someInfo",
            icon: "sap-icon://bell",
            numberUnit: "EUR",
            keywords: "someKeywords",
            serviceRefreshInterval: "300"
        };
        // Act
        this.oButton.setAppData(oAppData);
        // Assert
        var oData = this.oButton.oModel.getData();
        assert.deepEqual(oData, oExpectedResult, "correctly updated the model properties");
    });

    QUnit.test("Updates the control properties correctly", function (assert) {
        // Arrange
        var oAppData = {
            showGroupSelection: true,
            showInfo: true,
            showPreview: true,
            title: "someTitle",
            subtitle: "someSubtitle",
            info: "someInfo",
            icon: "sap-icon://bell",
            numberUnit: "EUR",
            keywords: "someKeywords",
            serviceRefreshInterval: "300"
        };
        // Act
        this.oButton.setAppData(oAppData);
        // Assert
        assert.strictEqual(this.oButton.getAppData(), oAppData, "set the correct appData");

        assert.strictEqual(this.oButton.getShowGroupSelection(), true, "set the correct showGroupSelection");
        assert.strictEqual(this.oButton.getTitle(), "someTitle", "set the correct title");
        assert.strictEqual(this.oButton.getSubtitle(), "someSubtitle", "set the correct subtitle");
        assert.strictEqual(this.oButton.getInfo(), "someInfo", "set the correct info");
        assert.strictEqual(this.oButton.getTileIcon(), "sap-icon://bell", "set the correct tileIcon");
        assert.strictEqual(this.oButton.getNumberUnit(), "EUR", "set the correct numberUnit");
        assert.strictEqual(this.oButton.getKeywords(), "someKeywords", "set the correct keywords");
        assert.strictEqual(this.oButton.getServiceRefreshInterval(), "300", "set the correct serviceRefreshInterval");
    });

    QUnit.test("Allows chaining", function (assert) {
        // Arrange
        // Act
        var oResult = this.oButton.setAppData({});
        // Assert
        assert.strictEqual(oResult, this.oButton, "Returned itself");
    });

    QUnit.test("Does not invalidate", function (assert) {
        // Arrange
        var oAppData = {
            title: "someTitle",
            subtitle: "someSubtitle",
            info: "someInfo",
            icon: "sap-icon://bell",
            numberUnit: "EUR",
            keywords: "someKeywords",
            serviceRefreshInterval: "300"
        };
        // Act
        this.oButton.setAppData(oAppData);
        // Assert
        assert.strictEqual(this.oInvalidateSpy.callCount, 0, "invalidate was not called");
    });

    QUnit.module("showAddBookmarkDialog", {
        beforeEach: function () {
            this.oButton = new AddBookmarkButton();
            this.oViewCreateStub = sandbox.stub(View, "create");
        },
        afterEach: function () {
            sandbox.restore();
            this.oButton.destroy();
        }
    });

    QUnit.test("Sets the serviceUrl=false flag when it is not provided", function (assert) {
        // Arrange
        // Reject to avoid stubbing the callback internals
        this.oViewCreateStub.rejects();
        // Act
        return this.oButton.showAddBookmarkDialog().catch(function () {
            // Assert
            var oModel = this.oButton.oModel;
            assert.strictEqual(oModel.getProperty("/serviceUrl"), false, "saved a serviceUrl flag correct");
        }.bind(this));
    });

    QUnit.test("Sets the serviceUrl flag when it is provided via appData", function (assert) {
        // Arrange
        // Reject to avoid stubbing the callback internals
        this.oViewCreateStub.rejects();
        this.oButton.setAppData({
            serviceUrl: "someServiceUrl"
        });
        // Act
        return this.oButton.showAddBookmarkDialog().catch(function () {
            // Assert
            var oModel = this.oButton.oModel;
            assert.strictEqual(oModel.getProperty("/serviceUrl"), true, "saved a serviceUrl flag correct");
        }.bind(this));
    });

    QUnit.test("Sets the serviceUrl flag when it is provided via property", function (assert) {
        // Arrange
        // Reject to avoid stubbing the callback internals
        this.oViewCreateStub.rejects();
        this.oButton.setServiceUrl("someServiceUrl");
        // Act
        return this.oButton.showAddBookmarkDialog().catch(function () {
            // Assert
            var oModel = this.oButton.oModel;
            assert.strictEqual(oModel.getProperty("/serviceUrl"), true, "saved a serviceUrl flag correct");
        }.bind(this));
    });
});
