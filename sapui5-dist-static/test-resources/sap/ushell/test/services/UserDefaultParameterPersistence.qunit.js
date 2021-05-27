// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameterPersistence
 */
sap.ui.require([
    "sap/ushell/services/UserDefaultParameterPersistence",
    "sap/base/Log"
], function (UserDefaultParameterPersistence, Log) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("loadParameterValue", {
        beforeEach: function () {
            this.oLoadParameterStub = sandbox.stub().returns((new jQuery.Deferred()).resolve({
                value: "xxx"
            }).promise());

            this.oAdapter = {
                loadParameterValue: this.oLoadParameterStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the right value", function (assert) {
        // Arrange
        var done = assert.async();
        // Act
        this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
            .done(function (a) {
                // Assert
                assert.deepEqual(a, {
                    value: "yyy"
                }, "the right value was returned");
                assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
                assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{value: "xxx"}], "'cleanseValue' was called with the right parameters");
                assert.deepEqual(this.oLoadParameterStub.getCall(0).args, ["AKEY", this.oSystemContextMock], "'loadParameter' called with the right arguments");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.test("Rejects if 'loadParamterValue' rejects", function (assert) {
        // Arrange
        var done = assert.async();
        this.oLoadParameterStub.returns((new jQuery.Deferred()).reject("nonono").promise());

        // Act
        this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
            .fail(function (a) {
                // Assert
                assert.deepEqual(a, "nonono", " msg transported");
                assert.strictEqual(this.oCleanseValueStub.callCount, 0, "'cleanseValue' was not called");
            }.bind(this))
            .done(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.module("saveParameterValue", {
        beforeEach: function () {
            this.oLoadParameterStub = sandbox.stub().returns((new jQuery.Deferred()).resolve({
                value: "xxx"
            }).promise());
            this.oSaveParameterValueStub = sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise());

            this.oAdapter = {
                loadParameterValue: this.oLoadParameterStub,
                saveParameterValue: this.oSaveParameterValueStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oService.saveParameterValue("AKEY", {
            value: "xxx"
        }, this.oSystemContextMock)
            .done(function () {
                // Assert
                assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
                assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{ value: "xxx"}], "'cleanseValue' was called with the right parameters");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", {value: "yyy"}, this.oSystemContextMock], "'saveParamaters' was called with the right parameters");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.test("Rejects if the adapter fails", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSaveParameterValueStub.returns((new jQuery.Deferred()).reject("aaa").promise());

        // Act
        this.oService.saveParameterValue("AKEY", {
            value: "xxx"
        }, this.oSystemContextMock)
            .fail(function (a) {
                // Assert
                assert.deepEqual(a, "aaa", "failed with the correct message");
                assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleansValue' was called exactly once");
                assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{value: "xxx"}], "called");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", {value: "yyy"}, this.oSystemContextMock], "'saveParameter' called with the right arguments");
            }.bind(this))
            .done(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.module("deleteParameter", {
        beforeEach: function () {
            this.oDeleteParameterValueStub = sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise());

            this.oAdapter = {
                deleteParameter: this.oDeleteParameterValueStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").returns({
                value: "yyy"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oService.deleteParameter("AKEY", this.oSystemContextMock)
            .done(function (a) {
                // Assert
                assert.deepEqual(this.oDeleteParameterValueStub.getCall(0).args, ["AKEY", this.oSystemContextMock], "'deleteParameterValue' was called with the right arguments");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.module("getStoredParameterNames", {
        beforeEach: function () {
            this.oGetStoredParameterNamesStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(["CCC", "AAA", "BbB"]).promise());

            this.oAdapter = {
                getStoredParameterNames: this.oGetStoredParameterNamesStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Calls the right functions", function (assert) {
        //Arrange
        var done = assert.async();

        // Act
        this.oService.getStoredParameterNames()
            .done(function (a) {
                // Assert
                assert.deepEqual(a, ["AAA", "BbB", "CCC"], "The right values were returned");
                assert.strictEqual(this.oGetStoredParameterNamesStub.callCount, 1, "'getStoredParameterNames' called once");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "should not get here");
            })
            .always(done);
    });

    QUnit.module("_cleanseValue", {
        beforeEach: function () {
            this.oGetStoredParameterNamesStub = sandbox.stub().returns((new jQuery.Deferred()).resolve(["CCC", "AAA", "BbB"]).promise());
            this.oService = new UserDefaultParameterPersistence({});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the right result", function (assert) {
        // Arrange

        // Act
        var oResult = this.oService._cleanseValue({
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            value: "123",
            noStore: true,
            noEdit: false,
            alwaysAskPlugin: true
        });

        // Assert
        assert.deepEqual(oResult, {value: "123", noEdit: false, alwaysAskPlugin: true }, "The right result was returned");
    });

    QUnit.module("_getSystemContextPromise", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.oSystemContextMock = {
                id: "systemContext"
            };

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oSystemContextMock);
            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oWarningStub = sandbox.stub(Log, "warning");

            this.oService = new UserDefaultParameterPersistence({});
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the systemContext when parameter is provided", function (assert) {
        // Arrange
        var oSystemContextMock = {
            id: "systemContext"
        };
        // Act
        return this.oService._getSystemContextPromise(oSystemContextMock).then(function (oSystemContext) {
            // Assert
            assert.strictEqual(oSystemContext, oSystemContextMock, "returned the correct systemContext");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 0, "getSystemContext was not called");
        }.bind(this));
    });

    QUnit.test("Returns the default systemContext when parameter is undefined", function (assert) {
        // Arrange
        var sExpectedWarning = "UserDefaultParameterPersistence: The systemContext was not provided, using defaultSystemContext as fallback";
        // Act
        return this.oService._getSystemContextPromise().then(function (oSystemContext) {
            // Assert
            assert.strictEqual(oSystemContext, this.oSystemContextMock, "returned the correct systemContext");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
            assert.deepEqual(this.oWarningStub.getCall(0).args, [sExpectedWarning], "raised the correct warning");
        }.bind(this));
    });

    QUnit.module("Component tests: Save, load and delete ParameterValue", {
        beforeEach: function () {
            this.oLoadParameterStub = sandbox.stub().returns((new jQuery.Deferred()).resolve({
                value: "xxx"
            }).promise());
            this.oSaveParamaterStub = sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise());
            this.oDeleteParamterStub = sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise());

            this.oAdapter = {
                loadParameterValue: this.oLoadParameterStub,
                saveParameterValue: this.oSaveParamaterStub,
                deleteParameter: this.oDeleteParamterStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);

            this.oCleanseValueStub = sandbox.stub(this.oService, "_cleanseValue").callsFake(function () {
                return {
                    value: "yyy"
                };
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the cached value", function (assert) {
        var done = assert.async();

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", { value: "xxx" }, this.oSystemContextMock)
                    .then(function (a) {
                        assert.ok(true, "saved");
                        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called exactly once");
                        assert.deepEqual(this.oCleanseValueStub.getCall(0).args, [{value: "xxx"}], "'cleanseValue' was called with the right parameters");
                        assert.deepEqual(this.oSaveParamaterStub.getCall(0).args, ["AKEY", {value: "yyy"}, this.oSystemContextMock], "'saveParameter' was called with the right arguments");
                        assert.strictEqual(this.oLoadParameterStub.callCount, 0, "'loadParameter' was not called");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                // load AKEY, loading cleansed value from last save operation
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (a) {
                        assert.deepEqual(a, {value: "yyy"}, " value ok");
                        assert.strictEqual(this.oCleanseValueStub.callCount, 1, "'cleanseValue' was called once");
                        assert.strictEqual(this.oLoadParameterStub.callCount, 0, "'loadParameter' was not called");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Returns the cached value and cleaning works", function (assert) {
        // Arrange
        var done = assert.async();
        this.oCleanseValueStub.restore();

        var oData = {
            noEdit: true,
            notstored: "zzz",
            value: "yyy"
        };

        // Act
        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oData, this.oSystemContextMock);
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        // Assert
                        assert.deepEqual(aValue, {value: "yyy", noEdit: true}, "The right value was loaded");
                        assert.deepEqual(this.oAdapter.saveParameterValue.getCall(0).args, ["AKEY", {noEdit: true, value: "yyy"}, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Calls the adapter's deleteParameter function if undefined is passed as the value", function (assert) {
        var done = assert.async();
        assert.expect(7);
        this.oSaveParamaterStub.returns(new jQuery.Deferred().resolve().promise());

        this.oLoadParameterStub.returns(new jQuery.Deferred().resolve({
            value: "fakeLoad"
        }).promise());
        this.oCleanseValueStub.callsFake(function (a) {
            return a;
        });

        this.oService.saveParameterValue("AKEY", { value: "abc" }, this.oSystemContextMock)
            .then(function (a) {
                assert.ok(true, "saved");
            })
            .fail(function () {
                assert.ok(false, "should not get here");
            })
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, {value: "abc"}, "loaded value is saved value");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.saveParameterValue("AKEY", undefined, this.oSystemContextMock)
                    .then(function (a) {
                        assert.ok(true, "saved (undefined)");
                        assert.ok(this.oAdapter.deleteParameter.calledOnce, "delete called");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, {value: "fakeLoad"}, "loaded value empty");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.module("Component tests: save and load value with extendedParameter cleaning", {
        beforeEach: function () {
            this.oDeleteParameterValueStub = sandbox.stub().returns((new jQuery.Deferred()).resolve("aaa").promise());
            this.oSaveParameterValueStub = sandbox.stub().callsFake(function (sParameterName, aValue) {
                this.oAdapterSavedValue = aValue;
                return new jQuery.Deferred().resolve().promise();
            });
            this.oLoadParameterValueStub = sandbox.stub().callsFake(function () {
                return new jQuery.Deferred().resolve(this.oAdapterSavedValue).promise();
            });

            this.oAdapter = {
                deleteParameter: this.oDeleteParameterValueStub,
                saveParameterValue: this.oSaveParameterValueStub,
                loadParameterValue: this.oLoadParameterValueStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Saves the right object if there is a value and no extended value in it", function (assert) {
        var done = assert.async();
        assert.expect(4);
        var oValue = {
            value: "123",
            extendedValue: {
                a: "b"
            }
        };
        var oExectedValue = {
            value: "123",
            extendedValue: {
                a: "b"
            }
        };

        var oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }
        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                        assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Saves the right object if there is only a value and no extended value in it", function (assert) {
        var done = assert.async();
        assert.expect(4);
        var oValue = {
            value: "123"
        };
        var oExectedValue = {
            value: "123"
        };

        var oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                        assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Saves the right object if there is a value and an undefined extended value in it", function (assert) {
        var done = assert.async();
        assert.expect(4);
        var oValue = {
            value: "123",
            extendedValue: undefined
        };
        var oExectedValue = {
            value: "123"
        };

        var oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                        assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Saves the right object if there is only an extended value and no value in it", function (assert) {
        var done = assert.async();
        assert.expect(4);
        var oValue = {
            extendedValue: {
                a: "b"
            }
        };
        var oExectedValue = {
            extendedValue: {
                a: "b"
            }
        };

        var oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                        assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.test("Saves the right object if there is an extended value and an unexpected value in it", function (assert) {
        var done = assert.async();
        assert.expect(4);
        var oValue = {
            extendedValue: {
                a: "b"
            },
            value: undefined
        };
        var oExectedValue = {
            extendedValue: {
                a: "b"
            }
        };

        var oSavedObject = {};
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue")) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                        assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was  called with the right arguments");
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(done);
    });

    QUnit.module("Component tests: Save and load value, no store", {
        beforeEach: function () {
            this.oSaveParameterValueStub = sandbox.stub().callsFake(function (sParameterName, aValue) {
                this.oAdapterSavedValue = aValue;
                return new jQuery.Deferred().resolve().promise();
            });
            this.oLoadParameterValueStub = sandbox.stub().callsFake(function () {
                return new jQuery.Deferred().resolve(this.oAdapterSavedValue).promise();
            });

            this.oAdapter = {
                saveParameterValue: this.oSaveParameterValueStub,
                loadParameterValue: this.oLoadParameterValueStub
            };
            this.oService = new UserDefaultParameterPersistence(this.oAdapter);

            this.oSystemContextMock = {
                id: "systemContextMockId"
            };
            this.oGetSystemContextPromiseStub = sandbox.stub(this.oService, "_getSystemContextPromise").resolves(this.oSystemContextMock);
        }
    });

    QUnit.test("Saves an empty object if No store is true and save called is false", function (assert) {
        var done = assert.async();
        assert.expect(4);

        var oValue = {
            noStore: true,
            value: "123",
            extendedValue: {
                a: "b"
            }
        };
        var oExectedValue = {};
        var oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 0, "'saveParameterValue' was not called");
                done();
            }.bind(this));
    });

    QUnit.test("Saves the given object if No store is true and save called is true", function (assert) {
        var done = assert.async();
        assert.expect(5);

        var oValue = {
            noStore: "true",
            value: "123"
        };
        var oExectedValue = {
            value: "123"
        };
        var oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "'saveParameterValue' was called exactly once");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
                done();
            }.bind(this));
    });

    QUnit.test("Saves the given object if save called is false", function (assert) {
        var done = assert.async();
        assert.expect(5);

        var oValue = {
            value: "123"
        };
        var oExectedValue = {
            value: "123"
        };
        var oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    })
                    .fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "'saveParameterValue' was called exactly once");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
                done();
            }.bind(this));
    });

    QUnit.test("Saves the given object if there is only an extendedValue and save called is false", function (assert) {
        var done = assert.async();
        assert.expect(5);

        var oValue = {
            extendedValue: "xxxx"
        };
        var oExectedValue = {
            extendedValue: "xxxx"
        };

        var oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }

        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                    }).fail(function () {
                        assert.ok(false, "should not get here");
                    });
                }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    }).fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "'saveParameterValue' was called exactly once");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
                done();
            }.bind(this));
    });

    QUnit.test("Saves an empty object if the given object is empty", function (assert) {
        var done = assert.async();
        assert.expect(5);

        var oValue = {};
        var oExectedValue = {};

        var oSavedObject = {
            noStore: oValue.noStore
        };
        if (Object.hasOwnProperty.call(oValue, "value")) {
            oSavedObject.value = oValue.value;
        }
        if (Object.hasOwnProperty.call(oValue, "extendedValue", this.oSystemContextMock)) {
            oSavedObject.extendedValue = oValue.extendedValue;
        }
        (new jQuery.Deferred()).resolve()
            .then(function () {
                return this.oService.saveParameterValue("AKEY", oSavedObject, this.oSystemContextMock)
                    .then(function () {
                        assert.ok(true, "saved");
                    }).fail(function () {
                        assert.ok(false, "should not get here");
                    });
                }.bind(this))
            .then(function () {
                return this.oService.loadParameterValue("AKEY", this.oSystemContextMock)
                    .then(function (aValue) {
                        assert.ok(true, "saved");
                        assert.deepEqual(aValue, oExectedValue, "loaded value ok");
                    }).fail(function () {
                        assert.ok(false, "should not get here");
                    });
            }.bind(this))
            .then(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "'saveParameterValue' was called exactly once");
                assert.deepEqual(this.oSaveParameterValueStub.getCall(0).args, ["AKEY", oExectedValue, this.oSystemContextMock], "'saveParameterValue' was called with the right arguments");
                done();
            }.bind(this));
    });
});