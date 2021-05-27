// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "./arrangements/Setup",
    "./arrangements/Teardown",
    "sap/base/util/deepExtend"
], function (Opa5, Setup, Teardown, fnDeepExtend) {
    "use strict";
    /* global QUnit */

    var JourneyExecutor = {};

    /**
     * Automatically load & execute a journey by specifing the following HTML
     * attributes on the script element with id="sap-ui-bootstrap":
     *   - data-sap-ui-oninit="module:sap/ushell/opa/JourneyExecutor"
     *   - data-sap-ui-resourceroots='{"journey": "path/to/your/journey"}'
     *
     * To specify a custom OPA config use the HTML attribute "data-sap-ushell-qunitConfig".
     */
    sap.ui.require(["journey"],
        function () {
            var oCustomConfig = document.getElementById("sap-ui-bootstrap").getAttribute("data-sap-ushell-qunitConfig");
            JourneyExecutor.start(oCustomConfig);
        },
        function () {
            console.warn("No 'data-sap-ui-resourceroots' called 'journey' was specified. You need to start the Journey manually using 'JourneyExecutor.start()'.");
        }
    );

    /**
     * Starts the OPA/Qunit test suite.
     * The function is used to manually start the JourneyExecutor without
     * the definition of data-sap-ui-oninit="module:sap/ushell/opa/JourneyExecutor".
     *
     * @param {object} [customConfig] Configuration object which can be set to overwrite the default OPA config.
     *
     * @private
     * @since 1.76.0
     */
    JourneyExecutor.start = function (customConfig) {
        var oDefaultOPAConfig = {
            arrangements: new Setup(),
            assertions: new Teardown(),
            autoWait: true,
            timeout: 120,
            asyncPolling: true
        };

        var oOPAConfig = fnDeepExtend(oDefaultOPAConfig, customConfig);

        Opa5.extendConfig(oOPAConfig);
        QUnit.start();
    };

    return JourneyExecutor;
});