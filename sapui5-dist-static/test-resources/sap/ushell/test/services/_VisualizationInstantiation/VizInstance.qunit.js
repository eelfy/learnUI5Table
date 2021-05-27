// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._VisualizationInstantiation.VizInstance
 */

QUnit.config.autostart = false;
sap.ui.require([
    "sap/base/util/includes",
    "sap/f/Card",
    "sap/f/GridContainerItemLayoutData",
    "sap/m/ActionSheet",
    "sap/m/Button",
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/m/VBox",
    "sap/ui/core/Control",
    "sap/ui/core/XMLComposite",
    "sap/ui/events/PseudoEvents",
    "sap/ushell/library",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ushell/resources",
    "sap/m/FrameType"
], function (
    includes,
    Card,
    GridContainerItemLayoutData,
    ActionSheet,
    Button,
    GenericTile,
    mobileLibrary,
    VBox,
    Control,
    XMLComposite,
    PseudoEvents,
    ushellLibrary,
    VizInstance,
    resources,
    FrameType
) {
    "use strict";

    /* global QUnit, sinon */

    var LoadState = mobileLibrary.LoadState;
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    QUnit.start();
    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor");

    QUnit.test("Creates an instance of XMLComposite", function (assert) {
        // Act
        var oVizInstance = new VizInstance();

        // Assert
        assert.ok(oVizInstance instanceof XMLComposite, "Correctly creates an instance of XMLComposite.");
        assert.strictEqual(oVizInstance.getTitle(), "", "The default title was correctly set.");
        assert.strictEqual(oVizInstance.getSubtitle(), "", "The default subtitle was correctly set.");
        assert.strictEqual(oVizInstance.getInfo(), "", "The default info was correctly set.");
        assert.strictEqual(oVizInstance.getIcon(), "", "The default icon was correctly set.");
        assert.strictEqual(oVizInstance.getNumberUnit(), "", "The default numberUnit was correctly set.");
        assert.strictEqual(oVizInstance.getTargetURL(), undefined, "The default targetUrl was correctly set.");
        assert.strictEqual(oVizInstance.getHeight(), 2, "The default height was correctly set.");
        assert.strictEqual(oVizInstance.getWidth(), 2, "The default width was correctly set.");
        assert.strictEqual(oVizInstance.getState(), LoadState.Loaded, "The default state was correctly set.");
        assert.strictEqual(oVizInstance.getSizeBehavior(), TileSizeBehavior.Responsive, "The default sizeBehaviour was correctly set.");
        assert.strictEqual(oVizInstance.getEditable(), false, "The default value for the editable property was correctly set.");
        assert.strictEqual(oVizInstance.getActive(), false, "The default value for the active property was correctly set.");
        assert.strictEqual(oVizInstance.getVizConfig(), undefined, "The default value for the vizConfig property was correctly set.");
        assert.strictEqual(oVizInstance.getDisplayFormat(), DisplayFormat.Standard, "The default value for the displayFormat property was correctly set.");
        assert.strictEqual(oVizInstance.getTileSize(), undefined, "The default value for the tileSize property was correctly set.");
        assert.strictEqual(oVizInstance.getIndicatorDataSource(), undefined, "The default value for the indicatorDataSource property was correctly set.");
        assert.strictEqual(oVizInstance.getDataSource(), undefined, "The default value for the dataSource property was correctly set.");
        assert.deepEqual(oVizInstance.getSupportedDisplayFormats(), ["standard"], "The default values for the supportedDisplayFormats property were correctly set.");

        oVizInstance.destroy();
    });

    QUnit.test("Has the correct aggregation", function (assert) {
        // Arrange
        var oVizInstance = new VizInstance();
        var oDefaultAggregation = oVizInstance.getMetadata().getAggregation();
        var oTileActionsAggregation = oVizInstance.getMetadata().getAggregation("tileActions");

        // Assert
        assert.strictEqual(oDefaultAggregation.name, "tileActions", "The tile has the correct default aggregation.");
        assert.strictEqual(oTileActionsAggregation.forwarding.getter, "_getTileActionSheet", "The tileActions aggregation is forwarded using the getter function _getTileActionSheet.");
        assert.strictEqual(oTileActionsAggregation.forwarding.aggregation, "buttons", "The tileActions aggregation is forwarded to the buttons aggregation.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Calls the constructor of the superclass", function (assert) {
        // Arrange
        var oInitStub = sinon.stub(XMLComposite.prototype, "init");

        // Act
        var oVizInstance = new VizInstance();

        // Assert
        assert.strictEqual(oInitStub.callCount, 1, "The init function has been called once.");

        // Cleanup
        oVizInstance.destroy();
        oInitStub.restore();
    });

    QUnit.test("Correctly assigns the _oContent property to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstance();

        // Assert
        var oTile = oVizInstance._oContent;
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");

        var oHeaderBindingInfo = oTile.getBindingInfo("header");
        assert.strictEqual(oHeaderBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oHeaderBindingInfo.parts[0].path, "title", "The correct path has been found.");

        var oSubheaderBindingInfo = oTile.getBindingInfo("subheader");
        assert.strictEqual(oSubheaderBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oSubheaderBindingInfo.parts[0].path, "subtitle", "The correct path has been found.");

        var oSizeBehaviorBindingInfo = oTile.getBindingInfo("sizeBehavior");
        assert.strictEqual(oSizeBehaviorBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oSizeBehaviorBindingInfo.parts[0].path, "sizeBehavior", "The correct path has been found.");

        var oStateBindingInfo = oTile.getBindingInfo("state");
        assert.strictEqual(oStateBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oStateBindingInfo.parts[0].path, "state", "The correct path has been found.");

        var oFrameTypeBindingInfo = oTile.getBindingInfo("frameType");
        assert.strictEqual(typeof oFrameTypeBindingInfo.formatter, "function", "There was a formatter set.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[0].path, "displayFormat", "The correct path has been found.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[1].path, "tileSize", "The correct path has been found.");

        var aContent = oTile.getTileContent();
        assert.strictEqual(aContent.length, 1, "The correct number of contents has been found.");

        var oTileContent = aContent[0];
        var oFooterBindingInfo = oTileContent.getBindingInfo("footer");
        assert.strictEqual(oFooterBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oFooterBindingInfo.parts[0].path, "footer", "The correct path has been found.");

        var oImageContent = oTileContent.getContent();
        var oSourceBindingInfo = oImageContent.getBindingInfo("src");
        assert.strictEqual(oSourceBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oSourceBindingInfo.parts[0].path, "icon", "The correct path has been found.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The function _updateContent", {
        beforeEach: function () {
            this.oContent = {};

            this.oVizInstance = new VizInstance();
            this.oVizInstance._oContent = this.oContent;

            this.oSetAggregationStub = sinon.stub(this.oVizInstance, "setAggregation");
            this.oGetOverlayStub = sinon.stub(this.oVizInstance, "_getEditModeOverlay");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            this.oVizInstance = null;
        }
    });

    QUnit.test("Updates the _content aggregation with the correct reference", function (assert) {
        // Arrange
        // Act
        this.oVizInstance._updateContent();

        // Assert
        assert.strictEqual(this.oSetAggregationStub.callCount, 1, "The function setAggregation has been called once.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[0], "_content", "The function setAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[1], this.oContent, "The function setAggregation has been called with the correct parameter.");
    });

    QUnit.test("Updates the _content aggregation with the correct reference if the content has child items", function (assert) {
        // Arrange
        var oItem = {};
        var aItems = [ oItem ];
        this.oContent.getItems = sinon.stub().returns(aItems);

        // Act
        this.oVizInstance._updateContent();

        // Assert
        assert.strictEqual(this.oSetAggregationStub.callCount, 1, "The function setAggregation has been called once.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[0], "_content", "The function setAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[1], oItem, "The function setAggregation has been called with the correct parameter.");
    });

    QUnit.test("Updates the _content aggregation with the correct reference if the control is editable", function (assert) {
        // Arrange
        var oOverlay = {};
        this.oGetOverlayStub.returns(oOverlay);
        this.oVizInstance.setEditable(true);

        // Act
        this.oVizInstance._updateContent();

        // Assert
        assert.strictEqual(this.oGetOverlayStub.callCount, 1, "The function _getEditModeOverlay has been called once.");
        assert.strictEqual(this.oGetOverlayStub.firstCall.args[0], this.oContent, "The function _getEditModeOverlay has been called with the correct parameter.");
        assert.strictEqual(this.oSetAggregationStub.callCount, 1, "The function setAggregation has been called once.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[0], "_content", "The function setAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oSetAggregationStub.firstCall.args[1], oOverlay, "The function setAggregation has been called with the correct parameter.");
    });

    QUnit.module("The method getLayout", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns the correct layout", function (assert) {
        // Arrange
        var oExpectedResult = {
            columns: 2,
            rows: 2
        };

        // Act
        var oResult = this.oVizInstance.getLayout();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "the method returns the correct object with the correct values");
    });

    QUnit.module("The method _setContent", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oInvalidateStub = sandbox.stub(this.oVizInstance, "invalidate");
            this.oGetLayoutDataStub = sandbox.stub(this.oVizInstance, "getLayoutData");
            this.oGetParentSub = sandbox.stub(this.oVizInstance, "getParent");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Correctly sets the content aggregation", function (assert) {
        // Arrange
        var oContent = new Button();
        this.oDataSetterSpy = sandbox.spy(oContent, "data");
        this.oVizInstance.setDataHelpId("someId");

        // Act
        this.oVizInstance._setContent(oContent);

        // Assert
        assert.strictEqual(this.oGetLayoutDataStub.callCount, 1, "function was called exactly once");
        assert.ok(this.oVizInstance.getAggregation("_content"), "aggregation was set");
        assert.ok(this.oDataSetterSpy.called, "the setter was called as expected");
        assert.deepEqual(this.oDataSetterSpy.getCall(0).args, ["help-id", "someId", true], "setter was called with the correct parameters");

        oContent.destroy();
    });

    QUnit.test("Correctly handles the layout data", function (assert) {
        // Arrange
        var oContent = new Button();
        var oGridData = new GridContainerItemLayoutData();
        this.oGetLayoutDataStub.returns(oGridData);
        var oInvalidateParentStub = sandbox.stub();
        this.oGetParentSub.returns({invalidate: oInvalidateParentStub});

        // Act
        this.oVizInstance._setContent(oContent);

        // Assert
        assert.strictEqual(oGridData.getRows(), 2, "the correct number of rows was set on the grid layout");
        assert.strictEqual(oGridData.getColumns(), 2, "the correct number of rows was set on the grid layout");
        assert.strictEqual(oInvalidateParentStub.callCount, 1, "invalidation of the parent control was called once");
        assert.strictEqual(this.oInvalidateStub.callCount, 1, "invalidation of the vizInstance was called once");

        oContent.destroy();
        oGridData.destroy();
    });

    QUnit.module("The method _onActionMenuIconPressed", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance({ editable: true });
            this.oOpenByStub = sandbox.stub(ActionSheet.prototype, "openBy");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Opens the tile action sheet", function (assert) {
        // Arrange
        this.oVizInstance.addTileAction(new Button());
        this.oVizInstance._updateContent();

        // Act
        this.oVizInstance._onActionMenuIconPressed();

        // Assert
        assert.strictEqual(this.oOpenByStub.callCount, 1, "The function openBy was called on the ActionSheet.");
        assert.strictEqual(this.oOpenByStub.firstCall.args[0].getMetadata().getName(), "sap.ui.core.Icon", "The function openBy was called with the action mode icon as a parameter.");
    });

    QUnit.module("The method getFocusDomRef", {
        beforeEach: function () {
            this.oVBox = new VBox();
            this.oVizInstance = new VizInstance();
            this.oVizInstance._oContent = this.oVBox;
            this.oVizInstance.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            this.oVBox.destroy();

            sandbox.restore();
        }
    });

    QUnit.test("VBox with a GenericTile inside", function (assert) {
        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(oGenericTile);
        sap.ui.getCore().applyChanges();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The DOMRef of the GenericTile is returned.");
    });

    QUnit.test("VBox with deeply nested GenericTile inside", function (assert) {
        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(new VBox({
            items: [oGenericTile]
        }));
        sap.ui.getCore().applyChanges();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The DOMRef of the GenericTile is returned.");
    });

    QUnit.test("VBox with a Card inside", function (assert) {
        // Arrange
        var oCard = new Card();

        this.oVBox.addItem(oCard);
        sap.ui.getCore().applyChanges();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oCard.getFocusDomRef(), "The DOMRef of the Card is returned.");
    });

    QUnit.test("VBox with nothing inside", function (assert) {
        // Arrange
        sap.ui.getCore().applyChanges();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, this.oVBox.getFocusDomRef(), "The DOMRef of the VBox is returned.");
    });

    QUnit.test("VBox with a GenericTile inside in edit mode", function (assert) {
        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(oGenericTile);
        this.oVizInstance.addTileAction(new Button());
        this.oVizInstance.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, this.oVizInstance._oActionModeIcon.getFocusDomRef(), "The DOMRef of the ActionDiv is returned.");
    });

    QUnit.module("The method onclick", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oPreventDefaultStub = sandbox.stub(this.oVizInstance, "_preventDefault");
            this.oFirePressStub = sandbox.stub(this.oVizInstance, "firePress");
            this.oOnActionMenuIconPressedStub = sandbox.stub(this.oVizInstance, "_onActionMenuIconPressed");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls firePress when _preventDefault returns false and event target has id with 'action-remove'", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(false);
        var oMockEvent = {
            target: {
                id: "mock-action-remove"
            }
        };
        var aExpectedParams = [{
            scope: "Actions",
            action: "Remove"
        }];
        // Act
        this.oVizInstance.onclick(oMockEvent);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called exactly once");
        assert.deepEqual(this.oFirePressStub.getCall(0).args, aExpectedParams, "firePress was called with correct params");
    });

    QUnit.test("calls this._onActionMenuIconPressed when _preventDefault returns false and event target has id without 'action-remove'", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(false);
        var oMockEvent = {
            target: {
                id: "mock-action-something"
            }
        };
        // Act
        this.oVizInstance.onclick(oMockEvent);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oOnActionMenuIconPressedStub.callCount, 1, "_onActionMenuIconPressed was called exactly once");
    });

    QUnit.test("calls fireClick when _preventDefault returns true", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(true);
        var aExpectedParam = [
            {
                scope: "Display",
                action: "Press"
            }
        ];
        // Act
        this.oVizInstance.onclick();
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called once");
        assert.deepEqual(this.oFirePressStub.getCall(0).args, aExpectedParam, "firePress was called with the correct parameter");
    });

    QUnit.module("The method onBeforeRendering", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oRemoveEventListenerStub = sandbox.stub();
            this.oGetDomRefStub = sandbox.stub(this.oVizInstance, "getDomRef").returns({
                removeEventListener: this.oRemoveEventListenerStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("removes event listeners when a DomRef is available", function (assert) {
        // Arrange
        var oSomeKeyupHandler = {keyup: "handler"},
            oSomeTouchendHandler = {touchend: "handler"};

        this.oVizInstance._fnKeyupHandler = oSomeKeyupHandler;
        this.oVizInstance._fnTouchendHandler = oSomeTouchendHandler;
        // Act
        this.oVizInstance.onBeforeRendering();
        // Assert
        assert.strictEqual(this.oGetDomRefStub.callCount, 1, "getDomRef was called exactly once");
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 2, "removeEventListener was called exactly twice");
        assert.deepEqual(this.oRemoveEventListenerStub.firstCall.args, ["keyup", oSomeKeyupHandler], "removeEventListener was called with the expected arguments the first time");
        assert.deepEqual(this.oRemoveEventListenerStub.secondCall.args, ["touchend", oSomeTouchendHandler], "removeEventListener was called with the expected arguments the second time");
    });

    QUnit.test("does not remove event listeners when no DomRef is available", function (assert) {
        // Arrange
        this.oGetDomRefStub.returns();
        // Act
        this.oVizInstance.onBeforeRendering();
        // Assert
        assert.strictEqual(this.oGetDomRefStub.callCount, 1, "getDomRef was called exactly once");
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 0, "removeEventListeners was not called");
    });

    QUnit.module("The method onAfterRendering", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oRemoveEventListenerStub = sandbox.stub();
            this.oAddEventListenerStub = sandbox.stub();
            this.oGetDomRefStub = sandbox.stub(this.oVizInstance, "getDomRef").returns({
                addEventListener: this.oAddEventListenerStub,
                removeEventListener: this.oRemoveEventListenerStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("binds event listeners for keyup and touchend events", function (assert) {
        // Arrange
        // Act
        this.oVizInstance.onAfterRendering();
        // Assert
        assert.strictEqual(this.oAddEventListenerStub.callCount, 2, "addEventListener was called exactly twice");
        assert.strictEqual(this.oAddEventListenerStub.firstCall.args[0], "keyup", "keyup event listener was added");
        assert.strictEqual(this.oAddEventListenerStub.firstCall.args[2], true, "event capturing was enabled for keyup events");
        assert.strictEqual(this.oAddEventListenerStub.secondCall.args[0], "touchend", "touchend event listener was added");
        assert.strictEqual(this.oAddEventListenerStub.secondCall.args[2], true, "event capturing was enabled for touchend events");

    });

    QUnit.module("The method onkeyup", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oFirePressStub = sandbox.stub(this.oVizInstance, "firePress");
            this.oPreventDefaultStub = sandbox.stub(this.oVizInstance, "_preventDefault");
            this.oGetEditableStub = sandbox.stub(this.oVizInstance, "getEditable");
            this.oSapdeleteFnCheckStub = sandbox.stub(PseudoEvents.events.sapdelete, "fnCheck");
            this.oSapbackspaceFnCheckStub = sandbox.stub(PseudoEvents.events.sapbackspace, "fnCheck");
            this.oSapspaceFnCheckStub = sandbox.stub(PseudoEvents.events.sapspace, "fnCheck");
            this.oSapenterFnCheckStub = sandbox.stub(PseudoEvents.events.sapenter, "fnCheck");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("does nothing when not in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(false);
        this.oSapdeleteFnCheckStub.returns(true);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls firePress when sapdelete event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(true);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls firePress when sapbackspace event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(true);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls _preventDefault when sapspace event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(true);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called");
    });

    QUnit.test("calls _preventDefault when sapenter event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(true);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called");
    });

    QUnit.module("_preventDefault", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oGetEditableStub = sandbox.stub(this.oVizInstance, "getEditable");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the expected methods on the event object when in the edit mode", function (assert) {
        // Arrange
        var oMockEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub()
        };
        this.oGetEditableStub.returns(true);

        // Act
        var bResult = this.oVizInstance._preventDefault(oMockEvent);

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(oMockEvent.preventDefault.callCount, 1, "preventDefault was called exactly once");
        assert.strictEqual(oMockEvent.stopPropagation.callCount, 1, "stopPropagation was called exactly once");
        assert.strictEqual(oMockEvent.stopImmediatePropagation.callCount, 1, "stopImmediatePropagation was called exactly once");
        assert.strictEqual(bResult, false, "false was returned as expected");
    });

    QUnit.test("does nothing and returns true when not in the edit mode", function (assert) {
        // Arrange
        var oMockEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub()
        };
        this.oGetEditableStub.returns(false);

        // Act
        var bResult = this.oVizInstance._preventDefault(oMockEvent);

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(oMockEvent.preventDefault.callCount, 0, "preventDefault was not called");
        assert.strictEqual(oMockEvent.stopPropagation.callCount, 0, "stopPropagation was not called");
        assert.strictEqual(oMockEvent.stopImmediatePropagation.callCount, 0, "stopImmediatePropagation was not called");
        assert.strictEqual(bResult, true, "true was returned as expected");
    });

    QUnit.module("The method load");

    QUnit.test("Returns a resolved Promise", function (assert) {
        //Arrange
        var oVizInstance = new VizInstance();

        //Act
        var oLoadPromise = oVizInstance.load();

        //Assert
        return oLoadPromise.then(function () {
            assert.ok(true, "a resolved Promise is returned");
            oVizInstance.destroy();
        });
    });

    QUnit.module("The _setSize function", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'flat'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.Flat);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 2, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 1, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'flatWide'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.FlatWide);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 4, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 1, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'standardWide'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.StandardWide);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 4, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 2, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size based on the FLP tile size", function (assert) {
        // Arrange
        this.oVizInstance.setTileSize("4x3");

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 6, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 8, "The height was set correctly");
    });

    QUnit.test("Leaves the VizInstance's default size if there is no tile size", function (assert) {
        //Arrange
        var iDefaultWidth = this.oVizInstance.getWidth();
        var iDefaultHeight = this.oVizInstance.getHeight();

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), iDefaultWidth, "The width remains at the default value");
        assert.strictEqual(this.oVizInstance.getHeight(), iDefaultHeight, "The height remains at the default value");
    });

    QUnit.test("Leaves the VizInstance's default size if the tile size is not valid", function (assert) {
        //Arrange
        var iDefaultWidth = this.oVizInstance.getWidth();
        var iDefaultHeight = this.oVizInstance.getHeight();
        this.oVizInstance.setTileSize("2xOne");

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), iDefaultWidth, "The width remains at the default value");
        assert.strictEqual(this.oVizInstance.getHeight(), iDefaultHeight, "The height remains at the default value");
    });

    QUnit.module("The _parseTileSize function", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns the tile size parsed and converted to the grid size", function (assert) {
        //Act
        var oGridSize = this.oVizInstance._parseTileSize("1x2");

        //Assert
        assert.strictEqual(oGridSize.width, 4, "The width was set correctly");
        assert.strictEqual(oGridSize.height, 2, "The height was set correctly");
    });

    QUnit.test("Returns null if there is no tile size passed", function (assert) {
        //Act
        var oGridSize = this.oVizInstance._parseTileSize();

        //Assert
        assert.strictEqual(oGridSize, null, "null was returned");
    });

    QUnit.test("Returns null if the width could not be parsed", function (assert) {
        //Act
        var oGridSize = this.oVizInstance._parseTileSize("1xTwo");

        //Assert
        assert.strictEqual(oGridSize, null, "null was returned");
    });

    QUnit.test("Returns null if the height could not be parsed", function (assert) {
        //Act
        var oGridSize = this.oVizInstance._parseTileSize("Twox1");

        //Assert
        assert.strictEqual(oGridSize, null, "null was returned");
    });

    QUnit.module("UI5 lifecycle handling", {
        beforeEach: function () {
            this.oContent = new Control();

            this.oRegisterSpy = sandbox.spy(Control.prototype, "register");
            this.oDeregisterSpy = sandbox.spy(Control.prototype, "deregister");
        },
        afterEach: function (assert) {
            var oControl;
            for (var i = 0; i < this.oRegisterSpy.callCount; i++) {
                oControl = this.oRegisterSpy.getCall(i).thisValue;

                assert.ok(includes(this.oDeregisterSpy.thisValues, oControl), oControl.getId() + " has been destroyed.");
            }

            sandbox.restore();
            this.oContent.destroy();
        }
    });

    QUnit.test("Simple instantiation", function () {
        // Arrange
        var oVizInstance = new VizInstance();

        // Act
        oVizInstance.destroy();

        // Assert
        // Done in afterEach
    });

    QUnit.test("Instantiation and edit overlay creation", function () {
        // Arrange
        var oVizInstance = new VizInstance();
        oVizInstance._getEditModeOverlay(this.oContent);

        // Act
        oVizInstance.destroy();

        // Assert
        // Done in afterEach
    });

    QUnit.test("Action menu opening", function () {
        // Arrange
        sandbox.stub(ActionSheet.prototype, "openBy");
        var oVizInstance = new VizInstance({
            tileActions: [] // Empty!
        });

        oVizInstance._onActionMenuIconPressed();

        // Act
        oVizInstance.destroy();

        // Assert
        // Done in afterEach
    });

    QUnit.module("_getEditModeOverlay", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance({
                editable: true
            });
            this.oContent = new GenericTile();
            this.oVizInstance._setContent(this.oContent);
            this.oVizInstance.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Edit overlay content, with no tile actions", function (assert) {
        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        var oVizOverlay = this.oVizInstance._oEditModeOverlayContainer;
        assert.ok(oVizOverlay.isA("sap.m.VBox"), "The overlay is a sap.m.VBox.");
        assert.ok(oVizOverlay.hasStyleClass("sapUshellVizInstance"), "The overlay has the class \"sapUshellVizInstance\".");
        assert.strictEqual(oVizOverlay.getItems().length, 2, "The overlay container has two items.");
        var oRemoveIconVBox = oVizOverlay.getItems()[0];
        assert.ok(oRemoveIconVBox.isA("sap.m.VBox"), "The third item in the overlay container is a sap.m.VBox.");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapUshellTileDeleteIconOuterClass"),
            "The third item in the overlay container has the class \"sapUshellTileDeleteIconOuterClass\".");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapUshellTileDeleteClickArea"),
            "The third item in the overlay container has the class \"sapUshellTileDeleteClickArea\".");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapMPointer"),
            "The third item in the overlay container has the class \"sapMPointer\".");
        assert.strictEqual(oRemoveIconVBox.getItems().length, 1,
            "The third item in the overlay container has one item.");
        assert.ok(oRemoveIconVBox.getItems()[0].isA("sap.ui.core.Icon"),
            "The item of the third item is a sap.ui.core.Icon.");
        assert.ok(oRemoveIconVBox.getItems()[0].hasStyleClass("sapUshellTileDeleteIconInnerClass"),
            "The item of the third item has the class \"sapUshellTileDeleteIconInnerClass\".");
        assert.ok(oRemoveIconVBox.getItems()[0].hasStyleClass("sapMPointer"),
            "The item of the third item has the class \"sapMPointer\".");
        var sRemovableTileText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("GENERICTILE_ACTIONS_ARIA_TEXT");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getAlt(), sRemovableTileText,
            "The item of the third item has the correct alt property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getDecorative(), false,
            "The item of the third item has the correct decorative property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getNoTabStop(), true,
            "The item of the third item has the correct noTabStop property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getSrc(), "sap-icon://decline",
            "The item of the third item has the correct src property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getTooltip(), resources.i18n.getText("removeButtonTitle"),
            "The item of the third item has the correct tooltip aggregation.");
        assert.strictEqual(oVizOverlay.getItems()[1], this.oContent,
            "The second item in the overlay container is the content of the visualization.");
    });

    QUnit.test("Edit overlay content, with a tile action", function (assert) {
        // Arrange
        this.oVizInstance.addTileAction(new Button());

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        var oVizOverlay = this.oVizInstance._oEditModeOverlayContainer;
        assert.ok(oVizOverlay.isA("sap.m.VBox"), "The overlay is a sap.m.VBox.");
        assert.ok(oVizOverlay.hasStyleClass("sapUshellVizInstance"), "The overlay has the class \"sapUshellVizInstance\".");
        assert.strictEqual(oVizOverlay.getItems().length, 4, "The overlay container has four items.");
        var oRemoveIconVBox = oVizOverlay.getItems()[0];
        assert.ok(oRemoveIconVBox.isA("sap.m.VBox"), "The third item in the overlay container is a sap.m.VBox.");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapUshellTileDeleteIconOuterClass"),
            "The third item in the overlay container has the class \"sapUshellTileDeleteIconOuterClass\".");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapUshellTileDeleteClickArea"),
            "The third item in the overlay container has the class \"sapUshellTileDeleteClickArea\".");
        assert.ok(oRemoveIconVBox.hasStyleClass("sapMPointer"),
            "The third item in the overlay container has the class \"sapMPointer\".");
        assert.strictEqual(oRemoveIconVBox.getItems().length, 1,
            "The third item in the overlay container has one item.");
        assert.ok(oRemoveIconVBox.getItems()[0].isA("sap.ui.core.Icon"),
            "The item of the third item is a sap.ui.core.Icon.");
        assert.ok(oRemoveIconVBox.getItems()[0].hasStyleClass("sapUshellTileDeleteIconInnerClass"),
            "The item of the third item has the class \"sapUshellTileDeleteIconInnerClass\".");
        assert.ok(oRemoveIconVBox.getItems()[0].hasStyleClass("sapMPointer"),
            "The item of the third item has the class \"sapMPointer\".");
        var sRemovableTileText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("GENERICTILE_ACTIONS_ARIA_TEXT");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getAlt(), sRemovableTileText,
            "The item of the third item has the correct alt property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getDecorative(), false,
            "The item of the third item has the correct decorative property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getNoTabStop(), true,
            "The item of the third item has the correct noTabStop property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getSrc(), "sap-icon://decline",
            "The item of the third item has the correct src property.");
        assert.strictEqual(oRemoveIconVBox.getItems()[0].getTooltip(), resources.i18n.getText("removeButtonTitle"),
            "The item of the third item has the correct tooltip aggregation.");
        assert.strictEqual(oVizOverlay.getItems()[1], this.oContent,
            "The second item in the overlay container is the content of the visualization.");

        assert.ok(oVizOverlay.getItems()[2].isA("sap.m.VBox"),
            "The fourth item in the overlay container is a sap.m.VBox.");
        assert.ok(oVizOverlay.getItems()[2].hasStyleClass("sapUshellTileActionDivCenter"),
            "The fourth item in the overlay container has the class \"sapUshellTileActionDivCenter\".");

        var oActionModeButtonIconVBox = oVizOverlay.getItems()[3];
        assert.ok(oActionModeButtonIconVBox.isA("sap.m.VBox"),
            "The fifth item in the overlay container is a sap.m.VBox.");
        assert.ok(oActionModeButtonIconVBox.hasStyleClass("sapUshellTileActionIconDivBottom"),
            "The fifth item in the overlay container has the class \"sapUshellTileActionIconDivBottom\".");
        assert.ok(oActionModeButtonIconVBox.hasStyleClass("sapMPointer"),
            "The fifth item in the overlay container has the class \"sapMPointer\".");
        assert.strictEqual(oActionModeButtonIconVBox.getItems().length, 1,
            "The fifth item in the overlay container has one item.");
        assert.ok(oActionModeButtonIconVBox.getItems()[0].isA("sap.ui.core.Icon"),
            "The item of the fifth item is a sap.ui.core.Icon.");
        assert.ok(oActionModeButtonIconVBox.getItems()[0].hasStyleClass("sapUshellTileActionIconDivBottomInner"),
            "The item of the fifth item has the class \"sapUshellTileActionIconDivBottomInner\".");
        assert.ok(oActionModeButtonIconVBox.getItems()[0].hasStyleClass("sapMPointer"),
            "The item of the fifth item has the class \"sapMPointer\".");
        var sHasDetailText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LIST_ITEM_NAVIGATION");
        assert.strictEqual(oActionModeButtonIconVBox.getItems()[0].getAlt(), sHasDetailText,
            "The item of the third item has the correct alt property.");
        assert.strictEqual(oActionModeButtonIconVBox.getItems()[0].getDecorative(), false,
            "The item of the third item has the correct decorative property.");
        assert.strictEqual(oActionModeButtonIconVBox.getItems()[0].getNoTabStop(), true,
            "The item of the fifth item has the correct noTabStop property.");
        assert.strictEqual(oActionModeButtonIconVBox.getItems()[0].getSrc(), "sap-icon://overflow",
            "The item of the fifth item has the correct src property.");
        assert.strictEqual(oActionModeButtonIconVBox.getItems()[0].getTooltip(),
            resources.i18n.getText("configuration.category.tile_actions"),
            "The item of the fifth item has the correct tooltip aggregation.");
});

    QUnit.module("The function _getTileActionSheet", {
        beforeEach: function () {
            // We need to temporarily stub _getTileActionSheet because it is called by the UI5 lifecycle
            // as soon as the control is created.
            var oGetTileActionSheetStub = sinon.stub(VizInstance.prototype, "_getTileActionSheet");
            this.oVizInstance = new VizInstance();
            oGetTileActionSheetStub.restore();
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns a new sap.m.ActionSheet instance if it wasn't yet created", function (assert) {
        // Act
        var oActionSheet = this.oVizInstance._getTileActionSheet();

        // Assert
        assert.ok(oActionSheet.isA("sap.m.ActionSheet"), "The function returns a new sap.m.ActionSheet instance.");
    });

    QUnit.test("Returns the existent sap.m.ActionSheet instance if it was already created", function (assert) {
        // Act
        var oActionSheetMock = {
            id: "actionSheet-1",
            destroy: function () {}
        };

        this.oVizInstance._oActionSheet = oActionSheetMock;
        var oActionSheet = this.oVizInstance._getTileActionSheet();

        // Assert
        assert.strictEqual(oActionSheet.id, "actionSheet-1", "The function doesn't create a new sap.m.ActionSheet if it was already instantiated.");
    });

    QUnit.module("The function getAvailableDisplayFormats", {
        beforeEach: function () {
            this.oTestVizData = {
                title: "tests",
                targetURL: "test",
                supportedDisplayFormats: [DisplayFormat.Standard, DisplayFormat.Flat, DisplayFormat.FlatWide, DisplayFormat.Compact]
            };
        },
        afterEach: function () {
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("returns the available display formats", function (assert) {
        // Arrange
        this.oVizInstance = new VizInstance(this.oTestVizData);
        var aExpectedDisplayFormats = [
            DisplayFormat.Flat,
            DisplayFormat.FlatWide,
            DisplayFormat.Compact
        ];

        // Act
        var aAvailableDisplayFormats = this.oVizInstance.getAvailableDisplayFormats();

        // Assert
        assert.deepEqual(aAvailableDisplayFormats, aExpectedDisplayFormats, "The method returned the correct array of available display formats");
    });

    QUnit.test("returns displayformats and eliminates compact if the viz doesn't contain a title ", function (assert) {
        // Arrange
        delete this.oTestVizData.title;
        this.oVizInstance = new VizInstance(this.oTestVizData);
        var aExpectedDisplayFormats = [
            DisplayFormat.Flat,
            DisplayFormat.FlatWide
        ];

        // Act
        var aAvailableDisplayFormats = this.oVizInstance.getAvailableDisplayFormats();

        // Assert
        assert.deepEqual(aAvailableDisplayFormats, aExpectedDisplayFormats, "The method returned the correct array of available display formats");
    });

    QUnit.module("_formatPlaceholderFrameType", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance({});
            sandbox.stub(this.oVizInstance, "_setSize");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns correct frameType if displayFormatHint=Flat", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.Flat);
        // Assert
        assert.strictEqual(sResult, FrameType.OneByHalf, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=FlatWide", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.FlatWide);
        // Assert
        assert.strictEqual(sResult, FrameType.TwoByHalf, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=StandardWide", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.StandardWide);
        // Assert
        assert.strictEqual(sResult, FrameType.TwoByOne, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=undefined", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType();
        // Assert
        assert.strictEqual(sResult, FrameType.OneByOne, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=undefined and the tile size is 1x2", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(undefined, "1x2");
        // Assert
        assert.strictEqual(sResult, FrameType.TwoByOne, "Returned the correct result");
    });

    QUnit.test("Sets the vizInstance's grid size", function (assert) {
        // Arrange
        //Act
        this.oVizInstance._formatPlaceholderFrameType();

        //Assert
        assert.strictEqual(this.oVizInstance._setSize.callCount, 1, "The grid size was set");
    });
});
