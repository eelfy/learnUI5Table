sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/unified/Menu",
	"sap/ui/unified/MenuItem"
], function(Controller, JSONModel, Device, Menu, MenuItem) {
	"use strict";

	return Controller.extend("sap.ui.vbm.sample.GeoMapHLRoutes.Main", {

		onInit: function () {
			var oModel = new JSONModel("test-resources/sap/ui/vbm/demokit/sample/GeoMapHLRoutes/Data.json");
			this.getView().setModel(oModel);

			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");
		},

		onPressLegend: function ()	{
			if (this.byId("vbi").getLegendVisible() == true) {
				 this.byId("vbi").setLegendVisible(false);
				 this.byId("btnLegend").setTooltip("Show legend");
			} else {
				 this.byId("vbi").setLegendVisible(true);
				 this.byId("btnLegend").setTooltip("Hide legend");
			}
		},

		onPressResize: function ()	{
			if (this.byId("btnResize").getTooltip() == "Minimize") {
				if (Device.system.phone) {
					this.byId("vbi").minimize(132,56,1320,560);//Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("vbi").minimize(168,72,1680,720);//Height: 4,5 rem; Width: 10,5 rem
				}
				this.byId("btnResize").setTooltip("Maximize");
			} else {
				this.byId("vbi").maximize();
				this.byId("btnResize").setTooltip("Minimize");
			}
		},

		onClickItem: function (evt)	{
			// MessageToast.show("onClick");
		},

		onContextMenuItem: function ( evt )	{
			MessageToast.show("onContextMenu");
		},

		onClickRoute: function (evt)	{
			// MessageToast.show("Route onClick");
			evt.getSource().openDetailWindow("My Detail Window", "0", "0" );
		},

		onContextMenuRoute: function ( evt )	{
			// MessageToast.show("Route onContextMenu");
			if ( evt.getParameter("menu") ) {
				// Function to handle the select event of the items
				var handleSelect = function(oEvent){
					MessageToast.show("clicked on " + oEvent.getSource().getText());
				};

				// Create the menu items
				var oMenu11 = evt.getParameter("menu");
				oMenu11.addItem(
					new MenuItem({
						text: "First Item",
						select: handleSelect
					})
				);
				oMenu11.addItem(
					new MenuItem({
						text: "Second Item",
						select: handleSelect,
						submenu: new Menu({
							ariaDescription: "a sub menu",
							items: [
								new MenuItem({
									text: "New TXT file",
									tooltip: "Creates a new TXT file.",
									select: handleSelect
								}),
								new MenuItem({
									text: "New RAR file",
									tooltip: "Creates a new RAR file.",
									select: handleSelect
								})
							]
						})
					})
				);
				oMenu11.addItem(
					new MenuItem({
						text: "Disabled Item",
						enabled: false
					})
				);

				evt.getSource().openContextMenu( oMenu11 );

			}

		},

		onZoomIn: function() {
			this.byId("vbi").zoomToGeoPosition(10, 51, 5);
		},

		onCloseDetail: function (evt) {
			// MessageToast.show("onCloseDetail" + this);
		},

		onOpenDetail: function (evt) {
			var cont = document.getElementById(evt.getParameter("contentarea").id);
			cont.innerHTML = "Content for Routes";
			cont.style.color = "Blue";
		}

	});

});
