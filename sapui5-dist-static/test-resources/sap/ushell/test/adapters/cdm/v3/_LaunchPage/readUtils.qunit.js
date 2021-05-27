// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readUtils
 */
/* global QUnit sinon*/
sap.ui.require([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readUtils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome",
    "sap/ushell/adapters/cdm/v3/utilsCdm",
    "sap/ushell/Config"
], function (
    readUtils,
    readVisualizations,
    readApplications,
    readHome,
    utilsCdm,
    Config
) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.module("getVizData method", {
        beforeEach: function () {
            this.oSiteMock = {
                id: "site",
                applications: {
                    id: "applications"
                }
            };
            this.oVizRefMock = {
                id: "vizRef",
                subtitle: "subTitle",
                displayFormatHint: "compact"
            };
            this.oVizMock = {
                id: "viz"
            };
            this.sVizIdMock = "vizRef";
            this.aCdmPartsMock = [];

            this.oUrlParsingMock = {
                id: "URLParsing"
            };

            this.oToTargetFromHashStub = sandbox.stub(utilsCdm, "toTargetFromHash");
            this.oToTargetFromHashStub.withArgs("#Action-toSample", this.oUrlParsingMock).returns({id: "target"});
            this.oToHashFromVizDataStub = sandbox.stub(utilsCdm, "toHashFromVizData");
            this.oToHashFromVizDataStub.withArgs(sinon.match.any, this.oSiteMock.applications, this.oUrlParsingMock).returns("#Action-toSample");

            this.oGetCdmPartsStub = sandbox.stub(readUtils, "getCdmParts");
            this.oGetCdmPartsStub.withArgs(this.oSiteMock, this.oVizRefMock).returns(this.aCdmPartsMock);
            this.oGetStub = sandbox.stub(readVisualizations, "get");
            this.oGetStub.withArgs(this.oSiteMock, this.sVizIdMock).returns(this.oVizMock);
            this.oGetTypeIdStub = sandbox.stub(readVisualizations, "getTypeId");
            this.oGetTypeIdStub.withArgs(this.oVizMock).returns("typeId");
            this.oGetTypeStub = sandbox.stub(readVisualizations, "getType");
            this.oGetTypeStub.withArgs(this.oSiteMock, sinon.match.any).callsFake(function (oSite, sTypeId) {
                return {
                    typeId: sTypeId
                };
            });
            this.oGetTitleStub = sandbox.stub(readVisualizations, "getTitle");
            this.oGetTitleStub.withArgs(this.aCdmPartsMock).returns("title");
            this.oGetSubTitleStub = sandbox.stub(readVisualizations, "getSubTitle");
            this.oGetSubTitleStub.withArgs(this.aCdmPartsMock).returns("subTitle");
            this.oGetIconStub = sandbox.stub(readVisualizations, "getIcon");
            this.oGetIconStub.withArgs(this.aCdmPartsMock).returns("icon");
            this.oGetKeywordsStub = sandbox.stub(readVisualizations, "getKeywords");
            this.oGetKeywordsStub.withArgs(this.aCdmPartsMock).returns(["keywords"]);
            this.oGetInfoStub = sandbox.stub(readVisualizations, "getInfo");
            this.oGetInfoStub.withArgs(this.aCdmPartsMock).returns("info");
            this.oGetNumberUnitStub = sandbox.stub(readVisualizations, "getNumberUnit");
            this.oGetNumberUnitStub.withArgs(this.aCdmPartsMock).returns("numberUnit");
            this.oGetTargetStub = sandbox.stub(readVisualizations, "getTarget");
            this.oGetTargetStub.withArgs(this.oVizMock).returns({id: "target"});

            this.oGetTileVizIdStub = sandbox.stub(readHome, "getTileVizId");
            this.oGetTileVizIdStub.withArgs(this.oVizRefMock).returns(this.sVizIdMock);
            this.oGetTileIdStub = sandbox.stub(readHome, "getTileId");
            this.oGetTileIdStub.withArgs(this.oVizRefMock).returns("tileId");
            this.oGetInstantiationDataStub = sandbox.stub(readVisualizations, "getInstantiationData");
            this.oGetInstantiationDataStub.withArgs(this.oVizMock).returns({ instantiation: "data"});
            this.oGetIndicatorDataSourceStub = sandbox.stub(readVisualizations, "getIndicatorDataSource");
            this.oGetIndicatorDataSourceStub.withArgs(this.oVizMock).returns({ indicator: "DataSource"});
            this.oGetContentProviderIdStub = sandbox.stub(readApplications, "getContentProviderId");
            this.oGetContentProviderIdStub.returns("contentProviderId");
            this.oHarmonizeTargetStub = sandbox.stub(readUtils, "harmonizeTarget");
            this.oHarmonizeTargetStub.callsFake(function (oTarget) {
                if (oTarget.id) {
                    oTarget.id = "harmonized" + oTarget.id;
                    return oTarget;
                }
                return oTarget;
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns correct result with all properties and references available", function (assert) {
        // Arrange
        var oExpectedResult = {
            id: "tileId",
            vizId: "vizRef",
            vizType: "typeId",
            vizConfig: {},
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            keywords: ["keywords"],
            numberUnit: "numberUnit",
            info: "info",
            target: {id: "harmonizedtarget"},
            indicatorDataSource: {indicator: "DataSource"},
            isBookmark: false,
            contentProviderId: "contentProviderId",
            _instantiationData: {instantiation: "data"},
            targetURL: "#Action-toSample",
            displayFormatHint: "compact"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSiteMock, this.oVizRefMock, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns correct default values", function (assert) {
        // Arrange
        var oExpectedResult = {
            id: undefined,
            vizId: "",
            vizType: "",
            vizConfig: {},
            title: "",
            subtitle: "",
            icon: "",
            keywords: [],
            info: "",
            numberUnit: undefined,
            target: {},
            indicatorDataSource: undefined,
            isBookmark: false,
            contentProviderId: "contentProviderId",
            _instantiationData: {
                platform: "CDM",
                vizType: undefined
            },
            targetURL: undefined,
            displayFormatHint: undefined
        };
        // Act
        var oResult = readUtils.getVizData({}, {}, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Evaluates the target in the vizRef before the target in the visualization", function (assert) {
        this.oVizRefMock.target = {
            id: "vizRefTarget"
        };
        var oExpectedResult = {
            id: "tileId",
            vizId: "vizRef",
            vizType: "typeId",
            vizConfig: {},
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            keywords: ["keywords"],
            info: "info",
            numberUnit: "numberUnit",
            target: {id: "harmonizedvizRefTarget"},
            indicatorDataSource: {indicator: "DataSource"},
            isBookmark: false,
            _instantiationData: { instantiation: "data" },
            contentProviderId: "contentProviderId",
            targetURL: "#Action-toSample",
            displayFormatHint: "compact"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSiteMock, this.oVizRefMock, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Sets default content provider id if it is not present", function (assert) {
        // Arrange
        this.oGetContentProviderIdStub.returns();
        var oExpectedResult = {
            id: "tileId",
            vizId: "vizRef",
            vizType: "typeId",
            vizConfig: {},
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            keywords: ["keywords"],
            info: "info",
            numberUnit: "numberUnit",
            target: {
                id: "harmonizedtarget"
            },
            indicatorDataSource: {
                indicator: "DataSource"
            },
            isBookmark: false,
            contentProviderId: "",
            _instantiationData: {
                instantiation: "data"
            },
            targetURL: "#Action-toSample",
            displayFormatHint: "compact"
        };
        // Act
        var oResult = readUtils.getVizData(this.oSiteMock, this.oVizRefMock, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns correct result for old bookmarks in vizReference", function (assert) {
        // Arrange
        var oVizRefMock = {
            id: "vizRef",
            isBookmark: true,
            url: "#Action-toSample",
            subtitle: "subTitle"
        };
        var oExpectedVizRef = {
            id: "vizRef",
            isBookmark: true,
            url: "#Action-toSample",
            target: {
                id: "target"
            },
            subtitle: "subTitle",
            subTitle: "subTitle"
        };
        this.oGetCdmPartsStub.withArgs(this.oSiteMock, oExpectedVizRef).returns(this.aCdmPartsMock);
        this.oGetTileIdStub.withArgs(oExpectedVizRef).returns("tileId");

        var oExpectedResult = {
            id: "tileId",
            vizId: "",
            vizType: "sap.ushell.StaticAppLauncher",
            vizConfig: {},
            title: "title",
            subtitle: "subTitle",
            icon: "icon",
            keywords: ["keywords"],
            info: "info",
            numberUnit: "numberUnit",
            target: {id: "harmonizedtarget"},
            indicatorDataSource: undefined,
            contentProviderId: "contentProviderId",
            isBookmark: true,
            _instantiationData: {
                platform: "CDM",
                vizType: {
                  typeId: "sap.ushell.StaticAppLauncher"
                }
            },
            targetURL: "#Action-toSample",
            displayFormatHint: undefined
        };
        // Act
        var oResult = readUtils.getVizData(this.oSiteMock, oVizRefMock, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Calls _addBookmarkInstantiationData for bookmarks", function (assert) {
        // Arrange
        var oAddBookmarkVizDataSpy = sandbox.spy(readUtils, "_addBookmarkInstantiationData");
        this.oVizRefMock.isBookmark = true;
        // Act
        readUtils.getVizData(this.oSiteMock, this.oVizRefMock, this.oUrlParsingMock);
        // Assert
        assert.deepEqual(oAddBookmarkVizDataSpy.callCount, 1, "_addBookmarkInstantiationData was called once");
    });

    QUnit.test("Gets that data source if the indicator data source has one specified", function (assert) {
        // Arrange
        this.oGetIndicatorDataSourceStub.withArgs(this.oVizMock).returns({
            indicator: "DataSource",
            dataSource: "dataSource001"
        });
        this.oGetDataSourceStub = sandbox.stub(readVisualizations, "getDataSource");
        this.oGetDataSourceStub.withArgs(this.aCdmPartsMock, "dataSource001").returns({ uri: "/testpath/"});

        var oExpectedDataSource = {
            uri: "/testpath/"
        };

        // Act
        var oResult = readUtils.getVizData(this.oSiteMock, this.oVizRefMock, this.oUrlParsingMock);

        // Assert
        assert.deepEqual(oResult.dataSource, oExpectedDataSource, "The datasource was added.");
    });

    QUnit.module("getVizRef method");

    QUnit.test("Returns the correct result for standard vizData", function (assert) {
        // Arrange
        var oVizData = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subtitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            _instantiationData: "ShouldBeFilteredOut",
            displayFormatHint: "flat"
        };
        var oExpectedResult = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subTitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            displayFormatHint: "flat"
        };
        // Act
        var oResult = readUtils.getVizRef(oVizData);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns the correct result for standard bookmark vizData", function (assert) {
         // Arrange
        var oVizData = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subtitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            _instantiationData: "ShouldBeFilteredOut",
            isBookmark: true,
            vizType: "some.standard.viz.type",
            displayFormatHint: "flat"
        };
        var oExpectedResult = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subTitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            isBookmark: true,
            displayFormatHint: "flat"
        };
        // Act
        var oResult = readUtils.getVizRef(oVizData);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns the correct result for custom bookmark vizData", function (assert) {
        // Arrange
        var oVizData = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subtitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            _instantiationData: "ShouldBeFilteredOut",
            isBookmark: true,
            vizType: "some.custom.viz.type",
            vizConfig: {
                id: "vizConfig"
            },
            displayFormatHint: "flat"
        };
        var oExpectedResult = {
            id: "id",
            vizId: "vizId",
            title: "title",
            subTitle: "subtitle",
            icon: "icon",
            keywords: "keywords",
            info: "info",
            numberUnit: "numberUnit",
            target: "target",
            indicatorDataSource: "indicatorDataSource",
            contentProviderId: "contentProviderId",
            isBookmark: true,
            vizType: "some.custom.viz.type",
            vizConfig: {
                id: "vizConfig"
            },
            displayFormatHint: "flat"
        };
       // Act
       var oResult = readUtils.getVizRef(oVizData);
       // Assert
       assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
   });

    QUnit.module("getCdmParts method", {
        beforeEach: function () {
            //On the "this" reference
            this.oGetStub = sinon.stub(readVisualizations, "get");
            this.oGetConfigStub = sinon.stub(readVisualizations, "getConfig");
            this.oGetAppIdStub = sinon.stub(readVisualizations, "getAppId");
            this.oGetAppDescriptorStub = sinon.stub(readVisualizations, "getAppDescriptor");
            this.oGetInboundIdStub = sinon.stub(readVisualizations, "getInboundId");

            //On the readHome object
            this.oGetTileVizIdStub = sinon.stub(readHome, "getTileVizId");
            this.oGetInboundStub = sinon.stub(readApplications, "getInbound");

            this.sMockSite = "sMockSite";
            this.sMockTile = "sMockTile";
            this.aExpectedResult = [this.sMockTile, "oGetConfigStub", "oGetInboundStub", "oGetAppDescriptorStub"];

            //On the "this" reference
            this.oGetStub.withArgs(this.sMockSite, "oGetTileVizIdStub").returns("oGetStub");
            this.oGetConfigStub.withArgs("oGetStub").returns("oGetConfigStub");
            this.oGetAppIdStub.withArgs("oGetStub").returns("oGetAppIdStub");
            this.oGetAppDescriptorStub.withArgs(this.sMockSite, "oGetAppIdStub").returns("oGetAppDescriptorStub");
            this.oGetInboundIdStub.withArgs("oGetStub").returns("oGetInboundIdStub");

            //On the readHome object
            this.oGetTileVizIdStub.withArgs(this.sMockTile).returns("oGetTileVizIdStub");
            this.oGetInboundStub.withArgs("oGetAppDescriptorStub", "oGetInboundIdStub").returns("oGetInboundStub");
        },
        afterEach: function () {
            //On the "this" reference
            this.oGetStub.restore();
            this.oGetConfigStub.restore();
            this.oGetAppIdStub.restore();
            this.oGetAppDescriptorStub.restore();
            this.oGetInboundIdStub.restore();

            //On the readHome object
            this.oGetTileVizIdStub.restore();
            this.oGetInboundStub.restore();
        }
    });

    QUnit.test("Calls the correct methods with correct parameters", function (assert) {
        //Arrange
        //Act
        var aResult = readUtils.getCdmParts(this.sMockSite, this.sMockTile);
        //Assert
        assert.deepEqual(aResult, this.aExpectedResult, "returns the correct result");
        //On the "this" reference
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.strictEqual(this.oGetConfigStub.callCount, 1, "getConfig was called once");
        assert.strictEqual(this.oGetAppIdStub.callCount, 1, "getAppId was called once");
        assert.strictEqual(this.oGetAppDescriptorStub.callCount, 1, "getAppDescriptor was called once");
        assert.strictEqual(this.oGetInboundIdStub.callCount, 1, "getInboundId was called once");

        //On the readHome object
        assert.strictEqual(this.oGetTileVizIdStub.callCount, 1, "getTileVizId was called once");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInboundId was called once");
    });

    QUnit.test("Calls the correct methods with correct parameters and missing applicationInbound", function (assert) {
        //Arrange
        this.aExpectedResult[2] = undefined;
        this.oGetInboundStub.withArgs("oGetAppDescriptorStub", "oGetInboundIdStub").returns();
        //Act
        var aResult = readUtils.getCdmParts(this.sMockSite, this.sMockTile);
        //Assert
        assert.deepEqual(aResult, this.aExpectedResult, "returns the correct result");
        //On the "this" reference
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.strictEqual(this.oGetConfigStub.callCount, 1, "getConfig was called once");
        assert.strictEqual(this.oGetAppIdStub.callCount, 1, "getAppId was called once");
        assert.strictEqual(this.oGetAppDescriptorStub.callCount, 1, "getAppDescriptor was called once");
        assert.strictEqual(this.oGetInboundIdStub.callCount, 1, "getInboundId was called once");

        //On the readHome object
        assert.strictEqual(this.oGetTileVizIdStub.callCount, 1, "getTileVizId was called once");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInboundId was called once");
    });

    QUnit.module("harmonizeTarget");

    QUnit.test("Returns the correct result for target with parameters in array structure", function (assert) {
        // Arrange
        var oTarget = {
            parameters: [
                {
                    name: "someParam",
                    value: "someValue"
                }
            ]
        };

        var oExpectedResult = {
            parameters: {
                someParam: {
                    value: {
                        value: "someValue",
                        format: "plain"
                    }
                }
            }
        };
        // Act
        var oResult = readUtils.harmonizeTarget(oTarget);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns the correct result for target with parameters in object structure", function (assert) {
        // Arrange
        var oTarget = {
            parameters: {
                someParam: {
                    value: {
                        value: "someValue",
                        format: "plain"
                    }
                }
            }
        };
        // Act
        var oResult = readUtils.harmonizeTarget(oTarget);
        // Assert
        assert.strictEqual(oResult, oTarget, "returned the correct result");
    });

    QUnit.test("Returns the correct result for target with parameters in array structure", function (assert) {
        // Arrange
        var oTarget = {
            parameters: [
                {
                    name: "someParam",
                    value: "someValue"
                },
                {
                    name: "someParam",
                    value: "someOtherValue"
                }
            ]
        };

        var oExpectedResult = {
            parameters: {
                someParam: {
                    value: {
                        value: ["someValue", "someOtherValue"],
                        format: "plain"
                    }
                }
            }
        };
        // Act
        var oResult = readUtils.harmonizeTarget(oTarget);
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "returned the correct result");
    });

    QUnit.test("Returns the correct result for target with parameters in object structure with multiple values for one parameter", function (assert) {
        // Arrange
        var oTarget = {
            parameters: {
                someParam: {
                    value: {
                        value: ["someValue", "someOtherValue"],
                        format: "plain"
                    }
                }
            }
        };
        // Act
        var oResult = readUtils.harmonizeTarget(oTarget);
        // Assert
        assert.strictEqual(oResult, oTarget, "returned the correct result");
    });

    QUnit.test("Returns the correct result for target without parameters", function (assert) {
        // Arrange
        var oTarget = {};
        // Act
        var oResult = readUtils.harmonizeTarget(oTarget);
        // Assert
        assert.strictEqual(oResult, oTarget, "returned the correct result");
    });

    QUnit.module("_addBookmarkInstantiationData", {
        beforeEach: function () {
            this.oSite = {
                id: "site"
            };
            this.oVizType = {
                id: "some.custom.viz.type"
            };

            this.oGetTypeStub = sandbox.stub(readVisualizations, "getType");
            this.oGetTypeStub.withArgs(this.oSite, this.oVizType.id).returns(this.oVizType);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Modifes the correct properties if standard static bookmark", function (assert) {
        // Arrange
        var oVizData = {
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            }
        };
        var oExpectedVizData = {
            indicatorDataSource: {
                path: undefined,
                refresh: undefined
            },
            vizType: "sap.ushell.StaticAppLauncher"
        };
        // Act
        readUtils._addBookmarkInstantiationData(oVizData, this.oSite);
        // Assert
        assert.deepEqual(oVizData, oExpectedVizData, "modified the correct vizData properties");
    });

    QUnit.test("Modifes the correct properties if standard dynamic bookmark", function (assert) {
        // Arrange
        var oVizData = {
            indicatorDataSource: {
                path: "/some/source.json",
                refresh: 60
            }
        };
        var oExpectedVizData = {
            indicatorDataSource: {
                path: "/some/source.json",
                refresh: 60
            },
            vizType: "sap.ushell.DynamicAppLauncher"
        };
        // Act
        readUtils._addBookmarkInstantiationData(oVizData, this.oSite);
        // Assert
        assert.deepEqual(oVizData, oExpectedVizData, "modified the correct vizData properties");
    });

    QUnit.test("Modifes the correct properties if custom bookmark and vizType available", function (assert) {
        // Arrange
        var oVizData = {
            vizType: "some.custom.viz.type",
            vizConfig: {
                id: "vizConfig"
            }
        };
        var oExpectedVizData = {
            vizType: "some.custom.viz.type",
            vizConfig: {
                id: "vizConfig"
            },
            _instantiationData: {
                platform: "CDM",
                vizType: {
                    id: "some.custom.viz.type"
                }
            }
        };
        // Act
        readUtils._addBookmarkInstantiationData(oVizData, this.oSite);
        // Assert
        assert.deepEqual(oVizData, oExpectedVizData, "modified the correct vizData properties");
    });

    QUnit.test("Modifes the correct properties if vizRef is a custom bookmark and vizType is not available", function (assert) {
        // Arrange
        var oVizData = {
            vizType: "non.existent.custom.viz.type",
            vizConfig: {
                id: "vizConfig",
                "sap.flp": {
                    chipConfig: {
                        chipId: "chipId"
                    }
                }
            }
        };
        var oExpectedVizData = {
            vizType: "non.existent.custom.viz.type",
            vizConfig: {
                id: "vizConfig",
                "sap.flp": {
                    chipConfig: {
                        chipId: "chipId"
                    }
                }
            },
            _instantiationData: {
                platform: "ABAP",
                chip: {
                    chipId: "chipId"
                },
                simplifiedChipFormat: true
            }
        };
        // Act
        readUtils._addBookmarkInstantiationData(oVizData, this.oSite);
        // Assert
        assert.deepEqual(oVizData, oExpectedVizData, "modified the correct vizData properties");
    });
});