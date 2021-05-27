(function () {
    "use strict";
    /*global sap, jQuery */

    /**
     * @fileOverview Application component to display information on entities from the GWSAMPLE_BASIC
     *   OData service.
     * @version @version@
     */
    jQuery.sap.declare("procurement.webapp.Component");

    jQuery.sap.require("sap.ovp.app.Component");
    jQuery.sap.require("procurement.libs.Canvas2Image");
    jQuery.sap.require("procurement.libs.Html2Canvas");
    /**
     * temp
     * power user
     */

    jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
    jQuery.sap.require("sap.ui.fl.FakeLrepConnectorLocalStorage");
    /**
     * end
     */

    sap.ovp.app.Component.extend("procurement.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * temp solution to initialize mockservers before manifest is loaded to avoid real odata calls
         * UI5 should provide proper hooks for such scenarios!!!
         */
        _initCompositeSupport: function() {
            // enable fake lrep local storage to be able to save personalization locally
            sap.ui.fl.FakeLrepConnectorLocalStorage.enableFakeConnector(jQuery.sap.getModulePath("procurement.data.lrep.component-test-changes") + ".json");
            var isMockServerForTestRequired = this._isMockServerForTestEnabled();
            jQuery.sap.registerModulePath("sap.ovp.test", jQuery.sap.getModulePath("sap.ovp") + "/../../../test-resources/sap/ovp");
            jQuery.sap.require("sap.ovp.test.mockservers");

            var baseUrl = jQuery.sap.getModulePath("procurement");
            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/salesorder/", "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/", isMockServerForTestRequired);
            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/purchaseorder/", "/sap/opu/odata/sap/ZME_OVERDUE_CDS_LOC/", isMockServerForTestRequired);
            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/salesshare/", "/sap/smartbusinessdemo/services/SalesShare.xsodata/", isMockServerForTestRequired);
            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/map/", "/sap/opu/odata/sap/HEPM_OVP_TECH_VAL/", isMockServerForTestRequired);

            //testing setting the container layout to dashboard using a URL parameter
            var sQuery = window.URI ? window.URI()._parts.query : null;
            if (sQuery) {
                var oParser = new sap.ushell.services.URLParsing();
                //Add a "?" at the beginning of the query string because ushell parser's parseParameters starts checking the string after the "?"
                var aParams = oParser.parseParameters("?" + sQuery);
                var sContainerLayout = aParams["sap-ovp-containerLayout"] ? aParams["sap-ovp-containerLayout"][0] : null;
                if (sContainerLayout) {
                    var oMetadata = this.getMetadata();
                    var oManifest = oMetadata.getManifest();
                    var oManifestSettings = oManifest["sap.ovp"];
                    if (oManifestSettings) {
                        oManifestSettings.containerLayout = sContainerLayout;
                    }
                }
            }

            //Add another mock servers in order to prevent lrep user login window
            if (isMockServerForTestRequired) {
                //sComponent, requestResponseConfig, namespace
                sap.ovp.test.mockservers.loadRequestMockServer("procurement.Component", {
                    get: {
                        path: "/sap/bc/lrep/flex/data/",
                        responseCode: 200
                    },
                    head: {
                        path: "/sap/bc/lrep/actions/getcsrftoken/",
                        responseCode: 200
                    },
                    post: {
                        path: "/sap/bc/lrep/",
                        responseCode: 200
                    }
                },baseUrl + "/data/lrep/" );

                sap.ovp.test.mockservers.loadRequestMockServer("", {
                    get: {
                        path: "/sap/es/ina/GetServerInfo",
                        responseCode: 200
                    }
                },baseUrl + "sina" );
            }

            sap.ovp.app.Component.prototype._initCompositeSupport.apply(this, arguments);
        },

        _isMockServerForTestEnabled: function() {
            return window.location.hash.toLowerCase().indexOf("mockservertest=true") > 0;
        },

        exit: function(){
            sap.ovp.test.mockservers.close();
        }
    });
}());

