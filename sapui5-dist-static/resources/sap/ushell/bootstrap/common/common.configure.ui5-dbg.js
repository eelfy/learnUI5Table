// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "./common.boot.task",
    "./common.load.launchpad",
    "./common.read.ui5theme.from.config"
], function (Log, fnBootTask, fnLoadLaunchpadContent, fnGetUi5theme) {
    "use strict";

    return configureUI5Settings;

    /**
     * Given a map of settings, this functions applies UI5 relevant settings.
     *
     * This module allows to configure SAPUI5 via the bootstrap configuration. Several properties are static,
     * the rest is dynamic as descibed in the oSettings parameter:
     * @param {object} oSettings A collection of settings
     * @param {string} oSettings.platform - the platform to boot the shell with
     * @param {object} oSettings.libs - the libraries to configure UI5 with
     * @param {object} oSettings.ushellConfig - the ushell configuration object
     * @param {string} [oSettings.theme] - the theme to boot UI5 with, if not provided the theme from ushell config is used
     * @param {function} [oSettings.bootTask] - the function to bind to the boottask of UI5
     * @param {function} [oSettings.onInitCallback] - the function to bind to the UI5 CORE onInit event
     *
     * @returns {function} this functions applies UI5 relevant settings.
     * @private
     */
    function configureUI5Settings (oSettings) {
        if (!oSettings || !oSettings.libs || !Array.isArray(oSettings.libs)) {
            Log.error("Mandatory settings object not provided", null, "sap/ushell/bootstap/common/common.configure.ui5");
            return {};
        }

        var oSAPUIConfig = window["sap-ui-config"] || {},
            sUshellBootstrapPlatform = oSettings && oSettings.platform,
            oUshellConfig = oSettings.ushellConfig,
            sUi5Theme = oSettings.theme ? oSettings.theme : fnGetUi5theme(oUshellConfig).theme; // fallback theme if no user-specific or default theme is defined

        if (oUshellConfig && oUshellConfig.modulePaths) {
            var oModules = Object.keys(oUshellConfig.modulePaths).reduce(function (result, sModulePath) {
                result[sModulePath.replace(/\./g, "/")] = oUshellConfig.modulePaths[sModulePath];
                return result;
            }, {});
            sap.ui.loader.config({
                paths: oModules
            });
        }

        // TODO: global configuration variable might not be evaluated
        // at this point in time; check if we can use explicit API calls instead
        oSAPUIConfig.bindingsyntax = "complex"; // shouldn't this be "bindingSyntax" (uppercase "S")?
        oSAPUIConfig.preload = "async";
        oSAPUIConfig.compatversion = "1.16";
        oSAPUIConfig.libs = oSettings.libs.join(); // add dynamic libs from ushell config e.g. ushell_abap
        oSAPUIConfig.theme = sUi5Theme;
        oSAPUIConfig["xx-boottask"] = oSettings.bootTask || fnBootTask.bind(null, sUshellBootstrapPlatform);
        oSAPUIConfig.oninit = oSettings.onInitCallback || fnLoadLaunchpadContent;

        return oSAPUIConfig;
    }
});
