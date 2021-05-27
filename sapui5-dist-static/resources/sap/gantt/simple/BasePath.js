/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape","./RenderUtils"],function(B,R){"use strict";var a=B.extend("sap.gantt.simple.BasePath",{metadata:{library:"sap.gantt",properties:{d:{type:"string"}}},renderer:{apiVersion:2}});var A=["d","fill","stroke-dasharray","transform","style"];a.prototype.renderElement=function(r,e){this.writeElementData(r,"path",true);if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(function(c){r.class(c);});}R.renderAttributes(r,e,A);r.attr("shape-rendering","crispedges");r.openEnd();R.renderTooltip(r,e);if(this.getShowAnimation()){R.renderElementAnimation(r,e);}r.close("path");R.renderElementTitle(r,e);};return a;},true);
