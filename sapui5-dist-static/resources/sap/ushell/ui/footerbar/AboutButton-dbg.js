// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.footerbar.AboutButton.
sap.ui.define([
    "sap/m/ButtonRenderer", // will load the renderer async
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/ActionItem"
], function (
    ButtonRenderer,
    Config,
    resources,
    ActionItem
) {
    "use strict";

    /**
     * Constructor for a new ui/footerbar/AboutButton.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     * @class Add your documentation for the new ui/footerbar/AboutButton
     * @extends sap.ushell.ui.launchpad.ActionItem
     * @constructor
     * @public
     * @name sap.ushell.ui.footerbar.AboutButton
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var AboutButton = ActionItem.extend("sap.ushell.ui.footerbar.AboutButton", /** @lends sap.ushell.ui.footerbar.AboutButton.prototype */ {
        metadata: { library: "sap.ushell" },
        renderer: "sap.m.ButtonRenderer"
    });

    /**
     * AboutButton
     *
     * @name sap.ushell.ui.footerbar.AboutButton
     * @private
     * @since 1.16.0
     */
    AboutButton.prototype.init = function () {
        // call the parent sap.ushell.ui.launchpad.ActionItem init method
        if (ActionItem.prototype.init) {
            ActionItem.prototype.init.apply(this, arguments);
        }
        this.setIcon("sap-icon://hint");
        this.setText(resources.i18n.getText("about"));
        this.setTooltip(resources.i18n.getText("about"));
        this.attachPress(this.showAboutDialog);
    };

    AboutButton.prototype.showAboutDialog = function () {
        var oCurrentApplication;
        return sap.ushell.Container.getServiceAsync("AppLifeCycle")
            .then(function (oAppLifeCycle) {
                var oSystemContextPromise = Promise.resolve();
                oCurrentApplication = oAppLifeCycle.getCurrentApplication();

                if (Config.last("/core/contentProviders/providerInfo/show")) {
                    oSystemContextPromise = oCurrentApplication.getSystemContext()
                        .then(function (oSystemContext) {
                            return oSystemContext.label;
                        });
                }

                return Promise.all([
                    oCurrentApplication.getInfo([
                        "technicalAppComponentId",
                        "appVersion",
                        "appFrameworkId",
                        "appFrameworkVersion",
                        "appId",
                        "appSupportInfo"
                    ]),
                    oSystemContextPromise
                ]);
            })
            .then(function (aResults) {
                return new Promise(function (resolve, reject) {
                    sap.ui.require([
                        "sap/base/util/restricted/_flatten",
                        "sap/m/Button",
                        "sap/m/Dialog",
                        "sap/m/HBox",
                        "sap/m/Label",
                        "sap/m/Text",
                        "sap/m/Title",
                        "sap/m/VBox",
                        "sap/ui/core/Icon",
                        "sap/ui/core/library",
                        "sap/ui/layout/form/SimpleForm",
                        "sap/ui/layout/form/SimpleFormLayout",
                        "sap/ushell/services/AppConfiguration"
                    ], function (
                        _flatten,
                        Button,
                        Dialog,
                        HBox,
                        Label,
                        Text,
                        Title,
                        VBox,
                        Icon,
                        coreLibrary,
                        SimpleForm,
                        SimpleFormLayout,
                        AppConfiguration
                    ) {
                        var fnGetLineOfContent = function (sParameterName, sParameterValue) {
                                return [
                                    new Label({ text: resources.i18n.getText(sParameterName) }),
                                    new Text({ text: sParameterValue || "", visible: !!sParameterValue })
                                ];
                            },
                            oInfo = aResults[0],
                            sProviderId = aResults[1],
                            sFrameworkVersion = oCurrentApplication.homePage ? oInfo.appFrameworkVersion : undefined,
                            oLogonSystem = sap.ushell.Container.getLogonSystem();

                        var oMetaData = AppConfiguration.getMetadata(),
                            oSimpleForm = new SimpleForm({
                                id: "aboutDialogFormID",
                                editable: false,
                                layout: SimpleFormLayout.ResponsiveGridLayout,
                                content: _flatten([
                                    fnGetLineOfContent("technicalAppComponentId", oInfo.technicalAppComponentId),
                                    fnGetLineOfContent("appVersion", oInfo.appVersion),
                                    fnGetLineOfContent("appFrameworkId", oInfo.appFrameworkId),
                                    fnGetLineOfContent("appFrameworkVersion", sFrameworkVersion),
                                    fnGetLineOfContent("contentProviderLabel", sProviderId),
                                    fnGetLineOfContent("userAgentFld", navigator.userAgent),
                                    fnGetLineOfContent("productName", oLogonSystem.getProductName()),
                                    fnGetLineOfContent("productVersionFld", oLogonSystem.getProductVersion()),
                                    fnGetLineOfContent("systemName", oLogonSystem.getSystemName()),
                                    fnGetLineOfContent("systemRole", oLogonSystem.getSystemRole()),
                                    fnGetLineOfContent("tenantRole", oLogonSystem.getTenantRole()),
                                    fnGetLineOfContent("appId", oInfo.appId),
                                    fnGetLineOfContent("appSupportInfo", oInfo.appSupportInfo)
                                ])
                            }),
                            aHeaderItems = [],
                            oDialog;

                        if (oMetaData.icon) {
                            aHeaderItems.push(new Icon({
                                src: oMetaData.icon
                            }).addStyleClass("sapUiTinyMarginEnd"));
                        }

                        if (oMetaData.title) {
                            aHeaderItems.push(new Title({
                                text: oMetaData.title,
                                level: coreLibrary.TitleLevel.H3
                            }));
                        }

                        if (aHeaderItems.length > 0) {
                            oSimpleForm.insertContent(new HBox({
                                items: aHeaderItems
                            }), 0);
                        }

                        oDialog = new Dialog({
                            id: "aboutContainerDialogID",
                            title: resources.i18n.getText("about"),
                            contentWidth: "25rem",
                            horizontalScrolling: false,
                            leftButton: new Button({
                                text: resources.i18n.getText("okBtn"),
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            afterClose: function () {
                                oDialog.destroy();
                                if (window.document.activeElement && window.document.activeElement.tagName === "BODY") {
                                    window.document.getElementById("meAreaHeaderButton").focus();
                                }
                            },
                            content: [
                                new VBox({
                                    items: [oSimpleForm]
                                })
                            ]
                        }).addStyleClass("sapContrastPlus");

                        oDialog.open();
                        resolve(aResults);
                    }, reject);
                });
            });
    };

    return AboutButton;
});
