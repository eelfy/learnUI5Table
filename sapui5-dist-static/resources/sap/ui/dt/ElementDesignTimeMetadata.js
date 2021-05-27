/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/DesignTimeMetadata","sap/ui/dt/AggregationDesignTimeMetadata","sap/ui/dt/ElementUtil"],function(D,A,E){"use strict";var a=D.extend("sap.ui.dt.ElementDesignTimeMetadata",{metadata:{library:"sap.ui.dt"}});a.prototype.getDefaultData=function(){var d=D.prototype.getDefaultData.apply(this,arguments);d.aggregations={layout:{ignore:true},dependents:{ignore:true},customData:{ignore:true},layoutData:{ignore:true},tooltip:{ignore:true},dragDropConfig:{ignore:true}};return d;};a.prototype.hasAggregation=function(s){return!!this.getAggregations()[s];};a.prototype.getAggregation=function(s){return this.getAggregations()[s];};a.prototype.createAggregationDesignTimeMetadata=function(m){return new A({data:m});};a.prototype.getAggregations=function(){var m=this.getData().aggregations||{};var b=this.getData().associations||{};Object.keys(b).forEach(function(s){var c=b[s];if(c.aggregationLike){m[s]=c;}});return m;};a.prototype.getAggregationNamesWithAction=function(s){var m=this.getAggregations();return Object.keys(m).filter(function(b){return m[b].actions&&m[b].actions[s];});};a.prototype.getActionDataFromAggregations=function(s,e,b,S){var v;var m=this.getAggregations();var c=[];for(var d in m){if(m[d].actions&&m[d].actions[s]){v=m[d].actions[s];if(S){v=v[S];}if(typeof v==="function"){var f=[e];if(b){f=f.concat(b);}v=v.apply(null,f);}if(typeof(v)==="string"){v={changeType:v};}if(v){v.aggregation=d;c.push(v);}}}return c;};a.prototype._getText=function(e,n){if(typeof n==="function"){return n();}return this.getLibraryText(e,n);};a.prototype.getAggregationDescription=function(s,e){var c=this.getAggregation(s).childNames;if(typeof c==="function"){c=c(e);}if(c){return{singular:this._getText(e,c.singular),plural:this._getText(e,c.plural)};}};a.prototype.getName=function(e){var n=this.getData().name;if(typeof n==="function"){n=n(e);}if(n){return{singular:this._getText(e,n.singular),plural:this._getText(e,n.plural)};}};a.prototype.getToolHooks=function(){return this.getData().tool||{start:function(){},stop:function(){}};};a.prototype.isAggregationIgnored=function(e,s){var m=this.getAggregations();var o=m[s];var i=(o)?o.ignore:false;if(!i||(i&&typeof i==="function"&&!i(e))){return false;}return true;};a.prototype.getScrollContainers=function(e,i,u){var s=this.getData().scrollContainers||[];s.forEach(function(S){if(typeof S.aggregations==="function"){S.aggregationsFunction=S.aggregations;S.aggregations=S.aggregations(e,u);}else if(i&&S.aggregationsFunction){S.aggregations=S.aggregationsFunction(e,u);}});return s;};a.prototype.getLabel=function(e){return D.prototype.getLabel.apply(this,arguments)||E.getLabelForElement(e);};a.prototype.getStableElements=function(o){var e=o.getElement();var s;var g=this.getData().getStableElements;if(g){s=g(e);}else{s=[e];}if(!s||!Array.isArray(s)){s=[];}return s;};return a;});
