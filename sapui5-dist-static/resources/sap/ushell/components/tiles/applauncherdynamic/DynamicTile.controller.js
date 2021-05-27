// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ushell/components/tiles/utils","sap/ushell/components/tiles/utilsRT","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/services/AppType","sap/ushell/utils/WindowUtils","sap/m/library","sap/ui/model/json/JSONModel","sap/ui/thirdparty/jquery","sap/base/Log","sap/ushell/utils/DynamicTileRequest"],function(C,u,a,A,b,c,W,s,J,q,L,D){"use strict";var G=s.GenericTileScope;var d=s.GenericTileMode;var e="sap.ushell.components.tiles.applauncherdynamic.DynamicTile";return C.extend(e,{_aDoableObject:{},oDataRequest:null,sConfigNavigationTargetUrlOld:"",REFRESH_INTERVAL_MIN:10,constructTargetUrlWithSapSystem:function(n,S){var U,h;if(S){U=sap.ushell.Container.getService("URLParsing");if(U.isIntentUrl(n)){h=U.parseShellHash(n);if(!h.params){h.params={};}h.params["sap-system"]=S;n="#"+U.constructShellHash(h);}else{n+=((n.indexOf("?")<0)?"?":"&")+"sap-system="+S;}}return n;},onInit:function(){var t=this;var k;var K;var v=this.getView();var V=v.getViewData();var T=V.chip;var o=a.getConfiguration(T,T.configurationUi.isEnabled(),false);var N=o.navigation_target_url;var S=T.url.getApplicationSystem();this.sConfigNavigationTargetUrlOld=o.navigation_target_url;L.setLevel(2,e);this.bIsRequestCompleted=false;this.oShellModel=A.getElementsModel();this.navigationTargetUrl=this.constructTargetUrlWithSapSystem(N,S);var m=new J({sizeBehavior:b.last("/core/home/sizeBehavior"),wrappingType:b.last("/core/home/wrappingType"),config:o,mode:o.display_mode||d.ContentMode,data:a.getDataToDisplay(o,{number:((T.preview&&T.preview.isEnabled())?1234:"...")}),nav:{navigation_target_url:(T.configurationUi&&T.configurationUi.isEnabled()?"":this.navigationTargetUrl)},search:{display_highlight_terms:[]}});v.setModel(m);this._aDoableObject=b.on("/core/home/sizeBehavior").do(function(i){m.setProperty("/sizeBehavior",i);});if(T.types){T.types.attachSetType(function(g){if(t.tileType!==g){var m=t.getView().getModel();if(g==="link"){m.setProperty("/mode",d.LineMode);}else{m.setProperty("/mode",m.getProperty("/config/display_mode")||d.ContentMode);}t.tileType=g;}});}if(!this.tileType){this.tileType="tile";}if(T.search){k=v.getModel().getProperty("/config/display_search_keywords");K=k.split(/[, ]+/).filter(function(n,i){return n&&n!=="";});if(o.display_title_text&&o.display_title_text!==""&&K.indexOf(o.display_title_text)===-1){K.push(o.display_title_text);}if(o.display_subtitle_text&&o.display_subtitle_text!==""&&K.indexOf(o.display_subtitle_text)===-1){K.push(o.display_subtitle_text);}if(o.display_info_text&&o.display_info_text!==""&&K.indexOf(o.display_info_text)===-1){K.push(o.display_info_text);}if(o.display_number_unit&&o.display_number_unit!==""&&K.indexOf(o.display_number_unit)===-1){K.push(o.display_number_unit);}T.search.setKeywords(K);T.search.attachHighlight(function(H){v.getModel().setProperty("/search/display_highlight_terms",H);});}if(T.bag&&T.bag.attachBagsUpdated){T.bag.attachBagsUpdated(function(U){if(U.indexOf("tileProperties")>-1){u._updateTilePropertiesTexts(v,T.bag.getBag("tileProperties"));}});}if(T.configuration&&T.configuration.attachConfigurationUpdated){T.configuration.attachConfigurationUpdated(function(U){if(U.indexOf("tileConfiguration")>-1){u._updateTileConfiguration(v,T.configuration.getParameterValueAsString("tileConfiguration"));}});}if(T.preview){T.preview.setTargetUrl(this.navigationTargetUrl);T.preview.setPreviewIcon(o.display_icon_url);T.preview.setPreviewTitle(o.display_title_text);if(T.preview.setPreviewSubtitle&&typeof T.preview.setPreviewSubtitle==="function"){T.preview.setPreviewSubtitle(o.display_subtitle_text);}}if(T.configurationUi.isEnabled()){T.configurationUi.setUiProvider(function(){var i=u.getConfigurationUi(v,"sap.ushell.components.tiles.applauncherdynamic.Configuration");T.configurationUi.attachCancel(t.onCancelConfiguration.bind(null,i));T.configurationUi.attachSave(t.onSaveConfiguration.bind(null,i));return i;});this.getView().getContent()[0].setTooltip(u.getResourceBundleModel().getResourceBundle().getText("edit_configuration.tooltip"));}else if(!T.preview||!T.preview.isEnabled()){if(!S){sap.ushell.Container.addRemoteSystemForServiceUrl(o.service_url);}this.bNeedsRefresh=true;this.iNrOfTimerRunning=0;}if(T.refresh){T.refresh.attachRefresh(this.refreshHandler.bind(this));}if(T.visible){T.visible.attachVisible(this.visibleHandler.bind(this));}if(T.actions){var f=o.actions,E;if(f){E=f.slice();}else{E=[];}if(b.last("/core/shell/enablePersonalization")){var g=m.getProperty("/mode")===d.LineMode?"link":"tile",h=a.getTileSettingsAction(m,this.onSaveRuntimeSettings.bind(this),g);E.push(h);}T.actions.setActionsProvider(function(){return E;});}sap.ui.getCore().getEventBus().subscribe("launchpad","sessionTimeout",this._clearRequest,this);},stopRequests:function(){if(this.oDataRequest){this.oDataRequest.abort();this.bNeedsRefresh=true;}},_clearRequest:function(){this.stopRequests();clearTimeout(this.timer);},onExit:function(){if(this.oDataRequest){this._clearRequest();this.oDataRequest.destroy();}sap.ui.getCore().getEventBus().unsubscribe("launchpad","sessionTimeout",this._clearRequest,this);this._aDoableObject.off();},onPress:function(E){var v=this.getView(),V=v.getViewData(),m=v.getModel(),t=m.getProperty("/nav/navigation_target_url"),T=V.chip,o=m.getProperty("/config");if(E.getSource().getScope&&E.getSource().getScope()===G.Display){if(T.configurationUi.isEnabled()){T.configurationUi.display();}else if(t){if(t[0]==="#"){hasher.setHash(t);}else{var l=b.last("/core/shell/enableRecentActivity")&&b.last("/core/shell/enableRecentActivityLogging");if(l){var r={title:o.display_title_text,appType:c.URL,url:o.navigation_target_url,appId:o.navigation_target_url};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(r);}W.openURL(t,"_blank");}}}},onSaveRuntimeSettings:function(S){var v=this.getView(),V=v.getModel(),t=v.getViewData().chip,o=V.getProperty("/config"),f=S.getModel();o.display_title_text=f.getProperty("/title")||"";o.display_subtitle_text=f.getProperty("/subtitle")||"";o.display_info_text=f.getProperty("/info")||"";o.display_search_keywords=f.getProperty("/keywords")||"";var g=t.bag.getBag("tileProperties");g.setText("display_title_text",o.display_title_text);g.setText("display_subtitle_text",o.display_subtitle_text);g.setText("display_info_text",o.display_info_text);g.setText("display_search_keywords",o.display_search_keywords);function l(E){L.error(E,null,e);}g.save(function(){L.debug("property bag 'tileProperties' saved successfully");V.setProperty("/config",o);V.setProperty("/data/display_title_text",o.display_title_text);V.setProperty("/data/display_subtitle_text",o.display_subtitle_text);V.setProperty("/data/display_info_text",o.display_info_text);V.refresh();},l);},onSaveConfiguration:function(o){var f=new q.Deferred(),m=o.getModel(),t=m.getProperty("/tileModel"),T=o.getViewData().chip,g=u.tileActionsRows2TileActionsArray(m.getProperty("/config/tile_actions_rows")),h={display_icon_url:m.getProperty("/config/display_icon_url"),display_number_unit:m.getProperty("/config/display_number_unit"),service_url:m.getProperty("/config/service_url"),service_refresh_interval:m.getProperty("/config/service_refresh_interval"),navigation_use_semantic_object:m.getProperty("/config/navigation_use_semantic_object"),navigation_target_url:m.getProperty("/config/navigation_target_url"),navigation_semantic_object:q.trim(m.getProperty("/config/navigation_semantic_object"))||"",navigation_semantic_action:q.trim(m.getProperty("/config/navigation_semantic_action"))||"",navigation_semantic_parameters:q.trim(m.getProperty("/config/navigation_semantic_parameters")),display_search_keywords:m.getProperty("/config/display_search_keywords")};var r=u.checkInputOnSaveConfig(o);if(!r){r=u.checkTileActions(o);}if(r){f.reject("mandatory_fields_missing");return f.promise();}if(h.navigation_use_semantic_object){h.navigation_target_url=a.getSemanticNavigationUrl(h);m.setProperty("/config/navigation_target_url",h.navigation_target_url);}var i=T.bag.getBag("tileProperties");i.setText("display_title_text",m.getProperty("/config/display_title_text"));i.setText("display_subtitle_text",m.getProperty("/config/display_subtitle_text"));i.setText("display_info_text",m.getProperty("/config/display_info_text"));i.setText("display_search_keywords",h.display_search_keywords);var j=T.bag.getBag("tileNavigationActions");u.populateTileNavigationActionsBag(j,g);function l(E,k){L.error(E,null,e);f.reject(E,k);}T.writeConfiguration.setParameterValues({tileConfiguration:JSON.stringify(h)},function(){var k=a.getConfiguration(T,false,false),n=a.getConfiguration(T,true,false),m=new J({config:k,tileModel:t});o.setModel(m);t.setData({data:n,nav:{navigation_target_url:""}},false);if(T.preview){T.preview.setTargetUrl(k.navigation_target_url);T.preview.setPreviewIcon(k.display_icon_url);T.preview.setPreviewTitle(k.display_title_text);if(T.preview.setPreviewSubtitle&&typeof T.preview.setPreviewSubtitle==="function"){T.preview.setPreviewSubtitle(k.display_subtitle_text);}}i.save(function(){L.debug("property bag 'tileProperties' saved successfully");if(T.title){T.title.setTitle(k.display_title_text,function(){f.resolve();},l);}else{f.resolve();}},l);j.save(function(){L.debug("property bag 'navigationProperties' saved successfully");},l);},l);return f.promise();},successHandlerFn:function(r){var v=this.getView();var m=v.getModel();var o=m.getProperty("/config");var n=m.getProperty("/config/navigation_target_url");var R=m.getProperty("/config/service_refresh_interval");var S=m.getProperty("/config/service_url");var V=v.getViewData();var t=V.chip;var f=t.url.getApplicationSystem();if(V.properties&&V.properties.info){if(typeof r==="object"){r.info=V.properties.info;}}var g=a.getDataToDisplay(o,r);m.setProperty("/data",g);if(this.sConfigNavigationTargetUrlOld!==n){this.navigationTargetUrl=this.constructTargetUrlWithSapSystem(n,f);this.sConfigNavigationTargetUrlOld=this.navigationTargetUrl;}m.setProperty("/nav/navigation_target_url",a.addParamsToUrl(this.navigationTargetUrl,g));if(R>0){R=Math.max(R,this.REFRESH_INTERVAL_MIN);L.info("Wait "+R+" seconds before calling "+S+" again",null,e);this.refeshAfterInterval(R);}},errorHandlerFn:function(m,i){var v=this.getView();var M=v.getModel();var S=M.getProperty("/config/service_url");var f=m&&m.message?m.message:m;if(m.statusText==="Abort"){L.info("Data request from service "+S+" was aborted",null,e);}else{if(m.response){f+=" - "+m.response.statusCode+" "+m.response.statusText;}var l=i?L.warning:L.error;l("Failed to update data via service\n service URL: "+S+"\n "+f,null,e);}this._setTileIntoErrorState();},_setTileIntoErrorState:function(){var r=u.getResourceBundleModel().getResourceBundle();var m=this.getView().getModel();var o=m.getProperty("/config");m.setProperty("/data",a.getDataToDisplay(o,{number:"???",info:r.getText("dynamic_data.error"),infoState:"Critical"}));},onCancelConfiguration:function(o){var v=o.getViewData(),m=o.getModel(),t=m.getProperty("/tileModel"),T=v.chip,f=a.getConfiguration(T,false,false);m.setData({config:f,tileModel:t},false);},loadData:function(){var v=this.getView();var t=v.getViewData().chip;var m=v.getModel();var U=m.getProperty("/config/service_url");if(/;o=([;/?]|$)/.test(U)){U=t.url.addSystemToServiceUrl(U);}if(!U){L.error("No service URL given!",e);this._setTileIntoErrorState();return;}if(!this.oDataRequest||this.oDataRequest.sUrl!==U){if(this.oDataRequest){this.oDataRequest.destroy();}this.sRequestUrl=U;this.oDataRequest=new D(U,this.successHandlerFn.bind(this),this.errorHandlerFn.bind(this));}else if(this.oDataRequest){this.oDataRequest.refresh();}},refreshTile:function(){var v=this.getView(),V=v.getViewData(),i=V.chip.visible.isVisible();if(i&&this.bNeedsRefresh){this.bNeedsRefresh=false;this.loadData();}},refeshAfterInterval:function(r){this.iNrOfTimerRunning++;this.timer=window.setTimeout(function(){this.iNrOfTimerRunning--;if(this.iNrOfTimerRunning===0){this.bNeedsRefresh=true;this.refreshTile();}}.bind(this),r*1000);},refreshHandler:function(){this.bNeedsRefresh=true;this.refreshTile();},visibleHandler:function(i){if(i){this.refreshTile();}else{this.stopRequests();}},formatters:{leanURL:W.getLeanURL}});},false);