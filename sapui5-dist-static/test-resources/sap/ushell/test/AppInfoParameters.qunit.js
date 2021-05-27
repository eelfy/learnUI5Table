// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/AppInfoParameters",
    "sap/ushell/services/AppConfiguration",
    "sap/ui/VersionInfo",
    "sap/ushell/services/Container",
    "sap/base/Log"
], function (
    AppInfoParameters,
    oAppConfiguration,
    VersionInfo,
    Container,
    Log
) {
    "use strict";
    /* global QUnit sinon */
    var sandbox = sinon.sandbox.create();
    // homepage missing array call not valid parameter

    QUnit.module("sap.ushell.AppInfoParameters", {
        beforeEach: function () {
        },
        afterEach: function () {
            sandbox.restore();
        }
    });
    // error cases
    QUnit.test("getInfo is called without a required object, an application", function (assert) {
        var done = assert.async();
        AppInfoParameters.getInfo(["appFrameworkId"] /* application is missing here */)
            .then(function (oInfo) {
                assert.ok(false, "Promise was not rejected");
                done();
            }, function (oResult) {
                assert.ok(true, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo is called with an invalid parameter", function (assert) {
        var done = assert.async();
        AppInfoParameters.getInfo(["invalidParameter"], { applicationType: "UI5" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.invalidParameter, undefined, "Promise resolved with value undefined");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appId' if it is a function defined in a URL template", function (assert) {
        var done = assert.async();
        sandbox.stub(oAppConfiguration, "getCurrentApplication").returns(
            {
                appCapabilities: {
                    appFrameworkId: "SCP",
                    appId: function () {}
                }
            }
        );
        AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "URL" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, undefined, "resolves with appId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    // end error cases

    QUnit.test("getInfo resolves with the correct values when given an array'", 2, function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myValue"]);
            }
        };
        AppInfoParameters.getInfo(["appId", "appSupportInfo"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myValue", "resolves with 1st parameter correctly");
                assert.strictEqual(oInfo.appSupportInfo, "myValue", "resolves with 2 parameter correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appFrameworkId'", function (assert) {
        var done = assert.async();
        AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "UI5" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "UI5", "resolves with appFrameworkId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves appFrameworkId with 'GUI'  for 'TR' apps", function (assert) {
        var done = assert.async();
        AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "TR" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "GUI", "resolves with rewritten appFrameworkId");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appFrameworkId' if it is a URL template", function (assert) {
        var done = assert.async();
        sandbox.stub(oAppConfiguration, "getCurrentApplication").returns(
            { appCapabilities: { appFrameworkId: "SCP" } }
        );
        AppInfoParameters.getInfo(["appFrameworkId"], { applicationType: "URL" })
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "SCP", "resolves with appFrameworkId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    // abap

    QUnit.test("getInfo resolves with the correct value LAUNCHPAD for 'appId'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            homePage: true,
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };
        AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "LAUNCHPAD", "resolves with appId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    // plain vanilla use case
    QUnit.test("getInfo resolves with the correct value for 'appId'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",

            getTechnicalParameter: function () {
                return Promise.resolve().then(
                    function () {
                        return ["myApplicationId"];
                    }
                );
            }
        };
        AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves correctly for 'appFrameworkId', 'appId' in case of a url-template", function (assert) {
        var done = assert.async();
        sandbox.stub(sap.ushell.services.AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "UI5",
                appId: "myApplicationId"
            }
        });
        var oCurrentApplication = {
            applicationType: "URL",
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };

        AppInfoParameters.getInfo(["appFrameworkId", "appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkId, "UI5", "resolves with appFrameworkId correctly");
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appSupportInfo'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myAppSupportInfo"]);
            }
        };
        AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myAppSupportInfo", "resolves with appSupportInfo correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves correctly 'appSupportInfo' and 'technicalAppComponentId' for URL template", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "URL",
            getTechnicalParameter: function () {
                return Promise.resolve(undefined);
            }
        };
        sandbox.stub(oAppConfiguration, "getCurrentApplication").returns(
            {
                appCapabilities: {
                    appFrameworkId: "SCP",
                    appSupportInfo: "supportInfo",
                    technicalAppComponentId: "m.m"
                }
            }
        );
        AppInfoParameters.getInfo(["appSupportInfo", "technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appSupportInfo, "supportInfo", "resolves with appSupportInfo correctly");
                assert.strictEqual(oInfo.technicalAppComponentId, "m.m", "resolves with technicalAppComponentId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'productName' and custom property", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {
                        return {
                            getProperty: function () {
                                return "foo";
                            }
                        };
                    }
                );
            }
        };

        AppInfoParameters.getInfo(["productName", "myCustom.property"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.productName, "foo", "resolves with productName correctly");
                assert.strictEqual(oInfo["myCustom.property"], "foo", "resolves with custom property correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/ componentInstance, w/ manifest)", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getMetadata: function () {
                    return {
                        getManifestEntry: function () {
                            return "myComponentName";
                        }
                    };
                }
            }
        };

        AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/ componentInstance, w/o manifest)", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getMetadata: function () {
                    return {
                        getManifestEntry: function () {
                            return undefined;
                        },
                        getComponentName: function () {
                            return "myComponentName";
                        }
                    };
                }
            }
        };

        AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves technicalAppComponentId with the correct value (w/o componentInstance)", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5"
        };

        sandbox.stub(oAppConfiguration, "getMetadata").returns(
            {
                technicalName: "myComponentName"
            }
        );

        AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    // plain vanilla use case
    QUnit.test("getInfo resolves with the correct value for 'appId'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",

            getTechnicalParameter: function () {
                return Promise.resolve(["myApplicationId"]);
            }
        };
        AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myApplicationId", "resolves with appId correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'appSupportInfo'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            getTechnicalParameter: function () {
                return Promise.resolve(["myAppSupportInfo"]);
            }
        };
        AppInfoParameters.getInfo(["appId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appId, "myAppSupportInfo", "resolves with appSupportInfo correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'productName'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            getSystemContext: function () {
                return Promise.resolve().then(
                    function () {
                        return {
                            getProperty: function () {
                                return "myProductName";
                            }
                        };
                    }
                );
            }
        };

        AppInfoParameters.getInfo(["productName"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.productName, "myProductName", "resolves with productName correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for 'technicalAppComponentId'", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getMetadata: function () {
                    return {
                        getManifestEntry: function () {
                            return "myComponentName";
                        }
                    };
                }
            }

        };
        AppInfoParameters.getInfo(["technicalAppComponentId"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.technicalAppComponentId, "myComponentName", "resolves with technicalAppComponentId correctly");

                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for appIntent", function (assert) {
        var done = assert.async();
        sandbox.stub(sap.ushell.services.AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "SCP"
            }
        });
        var oApplication = {
            applicationType: "URL",
            appCapabilities: {
                appFrameworkId: "SCP"
            }
         };
        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(window.hasher, "getHash").returns("Shell-hash");
        AppInfoParameters.getInfo(
            ["appIntent"],
            oApplication
        )
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appIntent, "Shell-hash", "resolves with app intent correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves appFrameworkVersion with the correct value for UI5 apps", function (assert) {
        var done = assert.async();
        var oVersionStub = {
            version: "myVersion",
            buildTimestamp: "myTimestamp"
        };
        sandbox.stub(VersionInfo, "load").returns(
            Promise.resolve(oVersionStub)
        );
        var oCurrentApplication = {
            applicationType: "UI5"
        };
        AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(
                    oInfo.appFrameworkVersion,
                    "myVersion (myTimestamp)",
                    "resolves with the app framework version correctly"
                );
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves appFrameworkVersion with undefined for non-UI5 apps", function (assert) {
        var done = assert.async();
        var oVersionStub = {
            version: "myVersion",
            buildTimestamp: "myTimestamp"
        };
        sandbox.stub(VersionInfo, "load").returns(
            Promise.resolve(oVersionStub)
        );
        var oCurrentApplication = {
            applicationType: "WDA"
        };
        AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(
                    oInfo.appFrameworkVersion,
                    undefined,
                    "resolves with no framework version (undefined)"
                );
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with undefined for appFrameworkversion if the VersionInfo cannot be loaded properly", function (assert) {
        var done = assert.async();
        sandbox.stub(VersionInfo, "load").returns(
            Promise.reject(undefined)
        );
        var oLogErrorStub = sinon.stub(Log, "error");
        var oCurrentApplication = {
            applicationType: "UI5"
        };
        AppInfoParameters.getInfo(["appFrameworkVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appFrameworkVersion, undefined, "resolves with the app framework verions correctly");
                assert.strictEqual(oLogErrorStub.firstCall.args[0], "VersionInfo could not be loaded", "Error was logged");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });


    QUnit.test("getInfo resolves with the correct value for appVersion", function (assert) {
        var done = assert.async();
        var oCurrentApplication = {
            applicationType: "UI5",
            componentInstance: {
                getManifestEntry: function () {
                    return "myVersion";
                }
            }
        };
        AppInfoParameters.getInfo(["appVersion"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.appVersion, "myVersion", "resolves with the app version id correctly");
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                done();
            });
    });

    QUnit.test("getInfo resolves with the correct value for theme and language", function (assert) {
        var done = assert.async();
        var oContainer = sap.ushell.Container;
        sandbox.stub(sap.ushell.services.AppConfiguration, "getCurrentApplication").returns({
            appCapabilities: {
                appFrameworkId: "URL"
            }
        });
        sap.ushell.Container = {
            getService: sandbox.stub().withArgs("ReferenceResolver").returns({
                resolveReferences: function () {
                    return Promise.resolve({
                        "User.env.sap-theme-NWBC": "blue",
                        "User.env.sap-languagebcp47": "foo"
                    });
                }
            })
        };
        var oCurrentApplication = {
            applicationType: "URL"
        };
        AppInfoParameters.getInfo(["theme", "languageTag"], oCurrentApplication)
            .then(function (oInfo) {
                assert.strictEqual(oInfo.theme, "blue", "resolves with the appIcon id correctly");
                assert.strictEqual(oInfo.languageTag, "foo", "resolves with the appIcon id correctly");
                sap.ushell.Container = oContainer;
                done();
            }, function (oResult) {
                assert.ok(false, "Promise was rejected with message " + oResult);
                sap.ushell.Container = oContainer;
                done();
            });
    });
});
