sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, ODataModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.FiltersSorting.SmartFilterBar", {

		_smartFilterBar: null,

		onInit: function () {
			var oModel = new ODataModel("/MockDataService", true);
			this.getView().setModel(oModel);

		},

		toggleUpdateMode: function () {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._smartFilterBar.setLiveMode(!bLiveMode);
		},

		_setButtonText: function () {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}
		},
		onBeforeRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");
			var oComboBox = oSmtFilter.getControlByKey("CustomFilterField");
			var aCountKeys = oComboBox.getSelectedKeys();
			var newFilter = new Filter("Count", FilterOperator.EQ, aCountKeys);
			if (aCountKeys.length > 0) {
				mBindingParams.filters.push(newFilter);
			}
		}
	});
});