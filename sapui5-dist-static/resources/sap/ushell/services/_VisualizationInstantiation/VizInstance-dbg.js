// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/ActionSheet",
    "sap/m/FrameType",
    "sap/m/library",
    "sap/m/VBox",
    "sap/ui/core/Icon",
    "sap/ui/core/XMLComposite",
    "sap/ui/events/PseudoEvents",
    "sap/ushell/library",
    "sap/ushell/resources"
], function (ActionSheet, FrameType, mobileLibrary, VBox, Icon, XMLComposite, PseudoEvents, ushellLibrary, resources) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * @constructor
     */
    var VizInstance = XMLComposite.extend("sap.ushell.ui.launchpad.VizInstance", /** @lends sap.ushell.ui.launchpad.VizInstance.prototype*/ {
        metadata: {
            library: "sap.ushell",
            properties: {
                title: {
                    type: "string",
                    defaultValue: "",
                    bindable: true
                },
                subtitle: {
                    type: "string",
                    defaultValue: "",
                    bindable: true
                },
                height: {
                    type: "int",
                    defaultValue: 2
                },
                width: {
                    type: "int",
                    defaultValue: 2
                },
                info: {
                    type: "string",
                    defaultValue: "",
                    bindable: true
                },
                icon: {
                    type: "sap.ui.core.URI",
                    defaultValue: "",
                    bindable: true
                },
                numberUnit: {
                    type: "string",
                    defaultValue: "",
                    bindable: true
                },
                state: {
                    type: "sap.m.LoadState",
                    defaultValue: LoadState.Loaded,
                    bindable: true
                },
                sizeBehavior: {
                    type: "sap.m.TileSizeBehavior",
                    defaultValue: TileSizeBehavior.Responsive,
                    bindable: true
                },
                editable: {
                    type: "boolean",
                    defaultValue: false,
                    bindable: true
                },
                active: {
                    type: "boolean",
                    defaultValue: false
                },
                targetURL: {
                    type: "string"
                },
                indicatorDataSource: {
                    type: "object",
                    defaultValue: undefined
                },
                dataSource: {
                    type: "object",
                    defaultValue: undefined
                },
                keywords: {
                    type: "string[]",
                    defaultValue: []
                },
                instantiationData: {
                    type: "object",
                    defaultValue: {}
                },
                contentProviderId: {
                    type: "string",
                    defaultValue: ""
                },
                vizConfig: {
                    type: "object"
                },
                supportedDisplayFormats: {
                    type: "string[]",
                    defaultValue: [DisplayFormat.Standard]
                },
                dataHelpId: {
                    type: "string",
                    defaultValue: ""
                },
                /**
                 * displayFormat
                 * type === string: If we checked for the enum type here, all typos and unknown values
                 * would fail validation instead of falling back to default.
                 */
                displayFormat: {
                    type: "string",
                    defaultValue: DisplayFormat.Standard
                },
                tileSize: {
                    type: "string"
                }
            },
            defaultAggregation: "tileActions",
            aggregations: {
                tileActions: {
                    type: "sap.m.Button",
                    forwarding: {
                        getter: "_getTileActionSheet",
                        aggregation: "buttons"
                    }
                }
            },
            events: {
                press: {
                    parameters: {
                        scope: { type: "sap.m.GenericTileScope" },
                        action: { type: "string" }
                    }
                }
            }
        },
        fragment: "sap.ushell.services._VisualizationInstantiation.VizInstance"
    });

    VizInstance.prototype.init = function () {
        XMLComposite.prototype.init.apply(this, arguments);

        this._oContent = this.getAggregation("_content");
    };

    /**
     * Converts the DisplayFormat and TileSize to the according FrameType.
     * @param {sap.ushell.DisplayFormat} sDisplayFormat The DisplayFormat of the VizInstance
     * @param {string} sTileSize The TileSize of the VizInstance
     * @returns {sap.m.FrameType} The FrameType
     *
     * @since 1.86.0
     * @private
     */
    VizInstance.prototype._formatPlaceholderFrameType = function (sDisplayFormat, sTileSize) {
        this._setSize();
        switch (sDisplayFormat) {
            case DisplayFormat.Flat:
                return FrameType.OneByHalf;
            case DisplayFormat.FlatWide:
                return FrameType.TwoByHalf;
            case DisplayFormat.StandardWide:
                return FrameType.TwoByOne;
            default:
                // the display format 'standard' still takes the tile size into account
                if (sTileSize === "1x2") {
                    return FrameType.TwoByOne;
                }
                return FrameType.OneByOne;
        }
    };

    VizInstance.prototype.exit = function () {
        if (this._oEditModeOverlayContainer) {
            this._oEditModeOverlayContainer.destroy();
        }
        if (this._oActionModeButtonIconVBox) {
            this._oActionModeButtonIconVBox.destroy();
        }
        if (this._oActionDivCenter) {
            this._oActionDivCenter.destroy();
        }
        if (this._oActionSheet) {
            this._oActionSheet.destroy();
        }
    };

    /**
     * Returns the layout data for the GridContainer/Section.
     *
     * @returns {object} The layout data in "columns x rows" format. E.g.: "2x2"
     * @since 1.77.0
     */
    VizInstance.prototype.getLayout = function () {
        return {
            columns: this.getWidth(),
            rows: this.getHeight()
        };
    };

    /**
     * Updates the content aggregation of the XML composite and recalculates its layout data
     *
     * @param {sap.ui.core.Control} content The control to be put inside the visualization
     * @since 1.77.0
     */
    VizInstance.prototype._setContent = function (content) {
        var oGridData = this.getLayoutData();
        if (oGridData && oGridData.isA("sap.f.GridContainerItemLayoutData")) {
            oGridData.setRows(this.getHeight());
            oGridData.setColumns(this.getWidth());
            this.getParent().invalidate();
        }
        if (this.getDataHelpId()) {
            content.data("help-id", this.getDataHelpId(), true);
        }

        this._oContent = content;
        this.invalidate();
    };

    /**
     * Updates the internal _content aggregation with the inner content or the inner content's first child item.
     * @private
     * @since 1.81.0
     */
    VizInstance.prototype._updateContent = function () {
        var oContent = this._oContent;

        if (this.getEditable()) {
            oContent = this._getEditModeOverlay(oContent);
        }

        // Replace the generic tile of the XML composite control with the actual content
        if (this._oContent.getItems) {
            this.setAggregation("_content", oContent.getItems()[0]);
        } else {
            this.setAggregation("_content", oContent);
        }
    };

    /**
     * Constructs and caches the edit mode overlay and wraps the given content with it.
     *
     * @param {sap.ui.core.Control} content An inner control that should receive the overlay.
     * @returns {sap.m.VBox} The overlay control with the wrapped content.
     * @private
     * @since 1.81.0
     */
    VizInstance.prototype._getEditModeOverlay = function (content) {
        var aTileActions = this.getTileActions(),
            oMBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

        if (!this._oEditModeOverlayContainer) {
            var oRemoveIcon = new Icon({
                id: this.getId() + "-action-remove",
                alt: oMBundle.getText("GENERICTILE_ACTIONS_ARIA_TEXT"),
                decorative: false,
                noTabStop: true,
                src: "sap-icon://decline",
                tooltip: resources.i18n.getText("removeButtonTitle")
            }).addStyleClass("sapUshellTileDeleteIconInnerClass sapMPointer");

            this._oRemoveIconVBox = new VBox({
                items: [oRemoveIcon]
            }).addStyleClass("sapUshellTileDeleteIconOuterClass sapUshellTileDeleteClickArea sapMPointer");

            this._oEditModeOverlayContainer = new VBox().addStyleClass("sapUshellVizInstance");
        }

        this._oEditModeOverlayContainer.removeAllItems();
        this._oEditModeOverlayContainer.addItem(this._oRemoveIconVBox);
        this._oEditModeOverlayContainer.addItem(content);

        if (aTileActions.length > 0) {
            if (!this._oActionDivCenter) {
                this._oActionDivCenter = new VBox().addStyleClass("sapUshellTileActionDivCenter");
                this._oActionDivCenter.attachBrowserEvent("click", this._onActionMenuIconPressed, this);
            }

            if (!this._oActionModeButtonIconVBox) {
                this._oActionModeIcon = new Icon({
                    id: this.getId() + "-action-more",
                    decorative: false,
                    alt: oMBundle.getText("LIST_ITEM_NAVIGATION"),
                    noTabStop: true,
                    press: [ this._onActionMenuIconPressed, this ],
                    src: "sap-icon://overflow",
                    tooltip: resources.i18n.getText("configuration.category.tile_actions")
                }).addStyleClass("sapUshellTileActionIconDivBottomInner sapMPointer");

                this._oActionModeButtonIconVBox = new VBox({
                    items: [ this._oActionModeIcon ]
                }).addStyleClass("sapUshellTileActionIconDivBottom sapMPointer");
            }

            this._oEditModeOverlayContainer.addItem(this._oActionDivCenter);
            this._oEditModeOverlayContainer.addItem(this._oActionModeButtonIconVBox);
        }

        return this._oEditModeOverlayContainer;
    };

    /**
     * Returns a new ActionSheet. If it was already created it will return the instance.
     *
     * @returns {sap.m.ActionSheet} The ActionSheet control.
     */
    VizInstance.prototype._getTileActionSheet = function () {
        if (!this._oActionSheet) {
            this._oActionSheet = new ActionSheet();
        }

        return this._oActionSheet;
    };

    /**
     * Press handler for action menu icon.
     *
     * @since 1.79.0
     * @private
     */
    VizInstance.prototype._onActionMenuIconPressed = function () {
        if (this._oActionModeIcon) {
            this._getTileActionSheet().openBy(this._oActionModeIcon);
        }
    };

    VizInstance.prototype.getFocusDomRef = function () {
        if (this.getEditable()) {
            return this._oActionModeIcon && this._oActionModeIcon.getFocusDomRef();
        }

        var aPossibleControls = this._oContent.findAggregatedObjects(true, function (oControl) {
            return oControl.isA("sap.m.GenericTile") || oControl.isA("sap.f.Card");
        });

        if (aPossibleControls.length) {
            return aPossibleControls[0].getFocusDomRef();
        }

        return this._oContent.getFocusDomRef();
    };

    /**
     * Click handler. Prevents the navigation if the edit mode is active.
     *
     * @param {Event} oEvent The Event object
     * @since 1.78.0
     */
    VizInstance.prototype.onclick = function (oEvent) {
        if (this._preventDefault(oEvent)) {
            this.firePress({
                scope: "Display",
                action: "Press"
            });
        } else {
            var sTargetId = oEvent.target.id;
            if (sTargetId.indexOf("action-remove") > -1) {
                this.firePress({
                    scope: "Actions",
                    action: "Remove"
                });
            } else {
                this._onActionMenuIconPressed();
            }
        }


    };

    VizInstance.prototype.onBeforeRendering = function () {
        this._updateContent();

        var oDomRef = this.getDomRef();
        if (oDomRef) {
            oDomRef.removeEventListener("keyup", this._fnKeyupHandler);
            oDomRef.removeEventListener("touchend", this._fnTouchendHandler);
        }
    };

    /**
     * SAPUI5 Lifecycle hook which is called after the control is rendered.
     * Prevents the navigation on keyup events while in the edit mode.
     * Event Capturing is enabled for these as we have no direct control over
     * inner elements but need to prevent their actions in the edit mode.
     *
     * @override
     * @since 1.78.0
     * @private
     */
    VizInstance.prototype.onAfterRendering = function () {
        var oDomRef = this.getDomRef();
        this._fnKeyupHandler = this.onkeyup.bind(this);
        this._fnTouchendHandler = this.onclick.bind(this);

        oDomRef.addEventListener("keyup", this._fnKeyupHandler, true);
        oDomRef.addEventListener("touchend", this._fnTouchendHandler, true);
    };

    /**
     * Handles the keyup event while edit mode is active
     * If delete or backspace is pressed, the focused VizInstance gets removes.
     * If space or enter is pressed, the navigation gets prevented.
     *
     * @param {Event} oEvent Browser Keyboard event
     * @since 1.78.0
     * @private
     */
    VizInstance.prototype.onkeyup = function (oEvent) {
        if (this.getEditable()) {
            if ((PseudoEvents.events.sapdelete.fnCheck(oEvent) || PseudoEvents.events.sapbackspace.fnCheck(oEvent))) {
                this.firePress({
                    scope: "Actions",
                    action: "Remove"
                });
            }

            if (PseudoEvents.events.sapspace.fnCheck(oEvent) || PseudoEvents.events.sapenter.fnCheck(oEvent)) {
                this._preventDefault(oEvent);
            }
        }
    };

    /**
     * Stops the given event from bubbling up or down the DOM and prevents its default behavior.
     *
     * @param {Event} oEvent The browser event
     * @returns {boolean} False if the default behavior is prevented, otherwise true.
     * @since 1.78.0
     */
    VizInstance.prototype._preventDefault = function (oEvent) {
        if (this.getEditable()) {
            oEvent.preventDefault();
            oEvent.stopPropagation();
            oEvent.stopImmediatePropagation();
            return false;
        }
        return true;
    };

    /**
     * Loads the content of the VizInstance and resolves the returned Promise
     * when loading is completed.
     *
     * @returns {Promise<void>} Resolves when loading is completed
     * @abstract
     * @since 1.77.0
     */
    VizInstance.prototype.load = function () {
        // As this is the base control that doesn't load anything, a resolved Promise is
        // returned always.
        return Promise.resolve();
    };

    /**
     * Sets the width and the height of the vizInstance based on display format and tile size.
     *
     * @since 1.88.0
     */
    VizInstance.prototype._setSize = function () {
        var oSize = {};
        switch (this.getDisplayFormat()) {
            case DisplayFormat.Flat:
                oSize.width = 2;
                oSize.height = 1;
                break;
            case DisplayFormat.FlatWide:
                oSize.width = 4;
                oSize.height = 1;
                break;
            case DisplayFormat.StandardWide:
                oSize.width = 4;
                oSize.height = 2;
                break;
            default:
                // DisplayFormat.Standard: as this is the default value in CDM it can be omitted
                oSize = this._parseTileSize(this.getTileSize());
                break;
        }

        if (oSize) {
            this.setWidth(oSize.width);
            this.setHeight(oSize.height);
        }
    };

    /**
     * Parses the tile size string and converts it into grid width and height
     *
     * @param {string} sTileSize The tile size e.g. 1x1
     * @returns {object|null} Width and height or null if the parsing failed
     * @private
     * @since 1.88.0
     */
    VizInstance.prototype._parseTileSize = function (sTileSize) {
        if (!sTileSize) {
            return null;
        }

        var aSize = sTileSize.split("x");
        var oSize = {
            height: parseInt(aSize[0], 10),
            width: parseInt(aSize[1], 10)
        };

        // If not both dimensions are valid the tile size is ignored
        if (!oSize.width || !oSize.height) {
            return null;
        }

        // Convert from FLP tile size to grid size
        oSize.width = oSize.width * 2;
        oSize.height = oSize.height * 2;

        return oSize;
    };

    /**
     * Returns all display formats available after filtering out the current and non-eligible ones
     *
     * @returns {string[]} aAvailableDisplayFormats The available display formats
     *
     * @since 1.85.0
     */
    VizInstance.prototype.getAvailableDisplayFormats = function () {
        var aAvailableDisplayFormats,
            aSupportedDisplayFormats = this.getSupportedDisplayFormats(),
            sDisplayFormat = this.getDisplayFormat();

        aAvailableDisplayFormats = aSupportedDisplayFormats.filter(function (displayFormat) {
            return displayFormat !== sDisplayFormat;
        });

        var iCompactIndex = aAvailableDisplayFormats.indexOf("compact");
        var sTitle = this.getTitle();
        var sTargetURL = this.getTargetURL();

        // link is only possible if both title and target url have value
        if (iCompactIndex > -1 && (!sTitle || !sTargetURL)) {
            aAvailableDisplayFormats.splice(iCompactIndex, 1);
        }
        return aAvailableDisplayFormats;
    };

    return VizInstance;
});
