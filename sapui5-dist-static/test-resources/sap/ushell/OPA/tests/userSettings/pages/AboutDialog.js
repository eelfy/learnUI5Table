// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press",
    "sap/m/ButtonType",
    "sap/ui/test/matchers/I18NText",
    "sap/ushell/resources"
], function (Opa5, Properties, EnterText, Press, ButtonType, I18NTextMatcher, resources) {
    "use strict";

    Opa5.createPageObjects({
        onTheAboutDialog: {
            actions: {
                iPressTheOkButton: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        matchers: new Properties({
                            text: resources.i18n.getText("okBtn")
                        }),
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iSeeTheFieldWithText: function (text) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Text",
                        matchers: new Properties({
                            text: text
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The field with text '" + text + "' was visible.");
                        }
                    });
                }
            }
        }
    });
});