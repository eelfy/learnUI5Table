// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define( function() {
	"use strict";

	return {
		name: "TestSuite for sap.ushell",
		defaults: {
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				libs: ["sap.ui.core", "sap.m", "sap.ushell"]
			},
			page: "test-resources/sap/ushell/qunit/teststarter.qunit.html?test={name}",
			autostart: true,
			bootCore: true

		},
		tests: {
			"../test/ui/ShellHeader": {
				title: "sap.ushell.ShellHeader",
				coverage: {
					branchTracking: false
				}
			}
		}
	};
});
