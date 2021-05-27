sap.ui.define([], function() {
	"use strict";

	return {
		setCreationMode: function(bCreationMode) {
			var oUIModelContext = this.base.getView().getBindingContext("ui");
			oUIModelContext.getModel().setProperty("createMode", bCreationMode, oUIModelContext, true);
			if (this.getProgrammingModel() === "Sticky") {
				oUIModelContext.getModel().setProperty("createModeSticky", this._oTransactionHelper._bCreateMode, oUIModelContext, true);
			}
		}
	};
});
