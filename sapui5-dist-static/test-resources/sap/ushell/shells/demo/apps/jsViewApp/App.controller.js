// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/*global jQuery, sap, window */
sap.ui.controller("shells.demo.apps.jsViewApp.App", {

    onInit: function () {
        this.fullWidth = true;
    },

    onChaneLetterBoxing : function() {
        sap.ushell.services.AppConfiguration.setApplicationFullWidth(!this.fullWidth);
        this.fullWidth = !this.fullWidth;
    }
});