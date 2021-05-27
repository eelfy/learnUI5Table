sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/m/MessageToast'
], function(Controller, JSONModel, exportLibrary, Spreadsheet, MessageToast) {
	'use strict';

	var EdmType = exportLibrary.EdmType;

	return Controller.extend('sap.ui.export.sample.json.Spreadsheet', {

		onInit: function() {
			var oModel = new JSONModel(sap.ui.require.toUrl('sap/ui/export/sample/localService/mockdata/Users.json'));
			this.getView().setModel(oModel);
		},

		createColumnConfig: function() {
			return [
				{
					label: 'User ID',
					property: 'UserID',
					type: EdmType.Number,
					scale: 0
				},
				{
					label: 'Firstname',
					property: 'Firstname',
					width: '25'
				},
				{
					label: 'Lastname',
					property: 'Lastname',
					width: '25'
				},
				{
					label: 'Salary',
					property: 'Salary',
					type: EdmType.Currency,
					unitProperty: 'Currency',
					width: '18'
				},
				{
					label: 'Active',
					property: 'Active',
					type: EdmType.String
				}];
		},

		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel().getProperty('/');

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('Spreadsheet export has finished');
				})
				.finally(oSheet.destroy);
		}
	});
});
