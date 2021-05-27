//Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @file PageRuntime controller for PageRuntime view
 * @version 1.88.1
 */
sap.ui.define([
    "sap/ui/core/library",
    "sap/ushell/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/events/KeyCodes",
    "sap/m/GenericTile",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ushell/components/pages/StateManager",
    "sap/ushell/EventHub",
    "sap/ushell/utils",
    "sap/m/Button",
    "sap/base/strings/capitalize",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    coreLibrary,
    ushellLibrary,
    Controller,
    KeyCodes,
    GenericTile,
    resources,
    JSONModel,
    Config,
    mLibrary,
    MessageToast,
    oStateManager,
    EventHub,
    oUtils,
    Button,
    capitalize,
    Filter,
    FilterOperator
) {
    "use strict";

    // shortcut for sap.ui.core.InvisibleMessageMode
    var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

    // shortcut for sap.m.LoadState
    var LoadState = mLibrary.LoadState;

    // shortcut for sap.ushell.DisplayFormatHint
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * Controller of the PagesRuntime view.
     * It is responsible for navigating between different pages and combines the
     * Pages service (@see sap.ushell.services.Pages) with the
     * VisualizationInstantiation service (@see sap.ushell.services.VisualizationInstantiation) to create
     * the content area of the Fiori Launchpad.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameters
     * @class
     * @extends sap.ui.core.mvc.Controller
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.pages.controller.Pages
     */
    return Controller.extend("sap.ushell.components.pages.controller.Pages", /** @lends sap.ushell.components.pages.controller.Pages.prototype */ {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and sets the Pages service
         * model to the view. It also sets a separate model to the view which includes
         * some settings which change the view behavior.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {
            var bPersonalizationEnabled = Config.last("/core/shell/enablePersonalization");

            this._oVisualizationInstantiationServicePromise = sap.ushell.Container.getServiceAsync("VisualizationInstantiation");
            this._oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

            this._oViewSettingsModel = new JSONModel({
                sizeBehavior: Config.last("/core/home/sizeBehavior"),
                actionModeActive: false,
                showHideButton: Config.last("/core/catalog/enableHideGroups"),
                personalizationEnabled: bPersonalizationEnabled,
                showPageTitle: false
            });
            this.getView().setModel(this._oViewSettingsModel, "viewSettings");

            this._aConfigListeners = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                this._oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
            }.bind(this));

            this._oErrorPageModel = new JSONModel({
                icon: "sap-icon://documents",
                text: "",
                description: "",
                details: ""
            });
            this.getView().setModel(this._oErrorPageModel, "errorPage");

            this.oInitFinishedPromise = Promise.all([
                this._oVisualizationInstantiationServicePromise,
                this.getOwnerComponent().getPagesService()
            ]).then(function (aServices) {
                // bind the model only when the vizInstance service is loaded so that it
                // can be used in the factory function synchronously
                this._oVisualizationInstantiationService = aServices[0];
                this.getView().setModel(aServices[1].getModel());
            }.bind(this));

            this.sCurrentTargetPageId = "";
            this._openFLPPage();

            var oRenderer = sap.ushell.Container.getRenderer();
            this.oContainerRouter = oRenderer.getRouter();
            this.oContainerRouter.getRoute("home").attachMatched(this._onPageComponentNavigation, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._onPageComponentNavigation, this);
            this.bIsHomeIntentRootIntent = oUtils.isFlpHomeIntent(oRenderer.getShellConfig().rootIntent);

            this.oErrorPage = this.byId("errorPage");
            this.oPagesNavContainer = this.byId("pagesNavContainer");
            this.oPagesRuntimeNavContainer = this.byId("pagesRuntimeNavContainer");
            // Handles the states(visible/invisible, active/inactive) of the visualizations
            oStateManager.init(this.oPagesRuntimeNavContainer, this.oPagesNavContainer);

            this.oEventHubListener = EventHub.once("PagesRuntimeRendered").do(function () {
                if (bPersonalizationEnabled) {
                    this._createActionModeButton();
                }
                EventHub.emit("firstSegmentCompleteLoaded", true);
            }.bind(this));

            this._oEventBus = sap.ui.getCore().getEventBus();
            this._oEventBus.subscribe("launchpad", "shellFloatingContainerIsDocked", this._handleUshellContainerDocked, this);
            this._oEventBus.subscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleUshellContainerDocked, this);

            this.oVisualizationInstantiationListener = EventHub.on("VizInstanceLoaded").do(function () {
                this._setPerformanceMark();
                //Should be adjusted after next iteration of the VisualizationInstantiation
                if (!this.oVisualizationInstantiationListenerTimeout) {
                    //Currently there is no good place to mark TTI time, because all visualizations
                    //are loaded async and update visualizations views directly through setAggregation.
                    //For this reason, we listen to the loading of the all static and dynamic tiles
                    //and mark the last time. Timeout in 5 sec in order to avoid the cases when
                    //personalization or other interaction  replace the TTI time
                    this.oVisualizationInstantiationListenerTimeout = setTimeout(function () {
                        this.oVisualizationInstantiationListener.off();
                    }.bind(this), 5000);
                }
            }.bind(this));
        },

        _onPageComponentNavigation: function () {
            this._openFLPPage();
            var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
            if (oActionModeButton && !this.bIsHomeIntentRootIntent) {
                var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                if (oRenderer.getShellConfig().moveEditHomePageActionToShellHeader) {
                    oRenderer.showHeaderEndItem(oActionModeButton.getId(), true);
                } else {
                    oRenderer.showActionButton(oActionModeButton.getId(), true);
                }
            }

        },

        /**
         * Used to set performance mark related to the loading of the page runtime
         *
         * @private
         */
        _setPerformanceMark: function () {
            oUtils.setPerformanceMark("FLP-TTI-Homepage", {
                bUseUniqueMark: true,
                bUseLastMark: true
            });
        },

        /**
         * Gets the url parameters and returns the spaceId and pageId of the target page.
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         * @private
         * @since 1.72.0
         */
        _getPageAndSpaceId: function () {
            return this._oURLParsingService.then(function (urlParsingService) {
                var oHash = urlParsingService.parseShellHash(window.hasher.getHash());
                var oIntent = {
                    semanticObject: oHash.semanticObject || "",
                    action: oHash.action || ""
                };
                var oHashPartsParams = oHash.params || {};
                var aPageId = oHashPartsParams.pageId || [];
                var aSpaceId = oHashPartsParams.spaceId || [];


                return this._parsePageAndSpaceId(aPageId, aSpaceId, oIntent);
            }.bind(this));
        },

        /**
         * Parses the given spaceId and pageId. When there are no pageId and spaceId given but the intent is Shell-home,
         * returns the spaceId and pageId of the default page. When there is no pageId and spaceId, only a pageId or a
         * spaceId, or more than one pageId or spaceId given, returns a rejected promise with an error message.
         *
         * @param {array} pageId An array that contains the page id of the page which should be displayed
         * @param {array} spaceId An array that contains the space id of the page which should be displayed
         * @param {object} intent An object that contains the semantic object and action of the page which should be displayed
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         * @private
         * @since 1.72.0
         */
        _parsePageAndSpaceId: function (pageId, spaceId, intent) {
            if (pageId.length < 1 && spaceId.length < 1) {
                if (intent.semanticObject === "Shell" && intent.action === "home") {
                    return this._getUserDefaultPage();
                }
                return Promise.reject(resources.i18n.getText("PageRuntime.NoPageIdAndSpaceIdProvided"));
            }

            if (pageId.length === 1 && spaceId.length === 0) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlyPageIdProvided"));
            }

            if (pageId.length === 0 && spaceId.length === 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlySpaceIdProvided"));
            }

            if (pageId.length > 1 || spaceId.length > 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.MultiplePageOrSpaceIdProvided"));
            }

            if (pageId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidPageId"));
            }

            if (spaceId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidSpaceId"));
            }

            return Promise.resolve({
                pageId: pageId[0],
                spaceId: spaceId[0]
            });
        },

        /**
         * Returns the default page of the current user.
         * For its determination the Menu service is used to access the spaces pages
         * hierarchy: The first page in there is taken as the "default" page.
         *
         * @returns {Promise<object>} Resolves to an object that contains the pageId and spaceId of the page.
         *   Rejects if no space or no page has been assigned to the user, or if there's a problem accessing the spaces pages hierarchy.
         * @private
         * @since 1.72.0
         */
        _getUserDefaultPage: function () {
            return sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getSpacesPagesHierarchy();
                })
                .then(function (oSpacesPagesHierarchy) {

                    // Reject if no space assigned
                    if (oSpacesPagesHierarchy.spaces.length === 0) {
                        return Promise.reject(resources.i18n.getText("PageRuntime.NoAssignedSpace"));
                    }

                    // Find first space that has a page
                    var oSpaceWithPage = oSpacesPagesHierarchy.spaces.find(function (oSpace) {
                        return (!!(oSpace.id && oSpace.pages && oSpace.pages[0] && oSpace.pages[0].id));
                    });

                    // Reject if no page assigned
                    if (!oSpaceWithPage) {
                        return Promise.reject(resources.i18n.getText("PageRuntime.NoAssignedPage"));
                    }

                    return {
                        spaceId: oSpaceWithPage.id,
                        pageId: oSpaceWithPage.pages[0].id
                    };
                });
        },

        /**
         * Triggers the navigation to a specific Page after the pageId is returned
         * and the Pages service could successfully load the requested Page.
         * Triggers the navigation to an error page when an error occurs.
         *
         * @returns {Promise<string>} A promise which resolves with the path to the Page model after the Page was successfully loaded.
         * @private
         * @since 1.72.0
         */
        _openFLPPage: function () {
            var sPageId,
                sSpaceId;

            return this._getPageAndSpaceId()
                .then(function (ids) {
                    sPageId = ids.pageId;
                    sSpaceId = ids.spaceId;

                    // this property may be updated by consecutive calls to _openFLPPage and prevents race conditions when opening pages
                    this.sCurrentTargetPageId = sPageId;

                    return this.oInitFinishedPromise
                        .then(function () {
                            return this.getOwnerComponent().getPagesService();
                        }.bind(this))
                        .then(function (pagesService) {
                            return pagesService.loadPage(sPageId);
                        })
                        .then(function () {
                            this._showActionModeButton();
                            if (this.sCurrentTargetPageId === sPageId) {
                                return this._navigate(sPageId, sSpaceId);
                            }
                            return Promise.resolve();
                        }.bind(this))
                        .then(this._notifyOnPageRuntimeRendered)
                        .catch(function (error) {
                            if (error instanceof Error) {
                                // E.g. UI5 modules cannot be loaded
                                this._oErrorPageModel.setProperty("/text", resources.i18n.getText("PageRuntime.GeneralError.Text"));
                            } else {
                                var sDescription = resources.i18n.getText("PageRuntime.CannotLoadPage.Description") + JSON.stringify(error);

                                this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                                this._oErrorPageModel.setProperty("/text", resources.i18n.getText("PageRuntime.CannotLoadPage.Text", [sPageId, sSpaceId]));
                                this._oErrorPageModel.setProperty("/description", "");
                                this._oErrorPageModel.setProperty("/details", sDescription);
                            }

                            this.oPagesRuntimeNavContainer.to(this.oErrorPage);

                            this._hideActionModeButton();
                            this._cancelActionMode();

                            this._notifyOnPageRuntimeRendered();
                        }.bind(this));
                }.bind(this))
                .catch(function (error) {
                    this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                    this._oErrorPageModel.setProperty("/text", error || "");
                    this._oErrorPageModel.setProperty("/description", "");
                    this._oErrorPageModel.setProperty("/details", "");

                    this.oPagesRuntimeNavContainer.to(this.oErrorPage);

                    this._hideActionModeButton();
                    this._cancelActionMode();

                    this._notifyOnPageRuntimeRendered();
                }.bind(this));
        },

        /**
         * Loops through every page in the inner NavContainer and displays
         * the one which was specified. Also determines if the page title should be shown.
         *
         * @param {string} targetPageId The ID of the page which should be displayed
         * @param {string} spaceId The ID of the space to which the page is assigned to
         * @returns {Promise<void>} Promise which is resolved after the navigation occurred
         * @private
         * @since 1.72.0
         */
        _navigate: function (targetPageId, spaceId) {
            var oPageControl = this.oPagesNavContainer.getPages().find(function (oControl) {
                return targetPageId === oControl.data("pageId");
            });

            if (!oPageControl) {
                return Promise.reject();
            }

            return sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.hasMultiplePages(spaceId);
                })
                .then(function (bHasMultiplePages) {
                    var bSamePage = this.oPagesNavContainer.getCurrentPage() === oPageControl;

                    this._oViewSettingsModel.setProperty("/showPageTitle", bHasMultiplePages);
                    this.oPagesNavContainer.to(oPageControl);
                    this.oPagesRuntimeNavContainer.to(this.oPagesNavContainer);

                    // Only cancel edit mode in case of navigation to a different page
                    if (!bSamePage) {
                        this._cancelActionMode();
                    }
                }.bind(this));
        },

        /**
         * Emit events when page is rendered
         *
         * @since 1.79.0
         * @private
         */
        _notifyOnPageRuntimeRendered: function () {
            EventHub.emit("PagesRuntimeRendered");
            // "reset" the appRendered event in case the user wants to navigate back to the same app.
            if (EventHub.last("AppRendered") !== undefined) {
                EventHub.emit("AppRendered", undefined);
            }
        },

        /**
         * Displays the description of the current error and hide the button after it is pressed.
         *
         * @since 1.73.0
         * @private
         */
        _pressViewDetailsButton: function () {
            var sErrorDetails = this._oErrorPageModel.getProperty("/details") || "";
            this._oErrorPageModel.setProperty("/description", sErrorDetails);
        },

        /**
         * Copies the content of the text provided to the clipboard and shows a MessageToast with a success or error message
         *
         * @param {string} text The text that should be copied to the clipboard
         * @since 1.73.0
         * @private
         */
        _copyToClipboard: function () {
            var oTemporaryDomElement = document.createElement("textarea");
            try {
                oTemporaryDomElement.contentEditable = true;
                oTemporaryDomElement.readonly = false;
                oTemporaryDomElement.textContent = this._oErrorPageModel.getProperty("/description");
                document.documentElement.appendChild(oTemporaryDomElement);

                oTemporaryDomElement.select();
                document.execCommand("copy");
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopySuccess"), {
                    closeOnBrowserNavigation: false
                });
            } catch (oException) {
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopyFail"), {
                    closeOnBrowserNavigation: false
                });
            } finally {
                oTemporaryDomElement.parentNode.removeChild(oTemporaryDomElement);
            }
        },

        /**
         * UI5 factory function which is used by the sections control inside the runtime view to fill the visualizations aggregation
         * @see sap.ushell.ui.launchpad.Section
         *
         * @param {string} id Control ID
         * @param {sap.ui.model.Context} context UI5 context
         * @returns {sap.ui.core.Control} The UI5 control
         * @private
         * @since 1.72.0
         */
        _visualizationFactory: function (id, context) {
            if (this._oVisualizationInstantiationService) {
                var oData = context.getObject();
                var sPath = context.getPath();
                var sSectionPath = sPath.replace(/\/visualizations\/\d*\/?$/, "");
                var oSectionData = context.getModel().getProperty(sSectionPath);
                var oVizType = context.getModel().getProperty("/vizTypes/" + oData.vizType);

                var oVisualization = this._oVisualizationInstantiationService.instantiateVisualization(oData, oVizType);
                oVisualization.attachPress(this.onVisualizationPress, this);
                oVisualization.bindEditable("viewSettings>/actionModeActive");

                if (!oSectionData.default) {
                    this._addTileActions(oVisualization);
                }

                // The path looks like this "/pages/0/sections/0/visualizations/0"
                var sPagePathIndex = context.getPath().split("/")[2];
                var bActive = !!oStateManager.getPageVisibility("/pages/" + sPagePathIndex);
                oVisualization.setActive(bActive);

                return oVisualization;
            }
            return new GenericTile({
                state: LoadState.Failed
            });
        },

        /**
         * Adds tile actions to the VizInstance for change of display format
         *
         * @param {sap.ushell.ui.launchpad.VizInstance} oVizInstance The VizInstance which the tile actions are added to.
         *
         * @private
         * @since 1.85
         */
        _addTileActions: function (oVizInstance) {
            var aAvailableDisplayFormats = oVizInstance.getAvailableDisplayFormats();

            for (var i = 0; i < aAvailableDisplayFormats.length; i++) {
                oVizInstance.addTileAction(new Button({
                    text: resources.i18n.getText("VisualizationInstance.ConvertTo" + capitalize(aAvailableDisplayFormats[i]) + "Action"),
                    press: [aAvailableDisplayFormats[i], this._updateVisualizationDisplayFormat, this]
                }));
            }

            oVizInstance.addTileAction(new Button({
                text: resources.i18n.getText("moveTileDialog_action"),
                press: [oVizInstance, this._openMoveVisualizationDialog, this]
            }));
        },

        /**
         * Opens a dialog which allows the user to move a visualization to a different section.
         *
         * @param {sap.ui.base.Event} oEvent SAP UI5 event object
         * @param {sap.ushell.ui.launchpad.VizInstance} oVizInstance The VizInstance to be moved.
         */
        _openMoveVisualizationDialog: function (oEvent, oVizInstance) {
            this._oVizInstanceToBeMoved = oVizInstance;
            var oVizInstanceToBeMovedContextPath = oVizInstance.getBindingContext().getPath();
            var aVizInstancePathParts = oVizInstanceToBeMovedContextPath.split("/");

            var sBindingPath = "/pages/" + aVizInstancePathParts[2] + "/sections";

            if (!this._oMoveVisualizationDialog) {
                sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
                    Fragment.load({
                        name: "sap.ushell.components.pages.MoveVisualization",
                        controller: this
                    }).then(function (oDialog) {
                        this._oMoveVisualizationDialog = oDialog;
                        this.getView().addDependent(oDialog);
                        oDialog.bindObject({ path: sBindingPath });
                        oDialog.open();
                    }.bind(this));
                }.bind(this));
            } else {
                this._oMoveVisualizationDialog.bindObject({ path: sBindingPath });
                this._oMoveVisualizationDialog.open();
            }
        },

        /**
         * The event handler which is called after a section is selected in the MoveVisualization dialog.
         *
         * @param {sap.ui.base.Event} oEvent SAP UI5 event object.
         *
         *@return {Promise<void>} A Promise which resolves after an invisible message was announced.
         */
        _confirmSelect: function (oEvent) {
            var oDefaultGroupFilter = new Filter("default", FilterOperator.EQ, false);
            var oItemsBinding = oEvent.getSource().getBinding("items");
            oItemsBinding.filter([oDefaultGroupFilter]);

            var oVizInstanceToBeMovedContextPath = this._oVizInstanceToBeMoved.getBindingContext().getPath();
            var aVizInstancePathParts = oVizInstanceToBeMovedContextPath.split("/");

            var iPageIndex = aVizInstancePathParts[2];
            var iCurrentSectionIndex = aVizInstancePathParts[4];
            var iCurrentVizIndex = aVizInstancePathParts[6];

            var sTargetPath = oEvent.getParameter("selectedItem").getBindingContext().getPath();
            var aTargetPathParts = sTargetPath.split("/");

            var iTargetSectionIndex = aTargetPathParts[4];
            var oSourceSection = this._getAncestorControl(this._oVizInstanceToBeMoved, "sap.ushell.ui.launchpad.Section");
            var oPage = this._getAncestorControl(this._oVizInstanceToBeMoved, "sap.ushell.ui.launchpad.Page");
            var aSections = oPage.getSections();
            var oTargetSection = aSections[iTargetSectionIndex];
            var sArea = oSourceSection.getItemPosition(this._oVizInstanceToBeMoved).area;

            this._oVizInstanceToBeMoved = null;
            var oComponent = this.getOwnerComponent();
            return oComponent.getPagesService()
                .then(function (oPagesService) {
                    return oPagesService.moveVisualization(iPageIndex, iCurrentSectionIndex, iCurrentVizIndex, iTargetSectionIndex, -1);
                })
                .then(function (oResult) {
                    var oViz = oTargetSection.getVisualizations()[oResult.visualizationIndex];
                    if (oViz) {
                        oTargetSection.focusVisualization(oViz);
                    }
                    var sText = this._getVizMoveAnnouncement(sArea, sArea);
                    oComponent.getInvisibleMessageInstance().announce(sText, InvisibleMessageMode.Polite);
                }.bind(this));
        },

        /**
         * The event handler which is called when the user searches in the MoveVisualization dialog.
         * @param {sap.ui.base.Event} oEvent SAP UI5 event object.
         */
        _onMoveTileSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("title", FilterOperator.Contains, sValue);
            var oDefaultGroupFilter = new Filter("default", FilterOperator.EQ, false);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter, oDefaultGroupFilter]);
        },

        /**
         * The event handler which is called when the user presses cancel in the MoveVisualization dialog.
         * @param {sap.ui.base.Event} oEvent SAP UI5 event object.
         */
        _onMoveTileDialogClose: function (oEvent) {
            this._oVizInstanceToBeMoved = null;
            var oDefaultGroupFilter = new Filter("default", FilterOperator.EQ, false);
            oEvent.getSource().getBinding("items").filter([oDefaultGroupFilter]);
        },

        /**
         * Updates the displayFormatHint property of the visualization
         *
         * @param {sap.ui.base.Event} oEvent
         *  SAPUI5 event object. The source is used to identify the visualization which should be updated.
         * @param {sap.ushell.DisplayFormat} sNewDisplayFormatHint
         *  The new displayFormatHint which is used to update the current displayFormatHint property.
         *
         * @returns {Promise<void>} A promise which is resolved as soon as the visualization was updated.
         * @private
         * @since 1.84
         */
        _updateVisualizationDisplayFormat: function (oEvent, sNewDisplayFormatHint) {
            var oContext = oEvent.getSource().getBindingContext();
            var sPath = oContext.getPath();
            var aPathParts = sPath.split("/");
            var sOldDisplayFormatHint;

            var oComponent = this.getOwnerComponent();
            return oComponent.getPagesService()
                .then(function (oPagesService) {
                    sOldDisplayFormatHint = oPagesService.getModel().getProperty(sPath).displayFormatHint;
                    var oVizData = {
                        displayFormatHint: sNewDisplayFormatHint
                    };
                    // pageIndex, sectionIndex, visualizationIndex
                    return oPagesService.updateVisualization(aPathParts[2], aPathParts[4], aPathParts[6], oVizData);
                })
                .then(function () {
                    var sInvisibleMessage = this._getVizMoveAnnouncement(sOldDisplayFormatHint, sNewDisplayFormatHint);
                    oComponent.getInvisibleMessageInstance().announce(sInvisibleMessage, InvisibleMessageMode.Polite);
                }.bind(this));
        },

        /**
         * Press handler which is called upon visualization press
         *
         * @param {sap.ui.base.Event} oEvent SAPUI5 event object
         * @returns {Promise<void>} Resolves with an empty value
         * @since 1.75
         * @private
         */
        onVisualizationPress: function (oEvent) {
            var sScope = oEvent.getParameter("scope");
            var sAction = oEvent.getParameter("action");
            var oVisualization = oEvent.getSource();
            var oContext = oVisualization.getBindingContext();
            var sPath = oContext.getPath();
            var aPathParts = sPath.split("/");
            var oSection = this._getAncestorControl(oVisualization, "sap.ushell.ui.launchpad.Section");

            if (sScope === "Actions" && sAction === "Remove") {
                return this.getOwnerComponent().getPagesService().then(function (oPagesService) {
                    var oOldPosition = oSection.getItemPosition(oVisualization);
                    // pageIndex, sectionIndex, visualizationIndex
                    oPagesService.deleteVisualization(aPathParts[2], aPathParts[4], aPathParts[6]);
                    MessageToast.show(resources.i18n.getText("PageRuntime.MessageToast.TileRemoved"));
                    oSection._focusItem(oOldPosition);
                });
            }

            return Promise.resolve();
        },

        /**
         * UI5 lifecycle method which is called upon controller destruction.
         * It detaches the router events and config listeners.
         *
         * @private
         * @since 1.72.0
         */
        onExit: function () {
            this.oContainerRouter.getRoute("home").detachMatched(this._openFLPPage, this);
            this.oContainerRouter.getRoute("openFLPPage").detachMatched(this._openFLPPage, this);
            this._aConfigListeners.off();
            this.oEventHubListener.off();
            this._oEventBus.unsubscribe("launchpad", "shellFloatingContainerIsDocked", this._handleUshellContainerDocked, this);
            this._oEventBus.unsubscribe("launchpad", "shellFloatingContainerIsUnDocked", this._handleUshellContainerDocked, this);
            oStateManager.exit();

            var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
            if (oActionModeButton) {
                oActionModeButton.destroy();
            }
        },

        /**
         * Hides the action mode button
         *
         * @private
         * @since 1.84.0
         */
        _hideActionModeButton: function () {
            var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
            if (oActionModeButton) {
                oActionModeButton.setVisible(false);
            }
        },

        /**
         * Shows the action mode button
         *
         * @private
         * @since 1.84.0
         */
        _showActionModeButton: function () {
            var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
            if (oActionModeButton) {
                oActionModeButton.setVisible(true);
            }
        },

        /**
         * Creates the action mode button to edit pages.
         * Based on the config, the button will be created in the header or the user menu
         *
         * @private
         * @since 1.86.0
         */
        _createActionModeButton: function () {
            var oActionButtonObjectData = {
                id: "ActionModeBtn",
                text: resources.i18n.getText("PageRuntime.EditMode.Activate"),
                tooltip: resources.i18n.getText("PageRuntime.EditMode.Activate"),
                icon: "sap-icon://edit",
                press: [this.pressActionModeButton, this]
            };
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");
            var bMoveEditButtonToShellHeader = oRenderer.getShellConfig().moveEditHomePageActionToShellHeader;
            if (bMoveEditButtonToShellHeader) {
                this._createHeaderActionModeButton(oActionButtonObjectData);
            } else {
                this._createUserActionModeButton(oActionButtonObjectData);
            }
        },

        /**
         * Creates the action mode button in the shell header.
         *
         * @param {object} oActionButtonObjectData the button property
         *
         * @private
         * @since 1.86.0
         */
        _createHeaderActionModeButton: function (oActionButtonObjectData) {
            sap.ui.require(["sap/ushell/ui/shell/ShellHeadItem"], function (ShellHeadItem) {
                var oTileActionsButton = new ShellHeadItem(oActionButtonObjectData);
                if (Config.last("/core/extension/enableHelp")) {
                    oTileActionsButton.addStyleClass("help-id-ActionModeBtn"); // xRay help ID
                }
                var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                if (this.bIsHomeIntentRootIntent) {
                    oRenderer.showHeaderEndItem(oTileActionsButton.getId(), false, ["home"]);
                } else {
                    oRenderer.showHeaderEndItem(oTileActionsButton.getId(), true);
                }
            }.bind(this));
        },

        /**
         * Creates the user action menu entry for the actionmode
         *
         * @param {object} oActionButtonObjectData the button property
         *
         * @private
         * @since 1.74.0
         */
        _createUserActionModeButton: function (oActionButtonObjectData) {
            var oAddActionButtonParameters = {
                controlType: "sap.ushell.ui.launchpad.ActionItem",
                oControlProperties: oActionButtonObjectData,
                bIsVisible: true,
                aStates: ["home"]
            };
            if (!this.bIsHomeIntentRootIntent) {
                oAddActionButtonParameters.aStates = null;
                oAddActionButtonParameters.bCurrentState = true;
            }
            sap.ushell.Container.getRenderer("fiori2").addUserAction(oAddActionButtonParameters).done(function (oActionButton) {
                // if xRay is enabled
                if (Config.last("/core/extension/enableHelp")) {
                    oActionButton.addStyleClass("help-id-ActionModeBtn");// xRay help ID
                }
            });

        },

        /**
         * Handles the button press on the user action menu entry
         *
         * @private
         * @since 1.74.0
         */
        pressActionModeButton: function () {
            var bActionModeActive = this.getView().getModel("viewSettings").getProperty("/actionModeActive");
            sap.ui.require([
                "sap/ushell/components/pages/ActionMode"
            ], function (ActionMode) {
                if (bActionModeActive) {
                    ActionMode.cancel();
                } else {
                    ActionMode.start(this);
                }
            }.bind(this));
        },

        /**
         * Cancels the action mode in case it is active
         *
         * @private
         * @since 1.84.0
         */
        _cancelActionMode: function () {
            var bActionModeActive = this.getView().getModel("viewSettings").getProperty("/actionModeActive");
            if (bActionModeActive) {
                sap.ui.require([
                    "sap/ushell/components/pages/ActionMode"
                ], function (ActionMode) {
                    ActionMode.cancel();
                });
            }
        },

        /**
         * Generic handler for action mode actions
         *
         * @param {string} sHandler Name of the handler within the action mode module
         * @param {sap.ui.base.Event} oEvent Event object
         * @param {sap.ui.core.Control} oSource Source control
         * @param {object} oParameters Event parameters
         * @private
         * @since 1.74.0
         */
        handleEditModeAction: function (sHandler, oEvent, oSource, oParameters) {
            sap.ui.require([
                "sap/ushell/components/pages/ActionMode"
            ], function (ActionMode) {
                ActionMode[sHandler](oEvent, oSource, oParameters);
            });
        },

        /**
         * Finds the ancestor control with a certain control type.
         *
         * @param {sap.ui.core.Control} control The control to start the search from.
         * @param {string} controlType The control type that matches the control that should be found and returned.
         * @returns {sap.ui.core.Control} A parent control that matches the given control type or null.
         * @private
         * @since 1.84.0
         */
        _getAncestorControl: function (control, controlType) {
            if (control && control.isA && control.isA(controlType)) {
                return control;
            } else if (control && control.getParent) {
                return this._getAncestorControl(control.getParent(), controlType);
            }
            return null;
        },

        /**
         * Handler for visualization drag and drop.
         *
         * @param {sap.ui.base.Event} oEvent Event object.
         * @returns {Promise<undefined>} Resolves when the Pages service is retrieved.
         * @private
         * @since 1.75.0
         */
        moveVisualization: function (oEvent) { // eslint-disable-line complexity
            var oDragged = oEvent.getParameter("draggedControl"),
                oDropped = oEvent.getParameter("droppedControl"),
                sDropPosition = oEvent.getParameter("dropPosition"),
                oBrowserEvent = oEvent.getParameter("browserEvent"),
                sKeyCode = oBrowserEvent && oBrowserEvent.keyCode,
                oPage = this._getAncestorControl(oDragged, "sap.ushell.ui.launchpad.Page"),
                iPageIndex = parseInt(oDragged.getBindingContext().getPath().split("/")[2], 10),
                oCurrentSection = this._getAncestorControl(oDragged, "sap.ushell.ui.launchpad.Section"),
                iCurrentSectionIndex = oPage.indexOfSection(oCurrentSection),
                iCurrentVizIndex = oCurrentSection.indexOfVisualization(oDragged),
                oCurrentViz = oCurrentSection.getVisualizations()[iCurrentVizIndex],
                oCurrentPos = oCurrentSection.getItemPosition(oCurrentViz),
                oTargetSection,
                iTargetSectionIndex,
                iTargetVizIndex,
                oTargetViz,
                oTargetPos;

            if (!oDropped) { // Target is an empty area of the section or an inner compactArea dnd (only happens during keyboard dnd)
                var bUp = oEvent.mParameters.browserEvent.keyCode === KeyCodes.ARROW_UP,
                    aSection = oPage.getSections();
                iTargetSectionIndex = iCurrentSectionIndex;

                while (true) {
                    iTargetSectionIndex = bUp ? --iTargetSectionIndex : ++iTargetSectionIndex;
                    oTargetSection = aSection[iTargetSectionIndex];

                    if (!oTargetSection || oTargetSection.getDefault()) {
                        oCurrentViz.invalidate();
                        return Promise.resolve();
                    }

                    if (oTargetSection.getShowSection() || oTargetSection.getEditable()) {
                        iTargetVizIndex = oTargetSection.getClosestCompactItemIndex(oDragged.getDomRef(), bUp);
                        oTargetViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                        oTargetPos = oTargetSection.getItemPosition(oTargetViz);
                        if (oTargetPos.area !== oCurrentPos.area) {
                            oTargetPos = oCurrentPos;
                        }
                        break;
                    }
                }
            } else {
                // when dropping on the CompactArea, pretend it was dropped after its last item
                if (oDropped.isA("sap.ushell.ui.launchpad.section.CompactArea")) {
                    var aItems = oDropped.getItems();
                    if (aItems.length) {
                        oDropped = aItems[aItems.length - 1];
                        sDropPosition = "After";
                    }
                }

                oTargetSection = this._getAncestorControl(oDropped, "sap.ushell.ui.launchpad.Section");
                iTargetSectionIndex = oPage.indexOfSection(oTargetSection);

                if (oTargetSection.getDefault() && !oCurrentSection.getDefault()) {
                    oCurrentViz.invalidate();
                    return Promise.resolve();
                }

                iTargetVizIndex = oTargetSection.indexOfVisualization(oDropped);
                oTargetViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                oTargetPos = oTargetSection.getItemPosition(oTargetViz);

                if (oTargetPos.index === -1) {
                    oTargetPos.area = oCurrentPos.area;
                }

                if (iCurrentSectionIndex === iTargetSectionIndex) {
                    if (sDropPosition === "Before" && iCurrentVizIndex < iTargetVizIndex) {
                        iTargetVizIndex--;
                    } else if (sDropPosition === "After" && iCurrentVizIndex > iTargetVizIndex) {
                        iTargetVizIndex++;
                    }

                    if (iCurrentVizIndex === iTargetVizIndex && oTargetPos.area === oCurrentPos.area) {
                        oCurrentViz.invalidate();
                        return Promise.resolve();
                    }
                } else if (sDropPosition === "After") {
                    iTargetVizIndex++;
                }
            }

            if ((iCurrentSectionIndex !== iTargetSectionIndex)
                && (sKeyCode === KeyCodes.ARROW_UP || sKeyCode === KeyCodes.ARROW_DOWN) // only adjust if keyboard dnd
                && (oCurrentPos.index > oTargetPos.index)) {
                iTargetVizIndex++;
            }

            var oPagesService;
            var oComponent = this.getOwnerComponent();
            return oComponent.getPagesService()
                .then(function (oService) {
                    oPagesService = oService;
                    oPagesService.enableImplicitSave(false);
                    return oPagesService.moveVisualization(
                        iPageIndex,
                        iCurrentSectionIndex,
                        iCurrentVizIndex,
                        iTargetSectionIndex,
                        iTargetVizIndex
                    );
                })
                .then(function (oResult) {
                    iTargetVizIndex = oResult.visualizationIndex;
                    if (oCurrentPos.area !== oTargetPos.area) {
                        var oVizData = {
                            displayFormatHint: oTargetPos.area
                        };
                        return oPagesService.updateVisualization(iPageIndex, iTargetSectionIndex, iTargetVizIndex, oVizData);
                    }
                    return Promise.resolve();
                })
                .then(function () {
                    return oPagesService.savePersonalization();
                })
                .then(function () {
                    var oViz = oTargetSection.getVisualizations()[iTargetVizIndex];
                    if (oViz) {
                        oTargetSection.focusVisualization(oViz);
                        oViz.invalidate();
                    }
                    var sInvisibleMessage = this._getVizMoveAnnouncement(oCurrentPos.area, oTargetPos.area);

                    oComponent.getInvisibleMessageInstance().announce(sInvisibleMessage, InvisibleMessageMode.Polite);
                }.bind(this))
                .finally(function () {
                    oPagesService.enableImplicitSave(true);
                });
        },

        /**
         * Returns the text for the InvisibleMessage depending on the content areas
         * @param {sap.ushell.DisplayFormat} sFromAreaType The source content area
         * @param {sap.ushell.DisplayFormat} sToAreaType The target content area
         *
         * @returns {string} The message text for the InvisibleMessage
         *
         * @private
         * @since 1.85.0
         */
        _getVizMoveAnnouncement: function (sFromAreaType, sToAreaType) {
            // Move within the same area
            if (sFromAreaType === sToAreaType) {
                if (sToAreaType === DisplayFormat.Compact) {
                    return resources.i18n.getText("PageRuntime.Message.LinkMoved");
                }
                return resources.i18n.getText("PageRuntime.Message.TileMoved");
                // Move between different areas
            } else if (sFromAreaType === DisplayFormat.Compact) {
                return resources.i18n.getText("PageRuntime.Message.LinkConverted");
            }
            return resources.i18n.getText("PageRuntime.Message.TileConverted");
        },

        /**
         * Handler for visualization drag and drop, when a dragged item enters a section.
         * Disables drop into a default section.
         * However, it is still possible to rearrange tiles inside of the default section.
         *
         * @param {sap.ui.base.Event} oEvent Event object
         * @private
         * @since 1.75.0
         */
        onDragEnter: function (oEvent) {
            var oTargetSection = oEvent.getParameter("dragSession").getDropControl();

            if (oTargetSection.getDefault()) {
                oEvent.preventDefault();
            }
        },

        /**
         * Handler for visualization drag and drop, when a dragged item enters an area inside a section.
         * Checks if the vizInstance supports the display format of the target area.
         *
         * @param {sap.ui.base.Event} oEvent Event object
         * @private
         * @since 1.84.0
         */
        onAreaDragEnter: function (oEvent) {
            var sSourceArea = oEvent.getParameter("sourceArea");
            var sTargetArea = oEvent.getParameter("targetArea");

            // same area means no change of the display format
            if (sSourceArea === sTargetArea) {
                return;
            }

            var oVizInstance = oEvent.getParameter("dragControl");
            var aAvailableDisplayFormats = oVizInstance.getAvailableDisplayFormats();

            if (aAvailableDisplayFormats.indexOf(sTargetArea) === -1) {
                oEvent.getParameter("originalEvent").preventDefault();
            }
        },

        /**
         * Handles the resize event triggered by copilot docking, the grid container containerQuery must be enabled in this case.
         *
         * @param {string} channel The channel name of the event
         * @param {string} event The name of the event
         * @since 1.77.0
         * @private
         */
        _handleUshellContainerDocked: function (channel, event) {
            this._oViewSettingsModel.setProperty("/ushellContainerDocked", event === "shellFloatingContainerIsDocked");
        }
    });
});
