// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/thirdparty/datajs",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/components/tiles/utilsRT",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/base/util/UriParameters",
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/utils/WindowUtils"
], function (
    OData,
    Utils,
    UtilsRT,
    JSONModel,
    Log,
    UriParameters,
    Controller,
    Config,
    jquery,
    WindowUtils
) {
    "use strict";
    /*global jQuery, OData, sap, setTimeout, hasher */

    return Controller.extend("sap.ushell.demotiles.cdm.customtile.DynamicTile", {
        // handle to control/cancel browser's setTimeout()
        timer: null,
        // handle to control/cancel data.js OData.read()
        oDataRequest: null,
        _getConfiguration: function (oComponentData) {

            var oProperties = oComponentData.properties || {},
                oStartUpProperties = oComponentData.startupParameters || {},
                oConfig = {};

            // fill config as expected by dynamic tile
            oConfig.display_title_text = oProperties.title || "";
            oConfig.display_subtitle_text = oProperties.subtitle || "";
            oConfig.display_icon_url = oProperties.icon || "";
            oConfig.navigation_target_url = oProperties.targetURL || "";
//            oConfig.navigation_semantic_object = oConfig.navigation_semantic_object || "";
//            oConfig.navigation_semantic_action = oConfig.navigation_semantic_action || "";
//            oConfig.navigation_semantic_parameters = oConfig.navigation_semantic_parameters || "";
//            oConfig.navigation_use_semantic_object = (oConfig.navigation_use_semantic_object === false ? false : true);

            // indicator data source
            if (oProperties.indicatorDataSource) {
                oConfig.service_url = oProperties.indicatorDataSource.path;
                oConfig.service_refresh_interval = oProperties.indicatorDataSource.refresh;
            }
//            oConfig.display_number_unit = oConfig.display_number_unit || "";
//            oConfig.display_number_factor = oConfig.display_number_factor || "";

            // If form factors were not configured yet, use default values
            oConfig.form_factors = { // see tile utils getDefaultFormFactors
                appDefault: false,
                manual: {
                    desktop: true,
                    tablet: true,
                    phone: true
                },
                defaultParam: true
            };

            oConfig.desktopChecked = oConfig.form_factors.manual.desktop;
            oConfig.tabletChecked = oConfig.form_factors.manual.tablet;
            oConfig.phoneChecked = oConfig.form_factors.manual.phone;
            oConfig.manualFormFactor = !(oConfig.form_factors.appDefault) && oConfig.editable;
            oConfig.appFormFactor = oConfig.form_factors.appDefault;

            // tileConfiguration from CDM/App Descriptor (may be personalized)
            if (oProperties.tilePersonalization) {
                oConfig.display_info_text = oProperties.tilePersonalization.info_text;
            }

            // sap-system is coming from the Start Up Parameters (like for every Fiori app)
            if (oStartUpProperties["sap-system"]) {
                oConfig.sap_system = oStartUpProperties["sap-system"];
            }

            return oConfig;
        },
        onInit: function () {
            var oComponentData = this.getOwnerComponent().getComponentData(),
                oView = this.getView(),
                oConfig = this._getConfiguration(oComponentData),
                oModel,
                sNavigationTargetUrl = oConfig.navigation_target_url,
                sSystem = oConfig.sap_system,
                sBackgroundImageUrl,
                oHash,
                that = this,
                oUrlParser;
            this.bIsDataRequested = true; //false;

            if (sSystem) { // propagate system to target application
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (oUrlParser.isIntentUrl(sNavigationTargetUrl)) {
                    oHash = oUrlParser.parseShellHash(sNavigationTargetUrl);
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sNavigationTargetUrl = "#"+ oUrlParser.constructShellHash(oHash);
                } else {
                    sNavigationTargetUrl += ((sNavigationTargetUrl.indexOf("?") < 0) ? "?" : "&")
                        + "sap-system=" + sSystem;
                }
            }
            this.navigationTargetUrl = sNavigationTargetUrl;

            // read background image
            var oApplicationRoot = jquery.sap.getModulePath("sap.ushell.demotiles.cdm.customtile");
            sBackgroundImageUrl = oApplicationRoot + "/" +
                this.getOwnerComponent().getManifestEntry("custom.namespace.of.tile").backgroundImageRelativeToComponent;

            /*
             * Model of the applauncher tile consisting of
             *          config (tile configuration),
             *          data (dyanmic data read from a data source)
             *          nav (target URL set to '' in case of Admin UI), and
             *          search (highlight terms)
             */
            oModel = new JSONModel({
                config: oConfig,
                data: UtilsRT.getDataToDisplay(oConfig, {
                    number: (!this.bIsDataRequested ? 0 : "...")
                }),
                backgroundImage: sBackgroundImageUrl,
                nav: {navigation_target_url: sNavigationTargetUrl},
                search: { //TODO remove
                    display_highlight_terms: []
                }
            });
            oView.setModel(oModel);

            var sContentProviderId = oComponentData.properties.contentProviderId;
            if (Config.last("/core/contentProviders/providerInfo/show")) {
                sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                    .then(function (oCSTR) {
                        return oCSTR.getSystemContext(sContentProviderId);
                    })
                    .then(function (oSystemContext) {
                        oModel.setProperty("/config/contentProviderLabel", oSystemContext.label);
                    })
                    .catch(function (oError) {
                        Log.error("DynamicTile.controller threw an error:", oError);
                    });
            }

            //adopt tileSize behavior and updates
            sap.ushell.Container.getServiceAsync("Configuration").then(function (oService) {
                oService.attachSizeBehaviorUpdate(function (sSizeBehavior) {
                    oModel.setProperty("/sizeBehavior", sSizeBehavior);
                });
            });

            // implement types contact
            // default is Tile
            var oTileControl = this.getView().getTileControl();
            this.getView().addContent(oTileControl);

            // Do not retrieve data initially, wait until the visible handler is called
            // otherwise requests may be triggered which are canceled immediately again.
        },

        // loads data once if not in configuration mode
        refreshHandler: function (oDynamicTileController) {
            oDynamicTileController.loadData(0);
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (isVisible) {
                if (!this.bIsDataRequested) {
                    //tile is visible and data wasn't requested yet
                    this.refreshHandler(this);
                }
                if (nservice_refresh_interval) {
                    //tile is visible and the refresh interval isn't set to 0
                    this.refreshHandler(this);
                }
            } else {
                this.stopRequests();
            }
        },

        setVisualPropertiesHandler: function (oNewProperties) {
            var bChanged = false,
                oData = this.getView().getModel().getProperty("/data");

            if (oNewProperties.title) {
                oData.display_title_text = oNewProperties.title;
                bChanged = true;
            }
            if (oNewProperties.subtitle) {
                oData.display_subtitle_text = oNewProperties.subtitle;
                bChanged = true;
            }
            if (oNewProperties.icon) {
                oData.display_icon_url = oNewProperties.icon;
                bChanged = true;
            }

            if (bChanged) {
                // update model if something changed
                this.getView().getModel().setProperty("/data", oData);
            }
        },

        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.oDataRequest) {
                try {
                    this.oDataRequest.abort();
                } catch (e) {
                    Log.warning(e.name, e.message);
                }
            }
        },
        // destroy handler stops requests
        onExit: function () {
            this.stopRequests();
        },
        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function () {
            var oModel = this.getView().getModel(),
                sTargetUrl = oModel.getProperty("/nav/navigation_target_url");

            if (sTargetUrl) {
                if (sTargetUrl[0] === "#") {
                    hasher.setHash(sTargetUrl);
                } else {
                    WindowUtils.openURL(sTargetUrl, "_blank");
                }
            }
        },
        // dynamic data updater
        onUpdateDynamicData: function () {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (!nservice_refresh_interval) {
                nservice_refresh_interval = 0;
            } else if (nservice_refresh_interval < 10) {
                Log.warning(
                    "Refresh Interval " + nservice_refresh_interval
                    + " seconds for service URL " + oConfig.service_url
                    + " is less than 10 seconds, which is not supported. "
                    + "Increased to 10 seconds automatically.",
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller"
                );
                nservice_refresh_interval = 10;
            }
            if (oConfig.service_url) {
                this.loadData(nservice_refresh_interval);
            }
        },
        extractData: function (oData) {
            var name,
                aKeys = ["results", "icon", "title", "number", "numberUnit", "info", "infoState", "infoStatus", "targetParams", "subtitle", "stateArrow", "numberState", "numberDigits", "numberFactor"];

            if (typeof oData === "object" && Object.keys(oData).length === 1) {
                name = Object.keys(oData)[0];
                if (jQuery.inArray(name, aKeys) === -1) {
                    return oData[name];
                }
            }
            return oData;
        },

        successHandleFn: function (oResult) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var oData = oResult,
                oDataToDisplay;
            if (typeof oResult === "object") {
                var uriParamInlinecount = UriParameters.fromURL(oConfig.service_url).get("$inlinecount");
                if (uriParamInlinecount && uriParamInlinecount === "allpages") {
                    oData = {number: oResult.__count};
                } else {
                    oData = this.extractData(oData);
                }
            } else if (typeof oResult === "string") {
                oData = {number: oResult};
            }


            // TODO remove entire if as only needed for CDM POC to polish output
            if (oData && oData.results && oData.results[0] && typeof oData.results[0].number === "number") {
                oData = {
                    // remove subtitle + info
                    number: oData.results[0].number % 101, // make the number smaller
                    numberState: oData.numberState
                };
            }

            oDataToDisplay = UtilsRT.getDataToDisplay(oConfig, oData);

            this.getView().getModel().setProperty("/data", oDataToDisplay);

            // rewrite target URL
            this.getView().getModel().setProperty("/nav/navigation_target_url",
                UtilsRT.addParamsToUrl(
                    this.navigationTargetUrl,
                    oDataToDisplay
                ));
        },

        errorHandlerFn: function (oMessage) {
            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var sMessage = oMessage && oMessage.message ? oMessage.message : oMessage,
                oResourceBundle = Utils.getResourceBundleModel()
                    .getResourceBundle();
            if (oMessage.response) {
                sMessage += " - " + oMessage.response.statusCode + " "
                    + oMessage.response.statusText;
            }
            Log.error(
                "Failed to update data via service "
                    + oConfig.service_url
                    + ": " + sMessage,
                null,
                "sap.ushell.components.tiles.applauncherdynamic.DynamicTile"
            );
            this.getView().getModel().setProperty("/data",
                UtilsRT.getDataToDisplay(oConfig, {
                    number: "???",
                    info: oResourceBundle.getText("dynamic_data.error"),
                    infoState: "Critical"
                })
            );
        },

        loadData: function (nservice_refresh_interval) {
            var oDynamicTileView = this.getView(),
                oConfig = oDynamicTileView.getModel().getProperty("/config"),
                sUrl = oConfig.service_url,
                that = this,
                sLanguage,
                iSapClient;
            if (!sUrl) {
                return;
            }

            //set the timer if required
            if (nservice_refresh_interval > 0) {
                Log.info(
                    "Wait " + nservice_refresh_interval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller"
                );
                // call again later
                this.timer = setTimeout(that.loadData.bind(that, nservice_refresh_interval, false), (nservice_refresh_interval * 1000));
            }

            // Verify the the Tile visibility is "true" in order to issue an oData request

            if (sap.ushell.Container) {
                sLanguage = sap.ushell.Container.getUser().getLanguage();
                iSapClient = sap.ushell.Container.getLogonSystem() ? sap.ushell.Container.getLogonSystem().getClient() : "";
            }

            if ((sLanguage) && (sUrl.indexOf("sap-language=") == -1)) {
                sUrl = sUrl + (sUrl.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLanguage;
            }
                this.bIsDataRequested = true;
                that.oDataRequest = OData.read(
                    {
                        requestUri: sUrl,
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            Pragma: "no-cache",
                            Expires: "0",
                            "Accept-Language": (sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || "",
                            "sap-client": (iSapClient || ""),
                            "sap-language": (sLanguage || "")
                        }
                    },
                    this.successHandleFn.bind(this),
                    this.errorHandlerFn.bind(this)
                );
        },

        formatters: {
            urlToExternal: function (sUrl) {
                // Any subsequent FLP tab/window should be opened with the appState=lean URL parameter.
                // append appState only in the case when URL starts with "#".
                if ((sUrl || "").charAt(0) !== "#") {
                    return sUrl;
                }

                var sQuery = window.location.search;

                if (!sQuery) {
                    sQuery = "?appState=lean";
                } else if (sQuery.indexOf("appState=") >= -1) { // avoid duplicates: lean FLP opens a link again
                    sQuery += "&appState=lean";
                }

                return window.location.origin + window.location.pathname + sQuery + sUrl;
            }
        }
    });
});
