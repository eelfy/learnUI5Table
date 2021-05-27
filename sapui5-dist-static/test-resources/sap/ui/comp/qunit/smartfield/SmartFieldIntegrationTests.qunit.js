/* global QUnit */
QUnit.config.autostart = false;

/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartfield/SmartField",
	"sap/m/VBox",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/model/BindingMode",
	"sap/ui/core/CustomData",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartfield/TextArrangementDelegate"
], function(
	Core,
	MockServer,
	ODataModel,
	SmartField,
	VBox,
	QUnitUtils,
	BindingMode,
	CustomData,
	GroupElement,
	Group,
	SmartForm,
	TextArrangementDelegate
) {
	"use strict";

	var oMockServer = new MockServer({
		rootUri: "odata/"
	});

	oMockServer.simulate("test-resources/sap/ui/comp/shared/mockserver/metadata.xml", "test-resources/sap/ui/comp/shared/mockserver/");
	oMockServer.start();
	var oDataModel = new ODataModel("odata", {
		json: true,
		useBatch: true
	});
	oDataModel.setDefaultBindingMode(BindingMode.TwoWay);

	var oDataModel2 = new ODataModel("odata", {
		json: true,
		useBatch: true
	});
	oDataModel2.setDefaultBindingMode(BindingMode.TwoWay);

	function beforeEach() {
		this.oVBox = new VBox();
		this.oVBox.setModel(oDataModel); // note: by default the binding mode in OData is OneWay
		this.oVBox.bindObject({
			path: "/Products('1239102')"
		});
	}

	function afterEach() {

		if (this.oVBox) {
			this.oVBox.destroy();
			this.oVBox = null;
		}

		oDataModel.resetChanges();
	}

	function fnAssertInnerControlValue(sExpectedValue, bEditMode, oSmartField, fnResolve, assert) {
		oSmartField.attachEventOnce("innerControlsCreated", function() {

			var oInnerControl = oSmartField.getFirstInnerControl(),
				oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						setTimeout(function () {
							// Assert
							assert.strictEqual(
								oInnerControl[bEditMode ? "getValue" : "getText"](),
								sExpectedValue,
								"Input has expected value"
							);

							if (fnResolve) {
								fnResolve();
							}
						}, 100 /* We let enough time for the control to update */);
					}
				};

			oInnerControl.addDelegate(oDelegate);
		});
	}

	var oQUnitModuleDefaultSettings = {
		beforeEach: beforeEach,
		afterEach: afterEach
	};

	QUnit.module("Binding mode propagation to inner controls", oQUnitModuleDefaultSettings);

	// BCP: 1980261903
	QUnit.test("Edm.String", function(assert) {
		var done = assert.async();

		// system under test (type String -> Input)
		var oSmartField = new SmartField({
			value: "{ path: 'Name', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.Input"), true, "The inner control is an input field");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String propagate the formatted value to inner control", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			editable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var sValue = "Dummy value",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl(),
				sFormattedValue = oInnerControl.getText();

			// Act
			oSmartControl.setValue(sValue);

			// assert
			assert.equal(oInnerControl.getText(), sFormattedValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'StringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.notStrictEqual(oSmartControl.getValue(), "", "The valid date value is formatted to a date");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String with com.sap.vocabularies.Common.v1.IsCalendarDate and invalid date", function(assert) {
		var done = assert.async();

		// system under test (type String -> sap.m.DatePicker)
		var oSmartField = new SmartField({
			value: "{ path: 'InvalidStringDate', mode: 'OneWay' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartControl = oControlEvent.getSource();
			var aInnerControls = oSmartControl.getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an sap.m.DatePicker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			assert.strictEqual(oSmartControl.getValue(), "", "The invalid date value is formatted to an empty string");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'LastChanged', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTimeOffset", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'AvailableSince', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.DateTime (sap:display-format=Date)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'CreationDate', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.String (sap:semantics=yearmonthday)", function(assert) {
		var done = assert.async();

		// system under test (type Date -> Date Picker (Date Time))
		var oSmartField = new SmartField({
			value: "{path: 'DateStr', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("value");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.DatePicker"), true, "The inner control is an date picker");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Combo box (fixed value list)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Category', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("enteredValue");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.ComboBox"), true, "The inner control is an select");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Edm.Boolean (Check box)", function(assert) {
		var done = assert.async();

		// system under test (fixed values Select control)
		var oSmartField = new SmartField({
			value: "{path: 'Sale', mode: 'OneWay'}"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var aInnerControls = oControlEvent.getSource().getInnerControls();
			var oControl = aInnerControls[0];
			var mBindingInfo = oControl.getBindingInfo("selected");

			// assert
			assert.strictEqual(aInnerControls.length, 1, "There is one inner control");
			assert.strictEqual(oControl.isA("sap.m.CheckBox"), true, "The inner control is an check box");
			assert.strictEqual(mBindingInfo.parts[0].mode, BindingMode.OneWay, "The binding mode is one-way");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Initialize event", oQUnitModuleDefaultSettings);

	// BCP: 1970182133
	// BCP: 1970183463
	QUnit.test("it should fire the initialize event after the control is fully initialized", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name'}",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oSmartField = oControlEvent.getSource();
			var aInnerControls = oSmartField.getInnerControls();

			// assert
			assert.strictEqual(aInnerControls.length, 1, "the inner controls should be created");
			assert.ok(oSmartField.getControlFactory(), "the factory should be created");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("FieldControl editable and visible state handling", oQUnitModuleDefaultSettings);

	QUnit.test("it should not override the initial value of the editable property when the FieldControl's path is '' (empty)", function(assert) {

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// act
		this.oVBox.addItem(oSmartField);

		// assert
		assert.strictEqual(oSmartField.getEditable(), false);
	});

	// BCP: 1970202197
	QUnit.test("it should not override the editable property while the inner binding is being initialized", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			entitySet: "Products",
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		oSmartField.attachInitialise(function() {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
			var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

			// assert
			// the assumption made in this test is that the edm:property named "Name" is not annotated with
			// the FieldControl annotation
			assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
			assert.strictEqual(oSmartField.getEditable(), false);
			assert.strictEqual(sFieldControlPath, undefined);

			done();
		});

		// act
		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("it should reset the editable property to its default value (editable=true) if the metadata allows " +
				"the field to be updatable", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Name' }",
			editable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oFactory.getEdmProperty());
			var bEntitySetAndEdmPropertyUpdatable = oFieldControl._getUpdatableStatic(oFactory.getMetaData());

			// act
			oSmartField.setEditable(null);

			// assert
			// the assumption made in this test is that the edm:property named "Name" is not annotated with
			// the FieldControl annotation, and that the entity set and the edm:property named "Name" are
			// updatable
			assert.strictEqual(bEntitySetAndEdmPropertyUpdatable, true);
			assert.strictEqual(sFieldControlPath, undefined);
			assert.strictEqual(oSmartField.getEditable(), true);
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test('it should set the UoM field to editable when the underlying edm:property is immutable', function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), true);
			assert.strictEqual(oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName(), "sap.m.Input");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("the UoM field should be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), true);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Input");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970375171
	QUnit.test("the UoM field should not be visible", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(false);

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			assert.strictEqual(oUoMNestedSmartField.getVisible(), false);
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("the UoM field should not be visible if the underlying edm:property is annotated as hidden", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyNotVisible' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oUoMNestedSmartField = this._getEmbeddedSmartField();

			// act
			oSmartField.setUomVisible(true); // this API call should be
			Core.applyChanges();

			// assert
			assert.strictEqual(oUoMNestedSmartField.getBinding("visible").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970575713
	QUnit.test("it should not set the UoM field to visible after cloning if the uomVisible property is set to false", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField("smartfieldID1", {
			value: "{ path: 'Price' }",
			uomVisible: false
		});

		// arrange
		oSmartField.attachEventOnce("initialise", function(oControlEvent) {

			// act
			var oSmartFieldClone = oSmartField.clone();

			// arrange
			oSmartFieldClone.attachEventOnce("initialise", function(oControlEvent) {
				Core.applyChanges();
				var oNestedSmartField = oSmartFieldClone._getEmbeddedSmartField();

				// assert
				assert.strictEqual(oNestedSmartField.getVisible(), false, "the UoM field should be hidden");
				assert.strictEqual(oNestedSmartField.isActive(), false, "the UoM field should be hidden");
				done();
			}, this);

			this.oVBox.addItem(oSmartFieldClone);
		}, this);

		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
	});

	QUnit.test("it should set the UoM field to read-only", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomEditable: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(false);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"], undefined, 'the edm:property should be updatable (default)');
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1980259594
	QUnit.test("it should not set the UoM field to editable if the underlying edm:property is updatable/immutable", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceCurrencyReadOnly' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oUoMNestedSmartField = this._getEmbeddedSmartField(),
				oCurrencyEdmProperty = oFactory.getMetaData().annotations.uom.property.property;

			// act
			oSmartField.setUomEditable(true);
			Core.applyChanges();

			// assert
			assert.strictEqual(oCurrencyEdmProperty["Org.OData.Core.V1.Immutable"].Bool, "true");
			assert.strictEqual(oUoMNestedSmartField.getBinding("editable").getExternalValue(), false);
			var sControlMetadataName = oUoMNestedSmartField.getFirstInnerControl().getMetadata().getName();
			assert.strictEqual(sControlMetadataName, "sap.m.Text");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970185965
	QUnit.test("it should render a mandatory field", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Phone' }",
			mandatory: true
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory();
			var oFieldControl = oFactory._oFieldControl;
			var oEdmProperty = oFactory.getEdmProperty();
			var sFieldControlPath = oFieldControl._oAnnotation.getFieldControlPath(oEdmProperty);

			// assert
			assert.strictEqual(oEdmProperty.nullable, "true", "the backend can accept nulled/empty values");
			assert.strictEqual(sFieldControlPath, undefined, "the FieldControl annotation is not specified");
			assert.strictEqual(oSmartField.getMandatory(), true, "the field should be mandatory");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Time formatting", oQUnitModuleDefaultSettings);

	// BCP: 1980303513
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text " +
				"annotation correctly", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'DeliveryTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";

			// assert
			assert.strictEqual(oTextField.getText(), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	// BCP: 1970236005
	QUnit.test("it should format the value of the field typed as Edm.Time annotated with the @Common.Text and " +
				"@Common.SemanticObject annotations correctly", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ExpiredTime' }",
			editable: false // this setting triggers a different control flow (path) in the code
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			var oTextField = oSmartField.getFirstInnerControl();
			var oEdmProperty = oSmartField.getControlFactory().getEdmProperty();
			var TEXT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.Text";
			var SEMANTIC_OBJECT_ANNOTATION_TERM = "com.sap.vocabularies.Common.v1.SemanticObject";

			// assert
			assert.strictEqual(oTextField.getText(), "9:00:21 AM");
			assert.ok(oEdmProperty.hasOwnProperty(TEXT_ANNOTATION_TERM));
			assert.ok(oEdmProperty.hasOwnProperty(SEMANTIC_OBJECT_ANNOTATION_TERM));
			done();
		}, this);

		this.oVBox.addItem(oSmartField);
	});

	QUnit.module("Currency validation", oQUnitModuleDefaultSettings);

	// BCP: 1980097317
	QUnit.test("it should format the amount for JPY currencies without any digit to the right of the decimal point", function(assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239103')"
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			var oFactory = oSmartField.getControlFactory(),
				oEdmProperty = oFactory.getEdmProperty(),
				oAmountInnerControl = oSmartField.getFirstInnerControl(),
				aBindingValues = oAmountInnerControl.getBinding("value").getValue(),
				sAmountBindingValue = aBindingValues[0],
				sCurrencyBindingValue = aBindingValues[1],
				EXPECTED_FORMATTED_VALUE = "100";

			oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			// assert
			assert.strictEqual(oEdmProperty.precision, "13");
			assert.strictEqual(oEdmProperty.scale, "2");
			assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCode");
			assert.strictEqual(sAmountBindingValue, "100.00");
			assert.strictEqual(sCurrencyBindingValue, "JPY");
			assert.strictEqual(oSmartField.getValue(), EXPECTED_FORMATTED_VALUE);
			assert.strictEqual(oAmountInnerControl.getValue(), EXPECTED_FORMATTED_VALUE);
			assert.strictEqual(oAmountInnerControl.getFocusDomRef().value, EXPECTED_FORMATTED_VALUE);

			// cleanup
			oVBox.destroy();
			done();
		});

		oVBox.addItem(oSmartField);
	});

	QUnit.test("it should not store an invalid amount value in the binding when the field is subject to " +
				"data type constraints", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INITIAL_VALUE = "856.49";
			var INPUT_VALUE = "856.491";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 0, 'the amount text input field should not fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INITIAL_VALUE, "it should not update the binding value");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	// BCP: 1980461191
	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency field is invisible/read-only and the data type constraints are fulfilled (test case 1)", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			uomVisible: false,
			uomEditable: false
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {

				// assert
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');

				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];

				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should store the valid value in the model when the amount input field is in edit mode, " +
				"the currency value is empty, and the data type constraints are fulfilled (test case 2)", function(assert) {

		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceEmptyCurrency' }"
		});

		// arrange
		var oVBox = new VBox();
		oVBox.setModel(oDataModel);
		oVBox.bindObject({
			path: "/Products('1239104')"
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef();
			var oFireValidationSuccessSpy = this.spy(oAmountInputField, "fireValidationSuccess");
			var oFireChangeEventSpy = this.spy(oAmountInputField, "fireChange");
			var INPUT_VALUE = "100";
			var oFactory = oSmartField.getControlFactory();
			var oEdmProperty = oFactory.getEdmProperty();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", INPUT_VALUE);
			oAmountInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {
				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sAmountBindingValue = aBindingValues[0];
				var sCurrencyBindingValue = aBindingValues[1];

				// assert
				assert.strictEqual(oEdmProperty["Org.OData.Measures.V1.ISOCurrency"].Path, "CurrencyCodeEmpty");
				assert.strictEqual(sCurrencyBindingValue, "", "the currency should have an empty value stored in the binding/model");
				assert.strictEqual(oFireChangeEventSpy.callCount, 1, 'the amount text input field should fire the "change" event');
				assert.strictEqual(oFireValidationSuccessSpy.callCount, 1, 'the amount text input field should fire the "validationSuccess" event');
				assert.strictEqual(sAmountBindingValue, INPUT_VALUE, "it should update the binding value");

				// cleanup
				oVBox.destroy();
				done();
			}, 0);
		}, this);

		oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should call the binding propertyChange event when the amount field is edited", function(assert) {
		var done = assert.async(),
			oSmartField = new SmartField({
				value: "{ path: 'Price' }",
				uomVisible: true,
				uomEditable: false
			});

		assert.expect(1); // We expect only one assert

		// arrange
		oSmartField.attachInitialise(function() {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputField = oSmartField.getFirstInnerControl(),
				oAmountInputFieldFocusDomRef = oAmountInputField.getFocusDomRef(),
				oAmountFieldModel = oAmountInputField.getModel(),
				fnPropertyChangeHandler = function () {
					// cleanup
					oAmountFieldModel.detachPropertyChange(fnPropertyChangeHandler);

					// assert
					assert.ok(true, 'the propertyBinding "propertyChange" event should be fired oince');
					done();
				};

			oAmountFieldModel.attachPropertyChange(fnPropertyChangeHandler);

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100");
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should fire changeModelValue event when amount of currency field changes", function (assert) {
		var done = assert.async(),
			sNewValue = "856.11";

		assert.expect(4);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getBinding("value").getValue()[0],
					sNewValue,
					"New value stored in the model by the time the event is fired"
				);
				assert.strictEqual(oEvent.getParameter("unitChanged"), false,
					"unitChanged parameter should be falsy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "None",
					"unitLastValueState parameter should be 'None'");

				done();
			}
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// act
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", sNewValue);
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
	});


	QUnit.test("it should fire changeModelValue with unitChanged parameter when unit changes", function (assert) {
		var done = assert.async();

		assert.expect(5);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(oEvent.getParameter("valueChanged"), false,
					"valueChanged parameter should be falsy as the change resulted from interaction with the currency field");
				assert.strictEqual(oEvent.getParameter("valueLastValueState"), "None",
					"valueLastValueState parameter should be 'None'");
				assert.strictEqual(oEvent.getParameter("unitChanged"), true,
					"unitChanged parameter should be truthy as the change resulted from interaction with the currency field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "None",
					"unitLastValueState parameter should be 'None'");

				done();
			}
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oCurrencyInputFieldFocusDomRef = oSmartField.getInnerControls()[1].getFocusDomRef();

			// act
			oCurrencyInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oCurrencyInputFieldFocusDomRef, "U", "USD");
			oCurrencyInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("It should should store the currency value in UpperCase", function (assert) {
		var done = assert.async();

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();
			var oAmountInputField = oSmartField.getFirstInnerControl();
			var oCurrencyInputFieldFocusDomRef = oSmartField._getUomControl().getFocusDomRef();

			// act
			oCurrencyInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oCurrencyInputFieldFocusDomRef, "u", "usd");
			oCurrencyInputFieldFocusDomRef.blur();

			// when the value in the input field has changed and a blur event occurs on a sap.m.InputBase control, the change event is
			// fired async
			setTimeout(function() {
				var aBindingValues = oAmountInputField.getBinding("value").getValue();
				var sCurrencyBindingValue = aBindingValues[1];

				assert.strictEqual(sCurrencyBindingValue, "USD", "it should update the binding value in UpperCase");
				done();
			}, 0);
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("it should fire changeModelValue with unitChanged:false and unitLastValueState:Error parameter when unit changes", function (assert) {
		var done = assert.async();

		assert.expect(5);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'Price' }",
			changeModelValue: function (oEvent) {
				// assert
				assert.ok(true, "changeModelValue event fired");
				assert.strictEqual(oEvent.getParameter("valueChanged"), true,
					"valueChanged parameter should be truthy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("valueLastValueState"), "Error",
					"valueLastValueState parameter should be 'Error' as the change resulted from interaction with " +
					"the 'amount' field but the 'currency' field was in error state.");
				assert.strictEqual(oEvent.getParameter("unitChanged"), false,
					"unitChanged parameter should be falsy as the change resulted from interaction with the amount field");
				assert.strictEqual(oEvent.getParameter("unitLastValueState"), "Error",
					"unitLastValueState parameter should be 'Error' as the change resulted from interaction with " +
					"the 'amount' field but the 'currency' field was in error state.");

				done();
			}
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			var oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// act
			oSmartField.getInnerControls()[1].setValueState("Error");
			oAmountInputFieldFocusDomRef.focus();
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100");
			oAmountInputFieldFocusDomRef.blur();
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.test("with sap:variable-scale='true' it should ignore the provided service metadata scale", function (assert) {
		var done = assert.async();

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'PriceVariableScale' }"
		});

		// arrange
		oSmartField.attachInitialise(function(oControlEvent) {
			// Arrange
			var oAmountInputFieldFocusDomRef,
				oEdmProperty = oSmartField.getControlFactory().getEdmProperty();

			// Render the control
			this.oVBox.placeAt("qunit-fixture");
			Core.applyChanges();

			// Arrange
			oAmountInputFieldFocusDomRef = oSmartField.getFirstInnerControl().getFocusDomRef();

			// Assert
			assert.strictEqual(oEdmProperty["sap:variable-scale"], "true", "Variable scale set in service metadata");
			assert.strictEqual(oEdmProperty.scale, "0", "Scale of 0 set in service metadata");

			// Act
			QUnitUtils.triggerCharacterInput(oAmountInputFieldFocusDomRef, "1", "100.01");

			// Assert
			oSmartField.checkValuesValidity()
				.then(function () {
					assert.ok(true,
						"The validation succeeded taking into account the currency scale and ignoring the service metadata scale"
					);
					done();
				})
				.catch(function () {
					assert.ok(false,
						"The validation should not take into account the provided service metadata scale=0 and should succeed"
					);
					done();
				});
		}, this);

		this.oVBox.insertItem(oSmartField);
	});

	QUnit.module("ValueList and TextArrangement in display mode - not fixed list mode", {
		beforeEach: beforeEach,
		afterEach: afterEach,
		assertInnerControlValue: fnAssertInnerControlValue
	});

	QUnit.test("Key value exist in the attached value list", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("LT (Laptop)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Key value does not exist in the attached value list", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ThirdCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("Non existing key", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Default TextArrangement from control configuration", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'ForthCategory' }",
			editable: false
		}).addCustomData(new CustomData({
			key: "defaultInputFieldDisplayBehaviour",
			value: "idAndDescription"
		}));

		// Assert
		this.assertInnerControlValue("LT (Laptop)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("TextArrangement local property value from `Type` annotation", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'FifthCategory' }",
			editable: false
		});

		// Assert
		this.assertInnerControlValue("Projector (LT)", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Switch from mode 'editable' to 'display' with textInEditModeSource='ValueList'", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {
				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);
			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Switch from mode 'editable' to 'display' with textInEditModeSource='None'", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "None",
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);

			}.bind(this));

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='ValueList'", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='None'", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "None",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("fetchValueListReadOnly equals 'false'", function(assert) {
		var done = assert.async();
		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false,
			fetchValueListReadOnly: false
		});

		// Assert
		this.assertInnerControlValue("LT", false, oSmartField, done, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	// SmartField may be first added to the view via fragment with the binding context of the parent
	// initially propagated to it and after that exchanged with more specific binding context.
	// This is relevant for Smart Templates OP extension scenario.
	QUnit.test("Exchanging binding context should re-apply text arrangement", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {
				var oDelegate;

				// Assert
				oSmartField.addEventDelegate(oDelegate = {
					onAfterRendering: function () {
						setTimeout(function () {
							// Assert -> text arrangement is applied for the new binding context
							assert.strictEqual(oSmartField.getFirstInnerControl().getText(),
								"LT (Laptop)", "Text arrangement is applied for the new binding context");

							fnResolve();
						}, 100);

						// Remove the delegate right away -> we need one assertion only
						oSmartField.removeEventDelegate(oDelegate);
					}
				});

				// Act - Change the model to trigger change of binding context after
				// the control was rendered with another
				this.oVBox.setModel(oDataModel2);

			}.bind(this));

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2080185890 -> no request should be made if there is no sap:text annotation", function(assert) {
		var done = assert.async(),
			aRequestsList;

		assert.expect(1);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SixthCategory' }",
			editable: false
		});

		// Attach to the mock server so we make sure no requests are send
		aRequestsList = oMockServer.getRequests();
		aRequestsList.push({
			method: 'GET',
			path: 'VL_SH_H_CATEGORY_NO_TEXT(.*)',
			response: function(oRequest /*, oResponse */) {
				assert.ok(false, "We should not make any value help requests in this scenario");
				assert.ok(
					oRequest.url.indexOf("undefined") === -1,
					"There should be no `undefined` in the request URL"
				);
			}
		});

		// Re-init the mock server
		oMockServer.stop();
		oMockServer.setRequests(aRequestsList);
		oMockServer.start();

		// Assert
		this.assertInnerControlValue("LT", false, oSmartField, function () {
			// Restore the mock server in timeout so we make sure no requests will be made
			setTimeout(function () {
				// Clean up the mock server
				aRequestsList = oMockServer.getRequests();
				aRequestsList.pop(); // Remove the request listener we have added -> Array.pop modifies the source array

				// Re-init the mock server
				oMockServer.stop();
				oMockServer.setRequests(aRequestsList);
				oMockServer.start();

				// We finish the test
				done();
			}, 200);
		}, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	// TODO: Make separate request/response testing file and move such tests there
	QUnit.test("Only one request should be made if there is no value list annotation", function(assert) {
		var done = assert.async(),
			oRequestSpy = this.spy(),
			aRequestsList;

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'CategoryName' }",
			editable: false
		});

		var fnRequestHandler = function (oEvent) {
			// Call our request SPY so it can collect the needed data
			oRequestSpy(oEvent.getParameter("oXhr").url);
		};

		// Attach to the mock server so we make sure no requests are send
		oMockServer.attachBefore("GET", fnRequestHandler);

		// Assert
		this.assertInnerControlValue("Projector", false, oSmartField, function () {
			// Restore the mock server in timeout so we make sure no requests will be made
			setTimeout(function () {
				oMockServer.detachBefore("GET", fnRequestHandler);
				assert.strictEqual(oRequestSpy.callCount, 1, "Mock server called only once with GET request");
				assert.strictEqual(
					oRequestSpy.getCall(0).args[0],
					"odata/Products('1239102')",
					"Request was retrieving the main record"
				);

				// Clean up the mock server
				aRequestsList = oMockServer.getRequests();
				aRequestsList.shift(); // Remove the request listener we have added -> Array.shift modifies the source array

				// Re-init the mock server
				oMockServer.stop();
				oMockServer.setRequests(aRequestsList);
				oMockServer.start();

				// We finish the test
				done();
			}, 200);
		}, assert);

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2080189893 Switch from mode 'display' to 'editable' should not call reBind", function(assert) {
		var done = assert.async(),
			oRebindIfNecessarySpy,
			oRebindSpy;

		assert.expect(4);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'CategoryName' }",
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("Projector", true, oSmartField, function () {
				var oFactory = oSmartField.getControlFactory();

				// Attach spy's
				oRebindSpy = this.spy(oFactory, "reBind");
				oRebindIfNecessarySpy = this.spy(oFactory, "reBindIfNecessary");

				fnResolve();
			}.bind(this), assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("Projector", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);

			}.bind(this));

		}.bind(this)).then(function () {
			// Assert
			assert.strictEqual(oRebindIfNecessarySpy.callCount, 1, "rebindIfNecessary called once during transition");
			assert.strictEqual(oRebindSpy.callCount, 0, "reBind should not be called with no ValueList annotation");

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2080189893 Switch from mode 'display' to 'editable' should fire initialise event only once and should not re-bind control properties twice", function(assert) {
		var done = assert.async(),
			oInitialiseSpy = this.spy(),
			oSFBindPropertySpy,
			oFCBindPropertiesSpy;

		assert.expect(8);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: true,
			initialise: oInitialiseSpy
		});

		oSFBindPropertySpy = this.spy(oSmartField, "bindProperty");

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, function () {
				// Attach Field Control spy
				oFCBindPropertiesSpy = this.spy(oSmartField.getControlFactory()._oFieldControl, "bindProperties");

				fnResolve();
			}.bind(this), assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(false);

			}.bind(this));

		}.bind(this)).then(function () {
			// Assert
			assert.strictEqual(oInitialiseSpy.callCount, 1, "initialized event called once during transition");
			assert.strictEqual(oFCBindPropertiesSpy.callCount, 0,
				"Field Control 'bindProperties' method should not be called during transition"
			);
			assert.strictEqual(oSFBindPropertySpy.callCount, 3, "SmartField bindProperty method");
			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "editable";}).length,
				1,
				"SmartField bindProperty called for editable property once"
			);

			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "visible";}).length,
				1,
				"SmartField bindProperty called for visible property once"
			);

			assert.strictEqual(
				oSFBindPropertySpy.getCalls().filter(function (oCall) {return oCall.args[0] === "mandatory";}).length,
				1,
				"SmartField bindProperty called for mandatory property once"
			);

			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Two value list requests send on binding context update", function(assert) {
		var done = assert.async(),
			oInitialiseSpy = this.spy(),
			oReadSpy = this.spy(TextArrangementDelegate.prototype, "readODataModel");

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: false,
			initialise: oInitialiseSpy,
			textInEditModeSource: "ValueList"
		});

		var oSmartForm = new SmartForm({
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {
			// Act
			oSmartForm.bindObject({
				path: "/Products('1239102')"
			});

			// Assert
			assert.strictEqual(oSmartField.getTextInEditModeSource(), "ValueList", "Property set in display mode");

			// Assert
			setTimeout(function () {
				assert.strictEqual(oReadSpy.callCount, 2, "Read spy should be called twice");

				// We finished all assertions
				done();
			}, 200);

		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.module("ValueList and TextArrangement in edit mode", {
		beforeEach: beforeEach,
		afterEach: afterEach,
		assertInnerControlValue: fnAssertInnerControlValue
	});

	QUnit.test("BCP: 2080159141 -> setTextInEditModeSource called with 'ValueList' after control is initialized", function(assert) {
		var done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			// textInEditModeSource: "None" -> default value
			editable: true
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {

			return new Promise(function (fnResolve, fnReject) {

				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setTextInEditModeSource("ValueList");

			}.bind(this));

		}.bind(this)).then(function () {

			// We finished all assertions
			done();

		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2080167558 -> setTextInEditModeSource with UpperCase annotation called with 'ValueList' after control is initialized", function(assert) {
		var bEditMode = true, done = assert.async();
		assert.expect(2);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SeventhCategory' }",
			textInEditModeSource: "ValueList",
			editable: true,
			showSuggestion: false
		});

		// Act
		Promise.resolve().then(function () {
			return new Promise(function (fnResolve, fnReject) {
				// Assert
				return this.assertInnerControlValue("LT (Laptop)", bEditMode, oSmartField, fnResolve, assert);
			}.bind(this));
		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "1", "pr");
				oInnerControl.onChange();

				oSmartField.getBinding("value").attachChange(function(){
					fnResolve();
				});

				return oInnerControl;
			});
		}).then(function () {
			var oInnerControl = oSmartField.getFirstInnerControl();
			// Assert
			assert.strictEqual(
				oInnerControl[bEditMode ? "getValue" : "getText"](),
				"PR (Projector)",
				"Input has expected value"
			);
		}).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: -> TextInEditModeSource and FieldControl supported simultaneously", function(assert) {
		var done = assert.async(),
			oInitialisedSpy = this.spy(),
			oSmartField,
			oSmartForm;

		assert.expect(3);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true,
			initialised: oInitialisedSpy
		});

		oSmartForm = new sap.ui.comp.smartform.SmartForm({
			editable: true,
			groups: [
				new sap.ui.comp.smartform.Group({
					groupElements: [
						new sap.ui.comp.smartform.GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		oSmartField.attachInitialise(
			function () {
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getLabels()[0].getText(),
					"Second Category",
					"Label text should match"
				);
				assert.strictEqual(
					oSmartField.getMandatory(),
					true,
					"SmartField should has it's property set to mandatory true"
				);
				assert.strictEqual(
					oSmartField.getFirstInnerControl().getRequired(),
					true,
					"Input should has it's property set to required true"
				);
				done();
			}
		);

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2080337523 -> Smart field to fire change event", function(assert) {
		var done = assert.async(),
			oChangeSpy = this.spy(),
			oSmartField,
			oSmartForm;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: true,
			change: oChangeSpy
		});

		oSmartForm = new sap.ui.comp.smartform.SmartForm({
			editable: true,
			groups: [
				new sap.ui.comp.smartform.Group({
					groupElements: [
						new sap.ui.comp.smartform.GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});
		oSmartField.attachInitialise(
			function () {
				oSmartField.getFirstInnerControl().fireChange();
			}
		);
		oSmartField.attachChange(
			function () {
				assert.ok("SmartField should fire change");
				done();
			}
		);

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Switch from mode 'display' to 'editable' with textInEditModeSource='ValueList'", function(assert) {
		var done = assert.async(),
			oRebindSpy;

		assert.expect(3);

		// system under test
		var oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			textInEditModeSource: "ValueList",
			editable: false
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", false, oSmartField, function () {
				oRebindSpy = this.spy(oSmartField.getControlFactory(), "reBind");
				fnResolve();
			}.bind(this), assert);

		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				// Assert
				this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

				// Act
				oSmartField.setEditable(true);
			}.bind(this));

		}.bind(this)).then(function () {
			assert.strictEqual(oRebindSpy.callCount, 1, "ReBind called when transitioning from disply to edit mode");

			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Test defaultTextInEditModeSource with ValueList", function(assert) {
		var done = assert.async(),
			oSmartField,
			oSmartForm;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'SecondCategory' }",
			editable: true
		});

		oSmartForm = new SmartForm({
			editable: true,
			customData: [
				new CustomData({
				key: "defaultTextInEditModeSource",
				value: "ValueList"
			})],
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {

			// Assert
			this.assertInnerControlValue("LT (Laptop)", true, oSmartField, fnResolve, assert);

		}.bind(this)).then(function () {
			// We finished all assertions
			done();
		});


		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("Test defaultTextInEditModeSource with ValueListNoValidation and isDigitalSequence", function(assert) {
		var done = assert.async(),
			oSmartField,
			oSmartForm;

		assert.expect(4);

		oSmartField = new SmartField({
			value: "{ path: 'EightCategory' }",
			editable: true
		});

		oSmartForm = new SmartForm({
			editable: true,
			customData: [
				new CustomData({
					key: "defaultTextInEditModeSource",
					value: "ValueListNoValidation"
				})],
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [
								oSmartField
							]
						})
					]
				})
			]
		});

		new Promise(function (fnResolve, fnReject) {
			// Assert
			this.assertInnerControlValue("1 (Office)", true, oSmartField, fnResolve, assert);
		}.bind(this)).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				var oDelegate = {
					onAfterRendering: function () {
						// We execute the delegate only once
						oInnerControl.removeDelegate(oDelegate);

						assert.strictEqual(oInnerControl.getValueState(), "Error", "ValueState is `Error`");
						assert.strictEqual(
							oSmartField.getBinding("value").getValue(),
							"1",
							"Non numeric value is not stored in local model."
						);
						fnResolve();
					}
				};

				oInnerControl.addDelegate(oDelegate);

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "a", "abc");
				oInnerControl.onChange();
			});
		}).then(function () {
			return new Promise(function (fnResolve, fnReject) {
				var oInnerControl = oSmartField.getFirstInnerControl(),
					oInnerControlFocusDomRef = oInnerControl.getFocusDomRef();

				// Act
				QUnitUtils.triggerCharacterInput(oInnerControlFocusDomRef, "4", "4");
				oInnerControl.onChange();

				oSmartField.getBinding("value").attachChange(function(oEvent){
					assert.strictEqual(
						oSmartField.getBinding("value").getValue(),
						"4",
						"Numeric value is stored in local model."
					);
					fnResolve();
				});
			});
		}).then(function () {
			// We finished all assertions
			done();
		});

		// Act
		this.oVBox.addItem(oSmartForm);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.test("BCP: 2070396210 We do not modify the reference provided via dateFormatSettings", function (assert) {
		var done = assert.async(),
			oDateFormatSettings = {UTC: true, style: "short"},
			oSmartField;

		assert.expect(2);

		oSmartField = new SmartField({
			value: "{ path: 'AvailableSince' }",
			editable: false
		});

		oSmartField.data("dateFormatSettings", oDateFormatSettings);
		oSmartField.attachEventOnce("innerControlsCreated", function() {

		var oInnerControl = oSmartField.getFirstInnerControl(),
			oDelegate = {
				onAfterRendering: function () {
					// We execute the delegate only once
					oInnerControl.removeDelegate(oDelegate);

					// Assert
					assert.strictEqual(oDateFormatSettings.UTC, true, "object reference is not modified");
					assert.strictEqual(
						oInnerControl.getBinding("text").getType().oFormatOptions.UTC,
						false,
						"Reference provided to the type is with format options UTC=false"
					);

					done();
				}
			};

			oInnerControl.addDelegate(oDelegate);
		});

		// Act
		this.oVBox.addItem(oSmartField);
		this.oVBox.placeAt("qunit-fixture");
		Core.applyChanges();
	});

	QUnit.module("Display-format='NonNegative' with TextArrangement display mode ", oQUnitModuleDefaultSettings);

	QUnit.test("Showing empty string instead of null in the case of display-format='NonNegative' and key '0'", function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'LanguageCode1' }",
			editable: false
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			var sValue = " (Titanium)",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl();

			// Act

			// Assert
			assert.equal(oInnerControl.getText(), sValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});

	QUnit.test("Showing empty string instead of null in the case of display-format='NonNegative' and key '0' fixed-list", function(assert) {
		var done = assert.async(),
			oSmartField;

		assert.expect(1);

		oSmartField = new SmartField({
			value: "{ path: 'LanguageCode3' }",
			editable: false
		});

		oSmartField.attachInitialise(function(oControlEvent) {
			var sValue = " (Titanium)",
				oSmartControl = oControlEvent.getSource(),
				oInnerControl = oSmartControl.getFirstInnerControl();

			// Act

			// Assert
			assert.equal(oInnerControl.getText(), sValue, "The formatted value is propagated to the inner control");
			done();
		});

		this.oVBox.addItem(oSmartField);
	});


	QUnit.start();
});

