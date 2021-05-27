// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserEnvParameters
 */
sap.ui.require([
    "sap/ushell/services/ReferenceResolver",
    "sap/ushell/test/utils",
    "sap/base/Log"
], function (ReferenceResolver, testUtils, Log) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.services.ReferenceResolver", {
        beforeEach: function () {
            // Ensure test doesn't rely on other services or the container object (i.e., test is isolated)
            sap.ushell.Container = {};

            this.oService = new ReferenceResolver();
        },
        afterEach: function () {
            testUtils.restoreSpies(
                jQuery.sap.log.error,
                sap.ui.getCore,
                sap.ushell.Container.getUser,
                sap.ui.getCore().getConfiguration
            );
        }
    });

    QUnit.test("constructor constructs a service object", function (assert) {
        assert.strictEqual(typeof this.oService, "object", "the service has an object type");
        assert.strictEqual(typeof this.oService.resolveReferences, "function", "the resolveReferences function exists in the service");
        assert.strictEqual(typeof this.oService._getUserEnvReferenceResolver, "function", "the _getUserEnvReferenceResolver function exists in the service");
    });

    QUnit.test("_getUserEnvReferenceResolver", function (assert) {
        // Arrange
        var oResolver;
        // Act
        oResolver = this.oService._getUserEnvReferenceResolver();
        // Assert
        assert.strictEqual(typeof oResolver, "object", "returns an object");
        assert.strictEqual(typeof oResolver.getValue, "function", "returns an expected function");
    });

    QUnit.test("UserEnvReferenceResolver#getValue: return value", function (assert) {
        var oResolver = this.oService._getUserEnvReferenceResolver();
        var oValue = oResolver.getValue("something");
        assert.strictEqual(typeof oValue, "object", "getValue returned an object");
        assert.strictEqual(typeof oValue.then, "function", "instance returned is thenable");
    });

    (function () {
        var oBaseEnv = {
            /*
             * This is the base environment containing the raw values usually stored deeply in the User object or the UI5 configuration,
             * which will be mocked accordingly in the tests.
             */
            "configLegacyDateFormat": "DATEFORMAT",
            "configLegacyNumberFormat": "NUMBERFORMAT",
            "configLegacyTimeFormat": "TIMEFORMAT",
            "userLanguage": "LANG",
            "userLanguageBcp47": "LANGBCP",
            "userAccessibilityMode": "ACCESSIBILITY",
            "configStatistics": "STATISTICS",
            "userThemeName": "THEME",
            "userTheme": "THEME",
            "userThemeNWBC": "THEME"
        };

        [{
            testedGetter: "getLegacyDateFormat",
            testDescription: "base env is used with sap-ui-legacy-date-format",
            sUserEnvReferenceName: "User.env.sap-ui-legacy-date-format",
            expectedValue: oBaseEnv.configLegacyDateFormat,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getLegacyNumberFormat",
            testDescription: "base env is used with sap-ui-legacy-number-format",
            sUserEnvReferenceName: "User.env.sap-ui-legacy-number-format",
            expectedValue: oBaseEnv.configLegacyNumberFormat,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getLegacyTimeFormat",
            testDescription: "base env is used with sap-ui-legacy-time-format",
            sUserEnvReferenceName: "User.env.sap-ui-legacy-time-format",
            expectedValue: oBaseEnv.configLegacyTimeFormat,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getLanguage",
            testDescription: "base env is used with sap-language",
            sUserEnvReferenceName: "User.env.sap-language",
            expectedValue: oBaseEnv.userLanguage,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getLanguageBcp47",
            testDescription: "base env is used with sap-languagebcp47",
            sUserEnvReferenceName: "User.env.sap-languagebcp47",
            expectedValue: oBaseEnv.userLanguageBcp47,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getAccessibilityMode",
            testDescription: "base env is used with sap-accessibility as true",
            sUserEnvReferenceName: "User.env.sap-accessibility",
            expectedValue: "X",
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getAccessibilityMode",
            testDescription: "base env is used with sap-accessibility as false",
            sUserEnvReferenceName: "User.env.sap-accessibility",
            expectedValue: "X",
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getStatistics",
            testDescription: "base env is used with sap-statistics as true",
            sUserEnvReferenceName: "User.env.sap-statistics",
            expectedValue: "true",
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getStatistics",
            testDescription: "base env is used with sap-statistics as false",
            sUserEnvReferenceName: "User.env.sap-statistics",
            expectedValue: "true",
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getTheme",
            testDescription: "base env is used with sap-theme",
            sUserEnvReferenceName: "User.env.sap-theme",
            expectedValue: oBaseEnv.userTheme,
            expectedGetterCalledWith: ["N+U"]
        }, {
            testedGetter: "getTheme",
            testDescription: "base env is used with sap-theme-name",
            sUserEnvReferenceName: "User.env.sap-theme-name",
            expectedValue: oBaseEnv.userThemeName,
            expectedGetterCalledWith: []
        }, {
            testedGetter: "getTheme",
            testDescription: "base env is used with sap-theme-NWBC",
            sUserEnvReferenceName: "User.env.sap-theme-NWBC",
            expectedValue: oBaseEnv.userThemeNWBC,
            expectedGetterCalledWith: ["NWBC"]
        }].forEach(function (oFixture) {
            QUnit.test("UserEnvResolver#getValue: expected value for known user env default returned when " + oFixture.testDescription, function (assert) {
                // Arrange
                var done = assert.async();
                var oResolver = this.oService._getUserEnvReferenceResolver();

                var oStubs = {
                    getTheme: sinon.stub().returns(oBaseEnv.userTheme),
                    getLanguage: sinon.stub().returns(oBaseEnv.userLanguage),
                    getLanguageBcp47: sinon.stub().returns(oBaseEnv.userLanguageBcp47),
                    getAccessibilityMode: sinon.stub().returns(oBaseEnv.userAccessibilityMode),
                    getStatistics: sinon.stub().returns(oBaseEnv.configStatistics),
                    getLegacyDateFormat: sinon.stub().returns(oBaseEnv.configLegacyDateFormat),
                    getLegacyNumberFormat: sinon.stub().returns(oBaseEnv.configLegacyNumberFormat),
                    getLegacyTimeFormat: sinon.stub().returns(oBaseEnv.configLegacyTimeFormat)
                };

                sap.ushell.Container.getUser = function () {
                    return {
                        getTheme: oStubs.getTheme,
                        getLanguage: oStubs.getLanguage,
                        getLanguageBcp47: oStubs.getLanguageBcp47,
                        getAccessibilityMode: oStubs.getAccessibilityMode
                    };
                };

                sinon.stub(sap.ui.getCore(), "getConfiguration").returns({
                    getStatistics: oStubs.getStatistics,
                    getFormatSettings: function () {
                        return {
                            getLegacyDateFormat: oStubs.getLegacyDateFormat,
                            getLegacyNumberFormat: oStubs.getLegacyNumberFormat,
                            getLegacyTimeFormat: oStubs.getLegacyTimeFormat
                        };
                    }
                });

                // Act
                oResolver.getValue(oFixture.sUserEnvReferenceName)
                    .done(function (oValue) {
                        assert.ok(true, "promise was resolved");

                        assert.deepEqual(oValue, {
                            value: oFixture.expectedValue
                        }, "the promise was resolved with the expected value");

                        var oCalledStub = oStubs[oFixture.testedGetter];
                        assert.deepEqual(oCalledStub.getCall(0).args, oFixture.expectedGetterCalledWith, "the " + oFixture.testedGetter + " getter was called with the expected arguments");

                    })
                    .fail(function () {
                        assert.ok(false, "promise was resolved");
                    })
                    .always(done);
            });
        });

    })();

    [{
        testDescription: "not all references could be resolved",
        aReferences: ["UserDefault.name", "UserDefault.surname", "Machine.name"],
        expectedErrorLogCalls: 1,
        expectedErrorLogCallArgs: [
            "'Machine.name' is not a legal reference name",
            null,
            "sap.ushell.services.ReferenceResolver"
        ]
    }].forEach(function (oFixture) {
        QUnit.test("resolveReferences: rejects with error message when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            var oSrvc = this.oService;

            var oStub = sinon.stub(Log, "error");

            oSrvc.resolveReferences(oFixture.aReferences, {})
                .done(function () {
                    assert.ok(false, "promise was rejected");
                })
                .fail(function (sError) {
                    assert.ok(true, "promise was rejected");
                    assert.strictEqual(sError, "One or more references could not be resolved", "promise was rejected with expected error message");
                    assert.strictEqual(oStub.getCalls().length, oFixture.expectedErrorLogCalls, "Log.error was called " + oFixture.expectedErrorLogCalls + " time");
                    assert.deepEqual(oStub.getCall(0).args, oFixture.expectedErrorLogCallArgs, "Log.error was called with the expected arguments");
                })
                .always(done);
        });
    });

    [
        { "description": "1", input: "UserDefault.extended.A", o1: undefined, o2: "A", o3: "A" },
        { "description": "2", input: "UserDefault.A", o1: "A", o2: undefined, o3: "A" },
        { "description": "3", input: "UserDefault.extended", o1: "extended", o2: undefined, o3: "extended" },
        { "description": "4", input: "UserDefaultA", o1: undefined, o2: undefined, o3: undefined },
        { "description": "5", input: "UserDefault.extendedB", o1: "extendedB", o2: undefined, o3: "extendedB" },
        { "description": "6", input: "UserDefault.extended.", o1: undefined, o2: "", o3: "" },
        { "description": "7", input: "UserDefault.", o1: "", o2: undefined, o3: "" },
        { "description": "8", input: "A.UserDefault.extended.AX", o1: undefined, o2: undefined, o3: undefined }
    ].forEach(function (oFixture) {
        QUnit.test("extractExtendUserDefaultName: " + oFixture.description, function (assert) {
            var oSrvc = this.oService;
            var actual1 = oSrvc.extractUserDefaultReferenceName(oFixture.input);
            var actual2 = oSrvc.extractExtendedUserDefaultReferenceName(oFixture.input);
            assert.equal(actual1, oFixture.o1, " extractUserDefaultReferenceName ok");
            assert.equal(actual2, oFixture.o2, " extractExtendedUserDefaultReferenceName ok");
            var actual3 = oSrvc._extractAnyUserDefaultReferenceName(oFixture.input);
            assert.equal(actual3, oFixture.o3, " extractExtendedUserDefaultReferenceName ok");
        });
    });

    // _mergeSimpleAndExtended
    [{
        description: "simple and extended values",
        initialValueObject: {
            "value": "0", // numbers also have to be strings as part of a range
            "extendedValue": { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] }
        },
        expectedMergedObject: {
            "Ranges": [
                { "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" },
                { "Sign": "I", "Option": "EQ", "Low": "0", "High": null }
            ]
        }
    }, {
        description: "simple value undefined",
        initialValueObject: {
            "value": undefined,
            "extendedValue": { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] }
        },
        expectedMergedObject: { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] }
    }, {
        description: "simple value empty string",
        initialValueObject: {
            "value": "",
            "extendedValue": { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] }
        },
        expectedMergedObject: {
            "Ranges": [
                { "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" },
                { "Sign": "I", "Option": "EQ", "Low": "", "High": null }
            ]
        }
    }, {
        description: "no extended value",
        initialValueObject: {
            "value": "0",
            "extendedValue": undefined
        },
        expectedMergedObject: { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "0", "High": null }] }
    }, {
        description: "no extended value",
        initialValueObject: {
            "value": undefined,
            "extendedValue": undefined
        },
        expectedMergedObject: {}
    }].forEach(function (oFixture) {
        QUnit.test("mergeSimpleAndExtended: " + oFixture, function (assert) {
            assert.deepEqual(this.oService.mergeSimpleAndExtended(oFixture.initialValueObject),
                oFixture.expectedMergedObject, "merged as expected");
        });
    });

    [{
        testDescription: "resolving a user default reference",
        aReferences: ["UserDefault.hometown"],
        oDefaultResolvedReferences: { "hometown": { value: "walldorf" } },
        expectedResolution: { "UserDefault.hometown": "walldorf" }
    }, {
        testDescription: "resolving a user env reference",
        aReferences: ["User.env.sap-theme"],
        oDefaultResolvedReferences: { "User.env.sap-theme": { value: "our_theme" } },
        expectedResolution: { "User.env.sap-theme": "our_theme" }
    }, {
        testDescription: "resolving an extended user default reference",
        aReferences: ["UserDefault.extended.hometown"],
        oDefaultResolvedReferences: { "hometown": { extendedValue: { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] } } },
        expectedResolution: {
            "UserDefault.extended.hometown": {
                "Ranges": [{
                    "High": "B",
                    "Low": "A",
                    "Option": "EQ",
                    "Sign": "I"
                }]
            }
        }
    }, {
        testDescription: "resolving a simple and an extended user default reference",
        aReferences: ["UserDefault.extended.hometown", "UserDefault.hometown"],
        oDefaultResolvedReferences: {
            "hometown": {
                value: "walldorf",
                extendedValue: { "Ranges": [{ "Sign": "I", "Option": "EQ", "Low": "A", "High": "B" }] }
            }
        },
        expectedResolution: {
            "UserDefault.extended.hometown": {
                "Ranges": [
                    {
                        "High": "B",
                        "Low": "A",
                        "Option": "EQ",
                        "Sign": "I"
                    }, {
                        "High": null,
                        "Low": "walldorf",
                        "Option": "EQ",
                        "Sign": "I"
                    }
                ]
            },
            "UserDefault.hometown": "walldorf"
        }
    }].forEach(function (oFixture) {
        QUnit.test("resolveReferences: resolves as expected when " + oFixture.testDescription, function (assert) {
            //Arrange
            var done = assert.async();
            // Stub the UserDefaultParameters service
            var oGetServiceStub = sinon.stub();
            var fnFakeGetValue = function (sReferenceName) {
                var oResolvedReference = oFixture.oDefaultResolvedReferences[sReferenceName];
                return new jQuery.Deferred().resolve(oResolvedReference).promise();
            };

            var oFakeUserDefaultParameters = {
                getValue: fnFakeGetValue
            };

            oGetServiceStub.withArgs("UserDefaultParameters").returns(oFakeUserDefaultParameters);
            oGetServiceStub.throws("This test expects that only UserDefaultParameters is passed to getService");
            sap.ushell.Container = {
                getService: oGetServiceStub
            };

            // Stub the UserEnvResolver object
            sinon.stub(this.oService, "_getUserEnvReferenceResolver").returns({
                getValue: fnFakeGetValue

            });
            this.oService.resolveReferences(oFixture.aReferences, {})
                .done(function (oResolvedReferences) {
                    assert.ok(true, "the promise was resolved");

                    assert.deepEqual(
                        oResolvedReferences,
                        oFixture.expectedResolution,
                        "references were resolved as expected"
                    );
                })
                .fail(function (sError) {
                    assert.ok(false, "the promise was resolved. Error: " + sError);
                })
                .always(done);
        });
    });

    [{
        testDescription: "Given URL without any parameters, nothing is replaced",
        input: { sUrl: "/some/url" },
        expected: {
            result: {
                url: "/some/url",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL without user default parameters, nothing is replaced",
        input: { sUrl: "/some/url?a=b&c=100" },
        expected: {
            result: {
                url: "/some/url?a=b&c=100",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with wrong reference, nothing is replaced",
        input: { sUrl: "/some/url?a=b&c={Edm.String%%noUserDefault.foo%%}&d={Edm.String%%UserDefault1%%}&e={Edm.String%%UserDefault.%%}" },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%noUserDefault.foo%%}&d={Edm.String%%UserDefault1%%}&e={Edm.String%%UserDefault.%%}",
                defaultsWithoutValue: [],
                ignoredReferences: [
                    "noUserDefault.foo",
                    "UserDefault1",
                    "UserDefault."
                ]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with one user default parameters with value (encoding needed)",
        input: {
            sUrl: "/some/url?a=100%25&c={Edm.String%%UserDefault.CompanyCode%%}",
            oResolvedReferences: { "UserDefault.CompanyCode": "hello world?" }
        },
        expected: {
            result: {
                url: "/some/url?a=100%25&c='hello%20world%3F'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters with value",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": 1234,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=1234&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters, one with value, one without",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": undefined,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=&d='ABC'",
                defaultsWithoutValue: ["UserDefault.CompanyCode"],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Given URL with two user default parameters, one with value, one without",
        input: {
            sUrl: "/some/url?a=b&c={%%UserDefault.CompanyCode%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: {
                "UserDefault.CompanyCode": 0,
                "UserDefault.CostCenter": "ABC"
            }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c=0&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Do not replace invalid parameters",
        input: {
            sUrl: "/some/url?a=b&c={Edm.String%%noUserDefault%%}&d={Edm.String%%UserDefault.CostCenter%%}",
            oResolvedReferences: { "UserDefault.CostCenter": "ABC" }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%noUserDefault%%}&d='ABC'",
                defaultsWithoutValue: [],
                ignoredReferences: ["noUserDefault"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "skip UserDefault.extended",
        input: {
            sUrl: "/some/url?a=b&c={Edm.String%%UserDefault.extended.CompanyCode%%}&d={Edm.String%%UserDefault.extendedName%%}",
            oResolvedReferences: { "UserDefault.extendedName": "foo" }
        },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%UserDefault.extended.CompanyCode%%}&d='foo'",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.extended.CompanyCode"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "skip User.env",
        input: { sUrl: "/some/url?a=b&c={Edm.String%%User.env.sap-theme-name%%}&d=100" },
        expected: {
            result: {
                url: "/some/url?a=b&c={Edm.String%%User.env.sap-theme-name%%}&d=100",
                defaultsWithoutValue: [],
                ignoredReferences: ["User.env.sap-theme-name"]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault and filter",
        input: {
            sUrl: "/some/url/$count?$filter=substring(title, 1) eq {Edm.String%%UserDefault.title%%}",
            oResolvedReferences: { "UserDefault.title": "foo" }
        },
        expected: {
            result: {
                url: "/some/url/$count?$filter=substring(title, 1) eq 'foo'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault in path",
        input: {
            sUrl: "/somepath({Edm.String%%UserDefault.choosenNumber%%})/someurl/$value",
            oResolvedReferences: { "UserDefault.choosenNumber": "2" }
        },
        expected: {
            result: {
                url: "/somepath('2')/someurl/$value",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault in wrong place",
        input: {
            sUrl: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value",
            oResolvedReferences: { "UserDefault.choosenPath": "oData.svc" }
        },
        expected: {
            result: {
                url: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.choosenPath"]
            },
            resolvedReferencesCalled: false,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault with unknown type",
        input: {
            sUrl: "/some/url/$count?$filter=substring(title, 1) eq '{Edm.Unknown%%UserDefault.title%%}'",
            oResolvedReferences: { "UserDefault.title": "foo" }
        },
        expected: {
            result: {
                url: "/some/url/$count?$filter=substring(title, 1) eq 'foo'",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "UserDefault without type",
        input: {
            sUrl: "/some/url?a=20&sap-client={%%UserDefault.client%%}",
            oResolvedReferences: { "UserDefault.client": 120 }
        },
        expected: {
            result: {
                url: "/some/url?a=20&sap-client=120",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: false
        }
    }, {
        testDescription: "Same UserDefault in multiple places",
        input: {
            sUrl: "/some/url?a=20&sap-client={%%UserDefault.client%%}&b={%%UserDefault.client%%}",
            oResolvedReferences: { "UserDefault.client": 120 }
        },
        expected: {
            result: {
                url: "/some/url?a=20&sap-client=120&b=120",
                defaultsWithoutValue: [],
                ignoredReferences: []
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: true
        }
    }, {
        testDescription: "Same UserDefault in multiple places, one of them in the wrong place",
        input: {
            sUrl: "some/{Edm.String%%UserDefault.choosenPath%%}/url/$value?a={Edm.String%%UserDefault.choosenPath%%}",
            oResolvedReferences: { "UserDefault.choosenPath": "oData.svc" }
        },
        expected: {
            result: {
                url: "some/'oData.svc'/url/$value?a='oData.svc'",
                defaultsWithoutValue: [],
                ignoredReferences: ["UserDefault.choosenPath"]
            },
            resolvedReferencesCalled: true,
            bSameCallsMultipleTimes: true
        }
    }].forEach(function (oFixture) {
        QUnit.test("resolveUserDefaultParameters " + oFixture.testDescription, function (assert) {
            //Arrange
            var done = assert.async();
            var fnResolveRefsStub = sinon.stub(this.oService, "resolveReferences").callsFake(function () {
                return new jQuery.Deferred()
                    .resolve(oFixture.input.oResolvedReferences || {}) // fallback to fail properly
                    .promise();
            });

            //Act
            this.oService.resolveUserDefaultParameters(oFixture.input.sUrl)
                .done(function (oResult) {
                    //Assert
                    assert.deepEqual(oResult, oFixture.expected.result, "result");
                    assert.strictEqual(fnResolveRefsStub.callCount,
                        oFixture.expected.resolvedReferencesCalled ? 1 : 0,
                        "resolvedReferences callCount");
                    if (oFixture.expected.resolvedReferencesCalled && !oFixture.expected.bSameCallsMultipleTimes) {
                        assert.deepEqual(fnResolveRefsStub.firstCall.args[0],
                            Object.keys(oFixture.input.oResolvedReferences),
                            "resolveReferences called with correct User Default Names");
                    }
                })
                .fail(function (sError) {
                    assert.ok(false, "Unexpected failure: " + sError);
                })
                .always(done);
        });
    });

    QUnit.module("The method resolveReferences", {
        beforeEach: function () {
            this.oDefaultSystemContextMock = {};
            this.oGetServiceStub = sandbox.stub();
            this.getServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub,
                getServiceAsync: this.getServiceAsyncStub
            };

            this.oGetValueStub = sandbox.stub();
            this.oGetValueStub.callsFake(function (sName) {
                return {
                    value: "sName"
                };
            });
            this.oGetServiceStub.withArgs("UserDefaultParameters").returns({
                getValue: this.oGetValueStub
            });

            this.oGetSystemContextStub = sandbox.stub();
            this.oGetSystemContextStub.resolves(this.oDefaultSystemContextMock);
            this.getServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: this.oGetSystemContextStub
            });

            this.oService = new ReferenceResolver();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Processes a systemContext correctly", function (assert) {
        // Arrange
        var done = assert.async();
        var oSystemContext = {};
        var aUserDefault = ["UserDefault.someDefault"];
        // Act
        this.oService.resolveReferences(aUserDefault, oSystemContext)
            .done(function () {
                // Assert
                assert.strictEqual(this.oGetValueStub.getCall(0).args[0], "someDefault", "getValue was called with the correct key");
                assert.strictEqual(this.oGetValueStub.getCall(0).args[1], oSystemContext, "getValue was called with the correct systemContext");
                assert.strictEqual(this.oGetSystemContextStub.callCount, 0, "getSystemContext was not called");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "promise was rejected");
            })
            .always(done);
    });

    QUnit.test("Processes a defaultSystemContext correctly", function (assert) {
        // Arrange
        var done = assert.async();
        var aUserDefault = ["UserDefault.someDefault"];
        // Act
        this.oService.resolveReferences(aUserDefault)
            .done(function () {
                // Assert
                assert.strictEqual(this.oGetValueStub.getCall(0).args[0], "someDefault", "getValue was called with the correct key");
                assert.strictEqual(this.oGetValueStub.getCall(0).args[1], this.oDefaultSystemContextMock, "getValue was called with the correct systemContext");
                assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called once");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "promise was rejected");
            })
            .always(done);
    });

    QUnit.module("The method resolveUserDefaultParameters", {
        beforeEach: function () {
            this.oGetServiceStub = sandbox.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };

            this.oService = new ReferenceResolver();
            this.oResolveReferencesStub = sandbox.stub(this.oService, "resolveReferences");
            this.oResolveReferencesStub.returns(new jQuery.Deferred().resolve({}));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Processes a systemContext correctly", function (assert) {
        // Arrange
        var done = assert.async();
        var oSystemContext = {};
        var sUrl = "* https://some.url/string/with?param={%%UserDefault.someDefault%%}";
        // Act
        this.oService.resolveUserDefaultParameters(sUrl, oSystemContext)
            .done(function () {
                // Assert
                assert.deepEqual(this.oResolveReferencesStub.getCall(0).args[0], ["UserDefault.someDefault"], "resolveReferences was called with the correct key");
                assert.strictEqual(this.oResolveReferencesStub.getCall(0).args[1], oSystemContext, "resolveReferences was called with the correct systemContext");
            }.bind(this))
            .fail(function () {
                assert.ok(false, "promise was rejected");
            })
            .always(done);
    });
});
