// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit integration tests for sap.ushell.adapters.cdm.v3._LaunchPage.readUtils
 */
/* global QUnit*/
sap.ui.require([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/services/URLParsing"
], function (readUtils, URLParsing) {
    "use strict";

    QUnit.module("Integration test getVizData", {
        beforeEach: function () {
            this.oURLParsing = new URLParsing();
            this.oSite = {
                applications: {
                    "demo.Application": {
                        "sap.app": {
                            title: "app title",
                            subTitle: "app subTitle",
                            contentProviderId: "demoContentProvider1",
                            crossNavigation: {
                                inbounds: {
                                    inbound1: {
                                        semanticObject: "Action",
                                        action: "toapp"
                                    },
                                    inbound2: {
                                        semanticObject: "Action",
                                        action: "toapp",
                                        title: "inbound title",
                                        subTitle: "inbound subTitle",
                                        info: "inbound info",
                                        icon: "sap-icon://bell"
                                    }
                                }
                            },
                            info: "app info",
                            tags: {
                                keywords: ["app", "keywords"]
                            },
                            dataSources: {
                                dataSource001: {
                                    uri: "/data/source/1"
                                }
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://world"
                            }
                        }
                    }
                },
                visualizations: {
                    "standard.visualization": {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: {
                            "sap.flp": {
                                indicatorDataSource: {
                                    path: "some/path/to",
                                    refresh: 900,
                                    dataSource: "dataSource001"
                                },
                                target: {
                                    appId: "demo.Application",
                                    inboundId: "inbound1"
                                }
                            }
                        }
                    },
                    "standard.visualization2": {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: {
                            "sap.flp": {
                                indicatorDataSource: {
                                    path: "some/path/to",
                                    refresh: 900
                                },
                                target: {
                                    appId: "demo.Application",
                                    inboundId: "inbound2"
                                }
                            }
                        }
                    },
                    "standard.visualization3": {
                        vizType: "sap.ushell.StaticAppLauncher",
                        vizConfig: {
                            "sap.app": {
                                title: "viz title",
                                subTitle: "viz subTitle",
                                info: "viz info",
                                tags: {
                                    keywords: ["viz", "keywords"]
                                },
                                dataSources: {
                                    dataSource002: {
                                        uri: "/data/source/2"
                                    }
                                }
                            },
                            "sap.flp": {
                                indicatorDataSource: {
                                    path: "some/path/to",
                                    refresh: 900,
                                    dataSource: "dataSource002"
                                },
                                target: {
                                    appId: "demo.Application",
                                    inboundId: "inbound2"
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://bed"
                                }
                            }
                        }
                    }
                },
                vizTypes: {
                    "sap.ushell.StaticAppLauncher": {
                        "sap.app": {
                            id: "sap.ushell.StaticAppLauncher"
                        }
                    },
                    "sap.ushell.DynamicAppLauncher": {
                        "sap.app": {
                            id: "sap.ushell.DynamicAppLauncher"
                        }
                    },
                    "custom.vizType": {
                        "sap.app": {
                            id: "custom.vizType"
                        }
                    }
                }
            };
        }
    });

    QUnit.test("Tile with data from the application", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            vizId: "standard.visualization"
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "demoContentProvider1",
            dataSource: {
                uri: "/data/source/1"
            },
            displayFormatHint: undefined,
            icon: "sap-icon://world",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                dataSource: "dataSource001",
                path: "some/path/to",
                refresh: 900
            },
            info: "app info",
            isBookmark: false,
            numberUnit: undefined,
            keywords: ["app", "keywords"],
            subtitle: "app subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "app title",
            vizConfig: {
                "sap.flp": {
                    indicatorDataSource: {
                        dataSource: "dataSource001",
                        path: "some/path/to",
                        refresh: 900
                    },
                    target: {
                        appId: "demo.Application",
                        inboundId: "inbound1"
                    }
                }
            },
            vizId: "standard.visualization",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Tile with data from the inbound", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            vizId: "standard.visualization2",
            displayFormatHint: "flatWide"
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "demoContentProvider1",
            displayFormatHint: "flatWide",
            icon: "sap-icon://bell",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: "some/path/to",
                refresh: 900
            },
            info: "inbound info",
            isBookmark: false,
            keywords: [ "app", "keywords" ],
            numberUnit: undefined,
            subtitle: "inbound subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound2"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "inbound title",
            vizConfig: {
                "sap.flp": {
                    indicatorDataSource: {
                        path: "some/path/to",
                        refresh: 900
                    },
                    target: {
                        appId: "demo.Application",
                        inboundId: "inbound2"
                    }
                }
            },
            vizId: "standard.visualization2",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Tile with data from the visualization", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            vizId: "standard.visualization3"
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "demoContentProvider1",
            dataSource: {
                uri: "/data/source/2"
            },
            displayFormatHint: undefined,
            icon: "sap-icon://bed",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                dataSource: "dataSource002",
                path: "some/path/to",
                refresh: 900
            },
            info: "viz info",
            isBookmark: false,
            keywords: [ "viz", "keywords" ],
            numberUnit: undefined,
            subtitle: "viz subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound2"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "viz title",
            vizConfig: {
                "sap.app": {
                    title: "viz title",
                    subTitle: "viz subTitle",
                    info: "viz info",
                    tags: {
                        keywords: ["viz", "keywords"]
                    },
                    dataSources: {
                        dataSource002: {
                            uri: "/data/source/2"
                        }
                    }
                },
                "sap.flp": {
                    indicatorDataSource: {
                        dataSource: "dataSource002",
                        path: "some/path/to",
                        refresh: 900
                    },
                    target: {
                        appId: "demo.Application",
                        inboundId: "inbound2"
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://bed"
                    }
                }
            },
            vizId: "standard.visualization3",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Tile with data from the visualization reference", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            vizId: "standard.visualization3",
            title: "vizRef title",
            subTitle: "vizRef subTitle",
            info: "vizRef info",
            icon: "sap-icon://cargo-train",
            displayFormatHint: "flatWide"
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "demoContentProvider1",
            dataSource: {
                uri: "/data/source/2"
            },
            displayFormatHint: "flatWide",
            icon: "sap-icon://cargo-train",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                dataSource: "dataSource002",
                path: "some/path/to",
                refresh: 900
            },
            info: "vizRef info",
            isBookmark: false,
            keywords: [ "viz", "keywords" ],
            numberUnit: undefined,
            subtitle: "vizRef subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound2"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "vizRef title",
            vizConfig: {
                "sap.app": {
                    title: "viz title",
                    subTitle: "viz subTitle",
                    info: "viz info",
                    tags: {
                        keywords: ["viz", "keywords"]
                    },
                    dataSources: {
                        dataSource002: {
                            uri: "/data/source/2"
                        }
                    }
                },
                "sap.flp": {
                    indicatorDataSource: {
                        dataSource: "dataSource002",
                        path: "some/path/to",
                        refresh: 900
                    },
                    target: {
                        appId: "demo.Application",
                        inboundId: "inbound2"
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://bed"
                    }
                }
            },
            vizId: "standard.visualization3",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Tile with vizConfig from the visualization reference and the visualization", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            vizId: "standard.visualization3",
            title: "vizRef title",
            subTitle: "vizRef subTitle",
            info: "vizRef info",
            icon: "sap-icon://cargo-train",
            displayFormatHint: "flatWide",
            vizConfig: {
                "sap.app": {
                    title: "vizRef title"
                },
                "some.special.namespace": {
                    someProperty: "someValue"
                }
            }
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "demoContentProvider1",
            dataSource: {
                uri: "/data/source/2"
            },
            displayFormatHint: "flatWide",
            icon: "sap-icon://cargo-train",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                dataSource: "dataSource002",
                path: "some/path/to",
                refresh: 900
            },
            info: "vizRef info",
            isBookmark: false,
            keywords: [ "viz", "keywords" ],
            numberUnit: undefined,
            subtitle: "vizRef subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound2"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "vizRef title",
            vizConfig: {
                "sap.app": {
                    title: "vizRef title",
                    subTitle: "viz subTitle",
                    info: "viz info",
                    tags: {
                        keywords: ["viz", "keywords"]
                    },
                    dataSources: {
                        dataSource002: {
                            uri: "/data/source/2"
                        }
                    }
                },
                "sap.flp": {
                    indicatorDataSource: {
                        dataSource: "dataSource002",
                        path: "some/path/to",
                        refresh: 900
                    },
                    target: {
                        appId: "demo.Application",
                        inboundId: "inbound2"
                    }
                },
                "sap.ui": {
                    icons: {
                        icon: "sap-icon://bed"
                    }
                },
                "some.special.namespace": {
                    someProperty: "someValue"
                }
            },
            vizId: "standard.visualization3",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Standard Static Bookmark", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            isBookmark: true,
            title: "bookmark title",
            subTitle: "bookmark subTitle",
            info: "bookmark info",
            icon: "sap-icon://cloud",
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            },
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            }
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.StaticAppLauncher"
                    }
                }
            },
            contentProviderId: "",
            displayFormatHint: undefined,
            icon: "sap-icon://cloud",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            },
            info: "bookmark info",
            isBookmark: true,
            keywords: [],
            numberUnit: undefined,
            subtitle: "bookmark subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "bookmark title",
            vizConfig: {},
            vizId: "",
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Standard Dynamic Bookmark", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            isBookmark: true,
            title: "bookmark title",
            subTitle: "bookmark subTitle",
            info: "bookmark info",
            icon: "sap-icon://cloud",
            displayFormatHint: "standard",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            }
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.DynamicAppLauncher"
                    }
                }
            },
            contentProviderId: "",
            displayFormatHint: "standard",
            icon: "sap-icon://cloud",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            info: "bookmark info",
            isBookmark: true,
            keywords: [],
            numberUnit: undefined,
            subtitle: "bookmark subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "bookmark title",
            vizConfig: {},
            vizId: "",
            vizType: "sap.ushell.DynamicAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Old Bookmark format", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            isBookmark: true,
            title: "bookmark title",
            subtitle: "bookmark subTitle",
            info: "bookmark info",
            icon: "sap-icon://cloud",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            url: "#Action-toapp?sap-ui-app-id-hint=demo.Application"
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "sap.ushell.DynamicAppLauncher"
                    }
                }
            },
            contentProviderId: "",
            displayFormatHint: undefined,
            icon: "sap-icon://cloud",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            info: "bookmark info",
            isBookmark: true,
            keywords: [],
            numberUnit: undefined,
            subtitle: "bookmark subTitle",
            target: {
                semanticObject: "Action",
                action: "toapp",
                parameters: {
                    "sap-ui-app-id-hint": {
                            value: {
                                format: "plain",
                                value: "demo.Application"
                            }
                    }
                },
                appSpecificRoute: undefined,
                contextRaw: undefined
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "bookmark title",
            vizConfig: {},
            vizId: "",
            vizType: "sap.ushell.DynamicAppLauncher"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Custom Bookmark with vizType available", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            isBookmark: true,
            title: "bookmark title",
            subTitle: "bookmark subTitle",
            info: "bookmark info",
            icon: "sap-icon://cloud",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            vizType: "custom.vizType",
            vizConfig: {
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: true
                }
            }
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    "sap.app": {
                        id: "custom.vizType"
                    }
                }
            },
            contentProviderId: "",
            displayFormatHint: undefined,
            icon: "sap-icon://cloud",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            info: "bookmark info",
            isBookmark: true,
            keywords: [],
            numberUnit: undefined,
            subtitle: "bookmark subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "bookmark title",
            vizConfig: {
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    }
                },
                "sap.platform.runtime": {
                    includeManifest: true
                }
            },
            vizId: "",
            vizType: "custom.vizType"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });

    QUnit.test("Custom Bookmark with vizType not available", function (assert) {
        // Arrange
        var oVizRef = {
            id: "00O2TR8035SI47IE62FR3GM7X",
            isBookmark: true,
            title: "bookmark title",
            subTitle: "bookmark subTitle",
            info: "bookmark info",
            icon: "sap-icon://cloud",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            vizType: "custom.non.existent.vizType",
            vizConfig: {
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    },
                    numberUnit: "EUR"
                },
                "sap.platform.runtime": {
                    includeManifest: true
                }
            }
        };
        var oExpectedVizData = {
            _instantiationData: {
                platform: "ABAP",
                chip: {
                    chipId: "chip1"
                },
                simplifiedChipFormat: true
            },
            contentProviderId: "",
            displayFormatHint: undefined,
            icon: "sap-icon://cloud",
            id: "00O2TR8035SI47IE62FR3GM7X",
            indicatorDataSource: {
                path: "some/path/to/bookmark",
                refresh: 90
            },
            info: "bookmark info",
            isBookmark: true,
            keywords: [],
            numberUnit: undefined,
            subtitle: "bookmark subTitle",
            target: {
                appId: "demo.Application",
                inboundId: "inbound1"
            },
            targetURL: "#Action-toapp?sap-ui-app-id-hint=demo.Application",
            title: "bookmark title",
            vizConfig: {
                "sap.flp": {
                    chipConfig: {
                        chipId: "chip1"
                    },
                    numberUnit: "EUR"
                },
                "sap.platform.runtime": {
                    includeManifest: true
                }
            },
            vizId: "",
            vizType: "custom.non.existent.vizType"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSite, oVizRef, this.oURLParsing);
        // Assert
        assert.deepEqual(oResult, oExpectedVizData, "getVizData returned the correct result");
    });
});