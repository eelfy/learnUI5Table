// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.ContactSupportButton
 */
sap.ui.define([
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
], function (ContactSupportButton, Resources, Container) {
    "use strict";
    /* global QUnit, sinon, start */

    var oOriginalConfiguration = window["sap-ushell-config"];

    QUnit.module("sap.ushell.ui.footerbar.ContactSupportButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            // configure the user of the container adapter
            window["sap-ushell-config"] = {
                services: {
                    Container: {
                        adapter: {
                            config: {
                                id: "DEMO_USER",
                                firstName: "Demo",
                                lastName: "User",
                                fullName: "Demo User",
                                email: "demo.user@sap.com",
                                accessibility: false,
                                theme: "theme1",
                                bootTheme: {
                                    theme: "sap_bluecrystal",
                                    root: ""
                                },
                                language: "EN",
                                setAccessibilityPermitted: true,
                                setThemePermitted: true,
                                userProfile: [{id: "THEME", value: "sap_bluecrystal"}]
                            }
                        }
                    }
                }
            };
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(start);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            // restore original configuration
            window["sap-ushell-config"] = oOriginalConfiguration;
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        var ContactSupportDialog = new ContactSupportButton();
        assert.ok(ContactSupportDialog.getIcon() === "sap-icon://email", "Check dialog icon");
        assert.ok(ContactSupportDialog.getText("text") === Resources.i18n.getText("contactSupportBtn"), "Check dialog title");
    });

    QUnit.asyncTest("showContactSupportDialog Test", function (assert) {
        var contactSupportDialog = new ContactSupportButton();
        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // Get the contact support dialog content form
            var dialogForm = sap.ui.getCore().byId("ContactSupportDialog"),
                dialogFormContent = dialogForm.getContent(),
                simpleFormTopContent,
                simpleFormBottomContent,
                translationBundle = Resources.i18n;

            // check buttons
            assert.ok(dialogForm.getLeftButton() === "contactSupportSendBtn", "Check send button");
            assert.ok(dialogForm.getRightButton() === "contactSupportCancelBtn", "Check cancel button");

            // check content
            assert.ok(dialogFormContent[0].getMetadata()._sClassName === "sap.ui.layout.form.SimpleForm", "Check top simple form");
            assert.ok(dialogFormContent[0].getId() === "topForm", "Check top simple form id");
            assert.ok(dialogFormContent[0].getEditable() === false, "Check top simple form is editable");
            // check top content
            simpleFormTopContent = dialogFormContent[0].getContent();
            assert.ok(simpleFormTopContent !== undefined, "Check top simple form content");
            assert.ok(simpleFormTopContent[0].getMetadata()._sClassName === "sap.m.TextArea", "Check top simple form content - TextArea");
            assert.ok(simpleFormTopContent[0].getId() === "textArea", "Check top simple form content - TextArea id");
            assert.ok(simpleFormTopContent[0].getPlaceholder() === translationBundle.getText("txtAreaPlaceHolderHeader"), "Check top simple form content - TextArea placeholder");

            assert.ok(dialogFormContent[1].getMetadata()._sClassName === "sap.ui.layout.form.SimpleForm", "Check bottom simple form");
            assert.ok(dialogFormContent[1].getId() === "bottomForm", "Check bottom simple form id");
            assert.ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
            // check bottom content
            simpleFormBottomContent = dialogFormContent[1].getContent();
            assert.ok(simpleFormBottomContent !== undefined, "Check bottom simple form content");
            assert.ok(simpleFormBottomContent[0].getMetadata()._sClassName === "sap.m.Link", "Check bottom simple form content - link");
            assert.ok(simpleFormBottomContent[0].getText() === translationBundle.getText("technicalDataLink"), "Check bottom simple form content - link text");

            //Destroy the contact support dialog
            sap.ui.getCore().byId("ContactSupportDialog").destroy();
        }, 150);
    });

    QUnit.asyncTest("check bottom form content", function (assert) {
        var contactSupportDialog = new ContactSupportButton(),
            simpleFormBottomContent,
            translationBundle = Resources.i18n;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // click on the link to open bottom form
            contactSupportDialog._embedLoginDetailsInBottomForm();

            var dialogFormContent = sap.ui.getCore().byId("ContactSupportDialog").getContent();

            // get bottom content
            assert.ok(dialogFormContent[1].getMetadata()._sClassName === "sap.ui.layout.form.SimpleForm", "Check bottom simple form with technical info");
            assert.ok(dialogFormContent[1].getId() === "technicalInfoBox", "Check bottom simple form id");
            assert.ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
            simpleFormBottomContent = dialogFormContent[1].getContent();

            assert.ok(simpleFormBottomContent[0].getMetadata()._sClassName === "sap.m.Text", "Check form field loginDetails");
            assert.ok(simpleFormBottomContent[0].getText() === translationBundle.getText("loginDetails"), "Check form field value loginDetails");
            assert.ok(simpleFormBottomContent[1].getMetadata()._sClassName === "sap.m.Label", "Check form field userFld");
            assert.ok(simpleFormBottomContent[1].getText() === translationBundle.getText("userFld"), "Check form field value userFld");
            assert.ok(simpleFormBottomContent[2].getMetadata()._sClassName === "sap.m.Text", "Check form field userDetails.fullName");
            assert.ok(simpleFormBottomContent[2].getText() === (contactSupportDialog.oClientContext.userDetails.fullName || ""), "Check form field value userDetails.fullName");
            assert.ok(simpleFormBottomContent[3].getMetadata()._sClassName === "sap.m.Label", "Check form field serverFld");
            assert.ok(simpleFormBottomContent[3].getText() === translationBundle.getText("serverFld"), "Check form field value serverFld");
            assert.ok(simpleFormBottomContent[4].getMetadata()._sClassName === "sap.m.Text", "Check form field server");
            assert.ok(simpleFormBottomContent[4].getText() === window.location.host, "Check form field value server");
            assert.ok(simpleFormBottomContent[5].getMetadata()._sClassName === "sap.m.Label", "Check form field eMailFld");
            assert.ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
            assert.ok(simpleFormBottomContent[6].getMetadata()._sClassName === "sap.m.Text", "Check form field eMailFld");
            assert.ok(simpleFormBottomContent[6].getText() === (contactSupportDialog.oClientContext.userDetails.eMail || ""), "Check form field value userDetails.eMail");
            assert.ok(simpleFormBottomContent[7].getMetadata()._sClassName === "sap.m.Label", "Check form field languageFld");
            assert.ok(simpleFormBottomContent[7].getText() === translationBundle.getText("languageFld"), "Check form field value languageFld");
            assert.ok(simpleFormBottomContent[8].getMetadata()._sClassName === "sap.m.Text", "Check form field Language");
            assert.ok(simpleFormBottomContent[8].getText() === (contactSupportDialog.oClientContext.userDetails.Language || ""), "Check form field value Language");

            //Destroy the about dialog
            sap.ui.getCore().byId("ContactSupportDialog").destroy();

        }, 150);
    });

    QUnit.test("contact suppot button disabled", function (assert) {
        sap.ushell.Container = undefined;
        var contactSupportDialog = new ContactSupportButton();
        assert.ok(contactSupportDialog.getEnabled() === false, "the button is disabled");
    });

    QUnit.asyncTest("Check bottom form content with email", function (assert) {
        var translationBundle = Resources.i18n,
            oClientContext = sap.ushell.UserActivityLog.getMessageInfo(),
            messageInfoStub = sinon.stub(sap.ushell.UserActivityLog, "getMessageInfo", function () {
                oClientContext.userDetails.eMail = "aaa@bbb.com";

                return oClientContext;
            }),
            contactSupportDialog = new ContactSupportButton(),
            dialogFormContent,
            simpleFormBottomContent;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        setTimeout(function () {
            start();

            // click on the link to open bottom form
            contactSupportDialog._embedLoginDetailsInBottomForm();

            dialogFormContent = sap.ui.getCore().byId("ContactSupportDialog").getContent();
            simpleFormBottomContent = dialogFormContent[1].getContent();
            assert.ok(simpleFormBottomContent[5].getMetadata()._sClassName === "sap.m.Label", "Check form field eMailFld");
            assert.ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
            assert.ok(simpleFormBottomContent[6].getMetadata()._sClassName === "sap.m.Text", "Check form field mail");
            assert.ok(simpleFormBottomContent[6].getText() === (oClientContext.userDetails.eMail), "Check form field value mail");
            messageInfoStub.restore();

            //Destroy the about dialog
            sap.ui.getCore().byId("ContactSupportDialog").destroy();
        }, 150);
    });
}, /* bExport= */ false);