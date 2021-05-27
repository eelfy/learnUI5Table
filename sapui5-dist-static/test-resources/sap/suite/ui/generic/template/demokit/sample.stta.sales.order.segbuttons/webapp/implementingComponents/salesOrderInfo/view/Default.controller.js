sap.ui.controller("ManageSalesOrderWithSegButtons.implementingComponents.salesOrderInfo.view.Default", {

	onInit: function() {
		var oComponent = this.getOwnerComponent();
		var oComponentModel = oComponent.getComponentModel();
		oComponentModel.setProperty("/View", this.getView());
	}
});