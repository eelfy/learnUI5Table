/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape","./AggregationUtils","./RenderUtils"],function(B,A,R){"use strict";var a=B.extend("sap.gantt.simple.BaseGroup",{metadata:{library:"sap.gantt",aggregations:{shapes:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"shape"}}},renderer:{apiVersion:2}});var m=["filter","opacity","transform"];a.prototype.renderElement=function(r,g){this.writeElementData(r,"g",false);if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(function(c){r.class(c);});}R.renderAttributes(r,g,m);r.openEnd();R.renderTooltip(r,g);this.renderChildElements(r,g);r.close("g");B.prototype.renderElement.apply(this,arguments);};a.prototype.renderChildElements=function(r,g){this._eachChildOfGroup(g,function(c){if(c.renderElement){c.setProperty("childElement",true,true);c.setProperty("rowYCenter",g.getRowYCenter(),true);c._iBaseRowHeight=g._iBaseRowHeight;c.renderElement(r,c);}});};a.prototype._eachChildOfGroup=function(g,c){A.eachNonLazyAggregation(g,c);};return a;},true);
