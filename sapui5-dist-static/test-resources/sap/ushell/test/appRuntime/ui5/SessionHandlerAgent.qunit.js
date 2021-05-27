// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.SessionHandlerAgent
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/SessionHandler"
], function (jQuery, SessionHandlerAgent, AppCommunicationMgr, AppRuntimeService, SessionHandler) {
    "use strict";

    /* global test, equal, sinon, start, assert, asyncTest*/

    [
        {
            testName: "same domain url 1",
            input: {
                sURL1: "http://www.test.com",
                sURL2: "http://www.test.com"
            },
            output: {
                bSame: true
            }
        },
        {
            testName: "same domain url 2",
            input: {
                sURL1: "http://www.test1.com",
                sURL2: "http://www.test.com"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 3",
            input: {
                sURL1: "http://www.test.com:1010",
                sURL2: "http://www.test.com:1010"
            },
            output: {
                bSame: true
            }
        },
        {
            testName: "same domain url 4",
            input: {
                sURL1: "http://www.test.com:1010",
                sURL2: "http://www.test.com:2020"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 5",
            input: {
                sURL1: "http://www.test.com:1010/a/b/c",
                sURL2: "http://www.test.com:1010/x/y/z"
            },
            output: {
                bSame: true
            }
        },
        {
            testName: "same domain url 6",
            input: {
                sURL1: "http://www.test.com:1010/a/b/c",
                sURL2: "http://www.test.com/x/y/z"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 7",
            input: {
                sURL1: "",
                sURL2: ""
            },
            output: {
                bSame: true
            }
        },
        {
            testName: "same domain url 8",
            input: {
                sURL1: undefined,
                sURL2: ""
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 9",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com:1234/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com:1234/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: true
            }
        },
        {
            testName: "same domain url 10",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://test1-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "https://test2-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 11",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://test1-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "http://test1-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 12",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://test1-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "https://test2-cpp-dwpteami349209.cfapps.sap.hana.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 13",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com:1234/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: false
            }
        },
        {
            testName: "same domain url 14",
            input: {
                // eslint-disable-next-line max-len
                sURL1: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com:1234/cp.portal/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp",
                // eslint-disable-next-line max-len
                sURL2: "https://testflpconsumer-cpp-dwpteami349209.cfapps.sap.hana.ondemand.com:1234/cp/ui5appruntime.html?subaccountId=14e2b4e5-b356-41b4-8270-e59b169cdbd1&saasApprouter=true&sap-ui-app-id=html5.BookmarkApp&sap-startup-params=name1%3D&sap-ui-debug=true&sap-shell=FLP&sap-touch=0&sap-ui-versionedLibCss=true&sap-theme=sap_fiori_3_dark&sap-locale=en#object1-action1?sap-ui-app-id-hint=saas_approuter_testflpconsumer_html5.BookmarkApp"
            },
            output: {
                bSame: true
            }
        }
    ].forEach(function (oFixture) {
        test("Test " + oFixture.testName, function (assert) {
            equal(SessionHandlerAgent.isSameDomain(oFixture.input.sURL1, oFixture.input.sURL2),
                oFixture.output.bSame,
                "same domain should be " + oFixture.output.bSame + " (" + oFixture.input.sURL1 + "," + oFixture.input.sURL2 + ")");
        });
    });

    [
        {
            testName: "ExtendSession",
            api: "handleExtendSessionEvent",
            input: {
                oMessage: {
                    source: {
                        postMessage: function (sResponseData, origin) {
                            return new jQuery.Deferred().resolve().promise();
                        }
                    },
                    data: '{"type":"request","request_id":"1111","service":"sap.ushell.sessionHandler.extendSessionEvent","body":{}}',
                    origin: "*"
                },
                oMessageData: {
                    service: "sap.ushell.sessionHandler.extendSessionEvent",
                    body: {},
                    request_id: "1111",
                    type: "request"
                }
            }
        },
        {
            testName: "Logout",
            api: "handleLogoutEvent",
            input: {
                oMessage: {
                    source: {
                        postMessage: function (sResponseData, origin) {
                            return new jQuery.Deferred().resolve().promise();
                        }
                    },
                    data: '{"type":"request","request_id":"2222","service":"sap.ushell.sessionHandler.logout","body":{}}',
                    origin: "*"
                },
                oMessageData: {
                    service: "sap.ushell.sessionHandler.logout",
                    body: {},
                    request_id: "2222",
                    type: "request"
                }
            }
        }
    ].forEach(function (oFixture) {
        test("Test " + oFixture.testName, function (assert) {

            var oMockContainer = {
                    AppCommunicationMgr: function () {
                    }
                };

            sap.ushell.Container = {
                logout: function () {
                    return new jQuery.Deferred().resolve().promise();
                },
                sessionKeepAlive: function () {
                    return new jQuery.Deferred().resolve().promise();
                }
            };

            SessionHandlerAgent.init();
            AppCommunicationMgr.init();

            var _handleMessageResponse = sinon.stub(AppCommunicationMgr, "_handleMessageResponse", function () {
                return new jQuery.Deferred().resolve(oFixture.output.response);
            });

            var _isTrustedPostMessageSourceSinon = sinon.stub(AppCommunicationMgr, "_isTrustedPostMessageSource",
                function (oContainer, oMessage) {
                    return true;
                });

            var oSpy = sinon.spy(SessionHandlerAgent, oFixture.api);

            AppCommunicationMgr._handleMessageRequest(oMockContainer, oFixture.input.oMessage, oFixture.input.oMessageData);

            equal(oSpy.calledOnce, true, oFixture.api + " invoked");

            _isTrustedPostMessageSourceSinon.restore();
            _handleMessageResponse.restore();
            oSpy.restore();

        });
    });

    [
        {
            testName: "logout should be called",
            input: {
                sFlpURL: "www.test.com"
            },
            output: {
                bLogoutCalled: true
            }
        },
        {
            testName: "logout should not be called",
            input: {
                sFlpURL: document.URL
            },
            output: {
                bLogoutCalled: false
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("Test " + oFixture.testName, function (assert) {

            sap.ushell.Container = {
                getFLPUrl: function () {
                    var oDeferred = new jQuery.Deferred();
                    setTimeout(function () {
                        oDeferred.resolve(oFixture.input.sFlpURL);
                    }, 10);
                    return oDeferred.promise();
                },
                logout: function () {
                }
            };

            var logoutStub = sinon.stub(sap.ushell.Container, "logout",
                function () {
                    return new jQuery.Deferred().resolve().promise();
                });

            SessionHandlerAgent.handleLogoutEvent().then(function () {
                equal(logoutStub.calledOnce, oFixture.output.bLogoutCalled, "logout was called: " + oFixture.output.bLogoutCalled);
                start();

                logoutStub.restore();
            });
        });
    });

    asyncTest("mousedown to trigger userActivityHandler", function () {

        SessionHandlerAgent.init();
        AppCommunicationMgr.init();

        var _isTrustedPostMessageSourceSinon = sinon.stub(AppCommunicationMgr, "_isTrustedPostMessageSource",
            function (oContainer, oMessage) {
                return true;
            });

        var _handleMessageResponse = sinon.stub(AppCommunicationMgr, "_handleMessageResponse", function () {
            return new jQuery.Deferred().resolve();//oFixture.output.response);
        });


        var sendMessageToOuterShell = sinon.stub(AppRuntimeService, "sendMessageToOuterShell", function (sMessageId, oParams, sRequestId) {
            var oDeffered = new jQuery.Deferred();

            assert.ok(sMessageId === "sap.ushell.sessionHandler.notifyUserActive",
                "notifyUserActive successfully delivered to Shell");
            start();

            SessionHandlerAgent.detachUserEvents();
            _isTrustedPostMessageSourceSinon.restore();
            _handleMessageResponse.restore();
            sendMessageToOuterShell.restore();

            return oDeffered.promise();
        });

        SessionHandlerAgent.userActivityHandler();

    });
});
