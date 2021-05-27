// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/library"],function(U,c){"use strict";var V=c.mvc.ViewType;return U.extend("sap.ushell.components.tiles.cdm.applauncherdynamic.Component",{metadata:{},createContent:function(){var C=this.getComponentData();var p=C.properties||{};var P=p.tilePersonalization||{};var i=p.indicatorDataSource;if(i&&i.path){P.serviceUrl=i.path;P.serviceRefreshInterval=i.refresh;}var s=C.startupParameters;if(s&&s["sap-system"]&&s["sap-system"][0]){P["sap-system"]=s["sap-system"][0];}if(P.serviceUrl&&P.serviceUrl.charAt(0)!=="/"&&p.dataSource&&p.dataSource.uri){var S=p.dataSource.uri;if(P["sap-system"]){if(S.charAt(S.length-1)==="/"){S=S.slice(0,S.length-1);}S+=";o="+P["sap-system"];}if(S.charAt(S.length-1)!=="/"){S+="/";}S+=P.serviceUrl;P.serviceUrl=S;}var t=sap.ui.view({type:V.JS,viewName:"sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",viewData:{properties:p,configuration:P},async:true});this.oPromise=t.loaded().then(function(v){this._oController=v.getController();this._oController.visibleHandler(this.bIsVisible);return v;}.bind(this));return t;},tileSetVisualProperties:function(n){if(this._oController){this._oController.updateVisualPropertiesHandler(n);}},tileRefresh:function(){if(this._oController){this._oController.refreshHandler();}},tileSetVisible:function(i){if(this._oController){this._oController.visibleHandler(i);}else{this.bIsVisible=i;}},exit:function(){this._oController=null;}});});