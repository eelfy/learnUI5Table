// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Control",
    "sap/base/util/deepExtend",
    "sap/ui/comp/smartform/SmartForm"
], function (
    Control,
    fnDeepExtend,
    SmartForm
) {
    "use strict";

    var aAllowedFields = [
        "sap.ui.comp.smartfield.SmartField",
        "sap.m.Input"
    ];

    var UserDefaultsForm = Control.extend("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm", {
        metadata: {
            properties: {
                persistencyKey: { type: "string" }
            },
            aggregations: {
                _smartForm: { type: "sap.ui.comp.smartform.SmartForm", multiple: false, visibility: "hidden" }
            },
            events: {}
        },

        renderer: function (oRm, oControl) {
            oRm.openStart("div", oControl);
            oRm.openEnd();
            oRm.renderControl(oControl.getAggregation("_smartForm"));
            oRm.close("div");
        }
    });

    /**
     * Initializes the smartForm aggregation.
     */
    UserDefaultsForm.prototype.init = function () {
        this.setAggregation("_smartForm", new SmartForm({
            editable: true
        }).addStyleClass("sapUshellShellDefaultValuesForm"));
    };

    /**
     * Fetches the variant from the inputs / smart fields with group ID "User Defaults".
     * @returns {object} An object with the parameter names as key and the current input values as values.
     */
    UserDefaultsForm.prototype.fetchVariant = function () {
        var oModel = this.getAggregation("_smartForm").getModel("MdlParameter"),
            sInputName, oAdditionalValues;
        return this._getFieldControls().reduce(function (result, input) {
            sInputName = input.getName();
            result[sInputName] = {
                value: input.getValue()
            };
            oAdditionalValues = oModel.getProperty("/" + sInputName + "/valueObject/extendedValue/");
            if (oAdditionalValues) {
                result[sInputName].additionalValues = oAdditionalValues;
            }
            return result;
        }, {});
    };

    /**
     * Applies the given oVariantData to the smartForm.
     * @param {object} oVariantData The variant data to apply.
     */
    UserDefaultsForm.prototype.applyVariant = function (oVariantData) {
        if (oVariantData) {
            var oModel = this.getAggregation("_smartForm").getModel("MdlParameter"),
            aUserDefaultInputs = this._getFieldControls(),
            sInputName, oValueObject;

            for (var i = 0; i < aUserDefaultInputs.length; i++) {
                sInputName = aUserDefaultInputs[i].getName();
                if (oVariantData[sInputName] !== undefined) {
                    aUserDefaultInputs[i].setValue(oVariantData[sInputName].value);
                    oValueObject = oModel.getProperty("/" + sInputName + "/valueObject/");
                    oValueObject.extendedValue = null;
                    if (oVariantData[sInputName].additionalValues) {
                        oValueObject = fnDeepExtend(oValueObject, {extendedValue: oVariantData[sInputName].additionalValues});
                    }
                    oModel.setProperty("/" + sInputName + "/valueObject", oValueObject);
                }
            }
        }
    };

    /**
     * Returns the controls in the fieldGroupId and filters them by allowed type.
     * @returns {array} An array of SmartInput and sap.m.Input controls.
     * @private
     */
    UserDefaultsForm.prototype._getFieldControls = function () {
        return this.getControlsByFieldGroupId("UserDefaults").filter(function (field) {
            var sFieldName = field.getMetadata().getName();
            return aAllowedFields.indexOf(sFieldName) !== -1;
        });
    };

    /**
     * Wrapper for smartForm.addGroup. Adds a group at the end of the form.
     * @param {sap.ui.comp.smartform.Group} group The group.
     */
    UserDefaultsForm.prototype.addGroup = function (group) {
        this.getAggregation("_smartForm").addGroup(group);
    };

    /**
     * Wrapper for smartForm.getGroups. Returns all existing groups in the form.
     * @returns {sap.ui.comp.smartform.Group[]} The groups.
     */
    UserDefaultsForm.prototype.getGroups = function () {
        return this.getAggregation("_smartForm").getGroups();
    };

    /**
     * Wrapper for smartForm.removeGroup. Removes the group at the given index.
     * @param {number} index The index to remove.
     */
    UserDefaultsForm.prototype.removeGroup = function (index) {
        this.getAggregation("_smartForm").removeGroup(index);
    };

    /**
     * Wrapper for smartForm.removeAllGroups. Removes all groups from the form.
     */
    UserDefaultsForm.prototype.removeAllGroups = function () {
        this.getAggregation("_smartForm").removeAllGroups();
    };

    return UserDefaultsForm;
});