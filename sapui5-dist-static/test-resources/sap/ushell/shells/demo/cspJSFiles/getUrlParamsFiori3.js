// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

function getUrlParams() {
    "use strict";

    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });

    // Change homepage content (fioriDemoConfigCards includes several Cards)
    vars["demoConfig"] = "fioriDemoConfigCards";
    return vars;
}

var configFileUrl = decodeURIComponent(getUrlParams()["configFileUrl"]),
    sapUshellConfig = {
        services: {
            "Container": {
                "adapter": {
                    "config": {
                        "image": "img/283513_SAP.jpg"
                    }
                }
            },

            NavTargetResolution: {
                config: {
                // enable to inject the NavTarget for #Test-url etc. directly via url parameters
                // .../FioriLaunchpad.html?sap-ushell-test-url-url=%2Fushell%2Ftest-resources%2Fsap%2Fushell%2Fdemoapps%2FAppNavSample&sap-ushell-test-url-additionalInformation=SAPUI5.Component%3Dsap.ushell.demo.AppNavSample#Test-url
                    allowTestUrlComponentConfig : true
                }
            },
            SupportTicket: {
                    // service has to be enabled explicitly for the demo platform
                config: {
                    enabled: true
                }
            },
            EndUserFeedback: {
                config: {
                    enabled: true
                }
            },
            UsageAnalytics: {
                config: {
                    enabled: true,
                    setUsageAnalyticsPermitted : true,
                    logClickEvents: false,
                    logPageLoadEvents: false,
                    pubToken: "f5d00f4d-e968-1649-8285-66ee86ba7845",
                    baseUrl: "https://poc.warp.sap.com/tracker/"
                }
            },
            Notifications: {
                config: {
                    enabled: true,
                    serviceUrl: "/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model",
                    //serviceUrl: "/sap/opu/odata4/iwngw/notification/default/iwngw/notification_srv/0001",
                    pollingIntervalInSeconds: 30
                }
            },
            AllMyApps: {
                config: {
                    enabled: true,
                    showHomePageApps: true,
                    showCatalogApps: true,
                    showExternalProviders: true
                }
            },
            UserInfo: {
                adapter: {
                    config: {
                        themes: [
                            { id: "sap_belize_plus",    name: "SAP Belize Plus" },
                            { id: "sap_belize",         name: "SAP Belize" },
                            { id: "theme1_id",          name: "Custom Theme" },
                            { id: "sap_fiori_3_hcb",     name: "SAP Quartz HCB"},
                            { id: "sap_fiori_3_hcw",     name: "SAP Quartz HCW"},
                            { id: "sap_fiori_3",        name: "SAP Quartz Light"}
                        ]
                    }
                }
            },
            ClientSideTargetResolution: {
                adapter: {
                    config: {
                        inbounds: {
                            startTransactionSample: {
                                semanticObject: "Shell",
                                action: "startWDA",
                                title: "CRM Europe",
                                signature: {
                                    parameters: {
                                        "sap-system": {
                                            required: true,
                                            filter: {
                                                value: "AB1CLNT000"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                },
                                deviceTypes: {
                                    desktop: true,
                                    tablet: false,
                                    phone: false

                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?array-param1=value1&array-param1=value2"
                                }
                            },
                            startTransactionSample2: {
                                semanticObject: "Shell",
                                action: "startGUI",
                                signature: {
                                    parameters: {
                                        "sap-system": {
                                            required: true,
                                            filter: {
                                                value: "U1YCLNT120"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                },
                                deviceTypes: {
                                    desktop: true,
                                    tablet: false,
                                    phone: false

                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?array-param1=value1&array-param1=value2"
                                }
                            },
                            "startTransactionSample3": {
                                semanticObject: "Shell",
                                action: "startWDA",
                                title: "U1Y client 000",
                                signature: {
                                    parameters: {
                                        "sap-system": {
                                            required: true,
                                            filter: {
                                                value: "LOCAL"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                },
                                deviceTypes: {
                                    desktop: true,
                                    tablet: false,
                                    phone: false

                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?array-param1=value1&array-param1=value2"
                                }
                            }
                        }
                    }
                }
            }
        },
        // Enable feature switch for fiori 3
        ushell: {
            home: {
                featuredGroup: {
                    enable: true
                },
                gridContainer: true
            }
        },
        renderers: {
            fiori2 : {
                componentData: {
                    config: {
                        enableNotificationsUI: true,
                        enableSetTheme: true,
                        enableSetLanguage: true,
                        enableHelp: true,
                        enablePersonalization: true,
                        preloadLibrariesForRootIntent: false,
                        enableRecentActivity: true,
                        enableRecentActivityLogging: true,
                        enableContentDensity: true,
                        enableUserDefaultParameters: true,
                        enableBackGroundShapes: false,
                        disableAppFinder: false,
                        moveGiveFeedbackActionToShellHeader: true,
                        moveContactSupportActionToShellHeader: true,
                        //moveEditHomePageActionToShellHeader: true,
                        //moveUserSettingsActionToShellHeader: true,
                        //moveAppFinderActionToShellHeader: true,
                        enableUserImgConsent: false,
                        sizeBehavior : "Responsive",
                        title: "Second Title",
                        enableAutomaticSignout : false,
                        applications: {
                            "Shell-home" : {
                                optimizeTileLoadingThreshold: 200,
                                enableEasyAccess: true,
                                enableEasyAccessSAPMenu: true,
                                enableEasyAccessSAPMenuSearch: true,
                                enableEasyAccessUserMenu: true,
                                enableEasyAccessUserMenuSearch: true,
                                enableCatalogSearch: true,
                                enableCatalogTagFilter: true,
                                disableSortedLockedGroups: false,
                                enableTileActionsIcon: false,
                                appFinderDisplayMode: "appBoxes",  //"tiles"
                                enableHideGroups: true,
                                homePageGroupDisplay: "scroll",
                                enableHomePageSettings: true
                            }
                        },
                        rootIntent: "Shell-home",
                        esearch: {
                            searchBusinessObjects: true
                        }
                    }
                }
            }
        },
        bootstrapPlugins: {
            NotificationsSampleData: {
                component: "sap.ushell.demo.NotificationsSampleData",
                url: "../../../../../test-resources/sap/ushell/demoapps/NotificationsSampleData"
            },
            PluginAddDummyCopilot: {
                component: "sap.ushell.demo.PluginAddDummyCopilot",
                url: "../../../../../test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddDummyCopilot"
            },
            PluginAddFakeCopilot: {
                component: "sap.ushell.demo.PluginAddFakeCopilot",
                url: "../../../../../test-resources/sap/ushell/demoapps/BootstrapPluginSample/PluginAddFakeCopilot"
            }
        }
    };

var oXHR = new XMLHttpRequest();
if (configFileUrl !== "undefined") {
    oXHR.open("GET", configFileUrl, false);
    oXHR.onreadystatechange = function () {
        "use strict";
        if (this.status === 200 && this.readyState === 4) {
            sapUshellConfig = JSON.parse(oXHR.responseText);
        }
    };
    oXHR.send();
}

window["sap-ushell-config"] = sapUshellConfig;