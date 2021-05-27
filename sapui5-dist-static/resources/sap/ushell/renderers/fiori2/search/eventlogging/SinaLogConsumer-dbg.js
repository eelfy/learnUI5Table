// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/* global */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer'
], function (EventConsumer) {
    "use strict";

    // =======================================================================
    // SinaLogConsumer
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = jQuery.extend(new EventConsumer(), {

        init: function (sinaNext) {
            this.sinaNext = sinaNext;
        },

        logEvent: function (event) {
            this.sinaNext.logUserEvent(event);
        }

    });

    return module;
});
