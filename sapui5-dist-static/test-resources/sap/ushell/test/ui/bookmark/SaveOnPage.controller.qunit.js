// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.bookmark.SaveOnPage.controller
 */
sap.ui.require([
    "sap/ushell/ui/bookmark/SaveOnPage.controller",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/base/Log",
    "sap/ui/core/library"
], function (
    SaveOnPageController,
    resources,
    JSONModel,
    hasher,
    Log,
    coreLibrary
) {
    "use strict";

    /*global QUnit sinon */

    var sandbox = sinon.createSandbox();

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    QUnit.module("onInit", {
        beforeEach: function () {
            this.oViewData = {};
            this.oController = new SaveOnPageController();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub().returns({
                setProperty: this.oSetPropertyStub
            });
            this.oSetModelStub = sandbox.stub();
            this.oGetViewDataStub = sandbox.stub().returns(this.oViewData);
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                setModel: this.oSetModelStub,
                getModel: this.oGetModelStub,
                getViewData: this.oGetViewDataStub
            });

            this.oByIdStub = sandbox.stub(this.oController, "byId");

            this.oAttachLiveChangeStub = sandbox.stub();
            this.oByIdStub.withArgs("bookmarkTitleInput").returns({
                attachLiveChange: this.oAttachLiveChangeStub
            });
            this.oAttachSelectionFinishStub = sandbox.stub();
            this.oByIdStub.withArgs("pageSelect").returns({
                attachSelectionFinish: this.oAttachSelectionFinishStub
            });

            sandbox.stub(resources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Sets i18n Model", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 1, "The function setModel was called once.");
        assert.deepEqual(this.oSetModelStub.getCall(0).args, [resources.i18nModel, "i18n"], "The function setModel was called with correct parameters.");
    });

    QUnit.test("Attaches the TitleInput liveChange event", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oAttachLiveChangeStub.callCount, 1, "attached to the event");
    });

    QUnit.test("Attached handler sets the TitleInput ValueState to Error", function (assert) {
        // Arrange
        var oScope = {
            getValue: sandbox.stub().returns(""),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachLiveChangeStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.getCall(0).args[0], "bookmarkTitleInputError", "set the correct ValueStateText");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.Error, "set the ValueState to Error");
    });

    QUnit.test("Attached handler sets the TitleInput ValueState to None", function (assert) {
        // Arrange
        var oScope = {
            getValue: sandbox.stub().returns("some Title"),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachLiveChangeStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.callCount, 0, "setValueStateText was not called");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.None, "set the ValueState to None");
    });

    QUnit.test("Attaches the PageInput attachSelectionFinish event", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oAttachSelectionFinishStub.callCount, 1, "attached to the event");
    });

    QUnit.test("Attached handler sets the PageInput ValueState to Error", function (assert) {
        // Arrange
        var oScope = {
            getSelectedKeys: sandbox.stub().returns([]),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachSelectionFinishStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.getCall(0).args[0], "bookmarkPageSelectError", "set the correct ValueStateText");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.Error, "set the ValueState to Error");
    });

    QUnit.test("Attached handler sets the PageInput ValueState to None", function (assert) {
        // Arrange
        var oScope = {
            getSelectedKeys: sandbox.stub().returns(["somePageId"]),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachSelectionFinishStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.callCount, 0, "setValueStateText was not called");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.None, "set the ValueState to None");
    });

    QUnit.module("removeFocusFromTile");

    QUnit.test("Removes attribute 'tabindex' from tile preview", function (assert) {
        // Arrange
        var oController = new SaveOnPageController();
        var oDomElement = document.createElement("div");
        var oGenericTile = document.createElement("div");
        oGenericTile.setAttribute("class", "sapMGT");
        oGenericTile.setAttribute("tabindex", "0");
        oDomElement.appendChild(oGenericTile);

        this.oGetDomRefStub = sandbox.stub().returns(oDomElement);
        this.oGetViewStub = sandbox.stub(oController, "getView").returns({
            getDomRef: this.oGetDomRefStub
        });

        // Act
        oController.removeFocusFromTile();

        // Assert
        assert.notOk(oDomElement.getAttribute("tabindex"), "The attribute 'tabindex' was removed.");

        // Clean up
        sandbox.restore();
        oController.destroy();
    });

    QUnit.module("getBookmarkTileData", {
        beforeEach: function () {
            this.oController = new SaveOnPageController();
            this.oModel = new JSONModel({
                title: "  title",
                subtitle: "subtitle  ",
                icon: "icon",
                info: "info  ",
                numberUnit: "Days Overdue",
                serviceRefreshInterval: "serviceRefreshInterval",
                keywords: "keywords"
            });
            this.oViewData = {
                serviceUrl: "ServiceUrl"
            };

            this.oGetModelStub = sandbox.stub().returns(this.oModel);
            this.oGetViewDataStub = sandbox.stub().returns(this.oViewData);
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub,
                getViewData: this.oGetViewDataStub
            });

            this.oGetSelectedKeysStub = sinon.stub().returns(["page1"]);
            this.oByIdStub = sandbox.stub(this.oController, "byId").returns({
                getSelectedKeys: this.oGetSelectedKeysStub
            });

            this.oGetHashStub = sandbox.stub(hasher, "getHash").returns("hash");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns default values when the tile data is not available", function (assert) {
        // Arrange
        this.oGetModelStub.returns(new JSONModel({}));
        this.oGetViewDataStub.returns({});
        this.oGetHashStub.returns();
        this.oByIdStub.returns();

        var oExpectedResult = {
            title: "",
            subtitle: "",
            url: window.location.href,
            icon: undefined,
            info: "",
            numberUnit: undefined,
            serviceUrl: undefined,
            serviceRefreshInterval: undefined,
            pages: [],
            keywords: undefined
        };

        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected result was returned.");
    });

    QUnit.test("Gets bookmark tile data and removes trailing white spaces, then returns then data", function (assert) {
        // Arrange
        var oExpectedResult = {
            title: "title",
            subtitle: "subtitle",
            url: "#hash",
            icon: "icon",
            info: "info",
            numberUnit: "Days Overdue",
            serviceUrl: "ServiceUrl",
            serviceRefreshInterval: "serviceRefreshInterval",
            keywords: "keywords",
            pages: ["page1"]
        };

        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected result was returned.");
    });

    QUnit.test("Uses the customer url as url when it is provided as a string in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: "customUrl"
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.url, "customUrl", "The expected result was returned.");
    });

    QUnit.test("Calculates and uses the customer url as url when it is provided as a function in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: function () {
                return "customUrl";
            }
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.url, "customUrl", "The expected result was returned.");
    });

    QUnit.test("Calculates and uses the service url as url when it is provided as a function in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            serviceUrl: function () {
                return "serviceUrl";
            }
        });
        this.oViewData = {};
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.serviceUrl, "serviceUrl", "The expected result was returned.");
    });

    QUnit.module("loadPagesIntoModel", {
        beforeEach: function () {
            this.oMenuServiceFake = {
                getSpacesPagesHierarchy: function () {
                    return Promise.resolve({
                        spaces: [{
                            title: "Space 2",
                            id: "space02",
                            pages: [{
                                title: "Space 2",
                                id: "page2"
                            }]
                        }, {
                            title: "Space 5",
                            id: "space05",
                            pages: [{
                                title: "Page 4",
                                id: "page4"
                            }, {
                                title: "Page 5",
                                id: "page5"
                            }]
                        }]
                    });
                }
            };
            this.oGetAllPagesStub = sandbox.stub().resolves(
                [{
                        identification: {
                            id: "page2",
                            title: "Page 2"
                        }
                    },
                    {
                        identification: {
                            id: "page5",
                            title: "Page 5"
                        }
                    }
                ]
            );
            this.oCommonDataModelServiceFake = {
                getAllPages: this.oGetAllPagesStub
            };
            this.oUshellContainerGetServiceAsyncStub = sandbox.stub();
            this.oUshellContainerGetServiceAsyncStub.withArgs("Menu").resolves(this.oMenuServiceFake);
            this.oUshellContainerGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCommonDataModelServiceFake);
            sap.ushell.Container = {
                getServiceAsync: this.oUshellContainerGetServiceAsyncStub
            };
            this.oController = new SaveOnPageController();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub().returns({
                setProperty: this.oSetPropertyStub
            });
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });
            this.oLogErrorStub = sandbox.stub(Log, "error");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Loads target pages into model and filter out non-existing pages", function (assert) {
        // Arrange
        var oExpectedResult = [
            {
                id: "page2",
                title: "Page 2",
                spaceTitle: "Space 2"
            },
            {
                id: "page5",
                title: "Page 5",
                spaceTitle: "Space 5"
            }
        ];

        // Act
        return this.oController.loadPagesIntoModel(/*bShowPageSelection*/true, /*aPages*/undefined)
            .then(function () {
                // Assert
                assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/pages", oExpectedResult], "The correct target pages were returned.");

            }.bind(this));
    });

    QUnit.test("Outputs a log error and update the model when the menu service cannot be loaded", function (assert) {
        // Arrange
        this.oUshellContainerGetServiceAsyncStub.withArgs("Menu").rejects();

        // Act
        return this.oController.loadPagesIntoModel(/*bShowPageSelection*/ true, /*aPages*/ undefined)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSetPropertyStub.callCount, 2, "The function setProperty was called twice.");
                assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/pages", []], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/cannotLoadPages", true], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["SaveOnPage controller: Unable to determine or use targets for bookmark placement."], "The correct error message was used.");
            }.bind(this));
    });

    QUnit.test("Outputs a log error and update the model when the common data model service cannot be loaded", function (assert) {
        // Arrange
        this.oUshellContainerGetServiceAsyncStub.withArgs("CommonDataModel").rejects();

        // Act
        return this.oController.loadPagesIntoModel(/*bShowPageSelection*/ true, /*aPages*/ undefined)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSetPropertyStub.callCount, 2, "The function setProperty was called twice.");
                assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/pages", []], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/cannotLoadPages", true], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["SaveOnPage controller: Unable to determine or use targets for bookmark placement."], "The correct error message was used.");
            }.bind(this));
    });

    QUnit.test("Outputs a log error and update the model when no page cannot be loaded", function (assert) {
        // Arrange
        this.oGetAllPagesStub.resolves([]);

        // Act
        return this.oController.loadPagesIntoModel(/*bShowPageSelection*/ true, /*aPages*/ undefined)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSetPropertyStub.callCount, 2, "The function setProperty was called twice.");
                assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/pages", []], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/cannotLoadPages", true], "The property '/pages' in the model was set correctly.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["SaveOnPage controller: Unable to determine or use targets for bookmark placement."], "The correct error message was used.");
            }.bind(this));
    });
});
