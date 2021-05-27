// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/m/library",
    "sap/ui/core/Component",
    "sap/base/util/ObjectPath",
    "sap/base/util/deepExtend",
    "sap/ui/core/ComponentContainer"
], function (VizInstance, mobileLibrary, Component, ObjectPath, deepExtend, ComponentContainer) {
    "use strict";

    var LoadState = mobileLibrary.LoadState;

    /**
     * @constructor for a VizInstance for CDM data
     *
     * @extends sap.ushell.ui.launchpad.VizInstance
     * @name sap.ushell.ui.launchpad.VizInstanceCDM
     *
     * @since 1.78
     */
    var VizInstanceCdm = VizInstance.extend("sap.ushell.ui.launchpad.VizInstanceCdm", {
        metadata: {
            library: "sap.ushell"
        },
        fragment: "sap.ushell.services._VisualizationInstantiation.VizInstanceCdm"
    });

    /**
     * Creates the CDM visualization component and sets it as the content
     * of the VizInstance
     *
     * @returns {Promise<void>} Resolves when the component is loaded
     * @override
     * @since 1.78
     */
    VizInstanceCdm.prototype.load = function () {
        var oComponentData = this._getComponentConfiguration();
        return Component.create(oComponentData)
            .then(function (oComponent) {
                this._oComponent = oComponent;
                var oContainer = new ComponentContainer({ component: oComponent });
                oComponent.setParent(this);
                this._setContent(oContainer);
                // notify component about its active state
                this._setComponentTileVisible(this.getActive());
            }.bind(this))
            .catch(function (oError) {
                this.setState(LoadState.Failed);
                return Promise.reject(oError);
            }.bind(this));
    };

    /**
     * Creates the configuration object for the component creation
     * from the visualization data
     *
     * @returns {object} The component configuration
     * @since 1.78
     */
    VizInstanceCdm.prototype._getComponentConfiguration = function () {
        var oVizType = this.getInstantiationData().vizType;
        var oVizConfig = this.getVizConfig();

        var oComponentProperties = ObjectPath.get(["sap.platform.runtime", "componentProperties"], oVizType);
        oComponentProperties = deepExtend({}, this._getComponentProperties(), oComponentProperties);

        var oComponentConfiguration = {
            name: oVizType["sap.ui5"].componentName,
            componentData: {
                properties: oComponentProperties
            },
            // this property can contain a URL from where the visualization type component
            // should be loaded
            url: ObjectPath.get(["sap.platform.runtime", "componentProperties", "url"], oVizType),
            // this property can contain a URL to a manifest that should be used instead of the
            // component's default manifest or a boolean or the manifest as object
            manifest: ObjectPath.get(["sap.platform.runtime", "componentProperties", "manifest"], oVizType),
            asyncHints: ObjectPath.get(["sap.platform.runtime", "componentProperties", "asyncHints"], oVizType)
        };

        var bIncludeVizType = ObjectPath.get(["sap.platform.runtime", "includeManifest"], oVizType);
        var bIncludeVizConfig = ObjectPath.get(["sap.platform.runtime", "includeManifest"], oVizConfig);

        if (bIncludeVizType || bIncludeVizConfig) {
            // the viz type already contains the component's complete manifest
            // so there is no need for the component factory to load it
            // the vizConfig can only be added to the manifest if there is a manifest
            oComponentConfiguration.manifest = deepExtend({}, oVizType, oVizConfig);
        }

        if (typeof oComponentConfiguration.manifest === "object" && oComponentProperties.manifest === true) {
            oComponentProperties.manifest = oComponentConfiguration.manifest;
        }

        return oComponentConfiguration;
    };

    /**
     * Extracts those properties from the visualization data that are passed to the
     * visualization component as component data.
     *
     * @returns {object} The properties for the component data.
     * @since 1.78
     */
    VizInstanceCdm.prototype._getComponentProperties = function () {
        return {
            title: this.getTitle(),
            subtitle: this.getSubtitle(),
            icon: this.getIcon(),
            info: this.getInfo(),
            indicatorDataSource: this.getIndicatorDataSource(),
            dataSource: this.getDataSource(),
            contentProviderId: this.getContentProviderId(),
            targetURL: this.getTargetURL(),
            displayFormat: this.getDisplayFormat(),
            numberUnit: this.getNumberUnit()
        };
    };

    /**
     * Updates the visible state of the component by calling tileSetVisible.
     * This method might not exist for some visualizations.
     *
     * @param {boolean} bVisible The visualization component's active state.
     *
     * @since 1.84.0
     * @private
     */
    VizInstanceCdm.prototype._setComponentTileVisible = function (bVisible) {
        if (this._oComponent && typeof this._oComponent.tileSetVisible === "function") {
            this._oComponent.tileSetVisible(bVisible);
        }
    };

    /**
     * Updates the tile's active state.
     * Inactive dynamic tiles do not send requests.
     *
     * @param {boolean} active The visualization's updated active state.
     * @param {boolean} refresh The visualization's updated refresh state.
     * @returns {sap.ushell.ui.launchpad.VizInstanceCdm} this to allow method chaining.
     * @since 1.78.0
     */
    VizInstanceCdm.prototype.setActive = function (active, refresh) {
        this._setComponentTileVisible(active);

        if (refresh) {
            this.refresh();
        }
        return this.setProperty("active", active, false);
    };

    /**
     * Updates the tile refresh state to determine if a tile needs to be updated.
     *
     * @since 1.78.0
     */
    VizInstanceCdm.prototype.refresh = function () {
        if (this._oComponent && typeof this._oComponent.tileRefresh === "function") {
            this._oComponent.tileRefresh();
        }
    };

    return VizInstanceCdm;
});
