/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

import { MacroMetadata } from "sap/fe/macros";
import { Log } from "sap/base";
import { ifElse, equal, resolveBindingString, compileBinding } from "sap/fe/core/helpers/BindingExpression";

/**
 * @classdesc
 * Content of a field
 *
 * @class sap.fe.macros.Field
 * @hideconstructor
 * @private
 * @ui5-restricted
 * @experimental
 */
const Field = MacroMetadata.extend("sap.fe.macros.Field", {
	/**
	 * Name
	 */
	name: "Field",
	/**
	 * Namespace
	 */
	namespace: "sap.fe.macros",
	/**
	 * Fragment source
	 */
	fragment: "sap.fe.macros.Field",

	/**
	 * Metadata
	 */
	metadata: {
		/**
		 * Define macro stereotype for documentation purpose
		 */
		stereotype: "xmlmacro",
		/**
		 * Properties.
		 */
		properties: {
			/**
			 * Meta Path to the field
			 * Could be either an absolute path or relative to the context path
			 */
			metaPath: {
				type: "sap.ui.model.Context",
				required: true
			},
			/**
			 * Context path of the field
			 */
			contextPath: {
				type: "sap.ui.model.Context",
				required: true
			},
			/**
			 * Field ID
			 */
			id: {
				type: "string",
				required: true
			},
			/**
			 * Edit Mode
			 */
			editable: {
				type: "boolean",
				deprecated: true,
				required: false
			},
			/**
			 * Read Only
			 */
			readOnly: {
				type: "boolean",
				required: false
			}
		},
		events: {
			/**
			 * Event handler for change event TODO: we need to wrap this, just PoC version
			 */
			change: {
				type: "function"
			}
		}
	},
	create: function(oProps: any) {
		if (oProps.editable !== undefined) {
			// Deprecated message
			Log.error("`editable` property has been deprecated in favor of `readOnly`");
			oProps.editModeExpression = compileBinding(
				ifElse(equal(resolveBindingString(oProps.editable, "boolean"), true), "Editable", "Display")
			);
		} else {
			oProps.editModeExpression = undefined;
		}
		if (oProps.readOnly !== undefined) {
			oProps.editModeExpression = compileBinding(
				ifElse(equal(resolveBindingString(oProps.readOnly, "boolean"), true), "Display", "Editable")
			);
		} else {
			oProps.editModeExpression = undefined;
		}

		return oProps;
	}
});

export default Field;
