/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var G={apiVersion:2};G.render=function(r,c){r.openStart("div",c);r.class("sapGanttContainer");r.style("width",c.getWidth());r.style("height",c.getHeight());r.openEnd();this.renderSvgDefs(r,c);this.renderToolbar(r,c);this.renderGanttCharts(r,c);if(c.getEnableStatusBar()){this.renderStatusBar(r,c);}r.close("div");};G.renderSvgDefs=function(r,c){var s=c.getSvgDefs();if(s){r.openStart("svg",c.getId()+"-svg-psdef");r.attr("aria-hidden","true");r.attr("tabindex",-1);r.attr("focusable",false);r.class("sapGanttInvisiblePaintServer");r.openEnd();r.unsafeHtml(s.getDefString());r.close("svg");}};G.renderToolbar=function(r,c){var t=c.getToolbar();if(t){r.openStart("div");r.class("sapGanttContainerTbl");r.openEnd();r.renderControl(t);r.close("div");}};G.renderStatusBar=function(r,c){var s=c.getStatusBar();if(s){r.openStart("div");r.class("sapGanttContainerStatusBar");r.openEnd();r.renderControl(s);r.close("div");}};G.renderGanttCharts=function(r,c){r.openStart("div",c.getId()+"-ganttContainerContent");if(c.getEnableStatusBar()){r.class("sapGanttContainerCntWithStatusBar");}else{r.class("sapGanttContainerCnt");}r.openEnd();r.renderControl(c._oSplitter);r.close("div");};return G;},true);
