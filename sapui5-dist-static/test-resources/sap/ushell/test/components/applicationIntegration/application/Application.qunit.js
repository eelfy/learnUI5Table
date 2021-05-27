// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.Application
 */
sap.ui.require([
    'sap/ushell/components/applicationIntegration/application/Application',
    'sap/ui/base/ManagedObject'
], function (Application, ManagedObject) {
    "use strict";
    /* global module ok deepEqual QUnit sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    jQuery.sap.require("sap.ushell.EventHub");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    module("sap.ushell.components.applicationIntegration.configuration.AppMeta", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    QUnit.test("stringify and parse", function (assert) {
        var parent = {};
        var child = {};
        parent.child = child;
        child.parent = parent;

        [
            {
                sTest: "very complex with circ object",
                sMsg: "very complex with circ deep equals",
                oData: {
                    ev: {
                        v1: false,
                        v2: true
                    }
                },
                oResp: {
                    ev: {
                        v1: false,
                        v2: true
                    }
                }
            },
            {
                sTest: "simple object",
                sMsg: "simple objects verified",
                oData: {
                    test: 1
                },
                oResp: {
                    test: 1
                }
            },
            {
                sTest: "more complex object",
                sMsg: "more complex objects verified tdeep equals",
                oData: {
                    parent: parent,
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                },
                oResp: {
                    parent: {
                        child: {
                        }
                    },
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                }
            },
            {
                sTest: "circular complex object",
                sMsg: "circular  objects verified tdeep equals no ",
                oData: {
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                },
                oResp: {
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                }
            }
        ].forEach(function (oFixture) {
            var sStrObj = Application.stringify(oFixture.oData),
                oResp = Application.parse(sStrObj);

            deepEqual(oFixture.oResp, oResp, "ok", oFixture.sMsg);
        });
    });
    QUnit.test("stringify and parse with function", function (assert) {
        var parent = {};
        var child = {};
        parent.child = child;
        child.parent = parent;

        [
            {
                sTest: "object with function",
                sMsg: "verify tunnels object with function",
                oData: {
                    foo: function (xxx) {
                    }
                },
                oResp: {
                    UUID: 1
                }
            }
        ].forEach(function (oFixture) {
            Application.postMessageToIframeApp = function (oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse) {
                ok(oFixture.oResp.UUID, oMessageBody.content.UUID, oFixture.sMsg);
            };
            var sStrObj = Application.stringify(oFixture.oData),
                oResp = Application.parse(sStrObj);

            oResp.foo();
        });
    });

    [
        {
            testDescription: "no parameters is valid",
            input: {
                oTargetResolution: {
                }
            },
            expected: {
                oTargetResolution: {
                },
                oTempTarget: {
                },
                bOK: true
            }
        },
        {
            testDescription: "all parameters are valid",
            input: {
                oTargetResolution: {
                    blocked: false,
                    visible: true,
                    additionalInformation: "1234",
                    url: "abcd1234"
                }
            },
            expected: {
                oTargetResolution: {
                    blocked: false,
                    visible: true,
                    additionalInformation: "1234",
                    url: "abcd1234"
                },
                oTempTarget: {
                },
                bOK: true
            }
        },
        {
            testDescription: "one invalid parameter",
            input: {
                oTargetResolution: {
                    aaaa: false
                }
            },
            expected: {
                oTargetResolution: {
                },
                oTempTarget: {
                    aaaa: false
                },
                bOK: true
            }
        },
        {
            testDescription: "several invalid parameters",
            input: {
                oTargetResolution: {
                    aaaa: false,
                    bbbb: true,
                    cccc: false
                }
            },
            expected: {
                oTargetResolution: {
                },
                oTempTarget: {
                    aaaa: false,
                    bbbb: true,
                    cccc: false
                },
                bOK: true
            }
        },
        {
            testDescription: "mix of valid and invalid parameters",
            input: {
                oTargetResolution: {
                    blocked: false,
                    aaaa: false,
                    visible: true,
                    bbbb: true,
                    additionalInformation: "abcd",
                    url: "12345678"
                }
            },
            expected: {
                oTargetResolution: {
                    blocked: false,
                    visible: true,
                    additionalInformation: "abcd",
                    url: "12345678"
                },
                oTempTarget: {
                    aaaa: false,
                    bbbb: true
                },
                bOK: true
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("createApplicationContainer without error in log - " + oFixture.testDescription, function (assert) {
            var oAppCont,
                bOK = true,
                consoleStub = sinon.stub(console, "trace", function (bVal, sVal) {
                    if (sVal && sVal.includes("ManagedObject.apply: encountered unknown setting")) {
                        bOK = false;
                    }
                }),
                oRestoreTargetResolutionStub = sinon.stub(Application, "_restoreTargetResolution"),
                oApplySettingsStub = sinon.spy(ManagedObject.prototype, "applySettings");

            Application.init({
                setAppCapabilities: function () {}
            });

            oAppCont = Application.createApplicationContainer("a.b.c", oFixture.input.oTargetResolution);
            ok(bOK === oFixture.expected.bOK, "error message written to the console when it should not");
            ok(oApplySettingsStub.calledWith(oFixture.expected.oTargetResolution, undefined), "wrong parameters to application container constructor");
            ok(oRestoreTargetResolutionStub.calledWith(oFixture.input.oTargetResolution, oFixture.expected.oTempTarget), "wrong parameters to _restoreTargetResolution");
            consoleStub.restore();
            oAppCont.destroy();
            oRestoreTargetResolutionStub.restore();
            oApplySettingsStub.restore();
        });
    });
});
