// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/MessageToast",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel"
], function (
    jQuery,
    MessageToast,
    resources,
    Device,
    Context,
    JSONModel
) {
    "use strict";

    sap.ui.controller("sap.ushell.components.appfinder.GroupListPopover", {
        onInit: function () {
            var oView = this.getView();

            this.oPopoverModel = new JSONModel({
                userGroupList: oView.getViewData().groupData
            });

            this.oPopoverModel.setSizeLimit(9999);
            oView.oPopover.setModel(this.oPopoverModel);
        },

        onExit: function () {
            var oView = this.getView();

            // Manually destroy controls which might at some point be orphaned
            if (oView._oListContainer) {
                oView._oListContainer.destroy();
            }

            if (oView._oNewGroupItem) {
                oView._oNewGroupItem.destroy();
            }

            if (oView._oNewGroupNameInput) {
                oView._oNewGroupNameInput.destroy();
            }

            if (oView._oNewGroupHeader) {
                oView._oNewGroupHeader.destroy();
            }
        },

        onGroupListSelectionChange: function (oEvent) {
            var oList = oEvent.getSource();

            if (oList.getMode() === "SingleSelectMaster") {
                var oListItem = oEvent.getParameter("listItem");

                if (oListItem.data("newGroupItem")) {
                    this._navigateToCreateNewGroupPane();
                } else {
                    this.okButtonHandler(oEvent);
                }
            } else {
                this.checkboxClickHandler(oEvent);
            }
        },

        okButtonHandler: function (oEvent) {
            oEvent.preventDefault();
            oEvent._bIsStopHandlers = true;

            var oView = this.getView();
            var aUserGroups = this.oPopoverModel.getProperty("/userGroupList");
            var oChanges = {
                addToGroups: [],
                removeFromGroups: [],
                newGroups: [],
                allGroups: aUserGroups
            };

            aUserGroups.forEach(function (group) {
                if (group.selected === group.initiallySelected) {
                    return;
                }
                if (group.selected) {
                    oChanges.addToGroups.push(group.oGroup);
                } else {
                    oChanges.removeFromGroups.push(group.oGroup);
                }
            });

            if (oView.newGroupInput && oView.newGroupInput.getValue().length) {
                oChanges.newGroups.push(oView.newGroupInput.getValue());
            }

            oView.oPopover.close();
            oView.deferred.resolve(oChanges);
        },

        _closeButtonHandler: function (oEvent) {
            oEvent._bIsStopHandlers = true;

            var oView = this.getView();

            oView.oPopover.close();
            oView.deferred.reject();
        },

        _createGroupAndSaveTile: function (oTileContext, newGroupName) {
            var oCatalogsManager = sap.ushell.components.getCatalogsManager();
            var oDeferred = jQuery.Deferred();
            var oPromise = oCatalogsManager.createGroupAndSaveTile({
                catalogTileContext: oTileContext,
                newGroupName: newGroupName
            });

            oPromise.done(function (data) {
                oDeferred.resolve(data);
            });

            return oDeferred;
        },

        /**
         * On clicking an item in the group list (displayListItem):
         *   1. Check if the relevant tile was added or removed to/from the associated group
         *   2. Call the actual add/remove functionality
         *
         * @param {sap.ui.base.Event} oEvent THe SAPUI5 event object.
         */
        groupListItemClickHandler: function (oEvent) {
            var oListItem = oEvent.getParameter("listItem");
            if (oListItem.data("newGroupItem")) {
                this._navigateToCreateNewGroupPane();
                return;
            }

            oListItem.setSelected(!oListItem.getSelected());
            var sItemModelPath = oListItem.getBindingContextPath();
            var oPopoverModel = oListItem.getModel();
            var bSelected = !!oListItem.getSelected();
            this.addRemoveTileFromGroup(sItemModelPath, oPopoverModel, bSelected);
        },

        getGroupsBeforeChanges: function (sPath) {
            var oModel = this.getView().getViewData().sourceContext.oModel;
            return oModel.getProperty(sPath + "/associatedGroups");
        },

        getGroupsAfterChanges: function (/*sPath*/) {
            var oGroupsPopover = sap.ui.getCore().byId("groupsPopover");
            return oGroupsPopover.getModel().getProperty("/userGroupList");
        },

        /**
         * Handler for checking/unchecking group item in the tile groups popover.
         *   - If the group is locked - ignore it
         *
         * @param {sap.ui.base.Event} oEvent THe SAPUI5 event object.
         */
        checkboxClickHandler: function (oEvent) {
            var oView = this.getView();
            var sPath = oView.getViewData().sourceContext.sPath;
            var aGroupsBeforeChanges = this.getGroupsBeforeChanges(sPath);
            var aGroupsAfterChanges = this.getGroupsAfterChanges();
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
            var oPopoverModel = oEvent.getSource().getModel();
            var bSelected = oEvent.getParameter("selected");
            var indexBefore = 0;
            var i = 0;
            var done = false;
            var sGroupModelPath;

            while (oLaunchPageService.isGroupLocked(aGroupsAfterChanges[i].oGroup.object) === true) {
                i++;
            }

            for (i; i < aGroupsAfterChanges.length; i++) {
                var existsBefore = false;

                if (done === true) {
                    break;
                }

                for (indexBefore = 0; indexBefore < aGroupsBeforeChanges.length; indexBefore++) {
                    if (oLaunchPageService.getGroupId(aGroupsAfterChanges[i].oGroup.object) === aGroupsBeforeChanges[indexBefore]) {
                        existsBefore = true;
                        // check if there is a need to remove tile
                        if (aGroupsAfterChanges[i].selected === false) {
                            done = true;
                            sGroupModelPath = ("/userGroupList/" + i);
                            this.addRemoveTileFromGroup(sGroupModelPath, oPopoverModel, bSelected);
                            break;
                        }
                    }
                }

                // Uncheck
                if (aGroupsAfterChanges[i].selected === true && existsBefore === false) {
                    sGroupModelPath = ("/userGroupList/" + i);
                    this.addRemoveTileFromGroup(sGroupModelPath, oPopoverModel, bSelected);
                    break;
                }
            }
        },

        /**
         * Add/remove a tile to/from a group
         * The adding/removing action is done by calls to catalogController.
         * The array associatedGroups in the tile's model is updated accordingly
         */
        addRemoveTileFromGroup: function (sItemModelPath, oPopoverModel, bToAdd) {
            var oView = this.getView();
            var catalogController = this.getView().getViewData().catalogController;
            var catalogModel = this.getView().getViewData().catalogModel;
            var oTileContext = this.getView().getViewData().sourceContext;
            var groupList = catalogModel.getProperty("/groups");
            var index = groupList.indexOf(oPopoverModel.getProperty(sItemModelPath).oGroup);
            var oGroupContext = new Context(catalogModel, "/groups/" + index);
            var launchPageService = sap.ushell.Container.getService("LaunchPage");
            var sGroupId = launchPageService.getGroupId(catalogModel.getProperty("/groups/" + index).object);

            // The tile is added to the group
            if (bToAdd) {
                var oAddPromise = catalogController._addTile(oTileContext, oGroupContext);

                oAddPromise.done(function (data) {
                    var catalogTilePath = oView.getViewData().sourceContext;
                    var aCurrentTileGroups = catalogModel.getProperty(catalogTilePath + "/associatedGroups");

                    aCurrentTileGroups.push(sGroupId);
                    catalogModel.setProperty(catalogTilePath + "/associatedGroups", aCurrentTileGroups);
                });
            } else { // The tile is removed from the group
                var sTileCatalogId = oTileContext.getModel().getProperty(oTileContext.getPath()).id;
                var oRemovePromise = catalogController._removeTile(sTileCatalogId, index);

                oRemovePromise.done(function (data) {
                    var catalogTilePath = oView.getViewData().sourceContext;
                    var aCurrentTileGroups = catalogModel.getProperty(catalogTilePath + "/associatedGroups");
                    var indexToRemove = aCurrentTileGroups ? Array.prototype.indexOf.call(aCurrentTileGroups, sGroupId) : -1;

                    if (indexToRemove >= 0) {
                        aCurrentTileGroups.splice(indexToRemove, 1);
                    }
                    catalogModel.setProperty(catalogTilePath + "/associatedGroups", aCurrentTileGroups);
                });
            }
        },

        _switchGroupsPopoverButtonPress: function () {
            var groupsPopoverId = "groupsPopover-popover";
            if (Device.system.phone) {
                // a different popover is used for phones
                groupsPopoverId = "groupsPopover-dialog";
            }

            var oView = this.getView();
            if (sap.ui.getCore().byId(groupsPopoverId).getContent()[0] === oView._getNewGroupInput()) {
                var aUserGroups = this.oPopoverModel.getProperty("/userGroupList");
                var oChanges = {
                    addToGroups: [],
                    removeFromGroups: [],
                    newGroups: [],
                    allGroups: aUserGroups
                };

                var oNewGroupInput = oView._getNewGroupInput();
                var sNewGroupName = oNewGroupInput.getValue();
                if (sNewGroupName.length > 0) {
                    oChanges.newGroups.push(sNewGroupName);
                }

                oView.oPopover.close();
                oView.deferred.resolve(oChanges);
            } else {
                this._closeButtonHandler(this);
            }
        },

        _navigateToCreateNewGroupPane: function () {
            var oView = this.getView();

            var oNewGroupHeader = oView._getNewGroupHeader();
            var oNewGroupInput = oView._getNewGroupInput();

            oView.oPopover.removeAllContent();
            oView.oPopover.addContent(oNewGroupInput);
            oView.oPopover.setCustomHeader(oNewGroupHeader);
            oView.oPopover.setContentHeight("");

            setTimeout(function () {
                oView.oPopover.getBeginButton().setText(resources.i18n.getText("okDialogBtn"));
            }, 0);

            if (oView.oPopover.getEndButton()) {
                oView.oPopover.getEndButton().setVisible(true);
            }

            if (sap.ui.getCore().byId("groupsPopover-popover")
                && (sap.ui.getCore().byId("groupsPopover-popover").getContent()[0] === oView._getNewGroupInput())
                && !oView.oPopover.getEndButton()) {
                oView.oPopover.setEndButton(oView._getCancelButton());
            }

            setTimeout(function () {
                oView.oPopover.getEndButton().setText(resources.i18n.getText("cancelBtn"));
            }, 0);

            if (oView.getViewData().singleGroupSelection) {
                this._setFooterVisibility(true);
            }

            setTimeout(function () {
                oNewGroupInput.focus();
            }, 0);
        },

        setSelectedStart: function (start) {
            this.start = start;
        },

        _afterCloseHandler: function () {
            var oView = this.getView();
            var oCatalogModel = this.getView().getViewData().catalogModel;

            // catalog view is active. Not needed in user menu and SAP menu
            if (oCatalogModel) {
                var aGroups = oCatalogModel.getProperty(this.getView().getViewData().sourceContext + "/associatedGroups");
                this.showToastMessage(aGroups, this.start);
            }

            oView.destroy();
        },

        showToastMessage: function (end, start) {
            var added = 0;
            var removed = 0;
            var firstAddedGroupTitle,
                firstRemovedGroupTitle;
            var endSelected = {};

            end.forEach(function (oGroup) {
                endSelected[oGroup] = oGroup; // performance improve
            });
            start.forEach(function (sGroup) {
                if (endSelected[sGroup.id]) {
                    if (sGroup.selected === false) {
                        added++;
                        firstAddedGroupTitle = sGroup.title;
                    }
                } else if (sGroup.selected === true) {
                    removed++;
                    firstRemovedGroupTitle = sGroup.title;
                }
            });

            var message = this.getView().getViewData().catalogController.prepareDetailedMessage(this.getView().getViewData().title, added, removed, firstAddedGroupTitle, firstRemovedGroupTitle);
            if (message) {
                MessageToast.show(message, {
                    duration: 6000, // default
                    width: "15em",
                    my: "center bottom",
                    at: "center bottom",
                    of: window,
                    offset: "0 -50",
                    collision: "fit fit"
                });
            }
        },

        _backButtonHandler: function () {
            var oView = this.getView();
            oView.oPopover.removeAllContent();
            if (oView.getViewData().singleGroupSelection) {
                this._setFooterVisibility(false);
            }

            if (!Device.system.phone) {
                oView.oPopover.setContentHeight("192px");
            } else {
                oView.oPopover.setContentHeight("100%");
            }

            oView.oPopover.setVerticalScrolling(true);
            oView.oPopover.setHorizontalScrolling(false);
            oView.oPopover.addContent(oView._getListContainer());
            oView.oPopover.setTitle(resources.i18n.getText("addTileToGroups_popoverTitle"));
            oView.oPopover.setCustomHeader();
            oView._getNewGroupInput().setValue("");

            if (oView.oPopover.getContent()[0] !== oView._getNewGroupInput()) {
                oView.oPopover.getEndButton().setVisible(false);
            }
            setTimeout(function () {
                oView.oPopover.getBeginButton().setText(resources.i18n.getText("close"));
            }, 0);
        },

        _setFooterVisibility: function (bVisible) {
            // as there is not public API to control the footer we get the control by its id and set its visibility
            var oFooter = sap.ui.getCore().byId("groupsPopover-footer");
            if (oFooter) {
                oFooter.setVisible(bVisible);
            }
        }
    });
});
