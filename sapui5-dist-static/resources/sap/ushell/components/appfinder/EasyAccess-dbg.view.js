// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/library",
    "sap/m/SplitApp",
    "sap/ushell/resources"
], function (coreLibrary, SplitApp, resources) {
    "use strict";

    // shortcut for sap.ui.core.mvc.ViewType
    var ViewType = coreLibrary.mvc.ViewType;

    sap.ui.jsview("sap.ushell.components.appfinder.EasyAccess", {
        BUSY_INDICATOR_DELAY: 1000,

        createContent: function (oController) {
            this.oResourceBundle = resources.i18n;

            this.setModel(this.getViewData().easyAccessSystemsModel, "easyAccessSystemsModel");
            this.setModel(this.getViewData().subHeaderModel, "subHeaderModel");
            this.setModel(this.getViewData().parentComponent.getModel());

            /*
             * Initialize split app master view.
             */
            this.hierarchyFolders = sap.ui.view({
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.HierarchyFolders",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController),
                    easyAccessSystemsModel: this.getModel("easyAccessSystemsModel"),
                    subHeaderModel: this.getModel("subHeaderModel")
                }
            });

            this.hierarchyFolders.setBusyIndicatorDelay(this.BUSY_INDICATOR_DELAY);
            this.hierarchyFolders.addStyleClass("sapUshellHierarchyFolders");

            var oViewData = this.getViewData();

            /*
             * Initialize split app details view.
             */
            this.hierarchyApps = new sap.ui.view(this.getId() + "hierarchyApps", {
                type: ViewType.JS,
                viewName: "sap.ushell.components.appfinder.HierarchyApps",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController),
                    menuName: oViewData.menuName
                }
            });
            this.hierarchyApps.setBusyIndicatorDelay(this.BUSY_INDICATOR_DELAY);

            /*
             * Setup split app
             */
            this.splitApp = new SplitApp({
                masterPages: this.hierarchyFolders,
                detailPages: this.hierarchyApps
            });
            this.splitApp.setInitialMaster(this.hierarchyFolders);
            this.splitApp.setInitialDetail(this.hierarchyApps);

            return this.splitApp;
        },

        getControllerName: function () {
            return "sap.ushell.components.appfinder.EasyAccess";
        }
    });
});
