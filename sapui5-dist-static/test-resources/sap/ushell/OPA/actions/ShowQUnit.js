// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * Shows the qunit runner. This might be useful for testing focus handling.
 * Unfortunately the qunit runner contains tabbable elements which disturb
 * focus handling tests.
 */
sap.ui.define([
    "sap/ui/test/actions/Action"
], function (Action) {
    "use strict";

    return Action.extend("sap.ushell.opa.actions.ShowQUnit", {
        metadata: {},
        executeOn: function () {
            var oDomRef = document.getElementById("qunit");
            if (oDomRef) {
                oDomRef.style.display = "inherit";
            }
        }
    });

}, true);