sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/theming/Parameters'
], function (UIComponent, JSONModel, ThemingParameters) {
    'use strict';

    function getIconURI (ico) { // the icon may be "none" or "url('xxxxx')", return null or xxxxx
        var match = /url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(ico);
        return match ? match[1] : null;
    }
    return UIComponent.extend("sap.ushell.demoapps.WelcomeApp.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            var oModel = new JSONModel();
            var that = this;
            var sUserName = sap.ushell.Container.getUser().getFullName();
            oModel.setProperty("/userName", sUserName);
            var sIcon = getIconURI(ThemingParameters.get("sapUiGlobalLogo")) || jQuery.sap.getModulePath("sap.ushell") + '/themes/base/img/sap_55x27.png';


            // normalizes data and get things like subtitle, icon and son on....
            function normalizeHistory(aActivity, iElems) {
                function filter(elem) {
                    return elem.title != "Home of S4";
                }
                aActivity = aActivity.filter(filter)
                aActivity = aActivity.slice(0,iElems);
                return aActivity.map( function(elem) {
                    return oCrossAppService.getLinks(oURLParsing.parseShellHash(elem.url))
                })
            };
            oModel.setProperty("/iconPath", sIcon);
            var oUserRecentsSrv = sap.ushell.Container.getServiceAsync("UserRecents"),
                oCrossAppService = sap.ushell.Container.getService("CrossApplicationNavigation"),
                oURLParsing = sap.ushell.Container.getService("URLParsing"),
                oMenuService = sap.ushell.Container.getService("Menu");
            // get recent data:
            oUserRecentsSrv.then(function (userRecents) {

                userRecents.getRecentActivity().then( function (aActivity) {
                    Promise.all(normalizeHistory(aActivity, 8)).then( function(aActivities) {
                        oModel.setProperty("/recents", aActivities.flat());
                    })
                });
                userRecents.getFrequentActivity().then( function (aActivity) {
                    Promise.all(normalizeHistory(aActivity, 4)).then( function(aActivities) {
                        oModel.setProperty("/frequents", aActivities.flat());
                    })
                })
            });

            // get spaces
            oMenuService.getMenuEntries().then( function(aEntries) {
                function filter(elem) {
                    return elem.title != "HOME"
                };
                oModel.setProperty("/spaces", aEntries.filter(filter));
            })
            /*
            var oHomeGroup = sap.ushell.Container.getService("LaunchPage").getDefaultGroup();
            oHomeGroup.then( function (oGroup){
                var aTiles = oGroup.payload.tiles.reduce( function (last, current) {
                    last.push({
                        title: sap.ushell.Container.getService("LaunchPage").getTileTitle(current),
                        target: sap.ushell.Container.getService("LaunchPage").getTileTarget(current)
                    });
                    return last;
                },[]);
                oModel.setProperty("/homeGroup", aTiles);
            });
*/
            var oCrossAppService = sap.ushell.Container.getService("CrossApplicationNavigation");
            oCrossAppService.getLinks().then( function (oLinks) {
                oModel.setProperty("/allApps", oLinks);
            });

            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(oModel);
        }

    });
});