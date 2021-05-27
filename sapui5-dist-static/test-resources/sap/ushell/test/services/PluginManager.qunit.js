// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.PluginManager
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/base/util/UriParameters",
    "sap/ui/Device",
    "sap/ushell/utils",
    "sap/base/Log"
], function (testUtils, UriParameters, Device, ushellUtils, Log) {
    "use strict";

    /* global asyncTest, deepEqual, equal, strictEqual, module, ok, start, sinon, QUnit */

    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.services.PluginManager", {
        setup: function () { },
        teardown: function () {
            testUtils.restoreSpies(
                sap.ui.component,
                sap.ushell.Container.setXhrLogonTimeout,
                jQuery.ajax,
                jQuery.sap.require,
                Log.error
            );
            delete sap.ushell.Container;
        }
    });

    asyncTest("constructor, method signatures", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            start();
            var oPluginManager = sap.ushell.Container.getService("PluginManager");

            [
                "registerPlugins",
                "getSupportedPluginCategories",
                "getRegisteredPlugins",
                "loadPlugins",
                "_handlePluginCreation",
                "_instantiateComponent"
            ].forEach(function (sFunctionName) {
                equal(typeof oPluginManager[sFunctionName], "function", "function " + sFunctionName + " present");
            });
        });
    });

    [{
        sDescription: "Empty set of plugins",
        oPlugins: {},
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        }
    }, {
        sDescription: "Undefined set of plugins",
        oPlugins: undefined,
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        },
        bConsoleLogExpected: false
    }, {
        sDescription: "Only plugins without a configuration",
        oPlugins: {
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component"
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {
                testPlugin1: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component"
                },
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },
            UserDefaults: {},
            UserImage: {}
        }
    }, {
        sDescription: "Only plugins having a supported sap-ushell-plugin-type parameter set",
        oPlugins: {
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {
                testPlugin1: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            },
            UserDefaults: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },
            UserImage: {}
        }
    }, {
        sDescription: "Only plugins having an unsupported sap-ushell-plugin-type parameter set",
        oPlugins: {
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: {
                    "sap-ushell-plugin-type": "AnotherInvalidType"
                }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: {
                    "sap-ushell-plugin-type": "AnotherInvalidType"
                }
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {},
            UserDefaults: {},
            UserImage: {}
        }
    }, {
        sDescription: "Mix of plugins with unsupported or supported sap-ushell-plugin-type's",
        oPlugins: {
            testPlugin1: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AnotherInvalidType" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },
            testPlugin3: {
                component: "sap.test.TestComponent3",
                url: "/sap/test/url/to/Component3",
                config: { "sap-ushell-plugin-type": "RendererExtensions" }
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {
                testPlugin3: {
                    component: "sap.test.TestComponent3",
                    enabled: true,
                    url: "/sap/test/url/to/Component3",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            },
            UserDefaults: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },
            UserImage: {}
        }
    }, {
        sDescription: "Target Mapping overrules the runtime adaptation plugin to be disabled",
        oPlugins: {
            testPlugin: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            },
            RuntimeAdaptationPlugin: {
                component: "sap.ushell.plugins.rta-personalize",
                enabled: false
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },
            UserDefaults: {
                testPlugin: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },
            UserImage: {}
        }
    }, {
        sDescription: "Runtime adaptation plugin gets configured and attached by the HTML file as it wasn't configured by an admin",
        oPlugins: {
            testPlugin: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "UserDefaults" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            },
            UiAdaptationPersonalization: { component: "sap.ushell.plugins.rta-personalize" }
        },
        oExpectedPluginCollection: {
            AppWarmup: {},
            ContentProvider: {},
            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                },
                UiAdaptationPersonalization: {
                    component: "sap.ushell.plugins.rta-personalize",
                    enabled: true
                }
            },
            UserDefaults: {
                testPlugin: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                }
            },
            UserImage: {}
        }
    }, {
        sDescription: "App Warmup plugin gets registered correctly",
        oPlugins: {
            appWarmup: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AppWarmup" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        },
        oExpectedPluginCollection: {
            AppWarmup: {
                appWarmup: {
                    component: "sap.test.TestComponent",
                    enabled: true,
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "AppWarmup" }
                }
            },
            ContentProvider: {},
            RendererExtensions: {
                testPlugin2: {
                    component: "sap.test.TestComponent2",
                    enabled: true,
                    url: "/sap/test/url/to/Component2"
                }
            },
            UserDefaults: {},
            UserImage: {}
        }
    }].forEach(function (oFixture) {
        asyncTest("registerPlugins: " + oFixture.sDescription, function () {
            sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
                start();
                var oPluginManager = sap.ushell.Container.getService("PluginManager");

                oPluginManager.registerPlugins(oFixture.oPlugins);

                deepEqual(oPluginManager.getRegisteredPlugins(), oFixture.oExpectedPluginCollection, "Correct plugins registered");
            });
        });
    });

    asyncTest("do not load Plugins if parameter sap-ushell-xx-pluginmode is set to discard: ", function () {
        var oPlugins = {
            appWarmup: {
                component: "sap.test.TestComponent",
                url: "/sap/test/url/to/Component",
                config: { "sap-ushell-plugin-type": "AppWarmup" }
            },
            testPlugin2: {
                component: "sap.test.TestComponent2",
                url: "/sap/test/url/to/Component2"
            }
        };
        var oUriParametersStub = sinon.stub(UriParameters.prototype, "get", function () {
            return "discard";
        });
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {

            var oPluginManager = sap.ushell.Container.getService("PluginManager");
            var oHandlePluginCreationStub = sinon.stub(oPluginManager, "_handlePluginCreation");
            oPluginManager.registerPlugins(oPlugins);

            oPluginManager.loadPlugins("AppWarmup");
            start();
            equal(oPluginManager._handlePluginCreation.calledOnce, false, "warmup filtered");
            oHandlePluginCreationStub.restore();
            oUriParametersStub.restore();
        });
    });

    asyncTest("registerPlugins: Mix of plugins with plugins defined as modules, unsupported or supported sap-ushell-plugin-type's for UI5 components", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oJQuerySapRequireStub = sinon.stub(jQuery.sap, "require", function () { }),
                oPlugins = {
                    testPlugin1: {
                        component: "sap.test.TestComponent",
                        url: "/sap/test/url/to/Component",
                        config: { "sap-ushell-plugin-type": "AnotherInvalidType" }
                    },
                    testPlugin2: {
                        module: "sap.test.TestComponent2",
                        url: "/sap/test/url/to/Component2"
                    },
                    testPlugin3: {
                        component: "sap.test.TestComponent3",
                        url: "/sap/test/url/to/Component3",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" }
                    },
                    testPlugin4: {
                        module: "sap.test.TestComponent4",
                        url: "/sap/test/url/to/Component4"
                    },
                    testPlugin5: {
                        component: "sap.test.TestComponent5",
                        url: "/sap/test/url/to/Component5",
                        config: { "sap-ushell-plugin-type": "UserDefaults" }
                    }
                },
                oExpectedPluginCollection = {
                    AppWarmup: {},
                    ContentProvider: {},
                    RendererExtensions: {
                        testPlugin3: {
                            component: "sap.test.TestComponent3",
                            enabled: true,
                            url: "/sap/test/url/to/Component3",
                            config: { "sap-ushell-plugin-type": "RendererExtensions" }
                        }
                    },
                    UserDefaults: {
                        testPlugin5: {
                            component: "sap.test.TestComponent5",
                            enabled: true,
                            url: "/sap/test/url/to/Component5",
                            config: { "sap-ushell-plugin-type": "UserDefaults" }
                        }
                    },
                    UserImage: {}
                };

            oPluginManager.registerPlugins(oPlugins);

            start();
            ok(oJQuerySapRequireStub.calledTwice, "The direct loading of two plugins defined as modules was triggered correctly");
            deepEqual(oPluginManager.getRegisteredPlugins(), oExpectedPluginCollection, "Correct plugins registered");
        });
    });

    QUnit.test("registerPlugins: form factor is considered", function (assert) {
        var fnDone = assert.async();
        sap.ushell.bootstrap("local").fail(function () {
            assert.ok(false, "There is a problem with sap.ushell.bootstrap(\"local\")");
            fnDone();
        }).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oPlugins = {
                    testPlugin0: {
                        component: "sap.test.TestComponent0",
                        url: "/sap/test/url/to/Component0",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" }
                    },
                    testPlugin1: {
                        component: "sap.test.TestComponent1",
                        url: "/sap/test/url/to/Component1",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        deviceTypes: {
                            desktop: false,
                            tablet: false,
                            phone: true
                        }
                    },
                    testPlugin2: {
                        component: "sap.test.TestComponent2",
                        url: "/sap/test/url/to/Component2",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        deviceTypes: {
                            desktop: true,
                            tablet: true,
                            phone: true
                        }
                    }
                },
                oExpectedPluginCollection = {
                    AppWarmup: {},
                    ContentProvider: {},
                    RendererExtensions: {
                        testPlugin0: {
                            component: "sap.test.TestComponent0",
                            url: "/sap/test/url/to/Component0",
                            enabled: true,
                            config: { "sap-ushell-plugin-type": "RendererExtensions" }
                        },
                        testPlugin2: {
                            component: "sap.test.TestComponent2",
                            url: "/sap/test/url/to/Component2",
                            enabled: true,
                            config: { "sap-ushell-plugin-type": "RendererExtensions" },
                            deviceTypes: {
                                desktop: true,
                                tablet: true,
                                phone: true
                            }
                        }
                    },
                    UserDefaults: {
                    },
                    UserImage: {}
                };

            var fnGetFormFactorStub = sinon.stub(ushellUtils, "getFormFactor").returns(Device.system.SYSTEMTYPE.DESKTOP);

            oPluginManager.registerPlugins(oPlugins);
            assert.deepEqual(oPluginManager.getRegisteredPlugins(), oExpectedPluginCollection, "Correct plugins registered");
            fnGetFormFactorStub.restore();
            fnDone();
        });
    });

    asyncTest("_handlePluginCreation: Plugins have same component (component gets loaded once and initialized thrice)", 4, function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oInstantiateComponentStub,
                iCount = 0,
                aPromisesResolveOrder = [],
                aResolvedPromises = [];

            // slowest promise returned by first call of _instantiateComponent(),
            // because the component first needs to be loaded before it gets initialized.
            aPromisesResolveOrder.push(
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 100);
                })
            );

            // promise returned by second call of _instantiateComponent().
            // It resolves much faster, because the component is already loaded, and only needs to be instantiated.
            aPromisesResolveOrder.push(
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 50);
                })
            );

            // promise returned by third call of _instantiateComponent().
            // It resolves much faster, because the component is already loaded, and only needs to be instantiated.
            aPromisesResolveOrder.push(
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                })
            );

            // register plugins having the same component
            oPluginManager.registerPlugins({
                testPlugin1: {
                    component: "sap.test.TestComponent",
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                },
                testPlugin2: {
                    component: "sap.test.TestComponent",
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                },
                testPlugin3: {
                    component: "sap.test.TestComponent",
                    url: "/sap/test/url/to/Component",
                    config: { "sap-ushell-plugin-type": "RendererExtensions" }
                }
            });

            // stub _instantiateComponent to return the respective promise depending
            // on each case defined in a correct resolve order
            oInstantiateComponentStub = sinon.stub(oPluginManager, "_instantiateComponent", function () {
                iCount++;
                if (iCount === 1) {
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets both loaded and instantiated.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    return aPromisesResolveOrder[iCount - 1];
                }

                if (iCount === 2) {
                    start();
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    return aPromisesResolveOrder[iCount - 1];
                }

                if (iCount === 3) {
                    strictEqual(oInstantiateComponentStub.callCount, iCount, "Component gets only instantiated, because it is already loaded.");
                    aResolvedPromises.push(aPromisesResolveOrder[iCount - 1]);
                    deepEqual(aPromisesResolveOrder, aResolvedPromises, "Order of resolving the promises was correct");
                    return aPromisesResolveOrder[iCount - 1];
                }
            });

            Object.keys(oPluginManager.getRegisteredPlugins().RendererExtensions).forEach(function (sPluginName) {
                // function under test
                oPluginManager._handlePluginCreation("RendererExtensions", sPluginName, new jQuery.Deferred());
            });
        });
    });

    [{
        testDescription: "sap.ui.component resolves, plugin promise resolves",
        input: {
            pluginConfig: { "sap-ushell-plugin-type": "RendererExtensions" },
            componentResolves: true
        },
        expected: {
            resolved: true,
            expectedCreateComponentCalls: 1
        }
    }, {
        testDescription: "no config, sap.ui.component resolves, plugin promise resolves",
        input: {
            pluginConfig: null,
            componentResolves: true
        },
        expected: {
            resolved: true,
            expectedCreateComponentCalls: 1
        }
    }, {
        testDescription: "sap.ui.component rejects, plugin promise rejects",
        input: {
            pluginConfig: { "sap-ushell-plugin-type": "RendererExtensions" },
            componentResolves: false
        },
        expected: {
            resolved: false,
            expectedCreateComponentCalls: 1
        }
    }, {
        testDescription: "XHR authentication fails",
        input: {
            componentResolves: true,
            xhrAuthenticationResolves: false
        },
        expected: {
            resolved: false,
            expectedCreateComponentCalls: 0
        }
    }].forEach(function (oFixture) {
        asyncTest("_instantiateComponent: " + oFixture.testDescription, function () {
            sap.ushell.bootstrap("local")
                .fail(testUtils.onError)
                .done(function () {
                    var oSrvcPluginManager = sap.ushell.Container.getService("PluginManager"),
                        oSrvcUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                        oSrvcUi5ComponentLoaderStub,
                        oDeferredXhrAuthentication = new jQuery.Deferred(),
                        oDeferredCreateComponent = new jQuery.Deferred(),
                        oDeferredPlugin = new jQuery.Deferred(),
                        sComponentName = "sap.test.TestComponent",
                        oPlugin = {
                            component: sComponentName,
                            url: "/sap/test/url/to/Component",
                            config: oFixture.input.pluginConfig
                        },
                        oFakeErrorCreateComponent = {},
                        oFakeErrorXhrAuthentication = {};

                    // arrange
                    sinon.stub(oSrvcPluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
                    oSrvcUi5ComponentLoaderStub = sinon.stub(oSrvcUi5ComponentLoader, "createComponent", function () {
                        return oDeferredCreateComponent.promise();
                    });

                    // act
                    oSrvcPluginManager._instantiateComponent(oPlugin, oDeferredPlugin);
                    oDeferredPlugin.promise()
                        .always(function () {
                            start();
                            // assert
                            strictEqual(oSrvcUi5ComponentLoaderStub.callCount, oFixture.expected.expectedCreateComponentCalls,
                                "createComponent of Ui5ComponentLoader was called once and resolved.");
                            strictEqual(oSrvcPluginManager._handleXhrAuthentication.callCount, 1,
                                "_handleXhrAuthentication was called once.");
                        })
                        .done(function () {
                            // assert
                            var bResolveExpected = oFixture.expected.resolved === true;
                            ok(bResolveExpected,
                                bResolveExpected ? "plugin promise was resolved as expected" : "unexpected resolve");
                        })
                        .fail(function (oError) {
                            // assert
                            var bRejectExpected = oFixture.expected.resolved === false;
                            ok(bRejectExpected,
                                bRejectExpected ? "plugin promise was rejected as expected" : "unexpected reject");
                            strictEqual(oError,
                                oFixture.input.componentResolves === false ? oFakeErrorCreateComponent : oFakeErrorXhrAuthentication,
                                "error as expected");
                        });

                    // resolve oLoadedComponent deferred
                    setTimeout(function () {
                        // first promise
                        if (oFixture.input.componentResolves) {
                            oDeferredCreateComponent.resolve(/*{"componentHandle": {"componentOptions": {}}}*/);
                        } else {
                            oDeferredCreateComponent.reject(oFakeErrorCreateComponent);
                        }
                    }, 0);

                    // resolve XHR deferred
                    setTimeout(function () {
                        if (oFixture.input.xhrAuthenticationResolves === false) {
                            oDeferredXhrAuthentication.reject(oFakeErrorXhrAuthentication);
                        } else {
                            // if not specified explicitly, we always resolve the
                            // xhrAuthentication promise
                            oDeferredXhrAuthentication.resolve();
                        }
                    }, 0);
                });
        });
    });

    [{
        testDescription: "oApplicationConfiguration is undefined",
        input: {},
        expected: {
            resolved: true,
            xhrCalls: 0
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is undefined",
        input: { oApplicationConfiguration: {} },
        expected: {
            resolved: true,
            xhrCalls: 0
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'false'",
        input: { oApplicationConfiguration: { "sap-ushell-xhr-authentication": "false" } }, // applicationConfiguration values are strings
        expected: {
            resolved: true,
            xhrCalls: 0
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is false",
        input: { oApplicationConfiguration: { "sap-ushell-xhr-authentication": false } }, // applicationConfiguration values are strings
        expected: {
            resolved: true,
            xhrCalls: 0
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and ajax call succeeds",
        input: {
            oApplicationConfiguration: { "sap-ushell-xhr-authentication": "true" }, // applicationConfiguration values are strings
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is true and ajax call succeeds",
        input: {
            oApplicationConfiguration: { "sap-ushell-xhr-authentication": true }, // applicationConfiguration values are strings
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'X' and ajax call succeeds",
        input: {
            oApplicationConfiguration: { "sap-ushell-xhr-authentication": "X" }, // applicationConfiguration values are strings
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and sComponentUrl is undefined",
        input: {
            oApplicationConfiguration: { "sap-ushell-xhr-authentication": "true" }, // applicationConfiguration values are strings
            sComponentUrl: undefined
        },
        expected: {
            resolved: true,
            xhrCalls: 0,
            logError: [
                "Illegal state: configuration parameter 'sap-ushell-xhr-authentication-timeout' set, but no component URL specified."
                + " XHR authentication request will not be sent. Please check the target mapping definitions for plug-ins and the application index.",
                undefined,
                "sap.ushell.services.PluginManager"
            ]
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and ajax call fails",
        input: {
            oApplicationConfiguration: { "sap-ushell-xhr-authentication": "true" }, // applicationConfiguration values are strings
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: false
        },
        expected: {
            resolved: false,
            xhrCalls: 1
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as integer",
        input: {
            oApplicationConfiguration: {
                "sap-ushell-xhr-authentication": "true",
                "sap-ushell-xhr-authentication-timeout": 5000
            },
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1,
            setXhrLogonTimeoutCalledWith: ["/sap/test/url/to/Component", 5000]
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as string",
        input: {
            oApplicationConfiguration: {
                // applicationConfiguration values are strings
                "sap-ushell-xhr-authentication": "true",
                "sap-ushell-xhr-authentication-timeout": "5000"
            },
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1,
            setXhrLogonTimeoutCalledWith: ["/sap/test/url/to/Component", 5000]
        }
    }, {
        testDescription: "sap-ushell-xhr-authentication is 'true' and sap-ushell-xhr-authentication-timeout is set as string which cannot be converted to int",
        input: {
            oApplicationConfiguration: {
                "sap-ushell-xhr-authentication": "true",
                "sap-ushell-xhr-authentication-timeout": "NOT_AN_INTEGER"
            },
            sComponentUrl: "/sap/test/url/to/Component",
            ajaxRequestResolves: true
        },
        expected: {
            resolved: true,
            xhrCalls: 1,
            setXhrLogonTimeoutCalledWith: false,
            logError: [
                "Invalid value for configuration parameter 'sap-ushell-xhr-authentication-timeout' for plug-in component"
                + " with URL '/sap/test/url/to/Component': 'NOT_AN_INTEGER' is not a number. Timeout will be ignored.",
                undefined,
                "sap.ushell.services.PluginManager"
            ]
        }
    }].forEach(function (oFixture) {
        QUnit.test("_handleXhrAuthentication: " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            sap.ushell.bootstrap("local")
                .fail(testUtils.onError)
                .done(function () {
                    var oSrvcPluginManager = sap.ushell.Container.getService("PluginManager"),
                        oDeferredAjax = new jQuery.Deferred(),
                        sExpectedXhrUrl = oFixture.input.sComponentUrl + "/Component-preload.js",
                        oFakeErrorAjax = {},
                        oResultPromise;

                    // arrange
                    sinon.stub(jQuery, "ajax").returns(oDeferredAjax);
                    sinon.stub(Log, "error");
                    sinon.stub(sap.ushell.Container, "setXhrLogonTimeout");

                    // act
                    oResultPromise = oSrvcPluginManager._handleXhrAuthentication(
                        oFixture.input.oApplicationConfiguration, oFixture.input.sComponentUrl);

                    oResultPromise.always(function () {
                        assert.strictEqual(jQuery.ajax.callCount, oFixture.expected.xhrCalls, "XHR call count");

                        if (oFixture.expected.xhrCalls > 0) {
                            assert.strictEqual(jQuery.ajax.firstCall.args[0], sExpectedXhrUrl, "XHR URL");
                        }

                        if (oFixture.expected.setXhrLogonTimeoutCalledWith) {
                            assert.strictEqual(sap.ushell.Container.setXhrLogonTimeout.callCount, 1,
                                "expected that sap.ushell.Container.setXhrLogonTimeout was called once");
                            assert.deepEqual(sap.ushell.Container.setXhrLogonTimeout.firstCall.args, oFixture.expected.setXhrLogonTimeoutCalledWith,
                                "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                        } else {
                            assert.strictEqual(sap.ushell.Container.setXhrLogonTimeout.callCount, 0,
                                "expected that sap.ushell.Container.setXhrLogonTimeout was not called");
                        }

                        if (oFixture.expected.logError) {
                            assert.strictEqual(Log.error.callCount, 1,
                                "expected that Log.error was called once");
                            assert.deepEqual(Log.error.firstCall.args, oFixture.expected.logError,
                                "expected that sap.ushell.Container.setXhrLogonTimeout was called with correct arguments");
                        }
                    })
                        .done(function () {
                            assert.ok(oFixture.expected.resolved, "expected promise to be resolved");

                            fnDone();
                        }).fail(function () {
                            assert.notOk(oFixture.expected.resolved, "expected promise to be rejected");

                            fnDone();
                        });

                    // resolve XHR deferred
                    setTimeout(function () {
                        if (oFixture.input.ajaxRequestResolves === false) {
                            oDeferredAjax.reject(oFakeErrorAjax);
                        } else {
                            // resolve by default to avoid test timeouts
                            oDeferredAjax.resolve();
                        }
                    }, 0);
                });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise - reject second promise", 2, function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oTypeError = new TypeError("I fail on purpose!"),
                oPlugins;

            oPlugins = {
                UserDefaultPlugin1: {
                    component: "sap.ushell.services.DummyComponentPluginSample1",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                UserDefaultPlugin2: {
                    component: "sap.ushell.services.DummyComponentPluginSample2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = { componentHandle: { componentOptions: {} } };

                setTimeout(function () {
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                        oCreateComponentDeferred.reject(oTypeError);
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);

            oPluginManager.loadPlugins("UserDefaults")
                .done(testUtils.onError.bind(undefined, "Promise supposed to be rejected"))
                .fail(function (oError) {
                    start();
                    ok(true, "State of promise is 'rejected'!");
                    deepEqual(oError, oTypeError, "Received error matched expected error object!");
                });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise - error thrown", 2, function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oTypeError = new TypeError("I fail on purpose!"),
                oPromiseResolver = {},
                oPlugins;

            oPlugins = {
                UserDefaultPlugin1: {
                    component: "sap.ushell.services.DummyComponentPluginSample1",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                UserDefaultPlugin2: {
                    component: "sap.ushell.services.DummyComponentPluginSample2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred();
                // special case: throw exception for second entry
                if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                    throw oTypeError;
                }

                oPromiseResolver[oConfig.ui5ComponentName] = {
                    resolve: oCreateComponentDeferred.resolve,
                    reject: oCreateComponentDeferred.reject
                };

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);

            oPluginManager.loadPlugins("UserDefaults")
                .done(testUtils.onError.bind(undefined, "Promise supposed to be rejected"))
                .fail(function (oError) {
                    start();
                    ok(true, "State of promise is 'rejected'!");
                    deepEqual(oError, oTypeError, "Received error matched expected error object!");
                });
        });
    });

    asyncTest("Bootstrap Plugin: use getUserDefaultPluginsPromise to wait for bootstrap promises", 2, function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager");
            var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader");
            var sState = "beforeResolvement";

            var oPlugins = {
                UserDefaultPlugin1: {
                    component: "sap.ushell.services.DummyComponentPluginSample1",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                UserDefaultPlugin2: {
                    component: "sap.ushell.services.DummyComponentPluginSample2",
                    config: { "sap-ushell-plugin-type": "UserDefaults" }
                },
                SomeOtherPlugin: { component: "sap.ushell.services.DummyComponentPluginSample3" }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = { componentHandle: { componentOptions: {} } };

                // eslint-disable-next-line max-nested-callbacks
                setTimeout(function () {
                    sState = "duringResolvement";
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample3") {
                        oCreateComponentDeferred.reject();
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);
            oPluginManager.loadPlugins("UserDefaults")
                .done(function () {
                    start();
                    ok(true, "State of UserDefaults promise is 'resolved'!");
                    strictEqual(sState, "duringResolvement", "Promise was not resolved early");
                }).fail(testUtils.onError);

            oPluginManager.loadPlugins("UserDefaults");
        });
    });

    QUnit.test("Inject extensions of the launchpad in _instantiateComponent method", function (assert) {
        var fnDone = assert.async();
        sap.ushell.bootstrap("local")
            .fail(testUtils.onError)
            .done(function () {
                var oSrvcPluginManager = sap.ushell.Container.getService("PluginManager"),
                    oSrvcUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                    oSrvcUi5ComponentLoaderStub,
                    oHandleXhrAuthenticationStub,
                    oDeferredXhrAuthentication = new jQuery.Deferred(),
                    oPlugin = {
                        component: "sap.test.TestComponent",
                        url: "/sap/test/url/to/Component",
                        config: {}
                    };

                oDeferredXhrAuthentication.resolve();
                oHandleXhrAuthenticationStub = sinon.stub(oSrvcPluginManager, "_handleXhrAuthentication").returns(oDeferredXhrAuthentication);
                oSrvcUi5ComponentLoaderStub = sinon.stub(oSrvcUi5ComponentLoader, "createComponent").returns(new jQuery.Deferred());

                // act
                oSrvcPluginManager._instantiateComponent(oPlugin, new jQuery.Deferred());

                assert.ok(oSrvcUi5ComponentLoaderStub.calledOnce, "createComponent was called");
                assert.ok(oSrvcUi5ComponentLoaderStub.firstCall.args[0].hasOwnProperty("getExtensions"), "Extensions was added");
                assert.ok(typeof oSrvcUi5ComponentLoaderStub.firstCall.args[0].getExtensions === "function", "getExtensions is function");

                oSrvcUi5ComponentLoaderStub.restore();
                oHandleXhrAuthenticationStub.restore();
                fnDone();
            });
    });

    asyncTest("Bootstrap Plugin: cFLP yellow box", function () {
        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPlugins;

            oPlugins = {
                Plugin1: {
                    component: "sap.ushell.services.DummyComponentPluginSample1"
                },
                Plugin2: {
                    component: "sap.ushell.services.DummyComponentPluginSample2",
                    config: {}
                },
                Plugin3: {
                    component: "sap.ushell.services.DummyComponentPluginSample3",
                    config: {
                        "sap-plugin-agent": true,
                        "sap-plugin-agent-id": "MyPlugin3"
                    }
                },
                Plugin4: {
                    component: "sap.ushell.services.DummyComponentPluginSample4",
                    config: {
                        "sap-plugin-agent": true
                    }
                },
                Plugin5: {
                    component: "sap.ushell.services.DummyComponentPluginSample5",
                    enabled: false,
                    config: {
                        "sap-plugin-agent": true,
                        "sap-plugin-agent-id": "MyPlugin5"
                    }
                }
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = { componentHandle: { componentOptions: {} } };

                setTimeout(function () {
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample3" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample4") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else {
                        oCreateComponentDeferred.reject();
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oPluginManager.registerPlugins(oPlugins);
            oPluginManager.loadPlugins("RendererExtensions")
                .done(function () {
                    start();
                    ok(oPluginManager._getNamesOfPluginsWithAgents() === "MyPlugin3,Plugin4", "sap plugins agents name list prepared properly");
                }).fail(function () {
                    start();
                    ok(false, "plugins were not created properly");
                });
        });
    });


    asyncTest("Bootstrap Plugin: cFLP blue box", function () {
        var oUshellConfigOld = window["sap-ushell-config"];
        window["sap-ushell-config"] = {
            services: {
                PluginManager: {
                    config: {
                        isBlueBox: true
                    }
                }
            }
        };

        sap.ushell.bootstrap("local").fail(testUtils.onError).done(function () {
            var oPluginManager = sap.ushell.Container.getService("PluginManager"),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPlugins,
                oParamStub;

            oPlugins = {
                Plugin1: {
                    component: "sap.ushell.services.DummyComponentPluginSample1"
                },
                Plugin2: {
                    component: "sap.ushell.services.DummyComponentPluginSample2",
                    config: {}
                },
                Plugin3: {
                    component: "sap.ushell.services.DummyComponentPluginSample3",
                    config: {
                        "sap-plugin-agent": true,
                        "sap-plugin-agent-id": "MyPlugin3"
                    }
                },
                Plugin4: {
                    component: "sap.ushell.services.DummyComponentPluginSample4",
                    config: {
                        "sap-plugin-agent": true
                    }
                },
                Plugin5: {
                    component: "sap.ushell.services.DummyComponentPluginSample5",
                    config: {
                        "sap-plugin-agent": true,
                        "sap-plugin-agent-id": "MyPlugin5"
                    }
                }
            };

            // in the scenario of isBlueBox you always have isPluginAgentSupported (see PluginManagerProxy service)
            oPluginManager.isPluginAgentSupported = function (sSapAgentId) {
                return false;
            };

            // we want to be able to resolve any promise given at any time
            sinon.stub(oUi5ComponentLoader, "createComponent", function (oConfig) {
                var oCreateComponentDeferred = new jQuery.Deferred(),
                    oLoadedComponent = { componentHandle: { componentOptions: {} } };

                setTimeout(function () {
                    if (oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample1" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample2" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample4" ||
                        oConfig.ui5ComponentName === "sap.ushell.services.DummyComponentPluginSample5") {
                        oCreateComponentDeferred.resolve(oLoadedComponent);
                    } else {
                        oCreateComponentDeferred.reject();
                    }
                }, 0);

                return oCreateComponentDeferred.promise();
            });

            oParamStub = sinon.stub(UriParameters.prototype, "get", function () {
                return "Plugin4,MyPlugin5";
            });
            oPluginManager.registerPlugins(oPlugins);
            oPluginManager.loadPlugins("RendererExtensions")
                .done(function () {
                    start();
                    ok(oPluginManager._getNamesOfPluginsWithAgents() === "", "must be empty");
                    window["sap-ushell-config"] = oUshellConfigOld;
                    oParamStub.restore();
                }).fail(function () {
                    start();
                    ok(false, "plugins were not created properly");
                    window["sap-ushell-config"] = oUshellConfigOld;
                    oParamStub.restore();
                });
        });
    });
});
