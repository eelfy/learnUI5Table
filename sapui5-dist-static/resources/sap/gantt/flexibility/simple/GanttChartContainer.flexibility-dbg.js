/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([], function () {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
		"moveControls": "default",
		"GanttContainerZoomLevel": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = newValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					if (oControl.initialSettings) {
						oControl.initialSettings.zoomLevel = oldValue;
					}
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				 getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "9"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerDisplayType": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "8"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableTimeScrollSync": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "1"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableCursorLine": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "2"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableNowLine": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "3"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableVerticalLine": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "4"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableAdhocLine": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "5"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableDeltaLine": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "6"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableNonWorkingTime": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "7"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerEnableStatusBar": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"],
						newValue = oChangeDefinition.content["newValue"],
						oldValue = oChangeDefinition.content["oldValue"];
					oChange.setRevertData(oldValue);
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, newValue);
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier;
					var oldValue = oChange.getRevertData();
					var oChangeDefinition = oChange.getDefinition(),
						sPropertyName = oChangeDefinition.content["propertyName"];
					oModifier.setPropertyBindingOrProperty(oControl, sPropertyName, oldValue);
					oChange.resetRevertData();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "15"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"GanttContainerCustom": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().apply(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				revertChange: function (oChange, oControl, mPropertyBag) {
					oControl.getVariantHandler().revert(oChange, oControl, mPropertyBag);
					oControl.getToolbar().updateCustomSettingsConfig();
					return true;
				},
				completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
					// Add dependent control to apply variant changes after control is initialized
					var sContainerID = mPropertyBag.appComponent.createId(oSpecificChangeInfo.selector.id);
					var aDependentControlList = sap.ui.getCore().byId(sContainerID).getVariantHandler().getDependantControlID();
					if (aDependentControlList.length > 0) {
						aDependentControlList.forEach(function(sID){
							oChange.addDependentControl(sID, sID.toUpperCase(), mPropertyBag);
						});
					}
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "10"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		}
	};
}, /* bExport= */ true);
