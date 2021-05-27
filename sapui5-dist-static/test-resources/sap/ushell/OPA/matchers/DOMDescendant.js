// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * Works similar to sap/ui/test/matchers/Descendant. This matcher checks the DOM tree
 * instead of the control tree.
*/
sap.ui.define([
    "sap/ui/test/matchers/Matcher",
    "sap/ui/thirdparty/jquery"
], function (Matcher, jquery) {
    "use strict";

     return Matcher.extend("sap.ushell.opa.matchers.DOMDescendant", {
        metadata: {
            publicMethods: [ "isMatching" ],
            properties: {
                descendant: {
                    type: "sap.ui.core.Control"
                }
            }
        },
        isMatching: function (oParent) {
            var oParentDomRef = oParent.getDomRef();
            var oChildDomRef = this.getDescendant().getDomRef();
            return jquery(oParentDomRef).find(oChildDomRef).length > 0;
        }
     });
}, /* bExport= */ true);
