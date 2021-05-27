// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/* global */

sap.ui.define([], function () {
    "use strict";

    // =======================================================================
    // personalizer
    // =======================================================================
    var Personalizer = function () {
        this.init.apply(this, arguments);
    };

    Personalizer.prototype = {

        init: function (key, personalizationStorageInstance) {
            this.key = key;
            this.personalizationStorageInstance = personalizationStorageInstance;
        },

        getKey: function () {
            return this.key;
        },

        setPersData: function (data) {
            return (new jQuery.Deferred()).resolve(this.personalizationStorageInstance.setItem(this.key, data));
        },

        getPersData: function () {
            return (new jQuery.Deferred()).resolve(this.personalizationStorageInstance.getItem(this.key));
        }
    };

    return Personalizer;
});
