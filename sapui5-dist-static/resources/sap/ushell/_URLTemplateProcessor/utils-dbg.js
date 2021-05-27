// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview pure utility functions for modules of <code>URLTemplateProcessor</code>
 *
 * @version 1.88.1
 *
 * @private
 */

sap.ui.define([
    "sap/ushell/utils/clone",
    "sap/ushell/utils/type"
], function (fnClone, oType) {
    "use strict";

    function hasValue (vValue) {
        return vValue !== null && typeof vValue !== "undefined";
    }

    function removeArrayParameterNotation (oParams) {
        return Object.keys(oParams).reduce(function (o, sParamName) {
            var vParamValue = oParams[sParamName];
            if (Object.prototype.toString.apply(vParamValue) === "[object Array]") {
                o[sParamName] = vParamValue[0];
            } else if (typeof vParamValue === "string") {
                o[sParamName] = vParamValue;
            } else {
                throw new Error("Parameters should be passed as strings or array of strings");
            }

            return o;
        }, {});
    }

    function mergeObject (o1, o2) {
        var o1Clone = fnClone(o1);
        var o2Clone = fnClone(o2);

        return Object.keys(o2Clone).reduce(function (o, sO2Key) {
            o[sO2Key] = o2Clone[sO2Key];
            return o;
        }, o1Clone);
    }


    return {
        mergeObject: mergeObject,
        hasValue: hasValue,
        removeArrayParameterNotation: removeArrayParameterNotation
    };

}, false /* bExport */);
