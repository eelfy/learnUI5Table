// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ushell/opa/localService/Mockserver",
    "sap/ushell/EventHub",
    "sap/ui/util/Storage"
], function (Opa5, Mockserver, EventHub, Storage) {
    "use strict";

    function teardownDomForFLP () {
        if (sap.ushell.components.homepage && sap.ushell.components.homepage.getDashboardGroupsBox) {
            delete sap.ushell.components.homepage.getDashboardGroupsBox;
        }
        document.body.classList.remove("sapUiOpaFLP");
        var FLPScheduler = sap.ui.require("sap/ushell/bootstrap/_SchedulingAgent/FLPScheduler");
        FLPScheduler.oSchedule.aBlocksLoading = [];
    }


    return Opa5.extend("sap.ushell.opa.arrangements.Teardown", {
        iTeardownMyFLP: function (oConfig) {
            return this.iTeardownMyUIComponent()
                .then(teardownDomForFLP)
                .then(Mockserver.destroyAll)
                .then(EventHub._reset)
                .then(this._handleTeardownConfig.bind(this, oConfig));
        },

        _handleTeardownConfig: function (oConfig) {
            var bDeletePersonalization = true;

            if (oConfig && oConfig.deletePersonalization === false) {
                bDeletePersonalization = false;
            }

            if (bDeletePersonalization) {
                sap.ushell.Container.getService("Personalization").delPersonalizationContainer("sap.ushell.cdm3-1.personalization");
                sap.ushell.Container.getService("Personalization").delPersonalizationContainer("sap.ushell.cdm.personalization");
            }
        }
    });


});
