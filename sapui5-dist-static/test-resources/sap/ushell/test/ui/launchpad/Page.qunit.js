// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/core/library",
    "sap/ui/model/json/JSONModel",
    "sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
    "sap/ushell/resources",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section",
    "sap/f/GridContainer",
    "sap/ushell/ui/launchpad/ExtendedChangeDetection"
], function (
    coreLibrary,
    JSONModel,
    KeyCodes,
    QUnitUtils,
    resources,
    VizInstance,
    Page,
    Section,
    GridContainer,
    ExtendedChangeDetection
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    function visualizationFactory (sId, oContext) {
        return new VizInstance(sId);
    }

    function createSection (sId, oData) {
        if (sId.visualizations) {
            oData = sId;
            sId = undefined;
        }
        var oSectionModel = new JSONModel(oData);
        var oSection = new Section(sId);
        if (oSection.bindVisualizations) {
            oSection.bindVisualizations({
                path: "/visualizations",
                factory: visualizationFactory
            });
        } else {
            oSection.bindAggregation("visualizations", {
                path: "/visualizations",
                factory: visualizationFactory
            });
        }
        oSection.setEditable(!!oData.editable);
        oSection.setEnableVisualizationReordering(!!oData.enableVisualizationReordering);
        oSection.setModel(oSectionModel);
        return oSection;
    }

    QUnit.module("Page constructor", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("ExtendedChangeDetection setup", function (assert) {
        // Arrange
        var oAttachItemDeletedStub = sandbox.stub(ExtendedChangeDetection.prototype, "attachItemDeleted");
        var oAttachItemsReorderedStub = sandbox.stub(ExtendedChangeDetection.prototype, "attachItemsReordered");

        // Act
        var oPage = new Page();

        // Assert
        assert.ok(oPage._oSectionsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved");
        assert.strictEqual(oAttachItemDeletedStub.callCount, 1, "attachItemDeleted was called once");
        assert.strictEqual(oAttachItemDeletedStub.getCall(0).args[0], oPage.invalidate, "attachItemDeleted was called with a correct first arg");
        assert.strictEqual(oAttachItemDeletedStub.getCall(0).args[1], oPage, "attachItemDeleted was called with a correct second arg");
        assert.strictEqual(oAttachItemsReorderedStub.callCount, 1, "attachItemsReordered was called once");
        assert.strictEqual(oAttachItemsReorderedStub.getCall(0).args[0], oPage.invalidate, "attachItemsReordered was called with a correct first arg");
        assert.strictEqual(oAttachItemsReorderedStub.getCall(0).args[1], oPage, "attachItemsReordered was called with a correct second arg");

        // Cleanup
        oPage.destroy();
    });

    QUnit.module("Page defaults", {
        beforeEach: function () {
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oPage.getProperty("edit"), false, "Default Value of property edit is: false");
        assert.strictEqual(this.oPage.getProperty("enableSectionReordering"), false,
            "Default Value of property enableSectionReordering is: false");
        assert.strictEqual(this.oPage.getProperty("dataHelpId"), "", "Default Value of property dataHelpId is: \"\"");
        assert.strictEqual(this.oPage.getProperty("noSectionsText"), "", "Default Value of property noSectionsText is: \"\"");
        assert.strictEqual(this.oPage.getProperty("showNoSectionsText"), true, "Default Value of property showNoSectionsText is: true");
        assert.strictEqual(this.oPage.getProperty("showTitle"), false, "Default Value of property showTitle is: false");
        assert.strictEqual(this.oPage.getProperty("title"), "", "Default Value of property title is: \"\"");
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oPage.getAggregation("sections"), null, "Section Aggregation is initaly: null");
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons"), null,
            "Internal Aggregation _addSectionButtons is initaly: null");
        assert.notEqual(this.oPage.getAggregation("_noSectionText"), null, "Internal Aggregation _noSectionText has a default text");
        this.oPage.onBeforeRendering();
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons").length, 1,
            "Internal Aggregation _addSectionButtons has: one add section button after onBeforeRendering");
    });

    QUnit.test("default events", function (assert) {
        // Arrange
        var bEventWasTriggerd;
        this.oPage.onBeforeRendering();
        this.oPage.attachAddSectionButtonPressed(function () {
            bEventWasTriggerd = true;
        });

        // Act
        this.oPage.getAggregation("_addSectionButtons")[0].firePress();

        // Assert
        assert.strictEqual(bEventWasTriggerd, true, "The addSectionButtonPressed event was fired");
    });

    QUnit.test("internal _addSectionButtons aggregation has elements with the correct properties", function (assert) {
        // Arrange
        this.oPage.onBeforeRendering();
        var oAddSectionButton = this.oPage.getAggregation("_addSectionButtons")[0];

        // Assert
        assert.strictEqual(oAddSectionButton.isA("sap.m.Button"), true, "The Control is a Button");
        assert.strictEqual(oAddSectionButton.getType(), "Transparent", "The Control has the type: Transparent");
        assert.strictEqual(oAddSectionButton.getIcon(), "sap-icon://add", "The Control has the icon: \"sap-icon://add\"");
        assert.strictEqual(oAddSectionButton.getText(), resources.i18n.getText("Page.Button.AddSection"),
        "The Control has the text: " + resources.i18n.getText("Page.Button.AddSection"));
    });

    QUnit.test("internal _noSectionText aggregation has the correct defualt properties", function (assert) {
        // Arrange
        var oNoSectionText = this.oPage.getAggregation("_noSectionText");

        // Assert
        assert.strictEqual(oNoSectionText.isA("sap.m.Text"), true, "The Control is a Button");
        assert.strictEqual(oNoSectionText.getWidth(), "100%", "The Control has the width: 100%");
        assert.strictEqual(oNoSectionText.getTextAlign(), "Center", "The Control has the textAlign: \"Center\"");
        assert.strictEqual(oNoSectionText.getText(), resources.i18n.getText("Page.NoSectionText"),
            "The Control has the text: " + resources.i18n.getText("Page.NoSectionText"));
    });

    QUnit.module("Event delegates", {
        beforeEach: function () {
            this.oAddDelegateStub = sandbox.stub(Page.prototype, "addDelegate");
            this.oSaveFocusStub = sandbox.stub(Page.prototype, "_saveFocus");
            this.oHandleSkipBackStub = sandbox.stub(Page.prototype, "_handleSkipBack");
            this.oHandleSkipForwardStub = sandbox.stub(Page.prototype, "_handleSkipForward");
            this.oHandleBeforeFastNavigationFocusStub = sandbox.stub(Page.prototype, "_handleBeforeFastNavigationFocus");

            this.oPage = new Page();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("onfocusin", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onfocusin;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oSaveFocusStub.callCount, 1, "_saveFocus was called once");
    });

    QUnit.test("onsapskipback", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onsapskipback;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleSkipBackStub.callCount, 1, "_handleSkipBack was called once");
    });

    QUnit.test("onsapskipforward", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onsapskipforward;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleSkipForwardStub.callCount, 1, "_handleSkipForward was called once");
    });

    QUnit.test("onBeforeFastNavigationFocus", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onBeforeFastNavigationFocus;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleBeforeFastNavigationFocusStub.callCount, 1, "_handleBeforeFastNavigationFocus was called once");
    });

    QUnit.module("The method _saveFocus", {
        beforeEach: function () {

            this.oSection = createSection({
                editable: false,
                visualizations: [{}, {}]
            });
            this.oPage = new Page({
                sections: [
                    this.oSection
                ]
            });
            this.oPage.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("Saves correct target when focusing a non-empty section and no viz focused before", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.byId("content"),
            target: this.oEventTarget
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz.getId(), this.oSection.getVisualizations()[0].getId(), "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused sec was saved");
    });

    QUnit.test("Saves correct target when focusing a non-empty section and a viz was focused before", function (assert) {
        // Arrange
        this.oPage._oLastFocusedViz = this.oSection.getVisualizations()[1];

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.byId("content")
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, this.oSection.getVisualizations()[1], "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused sec was saved");
    });

    QUnit.test("Saves correct target when focusing a non-empty section and a viz outside was focused before", function (assert) {
        // Arrange
        var oUnknownViz = new VizInstance();
        this.oPage._oLastFocusedViz = oUnknownViz;

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.byId("content")
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz.getId(), this.oSection.getVisualizations()[0].getId(), "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused sec was saved");

        oUnknownViz.destroy();
    });

    QUnit.test("Saves correct target when focusing an empty section", function (assert) {
        // Arrange
        this.oSection.getModel().setProperty("/visualizations", []);

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.byId("content")
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, undefined, "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, this.oSection, "correct last focused sec was saved");
    });

    QUnit.test("Saves correct target when focusing an empty page", function (assert) {
        // Arrange
        this.oSection.destroy();

        // Act
        this.oPage._saveFocus({
            srcControl: this.oPage
        });
        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, undefined, "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused sec was saved");
    });

    QUnit.test("Saves correct target when focusing a visualization", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.byId("defaultArea"),
            target: this.oSection.getVisualizations()[1].getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz.getId(), this.oSection.getVisualizations()[1].getId(), "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused sec was saved");
    });

    QUnit.module("The method _handleSkipBack", {
        beforeEach: function () {
            this.oFocusStub = sandbox.stub();
            this.oSectionMock = {
                focus: this.oFocusStub
            };

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage = new Page();
            this.oGridContainer = new GridContainer();

            this.oGetAncestorSectionStub = sandbox.stub(this.oPage, "_getAncestorSection");
            this.oGetAncestorSectionStub.withArgs(this.oGridContainer).returns(this.oSectionMock);

            this.oGetEditStub = sandbox.stub(this.oPage, "getEdit");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets focus on section when edit mode is on", function (assert) {
        // Arrange
        var oEventMock = {
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oGridContainer
        };
        this.oGetEditStub.returns(true);
        // Act
        this.oPage._handleSkipBack(oEventMock);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(this.oFocusStub.callCount, 1, "focus was called once");
    });

    QUnit.test("Doesn't handle the event when edit mode is off", function (assert) {
        // Arrange
        var oEventMock = {
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oGridContainer
        };
        this.oGetEditStub.returns(false);
        // Act
        this.oPage._handleSkipBack(oEventMock);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "preventDefault was not called");
        assert.strictEqual(this.oFocusStub.callCount, 0, "focus was not called");
    });

    QUnit.module("The method _handleSkipForward", {
        beforeEach: function () {
            this.oSection = createSection({
                editable: false,
                visualizations: [{}, {}]
            });
            this.oPage = new Page({
                sections: [
                    this.oSection
                ]
            });

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Sets focus on the last focused viz", function (assert) {
        // Arrange
        var oViz1 = this.oSection.getVisualizations()[1];
        this.oPage._oLastFocusedViz = oViz1;
        var oFocusStub = sandbox.stub(oViz1.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleSkipForward({
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oSection.byId("content"),
            target: oViz1.getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "focus viz2 was called once");
    });

    QUnit.test("Sets default focus on the first viz", function (assert) {
        // Arrange
        var oViz0 = this.oSection.getVisualizations()[0];
        var oFocusStub = sandbox.stub(oViz0.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleSkipForward({
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oSection.byId("content"),
            target: oViz0.getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "focus viz1 was called once");
    });

    QUnit.module("The method _handleKeyboarHomeEndNavigation", {
        beforeEach: function () {
            this.oSection = createSection("some_section", {
                editable: true,
                visualizations: [{}]
            });
            this.oSection.setTitle("some title");
            this.oPage = new Page({
                sections: [
                    this.oSection
                ]
            });
            this.oPage.setEdit(true);
            this.oPreventDefaultStub = sandbox.stub();
            this.oStopPropagationStub = sandbox.stub();
            this.oEvent = {
                type: "saphomemodifiers",
                preventDefault: this.oPreventDefaultStub,
                stopPropagation: this.oStopPropagationStub
            };

            this.oPage.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("_handleKeyboarHomeEndNavigation when in Input field", function (assert) {
        // Arrange
        this.oIsfocusInInputStub = sandbox.stub(this.oPage, "_isFocusInInput").returns(true);
        this.oPage._handleKeyboardHomeEndNavigation(true, this.oEvent);
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "focus is not set to first visualisation");

    });

    QUnit.test("_handleKeyboarHomeEndNavigation when not in Input field", function (assert) {
        // Arrange
        this.oIsfocusInInputStub = sandbox.stub(this.oPage, "_isFocusInInput").returns(false);
        this.oPage._handleKeyboardHomeEndNavigation(true, this.oEvent);
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "focus is set to first visualisation");

    });

    QUnit.module("The method _handleBeforeFastNavigationFocus", {
        beforeEach: function () {
            this.oSection = createSection({
                editable: false,
                visualizations: [{}]
            });
            this.oPage = new Page({
                sections: [
                    this.oSection
                ]
            });

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Sets focus on section when edit mode is on and a section focus was saved", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oPage._oLastFocusedSection = this.oSection;
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on section when edit mode is on and a viz focus was saved and navigation is forward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oPage._oLastFocusedViz = this.oSection.getVisualizations()[0];
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: true,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on viz when a viz focus was saved", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oViz = this.oSection.getVisualizations()[0];
        this.oPage._oLastFocusedViz = oViz;
        var oFocusStub = sandbox.stub(oViz.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "visualization was focused once");
    });

    QUnit.test("Sets default focus on section when edit mode is on and navigation is forward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: true,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on default viz when edit mode is on and navigation is backward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection.getVisualizations()[0].getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "visualization was focused once");
    });

    QUnit.test("Sets focus on default section when edit mode is on and section is empty and navigation is backward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oSection.getModel().setProperty("/visualizations", []);
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on default viz when edit mode is off", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection.getVisualizations()[0].getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "viz was focused once");
    });

    QUnit.module("The method _getAncestorSection", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oIsAStub = sandbox.stub();
            this.oIsAStub.withArgs("sap.ushell.ui.launchpad.Section")
                .onCall(0).returns(false)
                .onCall(1).returns(true);

            this.oGetParentStub = sandbox.stub();

            this.oMockControl = {
                isA: this.oIsAStub,
                getParent: this.oGetParentStub
            };

            this.oGetParentStub.returns(this.oMockControl);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Iterates over parents correctly", function (assert) {
        //Arrange

        //Act
        var oResult = this.oPage._getAncestorSection(this.oMockControl);
        //Assert
        assert.strictEqual(this.oIsAStub.callCount, 2, "isA was called twice");
        assert.strictEqual(this.oGetParentStub.callCount, 1, "getParent was called once");
        assert.deepEqual(oResult, this.oMockControl, "correct object was returned");
    });

    QUnit.test("Returns null if there is no parent", function (assert) {
        //Arrange
        this.oIsAStub.withArgs("sap.ushell.ui.launchpad.Section").onCall(1).returns(false);
        this.oGetParentStub.onCall(0).returns({
            isA: this.oIsAStub
        });

        //Act
        var oResult = this.oPage._getAncestorSection(this.oMockControl);

        //Assert
        assert.strictEqual(this.oIsAStub.callCount, 2, "isA was called twice");
        assert.strictEqual(this.oGetParentStub.callCount, 1, "getParent was called once");
        assert.deepEqual(oResult, null, "null was returned");
    });

    QUnit.module("Page properties", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oPage.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("edit property", function (assert) {
        assert.strictEqual(this.oPage.getEdit(), false, "Value is initally false");
        this.oPage.setEdit(true);
        assert.strictEqual(this.oPage.getEdit(), true, "Value was set to true");
        this.oPage.setEdit(false);
        assert.strictEqual(this.oPage.getEdit(), false, "Value was set to false");
    });

    QUnit.test("enableSectionReordering property", function (assert) {
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value is initally false");
        this.oPage.setEnableSectionReordering(true);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), true, "Value was set to true");
        this.oPage.setEnableSectionReordering(false);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value was set to false");
    });

    QUnit.test("Setter for enableSectionReordering property returns this", function (assert) {
        // Act
        var oReturn = this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oReturn, this.oPage, "'this' reference returned");
    });

    QUnit.test("Property change for enableSectionReordering property prevents rendering", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage, "invalidate");
        // Act
        this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oSpy.callCount, 1, "One invalidation for DragDropConfig, not for property change");
    });

    QUnit.test("Setter call for enableSectionReordering with no value change, does nothing", function (assert) {
        // Arrange
        this.oPage.setEnableSectionReordering(true);
        var oSpyRemove = sinon.spy(this.oPage, "removeDragDropConfig");
        var oSpyAdd = sinon.spy(this.oPage, "addDragDropConfig");
        // Act
        this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oSpyRemove.callCount, 0, "Mo invalidation for DragDropConfig, for not property change");
        assert.strictEqual(oSpyAdd.callCount, 0, "No invalidation for DragDropConfig, for not property change");
    });

    QUnit.test("Setter call for enableSectionReordering with undefined value change, does nothing", function (assert) {
        // Arrange
        var oSpyRemove = sinon.spy(this.oPage, "removeDragDropConfig");
        var oSpyAdd = sinon.spy(this.oPage, "addDragDropConfig");
        // Act
        this.oPage.setEnableSectionReordering();
        // Assert
        assert.strictEqual(oSpyRemove.callCount, 0, "Mo invalidation for DragDropConfig, for undefined property value");
        assert.strictEqual(oSpyAdd.callCount, 0, "No invalidation for DragDropConfig, for undefined property value");
    });

    QUnit.test("dataHelpId property", function (assert) {
        sap.ui.getCore().applyChanges();
        assert.strictEqual(this.oPage.getDataHelpId(), "", "Value is initally \"\"");
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), null,
            "The attribute \"data-help-id\" is not rendered.");
        this.oPage.setDataHelpId("some text");
        sap.ui.getCore().applyChanges();
        assert.strictEqual(this.oPage.getDataHelpId(), "some text", "Value was set to \"some text\"");
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), "some text",
            "The attribute \"data-help-id\" is rendered and has the correct value.");
        this.oPage.setDataHelpId("some other text");
        sap.ui.getCore().applyChanges();
        assert.strictEqual(this.oPage.getDataHelpId(), "some other text", "Value was set to \"some other text\"");
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), "some other text",
            "The attribute \"data-help-id\" is rendered and has the correct value.");
    });

    QUnit.test("noSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getNoSectionsText(), "", "Value is initally \"\"");
        this.oPage.setNoSectionsText("some text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some text", "Value was set to \"some text\"");
        this.oPage.setNoSectionsText("some other text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some other text", "Value was set to \"some other text\"");
    });

    QUnit.test("Setter for noSectionsText property returns this", function (assert) {
        // Act
        var oReturn = this.oPage.setNoSectionsText("Otto");
        // Assert
        assert.strictEqual(oReturn, this.oPage, "'this' reference returned");
    });

    QUnit.test("Property change for noSectionsText property prevents rendering", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage, "invalidate");
        // Act
        this.oPage.setNoSectionsText("Karl");
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation happens");
    });

    QUnit.test("Setter call for noSectionsText with no value change, does nothing", function (assert) {
        // Arrange
        this.oPage.setNoSectionsText("Karl");
        var oSpy = sinon.spy(this.oPage.getAggregation("_noSectionText"), "setText");
        // Act
        this.oPage.setNoSectionsText("Karl");
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "setText on inner aggregation not called");
    });

    QUnit.test("Setter call for noSectionsText with undefined value change, does nothing", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage.getAggregation("_noSectionText"), "setText");
        // Act
        this.oPage.setNoSectionsText();
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "setText on inner aggregation not called");
    });

    QUnit.test("showNoSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value is initally true");
        this.oPage.setShowNoSectionsText(false);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), false, "Value was set to false");
        this.oPage.setShowNoSectionsText(true);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value was set to true");
    });

    QUnit.test("showTitle property", function (assert) {
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value is initally false");
        this.oPage.setShowTitle(true);
        assert.strictEqual(this.oPage.getShowTitle(), true, "Value was set to true");
        this.oPage.setShowTitle(false);
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value was set to false");
    });

    QUnit.test("title property", function (assert) {
        assert.strictEqual(this.oPage.getTitle(), "", "Value is initally \"\"");
        this.oPage.setTitle("some title");
        assert.strictEqual(this.oPage.getTitle(), "some title", "Value was set to \"some title\"");
        this.oPage.setTitle("some other title");
        assert.strictEqual(this.oPage.getTitle(), "some other title", "Value was set to \"some other title\"");
    });

    QUnit.module("getFocusDomRef", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oPage = new Page();
            this.oPage.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    QUnit.test("when there are no sections on the page", function (assert) {
        // Arrange
        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are no sections on the page in edit mode", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        sap.ui.getCore().applyChanges();

        var oExpectedDomRef = this.oPage.getAggregation("_addSectionButtons")[0].getFocusDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are sections on the page", function (assert) {
        // Arrange
        this.oPage.addSection(new Section());
        sap.ui.getCore().applyChanges();

        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are sections on the page in edit mode", function (assert) {
        // Arrange
        this.oPage.addSection(new Section());
        this.oPage.setEdit(true);
        sap.ui.getCore().applyChanges();

        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.module("Page accessability", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oSection1 = createSection({
                editable: true,
                visualizations: [{}, {}]
            });
            this.oSection2 = createSection({
                editable: true,
                visualizations: []
            });
            this.oSection3 = createSection({
                editable: true,
                visualizations: [{}, {}]
            });

            this.oPage = new Page({
                edit: true,
                sections: [this.oSection1, this.oSection2]
            });

            this.oPage.insertSection(this.oSection3, 2);
            this.oPage.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    QUnit.test("PAGE_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getSections()[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_UP);

        // Assert
        var oViz = this.oSection1.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_UP while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection3.getVisualizations()[1];
        var oViz2 = this.oSection1.getVisualizations()[0];
        oViz1.getDomRef().parentNode.focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz2.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz = this.oSection3.getVisualizations()[0];
        this.oPage.getSections()[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_DOWN while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[1];
        var oViz2 = this.oSection3.getVisualizations()[0];
        oViz1.getDomRef().parentNode.focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz2.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var aSections = this.oPage.getSections();
        aSections[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, aSections[1].getFocusDomRef(), "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oPage.getSections()[2].focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_UP, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, true, "Section drop event called");

            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP + CTRL - first section is default", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        var oSection = this.oPage.getSections()[1];
        oSection.setDefault(true);
        this.oPage.getSections()[2].focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_UP, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, false, "Do not drop a section over a default section");
            oSection.setDefault(false);
            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var aSections = this.oPage.getSections();
        aSections[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, aSections[1].getFocusDomRef(), "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oPage.getSections()[0].focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, true, "Section drop event called.");

            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL - Default section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        var oSection = this.oPage.getSections()[0];
        oSection.setDefault(true);
        this.oPage.getSections()[0].focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, false, "Section drop event not called.");
            oSection.setDefault(false);
            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL - SectionReordering disabled", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getSections()[0].focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, false, "Section drop event called.");

            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("HOME", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz = this.oSection1.getVisualizations()[0];

        this.oPage.getSections()[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.HOME);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("END", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz = this.oSection1.getVisualizations()[1];
        this.oPage.getSections()[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.END);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("HOME + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz = this.oSection1.getVisualizations()[0];
        this.oPage.getSections()[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.HOME, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("END + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz = this.oSection3.getVisualizations()[1];
        this.oPage.getSections()[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.END, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                oViz.getDomRef().parentNode,
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.module("Keyboard Drag and Drop of Visualizations", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);

            this.aSections = [
                createSection("section_0", {
                    editable: true,
                    enableVisualizationReordering: true,
                    visualizations: [{}, {}]
                }),
                createSection("section_1", {
                    editable: true,
                    enableVisualizationReordering: true,
                    visualizations: [{}, {}]
                })
            ];

            this.oPage = new Page({
                edit: true,
                sections: this.aSections
            });

            this.oPage.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    function testDnD (assert, testData) {
        var done = assert.async();
        var sSectionId = "section_" + testData.drag.section;
        var sTargetSectionId = "section_" + testData.drop.section;

        var oSection = sap.ui.getCore().byId(sSectionId);
        var oTargetSection = sap.ui.getCore().byId(sTargetSectionId);
        oSection._focusItem(testData.drag.tile);

        oTargetSection.attachEvent("visualizationDrop", function (oInfo) {
            var oParams = oInfo.getParameters();
            var oDragControl = oSection.getVisualizations()[testData.drag.tile];
            var oDropControl = oTargetSection.getVisualizations()[testData.drop.tile];
            assert.strictEqual(oParams.draggedControl.getId(), oDragControl.getId(), "Tile " + testData.drag.tile + " is dragged.");
            assert.strictEqual(oParams.droppedControl.getId(), oDropControl.getId(), "Tile " + testData.drop.tile + " is being dropped over.");
            done();
        });

        window.setTimeout(function () {
            var oGridElement = document.activeElement;
            assert.strictEqual(oGridElement.id, sSectionId + "--defaultArea-item-" + testData.drag.tile, "Dragged tile is focused.");
            oSection.byId("defaultArea")._moveItem({
                target: oGridElement,
                keyCode: testData.keyCode,
                stopPropagation: function () {},
                isMarked: function () { return false; },
                originalEvent: {
                    type: "keydown"
                }
            });
        }, 0);
    }

    QUnit.test("CTRL + RIGHT", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_RIGHT,
            drag: {
                section: 0,
                tile: 0
            },
            drop: {
                section: 0,
                tile: 1
            }
        });
    });

    QUnit.test("CTRL + LEFT", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_LEFT,
            drag: {
                section: 0,
                tile: 1
            },
            drop: {
                section: 0,
                tile: 0
            }
        });
    });

/* TODO: uncomment after GridContainer fixes it
    QUnit.test("CTRL + DOWN", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_DOWN,
            drag: {
                section: 0,
                tile: 0
            },
            drop: {
                section: 1,
                tile: 0
            }
        });
    });

    QUnit.test("CTRL + UP", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_UP,
            drag: {
                section: 1,
                tile: 0
            },
            drop: {
                section: 0,
                tile: 0
            }
        });
    });
*/
    QUnit.module("exit", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oDragDropInfoDestroyStub = sandbox.stub(this.oPage._oDragDropInfo, "destroy");
            this.oSectionsChangeDetectionDestroyStub = sandbox.stub(this.oPage._oSectionsChangeDetection, "destroy");
        }
    });

    QUnit.test("Destroys private objects", function (assert) {
        // Arrange
        // Act
        this.oPage.exit();
        // Assert
        assert.strictEqual(this.oDragDropInfoDestroyStub.callCount, 1, "oDragDropInfo was destroyed");
        assert.strictEqual(this.oSectionsChangeDetectionDestroyStub.callCount, 1, "oSectionsChangeDetection was destroyed");
    });

    QUnit.module("Announce InvisibleMessage", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oInvisibleMessageInstanceStub = sandbox.stub(this.oPage._oInvisibleMessageInstance, "announce");
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Announce InvisibleMessage when a Section was moved", function (assert) {
        //Arrange
        var sExpectedAnnounceMessage = resources.i18n.getText("PageRuntime.Message.SectionMoved"),
            sExpectedType = coreLibrary.InvisibleMessageMode.Polite;

        //Act
        this.oPage.announceMove();

        //Assert
        assert.strictEqual(this.oInvisibleMessageInstanceStub.callCount, 1, "announce was called once");
        assert.strictEqual(this.oInvisibleMessageInstanceStub.args[0][0], sExpectedAnnounceMessage,
                "announce was called with the correct message");
        assert.strictEqual(this.oInvisibleMessageInstanceStub.args[0][1], sExpectedType,
                "announce was called with the correct message type");
    });
});
