/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Core","./BaseShape","./GanttUtils","sap/ui/Device"],function(C,B,G,D){"use strict";var a=B.extend("sap.gantt.simple.BaseText",{metadata:{library:"sap.gantt",properties:{text:{type:"string"},x:{type:"float"},y:{type:"float"},fontSize:{type:"int",defaultValue:13},textAnchor:{type:"string",defaultValue:"start"},fontFamily:{type:"string",defaultValue:"Arial"},truncateWidth:{type:"float"},showEllipsis:{type:"boolean",defaultValue:true}}},renderer:{apiVersion:2}});var A=["x","y","text-anchor","style","filter","transform"];a.prototype.getX=function(){var x=G.getValueX(this);if(isNaN(x)&&this.getParent()&&this.getParent().getTime){x=G.getValueX(this.getParent());}return x;};a.prototype.getY=function(){var v=this.getProperty("y");if(v!==null&&v!==undefined){return v;}return this.getRowYCenter()+this.getFontSize()/2;};a.prototype.getStyle=function(){var i=B.prototype.getStyle.apply(this,arguments);var s={"font-size":this.getFontSize()+"px","fill":this.determineValueColor(this.getFill()),"font-family":this.getFontFamily()};return i+this.getInlineStyle(s);};a.prototype.renderElement=function(r,e){this.writeElementData(r,"text",true);if(this.aCustomStyleClasses){this.aCustomStyleClasses.forEach(function(c){r.class(c);});}var R=sap.gantt.simple.RenderUtils;R.renderAttributes(r,e,A);r.openEnd();R.renderTooltip(r,e);if(this.getShowAnimation()){R.renderElementAnimation(r,e);}this.writeTruncatedText(r,e);r.close("text");};a.prototype.writeTruncatedText=function(r,e){var t=e.getText(),T=this.getTruncateWidth()!=null;if(T){var R=this._truncateText(t);this.renderEllipsisIfNecessary(r,R);}else{r.text(t);}};a.prototype.getTruncateWidth=function(){var o=this.getProperty("truncateWidth");var p=this.getParent();if(p&&p.isA("sap.gantt.simple.BaseShape")){var P=0;if(p.getWidth){P=p.getWidth();}else{P=Math.abs(this.getXByTime(p.getEndTime())-this.getXByTime(p.getTime()));}if(P<o){return P;}}return o;};a.prototype.renderEllipsisIfNecessary=function(r,R){if(R.ellipsis){if(G.iRTLModeInIE()){r.text("..."+R.truncatedText);}else{r.text(R.truncatedText+"...");}}else{r.text(R.truncatedText);}};a.prototype._truncateText=function(s){var r=this._processTextForTruncation(s);r=r||{ellipsis:false,truncatedText:s};return r;};a.prototype._processTextForTruncation=function(s){var t=this.getTruncateWidth(),e=this.measureTextWidth("..."),T=this.measureTextWidth(s);if(T>t){var i,S;if(this.getShowEllipsis()&&e<t){S=true;i=t-e;}else{S=false;i=t;}var b;var n=this._geNumberOfTruncatedCharacters(T,i,s);if(C.getConfiguration().getRTL()){var c=s.length-n;b=s.slice(c,s.length).trim();}else{b=s.slice(0,n).trim();}return{ellipsis:S,truncatedText:b};}return null;};a.prototype.getTextAnchor=function(){var o=this.getProperty("textAnchor");return o;};a.prototype._geNumberOfTruncatedCharacters=function(t,T,s){var n=0;if(t>T){if(T>0&&s.length>0){n=Math.round(T/Math.ceil(t/s.length));while(true){if(n<0){break;}var b=this.measureTextWidth(s.slice(0,n));var c=this.measureTextWidth(s.slice(0,n+1));if(b>T){n--;continue;}if(c<T){n++;continue;}break;}}}else{return s?s.length:0;}return(n>=0&&n<=s.length)?n:0;};a.prototype.measureTextWidth=function(t){return G.getShapeTextWidth(t,this.getFontSize(),this.getFontFamily());};return a;},true);
