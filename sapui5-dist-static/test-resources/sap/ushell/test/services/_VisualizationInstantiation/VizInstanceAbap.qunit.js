// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._VisualizationInstantiation.VizInstanceAbap
 */

QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap",
    "sap/ushell/services/_VisualizationInstantiation/VizInstance",
    "sap/base/Log"
], function (
    VizInstanceAbap,
    VizInstance,
    Log
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.start();
    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor", {
        beforeEach: function () {
            // Using a custom thenable to avoid executing any promise handler
            var oThenable = {
                then: function () {}
            };
            var oGetServiceAsyncStub = sandbox.stub().returns(oThenable);

            sap.ushell = {
                Container: {
                    getServiceAsync: oGetServiceAsyncStub
                }
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Creates instance of type VizInstance", function (assert) {
        // Arrange
        sandbox.stub(VizInstanceAbap.prototype, "init");

        // Act
        var oVizInstance = new VizInstanceAbap({});

        // Assert
        assert.ok(oVizInstance.isA("sap.ushell.ui.launchpad.VizInstanceAbap"), "The object was created successfully");
        assert.ok(oVizInstance.isA("sap.ushell.ui.launchpad.VizInstance"), "The object correctly extends VizInstance.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Calls the init function of the superclass", function (assert) {
        // Arrange
        var oInitStub = sandbox.stub(VizInstance.prototype, "init");

        // Act
        var oVizInstance = new VizInstanceAbap();

        // Assert
        assert.strictEqual(oInitStub.callCount, 1, "The init function has been called once.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the _oContent property to the initial tile", function (assert) {
        // Arrange
        // Act
        var oVizInstance = new VizInstanceAbap();

        // Assert
        var oTile = oVizInstance._oContent;
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");

        var oStateBindingInfo = oTile.getBindingInfo("state");
        assert.strictEqual(oStateBindingInfo.parts[0].model, "$this", "The correct model name has been found.");
        assert.strictEqual(oStateBindingInfo.parts[0].path, "state", "The correct path has been found.");

        var oFrameTypeBindingInfo = oTile.getBindingInfo("frameType");
        assert.strictEqual(typeof oFrameTypeBindingInfo.formatter, "function", "There was a formatter set.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[0].path, "displayFormat", "The correct path has been found.");
        assert.strictEqual(oFrameTypeBindingInfo.parts[1].path, "tileSize", "The correct path has been found.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The init function", {
        beforeEach: function () {
            this.oChipMock = {
                id: "chipMock"
            };

            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oCreateChipInstanceStub = sandbox.stub().returns(this.oChipMock);
            this.oPageBuildingServiceMock = {
                getFactory: sandbox.stub().returns({
                    createChipInstance: this.oCreateChipInstanceStub
                })
            };
            this.oGetServiceAsyncStub.withArgs("PageBuilding").returns({
                then: sandbox.stub().yields(this.oPageBuildingServiceMock)
            });
            this.oAddBagDataToChipInstanceStub = sandbox.stub(VizInstanceAbap.prototype, "_addBagDataToChipInstance");
            this.oGetInstantiationDataStub = sandbox.stub(VizInstanceAbap.prototype, "getInstantiationData");
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Handles standard chipData correctly", function (assert) {
        // Arrange
        var oInstantiationData = {
            platform: "ABAP",
            chip: {
                id: "someChip",
                someChipProperty: "someChipProperty"
            }
        };
        this.oGetInstantiationDataStub.returns(oInstantiationData);

        var oExpectedChip = {
            chipId: "someChip",
            chip: {
                id: "someChip",
                someChipProperty: "someChipProperty"
            }
        };

        // Act
        // eslint-disable-next-line no-new
        new VizInstanceAbap();
        // Assert
        assert.strictEqual(this.oCreateChipInstanceStub.callCount, 1, "createChipInstance was called once");
        assert.deepEqual(this.oCreateChipInstanceStub.getCall(0).args, [ oExpectedChip ], "createChipInstance was called with correct parameters");
        assert.strictEqual(this.oAddBagDataToChipInstanceStub.callCount, 1, "_addBagDataToChipInstanceStub was called once");
        assert.deepEqual(this.oAddBagDataToChipInstanceStub.getCall(0).args, [ this.oChipMock, undefined ], "_addBagDataToChipInstanceStub was called with correct parameters");
    });

    QUnit.test("Handles simplified chipData correctly", function (assert) {
        // Arrange
        var oInstantiationData = {
            platform: "ABAP",
            chip: {
                chipId: "someCustomChip",
                bags: {
                    id: "someBags"
                },
                configuration: {
                    id: "someConfiguration"
                }
            },
            simplifiedChipFormat: true
        };
        this.oGetInstantiationDataStub.returns(oInstantiationData);

        var oExpectedChip = {
            chipId: "someCustomChip",
            configuration: "{\"id\":\"someConfiguration\"}"
        };

        // Act
        // eslint-disable-next-line no-new
        new VizInstanceAbap();

        // Assert
        assert.strictEqual(this.oCreateChipInstanceStub.callCount, 1, "createChipInstance was called once");
        assert.deepEqual(this.oCreateChipInstanceStub.getCall(0).args, [ oExpectedChip ], "createChipInstance was called with correct parameters");
        assert.strictEqual(this.oAddBagDataToChipInstanceStub.callCount, 1, "_addBagDataToChipInstanceStub was called once");
        var oBags = oInstantiationData.chip.bags;
        assert.deepEqual(this.oAddBagDataToChipInstanceStub.getCall(0).args, [ this.oChipMock, oBags ], "_addBagDataToChipInstanceStub was called with correct parameters");
    });

    QUnit.module("The load function", {
        beforeEach: function () {
            sap.ushell = {Container: {}};
            this.oTestVizData = {
                instantiationData: {
                    chip: {
                        id: "SomeID"
                    }
                }
            };
            this.oChipInstanceLoadStub = sandbox.stub().yields();
            this.oVizInstanceSetChipInstanceTypeStub = sandbox.stub(VizInstanceAbap.prototype, "_setChipInstanceType");
            this.oVizInstanceSetContentStub = sandbox.stub(VizInstance.prototype, "_setContent");
            this.oVizInstanceSetStateStub = sandbox.stub(VizInstance.prototype, "setState");
            this.oSetEnabledStub = sandbox.stub();
            this.oGetContractStub = sandbox.stub().withArgs("preview").returns({
                setEnabled: this.oSetEnabledStub
            });
            this.oGetImplementationAsSapui5Stub = sandbox.stub().returns({view: "foobar"});
            this.oChipInstance = {
                load: this.oChipInstanceLoadStub,
                getContract: this.oGetContractStub,
                getImplementationAsSapui5: this.oGetImplementationAsSapui5Stub
            };
            this.oCreateChipInstanceStub = sandbox.stub().returns(this.oChipInstance);
            this.oGetFactoryStub = sandbox.stub().returns({
                createChipInstance: this.oCreateChipInstanceStub
            });
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container.getServiceAsync = this.oGetServiceAsyncStub;
            this.oPageBuildingServiceFake = {
                getFactory: this.oGetFactoryStub
            };
            this.oGetServiceAsyncStub.withArgs("PageBuilding").resolves(this.oPageBuildingServiceFake);

            this.oTestVizInstance = new VizInstanceAbap(this.oTestVizData);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
            this.oTestVizInstance.destroy();
        }
    });

    QUnit.test("Correctly executes the callback and sets all properties", function (assert) {
        // Arrange
        // Act
        return this.oTestVizInstance.load(false)
            .then(function () {
                // Assert
                assert.strictEqual(this.oTestVizInstance._oChipInstance, this.oChipInstance, "The correct chipInstance has been stored.");
                assert.strictEqual(this.oVizInstanceSetChipInstanceTypeStub.callCount, 1, "_setChipInstanceType was called exactly once");
                assert.strictEqual(this.oVizInstanceSetContentStub.callCount, 1, "setContent was called exactly once");
                assert.deepEqual(this.oVizInstanceSetContentStub.getCall(0).args, [{view: "foobar"}], "setContent was called with correct params");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 0, "The function setState was not called.");
            }.bind(this));
    });

    QUnit.test("Correctly retrieves the previewContract if 'isPreview' is set to true and a previewContract is available", function (assert) {
        // Arrange
        // Act
        return this.oTestVizInstance.load(true)
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetContractStub.callCount, 1, "The getContract function was called exactly once");
                assert.strictEqual(this.oVizInstanceSetContentStub.callCount, 1, "setContent was called exactly once");
                assert.strictEqual(this.oSetEnabledStub.callCount, 1, "The setEnabled function was called exactly once");
                assert.deepEqual(this.oVizInstanceSetContentStub.getCall(0).args, [{view: "foobar"}], "setContent was called with correct params");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 0, "The function setState was not called.");
            }.bind(this));
    });

    QUnit.test("Correctly rejects when 'isPreview' is set to true but a previewContract is not available", function (assert) {
        // Arrange
        this.oGetContractStub.withArgs("preview").returns(false);

        // Act
        return this.oTestVizInstance.load(true)
            .catch(function () {
                // Assert
                assert.strictEqual(this.oGetContractStub.callCount, 1, "The getContract function was called exactly once");
                assert.strictEqual(this.oSetEnabledStub.callCount, 0, "The setEnabled function was not called");
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 1, "The function setState was called once.");
                assert.strictEqual(this.oVizInstanceSetStateStub.firstCall.args[0], "Failed", "The function setState was called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Correctly rejects if the chip instantiation calls the error handler", function (assert) {
        // Arrange
        this.oChipInstanceLoadStub.callsArg(1);

        // Act
        return this.oTestVizInstance.load(true)
            .catch(function () {
                // Assert
                assert.strictEqual(this.oVizInstanceSetStateStub.callCount, 1, "The function setState was called once.");
                assert.strictEqual(this.oVizInstanceSetStateStub.firstCall.args[0], "Failed", "The function setState was called with the correct parameter.");
            }.bind(this));
    });

    QUnit.module("The _setChipInstanceType function", {
        beforeEach: function () {
            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstance = new VizInstanceAbap();
            this.oVizInstance._oChipInstance = {
                getContract: sandbox.stub()
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the CHIP instances's type based on the vizInstance's display format", function (assert) {
        //Arrange
        var oTypesContractMock = {
            setType: sandbox.stub()
        };
        this.oVizInstance._oChipInstance.getContract.withArgs("types").returns(oTypesContractMock);
        this.oVizInstance.setDisplayFormat("standard");

        //Act
        this.oVizInstance._setChipInstanceType();

        //Assert
        assert.strictEqual(oTypesContractMock.setType.args[0][0], "tile", "The CHIP instance's type was set correctly");
    });

    QUnit.test("Doesn't crash if the CHIP instance doesn't have a types contract", function (assert) {
        //Act
        this.oVizInstance._setChipInstanceType();

        //Assert
        assert.ok(true, "The function didn't crash");
    });

    QUnit.module("The _setVisible function", {
        beforeEach: function () {
            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };

            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
        },
        afterEach: function () {
            this.oVizInstanceAbap.destroy();
            sandbox.restore();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the isStub function of the chip instance", function (assert) {
        // Arrange
        var oIsStubStub = sinon.stub().returns(true); // lol
        this.oVizInstanceAbap._oChipInstance = {
            isStub: oIsStubStub
        };

        // Act
        this.oVizInstanceAbap._setVisible();

        // Assert
        assert.strictEqual(oIsStubStub.callCount, 1, "The function isStub has been called once.");
    });

    QUnit.test("Calls the 'visible' contract's setVisible function if the chip is not a stub and if the contract exists", function (assert) {
        // Arrange
        var oParam = {};
        var oSetVisibleStub = sinon.stub();
        var oContract = {
            setVisible: oSetVisibleStub
        };
        var oGetContractStub = sinon.stub().returns(oContract);

        this.oVizInstanceAbap._oChipInstance = {
            isStub: sinon.stub().returns(false),
            getContract: oGetContractStub
        };

        // Act
        this.oVizInstanceAbap._setVisible(oParam);

        // Assert
        assert.strictEqual(oGetContractStub.callCount, 1, "The function getContract has been called once.");
        assert.deepEqual(oGetContractStub.firstCall.args, [ "visible" ], "The function getContract has been called with the correct parameter.");
        assert.strictEqual(oSetVisibleStub.callCount, 1, "The function setVisible has been called once.");
        assert.deepEqual(oSetVisibleStub.firstCall.args, [ oParam ], "The function setVisible has been called with the correct parameter.");
    });

    QUnit.test("Does not throw if no contract exists", function (assert) {
        // Arrange
        var oGetContractStub = sinon.stub();

        this.oVizInstanceAbap._oChipInstance = {
            isStub: sinon.stub().returns(false),
            getContract: oGetContractStub
        };

        // Act
        this.oVizInstanceAbap._setVisible();

        // Assert
        assert.strictEqual(oGetContractStub.callCount, 1, "The function getContract has been called once.");
    });

    QUnit.module("The setActive function", {
        beforeEach: function () {
            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };

            this.oSetPropertyStub = sandbox.spy(VizInstanceAbap.prototype, "setProperty");
            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
            this.oSetVisibleStub = sandbox.stub(this.oVizInstanceAbap, "_setVisible");
            this.oRefreshStub = sandbox.stub(this.oVizInstanceAbap, "refresh");
        },
        afterEach: function () {
            this.oVizInstanceAbap.destroy();
            sandbox.restore();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the _setVisible function", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true);

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "The function _setVisible has been called once.");
        assert.deepEqual(this.oSetVisibleStub.firstCall.args, [ true ], "The function _setVisible has been called with the correct parameters.");
    });

    QUnit.test("Calls the setProperty function", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true);

        // Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The function setProperty has been called once.");
        assert.deepEqual(this.oSetPropertyStub.firstCall.args, [ "active", true, false ], "The function setProperty has been called with the correct parameters.");
    });

    QUnit.test("Returns a reference to 'this'", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVizInstanceAbap.setActive();

        // Assert
        assert.strictEqual(oResult, this.oVizInstanceAbap, "The correct reference has been found.");
    });

    QUnit.test("Calls refresh if requested", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true, true);

        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 1, "The function refresh has been called once.");
    });

    QUnit.test("Does not call refresh in not requested", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap.setActive(true, false);

        // Assert
        assert.strictEqual(this.oRefreshStub.callCount, 0, "The function refresh has not been called once.");
    });

    QUnit.module("The refresh function", {
        beforeEach: function () {
            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };

            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
            this.oVizInstanceAbap._oChipInstance = {
                refresh: sandbox.stub()
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstanceAbap.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls the CHIP's refresh function if the CHIP is already loaded", function (assert) {
        //Arrange
        //Act
        this.oVizInstanceAbap.refresh();

        //Assert
        assert.strictEqual(this.oVizInstanceAbap._oChipInstance.refresh.callCount, 1, "The refresh function was called.");
    });

    QUnit.test("Doesn't throw an exception if the CHIP instance is not yet loaded", function (assert) {
        //Arrange
        //Act
        this.oVizInstanceAbap.refresh();

        //Assert
        assert.ok(true, "The refresh function didn't crash.");
    });

    QUnit.module("_addBagDataToChipInstance", {
        beforeEach: function () {
            sap.ushell = {
                Container: {
                    getServiceAsync: function () {}
                }
            };

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oSetTextStub = sandbox.stub();
            this.oSetPropertyStub = sandbox.stub();
            this.oBag = {
                setText: this.oSetTextStub,
                setProperty: this.oSetPropertyStub
            };

            this.oGetBagStub = sandbox.stub().returns(this.oBag);
            this.oChipInstance = {
                getBag: this.oGetBagStub
            };

            sandbox.stub(VizInstanceAbap.prototype, "init");
            this.oVizInstanceAbap = new VizInstanceAbap();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns directly if there is no bag", function (assert) {
        // Arrange
        // Act
        this.oVizInstanceAbap._addBagDataToChipInstance(this.oChipInstance, undefined);
        // Assert
        assert.strictEqual(this.oGetBagStub.callCount, 0, "getBag was not called.");
    });

    QUnit.test("Adds all bagProperties of all bags to the chip", function (assert) {
        // Arrange
        var oBags = {
            bag1: {
                properties: {
                    key1a: "value1a",
                    key1b: "value1b"
                },
                texts: {
                    key1c: "value1c",
                    key1d: "value1d"
                }
            },
            bag2: {
                properties: {
                    key2a: "value2a",
                    key2b: "value2b"
                },
                texts: {
                    key2c: "value2c",
                    key2d: "value2d"
                }
            }
        };
        // Act
        this.oVizInstanceAbap._addBagDataToChipInstance(this.oChipInstance, oBags);
        // Assert
        assert.strictEqual(this.oGetBagStub.callCount, 2, "getBag was called twice.");
        assert.deepEqual(this.oGetBagStub.getCall(0).args, [ "bag1" ], "getBag was called the first time with correct parameters.");
        assert.deepEqual(this.oGetBagStub.getCall(1).args, [ "bag2" ], "getBag was called the second time with correct parameters.");

        assert.strictEqual(this.oSetPropertyStub.callCount, 4, "setProperty was called four times.");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, [ "key1a", "value1a" ], "setProperty was called the first time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(1).args, [ "key1b", "value1b" ], "setProperty was called the second time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(2).args, [ "key2a", "value2a" ], "setProperty was called the third time with correct parameters.");
        assert.deepEqual(this.oSetPropertyStub.getCall(3).args, [ "key2b", "value2b" ], "setProperty was called the fourth time with correct parameters.");

        assert.strictEqual(this.oSetTextStub.callCount, 4, "setText was called four times.");
        assert.deepEqual(this.oSetTextStub.getCall(0).args, [ "key1c", "value1c" ], "setText was called the first time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(1).args, [ "key1d", "value1d" ], "setText was called the second time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(2).args, [ "key2c", "value2c" ], "setText was called the third time with correct parameters.");
        assert.deepEqual(this.oSetTextStub.getCall(3).args, [ "key2d", "value2d" ], "setText was called the fourth time with correct parameters.");
    });

    QUnit.test("Logs an error in case the bag.setProperty fails", function (assert) {
        // Arrange
        var oBags = {
            bagId: {
                properties: {
                    someProperty: "someValue"
                }
            }
        };
        this.oSetPropertyStub.throws("setProperty failed intentionally");
        var sExpectedMessage = "VizInstanceAbap._addBagDataToChipInstance: setProperty failed intentionally";
        // Act
        this.oVizInstanceAbap._addBagDataToChipInstance(this.oChipInstance, oBags);
        // Assert
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage], "Log.error was called with correct parameters.");
    });

    QUnit.test("Logs an error in case the bag.setText fails", function (assert) {
        // Arrange
        var oBags = {
            bagId: {
                texts: {
                    someProperty: "someValue"
                }
            }
        };
        this.oSetTextStub.throws("setText failed intentionally");
        var sExpectedMessage = "VizInstanceAbap._addBagDataToChipInstance: setText failed intentionally";
        // Act
        this.oVizInstanceAbap._addBagDataToChipInstance(this.oChipInstance, oBags);
        // Assert
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, [sExpectedMessage], "Log.error was called with correct parameters.");
    });
});
