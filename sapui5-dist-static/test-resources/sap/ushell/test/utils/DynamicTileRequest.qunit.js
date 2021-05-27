// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.utils.DynamicTileRequest
 */
sap.ui.require([
    "sap/ushell/utils/DynamicTileRequest",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery"
], function (
    DynamicTileRequest,
    Log,
    jQuery
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor", {
        beforeEach: function () {
            this.fnSuccess = function () {};
            this.fnError = function () {};

            this.oLogStub = sandbox.stub(Log, "error");

            this.sUrl = "someUrl";
            this.sResolvedUrl = "a://b.c/some/resolved/absolute/url?sap-language=";
            this.sContentProvider = "someContentProvider";
            this.oHeaders = {};

            this.oGetSAPLogonLanguageStub = sandbox.stub(sap.ui.getCore().getConfiguration(), "getSAPLogonLanguage").returns("EN");

            this.oResolveDefaultsStub = sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults");
            this.oResolveDefaultsStub.resolves(this.sResolvedUrl);

            this.oGetHeadersStub = sandbox.stub(DynamicTileRequest.prototype, "_getHeaders");
            this.oGetHeadersStub.returns(this.oHeaders);

            this.oRefreshStub = sandbox.stub(DynamicTileRequest.prototype, "refresh");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Saves parameters to request", function (assert) {
        // Arrange
        var sExpectedBasePath = "a://b.c/some/resolved/absolute/";
        var sExpectedRequestPath = "url?sap-language=";
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        // Assert
        return oRequest.oPromise.then(function () {
            assert.strictEqual(oRequest.fnSuccess, this.fnSuccess, "fnSuccess was saved to the request");
            assert.strictEqual(oRequest.fnError, this.fnError, "fnError was saved to the request");
            assert.strictEqual(oRequest.sUrl, this.sUrl, "url was saved to the request");

            assert.deepEqual(this.oResolveDefaultsStub.getCall(0).args, [this.sUrl, this.sContentProvider], "_resolveDefaults was called with correct args");
            assert.deepEqual(this.oGetHeadersStub.getCall(0).args, [this.sResolvedUrl], "_getHeaders was called with correct args");
            assert.strictEqual(this.oRefreshStub.callCount, 1, "refresh was called once");

            assert.strictEqual(oRequest.sBasePath, sExpectedBasePath, "basePath was saved to the request");
            assert.strictEqual(oRequest.sRequestPath, sExpectedRequestPath, "requestPath was saved to the request");
            assert.strictEqual(oRequest.oConfig.headers, this.oHeaders, "headers were saved to the the request");
            assert.ok(oRequest.oClient, "The client was created");
        }.bind(this));
    });

    QUnit.test("Adds sap-language as new parameter", function (assert) {
        // Arrange
        this.oResolveDefaultsStub.resolves("a://b.c/some/resolvedUrl");

        var sExpectedBasePath = "a://b.c/some/";
        var sExpectedRequestPath = "resolvedUrl?sap-language=EN";
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.strictEqual(oRequest.sBasePath, sExpectedBasePath, "basePath was saved to the request");
            assert.strictEqual(oRequest.sRequestPath, sExpectedRequestPath, "requestPath was saved to the request");
        });
    });

    QUnit.test("Adds sap-language to existing parameters", function (assert) {
        // Arrange
        this.oResolveDefaultsStub.resolves("a://b.c/some/resolvedUrl?$a=b");

        var sExpectedBasePath = "a://b.c/some/";
        var sExpectedRequestPath = "resolvedUrl?$a=b&sap-language=EN";
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.strictEqual(oRequest.sBasePath, sExpectedBasePath, "basePath was saved to the request");
            assert.strictEqual(oRequest.sRequestPath, sExpectedRequestPath, "requestPath was saved to the request");
        });
    });

    QUnit.test("Handles relative urls correctly", function (assert) {
        // Arrange
        this.oResolveDefaultsStub.resolves("/some/relativeUrl?$a=b");

        var sExpectedBasePath = location.origin + "/some/";
        var sExpectedRequestPath = "relativeUrl?$a=b&sap-language=EN";
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.strictEqual(oRequest.sBasePath, sExpectedBasePath, "basePath was saved to the request");
            assert.strictEqual(oRequest.sRequestPath, sExpectedRequestPath, "requestPath was saved to the request");
        });
    });

    QUnit.test("Does not create a client when resolvedUrl is empty", function (assert) {
        // Arrange
        this.oResolveDefaultsStub.resolves(undefined);
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.strictEqual(oRequest.oClient, undefined, "client was not created");
        });
    });

    QUnit.test("Does not create a client when resolvedUrl is empty", function (assert) {
        // Arrange
        var sExpectedMessage = "Was not able to create a DynamicTileRequest:";
        var oError = new Error("someError");
        this.oResolveDefaultsStub.rejects(oError);
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.deepEqual(this.oLogStub.getCall(0).args[0], sExpectedMessage, "error was called with correct message");
            assert.deepEqual(this.oLogStub.getCall(0).args[1], oError, "error was called with correct error");
        }.bind(this));
    });

    QUnit.test("Encodes parameters with spaces correctly", function (assert) {
        // Arrange
        this.oResolveDefaultsStub.resolves("a://b.c/some/resolvedUrl?$filter=Name eq 'Value'");

        var sExpectedBasePath = "a://b.c/some/";
        var sExpectedRequestPath = "resolvedUrl?$filter=Name eq 'Value'&sap-language=EN";
        // Act
        var oRequest = new DynamicTileRequest(this.sUrl, this.fnSuccess, this.fnError, this.sContentProvider);
        return oRequest.oPromise.then(function () {
            // Assert
            assert.strictEqual(oRequest.sBasePath, sExpectedBasePath, "basePath was saved to the request");
            assert.strictEqual(oRequest.sRequestPath, sExpectedRequestPath, "requestPath was saved to the request");
        });
    });

    QUnit.module("refresh", {
        beforeEach: function () {
            this.sRequestPath = "somePath";
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
            this.oDTRequest.sRequestPath = this.sRequestPath;

            this.oOnSuccessStub = sandbox.stub(this.oDTRequest, "_onSuccess");
            this.oOnErrorStub = sandbox.stub(this.oDTRequest, "_onError");

            this.oGetStub = sandbox.stub().resolves();
            this.oDTRequest.oClient = {
                get: this.oGetStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates a new request when no request exists", function (assert) {
        // Arrange
        // Act
        this.oDTRequest.refresh();
        // Assert
        assert.ok(this.oDTRequest.oRequest instanceof Promise, "Saved the correct request");
        assert.deepEqual(this.oGetStub.getCall(0).args, [this.sRequestPath], "get was called with correct args");
    });

    QUnit.test("Does not create a new request when a request exists", function (assert) {
        // Arrange
        var oRequest = {};
        this.oDTRequest.oRequest = oRequest;
        // Act
        this.oDTRequest.refresh();
        // Assert
        assert.strictEqual(this.oDTRequest.oRequest, oRequest, "The request was not overwritten");
        assert.strictEqual(this.oGetStub.callCount, 0, "no new request was started");
    });

    QUnit.test("Calls success handler when request resolves", function (assert) {
        // Arrange
        // Act
        this.oDTRequest.refresh();

        return this.oDTRequest.oRequest.then(function () {
            // Assert
            assert.strictEqual(this.oOnSuccessStub.callCount, 1, "_onSuccess was called once");
            assert.strictEqual(this.oOnErrorStub.callCount, 0, "_onError was not called");
        }.bind(this));
    });

    QUnit.test("Calls error handler when request rejects", function (assert) {
        // Arrange
        this.oGetStub.rejects();
        // Act
        this.oDTRequest.refresh();

        return this.oDTRequest.oRequest.then(function () {
            // Assert
            assert.strictEqual(this.oOnSuccessStub.callCount, 0, "_onSuccess was not called");
            assert.strictEqual(this.oOnErrorStub.callCount, 1, "_onError was called once");
        }.bind(this));
    });

    QUnit.module("abort", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
            this.oDTRequest.oRequest = Promise.resolve();

            this.oAbortAllStub = sandbox.stub();
            this.oDTRequest.oClient = {
                abortAll: this.oAbortAllStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts and reset request", function (assert) {
        // Arrange
        // Act
        this.oDTRequest.abort();
        // Assert
        assert.strictEqual(this.oDTRequest.oRequest, null, "Saved the correct request");
        assert.strictEqual(this.oAbortAllStub.callCount, 1, "abortAll was called once");
    });

    QUnit.test("Does not abort when no request exists", function (assert) {
        // Arrange
        delete this.oDTRequest.oRequest;
        // Act
        this.oDTRequest.abort();
        // Assert
        assert.strictEqual(this.oAbortAllStub.callCount, 0, "abortAll was not called");
    });

    QUnit.module("_onSuccess", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();

            this.oOnErrorStub = sandbox.stub(this.oDTRequest, "_onError");

            this.oSuccessStub = sandbox.stub();
            this.oDTRequest.fnSuccess = this.oSuccessStub;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Handles plain data correctly", function (assert) {
        // Arrange
        var oResponseData = {
            responseText: "22"
        };
        var oExpectedData = {
            number: 22
        };
        // Act
        this.oDTRequest._onSuccess(oResponseData);
        // Assert
        var oResult = this.oSuccessStub.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.test("Handles $inlinecount=allpages correctly", function (assert) {
        // Arrange
        var oData = {
            __count: 22
        };
        var oResponseData = {
            responseText: JSON.stringify(oData)
        };
        var oExpectedData = {
            number: 22
        };
        this.oDTRequest.sRequestPath = "someUrl?$inlinecount=allpages";
        // Act
        this.oDTRequest._onSuccess(oResponseData);
        // Assert
        var oResult = this.oSuccessStub.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.test("Handles $count=true correctly", function (assert) {
        // Arrange
        var oData = {
            "@odata.count": 22
        };
        var oResponseData = {
            responseText: JSON.stringify(oData)
        };
        var oExpectedData = {
            number: 22
        };
        this.oDTRequest.sRequestPath = "someUrl?$count=true";
        // Act
        this.oDTRequest._onSuccess(oResponseData);
        // Assert
        var oResult = this.oSuccessStub.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.test("Handles OData v4 response correctly", function (assert) {
        // Arrange
        var oData = {
            icon: "sap-icon://travel-expense",
            info: "OData v4",
            infoState: "Critical",
            number: 43.333,
            numberDigits: 1,
            numberFactor: "k",
            numberState: "Positive",
            numberUnit: "EUR",
            stateArrow: "Up",
            subtitle: "Quarterly overview",
            title: "Travel Expenses"
        };
        var oResponseData = {
            responseText: JSON.stringify(oData)
        };
        var oExpectedData = oData = {
            icon: "sap-icon://travel-expense",
            info: "OData v4",
            infoState: "Critical",
            number: 43.333,
            numberDigits: 1,
            numberFactor: "k",
            numberState: "Positive",
            numberUnit: "EUR",
            stateArrow: "Up",
            subtitle: "Quarterly overview",
            title: "Travel Expenses"
        };
        this.oDTRequest.sRequestPath = "someUrl";
        // Act
        this.oDTRequest._onSuccess(oResponseData);
        // Assert
        var oResult = this.oSuccessStub.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.test("Handles OData v2 response correctly", function (assert) {
        // Arrange
        var oData = {
            d: {
                icon: "sap-icon://travel-expense",
                info: "OData v4",
                infoState: "Critical",
                number: 43.333,
                numberDigits: 1,
                numberFactor: "k",
                numberState: "Positive",
                numberUnit: "EUR",
                stateArrow: "Up",
                subtitle: "Quarterly overview",
                title: "Travel Expenses"
            }
        };
        var oResponseData = {
            responseText: JSON.stringify(oData)
        };
        var oExpectedData = oData = {
            icon: "sap-icon://travel-expense",
            info: "OData v4",
            infoState: "Critical",
            number: 43.333,
            numberDigits: 1,
            numberFactor: "k",
            numberState: "Positive",
            numberUnit: "EUR",
            stateArrow: "Up",
            subtitle: "Quarterly overview",
            title: "Travel Expenses"
        };
        this.oDTRequest.sRequestPath = "someUrl";
        // Act
        this.oDTRequest._onSuccess(oResponseData);
        // Assert
        var oResult = this.oSuccessStub.getCall(0).args[0];
        assert.deepEqual(oResult, oExpectedData, "called tile success handler with correct data");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.test("Throws an error when response is not parseable", function (assert) {
        // Arrange
        var sExpectedError = "Was not able to parse response of dynamic tile request";
        try {
            // Act
            this.oDTRequest._onSuccess({});
        } catch (err) {
            // Assert
            assert.strictEqual(err.message, sExpectedError, "Returned the correct error");
        }
    });

    QUnit.module("_onError", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();

            this.oDTRequest.oRequest = {};

            this.oErrorStub = sandbox.stub();
            this.oDTRequest.fnError = this.oErrorStub;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls error handler and reset request", function (assert) {
        // Arrange
        var oError = {};
        // Act
        this.oDTRequest._onError(oError);
        // Assert
        var oResult = this.oErrorStub.getCall(0).args[0];
        assert.strictEqual(oResult, oError, "Called error handler with correct object");
        assert.deepEqual(this.oDTRequest.oRequest, null, "Request was reset");
    });

    QUnit.module("_extractData", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Filters non supported keys", function (assert) {
        // Arrange
        var oData = {
            nonSupportedKey: "nonSupportedKeyValue",
            results: "someResults",
            icon: "someIcon",
            title: "someTitle",
            number: "someNumber",
            numberUnit: "someNumberUnit",
            info: "someInfo",
            infoState: "someInfoState",
            infoStatus: "someInfoStatus",
            targetParams: "someTargetParams",
            subtitle: "someSubtitle",
            stateArrow: "someStateArrow",
            numberState: "someNumberState",
            numberDigits: "someNumberDigits",
            numberFactor: "someNumberFactor"
        };
        var oExpectedData = {
            results: "someResults",
            icon: "someIcon",
            title: "someTitle",
            number: "someNumber",
            numberUnit: "someNumberUnit",
            info: "someInfo",
            infoState: "someInfoState",
            infoStatus: "someInfoStatus",
            targetParams: "someTargetParams",
            subtitle: "someSubtitle",
            stateArrow: "someStateArrow",
            numberState: "someNumberState",
            numberDigits: "someNumberDigits",
            numberFactor: "someNumberFactor"
        };
        // Act
        var oResult = this.oDTRequest._extractData(oData);
        // Assert
        assert.deepEqual(oResult, oExpectedData, "Returned the correct data");
    });

    QUnit.test("Filters non supported keys when d is present", function (assert) {
        // Arrange
        var oData = {
            d: {
                nonSupportedKey: "nonSupportedKeyValue",
                results: "someResults",
                icon: "someIcon",
                title: "someTitle",
                number: "someNumber",
                numberUnit: "someNumberUnit",
                info: "someInfo",
                infoState: "someInfoState",
                infoStatus: "someInfoStatus",
                targetParams: "someTargetParams",
                subtitle: "someSubtitle",
                stateArrow: "someStateArrow",
                numberState: "someNumberState",
                numberDigits: "someNumberDigits",
                numberFactor: "someNumberFactor"
            }
        };
        var oExpectedData = {
            results: "someResults",
            icon: "someIcon",
            title: "someTitle",
            number: "someNumber",
            numberUnit: "someNumberUnit",
            info: "someInfo",
            infoState: "someInfoState",
            infoStatus: "someInfoStatus",
            targetParams: "someTargetParams",
            subtitle: "someSubtitle",
            stateArrow: "someStateArrow",
            numberState: "someNumberState",
            numberDigits: "someNumberDigits",
            numberFactor: "someNumberFactor"
        };
        // Act
        var oResult = this.oDTRequest._extractData(oData);
        // Assert
        assert.deepEqual(oResult, oExpectedData, "Returned the correct data");
    });

    QUnit.test("Handles OData function imports correctly", function (assert) {
        // Arrange
        var oData = {
            d: {
                DynamicTileParameters: {
                    __metadata: {},
                    number: 392,
                    numberState: "Negative"
                }
            }
        };
        var oExpectedData = {
            number: 392,
            numberState: "Negative"
        };
        // Act
        var oResult = this.oDTRequest._extractData(oData);
        // Assert
        assert.deepEqual(oResult, oExpectedData, "Returned the correct data");
    });

    QUnit.test("Handles invalid response correctly", function (assert) {
        // Arrange
        var oData = {
            someInvalidProperty: {},
            anotherInvalidProperty: {}
        };
        // Act
        var oResult = this.oDTRequest._extractData(oData);
        // Assert
        assert.deepEqual(oResult, {}, "Returned the correct data");
    });

    QUnit.module("_getHeaders", {
        beforeEach: function () {
            this.oGetClientStub = sandbox.stub().returns("100");
            sap.ushell.Container = {
                getLogonSystem: sandbox.stub().returns({
                    getClient: this.oGetClientStub
                })
            };
            this.oGetLanguageStub = sandbox.stub(sap.ui.getCore().getConfiguration(), "getLanguage").returns("EN");
            this.oGetSAPLogonLanguageStub = sandbox.stub(sap.ui.getCore().getConfiguration(), "getSAPLogonLanguage");

            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns default headers", function (assert) {
        // Arrange
        var oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "EN",
            Accept: "application/json"
        };
        // Act
        var oResult = this.oDTRequest._getHeaders("a://b.c/d");
        // Assert
        assert.deepEqual(oResult, oExpectedHeaders, "Returned the correct data");
    });

    QUnit.test("Adds sap-language when LogonLanguage is available", function (assert) {
        // Arrange
        this.oGetSAPLogonLanguageStub.returns("EN");
        var oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "EN",
            "sap-language": "EN",
            Accept: "application/json"
        };
        // Act
        var oResult = this.oDTRequest._getHeaders("a://b.c/d");
        // Assert
        assert.deepEqual(oResult, oExpectedHeaders, "Returned the correct data");
    });

    QUnit.test("Adds sap-client when url is relative", function (assert) {
        // Arrange
        this.oGetSAPLogonLanguageStub.returns("EN");
        var oExpectedHeaders = {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Accept-Language": "EN",
            "sap-language": "EN",
            "sap-client": "100",
            Accept: "application/json"
        };
        // Act
        var oResult = this.oDTRequest._getHeaders("/d");
        // Assert
        assert.deepEqual(oResult, oExpectedHeaders, "Returned the correct data");
    });

    QUnit.module("_resolveDefaults", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };

            this.sContentProviderId = "someContentProviderId";
            this.oSystemContext = {};

            this.oGetServiceAsyncStub.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: sandbox.stub().withArgs(this.sContentProviderId).resolves(this.oSystemContext)
            });

            this.oResolvedUrl = {
                url: "someResolvedUrl"
            };
            this.oResolveUserDefaultParametersStub = sandbox.stub().returns(new jQuery.Deferred().resolve(this.oResolvedUrl));
            this.oGetServiceAsyncStub.withArgs("ReferenceResolver").resolves({
                resolveUserDefaultParameters: this.oResolveUserDefaultParametersStub
            });

            this.oLogStub = sandbox.stub(Log, "error");

            this.oResolveStub = sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
            this.oResolveStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the resolved url", function (assert) {
        // Arrange
        var sUrl = "someUrl";
        // Act
        return this.oDTRequest._resolveDefaults(sUrl, this.sContentProviderId).then(function (sResult) {
            // Assert
            assert.strictEqual(sResult, this.oResolvedUrl.url, "Resolved with the correct result");
            assert.strictEqual(this.oResolveUserDefaultParametersStub.getCall(0).args[0], sUrl, "resolveUserDefaultParameters was called with the correct url");
            assert.strictEqual(this.oResolveUserDefaultParametersStub.getCall(0).args[1], this.oSystemContext, "resolveUserDefaultParameters was called with the correct systemContext");
        }.bind(this));
    });

    QUnit.test("Returns undefined when default values are missing", function (assert) {
        // Arrange
        var sUrl = "someUrl";
        var oResolvedUrl = {
            defaultsWithoutValue: ["UserDefault.ABC"]
        };
        this.oResolveUserDefaultParametersStub.returns(new jQuery.Deferred().resolve(oResolvedUrl));
        var sExpextedMessaqge = "The service URL contains User Default(s) with no set value: UserDefault.ABC";
        // Act
        return this.oDTRequest._resolveDefaults(sUrl, this.sContentProviderId).then(function (sResult) {
            // Assert
            assert.strictEqual(sResult, undefined, "Resolved with the correct result");
            assert.strictEqual(this.oLogStub.getCall(0).args[0], sExpextedMessaqge, "error was called with correct message");
        }.bind(this));
    });

    QUnit.test("Returns undefined when default values contain ignored references", function (assert) {
        // Arrange
        var sUrl = "someUrl";
        var oResolvedUrl = {
            ignoredReferences: ["ABC", "DEF"]
        };
        this.oResolveUserDefaultParametersStub.returns(new jQuery.Deferred().resolve(oResolvedUrl));
        var sExpextedMessaqge = "The service URL contains invalid Reference(s): ABC, DEF";
        // Act
        return this.oDTRequest._resolveDefaults(sUrl, this.sContentProviderId).then(function (sResult) {
            // Assert
            assert.strictEqual(sResult, undefined, "Resolved with the correct result");
            assert.strictEqual(this.oLogStub.getCall(0).args[0], sExpextedMessaqge, "error was called with correct message");
        }.bind(this));
    });

    QUnit.module("destroy", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();

            this.oAbortStub = sandbox.stub(this.oDTRequest, "abort");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Aborts running requests", function (assert) {
        // Arrange
        this.oDTRequest.fnSuccess = {};
        this.oDTRequest.fnError = {};
        // Act
        this.oDTRequest.destroy();
        // Assert
        assert.strictEqual(this.oAbortStub.callCount, 1, "abort was called once");
        assert.strictEqual(this.oDTRequest.fnSuccess, null, "fnSuccess was deleted");
        assert.strictEqual(this.oDTRequest.fnError, null, "fnError was deleted");
    });

    QUnit.module("_getRequestUrl", {
        beforeEach: function () {
            sandbox.stub(DynamicTileRequest.prototype, "_resolveDefaults").resolves();
            this.oDTRequest = new DynamicTileRequest();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected result", function (assert) {
        // Arrange
        this.oDTRequest.sBasePath = "basePath/";
        this.oDTRequest.sRequestPath = "requestPath";
        var sExpectedUrl = "basePath/requestPath";
        // Act
        var sResult = this.oDTRequest._getRequestUrl();
        // Assert
        assert.strictEqual(sResult, sExpectedUrl, "Returned the correct url");
    });
});
