sap.ui.define("STTA_SO_ND.ext.controller.ListReportExt", [
], function () {
	"use strict";
	 function getRandomNumber() {
		 var arr = new Uint32Array( 1 ), limit = Math.pow( 2, 32 );
		 var crypto = window.crypto || window.msCrypto;
		 return crypto.getRandomValues( arr )[ 0 ] / limit;
	};

	return {
		onClickActionNavigatioButton: function (oEvent) {
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container
				&& sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "SalesOrder",
					action: "MultiViews"
				},
				params: {
					mode: 'create'
				}
			});
		},
		onRandomOppID: function (oEvent) {
			var oModel,
				aSelectedContexts = this.extensionAPI.getSelectedContexts();
			for (var i = 0; i < aSelectedContexts.length; i++) {
				oModel = aSelectedContexts[i].getModel();
				oModel.setProperty(aSelectedContexts[i].sPath + "/OpportunityID", (Math.floor(getRandomNumber() * 10000)).toString());
			}
			this.extensionAPI.refreshTable();
		}
	};
});
