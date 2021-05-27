// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/library", // css style dependency
    "sap/ushell/renderers/fiori2/search/SearchHelper",
    "sap/f/GridContainer"
], function (ushellLibrary, SearchHelper, GridContainer) {
    "use strict";

    return sap.f.GridContainer.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultGrid", {

        constructor: function (sId, mSettings) {

            sap.f.GridContainer.prototype.constructor.apply(this, [sId, mSettings]);

            this.bindAggregation("items", "/results", function (id, context) {
                var item = context.getObject();
                var imageContent = new sap.m.ImageContent({
                    src: item.imageUrl
                });
                if (item.imageFormat === "round") {
                    imageContent.addStyleClass("sapUshellResultListGrid-ImageContainerRound");
                }
                return new sap.m.GenericTile({
                    header: item.title,
                    subheader: item.dataSourceName,
                    tileContent: new sap.m.TileContent({
                        content: imageContent
                    }),
                    press: function (oEvent) {
                        var binding = this.getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
                        if (binding.titleNavigation._target === "_blank") {
                            SearchHelper.openURL(binding.titleNavigation._href, "_blank");
                        } else {
                            window.location.hash = binding.titleNavigation._href;
                        }
                    }
                });
            });

            this.addStyleClass("sapUshellResultListGrid");
        },

        renderer: "sap.f.GridContainerRenderer",

        onAfterRendering: function () {
            SearchHelper.boldTagUnescaper(this.getDomRef());
        }

    });
});
