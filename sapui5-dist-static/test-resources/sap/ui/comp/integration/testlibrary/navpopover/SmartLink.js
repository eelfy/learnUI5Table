/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/comp/integration/testlibrary/navpopover/SmartLinkActions",
	"sap/ui/comp/integration/testlibrary/navpopover/SmartLinkAssertions"
], function (Opa5, SmartLinkActions, SmartLinkAssertions) {
	"use strict";

	Opa5.extendConfig({
		testLibBase: {
			compTestLibrary: {
				actions: SmartLinkActions,
				assertions: SmartLinkAssertions
			}
		}
	});
});
