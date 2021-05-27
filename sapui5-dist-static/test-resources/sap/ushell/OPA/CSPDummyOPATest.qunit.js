// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "./JourneyExecutor",
    "sap/ui/test/opaQunit"
], function (Opa5, JourneyExecutor, opaTest) {
    "use strict";
    sap.ui.require([], JourneyExecutor.start.bind(this, {}));

    opaTest("CSP Dummy OPA Test", function () {
        Opa5.assert.ok(true, "Passed Dummy OPA Test");
    });
});
