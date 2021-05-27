sap.ui.define([],function(){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.navpopover'",
		defaults: {
			group: "NavPopover",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"NavigationPopoverPersonalization": {
				group: "Navpopover"
			},
			"NavigationContainer": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationContainer.js"
				}
			},
			/*
			"ContactDetailsController": {
				group: "Navpopover"
			},
			*/
			"NavigationPopover": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationPopover.js"
				}
			},
			"NavigationPopoverHandler": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/NavigationPopoverHandler.js"
				}
			},
			"NavigationPopoverHandlerBindingContext": {
				group: "Navpopover"
			},
			"NavigationPopoverLog": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/Log.js"
				}
			},
			"NavigationPopoverUtil": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/Util.js"
				}
			},
			"SemanticObjectController": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/SemanticObjectController.js"
				}
			},
			"SmartLink": {
				group: "Navpopover",
				coverage: {
					only: "sap/ui/comp/navpopover/SmartLink.js"
				}
			},
			"LinkContactAnnotation": {
				group: "Navpopover",
				loader: {
					paths: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTestContactAnnotation" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTestContactAnnotation"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTestContactAnnotation/LinkContactAnnotation.qunit.html"
			},
			"SelectionPanel00": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanel00.qunit.html"
			},
			"SelectionPanel01": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanel01.qunit.html"
			},
			"SelectionPanel02": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanel02.qunit.html"
			},
			"SelectionPanelEndUser01": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanelEndUser01.qunit.html"
			},
			"SelectionPanelEndUser02": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanelEndUser02.qunit.html"
			},
			"SelectionPanelEndUser03": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanelEndUser03.qunit.html"
			},
			"SelectionPanelKeyUser": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanelKeyUser.qunit.html"
			},
			"SelectionPanelRestore": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/",
						"applicationUnderTest" : "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest",
						"sap/ui/comp/qunit/personalization/test": "test-resources/sap/ui/comp/qunit/personalization/test"
					}
				},
				page: "test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/SelectionPanelRestore.qunit.html"
			}
			/* Test Fails for unknown reasons. Was excluded for a long time...
			"opaTests/LinkPersonalization.opa": {
				group: "Navpopover"
			},
			*/
		}
	};

	return oUnitTest;
});
