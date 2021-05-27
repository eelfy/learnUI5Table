// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppComponentData.Controller.App", {
        // eslint-disable-next-line strict
        onInit: function () {
        },

        // eslint-disable-next-line strict
        onGetComponentData: function () {
            var oContainer = sap.ushell.Container,
                sCanonicalIntent,
                oView = this.getView(),
                oIntent = oView.byId("txtIntent").getValue();

            if (oIntent) {
                oContainer.getServiceAsync("URLParsing").then(function (URLParsing) {
                    sCanonicalIntent = URLParsing.constructShellHash(URLParsing.parseShellHash(oIntent));
                    if (!sCanonicalIntent) {
                        MessageToast.show("Please enter a valid intent", {duration: 5000});
                    } else {
                        oContainer.getServiceAsync("NavTargetResolution").then(function (NavTargetResolution) {
                            NavTargetResolution.resolveHashFragment("#" + sCanonicalIntent).then(function (oResult) {
                                oContainer.getServiceAsync("Ui5ComponentLoader").then(function (ui5ComponentLoader) {
                                    oResult.loadDefaultDependencies = false;
                                    ui5ComponentLoader.createComponentData(oResult).then(
                                        function(oComponentData) {
                                            oView.byId("txtComponentData").setValue(JSON.stringify(oComponentData));
                                        },
                                        function (oError) {
                                            oError = oError || "";
                                            jQuery.sap.log.error(
                                                "Cannot get UI5 component data: " + oError,
                                                oError.stack,
                                                "sap.ushell.services.CrossApplicationNavigation"
                                            );
                                        });
                                });
                            });
                        });
                    }
                });
            } else {
                MessageToast.show("Please enter a valid intent", {duration: 5000});
            }
        },

        // eslint-disable-next-line strict
        onCreateComponent: function () {
            var oView = this.getView();
            var oContainer = sap.ushell.Container;
            var oIntent = oView.byId("txtIntent").getValue();
            if (oIntent) {
                oContainer.getService("CrossApplicationNavigation").createComponentData(oView.byId("txtIntent").getValue()).then(function (oData) {
                    oContainer.getServiceAsync("Ui5ComponentLoader").then(function (ui5ComponentLoader) {
                        ui5ComponentLoader.instantiateComponent(oData).then(
                            function (oAppPropertiesWithComponentHandle) {
                                MessageToast.show("Component created successfully!", {duration: 5000});
                            },
                            function (oError) {
                                MessageToast.show("An error occurred while trying to create component...", {duration: 5000});
                            });
                    });
                });
            } else {
                MessageToast.show("Please enter a valid intent", {duration: 5000});
            }
        }
    });
});
