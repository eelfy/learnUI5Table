/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate"],function(A){"use strict";var C=Object.assign({},A);C.getFilterDelegate=function(){return{addItem:function(p,m){return Promise.resolve(null);}};};C.zoomIn=function(){};C.zoomOut=function(){};C.getZoomState=function(){};C.toggleLegend=function(){};C.getLegendState=function(){};C.getPersonalizationInfo=function(){};C.getSortInfo=function(){};C.initializeInnerChart=function(){};C.getInnerChart=function(){};C.getChartTypeInfo=function(){};C.getDrillStackInfo=function(){};C.createInnerChartContent=function(p){};C.rebindChart=function(m,b){if(m&&m._oInnerChart&&b){m._oInnerChart.bindData(b);}};C.updateBindingInfo=function(m,M,b){};C.addInnerItem=function(p,m,P){return Promise.resolve(null);};C.insertInnerItem=function(p,m,P){};C.removeInnerItem=function(p,m,P){return Promise.resolve(true);};return C;});
