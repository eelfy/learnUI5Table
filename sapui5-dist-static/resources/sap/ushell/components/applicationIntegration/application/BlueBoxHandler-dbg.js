// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.88.1
 */
sap.ui.define([
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/EventHub",
    "sap/ui/thirdparty/URI",
    "sap/ushell/components/applicationIntegration/application/PostMessageAPI",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/base/util/UriParameters",
    "sap/base/security/encodeXML"
], function (Application, ApplicationContainer, EventHub, URI, PostMessageAPI, jQuery, Log, UriParameters, encodeXML) {
    "use strict";

    function BlueBoxHandler () {
        var oCacheStorage,
            oMapAgentCallbacks = {},
            that = this,
            AppLifeCycle,
            oCustomCapabilitiesHandlers = {
                "isStateful": {
                    handler: function (appCapabilities, oContainer) {
                        if (appCapabilities && (appCapabilities.enabled === true || appCapabilities === true)) {
                            return true;
                        }

                        return false;
                    }
                },
                "isGUI": {
                    handler: function (appCapabilities, oContainer) {
                        if (appCapabilities && appCapabilities.protocol === "GUI") {
                            return true;
                        }

                        return false;
                    }
                },
                "isGUIStateful": {
                    handler: function (appCapabilities, oContainer) {
                        return that.isCapUT(oContainer, "isGUI") && that.isCapUT(oContainer, "isStateful");
                    }
                },
                "isFLP": {
                    handler: function (appCapabilities, oContainer) {
                        return !that.isCapUT(oContainer, "isGUI") && that.isCapUT(oContainer, "isStateful");
                    }
                }
            },
            oBlueBoxContainer = {},
            oStartupPlugins = {},
            oSupportedTypes = {},
            oHandlers = {
                setup: function (oTarget, sStorageKey) {
                },

                //we dont know the app Id we pass te hole url, in the Storage we manage it using sCacheId (this is for the keep alive)
                create: function (oInnerControl, sUrl, sStorageKey, oTarget) {
                    var oDeferred = new jQuery.Deferred(),
                        oFLPParams,
                        oPostParams;

                    function callPostMessage () {
                        if (oFLPParams) {
                            oFLPParams["sap-flp-url"] = sap.ushell.Container.getFLPUrl(true);
                            oPostParams["sap-flp-params"] = encodeXML(JSON.stringify(oFLPParams));
                        }

                        oBlueBoxContainer[oInnerControl].lastAction = LAST_ACTION.APP_OPENED;
                        sap.ui.getCore().getEventBus().publish("launchpad", "appOpening", oTarget);
                        Application.postMessageToIframeApp(
                            oInnerControl, "sap.ushell.services.appLifeCycle", "create", oPostParams, true)
                            .then(function () {
                                oBlueBoxContainer[oInnerControl].currentAppTarget = oTarget;
                                sap.ui.getCore().getEventBus().publish("sap.ushell", "appOpened", oTarget);
                                oDeferred.resolve();
                            });
                    }

                    sUrl = ApplicationContainer.prototype._checkNwbcUrlAdjustment(oInnerControl, oTarget.applicationType, sUrl);
                    sUrl = ApplicationContainer.prototype._adjustURLForIsolationOpeningWithoutURLTemplate(sUrl);
                    oPostParams = {
                        sCacheId: sStorageKey,
                        sUrl: sUrl,
                        sHash: window.hasher.getHash()
                    };
                    if (that._isOpenWithPost() === true) {
                        var aInfoArray = [];
                        var aKeysArray = ApplicationContainer.prototype._getParamKeys(sUrl, aInfoArray);

                        if (aKeysArray.length > 0) {
                            var oService = sap.ushell.Container.getService("CrossApplicationNavigation");
                            oService.getAppStateData(aKeysArray).then(function (aDataArray) {
                                oFLPParams = {};
                                aInfoArray.forEach(function (item, index) {
                                    if (aDataArray[index][0]) {
                                        oFLPParams[item] = aDataArray[index][0];
                                    }
                                });
                                callPostMessage();
                            }, function (sError) {
                                callPostMessage();
                            });
                        } else {
                            oFLPParams = {};
                            callPostMessage();
                        }
                    } else {
                        callPostMessage();
                    }

                    return oDeferred.promise();
                },
                destroy: function (oInnerControl, sStorageKey) {
                    var oPromise;

                    if (oBlueBoxContainer[oInnerControl].lastAction === LAST_ACTION.APP_CLOSED) {
                        return Promise.resolve();
                    }
                    oBlueBoxContainer[oInnerControl].lastAction = LAST_ACTION.APP_CLOSED;
                    oPromise = Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "destroy", {
                        sCacheId: sStorageKey
                    }, true);

                    oPromise.then(function () {
                        sap.ui.getCore().getEventBus().publish("sap.ushell", "appClosed", oBlueBoxContainer[oInnerControl].currentAppTarget);
                        oBlueBoxContainer[oInnerControl].currentAppTarget = undefined;
                    });
                    return oPromise;
                },
                store: function (oInnerControl, sStorageKey) {
                    var oPromise;

                    if (oBlueBoxContainer[oInnerControl].lastAction === LAST_ACTION.APP_CLOSED) {
                        return Promise.resolve();
                    }
                    oBlueBoxContainer[oInnerControl].lastAction = LAST_ACTION.APP_CLOSED;
                    oPromise = Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "store", {
                        sCacheId: sStorageKey
                    }, true);

                    oPromise.then(function () {
                        sap.ui.getCore().getEventBus().publish("sap.ushell", "appClosed", oBlueBoxContainer[oInnerControl].currentAppTarget);
                        oBlueBoxContainer[oInnerControl].currentAppTarget = undefined;
                    });
                    return oPromise;
                },
                restore: function (oInnerControl, sStorageKey, oTarget) {
                    var oPromise;

                    oBlueBoxContainer[oInnerControl].lastAction = LAST_ACTION.APP_OPENED;
                    sap.ui.getCore().getEventBus().publish("launchpad", "appOpening", oTarget);
                    oPromise = Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "restore", {
                        sCacheId: sStorageKey,
                        sUrl: oTarget.url,
                        sHash: window.hasher.getHash()
                    }, true);

                    oPromise.then(function () {
                        oBlueBoxContainer[oInnerControl].currentAppTarget = oTarget;
                        sap.ui.getCore().getEventBus().publish("sap.ushell", "appOpened", oTarget);
                    });

                    return oPromise;
                }
            },
            oBasicStatefullContainerCapabilities = [
                {
                    service: "sap.ushell.services.appLifeCycle",
                    action: "create"
                }, {
                    service: "sap.ushell.services.appLifeCycle",
                    action: "destroy"
                }
            ],
            LAST_ACTION = {
                APP_OPENED: "app_opened",
                APP_CLOSED: "app_closed"
            };

        this._isOpenWithPost = function () {
            return ((new UriParameters(window.location.href)).get("sap-post") === "true");
        };

        this.subscribePluginAgents = function (aAgentsLst, fnCallback) {
            Object.keys(aAgentsLst).map(function (sKey) {
                if (!oMapAgentCallbacks[sKey]) {
                    oMapAgentCallbacks[sKey] = [];
                }

                oMapAgentCallbacks[sKey].push(fnCallback);
            });
        };

        this._managePluginAgents = function (aComponentsWithAgent) {
            var that = this;

            var fnHandlePluginLife = function (oBlueBox, oInst, oStatus, sPluginAgentName) {
                var oStateToInterfacesMap = {
                        "loading": {
                            sInterface: "agentLoading"
                        },
                        "started": {
                            sInterface: "agentStart"
                        },
                        "exit": {
                            sInterface: "agentExit"
                        }
                    },
                    oInterfaceEntry = oStateToInterfacesMap[oStatus.status];
                if (oInterfaceEntry) {
                    if (oInst[oInterfaceEntry.sInterface]) {
                        oInst[oInterfaceEntry.sInterface](oBlueBox, sPluginAgentName, oStatus);
                    }
                }
            };

            //subscribe
            aComponentsWithAgent.forEach(function (oManagedPlugin) {
                var oInst = oManagedPlugin.pluginComp.componentHandle.getInstance();

                // check in all BlueBox for the oManagedPlugin.agents and notify that plugin
                Object.keys(oBlueBoxContainer).map(function (sBBKey) {
                    Object.keys(oManagedPlugin.agents).map(function (sPluginAgentName) {
                        if (oBlueBoxContainer[sBBKey].PlugIns && oBlueBoxContainer[sBBKey].PlugIns[sPluginAgentName]) {
                            var oStatus = oBlueBoxContainer[sBBKey].PlugIns[sPluginAgentName];

                            fnHandlePluginLife(oBlueBoxContainer[sBBKey].BlueBox, oInst, oStatus, sPluginAgentName);
                        }
                    });
                });

                that.subscribePluginAgents(oManagedPlugin.agents, function (oBlueBox, sPluginAgentName, oStatus) {
                    fnHandlePluginLife(oBlueBox, oInst, oStatus, sPluginAgentName);
                });
            });
        };

        this.startPluginAgentsLifeCycle = function () {
            var that = this;

            sap.ushell.Container.getServiceAsync("PluginManager").then(function (oPluginManager) {
                oPluginManager.registerAgentLifeCycleManager(that._managePluginAgents.bind(that));
            });
        };

        //API:
        //
        //LRU(limit)
        //  Initialize LRU cache with default limit being 10 items
        this.init = function (oSetup, inConfig, inAppLifeCycle) {
            var that = this;

            oCacheStorage = {};
            Application.init(this);
            AppLifeCycle = inAppLifeCycle;

            EventHub.once("StepDone").do(function () {
                that.startPluginAgentsLifeCycle();
            });

            EventHub.once("pluginConfiguration").do(function (oConf) {
                var oStartupPlugins = {};

                Object.keys(oConf).forEach(function (sKey) {
                    if (oConf[sKey].config && oConf[sKey].config["sap-component-agents"]) {
                        oStartupPlugins = jQuery.extend(true, oStartupPlugins, oConf[sKey].config["sap-component-agents"]);
                    }
                });
                that.setStartupPlugins(oStartupPlugins);
            });

            if (inConfig) {
                oSupportedTypes = jQuery.extend(true, oSupportedTypes, inConfig.supportedTypes);
            }

            PostMessageAPI.registerShellCommunicationHandler({
                "sap.ushell.appRuntime": {
                    oServiceCalls: {
                        "startupPlugins": {
                            executeServiceCallFn: function (oServiceParams) {
                                return new jQuery.Deferred().resolve(oStartupPlugins).promise();
                            }
                        },
                        "shellCheck": {
                            executeServiceCallFn: function (oServiceParams) {
                                return new jQuery.Deferred().resolve({
                                    InShell: true
                                }).promise();
                            }
                        }
                    }
                },
                "sap.ushell.services.pluginManager": {
                    oServiceCalls: {
                        "status": {
                            executeServiceCallFn: function (oServiceParams) {
                                var oStatus = oServiceParams.oMessageData.body,
                                    aListSubscriptions;

                                if (oServiceParams.oContainer && oBlueBoxContainer[oServiceParams.oContainer] && oStatus && oStatus.name &&
                                    oBlueBoxContainer[oServiceParams.oContainer].PlugIns[oStatus.name]) {
                                    oBlueBoxContainer[oServiceParams.oContainer].PlugIns[oStatus.name].status = oStatus.status;

                                    aListSubscriptions = oMapAgentCallbacks[oStatus.name];

                                    if (aListSubscriptions) {
                                        aListSubscriptions.map(function (fnCallback) {
                                            fnCallback(oServiceParams.oContainer, oStatus.name, oStatus);
                                        });
                                    }

                                    return new jQuery.Deferred().resolve(oBlueBoxContainer[oServiceParams.oContainer].PlugIns).promise();
                                }

                                return new jQuery.Deferred().resolve({}).promise();
                            }
                        }
                    }
                }
            });
        };

        this.setStartupPlugins = function (oConfiguraton) {
            oStartupPlugins = JSON.parse(JSON.stringify(oConfiguraton));

            Object.keys(oStartupPlugins).forEach(function(sKey) {
                oStartupPlugins[sKey].status = "unknown";
            });
        };

        this.getPluginAgentStatus = function (oBlueBox, sAgent) {
            return JSON.parse(JSON.stringify(oBlueBoxContainer[oBlueBox].PlugIns[sAgent]));
        };

        this.isStatefulContainerSupported = function  (oBlueBox) {
            var bIsSupported =
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "create") &&
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "destroy");

            return bIsSupported;
        };

        this.isKeepAliveSupported = function  (oBlueBox) {
            var bIsSupported =
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "store") &&
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "restore");

            return bIsSupported;
        };

        this.mapCapabilities= function (oContainer, aCaps) {
            this.setCapabilities(oContainer, aCaps);
        };

        this.getCapabilities = function (oBlueBox) {
            return oBlueBoxContainer[oBlueBox].oCapMap;
        };

        this.isCapabilitySupported = function (oBlueBox, sServiceName, sInterface) {
            if (oBlueBoxContainer[oBlueBox] && oBlueBoxContainer[oBlueBox].oCapMap && oBlueBoxContainer[oBlueBox].oCapMap[sServiceName]) {
                    return !!oBlueBoxContainer[oBlueBox].oCapMap[sServiceName][sInterface];
            }

            return false;
        };

        this.setCapabilities = function (oBlueBox, oCap) {
            var oCapMap;

            if (!oBlueBoxContainer[oBlueBox]) {
                this.InitBlueBoxBD(oBlueBox);
            }

            if (!oBlueBoxContainer[oBlueBox].oCapMap) {
                oBlueBoxContainer[oBlueBox].oCapMap = {};
            }

            oCapMap = oBlueBoxContainer[oBlueBox].oCapMap;

            Object.keys(oCap).forEach(function (key) {
                var  oCapEntry = oCap[key],
                    oCapMapService;

                if (!oCapMap[oCapEntry.service]) {
                    oCapMap[oCapEntry.service] = {};
                }

                oCapMapService = oCapMap[oCapEntry.service];

                oCapMapService[oCapEntry.action] = true;

            });

            // set stateful in order to disable rendering of container
            if (!oBlueBox.getIsStateful() && this.isStatefulContainerSupported(oBlueBox)) {
                oBlueBox.setIsStateful(true);
            }

        };

        this.removeCapabilities = function (oBlueBox) {
            if (oBlueBoxContainer[oBlueBox]) {
                oBlueBoxContainer[oBlueBox].oCapMap = {};
                oBlueBox.setIsStateful(false);
            }
        };

        this.hasIFrame = function (oBlueBox) {
            if (oBlueBox && oBlueBox._getIFrame) {
                return true;
            }

            return false;
        };

        this.getStorageKey = function (oBlueBox) {
            return oBlueBoxContainer[oBlueBox].sStorageKey;
        };

        this.InitBlueBoxBD = function (oBlueBox) {
            oBlueBoxContainer[oBlueBox] = {
                BlueBox: oBlueBox,
                PlugIns:  JSON.parse(JSON.stringify(oStartupPlugins)),
                lastAction: undefined
            };

        };

        this.setAppCapabilities = function (oBlueBox, oTarget) {
            if (!oBlueBoxContainer[oBlueBox]) {
                this.InitBlueBoxBD(oBlueBox);
            }

            oBlueBoxContainer[oBlueBox].currentAppTarget = oTarget;
            oBlueBoxContainer[oBlueBox].appCapabilities = oTarget.appCapabilities;
            if (oTarget.appCapabilities && oTarget.appCapabilities.statefulContainer === true) {
                this.setCapabilities(oBlueBox, oBasicStatefullContainerCapabilities);
            }
        };

        this.forEach = function (callback) {
            var key;

            for (key in oBlueBoxContainer) {
                if (oBlueBoxContainer.hasOwnProperty(key)) {
                    callback(oBlueBoxContainer[key].BlueBox);
                }
            }
        };

        this.isCapByTarget = function (oTarget, attr) {
            // check if we have custom handling for this attribute
            if (oTarget.appCapabilities === undefined) {
                return false;
            }

            if (oCustomCapabilitiesHandlers[attr] && oTarget && oTarget.appCapabilities) {
                return oCustomCapabilitiesHandlers[attr].handler(oTarget.appCapabilities);
            }
            // get the attribute value from the appCapabilities
            // if not define return false
            return oTarget.appCapabilities[attr] || false;
        };

        this.isCapUT = function (oBlueBox, attr) {
            // check if we have custom handling for this attribute
            var oBBInstance = oBlueBoxContainer[oBlueBox];

            // check if we have custom handling for this attribute
            if (oBBInstance  === undefined|| oBBInstance.appCapabilities === undefined) {
                return false;
            }

            if (oCustomCapabilitiesHandlers[attr] && oBBInstance) {
                return oCustomCapabilitiesHandlers[attr].handler(oBBInstance.appCapabilities, oBlueBox);
            }
            // get the attribute value from the appCapabilities
            // if not define return false
            return oBBInstance.appCapabilities[attr] || false;
        };

        this.setStorageKey = function (oBlueBox, setStorageKey) {
            if (!oBlueBoxContainer[oBlueBox]) {
                this.InitBlueBoxBD(oBlueBox);
            }

            oBlueBoxContainer[oBlueBox].sStorageKey = setStorageKey;
        };

        this.getStorageKey = function (oBlueBox) {
            if (!oBlueBoxContainer[oBlueBox]) {
                return undefined;
            }
            return oBlueBoxContainer[oBlueBox].sStorageKey;
        };

        this.getHandler = function () {
            return oHandlers;
        };

        this._getBlueBoxCacheKey = function (sUrl) {
            var oUri,
                sHost,
                oParams,
                sIframeHint = "",
                sBlueBoxCacheKey;

            //special cases
            if (sUrl === undefined || sUrl === "" || sUrl === "../") {
                return sUrl;
            }

            try {
                oUri = new URI(sUrl);
                sHost = oUri.hostname();
                if (sHost === undefined || sHost === "") {
                    sHost = oUri.path();
                    if (sHost === undefined || sHost === "") {
                        sHost = sUrl;
                    }
                }
                oParams = oUri.query(true);
                if (oParams["sap-iframe-hint"]) {
                    sIframeHint = "@" + oParams["sap-iframe-hint"];
                }
            } catch (ex) {
                Log.error(
                    "URL '" + sUrl + "' can not be parsed: " + ex,
                    "sap.ushell.components.applicationIntegration.application.BlueBoxHandler"
                );
                sHost = sUrl;
            }

            sBlueBoxCacheKey = sHost + sIframeHint;
            return sBlueBoxCacheKey;
        };

        this.deleteStateFul = function (sUrl) {
            var sBlueBoxCacheKey = this._getBlueBoxCacheKey(sUrl);

            return this.delete(sBlueBoxCacheKey);
        };

        this.getStateFul = function (sUrl) {
            if (sUrl === undefined || Object.keys(oCacheStorage).length === 0) {
                return undefined;
            }
            var sBlueBoxCacheKey = this._getBlueBoxCacheKey(sUrl);

            if (sBlueBoxCacheKey !== undefined) {
                return this.get(sBlueBoxCacheKey);
            } else {
                return undefined;
            }
        };

        this.destroyApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "destroy", {
                appId: sAppId
            });
        };

        this.openApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "create", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        this.storeApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "store", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        this.restoreApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "restore", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        //delete(sUrl)
        //  delete a single entry from the cols start cache
        this.delete = function (sUrl) {
            if (oCacheStorage[sUrl]) {
                delete oCacheStorage[sUrl];
            }
        };


        //get(sUrl)
        //  Retrieve a single entry from the cols start cache
        this.get = function (sUrl) {
            return oCacheStorage[sUrl];
        };

        this.getById = function (sId) {
            for (var sKey in oCacheStorage) {
                if (oCacheStorage.hasOwnProperty(sKey)) {
                    var oEntry = oCacheStorage[sKey];

                    if (oEntry.sId === sId) {
                        return oEntry;
                    }
                }
            }
        };

        //set(key, value)
        //  Change or add a new value in the cache
        //  We overwrite the entry if it already exists
        this.set = function (sUrl, oIframe) {
            var sBlueBoxCacheKey = this._getBlueBoxCacheKey(sUrl);

            oCacheStorage[sBlueBoxCacheKey] = oIframe;
        };
    }

    return new BlueBoxHandler();
}, /* bExport= */ true);
