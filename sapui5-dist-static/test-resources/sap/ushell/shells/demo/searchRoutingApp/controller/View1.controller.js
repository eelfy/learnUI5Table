sap.ui.define( [
	"sap/ui/core/mvc/Controller",
	"sap/ushell/renderers/fiori2/search/inputhelp/SearchInputHelpService",
	"sap/ushell/renderers/fiori2/search/controls/SearchFieldGroup"
], function (Controller, SearchInputHelpService, SearchFieldGroup) {
	"use strict";

	return Controller.extend("sap.ushell.shells.demo.searchRoutingApp.controller.View1", {
		onInit : function () {

			var that = this;

			SearchInputHelpService.init(function () {

				//init search model
				if (!that.getOwnerComponent().getModel("searchModel")) {
					that.oModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
					// that.oModel.isSearchInputHelp = true;
					that.oModel.preventUpdateURL = true;
					that.oModel.config.searchScopeWithoutAll = true;
					that.getOwnerComponent().setModel(that.oModel, "searchModel");
				}

				that.oSearchFieldGroup = new SearchFieldGroup("searchFieldGroup");
				that.oSearchFieldGroup.setModel(that.oModel);
				that.getView().getContent()[0].getContent()[0].addContent(that.oSearchFieldGroup.select);

				that.oModel.initBusinessObjSearch().then(function () {
					var dataSources = that.oModel.getProperty("/dataSources");
					if (dataSources[0] === that.oModel.allDataSource) {
						dataSources.shift();
						that.oModel.setDataSource(dataSources[0]);
					}
				});

			});
		},

		onToPage2 : function () {
			this.getOwnerComponent().getRouter().navTo("page2");
			this.oModel._firePerspectiveQuery();
		}
	});

});
