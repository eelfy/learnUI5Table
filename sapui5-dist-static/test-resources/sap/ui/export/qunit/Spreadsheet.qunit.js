/*global QUnit, sinon */
sap.ui.define([
	'sap/ui/core/util/MockServer',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/ui/export/ExportDialog',
	'sap/ui/export/ExportUtils',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/base/Log',
	'sap/ui/thirdparty/sinon-qunit' /* Sinon itself already part of MockServer */
], function (MockServer, exportLibrary, Spreadsheet, ExportDialog, ExportUtils, ODataModel, JSONModel, Log, SinonQUnit) {
	'use strict';

	var EdmType = exportLibrary.EdmType;

	var aCols, fnOnSave, oMockServer, oSpreadsheet, mSettings, mModuleConfig, sPath;

	var sEventId = 'beforeSave';
	ExportUtils.saveAsFile = function(blob, sFilename) {
		Log.info('ExportUtils.saveAsFile called with ' + blob.size + ' bytes of data and filename ' + sFilename);
		return fnOnSave && fnOnSave();
	};

	// create mock server
	sPath = sap.ui.require.toUrl('sap/ui/export/mock');

	oMockServer = new MockServer({
		rootUri: './localService/'
	});

	oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');

	aCols = [
		{ /* 1. Add a simple text column */
			label: 'Text',
			type: 'wrong type',
			property: 'SampleString',
			textAlign: 'wrong value',
			width: '10em'
		},
		{ /* 2. Add a simple Integer column */
			label: 'Integer',
			type: EdmType.Number,
			property: 'SampleInteger',
			scale: 0
		},
		{ /* 3. Add a simple Decimal column */
			label: 'Decimal',
			type: EdmType.Number,
			property: 'SampleDecimal'
		},
		{/* 4. Add a custom Decimal column */
			label: 'Decimal (scale=0)',
			type: EdmType.Number,
			property: 'SampleDecimal',
			scale: 0
		},
		{/* 5. Add a custom Decimal column */
			label: 'Decimal (scale=2)',
			type: EdmType.Number,
			property: 'SampleDecimal',
			scale: '2'
		},
		{/* 6. Add a custom Decimal column */
			label: 'Decimal (delimiter)',
			type: EdmType.Number,
			property: 'SampleDecimal',
			delimiter: true
		},
		{/* 7. Add a simple Date column */
			label: 'Date',
			type: EdmType.Date,
			property: 'SampleDate'
		},
		{/* 8. Add an islamic Date column */
			label: 'Date (calendar=islamic)',
			type: EdmType.Date,
			property: 'SampleDate',
			calendar: 'islamic'
		},
		{/* 8. Add a japanese Date column */
			label: 'Date (calendar=japanese)',
			type: EdmType.Date,
			property: 'SampleDate',
			calendar: 'japanese'
		},
		{/* 9. Add a simple DateTime column */
			label: 'DateTime',
			type: EdmType.DateTime,
			property: 'SampleDate'
		},
		{/* 10. Add a simple Time column */
			label: 'Time',
			type: EdmType.Time,
			property: 'SampleDate'
		},
		{/* 11. Add a custom Date column */
			label: 'Date (format)',
			type: EdmType.Date,
			property: 'SampleDate',
			format: 'dd-mm-yyyy h:mm:ss AM/PM'
		},
		{/* 12. Add a simple Currency column */
			label: 'Currency',
			type: EdmType.Currency,
			property: 'SampleDecimal',
			unitProperty: 'SampleCurrency',
			displayUnit: true
		},
		{/* 13. Add a Currency column without unitProperty */
			label: 'Currency',
			type: EdmType.Currency,
			property: 'SampleDecimal',
			width: '50px'
		}
	];

	mSettings = {
		workbook: { columns: aCols },
		dataSource: {
			type: 'oData',
			dataUrl: './localService/Elements',
			count: 10,
			useBatch: true,
			sizeLimit: 100
		},
		showProgress: true,
		worker: false // We need to disable worker because we are using a Mockserver as OData Service
	};

	mModuleConfig = {
		beforeEach: function() {
			oMockServer.start();
		},
		afterEach: function () {
			fnOnSave = null;
			oMockServer.stop();
		}
	};


	QUnit.module('Integration', mModuleConfig);

	QUnit.test('Successful', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 1, 'onprogress was called several times');
			done();
		});
	});

	QUnit.test('Worker', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.worker = true;
		settings.dataSource.dataUrl = sPath + '/mockdata/Elements.json';

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 1, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('Silent run', function(assert) {
		assert.expect(2);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.showProgress = false;

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created in a silent mode');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('dataSource as String', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.dataSource = settings.dataSource.dataUrl;

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();

		/* Apply a fixed count to avoid warning dialog that causes a test timeout due to missing user interaction */
		oSpreadsheet.attachBeforeExport(function(oEvent) {
			var oSettings = oEvent.getParameter('exportSettings');
			oSettings.dataSource.count = 10;
		});

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.ok(oSpreadsheet.onprogress.callCount > 0, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('dataSource as Array', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var data = oMockServer.getEntitySetData('Elements');

		settings.dataSource = data.slice();

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet was created');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
			assert.equal(oSpreadsheet.onprogress.callCount, 1, 'onprogress was called several times');
		}).finally(done);
	});

	QUnit.test('#processDataSource', function(assert) {
		var done = assert.async();
		var oODataModel = new ODataModel('./localService/');
		var oJsonModel = new JSONModel(sPath + '/mockdata/Elements.json');

		oJsonModel.dataLoaded().then(function() {
			var aWorkingBindings = [
				oODataModel.bindList('/Elements'),
				oODataModel.bindTree('/Elements').applyAdapterInterface(),
				oJsonModel.bindList('/')
			];

			oSpreadsheet = new Spreadsheet({});

			aWorkingBindings.forEach(function(oBinding) {
				var mDataSource = oSpreadsheet.processDataSource(oBinding);

				assert.ok(mDataSource instanceof Object, 'DataSource was processed');
				if (typeof mDataSource === 'object' && mDataSource.data instanceof Array) {
					assert.ok(mDataSource.data.length > 0, 'Data was obtained from client binding');
				} else {
					assert.ok(mDataSource.dataUrl, 'DataSource was converted successfully');
				}
			});

			done();
		});
	});

	QUnit.test('Negative', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.dataSource.dataUrl = './localService/Dummy';

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The negative test did not fail');
		}).catch(function() {
			assert.ok(true, 'The spreadsheet was aborted');
			assert.ok(!fnOnSave.called, 'File was not saved');
			assert.equal(oSpreadsheet.onprogress.callCount, 0, 'onprogress was not called');

			// close the error message dialog
			var dialogElement = document.getElementsByClassName('sapMMessageBoxError')[0];
			var dialog = sap.ui.getCore().byId(dialogElement && dialogElement.id);
			dialog && dialog.close();
		}).finally(done);
	});

	QUnit.test('Do not run in parallel', function(assert) {
		assert.expect(2);
		var doneFirst = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The first run was successful');
			doneFirst();
		});

		/**
		 * Succeeds if first run is already finished and fails if
		 * first run is still pending
		 */
		oSpreadsheet.build().catch(function() {
			assert.ok(true, 'The second run was aborted');
		});
	});

	QUnit.test('Cancel API', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.onprogress = sinon.spy(function(fetched, total){
			var progress = fetched / total * 100;

			if (progress > 0) {
				oSpreadsheet.cancel(); // cancel after 50%
			}
		});

		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The process has finished successfully although it was canceled');
			done();
		}).catch(function() {
			window.setTimeout(function() {
				jQuery('.sapMDialog').each(function() {
					var oDialog = jQuery(this).control(0);
					if (oDialog && oDialog.finish) {
						oDialog.finish();
					}
				});

				assert.ok(true, 'The process has finished');
				assert.ok(fnOnSave.callCount == 0, 'File was not saved');
				assert.equal(oSpreadsheet.onprogress.callCount, 1, 'onprogress was called once');
				done();
			}, 1000);
		});
	});

	QUnit.test('Cancel during JSON export', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var data = oMockServer.getEntitySetData('Elements');

		settings.dataSource = data.slice();

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.onprogress = sinon.spy(function(fetched, total){
			var progress = fetched / total * 100;

			if (progress > 0) {
				oSpreadsheet.cancel(); // cancel after 50%
			}
		});

		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The process has finished successfully although it was canceled');
			done();
		}).catch(function() {
			window.setTimeout(function() {
				jQuery('.sapMDialog').each(function() {
					var oDialog = jQuery(this).control(0);
					if (oDialog && oDialog.finish) {
						oDialog.finish();
					}
				});

				assert.ok(true, 'The process has finished');
				assert.ok(fnOnSave.callCount == 0, 'File was not saved');
				assert.equal(oSpreadsheet.onprogress.callCount, 1, 'onprogress was called once');
				done();
			}, 1000);
		});
	});

	QUnit.test('Cancel if column configuration contains no columns', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		settings.workbook.columns = [];

		oSpreadsheet = new Spreadsheet(settings);

		fnOnSave = sinon.spy();
		oSpreadsheet.onprogress = sinon.spy();

		oSpreadsheet.build().catch(function(sMessage) {
			assert.ok(fnOnSave.callCount == 0, 'File was not saved');
			assert.ok(true, 'The execution was aborted: ' + sMessage);
		}).finally(done);
	});

	QUnit.test('Set default document title and sheet name', function(assert) {
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);

		assert.notOk(settings.workbook.context && (settings.workbook.context.title || settings.workbook.context.sheetName), 'title and sheetName are not predefined');
		oSpreadsheet.setDefaultExportSettings(mSettings).then(function() {
			assert.ok(mSettings.workbook.context.title !== '', 'Default document title is set');
			assert.ok(mSettings.workbook.context.sheetName !== '', 'Default sheet name is set');
		}).finally(done);
	});

	QUnit.test('Auto detect missing document title or sheet name', function(assert) {
		assert.expect(4);
		var done = assert.async(2);
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);

		function testMissingProperty(mSettings, sProperty, bMissing, sTestTitle) {
			assert.strictEqual(!mSettings.workbook.context[sProperty], bMissing,
				sTestTitle + " - The spreadsheet has no '" + sProperty + "' assigned before _setDefaultExportSettings is called: " + bMissing);

			oSpreadsheet.setDefaultExportSettings(mSettings).then(function () {
				assert.ok(mSettings.workbook.context[sProperty] !== '', 'Default ' + sProperty + ' \'' + mSettings.workbook.context[sProperty] + '\' is set');
				done();
			});
		}

		settings.workbook.context = {sheetName: 'New sheet name'};
		testMissingProperty(settings, 'title', true, "Document title is missing");

		settings = jQuery.extend(true, {}, mSettings);
		settings.workbook.context = {title: 'New document title'};
		testMissingProperty(settings, 'sheetName', true, "Sheet name is missing");
	});

	QUnit.module('Events', mModuleConfig);

	QUnit.test('beforeSave - attach event', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			assert.ok(true, 'Event handler was called');
		});

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - detach event', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		var oSpreadsheet = new Spreadsheet(settings);
		var fHandler = function(oEvent) {
			assert.ok(false, 'Event handler should not be called');
			oEvent.preventDefault();
		};

		oSpreadsheet.attachBeforeSave(fHandler);
		assert.ok(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener attached');

		oSpreadsheet.detachBeforeSave(fHandler);
		assert.notOk(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener detached');

		oSpreadsheet.build().then(function() {
			assert.ok(fnOnSave.calledOnce, 'File was saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - Prevent default', function(assert) {
		assert.expect(2);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			oEvent.preventDefault();
		});

		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
			assert.ok(fnOnSave.callCount == 0, 'File was not saved');
		}).finally(done);
	});

	QUnit.test('beforeSave - Event parameters', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.attachBeforeSave(function(oEvent) {
			var data = oEvent.getParameter('data');

			assert.ok(data, 'The generated spreadsheet is attached to the event');
			assert.ok(data instanceof ArrayBuffer, 'The attached data is an instance of ArrayBuffer');
		});

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.ok(true, 'The spreadsheet generation finished successfully');
		}).finally(done);
	});

	QUnit.test('beforeExport - attach event', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.attachBeforeExport(function(oEvent) {
				assert.ok(true, 'Event handler was called');
		}).build().finally(done);
	});

	QUnit.test('beforeExport - detach event', function(assert) {
		assert.expect(0);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);
		var fnHandler = function(oEvent) {
			assert.ok(false, 'Event handler was called although event was unregistered');
		};

		oSpreadsheet
			.attachBeforeExport(fnHandler)
			.detachBeforeExport(fnHandler)
			.build()
			.finally(done);
	});

	QUnit.test('beforeExport - Event parameters', function(assert) {
		assert.expect(3);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);
		var fnHandler = function(oEvent) {
			assert.ok(true, 'Event handler was called');
			assert.ok(oEvent, 'Event object present');
			assert.ok(oEvent.getParameter('exportSettings'), 'ExportSettings available as event parameter');
		};

		oSpreadsheet
			.attachBeforeExport(fnHandler)
			.build()
			.finally(done);
	});

	QUnit.test('Overwrite default document title and sheet name in "beforeExport" and check them on "beforeSave" once again', function (assert) {
		assert.expect(4);
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oSpreadsheet = new Spreadsheet(settings);
		var oResourceBundlePromise = sap.ui.getCore().getLibraryResourceBundle('sap.ui.export');

		oSpreadsheet.attachBeforeExport(function (oEvent) {
			var mSettings = oEvent.getParameter("exportSettings");

			mSettings.workbook.context.title = 'New document title';
			assert.ok(true, 'Overwrite document title');

			mSettings.workbook.context.sheetName = 'New sheet name';
			assert.ok(true, 'Overwrite sheet name');
		});

		oSpreadsheet.attachBeforeSave(function (oEvent) {
			var mSettings = oEvent.getSource()._mSettings;
			assert.ok(mSettings.workbook.context.title !== oResourceBundlePromise.getText('XLSX_DEFAULT_TITLE'), 'Document title successfully overwritten');
			assert.ok(mSettings.workbook.context.sheetName !== oResourceBundlePromise.getText('XLSX_DEFAULT_SHEETNAME'), 'Sheet name successfully overwritten');
		});

		oSpreadsheet.build().finally(done);
	});

	QUnit.module('General', mModuleConfig);

	QUnit.test('destroy', function(assert) {
		assert.expect(3);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);

		oSpreadsheet = new Spreadsheet(settings);

		oSpreadsheet.attachBeforeSave(function(oEvent) { /* Do something */ });
		assert.ok(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener attached');

		oSpreadsheet.destroy();
		assert.notOk(oSpreadsheet.hasListeners(sEventId), sEventId + ' listener detached');

		oSpreadsheet.onprogress = sinon.spy();
		oSpreadsheet.build().then(function() {
			assert.notOk(true, 'The spreadsheet was generated although the object was destroyed');
		}).catch(function() {
			assert.ok(true, 'The build cannot be triggered because the object was already destroyed');
		}).finally(done);
	});

	QUnit.test('Close progress dialog delayed', function(assert) {
		assert.expect(1);
		fnOnSave = sinon.spy();
		var done = assert.async();
		var settings = jQuery.extend(true, {}, mSettings);
		var oDialog, nStart, nDuration, fnFinish;

		oSpreadsheet = new Spreadsheet(settings);
		oSpreadsheet.attachBeforeSave(function() {
			oDialog = jQuery(jQuery('.sapMDialog')[0]).control(0);
			nStart = Date.now();

			fnFinish = oDialog.finish;

			oDialog.finish = function() {
				nDuration = Date.now() - nStart;
				assert.ok(nDuration >= 1000, 'The progress dialog was closed with a delay of ' + nDuration + ' ms');

				fnFinish();
				done();
			};
		});

		/* The actual process needs to be delayed to ensure that all previous progress dialogs have been closed */
		window.setTimeout(function() {
			oSpreadsheet.build();
		}, 1000);
	});
});
