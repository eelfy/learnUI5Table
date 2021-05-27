/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var S={};S.CSS_CLASS="sapVizSlider";S.render=function(r,s){var e=s.getEnabled(),t=s.getTooltip_AsString(),C=S.CSS_CLASS;r.write("<div");this.addClass(r,s);if(!e){r.addClass(C+"Disabled");}r.addStyle("width",s.getWidth());r.writeClasses();r.writeStyles();r.writeControlData(s);if(t&&s.getShowHandleTooltip()){r.writeAttributeEscaped("title",t);}r.write(">");r.write('<div');r.writeAttribute("id",s.getId()+"-inner");this.addInnerClass(r,s);if(!e){r.addClass(C+"InnerDisabled");}r.writeClasses();r.writeStyles();r.write(">");if(s.getProgress()){this.renderProgressIndicator(r,s);}this.renderHandles(r,s);r.write("</div>");if(s.getEnableTickmarks()){this.renderTickmarks(r,s);}else{this.renderLabels(r,s);}if(s.getName()){this.renderInput(r,s);}r.write("</div>");};S.renderProgressIndicator=function(r,s){r.write("<div");r.writeAttribute("id",s.getId()+"-progress");this.addProgressIndicatorClass(r,s);r.addStyle("width",s._sProgressValue);r.writeClasses();r.writeStyles();r.write(' aria-hidden="true"></div>');};S.renderHandles=function(r,s){this.renderHandle(r,s,{id:s.getId()+"-handle"});if(s.getShowAdvancedTooltip()){this.renderTooltips(r,s);}};S.renderHandle=function(r,s,o){var e=s.getEnabled();r.write("<span");if(o&&(o.id!==undefined)){r.writeAttributeEscaped("id",o.id);}if(s.getShowHandleTooltip()&&!s.getShowAdvancedTooltip()){this.writeHandleTooltip(r,s);}this.addHandleClass(r,s);r.addStyle(sap.ui.getCore().getConfiguration().getRTL()?"right":"left",s._sProgressValue);this.writeAccessibilityState(r,s);r.writeClasses();r.writeStyles();if(e){r.writeAttribute("tabindex","0");}r.write("></span>");};S.renderTooltips=function(r,s){r.write("<div");r.writeAttribute("id",s.getId()+"-TooltipsContainer");r.addClass(S.CSS_CLASS+"TooltipContainer");r.addStyle("left","0%");r.addStyle("right","0%");r.addStyle("min-width","0%");r.writeClasses();r.writeStyles();r.write(">");this.renderTooltip(r,s,s.getInputsAsTooltips());r.write("</div>");};S.renderTooltip=function(r,s,i){if(i&&s._oInputTooltip){r.renderControl(s._oInputTooltip.tooltip);}else{r.write("<span");r.addClass(S.CSS_CLASS+"HandleTooltip");r.addStyle("width",s._iLongestRangeTextWidth+"px");r.writeAttribute("id",s.getId()+"-Tooltip");r.writeClasses();r.writeStyles();r.write(">");r.write("</span>");}};S.writeHandleTooltip=function(r,s){r.writeAttribute("title",s.toFixed(s.getValue()));};S.renderInput=function(r,s){r.write('<input type="text"');r.writeAttribute("id",s.getId()+"-input");r.addClass(S.CSS_CLASS+"Input");if(!s.getEnabled()){r.write("disabled");}r.writeClasses();r.writeAttributeEscaped("name",s.getName());r.writeAttribute("value",s.toFixed(s.getValue()));r.write(">");};S.writeAccessibilityState=function(r,s){r.writeAccessibilityState(s,{role:"slider",orientation:"horizontal",valuemin:s.toFixed(s.getMin()),valuemax:s.toFixed(s.getMax()),valuenow:s.toFixed(s.getValue())});};S.renderTickmarks=function(r,s){var i,t,T,l,f,a,b,o=s.getAggregation("scale");if(!s.getEnableTickmarks()||!o){return;}a=Math.abs(s.getMin()-s.getMax());b=s.getStep();l=o.getTickmarksBetweenLabels();t=o.calcNumTickmarks(a,b,s._CONSTANTS.TICKMARKS.MAX_POSSIBLE);T=s._getPercentOfValue(o.calcTickmarksDistance(t,s.getMin(),s.getMax(),b));r.write("<ul class=\""+S.CSS_CLASS+"Tickmarks\">");this.renderTickmarksLabel(r,s,s.getMin());for(i=0;i<t;i++){if(l&&i>0&&(i%l===0)){f=i*T;this.renderTickmarksLabel(r,s,s._getValueOfPercent(f));}r.write("<li class=\""+S.CSS_CLASS+"Tick\" style=\"width: "+T+"%;\"></li>");}r.write("<li class=\""+S.CSS_CLASS+"Tick\" style=\"width: 0%;\"></li>");this.renderTickmarksLabel(r,s,s.getMax());r.write("</ul>");};S.renderTickmarksLabel=function(r,s,v){var o=s._getPercentOfValue(v);var l=sap.ui.getCore().getConfiguration().getRTL()?"right":"left";v=s.toFixed(v,s.getDecimalPrecisionOfNumber(s.getStep()));r.write("<li class=\""+S.CSS_CLASS+"TickLabel\"");r.addStyle(l,(o+"%"));r.writeStyles();r.write(">");r.write("<div class=\""+S.CSS_CLASS+"Label\">");r.writeEscaped(""+v);r.write("</div>");r.write("</li>");};S.addClass=function(r,s){r.addClass(S.CSS_CLASS);};S.addInnerClass=function(r,s){r.addClass(S.CSS_CLASS+"Inner");};S.addProgressIndicatorClass=function(r,s){r.addClass(S.CSS_CLASS+"Progress");};S.addHandleClass=function(r,s){r.addClass(S.CSS_CLASS+"Handle");};S.renderLabels=function(r,s){};return S;},true);
