sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";

	return Control.extend("sap.fe.core.controls.ConditionalWrapper", {
		metadata: {
			interfaces: ["sap.ui.core.IFormContent"],
			properties: {
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: null
				},
				formDoNotAdjustWidth: {
					type: "boolean",
					defaultValue: false
				},
				condition: {
					type: "boolean",
					defaultValue: false
				}
			},
			associations: {
				/**
				 * Association to controls / IDs that label this control (see WAI-ARIA attribute aria-labelledby).
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			defaultAggregation: "contentTrue",
			aggregations: {
				contentTrue: { type: "sap.ui.core.Control", multiple: false },
				contentFalse: { type: "sap.ui.core.Control", multiple: false }
			}
		},
		enhanceAccessibilityState: function(oElement, mAriaProps) {
			var oParent = this.getParent();

			if (oParent && oParent.enhanceAccessibilityState) {
				oParent.enhanceAccessibilityState(this, mAriaProps);
			}

			return mAriaProps;
		},
		_setAriaLabelledBy: function(oContent) {
			if (oContent && oContent.addAriaLabelledBy) {
				var aAriaLabelledBy = this.getAriaLabelledBy();

				for (var i = 0; i < aAriaLabelledBy.length; i++) {
					var sId = aAriaLabelledBy[i];
					var aAriaLabelledBys = oContent.getAriaLabelledBy() || [];
					if (aAriaLabelledBys.indexOf(sId) === -1) {
						oContent.addAriaLabelledBy(sId);
					}
				}
			}
		},
		onBeforeRendering: function() {
			// before calling the renderer of the ConditionalWrapper parent control may have set ariaLabelledBy
			// we ensure it is passed to its inner controls
			this._setAriaLabelledBy(this.getContentTrue());
			this._setAriaLabelledBy(this.getContentFalse());
		},
		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
				oRm.openStart("div", oControl);
				oRm.style("width", oControl.getWidth());
				oRm.style("display", "inline-block");
				oRm.openEnd();
				if (oControl.getCondition()) {
					oRm.renderControl(oControl.getContentTrue());
				} else {
					oRm.renderControl(oControl.getContentFalse());
				}
				oRm.close("div"); // end of the complete Control
			}
		}
	});
});
