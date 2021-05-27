// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.PagesCommonDataModelAdapter
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter",
    "sap/base/Log",
    "sap/ushell/adapters/cdm/util/cdmSiteUtils"
], function (
    PagesCDMAdapter,
    Log,
    cdmSiteUtils
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.dump.maxDepth = 10;

    QUnit.module("The constructor");

    QUnit.test("initializes all the class properties", function (assert) {
        // Act
        var oCDMAdapter = new PagesCDMAdapter();

        // Assert
        assert.deepEqual(oCDMAdapter._oCDMPagesRequests, {}, "The constructor sets the property _oCDMPagesRequests to an empty object.");
        assert.strictEqual(oCDMAdapter._sComponent, "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter", "The constructor sets the property _sComponent to 'sap/ushell/adapters/cdm/PagesCommonDataModelAdapter'.");
        assert.ok(oCDMAdapter.oSitePromise instanceof Promise, "The constructor sets the property oSitePromise to a Promise");
    });

    QUnit.module("The function getPersonalization", {
        beforeEach: function () {

            this.oExpectedScope = {
                validity: "Infinity",
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            };

            this.oExpectedPersId = {
                container: "sap.ushell.cdm3-1.personalization",
                item: "data"
            };
            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPersonalizerStub = sandbox.stub();
            this.oGetPersDataStub = sandbox.stub();
            this.oPersDataPromise = new jQuery.Deferred();

            this.oGetPersDataStub.returns(this.oPersDataPromise.resolve({}));
            this.oGetPersonalizerStub.returns({
                getPersData: this.oGetPersDataStub
            });
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves({
                getPersonalizer: this.oGetPersonalizerStub,
                constants: {
                    keyCategory: { GENERATED_KEY: "GENERATED_KEY" },
                    writeFrequency: { HIGH: "HIGH" }
                }
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("gets the correct container for version 3.1.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.getPersonalization("3.1.0")
            .done(function () {
                assert.ok(true);
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope], "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("gets the correct container for version 3.2.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.getPersonalization("3.2.0")
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope], "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("returns a personalization delta", function (assert) {
        var fnDone = assert.async();
        this.oCDMAdapter.getPersonalization("page1")
            .done(function (oPersDelta) {
                assert.ok(oPersDelta, {}, "delta was returned");
            })
            .fail(function () {
                assert.ok(false, "Should not fail when Page Id was provided");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects when getPersonalizer rejects", function (assert) {
        var fnDone = assert.async();
        this.oGetPersDataStub.returns(new jQuery.Deferred().reject("getPersData rejected"));
        this.oCDMAdapter.getPersonalization("page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("errors out when the Personalization service could not be loaded", function (assert) {
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("Personalization").rejects({});
        this.oCDMAdapter.getPersonalization("page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function setPersonalization", {
        beforeEach: function () {

            this.oExpectedScope = {
                validity: "Infinity",
                keyCategory: "GENERATED_KEY",
                writeFrequency: "HIGH",
                clientStorageAllowed: false
            };

            this.oExpectedPersId = {
                container: "sap.ushell.cdm3-1.personalization",
                item: "data"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetPersonalizerStub = sandbox.stub();
            this.oGetPersDataStub = sandbox.stub();
            this.oSetPersDataStub = sandbox.stub();
            this.oPersDataPromise = new jQuery.Deferred();

            this.oGetPersDataStub.returns(this.oPersDataPromise.resolve({}));
            this.oSetPersDataStub.returns(this.oPersDataPromise.resolve({}));

            this.oGetPersonalizerStub.returns({
                getPersData: this.oGetPersDataStub,
                setPersData: this.oSetPersDataStub
            });
            this.oGetServiceAsyncStub.withArgs("Personalization").resolves({
                getPersonalizer: this.oGetPersonalizerStub,
                constants: {
                    keyCategory: { GENERATED_KEY: "GENERATED_KEY" },
                    writeFrequency: { HIGH: "HIGH" }
                }
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("saves to the correct container for version 3.1.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.setPersonalization({ version: "3.1.0" })
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope], "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("saves to the correct container for version 3.2.0", function (assert) {
        var fnDone = assert.async();

        this.oCDMAdapter.setPersonalization({ version: "3.2.0" })
            .done(function () {
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "getPersonalization is called exactly once");
                assert.deepEqual(this.oGetPersonalizerStub.getCall(0).args, [this.oExpectedPersId, this.oExpectedScope], "getPersonalizer is called with correct parameters meaning correct container is used");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("errors out if the personalization service could not be loaded", function (assert) {
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("Personalization").rejects({});

        this.oCDMAdapter.setPersonalization({})
            .done(function () {
                assert.ok(false, "The promise was not rejected");
            })
            .fail(function () {
                assert.ok(true, "The method rejects if the personalization service is not available");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("saves the personalization and resolves promise", function (assert) {
        var fnDone = assert.async();
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(undefined));
        this.oCDMAdapter.setPersonalization({}, "page1")
            .done(function () {
                assert.ok(true, "promise was correctly resolved after saving delta");
                assert.strictEqual(this.oSetPersDataStub.callCount, 1, "SetPersData was called exactly once");
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects when getPersonalizer rejects", function (assert) {
        var fnDone = assert.async();
        this.oSetPersDataStub.returns(new jQuery.Deferred().reject("getPersData rejected"));
        this.oCDMAdapter.setPersonalization({}, "page1")
            .done(function () {
                assert.ok(false, "should have rejected and failed");
            })
            .fail(function () {
                assert.ok(true, "Promise was rejected successfully");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function getSite", {
        beforeEach: function () {
            this.oNavigationDataMock = {
                inbounds: [{ "inbound-1": { permanentKey: "permanentKey-1" } }],
                systemAliases: { id: "systemAliases" }
            };

            this.oVisualizationDataMock = {
                title: "Troubleshooting Note",
                icon: "sap-icon://wrench",
                info: "",
                size: "1x1",
                url: "#FioriLaunchpad-displayTroubleshootingNote",
                isCustomTile: false,
                _instantiationData: {
                    platform: "ABAP",
                    chip: {},
                    catalogTile: {}
                }
            };

            this.oGetNavigationDataStub = sandbox.stub().returns(this.oNavigationDataMock);

            this.oGetVisualizationDataStub = sandbox.stub().returns(this.oVisualizationDataMock);

            this.oGetServiceAsyncStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").resolves({
                getNavigationData: this.oGetNavigationDataStub
            });
            this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").resolves({
                getVisualizationData: this.oGetVisualizationDataStub
            });
            this.oUrlParsingMock = {
                id: "URLParsing"
            };
            this.oGetServiceAsyncStub.withArgs("URLParsing").resolves(this.oUrlParsingMock);

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oApplicationsMock = {
                "application-1": { id: "application-1" },
                "application-2": { id: "application-2" }
            };
            this.oVisualizationsMock = {
                "visualization-1": { id: "visualization-1" },
                "visualization-2": { id: "visualization-2" }
            };
            this.oVizTypesMock = { id: "vizType" };

            this.oGetVisualizationsStub = sandbox.stub(cdmSiteUtils, "getVisualizations").withArgs(sinon.match.any, this.oUrlParsingMock).returns(this.oVisualizationsMock);
            this.oGetApplicationsStub = sandbox.stub(cdmSiteUtils, "getApplications").returns(this.oApplicationsMock);
            this.oGetVizTypesStub = sandbox.stub(cdmSiteUtils, "getVizTypes").returns(this.oVizTypesMock);

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("resolves to a CDM 3.1 site with visualizations, applications, vizTypes and systemsAlias filled", function (assert) {
        // Arrange
        var oExpectedResult = {
            _version: "3.1.0",
            site: {},
            catalogs: {},
            groups: {},
            visualizations: this.oVisualizationsMock,
            applications: this.oApplicationsMock,
            vizTypes: this.oVizTypesMock,
            systemAliases: { id: "systemAliases" },
            pages: {}
        };

        // Act
        return this.oCDMAdapter.getSite().done(function (site) {
            assert.deepEqual(site, oExpectedResult, "A CDM 3.1 site with correct data is returned.");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 3, "The function 'GetServiceAsync' is called three times.");
            assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "The function 'getNavigationData' is called once.");
            assert.strictEqual(this.oGetVisualizationDataStub.callCount, 1, "The function 'getVisualizationData' is called once.");
            assert.strictEqual(this.oGetVisualizationsStub.callCount, 1, "The function 'getVisualizations' is called once.");
            assert.deepEqual(this.oGetVisualizationsStub.firstCall.args, [this.oVisualizationDataMock, this.oUrlParsingMock ], "The function 'getVisualizations' is called with the right parameters.");
            assert.strictEqual(this.oGetApplicationsStub.callCount, 1, "The function 'getApplications' is called once.");
            assert.strictEqual(this.oGetVizTypesStub.callCount, 1, "The function 'getVizTypes' is called once.");
            assert.deepEqual(this.oGetVizTypesStub.firstCall.args, [this.oVisualizationDataMock], "The function 'getVizTypes' is called with the right parameters.");
            this.oCDMAdapter.oSitePromise.then(function (oSite) {
                assert.deepEqual(oSite, oExpectedResult, "The property 'oSitePromise' resolves to a site oject with correct data.");
            });
        }.bind(this));
    });

    QUnit.test("rejects the jQuery.Deferred.Promise and the oSitePromise if 'getServiceAsync' fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetServiceAsyncStub.withArgs("NavigationDataProvider").rejects();
        this.oGetServiceAsyncStub.withArgs("VisualizationDataProvider").rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                this.oCDMAdapter.oSitePromise.catch(function () {
                    assert.ok(true, "The oSitePromise was rejected.");
                });
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects the jQuery.Deferred.Promise and the oSitePromise if 'getNavigationData' fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetNavigationDataStub.rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                this.oCDMAdapter.oSitePromise.catch(function () {
                    assert.ok(true, "The oSitePromise was rejected.");
                });
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects the jQuery.Deferred.Promise and the oSitePromise if 'getVisualizationData' fails", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oGetVisualizationDataStub.rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                this.oCDMAdapter.oSitePromise.catch(function () {
                    assert.ok(true, "The oSitePromise was rejected.");
                });
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function getPage", {
        beforeEach: function () {
            this.oGetNavigationDataStub = sandbox.stub();
            this.oGetNavigationDataStub.resolves("navigationData");

            this.oGetPageStub = sandbox.stub();
            this.oGetPageStub.resolves({ id: "page-2" });

            this.oServiceMocks = {
                NavigationDataProvider: { getNavigationData: this.oGetNavigationDataStub },
                PagePersistence: { getPage: this.oGetPageStub }
            };

            this.oLogErrorStub = sandbox.stub(Log, "error").returns(true);
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().callsFake(function (service) {
                    return this.oServiceMocks[service] ? Promise.resolve(this.oServiceMocks[service]) : Promise.reject();
                }.bind(this))
            };

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oSiteMock = {
                pages: { "page-1": {} }
            };
            this.oAddPageToSiteStub = sandbox.stub(this.oCDMAdapter, "_addPageToSite").callsFake(function () {
                this.oSiteMock.pages = { "page-2": {} };
            }.bind(this));
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the existing page if the page with given pageId already exists in the CDM 3.1 site", function (assert) {
        //Act
        return this.oCDMAdapter.getPage("page-1")
            .then(function (page) {
                //Assert
                assert.strictEqual(page, this.oSiteMock.pages["page-1"], "The existing page was returned");
            }.bind(this));
    });

    QUnit.test("Inserts the page with given id to the CDM 3.1 site and returns the page when all services are working properly", function (assert) {
        //Act
        return this.oCDMAdapter.getPage("page-2")
            .then(function (page) {
                //Assert
                assert.deepEqual(page, this.oSiteMock.pages["page-2"], "Expected result was returned");
                assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "getNavigationData called once");
                assert.strictEqual(this.oGetPageStub.callCount, 1, "getPage called once");
                assert.strictEqual(this.oAddPageToSiteStub.callCount, 1, "_addPageToSite called once");

                assert.ok(this.oGetPageStub.calledWithExactly("page-2"), "getPage called with the right parameter");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise if getPage is called without parameter", function (assert) {
        //Act
        return this.oCDMAdapter.getPage()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPage and NavigationDataProvider service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.NavigationDataProvider;

        // Act
        return this.oCDMAdapter.getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPage and PagePersistence service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.PagePersistence;

        // Act
        return this.oCDMAdapter.getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPage and NavigationDataProvider.getNavigationData() is rejected", function (assert) {
        // Arrange
        this.oGetNavigationDataStub.rejects("Error");

        // Act
        return this.oCDMAdapter.getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPage and PagePersistence.getPage() is rejected", function (assert) {
        // Arrange
        this.oGetPageStub.rejects("Error");

        //Act
        return this.oCDMAdapter.getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.module("The function getPages", {
        beforeEach: function () {
            this.oGetNavigationDataStub = sandbox.stub();
            this.oGetNavigationDataStub.resolves("navigationData");

            this.oGetPagesStub = sandbox.stub();
            this.oGetPagesStub.resolves([{ id: "page-2" }]);

            this.oServiceMocks = {
                NavigationDataProvider: { getNavigationData: this.oGetNavigationDataStub },
                PagePersistence: { getPages: this.oGetPagesStub }
            };

            this.oLogErrorStub = sandbox.stub(Log, "error").returns(true);
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().callsFake(function (service) {
                    return this.oServiceMocks[service] ? Promise.resolve(this.oServiceMocks[service]) : Promise.reject();
                }.bind(this))
            };

            this.oCDMAdapter = new PagesCDMAdapter();
            this.oSiteMock = {
                pages: { "page-1": {} }
            };
            this.oAddPageToSiteStub = sandbox.stub(this.oCDMAdapter, "_addPageToSite").callsFake(function () {
                this.oSiteMock.pages = { "page-2": {} };
            }.bind(this));
            this.oCDMAdapter.oSitePromise = Promise.resolve(this.oSiteMock);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the existing all pages if the pages with given pageIds already exists in the CDM 3.1 site", function (assert) {
        //Act
        return this.oCDMAdapter.getPages(["page-1"])
            .then(function (page) {
                //Assert
                assert.strictEqual(page, this.oSiteMock.pages, "The existing page was returned");
            }.bind(this));
    });

    QUnit.test("rejects the promise if getPages is called without parameter", function (assert) {
        //Act
        return this.oCDMAdapter.getPages()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("Inserts the pages with given id to the CDM 3.1 site and returns the pages when all services are working properly", function (assert) {
        //Act
        return this.oCDMAdapter.getPages(["page-2"])
            .then(function (page) {
                //Assert
                assert.deepEqual(page, this.oSiteMock.pages, "Expected result was returned");
                assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "getNavigationData called once");
                assert.strictEqual(this.oGetPagesStub.callCount, 1, "getPage called once");
                assert.strictEqual(this.oAddPageToSiteStub.callCount, 1, "_addPageToSite called once");

                assert.ok(this.oGetPagesStub.calledWithExactly(["page-2"]), "getPages called with the right parameter");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPages and NavigationDataProvider service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.NavigationDataProvider;

        // Act
        return this.oCDMAdapter.getPages(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPages and PagePersistence service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.PagePersistence;

        // Act
        return this.oCDMAdapter.getPages(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPages and NavigationDataProvider.getNavigationData() is rejected", function (assert) {
        // Arrange
        this.oGetNavigationDataStub.rejects("Error");

        // Act
        return this.oCDMAdapter.getPages(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.test("rejects the promise when calling getPages and PagePersistence.getPages() is rejected", function (assert) {
        // Arrange
        this.oGetPagesStub.rejects("Error");

        //Act
        return this.oCDMAdapter.getPages(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });

    QUnit.module("The function _addPageToSite", {
        beforeEach: function () {
            this.oLogErrorStub = sandbox.stub(Log, "error");
            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("adds the given page to the CDM 3.1 site in the required format", function (assert) {
        // Arrange
        var oSite = {
            pages: {},
            visualizations: { "vizId-1": { vizConfig: { "sap.flp": { target: {} } } } }
        };
        var oPageContent = {
            id: "page-1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "section-1",
                title: "Section 1",
                viz: [{
                    id: "viz-1",
                    vizId: "vizId-1",
                    inboundPermanentKey: "permanentKey-1",
                    displayFormatHint: "flatWide"
                }]
            }]
        };
        var oNavigationData = {
            inbounds: [{
                id: "inbound-1",
                permanentKey: "permanentKey-1"
            }]
        };

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
                    payload: {
                        layout: { sectionOrder: ["section-1"] },
                        sections: {
                            "section-1": {
                                id: "section-1",
                                title: "Section 1",
                                layout: { vizOrder: ["viz-1"] },
                                viz: {
                                    "viz-1": {
                                        id: "viz-1",
                                        vizId: "vizId-1",
                                        displayFormatHint: "flatWide"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            visualizations: {
                "vizId-1": {
                    vizConfig: {
                        "sap.flp": {
                            target: {}
                        }
                    }
                }
            }
        };

        // Act
        this.oCDMAdapter._addPageToSite(oSite, oPageContent, oNavigationData);

        // Assert
        assert.deepEqual(oSite, oExpectedResult, "The page is added to the site correctly");
    });

    QUnit.test("filters out invalid visualizations that exist in the page but not in the CDM 3.1 site", function (assert) {
        // Arrange
        var oSite = {
            pages: {},
            visualizations: {}
        };
        var oPageContent = {
            id: "page-1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "section-1",
                title: "Section 1",
                viz: [{
                    id: "viz-2",
                    vizId: "vizId-2",
                    inboundPermanentKey: "permanentKey-2"
                }]
            }]
        };
        var oNavigationData = {
            inbounds: [{
                id: "inbound-1",
                permanentKey: "permanentKey-1"
            }]
        };

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
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
                }
            },
            visualizations: {}
        };

        // Act
        this.oCDMAdapter._addPageToSite(oSite, oPageContent, oNavigationData);

        // Assert
        assert.deepEqual(oSite, oExpectedResult, "The page is added to the site correctly");
        assert.ok(this.oLogErrorStub.calledOnce, "Log.error is called once");
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["Tile viz-2 with vizId vizId-2 has no matching visualization. As the tile cannot be used to start an app it is removed from the page."], "Log.error is called with correct error message ");
    });

    QUnit.test("adds no appId and inboundId to the visualization in CDM 3.1 site if the type of the visualization is URL", function (assert) {
        // Arrange
        var oSite = {
            pages: {},
            visualizations: { "vizId-1": { vizConfig: { "sap.flp": { target: { type: "URL" } } } } }
        };
        var oPageContent = {
            id: "page-1",
            title: "Page 1",
            description: "",
            sections: [{
                id: "section-1",
                title: "Section 1",
                viz: [{
                    id: "viz-1",
                    vizId: "vizId-1",
                    inboundPermanentKey: "permanentKey-1"
                }]
            }]
        };
        var oNavigationData = {
            inbounds: [{
                id: "inbound-1",
                permanentKey: "permanentKey-1"
            }]
        };

        var oExpectedResult = {
            pages: {
                "page-1": {
                    identification: {
                        id: "page-1",
                        title: "Page 1"
                    },
                    payload: {
                        layout: { sectionOrder: ["section-1"] },
                        sections: {
                            "section-1": {
                                id: "section-1",
                                title: "Section 1",
                                layout: { vizOrder: ["viz-1"] },
                                viz: {
                                    "viz-1": {
                                        id: "viz-1",
                                        vizId: "vizId-1",
                                        displayFormatHint: undefined
                                    }
                                }
                            }
                        }
                    }
                }
            },
            visualizations: { "vizId-1": { vizConfig: { "sap.flp": { target: { type: "URL" } } } } }
        };

        // Act
        this.oCDMAdapter._addPageToSite(oSite, oPageContent, oNavigationData);

        // Assert
        assert.deepEqual(oSite, oExpectedResult, "The page is added to the site correctly");
    });
});
