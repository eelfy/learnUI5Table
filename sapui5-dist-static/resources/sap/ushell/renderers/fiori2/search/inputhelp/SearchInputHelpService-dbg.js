// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    // ensure namespace exists
    sap.ushell = sap.ushell || {};
    sap.ushell.renderers = sap.ushell.renderers || {};
    sap.ushell.renderers.fiori2 = sap.ushell.renderers.fiori2 || {};
    sap.ushell.renderers.fiori2.search = sap.ushell.renderers.fiori2.search || {};
    sap.ushell.renderers.fiori2.search.inputhelp = sap.ushell.renderers.fiori2.search.inputhelp || {};

    var SearchInputHelpService = sap.ushell.renderers.fiori2.search.inputhelp.SearchInputHelpService = {};
    jQuery.extend(SearchInputHelpService, {

        init: function (callback) {

            return sap.ui.require([
                "sap/ushell/renderers/fiori2/search/container/ComponentService"
            ], function (ComponentService) {
                //init search services
                ComponentService.init();

                sap.ui.require([
                    "sap/ushell/renderers/fiori2/search/personalization/PersonalizationStorage",
                    "sap/ushell/renderers/fiori2/search/SearchModel"
                ], function (PersonalizationStorage, SearchModel) {

                    //init Personalization Storage Service
                    PersonalizationStorage.getInstance();

                    callback();
                });
            });
        },

        init4View: function (oView) {

            this.init(function () {
                var searchModel = oView.getModel("searchModel");
                if (!searchModel) {
                    searchModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
                    oView.setModel(searchModel, "searchModel");
                }
                searchModel.isSearchInputHelp = true;

                oView.searchInputHelp = sap.ui.getCore().byId(oView.getId() + "--searchInputHelp");
                oView.searchInputHelp.setModel(searchModel);
                searchModel.setProperty("/inputHelp", oView.searchInputHelp);

                searchModel.initBusinessObjSearch().then(function () {
                    if (oView.searchInputHelp.getDataSource()) {
                        oView.searchInputHelp.selectDataSource();
                    }
                });
            });
        }

    });
    return SearchInputHelpService;
});
