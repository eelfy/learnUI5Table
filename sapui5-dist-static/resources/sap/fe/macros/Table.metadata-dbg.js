/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/templating/DataModelPathHelper",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/controls/Common/DataVisualization"
	],
	function(MacroMetadata, DataModelPathHelper, ConverterContext, MetaModelConverter, DataVisualization) {
		"use strict";

		/**
		 * @classdesc
		 * Macro for creating a Table based on provided OData v4 metadata.
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:Table
		 *   id="someID"
		 *   tableType="ResponsiveTable"
		 *   collection="collection",
		 *   presentation="presentation"
		 *   selectionMode="Multi"
		 *   requestGroupId="$auto.test"
		 *   displayMode="false"
		 *   p13nMode="Column,Sort"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.Table
		 * @hideconstructor
		 * @private
		 * @experimental
		 */

		var Table = MacroMetadata.extend("sap.fe.macros.Table", {
			/**
			 * Name of the macro control.
			 */
			name: "Table",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros.internal",
			publicNamespace: "sap.fe.macros",
			publicName: "Table",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.Table",
			/**
			 * The metadata describing the macro control.
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
					tableDefinition: {
						type: "sap.ui.model.Context"
					},
					metaPath: {
						type: "sap.ui.model.Context",
						isPublic: true
					},
					contextPath: {
						type: "sap.ui.model.Context",
						isPublic: true
					},

					/**
					 * metadataContext:collection mandatory context to a collection (entitySet or 1:n navigation)
					 */
					collection: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["EntitySet", "NavigationProperty"]
					},
					/**
					 * Parent EntitySet for the present collection
					 */
					parentEntitySet: {
						type: "sap.ui.model.Context"
					},

					/**
					 * Id of the table
					 */
					id: {
						type: "string",
						isPublic: true
					},
					/**
					 * List binding information for mdc.Table (ui5object: true is needed to prevent this property being used as a binding). If not specified it is created from the metadata information
					 *
					 */
					rowsBindingInfo: {
						type: "object"
					},
					/**
					 * For binding the table to a navigation path. So only the path is used for rows binding.
					 */
					navigationPath: {
						type: "string"
					},
					/**
					 * Edit mode of the table / fields (Display,Editable,ReadOnly,Disabled) / Default: Display
					 */
					displayMode: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Specifies whether the button is hidden when no data has been entered yet in the row (true/false) / Default: false
					 */
					disableAddRowButtonForEmptyData: {
						type: "boolean"
					},
					/**
					 * Specifies whether the table is displayed with condensed layout (true/false) / Default: false
					 */
					useCondensedTableLayout: {
						type: "boolean"
					},
					/**
					 * Specifies the possible actions available on the table row (Navigation,null) / Default: null
					 */
					rowAction: {
						type: "string",
						defaultValue: null
					},
					/**
					 * Specifies the selection mode (None,Single,Multi,Auto)
					 */
					selectionMode: {
						type: "string"
					},

					/**
					 * The busy mode of table
					 */
					busy: {
						type: "string"
					},
					/**
					 * Parameter which helps to show the fullScreen button on the table
					 */
					showFullScreen: {
						type: "boolean"
					},
					/**
					 * Parameter which helps to not show the delete button on the table in display mode
					 * in object page.(Default value: false)
					 */
					showDelete: {
						type: "boolean"
					},
					/**
					 * Display Table Title (mdc Header)
					 */
					headerVisible: {
						type: "boolean"
					},
					/**
					 * Parameter which sets the noDataText for the mdc table
					 */
					noDataText: {
						type: "string"
					},
					/**
					 * Creation Mode to be passed to the onCreate hanlder. Values: ["Inline", "NewPage"]
					 */
					creationMode: {
						type: "string"
					},
					/**
					 * Setting to determine if the new row should be created at the end or beginning
					 */
					createAtEnd: {
						type: "boolean"
					},
					createOutbound: {
						type: "string"
					},
					createOutboundDetail: {
						type: "string"
					},
					createNewAction: {
						type: "string"
					},
					/**
					 * Personalisation Mode
					 */
					p13nMode: {
						type: "array"
					},
					/**
					 * Table Type: ResponsiveTable, Table
					 */
					tableType: {
						type: "string"
					},
					/**
					 * Enable export to file
					 */
					enableExport: {
						type: "boolean"
					},
					/**
					 * Number of indices which can be selected in a range. If set to 0, the selection limit is disabled, and the Select All checkbox appears instead of the Deselect All button.
					 */
					selectionLimit: {
						type: "string"
					},
					/**
					 * Table filter Interface: Defines the filter interface used to filter rows of the table.
					 */
					filterBarId: {
						type: "string"
					},

					/**
					 * Settings for behaviour when creating new entries
					 */
					create: {
						type: "sap.ui.model.Context"
					},

					tableDelegate: {
						type: "string"
					},
					enableAutoScroll: {
						type: "boolean"
					},
					visible: {
						type: "string"
					},
					isAlp: {
						type: "boolean",
						defaultValue: false
					}
				},
				events: {
					variantSaved: {
						type: "function"
					},
					variantSelected: {
						type: "function"
					},
					/**
					 * Event handler for change event
					 */
					onChange: {
						type: "function"
					},
					/**
					 * Event handler to react on row press
					 */
					rowPress: {
						type: "function"
					},
					/**
					 * Event handler to react on dataReceived event of table.
					 */
					onDataReceived: {
						type: "function"
					},
					/**
					 * Event handler to react on dataReceived event of table.
					 */
					onContextChange: {
						type: "function"
					},

					/**
					 * Event handler to react on patchSent event of table.
					 * @experimental
					 */
					onPatchSent: {
						type: "function"
					},
					/**
					 * Event handler to react on patchCompleted event of table.
					 * @experimental
					 */
					onPatchCompleted: {
						type: "function"
					},
					/**
					 * Event handler to react on beforeExport event of the table
					 */
					onBeforeExport: {
						type: "function"
					},
					/**
					 * Event handler called when the user presses the segmented button in the ALP View
					 */
					onSegmentedButtonPressed: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				var oTableDefinition;
				var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);

				if (oProps.tableDefinition === undefined || oProps.tableDefinition === null) {
					var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings);
					var sVisualizationPath = DataModelPathHelper.getContextRelativeTargetObjectPath(oContextObjectPath);

					var oVisualizationDefinition = DataVisualization.getDataVisualizationConfiguration(
						sVisualizationPath,
						oProps.useCondensedLayout,
						oConverterContext
					);
					oTableDefinition = oVisualizationDefinition.visualizations[0];

					oProps.tableDefinition = this.createBindingContext(oTableDefinition, mSettings);
				} else {
					oTableDefinition = oProps.tableDefinition.getObject();
				}
				oTableDefinition.path = oProps.tableDefinition.getPath();
				// API Properties
				this.setDefaultValue(oProps, "showFullScreen", oTableDefinition.control.enableFullScreen);
				this.setDefaultValue(oProps, "useCondensedTableLayout", oTableDefinition.control.useCondensedTableLayout);
				this.setDefaultValue(oProps, "disableAddRowButtonForEmptyData", oTableDefinition.control.disableAddRowButtonForEmptyData);
				this.setDefaultValue(oProps, "enableExport", oTableDefinition.control.enableExport);
				this.setDefaultValue(oProps, "headerVisible", oTableDefinition.control.headerVisible);
				this.setDefaultValue(oProps, "selectionLimit", oTableDefinition.control.selectionLimit);
				this.setDefaultValue(oProps, "tableType", oTableDefinition.control.type);
				this.setDefaultValue(oProps, "id", oTableDefinition.annotation.id);
				this.setDefaultValue(oProps, "selectionMode", oTableDefinition.annotation.selectionMode);
				this.setDefaultValue(oProps, "creationMode", oTableDefinition.annotation.create.mode);
				this.setDefaultValue(oProps, "createAtEnd", oTableDefinition.annotation.create.append);
				this.setDefaultValue(oProps, "createOutbound", oTableDefinition.annotation.create.outbound);
				this.setDefaultValue(oProps, "createNewAction", oTableDefinition.annotation.create.newAction);
				this.setDefaultValue(oProps, "createOutboundDetail", oTableDefinition.annotation.create.outboundDetail);
				this.setDefaultValue(oProps, "displayMode", oTableDefinition.annotation.displayMode);
				this.setDefaultValue(oProps, "showDelete", oTableDefinition.annotation.show.delete);
				this.setDefaultValue(oProps, "p13nMode", oTableDefinition.annotation.p13nMode);

				// Internal properties
				oProps.pasteEnabled = oTableDefinition.annotation.show.paste;
				oProps.showCreate = oTableDefinition.annotation.show.create || true;
				oProps.autoBindOnInit = oTableDefinition.annotation.autoBindOnInit;
				oProps.rowAction = oTableDefinition.annotation.row.action;
				oProps.rowPress = oTableDefinition.annotation.row.press;

				// Internal that needs to be changed
				oProps.enableControlVM = oTableDefinition.annotation.enableControlVM;
				// Internal that I want to remove in the end
				oProps.parentEntityDeleteEnabled = oTableDefinition.annotation.parentEntityDeleteEnabled;
				oProps.navigationPath = oTableDefinition.annotation.navigationPath;
				oProps.parentEntitySet = mSettings.models.metaModel.createBindingContext(
					"/" +
						(oContextObjectPath.contextLocation.targetEntitySet
							? oContextObjectPath.contextLocation.targetEntitySet.name
							: oContextObjectPath.startingEntitySet.name)
				);
				oProps.collection = mSettings.models.metaModel.createBindingContext(oTableDefinition.annotation.collection);
				// Regarding the remaining ones that I think we could review
				// noDataText -> We probably have a default here
				// busy -> hmmm could make sense as a centrally available functionality instead
				// selectedContextsModel -> potentially hardcoded or internal only
				// onPatchSent // onPatchCompleted -> Could also be standard editFlow behavior
				// onDataReceived -> MessageHandling
				// onContextChange -> Autoscroll ... might need revision
				// onChange -> Just proxied down to the Field may need to see if needed or not
				// variantSelected / variantSaved -> Variant Management standard helpers ?
				// onPaste / onPasteButtonPressed -> Actually could be handled internally + editFlow calls ?
				// tableDelegate  -> used externally for ALP ... might need to see if relevant still
				// onSegmentedButtonPressed -> ALP specific, should be a dedicated control for the contentViewSwitcher
				// visible -> related to this ALP contentViewSwitcher... maybe an outer control would make more sense ?

				return oProps;
			}
		});
		return Table;
	}
);
