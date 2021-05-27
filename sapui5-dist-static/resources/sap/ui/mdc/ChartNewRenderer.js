/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library'],function(l){"use strict";var C={apiVersion:2};C.CSS_CLASS="sapUiMDCChartNew";C.render=function(r,m){r.openStart("div",m);r.attr("id",m.getId());r.openEnd();this.renderToolbar(r,m.getAggregation("_toolbar"));this.renderBreadcrumbs(r,m.getAggregation("_breadcrumbs"));this.renderInnerStructure(r,m.getAggregation("_innerChart"));r.close("div");};C.renderNoDataStruct=function(r,n){if(n){}};C.renderToolbar=function(r,t){if(t){r.openStart("div");r.class("sapUiFixFlexFixed");r.openEnd();r.renderControl(t);r.close("div");}};C.renderBreadcrumbs=function(r,d){if(d){r.renderControl(d);}};C.renderInnerChart=function(r,i){if(i){r.renderControl(i);}};C.renderInnerStructure=function(r,i){r.renderControl(i);};return C;},true);
