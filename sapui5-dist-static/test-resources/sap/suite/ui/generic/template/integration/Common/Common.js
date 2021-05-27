sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/AggregationFilled",
		"sap/suite/ui/generic/template/integration/Common/OpaDataStore",
		"sap/suite/ui/generic/template/integration/testLibrary/utils/Common",
		"sap/ui/test/actions/EnterText"],
	function (Opa5, Press, PropertyStrictEquals, AggregationFilled, OpaDataStore, TestLibraryCommon, EnterText) {
		"use strict";

		var calculateAppParamsUrl = function (oAppParams, bStartInSandbox) {
			var sAppParamsUrl = "serverDelay=0&responderOn=true";
			if (oAppParams && typeof oAppParams === "object") {
				var keys = Object.keys(oAppParams);
				// for...of not used because IE doesn't support
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					switch (key) {
						case "bWithChange":
							sAppParamsUrl += (!bStartInSandbox && oAppParams[key] === true) ? "&sap-ui-xx-componentPreload=off" : "";
							break;
						case "sapUiLanguage":
							sAppParamsUrl += "&sap-ui-language=" + oAppParams[key];
							break;
						case "sapTheme":
							sAppParamsUrl += "&sap-theme=" + oAppParams[key];
							break;
						case "sapUiLayer":
							sAppParamsUrl += "&sap-ui-layer=" + oAppParams[key];
							break;
						case "sapKeepAlive":
							sAppParamsUrl += "&sap-keep-alive=" + oAppParams[key];
							break;
						default:
							sAppParamsUrl += "&" + key + "=" + oAppParams[key];
					}
				}
			}
			return sAppParamsUrl.indexOf("sap-ui-language") !== -1 ? sAppParamsUrl : sAppParamsUrl + "&sap-ui-language=en_US";
		};

		var createMatchers = function (oProperty) {
			var aMatchers = [];
			var aProperty = Object.keys(oProperty);
			for (var i = 0; i < aProperty.length; i++) {
				aMatchers.push(new PropertyStrictEquals({
					name: aProperty[i],
					value: oProperty[aProperty[i]]
				}));
			}
			return aMatchers;
		};

		var getTableControlType = function (sTableType) {
			var aTableTypes = ["responsiveTable", "analyticalTable", "gridTable", "treeTable"];
			var aTableControlTypes = ["sap.m.Table", "sap.ui.table.AnalyticalTable", "sap.ui.table.Table", "sap.ui.table.TreeTable"];
			var iIndex = aTableTypes.indexOf(sTableType);
			return ~iIndex ? {"controlType": aTableControlTypes[iIndex], "tableType": aTableTypes[iIndex]} : new Error("Table control not found for '" + sTableType + "'");
		};

		// {"controlId": [bVisible, bEnabled, sText]}
		var checkToolBarControlProperty = function (sControlType, sId, oProperty, self) {
			return self.waitFor({
				controlType: sControlType,
				id: new RegExp(sId + "$", "i"),
				matchers: new PropertyStrictEquals({
					name: "visible",
					value: true
				}),
				success: function (oControl) {
					oControl = Array.isArray(oControl) ? oControl[0] : oControl;
					var oToolbar = null;
					while (oControl && !oToolbar) {
						oToolbar = oControl.getToolbar ? oControl.getToolbar() : null;
						oControl = oControl.getParent();
					}
					var aToolbarContent = oToolbar && oToolbar.getAggregation("content");
					var aButton = Object.keys(oProperty);
					for (var i = 0; i < aButton.length; i++) {
						var toolbarButtonIdRegex = new RegExp(aButton[i] + "$", "i");
						var bFound = false;
						for (var j = 0; j < aToolbarContent.length; j++) {
							if (toolbarButtonIdRegex.test(aToolbarContent[j].getId())) {
								bFound = true;
								var aButtonProperty = oProperty[aButton[i]];
								if ((aToolbarContent[j].getVisible() !== aButtonProperty[0]) || (aToolbarContent[j].getEnabled && aToolbarContent[j].getEnabled() !== aButtonProperty[1]) || (aButtonProperty[2] && aButtonProperty[2] !== aToolbarContent[j].getText())) {
									Opa5.assert.notOk(true, "Toolbar Button: \"" + aButton[i] + "\" didn't match expectation for property: " + JSON.stringify(oProperty));
									return null;
								}
								break;
							}
						}
						if (!bFound) {
							Opa5.assert.notOk(true, "Toolbar Button: \"" + aButton[i] + "\" not found in toolbar");
							return null;
						}
					}
					Opa5.assert.ok(true, "Toolbar buttons visibility did match the expectation for " + JSON.stringify(oProperty));
					return  null;
				},
				errorMessage: "\"" + sControlType + "\" with id: \"" + "\" not found"
			});
		};

		var privateMethods = {
			calculateAppParamsUrl: calculateAppParamsUrl,
			testLibraryCommonMethods: new TestLibraryCommon(),
			getTableControlType: getTableControlType,
			getMatchers: createMatchers,
			iCheckToolBarControlProperty: checkToolBarControlProperty
		};

		return Opa5.extend("sap.suite.ui.generic.template.integration.Common.Common", {

			/**
			 * @param {String} sAppName - name of app or appname along with starting parameters
			 * Example: sAppName="SalesOrder-nondraft#SalesOrder-nondraft"
			 * @param {String} sManifestName - provide manifest name if you want to start your application with dynamic manifest
			 * @param {Object} oAppParams - In this object you can send multiple parameter such as if you want your app to load with change
			 * or in particular language or particular theme or with any dynamic key & value.
			 * Example: oAppParams={bWithChange: true, sapUiLanguage="DE", sapTheme="sap_belize"}
			 * @return {*} success or failure
			 */
			iStartMyAppInSandbox: function (sAppName, sManifestName, oAppParams) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html";
				sOpaFrame += oAppParams && oAppParams["bWithChange"] === true ? "?sap-ui-xx-componentPreload=off&flpApps=" + sAppName : "?flpApps=" + sAppName;
				var sOpaFrameUrlParameters = privateMethods.calculateAppParamsUrl(oAppParams, true);
				if (sManifestName) {
					sOpaFrame = sOpaFrame + (~sAppName.indexOf("?") ? "&" : "?") + sOpaFrameUrlParameters + "&manifest=" + sManifestName;
				} else {
					sOpaFrame = sOpaFrame + (~sAppName.indexOf("?") ? "&" : "?") + sOpaFrameUrlParameters;
				}
				console.log("OPA5::Common.js::iStartMyAppInSandbox" + " sOpaFrame: " + sOpaFrame);
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iStartMyAppInSandboxWithNoParams: function (sAppName) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html" + sAppName;
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			/**
			 * @param {String} sAppNameWithOrWithoutParams - name of app or appname along with starting parameters
			 * Example: sAppNameWithOrWithoutParams="sttasalesordernd" or "sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')"
			 * @param {String} sManifestName - provide manifest name if you want to start your application with dynamic manifest
			 * @param {Object} oAppParams - In this object you can send multiple parameter such as if you want your app to load with change
			 * or in particular language or particular theme or with any dynamic key & value.
			 * Example: oAppParams={bWithChange: true, sapUiLanguage="DE", sapTheme="sap_belize"}
			 * @param {object} oDimWidthHeight - provide the width and height if you want to start your application with diffrent iframe width and height  
			 * 	Example: oDimWidthHeight={width: "1500", height:"900"}
 			 * @return {*} success or failure
			 */
			iStartMyAppInDemokit: function (sAppNameWithOrWithoutParams, sManifestName, oAppParams, oDimWidthHeight) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html";
				var urlParams = privateMethods.calculateAppParamsUrl(oAppParams);
				var sOpaFrameUrlParameters = urlParams + "&demoApp=" + sAppNameWithOrWithoutParams;
				if (sManifestName) {
					sOpaFrame = sOpaFrame + "?manifest=" + sManifestName + "&" + sOpaFrameUrlParameters;
				} else {
					sOpaFrame = sOpaFrame + "?" + sOpaFrameUrlParameters;
				}
				console.log("OPA5::Common.js::iStartMyAppInDemokit" + " sOpaFrame: " + sOpaFrame);
				if (oDimWidthHeight && oDimWidthHeight.width && oDimWidthHeight.height) {
					return this.iStartMyAppInAFrame({
						source: sOpaFrame,
						width: oDimWidthHeight.width,
						height: oDimWidthHeight.height
					})
				} else {
				return this.iStartMyAppInAFrame(sOpaFrame);
				}
			},

			iTeardownMyApp: function () {
				console.log("OPA5::Common.js::iTeardownMyApp");
				if (OpaDataStore && Object.keys(OpaDataStore).length) {
					OpaDataStore.clearData();
				}
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function () {
				return this;
			},

			/**
			 *
			 * @param {string} viewId - view id on which scroll will be performed.
			 * @param {string} positionX - scroll position x
			 * @param {string} positionY - scroll position y
			 * @return {*} success or failure
			 */
			iScrollViewToPosition: function(viewId, positionX, positionY) {
				if (arguments.length < 3) {
					Opa5.assert.notOk(true, "viewId, positionX & positionY parameter is must");
					return null;
				}
				return this.waitFor({
					autoWait: false,
					id: new RegExp(viewId + "$"),
					success: function (oView) {
						oView[0].getContent()[0].getScrollDelegate().scrollTo(positionX, positionY);
						Opa5.assert.ok(true, "Window scrolled to position x: " +  positionX + ", y: " + positionY + " successfully");
					},
					errorMessage: "Window scroll failed"
				});
			},

			iClickTheControlWithId: function (sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					success: function (oControl) {
						new Press().executeOn(oControl[0]);
						Opa5.assert.ok(true, "The Control with id: \"" + sId + "\" was clicked successfully");
					},
					errorMessage: "The Control with id: \"" + sId + "\" could not be found"
				});
			},

			iClickTheControlByControlType: function (sControlType, oProperty) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "There must bbe 2 parameters");
					return null;
				}
				return this.waitFor({
					controlType: sControlType,
					matchers: privateMethods.getMatchers(oProperty),
					success: function (oControl) {
						new Press().executeOn(oControl[0]);
						Opa5.assert.ok(true, "The Control with type: \"" + sControlType + "\" was clicked successfully");
					},
					errorMessage: "The Control with type: \"" + sControlType + "\" could not be found"
				});
			},

			iClickOnButtonWithText: function (sBtnText) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sBtnText}),
					success: function (oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "The button with text: \"" + sBtnText + "\" was clicked successfully");
					},
					errorMessage: "The Button with text: \"" + sBtnText + "\" could not be found"
				});
			},

			iClickOnBtnWithIcon: function(sIcon) {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "icon": sIcon}),
					success: function (oButton) {
						new Press().executeOn(oButton[0]);
						Opa5.assert.ok(true, "Button with icon: \"" + sIcon + "\" was successfully clicked");
					},
					errorMessage: "Button with icon: \"" + sIcon + "\" not found or enabled"
				});
			},

			iClickOnASmartLink: function (sName) {
				return this.waitFor({
					controlType: "sap.ui.comp.navpopover.SmartLink",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sName}),
					success: function(oLink) {
						new Press().executeOn(oLink[0]);
						Opa5.assert.ok(true, "The Smart link with name: \"" + sName + "\" was clicked successfully");
					},
					errorMessage: "Smart link with name: '" + sName + "' is either not visible/enabled or not found"
				});
			},

			// Click on checkbox/radio having label as sText. Default control type is: "sap.m.CheckBox"
			iClickOnCheckboxWithText: function(sText, sId, bCheckBox) {
				var sControlType = (bCheckBox !== false) ? "sap.m.CheckBox" : "sap.m.RadioButton";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sText}),
					success: function(aControl) {
						aControl[0].setSelected(!aControl[0].getSelected());
						aControl[0].fireSelect({selected : aControl[0].getSelected()});
						Opa5.assert.ok(true, "Control type: \"" + sControlType + "\" with id: \"" + sId + "\" got selected with value: \"" + aControl[0].getSelected() + "\"");
					},
					errorMessage: "Failed to get control type: \"" + sControlType + "\" with id: \"" + sId + "\""
				});
			},

			// Check value on checkbox/radio button having label as sText. Default control type is: "sap.m.CheckBox"
			iCheckCheckboxSelectedValue: function(sText, sId, bSelected, bCheckBox) {
				bCheckBox = bCheckBox !== false;
				var sControlType = (bCheckBox !== false) ? "sap.m.CheckBox" : "sap.m.RadioButton";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true, "text": sText}),
					success: function(aControl) {
						var bActualValue = aControl[0].getSelected();
						Opa5.assert.equal(bActualValue, bSelected, "Control type: \"" + sControlType + "\" expected selected value is: \"" + bSelected + "\"");
					},
					errorMessage: "Failed to get control type: \"" + sControlType + "\" with id: \"" + sId + "\""
				});
			},

			/**
			 * Don't use setValue method to set value in field as in some cases it doesn't trigger OData property change
			 * @param {String} sValue - value to be set
			 * @param {String} sId - id of field
			 * @return {*} success or failure
			 */
			iEnterValueInField: function(sValue, sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					actions: [new EnterText({text: sValue})],
					success: function(aInputField) {
						Opa5.assert.equal(aInputField[0].getValue(), sValue, "The Field value should be: \"" + sValue + "\"");
					},
					errorMessage: "Field with id: '" + sId + "' is either not visible/enabled or not found"
				});
			},

			/**
			 * Check custom data value of any control
			 * @param {String} sControlType - UI5 control type
			 * @param {String} sId - id of control
			 * @param {Object} oCustomData - object with property name as custom data key and value as custom data value
			 * Example: {"presentationVariantQualifier": "Chart1", "chartQualifier": "Chart1"}
			 * @return {*} - success or failure
			 */
			iCheckCustomDataOfControl: function(sControlType, sId, oCustomData) {
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sId + "$"),
					success: function(aNodes) {
						var aCustomData = aNodes[0].getCustomData();
						var aCustomKeys = Object.keys(oCustomData);
						var iCount = 0;
						for (var i = 0; i < aCustomData.length; i++) {
							var sKey = aCustomData[i].getProperty("key");
							var iIndex = aCustomKeys.indexOf(sKey);
							if (iIndex !== -1) {
								iCount++;
								Opa5.assert.equal(aCustomData[i].getProperty("value"), oCustomData[aCustomKeys[iIndex]], "Custom key: \"" + sKey + "\" is set correctly");
							}
						}
						if (iCount !== aCustomKeys.length) {
							Opa5.assert.notOk(true, "Some custom data not found or not set for control: \"" + sControlType +"\"");
						}
					},
					errorMessage: "The SmartChart with Id containing 'tab2' could not be found "
				});
			},

			/**
			 * If control can be focused then it will set focus and test case succeeds
			 * @param {String} sId - id of control on which you want to set focus
			 * @return {*} success or failure
			 */
			iSetFocusOnControlWithId: function(sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					success: function(aInputField) {
						if (aInputField[0] && aInputField[0].focus) {
							aInputField[0].focus();
							Opa5.assert.ok(true, "The Smart Field value should be: \"" + sId + "\"");
							return null;
						}
						Opa5.assert.notOk(true, "Please send the correct focusable control id");
					},
					errorMessage: "Field with id: '" + sId + "' is either not visible/enabled or not found"
				});
			},

			/**
			 *
			 * @param {String} sComboboxId - sap.m.Select control id
			 * @param {Number} iNthItem - Item number to be selected
			 * @return {*} success or failure
			 */
			iSelectComboboxValue: function (sComboboxId, iNthItem) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "Expected number of arguments is 2");
					return null;
				}
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sComboboxId + "$"),
					success: function(oControl) {
						var aItems = oControl[0].getAggregation("items");
						if (aItems && aItems[iNthItem - 1]) {
							oControl[0].setSelectedItem(aItems[iNthItem - 1]);
							Opa5.assert.ok(true, "Items with text: \"" + aItems[iNthItem - 1].getText() + "\" got selected");
							return null;
						}
						Opa5.assert.notOk(true, "Items in a combobox is: \"" + aItems.length + "\" but tried to select item: \"" + iNthItem + "\"");
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			/**
			 * Check length & items of combobox
			 * @param {String} sComboboxId - id of combobox
			 * @param {Number} iLength - Number of items expected in combobox
			 * @param {Array} aValue - pass expected values of combobox
			 * @return {*} success or failure
			 */
			iCheckComboboxValues: function(sComboboxId, iLength, aValue) {
				if (arguments.length < 3) {
					Opa5.assert.notOk(true, "Expected number of arguments is 3");
					return null;
				}
				return this.waitFor({
					id: new RegExp(sComboboxId + "$"),
					success: function(oControl) {
						var aItems = oControl[0].getAggregation("items");
						Opa5.assert.equal(aItems.length, iLength, "Expected items in a combobox to be: \"" + iLength + "\"");
						for(var i = 0; i < aItems.length; i++) {
							Opa5.assert.equal(aItems[i].getText(), aValue[i], "Nth item in combobox expected to be: Item number: " + (i + 1) + ", Expected Value: \"" + aValue[i] + "\"");
						}
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			iCheckComboboxSelectedValue: function(sComboboxId, sSelectedValue) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "Expected number of arguments is 2");
					return null;
				}
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sComboboxId + "$"),
					success: function (oControl) {
						Opa5.assert.equal(oControl[0].getSelectedItem().getText(), sSelectedValue, "Expected selected value in combobox is: \"" + sSelectedValue + "\"");
					},
					errorMessage: "Combobox with id: \"" + sComboboxId + "\" not found"
				});
			},

			/**
			* Check if intended value is present in the DropDown menu
			* @param {String} sSelectDropDownId - id of DropDown menu
			* @param {String} sValue - Value to be searched in DropDown menu
			* @param {Boolean} bPresent - pass true/false to check if sValue should be present or not
			* @return {*} success or failure
			*/
			iCheckTheItemPresentIntheSelectDropDown: function(sSelectDropDownId, sValue, bPresent) {
				return this.waitFor({
					controlType: "sap.m.Select",
					id: new RegExp(sSelectDropDownId + "$"),
					success: function (oControl) {
						for(var i = 0; i < oControl[0].getItems().length; i++){
							var bFound = false;
							if(oControl[0].getItems()[i].getText() === sValue){
								bFound = true;
								break;
							}
						}
						if(bPresent){
							Opa5.assert.ok(bFound, sValue + " is present in the dropdown");
						}
						else{
							Opa5.assert.ok(!bFound, sValue + " is not present in the dropdown");
						}
					},
					errorMessage: "DropDown with id: \"" + sSelectDropDownId + "\" not found"
				});
			},

			theMessagePageShouldBeOpened: function() {
				return this.waitFor({
					controlType: "sap.m.MessagePage",
					autoWait: true,
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function() {
						Opa5.assert.ok(true, "The Message Page has been reached");
					},
					errorMessage: "Message Page not found "
				});
			},

			/**
			 *
			 * @param {String} sSectionText - section name for which grouped section need to be checked
			 * @param {Array} aGroupedSubSectionText - Array of sub-section name to be checked
			 * @param {Number} iNthOP - Nth OP on which selection need to be done
			 * @return {*} -Success or failure
			 */
			iCheckSubsectionNameGroupedUnderSection: function(sSectionText, aGroupedSubSectionText, iNthOP) {
				iNthOP = iNthOP ? iNthOP - 1 : 0;
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(oControl) {
						if (oControl && oControl.length < iNthOP + 1) {
							Opa5.assert.notOk(true, "Trying to access to \"" + (iNthOP + 1) + "\" OP not permissible as max available OP is: \"" + oControl.length + "\"");
							return null;
						}
						var aSection = oControl[iNthOP].getSections();
						var iCount = 0;
						for (var i = 0; i < aSection.length; i++) {
							var sTitle = aSection[i].getTitle();
							if (aSection[i].getVisible() && sTitle === sSectionText) {
								var aSubSection = aSection[i].getSubSections();
								for (var j = 0; j < aSubSection.length; j++) {
									if (aSubSection[j].getVisible() && aGroupedSubSectionText.indexOf(aSubSection[j].getTitle()) !== -1) {
										iCount++;
									}
								}
								if (iCount === aGroupedSubSectionText.length) {
									Opa5.assert.ok(true, "Section: \"" + sSectionText + "\" found with proper grouped subsection: " + JSON.stringify(aGroupedSubSectionText));
									return null;
								}
								iCount = 0;
							}
						}
						Opa5.assert.notOk(true, "Section: \"" + sSectionText + "\" not found with proper grouped subsection: " + JSON.stringify(aGroupedSubSectionText));
					},
					errorMessage: "The Object Page Layout couldn't be found on the page or is not visible"
				});
			},

			/**
			 * Pass OP/LR XMLView entity set name to check if page is loaded or not.
			 * @param {string} sComponentName - Name of component (ListReport, ObjectPage)
			 * @param {string} sEntitySet - Entity Set name to which OP/LR is bound
			 * @return {*} success or failure
			 */
			iWaitForThePageToLoad: function(sComponentName, sEntitySet) {
				if (!sEntitySet || !sComponentName) {
					Opa5.assert.notOk(true, "Entity set name and component name must be provided");
					return null;
				}
				var aValidComponent = ["ListReport", "ObjectPage"];
				var iIndex = aValidComponent.indexOf(sComponentName);
				if (iIndex === -1) {
					Opa5.assert.notOk(true, "Please provide the valid component name (ListReport/ObjectPage)");
					return null;
				}
				var sId = iIndex === 0 ? "view.ListReport::" + sEntitySet : "view.Details::" + sEntitySet;
				return this.waitFor({
					controlType: "sap.ui.core.mvc.XMLView",
					id: new RegExp(sId + "$"),
					autoWait: false,
					matchers: function (oView) {
						oView = Array.isArray(oView) ? oView[0] : oView;
						var oComponentContainer = oView.getParent().getComponentContainer();
						var oAppComponent = oComponentContainer.getParent();
						return !oAppComponent.getBusy();
					},
					success: function() {
						Opa5.assert.ok(true, "The '" + sComponentName + "' is loaded");
					},
					errorMessage: "XML view for '" + sComponentName + "' not found"
				});
			},

			// check OP is bound to which entity set
			iCheckObjectPageEntitySet: function (sEntitySet) {
				var sId = sEntitySet ? "view.Details::" + sEntitySet + "--objectPage" : "--objectPage";
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					id: new RegExp(sId + "$"),
					autoWait: true,
					success: function(oControl) {
						var sControlPath = oControl[0].getBindingContext().getPath();
						var sOPEntitySet = sControlPath.substring(1, sControlPath.indexOf("("));
						Opa5.assert.equal(sOPEntitySet, sEntitySet, "Object Page is bound to entitySet: \"" + sOPEntitySet + "\"");
					},
					errorMessage: "The Object Page does not have the correct entity set bound"
				});
			},

			theSmartTableIsVisible: function(sId) {
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function() {
						Opa5.assert.ok(true, "The Smart Table with id: \"" + sId + "\" is visible on the screen");
					},
					errorMessage: "The Smart Table couldn´t be found on the page"
				});
			},

			// click an item in the responsive table - will navigate to Object Page
			iClickTheItemInResponsiveTable: function (iIndex, tab, sId) {
				var sMultiViewId = tab ? "responsiveTable-" + tab : "responsiveTable";
				sId = sId ? sId : sMultiViewId;
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function (oControl) {
						var oItem = oControl.getItems()[iIndex];
						OpaDataStore.setData("tableItems", oControl.getItems());
						OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
						OpaDataStore.setData("selectedItem", oItem);
						oControl.fireItemPress({
							listItem: oItem
						});
					},
					success: function() {
						Opa5.assert.ok(true, "sap.m.Table row index: \"" + iIndex + "\" clicked successfully");
					},
					errorMessage: "sap.m.Table is not rendered correctly"
				});
			},

			// This method is only applicable for UI table
			iNavigateFromLRToOPUsingTable: function(iRow) {
				return this.waitFor({
					controlType: "sap.ui.table.RowAction",
					success: function(aRows) {
						aRows[iRow - 1].getItems()[0].firePress();
						Opa5.assert.ok(true, "Row clicked successfully");

					},
					errorMessage: "Items not loaded."
				});
			},

			iShouldSeeNoSupportAssistantErrors: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.noRuleFailures({
							failOnHighIssues: false,
							rules: [{
								libName: "sap.ui.core",
								ruleId: "libraryUsage"
							}],
							executionScope: {
								type: 'components',
								selectors: [
									"__component0"
								]
							}
						});
					}
				});
			},

			iShouldGetSupportRuleReport: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.getFinalReport();
					}
				});
			},

			/**
			 *
			 * @param {boolean} bCheckAvailableAction - true, if you want to check available action. false if you want to check for
			 * unavailable actions.
			 * @param {Array} aAction - Array of action name. Pass available action name if bCheckAvailableAction is true,
			 * else pass unavailable actions list.
			 * @param {String} sId - Id of related app sheet if more than once is visible at a time.
			 * @return {*} - success or failure
			 */
			iCheckRelatedAppsSheetList: function(bCheckAvailableAction, aAction, sId) {
				sId = sId ? sId : "realtedAppsSheet";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					autoWait: false,
					success: function(oRelatedApps) {
						var aRelatedAppButton = oRelatedApps[0].getButtons();
						for (var i = 0; i < aAction.length; i++) {
							for (var j = 0; j < aRelatedAppButton.length; j++) {
								var sButtonText = aRelatedAppButton[j].getText();
								if (!bCheckAvailableAction && (sButtonText === aAction[i])) {
									Opa5.assert.notOk(true, "\"" + aAction[i] + "\" found in related app sheet list but it shouldn't be available");
									return null;
								} else if (bCheckAvailableAction) {
									if (sButtonText === aAction[i]) {
										break;
									} else if (j === aRelatedAppButton.length - 1) {
										Opa5.assert.notOk(true, "\"" + aAction[i] + "\" not found in related app sheet list");
										return null;
									}
								} else if (i === aAction.length - 1 && j === aRelatedAppButton.length - 1) {
									Opa5.assert.ok(true, "Related app sheet list not available as expected");
									return null;
								}
							}
						}
						Opa5.assert.ok(true, "Related app sheet list found as expected");
					},
					errorMessage: "The Related Apps Sheet control not found"
				});
			},

			/**
			 * To search in search input field, sId is must. By default it will search in table toolbar.
			 * @param {string} sSearchText - text to search
			 * @param {string} sId - id of table toolbar search or search input field
			 * @return {*}
			 */
			iSearchInTableToolbarOrSearchInputField: function (sSearchText, sId) {
				sId = sId ? sId : "Table::Toolbar::SearchField";
				return this.waitFor({
					controlType: "sap.m.SearchField",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "enabled": true}),
					actions: function (oControl) {
						oControl.setValue(sSearchText);
						oControl.fireSearch();
						Opa5.assert.ok(true, "Table has search field in toolbar");
					},
					errorMessage: "Search field not found, check for visibility or enablement of search field"
				});
			},

			/**
			 * @param {Object} oProperty - Pass table property ak key value pair in object form
			 * @param {string} sTableType - pass table type. Default is "responsiveTable"
			 * @param {string} sId - table id
			 * @return {*} success or failure
			 */
			iCheckTableProperties: function(oProperty, sTableType, sId) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers(oProperty),
					success: function() {
						Opa5.assert.ok(true, "Table control type: '" + oTableProp["controlType"] + "' found with property: '" + JSON.stringify(oProperty) + "'");
					},
					errorMessage: "Table control type: '" + oTableProp["controlType"] + "' not found with visibility: '" + JSON.stringify(oProperty) + "'"
				});
			},

			/**
			 * @param {string} sColumnName - name of column
			 * @param {boolean} bVisibility - Pass true/false to check table visibility
			 * @param {string} sTableType - pass table type. Default is "responsiveTable"
			 * @param {string} sId - table id
			 * @return {*} success or failure
			 */
			iCheckTableColumnVisibility: function(sColumnName, bVisibility, sTableType, sId) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (table){
						var oTable = Array.isArray(table) ? table[0] : table;
						var aColumns = oTable.getAggregation("columns");
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].getLabel().getText() === sColumnName && aColumns[i].getLabel().getVisible() === bVisibility){
								Opa5.assert.ok(true, "Column: '" + sColumnName +  "' visibility '" + bVisibility + "' found as expected");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Column: '" + sColumnName +  "' visibility '" + bVisibility + "' not found as expected");
					},
					errorMessage: "The custom column is not found or table not found"
				});
			},

			/*
			 * @param oButton - provide a list of button whose visible and enable property you want to check.
			 * Structure of oButton: {"key1": [bVisible, bEnabled, sText], "key2": [bVisible, bEnabled, sText]}
			 * key1 & key2 is the last part of button id which uniquely identifies that button.
			 * it is case insensitive.
			 * To check visibility on table different than responsive, you must need to pass table type.
			 * Possible values are: sTableType="responsiveTable" or "analyticalTable" or "gridTable" or "treeTable"
			 * @param sId - Full id of sap.m.Table
			 */
			iCheckTableToolbarControlProperty: function (oButton, sId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return privateMethods.iCheckToolBarControlProperty(oTableProp["controlType"], sId, oButton, this);
			},

			iCheckChartToolbarControlProperty: function (oButton, sId, sControlType) {
				if (arguments.length < 2) {
					Opa5.assert.notOk(true, "Atleast 2 parameters are expected");
					return null;
				}
				sControlType = sControlType ? sControlType : "sap.ui.comp.smartchart.SmartChart";
				return privateMethods.iCheckToolBarControlProperty(sControlType, sId, oButton, this);
			},

			// Check number of items in table
			iCheckNumberOfItemsInTable: function (iItems, sId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sId = sId ? sId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sId + "$", "i"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (aTable){
						Opa5.assert.equal(aTable[0].getItems().length, iItems, "Expected number of items in table with id: \"" + sId + "\" to be: \"" + iItems + "\"");
					},
					errorMessage: "Table with id: \"" + sId + "\" and control type: \"" + oTableProp["controlType"] + "\" not found"
				});
			},

			/**
			 * Only applicable for responsive table. For multi view pass sId
			 * @param {String} sStatus - status
			 * @param {String} sId - id of responsive table
			 * @return {*} - success or failure
			 */
			iSelectAnItemOnLRTableWithStatus: function (sStatus, sId) {
				sId = sId ? sId : "responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function (oTable) {
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aItems = oTable.getItems(), oModel = aItems[0].getModel();
						var iIndex;
						for (var i = 0; i < aItems.length; i++) {
							var oEntity = oModel.getProperty(aItems[i].getBindingContext().getPath());
							if (sStatus === "Draft" && !oEntity.IsActiveEntity) {
								iIndex = i;
								break;
							} else if (oEntity.HasDraftEntity) {
								var sLockedBy = oModel.getProperty("/" + oEntity.DraftAdministrativeData.__ref).InProcessByUserDescription;
								if ((sStatus === "Unsaved Changes" && sLockedBy === "") || (sStatus === "Locked" && sLockedBy !== "")) {
									iIndex = i;
									break;
								}
							}
						}
						if (iIndex !== undefined) {
							oTable.setSelectedItem(aItems[iIndex]);
							oTable.fireSelectionChange({
								listItems: oTable.getSelectedItems(),
								selected: true
							});
						}
					},
					success: function() {
						Opa5.assert.ok(true, "Item with status: \"" + sStatus + "\" found and selected on table with id: \"" + sId + "\"");
					},
					errorMessage: "Table with id: \"" + sId + "\" not found"
				});
			},

			/*
			 * Checks P13nDialog title and using bEnabled we can check whether dialog is
			 * intractable or not.
			 */
			iCheckSmartTableViewSettingsDialogProperty: function (sDialogTitle, bEnabled) {
				bEnabled = bEnabled ? bEnabled : true;
				return this.waitFor({
					controlType: "sap.m.P13nDialog",
					matchers: privateMethods.getMatchers({"visible": true, "enabled": bEnabled, "title": sDialogTitle}),
					success: function () {
						Opa5.assert.ok(true, "Smart table P13nDialog setting dialog has title: \"" + sDialogTitle + "\"");
					},
					errorMessage: "Sorting Dialog not opened with a title."
				});
			},

			/**
			 * Check the group header title on table
			 * @param {String} sGroupHeaderText - Group header text
			 * @param {Number} iCheckNthHeader - Nth group header to match (staring from 1)
			 * @param {String} sTableId - partial/full table id
			 * @param {String} sTableType - table type like gridTable, treeTable (Default is responsiveTable)
			 * @return {*} success or failure
			 */
			iCheckGroupHeaderTitleOnTable: function(sGroupHeaderText, iCheckNthHeader, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems = aTable[0].getItems();
						var iCount = iCheckNthHeader;
						for(var i = 0; i < aItems.length; i++) {
							var bGroupHeader = aItems[i].isGroupHeader();
							if (bGroupHeader) {
								if (iCount > 1) {
									iCount--;
								} else if (iCount === 1 && aItems[i].getTitle().startsWith(sGroupHeaderText)) {
									Opa5.assert.ok(true, "The Group Header with title: \"" + sGroupHeaderText + "\" found on header number: \"" + iCheckNthHeader + "\"");
									return null;
								} else {
									break;
								}
							}
						}
						Opa5.assert.notOk(true, "The Group Header with title: \"" + sGroupHeaderText + "\" not found on header number: \"" + iCheckNthHeader + "\"");
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},
			/**
			 * Enter the value into the cells in Nth row of the table which is in edit mode
			 * @param {Number} iNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCells - Array of cell number to which the value to be entered for iNthRow
			 * @param {Array} aCellTexts - Array of text to be entered corresponding to aCells in row iNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iEnterValuesInCellsOnNthRowOfTable: function(iNthRow, aCells, aCellTexts, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "keyboardMode": "Edit"}),
					success: function(aTable) {
						var aItems = aTable[0].getItems();
						var oNthRow = aItems && aItems[iNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCells.length; i++) {
							var bFlag = false;
							var oTableCell = aTableCells[aCells[i] - 1];
							if (oTableCell.getEdit().getEditable()) {
								oTableCell.getEdit().setValue(aCellTexts[i]);
								bFlag = true;
							}
							Opa5.assert.ok(bFlag, "The value on row number: \"" + iNthRow + "\" and cell number: \"" + aCells[i] + "\" is set to \"" + aCellTexts[i] + "\"");
						}
						return null;
					},
					errorMessage: "Editable table with type \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCheckNthColumn - Array of column number to be checked for iCheckNthRow
			 * @param {Array} aColumnText - Array of text corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckRenderedColumnTextOnNthRowOfTable: function(iCheckNthRow, aCheckNthColumn, aColumnText, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems = aTable[0].getItems();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCheckNthColumn.length; i++) {
							var sActualValue = null;
							var oTableCell = aTableCells[aCheckNthColumn[i] - 1];
							if (oTableCell.getTitle) {
								sActualValue = oTableCell.getTitle();
							} else if (oTableCell.getText) {
								sActualValue = oTableCell.getText();
							} else if (oTableCell.getItems) {
								sActualValue = oTableCell.getItems()[0].getTitle();
							} else if (oTableCell.getDisplay && oTableCell.getDisplay().getText) {
								sActualValue = oTableCell.getAggregation("display").getText();
							} else {
								sActualValue = "";
								for (var j = 0; j < oTableCell.getDisplay().getItems().length; j++) {
									sActualValue += oTableCell.getDisplay().getItems()[j].getText();
								}
							}
							Opa5.assert.equal(sActualValue, aColumnText[i], "Expected value on row number: \"" + iCheckNthRow + "\" and column number: \"" + aCheckNthColumn[i] + "\" is \"" + aColumnText[i] + "\"");
						}
						return null;
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/**
			 *
			 * @param {Number} iCheckNthRow - Nth row number of table(starting from 1)
			 * @param {Array} aCheckNthColumn - Array of column number to be checked for iCheckNthRow
			 * @param {Array} aColumnControlType - Array of control type corresponding to aCheckNthColumn in row iCheckNthRow
			 * @param {String} sTableId - table id
			 * @param {String} sTableType - table type
			 * @return {*} success or failure
			 */
			iCheckRenderedColumnControlTypeOnNthRowOfTable: function(iCheckNthRow, aCheckNthColumn, aColumnControlType, sTableId, sTableType) {
				var oTableProp = privateMethods.getTableControlType(sTableType || "responsiveTable");
				sTableId = sTableId ? sTableId : oTableProp["tableType"];
				return this.waitFor({
					controlType: oTableProp["controlType"],
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function(aTable) {
						var aItems = aTable[0].getItems();
						var oNthRow = aItems && aItems[iCheckNthRow - 1];
						if (oNthRow.isGroupHeader()) {
							Opa5.assert.notOk(true, "Row number: \"" + iCheckNthRow + "\" must not be a group header");
							return null;
						}
						var aTableCells = oNthRow.getCells();
						for(var i = 0; i < aCheckNthColumn.length; i++) {
							var sActualControlType = aTableCells[aCheckNthColumn[i] - 1].getMetadata().getElementName();
							Opa5.assert.equal(sActualControlType, aColumnControlType[i], "Expected control on column number: \"" + aCheckNthColumn[i] + "\" and row number: \"" + iCheckNthRow + "\" is \"" + aColumnControlType[i] + "\"");
						}
					},
					errorMessage: "Control type: \"" + oTableProp["controlType"] + "\" not found with id: \"" + sTableId + "\""
				});
			},

			/************* Smart Variant Methods Start *******************/


			/**
			 *
			 * @param {String} sVariantId - variant id
			 * @param {Boolean} bSmartVariant - pass true if you want to click on smart variant
			 * @return {*} success or failure
			 */
			iClickOnVariantById: function(sVariantId, bSmartVariant) {
				var sControlType = bSmartVariant ? "sap.ui.comp.smartvariants.SmartVariantManagement" : "sap.ui.comp.variants.VariantManagement";
				sVariantId = sVariantId ? sVariantId : "(listReport-variant|Table-variant|Chart-variant)";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						new Press().executeOn(aControl[0]);
						Opa5.assert.ok(true, "Click on " + (bSmartVariant ? "SmartVariant" : "Variant") + " successful");
					},
					errorMessage: "The " + (bSmartVariant ? "SmartVariant" : "Variant") + " not found on the screen for control type: \"" + sControlType + "\""
				});
			},

			/**
			 *
			 * @param {String} sVariantName - variant name to be selected
			 * @param {String} sVariantId - variant id on which selection need to be done
			 * @param {Boolean} bSmartVariant - pass true if you want selection on smart variant to be done
			 * @return {*} success or failure
			 */
			iSelectVariantByName: function(sVariantName, sVariantId, bSmartVariant) {
				var sControlType = bSmartVariant ? "sap.ui.comp.smartvariants.SmartVariantManagement" : "sap.ui.comp.variants.VariantManagement";
				sVariantId = sVariantId ? sVariantId : "(listReport-variant|Table-variant|Chart-variant)";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						var aVariant = aControl[0].oVariantList.getItems();
						for (var i = 0; i < aVariant.length; i++) {
							if (aVariant[i].getText() === sVariantName) {
								new Press().executeOn(aVariant[i]);
								Opa5.assert.ok(true, (bSmartVariant ? "SmartVariant Name: " : "Variant Name: ") + sVariantName + " found and selected for variant id: \"" + sVariantId + "\"");
								return null;
							}
						}
						Opa5.assert.notOk(true, (bSmartVariant ? "SmartVariant Name: " : "Variant Name: ") + sVariantName + " not found for of variant id: \"" + sVariantId + "\"");

					},
					errorMessage: "The " + (bSmartVariant ? "SmartVariant" : "Variant") + " not found on the screen for control type: \"" + sControlType + "\""
				});
			},

			/**
			 * @param {String} sExpectedVariantName - Provide the name of the expected Variant name to be checked
			 * @param {String} sVariantId - id of variant/smart variant based on bSmartVariant value
			 * @param {Boolean} bSmartVariant - pass true if you want to check variant name on smart variant control
			 * on the screen and you want to check for a particular table/chart
			 * @return {*} success or failure
			 */
			theCorrectSmartVariantIsSelected: function(sExpectedVariantName, sVariantId, bSmartVariant) {
				var sControlType = bSmartVariant ? "sap.ui.comp.smartvariants.SmartVariantManagement" : "sap.ui.comp.variants.VariantManagement";
				sVariantId = sVariantId ? sVariantId : "(listReport-variant|Table-variant|Chart-variant)";
				return this.waitFor({
					controlType: sControlType,
					id: new RegExp(sVariantId + "$"),
					success: function(aControl) {
						var sVariantName = aControl[0].getAggregation("dependents")[0].getAggregation("content")[0].getText();
						Opa5.assert.equal(sVariantName, sExpectedVariantName, "Expected selected " + (bSmartVariant ? "SmartVariant" : "Variant") + " to be \"" + sExpectedVariantName + "\"");
					},
					errorMessage: "The " + (bSmartVariant ? "SmartVariant" : "Variant") + " not found on the screen for control type: \"" + sControlType + "\""
				});
			},

			/************* Smart Variant Methods End *******************/


			/**
			 * One exception is that never pass visible property as false as Opa5 won't be able to check this
			 * @param {string} sId - full id of control or last part of control id
			 * @param {Object} oProperty - {"visible: true, "enabled": false}
			 * @return {*} success or failure
			 */
			iCheckControlPropertiesById: function (sId, oProperty) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers(oProperty),
					success: function() {
						Opa5.assert.ok(true, "Control Id: \"" + sId + "\" with property: " + JSON.stringify(oProperty) + " matched");
					},
					errorMessage: "Control Id: \"" + sId + "\" with property: " + JSON.stringify(oProperty) + " not found"
				});
			},

			/**
			 * One exception is that never pass visible property as false as Opa5 won't be able to check this
			 * @param {string} sControlType - full id of control or last part of control id
			 * @param {Object} oProperty - {"visible: true, "enabled": false}
			 * @return {*} success or failure
			 */
			iCheckControlPropertiesByControlType: function (sControlType, oProperty) {
				return this.waitFor({
					controlType: sControlType,
					matchers: privateMethods.getMatchers(oProperty),
					success: function() {
						Opa5.assert.ok(true, "Control Type: \"" + sControlType + "\" with property: " + JSON.stringify(oProperty) + " matched");
					},
					errorMessage: "Control Type: \"" + sControlType + "\" with property: " + JSON.stringify(oProperty) + " not found"
				});
			},

			/**
			 *
			 * @param {String} sPropOrMethodName - property name or any method of dynamic page
			 * @param {String/Boolean} sExpected - expected value of property or method
			 * @param {Boolean} bMethod - true, if first parameter sent is method name
			 * @return {*} success or failure
			 */
			iCheckDynamicPageProperty: function(sPropOrMethodName, sExpected, bMethod) {
				return this.waitFor({
					controlType: "sap.f.DynamicPage",
					id: new RegExp("page$"),
					success: function (aDynamicPage) {
						var sActualValue = bMethod ? eval("aDynamicPage[0]." + sPropOrMethodName + "()") : aDynamicPage[0].getProperty(sPropOrMethodName);
						Opa5.assert.equal(sActualValue, sExpected, "Current dynamic page property: '" + sPropOrMethodName + "' is '" + sActualValue + "'");
					},
					errorMessage: "The Dynamic Page is not set with correct Property Values"
				});
			},

			theCssClassesAndTablePropertiesAreCorrectlySet: function(sId) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						oTable = oTable[0];
						var oGridLayout = oTable.getParent();
						var oSubSection = oGridLayout.getParent().getParent();
						var oGridTable = oTable.getTable();

						Opa5.assert.equal(oGridLayout.hasStyleClass("sapSmartTemplatesObjectPageSubSectionGridExpand"),true, "The Correct Css Class is applied to GridLayout");
						Opa5.assert.equal(oSubSection.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer"),true, "The Correct Css Class is applied to SubSection");
						Opa5.assert.equal(oTable.getProperty("fitContainer"),true, "The fitContainer property is correctly applied");
						Opa5.assert.equal(oGridTable.hasStyleClass("sapUiSizeCondensed"),true, "The Correct Css Class is applied to Grid Table");
					},
					errorMessage: "The Css Classes Could not be verified"
				});
			},

			/*********** POPOVER METHODS *********/

			theSmLiQvPopoverOpensAndContainsExtraContent: function(sFieldGroupName) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					matchers: [
						function (oPopover) {
							var bResult = false;
							var oNavigationPopover = oPopover.getContent()[0];
							var oContent = oNavigationPopover && oNavigationPopover.getItems()[1];
							var aControls = oContent && oContent.getContent();
							for(var i = 0; i < aControls.length; i++){
								var oControl = aControls[i];
								oControl = oControl && oControl.getItems && oControl.getItems() && oControl.getItems()[0];
								var sControlName = oControl && oControl.getMetadata && oControl.getMetadata() && oControl.getMetadata()._sClassName;
								if (sControlName === "sap.ui.comp.smartform.SmartForm"){
									var aGroups = oControl && oControl.getGroups();
									var oGroup = aGroups[0];
									if (oGroup && oGroup.getTitle && oGroup.getTitle() === sFieldGroupName){
										bResult = true;
										break;
									}
								}
								if (sControlName === "sap.m.VBox" ){
									var vbox = oControl.getItems() && oControl.getItems()[0];
									var oLabel = vbox && vbox.getItems()[0];
									var sText = oLabel && oLabel.getHtmlText();
									if (sText && sText.indexOf(sFieldGroupName) > -1 ){
										bResult = true;
										break;
									}
								}
							}
							return bResult;
						}
					],
					success: function () {
						Opa5.assert.ok(true, "The SmLiQvPopover is opened with content");
					},
					errorMessage: "The SmLiQvPopover is not rendered correctly"
				});
			},

			iClickTheTitleAreaLinkOnTheSmLiQvPopover: function() {
				return this.waitFor({
					controlType: "sap.m.Popover",
					actions: function (oPopover) {
						var oNavigationPopover = oPopover.getContent()[0];
						var oContent = oNavigationPopover && oNavigationPopover.getItems()[1];
						var oTitle = oContent.byId("title");
						if (oTitle && oTitle.firePress) {
							oTitle.firePress();
						}
					},
					success: function() {
						Opa5.assert.ok(true, "The SmLiQvPopover title with link is clicked successfully");
					},
					errorMessage: "Couldn't click on a link in the SmLiQvPopover."
				});
			},

			/************ Message Popover Methods  Start **********/

			/**
			 * To add the messages to the message model in order to display in the message dialogs on the Object Page
			 * Message Popover (sap.m.MessagePopover) should be already present on the page
			 * @param {string} sMessageDialogType - Pass Either "sap.m.Dialog" or "sap.m.PopOver"
			 * @param {Object} oMessage - Array of objects containing the message details.
			 * Eg: {"msg": "Invalid price", "msgType": "Warning", "description": "Check whether the price is correct", "target": "/Price", "fullTarget": "/Price", "persistent": false}
			 * @return {*} success or failure
			 */
			iAddMessagesToMessageDialogOrPopOver: function (sMessageDialogType, oMessage) {
				var sControlType = sMessageDialogType === "sap.m.Dialog" ? "sap.m.Dialog" : "sap.uxap.ObjectPageLayout";
				return this.waitFor({
					//In case of Message dialog, ObjectPageLayout control is not accessible since it is not in focus
					controlType: sControlType,
					success: function (oControl) {
						// BindingContext is not available with Error Message dialog control. For Message dialog scenario, empty target property values are passed.
						var sTarget = sControlType === "sap.uxap.ObjectPageLayout" ? oControl[0].getBindingContext().getPath() : "";
						var oModel = oControl[0].getModel();
						var aMessages = [];
						for (var i = 0; i < oMessage.length; i++) {
							aMessages.push({
								message: oMessage[i].msg,
								type: oMessage[i].msgType,
								description: oMessage[i].description,
								target: sTarget + oMessage[i].target,
								fullTarget: sTarget + oMessage[i].fullTarget,
								persistent: oMessage[i].persistent,
								processor: oModel
							});
						}
						if (sMessageDialogType === "sap.m.Dialog") {
							this.waitFor({
								controlType: "sap.m.Dialog",
								success: function (oMessageDialog) {
									var oModelData = oMessageDialog[0].getModel("settings").getData();
									for (var i = 0; i < aMessages.length; i++) {
										oModelData.messages.push(new sap.ui.core.message.Message(aMessages[i]));
									}
									oMessageDialog[0].getModel("settings").setData(oModelData);
									Opa5.assert.ok(true, "Messages Successfully Added To MessageDialog");
								},
								errorMessage: "MessageDialog not found on page"
							});
						} else {
							this.waitFor({
								controlType: "sap.m.MessagePopover",
								success: function (oMessagePopover) {
									var aMsgs = [];
									for (var i = 0; i < aMessages.length; i++) {
										aMsgs.push(new sap.ui.core.message.Message(aMessages[i]));
									}
									oMessagePopover[0].oModels.msg.oMessageManager.removeAllMessages();
									oMessagePopover[0].oModels.msg.oMessageManager.addMessages(aMsgs);
									Opa5.assert.ok(true, "Messages Successfully Added To MessagePopover");
								},
								errorMessage: "MessagePopover not found on page"
							});
						}
					},
					errorMessage: "Control '" + sControlType + "' not found on the screen"
				});
			},

			/**
			 * This function closes or open popover if clicked. If already opened then it closes.
			 * @param {String} sId - id of message popover button
			 * @param {Number} iNthOP - index of OP like 1 if you want to click on 2nd OP popover if 2 popover are
			 * visible on different OP's.
			 * @return {*} success or failure
			 */
			iToggleMessagePopoverDialog: function (sId, iNthOP) {
				sId = sId ? sId : "showMessages";
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.Button",
					id: new RegExp(sId + "$"),
					success: function (oButton) {
						new Press().executeOn(oButton[iNthOP]);
						Opa5.assert.ok(true, "The button with id: \"" + sId + "\" was clicked successfully");
					},
					errorMessage: "MessagePopover button not found on page"
				});
			},

			iCloseMessagePopover: function (iNthOP) {
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.MessagePopover",
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function (oMessagePopover) {
						oMessagePopover[iNthOP].close();
						Opa5.assert.ok(true, "Message popover closed");
					},
					errorMessage: "MessagePopover not found on page"
				});
			},

			// Click on segmented button of popover by passing either "message-error", "message-all", "message-warning"
			iClickOnPopoverButton: function(sBtnType) {
				var sIcon = "sap-icon://" + sBtnType.toLowerCase();
				return this.iClickOnBtnWithIcon(sIcon);
			},

			/**
			 *
			 * @param {Number} position - position of message starting from 1
			 * @param {Number} iNthOP - if 2 popover is visible at same time(like in FCL) then pass 1 or 2
			 * @return {*} Success or failure
			 */
			iClickOnNthMessageInMessagePopover : function(position, iNthOP) {
				iNthOP = iNthOP ? iNthOP : 0;
				return this.waitFor({
					controlType: "sap.m.MessagePopover",
					matchers: new PropertyStrictEquals({
						name: "visible",
						value: true
					}),
					success: function (oMessagePopover) {
						var aItems = oMessagePopover[iNthOP].getAggregation("items");
						if (aItems && aItems.length) {
							if (aItems[position - 1] && aItems[position - 1].getActiveTitle()) {
								var title = aItems[position - 1].getTitle();
								privateMethods.testLibraryCommonMethods.iClickTheLinkWithLabel(title);
							} else {
								Opa5.assert.notOk(true, "Message not clickable");
							}
						}
					},
					errorMessage: "Message Popover not found on page or correct parameter not passed"
				});
			},

			// Check if button (that opens message popover) in overflow toolbar is visible and shows expected count
			iCheckMessageCountForMessagePopover: function(count, sId) {
				sId = sId ? sId : "showMessages";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true, "text": String(count)}),
					success: function () {
						Opa5.assert.ok(true, "Found control with count " + count + " and is visible");
					},
					errorMessage: "Couldn't find control with count " + count
				});
			},

			// Here sTableId is sap.m.Table id.
			// sMessageStripType & sMessageStripText is optional. Default value is provided.
			// If multiple message strip is present then messageStrip type will be array.
			iCheckMessageStripValueOnTable: function (sTableId, sMessageStripType, sMessageStripText) {
				return this.waitFor({
					controlType: "sap.m.MessageStrip",
					success: function (messageStrip) {
						sMessageStripType = sMessageStripType ? sMessageStripType : "Error";
						sMessageStripText = sMessageStripText ? sMessageStripText : "The table contains errors.";
						if(Array.isArray(messageStrip)) {
							for (var i = 0; i < messageStrip.length; i++) {
								var isCorrectMessageFound = messageStrip[i].getVisible() && messageStrip[i].getType() === sMessageStripType && messageStrip[i].getText() === sMessageStripText && (messageStrip[i].getParent().getId()).indexOf(sTableId) !== -1;
								if(isCorrectMessageFound) {
									Opa5.assert.ok(true, "Found Message Strip with correct value");
									return null;
								}
							}
						}
						Opa5.assert.notOk(true, "Message Strip or Message Strip with correct value not found");
					},
					errorMessage: "Couldn't find message strip"
				});
			},

			// Provide message tile to click on message list item
			iClickTheMessageListItem: function(sMessageTitle) {
				return this.waitFor({
					controlType: "sap.m.MessageListItem",
					matchers: privateMethods.getMatchers({"visible": true, "title": sMessageTitle, "type": "Navigation"}),
					success: function (oMessageItem) {
						new Press().executeOn(oMessageItem[0]);
						Opa5.assert.ok(true, "Message with title: \"" + sMessageTitle + "\"  clicked successfully");
					},
					errorMessage: "No message with title " + sMessageTitle + " is rendered or not clickable"
				});
			},

			// Check total number of message shown in transient message dialog
			iCheckMessageCountInTransientMessagesDialog: function(iNumberOfMessages, sId) {
				sId = sId ? sId : "messageDialog";
				return this.waitFor({
					controlType: "sap.m.Dialog",
					id: new RegExp(sId + "$"),
					success: function(oControl) {
						Opa5.assert.equal(oControl[0].getContent()[0].getAggregation("items").length, iNumberOfMessages, "Expected number of message in dialog is: \"" + iNumberOfMessages + "\"");
					},
					errorMessage: "The Transient Message Dialog is not rendered correctly"
				});
			},

			/**
			 * Check message detail in details page of message
			 * @param {String} sMessageTitle - message title in message detail page
			 * @param {String} sMessageDescription - message description
			 * @param {String} sMessageType - message type like error, warning, info
			 * @param {String} sId - id of message detail page
			 * @return {*} success or failure
			 */
			iCheckTheMessagePropertyInDetailedMessagesPage: function(sMessageTitle, sMessageDescription, sMessageType, sId) {
				sId = sId ? sId : "-detailsPage";
				return this.waitFor({
					controlType: "sap.m.Page",
					id: new RegExp(sId + "$"),
					success: function (oMessageDetailPage) {
						var aMessagePageContent = oMessageDetailPage[0].getAggregation("content");
						Opa5.assert.equal(aMessagePageContent[0].getText(), sMessageTitle, "The Message Title in Detailed Screen is rendered correctly");
						Opa5.assert.equal(aMessagePageContent[1].getText(), sMessageDescription, "The Message Description in Detailed Screen is rendered correctly");
						Opa5.assert.equal(aMessagePageContent[2].getSrc(), "sap-icon://message-" + sMessageType, "The Message Icon in Detailed Screen is rendered correctly");
					},
					errorMessage: "Detailed message page not found with id: \"" + sId + "\""
				});
			},

			/************ Message Popover Methods  End **********/

			/**
			 * Check the column is dispayed as a popin inside a table (sap.m.Table)
			 * @param {String} sColumnName - Coulmn name
			 * @param {Boolean} bVisibility - Pass true/false to check column visibility as a table popin
			 * @param {String} sId - full id or last part of the id of the table 
			 * @return {*} success or failure
			 */
			iCheckTheColumnDisplayedInTheTablePopin: function(sColumnName, bVisibility, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oTable){
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aColumns = oTable.getAggregation("columns");
						for (var i = 0; i < aColumns.length; i++) {
							if (aColumns[i].getHeader().getText() === sColumnName && aColumns[i].isPopin() === bVisibility) {
								Opa5.assert.ok(true, "Column '" + sColumnName +  "' is " + (bVisibility ? "displayed" : "not displayed") + " in popin as expected");
								return null;
							}
						}
						Opa5.assert.notOk(true, "Column '" + sColumnName +  "' is " + (bVisibility ? "displayed" : "not displayed") + " in popin not as expected");
					},
					errorMessage: "The column is not found or table not found"
				});
			},

			/**
			 * Check the current value of table property 'hiddenInPopin' which defines which columns 
			 * should be hidden instead of moved into the pop-in area depending on their importance
			 * @param {String} aImportances - Array of imporatnces of the column
			 * @param {String} sId - full id or last part of the id of the table 
			 * @return {*} success or failure
			 */
			iCheckTheCoulmnsHiddenInPoppinForTheTable: function (aImportances, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sId + "$"),
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oTable){
						oTable = Array.isArray(oTable) ? oTable[0] : oTable;
						var aHiddenInPopin = oTable.getHiddenInPopin();
						if (aImportances.length != aHiddenInPopin.length) {
							Opa5.assert.notOk(true, "The column importnaces set for HiddenInPopin property of sap.m.Table is not same as the passed importances");
							return null;
						}
						if (aImportances.length === 0) {
							Opa5.assert.ok(aHiddenInPopin.length === 0, "The HiddenInPopin property of sap.m.Table is not set to hide any columns");
							return null;
						}
						var bFound;
						for (var i = 0; i < aImportances.length; i++) {
							bFound = false;
							for (var j = 0; j < aHiddenInPopin.length; j++) {
								if (aImportances[i] === aHiddenInPopin[j]) {
									bFound = true;
									break;
								}
							}
							Opa5.assert.ok(bFound, "The HiddenInPopin property of sap.m.Table is set to hide columns with importance '" + aImportances[i] + "'");
						}
					},
					errorMessage: "The table not found on the page"
				});
			},

			/**
			* Check the control with given control type and id is currently not visible on the screen
			* This function will work if atleast one control is available on the UI with the given control type
			* @param {String} sControlType - Type of the control
			* @param {String} sId - id of the control
			* @param {Boolean} bVisibility - Check if the control is visible (true) or not visible (false).
			* @return {*} success or failure
			*/
			iCheckTheControlWithIdIsVisible: function (sControlType, sId, bVisibility) {
			 	return this.waitFor({
			 		controlType: sControlType,
			 		visible: false,
			 		success: function (aControl) {
			 			for (var i = 0; i < aControl.length; i++) {
			 			 	if ( aControl[i].getId() === sId && aControl[i].getVisible() === bVisibility) {
			 					Opa5.assert.ok(true, "'" + sControlType + "' Control with Id '" + sId + "'" + (bVisibility ? " is visible" : " is not visible") + " on the screen");
			 					return null;
			 				}
			 			}
			 			Opa5.assert.notOk(true, "'" + sControlType + "' Control with Id '" + sId + "'" + (bVisibility ? " is not visible" : " is visible") + " on the screen");
			 		},
			 		errorMessage: "Couldn't find any control with type '" + sControlType + "' on the screen"
			 	});
			},

			/**
			* Check for the message content in the message pop up or message pop over
			* @param {string} sDialogType - Type of the error message dialog - "sap.m.Popover" for Message Popover and "sap.m.Dialog" for Message Pop up
			* @param {Array} aMessages - Array of objects containing the message properies such as type, title, subtitle, description and groupName (In case of message pop over)
			* Eg: for sDialogType is "sap.m.Dialog", {"type":"Error", "title":"New error Message", "subTitle":"Error subtitle", "description": "This is the Description"}
			* for sDialogType is "sap.m.Popover", {"type":"Error", "title":"New error Message", "subTitle":"Error subtitle", "description": "This is the Description", "groupName": "General Information"}
			* @return {*} success or failure
			*/
			iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver: function (sDialogType, aMessages) {
				return this.waitFor({
					controlType: sDialogType,
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oDialog) {
						var aItems = oDialog[0].getContent()[0].getItems();
						for (var i = 0; i < aMessages.length; i++) {
							var bFlag = false;
							for (var j = 0; j < aItems.length; j++) {
								if (aItems[j].getType() === aMessages[i].type && 
									aItems[j].getTitle() === aMessages[i].title && 
									aItems[j].getSubtitle() === aMessages[i].subTitle && 
									aItems[j].getDescription() === aMessages[i].description) {
									switch (sDialogType) {
										case "sap.m.Dialog":
											bFlag = true;
											break;
										case "sap.m.Popover":
											if (aItems[j].getGroupName() === aMessages[i].groupName) {
												bFlag = true;
											}
											break;
										default:
											break;
									}
								}
							}
							sDialogType === "sap.m.Dialog" ? Opa5.assert.ok(bFlag, aMessages[i].type + " message with title '" + aMessages[i].title + "', subtitle '" + aMessages[i].subTitle + "' and description '" + aMessages[i].description + "' found on the message popup") : 
															Opa5.assert.ok(bFlag, aMessages[i].type + " message with title '" + aMessages[i].title + "', subtitle '" + aMessages[i].subTitle + "', and description '" + aMessages[i].description + "' found under the group '" + aMessages[i].groupName + "' on the message popover");
						}
					},
					errorMessage: "Couldn't find the message pop up / message pop over on the screen"
				});
			},

			/**
			* Check for the title of the message pop up dialog
			* @param {String} sTitle - Title of the message pop up dialog
			* @return {*} success or failure
			*/
			iShouldSeeTheMessagePopUpWithTitle: function (sTitle) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true}),
					success: function (oDialog) {
						var sActualTitle = oDialog[0].getCustomHeader().getContentMiddle()[0].getText();
						Opa5.assert.ok(sActualTitle === sTitle, "MessagePopUp with title '" + sTitle + "' found on the screen");
					},
					errorMessage: "Couldn't find the message pop up on the screen"
				});
			},
			
			/**
			* To check the title and the fields inside the Create Object Dialog
			* @param {object} sTitle - Title of the dialog
			* @param {Array} aFields - Array of Labels of the fields inside the dialog
			* @return {*} success or failure
			*/
			iCheckFieldsAndTitleOfCreateObjectDialog: function (sTitle, aFields) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var sActualTitle = oDialog[0].getContent()[0].getTitle();
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						Opa5.assert.ok(sActualTitle === sTitle, "Title of the Create Dialog is correct");
						for (var i = 0; i < aFields.length; i++) {
							var sField = aFields[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === sField) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "Field with label " + sField + " found on the Dialog");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},
			
			/**
			* To set the field values inside the Create Object Dialog
			* @param {object} oValue - Object containing the key (Label of the field) and value (value to be entered to the field)
			* Eg: {"Business Partner ID":"100000008", "ISO Currency Code":"EUR"}
			* @return {*} success or failure
			*/
			iSetTheFieldValuesInsideCreateObjectDialog: function (oValue) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						var keys = Object.keys(oValue);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === key) {
									aGroupElements[j].getFields()[0].setValue(oValue[key]);
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The value in the field " + key + " is successfully set");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},
			
			/**
			* To check the field values inside the Create Object Dialog
			* @param {object} oValue - Object containing the key (Label of the field) and value (value to be checked in the field)
			* Eg: {"Business Partner ID":"100000008", "ISO Currency Code":"EUR"}
			* @return {*} success or failure
			*/
			iCheckTheFieldValuesInsideCreateDialogIsCorrect: function (oValue) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({ "visible": true}),
					success: function (oDialog) {
						var aGroupElements = oDialog[0].getContent()[0].getGroups()[0].getGroupElements();
						var keys = Object.keys(oValue);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var bFlag = false;
							for (var j = 0; j < aGroupElements.length; j++) {
								if (aGroupElements[j].getLabelText() === key && aGroupElements[j].getFields()[0].getValue() === oValue[key]) {
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The value in the field " + key + " is found correctly");
						}
					},
					errorMessage: "Dialog is not visible"
				});
			},

			/**
			* To click the delete button against a particular row of a table (sap.m.Table) in case of inline delete
			* @param {Number} iNthRow - Nth row number of table (starting from 1)
			* @param {String} sTableId - Full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iClickDeleteButtonOnNthRowOfTable: function (iNthRow, sTableId) {
				sTableId = sTableId ? sTableId : "--responsiveTable";
				return this.waitFor({
					controlType: "sap.m.Table",
					id: new RegExp(sTableId + "$"),
					matchers: privateMethods.getMatchers({ "visible": true, "mode": "Delete"}),
					success: function (aTables) {
						var oDeleteControl = aTables[0].getItems()[iNthRow - 1].getDeleteControl();
						new Press().executeOn(oDeleteControl);
						Opa5.assert.ok(true, "Delete button on row number '" + iNthRow + "' clicked successfully");
					},
					errorMessage: "Table with inline delete is not found"
				})
			},
			
			/**
			* Check whether serviceUrl is set in the AddBookmarkButton during Save as tile operation
			* ServiceUrl is set to empty in case of static tile and ServiceUrl is populated with some value in case of dynamic tile
			* @param {Boolean} bValue True - ServiceUrl is set to some string, False - ServiceUrl is empty
			* @return {*} success or failure
			*/
			iCheckTheServiceUrlIsSetInTheAddBookmarkButton: function (bValue) {
				return this.waitFor({
					controlType: "sap.ushell.ui.footerbar.AddBookmarkButton",
					success: function (oButton) {
						if (bValue) {
							Opa5.assert.ok(oButton[0].getServiceUrl() !== "", "ServiceUrl is set to the AddBookmarkButton");
						} else {
							Opa5.assert.ok(oButton[0].getServiceUrl() === "", "ServiceUrl is not set to the AddBookmarkButton");
						}
					},
					errorMessage: "Couldn't find the AddBookmarkButton on the screen"
				});
			},

			/**
			* Check ExportToExcel Button is not available on the screen
 			* @return {*} success or failure
 			*/
 			iShouldNotSeeTheExportToExcelButton: function() {
				return this.waitFor({
					controlType: "sap.m.Button",
					success: function (aControl) {
						for (var i = 0; i < aControl.length; i++) {
							if (aControl[i].getIcon() === "sap-icon://excel-attachment" && aControl[i].getVisible() === true) {
								Opa5.assert.notOk(true, "Export to excel button is visible on the screen");
								return null;
							}
						}
						Opa5.assert.ok(true, "Export to excel button is not visible on the screen");
						return null;
					},
					errorMessage: "The page has an excel export button."
				});
			},

			/**
			* To check if the row used to navigate to OP/Sub-OP is highlighted in the table.
			* @param {Number} iRowIndex - index of the row used to navigate
			* @param {Boolean} bExpectedHighlight - determines whether the row should be highlighted
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iShouldSeeTheNavigatedRowHighlighted: function (iRowIndex, bExpectedHighlight, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						var bHighlighted = oTable[0].getItems()[iRowIndex].getNavigated();
						Opa5.assert.equal(bHighlighted, bExpectedHighlight, "The Row Item Highlight for the item at index: " + iRowIndex + " is " + bHighlighted + " which is correct");
					},
					errorMessage: "The table with id '" + sId + "' not found on the screen"
				});
			},

			/**
			* To expand a panel inside the Adapt filter dialog with the given label.
			* If the panel is already expanded, does nothing
			* @param {String} sLabel - Label of the Panel
			* @return {*} success or failure
			*/
			iExpandThePaneltInAdpatFilterDialog: function (sLabel) {
				return this.waitFor({
					controlType: "sap.m.Panel",
					searchOpenDialogs: true,
					success: function (aPanels) {
						for (var i = 0; i < aPanels.length; i++) {
							if (aPanels[i].getHeaderToolbar().getContent()[0].getText() === sLabel) {
								if (!aPanels[i].getExpanded()) {
									aPanels[i].setExpanded(true);
									Opa5.assert.ok(true, "The panel with label '" + sLabel + "' is set to expanded in the Adpat Filter Dialog");
									return null;
								}
								Opa5.assert.ok(true, "The panel with label '" + sLabel + "' is already set to expanded in the Adpat Filter Dialog");
								return null;
							}
						}
						Opa5.assert.notOk(true, "The panel with label '" + sLabel + "' is not found in the Adpat Filter Dialog");
						return null;
					},
					errorMessage: "Panels not found on the Dialog"
				});
			},

			/**
			* To uncheck the selected rows in the table based on Index.
			* @param {Array} aItemIndex - Array of Indices of the table rows to be deselected ex: ([0, 1])
			* @param {String} sId - full id or last part of the id of the table
			* @return {*} success or failure
			*/
			iDeselectItemsInTheTable: function (aItemIndex, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oTable) {
						var aTableItems = oTable.getItems();
						for (var i = 0; i < aItemIndex.length; i++) {
							oTable.setSelectedItem(aTableItems[aItemIndex[i]], false);
							oTable.fireSelectionChange({
								listItems: 	oTable.getSelectedItems(),
								selected: false
							});
						}
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* To check if the row with the given index is selected or deselected in the table.
			* @param {Array} aIndexSelection - Index,Selected are the key value pairs to be passed, ex: {Index:0,Selected:true}
			* @param {String} sId - full id or last part of the id of the table, if not passed, it will consider responsiveTable
			* @return {*} success or failure
			*/
			iCheckTheRowSelectionInTheTable: function(aIndexSelection, sId) {
				sId = sId ? sId : "--responsiveTable";
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oTable) {
						for (var i = 0; i < aIndexSelection.length; i++) {
							Opa5.assert.equal(oTable[0].getItems()[aIndexSelection[i].Index].getSelected(), aIndexSelection[i].Selected, 
							"The index: " + aIndexSelection[i].Index + " has Selection " + aIndexSelection[i].Selected + ".");
						}	
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			/**
			* To check The Multi Edit Dialog Title and Property Field Names
			* @param {String} sDialogTitle - The Title of the Mass Edit Dialog
			* @param {Array} aPropertyNames - Array of expected Property Names inside the Mass Edit Dialog
			* ex: ("Edit 2 Objects",["BusinessPartnerID", "CurrencyCode"])
			* @return {*} success or failure
			*/
			iVerifyTheMultiEditDialogAttributesAreCorrect: function (sDialogTitle, aPropertyNames) {
                return this.waitFor({
                    controlType: "sap.m.Dialog",
                    matchers: privateMethods.getMatchers({"title": sDialogTitle}),
                    success: function(oDialog) {
                        var bFlag;
                        var oDialogFields = oDialog[0].getContent()[0].getFields();
                        Opa5.assert.ok(true, "The multi edit dialog has correct Title");
                        Opa5.assert.equal(aPropertyNames.length, oDialogFields.length, "The multi edit dialog has correct number of property names");
                        for (var i = 0; i <= oDialogFields.length - 1; i++) {
                            bFlag = false;
                            if (aPropertyNames.indexOf(oDialogFields[i].getPropertyName()) > -1) {
                                bFlag = true;
                            }
                            Opa5.assert.ok(bFlag, "The multi edit dialog has correct property: " + oDialogFields[i].getPropertyName());
                        }
                    },
                    errorMessage: "The Dialog with title " + sDialogTitle + " is not rendered correctly"
                });
            },

			/**
			* To set the Propert Field values inside the Multi Edit Dialog
			* @param {Array} aFieldNameValuePair - Array of key value pairs containing the Choice to change the field, Property Name and the Value
			* ex: {Choice:"Replace",PropertyName:"BusinessPartnerID",Value:"100000011"}
			* @return {*} success or failure
			*/
			iSetSmartMultiEditField: function (aFieldNameValuePair) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: privateMethods.getMatchers({"visible": true}),
					actions: function(oDialog) {
						var oDialogFields = oDialog.getContent()[0].getFields();
						for (var i = 0; i < aFieldNameValuePair.length; i++) {
							var bFlag = false;
							for (var j = 0; j < oDialogFields.length; j++) {
								if (aFieldNameValuePair[i].PropertyName === oDialogFields[j].getPropertyName()) {
									switch (aFieldNameValuePair[i].Choice) {
										case "Keep":
											//Do Nothing
											break;
										case "Replace":
											oDialogFields[j].setSelectedIndex(1);
											oDialogFields[j].fireChange();
											oDialogFields[j].getSmartField().getInnerControls()[0].setValue(aFieldNameValuePair[i].Value);
											oDialogFields[j].getSmartField().getInnerControls()[0].fireChange();
											break;
										case "Index":
											oDialogFields[j].setSelectedIndex(aFieldNameValuePair[i].Value);
											oDialogFields[j].fireChange();
											break;
										case "Clear":
											oDialogFields[j].setSelectedIndex(2);
											oDialogFields[j].fireChange();
											break;
										default:
											break;
									}
									bFlag = true;
									break;
								}
							}
							Opa5.assert.ok(bFlag, "The field value " +aFieldNameValuePair[i].PropertyName+ " is successfully set");
						}
					},
					errorMessage: "The Smart Multi Edit Dialog is not rendered correctly."
				});
			},

			/**
			* To check the token values in the MultiInput fields
			* If the panel is already expanded, does nothing
			* @param {String} sId - Id of the field. Need to pass the last part of the id which is unique
			* @param {Array} aValues - Array of token values. Pass the empty array to check the field is empty.
			* @return {*} success or failure
			*/
			iCheckTheMultiInputFieldValues: function (sId, aValues) {
				return this.waitFor({
					id: new RegExp(sId + "$"),
					success: function (oControl) {
						if(oControl[0].getValue()!== ""){
							var sValue = oControl[0].getValue();
								Opa5.assert.ok(aValues[0] === sValue, "The value '" + aValues[0] + "' found in MultiInputfield with id '" + sId + "'");
					    }
						else {
							var aTokens = oControl[0].getTokens();
							if (aValues.length === 0) {
								Opa5.assert.equal(aTokens.length, 0, "The MultiInputfield with id '" + sId + "' is empty");
								return null;
							}
							for (var i = 0; i < aValues.length; i++) {
								var bFlag = false;
								for (var j = 0; j < aTokens.length; j++) {
									if (aValues[i] === aTokens[j].getText()) {
										bFlag = true;
										break;
									}
								}
								Opa5.assert.ok(bFlag, "The value '" + aValues[i] + "' found in MultiInputfield with id '" + sId + "'");
							}
						}
						return null;
					},
					errorMessage: "MultiInput control not found on the screen"
				});
			},

			/**
			* Check the title visibility of the Section or Subsection on the Object page with the given index
			* @param {int} iSectionIndex - Section index. If you want to check the Section title then pass only Section index
			* @param {int} iSubSectionIndex - Sub Section index. If you want to check the Sub Section title then pass Section index
			* (in which that sub Section exist) along with Sub Section index.
			* @param {Boolean} bVisibility - Pass true/false to check the title visibility
			* @param {int} iNthOP - Nth OP on which selection need to be done
			* Pass this parameter only if you are in FCL screen. If you want to do selection in 2nd OP, pass iNthOP=2
			* @return {*} success or failure of test
			**/
			iCheckSectionOrSubSectionTitleVisibilityByIndex: function (iSectionIndex, iSubSectionIndex, bVisibility, iNthOP) {
				iNthOP = iNthOP ? iNthOP - 1 : 0;
				return this.waitFor({
					controlType: "sap.uxap.ObjectPageLayout",
					success: function (oObjectPageControl) {
						var aSections = oObjectPageControl[iNthOP].getSections();
						if (iSubSectionIndex > 0 || iSubSectionIndex === 0) {
							var aSubSections = aSections[iSectionIndex].getSubSections();
							Opa5.assert.equal(aSubSections[iSubSectionIndex].getShowTitle(), bVisibility, "Sub Section with index " + iSubSectionIndex + " in the Section with index " + iSectionIndex + " has the the title visibility '" + bVisibility + "' as expected");
							return null;
						}
						Opa5.assert.equal(aSections[iSectionIndex].getShowTitle(), bVisibility, "Section with index " + iSectionIndex + " has the the title visibility '" + bVisibility + "' as expected");
						return null;
					},
					errorMessage: "Object Page Layout not found"
				});
			},

			/**
			* Check is a particular string is present in the url
			* @param {string} sValue - Pass the string to be checked
                        * @param {Boolean} bPresent - Pass true/false to check the filter parameter should be present or should not be present
			* @return {*} success or failure of test
			**/
			iCheckForStringInAppUrl: function(sValue, bPresent) {
				return this.waitFor({
					controlType: "sap.ui.core.ComponentContainer",
					success: function() {
						var sUrl = Opa5.getWindow().location.href;
						if (bPresent){
							if (sUrl.indexOf(sValue+'=') > -1){
								Opa5.assert.ok(true, "There is " + sValue + " in app url which is an expected behavior");
								return null;
							}else{
								Opa5.assert.notOk(true, "There is no " + sValue + " in app url which is wrong behavior");
								return null;
							}	
						}else{
							if (sUrl.indexOf(sValue+'=') === -1){
								Opa5.assert.ok(true, "There is no " + sValue + " in app url which is an expected behavior");
								return null;
							}else{
								Opa5.assert.notOk(true, "There is a " + sValue + " in app url which is wrong behavior");
								return null;
							}
						}	
						
					},
					errorMessage: "Error in validating the app url"
				});
			}
		});
	}
);
