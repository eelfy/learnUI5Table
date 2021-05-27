//@ui5-bundle sap/ushell/demotiles/cdm/customtile/Component-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/demotiles/cdm/customtile/DynamicTile.controller',["sap/ui/thirdparty/datajs","sap/ushell/components/tiles/utils","sap/ushell/components/tiles/utilsRT","sap/ui/model/json/JSONModel","sap/base/Log","sap/base/util/UriParameters","sap/ui/core/mvc/Controller","sap/ushell/Config","sap/ui/thirdparty/jquery","sap/ushell/utils/WindowUtils"],function(O,U,a,J,L,b,C,c,j,W){"use strict";return C.extend("sap.ushell.demotiles.cdm.customtile.DynamicTile",{timer:null,oDataRequest:null,_getConfiguration:function(o){var p=o.properties||{},s=o.startupParameters||{},d={};d.display_title_text=p.title||"";d.display_subtitle_text=p.subtitle||"";d.display_icon_url=p.icon||"";d.navigation_target_url=p.targetURL||"";if(p.indicatorDataSource){d.service_url=p.indicatorDataSource.path;d.service_refresh_interval=p.indicatorDataSource.refresh;}d.form_factors={appDefault:false,manual:{desktop:true,tablet:true,phone:true},defaultParam:true};d.desktopChecked=d.form_factors.manual.desktop;d.tabletChecked=d.form_factors.manual.tablet;d.phoneChecked=d.form_factors.manual.phone;d.manualFormFactor=!(d.form_factors.appDefault)&&d.editable;d.appFormFactor=d.form_factors.appDefault;if(p.tilePersonalization){d.display_info_text=p.tilePersonalization.info_text;}if(s["sap-system"]){d.sap_system=s["sap-system"];}return d;},onInit:function(){var o=this.getOwnerComponent().getComponentData(),v=this.getView(),d=this._getConfiguration(o),m,n=d.navigation_target_url,s=d.sap_system,B,h,t=this,u;this.bIsDataRequested=true;if(s){u=sap.ushell.Container.getService("URLParsing");if(u.isIntentUrl(n)){h=u.parseShellHash(n);if(!h.params){h.params={};}h.params["sap-system"]=s;n="#"+u.constructShellHash(h);}else{n+=((n.indexOf("?")<0)?"?":"&")+"sap-system="+s;}}this.navigationTargetUrl=n;var A=j.sap.getModulePath("sap.ushell.demotiles.cdm.customtile");B=A+"/"+this.getOwnerComponent().getManifestEntry("custom.namespace.of.tile").backgroundImageRelativeToComponent;m=new J({config:d,data:a.getDataToDisplay(d,{number:(!this.bIsDataRequested?0:"...")}),backgroundImage:B,nav:{navigation_target_url:n},search:{display_highlight_terms:[]}});v.setModel(m);var e=o.properties.contentProviderId;if(c.last("/core/contentProviders/providerInfo/show")){sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function(f){return f.getSystemContext(e);}).then(function(S){m.setProperty("/config/contentProviderLabel",S.label);}).catch(function(E){L.error("DynamicTile.controller threw an error:",E);});}sap.ushell.Container.getServiceAsync("Configuration").then(function(S){S.attachSizeBehaviorUpdate(function(f){m.setProperty("/sizeBehavior",f);});});var T=this.getView().getTileControl();this.getView().addContent(T);},refreshHandler:function(d){d.loadData(0);},visibleHandler:function(i){var v=this.getView(),o=v.getModel().getProperty("/config"),n=o.service_refresh_interval;if(i){if(!this.bIsDataRequested){this.refreshHandler(this);}if(n){this.refreshHandler(this);}}else{this.stopRequests();}},setVisualPropertiesHandler:function(n){var d=false,D=this.getView().getModel().getProperty("/data");if(n.title){D.display_title_text=n.title;d=true;}if(n.subtitle){D.display_subtitle_text=n.subtitle;d=true;}if(n.icon){D.display_icon_url=n.icon;d=true;}if(d){this.getView().getModel().setProperty("/data",D);}},stopRequests:function(){if(this.timer){clearTimeout(this.timer);}if(this.oDataRequest){try{this.oDataRequest.abort();}catch(e){L.warning(e.name,e.message);}}},onExit:function(){this.stopRequests();},onPress:function(){var m=this.getView().getModel(),t=m.getProperty("/nav/navigation_target_url");if(t){if(t[0]==="#"){hasher.setHash(t);}else{W.openURL(t,"_blank");}}},onUpdateDynamicData:function(){var v=this.getView(),o=v.getModel().getProperty("/config"),n=o.service_refresh_interval;if(!n){n=0;}else if(n<10){L.warning("Refresh Interval "+n+" seconds for service URL "+o.service_url+" is less than 10 seconds, which is not supported. "+"Increased to 10 seconds automatically.",null,"sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller");n=10;}if(o.service_url){this.loadData(n);}},extractData:function(d){var n,k=["results","icon","title","number","numberUnit","info","infoState","infoStatus","targetParams","subtitle","stateArrow","numberState","numberDigits","numberFactor"];if(typeof d==="object"&&Object.keys(d).length===1){n=Object.keys(d)[0];if(jQuery.inArray(n,k)===-1){return d[n];}}return d;},successHandleFn:function(r){var o=this.getView().getModel().getProperty("/config");this.oDataRequest=undefined;var d=r,D;if(typeof r==="object"){var u=b.fromURL(o.service_url).get("$inlinecount");if(u&&u==="allpages"){d={number:r.__count};}else{d=this.extractData(d);}}else if(typeof r==="string"){d={number:r};}if(d&&d.results&&d.results[0]&&typeof d.results[0].number==="number"){d={number:d.results[0].number%101,numberState:d.numberState};}D=a.getDataToDisplay(o,d);this.getView().getModel().setProperty("/data",D);this.getView().getModel().setProperty("/nav/navigation_target_url",a.addParamsToUrl(this.navigationTargetUrl,D));},errorHandlerFn:function(m){var o=this.getView().getModel().getProperty("/config");this.oDataRequest=undefined;var M=m&&m.message?m.message:m,r=U.getResourceBundleModel().getResourceBundle();if(m.response){M+=" - "+m.response.statusCode+" "+m.response.statusText;}L.error("Failed to update data via service "+o.service_url+": "+M,null,"sap.ushell.components.tiles.applauncherdynamic.DynamicTile");this.getView().getModel().setProperty("/data",a.getDataToDisplay(o,{number:"???",info:r.getText("dynamic_data.error"),infoState:"Critical"}));},loadData:function(n){var d=this.getView(),o=d.getModel().getProperty("/config"),u=o.service_url,t=this,l,s;if(!u){return;}if(n>0){L.info("Wait "+n+" seconds before calling "+o.service_url+" again",null,"sap.ushell.components.tiles.applauncherdynamic.DynamicTile.controller");this.timer=setTimeout(t.loadData.bind(t,n,false),(n*1000));}if(sap.ushell.Container){l=sap.ushell.Container.getUser().getLanguage();s=sap.ushell.Container.getLogonSystem()?sap.ushell.Container.getLogonSystem().getClient():"";}if((l)&&(u.indexOf("sap-language=")==-1)){u=u+(u.indexOf("?")>=0?"&":"?")+"sap-language="+l;}this.bIsDataRequested=true;t.oDataRequest=O.read({requestUri:u,headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0","Accept-Language":(sap.ui&&sap.ui.getCore().getConfiguration().getLanguage())||"","sap-client":(s||""),"sap-language":(l||"")}},this.successHandleFn.bind(this),this.errorHandlerFn.bind(this));},formatters:{urlToExternal:function(u){if((u||"").charAt(0)!=="#"){return u;}var q=window.location.search;if(!q){q="?appState=lean";}else if(q.indexOf("appState=")>=-1){q+="&appState=lean";}return window.location.origin+window.location.pathname+q+u;}}});});
sap.ui.require.preload({
	"sap/ushell/demotiles/cdm/customtile/Component.js":function(){(function(){"use strict";jQuery.sap.declare("sap.ushell.demotiles.cdm.customtile.Component");sap.ui.define(["sap/ui/core/UIComponent"],function(U){return U.extend("sap.ushell.demotiles.cdm.customtile.Component",{metadata:{"manifest":"json"},tileSetVisible:function(n){this._controller.visibleHandler(n);},tileRefresh:function(){this._controller.refreshHandler(this._controller);},tileSetVisualProperties:function(n){this._controller.setVisualPropertiesHandler(n);},createContent:function(){sap.ui.require(["sap/m/Table","sap/m/TimePicker","sap/m/Tree"],function(){console.log("modules from core-ext-light.js have been loaded");});var t=sap.ui.view({viewName:"sap.ushell.demotiles.cdm.customtile.DynamicTile",type:sap.ui.core.mvc.ViewType.JS});this._controller=t.getController();return t;}});});}());
},
	"sap/ushell/demotiles/cdm/customtile/DynamicTile.view.js":function(){(function(){"use strict";sap.ui.jsview("sap.ushell.demotiles.cdm.customtile.DynamicTile",{getControllerName:function(){return"sap.ushell.demotiles.cdm.customtile.DynamicTile";},createContent:function(){this.setHeight("100%");this.setWidth("100%");},getTileControl:function(){jQuery.sap.require("sap.m.GenericTile");var c=this.getController();var t=new sap.m.GenericTile({mode:sap.m.GenericTileMode.ContentMode,header:"{/data/display_title_text}",subheader:"{/data/display_subtitle_text}",size:"Auto",sizeBehavior:"{/sizeBehavior}",url:{parts:["/nav/navigation_target_url"],formatter:c.formatters.urlToExternal},backgroundImage:"{/backgroundImage}",tileContent:[new sap.m.TileContent({size:"Auto",footer:"{/data/display_info_text}",unit:"{/data/display_number_unit}",content:[new sap.m.NumericContent({scale:"{/data/display_number_factor}",value:"{/data/display_number_value}",truncateValueTo:5,indicator:"{/data/display_state_arrow}",valueColor:"{/data/display_number_state}",icon:"{/data/display_icon_url}",width:"100%"})]})],press:[c.onPress,c],additionalTooltip:"{/properties/contentProviderLabel}"});return t;}});}());
},
	"sap/ushell/demotiles/cdm/customtile/manifest.json":'{"_version":"1.1.0","sap.flp":{"type":"tile","tileSize":"1x1"},"sap.app":{"id":"sap.ushell.demotiles.cdm.customtile","_version":"1.0.0","type":"application","applicationVersion":{"version":"1.0.0"},"title":"Custom Dynamic App Launcher","description":"Custom Tile","tags":{"keywords":[]},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-customTile":{"semanticObject":"Action","action":"customTile","signature":{"parameters":{}}}}}},"sap.ui":{"_version":"1.1.0","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","componentName":"sap.ushell.demotiles.cdm.customtile","dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}},"models":{},"rootView":{"viewName":"sap.ushell.demotiles.cdm.customtile.DynamicTile","type":"JS"},"handleValidation":false},"custom.namespace.of.tile":{"backgroundImageRelativeToComponent":"custom_tile.png"}}'
},"sap/ushell/demotiles/cdm/customtile/Component-preload"
);
//# sourceMappingURL=Component-preload.js.map