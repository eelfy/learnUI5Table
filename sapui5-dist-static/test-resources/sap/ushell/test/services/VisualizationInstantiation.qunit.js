// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationInstantiation
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/library",
    "sap/ushell/services/VisualizationInstantiation",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceCdm",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceLink",
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceLaunchPage",
    "sap/ushell/EventHub"
], function (
    ushellLibrary,
    VisualizationInstantiation,
    VizInstance,
    VizInstanceAbap,
    VizInstanceCdm,
    VizInstanceLink,
    VizInstanceLaunchPage,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */

    var DisplayFormat = ushellLibrary.DisplayFormat;

    QUnit.start();
    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor");

    QUnit.test("Is properly executed", function (assert) {
        // Act
        var oVizInstService = new VisualizationInstantiation();

        // Assert
        assert.ok(oVizInstService instanceof VisualizationInstantiation, "Service was constructed correctly");
    });

    QUnit.module("The function instantiateVisualization", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            this.oGetImplementationAsSapui5Stub = sandbox.stub().resolves({});
            this.oCreateChipInstanceStub = sandbox.stub().resolves({
                getImplementationAsSapui5: this.oGetImplementationAsSapui5Stub
            });
            this.oGetFactoryStub = sandbox.stub().returns({
                createChipInstance: this.oCreateChipInstanceStub
            });
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container.getServiceAsync = this.oGetServiceAsyncStub;
            this.oGetServiceAsyncStub.withArgs("PageBuilding").resolves({
                getFactory: this.oGetFactoryStub
            });

            this.oVizInstanceSetTargetURLStub = sandbox.stub(VizInstance.prototype, "setTargetURL");
            this.oVizInstanceAbapLoadStub = sandbox.stub(VizInstanceAbap.prototype, "load").resolves();
            this.oVizInstanceCdmLoadStub = sandbox.stub(VizInstanceCdm.prototype, "load").resolves();
            this.oVizInstanceLinkLoadStub = sandbox.stub(VizInstanceLink.prototype, "load").resolves();
            this.oVizInstanceLaunchPageLoadStub = sandbox.stub(VizInstanceLaunchPage.prototype, "load");
            this.oVizInstanceLaunchPageLoadStub.resolves();

            var fnResolveEmit;
            this.oEmitPromise = new Promise(function (resolve) {
                fnResolveEmit = resolve;
            });
            this.oEmitStub = sandbox.stub(EventHub, "emit");
            this.oEmitStub.callsFake(function () {
                fnResolveEmit();
            });
            this.oVisualizationInstantiationService = new VisualizationInstantiation();

            this.oCleanInstantiationDataForLinkStub = sandbox.stub(this.oVisualizationInstantiationService, "_cleanInstantiationDataForLink");

            this.oStaticAppLauncherVizType = {
                "sap.app": {
                    id: "sap.ushell.components.tiles.cdm.applauncher",
                    type: "component"
                },
                "sap.flp": {
                    type: "tile",
                    tileSize: "1x1",
                    vizOptions: {
                        displayFormats: {
                            supported: [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.Flat],
                            default: DisplayFormat.Standard
                        }
                    }
                }
            };
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns an error visualizaton for unsupported platforms", function (assert) {
        // Arrange
        var oTestVizData = {
            _instantiationData: {
                platform: "unsupported",
                chipInstance: {}
            }
        };

        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        assert.strictEqual(oVizInstance.getMetadata().getName(), "sap.ushell.ui.launchpad.VizInstance", "A VizInstance was returned.");
        assert.strictEqual(oVizInstance.getState(), "Failed", "The VizInstance has the correct state.");
        assert.strictEqual(this.oVizInstanceAbapLoadStub.callCount, 0, "The load function was not called.");

        oVizInstance.destroy();
    });

    QUnit.test("Correctly returns a VizInstanceAbap", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: {
                platform: "ABAP",
                chipInstance: {}
            }
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(oVizInstance.getMetadata().getName(), "sap.ushell.ui.launchpad.VizInstanceAbap", "The vizInstance has the correct type.");
            assert.strictEqual(this.oVizInstanceAbapLoadStub.callCount, 1, "The load function was called exactly once.");

            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("Correctly returns a VizInstanceLaunchPage", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: {
                platform: "LAUNCHPAGE",
                chipInstance: {}
            }
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(oVizInstance.getMetadata().getName(), "sap.ushell.ui.launchpad.VizInstanceLaunchPage", "The vizInstance has the correct type.");
            assert.strictEqual(this.oVizInstanceLaunchPageLoadStub.callCount, 1, "The load function was called exactly once.");

            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("Correctly returns a VizInstanceCdm", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };
        var oThenStub = sandbox.stub();
        this.oVizInstanceCdmLoadStub.returns({ then: oThenStub });
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        assert.strictEqual(oVizInstance.getState(), "Loaded", "The VizInstance is in loaded state");
        oThenStub.callArg(0);

        // Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(oVizInstance.getMetadata().getName(), "sap.ushell.ui.launchpad.VizInstanceCdm", "The vizInstance has the correct type.");
            assert.strictEqual(this.oVizInstanceCdmLoadStub.callCount, 1, "The load function was called exactly once.");
            assert.strictEqual(oVizInstance.getState(), "Loaded", "The VizInstance is in loaded state");

            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("Correctly returns a VizInstanceLink", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            displayFormatHint: "compact",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(oVizInstance.getMetadata().getName(), "sap.ushell.ui.launchpad.VizInstanceLink", "The vizInstance has the correct type.");
            assert.strictEqual(this.oVizInstanceLinkLoadStub.callCount, 1, "The load function was called exactly once.");

            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("Loads custom tiles after the core-ext bundles have been loaded", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "custom.visualization.type",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };
        var oMockVizType = {
            "sap.app": {
                id: "custom.visualization.type",
                type: "component"
            }
        };
        var oEventTriggerStub = {
            do: sandbox.stub()
        };
        sandbox.stub(EventHub, "once").withArgs("CoreResourcesComplementLoaded").returns(oEventTriggerStub);
        this.oVizInstanceCdmLoadStub.returns({ then: sandbox.stub().callsArg(0) });

        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, oMockVizType);

        // Assert
        assert.strictEqual(oVizInstance.getState(), "Loading", "The VizInstance is in loading state");
        assert.strictEqual(this.oVizInstanceCdmLoadStub.callCount, 0, "The load function was not called immediately.");
        oEventTriggerStub.do.yield();
        assert.strictEqual(this.oVizInstanceCdmLoadStub.callCount, 1, "The load function was called after core-ext-light was loaded.");
        assert.strictEqual(oVizInstance.getState(), "Loaded", "The VizInstance is in loaded state");

        oVizInstance.destroy();
    });

    QUnit.test("Emits the VizInstanceLoaded event for standard vizTypes", function (assert) {
        //Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            id: "a1b2c3",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };

        //Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        //Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(this.oEmitStub.args[0][0], "VizInstanceLoaded", "The VizInstanceLoaded event was emitted.");
            assert.strictEqual(this.oEmitStub.args[0][1], "a1b2c3", "The visualization ID was passed.");

            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("Sets state to failed after load failed for standard vizType", function (assert) {
        //Arrange
        this.oVizInstanceCdmLoadStub.throws(new Error("some Error"));
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            id: "a1b2c3",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };
        //Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);
        //Assert
        assert.strictEqual(oVizInstance.getState(), "Failed", "The VizInstance has the correct state.");
        assert.strictEqual(this.oEmitStub.getCall(0).args[0], "VizInstanceLoaded", "The VizInstanceLoaded event was emitted.");
        assert.strictEqual(this.oEmitStub.getCall(0).args[1], "a1b2c3", "The visualization ID was passed.");
    });

    QUnit.test("Sets state to failed after load failed for custom vizType", function (assert) {
        //Arrange
        this.oVizInstanceCdmLoadStub.throws(new Error("some Error"));
        var oTestVizData = {
            vizType: "some.custom.vizType",
            id: "a1b2c3",
            _instantiationData: {
                platform: "CDM",
                vizType: {}
            }
        };
        var oMockVizType = {
            "sap.app": {
                id: "custom.visualization.type",
                type: "component"
            }
        };
        var oEventTriggerStub = {
            do: sandbox.stub()
        };
        sandbox.stub(EventHub, "once").withArgs("CoreResourcesComplementLoaded").returns(oEventTriggerStub);
        //Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, oMockVizType);
        oEventTriggerStub.do.yield();
        //Assert
        assert.strictEqual(oVizInstance.getState(), "Failed", "The VizInstance has the correct state.");
    });

    QUnit.test("VizInstanceData construction", function (assert) {
        // Arrange
        var oTestVizData = {
            vizId: "testId",
            vizType: "sap.ushell.StaticAppLauncher",
            title: "someTitle",
            subtitle: "subTitle",
            info: "soMuchInfo",
            icon: ":thatEmojiYouLove",
            keywords: ["from", "the", "bottom", "of", "my", "heart"],
            indicatorDataSource: { testPath: "path/$count" },
            dataSource: { uri: "/test/"},
            contentProviderId: "SAPwillProvide",
            numberUnit: "EUR",
            targetURL: "#something-different",
            vizConfig: {cool: "object"},
            displayFormatHint: DisplayFormat.Standard,
            _instantiationData: {
                platform: "CDM"
            }
        };

        var oExpectedVizInstanceData = {
            title: "someTitle",
            subtitle: "subTitle",
            info: "soMuchInfo",
            icon: ":thatEmojiYouLove",
            keywords: ["from", "the", "bottom", "of", "my", "heart"],
            indicatorDataSource: { testPath: "path/$count" },
            dataSource: { uri: "/test/"},
            contentProviderId: "SAPwillProvide",
            numberUnit: "EUR",
            targetURL: "#something-different",
            vizConfig: {cool: "object"},
            displayFormat: DisplayFormat.Standard,
            instantiationData: {
                platform: "CDM"
            },
            tileSize: "1x1",
            dataHelpId: oTestVizData.vizId
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        return this.oEmitPromise.then(function () {
            assert.strictEqual(oVizInstance.mProperties.title, oExpectedVizInstanceData.title, "title is correct");
            assert.strictEqual(oVizInstance.mProperties.subtitle, oExpectedVizInstanceData.subtitle, "subtitle is correct");
            assert.strictEqual(oVizInstance.mProperties.info, oExpectedVizInstanceData.info, "info is correct");
            assert.strictEqual(oVizInstance.mProperties.icon, oExpectedVizInstanceData.icon, "icon is correct");
            assert.deepEqual(oVizInstance.mProperties.keywords, oExpectedVizInstanceData.keywords, "keywords are correct");
            assert.deepEqual(oVizInstance.mProperties.indicatorDataSource, oExpectedVizInstanceData.indicatorDataSource, "indicatorDataSource is correct");
            assert.deepEqual(oVizInstance.mProperties.dataSource, oExpectedVizInstanceData.dataSource, "dataSource is correct");
            assert.strictEqual(oVizInstance.mProperties.contentProviderId, oExpectedVizInstanceData.contentProviderId, "contentProviderId is correct");
            assert.strictEqual(oVizInstance.mProperties.targetURL, undefined, "targetURL was not set via constructor");
            assert.deepEqual(this.oVizInstanceSetTargetURLStub.getCall(0).args, [oExpectedVizInstanceData.targetURL], "targetURL is correct");
            assert.deepEqual(oVizInstance.mProperties.vizConfig, oExpectedVizInstanceData.vizConfig, "vizConfig is correct");
            assert.strictEqual(oVizInstance.mProperties.displayFormat, oExpectedVizInstanceData.displayFormat, "displayFormat is correct");
            assert.strictEqual(oVizInstance.mProperties.tileSize, oExpectedVizInstanceData.tileSize, "tileSize is correct");
            assert.deepEqual(oVizInstance.mProperties.instantiationData, oExpectedVizInstanceData.instantiationData, "instantiationData is correct");
            assert.strictEqual(oVizInstance.mProperties.dataHelpId, oExpectedVizInstanceData.dataHelpId, "dataHelpId is correct");
            oVizInstance.destroy();
        }.bind(this));
    });

    QUnit.test("VizInstanceData: Set ui5object to true if indicatorDataSource is an object", function (assert) {
        // Arrange
        var oTestVizData = {
            vizType: "sap.ushell.StaticAppLauncher",
            title: "someTitle",
            indicatorDataSource: {
                path: "Autobahn"
            },
            displayFormatHint: DisplayFormat.Standard,
            _instantiationData: {
                platform: "CDM"
            }
        };

        var oExpectedVizInstanceData = {
            indicatorDataSource: {
                path: "Autobahn"
            }
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oTestVizData, this.oStaticAppLauncherVizType);

        // Assert
        return this.oEmitPromise.then(function () {
            // We do not test directly for indicatorDataSource.ui5object, because there is no easy way
            // to stub the vizInstance constructor.
            // Instead, we test the _effect_ of this field: the indicatorDataSource's path should not be
            // set as a binding path in mBindingInfos and instead be an additional property of the
            // vizInstance.
            assert.deepEqual(oVizInstance.mProperties.indicatorDataSource, oExpectedVizInstanceData.indicatorDataSource, "indicatorDataSource is correct");
            assert.strictEqual(oVizInstance.mBindingInfos.indicatorDataSource, undefined, "The indicatorDataSouce is not used for binding");
            oVizInstance.destroy();
        });
    });

    QUnit.test("Displays visualizations as static link on platform=ABAP", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "someId",
            vizType: "sap.ushell.StaticAppLauncher",
            displayFormatHint: DisplayFormat.Compact,
            _instantiationData: {
                platform: "ABAP"
            }
        };
        var oExpectedVizInstanceData = {
            dataHelpId: "someId",
            contentProviderId: undefined,
            displayFormat: DisplayFormat.Compact,
            icon: undefined,
            indicatorDataSource: undefined,
            dataSource: undefined,
            info: undefined,
            instantiationData: {
                platform: "ABAP"
            },
            keywords: undefined,
            numberUnit: undefined,
            subtitle: undefined,
            title: undefined,
            vizConfig: undefined,
            supportedDisplayFormats: [
                DisplayFormat.Standard,
                DisplayFormat.Compact,
                DisplayFormat.Flat
            ],
            tileSize: "1x1"
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oVizData, this.oStaticAppLauncherVizType);
        // Assert
        assert.strictEqual(this.oCleanInstantiationDataForLinkStub.callCount, 1, "_cleanInstantiationDataForLink was called once");
        assert.deepEqual(this.oCleanInstantiationDataForLinkStub.getCall(0).args, [oExpectedVizInstanceData], "_cleanInstantiationDataForLink was called with correct args");
        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Displays visualizations as static link on platform=CDM", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "someId",
            vizType: "sap.ushell.StaticAppLauncher",
            displayFormatHint: DisplayFormat.Compact,
            _instantiationData: {
                platform: "CDM"
            }
        };
        var oExpectedVizInstanceData = {
            dataHelpId: "someId",
            contentProviderId: undefined,
            displayFormat: DisplayFormat.Compact,
            icon: undefined,
            indicatorDataSource: undefined,
            dataSource: undefined,
            info: undefined,
            instantiationData: {
                platform: "CDM"
            },
            keywords: undefined,
            numberUnit: undefined,
            subtitle: undefined,
            title: undefined,
            vizConfig: undefined,
            supportedDisplayFormats: [
                DisplayFormat.Standard,
                DisplayFormat.Compact,
                DisplayFormat.Flat
            ],
            tileSize: "1x1"
        };
        // Act
        var oVizInstance = this.oVisualizationInstantiationService.instantiateVisualization(oVizData, this.oStaticAppLauncherVizType);
        // Assert
        assert.strictEqual(this.oCleanInstantiationDataForLinkStub.callCount, 1, "_cleanInstantiationDataForLink was called once");
        assert.deepEqual(this.oCleanInstantiationDataForLinkStub.getCall(0).args, [oExpectedVizInstanceData], "_cleanInstantiationDataForLink was called with correct args");
        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The function _cleanInstantiationDataForLink", {
        beforeEach: function () {
            this.oVizInstanceDataMock = {
                title: "Title",
                subtitle: "Subtitle",
                info: "Info",
                icon: "Icon",
                keywords: ["tag1", "tag2"],
                instantiationData: {},
                indicatorDataSource: "/$count",
                dataSource: "U1Y120",
                contentProviderId: "contentProvider123",
                vizConfig: {},
                supportedDisplayFormats: ["flat", "compact", "flatWide"],
                displayFormatHint: "flat",
                tileSize: "1x2",
                numberUnit: "kg"
            };

            this.oService = new VisualizationInstantiation();
        }
    });

    QUnit.test("Returns vizInstance data for displaying links", function (assert) {
        // Arrange
        var oExpectedResult = {
            displayFormatHint: "flat",
            subtitle: "Subtitle",
            supportedDisplayFormats: ["flat", "compact", "flatWide"],
            title: "Title"
        };

        // Act
        this.oService._cleanInstantiationDataForLink(this.oVizInstanceDataMock);

        // Assert
        assert.deepEqual(this.oVizInstanceDataMock, oExpectedResult, "Modifies the provided object by deleting unnecessary properties.");
    });

    QUnit.module("The method _getDisplayFormat", {
        beforeEach: function () {
            this.oService = new VisualizationInstantiation();
        }
    });

    QUnit.test("Returns the displayFormatHint if it is supported", function (assert) {
        // Arrange
        var aSupportedDisplayFormats = [DisplayFormat.Standard, DisplayFormat.Flat, DisplayFormat.StandardWide];
        var sDisplayFormatHint = DisplayFormat.Flat;
        // Act
        var sDisplayFormat = this.oService._getDisplayFormat(sDisplayFormatHint, aSupportedDisplayFormats);
        // Assert
        assert.strictEqual(sDisplayFormatHint, sDisplayFormat, "The correct displayFormat was returned");
    });

    QUnit.test("Returns the DisplayFormat.Standard if the displayFormatHint is not supported", function (assert) {
        // Arrange
        var aSupportedDisplayFormats = [DisplayFormat.Standard, DisplayFormat.Compact, DisplayFormat.StandardWide];
        var sDisplayFormatHint = DisplayFormat.Flat;
        // Act
        var sDisplayFormat = this.oService._getDisplayFormat(sDisplayFormatHint, aSupportedDisplayFormats);
        // Assert
        assert.strictEqual(DisplayFormat.Standard, sDisplayFormat, "The correct displayFormat was returned");
    });
});
