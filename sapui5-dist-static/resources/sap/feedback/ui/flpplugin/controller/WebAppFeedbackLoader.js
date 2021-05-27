/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/base/Log","../utils/Constants"],function(O,L,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.WebAppFeedbackLoader",{_oConfig:null,_isAPILoaded:false,constructor:function(c){this._oConfig=c;},init:function(o){this._registerAPILoadedEvent(o);},getIsAPILoaded:function(){return this._isAPILoaded;},_registerAPILoadedEvent:function(o){window.addEventListener("qsi_js_loaded",function(){if(QSI.API){this._isAPILoaded=true;}else{this._isAPILoaded=false;L.error("Qualtrics API did not load correctly. QSI.API not available.",null,C.S_PLUGIN_WEBAPPFEEDBACKCTRL_NAME);}if(o){o();}}.bind(this),false);},loadAPI:function(){try{var a=document.createElement("script");a.type="text/javascript";a.src=this._oConfig.getQualtricsUri();document.body&&document.body.appendChild(a);}catch(e){L.error("Cannot inject Qualtrics snippet",e,C.S_PLUGIN_WEBAPPFEEDBACKLDR_NAME);}},reloadIntercepts:function(){if(QSI&&QSI.API){QSI.API.unload();QSI.API.load().then(QSI.API.run());}}});});
