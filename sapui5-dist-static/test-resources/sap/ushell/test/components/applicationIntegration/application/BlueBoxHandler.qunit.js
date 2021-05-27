// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.BlueBoxHandler
 */
sap.ui.require([
    'sap/ushell/components/applicationIntegration/application/BlueBoxHandler',
    'sap/ushell/components/applicationIntegration/application/Application',
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/test/utils",
    'sap/ui/Device',
    "sap/ushell/services/Container",
    'sap/ushell/services/AppConfiguration',
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/base/security/encodeXML"
], function (BlueBoxHandler, Application, AppLifeCycle, AppMeta, ApplicationContainer, utils, Device, Container, AppConfiguration, Config, EventHub, encodeXML) {
    "use strict";
    /* global module ok QUnit strictEqual sinon start*/

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    module("Basic Tests", {
    });

    QUnit.test("#history back navigation", function (assert) {
        [
            {
                validate: {
                    sId: "test2",
                    sUrl: "https://test2.html",
                    exp: true
                },
                aConf: [
                    {
                        setup: {
                            id: "test1",
                            sUrl: "https://test1.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    },
                    {
                        setup: {
                            id: "test2",
                            sUrl: "https://test2.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    }
                ]
            },
            {
                validate: {
                    sId: "test3",
                    sUrl: "https://test3.html",
                    exp: false
                },
                aConf: [
                    {
                        setup: {
                            id: "test4",
                            sUrl: "https://test4.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    },
                    {
                        setup: {
                            id: "test5",
                            sUrl: "https://test5.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    }
                ]
            }
        ].forEach(function (oFixture) {
            var oActiveApplication,
                oSetup = {
                    oShellUIService: {
                        getInterface: function () {

                        }
                    },
                    oAppIsolationService: {
                        getInterface: function () {

                        }
                    }
                },
                oAppLifeMock = {
                    addControl: function (oAppContainer) {

                    },
                    postMessageToIframeApp: function (sTopic, sMessage) {

                    }
                };

            BlueBoxHandler.init(oSetup, oFixture.aConf, oAppLifeMock);
            oActiveApplication = BlueBoxHandler.get(oFixture.validate.sUrl);
            ok(!oActiveApplication, "Not Expected cache element for URL:" + oFixture.validate.sUrl);
/*            if (oFixture.validate.exp) {
                ok(oActiveApplication.sId === "application" + oFixture.validate.sId, "Expected id: " + oFixture.validate.sId);
            } else {
                ok(oActiveApplication === undefined, "Not Expected cache element for URL:" + oFixture.validate.sUrl);
            }*/

        });
    });


    QUnit.test("#test capabilities", function (assert) {
        var aCaps = [
                {
                    service: "testsrvc1",
                    action: "act1"
                },
                {
                    service: "testsrvc1",
                    action: "act2"
                },
                {
                    service: "testsrvc1",
                    action: "act3"
                },
                {
                    service: "testsrvc2",
                    action: "act1"
                }
            ],
            oBB = {
                getIsStateful: function () {
                    return true;
                }
            },
            oSetup = {
                oShellUIService: {
                    getInterface: function () {

                    }
                },
                oAppIsolationService: {
                    getInterface: function () {

                    }
                }
            }, oAppLifeMock = {
                addControl: function (oAppContainer) {

                },
                postMessageToIframeApp: function (sTopic, sMessage) {

                }
            };
        BlueBoxHandler.init(oSetup, [
            {
                setup: {
                    id: "test4",
                    sUrl: "https://test4.html"
                },
                init: {
                    on: "TBD"
                }
            },
            {
                setup: {
                    id: "test5",
                    sUrl: "https://test5.html"
                },
                init: {
                    on: "TBD"
                }
            }
        ], oAppLifeMock);
        BlueBoxHandler.setCapabilities(oBB, aCaps);

        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act1"), "Validate Cap testsrvc1.act1");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act2"), "Validate Cap testsrvc1.act2");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act3"), "Validate Cap testsrvc1.act3");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act1"), "Validate Cap testsrvc1.act1");
        ok(!BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act2"), "Validate Cap testsrvc2.act2 not active");
    });

    QUnit.test("#Test Managed Plugin Agents status", function (assert) {
        [
            {
                oContainer: {
                    toString: function () {
                        return "container 1";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return "https://bla:8080/ushell/test-resources/sap/ushell/qunit/components/applicationIntegration/application/BlueBoxHandler.qunit.html?testId=202de40a";
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oContainer2: {
                    toString: function () {
                        return "container 2";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return undefined;
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oMessage: {
                    type: "request",
                    service: "sap.ushell.services.pluginManager.status",
                    body: {name: "MyPlugin3", status: "loading"},
                    request_id: "SAPUI5_APPRUNTIME_MSGID_7"
                },
                validate: {
                    container1Stt: "loading",
                    container2Stt: "unknown"
                },
                aConf: {
                    "MyPlugin3": {
                        "loading": "immediate"
                    },
                    "plugin2DoesNotExist": {
                        "loading": "immediate"
                    }
                }
            },

            {
                oContainer: {
                    toString: function () {
                        return "container 1";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return "https://bla:8080/ushell/test-resources/sap/ushell/qunit/components/applicationIntegration/application/BlueBoxHandler.qunit.html?testId=202de40a";
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oContainer2: {
                    toString: function () {
                        return "container 1";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return undefined;
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oMessage: {
                    type: "request",
                    service: "sap.ushell.services.pluginManager.status",
                    body: {name: "MyPlugin3", status: "loading"},
                    request_id: "SAPUI5_APPRUNTIME_MSGID_7"
                },
                validate: {
                    container1Stt: "loading",
                    container2Stt: "loading"
                },
                aConf: {
                    "MyPlugin3": {
                        "loading": "immediate"
                    },
                    "plugin2DoesNotExist": {
                        "loading": "immediate"
                    }
                }
            }
        ].forEach(function (oFixture) {
            var oStt,
                oStt2,
                oMessage = oFixture.oMessage,
                oMessageData = oMessage,
                oCapabilities = [
                    {
                        service: "testsrvc1",
                        action: "act1"
                    },
                    {
                        service: "testsrvc1",
                        action: "act2"
                    },
                    {
                        service: "testsrvc1",
                        action: "act3"
                    },
                    {
                        service: "testsrvc2",
                        action: "act1"
                    }
                ],
                oSetup = {
                    oShellUIService: {
                        getInterface: function () {

                        }
                    },
                    oAppIsolationService: {
                        getInterface: function () {

                        }
                    }
                },
                oAppLifeMock = {
                    addControl: function (oAppContainer) {

                    },
                    postMessageToIframeApp: function (sTopic, sMessage) {

                    }
                };

            BlueBoxHandler.init(oSetup, oFixture, oAppLifeMock);
            BlueBoxHandler.setStartupPlugins(oFixture.aConf);

            BlueBoxHandler.setCapabilities(oFixture.oContainer, oCapabilities);
            BlueBoxHandler.setCapabilities(oFixture.oContainer2, oCapabilities);

            Application.handleServiceMessageEvent(oFixture.oContainer, oMessage, oMessageData);
            oStt = BlueBoxHandler.getPluginAgentStatus(oFixture.oContainer, oMessageData.body.name);
            oStt2 = BlueBoxHandler.getPluginAgentStatus(oFixture.oContainer2, oMessageData.body.name);

            ok(oStt.status === oFixture.validate.container1Stt, "container 1: Expected plugin agent state " + oFixture.validate.container1Stt);
            ok(oStt2.status === oFixture.validate.container2Stt, "container 1: Expected plugin agent state " + oFixture.validate.container2Stt);
        });
    });

    QUnit.test("#Test Managed Plugin Agents Life Cycle", function (assert) {
        [
            {
                oCompMock: {
                    agentStart: function (oBlueBox, sAgentName, oStatus) {
                        ok(oBlueBox.toString() === "container 1", "agentStart life cycle interface [container 1]: Expected in plugin agent interface");
                        ok(oStatus.name === "MyPlugin3", "Expected Subscribed Agent Name ");
                    },
                    agentExit: function (oBlueBox, sAgentName, oStatus) {
                        ok(true, "Expected exit life cycle interface");
                    },
                    agentLoading: function (oBlueBox, sAgentName, oStatus) {
                        ok(true, "agent loading confirmed...");
                    }
                },
                oContainer: {
                    toString: function () {
                        return "container 1";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return "https://bla:8080/ushell/test-resources/sap/ushell/qunit/components/applicationIntegration/application/BlueBoxHandler.qunit.html?testId=202de40a";
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oContainer2: {
                    toString: function () {
                        return "container 2";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return undefined;
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oMessage: {
                    type: "request",
                    service: "sap.ushell.services.pluginManager.status",
                    body: {name: "MyPlugin3", status: "started"},
                    request_id: "SAPUI5_APPRUNTIME_MSGID_7"
                },
                validate: {
                    container1Stt: "loading",
                    container2Stt: "unknown"
                },
                aConf: {
                    "MyPlugin3": {
                        "loading": "immediate"
                    },
                    "plugin2DoesNotExist": {
                        "loading": "immediate"
                    }
                }
            },
            {
                oCompMock: {
                    agentStart: function (oBlueBox, sAgentName, oStatus) {
                        ok(true, "Expected agent start life cycle interface, via _managePluginAgents process");
                    },
                    agentExit: function (oBlueBox, sAgentName, oStatus) {
                        ok(oBlueBox.toString() === "container 1", "agentStart life cycle interface [container 1]: Expected in plugin agent interface");
                        ok(oStatus.name === "MyPlugin3", "Expected Subscribed Agent Name ");
                    },
                    agentLoading: function (oBlueBox, sAgentName, oStatus) {
                        // ok(true, "agent loading confirmed...");
                    }
                },
                oContainer: {
                    toString: function () {
                        return "container 1";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return "https://bla:8080/ushell/test-resources/sap/ushell/qunit/components/applicationIntegration/application/BlueBoxHandler.qunit.html?testId=202de40a";
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oContainer2: {
                    toString: function () {
                        return "container 2";
                    },
                    getDomRef: function () {
                        return {
                            dom: 1
                        };
                    },
                    getIframeWithPost: function () {
                        return true;
                    },
                    _getIFrameUrl: function () {
                        return undefined;
                    },
                    getIsStateful: function () {
                        return true;
                    }
                },
                oMessage: {
                    type: "request",
                    service: "sap.ushell.services.pluginManager.status",
                    body: {name: "MyPlugin3", status: "exit"},
                    request_id: "SAPUI5_APPRUNTIME_MSGID_7"
                },
                validate: {
                    container1Stt: "loading",
                    container2Stt: "unknown"
                },
                aConf: {
                    "MyPlugin3": {
                        "loading": "immediate"
                    },
                    "plugin2DoesNotExist": {
                        "loading": "immediate"
                    }
                }
            }
        ].forEach(function (oFixture) {
            var oMessage = oFixture.oMessage,
                oMessageData = oMessage,
                oCapabilities = [
                    {
                        service: "testsrvc1",
                        action: "act1"
                    },
                    {
                        service: "testsrvc1",
                        action: "act2"
                    },
                    {
                        service: "testsrvc1",
                        action: "act3"
                    },
                    {
                        service: "testsrvc2",
                        action: "act1"
                    }
                ],
                oSetup = {
                    oShellUIService: {
                        getInterface: function () {

                        }
                    },
                    oAppIsolationService: {
                        getInterface: function () {

                        }
                    }
                },
                oAppLifeMock = {
                    addControl: function (oAppContainer) {

                    },
                    postMessageToIframeApp: function (sTopic, sMessage) {

                    }
                };

            BlueBoxHandler.init(oSetup, oFixture, oAppLifeMock);
            BlueBoxHandler.setStartupPlugins(oFixture.aConf);

            BlueBoxHandler.setCapabilities(oFixture.oContainer, oCapabilities);
            BlueBoxHandler.setCapabilities(oFixture.oContainer2, oCapabilities);

            var aComponentsWithAgent = [{
                agents: oFixture.aConf,
                pluginComp: {
                    componentHandle: {
                        getInstance: function () {
                            return oFixture.oCompMock;
                        }
                    }
                }
            }];

            BlueBoxHandler._managePluginAgents(aComponentsWithAgent);
            Application.handleServiceMessageEvent(oFixture.oContainer, oMessage, oMessageData);
        });
    });

    [{
        sTestDesc: "getBlueBoxCacheKey - empty string",
        sInputURL: "",
        sBlueBoxCacheKey: ""
    }, {
        sTestDesc: "getBlueBoxCacheKey - undefined",
        sInputURL: undefined,
        sBlueBoxCacheKey: undefined
    }, {
        sTestDesc: "getBlueBoxCacheKey - '.'",
        sInputURL: ".",
        sBlueBoxCacheKey: "."
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../'",
        sInputURL: "../",
        sBlueBoxCacheKey: "../"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c'",
        sInputURL: "../a/b/c",
        sBlueBoxCacheKey: "../a/b/c"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html'",
        sInputURL: "../a/b/c/d.html",
        sBlueBoxCacheKey: "../a/b/c/d.html"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html?p=1'",
        sInputURL: "../a/b/c/d.html?p=1",
        sBlueBoxCacheKey: "../a/b/c/d.html"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html#aaa'",
        sInputURL: "../a/b/c/d.html#aaa",
        sBlueBoxCacheKey: "../a/b/c/d.html"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'abcd'",
        sInputURL: "abcd",
        sBlueBoxCacheKey: "abcd"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://abcd'",
        sInputURL: "http://abcd",
        sBlueBoxCacheKey: "abcd"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://abcd:1234'",
        sInputURL: "http://abcd:1234",
        sBlueBoxCacheKey: "abcd"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com:1234/a/b/c/d'",
        sInputURL: "http://www.test.com:1234/a/b/c/d",
        sBlueBoxCacheKey: "www.test.com"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com/a/b/c/d:1234?p1=1&sap-iframe-hint=ABC&p2=2'",
        sInputURL: "http://www.test.com/a/b/c/d:1234?p1=1&sap-iframe-hint=ABC&p2=2",
        sBlueBoxCacheKey: "www.test.com@ABC"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com#a-b?p=1&/inner-route'",
        sInputURL: "http://www.test.com#a-b?p=1&/inner-route",
        sBlueBoxCacheKey: "www.test.com"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-iframe-hint=ABC#a-b?p=1&/inner-route'",
        sInputURL: "http://www.test.com?sap-iframe-hint=ABC#a-b?p=1&/inner-route",
        sBlueBoxCacheKey: "www.test.com@ABC"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com#a-b?p=1&sap-iframe-hint=ABC&/inner-route'",
        sInputURL: "http://www.test.com#a-b?p=1&sap-iframe-hint=ABC/inner-route",
        sBlueBoxCacheKey: "www.test.com"
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.sTestDesc, function (assert) {
            strictEqual(BlueBoxHandler._getBlueBoxCacheKey(oFixture.sInputURL), oFixture.sBlueBoxCacheKey);
        });
    });

    module("Handlers", {
        beforeEach: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                start();
            });
        },

        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    [{
        sTestDesc: "simple create",
        input: {
            isPost: false,
            url: "http://www.test.com",
            hash: "A-B",
            storageKey: "key1"
        },
        output: {
            paramKeysStubCallCount: 0,
            getServiceSpyCallCount: 0,
            getAppStateDataStubCallCount: 0,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com",
                sHash: "A-B"
            }
        }
    }, {
        sTestDesc: "simple create, POST enabled, no app state",
        input: {
            isPost: true,
            url: "http://www.test.com",
            hash: "A-B",
            storageKey: "key1",
            appStateData: undefined
        },
        output: {
            paramKeysStubCallCount: 1,
            getServiceSpyCallCount: 0,
            getAppStateDataStubCallCount: 0,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com",
                sHash: "A-B",
                "sap-flp-params": encodeXML(JSON.stringify({
                    "sap-flp-url": "http://www.flp.com"
                }))
            },
            appStateKeys: []
        }
    }, {
        sTestDesc: "simple create, POST enabled, with app state",
        input: {
            isPost: true,
            url: "http://www.test.com?sap-xapp-state=1234&sap-iapp-state=5678",
            hash: "A-B",
            storageKey: "key1",
            appStateData: [
                ["1234data"],
                ["5678data"]
            ]
        },
        output: {
            paramKeysStubCallCount: 1,
            getServiceSpyCallCount: 1,
            getAppStateDataStubCallCount: 1,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com?sap-xapp-state=1234&sap-iapp-state=5678",
                sHash: "A-B",
                "sap-flp-params": encodeXML(JSON.stringify({
                    "sap-xapp-state-data": "1234data",
                    "sap-iapp-state-data": "5678data",
                    "sap-flp-url": "http://www.flp.com"
                }))
            },
            appStateKeys: [
                "sap-xapp-state-data",
                "sap-iapp-state-data"
            ]
        }
    }].forEach(function (oFixture) {
        QUnit.asyncTest(oFixture.sTestDesc, function (assert) {
            var oHandler,
                isOpenWithPostStub,
                publishEventStub,
                getFLPUrlStub,
                postMessageStub,
                hasherStub,
                getParamKeysSpy,
                getServiceSpy,
                getAppStateDataStub,
                oInnerControl = {},
                oTarget;

            oHandler = BlueBoxHandler.getHandler();

            isOpenWithPostStub = sinon.stub(BlueBoxHandler, "_isOpenWithPost").returns(oFixture.input.isPost);
            publishEventStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish").returns();
            getFLPUrlStub = sinon.stub(sap.ushell.Container, "getFLPUrl").returns("http://www.flp.com");
            postMessageStub = sinon.stub(Application, "postMessageToIframeApp").returns(
                new jQuery.Deferred().resolve().promise());
            hasherStub = sinon.stub(window.hasher, "getHash").returns(oFixture.input.hash);
            getParamKeysSpy = sinon.spy(ApplicationContainer.prototype, "_getParamKeys");
            getAppStateDataStub = sinon.stub(sap.ushell.Container.getService("CrossApplicationNavigation"), "getAppStateData", function () {
                var oDeferred = new jQuery.Deferred();
                setTimeout(function () {
                    oDeferred.resolve(oFixture.input.appStateData);
                }, 0);
                return oDeferred.promise();
            });
            getServiceSpy = sinon.spy(sap.ushell.Container, "getService");

            oTarget = {};

            oHandler.create(oInnerControl, oFixture.input.url, oFixture.input.storageKey, oTarget)
                .then(function () {
                    assert.equal(publishEventStub.callCount, 2, "call count needs to be 2");
                    [{
                        idx: 0,
                        nParams: 3,
                        p1: "launchpad",
                        p2: "appOpening",
                        p3: oTarget
                    }, {
                        idx: 1,
                        nParams: 3,
                        p1: "sap.ushell",
                        p2: "appOpened",
                        p3: oTarget
                    }].forEach(function (param) {
                        assert.equal(publishEventStub.args[param.idx].length, param.nParams, "only 3 parameters should be sent");
                        assert.equal(publishEventStub.args[param.idx][0], param.p1, "parameter should be 'sap.ushell'");
                        assert.equal(publishEventStub.args[param.idx][1], param.p2, "parameter should be 'appOpened'");
                        assert.deepEqual(publishEventStub.args[param.idx][2], param.p3, "target parameter is wrong");
                    });
                    assert.equal(getParamKeysSpy.callCount, oFixture.output.paramKeysStubCallCount, "call count needs to be 1");
                    if (getParamKeysSpy.callCount === 1) {
                        assert.equal(getParamKeysSpy.args[0][0], oFixture.input.url, "url parameter is wrong");
                        assert.deepEqual(getParamKeysSpy.args[0][1], oFixture.output.appStateKeys, "app state parameter");
                    } else if (getParamKeysSpy.callCount > 0) {
                        assert.ok(false, "ApplicationContainer.prototype._getParamKeys should not have been called");
                    }
                    assert.equal(getServiceSpy.callCount, oFixture.output.getServiceSpyCallCount, "call count to getService");
                    assert.equal(getAppStateDataStub.callCount,
                        oFixture.output.getAppStateDataStubCallCount, "call count to getAppStateData");

                    assert.equal(postMessageStub.callCount, 1, "post message called only once");
                    assert.ok(postMessageStub.calledWith(
                        oInnerControl,
                        "sap.ushell.services.appLifeCycle",
                        "create",
                        oFixture.output.appMessage,
                        true), "post called with the right parameters");

                    isOpenWithPostStub.restore();
                    publishEventStub.restore();
                    getFLPUrlStub.restore();
                    postMessageStub.restore();
                    hasherStub.restore();
                    getParamKeysSpy.restore();
                    getAppStateDataStub.restore();
                    getServiceSpy.restore();
                    start();
                });
        });
    });
});
