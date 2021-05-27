/*global QUnit, sinon*/

sap.ui.define([
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/comp/smartfield/flexibility/ODataV2Delegate"
],
function(
	XMLView,
	JsControlTreeModifier,
	ODataV2Delegate
) {
	"use strict";

	var sandbox = sinon.sandbox.create();

	var oMockedAppComponent = {
		getId: function () {
			return 'testcomponent';
		},
		createId : function(sId) {
			return 'testcomponent---' + sId;
		}
	};

	var aExpectedPropertyInfos = [
		{
		  "name": "Property01",
		  "bindingPath": "Property01",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property01-Label",
		  "tooltip": "EntityType01/Property01 Quickinfo (from annotation)",
		  "hideFromReveal": false
		},
		{
		  "name": "Property02",
		  "bindingPath": "Property02",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property02-Label (from annotation)",
		  "tooltip": "Entity1-Property02-QuickInfo",
		  "hideFromReveal": false
		},
		{
		  "name": "Property03",
		  "bindingPath": "Property03",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property03-Label",
		  "tooltip": undefined,
		  "hideFromReveal": false
		},
		{
		  "name": "Property04",
		  "bindingPath": "Property04",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property04-Label",
		  "tooltip": "Entity1-Property04-QuickInfo",
		  "hideFromReveal": false
		},
		{
		  "name": "Property05",
		  "bindingPath": "Property05",
		  "entityType": "EntityType01",
		  "label": "Entity1-Ignored Property",
		  "tooltip": "Entity1-Ignored Property QuickInfo",
		  "hideFromReveal": false
		},
		{
		  "name": "Property06",
		  "bindingPath": "Property06",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property06-Unbound",
		  "tooltip": "Unbound Property6",
		  "hideFromReveal": false
		},
		{
		  "name": "Property07",
		  "bindingPath": "Property07",
		  "entityType": "EntityType01",
		  "label": "Entity1-Property07-ignored-unbound",
		  "tooltip": "Unbound Property7",
		  "hideFromReveal": false
		},
		{
		  "name": "Property08",
		  "bindingPath": "Property08",
		  "entityType": "EntityType01",
		  "label": undefined,
		  "tooltip": "Property without sap:label",
		  "hideFromReveal": false
		},
		{
		  "name": "Property09",
		  "bindingPath": "Property09",
		  "entityType": "EntityType01",
		  "label": undefined,
		  "tooltip": "Property without sap:label and visible false",
		  "hideFromReveal": true
		},
		{
		  "name": "EntityType01_Complex",
		  "bindingPath": "EntityType01_Complex",
		  "entityType": "EntityType01",
		  "label": undefined,
		  "tooltip": undefined,
		  "hideFromReveal": false,
		  "properties": [
			{
			  "name": "ComplexProperty031",
			  "bindingPath": "EntityType01_Complex/ComplexProperty031",
			  "entityType": "EntityType01",
			  "label": "ComplexProperty 031",
			  "tooltip": "ComplexProperty 031-QuickInfo",
			  "hideFromReveal": false,
			  "referencedComplexPropertyName": "EntityType01_Complex"
			}
		  ]
		},
		{
			"name": "EntityType01_TechnicalInvisibleProperty",
			"bindingPath": "EntityType01_TechnicalInvisibleProperty",
			"entityType": "EntityType01",
			"label": "Technical Invisible Property by old Annotations only",
			"tooltip": undefined,
			"hideFromReveal": true
		},
		{
			"bindingPath": "EntityType01_TechnicalInvisibleProperty_uihidden",
			"entityType": "EntityType01",
			"label": "Technical Invisible Property by Annotations only",
			"name": "EntityType01_TechnicalInvisibleProperty_uihidden",
			"tooltip": undefined,
			"hideFromReveal": true
		},
		{
		  "name": "to_EntityType01Nav",
		  "entityType": "AdditionalElementsTest.EntityTypeNav",
		  "bindingPath": "to_EntityType01Nav",
		  "unsupported": true
		}
	  ];

	function _renderComplexView(scope) {
		return XMLView.create({
			id: "idMain1",
			viewName: "sap.ui.comp.test.flexibility.SmartFormGroup"
		}).then(function(oViewInstance) {
			scope.oView = oViewInstance;
			oViewInstance.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			return oViewInstance.getController().isDataReady();
		});
	}

	QUnit.module("Given a test view", {
		before : function() {
			return _renderComplexView(this);
		},
		afterEach: function() {
			sandbox.restore();
		},
		after : function () {
			this.oView.destroy();
		}
	});

	function checkPropertyInfos(assert, aPropertyInfos) {
		assert.strictEqual(aPropertyInfos.length, aExpectedPropertyInfos.length, "then all property infos are returned");
		assert.deepEqual(aPropertyInfos, aExpectedPropertyInfos, "then all property infos are cosistent");
	}

	QUnit.test("when getting the propertyInfo for element with binding context without delegate payload", function(assert) {
		var mPropertyBag = {
			element: this.oView.byId("someGroup"),
			aggregationName: "groupElements",
			payload: {}
		};
		return ODataV2Delegate.getPropertyInfo(mPropertyBag)
			.then(checkPropertyInfos.bind(this, assert));
	});

	QUnit.test("when  the propertyInfo for element with absolute list binding and without delegate payload", function(assert) {
		var mPropertyBag = {
			element: this.oView.byId("someList"),
			aggregationName: "items",
			payload: {}
		};
		return ODataV2Delegate.getPropertyInfo(mPropertyBag)
			.then(checkPropertyInfos.bind(this, assert));
	});

	QUnit.test("when calling 'createLabel' function", function(assert) {
		var mPropertyBag = {
			modifier: JsControlTreeModifier,
			appComponent: oMockedAppComponent,
			view: this.oView,
			labelFor: "TestFieldId"
		};
		return ODataV2Delegate.createLabel(mPropertyBag)
			.then(function (oLabel) {
				assert.ok(oLabel.isA("sap.ui.comp.smartfield.SmartLabel"), "then the created control is a 'sap.ui.comp.smartfield.SmartLabel'");
				assert.strictEqual(oLabel.getId(), mPropertyBag.labelFor + "-label", "then the created label is returned");
				assert.strictEqual(oLabel.getLabelFor(), mPropertyBag.labelFor, "then the labelFor property is set");
			});
	});

	QUnit.test("when calling 'createControlForProperty' function", function(assert) {
		var mPropertyBag = {
			modifier: JsControlTreeModifier,
			appComponent: oMockedAppComponent,
			view: this.oView,
			bindingPath: "Property01",
			fieldSelector: {
				id: "TestFieldId",
				idIsLocal: true
			}
		};
		return ODataV2Delegate.createControlForProperty(mPropertyBag)
			.then(function (mSpecificControlInfo) {
				assert.ok(mSpecificControlInfo.control.isA("sap.ui.comp.smartfield.SmartField"), "then the created control is a 'sap.ui.comp.smartfield.SmartField'");
				assert.strictEqual(mSpecificControlInfo.control.getId(), "testcomponent---TestFieldId", "then the created SmartField is returned");
			});
	});

	QUnit.start();

	QUnit.done(function () {
		jQuery("#qunit-fixture").hide();
	});
});
