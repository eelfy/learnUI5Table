/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape","./BaseRectangle","sap/gantt/misc/Format"],function(B,a,F){"use strict";var U=B.extend("sap.gantt.simple.UtilizationChart",{metadata:{library:"sap.gantt","abstract":true,properties:{height:{type:"sap.gantt.SVGLength",defaultValue:"inherit"},overConsumptionMargin:{type:"float",defaultValue:25.0},overConsumptionColor:{type:"sap.gantt.ValueSVGPaintServer",defaultValue:"red"},remainCapacityColor:{type:"sap.gantt.ValueSVGPaintServer",defaultValue:"lightgray"}}},renderer:{apiVersion:2}});U.prototype.getX=function(){return this.getXByTime(this.getTime());};U.prototype.getWidth=function(){return Math.abs(this.getXByTime(this.getEndTime())-this.getX());};U.prototype.getHeight=function(){return a.prototype.getHeight.apply(this);};U.prototype.toX=function(t){return this.getAxisTime().timeToView(F.abapTimestampToDate(t));};U.prototype.renderRectangleWithAttributes=function(r,A,t){r.openStart("rect");Object.keys(A).forEach(function(n){r.attr(n,A[n]);});r.openEnd();if(t){r.openStart("title").openEnd();r.text(t,true);r.close("title");}r.close("rect");};return U;},true);
