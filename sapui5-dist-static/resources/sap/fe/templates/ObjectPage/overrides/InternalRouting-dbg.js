sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/navigation/SelectionVariant"], function(CommonUtils, SelectionVariant) {
	"use strict";
	return {
		onBeforeBinding: function(oContext, mParameters) {
			this.getView()
				.getController()
				._onBeforeBinding(oContext, mParameters);
		},
		onAfterBinding: function(oContext, mParameters) {
			this.getView()
				.getController()
				._onAfterBinding(oContext, mParameters);
		}
	};
});
