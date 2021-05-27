/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of odata v4 phantom controls
 */
sap.ui.define(
	[
		"sap/ui/core/util/XMLPreprocessor",
		"sap/fe/macros/PhantomUtil",
		"./Chart.metadata",
		"./Field.metadata",
		"./internal/Field.metadata",
		"./FilterField.metadata",
		"./FilterBar.metadata",
		"./Form.metadata",
		"./FormContainer.metadata",
		"./MicroChart.metadata",
		"./Table.metadata",
		"./ValueHelp.metadata",
		"./valuehelp/ValueHelpFilterBar.metadata",
		"./Contact.metadata",
		"./QuickViewForm.metadata",
		"./fpm/InputField.metadata",
		"./DraftIndicator.metadata"
	],
	function(
		XMLPreprocessor,
		PhantomUtil,
		Chart,
		Field,
		InternalField,
		FilterField,
		FilterBar,
		Form,
		FormContainer,
		MicroChart,
		Table,
		ValueHelp,
		ValueHelpFilterBar,
		Contact,
		QuickViewForm,
		InputField,
		DraftIndicator
	) {
		"use strict";

		var sNamespace = "sap.fe.macros",
			aControls = [
				Table,
				Form,
				FormContainer,
				Field,
				InternalField,
				FilterBar,
				FilterField,
				Chart,
				ValueHelp,
				ValueHelpFilterBar,
				MicroChart,
				Contact,
				QuickViewForm,
				InputField,
				DraftIndicator
			].map(function(vEntry) {
				if (typeof vEntry === "string") {
					return {
						name: vEntry,
						namespace: sNamespace,
						metadata: {
							metadataContexts: {},
							properties: {},
							events: {}
						}
					};
				}
				return vEntry;
			});

		function registerAll() {
			// as a first version we expect that there's a fragment with exactly the namespace/name
			aControls.forEach(function(oEntry) {
				PhantomUtil.register(oEntry);
			});
		}

		//This is needed in for templating test utils
		function deregisterAll() {
			aControls.forEach(function(oEntry) {
				XMLPreprocessor.plugIn(null, oEntry.namespace, oEntry.name);
			});
		}

		//Always register when loaded for compatibility
		registerAll();

		return {
			register: registerAll,
			deregister: deregisterAll
		};
	}
);
