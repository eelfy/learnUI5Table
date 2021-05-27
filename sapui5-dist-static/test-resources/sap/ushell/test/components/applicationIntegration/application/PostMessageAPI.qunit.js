// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.PostMessageAPI
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/application/PostMessageAPI",
    "sap/base/util/ObjectPath"
], function (PostMessageAPI, ObjectPath) {
    "use strict";
    /* global module ok sinon test*/

    module("sap.ushell.components.applicationIntegration.application.PostMessageAPI", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    test("test sendEmail no app state with bSetAppStateToPublic=false", function (assert) {
        var oTriggerEmailStub = sinon.stub(sap.m.URLHelper, "triggerEmail");

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com as test",
            "body with link http://www.a.com",
            "cc",
            "bcc",
            "http://www.a.com",
            false);

        ok(oTriggerEmailStub.calledWith(
            "to",
            "subject " + document.URL + " as test",
            "body with link " + document.URL,
            "cc",
            "bcc"));

        oTriggerEmailStub.restore();
    });

    test("test sendEmail no app state with bSetAppStateToPublic=true", function (assert) {
        var oTriggerEmailStub = sinon.stub(sap.m.URLHelper, "triggerEmail");

        ObjectPath.set("sap.ushell.Container.getService", function() {
            return {
                setAppStateToPublic: function() {
                    return new jQuery.Deferred().resolve("http://www.a.com");
                }
            };
        });

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com as test",
            "body with link http://www.a.com",
            "cc",
            "bcc",
            "http://www.a.com",
            true);

        ok(oTriggerEmailStub.calledWith(
            "to",
            "subject " + document.URL + " as test",
            "body with link " + document.URL,
            "cc",
            "bcc"));

        oTriggerEmailStub.restore();
    });

    test("test sendEmail with app state with bSetAppStateToPublic=true", function (assert) {
        var oTriggerEmailStub = sinon.stub(sap.m.URLHelper, "triggerEmail");

        ObjectPath.set("sap.ushell.Container.getService", function() {
            return {
                setAppStateToPublic: function() {
                    return new jQuery.Deferred().resolve(
                        "http://www.a.com?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4",
                        "AAA", "BBB", "CCC", "DDD"
                    );
                }
            };
        });

        var oGetURLStub = sinon.stub(PostMessageAPI, "_getBrowserURL").returns(
            document.URL + "?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4"
        );

        PostMessageAPI._sendEmail(
            "to",
            "subject http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4 as test",
            "body with link http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
            "cc",
            "bcc",
            "http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
            true);

        ok(oTriggerEmailStub.calledWith(
            "to",
            "subject " + document.URL + "?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4 as test",
            "body with link " + document.URL + "?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4",
            "cc",
            "bcc"));

        oGetURLStub.restore();
        oTriggerEmailStub.restore();
    });
});
