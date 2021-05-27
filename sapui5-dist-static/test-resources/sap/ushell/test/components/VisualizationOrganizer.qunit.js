// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.VisualizationOrganizer.Component
 */
sap.ui.require([
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/resources"
], function (Button, mobileLibrary, JSONModel, VisualizationOrganizer, resources) {
    "use strict";

    // shortcut for sap/m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /* global QUnit, sinon */

    var oLoadPageStub = sinon.stub(),
        oGetPropertyStub = sinon.stub(),
        oAddVisualizationStub = sinon.stub().returns(Promise.resolve()),
        oFindVisualizationStub = sinon.stub().returns(Promise.resolve([{ sectionIndex: 0, vizIndexes: [0] }])),
        oDeleteVisualizationStub = sinon.stub().returns(Promise.resolve()),
        oGetPageIndexStub = sinon.stub().returns(0),
        oAddBookmarkToPageStub = sinon.stub().returns(Promise.resolve()),
        oDeleteBookmarksStub = sinon.stub().returns(Promise.resolve()),
        oAddBookmarkStub = sinon.stub().returns(new jQuery.Deferred().resolve().promise()),
        oFindBookmarksStub = sinon.stub(),
        oServiceObject = {
            getSpacesPagesHierarchy: sinon.stub().returns({ spaces: [
                {
                    id: "space1",
                    title: "space1Title",
                    pages: [{ id: "page1" }]
                },
                {
                    id: "space2",
                    title: "space2Title",
                    pages: [{ id: "page2" }]
                },
                {
                    id: "space3",
                    title: "space3Title",
                    pages: [{ id: "page1" }, { id: "page2" }]
                },
                { // This space contains an unknown page, this unknown page will not be added to the pageslist
                    id: "space4",
                    title: "sapace4Title",
                    pages: [{ id: "unknownPageId" }]
                }
            ] }),
            getAllPages: sinon.stub().returns([
                {
                    identification: {
                        id: "page1",
                        title: "page1Title"
                    },
                    payload: {
                        sections: {
                            page1Section1: {
                                viz: {
                                    page1Section1Viz2: {
                                        vizId: "vizId2"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    identification: {
                        id: "page2",
                        title: "page2Title"
                    },
                    payload: {
                        sections: {
                            page2Section1: {
                                viz: {
                                    page2Section1Viz1: {
                                        vizId: "vizId"
                                    },
                                    page2Section1Viz2: {
                                        vizId: "vizId2"
                                    }
                                }
                            }
                        }
                    }
                }
            ]),
            loadPage: oLoadPageStub,
            getModel: sinon.stub().returns({ getProperty: oGetPropertyStub }),
            deleteVisualization: oDeleteVisualizationStub,
            getPageIndex: oGetPageIndexStub,
            findVisualization: oFindVisualizationStub,
            addVisualization: oAddVisualizationStub,
            addBookmarkToPage: oAddBookmarkToPageStub,
            deleteBookmarks: oDeleteBookmarksStub,
            _findBookmarks: oFindBookmarksStub,
            addBookmark: oAddBookmarkStub
        },
        oContainer = {
            getService: sinon.stub().returns(oServiceObject),
            getServiceAsync: sinon.stub().returns(Promise.resolve(oServiceObject))
        },
        oModel = new JSONModel({
            icon: "sap-icon://add",
            type: ButtonType.Emphasized,
            tooltip: "pin me"
        });

    function _resetStubs () {
        oAddVisualizationStub.reset();
        oFindVisualizationStub.reset();
        oDeleteVisualizationStub.reset();
        oGetPageIndexStub.reset();
        oAddBookmarkToPageStub.reset();
        oDeleteBookmarksStub.reset();
        oFindBookmarksStub.reset();
        oAddBookmarkStub.reset();
        oAddVisualizationStub.returns(Promise.resolve());
        oFindVisualizationStub.returns(Promise.resolve([{ sectionIndex: 0, vizIndexes: [0] }]));
        oDeleteVisualizationStub.returns(Promise.resolve());
        oGetPageIndexStub.returns(0);
        oAddBookmarkToPageStub.returns(Promise.resolve());
        oDeleteBookmarksStub.returns(Promise.resolve());
        oAddBookmarkStub.returns(new jQuery.Deferred().resolve().promise());
    }

    oLoadPageStub.returns(Promise.reject());
    oLoadPageStub.withArgs("page1").returns(Promise.resolve("page1"));
    oLoadPageStub.withArgs("page2").returns(Promise.resolve("page2"));
    oGetPropertyStub.withArgs("page1").returns({
        title: "page1Title",
        sections: [{
            id: "page1Section1",
            title: "page1Section1Title",
            visualizations: [
                { vizId: "vizId2" }
            ]
        }]
    });
    oGetPropertyStub.withArgs("page2").returns({
        title: "page2Title",
        sections: [{
            id: "page2Section1",
            title: "page12Section1Title",
            visualizations: [
                { vizId: "vizId"},
                { vizId: "vizId2"}
            ]
        }]
    });

    QUnit.module("init");

    QUnit.test("maps and sets are created.", function (assert) {
        // Arrange
        // Act
        this.oVisualizationOrganizer = new VisualizationOrganizer();

        // Assert
        assert.notEqual(this.oVisualizationOrganizer.mVizIdInPages, undefined, "Map: mVizIdInPages was created.");
        assert.notEqual(this.oVisualizationOrganizer.stVizIdInSection, undefined, "Set: stVizIdInSection was created.");
    });

    QUnit.module("requestData", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("maps and sets are filled correctly.", function (assert) {
        // Arrange
        this.oVisualizationOrganizer = new VisualizationOrganizer();
        var fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.requestData().then(function () {
            // Assert
            assert.strictEqual(this.oVisualizationOrganizer.mVizIdInPages.size, 2, "mVizIdInPages has a size of 2.");
            assert.ok(this.oVisualizationOrganizer.mVizIdInPages.has("vizId"), "mVizIdInPages has the key \"vizId\"");
            assert.ok(this.oVisualizationOrganizer.mVizIdInPages.has("vizId2"), "mVizIdInPages has the key \"vizId2\"");
            assert.strictEqual(this.oVisualizationOrganizer.stVizIdInSection.size, 0, "stVizIdInSection has a size of 0.");
            fnDone();
        }.bind(this));
    });

    QUnit.module("onTilePinButtonClick", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                fnDone();
            });

            this.oApplyOrganizationChangeToSectionStub = sinon.stub(this.oVisualizationOrganizer, "_applyOrganizationChangeToSection");
            this.oToggleStub = sinon.stub(this.oVisualizationOrganizer, "toggle");
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("toggles the popover, if no section context is given.", function (assert) {
        // Arrange
        var oTileData = { id: "vizId", title: "vizTitle" },
            oBindingContext = { getProperty: sinon.stub().returns(oTileData) },
            oSource = { getBindingContext: sinon.stub().returns(oBindingContext) },
            oEvent = { getSource: sinon.stub().returns(oSource) };

        // Act
        this.oVisualizationOrganizer.onTilePinButtonClick(oEvent);

        // Assert
        assert.strictEqual(this.oApplyOrganizationChangeToSectionStub.callCount, 0, "_applyOrganizationChangeToSection was not called.");
        assert.strictEqual(this.oToggleStub.callCount, 1, "toggle was called once.");
        assert.deepEqual(this.oToggleStub.args[0][0], oSource, "toggle has the correct 1. Parameter.");
        assert.deepEqual(this.oToggleStub.args[0][1], oTileData, "toggle has the correct 2. Parameter.");
    });

    QUnit.test("applies the organizer change, without opening the popover, if a section context is given.", function (assert) {
        // Arrange
        var oTileData = { id: "vizId", title: "vizTitle" },
            oBindingContext = { getProperty: sinon.stub().returns(oTileData) },
            oSource = { getBindingContext: sinon.stub().returns(oBindingContext) },
            oEvent = { getSource: sinon.stub().returns(oSource) },
            oSectionContext = { id: "sectionId" };

        // Act
        this.oVisualizationOrganizer.onTilePinButtonClick(oEvent, oSectionContext);

        // Assert
        assert.strictEqual(this.oApplyOrganizationChangeToSectionStub.callCount, 1, "_applyOrganizationChangeToSection was not called.");
        assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][0], oSource,
            "_applyOrganizationChangeToSection has the correct 1. Parameter.");
        assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][1], oTileData,
            "_applyOrganizationChangeToSection has the correct 2. Parameter.");
        assert.deepEqual(this.oApplyOrganizationChangeToSectionStub.args[0][2], oSectionContext,
            "_applyOrganizationChangeToSection has the correct 3. Parameter.");
        assert.strictEqual(this.oToggleStub.callCount, 0, "toggle was called once.");
    });

    QUnit.module("toggle, open, close", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            this.oPinButton = new Button({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
                    this.oList = sap.ui.getCore().byId("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    this.oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            this.oPinButton.destroy();
            this.oVisualizationOrganizer.exit();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("toggle once, opens the popover.", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(function () {
            // Assert
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
            assert.ok(oPopover.isOpen(), "the popover is open.");
            assert.strictEqual(oPopover.getModel().getProperty("/pages").length, 4, "the model contains 4 pages.");
            assert.ok(oPopover.getContent()[0].isA("sap.m.List"), "the list of pages is at the correct position of the popover.");
            fnDone();
        });
    });

    QUnit.test("preserves the filter state.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oVisualizationOrganizer.setPressed(true);

        // Act
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(function () {
            // Assert
            assert.ok(this.oPopover.isOpen(), "the popover is open.");
            assert.strictEqual(this.oPopover.getContent()[0].getSelectedItems().length, 2, "There are two selected items.");
            fnDone();
        }.bind(this));
    });

    QUnit.test("toggle twice, closes the popover.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo).then(function () {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");

            // Act
            this.oVisualizationOrganizer.toggle(this.oPinButton, this.oVizInfo);

            // Assert
            oPopover.attachAfterClose(function () {
                assert.ok(true, "the popover is closed.");
                fnDone();
            });
        }.bind(this));
    });

    QUnit.test("open, opens the popover.", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
            // Assert
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
            assert.ok(oPopover.isOpen(), "the popover is open.");
            assert.strictEqual(oPopover.getModel().getProperty("/pages").length, 4, "the model contains 4 pages.");
            assert.ok(oPopover.getContent()[0].isA("sap.m.List"), "the list of pages is at the correct position of the popover.");
            fnDone();
        });
    });

    QUnit.test("close, closes the popover.", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");

            // Act
            this.oVisualizationOrganizer.cancel(this.oPinButton, this.oVizInfo);

            // Assert
            oPopover.attachAfterClose(function () {
                assert.ok(true, "the popover is closed.");
                fnDone();
            });
        }.bind(this));
    });

    QUnit.module("loadSectionContext", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                fnDone();
            });
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("with a known section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            },
            oExpectedSectionContext = {
                pageID: "page1",
                pageTitle: "page1Title",
                sectionID: "page1Section1",
                sectionTitle: "page1Section1Title"
            };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {

            // Assert
            assert.deepEqual(oSectionContext, oExpectedSectionContext, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with an unknown section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section2"
            };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {

            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with an unknown page context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page3",
                sectionID: "page1Section1"
            };

        // Act
        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {

            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.test("with no section context", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oVisualizationOrganizer.loadSectionContext().then(function (oSectionContext) {

            // Assert
            assert.deepEqual(oSectionContext, null, "The returned section context was correct.");
            fnDone();
        });
    });

    QUnit.module("isVizIdPresent, formatPinButtonIcon, formatPinButtonType, formatPinButtonTooltip, formatBookmarkPinButtonTooltip", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                fnDone();
            });
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("isVizIdPresent with a know vizId", function (assert) {
        // Arrange
        // Act
        var bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId");

        // Assert
        assert.strictEqual(bResult, true, "The vizId \"vizId\" is on a page.");
    });

    QUnit.test("isVizIdPresent with an unknown vizId", function (assert) {
        // Arrange
        // Act
        var bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId1");

        // Assert
        assert.strictEqual(bResult, false, "The vizId \"vizId1\" is not on a page.");
    });

    QUnit.test("isVizIdPresent with a known vizId in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId2", oSectionContext);

            // Assert
            assert.strictEqual(bResult, true, "The vizId \"vizId2\" is on the page and section in context.");
            fnDone();
        }.bind(this));
    });

    QUnit.test("isVizIdPresent with an unknown vizId in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var bResult = this.oVisualizationOrganizer.isVizIdPresent("vizId", oSectionContext);

            // Assert
            assert.strictEqual(bResult, false, "The vizId \"vizId\" is not on the page and section in context.");
            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonIcon with a know vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonIcon("vizId");

        // Assert
        assert.strictEqual(sResult, "sap-icon://accept",
            "The vizId \"vizId\" is on a page so the icon:  \"sap-icon://accept\" is returned.");
    });

    QUnit.test("formatPinButtonIcon with an unknown vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonIcon("vizId1");

        // Assert
        assert.strictEqual(sResult, "sap-icon://add",
            "The vizId \"vizId\" is not a page so the icon:  \"sap-icon://add\" is returned.");
    });

    QUnit.test("formatPinButtonType with a know vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonType("vizId");

        // Assert
        assert.strictEqual(sResult, ButtonType.Emphasized,
            "The vizId \"vizId\" is on a page so the button type:  \"Emphasized\" is returned.");
    });

    QUnit.test("formatPinButtonType with an unknown vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonType("vizId1");

        // Assert
        assert.strictEqual(sResult, ButtonType.Default,
            "The vizId \"vizId\" is not a page so the button type:  \"Default\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with a know vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId");

        // Assert
        assert.strictEqual(sResult, resources.i18n.getText("EasyAccessMenu_PinButton_Toggled_Tooltip"),
            "The vizId \"vizId\" is on a page so the text for:  \"EasyAccessMenu_PinButton_Toggled_Tooltip\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with an unknown vizId", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId1");

        // Assert
        assert.strictEqual(sResult, resources.i18n.getText("EasyAccessMenu_PinButton_UnToggled_Tooltip"),
            "The vizId \"vizId\" is not a page so the text for:  \"EasyAccessMenu_PinButton_UnToggled_Tooltip\" is returned.");
    });

    QUnit.test("formatPinButtonTooltip with a known vizId in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId2", oSectionContext);

            // Assert
            assert.strictEqual(sResult, resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.RemoveFromSection", oSectionContext.sectionTitle),
                "The text for:  \"VisualizationOrganizer.Button.Tooltip.RemoveFromSection\" is returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonTooltip with an unknown vizId in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var sResult = this.oVisualizationOrganizer.formatPinButtonTooltip("vizId", oSectionContext);

            // Assert
            assert.strictEqual(sResult, resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.AddToSection", oSectionContext.sectionTitle),
            "The text for:  \"VisualizationOrganizer.Button.Tooltip.AddToSection\" is returned");
            fnDone();
        }.bind(this));
    });


    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount > 0", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(1);

        // Assert
        assert.strictEqual(sResult, resources.i18n.getText("EasyAccessMenu_PinButton_Toggled_Tooltip"),
            "The vizId \"vizId\" is on a page so the text for:  \"EasyAccessMenu_PinButton_Toggled_Tooltip\" is returned.");
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount === 0", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(0);

        // Assert
        assert.strictEqual(sResult, resources.i18n.getText("EasyAccessMenu_PinButton_UnToggled_Tooltip"),
            "The vizId \"vizId\" is not a page so the text for:  \"EasyAccessMenu_PinButton_UnToggled_Tooltip\" is returned.");
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount > 0 in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(1, oSectionContext);

            // Assert
            assert.strictEqual(sResult, resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.RemoveFromSection", oSectionContext.sectionTitle),
                "The text for:  \"VisualizationOrganizer.Button.Tooltip.RemoveFromSection\" is returned");
            fnDone();
        }.bind(this));
    });

    QUnit.test("formatBookmarkPinButtonTooltip when bookmarkCount === 0 in a section context", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oContext = {
                pageID: "page1",
                sectionID: "page1Section1"
            };

        this.oVisualizationOrganizer.loadSectionContext(oContext).then(function (oSectionContext) {
            // Act
            var sResult = this.oVisualizationOrganizer.formatBookmarkPinButtonTooltip(0, oSectionContext);

            // Assert
            assert.strictEqual(sResult, resources.i18n.getText("VisualizationOrganizer.Button.Tooltip.AddToSection", oSectionContext.sectionTitle),
            "The text for:  \"VisualizationOrganizer.Button.Tooltip.AddToSection\" is returned");
            fnDone();
        }.bind(this));
    });

    QUnit.module("_onSearch", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            this.oPinButton = new Button({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.setPressed(true);
            this.oVisualizationOrganizer.requestData().then(function () {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
                    fnDone();
                });
            }.bind(this));
        },
        afterEach: function () {
            this.oPinButton.destroy();
            this.oVisualizationOrganizer.exit();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("no Bindings and no searchTerm", function (assert) {
        // Arrange
        var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover"),
            oPagesList = oPopover.getContent()[0],
            oSearchField = oPopover.getSubHeader().getItems()[0];

        oPopover.getModel().setProperty("/pages", []);

        // Act
        oSearchField.setValue("");
        oSearchField.fireSearch();
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(oPagesList.getNoDataText(), resources.i18n.getText("VisualizationOrganizer.PagesList.NoDataText"),
            "The correct no data text is shown.");
    });

    QUnit.test("no Bindings with a searchTerm", function (assert) {
        // Arrange
        var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover"),
            oPagesList = oPopover.getContent()[0],
            oSearchField = oPopover.getSubHeader().getItems()[0];

        // Act
        oSearchField.setValue("searchTerm");
        oSearchField.fireSearch();
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(oPagesList.getNoDataText(), resources.i18n.getText("VisualizationOrganizer.PagesList.NoResultsText"),
            "The no data text is correct");
    });

    QUnit.module("pagePressed, onSelectionChange", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            this.oPinButton = new Button({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
                    this.oList = sap.ui.getCore().byId("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Page is pressed and all pages with the same pageId get deselected.", function (assert) {
        // Act
        this.aItems[3].firePress();

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[3].getSelected(), false, "The page was deselected.");
        assert.strictEqual(this.aItems[5].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[6].getSelected(), false, "The page was deselected.");
    });

    QUnit.test("Page is pressed and all pages with the same pageId get selected.", function (assert) {
        // Act
        this.aItems[1].firePress();

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[3].getSelected(), true, "The page stays selected.");
        assert.strictEqual(this.aItems[5].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[6].getSelected(), true, "The page stays selected.");
    });

    QUnit.test("Page is selected and all pages with the same pageId get selected.", function (assert) {
        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[1],
            selected: true
        });

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[3].getSelected(), true, "The page stays selected.");
        assert.strictEqual(this.aItems[5].getSelected(), true, "The page was selected.");
        assert.strictEqual(this.aItems[6].getSelected(), true, "The page stays selected.");
    });

    QUnit.test("Page is deselected and all pages with the same pageId get deselected.", function (assert) {
        // Act
        this.oList.fireSelectionChange({
            listItem: this.aItems[3],
            selected: false
        });

        // Assert
        assert.strictEqual(this.aItems[1].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[3].getSelected(), false, "The page was deselected.");
        assert.strictEqual(this.aItems[5].getSelected(), false, "The page stays deselected.");
        assert.strictEqual(this.aItems[6].getSelected(), false, "The page was deselected.");
    });

    QUnit.module("Section context - _applyOrganizationChangeToSection", {
        beforeEach: function () {

            this.fnBindingStub = {
                refresh: sinon.stub(),
                getProperty: sinon.stub()
            };
            this.oSource = {
                getBindingContext: sinon.stub().returns(this.fnBindingStub),
                getBinding: sinon.stub().returns(this.fnBindingStub)
            };

            sap.ushell.Container = oContainer;
            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("onTilePinButtonClick call _applyOrganizationChangeToSection when section context is presented", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizId = "vizId1";
        var oProperty = { id: sVizId };
        var oEvent = { getSource: sinon.stub().returns(this.oSource) };
        var oSectionContext = {pageId: "page_id", sectionID: "section_id"};

        this.fnBindingStub.getProperty.returns(oProperty);

        sinon.spy(this.oVisualizationOrganizer, "toggle");
        sinon.stub(this.oVisualizationOrganizer, "_applyOrganizationChangeToSection").returns(Promise.resolve());

        // Act
        this.oVisualizationOrganizer.onTilePinButtonClick(oEvent, oSectionContext).then(function () {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyOrganizationChangeToSection.calledWith(
                this.oSource,
                oProperty,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.ok(this.oVisualizationOrganizer.toggle.notCalled, "\"toggle\" should not be called when section context is defined");

            fnDone();
        }.bind(this));
    });

    QUnit.test("add visualization to specific section", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oVizInfo = { id: "vizId1", title: "viz title" };

        var oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        oAddVisualizationStub.returns(Promise.resolve());
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(function () {
                // Assert
                assert.ok(oAddVisualizationStub.calledWith(
                    oSectionContext.pageID,
                    oSectionContext.sectionID,
                    oVizInfo.id
                ), "\"addVisualization\" was called with the expected arguments");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId", "vizId1"],
                    "\"stVizIdInSection\" is updated");
                assert.ok(this.fnBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            }.bind(this));
    });

    QUnit.test("Don't execute remove if visualization was not found", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oVizInfo = { id: "vizId1", title: "viz title" };

        var oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        oFindVisualizationStub.returns(Promise.resolve([]));
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(function () {
                // Assert
                assert.ok(oDeleteVisualizationStub.notCalled, "\"deleteVisualization\" should not be called");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"], "\"stVizIdInSection\" is updated");
                assert.ok(this.fnBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            }.bind(this));
    });

    QUnit.test("remove only 1 visualization", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oVizInfo = { id: "vizId1", title: "viz title" };
        var iPageIndex = 1;
        var iSectionIndex = 5;
        var aVizIndexes = [3];


        var oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        oFindVisualizationStub.returns(Promise.resolve([{
            sectionIndex: iSectionIndex,
            vizIndexes: aVizIndexes
        }]));
        oGetPageIndexStub.returns(iPageIndex);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext).then(function () {
            // Assert
            assert.ok(oGetPageIndexStub.calledWith("page_id"), " \"getPageIndex\" was called with the correct params");
            assert.ok(oDeleteVisualizationStub.calledWith(
                iPageIndex,
                iSectionIndex,
                aVizIndexes[0]
            ), "\"deleteVisualization\" was called with the expected arguments");
            assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"],
                "\"stVizIdInSection\" is updated");
            assert.ok(this.fnBindingStub.refresh.called, "The binding of the toggle button was updated");

            fnDone();
        }.bind(this));
    });

    QUnit.test("remove several visualizations", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oVizInfo = { id: "vizId1", title: "viz title" };
        var iPageIndex = 1;
        var iSectionIndex = 5;
        var aVizIndexes = [1, 3, 5];


        var oSectionContext = {
            pageID: "page_id",
            pageTitle: "pageTitle",
            sectionID: "section_id",
            sectionTitle: "sectionTitle"
        };

        oFindVisualizationStub.returns(Promise.resolve([{
            sectionIndex: iSectionIndex,
            vizIndexes: aVizIndexes
        }]));
        oGetPageIndexStub.returns(iPageIndex);
        this.oVisualizationOrganizer.stVizIdInSection.add("fakeId");
        this.oVisualizationOrganizer.stVizIdInSection.add("vizId1");

        // Act
        this.oVisualizationOrganizer._applyOrganizationChangeToSection(this.oSource, oVizInfo, oSectionContext)
            .then(function () {
                // Assert
                assert.strictEqual(oDeleteVisualizationStub.callCount, 3,
                    "\"deleteVisualization\" was called for all visualization in the section");
                assert.deepEqual(Array.from(this.oVisualizationOrganizer.stVizIdInSection), ["fakeId"],
                    "\"stVizIdInSection\" is updated");
                assert.ok(this.fnBindingStub.refresh.called, "The binding of the toggle button was updated");

                fnDone();
            }.bind(this));
    });

    QUnit.module("okay, _organizeVisualizations, _retrieveChangedPageIds, _applyOrganizationChange", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            this.oPinButton = new Button({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oVizInfo = {
                id: "vizId",
                title: "vizTitle"
            };

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
                    this.oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
                    this.oOkayButton = sap.ui.getCore().byId("sapUshellVisualizationOrganizerOKButton");
                    this.oList = sap.ui.getCore().byId("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("_retrieveChangedPageIds returns the correct change", function (assert) {
        // Arrange
        var oExpectedResult = {
            addToPageIds: ["page1"],
            deleteFromPageIds: []
        };

        // Act
        this.aItems[1].firePress();
        var oChangedItems = this.oVisualizationOrganizer._retrieveChangedPageIds();

        // Assert
        assert.deepEqual(oChangedItems, oExpectedResult, "The result is as expected.");
    });

    QUnit.test("add on no page and delete from no page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.called, false, "addVisualizations was not called.");
            assert.strictEqual(oFindVisualizationStub.called, false, "findVisualizations was not called.");
            assert.strictEqual(oDeleteVisualizationStub.called, false, "deleteVisualizations was not called.");
            fnDone();
        });

        // Act
        this.oOkayButton.firePress();
    });

    QUnit.test("add on one page and delete from no page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.callCount, 1, "addVisualization was called once.");
            assert.deepEqual(oAddVisualizationStub.args[0], ["page1", null, "vizId"], "addVisualization was called with the correct parameters.");
            assert.strictEqual(oFindVisualizationStub.called, false, "findVisualizations was not called.");
            assert.strictEqual(oDeleteVisualizationStub.called, false, "deleteVisualizations was not called.");
            fnDone();
        });

        // Act
        this.aItems[1].firePress();
        this.oOkayButton.firePress();
    });

    QUnit.test("add on no page and delete from one page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.called, false, "addVisualizations was not called.");
            assert.strictEqual(oFindVisualizationStub.called, true, "findVisualizations was called.");
            assert.strictEqual(oDeleteVisualizationStub.callCount, 1, "deleteVisualization was called once.");
            assert.deepEqual(oDeleteVisualizationStub.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters.");
            fnDone();
        });

        // Act
        this.aItems[3].firePress();
        this.oOkayButton.firePress();
    });

    QUnit.test("add on no page and delete from one page at tree locations with two in the same group", function (assert) {
        // Arrange
        var fnDone = assert.async();
        oFindVisualizationStub.returns(Promise.resolve([
            {
                sectionIndex: 0,
                vizIndexes: [0, 1]
            },
            {
                sectionIndex: 2,
                vizIndexes: [4]
            }
        ]));
        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.called, false, "addVisualizations was not called.");
            assert.strictEqual(oFindVisualizationStub.called, true, "findVisualizations was called.");
            assert.strictEqual(oDeleteVisualizationStub.callCount, 3, "deleteVisualization was called once.");
            assert.deepEqual(oDeleteVisualizationStub.args[0], [0, 2, 4], "deleteVisualization was called with the correct parameters.");
            assert.deepEqual(oDeleteVisualizationStub.args[1], [0, 0, 1], "deleteVisualization was called with the correct parameters.");
            assert.deepEqual(oDeleteVisualizationStub.args[2], [0, 0, 0], "deleteVisualization was called with the correct parameters.");
            fnDone();
        });

        // Act
        this.aItems[3].firePress();
        this.oOkayButton.firePress();
    });

    QUnit.test("add on one page and delete from one page", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.callCount, 1, "addVisualization was called once.");
            assert.deepEqual(oAddVisualizationStub.args[0], ["page1", null, "vizId"], "addVisualization was called with the correct parameters.");
            assert.strictEqual(oFindVisualizationStub.called, true, "findVisualizations was called.");
            assert.strictEqual(oDeleteVisualizationStub.callCount, 1, "deleteVisualization was called once.");
            assert.deepEqual(oDeleteVisualizationStub.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters.");
            fnDone();
        });

        // Act
        this.aItems[1].firePress();
        this.aItems[3].firePress();
        this.oOkayButton.firePress();
    });

    QUnit.module("okay, _organizeVisualizations, _retrieveChangedItemsFromPagesList, _applyOrganizationChange", {
        beforeEach: function (assert) {
            sap.ushell.Container = oContainer;

            this.oPinButton = new Button({
                icon: "{/icon}",
                type: "{/type}",
                tooltip: "{/tooltip}"
            }).setModel(oModel);
            this.oPinButton.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            this.oVizInfo = {
                id: "vizId2",
                title: "vizTitle"
            };

            var fnDone = assert.async();
            this.oVisualizationOrganizer = new VisualizationOrganizer();
            this.oVisualizationOrganizer.requestData().then(function () {
                this.oVisualizationOrganizer.open(this.oPinButton, this.oVizInfo).then(function () {
                    this.oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
                    this.oOkayButton = sap.ui.getCore().byId("sapUshellVisualizationOrganizerOKButton");
                    this.oList = sap.ui.getCore().byId("sapUshellVisualizationOrganizerSpacesList");
                    this.aItems = this.oList.getItems();
                    fnDone();
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            this.oVisualizationOrganizer.exit();
            this.oPinButton.destroy();
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("delete from both pages", function (assert) {
        // Arrange
        var fnDone = assert.async();

        this.oPopover.attachAfterClose(function () {

            // Assert
            assert.strictEqual(oAddVisualizationStub.called, false, "addVisualization was not called.");
            assert.strictEqual(oFindVisualizationStub.called, true, "findVisualizations was called.");
            assert.strictEqual(oDeleteVisualizationStub.callCount, 2, "deleteVisualization was called once.");
            assert.deepEqual(oDeleteVisualizationStub.args[0], [0, 0, 0], "deleteVisualization was called with the correct parameters the first time.");
            assert.deepEqual(oDeleteVisualizationStub.args[1], [0, 0, 0], "deleteVisualization was called with the correct parameters the second time.");
            fnDone();
        });

        // Act
        this.aItems[1].firePress();
        this.aItems[3].firePress();
        this.oOkayButton.firePress();
    });


    QUnit.module("onHierarchyAppsPinButtonClick: Section context", {
        beforeEach: function () {

            this.oGetObjectStub = sinon.stub();
            this.oSource = {
                getParent: sinon.stub().returns({
                    getBinding: sinon.stub().returns({
                        getContext: sinon.stub().returns({
                            getObject: this.oGetObjectStub
                        })
                    })
                })
            };

            sap.ushell.Container = oContainer;
            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("Add bookmark tile to the section", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 0
        };
        this.oGetObjectStub.returns(oAppInfo);
        var oEvent = { getSource: sinon.stub().returns(this.oSource) };
        var oSectionContext = {pageID: "page_id", sectionID: "section_id"};

        var oExpectedBookmark = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            title: "SAP",
            subtitle: "website"
        };

        sinon.spy(this.oVisualizationOrganizer, "_applyBookmarkTileChangeToSection");
        sinon.spy(this.oVisualizationOrganizer, "toggle");

        // Act
        this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(oEvent, oSectionContext).then(function (bUpdate) {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyBookmarkTileChangeToSection.calledWith(
                oAppInfo,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.ok(this.oVisualizationOrganizer.toggle.notCalled, "\"toggle\" should not be called when section context is defined");
            assert.equal(oAddBookmarkToPageStub.callCount, 1, "\"addBookmarkToPage\" was called with the expected arguments" );
            assert.deepEqual(oAddBookmarkToPageStub.getCall(0).args, [oSectionContext.pageID,
                oExpectedBookmark,
                oSectionContext.sectionID
            ], "\"addBookmarkToPage\" was called with the expected arguments");
            assert.equal(bUpdate, true, "Promise should return true to update pun button status");
            fnDone();
        }.bind(this));
    });

    QUnit.test("Remove bookmark tile from the section", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };
        this.oGetObjectStub.returns(oAppInfo);
        var oEvent = { getSource: sinon.stub().returns(this.oSource) };
        var oSectionContext = {pageID: "page_id", sectionID: "section_id"};

        var oExpectedIdentifier = {
            url: "https://sap.com"
        };

        sinon.spy(this.oVisualizationOrganizer, "_applyBookmarkTileChangeToSection");
        sinon.spy(this.oVisualizationOrganizer, "toggle");

        // Act
        this.oVisualizationOrganizer.onHierarchyAppsPinButtonClick(oEvent, oSectionContext).then(function (bUpdate) {
            // Assert
            assert.ok(this.oVisualizationOrganizer._applyBookmarkTileChangeToSection.calledWith(
                oAppInfo,
                oSectionContext
            ), "\"_applyOrganizationChangeToSection\" was called with the expected arguments");
            assert.ok(this.oVisualizationOrganizer.toggle.notCalled, "\"toggle\" should not be called when section context is defined");
            assert.equal(oDeleteBookmarksStub.callCount, 1, "\"deleteBookmarks\" was called with the expected arguments" );
            assert.deepEqual(oDeleteBookmarksStub.getCall(0).args, [
                oExpectedIdentifier,
                oSectionContext.pageID,
                oSectionContext.sectionID
            ], "\"deleteBookmarks\" was called with the expected arguments");
            assert.equal(bUpdate, true, "Promise should return true to update pun button status");
            fnDone();
        }.bind(this));
    });

    QUnit.module("_applyBookmarkOrganizationChange", {
        beforeEach: function () {

            sap.ushell.Container = oContainer;
            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("Remove bookmark visualisations", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };

        var oVizualizationChanges = {
            deleteFromPageIds: ["page2"],
            addToPageIds: []
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;

        var oExpectedIdentifier = {
            url: oAppInfo.url
        };

        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVizualizationChanges).then(function () {
            // Assert
            assert.equal(oAddBookmarkStub.callCount, 0, "\"addBookmarks\" should not be called");
            assert.equal(oDeleteBookmarksStub.callCount, 1, "\"deleteBookmarks\" should be called");
            assert.deepEqual(oDeleteBookmarksStub.getCall(0).args, [
                oExpectedIdentifier,
                "page2"
            ], "\"deleteBookmarks\" was called with the expected arguments");
            fnDone();
        });
    });

    QUnit.test("Add bookmark visualisations", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 1
        };

        var oExpectedBookmark = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            title: "SAP",
            subtitle: "website"
        };
        var oExpectedContainer = {
            type: "Page",
            id: "page2",
            isContainer: true
        };

        var oVizualizationChanges = {
            addToPageIds: ["page2"],
            deleteFromPageIds: []
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;


        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVizualizationChanges).then(function () {
            // Assert
            assert.equal(oAddBookmarkStub.callCount, 1, "\"addBookmarks\" should be called");
            assert.equal(oDeleteBookmarksStub.callCount, 0, "\"deleteBookmarks\" should not be called");
            assert.deepEqual(oAddBookmarkStub.getCall(0).args, [
                oExpectedBookmark,
                oExpectedContainer
            ], "\"addBookmarks\" was called with the expected arguments");
            fnDone();
        });
    });

    QUnit.test("Not called services if there is no changes", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppInfo = {
            icon: "sap-icon://accept",
            url: "https://sap.com",
            text: "SAP",
            subtitle: "website",
            bookmarkCount: 0
        };
        this.oVisualizationOrganizer.oVizInfo = oAppInfo;
        var oVizualizationChanges = {
            addToPageIds: [],
            deleteFromPageIds: []
        };


        // Act
        this.oVisualizationOrganizer._applyBookmarkOrganizationChange(oVizualizationChanges).then(function () {
            // Assert
            assert.equal(oAddBookmarkStub.callCount, 0, "\"addBookmarks\" should not be called");
            assert.equal(oDeleteBookmarksStub.callCount, 0, "\"deleteBookmarks\" should not be called");
            fnDone();
        });
    });

    QUnit.module("updateBookmarkCount", {
        beforeEach: function () {

            sap.ushell.Container = oContainer;
            this.oVisualizationOrganizer = new VisualizationOrganizer();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            _resetStubs();
        }
    });

    QUnit.test("update bookmark count", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aApps = [{
            url: "https://sap.com",
            text: "SAP"
        }, {
            url: "https://baz.com",
            text: "foo"
        }];

        oFindBookmarksStub.withArgs({url: "https://sap.com"}).returns(Promise.resolve([]));
        oFindBookmarksStub.withArgs({url: "https://baz.com"}).returns(Promise.resolve([{pageId: "somePage"}]));

        var aExpected = [{
            url: "https://sap.com",
            text: "SAP",
            bookmarkCount: 0
        }, {
            url: "https://baz.com",
            text: "foo",
            bookmarkCount: 1
        }];

        // Act
        this.oVisualizationOrganizer.updateBookmarkCount(aApps).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpected, "bookmarkCount should be updated correctly");
            fnDone();
        });
    });

    QUnit.test("update bookmark count in section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aApps = [{
            url: "https://sap.com",
            text: "SAP"
        }, {
            url: "https://baz.com",
            text: "foo"
        }];

        oFindBookmarksStub.withArgs({url: "https://sap.com"}).returns(Promise.resolve([{pageId: "somePage", sectionId: "baz"}]));
        oFindBookmarksStub.withArgs({url: "https://baz.com"}).returns(Promise.resolve([{pageId: "somePage", sectionId: "foo"}]));

        var oSectionContext = {
            pageID:  "somePage",
            sectionID: "baz"
        };

        var aExpected = [{
            url: "https://sap.com",
            text: "SAP",
            bookmarkCount: 1
        }, {
            url: "https://baz.com",
            text: "foo",
            bookmarkCount: 0
        }];

        // Act
        this.oVisualizationOrganizer.updateBookmarkCount(aApps, oSectionContext).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpected, "bookmarkCount should be updated correctly");
            fnDone();
        });
    });


});
