// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

(function () {
    "use strict";

    sap.ui.jsview("sap.ushell.demotiles.cdm.contractStatusTile.Tile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.cdm.contractStatusTile.Tile";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");
        },

        getTileControl: function () {
            jQuery.sap.require("sap.m.GenericTile");

            return new sap.m.GenericTile({
                mode: sap.m.GenericTileMode.ContentMode,
                header: "{/tileTitle}",
                subheader: "{/tileSubtitle}",
                size: "Auto",
                sizeBehavior: "{/sizeBehavior}",
                backgroundImage: "{/backgroundImage}",
                url: {
                    parts: ["/navigationTargetUrl"],
                    formatter: this.getController().formatters.urlToExternal
                },
                tileContent: [new sap.m.TileContent({
                    size: "Auto",
                    unit: "Refresh counter",
                    content: [new sap.m.NumericContent({
                        value: "{/refreshCount}",
                        indicator: "{/stateArrow}",
                        valueColor: "{/numberState}",
                        icon: "{/icon}",
                        width: "100%"
                    })]
                })],
                press: [this.getController().onPress, this.getController()]
            });
        }
    });
}());
