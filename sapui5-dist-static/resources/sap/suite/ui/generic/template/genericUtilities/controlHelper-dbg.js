sap.ui.define([], function() {
		"use strict";

	var oCore = sap.ui.getCore();

	function isControlOfType(sPathToType, oControl){
		var FNClass = sap.ui.require(sPathToType);
        return typeof FNClass === "function" && (oControl instanceof FNClass);
	}

	function focusControl(sControlId) {
		var oTarget = sControlId && sap.ui.getCore().byId(sControlId);
		if (oTarget) {
			oTarget.focus();
		}
	}
	
	// If oChild is identified to be invisible, null is returned. Otherwise its parent is returned.
	// If the parent does not exist a faulty value is returned.
	// This is a heuristic method.
	function getParentOfVisibleElement(oChild){
		if (oChild.getVisible && !oChild.getVisible()){
			return null;
		}
		return oChild.getParent() || oChild.oContainer; // For Components the navigation to the parent is not done by the getParent() method, but by the oContainer property.
	}

	// This method checks whether sElementId identifies an element which is visible and placed on this view.
	function isElementVisibleOnView(sElementId, oView){
		var bRet = false;
		for (var oElement = oView.getVisible() && oCore.byId(sElementId); oElement && !bRet; oElement = getParentOfVisibleElement(oElement)) {
			bRet = oElement === oView;
		}
		return bRet;
	}

	return {
		isSmartTable:      			isControlOfType.bind(null, "sap/ui/comp/smarttable/SmartTable"),
		isSmartChart:      			isControlOfType.bind(null, "sap/ui/comp/smartchart/SmartChart"),
		isUiTable:         			isControlOfType.bind(null, "sap/ui/table/Table"),
		isAnalyticalTable: 			isControlOfType.bind(null, "sap/ui/table/AnalyticalTable"),
		isTreeTable:       			isControlOfType.bind(null, "sap/ui/table/TreeTable"),
		isMTable:          			isControlOfType.bind(null, "sap/m/Table"),
		isSemanticObjectController: isControlOfType.bind(null, "sap/ui/comp/navpopover/SemanticObjectController"),
		focusControl: focusControl,
		isElementVisibleOnView: isElementVisibleOnView
	};
});
