//@ui5-bundle sap_ushell_demotiles_abap_customTileDynamic/Component-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.controller',['sap/ushell/components/tiles/utils'],function(u){"use strict";sap.ui.controller("sap.ushell.demotiles.abap.customTileDynamic.Configuration",{onConfigurationInputChange:function(c){u.checkInput(this.getView(),c);},aDefaultObjects:[{obj:"",name:""}],onInit:function(){var v=this.getView(),s=v.byId("navigation_semantic_objectInput"),a=v.byId("navigation_semantic_actionInput"),r=u.getResourceBundleModel();v.setModel(r,"i18n");var b=r.getResourceBundle();v.setViewName("sap.ushell.demotiles.abap.customTileDynamic.Configuration");u.createSemanticObjectModel(this,s,this.aDefaultObjects);u.createActionModel(this,a,this.aDefaultObjects);s.attachChange(function(c){var V=c.getSource().getValue();v.getModel().setProperty("/config/navigation_semantic_object",V);});a.attachChange(function(c){var V=c.getSource().getValue();v.getModel().setProperty("/config/navigation_semantic_action",V);});v.byId("targetUrl").bindProperty("enabled",{formatter:function(U){return!U;},path:"/config/navigation_use_semantic_object"});var i=new sap.ui.core.ListItem({key:"URL",text:b.getText("configuration.tile_actions.table.target_type.url")});v.byId("targetTypeCB").addItem(i);i=new sap.ui.core.ListItem({key:"INT",text:b.getText("configuration.tile_actions.table.target_type.intent")});v.byId("targetTypeCB").addItem(i);},onAfterRendering:function(){u.updateMessageStripForOriginalLanguage(this.getView());},onValueHelpRequest:function(e){u.objectSelectOnValueHelpRequest(this,e,false);},onActionValueHelpRequest:function(e){u.actionSelectOnValueHelpRequest(this,e,false);},onCheckBoxChange:function(e){var v=this.getView(),s=v.byId("navigation_semantic_objectInput"),m=s.getModel(),a=e.getSource().getSelected();m.setProperty("/enabled",a);u.checkInput(this.getView(),e);},onIconValueHelpRequest:function(e){u.iconSelectOnValueHelpRequest(this,e,false);},onSelectIconClose:function(){u.onSelectIconClose(this.getView());},onSelectIconOk:function(){u.onSelectIconOk(this.getView());},handleTargetTypeChange:function(t){u.onTargetTypeChange(t);},onTileActionValueHelp:function(e){u.objectSelectOnValueHelpRequest(this,e,true);},onTileActionIconValueHelp:function(e){u.iconSelectOnValueHelpRequest(this,e,true);},addRow:function(){u.addTileActionsRow(this.getView());},deleteRow:function(){u.deleteTileActionsRow(this.getView());}});},true);
sap.ui.predefine('sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.controller',["sap/ui/thirdparty/datajs","sap/ushell/components/tiles/utils","sap/ushell/components/tiles/utilsRT","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/services/AppType","sap/ushell/utils/WindowUtils"],function(d,u,a,A,C,b,W){"use strict";var S="sap.ushell.demotiles.abap.customTileDynamic";sap.ui.getCore().loadLibrary("sap.m");sap.ui.controller(S+".DynamicTile",{timer:null,oDataRequest:null,onInit:function(){var v=this.getView(),V=v.getViewData(),t=V.chip,c=a.getConfiguration(t,t.configurationUi.isEnabled(),false),m,k,K,e=this,N=c.navigation_target_url,s,U,h,f="Responsive",B=jQuery.sap.getModulePath(S)+"/custom_tile.png";this.bIsRequestCompleted=false;this.oShellModel=A.getElementsModel();s=t.url.getApplicationSystem();if(s){U=sap.ushell.Container.getService("URLParsing");if(U.isIntentUrl(N)){h=U.parseShellHash(N);if(!h.params){h.params={};}h.params["sap-system"]=s;N="#"+U.constructShellHash(h);}else{N+=((N.indexOf("?")<0)?"?":"&")+"sap-system="+s;}}this.navigationTargetUrl=N;if(this.oShellModel){if(this.oShellModel.getModel()){f=this.oShellModel.getModel().getProperty("/sizeBehavior")?this.oShellModel.getModel().getProperty("/sizeBehavior"):"Responsive";}}m=new sap.ui.model.json.JSONModel({sizeBehavior:f,mode:c["display_mode"]||sap.m.GenericTileMode.ContentMode,backgroundImage:B,config:c,data:a.getDataToDisplay(c,{number:(t.configurationUi.isEnabled()?1234:"...")}),nav:{navigation_target_url:(t.configurationUi&&t.configurationUi.isEnabled()?"":N)},search:{display_highlight_terms:[]}});v.setModel(m);if(t.types){t.types.attachSetType(function(i){if(e.tileType!=i){var m=e.getView().getModel();if(i==='link'){m.setProperty("/mode",sap.m.GenericTileMode.LineMode);}else{m.setProperty("/mode",m.getProperty("/config/display_mode")||sap.m.GenericTileMode.ContentMode);}e.tileType=i;}});}if(!this.tileType){var T=this.getView().getTileControl();this.getView().addContent(T);this.tileType="tile";}if(t.search){k=v.getModel().getProperty("/config/display_search_keywords");K=k.split(/[, ]+/).filter(function(n,i){return n&&n!=="";});if(c.display_title_text&&c.display_title_text!==""&&K.indexOf(c.display_title_text)===-1){K.push(c.display_title_text);}if(c.display_subtitle_text&&c.display_subtitle_text!==""&&K.indexOf(c.display_subtitle_text)===-1){K.push(c.display_subtitle_text);}if(c.display_info_text&&c.display_info_text!==""&&K.indexOf(c.display_info_text)===-1){K.push(c.display_info_text);}t.search.setKeywords(K);t.search.attachHighlight(function(H){v.getModel().setProperty("/search/display_highlight_terms",H);});}if(t.bag&&t.bag.attachBagsUpdated){t.bag.attachBagsUpdated(function(i){if(i.indexOf("tileProperties")>-1){u._updateTilePropertiesTexts(v,t.bag.getBag('tileProperties'));}});}if(t.configuration&&t.configuration.attachConfigurationUpdated){t.configuration.attachConfigurationUpdated(function(i){if(i.indexOf("tileConfiguration")>-1){u._updateTileConfiguration(v,t.configuration.getParameterValueAsString("tileConfiguration"));}});}if(t.preview){t.preview.setTargetUrl(N);t.preview.setPreviewIcon(c.display_icon_url);t.preview.setPreviewTitle(c.display_title_text);if(t.preview.setPreviewSubtitle&&typeof t.preview.setPreviewSubtitle==='function'){t.preview.setPreviewSubtitle(c.display_subtitle_text);}}if(t.refresh){t.refresh.attachRefresh(this.refreshHandler.bind(null,this));}if(t.visible){t.visible.attachVisible(this.visibleHandler.bind(this));}if(t.configurationUi.isEnabled()){t.configurationUi.setUiProvider(function(){var o=u.getConfigurationUi(v,"sap.ushell.demotiles.abap.customTileDynamic.Configuration");t.configurationUi.attachCancel(e.onCancelConfiguration.bind(null,o));t.configurationUi.attachSave(e.onSaveConfiguration.bind(null,o));return o;});this.getView().getContent()[0].setTooltip(u.getResourceBundleModel().getResourceBundle().getText("edit_configuration.tooltip"));}else if(!t.preview||!t.preview.isEnabled()){if(!s){sap.ushell.Container.addRemoteSystemForServiceUrl(c.service_url);}this.onUpdateDynamicData();}if(t.actions){var g=c.actions,E;if(g){E=g.slice();}else{E=[];}var j=a.getTileSettingsAction(m,this.onSaveRuntimeSettings.bind(this));E.push(j);t.actions.setActionsProvider(function(){return E;});}sap.ui.getCore().getEventBus().subscribe("launchpad","sessionTimeout",this.stopRequests,this);},stopRequests:function(){if(this.timer){clearTimeout(this.timer);}if(this.oDataRequest){try{this.bIsAbortRequestFlow=true;this.oDataRequest.abort();}catch(e){jQuery.sap.log.warning(e.name,e.message);}this.bIsAbortRequestFlow=undefined;}},onExit:function(){this.stopRequests();sap.ui.getCore().getEventBus().unsubscribe("launchpad","sessionTimeout",this.stopRequests,this);},onPress:function(e){var v=this.getView(),V=v.getViewData(),m=v.getModel(),t=m.getProperty("/nav/navigation_target_url"),T=V.chip,o=m.getProperty("/config");if(e.getSource().getScope&&e.getSource().getScope()===sap.m.GenericTileScope.Display){if(T.configurationUi.isEnabled()){T.configurationUi.display();}else if(t){if(t[0]==="#"){hasher.setHash(t);}else{var l=C.last("/core/shell/enableRecentActivity")&&C.last("/core/shell/enableRecentActivityLogging");if(l){var r={title:o.display_title_text,appType:b.URL,url:o.navigation_target_url,appId:o.navigation_target_url};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(r);}W.openURL(t,'_blank');}}}},onUpdateDynamicData:function(){var v=this.getView(),c=v.getModel().getProperty("/config"),n=c.service_refresh_interval;if(!n){n=0;}else if(n<10){jQuery.sap.log.warning("Refresh Interval "+n+" seconds for service URL "+c.service_url+" is less than 10 seconds, which is not supported. "+"Increased to 10 seconds automatically.",null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");n=10;}if(c.service_url){this.loadData(n);}},extractData:function(D){var n,k=["results","icon","title","number","numberUnit","info","infoState","infoStatus","targetParams","subtitle","stateArrow","numberState","numberDigits","numberFactor"];if(typeof D==="object"&&Object.keys(D).length===1){n=Object.keys(D)[0];if(jQuery.inArray(n,k)===-1){return D[n];}}return D;},onSaveRuntimeSettings:function(s){var v=s.getModel(),t=this.getView().getViewData().chip,c=this.getView().getModel().getProperty("/config");c.display_title_text=v.getProperty('/title');c.display_subtitle_text=v.getProperty('/subtitle');c.display_info_text=v.getProperty('/info');c.display_search_keywords=v.getProperty('/keywords');var e=t.bag.getBag('tileProperties');e.setText('display_title_text',c.display_title_text);e.setText('display_subtitle_text',c.display_subtitle_text);e.setText('display_info_text',c.display_info_text);e.setText('display_search_keywords',c.display_search_keywords);function l(E){jQuery.sap.log.error(E,null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");}e.save(function(){jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");this.getView().getModel().setProperty("/config",c);this.getView().getModel().setProperty('/data/display_title_text',c.display_title_text);this.getView().getModel().setProperty('/data/display_subtitle_text',c.display_subtitle_text);this.getView().getModel().setProperty('/data/display_info_text',c.display_info_text);this.getView().getModel().refresh();}.bind(this),l);},onSaveConfiguration:function(c){var D=jQuery.Deferred(),m=c.getModel(),t=m.getProperty("/tileModel"),T=c.getViewData().chip,e=u.tileActionsRows2TileActionsArray(m.getProperty("/config/tile_actions_rows")),f={display_icon_url:m.getProperty("/config/display_icon_url"),display_number_unit:m.getProperty("/config/display_number_unit"),service_url:m.getProperty("/config/service_url"),service_refresh_interval:m.getProperty("/config/service_refresh_interval"),navigation_use_semantic_object:m.getProperty("/config/navigation_use_semantic_object"),navigation_target_url:m.getProperty("/config/navigation_target_url"),navigation_semantic_object:jQuery.trim(m.getProperty("/config/navigation_semantic_object"))||"",navigation_semantic_action:jQuery.trim(m.getProperty("/config/navigation_semantic_action"))||"",navigation_semantic_parameters:jQuery.trim(m.getProperty("/config/navigation_semantic_parameters")),display_search_keywords:m.getProperty("/config/display_search_keywords")};var r=u.checkInputOnSaveConfig(c);if(!r){r=u.checkTileActions(c);}if(r){D.reject("mandatory_fields_missing");return D.promise();}if(f.navigation_use_semantic_object){f.navigation_target_url=a.getSemanticNavigationUrl(f);m.setProperty("/config/navigation_target_url",f.navigation_target_url);}var g=T.bag.getBag('tileProperties');g.setText('display_title_text',m.getProperty("/config/display_title_text"));g.setText('display_subtitle_text',m.getProperty("/config/display_subtitle_text"));g.setText('display_info_text',m.getProperty("/config/display_info_text"));g.setText('display_search_keywords',f.display_search_keywords);var h=T.bag.getBag('tileNavigationActions');u.populateTileNavigationActionsBag(h,e);function l(E,o){jQuery.sap.log.error(E,null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");D.reject(E,o);}T.writeConfiguration.setParameterValues({tileConfiguration:JSON.stringify(f)},function(){var o=a.getConfiguration(T,false,false),i=a.getConfiguration(T,true,false),m=new sap.ui.model.json.JSONModel({config:o,tileModel:t});c.setModel(m);t.setData({data:i,nav:{navigation_target_url:""}},false);if(T.preview){T.preview.setTargetUrl(o.navigation_target_url);T.preview.setPreviewIcon(o.display_icon_url);T.preview.setPreviewTitle(o.display_title_text);if(T.preview.setPreviewSubtitle&&typeof T.preview.setPreviewSubtitle==='function'){T.preview.setPreviewSubtitle(o.display_subtitle_text);}}g.save(function(){jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");if(T.title){T.title.setTitle(o.display_title_text,function(){D.resolve();},l);}else{D.resolve();}},l);h.save(function(){jQuery.sap.log.debug("property bag 'navigationProperties' saved successfully");},l);},l);return D.promise();},successHandleFn:function(r){this.bIsRequestCompleted=true;var c=this.getView().getModel().getProperty("/config");this.oDataRequest=undefined;var D=r,o,t;if(typeof r==="object"){var e=jQuery.sap.getUriParameters(c.service_url).get("$inlinecount");if(e&&e==="allpages"){D={number:r.__count};}else{D=this.extractData(D);}}else if(typeof r==="string"){D={number:r};}if((this.getView().getViewData().properties)&&(this.getView().getViewData().properties.info)){if(typeof D=="object"){t=this.getView().getViewData().properties.info;D.info=t;}}o=a.getDataToDisplay(c,D);this.getView().getModel().setProperty("/data",o);this.navigationTargetUrl=c.navigation_target_url;this.getView().getModel().setProperty("/nav/navigation_target_url",a.addParamsToUrl(this.navigationTargetUrl,o));},errorHandlerFn:function(m){if(!this.bIsAbortRequestFlow){this.bIsRequestCompleted=true;}var c=this.getView().getModel().getProperty("/config");this.oDataRequest=undefined;var M=m&&m.message?m.message:m,r=u.getResourceBundleModel().getResourceBundle();if(M==="Request aborted"){jQuery.sap.log.info("Data request from service "+c.service_url+" was aborted",null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile");}else{if(m.response){M+=" - "+m.response.statusCode+" "+m.response.statusText;}jQuery.sap.log.error("Failed to update data via service "+c.service_url+": "+M,null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile");}if(!this.bIsAbortRequestFlow){this.getView().getModel().setProperty("/data",a.getDataToDisplay(c,{number:"???",info:r.getText("dynamic_data.error"),infoState:"Critical"}));}},onCancelConfiguration:function(c,s,e){var v=c.getViewData(),m=c.getModel(),t=m.getProperty("/tileModel"),T=v.chip,o=a.getConfiguration(T,false,false);c.getModel().setData({config:o,tileModel:t},false);},loadData:function(n){var D=this.getView(),c=D.getModel().getProperty("/config"),U=c.service_url,t=this;var T=this.getView().getViewData().chip;if(!U){return;}if(/;o=([;\/?]|$)/.test(U)){U=T.url.addSystemToServiceUrl(U);}if(n>0){jQuery.sap.log.info("Wait "+n+" seconds before calling "+c.service_url+" again",null,"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");if(this.timer){clearTimeout(this.timer);}this.timer=setTimeout(t.loadData.bind(t,n,false),(n*1000));}if(T.visible.isVisible()&&!t.oDataRequest){var l=sap.ui.getCore().getConfiguration().getSAPLogonLanguage();if((l)&&(U.indexOf("sap-language=")==-1)){U=U+(U.indexOf("?")>=0?"&":"?")+"sap-language="+l;}t.oDataRequest=OData.read({requestUri:U,headers:{"Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0"}},this.successHandleFn.bind(this),this.errorHandlerFn.bind(this));}},refreshHandler:function(D,i){var t=D.getView().getViewData().chip;if(!t.configurationUi.isEnabled()){i=i?i:0;D.loadData(i);}else{D.stopRequests();}},visibleHandler:function(i){var v=this.getView(),c=v.getModel().getProperty("/config"),n=c.service_refresh_interval;if(i){if(n>0){this.refreshHandler(this,Math.max(n,10));}else if(!this.bIsRequestCompleted){this.refreshHandler(this,0);}}else{this.stopRequests();}},formatters:{urlToExternal:function(U){if((U||"").charAt(0)!=="#"){return U;}var q=window.location.search;if(!q){q="?appState=lean";}else if(q.indexOf("appState=")>=-1){q+="&appState=lean";}return window.location.origin+window.location.pathname+q+U;}}});},false);
sap.ui.predefine('sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.view',["sap/m/GenericTile",],function(G){"use strict";sap.ui.jsview("sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",{getControllerName:function(){return"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile";},createContent:function(){this.setHeight("100%");this.setWidth("100%");return this.getTileControl();},getTileControl:function(){var c=this.getController();return new G({mode:"{/mode}",header:"{/data/display_title_text}",subheader:"{/data/display_subtitle_text}",size:"Auto",sizeBehavior:"{/sizeBehavior}",backgroundImage:"{/backgroundImage}",url:{parts:["/nav/navigation_target_url"],formatter:c.formatters.urlToExternal},tileContent:[new sap.m.TileContent({size:"Auto",footer:"{/data/display_info_text}",footerColor:{path:"/data/display_info_state",formatter:function(f){if(!sap.m.ValueColor[f]){f=sap.m.ValueColor.Neutral;}return f;}},unit:"{/data/display_number_unit}",content:[new sap.m.NumericContent({scale:"{/data/display_number_factor}",value:"{/data/display_number_value}",truncateValueTo:5,indicator:"{/data/display_state_arrow}",valueColor:{path:"/data/display_number_state",formatter:function(v){if(!sap.m.ValueColor[v]){v=sap.m.ValueColor.Neutral;}return v;}},icon:"{/data/display_icon_url}",width:"100%"})]})],press:[c.onPress,c]});},onAfterRendering:function(){var m=this.getModel(),d=m.getProperty("/data/display_info_state"),e=this.getDomRef(),a=e?e.getElementsByClassName("sapMTileCntFtrTxt")[0]:null;if(a){switch(d){case"Negative":a.classList.add("sapUshellTileFooterInfoNegative");break;case"Neutral":a.classList.add("sapUshellTileFooterInfoNeutral");break;case"Positive":a.classList.add("sapUshellTileFooterInfoPositive");break;case"Critical":a.classList.add("sapUshellTileFooterInfoCritical");break;default:return;}}}});});
sap.ui.require.preload({
	"sap_ushell_demotiles_abap_customTileDynamic/Component.js":function(){(function(){"use strict";jQuery.sap.declare("sap_ushell_demotiles_abap_customTileDynamic.Component");sap.ui.define(["sap/ui/core/UIComponent"],function(U){return U.extend("sap_ushell_demotiles_abap_customTileDynamic.Component",{metadata:{"manifest":"json"},tileSetVisible:function(n){this._controller.visibleHandler(n);},tileRefresh:function(){this._controller.refreshHandler(this._controller);},tileSetVisualProperties:function(n){this._controller.setVisualPropertiesHandler(n);},createContent:function(){var t=sap.ui.view({viewName:"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",type:sap.ui.core.mvc.ViewType.JS});this._controller=t.getController();return t;}});});}());
},
	"sap_ushell_demotiles_abap_customTileDynamic/manifest.json":'{"_version":"1.1.0","sap.flp":{"type":"tile","tileSize":"1x1"},"sap.app":{"id":"sap_ushell_demotiles_abap_customTileDynamic","_version":"1.0.0","type":"application","applicationVersion":{"version":"1.0.0"},"title":"Custom Dynamic App Launcher","description":"Custom Tile","tags":{"keywords":[]},"ach":"CA-UI2-INT-FE"},"sap.ui":{"_version":"1.1.0","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","componentName":"sap_ushell_demotiles_abap_customTileDynamic","dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}},"models":{},"rootView":{"viewName":"sap_ushell_demotiles_abap_customTileDynamic.DynamicTile","type":"JS"},"handleValidation":false}}',
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.view.xml":'<core:View xmlns="sap.m" xmlns:commons="sap.ui.commons" xmlns:commonsLayout="sap.ui.commons.layout" xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:layout="sap.ui.layout" xmlns:table="sap.ui.table" controllerName="sap.ushell.demotiles.abap.customTileDynamic.Configuration"><MessageStrip id="messageStrip" showIcon="true" showCloseButton="false" visible="false"/><form:SimpleForm id="configuration" maxContainerCols="8" minWidth="1024" editable="true"><form:content><core:Title id="categoryCommon" text="{i18n&gt;configuration.category.general}"/><Label text="{i18n&gt;configuration.display_title_text}"/><Input id="titleInput" value="{/config/display_title_text}" width="100%" tooltip="{i18n&gt;configuration.display_title_text.tooltip}" enabled="{/config/editable}" editable="{/config/isLocaleSuitable}"/><Label text="{i18n&gt;configuration.display_subtitle_text}"/><Input id="subtitleInput" value="{/config/display_subtitle_text}" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.display_subtitle_text.tooltip}" editable="{/config/isLocaleSuitable}"/><Label text="{i18n&gt;configuration.keywords}"/><Input id="keywordsInput" value="{/config/display_search_keywords}" enabled="{/config/editable}" width="100%" tooltip="{i18n&gt;configuration.keywords.tooltip}" editable="{/config/isLocaleSuitable}"/><Label text="{i18n&gt;configuration.display_icon_url}"/><Input id="iconInput" value="{/config/display_icon_url}" enabled="{/config/editable}" placeholder="sap-icon://inbox" tooltip="{i18n&gt;configuration.display_icon_url.tooltip}" liveChange="onConfigurationInputChange" valueHelpRequest="onIconValueHelpRequest" showValueHelp="true"/><Label text="{i18n&gt;configuration.display_info_text}"/><Input id="infoInput" value="{/config/display_info_text}" width="100%" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.display_info_text.tooltip}" editable="{/config/isLocaleSuitable}"/><Label text="{i18n&gt;configuration.display_number_unit}"/><Input id="number_unitInput" value="{/config/display_number_unit}" width="100%" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.display_number_unit.tooltip}"/><core:Title id="categoryDynamicData" text="{i18n&gt;configuration.category.dynamic_data}"/><Label text="{i18n&gt;configuration.service_url}"/><Input id="serviceUrlInput" value="{/config/service_url}" width="100%" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.service_url.tooltip}"/><Label text="{i18n&gt;configuration.service_refresh_interval}"/><Input id="refreshInput" value="{/config/service_refresh_interval}" type="Number" enabled="{/config/editable}" placeholder="{i18n&gt;configuration.seconds}" tooltip="{i18n&gt;configuration.seconds.tooltip}"/><core:Title id="categoryNavigation" text="{i18n&gt;configuration.category.navigation}"/><Label text="{i18n&gt;configuration.navigation_use_semantic_object}"/><CheckBox id="useLpdCheckbox" selected="{/config/navigation_use_semantic_object}" select="onCheckBoxChange" tooltip="{i18n&gt;configuration.navigation_use_semantic_object.tooltip}" enabled="{/config/editable}"/><Label text="{i18n&gt;configuration.semantic_object}"/><Input id="navigation_semantic_objectInput" width="100%" tooltip="{i18n&gt;configuration.semantic_object.tooltip}" maxLength="30" liveChange="onConfigurationInputChange" valueHelpRequest="onValueHelpRequest" showValueHelp="true" showSuggestion="true" enabled="{= ${/enabled} &amp;&amp; ${/config/editable}}" value="{/value}"/><Label text="{i18n&gt;configuration.navigation_semantic_action}"/><Input id="navigation_semantic_actionInput" value="{/config/navigation_semantic_action}" width="100%" maxLength="50" enabled="{= ${/config/navigation_use_semantic_object} &amp;&amp; ${/config/editable}}" tooltip="{i18n&gt;configuration.navigation_semantic_action.tooltip}" liveChange="onConfigurationInputChange" valueHelpRequest="onActionValueHelpRequest" showValueHelp="true" showSuggestion="true"/><Label text="{i18n&gt;configuration.navigation_semantic_parameters}"/><Input id="navigation_semantic_parametersInput" value="{/config/navigation_semantic_parameters}" width="100%" enabled="{= ${/config/navigation_use_semantic_object} &amp;&amp; ${/config/editable}}" tooltip="{i18n&gt;configuration.navigation_semantic_parameters.tooltip}"/><Label text="{i18n&gt;configuration.navigation_target_url}"/><Input id="targetUrl" value="{/config/navigation_target_url}" type="Url" width="100%" tooltip="{i18n&gt;configuration.navigation_target_url.tooltip}"/><core:Title id="categoryTileActions" text="{i18n&gt;configuration.category.tile_actions}"/><table:Table id="tileActions" rows="{/config/tile_actions_rows}" selectionBehavior="Row" selectionMode="Multi" visibleRowCount="3" enableColumnReordering="false" rowHeight="30px"><table:Column id="menuItem" width="80px" tooltip="{i18n&gt;configuration.tile_actions.table.menu_item_tooltip}"><Label text="{i18n&gt;configuration.tile_actions.table.menu_item}"/><table:template><commons:TextField value="{menu_title}" enabled="{editable}" valueState="{valueState}"/></table:template></table:Column><table:Column id="targetType" width="85px" tooltip="{i18n&gt;configuration.tile_actions.table.target_type_tooltip}"><Label text="{i18n&gt;configuration.tile_actions.table.target_type}"/><table:template><commons:ComboBox id="targetTypeCB" value="{target_type}" enabled="{editable}" change="handleTargetTypeChange"/></table:template></table:Column><table:Column id="navigationTarget" width="162px" tooltip="{i18n&gt;configuration.tile_actions.table.navigation_target_tooltip}"><Label text="{i18n&gt;configuration.tile_actions.table.navigation_target}"/><table:template><Input liveChange="onConfigurationInputChange" valueHelpRequest="onTileActionValueHelp" showValueHelp="{isTargetTypeIntent}" showSuggestion="{isTargetTypeIntent}" value="{navigation_target}" enabled="{editable}"/></table:template></table:Column><table:Column id="action" width="85px" tooltip="{i18n&gt;configuration.tile_actions.table.action_tooltip}"><Label text="{i18n&gt;configuration.tile_actions.table.action}"/><table:template><commons:TextField value="{action}" enabled="{isTargetTypeIntent}"/></table:template></table:Column><table:Column id="icon" width="110px" tooltip="{i18n&gt;configuration.tile_actions.table.icon_tooltip}"><Label text="{i18n&gt;configuration.tile_actions.table.icon}"/><table:template><Input value="{icon}" placeholder="sap-icon://inbox" enabled="{/config/editable}" valueState="{iconValueState}" valueStateText="{iconValueStateText}" liveChange="onConfigurationInputChange" valueHelpRequest="onTileActionIconValueHelp" showValueHelp="true"/></table:template></table:Column></table:Table><Label/><commonsLayout:MatrixLayout><commonsLayout:MatrixLayoutRow><commonsLayout:MatrixLayoutCell hAlign="End"><commons:Button id="addRow" text="{i18n&gt;configuration.tile_actions.table.add}" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.tile_actions.table.add_tooltip}" press="addRow" width="100px"/><commons:Button id="deleteRow" text="{i18n&gt;configuration.tile_actions.table.remove}" enabled="{/config/editable}" tooltip="{i18n&gt;configuration.tile_actions.table.remove_tooltip}" press="deleteRow" width="100px"/></commonsLayout:MatrixLayoutCell></commonsLayout:MatrixLayoutRow></commonsLayout:MatrixLayout></form:content></form:SimpleForm><HBox visible="false"><Dialog id="selectIconDialog" class="sapContrastPlus" leftButton="ok" rightButton="cancel" title="{i18n&gt;configuration.select_icon}"><content><layout:ResponsiveFlowLayout id="icons"/><HBox visible="true"><Button id="ok" enabled="{/config/ok.enabled}" text="{i18n&gt;configuration.ok}"/><Button id="cancel" text="{i18n&gt;configuration.cancel}" press="onSelectIconClose"/></HBox></content></Dialog></HBox></core:View>',
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/manifest.json":'{"_version":"1.1.0","sap.flp":{"type":"tile","tileSize":"1x1"},"sap.app":{"id":"sap.ushell.demotiles.abap.customTileDynamic","_version":"1.0.0","type":"application","applicationVersion":{"version":"1.0.0"},"title":"Custom Dynamic App Launcher","description":"Custom Tile","tags":{"keywords":[]},"ach":"CA-UI2-INT-FE"},"sap.ui":{"_version":"1.1.0","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","componentName":"sap.ushell.demotiles.abap.customTileDynamic","dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}},"models":{},"rootView":{"viewName":"sap.ushell.demotiles.abap.customTileDynamic.DynamicTile","type":"JS"},"handleValidation":false}}'
},"sap_ushell_demotiles_abap_customTileDynamic/Component-preload"
);
//# sourceMappingURL=Component-preload.js.map