// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * This is a OPA page which should be valid for any scenario.
 */
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/actions/PressF6",
    "sap/ushell/opa/actions/ShowQUnit",
    "sap/ushell/opa/actions/HideQUnit"
], function (Opa5, PressF6, ShowQUnit, HideQUnit) {
    "use strict";

    Opa5.createPageObjects({
        onTheBrowser: {
            actions: {
                iPressF6: function () {
                    return this.waitFor({
                        actions: new PressF6()
                    });
                },
                iPressShiftF6: function () {
                    return this.waitFor({
                        actions: new PressF6({
                            shift: true
                        })
                    });
                },
                iHideQUnit: function () {
                    return this.waitFor({
                        actions: new HideQUnit()
                    });
                },
                iShowQUnit: function () {
                    return this.waitFor({
                        actions: new ShowQUnit()
                    });
                }
            },
            assertions: {}
        }
    });
});