// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for standalone demos.
 *
 * @version 1.88.1
 */
(function () {
    "use strict";

    window['sap-ui-config'] = {
        "xx-bootTask": function (fnCallback) {
            var oUi5ComponentLoaderConfig;

            sap.ui.loader.config({
                paths: {
                    "sap/ushell/shells/demo": ".",
                    "sap/ushell/adapters/local/searchResults": "./searchResults" // TODO: quick fix for search adapter test data
                }
            });

            //Load configuration for fiori demo
            var urlParams = window.getUrlParams()["demoConfig"];
            var demoConfig = decodeURIComponent(urlParams || "fioriDemoConfig");

            jQuery.sap.require("sap.ushell.shells.demo." + demoConfig.split("#")[0]);

            var oUshellConfig = window["sap-ushell-config"];
            // by default we disable the core-ext-light loading for the sandbox
            oUi5ComponentLoaderConfig = jQuery.sap.getObject("services.Ui5ComponentLoader.config",
                0, oUshellConfig);
            if (!oUi5ComponentLoaderConfig.hasOwnProperty("amendedLoading")) {
                oUi5ComponentLoaderConfig.amendedLoading = false;
            }

            if (oUshellConfig && oUshellConfig.modulePaths) {
                var oModules = Object.keys(oUshellConfig.modulePaths).reduce(function (result, sModulePath) {
                    result[sModulePath.replace(/\./g, "/")] = oUshellConfig.modulePaths[sModulePath];
                    return result;
                }, {});
                sap.ui.loader.config({
                    paths: oModules
                });
            }

            // tell SAPUI5 that this boot task is done once the container has loaded
            sap.ui.require(["sap/ushell/services/Container"], function () {
                sap.ushell.bootstrap("local").done(fnCallback);
            });
        }
    };
}());
