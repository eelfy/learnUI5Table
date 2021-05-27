// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "./JourneyExecutor"
], function (JourneyExecutor) {
    "use strict";

    sap.ui.require([
        "opatests/userSettings/journeys/AboutDialog"
    ], JourneyExecutor.start.bind(this, {
        timeout: 30,
        viewNamespace: "sap.ushell.components.shell.Settings.userDefaults.view."
    }));
});
