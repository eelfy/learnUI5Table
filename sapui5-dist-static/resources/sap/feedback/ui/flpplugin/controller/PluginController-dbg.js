/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "../utils/Constants", "./ContextDataController", "./PushClient",
		"../ui/ShellBarButton",
		"../ui/PopOverVisual", "../ui/IFrameVisual", "./WebAppFeedbackLoader", "sap/ui/thirdparty/jquery"
	],
	function(Object, Constants, ContextDataController, PushClient, ShellBarButton, PopOverVisual, IFrameVisual,
		WebAppFeedbackLoader, $) {
		"use strict";
		/* global QSI, sap */


		return Object.extend("sap.feedback.ui.flpplugin.controller.PluginController", {
			_oConfig: null,
			_oContextDataController: null,
			_oPushClient: null,
			_oShellButton: null,
			_oDisplayFormat: null,
			_oWebAppFeedbackLoader: null,
			_fnRendererPromise: null,
			_oResourceBundle: null,
			constructor: function(oConfig, fnRendererPromise, oResourceBundle, oShellUIService) {
				this._oConfig = oConfig;
				this._fnRendererPromise = fnRendererPromise;
				this._oResourceBundle = oResourceBundle;
				this._oShellUIService = oShellUIService;
			},
			init: function() {
				return new Promise(function(resolve, reject) {
					if (this._oConfig) {
						this._initContextData();
						this._initPushChannel();
						this._initUI();
						this._initWebAppFeedback();
						this._updateInitialContextData().then(function() {
							resolve();
						});
					} else {
						reject();
					}
				}.bind(this));
			},
			_initContextData: function() {
				this._oContextDataController = new ContextDataController(this._oConfig, this._oShellUIService);
				return this._oContextDataController.init();
			},
			_initPushChannel: function() {
				if (this._oConfig.getIsPushEnabled()) {
					this._oPushClient = new PushClient(this._oConfig);
					this._oPushClient.init(this._onPushCallback.bind(this));
				}
			},
			_initUI: function() {
				var iDisplayFormat = this._oConfig.getDisplayFormat();
				if (iDisplayFormat) {
					if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.popover) {
						this._oVisual = new PopOverVisual();
					} else if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.iframe) {
						this._oVisual = new IFrameVisual(this._oConfig, this._oResourceBundle);
					}
					if (this._oVisual) {
						this._oShellButton = new ShellBarButton(this._fnRendererPromise, this._onSurveyShow.bind(this), this._oResourceBundle);
						this._oShellButton.init();
					}
				}
			},
			_initWebAppFeedback: function() {
				this._oWebAppFeedbackLoader = new WebAppFeedbackLoader(this._oConfig);
				this._oWebAppFeedbackLoader.init(this._onAPILoadedCallback.bind(this));
				this._oWebAppFeedbackLoader.loadAPI();
			},
			_updateInitialContextData: function() {
				return this._oContextDataController.updateContextData(Constants.E_INTERCEPT_ID.ux);
			},
			_onAPILoadedCallback: function() {
				return this._oContextDataController.updateContextData(Constants.E_INTERCEPT_ID.ux).then(function() {
					this._getAppLifeCycleService().attachAppLoaded({},
						this._onAppLoaded,
						this
					);
					QSI.API.load().then(QSI.API.run());
				}.bind(this));
			},
			_getAppLifeCycleService: function() {
				return sap.ushell.Container.getService("AppLifeCycle");
			},
			_onPushCallback: function(oEventData) {
				return new Promise(function(resolve) {
					if (this._oWebAppFeedbackLoader.getIsAPILoaded()) {
						this._oContextDataController.updateContextData(Constants.E_INTERCEPT_ID.push, oEventData).then(function() {
							/*QSI.API.unload();
							QSI.API.load().then(function() {
								QSI.API.run();
								resolve();
							});*/
							this._openSurvey();
							resolve();
						}.bind(this));
					} else {
						resolve();
					}
				}.bind(this));
			},
			_openSurvey: function() {
				/*QSI.API.unload();
				QSI.API.load().then(function() {
				    QSI.API.run();
                }*/
				var hiddenElement = $("#surveyTriggerButton");
				hiddenElement.click();
			},
			_onSurveyShow: function() {
				return new Promise(function(
					fnResolve) {
					if (this._oWebAppFeedbackLoader.getIsAPILoaded()) {
						this._oContextDataController.updateContextData(Constants.E_INTERCEPT_ID.ux, null).then(function() {
							var iDisplayFormat = this._oConfig.getDisplayFormat();
							if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.iframe) {
								var sUrlParams = this._oContextDataController.getContextDataAsUrlParameter();
								this._oVisual.show(sUrlParams);
								fnResolve();
							} else {
								this._oVisual.show();
								fnResolve();
							}
						}.bind(this));
					}
				}.bind(this));
			},
			_onAppLoaded: function() {
				return this._oContextDataController.updateContextData(Constants.E_INTERCEPT_ID.ux).then(function() {
					if (this._oShellButton.updateButtonState() === Constants.E_SHELLBAR_BUTTON_STATE.restart) {
						this._oWebAppFeedbackLoader.reloadIntercepts();
					}
				}.bind(this));
			}

		});
	});