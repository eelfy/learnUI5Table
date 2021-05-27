/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/* Utility class that facilitates route configuration handling */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/strings/capitalize",
	"sap/base/util/merge"
], function (BaseObject, capitalize, merge) {
	"use strict";

	return BaseObject.extend("sap.ui.documentation.sdk.controller.util.ConfigUtil", {

		"COOKIE_NAMES": {
			"APPROVAL_REQUESTED": "dk_approval_requested",
			"ALLOW_REQUIRED_COOKIES": "dk_allow_required_cookies",
			"ALLOW_USAGE_TRACKING": "dk_allow_usage_tracking"
		},

		SWA_CONFIG: {
			pubToken: 'd5a5359b-0b55-415c-acc8-314511b613ca',
			baseUrl: 'https://webanalytics2.cfapps.eu10.hana.ondemand.com/tracker/',
			owner: null
		},

		SWA_TRACKER_URL: "sap/webanalytics/core/tracker/js/track.js",

		constructor : function (oComponent) {
			this._oComponent = oComponent;
		},

		hasMasterView: function(sRouteName) {
			var oRouteConfig = this._getRouteConfig(sRouteName),
				bIsSplitView = oRouteConfig && oRouteConfig.target.length === 2;
			return !!bIsSplitView;
		},

		getMasterView: function(sRouteName) {
			var sMasterTargetName = this._getMasterTargetName(sRouteName),
				sTargetConfig = this._getTargetConfig(sMasterTargetName),
				sViewName = sTargetConfig.viewName;

				sViewName = "sap.ui.documentation.sdk.view." + capitalize(sViewName, 0);

				return this._oComponent.getRouter().getView(sViewName, "XML");
		},

		setCookie: function (sCookieName, sValue) {
			var sExpiresDate,
				oDate = new Date();

			oDate.setTime(oDate.getTime() + (356 * 24 * 60 * 60 * 1000)); // one year
			sExpiresDate = "expires=" + oDate.toUTCString();

			document.cookie = sCookieName + "=" + sValue + ";" + sExpiresDate + ";path=/";
		},

		getCookieValue: function (sCookieName) {
			var aCookies = document.cookie.split(';'),
				sCookie;

			sCookieName = sCookieName + "=";

			for (var i = 0; i < aCookies.length; i++) {
				sCookie = aCookies[i].trim();

				if (sCookie.indexOf(sCookieName) === 0) {
					return sCookie.substring(sCookieName.length, sCookie.length);
				}
			}

			return "";
		},

		enableUsageTracking: function() {
			this._loadSWA().then(function(swa) {
				if (swa && typeof swa.enable === "function") {
					swa.enable();
				}
			});
		},

		disableUsageTracking: function() {
			var swa = window['swa'];
			if (swa && typeof swa.disable === "function") {
				swa.disable();
			}
		},

		_loadSWA: function() {
			if (!this._oPromiseLoadSWA) {
				this._oPromiseLoadSWA = new Promise(function(resolve, reject) {
					var oSWAConfig = merge({}, this.SWA_CONFIG),
						oDoc = document,
						oNewScriptEl = oDoc.createElement('script'),
						oFirstScriptEl = oDoc.getElementsByTagName('script')[0];

					oNewScriptEl.type = 'text/javascript';
					oNewScriptEl.defer = true;
					oNewScriptEl.async = true;
					oNewScriptEl.src = sap.ui.require.toUrl(this.SWA_TRACKER_URL);
					window.addEventListener("swaLoadSuccess", function(){
						resolve(window["swa"]);
					});

					oFirstScriptEl.parentNode.insertBefore(oNewScriptEl, oFirstScriptEl);
					window["swa"] = oSWAConfig;
				}.bind(this));
			}
			return this._oPromiseLoadSWA;
		},

		_getMasterTargetName: function(sRouteName) {
			var oRouteConfig = this._getRouteConfig(sRouteName),
				bIsSplitView = oRouteConfig && oRouteConfig.target.length === 2,
				sMasterTarget = bIsSplitView && oRouteConfig.target[0];
			return sMasterTarget;
		},

		_getRouteConfig: function(sRouteName) {
			var oConfig = this._getSapUI5ConfigEntry(),
				aRoutes = oConfig.routing.routes,
				aRoute = jQuery.grep(aRoutes, function(oRoute){return oRoute.name === sRouteName; }),
				oRoute = aRoute.length && aRoute[0];
			return oRoute;
		},

		_getSapUI5ConfigEntry: function () {
			return this._oComponent.getMetadata().getManifestObject().getEntry("sap.ui5");
		},

		_getTargetConfig: function(sTargetName) {
			return this._getSapUI5ConfigEntry().routing.targets[sTargetName];
		},

		destroy: function () {
			this._oComponent = null;
			return BaseObject.prototype.destroy.apply(this, arguments);
		}
	});
});