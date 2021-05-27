sap.ui.define(["sap/ui/core/mvc/Controller"], function(mvcController) {
	"use strict";

	return mvcController.extend("sap.suite.ui.generic.template.lib.TemplateHost", {
		
		isPlaceholderShown: function(mPlaceholdersShown){
			return !!mPlaceholdersShown[this.sRouteName];

		},
		
		setRouteName: function(sRouteName){
			this.sRouteName = sRouteName;
		}
	});
}, /* bExport= */true);