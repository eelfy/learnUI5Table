/*global QUnit */

sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/model/json/JSONModel",
	"sap/landvisz/library",
	"sap/landvisz/LandscapeEntity",
	"sap/landvisz/internal/ActionBar",
	"sap/landvisz/internal/DataContainer",
	"sap/landvisz/internal/LinearRowField"
], function(
	createAndAppendDiv,
	JSONModel,
	landviszLibrary,
	LandscapeEntity,
	ActionBar,
	DataContainer,
	LinearRowField
) {

	createAndAppendDiv("content");

	var LandscapeObject = landviszLibrary.LandscapeObject;
	var TechnicalSystemType = landviszLibrary.TechnicalSystemType;
	var EntityCSSSize = landviszLibrary.EntityCSSSize;
	var ModelingStatus = landviszLibrary.ModelingStatus;

	var myModel = {
		name : "J01",
		//tooltip : "Am a Overall tooltip",
		type : "TechnicalSystem",
		qualifierText : "ABAP",
		qualifierTooltip : "ABAP Server System",
		qualifierType : "Abap",
		id : "aminId",
		renderingSize : "Regular",
		defaultState : "NotSelected",
		description : "Am in Description",

		myHeaders: [ { header :"OverView",selected: false, properties:[{ label :"OS",value:"Windows"},
			 									  { label :"DB",value:"DB2"}
			 	]},

			 { header :"Product",selected: false,properties:  [{ label :"SAP ERP", value:"",iconType:"p",iconTitle:"Product"}]
			 },
			 { header :"ProductVersion",selected: true,properties:  [{ label :"SAP ERP 6.0",value:"",iconType:"pv",iconTitle:"ProductVersion"}]
			 }

		],
		actions: [{action: "Relations",icon: "http://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg"},{ action:"copy"},{ action: "paste", icon:"http://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg"}] ,
	};

	var oLandEntity = new LandscapeEntity({

		systemName : "{/name}",
		//tooltip : "{/tooltip}",
		type : LandscapeObject.TechnicalSystem,
		qualifierText : "{/qualifierText}",
		qualifierTooltip : "{/qualifierTooltip}",
		qualifierType : TechnicalSystemType.ABAP,
		id : "aminId",
		renderingSize : EntityCSSSize.Medium,
		visible : true,
		defaultState : "{/defaultState}",
		description : "{/description}",
		systemStatus : ModelingStatus.WARNING,
		showCustomActions: true,
		showEntityActions: true

	});
	var oModel = new JSONModel();
	oModel.setData(myModel);
	oLandEntity.setModel(oModel);

	var oDataContainer = new DataContainer({ header : "{header}",selected:"{selected}" });
	var oRowField = new LinearRowField({ label:"{label}",value:"{value}",iconTitle:"{iconTitle}",iconType:"{iconType}"});
	oDataContainer.bindAggregation("properties", {
		path: "properties",
		template: oRowField,
		templateShareable: false
	});
	oLandEntity.bindAggregation("dataContainers", {
		path: "/myHeaders",
		template: oDataContainer,
		templateShareable: false
	});
	var oActionBar =  new ActionBar({actionLabel: "{action}", iconSrc:"{icon}"});
	oLandEntity.bindAggregation("actionBar","/actions",oActionBar);

	oLandEntity.placeAt("content");

	// Tests Starts

	QUnit.module("ModellingStatusCreation");
	QUnit.test("ModellingStatusCreationOk", function(assert) {
		var oDomRef = document.getElementById("aminId-CLVEntityModelingStatus");
		assert.ok(oDomRef, "Modelling status icon exist in the page");
		assert.equal(false, (oLandEntity.getSystemStatus() === sap.landvisz.ModelingStatus.NORMAL), "errors or warnings reported");
		assert.equal(false, (oLandEntity.getSystemStatus() === sap.landvisz.ModelingStatus.ERROR), "System is erroneous");
		assert.equal(true, (oLandEntity.getSystemStatus() === sap.landvisz.ModelingStatus.WARNING), "Warning icon is not rendered");
	});

});