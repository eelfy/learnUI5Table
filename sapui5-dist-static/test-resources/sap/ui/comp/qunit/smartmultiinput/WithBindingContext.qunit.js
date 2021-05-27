/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.WithBindingContext", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/m/Token",
	"sap/ui/core/ValueState",
	"sap/ui/model/Filter",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, Token, ValueState, Filter, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("binding context", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;
				that.oModel.setDeferredGroups([]);

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
						that.oModel.detachRequestCompleted(onRequestCompleted);
						fnDone();
					}
				}

				that.oModel.attachRequestCompleted(onRequestCompleted);

			});
		},

		afterEach: function (assert) {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
			assert.ok(!this.oSmartMultiInput._oMultiInput, "Multi Input is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oMultiComboBox, "Multi ComboBox is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oTokenizer, "Tokenizer is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oHBox, "HBox is destroyed on exit");
		}
	});

	TestUtils.initCommonTests();

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");

		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help button shown");
	});


	// TODO tests for different Edm types
	QUnit.test("_validateValue", function (assert) {
		assert.ok(this.oSmartMultiInput._validateValue("PR"));
		assert.ok(this.oSmartMultiInput._validateValue("1234"));
		assert.notOk(this.oSmartMultiInput._validateValue(""));
		assert.notOk(this.oSmartMultiInput._validateValue("1234567890123456789012345"));
	});

	QUnit.test("_addToken", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sCategory = "NEW";

		var oRowData = {"ProductId": "TestProduct"};

		var mBeforeCreateData = {
			CategoryId: "NEW",
			ProductId: "TestProduct"
		};
		var mAfterCreateData = {
			CategoryId: "NEW",
			ProductId: "TestProduct",
			BeforeCreate: "wasCalled"
		};

		var mBeforeCreateParams = {
			headers: {
				test: "test"
			}
		};

		var mBeforeCreateTestParams = {
			"changeSetId": undefined,
			"groupId": "changes"
		};

		var oCreateSpy = sinon.spy(this.oModel, "createEntry");

		this.oSmartMultiInput.attachBeforeCreate(function (oEvent) {
			var oData = oEvent.getParameter("oData");
			assert.deepEqual(oData, mBeforeCreateData, "before create events provides correct oData");
			oData.BeforeCreate = "wasCalled";

			var mParameters = oEvent.getParameter("mParameters");
			assert.deepEqual(mParameters, mBeforeCreateTestParams, "before create events provides correct mParameters");

			for (var sParam in mBeforeCreateParams) {
				mParameters[sParam] = mBeforeCreateParams[sParam];
			}
		});

		function onRequestCompleted() {
			that.oModel.detachRequestCompleted(onRequestCompleted);

			assert.ok(oCreateSpy.calledOnce, "create method was called once");
			assert.equal(oCreateSpy.args[0][0], "Categories", "create was called with correct path");
			assert.deepEqual(oCreateSpy.args[0][1].properties, mAfterCreateData, "create was called with correct data");

			assert.equal(Object.keys(oCreateSpy.args[0][1]).length, 6
				, "create was called with correct number of parameters");

			for (var sParam in mBeforeCreateParams) {
				assert.equal(oCreateSpy.args[0][1][sParam], mBeforeCreateParams[sParam], sParam + " correct");
			}

			fnDone();
		}

		this.oModel.attachRequestCompleted(onRequestCompleted);


		var oToken = new Token({
			text: sCategory,
			key: sCategory
		});

		oToken.data("row", oRowData);

		this.oSmartMultiInput._addToken(oToken);
	});

	QUnit.skip("_addToken failed request", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var sKey = "SS";
		var mRowData = {
			CategoryId: sKey
		};

		var oModel = this.oModel;
		sinon.stub(this.oSmartMultiInput, "_getEntityKeyProperties").returns({});

		oModel.attachRequestFailed(function () {
			assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "smi is in error state");
			assert.equal(that.oSmartMultiInput.getValueStateText(), "cannot add this entity", "correct error text");
			assert.equal(that.oSmartMultiInput._oMultiInput.getValue(), sKey, "multiInput value is set to the error key");
			fnDone();
		});

		var oToken = new Token({
			key: sKey
		});
		oToken.data("row", mRowData);

		this.oSmartMultiInput._addToken(oToken);
	});

	QUnit.test("When BindingContext is set to null, model resetChanges is called and finally context is set", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		this.oSmartMultiInput.setBindingContext(null);
		this.oModel.resetChanges();
		this.oSmartMultiInput.setBindingContext();

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");

		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}
	});

	QUnit.test("beforeCreate prevent default", function (assert) {
		var mRowData = {
			data: "data",
			"__metadata": "not in the call"
		};

		var oCreateSpy = sinon.spy(this.oModel, "create");

		this.oSmartMultiInput.attachBeforeCreate(function (oEvent) {
			oEvent.preventDefault();
		});

		var oToken = new Token();
		oToken.data("row", mRowData);

		this.oSmartMultiInput._addToken(oToken);

		assert.notOk(oCreateSpy.called, "create not called");
	});

	QUnit.test("_removeToken", function (assert) {
		var that = this;
		var fnDone = assert.async();
		var mBeforeRemove = {
			groupId: 1,
			changeSetId: 2
		};
		var mBeforeRemoveTestParams = {
			"changeSetId": undefined,
			"groupId": "changes"
		};


		var oToken = this.oSmartMultiInput.getTokens()[0];

		var oRemoveSpy = sinon.spy(this.oModel, "remove");

		this.oSmartMultiInput.attachBeforeRemove(function (oEvent) {
			var mParameters = oEvent.getParameter("mParameters");
			assert.deepEqual(mParameters, mBeforeRemoveTestParams, "beforeRemove called with empty object");

			for (var sParam in mBeforeRemove) {
				mParameters[sParam] = mBeforeRemove[sParam];
			}
		});

		function onRequestCompleted() {
			that.oModel.detachRequestCompleted(onRequestCompleted);

			assert.ok(oRemoveSpy.calledOnce, "remove called once");
			assert.equal(oRemoveSpy.args[0][0], "",
				"remove called with correct path");

			assert.equal(Object.keys(oRemoveSpy.args[0][1]).length, Object.keys(mBeforeRemove).length + 2,
				"remove called with correct number of parameters");

			for (var sParam in mBeforeRemove) {
				assert.equal(oRemoveSpy.args[0][1][sParam], mBeforeRemove[sParam], sParam + " is correct");
			}

			fnDone();
		}

		this.oModel.attachRequestCompleted(onRequestCompleted);

		this.oSmartMultiInput._removeToken(oToken);
	});

	QUnit.skip("_removeToken failed request", function (assert) {
		var that = this;
		var fnDone = assert.async();

		this.oModel.attachRequestFailed(function () {
			assert.equal(that.oSmartMultiInput.getValueState(), ValueState.Error, "smi is in error state");
			assert.equal(that.oSmartMultiInput.getValueStateText(), "cannot delete this entity", "correct error text");
			fnDone();
		});

		var oToken = this.oSmartMultiInput.getTokens()[1];
		this.oSmartMultiInput._removeToken(oToken);
	});


	QUnit.test("beforeRemove prevent default", function (assert) {
		var oToken = this.oSmartMultiInput.getTokens()[0];

		var oRemoveSpy = sinon.spy(this.oModel, "remove");

		this.oSmartMultiInput.attachBeforeRemove(function (oEvent) {
			oEvent.preventDefault();
		});


		this.oSmartMultiInput._removeToken(oToken);

		assert.notOk(oRemoveSpy.called, "remove not called");
	});

	QUnit.test("_getNavigationPath", function (assert) {
		assert.equal(this.oSmartMultiInput._getNavigationPath(), "Categories");
	});

	QUnit.test("non editable mode", function (assert) {
		var that = this,
			fnDone = assert.async();

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");

		this.oSmartMultiInput.setEditable(false);

		this.oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				assert.ok(that.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
				assert.ok(that.oSmartMultiInput._oTokenizer, "tokenizer exists");
				assert.notOk(that.oSmartMultiInput._oTokenizer.getEditable(), "tokenizer is not editable");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens().length, 2, "tokenizer has correct number of tokens");
				assert.ok(that.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is bound");

				fnDone();
			}
		});
	});

	QUnit.test("New Display Mode - pre-rendering scenario", function (assert) {

		var that = this;
		var fnDone = assert.async();

		that.oPreRenderedMultiInput = new SmartMultiInput({
			value: {
				path: "Categories/CategoryId"
			}
		});

		that.oPreRenderedMultiInput.setModel(that.oModel);
		that.oPreRenderedMultiInput.bindElement({
			path: "/Products('1')"
		});

		that.oPreRenderedMultiInput.setEditable(false);
		sap.ui.getCore().applyChanges();

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.ok(that.oPreRenderedMultiInput.bControlNotRendered, "SmartMultiInput is not rendered");
				assert.notOk(that.oPreRenderedMultiInput._oEmptyDash.getVisible(), "SmartMultiInput not empty");
				assert.ok(that.oPreRenderedMultiInput._oHBox.getItems().length > 0, "Display Mode HBox populated with values before rendering");
				fnDone();
			}
		}

		that.oModel.attachRequestCompleted(onRequestCompleted);
	});

	QUnit.test("New Display Mode - One Token Scenario", function (assert) {

		var fnDone = assert.async();
		var aTokens = this.oSmartMultiInput.getTokens();

		this.oSmartMultiInput._removeToken(aTokens[1]);
		this.oSmartMultiInput.setEditable(false);

		sap.ui.getCore().applyChanges();

		this.oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				//check for Dash value
				assert.ok(!this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash not appearing if there are tokens");

				var aText = this.oSmartMultiInput._oHBox.getItems()[0].getText();

				//checking edit mode token and display mode text value is same or not
				assert.equal(aTokens[0].getText(), aText, "The text control contained in the HBox has the same value as the token text added");

				// There should be no separator in the text
				assert.ok(!aText.includes(this.oSmartMultiInput.getTextSeparator()), "No separator appearing in the text");

				//More Link is invisible
				assert.ok(!this.oSmartMultiInput._oMoreLink.getVisible(), "More link is invisible");
				fnDone();
			}
		}.bind(this));
	});

	QUnit.test("New Display Mode - Two Tokens Scenario", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.setEditable(false);

		sap.ui.getCore().applyChanges();

		this.oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {

				//check for Dash value
				assert.ok(!this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash not appearing if there are tokens");

				//Count of the texts inside the HBox should be 2
				assert.equal(this.oSmartMultiInput._oHBox.getItems().length, 2, "Count of texts inside HBox should be 2");

				var sSecondText = this.oSmartMultiInput._oHBox.getItems()[1].getText();

				// Separator is coming in between the texts
				assert.ok(sSecondText.includes(this.oSmartMultiInput.getTextSeparator()), "Separator is coming before the second text");

				//More Link should be invisible
				assert.ok(!this.oSmartMultiInput._oMoreLink.getVisible(), "More link should be invisible");
				fnDone();
			}
		}.bind(this));
	});

	QUnit.test("_getEntityKeyProperties", function (assert) {
		var mTextProperties = {
			CategoryId: "PR",
			ProductId: "1"
		};

		var oContext = this.oSmartMultiInput.getTokens()[0].getBindingContext();
		var mKeyProperties = this.oSmartMultiInput._getEntityKeyProperties(oContext);

		assert.deepEqual(mKeyProperties, mTextProperties, "correct key properties should be returned");
	});

	QUnit.test("getFilter", function(assert) {
		var aTestFilters = [
			new Filter("CategoryId", "EQ", "LT"),
			new Filter("CategoryId", "EQ", "PR")
			],
			oTestFilter = new Filter(aTestFilters, false);

		var oFilter = this.oSmartMultiInput.getFilter();

		assert.deepEqual(oFilter, oTestFilter, "correct filters should be returned");
	});

	QUnit.test("getRangeData", function(assert) {
		var aTestRangeData = [
			{exclude: false, operation: "EQ", value1: "PR", value2: "", keyField: "CategoryId"},
			{exclude: false, operation: "EQ", value1: "LT", value2: "", keyField: "CategoryId"}
		];

		var aRangeData = this.oSmartMultiInput.getRangeData();

		assert.deepEqual(aRangeData, aTestRangeData, "correct range data should be returned");
	});

	QUnit.test("token update", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.attachTokenUpdate(function () {
			assert.ok(true, "smartMultiInput tokenUpdate called on inner multiInput token update");
			fnDone();
		});

		this.oSmartMultiInput._oMultiInput.fireTokenUpdate({
			addedTokens: [],
			removedTokens: []
		});
	});
	/*
	* EDITABLE MODE
	*/
	QUnit.module("Binding Multi Input Tokens - oData Select Enabled", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				this.oModel.setDeferredGroups([]);

				this.oSmartMultiInput = new SmartMultiInput({
					enableODataSelect: true,
					value: {
						path: "Categories/CategoryId"
					}
				});

				this.oSmartMultiInput.setModel(this.oModel);
				this.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				this.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100&$select=CategoryId%2cDescription") {
						assert.ok("URL is correct");
						this.detachRequestCompleted(onRequestCompleted);
					}
				}

				this.oModel.attachRequestCompleted(onRequestCompleted);

				this.oSmartMultiInput.attachInitialise(function() {
					this.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function (oEvent) {
						this.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					}.bind(this));
				}.bind(this));
			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");
		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}
	});

	QUnit.test("Inner Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oMultiInput.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "CategoryId,Description", "select parameters are correct");
	});

	QUnit.test("Inner Multi Input's token data", function (assert) {
		var aTestDataKeys = ["__metadata", "CategoryId", "Description"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});

	QUnit.module("Binding Multi Input Tokens - oData Select Enabled and RequestAtLeast provided", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				this.oModel.setDeferredGroups([]);

				this.oSmartMultiInput = new SmartMultiInput({
					enableODataSelect: true,
					requestAtLeastFields: "ProductId",
					value: {
						path: "Categories/CategoryId"
					}
				});

				this.oSmartMultiInput.setModel(this.oModel);
				this.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				this.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100&$select=CategoryId%2cDescription%2cProductId") {
						assert.ok("URL is correct");
						this.detachRequestCompleted(onRequestCompleted);
					}
				}

				this.oModel.attachRequestCompleted(onRequestCompleted);

				this.oSmartMultiInput.attachInitialise(function() {
					this.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function (oEvent) {
						this.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					}.bind(this));
				}.bind(this));
			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});
	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");
		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}
	});

	QUnit.test("Inner Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oMultiInput.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "CategoryId,Description,ProductId", "select parameters are correct");
	});

	QUnit.module("Binding Mutli ComboBox Tokens", {

		beforeEach: function (assert) {

			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				this.oModel.setDeferredGroups([]);

				this.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/Description"
					}
				});

				this.oSmartMultiInput.setModel(this.oModel);
				this.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				this.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();

				this.oModel.attachRequestCompleted(function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')") {
						this.oModel.detachRequestCompleted(onRequestCompleted);
						fnDone();
					}
				}.bind(this));

			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("Check if MultiCombobox is reset during multi input creation", function(assert) {
		var fnDone = assert.async(),
			that = this;

		assert.ok(!!this.oSmartMultiInput._oMultiComboBox, "Multi Combo Box present from the initial binding");

		this.oSmartMultiInput.bindProperty("value", "Categories/CategoryId");
		this.oSmartMultiInput.setModel(this.oModel);
		this.oSmartMultiInput.bindElement({
			path: "/Products('1')"
		});

		sap.ui.getCore().applyChanges();

		this.oModel.attachRequestCompleted(onRequestCompleted);

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.notOk(!!that.oSmartMultiInput._oMultiComboBox, "Multi Combo Box reset after binding to a different entity");
				fnDone();
			}
		}
	});

	/*
	* NON EDITABLE MODE
	*/
	QUnit.module("Binding Multi Input Tokens - oData Select Enabled - Non editable mode", {
		beforeEach: function (assert) {
			var fnDone = assert.async();
			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				this.oModel.setDeferredGroups([]);

				this.oSmartMultiInput = new SmartMultiInput({
					editable: false,
					enableODataSelect: true,
					value: {
						path: "Categories/CategoryId"
					}
				});
				this.oSmartMultiInput.setModel(this.oModel);
				this.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});
				this.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();
				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100&$select=CategoryId%2cDescription") {
						assert.ok("URL is correct");
						this.detachRequestCompleted(onRequestCompleted);
					}
				}
				this.oModel.attachRequestCompleted(onRequestCompleted);
				this.oSmartMultiInput.attachInitialise(function() {
					this.oSmartMultiInput._oTokenizer.getBinding("tokens").attachDataReceived(function (oEvent) {
						assert.equal(this.oSmartMultiInput._oTokenizer.getTokens().length, 2, "tokenizer has correct number of tokens");
						assert.ok(this.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is bound");
						this.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					}.bind(this));
				}.bind(this));
			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});
	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput._oTokenizer.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");
		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}
	});

	QUnit.test("Inner Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oTokenizer.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "CategoryId,Description", "select parameters are correct");
	});

	QUnit.test("Inner Multi Input's token data", function (assert) {
		var aTestDataKeys = ["__metadata", "CategoryId", "Description"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});
	QUnit.module("Binding Multi Input Tokens - oData Select Enabled and RequestAtLeast provided - Non editable mode", {
		beforeEach: function (assert) {
			var fnDone = assert.async();
			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				this.oModel = oModel;
				this.oModel.setDeferredGroups([]);

				this.oSmartMultiInput = new SmartMultiInput({
					editable: false,
					enableODataSelect: true,
					requestAtLeastFields: "ProductId",
					value: {
						path: "Categories/CategoryId"
					}
				});
				this.oSmartMultiInput.setModel(this.oModel);
				this.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});
				this.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();
				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100&$select=CategoryId%2cDescription%2cProductId") {
						assert.ok("URL is correct");
						this.detachRequestCompleted(onRequestCompleted);
					}
				}
				this.oModel.attachRequestCompleted(onRequestCompleted);
				this.oSmartMultiInput.attachInitialise(function() {
					this.oSmartMultiInput._oTokenizer.getBinding("tokens").attachDataReceived(function (oEvent) {
						assert.equal(this.oSmartMultiInput._oTokenizer.getTokens().length, 2, "tokenizer has correct number of tokens");
						assert.ok(this.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is bound");
						this.data = oEvent.getParameter("data").results;
						setTimeout(fnDone, 0); // wait for propagation from the model
					}.bind(this));
				}.bind(this));
			}.bind(this));
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});
	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestData = {
			tokens: [
				{
					key: "PR",
					text: "Projector (PR)"
				},
				{
					key: "LT",
					text: "Laptop (LT)"
				}
			]
		};

		var aTokens = this.oSmartMultiInput._oTokenizer.getTokens();
		assert.equal(aTokens.length, 2, "number of tokens");
		for (var i = 0; i < mTestData.tokens.length; i++) {
			assert.equal(aTokens[i].getKey(), mTestData.tokens[i].key, "key is correct");
			assert.equal(aTokens[i].getText(), mTestData.tokens[i].text, "text is correct");
		}
	});

	QUnit.test("Inner Multi Input's token parameters", function (assert) {
		var oBinding = this.oSmartMultiInput._oTokenizer.getBinding("tokens");
		assert.equal(oBinding.mParameters.select, "CategoryId,Description,ProductId", "select parameters are correct");
	});
	QUnit.test("Inner Multi Input's token data", function (assert) {
		var aTestDataKeys = ["__metadata", "CategoryId", "Description", "ProductId"];
		for (var i = 0; i < this.data.length; i++) {
			var aResultKeys = Object.keys(this.data[i]);
			assert.deepEqual(aResultKeys, aTestDataKeys, "Right data is returned");
		}
	});

	QUnit.module("without binding context 2", {
		before: function () {
			this.oMockServer = TestUtils.createMockServer();
		},
		after: function () {
			this.oMockServer.destroy();
		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;

				fnDone();

			});
		},

		afterEach: function () {
			this.oModel.destroy();
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("supportMultiSelect true", function(assert) {
		var fnDone = assert.async();
		var that = this;

		that.oSmartMultiInput = new SmartMultiInput({
			value: {
				path: "Categories/CategoryId"
			},
			supportMultiSelect: true
		});

		that.oSmartMultiInput.setModel(that.oModel);
		that.oSmartMultiInput.bindElement({
			path: "/Products('1')"
		});

		that.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		that.oModel.attachRequestCompleted(onRequestCompleted);

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.ok(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
				fnDone();
			}
		}
	});

	QUnit.test("supportMultiSelect false", function(assert) {
		var fnDone = assert.async();
		var that = this;

		that.oSmartMultiInput = new SmartMultiInput({
			value: {
				path: "Categories/CategoryId"
			},
			supportMultiSelect: false
		});

		that.oSmartMultiInput.setModel(that.oModel);
		that.oSmartMultiInput.bindElement({
			path: "/Products('1')"
		});

		that.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		that.oModel.attachRequestCompleted(onRequestCompleted);

		function onRequestCompleted(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('1')/Categories?$skip=0&$top=100") {
				that.oModel.detachRequestCompleted(onRequestCompleted);
				assert.notOk(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
				fnDone();
			}
		}
	});

	QUnit.module("Single Token Tests", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;
				that.oModel.setDeferredGroups([]);

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('3')"
				});

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('3')/Categories?$skip=0&$top=100") {
						that.oModel.detachRequestCompleted(onRequestCompleted);
						fnDone();
					}
				}

				that.oModel.attachRequestCompleted(onRequestCompleted);

			});
		},

		afterEach: function (assert) {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("New Display Mode - Empty Scenario", function (assert) {

		var fnDone = assert.async();
		var aTokens = this.oSmartMultiInput.getTokens();

		this.oSmartMultiInput._removeToken(aTokens[0]);
		this.oSmartMultiInput.setEditable(false);

		sap.ui.getCore().applyChanges();

		this.oModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('3')/Categories?$skip=0&$top=100") {
				//check for Dash value
				assert.ok(this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash appearing if there are tokens");
				fnDone();
			}
		}.bind(this));
	});

	QUnit.module("Multiple Token Tests", {

		beforeEach: function (assert) {

			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;
				that.oModel.setDeferredGroups([]);

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('2')"
				});

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();


				function onRequestCompleted(oEvent) {
					if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('2')/Categories?$skip=0&$top=100") {
						that.oModel.detachRequestCompleted(onRequestCompleted);
						fnDone();
					}
				}

				that.oModel.attachRequestCompleted(onRequestCompleted);

			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("New Display Mode -  Multiple Tokens Scenario", function (assert) {
		var fnDone = assert.async();

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");
		sinon.spy(this.oSmartMultiInput, "_handleNMoreIndicatorPress");

		this.oSmartMultiInput.setEditable(false);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");

			this.oModel.attachRequestCompleted(function(oEvent) {

				if (oEvent.getParameter("url") === "/smartmultiinput.SmartMultiInput/Products('2')/Categories?$skip=0&$top=100") {

					var aTokens = this.oSmartMultiInput._oHBox.getItems();
					if (aTokens.length > 0) {
					var iHiddenTokensCount = this.oSmartMultiInput.getTokens().length - aTokens.length,
						oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getText(),
						oSecondLastCharacter = oLastText.charAt(oLastText.length - 2),
						oLastTokenText = this.oSmartMultiInput.getTokens()[this.oSmartMultiInput.getTokens().length - 1].getText();
					oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getTooltip();

					assert.ok(!this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash not appearing if there are tokens");
					assert.ok(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is visible");
					assert.equal(oSecondLastCharacter, this.oSmartMultiInput.getTextSeparator(), "Separator is present before the more link");
					assert.equal(iHiddenTokensCount, parseInt(this.oSmartMultiInput._oMoreLink.getText()), "Count of the invisible tokens in more link is correct (" + iHiddenTokensCount + ")");

					//Check if the last visible text is from the last added token
					assert.equal(oLastText, oLastTokenText, "Last visible Text is from the last added token");

					//Trigger More Link Press
					this.oSmartMultiInput._oMoreLink.firePress();
					assert.ok(this.oSmartMultiInput._handleNMoreIndicatorPress.calledOnce, "_handleNMoreIndicatorPress should be called once");
					assert.ok(this.oSmartMultiInput._getReadTokenListPopover().getVisible(), "Popover is visible when more link is clicked");
					fnDone();
				}
				}
		}.bind(this));
	});

});
