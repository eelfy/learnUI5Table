/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/converters/templates/ListReportConverter",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/TemplateModel",
		"sap/fe/core/converters/templates/BaseConverter",
		"sap/fe/core/helpers/ModelHelper",
		"sap/base/util/merge",
		"sap/base/Log"
	],
	function(
		MacroMetadata,
		ListReportConverter,
		ConverterContext,
		MetaModelConverter,
		TemplateModel,
		BaseConverter,
		ModelHelper,
		merge,
		Log
	) {
		"use strict";

		/**
		 * /**
		 * @classdesc
		 * Macro for creating a FilterBar based on the metadata provided by OData V4.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:FilterBar
		 *   id="SomeID"
		 *   entitySet="{entitySet>}"
		 *   hideBasicSearch="false"
		 *   showAdaptFiltersButton="true"
		 *   p13nMode=["Item","Value"]
		 *   listBindingNames = "sap.fe.tableBinding"
		 *   liveMode="true"
		 *   search=".handlers.onSearch"
		 *   filtersChanged=".handlers.onFiltersChanged"
		 * /&gt;
		 * </pre>
		 *
		 * Macro for creating a FilterBar based on provided OData v4 metadata.
		 * @class sap.fe.macros.FilterBar
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var FilterBar = MacroMetadata.extend("sap.fe.macros.FilterBar", {
			/**
			 * Name of the macro control.
			 */
			name: "FilterBar",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.FilterBar",

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
				designtime: "sap/fe/macros/FilterBar.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * ID of the FilterBar
					 */
					id: {
						type: "string"
					},
					/**
					 * ID of the assigned variant management
					 */
					variantBackreference: {
						type: "string"
					},
					/**
					 * Mandatory context to the EntitySet
					 */
					entityType: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "EntityType"
					},
					/**
					 * Don't show the basic search field
					 */
					hideBasicSearch: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Enables the fallback to show all fields of the EntityType as filter fields if com.sap.vocabularies.UI.v1.SelectionFields are not present
					 */
					enableFallback: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Handles visibility of the 'Adapt Filters' button on the FilterBar
					 */
					showAdaptFiltersButton: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Specifies the personalization options for the filter bar.
					 */
					p13nMode: {
						type: "sap.ui.mdc.FilterBarP13nMode[]"
					},

					/**
					 * Specifies the Sematic Date Range option for the filter bar.
					 */
					useSemanticDateRange: {
						type: "boolean",
						defaultValue: true
					},

					/**
					 * If set the search will be automatically triggered, when a filter value was changed.
					 */
					liveMode: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Temporary workaround only
					 * path to valuelist
					 **/
					_valueList: {
						type: "sap.ui.model.Context",
						required: false
					},
					/**
					 * selectionFields to be displayed
					 **/
					selectionFields: {
						type: "sap.ui.model.Context",
						required: false
					},
					/**
					 * Filter conditions to be applied to the filter bar
					 **/
					filterConditions: {
						type: "string",
						required: false
					},
					/**
					 * GroupId for ValueHelp table requests
					 */
					valueHelpRequestGroupId: {
						type: "string"
					},
					/**
					 * If set to <code>true</code>, all search requests are ignored. Once it has been set to <code>false</code>,
					 * a search is triggered immediately if one or more search requests have been triggered in the meantime
					 * but were ignored based on the setting.
					 */
					suspendSelection: {
						type: "boolean",
						defaultValue: false
					},
					showDraftEditState: {
						type: "boolean"
					}
				},
				events: {
					/**
					 * Search handler name
					 */
					search: {
						type: "function"
					},
					/**
					 * Filters changed handler name
					 */
					filtersChanged: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				var oEntityTypeContext = oProps.entityType;
				if (!oEntityTypeContext) {
					Log.error("EntityType not available for FilterBar Macro.");
					return;
				}

				var oMetaModel = oEntityTypeContext.getModel();
				if (!oProps.selectionFields) {
					var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oEntityTypeContext);
					var oConverterContext = this.getConverterContext(oVisualizationObjectPath, undefined, mSettings);

					var oSelectionFields = ListReportConverter.getSelectionFields(oConverterContext);
					oProps.selectionFields = new TemplateModel(oSelectionFields, oMetaModel).createBindingContext("/");
				}

				var sEntityTypePath = oEntityTypeContext.getPath();
				var sEntitySetPath = ModelHelper.getEntitySetPath(sEntityTypePath);

				// TODO: this could be also moved into a central place
				if (
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot") ||
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode")
				) {
					oProps.showDraftEditState = true;
				}

				return oProps;
			}
		});

		return FilterBar;
	}
);
