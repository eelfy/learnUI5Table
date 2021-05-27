sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function (Controller) {
    'use strict';
    return Controller.extend("sap.ushell.demoapps.WelcomeApp.controller.Main", {
        onInit: function() {
            sap.ushell.services.AppConfiguration.setApplicationFullWidth(true);
        },

        onHomePress: function () {
            sap.ushell.Container
                .getService("CrossApplicationNavigation")
                .toExternal( { target : { shellHash : "#" }});
        },
        onFinderPress: function () {
            sap.ushell.Container
                .getService("CrossApplicationNavigation")
                .toExternal( { target : { shellHash : "#Shell-appfinder" }});
        },

        onInputSubmit: function (oEvt) {
            
        },
        onSpacePress: function (oEvt) {
            var oIntent = oEvt.getSource().getCustomData()[0].getValue()
            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oCANService) {
                var oParams = {};
                oIntent.parameters.forEach(function (oParameter) {
                    if (oParameter.name && oParameter.value) {
                        oParams[oParameter.name] = [oParameter.value];
                    }
                });

                oCANService.toExternal({
                    target: {
                        semanticObject: oIntent.semanticObject,
                        action: oIntent.action
                    },
                    params: oParams
                });
            });
        },

        onItemPress: function (oEvt) {
            var sIntent = oEvt.getSource().getCustomData()[0].getValue()
            sap.ushell.Container
                .getService("CrossApplicationNavigation")
                .toExternal( { target : { shellHash : sIntent }});
        },

        onSuggestionSelect: function (oEvt) {
            var sIntent = oEvt.getParameter("selectedItem").getKey();
            sap.ushell.Container
                .getService("CrossApplicationNavigation")
                .toExternal( { target : { shellHash : sIntent }});
        }

    });
});