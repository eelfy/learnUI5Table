sap.ui.define([
	'sap/ui/core/Core',
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/ui/model/odata/v2/ODataModel'
], function(Core, Controller, MockServer, exportLibrary, Spreadsheet, ODataModel) {
	'use strict';

	var EdmType = exportLibrary.EdmType;

	return Controller.extend('sap.ui.export.sample.customizing.Spreadsheet', {

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

			Core.getConfiguration().getFormatSettings().addCustomCurrencies({
				EUR: {'digits': 3},
				CNY: {'digits': 0},
				JPY: {'digits': 2},
				ILS: {'digits': 1},
				RUB: {'digits': 4},
				USD: {'digits': 1}
			});

			/* Fake service specific unit of measure code list due to MockServer */
			oModel.getMetaModel().requestUnitsOfMeasure = function() {
				return Promise.resolve({
					'kg': {"StandardCode" : "KGM", "Text" : "Kilogram", "UnitSpecificScale" : 3}
				});
			};
		},

		createColumnConfig: function() {
			var aCols = [];

			/* 1. Add a simple text column */
			aCols.push({
				label: 'Text',
				type: EdmType.String,
				property: 'SampleString',
				width: 20,
				wrap: true
			});

			/* 2. Add Number column with fixed scale */
			aCols.push({
				label: 'Number (fixed)',
				type: EdmType.Number,
				property: 'SampleDecimal',
				scale: 2,
				unit: 'kg'
			});

			/* 3. Add Number column with autoScale */
			aCols.push({
				label: 'Number (dynamic)',
				type: EdmType.Number,
				property: 'SampleDecimal',
				autoScale: true,
				scale: 2,
				unit: 'kg'
			});

			/* 3. Add a simple Currency column */
			aCols.push({
				label: 'Currency',
				type: EdmType.Currency,
				property: 'SampleDecimal',
				unitProperty: 'SampleCurrency',
				displayUnit: true,
				width: 20
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
				workbook: { columns: aCols },
				dataSource: oRowBinding,
				fileName: 'Customizing Demokit sample.xlsx',
				worker: false // We need to disable worker because we are using a Mockserver as OData Service
			};

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
