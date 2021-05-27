// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.VisualizationOrganizerHelper
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/m/library",
    "sap/ushell/components/appfinder/VisualizationOrganizerHelper",
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/Config",
    "sap/ushell/EventHub"
], function (
    mobileLibrary,
    VisualizationOrganizerHelper,
    VisualizationOrganizer,
    Config,
    EventHub
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /* global QUnit, sinon */

    QUnit.start();

    QUnit.module("⚫ Spaces DISABLED", {
        before: function () {
            this.oEventHubOffStub = sinon.stub();
            this.oEventHubStubs = {
                on: sinon.stub(EventHub, "on").returns({
                    do: sinon.stub().callsArgWith(0, "Shell-appFinder").returns({
                        off: this.oEventHubOffStub
                    })
                })
            };
            this.oAppFinderContextStubs = {
                formatPinButtonTooltip: sinon.stub(),
                formatPinButtonSelectState: sinon.stub(),
                formatPinButtonIcon: sinon.stub(),
                formatPinButtonType: sinon.stub(),
                getGroupContext: sinon.stub(),
                getGroupNavigationContext: sinon.stub(),
                _updateModelWithGroupContext: sinon.stub(),
                getController_onTilePinButtonClick: sinon.stub()
            };

            this.oHierarchyAppContextStub = {
                showGroupListPopover: sinon.stub(),
                updateBookmarkCount: sinon.stub(),
                formatPinButtonTooltip: sinon.stub()
            };
        },
        beforeEach: function () {
            this.oAppFinderContextStubs.getController = sinon.stub().returns({
                onTilePinButtonClick: this.oAppFinderContextStubs.getController_onTilePinButtonClick
            });
            this.oConfigLastStub = sinon.stub(Config, "last").returns(false);
            this.oVisualizationOrganizerHelper = VisualizationOrganizerHelper.getInstance();
        },
        afterEach: function () {
            this.oEventHubOffStub.reset();
            Object.keys(this.oAppFinderContextStubs).forEach(function (key) {
                this.oAppFinderContextStubs[key].reset();
            }.bind(this));
            this.oConfigLastStub.restore();
        },
        after: function () {
            Object.keys(this.oEventHubStubs).forEach(function (key) {
                this.oEventHubStubs[key].restore();
            }.bind(this));
        }
    });

    QUnit.test("formatPinButtonTooltip", function (assert) {
        // Arrange
        var aGroupsIDs = [1, 2, 3],
            oGroupContext = {
                id: "group1",
                path: "/groups/0",
                title: "Group 1"
            },
            args = [
                aGroupsIDs,
                oGroupContext,
                "someVizId"
            ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.deepEqual(this.oAppFinderContextStubs.formatPinButtonTooltip.args[0], [aGroupsIDs, oGroupContext],
            "The original handler was called with the array of group Ids and the group context");
    });

    QUnit.test("formatPinButtonSelectState", function (assert) {
        // Arrange
        var args = [
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonSelectState.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.deepEqual(this.oAppFinderContextStubs.formatPinButtonSelectState.args[0], args,
            "The original handler was called with the original arguments");
    });

    QUnit.test("formatPinButtonIcon", function (assert) {
        // Arrange
        var args = ["vizId"];

        // Act
        var icon = this.oVisualizationOrganizerHelper.formatPinButtonIcon.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(icon, "sap-icon://pushpin-off", "The handler was called and returned the expected value");
    });

    QUnit.test("formatPinButtonType", function (assert) {
        // Arrange
        var args = ["vizId"];

        // Act
        var type = this.oVisualizationOrganizerHelper.formatPinButtonType.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(type, ButtonType.Default, "The handler was called and returned the expected value");
    });

    QUnit.test("onTilePinButtonClick", function (assert) {
        // Arrange
        var oEvent = { someEventProperties: "someValue" };

        // Act
        this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

        // Assert
        assert.ok(this.oAppFinderContextStubs.getController_onTilePinButtonClick.calledOnceWith(oEvent),
            "The original handler was called with the original arguments");
    });

    QUnit.test("exit", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.exit();

        // Assert
        assert.notOk(this.oEventHubOffStub.calledOnce, "The EventHub doable \"off\" was NOT called");
    });

    QUnit.test("getNavigationContext", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.getNavigationContext.call(
            this.oAppFinderContextStubs,
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs.getGroupContext.calledOnce);
        assert.deepEqual(
            this.oAppFinderContextStubs.getGroupContext.getCall(0).args,
            [
                [1, 2, 3],
                5,
                "/TEST/CONTEXT/PATH",
                "TEST-CONTEXT-ID"
            ],
            "The arguments should be transfered"
        );
    });

    QUnit.test("getNavigationContextAsText", function (assert) {
        // Act
        this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(
            this.oAppFinderContextStubs,
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs.getGroupNavigationContext.calledOnce);
        assert.deepEqual(
            this.oAppFinderContextStubs.getGroupNavigationContext.getCall(0).args,
            [
                [1, 2, 3],
                5,
                "/TEST/CONTEXT/PATH",
                "TEST-CONTEXT-ID"
            ],
            "The arguments should be transfered"
        );
    });

    QUnit.test("updateModelWithContext", function (assert) {
        // Arrange
        var oSectionContext = {
            pageID: "some_page",
            sectionID: "some_section"
        };

        // Act
        this.oVisualizationOrganizerHelper.updateModelWithContext.call(
            this.oAppFinderContextStubs,
            oSectionContext
        );

        // Assert
        assert.ok(this.oAppFinderContextStubs._updateModelWithGroupContext.called);
        assert.deepEqual(this.oAppFinderContextStubs._updateModelWithGroupContext.getCall(0).args, [oSectionContext], "The arguments should be transfered");
    });

    QUnit.test("onHierarchyAppsPinButtonClick", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oEvent = { someEventProperties: "someValue" };

        // Act
        this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent)
            .then(function (bUpdate) {
                // Assert
                assert.ok(this.oHierarchyAppContextStub.showGroupListPopover.calledOnceWith(oEvent),
                    "The original handler was called with the original arguments");
                assert.equal(bUpdate, false, "Don't need aditional update of the pin button status");
                fnDone();
            }.bind(this));
    });

    QUnit.test("updateBookmarkCount", function (assert) {
        // Arrange
        var aAppsData = [{ someProperties: "someValue" }];

        // Act
        this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);
        // Assert
        assert.ok(this.oHierarchyAppContextStub.updateBookmarkCount.calledOnceWith(aAppsData),
            "The original handler was called with the original arguments");
    });

    QUnit.test("formatBookmarkPinButtonSelectState: return resultat based on the bookmarkCount", function (assert) {
        // Arrange
        var bSelectedState;
        // Act
        bSelectedState = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(0);
        // Assert
        assert.equal(bSelectedState, false, "Button is not selected if bookmarkCount is 0");

        // Act
        bSelectedState = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(1);
        // Assert
        assert.equal(bSelectedState, true, "Button is selected if bookmarkCount more than 0");
    });

    QUnit.test("formatBookmarkPinButtonIcon", function (assert) {
        // Act
        var sIcon = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(0);
        // Assert
        assert.equal(sIcon, "sap-icon://pushpin-off", "Correct icon is returned");
    });

    QUnit.test("formatBookmarkPinButtonType", function (assert) {
        // Act
        var sType = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(0);
        // Assert
        assert.equal(sType, "Default", "Correct button type is returned");
    });

    QUnit.test("formatBookmarkPinButtonTooltip", function (assert) {
        // Arrange
        var aGroupsIDs = [1, 2, 3],
            args = [
                aGroupsIDs,
                0
            ];

        // Act
        this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oHierarchyAppContextStub, args);

        // Assert
        assert.deepEqual(this.oHierarchyAppContextStub.formatPinButtonTooltip.args[0], [aGroupsIDs, 0],
            "The original handler was called with the array of group Ids and the group context");
    });

    QUnit.module("🟢 Spaces ENABLED", {
        before: function () {
            this.oEventHubOffStub = sinon.stub();
            this.oEventHubStubs = {
                on: sinon.stub(EventHub, "on").returns({
                    do: sinon.stub().callsArgWith(0, "Shell-appFinder").returns({
                        off: this.oEventHubOffStub
                    })
                })
            };

            this.oVisualizationOrganizerStubs = {
                requestData: sinon.stub(VisualizationOrganizer.prototype, "requestData"),
                setModel: sinon.stub(VisualizationOrganizer.prototype, "setModel"),
                formatPinButtonTooltip: sinon.stub(VisualizationOrganizer.prototype, "formatPinButtonTooltip"),
                formatPinButtonIcon: sinon.stub(VisualizationOrganizer.prototype, "formatPinButtonIcon"),
                formatPinButtonType: sinon.stub(VisualizationOrganizer.prototype, "formatPinButtonType"),
                onTilePinButtonClick: sinon.stub(VisualizationOrganizer.prototype, "onTilePinButtonClick"),
                loadSectionContext: sinon.stub(VisualizationOrganizer.prototype, "loadSectionContext"),
                onHierarchyAppsPinButtonClick: sinon.stub(VisualizationOrganizer.prototype, "onHierarchyAppsPinButtonClick"),
                updateBookmarkCount: sinon.stub(VisualizationOrganizer.prototype, "updateBookmarkCount"),
                formatBookmarkPinButtonTooltip: sinon.stub(VisualizationOrganizer.prototype, "formatBookmarkPinButtonTooltip")
            };
            this.oAppFinderContextStubs = {
                formatPinButtonTooltip: sinon.stub(),
                formatPinButtonSelectState: sinon.stub(),
                formatPinButtonIcon: sinon.stub(),
                formatPinButtonType: sinon.stub(),
                getController_onTilePinButtonClick: sinon.stub(),
                _updateShellHeader: sinon.stub()
            };
            this.oHierarchyAppContextStub = {
                showGroupListPopover: sinon.stub(),
                updateBookmarkCount: sinon.stub(),
                formatPinButtonTooltip: sinon.stub()
            };
        },
        beforeEach: function () {
            this.oAppFinderContextStubs.getController = sinon.stub().returns({
                onTilePinButtonClick: this.oAppFinderContextStubs.getController_onTilePinButtonClick
            });
            this.fnUpdateBindingStub = sinon.stub();
            this.fnSetTitleStub = sinon.stub();
            this.oAppFinderContextStubs.oView = {
                getModel: sinon.stub().returns({
                    updateBindings: this.fnUpdateBindingStub
                }),
                oPage: {
                    setTitle: this.fnSetTitleStub
                }
            };
            this.oVisualizationOrganizerStubs.requestData.returns(Promise.resolve());
            this.oConfigLastStub = sinon.stub(Config, "last").returns(true);
            this.oVisualizationOrganizerHelperStubs = {
                getCatalogView: sinon.stub(sap.ui.getCore(), "byId").returns({ setBusy: sinon.stub() })
            };
            this.oVisualizationOrganizerHelper = VisualizationOrganizerHelper.getInstance();
        },
        afterEach: function () {
            delete this.oAppFinderContextStubs.oView;
            Object.keys(this.oAppFinderContextStubs).forEach(function (key) {
                this.oAppFinderContextStubs[key].reset();
            }.bind(this));
            Object.keys(this.oVisualizationOrganizerStubs).forEach(function (key) {
                this.oVisualizationOrganizerStubs[key].reset();
            }.bind(this));
            Object.keys(this.oVisualizationOrganizerHelperStubs).forEach(function (key) {
                this.oVisualizationOrganizerHelperStubs[key].restore();
            }.bind(this));
            this.oConfigLastStub.restore();
            this.oVisualizationOrganizerHelper._setSectionContext(null);
            VisualizationOrganizerHelper.destroy();
            this.oEventHubOffStub.reset();
        },
        after: function () {
            Object.keys(this.oEventHubStubs).forEach(function (key) {
                this.oEventHubStubs[key].restore();
            }.bind(this));
            Object.keys(this.oVisualizationOrganizerStubs).forEach(function (key) {
                this.oVisualizationOrganizerStubs[key].restore();
            }.bind(this));
        }
    });

    QUnit.test("loadVisualizationOrganizer", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function (VisualizationOrganizer1) {
            this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function (VisualizationOrganizer2) {
                // Assert
                assert.strictEqual(typeof VisualizationOrganizer1, "object", "Resolves to an instance");
                assert.strictEqual(VisualizationOrganizer1, VisualizationOrganizer2, "Always resolves to the same instance");

                fnDone();
            });
        }.bind(this));
    });

    QUnit.test("setModel", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oUpdateBindingsStub = sinon.stub();
        VisualizationOrganizerHelper.destroy();
        var oHelper = VisualizationOrganizerHelper.getInstance();

        // Act
        oHelper.setModel({ updateBindings: oUpdateBindingsStub });
        oHelper._loadVisualizationOrganizer()
            .then(this.oVisualizationOrganizerStubs.requestData)
            .then(function () {
                // Assert
                assert.ok(oUpdateBindingsStub.calledOnce, "\"updateBindings\" was called");

                fnDone();
            });
    });

    QUnit.test("formatPinButtonTooltip", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            aGroupsIDs = [1, 2, 3],
            oGroupContext = {
                id: "group1",
                path: "/groups/0",
                title: "Group 1"
            },
            args = [
                aGroupsIDs,
                oGroupContext,
                "someVizId"
            ];

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper.formatPinButtonTooltip.apply(this.oAppFinderContextStubs, args);

            // Assert
            assert.strictEqual(this.oAppFinderContextStubs.formatPinButtonTooltip.callCount, 0,
                "The original handler was not called.");
            assert.strictEqual(this.oVisualizationOrganizerStubs.formatPinButtonTooltip.args[0][0], "someVizId",
                "The call was forwarded to the VisualizationOrganizer with the vizId");

            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonSelectState", function (assert) {
        // Arrange
        var args = [
            [1, 2, 3],
            5,
            "/TEST/CONTEXT/PATH",
            "TEST-CONTEXT-ID"
        ];

        // Act
        var bState = this.oVisualizationOrganizerHelper.formatPinButtonSelectState.apply(this.oAppFinderContextStubs, args);

        // Assert
        assert.strictEqual(bState, false, "The handler was called and returned the expected value");
    });

    QUnit.test("formatPinButtonIcon: without section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var vizId = "VISUALIZATION_ID";

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper.formatPinButtonIcon.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonIcon.calledOnceWith(vizId),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonIcon: with section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var vizId = "VISUALIZATION_ID";
        var oSectionContext = { pageId: "test_page" };

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.formatPinButtonIcon.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonIcon.calledOnceWith(vizId, true),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonType: without section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var vizId = "VISUALIZATION_ID";

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper.formatPinButtonType.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonType.calledOnceWith(vizId, false),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("formatPinButtonType: with section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var vizId = "VISUALIZATION_ID";
        var oSectionContext = { pageId: "test_page" };


        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.formatPinButtonType.call(this.oAppFinderContextStubs, vizId);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.formatPinButtonType.calledOnceWith(vizId, true),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("onTilePinButtonClick: without section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oTileData = { someProperty: "someValue" };
        var oProperty = { getProperty: sinon.stub().returns(oTileData) };
        var oSource = { getBindingContext: sinon.stub().returns(oProperty) };
        var oEvent = { getSource: sinon.stub().returns(oSource) };

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.onTilePinButtonClick.calledOnceWith(oEvent, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("onTilePinButtonClick: with section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oTileData = { someProperty: "someValue" };
        var oProperty = { getProperty: sinon.stub().returns(oTileData) };
        var oSource = { getBindingContext: sinon.stub().returns(oProperty) };
        var oEvent = { getSource: sinon.stub().returns(oSource) };
        var oSectionContext = { pageId: "test_page" };

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.onTilePinButtonClick.call(this.oAppFinderContextStubs, oEvent);

            // Assert
            assert.ok(this.oVisualizationOrganizerStubs.onTilePinButtonClick.calledOnceWith(oEvent, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("getNavigationContext returns pageId and sectionID as object", function (assert) {
        // Arrange
        var oContext = {
            pageID: "page_id1",
            pageTitle: "page_title",
            sectionID: "section_id1",
            sectionTitle: "section_title"
        };
        this.oVisualizationOrganizerHelper._setSectionContext(oContext);

        // Act
        var oResult = this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs);
        // Assert
        assert.deepEqual(oResult, {
            pageID: oContext.pageID,
            sectionID: oContext.sectionID
        }, "Only page and section ids are returned");

    });

    QUnit.test("getNavigationContext returns null when there is no sessionContext", function (assert) {
        // Arrange
        this.oVisualizationOrganizerHelper._setSectionContext(null);
        // Act
        var oResult = this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs);
        // Assert
        assert.equal(oResult, null, "getNavigationContext returns null when there is no sessionContext");

    });

    QUnit.test("getNavigationContextAsText returns string of pageId and sectionId", function (assert) {
        // Arrange
        var oContext = {
            pageID: "page_id1",
            pageTitle: "page_title",
            sectionID: "section_id1",
            sectionTitle: "section_title"
        };
        this.oVisualizationOrganizerHelper._setSectionContext(oContext);

        // Act
        var oResult = this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(this.oAppFinderContextStubs);
        // Assert
        assert.deepEqual(oResult, JSON.stringify({
            pageID: oContext.pageID,
            sectionID: oContext.sectionID
        }), "Only page and section ids are returned");

    });

    QUnit.test("getNavigationContextAsText returns null when there is no sessionContext", function (assert) {
        // Arrange
        this.oVisualizationOrganizerHelper._setSectionContext(null);
        // Act
        var oResult = this.oVisualizationOrganizerHelper.getNavigationContextAsText.call(this.oAppFinderContextStubs);
        // Assert
        assert.equal(oResult, null, "getNavigationContextAsText returns null when there is no sessionContext");

    });

    QUnit.test("updateModelWithContext update the sectionContext", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oSectionContext = {
                pageID: "some_page",
                pageTitle: "page_title",
                sectionID: "some_section",
                sectionTitle: "Test"
            };

        this.oVisualizationOrganizerStubs.loadSectionContext.returns(Promise.resolve(oSectionContext));

        // Act
        this.oVisualizationOrganizerHelper.updateModelWithContext.call(this.oAppFinderContextStubs).then(function () {
            // Assert
            try {
                sinon.assert.callOrder(this.fnUpdateBindingStub, this.fnSetTitleStub, this.oAppFinderContextStubs._updateShellHeader);
                assert.ok(true, "the function call order is correct");
            } catch (error) {
                assert.ok(false, "the function call order is not correct");
            }
            assert.deepEqual(this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs), {
                pageID: oSectionContext.pageID,
                sectionID: oSectionContext.sectionID
            }, "Section context was updated");
            fnDone();
        }.bind(this));
    });

    QUnit.test("updateModelWithContext: not update title, if there is not section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oVisualizationOrganizerStubs.loadSectionContext.returns(Promise.resolve(null));
        this.oVisualizationOrganizerHelper._setSectionContext({});

        // Act
        this.oVisualizationOrganizerHelper.updateModelWithContext.call(this.oAppFinderContextStubs).then(function () {
            // Assert
            assert.ok(this.fnUpdateBindingStub.calledOnce, "binding should be updated with new context");
            assert.ok(this.fnSetTitleStub.notCalled, "The title should not be updated if context is null");
            assert.deepEqual(this.oVisualizationOrganizerHelper.getNavigationContext.call(this.oAppFinderContextStubs), null, "Section context was updated");
            fnDone();
        }.bind(this));
    });

    QUnit.test("onHierarchyAppsPinButtonClick: without section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppData = { someProperty: "someValue" };
        var oSource = {
            getParent: sinon.stub().returns({
                getBinding: sinon.stub().returns({
                    getContext: sinon.stub().returns({
                        getObject: sinon.stub.returns(oAppData)
                    })
                })
            })
        };
        var oEvent = { getSource: sinon.stub().returns(oSource) };

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.showGroupListPopover.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.onHierarchyAppsPinButtonClick.calledOnceWith(oEvent, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("onHierarchyAppsPinButtonClick: with section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oAppData = { someProperty: "someValue" };
        var oSource = {
            getParent: sinon.stub().returns({
                getBinding: sinon.stub().returns({
                    getContext: sinon.stub().returns({
                        getObject: sinon.stub.returns(oAppData)
                    })
                })
            })
        };
        var oEvent = { getSource: sinon.stub().returns(oSource) };
        var oSectionContext = { pageId: "test_page" };

        // Act
        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            this.oVisualizationOrganizerHelper.onHierarchyAppsPinButtonClick.call(this.oHierarchyAppContextStub, oEvent);

            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.showGroupListPopover.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.onHierarchyAppsPinButtonClick.calledOnceWith(oEvent, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");

            fnDone();
        }.bind(this));
    });

    QUnit.test("formatBookmarkPinButtonSelectState", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonSelectState(1);
        // Assert
        assert.equal(oResult, false, "formatBookmarkPinButtonSelectState return false for space mode");
    });

    QUnit.test("formatBookmarkPinButtonIcon: not bookmark tiles on pages", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(0);
        // Assert
        assert.equal(oResult, "sap-icon://add", "return add button if bookmarkCount is 0");
    });

    QUnit.test("formatBookmarkPinButtonIcon: bookmark tiles were found on pages", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonIcon(2);
        // Assert
        assert.equal(oResult, "sap-icon://accept", "return accept button if bookmarkCount is bigger 0");
    });

    QUnit.test("formatBookmarkPinButtonType: not bookmark tiles on pages", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(0);
        // Assert
        assert.equal(oResult, "Default", "Default if bookmarkCount is 0");
    });

    QUnit.test("formatBookmarkPinButtonType: bookmark tiles were found on pages", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVisualizationOrganizerHelper.formatBookmarkPinButtonType(2);
        // Assert
        assert.equal(oResult, "Emphasized", "return Emphasized if bookmarkCount is bigger 0");
    });

    QUnit.test("updateBookmarkCount: without section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aAppsData = [{ someProperty: "someValue" }];

        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            // Act
            this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);
            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.updateBookmarkCount.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.updateBookmarkCount.calledOnceWith(aAppsData, null),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
            fnDone();
        }.bind(this));
    });

    QUnit.test("updateBookmarkCount: with section context", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var aAppsData = [{ someProperty: "someValue" }];
        var oSectionContext = { pageId: "test_page" };

        this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
            this.oVisualizationOrganizerHelper._setSectionContext(oSectionContext);
            // Act
            this.oVisualizationOrganizerHelper.updateBookmarkCount.call(this.oHierarchyAppContextStub, aAppsData);
            // Assert
            assert.strictEqual(this.oHierarchyAppContextStub.updateBookmarkCount.callCount, 0,
                "The original handler was not called.");
            assert.ok(this.oVisualizationOrganizerStubs.updateBookmarkCount.calledOnceWith(aAppsData, oSectionContext),
                "The call was forwarded to the VisualizationOrganizer with the original argument");
            fnDone();
        }.bind(this));
    });

    QUnit.test("formatBookmarkPinButtonTooltip: forward request to component", function (assert) {
        // Arrange
         var fnDone = assert.async();

         // Act
         this.oVisualizationOrganizerHelper._loadVisualizationOrganizer().then(function () {
             this.oVisualizationOrganizerHelper.formatBookmarkPinButtonTooltip.call(this.oHierarchyAppContextStub, [], 3);

             // Assert
             assert.ok(this.oVisualizationOrganizerStubs.formatBookmarkPinButtonTooltip.calledOnceWith(3),
                 "The call was forwarded to the VisualizationOrganizer");

             fnDone();
         }.bind(this));
    });

    QUnit.test("exit", function (assert) {
        // Act
        VisualizationOrganizerHelper.destroy();
        // Assert
        assert.ok(this.oEventHubOffStub.calledOnce, "The EventHub doable \"off\" was called");
    });

});
