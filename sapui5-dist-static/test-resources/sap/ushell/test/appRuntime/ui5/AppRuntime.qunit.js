// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.AppRuntime
 */
sap.ui.require([
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/AppRuntime",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "jquery.sap.script",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (URI, AppRuntime, AppCommunicationMgr, jquery, AppRuntimeService) {
    "use strict";

    /*global module, start, sinon, asyncTest */

    module("sap.ushell.appRuntime.ui5.appRuntime", {
    });

    // asyncTest("test getPageConfig", function (assert) {
    //     AppRuntime.getPageConfig().then(function(appInfo) {
    //         var result = window["sap-ushell-config"];
    //         assert.ok(result.services.Personalization.adapter.module === "sap.ushell.adapters.local.PersonalizationAdapter",
    //             "AppRuntime.getPageConfig - Successfully compare value1 from pageConfig");
    //         assert.ok(result.ui5appruntime.config.appIndex.module === "sap.ushell.shells.demo.cspJSFiles.AppInfoAdapterSample",
    //             "AppRuntime.getPageConfig - Successfully compare value2 from pageConfig");
    //         start();
    //     });
    // });

    asyncTest("getAppInfo", function (assert) {
        var sap_ushell_config = window["sap-ushell-config"];
        window["sap-ushell-config"] = {
            "ui5appruntime": {
                "config": {
                    "appIndex": {
                        "module": "sap.ushell.shells.demo.cspJSFiles.AppInfoAdapterSample",
                        "data": {}
                    }
                }
            }
        };

        var result = {
            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
            url: "../../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
        };

        AppRuntime.getAppInfo("sap.ushell.demo.FioriSandboxDefaultApp").then(function(appInfo) {
            assert.ok(JSON.stringify(appInfo) === JSON.stringify(result), 'getAppInfo - data was successfully received from the "module" parameter' );
            start();
            window["sap-ushell-config"] = sap_ushell_config;
        });
    });


    [
        {
            name: "no parameters passed",
            input: {
                oAppInfo: {
                    url: "/a/b/c"
                },
                oParams: new URI("?").query(true)
            },
            output: {
                oAppInfo: {
                    url: "/a/b/c"
                }
            }
        },
        {
            name: "simple list of parameters",
            input: {
                oAppInfo: {
                    url: "/a/b/c"
                },
                oParams: new URI("?sap-startup-params=" + encodeURIComponent("a=1&b=2&c=3")).query(true)
            },
            output: {
                oAppInfo: {
                    url: "/a/b/c?a=1&b=2&c=3"
                }
            }
        },
        {
            name: "sap-intent-param single parameter",
            input: {
                oAppInfo: {
                    url: "/a/b/c"
                },
                oParams: new URI("?sap-startup-params=" + encodeURIComponent("sap-intent-param=abcd")).query(true),
                appState: {
                    abcd: "x=1&y=2&z=3"
                }
            },
            output: {
                oAppInfo: {
                    url: "/a/b/c?x=1&y=2&z=3"
                }
            }
        },
        {
            name: "simple parameters with sap-intent-param",
            input: {
                oAppInfo: {
                    url: "/a/b/c"
                },
                oParams: new URI("?sap-startup-params=" + encodeURIComponent("a=1&sap-intent-param=abcd&b=2")).query(true),
                appState: {
                    abcd: "x=1&y=2&z=3"
                }
            },
            output: {
                oAppInfo: {
                    url: "/a/b/c?a=1&b=2&x=1&y=2&z=3"
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("setApplicationParameters - " + oFixture.name, function (assert) {
            sinon.stub(AppRuntimeService, "sendMessageToOuterShell",
                function (sMessageId, oParams) {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve(oFixture.input.appState[oParams.sAppStateKey]);
                    return oDeferred.promise();
                });

            AppRuntime.setApplicationParameters(oFixture.input.oAppInfo, oFixture.input.oParams).done(function () {
                assert.ok(oFixture.input.oAppInfo.url === oFixture.output.oAppInfo.url, 'setApplicationParameters - parameters were successfully set in the URL');
                start();
                AppRuntimeService.sendMessageToOuterShell.restore();
            }).fail(function () {
                assert.ok(false, 'setApplicationParameters - parameters were NOT properly set in the URL');
                start();
                AppRuntimeService.sendMessageToOuterShell.restore();
            });
        });
    });

    asyncTest("overrideSendAsEmailFn", function (assert) {
        var oStub = sinon.stub(AppRuntimeService, "sendMessageToOuterShell", function () {
            });

        AppRuntime.overrideSendAsEmailFn();
        AppRuntime.overrideSendAsEmailFn();
        sap.m.URLHelper.triggerEmail();

        setTimeout(function () {
            assert.ok(oStub.calledOnce, "Our 'triggerEmail' function was overrided more than one time. " +
                "This test was created for navigating between two IFrames in one blue box and verified that the triggerEmail function was not override more than one time");
            start();
            oStub.restore();
        }, 500);

    });

    asyncTest("loadPlugins", function (assert) {
        var oStub = sinon.stub(sap.ushell.Container.getService("PluginManager"), "loadPlugins", function () {
            });

        AppRuntime.loadPlugins();
        AppRuntime.loadPlugins();

        setTimeout(function () {
            assert.ok(oStub.calledOnce, "loadPlugins should be called only once");
            start();
            oStub.restore();
        }, 500);
    });

});
