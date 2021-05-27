// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_VisualizationInstantiation/VizInstance","sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap","sap/ushell/services/_VisualizationInstantiation/VizInstanceCdm","sap/ushell/services/_VisualizationInstantiation/VizInstanceLaunchPage","sap/ushell/services/_VisualizationInstantiation/VizInstanceLink","sap/m/library","sap/ushell/library","sap/base/util/ObjectPath","sap/ushell/EventHub","sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations"],function(V,a,b,c,d,M,u,O,E,r){"use strict";var L=M.LoadState;var D=u.DisplayFormat;function e(){}e.prototype.instantiateVisualization=function(v,f){var o;var p=O.get("_instantiationData.platform",v);var s=O.get(["sap.flp","vizOptions","displayFormats","supported"],f);var m=s||[D.Standard,D.Compact];var g={title:v.title,subtitle:v.subtitle,info:v.info,icon:v.icon,keywords:v.keywords,instantiationData:v._instantiationData,indicatorDataSource:v.indicatorDataSource,dataSource:v.dataSource,contentProviderId:v.contentProviderId,vizConfig:v.vizConfig,supportedDisplayFormats:m,displayFormat:this._getDisplayFormat(v.displayFormatHint,m),tileSize:O.get(["sap.flp","tileSize"],f),numberUnit:v.numberUnit,dataHelpId:v.vizId};if(g.indicatorDataSource){g.indicatorDataSource.ui5object=true;}if((p==="ABAP"||p==="CDM")&&g.displayFormat===D.Compact){this._cleanInstantiationDataForLink(g);p="LINK";}switch(p){case"ABAP":o=new a(g);break;case"CDM":o=new b(g);break;case"LINK":o=new d(g);break;case"LAUNCHPAGE":o=new c(g);break;default:return new V({state:L.Failed});}o.setTargetURL(v.targetURL);if(r.isStandardVizType(v.vizType)){try{o.load().then(function(){E.emit("VizInstanceLoaded",v.id);});}catch(h){o.setState(L.Failed);E.emit("VizInstanceLoaded",v.id);}}else{o.setState(L.Loading);E.once("CoreResourcesComplementLoaded").do(function(){try{o.load().then(function(){o.setState(L.Loaded);});}catch(h){o.setState(L.Failed);}});}return o;};e.prototype._cleanInstantiationDataForLink=function(v){delete v.info;delete v.icon;delete v.keywords;delete v.instantiationData;delete v.dataSource;delete v.contentProviderId;delete v.vizConfig;delete v.numberUnit;delete v.indicatorDataSource;delete v.tileSize;};e.prototype._getDisplayFormat=function(s,S){return S.indexOf(s)>-1?s:D.Standard;};e.hasNoAdapter=true;return e;});