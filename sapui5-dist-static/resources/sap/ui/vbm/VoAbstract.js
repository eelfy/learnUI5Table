/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/core/Element","./library"],function(E,l){"use strict";var V=E.extend("sap.ui.vbm.VoAbstract",{metadata:{library:"sap.ui.vbm",properties:{},events:{}}});V.prototype.isEventRegistered=function(n){var v=this.getItems();if(!v){return false;}for(var a=0,b=v.length;a<b;++a){var i=v[a];if(i.mEventRegistry[n]){return true;}}return false;};V.prototype.findInstance=function(n){var v=this.getItems();if(!v){return false;}var k=(n.indexOf(".")!==-1)?n.split(".")[1]:n;for(var a=0,b=v.length;a<b;++a){if(v[a].sId===k){return v[a];}}return null;};V.prototype.findInstanceByKey=function(n){var v=this.getItems();if(!v){return false;}var k=(n.indexOf(".")!==-1)?n.split(".")[1]:n;for(var a=0,b=v.length;a<b;++a){if(v[a].sId===k||v[a].getKey()===k){return v[a];}}return null;};V.prototype.getActionArray=function(){var a=[];return a;};V.prototype.getTemplateBindingInfo=function(){var b=this.getBindingInfo("items");if(b&&b.template){return b.template.mBindingInfos;}};V.prototype.getBindInfo=function(){var b={};var t=this.getTemplateBindingInfo();b.hasTemplate=(t)?true:false;return b;};V.prototype.getTemplateObject=function(){var t={};t['id']=this.getId();t['datasource']=t.id;return t;};V.prototype.getTypeObject=function(){var t={};t['name']=this.getId();t['key']='K';t.A=[{"name":"K","alias":"K","type":"string"},{"name":"VB:s","alias":"VB:s","type":"boolean"}];return t;};V.prototype.getDataDeltaObject=function(d){var D={};var r=[];var I=this.getItems();D['name']=this.getId();D.E=[];for(var n=0;n<d.length;++n){if(d[n].type=="delete"){r.push(d[n].object);}else if(d[n].type=="insert"){var i=d[n].idx;D.E.push(I[i].getDataElement());}}return{oData:D,aRemoveData:r};};V.prototype.getDataRemoveObject=function(){var d={name:this.getId(),type:"N"};return d;};V.prototype.getDataObject=function(){var d={};d['name']=this.getId();d.E=[];var v=this.getItems();for(var n=0,a=v.length;n<a;++n){d.E.push(v[n].getDataElement());}return d;};V.prototype.openContextMenu=function(t,v,m){this.oParent.openContextMenu(t,v,m);};return V;});
