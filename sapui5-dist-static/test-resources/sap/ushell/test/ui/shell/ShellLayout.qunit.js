// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ui.shell.ShellLayout
 */
sap.ui.require([
    "sap/ui/core/library",
    "sap/ui/core/Control",
    "sap/ui/util/Storage",
    "sap/ushell/ui/shell/ShellLayout",
    "sap/ushell/ui/shell/SplitContainer",
    "sap/ushell/ui/shell/ToolArea",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellFloatingAction",
    "sap/ushell/ui/shell/ShellFloatingActions",
    "sap/ushell/ui/shell/FloatingContainer",
    "sap/m/Bar",
    "sap/m/Text",
    "sap/m/Button",
    "sap/ushell/Config",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/ui/core/InvisibleMessage"
], function (
    coreLibrary,
    Control,
    Storage,
    ShellLayout,
    SplitContainer,
    ToolArea,
    ToolAreaItem,
    ShellHeadItem,
    ShellHeader,
    ShellFloatingAction,
    ShellFloatingActions,
    FloatingContainer,
    Bar,
    Text,
    Button,
    Config,
    Device,
    resources,
    EventHub,
    InvisibleMessage
) {
    "use strict";
    /* global QUnit, my */

    var storage = new Storage();

    sap.ui.core.Control.extend("my.Test", {
        renderer: function (rm, ctrl) {
            rm.write("<div style='width:10px;height:10px;background-color:gray;'");
            rm.writeControlData(ctrl);
            rm.write("></div>");
        }
    });

    var oShell,
        oShell2,
        oSearchButton,
        oShellHeader,
        oShellHeader2,
        oShellFloatingContainer,
        oShellFloatingContainer2;

    QUnit.module("sap.ushell.ui.shell.ShellLayout", {
        beforeEach: function () {
            jQuery("<div id=\"canvas\"></div>").appendTo("body");
            storage.clear();
            var oShellSplitContainer,
                oShellToolArea,
                oShellFloatingActions,
                oShellSplitContainer2,
                oShellToolArea2,
                oShellFloatingActions2;

            oShellSplitContainer = new SplitContainer({
                id: "shell-split",
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });
            oShellToolArea = new ToolArea({
                id: "shell-toolArea",
                toolAreaItems: [new ToolAreaItem("_toolarea_itm")]
            });


            oSearchButton = new ShellHeadItem("sf");

            oShellHeader = new ShellHeader({
                id: "shell-header",
                headItems: [new ShellHeadItem("_itm"), oSearchButton],
                headEndItems: [new ShellHeadItem("_end_itm")],
                title: "",
                search: new my.Test("search")
            });

            oShellFloatingActions = new ShellFloatingActions({
                id: "shell-floatingActions",
                floatingActions: [new ShellFloatingAction("_floatingAction")]
            });

            oShellFloatingContainer = new FloatingContainer({
                id: "shell-floatingContainer",
                content: [new Button("testButton", {test: "testButton"})]
            });

            oShell = new ShellLayout({
                id: "shell",
                header: oShellHeader,
                toolArea: oShellToolArea,
                canvasSplitContainer: oShellSplitContainer,
                floatingContainer: oShellFloatingContainer,
                floatingActionsContainer: oShellFloatingActions
            });

            oShellSplitContainer2 = new SplitContainer({
                showSecondaryContent: true
            });

            oShellToolArea2 = new ToolArea({
                textVisible: false
            });


            oShellHeader2 = new ShellHeader({
                title: "TITLE",
                searchState: ShellHeader.prototype.SearchState.COL,
                logo: "../icon.png"
            });

            oShellFloatingContainer2 = new FloatingContainer({
                id: "shell-floatingContainer2",
                content: [new Button("testButton2", {test: "testButton"})]
            });

            oShellFloatingActions2 = new ShellFloatingActions({
                isFooterVisible: true
            });

            oShell2 = new ShellLayout({
                id: "shell2",
                header: oShellHeader2,
                toolArea: oShellToolArea2,
                canvasSplitContainer: oShellSplitContainer2,
                floatingActionsContainer: oShellFloatingActions2,
                floatingContainer: oShellFloatingContainer2,
                headerVisible: false,
                toolAreaVisible: true
            });
            oShellHeader2.setShellLayout(oShell2);

            oShell.placeAt("canvas");
            oShellHeader.setShellLayout(oShell);
            oShellHeader.createUIArea();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oShell.destroy();
            oShell2.destroy();
            oSearchButton.destroy();
            jQuery("#canvas").remove();
            oShellFloatingContainer.destroy();
            oShellFloatingContainer2.destroy();
            oShellHeader.destroy();
            oShellHeader2.destroy();
        }
    });

    /** ----------**/
    /** Rendering **/
    /** ----------**/
    QUnit.test("Content", function (assert) {
        var done = assert.async();
        setTimeout(function () {
            assert.ok(!!jQuery("#shell-header-hdr-search").length, "Search rendered correctly");
            assert.ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-begin"), jQuery.sap.domById("_itm")), "Header Items rendered correctly");
            assert.ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-header-hdr-end"), jQuery.sap.domById("_end_itm")), "Header End Items rendered correctly");
            assert.ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-canvas"), jQuery.sap.domById("_ctnt")), "Content rendered correctly");
            assert.ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-split-pane"), jQuery.sap.domById("_pane_ctnt")), "Pane Content rendered correctly");
            assert.ok(jQuery.sap.containsOrEquals(jQuery.sap.domById("shell-floatingContainer"), jQuery.sap.domById("testButton")), "FloatingContainer rendered correctly");
            oShell.destroy();
            done();
        }, 500);
    });

    /** ----**/
    /** API **/
    /** ----**/
    var _sSapLogo = sap.ui.require.toUrl("sap/ushell") + "/themes/base/img/SAPLogo.svg"; // default logo when the theme is applied
    QUnit.test("Properties - Default Values", function (assert) {
        assert.equal(oShell.getHeaderVisible(), true, "Default 'headerVisible'");
        assert.equal(oShell.getToolAreaVisible(), false, "Default 'toolAreaVisible'");
        assert.equal(oShell.getHeader().getLogo(), _sSapLogo, "Default 'icon'");
        assert.equal(oShell.getFloatingContainerVisible(), false, "Default FloatingContainer visiblity 'false'");
        assert.equal(oShell.getHeader().getSearchState(), ShellHeader.prototype.SearchState.COL, "Default 'searchVisible'");
        assert.equal(oShell.getHeader().getTitle(), "", "Default Title");
        assert.equal(oShell.getFloatingActionsContainer().getIsFooterVisible(), false, "Default 'isFooterVisible'");
    });
    QUnit.test("Properties - Custom Values", function (assert) {
        assert.equal(oShell2.getHeaderVisible(), false, "Default 'headerVisible'");
        assert.equal(oShell2.getToolAreaVisible(), true, "Default 'toolAreaVisible'");
        assert.equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom 'icon'");
        assert.equal(oShell2.getHeader().getSearchState(), ShellHeader.prototype.SearchState.COL, "Custom 'searchVisible'");
        assert.equal(oShell2.getHeader().getTitle(), "TITLE", "Default Title");
        assert.equal(oShell2.getFloatingActionsContainer().getIsFooterVisible(), true, "Custom 'isFooterVisible'");
    });
    QUnit.test("Set/Get title", function (assert) {
        assert.equal(oShell.getHeader().getTitle(), "", "Default Title - no value exist");// default
        oShell.getHeader().setTitle("DEMO_TITLE");
        assert.equal(oShell.getHeader().getTitle(), "DEMO_TITLE", "Custom Title");// set a new value
        oShell.getHeader().setTitle("");
        assert.equal(oShell.getHeader().getTitle(), "", "Empty Title");// empty value
        oShell.setFloatingContainerVisible(true);
        assert.equal(oShell.getFloatingContainerVisible(), true, "Floating Container visibility was set to true");
    });
    QUnit.test("Set/Get logo", function (assert) {
        assert.equal(oShell.getHeader().getLogo(), _sSapLogo, "Default logo - invisible");// default
        oShell.getHeader().setLogo("../icon.png");
        assert.equal(oShell2.getHeader().getLogo(), "../icon.png", "Custom Logo");
        oShell.getHeader().setLogo("");
        assert.equal(oShell.getHeader().getLogo(), _sSapLogo, "invisible");// default
    });
    QUnit.test("Shell Header Types", function (assert) {
        var oHeader = oShell.getHeader();
        assert.ok(oHeader instanceof ShellHeader, "Header type is correct");

        var oHeadItems = oHeader.getMetadata().getAllAggregations().headItems;
        assert.equal(oHeadItems.type, "sap.ushell.ui.shell.ShellHeadItem", "Head Items type is correct");

        var oHeadEndItems = oHeader.getMetadata().getAllAggregations().headEndItems;
        assert.equal(oHeadEndItems.type, "sap.ui.core.Control", "Head End Items type is correct");
    });
    QUnit.test("Shell Header - add / remove HeadItems", function (assert) {
        var oHeader = oShell.getHeader(),
            oHeadItems = oHeader.getHeadItems(),
            headItem = sap.ui.getCore().byId("_itm"),
            newHeadItem = new ShellHeadItem("_itm2");

        assert.equal(oHeadItems.length, 2, "Initial number of headItems controls");

        oHeader.addHeadItem(newHeadItem);
        oHeadItems = oHeader.getHeadItems();
        assert.equal(oHeadItems.length, 3, "number of headItems controls after add");

        oHeader.removeHeadItem(newHeadItem);
        oHeadItems = oHeader.getHeadItems();
        assert.equal(oHeadItems.length, 2, "number of headItems controls after remove");

        oHeader.removeAllHeadItems();
        oHeadItems = oHeader.getHeadItems();
        assert.equal(oHeadItems.length, 0, "number of headItems controls after removeAll");

        headItem.destroy();
        newHeadItem.destroy();
    });
    QUnit.test("Shell Header - add / remove HeadEndItems", function (assert) {
        var oHeader = oShell.getHeader(),
            oHeadEndItems = oHeader.getHeadEndItems(),
            headEndItem = sap.ui.getCore().byId("_end_itm"),
            newHeadEndItem = new ShellHeadItem("_end_itm2");

        assert.equal(oHeadEndItems.length, 1, "Initial number of headEndItems controls");

        oHeader.addHeadEndItem(newHeadEndItem);
        oHeadEndItems = oHeader.getHeadEndItems();
        assert.equal(oHeadEndItems.length, 2, "number of headEndItems controls after add");

        oHeader.removeHeadEndItem(newHeadEndItem);
        oHeadEndItems = oHeader.getHeadEndItems();
        assert.equal(oHeadEndItems.length, 1, "number of headEndItems controls after remove");

        oHeader.removeAllHeadEndItems();
        oHeadEndItems = oHeader.getHeadEndItems();
        assert.equal(oHeadEndItems.length, 0, "number of headEndItems controls after removeAll");

        headEndItem.destroy();
        newHeadEndItem.destroy();
    });
    QUnit.test("Shell Header - set / destroy Search", function (assert) {
        var oHeader = oShell.getHeader(),
            oSearch = oHeader.getSearch(),
            newSearch = new Control();

        assert.ok(oSearch, "search control exists");

        oHeader.destroySearch();
        oSearch = oHeader.getSearch();
        assert.ok(!oSearch, "No search control after destroy");

        oHeader.setSearch(newSearch);
        oSearch = oHeader.getSearch();
        assert.ok(!!oSearch, "Search control available after set");
    });
    QUnit.test("Floating Actions - types ", function (assert) {
        var oFloatingActionsContainer = oShell.getFloatingActionsContainer();
        assert.ok(oFloatingActionsContainer instanceof ShellFloatingActions, "Floating Actions type is correct");

        var oFloatingActions = oFloatingActionsContainer.getMetadata().getAllAggregations().floatingActions;
        assert.equal(oFloatingActions.type, "sap.ushell.ui.shell.ShellFloatingAction", "Floating Action type is correct");
    });
    QUnit.test("Floating Actions - add / remove floatingAction items", function (assert) {
        var oFloatingActionsContainer = oShell.getFloatingActionsContainer(),
            oFloatingActions = oFloatingActionsContainer.getFloatingActions(),
            floatingAction = sap.ui.getCore().byId("_floatingAction"),
            newFloatingAction = new ShellFloatingAction("_floatingAction2");

        assert.equal(oFloatingActions.length, 1, "Initial number of floatingAction controls");

        oFloatingActionsContainer.addFloatingAction(newFloatingAction);
        oFloatingActions = oFloatingActionsContainer.getFloatingActions();
        assert.equal(oFloatingActions.length, 2, "number of floatingAction controls after add");

        oFloatingActionsContainer.removeFloatingAction(newFloatingAction);
        oFloatingActions = oFloatingActionsContainer.getFloatingActions();
        assert.equal(oFloatingActions.length, 1, "number of floatingAction controls after remove");

        oFloatingActionsContainer.removeAllFloatingActions();
        oFloatingActions = oFloatingActionsContainer.getFloatingActions();
        assert.equal(oFloatingActions.length, 0, "number of floatingAction controls after removeAll");

        floatingAction.destroy();
        newFloatingAction.destroy();
    });
    QUnit.test("Floating Actions - isFooterVisible property", function (assert) {
        assert.ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "Default isFooterVisible - false");
        oShell.getFloatingActionsContainer().setIsFooterVisible(true);
        assert.ok(oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - true");
        oShell.getFloatingActionsContainer().setIsFooterVisible(false);
        assert.ok(!oShell.getFloatingActionsContainer().getIsFooterVisible(), "isFooterVisible - false");
    });
    QUnit.test("Split Container - types ", function (assert) {
        var oCanvasSplitContainer = oShell.getCanvasSplitContainer();
        assert.ok(oCanvasSplitContainer instanceof SplitContainer, "Split Actions type is correct");

        var oContent = oCanvasSplitContainer.getMetadata().getAllAggregations().content;
        assert.equal(oContent.type, "sap.ui.core.Control", "Content type is correct");

        var oSecondaryContent = oCanvasSplitContainer.getMetadata().getAllAggregations().secondaryContent;
        assert.equal(oSecondaryContent.type, "sap.ui.core.Control", "Secondary Content type is correct");

        var oSubHeader = oCanvasSplitContainer.getMetadata().getAllAggregations().subHeader;
        assert.equal(oSubHeader.type, "sap.ui.core.Control", "Sub Header type is correct");
    });
    QUnit.test("Split Container - set / destroy Sub Header", function (assert) {
        var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
            oSubHeader = oCanvasSplitContainer.getSubHeader(),
            newSubHeader = new my.Test("_subheader_ctnt2");

        assert.ok(oSubHeader, "subheader control exists");

        oCanvasSplitContainer.destroySubHeader();
        oSubHeader = oCanvasSplitContainer.getSubHeader();
        assert.equal(oSubHeader.length, 0, "No subheader controls after destroy");

        oCanvasSplitContainer.addSubHeader(newSubHeader);
        oSubHeader = oCanvasSplitContainer.getSubHeader();
        assert.ok(oSubHeader, "subheader exists after set");
    });
    QUnit.test("Split Container - add / remove content items", function (assert) {
        var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
            oContent = oCanvasSplitContainer.getContent(),
            control = sap.ui.getCore().byId("_ctnt"),
            newControl = new my.Test("_ctnt2");

        assert.equal(oContent.length, 1, "Initial number of content controls");

        oCanvasSplitContainer.addContent(newControl);
        oContent = oCanvasSplitContainer.getContent();
        assert.equal(oContent.length, 2, "number of content controls after add");

        oCanvasSplitContainer.removeContent(newControl);
        oContent = oCanvasSplitContainer.getContent();
        assert.equal(oContent.length, 1, "number of content controls after remove");

        oCanvasSplitContainer.removeAllContent();
        oContent = oCanvasSplitContainer.getContent();
        assert.equal(oContent.length, 0, "number of content controls after removeAll");

        control.destroy();
        newControl.destroy();
    });
    QUnit.test("Split Container - add / remove secondaryContent items", function (assert) {
        var oCanvasSplitContainer = oShell.getCanvasSplitContainer(),
            oSecondaryContent = oCanvasSplitContainer.getSecondaryContent(),
            control = sap.ui.getCore().byId("_pane_ctnt"),
            newControl = new my.Test("_pane_ctnt2");

        assert.equal(oSecondaryContent.length, 1, "Initial number of secondaryContent controls");

        oCanvasSplitContainer.addSecondaryContent(newControl);
        oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
        assert.equal(oSecondaryContent.length, 2, "number of secondaryContent controls after add");

        oCanvasSplitContainer.removeSecondaryContent(newControl);
        oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
        assert.equal(oSecondaryContent.length, 1, "number of secondaryContent controls after remove");

        oCanvasSplitContainer.removeAllSecondaryContent();
        oSecondaryContent = oCanvasSplitContainer.getSecondaryContent();
        assert.equal(oSecondaryContent.length, 0, "number of secondaryContent controls after removeAll");

        control.destroy();
        newControl.destroy();
    });
    QUnit.test("Tool Area - types ", function (assert) {
        var oToolArea = oShell.getToolArea();
        assert.ok(oToolArea instanceof ToolArea, "Tool Area type is correct");

        var oToolAreaItems = oToolArea.getMetadata().getAllAggregations().toolAreaItems;
        assert.equal(oToolAreaItems.type, "sap.ushell.ui.shell.ToolAreaItem", "toolarea item type is correct");
    });
    QUnit.test("Tool Area - add / remove toolarea items", function (assert) {
        var oToolArea = oShell.getToolArea(),
            aToolAreaItems = oToolArea.getToolAreaItems(),
            toolareaItem = sap.ui.getCore().byId("_toolarea_itm"),
            newToolareaItem = new ToolAreaItem("_toolarea_itm2");

        assert.equal(aToolAreaItems.length, 1, "Initial number of toolarea controls");

        oToolArea.addToolAreaItem(newToolareaItem);
        aToolAreaItems = oToolArea.getToolAreaItems();
        assert.equal(aToolAreaItems.length, 2, "number of toolarea controls after add");

        oToolArea.removeToolAreaItem(newToolareaItem);
        aToolAreaItems = oToolArea.getToolAreaItems();
        assert.equal(aToolAreaItems.length, 1, "number of toolarea controls after remove");

        oToolArea.removeAllToolAreaItems();
        aToolAreaItems = oToolArea.getToolAreaItems();
        assert.equal(aToolAreaItems.length, 0, "number of toolarea controls after removeAll");

        toolareaItem.destroy();
        newToolareaItem.destroy();
    });
    QUnit.test("destroy", function (assert) {
        // Arrange
        this.oRm = sap.ui.getCore().createRenderManager();
        this.oRm.renderControl(oShell);
        this.oRm.flush(document.getElementById("canvas"));
        oShell.setFooter(new Bar({
            contentLeft: [new Text({
                text: "test"
            })]
        }));

        assert.ok(oShell._oDoable, "The doable config existed");
        assert.ok(oShell._oRm, "The RenderManager existed");

        // Act
        oShell.destroy();

        // Assert
        assert.equal(oShell._oRm, null, "The RenderManager instance was set to null.");
        assert.equal(oShell._oDoable, null, "The doable config was set to null.");

        // Cleanup
        this.oRm.destroy();
        this.oRm = null;
    });

    QUnit.module("shell.ShellLayout with Fiori 2.0 ON", {
        beforeEach: function () {
            jQuery("<div id=\"canvas\"></div>").appendTo("body");
            var oShellSplitContainer;


            oShellHeader = new ShellHeader({
                id: "shell-header",
                headItems: [new ShellHeadItem("_itm")],
                headEndItems: [new ShellHeadItem("_end_itm")],
                search: new my.Test("search")
            });

            oShellSplitContainer = new SplitContainer({
                id: "shell-split",
                secondaryContent: [new my.Test("_pane_ctnt")],
                content: [new my.Test("_ctnt")],
                subHeader: [new my.Test("_subheader_ctnt")]
            });

            oShell = new ShellLayout({
                id: "shell",
                header: oShellHeader,
                canvasSplitContainer: oShellSplitContainer
            });

            oShell.placeAt("canvas");
            oShellHeader.setShellLayout(oShell);
            oShellHeader.createUIArea();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            oShell.destroy();
            oShellHeader.destroy();
            jQuery("#canvas").remove();
        }
    });

    QUnit.test("Test ShellLayout and ShellHeader - Fiori 2.0 is ON", function (assert) {
        assert.expect(4);
        var done1 = assert.async();

        oShell.assertFunction = function () {
            var oShellDomRef = this.getDomRef();
            assert.ok(!oShellDomRef.querySelector(".sapUshellShellBrand"), "Brand line should not be added to shell on Firoi 2.0");
            assert.ok(!oShellDomRef.querySelector(".sapUiGlobalBackgroundColorForce"), "Background Color Force should not be added to shell on Fiori 2.0");
            assert.ok(!oShellDomRef.querySelector(".sapUiShellBackground"), "Global Background Color should not be added to shell on Fiori 2.0");
            assert.ok(!oShellDomRef.querySelector(".sapUshellShellAnim"), "Animation should not be added to shell on Fiori 2.0");
            done1();
        };

        oShell.addEventDelegate({onAfterRendering: oShell.assertFunction.bind(oShell)});
    });

});
