sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	var calculateAppParamsUrl = function (oAppParams, bStartInSandbox) {
		var sAppParamsUrl = "serverDelay=0&responderOn=true";
		if (oAppParams && typeof oAppParams === "object") {
			var keys = Object.keys(oAppParams);
			// for...of not used because IE doesn't support
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				switch (key) {
					case "bWithChange":
						sAppParamsUrl += (!bStartInSandbox && oAppParams[key] === true) ? "&sap-ui-xx-componentPreload=off" : "";
						break;
					case "sapUiLanguage":
						sAppParamsUrl += "&sap-ui-language=" + oAppParams[key];
						break;
					case "sapTheme":
						sAppParamsUrl += "&sap-theme=" + oAppParams[key];
						break;
					case "sapUiLayer":
						sAppParamsUrl += "&sap-ui-layer=" + oAppParams[key];
						break;
					default:
						sAppParamsUrl += "&" + key + "=" + oAppParams[key];
				}
			}
		}
		return sAppParamsUrl.indexOf("sap-ui-language") !== -1 ? sAppParamsUrl : sAppParamsUrl + "&sap-ui-language=en_US";
	};
	var privateMethods = {
		calculateAppParamsUrl: calculateAppParamsUrl
	};

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.suite.ui.generic.template.integration.AnalyticalListPage.pages.Common", {

		iStartMyApp : function() {

			// start without debug parameter, loads much faster
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=analytics2&sap-ui-language=en_US&sap-ui-theme=sap_belize");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
			//return this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alp-display");
		},
		iStartMyAppInIframeWithDim: function(sComponent, w, h) {
			// start without debug parameter, loads much faster
			this.iStartMyAppInAFrame({
				source: "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=" + sComponent + "&sap-ui-language=en_US&sap-ui-theme=sap_belize",
				width: w,
				height: h
			});
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
			//return this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alp-display");
		},
		iStartMyAppWithURLParams : function(sUrlParams) {
			var flpApps = "?flpApps=alp-display";
			// start without debug parameter, loads much faster
			// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=products&sap-ui-language=en_US");
			if (!sUrlParams) {
				sUrlParams = "?DisplayCurrency=USD&CostElement=400020";
			} else {
				sUrlParams = "?" + sUrlParams;
			}
			//this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alp-display" + sUrlParams);
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html" + flpApps + "#alp-display" + sUrlParams);

			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppWithExtensions : function() {
			//start alp application with parameters
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=analytics4&sap-ui-language=en_US&sap-ui-theme=sap_belize");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppWithSettings : function() {
			//start alp application with parameters
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=analytics3&sap-ui-language=en_US&sap-ui-theme=sap_belize");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppWithTreeTable : function() {
			//start alp application with parameters
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=analytics5&sap-ui-language=en_US&sap-ui-theme=sap_belize");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppALPWithDirectNavigation : function() {
			var flpApps = "?flpApps=alp-display";
			//this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alp-display?ID=0013");
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html" + flpApps + "#alp-display?ID=0013");
			return this.waitFor({
				controlType: "sap.uxap.ObjectPageLayout",
				autoWait:true,
				timeout: 45,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppALPWithParams : function() {
			var flpApps = "?flpApps=alpwp-display,alp-display,EPMProduct-manage_st,alpWithSettings-display";
			//this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alpwp-display?DisplayCurrency=USD");
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html" + flpApps + "#alpwp-display?DisplayCurrency=USD");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
		iStartMyAppALPWithParamsWoDisplayCurrency : function() {
			//this.iStartMyAppInAFrame("../../../template/demokit/flpSandbox.html#alpwp-display");
			this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=alpWithParams&sap-ui-language=en_US&sap-ui-theme=sap_belize");
			return this.waitFor({
				autoWait:true,
				timeout: 30,
				errorMessage: "Could not load application"
			});
		},
			/**
			 * @param {String} sAppNameWithOrWithoutParams - name of app or appname along with starting parameters
			 * Example: sAppNameWithOrWithoutParams="sttasalesordernd" or "sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')"
			 * @param {String} sManifestName - provide manifest name if you want to start your application with dynamic manifest
			 * @param {Object} oAppParams - In this object you can send multiple parameter such as if you want your app to load with change
			 * or in particular language or particular theme or with any dynamic key & value.
			 * Example: oAppParams={bWithChange: true, sapUiLanguage="DE", sapTheme="sap_belize"}
			 * @return {*} success or failure
			 */
		iStartMyAppInDemokit: function (sAppNameWithOrWithoutParams, sManifestName, oAppParams) {
			var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html";
			var urlParams = privateMethods.calculateAppParamsUrl(oAppParams);
			var sOpaFrameUrlParameters = urlParams + "&demoApp=" + sAppNameWithOrWithoutParams;
			if (sManifestName) {
				sOpaFrame = sOpaFrame + "?manifest=" + sManifestName + "&" + sOpaFrameUrlParameters;
			} else {
				sOpaFrame = sOpaFrame + "?" + sOpaFrameUrlParameters;
			}
			console.log("OPA5::Common.js::iStartMyAppInDemokit" + " sOpaFrame: " + sOpaFrame);
			return this.iStartMyAppInAFrame(sOpaFrame);
		},

	});

	return Common;

});
