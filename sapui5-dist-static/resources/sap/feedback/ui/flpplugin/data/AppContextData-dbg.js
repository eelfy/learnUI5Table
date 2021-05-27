/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "sap/ui/VersionInfo", "../utils/Constants", "../utils/Utils"],
	function(Object, Log, VersionInfo, Constants, Utils) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.data.AppContextData", {
			_dataV1: null,
			_dataV2: null,
			_oShellUIService: null,

			constructor: function(oShellUIService) {
				this._oShellUIService = oShellUIService;
			},
			getData: function(iFormat) {
				return this._updateData().then(function() {
					if (iFormat === Constants.E_DATA_FORMAT.version1) {
						return this._dataV1;
					} else if (iFormat === Constants.E_DATA_FORMAT.version2) {
						return this._dataV2;
					}
					return null;
				}.bind(this));
			},
			_updateData: function() {
				return new Promise(function(fnResolve, fnReject) {
					this._resetData();
					this._collectData().then(function(oContextData) {
						this._setData(oContextData);
						fnResolve();
					}.bind(this));
				}.bind(this));
			},
			_resetData: function() {
				this._dataV1 = {
					ui5Version: Constants.S_DEFAULT_VALUE,
					ui5Theme: Constants.S_DEFAULT_VALUE,
					fioriId: Constants.S_DEFAULT_VALUE,
					appTitle: Constants.S_DEFAULT_VALUE,
					language: Constants.S_DEFAULT_VALUE,
					componentId: Constants.S_DEFAULT_VALUE,
					appVersion: Constants.S_DEFAULT_VALUE,
					ach: Constants.S_DEFAULT_VALUE
				};

				/*
                “appIntent”
                "productId",
                "productVersion"
				*/
				this._dataV2 = {
					appFrameworkId: Constants.S_DEFAULT_VALUE,
					appFrameworkVersion: Constants.S_DEFAULT_VALUE,
					theme: Constants.S_DEFAULT_VALUE,
					appId: Constants.S_DEFAULT_VALUE,
					appTitle: Constants.S_DEFAULT_VALUE,
					languageTag: Constants.S_DEFAULT_VALUE,
					technicalAppComponentId: Constants.S_DEFAULT_VALUE,
					appVersion: Constants.S_DEFAULT_VALUE,
					appSupportInfo: Constants.S_DEFAULT_VALUE
				};
			},
			_setData: function(oContextData) {
				this._dataV1 = {
					ui5Version: oContextData.appFrameworkVersion,
					ui5Theme: oContextData.theme,
					fioriId: oContextData.appId,
					appTitle: oContextData.appTitle,
					language: oContextData.languageTag,
					componentId: oContextData.technicalAppComponentId,
					appVersion: oContextData.appVersion,
					ach: oContextData.appSupportInfo
				};

				this._dataV2 = oContextData;
			},
			_getFioriAppId: function(oCurrentApplication) {
				if (this._getIsLaunchpad(oCurrentApplication)) {
					return Promise.resolve(Constants.S_LAUNCHPAD_VALUE);
				} else {
					return oCurrentApplication
						.getTechnicalParameter("sap-fiori-id")
						.then(function(aFioriId) {
							var appId = aFioriId && aFioriId.length > 0 ? aFioriId[0] : Constants.S_DEFAULT_VALUE;
							if (!appId || appId.length === 0) {
								return Constants.S_DEFAULT_VALUE;
							}
							return appId;
						});
				}
			},

			_getUserInfo: function() {
				return sap.ushell.Container.getService("UserInfo");
			},
			_getIsLaunchpad: function(oCurrentApplication) {
				return oCurrentApplication.homePage;
			},
			_getAppTitle: function(oComponentInstance) {
				var sTitle = this._oShellUIService.getTitle();
				if (!sTitle) {
					sTitle = oComponentInstance.getManifestEntry("sap.app").title;
				}

				return sTitle || Constants.S_DEFAULT_VALUE;
			},
			_getLanguage: function(oUserData) {
				if (oUserData) {
					var sValue = oUserData.getLanguage();
					//in some cases (e.g. local debugging 'en-US' is returned and survey logic does not work)
					if (sValue && sValue.length === 2) {
						return sValue.toUpperCase();
					}
				}
				return sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();
			},
			_collectData: function() {
				return new Promise(function(fnResolve, fnReject) {
					var oCurrentApp = Utils.getCurrentApp();
					var oContextData = null;

					if (Utils.isUI5Application(oCurrentApp)) {

						var oComponentInstance = oCurrentApp.componentInstance;

						Promise.all([
							this._getFioriAppId(oCurrentApp),
							VersionInfo.load()
						]).then(function(aPromiseResult) {
							var sFioriId = aPromiseResult[0];
							var oUi5VersionInfo = aPromiseResult[1];

							var sAppTitle = this._getAppTitle(oComponentInstance);
							var oUserInfo = this._getUserInfo();
							var oUserData = oUserInfo.getUser();

							if (oComponentInstance.getManifestEntry) {
								oContextData = {};
								oContextData.appFrameworkId = Constants.E_APP_FRAMEWORK.ui5;
								oContextData.appFrameworkVersion = oUi5VersionInfo.version;
								oContextData.theme = oUserData.getTheme();
								oContextData.appId = sFioriId;
								oContextData.appTitle = sAppTitle;
								oContextData.languageTag = this._getLanguage(oUserData);
								oContextData.technicalAppComponentId = oComponentInstance.getId();

								var oAppData = oComponentInstance.getManifestEntry("sap.app");
								if (oAppData) {
									oContextData.appVersion =
										oAppData.applicationVersion.version || Constants.S_DEFAULT_VALUE;
									oContextData.appSupportInfo = oAppData.ach || Constants.S_DEFAULT_VALUE;
								} else {
									oContextData.appVersion = Constants.S_DEFAULT_VALUE;
									oContextData.appSupportInfo = Constants.S_DEFAULT_VALUE;
								}

							} else {
								Log.warning(
									"Cannot access manifest to collect context data for survey", null, Constants.S_PLUGIN_CTXTDATACTRL_NAME);
							}

							fnResolve(oContextData);

						}.bind(this));
					} else {
						Log.warning("App not an UI5 app.", null, Constants.S_PLUGIN_CTXTDATACTRL_NAME);
					}
				}.bind(this));
			}
		});
	});