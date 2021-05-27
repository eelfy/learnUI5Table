sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer'
], function(Controller, ODataModel, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableShowDetails.SmartTable", {
		onInit: function() {
			var oModel, oView;
			var oMockServer = new MockServer({
				rootUri: "sapuicompsmarttableshowdetails/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
			oMockServer.start();
			oModel = new ODataModel("sapuicompsmarttableshowdetails", {
				defaultCountMode: "Inline"
			});
			oView = this.getView();
			oView.setModel(oModel);
		},

		onSliderMoved: function(oEvent) {
			var iValue = oEvent.getParameter("value");
			var oTable = this.byId("idSmartTable").getTable();

			if (iValue === 0) {
				oTable.setContextualWidth("Phone");
			} else if (iValue === 1) {
				oTable.setContextualWidth("Tablet");
			} else if (iValue === 2) {
				oTable.setContextualWidth("auto");
			}
		},

		onBeforeExport: function(oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onExit: function() {
			this._oMockServer.stop();
		}
	});
});
