/* global QUnit, sinon, tinymce */
sap.ui.define([
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/core/InvisibleText"
], function(RichTextEditor, Dialog, Button, Device, Core, InvisibleText) {
	"use strict";

	QUnit.config.testTimeout = 6000;

	function setLanguage(sLang) {
		Core.getConfiguration().setLanguage(sLang);
		Core.applyChanges();
	}

	var fnTestInitialCheck = function(assert) {
		var done = assert.async(3);
		assert.ok(!!sap.ui.richtexteditor.RichTextEditor, "RichTextEditor class should exist");
		done();
		assert.ok(window.tinymce === undefined, "tinymce may not be definied initially.");
		done();
		assert.ok(window.tinyMCE === undefined, "tinyMCE may not be definied initially.");
		done();

	};

	var fnTestControlLifecycle = function(assert) {
		var done = assert.async(9);

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});
		oRichTextEditor1.placeAt("content");

		Core.applyChanges();

		assert.ok(!!sap.ui.richtexteditor.RichTextEditorRenderer, "RichTextEditorRenderer class should exist");
		done();

		oRichTextEditor1.attachReady(function() {
			assert.ok(true, "This point should be reached, which means the editor is rendered and initialized correctly.");
			done();

			assert.ok(!!window.tinymce, "tinymce global must be definied");
			done();
			assert.ok(!!window.tinyMCE, "tinyMCE global must be definied");
			done();

			assert.equal(tinymce.editors.length, 1, "There must be one tinymce editor now");
			done();
			assert.ok(!!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must be definied");
			done();
			assert.equal(tinymce.editors["myRTE1-textarea"].id, "myRTE1-textarea", "tinymce id must be 'myRTE1-textarea'");

			oRichTextEditor1.destroy();
			done();

			assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
			done();
			assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
			done();
		});
	};

	var fnTestControlSize = function(assert) {
		var done = assert.async(6);

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});

		Core.getUIArea("content").removeAllContent();
		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			assert.ok(!!jQuery.sap.domById("myRTE1-textarea_ifr"), "Editor Iframe exists");
			done();

			assert.equal(tinymce.editors.length, 1, "There must be again one tinymce editor now");
			done();
			assert.equal(jQuery.sap.domById("myRTE1").offsetWidth, 400, "Editor width should be 400px");
			done();
			assert.equal(jQuery.sap.domById("myRTE1").offsetHeight, 300, "Editor height should be 300px");

			oRichTextEditor1.destroy();
			done();

			assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
			done();
			assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
			done();
		});
	};

	var fnTestNativeApi = function(assert) {
		var done = assert.async(7);

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});
		//Cleanup UIArea because placeAt only adds new control to UIArea
		Core.getUIArea("content").removeAllContent();
		oRichTextEditor1.placeAt("content");

		setTimeout(function() {
			oRichTextEditor1.attachReady(function() {
				assert.equal(tinymce.editors.length, 1, "There must be again one tinymce editor now");
				done();
				var oEditor = oRichTextEditor1.getNativeApi();
				assert.equal(oEditor.id, "myRTE1-textarea", "nativeApi id must be 'myRTE1-textarea'");
				done();
				assert.ok(oEditor === tinymce.editors[0], "nativeApi must equal the existing editor"); // equals and deepEquals gives a "too much recursion" error
				done();

				assert.ok(!!oEditor.getContainer(), "Editor container is rendered");
				done();
				assert.ok(!!oEditor.getBody(), "Editor body is rendered");


				oRichTextEditor1.destroy();
				done();

				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			});
		}, 0);
	};

	var fnTestInitialValue = function(assert) {
		var done = assert.async(6);

		var myValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px",
			value: myValue
		});
		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			assert.equal(oRichTextEditor1.getValue().toUpperCase(), myValue, "Editor should have the correct value");
			done();

			var iframe = jQuery.sap.domById("myRTE1-textarea_ifr");
			var iframeHTML = iframe.contentWindow.document.body.innerHTML;
			var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
			var contentHTML = oRichTextEditor1.getNativeApi().getContent();

			// check the actual content in two ways
			assert.equal(iframeHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
			done();
			assert.equal(instHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
			done();
			assert.equal(contentHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");

			oRichTextEditor1.destroy();
			done();

			assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
			done();
			assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
			done();
		});
	};

	var fnTestSetValue = function(assert) {
		var done = assert.async(6);

		var myValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});
		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			oRichTextEditor1.setValue(myValue);
			assert.equal(oRichTextEditor1.getValue().toUpperCase(), myValue, "Editor should immediately have the correct value");
			done();

			setTimeout(function() {
				var iframe = jQuery.sap.domById("myRTE1-textarea_ifr");
				var iframeHTML = iframe.contentWindow.document.body.innerHTML;
				var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
				var contentHTML = oRichTextEditor1.getNativeApi().getContent();

				// check the actual content in two ways
				assert.equal(iframeHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
				done();
				assert.equal(instHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");
				done();
				assert.equal(contentHTML.toUpperCase(), myValue, "Editor iframe should have the correct value");

				oRichTextEditor1.destroy();
				done();

				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	};

	var fnTestSanitization = function(assert) {
		var done = assert.async(6);

		var myValue = "<p><span>Hello <strong>World!</strong></span><script>alert('XSS')<\/script></p>".toUpperCase();
		var mySanitizedValue = "<p>Hello <strong>World!</strong></p>".toUpperCase();
		var mySanitizedImmediateValue = "<p><span>Hello <strong>World!</strong></span></p>".toUpperCase();

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});
		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			oRichTextEditor1.setValue(myValue);
			assert.equal(oRichTextEditor1.getValue().toUpperCase(), mySanitizedImmediateValue, "Editor should immediately have the correct (but unoptimized) value");
			done();
			setTimeout(function() {
				var iframe = jQuery.sap.domById("myRTE1-textarea_ifr");
				var iframeHTML = iframe.contentWindow.document.body.innerHTML;
				var instHTML = oRichTextEditor1.getNativeApi().getBody().innerHTML;
				var contentHTML = oRichTextEditor1.getNativeApi().getContent();

				// check the actual content in two ways
				assert.equal(iframeHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");
				done();
				assert.equal(instHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");
				done();
				assert.equal(contentHTML.toUpperCase(), mySanitizedValue, "Editor iframe should have the correct value");

				oRichTextEditor1.destroy();
				done();

				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	};

	var fnTestSanitizationOnTinyMCEChange = function(assert) {
		var oFireChangeSpy;
		var done = assert.async();

		var myValue = '<p style="text-align: left;">No semicolon should exist in the style attribute after sanitizing</p>';
		var mySanitizedValue = '<p style="text-align: left">No semicolon should exist in the style attribute after sanitizing</p>';

		var oRichTextEditor = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});
		oRichTextEditor.placeAt("content");

		oRichTextEditor.attachReady(function() {
			oFireChangeSpy = sinon.spy(oRichTextEditor, "fireChange");
			oRichTextEditor.setValue(myValue);
			assert.equal(oRichTextEditor.getValue(), mySanitizedValue, "Rich Text Editor should have the sanitized value");

			oRichTextEditor.onTinyMCEChange(oRichTextEditor._oEditor);
			assert.equal(oFireChangeSpy.notCalled, true, "No change event is fired - The RTE content value is the same as the one returned from the TinyMCE after sanitization");

			oRichTextEditor.setSanitizeValue(false);
			oRichTextEditor.setValue(myValue);
			assert.equal(oRichTextEditor.getValue(), myValue, "Rich Text Editor should have the unsanitized value");

			oRichTextEditor.onTinyMCEChange(oRichTextEditor._oEditor);
			assert.equal(oRichTextEditor.getValue(), myValue, "Rich Text Editor value should still be the unsanitized");

			oRichTextEditor.destroy();
			done();
		});
	};

	var fnTestLinkTargets = function(assert) {
		var done = assert.async(4);

		var myValue = "<p><a id='l1' href='http://www.sap.com'>link1</a><a id='l2' target='_top' href='http://www.sap.com'>link2</a></p>";

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px",
			editable: false
		});
		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			oRichTextEditor1.setValue(myValue);

			setTimeout(function() {
				var oDoc = oRichTextEditor1.getNativeApi().getDoc();

				// check the actual content in two ways
				assert.equal(oDoc.getElementById("l1").target, "_blank", "Target should be blank");
				done();
				assert.equal(oDoc.getElementById("l2").target, "_blank", "Target should be blank");

				oRichTextEditor1.destroy();
				done();

				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	};

	var fnTestToolbarGroups = function(assert) {
		var done = assert.async(5),
			oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px"
		});

		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			assert.equal(jQuery(".mce-btn > button > .mce-i-alignjustify").length, 1, "Text justify button should be there");
			done();
			assert.equal(jQuery(".mce-btn > button > .mce-i-emoticons").length, 0, "The smiley button should not be there");
			done();
			oRichTextEditor1.setShowGroupInsert(true);

			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor1._pTinyMCEInitialized.then(function() {
						assert.equal(jQuery(".mce-btn > button > .mce-i-emoticons").length, 1, "The smiley button should now be there");

						oRichTextEditor1.destroy();
						done();

						assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
						done();
						assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
						done();
					});
				}, 0);
			}, 0);
		});
	};

	var fnTestPluginsNonDefault = function(assert) {
		var done = assert.async(9);

		var oRichTextEditor1 = new RichTextEditor("myRTE1", {
			width: "400px",
			height: "300px",
			useLegacyTheme: false
		});

		oRichTextEditor1.addPlugin({
			name: "searchreplace"
		});

		oRichTextEditor1.addPlugin({
			name: "contextmenu"
		});

		oRichTextEditor1.addPlugin("preview");
		oRichTextEditor1.addPlugin("media");
		oRichTextEditor1.addButtonGroup("media");
		oRichTextEditor1.addButtonGroup("table");

		oRichTextEditor1.placeAt("content");

		oRichTextEditor1.attachReady(function() {
			// Check for loaded plugins
			assert.ok(tinymce.PluginManager.lookup.media, "Media plugin loaded");
			done();
			assert.ok(tinymce.PluginManager.lookup.table, "Table plugin loaded");
			done();
			assert.equal(jQuery("#myRTE1").find(".mce-btn > button > .mce-i-media").length, 1, "Media button shown");
			done();
			assert.equal(jQuery("#myRTE1").find(".mce-btn > button > .mce-i-table").length, 1, "Table button shown");
			done();
			assert.ok(tinymce.PluginManager.lookup.contextmenu, "Context menu plugin loaded");
			done();
			assert.ok(tinymce.PluginManager.lookup.searchreplace !== undefined, "Search/Replace plugin loaded");
			done();
			assert.ok(tinymce.PluginManager.lookup.preview, "Preview plugin loaded");

			setTimeout(function() {
				oRichTextEditor1.destroy();
				done();

				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	};


	var fnTestTinyMCEPopupsForEditorInPopup = function(assert) {
		var done = assert.async();

		var oRichTextEditor2 = new RichTextEditor("myRTE2", {
			width: "100%",
			height: "99%"
		});
		oRichTextEditor2.addPlugin("media");
		oRichTextEditor2.addButtonGroup("media");
		Core.applyChanges();

		var oDialog = new Dialog("myDialog", {
			content: [oRichTextEditor2]
		});
		oDialog.open();
		oDialog.attachAfterOpen(function() {

			setTimeout(function() {
				var oButton = jQuery(".mce-ico.mce-i-media").parent();
				oButton.trigger("click");
				setTimeout(function() {

					var oTextField = jQuery(".mce-container.mce-panel.mce-floatpanel.mce-window .mce-textbox")[0];
					oTextField.focus();
					setTimeout(function() {
						assert.equal(document.activeElement, oTextField, "The Textfield is focussed");

						oDialog.close();
						oDialog.attachAfterClose(function() {
							oDialog.destroy();
							done();
						});
					},200); // Allow time for focus
				}, 500); // Allow time for opening TinyMCE Popup
			}, 1000); // Allow time for loading/rendering TinyMCE
		});
	};

	QUnit.test("Initial Check", fnTestInitialCheck);
	QUnit.test("Control Creation and Destruction", fnTestControlLifecycle.bind(this));
	QUnit.test("Control Creation and Size", fnTestControlSize.bind(this));
	QUnit.test("getNativeApi", fnTestNativeApi);
	QUnit.test("Check InitialValue", fnTestInitialValue);
	QUnit.test("setValue", fnTestSetValue);

	QUnit.test("setValue with comments", function (assert) {
		var done = assert.async(6);

		var myValue = '<!-- my comment--><p>My text</p>';
		var oRichTextEditor = new RichTextEditor("myRTE", {
			value: myValue
		});

		var initSpy = sinon.spy(oRichTextEditor, "_initializeTinyMCE");
		var configCbSpy = sinon.spy(oRichTextEditor, "_createConfigTinyMCE");
		oRichTextEditor.placeAt("content");


		oRichTextEditor.attachReady(function () {
			//Assert
			assert.ok(initSpy.callCount, "_initializeTinyMCE should have been called.");
			done();
			assert.ok(!initSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");
			done();
			assert.ok(configCbSpy.callCount, "_initializeTinyMCE should have been called.");
			done();
			assert.ok(!configCbSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");


			setTimeout(function () {
				// Act
				oRichTextEditor.destroy();
				done();

				// Assert
				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	});
	QUnit.test("setValue with HTML", function (assert) {
		var done = assert.async(7);

		var myValue = '<!DOCTYPE>';
		var oRichTextEditor = new RichTextEditor("myRTE", {
			sanitizeValue: false,
			value: myValue
		});

		var initSpy = sinon.spy(oRichTextEditor, "_initializeTinyMCE");
		var configCbSpy = sinon.spy(oRichTextEditor, "_createConfigTinyMCE");
		oRichTextEditor.placeAt("content");


		oRichTextEditor.attachReady(function () {
			//Assert
			var iZeroWidthSpaceIndex = oRichTextEditor._textAreaDom.value.toString().indexOf("&#8203;");

			assert.strictEqual(iZeroWidthSpaceIndex, -1, "No zero width space is added.");
			done();
			assert.ok(initSpy.callCount, "_initializeTinyMCE should have been called.");
			done();
			assert.ok(!initSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");
			done();

			assert.ok(configCbSpy.callCount, "_initializeTinyMCE should have been called.");
			done();
			assert.ok(!configCbSpy.threw(), "_initializeTinyMCE should not have thrown exceptions");

			setTimeout(function () {
				// Act
				oRichTextEditor.destroy();
				done();

				// Assert
				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	});

	QUnit.test("setValue sanitization escaping", function (assert) {
		var done = assert.async(3),
			oRichTextEditor = new RichTextEditor("myRTE", {
				value: null
			});

		oRichTextEditor.placeAt("content");


		oRichTextEditor.attachReady(function () {
			assert.equal(oRichTextEditor.getValue(), "", "RTE's content should be empty");

			setTimeout(function () {
				// Act
				oRichTextEditor.destroy();
				done();

				// Assert
				assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
				done();
				assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
				done();
			}, 0);
		});
	});
	QUnit.test("setValue sanitization", fnTestSanitization);
	QUnit.test("setValue sanitization", fnTestSanitizationOnTinyMCEChange);
	QUnit.test("readonly link target modification", fnTestLinkTargets);
	QUnit.test("Check Toolbar groups", fnTestToolbarGroups);
	QUnit.test("Non-default Plugins", fnTestPluginsNonDefault);
	QUnit.test("Focus in Popups in Popups", fnTestTinyMCEPopupsForEditorInPopup);

	QUnit.test("Enable 'dirty' event usage", function (assert) {
		var done = assert.async(),
		oRichTextEditor = new RichTextEditor("dirty-case-rte", {
			editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
			customToolbar: true,
			value: null
		});

		oRichTextEditor.placeAt("content");

		oRichTextEditor.attachReady(function () {
			assert.equal(oRichTextEditor.getNativeApi().isDirty(), false, "RTE's dirty state should be clean if no updates are made after initialization");

			// Clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.module("Languages");

	var aLanguages = [
		"en","af_ZA","ar_SA","ar","az","be","bg_BG","bn_BD","bs","ca","cs_CZ","cs","cy","da","de_AT","de","dv",
		"el","en_CA","en_GB","es_MX","es","et","eu","fa_IR","fa","fi","fo","fr_FR","ga","gd","gl","he_IL","hi_IN",
		"hr","hu_HU","hy","id","is_IS","it","ja","ka_GE","kab","kk","km_KH","ko_KR","ku_IQ","lb","lt",
		"lv","ml_IN","mn_MN","nb_NO","nl","pl","pt_BR","pt_PT","ro","ru","si_LK","sk","sl_SI","sr",
		"sv_SE","ta_IN","ta","tg","th_TH","tr_TR","tt","ug","uk_UA","uk","uz","vi_VN","zh_CN","zh_TW"
	];

	var fnLanguagesCheck = function(sLang, sLangResult, assert) {
		var done = assert.async();

		setLanguage(sLang);

		var oRichTextEditor = new RichTextEditor("myRTELanguages", {
			width: "400px",
			height: "300px"
		});
		var oSpy = sinon.spy(oRichTextEditor, "_getLanguageTinyMCE");
		oRichTextEditor.placeAt("content");

		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			assert.strictEqual(oSpy.returnValues[0], sLangResult, sLangResult + " language should be set.");
			assert.strictEqual(oRichTextEditor.getNativeApi().settings.language, sLangResult, sLangResult + "The TinyMCE language should be set.");

			oRichTextEditor.destroy();
			done();
		});
	};

	for (var i = 0; i < aLanguages.length; ++i) {
		var sLang = aLanguages[i];
		QUnit.test("Language - " + sLang, fnLanguagesCheck.bind(this, sLang, sLang));
	}

	var aDefaultRegionLanguages = ["ku","ml","sl","tr","vi"];
	var aDefaultRegionLanguagesResult = ["ku_IQ","ml_IN","sl_SI","tr_TR","vi_VN"];

	for (var o = 0; o < aDefaultRegionLanguages.length; ++o) {
		var sDefaultLang = aDefaultRegionLanguages[o];
		var sDefaultLangResult = aDefaultRegionLanguagesResult[o];
		QUnit.test("Language - " + sDefaultLang, fnLanguagesCheck.bind(this, sDefaultLang, sDefaultLangResult));
	}

	QUnit.module("Improve Coverage",

		{
			beforeEach: function() {
				this.oRichTextEditor = new RichTextEditor("myRTE3", {
					width: "100%",
					height: "100%",
					tooltip: "Tooltip1"
				});
			},
			afterEach: function() {
				this.oRichTextEditor.destroy();
			}
		}
	);

	function containsNamedObject(aObjects, sObjectName) {
		for (var i = 0, iLen = aObjects.length; i < iLen; ++i) {
			if (aObjects[i].name === sObjectName) {
				return true;
			}
		}
		return false;
	}

	QUnit.test("Editor initialization", function(assert) {
		var done = assert.async(9),
		iReadyCalled = 0,
		iBeforeInitCalled = 0,
		iChangeCalled = 0;

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();

		var oRichTextEditor = new RichTextEditor({
			beforeEditorInit: function () {
				iBeforeInitCalled++;
			},
			ready: function () {
				jQuery.sap.delayedCall(200, this, function () {
					assert.ok(iBeforeInitCalled === 1, "One init events has been fired");
					done();
					assert.ok(iReadyCalled === 1, "One ready events has been fired");
					done();
					assert.ok(iChangeCalled === 0, "No change events have been fired");

					oRichTextEditor.destroy();
					done();
				});

				iReadyCalled++;
			},
			change: function () {
				iChangeCalled++;
			}
		});
		oRichTextEditor.placeAt("content");

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();
	});

	QUnit.test("Plugins", function(assert) {
		var done = assert.async(15),
		iReadyCalled = 0,
		iBeforeInitCalled = 0,
		iChangeCalled = 0;

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();

		var oRichTextEditor = new RichTextEditor({
			beforeEditorInit : function() {
				iBeforeInitCalled++;
			},
			ready : function() {
				jQuery.sap.delayedCall(200, this, function() {
					assert.equal(iBeforeInitCalled, 1, "One init events has been fired");
					done();
					assert.equal(iReadyCalled, 1, "One ready events has been fired");
					done();
					assert.equal(iChangeCalled, 0, "No change events have been fired");

					oRichTextEditor.destroy();
					done();
				});

				iReadyCalled++;
			},
			change : function() {
				iChangeCalled++;
			}
		});

		var aAddedPlugins = [ "media", "autolink", "fullscreen", "preview" ];
		var aRemovedPlugins = [ "media", "preview" ];

		for (var i = 0, iLen = aAddedPlugins.length; i < iLen; ++i) {
			oRichTextEditor.addPlugin(aAddedPlugins[i]);
		}

		var aPlugins = oRichTextEditor.getPlugins();
		for (var i = 0, iLen = aAddedPlugins.length; i < iLen; ++i) {
			assert.ok(
				containsNamedObject(aPlugins, aAddedPlugins[i]),
				"Plugin was correctly added: " + aAddedPlugins[i]
			);
			done();
		}

		for (var i = 0, iLen = aRemovedPlugins.length; i < iLen; ++i) {
			oRichTextEditor.removePlugin(aRemovedPlugins[i]);
		}

		var aPlugins = oRichTextEditor.getPlugins();
		for (var i = 0, iLen = aRemovedPlugins.length; i < iLen; ++i) {
			assert.ok(
				!containsNamedObject(aPlugins, aRemovedPlugins[i]),
				"Plugin was correctly removed: " + aRemovedPlugins[i]
			);
			done();
		}

		oRichTextEditor.placeAt("content");

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();
	});

	QUnit.test("Plugins init", function(assert) {
		var oRichTextEditor = new RichTextEditor({showGroupLink: true});

		assert.strictEqual(oRichTextEditor.getPlugins().length, 11, "Plugins should have been initialized");

		oRichTextEditor.destroy();
		oRichTextEditor = null;
	});


	QUnit.test("Custom plugins init", function(assert) {
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				customToolbar: true,
				plugins: [{
					name: "fullscreen"
				}],
				ready : function() {
					jQuery.sap.delayedCall(500, this, function() {

						assert.strictEqual(oRichTextEditor.getPlugins().length, 2, "Plugins should have been initialized correctly");

						oRichTextEditor.destroy();
						oRichTextEditor = null;
						done();
					});
				}
			}).placeAt("content");
	});

	QUnit.test("Button Groups", function(assert) {
		var done = assert.async(33),
		iReadyCalled = 0,
		iBeforeInitCalled = 0,
		iChangeCalled = 0;

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();

		var oRichTextEditor = new RichTextEditor({
			beforeEditorInit: function () {
				iBeforeInitCalled++;
			},
			ready: function () {
				jQuery.sap.delayedCall(200, this, function () {
					assert.ok(iBeforeInitCalled === 1, "One init events has been fired");
					done();
					assert.ok(iReadyCalled === 1, "One ready events has been fired");
					done();
					assert.ok(iChangeCalled === 0, "No change events have been fired");

					oRichTextEditor.destroy();
					done();
				});

				iReadyCalled++;
			},
			change: function () {
				iChangeCalled++;
			}
		});

		var aButtons = [ {
			name     : "font-style",
			visible  : true,
			row      : 0,
			priority : 10,
			buttons  : [
				"bold", "italic", "underline", "strikethrough"
			]
		}, {
			// Text Align group
			name     : "text-align",
			visible  : true,
			row      : 0,
			priority : 20,
			buttons  : [
				"justifyleft", "justifycenter", "justifyright", "justifyfull"
			]
		}, {
			name     : "font",
			visible  : false,
			row      : 0,
			priority : 30,
			buttons  : [
				"fontselect", "fontsizeselect", "forecolor", "backcolor"
			]
		}, {
			name     : "formatselect",
			visible  : true,
			row      : 0,
			priority : 30,
			buttons  : [
				"paragraph","h1", "h2", "h3", "h4", "h5", "h6", "pre"
			]
		}, {
			name     : "clipboard",
			visible  : true,
			row      : 1,
			priority : 10,
			buttons  : [
				"cut", "copy", "paste"
			]
		}, {
			name     : "structure",
			visible  : true,
			row      : 1,
			priority : 20,
			buttons  : [
				"bullist", "numlist", "outdent", "indent"
			]
		}];


		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			oRichTextEditor.removeButtonGroup(aButtons[i].name);
		}

		var aButtonGroups = oRichTextEditor.getButtonGroups();
		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			assert.ok(
				!containsNamedObject(aButtonGroups, aButtons[i].name),
				"Button Group was correctly removed: " + aButtons[i]
			);
			done();
		}

		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			oRichTextEditor.addButtonGroup(aButtons[i]);
		}

		var aButtonGroups = oRichTextEditor.getButtonGroups();
		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			assert.ok(
				containsNamedObject(aButtonGroups, aButtons[i].name),
				"Button Group was correctly added: " + aButtons[i]
			);
			done();
		}

		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			oRichTextEditor.removeButtonGroup(aButtons[i].name);
		}

		aButtonGroups = oRichTextEditor.getButtonGroups();
		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			assert.ok(
					!containsNamedObject(aButtonGroups, aButtons[i].name),
					"Button Group was removed: " + aButtons[i]
			);
			done();
		}

		oRichTextEditor.setButtonGroups(aButtons);

		aButtonGroups = oRichTextEditor.getButtonGroups();
		for (var i = 0, iLen = aButtons.length; i < iLen; ++i) {
			assert.ok(
				containsNamedObject(aButtonGroups, aButtons[i].name),
				"Button Group was added: " + aButtons[i].name
			);
			done();
		}

		oRichTextEditor.placeAt("content");

		assert.ok(iBeforeInitCalled === 0, "No init events have been fired");
		done();
		assert.ok(iReadyCalled === 0, "No ready events have been fired");
		done();
		assert.ok(iChangeCalled === 0, "No change events have been fired");
		done();
	});

	QUnit.test("Directionality = RTL", function(assert) {
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor("rtl-rte", {
			textDirection: sap.ui.core.TextDirection.RTL,
			customToolbar: true,
			value: "Lorem Ipsum",
			ready: function() {
				jQuery.sap.delayedCall(200, this, function() {
					assert.ok(oRichTextEditor.getNativeApi().settings.directionality === "rtl", "Text Direction is applied correctly");
					assert.strictEqual(document.getElementById('rtl-rte-textarea_ifr').contentWindow.document.querySelector(".mce-content-body p").getAttribute("style"), "text-align: right;", "Initial RTL text is correctly justified to the right by default");
					oRichTextEditor.destroy();
					done();
				});
			}
		});
		oRichTextEditor.placeAt("content");
	});

	QUnit.test("Directionality = LTR", function(assert) {
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			textDirection: sap.ui.core.TextDirection.LTR,
			ready: function() {
				jQuery.sap.delayedCall(200, this, function() {
					assert.ok(oRichTextEditor.getNativeApi().settings.directionality === "ltr", "Text Direction is applied correctly");
					oRichTextEditor.destroy();
					done();
				});
			}
		});
		oRichTextEditor.placeAt("content");
	});

	QUnit.test("Directionality (default value applied)", function(assert) {
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor({
			ready: function() {
				jQuery.sap.delayedCall(200, this, function() {
					assert.ok(oRichTextEditor.getNativeApi().settings.directionality === "ltr", "Text Direction is applied correctly");
					oRichTextEditor.destroy();
					done();
				});
			}
		});
		oRichTextEditor.placeAt("content");
	});

	QUnit.test("SetValue 2 times", function(assert) {
		var done = assert.async();
		var spySetValue = sinon.spy(this.oRichTextEditor, "setValueTinyMCE");
		this.oRichTextEditor.setValue("TEXT");
		this.oRichTextEditor.setValue("TEXT");
		assert.equal(spySetValue.callCount, 1, "Same value only set once.");
		done();
	});

	QUnit.test("Wrapping/Required setter", function(assert) {
		var done = assert.async();
		var spyReinitialize = sinon.spy(this.oRichTextEditor, "reinitializeTinyMCE");
		this.oRichTextEditor.setWrapping(false);
		this.oRichTextEditor.setRequired(true);
		setTimeout(function() {
			assert.equal(spyReinitialize.callCount, 1, "Editor is only reinitialized once.");
			done();
		}, 0);
	});

	QUnit.test("Toolbar groups setter", function(assert) {
		var done = assert.async(50);
		var checkForVisibility = function(sAriaLabel, bVisible) {
			assert.equal(document.querySelectorAll("#myRTE3 .mce-toolbar .mce-btn[aria-label='" + sAriaLabel + "']").length, bVisible ? 1 : 0, sAriaLabel + " visible");
			done();
		};

		this.oRichTextEditor.placeAt("content");
		var aAriaLabels = ['Font Family', 'Font Sizes', 'Text color', 'Background color', //  Group Font
			'Align left', 'Align right', 'Align center', 'Justify', // Group Text Align
			'Cut', 'Copy', 'Paste', //Group Clipboard
			'Bullet list', 'Numbered list', 'Decrease indent', 'Increase indent', // Group Structure
			'Undo', 'Redo', // Group Undo
			'Insert/edit image', 'Emoticons', // Group Insert
			'Insert/edit link', 'Remove link', // Group Link
			'Bold', 'Italic', 'Underline', 'Strikethrough' // Group Font Style
		];

		var fnShowGroups = function(bVisible) {
			this.oRichTextEditor.setShowGroupFontStyle(bVisible);
			this.oRichTextEditor.setShowGroupTextAlign(bVisible);
			this.oRichTextEditor.setShowGroupStructure(bVisible);
			this.oRichTextEditor.setShowGroupFont(bVisible);
			this.oRichTextEditor.setShowGroupClipboard(bVisible);
			this.oRichTextEditor.setShowGroupInsert(bVisible);
			this.oRichTextEditor.setShowGroupLink(bVisible);
			this.oRichTextEditor.setShowGroupUndo(bVisible);
		}.bind(this);

		this.oRichTextEditor.attachReady(function(oEvent) {
			for (var i = 0; i < aAriaLabels.length; i++) {
				checkForVisibility(aAriaLabels[i], true);
			}
			fnShowGroups(false);
			setTimeout(function() {
				setTimeout(function() {
					this.oRichTextEditor._pTinyMCEInitialized.then(function() {
						for (var i = 0; i < aAriaLabels.length; i++) {
							checkForVisibility(aAriaLabels[i], false);
						}
					});
				}.bind(this), 0);
			}.bind(this), 0);
		}.bind(this));
		fnShowGroups(true);
	});

	QUnit.test("ID with special characters", function(assert) {
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor(
			"test.test::--Test"
		);
		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.ok(true, "Text editor is initialized correctly");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.module("'customToolbar' property");

	QUnit.test("Lifecycle", function(assert) {
		// arrange
		var done = assert.async(9),
			oRichTextEditor1 = new RichTextEditor("myRTE1", {
				customToolbar: true,
				width: "400px",
				height: "300px"
			});

		oRichTextEditor1.placeAt("content");
		Core.applyChanges();

		// assert
		assert.ok(!!sap.ui.richtexteditor.RichTextEditorRenderer, "RichTextEditorRenderer class should exist");
		done();
		oRichTextEditor1.attachReady(function() {

			// assert
			assert.ok(true, "This point should be reached, which means the editor is rendered and initialized correctly.");
			done();
			assert.ok(!!window.tinymce, "tinymce global must be definied");
			done();
			assert.ok(!!window.tinyMCE, "tinyMCE global must be definied");
			done();
			assert.equal(tinymce.editors.length, 1, "There must be one tinymce editor now");
			done();
			assert.ok(!!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must be definied");
			done();
			assert.equal(tinymce.editors["myRTE1-textarea"].id, "myRTE1-textarea", "tinymce id must be 'myRTE1-textarea'");

			// destroy
			oRichTextEditor1.destroy();
			done();
			// assert
			assert.equal(tinymce.editors.length, 0, "There must be no tinymce editor now");
			done();
			assert.ok(!tinymce.editors["myRTE1-textarea"], "tinymce editor 'myRTE1-textarea' must not be definied after destruction");
			done();
		});
	});

	QUnit.test("customToolbar setter", function (assert) {
		var done = assert.async(4),
		Log = sap.ui.require('sap/base/Log');

		assert.ok(Log, "Log module should be loaded");
		done();

		var oRichTextEditor = new RichTextEditor({
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			}),
			oSetCustomToolbarSpy = sinon.spy(oRichTextEditor, "setCustomToolbar"),
			oLogSpy = sinon.spy(Log, "error");

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// act
				oRichTextEditor.setCustomToolbar(false);

				// assert
				assert.ok(oSetCustomToolbarSpy.calledOnce, "The setter function was called once");
				done();
				assert.ok(oLogSpy.calledOnce, "There was one error logged in the console");
				done();
				assert.ok(oRichTextEditor.getAggregation("_toolbarWrapper"), "The custom toolbar still exists");

				// destroy
				oRichTextEditor.destroy();
				done();
				oLogSpy.restore();
			});
		});
	});

	QUnit.test("SetCustomToolbar(true)", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE2", {
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.equal(document.querySelectorAll("#myRTE2 .mce-toolbar").length, 0, "There should not be a native TinyMCE toolbar");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("SetCustomToolbar(false)", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE4", {
				width: "100%",
				height: "300px",
				customToolbar: false,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			// assert
			assert.ok(document.querySelectorAll("#myRTE4 .mce-toolbar").length, "There should be a native TinyMCE toolbar");

			// destroy
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("SetCustomToolbar(false) after creating a RichTextEditor with a custom toolbar", function(assert) {
		// arrange
		var done = assert.async(2),
			oRichTextEditor = new RichTextEditor("myRTE5", {
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont : true,
				showGroupUndo : true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		// act
		oRichTextEditor.setCustomToolbar(false);
		oRichTextEditor.setShowGroupUndo(false);

		oRichTextEditor.attachReady(function(oEvent) {
			setTimeout(function(){
				// assert
				assert.equal(document.querySelectorAll("#myRTE5 .mce-toolbar").length, 0, "The toolbar should not be changed - no native toolbar shown");
				done();
				assert.equal(document.querySelectorAll("#myRTE5 .mce-toolbar .mce-btn[aria-label='Undo']").length, false, "The native undo button should not be visible");

				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("SetCustomToolbar(true) after creating a RichTextEditor with no custom toolbar", function(assert) {
		// arrange
		var done = assert.async(2),
				oRichTextEditor = new RichTextEditor("myRTE5_1", {
					width: "100%",
					height: "300px",
					customToolbar: false,
					showGroupFont : true,
					showGroupUndo : true
				});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function(oEvent) {
			oRichTextEditor._pTinyMCEInitialized.then(function() {
				// act
				oRichTextEditor.setCustomToolbar(true);

				// assert
				assert.strictEqual(document.querySelectorAll("#myRTE5_1 .sapMTB").length, 0, "The toolbar should not be changed - no native toolbar shown");
				done();
				assert.ok(document.querySelectorAll("#myRTE5_1 .mce-toolbar").length, "There should be a native TinyMCE toolbar");

				// destroy
				oRichTextEditor.destroy();
				done();
			});
		});
	});

	QUnit.test("Group Visibility", function(assert) {
		// arrange
		var done = assert.async(42),
			oRichTextEditor = new RichTextEditor("myRTE6", {
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true,
				showGroupUndo: true,
				showGroupLink: true,
				showGroupInsert: true
			});

		var aAriaLabels = ['FontFamily', 'FontSize', 'TextColor', 'BackgroundColor', //  Group Font
			'TextAlign', // Group Text Align
			'Cut', 'Copy', 'Paste', //Group Clipboard
			'UnorderedList', 'OrderedList', 'Indent', 'Outdent', // Group Structure
			'Undo', 'Redo', // Group Undo
			'Bold', 'Italic', 'Underline', 'Strikethrough', // Group Font Style
			'InsertLink', 'Unlink', // Group Link
			'InsertImage' // Group Insert
		];

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		var fnShowGroups = function(bVisible) {
			oRichTextEditor.setShowGroupFontStyle(bVisible);
			oRichTextEditor.setShowGroupTextAlign(bVisible);
			oRichTextEditor.setShowGroupStructure(bVisible);
			oRichTextEditor.setShowGroupFont(bVisible);
			oRichTextEditor.setShowGroupClipboard(bVisible);
			oRichTextEditor.setShowGroupUndo(bVisible);
			oRichTextEditor.setShowGroupLink(bVisible);
			oRichTextEditor.setShowGroupInsert(bVisible);
		};

		oRichTextEditor.attachReady(function(oEvent) {
			for (var i = 0; i < aAriaLabels.length; i++) {
				// assert
				assert.ok(Core.byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-" + aAriaLabels[i]).getVisible(), aAriaLabels[i] + " visible");
				done();
			}
			// act
			fnShowGroups(false);
			setTimeout(function() {
				setTimeout(function() {
					oRichTextEditor._pTinyMCEInitialized.then(function() {
						for (var i = 0; i < aAriaLabels.length; i++) {
							// assert
							assert.ok(!Core.byId(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getId() + "-" + aAriaLabels[i]).getVisible(), aAriaLabels[i] + " invisible");
							done();
						}
						// destroy
						oRichTextEditor.destroy();
					});
				}, 100);
			}, 100);
		});
	});

	QUnit.test("'editable: false' + 'customToolbar: true'", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE5", {
				editable: false,
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function(oEvent) {
			setTimeout(function(){
				// assert
				assert.notOk(oRichTextEditor._bHasNativeMobileSupport, "The mobile configuration should not be set.");
				assert.ok(!oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("'customToolbar: true' + setEditable(false)", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE5", {
				customToolbar: true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		// act
		oRichTextEditor.setEditable(false);

		oRichTextEditor.attachReady(function(oEvent) {
			setTimeout(function(){
				// assert
				assert.ok(!oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be disabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("'customToolbar: true' + TinyMCE mobile support enabled", function(assert) {
		// arrange
		var done = assert.async(),
			oSpy,
			oStub,
			oRichTextEditor = new RichTextEditor("myRTE5", {
				customToolbar: true
			}).attachBeforeEditorInit(function(oEvent){
				oSpy = sinon.spy(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar"), "removeStyleClass");
				oStub = sinon.stub(oRichTextEditor, "_tinyMCEDesktopDetected").returns(false);

				var oConfig = oEvent.getParameter('configuration');
				oConfig.mobile = {
					theme: "mobile",
					toolbar: ['undo', 'redo', 'bold', 'italic', 'underline', 'link', 'unlink', 'image', 'bullist', 'numlist', 'fontsizeselect', 'forecolor', 'styleselect', 'removeformat']
				};
			});


		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function() {
			setTimeout(function(){
				// assert
				assert.notOk(oSpy.calledOnce, "The custom toolbar should not be showed on non-desktop devices");
				assert.ok(oRichTextEditor._bHasNativeMobileSupport, "The mobile configuration should be detected.");

				// destroy
				oSpy.restore();
				oStub.restore();
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("'editable: false' + 'customToolbar: true' + setEditable(true)", function(assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor("myRTE5", {
				customToolbar: true,
				editable: false
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		// act
		oRichTextEditor.setEditable(true);

		oRichTextEditor.attachReady(function(oEvent) {
			setTimeout(function(){
				// assert
				assert.ok(oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getEnabled(), "The toolbar should be enabled.");

				// destroy
				oRichTextEditor.destroy();
				done();
			},0);
		});
	});

	QUnit.test("Link manipulation", function (assert) {
		// arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				showGroupLink: true,
				customToolbar: true,
				value: '<a href="www.test.com">Test</a> \n\n\n\n Some text here'
			}).placeAt("content");

		Core.applyChanges();


		oRichTextEditor.attachReady(function (oEvent) {
			setTimeout(function () {
				// Arrange
				var aLinks,
					oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper"),
					oTinyMce = oRichTextEditor.getNativeApi();

				// Act
				// Move the cursor to the end of the
				oTinyMce.selection.select(oTinyMce.getBody(), true);
				oTinyMce.selection.collapse(false);

				oToolbarWrapper._generateLinkHTML('www.test.com', null, null, "Another tEst");
				Core.applyChanges();

				aLinks = oTinyMce.dom.select('a[href="www.test.com"]');

				// Assert
				assert.strictEqual(aLinks.length, 2, "There should be 2 links in the content");
				assert.ok(aLinks[0].getAttribute("href") === aLinks[1].getAttribute("href"), "Href(s) should point to the same url");
				assert.ok(aLinks[0].innerText, 'Test', "First link's text should be 'Test'");
				assert.ok(aLinks[1].innerText, 'Another tEst', "Second link's text should be 'Another tEst'");

				// destroy
				oRichTextEditor.destroy();
				setTimeout(done);
			});
		});
	});

	QUnit.module("RTE Integrations");

	QUnit.test("RTE + Custom toolbar- XML view", function (assert) {
		//Setup
		var done = assert.async();
		var sXMLView = '<mvc:View xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc" xmlns:rte="sap.ui.richtexteditor"><rte:RichTextEditor id="myRTEXMLFragment"  customToolbar="true" /></mvc:View>';
		var oXMLContent = sap.ui.xmlview({viewContent: sXMLView});
		var oRichTextEditor = oXMLContent.byId("myRTEXMLFragment");
		var oRTESpy = this.spy(oRichTextEditor, "onAfterRenderingTinyMCE");

		oXMLContent.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function () {
			//Assert
			assert.ok(oRichTextEditor.$().parent().attr("data-sap-ui-preserve"), "RTE's direct parent has preserve flag.");
			assert.ok(!oRichTextEditor.$().attr("data-sap-ui-preserve"), "RTE's preserve flag is removed.");
			assert.ok(!oRTESpy.threw(), "There should not be any exceptions in 'onAfterRenderingTinyMCE'");

			//Cleanup
			oXMLContent.destroy();
			oXMLContent = null;
			done();
		});
	});

	QUnit.test("RTE available buttons in Custom Toolbar", function (assert) {
		//Setup
		var aButtons = [];
		var aCustomButtons = [];
		var done = assert.async();
		var oRTE = new RichTextEditor("customToolbarRTEAvailableButtons", {
			customToolbar: true,
			customButtons: [
				new Button({id: "CustBtn1"}),
				new Button({id: "CustBtn2"})
			]
		});
		var aAvailableButtons = [
			"Bold",
			"Italic",
			"Underline",
			"Strikethrough",
			"TextAlign",
			"FontFamily",
			"FontSize",
			"TextColor",
			"BackgroundColor",
			"UnorderedList",
			"OrderedList",
			"Outdent",
			"Indent",
			"InsertLink",
			"Unlink",
			"InsertImage",
			"Undo",
			"Redo",
			"Cut",
			"Copy",
			"Paste",
			"CustBtn1",
			"CustBtn2"
		];

		oRTE.placeAt("content");
		Core.applyChanges();

		oRTE.attachReady(function () {
			//Act
			aButtons = oRTE.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getContent().filter(function(oControl){
				return oControl.getMetadata().getElementName() !== "sap.ui.core.InvisibleText";
			});

			aCustomButtons = oRTE.getCustomButtons();
			aButtons.forEach(function (oButton, index) {
				assert.ok(oButton.getId().indexOf(aAvailableButtons[index]) > -1, "Position #" + index + ": " + aAvailableButtons[index]);
			});

			assert.strictEqual(aCustomButtons[0].getId(), "CustBtn1", "Custom Buttons should be retrievable also by the aggregation");
			assert.strictEqual(aCustomButtons[1].getId(), "CustBtn2", "Custom Buttons should be retrievable also by the aggregation");

			//Cleanup
			oRTE.destroy();
			done();
		});
	});

	/**
	 * There's a bug in TinyMCE + PowerPaste plugin: when RTE is in read-only mode and
	 * PowerPaste is enabled, it's still possible to Paste text into the editor.
	 * Remove this test and the filter in _createConfigTinyMCE when the bug gets fixed in TinyMCE
	 */
	QUnit.test("Disable PowerPaste plugin when RTE in read-only mode", function (assert) {
		//Setup
		var done = assert.async();
		var oRTE = new RichTextEditor({
			editable: false
		}).placeAt("content");

		Core.applyChanges();

		oRTE.attachReady(function () {
			var udef;

			//Assert
			assert.strictEqual(oRTE.getEditable(), false, "RTE is in read-only model");
			assert.ok(JSON.stringify(oRTE.getPlugins()).indexOf("powerpaste") > -1, "PowerPaste is available through the official API");
			assert.strictEqual(oRTE.getNativeApi().plugins["powerpaste"], udef, "PowerPaste is not loaded into TinyMCE");
			assert.ok(oRTE.getNativeApi().plugins["link"], "Link is loaded into TinyMCE");

			//Cleanup
			oRTE.destroy();
			done();
		});
	});

	QUnit.test("Add RTESplit Button", function (assert) {
		//arrange
		var done = assert.async(),
			oRichTextEditor = new RichTextEditor({
				width: "100%",
				height: "300px",
				customToolbar: true,
				showGroupFont: true
			});

		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oRichTextEditor.attachReady(function () {
			setTimeout(function () {
				var oToolbar = oRichTextEditor.getAggregation("_toolbarWrapper");

				//assert
				assert.ok(oToolbar._findGroupedControls("font")[2].getMetadata().getName() === "sap.ui.richtexteditor.RTESplitButton", "The font color button is in the custom toolbar");

				//destroy
				oRichTextEditor.destroy();
				done();
			}, 0);
		});
	});

	QUnit.module("CustomButtons aggregation overwritten methods", {
		before: function (assert) {
			var done = assert.async();
			this.oRichTextEditor = new RichTextEditor("customToolbarRTE", {
				customToolbar: true
			});
			this.oRichTextEditor.placeAt("content");
			Core.applyChanges();

			// Initialize fully the RTE and then continue with the tests
			this.oRichTextEditor.attachReady(done);
		},
		after: function () {
			this.oRichTextEditor.destroy();
			this.oRichTextEditor = null;
		},
		afterEach: function () {
			this.oRichTextEditor.destroyCustomButtons();
			Core.applyChanges();
		}
	});

	QUnit.test("addCustomButton", function (assert) {
		//Setup
		var oButton = new Button();
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarAdd");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);

		//Assert
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
		assert.ok(/Bold$/ig.test(this.oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getContent()[0].getId()), "RTE should proxy to the Toolbar");
	});

	QUnit.test("destroyCustomButtons", function (assert) {
		//Setup
		var oButton = new Button();
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarDestroy");
		var oButtonDestroySpy = this.spy(oButton, "destroy");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		Core.applyChanges();

		this.oRichTextEditor.destroyCustomButtons();
		Core.applyChanges();

		//Assert
		assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the ToolbarWrapper.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [], "RTE aggregation should be empty after that call.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [], "RTE's ToolbarWrapper aggregation should be also empty.");
		assert.ok(oButtonDestroySpy.called, "Control's destructor should have been invoked.");
		assert.ok(oButton._bIsBeingDestroyed, "Control should be destroyed.");
	});

	QUnit.test("getCustomButtons", function (assert) {
		//Setup
		var oButton = new Button(),
			oButton2 = new Button(),
			oButton3 = new Button();

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		this.oRichTextEditor.addCustomButton(oButton2);
		this.oRichTextEditor.addCustomButton(oButton3);

		//Assert
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton, oButton2, oButton3], "As RTE is proxy to the ToolbarWrapper, it should return only the controls set through RTE's setter");
	});

	QUnit.test("indexOfCustomButton", function (assert) {
		//Setup
		var index = null;
		var oButton = new Button();
		var oButton2 = new Button();
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarIndexOf");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		this.oRichTextEditor.addCustomButton(oButton2);


		// Assert
		index = this.oRichTextEditor.indexOfCustomButton(oButton);
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
		assert.strictEqual(index, 0, "RTE should return the proper index according to RTE, but not to the ToolbarWrapper");

		index = this.oRichTextEditor.indexOfCustomButton(oButton2);
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton2), "RTE should proxy to the Toolbar");
		assert.strictEqual(index, 1, "RTE should return the proper index according to RTE, but not to the ToolbarWrapper");
	});

	QUnit.test("insertCustomButton", function (assert) {
		//Setup
		var oButton = new Button();
		var oButton2 = new Button();
		var oButton3 = new Button();
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarInsert");

		//Act
		this.oRichTextEditor.insertCustomButton(oButton);
		this.oRichTextEditor.insertCustomButton(oButton2);
		this.oRichTextEditor.insertCustomButton(oButton3);
		Core.applyChanges();

		//Assert
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton), "RTE should proxy to the Toolbar");
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton2), "RTE should proxy to the Toolbar");
		assert.ok(oRTEAggregationSpy.calledWithExactly(oButton3), "RTE should proxy to the Toolbar");

		assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton), 0, "Button1 should be positioned properly");
		assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton2), 1, "Button2 should be positioned properly");
		assert.strictEqual(this.oRichTextEditor.indexOfCustomButton(oButton3), 2, "Button3 should be positioned properly");
	});

	QUnit.test("removeAllCustomButtons", function (assert) {
		//Setup
		var aRemovedCustomButtons = null;
		var oButton = new Button();
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarRemoveAll");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		aRemovedCustomButtons = this.oRichTextEditor.removeAllCustomButtons();
		Core.applyChanges();

		//Assert
		assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the Toolbar");
		assert.deepEqual(aRemovedCustomButtons, [oButton], "RTE should remove only the controls that were proxied.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [], "RTE aggregation should be empty after that call.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [], "RTE's ToolbarWrapper aggregation should be also empty.");

		//Clean
		oButton.destroy();
	});

	QUnit.test("removeCustomButton", function (assert) {
		//Setup
		var aRemovedCustomButtons = null;
		var oButton = new Button();
		var oButton2 = new Button();
		var oButton3 = new Button();
		var oButton4 = new Button({id: "removeMe"});
		var oToolbarWrapper = this.oRichTextEditor.getAggregation("_toolbarWrapper");
		var oRTEAggregationSpy = this.spy(oToolbarWrapper, "_proxyToolbarRemove");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		this.oRichTextEditor.addCustomButton(oButton2);
		this.oRichTextEditor.addCustomButton(oButton3);
		this.oRichTextEditor.addCustomButton(oButton4);
		Core.applyChanges();

		aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(oButton);
		Core.applyChanges();

		//Assert
		assert.ok(oRTEAggregationSpy.calledOnce, "RTE should proxy to the Toolbar");
		assert.deepEqual(aRemovedCustomButtons, oButton, "RTE should remove only the controls that were proxied.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2, oButton3, oButton4], "RTE aggregation should return only the aggregated controls.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2, oButton3, oButton4], "RTE's ToolbarWrapper aggregation should also return the same controls.");

		// Act / Remove by ID
		aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton("removeMe");
		Core.applyChanges();

		//Assert
		assert.deepEqual(aRemovedCustomButtons, oButton4, "RTE should remove only the controls that were proxied.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2, oButton3], "RTE aggregation should return only the aggregated controls.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2, oButton3], "RTE's ToolbarWrapper aggregation should also return the same controls.");

		// Act / Remove by index
		aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(1);
		Core.applyChanges();

		//Assert
		assert.deepEqual(aRemovedCustomButtons, oButton3, "RTE should remove only the controls that were proxied.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2], "RTE aggregation should return only the aggregated controls.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2], "RTE's ToolbarWrapper aggregation should also return the same controls.");

		// Act / Remove by index
		aRemovedCustomButtons = this.oRichTextEditor.removeCustomButton(99);
		Core.applyChanges();

		//Assert
		assert.strictEqual(aRemovedCustomButtons, null, "RTE should not have removed any buttons.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton2], "RTE aggregation should return only the aggregated controls.");
		assert.deepEqual(oToolbarWrapper.modifyToolbarContent("get"), [oButton2], "RTE's ToolbarWrapper aggregation should also return the same controls.");

		//Clean
		oButton.destroy();
		oButton2.destroy();
		oButton3.destroy();
		oButton4.destroy();
	});

	QUnit.module("CustomButtons aggregation overwritten methods in 'native' mode", {
		before: function (assert) {
			var done = assert.async();

			this.oRichTextEditor = new RichTextEditor("customToolbarRTENative");
			this.oRichTextEditor.placeAt("content");
			Core.applyChanges();

			this.oRichTextEditor.attachReady(done);
		},
		after: function () {
			this.oRichTextEditor.destroy();
			Core.applyChanges();
		},
		afterEach: function () {
			this.oRichTextEditor.destroyCustomButtons();
			Core.applyChanges();
		}
	});

	QUnit.test("addCustomButton", function (assert) {
		//Setup
		var oButton = new Button();
		var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "addAggregation");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);

		//Assert
		assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should store the aggregations");

	});

	QUnit.test("destroyCustomButtons", function (assert) {
		//Setup
		var oButton = new Button();
		var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "destroyAggregation");
		var oButtonDestroySpy = this.spy(oButton, "destroy");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		Core.applyChanges();

		this.oRichTextEditor.destroyCustomButtons();
		Core.applyChanges();

		//Assert
		assert.ok(oRTEAggregationSpy.calledOnce, "RTE aggregation should be destroyed.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), null, "RTE aggregation should be empty after that call.");

		assert.ok(oButtonDestroySpy.called, "Control's destructor should have been invoked.");
		assert.ok(oButton._bIsBeingDestroyed, "Control should be destroyed.");
	});

	QUnit.test("getCustomButtons", function (assert) {
		//Setup
		var oButton = new Button();

		//Act
		this.oRichTextEditor.addCustomButton(oButton);

		//Assert
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), [oButton], "RTE should return the controls stored in the aggregation");
	});

	QUnit.test("indexOfCustomButton", function (assert) {
		//Setup
		var index = null;
		var oButton = new Button();
		var oButton2 = new Button();
		var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "indexOfAggregation");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		this.oRichTextEditor.addCustomButton(oButton2);

		// Assert
		index = this.oRichTextEditor.indexOfCustomButton(oButton);
		assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should call indexOfAggregation.");
		assert.strictEqual(index, 0, "RTE should return the proper index.");

		index = this.oRichTextEditor.indexOfCustomButton(oButton2);
		assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton2), "RTE should call indexOfAggregation.");
		assert.strictEqual(index, 1, "RTE should return the proper index.");
	});

	QUnit.test("insertCustomButton", function (assert) {
		//Setup
		var oButton = new Button();
		var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "insertAggregation");

		//Act
		this.oRichTextEditor.insertCustomButton(oButton);

		//Assert
		assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons", oButton), "RTE should call insertAggregation.");
	});

	QUnit.test("removeAllCustomButtons", function (assert) {
		//Setup
		var aRemovedCustomButtons = null;
		var oButton = new Button();
		var oRTEAggregationSpy = this.spy(this.oRichTextEditor, "removeAllAggregation");

		//Act
		this.oRichTextEditor.addCustomButton(oButton);
		aRemovedCustomButtons = this.oRichTextEditor.removeAllCustomButtons();
		//Assert
		assert.ok(oRTEAggregationSpy.calledWithExactly("customButtons"), "RTE should call removeAllAggregation");
		assert.deepEqual(aRemovedCustomButtons, [oButton], "RTE should remove all the controls in that aggregation.");
		assert.deepEqual(this.oRichTextEditor.getCustomButtons(), null, "RTE aggregation should be empty after that call.");
	});

	QUnit.module("Resize handling module", {
		beforeEach: function (assert) {
			var done = assert.async();

			this.oRichTextEditor = new RichTextEditor("myRTE");
			this.oRichTextEditor.placeAt("content");
			Core.applyChanges();

			this.oRichTextEditor.attachReady(done);
			this.oRichTextEditor._bUnloading = false;
		},
		afterEach: function () {
			this.oRichTextEditor.destroy();
		}
	});

	QUnit.test("Should resize TinyMCE when the document state is 'complete'", function (assert) {
		// Arrange
		var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc", function () {
			return {
				readyState: "complete"
			};
		});
		var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

		// Act
		this.oRichTextEditor._resizeEditorOnDocumentReady();

		// Assert
		assert.ok(_resizeEditorTinyMCESpy.calledOnce, "resize should be called once");

		// cleanup
		oStub.restore();
	});

	QUnit.test("Should not resize TinyMCE when the document state is not 'complete'", function (assert) {
		// Arrange
		var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc", function () {
			return {
				addEventListener: function () { },
				readyState: "loading"
			};
		});
		var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

		// Act
		this.oRichTextEditor._resizeEditorOnDocumentReady();

		// Assert
		assert.ok(_resizeEditorTinyMCESpy.notCalled, "resize should not be called");

		// cleanup
		oStub.restore();
	});

	QUnit.test("Should not resize TinyMCE when the document is undefined", function (assert) {
		// Arrange
		var oStub = sinon.stub(this.oRichTextEditor._oEditor, "getDoc", function () {
			return undefined;
		});
		var _resizeEditorTinyMCESpy = sinon.spy(this.oRichTextEditor, "_resizeEditorTinyMCE");

		// Act
		this.oRichTextEditor._resizeEditorOnDocumentReady();

		// Assert
		assert.ok(_resizeEditorTinyMCESpy.notCalled, "resize should not be called");

		// cleanup
		oStub.restore();
	});

	QUnit.module("ARIA attributes");

	QUnit.test("Should add aria-labelledby attribute on the correct DOM element", function (assert) {
		// Arrange
		var done = assert.async();
		var oLabel = new InvisibleText("textForRTE", {
			text: "test"
		}).placeAt("content");

		var oRichTextEditor = new RichTextEditor("myRTE", {
			ariaLabelledBy: ["test"]
		});
		oRichTextEditor.placeAt("content");
		oRichTextEditor.attachReady(function () {
			// Assert
			assert.strictEqual(document.getElementById(oRichTextEditor._iframeId).attributes["aria-labelledby"].value, "test textForRTE", "Correct aria-labelledby attribute is added to the DOM");

			// Clean
			oLabel.destroy();
			oRichTextEditor.destroy();
			done();
		});

		// Act
		oRichTextEditor.addAriaLabelledBy(oLabel);
	});

	QUnit.test("Should add aria-label attribute on the Rich Text Editor wrapper DOM element", function (assert) {
		// Arrange
		var done = assert.async();
		setLanguage("en"); // We need to be sure that the RTE is in the correct language for the assertion
		var oRichTextEditor = new RichTextEditor("myRTE2");

		// Act
		oRichTextEditor.placeAt("content");
		oRichTextEditor.attachReady(function () {
			// Assert
			assert.strictEqual(oRichTextEditor.getDomRef().getAttribute("aria-label"), "Rich Text Editor", "The Correct aria-label attribute is added to the DOM");

			// Clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Should add role 'region' attribute on the Rich Text Editor wrapper DOM element", function (assert) {
		// Arrange
		var done = assert.async();
		var oRichTextEditor = new RichTextEditor("myRTE3");

		// Act
		oRichTextEditor.placeAt("content");
		oRichTextEditor.attachReady(function () {
			// Assert
			assert.strictEqual(oRichTextEditor.getDomRef().getAttribute("role"), "region", "Role 'region' attribute is added to the DOM");

			// Clean
			oRichTextEditor.destroy();
			done();
		});
	});

	QUnit.test("Should add aria-roledescription attribute on the Rich Text Editor's custom toolbar'", function (assert) {
		// Arrange
		var done = assert.async();
		var oCustomToolBarDOM;
		var oRichTextEditor = new RichTextEditor("myRTE4", {
			customToolbar: true
		});

		// Act
		oRichTextEditor.placeAt("content");
		Core.applyChanges();

		oCustomToolBarDOM = oRichTextEditor.getAggregation("_toolbarWrapper").getAggregation("_toolbar").getDomRef();

		oRichTextEditor.attachReady(function () {
			// Assert
			assert.strictEqual(oCustomToolBarDOM.getAttribute("aria-roledescription"), "Rich Text Editing Options", "The correct aria-roledescrition text is set to the CustomToolbar	");

			// Clean
			oRichTextEditor.destroy();
			done();
		});
	});
});
