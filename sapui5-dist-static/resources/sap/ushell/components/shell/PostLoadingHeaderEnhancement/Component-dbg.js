// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/Component",
    "sap/ui/core/CustomData",
    "sap/ui/core/IconPool",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/renderers/fiori2/AccessKeysHandler",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (Device, Component, CustomData, IconPool, Config, EventHub, ushellLibrary, resources, AccessKeysHandler, AccessibilityCustomData, ShellHeadItem) {
    "use strict";

     // shortcut for sap.ushell.ui.shell.ShellHeadItem.prototype.FloatingNumberType
     var FloatingNumberType = ShellHeadItem.prototype.FloatingNumberType;

     // shortcut for sap.ushell.AppTitleState
    var AppTitleState = ushellLibrary.AppTitleState;

    var aCreatedControlIds = [];


    return Component.extend("sap.ushell.components.shell.PostLoadingHeaderEnhancement.Component", {
        metadata: {
            library: "sap.ushell"
        },
        init: function () {
            var oShellConfig = sap.ushell.Container.getRenderer("fiori2").getShellConfig();

            aCreatedControlIds.push(this._createHomeButton(oShellConfig));
            aCreatedControlIds.push(this._createBackButton());
            aCreatedControlIds.push(this._createOverflowButton());

            if (oShellConfig.moveAppFinderActionToShellHeader && Config.last("/core/catalog/enabled") && !oShellConfig.disableAppFinder) {
                aCreatedControlIds.push(this._createAppFinderButton());
            }

            if (oShellConfig.moveContactSupportActionToShellHeader) {
                this._createSupportButton().then(function (sBtnId) {
                    aCreatedControlIds.push(sBtnId);
                });
            }

            if (oShellConfig.moveGiveFeedbackActionToShellHeader) {
                this._createFeedbackButton().then(function (sBtnId) {
                    aCreatedControlIds.push(sBtnId);
                });
            }

            this._createShellNavigationMenu(oShellConfig);

            var oShellHeader = sap.ui.getCore().byId("shell-header");
            oShellHeader.updateAggregation("headItems");
            oShellHeader.updateAggregation("headEndItems");
        },

        _createHomeButton: function (oShellConfig) {
            var oHomeButton = new ShellHeadItem({
                id: "homeBtn",
                tooltip: resources.i18n.getText("homeBtn_tooltip"),
                ariaLabel: resources.i18n.getText("homeBtn_tooltip"),
                icon: IconPool.getIconURI("home"),
                target: oShellConfig.rootIntent ? "#" + oShellConfig.rootIntent : "#"
            });

            if (Config.last("/core/extension/enableHelp")) {
                oHomeButton.addStyleClass("help-id-homeBtn", true); // xRay help ID
            }

            oHomeButton.addCustomData(new AccessibilityCustomData({
                key: "aria-disabled",
                value: "false",
                writeToDom: true
            }));
            if (Device.system.desktop) {
                oHomeButton.addEventDelegate({
                    onsapskipback: function (oEvent) {
                        if (AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            AccessKeysHandler.bFocusOnShell = false;
                        }
                    },
                    onsapskipforward: function (oEvent) {
                        if (AccessKeysHandler.getAppKeysHandler()) {
                            oEvent.preventDefault();
                            AccessKeysHandler.bFocusOnShell = false;
                        }
                    }
                });
            }
            return oHomeButton.getId();
        },

        _createBackButton: function () {
            var sBackButtonIcon = sap.ui.getCore().getConfiguration().getRTL() ? "feeder-arrow" : "nav-back";
            var oBackButton = new ShellHeadItem({
                id: "backBtn",
                tooltip: resources.i18n.getText("backBtn_tooltip"),
                ariaLabel: resources.i18n.getText("backBtn_tooltip"),
                icon: IconPool.getIconURI(sBackButtonIcon),
                press: function () {
                    EventHub.emit("navigateBack", Date.now());
                }
            });
            return oBackButton.getId();
        },

        _createOverflowButton: function () {
            var oShellModel = sap.ushell.Container.getRenderer("fiori2").getShellController().getModel();
            var oEndItemsOverflowBtn = new ShellHeadItem({
                id: "endItemsOverflowBtn",
                tooltip: {
                    path: "/notificationsCount",
                    formatter: function (notificationsCount) {
                        return this.tooltipFormatter(notificationsCount);
                    }
                },
                ariaLabel: resources.i18n.getText("shellHeaderOverflowBtn_tooltip"),
                ariaHaspopup: "dialog",
                icon: "sap-icon://overflow",
                floatingNumber: "{/notificationsCount}",
                floatingNumberType: FloatingNumberType.OverflowButton,
                press: function (oEvent) {
                    EventHub.emit("showEndItemOverflow", oEvent.getSource().getId(), true);
                }
            });
            oEndItemsOverflowBtn.setModel(oShellModel);
            return oEndItemsOverflowBtn.getId();
        },

        _createAppFinderButton: function () {
            var oOpenCatalogButton = new ShellHeadItem({
                id: "openCatalogBtn",
                text: resources.i18n.getText("open_appFinderBtn"),
                tooltip: resources.i18n.getText("open_appFinderBtn"),
                icon: "sap-icon://sys-find",
                target: "#Shell-appfinder"
            });
            if (Config.last("/core/extension/enableHelp")) {
                oOpenCatalogButton.addStyleClass("help-id-openCatalogActionItem"); // xRay help ID
            }
            return oOpenCatalogButton.getId();
        },

        _createSupportButton: function () {
            return new Promise(function (fnResolve) {
                sap.ui.require(["sap/ushell/ui/footerbar/ContactSupportButton"], function (ContactSupportButton) {
                    var sButtonName = "ContactSupportBtn",
                    oSupportButton = sap.ui.getCore().byId(sButtonName);
                    if (!oSupportButton) {
                        // Create an ActionItem from MeArea (ContactSupportButton)
                        // in order to to take its text and icon
                        // and fire the press method when the shell header item is pressed,
                        // but don't render this control
                        var oTempButton = new ContactSupportButton("tempContactSupportBtn", {
                            visible: true
                        });

                        var sIcon = oTempButton.getIcon();
                        var sText = oTempButton.getText();
                        oSupportButton = new ShellHeadItem({
                            id: sButtonName,
                            icon: sIcon,
                            tooltip: sText,
                            text: sText,
                            ariaHaspopup: "dialog",
                            press: function () {
                                oTempButton.firePress();
                            }
                        });
                    }
                    fnResolve(sButtonName);
                });
            });
        },

         _createFeedbackButton: function () {
            var sButtonName = "EndUserFeedbackBtn",
                oFeedbackButton = sap.ui.getCore().byId(sButtonName);

            return new Promise(function (fnResolve) {
                if (oFeedbackButton) {
                    fnResolve(oFeedbackButton.getId());
                    return;
                }
                sap.ui.require(["sap/ushell/ui/footerbar/EndUserFeedback"], function (EndUserFeedback) {
                    // Create an ActionItem from MeArea (EndUserFeedback)
                    // in order to take its text and icon
                    // and fire the press method when the shell header item is pressed,
                    // but don't render this control
                    var oTempButton = new EndUserFeedback("EndUserFeedbackHandlerBtn", {});
                    var sIcon = oTempButton.getIcon();
                    var sText = oTempButton.getText();
                    oFeedbackButton = new ShellHeadItem({
                        id: sButtonName,
                        icon: sIcon,
                        tooltip: sText,
                        ariaLabel: sText,
                        ariaHaspopup: "dialog",
                        text: sText,
                        visible: false // will be set to visible in case an adapter is implemented - done in mearea.controller._setupEndUserFeedbackButton
                    });

                    fnResolve(oFeedbackButton.getId());
                });
            });
        },

         _createShellNavigationMenu: function (oShellConfig) {
            sap.ui.require([
                "sap/m/StandardListItem",
                "sap/ushell/ui/shell/NavigationMiniTile",
                "sap/ushell/ui/shell/ShellNavigationMenu"
            ], function (StandardListItem, NavigationMiniTile, ShellNavigationMenu) {
                var sMenuId = "shellNavigationMenu";

                var oHierarchyTemplateFunction = function (sId, oContext) {
                    var sIcon = oContext.getProperty("icon") || "sap-icon://circle-task-2",
                        sTitle = oContext.getProperty("title"),
                        sSubtitle = oContext.getProperty("subtitle"),
                        sIntent = oContext.getProperty("intent");

                    var oListItem = (new StandardListItem({
                        type: "Active", // Use string literal to avoid dependency from sap.m.library
                        title: sTitle,
                        description: sSubtitle,
                        icon: sIcon,
                        wrapping: true,
                        customData: [new CustomData({
                            key: "intent",
                            value: sIntent
                        })],
                        press: function () {
                            if (sIntent && sIntent[0] === "#") {
                                EventHub.emit("navigateFromShellApplicationNavigationMenu", sIntent, true);
                            }
                        }
                    })).addStyleClass("sapUshellNavigationMenuListItems");

                    return oListItem;
                };

                var oRelatedAppsTemplateFunction = function (sId, oContext) {
                    // default icon behavior
                    var sIcon = oContext.getProperty("icon"),
                        sTitle = oContext.getProperty("title"),
                        sSubtitle = oContext.getProperty("subtitle"),
                        sIntent = oContext.getProperty("intent");
                    return new NavigationMiniTile({
                        title: sTitle,
                        subtitle: sSubtitle,
                        icon: sIcon,
                        intent: sIntent,
                        press: function () {
                            var sTileIntent = this.getIntent();
                            if (sTileIntent && sTileIntent[0] === "#") {
                                EventHub.emit("navigateFromShellApplicationNavigationMenu", sTileIntent, true);
                            }
                        }
                    });
                };

                var oShellNavigationMenu = new ShellNavigationMenu(sMenuId, {
                    title: "{/application/title}",
                    icon: "{/application/icon}",
                    showTitle: "{/application/showNavMenuTitle}",
                    showRelatedApps: oShellConfig.appState !== "lean",
                    items: {
                        path: "/application/hierarchy",
                        factory: oHierarchyTemplateFunction.bind(this)
                    },
                    miniTiles: {
                        path: "/application/relatedApps",
                        factory: oRelatedAppsTemplateFunction.bind(this)
                    },
                    visible: {
                        path: "/ShellAppTitleState",
                        formatter: function (oCurrentState) {
                            return oCurrentState === AppTitleState.ShellNavMenu;
                        }
                    }
                });

                sap.ushell.Container.getRenderer("fiori2").getShellController().handleNavMenuTitleVisibility(Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD));

                var oShellHeader = sap.ui.getCore().byId("shell-header");
                oShellNavigationMenu.setModel(oShellHeader.getModel());

                var oShellAppTitle = sap.ui.getCore().byId("shellAppTitle");
                if (oShellAppTitle) {
                    oShellAppTitle.setNavigationMenu(oShellNavigationMenu);
                }
                aCreatedControlIds.push(sMenuId);
                return sMenuId;
            }.bind(this));
        },

        exit: function () {
            aCreatedControlIds.forEach(function (sControl) {
                var oControl = sap.ui.getCore().byId(sControl);
                if (oControl) {
                    oControl.destroy();
                }
            });
            aCreatedControlIds = [];
        }
    });
});
