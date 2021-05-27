/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/Device'],function(R,D){"use strict";return{_appendHeightAndWidth:function(n,r){r.style("height",n.getHeight());r.style("width",n.getWidth());},apiVersion:2,render:function(r,n){r.openStart("div",n);r.class("sapSuiteUiCommonsNetworkGraphMap");this._appendHeightAndWidth(n,r);r.openEnd();r.openStart("div");r.class("sapSuiteUiCommonsNetworkGraphMapTitle");r.openEnd();r.openStart("span");r.class("sapSuiteUiCommonsNetworkGraphMapTitleText");r.openEnd();r.text(n.getTitle());r.close("span");r.close("div");r.openStart("div");r.class("sapSuiteUiCommonsNetworkGraphMapContent");if(D.browser.msie){if(n.getHeight()){r.style("flex-direction","row-reverse");r.style("height","100%");}else{r.style("flex-direction","row-reverse");}}else{if(n.getHeight()){r.style("height","100%");}}r.openEnd();r.close("div");r.close("div");}};},true);
