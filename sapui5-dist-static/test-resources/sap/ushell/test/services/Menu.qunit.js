// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Menu
 * @version 1.88.1
 */
sap.ui.require([
    "sap/ushell/services/Menu",
    "sap/ushell/utils",
    "sap/ui/model/json/JSONModel"
], function (
    Menu,
    UShellUtils,
    JSONModel
) {
    "use strict";
    /* global QUnit, sinon */

    QUnit.dump.maxDepth = 9;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.aMenuEntries = [];
            this.oGetMenuEntriesStub = sandbox.stub().callsFake(function () {
                return Promise.resolve(this.aMenuEntries);
            }.bind(this));
            var oAdapter = {
                getMenuEntries: this.oGetMenuEntriesStub
            };
            this.oMenuService = new Menu(oAdapter);
            this.oGenerateUniqueIdStub = sandbox.stub(UShellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("1");
            this.oGenerateUniqueIdStub.onCall(1).returns("2");
            this.oGenerateUniqueIdStub.onCall(2).returns("3");
            this.oGenerateUniqueIdStub.onCall(3).returns("4");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns menu items with added uid", function (assert) {
        // Arrange
        this.aMenuEntries = [
            {
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "UI2 FLP Demo - Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "/UI2/FLP_DEMO_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "/UI2/FLP_DEMO_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "A Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: [
                    {
                        title: "Test Page 1",
                        description: "Testing page 1",
                        icon: "sap-icon://document",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                {
                                    name: "spaceId",
                                    value: "ZTEST_SPACE"
                                },
                                {
                                    name: "pageId",
                                    value: "ZTEST_PAGE_1"
                                }
                            ],
                            innerAppRoute: "&/some/inner/app/route"
                        },
                        menuEntries: []
                    }
                ]
            }
        ];

        var aExpectedMenuEntries = [
            {
                uid: "1",
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                uid: "2",
                title: "UI2 FLP Demo - Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "/UI2/FLP_DEMO_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "/UI2/FLP_DEMO_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                uid: "3",
                title: "A Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: [
                    {
                        uid: "4",
                        title: "Test Page 1",
                        description: "Testing page 1",
                        icon: "sap-icon://document",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                {
                                    name: "spaceId",
                                    value: "ZTEST_SPACE"
                                },
                                {
                                    name: "pageId",
                                    value: "ZTEST_PAGE_1"
                                }
                            ],
                            innerAppRoute: "&/some/inner/app/route"
                        },
                        menuEntries: []
                    }
                ]
            }
        ];

        // Act
        var oMenuPromise = this.oMenuService.getMenuEntries();

        // Assert
        return oMenuPromise.then(function (aMenuEntries) {
            assert.deepEqual(aMenuEntries, aExpectedMenuEntries, "The menu items are sorted alphabetically.");
        });
    });

    QUnit.test("Caches the promise as expected", function (assert) {
        // Arrange
        var oMenuPromiseFirstCall,
            oMenuPromiseSecondCall;
        // Act
        oMenuPromiseFirstCall = this.oMenuService.getMenuEntries();
        // Assert
        return oMenuPromiseFirstCall
            .then(function () {
                oMenuPromiseSecondCall = this.oMenuService.getMenuEntries();
                return oMenuPromiseSecondCall;
            }.bind(this))
            .then(function () {
                assert.strictEqual(oMenuPromiseFirstCall, oMenuPromiseSecondCall, "Promise was cached.");
                assert.strictEqual(this.oGetMenuEntriesStub.callCount, 1, "getMenuEntries was called once.");
            }.bind(this));
    });

    QUnit.module("The function getSpacesPagesHierarchy", {
        beforeEach: function () {
            this.aMenuEntries = [];
            var oAdapter = {
                getMenuEntries: function () {
                    return Promise.resolve(this.aMenuEntries);
                }.bind(this)
            };
            this.oMenuService = new Menu(oAdapter);
            this.oGenerateUniqueIdStub = sinon.stub(UShellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.onCall(0).returns("1");
            this.oGenerateUniqueIdStub.onCall(1).returns("2");
            this.oGenerateUniqueIdStub.onCall(2).returns("3");
            sinon.spy(this.oMenuService, "getMenuEntries");
        },
        afterEach: function () {
            this.oMenuService.getMenuEntries.restore();
            this.oGenerateUniqueIdStub.restore();
        }
    });

    QUnit.test("Returns an object with no spaces if no space exists", function (assert) {
        // Arrange
        this.aMenuEntries = [];
        var oExpected = {
            spaces: []
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "The Spaces/Pages hierarchy was returned correctly.");
        });
    });

    QUnit.test("Returns the hierarchy if some sample spaces exist", function (assert) {
        // Arrange
        this.aMenuEntries = [
            {
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: "ZTEST_SPACE"
                        },
                        {
                            name: "pageId",
                            value: "ZTEST_PAGE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "UI2 FLP Demo - Test Space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "pageId",
                            value: "/UI2/FLP_DEMO_PAGE"
                        },
                        {
                            name: "spaceId",
                            value: "/UI2/FLP_DEMO_SPACE"
                        }
                    ],
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            },
            {
                title: "UI2 FLP Demo - Test Space Multiple Pages",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: [
                    {
                        title: "UI2 FLP Demo - Test Space Page 1",
                        description: "Testing Page 1",
                        icon: "sap-icon://document",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                {
                                    name: "pageId",
                                    value: "/UI2/FLP_DEMO_PAGE_1"
                                },
                                {
                                    name: "spaceId",
                                    value: "ZTEST_SPACE_MULTIPLE_PAGES"
                                }
                            ],
                            innerAppRoute: "&/some/inner/app/route_1"
                        },
                        menuEntries: []
                    },
                    {
                        title: "UI2 FLP Demo - Test Space Page 2",
                        description: "Testing Page 2",
                        icon: "sap-icon://document",
                        type: "IBN",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [
                                {
                                    name: "pageId",
                                    value: "/UI2/FLP_DEMO_PAGE_2"
                                },
                                {
                                    name: "spaceId",
                                    value: "ZTEST_SPACE_MULTIPLE_PAGES"
                                }
                            ],
                            innerAppRoute: "&/some/inner/app/route_2"
                        },
                        menuEntries: []
                    }
                ]
            },
            {
                title: "UI2 FLP Demo - Test Space without page",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: []
            },
            {
                title: "UI2 FLP Demo - Another Test Space without page",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "text",
                menuEntries: [
                    {
                        title: "UI2 FLP Demo - Menu entry which launches URL",
                        description: "Calling tagesschau.de",
                        icon: "sap-icon://document",
                        type: "URL",
                        target: {
                            URL: "http://tagesschau.de"
                        },
                        menuEntries: []
                    }
                ]
            }
        ];

        var oExpected = {
            spaces: [
                {
                    id: "ZTEST_SPACE",
                    title: "ZTest space",
                    pages: [
                        {
                            id: "ZTEST_PAGE",
                            title: "ZTest space"
                        }
                    ]
                },
                {
                    id: "/UI2/FLP_DEMO_SPACE",
                    title: "UI2 FLP Demo - Test Space",
                    pages: [
                        {
                            id: "/UI2/FLP_DEMO_PAGE",
                            title: "UI2 FLP Demo - Test Space"
                        }
                    ]
                },
                {
                    id: "ZTEST_SPACE_MULTIPLE_PAGES",
                    title: "UI2 FLP Demo - Test Space Multiple Pages",
                    pages: [
                        {
                            id: "/UI2/FLP_DEMO_PAGE_1",
                            title: "UI2 FLP Demo - Test Space Page 1"
                        },
                        {
                            id: "/UI2/FLP_DEMO_PAGE_2",
                            title: "UI2 FLP Demo - Test Space Page 2"
                        }
                    ]
                }
            ]
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "The Spaces/Pages hierarchy was returned correctly.");
        });
    });

    QUnit.test("Caches the promise as expected", function (assert) {
        // Arrange
        var oSpacesPagesHierarchyPromiseFirstCall,
            oSpacesPagesHierarchyPromiseSecondCall;

        // Act
        oSpacesPagesHierarchyPromiseFirstCall = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oSpacesPagesHierarchyPromiseFirstCall
            .then(function () {
                oSpacesPagesHierarchyPromiseSecondCall = this.oMenuService.getSpacesPagesHierarchy();
                return oSpacesPagesHierarchyPromiseSecondCall;
            }.bind(this))
            .then(function () {
                assert.strictEqual(oSpacesPagesHierarchyPromiseFirstCall, oSpacesPagesHierarchyPromiseSecondCall, "Promise was cached.");
                assert.strictEqual(this.oMenuService.getMenuEntries.callCount, 1, "getMenuEntries was called once.");
            }.bind(this));
    });

    QUnit.test("Returns an empty array, if an exception occurs during processing", function (assert) {
        // Arrange
        this.aMenuEntries = [
            {
                title: "ZTest space",
                description: "Testing space",
                icon: "sap-icon://document",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: undefined,
                    innerAppRoute: "&/some/inner/app/route"
                },
                menuEntries: []
            }
        ];

        var oExpected = {
            spaces: []
        };

        // Act
        var oMenuPromise = this.oMenuService.getSpacesPagesHierarchy();

        // Assert
        return oMenuPromise.then(function (oHierarchy) {
            assert.deepEqual(oHierarchy, oExpected, "Returns an empty spaces array, if an exception occurs during processing of invalid menu data.");
        });
    });

    QUnit.module("The function hasMultiplePages", {
        beforeEach: function () {
            var aSpacesPagesHierarchy = {
                spaces: [
                    {
                        id: "ZTEST_SPACE",
                        title: "ZTest space",
                        pages: [
                            {
                                id: "ZTEST_PAGE",
                                title: "ZTest space"
                            }
                        ]
                    },
                    {
                        id: "/UI2/FLP_DEMO_SPACE",
                        title: "UI2 FLP Demo - Test Space",
                        pages: [
                            {
                                id: "/UI2/FLP_DEMO_PAGE",
                                title: "UI2 FLP Demo - Test Space"
                            }
                        ]
                    },
                    {
                        id: "ZTEST_SPACE_MULTIPLE_PAGES",
                        title: "UI2 FLP Demo - Test Space Multiple Pages",
                        pages: [
                            {
                                id: "/UI2/FLP_DEMO_PAGE_1",
                                title: "UI2 FLP Demo - Test Space Page 1"
                            },
                            {
                                id: "/UI2/FLP_DEMO_PAGE_2",
                                title: "UI2 FLP Demo - Test Space Page 2"
                            }
                        ]
                    }
                ]
            };

            this.oMenuService = new Menu({});
            this.oGetSpacesPagesHierarchyStub = sinon.stub(this.oMenuService, "getSpacesPagesHierarchy").resolves(aSpacesPagesHierarchy);
        },
        afterEach: function () {
            this.oGetSpacesPagesHierarchyStub.restore();
        }
    });

    QUnit.test("Returns 'true' if a space has multiple pages assigned", function (assert) {
        return this.oMenuService.hasMultiplePages("ZTEST_SPACE_MULTIPLE_PAGES").then(function (bHasMultiple) {
            assert.ok(bHasMultiple, "The function hasMultiplePages returns 'true' if a space has multiple pages assigned.");
        });
    });

    QUnit.test("Returns 'false' if a space only has one page assigned", function (assert) {
        return this.oMenuService.hasMultiplePages("ZTEST_SPACE").then(function (bHasMultiple) {
            assert.notOk(bHasMultiple, "The function hasMultiplePages returns 'false' if a space has only one page assigned.");
        });
    });

    QUnit.test("Returns 'false' if a space with the specified ID doesn't exist", function (assert) {
        return this.oMenuService.hasMultiplePages("NON_EXISTING_SPACE").then(function (bHasMultiple) {
            assert.notOk(bHasMultiple, "The function hasMultiplePages returns 'false' if the space with the specified ID couldn't be found.");
        });
    });

    QUnit.module("The function getDefaultPage", {
        beforeEach: function () {
            this.oPage = {
                id: "myId"
            };

            var aSpacesPagesHierarchy = {
                spaces: [
                    {
                        id: "ZTEST_SPACE",
                        pages: [
                            {
                                iHaveNoId: "ZTEST_PAGE"
                            }
                        ]
                    },
                    {
                        iHaveNoId: "/UI2/FLP_DEMO_SPACE",
                        pages: [
                            {
                                id: "/UI2/FLP_DEMO_PAGE"
                            }
                        ]
                    },
                    {
                        id: "ZTEST_SPACE_MULTIPLE_PAGES",
                        pages: [
                            this.oPage
                        ]
                    }
                ]
            };

            this.oMenuService = new Menu({});
            this.oGetSpacesPagesHierarchyStub = sandbox.stub(this.oMenuService, "getSpacesPagesHierarchy").resolves(aSpacesPagesHierarchy);

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the first page with an id inside a space with an id", function (assert) {
        // Arrange

        // Act
        return this.oMenuService.getDefaultPage().then(function (oPage) {
            // Assert
            assert.strictEqual(oPage, this.oPage, "The right page was returned");
            assert.strictEqual(this.oGetSpacesPagesHierarchyStub.callCount, 1, "getSpacesPagesHierarchy was called once");
        }.bind(this));
    });

    QUnit.module("The function _updateNode", {
        beforeEach: function () {
            this.oGenerateUniqueIdStub = sandbox.stub(UShellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.returns("42");

            this.oMenuService = new Menu({});
            this.aNodes = [{
                id: "space01",
                "help-id": "Space-space01",
                title: "Space 1",
                description: "Description of space 1",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page1"}, {name: "spaceId", value: "space01"}]
                },
                uid: "id-1604069611504-17"
            }, {
                id: "emptySpace",
                "help-id": "Space-emptySpace",
                title: "empty Space",
                description: "Description of empty space",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "emptyPage"}, {name: "spaceId", value: "emptySpace"}]
                },
                uid: "id-1604069611505-18"
            }, {
                id: "space02",
                "help-id": "Space-space02",
                title: "Space 2",
                description: "Description of space 2",
                icon: "sap-icon://sonography",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page2"}, {name: "spaceId", value: "space02"}]
                },
                uid: "id-1604069611505-19"
            }, {
                id: "space03",
                "help-id": "Space-space03",
                title: "Space 3",
                description: "Description of space 3",
                icon: "sap-icon://nurse",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space03"}]
                },
                uid: "id-1604069611505-20"
            }, {
                id: "space04",
                "help-id": "Space-space04",
                title: "Space 4 (Page 3)",
                description: "Contains same page as Space 3",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space04"}]
                },
                uid: "id-1604069611505-21"
            }, {
                id: "space05",
                "help-id": "Space-space05",
                title: "Space 5",
                description: "Description of Space 5",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page4"}, {name: "spaceId", value: "space05"}]
                },
                menuEntries: [{
                    id: "space05page4",
                    "help-id": "Page-page4",
                    title: "Page 4",
                    description: "Description of Page 4",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{name: "pageId", value: "page4"}, {name: "spaceId", value: "space05"}]
                    },
                    uid: "id-1604069611505-23"
                }, {
                    id: "space05page5",
                    "help-id": "Space-page5",
                    title: "Page 5",
                    description: "Description of Page 5",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{name: "pageId", value: "page5"}, {name: "spaceId", value: "space05"}]
                    },
                    uid: "id-1604069611505-24"
                }],
                uid: "id-1604069611505-22"
            }, {
                id: "space06",
                "help-id": "Space-space06",
                title: "Space 6",
                description: "Description of space 6",
                icon: "sap-icon://syringe",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page6"}, {name: "spaceId", value: "space06"}]
                },
                uid: "id-1604069611505-25"
            }];
            this.oManagedTree = {
                "help-id": "Space-space05",
                title: "Space 5",
                description: "Description of Space 5",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page4"}, {
                        name: "spaceId",
                        value: "space05"
                    }]
                },
                menuEntries: [{
                    title: "Page 4",
                    description: "Description of Page 4",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{name: "pageId", value: "page4"}, {
                            name: "spaceId",
                            value: "space05"
                        }]
                    }
                }]
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Works with an empty array of nodes", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("test-node-id", [], this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [], "The result was empty");
    });

    QUnit.test("Leaves the nodes unchanged if no node with the given id is found", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("test-node-id", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, this.aNodes, "The nodes were not changed");
    });

    QUnit.test("Replaces a root node with the managed tree", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("space05", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [{
            id: "space01",
            "help-id": "Space-space01",
            title: "Space 1",
            description: "Description of space 1",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page1"}, {name: "spaceId", value: "space01"}]
            },
            uid: "id-1604069611504-17"
        }, {
            id: "emptySpace",
            "help-id": "Space-emptySpace",
            title: "empty Space",
            description: "Description of empty space",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "emptyPage"}, {name: "spaceId", value: "emptySpace"}]
            },
            uid: "id-1604069611505-18"
        }, {
            id: "space02",
            "help-id": "Space-space02",
            title: "Space 2",
            description: "Description of space 2",
            icon: "sap-icon://sonography",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page2"}, {name: "spaceId", value: "space02"}]
            },
            uid: "id-1604069611505-19"
        }, {
            id: "space03",
            "help-id": "Space-space03",
            title: "Space 3",
            description: "Description of space 3",
            icon: "sap-icon://nurse",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space03"}]
            },
            uid: "id-1604069611505-20"
        }, {
            id: "space04",
            "help-id": "Space-space04",
            title: "Space 4 (Page 3)",
            description: "Contains same page as Space 3",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space04"}]
            },
            uid: "id-1604069611505-21"
        }, {
            "help-id": "Space-space05",
            title: "Space 5",
            description: "Description of Space 5",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            uid: "42",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page4"}, {
                    name: "spaceId",
                    value: "space05"
                }]
            },
            menuEntries: [{
                title: "Page 4",
                description: "Description of Page 4",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                uid: "42",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page4"}, {
                        name: "spaceId",
                        value: "space05"
                    }]
                }
            }]
        }, {
            id: "space06",
            "help-id": "Space-space06",
            title: "Space 6",
            description: "Description of space 6",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page6"}, {name: "spaceId", value: "space06"}]
            },
            uid: "id-1604069611505-25"
        }], "The nodes were not changed");
    });

    QUnit.test("Replaces a child node with the managed tree", function (assert) {
        // Act
        var aResult = this.oMenuService._updateNode("space05", this.aNodes, this.oManagedTree);
        // Assert
        assert.deepEqual(aResult, [{
            id: "space01",
            "help-id": "Space-space01",
            title: "Space 1",
            description: "Description of space 1",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page1"}, {name: "spaceId", value: "space01"}]
            },
            uid: "id-1604069611504-17"
        }, {
            id: "emptySpace",
            "help-id": "Space-emptySpace",
            title: "empty Space",
            description: "Description of empty space",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "emptyPage"}, {name: "spaceId", value: "emptySpace"}]
            },
            uid: "id-1604069611505-18"
        }, {
            id: "space02",
            "help-id": "Space-space02",
            title: "Space 2",
            description: "Description of space 2",
            icon: "sap-icon://sonography",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page2"}, {name: "spaceId", value: "space02"}]
            },
            uid: "id-1604069611505-19"
        }, {
            id: "space03",
            "help-id": "Space-space03",
            title: "Space 3",
            description: "Description of space 3",
            icon: "sap-icon://nurse",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space03"}]
            },
            uid: "id-1604069611505-20"
        }, {
            id: "space04",
            "help-id": "Space-space04",
            title: "Space 4 (Page 3)",
            description: "Contains same page as Space 3",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page3"}, {name: "spaceId", value: "space04"}]
            },
            uid: "id-1604069611505-21"
        }, {
            "help-id": "Space-space05",
            title: "Space 5",
            description: "Description of Space 5",
            icon: "sap-icon://stethoscope",
            type: "IBN",
            uid: "42",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [{name: "pageId", value: "page4"}, {
                    name: "spaceId",
                    value: "space05"
                }]
            },
            menuEntries: [{
                title: "Page 4",
                description: "Description of Page 4",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                uid: "42",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{name: "pageId", value: "page4"}, {
                        name: "spaceId",
                        value: "space05"
                    }]
                }
            }]
        }, {
            id: "space06",
            "help-id": "Space-space06",
            title: "Space 6",
            description: "Description of space 6",
            icon: "sap-icon://syringe",
            type: "IBN",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    {name: "pageId", value: "page6"},
                    {name: "spaceId", value: "space06"}
                ]
            },
            uid: "id-1604069611505-25"
        }], "The nodes were not changed");
    });

    QUnit.module("The function _getNodeInfo", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the managerId if the parent node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                managerId: "test-manager-id",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns the managerId if the given node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    managerId: "test-manager-id"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns the managerId if the root node is the managed node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            managerId: "test-manager-id",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, "test-manager-id", "The managerId was correctly returned");
    });

    QUnit.test("Returns null if the managerId is in a different node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "x",
            managerId: "test-manager-id",
            menuEntries: [{
                id: "y"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node"
                }]
            }]
        }, {
            id: "a",
            managerId: "test-manager-id-2",
            menuEntries: [{
                id: "b"
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns null if the manager id is a child of the given nodeId", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    menuEntries: [{
                        id: "4",
                        managerId: "test-manager-id"
                    }]
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns null if no manager id is given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "1",
            menuEntries: [{
                id: "2",
                menuEntries: [{
                    id: "test-node",
                    menuEntries: [{
                        id: "4"
                    }]
                }]
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.managerId, null, "The managerId was null");
    });

    QUnit.test("Returns isRootNode:false if no nodes are given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", []);
        // Assert
        assert.notOk(oResult.isRootNode, "The result was false");
    });

    QUnit.test("Returns isRootNode:false the given nodeId is not a root node", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "test-node"
            }]
        }, {
            id: "1"
        }, {
            id: "2"
        }]);
        // Assert
        assert.notOk(oResult.isRootNode, "The result was false");
    });

    QUnit.test("Returns isRootNode:true if the given nodeId is a root node", function (assert) {
        // Act
        var bResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "test-node"
        }, {
            id: "2"
        }]);
        // Assert
        assert.ok(bResult.isRootNode, "The result was true.");
    });

    QUnit.test("Returns node:null if no nodes are given", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", []);
        // Assert
        assert.strictEqual(null, oResult.node, "The result was null.");
    });

    QUnit.test("Returns null if no node with the given id exists", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "1-1",
                menuEntries: [{
                    id: "1-2",
                    menuEntries: [{
                        id: "1-3"
                    }]
                }]
            }]
        }, {
            id: "2",
            menuEntries: [{
                id: "2-1"
            }]
        }]);
        // Assert
        assert.strictEqual(oResult.node, null, "The node was found");
    });

    QUnit.test("Finds the node with the given id", function (assert) {
        // Act
        var oResult = this.oMenuService._getNodeInfo("test-node", [{
            id: "0",
            menuEntries: [{
                id: "0-1"
            }]
        }, {
            id: "1",
            menuEntries: [{
                id: "1-1",
                menuEntries: [{
                    id: "1-2",
                    menuEntries: [{
                        id: "test-node"
                    }]
                }]
            }]
        }, {
            id: "2",
            menuEntries: [{
                id: "2-1"
            }]
        }]);
        // Assert
        assert.deepEqual(oResult.node, { id: "test-node" }, "The node was found");
    });

    QUnit.module("The function _nodeManagementPermitted", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
            this.oGetNodeInfoStub = sandbox.stub(this.oMenuService, "_getNodeInfo");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns false if node is not found", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: null,
            managerId: "test",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.notOk(bResult, "The result was false.");
    });

    QUnit.test("Returns false if the found managerId is different from the given managerId", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: {test: "node"},
            managerId: "test-manager-id-2",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.notOk(bResult, "The result was fasle.");
    });

    QUnit.test("Returns true if no managerId is found", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: {test: "node"},
            managerId: null,
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.ok(bResult, "The result was true.");
    });

    QUnit.test("Returns true if the found managerId is the same as the given managerId", function (assert) {
        // Arrange
        this.oGetNodeInfoStub.returns({
            node: {test: "node"},
            managerId: "test-manager-id",
            isRootNode: true
        });
        // Act
        var bResult = this.oMenuService._nodeManagementPermitted("test-node-id", [], "test-manager-id");
        // Assert
        assert.ok(bResult, "The result was true.");
    });

    QUnit.module("The function getEntryProvider", {
        beforeEach: function () {
            this.oMenuService = new Menu({});
            this.oModel = new JSONModel();
            this.oMenuService.oModel = this.oModel;
            this.oGetMenuEntriesStub = sandbox.stub(this.oMenuService, "getMenuEntries");
            this.oGenerateUniqueIdStub = sandbox.stub(UShellUtils, "generateUniqueId");
            this.oGenerateUniqueIdStub.returns("42");

            this.aNodes = [{
                id: "node-1",
                title: "Node 1",
                description: "Node 1 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-1"
                    }]
                },
                menuEntries: [{
                    id: "node-1-1",
                    title: "Node 1 1",
                    description: "Node 1 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{
                            name: "pageId",
                            value: "page1"
                        }, {
                            name: "nodeId",
                            value: "node-1-1"
                        }]
                    }
                }]
            }, {
                id: "node-2",
                title: "Node 2",
                description: "Node 2 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-2"
                    }]
                }
            }, {
                id: "node-3",
                title: "Node 3",
                description: "Node 3 Description",
                icon: "sap-icon://stethoscope",
                managerId: "existing-test-manager-id",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-3"
                    }]
                },
                menuEntries: [{
                    id: "node-3-1",
                    title: "Node 3 1",
                    description: "Node 3 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{
                            name: "pageId",
                            value: "page1"
                        }, {
                            name: "nodeId",
                            value: "node-3-1"
                        }]
                    }
                }]
            }];

            this.oGetMenuEntriesStub.returns(Promise.resolve(this.aNodes));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns empty object for an empty array of nodes", function (assert) {
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function (result) {
            // Assert
            assert.deepEqual(result, {}, "The result was empty object.");
        });
    });

    QUnit.test("Returns empty object if no nodes exist", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.returns(Promise.resolve([]));
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function (result) {
            // Assert
            assert.deepEqual(result, {}, "The result was empty object.");
        });
    });

    QUnit.test("Does not allow to be called twice by the same plugin", function (assert) {
        // Arrange
        this.oMenuService.getEntryProvider("test-manager-id", []);
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", []).then(function () {
            // Assert
            assert.notOk(true, "The function could be called twice by the same plugin");
        }).catch(function (e) {
            assert.ok(true, "The promise was rejected.");
        });
    });

    QUnit.test("Returns an object with the update function mapped to the node ID for existing non-root node IDs", function (assert) {
        // Act
        return this.oMenuService.getEntryProvider("test-manager-id", [
            "node-1",
            "my-random-test-node",
            "node-1-1",
            "node-3-1"
        ]).then(function (oMenuEntryProvider) {
            // Assert
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("my-random-test-node"), false, "The result did not have the inexistent nodeId as property.");
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("node-3-1"), false, "The result did not have the managed nodeId as property.");
            assert.strictEqual(oMenuEntryProvider.hasOwnProperty("node-1-1"), true, "The result had the expected nodeId as property.");
            assert.strictEqual(typeof oMenuEntryProvider["node-1-1"], "object", "The result node is an object.");

            oMenuEntryProvider["node-1-1"].setData({
                title: "MY Space",
                description: "Description of my space",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page4"
                    }, {
                        name: "spaceId",
                        value: "space05"
                    }]
                },
                menuEntries: [{
                    title: "MY Page",
                    description: "Description of my page",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{
                            name: "pageId",
                            value: "page4"
                        }, {
                            name: "spaceId",
                            value: "space05"
                        }]
                    }
                }]
            });

            assert.deepEqual(this.oModel.getData(), [{
                id: "node-1",
                title: "Node 1",
                description: "Node 1 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-1"
                    }]
                },
                menuEntries: [{
                    title: "MY Space",
                    description: "Description of my space",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    uid: "42",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{
                            name: "pageId",
                            value: "page4"
                        }, {
                            name: "spaceId",
                            value: "space05"
                        }]
                    },
                    menuEntries: [{
                        title: "MY Page",
                        description: "Description of my page",
                        icon: "sap-icon://stethoscope",
                        type: "IBN",
                        uid: "42",
                        target: {
                            semanticObject: "Launchpad",
                            action: "openFLPPage",
                            parameters: [{
                                name: "pageId",
                                value: "page4"
                            }, {
                                name: "spaceId",
                                value: "space05"
                            }]
                        }
                    }]
                }]
            }, {
                id: "node-2",
                title: "Node 2",
                description: "Node 2 Description",
                icon: "sap-icon://stethoscope",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-2"
                    }]
                }
            }, {
                id: "node-3",
                title: "Node 3",
                description: "Node 3 Description",
                icon: "sap-icon://stethoscope",
                managerId: "existing-test-manager-id",
                type: "IBN",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [{
                        name: "pageId",
                        value: "page1"
                    }, {
                        name: "nodeId",
                        value: "node-3"
                    }]
                },
                menuEntries: [{
                    id: "node-3-1",
                    title: "Node 3 1",
                    description: "Node 3 1 Description",
                    icon: "sap-icon://stethoscope",
                    type: "IBN",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [{
                            name: "pageId",
                            value: "page1"
                        }, {
                            name: "nodeId",
                            value: "node-3-1"
                        }]
                    }
                }]
            }], "The node tree was changed as expected.");
        }.bind(this));
    });
});