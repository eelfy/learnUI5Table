// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.CommonDataModel
 */
sap.ui.require([
    "sap/ushell/services/CommonDataModel",
    "sap/ushell/services/_CommonDataModel/PersonalizationProcessor",
    "sap/ushell/services/_CommonDataModel/SiteConverter",
    "sap/ushell/test/utils",
    "sap/ushell/Config",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/base/util/ObjectPath"
], function (
    CommonDataModel,
    PersonalizationProcessor,
    SiteConverter,
    oTestUtils,
    Config,
    readApplications,
    ObjectPath
) {
    "use strict";

    /* global sinon, QUnit */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var sandbox = sinon.createSandbox({});

    QUnit.module("constructor", {
        beforeEach: function () {
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sinon.stub().returns(this.oGetSiteDeferred)
            };
            this.oLoadAndApplyPersonalizationStub = sinon.stub(CommonDataModel.prototype, "_loadAndApplyPersonalization");
        },
        afterEach: function () {
            this.oLoadAndApplyPersonalizationStub.restore();
        }
    });

    QUnit.test("Sets expected properties, gets the site and calls _loadAndApplyPersonalization", function (assert) {
        // Arrange
        this.oGetSiteDeferred.resolve();
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.ok(this.oLoadAndApplyPersonalizationStub.called, "Personalization flow was started");
        assert.deepEqual(oCommonDataModelService._oAdapter, this.oMockAdapter, "Adapter was saved to service object");
        assert.ok(oCommonDataModelService._oPersonalizationProcessor instanceof PersonalizationProcessor, "PersonalizationProcessor was saved to service object");
        assert.deepEqual(oCommonDataModelService._oOriginalSite, {}, "Original site was initialized");
        assert.deepEqual(oCommonDataModelService._oPersonalizedSite, {}, "Personalized site was initialized");
        assert.deepEqual(oCommonDataModelService._oContentProviderIndex, {}, "ContentProviderIndex was initialized");
        assert.ok(oCommonDataModelService._oSiteConverter instanceof SiteConverter, "SiteConverter was initialized");
    });

    QUnit.test("Fails the SiteDeferred promise when the site could not be loaded", function (assert) {
        // Arrange
        this.oGetSiteDeferred.reject();
        // Act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        // Assert
        assert.ok(this.oMockAdapter.getSite.called, "getSite was called");
        assert.strictEqual(oCommonDataModelService._oSiteDeferred.state(), "rejected", "Site Promise was rejected");
    });

    QUnit.module("_loadAndApplyPersonalization", {
        beforeEach: function () {
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sinon.spy(function () {
                    return this._getSiteDeferred.promise();
                }),
                _getPersonalizationDeferred: new jQuery.Deferred(),
                getPersonalization: sinon.spy(function () {
                    return this._getPersonalizationDeferred.promise();
                })
            };
            this.oMockPersonalizationProcessor = {
                _mixinPersonalizationDeferred: new jQuery.Deferred(),
                mixinPersonalization: sinon.spy(function () {
                    return this._mixinPersonalizationDeferred.promise();
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Instantiates and mixes in personalization for any site below CDM 3.1", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "2.5.0",
            originalProperty: "foo"
        };
        var oPers = {
            personalizedProperty: "bar"
        };
        var oPersonalizedSite = {
            _version: "2.5.0",
            originalProperty: "foo",
            personalizedProperty: "bar"
        };

        // act
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        var oTriggerMixinPersonalisationInSiteSpy = sinon.spy(oCommonDataModelService, "_triggerMixinPersonalisationInSite");
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;

        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._getPersonalizationDeferred.resolve(oPers);
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(oPersonalizedSite);

        // assert
        assert.strictEqual(this.oMockAdapter.getPersonalization.callCount, 1, "getPersonalization called");
        assert.strictEqual(oTriggerMixinPersonalisationInSiteSpy.callCount, 1, "_triggerMixinPersonalisationInSite is called once.");
        assert.ok(oTriggerMixinPersonalisationInSiteSpy.getCall(0).calledWith(oOriginalSite, oPers),
            "_triggerMixinPersonalisationInSite was called with the correct parameters");
        assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "mixinPersonalization called");
    });

    QUnit.test("Instantiates everything and calls getSite on the adapter", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "3.0.0",
            originalProperty: "foo"
        };
        var oPers = {
            personalizedProperty: "bar"
        };
        var oPersonalizedSite = {
            _version: "3.0.0",
            originalProperty: "foo",
            personalizedProperty: "bar"
        };

        // act #1
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // assert #1
        assert.strictEqual(oCommonDataModelService._oAdapter, this.oMockAdapter, "property oAdapter");
        assert.ok(oCommonDataModelService._oPersonalizationProcessor instanceof PersonalizationProcessor,
            "property oPersonalizationProcessor");
        assert.strictEqual(this.oMockAdapter.getSite.callCount, 1, "getSite called");
        // arrange #2
        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        var oTriggerMixinPersonalisationInSiteSpy = sinon.spy(oCommonDataModelService, "_triggerMixinPersonalisationInSite");

        // act #2
        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._getPersonalizationDeferred.resolve(oPers);
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(oPersonalizedSite);

        //assert #2
        assert.strictEqual(oTriggerMixinPersonalisationInSiteSpy.callCount, 1, "_triggerMixinPersonalisationInSite is called once.");
        assert.ok(oTriggerMixinPersonalisationInSiteSpy.getCall(0).calledWith(oOriginalSite, oPers),
            "_triggerMixinPersonalisationInSite was called with the correct parameters");
        assert.strictEqual(this.oMockAdapter.getPersonalization.callCount, 1, "getPersonalization called");
        assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "mixinPersonalization called");

        assert.deepEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "original site");
        assert.notStrictEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "oOriginalCdmSite is a copy");
        assert.deepEqual(oCommonDataModelService._oPersonalizedSite, oPersonalizedSite, "_oPersonalizedSite");

        // Check that standard vizTypes have been added. One manifest property is checked to verify the loading was successful.
        assert.strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.StaticAppLauncher"]["sap.app"].type,
            "component", "Static tile visualization type added");
        assert.strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.DynamicAppLauncher"]["sap.app"].type,
            "component", "Dynamic tile visualization type added");
        assert.strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.Card"]["sap.app"].type,
            "card", "Card visualization type added");

        var fnDone = assert.async();
        oCommonDataModelService._oSiteDeferred
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
                fnDone();
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
                fnDone();
            });
    });

    QUnit.test("Doesn't mixin personalization if CDM 3.1.0 or higher is used", function (assert) {
        // Arrange
        var oOriginalSite = {
            _version: "3.1.0",
            originalProperty: "foo"
        };
        var oExtendedSite = {
            _version: "3.1.0",
            originalProperty: "bar"
        };

        this.oEnsureStandardVizTypesPresentStub = sandbox.stub(CommonDataModel.prototype, "_ensureStandardVizTypesPresent");
        this.oEnsureStandardVizTypesPresentStub.withArgs(oOriginalSite).returns(oExtendedSite);

        // act #1
        var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

        // assert #1
        assert.strictEqual(this.oMockAdapter.getSite.callCount, 1, "getSite called");
        // arrange #2
        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        var oTriggerMixinPersonalisationInSiteSpy = sinon.spy(oCommonDataModelService, "_triggerMixinPersonalisationInSite");

        // act #2
        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);

        //assert #2
        assert.strictEqual(this.oMockAdapter.getPersonalization.callCount, 0, "getPersonalization is not called");
        assert.strictEqual(oTriggerMixinPersonalisationInSiteSpy.callCount, 0, "getPersonalization is not called");
        assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 0, "mixinPersonalization is not called");

        assert.deepEqual(oCommonDataModelService._oOriginalSite, oExtendedSite, "original site");
        assert.notStrictEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "oOriginalCdmSite is a copy");

        assert.strictEqual(this.oEnsureStandardVizTypesPresentStub.callCount, 1, "_ensureStandardVizTypesPresent was called once");
        assert.deepEqual(this.oEnsureStandardVizTypesPresentStub.getCall(0).args[0], oOriginalSite, "_ensureStandardVizTypesPresent was called with the correct site");

        var fnDone = assert.async();
        oCommonDataModelService._oSiteDeferred
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
                fnDone();
            })
            .done(function (oResolvedOriginalSite) {
                assert.deepEqual(oResolvedOriginalSite, oExtendedSite, "The original site is resolved instead of the personalized site");
                fnDone();
            });
    });

    [
        0, 1, 2 // failing promise
    ].forEach(function (iFailingDeferred) {
        QUnit.test("Error case promise " + iFailingDeferred + " failed", function (assert) {
            // Arrange
            var oOriginalSite = {
                _version: "3.0.0",
                originalProperty: "foo"
            };
            var oPers = {
                personalizedProperty: "bar"
            };
            var fnDone = assert.async();

            // act #1
            var oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

            // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
            oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;

            if (iFailingDeferred === 0) {
                this.oMockAdapter._getSiteDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 1) {
                this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                this.oMockAdapter._getPersonalizationDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 2) {
                this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                this.oMockAdapter._getPersonalizationDeferred.resolve(oPers);
                this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject("intentionally failed");
            }

            //assert #2
            oCommonDataModelService._oSiteDeferred
                .done(function () {
                    assert.ok(false, "unexpected resolve of _oSiteDeferred");
                })
                .fail(function (sMessage) {
                    assert.strictEqual(sMessage, "intentionally failed", "error message");
                })
                .always(fnDone);
        });
    });

    QUnit.module("_applyPagePersonalization", {
        beforeEach: function () {
            this.oSiteMock = {
                _version: "3.1.0"
            };
            this.oPersonalizationMock = {
                _version: "3.1.0",
                somePageId: {
                    id: "somePersonalization"
                }
            };
            this.oPage = {
                _version: "3.1.0",
                identification: {
                    id: "somePageId"
                }
            };
            this.o30Page = {
                _version: "3.0.0",
                identification: {
                    id: "somePageId"
                }
            };

            this.oTriggerMixinPersonalisationInSiteStub = sandbox.stub(CommonDataModel.prototype, "_triggerMixinPersonalisationInSite");
            this.oTriggerMixinPersonalisationInSiteStub.callsFake(function (oPage) {
                if (oPage._version === "3.0.0") {
                    oPage.personalized = true;
                    return Promise.resolve(oPage);
                }
            });

            this.oGetPersonalizationStub = sandbox.stub();
            this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(this.oPersonalizationMock).promise());
            this.oCDMService = new CommonDataModel({
                getSite: sinon.stub().returns(new jQuery.Deferred().resolve(this.oSiteMock).promise()),
                getPersonalization: this.oGetPersonalizationStub
            });

            this.oConvertToStub = sandbox.stub();
            this.oConvertToStub.callsFake(function (sVersion, oPage) {
                if (sVersion === "3.1.0" && oPage._version === "3.0.0") {
                    oPage._version = "3.1.0";
                    return oPage;
                }
                if (sVersion === "3.0.0" && oPage._version === "3.1.0") {
                    oPage._version = "3.0.0";
                    return oPage;
                }
            });
            this.oCDMService._oSiteConverter = {
                convertTo: this.oConvertToStub
            };

            this.oCDMService._oPersonalizedPages = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result", function (assert) {
        // Arrange
        var oExpectedPage = {
            _version: "3.1.0",
            identification: {
            id: "somePageId"
            },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.callCount, 1, "_triggerMixinPersonalisationInSite was called once");

                var sPageId = this.oPersonalizationMock.somePageId;
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.getCall(0).args[1], sPageId, "_triggerMixinPersonalisationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result for very deep objects", function (assert) {
        // Arrange
        ObjectPath.set("this.is.a.very.deep.object.that.is.more.than.ten.levels.deep", true, this.oPage);

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.callCount, 1, "_triggerMixinPersonalisationInSite was called once");

                var sPageId = this.oPersonalizationMock.somePageId;
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.getCall(0).args[1], sPageId, "_triggerMixinPersonalisationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result if _version is not available", function (assert) {
        // Arrange
        this.oPersonalizationMock.version = "3.1.0";
        delete this.oPersonalizationMock._version;

        var oExpectedPage = {
            _version: "3.1.0",
            identification: {
            id: "somePageId"
            },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, this.oPersonalizationMock, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.callCount, 1, "_triggerMixinPersonalisationInSite was called once");

                var sPageId = this.oPersonalizationMock.somePageId;
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.getCall(0).args[1], sPageId, "_triggerMixinPersonalisationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Returns the correct result if there is no personalization", function (assert) {
        // Arrange
        this.oPersonalizationMock = {};
        this.oTriggerMixinPersonalisationInSiteStub.withArgs(sinon.match.any, {}).callsFake(function (oPage) {
            if (oPage._version === "3.0.0") {
                oPage.personalized = true;
                return Promise.resolve(oPage);
            }
        });
        var oExpectedPage = {
            _version: "3.1.0",
            identification: {
            id: "somePageId"
            },
            personalized: true
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function (oPersonalizedPage) {
                // Assert
                assert.deepEqual(oPersonalizedPage, oExpectedPage, "returned the correct result");

                assert.deepEqual(this.oCDMService._oPersonalizedPages.somePageId, oExpectedPage, "saved the page correctly");
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, {}, "saved the personalization deltas correctly");
                assert.strictEqual(this.oTriggerMixinPersonalisationInSiteStub.callCount, 1, "_triggerMixinPersonalisationInSite was called once");
                assert.deepEqual(this.oTriggerMixinPersonalisationInSiteStub.getCall(0).args[1], {}, "_triggerMixinPersonalisationInSite was called with the correct personalization");
                assert.strictEqual(this.oConvertToStub.callCount, 2, "convertTo was called twice");
            }.bind(this));
    });

    QUnit.test("Rejects when mixin personalization fails", function (assert) {
        // Arrange
        this.oTriggerMixinPersonalisationInSiteStub.withArgs(sinon.match.any, sinon.match.any).rejects();
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, this.oPersonalizationMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise was rejected");
            });
    });

    QUnit.test("Migrates classic personalization to pages personalization", function (assert) {
        // Arrange
        var oClassicPersonalization = {
            _version: "3.0.0",
            groups: {},
            groupsOrder: [],
            addedGroups: {}
        };
        this.oPage.identification.id = "classicHomePage";

        var oExpectedPersonalization = {
            classicHomePage: oClassicPersonalization,
            _version: "3.1.0",
            version: "3.1.0"
        };
        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oClassicPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, oExpectedPersonalization, "saved the personalization deltas correctly");

                var oPersonalization = this.oTriggerMixinPersonalisationInSiteStub.firstCall.args[1];
                assert.strictEqual(oPersonalization, oClassicPersonalization, "_triggerMixinPersonalisationInSite was called with the correct personalization");
            }.bind(this));
    });

    QUnit.test("Recovers broken personalization for classicHomePage", function (assert) {
        // Arrange
        var oBrokenPersonalization = {
            classicHomePage: {
                version: "3.1.0",
                page1: {
                    _version: "3.0.0",
                    groupsOrder: ["group1", "group2", "group3"]
                },
                page2: {
                    _version: "3.0.0",
                    groupsOrder: ["group2", "group1", "group3"]
                }
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };
        var oExpectedPersonalization = {
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            page2: {
                _version: "3.0.0",
                groupsOrder: ["group2", "group1", "group3"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oBrokenPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, oExpectedPersonalization, "saved the correct personalization");
            }.bind(this));
    });

    QUnit.test("Does not recover correct personalization for classicHomePage", function (assert) {
        // Arrange
        var oCorrectPersonalization = {
            classicHomePage: {
                _version: "3.0.0",
                groupsOrder: ["group1", "group2", "group3"]
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };
        this.oGetPersonalizationStub.withArgs("3.1.0").returns(new jQuery.Deferred().resolve(oCorrectPersonalization).promise());
        var oExpectedPersonalization = {
            classicHomePage: {
                _version: "3.0.0",
                groupsOrder: ["group1", "group2", "group3"]
            },
            page1: {
                _version: "3.0.0",
                groupsOrder: ["group3", "group2", "group1"]
            },
            _version: "3.1.0",
            version: "3.1.0"
        };

        // Act
        return this.oCDMService._applyPagePersonalization(this.oPage, oCorrectPersonalization)
            .then(function () {
                // Assert
                assert.deepEqual(this.oCDMService._oPersonalizationDeltas, oExpectedPersonalization, "saved the correct personalization");
            }.bind(this));
    });

    QUnit.module("_triggerMixinPersonalisationInSite", {
        beforeEach: function () {
            this.oOriginalSite = {
                _version: "3.1.0",
                originalProperty: "foo"
            };
            this.oPers = {
                personalizedProperty: "bar"
            };
            this.oPersonalisedSite = {
                _version: "3.1.0",
                originalProperty: "foo",
                personalizedProperty: "bar"
            };
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sinon.spy(function () {
                    return this._getSiteDeferred.promise();
                })
            };

            this.oMockPersonalizationProcessor = {
                _mixinPersonalizationDeferred: new jQuery.Deferred(),
                mixinPersonalization: sinon.spy(function () {
                    return this._mixinPersonalizationDeferred.promise();
                })
            };

            this.oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        },
        afterEach: function () {
        }
    });

    QUnit.test("calls mixinPersonalisation with the correct parameters and returns a personalised site.", function (assert) {
        // Arrange
        this.oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(this.oPersonalisedSite);

        // Act
        this.oCommonDataModelService._triggerMixinPersonalisationInSite(this.oOriginalSite, this.oPers);

        // Assert
        assert.ok(this.oMockPersonalizationProcessor.mixinPersonalization.getCall(0).calledWith(this.oOriginalSite, this.oPers), "the function mixinPersonalization called with the right parameters.");
        assert.strictEqual(this.oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "the function mixinPersonalization called exactly once.");
        assert.deepEqual(this.oCommonDataModelService._oPersonalizedSite, this.oPersonalisedSite, "the correct personalised site was returned.");
        // Cleanup
    });

    QUnit.test("calls all needed check functions on the personalised site", function (assert) {
        // Arrange
        var oEnsureCompleteSiteSpy = sinon.spy(this.oCommonDataModelService, "_ensureCompleteSite");
        var oEnsureGroupsOrderSpy = sinon.spy(this.oCommonDataModelService, "_ensureGroupsOrder");
        var oEnsureStandardVizTypesPresentSpy = sinon.spy(this.oCommonDataModelService, "_ensureStandardVizTypesPresent");

        this.oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(this.oPersonalisedSite);

        // Act
        this.oCommonDataModelService._triggerMixinPersonalisationInSite(this.oOriginalSite, this.oPers);

        // Assert
        assert.strictEqual(oEnsureCompleteSiteSpy.callCount, 1, "the function _ensureCompleteSite was called exactly once.");
        assert.strictEqual(oEnsureGroupsOrderSpy.callCount, 1, "the function _ensureGroupsOrder was called exactly once.");
        assert.strictEqual(oEnsureStandardVizTypesPresentSpy.callCount, 1, "the function _ensureStandardVizTypesPresent was called exactly once.");
        assert.ok(oEnsureCompleteSiteSpy.getCall(0).calledWith(this.oPersonalisedSite), "the function _ensureCompleteSite was called with the right parameters.");
        assert.ok(oEnsureGroupsOrderSpy.getCall(0).calledWith(this.oPersonalisedSite), "the function _ensureGroupsOrder was called with the right parameters.");
        assert.ok(oEnsureStandardVizTypesPresentSpy.getCall(0).calledWith(this.oPersonalisedSite), "the function _ensureStandardVizTypesPresent was called with the right parameters.");
    });

    QUnit.test("checks the error case", function (assert) {
        // Arrange
        this.oCommonDataModelService._oPersonalizationProcessor = this.oMockPersonalizationProcessor;
        this.oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject();

        // Act
        this.oCommonDataModelService._triggerMixinPersonalisationInSite(this.oOriginalSite, this.oPers);

        // Assert
        assert.strictEqual(this.oCommonDataModelService._oSiteDeferred.state(), "rejected", "the function correctly rejects after mixin handler rejected.");
    });

    QUnit.module("sap.ushell.services.CommonDataModel", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            window["sap-ushell-config"] = {services: {CommonDataModel: {adapter: {module: "sap.ushell.adapters.cdm.CommonDataModelAdapter"}}}};

            //bootstrap
            sap.ushell.bootstrap("local")
                .done(fnDone);
        },
        afterEach: function () {
            delete sap.ushell.Container;
            oTestUtils.restoreSpies(
                jQuery.sap.log.warning,
                jQuery.sap.log.error
            );
        }
    });

    QUnit.test("#getPlugins should always return a promise", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: {inbounds: {"Shell-plugin": {}}}
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: {
                                inbounds: {"Shell-plugin": {}}
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_1_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    }
                }
            });
        });

        // Always returns a promise
        assert.ok(oCDM.getPlugins().then && oCDM.getPlugins("UserDefaults").then,
            "Consistently returns a promise whether queried category is found or not");
    });

    QUnit.test("#getPlugins should correctly identify plugins among apps", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: {inbounds: {"Shell-plugin": {}}}
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: {inbounds: {"Shell-plugin": {}}}
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_1_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:2",
                            title: "Plugin 2"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_2_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "UserDefaults"}
                            }
                        }
                    },
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_3_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "UnsupportedCategory"}
                            }
                        }
                    },
                    // inbounds present, type is not plugin
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3",
                            crossNavigation: {inbounds: {"Shell-plugin": {}}}
                        },
                        "sap.flp": {type: "tile"},
                        "sap.ui5": {componentName: "plugin_4_component"}
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": {type: "tile"},
                        "sap.ui5": {componentName: "plugin_5_component"}
                    },
                    // type is plugin, but no config
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_6_component"},
                        "sap.platform.runtime": {componentProperties: {url: "http://"}}
                    },
                    // inbound has non-overlapping parameters
                    plugin_7: {
                        "sap.app": {
                            id: "plugin:7",
                            title: "Plugin 7",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: {value: "value1"}
                                                },
                                                param2: { // not in sap.platform.runtime
                                                    defaultValue: {
                                                        type: "plain",
                                                        value: "value2"
                                                    }
                                                },
                                                param3: {
                                                    required: true,
                                                    filter: { // filter is ignored
                                                        type: "plain",
                                                        value: "value3"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_7_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    },
                    // inbound has overlapping parameters
                    plugin_8: {
                        "sap.app": {
                            id: "plugin:8",
                            title: "Plugin 8",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {
                                        signature: {
                                            parameters: {
                                                param1: { // also in sap.platform.runtime
                                                    defaultValue: {value: "valueFromInbound"}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_8_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {param1: "valueFromConfig"}
                            }
                        }
                    }
                }
            });
        });

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (oPlugins) {
                assert.deepEqual(oPlugins, {
                    plugin_0: {
                        url: "http://",
                        config: {"sap-ushell-plugin-type": "RendererExtensions"},
                        component: "plugin_0_component"
                    },
                    plugin_1: {
                        url: "http://",
                        config: {"sap-ushell-plugin-type": "RendererExtensions"},
                        component: "plugin_1_component"
                    },
                    plugin_2: {
                        url: "http://",
                        config: {"sap-ushell-plugin-type": "UserDefaults"},
                        component: "plugin_2_component"
                    },
                    plugin_3: {
                        url: "http://",
                        config: {"sap-ushell-plugin-type": "UnsupportedCategory"},
                        component: "plugin_3_component"
                    },
                    plugin_6: {
                        url: "http://",
                        component: "plugin_6_component",
                        config: {}
                    },
                    plugin_7: {
                        url: "http://",
                        component: "plugin_7_component",
                        config: {
                            // merged: signature parameters + componentProperties
                            param1: "value1",
                            param2: "value2",
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    },
                    plugin_8: {
                        url: "http://",
                        component: "plugin_8_component",
                        config: {param1: "valueFromInbound"} // value from signature takes precedence
                    }
                }, "Correctly identifies plugins in site and returns them");
            }, function (vError) {
                return vError;
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should transfer form factor", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    // deviceTypes is provided
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.ui": {
                            technology: "UI5",
                            deviceTypes: {
                                desktop: true,
                                tablet: true,
                                phone: true
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    //only phone
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.ui": {
                            technology: "UI5",
                            deviceTypes: {
                                desktop: false,
                                tablet: false,
                                phone: true
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // no device type is provided
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:2",
                            title: "Plugin 2",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_2_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (oPlugins) {
                assert.deepEqual(oPlugins, {
                    plugin_0: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_0_component",
                        deviceTypes: {
                            desktop: true,
                            tablet: true,
                            phone: true
                        }
                    },
                    plugin_1: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_1_component",
                        deviceTypes: {
                            desktop: false,
                            tablet: false,
                            phone: true
                        }
                    },
                    plugin_2: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_2_component"
                    }
                }, "Correctly identifies plugins in site and returns them");
            }, function (vError) {
                return vError;
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should not error when no inbounds are defined", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {inbounds: {}} // no inbounds
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 0,
                    "jQuery.sap.log.error was called 0 times");

            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should error if no Shell-plugin inbound is defined", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {
                                inbounds: {InboundId: {}} // note: not Shell-plugin
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 1,
                    "jQuery.sap.log.error was called once");

                assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot find inbound with id 'Shell-plugin' for plugin 'plugin'",
                    "plugin startup configuration cannot be determined correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should warn if multiple inbounds are defined for a plugin", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {},
                                    AnotherInbound1: {},
                                    AnotherInbound2: {}
                                }
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "warning");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.warning.callCount, 1,
                    "jQuery.sap.log.warning was called once");

                assert.deepEqual(jQuery.sap.log.warning.getCall(0).args, [
                    "Multiple inbounds are defined for plugin 'plugin'",
                    "plugin startup configuration will be determined using the signature of 'Shell-plugin' inbound.",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.warning was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should have a consistent cache", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnReturnedOutputCharacteristicTestDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: {
                                inbounds: {"Shell-plugin": {}}
                            }
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: {"sap-ushell-plugin-type": "RendererExtensions"}
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_3_component"},
                        "sap.platform.runtime": {
                            componentProperties: {
                                config: {"sap-ushell-plugin-type": "UnsupportedCategory"}
                            }
                        }
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": {type: "tile"},
                        "sap.ui5": {componentName: "plugin_5_component"}
                    },
                    // type is plugin but no category specified
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_6_component"},
                        "sap.platform.runtime": {componentProperties: {}}
                    }
                }
            });
        });

        // Test cache consistency.
        jQuery.when(oCDM.getPlugins(), oCDM.getPlugins())
            .then(function (oFirstPluginSet, oSecondPluginSet) {
                assert.throws(function () {
                    oFirstPluginSet["bad property"] = {};
                }, TypeError, "Memoized output is secured from external corruption");

                assert.strictEqual(oFirstPluginSet, oSecondPluginSet, "Subsequent calls return the same references");
            })
            .then(fnReturnedOutputCharacteristicTestDone, fnReturnedOutputCharacteristicTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should be robust if sap.platform.runtime section is missing", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnDone = assert.async();

        sinon.stub(oCDM, "getSite").callsFake(function () {
            return jQuery.when({
                applications: {
                    // type is plugin and "sap.platform.runtime" section missing
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"}
                    },
                    // type is plugin and "sap.platform.runtime" section is null
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": null
                    },
                    // type is plugin and "sap.platform.runtime" section is a number
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": 42
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section missing
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_3_component"},
                        "sap.platform.runtime": {}
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is null
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {componentProperties: null}
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is a function
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": {type: "plugin"},
                        "sap.ui5": {componentName: "plugin_0_component"},
                        "sap.platform.runtime": {
                            componentProperties: function () {
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 6,
                    "jQuery.sap.log.error was called twice");

                assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_0'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(1).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_1'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(2).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_2'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(3).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_3'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(4).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_4'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(5).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_5'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "expected that getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnDone, fnDone);

        oCDM.getSite.restore();
    });

    QUnit.test("getSite", function (assert) {
        // arrange
        var oCommonDataModelService,
            oSiteDeferredMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sinon.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                })
                // getPersonalization not needed
            },
            oPersonalizedSite = {
                originalProperty: "foo",
                personalizedProperty: "bar"
            },
            fnDone = assert.async();

        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSiteDeferred as it is used by getSite
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();

        // act - success case
        oSiteDeferredMock.resolve(oPersonalizedSite);
        oCommonDataModelService.getSite()
            .fail(function () {
                assert.ok(false, "unexpected reject of _oSiteDeferred");
            })
            .done(function (oResolvedPersonalizedSite) {
                assert.deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
            })
            .always(fnDone);
    });

    QUnit.test("get site", function (assert) {
        // arrange
        var oCommonDataModelService,
            oSiteDeferredMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sinon.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                })
                // getPersonalization not needed
            },
            fnDone = assert.async();

        oCommonDataModelService = new CommonDataModel(oMockAdapter);

        // failure case
        oSiteDeferredMock = new jQuery.Deferred();
        oCommonDataModelService._oSiteDeferred = oSiteDeferredMock.promise();

        // act - success case
        oSiteDeferredMock.reject("intentionally failed");
        oCommonDataModelService.getSite()
            .done(function () {
                assert.ok(false, "unexpected resolve of _oSiteDeferred");
            })
            .fail(function (sMessage) {
                assert.strictEqual(sMessage, "intentionally failed", "error message");
            })
            .always(fnDone);
    });

    QUnit.module("getPage", {
        beforeEach: function () {
            this.oPageMock = {
                id: "validPageId"
            };
            this.oPersonalizedPageMock = {
                id: "validPageId",
                personalized: true
            };
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

            this.oGetPageFromAdapterStub = sandbox.stub(CommonDataModel.prototype, "_getPageFromAdapter");
            this.oGetPageFromAdapterStub.withArgs("validPageId").resolves(this.oPageMock);

            this.oApplyPagePersonalizationStub = sandbox.stub(CommonDataModel.prototype, "_applyPagePersonalization");
            this.oApplyPagePersonalizationStub.withArgs(this.oPageMock).resolves(this.oPersonalizedPageMock);
            this.oGetPersonalizationStub = sandbox.stub();
            this.oGetPersonalizationStub.returns(new jQuery.Deferred().resolve(this.oPersonalizationMock).promise());

            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: this.oGetPersonalizationStub
            });
            this.oCDMService._oPersonalizedPages = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves a personalized page, when personalization is enabled", function (assert) {
        // Arrange

        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPersonalizedPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was called once");
            }.bind(this));
    });

    QUnit.test("Resolves a page without personalization page, when personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");
                assert.strictEqual(this.oGetPageFromAdapterStub.callCount, 1, "_getPageFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Rejects if gathering the page fails", function (assert) {
        // Arrange
        var sExpectedMessage = "CommonDataModel Service: Cannot get page validPageId";
        this.oGetPageFromAdapterStub.withArgs(sinon.match.any).rejects();
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });


    QUnit.test("Rejects if gathering the personalization fails", function (assert) {
        // personalization

        this.oGetPersonalizationStub.returns(new jQuery.Deferred().reject().promise());

        var sExpectedMessage = "CommonDataModel Service: Cannot get page validPageId";
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });


    QUnit.test("Rejects if personalization mixin fails", function (assert) {
        // Arrange
        var sExpectedMessage = "Personalization Processor: Cannot mixin the personalization.";
        this.oApplyPagePersonalizationStub.withArgs(sinon.match.any).rejects();
        // Act
        return this.oCDMService.getPage("validPageId")
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Resolves the same page if it was already loaded", function (assert) {
        // Arrange
        var oPersonalizedPage = {
            id: "validPageId",
            personalized: true
        };
        this.oCDMService._oPersonalizedPages.validPageId = oPersonalizedPage;
        // Act
        return this.oCDMService.getPage("validPageId").then(function (oPage) {
            // Assert
            assert.strictEqual(oPage, oPersonalizedPage, "Returned the correct page object");
        });
    });

    QUnit.module("_getPageFromAdapter", {
        beforeEach: function () {
            this.sPageIdMock = "somePageId";
            this.oPageMock = {
                identification: {
                    id: this.sPageIdMock
                }
            };

            this.oGetPageStub = sandbox.stub();
            this.oGetPageStub.withArgs(this.sPageIdMock).resolves(this.oPageMock);
            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred()),
                getPage: this.oGetPageStub
            });
            this.oCDMService._oOriginalSite = {
                pages: {}
            };
        }
    });

    QUnit.test("Returns page via adapter", function (assert) {
        // Arrange
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");

                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
            }.bind(this));
    });

    QUnit.test("Returns page via site fallback", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getPage;
        this.oCDMService._oOriginalSite.pages[this.sPageIdMock] = this.oPageMock;
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function (oPage) {
                // Assert
                assert.deepEqual(oPage, this.oPageMock, "returned the correct result");

                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects when getPage fails", function (assert) {
        // Arrange
        this.oGetPageStub.withArgs(this.sPageIdMock).rejects();
        // Act
        return this.oCDMService._getPageFromAdapter(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getPages", {
        beforeEach: function () {
            this.oPageMock = {
                id: "validPageId"
            };
            this.oPagesMock = {
                validPageId: this.oPageMock
            };
            this.oPersonalizedPageMock = {
                id: "validPageId",
                personalized: true
            };
            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(true);

            this.oGetPagesFromAdapterStub = sandbox.stub(CommonDataModel.prototype, "_getPagesFromAdapter");
            this.oGetPagesFromAdapterStub.callsFake(function (aPageIds) {
                var oPages = {};
                aPageIds.forEach(function (sPageId) {
                    oPages[sPageId] = this.oPagesMock[sPageId];
                }.bind(this));
                return Promise.resolve(oPages);
            }.bind(this));

            this.oApplyPagePersonalizationStub = sandbox.stub(CommonDataModel.prototype, "_applyPagePersonalization");
            this.oApplyPagePersonalizationStub.callsFake(function (oPage) {
                if (oPage) {
                    oPage.personalized = true;
                }
                return Promise.resolve(oPage);
            });

            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sinon.stub().returns(new jQuery.Deferred().resolve(this.oPersonalizedMock).promise())
            });
            this.oCDMService._oPersonalizedPages = {};
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves a list of personalized pages, when personalization is enabled", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPersonalizedPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 1, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Resolves a list of pages without personalization, when personalization is disabled", function (assert) {
        // Arrange
        this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock], "Returned the correct result");
                assert.strictEqual(this.oGetPagesFromAdapterStub.callCount, 1, "_getPagesFromAdapter was called once");
                assert.strictEqual(this.oApplyPagePersonalizationStub.callCount, 0, "_applyPagePersonalization was not called");
            }.bind(this));
    });

    QUnit.test("Filters undefined pages out", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getPages(["validPageId", "undefinedPageId"])
            .then(function (aPages) {
                assert.deepEqual(aPages, [this.oPageMock], "Returned the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects if gathering the page fails", function (assert) {
        // Arrange
        var sExpectedMessage = "CommonDataModel Service: Cannot get pages";
        this.oGetPagesFromAdapterStub.rejects();
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Rejects if personalization mixin fails", function (assert) {
        // Arrange
        var sExpectedMessage = "Personalization Processor: Cannot mixin the personalization.";
        this.oApplyPagePersonalizationStub.rejects();
        // Act
        return this.oCDMService.getPages(["validPageId"])
            .then(function () {
                // Assert
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, sExpectedMessage, "rejected with the correct message");
            });
    });

    QUnit.test("Resolves the same page if it was already loaded", function (assert) {
        // Arrange
        var oPersonalizedPage = {
            id: "cachedPage",
            personalized: true
        };
        this.oCDMService._oPersonalizedPages.cachedPage = oPersonalizedPage;
        // Act
        return this.oCDMService.getPages(["validPageId", "cachedPage"])
            .then(function (aPages) {
                // Assert
                assert.strictEqual(aPages[1], oPersonalizedPage, "Resolved with the correct page object");
            });
    });

    QUnit.module("_getPagesFromAdapter", {
        beforeEach: function () {
            this.aPageIdsMock = ["firstPage", "secondPage"];
            this.oPagesMock = {
                firstPage: {
                    identification: {
                        id: "firstPage"
                    }
                },
                secondPage: {
                    identification: {
                        id: "secondPage"
                    }
                }
            };

            this.oGetPagesStub = sandbox.stub();
            this.oGetPagesStub.withArgs(this.aPageIdsMock).resolves(this.oPagesMock);
            this.oCDMService = new CommonDataModel({
                getSite: sandbox.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: sandbox.stub().returns(new jQuery.Deferred()),
                getPages: this.oGetPagesStub
            });
            this.oCDMService._oOriginalSite = {
                pages: {}
            };
        }
    });

    QUnit.test("Returns page via adapter", function (assert) {
        // Arrange
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function (oPages) {
                // Assert
                assert.deepEqual(oPages, this.oPagesMock, "returned the correct result");

                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
            }.bind(this));
    });

    QUnit.test("Returns page via site fallback", function (assert) {
        // Arrange
        delete this.oCDMService._oAdapter.getPages;
        this.oCDMService._oOriginalSite.pages = this.oPagesMock;
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function (oPages) {
                // Assert
                assert.deepEqual(oPages, this.oPagesMock, "returned the correct result");

                assert.deepEqual(this.oCDMService._oOriginalSite.pages[this.sPageIdMock], this.oPageMock, "saved the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects when getPages fails", function (assert) {
        // Arrange
        this.oGetPagesStub.withArgs(this.aPageIdsMock).rejects();
        // Act
        return this.oCDMService._getPagesFromAdapter(this.aPageIdsMock)
            .then(function () {
                assert.ok(false, "promise should have been rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getAllPages", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oHierarchyMock = {
                spaces: [
                    {
                        id: "space1",
                        pages: [
                            {
                                id: "page1"
                            },
                            {
                                id: "page2"
                            }
                        ]
                    },
                    {
                        id: "space2",
                        pages: [
                            {
                                id: "page3"
                            },
                            {
                                id: "page3"
                            },
                            {
                                id: "page4"
                            }
                        ]
                    }
                ]
            };
            this.aPages = [];

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oGetSpacesPagesHierarchyStub = sandbox.stub();
            this.oGetSpacesPagesHierarchyStub.resolves(this.oHierarchyMock);
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getSpacesPagesHierarchy: this.oGetSpacesPagesHierarchyStub
            });

            this.oCDMService = new CommonDataModel(oMockAdapter);

            this.oGetPagesStub = sandbox.stub(this.oCDMService, "getPages");
            this.oGetPagesStub.resolves(this.aPages);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Resolves with the correct result", function (assert) {
        // Arrange
        var aExpectedgetPagesArgs = ["page1", "page2", "page3", "page4"];
        // Act
        return this.oCDMService.getAllPages().then(function (aResult) {
            // Assert
            assert.strictEqual(aResult, this.aPages, "returned correct result");
            assert.strictEqual(this.oGetSpacesPagesHierarchyStub.callCount, 1, "getSpacesPagesHierarchy was called once");
            assert.strictEqual(this.oGetPagesStub.callCount, 1, "getPages was called once");
            assert.deepEqual(this.oGetPagesStub.getCall(0).args, [aExpectedgetPagesArgs], "getPages was called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Rejects if menu service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("Menu").rejects();
        // Act
        return this.oCDMService.getAllPages()
            .then(function () {
                // Assert
                assert.ok(false, "promise should have rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "promise rejected");
            });
    });

    QUnit.module("getApplications", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
        }
    });

    QUnit.test("Resolves with all applications defined in the Common Data Model", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve({
            _version: "3.1.0",
            applications: {
                "sap.ushell.demo.AppNavSample": {
                    "sap.app": {
                        id: "sap.ushell.demo.AppNavSample",
                        title: "Demo actual title AppNavSample",
                        subTitle: "AppNavSample",
                        ach: "CA-UI2-INT-FE",
                        applicationVersion: {
                            version: "1.0.0"
                        }
                    },
                    "sap.flp": {
                        type: "application"
                    },
                    "sap.ui": {
                        technology: "UI5",
                        icons: {
                            icon: "sap-icon://Fiori2/F0018"
                        },
                        deviceTypes: {
                            desktop: true,
                            tablet: false,
                            phone: false
                        }
                    },
                    "sap.ui5": {
                        componentName: "sap.ushell.demo.AppNavSample"
                    }
                },
                "sap.ushell.demo.AppPersSample": {
                    "sap.app": {
                        id: "sap.ushell.demo.AppPersSample",
                        title: "Demo actual title AppPersSample",
                        subTitle: "AppPersSample",
                        ach: "CA-UI2-INT-FE",
                        applicationVersion: {
                            version: "1.0.0"
                        }
                    },
                    "sap.flp": {
                        type: "application"
                    },
                    "sap.ui": {
                        technology: "UI5",
                        icons: {
                            icon: "sap-icon://Fiori2/F0018"
                        },
                        deviceTypes: {
                            desktop: true,
                            tablet: false,
                            phone: false
                        }
                    },
                    "sap.ui5": {
                        componentName: "sap.ushell.demo.AppPersSample"
                    }
                }
            }
        }).promise();

        var oExpectedApplications = {
            "sap.ushell.demo.AppNavSample": {
                "sap.app": {
                    id: "sap.ushell.demo.AppNavSample",
                    title: "Demo actual title AppNavSample",
                    subTitle: "AppNavSample",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                }
            },
            "sap.ushell.demo.AppPersSample": {
                "sap.app": {
                    id: "sap.ushell.demo.AppPersSample",
                    title: "Demo actual title AppPersSample",
                    subTitle: "AppPersSample",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppPersSample"
                }
            }
        };

        // Act
        return this.oCDMService.getApplications().then(function (oApplications) {
            // Assert
            assert.deepEqual(oApplications, oExpectedApplications, "The function resolves with all CDM applications.");
        });
    });

    QUnit.test("Rejects with an error message if the Common Data Model doesn't have any applications", function (assert) {
        var fnDone = assert.async();
        // Act
        this.oCDMService.getApplications()
            .catch(function (sErrorMessage) {
                // Assert
                assert.strictEqual(sErrorMessage, "CDM applications not found.", "The function rejects with the error message 'CDM applications not found.'.");
            })
            .finally(fnDone);
    });

    QUnit.test("Rejects if the CDM site jQuery Deferred promise is rejected", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().reject("CDM Site promise rejected").promise();

        // Act
        return this.oCDMService.getApplications().catch(function (sErrorMessage) {
            // Assert
            assert.strictEqual(sErrorMessage, "CDM Site promise rejected", "The function rejects if the CDM site promise fails.");
        });
    });

    QUnit.module("getVizTypes", {
        beforeEach: function () {
            this.oVizTypesMock = {
                mySpecialVizType: {}
            };
            this.oSiteMock = {
                vizTypes: this.oVizTypesMock
            };
            var oAdapterMock = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oAdapterMock);
            this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve(this.oSiteMock);
        }
    });

    QUnit.test("Resolves with the correct result if vizTypes are present", function (assert) {
        // Arrange
        // Act
        return this.oCDMService.getVizTypes()
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, this.oVizTypesMock, "Returned the correct result");
            }.bind(this));
    });

    QUnit.test("Rejects if no vizTypes are present", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve({});
        // Act
        return this.oCDMService.getVizTypes()
            .then(function () {
                assert.ok(false, "Should have been rejected");
            })
            .catch(function (sMessage) {
                // Assert
                assert.ok(true, "Promise was rejected as expected");
                assert.strictEqual(sMessage, "CDM vizTypes not found.", "Returned the correct error message");
            });
    });

    QUnit.test("Rejects if site promise fails", function (assert) {
        // Arrange
        var sErrorMessage = "CDM site promise failed";
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().reject(sErrorMessage);
        // Act
        return this.oCDMService.getVizTypes()
            .then(function () {
                assert.ok(false, "Should have been rejected");
            })
            .catch(function (sMessage) {
                // Assert
                assert.ok(true, "Promise was rejected as expected");
                assert.strictEqual(sMessage, sErrorMessage, "Returned the correct error message");
            });
    });

    QUnit.module("getVisualizations", {
        beforeEach: function () {
            var oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                },
                getPersonalization: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oCDMService = new CommonDataModel(oMockAdapter);
        }
    });

    QUnit.test("Resolves with all visualizations defined in the Common Data Model", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().resolve({
            _version: "3.1.0",
            visualizations: {
                OverloadedApp1: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp1.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp1",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                },
                OverloadedApp2: {
                    vizType: "sap.ushell.StaticAppLauncher",
                    businessApp: "OverloadedApp2.BusinessApp",
                    vizConfig: {
                        "sap.flp": {
                            target: {
                                appId: "OverloadedApp2",
                                inboundId: "Overloaded-start"
                            }
                        }
                    }
                }
            }
        }).promise();

        var oExpectedVisualizations = {
            OverloadedApp1: {
                vizType: "sap.ushell.StaticAppLauncher",
                businessApp: "OverloadedApp1.BusinessApp",
                vizConfig: {
                    "sap.flp": {
                        target: {
                            appId: "OverloadedApp1",
                            inboundId: "Overloaded-start"
                        }
                    }
                }
            },
            OverloadedApp2: {
                vizType: "sap.ushell.StaticAppLauncher",
                businessApp: "OverloadedApp2.BusinessApp",
                vizConfig: {
                    "sap.flp": {
                        target: {
                            appId: "OverloadedApp2",
                            inboundId: "Overloaded-start"
                        }
                    }
                }
            }
        };

        // Act
        return this.oCDMService.getVisualizations().then(function (oVisualizations) {
            // Assert
            assert.deepEqual(oVisualizations, oExpectedVisualizations, "The function resolves with all CDM visualizations.");
        });
    });

    QUnit.test("Rejects with an error message if the Common Data Model doesn't have any visualizations", function (assert) {
        // Act
        return this.oCDMService.getVisualizations().catch(function (sErrorMessage) {
            // Assert
            assert.strictEqual(sErrorMessage, "CDM visualizations not found.", "The function rejects with the error message 'CDM visualizations not found.'.");
        });
    });

    QUnit.test("Rejects if the CDM site jQuery Deferred promise is rejected", function (assert) {
        // Arrange
        this.oCDMService._oSiteDeferred = new jQuery.Deferred().reject("CDM Site promise rejected").promise();

        // Act
        return this.oCDMService.getVisualizations().catch(function (sErrorMessage) {
            // Assert
            assert.strictEqual(sErrorMessage, "CDM Site promise rejected", "The function rejects if the CDM site promise fails.");
        });
    });

    QUnit.module("getOriginalPage", {
        beforeEach: function () {
            this.oGetSiteStub = sandbox.stub().returns(new jQuery.Deferred().resolve({
                _version: "3.1.0",
                pages: {page1: {identification: {id: "page1"}}}
            }).promise());
            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub
            });
        }
    });

    QUnit.test("returns the page", function (assert) {
        var oExpectedPage = {
            identification: {
                id: "page1"
            }
        };
        var oReturnedPage = this.oCDMService.getOriginalPage("page1");
        assert.deepEqual(oExpectedPage, oReturnedPage, "The correct page was returned");
    });

    QUnit.module("save", {
        beforeEach: function () {
            this.oGetSiteStub = sinon.stub().returns(new jQuery.Deferred());
            this.oSetPersonalizationStub = sinon.stub();
            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub,
                setPersonalization: this.oSetPersonalizationStub
            });
        }
    });

    QUnit.test("Rejects if CDM Site Version is 3.1.0 and no page id was provided", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oCDMService._oOriginalSite = {
            _version: "3.1.0"
        };

        // Act & Assert
        this.oCDMService.save()
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "No page id was provided", "Promise was rejected with the proper error message");
            })
            .always(fnDone);
    });

    QUnit.test("Rejects the Promise if the personalization cannot be extracted", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oTestSite = {
                _version: "3.1.0",
                someProp: "someVal",
                pages: {
                    SomePage: {
                        SomePageProp: "Val"
                    }
                }
            },
            oExtractPersonalizationPromise = new jQuery.Deferred().reject().promise();

        sinon.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
            return page;
        });
        sinon.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization").returns(oExtractPersonalizationPromise);
        this.oCDMService._oOriginalSite = oTestSite;
        this.oCDMService._oPersonalizedPages = {};

        // Act & Assert
        this.oCDMService.save("SomeSite")
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "Personalization Processor: Cannot extract personalization.", "Promise was rejected with the proper error message");
            })
            .always(fnDone);
    });

    QUnit.test("Rejects the Promise if the personalization cannot be saved", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oTestSite = {
                _version: "3.1.0",
                someProp: "someVal",
                pages: {
                    SomePage: {
                        SomePageProp: "Val"
                    }
                }
            },
            oExtractPersonalizationPromise = new jQuery.Deferred().resolve("SomeExtractedPers").promise();

        sinon.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
            return page;
        });
        sinon.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization").returns(oExtractPersonalizationPromise);
        this.oSetPersonalizationStub.returns(new jQuery.Deferred().reject("SomeError").promise());
        this.oCDMService._oOriginalSite = oTestSite;
        this.oCDMService._oPersonalizedPages = {};

        // Act & Assert
        this.oCDMService.save("SomeSite")
            .done(function () {
                assert.ok(false, "Promise was rejected");
            })
            .fail(function (error) {
                assert.strictEqual(error, "SomeError", "Promise was rejected with the proper error message");
            })
            .always(fnDone);
    });

    QUnit.test("Resolves the Promise if the personalization was successfully saved", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oTestSite = {
                _version: "3.1.0",
                someProp: "someVal",
                pages: {
                    SomePage: {
                        SomePageProp: "Val"
                    }
                }
            },
            oExtractPersonalizationPromise = new jQuery.Deferred().resolve("SomeExtractedPers").promise();

        var expectedPersonalizationContainer = {
            version: "3.1.0",
            _version: "3.1.0",
            SomePage: "SomeExtractedPers"
        };

        sinon.stub(this.oCDMService, "getSite").returns(new jQuery.Deferred().resolve(oTestSite).promise());
        sinon.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
            return page;
        });
        var oExtractPersStub = sinon.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization").returns(oExtractPersonalizationPromise),
            oSetPersonalizationStub = this.oSetPersonalizationStub.returns(new jQuery.Deferred().resolve().promise());
        this.oCDMService._oOriginalSite = oTestSite;
        this.oCDMService._oPersonalizedPages = {};

        // Act & Assert
        this.oCDMService.save("SomePage")
            .done(function () {
                assert.ok(this.oGetSiteStub.called, "getSite was called");
                assert.deepEqual(oExtractPersStub.firstCall.args[0], undefined, "extractPersonalization was called with the proper personalized page");
                assert.deepEqual(oExtractPersStub.firstCall.args[1], oTestSite.pages.SomePage, "extractPersonalization was called with the proper page");
                assert.deepEqual(oSetPersonalizationStub.firstCall.args[0], expectedPersonalizationContainer, "setPersonalization was called with the expected personalization");
            }.bind(this))
            .fail(function (error) {

                assert.ok(false, "Promise was resolved");
            })
            .always(fnDone);
    });

    QUnit.test("Resolves the Promise if no personalization delta was found", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oTestSite = {
                _version: "3.1.0",
                someProp: "someVal",
                pages: {
                    SomePage: {
                        SomePageProp: "Val"
                    }
                }
            },
            oExtractPersonalizationPromise = new jQuery.Deferred().resolve().promise();

        sinon.stub(this.oCDMService, "getSite").returns(new jQuery.Deferred().resolve(oTestSite).promise());
        sinon.stub(this.oCDMService._oSiteConverter, "convertTo").callsFake(function (_version, page) {
            return page;
        });
        sinon.stub(this.oCDMService._oPersonalizationProcessor, "extractPersonalization").returns(oExtractPersonalizationPromise);
        this.oSetPersonalizationStub.returns(new jQuery.Deferred().resolve().promise());
        this.oCDMService._oOriginalSite = oTestSite;
        this.oCDMService._oPersonalizedPages = {};

        // Act & Assert
        this.oCDMService.save("SomePage")
            .done(function () {
                assert.ok(true, "Promise was resolved");
            })
            .fail(function (error) {
                assert.ok(false, "Promise was resolved");
            })
            .always(fnDone);
    });

    QUnit.module("_setPersonalization", {
        beforeEach: function () {
            this.oGetSiteStub = sinon.stub().returns(new jQuery.Deferred());
            this.oSetPersonalizationStub = sinon.stub();
            this.oCDMService = new CommonDataModel({
                getSite: this.oGetSiteStub,
                setPersonalization: this.oSetPersonalizationStub
            });
        },
        afterEach: function () {

        }
    });

    QUnit.test("only calls setPersonalization once when multiple saves were triggered and the first one was not yet processed", function (assert) {
        // Arrange
        var oDeferred = new jQuery.Deferred();
        this.oSetPersonalizationStub.returns(oDeferred);
        // Act
        this.oCDMService._setPersonalization();
        this.oCDMService._setPersonalization();
        this.oCDMService._setPersonalization();
        // Assert
        assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "Only called setPersonalization once");
    });

    QUnit.test("calls setPersonalization a second time with the latest delta when the first call was processed if multiple saves were queried and properly resolves all promises", function (assert) {
        // Arrange
        var oDeferred = new jQuery.Deferred(),
            aPromises = [];

        this.oSetPersonalizationStub.returns(oDeferred);
        // Act
        aPromises.push(this.oCDMService._setPersonalization("one"));
        aPromises.push(this.oCDMService._setPersonalization("two"));
        aPromises.push(this.oCDMService._setPersonalization("three"));
        oDeferred.resolve();
        // Assert
        return Promise.all(aPromises)
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 2, "called setPersonalization twice");
                assert.strictEqual(this.oSetPersonalizationStub.getCall(1).args[0], "three", "second call was with the last delta");
            }.bind(this));
    });

    QUnit.test("doesn't resolve queued queries before the newest delta is saved", function (assert) {
        // Arrange
        var oSetPersonalizationDeferred = new jQuery.Deferred(),
            oSecondDeferred = new jQuery.Deferred(),
            oPromise;

        this.oSetPersonalizationStub.onCall(0).returns(oSetPersonalizationDeferred);
        this.oSetPersonalizationStub.onCall(1).returns(oSecondDeferred);
        // Act
        this.oCDMService._setPersonalization("one");
        oPromise = this.oCDMService._setPersonalization("two");
        this.oCDMService._setPersonalization("three");
        assert.strictEqual(this.oSetPersonalizationStub.callCount, 1, "setPersonalization was called once");
        assert.strictEqual(this.oSetPersonalizationStub.getCall(0).args[0], "one", "setPersonalization was called with the correct arguments");
        oSetPersonalizationDeferred.resolve();
        oSecondDeferred.resolve();

        // Assert
        return oPromise
            .then(function () {
                assert.strictEqual(this.oSetPersonalizationStub.callCount, 2, "setPersonalization was called twice");
                assert.strictEqual(this.oSetPersonalizationStub.getCall(1).args[0], "three", "setPersonalization was called with the correct arguments the second time");
            }.bind(this))
            .catch(function (e) {
                assert.ok(false, "Promise was resolved");
            });
    });

    QUnit.module("sap.ushell.services.CommonDataModel", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            this.oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sinon.spy(function () {
                    return this._getSiteDeferred.promise();
                }),
                _getPersonalizationDeferred: new jQuery.Deferred(),
                getPersonalization: sinon.spy(function () {
                    return this._getPersonalizationDeferred.promise();
                }),
                _setPersonalizationDeferred: new jQuery.Deferred(),
                setPersonalization: sinon.spy(function () {
                    return this._setPersonalizationDeferred.promise();
                })
            };
            this.oConvertToStub = sinon.stub(SiteConverter.prototype, "convertTo");
            window["sap-ushell-config"] = {services: {CommonDataModel: {adapter: {module: "sap.ushell.adapters.cdm.CommonDataModelAdapter"}}}};

            //bootstrap
            sap.ushell.bootstrap("local")
                .done(fnDone);
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oConvertToStub.restore();
            oTestUtils.restoreSpies(
                jQuery.sap.log.warning,
                jQuery.sap.log.error
            );
        }
    });

    QUnit.test("save: undefined extracted personalization data ", function (assert) {
        var oCommonDataModelService,
            oStorePersonalizationDataStub,
            fnDone = assert.async();

        oCommonDataModelService = sap.ushell.Container.getService("CommonDataModel");
        oStorePersonalizationDataStub = sinon.stub(oCommonDataModelService._oAdapter, "setPersonalization").callsFake(function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve();
            return oDeferred.promise();
        });
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization").callsFake(function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(undefined);
            return oDeferred.promise();
        });

        oCommonDataModelService.save()
            .done(function () {
                assert.ok(!oStorePersonalizationDataStub.called, "Adapter wasn't called.");
                assert.ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function (e) {
                assert.ok(false);
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .always(fnDone);
    });

    QUnit.test("save: present extracted personalization data", function (assert) {
        var oCommonDataModelService,
            fnDone = assert.async();

        var oOriginalSite = {
            _version: "3.1.0",
            originalProperty: "foo",
            pages: {}
        };

        var oExpectedPersonalizationDelta = {
            foo: "bar"
        };

        var oExpectedPersonalizationDeltaMap = {
            version: "3.1.0",
            _version: "3.1.0",
            page1: oExpectedPersonalizationDelta
        };

        oCommonDataModelService = new CommonDataModel(this.oMockAdapter);
        this.oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        this.oMockAdapter._setPersonalizationDeferred.resolve({});
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization").callsFake(function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                foo: "bar"
            });
            return oDeferred.promise();
        });

        oCommonDataModelService.save("page1")
            .done(function () {
                assert.ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                assert.ok(oCommonDataModelService._oAdapter.setPersonalization.calledWith(oExpectedPersonalizationDeltaMap), "setPersonalization was called with correct personalization delta.");
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function () {
                assert.ok(false);
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .always(fnDone);
    });

    QUnit.test("save: setPersonalization rejects", function (assert) {
        var oCommonDataModelService,
            oStorePersonalizationDataStub,
            fnDone = assert.async();

        oCommonDataModelService = sap.ushell.Container.getService("CommonDataModel");
        oStorePersonalizationDataStub = sinon.stub(oCommonDataModelService._oAdapter, "setPersonalization").callsFake(function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.reject("Promise rejected due to any reason.");
            return oDeferred.promise();
        });
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization").callsFake(function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                foo: "bar"
            });
            return oDeferred.promise();
        });

        oCommonDataModelService.save()
            .done(function () {
                assert.ok(false);
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function (sMessage) {
                assert.ok(oStorePersonalizationDataStub.called, "setPersonalization called as expected.");
                assert.ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                assert.strictEqual(sMessage, "Promise rejected due to any reason.", "fail message is correct.");
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .always(fnDone);
    });

    [{
        testDescription: "fails because of undefined group id",
        input: {sGroupId: undefined},
        output: {
            oOriginalGroup: {identification: {id: "bar"}},
            sErrorMessage: "Group does not exist in original site."
        }
    }, {
        testDescription: "fails because of wrong group id (object instead of string)",
        input: {sGroupId: {}},
        output: {sErrorMessage: "Group does not exist in original site."}
    }, {
        testDescription: "fails because of undefined group id (number instead of string)",
        input: {sGroupId: 3},
        output: {sErrorMessage: "Group does not exist in original site."}
    }, {
        testDescription: "fails because group was not found in original site",
        input: {sGroupId: "myGroupId"},
        output: {sErrorMessage: "Group does not exist in original site."}
    }].forEach(function (oFixture) {
        QUnit.test("getGroupFromOriginalSite, failure: " + oFixture.testDescription, function (assert) {
            // Arrange
            var oOriginalGroup = oFixture.output.oOriginalGroup,
                oMockAdapter = {
                    getSite: function () {
                        return new jQuery.Deferred().resolve({
                            _version: "3.0.0",
                            groups: {foo: oOriginalGroup}
                        }).promise();
                    },
                    getPersonalization: function () {
                        return new jQuery.Deferred().resolve({}).promise();
                    }
                },
                oCommonDataModelService = new CommonDataModel(oMockAdapter),
                fnDone = assert.async();

            // Act
            oCommonDataModelService.getGroupFromOriginalSite(oFixture.input.sGroupId)
                .done(function () {
                    assert.ok(false, "Promise resolved unexpectedly");
                })
                .fail(function (sErrorMessage) {
                    // Assert
                    assert.strictEqual(sErrorMessage, oFixture.output.sErrorMessage, "error message returned");
                })
                .always(fnDone);
        });
    });

    QUnit.test("getGroupFromOriginalSite, success: returns copies", function (assert) {
        // Arrange
        var oOriginalGroup = {identification: {id: "bar"}},
            oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({
                        _version: "3.0.0",
                        groups: {
                            // We have to clone the because the original site is cloned in the CDM Service
                            // and the old reference is then reused
                            foo: jQuery.extend(true, {}, oOriginalGroup)
                        }
                    }).promise();
                },
                getPersonalization: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                }
            },
            oCommonDataModelService = new CommonDataModel(oMockAdapter),
            fnDone = assert.async();

        oCommonDataModelService.getGroupFromOriginalSite("foo")
            .fail(function () {
                assert.ok(false, "Promise resolved unexpectedly");
            })
            .done(function (oResetGroup1) {
                // call getGroupFromOriginalSite again to verify, that copies are returned
                oCommonDataModelService.getGroupFromOriginalSite("foo")
                    .fail(function () {
                        assert.ok(false, "Promise resolved unexpectedly");
                    })
                    .done(function (oResetGroup2) {
                        // Note: CommonDataModel extends the site received from the adapter
                        assert.deepEqual(oResetGroup1, oOriginalGroup, "original group returned");
                        assert.notStrictEqual(oResetGroup1, oResetGroup2, "copies are returned");
                    });
            })
            .always(fnDone);
    });

    (function () {
        function determineResolveOrder (aConfiguredOrder, iNumItems) {
            if (!aConfiguredOrder) {
                return new Array(iNumItems).join(",").split(",").map(function (o, iIdx) {
                    return iIdx;
                });
            }

            return aConfiguredOrder.map(function (iOrder, iIdx) {
                return {order: iOrder, finalizerIdx: iIdx};
            }).sort(function (oA, oB) {
                if (oA.order < oB.order) { return -1; }
                if (oA.order > oB.order) { return 1; }
                return 0;
            }).map(function (o) {
                return o.finalizerIdx;
            });
        }

        function createFakeContentProviders (oContentProvidersConfig) {
            if (Object.keys(oContentProvidersConfig.create).length !== 1) {
                throw new Error("Only one method must be used to create a provider");
            }

            var aProviderGetSiteImplementations;
            if (oContentProvidersConfig.create.fromGetSiteImplementations) {
                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromGetSiteImplementations;
            } else if (oContentProvidersConfig.create.fromRawReturnValues) {
                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromRawReturnValues.map(function (vRawReturnValue) {
                    return function () {
                        return vRawReturnValue;
                    };
                });
            } else if (oContentProvidersConfig.create.fromSiteOrErrors) {
                /*
                 * We want to control the order in which promises are finalized based on the configured finalizeGetSitePromiseOrder if any.
                 * So we collect bound promise callbacks in this array which we process after the last promise is added to it.
                 */
                var aGetSiteFinalizers = [];

                var aResolveOrder = determineResolveOrder(
                    oContentProvidersConfig.finalizeGetSitePromiseOrder,
                    oContentProvidersConfig.create.fromSiteOrErrors.length
                );

                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromSiteOrErrors.map(function (vSiteOrError) {
                    return function () {
                        return new Promise(function (fnResolve, fnReject) {
                            var fnFinalizer;
                            if (typeof vSiteOrError === "string") {
                                fnFinalizer = fnReject.bind(null, vSiteOrError);
                            } else {
                                fnFinalizer = fnResolve.bind(null, vSiteOrError);
                            }

                            // add to finalizers
                            aGetSiteFinalizers.push(fnFinalizer);

                            // attempt to resolve items asynchronously if possible
                            while (aResolveOrder.length > 0 && aResolveOrder[0] < aGetSiteFinalizers.length) {
                                setTimeout(aGetSiteFinalizers[aResolveOrder[0]], 0);
                                aResolveOrder.shift();
                            }
                        });
                    };
                });
            } else {
                throw new Error("Please specify known creation method");
            }

            var bFixedProviderIds = oContentProvidersConfig.ids === "auto";
            if (!bFixedProviderIds && Object.prototype.toString.apply(oContentProvidersConfig.ids) !== "[object Array]") {
                throw new Error("expected array or 'auto' for ids option. Got " + JSON.stringify(oContentProvidersConfig, null, 3));
            }

            var aContentProviderIds;
            if (bFixedProviderIds) {
                var iTotalContentProviders = aProviderGetSiteImplementations.length;
                aContentProviderIds = Array(iTotalContentProviders).join().split(",").map(function (aIds, iIdx) {
                    return "Provider" + (iIdx + 1);
                });
            } else {
                aContentProviderIds = oContentProvidersConfig.ids;
            }

            return aProviderGetSiteImplementations.map(function (fnGetSiteImplementation, iIdx) {
                return {
                    providerId: aContentProviderIds[iIdx],
                    provider: {
                        getSite: fnGetSiteImplementation
                    }
                };
            });
        }

        function createFakePluginManager (oCommonDataModelService, aContentProvidersDesc) {
            return {
                loadPlugins: function () {
                    aContentProvidersDesc.forEach(function (oContentProviderDesc) {
                        oCommonDataModelService.registerContentProvider(
                            oContentProviderDesc.providerId,
                            oContentProviderDesc.provider
                        );
                    });

                    return new jQuery.Deferred().resolve().promise();
                }
            };
        }

        function createCommonDataModelService (bAssumeSiteIsValid) {
            var oMockAdapter;

            oMockAdapter = {
                getSite: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                }
            };

            var oCommonDataModelService = new CommonDataModel(oMockAdapter);

            if (bAssumeSiteIsValid) {
                sinon.stub(oCommonDataModelService, "_getUnreferencedCatalogApplications")
                    .returns({});
            }

            return oCommonDataModelService;
        }

        /**
         * Performs 'arrange' operations common for multiple tests
         *
         * @param {object} oCommonDataModelService An object representing the CommonDataModel service
         * @param {object} oContentProvidersConfig Instructions on how to create multiple content providers. This is an object like:
         *   <pre>
         *   {
         *     ids: "auto" // or array of ids to use,
         *     finalizeGetSitePromiseOrder: [4, 1], // (optional) if provided causes the content providers to resolve/reject with the
         *                                          // extension site in the given order. In the example here, the first site
         *                                          // resolves (or rejects) after the second site (because 4 > 1).
         *                                          // This option is only effective when providers are created via // using 'fromSiteOrErrors'.
         *     create: {
         *       fromSiteOrErrors: [ // one provider per array item is created
         *         { ... },          // not a string: getSite promise resolves to this value
         *         "error"           // string: getSite promise rejects with this value
         *       ],
         *       fromRawReturnValues: [  // one provider per array item is created
         *         // raw return value of 1st provider's getSite
         *         // ... and so on
         *       ],
         *       fromRawGetSiteMocks: [
         *         // implementation of getSite
         *       ]
         *     }
         *   }
         *   </pre>
         */
        function commonArrange (oCommonDataModelService, oContentProvidersConfig) {
            var oFakeContentProviders = createFakeContentProviders(oContentProvidersConfig);
            var oFakePluginManager = createFakePluginManager(oCommonDataModelService, oFakeContentProviders);
            var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
            oGetServiceStub.withArgs("PluginManager").returns(oFakePluginManager);
            oGetServiceStub.throws("#getService was called on an unstubbed service in test");
        }

        // These tests ensure that getExtensionSites behaves as expected for different behaviors of loadContentProviderPlugins.
        [{
            testDescription: "provider successfully provides an extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {fromSiteOrErrors: [{SITE_FROM: "Provider 1"}]}
            },
            expectedExtensionSites: [{
                providerId: "Provider1",
                site: {SITE_FROM: "Provider 1"},
                success: true
            }]
        }, {
            testDescription: "provider fails to provide an extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {fromSiteOrErrors: ["intentionally failed"]} // failing site provided as string
            },
            expectedExtensionSites: [{
                providerId: "Provider1",
                error: "intentionally failed",
                success: false
            }]
        }, {
            testDescription: "some provider fail to provider extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromSiteOrErrors: [
                        {SITE_FROM: "Provider 1"},
                        "intentionally failed A",
                        "intentionally failed B"
                    ]
                }
            },
            expectedExtensionSites: [
                {
                    providerId: "Provider1",
                    site: {SITE_FROM: "Provider 1"},
                    success: true
                }, {
                    providerId: "Provider2",
                    error: "intentionally failed A",
                    success: false
                }, {
                    providerId: "Provider3",
                    error: "intentionally failed B",
                    success: false
                }
            ]
        }, {
            testDescription: "no content providers exist",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {fromSiteOrErrors: []}
            },
            expectedExtensionSites: []
        }, {
            testDescription: "content provider's getSite returns something different than a promise",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromRawReturnValues: [
                        "something else than a promise",
                        undefined,
                        null
                    ]
                }
            },
            expectedExtensionSites: [
                {
                    providerId: "Provider1",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }, {
                    providerId: "Provider2",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }, {
                    providerId: "Provider3",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }
            ]
        }, {
            testDescription: "content provider's getSite throws",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromGetSiteImplementations: [
                        function () { // getSite
                            throw new Error("something bad happened in the plugin");
                        }
                    ]
                }
            },
            expectedExtensionSites: [{
                error: "call to getSite failed: Error: something bad happened in the plugin",
                providerId: "Provider1",
                success: false
            }]
        }].forEach(function (oFixture) {
            QUnit.test("getExtensionSites: resolves promise as expected when " + oFixture.testDescription, function (assert) {
                var oCommonDataModelService = createCommonDataModelService(true /* bAssumeSiteIsValid */),
                    fnDone = assert.async();
                commonArrange(oCommonDataModelService, oFixture.oContentProvidersSpecs);

                oCommonDataModelService.getExtensionSites()
                    .done(function (aExtensionSites) {
                        assert.ok(true, "the promise was resolved");

                        assert.deepEqual(aExtensionSites, oFixture.expectedExtensionSites,
                            "obtained the expected results");

                        var aSitesFromContentProviders = oFixture.oContentProvidersSpecs.create.fromSiteOrErrors;
                        if (aSitesFromContentProviders) {
                            aExtensionSites.forEach(function (oExtensionSite, iIdx) {
                                if (oExtensionSite.success) {
                                    assert.notStrictEqual(
                                        oExtensionSite.site,
                                        aSitesFromContentProviders[iIdx],
                                        "the extension site was cloned. DEBUG: site index: " + iIdx
                                    );
                                }
                            });
                        }
                    })
                    .fail(function () {
                        assert.ok(false, "the promise was resolved");
                    })
                    .always(fnDone);
            });

            QUnit.test("getExtensionSites: notifies progress of successfully-loaded extension sites only when " + oFixture.testDescription, function (assert) {
                var aExtensionSitesFromProgress,
                    oCommonDataModelService = createCommonDataModelService(true /* bAssumeSiteIsValid */),
                    fnDone = assert.async();

                commonArrange(oCommonDataModelService, oFixture.oContentProvidersSpecs);

                aExtensionSitesFromProgress = [];

                oCommonDataModelService.getExtensionSites()
                    .progress(function (oExtensionSite) {
                        aExtensionSitesFromProgress.push(oExtensionSite);
                    })
                    .done(function (/*aExtensionSites*/) {
                        var bAllSuccessful = aExtensionSitesFromProgress.every(function (oExtensionSite) {
                            return oExtensionSite.success === true;
                        });

                        assert.strictEqual(bAllSuccessful, true,
                            "no errors are contained in extension sites notified via promise progress");

                        var iNumSuccessful = oFixture.expectedExtensionSites.filter(function (oExpectedExtensionSite) {
                            return oExpectedExtensionSite.success === true;
                        }).length;

                        assert.strictEqual(aExtensionSitesFromProgress.length, iNumSuccessful,
                            "the expected number of sites were notified");
                    })
                    .always(fnDone);
            });
        });

        [{
            testDescription: "two content providers register sites that resolve in reverse order",
            testFinalizeGetSitePromiseOrder: [1, 0],
            aSiteContentProviderIds: [
                "ProviderId1", // first site
                "ProviderId2" // second site
            ],
            aSitesFromContentProviders: [
                { // first site
                    catalogs: {MyCatalog1: {payload: {appDescriptors: [{id: "app1"}]}}},
                    applications: {somethingElse: {"sap.app": {id: "app1"}}}
                },
                { // second site
                    catalogs: {MyCatalog2: {payload: {appDescriptors: [{id: "app2"}]}}},
                    applications: {somethingElse: {"sap.app": {id: "app2"}}}
                }
            ],
            expectedErrorLogCalls: [],
            expectedExtensionSites: [
                {
                    providerId: "ProviderId1",
                    success: true,
                    site: {
                        catalogs: {MyCatalog1: {payload: {appDescriptors: [{id: "app1"}]}}},
                        applications: {somethingElse: {"sap.app": {id: "app1"}}}
                    }
                }, {
                    providerId: "ProviderId2",
                    success: true,
                    site: {
                        catalogs: {MyCatalog2: {payload: {appDescriptors: [{id: "app2"}]}}},
                        applications: {somethingElse: {"sap.app": {id: "app2"}}}
                    }
                }
            ]
        }, {
            testDescription: "two different content providers register their site with the same id",
            aSiteContentProviderIds: [
                "ProviderId", // first site
                "ProviderId" // second site
            ],
            aSitesFromContentProviders: [
                { // first site
                    catalogs: {MyCatalog1: {payload: {appDescriptors: [{id: "app1"}]}}},
                    applications: {somethingElse: {"sap.app": {id: "app1"}}}
                },
                { // second site
                    catalogs: {MyCatalog2: {payload: {appDescriptors: [{id: "app2"}]}}},
                    applications: {somethingElse: {"sap.app": {id: "app2"}}}
                }
            ],
            expectedErrorLogCalls: ["a content provider with ID 'ProviderId' is already registered"],
            expectedExtensionSites: [{
                providerId: "ProviderId",
                success: true,
                site: {
                    catalogs: {MyCatalog1: {payload: {appDescriptors: [{id: "app1"}]}}},
                    applications: {somethingElse: {"sap.app": {id: "app1"}}}
                }
            }]
        }, {
            testDescription: "a site with a tile that doesn't belong to site.applications is provided",
            aSitesFromContentProviders: [{
                catalogs: {MyCatalog: {payload: {appDescriptors: [{id: "sap.nonexisting.app"}]}}},
                applications: {somethingElse: {"sap.app": {id: "somethingElse"}}}
            }],
            expectedErrorLogCalls: [
                "One or more apps from Provider1 content provider are not listed among the applications section of the extended site" +
                " and will be discarded - From catalog 'MyCatalog': 'sap.nonexisting.app'"
            ],
            expectedExtensionSites: [{
                providerId: "Provider1",
                success: true,
                site: {
                    catalogs: {MyCatalog: {payload: {appDescriptors: []}}},
                    applications: {somethingElse: {"sap.app": {id: "somethingElse"}}}
                }
            }]
        }, {
            testDescription: "a site with multiple tiles from different catalogs that don't belong to site.applications is provided",
            aSitesFromContentProviders: [{
                catalogs: {
                    MyCatalog1: {payload: {appDescriptors: [{id: "sap.nonexisting.app1"}]}},
                    MyCatalog2: {
                        payload: {
                            appDescriptors: [
                                {id: "sap.nonexisting.app2"},
                                {id: "sap.nonexisting.app3"},
                                {id: "existing.app"}
                            ]
                        }
                    }
                },
                applications: {somethingElse: {"sap.app": {id: "existing.app"}}}
            }],
            expectedErrorLogCalls: [
                "One or more apps from Provider1 content provider are not listed among the applications section of the extended site" +
                " and will be discarded - From catalog 'MyCatalog1': 'sap.nonexisting.app1'; From catalog 'MyCatalog2': 'sap.nonexisting.app2', 'sap.nonexisting.app3'"
            ],
            expectedExtensionSites: [{
                success: true,
                providerId: "Provider1",
                site: {
                    catalogs: {
                        MyCatalog1: {payload: {appDescriptors: []}},
                        MyCatalog2: {payload: {appDescriptors: [{id: "existing.app"}]}}
                    },
                    applications: {somethingElse: {"sap.app": {id: "existing.app"}}}
                }
            }]
        }].forEach(function (oFixture) {
            QUnit.test("getExtensionSites: resolves promise as expected when " + oFixture.testDescription, function (assert) {
                var oCommonDataModelService = createCommonDataModelService(false /* bAssumeSiteIsValid */),
                    fnDone = assert.async();
                commonArrange(oCommonDataModelService, {
                    ids: oFixture.aSiteContentProviderIds || "auto",
                    finalizeGetSitePromiseOrder: oFixture.testFinalizeGetSitePromiseOrder || oFixture.aSitesFromContentProviders.map(function (o, iIdx) {
                        return iIdx;
                    }),
                    create: {fromSiteOrErrors: oFixture.aSitesFromContentProviders}
                });

                sinon.stub(jQuery.sap.log, "error");

                oCommonDataModelService.getExtensionSites()
                    .done(function (aExtensionSites) {
                        assert.ok(true, "the promise was resolved");

                        assert.deepEqual(aExtensionSites, oFixture.expectedExtensionSites,
                            "obtained the expected results");
                    })
                    .fail(function () {
                        assert.ok(false, "the promise was resolved");
                    })
                    .always(function () {
                        assert.strictEqual(
                            jQuery.sap.log.error.callCount,
                            oFixture.expectedErrorLogCalls.length,
                            "jQuery.sap.log.error was called the expected number of times"
                        );

                        oFixture.expectedErrorLogCalls.forEach(function (sErrorMessage, iIdx) {
                            assert.deepEqual(jQuery.sap.log.error.getCall(iIdx).args, [
                                sErrorMessage,
                                null,
                                "sap.ushell.services.CommonDataModel"
                            ], "call #" + (iIdx + 1) + " of jQuery.sap.log.error was made with the expected error");
                        });

                        fnDone();
                    });
            });
        });

        // Begin of test for method "_applyRemainingProperties":
        // testDescription: completes sentence like "Does something WHEN ...":
        [{
            testDescription: "a group is undefined",
            oOriginalSite: {groups: {foobar: undefined}},
            expectedChangedOriginalSite: {groups: {}}
        }, {
            testDescription: "payload is undefined",
            oOriginalSite: {groups: {foobar: {}}},
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "all properties are missing",
            oOriginalSite: {groups: {foobar: {payload: {}}}},
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "one property is missing",
            oOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"]
                        }
                    }
                }
            },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: []
                        }
                    }
                }
            }
        }, {
            testDescription: "all properties are set",
            oOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            },
            expectedChangedOriginalSite: {
                groups: {
                    foobar: {
                        payload: {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            }
        }].forEach(function (oFixture) {
            QUnit.test("_applyRemainingProperties: Correctly initialise empty properties when  " + oFixture.testDescription, function (assert) {
                var oCDM = sap.ushell.Container.getService("CommonDataModel");

                sinon.spy(oCDM, "_ensureCompleteSite");
                oCDM._ensureCompleteSite(oFixture.oOriginalSite);
                assert.deepEqual(
                    oFixture.oOriginalSite,
                    oFixture.expectedChangedOriginalSite,
                    "correctly initialised empty properties in Original site"
                );
                oCDM._ensureCompleteSite.restore();
            });
        });
    })();

    QUnit.test("_ensureGroupsOrder: remove first groups order entry if the group is not available", function (assert) {
        var oCDMService = sap.ushell.Container.getService("CommonDataModel"),
            oSite = {
                site: {payload: {groupsOrder: ["a", "b", "c"]}},
                groups: {
                    b: {},
                    c: {}
                }
            },
            aExpectedGroupsOrder = ["b", "c"];

        oSite = oCDMService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });

    QUnit.test("_ensureGroupsOrder: remove last groups order entry if the group is not available", function (assert) {
        var oCDMService = sap.ushell.Container.getService("CommonDataModel"),
            oSite = {
                site: {payload: {groupsOrder: ["a", "b", "c"]}},
                groups: {
                    a: {},
                    b: {}
                }
            },
            aExpectedGroupsOrder = ["a", "b"];

        oSite = oCDMService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });

    QUnit.module("getMenuEntries", {
        beforeEach: function () {
            this.sMenuKeyMock = "main";
            this.oSiteMock = {
                menus: {
                    main: {
                        identification: {
                            id: "main"
                        },
                        payload: {
                            menuEntries: [
                                {
                                    id: "space01",
                                    title: "Space 1",
                                    description: "Description of space 1",
                                    icon: "sap-icon://syringe",
                                    type: "intent",
                                    target: {
                                        semanticObject: "Launchpad",
                                        action: "openFLPPage",
                                        parameters: [
                                            {
                                                name: "pageId",
                                                value: "page1"
                                            },
                                            {
                                                name: "spaceId",
                                                value: "space01"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            };
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sinon.stub().returns(this.oGetSiteDeferred)
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
            this.oCDMService._oSiteDeferred.resolve(this.oSiteMock);
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns array of menuEntries", function (assert) {
        //Act
        return this.oCDMService.getMenuEntries(this.sMenuKeyMock).then(function (aMenuEntries) {
            //Assert
            assert.deepEqual(aMenuEntries, this.oSiteMock.menus[this.sMenuKeyMock].payload.menuEntries, "correct array was returned");
            assert.notStrictEqual(aMenuEntries, this.oSiteMock.menus[this.sMenuKeyMock].payload.menuEntries, "menuEntries were cloned");
        }.bind(this));
    });

    QUnit.test("Returns empty array of if menu is not available", function (assert) {
        //Act
        return this.oCDMService.getMenuEntries("nonAvailableMenu").then(function (aMenuEntries) {
            //Assert
            assert.deepEqual(aMenuEntries, [], "empty array was returned");
        });
    });

    QUnit.module("getContentProviderIds", {
        beforeEach: function () {
            this.oFirstApplication = {id: "first"};
            this.oSecondApplication = {id: "second"};

            this.oSiteMock = {
                systemAliases: {
                    firstSystemAlias: {},
                    secondSystemAlias: {},
                    thirdSystemAlias: {}
                },
                applications: {
                    firstApplication: this.oFirstApplication,
                    secondApplication: this.oSecondApplication
                }
            };
            this.oGetSiteDeferred = new jQuery.Deferred();
            this.oMockAdapter = {
                getSite: sinon.stub().returns(this.oGetSiteDeferred)
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
            this.oCDMService._oSiteDeferred.resolve(this.oSiteMock);

            this.getContentProviderIdStub = sandbox.stub(readApplications, "getContentProviderId");
            this.getContentProviderIdStub.withArgs(this.oFirstApplication).returns("firstSystemAlias");
            this.getContentProviderIdStub.withArgs(this.oSecondApplication).returns("secondSystemAlias");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Returns an array of contentProviderIds", function (assert) {
        // Arrange
        var oExpectedResult = ["firstSystemAlias", "secondSystemAlias"];

        // Act
        return this.oCDMService.getContentProviderIds().then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "The right result was returned");
            assert.strictEqual(this.getContentProviderIdStub.callCount, 2, "getContentProviderId was called exactly twice");
            assert.deepEqual(this.getContentProviderIdStub.getCall(0).args, [this.oFirstApplication], "getContentProviderId was called with the right args");
            assert.deepEqual(this.getContentProviderIdStub.getCall(1).args, [this.oSecondApplication], "getContentProviderId was called with the right args");
        }.bind(this));
    });

    QUnit.module("The method _ensureProperDisplayFormats", {
        beforeEach: function () {
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(new jQuery.Deferred())
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("converts the display formats of the site object to the current standards in a site with pages and spaces", function (assert) {
        // Arrange
        this.oSiteMock = {
            vizTypes: {
                vizType1: {
                    "sap.flp": {
                        vizOptions: {
                            displayFormats: {
                                supported: [ "standard", "link", "flat", "standardWide" ],
                                default: "standard"
                            }
                        }
                    }
                }
            },
            pages: {
                page1: {
                    payload: {
                        sections: {
                            section1: {
                                viz: {
                                    viz1: {
                                        displayFormatHint: "standard"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        this.oCDMService._oOriginalSite = this.oSiteMock;
        // Act
        var oSite = this.oCDMService._oOriginalSite;
        this.oCDMService._ensureProperDisplayFormats(this.oCDMService._oOriginalSite);
        // Assert
        assert.deepEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.supported, [
            "standard", "compact", "flat", "standardWide"
        ], "The supported display formats have been correctly converted");
        assert.strictEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.default, "standard", "The default display format was left untouched as it is the current standard");
        assert.strictEqual(oSite.pages.page1.payload.sections.section1.viz.viz1.displayFormatHint, "standard", "The displayFormatHint of the viz was correctly converted");
    });

    QUnit.test("converts the display formats of the site object to the current standards in a site with groups", function (assert) {
        // Arrange
        this.oSiteMock = {
            vizTypes: {
                vizType1: {
                    "sap.flp": {
                        vizOptions: {
                            displayFormats: {
                                supported: ["standard", "link", "flat", "standardWide"],
                                default: "link"
                            }
                        }
                    }
                }
            },
            groups: {
                group1: {
                    payload: {
                        tiles: [{
                            displayFormatHint: "standard"
                        }]
                    }
                }
            }
        };
        this.oCDMService._oOriginalSite = this.oSiteMock;
        // Act
        var oSite = this.oCDMService._oOriginalSite;
        this.oCDMService._ensureProperDisplayFormats(this.oCDMService._oOriginalSite);
        // Assert
        assert.deepEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.supported, [
            "standard", "compact", "flat", "standardWide"
        ], "The supported display formats have been correctly converted");
        assert.strictEqual(oSite.vizTypes.vizType1["sap.flp"].vizOptions.displayFormats.default, "compact", "The default display format was correctly converted");
        assert.strictEqual(oSite.groups.group1.payload.tiles[0].displayFormatHint, "standard", "The displayFormatHint of the viz was correctly converted");
    });

    QUnit.module("the method _mapDisplayFormats", {
        beforeEach: function () {
            this.oMockAdapter = {
                getSite: sandbox.stub().returns(new jQuery.Deferred())
            };
            this.oCDMService = new CommonDataModel(this.oMockAdapter);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an array of converted displayFormats", function (assert) {
        // Arrange
        var aInputDisplayFormats = ["standard", "tile", "link", "compact", "flat", "flatWide", "standardWide"];
        var aExpectedDisplayFormats = ["standard", "standard", "compact", "compact", "flat", "flatWide", "standardWide"];
        // Act
        var aResultingDisplayFormats = this.oCDMService._mapDisplayFormats(aInputDisplayFormats);
        // Assert
        assert.deepEqual(aResultingDisplayFormats, aExpectedDisplayFormats, "The array of displayFormats was correctly converted");
    });
});
