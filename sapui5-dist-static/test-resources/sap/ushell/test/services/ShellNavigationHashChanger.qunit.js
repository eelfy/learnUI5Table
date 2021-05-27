// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigationHashChanger
 */
sap.ui.require([
    "sap/ushell/library",
    "sap/ushell/services/ShellNavigationHashChanger",
    "sap/ushell/services/Container",
    "sap/ushell/test/utils"
], function (library, ShellNavigationHashChanger, Container, testUtils) {
    "use strict";

    var NavigationState = library.NavigationState;

    /* global QUnit, sinon, hasher*/

    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.services.ShellNavigationHashChanger", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));

        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("getRelevantEventsInfo: returns the expected events to UI5", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger(),
            aUi5EventInfo = oHashChanger.getRelevantEventsInfo(),
            aExpectedUi5EventInfo = [
                {
                    name: "shellHashChanged",
                    paramMapping: {
                        newHash: "newAppSpecificRouteNoSeparator",
                        oldHash: "oldAppSpecificRouteNoSeparator"
                    },
                    updateHashOnly: true
                }, {
                    name: "hashChanged",
                    paramMapping: {
                        fullHash: "fullHash",
                        newHash: "newHash"
                    }
                }
            ];

        assert.deepEqual(aUi5EventInfo, aExpectedUi5EventInfo, "expected data were returned");
    });

    QUnit.test("HashChanger.getReplaceHashEvents: returns the expected list of events", function (assert) {
        var oShellNavigation = sap.ushell.Container.getService("ShellNavigation"),
            oShellNavigationHashChanger = oShellNavigation.hashChanger,
            aReplaceEvents = oShellNavigationHashChanger.getReplaceHashEvents();
        assert.deepEqual(aReplaceEvents, ["hashReplaced", "hashChanged"], "got expected event names");
    });

    QUnit.test("HashChanger.geSetHashEvents: returns the expected list of events", function (assert) {
        var oShellNavigation = sap.ushell.Container.getService("ShellNavigation"),
            oShellNavigationHashChanger = oShellNavigation.hashChanger,
            aSetEvents = oShellNavigationHashChanger.getSetHashEvents();
        assert.deepEqual(aSetEvents, ["hashSet", "shellHashChanged"], "got expected event names");
    });


    QUnit.test("HashChanger.hrefForAppSpecificHash", function (assert) {
        var sAppSpecificHash, sExpectedHash, sActualHash;
        this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            }
        });

        sAppSpecificHash = "app/specific&/hash needs &/?% encoding";
        sExpectedHash = encodeURI("#AnObject-Action&/" + sAppSpecificHash);
        sActualHash = this.oHashChanger.hrefForAppSpecificHash(sAppSpecificHash);
        assert.strictEqual(sActualHash, sExpectedHash);
    });


    QUnit.module("checks HashChanger.toExternal function", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("HashChanger.toExternal with object, action and parameters", function (assert) {
        this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            },
            params: {
                A: "Needs encoding&/",
                B: "anotherValue"
            }
        });

        var sExpectedHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";

        assert.ok(this.oShellCallback.calledWith(sExpectedHash, null), "ShellCallback called at least once with the sExpectedHash and null");
    });

    QUnit.test("HashChanger.init and destroy", function (assert) {
        this.oShellCallback.reset();
        this.oHashChanger.destroy();

        this.oHashChanger.toExternal({
            target: {
                semanticObject: "AnObject",
                action: "Action"
            }
        });

        assert.strictEqual(this.oShellCallback.callCount, 0, "ShellCallback not called");
    });

    QUnit.module("checks HashChanger.toExternal function with changing bWriteHistory flags", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("HashChanger.toExternal - when write history true", function (assert) {
        var sExpectedAppHash;
        var bWriteHistory = true;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oSetHashStub = sandbox.stub(hasher, "setHash");
        this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");

        sExpectedAppHash = "#Abc-def?A=B";
        this.oHashChanger.toExternal({target: {shellHash: sExpectedAppHash}}, undefined, bWriteHistory);

        assert.equal(this.oSetHashStub.callCount, 1, "correct callcount");
        assert.equal(this.oReplaceHashStub.callCount, 0, "correct callcount");
        assert.equal(this.oSetHashStub.args[0][0], "Abc-def?A=B", "correct hash");
    });

    QUnit.test("HashChanger.toExternal - when write history undefined", function (assert) {
        var sExpectedAppHash;
        var bWriteHistory = undefined;
        this.oSetHashStub = sandbox.stub(hasher, "setHash");
        this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");

        sExpectedAppHash = "#Abc-def?A=B";
        this.oHashChanger.toExternal({target: {shellHash: sExpectedAppHash}}, undefined, bWriteHistory);

        assert.equal(this.oSetHashStub.callCount, 1, "correct callcount");
        assert.equal(this.oReplaceHashStub.callCount, 0, "correct callcount");
        assert.equal(this.oSetHashStub.args[0][0], "Abc-def?A=B", "correct hash");
    });

    QUnit.test("HashChanger.toExternal - when write history false", function (assert) {
        var sExpectedAppHash;
        var bWriteHistory = false;

        this.oSetHashStub = sandbox.stub(hasher, "setHash");
        this.oReplaceHashStub = sandbox.stub(hasher, "replaceHash");
        sExpectedAppHash = "#Abc-def?A=B";
        this.oHashChanger.toExternal({target: {shellHash: sExpectedAppHash}}, undefined, bWriteHistory);

        assert.equal(this.oSetHashStub.callCount, 0, "correct callcount");
        assert.equal(this.oReplaceHashStub.callCount, 1, "correct callcount");
        assert.equal(this.oReplaceHashStub.args[0][0], "Abc-def?A=B", "correct hash");
    });

    QUnit.module("checks the function privsplitHash", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Initial Shell navigation part is handled equally", function (assert) {
        var oShellHash1,
            oShellHash2;

        this.oHashChanger.toExternal({target: {shellHash: ""}});
        this.oShellCallback.reset();

        oShellHash1 = this.oHashChanger.privsplitHash("");
        oShellHash2 = this.oHashChanger.privsplitHash("&/detail");

        assert.strictEqual(oShellHash1.shellPart, oShellHash2.shellPart, "shell parts equal");
    });

    QUnit.module("checks the Navigation Filters", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Check initial Navigation Filter", function (assert) {
        // Act
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oHashChanger = oShellNavigationService.hashChanger;

        // Assert
        // Note: It cannot be checked if the correct function is registered, as bind() is used.
        assert.strictEqual(oHashChanger.aNavigationFilters.length, 2,
            "_navigationFilterForForwardingToRegisteredRouters registered initially");
    });

    QUnit.test("registerNavigationFilter new filter", function (assert) {
        // Arrange
        var fnFilter = function () {
            },
            oSrv = sap.ushell.Container.getService("ShellNavigation"),
            oHashChanger = oSrv.hashChanger;

        // ignore existing filters registered during init
        oHashChanger.aNavigationFilters = [];

        // Act
        oSrv.registerNavigationFilter(fnFilter);

        // Assert
        assert.deepEqual(oHashChanger.aNavigationFilters, [fnFilter], "filter is registered among the navigation filters");
    });

    QUnit.test("unregisterNavigationFilter filter", function (assert) {
        // Arrange
        var fnFilter = function () {
            },
            oSrv = sap.ushell.Container.getService("ShellNavigation"),
            oHashChanger = oSrv.hashChanger;

        // ignore existing filters registered during init
        oHashChanger.aNavigationFilters = [fnFilter];

        // Act
        oSrv.unregisterNavigationFilter(fnFilter);

        // Assert
        assert.deepEqual(oHashChanger.aNavigationFilters, [], "filter is removed from aNavigationFilters member");
    });

    QUnit.module("checks the _removeNonIntentParameters function", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("_removeNonIntentParameters: undefined hash parameters", function (assert) {
        // Arrange
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oExpectedHashParams = {};
        oShellNavigationService.init(function () {
        });

        // Act
        var oResult = oShellNavigationService.hashChanger._removeNonIntentParameters();

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when undefined hash parameters are given");
    });

    QUnit.test("_removeNonIntentParameters: no hash parameters", function (assert) {
        // Arrange
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oExpectedHashParams = {};
        oShellNavigationService.init(function () {
        });

        // Act
        var oResult = oShellNavigationService.hashChanger._removeNonIntentParameters({});

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when no hash parameters are given");
    });

    QUnit.test("_removeNonIntentParameters: an intent parameter", function (assert) {
        // Arrange
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oExpectedHashParams = {x: 4};
        oShellNavigationService.init(function () {
        });

        // Act
        var oResult = oShellNavigationService.hashChanger._removeNonIntentParameters({x: 4});

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameter is given");
    });

    QUnit.test("_removeNonIntentParameters: an intent parameters and a non intent paramter", function (assert) {
        // Arrange
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oExpectedHashParams = {x: 4};
        oShellNavigationService.init(function () {
        });

        // Act
        var oResult = oShellNavigationService.hashChanger._removeNonIntentParameters({
            x: 4,
            "sap-ui-fl-control-variant-id": "xx"
        });

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameters and a non intent paramter are given");
    });

    QUnit.test("_removeNonIntentParameters: a non intent paramter", function (assert) {
        // Arrange
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
        var oExpectedHashParams = {};
        oShellNavigationService.init(function () {
        });

        // Act
        var oResult = oShellNavigationService.hashChanger._removeNonIntentParameters({"sap-ui-fl-control-variant-id": "xx"});

        // Assert
        assert.deepEqual(oResult, oExpectedHashParams,
            "The non intent parameters are getting removed like expected when an intent parameters and a non intent paramter are given");
    });

    QUnit.module("checks the init function", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("init: parameter full hash is set when app specific route is null", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = {
            appSpecificRoute: null,
            shellPart: "SO-ACTION"
        };
        var sExpectedFullHash = "SO-ACTION";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sinon.match({fullHash: sExpectedFullHash})), true, "event was fired with expectedFullHash");
    });

    QUnit.test("init: parameter full hash is set when app specific route does exist", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = {
            appSpecificRoute: "&/appSpecific",
            shellPart: "SO-ACTION"
        };
        var sExpectedFullHash = "SO-ACTION&/appSpecific";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sinon.match({fullHash: sExpectedFullHash})), true, "event was fired with expectedFullHash");
    });

    QUnit.test("init: parameter full hash is set when hash is null", function (assert) {
        var oHashChanger = new ShellNavigationHashChanger();
        var oInputHash = null;
        var sExpectedFullHash = "";

        var oPrivSplitHashStub = sandbox.stub(oHashChanger, "privsplitHash");
        oPrivSplitHashStub.returns(oInputHash);

        var oFireEventStub = sandbox.stub(oHashChanger, "fireEvent");

        oHashChanger.init();
        assert.deepEqual(oFireEventStub.calledWith("hashChanged",
            sinon.match({fullHash: sExpectedFullHash})), true, "event was fired with expectedFullHash");
    });

    QUnit.module("checks the hash changed events", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                window.location.hash = "";
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
                this.oResult = {
                    callCount: 0,
                    parameters: null
                };
                this.oSetHashSpy = sandbox.spy(hasher, "setHash");
                this.oReplaceHashSpy = sandbox.spy(hasher, "replaceHash");

                this.fnHashChangedHandler = function (oEvent) {
                    this.oResult.callCount += 1;
                    this.oResult.parameters = oEvent.getParameters();
                }.bind(this);

            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("HashChanger.toExternal with shellHash", function (assert) {
        var sExpectedHash;

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);

        sExpectedHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        this.oHashChanger.toExternal({target: {shellHash: sExpectedHash}});

        assert.ok(this.oShellCallback.calledWith(sExpectedHash, null), "the callback was called with the expected hash");

        assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, "", "expected sHash parameter set to empty string in hashChanged event");
    });

    QUnit.test("HashChanger.toExternal with shellHash including app-specific part", function (assert) {
        var oUrlShortening = sap.ushell.Container.getService("URLShortening");
        var oExpandHashSpy = sandbox.spy(oUrlShortening, "expandHash");

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);

        var sShellHash = "AnObject-Action?A=" + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        var sAppHash = "/my/appspecific/route";
        this.oHashChanger.toExternal({target: {shellHash: sShellHash + "&/" + sAppHash}});

        assert.strictEqual(oExpandHashSpy.args[0][0], "AnObject-Action?A=Needs%20encoding%26%2F&B=anotherValue&//my/appspecific/route",
            "URLShortening.expandHash called with new Hash");
        assert.strictEqual(oExpandHashSpy.args[1][0], "", "URLShortening.expandHash called with old Hash");
        assert.strictEqual(oExpandHashSpy.callCount, 2, "URLShortening.expandHash called twice");

        assert.ok(this.oShellCallback.calledWith(sShellHash, "&/" + sAppHash, null), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, sAppHash,
            "expected sHash parameter set to app-specific part in hashChanged event");
    });



    QUnit.test("HashChanger.toAppHash - writeHistory true for hashChanged", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();


        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.toAppHash(sExpectedAppHash, true);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called.");

        assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1,
            "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash,
            "newHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.toAppHash - writeHistory true  for hashSet", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.toAppHash(sExpectedAppHash, true);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called.");

        assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1,
            "hashSet handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash,
            "sHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.setHash for hashChanged", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.setHash(sExpectedAppHash);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.setHash for hashSet", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashSet", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.setHash(sExpectedAppHash);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oSetHashSpy.calledWith("AnObject-Action&/my app hash"), "setHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.toAppHash - writeHistory false for hashChanged", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.toAppHash(sExpectedAppHash, false);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters.");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.toAppHash - writeHistory false for hashReplaced", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashReplaced", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.toAppHash(sExpectedAppHash, false);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters.");

        assert.strictEqual(this.oResult.callCount, 1, "hashReplaced handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashReplaced event");
    });

    QUnit.test("HashChanger.replaceHash for hashChanged", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.replaceHash(sExpectedAppHash);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash, sExpectedAppHash, "newHash parameter set in hashChanged event");
    });

    QUnit.test("HashChanger.replaceHash for hashReplaced", function (assert) {
        var sExpectedAppHash;

        this.oHashChanger.toExternal({target: {shellHash: "AnObject-Action"}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("hashReplaced", this.fnHashChangedHandler);
        sExpectedAppHash = "my app hash";

        this.oHashChanger.replaceHash(sExpectedAppHash);

        assert.strictEqual(this.oShellCallback.callCount, 0, "the callback was not called");

        assert.ok(this.oReplaceHashSpy.calledWith("AnObject-Action&/my app hash"), "replaceHash was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "hashSet handler called once");
        assert.strictEqual(this.oResult.parameters.sHash, sExpectedAppHash, "sHash parameter set in hashReplaced event");
    });

    // see I-CSN 0001102839 2014
    QUnit.test("robust error handling for hash change with illegal new hash", function (assert) {
        this.oHashChanger.toExternal({target: {shellHash: ""}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("illegalhash", "SO-action&/app-specific-route");

        assert.ok(this.oShellCallback.calledWith("illegalhash", null,
            "SO-action", "&/app-specific-route", sinon.match.instanceOf(Error)), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newShellHash,
            "illegalhash", "shellHashChanged called with newShellHash");
        assert.strictEqual(this.oResult.parameters.newAppSpecificRoute, null,
            "shellHashChanged called with newAppSpecificRoute");
        assert.strictEqual(this.oResult.parameters.oldShellHash,
            "SO-action", "shellHashChanged called with oldShellHash");
        assert.ok(this.oResult.parameters.error instanceof Error, "shellHashChanged called with error");
    });

    QUnit.test("robust error handling for hash change with illegal new and old hash", function (assert) {
        this.oHashChanger.toExternal({target: {shellHash: ""}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("illegalNewHash", "illegalOldHash");

        assert.ok(this.oShellCallback.calledWith("illegalNewHash", null, "illegalOldHash", null,
            sinon.match.instanceOf(Error)), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newShellHash,
            "illegalNewHash", "shellHashChanged called with newShellHash");
        assert.strictEqual(this.oResult.parameters.newAppSpecificRoute,
            null, "shellHashChanged called with newAppSpecificRoute");
        assert.strictEqual(this.oResult.parameters.oldShellHash,
            "illegalOldHash", "shellHashChanged called with oldShellHash");
        assert.ok(this.oResult.parameters.error instanceof Error, "shellHashChanged called with error");
    });

    QUnit.test("robust error handling for hash change with illegal old hash", function (assert) {
        this.oHashChanger.toExternal({target: {shellHash: ""}});
        this.oShellCallback.reset();

        this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("SO-action&/app-specific-route", "illegalhash");

        assert.ok(this.oShellCallback.calledWith("SO-action", "&/app-specific-route",
            "illegalhash", null), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newShellHash,
            "SO-action", "shellHashChanged called with newShellHash");
        assert.strictEqual(this.oResult.parameters.newAppSpecificRoute,
            "&/app-specific-route", "shellHashChanged called with newAppSpecificRoute");
        assert.strictEqual(this.oResult.parameters.oldShellHash,
            "illegalhash", "shellHashChanged called with oldShellHash");
    });

    QUnit.test("treatHashChanged - shellHashParameterChanged event fired if parameters have changed", function (assert) {

        this.oHashChanger.attachEvent("shellHashParameterChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("SO-action?param1=newValue&/app-specific-route", "SO-action?param1=oldValue&/app-specific-route");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashParameterChanged handler called once");
        assert.deepEqual(this.oResult.parameters.oNewParameters,
            {param1: ["newValue"]}, "shellHashParameterChanged called with new parameters");
        assert.deepEqual(this.oResult.parameters.oOldParameters,
            {param1: ["oldValue"]}, "shellHashParameterChanged called with old parameters");
    });

    QUnit.test("treatHashChanged - hashChanged event fired if parameters have not changed (change of AppSpecificRoute)", function (assert) {
        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("SO-action?param1=oldValue&/new-app-specific-route",
            "SO-action?param1=oldValue&/old-app-specific-route");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash,
            "new-app-specific-route", "hashChanged called with new parameters");
        assert.strictEqual(this.oResult.parameters.oldHash,
            "old-app-specific-route", "hashChanged called with old parameters");
    });

    QUnit.test("treatHashChanged - hashChanged event fired if old shell part is empty", function (assert) {
        this.oHashChanger.attachEvent("hashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("&/new-app-specific-route", "");

        assert.strictEqual(this.oResult.callCount, 1, "hashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newHash,
            "new-app-specific-route", "hashChanged called with new app-specific route");
        assert.strictEqual(this.oResult.parameters.oldHash, "", "hashChanged called with old app-specific route");
    });

    QUnit.test("treatHashChanged - shellHashChanged event fired if there are no listeners for shellHashParameterChanged event", function (assert) {
        this.oHashChanger.attachEvent("shellHashChanged", this.fnHashChangedHandler);

        this.oHashChanger.treatHashChanged("SO-action?param1=newValue&/new-app-specific-route",
            "SO-action?param1=oldValue&/old-app-specific-route");

        assert.ok(this.oShellCallback.calledWith("SO-action?param1=newValue", "&/new-app-specific-route",
            "SO-action?param1=oldValue", "&/old-app-specific-route"), "callback was called with the right parameters");

        assert.strictEqual(this.oResult.callCount, 1, "shellHashChanged handler called once");
        assert.strictEqual(this.oResult.parameters.newShellHash,
            "SO-action?param1=newValue", "shellHashChanged called with newShellHash");
        assert.strictEqual(this.oResult.parameters.newAppSpecificRoute,
            "&/new-app-specific-route", "shellHashChanged called with newAppSpecificRoute");
        assert.strictEqual(this.oResult.parameters.oldShellHash,
            "SO-action?param1=oldValue", "shellHashChanged called with oldShellHash");
        assert.strictEqual(this.oResult.parameters.oldAppSpecificRoute,
            "&/old-app-specific-route", "shellHashChanged called with oldAppSpecificRoute");
    });

    QUnit.module("checks the navigation state functions", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                this.oHashChanger = new ShellNavigationHashChanger();
                this.oShellCallback = sandbox.stub();
                this.oHashChanger.initShellNavigation(this.oShellCallback);
                this.oShellCallback.reset();
            }.bind(this));

        },
        afterEach: function () {
            this.oHashChanger.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("checks the _trackNavigation method", function (assert) {
        // Arrange
        var sOldHash = "",
            sNewHash = "Test";

        // Act
        this.oHashChanger._trackNavigation(sOldHash, sNewHash);

        // Assert
        assert.strictEqual(this.oHashChanger._oNavigationState.oldHash, sOldHash, "the old hash was set correctly.");
        assert.strictEqual(this.oHashChanger._oNavigationState.newHash, sNewHash, "the new hash was set correctly.");
    });

    QUnit.test("checks the _setNavigationStatus method", function (assert) {
        // Arrange
        var oNavigationStatus = library.NavigationState.InProgress;

        // Act
        this.oHashChanger._setNavigationStatus(oNavigationStatus);

        // Assert
        assert.strictEqual(this.oHashChanger._oNavigationState.status, oNavigationStatus);
    });

    QUnit.test("checks the getCurrentNavigationState method", function (assert) {
        // Arrange
        this.oHashChanger._oNavigationState = library.NavigationState.InProgress;

        var oCurrentNavigationState = this.oHashChanger.getCurrentNavigationState();

        // Assert
        assert.strictEqual(library.NavigationState.InProgress, oCurrentNavigationState);
    });

    QUnit.module("treatHashChanged", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: sandbox.stub()
            };
            this.oHashChanger = new ShellNavigationHashChanger();

            this.oExpandHashStub = sandbox.stub().returnsArg(0);
            this.oHashChanger.oURLShortening = {
                expandHash: this.oExpandHashStub
            };

            this.NavigationFilterStatus = this.oHashChanger.NavigationFilterStatus;

            this.oFilterStub = sandbox.stub();
            this.oHashChanger.aNavigationFilters = [
                this.oFilterStub
            ];

            this.oTrackNavigationStub = sandbox.stub(this.oHashChanger, "_trackNavigation");
            this.oSetNavigationStatusStub = sandbox.stub(this.oHashChanger, "_setNavigationStatus");
            this.oPrivSplitHashStub = sandbox.stub(this.oHashChanger, "privsplitHash").returns({});
            this.oFireEventStub = sandbox.stub(this.oHashChanger, "fireEvent");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            sandbox.restore();
        }
    });

    QUnit.test("Prepares hash treatment", function (assert) {
        // Arrange
        this.oFilterStub.withArgs("a", "b").returns({
            status: this.NavigationFilterStatus.Custom
        });
        // Act
        var oResult = this.oHashChanger.treatHashChanged("a", "b");
        // Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
        assert.deepEqual(this.oTrackNavigationStub.getCall(0).args, ["b", "a"], "_trackNavigation was called with correct args");
        assert.deepEqual(this.oSetNavigationStatusStub.getCall(0).args, [NavigationState.InProgress], "_setNavigationStatus was called the first time with correct args");
        assert.deepEqual(this.oExpandHashStub.getCall(0).args, ["a"], "expandHash was called the first time with correct args");
        assert.deepEqual(this.oExpandHashStub.getCall(1).args, ["b"], "expandHash was called the second time with correct args");
        assert.deepEqual(this.oPrivSplitHashStub.getCall(0).args, ["a"], "privSplitHash was called the first time with correct args");
        assert.deepEqual(this.oPrivSplitHashStub.getCall(1).args, ["b"], "privSplitHash was called the second time with correct args");
    });
});