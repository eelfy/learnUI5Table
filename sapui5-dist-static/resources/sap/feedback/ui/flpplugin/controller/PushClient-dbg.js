/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "sap/ui/core/ws/WebSocket", "sap/ui/core/ws/ReadyState", "sap/ui/core/EventBus", "../utils/Constants", "../utils/Utils", "../data/PushContextData"],
	function(Object, Log, WebSocket, ReadyState, EventBus, Constants, Utils, PushContextData) {
		"use strict";
		/* global sap, window */

		return Object.extend("sap.feedback.ui.flpplugin.controller.PushClient", {
			_oConfig: null,
			_fnPushSurveyCallback: null,
			_oConnection: null,

			constructor: function(oConfig) {
				this._oConfig = oConfig;
			},
			init: function(fnPushSurveyCallback) {
				this._fnPushSurveyCallback = fnPushSurveyCallback;
				this._initClient();
			},
			_initClient: function() {
				var sWebSocketUri = this._constructUri();
				if (sWebSocketUri && sWebSocketUri.length > 0) {
					try {
						this._oConnection = new WebSocket(sWebSocketUri);
						this._oConnection.attachOpen(this._onOpen, this);
						this._oConnection.attachMessage(this._onMessage, this);
						this._oConnection.attachError(this._onError, this);
						this._oConnection.attachClose(this._onClose, this);
					} catch (e) {
						Log.error("Push survey connection could not be initalized.", e, Constants.S_PLUGIN_PUSHCLNT_NAME);
					}
				}
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.subscribe("sap.feedback", "push", function(sChannelId, sEventId, oEventData) {
					this._processMessage(oEventData);
				}, this);
				oEventBus.subscribe("sap.feedback", "inapp.user", function(sChannelId, sEventId, oEventData) {
					oEventData.srcType = Constants.E_PUSH_SRC_TYPE.userInApp;
					this._processMessage(oEventData);
				}, this);
			},
			_constructUri: function() {
				if (this._oConfig.getPushChannelPath()) {
					var sCurrentLocation = window.location;
					var sConstructedUri = "";
					if (sCurrentLocation.protocol === "https:") {
						sConstructedUri = "wss:";
					} else {
						sConstructedUri = "ws:";
					}
					sConstructedUri += "//" + sCurrentLocation.host;
					sConstructedUri += this._oConfig.getPushChannelPath();
					return sConstructedUri;
				}
				return null;
			},
			_close: function() {
				this._oConnection.close();
			},
			send: function() {
				if (this._oConnection.getReadyState() === ReadyState.OPEN) {
					// Transfer data back to backend if 'mode' === 2 (e.g. defered notification)
				}
			},
			_onOpen: function(oEvent) {
				Log.info("Opened push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			_onMessage: function(oEvent) {
				var oData = oEvent.getParameter("data");
				if (oData) {
					try {
						var oJsonData = JSON.parse(oData);
						this._processMessage(oJsonData);
					} catch (e) {
						Log.error("Push survey data could not be parsed.", e, Constants.S_PLUGIN_PUSHCLNT_NAME);
					}
				}
			},
			_onError: function(oEvent) {
				Log.info("Error on push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			_onClose: function(oEvent) {
				Log.info("Closing push survey channel:", oEvent, Constants.S_PLUGIN_PUSHCLNT_NAME);
			},
			_processMessage: function(oData) {
				if (oData) {
					if (oData.srcType) {
						if (oData.srcType === Constants.E_PUSH_SRC_TYPE.backend || oData.srcType === Constants.E_PUSH_SRC_TYPE.userInApp) {
							this._showSurvey(oData);
						}
					}
				}
			},
			_showSurvey: function(oData) {
				if (oData.srcAppId && oData.srcAppTrigger && oData.srcType) {
					var sSrcAppId = oData.srcAppId;
					var sSrcAppTrigger = oData.srcAppTrigger;
					var iSrcType = oData.srcType;

					var oPushContextData = new PushContextData(sSrcAppId, sSrcAppTrigger, iSrcType);

					if (this._fnPushSurveyCallback) {
						this._fnPushSurveyCallback({
							contextData: oPushContextData
						});
					}
				}
			}
		});
	});