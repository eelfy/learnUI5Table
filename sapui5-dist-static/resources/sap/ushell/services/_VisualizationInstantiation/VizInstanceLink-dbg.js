// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ushell/library",
    "sap/m/GenericTile",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Config",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/services/AppType",
    "sap/m/ActionSheet"
], function (mobileLibrary, ushellLibrary, GenericTile, VizInstance, hasher, Config, WindowUtils, AppType, ActionSheet) {
    "use strict";

    var GenericTileMode = mobileLibrary.GenericTileMode;
    var GenericTileScope = mobileLibrary.GenericTileScope;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /**
     * Constructor for a new sap.ushell.ui.launchpad.VizInstanceLink control.
     *
     * @param {string} [sId] ID for the new managed object; generated automatically if no non-empty ID is given
     * @param {object} [mSettings] Optional map/JSON-object with initial property values, aggregated objects etc. for the new object
     *
     * @class Displays header and subheader in a compact link format.
     *
     * @extends sap.m.GenericTile
     *
     * @author SAP SE
     * @version 1.88.1
     * @since 1.84.0
     *
     * @private
     * @alias sap.ushell.ui.launchpad.VizInstanceLink
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var VizInstanceLink = GenericTile.extend("sap.ushell.ui.launchpad.VizInstanceLink", {
        metadata: {
            library: "sap.ushell",
            properties: {
                title: {
                    type: "string",
                    defaultValue: "",
                    group: "Appearance",
                    bindable: true
                },
                subtitle: {
                    type: "string",
                    defaultValue: "",
                    group: "Appearance",
                    bindable: true
                },
                editable: {
                    type: "boolean",
                    defaultValue: false,
                    group: "Behavior",
                    bindable: true
                },
                active: {
                    type: "boolean",
                    group: "Misc",
                    defaultValue: false
                },
                targetURL: {
                    type: "string",
                    group: "Misc"
                },
                mode: {
                    type: "sap.m.GenericTileMode",
                    group: "Appearance",
                    defaultValue: GenericTileMode.LineMode
                },
                displayFormat: {
                    type: "string",
                    defaultValue: DisplayFormat.Compact
                },
                supportedDisplayFormats: {
                    type: "string[]",
                    defaultValue: [DisplayFormat.Compact]
                },
                dataHelpId: {
                    type: "string",
                    defaultValue: ""
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
            }
        },
        renderer: GenericTile.getMetadata().getRenderer()
    });

    VizInstanceLink.prototype.init = function () {
        GenericTile.prototype.init.apply(this, arguments);
        this.attachPress(this._handlePress, this);
    };

    VizInstanceLink.prototype.exit = function () {
        if (this._oActionSheet) {
            this._oActionSheet.destroy();
        }
    };

    /**
     * Returns a new ActionSheet. If it was already created it will return the instance.
     *
     * @returns {sap.m.ActionSheet} The ActionSheet control.
     */
    VizInstanceLink.prototype._getTileActionSheet = function () {
        if (!this._oActionSheet) {
            this._oActionSheet = new ActionSheet();
        }

        return this._oActionSheet;
    };

    /**
     * Navigates to an intent or to a target URL if one is provided.
     *
     * @private
     */
    VizInstanceLink.prototype._handlePress = function () {
        if (this.getEditable()) {
            this._getTileActionSheet().openBy(this);
            return;
        }

        var sTargetURL = this.getTargetURL();
        if (!sTargetURL) {
            return;
        }

        if (sTargetURL[0] === "#") {
            hasher.setHash(sTargetURL);
        } else {
            // add the URL to recent activity log
            var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
            if (bLogRecentActivity) {
                var oRecentEntry = {
                    title: this.getTitle(),
                    appType: AppType.URL,
                    url: this.getTargetURL(),
                    appId: this.getTargetURL()
                };
                sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
            }

            WindowUtils.openURL(sTargetURL, "_blank");
        }
    };

    VizInstanceLink.prototype.load = VizInstance.prototype.load;

    VizInstanceLink.prototype.setDataHelpId = function (value) {
        this.data("help-id", value, true);
        return this.setProperty("dataHelpId", value);
    };

    VizInstanceLink.prototype.setTitle = function (value) {
        this.setHeader(value);
        return this.setProperty("title", value);
    };

    VizInstanceLink.prototype.setSubtitle = function (value) {
        this.setSubheader(value);
        return this.setProperty("subtitle", value);
    };

    VizInstanceLink.prototype.setTargetURL = function (value) {
        this.setUrl(value);
        return this.setProperty("targetURL", value);
    };

    VizInstanceLink.prototype.setProperty = function (propertyName, value, suppressInvalidate) {
        if (propertyName === "title") {
            this.setProperty("header", value, suppressInvalidate);
        }

        if (propertyName === "subtitle") {
            this.setProperty("subheader", value, suppressInvalidate);
        }

        if (propertyName === "targetURL") {
            this.setProperty("url", value, suppressInvalidate);
        }

        if (propertyName === "editable") {
            if (value) {
                this.setProperty("scope", GenericTileScope.Actions, suppressInvalidate);
            } else {
                this.setProperty("scope", GenericTileScope.Display, suppressInvalidate);
            }
        }

        return GenericTile.prototype.setProperty.apply(this, arguments);
    };

    VizInstanceLink.prototype.getAvailableDisplayFormats = VizInstance.prototype.getAvailableDisplayFormats;

    return VizInstanceLink;
});