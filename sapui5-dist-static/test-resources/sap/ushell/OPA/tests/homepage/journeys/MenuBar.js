// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/Homepage"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("test the MenuBar", {
        before: function () {
            this.flpConfig = {
                ushell: {
                    menu: {
                        enabled: true
                    }
                },
                services: {
                    Menu: {
                        adapter: {
                            module: "sap.ushell.adapters.local.MenuAdapter",
                            config: {
                                enabled: true,
                                menuData: [
                                    {
                                        title: "Some Menu Entry",
                                        type: "Text"
                                    },
                                    {
                                        title: "Some Other Menu Entry",
                                        type: "Text"
                                    }
                                ]
                            }
                        }
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("MenuBar is loaded", function (Given, When, Then) {
            // Arrangements & Actions
            Given.iStartMyFLP(sAdapter, this.flpConfig);

            // Assertions
            Then.onTheHomepage.iShouldSeeTheMenuBar()
                .and.iShouldSeeMenuEntries(2);

            Then.iTeardownMyFLP();
        });
    });
});
