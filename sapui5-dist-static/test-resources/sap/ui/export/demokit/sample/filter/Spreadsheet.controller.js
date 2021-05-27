sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/ui/export/ExportUtils',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MockServer, exportLibrary, Spreadsheet, ExportUtils, ODataModel) {
	'use strict';

	var EdmType = exportLibrary.EdmType;

	return Controller.extend('sap.ui.export.sample.filter.Spreadsheet', {

		onInit: function() {
			var oModel, oView;

			this._sServiceUrl = './localService';

			this._oMockServer = new MockServer({
				rootUri: this._sServiceUrl + "/"
			});

			var sPath = sap.ui.require.toUrl('sap/ui/export/sample/localService');
			this._oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');
			this._oMockServer.start();

			oModel = new ODataModel(this._sServiceUrl);

			oView = this.getView();
			oView.setModel(oModel);
		},

		createColumnConfig: function() {
			var aCols = [];

			aCols.push({
				label: 'Full name',
				property: ['Lastname', 'Firstname'],
				type: EdmType.String,
				template: '{0}, {1}'
			});

			aCols.push({
				label: 'ID',
				type: EdmType.Number,
				property: 'UserID',
				scale: 0
			});

			aCols.push({
				property: 'Firstname',
				type: EdmType.String
			});

			aCols.push({
				property: 'Lastname',
				type: EdmType.String
			});

			aCols.push({
				property: 'Birthdate',
				type: EdmType.Date
			});

			aCols.push({
				property: 'Salary',
				type: EdmType.Number,
				scale: 2,
				delimiter: true
			});

			aCols.push({
				property: 'Currency',
				type: EdmType.String
			});

			aCols.push({
				property: 'Active',
				type: EdmType.Boolean,
				trueValue: 'YES',
				falseValue: 'NO'
			});

			return aCols;
		},

		onExport: function() {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('exportTable');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: {
					columns: aCols,
					context: {
						metaSheetName: 'Export settings',
						metainfo: []
					}
				},
				dataSource: oRowBinding,
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			/* Parses the filter information from the binding and adds the result to the export settings */
			oSettings.workbook.context.metainfo.push(ExportUtils.parseFilterConfiguration(oRowBinding));

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		},

		onExit: function() {
			this._oMockServer.stop();
		}
	});
});
