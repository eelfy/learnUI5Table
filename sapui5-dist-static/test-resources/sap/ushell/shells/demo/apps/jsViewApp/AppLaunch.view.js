// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap */


    sap.ui.jsview("shells.demo.apps.jsViewApp.AppLaunch", {
        /**
         * Note: There is no controller for this view!
         */
        createContent : function () {
            return sap.ui.view({
                id: "letterBoxing",
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "shells.demo.apps.jsViewApp.App",
            });
        }
    });
}());
