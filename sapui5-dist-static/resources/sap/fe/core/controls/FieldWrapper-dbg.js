sap.ui.define(["sap/ui/core/Control", "sap/ui/base/ManagedObjectObserver"], function(Control, ManagedObjectObserver) {
	"use strict";

	return Control.extend("sap.fe.core.controls.FieldWrapper", {
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
				editMode: {
					type: "string",
					defaultValue: "Display"
				},
				/**
				 * Property that if it equals to "" will show a an hyphen as a placeholder for the field.
				 */
				emptyIndicatorTrigger: {
					type: "string",
					defaultValue: ""
				},
				required: {
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
			defaultAggregation: "contentDisplay",
			aggregations: {
				contentDisplay: { type: "sap.ui.core.Control", multiple: false },
				contentEdit: { type: "sap.ui.core.Control", multiple: true }
			}
		},
		enhanceAccessibilityState: function(oElement, mAriaProps) {
			var oParent = this.getParent();

			if (oParent && oParent.enhanceAccessibilityState) {
				// use FieldWrapper as control, but aria properties of rendered inner control.
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
			// before calling the renderer of the FieldWrapper parent control may have set ariaLabelledBy
			// we ensure it is passed to its inner controls
			this._setAriaLabelledBy(this.getContentDisplay());
			var aContentEdit = this.getContentEdit();
			for (var i = 0; i < aContentEdit.length; i++) {
				this._setAriaLabelledBy(aContentEdit[i]);
			}
		},
		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
				oRm.openStart("div", oControl);
				if (oControl.getEditMode() === "Display") {
					oRm.style("width", oControl.getWidth());
					oRm.style("display", "inline-block");
					oRm.openEnd();
					var oContentDisplayControl = oControl.getContentDisplay();
					// we only check empty trigger if the control doesnt display anything when there is no value
					var aHyphenBlockList = [
						"sap.m.ObjectStatus",
						"sap.m.RatingIndicator",
						"sap.m.ProgressIndicator",
						"sap.fe.core.controls.FormElementWrapper"
					];
					var bCheckEmptyTrigger = aHyphenBlockList.every(function(sBlockControlType) {
						return !oContentDisplayControl.isA(sBlockControlType);
					});
					if (bCheckEmptyTrigger && oContentDisplayControl && !oControl.getEmptyIndicatorTrigger()) {
						var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
						// invisible text for screenreader
						oRm.openStart("span");
						oRm.class("sapUiPseudoInvisibleText");
						oRm.openEnd();
						oRm.text(oResourceBundle.getText("T_FIELDWRAPPER_NO_VALUE"));
						oRm.close("span");

						// element for empty indicator
						oRm.openStart("span");
						oRm.attr("aria-hidden", "true");
						oRm.attr("emptyIndicator", oResourceBundle.getText("T_FIELDWRAPPER_EMPTY_INDICATOR"));
						oRm.class("sapMText");
						oRm.class("sapUiSelectable");
						oRm.class("sapMTextMaxWidth");
						oRm.class("sapUiMdcFieldBaseEmpty");
						oRm.openEnd();
						oRm.close("span");
					}
					oRm.renderControl(oControl.getContentDisplay()); // render the child Control for display
				} else {
					var aContentEdit = oControl.getContentEdit();

					// if (aContentEdit.length > 1) {
					// 	oRm.class("sapUiMdcFieldBaseMoreFields");
					// }
					oRm.style("width", oControl.getWidth());
					oRm.style("display", "inline-block");
					oRm.openEnd();
					for (var i = 0; i < aContentEdit.length; i++) {
						var oContent = aContentEdit[i]; // render the child Control  for edit
						oRm.renderControl(oContent);
					}
				}
				oRm.close("div"); // end of the complete Control
			}
		}
	});
});
