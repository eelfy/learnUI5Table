// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.utils.WindowUtils
 */

/* global QUnit sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/utils/WindowUtils",
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/base/util/UriParameters"
], function (WindowUtils, Log, Device, Controller, JSONModel, UriParameters) {
    "use strict";

    QUnit.start();

    var sandbox = sinon.sandbox.create();

    QUnit.module("hasInvalidProtocol");

    QUnit.test("Returns false for URLs with HTTP protocol", function (assert) {
        // Arrange
        var sURL = "http://www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with HTTPS protocol", function (assert) {
        // Arrange
        var sURL = "https://www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with no protocol (defaults to http/https in good browsers or blank in IE)", function (assert) {
        // Arrange
        var sURL = "www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns true for URLs with javascript protocol", function (assert) {
        // Arrange
        var sURL = "javascript:alert(\"Hello\")", // eslint-disable-line no-script-url
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, true, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with file protocol", function (assert) {
        // Arrange
        var sURL = "file://someFile.exe", // eslint-disable-line no-script-url
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.module("openURL", {
        beforeEach: function () {
            this.oHasInvalidProtocolStub = sandbox.stub(WindowUtils, "hasInvalidProtocol");
            this.oLogFatalStub = sandbox.stub(Log, "fatal");
            this.oWindowOpenStub = sandbox.stub(window, "open");
            this.oIsCrossOriginStub = sandbox.stub(WindowUtils, "isCrossOriginUrl");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checks for forbidden protocols by default and throws when one is found", function (assert) {
        // Arrange
        var sError = "Tried to open a URL with an invalid protocol";
        this.oHasInvalidProtocolStub.returns(true);
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("");
        } catch (e) {
            assert.strictEqual(e.message, sError, "Error was thrown");
        }
        // Assert
        assert.strictEqual(this.oLogFatalStub.firstCall.args[0], sError, "Error was logged");
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.notCalled, "window.open was not called");
    });

    QUnit.test("checks for forbidden protocols by default and opens the window if a valid one is found", function (assert) {
        // Arrange
        this.oHasInvalidProtocolStub.returns(false);
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("");
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.called, "window.open was called");
    });

    QUnit.test("skips the protocol check if safeMode is disabled", function (assert) {
        // Arrange
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("", null, null, false);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.notCalled, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.called, "window.open was called");
    });

    QUnit.test("provides all parameters to the window.open function and returns the new window object", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,additional,windowFeatures",
                true
            ],
            oNewWindowObject = { foo: "bar" },
            oResult;
        this.oIsCrossOriginStub.returns(false);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns(oNewWindowObject);
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        aParameters.pop(); // Get rid of the last parameter which is not used for the actual window.open call
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, oNewWindowObject, "new window object was returned");
    });

    QUnit.test("automatically sets the noopener and noreferrer options for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("handles windowFeatures correctly for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,window,features"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,window,features,noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noopener windowFeature entries for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noopener windowFeature entries for cross origin cases when the entry is not lower-case", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "NoOpener"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "NoOpener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noreferrer windowFeature entries for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noreferrer"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noreferrer,noopener"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noreferrer windowFeature entries for cross origin cases when the entry is not lower-case", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "nOrEfErrEr"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "nOrEfErrEr,noopener"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("automatically deletes the opener when IE is used", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow"
            ],
            aExpectedParameters = [
                "about:blank",
                "myCoolWindow"
            ],
            oNewWindowObject = {
                foo: "bar",
                opener: "bar",
                location: {
                    href: ""
                }
            },
            oResult,
            bIsIe = Device.browser.msie;
        Device.browser.msie = true;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns(oNewWindowObject);
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.strictEqual(oNewWindowObject.opener, null, "window.opener was removed");
        assert.strictEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
        // Cleanup
        Device.browser.msie = bIsIe;
    });

    QUnit.test("test getLeanURL function", function (assert) {
        var sLeanURL;

        sLeanURL = WindowUtils.getLeanURL("abc", "def");
        assert.strictEqual(sLeanURL, "abc", "External urls are not modifiend.");

        sLeanURL = WindowUtils.getLeanURL("#abc");
        assert.ok(sLeanURL.indexOf("appState=lean") > -1, "Lean state is added for hash URLS.");
        assert.ok(sLeanURL.indexOf("#abc") > -1, "Hash is persisted.");

        sLeanURL = WindowUtils.getLeanURL(undefined, "abc#def");
        assert.strictEqual(sLeanURL, "abc#def", "External urls are not modifiend.");

        sLeanURL = WindowUtils.getLeanURL();
        assert.strictEqual(sLeanURL, undefined, "Empty urls return nothing.");
    });


    QUnit.module("The function _getAdjustedQueryString", {
        beforeEach: function () {
            Device.system.phone = false;
            Device.system.tablet = false;

            this.fnGetAll = sandbox.stub();
            this.oFromQueryStub = sandbox.stub(UriParameters, "fromQuery");
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Return null when no urlParams", function (assert) {
        // Arrange
        // Act
        var sResult = WindowUtils._getAdjustedQueryString([]);
        // Assert
        assert.equal(sResult, null, "correct result is returned");
    });

    QUnit.test("Adds new parameter to query string", function (assert) {
        // Arrange
        this.fnGetAll.withArgs("sap-theme").returns([ "sap_fiori_3" ]);
        this.fnGetAll.withArgs("baz").returns([ "foo" ]);
        this.oFromQueryStub.returns({
            keys: sandbox.stub().returns([ "sap-theme", "baz" ]),
            getAll: this.fnGetAll
        });
        // Act
        var sResult = WindowUtils._getAdjustedQueryString([ { "sap-language": "EN" } ]);
        // Assert
        assert.equal(sResult, "baz=foo&sap-language=EN&sap-theme=sap_fiori_3", "correct result is returned");
    });

    QUnit.test("Replace parameter in query string", function (assert) {
        // Arrange
        this.fnGetAll.withArgs("sap-language").returns([ "DE" ]);
        this.fnGetAll.withArgs("baz").returns([ "foo" ]);
        this.oFromQueryStub.returns({
            keys: sandbox.stub().returns([ "sap-language", "baz" ]),
            getAll: this.fnGetAll
        });
        // Act
        var sResult = WindowUtils._getAdjustedQueryString([ { "sap-language": "EN" } ]);
        // Assert
        assert.strictEqual(sResult, "baz=foo&sap-language=EN", "correct result is returned");
    });

    QUnit.test("Wrong parameters", function (assert) {
        // Arrange
        this.fnGetAll.withArgs("sap-theme").returns([ "sap_fiori_3" ]);
        this.fnGetAll.withArgs("baz").returns([ "foo" ]);
        this.oFromQueryStub.returns({
            keys: sandbox.stub().returns([ "sap-theme", "baz" ]),
            getAll: this.fnGetAll
        });
        // Act
        var sResult = WindowUtils._getAdjustedQueryString([ {} ]);
        // Assert
        assert.strictEqual(sResult, "baz=foo&sap-theme=sap_fiori_3", "correct result is returned");
    });
});
