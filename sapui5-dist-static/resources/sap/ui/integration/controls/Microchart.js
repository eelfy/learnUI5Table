/*!
* OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/m/library","sap/ui/core/Control","sap/ui/core/Core"],function(l,C,a){"use strict";var B,b,S,c;var V=l.ValueColor;var M=C.extend("sap.ui.integration.controls.Microchart",{metadata:{library:"sap.ui.integration",properties:{displayValue:{type:"string"},valueColor:{type:"sap.m.ValueColor",defaultValue:V.Neutral}},aggregations:{chart:{type:"sap.ui.core.Control",multiple:false}}},renderer:{apiVersion:2,render:function(r,m){var v="sapUiIntMicrochartValue"+m.getValueColor();r.openStart("div",m).class("sapUiIntMicrochartChartWrapper").openEnd();r.openStart("div").class("sapUiIntMicrochartChart").openEnd().renderControl(m.getChart()).close("div");r.openStart("div").class("sapMSLIInfo").class(v).openEnd().text(m.getDisplayValue()).close("div");r.close("div");}}});M.loadDependencies=function(){return new Promise(function(r,d){a.loadLibrary("sap.suite.ui.microchart",{async:true}).then(function(){sap.ui.require(["sap/suite/ui/microchart/BulletMicroChart","sap/suite/ui/microchart/BulletMicroChartData","sap/suite/ui/microchart/StackedBarMicroChart","sap/suite/ui/microchart/StackedBarMicroChartBar"],function(_,e,f,g){B=_;b=e;S=f;c=g;r();},function(e){d(e);});}).catch(function(){d("The usage of Microcharts is not available with this distribution.");});});};M.create=function(o){var m,d;if(o.type==="Bullet"){var t=[];if(o.thresholds){t=o.thresholds.map(function(T){return new b({value:T.value,color:T.color});});}d=new B({size:"Responsive",minValue:o.minValue,maxValue:o.maxValue,targetValue:o.target,showTargetValue:!!o.target,scaleColor:"Light",scale:o.scale,actual:new b({value:o.value,color:o.color}),thresholds:t});m=new M({valueColor:o.color,displayValue:o.displayValue,chart:d});}if(o.type==="StackedBar"){var e=o.bars.map(function(f){return new c({value:f.value,displayValue:f.displayValue,valueColor:f.color});});d=new S({size:"Responsive",bars:e,maxValue:o.maxValue});m=new M({displayValue:o.displayValue,chart:d});}return m;};return M;});
