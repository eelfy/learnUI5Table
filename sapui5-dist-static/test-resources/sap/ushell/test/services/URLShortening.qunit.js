// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.URLShortening
 */
sap.ui.require([
    "sap/ushell/services/Container"
], function (
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var oldUrlLengthLimit = 1024,
    oldUrlParamsLengthLimit = 512;

    function saveLengthLimit (shortener) {
        oldUrlLengthLimit = shortener.URL_LENGTH_LIMIT;
        shortener.URL_LENGTH_LIMIT = 60;
        oldUrlParamsLengthLimit = shortener.URL_PARAMS_LENGTH_LIMIT;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
    }

    function restoreLengthLimit (shortener) {
        shortener.URL_LENGTH_LIMIT = oldUrlLengthLimit;
        shortener.URL_PARAMS_LENGTH_LIMIT = oldUrlParamsLengthLimit;
    }

    QUnit.module("sap.ushell.services.URLShortening", {
        beforeEach: function () {
            stop();
            sap.ushell.bootstrap("local").then(QUnit.start);
        },
        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("getServiceURLShortening", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (oURLShortening) {
            assert.ok(oURLShortening !== undefined);
            done();
        });
    });

    QUnit.test("shortenURLEmpty", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (oService) {
            assert.deepEqual({ hash: "#" }, oService.compactHash("#"));
            assert.deepEqual({ hash: "#ABC-DEF~HIJ&/ABC=DEF" }, oService.compactHash("#ABC-DEF~HIJ&/ABC=DEF"));
            done();
        });
    });

    QUnit.test("testcheckHashLengthNoTruncation", function (assert) {
        var done = assert.async();
            sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
                var sHash,
                aTruncatedURL,
                aLongUrl;
            saveLengthLimit(shortener);
            aLongUrl = "#SO-ABC~CONTXT?ABC=3&/detail/1?A=B";
            sHash = shortener.checkHashLength(aLongUrl);
            aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&/detail/1?A=B";
            assert.deepEqual(sHash.hash, aTruncatedURL, " original url in hash");
            assert.deepEqual(sHash.params, undefined, "no params as url fits length");
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("testcheckHashLengthTruncation", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                aTruncatedURL,
                aLongUrl;
            saveLengthLimit(shortener);
            aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&HIJ=AAAAAAAAAAAAAABBBBBBBBBBBB&AKLM=JJJJJJ&CFUN=JJJJJJJJJJJJ&/detail/1?A=B";
            sHash = shortener.checkHashLength(aLongUrl);
            aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&AKLM=JJJJJJ&/detail/1?A=B";
            assert.deepEqual(aTruncatedURL, sHash.hash);
            assert.deepEqual({ ABC: ["3"], AKLM: ["JJJJJJ"] }, sHash.params);
            assert.deepEqual({ HIJ: ["AAAAAAAAAAAAAABBBBBBBBBBBB"], DEF: ["4"], CFUN: ["JJJJJJJJJJJJ"] }, sHash.skippedParams);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("testcheckHashLength", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
                var sHash,
                aTruncatedURL,
                aLongUrl,
                stubLogError;
            saveLengthLimit(shortener);
            stubLogError = sinon.spy(jQuery.sap.log, "error");
            aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
            sHash = shortener.checkHashLength(aLongUrl);
            aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B";
            assert.deepEqual(aTruncatedURL, sHash.hash);
            assert.deepEqual({ ABC: ["3"], DEF: ["4"] }, sHash.params);
            assert.deepEqual({ DEF: ["AAAAAAAAAAAAAABBBBBBBBBBBB", "JJJJJJJJJJJJJJJJJJ"] }, sHash.skippedParams);
            assert.deepEqual(true, stubLogError.called, "LogError called");
            stubLogError.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("testcheckHashArrayWarn", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                aTruncatedURL,
                aLongUrl,
                stubLogError;
            saveLengthLimit(shortener);
            stubLogError = sinon.spy(jQuery.sap.log, "error");
            aLongUrl = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
            sHash = shortener.checkHashLength(aLongUrl);
            aTruncatedURL = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
            assert.deepEqual(sHash.hash, aTruncatedURL, "Truncated URL ok");
            assert.deepEqual(stubLogError.called, true, "LogError called");
            stubLogError.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("smokeShortenExpand", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl,
                store = {},
                stubRetrieve,
                stubStore;
            saveLengthLimit(shortener);
            stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
                store[sKey] = sValue;
            });
            stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
                return store[sKey];
            });

            aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual("#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", sHash);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(aLongUrl, sHashRestored, "expanded hash");
            stubRetrieve.restore();
            stubStore.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("smokeShortenExpandOrder", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl,
                store = {},
                stubRetrieve,
                stubStore;
            saveLengthLimit(shortener);
            stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
                store[sKey] = sValue;
            });
            stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
                return store[sKey];
            });
            aLongUrl = "#SO-ABC~CONTXT?ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&ABC=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual(sHash, "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", "Compacted hash");
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(
                "#SO-ABC~CONTXT?ABC=JJJJJJJJJJJJJJJJJJ&ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&/detail/1?A=B",
                sHashRestored,
                "Compare restored hash"
            );
            stubRetrieve.restore();
            stubStore.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("shortenExpandNoAppHash", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl,
                store = {},
                stubRetrieve,
                stubStore;
            saveLengthLimit(shortener);
            stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
                store[sKey] = sValue;
            });
            stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
                return store[sKey];
            });
            aLongUrl = "#SO-ABC~CONTXT?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual(sHash, "#SO-ABC~CONTXT?A=3&A=4&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID", "correct shortend hash");
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHashRestored, aLongUrl, "expansion worked");
            stubRetrieve.restore();
            stubStore.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("also Shortening for navResCtx (there use to be a WDA startup hack)", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl,
                store = {},
                stubRetrieve,
                stubStore;
            saveLengthLimit(shortener);
            stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
                store[sKey] = sValue;
            });
            stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
                return store[sKey];
            });
            aLongUrl = "#SO-ABC~navResCtx?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual(sHash, "#SO-ABC~navResCtx?A=3&A=4&DEF=4&sap-intent-param=AGUID", "shortening occurred");
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(aLongUrl, sHashRestored);
            stubRetrieve.restore();
            stubStore.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("shortenAndRawxappStateExpand", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl,
                cnt = 0,
                store = {},
                stubRetrieve,
                stubStore;
            saveLengthLimit(shortener);
            stubStore = sinon.stub(shortener, "_storeValue", function (sKey, sValue) {
                store[sKey] = sValue;
            });
            stubRetrieve = sinon.stub(shortener, "_retrieveValue", function (sKey) {
                return store[sKey];
            });
            aLongUrl = "#SO-ABC~CONTXT?A=3&A=4&DEF=4&sap-xapp-state="
                       + encodeURIComponent(JSON.stringify({ a: 1 }))
                       + "&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    cnt = cnt + 1;
                    return "AGUID" + cnt;
                }
            }).hash;
            assert.deepEqual(
                sHash,
                "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=AGUID2&sap-xapp-state=AGUID1",
                "correct compacterd hash"
            );
            assert.equal(stubStore.callCount, 2);
            assert.deepEqual(stubStore.args[0][0], "AGUID1", "correct key passed for storing sap-xapp-state");
            assert.deepEqual(stubStore.args[0][1], { a: 1 }, "correct value passed for storing");
            assert.deepEqual(stubStore.args[1][0], "AGUID2", "correct key passed for storing 2nd call (sap-intent-param)");
            assert.deepEqual(
                stubStore.args[1][1],
                "A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ",
                "correct value passed for storing"
            );
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(
                sHashRestored,
                "#SO-ABC~CONTXT?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=AGUID1",
                "correct expanded long url"
            );
            stubRetrieve.restore();
            stubStore.restore();
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expandNoStorage", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                unresolveableShortendURL,
                sHashRestored;
            saveLengthLimit(shortener);
            shortener.URL_LENGTH_LIMIT = 60;
            shortener.URL_PARAMS_LENGTH_LIMIT = 20;
            sHash = shortener.compactHash(
                "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B",
                undefined,
                {
                    getNextKey: function () {
                        return "AGUID";
                    }
                }
            ).hash;
            sHash = sHash.replace(/AGUID/, "BGUID");
            unresolveableShortendURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=BGUID&/detail/1?A=B";
            assert.deepEqual(unresolveableShortendURL, sHash);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHash, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expandParamGivenRetrievalFunction", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sExpandedHash;
            sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "DEF", function (sKey) {
                assert.deepEqual(sKey, "4", "correct Key");
                return "AAA=33&AAA=44&ZZZ=5";
            });
            assert.deepEqual(sExpandedHash, "#SO-Action?AAA=33&AAA=44&ABC=3&HIJ=5&ZZZ=5", "expansion occurred");
            done();
        });
    });

    QUnit.test("expandParamGivenRetrievalFunction key not present", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sExpandedHash;
            sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "GIBTSNICHT", function () {
                return undefined;
            });
            assert.deepEqual(sExpandedHash, "#SO-Action?HIJ=5&ABC=3&DEF=4", "original url returned");
            done();
        });
    });

    QUnit.test("expandParamGivenRetrievalFunction unretrievable key", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sExpandedHash;
            sExpandedHash = shortener.expandParamGivenRetrievalFunction("#SO-Action?HIJ=5&ABC=3&DEF=4", "DEF", function () {
                return undefined;
            });
            assert.deepEqual(sExpandedHash, "#SO-Action?HIJ=5&ABC=3&DEF=4", "original url returned");
            done();
        });
    });

    QUnit.test("smokeShortenExpandTooLongAppHash", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                sHashRestored,
                aLongUrl;
            saveLengthLimit(shortener);
            aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual(aLongUrl, sHash);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(aLongUrl, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("noCompactParamPresent", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                aLongUrl;
            saveLengthLimit(shortener);
            aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&"
                       + shortener.ABBREV_PARAM_NAME
                       + "=AGUID&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
            sHash = shortener.compactHash(aLongUrl, undefined, {
                getNextKey: function () {
                    return "AGUID";
                }
            }).hash;
            assert.deepEqual(aLongUrl, sHash);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expandHashRobust", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            assert.deepEqual("", shortener.expandHash(""));
            assert.deepEqual("#", shortener.expandHash("#"));
            assert.deepEqual("#ABCDEF&/ABC", shortener.expandHash("#ABCDEF&/ABC"));
            assert.deepEqual("#&/ABC", shortener.expandHash("#&/ABC"));
            done();
        });
    });

    QUnit.test("expand With app state (special paramter retained)", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                unresolveableShortendURL,
                sHashRestored;
            saveLengthLimit(shortener);
            shortener.URL_LENGTH_LIMIT = 60;
            shortener.URL_PARAMS_LENGTH_LIMIT = 20;
            sHash = shortener.compactHash(
                "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B",
                ["HIJ"],
                {
                    getNextKey: function () {
                        return "AGUID";
                    }
                }
            ).hash;
            sHash = sHash.replace(/AGUID/, "BGUID");
            unresolveableShortendURL = "#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=BGUID&sap-xapp-state=12A34&/detail/1?A=B";
            assert.deepEqual(sHash, unresolveableShortendURL);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHash, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expand/compact With sap-system (special paramter retained)", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                unresolveableShortendURL,
                sHashRestored;
            saveLengthLimit(shortener);
            shortener.URL_LENGTH_LIMIT = 60;
            shortener.URL_PARAMS_LENGTH_LIMIT = 40;
            sHash = shortener.compactHash(
                "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&sap-system=ABC&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B",
                ["HIJ"],
                {
                    getNextKey: function () {
                        return "AGUID";
                    }
                }
            ).hash;
            sHash = sHash.replace(/AGUID/, "BGUID");
            unresolveableShortendURL = "#SO-ABC~CONTXT?HIJ=1&"
                    + shortener.ABBREV_PARAM_NAME
                    + "=BGUID&sap-system=ABC&sap-xapp-state=12A34&/detail/1?A=B";
            assert.deepEqual(sHash, unresolveableShortendURL);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHash, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expand/compact With sap-system (special paramter retained HIJ does no longer fit)", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                unresolveableShortendURL,
                sHashRestored;
            saveLengthLimit(shortener);
            shortener.URL_LENGTH_LIMIT = 60;
            shortener.URL_PARAMS_LENGTH_LIMIT = 36;
            sHash = shortener.compactHash(
                "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&sap-system=ABC&DEF=JJJJJJJJJJJJJJJJJJ&sap-xapp-state=12A34&HIJ=1&/detail/1?A=B",
                ["HIJ"],
                {
                    getNextKey: function () {
                        return "AGUID";
                    }
                }
            ).hash;
            sHash = sHash.replace(/AGUID/, "BGUID");
            unresolveableShortendURL = "#SO-ABC~CONTXT?"
                    + shortener.ABBREV_PARAM_NAME
                    + "=BGUID&sap-system=ABC&sap-xapp-state=12A34&/detail/1?A=B";
            assert.deepEqual(sHash, unresolveableShortendURL);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHash, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });

    QUnit.test("expand With no app state (no special parameter)", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            var sHash,
                unresolveableShortendURL,
                sHashRestored;
            saveLengthLimit(shortener);
            shortener.URL_LENGTH_LIMIT = 60;
            shortener.URL_PARAMS_LENGTH_LIMIT = 20;
            sHash = shortener.compactHash(
                "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&sap-uapp-state=1234&HIJ=1&OPQ=4&OPQ=R&/detail/1?A=B",
                ["HIJ", "OPQ", "KLM"],
                {
                    getNextKey: function () {
                        return "AGUID";
                    }
                }
            ).hash;
            sHash = sHash.replace(/AGUID/, "BGUID");
            unresolveableShortendURL = "#SO-ABC~CONTXT?ABC=3&HIJ=1&OPQ=4&OPQ=R&" + shortener.ABBREV_PARAM_NAME + "=BGUID&/detail/1?A=B";
            assert.deepEqual(sHash, unresolveableShortendURL);
            sHashRestored = shortener.expandHash(sHash);
            assert.deepEqual(sHash, sHashRestored);
            restoreLengthLimit(shortener);
            done();
        });
    });


    QUnit.test("test indexOf", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            [
                { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-B", result: 2 },
                { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-WDX", result: 1 },
                { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-A", result: 0 },
                { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAPWDY", result: -1 },
                { desc: "test1", array: ["SAP-A", "SAP-*", "SAP-B"], value: "SAP-", result: 1 }
            ].forEach(function (oFixture) {
                assert.equal(shortener._findIndex(oFixture.array, oFixture.value), oFixture.result, " correct index " + oFixture.desc);
            });
            done();
        });
    });

    QUnit.test("_cmpByList", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            assert.ok(shortener._cmpByList(["D", "C"], "A", "B") < 0, "compares 1");
            assert.ok(shortener._cmpByList(["D", "C"], "B", "A") > 0, "compares 1");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "A") === 0, "compares 1");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "A") === 0, "compares 1");
            assert.ok(shortener._cmpByList(["D", "C"], "D", "D") === 0, "compares 2");
            assert.ok(shortener._cmpByList(["D", "C"], "C", "C") === 0, "compares 3");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "C") > 0, "compares 4");
            assert.ok(shortener._cmpByList(["D", "C"], "D", "A") < 0, "compares 5");
            assert.ok(shortener._cmpByList(["D", "C"], "D", "C") < 0, "compares 6");
            assert.ok(shortener._cmpByList(["D", "C"], "C", "D") > 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "c", "D") > 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "B") < 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "B", "A") > 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "a", "A") > 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "Z", "a") < 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "a", "Z") > 0, "compares less");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "D") > 0, "compares less");
            assert.ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "C") < 0, "compares less a");
            assert.ok(shortener._cmpByList(["C", "SAP*"], "SAPABC", "C") > 0, "compares less b");
            assert.ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "X") < 0, "compares less c");
            assert.ok(shortener._cmpByList(["SAP*", "C"], "SAPABC", "X") < 0, "compares less d");
            assert.ok(shortener._cmpByList(["SAP*", "C"], "SAPA", "SAPB") < 0, "compares less e1");
            assert.ok(shortener._cmpByList(["SAP*", "C"], "SAPB", "SAPA") > 0, "compares less e2");
            assert.ok(shortener._cmpByList(["C", "SAP*"], "SAPABC", "C") > 0, "compares less e");
            assert.ok(shortener._cmpByList(["D", "C"], "A", "D") > 0, "compares less");
            done();
        });
    });

    QUnit.test("_cmpByList", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            assert.deepEqual(shortener._sortByPriority(["a", "A", "A", "E", "D", "C", "B", "A"],
                ["D", "C"]),
                ["D", "C", "A", "A", "A", "B", "E", "a"],
                "sort list"
            );
            done();
        });
    });

    QUnit.test("_cmpByList", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            assert.deepEqual(shortener._sortByPriority(["a", "sap-y", "A", "sap-x", "E", "D", "C", "B", "sap-z", "A"],
                ["D", "sap-*", "C"]),
                ["D", "sap-x", "sap-y", "sap-z", "C", "A", "A", "B", "E", "a"],
                "sort list"
            );
            done();
        });
    });

    QUnit.test("_replaceSapXAppStateRawWithKeyIfRequired already key or invalid raw value", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            [
                1,
                {},
                undefined,
                "AS34567890123456789012345678901234567890"
            ].forEach(function (oFixture) {
                assert.deepEqual(
                    shortener._replaceSapXAppStateRawWithKeyIfRequired(oFixture, {}),
                    oFixture,
                    "value is returned unchanged: " + JSON.stringify(oFixture)
                );
            });
            done();
        });
    });


    QUnit.test("_replaceSapXAppStateRawWithKeyIfRequired valid raw value", function (assert) {
        var done = assert.async();
        sap.ushell.Container.getServiceAsync("URLShortening").then(function (shortener) {
            [
                1,
                { a: 1 },
                1234,
                "AS34567890123456789012345678901234567890"
            ].forEach(function (oFixture, sIndex) {
                var sNextKey = "ABC" + sIndex,
                aValue,
                oStoreContext = {
                    getNextKey: function () {
                        return sNextKey;
                    },
                    store: function (sValue) {
                        aValue = sValue;
                    }
                };
                assert.deepEqual(
                    shortener._replaceSapXAppStateRawWithKeyIfRequired(JSON.stringify(oFixture), oStoreContext),
                    sNextKey,
                    "value is replaced by key"
                );
                assert.deepEqual(aValue, oFixture, "correct value stored: " + JSON.stringify(oFixture));
            });
            done();
        });
    });
});
