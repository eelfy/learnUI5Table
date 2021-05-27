// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/*global sap, jQuery */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend(
        "sap.ushell.demo.app5ContentProviderB.App",
        {
            onInit : function () {
                this.model = new JSONModel({
                    contentProviderId: "Loading..."
                });
                this.getView().setModel(this.model);

                this.setContentProviderId();
            },
            setContentProviderId: function () {
                var oModel = this.model;

                sap.ushell.Container.getServiceAsync("AppLifeCycle")
                    .then(function (oService) {
                        oService.attachAppLoaded(null, function (oEvent) {
                            oEvent.getParameters().getSystemContext().then(function (oSystemContext) {
                                oModel.setProperty("/contentProviderId", oSystemContext.id);
                            });
                        });
                    });
            },
            navigate: function (sHash) {
                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation")
                    .then(function (oService) {
                        oService.toExternal({
                            target: {
                                shellHash: sHash
                            }
                        });
                    });
            }
        }
    );
});
