// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for behaviour plugins post message api interface
 */
QUnit.config.testTimeout = 400000;

sap.ui.require([], function () {
    "use strict";
    /* global module strictEqual start QUnit */

    var flpIframe = jQuery("#flp"),
        iWaitForApp = 20000;

    module("test", {
        setup: function () {
        },

        teardown: function () {
        }
    });

    QUnit.asyncTest("check plugins API", function (assert) {
        function checkPostMessagesResult () {
            var oElements;
            oElements = jQuery("span", flpIframe.contents()).filter(function() { return (jQuery(this).text().indexOf("Agent connected successfully") > -1); });
            strictEqual(oElements.length, 1, "found hello from plugin");
            oElements = jQuery("span", flpIframe.contents()).filter(function() { return (jQuery(this).text().indexOf("Response from Plugin 1234") > -1); });
            strictEqual(oElements.length, 1, "found message from plugin");
            start();
        }

        setTimeout(checkPostMessagesResult, iWaitForApp);
    });
});
