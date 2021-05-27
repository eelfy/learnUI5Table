// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.create.configcontract.core.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.create.configcontract.core"
], function (testUtils, CommonCreateConfigcontract) {
    "use strict";
    /*global module, QUnit */

    var oDefaultContract = {
        core: { // the unified shell core
            extension: {
                EndUserFeedback: true,
                SupportTicket: false,
                enableHelp: false
            },
            navigation: {
                enableInPlaceForClassicUIs: {
                    GUI: false,
                    WDA: false,
                    WCF: true
                },
                enableWdaLocalResolution: true,
                enableWebguiLocalResolution: true,
                flpURLDetectionPattern: "[/]FioriLaunchpad.html[^#]+#[^-]+?-[^-]+"
            },
            spaces: {
                enabled: false,
                configurable: false,
                extendedChangeDetection: {
                    enabled: true
                }
            },
            menu: {
                enabled: false,
                visibleInAllStates: false
            },
            darkMode: {
                enabled: false,
                supportedThemes: [{
                    dark: "sap_fiori_3_dark",
                    light: "sap_fiori_3"
                }]
            },
            contentProviders: {
                providerInfo: {
                    show: false
                }
            },
            productSwitch: {
                enabled: false,
                url: ""
            },
            userPreferences: {
                dialogTitle: "Settings",
                isDetailedEntryMode: false,
                activeEntryPath: null,
                entries: [],
                profiling: []
            },
            shell: {
                cacheConfiguration: {},
                enablePersonalization: true,
                enableAbout: true,
                enableRecentActivity: true,
                enableRecentActivityLogging: true,
                enableFiori3: true,
                sessionTimeoutIntervalInMinutes: -1,
                enableFeaturePolicyInIframes: false,
                model: {
                    enableBackGroundShapes: false,
                    personalization: undefined,
                    contentDensity: undefined,
                    setTheme: undefined,
                    userDefaultParameters: undefined,
                    disableHomeAppCache: undefined,
                    enableHelp: undefined,
                    enableTrackingActivity: undefined,
                    searchAvailable: false,
                    enableSAPCopilotWindowDocking: undefined,
                    searchFiltering: true,
                    showEndUserFeedback: false,
                    searchTerm: "",
                    isPhoneWidth: false,
                    enableNotifications: false,
                    enableNotificationsUI: false,
                    notificationsCount: 0,
                    currentViewPortState: "Center",
                    allMyAppsMasterLevel: undefined,
                    userStatus: undefined,
                    userStatusUserEnabled: true,
                    migrationConfig: undefined,
                    shellAppTitleData: {
                        currentViewInPopover: "navigationMenu",
                        enabled: false,
                        showGroupsApps: false,
                        showCatalogsApps: false,
                        showExternalProvidersApps: false
                    },
                    userImage: {
                        personPlaceHolder: null,
                        account: "sap-icon://account"
                    },
                    currentState: {
                        stateName: "blank",
                        showCurtain: false,
                        showCatalog: false,
                        showPane: false,
                        showRightFloatingContainer: false,
                        showRecentActivity: true,
                        search: "",
                        paneContent: [],
                        actions: [],
                        floatingActions: [],
                        subHeader: [],
                        toolAreaItems: [],
                        RightFloatingContainerItems: [],
                        toolAreaVisible: false,
                        floatingContainerContent: []
                    }
                }
            },
            shellHeader: {
                headEndItems: [],
                headItems: [],
                headerVisible: true,
                showLogo: false,
                application: {},
                centralAreaElement: null,
                ShellAppTitleState: undefined,
                rootIntent: "",
                title: "" // no default value for title
            },
            home: {
                disableSortedLockedGroups: false,
                draggedTileLinkPersonalizationSupported: true,
                editTitle: false,
                enableHomePageSettings: true,
                enableRenameLockedGroup: false,
                enableTileActionsIcon: false,
                enableTransientMode: false,
                featuredGroup: {
                    enable: false,
                    frequentCard: false,
                    recentCard: false
                },
                gridContainer: false,
                homePageGroupDisplay: "scroll",
                isInDrag: false,
                optimizeTileLoadingThreshold: 100,
                segments: undefined,
                tileActionModeActive: false,
                sizeBehavior: "Responsive",
                sizeBehaviorConfigurable: false,
                wrappingType: "Normal"

            },
            catalog: {
                enabled: true,
                appFinderDisplayMode: undefined,
                easyAccessNumbersOfLevels: undefined,
                enableCatalogSearch: true,
                enableCatalogSelection: true,
                enableCatalogTagFilter: true,
                enableEasyAccess: undefined,
                enableEasyAccessUserMenu: undefined,
                enableEasyAccessUserMenuSearch: undefined,
                enableEasyAccessSAPMenu: undefined,
                enableEasyAccessSAPMenuSearch: undefined,
                enableHideGroups: true,
                sapMenuServiceUrl: undefined,
                userMenuServiceUrl: undefined
            },
            esearch: {
                defaultSearchScopeApps: false,
                searchBusinessObjects: true,
                searchScopeWithoutAll: false
            }
        }
    };

    module("sap/ushell/bootstrap/common/common.create.configcontract.core", {
        setup: function () {
            this.oFormatSettings = sap.ui.getCore().getConfiguration()
                .getFormatSettings();

        },
        teardown: function () {

        }
    });

    QUnit.test("should return contract with default value or undefined when ushell config is empty", function (assert) {
        var oContract = CommonCreateConfigcontract.createConfigContract({});

        assert.deepEqual(oContract, oDefaultContract, "Contract should be fill in with default value or undefined");
    });

    [
        {
            description: "from shell config with true and home with false",
            aPath: [{
                sPath: "/renderers/fiori2/componentData/config/enablePersonalization",
                bValue: true
            }, {
                sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
                bValue: false
            }],
            expectedFlag: true
        },
        {
            description: "from shell config with undefined and home with false",
            aPath: [{
                sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
                bValue: false
            }],
            expectedFlag: false
        },
        {
            description: "from shell config with false and home with true",
            aPath: [{
                sPath: "/renderers/fiori2/componentData/config/enablePersonalization",
                bValue: false
            }, {
                sPath: "/renderers/fiori2/componentData/config/applications/Shell-home/enablePersonalization",
                bValue: true
            }],
            expectedFlag: false
        }
    ].forEach(function (oFix) {
        QUnit.test("contract for core/shell/personalization is correct when " + oFix.description, function (assert) {

            var oUshellconfig = oFix.aPath.reduce(function (acc, oTuple) {
                var sKey = oTuple.sPath,
                    oObj = {};
                oObj[sKey] = oTuple.bValue;
                return testUtils.overrideObject(acc, oObj);
            }, {});

            var oContract = CommonCreateConfigcontract.createConfigContract(oUshellconfig);

            assert.deepEqual(oContract.core.shell.enablePersonalization, oFix.expectedFlag, "Contract should be fill in with default value or undefined");
        });
    });

    QUnit.test("contract for core/navigation is correct", function (assert) {

        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution/config/enableInPlaceForClassicUIs": {
                GUI: true,
                WDA: false
            }
        });

        var oContract = CommonCreateConfigcontract.createConfigContract(oUshellConfig);

        var oExpectedContract = oDefaultContract.core.navigation;
        oExpectedContract.enableInPlaceForClassicUIs.GUI = true;

        assert.deepEqual(oContract.core.navigation, oExpectedContract, "Contract should be fill in with default value or undefined");
    });

    QUnit.test("contract for enableHelp is correctly applied for enableHelp", function (assert) {
        var oUshellConfig = testUtils.overrideObject({}, {
            "/renderers/fiori2/componentData/config/enableHelp": true
        });

        var oContract = CommonCreateConfigcontract.createConfigContract(oUshellConfig);

        assert.equal(oContract.core.extension.enableHelp, true, "Contract for enable help adapted based on different ushell config");
    });

    [
        { // this test case might be redundant
            sDescription: "enableEasyAccess is false, use defaults",
            oConfig: {
                enableEasyAccess: false,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            },
            oExpected: {
                enableEasyAccess: false,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: false
            }
        },
        {
            sDescription: "enableEasyAccess: all undefined",
            oConfig: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: undefined,
                enableEasyAccessSAPMenuSearch: undefined,
                enableEasyAccessUserMenu: undefined,
                enableEasyAccessUserMenuSearch: undefined
            },
            oExpected: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: undefined,
                enableEasyAccessSAPMenuSearch: undefined,
                enableEasyAccessUserMenu: undefined,
                enableEasyAccessUserMenuSearch: undefined
            }
        },
        {
            sDescription: "enableEasyAccess: undefined, enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenuSearch: false",
            oConfig: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: false
            },
            oExpected: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: false
            }
        },
        {
            sDescription: "enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true - model saves enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenu/Search as true",
            oConfig: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessUserMenu: true
            },
            oExpected: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            }
        },
        {
            sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: undefined - model saves enableEasyAccessSAPMenu/Search, enableEasyAccessUserMenu/Search as true",
            oConfig: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: undefined,
                enableEasyAccessSAPMenuSearch: undefined,
                enableEasyAccessUserMenu: undefined,
                enableEasyAccessUserMenuSearch: undefined
            },
            oExpected: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            }
        },
        {
            sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: undefined, enableEasyAccessSAPMenuSearch: false - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu/Search as true, enableEasyAccessSAPMenuSearch as false", // eslint-disable-line max-len
            oConfig: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: undefined,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: undefined,
                enableEasyAccessUserMenuSearch: undefined
            },
            oExpected: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            }
        },
        {
            sDescription: "enableEasyAccess: true, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: false - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as false",
            oConfig: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: true
            },
            oExpected: {
                enableEasyAccess: true,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: false
            }
        },
        {
            sDescription: "enableEasyAccess: false, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as false",
            oConfig: {
                enableEasyAccess: false,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            },
            oExpected: {
                enableEasyAccess: false,
                enableEasyAccessSAPMenu: false,
                enableEasyAccessSAPMenuSearch: false,
                enableEasyAccessUserMenu: false,
                enableEasyAccessUserMenuSearch: false
            }
        },
        {
            sDescription: "enableEasyAccess: undefined, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - model saves enableEasyAccessSAPMenu, enableEasyAccessUserMenu as true",
            oConfig: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            },
            oExpected: {
                enableEasyAccess: undefined,
                enableEasyAccessSAPMenu: true,
                enableEasyAccessSAPMenuSearch: true,
                enableEasyAccessUserMenu: true,
                enableEasyAccessUserMenuSearch: true
            }
        }
    ].forEach(function (oData) {
        QUnit.test("enableEasyAccess configurations: " + oData.sDescription, function (assert) {
            var oMockConfig = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                applications: {
                                    "Shell-home": oData.oConfig
                                }
                            }
                        }
                    }
                }
            };
            var oContract = CommonCreateConfigcontract.createConfigContract(oMockConfig);

            // check the different values
            assert.equal(oContract.core.catalog.enableEasyAccess, oData.oExpected.enableEasyAccess, "enableEasyAccess set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessSAPMenu, oData.oExpected.enableEasyAccessSAPMenu, "enableEasyAccessSAPMenu set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessSAPMenuSearch, oData.oExpected.enableEasyAccessSAPMenuSearch, "enableEasyAccessSAPMenuSearch set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessUserMenu, oData.oExpected.enableEasyAccessUserMenu, "enableEasyAccessUserMenu set correctly");
            assert.equal(oContract.core.catalog.enableEasyAccessUserMenuSearch, oData.oExpected.enableEasyAccessUserMenuSearch, "enableEasyAccessUserMenuSearch set correctly");
        });
    });

    QUnit.test("getDefaultConfiguration should return the config defaults when createConfigContract was already called", function (assert) {
        CommonCreateConfigcontract.createConfigContract({});
        var oDefaultConfiguration = CommonCreateConfigcontract.getDefaultConfiguration();

        // Taking only one config value here to avoid checking the whole object again
        assert.deepEqual(oDefaultConfiguration["renderers/fiori2/componentData/config/applications/Shell-home/enableEasyAccess"], undefined, "The default config was returned");
    });

    [
        {
            sDescription: "enableBackGroundShapes: undefined, spaces: off, - shapes are false",
            oConfig: {
                spaces: false,
                backgroundShapes: undefined
            },
            bExpected: false
        },
        {
            sDescription: "enableBackGroundShapes: undefined, spaces: on, - shapes are disabled",
            oConfig: {
                spaces: true,
                backgroundShapes: false
            },
            bExpected: false
        },
        {
            sDescription: "enableBackGroundShapes: true, spaces: off, - shapes are enabled",
            oConfig: {
                spaces: false,
                backgroundShapes: true
            },
            bExpected: true
        },
        {
            sDescription: "enableBackGroundShapes: true, spaces: on, - shapes are disabled",
            oConfig: {
                spaces: true,
                backgroundShapes: true
            },
            bExpected: false
        },
        {
            sDescription: "enableBackGroundShapes: false, spaces: off, - shapes are disabled",
            oConfig: {
                spaces: false,
                backgroundShapes: false
            },
            bExpected: false
        },
        {
            sDescription: "enableBackGroundShapes: false, spaces: on, - shapes are disabled",
            oConfig: {
                spaces: true,
                backgroundShapes: false
            },
            bExpected: false
        }
    ].forEach(function (oData) {
        QUnit.test("enableBackGroundShapes with " + oData.sDescription, function (assert) {
            var oUshellConfig = testUtils.overrideObject({}, {
                "/ushell/spaces/enabled": oData.oConfig.spaces,
                "/renderers/fiori2/componentData/config/enableBackGroundShapes": oData.oConfig.backgroundShapes
            });
            var oContract = CommonCreateConfigcontract.createConfigContract(oUshellConfig);
            var bRenderShapes = oContract.core.shell.model.enableBackGroundShapes;
            assert.equal(bRenderShapes, oData.bExpected, "Shapes are " + (oData.bExpected ? "" : " not ") + "rendered.");
        });
    });

    [
        {
            sDescription: "enabled when personalization is disabled, appfinder is enabled",
            oConfig: {
                enablePersonalization: false,
                applications: {
                    "Shell-home": {
                        enablePersonalization: false
                    }
                },
                enableAppFinder: true
            },
            bExpected: true
        }, {
            sDescription: "enabled when personalization is enabled",
            oConfig: {
                enablePersonalization: true,
                applications: {
                    "Shell-home": {
                        enablePersonalization: false
                    }
                },
                enableAppFinder: false
            },
            bExpected: true
        }, {
            sDescription: "enabled when personalization in Shell-home is enabled",
            oConfig: {
                enablePersonalization: undefined,
                applications: {
                    "Shell-home": {
                        enablePersonalization: true
                    }
                },
                enableAppFinder: false
            },
            bExpected: true
        }, {
            sDescription: "disabled when personalization and appfinder are disabled",
            oConfig: {
                enablePersonalization: false,
                applications: {
                    "Shell-home": {
                        enablePersonalization: false
                    }
                },
                enableAppFinder: false
            },
            bExpected: false
        }
    ].forEach(function (oData) {
        QUnit.test("AppFinder is " + oData.sDescription, function (assert) {
            var oMockConfig = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: oData.oConfig
                        }
                    }
                }
            };
            var oContract = CommonCreateConfigcontract.createConfigContract(oMockConfig);

            // check the different values
            assert.equal(oContract.core.catalog.enabled, oData.bExpected, "enableEasyAccess set correctly");
        });
    });
});
