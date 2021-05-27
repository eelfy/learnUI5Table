sap.ui.require([
	"sap/m/Shell",
	"sap/m/App",
	"sap/m/Page",
	"sap/ui/core/ComponentContainer"
], function(
	Shell, App, Page, ComponentContainer) {
	"use strict";

	sap.ui.getCore().attachInit(function() {
		new Shell ({
			app : new App ({
				pages : [
					new Page({
						title : "XML Templating with Enterprise Search Input Help",
						enableScrolling : true,
						content : [
							new ComponentContainer({
								name : "sap.ushell.shells.demo.searchInputhelp",
								settings : {
									id : "sap.ushell.shells.demo.searchInputhelp"
								}
							})
						]
					})
				]
			})
		}).placeAt("content");
	});
});
