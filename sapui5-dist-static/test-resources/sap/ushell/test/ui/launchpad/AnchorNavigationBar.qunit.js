// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit QUnit.tests for sap.ushell.ui.launchpad.AnchorNavigationBar
 */
sap.ui.require([
    "sap/ushell/ui/launchpad/AnchorItem",
    "sap/ushell/override",
    "sap/ushell/resources"
], function (
    AnchorItem,
    override,
    resources
) {
    "use strict";
    /*global QUnit, sinon */

    var anchorItemTemplate = new sap.ushell.ui.launchpad.AnchorItem({
            index: "{index}",
            title: "{title}",
            groupId: "{groupId}",
            selected: false,
            visible: true
        }),
        anchorNavigationBar,
        testContainer,
        mockData,
        demiData;

    QUnit.module("sap.ushell.ui.launchpad.AnchorNavigationBar", {
        beforeEach: function () {
            mockData = {
                groups: [
                    {
                        id: "group_0",
                        groupId: "group_0",
                        title: "group_0",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_00",
                                content: []
                            },
                            {
                                id: "tile_01",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_1",
                        groupId: "group_1",
                        title: "group_1",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_2",
                        groupId: "group_2",
                        title: "group_2",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_3",
                        groupId: "group_3",
                        title: "group_3",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_4",
                        groupId: "group_4",
                        title: "group_4",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_5",
                        groupId: "group_5",
                        title: "group_5",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_6",
                        groupId: "group_6",
                        title: "group_6",
                        isGroupVisible: true,
                        tiles: [
                            {
                                id: "tile_02",
                                content: []
                            },
                            {
                                id: "tile_03",
                                content: []
                            }
                        ]
                    }
                ]
            };
            demiData = {
                itemPress: [ function (oEvent) {
                }],
                groups: {
                    path: "/groups",
                    template: anchorItemTemplate
                }};
            anchorNavigationBar = new sap.ushell.ui.launchpad.AnchorNavigationBar(demiData);
            anchorNavigationBar.setModel(new sap.ui.model.json.JSONModel(mockData));
            testContainer = jQuery("<div id=\"testContainer\" style=\"display: none;\">").appendTo("body");
            anchorNavigationBar.placeAt(testContainer);

        },
        /**
         * This method is called after each QUnit.test. Add every restoration code here.
         */
        afterEach: function () {
            if (anchorNavigationBar.oPopover) {
                anchorNavigationBar.oPopover.destroy();
                anchorNavigationBar.oOverflowButton.destroy();
            }
            anchorNavigationBar.destroy();
            jQuery(testContainer).remove();
        }
    });

    QUnit.test("Constructor QUnit.test", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            assert.ok(anchorNavigationBar !== null, "anchor navigation bar was created successfully");
            assert.equal(anchorNavigationBar.getGroups().length, 7, "7 groups expected");

            var bSapUshellAnchorNavigationBarClassAdded = testContainer.find(".sapUshellAnchorNavigationBar").length > 0;
            assert.ok(bSapUshellAnchorNavigationBarClassAdded, "anchor navigation bar was added to the DOM");
            done();
        }, 0);
    });

    QUnit.test("Test setSelectedItemIndex", function (assert) {
        anchorNavigationBar.setSelectedItemIndex(undefined);
        assert.ok(anchorNavigationBar.getSelectedItemIndex() === 0, "selected group should remain 0");
        anchorNavigationBar.setSelectedItemIndex(1);
        assert.ok(anchorNavigationBar.getSelectedItemIndex() === 1, "selected group should be 1");
    });

    QUnit.test("Test reArrangeNavigationBarElements", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var stubAdjustItemSelection = sinon.stub(anchorNavigationBar, "adjustItemSelection");
            anchorNavigationBar.setSelectedItemIndex(1);
            anchorNavigationBar.reArrangeNavigationBarElements();

            assert.ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selected item was changed");
            assert.ok(stubAdjustItemSelection.args[0][0] === 1, "selected item is item #1");

            stubAdjustItemSelection.restore();
            done();
        }, 0);
    });

    QUnit.test("Test reArrangeNavigationBarElements in mobile", function (assert) {
        var done = assert.async();
        
        setTimeout(function () {
            var stubAdjustItemSelection = sinon.stub(anchorNavigationBar, "adjustItemSelection");
            var bPhone = sap.ui.Device.system.phone;
            sap.ui.Device.system.phone = true;

            anchorNavigationBar.setSelectedItemIndex(1);
            anchorNavigationBar.reArrangeNavigationBarElements();

            assert.ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selectd item was changed");
            assert.ok(stubAdjustItemSelection.args[0][0] === 1, "selected item is item #1");
            assert.ok(anchorNavigationBar.anchorItems[0].getIsGroupVisible() === false, "first group should be hidden");
            assert.ok(anchorNavigationBar.anchorItems[1].getIsGroupVisible() === true, "second group should be visible");

            stubAdjustItemSelection.restore();
            sap.ui.Device.system.phone = bPhone;

            done();
        }, 0);
    });

    QUnit.test("Test setNavigationBarItemsVisibility", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var stubIsLastAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostRightAnchorItemVisible").returns(true),
                stubIsFirstAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true),
                oOverflowButton = anchorNavigationBar.oOverflowButton,
                bPhone = sap.ui.Device.system.phone;

            anchorNavigationBar.setNavigationBarItemsVisibility();
            assert.ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") > -1, "overflow button should be hidden");

            sap.ui.Device.system.phone = true;
            anchorNavigationBar.setNavigationBarItemsVisibility();
            assert.ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");

            sap.ui.Device.system.phone = false;
            stubIsLastAnchorItemVisible.returns(false);
            anchorNavigationBar.setNavigationBarItemsVisibility();
            assert.ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");

            stubIsLastAnchorItemVisible.returns(true);
            stubIsFirstAnchorItemVisible.returns(false);
            anchorNavigationBar.setNavigationBarItemsVisibility();
            assert.ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") === -1, "overflow button should be visible");

            stubIsLastAnchorItemVisible.restore();
            stubIsFirstAnchorItemVisible.restore();
            sap.ui.Device.system.phone = bPhone;
            done();
        }, 0);
    });

    QUnit.test("Test setNavigationBarItemsVisibility - phone - no groups in dashboard", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var stubIsLastAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostRightAnchorItemVisible").returns(true),
                stubIsFirstAnchorItemVisible = sinon.stub(anchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true),
                oOverflowButton = anchorNavigationBar.oOverflowButton,
                bPhone = sap.ui.Device.system.phone,
                anchorItems = anchorNavigationBar.anchorItems;

            sap.ui.Device.system.phone = true;
            anchorNavigationBar.anchorItems = [];
            anchorNavigationBar.setNavigationBarItemsVisibility();
            assert.ok(oOverflowButton.getDomRef().className.indexOf("sapUshellShellHidden") > -1, "overflow button should be hidden");

            stubIsLastAnchorItemVisible.restore();
            stubIsFirstAnchorItemVisible.restore();
            anchorNavigationBar.anchorItems = anchorItems;
            sap.ui.Device.system.phone = bPhone;
            done();
        }, 0);
    });

    QUnit.test("Test selected anchor navigation item", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            anchorNavigationBar.adjustItemSelection(1);
            setTimeout(function () {
                assert.ok(anchorNavigationBar.anchorItems[0].getSelected() === false, "first item is selected");
                assert.ok(anchorNavigationBar.anchorItems[1].getSelected() === true, "first item is selected");
                done();
            }, 250);
        }, 0);
    });

    QUnit.test("Test get visible groups", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var aGroups = anchorNavigationBar.getVisibleGroups();
            assert.ok(aGroups.length === 7, "there are two visible groups");

            var group = aGroups[1];
            group.setVisible(false);
            aGroups = anchorNavigationBar.getVisibleGroups();
            assert.ok(aGroups.length === 6, "there is only one visible group");
            done();
        }, 0);
    });

    QUnit.test("Test isMostRightAnchorItemVisible", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            jQuery("#testContainer").css("display", "block");
            jQuery("#testContainer").width(500);
            var bIsLastGroupVisible = anchorNavigationBar.isMostRightAnchorItemVisible();
            assert.ok(!bIsLastGroupVisible, "last group is not visible");

            var groups = anchorNavigationBar.getGroups();
            // leave only two groups
            groups = groups.splice(5);
            anchorNavigationBar.getModel().setProperty("/groups", groups);
            // wait for rerender
            setTimeout(function () {
                bIsLastGroupVisible = anchorNavigationBar.isMostRightAnchorItemVisible();
                assert.ok(bIsLastGroupVisible, "last group is visible");
                jQuery("#testContainer").css("display", "none");
                done();
            }, 0);
        }, 0);
    });

    QUnit.test("Test isMostLeftAnchorItemVisible", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            jQuery("#testContainer").css("display", "block");

            var bIsFirstGroupVisible = anchorNavigationBar.isMostLeftAnchorItemVisible();
            assert.ok(bIsFirstGroupVisible, "first group is visible");
            done();
        }, 0);
    });

    QUnit.test("Test get overflow right and left arrows", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var oLeftButton = anchorNavigationBar._getOverflowLeftArrowButton(),
                oRightButton = anchorNavigationBar._getOverflowRightArrowButton();

            assert.ok(oLeftButton.getMetadata().getName() === "sap.m.Button", "left button type is correct");
            assert.ok(oLeftButton.getIcon() === "sap-icon://slim-arrow-left", "left button src is correct");

            assert.ok(oRightButton.getMetadata().getName() === "sap.m.Button", "right button type is correct");
            assert.ok(oRightButton.getIcon() === "sap-icon://slim-arrow-right", "right button src is correct");
            done();
        }, 0);
    });

    QUnit.test("Test get overflow button", function (assert) {
        var done = assert.async();

        setTimeout(function () {
            var oOverflowButton = anchorNavigationBar._getOverflowButton();

            assert.ok(oOverflowButton.getMetadata().getName() === "sap.m.Button", "overfolw button type is correct");
            assert.ok(oOverflowButton.getIcon() === "sap-icon://slim-arrow-down", "overfolw button src is correct");
            done();
        }, 0);
    });
    QUnit.test("Test handleExit method", function (assert) {
        anchorNavigationBar.handleExit();
        assert.ok(anchorNavigationBar.oPopover === undefined);
        assert.ok(anchorNavigationBar.oOverflowButton === undefined);
    });

    QUnit.module("AnchorNavigationBar rendering", {
        beforeEach: function () {
            this.oAnchorNavigationBar = new sap.ushell.ui.launchpad.AnchorNavigationBar();
        },

        afterEach: function () {
            this.oAnchorNavigationBar.destroy();
        }
    });

    QUnit.test("Only the minimal DOM is rendered in the case of no groups", function (assert) {
        sinon.stub(this.oAnchorNavigationBar, "getGroups").returns([]);

        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        assert.ok(this.oAnchorNavigationBar.$().hasClass("sapUshellAnchorNavigationBar"), "The outer class exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorNavigationBarInner").length !== 0, "The inner class exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorLeftOverFlowButton").length === 0, "The content class does not exist.");
    });

    QUnit.test("The complete DOM is rendered when there is at least one group", function (assert) {
        var oRenderNavigationItemsStub;

        sinon.stub(this.oAnchorNavigationBar, "getGroups").returns([{}]);
        sinon.stub(this.oAnchorNavigationBar, "onAfterRendering");
        oRenderNavigationItemsStub = sinon.stub(this.oAnchorNavigationBar.getRenderer(), "renderAnchorNavigationItems");

        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorLeftOverFlowButton").length !== 0, "The class sapUshellAnchorLeftOverFlowButton exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorNavigationBarItems").length !== 0, "The class sapUshellAnchorNavigationBarItems exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorNavigationBarItemsScroll").length !== 0, "The class sapUshellAnchorNavigationBarItemsScroll exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorRightOverFlowButton").length !== 0, "The class sapUshellAnchorRightOverFlowButton exists.");
        assert.ok(this.oAnchorNavigationBar.$().find(".sapUshellAnchorItemOverFlow").length !== 0, "The class sapUshellAnchorItemOverFlow exists.");
        assert.ok(oRenderNavigationItemsStub.called, "The function to create the navigation items is called.");
    });

    QUnit.test("onAfterRendering does not the finishing work if the control is not rendered completely", function (assert) {
        // Arrange
        var fnReArrangeNavigationBarStub = sinon.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements");

        // Act
        this.oAnchorNavigationBar.onAfterRendering();

        // Assert
        assert.strictEqual(fnReArrangeNavigationBarStub.callCount, 0,
            "The rearrangement of the navigation bar elements odes not take place.");

        fnReArrangeNavigationBarStub.restore();
    });

    QUnit.test("onAfterRendering does the finishing work if the control is rendered completely", function (assert) {
        // Arrange
        this.oAnchorNavigationBar._setRenderedCompletely(true);
        var fnReArrangeNavigationBarStub = sinon.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements"),
            fnDomRefStub = sinon.stub(this.oAnchorNavigationBar, "getDomRef").returns({
                getElementsByTagName: sinon.stub().returns([])
            });

        // Act
        this.oAnchorNavigationBar.onAfterRendering();

        // Assert
        assert.strictEqual(fnReArrangeNavigationBarStub.callCount, 1,
            "The rearrangement of the navigation bar elements takes place.");

        fnReArrangeNavigationBarStub.restore();
        fnDomRefStub.restore();
    });

    QUnit.test("after rendering, the overflow buttons have no tabindices", function (assert) {
        // Arrange
        var fnIsMostLeftAnchorItemVisibleStub = sinon.stub(this.oAnchorNavigationBar, "isMostLeftAnchorItemVisible").returns(false),
            fnIsMostRightAnchorItemVisibleStub = sinon.stub(this.oAnchorNavigationBar, "isMostRightAnchorItemVisible").returns(false);

        this.oAnchorNavigationBar.addGroup(new sap.ushell.ui.launchpad.AnchorItem());

        // Act
        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oAnchorNavigationBar.oOverflowButton.getDomRef().getAttribute("tabindex"), "-1",
            "Tabindex of the overflow button was removed.");
        assert.strictEqual(this.oAnchorNavigationBar.oOverflowLeftButton.getDomRef().getAttribute("tabindex"), "-1",
            "Tabindex of the left overflow button was removed.");
        assert.strictEqual(this.oAnchorNavigationBar.oOverflowRightButton.getDomRef().getAttribute("tabindex"), "-1",
            "Tabindex of the right overflow button was removed.");

        fnIsMostLeftAnchorItemVisibleStub.restore();
        fnIsMostRightAnchorItemVisibleStub.restore();
    });
});
