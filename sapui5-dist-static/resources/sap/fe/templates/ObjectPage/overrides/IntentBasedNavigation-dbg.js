sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/navigation/SelectionVariant"], function(CommonUtils, SelectionVariant) {
	"use strict";
	return {
		adaptNavigationContext: function(oSelectionVariant) {
			var oView = this.getView(),
				oInternalModelContext = this.getView().getBindingContext("internal"),
				oExternalNavigationContext = oInternalModelContext.getProperty("externalNavigationContext");
			if (oExternalNavigationContext.page) {
				var oPageContext = oView.getBindingContext(),
					oPageContextData = oPageContext.getObject(),
					// TODO: move this also into the intent based navigation controller extension
					oPageSV = CommonUtils.addPageContextToSelectionVariant(new SelectionVariant(), oPageContextData, oView);

				var aSelectOptionPropertyNames = oPageSV.getSelectOptionsPropertyNames();
				aSelectOptionPropertyNames.forEach(function(sPropertyName) {
					if (!oSelectionVariant.getSelectOption(sPropertyName)) {
						oSelectionVariant.massAddSelectOption(sPropertyName, oPageSV.getSelectOption(sPropertyName));
					}
				});
			}
			oInternalModelContext.setProperty("externalNavigationContext", { "page": true });
		}
	};
});
