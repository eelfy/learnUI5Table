import { APIClass, EventHandler, Event, Property, Association } from "sap/fe/core/helpers/ClassSupport";
import MacroAPI from "./MacroAPI";
import { Input, CheckBox } from "sap/m";
import { Field as mdcField } from "sap/ui/mdc";
import { FieldWrapper } from "sap/fe/core/controls";
import { Control } from "sap/ui/core";
import { UI5Event } from "global";

/**
 * Macro for creating a Field based on the metadata provided by OData V4.
 * <br>
 * Usually, a DataField or DataPoint annotation is expected, but the macro Field can also be used to display a property from the entity type.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:Field id="MyField" metaPath="MyProperty" /&gt;
 * </pre>
 *
 * @alias sap.fe.macros.Field
 * @public
 */
@APIClass("sap.fe.macros.FieldAPI")
class FieldAPI extends MacroAPI {
	/**
	 * An expression that allows you to control the editable state of the field.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine if the page is currently editable.
	 * Please note that you cannot set a field to editable if it has been defined in the annotation as not editable.
	 *
	 * @private
	 * @deprecated
	 */
	@Property({ type: "boolean" })
	editable!: boolean;

	/**
	 * An expression that allows you to control the read-only state of the field.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
	 *
	 * @public
	 */
	@Property({ type: "boolean" })
	readOnly!: boolean;

	/**
	 * The identifier of the Field control.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	id!: string;

	/**
	 * An event containing details is triggered when the value of the field is changed.
	 *
	 * @public
	 */
	@Event
	change!: Function;

	@Association({ type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" })
	ariaLabelledBy!: Control;

	@Property({ type: "boolean" })
	required!: boolean;

	@EventHandler
	handleChange(oEvent: UI5Event) {
		(this as any).fireChange({ value: this.getValue(), isValid: oEvent.getParameter("valid") });
	}

	onBeforeRendering() {
		const oContent = (this as any).getContent();
		if (oContent && oContent.addAriaLabelledBy) {
			const aAriaLabelledBy = (this as any).getAriaLabelledBy();

			for (let i = 0; i < aAriaLabelledBy.length; i++) {
				const sId = aAriaLabelledBy[i];
				const aAriaLabelledBys = oContent.getAriaLabelledBy() || [];
				if (aAriaLabelledBys.indexOf(sId) === -1) {
					oContent.addAriaLabelledBy(sId);
				}
			}
		}
	}

	enhanceAccessibilityState(_oElement: object, mAriaProps: object): object {
		const oParent = this.getParent();

		if (oParent && (oParent as any).enhanceAccessibilityState) {
			// use FieldWrapper as control, but aria properties of rendered inner control.
			(oParent as any).enhanceAccessibilityState(this, mAriaProps);
		}

		return mAriaProps;
	}

	/**
	 * Retrieves the current value of the Field.
	 *
	 * @public
	 * @returns the current value of the field
	 */
	getValue(): boolean | string {
		let oControl = this.content,
			aControls;

		if (oControl.isA("sap.fe.core.controls.FieldWrapper")) {
			aControls = (oControl as FieldWrapper).getContentEdit() || [(oControl as FieldWrapper).getContentDisplay()] || [];
			if (aControls.length === 1) {
				oControl = aControls[0];
			} else {
				throw "getting value not yet implemented for this field type";
			}
		}

		if (oControl.isA("sap.m.CheckBox")) {
			return (oControl as CheckBox).getSelected();
		} else if (oControl.isA("sap.m.Input")) {
			return (oControl as Input).getValue();
		} else if (oControl.isA("sap.ui.mdc.Field")) {
			return (oControl as mdcField).getValue();
		} else {
			throw "getting value not yet implemented for this field type";
		}
	}

	// we need to expose a state corresponding to the real editable state of the field so that when a FormElement tries
	// to see if it needs to set a required mark on the Label we actually check whether the field is required
	getEditable(): boolean {
		const oControl = this.content;
		return (oControl as FieldWrapper)?.getEditMode() !== "Display";
	}
}

export default FieldAPI;
