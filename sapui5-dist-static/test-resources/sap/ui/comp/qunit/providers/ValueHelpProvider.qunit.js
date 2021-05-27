/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/comp/providers/ValueHelpProvider",
	"sap/m/MultiInput",
	"sap/m/Input",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/table/Table",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token"
], function(ValueHelpDialog, ValueHelpProvider, MultiInput, Input, Text, Button, ODataModel, Table, JSONModel, Token) {
	"use strict";

	var oValueHelpDialog = sinon.createStubInstance(ValueHelpDialog);
	var o = sinon.stub();
	o.returns(oValueHelpDialog);
	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {
				valueListEntitySetName:"Chuck",
				keyField:"TheKey",
				descriptionField:"Desc",
				keys:["TheKey"],
				valueListFields:[{name:"TheKey"},
				{name:"Desc"}]
			};
			this.oModel = sinon.createStubInstance(ODataModel);
			var oMetadataAnalyserMock = {};
			oMetadataAnalyserMock.getFieldsByEntitySetName = function() {
				return [{name:"TheKey", sortable: true}];
			};
			this.oValueHelpProvider = new ValueHelpProvider({
					title: this.sTitle,
					control: sinon.createStubInstance(MultiInput),
					aggregation: "suggestionItems",
					annotation: this.oAnnotation,
					model:this.oModel
			});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oValueHelpProvider);
	});

	QUnit.test("Shall call attachValueHelpRequest once on instantiation", function(assert) {
		assert.strictEqual(this.oValueHelpProvider.oControl.attachValueHelpRequest.calledOnce,true);
		assert.strictEqual(this.oValueHelpProvider.sTitle,this.sTitle);
	});

	QUnit.test("Shall create an instance of ValueHelpDialog and Open it on _createValueHelpDialog", function(assert) {
		this.oValueHelpProvider._createValueHelpDialog();
		assert.ok(this.oValueHelpProvider.oValueHelpDialog);
		assert.strictEqual(oValueHelpDialog.open.calledOnce,true);
	});

	QUnit.test("Shall call setModel on the table on creation of VHDialog", function(assert) {
		this.oValueHelpProvider._createValueHelpDialog();
		assert.strictEqual(oValueHelpDialog.setModel.called,true);
		assert.strictEqual(oValueHelpDialog.setModel.calledWith(this.oModel),true);
	});

	QUnit.test("Shall not fill the table initially, if preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider.bSupportBasicSearch = true;
		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.notCalled);
	});

	QUnit.test("Shall fill the table initially, if preventInitialDataFetchInValueHelpDialog is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = false;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.calledOnce);
	});

	QUnit.test("Shall fill the table initially, if bForceTriggerDataRetreival is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.bForceTriggerDataRetreival = true;
		sinon.stub(this.oValueHelpProvider, "_rebindTable");

		this.oValueHelpProvider._createValueHelpDialog();
		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.calledOnce);
	});

	QUnit.test("Shall not fill the table initially, if bForceTriggerDataRetreival is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.bForceTriggerDataRetreival = false;
		sinon.stub(this.oValueHelpProvider, "_rebindTable");

		this.oValueHelpProvider._createValueHelpDialog();
		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.notCalled);
	});

	QUnit.test("Shall pass the filterModel from ValueHelpProvider to ValueListProvider", function (assert) {
		var	oInput = new sap.m.Input();

		this.oValueHelpProvider.oFilterModel = {};
		this.oValueHelpProvider._onValueHelpDialogRequired(ValueHelpDialog);

		this.oValueHelpProvider.oValueHelpDialog._fSuggestCallback(oInput, "sFieldName");

		assert.ok(oInput._oSuggestProvider.oFilterModel, "ValueListProvider has filterModel");
		assert.equal(oInput._oSuggestProvider.oFilterModel, this.oValueHelpProvider.oFilterModel, "ValueListProvider has" +
			"the same filterModel as ValueHelpProvider");
	});

	QUnit.test("_createCollectiveSearchControls: Shall create collective search controls if additional annotations are present!", function(assert) {
		this.oValueHelpProvider.additionalAnnotations = [{}];
		oValueHelpDialog.oSelectionTitle = sinon.createStubInstance(Text);
		oValueHelpDialog.oSelectionButton = sinon.createStubInstance(Button);
		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;

		this.oValueHelpProvider._createCollectiveSearchControls();

		assert.strictEqual(oValueHelpDialog.oSelectionTitle.applySettings.calledOnce, true);
		assert.strictEqual(oValueHelpDialog.oSelectionButton.setVisible.calledOnce, true);
		assert.strictEqual(oValueHelpDialog.oSelectionButton.setVisible.calledWith(true), true);
	});

	QUnit.test("_triggerAnnotationChange shall call _resolveAnnotationData & _createAdditionalValueHelpControls", function(assert) {
		var oAnnotation = {};
		this.oValueHelpProvider.additionalAnnotations = [oAnnotation];
		oValueHelpDialog.oSelectionTitle = sinon.createStubInstance(Text);
		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;

		sinon.spy(this.oValueHelpProvider,"_resolveAnnotationData");
		sinon.spy(this.oValueHelpProvider,"_createAdditionalValueHelpControls");

		this.oValueHelpProvider._triggerAnnotationChange(oAnnotation);

		assert.strictEqual(oValueHelpDialog.oSelectionTitle.applySettings.calledOnce, true);
		assert.strictEqual(this.oValueHelpProvider._resolveAnnotationData.calledOnce, true);
		assert.strictEqual(this.oValueHelpProvider._resolveAnnotationData.calledWith(oAnnotation), true);
		assert.strictEqual(this.oValueHelpProvider._createAdditionalValueHelpControls.calledOnce, true);
	});

	QUnit.test("_createCollectiveSearchControls: successfully sets the  title and tooltip of the columns in case of i18n binding", function(assert) {
		var oI18NModel = new JSONModel({
			text: "Translated Text"
		}),
		done = assert.async();
		this.oValueHelpProvider.additionalAnnotations = [{}];
		this.oValueHelpProvider.oPrimaryValueListAnnotation.valueListTitle = "{i18n>/text}";
		oValueHelpDialog.oSelectionTitle = new Text();
		oValueHelpDialog.oSelectionTitle.setModel(oI18NModel, "i18n");
		oValueHelpDialog.oSelectionButton = sinon.createStubInstance(Button);
		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;

		this.oValueHelpProvider._createCollectiveSearchControls();

		setTimeout(function () {
			assert.strictEqual(oValueHelpDialog.oSelectionTitle.getText(), "Translated Text");
			assert.strictEqual(oValueHelpDialog.oSelectionTitle.getTooltip(), "Translated Text");
			done();
		});
	});

	QUnit.test("TokenUpdate event shell not be fired, if the tokens returned by the ValueHelpDialog are the same as the passed ones", function (assert) {
		// Arrange
		var oRange = {
				"exclude": true,
				"operation": "BT",
				"keyField": "CompanyCode",
				"value1": "aaaaa",
				"value2": "z"
			},
			oNewRange = {
				"exclude": true,
				"operation": "BT",
				"keyField": "CompanyCode",
				"value1": "bbbbbb",
				"value2": "z"
			},
			oToken = new Token({
				key: "i1",
				text: "CompanyCode a..z"
			}).data("range", oRange);

			this.oValueHelpProvider.oControl.getTokens.returns(oToken);
			this.oValueHelpProvider.oControl.isA.withArgs("sap.m.MultiInput").returns(true);
			this.oValueHelpProvider._onValueHelpDialogRequired(ValueHelpDialog);
			sinon.stub(this.oValueHelpProvider.oValueHelpDialog, "getDomRef").withArgs("scroll").returns({clientHeight: 0});

		// Act
		this.oValueHelpProvider.oValueHelpDialog.onAfterRendering();
		this.oValueHelpProvider.oValueHelpDialog._onCloseAndTakeOverValues();

		// Assert
		assert.ok(this.oValueHelpProvider.oControl.setTokens.notCalled, "Tokens are not updated and the TokenUpdate event is not fired");

		// Act
		this.oValueHelpProvider.oValueHelpDialog.onAfterRendering();
		this.oValueHelpProvider.oValueHelpDialog._addToken2Tokenizer("__token0-1", "", this.oValueHelpProvider.oValueHelpDialog._getTokenizer(), null, oNewRange);
		this.oValueHelpProvider.oValueHelpDialog._onCloseAndTakeOverValues();

		// Assert
		assert.ok(this.oValueHelpProvider.oControl.setTokens.calledOnce, "Tokens are updated and the TokenUpdate event is fired");

		// Clean Up
		oToken.destroy();
	});

	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			//Set single interval
			this.isSingleIntervalRange = true;
			this.oValueHelpProvider = new ValueHelpProvider({title:this.sTitle,control: sinon.createStubInstance(Input), aggregation:"suggestionItems",annotation:this.oAnnotation,model:this.oModel,fieldName:"foo",isSingleIntervalRange:this.isSingleIntervalRange});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
		}
	});

	QUnit.test("Shall create an instance of ValueHelpDialog and Open it on _createValueHelpDialog", function(assert) {
		// Act
		this.oValueHelpProvider._oValueHelpDialogClass = ValueHelpDialog;
		this.oValueHelpProvider._createValueHelpDialog();

		// Assert
		assert.ok(this.oValueHelpProvider.oValueHelpDialog.getProperty("_enhancedExcludeOperations"));
	});

	QUnit.test("_updateInitialInterval shall be called for single Interval dialog", function(assert) {

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		sinon.spy(this.oValueHelpProvider,"_updateInitialInterval");
		this.oValueHelpProvider._createValueHelpDialog();


		assert.strictEqual(this.oValueHelpProvider._updateInitialInterval.calledOnce,true);
	});

	QUnit.test("_updateInitialInterval: Check for single Interval with equals token", function(assert) {
		var oToken = null, oData = null, sControlValue = "foo";

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider.oControl.getValue.returns(sControlValue);
		this.oValueHelpProvider.oValueHelpDialog.setTokens = sinon.stub();


		this.oValueHelpProvider._updateInitialInterval();


		assert.strictEqual(this.oValueHelpProvider.oValueHelpDialog.setTokens.calledOnce,true);

		oToken = this.oValueHelpProvider.oValueHelpDialog.setTokens.args[0][0][0];
		oData = oToken.data("range");
		assert.strictEqual(oData.operation,"EQ");
		assert.strictEqual(oData.value1,sControlValue);
	});

	QUnit.test("_updateInitialInterval: Check for single Interval with an interval token", function(assert) {
		var oToken = null, oData = null, sControlValue1 = "1999", sControlValue2 = "2014";

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider.oControl.getValue.returns(sControlValue1 + "-" + sControlValue2);
		this.oValueHelpProvider.oValueHelpDialog.setTokens = sinon.stub();


		this.oValueHelpProvider._updateInitialInterval();

		assert.strictEqual(this.oValueHelpProvider.oValueHelpDialog.setTokens.calledOnce,true);

		oToken = this.oValueHelpProvider.oValueHelpDialog.setTokens.args[0][0][0];
		oData = oToken.data("range");
		assert.strictEqual(oData.operation,"BT");
		assert.strictEqual(oData.value1,sControlValue1);
		assert.strictEqual(oData.value2,sControlValue2);
	});

	QUnit.test("_createAdditionalValueHelpControls: Check ", function(assert) {
		// Arrange
		var constParams = {},
			sConstKey = "constKey";

		constParams[sConstKey] = "ConstValue";
		sinon.stub(this.oValueHelpProvider, 'oPrimaryValueListAnnotation').value({
			constParams: constParams
		});
		this.oValueHelpProvider.oValueHelpDialog = {};
		this.oValueHelpProvider.oValueHelpDialog = sinon.createStubInstance(ValueHelpDialog);

		// Act
		this.oValueHelpProvider._createAdditionalValueHelpControls();

		// Assert
		assert.strictEqual(this.oValueHelpProvider.oSmartFilterBar.data("hiddenFields")[0], sConstKey);
	});

	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			//Set single interval
			this.isSingleIntervalRange = true;
			this.oValueHelpProvider = new ValueHelpProvider(
				{
					title:this.sTitle,
					control: new sap.m.Input(),
					aggregation:"suggestionItems",
					annotation:this.oAnnotation,
					model:this.oModel,
					fieldName:"foo",
					isSingleIntervalRange:this.isSingleIntervalRange
				});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
			this.oValueHelpProvider.bSupportBasicSearch = true;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
		}
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog", function(assert) {
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: "test _userInputValue"
		});

		assert.equal(this.oValueHelpProvider.sBasicSearchText, "test _userInputValue");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, false);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = false;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, false);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, true);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, true);
	});


	QUnit.start();
});
