sap.ui.define([
    "sap/gantt/simple/CustomVariantHandler"
], function(CustomVariantHandler) {
    'use strict';

    var ExtendCustomVariantSettings = CustomVariantHandler.extend("sap.gantt.simple.GanttVariantManagement.webapp.controller.ExtendCustomVariantSettings", {
    });
    ExtendCustomVariantSettings.prototype.apply = function(oChange, oControl, mPropertyBag) {
        var oController = sap.ui.getCore().byId("ganttVariantManagementContainer-GanttVariantManagement---MainView").getController();
        var oContent = oChange.getContent();
        oController.applyCustomData(oChange, oControl, mPropertyBag);

        var aSettingItems = oControl.getToolbar().getSettingItems();
        aSettingItems.forEach(function(oItem) {
            var sKey = oItem.getKey();
            if (oContent.newData[sKey] !== null && oContent.newData[sKey] !== undefined) {
                oItem.setChecked(oContent.newData[sKey]);
            }
        });
    };
    ExtendCustomVariantSettings.prototype.revert = function(oChange, oControl, mPropertyBag) {
        var oController = sap.ui.getCore().byId("ganttVariantManagementContainer-GanttVariantManagement---MainView").getController();
        var oContent = oChange.getContent();
        oController.revertCustomData(oChange, oControl, mPropertyBag);

        var aSettingItems = oControl.getToolbar().getSettingItems();
        aSettingItems.forEach(function(oItem) {
            var sKey = oItem.getKey();
            if (oContent.oldData[sKey] !== null && oContent.oldData[sKey] !== undefined) {
                oItem.setChecked(oContent.oldData[sKey]);
            }
        });
    };
    return ExtendCustomVariantSettings;
});