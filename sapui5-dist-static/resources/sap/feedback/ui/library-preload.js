//@ui5-bundle sap/feedback/ui/library-preload.js
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/feedback/ui/flpplugin/Component',["sap/ui/core/Component","sap/ui/thirdparty/jquery","sap/base/Log","./utils/Constants","./data/Config","./utils/InitDetection","./controller/PluginController"],function(C,$,L,a,b,I,P){"use strict";return C.extend("sap.feedback.ui.flpplugin.Component",{metadata:{manifest:"json"},_oPluginController:null,_oShellUIService:null,_oConfig:null,init:function(){this._getShellUIService().then(function(s){this._oShellUIService=s;return this._setup();}.bind(this));},_setup:function(){return new Promise(function(r){this._oConfig=this._loadPluginConfig();if(this._oConfig){var q=this._oConfig.getQualtricsUri();if(q&&q.length>0){var t=this._oConfig.getTenantId();if(t&&t.length>0){this._validateIfInitializable(q).then(function(i){if(i){this._oConfig.setIsLibraryLoadable(i);this._startPluginController(this._oConfig).then(function(){r();},function(){L.error("Plugin Controller could not be initialized.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);r();}.bind(this));}}.bind(this),function(i){if(!i){this._oConfig.setIsLibraryLoadable(i);L.error("Unable to request feedback library.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);}r();}.bind(this));}else{L.error("Feedback config insufficient - tenant id missing.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);r();}}else{L.error("Feedback config insufficient - url missing.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);r();}}else{L.error("Feedback config could not be read.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);r();}}.bind(this));},_validateIfInitializable:function(q){var i=new I(q);return i.isUrlLoadable();},_loadPluginConfig:function(){if(this.getComponentData()){var p=this.getComponentData().config;var c=new b(p.qualtricsInternalUri,p.tenantId,a.E_DATA_FORMAT.version1);c.setTenantRole(p.tenantRole);if(p.isPushEnabled){c.setDataFormat(a.E_DATA_FORMAT.version2);c.setIsPushEnabled(p.isPushEnabled);if(c.getIsPushEnabled()&&p.pushChannelPath&&p.pushChannelPath.length>0){c.setPushChannelPath(p.pushChannelPath);}}if(p.productName){c.setProductName(p.productName);}if(p.platformType){c.setPlatformType(p.platformType);}return c;}return null;},_startPluginController:function(c){return new Promise(function(r,d){if(this._isDeviceDisplayFormatCombinationValid(c.getDisplayFormat())){var R=this.getModel("i18n").getResourceBundle();this._oPluginController=new P(c,this._getRenderer(),R,this._oShellUIService);this._oPluginController.init().then(function(){r();},function(e){L.error("Feedback plugin startup failed.",e,a.S_PLUGIN_COMPONENT_NAME);d();});}else{L.error("Device not supported.",this._oConfig,a.S_PLUGIN_COMPONENT_NAME);d();}}.bind(this));},_isDeviceDisplayFormatCombinationValid:function(d){if(sap.ui.Device.system.phone&&d===a.E_DISPLAY_FORMAT.popover){return false;}return true;},_getShellUIService:function(){return this.getService("ShellUIService").then(function(s){return s;},function(e){L.error("Cannot get ShellUIService",e,a.S_PLUGIN_COMPONENT_NAME);});},_getRenderer:function(){var d=new $.Deferred(),r;this._oShellContainer=$.sap.getObject("sap.ushell.Container");if(!this._oShellContainer){d.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");}else{r=this._oShellContainer.getRenderer();if(r){d.resolve(r);}else{this._onRendererCreated=function(e){r=e.getParameter("renderer");if(r){d.resolve(r);}else{d.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");}};this._oShellContainer.attachRendererCreatedEvent(this._onRendererCreated);}}return d.promise();}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/controller/ContextDataController',["sap/ui/base/Object","sap/base/util/extend","../utils/Constants","../data/AppContextData","../data/PushContextData"],function(O,e,C,A,P){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.ContextDataController",{_oConfig:{},_oShellUIService:null,_oAppContextData:null,_oSessionData:null,constructor:function(c,s){this._oConfig=c;this._oShellUIService=s;},init:function(){if(this._oConfig&&this._oShellUIService){this._oAppContextData=new A(this._oShellUIService);this._collectSessionContextData(this._oConfig.getTenantId(),this._oConfig.getTenantRole(),this._oConfig.getProductName(),this._oConfig.getPlatformType());}else{this._resetContextData(C.E_PLUGIN_STATE.init);}},updateContextData:function(t,E){return new Promise(function(r,R){this._resetContextData(C.E_PLUGIN_STATE.update);var d=this._oConfig.getDataFormat();this._setSessionContextData(d);if(t===C.E_INTERCEPT_ID.push){this._setPushContextData(E.contextData);}this._collectAppContextData(d).then(function(){r();},function(a){R();});}.bind(this));},getContextDataAsUrlParameter:function(){var s="";if(this._oConfig.getDataFormat()===C.E_DATA_FORMAT.version1){s+="?Q_Language="+encodeURIComponent(sap.qtxAppContext.language);s+="&language="+encodeURIComponent(sap.qtxAppContext.language);s+="&ui5Version="+encodeURIComponent(sap.qtxAppContext.ui5Version);s+="&ui5Theme="+encodeURIComponent(sap.qtxAppContext.ui5Theme);s+="&fioriId="+encodeURIComponent(sap.qtxAppContext.fioriId);s+="&appVersion="+encodeURIComponent(sap.qtxAppContext.appVersion);s+="&componentId="+encodeURIComponent(sap.qtxAppContext.componentId);s+="&appTitle="+encodeURIComponent(sap.qtxAppContext.appTitle);s+="&ach="+encodeURIComponent(sap.qtxAppContext.ach);s+="&tenantId="+encodeURIComponent(sap.qtxAppContext.tenantId);s+="&tenantRole="+encodeURIComponent(sap.qtxAppContext.tenantRole);s+="&pluginState="+encodeURIComponent(sap.qtxAppContext.pluginState);}else if(this._oConfig.getDataFormat()===C.E_DATA_FORMAT.version2){s+="?Q_Language="+encodeURIComponent(sap.qtx.appcontext.languageTag);s+="&language="+encodeURIComponent(sap.qtx.appcontext.languageTag);s+="&appFrameworkId="+encodeURIComponent(sap.qtx.appcontext.appFrameworkId);s+="&appFrameworkVersion="+encodeURIComponent(sap.qtx.appcontext.appFrameworkVersion);s+="&theme="+encodeURIComponent(sap.qtx.appcontext.theme);s+="&appId="+encodeURIComponent(sap.qtx.appcontext.appId);s+="&appVersion="+encodeURIComponent(sap.qtx.appcontext.appVersion);s+="&technicalAppComponentId="+encodeURIComponent(sap.qtx.appcontext.technicalAppComponentId);s+="&appTitle="+encodeURIComponent(sap.qtx.appcontext.appTitle);s+="&appSupportInfo="+encodeURIComponent(sap.qtx.appcontext.appSupportInfo);if(sap.qtx.session){s+="&tenantId="+encodeURIComponent(sap.qtx.session.tenantId);s+="&tenantRole="+encodeURIComponent(sap.qtx.session.tenantRole);s+="&productName="+encodeURIComponent(sap.qtx.session.productName);s+="&platformType="+encodeURIComponent(sap.qtx.session.platformType);}if(sap.qtx.debug){s+="&pluginState="+encodeURIComponent(sap.qtx.debug.pluginState);}if(sap.qtx.push){s+="&pushSrcType="+encodeURIComponent(sap.qtx.push.srcType);s+="&pushSrcAppId="+encodeURIComponent(sap.qtx.push.srcAppId);s+="&pushSrcTrigger="+encodeURIComponent(sap.qtx.push.srcAppTrigger);}}return s;},_setPushContextData:function(p){if(!sap.qtx){sap.qtx={};}sap.qtx.push={};sap.qtx.push.srcType=p.getSourceType();sap.qtx.push.srcAppId=p.getSourceAppId();sap.qtx.push.srcAppTrigger=p.getSourceAppTrigger();},_collectSessionContextData:function(t,r,p,s){this._oSessionData={tenantId:t,tenantRole:r,productName:p,platformType:s};},_setSessionContextData:function(d){if(d===C.E_DATA_FORMAT.version1){if(!sap.qtxAppContext){sap.qtxAppContext={};}sap.qtxAppContext=e(sap.qtxAppContext,this._oSessionData);}else if(d===C.E_DATA_FORMAT.version2){if(!sap.qtx){sap.qtx={};}sap.qtx.session=this._oSessionData;}},_resetContextData:function(p){sap.qtxAppContext={};sap.qtxAppContext.pluginState=p;if(!sap.qtx){sap.qtx={};}sap.qtx.appcontext={};sap.qtx.push={};sap.qtx.debug={pluginState:p};},_collectAppContextData:function(d){return this._oAppContextData.getData(d).then(function(c){this._setAppContextData(c,d,C.E_PLUGIN_STATE.update);}.bind(this));},_setAppContextData:function(c,d,p){if(d===C.E_DATA_FORMAT.version1){sap.qtxAppContext=e(sap.qtxAppContext,c);sap.qtxAppContext.pluginState=p;}else if(d===C.E_DATA_FORMAT.version2){sap.qtx.appcontext=c;sap.qtx.debug={pluginState:p};}}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/controller/PluginController',["sap/ui/base/Object","../utils/Constants","./ContextDataController","./PushClient","../ui/ShellBarButton","../ui/PopOverVisual","../ui/IFrameVisual","./WebAppFeedbackLoader","sap/ui/thirdparty/jquery"],function(O,C,a,P,S,b,I,W,$){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.PluginController",{_oConfig:null,_oContextDataController:null,_oPushClient:null,_oShellButton:null,_oDisplayFormat:null,_oWebAppFeedbackLoader:null,_fnRendererPromise:null,_oResourceBundle:null,constructor:function(c,r,R,s){this._oConfig=c;this._fnRendererPromise=r;this._oResourceBundle=R;this._oShellUIService=s;},init:function(){return new Promise(function(r,c){if(this._oConfig){this._initContextData();this._initPushChannel();this._initUI();this._initWebAppFeedback();this._updateInitialContextData().then(function(){r();});}else{c();}}.bind(this));},_initContextData:function(){this._oContextDataController=new a(this._oConfig,this._oShellUIService);return this._oContextDataController.init();},_initPushChannel:function(){if(this._oConfig.getIsPushEnabled()){this._oPushClient=new P(this._oConfig);this._oPushClient.init(this._onPushCallback.bind(this));}},_initUI:function(){var d=this._oConfig.getDisplayFormat();if(d){if(d===C.E_DISPLAY_FORMAT.popover){this._oVisual=new b();}else if(d===C.E_DISPLAY_FORMAT.iframe){this._oVisual=new I(this._oConfig,this._oResourceBundle);}if(this._oVisual){this._oShellButton=new S(this._fnRendererPromise,this._onSurveyShow.bind(this),this._oResourceBundle);this._oShellButton.init();}}},_initWebAppFeedback:function(){this._oWebAppFeedbackLoader=new W(this._oConfig);this._oWebAppFeedbackLoader.init(this._onAPILoadedCallback.bind(this));this._oWebAppFeedbackLoader.loadAPI();},_updateInitialContextData:function(){return this._oContextDataController.updateContextData(C.E_INTERCEPT_ID.ux);},_onAPILoadedCallback:function(){return this._oContextDataController.updateContextData(C.E_INTERCEPT_ID.ux).then(function(){this._getAppLifeCycleService().attachAppLoaded({},this._onAppLoaded,this);QSI.API.load().then(QSI.API.run());}.bind(this));},_getAppLifeCycleService:function(){return sap.ushell.Container.getService("AppLifeCycle");},_onPushCallback:function(e){return new Promise(function(r){if(this._oWebAppFeedbackLoader.getIsAPILoaded()){this._oContextDataController.updateContextData(C.E_INTERCEPT_ID.push,e).then(function(){this._openSurvey();r();}.bind(this));}else{r();}}.bind(this));},_openSurvey:function(){var h=$("#surveyTriggerButton");h.click();},_onSurveyShow:function(){return new Promise(function(r){if(this._oWebAppFeedbackLoader.getIsAPILoaded()){this._oContextDataController.updateContextData(C.E_INTERCEPT_ID.ux,null).then(function(){var d=this._oConfig.getDisplayFormat();if(d===C.E_DISPLAY_FORMAT.iframe){var u=this._oContextDataController.getContextDataAsUrlParameter();this._oVisual.show(u);r();}else{this._oVisual.show();r();}}.bind(this));}}.bind(this));},_onAppLoaded:function(){return this._oContextDataController.updateContextData(C.E_INTERCEPT_ID.ux).then(function(){if(this._oShellButton.updateButtonState()===C.E_SHELLBAR_BUTTON_STATE.restart){this._oWebAppFeedbackLoader.reloadIntercepts();}}.bind(this));}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/controller/PushClient',["sap/ui/base/Object","sap/base/Log","sap/ui/core/ws/WebSocket","sap/ui/core/ws/ReadyState","sap/ui/core/EventBus","../utils/Constants","../utils/Utils","../data/PushContextData"],function(O,L,W,R,E,C,U,P){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.PushClient",{_oConfig:null,_fnPushSurveyCallback:null,_oConnection:null,constructor:function(c){this._oConfig=c;},init:function(p){this._fnPushSurveyCallback=p;this._initClient();},_initClient:function(){var w=this._constructUri();if(w&&w.length>0){try{this._oConnection=new W(w);this._oConnection.attachOpen(this._onOpen,this);this._oConnection.attachMessage(this._onMessage,this);this._oConnection.attachError(this._onError,this);this._oConnection.attachClose(this._onClose,this);}catch(e){L.error("Push survey connection could not be initalized.",e,C.S_PLUGIN_PUSHCLNT_NAME);}}var o=sap.ui.getCore().getEventBus();o.subscribe("sap.feedback","push",function(c,s,a){this._processMessage(a);},this);o.subscribe("sap.feedback","inapp.user",function(c,s,a){a.srcType=C.E_PUSH_SRC_TYPE.userInApp;this._processMessage(a);},this);},_constructUri:function(){if(this._oConfig.getPushChannelPath()){var c=window.location;var s="";if(c.protocol==="https:"){s="wss:";}else{s="ws:";}s+="//"+c.host;s+=this._oConfig.getPushChannelPath();return s;}return null;},_close:function(){this._oConnection.close();},send:function(){if(this._oConnection.getReadyState()===R.OPEN){}},_onOpen:function(e){L.info("Opened push survey channel:",e,C.S_PLUGIN_PUSHCLNT_NAME);},_onMessage:function(o){var d=o.getParameter("data");if(d){try{var j=JSON.parse(d);this._processMessage(j);}catch(e){L.error("Push survey data could not be parsed.",e,C.S_PLUGIN_PUSHCLNT_NAME);}}},_onError:function(e){L.info("Error on push survey channel:",e,C.S_PLUGIN_PUSHCLNT_NAME);},_onClose:function(e){L.info("Closing push survey channel:",e,C.S_PLUGIN_PUSHCLNT_NAME);},_processMessage:function(d){if(d){if(d.srcType){if(d.srcType===C.E_PUSH_SRC_TYPE.backend||d.srcType===C.E_PUSH_SRC_TYPE.userInApp){this._showSurvey(d);}}}},_showSurvey:function(d){if(d.srcAppId&&d.srcAppTrigger&&d.srcType){var s=d.srcAppId;var S=d.srcAppTrigger;var i=d.srcType;var p=new P(s,S,i);if(this._fnPushSurveyCallback){this._fnPushSurveyCallback({contextData:p});}}}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/controller/WebAppFeedbackLoader',["sap/ui/base/Object","sap/base/Log","../utils/Constants"],function(O,L,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.controller.WebAppFeedbackLoader",{_oConfig:null,_isAPILoaded:false,constructor:function(c){this._oConfig=c;},init:function(o){this._registerAPILoadedEvent(o);},getIsAPILoaded:function(){return this._isAPILoaded;},_registerAPILoadedEvent:function(o){window.addEventListener("qsi_js_loaded",function(){if(QSI.API){this._isAPILoaded=true;}else{this._isAPILoaded=false;L.error("Qualtrics API did not load correctly. QSI.API not available.",null,C.S_PLUGIN_WEBAPPFEEDBACKCTRL_NAME);}if(o){o();}}.bind(this),false);},loadAPI:function(){try{var a=document.createElement("script");a.type="text/javascript";a.src=this._oConfig.getQualtricsUri();document.body&&document.body.appendChild(a);}catch(e){L.error("Cannot inject Qualtrics snippet",e,C.S_PLUGIN_WEBAPPFEEDBACKLDR_NAME);}},reloadIntercepts:function(){if(QSI&&QSI.API){QSI.API.unload();QSI.API.load().then(QSI.API.run());}}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/data/AppContextData',["sap/ui/base/Object","sap/base/Log","sap/ui/VersionInfo","../utils/Constants","../utils/Utils"],function(O,L,V,C,U){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.AppContextData",{_dataV1:null,_dataV2:null,_oShellUIService:null,constructor:function(s){this._oShellUIService=s;},getData:function(f){return this._updateData().then(function(){if(f===C.E_DATA_FORMAT.version1){return this._dataV1;}else if(f===C.E_DATA_FORMAT.version2){return this._dataV2;}return null;}.bind(this));},_updateData:function(){return new Promise(function(r,R){this._resetData();this._collectData().then(function(c){this._setData(c);r();}.bind(this));}.bind(this));},_resetData:function(){this._dataV1={ui5Version:C.S_DEFAULT_VALUE,ui5Theme:C.S_DEFAULT_VALUE,fioriId:C.S_DEFAULT_VALUE,appTitle:C.S_DEFAULT_VALUE,language:C.S_DEFAULT_VALUE,componentId:C.S_DEFAULT_VALUE,appVersion:C.S_DEFAULT_VALUE,ach:C.S_DEFAULT_VALUE};this._dataV2={appFrameworkId:C.S_DEFAULT_VALUE,appFrameworkVersion:C.S_DEFAULT_VALUE,theme:C.S_DEFAULT_VALUE,appId:C.S_DEFAULT_VALUE,appTitle:C.S_DEFAULT_VALUE,languageTag:C.S_DEFAULT_VALUE,technicalAppComponentId:C.S_DEFAULT_VALUE,appVersion:C.S_DEFAULT_VALUE,appSupportInfo:C.S_DEFAULT_VALUE};},_setData:function(c){this._dataV1={ui5Version:c.appFrameworkVersion,ui5Theme:c.theme,fioriId:c.appId,appTitle:c.appTitle,language:c.languageTag,componentId:c.technicalAppComponentId,appVersion:c.appVersion,ach:c.appSupportInfo};this._dataV2=c;},_getFioriAppId:function(c){if(this._getIsLaunchpad(c)){return Promise.resolve(C.S_LAUNCHPAD_VALUE);}else{return c.getTechnicalParameter("sap-fiori-id").then(function(f){var a=f&&f.length>0?f[0]:C.S_DEFAULT_VALUE;if(!a||a.length===0){return C.S_DEFAULT_VALUE;}return a;});}},_getUserInfo:function(){return sap.ushell.Container.getService("UserInfo");},_getIsLaunchpad:function(c){return c.homePage;},_getAppTitle:function(c){var t=this._oShellUIService.getTitle();if(!t){t=c.getManifestEntry("sap.app").title;}return t||C.S_DEFAULT_VALUE;},_getLanguage:function(u){if(u){var v=u.getLanguage();if(v&&v.length===2){return v.toUpperCase();}}return sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();},_collectData:function(){return new Promise(function(r,R){var c=U.getCurrentApp();var o=null;if(U.isUI5Application(c)){var a=c.componentInstance;Promise.all([this._getFioriAppId(c),V.load()]).then(function(p){var f=p[0];var u=p[1];var A=this._getAppTitle(a);var b=this._getUserInfo();var d=b.getUser();if(a.getManifestEntry){o={};o.appFrameworkId=C.E_APP_FRAMEWORK.ui5;o.appFrameworkVersion=u.version;o.theme=d.getTheme();o.appId=f;o.appTitle=A;o.languageTag=this._getLanguage(d);o.technicalAppComponentId=a.getId();var e=a.getManifestEntry("sap.app");if(e){o.appVersion=e.applicationVersion.version||C.S_DEFAULT_VALUE;o.appSupportInfo=e.ach||C.S_DEFAULT_VALUE;}else{o.appVersion=C.S_DEFAULT_VALUE;o.appSupportInfo=C.S_DEFAULT_VALUE;}}else{L.warning("Cannot access manifest to collect context data for survey",null,C.S_PLUGIN_CTXTDATACTRL_NAME);}r(o);}.bind(this));}else{L.warning("App not an UI5 app.",null,C.S_PLUGIN_CTXTDATACTRL_NAME);}}.bind(this));}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/data/Config',["sap/ui/base/Object","../utils/Constants"],function(O,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.Config",{_sQualtricsUri:null,_sTenantId:null,_sTenantRole:null,_sPushChannelPath:null,_bIsPushEnabled:false,_iDisplayFormat:null,_iDataFormat:null,_sProductName:null,_sPlatformType:null,_bIsLibraryLoadable:false,constructor:function(q,t,d){this.setQualtricUri(q);this.setTenantId(t);this.setDataFormat(d);},setQualtricUri:function(v){this._sQualtricsUri=v;this._iDisplayFormat=this._identifyDisplayFormat();},getQualtricsUri:function(){return this._sQualtricsUri;},setTenantId:function(v){this._sTenantId=v;},getTenantId:function(){return this._sTenantId;},setTenantRole:function(v){this._sTenantRole=v;},getTenantRole:function(){return this._sTenantRole;},setPushChannelPath:function(p){this._sPushChannelPath=p;},getPushChannelPath:function(){return this._sPushChannelPath;},setIsPushEnabled:function(i){if(i===true||i.toLowerCase()==="true"||i.toLowerCase()==="x"){this._bIsPushEnabled=true;}else{this._bIsPushEnabled=false;}},getIsPushEnabled:function(){return this._bIsPushEnabled;},getDisplayFormat:function(){return this._iDisplayFormat;},_identifyDisplayFormat:function(){if(this._sQualtricsUri&&!this._sQualtricsUri.includes("siteintercept")){return C.E_DISPLAY_FORMAT.iframe;}return C.E_DISPLAY_FORMAT.popover;},setDataFormat:function(d){this._iDataFormat=d;},getDataFormat:function(){return this._iDataFormat;},setProductName:function(p){this._sProductName=p;},getProductName:function(){return this._sProductName;},setPlatformType:function(p){this._sPlatformType=p;},getPlatformType:function(){return this._sPlatformType;},setIsLibraryLoadable:function(i){this._bIsLibraryLoadable=i;},getIsLibraryLoadable:function(){return this._bIsLibraryLoadable;}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/data/PushContextData',["sap/ui/base/Object","../utils/Constants"],function(O,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.PushContextData",{_iSrcType:null,_sSrcAppId:null,_sSrcAppTrigger:null,constructor:function(s,S,i){this._sSrcAppId=s;this._sSrcAppTrigger=S;this._bIsPushedSurvey=true;this._iSrcType=i;},getSourceAppId:function(){return this._sSrcAppId;},getSourceAppTrigger:function(){return this._sSrcAppTrigger;},getSourceType:function(){return this._iSrcType;},getIsBackendPushedSurvey:function(){return this._iSrcType===C.E_PUSH_SRC_TYPE.backend;}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/ui/IFrameVisual',["sap/ui/base/Object","sap/ui/core/HTML","sap/m/Button","sap/m/Dialog"],function(O,H,B,D){"use strict";return O.extend("sap.feedback.ui.flpplugin.ui.IFrameVisual",{_oConfig:{},_oResourceBundle:null,_oInvisibleSurveyButton:null,_oHeaderItemOptions:{},_oHeaderItem:null,_oCurrentDialog:null,constructor:function(c,r){this._oConfig=c;this._oResourceBundle=r;},_getText:function(t){var T=this._oResourceBundle.getText(t);return T;},show:function(c){var s=this._buildUri(c);var i=this._addIFrame(s);var d=this._defineDialogSettings(i);d=this._updateDialogDimensions(d);this._oCurrentDialog=new D(d);this._oCurrentDialog.open();},_defineDialogSettings:function(i){var d={title:this._getText("DIALOG_TITLE"),showHeader:true,content:i,buttons:[new B({text:this._getText("DIALOG_CLOSE_BUTTON"),type:"Transparent",press:function(){this._oCurrentDialog.close();}.bind(this)})]};return d;},_updateDialogDimensions:function(d){if(sap.ui.Device.system.desktop||sap.ui.Device.system.tablet){d.contentWidth="1000px";d.contentHeight="500px";}else{d.stretch=true;}return d;},_buildUri:function(c){var s=this._oConfig.getQualtricsUri();s+=c;return s;},_addIFrame:function(i){var h=new H();var c="<iframe src='"+i+"' scrolling='auto' frameborder='no' width='99%' style='position: absolute; height: 95%;'></iframe>";h.setContent(c);return h;}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/ui/PopOverVisual',["sap/ui/base/Object","sap/ui/thirdparty/jquery"],function(O,$){"use strict";return O.extend("sap.feedback.ui.flpplugin.ui.PopOverVisual",{constructor:function(){},show:function(){var h=$("#surveyTriggerButton");h.click();}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/ui/ShellBarButton',["sap/ui/base/Object","sap/ui/core/InvisibleText","../utils/Constants","../utils/Utils"],function(O,I,C,U){"use strict";return O.extend("sap.feedback.ui.flpplugin.ui.ShellBarButton",{_fnRendererPromise:null,_oResourceBundle:null,_oInvisibleSurveyButton:null,_oHeaderItemOptions:{},_oHeaderItem:null,_fnDialogCallback:null,_bIsButtonHidden:false,constructor:function(r,d,R){this._fnRendererPromise=r;this._fnDialogCallback=d;this._oResourceBundle=R;},init:function(){this._createInvisibleText();this._defineButtonOptions();return this._fnRendererPromise.then(function(r){this._oHeaderItem=r.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem",this._oHeaderItemOptions,true);}.bind(this));},_createInvisibleText:function(){this._oInvisibleSurveyButton=new I({id:C.S_INVISIBLE_ITEM_ID,text:this._getText("SHELLBAR_BUTTON_TOOLTIP")}).toStatic();},_defineButtonOptions:function(){this._oHeaderItemOptions={id:C.S_SHELL_BTN_ID,icon:"sap-icon://feedback",tooltip:this._getText("SHELLBAR_BUTTON_TOOLTIP"),ariaLabel:this._getText("SHELLBAR_BUTTON_TOOLTIP"),ariaHaspopup:"dialog",text:this._getText("SHELLBAR_BUTTON_TOOLTIP"),press:this._fnDialogCallback.bind(this)};},updateButtonState:function(){if(U.isUI5Application(U.getCurrentApp())){this._showButton();}else{this._hideButton();}},_showButton:function(){this._showHeaderItem();this._bIsButtonHidden=false;},_hideButton:function(){this._bIsButtonHidden=true;this._hideHeaderItem();return C.E_SHELLBAR_BUTTON_STATE.unchanged;},_showHeaderItem:function(){sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem([C.S_SHELL_BTN_ID]);},_hideHeaderItem:function(){sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem([C.S_SHELL_BTN_ID]);},_getText:function(t){var a=this._oResourceBundle.getText(t);return a;}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/utils/Constants',[],function(){"use strict";var c={S_PLUGIN_COMPONENT_NAME:"sap.feedback.ui.flpplugin.Component",S_PLUGIN_PLGCTRL_NAME:"sap.feedback.ui.flpplugin.controller.PluginController",S_PLUGIN_POPOVERVIS_NAME:"sap.feedback.ui.flpplugin.ui.PopOverVisual",S_PLUGIN_IFRAMEVIS_NAME:"sap.feedback.ui.flpplugin.ui.IFrameVisual",S_PLUGIN_PUSHCLNT_NAME:"sap.feedback.ui.flpplugin.controller.PushClient",S_PLUGIN_SHELLBARBTN_NAME:"sap.feedback.ui.flpplugin.ui.ShellBarButton",S_PLUGIN_CTXTDATACTRL_NAME:"sap.feedback.ui.flpplugin.controller.ContextDataController",S_PLUGIN_WEBAPPFEEDBACKLDR_NAME:"sap.feedback.ui.flpplugin.controller.WebAppFeedbackLoader",S_PLUGIN_APPCONTEXTDATA_NAME:"sap.feedback.ui.flpplugin.data.AppContextData",S_PLUGIN_PUSHCONTEXTDATA_NAME:"sap.feedback.ui.flpplugin.data.PushContextData",S_DEFAULT_VALUE:"N/A",S_LAUNCHPAD_VALUE:"LAUNCHPAD",S_SHELL_BTN_ID:"sap_qualtrics_surveyTriggerButton",S_INVISIBLE_ITEM_ID:"surveyTriggerButton",E_INTERCEPT_ID:{ux:"ux",push:"push"},E_PUSH_SRC_TYPE:{backend:1,userInApp:2},E_PLUGIN_STATE:{init:1,appLoaded:2,restart:3,shutdown:4,interceptLoaded:5,iframe:6,update:7},E_DISPLAY_FORMAT:{popover:1,iframe:2},E_SHELLBAR_BUTTON_STATE:{unchanged:1,restart:2},E_DATA_FORMAT:{version1:1,version2:2},E_APP_FRAMEWORK:{unknown:1,ui5:2,webgui:3,angular:4,react:5,vue:6}};return c;});
sap.ui.predefine('sap/feedback/ui/flpplugin/utils/InitDetection',["sap/ui/base/Object"],function(O){"use strict";return O.extend("sap.feedback.ui.flpplugin.utils.InitDetection",{_sUrl:null,constructor:function(u){this._sUrl=u;},isUrlLoadable:function(){return this._canLoadUrl(this._sUrl);},_canLoadUrl:function(u){return new Promise(function(r,R){var h={method:"HEAD",mode:"no-cors"};var v=new Request(u,h);fetch(v).then(function(o){return o;}).then(function(){r(true);}).catch(function(){R(false);});});}});});
sap.ui.predefine('sap/feedback/ui/flpplugin/utils/Utils',[],function(){"use strict";return{getCurrentApp:function(){return sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication();},isUI5Application:function(c){return c.applicationType.toLowerCase()==="ui5";}};});
sap.ui.predefine('sap/feedback/ui/library',["sap/ui/core/library"],function(l){"use strict";sap.ui.getCore().initLibrary({name:"sap.feedback.ui",dependencies:["sap.ui.core"],interfaces:[],elements:[],noLibraryCSS:true,version:"1.88.0"});return sap.feedback.ui;});
sap.ui.require.preload({
	"sap/feedback/ui/flpplugin/manifest.json":'{"_version":"1.7.0","sap.fiori":{"_version":"1.2.0","registrationIds":["F4413"],"archeType":"transactional"},"sap.app":{"id":"sap.feedback.ui.flpplugin","type":"component","applicationVersion":{"version":"1.88.0"},"i18n":"i18n/i18n.properties","ach":"CA-FLP-EXT-FX","title":"{{APP_TITLE}}","description":"{{APP_DESCRIPTION}}"},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"dependencies":{"minUI5Version":"1.84.0","libs":{"sap.ui.core":{},"sap.ushell":{},"sap.m":{}}},"contentDensities":{"compact":false,"cozy":false},"componentName":"sap.feedback.ui.flpplugin","services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService"}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.feedback.ui.flpplugin.i18n.i18n"}}}},"sap.flp":{"type":"plugin","config":{}}}',
	"sap/feedback/ui/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.feedback.ui","type":"library","embeds":["flpplugin"],"applicationVersion":{"version":"1.88.0"},"title":"UI5 library: sap.feedback.ui","description":"UI5 library: sap.feedback.ui","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.88","libs":{"sap.ui.core":{"minVersion":"1.88.0"},"sap.ushell":{"minVersion":"1.88.0","lazy":true}}},"library":{"i18n":false,"css":false,"content":{"elements":[],"interfaces":[]}}}}'
},"sap/feedback/ui/library-preload"
);
//# sourceMappingURL=library-preload.js.map