(function() {
    function _onCardPreviewButtonPress (oEvent) {
        var oController = sap.ui.getCore().byId("mainView").getController();
        var oModel,
            oView = oController.getView();

        function cardTitleFormatter(id) {
            var oCard = oController._getCardFromManifest(id);
            var cardSettings = oCard.settings;
            if (cardSettings.title) {
                return cardSettings.title;
            } else if (cardSettings.category) {
                return (cardSettings.category);
            } else if (cardSettings.subTitle) {
                return cardSettings.subTitle;
            }
            return id;
        }

        function addCardToPreview (oManifest) {
            var oListener = {
                onLogEntry: function () {
                    oPreview.setVisible(false);
                    oMessagePage.setVisible(true);
                }
            };
            jQuery.sap.log.addLogListener(oListener);
            oPreview.setVisible(true);
            oMessagePage.setVisible(false);
            sap.ovp.cards.CommonUtils.createCardComponent(oView, oManifest, 'ovpCardPreview');
            jQuery.sap.log.removeLogListener(oListener);
        }

        var oCardsTableTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({
                    text: {
                        path: "id",
                        formatter: cardTitleFormatter.bind(oController)
                    }
                })
            ]
        });

        var oCardsTable = new sap.m.Table("sapOVPHideCardsTable", {
            backgroundDesign: sap.m.BackgroundDesign.Transparent,
            showSeparators: sap.m.ListSeparators.Inner,
            mode : sap.m.ListMode.SingleSelectLeft,
            columns: [
                new sap.m.Column({
                    vAlign: "Middle"
                })
            ]
        });
        oCardsTable.addStyleClass('sapOVPHideCardsTable');
        oCardsTable.bindItems({
            path: "/cards",
            template: oCardsTableTemplate
        });
        oCardsTable.attachSelectionChange(function (oEvent) {
            var sCardId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("id"),
                oManifest = {
                    cards: {}
                };

            oManifest.cards[sCardId + 'Preview'] = this._getCardFromManifest(sCardId);
            addCardToPreview(oManifest);
        }.bind(oController));

        var oPreview = new sap.ui.core.ComponentContainer(oView.getId() + "--ovpCardPreview").addStyleClass("dialogCardOverlay"),
            oMessagePage = new sap.m.MessagePage({
                icon: "sap-icon://map-3",
                showHeader: false,
                description: "",
                text: "Sorry, the map card cannot be previewed",
                visible: false
            }).addStyleClass("sapOvpSettingsDialogErrorPreviewWidth sapOvpSettingsDialogErrorPreviewHeight"),
            oScrollContainer = new sap.m.ScrollContainer({
                height: "36rem",
                width: "100%",
                horizontal: false,
                vertical: true,
                focusable: true,
                content: [
                    oCardsTable
                ]
            }).addStyleClass("sapOvpScrollContainer"),
            oTakeScreenShotButton = new sap.m.Button({
                text: "Take Screen Shot",
                press: function () {
                    html2canvas(oPreview.getDomRef()).then(function(canvas) {
                        Canvas2Image.saveAsPNG(canvas);
                    });
                }
            });

        var oHBox = new sap.m.HBox({
            items:[
                new sap.m.VBox({
                    width: "22rem",
                    items: [
                        oPreview,
                        oMessagePage
                    ]
                }).addStyleClass("sapUiMediumMargin"),
                new sap.m.VBox({
                    width: "calc(100% - 22rem)",
                    items: [
                        oScrollContainer
                    ]
                })
            ]
        });

        var oCancelButton = new sap.m.Button("manageCardsCancelBtn", {
            text: oController._getLibraryResourceBundle().getText("cancelBtn"),
            press: function () {
                oPreview.destroy();
                this.oDialog.close();
            }.bind(oController)
        });

        oController.oDialog = new sap.m.Dialog({
            title: "Preview Cards",
            contentWidth: "56.25rem",
            contentHeight: "75%",
            stretch: sap.ui.Device.system.phone,
            content: oHBox,
            buttons: [oTakeScreenShotButton, oCancelButton],
            afterClose: function () {
                this.oDialog.destroy();
            }.bind(oController)
        }).addStyleClass("sapOVPCardsVisibilityDialog");
        var oDialogCardsModel,
            oLayout = oController.getLayout();
        if (oLayout.getMetadata().getName() === "sap.ovp.ui.DashboardLayout") {
            oDialogCardsModel = jQuery.extend(true, [], oController._getCardArrayAsVariantFormatDashboard());
        } else {
            oDialogCardsModel = jQuery.extend(true, [], oController.aOrderedCards);
        }

        var sWidth = oLayout.getColumnWidth(oLayout.columnStyle) + "rem";
        oPreview.setWidth(sWidth);
        //oImage.setWidth(sWidth);

        oModel = new sap.ui.model.json.JSONModel({
            cards: oDialogCardsModel
        });
        oController.oDialog.setModel(oModel);

        oController.oDialog.open();
    }

    var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
        previewCardsButton = {
            controlType : "sap.ushell.ui.launchpad.ActionItem",
            bCurrentState : false,
            oControlProperties : {
                icon: "sap-icon://my-view",
                text: "Preview Card",
                tooltip: "Preview Card",
                press: _onCardPreviewButtonPress
            },
            bIsVisible: false,
            aStates: ["app"]
        };
    oRenderer.addUserAction(previewCardsButton);
}());

