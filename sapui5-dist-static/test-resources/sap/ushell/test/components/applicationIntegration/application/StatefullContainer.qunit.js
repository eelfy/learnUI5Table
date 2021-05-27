// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for behaviour of statefull container
 */
QUnit.config.testTimeout = 400000;

sap.ui.require([], function () {
    "use strict";
    /* global module strictEqual start QUnit */

    var flpIframe = jQuery("#flp"),
        iWaitForApp = 30000,
        iWaitStateFullApp = 8000,
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
        function checkCorrectAppContainersIds (nAppsIframes) {
            strictEqual(jQuery("#viewPortContainer", flpIframe.contents()).children().length, nAppsIframes, "viewPortContainer was not found");
            strictEqual(jQuery("#application-toLetterBoxing-toLetterBoxing", flpIframe.contents()).length, 1, "application-Action-toLetterBoxing was not found");
            strictEqual(jQuery("#__renderer0---Shell-home-component-container", flpIframe.contents()).length, 1, "__renderer0---Shell-home-component-container was not found");
            if (nAppsIframes === 3) {
                strictEqual(jQuery("#application-X1-Y1", flpIframe.contents()).length, 1, "application-X1-Y1 was not found");
            }
        }

        function checkElemenInIframeApp (siFrame, sId, bExists) {
            var appIframe = jQuery("#application-" + siFrame, flpIframe.contents());
            strictEqual(jQuery("." + sId, appIframe.contents()).length, (bExists ? 1 : 0), sId + " was not found");
        }

        function checkOpenStatefullContainerDemoAppB() {
            openApp("Shell-home");
            setTimeout(function () {
                checkCorrectAppContainersIds(3);
                openApp("X2-Y2");
                setTimeout(function () {
                    checkCorrectAppContainersIds(3);
                    checkElemenInIframeApp("X1-Y1", "idQunitAppBButton", true);
                    openApp("Shell-home");
                    start();
                }, iWaitStateFullApp);
            }, iWaitForHome);
        }

        function checkOpenStatefullContainerDemoAppA() {
            openApp("Shell-home");
            setTimeout(function () {
                checkElemenInIframeApp("toLetterBoxing-toLetterBoxing", "idQunitToggleSizeBehavior", false);
                checkCorrectAppContainersIds(2);
                openApp("X1-Y1");
                setTimeout(function () {
                    checkCorrectAppContainersIds(3);
                    checkElemenInIframeApp("X1-Y1", "idQunitAppAButton", true);
                    checkOpenStatefullContainerDemoAppB();
                }, iWaitStateFullApp);
            }, iWaitForHome);
        }

        function checkOpenAppNavSampleApp() {
            openApp("Shell-home");
            setTimeout(function () {
                checkElemenInIframeApp("toLetterBoxing-toLetterBoxing", "idQunitChangeLetterBoxButton", false);
                checkCorrectAppContainersIds(2);
                openApp("AppNavSample-id");
                setTimeout(function () {
                    checkCorrectAppContainersIds(2);
                    checkElemenInIframeApp("toLetterBoxing-toLetterBoxing", "idQunitToggleSizeBehavior", true);
                    checkOpenStatefullContainerDemoAppA();
                }, iWaitForApp);
            }, iWaitForHome);
        }

        function checkOpenLetterBoxingApp() {
            openApp("toLetterBoxing-toLetterBoxing");
            setTimeout(function () {
                checkCorrectAppContainersIds(2);
                checkElemenInIframeApp("toLetterBoxing-toLetterBoxing", "idQunitChangeLetterBoxButton", true);
                checkOpenAppNavSampleApp();
            }, iWaitForApp);
        }

        setTimeout(checkOpenLetterBoxingApp, iWaitForApp);
    });
});
