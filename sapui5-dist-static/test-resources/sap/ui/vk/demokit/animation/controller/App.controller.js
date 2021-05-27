sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/model/json/JSONModel"
], function(Controller, ContentResource, JSONModel) {
	"use strict";

	return Controller.extend("sap-demo-animation.controller.App", {
		onInit: function() {
			// For debugging purposes assign objects to the global scope (window).

			window.vkCore = sap.ui.vk.getCore();
			window.view   = this.getView();

			window.ls     = window.view.byId("leftSplitter");
			window.lt     = window.view.byId("leftTree");
			window.lv     = window.view.byId("leftViewport");
			window.lc     = window.view.byId("leftConnector");
			window.lvsm   = window.view.byId("leftVSM");

			window.rs     = window.view.byId("rightSplitter");
			window.rt     = window.view.byId("rightTree");
			window.rv     = window.view.byId("rightViewport");
			window.rc     = window.view.byId("rightConnector");
			window.rvsm   = window.view.byId("rightVSM");

			this.leftSourceData = {
				url: localStorage.getItem("left-source-url") || "https://sapqa-3d-connector.cfapps.sap.hana.ondemand.com/api/storage/v1/",
				sceneId: localStorage.getItem("left-source-sceneId") || "1"
			};

			this.rightSourceData = {
				url: localStorage.getItem("right-source-url") || "https://sapqa-3d-connector.cfapps.sap.hana.ondemand.com/api/storage/v1/",
				sceneId: localStorage.getItem("right-source-sceneId") || "1"
			};

			this.getView().setModel(new JSONModel(this.leftSourceData), "leftSource");
			this.getView().setModel(new JSONModel(this.rightSourceData), "rightSource");
		},

		_loadContent: function(contentConnectorId, url, sceneId) {
			var contentConnector = this.getView().byId(contentConnectorId);
			var contentResource = contentConnector.getContentResources()[0];
			if (contentResource) {
				contentResource.setSource(url);
				contentResource.setVeid(sceneId);
				contentResource.setSourceType("stream");
			} else {
				contentConnector.addContentResource(new ContentResource({
					source: url,
					veid: sceneId,
					sourceType: "stream",
					sourceId: "abc"
				}));
			}
		}
	});
});