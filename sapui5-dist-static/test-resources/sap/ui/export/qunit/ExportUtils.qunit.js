sap.ui.define([
	'sap/ui/export/library',
	'sap/ui/core/Core',
	'sap/ui/export/ExportUtils',
	'sap/ui/qunit/QUnitUtils',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (library, Core, ExportUtils, QUnitUtils, MockServer, ODataModel, Filter, FilterOperator) {
	'use strict';

	var EdmType = library.EdmType;

	/* global QUnit */

	/* Create mock server */
	var sPath = sap.ui.require.toUrl('sap/ui/export/mock');

	/* Default config for export settings */
	var oDefaultConfig = {
		fileName: 'Standard',
		fileType: [
			{
				key: 'xlsx',
				text: 'Microsoft Excel Workbook (*.xlsx)'
			}
		],
		selectedFileType: 'xlsx',
		splitCells: false,
		includeFilterSettings: false,
		addDateTime: false
	};

	var oMockServer = new MockServer({
		rootUri: './localService/'
	});

	oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');

	QUnit.module('ExportUtils', {
		beforeEach: function() {
			oMockServer.start();
		},
		afterEach: function () {
			oMockServer.stop();
		}
	});

	QUnit.test('interceptUrl', function (assert) {
		var sUrl1 = 'http://www.sap.com';
		var sUrl2 = 'http://www.sap.de';

		var done = assert.async();

		assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when no Interceptservice available');

		var oFakeInterceptService = {
			getInstance: function() {return null;}
		};
		sap.ui.define(ExportUtils._INTERCEPTSERVICE, [], function() {
			return oFakeInterceptService;
		});

		sap.ui.require([ExportUtils._INTERCEPTSERVICE], function() {

			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when Interceptservice has no instance');

			oFakeInterceptService.getInstance = function() {return oFakeInterceptService;};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl1, 'No Interception done when Interceptservice has no interceptUrl function');

			oFakeInterceptService.interceptUrl = function(sUrl) {
				return sUrl2;
			};
			assert.strictEqual(ExportUtils.interceptUrl(sUrl1), sUrl2, 'Interception done when Interceptservice has interceptUrl function');

			done();

		});

	});

	QUnit.test('getExportSettingsViaDialog - with default configuration', function(assert) {
		var done = assert.async();

		ExportUtils.getExportSettingsViaDialog(null, null, function(oExportSettingsDialog) {

			assert.ok(oExportSettingsDialog.isOpen(), 'Export Settings Dialog is open');

			var oExportButton = oExportSettingsDialog.getBeginButton();
			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
		}).then(function(oUserConfig) {
			assert.deepEqual(oUserConfig, oDefaultConfig, 'Promise returned with default export config data');
			done();
		});
	});

	QUnit.test('getExportSettingsViaDialog - with custom configuration', function(assert) {
		var done = assert.async();

		var oCustomConfig = {
			fileName: 'Products',
			addDateTime: true
		};

		ExportUtils.getExportSettingsViaDialog(oCustomConfig, null, function(oExportSettingsDialog) {
			var oModelData = oExportSettingsDialog.getModel().getData();
			var oExportButton = oExportSettingsDialog.getBeginButton();

			assert.equal(oModelData.fileName, 'Products', 'Custom config for file name applied to the export settings dialog');
			assert.ok(oModelData.addDateTime, 'Add date time config applied to export settings dialog');

			oExportButton.firePress();
			assert.ok(oExportSettingsDialog._bSuccess, 'Export triggered');
		}).then(function(oUserConfig) {
			assert.notDeepEqual(oUserConfig, oDefaultConfig, 'Default config is overwritten with custom config');
			done();
		});
	});

	QUnit.test('getExportSettingsViaDialog - for file name input validation', function(assert) {
		var done = assert.async();

		ExportUtils.getExportSettingsViaDialog(null, null, function(oExportSettingsDialog) {
			var sLongFileName = 'This is a very very very very very very very very very very long file name, which exceed 100 characters';
			var oInput = Core.byId(oExportSettingsDialog.getId() + '-fileName');
			var oExportButton = oExportSettingsDialog.getBeginButton();
			var oCancelButton = oExportSettingsDialog.getEndButton();
			var $oInput = oInput.$('inner');

			oInput.focus();
			// input validation for invalid file name
			$oInput.trigger("focus").val('Products?').trigger('input');

			assert.equal(oInput.getValueState(), 'Error', 'Invalid character found');
			assert.ok(!oExportButton.getEnabled(), 'Export button disabled as there is invalid user input');

			// input validation for very long file name which is over 100 characters
			$oInput.trigger("focus").val(sLongFileName).trigger('input');
			assert.ok(oExportButton.getEnabled(), 'Export button is enabled, but warning message is also show to the user');
			assert.equal(oInput.getValueState(), 'Warning', 'Warning text show to user for long file name');

			oCancelButton.firePress();
		}).catch(function(oResolve) {
			assert.notOk(oResolve, 'No settings are provided when dialog was canceled');

			done();
		});
	});

	QUnit.test('parseFilterConfiguration', function (assert) {
		var done = assert.async();

		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		var filterArray = [
			new Filter({
				path: 'Currency',
				operator: FilterOperator.EQ,
				value1: 'EUR'
			}),
			new Filter({
				path: 'Active',
				operator: FilterOperator.EQ,
				value1: true
			}),
			new Filter({
				path: 'Salary',
				operator: FilterOperator.BT,
				value1: 5000,
				value2: 10000
			}),
			new Filter({
				path: 'Firstname',
				operator: FilterOperator.NotStartsWith,
				value1: 'A'
			})
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length == filterArray.length, 'The amount of parsed entries is equal to the amount of filter settings');
			filterArray.forEach(function(oFilter, nIndex) {
				assert.ok(result.items.some(function(oEntry) {
					return oEntry.key === oFilter.sPath
						&& oEntry.value.indexOf(oFilter.oValue1 || oFilter.oValue2) > -1;
				}), 'Filter no. ' + (nIndex + 1) + ' is contained in the result');
			});

			done();
		});
	});

	QUnit.test('parseFilterConfiguration for exclude multi-filter', function (assert) {
		var done = assert.async();
		var sKey = 'Currency';
		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		var filterArray = [
			new Filter([
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: ''
				}),
				new Filter({
					path: sKey,
					operator: FilterOperator.NE,
					value1: 'USD'
				})
			], true)
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: filterArray,
			and: true
		}));

		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length != filterArray.length, 'The amount of parsed entries may not always be equal to the amount of filter settings');
			assert.ok(result.items.length === 2);
			assert.equal(result.items[0].key, sKey);
			assert.ok(result.items[0].value.indexOf('!=') > -1);
			assert.equal(result.items[1].key, sKey);
			assert.ok(result.items[1].value.indexOf('!=') > -1);
			done();
		});
	});

	QUnit.test('parseFilterConfiguration without filters', function(assert) {
		var done = assert.async();
		var oModel = new ODataModel('./localService', true);
		var oListBinding = oModel.bindList('/Users');

		// Still works for ListBinding without filters
		ExportUtils.parseFilterConfiguration(oListBinding).then(function(result) {
			assert.ok(result.items.length == 0, 'No exception when binding has no filters');
			done();
		});
	});

	QUnit.test('parseFilterConfiguration with column label callback', function(assert) {
		var fnDone, oModel, oListBinding, fnResolveColumnLabel, oFilterArray;

		fnDone = assert.async();
		oModel = new ODataModel('./localService', true);
		oListBinding = oModel.bindList('/Users');
		fnResolveColumnLabel = function(sProperty) {
			return sProperty + 'Label';
		};

		oFilterArray = [
			new Filter({
				path: 'Currency',
				operator: FilterOperator.EQ,
				value1: 'EUR'
			}),
			new Filter({
				path: 'Active',
				operator: FilterOperator.EQ,
				value1: true
			}),
			new Filter({
				path: 'Salary',
				operator: FilterOperator.BT,
				value1: 5000,
				value2: 10000
			}),
			new Filter({
				path: 'Firstname',
				operator: FilterOperator.NotStartsWith,
				value1: 'A'
			})
		];

		/* Apply the filters on the binding */
		oListBinding.filter(new Filter({
			filters: oFilterArray,
			and: true
		}));


		ExportUtils.parseFilterConfiguration(oListBinding, fnResolveColumnLabel).then(function(result) {
			oFilterArray.forEach(function(oFilter, nIndex) {

				assert.ok(result.items.some(function(oEntry) {
					return oEntry.key === fnResolveColumnLabel(oFilter.sPath);
				}), 'Column label of Filter no. ' + (nIndex + 1) + ' is contained in the result');
			});

			fnDone();
		});
	});

	QUnit.test('Check for cloud service if unavailable', function(assert) {
		var done = assert.async();

		ExportUtils.getCloudExportService().catch(function() {
			assert.ok(true, 'The promise was rejected');

			done();
		});
	});

	QUnit.test('Check for targets if cloud service is unavailable', function(assert) {
		var done = assert.async();

		/* Replace sap.ushell.Container#getService implementation to simulate that the service is not available */
		sap.ushell = {
			Container: {
				getServiceAsync: function(sName) {
					return Promise.reject();
				}
			}
		};

		ExportUtils.getAvailableCloudExportTargets().then(function(targets) {
			assert.ok(targets instanceof Array, 'Targets are provided as Array');
			assert.equal(targets.length, 0, 'The Array is empty');

			done();
		}).catch(function(error) {
			assert.ok(false, 'The catch clause should never be executed.');
			done();
		});
	});

	QUnit.test('Retrieve cloud export service and targets', function(assert) {
		var fakeService, done = assert.async();

		fakeService = {
			getSupportedTargets: function() {
				return [{
					target: 'GoogleSheets',
					name: 'Google Sheets',
					description: 'GSuite Sheets Application'
				}, {
					target: 'ExcelOnline',
					name: 'Excel Online',
					description: 'Microsoft Office 365 Excel'
				}];
			}
		};

		/* Register a fake shell container - sap.ui.define is not possible (only once per file) */
		sap.ushell = {
			Container: {
				getServiceAsync: function(sName) {
					return sName === 'ProductivityIntegration' ? Promise.resolve(fakeService) : Promise.reject();
				}
			}
		};

		assert.ok(sap.ushell.Container, 'The global instance of sap.ushell.Container is available');
		assert.ok(sap.ushell.Container.getServiceAsync, 'Function getServiceAsync is available');

		ExportUtils.getAvailableCloudExportTargets().then(function(value) {
			assert.ok(value instanceof Array, 'Targets are provided as Array');
			assert.ok(value.length > 0, 'The Array length is greater 0');

			done();
		});
	});

	QUnit.test('_validateProperty', function(assert) {
		var sPropertyName = 'test';
		var oContext = {};
		var sDefaultValue = 'abc';

		oContext[sPropertyName] = true;
		ExportUtils._validateProperty(oContext, sPropertyName, 'boolean');
		assert.ok(oContext[sPropertyName], 'Value was accepted');

		ExportUtils._validateProperty(oContext, sPropertyName, 'string');
		assert.notOk(oContext[sPropertyName], 'Value was rejected');

		oContext[sPropertyName] = sDefaultValue;
		ExportUtils._validateProperty(oContext, sPropertyName, 'string');
		assert.ok(oContext[sPropertyName], 'Value was accepted');

		ExportUtils._validateProperty(oContext, sPropertyName, 'number');
		assert.notOk(oContext[sPropertyName], 'Value was rejected');

		oContext[sPropertyName] = true;
		ExportUtils._validateProperty(oContext, sPropertyName, 'string', sDefaultValue);
		assert.ok(oContext[sPropertyName] !== true, 'Value was discarded');
		assert.ok(oContext[sPropertyName], 'Value assigned');
		assert.ok(oContext[sPropertyName] === sDefaultValue, 'Default value assigned');
	});

	QUnit.test('_validateString', function(assert) {
		var sPropertyName = 'test';
		var oContext = {};
		var sDefaultValue = 'abc123';
		var iMaxLength;

		oContext[sPropertyName] = 1; // Invalid value
		ExportUtils._validateString(oContext, sPropertyName, sDefaultValue);
		assert.ok(oContext[sPropertyName] !== 1, 'Value was discarded');
		assert.ok(oContext[sPropertyName], 'Value assigned');
		assert.ok(oContext[sPropertyName] === sDefaultValue, 'Default value assigned');

		// Check max length validation
		oContext[sPropertyName] = sDefaultValue;
		iMaxLength = oContext[sPropertyName].length - 1;
		ExportUtils._validateString(oContext, sPropertyName, sDefaultValue, iMaxLength);
		assert.ok(oContext[sPropertyName] !== sDefaultValue, 'Value was adjusted');
		assert.ok(oContext[sPropertyName], 'Value assigned');
		assert.ok(oContext[sPropertyName].length === iMaxLength, 'Value was truncated');
	});

	QUnit.test('_validateWorkbook', function(assert) {
		var oWorkbook, iLength, sInitialType;

		oWorkbook = null;
		assert.throws(function() {
			ExportUtils._validateWorkbook(oWorkbook);
		}, 'Throws error in case of invalid configuration');

		oWorkbook = { columns: null };
		assert.throws(function() {
			ExportUtils._validateWorkbook(oWorkbook);
		}, 'Throws error in case of invalid configuration');

		/* Validate incorrect definition */
		oWorkbook = {
			columns: [
				{
					type: 'String',
					property: 'SampleText',
					label: 'Text Column',
					template: '{0}'
				}
			],
			context: {
				application: 'QUnit Test',
				version: '1.0',
				sheetName: 'Datasheet'
			}
		};
		iLength = oWorkbook.columns.length;
		assert.ok(oWorkbook.columns[0].template, 'Template is present prior to validation');

		ExportUtils._validateWorkbook(oWorkbook);
		assert.ok(oWorkbook.columns, 'Columns still present');
		assert.equal(oWorkbook.columns.length, iLength, 'Amount of columns not changed');
		assert.notOk(oWorkbook.columns[0].template, 'Template has been removed');

		/* Validate Array of properties with type different than "String" */
		oWorkbook = {
			columns: [
				{
					type: 'Date',
					property: ['SampleID', 'SampleText'],
					label: 'Text Column',
					inputFormat: 'YYYYMMDD'
				}
			]
		};

		sInitialType = oWorkbook.columns[0].type;
		assert.ok(Array.isArray(oWorkbook.columns[0].property), 'Column uses Array of properties');
		assert.notEqual(oWorkbook.columns[0].type, 'String', 'Column is not of type String');

		ExportUtils._validateWorkbook(oWorkbook);
		assert.notOk(Array.isArray(oWorkbook.columns[0].property), 'Array of properties has been replaced');
		assert.ok(oWorkbook.columns[0].property && typeof oWorkbook.columns[0].property === 'string', 'Replaced by single property string');
		assert.equal(oWorkbook.columns[0].type, sInitialType, 'Column type not changed');
	});

	QUnit.test('_validateDataSource', function(assert) {
		var oDataSource;

		assert.throws(function() {
			ExportUtils._validateDataSource(null);
		}, 'Throws error in case of invalid configuration');

		assert.throws(function() {
			ExportUtils._validateDataSource(true);
		}, 'Throws error in case of invalid configuration');

		assert.throws(function() {
			ExportUtils._validateDataSource({
				type: 'odata',
				dataUrl: null
			});
		}, 'Throws error in case of invalid configuration');

		assert.ok(ExportUtils._validateDataSource({
			type: 'odata',
			dataUrl: '/some/random/path',
			serviceUrl: '/some',
			sizeLimit: 500,
			count: 1000,
			useBatch: true
		}) === undefined, 'Valid dataSource accepted');

		oDataSource = {
			type: 'odata',
			dataUrl: '/some/random/path',
			serviceUrl: '/some',
			sizeLimit: 250.5,
			count: 1000.123,
			useBatch: true
		};
		ExportUtils._validateDataSource(oDataSource);
		assert.equal(oDataSource.count, null, 'Invalid count is being ignored');
		assert.equal(oDataSource.sizeLimit % 1, 0, 'sizeLimit is an integer value');
	});

	QUnit.test('_validateType', function(assert) {
		var oColumn = {
			type: 'nUmBer',
			property: 'QUnitTest'
		};

		assert.notEqual(oColumn.type, EdmType.Number, 'Case sensitive type mismatch');
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Number, 'Type fixed');

		oColumn = {
			type: 'bOoleAn',
			property: 'QUnitTest'
		};
		assert.notEqual(oColumn.type, EdmType.Boolean, 'Case sensitive type mismatch');
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Boolean, 'Type fixed');

		oColumn = {
			type: 'Booolean',
			property: 'QUnitTest'
		};
		assert.notOk(EdmType[oColumn.type], 'Invalid type');
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.String, 'Default type applied');

		oColumn = {
			type: 'pErcEntaGe',
			property: 'QUnitTest'
		};
		assert.notEqual(oColumn.type, EdmType.Percentage, 'Case sensitive type mismatch');
		ExportUtils._validateType(oColumn);
		assert.equal(oColumn.type, EdmType.Percentage, 'Type fixed');
	});

	QUnit.test('_validateScaleCustomizing', function(assert) {
		var oCustomizing = {
			currency: {
				EUR: { digits: 2},
				USD: 2,
				DEFAULT: { scale: 1 }
			},
			unit: [
				{ kg: 3 }
			]
		};

		assert.notOk(Array.isArray(oCustomizing.currency), 'Customizing defined as object');
		assert.ok(typeof oCustomizing.currency.EUR !== 'undefined', 'Currency EUR is defined');
		assert.ok(typeof oCustomizing.currency.USD !== 'undefined', 'Currency EUR is defined');

		ExportUtils._validateScaleCustomizing(oCustomizing, 'currency');

		assert.ok(oCustomizing.currency instanceof Object, 'Customizing defined as Object');
		assert.ok(typeof oCustomizing.currency.EUR === 'undefined', 'Currency EUR has been removed');
		assert.ok(typeof oCustomizing.currency.USD === 'undefined', 'Currency EUR has been removed');


		assert.ok(Array.isArray(oCustomizing.unit), 'Customizing defined as Array');

		ExportUtils._validateScaleCustomizing(oCustomizing, 'unit');

		assert.notOk(Array.isArray(oCustomizing.unit), 'Customizing is not an Array anymore');
	});
});
