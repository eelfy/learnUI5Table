/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of library sap.fe.core
 */
sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/base/DataType",
		"sap/fe/core/services/TemplatedViewServiceFactory",
		"sap/fe/core/services/ResourceModelServiceFactory",
		"sap/fe/core/services/CacheHandlerServiceFactory",
		"sap/fe/core/services/NavigationServiceFactory",
		"sap/fe/core/services/RoutingServiceFactory",
		"sap/fe/core/services/ShellServicesFactory",
		"sap/fe/core/services/AsyncComponentServiceFactory",
		"sap/fe/core/services/EnvironmentServiceFactory",
		"sap/ui/core/service/ServiceFactoryRegistry",
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore()
		"sap/ui/core/library", // library dependency
		"sap/fe/navigation/library", // library dependency
		"sap/fe/placeholder/library", // library dependency
		"sap/ui/fl/library", // library dependency
		"sap/ui/mdc/library", // library dependency,
		"sap/fe/core/formatters/ValueFormatter", // global formatter
		"sap/fe/core/formatters/FPMFormatter", // global formatter
		"sap/fe/core/type/Email" // global type
	],
	function(
		Log,
		DataType,
		TemplatedViewServiceFactory,
		ResourceModelServiceFactory,
		CacheHandlerServiceFactory,
		NavigationService,
		RoutingServiceFactory,
		ShellServicesFactory,
		AsyncComponentServiceFactory,
		EnvironmentServiceFactory,
		ServiceFactoryRegistry
		// AppStateService
	) {
		"use strict";

		/**
		 * Root namespace for all the SAP Fiori elements-related libraries.
		 *
		 * @namespace
		 * @name sap.fe
		 * @public
		 */

		/**
		 * Library providing the core functionality of the runtime for SAP Fiori Elements for OData V4.
		 *
		 * @namespace
		 * @name sap.fe.core
		 * @public
		 */

		/**
		 * Collection of controller extensions used internally in SAP Fiori Elements exposing a method that you can override to allow more flexibility.
		 *
		 * @namespace
		 * @name sap.fe.core.controllerextensions
		 * @public
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.actions
		 * @private
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.model
		 * @private
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.navigation
		 * @private
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe.core",
			dependencies: ["sap.ui.core", "sap.fe.navigation", "sap.fe.placeholder", "sap.ui.fl", "sap.ui.mdc"],
			types: ["sap.fe.core.CreationMode", "sap.fe.core.VariantManagement"],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.88.0",
			noLibraryCSS: true,
			extensions: {
				//Configuration used for rule loading of Support Assistant
				"sap.ui.support": {
					publicRules: true,
					internalRules: true
				}
			}
		});

		/**
		 * Available values for creation mode.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.CreationMode = {
			/**
			 * New Page.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			NewPage: "NewPage",
			/**
			 * Sync.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Sync: "Sync",
			/**
			 * Async.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Async: "Async",
			/**
			 * Deferred.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Deferred: "Deferred",
			/**
			 * Inline.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Inline: "Inline",
			/**
			 * Creation row.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			CreationRow: "CreationRow",
			/**
			 * External (by outbound navigation).
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			External: "External"
		};
		/**
		 * Available values for Variant Management.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.VariantManagement = {
			/**
			 * No variant management at all.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			None: "None",

			/**
			 * One variant configuration for the whole page.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Page: "Page",

			/**
			 * Variant management on control level.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Control: "Control"
		};
		/**
		 * Available constants.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.Constants = {
			/**
			 * Indicates cancelling of an action dialog.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			CancelActionDialog: "cancel"
		};
		/**
		 * Available values for programming model.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.ProgrammingModel = {
			/**
			 * Draft.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Draft: "Draft",
			/**
			 * Sticky.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Sticky: "Sticky",
			/**
			 * NonDraft.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			NonDraft: "NonDraft"
		};

		/**
		 * Available values for draft status.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.DraftStatus = {
			/**
			 * Saving.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Saving: "Saving",
			/**
			 * Saved.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Saved: "Saved",
			/**
			 * Clear.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Clear: "Clear"
		};

		/**
		 * Edit mode values.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.EditMode = {
			/**
			 * View is currently displaying only.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Display: "Display",
			/**
			 * View is currently editable.
			 *
			 * @constant
			 * @type {string}
			 * @public
			 */
			Editable: "Editable"
		};

		/**
		 * Template views.
		 *
		 * @readonly
		 * @enum {string}
		 * @private
		 */
		sap.fe.core.TemplateContentView = {
			/**
			 * Hybrid.
			 * @constant
			 * @type {string}
			 */
			Hybrid: "Hybrid",
			/**
			 * Chart.
			 * @constant
			 * @type {string}
			 */
			Chart: "Chart",
			/**
			 * Table.
			 * @constant
			 * @type {string}
			 */
			Table: "Table"
		};

		/**
		 * Possible initial load (first app startup) modes for a ListReport.
		 *
		 * @enum {string}
		 * @name sap.fe.core.InitialLoadMode
		 * @readonly
		 * @public
		 * @since 1.86.0
		 */
		var InitialLoadMode = (sap.fe.core.InitialLoadMode = {
			/**
			 * Data will be loaded initially.
			 *
			 * @public
			 */
			Enabled: "Enabled",

			/**
			 * Data will not be loaded initially.
			 *
			 * @public
			 */
			Disabled: "Disabled",

			/**
			 * Data will be loaded initially if filters are set.
			 *
			 * @public
			 */
			Auto: "Auto"
		});

		// explicit type to handle backward compatibility with boolean values
		var InitialLoadType = DataType.createType("sap.fe.core.InitialLoadMode", {
			defaultValue: InitialLoadMode.Auto,
			isValid: function(vValue) {
				if (typeof vValue === "boolean") {
					Log.warning(
						"DEPRECATED: boolean value not allowed for 'initialLoad' manifest setting - supported values are: Disabled|Enabled|Auto"
					);
				}
				return vValue === undefined || vValue === null || typeof vValue === "boolean" || InitialLoadMode.hasOwnProperty(vValue);
			}
		});

		// normalize a value, taking care of boolean type
		InitialLoadType.setNormalizer(function(vValue) {
			if (!vValue) {
				// undefined, null or false
				return InitialLoadMode.Disabled;
			}
			return vValue === true ? InitialLoadMode.Enabled : vValue;
		});

		ServiceFactoryRegistry.register("sap.fe.core.services.TemplatedViewService", new TemplatedViewServiceFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.ResourceModelService", new ResourceModelServiceFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.CacheHandlerService", new CacheHandlerServiceFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.NavigationService", new NavigationService());
		ServiceFactoryRegistry.register("sap.fe.core.services.RoutingService", new RoutingServiceFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.ShellServices", new ShellServicesFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.EnvironmentService", new EnvironmentServiceFactory());
		ServiceFactoryRegistry.register("sap.fe.core.services.AsyncComponentService", new AsyncComponentServiceFactory());

		return sap.fe.core;
	}
);
