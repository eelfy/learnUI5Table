/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Control","sap/ui/Device","sap/ui/core/Core","./GanttUtils"],function(l,C,D,a,G){"use strict";var b=C.extend("sap.gantt.simple.GanttSyncedControl",{metadata:{library:"sap.gantt",properties:{innerWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"}}},renderer:{apiVersion:2,render:function(r,c){var g=c.getParent().getParent();r.openStart("div",c);r.class("sapGanttBackground");r.openEnd();r.openStart("div",g.getId()+"-ganttBGFlexContainer");r.class("sapGanttBackgroundFlexContainer");r.openEnd();r.openStart("div",g.getId()+"-ganttBGContainerWithScrollBar");r.class("sapGanttBackgroundContainer").class("sapGanttBackgroundScrollbar");r.openEnd();r.openStart("div",g.getId()+"-ganttSyncedControlTable");r.class("sapGanttBackgroundTable");r.openEnd();c.renderGanttHeaderPlaceholder(r,g);c.renderGanttBodyPlaceholder(r,g);c.renderHorizontalScrollbarContainer(r,g);r.close("div");r.close("div");c.renderVerticalScrollbarContainer(r,c,g);r.close("div");r.close("div");}}});b.prototype.init=function(){this.oSyncInterface=null;this.state={rows:[],innerVerticalScrollPosition:0,horizontalScrollPosition:0,layout:{top:0,headerHeight:0,contentHeight:0}};this._bRowsHeightChanged=false;this._bAllowContentScroll=true;};b.prototype.onAfterRendering=function(){var d=this.getDomRefs();var g=this.getParent().getParent();if(this.oSyncInterface){var r=a.createRenderManager();this.oSyncInterface.renderHorizontalScrollbar(r,g.getId()+"-hsb",g.getContentWidth());r.flush(d.hsbContainer);}if(this.oSyncInterface&&d.content&&d.vsbContainerContent){this.oSyncInterface.registerVerticalScrolling({wheelAreas:[d.content],touchAreas:[d.content]});this.oSyncInterface.placeVerticalScrollbarAt(d.vsbContainerContent);}this.updateScrollPositions();};b.prototype.renderGanttHeaderPlaceholder=function(r,g){r.openStart("div",g.getId()+"-ganttHeader");r.style("height",(this.state.layout.top+this.state.layout.headerHeight)+"px");r.attr("data-sap-ui-related",g.getId());r.class("sapGanttChartWithTableHeader");r.openEnd();r.close("div");};b.prototype.renderGanttBodyPlaceholder=function(r,g){r.openStart("div",g.getId()+"-sapGanttBackgroundTableContent");r.class("sapGanttBackgroundTableContent");r.style("height",this.state.layout.contentHeight+"px");r.openEnd();r.openStart("div",g.getId()+"-gantt");r.attr("data-sap-ui-related",g.getId());r.class("sapGanttChartContentBody");r.class("sapGanttBackgroundSVG");r.openEnd();this.renderSvgDefs(r,g);this.renderGanttChartCnt(r,g);r.close("div");r.close("div");};b.prototype.renderVerticalScrollbarContainer=function(r,c,g){r.openStart("div",g.getId()+"-sapGanttVerticalScrollBarContainer");r.class("sapGanttBackgroundVScrollContainer");r.openEnd();r.openStart("div");r.class("sapGanttBackgroundVScrollContentArea");r.style("margin-top",(c.state.layout.top+c.state.layout.headerHeight)+"px");r.openEnd().close("div");r.close("div");};b.prototype.syncWith=function(t){var e=t.getParent()._oExpandModel;t._enableSynchronization().then(function(s){this.oSyncInterface=s;s.rowCount=function(c){var o=this.state.rows.length;var i;if(o<c){for(i=0;i<c-o;i++){this.state.rows.push({height:0,selected:false,hovered:false});}}else if(o>c){for(i=o-1;i>=c;i--){this.state.rows.pop();}}}.bind(this);s.rowSelection=function(i,S){if(this.state.rows[i]){this.state.rows[i].selected=S;G.updateGanttRows(this,this.state.rows,i);}}.bind(this);s.rowHover=function(i,h){if(this.state.rows[i]){this.state.rows[i].hovered=h;G.updateGanttRows(this,this.state.rows,i);}}.bind(this);s.rowHeights=function(h){var g=this.getParent().getParent();var r=g.getTable().getRows();for(var i=0;i<=h.length-1;i++){if(g.oRowsCustomHeight){var R=r[i].getAggregation("_settings").getRowId();if(g.oRowsCustomHeight.hasOwnProperty(R)&&g.oRowsCustomHeight[R]>h[i]){h[i]=g.oRowsCustomHeight[R];}}h[i]=e.getRowHeightByIndex(t,i,h[i]);}if(g.getDisplayType()===l.simple.GanttChartWithTableDisplayType.Chart){return h;}this.setRowsHeightChanged(false);h.forEach(function(H,I){if(!this.state.rows[I]){this.state.rows[I]={};}if(this.state.rows[I].height!==H){this.setRowsHeightChanged(true);}this.state.rows[I].height=H;}.bind(this));if(this.getRowsHeightChanged()&&g.getDisplayType()!==l.simple.GanttChartWithTableDisplayType.Table){g.getInnerGantt().invalidate();}return h;}.bind(this);s.innerVerticalScrollPosition=function(S){this.state.innerVerticalScrollPosition=S;this.updateScrollPositions();}.bind(this);s.layout=function(L){this.state.layout=L;this.updateLayout();var g=this.getParent().getParent();var d=this.getDomRefs();var i=false;if(g._getResizeExtension){i=g._getResizeExtension().isResizing();}var h=d.header.style.height.split("px")[0];if(g){var c=g.getAggregation("_header")._getIHeaderHeightInitial();if(parseInt(h,10)!==c&&!i){g.getAggregation("_header").renderElement();if(g._getScrollExtension&&g._getScrollExtension.mOffsetWidth){g._getScrollExtension().scrollGanttChartToVisibleHorizon();}}}}.bind(this);this.invalidate();}.bind(this));};b.prototype.renderHorizontalScrollbarContainer=function(r,g){r.openStart("div",g.getId()+"-horizontalScrollContainer");r.class("sapGanttHSBContainer");r.openEnd();r.close("div");};b.prototype.renderSvgDefs=function(r,g){var s=g.getSvgDefs();if(s){r.openStart("svg",g.getId()+"-svg-psdef");r.attr("aria-hidden","true");r.style("float","left");r.style("width","0px");r.style("height","0px");r.openEnd();r.unsafeHtml(s.getDefString());r.close("svg");}};b.prototype.renderGanttChartCnt=function(r,g){r.openStart("div",g.getId()+"-cnt");r.class("sapGanttChartCnt");r.style("height","100%");r.style("width","100%");r.openEnd();r.close("div");};b.prototype.setInnerWidth=function(w){this.setProperty("innerWidth",w,true);this._toggleHSBVisibility(w);return this;};b.prototype._toggleHSBVisibility=function(w){var d=this.getDomRefs();if(d.hsb==null||d.hsbContent==null){return;}var s=(parseFloat(w)+2)>jQuery(d.contentContainer).width();if(s){d.hsbContent.style.height=null;d.hsbContent.style.width=w;}else{d.hsbContent.style.cssText=null;if(D.browser.msie){d.hsbContent.style.width=0;}}};b.prototype.addEventListeners=function(){this.addScrollEventListeners();};b.prototype.addScrollEventListeners=function(){var t=this;this.oHSb.addEventListener("scroll",function(e){t.state.horizontalScrollPosition=e.target.scrollLeft;});};b.prototype.updateLayout=function(){var d=this.getDomRefs();if(d){d.header.style.height=(this.state.layout.top+this.state.layout.headerHeight)+"px";d.contentContainer.style.height=this.state.layout.contentHeight+"px";d.vsbContainerContent.style.marginTop=(this.state.layout.top+this.state.layout.headerHeight)+"px";}};b.prototype.updateScrollPositions=function(){var d=this.getDomRefs();if(d&&this._bAllowContentScroll){d.content.scrollTop=this.state.innerVerticalScrollPosition;if(d.content.scrollTop!==this.state.innerVerticalScrollPosition){this._bAllowContentScroll=false;}}};b.prototype.setAllowContentScroll=function(A){this._bAllowContentScroll=A;};b.prototype.setRowsHeightChanged=function(r){this._bRowsHeightChanged=r;};b.prototype.getRowsHeightChanged=function(r){return this._bRowsHeightChanged;};b.prototype.scrollContentIfNecessary=function(){if(this._bAllowContentScroll===false){this._bAllowContentScroll=true;this.updateScrollPositions();}};b.prototype.getDomRefs=function(){var d=this.getDomRef();if(!d){return null;}var h=d.querySelector(".sapGanttChartWithTableHeader"),c=d.querySelector(".sapGanttBackgroundTableContent"),o=c.querySelector(".sapGanttChartContentBody");var v=d.querySelector(".sapGanttBackgroundVScrollContainer"),V=v.querySelector(".sapGanttBackgroundVScrollContentArea");var H=d.querySelector(".sapGanttHSBContainer");var e=d.querySelector(".sapUiTableHSbExternal"),f=d.querySelector(".sapUiTableHSbContent");return{header:h,contentContainer:c,content:o,vsbContainer:v,vsbContainerContent:V,hsbContainer:H,hsb:e,hsbContent:f};};b.prototype.getRowStates=function(){return this.state.rows;};b.prototype.getRowHeights=function(){return this.state.rows.map(function(r){return r.height;});};b.prototype.syncRowSelection=function(i){if(i>-1){var s=!this.state.rows[i].selected;this.oSyncInterface.syncRowSelection(i,s);}};b.prototype.syncRowHover=function(i,h){if(i>-1){this.oSyncInterface.syncRowHover(i,h);}};return b;});
