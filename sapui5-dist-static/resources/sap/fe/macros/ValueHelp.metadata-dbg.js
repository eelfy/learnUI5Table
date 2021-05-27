/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata", "sap/fe/core/converters/MetaModelConverter"], function(MacroMetadata, MetaModelConverter) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a ValueHelp based on the provided OData V4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:ValueHelp
	 *   idPrefix="SomePrefix"
	 *   property="{someProperty&gt;}"
	 *   conditionModel="$filters"
	 * /&gt;
	 * </pre>
	 *
	 * @class sap.fe.macros.ValueHelp
	 * @hideconstructor
	 * @private
	 * @experimental
	 */
	var ValueHelp = MacroMetadata.extend("sap.fe.macros.ValueHelp", {
		/**
		 * Name of the macro control.
		 */
		name: "ValueHelp",
		/**
		 * Namespace of the macro control.
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name.
		 */
		fragment: "sap.fe.macros.internal.valuehelp.ValueHelp",

		/**
		 * The metadata describing the macro control.
		 */
		metadata: {
			/**
			 * Macro stereotype for documentation generation. Not visible in documentation.
			 */
			stereotype: "xmlmacro",
			/**
			 * Location of the designtime information.
			 */
			designtime: "sap/fe/macros/internal/valuehelp/ValueHelp.designtime",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * A prefix that is added to the generated ID of the value help.
				 */
				idPrefix: {
					type: "string",
					defaultValue: "ValueHelp"
				},
				/**
				 * Defines the metadata path to the property.
				 */
				property: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: "Property"
				},
				/**
				 * Indicator whether the value help is for a filter field.
				 */
				conditionModel: {
					type: "string",
					defaultValue: ""
				},
				/**
				 * Indicates that that this is a value help of a filter field. Necessary to decide if a
				 * validation should occur on the backend or already on the client.
				 */
				filterFieldValueHelp: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Specifies the Sematic Date Range option for the filter field.
				 */
				useSemanticDateRange: {
					type: "boolean",
					defaultValue: true
				},
				/**
				 * GroupId for the valueHelp table
				 */
				requestGroupId: {
					type: "string",
					defaultValue: ""
				},

				navigationPrefix: {
					type: "string"
				}
			},

			events: {}
		},
		create: function(oProps, oControlConfiguration, oAppComponent) {
			var that = this;
			Object.keys(this.metadata.properties).forEach(function(sPropertyName) {
				var oProperty = that.metadata.properties[sPropertyName];
				if (oProperty.type === "boolean") {
					if (typeof oProps[sPropertyName] === "string") {
						oProps[sPropertyName] = oProps[sPropertyName] === "true";
					}
				}
			});
			return oProps;
		}
	});

	return ValueHelp;
});
