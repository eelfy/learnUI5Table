sap.ui.define(["sap/fe/core/library"], function(CoreLibrary) {
	"use strict";

	var VariantManagement = CoreLibrary.VariantManagement;

	return {
		adaptStateControls: function(aStateControls) {
			var oView = this.getView(),
				oController = oView.getController(),
				oViewData = oView.getViewData(),
				bControlVM = false;

			switch (oViewData.variantManagement) {
				case VariantManagement.Control:
					bControlVM = true;
					break;
				case VariantManagement.Page:
				case VariantManagement.None:
					break;
				default:
					throw new Error("unhandled variant setting: " + oViewData.getVariantManagement());
			}

			oController._findTables().forEach(function(oTable) {
				if (bControlVM) {
					aStateControls.push(oTable.getVariant());
				}
				if (oTable.getQuickFilter()) {
					aStateControls.push(oTable.getQuickFilter().getSelector());
				}
			});

			aStateControls.push(oView.byId("fe::ObjectPage"));
		}
	};
});
