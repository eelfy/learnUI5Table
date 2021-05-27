// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer",
    "sap/ushell/appRuntime/ui5/ui/UIProxy"
], function (oContainer, AppRuntimeService, Renderer, UIProxy) {
    "use strict";

    function ContainerProxy () {
        var oAdapter,
            fnOrgSetDirtyFlag;

        this.bootstrap = function (sPlatform, mAdapterPackagesByPlatform) {
            return sap.ushell.bootstrap(sPlatform, mAdapterPackagesByPlatform).then(function (Container) {
                fnOrgSetDirtyFlag = sap.ushell.Container.setDirtyFlag;
                oAdapter = sap.ushell.Container._getAdapter();

                //get indication if we are in App Runtime
                sap.ushell.Container.inAppRuntime = function () {
                    return true;
                };
                //for backward computability
                sap.ushell.Container.runningInIframe = sap.ushell.Container.inAppRuntime;

                //override setDirtyFlag for delegation.
                sap.ushell.Container.setDirtyFlag = function (bIsDirty) {
                    //set local isDirty flage, so that it will reflet the real dirty state.
                    fnOrgSetDirtyFlag(bIsDirty);

                    //reflect the changes to the outer shell.
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.ShellUIService.setDirtyFlag", {
                            "bIsDirty": bIsDirty
                        });
                };

                sap.ushell.Container.getFLPUrl = function (bIncludeHash) {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPUrl", {
                            "bIncludeHash": bIncludeHash
                        });
                };

                sap.ushell.Container.getRenderer = function () {
                    return Renderer;
                };

                sap.ushell.Container.logout = function () {
                    return oAdapter.logout();
                };
            });
        };
    }

    return new ContainerProxy();
}, true);
