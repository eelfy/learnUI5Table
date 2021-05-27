// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for behaviour of restricted keep alive
 */
QUnit.config.testTimeout = 400000;

sap.ui.require([], function () {
    "use strict";
    /* global module strictEqual start QUnit */

    var flpIframe = jQuery("#flp"),
        iWaitForApp = 30000,
        iWaitForHome = 8000;

    module("test", {
        setup: function () {
        },

        teardown: function () {
        }
    });

    function openApp (sHash) {
        flpIframe[0].contentWindow.document.location.hash = "#" + sHash;
    }

    QUnit.asyncTest("check use of same iframe for two apps", function (assert) {
        function checkOpenSampleTargetApp() {
            openApp("FioriToExtAppTarget-Action?sap-keep-alive=restricted");
            setTimeout(function () {
                //the tests
                strictEqual(jQuery("#viewPortContainer", flpIframe.contents()).children().length, 4, "viewPortContainer was not found");
                strictEqual(jQuery("#application-AppNotIsolated-Action", flpIframe.contents()).length, 1, "application-AppNotIsolated-Action was not found");
                strictEqual(jQuery("#application-Action-toLetterBoxing", flpIframe.contents()).length, 1, "application-Action-toLetterBoxing was not found");
                strictEqual(jQuery("#application-FioriToExtAppTarget-Action", flpIframe.contents()).length, 1, "application-FioriToExtAppTarget-Action was not found");
                openApp("Shell-home");
                setTimeout(function () {
                    strictEqual(jQuery("#viewPortContainer", flpIframe.contents()).children().length, 2, "viewPortContainer was not found");
                    strictEqual(jQuery("#application-Action-toLetterBoxing", flpIframe.contents()).length, 1, "application-Action-toLetterBoxing was not found");
                    start();
                }, iWaitForHome);


            }, iWaitForApp);
        }

        function checkOpenSampleSourceApp() {
            openApp("FioriToExtApp-Action");
            setTimeout(function () {
                checkOpenSampleTargetApp();
            }, iWaitForApp);
        }

        function checkOpenLetterBoxApp() {
            openApp("Action-toLetterBoxing?sap-keep-alive=restricted");
            setTimeout(function () {
                checkOpenSampleSourceApp();
            }, iWaitForApp);
        }

        function checkOpenAppListApp() {
            openApp("AppNotIsolated-Action?sap-keep-alive=restricted");
            setTimeout(function () {
                checkOpenLetterBoxApp();
            }, iWaitForApp);
        }

        setTimeout(checkOpenAppListApp, iWaitForApp);
    });
});
