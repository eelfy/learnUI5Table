// This class contains behaviour information about the ALP floorplan which can be used by the framework even before an instance of the ALP has been created

sap.ui.define(["sap/ui/core/mvc/XMLView"], function(XMLView){
	"use strict";

	var oPlaceholderInfo = {
		getPlaceholderPage: function(sViewId){
			return XMLView.create({
				viewName: "sap.fe.placeholder.view.PlaceholderLR" // Currently requesting LR placeholder until ALP specific one is created.
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
