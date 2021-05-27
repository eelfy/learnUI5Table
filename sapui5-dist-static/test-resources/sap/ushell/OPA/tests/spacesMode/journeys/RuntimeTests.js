// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime"
], function (opaTest) {
    "use strict";

    /**
     * This OPA journey will test the basic rendering of an FLP page with default and custom configurations.
     */

    /* global QUnit */
    QUnit.module("Runtime tests");

    opaTest("Should open the FLP and have a working menu bar", function (Given, When, Then) {
        Given.iStartMyFLP("abap", {}, "spaces");

        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Menu entry 1");
        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("UI2 FLP Demo - Test Page");
        When.onTheRuntimeComponent.iChangeTheHash("#Launchpad-openFLPPage?spaceId=ZTEST2&pageId=ZTEST2");
        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Menu entry 2");
        When.onTheRuntimeComponent.iClickOnMoreNextToAMenuEntry("Menu entry 2");
        When.onTheRuntimeComponent.iClickOnAMenuEntry("Sub entry 2.1");
        Then.onTheRuntimeComponent.iSeeTheRightIconTabFilterSelected("Menu entry 2");
    });

    opaTest("Should display the first page correctly", function (Given, When, Then) {
        When.onTheRuntimeComponent.iClickOnAMenuEntry("Menu entry 1");
        Then.onTheRuntimeComponent.iSeeTheHash("#Launchpad-openFLPPage?pageId=/UI2/FLP_DEMO_PAGE&spaceId=/UI2/FLP_DEMO_PAGE");

        Then.onTheRuntimeComponent.iSeeThePageHasTheCorrectSectionCount(6);

        // Ensure that every section is at the correct place, empty sections are not shown in display mode
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Custom & Dynamic Tiles", 0);
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Navigation", 1);
        Then.onTheRuntimeComponent.iDontSeeTheSection("Empty Group 1"); // Not that nice: Empty groups occupy an index position
        Then.onTheRuntimeComponent.iDontSeeTheSection("Empty Group 2");
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Application Dependencies", 4);
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("App Personalization", 5);
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("App State", 6);
        Then.onTheRuntimeComponent.iDontSeeTheSection("WDA & WebGUI"); // Is empty
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("URL Tiles", 8);

        // The first two sections have the correct amount of Visualizations
        Then.onTheRuntimeComponent.iSeeTheSectionHasTheCorrectVizCount("Custom & Dynamic Tiles", 4);
        Then.onTheRuntimeComponent.iSeeTheSectionHasTheCorrectVizCount("Navigation", 2);

        // The first section has all visualizations in the correct order
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "News tile", 0);
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "Dynamic Tile Catalogs Count", 1);
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "Dynamic App Launcher", 2);
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "Maintain Pages", 3);

        // The second section has all visualizations in the correct order
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Navigation", "App Navigation Sample 2", 0);
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Navigation", "Bookmark Sample", 1);
    });

    opaTest("Should open the FLP with a wrong hash for a non-existing page", function (Given, When, Then) {
        When.onTheRuntimeComponent.iChangeTheHash("#Launchpad-openFLPPage?spaceId=ZTEST10&pageId=ZTEST10");

        Then.onTheRuntimeComponent.iSeeNoItemSelected();
        Then.onTheRuntimeComponent.iShouldSeeTheCannotLoadPageError("ZTEST10", "ZTEST10");
    });

    opaTest("Should open the first page and reacts to the hash change by opening the corresponding page", function (Given, When, Then) {
        When.onTheRuntimeComponent.iChangeTheHash("#Launchpad-openFLPPage?spaceId=ZPAGE2&pageId=ZPAGE2");

        Then.onTheRuntimeComponent.iSeeTheRightPageTitle("ZPAGE2");

        Then.iTeardownMyFLP();
    });

    var oMissingCatalogueConfig = {
        services: {
            VisualizationDataProvider: {
                adapter: {
                    config: {
                        catalogs: [{
                            tiles: [{
                                size: "1x1",
                                tileType: "sap.ushell.ui.tile.StaticTile",
                                chipId: "non existing chip id",
                                properties: {
                                    title: "Broken tile",
                                    subtitle: "Custom tile",
                                    info: "Not supported on local",
                                    icon: "",
                                    targetURL: "no target url"
                                }
                            }]
                        }]
                    }
                }
            }
        }
    };

    opaTest("Should open the FLP and the Viz without a matching catalog item is filtered out", function (Given, When, Then) {
        Given.iStartMyFLP("abap", oMissingCatalogueConfig, "spaces");

        Then.onTheRuntimeComponent.iCannotSeeTheViz("Broken tile");
        Then.iTeardownMyFLP();
    });

    var oMissingPagesConfig = {
        services: {
            PagePersistence: {
                adapter: {
                    module: "sap.ushell.adapters.local.PagePersistenceAdapter",
                    config: { pages: false }
                }
            }
        }
    };

    opaTest("Should open a non existing page and show an error", function (Given, When, Then) {
        Given.iStartMyFLP("abap", oMissingPagesConfig, "spaces");

        Then.onTheRuntimeComponent.iShouldSeeTheCannotLoadPageError("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_PAGE");

        Then.iTeardownMyFLP();
    });

    var oNonExistingVizConfig = {
        services: {
            PagePersistence: {
                adapter: {
                    module: "sap.ushell.adapters.local.PagePersistenceAdapter",
                    config: {
                        pages: [{
                            id: "/UI2/FLP_DEMO_PAGE",
                            title: "UI2 FLP Demo - Test Page",
                            description: "This page is used for testing the pages runtime",
                            sections: [{
                                viz: [{
                                    vizId: "Non existing visualization"
                                }]
                            }]
                        }]
                    }
                }
            }
        }
    };

    opaTest("Should open a FLP page and filter out visualization with an invalid vizId", function (Given, When, Then) {
        Given.iStartMyFLP("abap", oNonExistingVizConfig, "spaces");

        Then.onTheRuntimeComponent.iCannotSeeTheViz("News tile");

        Then.iTeardownMyFLP();
    });
});