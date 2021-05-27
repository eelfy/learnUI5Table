// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Pages
 */
sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/services/Pages",
    "sap/ushell/utils/RestrictedJSONModel",
    "sap/ui/model/Model",
    "sap/base/Log",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/base/util/extend",
    "sap/base/util/deepClone"
], function (
    resources,
    Pages,
    RestrictedJSONModel,
    Model,
    Log,
    readUtils,
    readVisualizations,
    ushellUtils,
    Config,
    utilsCdm,
    extend,
    deepClone
) {
    "use strict";

    /* global QUnit, sinon*/

    QUnit.dump.maxDepth = 10;

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("initial Properties are set correctly", function (assert) {
        //Act
        var oPagesService = new Pages();

        //Assert
        assert.strictEqual(oPagesService.COMPONENT_NAME, "sap/ushell/services/Pages", "initial value was successfully set");
        assert.strictEqual(oPagesService._oCdmServicePromise, "CommonDataModel", "Cdm Service was successfully called");
        assert.strictEqual(oPagesService._oURLParsingServicePromise, "URLParsing", "URLParsing Service was successfully called");
        assert.ok(oPagesService._oPagesModel instanceof Model, "Model was successfully added");
        assert.strictEqual(oPagesService._bImplicitSaveEnabled, true, "Implicit save is enabled by default");
        assert.deepEqual(oPagesService._aPagesToBeSaved, [], "_aPagesToBeSaved was successfully initialized");
    });

    QUnit.module("The _generateId function", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
            this.oPagesService = new Pages();
            this.oGetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub(this.oPagesService, "getModel");
            this.oGetPagePathStub = sandbox.stub(this.oPagesService, "getPagePath");
            this.oGenerateUniqueIdStub = sandbox.stub(ushellUtils, "generateUniqueId");
            this.sPageIdMock = "sPageIdMock";
            this.oGetPagePathStub.withArgs(this.sPageIdMock).returns("/pages/0");
            this.oGetPropertyStub.withArgs("/pages/0").returns({
                sections: [{
                    id: "sec1",
                    visualizations: [
                        { id: "viz1" },
                        { id: "viz2" }
                    ]
                }, {
                    id: "sec2",
                    visualizations: [
                        { id: "viz3" },
                        { id: "viz4" }
                    ]
                }]
            });

            this.oGetModelStub.returns({
                getProperty: this.oGetPropertyStub
            });
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Calls '_generateUniqueId'", function (assert) {
        //Arrange
        var aExpectedIds = ["sec1", "viz1", "viz2", "sec2", "viz3", "viz4"];

        //Act
        this.oPagesService._generateId(this.sPageIdMock);

        //Assert
        assert.strictEqual(this.oGenerateUniqueIdStub.callCount, 1, "_generateUniqueId was called once");
        assert.deepEqual(this.oGenerateUniqueIdStub.getCall(0).args, [aExpectedIds], "_generateUniqueId was called with correct parameters");
    });

    QUnit.module("enableImplicitSave", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oPagesService = new Pages();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Saves the value", function (assert) {
        // Arrange
        // Act
        this.oPagesService.enableImplicitSave(true);
        // Assert
        assert.strictEqual(this.oPagesService._bImplicitSaveEnabled, true, "the correct value was saved");
    });

    QUnit.module("getPagePath", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("page with pageId is in model", function (assert) {
        //Arrange
        var oPagesService = new Pages();
        oPagesService._oPagesModel._setProperty("/pages/0", { id: "ImHere" });

        //Act
        var sPath = oPagesService.getPagePath("ImHere");

        //Assert
        assert.strictEqual(sPath, "/pages/0", "path to page was returned");
    });

    QUnit.test("page with pageId is not in model", function (assert) {
        //Arrange
        var oPagesService = new Pages();

        //Act
        var sPath = oPagesService.getPagePath("ImNotHere");

        //Assert
        assert.strictEqual(sPath, "", "An empty string was returned");
    });

    QUnit.module("loadPage", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            this.sMockError = "Custom Error";
            this.oGetPageStub = sandbox.stub();
            this.oGetPageStub.resolves();
            this.oGetVisualizationsStub = sandbox.stub().resolves();
            this.oGetApplicationsStub = sandbox.stub().resolves();
            this.oGetVizTypesStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container.getServiceAsync = this.oGetServiceAsyncStub;
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub,
                getVisualizations: this.oGetVisualizationsStub,
                getApplications: this.oGetApplicationsStub,
                getVizTypes: this.oGetVizTypesStub
            });
            this.oPagesService = new Pages();
            this.oGetModelForPageStub = sandbox.stub(this.oPagesService, "_getModelForPage").resolves({});
            this.oGetPagePath = sandbox.stub(this.oPagesService, "getPagePath").returns("");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("CDM Service cannot be resolved", function (assert) {
        //Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.sMockError);

        //Act
        var oPromise = this.oPagesService.loadPage("ZTEST");

        //Assert
        return oPromise.catch(function (oError) {
            assert.equal(oError, this.sMockError, "Error was was handled correctly");
        }.bind(this));
    });

    QUnit.test("Site cannot be gathered from CDM Service", function (assert) {
        //Arrange
        this.oGetPageStub.rejects(this.sMockError);

        //Act
        var oPromise = this.oPagesService.loadPage("ZTEST");

        //Assert
        return oPromise.catch(function (oError) {
            assert.equal(oError, this.sMockError, "Error was was handled correctly");
        }.bind(this));
    });

    QUnit.test("Loads a page & vizTypes and inserts them into the JSON model", function (assert) {
        //Arrange
        this.oGetModelForPageStub.resolves({ id: "ZTEST" });
        this.oGetPageStub.returns({
            identification: { id: "Z_TEST_PAGE", title: "Page to test" },
            payload: {}
        });
        this.oGetVisualizationsStub.resolves({
            "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/LIMBACHS:3WO90XZ1DGMPFEHBNL7CFSMFS": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.app": {
                        title: "Code review",
                        subTitle: "4442965",
                        info: ""
                    },
                    "sap.ui": { icons: {} },
                    "sap.flp": {
                        tileSize: "1x1",
                        target: {
                            type: "URL",
                            url: "https://sap.com"
                        }
                    }
                }
            }
        });
        this.oGetApplicationsStub.resolves({
            "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H32NPIKF5YWFOUHP": {
                "sap.app": {
                    id: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H32NPIKF5YWFOUHP",
                    title: "App Navigation Sample 1"
                },
                "sap.ui5": {},
                "sap.ui": {},
                "sap.platform.runtime": {}
            }
        });
        this.oGetVizTypesStub.resolves({
            "sap.ushell.StaticAppLauncher": {
                _version: "1.0.0",
                "sap.flp": {},
                "sap.app": {},
                "sap.ui5": {},
                "sap.ui": {}
            }
        });

        var oExpectedPagesModel = {
            pages: [{ id: "ZTEST" }],
            vizTypes: {
                "sap.ushell.StaticAppLauncher": {
                    _version: "1.0.0",
                    "sap.flp": {},
                    "sap.app": {},
                    "sap.ui5": {},
                    "sap.ui": {}
                }
            }
        };
        var oExpectedPage = {
            identification: { id: "Z_TEST_PAGE", title: "Page to test" },
            payload: {}
        };
        var oExpectedVisualizations = {
            "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/LIMBACHS:3WO90XZ1DGMPFEHBNL7CFSMFS": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.app": {
                        title: "Code review",
                        subTitle: "4442965",
                        info: ""
                    },
                    "sap.ui": { icons: {} },
                    "sap.flp": {
                        tileSize: "1x1",
                        target: {
                            type: "URL",
                            url: "https://sap.com"
                        }
                    }
                }
            }
        };
        var oExpectedApplications = {
            "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H32NPIKF5YWFOUHP": {
                "sap.app": {
                    id: "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_AUTOTEST_CDM_BC_TEST:00O2TIH53H32NPIKF5YWFOUHP",
                    title: "App Navigation Sample 1"
                },
                "sap.ui5": {},
                "sap.ui": {},
                "sap.platform.runtime": {}
            }
        };

        var oExpectedVizTypes = {
            "sap.ushell.StaticAppLauncher": {
                _version: "1.0.0",
                "sap.flp": {},
                "sap.app": {},
                "sap.ui5": {},
                "sap.ui": {}
            }
        };

        //Act
        var oPromise = this.oPagesService.loadPage("ZTEST");

        //Assert
        return oPromise.then(function (sPath) {
            assert.deepEqual(this.oGetModelForPageStub.firstCall.args,
                [oExpectedPage, oExpectedVisualizations, oExpectedApplications, oExpectedVizTypes],
                "_getModelForPage was called with the required parameters"
            );
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedPagesModel,
                "page and vizTypes were successfully added to the model"
            );
            assert.strictEqual(sPath, "/pages/0", "the correct JSON Model path to the newly inserted page is returned");
        }.bind(this));
    });

    QUnit.test("Returns the JSON Model path without loading the page if it already exists in the model", function (assert) {
        // Arrange
        this.oGetPagePath.returns("/pages/0");

        //Act
        var oPromise = this.oPagesService.loadPage("AlreadyExistingPage");

        //Assert
        return oPromise.then(function (sPath) {
            assert.strictEqual(sPath, "/pages/0", "the correct JSON Model path to the already existing page is returned");
        });
    });

    QUnit.module("findVisualization", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = this.oGetServiceAsyncStub;
            this.oGetPageStub = sandbox.stub().resolves();
            this.oGetVisualizationsStub = sandbox.stub().resolves();
            this.oGetApplicationsStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub,
                getVisualizations: this.oGetVisualizationsStub,
                getApplications: this.oGetApplicationsStub
            });
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oPagesService = new Pages();
            this.oLoadPageStub = sandbox.stub(this.oPagesService, "loadPage");
            this.oGetModelForPageStub = sandbox.stub(this.oPagesService, "_getModelForPage").resolves({});
            this.oGetPropertyStub = sandbox.stub().withArgs("/pages/0/sections").returns([{
                id: "sectionId_0",
                visualizations: [
                    {
                        id: "id_1",
                        vizId: "vizId_1"
                    },
                    {
                        id: "id_2",
                        vizId: "vizId_2"
                    }
                ]
            }, {
                id: "sectionId_1",
                visualizations: [
                    {
                        id: "id_3",
                        vizId: "vizId_2"
                    },
                    {
                        id: "id_4",
                        vizId: "vizId_3"
                    }
                ]
            }, {
                id: "sectionId_2",
                visualizations: [
                    {
                        id: "id_5",
                        vizId: "vizId_1"
                    },
                    {
                        id: "id_6",
                        vizId: "vizId_2"
                    },
                    {
                        id: "id_7",
                        vizId: "vizId_3"
                    },
                    {
                        id: "id_8",
                        vizId: "vizId_1"
                    },
                    {
                        id: "id_9",
                        vizId: "vizId_2"
                    },
                    {
                        id: "id_10",
                        vizId: "vizId_3"
                    }
                ]
            }]);
            this.oGetModelStub = sandbox.stub(this.oPagesService, "getModel").returns({
                getProperty: this.oGetPropertyStub
            });
            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("returns the proper Visualization location when called with a correct PageId and VizId", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizId = "vizId_2";
        var sPageId = "SomePageID";
        var aExpectedVisualizationLocations = [
            { pageId: sPageId, sectionIndex: 0, vizIndexes: [1] },
            { pageId: sPageId, sectionIndex: 1, vizIndexes: [0] },
            { pageId: sPageId, sectionIndex: 2, vizIndexes: [1, 4] }
        ];

        // Act
        this.oPagesService.findVisualization(sPageId, null, sVizId).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("findVisualization in section by vizId", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizId = "vizId_2";
        var sPageId = "SomePageID";
        var sSectionId = "sectionId_1";
        var aExpectedVisualizationLocations = [
            { pageId: sPageId, sectionIndex: 1, vizIndexes: [0] }
        ];

        // Act
        this.oPagesService.findVisualization(sPageId, sSectionId, sVizId).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("findVisualization in section when several same visualization", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizId = "vizId_3";
        var sPageId = "SomePageID";
        var sSectionId = "sectionId_2";
        var aExpectedVisualizationLocations = [
            { pageId: sPageId, sectionIndex: 2, vizIndexes: [2, 5] }
        ];

        // Act
        this.oPagesService.findVisualization(sPageId, sSectionId, sVizId).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("returns the proper Visualization location when called with a correct PageId and VizRefId", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizRefId = "id_7";
        var sPageId = "SomePageID";
        var aExpectedVisualizationLocations = [
            { pageId: sPageId, sectionIndex: 2, vizIndexes: [2] }
        ];

        // Act
        this.oPagesService.findVisualization(sPageId, null, null, sVizRefId).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("findVisualization in section by vizRefId", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sVizRefId = "id_4";
        var sPageId = "SomePageID";
        var sSectionId = "sectionId_1";
        var aExpectedVisualizationLocations = [
            { pageId: sPageId, sectionIndex: 1, vizIndexes: [1] }
        ];

        // Act
        this.oPagesService.findVisualization(sPageId, sSectionId, null, sVizRefId).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("doesn't find anything if both vizId and vizRefId are not defined", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sPageId = "SomePageID";
        var aExpectedVisualizationLocations = [];

        // Act
        this.oPagesService.findVisualization(sPageId, null, null, null).then(function (aVisualizationLocations) {
            // Assert
            assert.deepEqual(aVisualizationLocations, aExpectedVisualizationLocations, "Call returned the expected value");

            fnDone();
        });
    });

    QUnit.test("Rejects the Promise and logs the correct error message when the CDM service is not retrievable", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - findVisualization: Personalization cannot be saved: CDM Service cannot be retrieved.";
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.findVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "findVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the Promise and logs the correct error message when loadPage fails", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - findVisualization: Couldn't load page, get visualizations or applications.";
        this.oLoadPageStub.rejects(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.findVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "findVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the Promise and logs the correct error message when getVisualizations fails", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - findVisualization: Couldn't load page, get visualizations or applications.";
        this.oGetVisualizationsStub.rejects(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.findVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "findVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the Promise and logs the correct error message when getApplications fails", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - findVisualization: Couldn't load page, get visualizations or applications.";
        this.oGetApplicationsStub.rejects(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.findVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "findVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("moveVisualization", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oCDM31Page = {
                identification: { id: "page-0", title: "Page 0" },
                payload: {
                    layout: { sectionOrder: ["section-0", "section-1"] },
                    sections: {
                        "section-0": {
                            id: "section-0",
                            title: "Section 0",
                            layout: { vizOrder: ["viz-0", "viz-1", "viz-2", "viz-3"] },
                            viz: {
                                "viz-0": { id: "viz-0", vizId: "vizId-0" },
                                "viz-1": { id: "viz-1", vizId: "vizId-1" },
                                "viz-2": { id: "viz-2", vizId: "vizId-2" },
                                "viz-3": { id: "viz-3", vizId: "vizId-3" }
                            }
                        },
                        "section-1": {
                            id: "section-1",
                            title: "Section 1",
                            layout: { vizOrder: ["viz-A", "viz-B", "viz-C", "viz-D"] },
                            viz: {
                                "viz-A": { id: "viz-A", vizId: "vizId-A" },
                                "viz-B": { id: "viz-B", vizId: "vizId-B" },
                                "viz-C": { id: "viz-C", vizId: "vizId-C" },
                                "viz-D": { id: "viz-D", vizId: "vizId-D" }
                            }
                        }
                    }
                }
            };
            this.oGetPageStub = sandbox.stub().resolves(this.oCDM31Page);
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                getPage: this.oGetPageStub
            });

            this.oMockModel = {
                pages: [{
                    id: "page-1",
                    sections: [{
                        id: "section-0",
                        title: "Section 0",
                        visualizations: [
                            { id: "viz-0" },
                            { id: "viz-1" },
                            { id: "viz-2" },
                            { id: "viz-3" }
                        ]
                    }, {
                        id: "section-1",
                        title: "Section 1",
                        visualizations: [
                            { id: "viz-A" },
                            { id: "viz-B" },
                            { id: "viz-C" },
                            { id: "viz-D" }
                        ]
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Does nothing if visualization is moved on itself", function (assert) {
        var oExpectedValue = {
            visualizationIndex: 0
        };
        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 0, 0).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 0, "Model was not refreshed");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), this.oMockModel, "the model was not manipulated");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 0, "setPersonalizationActive was not called");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 0, "savePersonalization was not called");
        }.bind(this));
    });

    QUnit.test("Moves visualization on the section it is already in", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-0",
                    title: "Section 0",
                    visualizations: [
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" },
                        { id: "viz-0" }
                    ]
                }, {
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [
                        { id: "viz-A" },
                        { id: "viz-B" },
                        { id: "viz-C" },
                        { id: "viz-D" }
                    ]
                }
                ]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-0", "section-1"] },
                sections: {
                    "section-0": {
                        id: "section-0",
                        title: "Section 0",
                        layout: { vizOrder: ["viz-1", "viz-2", "viz-3", "viz-0"] },
                        viz: {
                            "viz-0": { id: "viz-0", vizId: "vizId-0" },
                            "viz-1": { id: "viz-1", vizId: "vizId-1" },
                            "viz-2": { id: "viz-2", vizId: "vizId-2" },
                            "viz-3": { id: "viz-3", vizId: "vizId-3" }
                        }
                    },
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-A", "viz-B", "viz-C", "viz-D"] },
                        viz: {
                            "viz-A": { id: "viz-A", vizId: "vizId-A" },
                            "viz-B": { id: "viz-B", vizId: "vizId-B" },
                            "viz-C": { id: "viz-C", vizId: "vizId-C" },
                            "viz-D": { id: "viz-D", vizId: "vizId-D" }
                        }
                    }
                }
            }
        };
        var oExpectedValue = {
            visualizationIndex: 3
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 0, -1).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("Moves visualization on a section it is not in", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-0",
                    title: "Section 0",
                    visualizations: [
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" }
                    ]
                }, {
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [
                        { id: "viz-A" },
                        { id: "viz-B" },
                        { id: "viz-C" },
                        { id: "viz-D" },
                        { id: "viz-0" }
                    ]
                }
                ]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-0", "section-1"] },
                sections: {
                    "section-0": {
                        id: "section-0",
                        title: "Section 0",
                        layout: { vizOrder: ["viz-1", "viz-2", "viz-3"] },
                        viz: {
                            "viz-1": { id: "viz-1", vizId: "vizId-1" },
                            "viz-2": { id: "viz-2", vizId: "vizId-2" },
                            "viz-3": { id: "viz-3", vizId: "vizId-3" }
                        }
                    },
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-A", "viz-B", "viz-C", "viz-D", "viz-0"] },
                        viz: {
                            "viz-A": { id: "viz-A", vizId: "vizId-A" },
                            "viz-B": { id: "viz-B", vizId: "vizId-B" },
                            "viz-C": { id: "viz-C", vizId: "vizId-C" },
                            "viz-D": { id: "viz-D", vizId: "vizId-D" },
                            "viz-0": { id: "viz-0", vizId: "vizId-0" }
                        }
                    }
                }
            }
        };
        var oExpectedValue = {
            visualizationIndex: 4
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 1, -1).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("Moves visualization to the right inside same section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-0",
                    title: "Section 0",
                    visualizations: [
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" },
                        { id: "viz-0" }
                    ]
                }, {
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [
                        { id: "viz-A" },
                        { id: "viz-B" },
                        { id: "viz-C" },
                        { id: "viz-D" }
                    ]
                }]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-0", "section-1"] },
                sections: {
                    "section-0": {
                        id: "section-0",
                        title: "Section 0",
                        layout: { vizOrder: ["viz-1", "viz-2", "viz-3", "viz-0"] },
                        viz: {
                            "viz-1": { id: "viz-1", vizId: "vizId-1" },
                            "viz-2": { id: "viz-2", vizId: "vizId-2" },
                            "viz-3": { id: "viz-3", vizId: "vizId-3" },
                            "viz-0": { id: "viz-0", vizId: "vizId-0" }
                        }
                    },
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-A", "viz-B", "viz-C", "viz-D"] },
                        viz: {
                            "viz-A": { id: "viz-A", vizId: "vizId-A" },
                            "viz-B": { id: "viz-B", vizId: "vizId-B" },
                            "viz-C": { id: "viz-C", vizId: "vizId-C" },
                            "viz-D": { id: "viz-D", vizId: "vizId-D" }
                        }
                    }
                }
            }
        };
        var oExpectedValue = {
            visualizationIndex: 4
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 0, 4).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("Moves visualization to the left inside same section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-0",
                    title: "Section 0",
                    visualizations: [
                        { id: "viz-0" },
                        { id: "viz-2" },
                        { id: "viz-1" },
                        { id: "viz-3" }
                    ]
                }, {
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [
                        { id: "viz-A" },
                        { id: "viz-B" },
                        { id: "viz-C" },
                        { id: "viz-D" }
                    ]
                }
                ]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-0", "section-1"] },
                sections: {
                    "section-0": {
                        id: "section-0",
                        title: "Section 0",
                        layout: { vizOrder: ["viz-0", "viz-2", "viz-1", "viz-3"] },
                        viz: {
                            "viz-1": { id: "viz-1", vizId: "vizId-1" },
                            "viz-2": { id: "viz-2", vizId: "vizId-2" },
                            "viz-3": { id: "viz-3", vizId: "vizId-3" },
                            "viz-0": { id: "viz-0", vizId: "vizId-0" }
                        }
                    },
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-A", "viz-B", "viz-C", "viz-D"] },
                        viz: {
                            "viz-A": { id: "viz-A", vizId: "vizId-A" },
                            "viz-B": { id: "viz-B", vizId: "vizId-B" },
                            "viz-C": { id: "viz-C", vizId: "vizId-C" },
                            "viz-D": { id: "viz-D", vizId: "vizId-D" }
                        }
                    }
                }
            }
        };
        var oExpectedValue = {
            visualizationIndex: 1
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 2, 0, 1).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("Moves visualization in another section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-0",
                    title: "Section 0",
                    visualizations: [
                        { id: "viz-1" },
                        { id: "viz-2" },
                        { id: "viz-3" }
                    ]
                }, {
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [
                        { id: "viz-A" },
                        { id: "viz-B" },
                        { id: "viz-0" },
                        { id: "viz-C" },
                        { id: "viz-D" }
                    ]
                }]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-0", "section-1"] },
                sections: {
                    "section-0": {
                        id: "section-0",
                        title: "Section 0",
                        layout: { vizOrder: ["viz-1", "viz-2", "viz-3"] },
                        viz: {
                            "viz-1": { id: "viz-1", vizId: "vizId-1" },
                            "viz-2": { id: "viz-2", vizId: "vizId-2" },
                            "viz-3": { id: "viz-3", vizId: "vizId-3" }
                        }
                    },
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-A", "viz-B", "viz-0", "viz-C", "viz-D"] },
                        viz: {
                            "viz-A": { id: "viz-A", vizId: "vizId-A" },
                            "viz-B": { id: "viz-B", vizId: "vizId-B" },
                            "viz-0": { id: "viz-0", vizId: "vizId-0" },
                            "viz-C": { id: "viz-C", vizId: "vizId-C" },
                            "viz-D": { id: "viz-D", vizId: "vizId-D" }
                        }
                    }
                }
            }
        };
        var oExpectedValue = {
            visualizationIndex: 2
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 1, 2).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedValue, "Resolved the correct object");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when the CDM Service is unavailable", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - moveVisualization: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.moveVisualization(0, 0, 0, 1, 2)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "moveVisualization rejected with the expected error");
                assert.ok(this.oSetPersonalizationActiveStub.calledTwice, "setPersonalizationActive was called twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true, "setPersonalization was called with the expected argument the first time");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalization was called with the expected argument the second time");
            }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when the page cannot be loaded", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - moveVisualization: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        this.oGetPageStub.rejects(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.moveVisualization(0, 0, 0, 1, 2)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "moveVisualization rejected with the expected error");
                assert.ok(this.oSetPersonalizationActiveStub.calledTwice, "setPersonalizationActive was called twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true, "setPersonalization was called with the expected argument the first time");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalization was called with the expected argument the second time");
            }.bind(this));
    });

    QUnit.module("Default Section", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oCDM31Page = {
                identification: { id: "page-0", title: "Page 0" },
                payload: {
                    layout: { sectionOrder: ["section-0", "section-1"] },
                    sections: {
                        "section-0": {
                            id: "section-0",
                            title: "Section 0",
                            default: "true",
                            layout: { vizOrder: ["viz-0"] },
                            viz: {
                                "viz-0": { id: "viz-0", vizId: "vizId-0" }
                            }
                        },
                        "section-1": {
                            id: "section-1",
                            title: "Section 1",
                            layout: { vizOrder: [] },
                            viz: {}
                        }
                    }
                }
            };
            this.oGetPageStub = sandbox.stub().resolves(this.oCDM31Page);
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                getPage: this.oGetPageStub
            });

            this.oMockModel = {
                pages: [{
                    id: "page-1",
                    sections: [{
                        id: "section-0",
                        title: "Section 0",
                        default: "true",
                        visualizations: [{ id: "viz-0" }]
                    }, {
                        id: "section-1",
                        title: "Section 1",
                        visualizations: []
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Move last visualization from the default section deletes the section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-1",
                    title: "Section 1",
                    visualizations: [{ id: "viz-0" }]
                }]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["viz-0"] },
                        viz: {
                            "viz-0": { id: "viz-0", vizId: "vizId-0" }
                        }
                    }
                }
            }
        };

        // Act
        return this.oPagesService.moveVisualization(0, 0, 0, 1, 0).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.test("Delete last visualization deletes the default section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-1",
                    title: "Section 1",
                    visualizations: []
                }]
            }]
        };

        var oExpectedPage = {
            identification: { id: "page-0", title: "Page 0" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: [] },
                        viz: {}
                    }
                }
            }
        };

        // Act
        return this.oPagesService.deleteVisualization(0, 0, 0).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedPage, "The visualization is moved correctly in the page object");
            assert.ok(this.oGetPageStub.calledOnce, "The function 'getPage' of the CDM service is called once");
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["page-1"], "The function 'getPage' of the CDM service is called with the correct page id");
        }.bind(this));
    });

    QUnit.module("setPersonalizationActive", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oPagesService = new Pages();
            this.oMockModel = { "Some property": "Some value" };
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("sets the dirty state to \"true\" and clones the model if called with true and the state was not already true", function (assert) {
        // Arrange
        // Act
        this.oPagesService.setPersonalizationActive(true);
        // Assert
        assert.deepEqual(this.oPagesService._oCopiedModelData, this.oMockModel, "The model was copied as expected");
        assert.strictEqual(this.oPagesService._bDirtyState, true, "The dirty state was set to true");
    });

    QUnit.test("sets the dirty state to \"false\" and overwrites the personalized model data with the original model data if called with false and the dirty state was true", function (assert) {
        // Arrange
        var oModelMock = {
            SomeOriginalProperty: "AndItsValue"
        };
        this.oPagesService._oCopiedModelData = oModelMock;
        this.oPagesService._bDirtyState = true;
        // Act
        this.oPagesService.setPersonalizationActive(false);
        // Assert
        assert.deepEqual(this.oPagesService._oPagesModel.getData(), oModelMock, "The model was copied as expected");
        assert.strictEqual(this.oPagesService._bDirtyState, false, "The dirty state was set to true");
    });

    QUnit.test("does nothing if called with true when the dirty state was already true", function (assert) {
        // Arrange
        var oModelGetPropertySpy = sinon.spy(this.oPagesService._oPagesModel, "getProperty"),
            oModelSetDataSpy = sinon.spy(this.oPagesService._oPagesModel, "_setData");
        this.oPagesService._bDirtyState = true;
        // Act
        this.oPagesService.setPersonalizationActive(true);
        // Assert
        assert.ok(oModelGetPropertySpy.notCalled, "getProperty of the model was not called");
        assert.ok(oModelSetDataSpy.notCalled, "_setData of the model was not called");
    });

    QUnit.test("does nothing if called with false when the dirty state was already false", function (assert) {
        // Arrange
        var oModelGetPropertySpy = sinon.spy(this.oPagesService._oPagesModel, "getProperty"),
            oModelSetDataSpy = sinon.spy(this.oPagesService._oPagesModel, "_setData");
        this.oPagesService._bDirtyState = false;
        // Act
        this.oPagesService.setPersonalizationActive(false);
        // Assert
        assert.ok(oModelGetPropertySpy.notCalled, "getProperty of the model was not called");
        assert.ok(oModelSetDataSpy.notCalled, "_setData of the model was not called");
    });

    QUnit.module("savePersonalization", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oPagesService = new Pages();
            this.oSaveStub = sandbox.stub();
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                save: this.oSaveStub.returns(new jQuery.Deferred().resolve())
            });
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Called with dirty state equals true", function (assert) {
        // Arrange
        this.oPagesService._bDirtyState = true;

        // Act
        return this.oPagesService.savePersonalization("page1").then(function () {
            // Assert
            assert.strictEqual(this.oPagesService._bDirtyState, false, "bDirtyState was set to false");
            assert.ok(this.oSaveStub.calledOnce, "the method save of cdm service was called once");
            assert.deepEqual(this.oSaveStub.firstCall.args, ["page1"], "the method save of cdm service was called with right parameters");
        }.bind(this));
    });

    QUnit.test("Rejects the promise and logs the correct error when the CDM Service cannot be retrieved", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - savePersonalization: Personalization cannot be saved: CDM Service cannot be retrieved or the save process encountered an error.";
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.savePersonalization("page1")
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "savePersonalization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise, resets the pages to be saved and logs the correct error when save rejects", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - savePersonalization: Personalization cannot be saved: CDM Service cannot be retrieved or the save process encountered an error.";
        this.oSaveStub.withArgs("page1").returns(new jQuery.Deferred().reject(this.oTestError));
        // Act
        // Assert
        return this.oPagesService.savePersonalization("page1")
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "savePersonalization rejected with the expected error");
                assert.deepEqual(this.oPagesService._aPagesToBeSaved, ["page1"], "_aPagesToBeSaved was cleared");
            }.bind(this));
    });

    QUnit.test("Saves all unsaved pages if no parameter was provided", function (assert) {
        // Arrange
        this.oPagesService._aPagesToBeSaved = ["page1", "page2"];
        // Act
        return this.oPagesService.savePersonalization().then(function () {
            // Assert
            assert.deepEqual(this.oSaveStub.getCall(0).args, ["page1"], "save was called the first time with correct args");
            assert.deepEqual(this.oSaveStub.getCall(1).args, ["page2"], "save was called the second time with correct args");
            assert.deepEqual(this.oPagesService._aPagesToBeSaved, [], "_aPagesToBeSaved was cleared");
        }.bind(this));
    });

    QUnit.test("Manages the unsaved pages correctly if no parameter was provided and a save error occurs", function (assert) {
        // Arrange
        this.oPagesService._aPagesToBeSaved = ["page1", "page2"];
        this.oSaveStub.withArgs("page1").returns(new jQuery.Deferred().reject());
        // Act
        // Assert
        return this.oPagesService.savePersonalization()
            .catch(function () {
                assert.deepEqual(this.oPagesService._aPagesToBeSaved, ["page1"], "page1 is still unsaved");
            }.bind(this));
    });

    QUnit.test("Handles personalization during save correctly", function (assert) {
        // Arrange
        this.oSaveStub.withArgs(sinon.match.any).callsFake(function (sPageId) {
            if (sPageId === "page1") {
                // Do personalization on page1 during save of page1
                this.oPagesService._aPagesToBeSaved.push("page1");
            }
            return new jQuery.Deferred().resolve();
        }.bind(this));

        // Personalization happend on two different pages
        this.oPagesService._aPagesToBeSaved = ["page1", "page2"];

        // Act
        // Personalization should be saved
        return this.oPagesService.savePersonalization()
            .then(function () {
                assert.deepEqual(this.oPagesService._aPagesToBeSaved, ["page1"]);
            }.bind(this));

    });

    QUnit.module("_conditionalSavePersonalization", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oPagesService = new Pages();

            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oSavePersonalizationStub.resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("calls savePersonalization if implicit save is enabled", function (assert) {
        // Arrange
        var sPageId = "page1";
        // Act
        return this.oPagesService._conditionalSavePersonalization(sPageId)
            .then(function () {
                // Assert
                assert.deepEqual(this.oSavePersonalizationStub.getCall(0).args, [sPageId], "savePersonalization was called with correct args");
                assert.deepEqual(this.oPagesService._aPagesToBeSaved, [], "no page was added into the array");
            }.bind(this));
    });

    QUnit.test("Adds page to array if implicit save is disabled", function (assert) {
        // Arrange
        var sPageId = "page1";
        this.oPagesService._bImplicitSaveEnabled = false;

        // Act
        return this.oPagesService._conditionalSavePersonalization(sPageId)
            .then(function () {
                // Assert
                assert.deepEqual(this.oSavePersonalizationStub.callCount, 0, "savePersonalization was not called");
                assert.deepEqual(this.oPagesService._aPagesToBeSaved, [sPageId], "the page was added into the array");
            }.bind(this));
    });

    QUnit.module("_getModelForPage", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oCSTRMock = {
                id: "ClientSideTargetResolution"
            };
            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves(this.oCSTRMock);

            this.oUrlParsingMock = {
                id: "UrlParsing"
            };
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(this.oUrlParsingMock);

            this.oWarningStub = sandbox.stub(Log, "warning");

            this.oPagesService = new Pages();
            this.oIsIntentSupportedStub = sandbox.stub(this.oPagesService, "_isIntentSupported");
            this.oIsIntentSupportedStub.withArgs(sinon.match.any, this.oCSTRMock).resolves(true);
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/catalog/enableHideGroups").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct JSON Model structure for a given CDM 3.1 page", function (assert) {
        // Arrange
        var oPage = {
            identification: { id: "page1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["sec2", "sec1"] },
                sections: {
                    sec1: {
                        id: "sec1",
                        title: "Section 1",
                        visible: true,
                        locked: false,
                        preset: true,
                        default: false,
                        layout: { vizOrder: ["1", "3", "4", "2"] },
                        viz: {
                            1: {
                                id: "1",
                                vizId: "Bank-manage"
                            },
                            2: {
                                id: "2",
                                vizId: "Bank-manage-1"
                            },
                            3: {
                                id: "3",
                                vizId: "Bank-manage-1",
                                title: "Title of viz reference 3",
                                info: "Info of viz reference 3"
                            },
                            4: {
                                id: "4",
                                vizId: "Bank-manage",
                                title: "Title of viz reference 4",
                                subTitle: "Sub title of viz reference 4",
                                icon: "sap-icon://add",
                                displayFormatHint: "flat"
                            }
                        }
                    },
                    sec2: {
                        id: "sec2",
                        title: "Section 2",
                        visible: false,
                        locked: true,
                        preset: false,
                        default: true,
                        layout: { vizOrder: ["5"] },
                        viz: {
                            5: { id: "5", vizId: "Bank-manage" }
                        }
                    }
                }
            }
        };
        var oVisualizations = {
            "Bank-manage": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.flp": {
                        target: {
                            appId: "fin.cash.bankmaster.manage",
                            inboundId: "BankAccount-manageBank"
                        }
                    }
                }
            },
            "Bank-manage-1": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.app": { subTitle: "Simple Mode" },
                    "sap.ui": { icons: { icon: "sap-icon://building" } },
                    "sap.flp": {
                        target: {
                            appId: "fin.cash.bankmaster.manage",
                            inboundId: "BankAccount-manageBank"
                        }
                    }
                }
            }
        };
        var oApplications = {
            "fin.cash.bankmaster.manage": {
                "sap.app": {
                    id: "fin.cash.bankmaster.manage",
                    applicationVersion: { version: "1.0.0" },
                    title: "Manage Banks",
                    subTitle: "S/4",
                    info: "desktop only",
                    ach: "FIN-FSCM-CLM-BAM",
                    crossNavigation: {
                        inbounds: {
                            "BankAccount-manageBank": {
                                title: "Bank Account",
                                subTitle: "Manage Bank",
                                semanticObject: "BankAccount",
                                action: "manageBank",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    },
                    contentProviderId: "contentProviderId"
                }
            }
        };
        var oVizTypes = {
            "sap.ushell.StaticAppLauncher": {
                _version: "1.0.0"
            }
        };

        var oExpectedModel = {
            id: "page1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "sec2",
                title: resources.i18n.getText("DefaultSection.Title"),
                visible: false,
                locked: true,
                preset: false,
                default: true,
                visualizations: [{
                    id: "5",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Manage Bank",
                    icon: "",
                    numberUnit: undefined,
                    keywords: [],
                    info: "desktop only",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    contentProviderId: "contentProviderId",
                    indicatorDataSource: undefined,
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }]
            }, {
                id: "sec1",
                title: "Section 1",
                visible: true,
                locked: false,
                preset: true,
                default: false,
                visualizations: [{
                    id: "1",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Manage Bank",
                    icon: "",
                    numberUnit: undefined,
                    keywords: [],
                    info: "desktop only",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }, {
                    id: "3",
                    vizId: "Bank-manage-1",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.app": {
                            subTitle: "Simple Mode"
                        },
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://building"
                            }
                        }
                    },
                    title: "Title of viz reference 3",
                    subtitle: "Simple Mode",
                    icon: "sap-icon://building",
                    numberUnit: undefined,
                    keywords: [],
                    info: "Info of viz reference 3",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }, {
                    id: "4",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Title of viz reference 4",
                    subtitle: "Sub title of viz reference 4",
                    icon: "sap-icon://add",
                    numberUnit: undefined,
                    keywords: [],
                    info: "desktop only",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: "flat"
                }, {
                    id: "2",
                    vizId: "Bank-manage-1",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.app": {
                            subTitle: "Simple Mode"
                        },
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://building"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Simple Mode",
                    icon: "sap-icon://building",
                    numberUnit: undefined,
                    keywords: [],
                    info: "desktop only",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }]
            }]
        };

        // Act
        return this.oPagesService._getModelForPage(oPage, oVisualizations, oApplications, oVizTypes).then(function (oModel) {
            // Assert
            assert.deepEqual(oModel, oExpectedModel, "The returned object has all the required data and is in the right order.");
            // test explicitly for the translation of the default section; language is set in Pages.qunit.html
            assert.strictEqual(
                oModel.sections[0].title,
                "Recently Added Apps",
                "The title of the default section was translated."
            );
        });
    });

    QUnit.test("Returns the correct JSON Model structure with 'visible === true' for all sections when 'enableHideGroups === false'", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/catalog/enableHideGroups").returns(false);
        var oPage = {
            identification: { id: "page1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["sec2", "sec1"] },
                sections: {
                    sec1: {
                        id: "sec1",
                        title: "Section 1",
                        visible: true,
                        locked: false,
                        preset: true,
                        default: false,
                        layout: { vizOrder: ["1", "3", "4", "2"] },
                        viz: {
                            1: {
                                id: "1",
                                vizId: "Bank-manage"
                            },
                            2: {
                                id: "2",
                                vizId: "Bank-manage-1"
                            },
                            3: {
                                id: "3",
                                vizId: "Bank-manage-1",
                                title: "Title of viz reference 3",
                                info: "Info of viz reference 3"
                            },
                            4: {
                                id: "4",
                                vizId: "Bank-manage",
                                title: "Title of viz reference 4",
                                subTitle: "Sub title of viz reference 4",
                                icon: "sap-icon://add",
                                displayFormatHint: "flatWide",
                                numberUnit: "EUR"
                            }
                        }
                    },
                    sec2: {
                        id: "sec2",
                        title: "Section 2",
                        visible: false,
                        locked: true,
                        preset: false,
                        default: true,
                        layout: { vizOrder: ["5"] },
                        viz: {
                            5: { id: "5", vizId: "Bank-manage" }
                        }
                    }
                }
            }
        };
        var oVisualizations = {
            "Bank-manage": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.flp": {
                        target: {
                            appId: "fin.cash.bankmaster.manage",
                            inboundId: "BankAccount-manageBank"
                        }
                    }
                }
            },
            "Bank-manage-1": {
                vizType: "sap.ushell.StaticAppLauncher",
                vizConfig: {
                    "sap.app": { subTitle: "Simple Mode" },
                    "sap.ui": { icons: { icon: "sap-icon://building" } },
                    "sap.flp": {
                        target: {
                            appId: "fin.cash.bankmaster.manage",
                            inboundId: "BankAccount-manageBank"
                        }
                    }
                }
            }
        };
        var oApplications = {
            "fin.cash.bankmaster.manage": {
                "sap.app": {
                    id: "fin.cash.bankmaster.manage",
                    applicationVersion: { version: "1.0.0" },
                    title: "Manage Banks",
                    subTitle: "S/4",
                    info: "desktop only",
                    ach: "FIN-FSCM-CLM-BAM",
                    crossNavigation: {
                        inbounds: {
                            "BankAccount-manageBank": {
                                title: "Bank Account",
                                subTitle: "Manage Bank",
                                semanticObject: "BankAccount",
                                action: "manageBank",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    },
                    contentProviderId: "contentProviderId"
                }
            }
        };
        var oVizTypes = {
            "sap.ushell.StaticAppLauncher": {
                _version: "1.0.0"
            }
        };

        var oExpectedModel = {
            id: "page1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "sec2",
                title: resources.i18n.getText("DefaultSection.Title"),
                visible: true,
                locked: true,
                preset: false,
                default: true,
                visualizations: [{
                    id: "5",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Manage Bank",
                    icon: "",
                    keywords: [],
                    info: "desktop only",
                    numberUnit: undefined,
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }]
            }, {
                id: "sec1",
                title: "Section 1",
                visible: true,
                locked: false,
                preset: true,
                default: false,
                visualizations: [{
                    id: "1",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Manage Bank",
                    icon: "",
                    keywords: [],
                    info: "desktop only",
                    numberUnit: undefined,
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }, {
                    id: "3",
                    vizId: "Bank-manage-1",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.app": {
                            subTitle: "Simple Mode"
                        },
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://building"
                            }
                        }
                    },
                    title: "Title of viz reference 3",
                    subtitle: "Simple Mode",
                    icon: "sap-icon://building",
                    keywords: [],
                    info: "Info of viz reference 3",
                    numberUnit: undefined,
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }, {
                    id: "4",
                    vizId: "Bank-manage",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        }
                    },
                    title: "Title of viz reference 4",
                    subtitle: "Sub title of viz reference 4",
                    icon: "sap-icon://add",
                    keywords: [],
                    info: "desktop only",
                    numberUnit: "EUR",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: "flatWide"
                }, {
                    id: "2",
                    vizId: "Bank-manage-1",
                    vizType: "sap.ushell.StaticAppLauncher",
                    vizConfig: {
                        "sap.app": {
                            subTitle: "Simple Mode"
                        },
                        "sap.flp": {
                            target: {
                                appId: "fin.cash.bankmaster.manage",
                                inboundId: "BankAccount-manageBank"
                            }
                        },
                        "sap.ui": {
                            icons: {
                                icon: "sap-icon://building"
                            }
                        }
                    },
                    title: "Bank Account",
                    subtitle: "Simple Mode",
                    icon: "sap-icon://building",
                    numberUnit: undefined,
                    keywords: [],
                    info: "desktop only",
                    target: {
                        appId: "fin.cash.bankmaster.manage",
                        inboundId: "BankAccount-manageBank"
                    },
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "contentProviderId",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: {
                            _version: "1.0.0"
                        }
                    },
                    targetURL: undefined,
                    displayFormatHint: undefined
                }]
            }]
        };

        // Act
        return this.oPagesService._getModelForPage(oPage, oVisualizations, oApplications, oVizTypes).then(function (oModel) {
            // Assert
            assert.deepEqual(oModel, oExpectedModel, "The returned object has all the required data and is in the right order.");
        });
    });

    QUnit.test("Returns a JSON Model structure with fallback data for properties which don't have any value", function (assert) {
        // Arrange
        var oPage = {
            identification: { id: "page1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["sec1"] },
                sections: {
                    sec1: {
                        id: "sec1",
                        title: "Section 1",
                        layout: { vizOrder: ["1"] },
                        viz: {
                            1: {
                                id: "1",
                                vizId: "Bank-manage",
                                displayFormatHint: "compact"
                            }
                        }
                    }
                }
            }
        };
        var oVisualizations = { "Bank-manage": {} };
        var oApplications = {
            "fin.cash.bankmaster.manage": {
                "sap.app": {
                    id: "fin.cash.bankmaster.manage",
                    applicationVersion: { version: "1.0.0" },
                    ach: "FIN-FSCM-CLM-BAM",
                    crossNavigation: {}
                }
            }
        };
        var oVizTypes = {};

        var oExpectedModel = {
            id: "page1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "sec1",
                locked: false,
                title: "Section 1",
                visible: true,
                default: false,
                preset: true,
                visualizations: [{
                    id: "1",
                    vizId: "Bank-manage",
                    vizType: "",
                    vizConfig: {},
                    title: "",
                    subtitle: "",
                    icon: "",
                    numberUnit: undefined,
                    keywords: [],
                    info: "",
                    target: {},
                    isBookmark: false,
                    indicatorDataSource: undefined,
                    contentProviderId: "",
                    _instantiationData: {
                        platform: "CDM",
                        vizType: undefined
                    },
                    targetURL: undefined,
                    displayFormatHint: "compact"
                }]
            }]
        };

        // Act
        return this.oPagesService._getModelForPage(oPage, oVisualizations, oApplications, oVizTypes).then(function (oModel) {
            // Assert
            assert.deepEqual(oModel, oExpectedModel, "The returned object is filled.");
        });
    });

    QUnit.test("Filters unsupported tiles out", function (assert) {
        // Arrange
        this.oIsIntentSupportedStub.withArgs(sinon.match.any, this.oCSTRMock).resolves(false);
        var oPage = {
            identification: { id: "page1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["sec1"] },
                sections: {
                    sec1: {
                        id: "sec1",
                        title: "Section 1",
                        layout: { vizOrder: ["1"] },
                        viz: {
                            1: { id: "1", vizId: "Bank-manage" }
                        }
                    }
                }
            }
        };
        var oVisualizations = { "Bank-manage": {} };
        var oApplications = {
            "fin.cash.bankmaster.manage": {
                "sap.app": {
                    id: "fin.cash.bankmaster.manage",
                    applicationVersion: { version: "1.0.0" },
                    ach: "FIN-FSCM-CLM-BAM",
                    crossNavigation: {}
                }
            }
        };
        var oVizTypes = {};

        var oExpectedModel = {
            id: "page1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "sec1",
                locked: false,
                title: "Section 1",
                visible: true,
                default: false,
                preset: true,
                visualizations: []
            }]
        };

        // Act
        return this.oPagesService._getModelForPage(oPage, oVisualizations, oApplications, oVizTypes).then(function (oModel) {
            // Assert
            assert.deepEqual(oModel, oExpectedModel, "The returned object is filled.");
            assert.ok(this.oWarningStub.calledWith("The visualization Bank-manage is filtered out, because it does not have a supported intent."), "Warning was called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Rejects if CSTR is not available", function (assert) {
        var oExpectedError = new Error("service is not available");
        this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").rejects(oExpectedError);
        return this.oPagesService._getModelForPage({}, {}, {}, {})
            .then(function () {
                // Assert
                assert.ok(false, "Promise should have been rejected");
            })
            .catch(function (oError) {
                assert.ok(true, "Promise rejected");
                assert.strictEqual(oError, oExpectedError, "Returned the correct message");
            });
    });

    QUnit.test("Rejects if URLParsing is not available", function (assert) {
        var oExpectedError = new Error("service is not available");
        this.oPagesService._oURLParsingServicePromise = Promise.reject(oExpectedError);
        return this.oPagesService._getModelForPage({}, {}, {}, {})
            .then(function () {
                // Assert
                assert.ok(false, "Promise should have been rejected");
            })
            .catch(function (oError) {
                assert.ok(true, "Promise rejected");
                assert.strictEqual(oError, oExpectedError, "Returned the correct message");
            });
    });

    QUnit.module("_isIntentSupported", {
        beforeEach: function () {
            this.oVizDataMock = {
                id: "vizData",
                target: {}
            };
            this.oIsIntentSupportedStub = sandbox.stub();
            this.oIsIntentSupportedStub.withArgs(["supportedIntent"]).returns(new jQuery.Deferred().resolve({
                supportedIntent: {
                    supported: true
                }
            }));
            this.oIsIntentSupportedStub.withArgs(["notSupportedIntent"]).returns(new jQuery.Deferred().resolve({
                notSupportedIntent: {
                    supported: false
                }
            }));
            this.oIsIntentSupportedStub.withArgs([undefined]).returns(new jQuery.Deferred().reject());
            this.oCSTRMock = {
                isIntentSupported: this.oIsIntentSupportedStub
            };

            this.oIsStandardVizTypeStub = sandbox.stub(readVisualizations, "isStandardVizType").returns(true);

            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oPagesService = new Pages();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result if the targetURL is supported", function (assert) {
        // Arrange
        var sHashResult = "supportedIntent";
        this.oVizDataMock.targetURL = sHashResult;
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, true, "Returned the correct result");
            });
    });

    QUnit.test("Returns the correct result if the targetURL is not supported", function (assert) {
        // Arrange
        var sHashResult = "notSupportedIntent";
        this.oVizDataMock.targetURL = sHashResult;
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Returned the correct result");
            });
    });

    QUnit.test("Returns the correct result if the targetURL is undefined", function (assert) {
        // Arrange
        var sHashResult;
        this.oVizDataMock.targetURL = sHashResult;
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Returned the correct result");
            });
    });

    QUnit.test("Resolves true if target is url", function (assert) {
        // Arrange
        this.oVizDataMock.target = {
            type: "URL",
            url: "some/Url"
        };
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, true, "Returned the correct result");
            });
    });

    QUnit.test("Resolves true if the vizType is not a standard viz type (custom tile)", function (assert) {
        // Arrange
        this.oIsStandardVizTypeStub.returns(false);
        this.oVizDataMock.target = {
            type: "URL"
        };
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, true, "Returned the correct result");
            });
    });

    QUnit.test("Resolves false if target is empty url", function (assert) {
        // Arrange
        this.oVizDataMock.target = {
            type: "URL",
            url: ""
        };
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Returned the correct result");
            });
    });

    QUnit.test("Resolves false if target is undefined", function (assert) {
        // Arrange
        delete this.oVizDataMock.target;
        // Act
        return this.oPagesService._isIntentSupported(this.oVizDataMock, this.oCSTRMock)
            .then(function (bResult) {
                // Assert
                assert.strictEqual(bResult, false, "Returned the correct result");
            });
    });

    QUnit.module("deleteVisualization", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };
            this.oGetPageStub = sandbox.stub();

            sap.ushell.Container.getServiceAsync = sandbox.stub().resolves({
                getPage: this.oGetPageStub
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");

            this.oMockModel = {
                pages: [{
                    id: "page-1",
                    sections: [{
                        id: "section-1",
                        title: "First Section",
                        visualizations: [
                            { id: "0", vizId: "vizId-0" },
                            { id: "1", vizId: "vizId-1" },
                            { id: "2", vizId: "" },
                            { id: "3", vizId: "vizId-3" }
                        ]
                    }]
                }]
            };

            this.oCDMPage = {
                identification: { id: "page-1", title: "Page 1" },
                payload: {
                    layout: { sectionOrder: ["section-1"] },
                    sections: {
                        "section-1": {
                            id: "section-1",
                            title: "Section 1",
                            layout: { vizOrder: ["0", "1", "2", "3"] },
                            viz: {
                                0: { id: "0", vizId: "vizId-0" },
                                1: { id: "1", vizId: "vizId-1" },
                                2: { id: "2", vizId: "" },
                                3: { id: "3", vizId: "vizId-3" }
                            }
                        }
                    }
                }
            };
            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("deletes a visualization", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-1",
                    title: "First Section",
                    visualizations: [
                        { id: "0", vizId: "vizId-0" },
                        { id: "2", vizId: "" },
                        { id: "3", vizId: "vizId-3" }
                    ]
                }]
            }]
        };
        this.oGetPageStub.withArgs("page-1").returns(this.oCDMPage);

        // Act
        return this.oPagesService.deleteVisualization(0, 0, 1)
            .then(function () {
                // Assert
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
                assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
                assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            }.bind(this));
    });

    QUnit.test("deletes the respective visualization from the CDM 3.1 page", function (assert) {
        // Arrange
        var oExpectedCDMPage = {
            identification: { id: "page-1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["0", "2", "3"] },
                        viz: {
                            0: { id: "0", vizId: "vizId-0" },
                            2: { id: "2", vizId: "" },
                            3: { id: "3", vizId: "vizId-3" }
                        }
                    }
                }
            }
        };
        this.oGetPageStub.withArgs("page-1").returns(this.oCDMPage);

        // Act
        return this.oPagesService.deleteVisualization(0, 0, 1).then(function () {
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.deepEqual(this.oCDMPage, oExpectedCDMPage, "The CDM 3.1 site was adapted accordingly.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, ["page-1"], "savePersonalization was called with the page id of the updated page");
        }.bind(this));
    });

    QUnit.test("deletes the respective visualization from the CDM 3.1 page if the vizReference has no ID as it is a bookmark", function (assert) {
        // Arrange
        var oExpectedCDMPage = {
            identification: { id: "page-1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1",
                        title: "Section 1",
                        layout: { vizOrder: ["0", "1", "3"] },
                        viz: {
                            0: { id: "0", vizId: "vizId-0" },
                            1: { id: "1", vizId: "vizId-1" },
                            3: { id: "3", vizId: "vizId-3" }
                        }
                    }
                }
            }
        };
        this.oGetPageStub.withArgs("page-1").returns(this.oCDMPage);

        // Act
        return this.oPagesService.deleteVisualization(0, 0, 2).then(function () {
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.deepEqual(this.oCDMPage, oExpectedCDMPage, "The CDM 3.1 site was adapted accordingly.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, ["page-1"], "savePersonalization was called with the page id of the updated page");
        }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the CDM service is not retrievable", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - deleteVisualization: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";

        // Act
        // Assert
        return this.oPagesService.deleteVisualization(0, 0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "deleteVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the Page is not retrievable", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - deleteVisualization: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";

        // Act
        // Assert
        return this.oPagesService.deleteVisualization(0, 0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "deleteVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise and cancels the personalization when savePersonalization fails", function (assert) {
        // Arrange
        this.oGetPageStub.withArgs("page-1").returns(this.oCDMPage);
        this.oSavePersonalizationStub.rejects(this.oTestError);

        // Act
        // Assert
        return this.oPagesService.deleteVisualization(0, 0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.deepEqual(oError, this.oTestError, "deleteVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("The _getSectionIndex function", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: function (sParam) {
                    return sParam;
                }
            };
            this.oPagesService = new Pages();

            this.sPagePathMock = "sPagePathMock";
            this.sSectionIdMock = "1";

            this.oGetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub(this.oPagesService, "getModel");
            this.oGetModelStub.returns({
                getProperty: this.oGetPropertyStub
            });
            this.oGetPropertyStub.withArgs(this.sPagePathMock + "/sections").returns([
                { id: "0" },
                { id: "1" }
            ]);
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("returns index if section exists", function (assert) {
        //Act
        var iResult = this.oPagesService._getSectionIndex(this.sPagePathMock, this.sSectionIdMock);

        //Assert
        assert.strictEqual(this.oGetModelStub.callCount, 1, "getModel was called once");
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "getProperty was called once");
        assert.strictEqual(iResult, 1, "returned the correct result");
    });

    QUnit.test("returns undefined if section doesn't exists", function (assert) {
        //Arrange
        this.sSectionIdMock = "2";

        //Act
        var iResult = this.oPagesService._getSectionIndex(this.sPagePathMock, this.sSectionIdMock);

        //Assert
        assert.strictEqual(this.oGetModelStub.callCount, 1, "getModel was called once");
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "getProperty was called once");
        assert.strictEqual(iResult, undefined, "returned the correct result");
    });

    QUnit.test("returns undefined if page doesn't exists", function (assert) {
        //Arrange
        this.oGetPropertyStub.withArgs(this.sPagePathMock + "/sections").returns();

        //Act
        var iResult = this.oPagesService._getSectionIndex(this.sPagePathMock, this.sSectionIdMock);

        //Assert
        assert.strictEqual(this.oGetModelStub.callCount, 1, "getModel was called once");
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "getProperty was called once");
        assert.strictEqual(iResult, undefined, "returned the correct result");
    });

    QUnit.module("The _getVisualizationData function", {
        beforeEach: function () {
            this.sVizIdMock = "sVizId";
            this.oVisualizationsMock = {
                id: "visualizations"
            };
            this.oApplicationsMock = {
                id: "application"
            };
            this.oVizTypesMock = {
                id: "vizTypes"
            };
            this.oAdditionalVizDataMock = {
                id: "additionalVizData"
            };
            this.oVizDataMock = {
                id: "additionalVizDataId",
                vizId: "sVizId",
                vizType: "sTypeId",
                title: "sTitle",
                subtitle: "sSubTitle",
                icon: "sIcon",
                keywords: ["sKeyword"],
                info: "sInfo",
                target: { id: "oTarget" }
            };
            this.oVizDataMockWithoutId = {
                id: undefined,
                vizId: "sVizId",
                vizType: "sTypeId",
                title: "sTitle",
                subtitle: "sSubTitle",
                icon: "sIcon",
                keywords: ["sKeyword"],
                info: "sInfo",
                target: { id: "oTarget" }
            };
            this.oSiteMock = {
                applications: this.oApplicationsMock,
                visualizations: this.oVisualizationsMock,
                vizTypes: this.oVizTypesMock
            };
            this.oVizRefMock = {
                vizId: this.sVizIdMock
            };

            this.oUrlParsingMock = {
                id: "URLParsing"
            };

            sap.ushell.Container = {
                getServiceAsync: function (sParam) {
                    return sParam;
                }
            };
            this.oGetVizDataStub = sandbox.stub(readUtils, "getVizData");
            this.oGetVizDataStub.withArgs(this.oSiteMock, this.oAdditionalVizDataMock, this.oUrlParsingMock).returns(this.oVizDataMock);
            this.oGetVizDataStub.withArgs(this.oSiteMock, this.oVizRefMock).returns(this.oVizDataMockWithoutId);

            this.oPagesService = new Pages();

            this.oGenerateIdStub = sandbox.stub(this.oPagesService, "_generateId");
            this.oGenerateIdStub.returns("newId");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("returns correct values with oAdditionalVizData", function (assert) {
        //Arrange
        var oExpectedResult = {
            id: "additionalVizDataId",
            vizId: "sVizId",
            vizType: "sTypeId",
            title: "sTitle",
            subtitle: "sSubTitle",
            icon: "sIcon",
            keywords: ["sKeyword"],
            info: "sInfo",
            target: { id: "oTarget" }
        };

        //Act
        var oResult = this.oPagesService._getVisualizationData(
            null,
            this.sVizIdMock,
            this.oVisualizationsMock,
            this.oAdditionalVizDataMock,
            this.oApplicationsMock,
            this.oVizTypesMock,
            this.oUrlParsingMock
        );

        //Assert
        assert.deepEqual(oResult, oExpectedResult, "_getVisualizationData returns the correct result");
        assert.strictEqual(this.oGetVizDataStub.callCount, 1, "getVizData was called once");
        assert.strictEqual(this.oGenerateIdStub.callCount, 0, "_generateId was not called");
    });

    QUnit.test("returns correct values with oAdditionalVizData missing", function (assert) {
        //Arrange
        var oExpectedResult = {
            id: "newId",
            vizId: "sVizId",
            vizType: "sTypeId",
            title: "sTitle",
            subtitle: "sSubTitle",
            icon: "sIcon",
            keywords: ["sKeyword"],
            info: "sInfo",
            target: { id: "oTarget" }
        };

        //Act
        var oResult = this.oPagesService._getVisualizationData(
            null, this.sVizIdMock, this.oVisualizationsMock, null, this.oApplicationsMock, this.oVizTypesMock, this.oUrlParsingMock
        );

        //Assert
        assert.deepEqual(oResult, oExpectedResult, "_getVisualizationData returns the correct result");
        assert.strictEqual(this.oGetVizDataStub.callCount, 1, "getVizData was called once");
        assert.strictEqual(this.oGenerateIdStub.callCount, 1, "_generateId was called once");
    });

    QUnit.module("addVisualization", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: function (sParam) {
                    return sParam;
                }
            };
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oGetPageStub = sandbox.stub().resolves({
                payload: {
                    layout: {
                        sectionOrder: [
                            "someSectionId",
                            "someOtherSectionId"
                        ]
                    },
                    sections: {
                        someSectionId: {
                            layout: { vizOrder: [] },
                            viz: {}
                        },
                        someOtherSectionId: {
                            layout: { vizOrder: [] },
                            viz: {}
                        }
                    }
                }
            });
            this.oGetVisualizationsStub = sandbox.stub().resolves({ someVizId: {} });
            this.oGetApplicationsStub = sandbox.stub().resolves({});
            this.oGetVizTypesStub = sandbox.stub().resolves({});
            this.oPagesService = new Pages();
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                getPage: this.oGetPageStub,
                getVisualizations: this.oGetVisualizationsStub,
                getApplications: this.oGetApplicationsStub,
                getVizTypes: this.oGetVizTypesStub
            });
            this.oGetSectionIndexStub = sandbox.stub(this.oPagesService, "_getSectionIndex");
            this.oLoadPageStub = sandbox.stub(this.oPagesService, "loadPage").returns(Promise.resolve("/pages/0"));
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oGenerateIdStub = sandbox.stub(this.oPagesService, "_generateId");

            this.oGetSectionIndexStub.withArgs("/pages/0", "someSectionId").returns(0);
            this.oGetSectionIndexStub.withArgs("/pages/0", "someOtherSectionId").returns(1);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("add a visualization to a page without a default section, not giving a sectionId", function (assert) {
        // Arrange
        this.oPagesService._oPagesModel = new RestrictedJSONModel({
            pages: [{
                id: "somePageId",
                sections: [{
                    id: "someSectionId",
                    title: "someSectionTitle",
                    visualizations: []
                }, {
                    id: "someOtherSectionId",
                    title: "someOtherSectionTitle",
                    visualizations: []
                }]
            }]
        });
        this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");

        // Act
        return this.oPagesService.addVisualization("somePageId", null, "someVizId").then(function () {
            // Assert
            var aSections = this.oPagesService.getModel().getProperty("/pages/0/sections"),
                oFirstGroup = aSections[0],
                sFirstGroupTitle = oFirstGroup.title,
                sFirstGroupFirstVisualizationVizId = oFirstGroup.visualizations[0].vizId;

            assert.strictEqual(this.oGetSectionIndexStub.callCount, 1, "_getSectionIndex was called once");
            assert.strictEqual(this.oGenerateIdStub.callCount, 2, "_generateId was called twice");
            assert.deepEqual(this.oGenerateIdStub.getCall(0).args, ["somePageId"], "_generateId was called the first time with correct parameters");
            assert.deepEqual(this.oGenerateIdStub.getCall(1).args, ["somePageId"], "_generateId was called the second time with correct parameters");
            assert.strictEqual(aSections.length, 3, "A new section was added.");
            assert.strictEqual(sFirstGroupTitle, resources.i18n.getText("DefaultSection.Title"), "The title of the newly created section is correct.");
            assert.strictEqual(sFirstGroupFirstVisualizationVizId, "someVizId", "The content of the newly created section is correct.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once.");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("add a visualization to a page with a default section, not giving a sectionId", function (assert) {
        // Arrange
        this.oPagesService._oPagesModel = new RestrictedJSONModel({
            pages: [{
                id: "somePageId",
                sections: [{
                    id: "someSectionId",
                    title: resources.i18n.getText("DefaultSection.Title"),
                    default: true,
                    visualizations: []
                }, {
                    id: "someOtherSectionId",
                    title: "someOtherSectionTitle",
                    visualizations: []
                }]
            }]
        });
        this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");

        // Act
        return this.oPagesService.addVisualization("somePageId", null, "someVizId").then(function () {
            // Assert
            var aSections = this.oPagesService.getModel().getProperty("/pages/0/sections");

            assert.strictEqual(this.oGetSectionIndexStub.callCount, 1, "_getSectionIndex was called once");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "_generateId was called once");
            assert.deepEqual(this.oGenerateIdStub.getCall(0).args, ["somePageId"], "_generateId was called the first time with correct parameters");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once.");
            assert.strictEqual(aSections.length, 2, "No section was added.");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("add a visualization to a page with a default section at a different position, not giving a sectionId", function (assert) {
        // Arrange
        this.oPagesService._oPagesModel = new RestrictedJSONModel({
            pages: [{
                id: "somePageId",
                sections: [{
                    id: "someOtherSectionId",
                    title: "someOtherSectionTitle",
                    visualizations: []
                }, {
                    id: "someSectionId",
                    title: resources.i18n.getText("DefaultSection.Title"),
                    default: true,
                    visualizations: []
                }]
            }]
        });
        this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");

        // Act
        return this.oPagesService.addVisualization("somePageId", null, "someVizId").then(function () {
            // Assert
            var aSections = this.oPagesService.getModel().getProperty("/pages/0/sections");

            assert.strictEqual(this.oGetSectionIndexStub.callCount, 1, "_getSectionIndex was called once");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "_generateId was called once");
            assert.deepEqual(this.oGenerateIdStub.getCall(0).args, ["somePageId"], "_generateId was called the first time with correct parameters");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once.");
            assert.strictEqual(aSections.length, 2, "No section was added.");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("add a visualization to a page and giving a sectionId at position 0", function (assert) {
        // Arrange
        this.oPagesService._oPagesModel = new RestrictedJSONModel({
            pages: [{
                id: "somePageId",
                sections: [{
                    id: "someSectionId",
                    title: "someSectionTitle",
                    visualizations: []
                }, {
                    id: "someOtherSectionId",
                    title: "someOtherSectionTitle",
                    visualizations: []
                }]
            }]
        });
        this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");

        // Act
        return this.oPagesService.addVisualization("somePageId", "someSectionId", "someVizId").then(function () {
            // Assert
            var aSections = this.oPagesService.getModel().getProperty("/pages/0/sections");

            assert.strictEqual(this.oGetSectionIndexStub.callCount, 1, "_getSectionIndex was called once");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "_generateId was called once");
            assert.deepEqual(this.oGenerateIdStub.getCall(0).args, ["somePageId"], "_generateId was called the first time with correct parameters");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once.");
            assert.strictEqual(aSections.length, 2, "No section was added.");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("add a visualization to a page and giving a sectionId at position 1", function (assert) {
        // Arrange
        this.oPagesService._oPagesModel = new RestrictedJSONModel({
            pages: [{
                id: "somePageId",
                sections: [{
                    id: "someSectionId",
                    title: "someSectionTitle",
                    visualizations: []
                }, {
                    id: "someOtherSectionId",
                    title: "someOtherSectionTitle",
                    visualizations: []
                }]
            }]
        });
        this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");

        // Act
        return this.oPagesService.addVisualization("somePageId", "someOtherSectionId", "someVizId").then(function () {
            // Assert
            var aSections = this.oPagesService.getModel().getProperty("/pages/0/sections");

            assert.strictEqual(this.oGetSectionIndexStub.callCount, 1, "_getSectionIndex was called once");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "_generateId was called once");
            assert.deepEqual(this.oGenerateIdStub.getCall(0).args, ["somePageId"], "_generateId was called the first time with correct parameters");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once.");
            assert.strictEqual(aSections.length, 2, "No section was added.");
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when the CDM service cannot be retrieved", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addVisualization: Personalization cannot be saved: CDM Service cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.addVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when loadPage failed", function (assert) {
        // Arrange
        this.oLoadPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addVisualization: Personalization cannot be saved: Failed to load page, get visualizations or get applications.";
        // Act
        // Assert
        return this.oPagesService.addVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when getVisualizations failed", function (assert) {
        // Arrange
        this.oGetVisualizationsStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addVisualization: Personalization cannot be saved: Failed to load page, get visualizations or get applications.";
        // Act
        // Assert
        return this.oPagesService.addVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when getApplications failed", function (assert) {
        // Arrange
        this.oGetApplicationsStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addVisualization: Personalization cannot be saved: Failed to load page, get visualizations or get applications.";
        // Act
        // Assert
        return this.oPagesService.addVisualization()
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("rejects the promise, resets the personalization and logs the correct error when getPage failed", function (assert) {
        // Arrange
        sandbox.stub(this.oPagesService, "_getVisualizationData");
        this.oGetPageStub.rejects(this.oTestError);
        sandbox.stub(this.oPagesService, "getModel").returns({
            getProperty: sandbox.stub()
                .withArgs("/pages/0/sections/0/visualizations")
                .returns({
                    push: sandbox.stub()
                }),
            refresh: sandbox.stub()
        });
        this.aExpectedLogErrorArgs[0] = "Pages - addVisualization: Personalization cannot be saved: Failed to get page.";

        // Act
        // Assert
        return this.oPagesService.addVisualization(null, "someSectionId")
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addVisualization rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("moveSection", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oCDM31Page = { payload: { layout: { sectionOrder: ["0", "1", "2", "3"] } } };
            this.oGetPageStub = sandbox.stub().resolves(this.oCDM31Page);
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                getPage: this.oGetPageStub
            });

            this.oMockModel = {
                pages: [{
                    id: "testId",
                    sections: [{
                        id: "0",
                        title: "First Section",
                        visualizations: []
                    }, {
                        id: "1",
                        title: "Second Section",
                        visualizations: []
                    }, {
                        id: "2",
                        title: "Third Section",
                        visualizations: []
                    }, {
                        id: "3",
                        title: "Fourth Section",
                        visualizations: []
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.stub(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Does nothing if section is moved on itself", function (assert) {
        // Act
        this.oPagesService.moveSection(0, 0, 0);

        // Assert
        assert.strictEqual(this.oModelRefreshSpy.callCount, 0, "Model was not refreshed");
        assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), this.oMockModel, "the model was not manipulated");
        assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 0, "setPersonalizationActive was not called");
        assert.strictEqual(this.oSavePersonalizationStub.callCount, 0, "savePersonalization was not called");
    });

    QUnit.test("Moves section to the right", function (assert) {
        // Arrange
        var oExpectedCdm31Page = {
            payload: { layout: { sectionOrder: ["1", "0", "2", "3"] } }
        };
        var oExpectedModel = {
            pages: [{
                id: "testId",
                sections: [{
                    id: "1",
                    title: "Second Section",
                    visualizations: []
                }, {
                    id: "0",
                    title: "First Section",
                    visualizations: []
                }, {
                    id: "2",
                    title: "Third Section",
                    visualizations: []
                }, {
                    id: "3",
                    title: "Fourth Section",
                    visualizations: []
                }]
            }]
        };

        // Act
        return this.oPagesService.moveSection(0, 0, 2).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedCdm31Page, "the CDM page was correctly manipulated.");
        }.bind(this));
    });

    QUnit.test("Moves section to the left", function (assert) {
        // Arrange
        var oExpectedCdm31Page = { payload: { layout: { sectionOrder: ["2", "0", "1", "3"] } } };

        var oExpectedModel = {
            pages: [{
                id: "testId",
                sections: [{
                    id: "2",
                    title: "Third Section",
                    visualizations: []
                }, {
                    id: "0",
                    title: "First Section",
                    visualizations: []
                }, {
                    id: "1",
                    title: "Second Section",
                    visualizations: []
                }, {
                    id: "3",
                    title: "Fourth Section",
                    visualizations: []
                }]
            }]
        };

        // Act
        return this.oPagesService.moveSection(0, 2, 0).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
            assert.deepEqual(this.oCDM31Page, oExpectedCdm31Page, "the CDM page was correctly manipulated.");
        }.bind(this));

    });

    QUnit.test("checks the error cases when no page is received", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);

        // Act
        return this.oPagesService.moveSection(0, 2, 0).catch(function (oError) {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0],
                "Pages - moveSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.",
                "The error function from Log was called with the correct parameter.");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args[1],
                this.oTestError, "The error function from Log was called with the correct parameter.");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[2],
                "sap/ushell/services/Pages", "The error function from Log was called with the correct parameter.");
            assert.deepEqual(oError, this.oTestError, "moveSection rejected with the expected error");
        }.bind(this));
    });

    QUnit.test("checks the error case when the CDM service is not available", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);

        // Act
        return this.oPagesService.moveSection(0, 2, 0).catch(function (oError) {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args[0],
                "Pages - moveSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.",
                "The error function from Log was called with the correct parameter.");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args[1], this.oTestError,
                "The error function from Log was called with the correct parameter.");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[2],
                "sap/ushell/services/Pages", "The error function from Log was called with the correct parameter.");
            assert.deepEqual(oError, this.oTestError, "moveSection rejected with the expected error");
        }.bind(this));
    });

    QUnit.module("addSection", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };

            this.oCDMPage = {
                identification: {},
                payload: {
                    layout: { sectionOrder: [] },
                    sections: {}
                }
            };
            this.oGetPageStub = sandbox.stub().resolves(this.oCDMPage);
            this.oCDMService = {
                getPage: this.oGetPageStub,
                save: sandbox.stub()
            };
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oGetVizRefStub = sandbox.stub(readUtils, "getVizRef").returns({ id: "vizRef" });

            sap.ushell.Container.getServiceAsync = sandbox.stub().resolves(this.oCDMService);

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oGenerateIdStub = sandbox.stub(this.oPagesService, "_generateId");

            this.sPageIdMock = "sSomePageId";
            this.sSectionIdMock = "sNewSectionId";
            this.oGenerateIdStub.withArgs(this.sPageIdMock).returns(this.sSectionIdMock);

            this.oFirstSection = {
                id: "0",
                title: "First Section",
                visualizations: []
            };

            this.oData = {
                pages: [{
                    id: this.sPageIdMock,
                    sections: [this.oFirstSection]
                }]
            };

            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oData);

            this.oGetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "getProperty");
            this.oGetPropertyStub.withArgs("/pages/0/id").returns(this.sPageIdMock);
            this.oGetPropertyStub.callThrough();

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Adds a section to the Pages data model", function (assert) {
        // Act
        return this.oPagesService.addSection(0, 1).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");

            var oActualData = this.oPagesService._oPagesModel.getProperty("/");
            assert.strictEqual(oActualData.pages.length, 1, "The correct value has been found.");
            assert.strictEqual(oActualData.pages[0].sections.length, 2, "The correct value has been found.");
            assert.strictEqual(oActualData.pages[0].sections[0], this.oFirstSection, "The correct value has been found.");

            var oSecondSection = oActualData.pages[0].sections[1];
            assert.strictEqual(oSecondSection.id, this.sSectionIdMock, "The correct value has been found.");
            assert.strictEqual(oSecondSection.title, "", "The correct value has been found.");
            assert.strictEqual(oSecondSection.visible, true, "The correct value has been found.");
            assert.strictEqual(oSecondSection.locked, false, "The correct value has been found.");
            assert.deepEqual(oSecondSection.visualizations, [], "The correct value has been found.");
        }.bind(this));
    });

    QUnit.test("Retrieves the correct page by its ID", function (assert) {
        // Act
        return this.oPagesService.addSection(0, 1).then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oGetPageStub.callCount, 1, "The function getPage has been called once.");
            assert.strictEqual(this.oGetPageStub.firstCall.args[0], this.sPageIdMock, "The function getPage has been called with the correct parameter.");
        }.bind(this));
    });

    QUnit.test("Inserts a valid CDM section into the CDM page", function (assert) {
        // Act
        return this.oPagesService.addSection(0, 1).then(function () {
            // Assert
            var aSectionIds = Object.keys(this.oCDMPage.payload.sections);
            var oModelSection = this.oPagesService._oPagesModel.getProperty("/pages/0/sections/1");
            var oCdmSection = this.oCDMPage.payload.sections[aSectionIds[0]];

            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(aSectionIds.length, 1, "The section has been added to the object.");

            assert.ok(oCdmSection, "The section has been found.");
            assert.strictEqual(oCdmSection.title, "", "The correct value has been found.");
            assert.strictEqual(oCdmSection.id, this.sSectionIdMock, "The correct value has been found.");
            assert.strictEqual(oCdmSection.id, oModelSection.id, "The correct value has been found.");
            assert.deepEqual(oCdmSection, {
                id: "sNewSectionId",
                title: "",
                default: false,
                locked: false,
                preset: false,
                visible: true,
                layout: { vizOrder: [] },
                viz: {}
            }, "The section has the correct structure.");
        }.bind(this));
    });

    QUnit.test("Inserts a valid CDM section into the CDM page containing a visualization", function (assert) {
        // Act
        return this.oPagesService.addSection(0, 1, {
            locked: true,
            visualizations: [{ id: "someId", vizId: "someVizId" }]
        }).then(function () {
            // Assert
            var aSectionIds = Object.keys(this.oCDMPage.payload.sections);
            var oModelSection = this.oPagesService._oPagesModel.getProperty("/pages/0/sections/1");
            var oCdmSection = this.oCDMPage.payload.sections[aSectionIds[0]];

            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(aSectionIds.length, 1, "The section has been added to the object.");

            assert.ok(oCdmSection, "The section has been found.");
            assert.strictEqual(oCdmSection.title, "", "The correct value has been found.");
            assert.strictEqual(oCdmSection.id, this.sSectionIdMock, "The correct value has been found.");
            assert.strictEqual(oCdmSection.id, oModelSection.id, "The correct value has been found.");
            assert.deepEqual(oCdmSection, {
                id: "sNewSectionId",
                title: "",
                default: false,
                locked: true,
                preset: false,
                visible: true,
                layout: { vizOrder: ["someId"] },
                viz: {
                    someId: {
                        id: "someId",
                        vizId: "someVizId"
                    }
                }
            }, "The section has the correct structure.");
        }.bind(this));
    });

    QUnit.test("Inserts the correct ID into the CDM section layout data", function (assert) {
        // Arrange
        this.oCDMPage.payload.layout.sectionOrder = ["section0", "section1"];

        // Act
        return this.oPagesService.addSection(0, 1).then(function () {
            // Assert
            var aSectionIds = Object.keys(this.oCDMPage.payload.sections);
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(aSectionIds.length, 1, "The section has been added to the object.");
            assert.strictEqual(this.oCDMPage.payload.layout.sectionOrder[1], aSectionIds[0]);
        }.bind(this));
    });

    QUnit.test("Calls the setPersonalizationActive function", function (assert) {
        // Act
        var oPromise = this.oPagesService.addSection(0, 1);

        // Assert
        return oPromise.then(function () {
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "The function setPersonalizationActive has been called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
        }.bind(this));
    });

    QUnit.test("Calls the savePersonalization function", function (assert) {
        // Act
        var oPromise = this.oPagesService.addSection(0, 1);

        // Assert
        return oPromise.then(function () {
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "The function savePersonalization has been called exactly once.");
        }.bind(this));
    });

    QUnit.test("Adds a section with predefined properties", function (assert) {
        // Act
        var oPromise = this.oPagesService.addSection(0, 1, { title: "someText", locked: true, visible: false });

        return oPromise.then(function () {
            // Assert
            var oActualData = this.oPagesService._oPagesModel.getProperty("/");
            assert.strictEqual(oActualData.pages.length, 1, "The correct value has been found.");
            assert.strictEqual(oActualData.pages[0].sections.length, 2, "The correct value has been found.");
            assert.strictEqual(oActualData.pages[0].sections[0], this.oFirstSection, "The correct value has been found.");

            var oSecondSection = oActualData.pages[0].sections[1];
            assert.strictEqual(oSecondSection.id, this.sSectionIdMock, "The correct value has been found.");
            assert.strictEqual(oSecondSection.title, "someText", "The correct value has been found.");
            assert.strictEqual(oSecondSection.visible, false, "The correct value has been found.");
            assert.strictEqual(oSecondSection.locked, true, "The correct value has been found.");
            assert.deepEqual(oSecondSection.visualizations, [], "The correct value has been found.");

            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        }.bind(this));
    });

    QUnit.test("rejects the promise, cancels the personalization and logs the correct error if CDM Service is not retrievable", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.addSection(0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("rejects the promise, cancels the personalization and logs the correct error if getPage fails", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - addSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.addSection(0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Inserts only the vizRef of a Bookmark", function (assert) {
        // Arrange
        var oSectionRef = {
            visualizations: [
                {
                    id: "bookmarkTile",
                    isBookmark: true
                }
            ]
        };
        var oExpectedResult = {
            bookmarkTile: {
                id: "vizRef"
            }
        };
        // Act
        return this.oPagesService.addSection(0, 1, oSectionRef).then(function () {
            // Assert
            assert.strictEqual(this.oGetVizRefStub.callCount, 1, "getVizRef was called once");
            assert.deepEqual(this.oCDMPage.payload.sections.sNewSectionId.viz, oExpectedResult, "Added the bookmarktile correctly to the section");
        }.bind(this));
    });

    QUnit.module("deleteSection", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPageStub = sandbox.stub();

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub
            });

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");

            this.oMockPage = {
                payload: {
                    sections: {
                        0: { id: "0", title: "First Section", visualizations: [] },
                        1: { id: "1", title: "Second Section", visualizations: [] }
                    },
                    layout: { sectionOrder: ["0", "1"] }
                }
            };
            this.oGetPageStub.resolves(this.oMockPage);

            this.oMockModel = {
                pages: [{
                    id: "page1",
                    sections: [{
                        id: "0",
                        title: "First Section",
                        visualizations: []
                    }, {
                        id: "1",
                        title: "Second Section",
                        visualizations: []
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.stub(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("deletes a section", function (assert) {
        var done = assert.async();

        // Arrange
        var oExpectedModelUI = {
            pages: [{
                id: "page1",
                sections: [{
                    id: "0",
                    title: "First Section",
                    visualizations: []
                }]
            }]
        };

        var oExpectedPageObject = {
            payload: {
                sections: {
                    0: { id: "0", title: "First Section", visualizations: [] }
                },
                layout: { sectionOrder: ["0"] }
            }
        };

        // Act
        var oPromise = this.oPagesService.deleteSection(0, 1);
        oPromise.then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.ok(this.oSavePersonalizationStub.calledWithExactly("page1"), "savePersonalization was called with correct parameter");
            assert.deepEqual(this.oMockPage, oExpectedPageObject, "the page was manipulated on the expected way");
            assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModelUI, "the model was manipulated on the expected way");

            done();
        }.bind(this));
    });

    QUnit.test("rejects if returned page is invalid", function (assert) {
        var done = assert.async();
        this.oGetPageStub.resolves(null);
        // Act
        var oPromise = this.oPagesService.deleteSection(0, 1);
        assert.ok(oPromise instanceof Promise, "Return value is a promise");
        oPromise
            .then(function () {
                assert.ok(false, "Promise should reject cause no Page returned");
                done();
            })
            .catch(function () {
                assert.ok(true, "Promise rejected cause no Page returned");
                done();
            });
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the CDM service is not retrievable", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - deleteSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.deleteSection(0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "deleteSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the Page is not retrievable", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - deleteSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.deleteSection(0, 1)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "deleteSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("setSectionVisibility", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPageStub = sandbox.stub();
            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub
            });

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");

            this.oMockPage = {
                payload: {
                    sections: {
                        0: {
                            id: "0",
                            title: "First Section",
                            visualizations: [],
                            visible: true
                        }
                    },
                    layout: { sectionOrder: ["0"] }
                }
            };
            this.oGetPageStub.resolves(this.oMockPage);

            this.oMockModel = {
                pages: [{
                    id: "page1",
                    sections: [{
                        id: "0",
                        title: "First Section",
                        visualizations: [],
                        visible: true
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("sets a sections visibility", function (assert) {
        var done = assert.async();
        // Arrange
        var oExpectedModelCDM = {
            payload: {
                sections: {
                    0: {
                        id: "0",
                        title: "First Section",
                        visualizations: [],
                        visible: false
                    }
                },
                layout: { sectionOrder: ["0"] }
            }
        };

        // Act
        var oPromise = this.oPagesService.setSectionVisibility(0, 0, false);

        oPromise.then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true, "setPersonalizationActive was called with true");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.getCall(0).args, ["page1"], "savePersonalization was called with correct parameter");
            assert.deepEqual(this.oMockPage, oExpectedModelCDM, "The CDM data was correctly altered");

            done();
        }.bind(this));
    });

    QUnit.test("rejects if returned page is invalid", function (assert) {
        var done = assert.async();
        this.oGetPageStub.resolves(null);

        // Act
        var oPromise = this.oPagesService.setSectionVisibility(0, 0, false);
        assert.ok(oPromise instanceof Promise, "Return value is a promise");
        oPromise
            .then(function () {
                assert.ok(false, "Promise should reject cause no Page returned");
                done();
            })
            .catch(function () {
                assert.ok(true, "Promise rejected cause no Page returned");
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalization was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true, "setPersonalizationActive was called with parameter \"true\" with the first time");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with parameter \"false\" with the second time");
                done();
            }.bind(this));
    });

    QUnit.test("returns an empty promise when the section visibility equals the new visibility", function (assert) {
        // Arrange
        this.oGetPageStub.resolves(null);

        // Act
        return this.oPagesService.setSectionVisibility(0, 0, true).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, undefined, "undefined was returned");
        });
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the Page is not retrievable", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - setSectionVisibility: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.setSectionVisibility(0, 0)
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "setSectionVisibility rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the CDM Service is not retrievable", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - setSectionVisibility: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.setSectionVisibility(0, 0)
            .catch(function (oError) {
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "setSectionVisibility rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("renameSection", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 10;
            sap.ushell = { Container: {} };

            this.oGetPageStub = sandbox.stub();
            this.oLogErrorStub = sandbox.stub(Log, "error");

            sap.ushell.Container.getServiceAsync = sandbox.stub().resolves({
                getPage: this.oGetPageStub
            });

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");

            this.oMockModel = {
                pages: [{
                    id: "page-1",
                    sections: [{
                        id: "section-1",
                        title: "Section 1",
                        visualizations: []
                    }]
                }]
            };

            this.oModelRefreshSpy = sandbox.spy(this.oPagesService._oPagesModel, "refresh");
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("renames a section", function (assert) {
        // Arrange
        var oExpectedModel = {
            pages: [{
                id: "page-1",
                sections: [{
                    id: "section-1",
                    title: "Some New Name",
                    visualizations: []
                }]
            }]
        };

        // Act
        this.oPagesService.renameSection(0, 0, "Some New Name");

        // Assert
        assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
        assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
        assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true, "setPersonalizationActive was called with parameter \"true\"");
        assert.deepEqual(this.oPagesService._oPagesModel.getProperty("/"), oExpectedModel, "the model was manipulated on the expected way");
    });

    QUnit.test("changes the respective page title in the CDM 3.1 site", function (assert) {
        // Arrange
        var oCDMPage = {
            identification: { id: "page-1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1",
                        title: "Section 1"
                    }
                }
            }
        };

        this.oGetPageStub.withArgs("page-1").callsFake(function () {
            return oCDMPage;
        });

        var oExpectedCDMPage = {
            identification: { id: "page-1", title: "Page 1" },
            payload: {
                layout: { sectionOrder: ["section-1"] },
                sections: {
                    "section-1": {
                        id: "section-1", title: "New Title"
                    }
                }
            }
        };

        // Act
        return this.oPagesService.renameSection(0, 0, "New Title").then(function () {
            // Assert
            assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
            assert.deepEqual(oCDMPage, oExpectedCDMPage, "The CDM 3.1 site was adapted accordingly.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, ["page-1"], "savePersonalization was called with the page id of the updated page");
        }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the CDM Service is not retrievable", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - renameSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.renameSection(0, 0, "New Title")
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "renameSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Rejects the promise, logs the correct error and cancels the personalization when the Page is not retrievable", function (assert) {
        // Arrange
        this.oGetPageStub.rejects(this.oTestError);
        this.aExpectedLogErrorArgs[0] = "Pages - renameSection: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        // Act
        // Assert
        return this.oPagesService.renameSection(0, 0, "New Title")
            .catch(function (oError) {
                assert.strictEqual(this.oModelRefreshSpy.callCount, 1, "Model was refreshed");
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "setPersonalizationActive was called exactly twice");
                assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false, "setPersonalizationActive was called with the expected argument");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs, "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "renameSection rejected with the expected error");
            }.bind(this));
    });

    QUnit.module("resetSection", {
        beforeEach: function () {
            this.oGetVisualizationsStub = sandbox.stub();
            this.oGetApplicationsStub = sandbox.stub();
            this.oGetVizTypesStub = sandbox.stub();
            this.oGetOriginalPageStub = sandbox.stub();
            this.oGetPageStub = sandbox.stub();

            this.oLogErrorStub = sandbox.stub(Log, "error");

            sap.ushell = { Container: {} };

            sap.ushell.Container.getServiceAsync = sandbox.stub().withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub,
                getVisualizations: this.oGetVisualizationsStub,
                getApplications: this.oGetApplicationsStub,
                getVizTypes: this.oGetVizTypesStub,
                getOriginalPage: this.oGetOriginalPageStub
            });

            this.oPagesService = new Pages();

            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oGenerateIdStub = sandbox.stub(this.oPagesService, "_generateId");
            this.oGetModelForPageStub = sandbox.stub(this.oPagesService, "_getModelForPage");
            this.oGetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "getProperty");
            this.oSetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "_setProperty");

            this.oVisualizationsMock = { id: "visualizations" };
            this.oGetVisualizationsStub.resolves(this.oVisualizationsMock);

            this.oApplicationsMock = { id: "applications" };
            this.oGetApplicationsStub.resolves(this.oApplicationsMock);

            this.oVizTypesMock = { id: "vizTypes" };
            this.oGetVizTypesStub.resolves(this.oVizTypesMock);

            this.sPageIdMock = "pageId";
            this.sSectionIdMock = "sectionId";
            this.sSecondSectionIdMock = "secondSectionId";
            this.iPageIndexMock = 0;
            this.iSectionIndexMock = 0;
            this.sVizIdMock = "0";
            this.sNewVizIdMock = "1";

            this.oGenerateIdStub.withArgs(this.sPageIdMock).returns(this.sNewVizIdMock);

            this.oOriginalCdmPageMock = {
                payload: {
                    sections: {
                        sectionId: {
                            layout: { vizOrder: [this.sVizIdMock] },
                            viz: {
                                0: { id: this.sVizIdMock }
                            }
                        }
                    }
                }
            };
            this.oGetOriginalPageStub.withArgs(this.sPageIdMock).returns(this.oOriginalCdmPageMock);

            this.oCdmPageMock = {
                identification: { id: this.sPageIdMock },
                payload: {
                    sections: {
                        sectionId: {
                            layout: { vizOrder: [] },
                            viz: {}
                        },
                        secondSectionId: {
                            layout: { vizOrder: [this.sVizIdMock] },
                            viz: {
                                0: { id: this.sVizIdMock }
                            }
                        }
                    }
                }
            };

            this.oOrignalPageModelMock = {
                sections: [{
                    id: this.sSectionIdMock,
                    visualizations: [{ id: this.sVizIdMock }]
                }]
            };
            this.oPageModelMock = {
                sections: [{
                    id: this.sSectionIdMock,
                    visualizations: []
                }, {
                    id: this.sSecondSectionIdMock,
                    visualizations: [{ id: this.sVizIdMock }]
                }]
            };

            this.oGetPageStub.resolves(this.oCdmPageMock);

            this.oGetPropertyStub.withArgs("/pages/" + this.iPageIndexMock + "/id").returns(this.sPageIdMock);
            this.oGetPropertyStub.withArgs("/pages/" + this.iPageIndexMock + "/sections/" + this.iSectionIndexMock + "/id").returns(this.sSectionIdMock);
            this.oGetPropertyStub.withArgs("/pages/" + this.iPageIndexMock).returns(this.oPageModelMock);

            this.oGetModelForPageStub.withArgs(this.oOriginalCdmPageMock, this.oVisualizationsMock, this.oApplicationsMock).resolves(this.oOrignalPageModelMock);
        },

        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Updates the CDM 3.1 Site and the model of the page if a section is reset.", function (assert) {
        // Arrange
        var oExpectedCdmPage = {
            identification: { id: this.sPageIdMock },
            payload: {
                sections: {
                    sectionId: {
                        layout: { vizOrder: [this.sVizIdMock] },
                        viz: {
                            0: { id: this.sVizIdMock }
                        }
                    },
                    secondSectionId: {
                        layout: { vizOrder: [this.sNewVizIdMock] },
                        viz: {
                            1: { id: this.sNewVizIdMock }
                        }
                    }
                }
            }
        };

        // Act
        return this.oPagesService.resetSection(this.iPageIndexMock, this.iSectionIndexMock).then(function () {
            // Assert
            assert.deepEqual(this.oCdmPageMock, oExpectedCdmPage, "The section was reset correctly.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true,
                "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1,
                "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, [this.sPageIdMock],
                "savePersonalization was called with the right parameters");
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called exactly once");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args,
                ["/pages/" + this.iPageIndexMock + "/sections/" + this.iSectionIndexMock, this.oOrignalPageModelMock.sections[0]],
                "setProperty was called with the right parameters");
        }.bind(this));
    });

    QUnit.test("checks the error case when no page is received", function (assert) {
        // Arrange
        this.oGetPageStub.rejects();

        // Act
        return this.oPagesService.resetSection(this.iPageIndexMock, this.iSectionIndexMock).catch(function () {
            // Assert
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "The error function from Log was called once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "'setPersonalizationActive' was called twice.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true,
                "setPersonalizationActive was called with parameter \"true\" with the first time");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false,
                "setPersonalizationActive was called with parameter \"false\" with the second time");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0],
                "Pages - resetSection: Personalization cannot be saved: Failed to gather data from CDM Service.");
        }.bind(this));
    });

    QUnit.test("checks the error case when the CDM service is not available", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject();

        // Act
        return this.oPagesService.resetSection(this.iPageIndexMock, this.iSectionIndexMock).catch(function () {
            // Assert
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "'setPersonalizationActive' was called twice.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true,
                "setPersonalizationActive was called with parameter \"true\" with the first time");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false,
                "setPersonalizationActive was called with parameter \"false\" with the second time");
        }.bind(this));
    });

    QUnit.module("resetPage", {
        beforeEach: function () {
            this.oGetVisualizationsStub = sandbox.stub();
            this.oGetApplicationsStub = sandbox.stub();
            this.oGetVizTypesStub = sandbox.stub();
            this.oGetOriginalPageStub = sandbox.stub();
            this.oGetPageStub = sandbox.stub();

            sap.ushell = { Container: {} };

            sap.ushell.Container.getServiceAsync = sandbox.stub().withArgs("CommonDataModel").resolves({
                getPage: this.oGetPageStub,
                getVisualizations: this.oGetVisualizationsStub,
                getApplications: this.oGetApplicationsStub,
                getVizTypes: this.oGetVizTypesStub,
                getOriginalPage: this.oGetOriginalPageStub
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oPagesService = new Pages();

            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");

            this.sPageIdMock = "pageId";
            this.sSectionIdMock = "sectionId";
            this.iPageIndexMock = 0;
            this.iSectionIndexMock = 0;

            this.oOriginalCDMPageMock = { payload: { sections: { sectionId: { id: "sectionId" } } } };
            this.oGetOriginalPageStub.withArgs(this.sPageIdMock).returns(this.oOriginalCDMPageMock);

            this.oVisualizationsMock = { id: "visualizations" };
            this.oGetVisualizationsStub.resolves(this.oVisualizationsMock);

            this.oApplicationsMock = { id: "applications" };
            this.oGetApplicationsStub.resolves(this.oApplicationsMock);

            this.oVizTypesMock = { id: "vizTypes" };
            this.oGetVizTypesStub.resolves(this.oVizTypesMock);

            this.oCdmPageMock = {
                identification: { id: this.sPageIdMock },
                payload: { sections: {} }
            };
            this.oGetPageStub.resolves(this.oCdmPageMock);

            this.oGetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "getProperty");
            this.oSetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "_setProperty");

            this.oGetPropertyStub.withArgs("/pages/" + this.iPageIndexMock + "/id").returns(this.sPageIdMock);

            this.oGetModelForPageStub = sandbox.stub(this.oPagesService, "_getModelForPage");

            this.oMockSection = { id: this.sSectionIdMock };
            this.oOrignalPageModelMock = { sections: [this.oMockSection] };

            this.oGetModelForPageStub.withArgs(this.oOriginalCDMPageMock, this.oVisualizationsMock, this.oApplicationsMock)
                .resolves(this.oOrignalPageModelMock);
            this.oGetPagePath = sandbox.stub(this.oPagesService, "getPagePath").returns("");
        },

        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("gets called correctly", function (assert) {
        // Act
        return this.oPagesService.resetPage(this.iPageIndexMock).then(function () {
            // Assert
            assert.deepEqual(this.oOriginalCDMPageMock.payload, this.oCdmPageMock.payload, "The CDM page payload was adapted correctly.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true,
                "setPersonalizationActive was called with parameter \"true\"");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "savePersonalization was called exactly once");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, [this.sPageIdMock],
                "savePersonalization was called with the right parameters");
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called exactly once");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/pages/" + this.iPageIndexMock, this.oOrignalPageModelMock],
                "setProperty was called with the right parameters");
        }.bind(this));
    });

    QUnit.test("checks the error case when no page is received", function (assert) {
        // Arrange
        this.oGetPageStub.rejects();

        // Act
        return this.oPagesService.resetPage(this.iPageIndexMock).catch(function () {
            // Assert
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "The error function from Log was called once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "'setPersonalizationActive' was called twice.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true,
                "setPersonalizationActive was called with parameter \"true\" with the first time");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false,
                "setPersonalizationActive was called with parameter \"false\" with the second time");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0],
                "Pages - resetPage: Personalization cannot be saved: Failed to gather data from CDM Service.");
        }.bind(this));
    });

    QUnit.test("checks the error case when the CDM service is not available", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject();

        // Act
        return this.oPagesService.resetPage(this.iPageIndexMock).catch(function () {
            // Assert
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 2, "'setPersonalizationActive' was called twice.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(0).args[0], true,
                "setPersonalizationActive was called with parameter \"true\" with the first time");
            assert.strictEqual(this.oSetPersonalizationActiveStub.getCall(1).args[0], false,
                "setPersonalizationActive was called with parameter \"false\" with the second time");
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0],
                "Pages - resetPage: Personalization cannot be saved: Failed to gather data from CDM Service.");
        }.bind(this));
    });

    QUnit.module("addBookmarkToPage", {
        beforeEach: function () {
            this.aVizOrderDefaultSection = [];
            this.oVizDefaultSection = {};
            this.aVizOrderAddSection = [];
            this.oVizAddSection = {};
            this.oCDM31Site = {
                payload: {
                    sections: {
                        "section-default": {
                            layout: { vizOrder: this.aVizOrderDefaultSection },
                            viz: this.oVizDefaultSection
                        },
                        "section-add": {
                            layout: { vizOrder: this.aVizOrderAddSection },
                            viz: this.oVizAddSection
                        }
                    }
                }
            };

            this.oVizRefMock = {
                id: "unique-id",
                title: "bookmark-title",
                subTitle: "bookmark-subtitle",
                icon: "bookmark-icon",
                info: "bookmark-info",
                numberUnit: "EUR",
                target: {
                    target: "FromBookmark"
                },
                indicatorDataSource: {
                    path: "bookmark-serviceUrl",
                    refresh: "bookmark-serviceRefreshInterval"
                },
                isBookmark: true,
                vizType: "some.custom.vizType",
                vizConfig: {
                    id: "vizConfig"
                }
            };
            this.oVizDataMock = {
                id: "unique-id"
            };
            this.oVizTypesMock = {
                id: "vizTypes"
            };

            this.oGetServiceAsyncStub = sandbox.stub();

            this.oUrlParsingMock = {
                id: "URLParsing"
            };
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(this.oUrlParsingMock);

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oToTargetFromHashStub = sandbox.stub(utilsCdm, "toTargetFromHash");
            this.oToTargetFromHashStub.withArgs("bookmark-url", this.oUrlParsingMock).returns({
                target: "FromBookmark"
            });

            this.oGetVizRefStub = sandbox.stub(readUtils, "getVizRef");
            this.oGetVizRefStub.withArgs(this.oVizDataMock).returns(this.oVizRefMock);

            this.oPagesService = new Pages();
            this.oSetPersonalizationActiveStub = sandbox.stub(this.oPagesService, "setPersonalizationActive");
            this.oSavePersonalizationStub = sandbox.stub(this.oPagesService, "savePersonalization");
            this.oLoadPageStub = sandbox.stub(this.oPagesService, "loadPage");
            this.oGenerateIdStub = sandbox.stub(this.oPagesService, "_generateId").returns("unique-id");
            this.oGetPropertyStub = sandbox.stub(this.oPagesService._oPagesModel, "getProperty");
            this.oRefreshStub = sandbox.stub(this.oPagesService._oPagesModel, "refresh");
            this.oAddSectionStub = sandbox.stub(this.oPagesService, "addSection");
            this.oGetVisualizationDataStub = sandbox.stub(this.oPagesService, "_getVisualizationData");
            this.oGetVisualizationDataStub.withArgs(
                "page-id", undefined, {}, this.oVizRefMock, {}, this.oVizTypesMock, this.oUrlParsingMock
            ).returns(this.oVizDataMock);
            this.oGetPageStub = sandbox.stub().resolves(this.oCDM31Site);
            this.oGetVizTypesStub = sandbox.stub().resolves(this.oVizTypesMock);
            this.oPagesService._oCdmServicePromise = Promise.resolve({
                getVizTypes: this.oGetVizTypesStub,
                getPage: this.oGetPageStub
            });

            this.oTestError = {
                message: "foo"
            };
            this.aExpectedLogErrorArgs = [
                null,
                this.oTestError,
                this.oPagesService.COMPONENT_NAME
            ];
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns a rejected promise if no page id is specified", function (assert) {
        // Arrange
        var sExpectedMessage = "Pages - addBookmarkToPage: Adding bookmark tile failed: No page id is provided.";
        var oBookmarkData = {
            title: "bookmark-title",
            url: "bookmark-url"
        };

        // Act
        return this.oPagesService.addBookmarkToPage(null, oBookmarkData).catch(function (error) {
            assert.strictEqual(error, sExpectedMessage, "A rejected promise with the specified error message was returned.");
        });
    });

    QUnit.test("Returns a rejected promise if 'loadPage' fails", function (assert) {
        // Arrange
        this.oLoadPageStub.rejects("loadPage failed");
        var oBookmarkData = {
            title: "bookmark-title",
            url: "bookmark-url"
        };
        var sPageId = "page-id";

        // Act
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData).catch(function (error) {
            // Assert
            assert.strictEqual(error.name, "loadPage failed", "A rejected promise with the specified error message was returned.");
            assert.deepEqual(this.oLogErrorStub.firstCall.args[0],
                "Pages - addBookmarkToPage: Personalization cannot be saved: Could not load page.",
                "A 'error' method of Log was called with the specified error message.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise, cancels the personalization and logs the correct error when loadPage fails", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] = "Pages - addBookmarkToPage: Personalization cannot be saved: Could not load page.";
        this.oLoadPageStub.rejects(this.oTestError);
        // Act
        // Assert
        return this.oPagesService.addBookmarkToPage("foo")
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs,
                    "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addBookmarkToPage rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Returns a rejected promise, cancels the personalization and logs the correct error when the page cannot be retrieved", function (assert) {
        // Arrange
        this.aExpectedLogErrorArgs[0] =
            "Pages - addBookmarkToPage: Personalization cannot be saved: CDM Service or Page cannot be retrieved.";
        this.oGetPageStub.rejects(this.oTestError);
        this.oLoadPageStub.resolves("/pages/0");
        this.oGetPropertyStub.returns({
            sections: [{
                id: "section-1",
                default: true,
                visualizations: []
            }]
        });
        var oBookmarkData = {
            title: "bookmark-title",
            url: "bookmark-url"
        };
        var sPageId = "page-id";

        // Act
        // Assert
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData)
            .catch(function (oError) {
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
                assert.deepEqual(this.oLogErrorStub.getCall(0).args, this.aExpectedLogErrorArgs,
                    "Log error was called with the expected arguments");
                assert.deepEqual(oError, this.oTestError, "addBookmarkToPage rejected with the expected error");
            }.bind(this));
    });

    QUnit.test("Creates a new section together with a new visualization if there is no existing default section", function (assert) {
        // Arrange
        this.oLoadPageStub.resolves("/pages/0");
        this.oGetPropertyStub.returns({
            sections: [{
                id: "section-1",
                default: false
            }]
        });
        var oBookmarkData = {
            title: "bookmark-title",
            subtitle: "bookmark-subtitle",
            icon: "bookmark-icon",
            numberUnit: "EUR",
            info: "bookmark-info",
            url: "bookmark-url",
            serviceUrl: "bookmark-serviceUrl",
            serviceRefreshInterval: "bookmark-serviceRefreshInterval",
            vizType: "some.custom.vizType",
            vizConfig: {
                id: "vizConfig"
            }
        };
        var sPageId = "page-id";
        var oExpectedArgs = [
            0,
            0,
            {
                title: resources.i18n.getText("DefaultSection.Title"),
                default: true,
                visualizations: [this.oVizDataMock]
            }
        ];

        // Act
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData).then(function () {
            // Assert
            assert.strictEqual(this.oGetVisualizationDataStub.callCount, 1, "_getVisualizationData was called once");
            assert.deepEqual(this.oGetVisualizationDataStub.getCall(0).args,
                ["page-id", undefined, {}, this.oVizRefMock, {}, this.oVizTypesMock, this.oUrlParsingMock],
                "_getVisualizationData was called with the correct parameters");
            assert.strictEqual(this.oAddSectionStub.callCount, 1, "The method 'addSection' was called once.");
            assert.deepEqual(this.oAddSectionStub.firstCall.args, oExpectedArgs,
                "The method 'addSection' was called with right parameters.");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "The method '_generateId' was called with right parameters.");
            assert.deepEqual(this.oGenerateIdStub.firstCall.args, ["page-id"],
                "The method '_generateId' was called with right parameters.");
        }.bind(this));
    });

    QUnit.test("Adds the visualization to the existing default section if there is one", function (assert) {
        // Arrange
        var oDefaultSection = {
            id: "section-default",
            default: true,
            visualizations: []
        };
        var sPageId = "page-id";
        var oBookmarkData = {
            title: "bookmark-title",
            subtitle: "bookmark-subtitle",
            icon: "bookmark-icon",
            info: "bookmark-info",
            numberUnit: "EUR",
            url: "bookmark-url",
            serviceUrl: "bookmark-serviceUrl",
            serviceRefreshInterval: "bookmark-serviceRefreshInterval",
            vizType: "some.custom.vizType",
            vizConfig: {
                id: "vizConfig"
            }
        };
        var oExpectedSectionInModel = {
            id: "section-default",
            default: true,
            visualizations: [{
                id: "unique-id"
            }]
        };
        var oExpectedVizInCDM31Site = this.oVizRefMock;
        this.oLoadPageStub.resolves("/pages/0");
        this.oGetPropertyStub.returns({
            sections: [oDefaultSection]
        });

        // Act
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData).then(function () {
            // Assert
            assert.deepEqual(oDefaultSection, oExpectedSectionInModel, "The bookmark was inserted into the default section in the model.");
            assert.strictEqual(this.oRefreshStub.callCount, 1, "The model of the page was refreshed.");
            assert.deepEqual(this.aVizOrderDefaultSection, ["unique-id"],
                "The 'vizOrder' property in the page in the CDM3.1 site was updated.");
            assert.deepEqual(this.oVizDefaultSection["unique-id"], oExpectedVizInCDM31Site,
                "The 'viz' property in the page in the CDM3.1 site was updated.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "The personalization was saved.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true,
                "setPersonalizationActive was called with parameter \"true\"");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, ["page-id"],
                "The right page id was passed to 'savePersonalization'.");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "The method '_generateId' was called with right parameters.");
            assert.deepEqual(this.oGenerateIdStub.firstCall.args, ["page-id"],
                "The method '_generateId' was called with right parameters.");
            assert.strictEqual(this.oGetVizRefStub.callCount, 1, "getVizRef was called once");
        }.bind(this));
    });

    QUnit.test("Adds the visualization to the specific section", function (assert) {
        // Arrange
        var oDefaultSection = {
            id: "section-default",
            default: true,
            visualizations: []
        };
        var oSectionToAdd = {
            id: "section-add",
            default: false,
            visualizations: []
        };
        var sPageId = "page-id";
        var oBookmarkData = {
            title: "bookmark-title",
            subtitle: "bookmark-subtitle",
            icon: "bookmark-icon",
            info: "bookmark-info",
            numberUnit: "EUR",
            url: "bookmark-url",
            serviceUrl: "bookmark-serviceUrl",
            serviceRefreshInterval: "bookmark-serviceRefreshInterval",
            vizType: "some.custom.vizType",
            vizConfig: {
                id: "vizConfig"
            }
        };
        var oExpectedSectionInModel = {
            id: "section-add",
            default: false,
            visualizations: [{
                id: "unique-id"
            }]
        };
        var oExpectedVizInCDM31Site = this.oVizRefMock;
        this.oLoadPageStub.resolves("/pages/0");
        this.oGetPropertyStub.returns({
            sections: [oDefaultSection, oSectionToAdd]
        });

        // Act
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData, oSectionToAdd.id).then(function () {
            // Assert
            assert.equal(oDefaultSection.visualizations.length, 0, "The visualizations of the default section was not changed.");
            assert.deepEqual(oSectionToAdd, oExpectedSectionInModel, "The bookmark was inserted into the specific section in the model.");
            assert.strictEqual(this.oRefreshStub.callCount, 1, "The model of the page was refreshed.");
            assert.deepEqual(this.aVizOrderAddSection, ["unique-id"],
                "The 'vizOrder' property in the page in the CDM3.1 site was updated.");
            assert.deepEqual(this.oVizAddSection["unique-id"], oExpectedVizInCDM31Site,
                "The 'viz' property in the page in the CDM3.1 site was updated.");
            assert.strictEqual(this.oSavePersonalizationStub.callCount, 1, "The personalization was saved.");
            assert.strictEqual(this.oSetPersonalizationActiveStub.firstCall.args[0], true,
                "setPersonalizationActive was called with parameter \"true\"");
            assert.deepEqual(this.oSavePersonalizationStub.firstCall.args, ["page-id"],
                "The right page id was passed to 'savePersonalization'.");
            assert.strictEqual(this.oGenerateIdStub.callCount, 1, "The method '_generateId' was called with right parameters.");
            assert.deepEqual(this.oGenerateIdStub.firstCall.args, ["page-id"],
                "The method '_generateId' was called with right parameters.");
            assert.strictEqual(this.oGetVizRefStub.callCount, 1, "getVizRef was called once");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise if the specific section was not found", function (assert) {
        // Arrange
        var sPageId = "page-id";
        var oBookmarkData = {
            title: "bookmark-title",
            subtitle: "bookmark-subtitle",
            icon: "bookmark-icon"
        };
        this.oLoadPageStub.resolves("/pages/0");
        this.oGetPropertyStub.returns({
            sections: []
        });

        var sExpectedMessage = "Pages - addBookmarkToPage: Adding bookmark tile failed: specified section was not found in the page.";

        // Act
        return this.oPagesService.addBookmarkToPage(sPageId, oBookmarkData, "not-found").catch(function (oError) {
            assert.strictEqual(this.oLogErrorStub.callCount, 1, "the error function from Log was called once.");
            assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage], "Log error was called with the expected arguments");
            assert.deepEqual(oError, sExpectedMessage, "addBookmarkToPage rejected with the expected error");
        }.bind(this));
    });

    QUnit.module("The function _findBookmarks", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oPagesData = [
                {
                    identification: {
                        id: "page1"
                    },
                    payload: {
                        sections: {
                            section1: {
                                id: "section1",
                                viz: {}
                            }
                        }
                    }
                }
            ];
            this.oTestSection = this.oPagesData[0].payload.sections.section1;

            this.oCdmServiceStub = {
                getAllPages: sandbox.stub().resolves(this.oPagesData)
            };
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceStub);

            this.oURLParsingStub = {};
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(this.oURLParsingStub);

            this.oTarget = {
                semanticObject: "Action",
                action: "toappnavsample"
            };
            sandbox.stub(utilsCdm, "toTargetFromHash").withArgs("#Action-toappnavsample").returns(this.oTarget);

            this.oHarmonizeTargetStub = sandbox.stub(readUtils, "harmonizeTarget").callsFake(function (oTarget) {
                return oTarget;
            });

            this.oPagesService = new Pages();

        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Finds all bookmarks in multiple pages and sections", function (assert) {
        //Arrange
        var oPagesData = [
            {
                identification: {
                    id: "page1"
                },
                payload: {
                    sections: {
                        section1: {
                            id: "section1",
                            viz: {
                                vizRef1: {
                                    id: "vizRef1",
                                    isBookmark: true,
                                    target: {
                                        semanticObject: "Action",
                                        action: "toappnavsample"
                                    }
                                },
                                vizRef2: {
                                    id: "vizRef2",
                                    target: {
                                        semanticObject: "Action",
                                        action: "toappnavsample"
                                    }
                                },
                                vizRef3: {
                                    id: "vizRef3",
                                    target: {
                                        semanticObject: "Action",
                                        action: "tobookmarksample"
                                    }
                                },
                                vizRef6: {
                                    id: "vizRef6",
                                    target: {
                                        semanticObject: "Action",
                                        action: "tobookmarksample"
                                    },
                                    vizType: "newstile",
                                    isBookmark: true
                                }
                            }
                        },
                        section2: {
                            id: "section2",
                            viz: {
                                vizRef4: {
                                    id: "vizRef4",
                                    isBookmark: true,
                                    target: {
                                        semanticObject: "Action",
                                        action: "toappnavsample"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                identification: {
                    id: "page2"
                },
                payload: {
                    sections: {
                        section3: {
                            id: "section3",
                            viz: {
                                vizRef1: {
                                    id: "vizRef5",
                                    isBookmark: true,
                                    target: {
                                        semanticObject: "Action",
                                        action: "toappnavsample"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                identification: {
                    id: "page3"
                },
                payload: {
                    sections: {
                        section4: {
                            section4: {
                                id: "section4",
                                viz: {}
                            }
                        }
                    }
                }
            },
            {
                identification: {
                    id: "page4"
                },
                payload: {
                    sections: {}
                }
            }
        ];

        this.oCdmServiceStub.getAllPages.resolves(oPagesData);

        var aExpectedBookmarks = [
            {
                pageId: "page1",
                sectionId: "section1",
                vizRefId: "vizRef1"
            },
            {
                pageId: "page1",
                sectionId: "section2",
                vizRefId: "vizRef4"
            },
            {
                pageId: "page2",
                sectionId: "section3",
                vizRefId: "vizRef5"
            }
        ];

        //Act
        var oFindBookmarksPromise = this.oPagesService._findBookmarks({
            url: "#Action-toappnavsample"
        });

        //Assert
        return oFindBookmarksPromise
            .then(function (aFoundBookmarks) {
                assert.deepEqual(aFoundBookmarks, aExpectedBookmarks, "All bookmarks are found.");
                assert.deepEqual(this.oHarmonizeTargetStub.args[0][0], this.oTarget, "The target parameters are harmonized.");
            }.bind(this));

    });

    QUnit.test("Only finds bookmarks but not adapted vizReferences", function (assert) {
        //Arrange
        this.oTestSection.viz = {
            vizRef1: {
                id: "vizRef1",
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                }
            },
            vizRef2: {
                id: "vizRef2",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                }
            }
        };

        var aExpectedBookmarks = [
            {
                pageId: "page1",
                sectionId: "section1",
                vizRefId: "vizRef2"
            }
        ];

        //Act
        var oFindBookmarksPromise = this.oPagesService._findBookmarks({
            url: "#Action-toappnavsample"
        });

        //Assert
        return oFindBookmarksPromise
            .then(function (aFoundBookmarks) {
                assert.deepEqual(aFoundBookmarks, aExpectedBookmarks, "The correct bookmark is found.");
            });

    });

    QUnit.test("Does not find custom bookmarks if the vizType is not supplied", function (assert) {
        //Arrange
        this.oTestSection.viz = {
            vizRef1: {
                id: "vizRef1",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                },
                vizType: "newstile"
            },
            vizRef2: {
                id: "vizRef2",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                }
            }
        };

        var aExpectedBookmarks = [
            {
                pageId: "page1",
                sectionId: "section1",
                vizRefId: "vizRef2"
            }
        ];

        //Act
        var oFindBookmarksPromise = this.oPagesService._findBookmarks({
            url: "#Action-toappnavsample"
        });

        //Assert
        return oFindBookmarksPromise
            .then(function (aFoundBookmarks) {
                assert.deepEqual(aFoundBookmarks, aExpectedBookmarks, "The correct bookmark is found.");
            });

    });

    QUnit.test("Finds bookmarks that match the passed URL and vizType", function (assert) {
        //Arrange
        this.oTestSection.viz = {
            vizRef1: {
                id: "vizRef1",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                }
            },
            vizRef2: {
                id: "vizRef2",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                },
                vizType: "newstile"
            },
            vizRef3: {
                id: "vizRef3",
                isBookmark: true,
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                },
                vizType: "smartbusinesstile"
            }
        };

        var aExpectedBookmarks = [
            {
                pageId: "page1",
                sectionId: "section1",
                vizRefId: "vizRef2"
            }
        ];

        //Act
        var oFindBookmarksPromise = this.oPagesService._findBookmarks({
            url: "#Action-toappnavsample",
            vizType: "newstile"
        });

        //Assert
        return oFindBookmarksPromise
            .then(function (aFoundBookmarks) {
                assert.deepEqual(aFoundBookmarks, aExpectedBookmarks, "The correct bookmark is found.");
            });

    });

    QUnit.module("The function countBookmarks", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("CommonDataModel").resolves({})
            };

            this.oPagesService = new Pages();
            this.oFindBookmarksStub = sandbox.stub(this.oPagesService, "_findBookmarks");
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the number of found bookmarks", function (assert) {
        //Arrange
        var oFindArguments = {
            url: "#Action-toappnavsample",
            vizType: "newstile"
        };
        this.oFindBookmarksStub.withArgs(oFindArguments).resolves([{}, {}, {}]);

        //Act
        var oCountPromise = this.oPagesService.countBookmarks({
            url: "#Action-toappnavsample",
            vizType: "newstile"
        });

        //Assert
        return oCountPromise
            .then(function (iCount) {
                assert.strictEqual(iCount, 3, "The correct bookmark count is returned.");
            });

    });


    QUnit.module("The function deleteBookmarks", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().withArgs("CommonDataModel").resolves({})
            };

            this.oPagesService = new Pages();

            var oFoundBookmarks = [
                {
                    pageId: "id1",
                    sectionId: "id1",
                    vizRefId: "id1"
                },
                {
                    pageId: "id2",
                    sectionId: "id2",
                    vizRefId: "id2"
                },
                {
                    pageId: "id3",
                    sectionId: "id3",
                    vizRefId: "id3"
                }
            ];
            this.oFindBookmarksStub = sandbox.stub(this.oPagesService, "_findBookmarks");
            this.oFindBookmarksStub.withArgs({ url: "#Action-toappnavsample" }).resolves(oFoundBookmarks);

            this.oFindVisualizationStub = sandbox.stub(this.oPagesService, "findVisualization");
            this.oFindVisualizationStub.withArgs("id1", "id1", null, "id1").resolves([{
                pageId: "id1",
                sectionIndex: 1,
                vizIndexes: [1]
            }]);
            this.oFindVisualizationStub.withArgs("id2", "id2", null, "id2").resolves([{
                pageId: "id2",
                sectionIndex: 2,
                vizIndexes: [2]
            }]);
            this.oFindVisualizationStub.withArgs("id3", "id3", null, "id3").resolves([{
                pageId: "id3",
                sectionIndex: 3,
                vizIndexes: [3]
            }]);

            this.oGetPageIndexStub = sandbox.stub(this.oPagesService, "getPageIndex");
            this.oGetPageIndexStub.withArgs("id1").returns(1);
            this.oGetPageIndexStub.withArgs("id2").returns(2);
            this.oGetPageIndexStub.withArgs("id3").returns(3);

            this.oDeleteVisualizationStub = sandbox.stub(this.oPagesService, "deleteVisualization").resolves();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Deletes the found bookmarks", function (assert) {
        //Arrange
        var oExpectedDeleteParameters = [
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3]
        ];

        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" });

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, oExpectedDeleteParameters,
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 3, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.test("Deletes as many bookmarks as possible if one of the delete calls fails", function (assert) {
        //Arrange
        this.oDeleteVisualizationStub.onSecondCall().rejects();
        var oExpectedDeleteParameters = [
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3]
        ];

        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" });

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, oExpectedDeleteParameters,
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 2, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.test("Deletes the found bookmarks only from specific page", function (assert) {
        //Arrange
        var oExpectedDeleteParameters = [
            [1, 1, 1]
        ];

        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" }, "id1");

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, oExpectedDeleteParameters,
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 1, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.test("Deletes the found bookmarks only from specific page and section", function (assert) {
        //Arrange
        var oExpectedDeleteParameters = [
            [1, 1, 1]
        ];

        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" }, "id1", "id1");

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, oExpectedDeleteParameters,
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 1, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.test("Don't deletes the bookmarks if page was not found", function (assert) {
        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" }, "not-found");

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, [],
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 0, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.test("Don't deletes the bookmarks if section was not found", function (assert) {
        //Act
        var oDeletePromise = this.oPagesService.deleteBookmarks({ url: "#Action-toappnavsample" }, "id1", "not-found");

        //Assert
        return oDeletePromise
            .then(function (iActualCount) {
                assert.deepEqual(this.oDeleteVisualizationStub.args, [],
                    "Delete visualization is called with the correct parameters in the correct order.");
                assert.strictEqual(iActualCount, 0, "The number of deleted bookmarks is returned correctly.");
            }.bind(this));
    });

    QUnit.module("The function updateBookmarks", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub()
            };
            this.aFoundBookmarks = [
                {
                    vizRefId: "vizRef1",
                    sectionId: "section1",
                    pageId: "page1"
                },
                {
                    vizRefId: "vizRef2",
                    sectionId: "section2",
                    pageId: "page1"
                }
            ];
            this.oGetPageIndexStub = sandbox.stub(Pages.prototype, "getPageIndex");
            this.oGetPageIndexStub.withArgs("page1").returns(0);

            this.oFindVisualizationStub = sandbox.stub(Pages.prototype, "findVisualization");
            this.oFindVisualizationStub.withArgs("page1", "section1", null, "vizRef1").resolves([{
                pageId: "page1",
                sectionIndex: 0,
                vizIndexes: [0]
            }]);

            this.oFindVisualizationStub.withArgs("page1", "section2", null, "vizRef2").resolves([{
                pageId: "page1",
                sectionIndex: 1,
                vizIndexes: [0]
            }]);

            this.oFindBookmarksStub = sandbox.stub(Pages.prototype, "_findBookmarks");
            this.oFindBookmarksStub.withArgs({ url: "#Action-toappnavsample" }).resolves(this.aFoundBookmarks);
            this.oUpdateVisualizationStub = sandbox.stub(Pages.prototype, "updateVisualization").resolves();

            this.oPagesService = new Pages();
            this.oUrlParsingStub = { url: "parsing" };
            this.oPagesService._oURLParsingServicePromise = Promise.resolve(this.oUrlParsingStub);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Rejects the promise if first parameter isn't a URL", function (assert) {
        return this.oPagesService.updateBookmarks(undefined, {}).catch(function () {
            assert.ok(true, "A promise was rejected");
        });
    });

    QUnit.test("Rejects the promise if the second parameter isn't an object", function (assert) {
        return this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, undefined).catch(function () {
            assert.ok(true, "A promise was rejected");
        });
    });

    QUnit.test("Rejects if bookmark visualizations cannot be retrieved", function (assert) {
        // Arrange
        this.oFindBookmarksStub.withArgs({ url: "#Action-toappnavsample" }).rejects();
        // Act
        return this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, {})
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                assert.ok(true, "promise was rejected");
                assert.ok(this.oGetPageIndexStub.notCalled, "getPageIndex was not called");
            }.bind(this));
    });

    QUnit.test("Returns a promise that resolves to the number of updated bookmarks", function (assert) {
        return this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, {}).then(function (iCount) {
            assert.strictEqual(iCount, 2, "The correct number was returned");
            assert.strictEqual(this.oFindBookmarksStub.callCount, 1, "retrieveBookmarkVisualizations was called exactly once");
            assert.strictEqual(this.oGetPageIndexStub.callCount, 2, "getPageIndex was called exactly twice");
            assert.strictEqual(this.oUpdateVisualizationStub.callCount, 2, "updateVisualization was called exactly twice");
        }.bind(this));
    });

    QUnit.test("Passes the correctly mapped parameters to updateVisualization", function (assert) {
        //Arrange
        var oUpdateParameters = {
            title: "Title",
            subtitle: "Subtitle",
            icon: "sap-icon://icon",
            info: "Info",
            numberUnit: "EUR",
            serviceUrl: "/service/url",
            serviceRefreshInterval: "300",
            url: "#Action-tobookmarksample",
            vizConfig: {
                parameter1: "value1"
            }
        };

        var oTarget = {
            semanticObject: "Action",
            action: "tobookmarksample"
        };
        sandbox.stub(utilsCdm, "toTargetFromHash").withArgs("#Action-tobookmarksample", this.oUrlParsingStub).returns(oTarget);
        sandbox.stub(readUtils, "harmonizeTarget").withArgs(oTarget).returns(oTarget);

        var oExpectedParameters = {
            title: "Title",
            subtitle: "Subtitle",
            icon: "sap-icon://icon",
            info: "Info",
            numberUnit: "EUR",
            indicatorDataSource: {
                path: "/service/url",
                refresh: "300"
            },
            target: {
                semanticObject: "Action",
                action: "tobookmarksample"
            },
            vizConfig: {
                parameter1: "value1"
            }
        };

        //Act
        var oUpdatePromise = this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, oUpdateParameters);

        //Assert
        return oUpdatePromise.then(function () {
            assert.deepEqual(this.oUpdateVisualizationStub.args[0][3], oExpectedParameters, "The correct parameters were passed.");
        }.bind(this));
    });

    QUnit.test("Passes parameters, that are set to an empty string to clear them, to updateVisualization", function (assert) {
        //Arrange
        var oUpdateParameters = {
            subtitle: "",
            icon: "",
            info: "",
            numberUnit: "",
            serviceUrl: "",
            serviceRefreshInterval: ""
        };

        var oExpectedParameters = {
            subtitle: "",
            icon: "",
            info: "",
            numberUnit: "",
            indicatorDataSource: {
                path: "",
                refresh: ""
            },
            vizConfig: undefined
        };

        //Act
        var oUpdatePromise = this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, oUpdateParameters);

        //Assert
        return oUpdatePromise.then(function () {
            assert.deepEqual(this.oUpdateVisualizationStub.args[0][3], oExpectedParameters, "The correct parameters were passed.");
        }.bind(this));
    });

    QUnit.test("Doesn't allow to clear title and target by setting them to an empty string", function (assert) {
        //Arrange
        var oUpdateParameters = {
            title: "",
            url: "",
            subtitle: "Subtitle"
        };

        var oExpectedParameters = {
            subtitle: "Subtitle",
            icon: undefined,
            info: undefined,
            numberUnit: undefined,
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            },
            vizConfig: undefined
        };

        //Act
        var oUpdatePromise = this.oPagesService.updateBookmarks({ url: "#Action-toappnavsample" }, oUpdateParameters);

        //Assert
        return oUpdatePromise.then(function () {
            assert.deepEqual(this.oUpdateVisualizationStub.args[0][3], oExpectedParameters, "The correct parameters were passed.");
        }.bind(this));
    });

    QUnit.module("The function updateVisualization", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub()
            };
            this.oMockVisualization = {
                id: "viz-0",
                title: "title",
                subtitle: "subtitle",
                target: {
                    semanticObject: "Action",
                    action: "toappnavsample"
                },
                icon: "icon",
                info: "thisIsActuallyAFooter",
                indicatorDataSource: {
                    path: "testurl",
                    refresh: "20"
                },
                isBookmark: true,
                displayFormatHint: "standard"
            };
            this.oExpectedVisualization = deepClone(this.oMockVisualization);

            this.oMockModel = {
                pages: [{
                    id: "page-1",
                    sections: [
                        {
                            id: "section-0",
                            title: "Section 0",
                            default: "true",
                            visualizations: [this.oMockVisualization]
                        },
                        {
                            id: "section-1",
                            title: "Section 1",
                            visualizations: [{ id: "viz-0" }]
                        }
                    ]
                }]
            };

            this.oPagesService = new Pages();
            this.oPagesService._oPagesModel._setProperty("/", this.oMockModel);

            this.oUrlParsingStub = { url: "parsing" };
            this.oPagesService._oURLParsingServicePromise = Promise.resolve(this.oUrlParsingStub);

            this.oVisualizations = {
                viz1: {}
            };
            this.oApplications = {
                app1: {}
            };
            this.oVizTypes = {
                vizType1: {}
            };
            this.oCdmServiceStub = {
                getVisualizations: sandbox.stub().returns(this.oVisualizations),
                getApplications: sandbox.stub().returns(this.oApplications),
                getVizTypes: sandbox.stub().returns(this.oVizTypes)
            };
            this.oPagesService._oCdmServicePromise = Promise.resolve(this.oCdmServiceStub);

            sandbox.stub(this.oPagesService, "_getVisualizationData").withArgs("page-1", undefined,
                this.oVisualizations, sinon.match.any, this.oApplications, this.oVizTypes, this.oUrlParsingStub)
                .callsFake(function (sPageId, sVizId, oVisualizations, oVizRef) {
                    var oVisualization = extend({}, oVizRef);
                    oVisualization.subtitle = oVisualization.subTitle;
                    delete oVisualization.subTitle;
                    return oVisualization;
                });

            this.oUpdateVisualizationCDMDataStub = sandbox.stub(Pages.prototype, "_updateVisualizationCDMData").resolves(Promise.resolve());
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("updates all parameters on the visualization and passes them to the CDM update", function (assert) {
        // Arrange
        var oVisualizationData = {
            title: "anotherTitle",
            target: {
                semanticObject: "anotherSemanticObject",
                action: "anotherAction"
            },
            subtitle: "anotherSubtitle",
            icon: "anotherIcon",
            numberUnit: "EUR",
            info: "thisIsactuallyAnotherFooter",
            indicatorDataSource: {
                path: "testurlother",
                refresh: "10"
            },
            vizConfig: {
                parameter1: "value1"
            },
            displayFormatHint: "compact"
        };

        var oExpectedVisualization = {
            id: "viz-0",
            title: "anotherTitle",
            target: {
                semanticObject: "anotherSemanticObject",
                action: "anotherAction"
            },
            subtitle: "anotherSubtitle",
            icon: "anotherIcon",
            numberUnit: "EUR",
            info: "thisIsactuallyAnotherFooter",
            indicatorDataSource: {
                path: "testurlother",
                refresh: "10"
            },
            vizConfig: {
                parameter1: "value1"
            },
            isBookmark: true,
            displayFormatHint: "compact"
        };

        var oExpectedCdmUpdateProperties = [
            "page-1",
            "section-0",
            "viz-0",
            {
                title: "anotherTitle",
                target: {
                    semanticObject: "anotherSemanticObject",
                    action: "anotherAction"
                },
                subtitle: "anotherSubtitle",
                icon: "anotherIcon",
                info: "thisIsactuallyAnotherFooter",
                numberUnit: "EUR",
                indicatorDataSource: {
                    path: "testurlother",
                    refresh: "10"
                },
                vizConfig: {
                    parameter1: "value1"
                },
                displayFormatHint: "compact"
            }
        ];

        // Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0], oExpectedVisualization,
                "the visualization was updated correctly");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0], oExpectedCdmUpdateProperties,
                "the changed properties were passed to the CDM update");
        }.bind(this));
    });

    QUnit.test("updates only the parameters with different values than the ones set", function (assert) {
        // Arrange
        var oVisualizationData = {
            title: "title",
            subtitle: "subtitle",
            target: {
                semanticObject: "Action",
                action: "toappnavsample"
            },
            icon: "icon",
            info: "thisIsActuallyAFooter",
            indicatorDataSource: {
                path: "testurl",
                refresh: "20"
            },
            displayFormatHint: "standard"
        };

        var oExpectedCdmUpdateProperties = [
            "page-1",
            "section-0",
            "viz-0",
            {}
        ];

        // Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0], this.oExpectedVisualization,
                "no properties were updated on the visualization");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0], oExpectedCdmUpdateProperties,
                "no properties were passed to the CDM update");

        }.bind(this));

    });

    QUnit.test("doesn't change properties that are not supplied", function (assert) {
        // Arrange
        var oVisualizationData = {};
        var oExpectedCdmUpdateProperties = [
            "page-1",
            "section-0",
            "viz-0",
            {}
        ];

        // Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0], this.oExpectedVisualization,
                "no properties were updated on the visualization");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0], oExpectedCdmUpdateProperties,
                "no properties were passed to the CDM update");

        }.bind(this));

    });

    QUnit.test("updates the properties of the indicator data source independently", function (assert) {
        // Arrange
        var oVisualizationData = {
            indicatorDataSource: {
                refresh: "10"
            }
        };

        this.oExpectedVisualization.indicatorDataSource.refresh = "10";

        var oExpectedCdmUpdateProperties = [
            "page-1",
            "section-0",
            "viz-0",
            {
                indicatorDataSource: {
                    path: "testurl",
                    refresh: "10"
                }
            }
        ];

        // Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0], this.oExpectedVisualization,
                "the refresh interval was updated");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0], oExpectedCdmUpdateProperties,
                "the complete indicator data source was passed to the CDM update");

        }.bind(this));

    });

    QUnit.test("doesn't update the indicator data source if its properties are undefined", function (assert) {
        // Arrange
        var oVisualizationData = {
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            }
        };

        var oExpectedCdmUpdateProperties = [
            "page-1",
            "section-0",
            "viz-0",
            {}
        ];

        // Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0], this.oExpectedVisualization,
                "the visualization was not updated");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0], oExpectedCdmUpdateProperties, "the CDM data was not updated");

        }.bind(this));

    });

    QUnit.test("merges the supplied vizConfig into the existing vizConfig", function (assert) {
        //Arrange
        this.oMockVisualization.vizConfig = {
            config1: {
                a: "1",
                b: "2",
                c: "3"
            }
        };

        var oVisualizationData = {
            vizConfig: {
                config1: {
                    b: "4"
                },
                config2: {
                    d: "5"
                }
            }
        };


        var oExpectedVizConfig = {
            config1: {
                a: "1",
                b: "4",
                c: "3"
            },
            config2: {
                d: "5"
            }
        };

        //Act
        return this.oPagesService.updateVisualization(0, 0, 0, oVisualizationData).then(function () {
            // Assert
            assert.deepEqual(this.oMockModel.pages[0].sections[0].visualizations[0].vizConfig, oExpectedVizConfig,
                "the vizConfig was updated correctly");
            assert.deepEqual(this.oUpdateVisualizationCDMDataStub.args[0][3].vizConfig, oExpectedVizConfig,
                "the CDM data was updated correctly");

        }.bind(this));

    });

    QUnit.module("The function updateVisualizationCDMData", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oPageMock = {
                identification: {
                    id: "page1"
                },
                payload: {
                    sections: {
                        section1: {
                            id: "section1",
                            viz: {
                                vizRef1: {
                                    id: "vizRef1",
                                    title: "Title",
                                    target: {
                                        semanticObject: "Action",
                                        action: "toappnavsample"
                                    },
                                    isBookmark: true
                                }
                            }
                        }
                    }
                }
            };

            this.oVisualizationData = {
                title: "changed title",
                target: {
                    semanticObject: "Action",
                    action: "tobookmarksample"
                },
                subtitle: "subtitle",
                icon: "icon",
                info: "thisIsactuallyAFooter",
                indicatorDataSource: {
                    path: "/service/url",
                    refresh: "300"
                },
                vizConfig: {
                    parameter1: "value1"
                }
            };

            this.oSavePersonalizationStub = sandbox.stub(Pages.prototype, "savePersonalization").resolves();
            this.oSetPersonalizationActiveStub = sandbox.stub(Pages.prototype, "setPersonalizationActive");

            this.oGetPageStub = sandbox.stub().resolves(this.oPageMock);
            this.oCDMServiceStub = {
                getPage: this.oGetPageStub
            };

            this.oPagesService = new Pages();
            this.oPagesService._oCdmServicePromise = Promise.resolve(this.oCDMServiceStub);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("resolves the promise after updating the vizRef", function (assert) {
        // Arrange
        var oExpectedVizRef = {
            id: "vizRef1",
            title: "changed title",
            target: {
                semanticObject: "Action",
                action: "tobookmarksample"
            },
            subTitle: "subtitle",
            icon: "icon",
            info: "thisIsactuallyAFooter",
            indicatorDataSource: {
                path: "/service/url",
                refresh: "300"
            },
            vizConfig: {
                parameter1: "value1"
            },
            isBookmark: true
        };

        // Act
        return this.oPagesService._updateVisualizationCDMData("page1", "section1", "vizRef1", this.oVisualizationData)
            .then(function () {
                var oVizRef = this.oPageMock.payload.sections.section1.viz.vizRef1;
                // Assert
                assert.deepEqual(oVizRef, oExpectedVizRef, "The cdm data was updated");
                assert.strictEqual(this.oSavePersonalizationStub.args[0][0], this.oPageMock.identification.id,
                    "SavePersonalization was called with the correct page");
            }.bind(this))
            .catch(function () {
                // Assert
                assert.ok(false, "The promise was rejected");
            });
    });

    QUnit.test("does not add invalid properties to the vizRef", function (assert) {
        // Arrange
        this.oVisualizationData = {
            title: "changed title",
            invalidProperty: "totally invalid"
        };

        var oExpectedVizRef = {
            id: "vizRef1",
            title: "changed title",
            target: {
                semanticObject: "Action",
                action: "toappnavsample"
            },
            isBookmark: true
        };

        // Act
        return this.oPagesService._updateVisualizationCDMData("page1", "section1", "vizRef1", this.oVisualizationData)
            .then(function () {
                var oVizRef = this.oPageMock.payload.sections.section1.viz.vizRef1;
                // Assert
                assert.deepEqual(oVizRef, oExpectedVizRef, "The property was not added");
            }.bind(this));
    });

    QUnit.test("rejects and resets personalization if CDMService cannot be loaded", function (assert) {
        // Arrange
        this.oPagesService._oCdmServicePromise = Promise.reject("could not resolve service");
        // Act
        return this.oPagesService._updateVisualizationCDMData("section1", "vizRef1", this.oPageMock, this.oVisualizationData)
            .then(function () {
                assert.ok(false, "should have rejected");
            })
            .catch(function () {
                // Assert
                assert.strictEqual(this.oSetPersonalizationActiveStub.callCount, 1, "setPersonalizationActive was called exactly once");
                assert.strictEqual(this.oSetPersonalizationActiveStub.args[0][0], false,
                    "setPersonalizationActive was called with 'false'");
                assert.ok(true, "promise was rejected");
            }.bind(this));
    });

    QUnit.test("rejects and resets personalization if the page cannot be loaded", function (assert) {
        // Arrange
        this.oGetPageStubReject = sandbox.stub().rejects("could not resolve page");
        this.oCDMServiceStub.getPage = this.oGetPageStubReject;
        // Act
        return this.oPagesService._updateVisualizationCDMData("section1", "vizRef1", this.oPageMock, this.oVisualizationData)
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                assert.strictEqual(this.oGetPageStubReject.callCount, 1, "getPage was called exactly once");
                assert.ok(true, "promise was rejected");
            }.bind(this));
    });
});
