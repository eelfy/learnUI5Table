/* global QUnit, sinon */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/qunit/QUnitUtils", 'sap/base/util/deepEqual', 'sap/ui/events/KeyCodes', "sap/ui/comp/smarttable/SmartTable", "sap/ui/comp/smartfilterbar/SmartFilterBar", "sap/ui/comp/smartvariants/PersonalizableInfo", "sap/m/Button", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v2/ODataModel", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/ToolbarSeparator", "sap/ui/model/odata/v2/ODataListBinding", "sap/ui/core/mvc/View", "sap/m/Bar", "sap/m/Column", "sap/m/Text", "sap/m/Table", "sap/m/ColumnListItem", "sap/m/MessageBox", "sap/ui/table/Column", "sap/ui/table/AnalyticalColumn", "sap/ui/core/Element", "sap/ui/comp/odata/ODataType", "sap/ui/comp/smartvariants/SmartVariantManagement", "sap/ui/table/AnalyticalTable", "sap/ui/table/TreeTable", "sap/ui/table/Table", "sap/ui/core/Control", "sap/ui/core/CustomData", "sap/ui/comp/personalization/Controller", "sap/ui/comp/state/UIState", "sap/base/Log", "sap/ui/comp/util/FilterUtil", 'sap/ui/comp/odata/type/FiscalDate', 'sap/ui/Device', 'sap/m/plugins/DataStateIndicator', 'sap/ui/core/message/Message', 'sap/ui/model/Filter'
	], function(qutils, deepEqual, KeyCodes, SmartTable, SmartFilterBar, PersonalizableInfo, Button, JSONModel, ODataModel, Toolbar, ToolbarSpacer, ToolbarSeparator, ODataListBinding, View, Bar, Column, Text, Table, ColumnListItem, MessageBox, UIColumn, AnalyticalColumn, Element, ODataType, SmartVariantManagement, AnalyticalTable, TreeTable, UITable, Control, CustomData, PersonalizationController, UIState, Log, FilterUtil, FiscalDate, Device, DataStateIndicator, Message, Filter) {

		sinon.spy(Log, "error");
		QUnit.module("sap.ui.comp.smarttable.SmartTable", {
			beforeEach: function() {
				this.oSmartTable = new SmartTable({
					useVariantManagement: false,
					useTablePersonalisation: false
				});
			},
			afterEach: function() {
				this.oSmartTable.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oSmartTable);
		});

		QUnit.test("Shall have entitySet property", function(assert) {
			this.oSmartTable.setEntitySet("foo");
			assert.strictEqual(this.oSmartTable.getEntitySet(), "foo");
		});

		QUnit.test("Shall have tableType property", function(assert) {
			this.oSmartTable.setTableType("ResponsiveTable");
			assert.strictEqual(this.oSmartTable.getTableType(), "ResponsiveTable");
		});

		QUnit.test("Shall have useVariantManagement property", function(assert) {
			this.oSmartTable._createVariantManagementControl = function() {
			};
			this.oSmartTable.setUseVariantManagement(true);
			assert.ok(this.oSmartTable.getUseVariantManagement());

			this.oSmartTable.setUseVariantManagement(false);
			assert.ok(!this.oSmartTable.getUseVariantManagement());
		});

		QUnit.test("Shall have useExportToExcel property", function(assert) {
			this.oSmartTable.setUseExportToExcel(true);
			assert.ok(this.oSmartTable.getUseExportToExcel());

			this.oSmartTable.setUseExportToExcel(false);
			assert.ok(!this.oSmartTable.getUseExportToExcel());
		});

		QUnit.test("Shall switch export type", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setModel(oModel);

			this.oSmartTable._bTableSupportsExcelExport = true;
			this.oSmartTable.setExportType("GW");

			assert.ok(this.oSmartTable._oUseExportToExcel.isA("sap.m.Button"), "Button for GW export");
			assert.ok(this.oSmartTable._oUseExportToExcel.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

			delete this.oSmartTable._bTableSupportsExcelExport; // irrelevant for UI5Client export
			this.oSmartTable.setExportType(); // default to UI5 Client

			assert.ok(this.oSmartTable._oUseExportToExcel.isA("sap.m.MenuButton"), "MenuButton for UI5Client export");
			assert.ok(this.oSmartTable._oUseExportToExcel.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");
		});

		QUnit.test("Shall have showRowCount property", function(assert) {
			this.oSmartTable.setShowRowCount(true);
			assert.ok(this.oSmartTable.getShowRowCount());

			this.oSmartTable.setShowRowCount(false);
			assert.ok(!this.oSmartTable.getShowRowCount());
		});

		QUnit.test("Shall have showFullScreenButton property", function(assert) {
			this.oSmartTable.setShowFullScreenButton(true);
			assert.ok(this.oSmartTable.getShowFullScreenButton());

			this.oSmartTable.setShowFullScreenButton(false);
			assert.ok(!this.oSmartTable.getShowFullScreenButton());
		});

		QUnit.test("Shall have showTablePersonalisation property", function(assert) {
			this.oSmartTable.setUseTablePersonalisation(true);
			this.oSmartTable.setShowTablePersonalisation(true);
			assert.ok(this.oSmartTable.getShowTablePersonalisation());

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setShowTablePersonalisation(false);
			assert.ok(!this.oSmartTable.getShowTablePersonalisation());
		});

		QUnit.test("Shall have showVariantManagement property", function(assert) {
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.setShowVariantManagement(false);
			assert.ok(!this.oSmartTable.getShowVariantManagement());

			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable.setShowVariantManagement(true);
			assert.ok(this.oSmartTable.getShowVariantManagement());
		});

		QUnit.test("Shall have editTogglable property", function(assert) {
			this.oSmartTable.setEditTogglable(false);
			assert.ok(!this.oSmartTable.getEditTogglable());

			this.oSmartTable.setEditTogglable(true);
			assert.ok(this.oSmartTable.getEditTogglable());
		});

		QUnit.test("Shall propogate editable state change to internal model", function(assert) {
			this.oSmartTable._oEditModel = sinon.createStubInstance(JSONModel);
			assert.ok(!this.oSmartTable.getEditable());

			this.oSmartTable.setEditable(true);
			assert.ok(this.oSmartTable.getEditable());
			assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", true));

			this.oSmartTable.setEditable(false);
			assert.ok(!this.oSmartTable.getEditable());
			assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", false));
		});

		QUnit.test("Shall propagate editable property binding to internal model", function(assert) {
			var oExternalEditModel = new JSONModel({
				editable: false
			});
			this.oSmartTable._oEditModel = sinon.createStubInstance(JSONModel);
			// bind editable property of table
			this.oSmartTable.bindProperty("editable", "externalModel>/editable");
			this.oSmartTable.setModel(oExternalEditModel, "externalModel");

			assert.ok(!this.oSmartTable.getEditable());

			oExternalEditModel.setProperty("/editable", true);
			assert.ok(this.oSmartTable.getEditable());
			assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", true));

			oExternalEditModel.setProperty("/editable", false);
			assert.ok(!this.oSmartTable.getEditable());
			assert.ok(this.oSmartTable._oEditModel.setProperty.calledWithExactly("/editable", false));

			oExternalEditModel.destroy();
		});

		QUnit.test("Shall switch keyboardMode of ResponsiveTable based on editable state change", function(assert) {
			var oResponsiveTable = null;
			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("ResponsiveTable");
			this.oSmartTable._createTable();

			oResponsiveTable = this.oSmartTable.getTable();
			assert.ok(oResponsiveTable instanceof Table, "table has to be created according to table type ResponsiveTable table");

			assert.ok(!this.oSmartTable.getEditable());
			assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Navigation", "ResponsiveTable is in navigation mode when not editable");

			// Set the table to editable
			this.oSmartTable.setEditable(true);
			assert.ok(this.oSmartTable.getEditable());
			assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Edit", "ResponsiveTable is in edit mode when editable");

			// Set to not editable
			this.oSmartTable.setEditable(false);
			assert.ok(!this.oSmartTable.getEditable());
			assert.strictEqual(oResponsiveTable.getKeyboardMode(), "Navigation", "ResponsiveTable is in navigation mode when not editable");
		});

		QUnit.test("Shall have custom toolbar aggregation", function(assert) {
			var oToolbar1 = new Toolbar();
			var oToolbar2 = new Toolbar();
			this.oSmartTable.setCustomToolbar(oToolbar1);
			assert.ok(this.oSmartTable.getCustomToolbar() === oToolbar1, "set toolbar has to be returned by getter");

			this.oSmartTable.setCustomToolbar(oToolbar2);
			assert.ok(this.oSmartTable.getCustomToolbar() !== oToolbar1, "set toolbar has to be returned by getter");
			assert.ok(this.oSmartTable.getCustomToolbar() === oToolbar2, "set toolbar has to be returned by getter");
		});

		QUnit.test("Shall pass the entity set to the TableProvider", function(assert) {
			var sEntitySet = "COMPANYSet";
			this.oSmartTable.setEntitySet(sEntitySet);
			sinon.stub(this.oSmartTable, "getModel").returns(sinon.createStubInstance(ODataModel));

			this.oSmartTable._createTableProvider();

			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
		});

		QUnit.test("Shall trigger initialiseMetadata and call _createTableProvider when entitySet and model are both set", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);

			sinon.spy(this.oSmartTable, "_initialiseMetadata");
			sinon.spy(this.oSmartTable, "_createTableProvider");
			sinon.spy(this.oSmartTable, "_listenToSmartFilter");
			sinon.spy(this.oSmartTable, "fireInitialise");

			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setModel(oModel);

			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
			assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
			assert.ok(this.oSmartTable._initialiseMetadata.called);
			assert.ok(this.oSmartTable._createTableProvider.called);
			assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
			assert.ok(this.oSmartTable.fireInitialise.calledOnce);
			assert.strictEqual(this.oSmartTable.bIsInitialised, true);
		});

		QUnit.test("Shall attach to events of Smart/FilterBar only when instance matches the expected control", function(assert) {
			var sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);

			sinon.spy(this.oSmartTable, "_listenToSmartFilter");
			sinon.spy(this.oSmartTable, "_findControl");
			sinon.spy(this.oSmartTable, "_getView");
			sinon.stub(this.oSmartTable, "getParent");
			sinon.stub(this.oSmartTable, "_createToolbarContent");
			var oView = sinon.createStubInstance(View);
			// Set View as parent of SmartTable
			this.oSmartTable.getParent.returns(oView);

			var oBar = new Bar("Bar0");
			oView.byId.returns(oBar); // Mock match
			oView.isA.returns(true); // Mock match
			this.oSmartTable.setSmartFilterId("Bar0");
			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setModel(oModel);

			// Check - I
			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
			assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
			assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
			assert.ok(this.oSmartTable._getView.calledOnce);
			assert.strictEqual(this.oSmartTable._oSmartFilter, undefined);
			assert.strictEqual(this.oSmartTable.bIsInitialised, true);

			// Reset state
			this.oSmartTable._oTableProvider.destroy();
			this.oSmartTable.bIsInitialised = false;
			this.oSmartTable._listenToSmartFilter.reset();
			this.oSmartTable._findControl.reset();
			this.oSmartTable._getView.reset();

			// Create SmartFilterBar instance with global ID
			oBar.destroy();
			oBar = new SmartFilterBar("Bar0");
			oView.byId.returns(oBar);

			// mock execution
			this.oSmartTable._onMetadataInitialised();

			// Check - II
			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
			assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
			assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
			assert.ok(this.oSmartTable._getView.notCalled);
			assert.strictEqual(this.oSmartTable._oSmartFilter, oBar);
			assert.strictEqual(this.oSmartTable.bIsInitialised, true);

			// Reset state
			this.oSmartTable._oTableProvider.destroy();
			this.oSmartTable.bIsInitialised = false;
			this.oSmartTable._listenToSmartFilter.reset();
			this.oSmartTable._findControl.reset();
			this.oSmartTable._getView.reset();

			// Create SmartFilterBar instance within a view (view specific id)
			oBar.destroy();
			oBar = new SmartFilterBar("__xmlView0--Bar0");
			oView.byId.returns(oBar);

			// mock execution
			this.oSmartTable._onMetadataInitialised();

			// Check - III
			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
			assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
			assert.ok(this.oSmartTable._listenToSmartFilter.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledOnce);
			assert.ok(this.oSmartTable._findControl.calledWithExactly("Bar0", "sap.ui.comp.filterbar.FilterBar"));
			assert.ok(this.oSmartTable._getView.calledOnce);
			assert.strictEqual(this.oSmartTable._oSmartFilter, oBar);
			assert.strictEqual(this.oSmartTable.bIsInitialised, true);

			oBar.destroy();
		});

		QUnit.test("Shall trigger fireToggleFullScreen", function(assert) {
			this.oSmartTable.setShowFullScreenButton(true);
			var sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);

			sinon.spy(this.oSmartTable, "fireFullScreenToggled");

			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setModel(oModel);

			this.oSmartTable._oFullScreenButton.firePress();

			assert.ok(this.oSmartTable.fireFullScreenToggled.calledOnce);
		});

		QUnit.test("Shall pass the initiallyVisibleFields to TableProvider", function(assert) {
			var sInitiallyVisbleFields, sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);

			sInitiallyVisbleFields = "foo,bar,col2";
			this.oSmartTable.setInitiallyVisibleFields(sInitiallyVisbleFields);
			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setModel(oModel);

			assert.ok(this.oSmartTable._oTableProvider);
			assert.strictEqual(this.oSmartTable._oTableProvider.sEntitySet, sEntitySet);
			assert.strictEqual(this.oSmartTable._oTableProvider._oParentODataModel, oModel);
			assert.strictEqual(this.oSmartTable._oTableProvider._sInitiallyVisibleFields, sInitiallyVisbleFields);
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbars", function(assert) {
			this.oSmartTable._createToolbar();
			this.oSmartTable.setUseExportToExcel(false);
			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbarContent();
			assert.ok(this.oSmartTable._oToolbar, "toolbar should always be created");

			this.oSmartTable.setHeader("Test Table");
			assert.equal(this.oSmartTable._oToolbar.getContent().length, 2, "toolbar should contain 2 entries");
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbar - toolbar is never set to invisible even when no visible content exists", function(assert) {
			this.oSmartTable._createToolbar();
			this.oSmartTable.setUseExportToExcel(false);
			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbarContent();
			assert.ok(this.oSmartTable._oToolbar, "toolbar should always be created");

			assert.equal(this.oSmartTable._oToolbar.getContent().length, 2, "toolbar should contain 2 entries");
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
			this.oSmartTable.setHeader("Test Table");
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbars - custom toolbar", function(assert) {
			var oCustomToolbar = new Toolbar();
			// Destroy the current instance and create the toolbar inline
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false,
				useExportToExcel: false,
				customToolbar: oCustomToolbar
			});
			this.oSmartTable.setHeader("Test Table");
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbarContent();
			assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
			assert.equal(oCustomToolbar.getContent().length, 2, "custom toolbar should contain 2 entries");
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
			this.oSmartTable.setHeader();
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
		});

		QUnit.test("_createToolbar and _createToolbarContent shall create toolbars - custom toolbar with own spacer", function(assert) {
			var oCustomToolbar = new Toolbar();
			var oToolbarSpacer = new ToolbarSpacer();
			oCustomToolbar.addContent(oToolbarSpacer);
			// Destroy the current instance and create the toolbar inline
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false,
				useExportToExcel: false,
				customToolbar: oCustomToolbar
			});
			this.oSmartTable.setHeader("Test Table");
			this.oSmartTable.bIsInitialised = true;

			this.oSmartTable._createToolbarContent();
			assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
			assert.equal(oCustomToolbar.getContent().length, 2, "custom toolbar should contain 2 entries");
			assert.equal(oCustomToolbar.getContent()[1], oToolbarSpacer, "custom toolbar should contain orginal spacer");
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "something is visible in the toolbar");
			this.oSmartTable.setHeader();
			assert.equal(this.oSmartTable._oToolbar.getVisible(), true, "toolbar is visible without any content being visible");
		});

		QUnit.test("Toolbar - PlaceToolbarInTable", function(assert) {
			var oCustomToolbar = new Toolbar();
			// Destroy the current SmartTable instance and create the toolbar inline
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				header: "Test Table",
				useVariantManagement: false,
				useTablePersonalisation: false,
				useExportToExcel: false,
				customToolbar: oCustomToolbar
			});
			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);
			var oGridTable = this.oSmartTable.getTable();

			assert.ok(this.oSmartTable._oToolbar === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
			assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oCustomToolbar, "toolbar reuses the custom toolbar");
			assert.ok(oGridTable.getExtension().length === 0, "Inner GridTable toolbar is empty");

			this.oSmartTable.setPlaceToolbarInTable(true);
			assert.ok(oGridTable.getExtension().length === 1, "Inner GridTable toolbar is filled");
			assert.ok(oGridTable.getExtension()[0] === oCustomToolbar, "Inner GridTable uses the custom toolbar");
			assert.ok(this.oSmartTable.getToolbar() === oCustomToolbar, "SmartTable toolbar reuses the custom toolbar");

			this.oSmartTable.setPlaceToolbarInTable(false);
			assert.ok(oGridTable.getExtension().length === 0, "Inner GridTable toolbar is empty");
			assert.ok(this.oSmartTable.getToolbar() === oCustomToolbar, "SmartTable toolbar reuses the custom toolbar");
		});

		QUnit.test("Toolbar - PlaceToolbarInTable - MTable", function(assert) {
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				placeToolbarInTable: true,
				useVariantManagement: false,
				useTablePersonalisation: false,
				useExportToExcel: false
			});
			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);
			var oMTable = this.oSmartTable.getTable();

			assert.ok(oMTable.getHeaderToolbar() === this.oSmartTable.getToolbar(), "Inner MTable headerToolbar uses the custom toolbar");
			assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oToolbar, "SmartTable toolbar uses inner toolbar");

			this.oSmartTable.setPlaceToolbarInTable(false);
			assert.ok(oMTable.getHeaderToolbar() === null, "Inner MTable headerToolbar is empty");
			assert.ok(this.oSmartTable.getToolbar() === this.oSmartTable._oToolbar, "SmartTable toolbar uses inner toolbar");
		});

		QUnit.test("_createToolbar default design and style", function(assert) {
			assert.equal(this.oSmartTable._oToolbar.getDesign(), "Transparent", "GridTable: default toolbar design is set");
			assert.equal(this.oSmartTable._oToolbar.getStyle(), "Clear", "GridTable: default toolbar style is set");
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				tableType: "ResponsiveTable"
			});
			assert.equal(this.oSmartTable._oToolbar.getDesign(), "Transparent", "ResponsiveTable: default toolbar design is set");
			assert.equal(this.oSmartTable._oToolbar.getStyle(), "Standard", "ResponsiveTable: default toolbar style is set");
		});

		QUnit.test("test header text features", function(assert) {
			this.oSmartTable.setUseExportToExcel(false);
			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbarContent();

			var sHeaderText = "myTestHeader";
			this.oSmartTable.setHeader(sHeaderText);
			assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");

			this.oSmartTable.setShowRowCount(true);

			assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
			assert.equal(this.oSmartTable._headerText.getText(), sHeaderText + " (0)", "header text has to contain row count");
		});

		QUnit.test("test header updates", function(assert) {
			this.oSmartTable.setUseExportToExcel(false);
			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbarContent();
			this.oSmartTable._createTable();

			var fRecreateToolbarContentSpy = sinon.spy(this.oSmartTable, "_createToolbarContent");
			var fRefreshTextSpy = sinon.spy(this.oSmartTable, "_refreshHeaderText");

			var sHeaderText = "myTestHeader";
			this.oSmartTable.setHeader(sHeaderText);
			assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
			assert.equal(fRecreateToolbarContentSpy.calledOnce, true, "toolbar content has to be updated when text changes from empty to something");
			assert.equal(fRefreshTextSpy.calledOnce, true, "toolbar content update also leads to a refresh internally");
			assert.equal(this.oSmartTable.getTable().getAriaLabelledBy().length, 1, "ariaLabelledBy association set");
			assert.equal(this.oSmartTable.getTable().getAriaLabelledBy()[0], this.oSmartTable._headerText.getId(), "ariaLabelledBy association set");

			// reset spies
			fRecreateToolbarContentSpy.reset();
			fRefreshTextSpy.reset();

			this.oSmartTable.setShowRowCount(true);
			assert.equal(this.oSmartTable.getHeader(), sHeaderText, "header text has to be equal");
			assert.equal(fRecreateToolbarContentSpy.calledOnce, false, "toolbar content should be unchanged when text changes from one value to another");
			assert.equal(fRefreshTextSpy.calledOnce, true, "text change also leads to a refresh");

			// reset spies
			fRecreateToolbarContentSpy.reset();
			fRefreshTextSpy.reset();

			this.oSmartTable.setHeader("foo");
			assert.equal(this.oSmartTable.getHeader(), "foo", "header text has to be equal");
			assert.equal(fRecreateToolbarContentSpy.called, false, "toolbar content should be unchanged when text changes from one value to another");
			assert.equal(fRefreshTextSpy.calledOnce, true, "text change also leads to a refresh");

			// reset spies
			fRecreateToolbarContentSpy.reset();
			fRefreshTextSpy.reset();

			this.oSmartTable.setHeader("");
			assert.equal(this.oSmartTable.getHeader(), "", "header text has to be equal");
			assert.equal(fRecreateToolbarContentSpy.calledOnce, true, "toolbar content has to be updated when text changes from something to empty");
			assert.equal(fRefreshTextSpy.calledOnce, true, "toolbar content update also leads to a refresh internally");
			assert.equal(this.oSmartTable.getTable().getAriaLabelledBy().length, 0, "ariaLabelledBy association removed as no headerText is applied");
		});

		QUnit.test("test excel export enabled state", function(assert) {
			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseOnlyOneSolidToolbar(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.setUseExportToExcel(true);
			this.oSmartTable.setExportType("GW");
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._bTableSupportsExcelExport = true;

			var iRowCount = 0;
			this.oSmartTable._getRowCount = function() {
				return iRowCount;
			};

			this.oSmartTable._createToolbar();
			this.oSmartTable._createToolbarContent();

			this.oSmartTable.updateTableHeaderState();
			assert.equal(this.oSmartTable.getExportType(), "GW", "GW export is configured on the SmartTable");
			assert.equal(this.oSmartTable._oUseExportToExcel.getEnabled(), false, "Export to Excel has to be disabled");
			iRowCount = 100;
			this.oSmartTable._oTable = null;
			this.oSmartTable.updateTableHeaderState();
			assert.equal(this.oSmartTable._oUseExportToExcel.getEnabled(), true, "Export to Excel has to be enabled");

			iRowCount = 0;

			this.oSmartTable._isMobileTable = true;
			this.oSmartTable.updateTableHeaderState();
			assert.equal(this.oSmartTable._oUseExportToExcel.getEnabled(), false, "Export to Excel has to be disabled");

			iRowCount = 100;
			this.oSmartTable.updateTableHeaderState();
			assert.equal(this.oSmartTable._oUseExportToExcel.getEnabled(), true, "Export to Excel has to be enabled");
		});

		QUnit.test("test excel export", function(assert) {
			var iRowCount = 1;
			this.oSmartTable._getRowCount = function() {
				return iRowCount;
			};
			this.oSmartTable._getRelevantColumnPaths = function() {
				return null;
			};

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseOnlyOneSolidToolbar(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.setUseExportToExcel(true);
			this.oSmartTable.setExportType("GW");
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._bTableSupportsExcelExport = true;
			this.oSmartTable._createToolbar();
			this.oSmartTable._createToolbarContent();

			var sDownloadUrlType;
			var sUrl = "testUrl";
			this.oSmartTable._getRowBinding = function() {
				return {
					getDownloadUrl: function(sType) {
						sDownloadUrlType = sType;
						return sUrl;
					}
				};
			};

			sinon.stub(window, "open");

			this.oSmartTable._oUseExportToExcel.firePress();
			assert.equal(this.oSmartTable.getExportType(), "GW", "GW export is configured on the SmartTable");
			assert.equal(sDownloadUrlType, "xlsx", "DownloadType has to be xlsx");
			assert.ok(window.open.calledWith(sUrl), "window.open has to be called with correct url");

			sinon.stub(MessageBox, "confirm");
			iRowCount = 50000;
			sUrl = "testUrl2";
			this.oSmartTable._oUseExportToExcel.firePress();
			var oArgs = MessageBox.confirm.getCall(0).args[1];
			assert.equal(oArgs.actions[0], MessageBox.Action.YES, "MessageBox should show YES");
			assert.equal(oArgs.actions[1], MessageBox.Action.NO, "MessageBox should show NO");
			oArgs.onClose(MessageBox.Action.YES);
			assert.ok(window.open.calledWith(sUrl), "window.open has to be called with correct url");

			MessageBox.confirm.restore();
			window.open.restore();
		});

		QUnit.test("_createExportColumnConfiguration - sap.ui.table.Column", function(assert) {
			var aActualOutput, aColumns, aExpectedOutput, fnGetColumns;

			aColumns = [
				new UIColumn({
					label: "Prop A",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropA",
					edmType: "Edm.String",
					type: "string"
				}), new AnalyticalColumn({
					leadingProperty: "PropB",
					label: "Prop B",
					width: "320px"
				}).data("p13nData", {
					type: "numeric",
					edmType: "Edm.Decimal"
				}), new Column({
					header: new Text({
						text: "Prop C"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropC",
					edmType: "Edm.Decimal",
					additionalProperty: "SomeProp,SomeCurrency",
					unit: "SomeCurrency",
					precision: "10",
					scale: "3",
					type: "numeric",
					isCurrency: true
				}), new Column({
					header: new Text({
						text: "Prop D"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropD",
					edmType: "Edm.DateTime",
					type: undefined
				}), new Column({
					header: new Text({
						text: "Prop E"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropE",
					edmType: "Edm.Decimal",
					additionalProperty: "SomeUoM",
					unit: "SomeUoM",
					precision: "10",
					scale: "2",
					type: "numeric"
				}), new Column({
					header: new Text({
						text: "Prop F"
					})
				}).data("p13nData", {
					leadingProperty: "PropF",
					edmType: "Edm.Boolean",
					type: "boolean"
				}), new UIColumn({
					label: "Prop G",
					width: "15em"
				}).data("p13nData", {
					leadingProperty: "PropG",
					description: "DescriptionProp",
					displayBehaviour: "descriptionAndId",
					edmType: "Edm.String",
					type: "string"
				}), new UIColumn({
					label: "Prop H",
					width: "5em"
				}).data("p13nData", {
					leadingProperty: "PropH",
					isDigitSequence: true,
					edmType: "Edm.String",
					type: "string"
				}), new UIColumn({
					label: "Prop I",
					hAlign: "Right",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropI",
					edmType: "Edm.String",
					type: "stringdate"
				}), new UIColumn({
					label: "Fiscal Date",
					hAlign: "Right"
				}).data("p13nData", {
					typeInstance: new FiscalDate(undefined, undefined, {anotationType: "com.sap.vocabularies.Common.v1.IsFiscalYear"}),
					leadingProperty: "FiscalDate",
					edmType: "Edm.String",
					type: "date"
				})
			];

			fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
			fnGetColumns.returns(aColumns);

			/* Needs to be spied before the export button is created */
			sinon.spy(this.oSmartTable, "_triggerUI5ClientExport");

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;

			aExpectedOutput = [
				{
					label: "Prop A",
					property: "PropA",
					textAlign: "Begin",
					type: "String",
					width: 10
				}, {
					label: "Prop B",
					property: "PropB",
					textAlign: "Begin",
					type: "Number",
					width: 20
				}, {
					label: "Prop C",
					property: "PropC",
					unitProperty: "SomeCurrency",
					displayUnit: true,
					textAlign: "Right",
					type: "Currency",
					precision: "10",
					scale: "3",
					width: ""
				}, {
					label: "Prop D",
					property: "PropD",
					textAlign: "Right",
					type: "DateTime",
					width: ""
				}, {
					label: "Prop E",
					property: "PropE",
					unitProperty: "SomeUoM",
					textAlign: "Right",
					type: "Number",
					precision: "10",
					scale: "2",
					width: ""
				}, {
					label: "Prop F",
					property: "PropF",
					type: "Boolean",
					trueValue: ODataType.getType("Edm.Boolean").formatValue(true, "string"),
					falseValue: ODataType.getType("Edm.Boolean").formatValue(false, "string"),
					width: ""
				}, {
					label: "Prop G",
					property: [
						"PropG", "DescriptionProp"
					],
					template: "{1} ({0})",
					textAlign: "Begin",
					type: "String",
					width: 15
				}, {
					label: "Prop H",
					property: "PropH",
					textAlign: "Begin",
					type: "Number",
					width: 5
				}, {
					label: "Prop I",
					property: "PropI",
					textAlign: "Right",
					type: "Date",
					inputFormat: "YYYYMMDD",
					width: 10
				}, {
					label: "Fiscal Date",
					property: "FiscalDate",
					textAlign: "Right",
					type: "String"
				}
			];

			aActualOutput = this.oSmartTable._createExportColumnConfiguration({fileName: 'Table header'});
			assert.ok(deepEqual(aExpectedOutput, aActualOutput, true), 'The export configuration was created as expected');
		});

		QUnit.test("_createExportColumnConfiguration - sap.m.Column", function(assert) {
			var aActualOutput, aColumns, aExpectedOutput, fnGetColumns, oColumn1, oColumn2, oColumn3;

			oColumn1 = new Column({
				header: new Text({
					text: "Prop C"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: "PropC",
				additionalProperty: "SomeProp,SomeCurrency",
				unit: "SomeCurrency",
				precision: "10",
				scale: "3",
				type: "number",
				isCurrency: true
			});
			oColumn2 = new Column({
				header: new Text({
					text: "Prop A"
				}),
				hAlign: "Begin"
			}).data("p13nData", {
				leadingProperty: "PropA",
				edmType: "Edm.DateTime",
				type: undefined
			});
			oColumn3 = new Column({
				header: new Text({
					text: "Prop B"
				}),
				hAlign: "Right"
			}).data("p13nData", {
				leadingProperty: [
					"PropB"
				],
				edmType: "Edm.DateTimeOffset",
				type: undefined
			});

			// Set Order of mColumns
			oColumn1.setOrder(2);
			oColumn2.setOrder(0);
			oColumn3.setOrder(1);
			aColumns = [
				oColumn1, oColumn2, oColumn3
			].sort(function(a, b) {
				return a.getOrder() - b.getOrder();
			});

			fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
			fnGetColumns.returns(aColumns);

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._isMobileTable = true;

			aExpectedOutput = [
				{
					label: "Prop A",
					property: "PropA",
					textAlign: "Begin",
					type: "DateTime",
					width: ""
				}, {
					label: "Prop B",
					property: "PropB",
					textAlign: "Right",
					type: "DateTime",
					width: ""
				}, {
					label: "Prop C",
					property: "PropC",
					unitProperty: "SomeCurrency",
					displayUnit: true,
					textAlign: "Right",
					type: "Currency",
					precision: "10",
					scale: "3",
					width: ""
				}
			];

			aActualOutput = this.oSmartTable._createExportColumnConfiguration({fileName: 'Table header'});
			assert.ok(deepEqual(aExpectedOutput, aActualOutput, true), 'The export configuration was created as expected');
		});

		QUnit.test("_createExportColumnConfiguration - SplitCells option", function(assert) {
			var aActualOutput, aColumns, aExpectedOutput, fnGetColumns;

			aColumns = [
				new UIColumn({
					label: "Prop A",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropA",
					description: "DescA",
					displayBehaviour: "descriptionOnly",
					type: "string"
				}), new UIColumn({
					label: "Prop B",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropB",
					description: "DescB",
					displayBehaviour: "idOnly",
					type: "string"
				}), new UIColumn({
					label: "Prop C",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropC",
					description: "DescC",
					displayBehaviour: "descriptionAndId",
					type: "string"
				})
			];

			fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
			fnGetColumns.returns(aColumns);

			/* Needs to be spied before the export button is created */
			sinon.spy(this.oSmartTable, "_triggerUI5ClientExport");

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.bIsInitialised = true;

			aExpectedOutput = [
				{
					label: "Prop A",
					property: "DescA",
					type: "String",
					width: 10
				},
				{
					label: "Prop B",
					property: "PropB",
					type: "String",
					width: 10
				},
				{
					label: "Prop C",
					property: "PropC",
					type: "String",
					width: 10
				},
				{
					label: "Prop C (2)",
					property: "DescC",
					type: "String",
					width: 10
				}
			];

			aActualOutput = this.oSmartTable._createExportColumnConfiguration({fileName: 'Table header', splitCells: true});
			assert.ok(deepEqual(aExpectedOutput, aActualOutput, true), 'The export configuration was created as expected');
		});

		QUnit.test("test UI5 client excel export - no visible columns", function(assert) {
			var fnGetColumns = sinon.stub(this.oSmartTable._oTable, "getColumns");
			fnGetColumns.returns([]);

			/* Needs to be spied before the export button is created */
			sinon.spy(this.oSmartTable, "_triggerUI5ClientExport");

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.setUseExportToExcel(true);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._isMobileTable = true;
			this.oSmartTable._createToolbar();
			this.oSmartTable._createToolbarContent();

			// Stub MessageBox error
			sinon.stub(MessageBox, "error");

			assert.equal(this.oSmartTable.getExportType(), "UI5Client", "UI5Client export is the default on the SmartTable");

			// Mock user action
			this.oSmartTable._oUseExportToExcel.fireDefaultAction();

			assert.ok(this.oSmartTable._triggerUI5ClientExport.calledOnce, "this.oSmartTable._triggerUI5ClientExport has to be called for UI5Client export");

			assert.ok(MessageBox.error.calledOnce, "Error message was shown due to missing columns");

			fnGetColumns.restore();
			MessageBox.error.restore();
			this.oSmartTable._triggerUI5ClientExport.restore();
		});

		QUnit.test('test UI5 client export - Button "Export as..." ', function(assert) {
			sinon.stub(this.oSmartTable, "_openExportSettings");

			this.oSmartTable.setUseTablePersonalisation(false);
			this.oSmartTable.setUseVariantManagement(false);
			this.oSmartTable.setUseExportToExcel(true);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._isMobileTable = true;
			this.oSmartTable._createToolbar();
			this.oSmartTable._createToolbarContent();

			assert.equal(this.oSmartTable.getExportType(), "UI5Client", "UI5Client export is the default on the SmartTable");
			assert.ok(this.oSmartTable._oUseExportToExcel.isA("sap.m.MenuButton"), "Export button is a MenuButton");

			// Mock user action
			this.oSmartTable._oUseExportToExcel.getMenu().getItems()[1].firePress();

			assert.ok(this.oSmartTable._openExportSettings.calledOnce, "this.oSmartTable._openExportSettings has to be called for UI5Client export");

			this.oSmartTable._openExportSettings.restore();
		});

		QUnit.test("test dataRequested and dataReceived function", function(assert) {
			var oBindingParameters = null;
			var mParameters = {
				"data": [],
				"foo": "bar"
			};
			var oEvent = {
				getParameter: function(sParam) {
					return mParameters[sParam];
				},
				getParameters: function() {
					return mParameters;
				}
			};

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			var fDataRequestedSpy = sinon.stub(this.oSmartTable, "fireDataRequested");
			var fDataReceivedSpy = sinon.stub(this.oSmartTable, "fireDataReceived");

			this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to enable binding
			this.oSmartTable.rebindTable();

			assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
			// busy handling will now be done by the table internally
			assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			oBindingParameters.events.dataRequested(oEvent);
			assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
			assert.ok(fDataRequestedSpy.calledWith(mParameters), "dataRequested event was triggered due to binding event");

			oBindingParameters.events.dataReceived(oEvent);
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");

			// Reset spy before simulating muliple binding events
			fDataRequestedSpy.reset();
			fDataReceivedSpy.reset();

			// Simulate 3 binding data request/response calls (e.g. paging)
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			// event should be fired accordingly
			assert.equal(fDataRequestedSpy.callCount, 3, "dataRequested event was triggered 4 times due to binding event");
			assert.equal(fDataReceivedSpy.callCount, 3, "dataReceived event was triggered 4 times due to binding event");

			// Reset spy before simulating __simulateAsyncAnalyticalBinding binding events
			fDataRequestedSpy.reset();
			fDataReceivedSpy.reset();

			// Simulate 2 AnalyticalBinding data request/response calls, first one with __simulateAsyncAnalyticalBinding set
			mParameters["__simulateAsyncAnalyticalBinding"] = true;
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);
			delete mParameters["__simulateAsyncAnalyticalBinding"];
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered just once due to binding event (__simulateAsyncAnalyticalBinding call was ignored)");
		});

		QUnit.test("test dataRequested and dataReceived function - with external events registration", function(assert) {
			var oBindingParameters = null;
			var mParameters = {
				"data": [],
				"foo": "bar"
			};
			var oEvent = {
				getParameter: function(sParam) {
					return mParameters[sParam];
				},
				getParameters: function() {
					return mParameters;
				}
			};

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			var fDataRequestedSpy = sinon.stub(this.oSmartTable, "fireDataRequested");
			var fDataReceivedSpy = sinon.stub(this.oSmartTable, "fireDataReceived");
			var fChangeSpy = sinon.spy(this.oSmartTable, "_onBindingChange");
			var fExternalDataRequestedSpy = sinon.stub();
			var fExternalDataReceivedSpy = sinon.stub();

			// Register events parameter - externally!
			this.oSmartTable.attachBeforeRebindTable(function(oEvt) {
				var mBindingParams = oEvt.getParameter("bindingParams");
				mBindingParams.events["dataRequested"] = fExternalDataRequestedSpy;
				mBindingParams.events["dataReceived"] = fExternalDataReceivedSpy;
			});

			this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to enable binding
			this.oSmartTable.rebindTable();

			assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
			// busy handling will now be done by the table internally
			assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			oBindingParameters.events.dataRequested(oEvent);
			// internal
			assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
			assert.ok(fDataRequestedSpy.calledWith(mParameters), "dataRequested event was triggered due to binding event");
			// external
			assert.ok(fExternalDataRequestedSpy.calledOnce, "external dataRequested event was triggered due to binding event");
			assert.ok(fExternalDataRequestedSpy.calledWith(oEvent), "external dataRequested event was triggered due to binding event");

			oBindingParameters.events.dataReceived(oEvent);
			// internal
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");
			// external
			assert.ok(fExternalDataReceivedSpy.calledOnce, "dataReceived event was triggered due to binding event");

			// Reset spy before simulating muliple binding events
			fDataRequestedSpy.reset();
			fDataReceivedSpy.reset();
			fExternalDataRequestedSpy.reset();
			fExternalDataReceivedSpy.reset();

			// Simulate 3 binding data request/response calls (e.g. paging)
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			// event should be fired accordingly
			// internal
			assert.equal(fDataRequestedSpy.callCount, 3, "dataRequested event was triggered 3 times due to binding event");
			assert.equal(fDataReceivedSpy.callCount, 3, "dataReceived event was triggered 3 times due to binding event");
			// external
			assert.equal(fExternalDataRequestedSpy.callCount, 3, "external dataRequested event was triggered 3 times due to binding event");
			assert.equal(fExternalDataReceivedSpy.callCount, 3, "external dataReceived event was triggered 3 times due to binding event");

			// Reset spy before simulating __simulateAsyncAnalyticalBinding binding events
			fDataRequestedSpy.reset();
			fDataReceivedSpy.reset();
			fExternalDataRequestedSpy.reset();
			fExternalDataReceivedSpy.reset();

			// Simulate 2 AnalyticalBinding data request/response calls, first one with __simulateAsyncAnalyticalBinding set
			mParameters["__simulateAsyncAnalyticalBinding"] = true;
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);
			delete mParameters["__simulateAsyncAnalyticalBinding"];
			oBindingParameters.events.dataRequested(oEvent);
			oBindingParameters.events.dataReceived(oEvent);

			// internal
			assert.ok(fDataRequestedSpy.calledOnce, "dataRequested event was triggered due to binding event");
			assert.ok(fDataReceivedSpy.calledOnce, "dataReceived event was triggered just once due to binding event (__simulateAsyncAnalyticalBinding call was ignored)");

			// external
			assert.ok(fExternalDataRequestedSpy.calledTwice, "external dataRequested event was triggered as many times as the binding");
			assert.ok(fExternalDataReceivedSpy.calledTwice, "external dataReceived event was triggered twice due to binding event (__simulateAsyncAnalyticalBinding call was NOT ignored)");

			// Binding change event test
			assert.ok(fChangeSpy.notCalled);
			oBindingParameters.events.change(oEvent);
			assert.ok(fChangeSpy.calledOnce);
		});

		QUnit.test("test inner tables rowsUpdated event", function(assert) {
			var bFunctionWasCalled = false;
			this.oSmartTable.setTableType("AnalyticalTable");
			this.oSmartTable._createTable();
			this.oSmartTable._setExcelExportEnableState = function() {
				bFunctionWasCalled = true;
			};
			this.oSmartTable._oTable.fireRowsUpdated();
			assert.ok(bFunctionWasCalled, "smartTable _setExcelExportEnableState was called by inner table rowsUpdated event");
		});

		QUnit.test("test apply and fetch variant", function(assert) {
			var oTestVariant = {};
			this.oSmartTable._oSmartFilter = sinon.createStubInstance(SmartFilterBar);
			this.oSmartTable._oTable = {
				setShowOverlay: function() {
				},
				getColumns: function() {
					return [];
				},
				removeAllColumns: function() {
				}
			};

			var bTableReseted = false;
			this.oSmartTable._oPersController = {
				resetPersonalization: function() {
					bTableReseted = true;
				},
				setPersonalizationData: function() {
					// foo
				}
			};

			this.oSmartTable.applyVariant(oTestVariant);
			var oResultVariant = this.oSmartTable.fetchVariant();
			assert.equal(oResultVariant, oTestVariant, "applied variant has to equal fetched variant");

			this.oSmartTable.applyVariant("STANDARD");
			oResultVariant = this.oSmartTable.fetchVariant();
			assert.deepEqual(oResultVariant, {}, "applied STANDARD variant should return empty variant");
			assert.ok(bTableReseted, "applying STANDARD variant should reset table");
		});

		QUnit.test("test apply for application standard", function(assert) {
			var oTestVariant = {
				foo: "bar"
			};
			this.oSmartTable._oSmartFilter = sinon.createStubInstance(SmartFilterBar);
			this.oSmartTable._oTable = {
				setShowOverlay: function() {
				},
				getColumns: function() {
					return [];
				},
				removeAllColumns: function() {
				}
			};

			this.oSmartTable._oPersController = {
				resetPersonalization: function() {
				},
				setPersonalizationData: function() {
					// foo
				}
			};

			this.oSmartTable.applyVariant(oTestVariant, "STANDARD");
			var oResultVariant = this.oSmartTable.fetchVariant();
			assert.equal(oResultVariant, oTestVariant, "applied application standard variant has to equal fetched variant");

			this.oSmartTable.applyVariant({});
			oResultVariant = this.oSmartTable.fetchVariant();
			assert.deepEqual(oResultVariant, {}, "applied any variant should return that variant and not merge application variant");
		});

		QUnit.test("test add Spacer", function(assert) {
			this.oSmartTable._createToolbar();
			this.oSmartTable._addSpacerToToolbar();

			assert.equal(this.oSmartTable._oToolbar.getContent().length, 1, "one item has to be added to the toolbar");
			assert.ok(this.oSmartTable._oToolbar.getContent()[0] instanceof ToolbarSpacer, "ToolbarSpacer has to be added to toolbar");

			delete this.oSmartTable._oToolbar;
			this.oSmartTable.setCustomToolbar(new Toolbar());
			this.oSmartTable._createToolbar();
			var oSpacer = new ToolbarSpacer();
			this.oSmartTable._oCustomToolbar.addContent(oSpacer);
			this.oSmartTable._addSpacerToToolbar();

			assert.equal(this.oSmartTable._oCustomToolbar.getContent().length, 1, "toolbar has to contain one item");
			assert.equal(this.oSmartTable._oCustomToolbar.getContent()[0], oSpacer, "item has to be original toolbarSpacer");

		});

		QUnit.test("test smartTable setToolbarStyleClass", function(assert) {
			var sTestStyleClass = "DummyStyleClass";

			// Destroy the current instance and create the toolbar inline
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				useVariantManagement: false,
				useTablePersonalisation: false,
				toolbarStyleClass: sTestStyleClass
			});

			assert.equal(this.oSmartTable.getToolbarStyleClass(), sTestStyleClass, "style class has to be present in the table");
			assert.ok(this.oSmartTable._oToolbar.aCustomStyleClasses.indexOf(sTestStyleClass) > -1, "style class has to be set correctly on toolbar");
		});

		QUnit.test("test _getChangeStatus", function(assert) {
			var returnedChangeStatus = this.oSmartTable._getChangeStatus();
			assert.equal(returnedChangeStatus, "ModelChanged", "change status has to be correct");

			returnedChangeStatus = this.oSmartTable._getChangeStatus({
				sort: "Unchanged",
				filter: "Unchanged",
				columns: "Unchanged",
				group: "Unchanged"
			});
			assert.equal(returnedChangeStatus, "Unchanged", "change status has to be correct");

			returnedChangeStatus = this.oSmartTable._getChangeStatus({
				sort: "Unchanged",
				filter: "Unchanged",
				columns: "TableChanged",
				group: "Unchanged"
			});
			assert.equal(returnedChangeStatus, "TableChanged", "change status has to be correct");

			returnedChangeStatus = this.oSmartTable._getChangeStatus({
				sort: "Unchanged",
				filter: "Unchanged",
				columns: "TableChanged",
				group: "ModelChanged"
			});
			assert.equal(returnedChangeStatus, "ModelChanged", "change status has to be correct");

		});

		QUnit.test("test _persistPersonalization", function(assert) {
			var sVariantKey;
			var oFinalParams;
			this.oSmartTable._oVariantManagement = {
				getCurrentVariantId: function() {
					return sVariantKey;
				},
				fireSave: function(oParams) {
					oFinalParams = oParams;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				},
				isPageVariant: function() {
				}
			};

			sVariantKey = null;
			this.oSmartTable._persistPersonalisation();
			assert.deepEqual(oFinalParams, {
				name: "Personalisation",
				implicit: true,
				global: false,
				overwrite: false,
				key: null,
				def: true
			}, "fire save has to be called with correct parameters");

			sVariantKey = "123";
			this.oSmartTable._persistPersonalisation();
			assert.deepEqual(oFinalParams, {
				name: "Personalisation",
				implicit: true,
				global: false,
				overwrite: true,
				key: "123",
				def: true
			}, "fire save has to be called with correct parameters");
		});

		QUnit.test("test _createVariantManagementControl function without smartVariant association", function(assert) {
			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable.setPersistencyKey("foo");

			this.oSmartTable._createVariantManagementControl();

			var oControl = this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getControl();

			assert.equal(this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getType(), "table", "PersonalizableInfo.type has to be set correctly");
			assert.equal(this.oSmartTable._oVariantManagement.getPersonalizableControls()[0].getKeyName(), "persistencyKey", "PersonalizableInfo.keyName has to be set correctly");
			assert.ok(oControl === this.oSmartTable.getId(), "PersonalizableInfo Control has to be set to smarttable");

			assert.equal(this.oSmartTable._oVariantManagement.getShowShare(), true, "SmartVariantManagement has to be instantiated correctly - showShare");

			this.oSmartTable._oVariantManagement._initialize({}, this.oSmartTable._oVariantManagement._getControlWrapper(sap.ui.getCore().byId(oControl)));
			assert.equal(this.oSmartTable._oCurrentVariant, "STANDARD", "current variant has to be initialized");
		});

		QUnit.test("test _createVariantManagementControl function with a smartVariant association having id", function(assert) {
			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable.setPersistencyKey("foo");

			this.oSmartTable.setSmartVariant("SmartTableVariant");
			var oVariant = new SmartVariantManagement(this.oSmartTable.getSmartVariant(), {
				showShare: true
			});

			this.oSmartTable._createVariantManagementControl();
			assert.equal(this.oSmartTable._oVariantManagement, oVariant, "Correct SmartVariant control was returned");
		});

		QUnit.test("test _createVariantManagementControl function with a smartVariant association without having id", function(assert) {
			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable.setPersistencyKey("foo");

			var oVariant = new SmartVariantManagement({
				showShare: true
			});

			this.oSmartTable.setSmartVariant(oVariant);
			this.oSmartTable._createVariantManagementControl();
			assert.equal(this.oSmartTable._oVariantManagement, oVariant, "Correct SmartVariant control was returned");
		});

		QUnit.test("test getRowCount function", function(assert) {
			var currentLength = 10;
			var oRowBinding = {
				getTotalSize: function() {
					return 0;
				},
				getLength: function() {
					return currentLength;
				}
			};
			this.oSmartTable._getRowBinding = function() {
				return oRowBinding;
			};

			var oResult = this.oSmartTable._getRowCount();

			assert.equal(oResult, 10, "row count has to be returned correctly");

			currentLength = -100;
			oResult = this.oSmartTable._getRowCount();
			assert.equal(oResult, 0, "negative row count has to be defaulted to 0");

			currentLength = 10;
			oRowBinding = {
				getTotalSize: function() {
					return currentLength;
				}
			};

			oResult = this.oSmartTable._getRowCount(true);
			assert.equal(oResult, 10, "total size has to be used if available");

			currentLength = "0";
			oResult = this.oSmartTable._getRowCount(true);
			assert.equal(oResult, 0, "row count has to be returned correctly");
			assert.equal(typeof oResult, "number", "row count has to be returned as number");
		});

		QUnit.test("test _getTablePersonalisationData function", function(assert) {
			this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
				return sColumnKey;
			};
			this.oSmartTable._getColumnByKey = function(sColumnKey) {
				return {
					getFilterProperty: function() {
						return sColumnKey;
					},
					data: function() {
						return {};
					}
				};
			};

			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: false,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "Key1"
						}, {
							columnKey: "Key2",
							operation: "Descending"
						}, {
							columnKey: "Key3"
						}
					]
				},
				filter: {
					filterItems: [
						{
							columnKey: "Key1",
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "Key2",
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "Key3",
							operation: "BT",
							value1: 10,
							value2: 20
						}
					]
				}

			};

			var oResult = this.oSmartTable._getTablePersonalisationData();

			assert.equal(oResult.sorters.length, 3, "correct number of sorters");
			assert.equal(oResult.sorters[0].sPath, "Key1", "correct path on sorter 1");
			assert.equal(oResult.sorters[0].bDescending, false, "correct descending flag on sorter 1");
			assert.equal(oResult.sorters[1].sPath, "Key2", "correct path on sorter 2");
			assert.equal(oResult.sorters[1].bDescending, true, "correct descending flag on sorter 2");
			assert.equal(oResult.sorters[2].sPath, "Key3", "correct path on sorter 3");
			assert.equal(oResult.sorters[2].bDescending, false, "correct descending flag on sorter 3");

			var aFilters = oResult.filters;
			assert.equal(aFilters.length, 3, "correct number of filters");
			assert.equal(aFilters[0].sPath, "Key1", "correct key on filter 1");
			assert.equal(aFilters[1].sPath, "Key2", "correct key on filter 2");
			assert.equal(aFilters[2].sPath, "Key3", "correct key on filter 3");

		});

		QUnit.test("test _getTablePersonalisationData filtering exclude operations", function(assert) {
			// Arrange
			var aFilters,
				oTransformMethodSpy = sinon.spy(FilterUtil, "getTransformedExcludeOperation");

			this.oSmartTable._getColumnByKey = function(sColumnKey) {
				return {
					getFilterProperty: function() {
						return sColumnKey;
					},
					data: function() {
						return {};
					}
				};
			};

			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				filter: {
					filterItems: [
						{
							columnKey: "Key1",
							exclude: true,
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "Key2",
							exclude: true,
							operation: "NB",
							value1: 10,
							value2: 20
						}, {
							columnKey: "Key3",
							operation: "BT",
							value1: 10,
							value2: 20
						}
					]
				}

			};

			// Act
			aFilters = this.oSmartTable._getTablePersonalisationData().excludeFilters.aFilters;

			// Assert
			assert.strictEqual(oTransformMethodSpy.callCount, 2, "Transformation method from FilterUtil called 2 times");
			assert.ok(oTransformMethodSpy.firstCall.calledWithExactly("BT"), "Call with BT as value");
			assert.strictEqual(oTransformMethodSpy.firstCall.returnValue, "NB", "Returned transformed value NB");
			assert.ok(oTransformMethodSpy.secondCall.calledWithExactly("NB"), "Call with NB as value");
			assert.strictEqual(oTransformMethodSpy.secondCall.returnValue, "NB", "Returned not-transformed value");

			assert.strictEqual(aFilters.length, 2, "There should be 2 exclude filters");
			assert.strictEqual(aFilters[0].sOperator, "NB", "Correct operation set for filter 'Key1'");
			assert.strictEqual(aFilters[1].sOperator, "NB", "Correct operation set for filter 'Key2'");

			// Cleanup
			oTransformMethodSpy.restore();
		});

		QUnit.test("test SmartTable for Grouping in ResponsiveTable", function(assert) {
			var done = assert.async();
			sap.ui.require([
				"sap/ui/comp/util/FormatUtil", "sap/ui/model/Context"
			], function(FormatUtil, Context) {
				var fnFormatterSpy = sinon.spy(FormatUtil, "getInlineGroupFormatterFunction");
				FormatUtil.getInlineMeasureUnitFormatter();
				var fnInnerFormatterSpy = sinon.spy(FormatUtil, "_fInlineMeasureFormatter");
				// setup pre-conditions
				if (this.oSmartTable._oTable) {
					this.oSmartTable._oTable.destroy();
				}
				this.oSmartTable._oTable = null;
				this.oSmartTable.setTableType("ResponsiveTable");
				this.oSmartTable._createTable();

				var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

				// fake metadata
				this.oSmartTable._aTableViewMetadata = [
					{
						name: "Key1",
						inResult: true, // hack to simulate that the column gets created
						isInitiallyVisible: false,
						sortable: true,
						unit: "test/Key5",
						additionalProperty: "test/Key5",
						navigationProperty: "test",
						template: new Text()
					}, {
						name: "Key2",
						isInitiallyVisible: true,
						template: new Text()
					}, {
						name: "Key3",
						isInitiallyVisible: true,
						template: new Text()
					}, {
						name: "Key4"
					}, {
						name: "test/Key5"
					}, {
						name: "Key6"
					}
				];

				// fake grouping variant
				this.oSmartTable._oCurrentVariant = {
					columns: {
						columnsItems: [
							{
								visible: false,
								columnKey: "Key1"
							}, {
								visible: true,
								columnKey: "Key2"
							}, {
								visible: true,
								columnKey: "Key3"
							}
						]
					},
					sort: undefined,
					filter: undefined,
					group: {
						groupItems: [
							{
								columnKey: "Key1"
							}
						]
					}

				};

				// Simulate init
				this.oSmartTable._createContent();

				assert.ok(fBindStub.notCalled);

				// simulate grouping
				this.oSmartTable.rebindTable();

				assert.ok(fBindStub.calledOnce);

				var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API

				assert.strictEqual(oResult.sorter.length, 1, "correct number of sorters");
				assert.strictEqual(oResult.sorter[0].sPath, "Key1", "correct path on sorter 1");
				assert.strictEqual(oResult.sorter[0].bDescending, false, "correct descending flag on sorter 1");
				assert.ok(oResult.parameters.select.indexOf("test/Key5") > -1, "additional param is part of $select");
				assert.ok(oResult.parameters.expand.indexOf("test") > -1, "navigationProperty is part of $expand");
				assert.ok(fnFormatterSpy.calledOnce);

				var fnGroupFunction = oResult.sorter[0].getGroupFunction();
				assert.strictEqual(typeof fnGroupFunction, "function", "grouping function exists on sorter 1");

				assert.ok(fnInnerFormatterSpy.notCalled);
				var oContext = sinon.createStubInstance(Context);
				oContext.getProperty.withArgs("Key1").returns(100);
				oContext.getProperty.withArgs("test/Key5").returns("PCS");

				oResult = fnGroupFunction(oContext);

				assert.ok(fnInnerFormatterSpy.calledOnce);

				assert.strictEqual(oResult.key, "100\u2007PCS");

				done();
			}.bind(this));
		});

		QUnit.test("test MultiUnit sorters", function(assert) {
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("Table");
			this.oSmartTable._createTable();

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

			// fake metadata
			this.oSmartTable._aTableViewMetadata = [
				{
					name: "Key1",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					unit: "Key5",
					isCurrencyField: true,
					additionalProperty: "Key5",
					template: new Text()
				}, {
					name: "Key2",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key3",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key4"
				}, {
					name: "Key5",
					sortable: true
				}, {
					name: "Key6"
				}
			];

			// fake sorting variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "Key1"
						}
					]
				},
				filter: undefined,
				group: undefined
			};

			// Simulate init
			this.oSmartTable._createContent();

			// simulate sorting
			this.oSmartTable.rebindTable();
			var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
			assert.strictEqual(oResult.sorter.length, 1, "only 1 sorter added as _bMultiUnitBehaviorEnabled = false");
			assert.strictEqual(oResult.sorter[0].sPath, "Key1", "correct path on sorter 1");

			// enable MultiUnitBehavior
			this.oSmartTable._bMultiUnitBehaviorEnabled = true;
			// simulate sorting
			this.oSmartTable.rebindTable(true);
			oResult = fBindStub.args[1][0]; // get binding parameters passed to bindRows/bindItems API
			assert.strictEqual(oResult.sorter.length, 2, "2 sorter added as _bMultiUnitBehaviorEnabled = true");
			assert.strictEqual(oResult.sorter[0].sPath, "Key5", "Unit is added as first sorter");
			assert.strictEqual(oResult.sorter[1].sPath, "Key1", "Amount is added as second sorter");

			// clean up
			this.oSmartTable._bMultiUnitBehaviorEnabled = false;
		});

		QUnit.test("test MultiUnit sort - with grouping", function(assert) {
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("ResponsiveTable");
			this.oSmartTable._createTable();

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

			this.oSmartTable._aTableViewMetadata = [
				{
					name: "Key1",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					unit: "Key5",
					isCurrencyField: true,
					additionalProperty: "Key5",
					template: new Text()
				}, {
					name: "Key2",
					inResult: true,
					isInitiallyVisible: true,
					sortable: true,
					template: new Text()
				}, {
					name: "Key3",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key4"
				}, {
					name: "Key5",
					sortable: true
				}, {
					name: "Key6"
				}
			];

			// fake sorting variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "Key1"
						}
					]
				},
				filter: undefined,
				group: {
					groupItems: [
						{
							columnKey: "Key2"
						}
					]
				}
			};

			// Simulate init
			this.oSmartTable._createContent();
			// enable MultiUnit behavior
			this.oSmartTable._bMultiUnitBehaviorEnabled = true;
			// simulate grouping
			this.oSmartTable.rebindTable();
			var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
			assert.strictEqual(oResult.sorter.length, 3, "3 sorters are added correctly");
			assert.strictEqual(oResult.sorter[0].sPath, "Key2", "1st sorter for grouping");
			assert.strictEqual(oResult.sorter[1].sPath, "Key5", "2nd sorter is currency field");
			assert.strictEqual(oResult.sorter[2].sPath, "Key1", "3rd sorter is amount field");
		});

		QUnit.test("test MultiUnit sort - Unit sorter already added", function(assert) {
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("Table");
			this.oSmartTable._createTable();
			this.oSmartTable._bMultiUnitBehaviorEnabled = true;

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

			// fake metadata
			this.oSmartTable._aTableViewMetadata = [
				{
					name: "Key1",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					unit: "Key5",
					isCurrencyField: true,
					additionalProperty: "Key5",
					template: new Text()
				}, {
					name: "Key2",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key3",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key4"
				}, {
					name: "Key5",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					template: new Text()
				}, {
					name: "Key6"
				}
			];

			// fake sorting variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "Key1"
						}, {
							columnKey: "Key5"
						}
					]
				},
				filter: undefined,
				group: undefined
			};

			// Simulate init
			this.oSmartTable._createContent();

			// simulate sorting
			this.oSmartTable.rebindTable();
			var oResult = fBindStub.args[0][0]; // get binding parameters passed to bindRows/bindItems API
			assert.strictEqual(oResult.sorter.length, 2, "2 sorters are added correctly");
			assert.strictEqual(oResult.sorter[0].sPath, "Key1", "Amount is added as first sorter");
			assert.strictEqual(oResult.sorter[1].sPath, "Key5", "Unit is added as second sorter");

			// clean up
			this.oSmartTable._bMultiUnitBehaviorEnabled = false;
		});

		QUnit.test("test info toolbar", function(assert) {
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("ResponsiveTable");
			this.oSmartTable._createTable();

			// fake metadata
			this.oSmartTable._aTableViewMetadata = [
				{
					name: "Key1",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					unit: "Key5",
					isCurrencyField: true,
					additionalProperty: "Key5",
					template: new Text()
				}, {
					name: "Key2",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key3",
					isInitiallyVisible: true,
					template: new Text()
				}, {
					name: "Key4"
				}, {
					name: "Key5",
					inResult: true, // hack to simulate that the column gets created
					isInitiallyVisible: true,
					sortable: true,
					template: new Text()
				}, {
					name: "Key6"
				}
			];

			// fake filter variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: undefined,
				filter: {
					filterItems: [
						{
							columnKey: "Key1",
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "Key2",
							exclude: false,
							operation: "Contains",
							value1: "JP"
						}, {
							columnKey: "Key1",
							operation: "BT",
							value1: 20,
							value2: 30
						}, {
							columnKey: "Key4",
							exclude: false,
							operation: "Contains",
							value1: "X"
						}
					]
				},
				group: undefined
			};

			this.oSmartTable._getColumnByKey = function(sColumnKey) {
				return {
					getFilterProperty: function() {
						return sColumnKey;
					},
					data: function() {
						return {};
					},
					getHeader: function() {
						return {
							getText: function() {
								return sColumnKey === "Key4" ? null : "Header " + sColumnKey;
							}
						};
					}
				};
			};

			// Simulate init
			this.oSmartTable._createContent();
			this.oSmartTable.rebindTable();
			this.oSmartTable._createInfoToolbar();

			assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Auto", "Default value set correctly");

			var oTable = this.oSmartTable.getTable();

			assert.ok(oTable.getInfoToolbar(), "Info toolbar created");
			assert.ok(oTable.getInfoToolbar().getVisible(), "Info toolbar is visible");
			assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
			assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText(), "Filtered By: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");

			this.oSmartTable.setUseInfoToolbar("Off");
			assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "Off", "Value set correctly");
			assert.notOk(oTable.getInfoToolbar().getVisible(), "Info Toolbar hidden");
			assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") === -1, "ariaLabelledBy association removed from the inner table");

			this.oSmartTable.setUseInfoToolbar("On");
			assert.strictEqual(this.oSmartTable.getUseInfoToolbar(), "On", "Value set correctly");
			assert.ok(oTable.getInfoToolbar().getVisible(), "Info toolbar is visible");
			assert.ok(oTable.getAriaLabelledBy().indexOf(this.oSmartTable.getId() + "-infoToolbarText") !== -1, "ariaLabelledBy association added to the inner table");
			assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText(), "Filtered By: Header Key1 and Header Key2", "Filtered columns are shown in the info toolbar");
			assert.strictEqual(oTable.getInfoToolbar().getContent()[0].getText().indexOf("Key4"), -1, "Key4 is not added to the filter text as column label is not available");

			// removing the filters should hide the filter info toolbar
			// fake filter variant
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "Key1"
						}, {
							visible: true,
							columnKey: "Key2"
						}, {
							visible: true,
							columnKey: "Key3"
						}
					]
				},
				sort: undefined,
				filter: undefined,
				group: undefined
			};

			this.oSmartTable.rebindTable();
			this.oSmartTable._createInfoToolbar();

			assert.notOk(oTable.getInfoToolbar().getVisible(), "Info toolbar is hidden as no filters are applied");
		});

		QUnit.test("test _getPathFromColumnKeyAndProperty function", function(assert) {
			var aColumns = [
				{
					data: function() {
						return null;
					}
				}, {
					data: function(sDataKey) {
						if (sDataKey === "p13nData") {
							return {
								columnKey: "TestKey",
								customProperty: "CustomPropertyValue"
							};
						}
						return null;
					},
					getSortProperty: function() {
						return "SortPropertyValue";
					},
					getFilterProperty: function() {
						return "FilterPropertyValue";
					},
					getLeadingProperty: function() {
						return "LeadingPropertyValue";
					}
				}
			];
			this.oSmartTable._oTable = {
				getColumns: function() {
					return aColumns;
				}
			};

			var sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "sortProperty");
			assert.equal(sValue, "SortPropertyValue", "Function has to return correct sort property value");

			sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "filterProperty");
			assert.equal(sValue, "FilterPropertyValue", "Function has to return correct filter property value");

			sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "leadingProperty");
			assert.equal(sValue, "LeadingPropertyValue", "Function has to return correct leading property value");

			sValue = this.oSmartTable._getPathFromColumnKeyAndProperty("TestKey", "customProperty");
			assert.equal(sValue, "CustomPropertyValue", "Function has to return correct custom property value");

		});

		QUnit.test("test setUseVariantManagement function", function(assert) {
			var bResetToInitialTableState = false;
			this.oSmartTable._oPersController = {
				setResetToInitialTableState: function(bAllow) {
					bResetToInitialTableState = bAllow;
				}
			};

			this.oSmartTable.setUseVariantManagement(false);
			assert.equal(this.oSmartTable.getUseVariantManagement(), false, "use Variant Management should be false");
			assert.equal(bResetToInitialTableState, true, "persController allow reset should be true");

			this.oSmartTable.setUseVariantManagement(true);
			assert.equal(this.oSmartTable.getUseVariantManagement(), true, "use Variant Management should be true");
			assert.equal(bResetToInitialTableState, false, "persController allow reset should be false");
		});

		QUnit.test("test getTable function", function(assert) {
			var oDummyTable = {};
			this.oSmartTable._oTable = oDummyTable;

			assert.equal(this.oSmartTable.getTable(), oDummyTable, "getTable should retrieve internal table");
		});

		QUnit.test("test _addSeparatorToToolbar function", function(assert) {
			var oInsertedObject = null;
			var iInsertIndex = -1;
			var sExistingHeight, sClass;
			this.oSmartTable.setHeader("Dummy");
			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable._oToolbar = {
				getHeight: function() {
					return sExistingHeight;
				},
				addStyleClass: function(sStyleClass) {
					sClass = sStyleClass;
				},
				insertContent: function(oObject, iIndex) {
					iInsertIndex = iIndex;
					oInsertedObject = oObject;
				},
				destroy: function() {
				}
			};

			this.oSmartTable._oVariantManagement = {
				isPageVariant: function() {
					return false;
				}
			};

			this.oSmartTable._addSeparatorToToolbar();
			assert.ok(oInsertedObject instanceof ToolbarSeparator, "object instanceof ToolbarSeparator should have been added");
			assert.equal(iInsertIndex, 0, "separator should be inserted at index 0");

			assert.equal(sClass, "sapMTBHeader-CTX", "default height shall be set from 'sapMTBHeader-CTX', if nothing is set");

			this.oSmartTable._oVariantManagement = null;
		});

		QUnit.test("test _addVariantManagementToToolbar  function", function(assert) {
			var oDummyVariantManagement = {
				isPageVariant: function() {
					return false;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				},
				setVisible: function() {
				},
				addStyleClass: function(sClass) {
					oDummyVariantManagement.styleClass = sClass;
				}
			};
			var oInsertedObject = null;
			var oRemovedObject = null;
			var iInsertIndex = -1;
			this.oSmartTable._oVariantManagement = oDummyVariantManagement;

			this.oSmartTable.setUseVariantManagement(true);
			this.oSmartTable._oToolbar = {
				removeContent: function(oObject) {
					oRemovedObject = oObject;
				},
				insertContent: function(oObject, iIndex) {
					iInsertIndex = iIndex;
					oInsertedObject = oObject;
				},
				destroy: function() {
				}
			};

			this.oSmartTable._addVariantManagementToToolbar(true);
			assert.equal(oRemovedObject, oDummyVariantManagement, "variant management object should first be removed");
			assert.equal(oInsertedObject, oDummyVariantManagement, "variant management object should have been inserted");
			assert.equal(oInsertedObject.styleClass, "sapUiCompSmartTableToolbarContent", "Control marked as table owned toolbar content");
			assert.equal(iInsertIndex, 0, "variant management should be inserted at index 0");
		});

		QUnit.test("test _addTablePersonalisationToToolbar   function", function(assert) {
			var bDialogOpen = false;
			this.oSmartTable._oPersController = {
				openDialog: function() {
					bDialogOpen = true;
				}
			};

			var oAddedToToolbar = null;

			this.oSmartTable.setUseTablePersonalisation(true);
			this.oSmartTable._oToolbar = {
				addContent: function(oObject) {
					oAddedToToolbar = oObject;
				},
				destroy: function() {
				}
			};

			this.oSmartTable._addTablePersonalisationToToolbar();
			assert.ok(oAddedToToolbar instanceof Button, "personalisation button should have been added to toolbar");
			assert.ok(oAddedToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

			oAddedToToolbar.firePress();
			assert.ok(bDialogOpen, "persController openDialog should have been called");
		});

		QUnit.test("test keyboard shortcut CTRL + COMMA opens the table personalisation dialog", function(assert) {
			var bDialogOpen = false;
			this.oSmartTable._oToolbar = null;
			this.oSmartTable._oPersController = {
				openDialog: function() {
					bDialogOpen = true;
				}
			};

			var oAddedToToolbar = null;

			this.oSmartTable._oToolbar = {
				addContent: function(oObject) {
					oAddedToToolbar = oObject;
				},
				destroy: function() {
				}
			};

			assert.notOk(this.oSmartTable.getUseTablePersonalisation(), "useTablePersonalisation=false");
			// trigger CTRL + COMMA keyboard shortcut
			qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.COMMA, false, false, true);
			assert.equal(bDialogOpen, false, "Table personalisation dialog not opened as useTablePersonalisation=false");

			this.oSmartTable.setUseTablePersonalisation(true);
			this.oSmartTable._addTablePersonalisationToToolbar();
			assert.ok(oAddedToToolbar instanceof Button, "personalisation button should have been added to toolbar");

			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			// trigger CTRL + COMMA keyboard shortcut
			qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.COMMA, false, false, true);
			assert.equal(bDialogOpen, true, "Table personalisation dialog opened");

			bDialogOpen = false;
			this.oSmartTable.setShowTablePersonalisation(false);
			sap.ui.getCore().applyChanges();

			// trigger CTRL + COMMA keyboard shortcut
			qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.COMMA, false, false, true);
			assert.equal(bDialogOpen, false, "Table personalisation dialog not opened as showTablePersonalisation=false");
		});

		QUnit.test("test _addFullScreenButton function", function(assert) {
			this.oSmartTable.setShowFullScreenButton(true);
			var oAddToToolbar = null;
			this.oSmartTable._oToolbar = {
				addContent: function(oObject) {
					oAddToToolbar = oObject;
				},
				destroy: function() {
				}
			};

			this.oSmartTable._addFullScreenButton();
			assert.ok(oAddToToolbar instanceof Button, "Fullscreen button should have been added to toolbar");
			assert.ok(oAddToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://exit-full-screen", "SmartTable is in Maximized mode");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://full-screen", "SmartTable is in Minimized mode");
		});

		QUnit.test("test _addEditTogglableToToolbar function", function(assert) {
			this.oSmartTable.setEditTogglable(true);
			var oAddToToolbar = null;
			this.oSmartTable._oToolbar = {
				addContent: function(oObject) {
					oAddToToolbar = oObject;
				},
				destroy: function() {
				}
			};

			this.oSmartTable._addEditTogglableToToolbar();
			assert.ok(oAddToToolbar instanceof Button, "EditTogglable button should have been added to toolbar");
			assert.ok(oAddToToolbar.hasStyleClass("sapUiCompSmartTableToolbarContent"), "Control marked as table owned toolbar content");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://display", "SmartTable should be in Editable mode");

			oAddToToolbar.firePress();
			assert.equal(oAddToToolbar.getIcon(), "sap-icon://edit", "SmartTable should be in Display mode");
		});

		QUnit.test("test _showOverlay function", function(assert) {
			this.oSmartTable._showOverlay(true);
			assert.ok(this.oSmartTable._oTable.getShowOverlay(), "Overlay set on table");

			this.oSmartTable._showOverlay(false);
			assert.ok(!this.oSmartTable._oTable.getShowOverlay(), "Overlay removed on table");
		});

		QUnit.test("test rebindTable function", function(assert) {
			var oBindingParameters = null;
			var bBeforeRebindCalled = false;
			var bPreventBinding;

			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");

			var mParameters = {
				"data": [],
				"foo": "bar"
			};
			var oEvent = {
				getParameter: function(sParam) {
					return mParameters[sParam];
				},
				getParameters: function() {
					return mParameters;
				}
			};

			this.oSmartTable._getRowCount = function() {
				return 0;
			};

			this.oSmartTable.attachBeforeRebindTable(function(oParams) {
				bBeforeRebindCalled = true;
				oParams.getParameter("bindingParams").preventTableBind = bPreventBinding;
				oParams.getParameter("bindingParams").parameters["select"] = [
					"foo"
				];
			});

			bPreventBinding = true;
			this.oSmartTable.rebindTable();

			assert.ok(bBeforeRebindCalled, "before rebind has to be called");
			assert.ok(!this.oSmartTable._bIsTableBound, "table has to be unbound because of prevent binding");

			bPreventBinding = false;
			this.oSmartTable.rebindTable();

			assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
			// busy handling will now be done by the table internally
			assert.ok(fBindStub.calledOnce, "binding triggered on the internal table");

			oBindingParameters = fBindStub.args[0][0];

			assert.ok(oBindingParameters, "binding parameters are set");

			oBindingParameters.events.dataReceived(oEvent);

			assert.ok(this.oSmartTable._bIsTableBound, "table has to be bound");
		});

		QUnit.test("test _isTableBound function", function(assert) {
			assert.ok(!this.oSmartTable._isTableBound(), "table has not yet been bound");
			// simulate that at least 1 column exists!
			this.oSmartTable.attachBeforeRebindTable(function(oParams) {
				oParams.getParameter("bindingParams").parameters["select"] = [
					"foo"
				];
			});
			// bind via SmartTable API
			this.oSmartTable.rebindTable();
			assert.ok(this.oSmartTable._isTableBound(), "table has now been bound");
			// unbind the table
			this.oSmartTable._bIsTableBound = false;
			var oTable = this.oSmartTable.getTable();
			oTable.unbindRows();
			assert.ok(!this.oSmartTable._isTableBound(), "table has not been bound");
			// bind directly to simulate external binding
			oTable.bindRows("/foo");
			assert.ok(this.oSmartTable._isTableBound(), "table has been bound");
		});

		QUnit.test("test CurrentVariantId property", function(assert) {
			// reset error log count to get the correct error log count result
			Log.error.reset();

			this.oSmartTable.setCurrentVariantId("dummy");

			assert.ok(Log.error.calledOnce, "variantManagement not in place, error should have been logged");

			var bGetterCalled = false;
			var bSetterCalled = false;
			var sSetVariantId = null;

			var sVariantId = "MyVariantId";

			this.oSmartTable._oVariantManagement = {
				getCurrentVariantId: function() {
					bGetterCalled = true;
					return sSetVariantId;
				},
				setCurrentVariantId: function(sId) {
					bSetterCalled = true;
					sSetVariantId = sId;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				},
				isPageVariant: function() {
				}
			};

			this.oSmartTable.setCurrentVariantId(sVariantId);

			assert.ok(bSetterCalled, "setter has to be called on internal variantmanagement");
			assert.equal(sSetVariantId, sVariantId, "set variant id has to be correct");

			var sReturnedId = this.oSmartTable.getCurrentVariantId();
			assert.ok(bGetterCalled, "Getter has to be called on internal variantmanagement");
			assert.equal(sReturnedId, sVariantId, "get variant id has to be correct");
		});

		QUnit.test("test create column functions", function(assert) {
			var oColumn = this.oSmartTable._createColumn({}, "a");
			assert.ok(oColumn instanceof UIColumn, "has to be table Column");
			oColumn.destroy();
			oColumn = this.oSmartTable._createAnalyticalColumn({}, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			oColumn.destroy();
			oColumn = this.oSmartTable._createMobileColumn({}, "a");
			assert.ok(oColumn instanceof Column, "has to be Mobile Column");
			assert.equal(oColumn.getHeader().getWrappingType(), "Hyphenated", "Column header text has wrappingType=Hyphenated");
			oColumn.destroy();
			this.oSmartTable.setEnableAutoColumnWidth(true);
			oColumn = this.oSmartTable._createMobileColumn({width: "5cm"});
			assert.equal(oColumn.getWidth(),"5cm", "width annotation is taken into account");
			oColumn.destroy();
		});

		QUnit.test("test column width calculation", function(assert) {
			var fWidth, mConfig = {
				min: 2,
				max: 19,
				padding: 0,
				epsilon: 0,
				defaultWidth: 8,
				labelSplit: true
			}, check = function(sRefText, fOrigWidth, fRange) {
				var fRefTextWidth = SmartTable.oCanvasContext.measureText(sRefText).width / 16;
				return Math.abs(fRefTextWidth - fOrigWidth) <= (fRange || 0.5);
			};

			[{type: "Edm.Byte"}, {type: "Edm.SByte"}, {type: "Edm.Byte"}, {isImageURL: true}].forEach(function(oField) {
				fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
				assert.equal(fWidth, mConfig.min, "Min column width for " + JSON.stringify(oField));
			}, this);

			[{type: "Edm.String", maxLength: 255}, {type: "Edm.String", maxLength: 200, label: "w".repeat(80)}].forEach(function(oField) {
				fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
				assert.equal(fWidth, mConfig.max, "Max column width for " + JSON.stringify(oField));
			}, this);

			[null, undefined].forEach(function(oField) {
				fWidth = this.oSmartTable._calcColumnWidth(oField, false, mConfig);
				assert.equal(fWidth, mConfig.defaultWidth, "Default column width for " + JSON.stringify(oField));
			}, this);

			fWidth = this.oSmartTable._calcColumnWidth({type: "Edm.String", label: "a"}, false, mConfig);
			assert.equal(fWidth, mConfig.max * 0.75, "If maxLength is not defined then the width should be %75 of the max width ");

			fWidth = this.oSmartTable._calcColumnWidth({
				type: "Edm.Boolean",
				modelType: ODataType.getType("Edm.Boolean")
			}, false, mConfig);
			assert.equal(fWidth, mConfig.min, "'Yes' has 3 characters length");
			assert.equal(SmartTable.fBooleanWidth, mConfig.min, "Max boolean characters width is stored in the SmartTable");

			var aTestData = [
				{type: "Edm.DateTime", reference: "May 26, 2023, 10:47:58 PM"},
				{type: "Edm.Time", reference: "10:47:58 PM"},
				{type: "Edm.Int16", reference: "32,768"},
				{type: "Edm.Int32", reference: "247,483,648"},
				{type: "Edm.Int64", reference: "999,999,999,999"},
				{type: "Edm.Float", reference: "9,999.99"},
				{type: "Edm.Single", reference: "9,999.99"},
				{type: "Edm.Double", reference: "9,999,999,999.999"},
				{type: "Edm.Decimal", reference: "999,999,999,999.999"}
			];

			aTestData.forEach(function(mTest) {
				var fOrigWidth = this.oSmartTable._calcColumnWidth({
					type: mTest.type,
					modelType: ODataType.getType(mTest.type)
				}, false, mConfig);
				assert.ok(check(mTest.reference, fOrigWidth), mTest.type + " field column width calculated correctly");
			}, this);


			this.oSmartTable._isTreeTable = true;
			aTestData.forEach(function(mTest) {
				var fOrigWidth = this.oSmartTable._calcColumnWidth({
					type: mTest.type,
					modelType: ODataType.getType(mTest.type),
					hierarchy: "test",
					index: 0
				}, false, mConfig);
				assert.ok(check(mTest.reference, fOrigWidth, 3.5), mTest.type + " field column width calculated correctly for the TreeTable first column");
			}, this);
			delete this.oSmartTable._isTreeTable;

			// --- additionalProperty --- //

			this.oSmartTable.setEntitySet("EntitySet");
			sinon.stub(this.oSmartTable, "getModel").returns(sinon.createStubInstance(ODataModel));
			this.oSmartTable._createTableProvider();
			var oGetFieldMetadataStub = sinon.stub(this.oSmartTable._oTableProvider, "getFieldMetadata");

			oGetFieldMetadataStub.returns({
				name: "additional",
				type: "Edm.String",
				maxLength: 5,
				modelType: ODataType.getType("Edm.String")
			});
			fWidth = this.oSmartTable._calcColumnWidth({
				name: "leading",
				type: "Edm.String",
				maxLength: 10,
				modelType: ODataType.getType("Edm.String"),
				additionalProperty: "additional"
			}, false, mConfig);
			assert.ok(check("w".repeat(10) + " (" + "w".repeat(5) + ")" , fWidth), "Additional field width calculated correctly");

			fWidth = this.oSmartTable._calcColumnWidth({
				name: "leading",
				type: "Edm.String",
				maxLength: 6,
				vertical: true,
				modelType: ODataType.getType("Edm.String"),
				additionalProperty: "additional"
			}, false, mConfig);
			assert.ok(check("w".repeat(6), fWidth), "Additional field width calculated correctly for vertical template");

			fWidth = this.oSmartTable._calcColumnWidth({
				name: "leading",
				type: "Edm.String",
				maxLength: 4,
				displayBehaviour: "idOnly",
				modelType: ODataType.getType("Edm.String"),
				additionalProperty: "additional"
			}, false, mConfig);
			assert.ok(check("w".repeat(4), fWidth), "Additional field is ignored since displayBehaviour=idOnly");

		});

		QUnit.test("test _updateColumnWidthForEdit", function(assert) {
			var oColumn = new UIColumn({
				width: "3rem"
			});

			this.oSmartTable.setEnableAutoColumnWidth(true);
			this.oSmartTable.data("useSmartField", true);
			this.oSmartTable.getTable().addColumn(oColumn);

			[	null,
				{},
				{width: "auto"},
				{type: "Edm.Boolean"},
				{semanticObjects: {}},
				{"sap:updatable": "false"},
				{"sap:creatable": "false"}
			].forEach(function(oField) {
				this.oSmartTable._updateColumnWidthForEdit(oColumn, oField);
				assert.equal(oColumn.getWidth(), "3rem", "Column width is not changed for " + JSON.stringify(oField));
			}, this);

			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				editWidth: "3rem",
				width: "2rem"
			});
			assert.equal(oColumn.getWidth(), "2rem", "Column width is changed to display width ");

			// Ack
			this.oSmartTable.setEditable(true);

			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				editWidth: "3rem",
				width: "2rem"
			});
			assert.equal(oColumn.getWidth(), "3rem", "Column width is updated to editable case");

			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				width: "3rem"
			});
			assert.ok(parseFloat(oColumn.getWidth()) > 4, "Min column width is applied for input case");

			[	{isCalendarDate: true},
				{type: "Edm.DateTime"},
				{type: "Edm.DateTimeOffset"},
				{type: "Edm.Time"},
				{hasValueListAnnotation: true}
			].forEach(function(oField) {
				oColumn.setWidth("3rem");
				this.oSmartTable._updateColumnWidthForEdit(oColumn, Object.assign({
					isColumnCreated: true,
					width: "3rem",
					ownWidth: 3
				}, oField));
				assert.ok(parseFloat(oColumn.getWidth()) > 7, "Min column width is applied for input with icon case: " + JSON.stringify(oField));
			}, this);

			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				editWidth: "3rem",
				width: "5rem"
			});
			assert.ok(parseFloat(oColumn.getWidth()) >  7, "Column width is not changed because column is resized during edit");

			// Ack
			oColumn.data("p13nData", {
				columnKey: "PropA"
			});
			oColumn.setWidth("8rem");
			this.oSmartTable.setEntitySet("EntitySet");
			sinon.stub(this.oSmartTable, "getModel").returns(sinon.createStubInstance(ODataModel));
			this.oSmartTable._createTableProvider();
			sinon.stub(this.oSmartTable._oTableProvider, "getFieldMetadata").returns({
				name: "PropA",
				editWidth: "8rem",
				isColumnCreated: true,
				width: "3rem"
			});

			this.oSmartTable.setEditable(false);
			assert.equal(oColumn.getWidth(), "3rem", "Column width is updated when switched from edit to display");

			// Ack
			this.oSmartTable.setEditable(true);
			oColumn.setWidth("auto");

			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				displayBehaviour: "idAndDescription",
				additionalWidth: 12,
				hasValueListAnnotation: true,
				hasFixedValues: false,
				labelWidth: 10,
				ownWidth: 7,
				width: "auto"
			});
			assert.ok(parseFloat(oColumn.getWidth()) > 11.5, "Column width is shrink during the edit because now editable field need to show only id");

			oColumn.setWidth("3rem");
			this.oSmartTable._updateColumnWidthForEdit(oColumn, {
				isColumnCreated: true,
				displayBehaviour: "idAndDescription",
				hasValueListAnnotation: true,
				hasFixedValues: true,
				ownWidth: 2,
				width: "3rem"
			});
			assert.ok(parseFloat(oColumn.getWidth()) > 6, "Column width is enlarged because editable field need to show id and description");

		});

		QUnit.test("test _createTable function", function(assert) {
			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;

			this.oSmartTable.setTableType("AnalyticalTable");
			this.oSmartTable.addItem(new Table());
			this.oSmartTable._createTable();

			assert.ok(this.oSmartTable._isMobileTable, "internal Mobile table has to be used");
			assert.ok(this.oSmartTable._createColumn === this.oSmartTable._createMobileColumn, "create column function has to be adjusted to create mobile columns");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;

			this.oSmartTable.addItem(new AnalyticalTable());
			this.oSmartTable._createTable();

			assert.ok(this.oSmartTable._isAnalyticalTable, "internal Analytical table has to be used");
			assert.ok(this.oSmartTable._createColumn === this.oSmartTable._createAnalyticalColumn, "create column function has to be adjusted to create analytical columns");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;

			this.oSmartTable.addItem(new TreeTable());
			this.oSmartTable._createTable();

			assert.ok(this.oSmartTable._isTreeTable, "internal Tree table has to be used");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("AnalyticalTable");
			this.oSmartTable._createTable();
			assert.ok(this.oSmartTable.getTable() instanceof AnalyticalTable, "table has to be created according to table type Analytical table");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("TreeTable");
			this.oSmartTable._createTable();
			assert.ok(this.oSmartTable.getTable() instanceof TreeTable, "table has to be created according to table type Tree table");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("ResponsiveTable");
			this.oSmartTable._createTable();
			assert.ok(this.oSmartTable.getTable() instanceof Table, "table has to be created according to table type ResponsiveTable table");

			this.oSmartTable.removeAllItems();
			if (this.oSmartTable._oTable) {
				this.oSmartTable._oTable.destroy();
			}
			this.oSmartTable._oTable = null;
			this.oSmartTable.setTableType("Table");
			this.oSmartTable._createTable();
			assert.ok(this.oSmartTable.getTable() instanceof UITable, "table has to be created according to table type Table table");
		});

		QUnit.test("test grouping in AnalyticalColumn", function(assert) {
			var oField = {}, oColumn;
			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.ok(!oColumn.getGroupHeaderFormatter(), "no group header formatter is set");
			assert.strictEqual(oColumn.getGrouped(), false, "Grouped is not set!");
			assert.strictEqual(oColumn.getShowIfGrouped(), false, "ShowIfGrouped is not set!");
			oColumn.destroy();

			// Field that can have some formatting
			oField = {
				unit: "foo"
			};
			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.ok(oColumn.getGroupHeaderFormatter(), "group header formatter is set");
			assert.strictEqual(typeof oColumn.getGroupHeaderFormatter(), "function", "group header formatter is a function");
			assert.strictEqual(oColumn.getGrouped(), false, "Grouped is not set!");
			assert.strictEqual(oColumn.getShowIfGrouped(), false, "ShowIfGrouped is not set!");
			oColumn.destroy();

			// Grouping enabled via annotations
			oField = {
				grouped: true
			};
			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.strictEqual(oColumn.getGrouped(), true, "Grouped is set!");
			assert.strictEqual(oColumn.getShowIfGrouped(), true, "ShowIfGrouped is set!");
			oColumn.destroy();
		});

		QUnit.test("test special style classes for AnalyticalColumn", function(assert) {
			var sMeasureHidden = "sapUiAnalyticalTableSumCellHidden sapUiAnalyticalTableGroupCellHidden";
			var sCurrencyBold = "sapUiCompCurrencyBold";

			// Mock a meaure field as annotated normally
			var oField = {
				isMeasureField: true,
				unit: "foo",
				aggregationRole: "measure",
				template: new Control()
			}, oColumn;

			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), false, "sMeasureHidden is not set!");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), false, "sCurrencyBold is not set!");
			oColumn.destroy();
			assert.strictEqual(oField.template.bIsDestroyed, true, "template also destyoed");

			// set field as Currency
			oField.isCurrencyField = true;
			oField.template = new Control(); // re-create destroyed control

			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), false, "sMeasureHidden is not set!");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), true, "sCurrencyBold is not set!");
			oColumn.destroy();
			assert.strictEqual(oField.template.bIsDestroyed, true, "template also destyoed");

			// set field as non-measure (analytical)
			delete oField.aggregationRole;
			oField.template = new Control(); // re-create destroyed control

			oColumn = this.oSmartTable._createAnalyticalColumn(oField, "a");
			assert.ok(oColumn instanceof AnalyticalColumn, "has to be Analytical Column");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sMeasureHidden), true, "sMeasureHidden is not set!");
			assert.strictEqual(oColumn.getTemplate().hasStyleClass(sCurrencyBold), false, "sCurrencyBold is not set!");
			oColumn.destroy();
			assert.strictEqual(oField.template.bIsDestroyed, true, "template destyoed");
		});

		QUnit.test("test _showTableFilterDialog function", function(assert) {
			var bOpenDialogWasCalled = false;
			this.oSmartTable._oPersController = {
				openDialog: function() {
					bOpenDialogWasCalled = true;
				}
			};
			this.oSmartTable._bIsFilterPanelEnabled = true;
			this.oSmartTable.setTableType("AnalyticalTable");
			this.oSmartTable._createTable();

			this.oSmartTable._oTable.fireCustomFilter({
				column: new AnalyticalColumn()
			});

			assert.ok(bOpenDialogWasCalled, "attachCustomFilter has to be registered correctly");
		});

		QUnit.test("test _updateInitialColumns function", function(assert) {
			var oColumn1 = {
				data: function() {
					return {
						columnKey: "LP1"
					};
				}
			};
			var oColumn2 = {
				data: function() {
					return {
						columnKey: "LP2"
					};
				}
			};

			var oColumn3 = {
				data: function() {
					return JSON.stringify({
						columnKey: "LP3"
					});
				}
			};

			var aColumns = [
				oColumn1, oColumn2, oColumn3
			];

			this.oSmartTable._oTable = {
				getColumns: function() {
					return aColumns;
				}
			};

			this.oSmartTable._aExistingColumns = [];
			this.oSmartTable._updateInitialColumns();

			assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP1") !== -1, "columnKey has to be retrieved from columns correctly (LP1)");
			assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP2") !== -1, "columnKey has to be retrieved from columns correctly (LP2)");
			assert.ok(this.oSmartTable._aExistingColumns.indexOf("LP3") !== -1, "columnKey has to be retrieved from columns correctly (LP3)");
		});

		QUnit.test("test _parseIndexedColumns function", function(assert) {
			var oColumn0 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 0
					}
				})
			});
			var oColumn1 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 3
					}
				})
			});
			var oColumn2 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 5
					}
				})
			});
			var oColumn3 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 6
					}
				})
			});
			var oColumn4 = new Column();

			var aColumns = [
				oColumn3, oColumn1, oColumn2, oColumn4, oColumn0
			];

			this.oSmartTable._isMobileTable = true;
			this.oSmartTable._oTable = {
				getColumns: function() {
					return aColumns;
				},
				removeColumn: function() {
				}
			};

			var aIndexedColumns = this.oSmartTable._parseIndexedColumns();

			assert.equal(aIndexedColumns.length, 4, "4 columns are indexed");
			assert.equal(aIndexedColumns[0].column.getId(), oColumn0.getId(), "column 0 has to be first in array");
			assert.equal(aIndexedColumns[0].index, 0, "column 0 has index 0");
			assert.equal(aIndexedColumns[1].column.getId(), oColumn1.getId(), "column 1 has to be second in array");
			assert.equal(aIndexedColumns[1].index, 3, "column 1 has index 3");
			assert.equal(aIndexedColumns[2].column.getId(), oColumn2.getId(), "column 2 has to be third in array");
			assert.equal(aIndexedColumns[2].index, 5, "column 2 has index 5");
			assert.equal(aIndexedColumns[3].column.getId(), oColumn3.getId(), "column 3 has to be fourth in array");
			assert.equal(aIndexedColumns[3].index, 6, "column 3 has index 6");
		});

		QUnit.test("test _parseIndexedColumns && _insertIndexedColumns via _createContent function", function(assert) {
			var oColumn0 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 0
					}
				})
			});
			var oColumn1 = new Column();
			var oColumn2 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 2
					}
				})
			});
			var oColumn3 = new Column();
			var oColumn4 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 5
					}
				})
			});
			var oColumn5 = new Column({
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnIndex: 6
					}
				})
			});

			var oTemplate0 = new Text({
				id: "oTemplate0"
			});
			var oTemplate1 = new Text({
				id: "oTemplate1"
			});
			var oTemplate2 = new Text({
				id: "oTemplate2"
			});
			var oTemplate3 = new Text({
				id: "oTemplate3"
			});
			var oTemplate4 = new Text({
				id: "oTemplate4"
			});
			var oTemplate5 = new Text({
				id: "oTemplate5"
			});

			var aColumns = [
				oColumn1, oColumn2, oColumn4, oColumn3, oColumn0, oColumn5
			];
			var aCells = [
				oTemplate1, oTemplate2, oTemplate4, oTemplate3, oTemplate0, oTemplate5
			];

			this.oSmartTable._oTemplate = new ColumnListItem({
				cells: aCells
			});

			this.oSmartTable._isMobileTable = true;
			this.oSmartTable._oTable = {
				getColumns: function() {
					return aColumns;
				},
				removeColumn: function() {
				},
				insertColumn: function() {
				},
				setFixedLayout: function() {
				},
				setContextualWidth: function() {
				},
				getMetadata: function() {
					return {
						getName: function() {
							return "ResponsiveTable";
						}
					};
				}
			};

			this.oSmartTable._updateColumnsPopinFeature = function() {
			};
			this.oSmartTable._aTableViewMetadata = [];

			this.oSmartTable._createContent();

			aCells = this.oSmartTable._oTemplate.getCells();

			assert.equal(aCells.length, 6, "there have to be 6 templates in the collection");
			assert.equal(aCells[0].getId(), oTemplate0.getId(), "template have to be moved according to column index");
			assert.equal(aCells[1].getId(), oTemplate1.getId(), "template have to be moved according to column index");
			assert.equal(aCells[2].getId(), oTemplate2.getId(), "template have to be moved according to column index");
			assert.equal(aCells[3].getId(), oTemplate3.getId(), "template have to be moved according to column index");
			assert.equal(aCells[4].getId(), oTemplate4.getId(), "template have to be moved according to column index");
			assert.equal(aCells[5].getId(), oTemplate5.getId(), "template have to be moved according to column index");

		});

		QUnit.test("test _setIgnoreFromPersonalisationToSettings function", function(assert) {

			this.oSmartTable.setIgnoreFromPersonalisation("a,b,c,d");

			var oResult = this.oSmartTable._setIgnoreFromPersonalisationToSettings(null);
			var oExpected = {
				filter: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				sort: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				columns: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				group: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				}
			};

			assert.deepEqual(oResult, oExpected, "settings have to be correct with empty settings");

			oResult = this.oSmartTable._setIgnoreFromPersonalisationToSettings({
				filter: {
					dummy: "Test"
				}
			});
			oExpected = {
				filter: {
					dummy: "Test",
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				sort: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				columns: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				},
				group: {
					ignoreColumnKeys: [
						"a", "b", "c", "d"
					]
				}
			};

			assert.deepEqual(oResult, oExpected, "settings have to be correct with prefilled settings");
		});

		QUnit.test("test _removeExpandParameter function", function(assert) {
			var sResult = this.oSmartTable._removeExpandParameter("http://myTest?$expand=a,b,c");
			assert.equal(sResult, "http://myTest");

			sResult = this.oSmartTable._removeExpandParameter("http://myTest?$expand=a,b,c&parameterB=test");
			assert.equal(sResult, "http://myTest?parameterB=test");

			sResult = this.oSmartTable._removeExpandParameter("http://myTest?parameterB=test&$expand=a,b,c");
			assert.equal(sResult, "http://myTest?parameterB=test");

			sResult = this.oSmartTable._removeExpandParameter("http://myTest?parameterB=test&$expand=a,b,c&parameterC=test");
			assert.equal(sResult, "http://myTest?parameterB=test&parameterC=test");

			sResult = this.oSmartTable._removeExpandParameter("/sap/opu/odata/sap/Z_BS_HD_DRAFT_SRV/Zfarvd_Bs_Hd_Bo?$format=xlsx&$orderby=CompanyCode%20desc,HouseBank%20asc&$select=CompanyCode%2cHouseBank%2cHouseBankName%2chousebankaccount%2cbankstatementdate%2cbankstatement%2cbankstatementnumberofitems%2ccurrency%2copeningbalanceamtintranscrcy%2cclosingbalanceamtintranscrcy%2cbankstatementstatus%2cdraftkey%2cbankstatementshortid%2cbankstatementshortid%2cIsActiveEntity%2cHasDraftEntity%2cHasActiveEntity%2cDraftAdministrativeData&$expand=DraftAdministrativeData");
			assert.equal(sResult, "/sap/opu/odata/sap/Z_BS_HD_DRAFT_SRV/Zfarvd_Bs_Hd_Bo?$format=xlsx&$orderby=CompanyCode%20desc,HouseBank%20asc&$select=CompanyCode%2cHouseBank%2cHouseBankName%2chousebankaccount%2cbankstatementdate%2cbankstatement%2cbankstatementnumberofitems%2ccurrency%2copeningbalanceamtintranscrcy%2cclosingbalanceamtintranscrcy%2cbankstatementstatus%2cdraftkey%2cbankstatementshortid%2cbankstatementshortid%2cIsActiveEntity%2cHasDraftEntity%2cHasActiveEntity%2cDraftAdministrativeData");
		});

		QUnit.test("test openPersonalisationDialog function", function(assert) {
			this.oSmartTable._oPersController = {
				openDialog: sinon.stub()
			};

			assert.strictEqual(this.oSmartTable._oPersController.openDialog.notCalled, true, "openPersonalisationDialog not yet called");

			this.oSmartTable.openPersonalisationDialog();
			assert.strictEqual(this.oSmartTable._oPersController.openDialog.notCalled, true, "openPersonalisationDialog still not yet called");

			this.oSmartTable.openPersonalisationDialog("Sort");
			assert.strictEqual(this.oSmartTable._oPersController.openDialog.calledOnce, true, "openPersonalisationDialog is now called");
			assert.strictEqual(this.oSmartTable._oPersController.openDialog.calledWith({
				sort: {
					visible: true
				}
			}), true, "openPersonalisationDialog called with settings to make sort panel visible");
		});

		QUnit.test("test 'createMessageStrip' and keep existing setting config'", function(assert) {
			//set 'usePersonalisation' to allow _createPersonalizationController
			this.oSmartTable._oPersController = undefined;
			this.oSmartTable.setUseTablePersonalisation(true);

			this.oSmartTable._bIsFilterPanelEnabled = false;

			//mock initial 'setting' for Controller
			this.oSmartTable._oP13nDialogSettings = {
				filter: {
					visible: false
				}
			};

			//create p13n Controller --> check if settings are correct
			this.oSmartTable._createPersonalizationController();
			assert.strictEqual(this.oSmartTable._oP13nDialogSettings.filter.visible, false, "Initial setting config for Controler kept");
			assert.ok(!this.oSmartTable._oP13nDialogSettings.filter.createMessageStrip, "Callback 'createMessageStrip' not provided when unnecessary");

			//create p13n Controller, but now with filtering --> check if settings are correct
			this.oSmartTable._oPersController = null;
			this.oSmartTable._bIsFilterPanelEnabled = true;
			this.oSmartTable._createPersonalizationController();
			assert.strictEqual(this.oSmartTable._oP13nDialogSettings.filter.visible, false, "Initial setting config for Controler kept");
			assert.ok(this.oSmartTable._oP13nDialogSettings.filter.createMessageStrip, "Callback 'createMessageStrip' provided when necessary");

		});

		QUnit.test("Initial noData Text - '$FILTERBAR'", function(assert) {
			var sInitialNoDataWithSmartFilter = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA");

			var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

			// Pre-Check
			assert.ok(fNoDataSpy.notCalled);
			assert.ok(!this.oSmartTable.isInitialised());

			// Initilaise control --> causes initial noData text to be updated
			this.oSmartTable.setEntitySet("COMPANYSet");
			this.oSmartTable.setInitialNoDataText("$FILTERBAR");
			this.oSmartTable.setModel(sinon.createStubInstance(ODataModel));

			// Post-Check
			assert.ok(this.oSmartTable.isInitialised());
			assert.ok(fNoDataSpy.calledOnce);
			assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithSmartFilter));
		});

		QUnit.test("Initial noData Text - '$NO_FILTERBAR' even if a filterbar is associated", function(assert) {
			var sInitialNoDataWithoutSmartFilter = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA_WITHOUT_FILTERBAR");

			var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

			// Pre-Check
			assert.ok(fNoDataSpy.notCalled);
			assert.ok(!this.oSmartTable.isInitialised());

			// Initilaise control --> causes initial noData text to be updated
			var oSmartFilterBar = new SmartFilterBar();
			this.oSmartTable.setSmartFilterId(oSmartFilterBar.getId());
			this.oSmartTable.setEntitySet("COMPANYSet");
			this.oSmartTable.setInitialNoDataText("$NO_FILTERBAR");
			this.oSmartTable.setModel(sinon.createStubInstance(ODataModel));

			// Post-Check
			assert.ok(this.oSmartTable.isInitialised());
			assert.ok(fNoDataSpy.calledOnce);
			assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithoutSmartFilter));
			oSmartFilterBar.destroy();
		});

		QUnit.test("Initial noData Text - custom text", function(assert) {
			var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");
			var sCustomInitialNoDataText = "a custom initial no data text";
			// Pre-Check
			assert.ok(fNoDataSpy.notCalled);
			assert.ok(!this.oSmartTable.isInitialised());

			// Initilaise control --> causes initial noData text to be updated
			var oSmartFilterBar = new SmartFilterBar();
			this.oSmartTable.setSmartFilterId(oSmartFilterBar.getId());
			this.oSmartTable.setEntitySet("COMPANYSet");
			this.oSmartTable.setInitialNoDataText(sCustomInitialNoDataText);
			this.oSmartTable.setModel(sinon.createStubInstance(ODataModel));

			// Post-Check
			assert.ok(this.oSmartTable.isInitialised());
			assert.ok(fNoDataSpy.calledOnce);
			assert.ok(fNoDataSpy.calledWith(sCustomInitialNoDataText));
			oSmartFilterBar.destroy();
		});

		QUnit.test("noData Texts", function(assert) {
			var sInitialNoDataWithoutSmartFilter = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA_WITHOUT_FILTERBAR");
			var sNoDataAfterDataFetch = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_RESULTS");

			var fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoData");

			// Pre-Check
			assert.ok(fNoDataSpy.notCalled);
			assert.ok(!this.oSmartTable.isInitialised());

			// Initilaise control --> causes initial noData text to be updated
			this.oSmartTable.setEntitySet("COMPANYSet");
			this.oSmartTable.setModel(sinon.createStubInstance(ODataModel));

			// Post-Check - 1
			assert.ok(this.oSmartTable.isInitialised());
			assert.ok(fNoDataSpy.calledOnce);
			assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithoutSmartFilter));

			// simulate noData text update (which is done just before binding update)
			this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
			sinon.stub(this.oSmartTable._oTable, "bindRows"); // do not actually create a binding with a fake model
			this.oSmartTable.rebindTable();

			// Post-Check - 2
			assert.ok(fNoDataSpy.calledTwice);
			assert.ok(fNoDataSpy.calledWith(sNoDataAfterDataFetch));

			// Reset Conditions for check with SmartFilterBar
			var sInitialNoDataWithSmartFilter = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_NO_DATA");
			var oSmartFilterBar = new SmartFilterBar();
			this.oSmartTable.destroy();
			this.oSmartTable = new SmartTable({
				tableType: "ResponsiveTable",
				smartFilterId: oSmartFilterBar.getId(),
				useVariantManagement: false,
				useTablePersonalisation: false
			});
			fNoDataSpy = sinon.spy(this.oSmartTable._oTable, "setNoDataText");

			// Pre-Check
			assert.ok(fNoDataSpy.notCalled);
			assert.ok(!this.oSmartTable.isInitialised());

			// Initilaise control --> causes initial noData text to be updated
			this.oSmartTable.setEntitySet("COMPANYSet");
			this.oSmartTable.setModel(sinon.createStubInstance(ODataModel));

			// Post-Check - 1
			assert.ok(this.oSmartTable.isInitialised());
			assert.ok(fNoDataSpy.calledOnce);
			assert.ok(fNoDataSpy.calledWith(sInitialNoDataWithSmartFilter));

			// simulate noData text update (which is done just before binding update)
			this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
			sinon.stub(this.oSmartTable._oTable, "bindRows"); // do not actually create a binding with a fake model
			this.oSmartTable.rebindTable();

			// Post-Check - 2
			assert.ok(fNoDataSpy.calledTwice);
			assert.ok(fNoDataSpy.calledWith(sNoDataAfterDataFetch));

			this.oSmartTable.setNoData("Custom noData text");
			assert.ok(fNoDataSpy.calledThrice);
			assert.ok(fNoDataSpy.calledWith("Custom noData text"));
		});

		QUnit.test("test get UiState function", function(assert) {
			this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
			this.oSmartTable._aAlwaysSelect = [];

			assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.notCalled);

			var oUIState = this.oSmartTable.getUiState();

			assert.ok(oUIState instanceof UIState);
			var oPresentationVariant = oUIState.getPresentationVariant();

			assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.calledOnce);
			assert.deepEqual(oPresentationVariant.RequestAtLeast, []);

			// reset spy
			this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.reset();

			this.oSmartTable.setRequestAtLeastFields("a,b,c");
			this.oSmartTable._aAlwaysSelect = [
				"d", "e", "f"
			];

			oUIState = this.oSmartTable.getUiState();
			oPresentationVariant = oUIState.getPresentationVariant();

			assert.ok(this.oSmartTable._oPersController.getDataSuiteFormatSnapshot.calledOnce);
			assert.deepEqual(oPresentationVariant.RequestAtLeast, [
				"a", "b", "c", "d", "e", "f"
			]);
		});

		QUnit.test("test set UiState function", function(assert) {
			this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
			this.oSmartTable._aAlwaysSelect = [];

			assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.notCalled);

			var oUIState = this.oSmartTable.getUiState();

			assert.ok(oUIState instanceof UIState);

			var oPresentationVariant = oUIState.getPresentationVariant();
			oPresentationVariant.RequestAtLeast = [
				"foo", "bar"
			];
			oUIState.setPresentationVariant(oPresentationVariant);

			this.oSmartTable.setUiState(oUIState);

			assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.calledOnce);
			assert.deepEqual(this.oSmartTable._aAlwaysSelect, [
				"foo", "bar"
			]);

			// Simulate a Visualization of type "LineItem" being present
			this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.reset();
			oPresentationVariant.Visualizations = [
				{
					Type: "LineItem",
					Content: [
						{
							Value: "foo"
						}
					]
				}
			];
			oUIState.setPresentationVariant(oPresentationVariant);

			this.oSmartTable.setUiState(oUIState);

			assert.ok(this.oSmartTable._oPersController.setDataSuiteFormatSnapshot.calledOnce);
			assert.deepEqual(this.oSmartTable._aAlwaysSelect, oPresentationVariant.RequestAtLeast);
		});

		QUnit.test("test set UiStateAsVariant function", function(assert) {
			this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
			this.oSmartTable._aAlwaysSelect = [];

			assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.notCalled);

			var oUIState = this.oSmartTable.getUiState();

			assert.ok(oUIState instanceof UIState);

			var oPresentationVariant = oUIState.getPresentationVariant();
			oPresentationVariant.RequestAtLeast = [
				"foo", "bar"
			];
			oUIState.setPresentationVariant(oPresentationVariant);

			this.oSmartTable.setUiStateAsVariant(oUIState);

			assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.calledOnce);
			assert.deepEqual(this.oSmartTable._aAlwaysSelect, [
				"foo", "bar"
			]);

			// Simulate a Visualization of type "LineItem" being present
			this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.reset();
			oPresentationVariant.Visualizations = [
				{
					Type: "LineItem",
					Content: [
						{
							Value: "foo"
						}
					]
				}
			];
			oUIState.setPresentationVariant(oPresentationVariant);

			this.oSmartTable.setUiStateAsVariant(oUIState);

			assert.ok(this.oSmartTable._oPersController.setPersonalizationDataAsDataSuiteFormat.calledOnce);
			assert.deepEqual(this.oSmartTable._aAlwaysSelect, oPresentationVariant.RequestAtLeast);
		});

		QUnit.test("Log error for static property change", function(assert) {
			var sInitiallyVisibleFields, sEntitySet = "COMPANYSet", oModel = sinon.createStubInstance(ODataModel);

			sInitiallyVisibleFields = "foo,bar,col2";
			this.oSmartTable.setInitiallyVisibleFields(sInitiallyVisibleFields);
			this.oSmartTable.setEntitySet(sEntitySet);
			this.oSmartTable.setUseTablePersonalisation(true);
			this.oSmartTable.setModel(oModel);

			assert.ok(this.oSmartTable.isInitialised(), "SmartTable is initialised");

			// reset error log count to get the correct error log count result
			Log.error.reset();

			var aStaticProperties = [
				"entitySet", "ignoredFields", "initiallyVisibleFields", "ignoreFromPersonalisation", "tableType",
				"useTablePersonalisation", "enableAutoBinding", "persistencyKey", "smartFilterId", "showDetailsButton", "enableAutoColumnWidth"
			];

			for (var i = 0; i < aStaticProperties.length; i++) {
				if (aStaticProperties[i] === "enableAutoBinding") {
					this.oSmartTable.setProperty(aStaticProperties[i], true);
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
				} else if (aStaticProperties[i] === "useTablePersonalisation") {
					this.oSmartTable.setProperty(aStaticProperties[i], false);
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), false, "Property changed but error logged");
				} else if (aStaticProperties[i] === "tableType") {
					this.oSmartTable.setProperty(aStaticProperties[i], "ResponsiveTable");
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), "ResponsiveTable", "Property changed but error logged");
				} else if (aStaticProperties[i] === "showDetailsButton") {
					this.oSmartTable.setProperty(aStaticProperties[i], true);
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
				} else if (aStaticProperties[i] === "enableAutoColumnWidth") {
					this.oSmartTable.setProperty(aStaticProperties[i], true);
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), true, "Property changed but error logged");
				} else {
					this.oSmartTable.setProperty(aStaticProperties[i], "Test");
					assert.equal(this.oSmartTable.getProperty(aStaticProperties[i]), "Test", "Property changed but error logged");
				}
			}

			assert.equal(Log.error.callCount, aStaticProperties.length, "Appropriate errors are logged");
			assert.deepEqual(this.oSmartTable._aStaticProperties, aStaticProperties);
		});

		QUnit.test("test deactivateColumns function", function(assert) {
			// Setup test data, stubs
			// Assume the following test data is present on the SmartTable
			this.oSmartTable._oCurrentVariant = {
				columns: {
					columnsItems: [
						{
							visible: true,
							columnKey: "a"
						}, {
							visible: false,
							columnKey: "d"
						}, {
							visible: true,
							columnKey: "e"
						}
					]
				},
				sort: {
					sortItems: [
						{
							columnKey: "a"
						}, {
							columnKey: "d",
							operation: "Descending"
						}, {
							columnKey: "e"
						}
					]
				},
				filter: {
					filterItems: [
						{
							columnKey: "a",
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "d",
							operation: "BT",
							value1: 10,
							value2: 20
						}, {
							columnKey: "e",
							operation: "BT",
							value1: 10,
							value2: 20
						}
					]
				},
				group: {
					groupItems: [
						{
							columnKey: "b"
						}
					]
				}
			};
			// Stubs
			this.oSmartTable._getPathFromColumnKeyAndProperty = function(sColumnKey) {
				return sColumnKey;
			};
			this.oSmartTable._getColumnByKey = function(sColumnKey) {
				return {
					getFilterProperty: function() {
						return sColumnKey;
					},
					data: function() {
						return {};
					},
					getHeader: function() {
						return {
							getText: function() {
								return "Header " + sColumnKey;
							}
						};
					}
				};
			};
			// P13n Stub
			this.oSmartTable._oPersController = sinon.createStubInstance(PersonalizationController);
			sinon.spy(this.oSmartTable, "deactivateColumns");
			this.oSmartTable.setRequestAtLeastFields("foo"); // request at least 1 column to force enable binding
			this.oSmartTable._isMobileTable = true; // enable grouping handling based on sorting

			// Pre Test
			assert.ok(!this.oSmartTable._aExcludedColumnKeys);
			assert.ok(this.oSmartTable._oPersController.addToSettingIgnoreColumnKeys.notCalled);
			assert.ok(this.oSmartTable.deactivateColumns.notCalled);

			// Execute API
			this.oSmartTable.deactivateColumns([
				"a", "b", "c"
			]);

			// Post Test
			assert.deepEqual(this.oSmartTable._aDeactivatedColumns, [
				"a", "b", "c"
			]);
			assert.ok(this.oSmartTable.deactivateColumns.calledOnce);
			assert.ok(this.oSmartTable._oPersController.addToSettingIgnoreColumnKeys.calledOnce);

			// Part II
			// Test after effects as a result of manual/auto rebindTable call (e.g. due to afterP13nModelDataChange event)!
			// Setup test data, stubs
			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			sinon.spy(this.oSmartTable, "_getTablePersonalisationData");

			// Pre test
			assert.ok(this.oSmartTable._getTablePersonalisationData.notCalled);

			// Execute rebindTable
			this.oSmartTable.rebindTable();

			// Post test
			assert.ok(this.oSmartTable._getTablePersonalisationData.calledOnce);
			var oResult = fBindStub.getCall(0).args[0];
			assert.equal(oResult.sorter.length, 2, "correct number of sorters");
			assert.equal(oResult.sorter[0].sPath, "d", "correct path on sorter 1");
			assert.equal(oResult.sorter[0].bDescending, true, "correct descending flag on sorter 1");
			assert.ok(!oResult.sorter[0].getGroupFunction(), "sorter is not meant for grouping");
			assert.equal(oResult.sorter[1].sPath, "e", "correct path on sorter 2");
			assert.equal(oResult.sorter[1].bDescending, false, "correct descending flag on sorter 2");
			assert.equal(oResult.filters.length, 2, "correct number of filters");
			assert.equal(oResult.filters[0].sPath, "d", "correct key on filter 1");
			assert.equal(oResult.filters[1].sPath, "e", "correct key on filter 2");

			// Part III
			// Test rebind without deactivated columns
			this.oSmartTable.deactivateColumns();
			this.oSmartTable._getTablePersonalisationData.reset();
			// Execute rebindTable
			this.oSmartTable.rebindTable();

			// Test
			assert.deepEqual(this.oSmartTable._aDeactivatedColumns, []);
			assert.ok(this.oSmartTable._getTablePersonalisationData.calledOnce);
			oResult = fBindStub.getCall(1).args[0];
			assert.equal(oResult.sorter.length, 4, "correct number of sorters");
			assert.equal(oResult.sorter[0].sPath, "b", "correct path on sorter 0");
			assert.ok(oResult.sorter[0].getGroupFunction(), "1st sorter is for grouping");
			assert.equal(oResult.sorter[0].bDescending, false, "correct descending flag on sorter 0");
			assert.equal(oResult.sorter[1].sPath, "a", "correct path on sorter 1");
			assert.equal(oResult.sorter[1].bDescending, false, "correct descending flag on sorter 1");
			assert.ok(!oResult.sorter[1].getGroupFunction(), "sorter is not meant for grouping");
			assert.equal(oResult.sorter[2].sPath, "d", "correct path on sorter 2");
			assert.equal(oResult.sorter[2].bDescending, true, "correct descending flag on sorter 2");
			assert.equal(oResult.sorter[3].sPath, "e", "correct path on sorter 3");
			assert.equal(oResult.sorter[3].bDescending, false, "correct descending flag on sorter 3");
			assert.equal(oResult.filters.length, 3, "correct number of filters");
			assert.equal(oResult.filters[0].sPath, "a", "correct key on filter 1");
			assert.equal(oResult.filters[1].sPath, "d", "correct key on filter 2");
			assert.equal(oResult.filters[2].sPath, "e", "correct key on filter 3");
		});

		QUnit.test("test bActiveHeaders for ResponsiveTable & creation of the sap.m.ResponsivePopover", function(assert) {
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();

			var oColumn1 = new Column({
				header: new Text({
					text: "Prop A"
				}),
				hAlign: "Begin"
			}).data("p13nData", {
				columnKey: "PropA",
				leadingProperty: "PropA",
				edmType: "Edm.String",
				sortProperty: "PropA",
				filterProperty: "PropA",
				type: undefined
			});
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				placeToolbarInTable: true,
				useVariantManagement: false,
				useTablePersonalisation: false,
				useExportToExcel: false
			});
			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);
			this.oSmartTable.getTable().addColumn(oColumn1);
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			assert.ok(!this.oSmartTable.getTable().bActiveHeaders, "TablePersonalisation is disabled, hence bActiveHeaders = false");
			this.oSmartTable.setUseTablePersonalisation(true);
			this.oSmartTable._createTable();
			sap.ui.getCore().applyChanges();
			assert.ok(this.oSmartTable.getTable().bActiveHeaders, "Responsive table has active headers");
			this.oSmartTable.getTable().fireEvent("columnPress", {
				column: oColumn1
			});

			assert.ok(this.oSmartTable._oColumnHeaderPopover, "ResponsivePopover created");

			var oRestorePersController = this.oSmartTable._oPersController;
			var bOpenFilterDialog = false;
			this.oSmartTable._oPersController = {
				openDialog: function() {
					bOpenFilterDialog = true;
				}
			};
			sinon.spy(this.oSmartTable, "_onCustomFilter");
			// filter button
			this.oSmartTable._oFilterButton.firePress();
			assert.ok(bOpenFilterDialog, "Filter dialog opened via _oColumnHeaderPopover");
			this.oSmartTable._oPersController = oRestorePersController;

			assert.ok(!this.oSmartTable._oColumnClicked.data("p13nData").sorted, "Column is unsorted");
			assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "No sort indicator applied");
			sinon.spy(this.oSmartTable, "_onCustomSort");
			// sort button
			this.oSmartTable._oSortButton.fireSort();
			assert.ok(this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "Sort event of the ResponsiveTable fired and ascending=true");
			// variant for sort ascending
			this.oSmartTable._oCurrentVariant = {
				sort: {
					sortItems: [
						{
							columnKey: "PropA",
							operation: "Ascending"
						}
					]
				}
			};
			this.oSmartTable._adaptCustomSort();
			assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "Ascending", "Ascending sort indicator applied");
			this.oSmartTable._oSortButton.fireSort();
			assert.ok(!this.oSmartTable._oColumnClicked.data("p13nData").sorted.ascending, "Sort event of the ResponsiveTable fired and column is sorted descending");
			// variant for sort descending
			this.oSmartTable._oCurrentVariant = {
				sort: {
					sortItems: [
						{
							columnKey: "PropA",
							operation: "Descending"
						}
					]
				}
			};
			this.oSmartTable._adaptCustomSort();
			assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "Descending", "Descending sort indicator applied");
			// variant for all the sorter are removed from the table personalisation sort dialog
			this.oSmartTable._oCurrentVariant = {};
			this.oSmartTable._adaptCustomSort();
			assert.equal(this.oSmartTable._oColumnClicked.getSortIndicator(), "None", "No sort indicator applied");
		});

		QUnit.test("Column header popover should not show the filter & sort button when p13n filter & sort panels are hidden", function(assert) {
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();

			var oColumn1 = new Column({
				header: new Text({
					text: "Prop A"
				}),
				hAlign: "Begin"
			}).data("p13nData", {
				columnKey: "PropA",
				leadingProperty: "PropA",
				edmType: "Edm.String",
				sortProperty: "PropA",
				filterProperty: "PropA",
				type: undefined
			});
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				placeToolbarInTable: true,
				useVariantManagement: false,
				useTablePersonalisation: true,
				useExportToExcel: false
			});
			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);
			this.oSmartTable.getTable().addColumn(oColumn1);
			this.oSmartTable._createTable();
			this.oSmartTable._createResponsivePopover();
			var fColumnHeaderPopoverOpenBySpy = sinon.spy(this.oSmartTable._oColumnHeaderPopover, "openBy");
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();


			// simulate p13nFilterPanel is hidden
			this.oSmartTable._bIsFilterPanelEnabled = false;

			this.oSmartTable._oTable.fireEvent("columnPress", {
				column: oColumn1
			});


			assert.strictEqual(this.oSmartTable._oFilterButton.getVisible(), false, "Filter Button is hidden from the Column header popover");
			assert.ok(fColumnHeaderPopoverOpenBySpy.called, "ColumnHeaderPopover openBy() called once");
			assert.ok(fColumnHeaderPopoverOpenBySpy.calledWith(oColumn1), "ColumnHeaderPopover was opened with the correct column instance");
			fColumnHeaderPopoverOpenBySpy.resetHistory();

			// simulate p13nSortPanel is hidden
			this.oSmartTable._bIsSortPanelEnabled = false;
			this.oSmartTable._oTable.fireEvent("columnPress", {
				column: oColumn1
			});

			assert.strictEqual(this.oSmartTable._oSortButton.getVisible(), false, "Sort Button is hidden from the Column header popover");
			assert.ok(fColumnHeaderPopoverOpenBySpy.notCalled, "ColumnHeaderPopover openBy() not called second time since, sort and filter panels both are hidden");
		});

		QUnit.test("paste and beforePaste", function(assert) {
			var done = assert.async();
			var fBeforePasteSpy = sinon.spy(this.oSmartTable, "fireBeforePaste");
			var fPasteSpy = sinon.spy(this.oSmartTable, "firePaste");

			var oTable = this.oSmartTable.getTable();

			sap.ui.require([
				"sap/ui/core/util/PasteHelper"
			], function(PasteHelper) {
				sinon.stub(PasteHelper, "parse");
				PasteHelper.parse.returns(Promise.resolve());

				// fire delayed paste event on inner UI5 table
				Promise.resolve().then(function() {
					oTable.firePaste({
						data: []
					});

					Promise.resolve().then(function() {
						// No listeners
						assert.ok(fBeforePasteSpy.notCalled);
						assert.ok(fPasteSpy.notCalled);

						var fSmartTableBeforePasteSpy = sinon.stub();

						var fSmartTablePasteSpy = function() {
							// Listener(s) attached
							assert.ok(fBeforePasteSpy.calledOnce);
							assert.ok(fPasteSpy.calledOnce);

							assert.ok(fSmartTableBeforePasteSpy.calledOnce);
							assert.ok(PasteHelper.parse.calledOnce);

							PasteHelper.parse.restore();
							// paste was called once --> end of test
							done();
						};

						this.oSmartTable.attachBeforePaste(fSmartTableBeforePasteSpy);
						this.oSmartTable.attachPaste(fSmartTablePasteSpy);

						// fire delayed paste event on inner UI5 table
						Promise.resolve().then(function() {
							// paste on inner UI5 table
							oTable.firePaste({
								data: []
							});
						});
					}.bind(this));
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("paste and beforePaste - columnInfo + parse/validation", function(assert) {
			var done = assert.async();

			var fBeforePasteSpy = sinon.spy(this.oSmartTable, "fireBeforePaste");
			var fPasteSpy = sinon.spy(this.oSmartTable, "firePaste");

			var oTable = this.oSmartTable.getTable();

			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);

			var aColumns = [
				new UIColumn({
					label: "Prop A",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropA",
					edmType: "Edm.String",
					type: "string",
					typeInstance: ODataType.getType("Edm.String")
				}), new AnalyticalColumn({
					leadingProperty: "PropB",
					label: "Prop B",
					width: "320px"
				}).data("p13nData", {
					type: "numeric",
					edmType: "Edm.Decimal",
					typeInstance: ODataType.getType("Edm.Decimal")
				}), new Column({
					header: new Text({
						text: "Prop C"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropC",
					edmType: "Edm.Decimal",
					additionalProperty: "SomeProp,SomeCurrency",
					unit: "SomeCurrency",
					precision: "10",
					scale: "3",
					type: "numeric",
					isCurrency: true,
					typeInstance: ODataType.getType("Edm.Decimal")
				}), new Column({
					header: new Text({
						text: "Prop D"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropD",
					edmType: "Edm.DateTime",
					type: undefined,
					typeInstance: ODataType.getType("Edm.DateTime")
				}), new Column({
					header: new Text({
						text: "Prop E"
					}),
					hAlign: "Right"
				}).data("p13nData", {
					leadingProperty: "PropE",
					edmType: "Edm.Decimal",
					additionalProperty: "SomeUoM",
					unit: "SomeUoM",
					precision: "10",
					scale: "2",
					type: "numeric",
					typeInstance: ODataType.getType("Edm.Decimal")
				}), new Column({
					header: new Text({
						text: "Prop F"
					})
				}).data("p13nData", {
					leadingProperty: "PropF",
					edmType: "Edm.Boolean",
					type: "boolean",
					typeInstance: ODataType.getType("Edm.Boolean")
				}), new UIColumn({
					label: "Prop G",
					width: "15em"
				}).data("p13nData", {
					leadingProperty: "PropG",
					description: "DescriptionProp",
					displayBehaviour: "descriptionAndId",
					edmType: "Edm.String",
					type: "string",
					typeInstance: ODataType.getType("Edm.String")
				}), new UIColumn({
					label: "Prop H",
					width: "5em"
				}).data("p13nData", {
					leadingProperty: "PropH",
					isDigitSequence: true,
					edmType: "Edm.String",
					type: "string",
					typeInstance: ODataType.getType("Edm.String")
				}), new UIColumn({
					label: "Prop I",
					hAlign: "Right",
					width: "10em"
				}).data("p13nData", {
					leadingProperty: "PropI",
					edmType: "Edm.String",
					type: "stringdate",
					typeInstance: ODataType.getType("Edm.String")
				}), new UIColumn({
					label: "Prop J",
					width: "10em"
				}).data("p13nData", {
					type: "custom"
				})

			];

			var fnGetColumns = sinon.stub(oTable, "getColumns");
			fnGetColumns.returns(aColumns);

			sap.ui.require([
				"sap/ui/core/util/PasteHelper"
			], function(PasteHelper) {
				sinon.spy(PasteHelper, "parse");

				var fSmartTableBeforePasteSpy = sinon.stub();
				var fSmartTablePasteSpy = function(oEvt) {
					var oResult = oEvt.getParameter("result");
					// Listener(s) attached
					assert.ok(fBeforePasteSpy.calledOnce);
					assert.ok(fBeforePasteSpy.calledWith(sinon.match.has("columnInfos", sinon.match(function(aCols) {
						// BeforePaste contains additional columns for desc, uom, currency
						return aCols.length === aColumns.length + 3;
					}))));
					assert.ok(fPasteSpy.calledOnce);

					assert.ok(fSmartTableBeforePasteSpy.calledOnce);
					assert.ok(PasteHelper.parse.calledOnce);
					assert.ok(oResult);

					PasteHelper.parse.restore();
					// paste was called once --> end of test
					done();
				};

				this.oSmartTable.attachBeforePaste(fSmartTableBeforePasteSpy);
				this.oSmartTable.attachPaste(fSmartTablePasteSpy);

				// fire delayed paste event on inner UI5 table
				Promise.resolve().then(function() {
					// simulate paste on inner UI5 table
					oTable.firePaste({
						data: [
							[
								"Aa", "100.278", "50.50", "EUR", "05 Mar 2019, 17:04:12", "12", "Kg", "Yes", "Id G", "Desc G", "H", "20190503"
							]
						]
					});
				});
			}.bind(this));
		});

		QUnit.test("Destroy for ResponsiveTable without binding", function(assert) {
			var bTableTemplateDestroyed = false;
			this.oSmartTable._oTemplate = {
				destroy: function() {
					bTableTemplateDestroyed = true;
				}
			};

			assert.equal(this.oSmartTable.bIsDestroyed, undefined);
			assert.ok(!bTableTemplateDestroyed, "table template exits");
			this.oSmartTable.destroy();
			assert.equal(this.oSmartTable._oTemplate, null);
			assert.strictEqual(this.oSmartTable.bIsDestroyed, true);
			assert.ok(bTableTemplateDestroyed, "table template has to be destroyed");
		});

		QUnit.test("Destroy", function(assert) {
			var bTableProviderDestroyed = false;
			var bPersControllerDestroyed = false;
			var bVariantManagementDestroyed = false;
			this.oSmartTable._oTableProvider = {
				destroy: function() {
					bTableProviderDestroyed = true;
				}
			};

			this.oSmartTable._oPersController = {
				destroy: function() {
					bPersControllerDestroyed = true;
				}
			};

			this.oSmartTable._oVariantManagement = {
				destroy: function() {
					bVariantManagementDestroyed = true;
				},
				isPageVariant: function() {
					return false;
				},
				detachInitialise: function() {
				},
				detachAfterSave: function() {
				},
				detachSave: function() {
				}
			};

			assert.equal(this.oSmartTable.bIsDestroyed, undefined);
			this.oSmartTable.destroy();
			assert.equal(this.oSmartTable._oTableProvider, null);
			assert.equal(this.oSmartTable._aTableViewMetadata, null);
			assert.strictEqual(this.oSmartTable.bIsDestroyed, true);
			assert.ok(bTableProviderDestroyed, "table provider has to be destroyed");
			assert.ok(bPersControllerDestroyed, "pers controller has to be destroyed");
			assert.ok(bVariantManagementDestroyed, "variant management has to be destroyed");
		});

		QUnit.test("Invisible columns of the sap.m.Table", function(assert) {
			this.oSmartTable.destroy();

			var oColumn1 = new Column().data("p13nData", {
				columnKey: "PropA",
				leadingProperty: "PropA"
			});
			var oColumn2 = new Column({
				visible: false
			}).data("p13nData", {
				columnKey: "PropB",
				leadingProperty: "PropB"
			});
			var oTemplate = new ColumnListItem({
				cells: [
					new Text(), new Text()
				]
			});
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable"
			});
			this.oSmartTable.getTable().addColumn(oColumn1);
			this.oSmartTable.getTable().addColumn(oColumn2);
			this.oSmartTable._createTable();
			this.oSmartTable._oTemplate = oTemplate;

			this.oSmartTable.rebindTable();
			assert.strictEqual(oTemplate.getCells()[1].getBindingContext(), null, "Invisible columns binding context is set to null");

			oColumn2.setVisible(true);
			this.oSmartTable.rebindTable();
			assert.strictEqual(oTemplate.getCells()[1].getBindingContext(), undefined, "Visible columns binding context is set to undefined");

			oColumn1.setVisible(false);
			oTemplate.removeCell(oTemplate.getCells()[0]);
			this.oSmartTable.rebindTable();
			assert.strictEqual(oTemplate.getCells()[0].getBindingContext(), undefined, "Mismatch between columns and cells: The cells binding context is still undefined");

			this.oSmartTable.destroy();
		});

		QUnit.test("test keyboard shortcut CTRL + SHIFT + E opens the export settings dialog", function(assert) {
			var oColumn1 = new Column({
				header: new Text({
					text: "Prop A"
				}),
				hAlign: "Begin"
			}).data("p13nData", {
				columnKey: "PropA",
				leadingProperty: "PropA",
				edmType: "Edm.String",
				sortProperty: "PropA",
				filterProperty: "PropA",
				type: undefined
			});
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable"
			});
			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);
			this.oSmartTable.setUseExportToExcel(true);
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._createToolbar();
			this.oSmartTable._createToolbarContent();

			this.oSmartTable.getTable().addColumn(oColumn1);
			this.oSmartTable.placeAt("qunit-fixture");

			sap.ui.getCore().applyChanges();

			sinon.stub(this.oSmartTable, "_openExportSettings");

			assert.notOk(this.oSmartTable._oUseExportToExcel.getEnabled(), "Export button is disabled");

			// trigger CTRL + SHIFT + E keyboard shortcut
			qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.E, true, false, true);
			assert.notOk(this.oSmartTable._openExportSettings.called, "Export settings dialog not opened as the _oUseExportToExcel is disabled");

			this.oSmartTable._oUseExportToExcel.setEnabled(true);

			// trigger CTRL + SHIFT + E keyboard shortcut
			qutils.triggerKeydown(this.oSmartTable.getDomRef(), KeyCodes.E, true, false, true);
			assert.ok(this.oSmartTable._openExportSettings.called, "Export settings dialog opened");

			this.oSmartTable._openExportSettings.restore();
			this.oSmartTable.destroy();
		});

		QUnit.test("test demandPopin and autoPopinMode mapping for ResponsiveTable", function(assert) {
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true
			});
			this.oSmartTable.placeAt("qunit-fixture");
			this.oSmartTable._createTable();
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._isMobileTable = true;
			sap.ui.getCore().applyChanges();
			assert.ok(this.oSmartTable.getTable().getAutoPopinMode(), "autoPopinMode=true as demandPopin=true");

			this.oSmartTable.setDemandPopin(false);
			sap.ui.getCore().applyChanges();
			assert.notOk(this.oSmartTable.getTable().getAutoPopinMode(), "autoPopinMode=false as demandPopin=false");
		});

		QUnit.test("test enableAutoColumnWidth for ResponsiveTable", function(assert) {
			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				enableAutoColumnWidth: true
			});
			this.oSmartTable.placeAt("qunit-fixture");

			this.oSmartTable._aTableViewMetadata = [{
				name: "PropA",
				isInitiallyVisible: true,
				width: "5rem",
				template: new Text()
			}];

			var clock = sinon.useFakeTimers();
			this.oSmartTable._createContent();
			this.oSmartTable.bIsInitialised = true;
			this.oSmartTable._isMobileTable = true;
			sap.ui.getCore().applyChanges();

			clock.tick(1);

			var oColumn = this.oSmartTable.getTable().getColumns()[0];
			var oResizer = this.oSmartTable.getTable().getDependents()[0];

			assert.ok(this.oSmartTable.getDemandPopin(), "ST.demandPopin=true");
			assert.ok(this.oSmartTable.getTable().getAutoPopinMode(), "RT.autoPopinMode=true");
			assert.equal(this.oSmartTable.getTable().getFixedLayout(), "Strict", "RT.fixedLayout=Strict");
			assert.equal(this.oSmartTable.getTable().getContextualWidth(), "auto", "RT.contextualWidth=auto");
			assert.ok(oResizer.isA("sap.m.plugins.ColumnResizer"), "RT.ColumnResizer plugin is added");
			assert.notOk(oColumn.getHeader().getWrapping(), "RT.column.wrapping=false");

			// simulate matchMedia "matches" to return true
			var fnMatchMediaOriginal = window.matchMedia;
			window.matchMedia = sinon.stub();
			window.matchMedia.returns({
				matches: true
			});

			this.oSmartTable.getTable().fireEvent("columnPress", {
				column: oColumn
			});

			var oCHP = this.oSmartTable._oColumnHeaderPopover;
			var oResizeItem = oCHP.getItems().pop();
			var oStartResizingSpy = sinon.spy(oResizer, "startResizing");

			oResizeItem.firePress();
			assert.ok(oStartResizingSpy.calledOnce, "ColumnResizer#startResizing is called");
			assert.ok(oStartResizingSpy.calledWith(oColumn.getDomRef()), "ColumnResizer#startResizing is called with Column Dom");

			// restore original window.matchMedia
			window.matchMedia = fnMatchMediaOriginal;
			clock.restore();
		});

		QUnit.test("test showDetailsButton mapping for ResponsiveTable", function(assert) {
			// var done = assert.async();
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();
			var clock = sinon.useFakeTimers();

			var aColumns = [
				new Column({
					header: new Text({
						text: "Column A"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnA",
					leadingProperty: "ColumnA",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column B"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnB",
					leadingProperty: "ColumnB",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column C"
					}),
					hAlign: "Begin",
					importance: "Medium"
				}).data("p13nData", {
					columnKey: "ColumnC",
					leadingProperty: "ColumnC",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column D"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnD",
					leadingProperty: "ColumnD",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column E"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnE",
					leadingProperty: "ColumnE",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column F"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnF",
					leadingProperty: "ColumnF",
					edmType: "Edm.String",
					type: "string"
				})
			];

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true,
				tableBindingPath: "/testPath",
				beforeRebindTable: function(oEvent) {
					var mBindingParams = oEvent.getParameter("bindingParams");
					mBindingParams.parameters.select = "Foo";
				}
			});

			var oModel = new JSONModel();
			oModel.setData({
				testPath: [
					{test: "Test1"}, {test: "Test2"}, {test: "Test3"}, {test: "Test4"}, {test: "Test5"}
				]
			});
			this.oSmartTable.setModel(oModel);

			aColumns.forEach(function(oColumn) {
				this.oSmartTable._oTable.addColumn(oColumn);
			}.bind(this));

			this.oSmartTable._createTable();
			this.oSmartTable._createToolbarContent();

			this.oSmartTable._oTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					})
				]
			});

			this.oSmartTable.rebindTable();
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			clock.tick(1);

			assert.ok(this.oSmartTable.getShowDetailsButton(), "showDetailsButton=true");
			assert.notOk(this.oSmartTable._oShowHideDetailsButton.getVisible(), "All columns are visible. Button 'Show / Hide Details' is hidden");

			this.oSmartTable._oTable.setContextualWidth("Phone");
			sap.ui.getCore().applyChanges();
			clock.tick(1);
			assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "Button 'Show / Hide Details' is visible");
			assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getText(), "Show Details", "Button text='Show Details'");
			assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin()[0], "Low", "ResponsiveTable property hiddenInPopin=['Low']");

			this.oSmartTable._oShowHideDetailsButton.firePress();
			sap.ui.getCore().applyChanges();
			clock.tick(1);
			assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getText(), "Hide Details", "Button text='Hide Details'");
			assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin().length,0, "ResponsiveTable property hiddenInPopin=[]");

			this.oSmartTable._oShowHideDetailsButton.firePress();
			sap.ui.getCore().applyChanges();
			clock.tick(1);
			assert.strictEqual(this.oSmartTable._oShowHideDetailsButton.getText(), "Show Details", "Button text='Show Details'");
			assert.strictEqual(this.oSmartTable._oTable.getHiddenInPopin()[0], "Low", "ResponsiveTable property hiddenInPopin=['Low']");
			clock.restore();
		});

		QUnit.test("test showDetaisButton visibility when no data", function(assert) {
			var done = assert.async();
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();

			var aColumns = [
				new Column({
					header: new Text({
						text: "Column A"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnA",
					leadingProperty: "ColumnA",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column B"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnB",
					leadingProperty: "ColumnB",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column C"
					}),
					hAlign: "Begin",
					importance: "Medium"
				}).data("p13nData", {
					columnKey: "ColumnC",
					leadingProperty: "ColumnC",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column D"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnD",
					leadingProperty: "ColumnD",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column E"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnE",
					leadingProperty: "ColumnE",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column F"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnF",
					leadingProperty: "ColumnF",
					edmType: "Edm.String",
					type: "string"
				})
			];

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true,
				tableBindingPath: "/testPath",
				beforeRebindTable: function(oEvent) {
					var mBindingParams = oEvent.getParameter("bindingParams");
					mBindingParams.parameters.select = "Foo";
				}
			});

			var oModel = new JSONModel();
			oModel.setData({
				testPath: [
					{test: "Test1"}, {test: "Test2"}, {test: "Test3"}, {test: "Test4"}, {test: "Test5"}
				]
			});
			this.oSmartTable.setModel(oModel);

			aColumns.forEach(function(oColumn) {
				this.oSmartTable._oTable.addColumn(oColumn);
			}.bind(this));

			this.oSmartTable._createTable();
			this.oSmartTable._createToolbarContent();

			this.oSmartTable._oTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					}),
					new Text({
						text: "{test}"
					})
				]
			});

			var clock = sinon.useFakeTimers();
			this.oSmartTable.rebindTable();
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSmartTable._oTable.attachEventOnce("popinChanged", function() {
				assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "button is visible since table has popins");

				this.oSmartTable._oTable.attachEventOnce("popinChanged", function() {
					assert.notOk(this.oSmartTable._oShowHideDetailsButton.getVisible(), "button is hidden since there are no visible items");

					this.oSmartTable._oTable.attachEventOnce("popinChanged", function() {
						assert.ok(this.oSmartTable._oShowHideDetailsButton.getVisible(), "button is visible since items are visible and popins are available");
						done();
					}, this);

					this.oSmartTable._oTable.getBinding("items").filter();
					clock.tick(1);
				}, this);

				this.oSmartTable._oTable.getBinding("items").filter(new Filter("test", "EQ", "Foo"));
				clock.tick(1);
			}, this);

			this.oSmartTable._oTable.setContextualWidth("Phone");
			clock.tick(1);
		});

		QUnit.test("test showDetailsButton mapping for ResponsiveTable on phone", function(assert) {
			// save original state
			var bDesktop = Device.system.desktop;
			var bTablet = Device.system.tablet;
			var bPhone = Device.system.phone;

			// overwrite for our test case
			Device.system.desktop = false;
			Device.system.tablet = false;
			Device.system.phone = true;
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();

			var aColumns = [
				new Column({
					header: new Text({
						text: "Column A"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnA",
					leadingProperty: "ColumnA",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column B"
					}),
					hAlign: "Begin",
					importance: "None"
				}).data("p13nData", {
					columnKey: "ColumnB",
					leadingProperty: "ColumnB",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column C"
					}),
					hAlign: "Begin",
					importance: "Medium"
				}).data("p13nData", {
					columnKey: "ColumnC",
					leadingProperty: "ColumnC",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column D"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnD",
					leadingProperty: "ColumnD",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column E"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnE",
					leadingProperty: "ColumnE",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column F"
					}),
					hAlign: "Begin",
					importance: "None"
				}).data("p13nData", {
					columnKey: "ColumnF",
					leadingProperty: "ColumnF",
					edmType: "Edm.String",
					type: "string"
				})
			];

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true
			});

			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);

			aColumns.forEach(function(oColumn) {
				this.oSmartTable._oTable.addColumn(oColumn);
			}.bind(this));

			this.oSmartTable._createTable();
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			var aImportance = this.oSmartTable._oTable.getHiddenInPopin();
			assert.strictEqual(aImportance.length, 2, "ResponsiveTable property hiddenInPopin.length = 2");
			assert.strictEqual(aImportance[0], "Low", "ResponsiveTable property hiddenInPopin[0] = 'Low'");
			assert.strictEqual(aImportance[1], "Medium", "ResponsiveTable property hiddenInPopin[1] = 'Medium'");

			// reset original state
			Device.system.desktop = bDesktop;
			Device.system.tablet = bTablet;
			Device.system.phone = bPhone;
		});

		QUnit.test("test detailsButtonSetting - overwrite default configuration of showDetailsButton", function(assert) {
			// save original state
			var bDesktop = Device.system.desktop;
			var bTablet = Device.system.tablet;
			var bPhone = Device.system.phone;

			// overwrite for our test case
			Device.system.desktop = false;
			Device.system.tablet = false;
			Device.system.phone = true;
			// Destroy the current SmartTable instance and create the SmartTable inline
			this.oSmartTable.destroy();

			var aColumns = [
				new Column({
					header: new Text({
						text: "Column A"
					}),
					hAlign: "Begin",
					importance: "High"
				}).data("p13nData", {
					columnKey: "ColumnA",
					leadingProperty: "ColumnA",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column B"
					}),
					hAlign: "Begin",
					importance: "None"
				}).data("p13nData", {
					columnKey: "ColumnB",
					leadingProperty: "ColumnB",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column C"
					}),
					hAlign: "Begin",
					importance: "Medium"
				}).data("p13nData", {
					columnKey: "ColumnC",
					leadingProperty: "ColumnC",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column D"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnD",
					leadingProperty: "ColumnD",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column E"
					}),
					hAlign: "Begin",
					importance: "Low"
				}).data("p13nData", {
					columnKey: "ColumnE",
					leadingProperty: "ColumnE",
					edmType: "Edm.String",
					type: "string"
				}),
				new Column({
					header: new Text({
						text: "Column F"
					}),
					hAlign: "Begin",
					importance: "None"
				}).data("p13nData", {
					columnKey: "ColumnF",
					leadingProperty: "ColumnF",
					edmType: "Edm.String",
					type: "string"
				})
			];

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true,
				detailsButtonSetting: ["Medium","High"]
			});

			var oModel = sinon.createStubInstance(ODataModel);
			this.oSmartTable.setModel(oModel);

			aColumns.forEach(function(oColumn) {
				this.oSmartTable._oTable.addColumn(oColumn);
			}.bind(this));

			this.oSmartTable._createTable();
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			var aImportance = this.oSmartTable._oTable.getHiddenInPopin();
			assert.strictEqual(aImportance.length, 2, "ResponsiveTable property hiddenInPopin.length = 2");
			assert.notEqual(aImportance[0], "Low", "Default importance 'Low' is overwritten");
			assert.notEqual(aImportance[1], "Medium", "Default importance 'Medium' is overwritten");
			assert.strictEqual(aImportance[0], "Medium", "ResponsiveTable property hiddenInPopin[0] = 'Medium'");
			assert.strictEqual(aImportance[1], "High", "ResponsiveTable property hiddenInPopin[1] = 'High'");

			// reset original state
			Device.system.desktop = bDesktop;
			Device.system.tablet = bTablet;
			Device.system.phone = bPhone;
		});

		QUnit.module("SmartTable - DataStateIndicator", {
			beforeEach: function() {
				if (this.oSmartTable) {
					this.oSmartTable.destroy();
				}

				this.oPromise = Promise.resolve();
				this.oSmartTable = new SmartTable({
					entitySet: "foo",
					beforeRebindTable: [function(oEvent) {
						this._bMessageFilterActive = oEvent.getParameter("messageFilterActive");
						return this.oPromise;
					}, this]
				});

				this.oDataStateIndicator = new DataStateIndicator();
				this.oModel = sinon.createStubInstance(ODataModel);
				this.oSmartTable.setModel(this.oModel);
			},
			afterEach: function() {
				this.oSmartTable.destroy();
				this.oDataStateIndicator.destroy();
			}
		});

		QUnit.test("test DataStateIndicator, InfoToolbar and p13nMessageStrip in responsive table", function(assert) {
			var done = assert.async(),
				oTable = new Table({
					columns: [
						new Column({
							header: new Text({
								text: "Column A"
							}),
							hAlign: "Begin",
							importance: "High"
						}).data("p13nData", {
							columnKey: "ColumnA",
							leadingProperty: "ColumnA",
							edmType: "Edm.String",
							type: "string"
						})
					],
					dependents: [
						this.oDataStateIndicator
					]
				});

			this.oSmartTable.addItem(oTable);
			this.oSmartTable._createTable();
			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			this.oSmartTable._createContent();
			this.oSmartTable.rebindTable();

			var aMessages = [
				new Message({
					message: "A message",
					fullTarget: "/apath/somesubpath",
					target: "/apath/somesubpath",
					type: "Error"
				})
			];
			var oDataState = {
				getChanges: function(){
					return {messages: aMessages};
				},
				getMessages: function(){
					return aMessages;
				}
			};

			var oListBinding = sinon.createStubInstance(ODataListBinding);
			oListBinding.getPath = function() {return "/apath";};
			oListBinding.getDataState = function() {return oDataState;};

			var oBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
			oBindingStub.returns(oListBinding);
			var oInnerBindingStub = sinon.stub(this.oSmartTable._oTable, "getBinding");
			oInnerBindingStub.returns(oListBinding);

			var oErrorMessage = {
				oValue1: "11",
				oValue2: undefined,
				sOperator: "EQ",
				sPath: "Key1",
				_bMultiFilter: false
			};

			// simulate error message
			this.oDataStateIndicator._processDataState(oDataState);

			this.oPromise.then(function() {
				var pFilterMessageResolve = Promise.resolve(oErrorMessage);
				var fnShowTableFilterDialogSpy = sinon.spy(this.oSmartTable, "_showTableFilterDialog");
				oListBinding.requestFilterForMessages.returns(pFilterMessageResolve);

				this.oSmartTable.setEnableDataStateFiltering(true);
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "Messagestrip Link created and visible");
				assert.notOk(this.oSmartTable._oInfoToolbar, "InfoToolbar not created");
				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
				assert.strictEqual(this._bMessageFilterActive, false, "Message filter is not active");
				this.oDataStateIndicator.fireEvent("messageLinkPressed");

				pFilterMessageResolve.then(function() {
					assert.strictEqual(this._bMessageFilterActive, true, "Message filter is active");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), true, "InfoToolBar created");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getContent()[0].getText(), "Filtered By: Errors", "Correct InfoText shown");
					assert.deepEqual(this.oSmartTable._oMessageFilter, oErrorMessage, "Expected MessageFilter set");
					this.oSmartTable._oInfoToolbar.firePress();
					assert.ok(fnShowTableFilterDialogSpy.called, "Personalization filter dialog opened");

					this.oDataStateIndicator.fireEvent("messageLinkPressed");
					assert.strictEqual(this._bMessageFilterActive, false, "Message filter is not active");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					assert.notOk(this.oSmartTable._oMessageFilter, "MessageFilter not set");
					assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
					assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "MessageStrip text changed to Filter Items");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					this.oSmartTable.setEnableDataStateFiltering(false);
					assert.strictEqual(this.oSmartTable._oDataStateIndicator, null, "DataStateIndicator removed");
					fBindStub.restore();
					oBindingStub.restore();
					oInnerBindingStub.restore();
					done();
				}.bind(this));
				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), true, "P13nMessageStrip created and visible");
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Clear Filter", "MessageStrip text changed to Clear Filter");
			}.bind(this));
		});

		QUnit.test("test DataStateIndicator for multiple error message, InfoToolbar and p13nMessageStrip in responsive table", function(assert) {
			var done = assert.async(),
				oTable = new Table({
					columns: [
						new Column({
							header: new Text({
								text: "Column A"
							}),
							hAlign: "Begin",
							importance: "High"
						}).data("p13nData", {
							columnKey: "ColumnA",
							leadingProperty: "ColumnA",
							edmType: "Edm.String",
							type: "string"
						})
					],
					dependents: [
						this.oDataStateIndicator
					]
				});

			this.oSmartTable.addItem(oTable);
			this.oSmartTable._createTable();
			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			this.oSmartTable._createContent();
			this.oSmartTable.rebindTable();

			var aMessages = [
				new Message({
					message: "A message",
					fullTarget: "/apath/somesubpath",
					target: "/apath/somesubpath",
					type: "Error"
				}),
				new Message({
					message: "A message",
					fullTarget: "/apath/somesubpath",
					target: "/apath/somesubpath",
					type: "Warning"
				})
			];
			var oDataState = {
				getChanges: function(){
					return {messages: aMessages};
				},
				getMessages: function(){
					return aMessages;
				}
			};

			var oListBinding = sinon.createStubInstance(ODataListBinding);
			oListBinding.getPath = function() {return "/apath";};
			oListBinding.getDataState = function() {return oDataState;};

			var oBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
			oBindingStub.returns(oListBinding);
			var oInnerBindingStub = sinon.stub(this.oSmartTable._oTable, "getBinding");
			oInnerBindingStub.returns(oListBinding);

			var oErrorMessage = {aFilters: [
				{
					oValue1: "11",
					oValue2: undefined,
					sOperator: "EQ",
					sPath: "Key1",
					_bMultiFilter: false
				},
				{
					oValue1: "11",
					oValue2: undefined,
					sOperator: "EQ",
					sPath: "Key1",
					_bMultiFilter: false
				}]
			};

			// simulate error message
			this.oDataStateIndicator._processDataState(oDataState);

			this.oPromise.then(function() {
				var pFilterMessageResolve = Promise.resolve(oErrorMessage);
				var fnShowTableFilterDialogSpy = sinon.spy(this.oSmartTable, "_showTableFilterDialog");
				oListBinding.requestFilterForMessages.returns(pFilterMessageResolve);

				this.oSmartTable.setEnableDataStateFiltering(true);
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "Messagestrip Link created and visible");
				assert.notOk(this.oSmartTable._oInfoToolbar, "InfoToolbar not created");
				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
				this.oDataStateIndicator.fireEvent("messageLinkPressed");

				pFilterMessageResolve.then(function() {
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), true, "InfoToolBar created");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getContent()[0].getText(), "Filtered By: Issues", "Correct InfoText shown");
					assert.deepEqual(this.oSmartTable._oMessageFilter, oErrorMessage, "Expected MessageFilter set");
					this.oSmartTable._oInfoToolbar.firePress();
					assert.ok(fnShowTableFilterDialogSpy.called, "Personalization filter dialog opened");

					this.oDataStateIndicator.fireEvent("messageLinkPressed");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					assert.notOk(this.oSmartTable._oMessageFilter, "MessageFilter not set");
					assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
					assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "MessageStrip text changed to Filter Items");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					this.oSmartTable.setEnableDataStateFiltering(false);
					assert.strictEqual(this.oSmartTable._oDataStateIndicator, null, "DataStateIndicator removed");
					fBindStub.restore();
					oBindingStub.restore();
					oInnerBindingStub.restore();
					done();
				}.bind(this));

				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), true, "P13nMessageStrip created and visible");
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Clear Filter", "MessageStrip text changed to Clear Filter");
			}.bind(this));
		});

		QUnit.test("test DataStateIndicator, InfoToolbar and p13nMessageStrip in Grid table", function(assert) {
			var done = assert.async(),
				oTable = new UITable({
					columns: [
						new UIColumn({
							label: "Prop A",
							width: "10em"
						}).data("p13nData", {
							leadingProperty: "PropA",
							edmType: "Edm.String",
							type: "string"
						})
					],
					dependents: [
						this.oDataStateIndicator
					]
				});

			this.oSmartTable.addItem(oTable);
			this.oSmartTable._createTable();
			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			this.oSmartTable._createContent();
			this.oSmartTable.rebindTable();

			var aMessages = [
				new Message({
					message: "A message",
					fullTarget: "/apath/somesubpath",
					target: "/apath/somesubpath",
					type: "Information"
				})
			];
			var oDataState = {
				getChanges: function(){
					return {messages: aMessages};
				},
				getMessages: function(){
					return aMessages;
				}
			};

			var oListBinding = sinon.createStubInstance(ODataListBinding);
			oListBinding.getPath = function() {return "/apath";};
			oListBinding.getDataState = function() {return oDataState;};

			var oBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
			oBindingStub.returns(oListBinding);
			var oInnerBindingStub = sinon.stub(this.oSmartTable._oTable, "getBinding");
			oInnerBindingStub.returns(oListBinding);

			var oErrorMessage = {
				oValue1: "11",
				oValue2: undefined,
				sOperator: "EQ",
				sPath: "Key1",
				_bMultiFilter: false
			};

			// simulate error message
			this.oDataStateIndicator._processDataState(oDataState);

			this.oPromise.then(function() {
				var pFilterMessageResolve = Promise.resolve(oErrorMessage);
				var fnShowTableFilterDialogSpy = sinon.spy(this.oSmartTable, "_showTableFilterDialog");

				oListBinding.requestFilterForMessages.returns(pFilterMessageResolve);
				this.oSmartTable.setEnableDataStateFiltering(true);
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "Messagestrip Link created and visible");
				assert.notOk(this.oSmartTable._oInfoToolbar, "InfoToolbar not created");
				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
				this.oDataStateIndicator.fireEvent("messageLinkPressed");

				pFilterMessageResolve.then(function() {
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), true, "InfoToolBar created");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getContent()[0].getText(), "Filtered By: Notifications", "Correct InfoText shown");
					assert.deepEqual(this.oSmartTable._oMessageFilter, oErrorMessage, "Expected MessageFilter set");
					this.oSmartTable._oInfoToolbar.firePress();
					assert.ok(fnShowTableFilterDialogSpy.called, "Personalization filter dialog opened");

					this.oDataStateIndicator.fireEvent("messageLinkPressed");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					assert.notOk(this.oSmartTable._oMessageFilter, "MessageFilter not set");
					assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), false, "P13nMessageStrip not visible");
					assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Filter Items", "MessageStrip text changed to Filter Items");
					assert.strictEqual(this.oSmartTable._oInfoToolbar.getVisible(), false, "InfoToolBar not visible");
					this.oSmartTable.setEnableDataStateFiltering(false);
					assert.strictEqual(this.oSmartTable._oDataStateIndicator, null, "DataStateIndicator removed");
					fBindStub.restore();
					oBindingStub.restore();
					oInnerBindingStub.restore();
					done();
				}.bind(this));

				assert.strictEqual(this.oSmartTable._getP13nFilterMessageStrip().getVisible(), true, "P13nMessageStrip created and visible");
				assert.strictEqual(this.oDataStateIndicator.getMessageLinkText(), "Clear Filter", "MessageStrip text changed to Clear Filter");
			}.bind(this));
		});

		QUnit.test("BCP 2080356629 - No rebind required on dataStateChange when no message filter is applied", function(assert) {

			this.oDataStateIndicator.setFilter(function() {
				return false;
			});

			var done = assert.async(),
				oTable = new Table({
					columns: [
						new Column({
							header: new Text({
								text: "Column A"
							}),
							hAlign: "Begin",
							importance: "High"
						}).data("p13nData", {
							columnKey: "ColumnA",
							leadingProperty: "ColumnA",
							edmType: "Edm.String",
							type: "string"
						})
					],
					dependents: [
						this.oDataStateIndicator
					]
				});

			this.oSmartTable.addItem(oTable);
			this.oSmartTable._createTable();
			var fBindStub = sinon.stub(this.oSmartTable._oTable, "bindRows");
			this.oSmartTable._createContent();
			this.oSmartTable.rebindTable();

			var aMessages = [
				new Message({
					message: "A message",
					fullTarget: "/apath/somesubpath",
					target: "/apath/somesubpath",
					type: "Information"
				})
			];
			var oDataState = {
				getChanges: function(){
					return {messages: aMessages};
				},
				getMessages: function(){
					return aMessages;
				}
			};

			var oListBinding = sinon.createStubInstance(ODataListBinding);
			oListBinding.getPath = function() {return "/apath";};
			oListBinding.getDataState = function() {return oDataState;};

			var oBindingStub = sinon.stub(this.oSmartTable, "_getRowBinding");
			oBindingStub.returns(oListBinding);
			var oInnerBindingStub = sinon.stub(this.oSmartTable._oTable, "getBinding");
			oInnerBindingStub.returns(oListBinding);

			var oRebindSpy = sinon.spy(this.oSmartTable, "rebindTable");

			// simulate error message
			this.oDataStateIndicator._processDataState(oDataState);

			this.oPromise.then(function() {
				this.oSmartTable.setEnableDataStateFiltering(true);

				Promise.resolve("").then(function() {
					assert.ok(!oRebindSpy.called, "Rebind is not performed");

					fBindStub.restore();
					oBindingStub.restore();
					oInnerBindingStub.restore();
					oRebindSpy.restore();
					done();
				});
			}.bind(this));
		});

		QUnit.test("Header Level Property added", function(assert) {
			assert.strictEqual(this.oSmartTable.getHeaderLevel(), "Auto", "Header level set to the header");
			this.oSmartTable.setHeaderLevel("H2");
			this.oSmartTable.setHeader("Test Table");
			assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getLevel(), "H2", "Header level changed");
			var oToolbar = new Toolbar();
			this.oSmartTable.setCustomToolbar(oToolbar);
			this.oSmartTable.setHeader("Custom ToolBar");
			this.oSmartTable.setHeaderLevel("H3");
			assert.strictEqual(this.oSmartTable.getToolbar().getContent()[0].getLevel(), "H3", "Header level set to the Custom Toolbar");
		});

		QUnit.module("SmartTable - Accessibility", {
			beforeEach: function() {
				if (this.oSmartTable) {
					this.oSmartTable.destroy();
				}
			},
			afterEach: function() {
				this.oSmartTable.destroy();
			}
		});

		QUnit.test("ACC Announcement of table after a FilterBar search", function(assert) {
			var clock = sinon.useFakeTimers();
			var oSmartFilterBar = new SmartFilterBar();

			this.oSmartTable = new SmartTable({
				entitySet: "foo",
				tableType: "ResponsiveTable",
				demandPopin: true,
				showDetailsButton: true,
				tableBindingPath: "/testPath",
				smartFilterId: oSmartFilterBar.getId()
			});

			this.oSmartTable._oTable.addColumn(new Column({
				header: new Text({
					text: "Name"
				}),
				hAlign: "Begin",
				importance: "High"
			}).data("p13nData", {
				columnKey: "name",
				leadingProperty: "name",
				edmType: "Edm.String",
				type: "string"
			}));

			var oModel = new JSONModel();
			oModel.setData({
				testPath: [
					{"name": "A"},
					{"name": "B"},
					{"name": "C"},
					{"name": "D"},
					{"name": "A"}
				]
			});

			var fnUpdateTableAnnouncement = sinon.spy(this.oSmartTable, "_updateTableAnnouncement");
			this.oSmartTable.setModel(oModel);
			this.oSmartTable._createTable();
			this.oSmartTable._createToolbarContent();
			this.oSmartTable._oTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{name}"
					})
				]
			});
			this.oSmartTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			oSmartFilterBar.search();
			clock.tick(500);
			assert.ok(fnUpdateTableAnnouncement.calledOnce, "Search triggered. Function _updateTableAnnouncement is called once.");
		});

		QUnit.module("SmartTable - UI Adaptation", {
			beforeEach: function() {
				this.oSmartTable = new SmartTable({
					persistencyKey: "Table_Key",
					useVariantManagement: true,
					useTablePersonalisation: true
				});
			},
			afterEach: function() {
				this.oSmartTable.destroy();
			}
		});

		QUnit.test("UI Adaptation - call Settings dialog", function(assert) {

			//var done = assert.async();

			var oFakeData = {filter: {}};

			var fDialogOpen = null;
			var oDialogOpenPromise = new Promise(function(resolve) {
				fDialogOpen = resolve;
			});

			var fCallBackExecuted = null;
			var oCallbackPromise = new Promise(function(resolve) {
				fCallBackExecuted = resolve;
			});

			var fCallback = function(aChanges) {

				assert.ok(aChanges);
				assert.ok(aChanges.length === 1);

				assert.ok(aChanges[0].changeSpecificData);

				assert.ok(aChanges[0].changeSpecificData.content);
				assert.equal(aChanges[0].changeSpecificData.content.persistencyKey, this.oSmartTable.getPersistencyKey());

				assert.ok(aChanges[0].changeSpecificData.content.content);
				assert.deepEqual(aChanges[0].changeSpecificData.content.content, oFakeData);

				fCallBackExecuted();

			}.bind(this);

			//create variant management control
			assert.ok(!this.oSmartTable._oVariantManagement);
			this.oSmartTable._createVariantManagementControl();
			assert.ok(this.oSmartTable._oVariantManagement);

			//create the perso controller
			//mock initial 'setting' for Controller
			this.oSmartTable._oP13nDialogSettings = {
				filter: {
					visible: false
				}
			};
			assert.ok(!this.oSmartTable._oPersController);
			this.oSmartTable._createPersonalizationController();
			assert.ok(this.oSmartTable._oPersController);

			this.oSmartTable._oPersController.attachDialogAfterOpen(function() {
				fDialogOpen();
			});


			//overwrite the perso's inner method
			this.oSmartTable._oPersController._fireChangeEvent = function() {

				var oObj = {
					persistentData : oFakeData,
					runtimeDeltaDataChangeType: {}
				};

				this.fireAfterP13nModelDataChange(oObj);
			};

			//open dialog
			assert.ok(!this.oSmartTable._oPersController._oDialog);
			this.oSmartTable.openDialogForKeyUser("STYLECLASS", fCallback);
			assert.ok(this.oSmartTable._oPersController._oDialog);

			// wait till settings dialog open method is called
			oDialogOpenPromise.then(function() {
				//once dialog is openend, simulate trigger 'press OK'
				this.oSmartTable._oPersController._handleDialogOk();

				return oCallbackPromise;
			}.bind(this));

		});

		QUnit.start();
	});

})();
