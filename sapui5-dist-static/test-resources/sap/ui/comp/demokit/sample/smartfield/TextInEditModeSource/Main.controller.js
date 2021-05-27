sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function(Controller) {
	"use strict";
	return Controller.extend("sap.ui.comp.sample.smartfield.TextInEditModeSource.Main", {
		onInit: function() {

			//Bind the Projector (Product 1239102) to the Form
			this.byId("detail").bindElement({
				path: "/Products('001')",
				parameters: {
					// Necessary Parameter for TextInEditMode --> important Parameter for the NavigationProperty
					expand: "to_ProductCategories"
				}
			});

			//****************** displayed text *******************
			var oInformativeTextModel = new sap.ui.model.json.JSONModel({
				defaultConfig : "<p>TextInEditModeSource: default configuration </p>",
				customDataConfig : "<p>TextInEditModeSource: default configuration  <br> (descriptive text via ValueList from defaultTextInEditModeSource)</p>",
				noneConfig: "<p>TextInEditModeSource: <code style='font-weight: bold;padding-left: 5px;padding-right:5px'>None</code> <br> (no descriptive text)</p>",
				navPropConfig: "<p>TextInEditModeSource: <code style='font-weight: bold;padding-left: 5px;padding-right:5px'>NavigationProperty</code> <br> (descriptive text via Navigation Property)</p>",
				valueListConfig: "<p>TextInEditModeSource: <code style='font-weight: bold;padding-left: 5px;padding-right:5px'>ValueList</code> <br> (descriptive text via ValueList)</p>",
				valueListNoValidationConfig: "<p>TextInEditModeSource: <code style='font-weight: bold;padding-left: 5px;padding-right:5px'>ValueListNoValidation</code> <br> (if avaliable descriptive text via ValueListNoValidation)</p>"
			});
			this.getView().setModel(oInformativeTextModel,"InformativeText");
			//*****************************************************
		},
		onEditToggled: function() {
			// Transmit the changes made by the user --> triggered by an edit toggle
			this.getView().getModel().submitChanges();
		}
	});
});
