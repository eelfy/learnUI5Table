/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
/**
 * Adds support rules of the sap.fe.core library to the support infrastructure.
 */
sap.ui.define(
	[
		"./support/AnnotationIssue.support",
		"./support/CollectionFacetMissingID.support",
		"./support/CollectionFacetUnsupportedLevel.support"
	],
	function(AnnotationIssue, CollectionFacetMissingID, CollectionFacetUnsupportedLevel) {
		"use strict";

		sap.ui.support.SystemPresets.FeV4 = {
			id: "FioriElementsV4",
			title: "Fiori Elements V4",
			description: "Fiori Elements V4 rules",
			selections: [{ ruleId: "annotationIssue", libName: "sap.fe.core" }]
		};

		return {
			name: "sap.fe.core",
			niceName: "SAP.FE V4 - Core library",
			ruleset: [AnnotationIssue.getRules(), CollectionFacetMissingID.getRules(), CollectionFacetUnsupportedLevel.getRules()]
		};
	},
	true
);
