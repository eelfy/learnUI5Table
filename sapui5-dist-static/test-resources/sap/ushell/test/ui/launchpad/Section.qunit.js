// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/ui/core/library",
    "sap/ushell/resources",
    "sap/ushell/services/Container",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/ui/launchpad/ExtendedChangeDetection",
    "sap/ui/model/Model",
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/library"
], function (
    GenericTile,
    mobileLibrary,
    coreLibrary,
    resources,
    Container,
    Section,
    ExtendedChangeDetection,
    Model,
    Context,
    JSONModel,
    ushellLibrary
) {
    "use strict";

    /* global QUnit, sinon */

    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("Page constructor");

    QUnit.test("ExtendedChangeDetection setup", function (assert) {
        // Arrange
        // Act
        var oSection = new Section();

        // Assert
        assert.ok(oSection._oDefaultItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for default items");
        assert.deepEqual(oSection._oDefaultItemsChangeDetection._aSiblingAggregationNames, ["flatItems", "compactItems"], "the correct siblings were set for defaultItems");
        assert.ok(oSection._oFlatItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for flat items");
        assert.deepEqual(oSection._oFlatItemsChangeDetection._aSiblingAggregationNames, ["defaultItems", "compactItems"], "the correct siblings were set for flatItems");
        assert.ok(oSection._oCompactItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for compact items");
        assert.deepEqual(oSection._oCompactItemsChangeDetection._aSiblingAggregationNames, ["defaultItems", "flatItems"], "the correct siblings were set for compactItems");

        // Cleanup
        oSection.destroy();
    });

    QUnit.module("Section defaults", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oSection.getEditable(), false,
            "Default Value of property editable is: false");
        assert.strictEqual(this.oSection.getDataHelpId(), "",
            "Default Value of property dataHelpId is: \"\"");
        assert.strictEqual(this.oSection.getDefault(), false,
            "Default Value of property default is: false");
        assert.strictEqual(this.oSection.getEnableAddButton(), true,
            "Default Value of property enableAddButton is: true");
        assert.strictEqual(this.oSection.getEnableDeleteButton(), true,
            "Default Value of property enableDeleteButton is: true");
        assert.strictEqual(this.oSection.getEnableGridBreakpoints(), false,
            "Default Value of property enableGridBreakpoints is: false");
        assert.strictEqual(this.oSection.getEnableGridContainerQuery(), false,
            "Default Value of property enableGridContainerQuery is: false");
        assert.strictEqual(this.oSection.getEnableResetButton(), true,
            "Default Value of property enableResetButton is: true");
        assert.strictEqual(this.oSection.getEnableShowHideButton(), true,
            "Default Value of property enableShowHideButton is: true");
        assert.strictEqual(this.oSection.getEnableVisualizationReordering(), false,
            "Default Value of property enableVisualizationReordering is: false");
        assert.strictEqual(this.oSection.getNoVisualizationsText(), resources.i18n.getText("Section.NoVisualizationsText"),
            "Default Value of property noVisualizationsText is: " + resources.i18n.getText("Section.NoVisualizationsText"));
        assert.strictEqual(this.oSection.getTitle(), "",
            "Default Value of property title is: \"\"");
        assert.strictEqual(this.oSection.getShowNoVisualizationsText(), false,
            "Default Value of property showNoVisualizationsText is: false");
        assert.strictEqual(this.oSection.getShowSection(), true,
            "Default Value of property showSection is: true");
        assert.strictEqual(this.oSection.getSizeBehavior(), TileSizeBehavior.Responsive,
            "Default Value of property sizeBehavior is: " + TileSizeBehavior.Responsive);
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), false,
            "Default Value of property _duringDrag is: false");
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oSection.getVisualizations().length > 0, false, "Visualization Aggregation is initially: empty");
    });

    QUnit.test("add event", function (assert) {
        // Arrange
        var fnAddSpy = sinon.spy();

        this.oSection.attachAdd(fnAddSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("addVisualization").firePress();

        // Assert
        assert.strictEqual(fnAddSpy.called, true, "The add event was fired");
    });

    QUnit.test("delete event", function (assert) {
        // Arrange
        var fnDeleteSpy = sinon.spy();

        this.oSection.attachDelete(fnDeleteSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("delete").firePress();

        // Assert
        assert.strictEqual(fnDeleteSpy.called, true, "The delete event was fired");
    });

    QUnit.test("reset event", function (assert) {
        // Arrange
        var fnResetSpy = sinon.spy();

        this.oSection.attachReset(fnResetSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("reset").firePress();

        // Assert
        assert.strictEqual(fnResetSpy.called, true, "The reset event was fired");
    });

    QUnit.test("titleChange event", function (assert) {
        // Arrange
        var fnTitleChangeSpy = sinon.spy();

        this.oSection.attachTitleChange(fnTitleChangeSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("title-edit").fireChange();

        // Assert
        assert.strictEqual(fnTitleChangeSpy.called, true, "The titleChange event was fired");
    });

    QUnit.test("visualizations aggregation with a GenericTile", function (assert) {
        // Arrange
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            var oldFunction = sap.ushell.Container.getService;
            sap.ushell.Container.getService = function (sId) {
                if (sId === "VisualizationDataProvider") {
                    return {
                        _getCatalogTiles: function () { return Promise.resolve([]); }
                    };
                }
                return oldFunction(sId);
            };
            var oGenericTile = new GenericTile();
            oGenericTile.setBindingContext(new Context(new Model(), "/fake/2"));
            var oGenericTile2 = new GenericTile();
            oGenericTile2.setBindingContext(new Context(new Model(), "/fake/1"));

            // Act
            this.oSection.addAggregation("defaultItems", oGenericTile);
            this.oSection.insertAggregation("defaultItems", oGenericTile2);
            sap.ui.getCore().applyChanges();

            // Assert
            var oFirstVisualization = this.oSection.getVisualizations()[0];
            var oLayoutData = oFirstVisualization.getLayoutData();
            assert.strictEqual(this.oSection.getVisualizations().length, 2,
                "The 2 visualizations were added correctly");
            assert.strictEqual(oLayoutData.getRows(), 2,
                "The first visualization received layout data with the correct amount of rows.");
            assert.strictEqual(oLayoutData.getColumns(), 2,
                "The first visualization received layout data with the correct amount of columns.");
            assert.strictEqual(oFirstVisualization.getBindingContext().getPath(), "/fake/1",
                "The visualizations are returned in the correct order, i.e. as defined in the model.");

            sap.ushell.Container.getService = oldFunction;
            delete sap.ushell.Container;
            done();
        }.bind(this));
    });

    QUnit.test("check that the correct default classes are assigned", function (assert) {
        // Arrange
        sap.ui.getCore().applyChanges();

        // Act
        var oVbox = this.oSection._getCompositeAggregation();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), false,
            "The section does not have the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned when not editable, but hidden", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Act
        this.oSection.byId("showHide").firePress();

        this.oSection.setEditable(false);
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), false,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit and hidden", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Act
        this.oSection.byId("showHide").firePress();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is empty", function (assert) {
        // Act
        var oCustomData = this.oSection.byId("content").getCustomData()[0];

        // Assert
        assert.strictEqual(oCustomData.getKey(), "help-id", "The key property is: \"help-id\".");
        assert.strictEqual(oCustomData.getValue(), "", "The value property is: \"\".");
        assert.strictEqual(oCustomData.getWriteToDom(), false, "The writeToDom property is: false.");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is set", function (assert) {
        // Arrange
        this.oSection.setDataHelpId("someId");
        sap.ui.getCore().applyChanges();

        // Act
        var oCustomData = this.oSection.byId("content").getCustomData()[0];

        // Assert
        assert.strictEqual(oCustomData.getKey(), "help-id", "The key property is: \"help-id\".");
        assert.strictEqual(oCustomData.getValue(), "someId", "The value property is: \"someId\".");
        assert.strictEqual(oCustomData.getWriteToDom(), true, "The writeToDom property is: true.");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is empty, but it is the default section", function (assert) {
        // Arrange
        this.oSection.setDefault(true);
        sap.ui.getCore().applyChanges();

        // Act
        var oCustomData = this.oSection.byId("content").getCustomData()[0];

        // Assert
        assert.strictEqual(oCustomData.getKey(), "help-id", "The key property is: \"help-id\".");
        assert.strictEqual(oCustomData.getValue(), "recently-added-apps", "The value property is: \"recently-added-apps\".");
        assert.strictEqual(oCustomData.getWriteToDom(), true, "The writeToDom property is: true.");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is set, but it is the default section", function (assert) {
        // Arrange
        this.oSection.setDefault(true);
        this.oSection.setDataHelpId("someId");
        sap.ui.getCore().applyChanges();

        // Act
        var oCustomData = this.oSection.byId("content").getCustomData()[0];

        // Assert
        assert.strictEqual(oCustomData.getKey(), "help-id", "The key property is: \"help-id\".");
        assert.strictEqual(oCustomData.getValue(), "recently-added-apps", "The value property is: \"recently-added-apps\".");
        assert.strictEqual(oCustomData.getWriteToDom(), true, "The writeToDom property is: true.");
    });

    QUnit.module("setEditable", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oSection = null;
        }
    });

    QUnit.test("Setter for setEditable property returns this", function (assert) {
        // Act
        var oReturn = this.oSection.setEditable(true);
        // Assert
        assert.strictEqual(oReturn, this.oSection, "'this' reference returned");
    });

    QUnit.test("Property not changed for 'editable' property prevents rendering", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        var oSpy = sinon.spy(this.oSection, "invalidate");
        var oSpySetProperty = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setEditable(true);
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation expected.");
        assert.strictEqual(oSpySetProperty.callCount, 0, "'setProperty' not called");
    });

    QUnit.test("Setter call for property 'editable' does nothing with value 'undefined'", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setEditable();
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "'setProperty' not called");
    });

    QUnit.module("setShowSection", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oSection = null;
        }
    });

    QUnit.test("Setter for property 'showSection' returns this", function (assert) {
        // Act
        var oReturn = this.oSection.setShowSection(true);
        // Assert
        assert.strictEqual(oReturn, this.oSection, "'this' reference returned");
    });

    QUnit.test("Property change for showSection property prevents rendering", function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection(true);
        // Assert
        assert.ok(oSpy.calledOnceWith("showSection", true, true), "No invalidation for showSection");
    });

    QUnit.test("Setter for property 'showSection' does nothing if value is undefined", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection();
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation for showSection");
    });

    QUnit.test("Setter for property 'showSection' does nothing if value is same", function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection(false);
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation for showSection");
    });

    QUnit.module("The function init", {
        beforeEach: function () {
            this.oGridStub = {
                addEventDelegate: sinon.stub(),
                attachBorderReached: sinon.stub(),
                toggleStyleClass: sinon.stub()
            };
            this.oFlatAreaStub = {
                addEventDelegate: sinon.stub(),
                attachBorderReached: sinon.stub(),
                toggleStyleClass: sinon.stub()
            };
            this.oCompactStub = {
                addEventDelegate: sinon.stub(),
                setVisible: sinon.stub(),
                attachBorderReached: sinon.stub(),
                toggleStyleClass: sinon.stub()
            };
            this.oByIdStub = sinon.stub(Section.prototype, "byId");
            this.oByIdStub.withArgs("defaultArea").returns(this.oGridStub);
            this.oByIdStub.withArgs("flatArea").returns(this.oFlatAreaStub);
            this.oByIdStub.withArgs("compactArea").returns(this.oCompactStub);
            this.oVBox = {
                toggleStyleClass: sinon.stub(),
                addEventDelegate: sinon.stub()
            };
            this.oByIdStub.withArgs("content").returns(this.oVBox);

            this.oSection = new Section();

            this.oEventDelegate = this.oGridStub.addEventDelegate.firstCall.args[0];
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oByIdStub.restore();
        }
    });

    QUnit.test("checks that the eventDelegate is called after initiating the section.", function (assert) {
        // Assert
        assert.strictEqual(this.oGridStub.addEventDelegate.callCount, 1, "calls the addEventDelegate.");
    });

    QUnit.test("checks that the eventDelegate has the property onAfterRendering.", function (assert) {
        // Arrange
        var oEventDelegate = this.oGridStub.addEventDelegate.firstCall.args[0];

        // Assert
        assert.strictEqual(oEventDelegate.hasOwnProperty("onAfterRendering"), true, "onAfterRendering was received");
    });

    QUnit.test("checks that the attachBorderReached method is called after initiating the section.", function (assert) {
        // Assert
        assert.strictEqual(this.oGridStub.attachBorderReached.callCount, 1, "calls the attachBorderReached method.");
    });

    QUnit.test("checks that toggleStyleClass is called correctly.", function (assert) {
        // Arrange
        sinon.stub(this.oSection, "getDefaultItems").returns([]);
        sinon.stub(this.oSection, "getFlatItems").returns([]);
        sinon.stub(this.oSection, "getCompactItems").returns([]);

        // Act
        this.oEventDelegate.onAfterRendering();

        // Assert
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.callCount, 1, "toggleStyleClass was called once.");
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.firstCall.args[0], "sapUshellSectionNoVisualizations", "toggleStyleClass was called with the correct string parameter.");
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.firstCall.args[1], true, "toggleStyleClass was called with the correct second parameter.");
    });

    QUnit.test("check extendedChangeDetection", function (assert) {
        //Assert
        assert.strictEqual(this.oSection.bUseExtendedChangeDetection, true, "extendedChangeDetection is activated");
    });

    QUnit.test("InvisibleMessage was created", function (assert) {
        // Assert
        assert.strictEqual(this.oSection._oInvisibleMessageInstance.isA("sap.ui.core.InvisibleMessage"), true,
            "Invisible Message was created correctly.");
    });

    QUnit.test("Implicit conversion functions created", function (assert) {
        // Assert
        assert.strictEqual(typeof this.oSection._fnGlobalDragStart, "function",
            "global drag start function was created.");
        assert.strictEqual(typeof this.oSection._fnGlobalDragEnd, "function",
            "global drag end function was created.");
    });

    QUnit.test("Implicit conversion functions are fired", function (assert) {
        // Assert
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), false,
            "after initialization the _duringDrag property is false.");

        // Act
        document.dispatchEvent(new Event("dragstart"));

        // Assert
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), true,
            "after firing the dragstart event, the _duringDrag property is true.");

        // Act
        document.dispatchEvent(new Event("dragend"));

        // Assert
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), false,
            "after firing the dragend event, the _duringDrag property is false.");
    });

    QUnit.module("Section aria-label", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("Section has no title", function (assert) {
        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oSection.byId("content").getDomRef().getAttribute("aria-label"),
            resources.i18n.getText("Section.Description.EmptySectionTitle"),
            "aria-label is as expected.");
    });

    QUnit.test("Section has a title", function (assert) {
        // Arrange
        this.oSection.setTitle("Some Title");
        this.oSection.byId("title-edit").fireChange();

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oSection.byId("content").getDomRef().getAttribute("aria-label"),
            resources.i18n.getText("Section.Description", "Some Title"),
            "aria-label is as expected.");
    });

    QUnit.test("Section has \" \" as a title", function (assert) {
        // Arrange
        this.oSection.setTitle(" ");
        this.oSection.byId("title-edit").fireChange();

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oSection.byId("content").getDomRef().getAttribute("aria-label"),
            resources.i18n.getText("Section.Description.EmptySectionTitle"),
            "aria-label is as expected.");
    });

    QUnit.module("The function destroy", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oInvisibleMessageDestroyStub = sandbox.stub(this.oSection._oInvisibleMessageInstance, "destroy");
            this.oDefaultItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oDefaultItemsChangeDetection, "destroy");
            this.oFlatItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oFlatItemsChangeDetection, "destroy");
            this.oCompactItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oCompactItemsChangeDetection, "destroy");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("InvisibleMessage was destroyed", function (assert) {
        // Act
        this.oSection.destroy();

        // Assert
        assert.strictEqual(this.oInvisibleMessageDestroyStub.callCount, 1,
            "InvisibleMessage was destroyed correctly.");
    });

    QUnit.test("ChangeDetection instances were destroyed", function (assert) {
        // Act
        this.oSection.destroy();

        // Assert
        assert.strictEqual(this.oDefaultItemsChangeDetectionDestroyStub.callCount, 1, "defaultItemsChangeDetection was destroyed correctly.");
        assert.strictEqual(this.oFlatItemsChangeDetectionDestroyStub.callCount, 1, "flatItemsChangeDetection was destroyed correctly.");
        assert.strictEqual(this.oCompactItemsChangeDetectionDestroyStub.callCount, 1, "compactItemsChangeDetection was destroyed correctly.");
    });

    QUnit.test("Implicit conversion function for dragStart is not bound anymore", function (assert) {
        // Arrange
        this.oSection.setProperty("_duringDrag", false);

        // Act
        this.oSection.destroy();
        document.dispatchEvent(new Event("dragstart"));

        // Assert
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), false,
            "after firing the dragstart event, the _duringDrag property is still false.");
    });

    QUnit.test("Implicit conversion function for dragEnd is not bound anymore", function (assert) {
        // Arrange
        this.oSection.setProperty("_duringDrag", true);

        // Act
        this.oSection.destroy();
        document.dispatchEvent(new Event("dragend"));

        // Assert
        assert.strictEqual(this.oSection.getProperty("_duringDrag"), true,
            "after firing the dragend event, the _duringDrag property is still true.");
    });

    QUnit.module("The _showHidePressed function", {
        beforeEach: function () {
            this.oSection = new Section({
                editable: true
            });
            this.oSection.placeAt("qunit-fixture");

            this.oFireSectionVisibilityChangeStub = sandbox.stub(this.oSection, "fireSectionVisibilityChange");
            this.oAnnounceStub = sandbox.stub(this.oSection._oInvisibleMessageInstance, "announce");
            this.oMResources = sap.ui.getCore().getLibraryResourceBundle("sap.m");
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("announcement was done and event was fired, if Section is hidden", function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        sap.ui.getCore().applyChanges();
        this.oFireSectionVisibilityChangeStub.reset();

        // Act
        this.oSection.byId("showHide").firePress();
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oAnnounceStub.callCount, 1, "Announcement was done once.");
        assert.deepEqual(this.oAnnounceStub.args[0], [
            [
                resources.i18n.getText("Section.nowBeingShown"),
                resources.i18n.getText("Section.ButtonLabelChanged"),
                resources.i18n.getText("Section.Button.Hide"),
                this.oMResources.getText("ACC_CTR_TYPE_BUTTON")
            ].join(" "),
            InvisibleMessageMode.Polite
        ], "Announcement was correct.");
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: true }],
            "correct value was passed to event handler");
    });

    QUnit.test("announcement was done and event was fired, if Section is shown", function (assert) {
        // Arrange
        this.oSection.setShowSection(true);
        sap.ui.getCore().applyChanges();
        this.oFireSectionVisibilityChangeStub.reset();

        // Act
        this.oSection.byId("showHide").firePress();
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oAnnounceStub.callCount, 1, "Announcement was done once.");
        assert.deepEqual(this.oAnnounceStub.args[0], [
            [
                resources.i18n.getText("Section.nowBeingHidden"),
                resources.i18n.getText("Section.ButtonLabelChanged"),
                resources.i18n.getText("Section.Button.Show"),
                this.oMResources.getText("ACC_CTR_TYPE_BUTTON")
            ].join(" "),
            InvisibleMessageMode.Polite
        ], "Announcement was correct.");
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: false }],
            "correct value was passed to event handler");
    });

    QUnit.module("The setShowSection function", {
        beforeEach: function () {
            this.oSection = new Section({
                editable: true
            });
            this.oSection.placeAt("qunit-fixture");

            this.oFireSectionVisibilityChangeStub = sandbox.stub(this.oSection, "fireSectionVisibilityChange");
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("if value is undefined", function (assert) {
        // Act
        this.oSection.setShowSection(undefined);
        sap.ui.getCore().applyChanges();

        // Assert
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.callCount, 0, "fireSectionVisibilityChange was not called");
    });

    QUnit.test("if value is true", function (assert) {
        // Arrage
        this.oSection.setShowSection(false);
        this.oFireSectionVisibilityChangeStub.reset();
        // Act
        this.oSection.setShowSection(true);
        // Assert
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: true }],
            "correct value was passed to event handler");
    });

    QUnit.test("if value is false", function (assert) {
        // Act
        this.oSection.setShowSection(false);
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: false }],
            "correct value was passed to event handler");
    });

    QUnit.module("getVisualizations", {
        beforeEach: function () {
            this.aItems = [
                {
                    id: "11",
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/items/11")
                    })
                }, {
                    id: "2",
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/items/2")
                    })
                }, {
                    id: "1",
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/items/1")
                    })
                }
            ];


            this.oSection = new Section();

            sandbox.stub(this.oSection, "getAllItems").returns(this.aItems);
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("Sorts the items numerical by index", function (assert) {
        // Arrange
        var aExpectedResult = ["1", "2", "11"];

        // Act
        var aResult = this.oSection.getVisualizations();
        var aResultIndices = aResult.map(function (oItem) {
            return oItem.id;
        });

        // Assert
        assert.deepEqual(aResultIndices, aExpectedResult, "Returned the correct result");
    });


    QUnit.module("displayFormatHint", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("Handle displayFormatHint 'tile' & 'default' like 'standard' (legacy check)", function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "default" },
                { displayFormatHint: "tile" },
                { displayFormatHint: "standard" },
                { }
            ]
        });
        var oBindingInfo = {
            path: "/viz",
            factory: function () {
                return new GenericTile();
            }
        };

        // Act
        this.oSection.setModel(oModel);
        this.oSection.bindVisualizations(oBindingInfo);

        // Assert
        assert.equal(this.oSection.getDefaultItems().length, 4, "All visualizations in 'default'");
        assert.equal(this.oSection.getAllItems().length, 4, "All visualizations there");
    });

    QUnit.test("Handle displayFormatHint 'tile' like 'default' (legacy check)", function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "foobar" }
            ]
        });
        var oBindingInfo = {
            path: "/viz",
            factory: function (oData) {
                return new GenericTile();
            }
        };

        // Act
        this.oSection.setModel(oModel);
        this.oSection.bindVisualizations(oBindingInfo);

        // Assert
        assert.equal(this.oSection.getDefaultItems().length, 1, "Visualization found in 'default'");
        assert.equal(this.oSection.getAllItems().length, 1, "Visualization there");
    });

    QUnit.module("The function _onDragEnter", {
        beforeEach: function () {
            this.oSection = new Section();

            this.oSourceAreaMock = {
                data: sandbox.stub()
            };
            this.oTargetAreaMock = {
                data: sandbox.stub()
            };

            this.oDragControlMock = {
                getParent: sandbox.stub().returns(this.oSourceAreaMock)
            };
            this.oDropControlMock = {
                getParent: sandbox.stub().returns(this.oTargetAreaMock),
                data: sandbox.stub()
            };

            this.oDragSessionMock = {
                getDragControl: sandbox.stub().returns(this.oDragControlMock),
                getDropControl: sandbox.stub().returns(this.oDropControlMock)
            };

            this.oEventMock = {
                getParameter: sandbox.stub().withArgs("dragSession").returns(this.oDragSessionMock),
                preventDefault: sandbox.stub()
            };


            this.oFireAreaDragEnterStub = sandbox.stub(this.oSection, "fireAreaDragEnter");
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Fires the areaDragEnter event with the correct event parameters", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("area").returns("default");
        this.oDropControlMock.data.withArgs("area").returns("flat");

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].originalEvent, this.oEventMock, "The original event was passed");
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].dragControl, this.oDragControlMock, "The dragged control was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].sourceArea, "default", "The source area was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].targetArea, "flat", "The target area was passed");

    });

    QUnit.test("Fires the areaDragEnter event with the correct event parameters if the drop target is not the target area", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("area").returns("default");
        this.oDropControlMock.data.withArgs("area").returns(null);
        this.oTargetAreaMock.data.withArgs("area").returns("flat");

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].originalEvent, this.oEventMock, "The original event was passed");
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].dragControl, this.oDragControlMock, "The dragged control was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].sourceArea, "default", "The source area was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].targetArea, "flat", "The target area was passed");
    });

    QUnit.test("Prevents the drop from outside the section into an area of the default section", function (assert) {
        //Arrange
        this.oTargetAreaMock.data.withArgs("default").returns(true);

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oEventMock.preventDefault.callCount, 1, "The drop was prevented");
    });

    QUnit.test("Allows drag and drop within an area of the default section", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("default").returns(true);
        this.oTargetAreaMock.data.withArgs("default").returns(true);

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oEventMock.preventDefault.callCount, 0, "The drop was allowed");
    });

    QUnit.test("Doesn't do anything if there is no target area", function (assert) {
        //Arrange
        delete this.oDragSessionMock.getDropControl;

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oFireAreaDragEnterStub.callCount, 0, "The areaDragEnter event was not fired");
    });

    QUnit.module("The function _getDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();

            this.oParentControl = {
                data: sandbox.stub().withArgs("area").returns(DisplayFormat.Standard)
            };

            this.oLayoutData = {
                getRows: sandbox.stub().returns(2),
                getColumns: sandbox.stub().returns(4)
            };

            this.oVisualization = {
                getParent: sandbox.stub().returns(this.oParentControl),
                getLayoutData: sandbox.stub().returns(this.oLayoutData)
            };

        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Uses the visualizations layout data for a drop within the same content area type", function (assert) {
        //Arrange
        var oExpectedDropIndicatorSize = {
            rows: 2,
            columns: 4
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Standard);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The visualization's size was returned");
    });

    QUnit.test("Returns the default layout for a drop into the default content area", function (assert) {
        //Arrange
        this.oParentControl.data.withArgs("area").returns(DisplayFormat.Flat);
        var oExpectedDropIndicatorSize = {
            rows: 2,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Standard);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size of the default area was returned");
    });

    QUnit.test("Returns the default layout for a drop into the flat content area", function (assert) {
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size of the flat area was returned");
    });

    QUnit.test("Returns the default layout if there is no parent control", function (assert) {
        //Arrange
        this.oVisualization.getParent.returns(null);
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size was returned");
    });

    QUnit.test("Returns the default layout if the visualization doesn't have layout data", function (assert) {
        //Arrange
        delete this.oVisualization.getLayoutData;
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size was returned");
    });

    QUnit.module("The function _getDefaultDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oGetDropIndicatorSizeStub = sandbox.stub(this.oSection, "_getDropIndicatorSize");
            this.oVisualization = {
                visualization: "mock"
            };
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls _getDropIndicatorSize for the default area", function (assert) {
        //Arrange
        this.oExpectedArgs = [
            this.oVisualization,
            DisplayFormat.Standard
        ];

        //Act
        this.oSection._getDefaultDropIndicatorSize(this.oVisualization);

        //Assert
        assert.deepEqual(this.oGetDropIndicatorSizeStub.args[0], this.oExpectedArgs, "The correct arguments were passed through");
    });

    QUnit.module("The function _getFlatDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oGetDropIndicatorSizeStub = sandbox.stub(this.oSection, "_getDropIndicatorSize");
            this.oVisualization = {
                visualization: "mock"
            };
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls _getDropIndicatorSize for the flat area", function (assert) {
        //Arrange
        this.oExpectedArgs = [
            this.oVisualization,
            DisplayFormat.Flat
        ];

        //Act
        this.oSection._getFlatDropIndicatorSize(this.oVisualization);

        //Assert
        assert.deepEqual(this.oGetDropIndicatorSizeStub.args[0], this.oExpectedArgs, "The correct arguments were passed through");
    });
});