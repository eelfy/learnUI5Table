sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/SearchField'
], function(Controller, ODataModel, SearchField) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.FiscalDates.SmartFilterBar", {

		onInit: function() {
			this.getView().setModel(new ODataModel("/MockDataService", true));
			this._smartFilterBar = this.getView().byId("smartFilterBar");
		},

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode"),
				bLiveMode;

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			bLiveMode = this._smartFilterBar.getLiveMode();
			oButton.setText(bLiveMode ? "Change to 'LiveMode'" : "Change to 'ManualMode'");

			this._smartFilterBar.setLiveMode(!bLiveMode);
		},

		_setButtonText: function() {
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

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		}
	});
});