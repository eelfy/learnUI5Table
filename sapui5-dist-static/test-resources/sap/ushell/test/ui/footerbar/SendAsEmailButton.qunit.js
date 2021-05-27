// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SendAsEmailButton
 */
sap.ui.require(["sap/ushell/ui/footerbar/SendAsEmailButton",
        "sap/ushell/resources",
        "sap/ushell/services/Container",
        "sap/ui/thirdparty/hasher",
        "sap/ushell/services/_AppState/AppState",
        "sap/ushell/Config"
    ],
function (SendAsEmailButton, resources, Container, hasher, AppStateAppState, Config) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("sap.ushell.ui.footerbar.SendAsEmailButton", {
        /**
         * This method is called before each test
         */
        beforeEach: function () {
            return sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    [
        {
            testDescription: "sendAsEmailPressed - with empty url"
        },
        {
            testDescription: "sendAsEmailPressed - with a changed url",
            testConfig: {
                title: "test app"
            },
            expectedParameters: [null,
                sap.ushell.resources.i18n.getText("linkTo") + " 'test app'",
                "SendAsEmailButton test"]
        },
        {
            testDescription: "sendAsEmailPressed - with no title",
            testConfig: {
            },
            expectedParameters: [null,
                sap.ushell.resources.i18n.getText("linkToApplication"),
                "SendAsEmailButton test"]
        }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.testDescription, function (assert) {
            var oSendAsEmailButton = new SendAsEmailButton();
            var oGetServiceAsyncStub = sinon.stub(sap.ushell.Container, "getServiceAsync");
            oGetServiceAsyncStub.returns(new jQuery.Deferred().resolve({
                setAppStateToPublic: sinon.stub().returns(new jQuery.Deferred().resolve("SendAsEmailButton test"))
            }));

            var oTriggerEmailStub = sinon.stub(sap.m.URLHelper, "triggerEmail");
            var oConfigStub;
            if (oFixture.testConfig) {
                oConfigStub = sinon.stub(Config, "last");
                oConfigStub.returns(oFixture.testConfig);
            }

            // Act
            oSendAsEmailButton.sendAsEmailPressed();

            // Assert
            assert.strictEqual(oTriggerEmailStub.callCount, 1, "URLHelper trigger Email was called once.");
            if (oFixture.testConfig) {
                assert.deepEqual(oTriggerEmailStub.args[0], oFixture.expectedParameters, "URL Helper trigger Email was called with the correct parameters.");
                oConfigStub.restore();
            }
            oGetServiceAsyncStub.restore();
            oTriggerEmailStub.restore();
        });
    });
});
