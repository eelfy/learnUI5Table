// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    // =======================================================================
    // suggestion provider base class
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = {

        init: function (params) {
            jQuery.extend(this, params);
        },

        abortSuggestions: function () {},

        getSuggestions: function () {}

    };

    return module;
});
