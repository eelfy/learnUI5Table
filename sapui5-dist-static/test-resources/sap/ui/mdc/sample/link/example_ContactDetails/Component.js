/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent'
], function(jQuery, UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.link.example_ContactDetails.Component", {
		metadata: {
			rootView: "sap.ui.mdc.sample.link.example_ContactDetails.Test"
		}
	});
});
