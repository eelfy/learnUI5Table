// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/* global QUnit, sinon */

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameters
 */
sap.ui.require([
    "sap/ui/base/EventProvider",
    "sap/base/Log",
    "sap/ushell/services/UserDefaultParameters",
    "sap/ushell/test/utils",
    "sap/ushell/services/Container"
], function (EventProvider, Log, UserDefaultParameters, testUtils) {
    "use strict";

    QUnit.module("sap.ushell.services.UserDefaultParameters", {
        beforeEach: function () {
            this.oGetServiceStub = sinon.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oLoadPluginsDeferred = new jQuery.Deferred();
            this.oGetServiceStub.withArgs("PluginManager").returns({
                loadPlugins: function () {
                    return this.oLoadPluginsDeferred.promise();
                }.bind(this)
            });

            this.oService = new UserDefaultParameters();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("constructor", function (assert) {
        assert.ok(this.oService);
    });

    function makeFunctionIf (value, sParameterName) {
        if (value === "reject") {
            return function () {
                return new jQuery.Deferred().reject().promise();
            };
        }

        return function (sName, org) {
            var oDeferred = new jQuery.Deferred();
            setTimeout(function () {
                if (sName === sParameterName) {
                    oDeferred.resolve(value);
                } else {
                    oDeferred.resolve(org);
                }
            }, 0);
            return oDeferred.promise();
        };
    }

    function makePlugin (sId, oPrio) {
        return {
            id: sId,
            getComponentData: function () {
                return {
                    config: {
                        "sap-priority": oPrio
                    }
                };
            }
        };
    }

    [
        {
            description: "insert0",
            arr: [],
            oInsert: makePlugin("P1"),
            res: ["P1"]
        },
        {
            description: "insertend",
            arr: [makePlugin("P1", undefined), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", undefined),
            res: ["P1", "P2", "P3"]
        },
        {
            description: "insertmid",
            arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", 50),
            res: ["P1", "P3", "P2"]
        },
        {
            description: "insertfirst",
            arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", -50),
            res: ["P1", "P2", "P3"]
        },
        {
            description: "insertlastappend",
            arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", undefined),
            res: ["P1", "P2", "P3"]
        },
        {
            description: "insertfirst",
            arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", 200),
            res: ["P3", "P1", "P2"]
        },
        {
            description: "insert sameend",
            arr: [makePlugin("P1", 100), makePlugin("P2", undefined)],
            oInsert: makePlugin("P3", 100),
            res: ["P1", "P3", "P2"]
        }
    ].forEach(function (oFixture) {
        QUnit.test("insertOrdered" + oFixture.description, function (assert) {
            var res = this.oService._insertPluginOrdered(oFixture.arr, oFixture.oInsert);
            res = res.map(function (oObj) {
                return oObj.id;
            });
            assert.deepEqual(res, oFixture.res, "result ok");
        });
    });

    QUnit.test("getValue: init time for plug-ins", function (assert) {
        var done = assert.async();

        var oPlugin = {
            getUserDefault: sinon.stub().returns(new jQuery.Deferred().resolve({ value: "bar" }).promise())
        };
        sinon.stub(this.oService, "_getPersistedValue").resolves({});
        sinon.stub(this.oService, "_isRelevantParameter").resolves();
        sinon.stub(this.oService, "_storeValue").resolves();

        var oContext = {
            id: "someContextId"
        };

        // call the getValue before registering the plugin
        this.oService.getValue("foo", oContext)
            .done(function (oValue) {
                assert.equal(oValue.value, "bar", "The expected value was returned by the service!");
            })
            .fail(function (oError) {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);

        // resolve the promise and only then we register the plugin
        this.oService.registerPlugin(oPlugin);
        this.oLoadPluginsDeferred.resolve();
    });

    QUnit.test("_arrayToObject", function (assert) {
        assert.deepEqual(this.oService._arrayToObject(["a", "b", "c"]), {
            a: {},
            b: {},
            c: {}
        }, "values ok");
    });

    QUnit.test("_arrayToObject, empty", function (assert) {
        assert.deepEqual(this.oService._arrayToObject([]), {}, "values ok");
    });

    QUnit.module("sap.ushell.services.UserDefaultParameters", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local");
        },
        // This method is called after each test. Add every restoration code here
        afterEach: function () {
            testUtils.restoreSpies(
                sap.ushell.utils.Error,
                Log.error,
                sap.ushell.Container.getService
            );
            delete sap.ushell.Container;
        }
    });

    function transformParameters (aStringArray) {
        var obj = {
            simple: {},
            extended: {}
        };
        if (!(aStringArray[0] && Array.isArray(aStringArray[0]))) {
            aStringArray = [aStringArray, []];
        }
        aStringArray[0].forEach(function (sParameterName) {
            obj.simple[sParameterName] = {};
        });
        if (aStringArray[1]) {
            aStringArray[1].forEach(function (sParameterName) {
                obj.extended[sParameterName] = {};
            });
        }
        return obj;
    }

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2 contribute each one paramter] ",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: {},
            P2: { editorMetadata: { displayText: "P2Text" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2Text" }
                }
            },
            errCalled: false
        }
    }, {
        description: "[P1,P2 supplied, P3 not filled by plugin contribute each one paramter, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: {},
            P2: { editorMetadata: { displayText: "P2Text" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2Text" }
                },
                P3: { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1Text" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom2" } },
            P2: { editorMetadata: { displayText: "P2TextFrom2" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1Text" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2TextFrom2" }
                },
                P3: { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, sort order, first (highest prio) text is taken ] ",
        parameters: ["P1", "P2", "P3"],
        oComponentDataP1: { config: { "sap-priority": 10 } },
        oComponentDataP2: { config: { "sap-priority": 100 } },
        initial: undefined,
        P1: { value: 111 },
        P1Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom1" } },
            P2: {}
        },
        P2: { value: 333 },
        P2Edit: {
            P1: { editorMetadata: { displayText: "P1TextFrom2" } },
            P2: { editorMetadata: { displayText: "P2TextFrom2" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                P1: {
                    valueObject: { value: 111 },
                    editorMetadata: { displayText: "P1TextFrom2" }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: { displayText: "P2TextFrom2" }
                },
                P3: { valueObject: {} }
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("editorGetParameters integration test" + oFixture.description, function (assert) {
            var done = assert.async();

            var oSystemContext = {
                id: ""
            };

            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.parameters)).promise());
            var oLogErrorSpy = sinon.spy(Log, "error");
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").resolves(oFixture.initial);
            sinon.stub(oService, "_isRelevantParameter").resolves();
            sinon.stub(oService, "_storeValue").resolves();

            // two plugins:
            var oPlugin1 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP1;
                }
            };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            oPlugin1.getEditorMetadata = sinon.stub().returns(new jQuery.Deferred().resolve(oFixture.P1Edit).promise());
            sinon.spy(oPlugin1, "getUserDefault");

            var oPlugin2 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP2;
                }
            };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P2");
            oPlugin2.getEditorMetadata = sinon.stub().returns(new jQuery.Deferred().resolve(oFixture.P2Edit).promise());
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            oService.editorGetParameters(oSystemContext).done(function (oReturnedParameters) {
                assert.deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
                // assure it is a deep copy!
                oFixture.P1.value = 777;
                assert.deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
                if (oFixture.expectedResult.errCalled !== false) {
                    assert.ok(oLogErrorSpy.calledWith("The following parameter names have no editor metadata and thus likely no configured plugin:\n\"P3\"."), " error log called");
                }
                oLogErrorSpy.restore();
            }).fail(function () {
                assert.ok(false, "Promise was supposed to succeed!");
                oLogErrorSpy.restore();
            }).always(done);
        });
    });

    [
        {
            description: "old format, single list",
            aArray: ["P1", "P2"],
            jointArr: ["P1", "P2"],
            extArr: []
        },
        {
            description: "e,u",
            aArray: [["P1", "P2"]],
            jointArr: ["P1", "P2"],
            extArr: []
        },
        {
            description: "a,superset",
            aArray: [["P1", "P2"], ["P1", "P2", "P3"]],
            jointArr: ["P1", "P2", "P3"],
            extArr: ["P1", "P2", "P3"]
        },
        {
            description: "a,sub",
            aArray: [["P1", "P2"], ["P1"]],
            jointArr: ["P1", "P2"],
            extArr: ["P1"]
        },
        {
            description: "disjoint",
            aArray: [["P1", "P3"], ["P2", "P4"]],
            jointArr: ["P1", "P2", "P3", "P4"],
            extArr: ["P2", "P4"]
        },
        {
            description: "empty, list",
            aArray: [[], ["P1"]],
            jointArr: ["P1"],
            extArr: ["P1"]
        }
    ].forEach(function (oFixture) {
        QUnit.test("editorGetParameters parameter processing: " + oFixture.description, function (assert) {
            var done = assert.async();

            var oSystemContext = {
                id: ""
            };

            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.aArray)).promise());
            var oLogErrorSpy = sinon.spy(Log, "error");
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").resolves(oFixture.initial);
            sinon.stub(oService, "_isRelevantParameter").resolves();
            sinon.stub(oService, "_storeValue").resolves();
            var oGetEditorStub = sinon.stub(oService, "_getEditorDataAndValue").callsFake(function (a1, a2, a3, a4) {
                a1.resolve();
                return a1.promise();
            });
            oService.editorGetParameters(oSystemContext).done(function (oReturnedParameters) {
                assert.deepEqual(oGetEditorStub.getCall(0).args[1], oFixture.jointArr, "joint array ok");
                assert.deepEqual(oGetEditorStub.getCall(0).args[2], oFixture.extArr, "extended Array ok");
                oGetEditorStub.restore();
            }).fail(function () {
                assert.ok(false, "Promise was supposed to succeed!");
                oLogErrorSpy.restore();
            }).always(done);
        });
    });

    QUnit.test("editorGetParameters integration test noEdit (no P1, but storage on P1!) [P1,P2 colliding metadata from two plugins, sort order, first (highest prio) text is taken]", function (assert) {
        var done = assert.async();

        var oSystemContext = {
            id: ""
        };

        var oCSTRService = sap.ushell.Container.getService("ClientSideTargetResolution");
        var oParameters = transformParameters([["P1", "P3"], ["P2"]]);
        sinon.stub(oCSTRService, "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oParameters).promise());

        var oLogErrorSpy = sinon.spy(Log, "error");
        var oService = sap.ushell.Container.getService("UserDefaultParameters");
        var oGetPersistedValueStub = sinon.stub(oService, "_getPersistedValue");
        oGetPersistedValueStub.withArgs("P1").resolves({
            noEdit: true,
            alwaysAskPlugin: true,
            value: 111
        });
        oGetPersistedValueStub.withArgs("P2").resolves({ value: 333 });
        oGetPersistedValueStub.withArgs("P3").resolves({
            noEdit: true,
            value: "p3value"
        });

        sinon.stub(oService, "_isRelevantParameter").resolves();
        sinon.stub(oService, "_storeValue").resolves();

        var oP1Edit = {
            P1: { editorMetadata: { displayText: "P1TextFrom1" } }
        };
        var oPlugin1 = {
            getComponentData: sinon.stub().returns({ config: { "sap-priority": 10 } }),
            getUserDefault: makeFunctionIf({ value: 112 }, "P1"),
            getEditorMetadata: sinon.stub().returns(new jQuery.Deferred().resolve(oP1Edit).promise())
        };
        sinon.spy(oPlugin1, "getUserDefault");

        var oP2Edit = {
            P1: { editorMetadata: { displayText: "P1TextFrom2" } },
            P2: { editorMetadata: { displayText: "P2TextFrom2" } }
        };
        var oPlugin2 = {
            getComponentData: sinon.stub().returns({ config: { "sap-priority": 100 } }),
            getUserDefault: makeFunctionIf({ value: 333 }, "P2"),
            getEditorMetadata: sinon.stub().returns(new jQuery.Deferred().resolve(oP2Edit).promise())
        };
        sinon.spy(oPlugin2, "getUserDefault");

        oService.registerPlugin(oPlugin1);
        oService.registerPlugin(oPlugin2);

        oService.editorGetParameters(oSystemContext).done(function (oReturnedParameters) {
            var oExpectedData = {
                P1: {
                    editorMetadata: { displayText: "P1TextFrom2" },
                    valueObject: { value: 112 }
                },
                P2: {
                    valueObject: { value: 333 },
                    editorMetadata: {
                        displayText: "P2TextFrom2",
                        extendedUsage: true
                    }
                }
            };

            assert.deepEqual(oReturnedParameters, oExpectedData, "correct result");
            assert.ok(!oLogErrorSpy.called, "error log not called!");
            assert.equal(oService._storeValue.getCall(0).args[0], "P1", "p1 store called");
            assert.deepEqual(oService._storeValue.getCall(0).args[1], { value: 112 }, "p1 store called with args");
            assert.deepEqual(oService._storeValue.getCall(0).args[2], false, "p1 store called with args");
            assert.deepEqual(oService._storeValue.getCall(0).args[3], oSystemContext, "p1 store called with args");

            oLogErrorSpy.restore();
        }).fail(function () {
            assert.ok(false, "Promise was supposed to succeed!");
            oLogErrorSpy.restore();
        }).always(done);
    });

    // two sample plugins, getValue on Service, check failures of plugins
    // verify behaviour: evaluation continues, error log is raised
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2, first rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: "reject",
        P2: { value: 222 },
        expectedResult: {
            storeCalled: true,
            result: { value: 222 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin 'name of plugin could not be determined' rejected."
        }
    }, {
        description: "[P1 and P2, 2nd rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P2: "reject",
        expectedResult: {
            storeCalled: true,
            result: { value: 111 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin com.sap.p2 rejected."
        }
    }].forEach(function (oFixture) {
        QUnit.test("getValue tests, plugin failures" + oFixture.description, function (assert) {
            var done = assert.async();

            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.parameters)).promise());

            var oContext = {
                id: "someContextId"
            };

            sinon.spy(Log, "error");
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").resolves(oFixture.initial);
            sinon.stub(oService, "_isRelevantParameter").resolves();
            sinon.stub(oService, "_storeValue").resolves();

            var oPlugin1 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP1;
                }
            };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            sinon.spy(oPlugin1, "getUserDefault");

            var oPlugin2 = {
                getComponentData: function () {
                    return oFixture.oComponentDataP2;
                }
            };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P1");
            oPlugin2.getMetadata = function () {
                return {
                    getComponentName: function () {
                        return "com.sap.p2";
                    }
                };
            };
            sinon.spy(oPlugin2, "getUserDefault");

            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);

            oService.getValue("P1", oContext).done(function (oValue) {
                assert.deepEqual(oValue, oFixture.expectedResult.result, "correct result");
                assert.ok(Log.error.called, "error was called");
                assert.equal(Log.error.args[0][0],
                    oFixture.expectedResult.errorMsg, "error was called with proper args");
                Log.error.restore();
            }).fail(function () {
                assert.ok(false, "Promise was supposed to succeed!");
            }).always(done);
        });
    });

    QUnit.test("editorGetParameters no parameters, do not wait for promise", function (assert) {
        var done = assert.async();

        var oSystemContext = {
            id: ""
        };

        sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve({
            simple: {},
            extended: {}
        }).promise());
        var oService = sap.ushell.Container.getService("UserDefaultParameters");

        var oPlugin1 = {
            getUserDefault: makeFunctionIf(undefined, "P1"),
            getEditorMetadata: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
        };
        sinon.spy(oPlugin1, "getUserDefault");

        var oPlugin2 = {
            getUserDefault: makeFunctionIf(undefined, "P2"),
            getEditorMetadata: sinon.stub().returns(new jQuery.Deferred().resolve().promise())
        };
        sinon.spy(oPlugin2, "getUserDefault");
        oService.registerPlugin(oPlugin1);
        oService.registerPlugin(oPlugin2);

        oService.editorGetParameters(oSystemContext).done(function (oReturnedParameters) {
            assert.deepEqual(oReturnedParameters, {}, "correct result");
        }).fail(function () {
            assert.ok(false, "Promise was supposed to succeed!");
        }).always(done);
    });

    QUnit.test("_getComponentNameOfPlugin", function (assert) {
        var oService = sap.ushell.Container.getService("UserDefaultParameters"),
            oPlugin = {};
        assert.deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Empty Object: Expected return value.");
        oPlugin = 5;
        assert.deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Numeric value as plugin: Expected return value.");
        oPlugin = {
            getMetadata: function () {
            }
        };
        assert.deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Plugin without getComponentName: Expected return value.");
        oPlugin = {
            getMetadata: function () {
                return {
                    getComponentName: function () {
                        return "PluginName";
                    }
                };
            }
        };
        assert.deepEqual(oService._getComponentNameOfPlugin(oPlugin), "PluginName", "Plugin with all relevant methods: Expected return value.");
    });

    [{
        description: "hasRelevantMaintainableParameters resolves without an argument",
        userDefaultParameterNames: {},
        noEdit: {
            present: false,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: undefined
    }, {
        description: "hasRelevantMaintainableParameters resolves with true ",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: false,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: true
    }, {
        description: "hasRelevantMaintainableParameters resolves with false, no editable parameters",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: false
        },
        getValueRejects: false,
        expectedResult: false
    }, {
        description: "hasRelevantMaintainableParameters resolves with true",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: true
        },
        getValueRejects: false,
        expectedResult: true
    }, {
        description: "hasRelevantMaintainableParameters resolves without an argument, getValue rejected",
        userDefaultParameterNames: {
            aAllParameterNames: ["foo", "bar"],
            aExtendedParameterNames: ["bar"],
            oMetadataObject: {
                foo: {},
                bar: {}
            }
        },
        noEdit: {
            present: true,
            mixed: true
        },
        getValueRejects: true,
        expectedResult: undefined
    }].forEach(function (oFixture) {
        QUnit.test("hasRelevantMaintainableParameters: " + oFixture.description, function (assert) {
            var oSystemContext = {
                id: ""
            };
            var oService = sap.ushell.Container.getService("UserDefaultParameters");

            sinon.stub(oService, "_getUserDefaultParameterNames").withArgs(oSystemContext).returns(new jQuery.Deferred().resolve(oFixture.userDefaultParameterNames).promise());

            sinon.stub(oService, "getValue").callsFake(function (sParameter) {
                var oDeferred = new jQuery.Deferred();
                if (oFixture.getValueRejects) {
                    oDeferred.reject("failed to retrieve value for given parameter");
                } else if (oFixture.noEdit.present) {
                    if (oFixture.noEdit.mixed) {
                        if (sParameter === "foo") {
                            oDeferred.resolve({ noEdit: true });
                        } else {
                            oDeferred.resolve({});
                        }
                    } else {
                        oDeferred.resolve({ noEdit: true });
                    }
                } else {
                    oDeferred.resolve({});
                }
                return oDeferred.promise();
            });

            return oService.hasRelevantMaintainableParameters(oSystemContext)
                .then(function (bHasRelevantParameters) {
                    assert.strictEqual(oFixture.expectedResult, bHasRelevantParameters, "hasRelevantMaintainableParameters resolves correctly");
                })
                .catch(function () {
                    // hasRelevantMaintainableParameters should never reject
                    assert.ok(false);
                });
        });
    });

    [{
        testDescription: "overlapping lists",
        oParametersAndExtendedParameters: {
            simple: {
                P1: {},
                P2: {}
            },
            extended: {
                P3: {},
                P2: {}
            }
        },
        expected: {
            simple: ["P1", "P2"],
            extended: ["P2", "P3"],
            allParameters: ["P1", "P2", "P3"]
        }
    }, {
        testDescription: "extended empty",
        oParametersAndExtendedParameters: {
            simple: {
                P1: {},
                P2: {}
            },
            extended: {}
        },
        expected: {
            simple: ["P1", "P2"],
            extended: [],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple empty",
        oParametersAndExtendedParameters: {
            simple: {},
            extended: {
                P1: {},
                P2: {}
            }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple undefined",
        oParametersAndExtendedParameters: {
            simple: undefined,
            extended: {
                P1: {},
                P2: {}
            }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }].forEach(function (oFixture) {
        QUnit.test("_extractKeyArrays: result when " + oFixture.testDescription, function (assert) {
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            // act
            var oResult = oService._extractKeyArrays(oFixture.oParametersAndExtendedParameters);
            assert.deepEqual(oResult, oFixture.expected, "result ok");
        });
    });

    [{
        testDescription: "value is deleted from editor",
        sParameterName: "P1",
        oParameterValue: { value: undefined }, // deleted
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {},
            systemContext: {
                id: "systemContextId"
            }
        }
    }, {
        testDescription: "value is entered from editor",
        sParameterName: "P1",
        oParameterValue: { value: "ABCD" },
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {
                _shellData: { storeDate: "<ANY_STRING>" },
                value: "ABCD"
            },
            systemContext: {
                id: "systemContextId"
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("_storeValue(): Correct event fired when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oService = sap.ushell.Container.getService("UserDefaultParameters");

            var oSystemContext = {
                id: "systemContextId"
            };

            var oUserDefaultParametersPersistenceService = {
                saveParameterValue: sinon.stub().returns(jQuery.when())
            };

            var oGetServiceStub = sinon.stub(sap.ushell.Container, "_getService");
            oGetServiceStub.callThrough();

            oGetServiceStub.withArgs("UserDefaultParameterPersistence").callsFake(function (serviceName, param, async) {
                if (async) {
                    return Promise.resolve(oUserDefaultParametersPersistenceService);
                }

                return oUserDefaultParametersPersistenceService;
            });

            oService.attachValueStored(fnListener);
            oService.editorSetValue(oFixture.sParameterName, oFixture.oParameterValue, oSystemContext).always(function () {
                oService.detachValueStored(fnListener);
            });

            function fnListener (oEvent) {
                assert.strictEqual(typeof oEvent, "object", "event listener obtained an object as first argument");
                assert.strictEqual(oEvent.getId(), "valueStored", "event id is 'valueStored'");

                var oParameters = oEvent.getParameters();

                if (oFixture.expectedParameters
                    && oFixture.expectedParameters.parameterValue
                    && oFixture.expectedParameters.parameterValue._shellData
                    && oFixture.expectedParameters.parameterValue._shellData.storeDate === "<ANY_STRING>") {

                    if (!oParameters.parameterValue._shellData) {
                        assert.ok(false, "_shellData was found among event parameters");
                        return;
                    }
                    assert.ok(true, "_shellData was found among event parameters");

                    assert.strictEqual(typeof oParameters.parameterValue._shellData.storeDate, "string", "storeDate is a string");
                    delete oParameters.parameterValue._shellData.storeDate;
                    delete oFixture.expectedParameters.parameterValue._shellData.storeDate;
                }

                assert.deepEqual(oEvent.getParameters(), oFixture.expectedParameters, "event contains the expected parameters");
                done();
            }
        });
    });

    QUnit.test("_storeValue(): ValueStored event registration and fire event", function (assert) {
        var done = assert.async();
        var fnListener,
            oEventResult = { callCount: 0 },
            oService = sap.ushell.Container.getService("UserDefaultParameters"),
            oValue = { value: "Value1" },
            oValue2 = { value: "Value2" };
        fnListener = function (oEvent) {
            oEventResult.callCount += 1;
            oEventResult.parameters = oEvent.getParameters();
        };

        var oSystemContext = {
            id: "systemContextId"
        };

        // code under test (deregistration)
        oService.attachValueStored(fnListener);
        oService.detachValueStored(fnListener);
        oService.editorSetValue("Param1", oValue, oSystemContext).done(function () {
            assert.strictEqual(oEventResult.callCount, 0, "listener not called");
            oService.attachValueStored(fnListener);
            // code under test (registration)
            oService.editorSetValue("Param1", oValue, oSystemContext).done(function () {
                assert.strictEqual(oEventResult.callCount, 1, "listener called once");
                assert.deepEqual(oEventResult.parameters.parameterName, "Param1", "Event fired with correct parameter name.");
                assert.deepEqual(oEventResult.parameters.parameterValue, oValue, "Event fired with correct value object.");
                // code under test (listener called twice )
                oService.editorSetValue("Param2", oValue2, oSystemContext).done(function () {
                    assert.strictEqual(oEventResult.callCount, 2, "listener called twice");
                    assert.deepEqual(oEventResult.parameters.parameterName, "Param2", "Event fired with correct parameter name.");
                    assert.deepEqual(oEventResult.parameters.parameterValue, oValue2, "Event fired with correct value object.");
                    done();
                });
            });
        });
    });

    [{
        description: " Simple, no deletion",
        valueObject: { value: "1000" },
        inExtendedUse: false,
        expectDeletion: false
    }, {
        description: " Simple value is initial deletion",
        valueObject: { value: undefined },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Extended, Extended in Use, no deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: true,
        expectDeletion: false
    }, {
        description: " Extended, Extended Not in Use, deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Simple Extended, Extended in Use, no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { a: 1 }
        },
        inExtendedUse: true,
        expectDeletion: false,
        expectedSavedValue: {
            value: "1000",
            extendedValue: { a: 1 }
        }
    }, {
        description: " Simple Extended, Extended Not in Use, no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { a: 1 }
        },
        inExtendedUse: false,
        expectDeletion: false,
        expectedSavedValue: { value: "1000" }
    }].forEach(function (oFixture) {
        QUnit.test("_storeValue(): parameter deletion when " + oFixture.description, function (assert) {
            var done = assert.async();
            var oUserDefaultParametersService = sap.ushell.Container.getService("UserDefaultParameters");
            var oClientSideTargetResolutionService = sap.ushell.Container.getService("ClientSideTargetResolution");
            var oGetUserDefaultParamNamesResult = {
                simple: {},
                extended: {}
            };

            var oSystemContext = {
                id: "systemContextId"
            };

            if (oFixture.inExtendedUse) {
                oGetUserDefaultParamNamesResult.extended.P1 = {};
            }
            oGetUserDefaultParamNamesResult.simple.P1 = {};

            sinon.stub(sap.ushell.Container.getService("UserDefaultParameterPersistence"), "saveParameterValue").callsFake(function () {
                return new jQuery.Deferred().resolve().promise();
            });
            sinon.stub(oClientSideTargetResolutionService, "getUserDefaultParameterNames").withArgs(oSystemContext).returns(new jQuery.Deferred().resolve(oGetUserDefaultParamNamesResult).promise());
            // code under test (deregistration)
            oUserDefaultParametersService._storeValue("P1", oFixture.valueObject, true, oSystemContext).then(function () {
                assert.equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][0], "P1", "correct parameter name");
                if (oFixture.expectDeletion) {
                    assert.equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1], undefined, "value undefined");
                } else {
                    assert.ok(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1] !== undefined, "value not undefined");
                    if (!oFixture.expectedSavedValue) {
                        oFixture.expectedSavedValue = oFixture.valueObject;
                    }
                    assert.equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1].value, oFixture.expectedSavedValue.value, "correct value persisted");
                    assert.deepEqual(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1].extendedValue, oFixture.expectedSavedValue.extendedValue, "correct extended value persisted");
                }
            }).catch(function (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                assert.ok(false, "Promise rejected. Please check the console for errors.");
            }).then(function () {
                sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.restore();
                done();
            });
        });
    });

    QUnit.test("UserDefaultService plugin invocation flow", function (assert) {
        var done = assert.async();
        var oLogErrorSpy = sinon.spy(Log, "error");
        var oService = sap.ushell.Container.getService("UserDefaultParameters");

        sinon.stub(oService, "_getStoreDate").returns("11.11.2016");
        sinon.spy(oService, "_getPersistedValue");
        sinon.stub(oService, "_isRelevantParameter").resolves();
        sinon.spy(oService, "_storeValue");

        var oPlugin = {
            getComponentData: function () {
                return {
                    config: {
                        "sap-priority": 10
                    }
                };
            }
        };
        oPlugin.getUserDefault = makeFunctionIf({ value: undefined }, "P1");
        var oPluginCall = sinon.spy(oPlugin, "getUserDefault");
        oService.registerPlugin(oPlugin);

        var oSystemContext = {
            id: "systemContextId"
        };

        sap.ushell.Container.getService("UserDefaultParameterPersistence").deleteParameter("P1", oSystemContext).done(function () {
            // (1) Call getValue the first time
            oService.getValue("P1", oSystemContext).done(function (oReturnedParameters) {
                assert.ok(true, "promise was resolved after first call to #getValue('P1')");
                assert.equal(oPluginCall.callCount, 1, "Plugin #getUserDefault method invoked");
                assert.equal(oReturnedParameters.value, undefined, "Plugin 1 #getValue returned undefined");
                assert.equal(oService._storeValue.getCall(0) && oService._storeValue.getCall(0).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                assert.deepEqual(oService._storeValue.getCall(0) && oService._storeValue.getCall(0).args[1], {
                    _shellData: { storeDate: "11.11.2016" },
                    value: undefined
                }, "#_storeValue was called with the expected second argument");

                // (2) Call getValue the second time
                oService.getValue("P1", oSystemContext).done(function (oReturnedParameters2) {
                    assert.ok(true, "promise was resolved after second call to #getValue('P1')");
                    assert.equal(oPluginCall.callCount, 1, "Plugin #getUserDefault was not invoked the second time");
                    assert.equal(oReturnedParameters2.value, undefined, "promise was resolved to 'undefined'");

                    assert.equal(oService._storeValue.callCount, 1, "#_storeValue was not called");

                    oService.editorSetValue("P1", { value: undefined }, oSystemContext).done(function () {
                        assert.ok(true, "promise was resolved after value 'P1' was set to '{ value: undefined }' via #editorSetValue");
                        assert.equal(oService._storeValue.callCount, 2, "#_storeValue was called after parameter was re-set");
                        assert.equal(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                        assert.deepEqual(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[1], { value: undefined }, "#_storeValue was called with '{ value: undefined }' as second argument");
                        assert.deepEqual(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[2], true, "#_storeValue was called with 'true' (bFromEditor) as third argument");

                        // (3) Call getValue the third time
                        oService.getValue("P1", oSystemContext).done(function () {
                            assert.ok(true, "promise was resolved after third call to #getValue('P1')");

                            assert.equal(oPluginCall.callCount, 2, "Plugin #getUserDefault was invoked the third time");
                            assert.equal(oService._storeValue.callCount, 3, "#_storeValue was called");
                            assert.equal(oService._storeValue.getCall(2) && oService._storeValue.getCall(2).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                            assert.deepEqual(oService._storeValue.getCall(2) && oService._storeValue.getCall(2).args[1], {
                                _shellData: {
                                    storeDate: "11.11.2016"
                                },
                                value: undefined
                            }, "#_storeValue was called with { _shellData: { storeData: '11.11.2016' }, value: undefined }");

                            done();
                        }).fail(function () {
                            done();
                            assert.ok(false, "promise was resolved after third call to #getValue('P1')");
                            oLogErrorSpy.restore();
                        });
                    }).fail(function () {
                        done();
                        assert.ok(false, "promise was resolved after value 'P1' was set to '{ value: undefined }' via #editorSetValue");
                        oLogErrorSpy.restore();
                    });
                }).fail(function () {
                    done();
                    assert.ok(false, "promise was resolved after second call to #getValue('P1')");
                    oLogErrorSpy.restore();
                });
            }).fail(function () {
                done();
                assert.ok(false, "promise was resolved after first call to #getValue('P1')");
                oLogErrorSpy.restore();
            });
        });
    });

    QUnit.test("_getUserDefaultParameterNames with plain parameters only", function (assert) {
        var done = assert.async();
        var oUserDefaultNames = {
            simple: { P2: {} },
            extended: {
                P1: {},
                P3: {}
            }
        };
        var oSystemContext = {
            id: ""
        };

        sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oUserDefaultNames).promise());

        var oService = sap.ushell.Container.getService("UserDefaultParameters");
        oService._getUserDefaultParameterNames(oSystemContext).done(function (oResult) {
            assert.deepEqual(oResult, {
                aAllParameterNames: [
                    "P1",
                    "P2",
                    "P3"
                ],
                aExtendedParameterNames: [
                    "P1",
                    "P3"
                ],
                oMetadataObject: {
                    P1: {},
                    P2: {},
                    P3: {}
                }
            }, "correct result");
        }).fail(function () {
            assert.ok(false, "Promise was supposed to succeed!");
        }).always(done);
    });

    QUnit.test("_getUserDefaultParameterNames with empty parameters", function (assert) {
        var done = assert.async();
        var oUserDefaultNames = {
            simple: {},
            extended: {}
        };
        var oSystemContext = {
            id: ""
        };

        sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oUserDefaultNames).promise());

        var oService = sap.ushell.Container.getService("UserDefaultParameters");
        oService._getUserDefaultParameterNames(oSystemContext).done(function (oResult) {
            assert.deepEqual(oResult, {
                aAllParameterNames: [],
                aExtendedParameterNames: [],
                oMetadataObject: {}
            }, "correct result");
        }).fail(function () {
            assert.ok(false, "Promise was supposed to succeed!");
        }).always(done);
    });

    QUnit.test("_getUserDefaultParameterNames with a parameter categorized as simple and extended", function (assert) {
        var done = assert.async();
        var oUserDefaultNames = {
            simple: { P2: {} },
            extended: {
                P2: {},
                P3: {}
            }
        };
        var oSystemContext = {
            id: ""
        };

        sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oUserDefaultNames).promise());

        var oService = sap.ushell.Container.getService("UserDefaultParameters");
        oService._getUserDefaultParameterNames(oSystemContext).done(function (oResult) {
            assert.deepEqual(oResult, {
                aAllParameterNames: ["P2", "P3"],
                aExtendedParameterNames: ["P2", "P3"],
                oMetadataObject: {
                    P2: {},
                    P3: {}
                }
            }, "correct result");
        }).fail(function () {
            assert.ok(false, "Promise was supposed to succeed!");
        }).always(done);
    });

    QUnit.module("The function _isRelevantParameter", {
        beforeEach: function () {
            this.oDefaultParameterNames = {
                simple: { P2: {} },
                extended: {
                    P2: {},
                    P3: {}
                }
            };

            this.oSystemContext = {
                id: ""
            };

            this.oGetDefaultParameterNamesStub = sinon.stub();
            this.oGetDefaultParameterNamesStub.returns(new jQuery.Deferred().resolve(this.oDefaultParameterNames).promise());
            var oCSTRServiceMock = {
                getUserDefaultParameterNames: this.oGetDefaultParameterNamesStub
            };

            sap.ushell.Container = {
                getService: sinon.stub().returns(oCSTRServiceMock)
            };

            this.oService = new UserDefaultParameters();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Resolves if the given extended parameter exists in the parameter object", function (assert) {
        return this.oService._isRelevantParameter("P3", this.oSystemContext)
            .then(function () {
                assert.ok(true, "The promise has been resolved.");
            });
    });

    QUnit.test("Resolves if the given simple parameter exists in the parameter object", function (assert) {
        this.oDefaultParameterNames.simple = { P1: {} };

        return this.oService._isRelevantParameter("P1", this.oSystemContext)
            .then(function () {
                assert.ok(true, "The promise has been resolved.");
            });
    });

    QUnit.test("Rejects if the given parameter does not exist in the parameter object", function (assert) {
        return this.oService._isRelevantParameter("P7", this.oSystemContext)
            .then(function () {
                assert.ok(false, "The promise should have been rejected.");
            })
            .catch(function () {
                assert.ok(true, "The promise was rejected.");
            });
    });

    QUnit.module("Invocation of plugins' getUserDefault function", {
        beforeEach: function () {
            this.oService = new UserDefaultParameters();

            this.oLogErrorStub = sinon.stub(Log, "error");

            var oGetServiceStub = sinon.stub();
            this.oLoadPluginsStub = sinon.stub();
            this.oLoadPluginsStub.returns(new jQuery.Deferred().resolve().promise());
            oGetServiceStub.withArgs("PluginManager").returns({
                loadPlugins: this.oLoadPluginsStub
            });

            sap.ushell.Container = {
                getService: oGetServiceStub
            };

            this.oGetPersistedValueStub = sinon.stub(this.oService, "_getPersistedValue");
            this.oGetPersistedValueStub.rejects();
            this.oIsRelevantParameterStub = sinon.stub(this.oService, "_isRelevantParameter");
            this.oIsRelevantParameterStub.resolves();
            sinon.stub(this.oService, "_storeValue").resolves();

            this.oPlugin1Deferred = new jQuery.Deferred();
            this.oPlugin1GetUserDefaultStub = sinon.stub().returns(this.oPlugin1Deferred.promise());
            this.oPlugin1 = {
                getUserDefault: this.oPlugin1GetUserDefaultStub
            };

            this.oPlugin2Deferred = new jQuery.Deferred();
            this.oPlugin2GetUserDefaultStub = sinon.stub().returns(this.oPlugin2Deferred.promise());
            this.oPlugin2 = {
                getUserDefault: this.oPlugin2GetUserDefaultStub
            };

            this.oService.registerPlugin(this.oPlugin1);
            this.oService.registerPlugin(this.oPlugin2);

            this.oSystemContext = { id: "someContextId" };
        },
        afterEach: function () {
            this.oLogErrorStub.restore();

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Logs an error message if the plugin manager fails to load the plugins", function (assert) {
        var done = assert.async();

        // Arrange
        this.oLoadPluginsStub.returns(new jQuery.Deferred().reject().promise());

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function () {
                // Assert
                assert.ok(false, "The promise should have been rejected.");
            })
            .fail(function (sError) {
                assert.strictEqual(sError, "Initialization of plugins failed", "The correct error message was passed into the handler.");
                assert.strictEqual(this.oLogErrorStub.callCount, 1, "The Log.error function has been called once.");
                assert.deepEqual(this.oLogErrorStub.firstCall.args, [
                    "Cannot get value for MYVALUE. One or more plugins could not be loaded."
                ], "The Log.error function has been called with the correct parameters.");
            }.bind(this))
            .always(done);
    });

    QUnit.test("No initial value exists, the first plugin rejects, the second plugin resolves with a value", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves();
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.resolve({ value: 333 });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: 333 }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Parameters are not relevant", function (assert) {
        var done = assert.async();
        var oExpectedValue = {value: undefined};

        // Arrange
        this.oIsRelevantParameterStub.rejects();

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, oExpectedValue, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists, the first plugin rejects, the second plugin resolves with a value", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            noStore: true
        });
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.resolve({
            value: 333,
            noStore: true
        });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, {
                    value: 333,
                    noStore: true
                }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin resolves with a value", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.resolve({
            value: 333,
            noStore: true
        });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, {
                    value: 333,
                    noStore: true
                }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin rejects", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.reject();

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: "AAA" }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists, the first plugin resolves with a value, the second plugin resolves with undefined", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            noStore: "XXX"
        });
        this.oPlugin1Deferred.resolve({ value: "AAA" });
        this.oPlugin2Deferred.resolve({ value: undefined });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: undefined }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists and both plugins provide the same value", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({ value: "ABC" });
        this.oPlugin2Deferred.resolve({ value: "ABC" });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: "ABC" }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists and all values are equal", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            _shellData: "1",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.resolve({
            value: "ABC",
            alwaysAskPlugin: true
        });
        this.oPlugin2Deferred.resolve({
            value: "ABC",
            alwaysAskPlugin: true
        });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, {
                    value: "ABC",
                    alwaysAskPlugin: true
                }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Initial value exists and both plugins reject", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.resolves({
            value: "ABC",
            _shellData: "1",
            alwaysAskPlugin: true
        });
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.reject();

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, {
                    value: "ABC",
                    alwaysAskPlugin: true,
                    _shellData: "1"
                }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 0, "The function _storeValue has not been called.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("No initial value exists and both plugins reject", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1Deferred.reject();
        this.oPlugin2Deferred.reject();

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: undefined }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Receives the system context parameter", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1Deferred.resolve();
        this.oPlugin2Deferred.resolve();

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(this.oPlugin1GetUserDefaultStub.firstCall.args, [
                    "MYVALUE", { value: undefined }, this.oSystemContext
                ], "The getUserDefault function received the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.test("Skips a plugin that does not have a getUserDefault function", function (assert) {
        var done = assert.async();

        // Arrange
        this.oGetPersistedValueStub.rejects();
        this.oPlugin1.getUserDefault = "oh noez";
        this.oPlugin2Deferred.resolve({ value: 333 });

        // Act
        this.oService.getValue("MYVALUE", this.oSystemContext)
            .done(function (oValue) {
                // Assert
                assert.deepEqual(oValue, { value: 333 }, "The correct value has been found.");
                assert.strictEqual(this.oService._storeValue.callCount, 1, "The function _storeValue has been called once.");
                assert.deepEqual(this.oService._storeValue.args[0], [
                    "MYVALUE", oValue, false, this.oSystemContext
                ], "The function _storeValue has been called with the correct parameters.");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "The promise should have been resolved.");
            })
            .always(done);
    });

    QUnit.module("The _storeValue function", {
        beforeEach: function () {
            this.oUserDefaultParametersService = new UserDefaultParameters();
            this.oSaveParameterValueStub = sinon.stub(this.oUserDefaultParametersService, "_saveParameterValue");
            this.oGetServiceStub = sinon.stub().rejects();
            this.oExtractKeyArraysStub = sinon.stub(this.oUserDefaultParametersService, "_extractKeyArrays");

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceStub
            };

            this.oContext = { id: "someContextId" };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls _saveParameterValue if not invoked from editor with the correct parameters", function (assert) {
        // Arrange
        var oValue = {};

        // Act
        this.oUserDefaultParametersService._storeValue("P", oValue, false, this.oContext);

        // Assert
        assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
        assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
    });

    QUnit.test("Returns the result of _saveParameterValue", function (assert) {
        // Arrange
        var oReturnValue = {};
        this.oSaveParameterValueStub.returns(oReturnValue);

        // Act
        var oResult = this.oUserDefaultParametersService._storeValue("P", {}, false, this.oContext);

        // Assert
        assert.strictEqual(oResult, oReturnValue, "The function _saveParameterValues has returned the correct reference.");
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor without an extendedValue", function (assert) {
        // Arrange
        var oValue = {
            extendedValue: {}
        };
        this.oGetServiceStub.resolves({
            getUserDefaultParameterNames: sinon.stub().returns(new jQuery.Deferred().resolve())
        });

        var oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        this.oExtractKeyArraysStub.returns({
            extended: []
        });

        // Act
        return this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetServiceStub.callCount, 1, "The function getServiceAsync has been called once.");
                assert.deepEqual(this.oGetServiceStub.firstCall.args, ["ClientSideTargetResolution"], "The function getServiceAsync has been with the correct parameters.");

                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], true, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
            }.bind(this))
            .catch(function (oError) {
                // eslint-disable-next-line no-console
                console.error(oError);
                assert.ok(false, "The promise has been rejected.");
            });
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor with an extendedValue", function (assert) {
        // Arrange
        var oValue = {
            extendedValue: {}
        };
        this.oGetServiceStub.resolves({
            getUserDefaultParameterNames: sinon.stub().returns(new jQuery.Deferred().resolve())
        });

        var oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        this.oExtractKeyArraysStub.returns({
            extended: ["P"]
        });

        // Act
        return this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext)
            .then(function (oResolvedValue) {
                // Assert
                assert.strictEqual(oResolvedValue, oResult, "The correct value has been resolved.");

                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
            }.bind(this))
            .catch(function (oError) {
                // eslint-disable-next-line no-console
                console.error(oError);
                assert.ok(false, "The promise has been rejected.");
            });
    });

    QUnit.test("Calls _saveParameterValue if invoked from editor if no user default parameters are found", function (assert) {
        // Arrange
        var oValue = {
            extendedValue: {}
        };

        this.oGetServiceStub.resolves({
            getUserDefaultParameterNames: sinon.stub().returns(new jQuery.Deferred().reject())
        });

        var oResult = {};
        this.oSaveParameterValueStub.resolves(oResult);

        // Act
        return this.oUserDefaultParametersService._storeValue("P", oValue, true, this.oContext)
            .then(function (oResolvedValue) {
                // Assert
                assert.strictEqual(oResolvedValue, oResult, "The correct value has been resolved.");

                assert.strictEqual(this.oSaveParameterValueStub.callCount, 1, "The function _saveParameterValue has been called once.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "P", "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], oValue, "The correct reference was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], true, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], false, "The correct value was found.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[4], this.oContext, "The correct reference was found.");
            }.bind(this))
            .catch(function (oError) {
                // eslint-disable-next-line no-console
                console.error(oError);
                assert.ok(false, "The promise has been rejected.");
            });
    });

    QUnit.module("The _saveParameterValue function", {
        beforeEach: function () {
            this.oFireEventStub = sinon.stub(EventProvider.prototype, "fireEvent");

            this.oUserDefaultParametersService = new UserDefaultParameters();
            this.oIsInitialStub = sinon.stub(this.oUserDefaultParametersService, "_valueIsEmpty");
            this.oGetStoreDateStub = sinon.stub(this.oUserDefaultParametersService, "_getStoreDate");

            this.oSaveParameterValueStub = sinon.stub().returns(new jQuery.Deferred().resolve().promise());
            var oUserDefaultParameterPersistenceService = {
                saveParameterValue: this.oSaveParameterValueStub
            };
            this.oGetServiceStub = sinon.stub().resolves(oUserDefaultParameterPersistenceService);

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceStub
            };

            this.oSystemContext = {
                id: "systemContextId"
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oFireEventStub.restore();
        }
    });

    QUnit.test("Resolves with the property name", function (assert) {
        // Arrange
        var oValue = {
            _shellData: {}
        };

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P. R. Operty", oValue, undefined, undefined, this.oSystemContext)
            .then(function (sPropertyName) {
                // Assert
                assert.strictEqual(sPropertyName, "P. R. Operty", "The correct value has been resolved.");
            });
    });

    QUnit.test("Resolves if saveParameterValue fails", function (assert) {
        // Arrange
        var oValue = {
            _shellData: {}
        };
        this.oSaveParameterValueStub.returns(new jQuery.Deferred().reject().promise());

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P. R. Operty", oValue, undefined, undefined, this.oSystemContext)
            .then(function (sPropertyName) {
                // Assert
                assert.strictEqual(sPropertyName, "P. R. Operty", "The correct value has been resolved.");
            });
    });

    QUnit.test("Adds the store date to the given _shellData object", function (assert) {
        // Arrange
        var oValue = {
            _shellData: {}
        };

        this.oGetStoreDateStub.returns("just now");

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P", oValue, false, false, this.oSystemContext)
            .then(function () {
                // Assert
                assert.deepEqual(this.oSaveParameterValueStub.firstCall.args, [
                    "P", oValue, this.oSystemContext
                ], "The function saveParameterValue has been called with the correct parameters.");
                assert.strictEqual(oValue._shellData.storeDate, "just now", "The correct date value has been added.");
            }.bind(this));
    });

    QUnit.test("Copies the _shellData property to add the store date", function (assert) {
        // Arrange
        var oShellData = {};
        var oValue = {
            _shellData: oShellData
        };

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P", oValue, undefined, undefined, this.oSystemContext)
            .then(function () {
                // Assert
                assert.notStrictEqual(oValue._shellData, oShellData, "A new object reference is used.");
            });
    });

    QUnit.test("Removes the extendedValue property's value", function (assert) {
        // Arrange
        var oValue = {
            extendedValue: "foo",
            _shellData: {}
        };

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P", oValue, false, true, this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(oValue.extendedValue, undefined, "The extendedValue property is undefined.");
            });
    });

    QUnit.test("Triggers the valueStored event", function (assert) {
        // Arrange
        var oValue = {
            _shellData: {}
        };

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P", oValue, undefined, undefined, this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oFireEventStub.callCount, 1, "The function fireEvent has been called once.");
                assert.deepEqual(this.oFireEventStub.firstCall.args, [
                    "valueStored",
                    {
                        parameterName: "P",
                        parameterValue: {
                            _shellData: {
                                storeDate: undefined
                            }
                        },
                        systemContext: {
                            id: "systemContextId"
                        }
                    }
                ], "The function fireEvent has been called with the correct parameters.");
            }.bind(this));
    });

    QUnit.test("Passes undefined as the value if it has an initial state to saveParameterValue", function (assert) {
        // Arrange
        var oValue = {
            _shellData: {}
        };
        this.oIsInitialStub.returns(true);

        // Act
        return this.oUserDefaultParametersService._saveParameterValue("P", oValue, true, undefined, this.oSystemContext)
            .then(function () {
                // Assert
                assert.deepEqual(this.oSaveParameterValueStub.firstCall.args, [
                    "P", undefined, this.oSystemContext
                ], "The function saveParameterValue has been called with the correct parameters.");
                assert.deepEqual(this.oUserDefaultParametersService._oWasParameterPersisted, { P: false }, "The correct object structure has been found.");
                assert.deepEqual(oValue, { _shellData: {} }, "The correct object structure has been found.");
            }.bind(this));
    });

    QUnit.module("The function _getPersistedValue", {
        beforeEach: function () {
            this.oUserDefaultParametersService = new UserDefaultParameters();

            this.oLoadParameterValueStub = sinon.stub();
            var oUserDefaultParameterPersistenceService = {
                loadParameterValue: this.oLoadParameterValueStub
            };
            this.oGetServiceStub = sinon.stub().resolves(oUserDefaultParameterPersistenceService);

            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceStub
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Passes the parameters through and resolves with the inner call's value", function (assert) {
        // Arrange
        this.oLoadParameterValueStub.returns(new jQuery.Deferred().resolve("\\^_^/").promise());
        var oContext = {};

        // Act
        return this.oUserDefaultParametersService._getPersistedValue("P", oContext)
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, "\\^_^/", "The correct value was found.");
                assert.deepEqual(this.oLoadParameterValueStub.firstCall.args, [
                    "P", oContext
                ], "The function loadParameterValue has been called with the correct parameters.");
                assert.strictEqual(this.oLoadParameterValueStub.firstCall.args[1], oContext, "The function loadParameterValue has been called with the correct reference.");
            }.bind(this));
    });

    QUnit.test("Passes the parameters through and rejects with the inner call's error", function (assert) {
        // Arrange
        this.oLoadParameterValueStub.returns(new jQuery.Deferred().reject("ö_ö").promise());
        var oContext = {};

        // Act
        return this.oUserDefaultParametersService._getPersistedValue("P", oContext)
            .catch(function (oResult) {
                // Assert
                assert.strictEqual(oResult, "ö_ö", "The correct value was found.");
                assert.deepEqual(this.oLoadParameterValueStub.firstCall.args, [
                    "P", oContext
                ], "The function loadParameterValue has been called with the correct parameters.");
                assert.strictEqual(this.oLoadParameterValueStub.firstCall.args[1], oContext, "The function loadParameterValue has been called with the correct reference.");
            }.bind(this));
    });
});
