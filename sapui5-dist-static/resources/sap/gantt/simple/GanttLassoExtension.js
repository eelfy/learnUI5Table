/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes","./GanttExtension","./CoordinateUtils"],function(q,K,G,C){"use strict";var _=".sapGanttLasso";var L={addEventListeners:function(g){this.removeEventListeners(g);var e=g._getLassoExtension();e.lassoDoms().rowArea.on("mousedown"+_,e.beforeLasso.bind(e));},removeEventListeners:function(g){var e=g._getLassoExtension();e.lassoDoms().rowArea.off(_);},addLassoEventListeners:function(g){this.removeLassoEventListeners(g);var e=g._getLassoExtension();var $=q(e.getDomRefs().gantt);$.on("mousemove"+_,e.onMousemove.bind(e));$.on("mouseup"+_,e.endLasso.bind(e));$.on("mouseleave"+_,e.endLasso.bind(e));$.on("keydown"+_,e.onKeydown.bind(e));},removeLassoEventListeners:function(g){var e=g._getLassoExtension();q(e.getDomRefs().gantt).off(_);}};var a=G.extend("sap.gantt.simple.GanttLassoExtension",{_init:function(g,s){this._initLassoStates();return"LassoExtension";},_attachEvents:function(){var g=this.getGantt();L.addEventListeners(g);},_detachEvents:function(){var g=this.getGantt();L.removeEventListeners(g);}});a.prototype._initLassoStates=function(){this.mDom={};this._oLassoStartPoint={};this._bLassoDrawing=false;};a.prototype.getSvgElement=function(){return this.getDomRefs().ganttSvg;};a.prototype._getShapeConnectRootNode=function(){var $=this.lassoDoms().lasso;return d3.select($.get(0));};a.prototype.rect=function(x,y,w,h){return"M"+[x,y]+" l"+[w,0]+" l"+[0,h]+" l"+[-w,0]+"z";};a.prototype._getLassoData=function(s){var l=this._oLassoStartPoint.x<s.x?this._oLassoStartPoint.x:s.x;var i=this._oLassoStartPoint.x>s.x?this._oLassoStartPoint.x:s.x;var b=this._oLassoStartPoint.y<s.y?this._oLassoStartPoint.y:s.y;var c=this._oLassoStartPoint.y>s.y?this._oLassoStartPoint.y:s.y;var o={"class":"lassoRect",d:this.rect(l,b,i-l,c-b),fill:"#9bdaff",stroke:"#4da5ff","fill-opacity":0.5,"stroke-width":2};return o;};a.prototype.createLasso=function(s){var l=this._getLassoData(s);if(this.getD3Doms().lassoRect.empty()){var S=this._getShapeConnectRootNode();S.append("path").attr(l);}};a.prototype.isLassoDrawing=function(){return this._bLassoDrawing;};a.prototype.beforeLasso=function(e){var g=this.getGantt();if((g.getSelection().sSelectionMode!==sap.gantt.SelectionMode.MultiWithKeyboardAndLasso)&&(g.getSelection().sSelectionMode!==sap.gantt.SelectionMode.MultipleWithLasso)){return;}var s=this.getSvgElement();var S=C.getEventSVGPoint(s,e);this._oLassoStartPoint={x:S.x,y:S.y};if((g.getSelection().sSelectionMode===sap.gantt.SelectionMode.MultiWithKeyboardAndLasso)&&!e.ctrlKey){g.setSelectedShapeUid([]);}L.addLassoEventListeners(g);};a.prototype.onMousemove=function(e){if(!this.isLassoDrawing()){this._bLassoDrawing=true;var s=this.getSvgElement();var S=C.getEventSVGPoint(s,e);this.createLasso(S);this.mDom.lassoRect=this.lassoDoms().lassoRect;}else{this.onLassoDrawing(e);}};a.prototype.onLassoDrawing=function(e){var s=this.getSvgElement();var S=C.getEventSVGPoint(s,e);var l=this._getLassoData(S);this.mDom.lassoRect.attr(l);};a.prototype.shapeInLasso=function(s,S,i,b,l,c,d,e){if((s>=l&&s<=c&&i>=d&&i<=e)||(S>=l&&S<=c&&i>=d&&i<=e)||(s>=l&&s<=c&&b>=d&&b<=e)||(S>=l&&S<=c&&b>=d&&b<=e)||(s<=l&&S>=c&&i>=d&&i<=e)||(s<=l&&S>=c&&b>=d&&b<=e)||(s>=l&&s<=c&&b>=e&&i<=d)||(S>=l&&S<=c&&b>=e&&i<=d)){return true;}return false;};a.prototype.getShapeElementByTarget=function(t,e){return q(e.getDraggableDOMElement(t)).control(0,true);};a.prototype.getDraggableDOMElement=function(t){return q(t).closest("[data-sap-gantt-shape-id]").get(0);};a.prototype.endLasso=function(e){var g=this.getGantt();var E=g._getLassoExtension();if(this.isLassoDrawing()){var s=this._getShapeConnectRootNode();s.selectAll("*").remove();}L.removeLassoEventListeners(this.getGantt());var S=this.getSvgElement();var o=C.getEventSVGPoint(S,e);var b=g._getLassoExtension()._oLassoStartPoint;var l=b.x<o.x?b.x:o.x;var c=b.x>o.x?b.x:o.x;var d=b.y<o.y?b.y:o.y;var f=b.y>o.y?b.y:o.y;var h,j,k,m,n;var I=g.getEnableLassoInvert();var p=g.getSelectedShapeUid();var A=I?[]:p;var r=[];var $=q(S);var v=q($.find(".sapGanttChartShapes")).find(".baseShapeSelection").toArray();var V=q($.find(".sapGanttChartRls")).find(".baseShapeSelection").toArray();v.forEach(function(B,i){n=E.getShapeElementByTarget(B,E);h=B.getBBox().x;j=h+B.getBBox().width;k=B.getBBox().y;m=k+B.getBBox().height;var u=E.shapeInLasso(h,j,k,m,l,c,d,f);var w=n?p.indexOf(n.getShapeUid()):0;var x=w===-1?false:true;if(u){if(n&&!x&&(A.indexOf(n.getShapeUid())===-1)){A.push(n.getShapeUid());}else if(I&&n&&x){r.push(n.getShapeUid());}}else if(I&&n&&x){A.push(n.getShapeUid());}if(n){v[i]=n.getShapeUid();}});V.forEach(function(B,i){n=E.getShapeElementByTarget(B,E);if(I&&n&&(p.indexOf(n.getShapeUid())!==-1)){A.push(n.getShapeUid());}if(n){V[i]=n.getShapeUid();}});if(I){p.forEach(function(B){if((v.indexOf(B)===-1)&&(V.indexOf(B)===-1)){A.push(B);}});}var t=[];A.forEach(function(B){if((t.indexOf(B)===-1)&&(r.indexOf(B)===-1)){t.push(B);}});this._initLassoStates();g.setSelectedShapeUid(t);};a.prototype.onKeydown=function(e){if(this.isLassoDrawing()&&e.keyCode===K.ESCAPE){this.endLasso(e);}};a.prototype.lassoDoms=function(){var $=q(this.getSvgElement());var b=$.find("g.sapGanttChartLasso");var c=$.find("rect.sapGanttBackgroundSVGRow");return{lassoRect:b.find(".lassoRect"),rowArea:c,lasso:b};};a.prototype.getD3Doms=function(){var n=this._getShapeConnectRootNode();return{lassoRect:n.selectAll(".lassoRect")};};return a;});
