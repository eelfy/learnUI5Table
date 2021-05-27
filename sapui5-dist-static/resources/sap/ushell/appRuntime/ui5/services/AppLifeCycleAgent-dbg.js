// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
	"sap/ushell/appRuntime/ui5/AppRuntimeService",
	"sap/base/util/UriParameters",
	"sap/ui/thirdparty/URI",
	"sap/ui/thirdparty/jquery",
	"sap/ushell/appRuntime/ui5/services/TunnelsAgent",
	"sap/ushell/appRuntime/ui5/services/AppDelegationBootstrap",
	"sap/ui/Device",
	"sap/ui/core/BusyIndicator"
], function (AppRuntimePostMessageAPI, AppRuntimeService, UriParameters, URI, jQuery, tunnelsAgent, delegationBootstrap, Device, BusyIndicator) {
	"use strict";

	function AppLifeCycleAgent (oConfig) {
		var that = this,
			sAppResolutionModule,
			oAppResolution,
			oAppResolutionCache = {},
			fnCreateApplication,
			oCachedApplications = {},
			oRunningApp,
			fnRenderApp,
			eventHandlers = {};

		this.init = function (sModule, ofnCreateApplication, ofnRenderApp, sAppId, oAppInfo) {
			sAppResolutionModule = sModule;
			fnCreateApplication = ofnCreateApplication;
			fnRenderApp = ofnRenderApp;

			if (sAppId && oAppInfo) {
				oAppResolutionCache[sAppId] = oAppInfo;
			}
			//register this create & destroy as a appLifeCycleCommunication handler
			AppRuntimePostMessageAPI.registerCommHandlers({
				"sap.ushell.services.appLifeCycle": {
					"oServiceCalls": {
						"create": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data),
									sAppId = new UriParameters(oMsg.body.sUrl).get("sap-ui-app-id"),
									sHash;

								if (oMsg.body.sUrl.indexOf("#") > 0) {
									sHash = oMsg.body.sUrl.split("#")[1];
									window.hasher.replaceHash(decodeURIComponent(sHash));
								}

								//TODO: in order to support startupParameters simply pass oMsg.body.sUrl to the create so that ui5CommponetCreator can create the component with the parameters
								that.create(sAppId, oMsg.body.sUrl);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"destroy": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data);
								that.destroy(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"store": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data);
								that.store(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"restore": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data),
									sHash;

								if (oMsg.body.sUrl.indexOf("#") > 0) {
									sHash = oMsg.body.sUrl.split("#")[1];
									window.hasher.replaceHash(decodeURIComponent(sHash));
								}
								that.restore(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						}
					}
				},
				"sap.ushell.eventDelegation": {
					"oServiceCalls": {
						"registerEventHandler": {
							executeServiceCallFn: function (oServiceParams) {
								var sEventObject = JSON.parse(oServiceParams.oMessageData.body.sEventObject),
									eventKey = sEventObject.eventKey,
									eventData = sEventObject.eventData;
								if (eventHandlers.hasOwnProperty(eventKey)) {
									var handlersList = eventHandlers[eventKey];
									for (var handlerIndex = 0; handlerIndex < handlersList.length; handlerIndex++) {
										handlersList[handlerIndex](eventData);
									}
								}
								return new jQuery.Deferred().resolve().promise();
							}
						}
					}
				}
			});
			this.initialSetup();
		};

		this.initialSetup = function () {

			delegationBootstrap.bootstrap();

			AppRuntimeService.sendMessageToOuterShell(
				"sap.ushell.services.appLifeCycle.setup", {
					isStateful: true,
					isKeepAlive: true,
					lifecycle: {
						bActive: true,
						bSwitch: true,
						bStorageIdentifier: true
					},
					settings: {
						bTheme: true,
						bLocal: true
					},
					session: {
						bSignOffSupport: true,
						bExtendSessionSupport: true
					}
				});
		};

		this.restore = function (sStorageKey) {
			var oCachedEntry = oCachedApplications[sStorageKey],
				oApp = oCachedEntry.getComponentInstance();

			oCachedEntry.setVisible(true);

			if (oApp) {
				if (oApp.restore) {
					oApp.restore();
				}

				if (oApp.getRouter && oApp.getRouter() && oApp.getRouter().initialize) {
					oApp.getRouter().initialize();
				}

				oRunningApp = oCachedEntry;
			}
		};

		this.store = function (sStorageKey) {
			var oCachedEntry = oRunningApp,
				oApp;

			oCachedApplications[sStorageKey] = oCachedEntry;

			oApp = oCachedEntry.getComponentInstance();
			oCachedEntry.setVisible(false);

			if (oApp) {
				if (oApp.suspend) {
					oApp.suspend();
				}
				if (oApp.getRouter && oApp.getRouter()) {
					oApp.getRouter().stop();
				}
			}
		};

		this.getURLParameters = function (oUrlParameters) {
			return new Promise(function (fnResolve, fnReject) {
				if (oUrlParameters.hasOwnProperty("sap-intent-param")) {
					var sAppStateKey = oUrlParameters["sap-intent-param"];
					AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData", { "sAppStateKey": sAppStateKey })
						.then(function (sParameters) {
							delete oUrlParameters["sap-intent-param"];
							var oUrlParametersExpanded = jQuery.extend({}, oUrlParameters, (new URI("?" + sParameters)).query(true), true);
							fnResolve(oUrlParametersExpanded);
						}, function (sError) {
							fnResolve(oUrlParameters);
						});
				} else {
					fnResolve(oUrlParameters);
				}
			});
		};

		this.getAppInfo = function (appId, sUrl) {
			return new Promise(function (fnResolve) {
				function fnGetAppInfo() {
					oAppResolution.getAppInfo(appId, sUrl).then(function (oAppInfo) {
						oAppResolutionCache[appId] = JSON.parse(JSON.stringify(oAppInfo));
						fnResolve(oAppInfo);
					});
				}

				if (oAppResolutionCache[appId]) {
					fnResolve(JSON.parse(JSON.stringify(oAppResolutionCache[appId])));
				} else if (oAppResolution) {
					fnGetAppInfo();
				} else {
					sap.ui.require([sAppResolutionModule.replace(/\./g, "/")], function (oObj) {
						oAppResolution = oObj;
						fnGetAppInfo();
					});
				}
			});
		};

		this.create = function (appId, sUrl) {
			//BusyIndicator work in hidden iframe only in chrome
			if (Device.browser.chrome) {
				BusyIndicator.show(0);
			}
			var applicationInfoPromis = new Promise(function (fnResolve) {
				that.getAppInfo(appId, sUrl).then(function (oAppInfo) {
					fnResolve(oAppInfo);
				});
			}).then(function (oAppInfo) {
				that.getURLParameters(new URI(sUrl).query(true)).then(function (oURLParameters) {
					fnCreateApplication(appId, oURLParameters, oAppInfo)
						.then(function (oResolutionResult) {
							fnRenderApp(oResolutionResult);
						});
				});
			});

			return applicationInfoPromis;
		};

		this.setComponent = function (oApp) {
			oRunningApp = oApp;
		};

		this.destroy = function (sStorageKey) {
			// oCachedApplications[appId].getRouter().stop();
			if (sStorageKey) {
				if (oCachedApplications[sStorageKey] === oRunningApp) {
					oRunningApp = undefined;
				}
				oCachedApplications[sStorageKey].destroy();
				delete oCachedApplications[sStorageKey];
			} else if (oRunningApp) {
				oRunningApp.destroy();
				oRunningApp = undefined;
			}
		};

		this.jsonStringifyFn = function (oJson) {
			var sResult = JSON.stringify(oJson, function (key, value) {
				return (typeof value === "function") ? value.toString() : value;
			});

			return sResult;
		};
	}

	return new AppLifeCycleAgent();
}, true);

