// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/components/tiles/utils",
    "sap/ui/core/format/NumberFormat",
    "sap/ushell/Config",
    "sap/ushell/services/AppType",
    "sap/ushell/utils/WindowUtils",
    "sap/ui/model/json/JSONModel",
    "sap/m/library",
    "sap/ushell/library",
    "sap/base/Log",
    "sap/base/util/merge",
    "sap/ushell/utils/DynamicTileRequest"
], function (
    Controller,
    utils,
    NumberFormat,
    Config,
    AppType,
    WindowUtils,
    JSONModel,
    mobileLibrary,
    ushellLibrary,
    Log,
    merge,
    DynamicTileRequest
) {
    "use strict";

    // shortcut for sap.m.GenericTileScope
    var GenericTileScope = mobileLibrary.GenericTileScope;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var COMPONENT_NAME = "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile";

    /* global hasher */
    return Controller.extend(COMPONENT_NAME, {
        // handle to control/cancel browser's setTimeout()
        timer: null,
        _aDoableObject: {},

        // handle to control/cancel data.js OData.read()
        oDataRequest: null,

        _getConfiguration: function (oViewData) {
            var oConfig = {};
            var oUrlParser;
            var oHash;

            oConfig.configuration = oViewData.configuration;
            oConfig.properties = oViewData.properties;

            // a special handling for info, as by the configuration we should not get info anymore.
            // nevertheless - it is used by the dynamic-data response. So we must initialze it to be empty string
            // in case it is not supplied.
            oConfig.properties.info = oConfig.properties.info || "";

            // default values for the dynamic data
            oConfig.properties.number_value = "..."; // number
            oConfig.properties.number_value_state = "Neutral"; // number's color
            oConfig.properties.number_state_arrow = "None"; // indicator arrow direction
            oConfig.properties.number_factor = ""; // number scale factor
            oConfig.properties.number_unit = oConfig.properties.numberUnit || ""; // number unit

            // adding sap-system
            var sSystem = oConfig.configuration["sap-system"];
            var sTargetURL = oConfig.properties.targetURL;
            if (sTargetURL && sSystem) {
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (oUrlParser.isIntentUrl(sTargetURL)) {
                    oHash = oUrlParser.parseShellHash(sTargetURL);
                    if (!oHash.params) {
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sTargetURL = "#" + oUrlParser.constructShellHash(oHash);
                } else {
                    sTargetURL += ((sTargetURL.indexOf("?") < 0) ? "?" : "&")
                        + "sap-system=" + sSystem;
                }
                oConfig.properties.targetURL = sTargetURL;
            }

            oConfig.properties.sizeBehavior = Config.last("/core/home/sizeBehavior");
            oConfig.properties.wrappingType = Config.last("/core/home/wrappingType");
            return oConfig;
        },

        onInit: function () {
            var oView = this.getView();
            var oModel = new JSONModel();
            var oViewData = oView.getViewData();
            var oViewDataProperties = oViewData.properties;
            oModel.setData(this._getConfiguration(oViewData));

            var sContentProviderId = oViewDataProperties.contentProviderId;
            if (Config.last("/core/contentProviders/providerInfo/show")) {
                this.oSystemContextPromise = sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                    .then(function (oCSTR) {
                        return oCSTR.getSystemContext(sContentProviderId);
                    })
                    .then(function (oSystemContext) {
                        oModel.setProperty("/properties/contentProviderLabel", oSystemContext.label);
                    })
                    .catch(function (oError) {
                        Log.error("DynamicTile.controller threw an error:", oError);
                    });
            }

            switch (oViewDataProperties.displayFormat) {
                case DisplayFormat.Flat:
                    oModel.setProperty("/properties/frameType", "OneByHalf");
                    break;
                case DisplayFormat.FlatWide:
                    oModel.setProperty("/properties/frameType", "TwoByHalf");
                    break;
                case DisplayFormat.StandardWide:
                    oModel.setProperty("/properties/frameType", "TwoByOne");
                    break;
                default: {
                    oModel.setProperty("/properties/frameType", "OneByOne");
                }
            }

            // set model, add content
            oView.setModel(oModel);
            // listen for changes of the size behavior, as the end user can change it in the settings,(if enabled)
            this._aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                oModel.setProperty("/properties/sizeBehavior", sSizeBehavior);
            });

            // Do not retrieve data initially, wait until the visible handler is called
            // otherwise requests may be triggered which are canceled immediately again.
        },

        // loads data once if not in configuration mode
        refreshHandler: function () {
            this.loadData(0);
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            if (isVisible) {
                if (!this.oDataRequest || this.timer === null) {
                    //tile is visible and data wasn't requested yet
                    this.initUpdateDynamicData();
                }
            } else {
                this.stopRequests();
            }
        },

        updateVisualPropertiesHandler: function (oNewProperties) {
            // existing properties
            var oPropertiesData = this.getView().getModel().getProperty("/properties");
            var bChanged = false;

            // override relevant property
            if (typeof oNewProperties.title !== "undefined") {
                oPropertiesData.title = oNewProperties.title;
                bChanged = true;
            }
            if (typeof oNewProperties.subtitle !== "undefined") {
                oPropertiesData.subtitle = oNewProperties.subtitle;
                bChanged = true;
            }
            if (typeof oNewProperties.icon !== "undefined") {
                oPropertiesData.icon = oNewProperties.icon;
                bChanged = true;
            }
            if (typeof oNewProperties.targetURL !== "undefined") {
                oPropertiesData.targetURL = oNewProperties.targetURL;
                bChanged = true;
            }
            if (typeof oNewProperties.info !== "undefined") {
                oPropertiesData.info = oNewProperties.info;
                bChanged = true;
            }

            if (bChanged) {
                this.getView().getModel().setProperty("/properties", oPropertiesData);
            }
        },

        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if (this.oDataRequest) {
                this.oDataRequest.abort();
            }
        },

        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function (oEvent) {
            if (oEvent.getSource().getScope && oEvent.getSource().getScope() === GenericTileScope.Display) {
                var sTargetURL = this.getView().getModel().getProperty("/properties/targetURL"),
                    sTitle = this.getView().getModel().getProperty("/properties/title");
                if (!sTargetURL) {
                    return;
                } else if (sTargetURL[0] === "#") {
                    hasher.setHash(sTargetURL);
                } else {
                    // add theURL to recent activity log
                    var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: sTitle,
                                appType: AppType.URL,
                                url: sTargetURL,
                                appId: sTargetURL
                            };
                            sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                        }

                        WindowUtils.openURL(sTargetURL, "_blank");
                }
            }
        },

        // dynamic data updater
        initUpdateDynamicData: function () {
            var oModel = this.getView().getModel();
            var sServiceUrl = oModel.getProperty("/configuration/serviceUrl");
            var iServiceRefreshInterval = oModel.getProperty("/configuration/serviceRefreshInterval");

            // if not service refresh interval - load number with no wait (interval is 0)
            if (!iServiceRefreshInterval) {
                iServiceRefreshInterval = 0;
            } else if (iServiceRefreshInterval < 10) {
                // log in English only
                Log.warning(
                    "Refresh Interval " + iServiceRefreshInterval + " seconds for service URL " + sServiceUrl
                    + " is less than 10 seconds, which is not supported. Increased to 10 seconds automatically.",
                    null, COMPONENT_NAME
                );

                // interval of 10 seconds is the minimum allowed for cyclic dynamic data fetching
                // (value of 0 means that no timer is used, e.g. no cyclic fetching but only once).
                iServiceRefreshInterval = 10;
            }
            if (sServiceUrl) {
                this.loadData(iServiceRefreshInterval);
            }
        },

        successHandlerFn: function (oResult) {
            // fetching a merged configuration which includes overrides from the dynamic data received
            this.updatePropertiesHandler(oResult);
        },

        // error handler
        errorHandlerFn: function (oMessage) {
            var sMessage = oMessage && oMessage.message ? oMessage.message : oMessage;
            var sUrl = this.getView().getModel().getProperty("/configuration/serviceUrl");

            if (oMessage.statusText === "Abort") {
                Log.info("Data request from service " + sUrl + " was aborted", null, COMPONENT_NAME);
            } else {
                if (oMessage.response) {
                    sMessage += " - " + oMessage.response.statusCode + " " + oMessage.response.statusText;
                }

                Log.error("Failed to update data via service " + sUrl + ": " + sMessage, null, COMPONENT_NAME);

                this._setTileIntoErrorState();
            }

        },

        _setTileIntoErrorState: function () {
            var oResourceBundle = utils.getResourceBundleModel().getResourceBundle();
            // update model
            this.updatePropertiesHandler({
                number: "???",
                info: oResourceBundle.getText("dynamic_data.error")
            });
        },

        // loads data from backend service
        loadData: function (iServiceRefreshInterval) {
            var oModel = this.getView().getModel();
            var sUrl = oModel.getProperty("/configuration/serviceUrl");
            var sContentProviderId = oModel.getProperty("/properties/contentProviderId");

            if (!sUrl) {
                Log.error("No service URL given!", COMPONENT_NAME);
                this._setTileIntoErrorState();
                return;
            }

            // keep request until url changes
            if (!this.oDataRequest || this.oDataRequest.sUrl !== sUrl) {
                if (this.oDataRequest) {
                    this.oDataRequest.destroy();
                }
                this.sRequestUrl = sUrl;
                this.oDataRequest = new DynamicTileRequest(sUrl, this.successHandlerFn.bind(this), this.errorHandlerFn.bind(this), sContentProviderId);
            } else if (this.oDataRequest) {
                this.oDataRequest.refresh();
            }

            //set the timer if required
            if (iServiceRefreshInterval > 0) {
                Log.info("Wait " + iServiceRefreshInterval + " seconds before calling " + sUrl + " again", null, COMPONENT_NAME);

                // call again later
                this.timer = setTimeout(this.loadData.bind(this, iServiceRefreshInterval), (iServiceRefreshInterval * 1000));
            }
        },

        // destroy handler stops requests
        onExit: function () {
            if (this.oDataRequest) {
                this.stopRequests();
                this.oDataRequest.destroy();
            }
            this._aDoableObject.off();
        },

        /*
        * Add target parameters returned from OData call to configured URL.
        */
        /**
         * Rewrites the given URL by appending target parameters.
         *
         * @param {string} sUrl The target URL to be rewritten
         * @param {array} aTargetParams The array of parameters to add to the URL
         * @returns {string} The rewritten URL containing the target parameters
         */
        addParamsToUrl: function (sUrl, aTargetParams) {
            var sParams = "", bUrlHasParams = sUrl.indexOf("?") !== -1, i;

            if (aTargetParams && aTargetParams.length > 0) {
                for (i = 0; i < aTargetParams.length; i = i + 1) {
                    sParams += aTargetParams[i];
                    if (i < aTargetParams.length - 1) {
                        sParams += "&";
                    }
                }
            }
            if (sParams.length > 0) {
                if (!bUrlHasParams) {
                    sUrl += "?";
                } else {
                    sUrl += "&";
                }
                sUrl += sParams;
            }
            return sUrl;
        },

        _normalizeNumber: function (numValue, maxCharactersInDisplayNumber, numberFactor, iNumberDigits) {
            var number;

            if (isNaN(numValue)) {
                number = numValue;
            } else {
                var oNForm = NumberFormat.getFloatInstance({ maxFractionDigits: iNumberDigits });

                if (!numberFactor) {
                    var absNumValue = Math.abs(numValue);
                    if (absNumValue >= 1000000000) {
                        numberFactor = "B";
                        numValue /= 1000000000;
                    } else if (absNumValue >= 1000000) {
                        numberFactor = "M";
                        numValue /= 1000000;
                    } else if (absNumValue >= 1000) {
                        numberFactor = "K";
                        numValue /= 1000;
                    }
                }
                number = oNForm.format(numValue);
            }

            var displayNumber = number;
            //we have to crop numbers to prevent overflow
            var cLastAllowedChar = displayNumber[maxCharactersInDisplayNumber - 1];
            //if last character is '.' or ',', we need to crop it also
            maxCharactersInDisplayNumber -= (cLastAllowedChar === "." || cLastAllowedChar === ",") ? 1 : 0;
            displayNumber = displayNumber.substring(0, maxCharactersInDisplayNumber);

            return {
                displayNumber: displayNumber,
                numberFactor: numberFactor
            };
        },
        /**
         * Get an object with attributes used by <code>DynamicTile</code>. Use values from static configuration as base and override by fields returned
         * in dynamic data.
         *
         * @param {string} oConfig Static configuration. Expects properties and dynamicData, in given object (each has its own fields).
         * @param {string} oDynamicData Dynamic data to be mixed in. Updates all static configuration data by data contained in that object. If the object
         *        contains a <code>results</code> array. The <code>number</code> fields will be accumulated.
         * @returns {object} An object containing the fields from the tile configuration mixed with the fields from dynamic data
         */
        // eslint-disable-next-line complexity
        updatePropertiesHandler: function (oData) {
            var errorText = utils.getResourceBundleModel().getResourceBundle().getText("dynamic_data.error");
            var oProperties = this.getView().getModel().getProperty("/properties");
            var oUpdatedProperties = {
                    title: oData.title || oProperties.title || "",
                    subtitle: oData.subtitle || oProperties.subtitle || "",
                    icon: oData.icon || oProperties.icon || "",
                    targetURL: oData.targetURL || oProperties.targetURL || "",

                    number_value: !isNaN(oData.number) ? oData.number : "...",
                    number_digits: oData.numberDigits >= 0 ? oData.numberDigits : 4,

                    info: oProperties.info === errorText ? oData.info || "" : oData.info || oProperties.info || "",

                    number_unit: oData.numberUnit || oProperties.number_unit || "",
                    number_state_arrow: oData.stateArrow || oProperties.number_state_arrow || "None",
                    number_value_state: oData.numberState || oProperties.number_value_state || "Neutral",
                    number_factor: oData.numberFactor || oProperties.number_factor || ""
                };

            // push target parameters to local array
            var aTargetURLParams = [];
            if (oData.targetParams) {
                aTargetURLParams.push(oData.targetParams);
            }

            // accumulate results field
            if (oData.results) {
                var sCurrentTargetParams, oCurrentNumber, i, n;
                var nSum = 0;
                for (i = 0, n = oData.results.length; i < n; i = i + 1) {
                    oCurrentNumber = oData.results[i].number || 0;
                    if (typeof oCurrentNumber === "string") {
                        oCurrentNumber = parseInt(oCurrentNumber, 10);
                    }
                    nSum = nSum + oCurrentNumber;
                    sCurrentTargetParams = oData.results[i].targetParams;
                    if (sCurrentTargetParams) {
                        // push target parameters to local array
                        aTargetURLParams.push(sCurrentTargetParams);
                    }
                }
                oUpdatedProperties.number_value = nSum;
            }

            // add target URL properties from local array to targetURL in case needed
            if (aTargetURLParams.length > 0) {
                oUpdatedProperties.targetURL = this.addParamsToUrl(oUpdatedProperties.targetURL, aTargetURLParams);
            }

            if (!isNaN(oData.number)) {
                // in case number is string isNaN returns true, but we need either to trim() it as the redundant " "
                // such as in case of "579 " as a value (Bug), parsing it to float causes redundant '.' even where it should not
                if (typeof oData.number === "string") {
                    oData.number = oData.number.trim();
                }

                var bShouldProcessDigits = this._shouldProcessDigits(oData.number, oData.numberDigits),
                    maxCharactersInDisplayNumber = oUpdatedProperties.icon ? 4 : 5;

                if (oData.number && oData.number.length >= maxCharactersInDisplayNumber || bShouldProcessDigits) {
                    var oNormalizedNumberData = this._normalizeNumber(oData.number, maxCharactersInDisplayNumber, oData.numberFactor, oData.numberDigits);

                    oUpdatedProperties.number_factor = oNormalizedNumberData.numberFactor;
                    oUpdatedProperties.number_value = oNormalizedNumberData.displayNumber;
                } else {
                    var oNForm = NumberFormat.getFloatInstance({ maxFractionDigits: maxCharactersInDisplayNumber });

                    oUpdatedProperties.number_value = oNForm.format(oData.number);
                }
            }

            //Added as part of bug fix. Incident ID: 1670054463
            if (oUpdatedProperties.number_value_state) {
                switch (oUpdatedProperties.number_value_state) {
                    case "Positive":
                        oUpdatedProperties.number_value_state = "Good";
                        break;
                    case "Negative":
                        oUpdatedProperties.number_value_state = "Error";
                        break;
                    default:
                }
            }
            oUpdatedProperties.sizeBehavior = Config.last("/core/home/sizeBehavior");

            // set data to display
            merge(oProperties, oUpdatedProperties);
            this.getView().getModel().refresh();
        },

        _shouldProcessDigits: function (sDisplayNumber, iDigitsToDisplay) {
            var nNumberOfDigits;

            sDisplayNumber = typeof (sDisplayNumber) !== "string" ? sDisplayNumber.toString() : sDisplayNumber;
            if (sDisplayNumber.indexOf(".") !== -1) {
                nNumberOfDigits = sDisplayNumber.split(".")[1].length;
                if (nNumberOfDigits > iDigitsToDisplay) {

                    return true;
                }
            }

            return false;
        },

        formatters: {
            leanURL: WindowUtils.getLeanURL
        }
    });
}, /* bExport= */ true);
