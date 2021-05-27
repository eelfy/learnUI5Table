/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var M={apiVersion:2,extendMicroChartRenderer:function(a){a._renderNoData=function(r,c){if(!c.getHideOnNoData()){r.openStart("div",c);this._writeMainProperties(r,c);r.openEnd();r.openStart("div");r.class("sapSuiteUiMicroChartNoData");r.openEnd();r.openStart("div");r.class("sapSuiteUiMicroChartNoDataTextWrapper");r.openEnd();var R=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");var t=R.getText("NO_DATA");r.openStart("span").openEnd();r.text(t);r.close("span");r.close("div");r.close("div");r.close("div");}};a._renderActiveProperties=function(r,c){var i=c.hasListeners("press");if(i){if(c._hasData()){r.class("sapSuiteUiMicroChartPointer");}r.attr("tabindex","0");}};}};return M;},true);
