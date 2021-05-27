// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/components/visualizationOrganizer/Component",
    "sap/ushell/playground/controller/BaseController"
], function (
    VOComponent,
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.VisualizationOrganizer", {
        onInit: function () {
            this.vizOrg = new VOComponent();

            var oHierarchy = {
                spaces: [
                    {
                        "title": "Space 1",
                        "id": "space1",
                        "pages": [
                            {
                                id: "page1"
                            }
                        ]
                    },
                    {
                        "title": "Space 2",
                        "id": "space2",
                        "pages": [
                            {
                                id: "page2"
                            }
                        ]
                    },
                    {
                        "title": "Space 3",
                        "id": "space3",
                        "pages": [
                            {
                                id: "page3"
                            }
                        ]
                    }
                ]
            };
            sap.ushell.Container = {
                getService: function () {
                    return {
                        getSpacesPagesHierarchy: function () {
                            return Promise.resolve(oHierarchy);
                        },
                        addVisualization: function () {}
                    };
                }
            };
        },

        buttonPress: function (oEvent) {
            var sId = oEvent.getSource().getId();
            this.vizOrg.toggle(oEvent.getSource(), { id: sId, title: sId.split("-")[2] });
        }

    });
});