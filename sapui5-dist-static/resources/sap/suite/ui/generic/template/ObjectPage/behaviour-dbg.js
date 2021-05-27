// This class contains behaviour information about the OP floorplan which can be used by the framework even before an instance of the OP has been created

sap.ui.define(["sap/ui/core/mvc/XMLView"], function(XMLView){
	"use strict";

	var oPlaceholderInfo = {
		getPlaceholderPage: function(sViewId){
			return XMLView.create({ 
				viewName: "sap.fe.placeholder.view.PlaceholderOP"
			});
		}
	};
	
	function getPlaceholderInfo(){
		return oPlaceholderInfo;
	}

	return {
		getPlaceholderInfo: getPlaceholderInfo
	};
});
