// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/* global */

sap.ui.define([], function () {
    "use strict";

    // =======================================================================
    // EventConsumer (base class for all consumers)
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = {

        init: function () {

        },

        logEvent: function (event) {
            // to be implemented in subclass
        }

    };

    return module;
});
