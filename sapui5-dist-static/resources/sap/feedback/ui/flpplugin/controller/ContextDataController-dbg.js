/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend", "../utils/Constants",
		"../data/AppContextData",
		"../data/PushContextData"
	],
	function(Object, extend, Constants, AppContextData, PushContextData) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.controller.ContextDataController", {
			_oConfig: {},
			_oShellUIService: null,
			_oAppContextData: null,
			_oSessionData: null,
			constructor: function(oConfig, oShellUIService) {
				this._oConfig = oConfig;
				this._oShellUIService = oShellUIService;
			},
			init: function() {
				if (this._oConfig && this._oShellUIService) {
					this._oAppContextData = new AppContextData(this._oShellUIService);
					this._collectSessionContextData(this._oConfig.getTenantId(), this._oConfig.getTenantRole(), this._oConfig.getProductName(), this._oConfig.getPlatformType());
				} else {
					this._resetContextData(Constants.E_PLUGIN_STATE.init);
				}
			},
			updateContextData: function(sTargetIntercept, oEventData) {
				return new Promise(function(fnResolve, fnReject) {
					this._resetContextData(Constants.E_PLUGIN_STATE.update);
					var iDataFormat = this._oConfig.getDataFormat();
					this._setSessionContextData(iDataFormat);
					if (sTargetIntercept === Constants.E_INTERCEPT_ID.push) {
						this._setPushContextData(oEventData.contextData);
					}
					this._collectAppContextData(iDataFormat).then(function() {
							fnResolve();
						},
						function(error) {
							fnReject();
						});
				}.bind(this));
			},
			getContextDataAsUrlParameter: function() {
				var sSurveyUrl = "";

				if (this._oConfig.getDataFormat() === Constants.E_DATA_FORMAT.version1) {
					sSurveyUrl += "?Q_Language=" + encodeURIComponent(sap.qtxAppContext.language);
					sSurveyUrl += "&language=" + encodeURIComponent(sap.qtxAppContext.language);
					sSurveyUrl += "&ui5Version=" + encodeURIComponent(sap.qtxAppContext.ui5Version);
					sSurveyUrl += "&ui5Theme=" + encodeURIComponent(sap.qtxAppContext.ui5Theme);
					sSurveyUrl += "&fioriId=" + encodeURIComponent(sap.qtxAppContext.fioriId);
					sSurveyUrl += "&appVersion=" + encodeURIComponent(sap.qtxAppContext.appVersion);
					sSurveyUrl += "&componentId=" + encodeURIComponent(sap.qtxAppContext.componentId);
					sSurveyUrl += "&appTitle=" + encodeURIComponent(sap.qtxAppContext.appTitle);
					sSurveyUrl += "&ach=" + encodeURIComponent(sap.qtxAppContext.ach);
					sSurveyUrl += "&tenantId=" + encodeURIComponent(sap.qtxAppContext.tenantId);
					sSurveyUrl += "&tenantRole=" + encodeURIComponent(sap.qtxAppContext.tenantRole);
					sSurveyUrl += "&pluginState=" + encodeURIComponent(sap.qtxAppContext.pluginState);
				} else if (this._oConfig.getDataFormat() === Constants.E_DATA_FORMAT.version2) {
					sSurveyUrl += "?Q_Language=" + encodeURIComponent(sap.qtx.appcontext.languageTag);
					sSurveyUrl += "&language=" + encodeURIComponent(sap.qtx.appcontext.languageTag);
					sSurveyUrl += "&appFrameworkId=" + encodeURIComponent(sap.qtx.appcontext.appFrameworkId);
					sSurveyUrl += "&appFrameworkVersion=" + encodeURIComponent(sap.qtx.appcontext.appFrameworkVersion);
					sSurveyUrl += "&theme=" + encodeURIComponent(sap.qtx.appcontext.theme);
					sSurveyUrl += "&appId=" + encodeURIComponent(sap.qtx.appcontext.appId);
					sSurveyUrl += "&appVersion=" + encodeURIComponent(sap.qtx.appcontext.appVersion);
					sSurveyUrl += "&technicalAppComponentId=" + encodeURIComponent(sap.qtx.appcontext.technicalAppComponentId);
					sSurveyUrl += "&appTitle=" + encodeURIComponent(sap.qtx.appcontext.appTitle);
					sSurveyUrl += "&appSupportInfo=" + encodeURIComponent(sap.qtx.appcontext.appSupportInfo);
					if (sap.qtx.session) {
						sSurveyUrl += "&tenantId=" + encodeURIComponent(sap.qtx.session.tenantId);
						sSurveyUrl += "&tenantRole=" + encodeURIComponent(sap.qtx.session.tenantRole);
						sSurveyUrl += "&productName=" + encodeURIComponent(sap.qtx.session.productName);
						sSurveyUrl += "&platformType=" + encodeURIComponent(sap.qtx.session.platformType);
					}
					if (sap.qtx.debug) {
						sSurveyUrl += "&pluginState=" + encodeURIComponent(sap.qtx.debug.pluginState);
					}
					if (sap.qtx.push) {
						sSurveyUrl += "&pushSrcType=" + encodeURIComponent(sap.qtx.push.srcType);
						sSurveyUrl += "&pushSrcAppId=" + encodeURIComponent(sap.qtx.push.srcAppId);
						sSurveyUrl += "&pushSrcTrigger=" + encodeURIComponent(sap.qtx.push.srcAppTrigger);
					}
				}

				return sSurveyUrl;
			},
			_setPushContextData: function(oPushData) {
				if (!sap.qtx) {
					sap.qtx = {};
				}
				sap.qtx.push = {};
				sap.qtx.push.srcType = oPushData.getSourceType();
				sap.qtx.push.srcAppId = oPushData.getSourceAppId();
				sap.qtx.push.srcAppTrigger = oPushData.getSourceAppTrigger();
			},
			_collectSessionContextData: function(sTenantId, sRole, sProductName, sPlatformType) {
				this._oSessionData = {
					tenantId: sTenantId,
					tenantRole: sRole,
					productName: sProductName,
					platformType: sPlatformType
				};
			},
			_setSessionContextData: function(iDataFormat) {
				if (iDataFormat === Constants.E_DATA_FORMAT.version1) {
					if (!sap.qtxAppContext) {
						sap.qtxAppContext = {};
					}
					sap.qtxAppContext = extend(sap.qtxAppContext, this._oSessionData);

				} else if (iDataFormat === Constants.E_DATA_FORMAT.version2) {
					if (!sap.qtx) {
						sap.qtx = {};
					}
					sap.qtx.session = this._oSessionData;
				}
			},
			_resetContextData: function(iPluginState) {
				sap.qtxAppContext = {};
				sap.qtxAppContext.pluginState = iPluginState;
				if (!sap.qtx) {
					sap.qtx = {};
				}
				sap.qtx.appcontext = {};
				sap.qtx.push = {};
				sap.qtx.debug = {
					pluginState: iPluginState
				};
			},

			_collectAppContextData: function(iDataFormat) {
				return this._oAppContextData.getData(iDataFormat).then(function(oContextData) {
					this._setAppContextData(oContextData, iDataFormat, Constants.E_PLUGIN_STATE.update);
				}.bind(this));
			},
			_setAppContextData: function(oContextData, iDataFormat, iPluginState) {
				if (iDataFormat === Constants.E_DATA_FORMAT.version1) {
					sap.qtxAppContext = extend(sap.qtxAppContext, oContextData);
					sap.qtxAppContext.pluginState = iPluginState;
				} else if (iDataFormat === Constants.E_DATA_FORMAT.version2) {
					sap.qtx.appcontext = oContextData;
					sap.qtx.debug = {
						pluginState: iPluginState
					};
				}
			}

		});
	});