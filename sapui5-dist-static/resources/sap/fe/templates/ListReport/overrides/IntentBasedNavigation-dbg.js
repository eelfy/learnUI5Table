sap.ui.define(["sap/fe/core/CommonUtils"], function(CommonUtils) {
	"use strict";
	return {
		adaptNavigationContext: function(oSelectionVariant) {
			// Adding filter bar values to the navigation does not make sense if no context has been selected.
			// Hence only consider filter bar values when SelectionVaraint is not empty
			if (!oSelectionVariant.isEmpty()) {
				var oView = this.getView();
				var oFilterBarConditions = Object.assign({}, this.base.getView().getController().filterBarConditions);
				var oInternalModelContext = oView.getBindingContext("internal");
				var mTabs = oInternalModelContext.getProperty("tabs");
				// Do we need to exclude Fields (mutli tables mode)?
				if (mTabs) {
					var aIgnoredFieldsForTab = mTabs.ignoredFields[mTabs.selected];
					if (Array.isArray(aIgnoredFieldsForTab) && aIgnoredFieldsForTab.length > 0) {
						aIgnoredFieldsForTab.forEach(function(sProperty) {
							delete oFilterBarConditions[sProperty];
						});
					}
				}
				// TODO: move this also into the intent based navigation controller extension
				CommonUtils.addExternalStateFiltersToSelectionVariant(oSelectionVariant, oFilterBarConditions);
			}
		},
		getEntitySet: function() {
			return this.base.getCurrentEntitySet();
		}
	};
});
