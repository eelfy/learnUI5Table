/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/OpaBuilder"
], function (
	Opa5,
	opaTest,
	Press,
	OpaBuilder
) {
	"use strict";

	var sFilterUnderTest = "String Auto";
	var sTextId = "filterResult";

	Opa5.extendConfig({
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: false,
		timeout: 15,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/FilterChange/applicationUnderTest/FilterChange.html"
					)
				);
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		actions: new Opa5({
			iOpenAdaptFiletrsDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.ui.comp.smartfilterbar.SmartFilterBar")
					.do(function(oFilterBar){
						oFilterBar.showAdaptFilterDialog();
					})
					.build());
			},
			iSelectFilter: function(sFilterLabel, bIsSelected){
				this.waitFor(
					new OpaBuilder()
						.hasId(/-selectMulti$/)
						.hasType("sap.m.CheckBox")
						.do(function(oCheckBox){
							var oParent = oCheckBox.getParent();
							if (oParent.isA("sap.m.CustomListItem")){
                                var oControl = oParent.getContent()[0].getItems()[0];
								if (oControl.isA("sap.m.Label") && oControl.getText() === sFilterLabel &&
                                    ((bIsSelected && !oCheckBox.getSelected()) ||
									(!bIsSelected && oCheckBox.getSelected()))) {
									new Press().executeOn(oCheckBox);
								}
							}
						})
						.build()
				);
			},
			iCloseAdaptFiltersDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.m.Button")
					.hasId(/adapt-filters-dialog-confirmBtn$/)
					.isDialogElement(true)
					.do(function(oButton){
						new Press().executeOn(oButton);
					})
					.build());
			},
			iPressTheGoButton: function(){
				this.waitFor(new OpaBuilder()
				.hasType("sap.ui.comp.smartfilterbar.SmartFilterBar")
				.isDialogElement(false)
				.do(function(oSmartFilterBar){
					new Press().executeOn(oSmartFilterBar._oSearchButton);
				})
				.build());
			}
		}),
		assertions: new Opa5({
			XXX: function (sValue, sErrorMessage) {
				return this.waitFor({
					id: "Name",
					success: function (oSmartField) {
						Opa5.assert.strictEqual(
							oSmartField.getValue(),
							sValue,
							sErrorMessage ? sErrorMessage : "SmartField value should match"
						);
					}
				});
			},
			iCheckAdaptFiltersCount: function(nCount){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					success: function (aSmartFilterBars) {
						var oSmartFilterBar = aSmartFilterBars[0];
						Opa5.assert.strictEqual(
							oSmartFilterBar._getFiltersWithValuesCount(),
							nCount,
							"Adapt Filters count should be " + nCount
						);
					}
				});
			},
			iCheckTextFieldContainsText: function(sId, sText){
				return this.waitFor({
					controlType: "sap.m.Text",
					id: sId,
					success: function(oControl){
						var sValue = oControl.getText();
						Opa5.assert.ok(sValue.indexOf(sText) > -1, "The backend request should contain value '" + sText + "'");
					}
				});
			},
			iCheckTextFieldDoesNotContainText: function(sId, sText){
				return this.waitFor({
					controlType: "sap.m.Text",
					id: sId,
					success: function(oControl){
						var sValue = oControl.getText();
						Opa5.assert.ok(sValue.indexOf(sText) === -1, "The backend request should not contain value '" + sText + "'");
					}
				});
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("SmartFilterBar and SmartVariantManagement are in correct state", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.waitFor({
			id: "smartFilterBar",
			success: function (oSmartFilterBar) {
				Opa5.assert.strictEqual(
					oSmartFilterBar.getControlByKey("STRING_AUTO").getTokens()[0].getText(),
					"Key 1 (1)",
					"I have a token with the correct textArrangement applied"
				);
			}
		});

		Then.waitFor({
			id: "smartvariant",
			success: function (oSmartVariant) {
				Opa5.assert.strictEqual(
					oSmartVariant.currentVariantGetModified(),
					false,
					"Current Smart Variant is not marked as dirty"
				);
			}
		});

		Then.waitFor({
			id: "filterChangeEventLog",
			success: function (oList) {
				var aExpectedEvents = [
						"filterChange Event fired",
						"SmartFilterBar.clear();",
						"filterChange Event fired",
						"setUiState",
						"Synchronous call to currentVariantSetModified(false);",
						"Backend request & response for VH data"
					],
					aEvents = oList.getItems().map(function (oItem) {
						return oItem.getTitle().trim();
					});

				Opa5.assert.strictEqual(
					aExpectedEvents.join(","),
					aEvents.join(","),
					"Expected number of events are fired at the expected order"
				);
			}
		});

		// Shutdown
		Given.iStopMyApp();
	});

	opaTest("SmartFilterBar visible filters not in the basic group are part of the search parameters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		Then.iCheckAdaptFiltersCount(1);

		When.iPressTheGoButton();
		Then.iCheckTextFieldContainsText(sTextId, "STRING_AUTO");

		Given.iStopMyApp();
	});

	opaTest("SmartFilterBar invisible filters with values not in the basic group are not part of the search parameters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		When.iOpenAdaptFiletrsDialog();
		When.iSelectFilter(sFilterUnderTest, false);
		When.iCloseAdaptFiltersDialog();

		Then.iCheckAdaptFiltersCount(0);

		When.iPressTheGoButton();
		Then.iCheckTextFieldDoesNotContainText(sTextId, "STRING_AUTO");

		Given.iStopMyApp();
	});



	QUnit.start();
});
