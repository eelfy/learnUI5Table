/*global QUnit,sinon*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.WithoutBindingContext", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/m/Token",
	"sap/ui/model/Filter",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/base/Event"
], function (SmartMultiInput, TestUtils, Token, Filter, createAndAppendDiv, Event) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("without binding context", {
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

				that.oSmartMultiInput = new SmartMultiInput({
					entitySet: "Categories",
					value: {
						path: "CategoryId"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();

				that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
					fnDone();
				});

			});
		},

		afterEach: function (assert) {
			this.oModel.destroy();
			this.oSmartMultiInput.destroy();
			assert.ok(!this.oSmartMultiInput._oMultiInput, "Multi Input is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oMultiComboBox, "Multi ComboBox is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oTokenizer, "Tokenizer is destroyed on exit");
			assert.ok(!this.oSmartMultiInput._oHBox, "HBox is destroyed on exit");
		}
	});

	TestUtils.initCommonTests();

	QUnit.test("multi input is rendered correctly", function (assert) {
		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 0, "number of tokens");

		assert.ok(this.oSmartMultiInput._oMultiInput.getShowValueHelp(), "value help button shown");
		assert.ok(this.oSmartMultiInput._oMultiInput.getAutocomplete(), "autocomplete enabled for multi input");
	});

	QUnit.test("_getNavigationPath", function (assert) {
		assert.equal(this.oSmartMultiInput._getNavigationPath(), "");
	});

	QUnit.test("non editable mode", function (assert) {
		var that = this,
			fnDone = assert.async(),
			sText = "test";

		this.oSmartMultiInput._oMultiInput.addToken(
			new Token({
				key: sText,
				text: sText
			})
		);
		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {
			assert.ok(that.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
			assert.ok(that.oSmartMultiInput._oTokenizer, "tokenizer exists");
			assert.notOk(that.oSmartMultiInput._oTokenizer.getEditable(), "tokenizer is not editable");

			// wait for tokenizer to render its items
			setTimeout(function () {
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens().length, 1, "tokenizer has correct number of tokens");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens()[0].getText(), sText, "correct text");
				assert.equal(that.oSmartMultiInput._oTokenizer.getTokens()[0].getKey(), sText, "correct key");
				assert.notOk(that.oSmartMultiInput._oTokenizer.getBinding("tokens"), "tokenizer is not bound");
			}, 0);

			fnDone();
		});

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("token update", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.attachTokenUpdate(function () {
			assert.ok(true, "smartMultiInput tokenUpdate called on inner multiInput token update");
			fnDone();
		});

		this.oSmartMultiInput._oMultiInput.fireTokenUpdate({});
	});

	QUnit.test("getFilter", function (assert) {
		var sValue = "VALUE";
		var oToken = new Token({text: sValue, key: sValue});
		var aTestFilters = [
			new Filter("CategoryId", "EQ", sValue)
		];
		var oTestFilter = new Filter(aTestFilters, false);


		this.oSmartMultiInput._oMultiInput.addToken(oToken);

		var oFilter = this.oSmartMultiInput.getFilter();

		assert.deepEqual(oFilter, oTestFilter, "correct filters should be returned");
	});

	QUnit.test("getRangeData", function(assert) {
		var sValue = "value";
		var mTestRangeData = {
			exclude: true, operation: "BT", value1: sValue, value2: "", keyField: "CategoryId"
		};
		var oToken = new Token({text: sValue, key: sValue});
		oToken.data("range", mTestRangeData);

		this.oSmartMultiInput._oMultiInput.addToken(oToken);

		var aRangeData = this.oSmartMultiInput.getRangeData();
		assert.ok(aRangeData.length === 1, "range data should have one value");
		assert.deepEqual(aRangeData[0], mTestRangeData, "correct range data should be returned");
	});

	QUnit.test("setRangeData", function(assert) {
		var fnDone = assert.async();
		var aTexts = [
			"Value1",
			"Value2"
		];
		var mTestRangeData = {
			exclude: false, operation: "EQ", value1: aTexts[0], value2: "", keyField: "CategoryId"
		};
		var mTestRangeDataMultiple = [
			{exclude: false, operation: "EQ", value1: aTexts[0], value2: "", keyField: "CategoryId"},
			{exclude: false, operation: "EQ", value1: aTexts[1], value2: "", keyField: "CategoryId"}
		];
		// one value
		this.oSmartMultiInput.setRangeData(mTestRangeData);

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.ok(aTokens.length === 1, "one token present in SmartMultiInput");
		assert.equal(aTokens[0].getText(), "=" + aTexts[0], "correct text on the token should be set");

		// multiple values
		this.oSmartMultiInput.setRangeData(mTestRangeDataMultiple);

		aTokens = this.oSmartMultiInput.getTokens();
		assert.ok(aTokens.length === 2, "multiple tokens present in SmartMultiInput");
		for (var i = 0; i < aTexts.length; i++) {
			assert.equal(aTokens[i].getText(), "=" + aTexts[i], "correct text on the token should be set");
		}

		var oValueHelpProvider = this.oSmartMultiInput._oFactory._aProviders[0];
		oValueHelpProvider._createValueHelpDialog();

		setTimeout(function(){
			var oToken = new Token({text: "Value3", key: aTokens[0].getKey()}),
				oParams = {
					"id": oValueHelpProvider.oValueHelpDialog.getId(),
					"tokens": [oToken],
					"_tokensHaveChanged": true
				},
				oEvent = new Event("ok", oValueHelpProvider.oValueHelpDialog, oParams);
				oValueHelpProvider._onOK.call(oValueHelpProvider, oEvent);
				assert.equal(this.oSmartMultiInput.getTokens()[0].getText(), "Value3", "token text modified");
				fnDone();
		}.bind(this), 2000);

	});

	QUnit.test("removing tokens through tokenUpdate", function (assert) {

		var oFirstToken = new Token({
			key: "Token 1",
			text: "AB"
		});
		 var oSecondToken = new Token({
			key: "Token 2",
			text: "CD"
		});

		this.oSmartMultiInput._oMultiInput.addToken(oFirstToken);
		this.oSmartMultiInput._oMultiInput.addToken(oSecondToken);
		assert.equal(this.oSmartMultiInput.getTokens().length, 2, "getTokens return correct number of tokens");

		this.oSmartMultiInput._oMultiInput.fireTokenUpdate({
			addedTokens: [],
			removedTokens: [oSecondToken]
		});
		assert.equal(this.oSmartMultiInput.getTokens().length, 1, "getTokens return correct number of tokens");

	});

	QUnit.test("New Display Mode - Empty and Single Token Addition", function (assert) {

		var fnDone = assert.async(),
		sText = "test";

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");

		this.oSmartMultiInput.setEditable(false);

		assert.ok(this.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
		assert.ok(this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash appearing if there are no tokens");
		assert.strictEqual(this.oSmartMultiInput._iHBoxWidth, undefined, "HBox Width is undefined");
		assert.strictEqual(this.oSmartMultiInput._iHiddenLabelsCount, undefined, "Hidden Labels Count is undefined");

		this.oSmartMultiInput.setEditable(true);

		this.oSmartMultiInput._oMultiInput.addToken(
			new Token({
				key: sText,
				text: sText
			})
		);

	this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

		assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

		// wait for hbox to render its items
		setTimeout(function () {
			assert.ok(this.oSmartMultiInput._iHBoxWidth > 0, "HBox Width is defined and greater than zero");
			assert.strictEqual(this.oSmartMultiInput._iHiddenLabelsCount, 0, "Hidden Labels Count defined and is set to 0");
			assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
			assert.notOk(this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash disappearing if there are tokens");
			//Single Token tests
			assert.equal(this.oSmartMultiInput._oHBox.getItems().length, 1, "HBox has correct number of tokens");
			assert.equal(this.oSmartMultiInput._oHBox.getItems()[0].getText(), sText, "correct text");
			var sLastTokenText = this.oSmartMultiInput._oHBox.getItems()[0].getText();
			assert.notOk(sLastTokenText.includes(this.oSmartMultiInput.getTextSeparator()), "No separator appearing in the text");
			assert.notOk(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is not visible");
		}.bind(this), 0);

		fnDone();
	}.bind(this));

	this.oSmartMultiInput.setEditable(false);

	});

	QUnit.test("New Display Mode - Adding Date as Key Value", function (assert) {

		var fnDone = assert.async(),
		sText = "test",
		oDate = new Date("2020-10-19T15:41:46.038Z");

		this.oSmartMultiInput._oMultiInput.addToken(
			new Token({
				key: oDate,
				text: sText
			})
		);

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for tokenizer to render its items
			setTimeout(function () {
				assert.equal(this.oSmartMultiInput._oTokenizer.getTokens()[0].getKey(), oDate.toString(), "Correct Key");
			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("New Display Mode - Adding Non Date values", function (assert) {

		var fnDone = assert.async(),
		sText = "test";

		this.oSmartMultiInput._oMultiInput.addToken(
			new Token({
				key: "01234",
				text: sText
			})
		);

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for tokenizer to render its items
			setTimeout(function () {
				assert.equal(this.oSmartMultiInput._oTokenizer.getTokens()[0].getKey(), "01234", "Correct Key");
			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
	});

    QUnit.test("New Display Mode - Two Tokens Added", function (assert) {

		var fnDone = assert.async();

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");

		this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "Token 1",
				text: "AB"
            })
        );
        this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "Token 2",
				text: "CD"
            })
        );

	this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

		assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

		// wait for hbox to render its items
		setTimeout(function () {
			assert.ok(this.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
			assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
			assert.notOk(this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash disappearing if there are tokens");
			//Two Token tests
			assert.equal(this.oSmartMultiInput._oHBox.getItems().length, 2, "HBox has correct number of tokens");
			var sLastTokenText = this.oSmartMultiInput._oHBox.getItems()[1].getText();
			assert.ok(sLastTokenText.includes(this.oSmartMultiInput.getTextSeparator()), "Separator appearing between the tokens");
			assert.notOk(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is not visible");
		}.bind(this), 0);

		fnDone();
	}.bind(this));

	this.oSmartMultiInput.setEditable(false);

	});

	QUnit.test("New Display Mode: Multiple Tokens Added", function (assert) {

		var fnDone = assert.async(),
		sText = "This is a very long text";

		sinon.spy(this.oSmartMultiInput._oFactory, "_createTokenizer");
		sinon.spy(this.oSmartMultiInput, "_handleNMoreIndicatorPress");

		for (var i = 1; i <= 14; i++) {
            this.oSmartMultiInput._oMultiInput.addToken(
                new Token({
                    key: sText + i,
                    text: sText + i
                })
			);
		}
		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for hbox to render its items
			setTimeout(function () {
				assert.ok(this.oSmartMultiInput._oFactory._createTokenizer.calledOnce, "_createTokenizer should be called once");
				assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
				assert.notOk(this.oSmartMultiInput._oEmptyDash.getVisible(), "Dash disappearing if there are tokens");
				//Multiple Token tests
				var aTokens = this.oSmartMultiInput._oHBox.getItems(),
					iHiddenTokensCount = this.oSmartMultiInput.getTokens().length - aTokens.length,
					oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getText(),
					oSecondLastCharacter = oLastText.charAt(oLastText.length - 2),
					oLastTokenText = this.oSmartMultiInput.getTokens()[this.oSmartMultiInput.getTokens().length - 1].getText();
				oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getTooltip();

				assert.ok(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is visible");
				assert.equal(oSecondLastCharacter, this.oSmartMultiInput.getTextSeparator(), "Separator is present before the more link");
				assert.equal(iHiddenTokensCount, parseInt(this.oSmartMultiInput._oMoreLink.getText()), "Count of the invisible tokens (" + iHiddenTokensCount + ") in more link is correct");

				//Check if the last visible text is from the last added token
				assert.equal(oLastText, oLastTokenText, "Last visible Text is from the last added token");

				//Trigger More Link Press
				this.oSmartMultiInput._oMoreLink.firePress();
				assert.ok(this.oSmartMultiInput._handleNMoreIndicatorPress.calledOnce, "_handleNMoreIndicatorPress should be called once");
				assert.ok(this.oSmartMultiInput._getReadTokenListPopover().getVisible(), "Popover is visible when more link is clicked");
				assert.equal(this.oSmartMultiInput._getReadTokenList().getItems().length, 14, "Count of the tokens in the popover list is correct");

			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("New Display Mode: Single Long Text addition", function (assert) {

		var fnDone = assert.async(),
		oFlexContainer = new sap.m.FlexBox({
			width: "100px",
			items: [
				this.oSmartMultiInput
			]
		});

		oFlexContainer.placeAt("content");
		sap.ui.getCore().applyChanges();

		this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "S2",
                text: "This is a Long Text"
			})
		);

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for hbox to render its items
			setTimeout(function () {
				assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
				//Multiple Token tests
				var aTokens = this.oSmartMultiInput._oHBox.getItems();

				assert.notOk(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is invisible");
				assert.ok(aTokens[0].getVisible(), "Token is visible even on overflow");

			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("New Display Mode: Two Long Texts added", function (assert) {

		var fnDone = assert.async(),
		oFlexContainer = new sap.m.FlexBox({
			width: "110px",
			items: [
				this.oSmartMultiInput
			]
		});

		oFlexContainer.placeAt("content");
		sap.ui.getCore().applyChanges();

		this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "S1",
                text: "This is a really long Text"
			})
		);

		this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "S2",
                text: "This is a really long Text"
			})
		);

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for hbox to render its items
			setTimeout(function () {
				assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
				//Two long Token tests
				var aVisibleTokens = this.oSmartMultiInput._oHBox.getItems().filter(function(oToken) {
					return oToken.getVisible();
				}),
					iHiddenTokensCount = this.oSmartMultiInput.getTokens().length - aVisibleTokens.length;

				assert.equal(aVisibleTokens.length, 0, "All tokens are invisible");
				assert.ok(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is visible");
				assert.equal(iHiddenTokensCount, parseInt(this.oSmartMultiInput._oMoreLink.getText()), "Count of the invisible tokens (" + iHiddenTokensCount + ")  in more link is correct");

			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
	});

	QUnit.test("New Display Mode: Long Text Added at the end", function (assert) {

		var fnDone = assert.async(),
		oFlexContainer = new sap.m.FlexBox({
			width: "190px",
			items: [
				this.oSmartMultiInput
			]
		});

		oFlexContainer.placeAt("content");
		sap.ui.getCore().applyChanges();

        this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "S1",
                text: "Short Text"
			})
		);

		this.oSmartMultiInput._oMultiInput.addToken(
            new Token({
                key: "S2",
                text: "Long Text Example"
			})
		);

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function (oEvent) {

			assert.ok(this.oSmartMultiInput._oHBox, "HBox exists");

			// wait for hbox to render its items
			setTimeout(function () {
				assert.notOk(this.oSmartMultiInput._oHBox.getBinding("items"), "HBox is not bound");
				//Multiple Token tests
				var aTokens = this.oSmartMultiInput._oHBox.getItems(),
					iHiddenTokensCount = this.oSmartMultiInput.getTokens().length - aTokens.length,
					oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getText(),
					oLastTokenText = this.oSmartMultiInput.getTokens()[this.oSmartMultiInput.getTokens().length - 1].getText();
				oLastText = this.oSmartMultiInput._oHBox.getItems()[aTokens.length - 1].getTooltip();

				assert.ok(this.oSmartMultiInput._oMoreLink.getVisible(), "More link is visible");
				assert.equal(iHiddenTokensCount, parseInt(this.oSmartMultiInput._oMoreLink.getText()), "Count of the invisible tokens (" + iHiddenTokensCount + ") in more link is correct");

				//Check if the last visible text is from the last added token
				assert.equal(oLastText, oLastTokenText, "Last visible Text is from the last added token");

			}.bind(this), 0);

			fnDone();
		}.bind(this));

		this.oSmartMultiInput.setEditable(false);
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

	QUnit.test("supportRanges with value list annotion as well", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportRanges: true
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.ok(oSpy.returnValues[0].params.valuehelp.supportRanges, "supportRanges in value help should be set");
			fnDone();
		});
	});

	QUnit.test("supportMultiSelect true", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportMultiSelect: true
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.ok(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
			fnDone();
		});

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();
	});

	QUnit.test("supportMultiSelect false", function(assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput = new SmartMultiInput({
			entitySet: "Categories",
			value: {
				path: "CategoryId"
			},
			supportMultiSelect: false
		});

		var oSpy = sinon.spy(this.oSmartMultiInput, "_createMultiInput");

		this.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
			assert.notOk(oSpy.returnValues[0].params.valuehelp.supportMultiSelect, "supportMultiSelect in value help should be set");
			fnDone();
		});

		this.oSmartMultiInput.setModel(this.oModel);

		this.oSmartMultiInput.placeAt("content");
		sap.ui.getCore().applyChanges();

	});
});
