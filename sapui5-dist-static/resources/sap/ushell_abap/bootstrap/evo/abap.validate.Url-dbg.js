// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview Validates a given Url
 *
 */

sap.ui.define([], function () {
    "use strict";

    return fnValidateUrl;
    /**
     * Validates the given URL.
     *
     * The validation consists of two steps.
     *
     * 1. name validation, in which it is checked that the url is
     *    slash-separated, the filename is composed of an ASCII subset (i.e.,
     *    letters, numbers and underscore), and ending with a .json extension.
     *
     * 2. allowing, in which the URL prefix is searched in an allowlist hardcoded in a config parameter
     *
     * NOTE: a falsy mAllowlist parameter causes this method to return an error message.
     *
     * @param {string} sUrl
     *   The url to validate
     * @param {object} mAllowlist
     *   An allowlist, mapping a url prefix to a boolean value that indicates
     *   whether a URL starting with that prefix should be allowed.
     * @return {string|undefined}
     *   The error message encountered during validation, or undefined if the url is valid.
     *
     * @deprecated since 1.86.
     */

    function fnValidateUrl (sUrl, mAllowlist) {
        // Check for allowed characters in the json file name
        var aRequestUrlComponents = /^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(sUrl),
            sRequestUrlPrefix;

        if (!aRequestUrlComponents) {
            return "name of configuration URL is not valid. Url is:\"" + sUrl + "\"";
        }

        sRequestUrlPrefix = typeof aRequestUrlComponents[1] === "undefined" ? "" : aRequestUrlComponents[1];

        if (!mAllowlist ||
            !mAllowlist.hasOwnProperty(sRequestUrlPrefix) ||
            !mAllowlist[sRequestUrlPrefix]) {

            return "URL for config file does not match restrictions. Url is:\"" + sUrl + "\"";
        }

        return undefined;
    }
});