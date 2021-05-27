/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/ui/comp/providers/ValueListProvider",
	"sap/ui/comp/historyvalues/Constants",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/MultiInput",
	"sap/m/ComboBox",
	"sap/m/MultiComboBox",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/library"
], function(MetadataAnalyser, ValueListProvider, HistoryConstants, Text, Input, MultiInput, ComboBox, MultiComboBox, ODataModel, SmartField, library) {
	"use strict";

	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	QUnit.module("sap.ui.comp.providers.ValueListProvider", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(MultiComboBox), aggregation:"items",annotation:this.oAnnotation,model:this.oModel,typeAheadEnabled:false});
			this.oValueListProvider.oControl.isA = function (sType) {
				// Test only for MultiComboBox as ComboBox scenario is covered in SmartField OPA Tests
				return sType === "sap.m.MultiComboBox";
			};
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oValueListProvider);
	});

	QUnit.test("Shall have an instance of oDataModel", function(assert) {
		assert.ok(this.oValueListProvider.oODataModel);
	});

	QUnit.test("Shall call addEventDelegate onInitialise of drop downs", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.addEventDelegate.calledOnce,true);
	});

	QUnit.test("_handleOutParameters shall call attachSelectionChange with _onMultiComboBoxItemSelected as parameter", function (assert) {
		// Arrange
		var oVLP = this.oValueListProvider;

		// Act
		oVLP._handleOutParameters();

		// Assert
		assert.ok(oVLP.oControl.attachSelectionChange.calledOnce);
		assert.ok(oVLP.oControl.attachSelectionChange.calledWith(oVLP._onMultiComboBoxItemSelected, oVLP));
	});

	QUnit.test("_onMultiComboBoxItemSelected shall call _calculateAndSetFilterOutputData", function (assert) {
		// Arrange
		var oVLP = this.oValueListProvider,
			oMockRow = {
				TheKey: "key",
				Desc: "description",
				getBindingContext: function () {
					return {
						getObject: function () {
							return oMockRow;
						}
					};
				}
			},
			oEvent = {getParameter:sinon.stub()};
			oEvent.getParameter.returns(oMockRow);
			sinon.spy(oVLP, "_calculateAndSetFilterOutputData");

		// Act
		oVLP._onMultiComboBoxItemSelected(oEvent);

		// Assert
		assert.ok(oVLP._calculateAndSetFilterOutputData.calledOnce);
		assert.ok(oVLP._calculateAndSetFilterOutputData.calledWith([oMockRow]));
	});

	QUnit.test("_fetchData should be called for filtering", function (assert) {
		// Arrange
		this.oValueListProvider.mFilterInputData = {};
		this.oValueListProvider.aFilterField = {};
		this.oValueListProvider.oControl.setSelectedKey = function() {};
		sinon.spy(this.oValueListProvider, "_fetchData");
		sinon.stub(this.oValueListProvider, "_calculateFilterInputData").returns({});
		this.oValueListProvider.oControl.getBinding = function () {
			return {
				filter: function() {
					return {};
				}
			};
		};

		// Act
		this.oValueListProvider._filterDropdownRowsByInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce, true);
		assert.strictEqual(this.oValueListProvider.oControl.setBusy.calledWith(true), true);
	});

	QUnit.test("_cleanupControlSelection should be called after filtering", function (assert) {
		// Arrange
		this.oValueListProvider.mFilterInputData = {};
		this.oValueListProvider.aFilterField = {};
		this.oValueListProvider.oControl.setSelectedKey = function() {};
		sinon.spy(this.oValueListProvider, "_cleanupControlSelection");
		sinon.stub(this.oValueListProvider, "_calculateFilterInputData").returns({});
		this.oValueListProvider.oControl.getBinding = function () {
			return {
				filter: function() {
					return {};
				}
			};
		};

		// Act
		this.oValueListProvider._filterDropdownRowsByInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._cleanupControlSelection.calledOnce, true);
	});

	QUnit.test("_cleanupControlSelection should clear model and selected keys", function (assert) {
		// Arrange
		var aSelectedKeys = ["1"],
			oValueListProvider = this.oValueListProvider;

		oValueListProvider.sFieldName = "inout";
		oValueListProvider.oFilterModel = {
			"/inout/items": [1],
			setProperty: function (sPropertyPath, vResult) {
				this[sPropertyPath] = vResult;
			}
		};
		oValueListProvider.mFilterInputData = {
			"in": "bar"
		};
		oValueListProvider.oControl.setSelectedKeys(aSelectedKeys);
		oValueListProvider.aFilterField = {};

		// Act
		oValueListProvider._cleanupControlSelection();

		// Assert

		assert.ok(oValueListProvider.oControl.setSelectedKeys.calledWith(null));
		assert.strictEqual(oValueListProvider.oFilterModel["/" + oValueListProvider.sFieldName + "/items"].length, 0);
	});

	QUnit.test("_isControlDropdown shall return true if control is of type ComboBox or MultiComboBox", function (assert) {
		// Act
		var bResult = this.oValueListProvider._isControlDropdown();

		// Assert
		assert.ok(bResult);
	});

	QUnit.test("Shall call bindAggrgation/_fetchData once control is rendered", function(assert) {
		var oDelegate;
		this.oValueListProvider.mOutParams = {
			out1: "out1",
			out2: "out2"
		};
		this.oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};

		this.oValueListProvider.oControl.isA = function(sType) {
			if (sType === "sap.m.MultiComboBox") {
				return true;
			}
		};
		sinon.spy(this.oValueListProvider,"_fetchData");
		sinon.spy(this.oValueListProvider,"_isControlDropdown");
		sinon.spy(this.oValueListProvider,"_handleOutParameters");
		sinon.spy(this.oValueListProvider,"_handleInParameters");
		oDelegate = this.oValueListProvider.oControl.addEventDelegate.args[0][0];
		oDelegate.onAfterRendering.call(this.oValueListProvider);
		assert.strictEqual(this.oValueListProvider.oControl.bindAggregation.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._isControlDropdown.calledTwice,true);
		assert.strictEqual(this.oValueListProvider._handleInParameters.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._handleOutParameters.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.removeEventDelegate.calledOnce,true);
	});

	QUnit.test("_handleInParameters shall call _calculateFilterInputData() in order to prevent double filtering", function(assert) {

		// Arrange
		sinon.spy(this.oValueListProvider, "_calculateFilterInputData");

		// Act
		this.oValueListProvider._handleInParameters();

		// Assert
		assert.strictEqual(this.oValueListProvider._calculateFilterInputData.calledOnce, true);
	});

	QUnit.test("_fetchData should include InParams as filter in the initial GET request for DropDowns", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider;
		oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};

		oValueListProvider._calculateFilterInputData = function() {
			oValueListProvider.mFilterInputData = {in2: "in2"};
			oValueListProvider.aFilterField = ["in2"];
		};

		sinon.spy(oValueListProvider, "_calculateFilterInputData");

		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.equal(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].filters.length, 1, "Filters are added to initial request");
	});

	QUnit.test("_fetchData should include mConstParams as filter in the initial GET request for DropDowns", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider;

		oValueListProvider.aFilterField = [];
		sinon.spy(oValueListProvider, "_calculateFilterInputData");
		sinon.stub(oValueListProvider, "mInParams").value({
			in1: "in1"
		});
		sinon.stub(oValueListProvider, "mConstParams").value({
			const1: "const1Value"
		});
		oValueListProvider.oControl.getBindingContext.restore();
		sinon.stub(oValueListProvider.oControl, "getBindingContext").returns({getProperty: function(){return "in1";}});


		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.strictEqual(oValueListProvider._calculateFilterInputData.calledOnce, true);
		assert.equal(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].filters.length, 1, "Filters are added to initial request");

		// Clear
		delete oValueListProvider.aFilterField;
		delete oValueListProvider.mInParams;
		delete oValueListProvider.mConstParams;
		oValueListProvider._calculateFilterInputData.restore();
		oValueListProvider.oControl.getBindingContext.restore();

	});

	QUnit.test("_fetchData should add dataReceived event for DropDowns with In Params to remove busy indicator", function(assert) {

		// Arrange
		var oValueListProvider = this.oValueListProvider;

		oValueListProvider.mInParams = {
			in1: "in1",
			in2: "in2"
		};

		// Act
		oValueListProvider._fetchData();

		// Assert
		assert.ok(oValueListProvider.oControl.bindAggregation.getCall(0).args[1].events.dataReceived, "DataReceived is added as argument");
	});

	QUnit.test("Shall create sorter for id based DDLBs", function(assert) {
		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sKey);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription);
	});

	QUnit.test("Shall not create sorter for id based DDLBs but one for Description", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = true;

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(this.oValueListProvider._oSorter);
		assert.strictEqual(this.oValueListProvider._oSorter.sPath,this.oValueListProvider.sDescription);
	});

	QUnit.test("Shall not create sorter for id nor description based DDLBs", function(assert) {
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[0].sortable = false;
		this.oValueListProvider.oPrimaryValueListAnnotation.valueListFields[1].sortable = false;

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.idOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);

		this.oValueListProvider.sDDLBDisplayBehaviour = DisplayBehaviour.descriptionOnly;
		this.oValueListProvider._createDropDownTemplate();
		assert.ok(!this.oValueListProvider._oSorter);
	});

	QUnit.test("it should destroy the item template", function(assert) {

		// arrange
		this.oValueListProvider._createDropDownTemplate();
		var oTemplateDestroySpy = sinon.spy(this.oValueListProvider._oTemplate, "destroy");

		// act
		this.oValueListProvider.destroy();

		// assert
		assert.strictEqual(oTemplateDestroySpy.callCount, 1);
		assert.strictEqual(this.oValueListProvider._oTemplate, null);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(MultiInput), aggregation:"suggestionItems", annotation:this.oAnnotation, model:this.oModel, typeAheadEnabled:true});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
			delete this.oAnnotation;
			this.oModel.destroy();
			this.oModel = null;
		}
	});

	QUnit.test("Shall call attachSuggest once on initialise if type Ahead is enabled", function(assert) {
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
	});

	QUnit.test("suggest shall trigger _fetchData", function(assert) {
		var fSuggest = null,oEvent = {getParameter:sinon.stub(), getSource: sinon.stub()}, sInput = "test";
		oEvent.getParameter.returns(sInput);
		oEvent.getSource.returns(this.oValueListProvider.oControl);
		assert.strictEqual(this.oValueListProvider.oControl.attachSuggest.calledOnce,true);
		sinon.spy(this.oValueListProvider,"_fetchData");
		fSuggest = this.oValueListProvider.oControl.attachSuggest.args[0][0];
		//Trigger Suggest
		fSuggest(oEvent);

		assert.strictEqual(this.oValueListProvider._fetchData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._fetchData.calledWith(sInput),true);
	});

	QUnit.test("_fetchData shall use the Search Text and Search-focus if basic search and type ahead is enabled", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider._fetchData("SomeSearchText");

		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"SomeSearchText");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text shall be converted to UpperCase according to displayFormat", function(assert) {
		this.oValueListProvider.bSupportBasicSearch = true;
		this.oValueListProvider.sDisplayFormat = "UpperCase";
		this.oValueListProvider._fetchData("UpperCase");
		var args = this.oValueListProvider.oControl.bindAggregation.args[0];
		var custom = args[1].parameters["custom"];
		assert.strictEqual(custom["search"],"UPPERCASE");
		assert.strictEqual(custom["search-focus"],"TheKey");
	});

	QUnit.test("Search Text with maxLength", function(assert) {
		sinon.spy(this.oValueListProvider,"_truncateSearchText");

		this.oValueListProvider.bSupportBasicSearch = false;
		this.oValueListProvider._fieldViewMetadata = {};
		this.oValueListProvider._fieldViewMetadata.maxLength = "1";
		this.oValueListProvider._fetchData("123");

		assert.strictEqual(this.oValueListProvider._truncateSearchText.calledOnce,true, "_truncateSearchText called once");
		assert.strictEqual(this.oValueListProvider._truncateSearchText.returned("1"),true, "_truncateSearchText returned truncated value '1'");
	});

	QUnit.test("MultiInput - addValidator shall trigger select and create token via asyncCallback with the suggestionRow", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(),
			oMockRow = {TheKey:"key",Desc:"description"},
			getObjectStub = sinon.stub().returns(oMockRow),
			oSuggestionRow = {
				getBindingContext: function () {
					return {
						getObject: getObjectStub
					};
				}
			},
			sInput = "foo";

		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		assert.strictEqual(getObjectStub.calledOnce,false, "data of the row is not retrieved initially");

		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});

		assert.strictEqual(getObjectStub.calledOnce,true, "data of the row is retrieved");
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,false, "no oData request is made");
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
	});

	QUnit.test("MultiInput - addValidator shall trigger backend validation and create token (via asyncCallback) with typed in text if no suggestionRow is present", function(assert) {
		var fValidate = null, fAsyncCallback = sinon.stub(), oSuggestionRow = null, sInput = "foo";
		var oMockRow = {TheKey:"key",Desc:"description"};
		var oBackendRequest = null;
		assert.strictEqual(this.oValueListProvider.oControl.addValidator.calledOnce,true);
		fValidate  = this.oValueListProvider.oControl.addValidator.args[0][0];
		sinon.stub(this.oValueListProvider,"_calculateAndSetFilterOutputData");
		sinon.stub(this.oValueListProvider,"_calculateFilterInputData");
		//Trigger the validation
		fValidate({suggestionObject: oSuggestionRow, text: sInput, asyncCallback: fAsyncCallback});
		assert.strictEqual(this.oValueListProvider.oODataModel.getData.calledOnce,false);
		assert.strictEqual(this.oValueListProvider.oODataModel.read.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,true);

		oBackendRequest = this.oValueListProvider.oODataModel.read.args[0][1];

		//Tigger success call
		oBackendRequest.success({results:[oMockRow]},{});

		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(fAsyncCallback.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		//assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith(""),true);
		assert.strictEqual(this.oValueListProvider.oControl.__bValidatingToken,undefined);
	});

	QUnit.module("sap.ui.comp.providers.ValueListProvider (typeAhead - single Input)", {
		beforeEach: function() {
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oValueListProvider = new ValueListProvider({control: sinon.createStubInstance(Input), aggregation:"suggestionItems", annotation:this.oAnnotation, model:this.oModel, typeAheadEnabled:true});
		},
		afterEach: function() {
			this.oValueListProvider.destroy();
			this.oValueListProvider = null;
		}
	});

	QUnit.test("Input - attachSuggestionItemSelected shall trigger select and set Key as value of Input", function(assert) {
		var oMockRow = {TheKey:"key",Desc:"description"};
		var getObjectStub = sinon.stub().returns(oMockRow);
		var getBindingContextStub = sinon.stub().returns({
			getObject: getObjectStub
		});
		var oSelectedRow = { getBindingContext: getBindingContextStub };
		var fSuggestionItemSelected = null, oEvent = { getParameter:sinon.stub().returns(oSelectedRow) };


		assert.strictEqual(this.oValueListProvider.oControl.attachSuggestionItemSelected.calledOnce,true);
		fSuggestionItemSelected  = this.oValueListProvider.oControl.attachSuggestionItemSelected.args[0][0];
		sinon.spy(this.oValueListProvider,"_calculateAndSetFilterOutputData");

		//Trigger the selection
		fSuggestionItemSelected.call(this.oValueListProvider, oEvent);

		assert.strictEqual(getBindingContextStub.calledOnce,true);
		assert.strictEqual(getObjectStub.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledOnce,true);
		assert.strictEqual(this.oValueListProvider._calculateAndSetFilterOutputData.calledWith([oMockRow]),true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.setValue.calledWith("key"),true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledOnce,true);
		assert.strictEqual(this.oValueListProvider.oControl.fireChange.calledWith({value:"key", validated: true}),true);
	});

	// BCP 1770487494
	QUnit.test("it should unbind the suggestionItems aggregation when the provided control is removed from the control tree", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var oText = new Text();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oText);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), false);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
		oText.destroy();
	});

	QUnit.test("it should not unbind the suggestionItems aggregation", function(assert) {

		// arrange
		var oSmartField = new SmartField();
		var oInput = new Input();
		var sAggregation = "suggestionItems";
		oSmartField.setContent(oInput);

		// system under test
		this.oValueListProvider = new ValueListProvider({
			control: oInput,
			aggregation: sAggregation,
			annotation: this.oAnnotation,
			model: this.oModel,
			typeAheadEnabled: true
		});

		// act: simulate an user interaction with the text input control, the ValueListProvider class bind the
		// aggregation on the suggest event handler of the text input control
		oInput.fireSuggest({
			suggestValue: "foo"
		});

		// change the SmartField's content aggregation (this usually occurs when the inner controls are toggled)
		oSmartField.setContent(oInput);

		// assert
		assert.strictEqual(oInput.isBound(sAggregation), true);

		// cleanup
		oSmartField.destroy();
		oInput.destroy();
	});

	QUnit.module("Recommendations", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_addSuggestionsToGroup should loop through all passed items in the array and add to them additional 'order' field with value passed as second argument", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			ORDER_NUMBER_FOR_RECENTLY_USED = 20,
			ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			SUGGESTION_GROUP_ORDER_NAME = HistoryConstants.getSuggestionsGroupPropertyName(),
			aSuggestions = [{ name: "First Suggestion" }, { name: "Second Suggestion" }];

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_SUGGESTIONS);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 30 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_SUGGESTIONS, "an order field with value 30 is added to the second suggestion");

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_RECENTLY_USED);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECENTLY_USED, "an order field with value 20 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECENTLY_USED, "an order field with value 20 is added to the second suggestion");

		// Act
		var oResult = this.oVLP._addSuggestionsToGroup(aSuggestions, ORDER_NUMBER_FOR_RECOMMENDATIONS);

		// Assert
		assert.equal(oResult[0][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the first suggestion");
		assert.equal(oResult[1][SUGGESTION_GROUP_ORDER_NAME], ORDER_NUMBER_FOR_RECOMMENDATIONS, "an order field with value 10 is added to the second suggestion");

		assert.notOk(aSuggestions[0][SUGGESTION_GROUP_ORDER_NAME], "original first suggestion should not be modified");
		assert.notOk(aSuggestions[1][SUGGESTION_GROUP_ORDER_NAME], "original second suggestion should not be modified");
	});

	QUnit.test("_groupHeaderFactory should return correct group item for fixed and not fixed values scenario", function (assert) {
		// Arrange
		this.oVLP.oControl = new MultiComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.ui.core.SeparatorItem"), true, "group headers should be SeparatorItem in case of multicombobox scenario");

		// Arrange
		this.oVLP.oControl = new ComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.ui.core.SeparatorItem"), true, "group headers should be SeparatorItem in case of combobox scenario");

		// Arrange
		this.oVLP.oControl = new MultiInput();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.m.GroupHeaderListItem"), true, "group headers should be GroupHeaderListItem in case of multiinput scenario");

		// Arrange
		this.oVLP.oControl = new Input();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({});
		assert.equal(oControl.isA("sap.m.GroupHeaderListItem"), true, "group headers should be GroupHeaderListItem in case of input scenario");
	});

	QUnit.test("_groupHeaderFactory should Separator Item with not empty key", function (assert) {
		// Arrange
		var sExpected = HistoryConstants.getHistoryPrefix() + 20 + ".key";
		this.oVLP.oControl = new MultiComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({ key: 20 });
		assert.equal(oControl.getKey(), sExpected, "group headers should  have key set and equal to: " + sExpected);

		// Arrange
		this.oVLP.oControl = new ComboBox();

		// Act & Assert
		var oControl = this.oVLP._groupHeaderFactory({ key: 20 });
		assert.equal(oControl.getKey(), sExpected, "group headers should  have key set and equal to: " + sExpected);
	});

	QUnit.test("_getGroupHeaderTitle should return right titles for different groups", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			ORDER_NUMBER_FOR_RECENTLY_USED = 20,
			ORDER_NUMBER_FOR_SUGGESTIONS = 30,
			sOthersTitle = "Others",
			sRecentlyUsedTitle = "Recently Used",
			sRecommendationsTitle = "Recommendations",
			oRBGetTextStub = this.stub();
		oRBGetTextStub.withArgs("VALUELIST_OTHERS_TITLE").returns(sOthersTitle);
		oRBGetTextStub.withArgs("VALUELIST_RECENTLY_USED_TITLE").returns(sRecentlyUsedTitle);
		oRBGetTextStub.withArgs("VALUELIST_RECOMMENDATIONS_TITLE").returns(sRecommendationsTitle);
		this.oVLP._oResourceBundle = { getText: oRBGetTextStub };

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_RECOMMENDATIONS);
		assert.equal(sResult, sRecommendationsTitle, "Group Header title for recommendations should be equal to " + sRecommendationsTitle);

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_RECENTLY_USED);
		assert.equal(sResult, sRecentlyUsedTitle, "Group Header title for recently used should be equal to " + sRecentlyUsedTitle);

		// Act & Assert
		var sResult = this.oVLP._getGroupHeaderTitle(ORDER_NUMBER_FOR_SUGGESTIONS);
		assert.equal(sResult, sOthersTitle, "Group Header title for suggestions should be equal to " + sOthersTitle);
	});

	QUnit.test("_getGroupHeaderSorter should return a sap.ui.model.Sorter with path equal to 'order' and group function that extract 'order' property from the context", function (assert) {
		// Arrange
		var ORDER_NUMBER_FOR_RECOMMENDATIONS = 10,
			sOrderPropertyPath = HistoryConstants.getSuggestionsGroupPropertyName(),
			oContextStub = {
				getProperty: this.stub().returns(ORDER_NUMBER_FOR_RECOMMENDATIONS)
			};

		// Act
		var oSorter = this.oVLP._getGroupHeaderSorter();

		// Assert
		assert.equal(oSorter.getMetadata().getName(), "sap.ui.model.Sorter", "sorter should be sap.ui.model.Sorter");
		assert.equal(oSorter.sPath, sOrderPropertyPath, "sorter property name should be " + HistoryConstants.getSuggestionsGroupPropertyName());
		assert.equal(oSorter.fnGroup(oContextStub), ORDER_NUMBER_FOR_RECOMMENDATIONS, "group function should extract the order property from the context");
	});

	QUnit.test("_getDistinctSuggestions should return only unique entries from an array", function (assert) {
		// Arrange
		var oItem1 = { firstName: "firstName1", lastName: "lastName1"  },
			oItem2 = { firstName: "firstName1", lastName: "lastName2" },
			oItem3 = { firstName: "firstName2", lastName: "lastName1" },
			aExpected = [oItem1, oItem2, oItem3],
			aTestArray = [oItem1, oItem2, oItem1, oItem2, oItem3, oItem3, oItem3];

		// Act
		var aResult = this.oVLP._getDistinctSuggestions(aTestArray);

		// Assert
		assert.deepEqual(aResult, aExpected, "returned array should have only distinct values");
	});

	QUnit.test("_resolveRecommendationListAnnotationData should add visible columns to the recommendations cols and select arrays", function (assert) {
		// Arrange
		var oVisibleField = { name: "Visible Field", visible: true },
			oInvisibleField = { name: "Invisible Field", visible: false },
			oRecommendationAnnotation = {
				fieldsToDisplay: [oVisibleField, oInvisibleField]
			};
		// Act
		this.oVLP._resolveRecommendationListAnnotationData(oRecommendationAnnotation);

		// Assert
		assert.equal(this.oVLP._aRecommendationCols.length, 1, "one column config should be added");
		assert.equal(this.oVLP.aRecommendationSelect.length, 1, "one select field should be added");
		assert.equal(this.oVLP._aRecommendationCols[0].template, oVisibleField.name, "column template should be equal to the field name");
		assert.equal(this.oVLP.aRecommendationSelect[0], oVisibleField.name, "select should be equal to the field name");
	});

	QUnit.test("_resolveRecommendationListAnnotationData should add rankField to the _aHighImportanceCols", function (assert) {

		// Arrange
		var oVLP = this.oVLP,
			oVisibleField = { name: "Visible Field", visible: true},
			oSecondVisibleField = { name: "Second Visible Field", visible: true},
			oRankField = { name: "Rank Field", visible: true},
			oRecommendationAnnotation = {
				fieldsToDisplay: [oVisibleField, oSecondVisibleField, oRankField]
			},
			oHighImportanceField = oVLP._getColumnConfigFromField(oVisibleField);

		oVLP._oRecommendationListAnnotation = {
			rankField: [oRankField]
		};
		oVLP._aHighImportanceCols = [oHighImportanceField];

		// Act
		oVLP._resolveRecommendationListAnnotationData(oRecommendationAnnotation);

		// Assert
		assert.equal(oVLP._aHighImportanceCols.length, 2, "one column config should be added");
		assert.equal(oVLP._aHighImportanceCols[oVLP._aHighImportanceCols.length - 1].template, oRankField.name, "column template should be equal to the field name");
	});

	QUnit.test("_shouldHaveRecommendations should return true if RecommendationList annotation is set", function(assert) {
		// Arrange
		var oIsRecommendationListStub = this.stub(MetadataAnalyser, "isRecommendationList");

		// Act & Arrange
		oIsRecommendationListStub.returns(true);
		assert.ok(this.oVLP._shouldHaveRecommendations(), "should return true");

		// Act & Arrange
		oIsRecommendationListStub.returns(false);
		assert.notOk(this.oVLP._shouldHaveRecommendations(), "should return false");

		// Cleanup
		oIsRecommendationListStub.restore();
	});

	QUnit.test("_getRecommendationListAnnotation should return and enrich the RecommendationList Annotation", function (assert) {
		// Arrange
		var sFieldName = "EPM_REF_APPS_PROD_MAN_SRV.Product/CurrencyCode",
			oAnnotation = { name: "Annotation" },
			oEnrichedAnnotation = { name: "EnrichedAnnotation" },
				oMetadataAnalyser = {
					_getRecommendationListAnnotation: this.stub().returns(oAnnotation),
					_enrichRecommendationListAnnotation: this.stub().returns(oEnrichedAnnotation)
				};
		this.oVLP._sFullyQualifiedFieldName = sFieldName;
		this.oVLP._oMetadataAnalyser = oMetadataAnalyser;

		// Act
		var oResult = this.oVLP._getRecommendationListAnnotation();

		// Assert
		assert.equal(oResult, oEnrichedAnnotation, "returned value should be equal the enriched annotation");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.callCount, 1, "_getRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.callCount, 1, "_enrichRecommendationListAnnotation should be called once");
		assert.equal(oMetadataAnalyser._getRecommendationListAnnotation.args[0][0], sFieldName, "_getRecommendationListAnnotation should be called with " + sFieldName);
		assert.equal(oMetadataAnalyser._enrichRecommendationListAnnotation.args[0][0], oAnnotation, "_enrichRecommendationListAnnotation should be called with the annotation");
	});

	QUnit.test("_isNotRecommendationItemSelected should return true if selected item is from recommendations group and false otherwise", function (assert) {
		// Arrange
		var oFindSuggestionItemGroupStub = this.stub(this.oVLP, "_findSuggestionItemGroup");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(10); // 10 - Recommendations Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.notOk(bResult, "item that is selected is from recommendation group");

		// Act & Assert
		oFindSuggestionItemGroupStub.returns(30); // 30 - Others Group
		var bResult = this.oVLP._isNotRecommendationItemSelected();
		assert.ok(bResult, "item that is selected is not from recommendation group");

		// Cleanup
		oFindSuggestionItemGroupStub.restore();
	});

	QUnit.test("_getSuggestionsModelName 'list' in all cases", function (assert) {
		// Arrange
		var oShouldHaveRecommendationsStub = this.stub(this.oVLP, "_shouldHaveRecommendations");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(true);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, "list", "model path should be equal to 'list'");

		// Act & Assert
		oShouldHaveRecommendationsStub.returns(true);
		var sResult = this.oVLP._getSuggestionsModelName();
		assert.equal(sResult, "list", "model path should be equal to 'list'");

		// Cleanup
		oShouldHaveRecommendationsStub.restore();
	});

	QUnit.test("_resolveSuggestionBindingPath should add the model path if any", function (assert) {
		// Arrange
		var sPath = "CurrencyCode",
			oGetSuggestionsModelName = this.stub(this.oVLP, "_getSuggestionsModelName");

		// Act & Assert
		oGetSuggestionsModelName.returns("list");
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, "list>" + sPath);

		// Act & Assert
		oGetSuggestionsModelName.returns();
		var sResult = this.oVLP._resolveSuggestionBindingPath(sPath);
		assert.equal(sResult, sPath);

		// Cleanup
		oGetSuggestionsModelName.restore();
	});

	QUnit.module("History Values", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput,
				fieldHistoryEnabled: true
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_setupHistoryValues should setup the ValueList for history values", function (assert) {
		// Arrange
		var aFieldData = ["history1", "history2"],
			oGetFieldDataStub = {
				then: function (fnCallback) {
					fnCallback(aFieldData);
				}
			},
			oGetHistoryEnabledStub = {
				then: function (fnCallback) {
					fnCallback(true);
				}
			},
			oHistoryValuesProviderStub = {
				attachEvent: this.spy(),
				attachChangeListener: this.spy(),
				getFieldData: this.stub().returns(oGetFieldDataStub),
				getHistoryEnabled: this.stub().returns(oGetHistoryEnabledStub),
				destroy: this.stub()
			},
			oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true),
			oCreateHistoryValuesProviderSpy = this.stub(this.oVLP, "_createHistoryValuesProvider").returns(oHistoryValuesProviderStub),
			oUpdateModelHistoryData = this.spy(this.oVLP, "_updateModelHistoryData"),
			oCreateHistoryOptOutProvider = this.stub(this.oVLP, "_createHistoryOptOutProvider");

		this.oVLP._sFullyQualifiedFieldName = "fieldName";

		// Act
		this.oVLP._setupHistoryValues();

		// Assert
		var aUpdateModelArgs = oUpdateModelHistoryData.getCall(0).args[0];
		assert.equal(oCreateHistoryValuesProviderSpy.callCount, 1, "_createHistoryValuesProvider is called once");
		assert.equal(oHistoryValuesProviderStub.attachEvent.callCount, 1, "attachEvent of HistoryValuesProvider is called once");
		assert.equal(oHistoryValuesProviderStub.attachChangeListener.callCount, 1, "attachChangeListener of HistoryValuesProvider is called once");
		assert.equal(oUpdateModelHistoryData.callCount, 1, "_updateModelHistoryData is called once");
		assert.equal(oCreateHistoryOptOutProvider.callCount, 1, "_createHistoryOptOutProvider is called once");
		assert.deepEqual(aUpdateModelArgs, aFieldData, "updateModelHistoryData is called with right parameters");

		// Cleanup
		oShouldHaveHistoryStub.restore();
		oCreateHistoryValuesProviderSpy.restore();
		oUpdateModelHistoryData.restore();
		oCreateHistoryOptOutProvider.restore();
	});

	QUnit.test("_updateModelHistoryData adds history data to the JSONModel", function (assert) {
		// Arrange
		var SUGGESTION_GROUP_ORDER_NAME = HistoryConstants.getSuggestionsGroupPropertyName();
		var oAddSuggestionsToGroupSpy = this.spy(this.oVLP, "_addSuggestionsToGroup");
		var oShouldHaveRecommendations = this.stub(this.oVLP, "_shouldHaveRecommendations").returns(false);
		var oShouldHaveHistory = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		var aHistoryData = [{
			key: "item1",
			text: "History Item 1"
		}, {
			key: "item2",
			text: "History Item 2"
		}],
		aResult = [{
			key: "item1",
			text: "History Item 1"
		}, {
			key: "item2",
			text: "History Item 2"
		}];
		aResult[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[1][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;

		// Act
		this.oVLP._updateModelHistoryData(aHistoryData);

		// Assert
		var aData = this.oVLP.oControl.getModel("list").getData();
		assert.notOk(aHistoryData[0][SUGGESTION_GROUP_ORDER_NAME], "original item1 should not be modified");
		assert.notOk(aHistoryData[1][SUGGESTION_GROUP_ORDER_NAME], "original item2 should not be modified");
		assert.deepEqual(oAddSuggestionsToGroupSpy.getCall(0).args[0], aHistoryData, "history data is passed as first arg to _addSuggestionsToGroup");
		assert.equal(oAddSuggestionsToGroupSpy.getCall(0).args[1], 20, "_addSuggestionsToGroup is called with second param 20 (index of recently used goup)");
		assert.deepEqual(aData, aResult, "history data should be added to the JSON model");

		// Cleanup
		oAddSuggestionsToGroupSpy.restore();
		oShouldHaveRecommendations.restore();
		oShouldHaveHistory.restore();
	});

	QUnit.test("_updateModelHistoryData merge history data with recommendations and add them to JSONmodel", function (assert) {
		// Arrange
		var oAddSuggestionsToGroupSpy = this.spy(this.oVLP, "_addSuggestionsToGroup");
		var oShouldHaveRecommendations = this.stub(this.oVLP, "_shouldHaveRecommendations").returns(true);
		var aHistoryData = [{
				key: "item1",
				text: "History Item 1"
			}, {
				key: "item2",
				text: "History Item 2"
			}],
			aResult = [{
				key: "item1",
				text: "History Item 1"
			}, {
				key: "item2",
				text: "History Item 2"
			}, {
				key: "item3",
				text: "Recommendation Item 1"
			}];

		aResult[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[1][HistoryConstants.getSuggestionsGroupPropertyName()] = 20;
		aResult[2][HistoryConstants.getSuggestionsGroupPropertyName()] = 10;

		var aDataToSet = [{
			key: "item3",
			text: "Recommendation Item 1"
		}];
		aDataToSet[0][HistoryConstants.getSuggestionsGroupPropertyName()] = 10;

		this.oVLP.oControl.getModel("list").setData(aDataToSet);

		// Act
		this.oVLP._updateModelHistoryData(aHistoryData);

		// Assert
		var aData = this.oVLP.oControl.getModel("list").getData();
		assert.deepEqual(aData, aResult, "history data should be merged with recommendations");

		// Cleanup
		oAddSuggestionsToGroupSpy.restore();
		oShouldHaveRecommendations.restore();
	});

	QUnit.test("_updateModelHistoryData should close suggestion popover", function (assert) {
		// Arrange
		var done = assert.async();
		var oEventMock = { getParameter: this.stub().returns([]) };
		// var oUpdateModelHistoryDataStub = this.stub(this.oVLP, "_updateModelHistoryData");
		var oCloseSpy = this.spy();
		this.oVLP.oControl = {
			getModel: this.stub().returns({
				getData: this.stub().returns([]),
				setData: this.stub()
			}),
			isA: this.stub().returns(true),
			_oSuggPopover: {
				_oPopover: { close: oCloseSpy },
				_deregisterResize: this.stub(),
				destroy: this.stub()
			},
			unbindAggregation: this.stub(),
			data: this.stub(),
			removeEventDelegate: this.stub()
		};

		// Act
		this.oVLP._onHistoryFieldUpdated(oEventMock);

		// Assert
		setTimeout(function () {
			assert.equal(oCloseSpy.callCount, 1, "suggestion popover is closed");
			done();
		});
	});

	QUnit.test("_updateModelHistoryData should return without invoking the function if there is no control", function (assert) {
		// Arrange
		var oShowSuggestionsMoreButtonSpy = this.spy(this.oVLP, "_showSuggestionsMoreButton");
		this.oVLP.oControl = null;

		// Act
		this.oVLP._updateModelHistoryData();

		// Assert
		assert.equal(oShowSuggestionsMoreButtonSpy.callCount, 0, "_showSuggestionsMoreButton should not be called");

		// Cleanup
		oShowSuggestionsMoreButtonSpy.restore();
		this.oVLP.oControl = {
			removeEventDelegate: this.stub(),
			unbindAggregation: this.stub(),
			data: this.stub()
		};
	});

	QUnit.test("_shouldHaveHistory should return false if no metadata is provided", function (assert) {

		// Act
		this.oVLP._filedHistoryEnabled = true;
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history without metadata");

	});

	QUnit.test("_shouldHaveHistory should return true if field is not sensitive and ushell library is loaded and inputFieldHistoryStorage ushell setting is set", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		sap.ushell = {
			Container: {}
		};
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "false"
			}
		};
		this.oVLP._filedHistoryEnabled = true;
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history");

		// Arrange
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "true"
			}
		};

		// Act
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history");

		// Cleanup
		delete window["sap-ushell-config"];
		delete sap.ushell;
	});

	QUnit.test("_shouldHaveHistory should return false if it is turned off through a property for this field", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		sap.ushell = {
			Container: {}
		};
		this.oVLP._fieldViewMetadata = {
			"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
				Bool: "false"
			}
		};
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		this.oVLP._fieldHistoryEnabled = false;
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history if it is turned of by a property");

		// Cleanup
		delete window["sap-ushell-config"];
		delete sap.ushell;
	});

	QUnit.test("_shouldHaveHistory should return false if control is ComboBox or MultiComboBox", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		sap.ushell = {
			Container: {}
		};
		this.oVLP._fieldViewMetadata = {
		};
		this.oVLP._sFullyQualifiedFieldName = "test";

		// Act
		this.oVLP.oControl = new ComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history in case of ComboBox");

		// Act
		this.oVLP.oControl = new MultiComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.notOk(bResult, "should not have history in case of MultiComboBox");
	});

	QUnit.test("_shouldHaveHistory should return true if control is ComboBox or MultiComboBox and have not default setting of historyEnabled", function (assert) {
		// Arrange
		window["sap-ushell-config"] = {
			apps: {
				inputFieldHistory: {
					enabled: true
				}
			}
		};
		sap.ushell = {
			Container: {}
		};
		this.oVLP._fieldViewMetadata = {
		};
		this.oVLP._sFullyQualifiedFieldName = "test";
		this.oVLP._fieldHistoryEnabled = true;
		this.oVLP._fieldHistoryEnabledInitial = false;

		// Act
		this.oVLP.oControl = new ComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history in case of ComboBox and historyEnabled");

		// Act
		this.oVLP.oControl = new MultiComboBox();
		var bResult = this.oVLP._shouldHaveHistory();

		// Assert
		assert.ok(bResult, "should have history in case of MultiComboBox");
	});

	QUnit.test("fnFilter of Input suggestions with history or recently used should filter on formatted text and all fields in the data", function (assert) {
		// Arrange
		var oItemData = {
				key: "Key",
				description:  "Description"
			},
			oItem = {
				getBindingContext: this.stub().returns({
					getObject: this.stub().returns(oItemData)
				})
			};
		this.oVLP._setupInputSuggestionInteractions();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "description";

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idOnly";
		var bResult = this.oMockInput._fnFilter("Desc", oItem);

		// Assert
		assert.ok(bResult, "filter function searches in all fields in the data item and find in the description field");

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idAndDescription";
		var bResult = this.oMockInput._fnFilter("Key (Description)", oItem);

		// Assert
		assert.ok(bResult, "filter function searches if formatted text based on the display behaviour and find in formatted text");

		// Act
		this.oVLP.sDDLBDisplayBehaviour = "idAndDescription";
		var bResult = this.oMockInput._fnFilter("Not In the data", oItem);

		// Assert
		assert.notOk(bResult, "if filter function does not find in the formatted text or each field then return false");
	});

	QUnit.test("_onAnnotationLoad should not bind the aggregation and setup interactions if the control is not supported for history or recommendations", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);
		var oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		var oBindInnerControlSuggestionsStub = this.stub(this.oVLP, "_bindInnerControlSuggestions");
		var oSetupSuggestionInteractionsStub = this.stub(this.oVLP, "_setupSuggestionInteractions");

		// Act
		this.oVLP._onAnnotationLoad({});

		// Assert
		assert.equal(oBindInnerControlSuggestionsStub.callCount, 0, "_bindInnerControlSuggestions should not be called");
		assert.equal(oSetupSuggestionInteractionsStub.callCount, 0, "_setupSuggestionInteractions should not be called");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
		oShouldHaveHistoryStub.restore();
		oBindInnerControlSuggestionsStub.restore();
		oSetupSuggestionInteractionsStub.restore();
	});

	QUnit.test("_setupHistoryValues should not create history provider if the control is not supported", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);
		var oShouldHaveHistoryStub = this.stub(this.oVLP, "_shouldHaveHistory").returns(true);
		var oCreateHistoryValuesProviderStub = this.stub(this.oVLP, "_createHistoryValuesProvider");

		// Act
		this.oVLP._setupHistoryValues();

		// Assert
		assert.equal(oCreateHistoryValuesProviderStub.callCount, 0, "_createHistoryValuesProvider should not be called");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
		oShouldHaveHistoryStub.restore();
		oCreateHistoryValuesProviderStub.restore();
	});

	QUnit.test("_getSuggestionsModelName should return the model name not modified if the control is not supported for history", function (assert) {
		// Arrange
		var oIsControlSupportedForHistoryStub = this.stub(this.oVLP, "_isControlSupportedForHistory").returns(false);

		// Act
		var vResult = this.oVLP._getSuggestionsModelName();

		// Assert
		assert.equal(vResult, undefined, "the model name should be undefined if the control is not supported for history");

		// Cleanup
		oIsControlSupportedForHistoryStub.restore();
	});

	QUnit.test("_isControlSupportedForHistory should work correctly", function (assert) {
		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.ui.comp.smartfield.DisplayComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory();

		// Assert
		assert.notOk(bResult, "if control is destroyed it should return false");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.ui.comp.smartfield.DisplayComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.notOk(bResult, "DisplayComboBox should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.Select").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.notOk(bResult, "Select should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.Input").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "Input should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.MultiInput").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "MultiInput should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.ComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "ComboBox should not be supported for history");

		// Act
		var oStub = this.stub().returns(false);
		oStub.withArgs("sap.m.MultiComboBox").returns(true);
		var bResult = this.oVLP._isControlSupportedForHistory({ isA: oStub });

		// Assert
		assert.ok(bResult, "MultiComboBox should not be supported for history");
	});

	QUnit.test("_parseHistoryJsonDates should convert JSON date string to JS Date", function (assert) {
		// Arrange
		var aData = [{
			prop1: "Not modified",
			prop2: "/Date(1612908000000)/",
			prop3: "Date(1612908000000)" // should not be modified. Does not match the pattern /Date(timestamp)/
		}];
		var aExpected = [{
			prop1: "Not modified",
			prop2: new Date(1612908000000),
			prop3: "Date(1612908000000)"
		}];

		// Act
		var aResult = this.oVLP._parseHistoryJsonDates(aData);

		// Assert
		assert.equal(aResult[0].prop1, aExpected[0].prop1);
		assert.equal(aResult[0].prop2.getTime(), aExpected[0].prop2.getTime());
		assert.equal(aResult[0].prop3, aExpected[0].prop3);
	});

	QUnit.module("Internal functions", {
		beforeEach: function () {
			this.oMockInput  = new Input();
			this.oVLP = new ValueListProvider({
				aggregation: "suggestionRows",
				control: this.oMockInput
			});
		},
		afterEach: function () {
			this.oVLP.destroy();
			this.oMockInput.destroy();
		}
	});

	QUnit.test("_handleSelect - validation of single input fields", function (assert) {
		// Arrange
		var oAttachMethodSpy = sinon.spy(this.oMockInput, "attachChange"),
			oValidateFunctionSpy = sinon.spy(this.oVLP, "_validateStringSingleWithValueList");

		// Arrange - mock field metadata and context
		this.oVLP._fieldViewMetadata = {
			hasValueListAnnotation: true
		};
		this.oVLP.sContext = "SmartFilterBar";

		// Act - call method
		this.oVLP._handleSelect();

		// Assert
		assert.strictEqual(oAttachMethodSpy.callCount, 1, "Change handler attached to input control");

		// Act - trigger validation event
		this.oMockInput.fireChange({
			text: "Some text"
		});

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1, "Validation is called when control change event is fired");

		// Cleanup
		oValidateFunctionSpy.restore();
		oAttachMethodSpy.restore();
	});

	QUnit.test("_validateStringSingleWithValueList", function (assert) {
		// Arrange
		var oMockEvent = {
				bValidated: true,
				sValue: "some text",
				getParameter: function (sName) {
					return sName === "validated" ? this.bValidated : this.sValue;
				}
			},
			oValidateFunctionSpy = sinon.stub(this.oVLP, "_validateInput");

		// Act - call with {validated: true, value: 'some text'}
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: true, value: 'some text'}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in case event data is {validated: false, value: ''}");

		// Arrange - run method with event which value parameter is undefined
		oMockEvent.bValidated = false;
		oMockEvent.sValue = undefined;

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 0,
			"_validateInput should not be called in this case}");

		// Arrange
		oMockEvent.bValidated = false;
		oMockEvent.sValue = "Some text";

		// Act
		this.oVLP._validateStringSingleWithValueList(oMockEvent);

		// Assert
		assert.strictEqual(oValidateFunctionSpy.callCount, 1,
			"_validateInput should be called in case event data is {validated: false, value: 'Some text'}");

		// Cleanup
		oValidateFunctionSpy.restore();
	});

	QUnit.test("_handleRowSelect does not throw exception if '{' is part of the key of some tokens", function (assert) {
		// Arrange
		var oDataModelRowStub = {
			key: "not{escaped{key",
			desc: "not{escaped{desc"
		},
			oFnCallbackStub = this.stub();
		this.oVLP.oControl = new MultiInput();
		this.oVLP.sKey = "key";
		this.oVLP.sDescription = "desc";

		// Act
		this.oVLP._handleRowSelect(oDataModelRowStub, oFnCallbackStub);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_sortRecommendations sort the provided recommendations by their 'rank' property", function (assert) {
		// Arrange
		var aRecommendations = [{ rank: 1 }, { rank: 3 }, { rank: 3.3 }, { rank: 3.5 }, { rank: 2 }],
			aExpected = [{ rank: 3.5 }, { rank: 3.3 }, { rank: 3 }, { rank: 2 }, { rank: 1 }];
		this.oVLP._oRecommendationListAnnotation = {
			rankProperty: "rank"
		};

		// Act
		var aResult = aRecommendations.sort(this.oVLP._sortRecommendations.bind(this.oVLP));

		// Assert
		assert.deepEqual(aExpected, aResult, "recommendations should be sorted descending by rank property");
	});

	QUnit.test("_getBindingLength returns the size limit set to the oData model or 100", function (assert) {
		// Arrange
		this.oVLP.oODataModel = {
			iSizeLimit: 10000
		};

		// Act
		var iResult = this.oVLP._getBindingLength();

		// Assert
		assert.equal(10000, iResult, "sizeLimit should be equal to sizeLimit set to oData model");

		// Arrange
		this.oVLP.oODataModel = {
			iSizeLimit: 100
		};

		// Act
		var iResult = this.oVLP._getBindingLength();

		// Assert
		assert.equal(300, iResult, "sizeLimit should be equal default 300 if model's size limit is smaller");
	});

	QUnit.test("_bindInnerControlSuggestions should bind aggregation with length set from the oData model", function (assert) {
		// Arrange
		var oBindAggregationSpy = this.spy(this.oVLP.oControl, "bindAggregation");

		// Act
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.getCall(0).args[1].length, 300, "bindAggregation should be called with length parameter set to 300 (default length)");

		// Act
		this.oVLP.oControl.unbindAggregation(this.oVLP.sAggregationName);
		this.oVLP.oODataModel = {
			iSizeLimit: 10000
		};
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.getCall(1).args[1].length, 10000, "bindAggregation should be called with length parameter set to 10000 (size of the oData model)");
	});

	QUnit.test("_bindInnerControlSuggestions should not bind aggregation if it is already binded", function (assert) {
		// Arrange
		var oBindAggregationSpy = this.spy(this.oVLP.oControl, "bindAggregation");
		this.stub(this.oVLP.oControl, "isBound").returns(true);

		// Act
		this.oVLP._bindInnerControlSuggestions();

		// Assert
		assert.equal(oBindAggregationSpy.callCount, 0, "bindAggregation should not be called if the aggregation is already binded");
	});

	// If in params come from Input
	QUnit.test("_filterSuggestionsWithInParams should filter based on in/out params if in param is a string", function (assert) {
		// Arrange
		var oFilterInputData = {
			inProperty: "Value 1"
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 2, "one item should be removed because it does not match the in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	// BCP: 2080348788 if inParams are coming from multi input
	QUnit.test("_filterSuggestionsWithInParams should filter based on in/out params if in param is an object", function (assert) {
		// Arrange
		var oFilterInputData = {
			inProperty: { items: [{key: "Value 1"}] }
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 2, "one item should be removed because it does not match the in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	QUnit.test("_filterSuggestionsWithInParams should not filter based on in/out params which are not contained as key", function (assert) {
		// Arrange
		var oFilterInputData = {
			notIn: "Value 1"
		};
		var aItems = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];
		var aExpected = [{
			otherProp: "prop 1",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 2",
			inProperty: "Value 1"
		}, {
			otherProp: "prop 3",
			inProperty: "Value 2"
		}];

		// Act
		var aResult = aItems.filter(this.oVLP._filterSuggestionsWithInParams.bind(this.oVLP, oFilterInputData));

		// Assert
		assert.equal(aResult.length, 3, "no item should be removed because the filter key does not define in params");
		assert.deepEqual(aResult, aExpected, "should match the expected");
	});

	QUnit.test("_createSuggestionTemplate adds a css class to the suggestions table", function (assert) {
		// Arrange
		var oAddStyleClassSpy = this.spy();
		this.oVLP.oControl = {
			data: this.stub(),
			unbindAggregation: this.stub(),
			removeEventDelegate: this.stub(),
			_oSuggestionTable: {
				addStyleClass: oAddStyleClassSpy
			}
		};

		// Act
		this.oVLP._createSuggestionTemplate();

		// Assert
		assert.equal(oAddStyleClassSpy.callCount, 1, "addStyleClass for the suggestions table is called");
		assert.equal(oAddStyleClassSpy.getCall(0).args[0], "sapUiCompValueListProviderTable", "the right css class is added to the suggestions table");
	});

	QUnit.test("BCP:2070305180 _validateInput _pendingAutoTokenGeneration flag is raised/lowered when _handleRowSelect is called", function (assert) {
		// Arrange
		var oModel = {
				read: function (sPath, oSettings) {
					oSettings.success({
						results: [
							{KEY: "1", TXT: "Desc"}
						]
					});
				}
			},
			oAnnotation = {keyField: "KEY"},
			oControl = new MultiInput(),
			oVLP = new ValueListProvider({
				model: oModel,
				control: oControl,
				annotation: oAnnotation
			});

		// Assert
		assert.strictEqual(oControl._pendingAutoTokenGeneration, undefined, "Pending flag has not been defined yet");

		// Arrange
		oVLP._handleRowSelect = function () {
			// Assert
			assert.strictEqual(oControl._pendingAutoTokenGeneration, true, "Pending flag is raised");
		};

		// Act
		oVLP._validateInput("1");

		// Assert
		assert.strictEqual(oControl._pendingAutoTokenGeneration, false, "Pending flag is lowered");

		// Cleanup
		oControl.destroy();
		oVLP.destroy();
	});


	QUnit.start();

});
