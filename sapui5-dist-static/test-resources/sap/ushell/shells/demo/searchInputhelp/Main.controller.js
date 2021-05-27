/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/base/Log",
	"sap/m/MessageBox",
	"sap/ui/core/Component",
	"sap/ui/core/library",
	"sap/ui/core/ListItem",
	"sap/ui/core/mvc/View",
	"sap/ushell/shells/demo/searchInputhelp/BaseController",
	"sap/ui/util/XMLHelper",
	"sap/ushell/renderers/fiori2/search/inputhelp/SearchInputHelpService"
], function (Log, MessageBox, Component, library, ListItem, View, Controller, XMLHelper, SearchInputHelpService) {
	"use strict";

	// shortcut for sap.ui.core.mvc.ViewType
	var ViewType = library.mvc.ViewType;

	function alertError(oError) {
		Log.error(oError, oError.stack, "sap.ushell.shells.demo.searchInputhelp.Main");
		MessageBox.alert(oError.message, {
			icon : MessageBox.Icon.ERROR,
			title : "Error"});
	}

	var MainController = Controller.extend("sap.ushell.shells.demo.searchInputhelp.Main", {
		/**
		 * Function is called by <code>onSourceCode</code> before the source code is pretty printed.
		 * It returns the XML of the detail view.
		 *
		 * @param {string} sSourceCode The source code
		 * @returns {string} The XML of the detail view
		 */
		beforePrettyPrinting : function (sSourceCode) {
			return XMLHelper.serialize(this._getDetailView()._xContent);
		},

		// Turns an instance's id (full OData URL) into its path within the OData model
		id2Path : function (sInstanceId) {
			// Note: if "last /" is wrong, search for this.getView().getModel().sServiceUrl instead!
			return sInstanceId.slice(sInstanceId.lastIndexOf("/"));
		},

		onInit : function () {
			// Note: cannot access view model in onInit
			SearchInputHelpService.init4View(this.getView());
		},

		onBeforeRendering : function () {
			var oMetaModel,
				oView = this.getView(),
				oUIModel = oView.getModel("ui"),
				that = this;

			if (!oUIModel.getProperty("/selectedEntitySet")) {
				oMetaModel = oView.getModel().getMetaModel();
				oMetaModel.loaded().then(function () {
					var aEntitySets = oMetaModel.getODataEntityContainer().entitySet;

					oUIModel.setProperty("/entitySet", aEntitySets);
					oUIModel.setProperty("/selectedEntitySet", aEntitySets[0].name);

					that._bindSelectInstance();
				}).catch(alertError);
			}
		},

		onChangeType : function (oEvent) {
			this._bindSelectInstance();
		},

		onChangeInstance : function (oEvent) {
			var sInstanceId = this.getView().getModel("ui").getProperty("/selectedInstance"),
				sPath = this.id2Path(sInstanceId);

			this._getDetailView().bindElement(sPath);
			//TODO keep table selection in sync!
		},

		onChangeSearchInputHelp : function (oEvent) {
			var selectedItems = this.getView().getModel("searchModel").getProperty("/inputHelpSelectedItems");
			if (!selectedItems || selectedItems.length === 0) {
				return;
			}
			
			var selectedItem = selectedItems[selectedItems.length-1];
			var sInstanceId = "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/BusinessPartnerSet('" + selectedItem.value + "')";
			var	sPath = this.id2Path(sInstanceId);

			this._getDetailView().bindElement(sPath);
		},

		_bindSelectInstance : function () {
			var oBinding,
				oControl = this.byId("selectInstance");

			oControl.bindAggregation("items", {
				path : "/" + this._getSelectedSet(),
				template : new ListItem({
					text : "{path:'__metadata/id', formatter: '.id2Path'}",
					key : "{__metadata/id}"
				}, this)
			});

			oBinding = oControl.getBinding("items");
			oBinding.attachDataReceived(
				function onDataReceived() { //select first instance
					this._showDetails(oBinding.getContexts()[0].getPath());
					oBinding.detachDataReceived(onDataReceived, this);
				},
				this);
		},

		_getDetailView : function () {
			return this.byId("detailBox").getContent()[0];
		},

		_getSelectedSet : function () {
			return this.getView().getModel("ui").getProperty("/selectedEntitySet");
		},

		_showDetails : function (sPath) {
			var oMetaModel = this.getView().getModel().getMetaModel(),
				that = this;

			oMetaModel.loaded().then(function () {
				var sMetadataPath = oMetaModel.getODataEntitySet(that._getSelectedSet(), true);

				Component.getOwnerComponentFor(that.getView()).runAsOwner(function () {
					View.create({
						preprocessors : {
							xml : {
								bindingContexts : {
									meta : oMetaModel.createBindingContext(sMetadataPath)
								},
								models : {
									meta : oMetaModel
								},
								bindTexts : that.getView().getModel("ui").getProperty("/bindTexts")
							}
						},
						type : ViewType.XML,
						viewName : "sap.ushell.shells.demo.searchInputhelp.Detail"
					}).then(function (oDetailView) {
						var oDetailBox = that.byId("detailBox"),
							iStart;

						oDetailView.bindElement(sPath);

						oDetailBox.destroyContent();
						iStart = Date.now();
						oDetailBox.addContent(oDetailView);
						Log.info("addContent took " + (Date.now() - iStart) + " ms", null,
							"sap.ushell.shells.demo.searchInputhelp.Main");

						that.onSourceCode();
					});
				});

			}).catch(alertError);
		}
	});

	return MainController;
});
