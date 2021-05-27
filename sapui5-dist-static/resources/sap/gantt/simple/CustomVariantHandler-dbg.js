sap.ui.define([
    "sap/ui/core/Element"
], function (Element) {
    'use strict';

    var CustomVariantHandler = Element.extend("sap.gantt.simple.CustomVariantHandler", {
        metadata: {
            properties: {
                data: {
                    type: "object", multiple: false
                },
                dependantControlID: {
                    /**
                     * Pass custom IDs to stop applying variant before controller initialization
                     * @since 1.88
                     */
                    type: "string[]", multiple: false, defaultValue: []
                }
            },
            events: {
                /**
				 * The event is triggered when custom variant data is set to update gantt chart with table
                 * @private
				 * @since 1.88
				 */
                setDataComplete: {}
            }
        },
        setData: function (oCustomData) {
            this.setProperty("data", oCustomData);
            this.fireSetDataComplete();
        },
        apply: function() {
        },
        revert: function() {
        }
    });

    return CustomVariantHandler;
});