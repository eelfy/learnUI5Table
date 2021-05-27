// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/localService/Mockserver",
    "sap/ushell/EventHub",
    "sap/ushell/opa/bootstrap/bootstrapFlp"
], function (Opa5, Mockserver, EventHub, BootstrapFlp) {
    "use strict";

    function setupDomForFLP () {
        // This class is added to let the OPA page look nicer. Otherwise the launchpad would overlay the OPA page
        // it is removed in the tear down step. It should be called when the UI component is started.
        document.body.classList.add("sapUiOpaFLP");
    }

    var aLoadedSteps = [];

    function schedulerMockSetup () {
        // Currently, the only problem is initMessagePopover.
        // Caution: any step loaded with byEvent could potentially need a mock in here!

        var aStepsNeedingAnUpdate = [{
            eventName: "initMessagePopover",
            stepName: "MessagePopoverInit"
        }];

        var oCurrentStep;
        for (var i = 0; i < aStepsNeedingAnUpdate.length; i++) {
            oCurrentStep = aStepsNeedingAnUpdate[i];

            if (aLoadedSteps.indexOf(oCurrentStep.stepName) !== -1) {
                EventHub.once(oCurrentStep.eventName).do(function () {
                    EventHub.emit("StepDone", oCurrentStep.stepName);
                });
            } else {
                aLoadedSteps.push(oCurrentStep.stepName);
            }
        }
    }

    return Opa5.extend("sap.ushell.opa.arrangements.Arrangement", {
        /**
         * Starts the FLP using the provided config inside the "sap.ushell.opa.bootstrap"
         * UI5 Component.
         *
         * @param {("cdm"|"abap")} backend The backend technology on which the FLP runs.
         * @param {(string|object)} [ushellConfig]
         *  The UShell configuration. Either provide a path to a json file
         *  containing the config which gets loaded automatically
         *  or directly pass a configuration object.
         * @param {("spaces"|"classic")} [mode]
         *  The type of the config to be loaded.
         *  Can be either "spaces" or "classic". If nothing is provided default is "classic"
         *
         * @returns {jQuery.Deferred} A promise which is resolved as soon as the component is rendered.
         *
         * @private
         */
        iStartMyFLP: function (backend, ushellConfig, mode) {
            var config = ushellConfig || {};
            var type = mode || "classic";

            // We need to be sure that the Scheduling Agent works even if some parts of the FLP are already loaded
            // due to an earlier iteration of OPA

            this._mockSchedule();

            var oBackendAdapters = {
                cdm: "cdm",
                abap: "local"
            };

            var oConfigurationForMode = {
                classic: "../OPA/bootstrap/config/cdmClassic.json",
                spaces: "../OPA/bootstrap/config/abapSpaces.json"
            };

            return this.iStartMyUIComponent({
                componentConfig: {
                    name: "sap.ushell.opa.bootstrap",
                    componentData: {
                        adapter: oBackendAdapters[backend],
                        ushellConfig: config,
                        defaultConfig: oConfigurationForMode[type]
                    }
                }
            }).then(setupDomForFLP);
        },

        /**
         * Initializes a new UI5 mockserver.
         *
         * @param {string} rootUri See: "sap.ushell.opa.localService.Mockserver#init"
         * @param {object} mockedRoutes See: "sap.ushell.opa.localService.Mockserver#init"
         * @param {object} simulationOverwrites See: "sap.ushell.opa.localService.Mockserver#init"
         *
         * @returns {object} The mockserver instance which was started.
         *
         * @private
         * @since 1.76.0
         */
        iStartMyMockServer: function (rootUri, mockedRoutes, simulationOverwrites) {
            return Mockserver.init(rootUri, mockedRoutes, simulationOverwrites);
        },

        /**
         * Overwrite the current UShell config (sap.ushell.Config)
         *
         * @param {object} configuration The configuration which should overwrite the currently active one.
         *
         * @private
         * @since 1.76.0
         */
        iChangeMyFLPConfiguration: function (configuration) {
            this.iWaitForPromise(BootstrapFlp.applyConfiguration(configuration));
        },

        _mockSchedule: schedulerMockSetup
    });
});
