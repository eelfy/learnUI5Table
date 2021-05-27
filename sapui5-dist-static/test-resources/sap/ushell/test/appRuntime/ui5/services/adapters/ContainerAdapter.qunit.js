// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.adapters.ContainerAdapter
 */
sap.ui.require([
    "sap/ushell/appRuntime/ui5/services/adapters/ContainerAdapter"
], function (ContainerAdapter) {
    "use strict";
    /*global QUnit*/

    QUnit.module("sap.ushell.appRuntime.ui5.services.adapters.ContainerAdapter", {
    });

    [{
        testDescription: "no userProfile in adapter config",
        input: {
            oConfig: {
            }
        },
        expected: {
            // everything should be undefined
        }
    }, {
        testDescription: "userProfile with personalization",
        input: {
            oConfig: {
                userProfile: {
                    metadata: {
                    },
                    defaults: {
                        id: "USERT",
                        email: "test.user@sap.com",
                        firstName: "Test",
                        lastName: "User",
                        fullName: "Test User",
                        sapDateFormat: "2",
                        sapTimeFormat: "0",
                        sapNumberFormat: "",
                        isJamActive: false,
                        sapDateCalendarCustomizing: "",
                        currencyFormats: {
                            BHD: {digits: 3},
                            BIF: {digits: 0},
                            BYR: {digits: 0},
                            CLP: {digits: 0},
                            COP: {digits: 0},
                            DEFAULT: {digits: 2},
                            DJF: {digits: 0},
                            GNF: {digits: 0},
                            HUF: {digits: 0},
                            IDR: {digits: 0},
                            IQD: {digits: 3},
                            JOD: {digits: 3},
                            JPY: {digits: 0},
                            KMF: {digits: 0},
                            KRW: {digits: 0}
                        }
                    }
                }
            }
        },
        expected: {
            id: "USERT",
            email: "test.user@sap.com",
            firstName: "Test",
            lastName: "User",
            fullName: "Test User",
            sapDateFormat: "2",
            sapTimeFormat: "0",
            sapNumberFormat: undefined,
            isJamActive: false,
            sapDateCalendarCustomizing: undefined,
            currencyFormats: {
                BHD: {digits: 3},
                BIF: {digits: 0},
                BYR: {digits: 0},
                CLP: {digits: 0},
                COP: {digits: 0},
                DEFAULT: {digits: 2},
                DJF: {digits: 0},
                GNF: {digits: 0},
                HUF: {digits: 0},
                IDR: {digits: 0},
                IQD: {digits: 3},
                JOD: {digits: 3},
                JPY: {digits: 0},
                KMF: {digits: 0},
                KRW: {digits: 0}
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var oAdapter;
            // act
            oAdapter = new sap.ushell.appRuntime.ui5.services.adapters.ContainerAdapter(this.initialSystem, undefined,
                {config: oFixture.input.oConfig});
            oAdapter.load();
            var oCore = sap.ui.getCore(),
                oConfiguration = oCore.getConfiguration(),
                oFormatSettings = oConfiguration.getFormatSettings();
            // assert
            assert.strictEqual(oFormatSettings.getLegacyDateFormat(), oFixture.expected.sapDateFormat, "sapDateFormat");
            assert.strictEqual(oFormatSettings.getLegacyDateCalendarCustomizing(), oFixture.expected.sapDateCalendarCustomizing, "sapDateCalendarCustomizing");
            assert.strictEqual(oFormatSettings.getLegacyNumberFormat(), oFixture.expected.sapNumberFormat, "sapNumberFormat");
            assert.strictEqual(oFormatSettings.getLegacyTimeFormat(), oFixture.expected.sapTimeFormat, "sapTimeFormat");
            assert.deepEqual(oFormatSettings.getCustomCurrencies(), oFixture.expected.currencyFormats, "currencyFormats");
        });
    });
});