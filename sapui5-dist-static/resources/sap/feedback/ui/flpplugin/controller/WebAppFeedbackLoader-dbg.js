/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "../utils/Constants"],
	function(Object, Log, Constants) {
		"use strict";
		/* global QSI */

		return Object.extend("sap.feedback.ui.flpplugin.controller.WebAppFeedbackLoader", {
			_oConfig: null,
			_isAPILoaded: false,
			constructor: function(oConfig) {
				this._oConfig = oConfig;
			},
			init: function(fnOnAPILoadedCallback) {
				this._registerAPILoadedEvent(fnOnAPILoadedCallback);
			},
			getIsAPILoaded: function() {
				return this._isAPILoaded;
			},
			_registerAPILoadedEvent: function(fnOnAPILoadedCallback) {
				//Make sure to be notified once intercept API has been loaded
				/* eslint-disable sap-forbidden-window-property*/
				/* eslint-disable sap-no-global-define */
				// this is triggered by the creative close button and required as custom event trigger is not re-registered after survey ran once
				window.addEventListener(
					"qsi_js_loaded",
					function() {
						if (QSI.API) {
							this._isAPILoaded = true;
						} else {
							this._isAPILoaded = false;
							Log.error("Qualtrics API did not load correctly. QSI.API not available.", null, Constants.S_PLUGIN_WEBAPPFEEDBACKCTRL_NAME);
						}
						if (fnOnAPILoadedCallback) {
							fnOnAPILoadedCallback();
						}
					}.bind(this),
					false
				);
				/* eslint-enable sap-no-global-define */
				/* eslint-enable sap-forbidden-window-property*/
			},
			loadAPI: function() {
				/* eslint-disable */
				//BEGIN: Qualtrics deployment snipppet
				try {
					var a = document.createElement("script");
					a.type = "text/javascript";
					a.src = this._oConfig.getQualtricsUri();
					document.body && document.body.appendChild(a);
				} catch (e) {
					Log.error("Cannot inject Qualtrics snippet", e, Constants.S_PLUGIN_WEBAPPFEEDBACKLDR_NAME);
				}
				/* eslint-enable */
				//END: Qualtrics deployment snipppet
			},
			reloadIntercepts: function() {
				if (QSI && QSI.API) {
					QSI.API.unload();
					QSI.API.load().then(QSI.API.run());
				}
			}
		});
	});