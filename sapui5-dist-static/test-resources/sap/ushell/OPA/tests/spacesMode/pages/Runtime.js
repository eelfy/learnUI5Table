// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Ancestor",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/opa/matchers/Hash",
    "sap/ushell/resources",
    "sap/ui/thirdparty/hasher"
], function (Opa5, Press, PropertiesMatcher, AncestorMatcher, I18NTextMatcher, HashMatcher, resources, hasher) {
    "use strict";

    Opa5.createPageObjects({
        onTheRuntimeComponent: {
            actions: {
                iChangeTheHash: function (sHash) {
                    hasher.setHash(sHash);
                },
                iClickOnAMenuEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        actions: new Press()
                    });
                },
                iClickOnMoreNextToAMenuEntry: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        success: function (aIconTabFilter) {
                            return this.waitFor({
                                controlType: "sap.m.AccButton",
                                matchers: new AncestorMatcher(aIconTabFilter[0]),
                                actions: new Press()
                            });
                        }
                    });
                },
                iOpenUserActionsMenu: function () {
                    return this.waitFor({
                        id: "meAreaHeaderButton",
                        actions: new Press()
                    });
                },
                iEnterEditMode: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("PageRuntime.EditMode.Activate")
                        }),
                        actions: new Press()
                    });
                },
                iEnterAppFinder: function () {
                    this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("appFinderTitle")
                        }),
                        actions: new Press()
                    });
                },
                iNavigateBack: function () {
                    this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellHeadItem",
                        id: "backBtn",
                        actions: new Press()
                    });
                },
                iClickTheVisualization: function (sTitle) {
                    this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: new PropertiesMatcher({
                            header: sTitle
                        }),
                        actions: new Press()
                    });
                },
                iFocusAGridContainerItemWrapper: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        actions: function (oVizInstance) {
                            return oVizInstance.getDomRef().parentElement.focus();
                        }
                    });
                },
                iFocusASection: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        actions: function (oSection) {
                            return oSection.focus();
                        }
                    });
                }
            },
            assertions: {
                iSeeTheMenuBarIsEnabled: function () {
                    return this.waitFor({
                        controlType: "sap.ui.core.ComponentContainer",
                        id: "menuBarComponentContainer",
                        success: function (aMenubarComponent) {
                            return this.waitFor({
                                controlType: "sap.m.IconTabFilter",
                                matchers: [
                                    new AncestorMatcher(aMenubarComponent[0])
                                ],
                                success: function (aIconTabFilters) {
                                    aIconTabFilters.forEach(function (oIconTabFilter) {
                                        Opa5.assert.ok(oIconTabFilter.getEnabled(), "The IconTabFilter with text '" + oIconTabFilter.getText() + "' is enabled");
                                    });
                                }
                            });
                        }
                    });
                },
                iSeeTheHash: function (sHash) {
                    return this.waitFor({
                        matchers: new HashMatcher({
                            hash: sHash
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The hash is correct");
                        }
                    });
                },
                iSeeTheRightPageTitle: function (sPageTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Page",
                        matchers: new PropertiesMatcher({
                            title: sPageTitle
                        }),
                        success: function () {
                            Opa5.assert.ok("The page title was found.");
                        }
                    });
                },
                iSeeTheRightIconTabFilterSelected: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sText
                        }),
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter, "Filter with text '" + sText + "' is selected");
                        }
                    });
                },
                iSeeNoItemSelected: function () {
                    return this.waitFor({
                        controlType: "sap.m.IconTabHeader",
                        matchers: new PropertiesMatcher({
                            selectedKey: "None Existing Key"
                        }),
                        success: function () {
                            Opa5.assert.ok("No key is selected");
                        }
                    });
                },
                iSeeTheEditModeButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        matchers: new PropertiesMatcher({
                            title: resources.i18n.getText("PageRuntime.EditMode.Activate")
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The edit mode button is there.");
                        }
                    });
                },
                iDontSeeTheEditModeButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.StandardListItem",
                        check: function (aStandardListItems) {
                            for (var i = 0; i < aStandardListItems.length; i++) {
                                if (aStandardListItems[i].getProperty("title") === resources.i18n.getText("PageRuntime.EditMode.Activate")) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The edit mode button is not there.");
                        }
                    });
                },
                iSeeThePageHasTheCorrectSectionCount: function (iSectionCount) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        check: function (aSections) {
                            return aSections.length === iSectionCount;
                        },
                        success: function () {
                            Opa5.assert.ok("Section count is correct");
                        }
                    });
                },
                iSeeTheSectionWithNameAtIndex: function (sSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        check: function (aSections) {
                            if (aSections.length !== 1) {
                                return false;
                            }
                            var sPath = aSections[0].getBindingContext().getPath();
                            var aStringPaths = sPath.split("/");
                            var iIndex = aStringPaths[aStringPaths.length - 1];
                            return iSectionIndex === parseInt(iIndex, 10);
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section was found at the correct position");
                        }
                    });
                },
                iDontSeeTheSection: function (sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        check: function (aSections) {
                            for (var i = 0; i < aSections.length; i++) {
                                if (aSections[i].getProperty("title") === sSectionTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The section '" + sSectionTitle + "' is not there.");
                        }
                    });
                },
                iDontSeeTheTile: function (sTileTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        check: function (aTiles) {
                            for (var i = 0; i < aTiles.length; i++) {
                                if (aTiles[i].getProperty("title") === sTileTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The tile '" + sTileTitle + "' is not there.");
                        }
                    });
                },
                iSeeTheSectionHasTheCorrectVizCount: function (sSectionTitle, iVizCount) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: new AncestorMatcher(aSections[0]),
                                check: function (aVisualizations) {
                                    return aVisualizations.length === iVizCount;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "VizCount is correct");
                                }
                            });
                        }
                    });
                },
                iSeeTheVisualization: function (sTileTitle) {
                    this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTileTitle
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "Tile was found.");
                        }
                    });
                },
                iSeeTheVisualizationAtTheCorrectIndex: function (sSectionTitle, sVizTitle, iVizIndex) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        title: sVizTitle
                                    })
                                ],
                                check: function (aVisualizations) {
                                    if (aVisualizations.length !== 1) {
                                        return false;
                                    }
                                    var sPath = aVisualizations[0].getBindingContext().getPath();
                                    var aStringPaths = sPath.split("/");
                                    var iIndex = aStringPaths[aStringPaths.length - 1];
                                    return iVizIndex === parseInt(iIndex, 10);
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "Vizsualization was found at the correct position");
                                }
                            });
                        }
                    });
                },
                iShouldSeeTheCannotLoadPageError: function (sPageId, sSpaceId) {
                    return this.waitFor({
                        controlType: "sap.m.Text",
                        matchers: [
                            new PropertiesMatcher({
                                text: resources.i18n.getText("PageRuntime.CannotLoadPage.Text", [ sPageId, sSpaceId ])
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok("The text was found.");
                        }
                    });
                },
                iCannotSeeTheViz: function (sHeader) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        check: function (aGenericTiles) {
                            var sResult = aGenericTiles.find(function (oGenericTile) {
                                return oGenericTile.getProperty("header") === sHeader;
                            });
                            return typeof sResult === "undefined";
                        },
                        success: function () {
                            Opa5.assert.ok("The viz was not found");
                        }
                    });
                },
                iDontSeeAddSectionButtons: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        check: function (aButtons) {
                            for (var i = 0; i < aButtons.length; i++) {
                                if (aButtons[i].getText() === resources.i18n.getText("Page.Button.AddSection")) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "There are no 'Add Section' buttons.");
                        }
                    });
                },
                iSeeEveryVisualizationIsNotEditable: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        check: function (aVizInstances) {
                            for (var i = 0; i < aVizInstances.length; i++) {
                                if (aVizInstances[i].getEditable() === true) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Every Visualization is not editable");
                        }
                    });
                },
                iSeeTheVisualizationInTheSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sVisualizationTitle
                                    }),
                                    new AncestorMatcher(
                                        aSections[0]
                                    )
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length === 1;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is in the right section");
                                }
                            });
                        }
                    });
                },
                iSeeTwoTilesWithTitleInSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new PropertiesMatcher({
                                        title: sVisualizationTitle
                                    }),
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length === 2;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is in the right section");
                                }
                            });
                        }
                    });
                },
                iDontSeeTheVisualizationInTheSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: [
                            new PropertiesMatcher({
                                title: sSectionTitle
                            })
                        ],
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0])
                                ],
                                check: function (aVisualizations) {
                                    for (var i = 0; i < aVisualizations.length; i++) {
                                        if (aVisualizations[i].getProperty("title") === sVisualizationTitle) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                success: function () {
                                    Opa5.assert.ok("The visualization is not in the section");
                                }
                            });
                        }
                    });
                },
                iSeeTheVisualizationHasTheCorrectProperties: function (sSectionTitle, sVizTitle, sVizSubTitle, sVizInfo) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: new PropertiesMatcher({
                            title: sSectionTitle
                        }),
                        success: function (aSections) {
                            return this.waitFor({
                                controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                                matchers: [
                                    new AncestorMatcher(aSections[0]),
                                    new PropertiesMatcher({
                                        title: sVizTitle,
                                        subtitle: sVizSubTitle,
                                        info: sVizInfo
                                    }) ],
                                check: function (aVisualizations) {
                                    return aVisualizations.length;
                                },
                                success: function () {
                                    Opa5.assert.ok(true, "VizCount is correct");
                                }
                            });
                        }
                    });
                },
                iSeeFocusOnGridContainerItemWrapper: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstanceCdm",
                        matchers: new PropertiesMatcher({
                            title: sTitle
                        }),
                        check: function (aVizInstances) {
                            return aVizInstances[0].getDomRef().parentElement === document.activeElement;
                        },
                        success: function (oVizInstance) {
                            Opa5.assert.ok(oVizInstance, "Tile was focused.");
                        }
                    });
                },
                iSeeFocusOnMenuEntry: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.IconTabFilter",
                        matchers: new PropertiesMatcher({
                            text: sTitle
                        }),
                        enabled: false,
                        check: function (aIconTabFilter) {
                            return aIconTabFilter[0].getFocusDomRef() === document.activeElement;
                        },
                        success: function (oIconTabFilter) {
                            Opa5.assert.ok(oIconTabFilter, "Menu entry was focused.");
                        }
                    });
                }
            }
        }
    });
});