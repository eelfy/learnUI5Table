// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/spacesMode/pages/Runtime",
    "sap/ushell/opa/tests/spacesMode/pages/EditMode"
], function (opaTest) {
    "use strict";

    /**
     * This OPA journey will test the personalisation of an FLP page via edit mode.
     */

    /* global QUnit */
    QUnit.module("Editmode tests");

    opaTest("Should open the FLP and not see any 'add section' buttons.", function (Given, When, Then) {
        Given.iStartMyFLP("abap", {}, "spaces");
        Then.onTheRuntimeComponent.iSeeEveryVisualizationIsNotEditable();
        Then.onTheRuntimeComponent.iDontSeeAddSectionButtons();
    });

    opaTest("Entering edit mode shows personalization options.", function (Given, When, Then) {
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheRuntimeComponent.iSeeTheEditModeButton();
        When.onTheRuntimeComponent.iEnterEditMode();

        Then.onTheEditModeComponent.iSeeTheMenuBarIsDisabled();
        Then.onTheEditModeComponent.iSeeEveryVisualizationIsEditable();
        Then.onTheEditModeComponent.iSeeAddSectionButtons(9);
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("Navigation");
    });

    opaTest("In edit mode I see empty sections.", function (Given, When, Then) {
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("Empty Group 1");
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("Empty Group 2");
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("WDA & WebGUI");
    });

    opaTest("Clicking a visualization in edit mode does not trigger navigation.", function (Given, When, Then) {
        When.onTheEditModeComponent.iClickTheCDMVisualization("Maintain Pages");
        Then.onTheEditModeComponent.iAmInTheActionMode();
    });

    opaTest("Pressing the delete button deletes a visualization.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDeleteAVisualization("Dynamic App Launcher");
        Then.onTheRuntimeComponent.iDontSeeTheVisualizationInTheSection("Dynamic App Launcher", "Custom & Dynamic Tiles");
    });

    opaTest("Predefined Sections can't be deleted.", function (Given, When, Then) {
        Then.onTheEditModeComponent.iCantSeeADeleteButtonAtSection("Custom & Dynamic Tiles");
        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });

    /* This test creates a problem on local machines. In many cases, the title of the button is not rendered correctly,
    * making it impossible for the button to be found and clicked. This issue only occured locally for now, so if this
    * is the case for you, please simply comment this test out (and the following assertion of hidden section) and ignore the error it caused.
    */
    /*opaTest("Pressing 'hide section' hides the section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iHideASectionWithTitle("URL Tiles");
        Then.onTheEditModeComponent.iSeeTheSectionWithTitleHidden("URL Tiles");
    });

    opaTest("The section is still hidden after closing edit mode.", function (Given, When, Then) {
        When.onTheEditModeComponent.iCloseEditMode();

        Then.onTheRuntimeComponent.iDontSeeTheSection("URL Tiles");
    });*/

    opaTest("Can't hide Sections after disabling it in the config.", function (Given, When, Then) {

        var oConfig = {
            "renderers": {
                "fiori2": {
                    "componentData": {
                        "config": {
                            "enableHideGroups": false
                        }
                    }
                }
            }
        };

        Given.iStartMyFLP("abap", oConfig, "spaces");

        // The section should now be visible even if hiding it earlier.
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("URL Tiles", 8);

        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterEditMode();
        Then.onTheEditModeComponent.iCantSeeAShowHideSectionSwitch("Custom & Dynamic Tiles");
    });

    opaTest("Pressing 'Add Section' adds a new Section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iPressTheAddSectionButtonWithIndex(0);
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("", 1);
        Then.onTheEditModeComponent.iSeeTheSectionHasAnInputField("");
        Then.onTheEditModeComponent.iCantSeeAResetButtonAtSection("");
    });

    opaTest("Entering a new title for a section renames the section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iEnterANewTitleForASection("", "My New Title");
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("My New Title", 1);
    });

    opaTest("Pressing 'delete section', shows the delete dialog.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDeleteTheSectionWithTitle("My New Title");
        Then.onTheEditModeComponent.iSeeTheDeleteDialog();
        Then.onTheEditModeComponent.iSeeTheRightDeleteQuestion("My New Title");
    });

    // This test fails if you click outside the window while the test runs.
    opaTest("Pressing 'Cancel' doesn't delete the section and focus it.", function (Given, When, Then) {
        When.onTheEditModeComponent.iPressCancel();
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("My New Title", 1);
        Then.onTheEditModeComponent.iSeeTheDeleteButtonOfSectionWithTitleFocused("My New Title");
    });

    opaTest("Pressing 'delete section', shows the delete dialog.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDeleteTheSectionWithTitle("My New Title");
        Then.onTheEditModeComponent.iSeeTheDeleteDialog();
        Then.onTheEditModeComponent.iSeeTheRightDeleteQuestion("My New Title");
    });

    opaTest("Pressing 'Delete' deletes the section, shows a message toast.", function (Given, When, Then) {
        When.onTheEditModeComponent.iPressDelete();
        Then.onTheEditModeComponent.iSeeTheSectionDeletedMessageToast();
        Then.onTheRuntimeComponent.iDontSeeTheSection("My New Title");
    });

    opaTest("Dragging a section moves it in the right place.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDragASectionToAnotherSection("Navigation", "Custom & Dynamic Tiles");
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Navigation", 0);
    });

    opaTest("Dragging a visualization to another section removes it from the source section.", function (Given, When, Then) {
        When.onTheEditModeComponent.iResetTheSectionWithTitle("Custom & Dynamic Tiles");
        When.onTheEditModeComponent.iDragAVisualizationToASection("Maintain Pages", "Empty Group 1");
        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("Maintain Pages", "Empty Group 1");
        Then.onTheRuntimeComponent.iDontSeeTheVisualizationInTheSection("Maintain Pages", "Custom & Dynamic Tiles");
    });

    opaTest("Resetting a section brings back the removed visualization as a duplicate.", function (Given, When, Then) {
        When.onTheEditModeComponent.iResetTheSectionWithTitle("Custom & Dynamic Tiles");
        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("Maintain Pages", "Empty Group 1");
        Then.onTheRuntimeComponent.iSeeTheVisualizationInTheSection("Maintain Pages", "Custom & Dynamic Tiles");
    });

    opaTest("Dragging a Visualization in a section where the same visualization already exists.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDragAVisualizationFromSectionToSection("Empty Group 1", "Maintain Pages", "Custom & Dynamic Tiles");
        Then.onTheRuntimeComponent.iSeeTwoTilesWithTitleInSection("Maintain Pages", "Custom & Dynamic Tiles");
    });

    opaTest("Dragging a visualization inside a section reorders the visualizations.", function (Given, When, Then) {
        When.onTheEditModeComponent.iDragAVisualizationToASection("News tile", "Custom & Dynamic Tiles");
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "News tile", 4);
    });

    // This is needed for checks after leaving edit mode and restarting the flp.
    opaTest("Adding a new section and renaming it shows the section.", function (Given, When, Then) {
        // Create a new section
        When.onTheEditModeComponent.iPressTheAddSectionButtonWithIndex(0);
        When.onTheEditModeComponent.iEnterANewTitleForASection("", "My New Title 2");
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("My New Title 2", 1);
        /* Why does the following not work out? Manually it works.
        // ... and drag the news tile from section "Custom & Dynamic Tiles" into it
        When.onTheEditModeComponent.iDragAVisualizationToASection("News tile", "My New Title 2");
        When.onTheEditModeComponent.iDragAVisualizationFromSectionToSection("Custom & Dynamic Tiles", "News tile", "My New Title 2");
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("My New Title 2", "News tile", 0);
        */
    });

    opaTest("All personalizations are properly persisted and partially visible after leaving the edit mode.", function (Given, When, Then) {
        When.onTheEditModeComponent.iCloseEditMode();

        Then.onTheRuntimeComponent.iSeeTheMenuBarIsEnabled();
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Navigation", 0);
        Then.onTheRuntimeComponent.iDontSeeTheSection("My New Title"); // Was deleted
        Then.onTheRuntimeComponent.iDontSeeTheSection("My New Title 2"); // Is at index 1, but as an empty section not visible in display mode
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "News tile", 4);
        Then.onTheRuntimeComponent.iSeeTwoTilesWithTitleInSection("Maintain Pages", "Custom & Dynamic Tiles");

        Then.iTeardownMyFLP({
            deletePersonalization: false
        });
    });

    opaTest("All Personalizations are still there after restarting the FLP.", function (Given, When, Then) {
        Given.iStartMyFLP("abap", {}, "spaces");

        // Check display mode
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("Navigation", 0);
        Then.onTheRuntimeComponent.iDontSeeTheSection("My New Title");
        Then.onTheRuntimeComponent.iDontSeeTheSection("My New Title 2");
        Then.onTheRuntimeComponent.iSeeTheVisualizationAtTheCorrectIndex("Custom & Dynamic Tiles", "News tile", 4);
        Then.onTheRuntimeComponent.iSeeTwoTilesWithTitleInSection("Maintain Pages", "Custom & Dynamic Tiles");

        // Check edit mode
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        When.onTheRuntimeComponent.iEnterEditMode();
        Then.onTheRuntimeComponent.iSeeTheSectionWithNameAtIndex("My New Title 2", 1);
        When.onTheEditModeComponent.iCloseEditMode();

        Then.iTeardownMyFLP();
    });

    opaTest("Should open the FLP with personalization disabled and not show the EditMode button", function (Given, When, Then) {
        var oConfig = {
            "renderers": {
                "fiori2": {
                    "componentData": {
                        "config": {
                            "enablePersonalization": false
                        }
                    }
                }
            }
        };

        Given.iStartMyFLP("abap", oConfig, "spaces");
        When.onTheRuntimeComponent.iOpenUserActionsMenu();
        Then.onTheRuntimeComponent.iDontSeeTheEditModeButton();

        Then.iTeardownMyFLP();
    });

});