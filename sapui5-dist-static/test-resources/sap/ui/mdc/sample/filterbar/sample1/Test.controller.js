sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/rta/api/startKeyUserAdaptation"
], function(Controller, startKeyUserAdaptation) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.filterbar.sample1.Test", {

		onInit: function() {

			var sResourceUrl;
			sResourceUrl = "i18n/i18n.properties";
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "@i18n");

			var oFB = this.getView().byId("testFilterBar");
			sap.ui.getCore().getMessageManager().registerObject(oFB, true);
		},

		onSearch: function(oEvent) {
		},

		onFiltersChanged: function(oEvent) {
			var oText = this.getView().byId("statusTextExpanded");
			if (oText) {
				oText.setText(oEvent.getParameters().filtersTextExpanded);
			}

			oText = this.getView().byId("statusTextCollapsed");
			if (oText) {
				oText.setText(oEvent.getParameters().filtersText);
			}
		},

		switchToAdaptionMode: function () {
			startKeyUserAdaptation({rootControl: this.getOwnerComponent()});
		},

		onChangeReqProperty: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				oFB.getPropertyInfoSet().some(function(oProperty) {
					if (oProperty.getName() === "Category") {
						oProperty.setRequired(!oProperty.getRequired());
						return true;
					}

					return false;
				});
			}
		},

		onChangeVisProperty: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				oFB.getPropertyInfoSet().some(function(oProperty) {
					if (oProperty.getName() === "Category") {
						oProperty.setVisible(!oProperty.getVisible());
						return true;
					}

					return false;
				});
			}
		}
	});
}, true);
