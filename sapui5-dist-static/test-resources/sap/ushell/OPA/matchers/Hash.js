// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/matchers/Matcher",
    "sap/base/Log",
    "sap/base/util/deepEqual"
], function (Matcher, Log, fnDeepEqual) {
    "use strict";

    var oLogger = Log.getLogger("sap.ushell.opa.matchers.Hash");

    /**
     * Checks if the current hash matches with the provided hash.
     *
     * @param {object} oProperties The object with the hash to be checked. Example:
     * <pre>
     * new Hash({
     *     // The hash text is equal to the current hash.
     *     hash: "#Shell-home",
     * })
     * </pre>
     *
     * @private
     * @since 1.76.0
     */
     return Matcher.extend("sap.ushell.opa.matchers.hash", {
         metadata: {
             publicMethods: ["isMatching"],

             properties: {
                /**
                 * The hash to compare with the current hash.
                 */
                hash: {
                    type: "string"
                }
            }

         },

         /**
          * Checks if the current window.hasher.getHash() equals the hash provided in the properties.
          * Uses the URLParsing.parseShellHash() function to create hash objects out of the provided strings to prevent errors.
          *
          * @returns {boolean} true if the two hashes are matching. False if not,
          *
          * @since 1.76.0
          */
         isMatching: function () {
            var sExpextedHash = this.getHash();
            var oUrlParsingService = sap.ushell.Container.getService("URLParsing");
            var aHashParts = oUrlParsingService.parseShellHash(window.hasher.getHash());
            var aExpectedHashparts = oUrlParsingService.parseShellHash(sExpextedHash);
            if (fnDeepEqual(aHashParts, aExpectedHashparts)) {
                return aHashParts;
            }
            oLogger.debug("The hash "+ sExpextedHash+ " is not matching");
            return false;
         }
     });
});
