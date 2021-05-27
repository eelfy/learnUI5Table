/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/fl/changeHandler/BaseRename"], function(BaseRename) {
	"use strict";

	return {
		"stashControl": "default",
		"unstashControl": "default",
		"renameHeaderFacet": BaseRename.createRenameChangeHandler({
			propertyName: "title",
			translationTextType: "XFLD",
			changePropertyName: "headerFacetTitle"
		})
	};
});
