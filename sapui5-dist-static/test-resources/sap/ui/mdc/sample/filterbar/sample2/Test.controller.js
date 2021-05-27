sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/model/odata/v4/ODataModel", 'sap/ui/mdc/condition/ConditionModel', 'sap/ui/mdc/p13n/StateUtil'
], function(Controller, ODataModel, ConditionModel, StateUtil ) {
	"use strict";

	return Controller.extend("sap.ui.mdc.sample.filterbar.sample2.Test", {

		onInit: function() {

			var sResourceUrl;
			sResourceUrl = "i18n/i18n.properties";
			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oResourceModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "@i18n");

			this.getView().setModel(new ConditionModel(), "cm");

			var oFB = this.getView().byId("testFilterBar");
			sap.ui.getCore().getMessageManager().registerObject(oFB, true);
		},

		onSearch: function(oEvent) {
		},

		onFiltersChanged: function(oEvent) {
			var oText = this.getView().byId("statusText");
			if (oText) {
				oText.setText(oEvent.getParameters().filtersText);
			}

			this._updateFlexCodeEditor();
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
		},

		onGetExternalizedConditions: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				StateUtil.retrieveExternalState(oFB).then(function(mExtConditions) {
					var oOutput = this.getView().byId("getExternalizedConditionsId");
					if (oOutput) {
						oOutput.setValue(JSON.stringify(mExtConditions));
					}
				}.bind(this));
			}
		},


		_setExternalizedConditions: function(bClearModel) {

			var oInputJSON = null, oFB = this.getView().byId("testFilterBar");
			if (oFB) {

				var oInputput = this.getView().byId("setExternalizedConditionsId");
				if (oInputput) {
					oInputJSON = JSON.parse(oInputput.getValue());
				}

				if (oInputJSON) {
					StateUtil.applyExternalState(oFB, oInputJSON).then(function() {});
				}
			}

		},

		onSetExternalizedConditions: function(oEvent) {
			this._setExternalizedConditions(false);
		},

		onSetExternalizedConditionsClear: function(oEvent) {
			this._setExternalizedConditions(true);
		},

		onGetInternalConditions: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				var mInternalConditions = oFB.getConditions();
				var oOutput = this.getView().byId("getInternalConditionsId");
				if (oOutput) {
					oOutput.setValue(JSON.stringify(mInternalConditions));
				}
			}
		},

		onCopyPressed: function() {
			var oSrc = this.getView().byId("getExternalizedConditionsId");
			if (oSrc) {
				oSrc.getValue();

				var oTrg = this.getView().byId("setExternalizedConditionsId");
				if (oTrg) {
					oTrg.setValue(oSrc.getValue());
				}
			}
		},

		onGetFilters: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {
				var oFilters = oFB.getFilters();
				var oOutput = this.getView().byId("getFiltersId");
				if (oOutput) {
					oOutput.setValue(JSON.stringify(oFilters));
				}
			}
		},

		_setFormattedConditions: function(oCodeEditor) {
			if (oCodeEditor) {
				var sValue = oCodeEditor.getValue();
				if (sValue) {
					oCodeEditor.setValue(JSON.stringify(JSON.parse(sValue), null, "  "));
				}
			}
		},

		onGetExternalConditionsFormatted: function(oEvent) {
			var oFB = this.getView().byId("testFilterBar");
			if (oFB) {

				StateUtil.retrieveExternalState(oFB).then(function(mExtConditions) {
					var oOutput = this.getView().byId("getExternalizedConditionsId");
					if (oOutput) {
						oOutput.setValue(JSON.stringify(mExtConditions));
						this._setFormattedConditions(this.getView().byId("getExternalizedConditionsId"));
					}
				}.bind(this));

			}
		},

		onGetInternalConditionsFormatted: function(oEvent) {
			this.onGetInternalConditions(oEvent);
			this._setFormattedConditions(this.getView().byId("getInternalConditionsId"));
		},

		onGetFiltersFormatted: function(oEvent) {
			this.onGetFilters(oEvent);
			this._setFormattedConditions(this.getView().byId("getFiltersId"));
		},

		onGetChanges: function(oEvent) {

			var oInputJSON = null, oFB = this.getView().byId("testFilterBar");
			if (oFB) {

				var oInputput = this.getView().byId("getExternalizedConditionsId");
				if (oInputput) {
					oInputJSON = JSON.parse(oInputput.getValue());
				}

				var oState = {
					filter: oInputJSON
				};

				StateUtil.applyExternalState(oFB, oState).then(function(aChanges) {
					var aChangeContent = [];

					if (aChanges) {
						aChanges.forEach(function(oChange) {
							aChangeContent.push(oChange.changeSpecificData);
						});
					}

					var oOutputput = this.getView().byId("setExternalizedConditionsId");
					if (oOutputput) {
						oOutputput.setValue(JSON.stringify(aChangeContent, null, "  "));
					}
				}.bind(this));

			}
		},

		/*
		* This method will check the FlexControllerFactory instance cache to display the current amount of condition related FilterBar changes for the current session
		*/
		_updateFlexCodeEditor: function(){
			var bIsAdd;
			this.iAddChanges = this.iAddChanges ? this.iAddChanges : 0;
			this.iRemoveChanges = this.iRemoveChanges ? this.iRemoveChanges : 0;

			var iAddOld = this.iAddChanges;
			var iRemoveOld = this.iRemoveChanges;

			this.byId("flexCEAdd").setValue("");
			this.byId("flexCERemove").setValue("");

			sap.ui.fl.FlexControllerFactory._instanceCache["sap.ui.mdc.sample.filterbar.sample2.Component"]["1.0.0"]._oChangePersistence._mChanges.aChanges.forEach(function(oChange){
				this._aPreviousChanges = this._aPreviousChanges ? this._aPreviousChanges : [];
				if (this._aPreviousChanges.indexOf(oChange) < 0) {
					bIsAdd = oChange.getChangeType() === "addCondition" ? true : false;
					if (bIsAdd) {
						this.iAddChanges++;
					} else {
						this.iRemoveChanges++;
					}
					var sStringifiedChange = JSON.stringify(oChange.getContent(), null, '  ');
					this.byId(bIsAdd ? "flexCEAdd" : "flexCERemove").setValue(sStringifiedChange);
					this._aPreviousChanges.push(oChange);
				}
			}.bind(this));

			var sAddCount = "addCondition (" + this.iAddChanges + ")" + (iAddOld != this.iAddChanges ? " +1" : "");
			var sRemoveCount = "removeCondition (" + this.iRemoveChanges + ")" + (iRemoveOld != this.iRemoveChanges ? " +1" : "");

			this.byId("addCount").setText(sAddCount);
			this.byId("removeCount").setText(sRemoveCount);
		}

	});
}, true);
