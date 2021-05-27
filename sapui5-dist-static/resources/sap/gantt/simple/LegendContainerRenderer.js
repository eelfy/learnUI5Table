/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var L={apiVersion:2};L.render=function(r,c){r.openStart("div",c);r.class("sapGanttChartLegend");r.style("width",c.getWidth());r.style("height",c.getHeight());r.openEnd();r.renderControl(c._oNavContainer);r.close("div");};return L;},true);
