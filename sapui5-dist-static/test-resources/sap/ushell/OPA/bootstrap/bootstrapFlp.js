// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/* global */
sap.ui.define([
    "sap/ushell/bootstrap/cdm/cdm.constants",
    "sap/ushell/bootstrap/common/common.boot.task",
    "sap/ushell/bootstrap/common/common.load.launchpad",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/Config",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/deepClone"
], function (oCdmConstants, fnBootTask, fnLoadLaunchpad, Utils, Config, CommonCreateConfigcontract, JSONModel, fnDeepClone) {
    "use strict";

    var BootstrapFlp = {};

    /**
     * Returns the parsed json for a specified path.
     *
     * @param {string} path The path to certain json file.
     *
     * @returns {Promise<object>} A promise which resolves with the parsed json.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._loadConfiguration = function (path) {
        return new Promise(function (fnResolve) {
            var oModel = new JSONModel(path);
            oModel.attachRequestCompleted(function () {
                fnResolve(oModel.getData());
            });
        });
    };

    /**
     * Registers a new configuration in sap.ushell.Config.
     *
     * @param {object} configuration The configuration which should overwrite the currently active one.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._applyConfiguration = function (configuration) {
        Config._reset();
        Config.registerConfiguration(null, CommonCreateConfigcontract.createConfigContract(configuration));
    };

    /**
     * Destroys UI5 controls.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp._cleanupControlInstances = function () {
        var fnDestroy = function (sId) {
            var oControl = sap.ui.getCore().byId(sId);
            if (oControl) {
                oControl.destroy();
            }
        };

        fnDestroy("userProfilingView");
        fnDestroy("defaultParametersSelector");
        fnDestroy("userSettingsDialog");
        fnDestroy("aboutBtn");
        fnDestroy("userPrefThemeSelector");
        fnDestroy("detailuserPrefThemeSelector");

        jQuery("#sapUshellFloatingContainerWrapper").remove();

        //MeArea
        fnDestroy("sapUshellMeAreaPopover");
        fnDestroy("logoutBtn");
        fnDestroy("openCatalogBtn");
        fnDestroy("userSettingsBtn");
        fnDestroy("ActionModeBtn");

        //header
        fnDestroy("homeBtn");
        fnDestroy("backBtn");
        fnDestroy("endItemsOverflowBtn");
        fnDestroy("openCatalogBtn");
        fnDestroy("ContactSupportBtn");
        fnDestroy("EndUserFeedbackBtn");
    };

    /**
     * Merges the configuration and creates the FLP renderer.
     *
     * @param {("cdm"|"local")} adapter The adapter to be used.
     * @param {string} defaultConfigPath The path to the default configuration json.
     * @param {(string|object)} [ushellConfig]
     *  The UShell configuration. Either provide a path to a json file
     *  containing the config which gets loaded automatically
     *  or directly pass a configuration object.
     *
     * @returns {Promise} A Promise which resolves as soon as the FLP is bootstrapped.
     *
     * @since 1.76.0
     * @private
     */
    BootstrapFlp.init = function (adapter, defaultConfigPath, ushellConfig) {
        var oAdapterConstants = {};

        // In the future we also want to include the abap constants.
        // This currently doesn't work as it breaks the safetynet. ushell_abap resources aren't loaded there.
        if (adapter === "cdm") {
            oAdapterConstants = oCdmConstants.defaultConfig;
        }

        if (!this._oBootstrapFinished) {
            // sap.ushell.Container must be deleted to allow the boot-task to properly start.
            // If this does not happen, not all launchpad services will be recovered correctly
            delete sap.ushell.Container;
            this._oBootstrapFinished = new Promise(function (fnResolve) {
                this._getConfiguration(defaultConfigPath, oAdapterConstants, ushellConfig).then(function (oConfiguration) {
                    window["sap-ushell-config"] = oConfiguration;
                    fnBootTask(adapter, function () {
                        // Clear the personalization for a clean sandbox
                        sap.ushell.Container.getService("Personalization").delPersonalizationContainer("flp.settings.FlpSettings");
                        this._applyConfiguration(oConfiguration);
                        fnResolve();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
        return this._oBootstrapFinished;
    };

    /**
     * Merges the provided bootstrap config with platform defaults, further overrides can be done via the init method.
     *
     * @param {string} defaultConfigPath The path to the default configuration json.
     * @param {object} defaultConstants The adapter constants json to be used.
     * @param {(string|object)} [ushellConfig]
     *  The UShell configuration. Either provide a path to a json file
     *  containing the config which gets loaded automatically
     *  or directly pass a configuration object.
     *
     * @returns {Promise} A promise which resolves after the configuration was applied.
     *
     * @since 1.76.0
     * @private
     */
    BootstrapFlp._getConfiguration = function (defaultConfigPath, defaultConstants, ushellConfig) {
        var oDefaultConstants = fnDeepClone(defaultConstants);
        var oDefaultConfigPormise = this._loadConfiguration(defaultConfigPath);
        var oUshellConfigPromise = Promise.resolve();

        if (ushellConfig) {
            if (typeof ushellConfig === "string") {
                oUshellConfigPromise = this._loadConfiguration(ushellConfig);
            } else {
                oUshellConfigPromise = Promise.resolve(ushellConfig);
            }
        }

        return Promise.all([oDefaultConfigPormise, oUshellConfigPromise]).then(function (aConfigs) {
            Utils.mergeConfig(oDefaultConstants, aConfigs[0], true);
            Utils.mergeConfig(oDefaultConstants, aConfigs[1], true);

            return oDefaultConstants;
        });
    };

    /**
     * Calls init and places the Launchpad in the DOM
     *
     * @param {string} domId The id where to place the Launchpad.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp.placeAt = function (domId) {
        this.init().then(fnLoadLaunchpad.bind(null, domId));
    };

    /**
     * Cleans up.
     *
     * @private
     * @since 1.76.0
     */
    BootstrapFlp.exit = function () {
        this._oBootstrapFinished = null;
        sap.ushell.Container.getRenderer("fiori2").destroy();
        sap.ui.getCore().getEventBus().destroy();
        this._cleanupControlInstances();
        if (window.hasher && window.hasher.setHash) {
            window.hasher.setHash("Shell-home");
        }

        // reset HashChanger to avoid broken FLP flow with next bootstrap
        var oNewHashChangerInstance = new sap.ui.core.routing.HashChanger();
        sap.ui.core.routing.HashChanger.replaceHashChanger(oNewHashChangerInstance);

        // reset central model
        if (sap.ushell.bootstrap && sap.ushell.bootstrap.common && sap.ushell.bootstrap.common.common.load.model) {
            sap.ushell.bootstrap.common.common.load.model._resetModel();
        }
    };

    return BootstrapFlp;
});
