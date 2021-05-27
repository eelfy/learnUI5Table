/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/controls/Common/Form",
		"sap/fe/core/TemplateModel",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/core/converters/MetaModelConverter"
	],
	function(MacroMetadata, ConverterContext, FormConverter, TemplateModel, AnnotationHelper, MetaModelConverter) {
		"use strict";

		/**
		 * @classdesc
		 * Macro for creating a Form based on provided OData v4 metadata.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:Form
		 *  id="SomeID"
		 *  entitySet="{entitySet>}"
		 *  facet="{facet>}"
		 *  formTitle="someTitle"
		 *  useFormContainerLabels="true"
		 *  partOfPreview="true"
		 *  onChange=".handlers.onFieldValueChange"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.Form
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var Form = MacroMetadata.extend("sap.fe.macros.Form", {
			/**
			 * Name of the macro control.
			 */
			name: "Form",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.Form",

			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Define macro stereotype for documentation purpose
				 */
				stereotype: "xmlmacro",
				/**
				 * Location of the designtime info
				 */
				designtime: "sap/fe/macros/Form.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * mandatory context to the EntitySet // ~ contextPath
					 */
					entitySet: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["NavigationProperty", "EntitySet"]
					},
					/**
					 * Metadata path to the facet // ~ metaPath
					 */
					facet: {
						type: "sap.ui.model.Context",
						$Type: ["com.sap.vocabularies.UI.v1.CollectionFacet", "com.sap.vocabularies.UI.v1.ReferenceFacet"]
					},
					/**
					 * Source of the facet
					 */
					facetSource: {
						type: "string"
					},
					/**
					 * ID of the form
					 */
					id: {
						type: "string"
					},
					/**
					 * Title of the form
					 */
					formTitle: {
						type: "string"
					},
					/**
					 * Control whether the form is in displayMOde or not.
					 */
					displayMode: {
						type: "boolean"
					},
					/**
					 * Control the rendering of the form container labels
					 */
					useFormContainerLabels: {
						type: "string"
					},
					/**
					 * Toggle Preview: Part of Preview / Preview via 'Show More' Button
					 */
					partOfPreview: {
						type: "boolean",
						defaultValue: true
					},
					/**
					 * GroupId to be used for valueHelp requests
					 */
					valueHelpRequestGroupId: {
						type: "string"
					},
					/**
					 * The manifest defined form containers to be shown in the action area of the table
					 */
					formContainers: {
						type: "sap.ui.model.Context"
					}
				},
				events: {
					/**
					 * Change handler name
					 */
					onChange: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				if (oProps.facet && oProps.entitySet && (oProps.formContainers === undefined || oProps.formContainers === null)) {
					var aFormContainers;
					// TODO: Standalone usage of form macro
					var oMetaModel = oProps.entitySet.getModel();
					// the curious case of entity set for quick view forms
					if (oProps.facet.getPath().indexOf("@com.sap.vocabularies.UI.v1.QuickViewFacets") > -1) {
						var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.facet, oProps.entitySet);
						var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.entitySet, mSettings);
						var oFacetDefinition = oContextObjectPath.targetObject;
						/*
						 * To get quickview links working as they create macro forms
						 */
						// TODO have a generic function for getting form containers from facet - collection or reference
						aFormContainers = [FormConverter.getFormContainer(oFacetDefinition, oConverterContext)];
						oProps.formContainers = new TemplateModel(aFormContainers, oMetaModel).createBindingContext("/");
					}
				}
				return oProps;
			}
		});

		return Form;
	}
);
