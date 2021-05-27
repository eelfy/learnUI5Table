// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/JSView",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/components/CatalogsManager",
    "sap/ushell/resources",
    "sap/ushell/Config",
    "sap/ushell/bootstrap/common/common.load.model",
    "sap/ushell/components/SharedComponentUtils",
    "sap/base/util/UriParameters"
], function (
    UIComponent,
    JSView,
    hasher,
    CatalogsManager,
    resources,
    Config,
    oModelWrapper,
    oSharedComponentUtils,
    UriParameters
) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.appfinder.Component", {

        metadata: {
            manifest: "json",
            library: "sap.ushell"
        },

        parseOldCatalogParams: function (sUrl) {
            var mParameters = new UriParameters(sUrl).mParams;
            var sValue,
                sKey;

            for (sKey in mParameters) {
                if (mParameters.hasOwnProperty(sKey)) {
                    sValue = mParameters[sKey][0];
                    mParameters[sKey] = sValue.indexOf("/") !== -1 ? encodeURIComponent(sValue) : sValue;
                }
            }
            return mParameters;
        },

        handleNavigationFilter: function (sNewHash) {
            var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sNewHash);
            var mParameters;

            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sNewHash);
                setTimeout(function () {
                    this.getRouter().navTo("catalog", {filters: JSON.stringify(mParameters)});
                }.bind(this), 0);
                return this.oShellNavigation.NavigationFilterStatus.Abandon;
            }
            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },

        createContent: function () {
            // model instantiated by the model wrapper
            this.oModel = oModelWrapper.getModel();
            this.setModel(this.oModel);

            // Model defaults are set now --- let`s continue.

            var sHash,
                oShellHash,
                mParameters,
                oComponentConfig;
            var bPersonalizationActive = Config.last("/core/shell/enablePersonalization");

            if (bPersonalizationActive) {
                // trigger the reading of the homepage group display personalization
                // this is also needed when the app finder starts directly as the tab mode disables
                // the blind loading which is already prepared in the homepage manager
                oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");
            }

            this.oCatalogsManager = new CatalogsManager("dashboardMgr", {
                model: this.oModel
            });

            this.setModel(resources.i18nModel, "i18n");

            oSharedComponentUtils.toggleUserActivityLog();

            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

            //handle direct navigation with the old catalog intent format
            sHash = hasher.getHash();
            oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sHash);
            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sHash);
                oComponentConfig = this.getMetadata().getConfig();

                this.oShellNavigation.toExternal({
                    target: {
                        semanticObject: oComponentConfig.semanticObject,
                        action: oComponentConfig.action
                    }
                });

                this.getRouter().navTo("catalog", {
                    filters: JSON.stringify(mParameters)
                });
            }

            return sap.ui.view({
                id: "appFinderView",
                viewName: "sap.ushell.components.appfinder.AppFinder",
                type: "JS",
                async: true
            });
        },

        destroy: function () {
            UIComponent.prototype.destroy.apply(this);

            this.oCatalogsManager.destroy();
        }
    });

});
