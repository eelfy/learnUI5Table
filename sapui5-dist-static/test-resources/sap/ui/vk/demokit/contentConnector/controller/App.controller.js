sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/model/json/JSONModel"
], function(Controller, ContentResource, JSONModel) {
	"use strict";

	var firstData = [
		{
			url: "../../internal/testModels/House.vds",
			type: "vds4",
			id: "abc123"
		}
	];

	var secondData = [
		{
			url: "../../internal/testModels/998.vds",
			type: "vds4",
			id: "abc123"
		}
	];

	var factory = function(id, context) {
		return new ContentResource({
			source: "{url}",
			sourceType: "{type}",
			sourceId: "{id}"
		});
	};

	return Controller.extend("sap-demo.controller.App", {
		onInit: function() {
			// For debugging purposes assign objects to the global scope (window).

			window.vkCore = sap.ui.vk.getCore();
			window.view   = this.getView();
			window.lst    = window.view.byId("leftSceneTree");
			window.rst    = window.view.byId("rightSceneTree");
			window.bst    = window.view.byId("bottomSceneTree");
			window.lv     = window.view.byId("leftViewport");
			window.rv     = window.view.byId("rightViewport");
			window.lbv    = window.view.byId("leftBottomViewport");
			window.rbv    = window.view.byId("rightBottomViewport");
			window.fcc    = window.view.byId("first-connector");
			window.scc    = window.view.byId("second-connector");
			window.vsmA   = window.view.byId("vsmA");
			window.vsmB   = window.view.byId("vsmB");
			window.vsmC   = window.view.byId("vsmC");
			window.sn     = window.view.byId("stepNavigation");

			window.fcc
				.bindContentResources({
					path: "/",
					factory: factory
				})
				.setModel(new JSONModel(firstData));
			window.scc
				.bindContentResources({
					path: "/",
					factory: factory
				})
				.setModel(new JSONModel(secondData));
		}
	});
});